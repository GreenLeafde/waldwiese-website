/**
 * Auslieferung von Newsletter-Kampagnen über Resend. Bewusst KEINE
 * `"use server"`-Datei: von dort dürfen nur Server-Actions exportiert werden,
 * und diese Funktionen brauchen sowohl das Admin-Backend
 * (`app/actions/newsletter-admin.ts`) als auch der Cron
 * (`app/api/cron/send-scheduled`). NUR server-seitig importieren.
 */

import { Resend } from "resend";
import { SITE } from "@/lib/site";
import {
  wrapEmail,
  emailDocument,
  trackContentLinks,
  trackingPixel,
  personalizeHtml,
  personalizeText,
  mailVars,
  type HeaderStyle,
} from "@/lib/newsletter-shell";
import { getSentEmails, recordSends } from "@/lib/newsletters";
import { getSuppressedEmails } from "@/lib/suppressions";
import { listSubscribed } from "@/lib/contacts";
import { signUnsubscribeToken } from "@/lib/newsletter-token";

/**
 * Basis-URL für alle Links in E-Mails: IMMER die echte Produktiv-Domain —
 * niemals der Request-Host (sonst landen Links auf localhost, wenn das Backend
 * lokal läuft).
 */
export const MAIL_BASE = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE.url
).replace(/\/+$/, "");

export type DeliverContent = {
  subject: string;
  html: string;
  header: { title?: string; tagline?: string; style?: HeaderStyle };
  showHeader: boolean;
  bare: boolean;
  fallbackName: string;
};

export type Recipient = { email: string; name: string | null };

/**
 * Angemeldete Empfänger ohne Gesperrte. Mit `excludeSentOf` (Kampagnen-ID)
 * zusätzlich ohne die, die diese Kampagne schon bekommen haben → Grundlage des
 * Duplikat-Schutzes beim Weiter-/Cron-Versand.
 */
export async function resolveRecipients(
  excludeSentOf?: string | null,
): Promise<Recipient[]> {
  const [subscribers, suppressed, already] = await Promise.all([
    listSubscribed(),
    getSuppressedEmails(),
    excludeSentOf ? getSentEmails(excludeSentOf) : Promise.resolve(new Set<string>()),
  ]);
  return subscribers.filter((c) => {
    const e = c.email.trim().toLowerCase();
    return !suppressed.has(e) && !already.has(e);
  });
}

/**
 * Baut die personalisierten Mails und verschickt sie in 100er-Blöcken über
 * Resend. Erfolgreiche Blöcke werden pro Kampagne protokolliert
 * (`recordSends`) → Grundlage für den Duplikat-Schutz beim Weitersenden.
 */
export async function deliverCampaign(
  campaignId: string | null,
  content: DeliverContent,
  recipients: Recipient[],
  apiKey: string,
  from: string,
): Promise<{ sent: number; failed: number }> {
  const base = MAIL_BASE;
  const resend = new Resend(apiKey);
  const trackedInner = campaignId
    ? trackContentLinks(content.html, base, campaignId) +
      trackingPixel(base, campaignId)
    : content.html;

  const items = recipients.map((c) => {
    const vars = mailVars(c.name, c.email, content.fallbackName);
    const unsubUrl =
      `${base}/api/newsletter/abmelden?token=${encodeURIComponent(
        signUnsubscribeToken(c.email),
      )}` + (campaignId ? `&c=${campaignId}` : "");
    const body = wrapEmail(personalizeHtml(trackedInner, vars), {
      unsubUrl,
      header: content.showHeader ? content.header : false,
      bare: content.bare,
    });
    return {
      email: c.email,
      msg: {
        from,
        to: [c.email],
        subject: personalizeText(content.subject, vars),
        html: emailDocument(body, content.bare ? { bg: "#2e3d2c" } : undefined),
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      },
    };
  });

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i += 100) {
    const chunk = items.slice(i, i + 100);
    try {
      const { error } = await resend.batch.send(chunk.map((e) => e.msg));
      if (error) {
        failed += chunk.length;
        console.error("[newsletter] batch-Fehler:", error);
      } else {
        sent += chunk.length;
        if (campaignId) {
          await recordSends(
            campaignId,
            chunk.map((e) => e.email),
          ).catch((err) => console.error("[newsletter] recordSends:", err));
        }
      }
    } catch (err) {
      failed += chunk.length;
      console.error("[newsletter] batch-Ausnahme:", err);
    }
  }
  return { sent, failed };
}

/** Resend-Zugang aus den Environment-Variablen. `null` = nicht eingerichtet. */
export function mailerConfig(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || !process.env.NEWSLETTER_SECRET?.trim()) return null;
  const from = (
    process.env.CONTACT_FROM_EMAIL ??
    "Wald & Wiese <noreply@restaurant-waldwiese.de>"
  ).trim();
  return { apiKey, from };
}
