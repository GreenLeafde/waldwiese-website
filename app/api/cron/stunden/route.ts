import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { monatVon, sendeStundenMail } from "@/lib/stunden-mail";

/**
 * Cron: schickt am 25. jedes Monats die Stundenübersicht an die
 * Lohnbuchhaltung — mit der CSV-Datei im Anhang, im gewohnten Format.
 *
 * Der Zeitraum ist der laufende Monat. Am 25. sind das die Tage 1. bis 25.;
 * was danach noch anfällt, steht in der Mail des Folgemonats nicht — deshalb
 * bleibt /admin/zeiten die vollständige Quelle, wenn zum Monatsende
 * nachgerechnet wird.
 *
 * Absicherung wie beim Newsletter-Cron: Vercel schickt
 * `Authorization: Bearer $CRON_SECRET`, sobald die Variable gesetzt ist. Ist
 * sie es nicht, lassen wir nur Vercels eigenen Aufruf durch (`x-vercel-cron`).
 *
 * Doppelter Versand ist ausgeschlossen: Der Monat wird protokolliert, ein
 * zweiter Aufruf im selben Monat verschickt nichts mehr.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

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

  const monat = monatVon(new Date());
  const ergebnis = await sendeStundenMail(monat);

  if (ergebnis.status === "fehler") {
    console.error("[cron/stunden]", ergebnis.meldung);
    return NextResponse.json(ergebnis, { status: 500 });
  }

  return NextResponse.json(ergebnis);
}
