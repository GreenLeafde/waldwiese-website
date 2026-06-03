import { ReviewsCarousel } from "@/components/reviews-carousel";
import { GOOGLE_RATING } from "@/lib/reviews";
import { GOOGLE_MAPS_URL } from "@/lib/site";

/**
 * Echte Google-Rezensionen als wischbares/klickbares Karussell. Daten in
 * lib/reviews.ts, Karten + Pfeile in components/reviews-carousel.tsx.
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
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white ring-1 ring-waldgruen/10 px-5 py-2.5 hover:ring-tonwarm/40 transition-colors"
          >
            <span className="text-[#f6b400] tracking-[0.1em]" aria-hidden>
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

        <ReviewsCarousel />
      </div>
    </section>
  );
}
