import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { LeafDivider } from "@/components/leaf-divider";
import { LeafMark } from "@/components/diet-leaf";
import { RESERVATION_URL, SITE } from "@/lib/site";
import { BREAKFAST_MENU } from "@/lib/menu";
import { BURGER_CHOICES, DINNER_MENU } from "@/lib/dinner-menu";

export const metadata: Metadata = {
  title:
    "Speisekarte — Frühstück, Mittag & Abend | Wald & Wiese Sinzing bei Regensburg",
  description:
    "Die ganze Speisekarte von Wald & Wiese in Sinzing bei Regensburg: Frühstück & Mittag täglich von 8–14 Uhr (Frühstücke, Brote, Bowls, Currywurst, Burger, Salate) und Abend Fr–So von 17–22 Uhr (Burger, Bowls, vom Grill, Finale). Regional, hausgemacht, vegan & vegetarisch.",
  alternates: { canonical: "/speisekarte" },
};

/** Ein Gericht — Form ist bei Brunch- und Abendkarte identisch. */
type AnyDish = {
  name: string;
  desc?: string;
  hint?: string;
  price: string | string[];
  options?: Array<{ label: string; price: string }>;
  tags?: string[];
};

const TAG_LABEL: Record<string, string> = {
  vegan: "Vegan",
  vegetarisch: "Vegetarisch",
  "vegan möglich": "Vegan möglich",
  "vegetarisch möglich": "Vegetarisch möglich",
  empfehlung: "Empfehlung",
};

function Tag({ tag }: { tag: string }) {
  const label = TAG_LABEL[tag];
  if (!label) return null;
  const vegan = tag === "vegan" || tag === "vegan möglich";
  const veg = vegan || tag === "vegetarisch" || tag === "vegetarisch möglich";
  if (veg) {
    return (
      <span className="ml-3 inline-flex items-center gap-1 align-middle text-[0.6rem] tracking-[0.2em] uppercase text-waldgruen/70 font-body font-medium">
        <LeafMark filled={vegan} className="w-3 h-3 shrink-0" />
        {label}
      </span>
    );
  }
  return (
    <span className="ml-3 align-middle text-[0.6rem] tracking-[0.22em] uppercase text-tonwarm font-body font-medium">
      {label}
    </span>
  );
}

function Price({ price }: { price: AnyDish["price"] }) {
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

function DishItem({ dish }: { dish: AnyDish }) {
  return (
    <li>
      <div className="flex items-baseline gap-3">
        <h4 className="text-xl md:text-2xl font-display font-normal leading-tight tracking-tight text-waldgruen">
          {dish.name}
          {dish.tags?.map((t) => (
            <Tag key={t} tag={t} />
          ))}
        </h4>
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
        <p key={opt.label} className="mt-1 text-sm text-tonwarm">
          + {opt.label} <span className="text-waldgruen/45">{opt.price}</span>
        </p>
      ))}
      {dish.hint && (
        <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-waldgruen/45">
          {dish.hint}
        </p>
      )}
    </li>
  );
}

function CategoryBlock({
  title,
  hint,
  items,
}: {
  title: string;
  hint?: string;
  items: AnyDish[];
}) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-3xl md:text-4xl font-display font-normal leading-tight tracking-tight text-waldgruen">
          {title}
        </h3>
        {hint && <p className="mt-2 italic text-waldgruen/65">{hint}</p>}
      </div>
      <ul className="space-y-9">
        {items.map((dish) => (
          <DishItem key={dish.name} dish={dish as AnyDish} />
        ))}
      </ul>
    </div>
  );
}

// Brunch-Karte in Frühstück (alles außer Mittags) und Mittag aufteilen.
const FRUEHSTUECK_CATS = BREAKFAST_MENU.filter((c) => c.slug !== "mittags");
const MITTAG_CATS = BREAKFAST_MENU.filter((c) => c.slug === "mittags");

const DAYPART_TABS = [
  { slug: "fruehstueck", title: "Frühstück" },
  { slug: "mittag", title: "Mittag" },
  { slug: "abend", title: "Abend" },
  { slug: "getraenke", title: "Getränke" },
];

