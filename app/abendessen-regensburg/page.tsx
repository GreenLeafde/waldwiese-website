import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";

const content: LandingContent = {
  metaTitle: "Abendessen bei Regensburg",
  metaDescription:
    "Abends essen gehen bei Regensburg: Wald & Wiese in Sinzing — Burger, Bowls & Gerichte vom Grill, regional, im Grünen. Fleisch, vegetarisch und vegan. Jetzt reservieren.",
  breadcrumb: "Abendessen Regensburg",
  eyebrow: "Abendessen · bei Regensburg",
  h1Lead: "Abends essen gehen bei",
  h1Accent: "Regensburg.",
  intro:
    "Raus aus der Stadt, gut essen im Grünen: Bei Wald & Wiese in Sinzing gibt's abends Burger, Bowls und Gerichte vom Grill — regional, ehrlich, nur wenige Minuten von Regensburg. Fleisch, vegetarisch und vegan stehen gleichberechtigt auf der Karte.",
  primaryCta: { label: "Zur Speisekarte", href: "/abendessen" },
  features: {
    heading: "Was abends auf den Tisch",
    accent: "kommt.",
    items: [
      {
        title: "Burger mit Charakter",
        text: "Von der mähenden Moni bis zum fetzigen Sven — handgemacht, Patty nach Wahl, auch vegan.",
      },
      {
        title: "Bowls & vom Grill",
        text: "Schüsseln voller Glück, dazu Steak, Spare Ribs und Teriyaki-Lachs frisch vom Grill.",
      },
      {
        title: "Für alle was dabei",
        text: "Fleisch, vegetarisch und vegan gleichberechtigt — niemand am Tisch muss Kompromisse machen.",
      },
    ],
  },
  stats: [
    { value: "Burger · Bowls · Grill", label: "die Abendkarte" },
    { value: "vegan & veg.", label: "gleichberechtigt dabei" },
    { value: "wenige Minuten", label: "von Regensburg" },
  ],
  faq: [
    {
      question: "Kann man bei euch abends gut essen gehen nahe Regensburg?",
      answer:
        "Ja. Wald & Wiese in Sinzing liegt nur wenige Minuten südwestlich von Regensburg. Abends gibt's Burger, Bowls und Gerichte vom Grill — regional und frisch zubereitet.",
    },
    {
      question: "Gibt es vegetarische und vegane Gerichte am Abend?",
      answer:
        "Ja, vegetarisch und vegan stehen gleichberechtigt auf der Karte — neben Fleisch- und Fischgerichten. Viele Burger gibt's auch mit veganem Patty.",
    },
    {
      question: "Muss ich abends reservieren?",
      answer:
        "Spontan vorbeikommen geht, aber gerade am Wochenende empfehlen wir eine Reservierung — online oder telefonisch.",
    },
    {
      question: "Wo genau seid ihr?",
      answer:
        "Bruckdorfer Straße 42, 93161 Sinzing — im Grünen, wenige Minuten von Regensburg. Anfahrt auf der Kontaktseite.",
    },
  ],
  closing: {
    heading: "Tisch sichern,",
    accent: "abends.",
    text: "Reservier in wenigen Klicks oder ruf uns an — wir freuen uns auf dich, drinnen oder auf der Terrasse.",
    cta: { label: "Tisch reservieren", href: "/reservieren" },
  },
};

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/abendessen-regensburg" },
};

export default function AbendessenRegensburgPage() {
  return (
    <RichLanding
      content={content}
      path="/abendessen-regensburg"
      splitImage={{
        src: IMG.gebaeudeAbend.src,
        alt: IMG.gebaeudeAbend.alt,
        position: "center 40%",
      }}
    />
  );
}
