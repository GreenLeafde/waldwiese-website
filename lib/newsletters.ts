/**
 * Datenschicht für versendete Newsletter + deren Tracking (Öffnungen, Klicks,
 * Abmeldungen). Anonym: es werden KEINE Empfänger gespeichert, nur Zähl-Treffer
 * pro Kampagne. NUR server-seitig importieren.
 */

import { randomUUID } from "node:crypto";
import { getDb, ensureSchema } from "./db";

export type Newsletter = {
  id: string;
  name: string | null;
  subject: string;
  html: string;
  headerTitle: string | null;
  headerTagline: string | null;
  headerStyle: string | null;
  showHeader: boolean;
  bare: boolean;
  recipientCount: number;
  sentAt: number;
  sentAtLabel: string;
  /** Geplanter Auslieferungszeitpunkt (ms). `null` = sofort/bereits raus. */
  scheduledAt: number | null;
  scheduledAtLabel: string | null;
};

const DATE_FMT = "'%d.%m.%Y, %H:%M'";

export type NewsletterListItem = Newsletter & {
  opens: number;
  clicks: number;
  unsubs: number;
  sentCount: number;
};

export type NewsletterStats = {
  opens: number;
  clicks: number;
  unsubs: number;
  reservationClicks: number;
  firstOpenLabel: string | null;
  lastOpenLabel: string | null;
  linkClicks: { url: string; count: number }[];
  reasons: { reason: string; count: number }[];
};

export type HitType = "open" | "click" | "unsub";

function num(v: number | bigint | null | undefined): number {
  return v == null ? 0 : Number(v);
}

