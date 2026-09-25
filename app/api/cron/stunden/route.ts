import { NextResponse, type NextRequest } from "next/server";
import { cronAuthorized } from "@/lib/cron-auth";
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
 * Absicherung wie beim Newsletter-Cron: siehe `lib/cron-auth.ts`.
 *
 * Doppelter Versand ist ausgeschlossen: Der Monat wird protokolliert, ein
 * zweiter Aufruf im selben Monat verschickt nichts mehr.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!cronAuthorized(request, "cron/stunden")) {
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
