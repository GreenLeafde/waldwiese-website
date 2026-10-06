import Link from "next/link";
import type { Metadata } from "next";
import {
  KarteHeading,
  KarteMasthead,
  KarteSpot,
} from "@/components/karte";
import { CONTACT, SITE } from "@/lib/site";

/**
 * Gutschein-Seite. Verkauf und Abwicklung laufen über BON BON — dort liegt
 * unser Partner-Shop. Wir verlinken dorthin, statt den fremden Checkout
 * einzubetten: so bleibt die Zahlung in deren Hand und wir holen uns keine
 * fremden Skripte (und damit kein Einwilligungs-Thema) auf die Seite.
 */
const GUTSCHEIN_SHOP =
  "https://www.bon-bon.de/gutschein/waldwiese-ug-haftungsbeschraenkt/";

export const metadata: Metadata = {
  title: "Gutscheine — Wald & Wiese verschenken",
  description:
    "Gutschein für Wald & Wiese in Sinzing bei Regensburg: Betrag frei wählbar ab 10 €, sofort als PDF per E-Mail oder als Karte per Post, drei Jahre gültig. Einlösbar auf alles — Brunch, Abendessen und Getränke.",
  alternates: { canonical: "/gutscheine" },
  openGraph: {
    title: "Gutscheine — Wald & Wiese verschenken",
    description:
      "Brunch, Abendessen oder einfach einen guten Kaffee verschenken: Gutschein für Wald & Wiese, Betrag frei wählbar, sofort als PDF oder als Karte per Post.",
    url: "/gutscheine",
  },
};

const SCHRITTE = [
  {
    title: "Betrag wählen",
    body: "10, 20, 30, 40, 50, 75, 100 oder 200 Euro — oder ein eigener Betrag. Es ist ein Wertgutschein, er funktioniert also wie Bargeld bei uns.",
  },
  {
    title: "Zustellung aussuchen",
    body: "Sofort als Gutschein-PDF per E-Mail, wenn es schnell gehen muss. Oder als gedruckte Karte per Post, die in zwei bis vier Tagen ankommt.",
  },
  {
    title: "Bezahlen",
    body: "Kreditkarte, PayPal oder giropay. Firmen können auch auf Rechnung bestellen.",
  },
  {
    title: "Bei uns einlösen",
    body: "Einfach mitbringen, wir scannen ihn am Tisch. Der Betrag muss nicht auf einmal weg — Restguthaben bleibt stehen.",
  },
];

const FAQ = [
  {
    q: "Wofür kann ich den Gutschein einlösen?",
    a: "Für alles bei uns: Brunch, Mittag, Abendessen und Getränke. Es ist ein Wertgutschein, kein Gutschein für ein bestimmtes Gericht.",
  },
  {
    q: "Wie lange ist der Gutschein gültig?",
    a: "Drei Jahre. Das genaue Datum steht auf dem Gutschein.",
  },
  {
    q: "Muss ich den ganzen Betrag auf einmal einlösen?",
    a: "Nein. Der Gutschein funktioniert wie Bargeld — was übrig bleibt, bleibt als Guthaben stehen und kann beim nächsten Besuch eingelöst werden.",
  },
  {
    q: "Bekomme ich den Gutschein sofort?",
    a: "Wenn du die Zustellung per E-Mail wählst, ja: Der Gutschein kommt direkt als PDF zum Ausdrucken oder Weiterleiten. Die gedruckte Karte per Post braucht zwei bis vier Tage.",
  },
  {
    q: "Kann ich den Gutschein auch bei euch im Restaurant kaufen?",
    a: `Sprich uns einfach an, wenn du da bist — oder ruf vorher unter ${CONTACT.phone} an.`,
  },
];

export default function GutscheinePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Gutschein für ${SITE.name}`,
    description:
      "Wertgutschein für Wald & Wiese in Sinzing bei Regensburg. Betrag frei wählbar, einlösbar auf Brunch, Abendessen und Getränke, drei Jahre gültig.",
    url: `${SITE.url}/gutscheine`,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "10",
      highPrice: "200",
      availability: "https://schema.org/InStock",
      url: GUTSCHEIN_SHOP,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <KarteMasthead
        kicker="Sinzing bei Regensburg · Familie Leber"
        title="Einen Platz am Tisch"
        accent="verschenken."
        line="Gutscheine · sofort als PDF oder als Karte per Post"
      >
        <p className="mx-auto max-w-2xl text-center text-lg italic leading-relaxed text-waldgruen/70">
          Ein Gutschein für Wald &amp; Wiese ist kein Gegenstand, der
          herumsteht. Er ist ein Vormittag auf der Terrasse, ein Abend mit
          Burgern und Wein oder einfach ein richtig guter Kaffee im Grünen.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <a
            href={GUTSCHEIN_SHOP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-tonwarm px-8 py-4 font-medium text-white transition-colors hover:bg-tonwarm-dark"
          >
            Gutschein kaufen <span aria-hidden>↗</span>
          </a>
          <Link
            href="/speisekarte"
            className="inline-flex items-center gap-3 border-b border-waldgruen/30 pb-1 font-medium text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm"
          >
            Was es bei uns gibt
          </Link>
        </div>
      </KarteMasthead>

      {/* ------------------------------------------------------- SO GEHT'S */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 md:py-24">
          <KarteHeading
            title="So geht's"
            hint="vier Schritte, keine Anmeldung nötig"
          />
          <ol className="mt-12 grid gap-10 sm:grid-cols-2">
            {SCHRITTE.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span
                  aria-hidden
                  className="mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-tonwarm font-display text-sm text-tonwarm"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-waldgruen">
                    {s.title}
                  </p>
                  <p className="mt-2 leading-relaxed text-waldgruen/70">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex justify-center">
            <KarteSpot spot="kaffee" width={240} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- BAND */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24 text-center reveal">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-mehlcreme">
            Drei Jahre Zeit, ihn{" "}
            <span className="accent">einzulösen.</span>
          </h2>
          <p className="mt-7 italic leading-relaxed text-mehlcreme/75">
            Der Gutschein gilt für alles bei uns und muss nicht auf einmal weg.
            Was übrig bleibt, bleibt stehen — also ruhig auch mal nur auf einen
            Kaffee vorbeikommen.
          </p>
          <a
            href={GUTSCHEIN_SHOP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-tonwarm px-8 py-4 font-medium text-white transition-colors hover:bg-tonwarm-dark"
          >
            Jetzt Gutschein kaufen <span aria-hidden>↗</span>
          </a>
          <p className="mt-6 text-[0.8rem] text-mehlcreme/50">
            Kauf und Versand wickelt unser Partner BON BON ab — du wirst dorthin
            weitergeleitet.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------- FAQ */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          <KarteHeading title="Häufige Fragen" />
          <dl className="mt-12 divide-y divide-waldgruen/15">
            {FAQ.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="font-display text-lg font-semibold text-waldgruen">
                  {f.q}
                </dt>
                <dd className="mt-2 leading-relaxed text-waldgruen/70">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 text-center text-waldgruen/60">
            Noch eine Frage offen?{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-tonwarm underline decoration-tonwarm/40 underline-offset-2 hover:text-tonwarm-dark"
            >
              {CONTACT.email}
            </a>{" "}
            oder{" "}
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="text-tonwarm underline decoration-tonwarm/40 underline-offset-2 hover:text-tonwarm-dark"
            >
              {CONTACT.phone}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
