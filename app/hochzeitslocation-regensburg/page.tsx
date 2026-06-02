import { SeoLanding } from "@/components/seo-landing";
import { IMG } from "@/lib/images";

export const metadata = {
  title: "Hochzeitslocation bei Regensburg",
  description:
    "Heiraten bei Regensburg: familiengeführte Location in Sinzing — rund 50 Gäste im Innenraum plus bis zu 50 auf der Terrasse. Regionale Küche, persönlich, auf Anfrage.",
  alternates: { canonical: "/hochzeitslocation-regensburg" },
};

export default function HochzeitslocationRegensburgPage() {
  return (
    <SeoLanding
      eyebrow="Hochzeit · bei Regensburg"
      titleLead="Heiraten bei"
      titleAccent="Regensburg."
      lead="Klein, persönlich, im Grünen: Wald & Wiese in Sinzing ist eure familiengeführte Hochzeitslocation nur wenige Minuten von Regensburg. Regionale Küche, ehrlicher Service — ohne Schickimicki."
      image={{ src: IMG.interiorScene.src, alt: IMG.interiorScene.alt }}
      points={[
        {
          title: "Platz für eure Feier",
          text: "Rund 50 Gäste im Innenraum, dazu noch einmal bis zu 50 auf der Terrasse — drinnen und draußen lassen sich kombinieren.",
        },
        {
          title: "Regional gekocht",
          text: "Eure Hochzeit mit dem, was die Region hergibt — das Menü planen wir individuell mit euch.",
        },
        {
          title: "Persönlich & familiengeführt",
          text: "Ihr plant direkt mit der Familie Leber. Auf Wunsch sorgt Tischzauberei für besondere Momente.",
        },
      ]}
      primaryCta={{ href: "/veranstaltungen", label: "Veranstaltungen ansehen" }}
      closing={{
        heading: "Erzählt uns von",
        accent: "eurem Tag.",
        text: "Datum, ungefähre Gästezahl, eure Vorstellungen — schreibt uns kurz, wir melden uns mit Vorschlägen zurück.",
        cta: { href: "/veranstaltungen", label: "Anfrage starten" },
      }}
    />
  );
}
