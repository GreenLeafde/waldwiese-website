/**
 * Tracking-IDs — über Umgebungsvariablen gesetzt (siehe .env.example).
 *
 * Solange keine GÜLTIGE ID hinterlegt ist, wird das jeweilige Skript NICHT
 * geladen — die Consent-Logik funktioniert aber bereits vollständig. So kann
 * die Seite live gehen, bevor die Konten existieren; IDs einfach nachtragen.
 *
 * GA4 und Google-Ads-Conversion werden als Tags INNERHALB des GTM-Containers
 * konfiguriert (Standard-Setup) — hier wird nur der GTM-Container geladen.
 */
export const TRACKING = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID ?? "",
} as const;

/** GTM-Container-IDs haben das Format GTM-XXXXXX. */
export function hasGtm(): boolean {
  return /^GTM-[A-Z0-9]+$/.test(TRACKING.gtmId);
}

/** Hotjar-Site-IDs sind reine Zahlen. */
export function hasHotjar(): boolean {
  return /^\d+$/.test(TRACKING.hotjarId);
}
