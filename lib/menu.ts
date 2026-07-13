/**
 * Frühstücks-/Brunch-Karte — verifizierte Inhalte aus „Speisekarte Frühstück.pdf"
 * (Brunch-Karte · 2026, Familie Leber). Brote-Preise vom User per Screenshot
 * bestätigt 2026-07-03.
 *
 * Struktur bewusst identisch zu `lib/dinner-menu.ts`, damit dieselbe Render-
 * Optik (Preis rechts, Veggie-Blatt, Optionen in Warmton) greift.
 *
 * Falls jemand etwas ändert (Preise, Gerichte) → HIER anpassen, nicht im JSX.
 * Vollständig aus der Brunch-Karte 2026 übernommen (inkl. Extras), 2026-07-13.
 */

export type BreakfastDish = {
  name: string;
  desc?: string;
  /** Kleiner Zusatz unter dem Gericht, z. B. „Für Kinder bis 12 Jahren". */
  hint?: string;
  /** Preis als String „17,90 €" — oder Array für zwei Preise (z. B. allein/zu zweit). */
  price: string | string[];
  /** Aufpreis-/Wahl-Optionen, z. B. „Optional Räucherlachs +3,50 €". */
  options?: Array<{ label: string; price: string }>;
  tags?: Array<
    "vegan" | "vegetarisch" | "vegan möglich" | "vegetarisch möglich"
  >;
  /** Slug eines passenden Rezepts (/rezepte/<slug>) zum Nachmachen. */
  recipeSlug?: string;
};

export type BreakfastCategory = {
  slug: string;
  title: string;
  /** Optionale Notiz unter dem Titel, z. B. Uhrzeit. */
  hint?: string;
  items: BreakfastDish[];
};

