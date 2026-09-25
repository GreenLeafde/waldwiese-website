import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Absicherung der Cron-Routen (/api/cron/*).
 *
 * Ist CRON_SECRET gesetzt, schickt Vercel bei jedem Cron-Aufruf
 * `Authorization: Bearer $CRON_SECRET` mit — das ist der eigentliche Schutz.
 * Ist die Variable (noch) nicht gesetzt, lassen wir Vercels eigenen Aufruf
 * durch: erkennbar am User-Agent `vercel-cron/1.0`. Ein fremder Aufruf könnte
 * ohnehin nur anstoßen, was sowieso fällig ist — nie früher, nie doppelt.
 *
 * Bei Ablehnung wird der Grund geloggt, damit in den Vercel-Logs sofort
 * erkennbar ist, WARUM ein Cron nicht lief (statt nur „401").
 */
export function cronAuthorized(request: NextRequest, route: string): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = (request.headers.get("authorization") ?? "").trim();
  const ua = request.headers.get("user-agent") ?? "";

  if (secret) {
    const got = Buffer.from(auth);
    const want = Buffer.from(`Bearer ${secret}`);
    if (got.length === want.length && timingSafeEqual(got, want)) return true;
    console.error(
      `[${route}] abgelehnt: CRON_SECRET ist gesetzt, aber der Authorization-Header passt nicht` +
        ` (Header ${auth ? "vorhanden" : "fehlt"}, User-Agent "${ua}").` +
        ` Prüfen: CRON_SECRET auf Vercel ohne Leerzeichen/Zeilenumbruch und nach dem Setzen neu deployen.`,
    );
    return false;
  }

  if (ua.startsWith("vercel-cron/") || request.headers.get("x-vercel-cron") != null) {
    return true;
  }
  console.error(
    `[${route}] abgelehnt: kein CRON_SECRET gesetzt und Aufruf kommt nicht von Vercel-Cron (User-Agent "${ua}").`,
  );
  return false;
}
