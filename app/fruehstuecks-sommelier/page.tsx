import Link from "next/link";
import { SommelierQuiz } from "@/components/sommelier/sommelier-quiz";
import { LeafDivider } from "@/components/leaf-divider";

export const metadata = {
  title: "Frühstücks-Sommelier — deine Empfehlung & dein Tisch",
  description:
    "Ein paar Fragen, dann hast du deine Empfehlung und einen Tisch bei Wald & Wiese in Sinzing — fürs Frühstück oder den Wochenend-Abend. Probier den Frühstücks-Sommelier.",
  alternates: { canonical: "/fruehstuecks-sommelier" },
};

export default function SommelierPage() {
  return (
    <>
      {/* HEADER */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/speisekarte"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Speisekarte
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            Frühstücks-Sommelier
          </p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Was passt{" "}
            <span className="accent">zu dir?</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Ein paar kurze Fragen — und am Ende hast du deine Empfehlung und
            einen Tisch zur passenden Zeit.
          </p>
        </div>
      </section>

      {/* QUIZ */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-2xl px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
          <div className="reveal">
            <SommelierQuiz />
          </div>
          <p className="mt-8 text-center text-xs text-waldgruen/45">
            Alle Empfehlungen kommen direkt aus unserer Speisekarte — fürs
            Frühstück wie für den Wochenend-Abend.
          </p>
          <LeafDivider tone="dark" className="mt-16 md:mt-20 opacity-90" />
        </div>
      </section>
    </>
  );
}
