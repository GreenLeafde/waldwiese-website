import { SeoLanding } from "@/components/seo-landing";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH } from "@/lib/site";

export const metadata = {
  title: "Veganes Frühstück bei Regensburg",
  description:
    "Veganes Frühstück bei Regensburg: bei Wald & Wiese in Sinzing stehen pflanzliche Gerichte gleichberechtigt auf der Karte. Regional, hausgemacht, im Grünen. Ab 6. Juli 2026.",
  alternates: { canonical: "/veganes-fruehstueck-regensburg" },
};

export default function VeganesFruehstueckRegensburgPage() {
  return (
    <SeoLanding
      eyebrow="Vegan · Frühstück bei Regensburg"
      titleLead="Veganes Frühstück bei"
      titleAccent="Regensburg."
      lead="Pflanzlich frühstücken ohne Kompromiss: Bei Wald & Wiese in Sinzing — wenige Minuten von Regensburg — sind vegane Gerichte fester Teil der Frühstückskarte, nicht die Ausnahme."
      image={{ src: IMG.foodBowl.src, alt: IMG.foodBowl.alt }}
      points={[
        {
          title: "Vegan ist Standard",
          text: "Pflanzliche Optionen stehen gleichberechtigt neben allem anderen — du musst nicht lange suchen.",
        },
        {
          title: "Regional & hausgemacht",
          text: "Hausgemachtes Granola und Aufstriche, Obst aus Sinzinger Höfen, Brot vom Bäcker aus der Region.",
        },
        {
          title: "Im Grünen frühstücken",
          text: "Drinnen oder auf der Terrasse, in Ruhe — und das Ganze nur einen Katzensprung von Regensburg.",
        },
      ]}
      primaryCta={{ href: "/fruehstueck", label: "Zum Frühstück" }}
      closing={{
        heading: "Vegan frühstücken ab",
        accent: BREAKFAST_LAUNCH.dateLong + ".",
        text: "Schreib uns, wenn du Fragen zur Karte hast — oder schau zum Start im Juli vorbei.",
        cta: { href: "/kontakt", label: "Anfahrt & Kontakt" },
      }}
    />
  );
}
