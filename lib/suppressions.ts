/**
 * Sperrliste: Adressen, die von JEDEM Versand ausgeschlossen werden
 * (harte Bounces, Spam-Beschwerden, manuell blockierte). Schützt die
 * Absender-Reputation. NUR server-seitig importieren.
 */

import { getDb, ensureSchema } from "./db";

export type Suppression = {
  email: string;
  reason: string | null;
  createdAt: number;
};

/** Fügt Adressen zur Sperrliste hinzu (Duplikate werden zusammengeführt). */
export async function addSuppressions(
  entries: { email: string; reason?: string | null }[],
): Promise<number> {
  await ensureSchema();
  const db = getDb();
  const now = Date.now();
  const CHUNK = 300;
  let total = 0;

  for (let i = 0; i < entries.length; i += CHUNK) {
    const seen = new Set<string>();
    const rows: { email: string; reason: string | null }[] = [];
    for (const e of entries.slice(i, i + CHUNK)) {
      const email = e.email.trim().toLowerCase();
      if (!email || seen.has(email)) continue;
      seen.add(email);
      rows.push({ email, reason: e.reason ?? null });
    }
    if (rows.length === 0) continue;

    const values = rows.map(() => "(?, ?, ?)").join(", ");
    const args: (string | number | null)[] = [];
    for (const r of rows) args.push(r.email, r.reason, now);
    await db.execute({
      sql: `INSERT INTO suppressions (email, reason, created_at) VALUES ${values}
            ON CONFLICT(email) DO UPDATE SET reason = COALESCE(excluded.reason, suppressions.reason)`,
      args,
    });
    total += rows.length;
  }
  return total;
}

/** Alle gesperrten Adressen (klein geschrieben) — zum Filtern beim Versand. */
export async function getSuppressedEmails(): Promise<Set<string>> {
  await ensureSchema();
  const res = await getDb().execute("SELECT email FROM suppressions");
  return new Set((res.rows as unknown as { email: string }[]).map((r) => r.email));
}

export async function listSuppressions(): Promise<Suppression[]> {
  await ensureSchema();
  const res = await getDb().execute(
    "SELECT email, reason, created_at FROM suppressions ORDER BY created_at DESC",
  );
  return (
    res.rows as unknown as {
      email: string;
      reason: string | null;
      created_at: number | bigint;
    }[]
  ).map((r) => ({ email: r.email, reason: r.reason, createdAt: Number(r.created_at) }));
}

export async function countSuppressions(): Promise<number> {
  await ensureSchema();
  const res = await getDb().execute("SELECT COUNT(*) AS c FROM suppressions");
  return Number((res.rows[0] as unknown as { c: number | bigint }).c);
}

export async function removeSuppression(email: string): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: "DELETE FROM suppressions WHERE email = ?",
    args: [email.trim().toLowerCase()],
  });
}
