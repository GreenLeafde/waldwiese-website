/**
 * Datenbank (libSQL). Lokal eine Datei unter ./.data, in Produktion (Vercel)
 * eine Turso-Datenbank — gleicher Client, gleicher SQL-Dialekt.
 *
 * Env:
 *   TURSO_DATABASE_URL   — libsql://… (Produktion). Fehlt sie, wird lokal die
 *                          Datei ./.data/wald-wiese.db genutzt.
 *   TURSO_AUTH_TOKEN     — Auth-Token für Turso (Produktion).
 *
 * NUR server-seitig importieren.
 */

import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";

let _db: Client | null = null;
let _schema: Promise<void> | null = null;

const LOCAL_URL = "file:./.data/wald-wiese.db";

export function getDb(): Client {
  if (_db) return _db;
  const url = (process.env.TURSO_DATABASE_URL || "").trim() || LOCAL_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  // Lokale Datei: Verzeichnis sicherstellen (frischer Clone hat ./.data nicht).
  if (url.startsWith("file:")) {
    try {
      mkdirSync(".data", { recursive: true });
    } catch {
      /* existiert schon */
    }
  }

  _db = createClient(authToken ? { url, authToken } : { url });
  return _db;
}

/**
 * Prüft, ob die DB erreichbar ist (z. B. ob TURSO auf Vercel konfiguriert ist).
 * Wirft NICHT — gibt nur true/false zurück, damit Seiten freundlich degradieren.
 */
