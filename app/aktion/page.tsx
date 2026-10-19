import Link from "next/link";
import type { Metadata } from "next";
import { KarteHeading, KarteMasthead } from "@/components/karte";
import { CONTACT, COMPANY, SITE } from "@/lib/site";

/**
 * Teilnahmebedingungen zur Werbeaktion „Kaffee aufs Haus" (Meta-Werbung
 * November 2026). In den Anzeigen steht die Aktion nur kurz mit Sternchen,
 * die Details stehen hier. Zeitraum/Tage hier zentral anpassen.
 */
const AKTION = {
  zeitraum: "02.11. bis 26.11.2026",
  tage: "Montag bis Donnerstag",
  mindestwert: "15 €",
  kaffee: "Kaffee Crema oder Tasse Filterkaffee",
};

export const metadata: Metadata = {
  title: "Aktion: Kaffee aufs Haus — Teilnahmebedingungen",
  description: `Zu deinem Frühstück ab ${AKTION.mindestwert} geht der Kaffee aufs Haus. Alle Bedingungen zur Aktion von Wald & Wiese in Sinzing.`,
  alternates: { canonical: "/aktion" },
  robots: { index: false, follow: true },
};

const BEDINGUNGEN = [
  `Die Aktion gilt vom ${AKTION.zeitraum}, jeweils ${AKTION.tage} während unserer Frühstückszeit (8 – 14 Uhr).`,
  `Pro Person gibt es eine Tasse Kaffee gratis (${AKTION.kaffee}), wenn diese Person Frühstück im Wert von mindestens ${AKTION.mindestwert} bestellt.`,
  "Als Frühstück zählen die Gerichte aus den Bereichen Frühstück, Brote, „Schmusi“-Bowls und Extras unserer Speisekarte. Getränke und Mittagsgerichte zählen nicht zum Mindestwert.",
  "Kaffeespezialitäten wie Cappuccino, Latte Macchiato oder Chai Latte sind ausgenommen. Gegen Aufpreis tauschen geht nicht.",
  "Der Kaffee wird nicht bar ausgezahlt und ist nicht mit anderen Aktionen oder Rabatten kombinierbar. Beim Bezahlen mit Gutschein gilt die Aktion ganz normal.",
  "Sag bei der Bestellung einfach kurz Bescheid, dass du wegen der Aktion da bist.",
  "Wir behalten uns vor, die Aktion vorzeitig zu beenden. Das kündigen wir dann hier und auf Instagram an.",
];

export default function AktionPage() {
  return (
    <>
      <KarteMasthead
        kicker="Aktion · Sinzing bei Regensburg"
        title="Kaffee"
        accent="aufs Haus."
        line={`Zu deinem Frühstück ab ${AKTION.mindestwert} · ${AKTION.tage} · ${AKTION.zeitraum}`}
      >
        <p className="mx-auto max-w-2xl text-center text-lg italic leading-relaxed text-waldgruen/70">
          Du bestellst dein Frühstück, wir stellen dir den Kaffee dazu. Hier
          steht, wie es genau funktioniert.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/reservieren"
            className="inline-flex items-center gap-2 rounded-full bg-tonwarm px-8 py-4 font-medium text-white transition-colors hover:bg-tonwarm-dark"
          >
            Tisch reservieren
          </Link>
          <Link
            href="/speisekarte#fruehstueck"
            className="inline-flex items-center gap-3 border-b border-waldgruen/30 pb-1 font-medium text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm"
          >
            Zur Frühstückskarte
          </Link>
        </div>
      </KarteMasthead>

      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <KarteHeading title="Teilnahmebedingungen" />
          <ol className="mt-10 space-y-5 list-decimal pl-6 leading-relaxed text-waldgruen/80">
            {BEDINGUNGEN.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ol>
          <p className="mt-12 text-sm text-waldgruen/60">
            Veranstalter: {SITE.legalName}, {CONTACT.street}, {CONTACT.postalCode}{" "}
            {CONTACT.city}, vertreten durch {COMPANY.ceo}. Fragen gern an{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-tonwarm underline decoration-tonwarm/40 underline-offset-2 hover:text-tonwarm-dark"
            >
              {CONTACT.email}
            </a>{" "}
            oder {CONTACT.phone}.
          </p>
        </div>
      </section>
    </>
  );
}
