/**
 * Das Schichtraster — reine Begriffe, keine Datenbank.
 *
 * Bewusst eine eigene Datei: Diese Angaben braucht auch das Formular im
 * Browser. Laegen sie in `lib/aufgaben.ts`, zoege jeder Import den
 * Datenbank-Client mit in den Client-Bundle (und wuerde dort scheitern).
 *
 * Der Betrieb hat zehn Schichten pro Woche: Mo–Do nur frueh, Fr–So frueh und
 * spaet.
 */

export type Schicht = "frueh" | "spaet";
export type Nachweis = "keiner" | "foto" | "unterschrift";
export type Rhythmus = "woechentlich" | "einmalig";

/** 1 = Montag … 7 = Sonntag (ISO — nicht Date.getDay(), das faengt sonntags an). */
export type Wochentag = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SchichtSlot = { wochentag: Wochentag; schicht: Schicht };

export const WOCHENTAGE: { wert: Wochentag; kurz: string; lang: string }[] = [
  { wert: 1, kurz: "Mo", lang: "Montag" },
  { wert: 2, kurz: "Di", lang: "Dienstag" },
  { wert: 3, kurz: "Mi", lang: "Mittwoch" },
  { wert: 4, kurz: "Do", lang: "Donnerstag" },
  { wert: 5, kurz: "Fr", lang: "Freitag" },
  { wert: 6, kurz: "Sa", lang: "Samstag" },
  { wert: 7, kurz: "So", lang: "Sonntag" },
];

/**
 * Uhrzeiten der beiden Schichten (bestaetigt: Brunch 8–14, Abendessen 17–22).
 * Sie legen nur fest, welche Schicht beim Oeffnen vorausgewaehlt ist.
 */
export const SCHICHT_ZEIT: Record<Schicht, { von: string; bis: string; label: string }> = {
  frueh: { von: "08:00", bis: "14:00", label: "Frühschicht" },
  spaet: { von: "17:00", bis: "22:00", label: "Spätschicht" },
};

/** Spaetschicht gibt es nur Freitag bis Sonntag. */
export function hatSpaetschicht(tag: Wochentag): boolean {
  return tag >= 5;
}

/** Die zehn Schichten der Woche, in der Reihenfolge, in der man sie liest. */
export const SCHICHTEN: SchichtSlot[] = WOCHENTAGE.flatMap(({ wert }) =>
  hatSpaetschicht(wert)
    ? ([
        { wochentag: wert, schicht: "frueh" },
        { wochentag: wert, schicht: "spaet" },
      ] as SchichtSlot[])
    : ([{ wochentag: wert, schicht: "frueh" }] as SchichtSlot[]),
);

export const SCHICHT_KURZ: Record<Schicht, string> = {
  frueh: "früh",
  spaet: "spät",
};

export function schichtLabel({ wochentag, schicht }: SchichtSlot): string {
  const tag = WOCHENTAGE.find((w) => w.wert === wochentag)?.kurz ?? "?";
  return `${tag} ${SCHICHT_KURZ[schicht]}`;
}

/** Schluessel fuer Nachschlagetabellen — nirgends gespeichert. */
export function slotKey({ wochentag, schicht }: SchichtSlot): string {
  return `${wochentag}-${schicht}`;
}

/**
 * Die Schichten einer Aufgabe als lesbarer Satz.
 * "Mo früh · Di früh · Mi früh · Do früh · Fr früh · Sa früh · So früh" liest
 * niemand — "jeden Tag früh" schon. Deshalb werden volle Reihen
 * zusammengefasst.
 */
export function schichtenText(slots: SchichtSlot[]): string {
  if (slots.length === 0) return "Keiner Schicht zugeordnet";
  if (slots.length >= SCHICHTEN.length) return "Alle zehn Schichten";

  const kurz = (s: SchichtSlot) =>
    WOCHENTAGE.find((w) => w.wert === s.wochentag)?.kurz ?? "?";
  const sortiert = [...slots].sort(
    (a, b) => a.wochentag - b.wochentag || a.schicht.localeCompare(b.schicht),
  );

  const teile: string[] = [];
  for (const schicht of ["frueh", "spaet"] as const) {
    const tage = sortiert.filter((s) => s.schicht === schicht);
    if (tage.length === 0) continue;

    const vollstaendig = SCHICHTEN.filter((s) => s.schicht === schicht).length;
    if (tage.length === vollstaendig) {
      teile.push(schicht === "frueh" ? "jeden Tag früh" : "Fr–So spät");
    } else {
      teile.push(`${tage.map(kurz).join(", ")} ${SCHICHT_KURZ[schicht]}`);
    }
  }
  return teile.join(" · ");
}

