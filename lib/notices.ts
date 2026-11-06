/**
 * Zeitlich begrenzte Hinweise (z. B. kurzfristige Schließungen). Die Seiten sind
 * statisch vorgerendert, deshalb prüft der Browser selbst, ob ein Hinweis gerade
 * gilt: Er erscheint ab `from` und verschwindet nach `to` (Europe/Berlin) von allein.
 */

export type Notice = {
  /** Eindeutig, damit „Schließen“ pro Hinweis gemerkt wird. */
  id: string;
  /** Erster und letzter Tag (ISO, Berlin), beide inklusive. */
  from: string;
  to: string;
  /** Kurzfassung für die Infoleiste oben. */
  short: string;
  title: string;
  text: string;
};

export const NOTICES: Notice[] = [
  {
    id: "abend-zu-2026-11-06",
    from: "2026-11-06",
    to: "2026-11-08",
    short: "6.–8.11. abends geschlossen · Brunch normal 8–14 Uhr",
    title: "Dieses Wochenende abends geschlossen",
    text: "Von Freitag, 6., bis Sonntag, 8. November, bleibt unsere Küche abends krankheitsbedingt geschlossen. Brunch gibt es wie gewohnt täglich von 8 bis 14 Uhr. Ab nächstem Freitag sind wir abends wieder für euch da.",
  },
];

function berlinIso(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Der Hinweis, der heute gilt, oder null. */
export function activeNotice(now: Date = new Date()): Notice | null {
  const today = berlinIso(now);
  return NOTICES.find((n) => today >= n.from && today <= n.to) ?? null;
}
