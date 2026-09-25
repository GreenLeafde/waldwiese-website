/**
 * Größen-Check für den Newsletter-Inhalt — client- UND server-sicher (keine
 * Node-Imports).
 *
 * Hintergrund (Vorfall 25.09.2026): Der Composer schickt das fertige HTML als
 * Formularfeld an die Server-Action. Vercel nimmt für Function-Requests maximal
 * 4,5 MB Body an — darüber bricht die Plattform den Request mit HTTP 413 ab,
 * BEVOR unser Code läuft; der Browser zeigt dann nur „Seite konnte nicht
 * geladen werden". So groß wird das HTML praktisch nur durch eingebettete
 * Bilder (`data:image/...;base64,...`), z. B. aus einem Mail-Editor kopiert.
 * Solche Bilder gehören ohnehin nicht in eine Mail: Gmail schneidet Mails über
 * ~102 KB ab, viele Clients zeigen data-URIs gar nicht an.
 */

/** Über dieser Größe blocken wir den Versand (Vercel-Limit 4,5 MB, mit Luft). */
export const MAX_CONTENT_BYTES = 3_500_000;
/** Ab hier warnt Gmail-Clipping („Nachricht abgeschnitten"). */
export const GMAIL_CLIP_BYTES = 102_400;

export type ContentSize = {
  bytes: number;
  embeddedImages: number;
  embeddedBytes: number;
  tooLarge: boolean;
  clipRisk: boolean;
};

const DATA_IMG = /data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=\s]+/gi;

export function analyzeContentSize(html: string): ContentSize {
  const bytes = new TextEncoder().encode(html).length;
  let embeddedImages = 0;
  let embeddedBytes = 0;
  for (const m of html.matchAll(DATA_IMG)) {
    embeddedImages += 1;
    embeddedBytes += m[0].length;
  }
  return {
    bytes,
    embeddedImages,
    embeddedBytes,
    tooLarge: bytes > MAX_CONTENT_BYTES,
    clipRisk: bytes > GMAIL_CLIP_BYTES,
  };
}

export function formatBytes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} MB`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} KB`;
  return `${n} B`;
}

/** Erklärender Hinweis für den Admin — oder null, wenn alles im Rahmen ist. */
export function contentSizeNotice(s: ContentSize): {
  level: "error" | "warn";
  text: string;
} | null {
  if (s.tooLarge) {
    return {
      level: "error",
      text:
        `Der Inhalt ist ${formatBytes(s.bytes)} groß — das ist zu viel, der Server nimmt maximal ${formatBytes(MAX_CONTENT_BYTES)} an. ` +
        (s.embeddedImages > 0
          ? `Ursache: ${s.embeddedImages} eingebettete${s.embeddedImages === 1 ? "s" : ""} Bild${s.embeddedImages === 1 ? "" : "er"} (${formatBytes(s.embeddedBytes)} als Base64-Daten im HTML). Bitte Bilder stattdessen über „+ Bild" als Link einfügen (oder als Datei ins Web laden und per URL verlinken) und den Base64-Code entfernen.`
          : "Bitte den Inhalt kürzen; Bilder immer als Link einfügen, nie als Daten."),
    };
  }
  if (s.embeddedImages > 0) {
    return {
      level: "warn",
      text:
        `${s.embeddedImages} Bild${s.embeddedImages === 1 ? "" : "er"} ${s.embeddedImages === 1 ? "ist" : "sind"} als Daten eingebettet (${formatBytes(s.embeddedBytes)}). ` +
        `Viele Mail-Programme zeigen solche Bilder nicht an und Gmail schneidet lange Mails ab — besser über „+ Bild" als Link einfügen.`,
    };
  }
  if (s.clipRisk) {
    return {
      level: "warn",
      text: `Der Inhalt ist ${formatBytes(s.bytes)} groß. Gmail schneidet Mails über ~100 KB ab („Nachricht abgeschnitten"). Kürzer ist sicherer.`,
    };
  }
  return null;
}
