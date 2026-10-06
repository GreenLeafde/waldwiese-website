"use client";

import { useEffect, useRef, useState } from "react";

type Tab = { slug: string; title: string };

/**
 * Sticky-Tab-Leiste oben auf Karten-Seiten (Speisekarte, Getränke).
 *
 * Verhalten:
 *  - Klick auf Tab springt sanft zur Kategorie-Section
 *  - Aktiver Tab wird automatisch hervorgehoben, wenn die Section im
 *    Viewport ist (IntersectionObserver)
 *  - Auf Mobile horizontal scrollbar, Active-Tab wird ins Sichtfeld gerollt
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

  /**
   * Bewusst KEIN Scroll-Spy mehr.
   *
   * Seit die Karten zweispaltig gesetzt sind, beginnen beide Spalten auf
   * derselben Höhe — es stehen also immer mehrere Kategorien gleichzeitig
   * im Bild, und welche davon „die aktuelle" ist, ist nicht eindeutig.
   * Jede Automatik (Sichtbarkeits-Ratio wie vorher, oder „zuletzt über der
   * Leiste") sprang deshalb beim Scrollen zwischen linker und rechter
   * Spalte hin und her.
   *
   * Die Leiste ist jetzt ein reines Sprungmenü: markiert wird, wohin man
   * zuletzt gesprungen ist. Ruhig und vorhersehbar.
   */

  /**
   * Aktiven Tab in der horizontalen Leiste sichtbar halten.
   * Nur `nav.scrollTo` — `scrollIntoView` würde auch die Seite selbst
   * vertikal verschieben und genau das Ruckeln auslösen, das wir hier
   * loswerden wollen. Und nur dann, wenn der Tab wirklich aus dem Bild
   * gelaufen ist.
   */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLAnchorElement>(`[data-slug="${active}"]`);
    if (!btn) return;

    const pad = 24;
    const left = btn.offsetLeft;
    const right = left + btn.offsetWidth;
    const viewLeft = nav.scrollLeft;
    const viewRight = viewLeft + nav.clientWidth;

    if (left < viewLeft + pad || right > viewRight - pad) {
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
    <div className="sticky top-[92px] z-30 bg-mehlcreme/95 backdrop-blur-md border-b border-waldgruen/10">
      <div
        ref={navRef}
        className="mx-auto max-w-5xl overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <ul className="flex items-stretch gap-1 px-5 sm:px-6 md:px-10 min-w-max">
          {tabs.map((t) => {
            const isActive = active === t.slug;
            return (
              <li key={t.slug} className="flex-shrink-0">
                <a
                  href={`#${t.slug}`}
                  data-slug={t.slug}
                  onClick={handleClick(t.slug)}
                  className={`block px-4 py-3.5 text-[0.7rem] tracking-[0.18em] uppercase font-medium transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? "text-waldgruen border-tonwarm"
                      : "text-waldgruen/40 border-transparent hover:text-waldgruen"
                  }`}
                >
                  {t.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Verstecken die native Scrollbar (WebKit) */}
      <style jsx>{`
        div[ref] :global(::-webkit-scrollbar) {
          display: none;
        }
        :global(.scrollbar-none::-webkit-scrollbar) {
          display: none;
        }
      `}</style>
      {/* Rechts: Fade-Hinweis dass mehr Tabs scrollbar sind (nur Mobile) */}
      <div
        aria-hidden
        className="md:hidden absolute right-0 top-0 bottom-0 w-10 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent"
      />
    </div>
  );
}
