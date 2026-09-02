/**
 * Baut aus einer gespeicherten Kampagne wieder das fertige Mail-HTML — für den
 * Export im Admin (/admin/versand). Gleiche Bausteine wie beim echten Versand
 * (newsletter-delivery.ts), aber OHNE Klick-Umleitung und Zähl-Pixel: die
 * exportierte Datei soll sauber weiterverwendbar sein und beim Öffnen keine
 * Statistik verfälschen.
 *
 * NUR server-seitig importieren.
 */

import type { Newsletter } from "./newsletters";
import { SITE } from "./site";
import {
  emailDocument,
  mailVars,
  personalizeHtml,
  wrapEmail,
  type HeaderStyle,
} from "./newsletter-shell";

/**
 * Basis-URL für Links in der Mail: immer die echte Produktiv-Domain — gleiche
 * Regel wie beim Versand in `app/actions/newsletter-admin.ts`.
 */
const MAIL_BASE = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE.url).replace(
  /\/+$/,
  "",
);

/** Vollständiges HTML-Dokument der Mail (Kopf + Inhalt + Impressum-Footer). */
export function renderFullEmail(nl: Newsletter): string {
  const vars = mailVars(null, "empfaenger@example.com", "du");
  const body = wrapEmail(personalizeHtml(nl.html, vars), {
    unsubUrl: `${MAIL_BASE}/api/newsletter/abmelden?token=export`,
    header: nl.showHeader
      ? {
          title: nl.headerTitle ?? undefined,
          tagline: nl.headerTagline ?? undefined,
          style: (nl.headerStyle as HeaderStyle | null) ?? undefined,
        }
      : false,
    bare: nl.bare,
  });
  return emailDocument(body, nl.bare ? { bg: "#2e3d2c" } : undefined);
}

/** Dateiname-tauglicher Slug — ASCII, keine Sonderzeichen. */
export function slugify(input: string): string {
  const s = (input || "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return s || "newsletter";
}

/** HTML-Escaping für die Code-Ansicht im Sammel-Export. */
export function escapeHtml(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
