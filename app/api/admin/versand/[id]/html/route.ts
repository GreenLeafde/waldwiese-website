/**
 * HTML-Export einer einzelnen versendeten Kampagne (Admin-only).
 *
 *   GET /api/admin/versand/<id>/html                  → komplette E-Mail
 *   GET /api/admin/versand/<id>/html?variante=inhalt  → nur der Editor-Inhalt
 *
 * „voll" ist die Mail wie versendet (Kopf + Inhalt + Impressum-Footer als
 * vollständiges HTML-Dokument), aber ohne Klick-Umleitung und Zähl-Pixel.
 * „inhalt" ist das unveränderte Composer-HTML inkl. {{vorname}}-Platzhaltern —
 * die richtige Vorlage zum Wiederverwenden.
 *
 * Route-Handler laufen NICHT durch das Admin-Layout → Auth hier explizit.
 */

import type { NextRequest } from "next/server";

import { isAuthed } from "@/lib/admin-auth";
import { getNewsletter } from "@/lib/newsletters";
import { renderFullEmail, slugify } from "@/lib/newsletter-export";

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/versand/[id]/html">,
) {
  if (!(await isAuthed())) {
    return new Response("Nicht angemeldet.", { status: 401 });
  }

  const { id } = await ctx.params;
  const nl = await getNewsletter(id).catch(() => null);
  if (!nl) return new Response("Newsletter nicht gefunden.", { status: 404 });

  const nurInhalt =
    request.nextUrl.searchParams.get("variante") === "inhalt";
  const html = nurInhalt ? nl.html : renderFullEmail(nl);

  const datum = new Date(nl.sentAt).toISOString().slice(0, 10);
  const name = `${datum}-${slugify(nl.name || nl.subject)}${
    nurInhalt ? "-inhalt" : ""
  }.html`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}
