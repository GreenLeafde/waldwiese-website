/**
 * Live-Öffnungsstatus („Jetzt geöffnet · Brunch bis 14 Uhr“) für Header und
 * Startseite. Rechnet mit den Standardzeiten aus NEW_OPENING_HOURS:
 * Brunch Mo–So 8–14 Uhr, Abendessen Fr–So 17–22 Uhr.
 *
 * Ruhetage und Feiertage werden hier als ISO-Daten gepflegt; an so einem Tag
 * zeigt der Status „Heute geschlossen“ statt zu raten.
 */

/** Geschlossene Tage (ISO-Datum, Europe/Berlin), z. B. "2026-12-24". */
export const CLOSED_DAYS: string[] = [];

const BRUNCH = { from: 8, to: 14 } as const;
const ABEND = { from: 17, to: 22, days: new Set([5, 6, 0]) } as const; // Fr, Sa, So

export type OpeningStatus = {
  open: boolean;
  /** Kurzer Satz für die Infoleiste. */
  text: string;
  /** Welcher Service gerade läuft oder als Nächstes kommt. */
  slot: "brunch" | "abend" | "geschlossen";
};

type Berlin = { weekday: number; hour: number; minute: number; iso: string };

/** Datum/Uhrzeit in Berlin, unabhängig von Server- oder Browser-Zeitzone. */
function berlin(now: Date): Berlin {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    weekday: weekdays.indexOf(get("weekday")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    iso: `${get("year")}-${get("month")}-${get("day")}`,
  };
}

export function openingStatus(now: Date = new Date()): OpeningStatus {
  const b = berlin(now);
  if (CLOSED_DAYS.includes(b.iso)) {
    return { open: false, text: "Heute geschlossen", slot: "geschlossen" };
  }
  const t = b.hour + b.minute / 60;
  const abendTag = ABEND.days.has(b.weekday);

  if (t >= BRUNCH.from && t < BRUNCH.to) {
    return { open: true, text: `Jetzt geöffnet · Brunch bis ${BRUNCH.to} Uhr`, slot: "brunch" };
  }
  if (abendTag && t >= ABEND.from && t < ABEND.to) {
    return { open: true, text: `Jetzt geöffnet · Abendessen bis ${ABEND.to} Uhr`, slot: "abend" };
  }
  if (t < BRUNCH.from) {
    return { open: false, text: `Heute ab ${BRUNCH.from} Uhr Brunch`, slot: "brunch" };
  }
  if (abendTag && t < ABEND.from) {
    return { open: false, text: `Heute ab ${ABEND.from} Uhr Abendessen`, slot: "abend" };
  }
  return { open: false, text: `Morgen ab ${BRUNCH.from} Uhr Brunch`, slot: "brunch" };
}
