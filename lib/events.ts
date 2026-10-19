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
  /** schema.org-Typ(en); Standard ist TheaterEvent */
  schemaType?: string | string[];
  /** Einlass in lokaler Zeit, ISO (schema.org doorTime) */
  doorTime?: string;
  /** Ab wann Tickets verkauft werden, ISO (Offer.validFrom) */
  ticketsFrom?: string;
  /** Wer auftritt — für schema.org performer */
  performer?: { name: string; url: string; sameAs?: string[] };
  /** YouTube-Video des Veranstalters (wird erst nach Klick geladen) */
  video?: { youtubeId: string; title: string };
  /** Bildnachweis unter dem Hero, Standard „Szenenfoto: <Veranstalter>“ */
  heroCredit?: string;
  /** Überschrift + Text für den Abschluss-CTA */
  cta?: { heading: string; accent: string; text: string };
  /** Suchbegriffe für schema.org keywords („Dinnershow Regensburg“ …) */
  keywords?: string[];
};

const KRIMI = {
  name: "Das Kriminal Dinner",
  url: "https://www.das-kriminal-dinner.de/krimidinner-tatorte/sinzing/wald-wiese",
} as const;

const KRIMI_TICKET_NOTE =
  "Tickets gibt es ausschließlich direkt beim Veranstalter „Das Kriminal Dinner“ — nicht bei uns im Restaurant und nicht über unsere Tischreservierung.";

