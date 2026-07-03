"use server";

import { Resend } from "resend";
import { CONTACT, SITE } from "@/lib/site";
import { signSubscriptionToken } from "@/lib/newsletter-token";
import { recordEvent } from "@/lib/analytics";
import type { NewsletterState } from "@/lib/newsletter";

/**
 * Trägt eine E-Mail in die Launch-Liste ein — Schritt 1 von 2 (Double-Opt-in).
 * Verschickt eine Bestätigungsmail mit signiertem Link. Erst der Klick darauf
 * (Route /newsletter/bestaetigen) schreibt den Kontakt in die Resend-Audience.
 *
 * Env (siehe RESEND_SETUP.md):
 *   RESEND_API_KEY      — Pflicht zum Versenden
 *   CONTACT_FROM_EMAIL  — verifizierte Absenderadresse
 *   NEWSLETTER_SECRET   — Signatur-Geheimnis für den Bestätigungslink
 *   RESEND_AUDIENCE_ID  — Zielliste (wird erst beim Bestätigen gebraucht)
 *
 * Typ + Initial-State in lib/newsletter.ts — "use server" darf nur async
 * Funktionen exportieren.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Basis-URL für E-Mail-Links: IMMER die echte Produktiv-Domain (nie der
 * Request-Host) — sonst landen Bestätigungslinks auf localhost.
 */
const MAIL_BASE = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE.url).replace(
  /\/+$/,
  "",
);

/**
 * Begrenzt eine Promise zeitlich — verhindert, dass die Anmeldung „ewig lädt",
 * falls ein Netzwerk-/DB-Aufruf hängt. Bei Ablauf wird abgelehnt.
 */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(timer));
}

export async function subscribeToLaunchList(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot
  if (str(formData, "website") !== "") {
    return { status: "success", message: "Fast geschafft!" };
  }

  const email = str(formData, "email");
  const consent = formData.get("consent") === "on";

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Bitte gib eine gültige E-Mail-Adresse ein." };
  }
  if (!consent) {
    return {
      status: "error",
      message: "Bitte bestätige kurz, dass wir dir schreiben dürfen.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = (
    process.env.CONTACT_FROM_EMAIL ??
    "Wald & Wiese <noreply@restaurant-waldwiese.de>"
  ).trim();

  if (!apiKey || !process.env.NEWSLETTER_SECRET?.trim()) {
    console.warn(
      "[newsletter] RESEND_API_KEY oder NEWSLETTER_SECRET fehlt — keine Bestätigungsmail versendet.",
    );
    return {
      status: "error",
      message: `Die Anmeldung ist gerade nicht erreichbar. Folg uns solange auf Instagram (${CONTACT.instagramHandle}) — da verpasst du den Start nicht.`,
    };
  }

  try {
    const token = signSubscriptionToken(email);
    const confirmUrl = `${MAIL_BASE}/newsletter/bestaetigen?token=${encodeURIComponent(token)}`;
    const resend = new Resend(apiKey);

    const { error } = await withTimeout(
      resend.emails.send({
      from,
      to: email,
      subject: "Nur noch ein Klick — dein Frühstücks-Start bei Wald & Wiese",
      text: [
        "Schön, dass du dabei sein willst!",
        "",
        "Bitte bestätige deine Anmeldung mit einem Klick auf diesen Link:",
        confirmUrl,
        "",
        "Erst danach merken wir dich für den Frühstücks-Start vor. Wenn du dich nicht angemeldet hast, ignoriere diese Mail einfach.",
        "",
        "Bis bald, eure Familie Leber",
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;color:#1a1a1a;line-height:1.6;max-width:520px">
          <h2 style="color:#2e3d2c;margin:0 0 16px;font-weight:600">Nur noch ein Klick</h2>
          <p style="margin:0 0 16px">Schön, dass du beim Frühstücks-Start dabei sein willst!</p>
          <p style="margin:0 0 24px">Bitte bestätige deine Anmeldung:</p>
          <p style="margin:0 0 28px">
            <a href="${confirmUrl}" style="display:inline-block;background:#c97c5d;color:#fff;text-decoration:none;padding:12px 22px;border-radius:9999px;font-weight:500">Anmeldung bestätigen</a>
          </p>
          <p style="margin:0 0 8px;font-size:13px;color:#6b6960">Funktioniert der Button nicht? Kopier diesen Link in deinen Browser:</p>
          <p style="margin:0 0 24px;font-size:13px;word-break:break-all"><a href="${confirmUrl}" style="color:#2e3d2c">${confirmUrl}</a></p>
          <p style="margin:0;font-size:13px;color:#6b6960">Du hast dich nicht angemeldet? Dann ignorier diese Mail einfach — ohne Bestätigung passiert nichts.</p>
        </div>
      `,
      }),
      9000,
    );

    if (error) {
      console.error("[newsletter] Resend-Fehler:", error);
      return {
        status: "error",
        message: "Das hat leider nicht geklappt. Versuch es gleich nochmal.",
      };
    }

    // Analytics best-effort — darf die Anmeldung nie blockieren.
    await withTimeout(recordEvent({ type: "newsletter_signup" }), 2500).catch(
      () => {},
    );
    return {
      status: "success",
      message:
        "Fast geschafft! Wir haben dir eine Bestätigungsmail geschickt — schau in dein Postfach (und ggf. in den Spam) und klick auf den Link.",
    };
  } catch (err) {
    console.error("[newsletter] Unerwarteter Fehler:", err);
    return {
      status: "error",
      message: "Da ist etwas schiefgelaufen. Versuch es gleich nochmal.",
    };
  }
}
