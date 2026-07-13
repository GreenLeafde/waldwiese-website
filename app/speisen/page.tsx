import Link from "next/link";
import { LeafDivider } from "@/components/leaf-divider";
import { BREAKFAST_LAUNCH, hasBreakfastLaunched } from "@/lib/site";

export const metadata = {
  title: "Speisekarte & Getränke",
  description:
    "Alle Karten von Wald & Wiese auf einen Blick — Abendkarte mit Burger, Bowls und Grill, Getränkekarte, und das kommende Frühstücks-Konzept.",
  alternates: { canonical: "/speisen" },
};

const cards = [
  {
    title: "Abendkarte",
    text: "Burger, Bowls, vom Grill. Vegan, vegetarisch und herzhaft gleichberechtigt auf der Karte.",
    href: "/abendessen" as const,
    cta: "Karte ansehen",
  },
  {
    title: "Getränke",
    text: "Kaffee, hausgemachte Limonaden, regionale Weine, Cocktails — auch entkoffeiniert und alkoholfrei.",
    href: "/getraenke" as const,
    cta: "Getränke ansehen",
  },
  {
    title: "Frühstück",
    text: "Mitten im Grünen, ehrlich gekocht, regional.",
    href: "/brunch" as const,
    cta: "Reinschauen",
    badge: `ab ${BREAKFAST_LAUNCH.dateShort}`,
  },
];

export default function SpeisenPage() {
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
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Karten</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Was bei uns{" "}
            <span className="accent">auf den Tisch kommt.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Drei Karten, eine Küche. Regional, saisonal, ehrlich.
          </p>
        </div>
      </section>

      {/* KARTEN — große, lesbare Liste (echte Gericht-Fotos liegen noch nicht vor) */}
      <section className="relative isolate bg-waldgruen-dark text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pb-24 md:pb-32 pt-4 md:pt-6">
          <ul className="border-t border-mehlcreme/15 reveal-1">
            {cards.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="group flex items-center justify-between gap-6 py-7 md:py-9 border-b border-mehlcreme/15"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-normal tracking-tight text-mehlcreme group-hover:text-tonwarm transition-colors">
                        {c.title}
                      </h2>
                      {c.badge && (
                        <span className="bg-tonwarm text-white text-[0.6rem] tracking-[0.22em] uppercase px-3 py-1.5 rounded-full font-medium">
                          {hasBreakfastLaunched() ? "Neu" : c.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 italic text-mehlcreme/55 text-base md:text-lg max-w-xl">
                      {c.text}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-mehlcreme/80 group-hover:text-tonwarm transition-colors font-medium">
                      {c.cta}
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
          <LeafDivider tone="light" className="mt-16 opacity-80" />
        </div>
      </section>
    </>
  );
}
