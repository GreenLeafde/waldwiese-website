/**
 * E-Mail-Hülle: Header-Masthead (oben) + Impressum-Footer-Band (unten).
 * Reine, client-sichere String-Funktionen — werden im Composer für die
 * Live-Vorschau UND beim Versand (newsletter-admin.ts) verwendet. Dadurch ist
 * die Vorschau exakt die Mail, die rausgeht (inkl. Header + Footer).
 *
 * Tabellen-Layout + Inline-Styles für maximale E-Mail-Kompatibilität.
 * Markenfarben: Waldgrün #2e3d2c · Mehlcreme #f2ead8 · Tonwarm #c97c5d.
 */
import { COMPANY, CONTACT, SITE } from "./site";

export type HeaderStyle = "cream" | "green" | "minimal";

export type EmailHeader = {
  title?: string;
  tagline?: string;
  style?: HeaderStyle;
};

export const HEADER_DEFAULTS = {
  title: "Wald & Wiese",
  tagline: "Frühstück · mitten im Grünen",
  style: "cream" as HeaderStyle,
};

export const HEADER_STYLES: { id: HeaderStyle; label: string }[] = [
  { id: "cream", label: "Hell (Creme)" },
  { id: "green", label: "Grün" },
  { id: "minimal", label: "Schlicht" },
];

