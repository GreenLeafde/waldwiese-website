/**
 * Monatliche Stundenübersicht per E-Mail.
 *
 * Geht am 25. jedes Monats an die Lohnbuchhaltung. Angehängt ist **dieselbe
 * CSV-Datei**, die auch der Export unter /admin/zeiten erzeugt — zeichengleich
 * mit dem Export der bisherigen Stempel-App. Im Mailtext stehen die Summen,
 * damit man den Stand sieht, ohne den Anhang zu öffnen.
 *
 * NUR server-seitig importieren.
 */

import { Resend } from "resend";
import { getDb, ensureSchema } from "./db";
import { SITE } from "./site";
import { holeEingestempelte } from "./stempel";
import { alsCsvDatei, alsDeutschesDatum, alsMonatsname, ladeZeiten, werteAus } from "./zeiten";

/** Zielpostfach der Lohnbuchhaltung. Über Env überschreibbar. */
export function stundenEmpfaenger(): string {
  return (process.env.STUNDEN_MAIL_TO ?? "sl@ltsgroup.eu").trim();
}

export function mailKonfiguriert(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/** Monat als "YYYY-MM" in Berliner Zeit. */
export function monatVon(t: Date): string {
  return t
    .toLocaleDateString("en-CA", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
    })
    .slice(0, 7);
}

// ─── Protokoll: verhindert doppelten Versand ────────────────────────────────

export async function schonGesendet(monat: string): Promise<boolean> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "SELECT 1 FROM stunden_mails WHERE monat = ?",
    args: [monat],
  });
  return res.rows.length > 0;
}

/**
 * Vermerkt den Versand. Gibt false zurück, wenn der Monat schon vermerkt war —
 * dann hat ein paralleler Aufruf die Mail bereits übernommen.
 */
async function merkeVersand(monat: string, empfaenger: string): Promise<boolean> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: `INSERT OR IGNORE INTO stunden_mails (monat, empfaenger, gesendet_am)
          VALUES (?, ?, ?) RETURNING monat`,
    args: [monat, empfaenger, Date.now()],
  });
  return res.rows.length > 0;
}

/** Vermerk zurücknehmen, falls der Versand doch scheitert. */
async function nimmVermerkZurueck(monat: string): Promise<void> {
  await getDb().execute({ sql: "DELETE FROM stunden_mails WHERE monat = ?", args: [monat] });
}

// ─── Inhalt ─────────────────────────────────────────────────────────────────

