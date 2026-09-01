import { isAuthed } from "@/lib/admin-auth";
import { alsCsvDatei, ladeZeiten, type Zeitraum } from "@/lib/zeiten";
import { stempelKonfiguriert } from "@/lib/stempel";

/**
 * CSV-Download der Arbeitszeiten.
 *
 * Eigener Endpunkt statt Erzeugung im Browser: Die Datei entsteht aus
 * denselben Daten wie die Ansicht, und der Inhalt ist zeichengleich mit dem
 * Export der bisherigen App — gegen die vorliegende Juni-Datei geprüft.
 */
export async function GET(request: Request): Promise<Response> {
  if (!(await isAuthed())) {
    return new Response("Nicht angemeldet.", { status: 401 });
  }
  if (!stempelKonfiguriert()) {
    return new Response("Die Zeiterfassung ist nicht verbunden.", { status: 503 });
  }

  const p = new URL(request.url).searchParams;
  const art = p.get("art") === "tag" ? "tag" : "monat";
  const wert = (p.get("wert") ?? "").trim();

  const gueltig =
    art === "tag" ? /^\d{4}-\d{2}-\d{2}$/.test(wert) : /^\d{4}-\d{2}$/.test(wert);
  if (!gueltig) {
    return new Response("Zeitraum fehlt oder ist ungültig.", { status: 400 });
  }

  const zeitraum = { art, wert } as Zeitraum;
  const { eintraege, mitarbeiter } = await ladeZeiten();

  return new Response(alsCsvDatei(eintraege, mitarbeiter, zeitraum), {
    headers: {
      "Content-Type": "text/csv;charset=utf-8",
      "Content-Disposition": `attachment; filename="Zeiterfassung_${wert}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
