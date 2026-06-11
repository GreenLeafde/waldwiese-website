/**
 * Newsletter-Vorlagen. Reine, client-sichere Render-Funktionen: aus den
 * Eingabefeldern wird gebrandetes HTML erzeugt. Der Impressum-Footer kommt
 * beim Versand automatisch dazu (wrapHtml in newsletter-admin.ts).
 */

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
  render: (v: Record<string, string>) => string;
};

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
        `<p style="margin:0 0 14px;font-size:16px;color:#1a1a1a;line-height:1.65">${esc(
          p,
        ).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

function heading(t: string): string {
  return t
    ? `<h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#2e3d2c;font-size:28px;line-height:1.2;margin:0 0 16px">${esc(
        t,
      )}</h1>`
    : "";
}

function kicker(t: string): string {
  return t
    ? `<p style="text-transform:uppercase;letter-spacing:2px;font-size:12px;color:#c97c5d;font-weight:600;margin:0 0 10px">${esc(
        t,
      )}</p>`
    : "";
}

function button(text: string, url: string): string {
  if (!text || !url) return "";
  return `<p style="margin:22px 0 4px"><a href="${esc(
    url,
  )}" style="display:inline-block;background:#c97c5d;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:9999px;font-weight:600;font-size:15px">${esc(
    text,
  )}</a></p>`;
}

function image(url: string): string {
  return url
    ? `<img src="${esc(
        url,
      )}" alt="" style="width:100%;max-width:100%;border-radius:14px;display:block;margin:0 0 22px" />`
    : "";
}

export const NEWSLETTER_TEMPLATES: NewsletterTemplate[] = [
  {
    id: "schlicht",
    name: "Schlicht",
    description: "Überschrift + Text. Klar und persönlich.",
    fields: [
      { key: "title", label: "Überschrift", type: "text", placeholder: "Servus zusammen!" },
      {
        key: "body",
        label: "Text",
        type: "textarea",
        placeholder: "Schreib hier deine Nachricht … (eine Leerzeile = neuer Absatz)",
      },
    ],
    render: (v) => heading(v.title) + paras(v.body),
  },
  {
    id: "bild-button",
    name: "Mit Bild & Button",
    description: "Bild oben, Text, Button — z. B. für die Reservierung.",
    fields: [
      { key: "image", label: "Bild-URL", type: "image", placeholder: "https://… (Adresse eines Bildes)" },
      { key: "title", label: "Überschrift", type: "text", placeholder: "Frühstück startet bald!" },
      { key: "body", label: "Text", type: "textarea", placeholder: "Dein Text …" },
      { key: "buttonText", label: "Button-Text", type: "text", placeholder: "Tisch reservieren" },
      {
        key: "buttonUrl",
        label: "Button-Link",
        type: "text",
        placeholder: "https://restaurant-waldwiese.de/reservieren",
      },
    ],
    render: (v) =>
      image(v.image) + heading(v.title) + paras(v.body) + button(v.buttonText, v.buttonUrl),
  },
  {
    id: "ankuendigung",
    name: "Ankündigung",
    description: "Kleines Label, große Überschrift, Text, Button.",
    fields: [
      { key: "kicker", label: "Label (klein)", type: "text", placeholder: "Neu bei Wald & Wiese" },
      { key: "title", label: "Überschrift", type: "text", placeholder: "Es ist soweit." },
      { key: "body", label: "Text", type: "textarea", placeholder: "Dein Text …" },
      { key: "buttonText", label: "Button-Text", type: "text", placeholder: "Mehr erfahren" },
      { key: "buttonUrl", label: "Button-Link", type: "text", placeholder: "https://restaurant-waldwiese.de" },
    ],
    render: (v) =>
      kicker(v.kicker) + heading(v.title) + paras(v.body) + button(v.buttonText, v.buttonUrl),
  },
  {
    id: "html",
    name: "HTML selbst",
    description: "Für Profis: eigenes HTML schreiben.",
    fields: [{ key: "html", label: "HTML", type: "html", placeholder: "<h1>…</h1><p>…</p>" }],
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
