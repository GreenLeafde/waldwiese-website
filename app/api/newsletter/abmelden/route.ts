import { NextResponse, type NextRequest } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter-token";
import { unsubscribeByEmail } from "@/lib/contacts";

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

/** Klick auf den Abmeldelink → austragen, dann auf die Bestätigungsseite. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const ok = await unsubscribe(token);
  return NextResponse.redirect(
    new URL(`/newsletter/abgemeldet?status=${ok ? "ok" : "ungueltig"}`, request.url),
  );
}

/** One-Click-Abmeldung (List-Unsubscribe-Post) — vom Mail-Client aufgerufen. */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  await unsubscribe(token);
  return new NextResponse(null, { status: 200 });
}
