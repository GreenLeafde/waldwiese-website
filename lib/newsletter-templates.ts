/**
 * Newsletter-Vorlagen. Reine, client-sichere Render-Funktionen: aus den
 * Eingabefeldern wird gebrandetes, E-Mail-taugliches HTML erzeugt (Tabellen +
 * Inline-Styles). Der Impressum-Footer kommt beim Versand automatisch dazu.
 *
 * Markenfarben: Waldgrün #2e3d2c · Mehlcreme #f2ead8 · Tonwarm #c97c5d.
 */

import { SITE } from "./site";

export type TemplateField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "html";
  placeholder?: string;
};

export type NewsletterTemplate = {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  /** Vorbelegung — dient als fertiges Beispiel UND als Vorschau-Inhalt. */
  sample: Record<string, string>;
  render: (v: Record<string, string>) => string;
};

const PHOTO = (name: string) => `${SITE.url}/photos/${name}`;

/* ------------------------------ Bausteine ------------------------------ */

function esc(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function paras(body: string): string {
  return (body ?? "")
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 15px;font-size:16px;color:#3a3a36;line-height:1.7">${esc(
          p,
        ).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

function hero(url: string): string {
  return url
    ? `<img src="${esc(
        url,
      )}" width="600" alt="" style="width:100%;max-width:100%;display:block;border-radius:16px;margin:0 0 6px" />`
    : "";
}

function kicker(t: string): string {
  return t
    ? `<div style="text-transform:uppercase;letter-spacing:2.5px;font-size:12px;color:#c97c5d;font-weight:700;margin:0 0 10px">${esc(
        t,
      )}</div>`
    : "";
}

function heading(t: string, size = 30): string {
  return t
    ? `<h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#2e3d2c;font-size:${size}px;line-height:1.18;margin:0 0 16px">${esc(
        t,
      )}</h1>`
    : "";
}

function button(text: string, url: string): string {
  if (!text || !url) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px"><tr><td style="border-radius:9999px;background:#c97c5d"><a href="${esc(
    url,
  )}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;font-family:Helvetica,Arial,sans-serif">${esc(
    text,
  )} &nbsp;&rarr;</a></td></tr></table>`;
}

/** Grünes „noch geheim"-Kästchen — wie der Coming-Soon-Teaser auf der Website. */
function secretBox(text: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0"><tr><td bgcolor="#2e3d2c" style="background:#2e3d2c;border-radius:16px;padding:26px 26px;text-align:center">
    <div style="text-transform:uppercase;letter-spacing:2.5px;font-size:11px;color:#c97c5d;font-weight:700;margin-bottom:8px">Noch geheim</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#f2ead8;line-height:1.4">${esc(
      text,
    )}</div>
  </td></tr></table>`;
}

/** Inhalt in einer Mehlcreme-Karte mit dezentem Rand. */
function creamCard(inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2ead8;border-radius:18px"><tr><td style="padding:32px 30px">${inner}</td></tr></table>`;
}

/**
 * Magic Dinner im eigenen Look (CI „Magic Dinner CI & Plakat.pdf“): Nachtwand
 * #0B0708, Neonrot #FF2A3D, Röhrenweiß #FFE6E9. Mail-Clients kennen die CI-Schriften
 * nicht — darum gesperrte Versalien in Arial; das Leuchtschild steckt im Motiv.
 */
