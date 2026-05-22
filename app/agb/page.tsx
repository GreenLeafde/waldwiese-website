import { Eyebrow } from "@/components/eyebrow";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata = {
  title: "AGB",
  description:
    "Allgemeine Geschäftsbedingungen — Wald & Wiese, Sinzing bei Regensburg.",
  robots: { index: false },
};

export default function AgbPage() {
  return (
    <article className="bg-mehlcreme">
      <div className="mx-auto max-w-3xl px-5 md:px-8 pt-12 md:pt-20 pb-20">
        <Eyebrow>Pflichtangaben</Eyebrow>
        <h1 className="mt-6 text-5xl md:text-6xl font-display leading-[0.95]">
          AGB
        </h1>

        <PlaceholderNotice title="AGB-Text steht noch aus">
          Für die meisten Restaurants ohne eigenen Onlineshop sind AGB
          rechtlich nicht zwingend nötig. Falls ihr trotzdem welche wollt
          (z. B. wegen Veranstaltungsbuchungen mit Anzahlung, Gutscheine,
          Stornoregeln) — bitte Eckpunkte liefern, ich baue daraus den Text.
          Sonst können wir diese Seite vor Launch auch komplett entfernen.
        </PlaceholderNotice>
      </div>
    </article>
  );
}
