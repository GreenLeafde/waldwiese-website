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
];

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}
