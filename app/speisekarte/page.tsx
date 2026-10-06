import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import {
  KarteColumn,
  KarteFineprint,
  KarteMasthead,
  KarteSpot,
  type KarteDishData,
} from "@/components/karte";
import { RESERVATION_URL, SITE } from "@/lib/site";
import { BREAKFAST_MENU } from "@/lib/menu";
import { BURGER_CHOICES, DINNER_MENU } from "@/lib/dinner-menu";

export const metadata: Metadata = {
  title:
    "Speisekarte — Frühstück, Mittag & Abend | Wald & Wiese Sinzing bei Regensburg",
  description:
    "Die ganze Speisekarte von Wald & Wiese in Sinzing bei Regensburg: Frühstück & Mittag täglich 8–14 Uhr (Frühstücke ab 11,90 €, Brote, Bowls 9,90 €, Currywurst, Burger ab 13,90 €) und Abend Fr–So 17–22 Uhr (Burger, Bowls, vom Grill, Finale). Regional, hausgemacht, vegan & vegetarisch.",
  alternates: { canonical: "/speisekarte" },
};

/**
 * Preis für schema.org: „14,90 €" → „14.90". Bei mehreren Größen zählt die
 * erste (günstigste). Gibt null zurück, wenn kein Betrag drinsteckt (z. B.
 * „inklusive") — dann bleibt `offers` weg, statt eine 0 zu behaupten.
 */
function schemaPrice(price: string | string[]): string | null {
  const first = Array.isArray(price) ? price[0] : price;
  const m = first.match(/(\d+),(\d{2})/);
  return m ? `${m[1]}.${m[2]}` : null;
}

/** schema.org-Diät aus unseren Tags — „möglich" zählt bewusst nicht mit. */
function schemaDiet(tags?: readonly string[]): string[] {
  if (!tags) return [];
  if (tags.includes("vegan")) return ["https://schema.org/VeganDiet"];
  if (tags.includes("vegetarisch")) return ["https://schema.org/VegetarianDiet"];
  return [];
}

function schemaMenuItem(d: KarteDishData) {
  const price = schemaPrice(d.price);
  const diets = schemaDiet(d.tags);
  return {
    "@type": "MenuItem",
    name: d.name,
    ...(d.desc ? { description: d.desc } : {}),
    ...(diets.length ? { suitableForDiet: diets } : {}),
    ...(price
      ? { offers: { "@type": "Offer", price, priceCurrency: "EUR" } }
      : {}),
  };
}

// Brunch-Karte in Frühstück (alles außer Mittags) und Mittag aufteilen.
const FRUEHSTUECK_CATS = BREAKFAST_MENU.filter((c) => c.slug !== "mittags");
const MITTAG_CATS = BREAKFAST_MENU.filter((c) => c.slug === "mittags");

/** Welcher Freisteller zu welcher Kategorie gehört. */
const SPOT_BY_SLUG = {
  fruehstueck: { spot: "brett", width: 250 },
  brote: { spot: "brote", width: 280 },
  bowls: { spot: "bowl", width: 215 },
  extras: { spot: "kinder", width: 215 },
  burger: { spot: "burger", width: 260 },
} as const;

const DAYPART_TABS = [
  { slug: "fruehstueck", title: "Frühstück" },
  { slug: "mittag", title: "Mittag" },
  { slug: "abend", title: "Abend" },
  { slug: "getraenke", title: "Getränke" },
];

/** Schmales Grünband als Tageszeit-Trenner — gibt der Papierfläche Rhythmus. */
function DaypartBand({
  id,
  eyebrow,
  title,
  time,
  note,
}: {
  id: string;
  eyebrow: string;
  title: string;
  time: string;
  note: string;
}) {
  return (
    <section
      id={id}
      className="bg-waldgruen text-mehlcreme scroll-mt-[150px]"
    >
      <div className="mx-auto max-w-3xl px-6 md:px-10 py-14 md:py-20 text-center reveal">
        <p className="text-[0.62rem] tracking-[0.3em] uppercase text-tonwarm">
          {eyebrow}
        </p>
        <h2 className="mt-5 font-display font-normal leading-[0.95] tracking-tight text-mehlcreme text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="mt-5 text-[0.7rem] tracking-[0.26em] uppercase text-mehlcreme/70">
          {time}
        </p>
        <p className="mt-6 italic text-mehlcreme/70 max-w-xl mx-auto leading-relaxed">
          {note}
        </p>
      </div>
    </section>
  );
}

/** Zweispaltiger Satzspiegel mit Haarlinie dazwischen — wie auf der Karte. */
function KarteGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="md:columns-2 [column-gap:3.5rem] lg:[column-gap:4.5rem]"
      style={{ columnRule: "1px solid rgba(46,61,44,0.16)" }}
    >
      {children}
    </div>
  );
}

