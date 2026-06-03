"use client";

import { useRef } from "react";
import { REVIEWS } from "@/lib/reviews";

const AVATAR_COLORS = [
  "bg-waldgruen",
  "bg-tonwarm",
  "bg-waldgruen-dark",
  "bg-tonwarm-dark",
];

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function StarRow() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[#f6b400] text-sm tracking-[0.05em]" aria-hidden>
        ★★★★★
      </span>
      {/* Verifiziert-Häkchen */}
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-label="verifiziert">
        <circle cx="12" cy="12" r="10" fill="#4285F4" />
        <path
          d="M7 12.5l3 3 7-7"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ReviewsCarousel() {
  const ref = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative mt-14 md:mt-20">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Vorherige Bewertungen"
        className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-11 w-11 rounded-full bg-white text-waldgruen shadow-md ring-1 ring-waldgruen/10 hover:text-tonwarm hover:shadow-lg transition"
      >
        <span aria-hidden className="text-2xl leading-none">‹</span>
      </button>

      <ul
        ref={ref}
        className="flex items-stretch gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-1 sm:px-8 py-2"
      >
        {REVIEWS.map((r, i) => (
          <li
            key={r.name}
            className="snap-center shrink-0 w-[85%] sm:w-[21rem] flex flex-col rounded-3xl bg-white ring-1 ring-waldgruen/10 shadow-sm p-6 md:p-7"
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid place-items-center h-11 w-11 rounded-full text-white font-display text-lg shrink-0 ${
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                }`}
                aria-hidden
              >
                {r.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-waldgruen truncate">{r.name}</p>
                <p className="text-xs text-stone-400">{r.when}</p>
              </div>
              <GoogleG className="ml-auto w-5 h-5 shrink-0" />
            </div>

            <div className="mt-4">
              <StarRow />
            </div>

            <p className="mt-3 text-stone-700 leading-relaxed">{r.text}</p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Weitere Bewertungen"
        className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-11 w-11 rounded-full bg-white text-waldgruen shadow-md ring-1 ring-waldgruen/10 hover:text-tonwarm hover:shadow-lg transition"
      >
        <span aria-hidden className="text-2xl leading-none">›</span>
      </button>
    </div>
  );
}
