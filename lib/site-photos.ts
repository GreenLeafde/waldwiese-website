/**
 * Kuratierte Liste der Website-Fotos (public/photos) für den Bild-Auswähler im
 * Newsletter-Composer. `src` ist die absolute URL, damit die Bilder auch in der
 * versendeten E-Mail laden. Neue Fotos hier ergänzen → erscheinen automatisch
 * im Auswahlraster.
 */
import { SITE } from "./site";

const P = (name: string) => `${SITE.url}/photos/${name}`;

export type SitePhoto = { src: string; label: string };

export const SITE_PHOTOS: SitePhoto[] = [
  { src: P("food-breakfast-spread.jpg"), label: "Frühstückstafel" },
  { src: P("fruehstueck-avocado-toast.jpg"), label: "Avocado-Toast" },
  { src: P("fruehstueck-sauerteig.jpg"), label: "Sauerteig" },
  { src: P("food-bowl.jpg"), label: "Bowl" },
  { src: P("food-shot-1.jpg"), label: "Gericht 1" },
  { src: P("food-shot-2.jpg"), label: "Gericht 2" },
  { src: P("food-burger.jpg"), label: "Burger" },
  { src: P("dessert-square.png"), label: "Dessert" },
  { src: P("cocktail.webp"), label: "Cocktail" },
  { src: P("terrasse-olivenbaum.jpg"), label: "Terrasse · Olivenbaum" },
  { src: P("terrasse-tische.jpg"), label: "Terrasse · Tische" },
  { src: P("interior-warm.jpg"), label: "Innenraum" },
  { src: P("gebaeude-abend.jpg"), label: "Haus am Abend" },
  { src: P("gebaeude-luft.webp"), label: "Luftaufnahme" },
  { src: P("hund-terrasse.jpg"), label: "Hund · Terrasse" },
  { src: P("hund-wald.jpg"), label: "Hund · Wald" },
  { src: P("team-familie.jpg"), label: "Familie Leber" },
  { src: P("team-portrait.jpg"), label: "Team-Porträt" },
  { src: P("ww-event.jpg"), label: "Event" },
  { src: P("ww-00002.jpeg"), label: "Impression 1" },
  { src: P("ww-00003.jpeg"), label: "Impression 2" },
  { src: P("ww-00008.jpeg"), label: "Impression 3" },
  { src: P("ww-00009.jpeg"), label: "Impression 4" },
  { src: P("ww-00010.jpeg"), label: "Impression 5" },
];
