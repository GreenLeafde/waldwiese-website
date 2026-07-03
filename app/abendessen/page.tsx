import Link from "next/link";
import { CategoryTabs } from "@/components/category-tabs";
import { LeafDivider } from "@/components/leaf-divider";
import { LeafMark } from "@/components/diet-leaf";
import { BREAKFAST_LAUNCH, RESERVATION_URL, hasBreakfastLaunched } from "@/lib/site";
import { BURGER_CHOICES, DINNER_MENU, type Dish } from "@/lib/dinner-menu";

export const metadata = {
  title: "Speisekarte — Burger, Bowls, Steak",
  description:
    "Die komplette Abendkarte: Burger (mähende Moni, klassischer Heinzi), Bowls (Prinzessin auf der Kichererbse), Steak, Lachs, Pistazientiramisu. Vegan, vegetarisch und herzhaft gleichberechtigt.",
  alternates: { canonical: "/abendessen" },
};

type Tag = NonNullable<Dish["tags"]>[number];

const TAG_LABEL: Record<Tag, string> = {
  vegan: "Vegan",
  vegetarisch: "Vegetarisch",
  "vegan möglich": "Vegan möglich",
  "vegetarisch möglich": "Vegetarisch möglich",
  empfehlung: "Empfehlung",
};

function Tag({ tag }: { tag: Tag }) {
  const vegan = tag === "vegan" || tag === "vegan möglich";
  const veg = vegan || tag === "vegetarisch" || tag === "vegetarisch möglich";
  if (veg) {
    return (
      <span className="ml-3 inline-flex items-center gap-1 align-middle text-[0.6rem] tracking-[0.2em] uppercase text-waldgruen/70 font-body font-medium">
        <LeafMark filled={vegan} className="w-3 h-3 shrink-0" />
        {TAG_LABEL[tag]}
      </span>
    );
  }
  return (
    <span className="ml-3 align-middle text-[0.6rem] tracking-[0.22em] uppercase text-tonwarm font-body font-medium">
      {TAG_LABEL[tag]}
    </span>
  );
}

