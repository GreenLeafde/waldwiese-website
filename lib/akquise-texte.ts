/**
 * Akquise: Stammwerte, Mail-Entwuerfe und die Mail-Huelle.
 *
 * Reine String-Funktionen ohne Server-Abhaengigkeit. Dadurch nutzt die
 * Oberflaeche (components/admin/akquise-manager.tsx) dieselben Listen und
 * Texte wie der Versand (lib/akquise.ts), und die Vorschau im Backend ist
 * genau die Mail, die rausgeht.
 *
 * Vorbild ist der Akquise-Bereich im Hotel-Backend (das-naturlich,
 * /admin/akquise). Dort gelernt und hier uebernommen:
 *   - kurze, persoenliche Mails ohne Bilder. Was wie ein Rundschreiben
 *     aussieht, wird wie eines behandelt.
 *   - genau EINE Frage am Ende. Wer eine Antwort will, muss fragen.
 *   - denselben Text nie zweimal an denselben Kontakt.
 *
 * Schreibregel fuer alles, was nach aussen geht: keine Gedankenstriche,
 * Sie-Form, Gruss "Herzliche Grüße aus dem grünen Sinzing".
 */

import { COMPANY, CONTACT, SITE } from "./site";

/**
 * Hoechstens so viele Akquise-Mails pro Tag. Wie im Natuerlich (250).
 *
 * Die Zahl ist die einzige Bremse, die davor schuetzt, einen Fehler
 * hundertfach zu machen. Ueber dasselbe Resend-Konto laufen Newsletter und
 * Kontaktformular: vor groesseren Stapeln in Resend nachsehen, ob
 * Ruecklaeufer und Beschwerden der letzten Tage bei null liegen.
 */
export const TAGESLIMIT = 250;

/** So viele Erstkontakte schickt ein Stapel hoechstens. "Alle senden" laeuft in solchen Bloecken. */
export const STAPEL_MAX = 50;

/** Tage bis zum Nachfassen, und danach bis zum Anruf. */
export const NACHFASS_TAGE = 5;

/** Wer die Mails unterschreibt (Emilian, 09.10.2026). */
export const ABSENDER = {
  name: "Emilian Leber",
  rolle: "Wald & Wiese · Restaurant in Sinzing",
} as const;

/** Das Blatt, das am Erstkontakt haengt. Liegt unter /public/downloads. */
export const ANHANG = {
  datei: "Wald-und-Wiese-Weihnachtsfeier.pdf",
  pfad: "/downloads/wald-wiese-weihnachtsfeier.pdf",
} as const;

export const GRUSS = "Herzliche Grüße aus dem grünen Sinzing";

/**
 * Sichtbare Abmeldezeile im Mail-Fuss. Aus, wie im Natuerlich: eine
 * Akquise-Mail ist eine normale Kontaktanfrage, kein Rundschreiben. Der
 * Abmeldeweg steckt weiter im List-Unsubscribe-Kopf jeder Mail.
 */
export const ABMELDEZEILE_SICHTBAR = false;

/**
 * Der Weg eines Kontakts. Alle Wege enden in genau zwei Toepfen: `kunde`
 * oder `abgesagt`. Alles dazwischen ist Arbeit, die noch ansteht.
 */
export const STATUS = [
  "neu",
  "entwurf",
  "angeschrieben",
  "nachgefasst",
  "anrufen",
  "antwort",
  "infos",
  "termin",
  "kunde",
  "abgesagt",
] as const;
export type Status = (typeof STATUS)[number];

export const STATUS_TEXT: Record<Status, string> = {
  neu: "neu",
  entwurf: "Entwurf steht",
  angeschrieben: "angeschrieben",
  nachgefasst: "nachgefasst",
  anrufen: "anrufen",
  antwort: "hat geantwortet",
  infos: "braucht Infos",
  termin: "Termin",
  kunde: "Kunde",
  abgesagt: "abgesagt",
};

/** Hier ist nichts mehr zu tun. */
export const ERLEDIGT: readonly Status[] = ["kunde", "abgesagt"];

export const TYPEN = [
  "firma",
  "praxis",
  "handwerk",
  "verein",
  "einrichtung",
  "sonstiges",
] as const;
export type Typ = (typeof TYPEN)[number];

export const TYP_TEXT: Record<Typ, string> = {
  firma: "Firmen & Betriebe",
  praxis: "Praxen & Kanzleien",
  handwerk: "Handwerk & Bau",
  verein: "Vereine & Verbände",
  einrichtung: "Schulen, Behörden & Einrichtungen",
  sonstiges: "Sonstiges",
};

