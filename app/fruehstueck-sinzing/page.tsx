import { SeoLanding } from "@/components/seo-landing";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH } from "@/lib/site";

export const metadata = {
  title: "Frühstück Sinzing",
  description:
    "Frühstück in Sinzing: Wald & Wiese an der Bruckdorfer Straße — familiengeführt, regional, im Grünen. Drinnen oder auf der Terrasse. Ab 6. Juli 2026.",
  alternates: { canonical: "/fruehstueck-sinzing" },
};

export default function FruehstueckSinzingPage() {
  return (
    <SeoLanding
      eyebrow="Frühstück · in Sinzing"
      titleLead="Frühstück in"
      titleAccent="Sinzing."
      lead="Wald & Wiese ist dein Frühstücksplatz mitten in Sinzing — an der Bruckdorfer Straße, familiengeführt und regional. Komm vorbei, nimm dir Zeit, bleib so lange du magst."
      image={{ src: IMG.hero.src, alt: IMG.hero.alt }}
      points={[
        {
          title: "Mitten in Sinzing",
          text: "Bruckdorfer Straße 42 — familiengeführt, persönlich, kein Hochglanz. Mehr Frühstückstisch als feines Restaurant.",
        },
        {
          title: "Aus der Nachbarschaft",
          text: "Obst aus Sinzinger Höfen, Brot vom Bäcker aus der Region. Was die Gegend hergibt, kommt auf den Teller.",
        },
        {
          title: "Drinnen oder draußen",
          text: "Gemütlicher Innenraum oder Frühstück auf der Terrasse im Grünen — du hast die Wahl.",
        },
      ]}
      primaryCta={{ href: "/fruehstueck", label: "Zum Frühstück" }}
      closing={{
        heading: "Wir starten am",
        accent: BREAKFAST_LAUNCH.dateLong + ".",
        text: "Bis dahin sind wir abends für dich da. Schreib uns oder schau auf der Startseite vorbei.",
        cta: { href: "/kontakt", label: "Anfahrt & Kontakt" },
      }}
    />
  );
}
