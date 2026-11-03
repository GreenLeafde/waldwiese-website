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
  tagline: "Brunch & Abend · mitten im Grünen",
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

/* Look wie die Website (seit Okt. 2026): Morgen-Creme, Tanne, Akzent, Jost + DM Sans, Logo als PNG. */
const BRAND = `${SITE.url}/newsletter/brand`;
export const MAIL_FONT_BODY = "'DM Sans',Helvetica,Arial,sans-serif";
export const MAIL_FONT_DISPLAY = "Jost,Futura,'Century Gothic',Helvetica,Arial,sans-serif";
export const MAIL_COLORS = {
  morgen: "#f7f4ec",
  tanne: "#022914",
  creme: "#f3eee3",
  akzent: "#c97c5d",
  muted: "#52635a",
};
const C = MAIL_COLORS;

/** Unterzeile aus der Zeit vor Brunch & Abend; gespeicherte Kampagnen tragen sie noch. */
const OLD_TAGLINE = "Frühstück · mitten im Grünen";

function navLinks(color: string): string {
  const link = (label: string, path: string) =>
    `<a href="${SITE.url}${path}" style="color:${color};text-decoration:none">${label}</a>`;
  return [
    link("Brunch", "/speisekarte#fruehstueck"),
    link("Abendessen", "/speisekarte#abend"),
    link("Events", "/veranstaltungen"),
    link("Gutscheine", "/gutscheine"),
  ].join("&nbsp;&nbsp;&middot;&nbsp;&nbsp;");
}