export type Lead = {
  id: string;
  firma: string;
  person: string | null;
  rolle: string | null;
  email: string | null;
  telefon: string | null;
  website: string | null;
  ort: string | null;
  branche: string | null;
  typ: Typ;
  quelle: string | null;
  status: Status;
  notiz: string | null;
  naechster_schritt: string | null;
  /** Kalendertag JJJJ-MM-TT */
  faellig_am: string | null;
  /** Ein ganzer Satz mit etwas Konkretem von der Website der Firma. */
  fakt: string | null;
  /** In einem Satz: warum wir zu genau dieser Firma passen. */
  passung: string | null;
  betreff: string | null;
  entwurf: string | null;
  angeschrieben_am: number | null;
  nachgefasst_am: number | null;
  anruf_am: number | null;
  anruf_ergebnis: string | null;
  zuletzt_gesendet_text: string | null;
  zuletzt_gesendet_am: number | null;
  gesperrt: boolean;
  created_at: number;
  updated_at: number;
};

export type LeadEvent = {
  id: string;
  art: string;
  text: string | null;
  created_at: number;
};

export type Faellig = {
  id: string;
  firma: string;
  telefon: string | null;
  status: Status;
  schritt: "nachfassen" | "anrufen" | "wiedervorlage";
  seitTagen: number;
};

type Kopf = Pick<Lead, "firma" | "person" | "ort" | "typ" | "fakt" | "passung">;

const gross = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const ohnePunkt = (s: string | null | undefined) =>
  String(s ?? "")
    .trim()
    .replace(/[.;]+$/, "");

/**
 * "Guten Tag Frau Muster," wenn die Person mit Frau/Herr angelegt ist, sonst
 * der volle Name, sonst ohne Namen. Kein "Sehr geehrte": zu steif fuer eine
 * Mail, die persoenlich gemeint ist.
 */
export function anrede(l: Pick<Lead, "person">): string {
  const p = String(l.person ?? "").trim();
  if (!p) return "Guten Tag,";
  const m = p.match(/^(frau|herr)\s+(.+)$/i);
  if (m) {
    const nachname = m[2].trim().split(/\s+/).slice(-1)[0];
    return `Guten Tag ${gross(m[1].toLowerCase())} ${nachname},`;
  }
  return `Guten Tag ${p},`;
}

/**
 * Ein Aufhaenger je Zielgruppe: ein Satz zur Lage, ein Satz Nutzen, eine
 * Frage. Preise stehen bewusst nirgends, die klaeren wir wie auf der Website
 * persoenlich.
 *
 * Jede Aussage hier steht so auch auf restaurant-waldwiese.de/weihnachtsfeier.
 * Wer hier etwas Neues behauptet, muss es dort ebenfalls halten koennen.
 */
const AUFHAENGER: Record<
  Typ,
  { betreff: string; lage: string; nutzen: string; frage: string }
