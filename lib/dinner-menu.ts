/**
 * Abend-Speisekarte — übernommen aus der aktuellen Speisekarte-WW.pdf
 * Stand 2026-05-21.
 *
 * Hinweis: Hier stehen die VERIFIZIERTEN Inhalte aus der PDF. Falls jemand
 * etwas ändert (Preise, neue Gerichte, gestrichene Gerichte) → bitte hier
 * anpassen, nicht im JSX.
 */

export type Dish = {
  name: string;
  desc?: string;
  /** Preis in Euro als String, z. B. "17,50 €" — oder Array für „150g / 300g". */
  price: string | string[];
  /** Aufpreis-Optionen, z. B. „mit Hähnchen +3,00 €". */
  options?: Array<{ label: string; price: string }>;
  tags?: Array<
    "vegan" | "vegetarisch" | "vegan möglich" | "vegetarisch möglich" | "empfehlung"
  >;
};

export type DishCategory = {
  slug: string;
  title: string;
  /** Optionale Hervorhebung über der Kategorie, z. B. „Beginner". */
  kicker?: string;
  /** Optionale Notiz unter dem Titel, z. B. „hausgemacht frisch". */
  hint?: string;
  items: Dish[];
};

export const BURGER_CHOICES = {
  buns: ["Brioche", "Laugenbun"],
  bunNote: "hausgemacht vom Bäcker",
  patties: ["Beef Patty (200 g)", "vegan (aus Erbsenprotein)"],
  extras: [
    { label: "Cheddar", price: "+1,50 €" },
    { label: "veganer Käse", price: "+1,50 €" },
    { label: "Speck", price: "+0,80 €" },
    { label: "Jalapeños", price: "+0,70 €" },
    { label: "Balsamico-Zwiebeln", price: "+1,50 €" },
    { label: "Spiegelei", price: "+1,50 €" },
  ],
} as const;

