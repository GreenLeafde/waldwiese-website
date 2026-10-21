import { RESERVATION_URL } from "./site";

/** Vorauswahl vor Lightspeed: wofür wird reserviert? */
export type ReserveSlot = "brunch" | "abend";

/**
 * Lightspeed-Link mit Slot-Kennung. Lightspeed liest den Parameter nicht,
 * aber unser Klick-Tracking (components/analytics.tsx, Event-Delegation auf
 * RESERVATION_URL) sieht so, ob Brunch oder Abend gewählt wurde.
 * Liegt in lib/, damit Server- und Client-Komponenten ihn nutzen können.
 */
export function reservationHref(slot: ReserveSlot): string {
  return `${RESERVATION_URL}?slot=${slot}`;
}
