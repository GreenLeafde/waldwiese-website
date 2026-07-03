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
  "page_time",
  "cta_click",
  "reservation_open",
  "sommelier_complete",
  "newsletter_signup",
  "newsletter_confirmed",
  "contact_submit",
  "application_submit",
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
  referrer?: string | null;
  country?: string | null;
  duration?: number | null;
}): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: "INSERT INTO events (type, path, label, referrer, country, duration, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [
      input.type,
      input.path ?? null,
      input.label ?? null,
      input.referrer ?? null,
      input.country ?? null,
      input.duration ?? null,
      Date.now(),
    ],
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

/** Klickrate: CTA-Klicks je Seitenaufruf. */
export async function ctrStats(
  sinceMs: number,
): Promise<{ pageviews: number; ctaClicks: number; ctr: number }> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT
       SUM(CASE WHEN type='pageview'  AND (path IS NULL OR path NOT LIKE '/__%') THEN 1 ELSE 0 END) AS pv,
       SUM(CASE WHEN type='cta_click' THEN 1 ELSE 0 END) AS cta
     FROM events WHERE created_at >= ?`,
    args: [sinceMs],
  });
  const r = (res.rows[0] ?? {}) as unknown as { pv: number | bigint | null; cta: number | bigint | null };
  const pv = num(r.pv);
  const cta = num(r.cta);
  return { pageviews: pv, ctaClicks: cta, ctr: pv > 0 ? Math.round((cta / pv) * 1000) / 10 : 0 };
}

/** Woher die Besucher kamen (Referrer-Domain). */
export async function topReferrers(
  sinceMs: number,
  limit = 8,
): Promise<{ referrer: string; count: number }[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT COALESCE(NULLIF(referrer, ''), 'Direkt') AS referrer, COUNT(*) AS c
          FROM events
          WHERE type='pageview' AND created_at >= ? AND (path IS NULL OR path NOT LIKE '/__%')
          GROUP BY referrer ORDER BY c DESC LIMIT ?`,
    args: [sinceMs, limit],
  });
  return (res.rows as unknown as { referrer: string; c: number | bigint }[]).map((r) => ({
    referrer: r.referrer,
    count: num(r.c),
  }));
}

/** Grobe Herkunft (Land, aus dem Geo-Header — KEINE IP gespeichert). */
export async function topCountries(
  sinceMs: number,
  limit = 8,
): Promise<{ country: string; count: number }[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT COUNTRY AS country, COUNT(*) AS c FROM (
            SELECT COALESCE(NULLIF(country, ''), '—') AS COUNTRY
            FROM events
            WHERE type='pageview' AND created_at >= ? AND (path IS NULL OR path NOT LIKE '/__%')
          ) GROUP BY country ORDER BY c DESC LIMIT ?`,
    args: [sinceMs, limit],
  });
  return (res.rows as unknown as { country: string; c: number | bigint }[]).map((r) => ({
    country: r.country,
    count: num(r.c),
  }));
}

/** Durchschnittliche Verweildauer pro Seite in Sekunden. */
export async function avgDuration(sinceMs: number): Promise<number> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT AVG(duration) AS d FROM events
          WHERE type='page_time' AND created_at >= ? AND duration IS NOT NULL
            AND duration > 0 AND duration < 3600`,
    args: [sinceMs],
  });
  const d = (res.rows[0] as unknown as { d: number | null })?.d;
  return d == null ? 0 : Math.round(Number(d));
}

/** Tagesreihe für einen Event-Typ (z. B. Newsletter-Anmeldungen). */
export async function dailyByType(
  sinceMs: number,
  type: EventType,
): Promise<{ day: string; count: number }[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT date(created_at / 1000, 'unixepoch', 'localtime') AS day, COUNT(*) AS c
          FROM events WHERE type = ? AND created_at >= ?
          GROUP BY day ORDER BY day ASC`,
    args: [type, sinceMs],
  });
  return (res.rows as unknown as { day: string; c: number | bigint }[]).map((r) => ({
    day: r.day,
    count: num(r.c),
  }));
}
