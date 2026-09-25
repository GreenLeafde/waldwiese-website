import { NextResponse, type NextRequest } from "next/server";
import { recordNewsletterHit } from "@/lib/newsletters";
import { decodeEntities } from "@/lib/newsletter-shell";
import { verifyClickTarget } from "@/lib/newsletter-token";
import { SITE } from "@/lib/site";

/**
 * Hosts, auf die auch OHNE Signatur weitergeleitet wird. Nötig für Newsletter,
 * die vor der Signatur-Einführung (25.09.2026) rausgingen — deren Links tragen
 * kein `s=`. Alles andere Fremde braucht die Signatur aus `trackContentLinks`.
 */
const TRUSTED_HOSTS = new Set([
  "das-kriminal-dinner.de",
  "www.das-kriminal-dinner.de",
  "mylightspeed.app",
  "search.google.com",
  "www.google.com",
  "g.page",
  "www.instagram.com",
  "instagram.com",
  "www.facebook.com",
  "facebook.com",
]);

/** Klick-Weiterleitung: zählt den Klick und leitet zum Ziel weiter. */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("c");
  const sig = request.nextUrl.searchParams.get("s") ?? "";
  // Ältere Mails haben `&amp;` wörtlich im Ziel — wieder zu `&` machen.
  const target = decodeEntities(request.nextUrl.searchParams.get("u") ?? "").trim();

  // Open-Redirect verhindern: eigene Domain immer; Fremdes nur signiert oder
  // von bekannten Partnern. Sonst freundlich auf die Startseite.
  let dest: string = SITE.url;
  if (target.startsWith("/")) {
    dest = `${SITE.url}${target}`;
  } else if (target.startsWith(`${SITE.url}/`) || target === SITE.url) {
    dest = target;
  } else if (/^https?:\/\//i.test(target)) {
    try {
      const host = new URL(target).hostname.toLowerCase();
      if (verifyClickTarget(target, sig) || TRUSTED_HOSTS.has(host)) dest = target;
    } catch {
      /* kaputte URL → Startseite */
    }
  }

  if (id) {
    try {
      await recordNewsletterHit({ newsletterId: id, type: "click", url: dest });
    } catch {
      /* Tracking ist best-effort */
    }
  }
  return NextResponse.redirect(dest, 302);
}
