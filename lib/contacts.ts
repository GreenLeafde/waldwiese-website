/**
 * Kontakt-Datenschicht (Newsletter-Liste) auf der eigenen DB.
 * Versand läuft über Resend, die Liste gehört aber uns — volle Kontrolle über
 * Hinzufügen / Bearbeiten / Löschen / Ab- & Anmelden.
 *
 * NUR server-seitig importieren.
 */

import { randomUUID } from "node:crypto";
import { getDb, ensureSchema } from "./db";

export type ContactStatus = "subscribed" | "unsubscribed" | "pending";

export type Contact = {
  id: string;
  email: string;
  name: string | null;
  status: ContactStatus;
  source: string | null;
  createdAt: number;
};

type Row = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  created_at: number | bigint;
};

function toContact(r: Row): Contact {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    status: (r.status as ContactStatus) ?? "subscribed",
    source: r.source,
    createdAt: Number(r.created_at),
  };
}

export async function listContacts(): Promise<Contact[]> {
  await ensureSchema();
  const res = await getDb().execute(
    "SELECT id, email, name, status, source, created_at FROM contacts ORDER BY created_at DESC",
  );
  return (res.rows as unknown as Row[]).map(toContact);
}

export async function countByStatus(): Promise<Record<ContactStatus, number>> {
  await ensureSchema();
  const res = await getDb().execute(
    "SELECT status, COUNT(*) AS c FROM contacts GROUP BY status",
  );
  const out: Record<ContactStatus, number> = {
    subscribed: 0,
    unsubscribed: 0,
    pending: 0,
  };
  for (const row of res.rows as unknown as { status: string; c: number | bigint }[]) {
    if (row.status in out) out[row.status as ContactStatus] = Number(row.c);
  }
  return out;
}

export async function listSubscribed(): Promise<Contact[]> {
  await ensureSchema();
  const res = await getDb().execute(
    "SELECT id, email, name, status, source, created_at FROM contacts WHERE status = 'subscribed' ORDER BY created_at DESC",
  );
  return (res.rows as unknown as Row[]).map(toContact);
}

/**
 * Fügt einen Kontakt hinzu oder hebt eine frühere Abmeldung wieder auf.
 * Gibt zurück, ob ein NEUER Kontakt angelegt wurde.
 */
export async function upsertContact(input: {
  email: string;
  name?: string | null;
  status?: ContactStatus;
  source?: string;
}): Promise<{ created: boolean }> {
  await ensureSchema();
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  const status = input.status ?? "subscribed";

  const existing = await db.execute({
    sql: "SELECT id FROM contacts WHERE email = ?",
    args: [email],
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: "UPDATE contacts SET status = ?, name = COALESCE(?, name) WHERE email = ?",
      args: [status, input.name ?? null, email],
    });
    return { created: false };
  }

  await db.execute({
    sql: "INSERT INTO contacts (id, email, name, status, source, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    args: [randomUUID(), email, input.name ?? null, status, input.source ?? null, Date.now()],
  });
  return { created: true };
}

/**
 * Massen-Upsert (für Datei-Import). Schreibt in Blöcken via einem einzigen
 * INSERT … ON CONFLICT pro Block — viel schneller als einzelne Round-Trips.
 * Bei vorhandener E-Mail werden Status (und Name, falls neu gesetzt) aktualisiert.
 * Gibt die Anzahl verarbeiteter Zeilen zurück.
 */
export async function bulkUpsertContacts(
  entries: {
    email: string;
    name?: string | null;
    status?: ContactStatus;
    source?: string;
  }[],
): Promise<number> {
  await ensureSchema();
  const db = getDb();
  const now = Date.now();
  const CHUNK = 300;
  let total = 0;

  for (let i = 0; i < entries.length; i += CHUNK) {
    const chunk = entries.slice(i, i + CHUNK);
    if (chunk.length === 0) continue;
    const values = chunk.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const args: (string | number | null)[] = [];
    for (const e of chunk) {
      args.push(
        randomUUID(),
        e.email.trim().toLowerCase(),
        e.name ?? null,
        e.status ?? "subscribed",
        e.source ?? null,
        now,
      );
    }
    await db.execute({
      sql: `INSERT INTO contacts (id, email, name, status, source, created_at)
            VALUES ${values}
            ON CONFLICT(email) DO UPDATE SET
              status = excluded.status,
              name = COALESCE(excluded.name, contacts.name)`,
      args,
    });
    total += chunk.length;
  }
  return total;
}

export async function updateContact(
  id: string,
  patch: { name?: string | null; status?: ContactStatus },
): Promise<void> {
  await ensureSchema();
  const sets: string[] = [];
  const args: (string | null)[] = [];
  if (patch.name !== undefined) {
    sets.push("name = ?");
    args.push(patch.name);
  }
  if (patch.status !== undefined) {
    sets.push("status = ?");
    args.push(patch.status);
  }
  if (sets.length === 0) return;
  args.push(id);
  await getDb().execute({
    sql: `UPDATE contacts SET ${sets.join(", ")} WHERE id = ?`,
    args,
  });
}

export async function removeContact(id: string): Promise<void> {
  await ensureSchema();
  await getDb().execute({ sql: "DELETE FROM contacts WHERE id = ?", args: [id] });
}

export async function unsubscribeByEmail(email: string): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: "UPDATE contacts SET status = 'unsubscribed' WHERE email = ?",
    args: [email.trim().toLowerCase()],
  });
}
