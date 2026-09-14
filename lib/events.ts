/**
 * Veranstaltungen im Wald & Wiese (Karten-Liste auf /veranstaltungen +
 * Detailseite unter /veranstaltungen/<slug>).
 *
 * WICHTIG: Hier stehen nur bestätigte Fakten vom jeweiligen Veranstalter.
 * Beim Krimidinner ist das „Das Kriminal Dinner“ — der Ticketverkauf läuft
 * komplett über deren Shop, wir verlinken nur dorthin. Nichts dazuerfinden:
 * Einlasszeiten, Menü-Details oder Ermäßigungen nur eintragen, wenn sie beim
 * Veranstalter wirklich ausgewiesen sind.
 *
 * Neues Event? Objekt unten ergänzen — Liste, Detailroute und Sitemap
 * ziehen automatisch nach.
 */

export type EventImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type EventSection = { heading: string; body: string[] };

export type EventItem = {
  slug: string;
  /** H1 der Detailseite */
  title: string;
  /** Eyebrow / Reihe, z. B. „Krimidinner · bayerisch“ */
  kicker: string;
  metaTitle: string;
  metaDescription: string;
  /** Kurztext für die Karte in der Liste */
  teaser: string;
  /** Start in lokaler Zeit, ISO — Basis für Sortierung & schema.org */
  startsAt: string;
  /** Anzeige-Datum, z. B. „Samstag, 17. Oktober 2026“ */
  dateLabel: string;
  /** Anzeige-Uhrzeit, z. B. „19:00 Uhr“ */
  timeLabel: string;
  /** Preis als Zahl (für schema.org) */
  price: number;
  /** Preis-Anzeige, z. B. „89,90 € pro Person“ */
  priceLabel: string;
  /** Zusatzkosten-Hinweis des Veranstalters */
  priceNote?: string;
  /** Externer Ticketshop — der Verkauf läuft NICHT über uns */
  ticketUrl: string;
  ticketNote: string;
  organizer: { name: string; url: string };
  hero: EventImage;
  gallery: EventImage[];
  intro: string;
  sections: EventSection[];
  /** Kurze Fakten-Liste (Datum, Preis, Menü …) für die Detailseite */
  facts: { label: string; value: string }[];
  faq?: { q: string; a: string }[];
};

const KRIMI = {
  name: "Das Kriminal Dinner",
  url: "https://www.das-kriminal-dinner.de/krimidinner-tatorte/sinzing/wald-wiese",
} as const;

const KRIMI_TICKET_NOTE =
  "Tickets gibt es ausschließlich direkt beim Veranstalter „Das Kriminal Dinner“ — nicht bei uns im Restaurant und nicht über unsere Tischreservierung.";

