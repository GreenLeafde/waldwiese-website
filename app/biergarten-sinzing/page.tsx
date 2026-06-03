import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";

const content: LandingContent = {
  metaTitle: "Biergarten in Sinzing bei Regensburg",
  metaDescription:
    "Draußen sitzen bei Wald & Wiese in Sinzing: Terrasse / Biergarten im Grünen, wenige Minuten von Regensburg — Bier, Getränke und regionale Küche unter freiem Himmel.",
  breadcrumb: "Biergarten Sinzing",
  eyebrow: "Draußen · im Grünen",
  h1Lead: "Terrasse & Biergarten in",
  h1Accent: "Sinzing.",
  intro:
    "Wenn das Wetter passt, sitzt du bei uns draußen: Die Terrasse von Wald & Wiese liegt mitten im Grünen, am Waldrand in Sinzing — nur wenige Minuten von Regensburg. Bier, hausgemachte Limonaden und regionale Küche unter freiem Himmel.",
  primaryCta: { label: "Tisch reservieren", href: "/reservieren" },
  split: {
    eyebrow: "Drinnen & draußen",
    heading: "Bei jedem Wetter",
    accent: "ein guter Platz.",
    paragraphs: [
      "Scheint die Sonne, sitzt du draußen auf der Terrasse im Grünen. Wird's kühler, geht's rein in den warmen Gastraum — der Hund darf überall mit.",
    ],
  },
  features: {
    heading: "Draußen bei uns",
    accent: "im Grünen.",
    items: [
      {
        title: "Terrasse am Waldrand",
        text: "Großzügige Terrasse mit Loungemöbeln und Tischen, Olivenbaum und Blick ins Grüne statt auf die Straße.",
      },
      {
        title: "Bier & mehr",
        text: "Kühles Bier, hausgemachte Limonaden, Wein und Cocktails — dazu, was die Küche frisch macht.",
      },
      {
        title: "Hund willkommen",
        text: "Dein Hund darf mit raus auf die Terrasse — bei uns gehört er einfach dazu.",
      },
    ],
  },
  stats: [
    { value: "im Grünen", label: "Terrasse am Waldrand" },
    { value: "wenige Minuten", label: "von Regensburg" },
    { value: "Hund willkommen", label: "auf der Terrasse" },
  ],
  faq: [
    {
      question: "Habt ihr einen Biergarten in Sinzing?",
      answer:
        "Wir haben eine große Terrasse im Grünen, auf der du bei schönem Wetter draußen sitzt — Biergarten-Feeling am Waldrand in Sinzing, mit Bier, Getränken und regionaler Küche.",
    },
    {
      question: "Kann man bei euch draußen essen und trinken?",
      answer:
        "Ja. Auf der Terrasse gibt's das volle Angebot — abends Burger, Bowls und vom Grill, dazu Bier, Limonaden und Wein. Ab 6. Juli 2026 auch Frühstück im Freien.",
    },
    {
      question: "Ist die Terrasse hundefreundlich?",
      answer:
        "Sehr. Dein Hund ist auf der Terrasse — und drinnen — herzlich willkommen.",
    },
    {
      question: "Muss ich für die Terrasse reservieren?",
      answer:
        "Bei schönem Wetter wird's draußen schnell voll — eine Reservierung lohnt sich, online oder telefonisch.",
    },
  ],
  closing: {
    heading: "Raus auf die",
    accent: "Terrasse.",
    text: "Bei gutem Wetter der schönste Platz bei uns — reservier dir einen Tisch im Grünen.",
    cta: { label: "Tisch reservieren", href: "/reservieren" },
  },
};

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/biergarten-sinzing" },
};

export default function BiergartenSinzingPage() {
  return (
    <RichLanding
      content={content}
      path="/biergarten-sinzing"
      splitImage={{
        src: IMG.terrasseOlivenbaum.src,
        alt: IMG.terrasseOlivenbaum.alt,
        position: "center 45%",
      }}
    />
  );
}