> = {
  firma: {
    betreff: "Weihnachtsfeier für Ihr Team bei Regensburg",
    lage: "Die Weihnachtsfeier steht bei vielen Betrieben gerade auf der Liste, und die Abende im Advent sind erfahrungsgemäß zuerst vergeben.",
    nutzen:
      "Bei uns feiern Teams in Ruhe: hausgemachte, regionale Küche und drei Menüwege vom klassischen Drei-Gänge-Menü bis zum Buffet. Ab 30 Personen gehört Ihnen das ganze Restaurant als geschlossene Gesellschaft, und auch kleine Runden sind herzlich willkommen.",
    frage: "Haben Sie für dieses Jahr schon einen Ort für Ihre Feier?",
  },
  praxis: {
    betreff: "Weihnachtsessen für Ihr Team",
    lage: "Ein kleines Team feiert anders als ein großer Betrieb: ein Tisch, gutes Essen und Zeit zum Reden.",
    nutzen:
      "Genau das können wir gut. Kleinere Runden bekommen bei uns einen eigenen Bereich, gekocht wird hausgemacht und regional, vegetarisch und vegan sind bei jedem Menü gleichwertig dabei.",
    frage: "Wäre ein Abend bei uns etwas für Ihr Team?",
  },
  handwerk: {
    betreff: "Weihnachtsfeier für Ihre Mannschaft",
    lage: "Nach einem vollen Jahr soll die Weihnachtsfeier unkompliziert sein: hinkommen, gut essen, zusammensitzen.",
    nutzen:
      "Bei uns gibt es ehrliche, hausgemachte Küche, Parkplätze direkt am Haus und für größere Runden auf Wunsch ein Buffet. Ab 30 Personen haben Sie das ganze Restaurant für sich.",
    frage: "Steht bei Ihnen schon fest, wo dieses Jahr gefeiert wird?",
  },
  verein: {
    betreff: "Jahresabschluss für Ihren Verein",
    lage: "Zum Jahresende kommen Vorstand und Mitglieder noch einmal zusammen, und dafür braucht es einen Ort, an dem alle Platz haben.",
    nutzen:
      "Im Innenraum haben bei uns rund 50 Gäste Platz. Ab 30 Personen feiern Sie als geschlossene Gesellschaft im ganzen Restaurant, kleinere Runden bekommen einen eigenen Bereich.",
    frage: "Suchen Sie für Ihre Feier noch einen Ort?",
  },
  einrichtung: {
    betreff: "Weihnachtsfeier für Ihr Kollegium",
    lage: "Ein Kollegium zum Jahresende an einen Tisch zu bekommen ist schwer genug, der Ort sollte es nicht zusätzlich kompliziert machen.",
    nutzen:
      "Wir haben Parkplätze direkt am Haus, kochen hausgemacht und regional, und vegetarisch und vegan sind bei jedem Menü gleichwertig dabei.",
    frage: "Darf ich Ihnen einen Vorschlag für Ihren Wunschtermin machen?",
  },
  sonstiges: {
    betreff: "Weihnachtsfeier bei Wald & Wiese in Sinzing",
    lage: "Vielleicht suchen Sie für dieses Jahr noch einen Ort für Ihre Weihnachtsfeier.",
    nutzen:
      "Wir kochen hausgemacht und regional, haben drei Menüwege vom klassischen Drei-Gänge-Menü bis zum Buffet und Platz für rund 50 Gäste im Innenraum. Ab 30 Personen feiern Sie als geschlossene Gesellschaft, kleine Runden sind genauso willkommen.",
    frage: "Wäre das für Sie interessant?",
  },
};

/** Nur sagen, was stimmt: die Fahrzeit kennen wir nur ab Regensburg-Süd. */
function ortsatz(ort: string | null): string {
  const o = String(ort ?? "").trim();
  if (/sinzing/i.test(o)) return " Wir sind direkt bei Ihnen im Ort.";
  if (/regensburg/i.test(o))
    return " Von Regensburg-Süd sind es zehn Minuten zu uns.";
  return "";
}

/**
 * Vorschlag fuer die erste Mail. Steht ein recherchierter Fakt am Kontakt,
 * traegt ER den Einstieg. Der Satz zur Zielgruppe ist nur der Rueckfall.
 */
export function entwurfFuer(l: Kopf): { betreff: string; text: string } {
  const h = AUFHAENGER[l.typ] ?? AUFHAENGER.firma;
  const firma = String(l.firma ?? "").trim();
  const fakt = ohnePunkt(l.fakt);
  const passung = ohnePunkt(l.passung);

  const einstieg = fakt
    ? `Ich habe mir ${firma || "Ihr Haus"} angesehen. ${gross(fakt)}.`
    : h.lage;
  const bruecke = passung ? `${gross(passung)}. ${h.nutzen}` : h.nutzen;

  return {
    betreff: h.betreff,
    text: `${anrede(l)}

ich bin ${ABSENDER.name} vom Restaurant Wald & Wiese in Sinzing, einem Familienbetrieb am Waldrand. ${einstieg}

${bruecke}${ortsatz(l.ort)}

Im Anhang finden Sie ein Blatt mit allem, was Sie für die Planung brauchen.

${h.frage}

${GRUSS}
${ABSENDER.name}`,
  };
}

/**
 * Vorschlag fuer die zweite Mail. Kurz: die erste hat alles gesagt, hier geht
 * es nur darum, noch einmal aufzutauchen, ohne zu draengeln. Drei Fassungen,
 * verteilt nach der Kontakt-Kennung, damit nicht jede Firma denselben Satz
 * bekommt.
 */
