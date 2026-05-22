import Link from "next/link";
import { CategoryTabs } from "@/components/category-tabs";
import { DRINK_CATEGORIES } from "@/lib/drinks";

export const metadata = {
  title: "Getränkekarte",
  description:
    "Komplette Getränkekarte: Kaffee, hausgemachte Limonaden, Bier, Spritz, Cocktails, Weine aus der Region und Schaumweine. Auch entkoffeiniert und alkoholfrei.",
};

type DrinkTag = "alkoholfrei" | "bio" | "vegan" | "hausgemacht";
const TAG_LABEL: Record<DrinkTag, string> = {
  alkoholfrei: "Alkoholfrei",
  bio: "Bio",
  vegan: "Vegan",
  hausgemacht: "Hausgemacht",
};

function Tag({ tag }: { tag: DrinkTag }) {
  return (
    <span className="ml-3 align-middle text-[0.6rem] tracking-[0.22em] uppercase text-tonwarm font-body font-medium">
      {TAG_LABEL[tag]}
    </span>
  );
}

function Price({ price }: { price: string | string[] }) {
  if (Array.isArray(price)) {
    return (
      <span className="font-display text-base md:text-lg text-tonwarm whitespace-nowrap text-right leading-tight">
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

export default function GetraenkePage() {
  return (
    <>
      {/* HEADER */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-stone-400 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center">
          <p className="eyebrow no-line justify-center">Getränkekarte</p>
          <h1 className="mt-7 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Die <span className="accent">Bar.</span>
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
            Cocktails. Auch entkoffeiniert und alkoholfrei — hier kommt jeder
            auf seinen Geschmack.
          </p>
        </div>
      </section>

      {/* TABS */}
      <CategoryTabs
        tabs={DRINK_CATEGORIES.map((c) => ({ slug: c.slug, title: c.title }))}
        scrollOffset={120}
      />

      {/* MENÜ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32 space-y-20 md:space-y-28">
          {DRINK_CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              id={cat.slug}
              className="reveal scroll-mt-[120px]"
            >
              <div className="mb-12">
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  Getränke · Kategorie
                </p>
                <h2 className="mt-3 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                  {cat.title}
                </h2>
                {cat.hint && (
                  <p className="mt-3 font-display italic text-stone-500 max-w-xl">
                    {cat.hint}
                  </p>
                )}
              </div>

              <ul className="space-y-7">
                {cat.items.map((d) => (
                  <li
                    key={
                      d.name +
                      (Array.isArray(d.price) ? d.price[0] : d.price)
                    }
                  >
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-lg md:text-xl font-display font-normal leading-tight text-waldgruen">
                        {d.name}
                        {d.tags?.map((t) => (
                          <Tag key={t} tag={t} />
                        ))}
                      </h3>
                      <span
                        aria-hidden
                        className="flex-1 border-b border-dotted border-stone-300 translate-y-[-4px]"
                      />
                      <Price price={d.price} />
                    </div>
                    {d.desc && (
                      <p className="mt-1.5 font-display italic text-sm text-stone-500 leading-relaxed max-w-2xl">
                        {d.desc}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* BACK TO MENU */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <p className="font-display italic text-stone-500 text-sm">
            Jeden Sonntag hausgemachte Kuchen — frag uns einfach an der Theke.
          </p>
          <Link
            href="/abendessen"
            className="mt-8 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
          >
            Zur Speisekarte <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
