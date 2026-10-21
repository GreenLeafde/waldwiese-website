/**
 * Saison-Weiche für das Weihnachtsgeschäft (Gutscheine, Event-Tickets als
 * Geschenk). Bis einschließlich 24.12. zeigen die Seiten die Geschenk-Variante,
 * danach von selbst wieder die normale — dank ISR-`revalidate` ohne Deploy.
 */
export const XMAS_SEASON_END = Date.parse("2026-12-25T00:00:00+01:00");

export function isXmasSeason(): boolean {
  return Date.now() < XMAS_SEASON_END;
}

/** Seiten mit fester Kaufleiste unten (Mobil) — dort weicht der Sommelier-Button. */
export const STICKY_CTA_PATHS = ["/gutscheine", "/veranstaltungen/"];