/** Kopf: Logo, Unterzeile und die Bereiche der Website als kleine Navigation. */
export function renderHeader(h: EmailHeader = {}): string {
  const raw = (h.tagline ?? HEADER_DEFAULTS.tagline).trim();
  const tagline = esc(raw === OLD_TAGLINE ? HEADER_DEFAULTS.tagline : raw);
  const style: HeaderStyle = h.style ?? HEADER_DEFAULTS.style;

  const dark = style === "green";
  const minimal = style === "minimal";
  const bg = dark ? C.tanne : C.morgen;
  const fg = dark ? C.creme : C.tanne;
  const logoWidth = minimal ? 150 : 190;

  const logo = `<a href="${SITE.url}" style="text-decoration:none"><img src="${BRAND}/logo-${
    dark ? "creme" : "tanne"
  }.png" width="${logoWidth}" alt="Wald &amp; Wiese" style="display:block;margin:0 auto;width:${logoWidth}px;max-width:70%;height:auto;border:0" /></a>`;
  const taglineHtml = tagline
    ? `<div style="font-family:${MAIL_FONT_BODY};text-transform:uppercase;letter-spacing:2.5px;font-size:11px;color:${C.akzent};font-weight:700;margin-top:14px">${tagline}</div>`
    : "";
  const nav = minimal
    ? ""
    : `<div style="font-family:${MAIL_FONT_BODY};font-size:13px;color:${fg};margin-top:16px">${navLinks(fg)}</div>`;

  return `<tr><td align="center" bgcolor="${bg}" style="background:${bg};padding:0">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
      <tr><td align="center" style="padding:${minimal ? "26px 24px 12px" : "34px 24px 24px"};text-align:center;border-bottom:1px solid ${
        dark ? "rgba(243,238,227,0.16)" : "rgba(2,41,20,0.12)"
      }">
        ${logo}
        ${taglineHtml}
        ${nav}
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
  const link = (label: string, href: string) =>
    `<a href="${href}" style="color:${C.creme};text-decoration:none">${label}</a>`;
  return `<tr><td align="center" bgcolor="${C.tanne}" style="background:${C.tanne};padding:0">
    <table role="presentation" ${innerWidth}>
      <tr><td align="center" style="padding:42px 30px 30px;font-family:${MAIL_FONT_BODY};color:${C.creme};text-align:center">
        <img src="${BRAND}/logo-creme.png" width="150" alt="Wald &amp; Wiese" style="display:block;margin:0 auto;width:150px;height:auto;border:0" />
        <div style="font-size:14px;color:rgba(243,238,227,0.78);margin-top:16px;line-height:1.7">
          Brunch täglich 8–14 Uhr &nbsp;·&nbsp; Abendessen Fr–So 17–22 Uhr<br />
          ${CONTACT.street}, ${CONTACT.postalCode} ${CONTACT.city}
        </div>
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:22px auto 0"><tr><td style="border-radius:9999px;background:${C.akzent}"><a href="${SITE.url}/reservieren" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;font-family:${MAIL_FONT_BODY}">Tisch reservieren</a></td></tr></table>
        <div style="margin-top:22px;font-size:13px">
          ${link("Website", SITE.url)} &nbsp;·&nbsp; ${link("Instagram", CONTACT.instagram)} &nbsp;·&nbsp; ${link("Impressum", `${SITE.url}/impressum`)} &nbsp;·&nbsp; ${link("Datenschutz", `${SITE.url}/datenschutz`)}
        </div>
        <div style="margin-top:26px;border-top:1px solid rgba(243,238,227,0.16);padding-top:18px;font-size:11px;color:rgba(243,238,227,0.6);line-height:1.8">
          ${SITE.legalName} · ${COMPANY.ceoTitel}: ${COMPANY.ceo}<br />
          ${CONTACT.street} · ${CONTACT.postalCode} ${CONTACT.city} · ${CONTACT.country} · Tel. ${CONTACT.phone} · <a href="${mailto}" style="color:rgba(243,238,227,0.8);text-decoration:none">${CONTACT.email}</a><br />
          ${COMPANY.court}, ${COMPANY.register} · USt-IdNr.: ${COMPANY.vatId}<br /><br />
          Du erhältst diese E-Mail, weil du dich für den Newsletter von Wald &amp; Wiese angemeldet hast.
          <a href="${unsubUrl}" style="color:${C.creme}">Hier kannst du dich jederzeit abmelden</a>.<br />
          © ${year} ${SITE.legalName}
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

/**
 * Schreibt jeden absoluten Link im Inhalt auf die Klick-Zähl-Route um.
 *
 * `sign` (nur server-seitig, aus `lib/newsletter-token.ts`) hängt eine
 * Signatur an, damit `/api/n/c` auch fremde Ziele (Ticket-Shop …) ansteuert.
 * Ohne Signatur leitet die Route nur auf die eigene Domain bzw. bekannte
 * Partner-Hosts weiter.
 */
export function trackContentLinks(
  html: string,
  base: string,
  campaignId: string,
  sign?: (url: string) => string,
): string {
  return (html ?? "").replace(
    /href="(https?:\/\/[^"]+)"/g,
    (_m, raw: string) => {
      // Im HTML steht das Ziel HTML-kodiert (`&amp;`) — vor dem URL-Kodieren
      // zurückwandeln, sonst landet `&amp;` wörtlich in der Ziel-URL.
      const url = decodeEntities(raw);
      const s = sign ? `&amp;s=${encodeURIComponent(sign(url))}` : "";
      // &amp; statt rohem & — valides HTML, kein Mail-Client verliert das Ziel.
      return `href="${base}/api/n/c?c=${encodeURIComponent(
        campaignId,
      )}&amp;u=${encodeURIComponent(url)}${s}"`;
    },
  );
}

/** Die paar Entities, die in einer URL realistisch vorkommen. */
export function decodeEntities(s: string): string {
  return (s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&#x26;/gi, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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
  const bg = opts?.bg ?? C.morgen;
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>Wald &amp; Wiese</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
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
      <tr><td style="padding:34px 30px 40px;font-family:${MAIL_FONT_BODY};color:#12201a;line-height:1.65">
        ${inner}
      </td></tr>
    </table>
  </td></tr>`;
  const outerBg = opts.bare ? "transparent" : C.morgen;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;padding:0;border-collapse:collapse;background:${outerBg}">
  ${headerRow}

  ${contentRow}

  ${renderFooter(opts.unsubUrl, opts.bare)}
</table>`;
}
