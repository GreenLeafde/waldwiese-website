import { Eyebrow } from "@/components/eyebrow";
import { PlaceholderNotice } from "@/components/placeholder-notice";

export const metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Wald & Wiese.",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <article className="bg-mehlcreme">
      <div className="mx-auto max-w-3xl px-5 md:px-8 pt-12 md:pt-20 pb-20">
        <Eyebrow>Pflichtangaben</Eyebrow>
        <h1 className="mt-6 text-5xl md:text-6xl font-display leading-[0.95]">
          Datenschutz
        </h1>

        <PlaceholderNotice title="Volltext steht noch aus">
          Eine Datenschutzerklärung wird hier eingebunden, sobald wir wissen,
          welche Tools tatsächlich auf der Seite laufen — Analytics (welches?),
          Cookie-Consent-Tool, externe Einbindungen (Lightspeed-Buchung
          erfolgt extern via Link, also kein Iframe-Tracking, aber bestätigen
          wir noch), evtl. Karte (Google vs. OpenStreetMap), Instagram-Embeds.
          Sobald das geklärt ist, generiere ich den Text über eine
          rechtssichere Vorlage (z. B. e-recht24) und passe ihn an.
        </PlaceholderNotice>
      </div>
    </article>
  );
}
