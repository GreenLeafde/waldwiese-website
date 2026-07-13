import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";

const content: LandingContent = {
  metaTitle: "Burger bei Regensburg",
  metaDescription:
    "Burger essen bei Regensburg: handgemachte Burger bei Wald & Wiese in Sinzing — Beef oder vegan, Bun vom Bäcker. Mähende Moni, fetziger Sven, Heinzi & Co.",
  breadcrumb: "Burger Regensburg",
  eyebrow: "Burger · bei Regensburg",
  h1Lead: "Burger bei",
  h1Accent: "Regensburg.",
  intro:
    "Handgemachte Burger, wenige Minuten von Regensburg: Bei Wald & Wiese in Sinzing kommt das Patty nach Wahl — Beef oder vegan — auf ein Brioche- oder Laugenbun vom Bäcker. Von der mähenden Moni bis zum fetzigen Sven.",
  primaryCta: { label: "Zur Speisekarte", href: "/speisekarte" },
  split: {
    eyebrow: "So machen wir's",
    heading: "Handgemacht,",
    accent: "Patty nach Wahl.",
    paragraphs: [
      "Buns vom Bäcker, Patty nach Wahl — Beef oder vegan — und Extras vom Cheddar bis zum Spiegelei. Jeder Burger so, wie du ihn magst.",
    ],
  },
  features: {
    heading: "Unsere",
    accent: "Burger.",
    items: [
      {
        title: "Patty nach Wahl",
        text: "Beef-Patty oder vegan aus Erbsenprotein — jeden Burger gibt's so, wie du ihn magst. Buns hausgemacht vom Bäcker.",
      },
      {
        title: "Mit Namen & Geschichte",
        text: "Die mähende Moni mit Ziegenkäse, der fetzige Sven mit Pulled Pork oder Jackfruit, der klassische Heinzi, der Dorfbazi.",
      },
      {
        title: "Auch vegan & vegetarisch",
        text: "Veganer Käse, Jackfruit statt Pulled Pork — Burgergenuss ohne Tier geht bei uns ganz selbstverständlich.",
      },
    ],
  },
  stats: [
    { value: "Beef oder vegan", label: "Patty nach Wahl" },
    { value: "vom Bäcker", label: "Buns hausgemacht" },
    { value: "wenige Minuten", label: "von Regensburg" },
  ],
  faq: [
    {
      question: "Wo gibt's gute Burger bei Regensburg?",
      answer:
        "Bei Wald & Wiese in Sinzing, wenige Minuten südwestlich von Regensburg. Unsere Burger sind handgemacht, das Patty nach Wahl — Beef oder vegan.",
    },
    {
      question: "Gibt es vegane oder vegetarische Burger?",
      answer:
        "Ja. Jeden Burger gibt's auf Wunsch mit veganem Patty; den fetzigen Sven zum Beispiel mit Jackfruit statt Pulled Pork und veganem Käse.",
    },
    {
      question: "Kann man die Burger anpassen?",
      answer:
        "Klar — Patty, Bun und Extras (z. B. Cheddar, Balsamico-Zwiebeln, Spiegelei) wählst du dazu. Frag uns einfach.",
    },
    {
      question: "Muss ich reservieren?",
      answer:
        "Am Wochenende empfehlen wir eine Reservierung — online oder telefonisch.",
    },
  ],
  closing: {
    heading: "Hunger auf einen",
    accent: "Burger?",
    text: "Reservier dir einen Tisch oder schau spontan vorbei — drinnen oder auf der Terrasse im Grünen.",
    cta: { label: "Tisch reservieren", href: "/reservieren" },
  },
};

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/burger-regensburg" },
};

export default function BurgerRegensburgPage() {
  return (
    <RichLanding
      content={content}
      path="/burger-regensburg"
      splitImage={{
        src: IMG.wwFood1.src,
        alt: "Bar und Gastraum im Wald & Wiese in Sinzing",
      }}
    />
  );
}
