import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";

const content: LandingContent = {
  metaTitle: "Vegetarisches Restaurant bei Regensburg",
  metaDescription:
    "Vegetarisch essen bei Regensburg: Bei Wald & Wiese in Sinzing stehen vegetarische (und vegane) Gerichte gleichberechtigt auf der Karte — regional, im Grünen.",
  breadcrumb: "Vegetarisches Restaurant Regensburg",
  eyebrow: "Vegetarisch · bei Regensburg",
  h1Lead: "Vegetarisch essen bei",
  h1Accent: "Regensburg.",
  intro:
    "Vegetarisch ist bei uns kein Beiwerk: In Sinzing, wenige Minuten von Regensburg, stehen vegetarische und vegane Gerichte gleichberechtigt auf der Karte — von Bowls über Tempura-Gemüse bis zum Burger mit Ziegenkäse. Regional und ehrlich.",
  primaryCta: { label: "Zur Speisekarte", href: "/abendessen" },
  split: {
    eyebrow: "Für alle am Tisch",
    heading: "Vegetarisch, vegan",
    accent: "oder mit Fleisch.",
    paragraphs: [
      "Bei uns muss sich niemand vorab entscheiden: vegetarische, vegane und Fleischgerichte stehen gleichberechtigt nebeneinander auf der Karte.",
    ],
  },
  features: {
    heading: "Vegetarisch ohne",
    accent: "Kompromiss.",
    items: [
      {
        title: "Gleichberechtigt auf der Karte",
        text: "Vegetarisch und vegan stehen direkt neben allem anderen — du musst nicht suchen oder extra fragen.",
      },
      {
        title: "Mehr als Beilagensalat",
        text: "Rote Bete Carpaccio, Tempura-Gemüse, die Prinzessin auf der Kichererbse, Burger mit Ziegenkäse — richtige Gerichte.",
      },
      {
        title: "Regional & saisonal",
        text: "Was die Region hergibt, kommt auf den Teller — frisch, nicht weit angekarrt.",
      },
    ],
  },
  stats: [
    { value: "vegetarisch & vegan", label: "gleichberechtigt" },
    { value: "regional", label: "saisonal gekocht" },
    { value: "wenige Minuten", label: "von Regensburg" },
  ],
  faq: [
    {
      question: "Gibt es bei euch ein gutes vegetarisches Angebot?",
      answer:
        "Ja. Vegetarische Gerichte stehen bei Wald & Wiese gleichberechtigt auf der Karte — von Vorspeisen über Bowls bis zum Burger. Vegan ist genauso vertreten.",
    },
    {
      question: "Seid ihr ein rein vegetarisches Restaurant?",
      answer:
        "Nein, wir kochen für alle: Fleisch, Fisch, vegetarisch und vegan nebeneinander. So findet jede Runde etwas — ohne Kompromisse.",
    },
    {
      question: "Wo liegt das Restaurant?",
      answer:
        "In Sinzing, Bruckdorfer Straße 42, nur wenige Minuten südwestlich von Regensburg — mitten im Grünen.",
    },
    {
      question: "Muss ich reservieren?",
      answer:
        "Am Wochenende empfehlen wir's. Du kannst online oder telefonisch reservieren.",
    },
  ],
  closing: {
    heading: "Schmeckt auch",
    accent: "ohne Fleisch.",
    text: "Komm vorbei und überzeug dich — reservier dir einen Tisch, drinnen oder auf der Terrasse.",
    cta: { label: "Tisch reservieren", href: "/reservieren" },
  },
};

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/vegetarisches-restaurant-regensburg" },
};

export default function VegetarischesRestaurantRegensburgPage() {
  return (
    <RichLanding
      content={content}
      path="/vegetarisches-restaurant-regensburg"
      splitImage={{
        src: IMG.wwFood2.src,
        alt: "Gastraum mit Siebträger im Wald & Wiese",
      }}
    />
  );
}
