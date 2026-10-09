/**
 * Akquise: Firmenkontakte, ihr Verlauf und der Versand.
 *
 * Vorbild ist der Akquise-Bereich im Hotel-Backend (das-naturlich). Die
 * Sicherungen von dort gelten hier genauso, weil Kaltakquise per Mail heikel
 * ist (§ 7 UWG) und Beschwerden auf unser Resend-Konto durchschlagen, ueber
 * das auch Newsletter und Kontaktformular laufen:
 *
 *   1. Hoechstens TAGESLIMIT Mails pro Tag.
 *   2. Jede Mail traegt einen Abmeldeweg. Wer ihn nutzt, wird gesperrt und
 *      nie wieder angeschrieben.
 *   3. Gesperrte Kontakte, Adressen auf der Sperrliste (Ruecklaeufer,
 *      Spam-Beschwerden) und ungueltige Adressen werden vor dem Senden
 *      abgelehnt.
 *   4. Der Platz wird VOR dem Senden belegt. Zwei gleichzeitige Klicks
 *      schicken nicht zwei Mails.
 *   5. Derselbe Text geht nie zweimal an denselben Kontakt.
 *
 * NUR server-seitig importieren.
 */

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { ensureSchema, getDb } from "./db";
import { MAIL_BASE } from "./newsletter-delivery";
import { getSuppressedEmails } from "./suppressions";
import { CONTACT } from "./site";
import {
  ABSENDER,
  ANHANG,
  ERLEDIGT,
  NACHFASS_TAGE,
  STAPEL_MAX,
  STATUS,
  TAGESLIMIT,
  TYPEN,
  entwurfFuer,
  mailHtml,
  mailText,
  nachfassEntwurf,
  type Faellig,
  type Lead,
  type LeadEvent,
  type Status,
  type Typ,
} from "./akquise-texte";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const TAG_MS = 86_400_000;

type Wert = string | number | null;
type Zeile = Record<string, unknown>;

/* ------------------------------- Lesen ---------------------------------- */

const text = (v: unknown): string | null => {
  const s = v == null ? "" : String(v).trim();
  return s ? s : null;
};
const zahl = (v: unknown): number | null => (v == null ? null : Number(v));

function zuLead(r: Zeile): Lead {
  const typ = String(r.typ ?? "firma") as Typ;
  const status = String(r.status ?? "neu") as Status;
  return {
    id: String(r.id),
    firma: String(r.firma ?? ""),
    person: text(r.person),
    rolle: text(r.rolle),
    email: text(r.email),
    telefon: text(r.telefon),
    website: text(r.website),
    ort: text(r.ort),
    branche: text(r.branche),
    typ: TYPEN.includes(typ) ? typ : "sonstiges",
    quelle: text(r.quelle),
    status: STATUS.includes(status) ? status : "neu",
    notiz: text(r.notiz),
    naechster_schritt: text(r.naechster_schritt),
    faellig_am: text(r.faellig_am),
    fakt: text(r.fakt),
    passung: text(r.passung),
    betreff: text(r.betreff),
    entwurf: text(r.entwurf),
    angeschrieben_am: zahl(r.angeschrieben_am),
    nachgefasst_am: zahl(r.nachgefasst_am),
    anruf_am: zahl(r.anruf_am),
    anruf_ergebnis: text(r.anruf_ergebnis),
    zuletzt_gesendet_text: text(r.zuletzt_gesendet_text),
    zuletzt_gesendet_am: zahl(r.zuletzt_gesendet_am),
    gesperrt: Number(r.gesperrt ?? 0) === 1,
    created_at: Number(r.created_at ?? 0),
    updated_at: Number(r.updated_at ?? 0),
  };
}

export async function listLeads(): Promise<Lead[]> {
  await ensureSchema();
  const res = await getDb().execute(
    "SELECT * FROM akquise_leads ORDER BY updated_at DESC LIMIT 2000",
  );
  return (res.rows as unknown as Zeile[]).map(zuLead);
}

