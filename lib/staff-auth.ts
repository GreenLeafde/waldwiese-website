/**
 * Anmeldung fuer den Team-Bereich (Schichtplan + Stempeluhr).
 *
 * Anders als das Backend-Login (ein gemeinsames Passwort, siehe admin-auth.ts)
 * meldet sich hier JEDE Person einzeln an — sonst waeren die gestempelten
 * Zeiten nicht zuordenbar. Geprueft wird gegen die Mitarbeiter-Tabelle des
 * Hotel-Backends (siehe staff-db.ts), damit es nur EINE Mitarbeiterliste gibt.
 *
 * Die Sitzung liegt in einem HMAC-signierten Cookie — kein Datenbank-Lookup
 * bei jedem Klick, kein Passwort im Cookie.
 *
 * Env:
 *   STAFF_SESSION_SECRET  — optional. Fehlt er, wird ADMIN_SESSION_SECRET mit
 *                           einem festen Zusatz abgeleitet, damit ein
 *                           Team-Cookie NIE als Backend-Cookie gilt.
 *
 * NUR server-seitig importieren.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

export const STAFF_COOKIE = "ww_team";
export const STAFF_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 Tage

export type StaffSession = {
  id: string;
  name: string;
  email: string;
  role: string | null;
};

function secret(): string {
  const own = (process.env.STAFF_SESSION_SECRET ?? "").trim();
  if (own) return own;
  const shared = (process.env.ADMIN_SESSION_SECRET ?? "").trim();
  // Abgeleitet, nicht identisch: ein Team-Cookie darf im Backend nicht gelten.
  return shared ? `${shared}:team` : "";
}

export function createStaffToken(s: StaffSession): string {
  const body = Buffer.from(JSON.stringify({ ...s, iat: Date.now() })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readStaffToken(token: string | undefined): StaffSession | null {
  if (!token || !secret()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as
      StaffSession & { iat?: unknown };
    if (typeof data.iat !== "number") return null;
    if (Date.now() - data.iat > STAFF_COOKIE_MAX_AGE * 1000) return null;
    if (!data.id || !data.name) return null;
    return { id: data.id, name: data.name, email: data.email, role: data.role ?? null };
  } catch {
    return null;
  }
}

/** Angemeldete Person oder null. */
export async function currentStaff(): Promise<StaffSession | null> {
  const store = await cookies();
  return readStaffToken(store.get(STAFF_COOKIE)?.value);
}

/** In geschuetzten Seiten/Actions aufrufen — leitet sonst zum Team-Login. */
export async function requireStaff(): Promise<StaffSession> {
  const staff = await currentStaff();
  if (!staff) redirect("/team/login");
  return staff;
}
