import { NextResponse, type NextRequest } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter-token";
import { unsubscribeByEmail } from "@/lib/contacts";
import { recordNewsletterHit } from "@/lib/newsletters";

async function unsubscribe(token: string): Promise<boolean> {
  const v = verifyUnsubscribeToken(token);
  if (!v) return false;
  try {
    await unsubscribeByEmail(v.email);
    return true;
  } catch (err) {
    console.error("[newsletter] Abmeldung fehlgeschlagen:", err);
    return false;
  }
}

/**
 * Klick auf den Abmeldelink (GET) → NICHT sofort austragen, sondern erst auf
 * die Bestätigungsseite leiten ("Wirklich abmelden?"). Das verhindert auch
 * versehentliche Abmeldungen durch Link-Scanner/Virenprüfer in Mail-Programmen.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const c = request.nextUrl.searchParams.get("c") ?? "";
  const q =
    `?token=${encodeURIComponent(token)}` +
    (c ? `&c=${encodeURIComponent(c)}` : "");
  return NextResponse.redirect(new URL(`/newsletter/abmelden${q}`, request.url));
}

/**
 * Abmeldung ausführen (POST). Zwei Quellen:
 *  - Mail-Client-One-Click (RFC 8058, List-Unsubscribe-Post) → Body enthält
 *    "List-Unsubscribe=One-Click" → leere 200-Antwort genügt.
 *  - Unser Bestätigungs-Button auf /newsletter/abmelden → Body hat "confirm" →
 *    danach auf die Abgemeldet-Seite weiterleiten (303, damit GET folgt).
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const c = request.nextUrl.searchParams.get("c") ?? "";
  const ok = await unsubscribe(token);

  let oneClick = false;
  let reason: string | null = null;
  try {
    const form = await request.formData();
    oneClick = form.has("List-Unsubscribe");
    const r = String(form.get("reason") ?? "").trim();
    const rt = String(form.get("reasonText") ?? "").trim();
    const parts: string[] = [];
    if (r && r !== "Sonstiges") parts.push(r);
    if (rt) parts.push(rt);
    if (r === "Sonstiges" && !rt) parts.push("Sonstiges");
    reason = parts.join(" – ").slice(0, 300) || null;
  } catch {
    /* kein/fremder Body → wie Bestätigung behandeln */
  }

  // Abmeldung (+ optionalem Grund) zurechnen.
  if (ok) {
    try {
      await recordNewsletterHit({
        newsletterId: c || "_global",
        type: "unsub",
        url: reason,
      });
    } catch {
      /* best-effort */
    }
  }

  if (oneClick) return new NextResponse(null, { status: 200 });

  return NextResponse.redirect(
    new URL(`/newsletter/abgemeldet?status=${ok ? "ok" : "ungueltig"}`, request.url),
    303,
  );
}
