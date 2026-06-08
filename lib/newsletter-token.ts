/**
 * Signierte, stateless Tokens (HMAC-SHA256) rund um den Newsletter.
 *
 * - Double-Opt-in-Bestätigung ("sub"): 7 Tage gültig.
 * - Abmeldung ("unsub"): KEIN Ablauf — Abmeldelinks müssen dauerhaft
 *   funktionieren (gesetzliche Anforderung).
 *
 * Das Purpose-Feld verhindert, dass ein Token für den jeweils anderen Zweck
 * benutzt werden kann. NUR server-seitig importieren (node:crypto).
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const SUB_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

type Purpose = "sub" | "unsub";

function secret(): string {
  return process.env.NEWSLETTER_SECRET ?? "";
}

function hmac(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

function sign(email: string, purpose: Purpose): string {
  const payload = JSON.stringify({ e: email.toLowerCase(), p: purpose, t: Date.now() });
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${hmac(body)}`;
}

function verify(
  token: string,
  purpose: Purpose,
  maxAgeMs?: number,
): { email: string } | null {
  if (!secret()) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = hmac(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      e?: unknown;
      p?: unknown;
      t?: unknown;
    };
    if (typeof parsed.e !== "string" || typeof parsed.t !== "number") return null;
    if (parsed.p !== purpose) return null;
    if (maxAgeMs !== undefined && Date.now() - parsed.t > maxAgeMs) return null;
    return { email: parsed.e };
  } catch {
    return null;
  }
}

export function signSubscriptionToken(email: string): string {
  return sign(email, "sub");
}

export function verifySubscriptionToken(token: string): { email: string } | null {
  return verify(token, "sub", SUB_MAX_AGE_MS);
}

export function signUnsubscribeToken(email: string): string {
  return sign(email, "unsub");
}

export function verifyUnsubscribeToken(token: string): { email: string } | null {
  return verify(token, "unsub");
}
