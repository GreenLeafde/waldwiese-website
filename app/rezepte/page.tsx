import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";
import { RECIPES } from "@/lib/recipes";

export const metadata = {
  title: "Rezepte zum Nachkochen",
  description:
    "Unsere beliebtesten Rezepte zum Nachmachen — vom Pistazientiramisu bis zum nächsten Lieblingsgericht.",
};

export default function RezeptePage() {
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
          <p className="eyebrow no-line justify-center">Rezepte</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Mitkochen{" "}
            <span className="accent">zuhause.</span>
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Eine Auswahl unserer beliebtesten Gerichte — Schritt für Schritt.
            Für die Tage, an denen du es nicht zu uns schaffst, aber trotzdem
            ehrlich kochen willst.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10 pb-24 md:pb-32">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {RECIPES.map((r) => (
              <Link
                key={r.slug}
                href={`/rezepte/${r.slug}`}
                className="group block reveal"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={IMG.pistazientiramisu.src}
                    alt={IMG.pistazientiramisu.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-6">
                  <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                    {r.category}
                  </p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen group-hover:text-tonwarm transition-colors">
                    {r.title}
                  </h2>
                  <p className="mt-3 font-display italic text-stone-600 leading-relaxed">
                    {r.teaser}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-16 text-center font-display italic text-sm text-stone-500">
            Weitere Rezepte folgen Stück für Stück.
          </p>
        </div>
      </section>
    </>
  );
}
