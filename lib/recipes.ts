/**
 * Rezept-Daten. Inhalte vom User bestätigt 2026-05-22.
 * Wenn weitere Rezepte kommen, hier ergänzen.
 */

export type RecipeIngredientGroup = {
  title: string;
  items: string[];
};

export type RecipeStep = {
  title: string;
  body: string;
};

export type Recipe = {
  slug: string;
  title: string;
  teaser: string;
  category: "Frühstück" | "Hauptgang" | "Dessert" | "Drinks";
  hasFullRecipe: boolean;
  /** Optionales Badge, z. B. „Kundenliebling". */
  badge?: string;
  /** Datum nur falls Veröffentlichungszeitpunkt bekannt — sonst null. */
  publishedAt: string | null;
  /** Volltext-Story/Einleitung über dem Rezept. */
  intro?: string;
  /** Optionale Zutaten-Gruppen — Headline + Items. */
  ingredients?: RecipeIngredientGroup[];
  /** Schritt-für-Schritt-Anleitung. */
  steps?: RecipeStep[];
  /** Autor/in mit Quote für den Schlussabschnitt. */
  author?: {
    name: string;
    role: string;
    quote: string;
  };
};

export const RECIPES: Recipe[] = [
  {
    slug: "pistazientiramisu",
    title: "Pistazien-Tiramisu zum Verlieben",
    teaser:
      "Unser Klassiker — schon über 1.500 Mal verkauft. Tanjas Version für deine eigene Küche.",
    category: "Dessert",
    badge: "Kundenliebling",
    hasFullRecipe: true,
    publishedAt: "2026-05-22",
    intro:
      "Dieses Rezept ist unsere Version für Zuhause und soll dir die Möglichkeit geben, unser Pistazien-Tiramisu ganz einfach nachzumachen. Das Originalrezept aus unserer Küche bleibt natürlich ein kleines Geheimnis — deshalb haben wir die Zutaten und Mengen leicht angepasst. So bekommst du trotzdem ein wunderbar cremiges Dessert, das an unser Tiramisu erinnert und sich perfekt für deine eigene Küche eignet.",
    ingredients: [
      {
        title: "Für die Creme",
        items: [
          "200 g Mascarpone",
          "150 g Frischkäse",
          "60 g Zucker",
          "120 g Pistaziencreme",
          "100 ml Sahne",
          "1–2 TL Kürbiskernöl (für Farbe und leichte Nussnote)",
        ],
      },
      {
        title: "Zum Tränken",
        items: ["ca. 150 ml Milch"],
      },
      {
        title: "Außerdem",
        items: ["ca. 12–14 Löffelbiskuits"],
      },
      {
        title: "Optional zum Garnieren",
        items: [
          "gehackte Pistazien",
          "etwas Pistaziencreme",
          "ein paar Tropfen Kürbiskernöl",
          "Puderzucker",
        ],
      },
    ],
    steps: [
      {
        title: "Creme vorbereiten",
        body:
          "Mascarpone, Frischkäse und Zucker in einer Schüssel glatt rühren. Die Pistaziencreme unterheben. Anschließend das Kürbiskernöl hinzufügen — es sorgt für eine intensivere Farbe und ein leicht nussiges Aroma. Die Sahne separat leicht aufschlagen und vorsichtig unter die Masse heben.",
      },
      {
        title: "Biskuits vorbereiten",
        body:
          "Die Milch in eine flache Schale geben. Die Löffelbiskuits kurz eintauchen, sodass sie leicht durchtränkt sind, aber noch stabil bleiben.",
      },
      {
        title: "Schichten",
        body:
          "Eine kleine Auflaufform oder Dessertgläser mit einer Lage Biskuits auslegen. Darauf eine Schicht Pistaziencreme verteilen. Danach wieder Biskuits und Creme schichten, bis alle Zutaten aufgebraucht sind. Mit einer Cremeschicht abschließen.",
      },
      {
        title: "Kühlen",
        body:
          "Das Tiramisu mindestens 3–4 Stunden im Kühlschrank durchziehen lassen, damit sich die Aromen verbinden und die Creme schön fest wird.",
      },
      {
        title: "Serviertipp",
        body:
          "Vor dem Servieren mit gehackten Pistazien dekorieren und optional ein paar Tropfen Kürbiskernöl darübergeben. Das sorgt für einen schönen Farbkontrast und eine feine nussige Note.",
      },
    ],
    author: {
      name: "Tanja Leber",
      role: "Patissière",
      quote:
        "Ein Dessert ist für mich mehr als nur ein süßer Abschluss — es ist ein Moment der Freude, der den Gästen ein Lächeln ins Gesicht zaubern soll.",
    },
  },
  {
    slug: "hausgemachte-aioli",
    title: "Hausgemachte Aioli wie bei uns",
    teaser:
      "Der Liebling zu unseren Pommes — cremig und knoblauchig. Unsere Version für deine Küche.",
    category: "Hauptgang",
    badge: "Gäste-Liebling",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Unsere Aioli bekommt von euch das meiste Lob — kein Wunder, frisch gemacht schmeckt sie einfach besser als gekauft. Das ist unsere unkomplizierte Version für Zuhause; die genaue Würzung aus unserer Küche bleibt unser kleines Geheimnis, aber damit kommst du sehr nah ran. Tipp: ganz frische Eier verwenden.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "1 Eigelb (zimmerwarm)",
          "1 TL mittelscharfer Senf",
          "1–2 Knoblauchzehen, fein gerieben",
          "ca. 150 ml neutrales Öl",
          "1 TL Zitronensaft",
          "Salz, Pfeffer",
          "optional: 1 Prise Zucker",
        ],
      },
    ],
    steps: [
      {
        title: "Basis verrühren",
        body:
          "Eigelb, Senf und Knoblauch in einem hohen Gefäß glatt verrühren.",
      },
      {
        title: "Emulgieren",
        body:
          "Das Öl zuerst tröpfchenweise, dann in dünnem Strahl unterrühren (Stabmixer oder Schneebesen), bis eine dicke, cremige Masse entsteht.",
      },
      {
        title: "Abschmecken",
        body:
          "Mit Zitronensaft, Salz, Pfeffer und nach Geschmack einer Prise Zucker abschmecken.",
      },
      {
        title: "Ziehen lassen",
        body:
          "Mindestens 30 Minuten kühl stellen — dann schmeckt der Knoblauch runder.",
      },
    ],
  },
  {
    slug: "hausgemachte-zitronenlimonade",
    title: "Hausgemachte Zitronen-Limonade",
    teaser:
      "Spritzig, nicht zu süß — wie bei uns auf der Terrasse. In Minuten selbst gemacht.",
    category: "Drinks",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Hausgemachte Limonade gehört bei uns zum Sommer auf der Terrasse dazu. So machst du sie zuhause — Süße und Säure ganz nach deinem Geschmack.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "4–5 Bio-Zitronen (Saft, ca. 150 ml)",
          "80–100 g Zucker",
          "100 ml Wasser (für den Sirup)",
          "ca. 700 ml kaltes Wasser oder Sprudel",
          "frische Minze",
          "Eiswürfel",
        ],
      },
    ],
    steps: [
      {
        title: "Sirup kochen",
        body:
          "Zucker mit 100 ml Wasser aufkochen, bis er sich löst. Vom Herd nehmen und abkühlen lassen.",
      },
      {
        title: "Mischen",
        body:
          "Zitronensaft, Sirup und das kalte Wasser bzw. den Sprudel verrühren.",
      },
      {
        title: "Abschmecken",
        body: "Nach Geschmack mehr Sirup oder Zitrone zugeben.",
      },
      {
        title: "Servieren",
        body: "Mit reichlich Eis und frischer Minze servieren.",
      },
    ],
  },
  {
    slug: "knuspriges-granola",
    title: "Knuspriges Granola fürs Frühstück",
    teaser:
      "Die Basis für unsere Frühstücks-Bowls — einmal gemacht, lange Vorrat.",
    category: "Frühstück",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Bei uns kommt das Granola fürs Frühstück selbst aus dem Ofen. Das Schöne: einmal gemacht, hast du wochenlang etwas davon. Hier unsere Variante für Zuhause — Nüsse und Süße passt du einfach an.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "300 g zarte Haferflocken",
          "100 g gehackte Nüsse (z. B. Mandeln, Walnüsse)",
          "50 g Kerne (Sonnenblumen- oder Kürbiskerne)",
          "4 EL Honig oder Ahornsirup (vegan)",
          "3 EL neutrales Öl",
          "1 TL Zimt",
          "1 Prise Salz",
          "optional: getrocknete Früchte",
        ],
      },
    ],
    steps: [
      {
        title: "Vorheizen",
        body: "Den Ofen auf 160 °C Umluft vorheizen.",
      },
      {
        title: "Mischen",
        body:
          "Hafer, Nüsse, Kerne, Zimt und Salz vermengen. Honig bzw. Sirup und Öl untermischen, bis alles leicht glänzt.",
      },
      {
        title: "Backen",
        body:
          "Auf einem Blech 20–25 Minuten backen, alle 8–10 Minuten wenden, bis es goldbraun ist.",
      },
      {
        title: "Auskühlen",
        body:
          "Vollständig auskühlen lassen — erst dann wird's knusprig. Bei Bedarf getrocknete Früchte unterrühren.",
      },
      {
        title: "Aufbewahren",
        body: "Luftdicht verschlossen hält das Granola mehrere Wochen.",
      },
    ],
  },
  {
    slug: "saftiges-bananenbrot",
    title: "Saftiges Bananenbrot",
    teaser:
      "Perfekt für reife Bananen — saftig und einfach. Zum Frühstück und zum Kaffee.",
    category: "Frühstück",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Bananenbrot ist bei uns die Rettung für reife Bananen — und ein Liebling auf dem Frühstückstisch. Unkompliziert und gelingsicher; hier unsere Version für Zuhause.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "3 reife Bananen",
          "2 Eier",
          "80 g Zucker (gern brauner Zucker)",
          "80 g neutrales Öl oder geschmolzene Butter",
          "200 g Mehl",
          "1 TL Backpulver",
          "1 Prise Salz",
          "optional: Walnüsse oder Schokostückchen",
        ],
      },
    ],
    steps: [
      {
        title: "Vorbereiten",
        body: "Ofen auf 175 °C vorheizen, eine Kastenform einfetten.",
      },
      {
        title: "Bananen zerdrücken",
        body: "Die Bananen mit einer Gabel fein zerdrücken.",
      },
      {
        title: "Teig rühren",
        body:
          "Eier, Zucker und Öl verrühren, die Bananen unterrühren. Mehl, Backpulver und Salz unterheben — nicht zu lange rühren. Optional Nüsse oder Schoko zugeben.",
      },
      {
        title: "Backen",
        body:
          "In die Form füllen und ca. 50–55 Minuten backen (Stäbchenprobe).",
      },
      {
        title: "Auskühlen",
        body: "Vor dem Anschneiden auskühlen lassen.",
      },
    ],
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}