function DaypartHeader({
  eyebrow,
  title,
  time,
  note,
}: {
  eyebrow: string;
  title: string;
  time: string;
  note: string;
}) {
  return (
    <div className="text-center mb-14 reveal">
      <p className="eyebrow no-line justify-center text-tonwarm">{eyebrow}</p>
      <h2 className="mt-5 text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
        {title}
      </h2>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-waldgruen/20 px-5 py-2 text-sm md:text-base font-display text-waldgruen">
        <span aria-hidden className="text-tonwarm">
          ●
        </span>
        {time}
      </p>
      <p className="mt-4 italic text-waldgruen/60 max-w-xl mx-auto leading-relaxed">
        {note}
      </p>
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
          hasMenuItem: cat.items.map((d) => ({
            "@type": "MenuItem",
            name: d.name,
            ...(d.desc ? { description: d.desc } : {}),
          })),
        })),
      },
      {
        "@type": "MenuSection",
        name: "Abend (Fr–So 17–22 Uhr)",
        hasMenuSection: DINNER_MENU.map((cat) => ({
          "@type": "MenuSection",
          name: cat.title,
          hasMenuItem: cat.items.map((d) => ({
            "@type": "MenuItem",
            name: d.name,
            ...(d.desc ? { description: d.desc } : {}),
          })),
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
          <p className="eyebrow no-line justify-center">Speisekarte</p>
          <h1 className="mt-7 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Die ganze <span className="accent">Karte.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Ein Haus, drei Tageszeiten:{" "}
            <span className="text-tonwarm">Frühstück &amp; Mittag</span> täglich
            von 8–14 Uhr, <span className="text-tonwarm">Abend</span> von
            Freitag bis Sonntag 17–22 Uhr.
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

      {/* TABS nach Tageszeit */}
      <CategoryTabs tabs={DAYPART_TABS} scrollOffset={150} />

      {/* FRÜHSTÜCK */}
      <section id="fruehstueck" className="bg-mehlcreme scroll-mt-[150px]">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20">
          <DaypartHeader
            eyebrow="Tageszeit · 1"
            title="Frühstück"
            time="täglich · 8 – 14 Uhr"
            note="Frühstücke mit Namen, Brote, „Schmusi“-Bowls und Extras — hausgemacht, regional, vegan &amp; vegetarisch gleichberechtigt."
          />
          <div className="space-y-16 md:space-y-20">
            {FRUEHSTUECK_CATS.map((cat) => (
              <CategoryBlock
                key={cat.slug}
                title={cat.title}
                hint={cat.hint}
                items={cat.items as AnyDish[]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MITTAG */}
      <section id="mittag" className="bg-waldgruen text-mehlcreme scroll-mt-[150px]">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Tageszeit · 2
            </p>
            <h2 className="mt-5 text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
              Mittag
            </h2>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-mehlcreme/25 px-5 py-2 text-sm md:text-base font-display text-mehlcreme">
              <span aria-hidden className="text-tonwarm">
                ●
              </span>
              täglich · 11:30 – 14 Uhr
            </p>
            <p className="mt-4 italic text-mehlcreme/70 max-w-xl mx-auto leading-relaxed">
              Ab 11:30 Uhr wird aus dem Frühstück Mittag: Currywurst, Burger und
              ein Salat, der satt macht.
            </p>
          </div>
          {MITTAG_CATS.map((cat) => (
            <ul key={cat.slug} className="space-y-9 max-w-2xl mx-auto">
              {cat.items.map((dish) => (
                <li key={dish.name}>
                  <div className="flex items-baseline gap-3">
                    <h4 className="text-xl md:text-2xl font-display font-normal leading-tight tracking-tight text-mehlcreme">
                      {dish.name}
                      {dish.tags?.map((t) => (
                        <span
                          key={t}
                          className="ml-3 align-middle text-[0.6rem] tracking-[0.2em] uppercase text-tonwarm font-body font-medium"
                        >
                          {TAG_LABEL[t] ?? t}
                        </span>
                      ))}
                    </h4>
                    <span
                      aria-hidden
                      className="flex-1 border-b border-dotted border-mehlcreme/25 translate-y-[-4px]"
                    />
                    <span className="font-display text-lg md:text-xl text-tonwarm whitespace-nowrap">
                      {dish.price as string}
                    </span>
                  </div>
                  {dish.desc && (
                    <p className="mt-2 italic text-mehlcreme/70 leading-relaxed max-w-2xl">
                      {dish.desc}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ABEND */}
      <section id="abend" className="bg-mehlcreme scroll-mt-[150px]">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20">
          <DaypartHeader
            eyebrow="Tageszeit · 3"
            title="Abend"
            time="Fr · Sa · So · 17 – 22 Uhr"
            note="Burger mit Namen, Bowls aus dem Märchenbuch, Steak und Lachs vom Grill — und ein süßes Finale. Nur am Wochenende."
          />
          <div className="space-y-16 md:space-y-20">
            {DINNER_MENU.map((cat) => (
              <CategoryBlock
                key={cat.slug}
                title={cat.title}
                hint={cat.hint}
                items={cat.items as AnyDish[]}
              />
            ))}
          </div>

          {/* Burger-Baukasten */}
          <div className="mt-20 rounded-3xl bg-waldgruen-dark text-mehlcreme px-8 py-12 md:px-12 md:py-14">
            <div className="flex items-baseline gap-5 mb-8">
              <h3 className="italic text-mehlcreme/55 text-lg tracking-wide">
                Beim Burger
              </h3>
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

          <p className="mt-16 text-center text-sm italic text-waldgruen/45">
            Alle Preise inkl. MwSt. · Über Allergene &amp; Zusatzstoffe
            informiert dich gerne unser Serviceteam · Änderungen vorbehalten.
          </p>
          <LeafDivider tone="dark" className="mt-12 opacity-90" />
        </div>
      </section>

      {/* GETRÄNKE */}
      <section
        id="getraenke"
        className="bg-waldgruen text-mehlcreme scroll-mt-[150px]"
      >
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            Tageszeit · rund um die Uhr
          </p>
          <h2 className="mt-5 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-mehlcreme">
            Getränke &amp; <span className="accent">Bar.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-mehlcreme/80 leading-relaxed">
            Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
            Cocktails, Schaumweine — auch entkoffeiniert, mit Hafermilch oder
            alkoholfrei. Die ganze Getränkekarte gibt es auf einer eigenen Seite.
          </p>
          <Link
            href="/getraenke"
            className="mt-9 inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
          >
            Zur Getränkekarte <span aria-hidden>→</span>
          </Link>
          <LeafDivider tone="light" className="mt-14 opacity-80" />
        </div>
      </section>
    </>
  );
}
