import { NextResponse, type NextRequest } from "next/server";
import { isEventType, recordEvent } from "@/lib/analytics";

/**
 * Nimmt anonyme First-Party-Events vom Client entgegen (Seitenaufrufe,
 * CTA-Klicks, …). Speichert KEINE IP, KEINE Cookies, nichts Personenbezogenes.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { type, path, label } = (body ?? {}) as {
    type?: unknown;
    path?: unknown;
    label?: unknown;
  };

  if (!isEventType(type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await recordEvent({
      type,
      path: typeof path === "string" ? path.slice(0, 256) : null,
      label: typeof label === "string" ? label.slice(0, 128) : null,
    });
  } catch (err) {
    console.error("[track] Speichern fehlgeschlagen:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
