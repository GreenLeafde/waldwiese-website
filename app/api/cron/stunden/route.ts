import { NextResponse, type NextRequest } from "next/server";
import { cronAuthorized } from "@/lib/cron-auth";
import { jetztDatum } from "@/lib/stempel";
import { sendeStundenMail } from "@/lib/stunden-mail";
import { letzteAbrechnung } from "@/lib/zeiten";

/**
 * Cron: schickt am 25. jedes Monats die Stundenübersicht an die
 * Lohnbuchhaltung — mit der CSV-Datei im Anhang, im gewohnten Format.
 *
 * Der Zeitraum ist die Abrechnung vom 25. des Vormonats bis zum 24. Der 25.
 * selbst gehört zur nächsten Abrechnung, so fehlt kein Tag und keiner zählt doppelt.
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

  const monat = letzteAbrechnung(jetztDatum());
  const ergebnis = await sendeStundenMail(monat);

  if (ergebnis.status === "fehler") {
    console.error("[cron/stunden]", ergebnis.meldung);
    return NextResponse.json(ergebnis, { status: 500 });
  }

  return NextResponse.json(ergebnis);
}
