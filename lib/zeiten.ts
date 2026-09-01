/**
 * Auswertung der Arbeitszeiten — Übersicht und CSV.
 *
 * Diese Datei hat eine einzige, harte Anforderung: Sie muss **denselben
 * CSV-Text** erzeugen wie die bisherige Stempel-App. Die Datei geht in die
 * Lohnabrechnung; ändert sich Spaltenreihenfolge, Trennzeichen, Rundung oder
 * Sortierung, merkt das niemand sofort, aber die Zahlen stimmen nicht mehr.
 *
 * Deshalb ist die Rechnung hier bewusst 1:1 aus der alten App übernommen —
 * auch dort, wo man es anders bauen würde:
 *   • Dauer = Ende minus Beginn in Minuten, nie negativ (Mitternacht wird
 *     nicht behandelt; die alte App tut das auch nicht).
 *   • Sortierung nach Datum, bei gleichem Datum nach Beginn.
 *   • Reihenfolge der Summen = Reihenfolge des ersten Auftretens.
 *   • Trennzeichen Semikolon, Zeilenende \n, BOM voran.
 *
 * NUR server-seitig importieren.
 */

import { holeMitarbeiter, minutenZwischen, alsStunden, type Mitarbeiter } from "./stempel";

export type Zeiteintrag = {
  id: number;
  name: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:MM" */
  start: string;
  /** "HH:MM" */
  end: string;
  color: string;
};

export type Zeitraum =
  | { art: "tag"; wert: string } // "YYYY-MM-DD"
  | { art: "monat"; wert: string }; // "YYYY-MM"

/** "2026-06-25" -> "25.06.2026" (wie in der alten App). */
export function alsDeutschesDatum(s: string): string {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  return `${d}.${m}.${y}`;
}

const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

/** "2026-06" -> "Juni 2026". */
export function alsMonatsname(s: string): string {
  if (!s) return "";
  const [y, m] = s.split("-");
  return `${MONATE[Number(m) - 1]} ${y}`;
}

function gehoertZu(eintrag: { date: string }, zeitraum: Zeitraum): boolean {
  return zeitraum.art === "tag"
    ? eintrag.date === zeitraum.wert
    : eintrag.date.startsWith(zeitraum.wert + "-");
}

/** Einträge des Zeitraums, sortiert wie in der alten App. */
export function filtereEintraege(alle: Zeiteintrag[], zeitraum: Zeitraum): Zeiteintrag[] {
  return alle
    .filter((e) => gehoertZu(e, zeitraum))
    .sort((a, b) =>
      a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date),
    );
}

/**
 * Summe je Person in Minuten. Bewusst eine Map: Die Reihenfolge ist die des
 * ersten Auftretens — genau so entsteht sie in der alten App, und genau so
 * steht sie im Summenblock der CSV.
 */
export function summeJePerson(eintraege: Zeiteintrag[]): Map<string, number> {
  const summe = new Map<string, number>();
  for (const e of eintraege) {
    summe.set(e.name, (summe.get(e.name) ?? 0) + minutenZwischen(e.start, e.end));
  }
  return summe;
}

export type Auswertung = {
  eintraege: (Zeiteintrag & { nr: number | ""; lohnart: string; stunden: string })[];
  summen: { name: string; nr: number | ""; lohnart: string; stunden: string }[];
  gesamt: string;
  bezeichnung: string;
  dateiname: string;
};

function stammDaten(mitarbeiter: Mitarbeiter[], name: string) {
  const m = mitarbeiter.find((x) => x.name === name);
  return { nr: (m?.nr ?? "") as number | "", lohnart: m?.lohnart ?? "" };
}

export function werteAus(
  alle: Zeiteintrag[],
  mitarbeiter: Mitarbeiter[],
  zeitraum: Zeitraum,
): Auswertung {
  const gefiltert = filtereEintraege(alle, zeitraum);
  const summen = summeJePerson(gefiltert);

  return {
    eintraege: gefiltert.map((e) => ({
      ...e,
      ...stammDaten(mitarbeiter, e.name),
      stunden: alsStunden(minutenZwischen(e.start, e.end)),
    })),
    summen: [...summen].map(([name, min]) => ({
      name,
      ...stammDaten(mitarbeiter, name),
      stunden: alsStunden(min),
    })),
    gesamt: alsStunden([...summen.values()].reduce((a, b) => a + b, 0)),
    bezeichnung:
      zeitraum.art === "tag" ? alsDeutschesDatum(zeitraum.wert) : alsMonatsname(zeitraum.wert),
    dateiname: `Zeiterfassung_${zeitraum.wert}.csv`,
  };
}

/**
 * Der CSV-Text — ohne BOM, das setzt der Aufrufer davor.
 *
 * Der Summenblock erscheint nur in der Monatsansicht, genau wie bisher.
 */
export function alsCsv(
  alle: Zeiteintrag[],
  mitarbeiter: Mitarbeiter[],
  zeitraum: Zeitraum,
): string {
  const a = werteAus(alle, mitarbeiter, zeitraum);

  const zeilen: (string | number)[][] = [
    ["Datum", "Name", "Nr.", "Lohnart", "Start", "Ende", "Stunden"],
    ...a.eintraege.map((e) => [
      alsDeutschesDatum(e.date),
      e.name,
      e.nr,
      e.lohnart,
      e.start,
      e.end,
      e.stunden,
    ]),
  ];

  if (zeitraum.art === "monat") {
    zeilen.push([]);
    zeilen.push(["Summe je Mitarbeiter"]);
    for (const s of a.summen) {
      zeilen.push(["", s.name, s.nr, s.lohnart, "", "", s.stunden]);
    }
    zeilen.push(["", "Gesamt", "", "", "", "", a.gesamt]);
  }

  return zeilen.map((r) => r.join(";")).join("\n");
}

/** Mit vorangestelltem BOM — so öffnet Excel die Umlaute richtig. */
export function alsCsvDatei(
  alle: Zeiteintrag[],
  mitarbeiter: Mitarbeiter[],
  zeitraum: Zeitraum,
): string {
  return "﻿" + alsCsv(alle, mitarbeiter, zeitraum);
}

/** Alle Stammdaten und Einträge auf einmal holen. */
export async function ladeZeiten(): Promise<{
  eintraege: Zeiteintrag[];
  mitarbeiter: Mitarbeiter[];
}> {
  const { holeEintraege } = await import("./stempel");
  const [eintraege, mitarbeiter] = await Promise.all([holeEintraege(), holeMitarbeiter()]);
  return { eintraege, mitarbeiter };
}
