import Link from "next/link";
import type { Metadata } from "next";
import {
  KarteHeading,
  KarteMasthead,
  KarteSpot,
} from "@/components/karte";
import { StickyCta } from "@/components/sticky-cta";
import { CONTACT, SITE } from "@/lib/site";
import { isXmasSeason } from "@/lib/season";

/**
 * Gutschein-Seite. Verkauf und Abwicklung laufen über BON BON — dort liegt
 * unser Partner-Shop. Wir verlinken dorthin, statt den fremden Checkout
 * einzubetten: so bleibt die Zahlung in deren Hand und wir holen uns keine
 * fremden Skripte (und damit kein Einwilligungs-Thema) auf die Seite.
 *
 * Aufbau auf Kauf ausgelegt: Kaufknopf + drei Gründe ganz oben, dann
 * Betrags-Beispiele mit echten Kartenpreisen (jedes mit eigenem Knopf),
 * Firmen, Querverweis Magic Dinner, FAQ — und mobil eine feste Kaufleiste.
 * Bis Heiligabend läuft die Seite in der Weihnachts-Variante (lib/season.ts).
 */
const GUTSCHEIN_SHOP =
  "https://www.bon-bon.de/gutschein/waldwiese-ug-haftungsbeschraenkt/";

const MAGIC_DINNER = "/veranstaltungen/magic-dinner-regensburg-sinzing-2027";

// Stündlich neu bauen, damit die Weihnachts-Variante am 25.12. von selbst endet.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gutscheine — Wald & Wiese verschenken",
  description:
    "Gutschein für Wald & Wiese in Sinzing bei Regensburg — auch als Weihnachtsgeschenk: Betrag frei wählbar ab 10 €, sofort als PDF per E-Mail oder als Karte per Post, drei Jahre gültig. Einlösbar auf alles — Brunch, Abendessen und Getränke.",
  alternates: { canonical: "/gutscheine" },
  openGraph: {
    title: "Gutscheine — Wald & Wiese verschenken",
    description:
      "Brunch, Abendessen oder einfach einen guten Kaffee verschenken: Gutschein für Wald & Wiese, Betrag frei wählbar, sofort als PDF oder als Karte per Post.",
    url: "/gutscheine",
  },
};

/** Die drei Gründe direkt unter dem Kaufknopf — alles Fakten vom Shop. */
const GRUENDE = [
  { title: "Sofort da", body: "als PDF per E-Mail — oder als Karte per Post" },
  { title: "3 Jahre gültig", body: "Restguthaben bleibt stehen" },
  { title: "Für alles", body: "Brunch, Mittag, Abendessen, Getränke" },
];

/**
 * Betrags-Beispiele. Rechnung mit echten Preisen aus lib/menu.ts,
 * lib/dinner-menu.ts und lib/drinks.ts — bei Preisänderungen hier nachziehen.
 */
const BETRAEGE = [
  {
    amount: "40 €",
    title: "Frühstück zu zweit",
    body: "„Der gute alte Sepp“ für zwei (32,90 €) und zwei Kaffee Crema (je 3,50 €) — macht 39,90 €.",
  },
  {
    amount: "50 €",
    title: "Burger-Abend zu zweit",
    body: "Zweimal „Der klassische Heinzi“ mit Pommes (je 13,50 € + 4,50 €) — 36,00 €, der Rest reicht für die Getränke.",
  },
  {
    amount: "100 €",
    title: "Ein Abend zu viert",
    body: "Vier Burger mit Pommes kosten 72,00 € — mit 100 € ist auch die erste Runde Getränke drin.",
  },
];

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
    body: "Kreditkarte, PayPal oder giropay.",
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
    q: "Reicht es noch bis Weihnachten?",
    a: "Mit dem PDF immer — es kommt sofort per E-Mail, also auch noch an Heiligabend. Für die gedruckte Karte per Post rechne zwei bis vier Tage Versand ein.",
  },
  {
    q: "Können Firmen Gutscheine für ihr Team bestellen?",
    a: "Ja. Im Gutschein-Shop wählst du einfach die gewünschte Anzahl — so bestellst du mehrere Gutscheine auf einmal.",
  },
  {
    q: "Kann ich den Gutschein auch bei euch im Restaurant kaufen?",
    a: `Sprich uns einfach an, wenn du da bist — oder ruf vorher unter ${CONTACT.phone} an.`,
  },
];

