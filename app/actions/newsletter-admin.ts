"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import * as XLSX from "xlsx";
import { requireAdmin } from "@/lib/admin-auth";
import {
  wrapEmail,
  emailDocument,
  personalizeHtml,
  personalizeText,
  mailVars,
  type HeaderStyle,
} from "@/lib/newsletter-shell";
import {
  MAIL_BASE,
  deliverCampaign,
  mailerConfig,
  resolveRecipients,
} from "@/lib/newsletter-delivery";
import {
  claimScheduled,
  createNewsletter,
  getNewsletter,
} from "@/lib/newsletters";
import { addSuppressions, removeSuppression } from "@/lib/suppressions";
import {
  bulkUpsertContacts,
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

/** Header-Masthead-Felder aus dem Formular lesen (im Composer anpassbar). */
function parseHeader(formData: FormData) {
  const style = String(formData.get("headerStyle") ?? "").trim();
  return {
    title: String(formData.get("headerTitle") ?? "").trim() || undefined,
    tagline:
      formData.get("headerTagline") != null
        ? String(formData.get("headerTagline"))
        : undefined,
    style: (style || undefined) as HeaderStyle | undefined,
  };
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
  const entries: {
    email: string;
    name: string | null;
    status: ContactStatus;
  }[] = [];

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
    if (!email || seen.has(email)) continue;

    // Status anhand der Newsletter-Spalte: „Ja" → angemeldet, sonst abgemeldet.
    // Ohne solche Spalte: angemeldet (lose Liste). Abgemeldete erhalten KEINEN
    // Newsletter (Versand geht nur an Angemeldete) — DSGVO/§ 7 UWG.
    let status: ContactStatus = "subscribed";
    if (consentIdx >= 0) {
      status = AFFIRM.test(String(row[consentIdx] ?? "").trim())
        ? "subscribed"
        : "unsubscribed";
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

    seen.add(email);
    entries.push({ email, name, status });
    if (entries.length >= MAX_IMPORT) break;
  }

  if (entries.length === 0) {
    return {
      status: "error",
      message: "Keine E-Mail-Adressen in der Datei gefunden.",
    };
  }

  const subbed = entries.filter((e) => e.status === "subscribed").length;
  const unsubbed = entries.length - subbed;

  try {
    await bulkUpsertContacts(entries.map((e) => ({ ...e, source: "import" })));
  } catch (err) {
    console.error("[import] Bulk-Upsert fehlgeschlagen:", err);
    return {
      status: "error",
      message: "Import fehlgeschlagen. Bitte später erneut versuchen.",
    };
  }

  refresh();
  return {
    status: "ok",
    message:
      `${entries.length} Kontakte importiert` +
      (consentIdx >= 0
        ? ` (${subbed} angemeldet, ${unsubbed} abgemeldet — „Nein" bekommt keinen Newsletter).`
        : "."),
  };
}

export async function sendNewsletterAction(
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  await requireAdmin();

  const subject = String(formData.get("subject") ?? "").trim();
  const html = String(formData.get("html") ?? "");
  const header = parseHeader(formData);
  const showHeader = String(formData.get("showHeader") ?? "1") !== "0";
  const bare = String(formData.get("bare") ?? "0") === "1";
  const fallbackName = String(formData.get("fallbackName") ?? "").trim() || "du";
  const campaignName = String(formData.get("campaignName") ?? "").trim();

  // Geplanter Versand (optional): ISO-Zeitpunkt aus dem Composer. Leer = sofort.
  const scheduledRaw = String(formData.get("scheduledAt") ?? "").trim();
  let scheduledAtMs: number | null = null;
  if (scheduledRaw) {
    const ts = Date.parse(scheduledRaw);
    if (Number.isNaN(ts)) {
      return { status: "error", message: "Der Sendezeitpunkt ist ungültig." };
    }
    // Mind. 2 Min. in der Zukunft (etwas Puffer, sonst lieber sofort senden).
    if (ts < Date.now() + 2 * 60 * 1000) {
      return {
        status: "error",
        message: "Der geplante Zeitpunkt liegt in der Vergangenheit — bitte einen späteren wählen oder sofort senden.",
      };
    }
    scheduledAtMs = ts;
  }

  if (subject.length < 2) return { status: "error", message: "Bitte einen Betreff angeben." };
  if (html.trim().length < 10)
    return { status: "error", message: "Der Inhalt ist noch zu kurz." };

  const mailer = mailerConfig();

  if (!mailer) {
    return {
      status: "error",
      message: "Versand ist nicht konfiguriert (RESEND_API_KEY / NEWSLETTER_SECRET).",
    };
  }
  const { apiKey, from } = mailer;

  const recipients = await resolveRecipients();
  if (recipients.length === 0) {
    return { status: "error", message: "Es gibt keine versendbaren Empfänger." };
  }

  // Kampagne anlegen → ID für Tracking + Duplikat-Schutz.
  let campaignId: string | null = null;
  try {
    campaignId = await createNewsletter({
      name: campaignName,
      subject,
      html,
      header,
      showHeader,
      bare,
      recipientCount: recipients.length,
      scheduledAt: scheduledAtMs,
    });
  } catch (err) {
    console.error("[newsletter] Kampagne konnte nicht angelegt werden:", err);
  }

  // GEPLANTER Versand: NICHT jetzt ausliefern — bei vielen Empfängern würde das
  // das Request-Timeout sprengen (Resends Batch kann kein scheduledAt, es müsste
  // also jede Mail einzeln raus). Die Kampagne ist mit `scheduled_at` angelegt;
  // der Cron `/api/cron/send-scheduled` liefert sie zur geplanten Zeit per Batch
  // aus — schnell und unabhängig davon, ob hier ein Rechner läuft.
  if (scheduledAtMs) {
    if (!campaignId) {
      return {
        status: "error",
        message:
          "Konnte nicht einplanen (Datenbank nicht erreichbar). Bitte später erneut.",
      };
    }
    revalidatePath("/admin/versand");
    const when = new Date(scheduledAtMs).toLocaleString("de-DE", {
      dateStyle: "full",
      timeStyle: "short",
    });
    return {
      status: "ok",
      message: `✓ Eingeplant für ${when}. Der Newsletter geht dann automatisch an alle bis dahin Angemeldeten raus — du musst nichts weiter tun. Zu sehen unter „Versand".`,
    };
  }

  const { sent, failed } = await deliverCampaign(
    campaignId,
    { subject, html, header, showHeader, bare, fallbackName },
    recipients,
    apiKey,
    from,
  );

  if (sent === 0) {
    return { status: "error", message: "Versand fehlgeschlagen. Bitte später erneut." };
  }
  revalidatePath("/admin/versand");

  return {
    status: "ok",
    message: failed
      ? `${sent} gesendet, ${failed} fehlgeschlagen (oft das Tageslimit). Unter „Versand" → „Weiter senden" gehen die Restlichen raus — keiner doppelt.`
      : `Newsletter an ${sent} Empfänger gesendet. Auswertung unter „Versand".`,
  };
}

/**
 * Sendet eine bereits gestartete Kampagne an die Angemeldeten weiter, die sie
 * noch NICHT bekommen haben (Duplikat-Schutz). Eine NEUE Kampagne geht über
 * `sendNewsletterAction` wieder an alle.
 */
export async function resumeNewsletterAction(
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  await requireAdmin();

  const id = String(formData.get("newsletterId") ?? "").trim();
  if (!id) return { status: "error", message: "Kampagne fehlt." };

  const mailer = mailerConfig();
  if (!mailer) {
    return {
      status: "error",
      message: "Versand ist nicht konfiguriert (RESEND_API_KEY / NEWSLETTER_SECRET).",
    };
  }
  const { apiKey, from } = mailer;

  const nl = await getNewsletter(id);
  if (!nl) return { status: "error", message: "Kampagne nicht gefunden." };

  const remaining = await resolveRecipients(id);
  if (remaining.length === 0) {
    return {
      status: "ok",
      message: "Alle angemeldeten Empfänger haben diesen Newsletter bereits.",
    };
  }

  const { sent, failed } = await deliverCampaign(
    id,
    {
      subject: nl.subject,
      html: nl.html,
      header: {
        title: nl.headerTitle ?? undefined,
        tagline: nl.headerTagline ?? undefined,
        style: (nl.headerStyle as HeaderStyle | null) ?? undefined,
      },
      showHeader: nl.showHeader,
      bare: nl.bare,
      fallbackName: "du",
    },
    remaining,
    apiKey,
    from,
  );

  // Von Hand losgeschickt → einen noch offenen Sendetermin abräumen, damit der
  // Cron dieselbe Kampagne nicht ein zweites Mal anfasst.
  if (sent > 0 && nl.scheduledAt != null) {
    await claimScheduled(id).catch((err) =>
      console.error("[newsletter] Sendetermin konnte nicht geleert werden:", err),
    );
  }

  revalidatePath("/admin/versand");
  if (sent === 0) {
    return {
      status: "error",
      message: `Gerade nichts gesendet (${remaining.length} offen) — vermutlich Tageslimit erreicht. Später nochmal „Weiter senden".`,
    };
  }
  return {
    status: "ok",
    message: failed
      ? `${sent} weitere gesendet, ${failed} noch offen (Tageslimit?). Später nochmal „Weiter senden" — keiner doppelt.`
      : `${sent} weitere gesendet. Diese Kampagne ist jetzt vollständig raus.`,
  };
}

/**
 * Schickt den aktuellen Entwurf als Testmail an EINE Adresse (kein Tracking,
 * keine Kampagne, geht nicht an die Liste). Betreff bekommt ein „[Test]" voran.
 */
export async function sendTestNewsletterAction(
  _prev: SendState,
  formData: FormData,
): Promise<SendState> {
  await requireAdmin();

  const to = String(formData.get("testEmail") ?? "").trim().toLowerCase();
  const subject = String(formData.get("subject") ?? "").trim();
  const html = String(formData.get("html") ?? "");
  const header = parseHeader(formData);
  const showHeader = String(formData.get("showHeader") ?? "1") !== "0";
  const bare = String(formData.get("bare") ?? "0") === "1";

  if (!EMAIL_RE.test(to)) {
    return { status: "error", message: "Bitte eine gültige Test-Adresse angeben." };
  }
  if (html.trim().length < 10) {
    return { status: "error", message: "Der Inhalt ist noch zu kurz für einen Test." };
  }

  const mailer = mailerConfig();
  if (!mailer) {
    return {
      status: "error",
      message: "Versand ist nicht konfiguriert (RESEND_API_KEY / NEWSLETTER_SECRET).",
    };
  }
  const { apiKey, from } = mailer;

  const unsubUrl = `${MAIL_BASE}/api/newsletter/abmelden?token=${encodeURIComponent(
    signUnsubscribeToken(to),
  )}`;

  // Test zeigt die Personalisierung mit Beispiel-Daten.
  const vars = mailVars("Maria Musterfrau", to, "du");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `[Test] ${personalizeText(subject || "Newsletter-Vorschau", vars)}`,
      html: emailDocument(
        wrapEmail(personalizeHtml(html, vars), {
          unsubUrl,
          header: showHeader ? header : false,
          bare,
        }),
        bare ? { bg: "#2e3d2c" } : undefined,
      ),
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (error) {
      console.error("[newsletter] Test-Versand-Fehler:", error);
      return { status: "error", message: "Test konnte nicht gesendet werden." };
    }
  } catch (err) {
    console.error("[newsletter] Test-Versand-Ausnahme:", err);
    return { status: "error", message: "Test konnte nicht gesendet werden." };
  }

  return { status: "ok", message: `Testmail an ${to} gesendet.` };
}