function Price({ price }: { price: Dish["price"] }) {
  if (Array.isArray(price)) {
    return (
      <span className="font-display text-lg md:text-xl text-tonwarm whitespace-nowrap text-right leading-tight">
        {price.map((p) => (
          <span key={p} className="block">
            {p}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="font-display text-lg md:text-xl text-tonwarm whitespace-nowrap">
      {price}
    </span>
  );
}

export default function AbendessenPage() {
  return (
    <>
      {/* HEADER */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center">
          <p className="eyebrow no-line justify-center">Abendkarte</p>
          <h1 className="mt-7 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Die Karte.
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Burger mit Namen, Bowls aus dem Märchenbuch, Steak und Lachs vom
            Grill. Vegan, vegetarisch und herzhaft —{" "}
            <span className="text-tonwarm">gleichberechtigt</span> auf der
            Karte.
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Tisch reservieren <span aria-hidden>→</span>
            </a>
            <Link
              href="/getraenke"
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Getränkekarte
            </Link>
          </div>
        </div>
      </section>

      {/* FRÜHSTÜCK-HINWEIS — schmaler Tonwarm-Banner, Coming-Soon-Cross-Link */}
      <Link
        href="/fruehstueck"
        className="block bg-tonwarm text-white hover:bg-tonwarm-dark transition-colors"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-sm md:text-base">
          <span className="text-[0.7rem] md:text-xs tracking-[0.28em] uppercase text-white/75">
            {hasBreakfastLaunched() ? "Neu" : "Bald"}
          </span>
          <span className="font-medium">
            {hasBreakfastLaunched() ? (
              "Jetzt auch Frühstück — jeden Morgen ab 8 Uhr in Sinzing."
            ) : (
              <>
                Wir werden zum Frühstücksrestaurant — ab{" "}
                <span className="italic">{BREAKFAST_LAUNCH.dateShort}</span> auch
                zum Frühstück in Sinzing.
              </>
            )}
          </span>
          <span aria-hidden className="text-white/80">
            →
          </span>
        </div>
      </Link>

      {/* TABS */}
      <CategoryTabs
        tabs={DINNER_MENU.map((c) => ({ slug: c.slug, title: c.title }))}
        scrollOffset={150}
      />

      {/* MENÜ */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32 space-y-20 md:space-y-28">
          {DINNER_MENU.map((cat) => (
            <div
              key={cat.slug}
              id={cat.slug}
              className="reveal scroll-mt-[150px]"
            >
              {/* Kategorie-Header */}
              <div className="mb-12">
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  Karte · Kategorie
                </p>
                <h2 className="mt-3 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                  {cat.title}
                </h2>
                {cat.hint && (
                  <p className="mt-3 italic text-waldgruen/65">
                    {cat.hint}
                  </p>
                )}
              </div>

              {/* Gerichte */}
              <ul className="space-y-9">
                {cat.items.map((dish) => (
                  <li key={dish.name}>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-xl md:text-2xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                        {dish.name}
                        {dish.tags?.map((t) => (
                          <Tag key={t} tag={t} />
                        ))}
                      </h3>
                      <span
                        aria-hidden
                        className="flex-1 border-b border-dotted border-waldgruen/20 translate-y-[-4px]"
                      />
                      <Price price={dish.price} />
                    </div>
                    {dish.desc && (
                      <p className="mt-2 italic text-waldgruen/65 leading-relaxed max-w-2xl">
                        {dish.desc}
                      </p>
                    )}
                    {dish.options?.map((opt) => (
                      <p
                        key={opt.label}
                        className="mt-1 text-sm text-tonwarm"
                      >
                        + {opt.label}{" "}
                        <span className="text-waldgruen/45">{opt.price}</span>
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <LeafDivider tone="dark" className="mt-12 opacity-90" />
        </div>
      </section>

      {/* BURGER-WAHL */}
      <section className="bg-waldgruen-dark text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-24 reveal">
          <div className="flex items-baseline gap-5 mb-8">
            <h2 className="italic text-mehlcreme/55 text-lg tracking-wide">
              Beim Burger
            </h2>
            <span aria-hidden className="flex-1 h-px bg-mehlcreme/15" />
          </div>
          <p className="italic text-mehlcreme/80 leading-relaxed mb-10 max-w-xl">
            Alle Burger kommen mit deiner Wunsch-Kombi —{" "}
            <span className="text-tonwarm">{BURGER_CHOICES.bunNote}</span>.
          </p>

          <div className="grid sm:grid-cols-3 gap-10 text-sm">
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium mb-3">
                Buns
              </p>
              <ul className="space-y-1.5 text-mehlcreme font-display">
                {BURGER_CHOICES.buns.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium mb-3">
                Patties
              </p>
              <ul className="space-y-1.5 text-mehlcreme font-display">
                {BURGER_CHOICES.patties.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium mb-3">
                Extras
              </p>
              <ul className="space-y-1.5 text-mehlcreme font-display">
                {BURGER_CHOICES.extras.map((e) => (
                  <li key={e.label} className="flex justify-between gap-3">
                    <span>{e.label}</span>
                    <span className="text-mehlcreme/55">{e.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SUB-CTA */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <p className="eyebrow no-line justify-center">Was du dazu trinkst</p>
          <h2 className="mt-7 text-3xl md:text-4xl font-display font-normal leading-tight tracking-tight text-mehlcreme">
            Die <span className="accent">Bar</span> ist eine eigene Geschichte.
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-mehlcreme/80 leading-relaxed">
            Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
            Cocktails, Schaumweine. Auch entkoffeiniert und alkoholfrei.
          </p>
          <Link
            href="/getraenke"
            className="mt-9 inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
          >
            Zur Getränkekarte <span aria-hidden>→</span>
          </Link>
          <LeafDivider tone="light" className="mt-12 opacity-80" />
        </div>
      </section>
    </>
  );
}
