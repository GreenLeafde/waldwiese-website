import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  claimScheduled,
  getNewsletter,
  listDueScheduled,
} from "@/lib/newsletters";
import {
  deliverCampaign,
  mailerConfig,
  resolveRecipients,
} from "@/lib/newsletter-delivery";
import { type HeaderStyle } from "@/lib/newsletter-shell";

/**
 * Cron: verschickt Newsletter, die im Composer auf einen Zeitpunkt gelegt
 * wurden („Versand planen"). Läuft alle 5 Minuten (siehe vercel.json) und
 * liefert jede fällige Kampagne per Resend-Batch aus — unabhängig davon, ob
 * gerade jemand am Rechner sitzt.
 *
 * Absicherung: Vercel schickt `Authorization: Bearer $CRON_SECRET` mit, sobald
 * die Environment-Variable CRON_SECRET gesetzt ist. Ist sie das (noch) nicht,
 * lassen wir nur Vercels eigenen Cron-Aufruf durch (`x-vercel-cron`), damit der
 * geplante Versand auch ohne zusätzliche Konfiguration läuft. Ein fremder
 * Aufruf könnte ohnehin nur anstoßen, was ohnehin fällig ist — nie früher.
 */

export const runtime = "nodejs";
// Genug Luft für viele 100er-Batches; Vercel Pro erlaubt bis 300 s.
export const maxDuration = 300;

/**
 * Sicherung gegen Alt-Einträge: Kampagnen, die länger als das hier überfällig
 * sind, werden NICHT mehr verschickt — nur der Termin wird abgeräumt. Sonst
 * würde eine alte Zeile (etwa aus der Zeit vor diesem Cron, oder nach einem
 * DB-Restore) plötzlich einen längst erledigten Newsletter rausblasen. Wer sie
 * doch noch senden will, nimmt „Weiter senden" unter /admin/versand.
 */
const UEBERFAELLIG_MS = 6 * 60 * 60 * 1000;

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const got = Buffer.from(request.headers.get("authorization") ?? "");
    const want = Buffer.from(`Bearer ${secret}`);
    return got.length === want.length && timingSafeEqual(got, want);
  }
  return request.headers.get("x-vercel-cron") != null;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return new NextResponse("unauthorized", { status: 401 });
  }

  const mailer = mailerConfig();
  if (!mailer) {
    console.error("[cron] Versand nicht konfiguriert (RESEND_API_KEY / NEWSLETTER_SECRET).");
    return NextResponse.json({ error: "mailer not configured" }, { status: 500 });
  }

  const now = Date.now();
  let due: { id: string; scheduledAt: number }[];
  try {
    due = await listDueScheduled(now);
  } catch (err) {
    console.error("[cron] Fällige Kampagnen konnten nicht gelesen werden:", err);
    return NextResponse.json({ error: "db unreachable" }, { status: 500 });
  }

  const results: { id: string; sent: number; failed: number; note?: string }[] = [];

  for (const { id, scheduledAt } of due) {
    try {
      // Zu lange überfällig → nur den Termin abräumen, nichts verschicken.
      if (now - scheduledAt > UEBERFAELLIG_MS) {
        await claimScheduled(id);
        console.warn(
          `[cron] Kampagne ${id} war ${Math.round((now - scheduledAt) / 3600000)} h überfällig — nicht verschickt, Termin abgeräumt.`,
        );
        results.push({ id, sent: 0, failed: 0, note: "zu lange überfällig" });
        continue;
      }

      // Erst exklusiv annehmen (scheduled_at → NULL), dann senden. Überlappt
      // sich ein zweiter Cron-Lauf, geht er hier leer aus statt doppelt zu
      // verschicken. Bleibt dabei etwas liegen (z. B. Tageslimit), holt es der
      // Knopf „Weiter senden" unter /admin/versand nach — ohne Duplikate.
      if (!(await claimScheduled(id))) {
        results.push({ id, sent: 0, failed: 0, note: "schon vergeben" });
        continue;
      }

      const nl = await getNewsletter(id);
      if (!nl) {
        results.push({ id, sent: 0, failed: 0, note: "nicht gefunden" });
        continue;
      }

      const recipients = await resolveRecipients(id);
      if (recipients.length === 0) {
        results.push({ id, sent: 0, failed: 0, note: "keine offenen Empfänger" });
        continue;
      }

      const { sent, failed } = await deliverCampaign(
        id,
        {
          subject: nl.subject,
          html: nl.html,
          header: {
            title: nl.headerTitle ?? undefined,
            tagline: nl.headerTagline ?? undefined,
            style: (nl.headerStyle as HeaderStyle | null) ?? undefined,
          },
          showHeader: nl.showHeader,
          bare: nl.bare,
          fallbackName: "du",
        },
        recipients,
        mailer.apiKey,
        mailer.from,
      );
      console.log(`[cron] Kampagne ${id}: ${sent} gesendet, ${failed} offen.`);
      results.push({ id, sent, failed });
    } catch (err) {
      console.error(`[cron] Kampagne ${id} fehlgeschlagen:`, err);
      results.push({ id, sent: 0, failed: 0, note: "Fehler" });
    }
  }

  return NextResponse.json({ due: due.length, results });
}
