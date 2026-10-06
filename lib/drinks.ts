/**
 * Getränkekarte — verifizierte Inhalte aus den finalen Karten, Stand 2026-10-06:
 *   • „Getränkekarte · Zum Wohl" (Rückseite von Frühstücks- und Abendkarte)
 *   • „Finale Getränke Tischaufsteller.pdf" (Limonaden, Spritz, Cocktails,
 *     Schnäpse — die stehen nur auf dem Aufsteller am Tisch)
 *
 * Alkoholfreie Varianten stehen bewusst im `desc` und nicht als eigener
 * Eintrag: so bleibt die Karte so kurz wie das Original am Tisch.
 *
 * Falls jemand etwas ändert (Preise, neue Getränke) → HIER anpassen.
 */

export type Drink = {
  name: string;
  desc?: string;
  /** Einzelpreis oder Array für mehrere Größen. */
  price: string | string[];
  tags?: Array<"alkoholfrei" | "bio" | "vegan" | "hausgemacht">;
};

export type DrinkCategory = {
  slug: string;
  title: string;
  hint?: string;
  items: Drink[];
};

export const DRINK_CATEGORIES: DrinkCategory[] = [
  {
    slug: "kaffee",
    title: "Kaffee & Klassiker",
    hint: "auch entkoffeiniert · mit Hafermilch oder laktosefrei · Sirup (Vanille, Macadamia, Karamell) +1,00 €",
    items: [
      { name: "Kaffee Crema", price: "3,50 €" },
      { name: "Tasse Filterkaffee", price: "3,20 €" },
      { name: "Haferl Filterkaffee", price: "3,90 €" },
      { name: "Tasse Kaffee, entkoffeiniert", price: "3,20 €" },
      { name: "Espresso", price: "2,80 €" },
      { name: "Doppelter Espresso", price: "3,50 €" },
      { name: "Espresso Macchiato", price: "3,20 €" },
      { name: "Cappuccino", price: "4,20 €" },
      { name: "Latte Macchiato", price: "4,90 €" },
      { name: "Chai Latte", price: "4,90 €" },
      { name: "Heiße Schokolade", desc: "weiß oder dunkel", price: "4,50 €" },
      {
        name: "Tee",
        desc: "Earl Grey · Früchtetee · Grüner Tee",
        price: "3,20 €",
      },
      { name: "Frischer Ingwer-Minze-Tee", price: "4,20 €" },
      { name: "Affogato", price: "4,90 €" },
    ],
  },
  {
    slug: "alkoholfrei",
    title: "Alkoholfrei",
    items: [
      {
        name: "Coca-Cola · Cola Zero",
        price: ["0,33 · 3,90 €", "0,5 · 4,90 €"],
      },
      { name: "Sprite", price: ["0,33 · 3,90 €", "0,5 · 4,90 €"] },
      { name: "Paulaner Spezi", price: "0,5 · 4,90 €" },
      {
        name: "Now Fresh Lemon · Sunny Orange · Holler Blüte",
        price: "0,33 · 3,90 €",
      },
      {
        name: "Bio Kristall Wasser",
        desc: "medium oder still",
        price: ["0,33 · 3,90 €", "0,75 · 6,90 €"],
        tags: ["bio"],
      },
    ],
  },
  {
    slug: "schorle",
    title: "Schorle",
    items: [
      {
        name: "Now Apfel · Rhabarber · Cassis-Lime",
        price: "0,5 · 4,90 €",
      },
      { name: "Maracuja", price: "0,5 · 4,90 €" },
    ],
  },
  {
    slug: "limonade",
    title: "Hausgemachte Limonaden",
    hint: "0,5 l eiskalt · je 5,90 € — stehen auf dem Aufsteller am Tisch",
    items: [
      { name: "Erdbeer-Basilikum", price: "0,5 · 5,90 €", tags: ["hausgemacht"] },
      {
        name: "Granatapfel-Rosmarin",
        price: "0,5 · 5,90 €",
        tags: ["hausgemacht"],
      },
      {
        name: "Grapefruit-Hibiskus",
        price: "0,5 · 5,90 €",
        tags: ["hausgemacht"],
      },
      { name: "Gurke-Basilikum", price: "0,5 · 5,90 €", tags: ["hausgemacht"] },
      {
        name: "Karibischer Pfirsich",
        price: "0,5 · 5,90 €",
        tags: ["hausgemacht"],
      },
    ],
  },
  {
    slug: "bier",
    title: "Bier",
    hint: "in Bio-Qualität vom Neumarkter Lammsbräu",
    items: [
      { name: "Pils", price: "0,33 · 3,90 €" },
      { name: "Helles", price: "0,5 · 4,90 €" },
      { name: "Weizen", price: "0,5 · 4,90 €" },
      { name: "Natur Radler", price: "0,33 · 3,90 €" },
      {
        name: "Helles alkoholfrei",
        price: "0,5 · 4,90 €",
        tags: ["alkoholfrei"],
      },
      {
        name: "Dunkles Weizen alkoholfrei",
        price: "0,5 · 4,90 €",
        tags: ["alkoholfrei"],
      },
      {
        name: "Dunkles Radler alkoholfrei",
        price: "0,33 · 3,90 €",
        tags: ["alkoholfrei"],
      },
      {
        name: "Natur Radler alkoholfrei",
        price: "0,33 · 3,90 €",
        tags: ["alkoholfrei"],
      },
    ],
  },
  {
    slug: "spritz",
    title: "Spritz",
    hint: "steht auf dem Aufsteller am Tisch · vieles auch alkoholfrei",
    items: [
      {
        name: "Aperol Spritz",
        desc: "Aperol, Prosecco, Soda, Orange · alkoholfrei 6,90 € mit Orange Spritz, Sekt 0,0 und Soda",
        price: "8,50 €",
      },
      {
        name: "Sarti Spritz",
        desc: "Sarti Rosa, Prosecco, Soda, Limette",
        price: "8,50 €",
      },
      {
        name: "Limoncello Spritz",
        desc: "Limoncello, Prosecco, Soda, Zitrone · alkoholfrei 8,50 € mit Pallini Limonzero und Sekt 0,0",
        price: "8,50 €",
      },
      {
        name: "Campari Spritz",
        desc: "Campari, Prosecco, Soda, Orange · alkoholfrei 6,90 € mit Monin Bitter und Sekt 0,0",
        price: "8,50 €",
      },
      {
        name: "Wildberry Lillet",
        desc: "Lillet Rosé, Fever-Tree Wild Berry, Beeren",
        price: "8,50 €",
      },
      {
        name: "Hugo",
        desc: "Prosecco, Holunder, Minze, Limette · alkoholfrei 6,90 € mit Sekt 0,0",
        price: "8,50 €",
      },
    ],
  },
  {
    slug: "cocktails",
    title: "Cocktails",
    hint: "stehen auf dem Aufsteller am Tisch · vieles auch alkoholfrei",
    items: [
      {
        name: "Gin Tonic",
        desc: "Siegfried Gin, Fever-Tree Tonic, Zitrone · alkoholfrei 9,50 € mit Wonderleaf",
        price: "9,50 €",
      },
      {
        name: "Munich Mule",
        desc: "Siegfried Gin, Fever-Tree Ginger Beer, Gurke, Limette · alkoholfrei 9,50 € mit Wonderleaf",
        price: "9,50 €",
      },
      {
        name: "Moscow Mule",
        desc: "Wodka, Fever-Tree Ginger Beer, Limette, Minze · alkoholfrei 7,90 € mit Ginger Beer und Limette",
        price: "9,50 €",
      },
      {
        name: "Mojito",
        desc: "Havana Club 3, Minze, Limette, Soda · alkoholfrei 7,90 € mit Ginger Ale",
        price: "9,50 €",
      },
      {
        name: "Espresso Martini",
        desc: "Wodka, Biancaffè-Espresso, Kaffeelikör",
        price: "9,50 €",
      },
      {
        name: "43 Tonic",
        desc: "Likör 43, Fever-Tree Tonic, Orange",
        price: "9,50 €",
      },
    ],
  },
  {
    slug: "offene-weiss",
    title: "Offene Weine · Weiß",
    hint: "im Glas zu 0,1 oder 0,2 Liter",
    items: [
      {
        name: "Grüner Veltliner",
        desc: "frisch und pfeffrig · Respizhof Johann Kölbl, Weinviertel",
        price: ["0,1 · 3,50 €", "0,2 · 6,50 €"],
      },
      {
        name: "Riesling Forster Stift",
        desc: "feinherb, saftig nach Pfirsich und Zitrus · Weingut Lucashof, Pfalz",
        price: ["0,1 · 3,70 €", "0,2 · 6,90 €"],
        tags: ["bio"],
      },
      {
        name: "Connoisseur Cuvée",
        desc: "saftig und fruchtig · Domaine de Menard, Côtes de Gascogne",
        price: ["0,1 · 4,50 €", "0,2 · 7,50 €"],
      },
      {
        name: "Grauer Burgunder",
        desc: "Birne, Nuss, schön voll · Weingut Schmitt, Rheinhessen",
        price: ["0,1 · 4,90 €", "0,2 · 8,50 €"],
      },
    ],
  },
  {
    slug: "offene-rot",
    title: "Offene Weine · Rot",
    hint: "im Glas zu 0,1 oder 0,2 Liter",
    items: [
      {
        name: "Zweigelt",
        desc: "weich, nach roter Kirsche · Weingut Norbert Bauer",
        price: ["0,1 · 3,50 €", "0,2 · 6,50 €"],
      },
      {
        name: "Merlot delle Venezie",
        desc: "samtig, reife Pflaume · Gino Risotto, Friaul",
        price: ["0,1 · 3,70 €", "0,2 · 6,90 €"],
      },
    ],
  },
  {
    slug: "rose",
    title: "Offene Weine · Rosé",
    hint: "im Glas zu 0,1 oder 0,2 Liter",
    items: [
      {
        name: "Forster Rosé",
        desc: "feinherb, nach Erdbeere · Weingut Lucashof, Pfalz",
        price: ["0,1 · 3,50 €", "0,2 · 6,50 €"],
        tags: ["bio"],
      },
    ],
  },
  {
    slug: "flaschenweine-weiss",
    title: "Flaschenweine · Weiß",
    hint: "0,75 Liter für den ganzen Tisch",
    items: [
      {
        name: "Connoisseur Cuvée",
        desc: "Domaine de Menard, Côtes de Gascogne",
        price: "26,00 €",
      },
      {
        name: "Chardonnay",
        desc: "Apfel und ein cremiger Schmelz · Bioweingut Heber, Rheinhessen",
        price: "28,00 €",
        tags: ["bio", "vegan"],
      },
      {
        name: "Grauer Burgunder",
        desc: "Birne, Nuss, schön voll · Weingut Schmitt, Rheinhessen",
        price: "30,00 €",
      },
    ],
  },
  {
    slug: "flaschenweine-rot",
    title: "Flaschenweine · Rot",
    hint: "0,75 Liter für den ganzen Tisch",
    items: [
      {
        name: "Primitivo Integro",
        desc: "dunkle Beeren, kräftig und warm · The Wine People, Apulien",
        price: "29,50 €",
        tags: ["bio"],
      },
      {
        name: "Cabernet Franc",
        desc: "würzig, schwarze Johannisbeere · Weingut Schmitt, Rheinhessen",
        price: "30,00 €",
      },
    ],
  },
  {
    slug: "schaumwein",
    title: "Schaumweine",
    items: [
      {
        name: "Prosecco Vino Frizzante",
        desc: "Drusian, Venetien",
        price: ["0,1 · 4,50 €", "0,2 · 8,50 €", "0,75 · 28,00 €"],
      },
      {
        name: "Cuvée Vaux brut",
        desc: "feinperlend · Sektmanufaktur Schloss Vaux, Rheingau",
        price: "0,75 · 49,00 €",
      },
    ],
  },
  {
    slug: "filler",
    title: "Filler & Mixer",
    items: [
      { name: "Schweppes Ginger Ale", price: "0,2 · 3,90 €" },
      { name: "Schweppes Bitter Lemon", price: "0,2 · 3,90 €" },
      { name: "Fever-Tree Ginger Beer", price: "0,2 · 4,20 €" },
    ],
  },
  {
    slug: "schnaeps",
    title: "Zum Abschluss",
    hint: "steht auf dem Aufsteller am Tisch",
    items: [
      { name: "Prinz Birne", price: "2 cl · 3,90 €" },
      { name: "Prinz Himbeere", price: "2 cl · 3,90 €" },
      { name: "Ramazzotti", price: "4 cl · 4,50 €" },
      { name: "Limoncello", price: "4 cl · 5,70 €" },
    ],
  },
];
