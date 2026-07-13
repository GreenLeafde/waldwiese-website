import Link from "next/link";
import type { Metadata } from "next";
import { LeafDivider } from "@/components/leaf-divider";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Ratgeber — rund um Brunch, Genuss & Wald & Wiese",
  description:
    "Tipps und Wissenswertes rund um Frühstück, Brunch und einen entspannten Besuch bei Wald & Wiese in Sinzing bei Regensburg.",
  alternates: { canonical: "/ratgeber" },
};

export default function RatgeberIndexPage() {
  return (
    <>
      {/* HEADER */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-16 md:pb-24 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Ratgeber</p>
          <h1 className="mt-7 text-5xl md:text-7xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Zum <span className="accent">Nachlesen.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Kleine Wegweiser rund um Brunch, Genuss und einen entspannten Besuch
            bei uns im Grünen.
          </p>
        </div>
      </section>

      {/* LISTE */}
      <section className="bg-waldgruen">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-24 md:pb-32">
          <div className="grid gap-6 md:grid-cols-2">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/ratgeber/${g.slug}`}
                className="group flex flex-col rounded-3xl bg-mehlcreme ring-1 ring-mehlcreme/15 shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 md:p-10"
              >
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  {g.kicker}
                </p>
                <h2 className="mt-4 text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen group-hover:text-tonwarm-dark transition-colors">
                  {g.title}
                </h2>
                <p className="mt-4 text-waldgruen/65 leading-relaxed">
                  {g.teaser}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-tonwarm">
                  Weiterlesen <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
          <LeafDivider tone="light" className="mt-20 opacity-80" />
        </div>
      </section>
    </>
  );
}
