import { SeoLanding } from "@/components/seo-landing";
import { IMG } from "@/lib/images";

export const metadata = {
  title: "Hundefreundliches Restaurant bei Regensburg",
  description:
    "Mit Hund ins Restaurant? Bei Wald & Wiese in Sinzing nahe Regensburg ist dein Hund herzlich willkommen — auf der Terrasse und im Lokal. Familiengeführt, regional, im Grünen.",
  alternates: { canonical: "/hundefreundliches-restaurant-regensburg" },
};

export default function HundefreundlichesRestaurantPage() {
  return (
    <SeoLanding
      eyebrow="Hund willkommen · bei Regensburg"
      titleLead="Mit Hund"
      titleAccent="willkommen."
      lead="Bring den Hund mit. Bei Wald & Wiese in Sinzing — nur wenige Minuten von Regensburg — ist dein Vierbeiner gern gesehen. Bei uns sind Tiere Familie."
      image={{ src: IMG.hundTerrasse.src, alt: IMG.hundTerrasse.alt }}
      points={[
        {
          title: "Auf der Terrasse & am Tisch",
          text: "Ob draußen auf der Terrasse oder drinnen am Tisch — dein Hund gehört einfach dazu.",
        },
        {
          title: "Tiere sind bei uns Familie",
          text: "Unsere Gerichte tragen sogar ihre Namen — der „Heinzi“ ist nach unserem Hund Henry benannt.",
        },
        {
          title: "Im Grünen, in Ruhe",
          text: "Viel Platz, frische Luft, kein Stadt-Trubel — entspannt für dich und deinen Hund.",
        },
      ]}
      primaryCta={{ href: "/kontakt", label: "Anfahrt & Öffnungszeiten" }}
      closing={{
        heading: "Komm vorbei —",
        accent: "mit Hund.",
        text: "Reservier dir einen Tisch oder schau einfach spontan rein. Wir freuen uns auf euch beide.",
        cta: { href: "/reservieren", label: "Tisch reservieren" },
      }}
    />
  );
}