/* ------------------------------ Sperrliste ------------------------------ */

export async function addSuppressionAction(
  _prev: AddContactState,
  formData: FormData,
): Promise<AddContactState> {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Bitte eine gültige E-Mail-Adresse." };
  }
  await addSuppressions([{ email, reason: "manuell" }]);
  revalidatePath("/admin/newsletter");
  return { status: "ok", message: "Adresse gesperrt — bekommt keine Newsletter mehr." };
}

export async function removeSuppressionAction(email: string) {
  await requireAdmin();
  await removeSuppression(email);
  revalidatePath("/admin/newsletter");
}

/**
 * Importiert Bounces/Beschwerden aus einer CSV/Excel (z. B. Resend-Export) in
 * die Sperrliste. Mit Status-Spalte (last_event/status) werden nur
 * Bounces/Beschwerden gesperrt; ohne solche Spalte alle Adressen der Datei.
 */
export async function importBouncesAction(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Bitte eine CSV- oder Excel-Datei auswählen." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { status: "error", message: "Datei ist zu groß (max. 5 MB)." };
  }

  let rows: unknown[][];
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer" });
    rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      header: 1,
      blankrows: false,
    }) as unknown[][];
  } catch {
    return { status: "error", message: "Datei konnte nicht gelesen werden." };
  }

  const EMAIL = /[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+/;
  const BOUNCE = /bounce|complain|beschwerd|spam|undeliver|hard|fail/i;
  const header = (Array.isArray(rows[0]) ? rows[0] : []).map((c) =>
    String(c ?? "").trim().toLowerCase(),
  );
  const emailIdx = header.findIndex((h) => /mail|^to$|empf/.test(h));
  const statusIdx = header.findIndex((h) => /event|status|ergebnis/.test(h));
  const dataRows = emailIdx >= 0 || statusIdx >= 0 ? rows.slice(1) : rows;

  const seen = new Set<string>();
  const entries: { email: string; reason: string }[] = [];
  for (const row of dataRows) {
    if (!Array.isArray(row)) continue;
    if (statusIdx >= 0 && !BOUNCE.test(String(row[statusIdx] ?? ""))) continue;

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
    if (!email || seen.has(email)) continue;
    seen.add(email);
    entries.push({
      email,
      reason:
        statusIdx >= 0 ? String(row[statusIdx] ?? "bounce").trim().slice(0, 40) : "import",
    });
  }

  if (entries.length === 0) {
    return {
      status: "error",
      message:
        statusIdx >= 0
          ? "Keine Bounces/Beschwerden in der Datei gefunden."
          : "Keine E-Mail-Adressen gefunden.",
    };
  }

  try {
    await addSuppressions(entries);
  } catch (err) {
    console.error("[suppress] Import fehlgeschlagen:", err);
    return { status: "error", message: "Import fehlgeschlagen. Bitte später erneut." };
  }
  revalidatePath("/admin/newsletter");
  return {
    status: "ok",
    message: `${entries.length} Adressen auf die Sperrliste gesetzt.`,
  };
}
