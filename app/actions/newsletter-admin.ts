"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Resend } from "resend";
import * as XLSX from "xlsx";
import { requireAdmin } from "@/lib/admin-auth";
import { CONTACT, SITE } from "@/lib/site";
import {
  listSubscribed,
  removeContact,
  updateContact,
  upsertContact,
  type ContactStatus,
} from "@/lib/contacts";
import { signUnsubscribeToken } from "@/lib/newsletter-token";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AddContactState = {
  status: "idle" | "ok" | "error";
  message: string;
};

export type SendState = {
  status: "idle" | "ok" | "error";
  message: string;
};

export type ImportState = {
  status: "idle" | "ok" | "error";
  message: string;
};

async function siteOrigin(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host");
    if (host) return `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
  } catch {
    /* außerhalb Request */
  }
  return SITE.url;
}

function refresh() {
  revalidatePath("/admin/newsletter");
  revalidatePath("/admin");
}

export async function addContactAction(
  _prev: AddContactState,
  formData: FormData,
): Promise<AddContactState> {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Bitte eine gültige E-Mail-Adresse." };
  }

  const { created } = await upsertContact({
    email,
    name,
    status: "subscribed",
    source: "admin",
  });
  refresh();
  return {
    status: "ok",
    message: created
      ? "Kontakt hinzugefügt."
      : "War schon in der Liste — Status aktualisiert.",
  };
}

export async function setContactStatusAction(id: string, status: ContactStatus) {
  await requireAdmin();
  await updateContact(id, { status });
  refresh();
}

export async function renameContactAction(id: string, name: string) {
  await requireAdmin();
  await updateContact(id, { name: name.trim() || null });
  refresh();
}

export async function deleteContactAction(id: string) {
  await requireAdmin();
  await removeContact(id);
  refresh();
}

const MAX_IMPORT = 5000;

/**
 * Massen-Import aus Excel (.xlsx/.xls) oder CSV. Findet in jeder Zeile die
 * E-Mail (egal in welcher Spalte) plus optional einen Namen (erste Nicht-Mail-
 * Zelle). Kopfzeilen ohne E-Mail werden automatisch übersprungen.
 */
export async function importContactsAction(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Bitte eine Excel- oder CSV-Datei auswählen." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { status: "error", message: "Datei ist zu groß (max. 5 MB)." };
  }

  let rows: unknown[][];
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: false,
    }) as unknown[][];
  } catch {
    return {
      status: "error",
      message: "Datei konnte nicht gelesen werden. Ist es eine gültige Excel-/CSV-Datei?",
    };
  }

  const EMAIL = /[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+/;
  const AFFIRM = /^(ja|yes|y|true|wahr|1|x|✓)$/i;
  const seen = new Set<string>();
  const entries: { email: string; name: string | null }[] = [];
  let skippedNoConsent = 0;

  // Kopfzeile + Spalten erkennen (E-Mail, Newsletter-/Einwilligungsspalte, Name).
  const header = (Array.isArray(rows[0]) ? rows[0] : []).map((c) =>
    String(c ?? "").trim().toLowerCase(),
  );
  const findIdx = (re: RegExp) => header.findIndex((h) => re.test(h));
  const emailIdx = findIdx(/mail/);
  const consentIdx = findIdx(/news|werb|einwillig|consent|marketing/);
  const vornameIdx = findIdx(/vorname|first.?name/);
  const nachnameIdx = findIdx(/nachname|last.?name|^name$/);

  // Mit erkannter Kopfzeile diese überspringen, sonst alle Zeilen scannen.
  const dataRows = emailIdx >= 0 ? rows.slice(1) : rows;

  for (const row of dataRows) {
    if (!Array.isArray(row)) continue;

    // E-Mail
    let email: string | null = null;
    if (emailIdx >= 0) {
      const m = String(row[emailIdx] ?? "").match(EMAIL);
      if (m) email = m[0].toLowerCase();
    } else {
      for (const cell of row) {
        const m = String(cell ?? "").match(EMAIL);
        if (m) {
          email = m[0].toLowerCase();
          break;
        }
      }
    }
    if (!email) continue;

    // Einwilligung: nur eintragen, wenn die Newsletter-Spalte zustimmt.
    if (consentIdx >= 0) {
      const cv = String(row[consentIdx] ?? "").trim();
      if (!AFFIRM.test(cv)) {
        skippedNoConsent++;
        continue;
      }
    }

    // Name
    let name: string | null = null;
    if (vornameIdx >= 0 || nachnameIdx >= 0) {
      name =
        [row[vornameIdx], row[nachnameIdx]]
          .map((x) => String(x ?? "").trim())
          .filter(Boolean)
          .join(" ")
          .slice(0, 120) || null;
    } else {
      for (const cell of row) {
        const s = String(cell ?? "").trim();
        if (s && !EMAIL.test(s)) {
          name = s.slice(0, 120);
          break;
        }
      }
    }

    if (!seen.has(email)) {
      seen.add(email);
      entries.push({ email, name });
      if (entries.length >= MAX_IMPORT) break;
    }
  }

  if (entries.length === 0) {
    return {
      status: "error",
      message:
        skippedNoConsent > 0
          ? `Keine Kontakte importiert: alle ${skippedNoConsent} Einträge haben keine Newsletter-Zustimmung („Ja") in der Datei.`
          : "Keine E-Mail-Adressen in der Datei gefunden.",
    };
  }

  let created = 0;
  let updated = 0;
  for (const e of entries) {
    try {
      const r = await upsertContact({
        email: e.email,
        name: e.name,
        status: "subscribed",
        source: "import",
      });
      if (r.created) created++;
      else updated++;
    } catch (err) {
      console.error("[import] Kontakt fehlgeschlagen:", e.email, err);
    }
  }

  refresh();
  return {
    status: "ok",
    message:
      `${created} neu importiert${updated ? `, ${updated} aktualisiert` : ""}.` +
      (skippedNoConsent > 0
        ? ` ${skippedNoConsent} ohne Newsletter-Zustimmung übersprungen (DSGVO/§ 7 UWG).`
        : ""),
  };
}

