/**
 * Auswertung der Arbeitszeiten — Übersicht und CSV.
 *
 * Die Datei geht in die Lohnabrechnung; ändert sich Spaltenreihenfolge,
 * Trennzeichen, Rundung oder Sortierung, merkt das niemand sofort, aber die
 * Zahlen stimmen nicht mehr.
 *
 * Stunden stehen seit 30.10.2026 dezimal im CSV ("74,97" statt der "74:58" der
 * alten App, auf Wunsch der Leitung). Summen werden aus den Minuten gebildet und
 * erst dann gerundet. Sonst ist die Rechnung 1:1 aus der alten App übernommen:
 *   • Dauer = Ende minus Beginn in Minuten. Liegt das Ende vor dem Beginn, geht
 *     die Schicht über Mitternacht (die alte App zählt das weiter als 0).
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
  | { art: "monat"; wert: string } // "YYYY-MM"
  /** Abrechnung 25. bis 24.; `wert` ist der Monat, in dem sie endet ("YYYY-MM"). */
  | { art: "abrechnung"; wert: string };

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

/** "2026-10" -> erster und letzter Tag der Abrechnung (25.09. bis 24.10.). */
export function abrechnungsGrenzen(wert: string): { von: string; bis: string } {
  const [y, m] = wert.split("-").map(Number);
  const vorY = m === 1 ? y - 1 : y;
  const vorM = m === 1 ? 12 : m - 1;
  return {
    von: `${vorY}-${String(vorM).padStart(2, "0")}-25`,
    bis: `${wert}-24`,
  };
}

/** "25.09.2026 – 24.10.2026" */
export function alsAbrechnungsname(wert: string): string {
  const { von, bis } = abrechnungsGrenzen(wert);
  return `${alsDeutschesDatum(von)} – ${alsDeutschesDatum(bis)}`;
}

/** Die zuletzt abgeschlossene Abrechnung; am 25. ist das die bis gestern. */
export function letzteAbrechnung(heute: string): string {
  const [y, m, d] = heute.split("-").map(Number);
  if (d >= 25) return heute.slice(0, 7);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}

/** Die Abrechnung, in die der heutige Tag fällt. */
export function laufendeAbrechnung(heute: string): string {
  const [y, m, d] = heute.split("-").map(Number);
  if (d < 25) return heute.slice(0, 7);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}

/** Liegt der Tag im Zeitraum? Der 25. gehört nur zur Abrechnung, die mit ihm beginnt. */
export function imZeitraum(datum: string, zeitraum: Zeitraum): boolean {
  if (zeitraum.art === "tag") return datum === zeitraum.wert;
  if (zeitraum.art === "monat") return datum.startsWith(zeitraum.wert + "-");
  const { von, bis } = abrechnungsGrenzen(zeitraum.wert);
  return datum >= von && datum <= bis;
}

function gehoertZu(eintrag: { date: string }, zeitraum: Zeitraum): boolean {
  return imZeitraum(eintrag.date, zeitraum);
}

/** Dateiname des CSV-Exports. */
export function csvDateiname(zeitraum: Zeitraum): string {
  if (zeitraum.art !== "abrechnung") return `Zeiterfassung_${zeitraum.wert}.csv`;
  const { von, bis } = abrechnungsGrenzen(zeitraum.wert);
  return `Zeiterfassung_${von}_bis_${bis}.csv`;
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
      zeitraum.art === "tag"
        ? alsDeutschesDatum(zeitraum.wert)
        : zeitraum.art === "monat"
          ? alsMonatsname(zeitraum.wert)
          : alsAbrechnungsname(zeitraum.wert),
    dateiname: csvDateiname(zeitraum),
  };
}

/**
 * Der CSV-Text — ohne BOM, das setzt der Aufrufer davor.
 *
 * Der Summenblock erscheint bei Monat und Abrechnung, nicht beim einzelnen Tag.
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

  if (zeitraum.art !== "tag") {
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