export const DINNER_MENU: DishCategory[] = [
  {
    slug: "vorspeisen",
    title: "Beginner",
    hint: "hausgemacht frisch",
    items: [
      {
        name: "Rote Bete Carpaccio",
        desc: "Rucola · Ziegenkäse · frittierte Kapern · Granatapfel",
        price: "9,90 €",
        tags: ["vegetarisch"],
      },
      {
        name: "Gemüse im Tempurateig",
        desc: "mit hausgemachtem Teriyaki- und WALD&WIESE Dip",
        price: "10,90 €",
        tags: ["vegetarisch"],
      },
      {
        name: "Suppe des Monats",
        desc: "Tagesaktuell — frag uns einfach an der Theke",
        price: "6,50 €",
      },
    ],
  },
  {
    slug: "burger",
    title: "Burger",
    hint: "hausgemacht frisch",
    items: [
      {
        name: "Die gackernde Julia",
        desc: "knuspriges Chicken Patty · Sweet-Chilli-Soße · Salat · Mayo",
        price: "12,90 €",
      },
      {
        name: "Der klassische Heinzi",
        desc:
          "Patty nach Wahl · Salat · Tomate · Essiggurke · Burgersoße",
        price: "13,50 €",
        tags: ["vegan möglich"],
      },
      {
        name: "Die mähende Moni",
        desc:
          "Patty nach Wahl · Ziegenkäse · Birnenchutney · Rucola · Balsamico-Zwiebeln · Walnusspesto",
        price: "17,50 €",
        tags: ["vegetarisch möglich", "empfehlung"],
      },
      {
        name: "Der fetzige Sven",
        desc:
          "Pulled Pork oder Jackfruit (vegan) · Cheddar · BBQ-Soße · Coleslaw oder Spitzkohlsalat (vegan)",
        price: "17,50 €",
        tags: ["vegan möglich"],
      },
      {
        name: "Dorfbazi",
        desc:
          "Fleischpatty · Trüffelmayo · Rösti · Cheddar · Tomate · Salat · Zwiebeln · Spiegelei · Speck",
        price: "19,50 €",
      },
    ],
  },
  {
    slug: "bowls",
    title: "Schüssel voller Glück",
    hint: "hausgemacht frisch",
    items: [
      {
        name: "Des Kaisers neue Schüssel",
        desc: "Römersalat · Parmesan · Croutons · Caesar-Dressing",
        price: "12,90 €",
        options: [{ label: "Hähnchen", price: "+3,00 €" }],
        tags: ["vegetarisch"],
      },
      {
        name: "Prinzessin auf der Kichererbse",
        desc:
          "Spinat · Avocado · Granatapfelkerne · würzige Kartoffelspalten · geröstete Kichererbsen · Limetten-Dressing — wahlweise mit Hähnchen oder Falafel",
        price: "16,90 €",
        tags: ["vegan", "empfehlung"],
      },
      {
        name: "Der Fischer und seine Schüssel",
        desc:
          "Rucola · würzige Kartoffelspalten · Lachs · Gurke · Paprika · Rote Bete · Balsamico-Zwiebeln · Körner-Nuss-Mix · Honig-Senf-Dressing",
        price: "19,90 €",
      },
    ],
  },
  {
    slug: "grill",
    title: "Vom Grill",
    hint: "hausgemacht frisch",
    items: [
      {
        name: "Gegrillte Gemüsepfanne",
        desc: "Gemüse der Saison · würzige Kartoffelspalten",
        price: "14,90 €",
        options: [{ label: "Halloumi", price: "+2,50 €" }],
        tags: ["vegan"],
      },
      {
        name: "Spare Ribs",
        desc: "3 Ribs · BBQ-Soße · Pommes · Coleslaw",
        price: "21,90 €",
      },
      {
        name: "Steak aus der Rinderhüfte",
        desc: "mit Kräuterbutter · 230 – 250 g",
        price: "22,90 €",
      },
      {
        name: "Teriyaki-Lachs",
        desc: "gebratener Knoblauch-Spinat · würzige Kartoffelspalten · Sesam",
        price: "23,90 €",
        tags: ["empfehlung"],
      },
    ],
  },
  {
    slug: "beilagen",
    title: "Beilagen",
    hint: "hausgemacht frisch",
    items: [
      {
        name: "Pommes",
        price: ["150 g · 4,50 €", "300 g · 6,90 €"],
      },
      {
        name: "Süßkartoffelpommes",
        price: ["150 g · 5,50 €", "300 g · 7,90 €"],
      },
      {
        name: "Würzige Kartoffelspalten",
        desc: "ca. 250 – 300 g",
        price: "5,90 €",
      },
      {
        name: "Gegrilltes Gemüse",
        desc: "Gemüse der Saison",
        price: "5,90 €",
        tags: ["vegan"],
      },
      { name: "Coleslaw", price: "3,90 €", tags: ["vegetarisch"] },
      { name: "Spitzkohl-Salat", price: "2,90 €", tags: ["vegan"] },
      {
        name: "Beilagensalat",
        desc: "mit Hausdressing",
        price: "4,50 €",
      },
      { name: "Baguette", price: "2,00 €" },
    ],
  },
  {
    slug: "dips-klassik",
    title: "Dips · Klassiker",
    items: [
      { name: "Mayo", price: "1,50 €" },
      { name: "Ketchup", price: "1,50 €" },
      { name: "BBQ", price: "1,50 €" },
    ],
  },
  {
    slug: "dips-haus",
    title: "Dips · Hausgemacht",
    items: [
      { name: "Aioli", price: "2,20 €" },
      { name: "Zitronenmayo", price: "2,20 €" },
      { name: "Sriracha-Mayo", price: "2,20 €" },
      { name: "Guacamole", price: "2,80 €" },
      {
        name: "WALD & WIESE Dip",
        desc: "Steaksoße",
        price: "2,80 €",
      },
    ],
  },
  {
    slug: "kinder",
    title: "Tischlein deck dich",
    hint: "Für Kinder bis 12 Jahren",
    items: [
      {
        name: "Sechs auf einen Streich",
        desc: "sechs Nuggets · Pommes · Ketchup oder Mayo",
        price: "8,50 €",
      },
      {
        name: "Ich bin nicht satt und mag kein Blatt",
        desc:
          "Brioche Bun · 100 g Patty (Beef oder Chicken) · Tomate · Salat · Essiggurke · Ketchup · Pommes · Ketchup oder Mayo",
        price: "9,50 €",
      },
      {
        name: "Süß wie Schnee",
        desc: "Kugel Vanilleeis · Streusel",
        price: "2,50 €",
      },
    ],
  },
  {
    slug: "finale",
    title: "Finale",
    hint: "hausgemacht frisch",
    items: [
      { name: "Klassische Tiramisu", price: "5,50 €", tags: ["vegetarisch"] },
      {
        name: "Pistazientiramisu",
        desc: "schon über 1.500 Mal verkauft",
        price: "6,50 €",
        tags: ["vegetarisch", "empfehlung"],
      },
      { name: "Tiramisu-Duo", price: "9,90 €", tags: ["vegetarisch"] },
      {
        name: "Krachender Crumble",
        desc: "Früchte der Saison · Eis",
        price: "6,90 €",
        tags: ["vegan möglich"],
      },
      {
        name: "Sternstunden-Finale",
        desc:
          "Jeden Monat ein neues Finale. Pro verkauftem Dessert spenden wir 1 € an Sternstunden e. V. und unterstützen damit Menschen in Not.",
        price: "7,90 €",
      },
    ],
  },
];
