/**
 * Tracking-IDs — über Umgebungsvariablen gesetzt (siehe .env.example).
 *
 * Solange keine GÜLTIGE ID hinterlegt ist, wird das jeweilige Skript NICHT
 * geladen — die Consent-Logik funktioniert aber bereits vollständig. So kann
 * die Seite live gehen, bevor die Konten existieren; IDs einfach nachtragen.
 *
 * GA4 wird direkt per gtag.js geladen (NEXT_PUBLIC_GA_ID). Alternativ kann GA4
 * auch als Tag INNERHALB eines GTM-Containers laufen — dann NEXT_PUBLIC_GTM_ID
 * setzen und GA4 dort einrichten. Ist ein gültiger GTM-Container gesetzt, wird
 * das direkte GA4-Skript NICHT zusätzlich geladen (verhindert Doppelzählung).
 */
export const TRACKING = {
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  adsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
  /** Conversion-Kennung im Format AW-XXXX/Label für den Seitenaufruf-Conversion. */
  adsPageviewConversion: process.env.NEXT_PUBLIC_GOOGLE_ADS_PAGEVIEW_CONVERSION ?? "",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID ?? "",
} as const;

/** GA4-Mess-IDs haben das Format G-XXXXXXXXXX. */
export function hasGa(): boolean {
  return /^G-[A-Z0-9]+$/.test(TRACKING.gaId);
}

/** Google-Ads-Conversion-IDs haben das Format AW-XXXXXXXXX. */
export function hasAds(): boolean {
  return /^AW-[A-Z0-9]+$/.test(TRACKING.adsId);
}

/** Conversion-Kennung im Format AW-XXXX/Label (ID + Conversion-Label). */
export function hasAdsPageviewConversion(): boolean {
  return /^AW-[A-Z0-9]+\/[A-Za-z0-9_-]+$/.test(TRACKING.adsPageviewConversion);
}

/** GTM-Container-IDs haben das Format GTM-XXXXXX. */
export function hasGtm(): boolean {
  return /^GTM-[A-Z0-9]+$/.test(TRACKING.gtmId);
}

/** Hotjar-Site-IDs sind reine Zahlen. */
export function hasHotjar(): boolean {
  return /^\d+$/.test(TRACKING.hotjarId);
}
