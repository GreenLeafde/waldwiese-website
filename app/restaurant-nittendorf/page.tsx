import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";

const content: LandingContent = {
  metaTitle: "Restaurant nahe Nittendorf",
  metaDescription:
    "Restaurant in der Nähe von Nittendorf: Wald & Wiese in Sinzing — familiengeführt, regional, hundefreundlich. Abends Burger, Bowls & Grill, ab Juli Frühstück.",
  breadcrumb: "Restaurant Nittendorf",
  eyebrow: "Restaurant · nahe Nittendorf",
  h1Lead: "Euer Restaurant nahe",
  h1Accent: "Nittendorf.",
  intro:
    "Aus Nittendorf seid ihr in wenigen Minuten bei uns: Wald & Wiese in Sinzing, familiengeführt und im Grünen. Abends Burger, Bowls und Gerichte vom Grill, ab 6. Juli 2026 auch Frühstück. Vegetarisch und vegan gleichberechtigt, Hund willkommen.",
  primaryCta: { label: "Zur Speisekarte", href: "/speisekarte" },
  split: {
    eyebrow: "Einen Sprung entfernt",
    heading: "Von Nittendorf",
    accent: "ins Grüne.",
    paragraphs: [
      "Aus Nittendorf bist du in wenigen Minuten da — perfekt für den Abend essen gehen oder bald das Frühstück auf der Terrasse.",
    ],
  },
  features: {
    heading: "Ein Abstecher, der sich",
    accent: "lohnt.",
    items: [
      {
        title: "Nur wenige Minuten",
        text: "Von Nittendorf schnell erreichbar — ideal für den Abend essen gehen oder bald das Frühstück im Grünen.",
      },
      {
        title: "Regional & für alle",
        text: "Burger, Bowls, vom Grill — Fleisch, vegetarisch und vegan gleichberechtigt auf der Karte.",
      },
      {
        title: "Familiengeführt",
        text: "Bei uns kocht und serviert die Familie Leber selbst. Persönlich, warm, ohne Schickimicki.",
      },
    ],
  },
  stats: [
    { value: "wenige Minuten", label: "von Nittendorf" },
    { value: "regional", label: "saisonal gekocht" },
    { value: "Hund willkommen", label: "drinnen & Terrasse" },
  ],
  faq: [
    {
      question: "Gibt es ein Restaurant in der Nähe von Nittendorf?",
      answer:
        "Ja — Wald & Wiese in Sinzing ist nur wenige Minuten von Nittendorf entfernt. Familiengeführt, regional, mit Terrasse im Grünen.",
    },
    {
      question: "Was kommt auf den Tisch?",
      answer:
        "Abends Burger, Bowls und Gerichte vom Grill, vegetarisch und vegan gleichberechtigt. Ab 6. Juli 2026 zusätzlich Frühstück.",
    },
    {
      question: "Ist es hundefreundlich?",
      answer: "Ja, dein Hund ist drinnen wie auf der Terrasse willkommen.",
    },
    {
      question: "Wie reserviere ich?",
      answer: "Online über unser Reservierungssystem oder telefonisch.",
    },
  ],
  closing: {
    heading: "Aus Nittendorf",
    accent: "schnell da.",
    text: "Reservier dir einen Tisch — wir freuen uns auf dich.",
    cta: { label: "Tisch reservieren", href: "/reservieren" },
  },
};

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/restaurant-nittendorf" },
};

export default function RestaurantNittendorfPage() {
  return (
    <RichLanding
      content={content}
      path="/restaurant-nittendorf"
      splitImage={{
        src: IMG.haus.src,
        alt: "Das Haus von Wald & Wiese in Sinzing",
      }}
    />
  );
}
