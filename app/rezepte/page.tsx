import Image from "next/image";
import Link from "next/link";
import { LeafDivider } from "@/components/leaf-divider";
import { StampBadge } from "@/components/stamp-badge";
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
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-12 md:pb-16 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Rezepte</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Mitkochen <span className="accent">zuhause.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Eine Auswahl unserer beliebtesten Gerichte — Schritt für Schritt.
            Für die Tage, an denen du es nicht zu uns schaffst, aber trotzdem
            ehrlich kochen willst.
          </p>
        </div>
      </section>

      {/* KARTEN — je Rezept ein Kärtchen mit eigenem Bild, auf Grün */}
      <section className="bg-waldgruen">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-24 md:pb-32">
          <ul className="grid sm:grid-cols-2 gap-7 md:gap-8 reveal-1">
            {RECIPES.map((r) => (
              <li key={r.slug} className="flex">
                <Link
                  href={`/rezepte/${r.slug}`}
                  className="group flex w-full flex-col overflow-hidden rounded-3xl bg-mehlcreme ring-1 ring-mehlcreme/15 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {r.image ? (
                      <Image
                        src={r.image.src}
                        alt={r.image.alt}
                        fill
                        sizes="(min-width: 640px) 40vw, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-waldgruen-dark">
                        <span className="font-display italic text-mehlcreme/40 text-3xl">
                          Wald &amp; Wiese
                        </span>
                      </div>
                    )}
                    {r.badge && (
                      <StampBadge
                        solid
                        rotate={-9}
                        className="absolute top-2.5 left-2.5 z-10 w-[74px] h-[74px] md:w-20 md:h-20 drop-shadow"
                      >
                        <span className="block text-[0.5rem] tracking-[0.06em] uppercase font-semibold leading-[1.06]">
                          {r.badge}
                        </span>
                      </StampBadge>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                      {r.category}
                    </p>
                    <h2 className="mt-2 text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen group-hover:text-tonwarm transition-colors">
                      {r.title}
                    </h2>
                    <p className="mt-3 italic text-waldgruen/65 leading-relaxed">
                      {r.teaser}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-waldgruen group-hover:text-tonwarm transition-colors">
                      Zum Rezept{" "}
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-14 text-center italic text-sm text-mehlcreme/55">
            Weitere Rezepte folgen Stück für Stück.
          </p>
          <LeafDivider tone="light" className="mt-12 opacity-80" />
        </div>
      </section>
    </>
  );
}
