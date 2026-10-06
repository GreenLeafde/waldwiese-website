import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { LeafMark } from "@/components/diet-leaf";
import {
  KarteFineprint,
  KarteHeading,
  KarteMasthead,
  KarteSpot,
  type SpotKey,
} from "@/components/karte";
import { DRINK_CATEGORIES, type Drink } from "@/lib/drinks";
import { CONTACT, RESERVATION_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Getränkekarte — Kaffee, Limonaden, Wein, Spritz & Cocktails",
  description:
    "Die ganze Getränkekarte von Wald & Wiese in Sinzing bei Regensburg: Kaffee ab 2,80 €, fünf hausgemachte Limonaden à 5,90 €, Bio-Bier vom Neumarkter Lammsbräu, offene Weine ab 3,50 €, Spritz und Cocktails — vieles auch alkoholfrei.",
  alternates: { canonical: "/getraenke" },
};

type DrinkTag = NonNullable<Drink["tags"]>[number];

const TAG_LABEL: Record<DrinkTag, string> = {
  alkoholfrei: "alkoholfrei",
  bio: "Bio",
  vegan: "vegan",
  hausgemacht: "hausgemacht",
};

function Tag({ tag }: { tag: DrinkTag }) {
  if (tag === "vegan" || tag === "bio") {
    return (
      <span className="ml-2 inline-flex items-center gap-1 align-middle font-body text-[0.68rem] tracking-wide text-tonwarm">
        <LeafMark filled={tag === "vegan"} className="h-2.5 w-2.5 shrink-0" />
        {TAG_LABEL[tag]}
      </span>
    );
  }
  return (
    <span className="ml-2 align-middle font-body text-[0.68rem] tracking-wide text-tonwarm">
      {TAG_LABEL[tag]}
    </span>
  );
}

/**
 * Getränkezeile im Kartenlook: Name links, Preis rechtsbündig — so steht es
 * auch auf der gedruckten Karte (anders als bei den Speisen).
 */
function DrinkRow({ drink }: { drink: Drink }) {
  const prices = Array.isArray(drink.price) ? drink.price : [drink.price];
  return (
    <li>
      <div className="flex items-baseline justify-between gap-5">
        <p className="font-display text-base md:text-lg leading-snug">
          <span className="font-semibold text-waldgruen">{drink.name}</span>
          {drink.tags?.map((t) => (
            <Tag key={t} tag={t} />
          ))}
        </p>
        <p className="whitespace-nowrap text-right font-display text-base md:text-lg text-waldgruen/90">
          {prices.join(" / ")}
        </p>
      </div>
      {drink.desc && (
        <p className="mt-1 max-w-xl text-[0.9rem] leading-relaxed text-waldgruen/65">
          {drink.desc}
        </p>
      )}
    </li>
  );
}

/** Welcher Freisteller zu welcher Kategorie gehört. */
const SPOT_BY_SLUG: Partial<Record<string, { spot: SpotKey; width: number }>> = {
  kaffee: { spot: "kaffee", width: 230 },
  schorle: { spot: "schorle", width: 280 },
  bier: { spot: "bier", width: 245 },
  "offene-weiss": { spot: "wein", width: 275 },
};

export default function GetraenkePage() {
  return (
    <>
      <KarteMasthead
        kicker="Sinzing bei Regensburg · Familie Leber"
        title="Die"
        accent="Bar."
        line="Getränkekarte · Zum Wohl"
      >
        <p className="mx-auto max-w-2xl text-center text-lg italic leading-relaxed text-waldgruen/70">
          Kaffee mit Charakter, fünf hausgemachte Limonaden, Bio-Bier aus der
          Oberpfalz und Weine, die wir selbst gern trinken. Vieles davon gibt es
          auch alkoholfrei.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-tonwarm px-7 py-3.5 font-medium text-white transition-colors hover:bg-tonwarm-dark"
          >
            Tisch reservieren <span aria-hidden>→</span>
          </a>
          <Link
            href="/speisekarte"
            className="inline-flex items-center gap-3 border-b border-waldgruen/30 pb-1 font-medium text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm"
          >
            Speisekarte
          </Link>
        </div>
      </KarteMasthead>

      <CategoryTabs
        tabs={DRINK_CATEGORIES.map((c) => ({ slug: c.slug, title: c.title }))}
        scrollOffset={150}
      />

      {/* Zweispaltiger Satzspiegel mit Haarlinie — wie auf der Karte */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 md:py-24">
          <div
            className="md:columns-2 [column-gap:3.5rem] lg:[column-gap:4.5rem]"
            style={{ columnRule: "1px solid rgba(46,61,44,0.16)" }}
          >
            {DRINK_CATEGORIES.map((cat) => {
              const s = SPOT_BY_SLUG[cat.slug];
              return (
                <div
                  key={cat.slug}
                  id={cat.slug}
                  className="mb-14 break-inside-avoid scroll-mt-[150px]"
                >
                  <KarteHeading title={cat.title} hint={cat.hint} />
                  <ul className="mt-7 space-y-5">
                    {cat.items.map((d) => (
                      <DrinkRow key={d.name} drink={d} />
                    ))}
                  </ul>
                  {s && (
                    <div className="mt-9 flex justify-center">
                      <KarteSpot spot={s.spot} width={s.width} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Notizkasten wie auf der gedruckten Karte */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-waldgruen/25 px-7 py-8">
              <p className="font-display text-lg uppercase tracking-[0.14em] text-waldgruen">
                Am Tisch
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-waldgruen/70">
                Spritz, Cocktails, die hausgemachten Limonaden und die Schnäpse
                stehen auf dem Aufsteller am Tisch — dort findest du sie auch
                mit allen Zutaten.
              </p>
            </div>
            <div className="rounded-sm border border-waldgruen/25 px-7 py-8">
              <p className="font-display text-lg uppercase tracking-[0.14em] text-waldgruen">
                Etwas zu feiern?
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-waldgruen/70">
                Hochzeit, Geburtstag oder Firmenfeier: Für große Runden stimmen
                wir Wein und Sekt gern mit dir ab. Schreib an{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-tonwarm underline decoration-tonwarm/40 underline-offset-2 hover:text-tonwarm-dark"
                >
                  {CONTACT.email}
                </a>
                .
              </p>
            </div>
          </div>

          <figure className="mt-16 text-center">
            <blockquote className="mx-auto max-w-lg font-display text-xl italic leading-relaxed text-waldgruen/75 md:text-2xl">
              „Das Leben ist viel zu kurz, um schlechten Wein zu trinken.“
            </blockquote>
          </figure>

          <KarteFineprint />
        </div>
      </section>
    </>
  );
}