/** Hüllt den Inhalt in einen Rahmen mit Pflicht-Footer (Absender + Abmeldung). */
function wrapHtml(inner: string, unsubUrl: string): string {
  return `<div style="font-family:system-ui,-apple-system,sans-serif;color:#1a1a1a;line-height:1.6;max-width:600px;margin:0 auto">
    ${inner}
    <hr style="border:none;border-top:1px solid #e5e2da;margin:28px 0 16px" />
    <p style="font-size:12px;color:#6b6960;margin:0">
      Wald &amp; Wiese · ${CONTACT.street} · ${CONTACT.postalCode} ${CONTACT.city}<br />
      Du erhältst diese E-Mail, weil du dich für unseren Newsletter angemeldet hast.
      <a href="${unsubUrl}" style="color:#6b6960">Hier abmelden</a>.
    </p>
  </div>`;
}

export async function sendNewsletterAction(
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  await requireAdmin();

  const subject = String(formData.get("subject") ?? "").trim();
  const html = String(formData.get("html") ?? "");

  if (subject.length < 2) return { status: "error", message: "Bitte einen Betreff angeben." };
  if (html.trim().length < 10)
    return { status: "error", message: "Der Inhalt ist noch zu kurz." };

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = (
    process.env.CONTACT_FROM_EMAIL ??
    "Wald & Wiese <kontakt@restaurant-waldwiese.de>"
  ).trim();

  if (!apiKey || !process.env.NEWSLETTER_SECRET?.trim()) {
    return {
      status: "error",
      message: "Versand ist nicht konfiguriert (RESEND_API_KEY / NEWSLETTER_SECRET).",
    };
  }

  const subscribers = await listSubscribed();
  if (subscribers.length === 0) {
    return { status: "error", message: "Es gibt noch keine angemeldeten Empfänger." };
  }

  const base = await siteOrigin();
  const resend = new Resend(apiKey);

  const emails = subscribers.map((c) => {
    const unsubUrl = `${base}/api/newsletter/abmelden?token=${encodeURIComponent(
      signUnsubscribeToken(c.email),
    )}`;
    return {
      from,
      to: [c.email],
      subject,
      html: wrapHtml(html, unsubUrl),
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };
  });

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100);
    try {
      const { error } = await resend.batch.send(chunk);
      if (error) {
        failed += chunk.length;
        console.error("[newsletter] batch-Fehler:", error);
      } else {
        sent += chunk.length;
      }
    } catch (err) {
      failed += chunk.length;
      console.error("[newsletter] batch-Ausnahme:", err);
    }
  }

  if (sent === 0) {
    return { status: "error", message: "Versand fehlgeschlagen. Bitte später erneut." };
  }
  return {
    status: "ok",
    message: failed
      ? `${sent} gesendet, ${failed} fehlgeschlagen.`
      : `Newsletter an ${sent} ${sent === 1 ? "Empfänger" : "Empfänger"} gesendet.`,
  };
}
