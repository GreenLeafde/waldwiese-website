"use client";

import { useEffect, useRef, useState } from "react";
import { LeafOrnament } from "./leaf-ornament";
import { RESERVATION_URL } from "@/lib/site";

/**
 * Eingangs-Sektion der Startseite.
 *
 * UX:
 *   - Beim Laden sieht man das große WALD & WIESE Logo + „Sinzing · bei
 *     Regensburg" + Scroll-Cue (Fade-in beim ersten Render).
 *   - Die Sektion ist ~200vh hoch. Innen liegt ein `position: sticky`
 *     Container, der das Hero in voll Viewport-Höhe gepinnt hält.
 *   - Beim Scrollen schwindet der Untertitel + Scroll-Cue, gleichzeitig
 *     fadet ein Button-Trio (Reservieren · Speisekarte · Getränkekarte) ein.
 *   - Sobald die Sektion verlassen wird, gehts in den normalen Onepager.
 *
 * Implementiert als Client Component mit Scroll-Listener — bewusst kein
 * scroll-driven CSS, damit's auch in Safari sauber läuft.
 */
export function LogoIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      // 0 = ganz oben in der Section, 1 = letztes Pixel
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Klar getrennte Phasen (0–1 progress) — keine Überlappung von Subtext/Buttons:
  //   0.00 – 0.10 → ruhig wie Anfangsbild
  //   0.10 – 0.35 → Subtext + Scroll-Cue faden raus
  //   0.40 – 0.65 → Buttons faden ein (startet erst NACH Subtext-Ende)
  //   0.65 – 1.00 → stabil mit Buttons
  const subtextOpacity = clamp(1 - (progress - 0.1) / 0.25, 0, 1);
  const buttonsOpacity = clamp((progress - 0.4) / 0.25, 0, 1);
  // Subtle vertikales Drift des Logos, damit sich beim Scrollen was bewegt
  const logoLift = progress * -24; // px

  const links: Array<{ label: string; href: string; external?: boolean }> = [
    { label: "Reservieren", href: RESERVATION_URL, external: true },
    { label: "Speisekarte", href: "/abendessen" },
    { label: "Getränkekarte", href: "/getraenke" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative isolate bg-waldgruen text-mehlcreme"
      style={{ height: "200svh" }}
    >
      {/* Sticky-Container — das, was der Nutzer sieht */}
      <div className="sticky top-0 h-svh w-full overflow-hidden flex items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-waldgruen-dark/50"
        />

        {/* Ornamente — nur auf sehr breiten Screens (xl+), wo sie im seitlichen
            Freiraum NEBEN dem zentrierten Inhalt liegen. Auf schmaleren Screens
            ausgeblendet, damit die Ranken nicht hinter den Buttons durchlaufen. */}
        <div className="hidden xl:block anim-ornament delay-200 absolute left-[6%] 2xl:left-[11%] top-1/2 -translate-y-1/2 h-[50%] max-h-[360px] w-auto pointer-events-none">
          <LeafOrnament variant="leaves-berries" className="h-full w-auto" />
        </div>

        <div className="hidden xl:block anim-ornament delay-400 absolute right-[6%] 2xl:right-[11%] top-1/2 -translate-y-1/2 h-[50%] max-h-[360px] w-auto pointer-events-none">
          <LeafOrnament variant="berries-stem" className="h-full w-auto" />
        </div>

        {/* Wortmarke + dynamischer Inhalt */}
        <div
          className="relative mx-auto w-full max-w-4xl px-6 text-center"
          style={{ transform: `translateY(${logoLift}px)` }}
        >
          <h1 className="font-display font-semibold leading-[0.95] tracking-[0.03em]">
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl anim-fade-up delay-600">
              WALD{" "}
              <span className="text-tonwarm italic font-normal anim-fade-up delay-800 inline-block">
                &amp;
              </span>
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl mt-1 sm:mt-2 anim-fade-up delay-1000">
              WIESE
            </span>
          </h1>

          {/* Slot für Subtitel ODER Buttons — strikt eines auf einmal */}
          <div className="relative mt-10 md:mt-14 h-36 md:h-28">
            <div
              className="absolute inset-x-0 top-0 flex flex-col items-center justify-start gap-3"
              style={{
                opacity: subtextOpacity,
                transform: `translateY(${(1 - subtextOpacity) * -10}px)`,
                pointerEvents: subtextOpacity > 0.5 ? "auto" : "none",
                transition: "opacity 200ms linear",
              }}
            >
              <p className="anim-fade-up delay-1200 text-xs md:text-sm tracking-[0.32em] uppercase text-mehlcreme/70">
                Sinzing · bei Regensburg
              </p>
              <div className="anim-fade-up delay-1200 w-12 h-px bg-tonwarm/70" />
            </div>

            {/* Buttons — faden ein NACHDEM Subtitel komplett weg ist */}
            <div
              className="absolute inset-x-0 top-0 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 md:gap-4"
              style={{
                opacity: buttonsOpacity,
                transform: `translateY(${(1 - buttonsOpacity) * 16}px)`,
                pointerEvents: buttonsOpacity > 0.5 ? "auto" : "none",
                transition: "opacity 200ms linear",
              }}
            >
              {links.map((link) => {
                const cls =
                  "inline-flex items-center gap-2 text-xs md:text-sm tracking-[0.14em] uppercase font-medium border border-mehlcreme/40 hover:border-tonwarm hover:bg-tonwarm hover:text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full transition-colors whitespace-nowrap";
                return link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {link.label}
                    <span aria-hidden>→</span>
                  </a>
                ) : (
                  <a key={link.label} href={link.href} className={cls}>
                    {link.label}
                    <span aria-hidden>→</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll-Cue — fadet mit Subtext aus */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-mehlcreme/50"
          style={{
            opacity: subtextOpacity,
            transition: "opacity 180ms linear",
          }}
        >
          <div className="anim-fade-up delay-1200 flex flex-col items-center gap-2">
            <span className="text-[0.65rem] tracking-[0.3em] uppercase">
              Scroll
            </span>
            <span aria-hidden className="block w-px h-10 bg-mehlcreme/40" />
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}
