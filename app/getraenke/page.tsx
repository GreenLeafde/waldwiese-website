import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { DaySection, type DayStage } from "@/components/day-section";
import {
  KarteFineprint,
  KarteHeading,
  KarteMasthead,
  KarteSpot,
  type KarteTone,
  type SpotKey,
} from "@/components/karte";
import { ReserveButton } from "@/components/reserve-chooser";
import { ScrollDay } from "@/components/scroll-day";
import { DRINK_CATEGORIES, type Drink, type DrinkCategory } from "@/lib/drinks";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Getränkekarte — Kaffee, Limonaden, Wein, Spritz & Cocktails",
  description:
    "Die ganze Getränkekarte von Wald & Wiese in Sinzing bei Regensburg: Kaffee ab 2,80 €, fünf hausgemachte Limonaden à 5,90 €, Bio-Bier vom Neumarkter Lammsbräu, offene Weine ab 3,50 €, Spritz und Cocktails — vieles auch alkoholfrei.",
  alternates: { canonical: "/getraenke" },
};

/* ----------------------------------------------------------------------------
 * Getränkekarte als Tag: Kaffee, Alkoholfreies, Schorlen und Limonaden hell
 * (Vormittag), Bier, Spritz, Cocktails und Weine dunkel (Abend, Bar).
 * Daten aus lib/drinks.ts.
 * ------------------------------------------------------------------------- */

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";
const BTN_A = "inline-flex h-[50px] items-center justify-center rounded-full bg-akzent px-[26px] text-[0.95rem] font-semibold text-white transition-colors hover:bg-akzent-hover";
const LINK = "font-semibold border-b-[1.5px] border-current pb-0.5";

/** Welche Kategorien zum Tag gehören; der Rest ist Abend/Bar. */
const TAG_SLUGS = new Set(["kaffee", "alkoholfrei", "schorle", "limonade"]);

const TAG_LABEL: Record<NonNullable<Drink["tags"]>[number], string> = {
  alkoholfrei: "alkoholfrei",
  bio: "Bio",
  vegan: "vegan",
  hausgemacht: "hausgemacht",
};

/** Welcher Freisteller zu welcher Kategorie gehört. */
const SPOT_BY_SLUG: Partial<Record<string, { spot: SpotKey; width: number }>> = {
  kaffee: { spot: "kaffee", width: 200 },
  schorle: { spot: "schorle", width: 240 },
  bier: { spot: "bier", width: 210 },
  "offene-weiss": { spot: "wein", width: 240 },
};

const T = {
  dark: { line: "border-tanne/15", muted: "text-muted-hell" },
  light: { line: "border-creme/15", muted: "text-creme/75" },
} as const;

/** Getränkezeile: Name links, Preis rechts, Beschreibung darunter. */
function DrinkRow({ drink, tone }: { drink: Drink; tone: KarteTone }) {
  const prices = Array.isArray(drink.price) ? drink.price : [drink.price];
  const t = T[tone];
  return (
    <li className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b py-3.5 ${t.line}`}>
      <p className="m-0 font-display text-[1.1rem] leading-tight md:text-[1.2rem]">
        {drink.name}
        {drink.tags?.length ? (
          <span className={`ml-2 font-body text-xs ${t.muted}`}>
            {drink.tags.map((x) => TAG_LABEL[x]).join(" · ")}
          </span>
        ) : null}
      </p>
      <span className="whitespace-nowrap text-[0.95rem] tabular-nums">{prices.join(" / ")}</span>
      {drink.desc && <p className={`col-span-2 m-0 text-[0.9rem] leading-snug ${t.muted}`}>{drink.desc}</p>}
    </li>
  );
}

function Categories({ cats, tone }: { cats: DrinkCategory[]; tone: KarteTone }) {
  return (
    <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-16">
      {cats.map((cat) => {
        const s = SPOT_BY_SLUG[cat.slug];
        return (
          <div key={cat.slug} id={cat.slug} className="scroll-mt-[150px]">
            <KarteHeading title={cat.title} hint={cat.hint} tone={tone} />
            <ul className="m-0 list-none p-0">
              {cat.items.map((d) => (
                <DrinkRow key={d.name} drink={d} tone={tone} />
              ))}
            </ul>
            {s && (
              <div className="mt-8 flex justify-center">
                <KarteSpot spot={s.spot} width={s.width} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Part({
  stage,
  label,
  title,
  note,
  tone,
  children,
}: {
  stage: DayStage;
  label: string;
  title: string;
  note: string;
  tone: KarteTone;
  children: React.ReactNode;
}) {
  return (
    <DaySection stage={stage} className="py-14 md:py-20">
      <div className={CONTAINER}>
        <div className="mb-10 md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">{label}</span>
          <h2 className="mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.75rem]">{title}</h2>
          <p className={`mt-3 max-w-[56ch] leading-relaxed ${T[tone].muted}`}>{note}</p>
        </div>
        {children}
      </div>
    </DaySection>
  );
}

export default function GetraenkePage() {
  const tag = DRINK_CATEGORIES.filter((c) => TAG_SLUGS.has(c.slug));
  const bar = DRINK_CATEGORIES.filter((c) => !TAG_SLUGS.has(c.slug));

  return (
    <ScrollDay>
      <DaySection stage="morgen">
        <KarteMasthead
          kicker="Sinzing bei Regensburg · Familie Leber"
          title="Die"
          accent="Bar."
          line="Kaffee mit Charakter, fünf hausgemachte Limonaden, Bio-Bier aus der Oberpfalz und Weine, die wir selbst gern trinken. Vieles davon gibt es auch alkoholfrei."
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ReserveButton location="getraenke" className={BTN_A}>
              Tisch reservieren
            </ReserveButton>
            <Link href="/speisekarte" className={LINK}>
              Speisekarte
            </Link>
          </div>
        </KarteMasthead>
      </DaySection>

      <CategoryTabs
        tabs={DRINK_CATEGORIES.map((c) => ({ slug: c.slug, title: c.title }))}
        scrollOffset={150}
      />

      <Part
        stage="morgen-2"
        label="Tagsüber"
        title="Kaffee, Limonaden und Schorlen"
        note="Zum Brunch und am Nachmittag: Kaffee auch entkoffeiniert, mit Hafermilch oder laktosefrei, dazu Hausgemachtes ohne Alkohol."
        tone="dark"
      >
        <Categories cats={tag} tone="dark" />
      </Part>

      <Part
        stage="abend"
        label="Abends"
        title="Bier, Spritz, Cocktails und Wein"
        note="Sven steht an der Bar: Bio-Bier vom Neumarkter Lammsbräu, Spritz, Cocktails und offene Weine. Spritz, Cocktails, die hausgemachten Limonaden und die Schnäpse stehen mit allen Zutaten auch auf dem Aufsteller am Tisch."
        tone="light"
      >
        <Categories cats={bar} tone="light" />
        <div className="mt-12 grid gap-6 border-t border-creme/15 pt-8 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <div>
            <h3 className="font-display text-[1.6rem] font-normal">Etwas zu feiern?</h3>
            <p className="mt-2 max-w-[56ch] leading-relaxed text-creme/75">
              Hochzeit, Geburtstag oder Firmenfeier: Für große Runden stimmen wir Wein und Sekt
              gern mit dir ab.
            </p>
          </div>
          <a href={`mailto:${CONTACT.email}`} className={LINK}>
            {CONTACT.email}
          </a>
        </div>
        <KarteFineprint tone="light" />
      </Part>
    </ScrollDay>
  );
}
