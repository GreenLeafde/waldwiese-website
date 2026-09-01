/**
 * Schichtaufgaben — Datenschicht.
 *
 * Der Betrieb hat zehn feste Schichten pro Woche (Mo–Do nur frueh, Fr–So frueh
 * und spaet). An diesen zehn haengen die Aufgaben.
 *
 * Kernidee: `aufgaben` sind VORLAGEN, keine Tagesliste. Was an einem konkreten
 * Tag anfaellt, entsteht erst beim Lesen — Vorlagen des Wochentags plus die
 * bereits vorhandenen Eintraege aus `erledigungen`. Dadurch gibt es keinen
 * naechtlichen Job, der ausfallen kann, und keine Tabelle, die mit leeren
 * Zeilen volllaeuft.
 *
 * Aufgaben werden nie geloescht, sondern auf `aktiv = 0` gesetzt: sonst
 * verschwindet mit der Vorlage auch die Vergangenheit aus dem Verlauf.
 *
 * NUR server-seitig importieren.
 */

import { randomUUID } from "node:crypto";
import { getDb, ensureSchema } from "./db";
import {
  BERLIN_TZ,
  istGueltigerSlot,
  wochentagVonDatum,
  type Nachweis,
  type Rhythmus,
  type Schicht,
  type SchichtSlot,
  type Wochentag,
} from "./schichten";

// Das Schichtraster selbst steht in ./schichten — es wird auch im Browser
// gebraucht und darf den Datenbank-Client nicht mitziehen.
export * from "./schichten";

export type Aufgabe = {
  id: string;
  titel: string;
  beschreibung: string | null;
  bereich: string | null;
  nachweis: Nachweis;
  rhythmus: Rhythmus;
  /** Nur bei rhythmus = "einmalig" gesetzt (YYYY-MM-DD). */
  datum: string | null;
  sortierung: number;
  aktiv: boolean;
  createdAt: number;
  schichten: SchichtSlot[];
};

// ─── Lesen ──────────────────────────────────────────────────────────────────

type AufgabeRow = {
  id: string;
  titel: string;
  beschreibung: string | null;
  bereich: string | null;
  nachweis: string;
  rhythmus: string;
  datum: string | null;
  sortierung: number | bigint;
  aktiv: number | bigint;
  created_at: number | bigint;
};

type SlotRow = {
  aufgabe_id: string;
  wochentag: number | bigint;
  schicht: string;
};

function toAufgabe(r: AufgabeRow, schichten: SchichtSlot[]): Aufgabe {
  return {
    id: r.id,
    titel: r.titel,
    beschreibung: r.beschreibung,
    bereich: r.bereich,
    nachweis: (r.nachweis as Nachweis) ?? "keiner",
    rhythmus: (r.rhythmus as Rhythmus) ?? "woechentlich",
    datum: r.datum,
    sortierung: Number(r.sortierung),
    aktiv: Number(r.aktiv) === 1,
    createdAt: Number(r.created_at),
    schichten,
  };
}

/** Slots aller uebergebenen Aufgaben in einem Rutsch (kein N+1). */
async function slotsZu(ids: string[]): Promise<Map<string, SchichtSlot[]>> {
  const map = new Map<string, SchichtSlot[]>();
  if (ids.length === 0) return map;

  const platzhalter = ids.map(() => "?").join(",");
  const res = await getDb().execute({
    // "frueh" vor "spaet" — alphabetisch aufsteigend passt hier zufaellig,
    // aber gemeint ist die Reihenfolge des Tages.
    sql: `SELECT aufgabe_id, wochentag, schicht FROM aufgabe_schichten
          WHERE aufgabe_id IN (${platzhalter})
          ORDER BY wochentag, schicht ASC`,
    args: ids,
  });

  for (const row of res.rows as unknown as SlotRow[]) {
    const liste = map.get(row.aufgabe_id) ?? [];
    liste.push({
      wochentag: Number(row.wochentag) as Wochentag,
      schicht: row.schicht as Schicht,
    });
    map.set(row.aufgabe_id, liste);
  }
  return map;
}

