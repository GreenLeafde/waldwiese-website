/**
 * Zentrale Konstanten — überall gleich verwendet.
 * Wenn sich Öffnungszeiten/Kontakt/Reservierung ändert, hier anpassen.
 */

export const SITE = {
  name: "Wald & Wiese",
  shortName: "Wald & Wiese",
  legalName: "Wald & Wiese UG (haftungsbeschränkt)",
  tagline: "Frühstück mitten im Grünen.",
  description:
    "Frühstücksrestaurant in Sinzing bei Regensburg — ab 6. Juli 2026 jeden Morgen frisch. Brot vom Bäcker, Obst aus Sinzing, hausgemachte Aufstriche, Granola und Kaffee mit Charakter. Familiengeführt, regional, hundefreundlich. Abends Burger, Bowls & vom Grill.",
  url: "https://restaurant-waldwiese.de",
  locale: "de_DE",
} as const;

export const CONTACT = {
  street: "Bruckdorfer Straße 42",
  postalCode: "93161",
  city: "Sinzing",
  region: "Bayern",
  country: "Deutschland",
  phone: "+49 160 4265772",
  phoneRaw: "+491604265772",
  email: "info@restaurant-waldwiese.de",
  whatsapp: "+491604265772",
  instagram: "https://www.instagram.com/waldundwiese_restaurant/",
  instagramHandle: "@waldundwiese_restaurant",
} as const;

/**
 * Aktuelle Öffnungszeiten — bis zum 06.07.2026 (vor Frühstücks-Launch).
 * Quelle: restaurant-waldwiese.de Stand 2026-05.
 */
export const CURRENT_OPENING_HOURS = [
  { days: "Mo, Do – Sa", hours: "17:00 – 22:00", isoSpec: "Mo,Th-Sa 17:00-22:00" },
  { days: "Sonntag", hours: "12:00 – 20:00", isoSpec: "Su 12:00-20:00" },
] as const;

/**
 * Neue Öffnungszeiten ab Frühstücks-Launch — User-bestätigt 2026-05-21.
 * Fr–So mit Doppelschicht (Frühstück + Abendservice, dazwischen Pause).
 */
export const NEW_OPENING_HOURS = [
  {
    days: "Mo – Do",
    slots: ["08:00 – 14:00"],
    isoSpec: "Mo-Th 08:00-14:00",
  },
  {
    days: "Fr – So",
    slots: ["08:00 – 14:00", "17:00 – 22:00"],
    isoSpec: "Fr-Su 08:00-14:00,17:00-22:00",
  },
] as const;

/**
 * Wird in Layout/Schema-JSON-LD verwendet. Aktuell die *gültigen* Zeiten —
 * also bis Launch CURRENT, danach NEW. Manuell umschalten beim Launch.
 */
export const OPENING_HOURS = CURRENT_OPENING_HOURS.map((s) => ({
  days: s.days,
  hours: s.hours,
  isoSpec: s.isoSpec,
}));

export const RESERVATION_URL =
  "https://mylightspeed.app/reservation/abfa7c53-5be9-4ace-806d-3276d3f70e9b/reservation";

