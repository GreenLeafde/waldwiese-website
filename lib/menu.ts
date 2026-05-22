/**
 * Frühstückskarte — übernommen aus den Speisekarten-Entwürfen
 * (Brunch-Karte · 2026, Familie Leber), Stand 2026-05-21.
 *
 * Preise stehen in den Originalen als „—,— / —,—" → Platzhalter.
 * Sobald Familie Leber die Preise liefert, hier eintragen. Die zweite Preisspalte
 * ist unklar (Solo/zu zweit? klein/groß?) — siehe Platzhalter-Hinweis im UI.
 */

export type BreakfastDish = {
  name: string;
  desc: string;
  /** Hauptpreis. `null` = noch offen. */
  priceA: string | null;
  /** Optionaler Zweitpreis (z. B. „zu zweit"). `null` = nicht definiert oder offen. */
  priceB: string | null;
  /** Optionale Zusätze, in den Original-Karten in Tonwarm hervorgehoben. */
  options?: Array<{ label: string; price: string | null }>;
  tags?: Array<"vegan" | "vegetarisch" | "regional">;
};

export type BreakfastCategory = {
  slug: string;
  title: string;
  items: BreakfastDish[];
};

export const BREAKFAST_MENU: BreakfastCategory[] = [
  {
    slug: "fruehstuecke",
    title: "Frühstück",
    items: [
      {
        name: "Der gute alte Sepp",
        desc:
          "Butter, Käse- und Wurstaufschnitt, hausgemachte Marmelade, hausgemachtes Rührei, Naturjoghurt mit hausgemachtem Granola, frisches Obst und Gemüse, Brotkorb — nur für dich oder zu zweit",
        priceA: null,
        priceB: null,
      },
      {
        name: "Die grüne Gretl",
        desc:
          "vegane Butter, veganer Käse von Vemondo, Sojajoghurt, hausgemachtes Granola, hausgemachte Aufstriche (Marmelade, Tomatenaufstrich, Hummus), hausgemachtes Antipasti, hausgemachtes Bananenbrot, frisches Obst und Gemüse, Brotkorb",
        priceA: null,
        priceB: null,
        tags: ["vegan"],
      },
      {
        name: "Die süße Mizzi",
        desc:
          "Butter, hausgemachte Marmelade, Nutella, Naturjoghurt, hausgemachtes Granola, Croissant, frisches Obst",
        priceA: null,
        priceB: null,
        tags: ["vegetarisch"],
      },
      {
        name: "Der kleine Hansi",
        desc:
          "Butter, Nutella, Fruchtzwerg, frisches und saisonales Obst aus Sinzing, Semmel",
        priceA: null,
        priceB: null,
        tags: ["regional"],
      },
    ],
  },
  {
    slug: "brote",
    title: "Brote",
    items: [
      {
        name: "Morgenstund hat Gold im Mund",
        desc:
          "geröstetes Brot vom Bäcker aus der Region, hausgemachte Guacamole, Spiegelei, Rucola, hausgemachte Zitronenmayo, Sprossen, hausgemachte Teriyaki-Soße, Sesam, dazu selbst eingelegte Zwiebeln",
        priceA: null,
        priceB: null,
        options: [{ label: "Optional Räucherlachs", price: null }],
      },
      {
        name: "Aller Anfang ist grün",
        desc:
          "geröstetes Brot vom Bäcker aus der Region, gegrilltes Gemüse, Chiliöl, hausgemachter mediterraner Karotten-Tomaten-Hummus, Babyspinat, Balsamicocreme, frittierte Kapern",
        priceA: null,
        priceB: null,
        options: [
          { label: "Optional Burrata", price: null },
          { label: "oder veganer Schafskäse", price: null },
        ],
        tags: ["vegetarisch"],
      },
      {
        name: "Wer das Pesto nicht ehrt, ist den Parma nicht wert",
        desc:
          "geröstetes Brot vom Bäcker aus der Region, Parmaschinken, Parmesan, sonnengetrocknete Tomaten, Rucola, hausgemachte Balsamicozwiebeln, hausgemachtes Zitronenöl, hausgemachter Pesto-Frischkäse-Aufstrich, selbst eingelegte mixed Pickles",
        priceA: null,
        priceB: null,
      },
      {
        name: "Da wird einem süß ums Herz",
        desc:
          "French Toast mit hausgemachter Schmandcreme, hausgemachtes Apfelkompott, Pistazien, Ahornsirup",
        priceA: null,
        priceB: null,
        tags: ["vegetarisch"],
      },
    ],
  },
];

export const BREAKFAST_WELCOME = {
  headline: "Schön, dass du da bist!",
  body: [
    "Heute starten wir mit Frühstücken und Broten — Bowls und Extras folgen, wenn wir richtig loslegen.",
    "Wir bemühen uns, dass jeder kriegt, was er möchte. Da das ein Testlauf ist, sind manche Zutaten begrenzt — sagt uns einfach Bescheid, wir geben unser Bestes.",
  ],
  signoff: ["Genießt den Morgen,", "Eure Familie Leber"],
} as const;
