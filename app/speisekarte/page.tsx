import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { DaySection } from "@/components/day-section";
import {
  KarteColumn,
  KarteFineprint,
  KarteMasthead,
  KarteSpot,
  type KarteDishData,
  type KarteTone,
} from "@/components/karte";
import { ReserveButton } from "@/components/reserve-chooser";
import { ScrollDay } from "@/components/scroll-day";
import { SITE } from "@/lib/site";
import { BREAKFAST_MENU } from "@/lib/menu";
import { BURGER_CHOICES, DINNER_MENU } from "@/lib/dinner-menu";

export const metadata: Metadata = {
  title:
    "Speisekarte — Frühstück, Mittag & Abend | Wald & Wiese Sinzing bei Regensburg",
  description:
    "Die ganze Speisekarte von Wald & Wiese in Sinzing bei Regensburg: Frühstück & Mittag täglich 8–14 Uhr (Frühstücke ab 11,90 €, Brote, Bowls 9,90 €, Currywurst, Burger ab 13,90 €) und Abend Fr–So 17–22 Uhr (Burger, Bowls, vom Grill, Finale). Regional, hausgemacht, vegan & vegetarisch.",
  alternates: { canonical: "/speisekarte" },
};

/* ----------------------------------------------------------------------------
 * Speisekarte als Tag: oben hell (Frühstück, Mittag), unten dunkel (Abend,
 * Getränke). ScrollDay blendet den Hintergrund zwischen den Stufen, die
 * Sprungleiste läuft mit. Daten aus lib/menu.ts und lib/dinner-menu.ts.
 * ------------------------------------------------------------------------- */

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";
const BTN_A = "inline-flex h-[50px] items-center justify-center rounded-full bg-akzent px-[26px] text-[0.95rem] font-semibold text-white transition-colors hover:bg-akzent-hover";
const LINK = "font-semibold border-b-[1.5px] border-current pb-0.5";

/** Preis für schema.org: „14,90 €" → „14.90". */
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
    ...(price ? { offers: { "@type": "Offer", price, priceCurrency: "EUR" } } : {}),
  };
}

const FRUEHSTUECK_CATS = BREAKFAST_MENU.filter((c) => c.slug !== "mittags");
const MITTAG_CATS = BREAKFAST_MENU.filter((c) => c.slug === "mittags");

/** Welcher Freisteller zu welcher Kategorie gehört. */
const SPOT_BY_SLUG = {
  fruehstueck: { spot: "brett", width: 220 },
  brote: { spot: "brote", width: 240 },
  bowls: { spot: "bowl", width: 190 },
  extras: { spot: "kinder", width: 190 },
  burger: { spot: "burger", width: 230 },
} as const;

const DAYPART_TABS = [
  { slug: "fruehstueck", title: "Frühstück" },
  { slug: "mittag", title: "Mittag" },
  { slug: "abend", title: "Abend" },
  { slug: "getraenke", title: "Getränke" },
];

/** Kopf einer Tageszeit: Label, Überschrift, Zeit, ein Satz. */
function Daypart({
  label,
  title,
  time,
  note,
  tone,
  cta,
}: {
  label: string;
  title: string;
  time: string;
  note: string;
  tone: KarteTone;
  cta?: React.ReactNode;
}) {
  return (
    <div className="mb-10 grid gap-3 md:mb-14 md:flex md:items-end md:justify-between md:gap-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">{label}</span>
        <h2 className="mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.75rem]">
          {title} <span className="block font-light md:inline">{time}</span>
        </h2>
        <p className={`mt-3 max-w-[56ch] leading-relaxed ${tone === "light" ? "text-creme/75" : "text-muted-hell"}`}>
          {note}
        </p>
      </div>
      {cta && <div className="shrink-0">{cta}</div>}
    </div>
  );
}

