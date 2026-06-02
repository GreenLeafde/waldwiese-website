import { SeoLanding } from "@/components/seo-landing";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH } from "@/lib/site";

export const metadata = {
  title: "Restaurant Sinzing",
  description:
    "Wald & Wiese in Sinzing bei Regensburg: familiengeführtes Restaurant, regional & saisonal. Abends Burger, Bowls & vom Grill, ab Juli 2026 auch Frühstück. Hundefreundlich.",
  alternates: { canonical: "/restaurant-sinzing" },
};

export default function RestaurantSinzingPage() {
  return (
    <SeoLanding
      eyebrow="Restaurant · in Sinzing"
      titleLead="Restaurant in"
      titleAccent="Sinzing."
      lead="Familiengeführt an der Bruckdorfer Straße: Wald & Wiese ist dein Restaurant in Sinzing bei Regensburg. Abends Burger, Bowls und Gerichte vom Grill — ab Juli 2026 auch Frühstück."
      image={{ src: IMG.haus.src, alt: IMG.haus.alt }}
      points={[
        {
          title: "Regional & saisonal",
          text: "Klein, fein, ehrlich. Was die Region hergibt, kommt auf den Teller — vegetarisch und vegan inklusive.",
        },
        {
          title: "Abendküche mit Charakter",
          text: "Burger, Bowls, vom Grill — Gerichte mit Namen und Geschichte, benannt nach Familie, Freunden und Tieren.",
        },
        {
          title: "Bald auch Frühstück",
          text: `Ab ${BREAKFAST_LAUNCH.dateLong} starten wir morgens — Frühstück im Grünen, regional und in Ruhe.`,
        },
      ]}
      primaryCta={{ href: "/abendessen", label: "Zur Speisekarte" }}
      closing={{
        heading: "Reservier dir",
        accent: "einen Tisch.",
        text: "Drinnen oder auf der Terrasse — wir freuen uns auf dich. Reservierung in wenigen Klicks.",
        cta: { href: "/reservieren", label: "Tisch reservieren" },
      }}
    />
  );
}