export function nachfassEntwurf(
  l: Pick<Lead, "id" | "person" | "betreff">,
): { betreff: string; text: string } {
  const ersteMail = String(l.betreff ?? "").trim();
  const nummer =
    String(l.id)
      .split("")
      .reduce((s, c) => s + c.charCodeAt(0), 0) % 3;
  const ende = `\n\n${GRUSS}\n${ABSENDER.name}`;

  const fassungen = [
    {
      betreff: ersteMail ? `Nochmal wegen: ${ersteMail}` : "Kurz nachgefragt",
      text: `${anrede(l)}\n\nvor ein paar Tagen hatte ich Ihnen wegen Ihrer Weihnachtsfeier geschrieben. Ich weiß, wie so etwas im Tagesgeschäft untergeht, deshalb diese eine kurze Erinnerung.\n\nFalls das Thema bei Ihnen schon erledigt ist, sagen Sie einfach kurz Bescheid, dann melde ich mich nicht wieder. Und falls nicht, reicht eine Zeile mit Ihrem Wunschtermin.${ende}`,
    },
    {
      betreff: "Darf ich nachhaken?",
      text: `${anrede(l)}\n\nmeine Mail von neulich ist vermutlich untergegangen. Das ist keine Kritik, bei uns läuft es genauso.\n\nFalls Sie für Ihre Feier noch einen Ort suchen, mache ich Ihnen gern einen Vorschlag für Ihren Wunschtermin. Falls nicht, sagen Sie es mir ruhig, dann lasse ich Sie in Frieden.${ende}`,
    },
    {
      betreff: "Letzte Nachricht von mir",
      text: `${anrede(l)}\n\nich melde mich ein zweites und letztes Mal. Wenn ich nichts höre, gehe ich davon aus, dass Ihre Feier schon steht, und Sie haben Ruhe vor mir.\n\nSollte sich das ändern, finden Sie uns unter restaurant-waldwiese.de. Wir sind in Sinzing und bleiben da.${ende}`,
    },
  ];
  return fassungen[nummer];
}

/* ------------------------------ Mail-Huelle ------------------------------ */

const SANS = "-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const GRUEN = "#2e3d2c";
const TON = "#c97c5d";
const TEXT = "#1f2b1d";
const GRAU = "#7c8278";

export function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Signatur wie aus einem echten Mailprogramm. Jede Zeile eine Tabellenzeile:
 * Outlook kennt kein Flexbox, und <div>-Umbrueche gehen beim Weiterleiten
 * verloren. Kein Bild: das Logo von Wald & Wiese ist ohnehin ein Schriftzug.
 */
