import { NextResponse, type NextRequest } from "next/server";
import { pruefeAbmeldeToken, sperreLead } from "@/lib/akquise";

/**
 * Abmeldung aus einer Akquise-Mail (lib/akquise.ts). Wie im Natuerlich: ein
 * Klick genuegt, der Kontakt wird gesperrt und nie wieder angeschrieben.
 *
 *  - GET (Klick auf den Link): sperrt sofort und zeigt das Ergebnis auf
 *    /akquise-abmelden.
 *  - POST: Ein-Klick aus dem Mailprogramm selbst (RFC 8058, Body
 *    "List-Unsubscribe=One-Click"). Leere 200-Antwort genuegt.
 *
 * Der Link ist signiert (abmeldeToken), ohne Signatur laesst sich niemand
 * sperren.
 */
async function sperre(t: string, wer: string): Promise<boolean> {
  const id = pruefeAbmeldeToken(t);
  if (!id) return false;
  try {
    return await sperreLead(id, wer);
  } catch (err) {
    console.error("[akquise] Abmeldung fehlgeschlagen:", err);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const ok = await sperre(request.nextUrl.searchParams.get("t") ?? "", "Empfänger");
  return NextResponse.redirect(
    new URL(`/akquise-abmelden?status=${ok ? "ok" : "ungueltig"}`, request.url),
  );
}

export async function POST(request: NextRequest) {
  await sperre(request.nextUrl.searchParams.get("t") ?? "", "Mailprogramm");
  return new NextResponse(null, { status: 200 });
}
