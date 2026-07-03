import { NextResponse, type NextRequest } from "next/server";
import { isEventType, recordEvent } from "@/lib/analytics";

/**
 * Nimmt anonyme First-Party-Events vom Client entgegen (Seitenaufrufe,
 * CTA-Klicks, Verweildauer, …). Speichert KEINE IP und KEINE Cookies.
 * `country` kommt grob aus dem Geo-Header der Edge (nur Ländercode, die IP
 * selbst wird NICHT gespeichert). `referrer` ist nur die Quell-Domain.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { type, path, label, referrer, duration } = (body ?? {}) as {
    type?: unknown;
    path?: unknown;
    label?: unknown;
    referrer?: unknown;
    duration?: unknown;
  };

  if (!isEventType(type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Grobes Land aus dem Edge-Geo-Header (keine IP-Speicherung).
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  const dur =
    typeof duration === "number" && Number.isFinite(duration)
      ? Math.max(0, Math.min(86400, Math.round(duration)))
      : null;

  try {
    await recordEvent({
      type,
      path: typeof path === "string" ? path.slice(0, 256) : null,
      label: typeof label === "string" ? label.slice(0, 128) : null,
      referrer: typeof referrer === "string" ? referrer.slice(0, 128) : null,
      country: country ? country.slice(0, 2).toUpperCase() : null,
      duration: dur,
    });
  } catch (err) {
    console.error("[track] Speichern fehlgeschlagen:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
