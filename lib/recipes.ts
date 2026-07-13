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
  /** Illustratives Rezept-Bild (Unsplash) — kein Foto unseres eigenen Tellers. */
  image?: { src: string; alt: string };
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
    image: {
      src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1400&q=72",
      alt: "Cremiges Tiramisu im Glas",
    },
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
    image: {
      src: "https://images.unsplash.com/photo-1579705744772-f26014b5e084?auto=format&fit=crop&w=1400&q=72",
      alt: "Cremiger Knoblauch-Dip in einer Schale",
    },
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
    image: {
      src: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=1400&q=72",
      alt: "Glas Zitronen-Limonade mit Minze und Eis",
    },
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
    image: {
      src: "https://images.unsplash.com/photo-1559951585-645e730d3cf0?auto=format&fit=crop&w=1400&q=72",
      alt: "Knuspriges Granola in einer Schale",
    },
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
    image: {
      src: "https://images.unsplash.com/photo-1569762404472-026308ba6b64?auto=format&fit=crop&w=1400&q=72",
      alt: "Angeschnittenes saftiges Bananenbrot",
    },
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
  {
    slug: "hausgemachte-guacamole",
    title: "Hausgemachte Guacamole",
    teaser:
      "Cremig, frisch, mit Limette — so wie sie bei uns aufs Avocado-Brot kommt. In 10 Minuten selbst gemacht.",
    category: "Frühstück",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Unsere Guacamole machen wir frisch — sie landet auf „Morgenstund hat Avocado im Mund“ und als Dip zu den Pommes. So einfach geht sie zuhause; die genaue Würzung aus unserer Küche bleibt unser kleines Geheimnis, aber damit kommst du sehr nah ran.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "2 reife Avocados",
          "½ rote Zwiebel, fein gewürfelt",
          "1 kleine Tomate, entkernt und gewürfelt",
          "Saft von 1 Limette",
          "1 Knoblauchzehe, fein gerieben",
          "einige Blätter Koriander (optional)",
          "Salz, Pfeffer",
          "1 Prise Chili (optional)",
        ],
      },
    ],
    steps: [
      {
        title: "Avocados zerdrücken",
        body:
          "Das Fruchtfleisch der Avocados in eine Schüssel geben und mit der Gabel grob zerdrücken — ruhig ein paar Stückchen lassen.",
      },
      {
        title: "Limette zuerst",
        body:
          "Sofort den Limettensaft unterrühren. Das bringt Frische und hält die Guacamole schön grün.",
      },
      {
        title: "Unterheben",
        body:
          "Zwiebel, Tomate, Knoblauch und nach Geschmack Koriander unterheben.",
      },
      {
        title: "Abschmecken",
        body:
          "Mit Salz, Pfeffer und optional einer Prise Chili abschmecken. Am besten frisch servieren.",
      },
      {
        title: "Aufbewahren",
        body:
          "Rest mit Frischhaltefolie direkt auf der Oberfläche abdecken — so bleibt sie länger grün.",
      },
    ],
  },
  {
    slug: "french-toast",
    title: "French Toast mit Schmandcreme",
    teaser:
      "Goldbraunes Brioche mit Schmandcreme, Apfelkompott und Pistazien — unser süßer Frühstücksliebling für zuhause.",
    category: "Frühstück",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "„Da wird einem süß ums Herz“ heißt der French Toast auf unserer Brunch-Karte. So machst du die gemütliche Variante daheim — mit Schmandcreme, Apfelkompott und Pistazien.",
    ingredients: [
      {
        title: "French Toast",
        items: [
          "4 Scheiben Brioche oder Toastbrot (gern etwas altbacken)",
          "2 Eier",
          "150 ml Milch",
          "1 EL Zucker",
          "1 Prise Zimt",
          "Butter zum Braten",
        ],
      },
      {
        title: "Schmandcreme",
        items: ["200 g Schmand", "1–2 EL Puderzucker", "1 TL Vanille"],
      },
      {
        title: "Apfelkompott",
        items: [
          "2 Äpfel, gewürfelt",
          "1 EL Zucker",
          "1 Spritzer Zitrone",
          "etwas Wasser",
        ],
      },
      {
        title: "Zum Servieren",
        items: ["gehackte Pistazien", "Ahornsirup"],
      },
    ],
    steps: [
      {
        title: "Kompott kochen",
        body:
          "Apfelwürfel mit Zucker, Zitrone und einem Schuss Wasser 8–10 Minuten weich köcheln lassen.",
      },
      {
        title: "Creme rühren",
        body:
          "Schmand mit Puderzucker und Vanille glatt rühren, kühl stellen.",
      },
      {
        title: "Eiermilch",
        body: "Eier, Milch, Zucker und Zimt verquirlen.",
      },
      {
        title: "Braten",
        body:
          "Die Brotscheiben kurz durch die Eiermilch ziehen und in Butter bei mittlerer Hitze goldbraun braten.",
      },
      {
        title: "Anrichten",
        body:
          "Mit Schmandcreme, Apfelkompott und Pistazien anrichten, mit Ahornsirup beträufeln.",
      },
    ],
  },
  {
    slug: "erdbeer-basilikum-limonade",
    title: "Erdbeer-Basilikum-Limonade",
    teaser:
      "Fruchtig, mit einem Hauch Basilikum — eine unserer hausgemachten Sommerlimonaden von der Terrasse.",
    category: "Drinks",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Neben der klassischen Zitronenlimo gibt es bei uns Sorten wie Erdbeer-Basilikum. Schnell gemacht und schmeckt nach Sommer im Grünen.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "250 g Erdbeeren",
          "1 kleine Handvoll Basilikum",
          "60–80 g Zucker",
          "100 ml Wasser (für den Sirup)",
          "Saft von ½ Zitrone",
          "ca. 700 ml kaltes Wasser oder Sprudel",
          "Eiswürfel",
        ],
      },
    ],
    steps: [
      {
        title: "Basilikum-Sirup",
        body:
          "Zucker mit 100 ml Wasser aufkochen, den Basilikum kurz mitziehen lassen, abkühlen und die Blätter wieder herausnehmen.",
      },
      {
        title: "Erdbeeren pürieren",
        body:
          "Die Erdbeeren fein pürieren, für eine klare Limo optional durch ein Sieb streichen.",
      },
      {
        title: "Mischen",
        body:
          "Erdbeerpüree, Sirup, Zitronensaft und das kalte Wasser bzw. den Sprudel verrühren.",
      },
      {
        title: "Servieren",
        body:
          "Mit reichlich Eis, ein paar Erdbeerstücken und einem Basilikumblatt servieren.",
      },
    ],
  },
  {
    slug: "balsamico-zwiebeln",
    title: "Balsamico-Zwiebeln",
    teaser:
      "Süß-säuerlich eingekochte Zwiebeln — bei uns auf Burgern und Broten. Ein Vorrat, der vieles besser macht.",
    category: "Hauptgang",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Unsere Balsamico-Zwiebeln geben Burgern wie der „mähenden Moni“ und unseren Broten den Kick. Einmal gemacht, halten sie im Glas eine Weile.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "3 große rote Zwiebeln, in Streifen",
          "1 EL Öl oder Butter",
          "1 EL Zucker oder Honig",
          "3 EL Balsamico",
          "1 Prise Salz",
          "1 Zweig Thymian (optional)",
        ],
      },
    ],
    steps: [
      {
        title: "Schmoren",
        body:
          "Die Zwiebeln in Öl bei mittlerer Hitze 8–10 Minuten weich und glasig schmoren.",
      },
      {
        title: "Karamellisieren",
        body:
          "Zucker bzw. Honig zugeben und kurz leicht karamellisieren lassen.",
      },
      {
        title: "Ablöschen",
        body:
          "Mit Balsamico ablöschen und einköcheln lassen, bis es leicht sirupartig ist.",
      },
      {
        title: "Abschmecken",
        body:
          "Mit Salz und optional Thymian abschmecken. Schmeckt lauwarm wie kalt — im Glas hält sich der Rest gekühlt einige Tage.",
      },
    ],
  },
  {
    slug: "hausgemachte-burgersosse",
    title: "Hausgemachte Burgersoße",
    teaser:
      "Die cremige Soße, die unsere Burger zusammenhält — würzig, leicht süß, in 5 Minuten gerührt.",
    category: "Hauptgang",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Fast jeder unserer Burger — vom „klassischen Heinzi“ bis zur „gackernden Julia“ — bekommt unsere hausgemachte Burgersoße. Das ist eine unkomplizierte Version für zuhause.",
    ingredients: [
      {
        title: "Zutaten",
        items: [
          "4 EL Mayonnaise",
          "2 EL Ketchup",
          "1 TL mittelscharfer Senf",
          "1 Gewürzgurke, fein gehackt",
          "1 TL Gurkenwasser",
          "1 Prise Zucker",
          "1 Prise Paprikapulver",
          "Salz, Pfeffer",
        ],
      },
    ],
    steps: [
      {
        title: "Basis rühren",
        body: "Mayonnaise, Ketchup und Senf glatt verrühren.",
      },
      {
        title: "Würzen",
        body:
          "Gewürzgurke und Gurkenwasser unterheben, mit Zucker, Paprika, Salz und Pfeffer abschmecken.",
      },
      {
        title: "Ziehen lassen",
        body:
          "15 Minuten ziehen lassen — dann rundet sich der Geschmack ab. Gekühlt hält sie einige Tage.",
      },
    ],
  },
  {
    slug: "chia-fruehstuecksbowl",
    title: "Chia-Frühstücksbowl",
    teaser:
      "Chia, Kokosmilch und Früchte — die Basis unserer „Schmusi“-Bowls, über Nacht angerührt.",
    category: "Frühstück",
    hasFullRecipe: true,
    publishedAt: null,
    intro:
      "Unsere „Schmusi“-Bowls wie das Wiesenschmuserl starten mit Chia in Kokosmilch. So machst du die Basis zuhause und toppst sie ganz nach Lust.",
    ingredients: [
      {
        title: "Basis",
        items: [
          "3 EL Chiasamen",
          "200 ml Kokosmilch (Drink)",
          "1 TL Ahornsirup oder Honig",
          "½ Banane, zerdrückt",
        ],
      },
      {
        title: "Toppings",
        items: [
          "frische Beeren oder Mango",
          "Kokosflocken",
          "hausgemachtes Granola",
        ],
      },
    ],
    steps: [
      {
        title: "Anrühren",
        body:
          "Chiasamen mit Kokosmilch, Ahornsirup und der zerdrückten Banane verrühren.",
      },
      {
        title: "Nachrühren",
        body:
          "5 Minuten warten und nochmal kräftig rühren — so gibt es keine Klümpchen.",
      },
      {
        title: "Quellen lassen",
        body:
          "Über Nacht (oder mindestens 2 Stunden) im Kühlschrank quellen lassen.",
      },
      {
        title: "Toppen",
        body:
          "Vor dem Servieren mit Früchten, Kokosflocken und Granola toppen.",
      },
    ],
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}