export async function getLead(id: string): Promise<Lead | null> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "SELECT * FROM akquise_leads WHERE id = ?",
    args: [id],
  });
  const r = res.rows[0] as unknown as Zeile | undefined;
  return r ? zuLead(r) : null;
}

export async function listEvents(leadId: string): Promise<LeadEvent[]> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "SELECT id, art, text, created_at FROM akquise_events WHERE lead_id = ? ORDER BY created_at DESC LIMIT 50",
    args: [leadId],
  });
  return (res.rows as unknown as Zeile[]).map((r) => ({
    id: String(r.id),
    art: String(r.art ?? "notiz"),
    text: text(r.text),
    created_at: Number(r.created_at ?? 0),
  }));
}

async function vermerke(leadId: string, art: string, inhalt: string) {
  await getDb().execute({
    sql: "INSERT INTO akquise_events (id, lead_id, art, text, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [randomUUID(), leadId, art, inhalt.slice(0, 2000), Date.now()],
  });
}

/* ------------------------------ Schreiben ------------------------------- */

/** Felder, die sich ueber das Formular aendern lassen. */
const FELDER = [
  "firma",
  "person",
  "rolle",
  "email",
  "telefon",
  "website",
  "ort",
  "branche",
  "typ",
  "quelle",
  "status",
  "notiz",
  "naechster_schritt",
  "faellig_am",
  "fakt",
  "passung",
  "betreff",
  "entwurf",
] as const;
type Feld = (typeof FELDER)[number];
export type LeadEingabe = Partial<Record<Feld, string | null>>;

function bereinige(eingabe: LeadEingabe): Record<string, Wert> | string {
  const daten: Record<string, Wert> = {};
  for (const f of FELDER) {
    if (eingabe[f] === undefined) continue;
    const v = String(eingabe[f] ?? "").trim();
    daten[f] = v ? v : null;
  }
  if (daten.email) {
    daten.email = String(daten.email).toLowerCase();
    if (!EMAIL_RE.test(String(daten.email))) return "Die E-Mail-Adresse sieht nicht richtig aus.";
  }
  if (daten.typ != null && !TYPEN.includes(String(daten.typ) as Typ)) return "Unbekannte Zielgruppe.";
  if (daten.status != null && !STATUS.includes(String(daten.status) as Status)) return "Unbekannter Stand.";
  if (daten.faellig_am && !/^\d{4}-\d{2}-\d{2}$/.test(String(daten.faellig_am))) return "Das Datum ist ungültig.";
  // Auch von Hand gesetzte Wiedervorlagen fallen nie aufs Wochenende.
  if (daten.faellig_am) daten.faellig_am = werktag(String(daten.faellig_am));
  if ("firma" in daten && !daten.firma) return "Die Firma fehlt.";
  if ("typ" in daten && !daten.typ) delete daten.typ;
  if ("status" in daten && !daten.status) delete daten.status;
  return daten;
}

