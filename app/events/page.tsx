import Link from "next/link";
import { MAGIC_DINNER } from "@/lib/site";

export const metadata = {
  title: "Events",
  description:
    "Magic Dinner Summer Edition, Tischzauberei und besondere Abende bei Wald & Wiese in Sinzing.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
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
          <p className="eyebrow no-line justify-center">Events</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Abende, die du{" "}
            <span className="accent">nicht vergisst.</span>
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Manchmal ist Essen nur der Anfang. Magic Dinner, Tischzauberei,
            besondere Themenabende — wenn was Außergewöhnliches ansteht,
            findest du es hier.
          </p>
        </div>
      </section>

      {/* EVENT-LISTE */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pb-24 md:pb-32">
          <Link
            href="/events/magic-dinner-summer-edition"
            className="group block reveal border-y border-stone-200 py-12 md:py-16 hover:border-tonwarm transition-colors"
          >
            <div className="flex items-baseline gap-4 mb-5">
              <span className="font-display italic text-tonwarm text-xl leading-none">
                01
              </span>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-stone-400 font-medium">
                {MAGIC_DINNER.dateLong} · ab {MAGIC_DINNER.startTime}
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen group-hover:text-tonwarm transition-colors">
              Magic Dinner —{" "}
              <span className="accent">Summer Edition.</span>
            </h2>
            <p className="mt-7 font-display italic text-lg text-stone-600 max-w-2xl leading-relaxed">
              Mehrgängiges Menü, dazwischen Tischzauberei von{" "}
              {MAGIC_DINNER.magicianStageName} ({MAGIC_DINNER.magicianName}).
              Plätze sind begrenzt.
            </p>
            <p className="mt-8 inline-flex items-center gap-3 text-tonwarm font-medium">
              Programm & Tisch sichern <span aria-hidden>→</span>
            </p>
          </Link>

          <div className="mt-16 text-center text-sm text-stone-500 reveal">
            <p className="font-display italic">
              Weitere Events folgen — wir kündigen sie hier und auf Instagram
              an.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