/** Verwirft Unsinn aus dem Formular (auch "Mo spät", das es nicht gibt). */
export function istGueltigerSlot(slot: SchichtSlot): boolean {
  if (slot.wochentag < 1 || slot.wochentag > 7) return false;
  return slot.schicht === "frueh" || hatSpaetschicht(slot.wochentag);
}

/**
 * Wochentag eines Datums (YYYY-MM-DD) als ISO-Nummer.
 * Bei einmaligen Aufgaben waehlt man ein Datum, keinen Wochentag — der ergibt
 * sich daraus. Bewusst ueber UTC gerechnet: ein reines Datum hat keine
 * Uhrzeit, und die Zeitzone darf den Wochentag nicht verschieben.
 */
export function wochentagVonDatum(datum: string): Wochentag | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(d.getTime())) return null;
  const wd = d.getUTCDay();
  return (wd === 0 ? 7 : wd) as Wochentag;
}

// ─── Welche Schicht ist gerade? ─────────────────────────────────────────────

export const BERLIN_TZ = "Europe/Berlin";

/** Datum in Berlin als YYYY-MM-DD (en-CA liefert genau dieses Format). */
export function berlinDatum(t: Date): string {
  return t.toLocaleDateString("en-CA", {
    timeZone: BERLIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** Stunde in Berlin (0–23). */
export function berlinStunde(t: Date): number {
  return Number(
    t.toLocaleString("en-GB", { timeZone: BERLIN_TZ, hour: "2-digit", hour12: false }),
  );
}

export function tagDavor(datum: string): string {
  const [y, m, d] = datum.split("-").map(Number);
  const vor = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) - 1));
  return vor.toISOString().slice(0, 10);
}

export function tagDanach(datum: string): string {
  const [y, m, d] = datum.split("-").map(Number);
  const nach = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + 1));
  return nach.toISOString().slice(0, 10);
}

/**
 * Die Schicht, die gerade laeuft — Vorauswahl beim Oeffnen, umschaltbar.
 *
 * Der wichtige Fall ist die Nacht: Wer um 23:40 die letzte Aufgabe abhakt,
 * soll sie auf "Samstag spaet" gebucht bekommen und nicht auf Sonntag. Eine
 * Schicht zaehlt deshalb bis in die Nacht hinein zum Tag ihres Beginns —
 * dieselbe Regel, nach der die Zeiterfassung schon heute rechnet.
 */
export function aktuelleSchicht(jetzt: Date): { datum: string; schicht: Schicht } {
  const heute = berlinDatum(jetzt);
  const stunde = berlinStunde(jetzt);

  // Vor 5 Uhr morgens laeuft die Schicht des Vortags noch aus.
  if (stunde < 5) {
    const gestern = tagDavor(heute);
    const tag = wochentagVonDatum(gestern);
    return {
      datum: gestern,
      schicht: tag && hatSpaetschicht(tag) ? "spaet" : "frueh",
    };
  }

  // Ab 15 Uhr die Spaetschicht — sofern es an dem Tag ueberhaupt eine gibt.
  const tag = wochentagVonDatum(heute);
  if (stunde >= 15 && tag && hatSpaetschicht(tag)) {
    return { datum: heute, schicht: "spaet" };
  }
  return { datum: heute, schicht: "frueh" };
}

/**
 * Die Schichten vor einer bestimmten Schicht, neueste zuerst.
 *
 * Wird gebraucht, um Liegengebliebenes mitzunehmen. `tage` begrenzt, wie weit
 * zurueckgeschaut wird — ohne Grenze schleppte die Liste irgendwann Altlasten
 * aus Wochen mit, und niemand haekelt mehr etwas ab.
 */
export function vorherigeSchichten(
  datum: string,
  schicht: Schicht,
  tage: number,
): { datum: string; schicht: Schicht }[] {
  const liste: { datum: string; schicht: Schicht }[] = [];

  // Beim selben Tag kommt die Fruehschicht vor der Spaetschicht.
  if (schicht === "spaet") liste.push({ datum, schicht: "frueh" });

  let d = datum;
  for (let i = 0; i < tage; i++) {
    d = tagDavor(d);
    const tag = wochentagVonDatum(d);
    if (!tag) continue;
    if (hatSpaetschicht(tag)) liste.push({ datum: d, schicht: "spaet" });
    liste.push({ datum: d, schicht: "frueh" });
  }

  // Neueste zuerst: die zuletzt vergangene Schicht steht oben.
  return liste;
}

/** "Freitag, 5. September" */
export function datumLang(datum: string): string {
  const [y, m, d] = datum.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export const BEREICHE = ["Küche", "Service", "Theke", "Spüle"] as const;

export const NACHWEIS_LABEL: Record<Nachweis, string> = {
  keiner: "Keiner",
  foto: "Foto",
  unterschrift: "Unterschrift",
};