function BuyButton({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <a
      href={GUTSCHEIN_SHOP}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full px-8 py-4 font-medium transition-colors ${
        tone === "light"
          ? "bg-mehlcreme text-waldgruen hover:bg-white"
          : "bg-tonwarm text-white hover:bg-tonwarm-dark"
      }`}
    >
      {children} <span aria-hidden>↗</span>
    </a>
  );
}

export default function GutscheinePage() {
  const xmas = isXmasSeason();

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
        kicker={
          xmas
            ? "Weihnachten · Sinzing bei Regensburg"
            : "Sinzing bei Regensburg · Familie Leber"
        }
        title={xmas ? "Weihnachten am Tisch" : "Einen Platz am Tisch"}
        accent="verschenken."
        line={
          xmas
            ? "Gutschein ab 10 € · sofort als PDF — auch noch an Heiligabend"
            : "Gutscheine · sofort als PDF oder als Karte per Post"
        }
      >
        <p className="mx-auto max-w-2xl text-center text-lg italic leading-relaxed text-waldgruen/70">
          Ein Gutschein für Wald &amp; Wiese ist kein Gegenstand, der
          herumsteht. Er ist ein Vormittag auf der Terrasse, ein Abend mit
          Burgern und Wein oder einfach ein richtig guter Kaffee im Grünen.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <BuyButton>Gutschein kaufen</BuyButton>
          <a
            href="#betrag"
            className="inline-flex items-center gap-3 border-b border-waldgruen/30 pb-1 font-medium text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm"
          >
            Welcher Betrag passt? <span aria-hidden>↓</span>
          </a>
        </div>
        <ul className="mx-auto mt-12 grid max-w-3xl gap-6 text-center sm:grid-cols-3">
          {GRUENDE.map((g) => (
            <li key={g.title}>
              <p className="font-display text-lg font-semibold text-waldgruen">
                {g.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-waldgruen/65">
                {g.body}
              </p>
            </li>
          ))}
        </ul>
      </KarteMasthead>

      {/* -------------------------------------------------------- BETRÄGE */}
      <section id="betrag" className="scroll-mt-24 bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-16 md:pb-24">
          <KarteHeading
            title="Welcher Betrag passt?"
            hint="gerechnet mit unseren echten Kartenpreisen"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BETRAEGE.map((b) => (
              <div
                key={b.amount}
                className="flex flex-col rounded-2xl bg-white p-7 ring-1 ring-waldgruen/10"
              >
                <p className="font-display text-4xl text-tonwarm">{b.amount}</p>
                <p className="mt-3 font-display text-lg font-semibold text-waldgruen">
                  {b.title}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-waldgruen/70">
                  {b.body}
                </p>
                <a
                  href={GUTSCHEIN_SHOP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-tonwarm px-5 py-2.5 text-sm font-medium text-tonwarm transition-colors hover:bg-tonwarm hover:text-white"
                >
                  {b.amount} verschenken <span aria-hidden>↗</span>
                </a>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-waldgruen/60">
            Oder jeden anderen Betrag ab 10 € — im Shop frei eintragbar.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- LAST MINUTE */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-20 text-center reveal">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal leading-[1.05] tracking-tight text-mehlcreme">
            {xmas ? "Noch kein Geschenk?" : "Muss es schnell gehen?"}{" "}
            <span className="accent">In zwei Minuten erledigt.</span>
          </h2>
          <p className="mt-7 italic leading-relaxed text-mehlcreme/75">
            Als PDF kommt der Gutschein sofort per E-Mail — zum Ausdrucken
            oder direkt Weiterleiten
            {xmas ? ", also auch noch an Heiligabend" : ""}. Die gedruckte
            Karte per Post braucht zwei bis vier Tage.
          </p>
          <div className="mt-9">
            <BuyButton>Jetzt Gutschein kaufen</BuyButton>
          </div>
          <p className="mt-6 text-[0.8rem] text-mehlcreme/50">
            Kauf und Versand wickelt unser Partner BON BON ab — du wirst dorthin
            weitergeleitet.
          </p>
        </div>
      </section>

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

      {/* --------------------------------------------- FIRMEN + MAGIC DINNER */}
      <section className="bg-mehlcreme border-t border-waldgruen/15">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:px-10 py-16 md:py-24 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-white p-8 ring-1 ring-waldgruen/10">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-tonwarm">
              Für Firmen
            </p>
            <h2 className="mt-4 font-display text-2xl leading-tight text-waldgruen">
              {xmas ? "Ein Weihnachtsgeschenk fürs Team" : "Ein Dankeschön fürs Team"}
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-waldgruen/70">
              Im Shop einfach die Anzahl wählen — so bestellst du gleich
              mehrere Gutscheine. Eingelöst wird, wann es passt: drei Jahre
              lang, für Brunch, Mittag oder Abendessen.
            </p>
            <div className="mt-7">
              <BuyButton>Gutscheine bestellen</BuyButton>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl bg-waldgruen p-8 text-mehlcreme">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-tonwarm">
              Lieber ein Erlebnis?
            </p>
            <h2 className="mt-4 font-display text-2xl leading-tight text-mehlcreme">
              Magic Dinner am 20. Februar 2027
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-mehlcreme/75">
              3-Gänge-Menü und Zaubershow direkt am Tisch — 89,90 € pro Person.
              Tickets online oder bei uns an der Bar.
            </p>
            <div className="mt-7">
              <Link
                href={MAGIC_DINNER}
                className="inline-flex items-center gap-2 rounded-full bg-mehlcreme px-8 py-4 font-medium text-waldgruen transition-colors hover:bg-white"
              >
                Zum Magic Dinner <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- FAQ */}
      <section className="bg-mehlcreme border-t border-waldgruen/15">
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

          <div className="mt-12 flex justify-center">
            <BuyButton>Gutschein kaufen</BuyButton>
          </div>

          <p className="mt-10 text-center text-waldgruen/60">
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

      <StickyCta
        href={GUTSCHEIN_SHOP}
        label="Gutschein kaufen"
        note="ab 10 € · sofort als PDF"
      />
    </>
  );
}
