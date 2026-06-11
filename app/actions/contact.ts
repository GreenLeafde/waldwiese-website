"use server";

import { Resend } from "resend";
import { CONTACT } from "@/lib/site";
import { recordEvent } from "@/lib/analytics";
import type { ContactState } from "@/lib/contact";

/**
 * Server Action für das Kontaktformular. Verschickt die Anfrage per Resend
 * an das Restaurant-Postfach. Wird über useActionState im Client aufgerufen.
 *
 * Env (siehe .env.example / RESEND_SETUP.md):
 *   RESEND_API_KEY      — API-Key aus dem Resend-Dashboard (Pflicht)
 *   CONTACT_FROM_EMAIL  — verifizierte Absenderadresse, z. B.
 *                         "Wald & Wiese <kontakt@restaurant-waldwiese.de>"
 *   CONTACT_TO_EMAIL    — Zielpostfach (Default: info@restaurant-waldwiese.de)
 *
 * Typ + Initial-State liegen in lib/contact.ts — eine "use server"-Datei darf
 * nur async-Funktionen exportieren.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1) Honeypot: echtes Feld "website" ist per CSS versteckt. Füllt ein Bot es
  //    aus, tun wir so, als wäre alles gut — ohne eine Mail zu schicken.
  if (str(formData, "website") !== "") {
    return { status: "success", message: "Danke! Deine Nachricht ist raus." };
  }

  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const subject = str(formData, "subject");
  const message = str(formData, "message");
  const consent = formData.get("consent") === "on";

  // 2) Validierung
  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Bitte sag uns deinen Namen.";
  if (!EMAIL_RE.test(email)) errors.email = "Bitte eine gültige E-Mail-Adresse.";
  if (message.length < 10)
    errors.message = "Magst du noch ein, zwei Sätze mehr schreiben?";
  if (!consent)
    errors.consent = "Bitte stimm der Verarbeitung deiner Daten zu.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Bitte schau nochmal über die markierten Felder.",
      errors,
    };
  }

  // 3) Konfiguration prüfen — solange kein Key gesetzt ist, freundlich auf die
  //    direkten Wege verweisen statt einen Fehler zu werfen.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = (
    process.env.CONTACT_FROM_EMAIL ??
    "Wald & Wiese <kontakt@restaurant-waldwiese.de>"
  ).trim();
  const to = (process.env.CONTACT_TO_EMAIL ?? CONTACT.email).trim();

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY fehlt — Nachricht wurde NICHT versendet.",
    );
    return {
      status: "error",
      message: `Hoppla, unser Postfach ist gerade nicht erreichbar. Schreib uns direkt an ${CONTACT.email} oder ruf an: ${CONTACT.phone}.`,
    };
  }

  // 4) Senden
  try {
    const resend = new Resend(apiKey);
    const safe = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: subject
        ? `Kontaktformular: ${subject}`
        : `Neue Nachricht über das Kontaktformular`,
      text: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        phone ? `Telefon: ${phone}` : null,
        subject ? `Betreff: ${subject}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;color:#1a1a1a;line-height:1.6">
          <h2 style="color:#2e3d2c;margin:0 0 16px">Neue Nachricht über das Kontaktformular</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${safe(name)}</p>
          <p style="margin:0 0 4px"><strong>E-Mail:</strong> ${safe(email)}</p>
          ${phone ? `<p style="margin:0 0 4px"><strong>Telefon:</strong> ${safe(phone)}</p>` : ""}
          ${subject ? `<p style="margin:0 0 4px"><strong>Betreff:</strong> ${safe(subject)}</p>` : ""}
          <p style="margin:16px 0 4px"><strong>Nachricht:</strong></p>
          <p style="margin:0;white-space:pre-wrap;background:#f2ead8;padding:14px 16px;border-radius:10px">${safe(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend-Fehler:", error);
      return {
        status: "error",
        message: `Das Senden hat leider nicht geklappt. Schreib uns direkt an ${CONTACT.email} oder ruf an: ${CONTACT.phone}.`,
      };
    }

    await recordEvent({ type: "contact_submit", path: "/kontakt" }).catch(() => {});
    return {
      status: "success",
      message: "Danke! Deine Nachricht ist bei uns — wir melden uns zeitnah.",
    };
  } catch (err) {
    console.error("[contact] Unerwarteter Fehler:", err);
    return {
      status: "error",
      message: `Da ist etwas schiefgelaufen. Schreib uns direkt an ${CONTACT.email} oder ruf an: ${CONTACT.phone}.`,
    };
  }
}
