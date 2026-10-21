import { GOOGLE_RATING, REVIEWS } from "@/lib/reviews";
import { GOOGLE_MAPS_URL, GOOGLE_PLACE_ID } from "@/lib/site";

/** Direkt ins „Rezension schreiben“-Fenster von Google. */
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

/** Buntes Google-„G“ — damit das Widget als importiert erkennbar ist. */
export function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.4 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.7 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-3.9-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`tracking-[1px] text-[#FBBC04] ${className}`} aria-label="5 von 5 Sternen">
      ★★★★★
    </span>
  );
}

/**
 * Google-Bewertungen im Look eines importierten Widgets: weiße Karten,
 * runder Avatar mit Anfangsbuchstabe, Name, Datum, gelbe Sterne, buntes G.
 * Daten aus lib/reviews.ts; die Anbindung an die Places-API ist ein eigener
 * Schritt (Umsetzungsplan Phase 4) und ändert hier nur die Datenquelle.
 */
export function GoogleReviews({
  limit = 4,
  className = "",
}: {
  limit?: number;
  className?: string;
}) {
  const reviews = REVIEWS.slice(0, limit);
  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-5 py-4 text-[#1f1f1f]">
        <div className="flex items-center gap-3.5">
          <GoogleG className="h-8 w-8" />
          <div>
            <b className="block text-[0.95rem] font-semibold">Google Bewertungen</b>
            <span className="flex items-center gap-2 text-sm">
              <span className="text-lg font-semibold">
                {GOOGLE_RATING.value.toLocaleString("de-DE")}
              </span>
              <Stars />
              <span className="text-[#5f6368]">{GOOGLE_RATING.count} Bewertungen</span>
            </span>
          </div>
        </div>
        <a
          href={GOOGLE_WRITE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-[#1a73e8] shadow-[inset_0_0_0_1.5px_#dadce0] hover:bg-[#f8f9fa]"
        >
          Bewertung schreiben
        </a>
      </div>

      <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <li
            key={r.name}
            className={`grid content-start gap-2 rounded-xl bg-white p-[18px] text-[#1f1f1f] ${
              i >= 2 ? "hidden sm:grid" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#5b8a72] text-[1.05rem] font-semibold text-white">
                {r.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <b className="block truncate text-sm font-semibold">{r.name}</b>
                <small className="text-xs text-[#5f6368]">{r.when}</small>
              </div>
              <GoogleG className="ml-auto h-5 w-5 shrink-0" />
            </div>
            <Stars />
            <p className="m-0 line-clamp-5 text-sm leading-relaxed text-[#3c4043]">{r.text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-3.5 text-[0.8rem] text-muted">
        Echte Google-Rezensionen.{" "}
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          Alle {GOOGLE_RATING.count} auf Google lesen
        </a>
      </p>
    </div>
  );
}

/**
 * Kleine Google-Karte für den Hero: 4,9, Sterne, Anzahl, ein Zitat.
 */
export function GoogleBadge({ className = "" }: { className?: string }) {
  const r = REVIEWS[1] ?? REVIEWS[0];
  const short = r.name.split(" ").map((p, i) => (i === 0 ? p : `${p.charAt(0)}.`)).join(" ");
  return (
    <a
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`grid gap-1 rounded-[14px] bg-white px-[18px] py-4 text-[#1f1f1f] shadow-[0_18px_40px_-24px_rgba(2,41,20,.45)] ${className}`}
    >
      <span className="flex items-center gap-2.5">
        <GoogleG className="h-[22px] w-[22px]" />
        <span className="text-[1.9rem] font-semibold leading-none">
          {GOOGLE_RATING.value.toLocaleString("de-DE")}
        </span>
        <Stars className="text-[0.95rem]" />
      </span>
      <span className="text-[0.8rem] text-[#5f6368]">{GOOGLE_RATING.count} Google-Bewertungen</span>
      <span className="mt-1.5 text-sm leading-snug text-[#3c4043]">
        „{r.text.split(/(?<=[.!?])\s/)[0]}“
        <small className="mt-0.5 block text-xs text-[#5f6368]">
          {short} · {r.when}
        </small>
      </span>
    </a>
  );
}
