/**
 * Consent-Verwaltung (Eigenbau) für Wald & Wiese.
 *
 * Strategie: Alle nicht notwendigen Dienste (Statistik, Marketing, externe
 * Medien) laden ERST nach aktiver Einwilligung. Zusätzlich setzen wir den
 * Google Consent Mode v2 (Default = denied), damit Google-Tags ihr Verhalten
 * an die Einwilligung anpassen.
 */

export type ConsentCategory = "statistics" | "marketing" | "externalMedia";

export type ConsentState = Record<ConsentCategory, boolean>;

export const CONSENT_COOKIE = "ww_consent";
/** Bei inhaltlicher Änderung der Tool-Liste hochzählen → erneut nachfragen. */
export const CONSENT_VERSION = 1;
/** ~6 Monate */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182;

export const DEFAULT_CONSENT: ConsentState = {
  statistics: false,
  marketing: false,
  externalMedia: false,
};

export const ALL_GRANTED: ConsentState = {
  statistics: true,
  marketing: true,
  externalMedia: true,
};

export const CONSENT_CATEGORIES: {
  key: ConsentCategory;
  label: string;
  description: string;
}[] = [
  {
    key: "statistics",
    label: "Statistik",
    description:
      "Hilft uns zu verstehen, wie die Seite genutzt wird (Google Analytics 4, Hotjar). Erst nach deiner Zustimmung.",
  },
  {
    key: "marketing",
    label: "Marketing",
    description:
      "Misst den Erfolg unserer Anzeigen (Google Ads). Erst nach deiner Zustimmung.",
  },
  {
    key: "externalMedia",
    label: "Externe Medien",
    description:
      "Lädt die eingebettete Google-Maps-Karte auf der Kontaktseite.",
  },
];

type StoredConsent = { v: number; c: ConsentState; t: number };

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const prefix = `${CONSENT_COOKIE}=`;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(prefix));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(
      decodeURIComponent(raw.substring(prefix.length)),
    ) as StoredConsent;
    if (parsed.v !== CONSENT_VERSION || !parsed.c) return null;
    return { ...DEFAULT_CONSENT, ...parsed.c };
  } catch {
    return null;
  }
}

export function writeConsent(consent: ConsentState): void {
  if (typeof document === "undefined") return;
  const payload: StoredConsent = { v: CONSENT_VERSION, c: consent, t: Date.now() };
  const value = encodeURIComponent(JSON.stringify(payload));
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
}

/**
 * Übersetzt unsere Kategorien in Google-Consent-Mode-v2-Signale und meldet
 * sie an gtag (das im beforeInteractive-Snippet definiert wurde).
 */
export function consentModeUpdate(consent: ConsentState): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: consent.statistics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

/**
 * Läuft als beforeInteractive-Script im <head>, noch vor jedem Tracking.
 * Setzt nur die Consent-Defaults (denied) — KEINE Cookies, KEINE Netzwerk-
 * anfrage. So ist der Consent-Status bereit, sobald (nach Einwilligung) GTM
 * geladen wird.
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'denied',
  personalization_storage:'denied',
  security_storage:'granted',
  wait_for_update:500
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
`.trim();

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
