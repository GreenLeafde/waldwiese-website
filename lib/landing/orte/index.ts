import { type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import pentling from "./pentling.json";
import eilsbrunn from "./eilsbrunn.json";
import mariaort from "./mariaort.json";
import etterzhausen from "./etterzhausen.json";
import undorf from "./undorf.json";
import grosspruefening from "./grosspruefening.json";
import kneiting from "./kneiting.json";
import riegling from "./riegling.json";
import bruckdorf from "./bruckdorf.json";
import pielenhofen from "./pielenhofen.json";
import badAbbach from "./bad-abbach.json";
import koenigswiesen from "./koenigswiesen.json";
import kumpfmuehl from "./kumpfmuehl.json";

type OrtImage = { src: string; alt: string; position?: string };

/** Echte Ort-/Innenraum-Fotos im Wechsel (kein Stock). */
const HERO_ROTATION: OrtImage[] = [
  { src: IMG.gebaeudeLuft.src, alt: IMG.gebaeudeLuft.alt },
  {
    src: IMG.terrasseOlivenbaum.src,
    alt: IMG.terrasseOlivenbaum.alt,
    position: "center 45%",
  },
  { src: IMG.gebaeudeAbend.src, alt: IMG.gebaeudeAbend.alt, position: "center 40%" },
  {
    src: IMG.terrasseTische.src,
    alt: IMG.terrasseTische.alt,
    position: "center 50%",
  },
  { src: IMG.wwFood3.src, alt: "Gastraum mit grünen Stühlen im Wald & Wiese" },
  { src: IMG.wwFood2.src, alt: "Gastraum mit Siebträger im Wald & Wiese" },
  { src: IMG.wwFood1.src, alt: "Bar und Gastraum im Wald & Wiese" },
];

const RAW: { slug: string; content: unknown }[] = [
  { slug: "pentling", content: pentling },
  { slug: "eilsbrunn", content: eilsbrunn },
  { slug: "mariaort", content: mariaort },
  { slug: "etterzhausen", content: etterzhausen },
  { slug: "undorf", content: undorf },
  { slug: "grosspruefening", content: grosspruefening },
  { slug: "kneiting", content: kneiting },
  { slug: "riegling", content: riegling },
  { slug: "bruckdorf", content: bruckdorf },
  { slug: "pielenhofen", content: pielenhofen },
  { slug: "bad-abbach", content: badAbbach },
  { slug: "koenigswiesen", content: koenigswiesen },
  { slug: "kumpfmuehl", content: kumpfmuehl },
];

export type OrtEntry = {
  slug: string;
  content: LandingContent;
  image: OrtImage;
};

export const ORTE: OrtEntry[] = RAW.map((o, i) => ({
  slug: o.slug,
  content: o.content as LandingContent,
  image: HERO_ROTATION[i % HERO_ROTATION.length],
}));

export const ORT_MAP: Record<string, OrtEntry> = Object.fromEntries(
  ORTE.map((o) => [o.slug, o]),
);
