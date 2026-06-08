import { NextResponse, type NextRequest } from "next/server";
import { verifySubscriptionToken } from "@/lib/newsletter-token";
import { upsertContact } from "@/lib/contacts";
import { recordEvent } from "@/lib/analytics";

/**
 * Double-Opt-in Schritt 2: Bestätigungslink aus der Mail.
 * Prüft den signierten Token und schreibt die E-Mail dann als bestätigten
 * Kontakt in unsere Newsletter-Liste (DB). Danach Weiterleitung auf die
 * Erfolgsseite.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const verified = verifySubscriptionToken(token);

  const redirect = (status: string) =>
    NextResponse.redirect(
      new URL(`/newsletter/bestaetigt?status=${status}`, request.url),
    );

  if (!verified) {
    return redirect("ungueltig");
  }

  try {
    await upsertContact({
      email: verified.email,
      status: "subscribed",
      source: "sommelier",
    });
    await recordEvent({ type: "newsletter_confirmed" }).catch(() => {});
  } catch (err) {
    console.error("[newsletter] Kontakt speichern fehlgeschlagen:", err);
    // Token war gültig — Nutzer trotzdem nicht im Regen stehen lassen.
  }

  return redirect("ok");
}
