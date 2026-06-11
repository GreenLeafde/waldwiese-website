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
          created_at  INTEGER NOT NULL
        )`,
        `CREATE INDEX IF NOT EXISTS idx_events_type_time ON events (type, created_at)`,
        `CREATE INDEX IF NOT EXISTS idx_events_time ON events (created_at)`,
      ],
      "write",
    );
  })();
  return _schema;
}
