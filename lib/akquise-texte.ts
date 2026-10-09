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

type Kopf = Pick<Lead, "id" | "firma" | "person" | "ort" | "typ" | "fakt" | "passung">;

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
 * Erstkontakt: kein Akquise-Ton, sondern eine nette, persoenliche Frage
 * (Emilian, 09.10.2026: "haben Sie schon an die Weihnachtsfeier gedacht",
 * individuell pro Firma, nicht nach Akquise klingend, mit unseren Highlights).
 *
 * Individuell wird die Mail ueber zwei Felder am Kontakt:
 *   - fakt:    ein ganzer Satz zu genau dieser Firma ("Sie sind dieses Jahr
 *              auf ueber 40 Leute gewachsen"). Traegt den persoenlichen Teil.
 *   - passung: ein Satz, warum der Abend bei uns zu ihnen passt.
 * Fehlen beide, nimmt der Entwurf einen Satz je Zielgruppe. Der Text bleibt
 * vor dem Senden frei aenderbar, und wer ihn von Hand schreibt, schlaegt
 * jede Vorlage.
 *
 * Damit zwei Firmen, die sich kennen, nicht denselben Wortlaut bekommen,
 * gibt es je Baustein mehrere Fassungen, verteilt nach der Kontakt-Kennung.
 *
 * Highlights (Emilian, 09.10.2026): Gluehweinempfang, Lagerfeuer,
 * Drei-Gaenge-Menue, auf Wunsch Zauberei. Der Zauberer ist Emilian selbst
 * (Magicel), deshalb in der Ich-Form. Preise stehen bewusst nirgends.
 */
const ZIELGRUPPE: Record<Typ, { betreff: string; satz: string; frage: string }> = {
  firma: {
    betreff: "Haben Sie schon an Ihre Weihnachtsfeier gedacht?",
    satz: "Nach so einem Jahr hat sich Ihr Team einen Abend verdient, an dem sich ausnahmsweise mal jemand anderes um alles kümmert.",
    frage: "Wäre das etwas für Ihr Team? Dann schreiben Sie mir einfach Ihren Wunschtermin und ungefähr, wie viele Sie sind.",
  },
  praxis: {
    betreff: "Schon an Ihr Weihnachtsessen gedacht?",
    satz: "Gerade in einem kleinen Team ist so ein Abend zum Jahresende oft der schönste Moment, einfach mal Danke zu sagen.",
    frage: "Hätten Sie Lust, mit Ihrem Team bei uns zu feiern? Ein Wunschtermin genügt mir schon.",
  },
  handwerk: {
    betreff: "Haben Sie schon an Ihre Weihnachtsfeier gedacht?",
    satz: "Nach einem vollen Jahr auf den Baustellen darf es zum Abschluss ruhig gemütlich werden, ohne dass jemand etwas organisieren muss.",
    frage: "Wäre das was für Ihre Mannschaft? Schreiben Sie mir gern Ihren Wunschtermin.",
  },
  verein: {
    betreff: "Schon an Ihre Weihnachtsfeier gedacht?",
    satz: "Zum Jahresende noch einmal alle zusammen an einem Tisch, das ist für einen Verein oft der schönste Abend im Jahr.",
    frage: "Suchen Sie für Ihren Jahresabschluss noch einen Ort? Ich freue mich über eine kurze Nachricht.",
  },
  einrichtung: {
    betreff: "Haben Sie schon an Ihre Weihnachtsfeier gedacht?",
    satz: "Ein Kollegium zum Jahresende an einen Tisch zu bekommen ist schon Aufgabe genug, der Rest darf dann ruhig einfach sein.",
    frage: "Darf ich Ihnen für Ihren Wunschtermin einen Vorschlag machen?",
  },
  sonstiges: {
    betreff: "Haben Sie schon an Ihre Weihnachtsfeier gedacht?",
    satz: "Vielleicht ist bei Ihnen noch gar nicht entschieden, wo dieses Jahr gefeiert wird.",
    frage: "Wäre das etwas für Sie? Ein Wunschtermin genügt mir für einen Vorschlag.",
  },
};

/** Waehlt eine Fassung, fest je Kontakt (gleiche Kennung, gleiche Fassung). */
function fassung<T>(id: string, salz: string, xs: readonly T[]): T {
  const n = `${salz}:${id}`.split("").reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
  return xs[n % xs.length];
}

const EROEFFNUNG = [
  "haben Sie schon an Ihre Weihnachtsfeier gedacht? Ich frage lieber jetzt, denn die Abende im Advent sind bei uns erfahrungsgemäß als Erstes vergeben.",
  "haben Sie schon an Ihre Weihnachtsfeier gedacht? Ich weiß, im Oktober fühlt sich das noch weit weg an, aber die Adventsabende sind erfahrungsgemäß schnell weg.",
  "haben Sie schon an Ihre Weihnachtsfeier gedacht? Falls noch nicht, hätte ich da eine Idee für Sie.",
] as const;

const VORSTELLUNG = [
  "Ich bin Emilian Leber, meine Familie führt das Wald & Wiese, ein kleines Restaurant am Waldrand in Sinzing.",
  "Kurz zu mir: Ich bin Emilian Leber, und zusammen mit meiner Familie führe ich das Wald & Wiese am Waldrand in Sinzing.",
] as const;

const HIGHLIGHTS = [
  "Bei uns wird es ein richtig schöner Abend: Es gibt einen Glühweinempfang und ein Lagerfeuer, danach ein hausgemachtes Drei-Gänge-Menü, vegetarisch und vegan genauso gut wie alles andere. Und wenn Sie mögen, komme ich zwischen den Gängen mit ein bisschen Zauberei an Ihre Tische, ich bin nämlich auch Zauberer.",
  "Was Sie bei uns erwartet: ein Glühweinempfang, ein Lagerfeuer und ein hausgemachtes Drei-Gänge-Menü, auf Wunsch auch vegetarisch oder vegan. Wer mag, bekommt zwischen den Gängen noch etwas Zauberei an den Tisch. Die mache ich selbst, als Magicel stehe ich seit 2016 auf der Bühne.",
] as const;

const GROESSE = [
  "Ab 30 Personen haben Sie das ganze Restaurant für sich, kleinere Runden sind uns genauso herzlich willkommen.",
  "Kleine Runden sind uns genauso lieb wie große, und ab 30 Personen gehört Ihnen das ganze Restaurant.",
] as const;

/** Nur sagen, was stimmt: die Fahrzeit kennen wir nur ab Regensburg-Süd. */
function ortsatz(ort: string | null): string {
  const o = String(ort ?? "").trim();
  if (/sinzing/i.test(o)) return " Und für Sie ist es nicht einmal ein Weg, wir sind ja direkt im Ort.";
  if (/regensburg/i.test(o)) return " Von Regensburg-Süd sind es nur zehn Minuten zu uns, Parkplätze gibt es direkt am Haus.";
  return " Parkplätze gibt es direkt am Haus.";
}

/**
 * Vorschlag fuer die erste Mail. Steht ein Fakt zur Firma am Kontakt, traegt
 * ER den persoenlichen Teil. Der Satz je Zielgruppe ist nur der Rueckfall.
 */
export function entwurfFuer(l: Kopf): { betreff: string; text: string } {
  const z = ZIELGRUPPE[l.typ] ?? ZIELGRUPPE.firma;
  const id = String(l.id ?? l.firma ?? "");
  const fakt = ohnePunkt(l.fakt);
  const passung = ohnePunkt(l.passung);

  const persoenlich = fakt
    ? `${gross(fakt)}.${passung ? ` ${gross(passung)}.` : " Da wäre so ein Abend doch ein schöner Abschluss."}`
    : passung
      ? `${gross(passung)}.`
      : z.satz;

  return {
    betreff: z.betreff,
    text: `${anrede(l)}

${fassung(id, "auf", EROEFFNUNG)}

${fassung(id, "wer", VORSTELLUNG)} ${persoenlich}

${fassung(id, "hi", HIGHLIGHTS)}

${fassung(id, "gr", GROESSE)}${ortsatz(l.ort)} Ein paar Eindrücke habe ich Ihnen angehängt.

${z.frage}

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