export const EVENTS: EventItem[] = [
  {
    slug: "krimidinner-mord-und-tod-im-gasthof-zur-zapfsaeule",
    title: "Krimidinner: Mord & Tod im Gasthof zur Zapfsäule",
    kicker: "Krimidinner · bayerisch",
    metaTitle:
      "Krimidinner Sinzing: Mord & Tod im Gasthof zur Zapfsäule | 17.10.2026 | Wald & Wiese",
    metaDescription:
      "Krimidinner bei Regensburg: „Mord & Tod im Gasthof zur Zapfsäule“ am Samstag, 17.10.2026 um 19 Uhr im Wald & Wiese in Sinzing — bayerische Krimikomödie mit 3-Gänge-Menü, 89,90 € pro Person.",
    teaser:
      "Eine bayerische Krimikomödie bei uns im Grünen: Der grantige Wirt Heimgard Zapf liegt tot in der Stammtisch-Stube — und ihr ermittelt zwischen den Gängen mit.",
    startsAt: "2026-10-17T19:00:00+02:00",
    dateLabel: "Samstag, 17. Oktober 2026",
    timeLabel: "19:00 Uhr",
    price: 89.9,
    priceLabel: "89,90 € pro Person",
    priceNote: "zzgl. einmalige Bearbeitungsgebühr von 6,90 € pro Bestellung",
    ticketUrl:
      "https://www.das-kriminal-dinner.de/ticket/sinzing/wald-wiese/38831?0=&cHash=3db0efba010459b1f57a9a97af937376",
    ticketNote: KRIMI_TICKET_NOTE,
    organizer: KRIMI,
    hero: {
      src: "/photos/events/krimidinner-mord-und-tod-01.webp",
      alt: "Drei Männer und eine Frau schauen gemeinsam einen Brief an, vor ihnen stehen Schnapsgläser",
      width: 540,
      height: 400,
    },
    gallery: [
      {
        src: "/photos/events/krimidinner-mord-und-tod-02.webp",
        alt: "Drei Männer sitzen mit verschränkten Armen auf Stühlen in einer Wirtschaft",
        width: 540,
        height: 400,
      },
      {
        src: "/photos/events/krimidinner-mord-und-tod-03.webp",
        alt: "Ein Mann mit roter Mütze und Weste, einer im lila Samtanzug und eine Frau im Dirndl",
        width: 540,
        height: 400,
      },
      {
        src: "/photos/events/krimidinner-mord-und-tod-04.webp",
        alt: "Zwei Männer unterhalten sich, eine Frau hört aufmerksam zu",
        width: 540,
        height: 400,
      },
    ],
    intro:
      "Ein Abend, an dem bei uns nicht nur gegessen, sondern auch ermittelt wird: „Das Kriminal Dinner“ gastiert mit seiner bayerischen Krimikomödie im Wald & Wiese — Theater direkt zwischen den Tischen, dazu ein 3-Gänge-Menü aus unserer Küche.",
    sections: [
      {
        heading: "Worum es geht",
        body: [
          "Schauplatz ist die Gastwirtschaft „Zur Zapfsäule“ im niederbayerischen Dorf Köln — eine Goldgrube, geführt vom stets grantigen Heimgard Zapf. Eines Tages stirbt der Wirt völlig unerwartet und äußerst gewaltsam in der Stammtisch-Stube.",
          "Die örtliche Polizei tappt im Dunkeln und ruft kurzerhand die Gäste als Soko zusammen. Ihr untersucht Beweisstücke, befragt Verdächtige und versucht, dem Täter auf die Spur zu kommen. War es einer der drei Söhne? Die Tochter? Oder doch jemand aus der Trauergesellschaft?",
          "Das Ensemble spielt an diesem Abend insgesamt 13 Rollen — eine bayerische Krimishowkomödie mit ordentlich Rätselfaktor, Mundart inklusive.",
        ],
      },
      {
        heading: "Wie der Abend abläuft",
        body: [
          "Gespielt wird mitten im Raum, zwischen Publikum und Bühne gibt es keine große Distanz. Zwischen den Szenen kommen die Gänge — das begleitende 3-Gänge-Menü fügt sich in den Abend ein, statt ihn zu unterbrechen.",
          "Wir sind an diesem Abend Location und Küche, gespielt wird vom Ensemble des Kriminal Dinners. Fragen zum Stück, zu Tickets oder zur Sitzplatzverteilung beantwortet der Veranstalter.",
        ],
      },
      {
        heading: "Tickets",
        body: [
          "Der Ticketverkauf läuft ausschließlich über „Das Kriminal Dinner“. Buchbar sind dort 1 bis 24 Tickets; ab 25 Personen gibt es beim Veranstalter ein eigenes Anfrageformular.",
          "Veganer, Vegetarier, Allergien oder ein Rollstuhlplatz? Das kannst du direkt bei der Buchung im Ticketshop angeben — die Info kommt dann bei uns in der Küche an.",
        ],
      },
    ],
    facts: [
      { label: "Wann", value: "Samstag, 17.10.2026 · 19:00 Uhr" },
      { label: "Wo", value: "Wald & Wiese, Bruckdorfer Str. 42, 93161 Sinzing" },
      {
        label: "Preis",
        value: "89,90 € pro Person, zzgl. 6,90 € Bearbeitungsgebühr",
      },
      { label: "Inklusive", value: "3-Gänge-Menü + Krimi-Theaterstück" },
      { label: "Sprache", value: "Bayerische Mundart" },
      { label: "Veranstalter", value: "Das Kriminal Dinner" },
    ],
    faq: [
      {
        q: "Kann ich das Krimidinner über euch reservieren?",
        a: "Nein. Für das Krimidinner brauchst du ein Ticket vom Veranstalter „Das Kriminal Dinner“ — unsere normale Tischreservierung gilt an diesem Abend nicht.",
      },
      {
        q: "Ist das Essen im Ticketpreis enthalten?",
        a: "Ja, zum Krimidinner gehört ein 3-Gänge-Menü, das zwischen den Szenen serviert wird. Getränke rechnest du wie gewohnt bei uns ab.",
      },
      {
        q: "Ich bin Vegetarier oder habe eine Allergie — geht das?",
        a: "Ja. Gib das bitte direkt bei der Ticketbuchung im Feld für Veganer, Vegetarier, Allergiker und Rollstuhlfahrer an, dann planen wir das in der Küche ein.",
      },
      {
        q: "Wir sind eine größere Gruppe — geht das auch?",
        a: "Im Ticketshop sind 1 bis 24 Tickets direkt buchbar. Ab 25 Personen nutzt du bitte das Anfrageformular des Veranstalters.",
      },
    ],
  },
  {
    slug: "krimidinner-blutmond",
    title: "Krimidinner: Blutmond",
    kicker: "Krimidinner · bayerisch",
    metaTitle:
      "Krimidinner Sinzing: Blutmond | 23.01.2027 | Wald & Wiese bei Regensburg",
    metaDescription:
      "Krimidinner bei Regensburg: „Blutmond“ am Samstag, 23.01.2027 um 19 Uhr im Wald & Wiese in Sinzing — bayerisches Krimispektakel mit 3-Gänge-Menü, 89,90 € pro Person.",
    teaser:
      "In der Nacht des Blutmonds stirbt eine Frau, die im Dorf als Hexe galt. Ein bayerisches Krimispektakel bei uns im Grünen — mit viel Raum zum Mitermitteln.",
    startsAt: "2027-01-23T19:00:00+01:00",
    dateLabel: "Samstag, 23. Januar 2027",
    timeLabel: "19:00 Uhr",
    price: 89.9,
    priceLabel: "89,90 € pro Person",
    priceNote: "zzgl. einmalige Bearbeitungsgebühr von 6,90 € pro Bestellung",
    ticketUrl:
      "https://www.das-kriminal-dinner.de/ticket/sinzing/wald-wiese/38537?0=&cHash=3db0efba010459b1f57a9a97af937376",
    ticketNote: KRIMI_TICKET_NOTE,
    organizer: KRIMI,
    hero: {
      src: "/photos/events/krimidinner-blutmond-01.webp",
      alt: "Leuchtend roter Mond am Nachthimmel, etwas verdeckt durch einen Kirchturm",
      width: 540,
      height: 400,
    },
    gallery: [
      {
        src: "/photos/events/krimidinner-blutmond-03.webp",
        alt: "Ein Polizist, ein Kommissar und eine Kommissarin stehen nebeneinander vor einem Vorhang",
        width: 540,
        height: 400,
      },
      {
        src: "/photos/events/krimidinner-blutmond-04.webp",
        alt: "Eine Frau steht zwischen zwei Männern und hebt die Arme hinter ihnen in die Luft",
        width: 540,
        height: 400,
      },
    ],
    intro:
      "Der zweite Krimidinner-Abend bei uns führt ins winterliche Oberlettenbach: „Blutmond“ vom Kriminal Dinner — bayerisches Krimispektakel mit Hexenverfolgung, viel Humor und einem 3-Gänge-Menü zwischen den Szenen.",
    sections: [
      {
        heading: "Worum es geht",
        body: [
          "In der Nacht des Blutmonds wird Siri Mandala mit einem Stich ins Herz getötet. Die Tatwaffe: ein Kreuzdolch, der angeblich auf dem örtlichen Flohmarkt gestohlen wurde. Das Opfer arbeitete bei einem zwielichtigen Apotheker und galt wegen ihrer Tinkturen und Salben im Dorf als Hexe.",
          "Kommissar Zwieselhuber sticht bei seinen Ermittlungen in ein Wespennest — denn jeder der Verdächtigen hat ein handfestes Motiv. Etwa der abgehalfterte Schauspieler Benvolio King, der jede Gelegenheit nutzt, das Publikum von sich zu begeistern. Oder die ultrakatholische Agnes Blumsrieder mit ihren zahllosen Wallfahrten.",
          "„Blutmond“ ist ein spannendes wie amüsantes Stück, bei dem das Publikum viel Raum bekommt, bei der Mördersuche mitzumachen — gespielt in bayerischer Mundart.",
        ],
      },
      {
        heading: "Wie der Abend abläuft",
        body: [
          "Gespielt wird zwischen den Tischen, Hinweise sammelst du direkt von deinem Platz aus. Dazwischen kommen die Gänge des 3-Gänge-Menüs aus unserer Küche — mal wird gelacht, mal gerätselt, dann wieder überraschend umgedacht.",
          "Wald & Wiese ist an diesem Abend Location und Küche; Stück, Ensemble und Ticketverkauf kommen vom Kriminal Dinner.",
        ],
      },
      {
        heading: "Tickets",
        body: [
          "Gebucht wird ausschließlich im Ticketshop des Veranstalters. Dort sind 1 bis 24 Tickets direkt buchbar, ab 25 Personen gibt es ein eigenes Anfrageformular.",
          "Besonderheiten wie vegane oder vegetarische Ernährung, Allergien oder ein Rollstuhlplatz gibst du bei der Buchung mit an.",
        ],
      },
    ],
    facts: [
      { label: "Wann", value: "Samstag, 23.01.2027 · 19:00 Uhr" },
      { label: "Wo", value: "Wald & Wiese, Bruckdorfer Str. 42, 93161 Sinzing" },
      {
        label: "Preis",
        value: "89,90 € pro Person, zzgl. 6,90 € Bearbeitungsgebühr",
      },
      { label: "Inklusive", value: "3-Gänge-Menü + Krimi-Theaterstück" },
      { label: "Sprache", value: "Bayerische Mundart" },
      { label: "Veranstalter", value: "Das Kriminal Dinner" },
    ],
    faq: [
      {
        q: "Brauche ich für „Blutmond“ ein Ticket?",
        a: "Ja, der Abend ist nur mit Ticket vom Veranstalter „Das Kriminal Dinner“ buchbar. Eine normale Tischreservierung bei uns gilt dafür nicht.",
      },
      {
        q: "Was ist im Preis enthalten?",
        a: "Das Theaterstück und ein 3-Gänge-Menü. Getränke kommen wie gewohnt bei uns auf die Rechnung; beim Ticketkauf fällt zusätzlich eine einmalige Bearbeitungsgebühr von 6,90 € pro Bestellung an.",
      },
      {
        q: "Ist das Stück auf Bayerisch?",
        a: "Ja, „Blutmond“ wird in bayerischer Mundart gespielt — verständlich bleibt es trotzdem für alle.",
      },
    ],
  },
];

export function getEvent(slug: string): EventItem | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

/** Nach Datum sortiert — der nächste Termin zuerst. */
export function sortedEvents(list: EventItem[] = EVENTS): EventItem[] {
  return [...list].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

/** Liegt der Termin schon hinter uns? */
export function isPastEvent(event: EventItem, now: Date = new Date()): boolean {
  return new Date(event.startsAt).getTime() < now.getTime();
}

/** Alles, was noch nicht gelaufen ist. */
export function upcomingEvents(now: Date = new Date()): EventItem[] {
  return sortedEvents().filter(
    (e) => new Date(e.startsAt).getTime() >= now.getTime(),
  );
}

/** Bereits gelaufene Termine — bleiben als Archiv erreichbar. */
export function pastEvents(now: Date = new Date()): EventItem[] {
  return sortedEvents()
    .filter((e) => new Date(e.startsAt).getTime() < now.getTime())
    .reverse();
}
