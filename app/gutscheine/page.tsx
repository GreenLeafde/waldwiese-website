import Link from "next/link";
import type { Metadata } from "next";
import { DaySection } from "@/components/day-section";
import { KarteSpot } from "@/components/karte";
import { PageTone } from "@/components/page-tone";
import { StickyCta } from "@/components/sticky-cta";
import { CONTACT, SITE } from "@/lib/site";
import { isXmasSeason } from "@/lib/season";

/**
 * Gutschein-Seite (Redesign 10/2026, dunkel). Verkauf und Abwicklung laufen
 * über BON BON — dort liegt unser Partner-Shop. Wir verlinken dorthin, statt
 * den fremden Checkout einzubetten: so bleibt die Zahlung in deren Hand und
 * wir holen uns keine fremden Skripte auf die Seite.
 *
 * Aufbau auf Kauf ausgelegt: Kaufknopf + drei Gründe oben, Betrags-Beispiele
 * mit echten Kartenpreisen (jedes mit eigenem Knopf), vier Schritte, Firmen,
 * Magic Dinner, FAQ — und mobil eine feste Kaufleiste. Bis Heiligabend läuft
 * die Seite in der Weihnachts-Variante (lib/season.ts).
 */
const GUTSCHEIN_SHOP =
  "https://www.bon-bon.de/gutschein/waldwiese-ug-haftungsbeschraenkt/";

const MAGIC_DINNER = "/veranstaltungen/magic-dinner-regensburg-sinzing-2027";