export default function SpeisekartePage() {
  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Speisekarte",
    url: `${SITE.url}/speisekarte`,
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Frühstück & Mittag (täglich 8–14 Uhr)",
        hasMenuSection: BREAKFAST_MENU.map((cat) => ({
          "@type": "MenuSection",
          name: cat.title,
          hasMenuItem: cat.items.map(schemaMenuItem),
        })),
      },
      {
        "@type": "MenuSection",
        name: "Abend (Fr–So 17–22 Uhr)",
        hasMenuSection: DINNER_MENU.map((cat) => ({
          "@type": "MenuSection",
          name: cat.title,
          hasMenuItem: cat.items.map(schemaMenuItem),
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />

      <KarteMasthead
        kicker="Sinzing bei Regensburg · Familie Leber"
        title="Die ganze"
        accent="Karte."
        line="Frühstück & Mittag täglich 8 – 14 Uhr · Abends Freitag bis Sonntag 17 – 22 Uhr"
      >
        <div className="flex flex-wrap justify-center items-center gap-5">
          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-tonwarm px-7 py-3.5 font-medium text-white transition-colors hover:bg-tonwarm-dark"
          >
            Tisch reservieren <span aria-hidden>→</span>
          </a>
          <Link
            href="/getraenke"
            className="inline-flex items-center gap-3 border-b border-waldgruen/30 pb-1 font-medium text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm"
          >
            Getränkekarte
          </Link>
        </div>
      </KarteMasthead>

      <CategoryTabs tabs={DAYPART_TABS} scrollOffset={150} />

      {/* ---------------------------------------------------- FRÜHSTÜCK */}
      <DaypartBand
        id="fruehstueck"
        eyebrow="Tageszeit · 1"
        title="Frühstück"
        time="täglich · 8 – 14 Uhr"
        note="Frühstücke mit Namen, Brote, „Schmusi“-Bowls und Extras — hausgemacht, regional, vegan und vegetarisch gleichberechtigt."
      />
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 md:py-24">
          <KarteGrid>
            {FRUEHSTUECK_CATS.map((cat) => {
              const s = SPOT_BY_SLUG[cat.slug as keyof typeof SPOT_BY_SLUG];
              return (
                <div key={cat.slug} className="mb-14 break-inside-avoid">
                  <KarteColumn
                    title={cat.title}
                    hint={cat.hint}
                    items={cat.items as readonly KarteDishData[]}
                    spot={s?.spot}
                    spotWidth={s?.width}
                  />
                </div>
              );
            })}
          </KarteGrid>
        </div>
      </section>

      {/* -------------------------------------------------------- MITTAG */}
      <DaypartBand
        id="mittag"
        eyebrow="Tageszeit · 2"
        title="Mittag"
        time="täglich · ab 11:30 – 14 Uhr"
        note="Ab 11:30 Uhr wird aus dem Frühstück Mittag: Currywurst, Burger und ein Salat, der satt macht."
      />
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
          {MITTAG_CATS.map((cat) => (
            <KarteColumn
              key={cat.slug}
              title={cat.title}
              hint={cat.hint}
              items={cat.items as readonly KarteDishData[]}
            />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- ABEND */}
      <DaypartBand
        id="abend"
        eyebrow="Tageszeit · 3"
        title="Abend"
        time="Fr · Sa · So · 17 – 22 Uhr"
        note="Burger mit Namen, Bowls aus dem Märchenbuch, Steak und Lachs vom Grill — und ein süßes Finale. Nur am Wochenende."
      />
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 md:py-24">
          <KarteGrid>
            {DINNER_MENU.map((cat) => {
              const s = SPOT_BY_SLUG[cat.slug as keyof typeof SPOT_BY_SLUG];
              return (
                <div key={cat.slug} className="mb-14 break-inside-avoid">
                  <KarteColumn
                    title={cat.title}
                    hint={cat.hint}
                    items={cat.items as readonly KarteDishData[]}
                    spot={s?.spot}
                    spotWidth={s?.width}
                  />
                </div>
              );
            })}
          </KarteGrid>

          {/* Burger-Baukasten — als eingerahmter Kasten wie die Notizen
              auf der gedruckten Karte */}
          <div className="mt-6 rounded-sm border border-waldgruen/25 px-7 py-9 md:px-10 md:py-11">
            <p className="text-center font-display text-xl uppercase tracking-[0.14em] text-waldgruen">
              Beim Burger
            </p>
            <p className="mt-4 text-center text-[0.95rem] leading-relaxed text-waldgruen/70">
              {BURGER_CHOICES.bunNote}: {BURGER_CHOICES.buns.join(" oder ")} ·
              Patty nach Wahl: {BURGER_CHOICES.patties.join(", ")}
            </p>
            <div className="mt-9 grid gap-10 sm:grid-cols-2">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-tonwarm">
                  Dazu
                </p>
                <ul className="mt-4 space-y-2 font-display text-waldgruen">
                  {BURGER_CHOICES.sides.map((s) => (
                    <li key={s.label} className="flex justify-between gap-4">
                      <span>{s.label}</span>
                      <span className="text-waldgruen/55">{s.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.26em] text-tonwarm">
                  Extras
                </p>
                <ul className="mt-4 space-y-2 font-display text-waldgruen">
                  {BURGER_CHOICES.extras.map((e) => (
                    <li key={e.label} className="flex justify-between gap-4">
                      <span>{e.label}</span>
                      <span className="text-waldgruen/55">{e.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <KarteFineprint />
        </div>
      </section>

      {/* ------------------------------------------------------ GETRÄNKE */}
      <section
        id="getraenke"
        className="bg-waldgruen text-mehlcreme scroll-mt-[150px]"
      >
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <p className="text-[0.62rem] tracking-[0.3em] uppercase text-tonwarm">
            Tageszeit · rund um die Uhr
          </p>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Getränke &amp; <span className="accent">Bar.</span>
          </h2>
          <p className="mt-7 italic text-mehlcreme/75 leading-relaxed max-w-xl mx-auto">
            Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
            Spritz und Cocktails — auch entkoffeiniert und alkoholfrei. Die
            ganze Getränkekarte gibt es auf einer eigenen Seite.
          </p>
          <div className="mt-9 flex justify-center">
            <KarteSpot spot="kaffee" width={220} />
          </div>
          <Link
            href="/getraenke"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-tonwarm px-7 py-3.5 font-medium text-white transition-colors hover:bg-tonwarm-dark"
          >
            Zur Getränkekarte <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
