import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH } from "@/lib/site";

export const metadata = {
  title: "Speisekarte & Getränke",
  description:
    "Alle Karten von Wald & Wiese auf einen Blick — Abendkarte mit Burger, Bowls und Grill, Getränkekarte, und das kommende Frühstücks-Konzept.",
};

const cards = [
  {
    title: "Abendkarte",
    text: "Burger, Bowls, vom Grill. Vegan, vegetarisch und herzhaft gleichberechtigt auf der Karte.",
    href: "/abendessen" as const,
    img: IMG.burger,
    cta: "Karte ansehen",
  },
  {
    title: "Getränke",
    text: "Kaffee, hausgemachte Limonaden, regionale Weine, Cocktails — auch entkoffeiniert und alkoholfrei.",
    href: "/getraenke" as const,
    img: IMG.cocktail,
    cta: "Getränke ansehen",
  },
  {
    title: "Frühstück",
    text: "Mitten im Grünen, ehrlich gekocht, regional.",
    href: "/fruehstueck" as const,
    img: IMG.hero,
    cta: "Reinschauen",
    badge: `ab ${BREAKFAST_LAUNCH.dateShort}`,
  },
];

export default function SpeisenPage() {
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
          <p className="eyebrow no-line justify-center">Karten</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Was bei uns{" "}
            <span className="accent">auf den Tisch kommt.</span>
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Drei Karten, eine Küche. Regional, saisonal, ehrlich.
          </p>
        </div>
      </section>

      {/* KARTEN-GRID */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pb-24 md:pb-32">
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {cards.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group block reveal"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={c.img.src}
                    alt={c.img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {c.badge && (
                    <span className="absolute top-4 left-4 bg-tonwarm text-white text-[0.6rem] tracking-[0.22em] uppercase px-3 py-1.5 rounded-full font-medium">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="mt-6">
                  <h2 className="text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen group-hover:text-tonwarm transition-colors">
                    {c.title}
                  </h2>
                  <p className="mt-3 font-display italic text-stone-600 leading-relaxed">
                    {c.text}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-3 text-sm text-tonwarm font-medium">
                    {c.cta}{" "}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