/** Alle Aufgaben. `nurAktive = false` zeigt auch stillgelegte. */
export async function listAufgaben(nurAktive = true): Promise<Aufgabe[]> {
  await ensureSchema();
  const res = await getDb().execute(
    `SELECT id, titel, beschreibung, bereich, nachweis, rhythmus, datum,
            sortierung, aktiv, created_at
     FROM aufgaben
     ${nurAktive ? "WHERE aktiv = 1" : ""}
     ORDER BY sortierung, created_at`,
  );
  const rows = res.rows as unknown as AufgabeRow[];
  const slots = await slotsZu(rows.map((r) => r.id));
  return rows.map((r) => toAufgabe(r, slots.get(r.id) ?? []));
}

export async function getAufgabe(id: string): Promise<Aufgabe | null> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT id, titel, beschreibung, bereich, nachweis, rhythmus, datum,
                 sortierung, aktiv, created_at
          FROM aufgaben WHERE id = ?`,
    args: [id],
  });
  const row = (res.rows as unknown as AufgabeRow[])[0];
  if (!row) return null;
  const slots = await slotsZu([row.id]);
  return toAufgabe(row, slots.get(row.id) ?? []);
}

/**
 * Wie viele aktive Aufgaben je Schicht hinterlegt sind — fuer die
 * Wochenuebersicht im Admin. Leere Schichten fallen so sofort auf.
 */
export async function anzahlProSchicht(): Promise<Map<string, number>> {
  await ensureSchema();
  const res = await getDb().execute(
    `SELECT s.wochentag AS wochentag, s.schicht AS schicht, COUNT(*) AS c
     FROM aufgabe_schichten s
     JOIN aufgaben a ON a.id = s.aufgabe_id
     WHERE a.aktiv = 1 AND a.rhythmus = 'woechentlich'
     GROUP BY s.wochentag, s.schicht`,
  );
  const map = new Map<string, number>();
  for (const r of res.rows as unknown as {
    wochentag: number | bigint;
    schicht: string;
    c: number | bigint;
  }[]) {
    map.set(`${Number(r.wochentag)}-${r.schicht}`, Number(r.c));
  }
  return map;
}

// ─── Was faellt an einem Tag an? ────────────────────────────────────────────

/** Eine Aufgabe im Kontext einer konkreten Schicht — mit ihrem Stand. */
export type Tagesaufgabe = {
  id: string;
  titel: string;
  beschreibung: string | null;
  bereich: string | null;
  nachweis: Nachweis;
  einmalig: boolean;
  erledigt: boolean;
  erledigtVon: string | null;
  /** "HH:MM" in Berliner Zeit, leer solange offen. */
  erledigtUm: string;
  nachweisUrl: string | null;
};

type TagesRow = {
  id: string;
  titel: string;
  beschreibung: string | null;
  bereich: string | null;
  nachweis: string;
  rhythmus: string;
  erl_id: string | null;
  erledigt_von: string | null;
  erledigt_am: number | bigint | null;
  nachweis_url: string | null;
};

/**
 * Die Aufgaben einer Schicht, zusammengesetzt aus Vorlagen und dem, was an
 * diesem Tag schon erledigt wurde. Es gibt keine vorab erzeugte Tagesliste —
 * genau deshalb kann hier nichts "fehlen", wenn ein Job mal nicht lief.
 */
export async function aufgabenFuerSchicht(
  datum: string,
  schicht: Schicht,
): Promise<Tagesaufgabe[]> {
  await ensureSchema();
  const wochentag = wochentagVonDatum(datum);
  if (!wochentag) return [];

  const res = await getDb().execute({
    sql: `SELECT a.id, a.titel, a.beschreibung, a.bereich, a.nachweis, a.rhythmus,
                 e.id AS erl_id, e.erledigt_von, e.erledigt_am, e.nachweis_url
          FROM aufgaben a
          JOIN aufgabe_schichten s
            ON s.aufgabe_id = a.id AND s.wochentag = ? AND s.schicht = ?
          LEFT JOIN erledigungen e
            ON e.aufgabe_id = a.id AND e.datum = ? AND e.schicht = ?
          WHERE a.aktiv = 1
            AND (a.rhythmus = 'woechentlich'
                 OR (a.rhythmus = 'einmalig' AND a.datum = ?))
          ORDER BY a.sortierung, a.created_at`,
    args: [wochentag, schicht, datum, schicht, datum],
  });

  return (res.rows as unknown as TagesRow[]).map((r) => ({
    id: r.id,
    titel: r.titel,
    beschreibung: r.beschreibung,
    bereich: r.bereich,
    nachweis: (r.nachweis as Nachweis) ?? "keiner",
    einmalig: r.rhythmus === "einmalig",
    erledigt: Boolean(r.erl_id),
    erledigtVon: r.erledigt_von,
    erledigtUm: r.erledigt_am
      ? new Date(Number(r.erledigt_am)).toLocaleTimeString("de-DE", {
          timeZone: BERLIN_TZ,
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    nachweisUrl: r.nachweis_url,
  }));
}

/**
 * Abhaken. Der Titel wird mitgeschrieben: benennt jemand die Vorlage spaeter
 * um, soll im Verlauf trotzdem stehen, was damals dranstand.
 *
 * Doppeltes Abhaken faengt der eindeutige Index ab — "INSERT OR IGNORE"
 * macht daraus einen stillen Nicht-Vorgang statt eines Fehlers auf dem Tablet.
 */
export async function erledige(
  aufgabeId: string,
  datum: string,
  schicht: Schicht,
  von: string | null,
  nachweisUrl: string | null = null,
): Promise<void> {
  await ensureSchema();
  const aufgabe = await getAufgabe(aufgabeId);
  if (!aufgabe) return;

  await getDb().execute({
    sql: `INSERT OR IGNORE INTO erledigungen
            (id, aufgabe_id, titel_snapshot, datum, schicht, erledigt_von,
             erledigt_am, nachweis_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      randomUUID(),
      aufgabeId,
      aufgabe.titel,
      datum,
      schicht,
      von,
      Date.now(),
      nachweisUrl,
    ],
  });
}