export const EVENTS: EventItem[] = [
  {
    slug: "magic-dinner-regensburg-sinzing-2027",
    title: "Magic Dinner · Eine Show in 3 Gängen",
    kicker: "Dinnershow · Zauberei & Comedy",
    metaTitle:
      "Magic Dinner Regensburg 20.02.2027 · Dinnershow mit Zauberer | Wald & Wiese",
    metaDescription:
      "Magic Dinner bei Regensburg am Samstag, 20.02.2027 im Wald & Wiese in Sinzing: 3-Gänge-Menü plus Zauberei & Comedy von Emilian Leber direkt am Tisch. Einlass 17 Uhr, Beginn 18 Uhr, 89,90 € pro Person.",
    teaser:
      "Ein 3-Gänge-Menü aus unserer Küche — und zwischen den Gängen Close-Up-Magie und Comedy von Emilian Leber direkt an eurem Tisch. Die Wintertermine der letzten Jahre waren ausverkauft.",
    startsAt: "2027-02-20T18:00:00+01:00",
    doorTime: "2027-02-20T17:00:00+01:00",
    ticketsFrom: "2026-10-18T00:00:00+02:00",
    dateLabel: "Samstag, 20. Februar 2027",
    timeLabel: "18:00 Uhr · Einlass 17:00 Uhr",
    price: 89.9,
    priceLabel: "89,90 € pro Person",
    priceNote: "3-Gänge-Menü und Show inklusive",
    ticketUrl:
      "https://okticket.de/tickets-magic-dinner-eine-show-in-3-gaengen-sinzing-wald-wiese-2027-02-20-e60557?event_id=60557",
    ticketNote:
      "Tickets gibt es online bei okticket (Veranstalter magicEL) — nicht über unsere normale Tischreservierung. Fleisch-, vegetarisches oder veganes Menü wählst du direkt bei der Buchung.",
    organizer: { name: "magicEL", url: "https://magicel.de" },
    schemaType: ["TheaterEvent", "FoodEvent"],
    performer: {
      name: "Emilian Leber",
      url: "https://magicel.de",
      sameAs: [
        "https://www.youtube.com/@magicelde",
        "https://www.instagram.com/_magicel/",
      ],
    },
    video: {
      youtubeId: "jYuy-XMrrgY",
      title: "Magic Dinner · Eine Show in 3 Gängen I Showreel",
    },
    hero: {
      src: "/photos/events/magic-dinner-emilian-leber-01.webp",
      alt: "Zauberkünstler Emilian Leber im roten Sakko zeigt zwei Gästen im Anzug einen Trick direkt am Tisch",
      width: 1200,
      height: 674,
    },
    heroCredit: "Foto: magicEL",
    gallery: [],
    intro:
      "Am Samstag, 20. Februar 2027 wird das Wald & Wiese in Sinzing bei Regensburg für einen Abend zu einem Ort voller Magie: Unsere Küche serviert ein 3-Gänge-Menü — und zwischen den Gängen übernimmt Zauberkünstler Emilian Leber, mit Close-Up und Comedy hautnah an eurem Tisch.",
    sections: [
      {
        heading: "Was ist das Magic Dinner?",
        body: [
          "Das Magic Dinner ist eine Dinnershow bei Regensburg: ein 3-Gänge-Menü aus der Küche des Wald & Wiese, und zwischen den Gängen Zauberei und Comedy von Emilian Leber. Es ist sein Signature-Format — mit dem Wald & Wiese als Hauspartner.",
          "Kein Abstand zur Bühne, kein Zuschauen aus der letzten Reihe: Die Wunder passieren direkt vor euren Augen und oft in euren eigenen Händen. Dazu kommen Momente, die der ganze Raum gemeinsam erlebt. Ein Abend zum Lachen, Staunen und Genießen.",
        ],
      },
      {
        heading: "Wer ist Emilian Leber?",
        body: [
          "Emilian Leber ist Zauberkünstler aus Regensburg und Finalist bei Greatest Talent und Talents of Magic. 2025 stand er im TVA-Studio, seit 2016 hat er über 200 Events gespielt.",
          "Er stammt selbst aus der Familie, die das Wald & Wiese führt, und ist regelmäßig im Restaurant — das Magic Dinner ist also ein Abend bei Familie, nicht in einer anonymen Eventhalle.",
        ],
      },
      {
        heading: "So läuft der Abend",
        body: [
          "Einlass ist ab 17:00 Uhr, los geht es um 18:00 Uhr. Serviert wird ein 3-Gänge-Menü; zwischen den Gängen kommt die Show — am Tisch und für den ganzen Raum.",
          "Beim Ticketkauf wählst du für jede Person Fleisch-, vegetarisches oder veganes Menü, ohne Aufpreis. Getränke sind nicht im Ticket enthalten und laufen wie gewohnt über uns.",
        ],
      },
      {
        heading: "Schon zum fünften Mal",
        body: [
          "Das Magic Dinner ist ein Winterformat im Wald & Wiese: 2025 gab es Termine im Januar und Februar, 2026 am 24. Januar und 7. Februar — beide waren innerhalb weniger Wochen ausverkauft. Der 20. Februar 2027 ist die fünfte Ausgabe.",
          "Wer sicher dabei sein will, holt sich seine Tickets also lieber früh. Der Vorverkauf läuft seit dem 18. Oktober 2026.",
        ],
      },
      {
        heading: "Anfahrt nach Sinzing",
        body: [
          "Das Wald & Wiese liegt in der Bruckdorfer Straße 42 in 93161 Sinzing — im Landkreis Regensburg, direkt vor den Toren der Stadt. Aus Regensburg seid ihr in wenigen Minuten bei uns, auch aus Nittendorf, Pentling oder Kelheim ist es nicht weit.",
        ],
      },
    ],
    facts: [
      {
        label: "Wann",
        value: "Samstag, 20.02.2027 · Einlass 17:00 Uhr, Beginn 18:00 Uhr",
      },
      {
        label: "Wo",
        value: "Wald & Wiese, Bruckdorfer Str. 42, 93161 Sinzing bei Regensburg",
      },
      { label: "Preis", value: "89,90 € pro Person" },
      {
        label: "Inklusive",
        value: "3-Gänge-Menü + Zaubershow (Close-Up & Comedy)",
      },
      {
        label: "Menü",
        value: "Fleisch, vegetarisch oder vegan — bei der Buchung wählen",
      },
      { label: "Künstler", value: "Emilian Leber, Zauberkünstler aus Regensburg" },
      { label: "Tickets", value: "online bei okticket, seit 18.10.2026" },
      {
        label: "Veranstalter",
        value: "magicEL · örtlicher Veranstalter Restaurant Wald & Wiese",
      },
    ],
    faq: [
      {
        q: "Wann und wo findet das Magic Dinner statt?",
        a: "Am Samstag, 20. Februar 2027 im Restaurant Wald & Wiese, Bruckdorfer Str. 42, 93161 Sinzing bei Regensburg. Einlass ist um 17:00 Uhr, Beginn um 18:00 Uhr.",
      },
      {
        q: "Was kostet ein Ticket?",
        a: "89,90 € pro Person. Darin enthalten sind das 3-Gänge-Menü und die Show. Getränke zahlt ihr wie gewohnt vor Ort.",
      },
      {
        q: "Wo bekomme ich Tickets?",
        a: "Online bei okticket. Der Vorverkauf läuft seit Sonntag, 18. Oktober 2026. Unsere normale Tischreservierung gilt für diesen Abend nicht.",
      },
      {
        q: "Gibt es ein vegetarisches oder veganes Menü?",
        a: "Ja. Bei der Buchung wählst du für jede Person zwischen Fleisch-Menü, vegetarischem und veganem Menü — ohne Aufpreis.",
      },
      {
        q: "Was passiert an dem Abend?",
        a: "Zwischen den drei Gängen zeigt Emilian Leber Zauberei und Comedy: Close-Up-Magie direkt an eurem Tisch und Momente, die der ganze Raum gemeinsam erlebt.",
      },
      {
        q: "Wer ist Emilian Leber?",
        a: "Ein Zauberkünstler aus Regensburg, Finalist bei Greatest Talent und Talents of Magic, seit 2016 mit über 200 Events. Er gehört zur Familie hinter dem Wald & Wiese.",
      },
      {
        q: "Kann ich Tickets verschenken?",
        a: "Ja, ein Abend mit Essen und Show ist ein schönes Geschenk, zum Beispiel zu Weihnachten. Die Tickets kaufst du bei okticket; für einen normalen Restaurantbesuch gibt es außerdem unsere Gutscheine.",
      },
      {
        q: "Kann ich ein Magic Dinner auch für meine eigene Feier buchen?",
        a: "Ja, das Format gibt es auch privat — für Firmen- und Weihnachtsfeiern, Geburtstage oder Hochzeiten, bei uns im Wald & Wiese oder in eurer Location. Die Anfrage läuft direkt über Emilian Leber auf magicel.de.",
      },
    ],
    cta: {
      heading: "Staunen?",
      accent: "Platz sichern.",
      text: "Die letzten Magic Dinner waren schnell ausverkauft. Tickets für Samstag, 20. Februar 2027 gibt es bei okticket — das Menü (Fleisch, vegetarisch oder vegan) wählst du gleich mit.",
    },
    keywords: [
      "Magic Dinner Regensburg",
      "Dinnershow Regensburg",
      "Zauberdinner Sinzing",
      "Zaubershow mit Essen",
      "Emilian Leber",
    ],
  },
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
