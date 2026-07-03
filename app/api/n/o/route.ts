import { NextResponse, type NextRequest } from "next/server";
import { recordNewsletterHit } from "@/lib/newsletters";

// 1×1 vollständig transparentes GIF (mit Transparenz-Flag im GCE).
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  "base64",
);

/** Zähl-Pixel: wird geladen, wenn die Mail geöffnet wird → Öffnung zählen. */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("c");
  if (id) {
    try {
      await recordNewsletterHit({ newsletterId: id, type: "open" });
    } catch {
      /* Tracking ist best-effort */
    }
  }
  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": String(PIXEL.length),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
    },
  });
}
