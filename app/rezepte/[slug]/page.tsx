import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IMG } from "@/lib/images";
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
  };
}

export default async function RezeptDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return (
    <article className="bg-white">
      {/* HEADER */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/rezepte"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-stone-400 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Alle Rezepte
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center">
          <p className="eyebrow no-line justify-center">Rezept · {recipe.category}</p>
          <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            {recipe.title}
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            {recipe.teaser}
          </p>
        </div>
      </section>

      {/* BILD */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-20 md:pb-28">
          <div className="relative aspect-[16/10] overflow-hidden reveal">
            <Image
              src={IMG.pistazientiramisu.src}
              alt={IMG.pistazientiramisu.alt}
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* INTRO */}
      {recipe.intro && (
        <section className="bg-white">
          <div className="mx-auto max-w-2xl px-6 md:px-10 pb-20 md:pb-24 reveal">
            <p className="font-display italic text-lg md:text-xl text-stone-600 leading-relaxed">
              {recipe.intro}
            </p>
          </div>
        </section>
      )}

      {recipe.hasFullRecipe ? (
        <>
          {/* ZUTATEN */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <section className="bg-stone-soft border-y border-stone-200">
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
                      <p className="font-display italic text-stone-400 text-base tracking-wide mb-4">
                        {group.title}
                      </p>
                      <ul className="space-y-2.5 text-waldgruen font-display">
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

          {/* ZUBEREITUNG */}
          {recipe.steps && recipe.steps.length > 0 && (
            <section className="bg-white">
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
                        <p className="mt-4 text-stone-600 leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* AUTHOR */}
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
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-6 md:px-10 pb-24 md:pb-32 text-center reveal">
            <p className="font-display italic text-xl md:text-2xl text-stone-600 leading-relaxed max-w-xl mx-auto">
              Das genaue Rezept — Zutaten, Schritte, Tipps — folgt bald an
              dieser Stelle.
            </p>
          </div>
        </section>
      )}

      {/* BACK */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <Link
            href="/rezepte"
            className="inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
          >
            <span aria-hidden>←</span> Andere Rezepte ansehen
          </Link>
        </div>
      </section>
    </article>
  );
}