function signaturHtml(siteUrl: string): string {
  const zeile = (
    inhalt: string,
    o: { farbe?: string; stil?: string; abstand?: number } = {},
  ) =>
    `<tr><td style="padding:0 0 ${o.abstand ?? 4}px;font:${o.stil ?? "400 14px/1.5"} ${SANS};color:${o.farbe ?? TEXT};">${inhalt}</td></tr>`;
  const link = (href: string, text: string, fett = false) =>
    `<a href="${href}" style="color:${fett ? GRUEN : TEXT};text-decoration:none;${fett ? "font-weight:700;" : ""}">${text}</a>`;
  const web = siteUrl.replace(/^https?:\/\//, "");
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;border-collapse:collapse;">
    ${zeile(esc(ABSENDER.name), { farbe: GRUEN, stil: "700 17px/1.4", abstand: 2 })}
    ${zeile(esc(ABSENDER.rolle), { farbe: TON, abstand: 12 })}
    ${zeile(link(`tel:${CONTACT.phoneRaw}`, CONTACT.phone))}
    ${zeile(link(`mailto:${CONTACT.email}`, CONTACT.email))}
    ${zeile(link(siteUrl, esc(web), true))}
    ${zeile(`${CONTACT.street} · ${CONTACT.postalCode} ${CONTACT.city}`, { farbe: GRAU, abstand: 16 })}
    <tr><td style="padding:0;font-family:${SERIF};font-size:17px;letter-spacing:3px;color:${GRUEN};">WALD <span style="font-style:italic;font-size:14px;color:${TON};">&amp;</span> WIESE</td></tr>
  </table>`;
}

/** Pflichtangaben wie im Briefkopf, darunter der Weg hinaus. */
function fussHtml(siteUrl: string, abmeldeUrl: string): string {
  const abmelden =
    ABMELDEZEILE_SICHTBAR && abmeldeUrl
      ? `<br />Sie möchten keine weitere Nachricht von uns? <a href="${abmeldeUrl}" style="color:${GRAU};">Hier abmelden</a>.`
      : "";
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;max-width:600px;">
    <tr><td style="border-top:1px solid #e3ddcf;padding-top:12px;font:400 11.5px/1.8 ${SANS};color:${GRAU};">
      <b style="color:#5d6459;">${esc(SITE.legalName)}</b><br />
      ${CONTACT.street} · ${CONTACT.postalCode} ${CONTACT.city} · ${CONTACT.country}<br />
      ${COMPANY.ceoTitel}: ${esc(COMPANY.ceo)} · ${COMPANY.court}, ${COMPANY.register} · USt-IdNr.: ${COMPANY.vatId}<br />
      Telefon ${CONTACT.phone} · <a href="mailto:${CONTACT.email}" style="color:${GRAU};">${CONTACT.email}</a> ·
      <a href="${siteUrl}/impressum" style="color:${GRAU};">Impressum</a> ·
      <a href="${siteUrl}/datenschutz" style="color:${GRAU};">Datenschutz</a>${abmelden}
    </td></tr>
  </table>`;
}

/** Schneidet Gruss und Namen am Ende ab. Beides setzt die Signatur. */
function ohneGruss(text: string): string {
  const muster = new RegExp(
    `\\n?${GRUSS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n${ABSENDER.name}\\s*$`,
  );
  return text.trim().replace(muster, "").trim();
}

/**
 * Text → HTML. Absaetze bleiben Absaetze, Zeilen mit "• " werden eine echte
 * Liste. Gruss und Signatur kommen immer von hier, egal was im Text steht.
 */
export function mailHtml(
  text: string,
  opts: { siteUrl: string; abmeldeUrl: string },
): string {
  const bloecke = ohneGruss(text)
    .split(/\n{2,}/)
    .map((block) => {
      const zeilen = block.split("\n");
      if (zeilen.every((z) => z.trim().startsWith("•"))) {
        return (
          `<ul style="margin:0 0 16px;padding:0 0 0 20px;font:400 15px/1.7 ${SANS};color:${TEXT};">` +
          zeilen
            .map(
              (z) =>
                `<li style="margin:0 0 4px;">${esc(z.replace(/^\s*•\s*/, ""))}</li>`,
            )
            .join("") +
          `</ul>`
        );
      }
      return `<p style="margin:0 0 16px;font:400 15px/1.65 ${SANS};color:${TEXT};">${zeilen
        .map((z) => esc(z))
        .join("<br />")}</p>`;
    })
    .join("");

  return `<div style="max-width:600px;margin:0;padding:0;">
    ${bloecke}
    <p style="margin:0;font:400 15px/1.65 ${SANS};color:${TEXT};">${esc(GRUSS)}</p>
    ${signaturHtml(opts.siteUrl)}
    ${fussHtml(opts.siteUrl, opts.abmeldeUrl)}
  </div>`;
}

/** Reintext-Fassung derselben Mail (fuer Mailprogramme ohne HTML). */
export function mailText(
  text: string,
  opts: { siteUrl: string; abmeldeUrl: string },
): string {
  const abmelden =
    ABMELDEZEILE_SICHTBAR && opts.abmeldeUrl
      ? `\nKeine weitere Nachricht gewünscht: ${opts.abmeldeUrl}`
      : "";
  return `${ohneGruss(text)}

${GRUSS}
${ABSENDER.name}
${ABSENDER.rolle}
${CONTACT.phone} · ${CONTACT.email} · ${opts.siteUrl}

${SITE.legalName} · ${CONTACT.street} · ${CONTACT.postalCode} ${CONTACT.city}
${COMPANY.ceoTitel}: ${COMPANY.ceo} · ${COMPANY.court}, ${COMPANY.register} · USt-IdNr.: ${COMPANY.vatId}${abmelden}`;
}

/** Fertige Mail zum Ansehen im Backend. Gleicher Weg wie der Versand. */
export function vorschauHtml(input: {
  an: string;
  betreff: string;
  text: string;
  mitAnhang: boolean;
  siteUrl: string;
}): string {
  const kopf =
    `An: ${esc(input.an || "(keine Adresse)")}` +
    (input.mitAnhang ? ` · Anhang: ${esc(ANHANG.datei)}` : "");
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8" /><title>${esc(input.betreff)}</title></head>
  <body style="margin:0;background:#f7f6f3;padding:20px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;padding:24px;">
      <p style="margin:0 0 4px;font:400 12px/1.4 ${SANS};color:${GRAU};">${kopf}</p>
      <p style="margin:0 0 18px;font:600 16px/1.4 ${SANS};color:${TEXT};">${esc(input.betreff)}</p>
      ${mailHtml(input.text, { siteUrl: input.siteUrl, abmeldeUrl: "#" })}
    </div></body></html>`;
}