/** Legt einen Kontakt an (id leer) oder aendert ihn. Gibt die Kennung zurueck. */
export async function saveLead(
  id: string | null,
  eingabe: LeadEingabe,
): Promise<{ ok: true; id: string } | { ok: false; grund: string }> {
  await ensureSchema();
  const db = getDb();
  const daten = bereinige(eingabe);
  if (typeof daten === "string") return { ok: false, grund: daten };
  const jetzt = Date.now();

  try {
    if (!id) {
      if (!daten.firma) return { ok: false, grund: "Die Firma fehlt." };
      const neu = randomUUID();
      const spalten = Object.keys(daten);
      await db.execute({
        sql: `INSERT INTO akquise_leads (id, ${spalten.join(", ")}, created_at, updated_at)
              VALUES (?, ${spalten.map(() => "?").join(", ")}, ?, ?)`,
        args: [neu, ...spalten.map((s) => daten[s]), jetzt, jetzt],
      });
      return { ok: true, id: neu };
    }

    const vorher = await getLead(id);
    if (!vorher) return { ok: false, grund: "Kontakt nicht gefunden." };

    // Steht jetzt ein Text da, ist aus "neu" ein fertiger Entwurf geworden.
    // Der Stapelversand nimmt nur Kontakte mit diesem Stand.
    const hatText = Boolean((daten.entwurf ?? vorher.entwurf) && (daten.betreff ?? vorher.betreff));
    if (hatText && (daten.status ?? vorher.status) === "neu") daten.status = "entwurf";

    const spalten = Object.keys(daten);
    if (spalten.length) {
      await db.execute({
        sql: `UPDATE akquise_leads SET ${spalten.map((s) => `${s} = ?`).join(", ")}, updated_at = ? WHERE id = ?`,
        args: [...spalten.map((s) => daten[s]), jetzt, id],
      });
    }
    if (daten.status && daten.status !== vorher.status) {
      await vermerke(id, "status", `Stand: ${daten.status}`);
    }
    return { ok: true, id };
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    if (/UNIQUE/i.test(m)) return { ok: false, grund: "Diese E-Mail-Adresse gibt es schon bei einem anderen Kontakt." };
    return { ok: false, grund: m };
  }
}

export async function deleteLead(id: string): Promise<void> {
  await ensureSchema();
  await getDb().batch(
    [
      { sql: "DELETE FROM akquise_events WHERE lead_id = ?", args: [id] },
      { sql: "DELETE FROM akquise_leads WHERE id = ?", args: [id] },
    ],
    "write",
  );
}

/**
 * Liste einfuegen. Eine Zeile je Kontakt, Felder mit Semikolon oder Tab:
 * Firma; Person; Rolle; E-Mail; Telefon; Ort; Branche; Website; Fakt; Passung
 */
export async function importLeads(
  roh: string,
  typ: Typ,
): Promise<{ neu: number; uebersprungen: number }> {
  let neu = 0;
  let uebersprungen = 0;
  for (const z of roh.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)) {
    const t = z.split(/[;\t]/).map((s) => s.trim());
    if (!t[0] || /^firma$/i.test(t[0])) {
      uebersprungen++;
      continue;
    }
    const leer = (s: string | undefined) => (s ?? "").replace(/^-+$/, "").trim() || null;
    const r = await saveLead(null, {
      firma: t[0],
      person: leer(t[1]),
      rolle: leer(t[2]),
      email: leer(t[3]),
      telefon: leer(t[4]),
      ort: leer(t[5]),
      branche: leer(t[6]),
      website: leer(t[7]),
      fakt: leer(t[8]),
      passung: leer(t[9]),
      typ,
      quelle: "liste",
      status: "neu",
    });
    if (r.ok) neu++;
    else uebersprungen++;
  }
  return { neu, uebersprungen };
}

/** Schreibt fuer alle neuen Kontakte mit Adresse den Vorschlag als Entwurf. */
export async function entwuerfeFuerNeue(): Promise<number> {
  const leads = (await listLeads()).filter(
    (l) => l.status === "neu" && l.email && !l.entwurf && !l.gesperrt,
  );
  const jetzt = Date.now();
  for (const l of leads) {
    const e = entwurfFuer(l);
    await getDb().execute({
      sql: "UPDATE akquise_leads SET betreff = ?, entwurf = ?, status = 'entwurf', updated_at = ? WHERE id = ? AND status = 'neu'",
      args: [e.betreff, e.text, jetzt, l.id],
    });
  }
  return leads.length;
}

