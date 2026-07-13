import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";

const content: LandingContent = {
  metaTitle: "Restaurant nahe Viehhausen",
  metaDescription:
    "Restaurant nahe Viehhausen: Wald & Wiese in Sinzing — familiengeführt, regional, hundefreundlich. Abends Burger, Bowls & Grill, ab Juli auch Frühstück.",
  breadcrumb: "Restaurant Viehhausen",
  eyebrow: "Restaurant · nahe Viehhausen",
  h1Lead: "Euer Restaurant nahe",
  h1Accent: "Viehhausen.",
  intro:
    "Von Viehhausen sind es nur ein paar Minuten zu uns: Wald & Wiese in Sinzing ist euer familiengeführtes Restaurant im Grünen. Abends Burger, Bowls und Gerichte vom Grill, ab 6. Juli 2026 auch Frühstück. Hund herzlich willkommen.",
  primaryCta: { label: "Zur Speisekarte", href: "/speisekarte" },
  split: {
    eyebrow: "Gleich nebenan",
    heading: "Von Viehhausen",
    accent: "schnell im Grünen.",
    paragraphs: [
      "Ein paar Minuten Fahrt, und du sitzt bei uns am Waldrand — drinnen oder auf der Terrasse, mit Hund, ohne Stadt-Trubel.",
    ],
  },
  features: {
    heading: "Warum's sich lohnt",
    accent: "vorbeizukommen.",
    items: [
      {
        title: "Gleich um die Ecke",
        text: "Von Viehhausen nur wenige Minuten — nah genug für den spontanen Abend, raus genug fürs Grüne.",
      },
      {
        title: "Regional & ehrlich",
        text: "Klein, fein, familiengeführt. Burger, Bowls und vom Grill, vegetarisch und vegan gleichberechtigt.",
      },
      {
        title: "Hund willkommen",
        text: "Dein Vierbeiner darf mit — drinnen wie auf der Terrasse. Bei uns sind Tiere Familie.",
      },
    ],
  },
  stats: [
    { value: "wenige Minuten", label: "von Viehhausen" },
    { value: "familiengeführt", label: "Familie Leber" },
    { value: "Hund willkommen", label: "drinnen & Terrasse" },
  ],
  faq: [
    {
      question: "Gibt es ein gutes Restaurant in der Nähe von Viehhausen?",
      answer:
        "Ja — Wald & Wiese in Sinzing liegt nur wenige Minuten von Viehhausen entfernt. Familiengeführt, regional, mit Terrasse im Grünen.",
    },
    {
      question: "Was gibt es zu essen?",
      answer:
        "Abends Burger, Bowls und Gerichte vom Grill — Fleisch, vegetarisch und vegan. Ab 6. Juli 2026 kommt morgens das Frühstück dazu.",
    },
    {
      question: "Ist mein Hund willkommen?",
      answer:
        "Sehr gern, drinnen wie auf der Terrasse. Unser Gericht Heinzi ist sogar nach unserem Hund Henry benannt.",
    },
    {
      question: "Wie reserviere ich?",
      answer:
        "Online über unser Reservierungssystem oder telefonisch. Spontan vorbeikommen geht auch.",
    },
  ],
  closing: {
    heading: "Von Viehhausen",
    accent: "schnell da.",
    text: "Reservier dir einen Tisch — wir freuen uns auf dich, drinnen oder auf der Terrasse.",
    cta: { label: "Tisch reservieren", href: "/reservieren" },
  },
};

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/restaurant-viehhausen" },
};

export default function RestaurantViehhausenPage() {
  return (
    <RichLanding
      content={content}
      path="/restaurant-viehhausen"
      splitImage={{
        src: IMG.wwFood5.src,
        alt: "Gedeckter Tisch am Fenster mit Blick ins Grüne im Wald & Wiese",
      }}
    />
  );
}
