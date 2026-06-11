/**
 * Admin-Login mit EINEM gemeinsamen Passwort (für das Team).
 * Nach erfolgreichem Login wird ein HMAC-signiertes Session-Cookie gesetzt —
 * kein Datenbank-Bedarf, kein Klartext-Passwort im Cookie.
 *
 * Env:
 *   ADMIN_PASSWORD        — das gemeinsame Passwort
 *   ADMIN_SESSION_SECRET  — langer Zufallswert zum Signieren der Session
 *
 * NUR server-seitig importieren (node:crypto + next/headers).
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "ww_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 Tage

function secret(): string {
  // .trim(): robust gegen ein versehentlich angehängtes Zeilenende beim Setzen
  // der Env-Variable (z. B. via CLI-Pipe).
  return (process.env.ADMIN_SESSION_SECRET ?? "").trim();
}

/** true, wenn Passwort UND Session-Secret konfiguriert sind. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

/** Zeitkonstanter Passwortvergleich (über SHA-256, damit Längen nicht leaken). */
export function verifyPassword(input: string): boolean {
  const pw = (process.env.ADMIN_PASSWORD ?? "").trim();
  const given = input.trim();
  if (!pw || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(pw).digest();
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const body = Buffer.from(JSON.stringify({ iat: Date.now() })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const { iat } = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      iat?: unknown;
    };
    if (typeof iat !== "number") return false;
    if (Date.now() - iat > ADMIN_COOKIE_MAX_AGE * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** In geschützten Server-Komponenten/Actions aufrufen — leitet sonst zum Login. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}
