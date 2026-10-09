import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { cronAuthorized } from "@/lib/cron-auth";
import { faelligkeiten, listLeads } from "@/lib/akquise";
import { ERLEDIGT, esc, type Faellig } from "@/lib/akquise-texte";
import { MAIL_BASE } from "@/lib/newsletter-delivery";
import { CONTACT, SITE } from "@/lib/site";

/**
 * Cron: Erinnerung, welche Akquise-Kontakte auf den naechsten Schritt warten.
 *
 * Vorbild ist /api/cron/akquise-erinnerung im Natuerlich. Dort geht eine
 * Zeile nach Telegram, hier eine kurze Mail an CONTACT.email, weil Wald &
 * Wiese kein Telegram angebunden hat.
 *
 * Woechentlich, montags frueh (vercel.json). Nie am Wochenende (Emilian,
 * 09.10.2026); die Faelligkeiten selbst fallen ebenfalls nie auf Samstag
 * oder Sonntag (lib/akquise.ts, inTagen).
 *
 * Verschickt NICHTS an Kontakte. Nachfassen und Anrufen bleiben eine
 * Entscheidung im Backend. Ist nichts faellig, geht auch keine Mail raus.
 *
 * ?still=1 zaehlt nur und schickt nichts (fuer Testlaeufe).
 */

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!cronAuthorized(request, "cron/akquise-erinnerung")) {
    return new NextResponse("unauthorized", { status: 401 });
  }
  const still = request.nextUrl.searchParams.get("still") === "1";

  const wochentag = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    weekday: "short",
  }).format(new Date());
  if (wochentag === "Sat" || wochentag === "Sun") {
    return NextResponse.json({ ok: true, uebersprungen: "Wochenende" });
  }

  try {
    const leads = await listLeads();
    const liste = faelligkeiten(leads);
    const gesamt = leads.length;
    const entschieden = leads.filter((l) => ERLEDIGT.includes(l.status)).length;
    const zahlen = {
      faellig: liste.length,
      nachfassen: liste.filter((f) => f.schritt === "nachfassen").length,
      anrufen: liste.filter((f) => f.schritt === "anrufen").length,
      wiedervorlage: liste.filter((f) => f.schritt === "wiedervorlage").length,
      gesamt,
      entschieden,
    };
    if (!liste.length || still) return NextResponse.json({ ok: true, ...zahlen });

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ ok: false, error: "RESEND_API_KEY fehlt" }, { status: 500 });
    const von =
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      `Wald & Wiese <noreply@${SITE.url.replace(/^https?:\/\//, "")}>`;

    const block = (titel: string, xs: Faellig[]) =>
      xs.length
        ? `<p style="margin:16px 0 4px;font-weight:600">${titel} (${xs.length})</p><ul style="margin:0;padding-left:18px">` +
          xs
            .slice(0, 15)
            .map((f) => `<li>${esc(f.firma)}${f.telefon ? ` · ${esc(f.telefon)}` : ""}</li>`)
            .join("") +
          (xs.length > 15 ? `<li>… und ${xs.length - 15} weitere</li>` : "") +
          "</ul>"
        : "";

    const { error } = await new Resend(apiKey).emails.send({
      from: von,
      to: [CONTACT.email],
      subject: `Akquise: ${liste.length} Kontakte warten`,
      html: `<div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#1f2b1d;max-width:560px">
        <p style="margin:0">Diese Woche in der Akquise:</p>
        ${block("Nachfassen", liste.filter((f) => f.schritt === "nachfassen"))}
        ${block("Anrufen", liste.filter((f) => f.schritt === "anrufen"))}
        ${block("Wiedervorlage", liste.filter((f) => f.schritt === "wiedervorlage"))}
        <p style="margin:20px 0 0">${entschieden} von ${gesamt} entschieden.<br />
        <a href="${MAIL_BASE}/admin/akquise" style="color:#a95f41">${MAIL_BASE.replace(/^https?:\/\//, "")}/admin/akquise</a></p>
      </div>`,
      tags: [{ name: "mail_type", value: "akquise_erinnerung" }],
    });
    if (error) {
      console.error("[cron/akquise-erinnerung]", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, gesendet: true, ...zahlen });
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    console.error("[cron/akquise-erinnerung]", m);
    return NextResponse.json({ ok: false, error: m }, { status: 500 });
  }
}
