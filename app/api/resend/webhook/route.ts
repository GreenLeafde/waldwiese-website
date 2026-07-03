import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { addSuppressions } from "@/lib/suppressions";

/**
 * Resend-Webhook: trägt Bounces & Spam-Beschwerden automatisch in die
 * Sperrliste ein. Signatur wird per Svix-Schema geprüft (RESEND_WEBHOOK_SECRET,
 * Format „whsec_…"). Ohne Secret oder bei falscher Signatur → 401.
 *
 * Einrichtung: Resend → Webhooks → URL .../api/resend/webhook, Events
 * „email.bounced" + „email.complained", Signing-Secret als RESEND_WEBHOOK_SECRET.
 */
function verify(rawBody: string, headers: Headers): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  const id = headers.get("svix-id");
  const ts = headers.get("svix-timestamp");
  const sigHeader = headers.get("svix-signature");
  if (!id || !ts || !sigHeader) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${ts}.${rawBody}`)
    .digest("base64");
  const expBuf = Buffer.from(expected);

  for (const part of sigHeader.split(" ")) {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    const sigBuf = Buffer.from(sig);
    if (sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf)) {
      return true;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verify(rawBody, request.headers)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  let event: {
    type?: string;
    data?: { to?: string[] | string; email?: string };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse("bad json", { status: 400 });
  }

  const type = event.type ?? "";
  if (type === "email.bounced" || type === "email.complained") {
    const data = event.data ?? {};
    const tos = Array.isArray(data.to)
      ? data.to
      : data.to
        ? [data.to]
        : data.email
          ? [data.email]
          : [];
    const reason = type === "email.complained" ? "complaint" : "bounce";
    const entries = tos
      .filter(Boolean)
      .map((email) => ({ email: String(email), reason }));
    if (entries.length > 0) {
      try {
        await addSuppressions(entries);
      } catch (err) {
        console.error("[resend-webhook] suppress:", err);
      }
    }
  }
  return new NextResponse(null, { status: 200 });
}