function magicCard(v: Record<string, string>): string {
  const p = (v.body ?? "")
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map(
      (t) =>
        `<p style="margin:0 0 15px;font-size:16px;color:#ffe6e9;line-height:1.7;font-family:Helvetica,Arial,sans-serif">${esc(t).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
  const img = v.image
    ? `<img src="${esc(v.image)}" width="600" alt="Magic Dinner" style="width:100%;max-width:100%;display:block;border-radius:14px 14px 0 0" />`
    : "";
  const kick = v.kicker
    ? `<div style="text-transform:uppercase;letter-spacing:3px;font-size:12px;color:#ff2a3d;font-weight:700;margin:0 0 12px;font-family:Helvetica,Arial,sans-serif">${esc(v.kicker)}</div>`
    : "";
  const title = v.title
    ? `<h1 style="font-family:Helvetica,Arial,sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#ffe6e9;font-size:28px;line-height:1.15;margin:0 0 18px">${esc(v.title)}</h1>`
    : "";
  const box = v.secret
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td style="border:2px solid #ff2a3d;border-radius:12px;padding:20px 22px;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:800;letter-spacing:2px;color:#ffe6e9">${esc(v.secret)}</td></tr></table>`
    : "";
  const btn =
    v.buttonText && v.buttonUrl
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 6px"><tr><td style="border-radius:9999px;background:#ff2a3d"><a href="${esc(v.buttonUrl)}" style="display:inline-block;padding:15px 34px;color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;letter-spacing:2px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif">${esc(v.buttonText)}</a></td></tr></table>`
      : "";
  const note = v.note
    ? `<p style="margin:12px 0 0;text-align:center;font-size:12px;letter-spacing:1px;color:#ffe6e9;opacity:.75;line-height:1.6;font-family:Helvetica,Arial,sans-serif">${esc(v.note)}</p>`
    : "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#0b0708" style="background:#0b0708;border-radius:14px"><tr><td>${img}</td></tr><tr><td style="padding:30px 30px 32px">${kick}${title}${p}${box}${btn}${note}</td></tr></table>`;
}

/* ------------------------------ Vorlagen ------------------------------ */

export const NEWSLETTER_TEMPLATES: NewsletterTemplate[] = [
  {
    id: "fruehstueck",
    name: "Frühstücks-Ankündigung",
    description:
      "Fertige Beispielmail: Hero-Bild, Ankündigung, Geheim-Box, Reservieren-Button.",
    fields: [
      { key: "image", label: "Hero-Bild (URL)", type: "image" },
      { key: "kicker", label: "Label (klein)", type: "text" },
      { key: "title", label: "Überschrift", type: "text" },
      { key: "body", label: "Text", type: "textarea" },
      { key: "secret", label: "Geheim-Box (Text)", type: "text" },
      { key: "buttonText", label: "Button-Text", type: "text" },
      { key: "buttonUrl", label: "Button-Link", type: "text" },
    ],
    sample: {
      image: PHOTO("food-breakfast-spread.jpg"),
      kicker: "Bald · Frühstück in Sinzing bei Regensburg",
      title: "Frühstück, mitten im Grünen.",
      body: "Hallo {{vorname}},\n\nes ist so weit: Ab dem 6. Juli 2026 starten wir jeden Morgen frisch ins Frühstück — Brot vom Bäcker, Obst aus Sinzing, hausgemachte Aufstriche, Granola und Kaffee mit Charakter.\n\nKomm vorbei, bring den Hund mit, bleib so lange du magst.",
      secret: "Die komplette Frühstückskarte verraten wir kurz vor dem Start.",
      buttonText: "Tisch sichern",
      buttonUrl: `${SITE.url}/reservieren`,
    },
    render: (v) =>
      hero(v.image) +
      `<div style="padding-top:18px">` +
      kicker(v.kicker) +
      heading(v.title, 32) +
      paras(v.body) +
      (v.secret ? secretBox(v.secret) : "") +
      button(v.buttonText, v.buttonUrl) +
      `</div>`,
  },
  {
    id: "schlicht",
    name: "Schlicht",
    description: "Überschrift + Text. Klar und persönlich.",
    fields: [
      { key: "title", label: "Überschrift", type: "text" },
      { key: "body", label: "Text", type: "textarea" },
    ],
    sample: {
      title: "Servus {{vorname}}!",
      body: "Schön, dass du dabei bist. Wir melden uns, sobald es bei uns Neues gibt.\n\nBis bald, eure Familie Leber",
    },
    render: (v) => heading(v.title) + paras(v.body),
  },
  {
    id: "bild-button",
    name: "Mit Bild & Button",
    description: "Hero-Bild oben, Text, Button — schlicht und flexibel.",
    fields: [
      { key: "image", label: "Bild (URL)", type: "image" },
      { key: "title", label: "Überschrift", type: "text" },
      { key: "body", label: "Text", type: "textarea" },
      { key: "buttonText", label: "Button-Text", type: "text" },
      { key: "buttonUrl", label: "Button-Link", type: "text" },
    ],
    sample: {
      image: PHOTO("terrasse-olivenbaum.jpg"),
      title: "Sommerabende auf der Terrasse",
      body: "Lange Abende, kühle Drinks, mitten im Grünen. Sichere dir deinen Platz.",
      buttonText: "Tisch reservieren",
      buttonUrl: `${SITE.url}/reservieren`,
    },
    render: (v) =>
      hero(v.image) +
      `<div style="padding-top:18px">` +
      heading(v.title) +
      paras(v.body) +
      button(v.buttonText, v.buttonUrl) +
      `</div>`,
  },
  {
    id: "ankuendigung",
    name: "Ankündigung (Karte)",
    description: "Inhalt in einer Mehlcreme-Karte — ruhig und edel.",
    fields: [
      { key: "kicker", label: "Label (klein)", type: "text" },
      { key: "title", label: "Überschrift", type: "text" },
      { key: "body", label: "Text", type: "textarea" },
      { key: "buttonText", label: "Button-Text", type: "text" },
      { key: "buttonUrl", label: "Button-Link", type: "text" },
    ],
    sample: {
      kicker: "Neu bei Wald & Wiese",
      title: "Es gibt was zu feiern.",
      body: "Erfahre als Erste/r, was bei uns als Nächstes ansteht.",
      buttonText: "Mehr erfahren",
      buttonUrl: SITE.url,
    },
    render: (v) =>
      creamCard(
        kicker(v.kicker) +
          heading(v.title) +
          paras(v.body) +
          button(v.buttonText, v.buttonUrl),
      ),
  },
  {
    id: "magic-dinner",
    name: "Magic Dinner",
    description:
      "Im Magic-Dinner-Design (Nachtwand + Neonrot): Motiv aus der CI, Text, Fakten-Box, Ticket-Button.",
    fields: [
      { key: "image", label: "Motiv (URL)", type: "image" },
      { key: "kicker", label: "Label (klein)", type: "text" },
      { key: "title", label: "Überschrift", type: "text" },
      { key: "body", label: "Text", type: "textarea" },
      { key: "secret", label: "Neon-Box (z. B. Code oder Hinweis)", type: "text" },
      { key: "buttonText", label: "Button-Text", type: "text" },
      { key: "buttonUrl", label: "Button-Link", type: "text" },
      { key: "note", label: "Zeile unter dem Button", type: "text" },
    ],
    sample: {
      image: `${SITE.url}/newsletter/2026-10/magic-weihnachtsgeschenk.jpg`,
      kicker: "Magic Dinner · Sa 20.02.2027",
      title: "Noch kein Weihnachtsgeschenk?",
      body: "Hallo {{vorname}},\n\nverschenkt dieses Jahr einen Abend voller Magie: ein 3-Gänge-Menü aus unserer Küche und dazwischen eine Live-Show mit Zauberei & Comedy von Emilian Leber.\n\nZum Ticket gibt es unsere Geschenkkarte zum Ausdrucken: falten, Ticket hineinlegen, unter den Baum.",
      secret: "",
      buttonText: "Tickets sichern",
      buttonUrl: `${SITE.url}/veranstaltungen/magic-dinner-regensburg-sinzing-2027`,
      note: "89,90 € pro Person, Menü + Show · Einlass 17 Uhr, Beginn 18 Uhr · Tickets auch an der Bar",
    },
    render: (v) => magicCard(v),
  },
  {
    id: "html",
    name: "HTML selbst",
    description:
      "Volle Kontrolle: eigenes HTML — mit Bild-, Variablen- und Baustein-Einfügen.",
    fields: [{ key: "html", label: "HTML", type: "html", placeholder: "<h1>…</h1><p>…</p>" }],
    sample: {
      html: `<h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#2e3d2c;font-size:30px;line-height:1.2;margin:0 0 16px">Hallo {{vorname}}!</h1>
<p style="margin:0 0 15px;font-size:16px;color:#3a3a36;line-height:1.7">Schreib hier deinen Text — oder bau mit den Knöpfen oben Bilder, Buttons und Bausteine ein. Kopfzeile, Footer und Personalisierung kommen automatisch dazu.</p>`,
    },
    render: (v) => v.html ?? "",
  },
];

export function renderTemplate(
  id: string,
  values: Record<string, string>,
): string {
  const t =
    NEWSLETTER_TEMPLATES.find((tpl) => tpl.id === id) ?? NEWSLETTER_TEMPLATES[0];
  return t.render(values).trim();
}
