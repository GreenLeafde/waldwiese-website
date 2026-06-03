import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeafDivider } from "@/components/leaf-divider";
import { getRecipe, RECIPES } from "@/lib/recipes";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.teaser,
    alternates: { canonical: `/rezepte/${slug}` },
  };
}

export default async function RezeptDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return (
    <article>
      {/* HEADER — Waldgrün */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/rezepte"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Alle Rezepte
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-20 md:pb-28 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Rezept · {recipe.category}</p>
          {recipe.badge && (
            <span className="mt-5 inline-block rounded-full bg-tonwarm text-white text-[0.65rem] tracking-[0.18em] uppercase font-medium px-4 py-1.5">
              {recipe.badge}
            </span>
          )}
          <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            {recipe.title}
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            {recipe.teaser}
          </p>
        </div>
      </section>

      {/* INTRO — Lese-Bereich auf Creme */}
      {recipe.intro && (
        <section className="bg-mehlcreme">
          <div className="mx-auto max-w-2xl px-6 md:px-10 py-20 md:py-24 reveal">
            <p className="italic text-lg md:text-xl text-waldgruen/65 leading-relaxed">
              {recipe.intro}
            </p>
          </div>
        </section>
      )}

      {recipe.hasFullRecipe ? (
        <>
          {/* ZUTATEN — Lese-Bereich auf Creme */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <section className="bg-mehlcreme border-t border-waldgruen/15">
              <div className="mx-auto max-w-4xl px-6 md:px-10 py-20 md:py-28">
                <div className="mb-12 reveal">
                  <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                    Zutaten
                  </p>
                  <h2 className="mt-3 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                    Was du brauchst.
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-10 md:gap-14 reveal">
                  {recipe.ingredients.map((group) => (
                    <div key={group.title}>
                      <p className="italic text-waldgruen/45 text-base tracking-wide mb-4">
                        {group.title}
                      </p>
                      <ul className="space-y-2.5 text-waldgruen/80">
                        {group.items.map((it) => (
                          <li key={it} className="flex items-baseline gap-3">
                            <span
                              aria-hidden
                              className="inline-block w-1.5 h-1.5 rounded-full bg-tonwarm flex-shrink-0 mt-2"
                            />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ZUBEREITUNG — Lese-Bereich auf Creme */}
          {recipe.steps && recipe.steps.length > 0 && (
            <section className="bg-mehlcreme border-t border-waldgruen/15">
              <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32">
                <div className="mb-14 reveal">
                  <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                    Zubereitung
                  </p>
                  <h2 className="mt-3 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                    Schritt für Schritt.
                  </h2>
                </div>
                <ol className="space-y-12">
                  {recipe.steps.map((step, i) => (
                    <li
                      key={step.title}
                      className="grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10 gap-y-2 reveal"
                    >
                      <span className="font-display italic text-tonwarm text-2xl md:text-3xl leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                          {step.title}
                        </h3>
                        <p className="mt-4 text-waldgruen/70 leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* AUTHOR — Waldgrün */}
          {recipe.author && (
            <section className="bg-waldgruen text-mehlcreme">
              <div className="mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 reveal text-center">
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  {recipe.author.role}
                </p>
                <h2 className="mt-4 text-4xl md:text-5xl font-display font-normal text-mehlcreme leading-tight tracking-tight">
                  {recipe.author.name}
                </h2>
                <blockquote className="mt-10 font-display italic text-xl md:text-2xl text-mehlcreme/90 leading-relaxed max-w-2xl mx-auto">
                  „{recipe.author.quote}"
                </blockquote>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="bg-mehlcreme border-t border-waldgruen/15">
          <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
            <p className="italic text-xl md:text-2xl text-waldgruen/65 leading-relaxed max-w-xl mx-auto">
              Das genaue Rezept — Zutaten, Schritte, Tipps — folgt bald an
              dieser Stelle.
            </p>
          </div>
        </section>
      )}

      {/* BACK — Waldgrün, fließt in den Footer */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <Link
            href="/rezepte"
            className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
          >
            <span aria-hidden>←</span> Andere Rezepte ansehen
          </Link>
          <LeafDivider tone="light" className="mt-14 opacity-80" />
        </div>
      </section>
    </article>
  );
}
