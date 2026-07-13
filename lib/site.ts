/**
 * Zentrale Konstanten — überall gleich verwendet.
 * Wenn sich Öffnungszeiten/Kontakt/Reservierung ändert, hier anpassen.
 */

export const SITE = {
  name: "Wald & Wiese",
  shortName: "Wald & Wiese",
  legalName: "Wald & Wiese UG (haftungsbeschränkt)",
  tagline: "Brunch & Abendessen mitten im Grünen.",
  description:
    "Brunch & Abendessen in Sinzing bei Regensburg. Täglich Brunch von 8–14 Uhr: Frühstück, Brote, Bowls & Mittagstisch. Freitag bis Sonntag abends Burger, Bowls & vom Grill. Familiengeführt, regional, hundefreundlich, vegan & vegetarisch.",
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

/** Rechtliche Firmenangaben (Impressum) — zentral für Footer/E-Mails. */
export const COMPANY = {
  ceo: "Sven Leber",
  court: "Amtsgericht Regensburg",
  register: "HRB 21989",
  vatId: "DE459044362",
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
  /** Exakter Launch-Zeitpunkt (00:00 MESZ) als ms — für die Datumsweiche. */
  ts: Date.parse("2026-07-06T00:00:00+02:00"),
};

/**
 * Zentrale Datumsweiche für den ganzen Auftritt: `true` ab dem Launch.
 * Damit schalten Öffnungszeiten, Texte, Schema & SEO überall gleichzeitig von
 * „bald / Coming-Soon" auf „echtes Frühstücksrestaurant" um. Datumsgesteuert →
 * die getestete Version kann vorab deployed werden; die Seiten schalten dank
 * ISR-`revalidate` ohne neuen Deploy am 06.07. 00:00 von selbst um.
 */
export function hasBreakfastLaunched(): boolean {
  return Date.now() >= BREAKFAST_LAUNCH.ts;
}

/**
 * Die aktuell GÜLTIGEN Öffnungszeiten (normalisiert: days/hours/isoSpec).
 * Vor Launch = CURRENT (nur abends), ab Launch = NEW (Frühstück + abends).
 */
export function liveOpeningHours(): Array<{
  days: string;
  hours: string;
  isoSpec: string;
}> {
  if (hasBreakfastLaunched()) {
    return NEW_OPENING_HOURS.map((s) => ({
      days: s.days,
      hours: s.slots.join(" & "),
      isoSpec: s.isoSpec,
    }));
  }
  return CURRENT_OPENING_HOURS.map((s) => ({
    days: s.days,
    hours: s.hours,
    isoSpec: s.isoSpec,
  }));
}

/** Launch-abhängige Seiten-Beschreibung (Meta/OG). */
export const SITE_DESCRIPTION_LIVE =
  "Brunch & Abendessen in Sinzing bei Regensburg. Täglich Brunch von 8–14 Uhr: Frühstück, Brote, Bowls & Mittagstisch — hausgemacht, regional, mit Kaffee mit Charakter. Freitag bis Sonntag abends Burger, Bowls & vom Grill. Familiengeführt, hundefreundlich, vegan & vegetarisch.";

export function siteDescription(): string {
  return hasBreakfastLaunched() ? SITE_DESCRIPTION_LIVE : SITE.description;
}

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
  { label: "Speisekarte", href: "/speisekarte" },
  { label: "Getränke", href: "/getraenke" },
  { label: "Reservieren", href: "/reservieren" },
  { label: "Kontakt", href: "/kontakt" },
];

export const NAV_FULL: Array<{ label: string; href: string }> = [
  { label: "Speisekarte", href: "/speisekarte" },
  { label: "Getränke", href: "/getraenke" },
  { label: "Reservieren", href: "/reservieren" },
  { label: "Veranstaltungen", href: "/veranstaltungen" },
  { label: "Rezepte", href: "/rezepte" },
  { label: "Ratgeber", href: "/ratgeber" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Karriere", href: "/karriere" },
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
      { label: "Speisekarte", href: "/speisekarte" },
      { label: "Frühstück & Mittag", href: "/speisekarte#fruehstueck" },
      { label: "Abend (Fr–So)", href: "/speisekarte#abend" },
      { label: "Getränke", href: "/getraenke" },
    ],
  },
  {
    title: "Entdecken",
    links: [
      { label: "Veranstaltungen", href: "/veranstaltungen" },
      { label: "Über uns", href: "/ueber-uns" },
      { label: "Rezepte", href: "/rezepte" },
      { label: "Ratgeber", href: "/ratgeber" },
      { label: "Galerie", href: "/galerie" },
      { label: "Karriere & Jobs", href: "/karriere" },
      { label: "Kontakt & Anfahrt", href: "/kontakt" },
    ],
  },
  {
    title: "Brunch & Küche",
    links: [
      { label: "Brunch Regensburg", href: "/brunch-regensburg" },
      { label: "Brunch Sinzing", href: "/brunch-sinzing" },
      { label: "Brunch Nittendorf", href: "/brunch-nittendorf" },
      { label: "Brunch Kelheim", href: "/brunch-kelheim" },
      { label: "Wochenendbrunch Regensburg", href: "/wochenendbrunch-regensburg" },
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
