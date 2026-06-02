import { SeoLanding } from "@/components/seo-landing";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH } from "@/lib/site";

export const metadata = {
  title: "Frühstück bei Regensburg",
  description:
    "Frühstücken bei Regensburg: Wald & Wiese in Sinzing, nur wenige Minuten von der Stadt. Regional, im Grünen, mit großer veganer & vegetarischer Auswahl. Ab 6. Juli 2026.",
  alternates: { canonical: "/fruehstueck-regensburg" },
};

export default function FruehstueckRegensburgPage() {
  return (
    <SeoLanding
      eyebrow="Frühstück · bei Regensburg"
      titleLead="Frühstück bei"
      titleAccent="Regensburg."
      lead="Raus aus der Stadt, rein ins Grüne: Bei Wald & Wiese in Sinzing frühstückst du nur wenige Minuten südwestlich von Regensburg — regional, in Ruhe, drinnen oder auf der Terrasse."
      image={{ src: IMG.foodBreakfast.src, alt: IMG.foodBreakfast.alt }}
      points={[
        {
          title: "Im Grünen statt im Trubel",
          text: "Frühstück auf der Terrasse, mitten im Grünen — und trotzdem nur einen Katzensprung von Regensburg entfernt.",
        },
        {
          title: "Regional & hausgemacht",
          text: "Brot vom Bäcker aus der Region, Obst aus Sinzinger Höfen, hausgemachte Aufstriche und Granola.",
        },
        {
          title: "Vegan & vegetarisch",
          text: "Pflanzliche Optionen stehen bei uns gleichberechtigt auf der Karte — nicht als Beilage gedacht.",
        },
      ]}
      primaryCta={{ href: "/fruehstueck", label: "Zum Frühstück" }}
      closing={{
        heading: "Frühstück ab",
        accent: BREAKFAST_LAUNCH.dateLong + ".",
        text: "Komm vorbei, bring den Hund mit, bleib so lange du magst. So findest du uns in Sinzing bei Regensburg.",
        cta: { href: "/kontakt", label: "Anfahrt & Kontakt" },
      }}
    />
  );
}