// Stündlich neu bauen, damit die Weihnachts-Variante am 25.12. von selbst endet.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Gutscheine — Wald & Wiese verschenken" },
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

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";
const LABEL = "text-xs font-semibold uppercase tracking-[0.16em] text-akzent";
const H2 = "mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]";
const MUTED = "text-creme/75";

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
  outline = false,
  className = "",
}: {
  children: React.ReactNode;
  outline?: boolean;
  className?: string;
}) {
  return (
    <a
      href={GUTSCHEIN_SHOP}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-[50px] items-center justify-center gap-2 rounded-full px-[26px] text-[0.95rem] font-semibold transition-colors ${
        outline
          ? "shadow-[inset_0_0_0_1.5px_currentColor] hover:bg-creme/10"
          : "bg-akzent text-white hover:bg-akzent-hover"
      } ${className}`}
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
      <PageTone tone="dunkel" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* KOPF + GRÜNDE */}
      <DaySection stage="tanne" className="pt-[116px] pb-14 md:pt-[140px] md:pb-20">
        <div className={CONTAINER}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-creme/60 hover:underline underline-offset-4"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
          <p className={`mt-8 ${LABEL}`}>
            {xmas ? "Weihnachten · Sinzing bei Regensburg" : "Gutscheine · Sinzing bei Regensburg"}
          </p>
          <h1 className="mt-3 max-w-[18ch] font-display text-[2.6rem] font-light leading-[1.05] md:text-[3.75rem]">
            {xmas ? "Weihnachten am Tisch" : "Einen Platz am Tisch"}{" "}
            <span className="font-normal">verschenken.</span>
          </h1>
          <p className={`mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed ${MUTED}`}>
            Ein Gutschein für Wald &amp; Wiese ist kein Gegenstand, der herumsteht. Er ist ein
            Vormittag auf der Terrasse, ein Abend mit Burgern und Wein oder einfach ein richtig
            guter Kaffee im Grünen.
            {xmas ? " Als PDF kommt er sofort, auch noch an Heiligabend." : ""}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <BuyButton>Gutschein kaufen</BuyButton>
            <a href="#betrag" className="font-semibold border-b-[1.5px] border-current pb-0.5">
              Welcher Betrag passt?
            </a>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3 md:gap-10">
            {GRUENDE.map((g) => (
              <li key={g.title} className="border-t border-creme/20 pt-4">
                <p className="font-display text-[1.3rem] font-normal">{g.title}</p>
                <p className={`mt-1 text-sm ${MUTED}`}>{g.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </DaySection>

      {/* BETRÄGE */}
      <DaySection stage="abend" id="betrag" className="scroll-mt-24 py-14 md:py-20">
        <div className={CONTAINER}>
          <p className={LABEL}>Welcher Betrag passt?</p>
          <h2 className={H2}>Gerechnet mit unseren echten Kartenpreisen</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {BETRAEGE.map((b) => (
              <div key={b.amount} className="grid content-start gap-2 border-t border-creme/20 pt-5">
                <p className="font-display text-[2.4rem] font-light leading-none">{b.amount}</p>
                <p className="font-display text-[1.3rem] font-normal leading-tight">{b.title}</p>
                <p className={`text-[0.95rem] leading-relaxed ${MUTED}`}>{b.body}</p>
                <a
                  href={GUTSCHEIN_SHOP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex h-11 w-fit items-center gap-2 rounded-full px-5 text-sm font-semibold shadow-[inset_0_0_0_1.5px_currentColor] transition-colors hover:bg-creme/10"
                >
                  {b.amount} verschenken <span aria-hidden>↗</span>
                </a>
              </div>
            ))}
          </div>
          <p className={`mt-8 text-sm ${MUTED}`}>Oder jeden anderen Betrag ab 10 €, im Shop frei eintragbar.</p>
        </div>
      </DaySection>

      {/* SO GEHT'S */}
      <DaySection stage="wald" className="py-14 md:py-20">
        <div className={`${CONTAINER} grid gap-10 md:grid-cols-[1fr_auto] md:gap-16`}>
          <div>
            <p className={LABEL}>So geht’s</p>
            <h2 className={H2}>Vier Schritte, keine Anmeldung nötig</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-x-10">
              {SCHRITTE.map((s, i) => (
                <li key={s.title} className="border-t border-creme/20 pt-4">
                  <p className="font-display text-[1.3rem] font-normal">
                    <span className="mr-3 font-light text-akzent">{i + 1}</span>
                    {s.title}
                  </p>
                  <p className={`mt-1.5 text-[0.95rem] leading-relaxed ${MUTED}`}>{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <BuyButton>{xmas ? "Jetzt Gutschein kaufen" : "Gutschein kaufen"}</BuyButton>
              <p className={`mt-4 text-sm ${MUTED}`}>
                Kauf und Versand wickelt unser Partner BON BON ab, du wirst dorthin weitergeleitet.
              </p>
            </div>
          </div>
          <KarteSpot spot="kaffee" width={200} className="hidden self-center md:block" />
        </div>
      </DaySection>

      {/* FIRMEN + MAGIC DINNER */}
      <DaySection stage="wald-2" className="py-14 md:py-20">
        <div className={`${CONTAINER} grid gap-10 md:grid-cols-2 md:gap-16`}>
          <div className="border-t border-creme/20 pt-5">
            <p className={LABEL}>Für Firmen</p>
            <h2 className={H2}>{xmas ? "Ein Weihnachtsgeschenk fürs Team" : "Ein Dankeschön fürs Team"}</h2>
            <p className={`mt-3 leading-relaxed ${MUTED}`}>
              Im Shop einfach die Anzahl wählen, so bestellst du gleich mehrere Gutscheine.
              Eingelöst wird, wann es passt: drei Jahre lang, für Brunch, Mittag oder Abendessen.
            </p>
            <BuyButton outline className="mt-6">Gutscheine bestellen</BuyButton>
          </div>
          <div className="border-t border-creme/20 pt-5">
            <p className={LABEL}>Lieber ein Erlebnis?</p>
            <h2 className={H2}>Magic Dinner am 20. Februar 2027</h2>
            <p className={`mt-3 leading-relaxed ${MUTED}`}>
              3-Gänge-Menü und Zaubershow zwischen den Gängen, 89,90 € pro Person. Tickets online
              oder bei uns an der Bar.
            </p>
            <Link
              href={MAGIC_DINNER}
              className="mt-6 inline-flex h-[50px] items-center rounded-full px-[26px] text-[0.95rem] font-semibold shadow-[inset_0_0_0_1.5px_currentColor] transition-colors hover:bg-creme/10"
            >
              Zum Magic Dinner
            </Link>
          </div>
        </div>
      </DaySection>

      {/* FAQ */}
      <DaySection stage="nacht" className="py-14 md:py-20">
        <div className={`${CONTAINER} max-w-[860px]`}>
          <p className={LABEL}>Häufige Fragen</p>
          <h2 className={H2}>Gut zu wissen</h2>
          <dl className="mt-8">
            {FAQ.map((f) => (
              <div key={f.q} className="border-t border-creme/15 py-5">
                <dt className="font-display text-[1.25rem] font-normal">{f.q}</dt>
                <dd className={`mt-2 leading-relaxed ${MUTED}`}>{f.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-creme/15 pt-8">
            <BuyButton>Gutschein kaufen</BuyButton>
            <p className={`m-0 text-sm ${MUTED}`}>
              Noch eine Frage?{" "}
              <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">
                {CONTACT.email}
              </a>{" "}
              oder{" "}
              <a href={`tel:${CONTACT.phoneRaw}`} className="underline underline-offset-4">
                {CONTACT.phone}
              </a>
            </p>
          </div>
        </div>
      </DaySection>

      <StickyCta
        href={GUTSCHEIN_SHOP}
        label="Gutschein kaufen"
        note="ab 10 € · sofort als PDF"
      />
    </>
  );
}