export async function setStatus(
  id: string,
  status: Status,
  wiedervorlageTage?: number,
): Promise<void> {
  await ensureSchema();
  const jetzt = Date.now();
  if (ERLEDIGT.includes(status)) {
    await getDb().execute({
      sql: "UPDATE akquise_leads SET status = ?, faellig_am = NULL, naechster_schritt = NULL, updated_at = ? WHERE id = ?",
      args: [status, jetzt, id],
    });
  } else if (wiedervorlageTage && wiedervorlageTage > 0) {
    await getDb().execute({
      sql: "UPDATE akquise_leads SET status = ?, faellig_am = ?, naechster_schritt = 'Wiedervorlage', updated_at = ? WHERE id = ?",
      args: [status, inTagen(wiedervorlageTage), jetzt, id],
    });
  } else {
    await getDb().execute({
      sql: "UPDATE akquise_leads SET status = ?, updated_at = ? WHERE id = ?",
      args: [status, jetzt, id],
    });
  }
  await vermerke(id, "status", `Stand: ${status}`);
}

/** Ein Anruf und was dabei herauskam. */
export async function vermerkeAnruf(input: {
  id: string;
  ergebnis: string;
  status?: Status;
  wiedervorlageTage?: number;
}): Promise<{ ok: boolean; grund?: string }> {
  await ensureSchema();
  const ergebnis = input.ergebnis.trim().slice(0, 2000);
  if (!ergebnis) return { ok: false, grund: "Bitte kurz festhalten, was besprochen wurde." };
  const jetzt = Date.now();
  await getDb().execute({
    sql: "UPDATE akquise_leads SET anruf_am = ?, anruf_ergebnis = ?, updated_at = ? WHERE id = ?",
    args: [jetzt, ergebnis, jetzt, input.id],
  });
  await vermerke(input.id, "anruf", ergebnis);
  if (input.status) await setStatus(input.id, input.status, input.wiedervorlageTage);
  return { ok: true };
}

export async function addNotiz(id: string, inhalt: string): Promise<void> {
  await ensureSchema();
  await vermerke(id, "notiz", inhalt.trim());
  await getDb().execute({
    sql: "UPDATE akquise_leads SET updated_at = ? WHERE id = ?",
    args: [Date.now(), id],
  });
}

/* ------------------------------ Abmelden -------------------------------- */

const geheimnis = () => (process.env.NEWSLETTER_SECRET ?? "").trim();

/** Kennung plus Signatur. Ohne Signatur liesse sich jeder Kontakt sperren. */
export function abmeldeToken(leadId: string): string {
  const sig = createHmac("sha256", geheimnis()).update(`akquise:${leadId}`).digest("base64url");
  return `${leadId}.${sig}`;
}

export function pruefeAbmeldeToken(token: string): string | null {
  if (!geheimnis()) return null;
  const punkt = token.lastIndexOf(".");
  if (punkt < 1) return null;
  const id = token.slice(0, punkt);
  const erwartet = Buffer.from(abmeldeToken(id));
  const bekommen = Buffer.from(token);
  if (erwartet.length !== bekommen.length || !timingSafeEqual(erwartet, bekommen)) return null;
  return id;
}

export function abmeldeUrl(leadId: string): string {
  return `${MAIL_BASE}/api/akquise/abmelden?t=${encodeURIComponent(abmeldeToken(leadId))}`;
}

/** Widerspruch: sperren, als erledigt ablegen, im Verlauf festhalten. */
export async function sperreLead(leadId: string, wer = "Empfänger"): Promise<boolean> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "UPDATE akquise_leads SET gesperrt = 1, status = 'abgesagt', faellig_am = NULL, naechster_schritt = NULL, updated_at = ? WHERE id = ?",
    args: [Date.now(), leadId],
  });
  if (res.rowsAffected < 1) return false;
  await vermerke(leadId, "status", `Abgemeldet über den Link in der Mail (${wer})`);
  return true;
}

/* ------------------------------- Versand -------------------------------- */

/** Beginn des heutigen Tages in Sinzing, als Zeitstempel. */
function tagesbeginn(): number {
  const jetzt = new Date();
  const teile = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(jetzt);
  const n = (t: string) => Number(teile.find((p) => p.type === t)?.value ?? 0) % 24;
  return jetzt.getTime() - (n("hour") * 3600 + n("minute") * 60 + n("second")) * 1000;
}