export async function dbReachable(): Promise<boolean> {
  try {
    await ensureSchema();
    await getDb().execute("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/** Legt die Tabellen idempotent an. Wird vor jedem DB-Zugriff aufgerufen. */
export async function ensureSchema(): Promise<void> {
  if (_schema) return _schema;
  _schema = (async () => {
    const db = getDb();
    await db.batch(
      [
        `CREATE TABLE IF NOT EXISTS contacts (
          id          TEXT PRIMARY KEY,
          email       TEXT NOT NULL UNIQUE,
          name        TEXT,
          status      TEXT NOT NULL DEFAULT 'subscribed',
          source      TEXT,
          created_at  INTEGER NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS events (
          id          INTEGER PRIMARY KEY AUTOINCREMENT,
          type        TEXT NOT NULL,
          path        TEXT,
          label       TEXT,
          referrer    TEXT,
          country     TEXT,
          duration    INTEGER,
          created_at  INTEGER NOT NULL
        )`,
        `CREATE INDEX IF NOT EXISTS idx_events_type_time ON events (type, created_at)`,
        `CREATE INDEX IF NOT EXISTS idx_events_time ON events (created_at)`,
        `CREATE TABLE IF NOT EXISTS newsletters (
          id              TEXT PRIMARY KEY,
          name            TEXT,
          subject         TEXT NOT NULL,
          html            TEXT NOT NULL,
          header_title    TEXT,
          header_tagline  TEXT,
          header_style    TEXT,
          show_header     INTEGER NOT NULL DEFAULT 1,
          bare            INTEGER NOT NULL DEFAULT 0,
          recipient_count INTEGER NOT NULL DEFAULT 0,
          sent_at         INTEGER NOT NULL,
          scheduled_at    INTEGER
        )`,
        `CREATE TABLE IF NOT EXISTS newsletter_hits (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          newsletter_id TEXT NOT NULL,
          type          TEXT NOT NULL,
          url           TEXT,
          created_at    INTEGER NOT NULL
        )`,
        `CREATE INDEX IF NOT EXISTS idx_hits_nl ON newsletter_hits (newsletter_id, type)`,
        `CREATE TABLE IF NOT EXISTS newsletter_sends (
          newsletter_id TEXT NOT NULL,
          email         TEXT NOT NULL,
          created_at    INTEGER NOT NULL,
          PRIMARY KEY (newsletter_id, email)
        )`,
        `CREATE TABLE IF NOT EXISTS suppressions (
          email      TEXT PRIMARY KEY,
          reason     TEXT,
          created_at INTEGER NOT NULL
        )`,

        // ─── Schichtaufgaben ────────────────────────────────────────────
        // Vorlagen. Wiederkehrende Aufgaben werden NICHT vorab je Tag
        // erzeugt — für ein Datum werden die passenden Vorlagen gelesen und
        // mit `erledigungen` verglichen. Kein naechtlicher Job noetig.
        `CREATE TABLE IF NOT EXISTS aufgaben (
          id           TEXT PRIMARY KEY,
          titel        TEXT NOT NULL,
          beschreibung TEXT,
          bereich      TEXT,
          nachweis     TEXT NOT NULL DEFAULT 'keiner',
          rhythmus     TEXT NOT NULL DEFAULT 'woechentlich',
          datum        TEXT,
          sortierung   INTEGER NOT NULL DEFAULT 0,
          aktiv        INTEGER NOT NULL DEFAULT 1,
          created_at   INTEGER NOT NULL
        )`,
        // Auf welchen der zehn Schichten eine Vorlage liegt. Eigene Tabelle
        // statt Liste in einer Spalte, damit "was faellt heute an?" eine
        // normale Abfrage bleibt.
        `CREATE TABLE IF NOT EXISTS aufgabe_schichten (
          aufgabe_id TEXT NOT NULL,
          wochentag  INTEGER NOT NULL,
          schicht    TEXT NOT NULL,
          PRIMARY KEY (aufgabe_id, wochentag, schicht)
        )`,
        `CREATE INDEX IF NOT EXISTS idx_asch_tag ON aufgabe_schichten (wochentag, schicht)`,
        `CREATE TABLE IF NOT EXISTS erledigungen (
          id             TEXT PRIMARY KEY,
          aufgabe_id     TEXT NOT NULL,
          titel_snapshot TEXT NOT NULL,
          datum          TEXT NOT NULL,
          schicht        TEXT NOT NULL,
          erledigt_von   TEXT,
          erledigt_am    INTEGER NOT NULL,
          nachweis_url   TEXT
        )`,
        // Verhindert doppeltes Abhaken — auch wenn zwei Tablets im selben
        // Moment senden.
        `CREATE UNIQUE INDEX IF NOT EXISTS idx_erl_einmalig
           ON erledigungen (aufgabe_id, datum, schicht)`,
        `CREATE INDEX IF NOT EXISTS idx_erl_datum ON erledigungen (datum, schicht)`,
        // Kommentare haengen an der Vorlage, nicht am einzelnen Tag: ein
        // Hinweis ("Thermometer haengt jetzt links") gilt auch naechste Woche.
        `CREATE TABLE IF NOT EXISTS aufgaben_kommentare (
          id         TEXT PRIMARY KEY,
          aufgabe_id TEXT NOT NULL,
          autor      TEXT,
          inhalt     TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )`,
        `CREATE INDEX IF NOT EXISTS idx_akom_aufgabe ON aufgaben_kommentare (aufgabe_id, created_at)`,
        // Fotos und Unterschriften. Bewusst hier und nicht in einem eigenen
        // Dateispeicher: Mit Aufbewahrungsfrist bleiben es wenige hundert
        // verkleinerte Bilder, und es kommt kein weiterer Dienst dazu, der
        // eingerichtet und bezahlt werden muss. Die Bilder werden nie
        // mitgelesen, wenn nur die Aufgabenliste gebraucht wird.
        `CREATE TABLE IF NOT EXISTS nachweise (
          id         TEXT PRIMARY KEY,
          art        TEXT NOT NULL,
          typ        TEXT NOT NULL,
          daten      BLOB NOT NULL,
          groesse    INTEGER NOT NULL,
          created_at INTEGER NOT NULL
        )`,
        `CREATE INDEX IF NOT EXISTS idx_nachweise_zeit ON nachweise (created_at)`,
        // Protokoll der monatlichen Stunden-Mail. Der Monat ist der
        // Primaerschluessel — damit kann dieselbe Monatsmail nicht zweimal
        // rausgehen, auch wenn der Cron doppelt ausgeloest wird.
        `CREATE TABLE IF NOT EXISTS stunden_mails (
          monat       TEXT PRIMARY KEY,
          empfaenger  TEXT NOT NULL,
          gesendet_am INTEGER NOT NULL
        )`,
      ],
      "write",
    );

    // Migration: show_header bei bestehenden newsletters-Tabellen nachrüsten
    // (frühere Deploys hatten die Spalte nicht). Fehler ignorieren, wenn da.
    try {
      await db.execute(
        "ALTER TABLE newsletters ADD COLUMN show_header INTEGER NOT NULL DEFAULT 1",
      );
    } catch {
      /* Spalte existiert bereits */
    }
    try {
      await db.execute(
        "ALTER TABLE newsletters ADD COLUMN bare INTEGER NOT NULL DEFAULT 0",
      );
    } catch {
      /* Spalte existiert bereits */
    }
    try {
      await db.execute("ALTER TABLE newsletters ADD COLUMN name TEXT");
    } catch {
      /* Spalte existiert bereits */
    }
    // Migration: geplanter Versand — Zeitpunkt, zu dem Resend die Kampagne
    // ausliefern soll (NULL = sofort/bereits versendet).
    try {
      await db.execute(
        "ALTER TABLE newsletters ADD COLUMN scheduled_at INTEGER",
      );
    } catch {
      /* Spalte existiert bereits */
    }
    for (const col of [
      "referrer TEXT",
      "country TEXT",
      "duration INTEGER",
    ]) {
      try {
        await db.execute(`ALTER TABLE events ADD COLUMN ${col}`);
      } catch {
        /* Spalte existiert bereits */
      }
    }
  })();
  return _schema;
}
