import { GOOGLE_RATING, REVIEWS } from "@/lib/reviews";
import { GOOGLE_MAPS_URL } from "@/lib/site";

function Stars({ n }: { n: number }) {
  return (
    <span
      className="text-tonwarm text-lg tracking-[0.1em]"
      aria-label={`${n} von 5 Sternen`}
      role="img"
    >
      {"★".repeat(n)}
      <span className="text-stone-300">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

/**
 * Echte Google-Rezensionen als Social Proof. Daten in lib/reviews.ts.
 */
export function ReviewsSection() {
  return (
    <section
      id="rezensionen"
      className="bg-mehlcreme border-y border-stone-200 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
        <div className="text-center reveal">
          <p className="eyebrow no-line justify-center">Was Gäste sagen</p>
          <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Echt &amp; <span className="accent">5 Sterne.</span>
          </h2>
          <p className="mt-6 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Originale Rezensionen unserer Gäste auf Google.
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white ring-1 ring-waldgruen/10 px-5 py-2.5 hover:ring-tonwarm/40 transition-colors"
          >
            <span className="text-tonwarm tracking-[0.1em]" aria-hidden>
              ★★★★★
            </span>
            <span className="font-display text-xl text-waldgruen">
              {GOOGLE_RATING.value.toLocaleString("de-DE")}
            </span>
            <span className="text-sm text-stone-500">
              · {GOOGLE_RATING.count} Rezensionen auf Google
            </span>
          </a>
        </div>

        <ul className="mt-14 md:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {REVIEWS.map((r) => (
            <li
              key={r.name}
              className="reveal flex flex-col rounded-2xl bg-white ring-1 ring-waldgruen/10 p-7"
            >
              <Stars n={r.rating} />
              <p className="mt-4 flex-1 text-stone-700 leading-relaxed">
                „{r.text}“
              </p>
              <p className="mt-6 text-sm">
                <span className="font-medium text-waldgruen">{r.name}</span>
                <span className="text-stone-400"> · Google · {r.when}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