/** Zweispaltiges Raster der Kategorien. */
function KarteGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-16">{children}</div>;
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

      <ScrollDay>
        <DaySection stage="morgen">
          <KarteMasthead
            kicker="Sinzing bei Regensburg · Familie Leber"
            title="Die ganze"
            accent="Karte."
            line="Frühstück und Mittag täglich 8 bis 14 Uhr, abends Freitag bis Sonntag 17 bis 22 Uhr. Alles hausgemacht, vegan und vegetarisch gleichberechtigt."
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ReserveButton location="speisekarte" className={BTN_A}>
                Tisch reservieren
              </ReserveButton>
              <Link href="/getraenke" className={LINK}>
                Getränkekarte
              </Link>
            </div>
          </KarteMasthead>
        </DaySection>

        <CategoryTabs tabs={DAYPART_TABS} scrollOffset={150} />

        {/* ---------------------------------------------------- FRÜHSTÜCK */}
        <DaySection stage="morgen-2" id="fruehstueck" className="scroll-mt-[150px] py-14 md:py-20">
          <div className={CONTAINER}>
            <Daypart
              label="Morgens"
              title="Frühstück"
              time="täglich 8–14 Uhr"
              note="Frühstücke mit Namen, Brote, „Schmusi“-Bowls und Extras."
              tone="dark"
              cta={
                <ReserveButton location="speisekarte-fruehstueck" pre="brunch" className={BTN_A}>
                  Brunch reservieren
                </ReserveButton>
              }
            />
            <KarteGrid>
              {FRUEHSTUECK_CATS.map((cat) => {
                const s = SPOT_BY_SLUG[cat.slug as keyof typeof SPOT_BY_SLUG];
                return (
                  <KarteColumn
                    key={cat.slug}
                    title={cat.title}
                    hint={cat.hint}
                    items={cat.items as readonly KarteDishData[]}
                    spot={s?.spot}
                    spotWidth={s?.width}
                  />
                );
              })}
            </KarteGrid>
          </div>
        </DaySection>

        {/* -------------------------------------------------------- MITTAG */}
        <DaySection stage="vormittag" id="mittag" className="scroll-mt-[150px] py-14 md:py-20">
          <div className={CONTAINER}>
            <Daypart
              label="Mittags"
              title="Mittag"
              time="täglich 11:30–14 Uhr"
              note="Ab 11:30 Uhr kommt zur Frühstückskarte noch Mittag dazu: Currywurst, Burger und ein Salat, der satt macht. Frühstück gibt es weiter bis 14 Uhr."
              tone="dark"
            />
            <div className="max-w-[720px]">
              {MITTAG_CATS.map((cat) => (
                <KarteColumn
                  key={cat.slug}
                  title={cat.title}
                  hint={cat.hint}
                  items={cat.items as readonly KarteDishData[]}
                />
              ))}
            </div>
          </div>
        </DaySection>

        {/* --------------------------------------------------------- ABEND */}
        <DaySection stage="abend" id="abend" className="scroll-mt-[150px] py-14 md:py-20">
          <div className={CONTAINER}>
            <Daypart
              label="Abends"
              title="Abend"
              time="Fr–So 17–22 Uhr"
              note="Burger mit Namen, Bowls aus dem Märchenbuch, Steak und Lachs vom Grill und ein süßes Finale. Nur am Wochenende."
              tone="light"
              cta={
                <ReserveButton location="speisekarte-abend" pre="abend" className={BTN_A}>
                  Abend reservieren
                </ReserveButton>
              }
            />
            <KarteGrid>
              {DINNER_MENU.map((cat) => {
                const s = SPOT_BY_SLUG[cat.slug as keyof typeof SPOT_BY_SLUG];
                return (
                  <KarteColumn
                    key={cat.slug}
                    title={cat.title}
                    hint={cat.hint}
                    items={cat.items as readonly KarteDishData[]}
                    spot={s?.spot}
                    spotWidth={s?.width}
                    tone="light"
                  />
                );
              })}
            </KarteGrid>

            {/* Burger-Baukasten */}
            <div className="mt-12 grid gap-8 border-t border-creme/15 pt-8 md:grid-cols-[1fr_1fr_1fr]">
              <div>
                <h3 className="font-display text-[1.4rem] font-normal">Beim Burger</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-creme/75">
                  {BURGER_CHOICES.bunNote}: {BURGER_CHOICES.buns.join(" oder ")}. Patty nach Wahl:{" "}
                  {BURGER_CHOICES.patties.join(" oder ")}.
                </p>
              </div>
              {[
                { t: "Dazu", list: BURGER_CHOICES.sides },
                { t: "Extras", list: BURGER_CHOICES.extras },
              ].map((g) => (
                <div key={g.t}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">{g.t}</p>
                  <ul className="mt-3 grid gap-1.5">
                    {g.list.map((x) => (
                      <li key={x.label} className="flex justify-between gap-4 text-[0.95rem]">
                        <span>{x.label}</span>
                        <span className="tabular-nums text-creme/75">{x.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <KarteFineprint tone="light" />
          </div>
        </DaySection>

        {/* ------------------------------------------------------ GETRÄNKE */}
        <DaySection stage="wald" id="getraenke" className="scroll-mt-[150px] py-14 md:py-20">
          <div className={`${CONTAINER} grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-16`}>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">
                Rund um die Uhr
              </span>
              <h2 className="mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.75rem]">
                Getränke und Bar
              </h2>
              <p className="mt-3 max-w-[52ch] leading-relaxed text-creme/75">
                Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine, Spritz und
                Cocktails, auch entkoffeiniert und alkoholfrei. Die ganze Getränkekarte hat
                eine eigene Seite.
              </p>
              <Link href="/getraenke" className={`${BTN_A} mt-7`}>
                Zur Getränkekarte
              </Link>
            </div>
            <KarteSpot spot="kaffee" width={200} className="justify-self-center" />
          </div>
        </DaySection>
      </ScrollDay>
    </>
  );
}