/** Kalendertag (Sinzinger Zeit) als JJJJ-MM-TT. */
function kalendertag(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date(ms));
}

/**
 * Kalendertag in N Tagen, aber nie am Wochenende: Samstag und Sonntag
 * rutschen auf den Montag (Emilian, 09.10.2026: "erinnerungen duerfen nie am
 * wochenende sein"). Gilt fuer Nachfassen, Anruf und jede Wiedervorlage.
 */
function inTagen(n: number): string {
  return werktag(kalendertag(Date.now() + n * TAG_MS));
}

/** JJJJ-MM-TT; Samstag und Sonntag werden zum folgenden Montag. */
function werktag(tag: string): string {
  const d = new Date(`${tag}T12:00:00Z`);
  const plus = d.getUTCDay() === 6 ? 2 : d.getUTCDay() === 0 ? 1 : 0;
  return plus ? new Date(d.getTime() + plus * TAG_MS).toISOString().slice(0, 10) : tag;
}

export async function heuteVersendet(): Promise<number> {
  await ensureSchema();
  const res = await getDb().execute({
    sql: "SELECT COUNT(*) AS c FROM akquise_events WHERE art = 'mail' AND created_at >= ?",
    args: [tagesbeginn()],
  });
  return Number((res.rows[0] as unknown as { c: number | bigint }).c);
}

/** Resend-Zugang. `null` = Versand nicht eingerichtet. */
export function versandBereit(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || !geheimnis()) return null;
  // Die Adresse kommt aus CONTACT_FROM_EMAIL (verifizierte Domain), der Name
  // davor ist der des Unterzeichners: eine Akquise-Mail kommt von einem
  // Menschen, nicht von "Wald & Wiese".
  const roh = (process.env.CONTACT_FROM_EMAIL ?? "").trim();
  const adresse = roh.match(/<([^>]+)>/)?.[1] ?? (EMAIL_RE.test(roh) ? roh : "");
  if (!adresse) return null;
  return { apiKey, from: `${ABSENDER.name} von Wald & Wiese <${adresse}>` };
}

type Sendeergebnis = { ok: true; id: string } | { ok: false; grund: string };

