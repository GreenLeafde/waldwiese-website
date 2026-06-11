/**
 * First-Party-Analytics auf der eigenen DB (events-Tabelle).
 * Anonym: KEINE Cookies, KEINE IP, keine personenbezogenen Daten — nur
 * Ereignis-Typ, Pfad und ein optionales Label.
 *
 * NUR server-seitig importieren.
 */

import { getDb, ensureSchema } from "./db";

export const EVENT_TYPES = [
  "pageview",
  "cta_click",
  "reservation_open",
  "sommelier_complete",
  "newsletter_signup",
  "newsletter_confirmed",
  "contact_submit",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export function isEventType(v: unknown): v is EventType {
  return typeof v === "string" && (EVENT_TYPES as readonly string[]).includes(v);
}

/**
 * Start-Zeitpunkt für einen Zeitraum in Tagen.
 * `days <= 1` → ab Mitternacht heute, sonst rollierend ab jetzt.
 * (Hier, nicht in den Server-Komponenten — dort verbietet der Linter Date.now().)
 */
export function cutoffMs(days: number): number {
  if (days <= 1) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export async function recordEvent(input: {
  type: EventType;
  path?: string | null;
  label?: string | null;
}): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: "INSERT INTO events (type, path, label, created_at) VALUES (?, ?, ?, ?)",
    args: [input.type, input.path ?? null, input.label ?? null, Date.now()],
  });
}

function num(v: number | bigint | null | undefined): number {
  return v == null ? 0 : Number(v);
}

/** Anzahl je Event-Typ seit `sinceMs`. */
export async function eventCounts(sinceMs: number): Promise<Record<string, number>> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "SELECT type, COUNT(*) AS c FROM events WHERE created_at >= ? AND (path IS NULL OR path NOT LIKE '/__%') GROUP BY type",
    args: [sinceMs],
  });
  const out: Record<string, number> = {};
  for (const row of res.rows as unknown as { type: string; c: number | bigint }[]) {
    out[row.type] = num(row.c);
  }
  return out;
}

/** Aufrufe pro Tag (für das Balkendiagramm), aufsteigend nach Datum. */
export async function dailyPageviews(
  sinceMs: number,
): Promise<{ day: string; count: number }[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT date(created_at / 1000, 'unixepoch', 'localtime') AS day, COUNT(*) AS c
          FROM events
          WHERE type = 'pageview' AND created_at >= ? AND path NOT LIKE '/__%'
          GROUP BY day ORDER BY day ASC`,
    args: [sinceMs],
  });
  return (res.rows as unknown as { day: string; c: number | bigint }[]).map((r) => ({
    day: r.day,
    count: num(r.c),
  }));
}

/** Meistbesuchte Seiten seit `sinceMs`. */
export async function topPaths(
  sinceMs: number,
  limit = 10,
): Promise<{ path: string; count: number }[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT COALESCE(path, '—') AS path, COUNT(*) AS c
          FROM events
          WHERE type = 'pageview' AND created_at >= ? AND path NOT LIKE '/__%'
          GROUP BY path ORDER BY c DESC LIMIT ?`,
    args: [sinceMs, limit],
  });
  return (res.rows as unknown as { path: string; c: number | bigint }[]).map((r) => ({
    path: r.path,
    count: num(r.c),
  }));
}

/** Meistgeklickte CTAs (Label) seit `sinceMs`. */
export async function topCtas(
  sinceMs: number,
  limit = 8,
): Promise<{ label: string; count: number }[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT COALESCE(label, '—') AS label, COUNT(*) AS c
          FROM events
          WHERE type = 'cta_click' AND created_at >= ?
          GROUP BY label ORDER BY c DESC LIMIT ?`,
    args: [sinceMs, limit],
  });
  return (res.rows as unknown as { label: string; c: number | bigint }[]).map((r) => ({
    label: r.label,
    count: num(r.c),
  }));
}