/** Haken wieder wegnehmen — versehentliches Wischen passiert staendig. */
export async function nimmZurueck(
  aufgabeId: string,
  datum: string,
  schicht: Schicht,
): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: `DELETE FROM erledigungen
          WHERE aufgabe_id = ? AND datum = ? AND schicht = ?`,
    args: [aufgabeId, datum, schicht],
  });
}

// ─── Kommentare ─────────────────────────────────────────────────────────────

export type Kommentar = {
  id: string;
  autor: string | null;
  inhalt: string;
  createdAt: number;
};

/** Haengen an der Vorlage — ein Hinweis gilt auch naechste Woche noch. */
export async function kommentareZu(aufgabeId: string): Promise<Kommentar[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT id, autor, inhalt, created_at FROM aufgaben_kommentare
          WHERE aufgabe_id = ? ORDER BY created_at`,
    args: [aufgabeId],
  });
  return (
    res.rows as unknown as {
      id: string;
      autor: string | null;
      inhalt: string;
      created_at: number | bigint;
    }[]
  ).map((r) => ({
    id: r.id,
    autor: r.autor,
    inhalt: r.inhalt,
    createdAt: Number(r.created_at),
  }));
}

/** Kommentare aller uebergebenen Aufgaben auf einmal (kein N+1). */
export async function kommentareZuMehreren(
  ids: string[],
): Promise<Map<string, Kommentar[]>> {
  await ensureSchema();
  const map = new Map<string, Kommentar[]>();
  if (ids.length === 0) return map;

  const platzhalter = ids.map(() => "?").join(",");
  const res = await getDb().execute({
    sql: `SELECT id, aufgabe_id, autor, inhalt, created_at FROM aufgaben_kommentare
          WHERE aufgabe_id IN (${platzhalter}) ORDER BY created_at`,
    args: ids,
  });

  for (const r of res.rows as unknown as {
    id: string;
    aufgabe_id: string;
    autor: string | null;
    inhalt: string;
    created_at: number | bigint;
  }[]) {
    const liste = map.get(r.aufgabe_id) ?? [];
    liste.push({
      id: r.id,
      autor: r.autor,
      inhalt: r.inhalt,
      createdAt: Number(r.created_at),
    });
    map.set(r.aufgabe_id, liste);
  }
  return map;
}

export async function schreibeKommentar(
  aufgabeId: string,
  autor: string | null,
  inhalt: string,
): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: `INSERT INTO aufgaben_kommentare (id, aufgabe_id, autor, inhalt, created_at)
          VALUES (?, ?, ?, ?, ?)`,
    args: [randomUUID(), aufgabeId, autor, inhalt, Date.now()],
  });
}

// ─── Schreiben ──────────────────────────────────────────────────────────────

export type AufgabeEingabe = {
  titel: string;
  beschreibung?: string | null;
  bereich?: string | null;
  nachweis: Nachweis;
  rhythmus: Rhythmus;
  datum?: string | null;
  schichten: SchichtSlot[];
};

/** Slots einer Aufgabe ersetzen (erst raus, dann rein — in einem Batch). */
function slotStatements(id: string, schichten: SchichtSlot[]) {
  const sauber = schichten.filter(istGueltigerSlot);
  return [
    { sql: "DELETE FROM aufgabe_schichten WHERE aufgabe_id = ?", args: [id] },
    ...sauber.map((s) => ({
      sql: `INSERT OR IGNORE INTO aufgabe_schichten (aufgabe_id, wochentag, schicht)
            VALUES (?, ?, ?)`,
      args: [id, s.wochentag, s.schicht] as (string | number)[],
    })),
  ];
}

export async function createAufgabe(daten: AufgabeEingabe): Promise<string> {
  await ensureSchema();
  const db = getDb();
  const id = randomUUID();

  // Neue Aufgaben hinten anstellen.
  const max = await db.execute("SELECT COALESCE(MAX(sortierung), 0) AS m FROM aufgaben");
  const sortierung = Number((max.rows[0] as unknown as { m: number | bigint }).m) + 1;

  await db.batch(
    [
      {
        sql: `INSERT INTO aufgaben
                (id, titel, beschreibung, bereich, nachweis, rhythmus, datum,
                 sortierung, aktiv, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        args: [
          id,
          daten.titel,
          daten.beschreibung || null,
          daten.bereich || null,
          daten.nachweis,
          daten.rhythmus,
          daten.rhythmus === "einmalig" ? daten.datum || null : null,
          sortierung,
          Date.now(),
        ],
      },
      ...slotStatements(id, daten.schichten),
    ],
    "write",
  );

  return id;
}