export const BREAKFAST_MENU: BreakfastCategory[] = [
  {
    slug: "fruehstueck",
    title: "Frühstück",
    items: [
      {
        name: "Der gute alte Sepp",
        desc:
          "Butter, Schinken, geräucherter Schinken und Salami, Käse, hausgemachte Marmelade, Frischkäse, Rührei mit zwei Eiern, Naturjoghurt mit hausgemachtem Granola, frisches Obst und Gemüse, Brotkorb, Orangensaft — nur für dich oder zu zweit",
        price: ["17,90 €", "29,90 €"],
      },
      {
        name: "Die grüne Gretl",
        desc:
          "vegane Butter, pflanzlicher Käse, Sojajoghurt mit hausgemachtem Granola, hausgemachte Aufstriche (Marmelade, Tomatenaufstrich, Paprikahummus), hausgemachte Antipasti, hausgemachtes Bananenbrot, frisches Obst und Gemüse, Brotkorb, Orangensaft",
        price: "17,90 €",
        tags: ["vegan"],
      },
      {
        name: "Die süße Mizzi",
        desc:
          "Butter, hausgemachte Marmelade, Nutella, Naturjoghurt mit hausgemachtem Granola, Croissant, frisches Obst",
        price: "11,90 €",
        tags: ["vegetarisch"],
      },
      {
        name: "Der kleine Hansi",
        desc: "Butter, Nutella, Fruchtzwerg, frisches Obst, Croissant",
        price: "6,90 €",
        hint: "Für Kinder bis 12 Jahren",
      },
    ],
  },
  {
    slug: "brote",
    title: "Brote",
    items: [
      {
        name: "Morgenstund hat Avocado im Mund",
        desc:
          "geröstetes Brot, hausgemachte Guacamole, Spiegelei, Rucola, hausgemachte Zitronenmayo, Sprossen, hausgemachte Teriyakisoße, Sesam, selbst eingelegte Zwiebeln",
        price: "13,90 €",
        options: [{ label: "Optional Räucherlachs", price: "+3,50 €" }],
        tags: ["vegetarisch"],
        recipeSlug: "hausgemachte-guacamole",
      },
      {
        name: "Aller Anfang ist grün",
        desc:
          "geröstetes Brot, gegrilltes Gemüse, Chiliöl, Babyspinat, Balsamicocreme, frittierte Kapern, hausgemachter mediterraner Karotten-Tomaten-Hummus",
        price: "16,90 €",
        options: [
          { label: "wahlweise Burrata oder veganer Schafskäse", price: "inklusive" },
        ],
        tags: ["vegan möglich"],
      },
      {
        name: "Wer das Pesto nicht ehrt, …",
        desc:
          "geröstetes Brot, italienischer Schinken, Parmesan, sonnengetrocknete Tomaten, Rucola, hausgemachte Balsamicozwiebeln, hausgemachtes Zitronenöl, hausgemachter Walnusspesto-Frischkäse-Aufstrich, selbst eingelegte mixed Pickles",
        price: "17,90 €",
      },
      {
        name: "Da wird einem süß ums Herz",
        desc:
          "French Toast mit hausgemachter Schmandcreme, hausgemachtes Apfelkompott, Pistazien, Ahornsirup",
        price: "11,90 €",
        tags: ["vegetarisch"],
        recipeSlug: "french-toast",
      },
    ],
  },
  {
    slug: "bowls",
    title: "„Schmusi“-Bowls",
    items: [
      {
        name: "Beerenherzerl",
        desc: "rote Beeren, Kokosmilch, Chiasamen, Bananen, Kokosflocken",
        price: "8,20 €",
      },
      {
        name: "Wiesenschmuserl",
        desc:
          "Spinat, Mango, Kokosmilch, Chiasamen, Bananen, Kokosflocken, hausgemachtes Granola",
        price: "8,90 €",
        recipeSlug: "chia-fruehstuecksbowl",
      },
    ],
  },
  {
    slug: "extras",
    title: "Extras",
    items: [
      {
        name: "Aufstriche",
        desc: "Frischkäse, hausgemachter mediterraner Tomaten-Karotten-Aufstrich, Paprikahummus, Nutella, hausgemachte Marmelade",
        price: "je 2,90 €",
        options: [{ label: "Pistaziencreme", price: "+0,50 €" }],
      },
      {
        name: "Rührei",
        desc: "drei Eier mit Schnittlauch, Butter, Baguette",
        price: "6,90 €",
        tags: ["vegetarisch"],
      },
      { name: "Spiegelei", price: "2,10 €", tags: ["vegetarisch"] },
      { name: "Brotkorb", price: "2,50 €", tags: ["vegan"] },
      { name: "Croissant", price: "2,20 €", tags: ["vegetarisch"] },
      { name: "Räucherlachs", price: "4,90 €" },
      { name: "Speck", price: "2,10 €" },
      { name: "Butter / Margarine", price: "1,50 €" },
    ],
  },
  {
    slug: "mittags",
    title: "Mittags",
    hint: "ab 11:30 – 14:00 Uhr",
    items: [
      {
        name: "Oma’s Lieblingscurrywurst",
        desc: "mit Pommes und hausgemachter Soße",
        price: "12,90 €",
      },
      {
        name: "Der klassische Heinzi",
        desc:
          "Brioche Bun mit hausgemachter Burgersoße, Beef oder veganes Patty, Salat, Tomate, Essiggurke, Pommes, Ketchup oder Mayo",
        price: "13,90 €",
        tags: ["vegan möglich"],
      },
      {
        name: "Die gackernde Julia",
        desc:
          "Brioche Bun mit Mayonnaise, crunchy Chicken-Patty, Salat, Sweet-Chili-Soße, Pommes, Ketchup oder Mayo",
        price: "13,50 €",
      },
      {
        name: "Sophia’s Garten",
        desc:
          "gemischter Salat mit frischen Tomaten und Gurken, Paprika, rote Zwiebeln, Hausdressing, Baguette — wahlweise mit Käse/Schinken oder Falafel",
        price: "11,90 €",
        tags: ["vegetarisch"],
      },
    ],
  },
];

/** Kurzer Willkommens-Text von der Karte (Servus & herzlich willkommen). */
export const BREAKFAST_WELCOME = {
  headline: "Servus & herzlich willkommen",
  body: [
    "Schön, dass du da bist. Bei uns gibt’s das, was wir selber gern essen: viel Hausgemachtes, gute Sachen aus der Region und Liebe in jedem Teller.",
    "Unsere Frühstücke tragen die Namen, die bei uns dazugehören — vom guten alten Sepp bis zum kleinen Hansi. Lass dir Zeit, genieß den Blick ins Grüne.",
  ],
  signoff: ["Eure Familie Leber", "& das WALD & WIESE-Team"],
} as const;
