"use server";

import { Resend } from "resend";
import { CONTACT } from "@/lib/site";
import { ACTIVE_JOBS } from "@/lib/jobs";
import { recordEvent } from "@/lib/analytics";
import type { ApplicationState } from "@/lib/application";

/**
 * Server Action für das Bewerbungsformular auf /karriere. Schickt die Bewerbung
 * per Resend ans Restaurant-Postfach. Wird über useActionState aufgerufen.
 *
 * Env (siehe .env.example / RESEND_SETUP.md):
 *   RESEND_API_KEY      — API-Key aus dem Resend-Dashboard (Pflicht)
 *   CONTACT_FROM_EMAIL  — verifizierte Absenderadresse
 *   CONTACT_TO_EMAIL    — Zielpostfach (Default: info@restaurant-waldwiese.de)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Erlaubte Datei-Endungen für Bewerbungsunterlagen. */
const ALLOWED_EXT = ["pdf", "doc", "docx", "jpg", "jpeg", "png"] as const;
const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB pro Datei
const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB gesamt

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Liest die hochgeladenen Bewerbungsunterlagen aus dem FormData, prüft Anzahl,
 * Größe und Typ und wandelt sie in Resend-Attachments (base64) um.
 * Gibt bei Problemen eine menschenlesbare Fehlermeldung zurück.
 */
async function readAttachments(
  formData: FormData,
): Promise<
  | { ok: true; attachments: { filename: string; content: string }[] }
  | { ok: false; error: string }
> {
  const files = formData
    .getAll("documents")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) return { ok: true, attachments: [] };
  if (files.length > MAX_FILES)
    return { ok: false, error: `Bitte höchstens ${MAX_FILES} Dateien anhängen.` };

  let total = 0;
  const attachments: { filename: string; content: string }[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!(ALLOWED_EXT as readonly string[]).includes(ext)) {
      return {
        ok: false,
        error: `„${file.name}" hat ein nicht unterstütztes Format. Erlaubt: PDF, DOC(X), JPG, PNG.`,
      };
    }
    if (file.size > MAX_FILE_BYTES) {
      return {
        ok: false,
        error: `„${file.name}" ist größer als 5 MB. Bitte komprimiere die Datei.`,
      };
    }
    total += file.size;
    if (total > MAX_TOTAL_BYTES) {
      return {
        ok: false,
        error: "Die Anhänge sind zusammen größer als 10 MB. Bitte reduziere sie.",
      };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    attachments.push({ filename: file.name, content: buffer.toString("base64") });
  }
  return { ok: true, attachments };
}

export async function sendApplication(
  _prevState: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  // 1) Honeypot — verstecktes Feld "website". Füllt ein Bot es aus, tun wir so,
  //    als wäre alles gut, verschicken aber nichts.
  if (str(formData, "website") !== "") {
    return { status: "success", message: "Danke! Deine Bewerbung ist raus." };
  }

  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const position = str(formData, "position");
  const availability = str(formData, "availability");
  const message = str(formData, "message");
  const consent = formData.get("consent") === "on";

  // 2) Validierung
  const errors: ApplicationState["errors"] = {};
  if (name.length < 2) errors.name = "Bitte sag uns deinen Namen.";
  if (!EMAIL_RE.test(email)) errors.email = "Bitte eine gültige E-Mail-Adresse.";
  if (phone.length < 5)
    errors.phone = "Bitte eine Telefonnummer, unter der wir dich erreichen.";
  if (!position) errors.position = "Bitte wähl aus, worauf du dich bewirbst.";
  if (!consent) errors.consent = "Bitte stimm der Verarbeitung deiner Daten zu.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Bitte schau nochmal über die markierten Felder.",
      errors,
    };
  }

  // 2b) Bewerbungsunterlagen (optional) einlesen und prüfen.
  const files = await readAttachments(formData);
  if (!files.ok) {
    return { status: "error", message: files.error };
  }

  // 3) Konfiguration prüfen — solange kein Key gesetzt ist, freundlich auf die
  //    direkten Wege verweisen statt einen Fehler zu werfen.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = (
    process.env.CONTACT_FROM_EMAIL ??
    "Wald & Wiese <noreply@restaurant-waldwiese.de>"
  ).trim();
  const to = (process.env.CONTACT_TO_EMAIL ?? CONTACT.email).trim();

  if (!apiKey) {
    console.warn(
      "[karriere] RESEND_API_KEY fehlt — Bewerbung wurde NICHT versendet.",
    );
    return {
      status: "error",
      message: `Hoppla, unser Postfach ist gerade nicht erreichbar. Schick deine Bewerbung direkt an ${CONTACT.email} oder ruf an: ${CONTACT.phone}.`,
    };
  }

  // Position hübsch auflösen (Titel statt Slug in der Mail).
  const job = ACTIVE_JOBS.find((j) => j.slug === position);
  const positionLabel = job?.title ?? position;

  // 4) Senden
  try {
    const resend = new Resend(apiKey);
    const safe = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const attachmentNote =
      files.attachments.length > 0
        ? files.attachments.map((a) => a.filename).join(", ")
        : "keine";

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Neue Bewerbung: ${positionLabel} — ${name}`,
      attachments:
        files.attachments.length > 0 ? files.attachments : undefined,
      text: [
        `Neue Bewerbung über die Karriere-Seite`,
        ``,
        `Stelle: ${positionLabel}`,
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone}`,
        availability ? `Verfügbarkeit: ${availability}` : null,
        `Anhänge: ${attachmentNote}`,
        "",
        message ? message : "(keine Nachricht)",
      ]
        .filter((l) => l !== null)
        .join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;color:#1a1a1a;line-height:1.6">
          <h2 style="color:#2e3d2c;margin:0 0 16px">Neue Bewerbung über die Karriere-Seite</h2>
          <p style="margin:0 0 4px"><strong>Stelle:</strong> ${safe(positionLabel)}</p>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${safe(name)}</p>
          <p style="margin:0 0 4px"><strong>E-Mail:</strong> ${safe(email)}</p>
          <p style="margin:0 0 4px"><strong>Telefon:</strong> ${safe(phone)}</p>
          ${availability ? `<p style="margin:0 0 4px"><strong>Verfügbarkeit:</strong> ${safe(availability)}</p>` : ""}
          <p style="margin:0 0 4px"><strong>Anhänge:</strong> ${safe(attachmentNote)}</p>
          <p style="margin:16px 0 4px"><strong>Nachricht:</strong></p>
          <p style="margin:0;white-space:pre-wrap;background:#f2ead8;padding:14px 16px;border-radius:10px">${
            message ? safe(message) : "(keine Nachricht)"
          }</p>
        </div>
      `,
    });

    if (error) {
      console.error("[karriere] Resend-Fehler:", error);
      return {
        status: "error",
        message: `Das Senden hat leider nicht geklappt. Schick deine Bewerbung direkt an ${CONTACT.email} oder ruf an: ${CONTACT.phone}.`,
      };
    }

    await recordEvent({
      type: "application_submit",
      path: "/karriere",
      label: positionLabel,
    }).catch(() => {});

    return {
      status: "success",
      message:
        "Danke für deine Bewerbung! Sie ist bei uns — wir melden uns zeitnah bei dir.",
    };
  } catch (err) {
    console.error("[karriere] Unerwarteter Fehler:", err);
    return {
      status: "error",
      message: `Da ist etwas schiefgelaufen. Schick deine Bewerbung direkt an ${CONTACT.email} oder ruf an: ${CONTACT.phone}.`,
    };
  }
}
