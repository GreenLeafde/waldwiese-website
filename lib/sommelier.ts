/**
 * Frühstücks-Sommelier — kleiner „Concierge": ein paar Grundfragen, am Ende
 * eine Empfehlung + ein Tisch (Personenzahl & Uhrzeit). Regelbasiert, keine KI.
 *
 * WICHTIG:
 * - Alle Empfehlungen (Frühstück wie Abend) kommen aus den ÖFFENTLICHEN Karten
 *   (menu.ts / dinner-menu.ts / drinks.ts), damit Namen und Preise immer
 *   synchron mit der Speisekarte bleiben. Nichts hart hier verdrahten.
 */

import { BREAKFAST_MENU } from "./menu";
import { DINNER_MENU } from "./dinner-menu";
import { DRINK_CATEGORIES } from "./drinks";

export type Anlass = "fruehstueck" | "abend";

export const ANLASS_OPTIONS: { key: Anlass; label: string; sub: string }[] = [
  { key: "fruehstueck", label: "Zum Frühstück", sub: "Vormittags, mitten im Grünen" },
  { key: "abend", label: "Abends am Wochenende", sub: "Fr – So, Burger, Bowls & vom Grill" },
];

export const GESCHMACK_OPTIONS: Record<
  Anlass,
  { key: string; label: string }[]
> = {
  fruehstueck: [
    { key: "suess", label: "Eher süß" },
    { key: "herzhaft", label: "Eher herzhaft" },
    { key: "beides", label: "Von allem etwas" },
  ],
  abend: [
    { key: "herzhaft", label: "Herzhaft & deftig" },
    { key: "pflanzlich", label: "Leicht & pflanzlich" },
    { key: "fisch", label: "Fisch" },
    { key: "suess", label: "Süßer Ausklang" },
  ],
};

/** Personenzahl-Auswahl. 8 steht für „8 oder mehr". */
export const PERSONEN_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const ZEIT_OPTIONS: Record<Anlass, string[]> = {
  fruehstueck: ["08:00", "09:00", "10:00", "11:00", "12:00"],
  abend: ["17:30", "18:30", "19:30", "20:30"],
};

export type Pick = { name: string; desc: string; price: string };

function findDish(name: string): Pick | null {
  for (const cat of DINNER_MENU) {
    const d = cat.items.find((i) => i.name === name);
    if (d)
      return {
        name: d.name,
        desc: d.desc ?? "",
        price: Array.isArray(d.price) ? d.price[0] : d.price,
      };
  }
  return null;
}

function findBreakfastDish(name: string): Pick | null {
  for (const cat of BREAKFAST_MENU) {
    const d = cat.items.find((i) => i.name === name);
    if (d)
      return {
        name: d.name,
        desc: d.desc ?? "",
        price: Array.isArray(d.price) ? d.price[0] : d.price,
      };
  }
  return null;
}

function findDrink(name: string): Pick | null {
  for (const cat of DRINK_CATEGORIES) {
    const d = cat.items.find((i) => i.name === name);
    if (d)
      return {
        name: d.name,
        desc: d.desc ?? "",
        price: Array.isArray(d.price) ? d.price[d.price.length - 1] : d.price,
      };
  }
  return null;
}

export type Empfehlung = {
  intro: string;
  dish: Pick | null;
  drink: Pick | null;
};

/** Echte Frühstücks-Empfehlungen (aus der öffentlichen Brunch-Karte). */
const FRUEHSTUECK: Record<string, { intro: string; dishName: string; drinkName: string }> = {
  suess: {
    intro: "Wenn der Morgen süß sein darf:",
    dishName: "Die süße Mizzi",
    drinkName: "Chai Latte",
  },
  herzhaft: {
    intro: "Herzhaft in den Tag starten:",
    dishName: "Morgenstund hat Avocado im Mund",
    drinkName: "Cappuccino",
  },
  beides: {
    intro: "Von allem etwas — unser großes Frühstück zum Teilen:",
    dishName: "Der gute alte Sepp",
    drinkName: "Latte Macchiato",
  },
};

/** Echte Abend-Empfehlungen (alle aus der öffentlichen Karte). */
const ABEND: Record<string, { intro: string; dishName: string; drinkName: string }> = {
  herzhaft: {
    intro: "Wenn's herzhaft sein darf, führt für uns kein Weg dran vorbei:",
    dishName: "Die mähende Moni",
    drinkName: "Hugo",
  },
  pflanzlich: {
    intro: "Leicht, frisch und komplett pflanzlich:",
    dishName: "Prinzessin auf der Kichererbse",
    drinkName: "Gurke-Basilikum",
  },
  fisch: {
    intro: "Für Fisch-Fans unser Klassiker am Abend:",
    dishName: "Teriyaki-Lachs",
    drinkName: "Riesling, Forster Stift",
  },
  suess: {
    intro: "Und zum Schluss das, wofür man uns kennt:",
    dishName: "Pistazientiramisu",
    drinkName: "Espresso Martini",
  },
};

export function getEmpfehlung(anlass: Anlass, geschmack: string): Empfehlung {
  if (anlass === "fruehstueck") {
    const e = FRUEHSTUECK[geschmack] ?? FRUEHSTUECK.beides;
    return {
      intro: e.intro,
      dish: findBreakfastDish(e.dishName),
      drink: findDrink(e.drinkName),
    };
  }
  const e = ABEND[geschmack] ?? ABEND.herzhaft;
  return {
    intro: e.intro,
    dish: findDish(e.dishName),
    drink: findDrink(e.drinkName),
  };
}

/** Lesbare Zusammenfassung für den Tisch. */
export function personenLabel(n: number): string {
  if (n >= 8) return "8+ Personen";
  if (n === 1) return "1 Person";
  return `${n} Personen`;
}