/** Google-Place-Daten (aus dem Google-Eintrag, Place ID). */
export const GEO = { lat: 48.9901749, lng: 12.0235966 } as const;
export const GOOGLE_PLACE_ID = "ChIJjTxF3wjBn0cRLWouowLUjkk";
/** Öffnet exakt das Google-Listing (mit Bewertungen/Sternen). */
export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Wald und Wiese Sinzing",
)}&query_place_id=${GOOGLE_PLACE_ID}`;

/** Eröffnung Frühstücks-Konzept — User-bestätigt 2026-05-21. */
export const BREAKFAST_LAUNCH = {
  date: "2026-07-06",
  dateShort: "06.07.2026",
  dateLong: "6. Juli 2026",
};

/**
 * Magic Dinner Summer Edition.
 * Quelle: magicel.de — Emilian Leber (Sohn der Familie Leber) ist Magicel.
 * Buchung über das Ticket-/Tisch-Formular auf magicel.de (ticketUrl) oder
 * über Lightspeed (RESERVATION_URL) bzw. telefonisch.
 */
export const MAGIC_DINNER = {
  date: "2026-07-11",
  dateShort: "11.07.2026",
  dateLong: "11. Juli 2026",
  startTime: "17:00 Uhr",
  location: "Wald & Wiese · Terrasse & Innenbereich",
  magicianName: "Emilian Leber",
  magicianStageName: "Magicel",
  magicianUrl: "https://www.magicel.de/tickets/magic-dinner-summer-edition",
  /** Tisch-sichern-Formular auf magicel.de (Sprungmarke direkt zur Reservierung). */
  ticketUrl:
    "https://www.magicel.de/tickets/magic-dinner-summer-edition#reservieren",
};

/**
 * Hauptnavigation — gleiche Reihenfolge in Header und Footer.
 */
/**
 * Aktuelles Setup: Startseite ist ein Onepager. Alle Navigationspunkte
 * verlinken auf Section-IDs auf der Startseite. Sobald eigenständige
 * Unterseiten gebaut werden, hier die `href` auf die Route umstellen.
 */
/**
 * Schlanke Desktop-Nav — vier wichtigste Unterseiten.
 * Alle übrigen Routen (Frühstück, Veranstaltungen, Events, Rezepte) bleiben
 * im Mobile-Menü unter NAV_FULL erreichbar.
 */
export const NAV: Array<{ label: string; href: string }> = [
  { label: "Frühstück", href: "/fruehstueck" },
  { label: "Abendkarte", href: "/abendessen" },
  { label: "Getränke", href: "/getraenke" },
  { label: "Kontakt", href: "/kontakt" },
];

export const NAV_FULL: Array<{ label: string; href: string }> = [
  { label: "Frühstück", href: "/fruehstueck" },
  { label: "Abendkarte", href: "/abendessen" },
  { label: "Getränke", href: "/getraenke" },
  { label: "Reservieren", href: "/reservieren" },
  { label: "Veranstaltungen", href: "/veranstaltungen" },
  { label: "Events", href: "/events" },
  { label: "Rezepte", href: "/rezepte" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export const LEGAL_NAV: Array<{ label: string; href: string }> = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
];

/**
 * Footer-Sitemap — gruppierte Links auf ALLE Seiten. Steht auf jeder Seite,
 * gibt damit auch den SEO-/Städteseiten interne Links von überall.
 */
export const FOOTER_NAV: Array<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    title: "Essen & Trinken",
    links: [
      { label: "Frühstück", href: "/fruehstueck" },
      { label: "Speisekarte", href: "/abendessen" },
      { label: "Getränke", href: "/getraenke" },
      { label: "Speisen", href: "/speisen" },
    ],
  },
  {
    title: "Entdecken",
    links: [
      { label: "Events", href: "/events" },
      { label: "Veranstaltungen", href: "/veranstaltungen" },
      { label: "Über uns", href: "/ueber-uns" },
      { label: "Rezepte", href: "/rezepte" },
      { label: "Galerie", href: "/galerie" },
      { label: "Kontakt & Anfahrt", href: "/kontakt" },
    ],
  },
  {
    title: "Frühstück & Küche",
    links: [
      { label: "Frühstück Regensburg", href: "/fruehstueck-regensburg" },
      { label: "Frühstück Sinzing", href: "/fruehstueck-sinzing" },
      {
        label: "Veganes Frühstück Regensburg",
        href: "/veganes-fruehstueck-regensburg",
      },
      {
        label: "Vegetarisches Restaurant",
        href: "/vegetarisches-restaurant-regensburg",
      },
      { label: "Burger Regensburg", href: "/burger-regensburg" },
    ],
  },
  {
    title: "Region & Anlässe",
    links: [
      { label: "Restaurant Sinzing", href: "/restaurant-sinzing" },
      { label: "Abendessen Regensburg", href: "/abendessen-regensburg" },
      { label: "Biergarten Sinzing", href: "/biergarten-sinzing" },
      { label: "Restaurant Viehhausen", href: "/restaurant-viehhausen" },
      { label: "Restaurant Nittendorf", href: "/restaurant-nittendorf" },
      {
        label: "Hochzeitslocation Regensburg",
        href: "/hochzeitslocation-regensburg",
      },
      {
        label: "Hundefreundliches Restaurant",
        href: "/hundefreundliches-restaurant-regensburg",
      },
    ],
  },
];