/** Alles, was vor JEDER Mail geprueft wird. */
async function pruefeEmpfaenger(l: Lead): Promise<string | null> {
  if (l.gesperrt) return "Kontakt hat sich abgemeldet. Nicht mehr anschreiben.";
  const email = String(l.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return "Keine gültige E-Mail-Adresse.";
  if ((await getSuppressedEmails()).has(email)) return "Adresse steht auf der Sperrliste (Rückläufer oder Beschwerde).";
  if ((await heuteVersendet()) >= TAGESLIMIT) return `Tageslimit erreicht (${TAGESLIMIT} Mails). Morgen weiter.`;
  return null;
}

async function schicke(
  l: Lead,
  betreff: string,
  inhalt: string,
  art: "akquise" | "akquise_nachfass" | "akquise_antwort",
): Promise<Sendeergebnis> {
  const zugang = versandBereit();
  if (!zugang) return { ok: false, grund: "Der Mailversand ist nicht eingerichtet (RESEND_API_KEY, CONTACT_FROM_EMAIL, NEWSLETTER_SECRET)." };
  const abmelden = abmeldeUrl(l.id);
  const opts = { siteUrl: MAIL_BASE, abmeldeUrl: abmelden };
  try {
    const { data, error } = await new Resend(zugang.apiKey).emails.send({
      from: zugang.from,
      to: [String(l.email).trim().toLowerCase()],
      replyTo: CONTACT.email,
      subject: betreff,
      html: mailHtml(inhalt, opts),
      text: mailText(inhalt, opts),
      // Das Blatt haengt nur am Erstkontakt. Resend holt die Datei selbst
      // von der Website, sie muss also dort schon liegen.
      ...(art === "akquise"
        ? { attachments: [{ filename: ANHANG.datei, path: `${MAIL_BASE}${ANHANG.pfad}` }] }
        : {}),
      headers: {
        "List-Unsubscribe": `<${abmelden}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      tags: [{ name: "mail_type", value: art }],
    });
    if (error) return { ok: false, grund: error.message || "Versand fehlgeschlagen." };
    // Ohne Kennung von Resend gilt nichts als verschickt.
    if (!data?.id) return { ok: false, grund: "Keine Bestätigung vom Mailversand. Nichts zugestellt." };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, grund: e instanceof Error ? e.message : "Versand fehlgeschlagen." };
  }
}

const gleich = (a: string | null, b: string | null) =>
  String(a ?? "").replace(/\s+/g, " ").trim().toLowerCase() ===
  String(b ?? "").replace(/\s+/g, " ").trim().toLowerCase();

/** Die erste Mail, mit dem Blatt im Anhang. Geht je Kontakt genau einmal. */
export async function sendeErstkontakt(leadId: string): Promise<Sendeergebnis> {
  await ensureSchema();
  const db = getDb();
  const l = await getLead(leadId);
  if (!l) return { ok: false, grund: "Kontakt nicht gefunden." };
  if (l.angeschrieben_am) return { ok: false, grund: "Wurde schon angeschrieben. Für alles Weitere „Antwort senden“ oder „Nachfassen“ nehmen." };
  const sperre = await pruefeEmpfaenger(l);
  if (sperre) return { ok: false, grund: sperre };

  const vorschlag = entwurfFuer(l);
  const betreff = l.betreff || vorschlag.betreff;
  const inhalt = l.entwurf || vorschlag.text;

  // Platz belegen, BEVOR gesendet wird: ein UPDATE mit Bedingung laeuft
  // atomar. Wer keine Zeile trifft, war der Zweite und sendet nicht.
  const jetzt = Date.now();
  const belegt = await db.execute({
    sql: "UPDATE akquise_leads SET status = 'angeschrieben', angeschrieben_am = ?, updated_at = ? WHERE id = ? AND angeschrieben_am IS NULL",
    args: [jetzt, jetzt, leadId],
  });
  if (belegt.rowsAffected < 1) return { ok: false, grund: "Wird gerade schon verschickt oder wurde eben verschickt." };

  const r = await schicke(l, betreff, inhalt, "akquise");
  if (!r.ok) {
    // Fehlgeschlagen: Platz zurueckgeben, sonst steht der Kontakt fuer immer
    // als "angeschrieben" da, ohne dass je eine Mail ankam.
    await db.execute({
      sql: "UPDATE akquise_leads SET status = ?, angeschrieben_am = NULL, updated_at = ? WHERE id = ?",
      args: [l.status, Date.now(), leadId],
    });
    return r;
  }

  await db.execute({
    sql: `UPDATE akquise_leads SET resend_id = ?, betreff = ?, entwurf = ?,
            zuletzt_gesendet_text = ?, zuletzt_gesendet_am = ?,
            faellig_am = ?, naechster_schritt = 'Nachfassen', updated_at = ?
          WHERE id = ?`,
    args: [r.id, betreff, inhalt, inhalt, jetzt, inTagen(NACHFASS_TAGE), Date.now(), leadId],
  });
  await vermerke(leadId, "mail", `Mail verschickt: ${betreff}`);
  return r;
}

/**
 * Die zweite Mail. Hat jemand im Kontakt schon einen eigenen Text vorbereitet
 * (er weicht vom zuletzt gesendeten ab), geht der raus. Sonst der Vorschlag.
 */
export async function sendeNachfass(leadId: string): Promise<Sendeergebnis> {
  await ensureSchema();
  const db = getDb();
  const l = await getLead(leadId);
  if (!l) return { ok: false, grund: "Kontakt nicht gefunden." };
  if (!l.angeschrieben_am) return { ok: false, grund: "Die erste Mail ist noch nicht raus." };
  if (l.nachgefasst_am) return { ok: false, grund: "Wurde schon nachgefasst." };
  if (ERLEDIGT.includes(l.status)) return { ok: false, grund: "Der Fall ist abgeschlossen." };
  const sperre = await pruefeEmpfaenger(l);
  if (sperre) return { ok: false, grund: sperre };

  const eigen = l.entwurf && l.betreff && !gleich(l.entwurf, l.zuletzt_gesendet_text);
  const vorschlag = nachfassEntwurf(l);
  const betreff = eigen ? String(l.betreff) : vorschlag.betreff;
  const inhalt = eigen ? String(l.entwurf) : vorschlag.text;

  const jetzt = Date.now();
  const belegt = await db.execute({
    sql: "UPDATE akquise_leads SET status = 'nachgefasst', nachgefasst_am = ?, updated_at = ? WHERE id = ? AND nachgefasst_am IS NULL",
    args: [jetzt, jetzt, leadId],
  });
  if (belegt.rowsAffected < 1) return { ok: false, grund: "Wird gerade schon nachgefasst." };

  const r = await schicke(l, betreff, inhalt, "akquise_nachfass");
  if (!r.ok) {
    await db.execute({
      sql: "UPDATE akquise_leads SET status = ?, nachgefasst_am = NULL, updated_at = ? WHERE id = ?",
      args: [l.status, Date.now(), leadId],
    });
    return r;
  }

  await db.execute({
    sql: `UPDATE akquise_leads SET betreff = ?, entwurf = ?,
            zuletzt_gesendet_text = ?, zuletzt_gesendet_am = ?,
            faellig_am = ?, naechster_schritt = 'Anrufen', updated_at = ?
          WHERE id = ?`,
    args: [betreff, inhalt, inhalt, jetzt, inTagen(NACHFASS_TAGE), Date.now(), leadId],
  });
  await vermerke(leadId, "mail", `Nachgefasst: ${betreff}`);
  return r;
}

/**
 * Freie Antwort an einen Kontakt, der schon angeschrieben wurde. Nimmt
 * Betreff und Text, wie sie am Kontakt stehen. Kein Anhang, keine
 * Stand-Aenderung: der Stand gehoert dem, der das Gespraech fuehrt.
 */
export async function sendeAntwort(leadId: string): Promise<Sendeergebnis> {
  await ensureSchema();
  const l = await getLead(leadId);
  if (!l) return { ok: false, grund: "Kontakt nicht gefunden." };
  if (!l.betreff || String(l.entwurf ?? "").length < 20) return { ok: false, grund: "Betreff oder Text fehlt. Bitte erst schreiben." };
  // DENSELBEN Text nie zweimal schicken: nach dem Erstversand steht dessen
  // Text noch im Feld, ein unbedachter Klick wuerde ihn wiederholen.
  if (l.zuletzt_gesendet_text && gleich(l.entwurf, l.zuletzt_gesendet_text)) {
    return { ok: false, grund: "Dieser Text ging schon einmal an den Kontakt. Bitte erst die Antwort schreiben, dann senden." };
  }
  const sperre = await pruefeEmpfaenger(l);
  if (sperre) return { ok: false, grund: sperre };

  const r = await schicke(l, l.betreff, String(l.entwurf), "akquise_antwort");
  if (!r.ok) return r;
  const jetzt = Date.now();
  await getDb().execute({
    sql: "UPDATE akquise_leads SET zuletzt_gesendet_text = ?, zuletzt_gesendet_am = ?, updated_at = ? WHERE id = ?",
    args: [l.entwurf, jetzt, jetzt, leadId],
  });
  await vermerke(leadId, "mail", `Antwort verschickt: ${l.betreff}`);
  return r;
}

/**
 * Stapel: die naechsten N fertigen Entwuerfe hintereinander verschicken.
 * Jede Mail laeuft durch dieselbe Pruefung wie der Einzelversand. Was nicht
 * geht, wird gemeldet statt stillschweigend uebersprungen.
 */
export async function sendeStapel(
  anzahl: number,
  typ: Typ | "",
): Promise<{
  gesendet: number;
  fehler: { firma: string; grund: string }[];
  offen: number;
  limitErreicht: boolean;
}> {
  const wartend = (leads: Lead[]) =>
    leads.filter(
      (l) =>
        l.status === "entwurf" &&
        !l.angeschrieben_am &&
        l.entwurf &&
        !l.gesperrt &&
        (!typ || l.typ === typ),
    );
  const schlange = wartend(await listLeads())
    .sort((a, b) => a.created_at - b.created_at)
    .slice(0, Math.min(STAPEL_MAX, Math.max(1, anzahl)));

  const fehler: { firma: string; grund: string }[] = [];
  let gesendet = 0;
  let limitErreicht = false;
  for (const l of schlange) {
    const r = await sendeErstkontakt(l.id);
    if (r.ok) gesendet++;
    else {
      fehler.push({ firma: l.firma, grund: r.grund });
      // Das Tageslimit gilt fuer alle folgenden auch.
      if (/Tageslimit/i.test(r.grund)) {
        limitErreicht = true;
        break;
      }
    }
  }
  // Wie viele warten noch? Daran erkennt "Alle senden", ob es den naechsten
  // Block anstossen kann.
  return { gesendet, fehler, offen: wartend(await listLeads()).length, limitErreicht };
}

/* ----------------------------- Arbeitsliste ----------------------------- */

/**
 * Was heute ansteht: nachfassen (Erstmail liegt NACHFASS_TAGE zurueck, keine
 * Antwort), anrufen (auch die zweite Mail blieb ohne Antwort) und
 * Wiedervorlagen. Erledigte und gesperrte Kontakte tauchen nie auf.
 *
 * Massgeblich ist `faellig_am`, das beim Versand gesetzt wird und nie auf ein
 * Wochenende faellt (siehe inTagen). Fehlt es, gilt der Abstand zur Mail.
 */
export function faelligkeiten(leads: Lead[]): Faellig[] {
  const jetzt = Date.now();
  const heute = kalendertag(jetzt);
  const stichtag = jetzt - NACHFASS_TAGE * TAG_MS;
  const seit = (ms: number) => Math.max(0, Math.floor((jetzt - ms) / TAG_MS));
  const dran = (l: Lead, gesendet: number) =>
    l.faellig_am ? l.faellig_am <= heute : gesendet <= stichtag;

  const raus: Faellig[] = [];
  for (const l of leads) {
    if (l.gesperrt || ERLEDIGT.includes(l.status)) continue;
    const basis = { id: l.id, firma: l.firma, telefon: l.telefon, status: l.status };
    if (l.status === "angeschrieben" && l.angeschrieben_am && dran(l, l.angeschrieben_am)) {
      raus.push({ ...basis, schritt: "nachfassen", seitTagen: seit(l.angeschrieben_am) });
    } else if (l.status === "nachgefasst" && l.nachgefasst_am && dran(l, l.nachgefasst_am)) {
      raus.push({ ...basis, schritt: "anrufen", seitTagen: seit(l.nachgefasst_am) });
    } else if (
      l.faellig_am &&
      l.faellig_am <= heute &&
      ["antwort", "infos", "termin", "anrufen"].includes(l.status)
    ) {
      raus.push({
        ...basis,
        schritt: "wiedervorlage",
        seitTagen: seit(new Date(`${l.faellig_am}T00:00:00`).getTime()),
      });
    }
  }
  return raus.sort((a, b) => b.seitTagen - a.seitTagen);
}
