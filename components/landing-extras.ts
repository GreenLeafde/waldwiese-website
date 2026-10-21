import type { DayStage, Tone } from "@/components/day-section";
import { DINNER_MENU, type Dish } from "@/lib/dinner-menu";
import { BREAKFAST_MENU, type BreakfastDish } from "@/lib/menu";
import type { ReserveSlot } from "@/lib/reservation";

/**
 * Voreinstellungen je Landingpage-Pfad: Ton (hell = Brunch/Orte, dunkel =
 * Abend/Burger/Feiern), welcher Karten-Auszug gezeigt wird und welchen Slot
 * der Reservieren-Knopf vorwählt. Zentral, damit die 20 Seiten nicht einzeln
 * gepflegt werden müssen; eine Seite kann per Prop trotzdem abweichen.
 */
export type LandingPreset = {
  tone: Tone;
  dishes: Array<BreakfastDish | Dish>;
  dishesTitle?: string;
  slot?: ReserveSlot;
};

function pick<T extends { name: string }>(menu: Array<{ items: T[] }>, names: string[]): T[] {
  const all = menu.flatMap((c) => c.items);
  return names.map((n) => all.find((d) => d.name === n)).filter((d): d is T => Boolean(d));
}

const BRUNCH = pick<BreakfastDish>(BREAKFAST_MENU, [
  "Der gute alte Sepp",
  "Die grüne Gretl",
  "Morgenstund hat Avocado im Mund",
  "Wiesenschmuserl",
]);
const VEGAN = pick<BreakfastDish>(BREAKFAST_MENU, [
  "Die grüne Gretl",
  "Aller Anfang ist grün",
  "Beerenherzerl",
  "Wiesenschmuserl",
]);
const ABEND = pick<Dish>(DINNER_MENU, [
  "Der klassische Heinzi",
  "Die mähende Moni",
  "Spare Ribs",
  "Steak aus der Rinderhüfte",
]);
const BURGER = pick<Dish>(DINNER_MENU, [
  "Der klassische Heinzi",
  "Die gackernde Julia",
  "Die mähende Moni",
  "Der fetzige Sven",
  "Dorfbazi",
]);
const VEGGIE = pick<Dish>(DINNER_MENU, [
  "Die mähende Moni",
  "Gegrillte Gemüsepfanne",
  "Des Kaisers neue Schüssel",
]);

export function landingPreset(path: string): LandingPreset {
  if (path.includes("abendessen")) {
    return { tone: "dunkel", dishes: ABEND, dishesTitle: "Aus der Abendkarte", slot: "abend" };
  }
  if (path.includes("burger")) {
    return { tone: "dunkel", dishes: BURGER, dishesTitle: "Unsere Burger", slot: "abend" };
  }
  if (path.includes("vegan")) {
    return { tone: "hell", dishes: VEGAN, dishesTitle: "Vegan aus der Brunch-Karte", slot: "brunch" };
  }
  if (path.includes("vegetarisch")) {
    return { tone: "hell", dishes: [...VEGAN.slice(0, 2), ...VEGGIE], dishesTitle: "Vegetarisch bei uns", slot: "brunch" };
  }
  if (path.includes("brunch") || path.includes("fruehstueck")) {
    return { tone: "hell", dishes: BRUNCH, dishesTitle: "Aus der Brunch-Karte", slot: "brunch" };
  }
  // Orte, Biergarten, Hundefreundlich, Restaurant-Seiten: hell, Brunch zuerst
  return { tone: "hell", dishes: BRUNCH, dishesTitle: "Aus der Karte", slot: "brunch" };
}

/** Tagesstufen je Ton für die sechs Sektionen des Templates. */
export const LANDING_STAGES: Record<Tone, DayStage[]> = {
  hell: ["morgen", "morgen-2", "vormittag", "mittag", "vormittag", "morgen-2", "mittag"],
  dunkel: ["tanne", "abend", "wald", "wald-2", "wald", "tanne", "nacht"],
};
