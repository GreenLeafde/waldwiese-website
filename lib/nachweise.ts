/**
 * Fotos und Unterschriften zu erledigten Aufgaben.
 *
 * Die Bilder liegen in der eigenen Datenbank statt in einem zusaetzlichen
 * Dateispeicher. Der Grund ist die Menge: Die Bilder werden im Browser auf
 * ~200 KB heruntergerechnet, und mit der Aufbewahrungsfrist unten sind es
 * einige hundert Stueck. Dafuer lohnt kein weiterer Dienst, der eingerichtet,
 * bezahlt und ueberwacht werden muss.
 *
 * Wichtig fuers Tempo: Die Spalte `daten` wird NIE mitgelesen, wenn nur die
 * Aufgabenliste gebraucht wird — nur die Ausliefer-Route holt sie.
 *
 * Datenschutz: Unterschriften sind personenbezogen, Fotos sollen Sachen
 * zeigen (Thermometer, gereinigte Flaechen), keine Personen. Beides wird nach
 * Ablauf der Frist automatisch geloescht.
 *
 * NUR server-seitig importieren.
 */

import { randomUUID } from "node:crypto";
import { getDb, ensureSchema } from "./db";

export type NachweisArt = "foto" | "unterschrift";

/**
 * Aufbewahrungsfristen in Tagen.
 * Fotos belegen nur, dass etwas getan wurde — nach einem Vierteljahr fragt
 * danach niemand mehr. Unterschriften sind der eigentliche Nachweis und
 * bleiben laenger. Beides hier zentral aenderbar.
 */
export const FRIST_TAGE: Record<NachweisArt, number> = {
  foto: 90,
  unterschrift: 730,
};

/** Groesse nach dem Verkleinern im Browser; grosszuegig, aber begrenzt. */
export const MAX_BYTES = 3 * 1024 * 1024;

export const ERLAUBTE_TYPEN = ["image/jpeg", "image/png", "image/webp"] as const;

const TAG_MS = 24 * 60 * 60 * 1000;

export function typErlaubt(typ: string): boolean {
  return (ERLAUBTE_TYPEN as readonly string[]).includes(typ);
}

/**
 * Speichert ein Bild und gibt den Pfad zurueck, unter dem es abrufbar ist.
 * Die Kennung ist zufaellig und nicht erratbar — der Pfad selbst ist der
 * Zugang, deshalb landet er nur in der Aufgabenzeile und im Backend.
 */
export async function speichereNachweis(
  art: NachweisArt,
  typ: string,
  daten: Uint8Array,
): Promise<string> {
  await ensureSchema();
  const id = randomUUID();

  await getDb().execute({
    sql: `INSERT INTO nachweise (id, art, typ, daten, groesse, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, art, typ, daten, daten.byteLength, Date.now()],
  });

  // Bei Gelegenheit aufraeumen — spart einen naechtlichen Job, der ausfallen
  // koennte. Ein Fehler hier darf das Abhaken nicht scheitern lassen.
  raeumeAlteAuf().catch((e) => console.error("[nachweise] Aufraeumen", e));

  return `/schicht/nachweis/${id}`;
}

export type Nachweis = { typ: string; daten: Uint8Array; art: NachweisArt };

export async function holeNachweis(id: string): Promise<Nachweis | null> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "SELECT art, typ, daten FROM nachweise WHERE id = ?",
    args: [id],
  });
  const row = res.rows[0] as unknown as
    | { art: string; typ: string; daten: ArrayBuffer | Uint8Array }
    | undefined;
  if (!row) return null;

  return {
    art: row.art as NachweisArt,
    typ: row.typ,
    daten: row.daten instanceof Uint8Array ? row.daten : new Uint8Array(row.daten),
  };
}

/** Loescht abgelaufene Bilder. Gibt zurueck, wie viele es waren. */
export async function raeumeAlteAuf(): Promise<number> {
  await ensureSchema();
  const jetzt = Date.now();
  let entfernt = 0;

  for (const art of Object.keys(FRIST_TAGE) as NachweisArt[]) {
    const grenze = jetzt - FRIST_TAGE[art] * TAG_MS;
    // RETURNING statt rowsAffected: Letzteres meldet hier 0, obwohl geloescht
    // wurde — die zurueckgegebenen Zeilen sind die verlaessliche Auskunft.
    const res = await getDb().execute({
      sql: "DELETE FROM nachweise WHERE art = ? AND created_at < ? RETURNING id",
      args: [art, grenze],
    });
    entfernt += res.rows.length;
  }
  return entfernt;
}

/** Kennung aus einem gespeicherten Pfad zurueckholen. */
export function idAusPfad(pfad: string | null): string | null {
  if (!pfad) return null;
  const m = /\/schicht\/nachweis\/([0-9a-f-]{36})$/.exec(pfad);
  return m ? m[1] : null;
}