/** Legt eine Kampagne an (beim Versand) und gibt die ID zurück. */
export async function createNewsletter(input: {
  name?: string | null;
  subject: string;
  html: string;
  header?: { title?: string; tagline?: string; style?: string } | null;
  showHeader?: boolean;
  bare?: boolean;
  recipientCount: number;
  /** Geplanter Versand (ms). Weglassen/null = sofort. */
  scheduledAt?: number | null;
}): Promise<string> {
  await ensureSchema();
  const id = randomUUID();
  await getDb().execute({
    sql: `INSERT INTO newsletters
            (id, name, subject, html, header_title, header_tagline, header_style, show_header, bare, recipient_count, sent_at, scheduled_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.name?.trim() || null,
      input.subject,
      input.html,
      input.header?.title ?? null,
      input.header?.tagline ?? null,
      input.header?.style ?? null,
      input.showHeader === false ? 0 : 1,
      input.bare ? 1 : 0,
      input.recipientCount,
      Date.now(),
      input.scheduledAt ?? null,
    ],
  });
  return id;
}

/**
 * Hält fest, an welche Adressen eine Kampagne ERFOLGREICH versendet wurde
 * (für Duplikat-Schutz beim Weitersenden). Composite-PK ignoriert Doppelte.
 */
export async function recordSends(
  newsletterId: string,
  emails: string[],
): Promise<void> {
  if (emails.length === 0) return;
  await ensureSchema();
  const db = getDb();
  const now = Date.now();
  const CHUNK = 300;
  for (let i = 0; i < emails.length; i += CHUNK) {
    const chunk = emails.slice(i, i + CHUNK);
    const values = chunk.map(() => "(?, ?, ?)").join(", ");
    const args: (string | number)[] = [];
    for (const e of chunk) args.push(newsletterId, e.trim().toLowerCase(), now);
    await db.execute({
      sql: `INSERT OR IGNORE INTO newsletter_sends (newsletter_id, email, created_at) VALUES ${values}`,
      args,
    });
  }
}

/** Adressen, die diese Kampagne schon erhalten haben. */
export async function getSentEmails(newsletterId: string): Promise<Set<string>> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "SELECT email FROM newsletter_sends WHERE newsletter_id = ?",
    args: [newsletterId],
  });
  return new Set(
    (res.rows as unknown as { email: string }[]).map((r) => r.email),
  );
}

/** Zählt einen Treffer (Öffnung/Klick/Abmeldung) für eine Kampagne. */
export async function recordNewsletterHit(input: {
  newsletterId: string;
  type: HitType;
  url?: string | null;
}): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: "INSERT INTO newsletter_hits (newsletter_id, type, url, created_at) VALUES (?, ?, ?, ?)",
    args: [input.newsletterId, input.type, input.url ?? null, Date.now()],
  });
}

function toNewsletter(r: Record<string, unknown>): Newsletter {
  return {
    id: String(r.id),
    name: (r.name as string | null) ?? null,
    subject: String(r.subject),
    html: String(r.html),
    headerTitle: (r.header_title as string | null) ?? null,
    headerTagline: (r.header_tagline as string | null) ?? null,
    headerStyle: (r.header_style as string | null) ?? null,
    showHeader: r.show_header == null ? true : Number(r.show_header) !== 0,
    bare: r.bare == null ? false : Number(r.bare) !== 0,
    recipientCount: num(r.recipient_count as number | bigint),
    sentAt: num(r.sent_at as number | bigint),
    sentAtLabel: String(r.sent_label ?? ""),
    scheduledAt: r.scheduled_at == null ? null : num(r.scheduled_at as number | bigint),
    scheduledAtLabel: (r.scheduled_label as string | null) || null,
  };
}

/** Alle Kampagnen (neueste zuerst) mit aggregierten Zählern. */
export async function listNewslettersWithStats(): Promise<NewsletterListItem[]> {
  await ensureSchema();
  const res = await getDb().execute(
    `SELECT n.*,
       strftime(${DATE_FMT}, n.sent_at/1000, 'unixepoch', 'localtime') AS sent_label,
       strftime(${DATE_FMT}, n.scheduled_at/1000, 'unixepoch', 'localtime') AS scheduled_label,
       (SELECT COUNT(*) FROM newsletter_hits h WHERE h.newsletter_id = n.id AND h.type='open')  AS opens,
       (SELECT COUNT(*) FROM newsletter_hits h WHERE h.newsletter_id = n.id AND h.type='click') AS clicks,
       (SELECT COUNT(*) FROM newsletter_hits h WHERE h.newsletter_id = n.id AND h.type='unsub') AS unsubs,
       (SELECT COUNT(*) FROM newsletter_sends s WHERE s.newsletter_id = n.id)                   AS sent_count
     FROM newsletters n
     ORDER BY n.sent_at DESC`,
  );
  return (res.rows as unknown as Record<string, unknown>[]).map((r) => ({
    ...toNewsletter(r),
    opens: num(r.opens as number | bigint),
    clicks: num(r.clicks as number | bigint),
    unsubs: num(r.unsubs as number | bigint),
    sentCount: num(r.sent_count as number | bigint),
  }));
}

/** Kampagnen, die noch nicht an alle raus sind (für „fortsetzen"-Auswahl). */
export async function listOpenCampaigns(): Promise<
  { id: string; label: string; sentCount: number; recipientCount: number }[]
> {
  await ensureSchema();
  const res = await getDb().execute(
    `SELECT n.id, COALESCE(NULLIF(n.name, ''), n.subject) AS label, n.recipient_count,
       (SELECT COUNT(*) FROM newsletter_sends s WHERE s.newsletter_id = n.id) AS sent_count
     FROM newsletters n
     ORDER BY n.sent_at DESC`,
  );
  return (
    res.rows as unknown as {
      id: string;
      label: string;
      recipient_count: number | bigint;
      sent_count: number | bigint;
    }[]
  )
    .map((r) => ({
      id: r.id,
      label: r.label,
      sentCount: num(r.sent_count),
      recipientCount: num(r.recipient_count),
    }))
    .filter((c) => c.sentCount < c.recipientCount);
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `SELECT *, strftime(${DATE_FMT}, sent_at/1000, 'unixepoch', 'localtime') AS sent_label,
            strftime(${DATE_FMT}, scheduled_at/1000, 'unixepoch', 'localtime') AS scheduled_label
          FROM newsletters WHERE id = ?`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  return toNewsletter(res.rows[0] as unknown as Record<string, unknown>);
}

/** Detail-Statistik einer Kampagne. */
export async function getNewsletterStats(id: string): Promise<NewsletterStats> {
  await ensureSchema();
  const db = getDb();

  const agg = await db.execute({
    sql: `SELECT
       SUM(CASE WHEN type='open'  THEN 1 ELSE 0 END) AS opens,
       SUM(CASE WHEN type='click' THEN 1 ELSE 0 END) AS clicks,
       SUM(CASE WHEN type='unsub' THEN 1 ELSE 0 END) AS unsubs,
       SUM(CASE WHEN type='click' AND url LIKE '%/reservieren%' THEN 1 ELSE 0 END) AS reservation_clicks,
       strftime(${DATE_FMT}, MIN(CASE WHEN type='open' THEN created_at END)/1000, 'unixepoch', 'localtime') AS first_open_label,
       strftime(${DATE_FMT}, MAX(CASE WHEN type='open' THEN created_at END)/1000, 'unixepoch', 'localtime') AS last_open_label
     FROM newsletter_hits WHERE newsletter_id = ?`,
    args: [id],
  });
  const a = (agg.rows[0] ?? {}) as unknown as Record<string, number | bigint | string | null>;

  const links = await db.execute({
    sql: `SELECT url, COUNT(*) AS c
          FROM newsletter_hits
          WHERE newsletter_id = ? AND type='click' AND url IS NOT NULL
          GROUP BY url ORDER BY c DESC LIMIT 20`,
    args: [id],
  });

  const reasons = await db.execute({
    sql: `SELECT url AS reason, COUNT(*) AS c
          FROM newsletter_hits
          WHERE newsletter_id = ? AND type='unsub' AND url IS NOT NULL AND url <> ''
          GROUP BY url ORDER BY c DESC LIMIT 30`,
    args: [id],
  });

  return {
    opens: num(a.opens as number | bigint),
    clicks: num(a.clicks as number | bigint),
    unsubs: num(a.unsubs as number | bigint),
    reservationClicks: num(a.reservation_clicks as number | bigint),
    firstOpenLabel: (a.first_open_label as string | null) ?? null,
    lastOpenLabel: (a.last_open_label as string | null) ?? null,
    linkClicks: (links.rows as unknown as { url: string; c: number | bigint }[]).map(
      (r) => ({ url: r.url, count: num(r.c) }),
    ),
    reasons: (
      reasons.rows as unknown as { reason: string; c: number | bigint }[]
    ).map((r) => ({ reason: r.reason, count: num(r.c) })),
  };
}
