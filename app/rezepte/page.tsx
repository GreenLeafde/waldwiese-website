import Link from "next/link";
import { LeafDivider } from "@/components/leaf-divider";
import { RECIPES } from "@/lib/recipes";

export const metadata = {
  title: "Rezepte zum Nachkochen",
  description:
    "Unsere beliebtesten Rezepte zum Nachmachen — vom Pistazientiramisu bis zum nächsten Lieblingsgericht.",
  alternates: { canonical: "/rezepte" },
};

export default function RezeptePage() {
  return (
    <>
      {/* HEADER — Waldgrün */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Rezepte</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Mitkochen{" "}
            <span className="accent">zuhause.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Eine Auswahl unserer beliebtesten Gerichte — Schritt für Schritt.
            Für die Tage, an denen du es nicht zu uns schaffst, aber trotzdem
            ehrlich kochen willst.
          </p>
        </div>
      </section>

      {/* LISTE — Lese-Bereich auf Creme, Typo statt Stock-Food-Bildern */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32">
          <ul className="border-t border-waldgruen/15 reveal">
            {RECIPES.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/rezepte/${r.slug}`}
                  className="group flex items-center justify-between gap-6 py-8 md:py-10 border-b border-waldgruen/15"
                >
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                        {r.category}
                      </p>
                      {r.badge && (
                        <span className="text-[0.62rem] tracking-[0.16em] uppercase text-waldgruen/45 font-medium">
                          {r.badge}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-display font-normal leading-tight tracking-tight text-waldgruen group-hover:text-tonwarm transition-colors">
                      {r.title}
                    </h2>
                    <p className="mt-3 italic text-waldgruen/65 text-base md:text-lg leading-relaxed max-w-2xl">
                      {r.teaser}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 text-tonwarm text-2xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-16 text-center italic text-sm text-waldgruen/45">
            Weitere Rezepte folgen Stück für Stück.
          </p>
          <LeafDivider tone="dark" className="mt-14 opacity-90" />
        </div>
      </section>
    </>
  );
}
