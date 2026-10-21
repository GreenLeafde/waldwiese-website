"use client";

import { useEffect, useRef, useState } from "react";

type Tab = { slug: string; title: string };

/**
 * Sticky-Sprungleiste unter dem Header auf Karten-Seiten (Speisekarte,
 * Getränke). Reines Sprungmenü: markiert wird, wohin zuletzt gesprungen
 * wurde (kein Scroll-Spy, der bei zwei Spalten hin- und herspringt).
 * Farbe folgt der Seite über --bgc (hell → dunkel beim Scrollen).
 */
export function CategoryTabs({
  tabs,
  scrollOffset = 88,
}: {
  tabs: Tab[];
  scrollOffset?: number;
}) {
  const [active, setActive] = useState<string>(tabs[0]?.slug ?? "");
  const navRef = useRef<HTMLDivElement>(null);

  // Aktiven Tab in der horizontalen Leiste sichtbar halten (nur die Leiste
  // scrollen, nie die Seite).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLAnchorElement>(`[data-slug="${active}"]`);
    if (!btn) return;
    const pad = 24;
    const left = btn.offsetLeft;
    const right = left + btn.offsetWidth;
    if (left < nav.scrollLeft + pad || right > nav.scrollLeft + nav.clientWidth - pad) {
      nav.scrollTo({
        left: Math.max(0, left - nav.clientWidth / 2 + btn.offsetWidth / 2),
        behavior: "smooth",
      });
    }
  }, [active]);

  function handleClick(slug: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(slug);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(slug);
    };
  }

  return (
    <div
      className="cat-tabs sticky top-[92px] z-30 border-b text-tanne backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--bgc) 94%, transparent)",
        borderColor: "var(--linie, rgba(2,41,20,.15))",
      }}
    >
      <div
        ref={navRef}
        className="no-scrollbar mx-auto max-w-[1180px] overflow-x-auto"
      >
        <ul className="flex min-w-max items-stretch gap-6 px-5 md:px-12">
          {tabs.map((t) => {
            const isActive = active === t.slug;
            return (
              <li key={t.slug} className="shrink-0">
                <a
                  href={`#${t.slug}`}
                  data-slug={t.slug}
                  onClick={handleClick(t.slug)}
                  className={`block whitespace-nowrap border-b-2 py-3.5 text-[0.95rem] font-semibold transition-colors ${
                    isActive ? "border-akzent opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {t.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