function schuetze(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type StundenMail = {
  betreff: string;
  html: string;
  text: string;
  dateiname: string;
  csv: string;
  /** Für die Vorschau im Backend. */
  summen: { name: string; nr: number | ""; stunden: string }[];
  gesamt: string;
  anzahlEintraege: number;
  offen: string[];
};

/** Baut die Mail, ohne sie zu verschicken. */
export async function baueStundenMail(monat: string): Promise<StundenMail> {
  const { eintraege, mitarbeiter } = await ladeZeiten();
  const zeitraum = { art: "monat", wert: monat } as const;
  const a = werteAus(eintraege, mitarbeiter, zeitraum);

  let offen: string[] = [];
  try {
    offen = (await holeEingestempelte())
      .filter((e) => e.datum.startsWith(monat + "-"))
      .map((e) => `${e.name} (${alsDeutschesDatum(e.datum)} seit ${e.seit} Uhr)`);
  } catch {
    /* Dienstliste nicht erreichbar — der Rest der Mail steht trotzdem. */
  }

  const zeilen = a.summen
    .map(
      (s) => `<tr>
        <td style="padding:6px 14px 6px 0;border-bottom:1px solid #e2e0d9">${schuetze(s.name)}</td>
        <td style="padding:6px 14px 6px 0;border-bottom:1px solid #e2e0d9;color:#6b6960">${s.nr}</td>
        <td style="padding:6px 0;border-bottom:1px solid #e2e0d9;text-align:right;font-weight:500">${s.stunden} h</td>
      </tr>`,
    )
    .join("");

  const offenHtml =
    offen.length > 0
      ? `<p style="margin:18px 0 0;padding:12px 14px;background:#f6eeda;border-radius:8px;color:#8a6a2f;font-size:14px">
           <strong>Noch nicht ausgestempelt:</strong> ${schuetze(offen.join(", "))}.<br>
           Diese Zeiten sind in den Summen noch nicht enthalten.
         </p>`
      : "";

  const html = `<!doctype html>
<html lang="de"><body style="margin:0;background:#f7f6f3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;padding:28px 20px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#c97c5d">Wald &amp; Wiese</p>
    <h1 style="margin:0 0 6px;font-size:24px;font-weight:600">Arbeitszeiten ${schuetze(a.bezeichnung)}</h1>
    <p style="margin:0 0 22px;color:#6b6960;font-size:14px">
      Stand ${alsDeutschesDatum(
        new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" }),
      )} · ${a.eintraege.length} ${a.eintraege.length === 1 ? "Buchung" : "Buchungen"}
    </p>

    ${
      a.summen.length === 0
        ? `<p style="color:#6b6960">Für diesen Monat sind noch keine Zeiten erfasst.</p>`
        : `<table style="width:100%;border-collapse:collapse;font-size:15px">
             <thead><tr>
               <th style="text-align:left;padding:0 14px 8px 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#918e85;font-weight:600">Name</th>
               <th style="text-align:left;padding:0 14px 8px 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#918e85;font-weight:600">Nr.</th>
               <th style="text-align:right;padding:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#918e85;font-weight:600">Stunden</th>
             </tr></thead>
             <tbody>${zeilen}</tbody>
             <tfoot><tr>
               <td style="padding:10px 14px 0 0;font-weight:600">Gesamt</td>
               <td></td>
               <td style="padding:10px 0 0;text-align:right;font-weight:600">${a.gesamt} h</td>
             </tr></tfoot>
           </table>`
    }

    ${offenHtml}

    <p style="margin:22px 0 0;color:#6b6960;font-size:14px">
      Die vollständige Aufstellung liegt als CSV-Datei bei
      (<code style="font-size:13px">${schuetze(a.dateiname)}</code>) — im selben Format wie bisher.
    </p>
    <p style="margin:22px 0 0;color:#918e85;font-size:12px">
      Automatisch erzeugt von ${schuetze(SITE.url.replace(/^https?:\/\//, ""))}.
      Jederzeit einsehbar unter /admin/zeiten.
    </p>
  </div>
</body></html>`;

  const textZeilen = a.summen.map((s) => `  ${s.name} (Nr. ${s.nr}): ${s.stunden} h`).join("\n");
  const text = [
    `Arbeitszeiten ${a.bezeichnung}`,
    `${a.eintraege.length} Buchungen`,
    "",
    textZeilen || "Für diesen Monat sind noch keine Zeiten erfasst.",
    a.summen.length > 0 ? `\n  Gesamt: ${a.gesamt} h` : "",
    offen.length > 0
      ? `\nNoch nicht ausgestempelt: ${offen.join(", ")}. Diese Zeiten fehlen in den Summen.`
      : "",
    `\nDie vollständige Aufstellung liegt als CSV bei (${a.dateiname}).`,
  ].join("\n");

  return {
    betreff: `Arbeitszeiten ${a.bezeichnung} — Wald & Wiese`,
    html,
    text,
    dateiname: a.dateiname,
    csv: alsCsvDatei(eintraege, mitarbeiter, zeitraum),
    summen: a.summen.map((s) => ({ name: s.name, nr: s.nr, stunden: s.stunden })),
    gesamt: a.gesamt,
    anzahlEintraege: a.eintraege.length,
    offen,
  };
}

// ─── Versand ────────────────────────────────────────────────────────────────

export type VersandErgebnis =
  | { status: "gesendet"; monat: string; empfaenger: string }
  | { status: "schon-gesendet"; monat: string }
  | { status: "fehler"; meldung: string };

/**
 * Verschickt die Monatsübersicht.
 *
 * `erzwingen` übergeht den Doppelversand-Schutz — gedacht für den Knopf im
 * Backend, wenn die Mail noch einmal gebraucht wird.
 */
export async function sendeStundenMail(
  monat: string,
  erzwingen = false,
): Promise<VersandErgebnis> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { status: "fehler", meldung: "RESEND_API_KEY fehlt." };

  const von =
    process.env.CONTACT_FROM_EMAIL?.trim() || `Wald & Wiese <noreply@${SITE.url.replace(/^https?:\/\//, "")}>`;
  const an = stundenEmpfaenger();

  if (!erzwingen && !(await merkeVersand(monat, an))) {
    return { status: "schon-gesendet", monat };
  }

  try {
    const mail = await baueStundenMail(monat);
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: von,
      to: an,
      subject: mail.betreff,
      html: mail.html,
      text: mail.text,
      attachments: [
        {
          filename: mail.dateiname,
          content: Buffer.from(mail.csv, "utf8").toString("base64"),
        },
      ],
    });

    if (error) throw new Error(error.message ?? "Resend meldet einen Fehler.");
  } catch (e) {
    // Vermerk zurücknehmen, damit der nächste Versuch es erneut probiert.
    if (!erzwingen) await nimmVermerkZurueck(monat).catch(() => {});
    return {
      status: "fehler",
      meldung: e instanceof Error ? e.message : "Versand fehlgeschlagen.",
    };
  }

  if (erzwingen) await merkeVersand(monat, an);
  return { status: "gesendet", monat, empfaenger: an };
}

export { alsMonatsname };