function esc(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Branding-Masthead ganz oben — Wortmarke + Trennstrich + Unterzeile. */
export function renderHeader(h: EmailHeader = {}): string {
  const title = esc((h.title ?? HEADER_DEFAULTS.title).trim() || HEADER_DEFAULTS.title);
  const tagline = esc((h.tagline ?? HEADER_DEFAULTS.tagline).trim());
  const style: HeaderStyle = h.style ?? HEADER_DEFAULTS.style;

  const dark = style === "green";
  const minimal = style === "minimal";
  const bg = minimal ? "#f7f6f3" : dark ? "#2e3d2c" : "#f2ead8";
  const titleColor = dark ? "#f2ead8" : "#2e3d2c";
  const accent = "#c97c5d";
  const titleSize = minimal ? 21 : 27;
  const pad = minimal ? "24px 30px 8px" : "34px 30px 30px";

  const rule = minimal
    ? ""
    : `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:13px auto 0"><tr><td style="width:46px;border-top:2px solid ${accent};font-size:0;line-height:0">&nbsp;</td></tr></table>`;

  const taglineHtml = tagline
    ? `<div style="text-transform:uppercase;letter-spacing:2.5px;font-size:11px;color:${accent};font-weight:700;margin-top:${
        minimal ? 7 : 13
      }px">${tagline}</div>`
    : "";

  return `<tr><td align="center" bgcolor="${bg}" style="background:${bg};padding:0">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
      <tr><td align="center" style="padding:${pad};text-align:center">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:${titleSize}px;letter-spacing:1px;color:${titleColor}">${title}</div>
        ${rule}
        ${taglineHtml}
      </td></tr>
    </table>
  </td></tr>`;
}

/** Impressum-Footer-Band über die ganze Breite (Pflicht-Abmeldung inklusive). */
function renderFooter(unsubUrl: string, fullWidth = false): string {
  const year = new Date().getFullYear();
  const mailto = `mailto:${CONTACT.email}`;
  const innerWidth = fullWidth
    ? `width="100%" cellpadding="0" cellspacing="0" style="width:100%"`
    : `width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px"`;
  return `<tr><td align="center" bgcolor="#2e3d2c" style="background:#2e3d2c;padding:0">
    <table role="presentation" ${innerWidth}>
      <tr><td style="padding:30px 30px 26px;font-family:Helvetica,Arial,sans-serif;color:#f2ead8">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:1px;color:#f2ead8">WALD &amp; WIESE</div>
        <div style="font-size:13px;color:#b9c2b2;margin-top:3px">Frühstück mitten im Grünen · Sinzing bei Regensburg</div>

        <div style="margin-top:20px;font-size:12px;color:#b9c2b2;line-height:1.8">
          <strong style="color:#f2ead8">${SITE.legalName}</strong><br />
          Geschäftsführer: ${COMPANY.ceo}<br />
          ${CONTACT.street} · ${CONTACT.postalCode} ${CONTACT.city} · ${CONTACT.country}<br />
          Tel.: ${CONTACT.phone} · <a href="${mailto}" style="color:#f2ead8;text-decoration:none">${CONTACT.email}</a><br />
          ${COMPANY.court}, ${COMPANY.register} · USt-IdNr.: ${COMPANY.vatId}
        </div>

        <div style="margin-top:18px;font-size:12px">
          <a href="${SITE.url}" style="color:#c97c5d;text-decoration:none">Website</a> &nbsp;·&nbsp;
          <a href="${SITE.url}/impressum" style="color:#c97c5d;text-decoration:none">Impressum</a> &nbsp;·&nbsp;
          <a href="${SITE.url}/datenschutz" style="color:#c97c5d;text-decoration:none">Datenschutz</a> &nbsp;·&nbsp;
          <a href="${CONTACT.instagram}" style="color:#c97c5d;text-decoration:none">Instagram</a>
        </div>

        <div style="margin-top:20px;border-top:1px solid rgba(242,234,216,0.16);padding-top:14px;font-size:11px;color:#9aa595;line-height:1.7">
          Du erhältst diese E-Mail, weil du dich für den Newsletter von Wald &amp; Wiese angemeldet hast.
          Wenn du keine Newsletter mehr möchtest, kannst du dich <a href="${unsubUrl}" style="color:#f2ead8">hier jederzeit abmelden</a>.<br />
          © ${year} ${SITE.legalName}. Alle Rechte vorbehalten.
        </div>
      </td></tr>
    </table>
  </td></tr>`;
}

/* --------------------------- Personalisierung --------------------------- */

export type MailVars = { vorname: string; name: string; email: string };

const VAR_RE = /\{\{\s*(vorname|name|email)\s*\}\}/gi;

function fillVars(
  input: string,
  v: MailVars,
  escFn: (s: string) => string,
): string {
  // Auch HTML-codierte Klammern erkennen (manche Editoren/Quellen kodieren
  // { } als &#123; / &#125; — sonst würde {{vorname}} nicht ersetzt).
  const normalized = (input ?? "")
    .replace(/&#0*123;|&#x0*7[bB];|&lbrace;/g, "{")
    .replace(/&#0*125;|&#x0*7[dD];|&rbrace;/g, "}");
  return normalized.replace(VAR_RE, (_m, key: string) =>
    escFn(v[key.toLowerCase() as keyof MailVars] ?? ""),
  );
}

/** Baut die Variablen aus Name + E-Mail; `fallback` springt ein, wenn kein Name. */
export function mailVars(
  name: string | null | undefined,
  email: string,
  fallback: string,
): MailVars {
  const full = (name ?? "").trim();
  const first = full.split(/\s+/)[0] ?? "";
  const fb = (fallback ?? "").trim();
  return { vorname: first || fb, name: full || fb, email };
}

/** Ersetzt {{vorname}}/{{name}}/{{email}} im HTML — eingesetzte Werte werden escaped. */
export function personalizeHtml(html: string, v: MailVars): string {
  return fillVars(html, v, esc);
}

/** Ersetzt die Variablen in reinem Text (z. B. Betreff) — ohne HTML-Escaping. */
export function personalizeText(text: string, v: MailVars): string {
  return fillVars(text, v, (s) => s);
}

/* ------------------------------- Tracking ------------------------------- */

/** Leitet alle Inhalts-Links über den Klick-Zähler um (für Klick-Tracking). */
export function trackContentLinks(
  html: string,
  base: string,
  campaignId: string,
): string {
  return (html ?? "").replace(
    /href="(https?:\/\/[^"]+)"/g,
    (_m, url: string) =>
      // &amp; statt rohem & — valides HTML, kein Mail-Client verliert das Ziel.
      `href="${base}/api/n/c?c=${encodeURIComponent(
        campaignId,
      )}&amp;u=${encodeURIComponent(url)}"`,
  );
}

/** Unsichtbares Zähl-Pixel, das beim Öffnen der Mail geladen wird. */
export function trackingPixel(base: string, campaignId: string): string {
  return `<img src="${base}/api/n/o?c=${encodeURIComponent(
    campaignId,
  )}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;opacity:0" />`;
}

/**
 * Vollständiges HTML-Dokument um den Mail-Body — erzwingt helles Farbschema,
 * damit Dark-Mode-Clients (Apple/iOS Mail u. a.) unsere Creme-/Grün-Palette
 * NICHT invertieren. Wird nur beim echten Versand verwendet (nicht in der
 * Vorschau, damit das <style> nicht ins Backend „ausläuft").
 */
export function emailDocument(bodyHtml: string, opts?: { bg?: string }): string {
  const bg = opts?.bg ?? "#f7f6f3";
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>Wald &amp; Wiese</title>
<style>
  :root { color-scheme: light only; supported-color-schemes: light; }
  body { margin:0; padding:0; background:${bg}; }
  /* Dark-Mode-Clients sollen die helle Palette behalten */
  @media (prefers-color-scheme: dark) {
    body, .ww-bg { background:${bg} !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${bg}">
${bodyHtml}
</body>
</html>`;
}

/**
 * Volle E-Mail: Header-Masthead + Inhalt + Impressum-Footer-Band.
 * `header: false` lässt die Kopfzeile komplett weg (z. B. bei eigenem HTML);
 * der Footer bleibt immer (Impressum/Abmeldung sind Pflicht).
 */
export function wrapEmail(
  inner: string,
  opts: { unsubUrl: string; header?: EmailHeader | false; bare?: boolean },
): string {
  const headerRow = opts.header === false ? "" : renderHeader(opts.header);
  // `bare`: eigenes HTML füllt die ganze Breite — kein 600px-Rahmen, kein
  // cremefarbener Innenrand, Footer ebenfalls randlos und bündig.
  const contentRow = opts.bare
    ? `<tr><td style="padding:0">
        ${inner}
      </td></tr>`
    : `<tr><td align="center" style="padding:0">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
      <tr><td style="padding:30px 30px 34px;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.6">
        ${inner}
      </td></tr>
    </table>
  </td></tr>`;
  const outerBg = opts.bare ? "transparent" : "#f7f6f3";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;border-collapse:collapse;background:${outerBg}">
  ${headerRow}

  ${contentRow}

  ${renderFooter(opts.unsubUrl, opts.bare)}
</table>`;
}
