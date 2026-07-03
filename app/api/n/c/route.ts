import { NextResponse, type NextRequest } from "next/server";
import { recordNewsletterHit } from "@/lib/newsletters";
import { SITE } from "@/lib/site";

/** Klick-Weiterleitung: zählt den Klick und leitet zum Ziel weiter. */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("c");
  const target = request.nextUrl.searchParams.get("u") ?? "";

  // Open-Redirect verhindern: nur die eigene Domain (oder relative Pfade).
  let dest: string = SITE.url;
  if (target.startsWith("/")) dest = `${SITE.url}${target}`;
  else if (target.startsWith(`${SITE.url}/`) || target === SITE.url) dest = target;

  if (id) {
    try {
      await recordNewsletterHit({ newsletterId: id, type: "click", url: dest });
    } catch {
      /* Tracking ist best-effort */
    }
  }
  return NextResponse.redirect(dest, 302);
}
