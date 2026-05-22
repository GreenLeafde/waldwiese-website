/**
 * Getränkekarte — übernommen aus Speisekarte-WW.pdf, Stand 2026-05-21.
 *
 * Format: einzelner Preis oder Array für Größenvarianten (z. B. „0,33 · 3,90 €").
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
    hint: "auch entkoffeiniert · mit Hafermilch oder laktosefrei · Sirup (Vanille, Macadamia, Karamell) nur +1 €",
    items: [
      { name: "Tasse Kaffee", price: "3,40 €" },
      { name: "Latte Macchiato", price: "4,90 €" },
      { name: "Cappuccino", price: "4,20 €" },
      { name: "Espresso", price: "2,50 €" },
      { name: "Doppelter Espresso", price: "3,50 €" },
      { name: "Espresso Macchiato", price: "3,20 €" },
      { name: "Matcha Latte", price: "4,90 €" },
      { name: "Chai Latte", price: "4,90 €" },
      { name: "Heiße Schokolade", desc: "Weiß & Dunkel", price: "3,50 €" },
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
      { name: "Coca Cola", price: ["0,33 · 3,90 €", "0,50 · 4,90 €"] },
      { name: "Coca Cola Zero", price: ["0,33 · 3,90 €", "0,50 · 4,90 €"] },
      { name: "Sprite", price: ["0,33 · 3,90 €", "0,50 · 4,90 €"] },
      { name: "Mezzo Mix", price: ["0,33 · 3,90 €", "0,50 · 4,90 €"] },
      { name: "RedBull", price: "0,25 · 3,90 €" },
      { name: "Now Fresh Lemon", price: "0,33 · 3,90 €" },
      { name: "Now Sunny Orange", price: "0,33 · 3,90 €" },
      { name: "Now Holler Blüte", price: "0,33 · 3,90 €" },
      {
        name: "Bio Kristall Wasser Medium",
        price: ["0,33 · 3,90 €", "0,75 · 6,90 €"],
        tags: ["bio"],
      },
      {
        name: "Bio Kristall Wasser Still",
        price: ["0,33 · 3,90 €", "0,75 · 6,90 €"],
        tags: ["bio"],
      },
    ],
  },
  {
    slug: "schorle",
    title: "Schorle",
    items: [
      { name: "Now Apfel", price: "0,50 · 4,90 €" },
      { name: "Now Rhabarber", price: "0,50 · 4,90 €" },
      { name: "Maracuja", price: "0,50 · 4,90 €" },
      { name: "Now Cassis-Lime", price: "0,50 · 4,90 €" },
    ],
  },
  {
    slug: "limonade",
    title: "Homemade Limonade",
    hint: "hausgemacht",
    items: [
      { name: "Erdbeer-Basilikum", price: "0,50 · 5,60 €", tags: ["hausgemacht"] },
      {
        name: "Granatapfel-Rosmarin",
        price: "0,50 · 5,60 €",
        tags: ["hausgemacht"],
      },
      { name: "Gurke-Basilikum", price: "0,50 · 5,60 €", tags: ["hausgemacht"] },
      {
        name: "Grapefruit-Hibiskus",
        price: "0,50 · 5,60 €",
        tags: ["hausgemacht"],
      },
    ],
  },
  {
    slug: "bier",
    title: "Bier",
    items: [
      { name: "Pils", price: ["0,33 · 3,90 €", "0,50 · 4,90 €"] },
      { name: "Helles", price: "0,50 · 3,90 €" },
      {
        name: "Helles alkoholfrei",
        price: "0,50 · 4,90 €",
        tags: ["alkoholfrei"],
      },
      { name: "Weizen", price: "0,50 · 4,90 €" },
      {
        name: "Dunkles Weizen alkoholfrei",
        price: ["0,33 · 3,90 €", "0,50 · 3,90 €"],
        tags: ["alkoholfrei"],
      },
      { name: "Dunkles Weizen", price: "0,33 · 3,90 €" },
      { name: "Dunkles Radler alkoholfrei", price: "0,33 · 3,90 €", tags: ["alkoholfrei"] },
      { name: "Natur Radler", price: "0,50 · 4,90 €" },
      { name: "Natur Radler alkoholfrei", price: "0,50 · 4,90 €", tags: ["alkoholfrei"] },
    ],
  },
  {
    slug: "spritz",
    title: "Spritz",
    hint: "Auf Wunsch auch alkoholfrei!",
    items: [
      { name: "Aperol", price: "8,50 €" },
      { name: "Limoncello", price: "8,50 €" },
      { name: "Sarti", price: "8,50 €" },
      { name: "Campari", price: "8,50 €" },
      { name: "Hugo", price: "8,50 €" },
      { name: "Wildberry Lillet", price: "8,50 €" },
    ],
  },
  {
    slug: "cocktails",
    title: "Cocktails",
    items: [
      { name: "Espresso Martini", price: "10,90 €" },
      { name: "Moscow Mule", price: "10,90 €" },
      { name: "Ginger Nut", price: "10,90 €" },
      { name: "Pink Negroni", price: "10,90 €" },
      { name: "Skinny B*tch", price: "10,90 €" },
      { name: "Aperol Collins", price: "10,90 €" },
    ],
  },
  {
    slug: "longdrinks",
    title: "Longdrinks",
    items: [
      { name: "Wodka RedBull", price: "9,90 €" },
      { name: "Havanna Cola 7 Jahre", price: "10,90 €" },
      {
        name: "Gin Tonic",
        desc: "auch alkoholfrei",
        price: "9,90 €",
      },
      { name: "Jack Daniels Whiskey Cola", price: "9,90 €" },
    ],
  },
  {
    slug: "moonshine",
    title: "Moonshine Liköre",
    items: [
      { name: "Harte Nuss", price: "4 cl · 5,90 €" },
      { name: "Granatapfel", price: "4 cl · 5,90 €" },
      { name: "Toffee", price: "4 cl · 5,90 €" },
    ],
  },
  {
    slug: "schnaeps",
    title: "Schnäpse",
    items: [
      { name: "Prinz Birne", price: ["2 cl · 2,90 €", "4 cl · 5,70 €"] },
      { name: "Prinz Himbeere", price: ["2 cl · 2,90 €", "4 cl · 5,70 €"] },
      { name: "Ramazotti", price: ["2 cl · 2,90 €", "4 cl · 5,70 €"] },
      { name: "Jägermeister", price: ["2 cl · 2,90 €", "4 cl · 5,70 €"] },
      { name: "Whisky", price: ["2 cl · 2,90 €", "4 cl · 5,70 €"] },
      { name: "Limoncello", price: ["2 cl · 2,90 €", "4 cl · 5,70 €"] },
      { name: "Jack Daniels Whiskey", price: ["2 cl · 2,90 €", "4 cl · 5,70 €"] },
    ],
  },
  {
    slug: "flaschenweine-rot",
    title: "Flaschenweine · Rot",
    items: [
      {
        name: "Primitivo Integro",
        desc: "BIO · The Wine People · Apulien",
        price: "29,50 €",
        tags: ["bio"],
      },
      {
        name: "Cabernet Franc",
        desc: "Weingut Schmitt · Rheinhessen",
        price: "30,00 €",
      },
    ],
  },
  {
    slug: "flaschenweine-weiss",
    title: "Flaschenweine · Weiß",
    items: [
      {
        name: "Connoisseur Cuvée",
        desc: "Domaine de Menard · Cotes de Gascogne",
        price: "24,00 €",
      },
      {
        name: "Chardonnay",
        desc: "BIO · vegan · Bioweingut Heber · Rheinhessen",
        price: "28,00 €",
        tags: ["bio", "vegan"],
      },
      {
        name: "Grauer Burgunder",
        desc: "Weingut Schmitt · Rheinhessen",
        price: "30,00 €",
      },
    ],
  },
  {
    slug: "offene-rot",
    title: "Offene Weine · Rot",
    items: [
      {
        name: "Zweigelt",
        desc: "Qualitätswein · Weingut Norbert Bauer · Weinviertel",
        price: ["0,1 · 2,90 €", "0,2 · 5,50 €"],
      },
      {
        name: "Merlot delle Venezia",
        desc: "Gino Risotto · Friaul",
        price: ["0,1 · 3,50 €", "0,2 · 6,50 €"],
      },
    ],
  },
  {
    slug: "offene-weiss",
    title: "Offene Weine · Weiß",
    items: [
      {
        name: "Grüner Veltliner",
        desc: "Qualitätswein · Respizhof Külbl · Weinviertel",
        price: ["0,1 · 2,90 €", "0,2 · 5,50 €"],
      },
      {
        name: "Riesling, Forster Stift",
        desc: "Weingut Lucashof · Pfalz · BIO",
        price: ["0,1 · 3,00 €", "0,2 · 5,80 €"],
        tags: ["bio"],
      },
      {
        name: "Connoisseur Cuvée",
        desc: "Domaine de Menard · Cotes de Gascogne",
        price: ["0,1 · 3,50 €", "0,2 · 6,50 €"],
      },
    ],
  },
  {
    slug: "rose",
    title: "Offene Weine · Rosé",
    items: [
      {
        name: "Forster Rosé",
        desc: "halbtrocken · Weingut Lucashof · Pfalz · BIO",
        price: ["0,1 · 2,90 €", "0,2 · 5,50 €"],
        tags: ["bio"],
      },
    ],
  },
  {
    slug: "schaumwein",
    title: "Schaumweine",
    items: [
      {
        name: "Prosecco Onbrina Frizzante",
        desc: "Treviso DOC · Prosecco Onbrina · Venetien",
        price: ["0,75 · 24,00 €", "0,1 · 3,50 €", "0,2 · 6,50 €"],
      },
      {
        name: "2021 Cuvée Vaux, brut",
        desc: "Sektmanufaktur Schloss Vaux · Rheingau",
        price: "0,75 · 49,00 €",
      },
      {
        name: "Ohlig Zero",
        desc: "alkoholfrei · Sektkellerei Ohlig · Rheingau",
        price: "0,75 · 30,00 €",
        tags: ["alkoholfrei"],
      },
    ],
  },
];