export async function updateAufgabe(id: string, daten: AufgabeEingabe): Promise<void> {
  await ensureSchema();
  await getDb().batch(
    [
      {
        sql: `UPDATE aufgaben
              SET titel = ?, beschreibung = ?, bereich = ?, nachweis = ?,
                  rhythmus = ?, datum = ?
              WHERE id = ?`,
        args: [
          daten.titel,
          daten.beschreibung || null,
          daten.bereich || null,
          daten.nachweis,
          daten.rhythmus,
          daten.rhythmus === "einmalig" ? daten.datum || null : null,
          id,
        ],
      },
      ...slotStatements(id, daten.schichten),
    ],
    "write",
  );
}

/**
 * Stilllegen statt loeschen. Die Aufgabe verschwindet aus den Schichten, der
 * Verlauf bleibt lesbar.
 */
export async function setAktiv(id: string, aktiv: boolean): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: "UPDATE aufgaben SET aktiv = ? WHERE id = ?",
    args: [aktiv ? 1 : 0, id],
  });
}

/** Tauscht die Reihenfolge mit dem Nachbarn — daher zwei Schreibvorgaenge. */
export async function verschiebe(id: string, richtung: "hoch" | "runter"): Promise<void> {
  await ensureSchema();
  const db = getDb();

  const alle = await db.execute(
    "SELECT id, sortierung FROM aufgaben WHERE aktiv = 1 ORDER BY sortierung, created_at",
  );
  const liste = (alle.rows as unknown as { id: string; sortierung: number | bigint }[]).map(
    (r) => ({ id: r.id, sortierung: Number(r.sortierung) }),
  );

  const i = liste.findIndex((a) => a.id === id);
  const j = richtung === "hoch" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= liste.length) return;

  // Positionen neu durchnummerieren — robust auch bei doppelten Altwerten.
  [liste[i], liste[j]] = [liste[j], liste[i]];
  await db.batch(
    liste.map((a, index) => ({
      sql: "UPDATE aufgaben SET sortierung = ? WHERE id = ?",
      args: [index + 1, a.id] as (string | number)[],
    })),
    "write",
  );
}
