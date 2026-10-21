"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Der Tag beim Scrollen: Die Startseite liegt in diesem Wrapper, ihre
 * DaySections tragen data-bg. Beim Scrollen wird der Hintergrund des
 * Wrappers stufenlos zwischen den Farben der Sektionen gemischt (gemessen an
 * den Sektionsmitten), die Sektionen selbst werden durchsichtig. Außerdem
 * bekommt <html data-tone> den Ton der Sektion unter dem Header, damit
 * Header und Logo mitwechseln.
 *
 * Bei prefers-reduced-motion bleibt alles statisch: harte Stufen, kein JS.
 */
export function ScrollDay({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const secs = Array.from(root.querySelectorAll<HTMLElement>("[data-bg]"));
    if (secs.length === 0) return;
    secs.forEach((s) => (s.style.backgroundColor = "transparent"));

    const hex = (h: string) =>
      [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
    const mix = (a: number[], b: number[], k: number) =>
      `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;

    let raf = 0;
    const update = () => {
      raf = 0;
      // Anker: 45 % der Fensterhöhe. Innerhalb einer Sektion gilt ihre
      // Farbe; in einer Zone von ~35 % Fensterhöhe vor der nächsten
      // Sektionskante wird in deren Farbe übergeblendet. So stimmt die Farbe
      // auch bei sehr langen Sektionen (Speisekarte) an deren Anfang.
      const y = window.scrollY + window.innerHeight * 0.45;
      const zone = window.innerHeight * 0.35;
      const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
      let cur = secs[0];
      let next: HTMLElement | null = null;
      for (let i = 0; i < secs.length; i++) {
        if (top(secs[i]) <= y) {
          cur = secs[i];
          next = secs[i + 1] ?? null;
        }
      }
      let color = `rgb(${hex(cur.dataset.bg!).join(",")})`;
      if (next) {
        const d = top(next) - y;
        if (d < zone) color = mix(hex(cur.dataset.bg!), hex(next.dataset.bg!), 1 - Math.max(0, d) / zone);
      }
      root.style.backgroundColor = color;
      // Header und Sticky-Leisten lesen --bgc (globals.css) und laufen so mit.
      document.documentElement.style.setProperty("--bgc", color);

      // Ton für Header und Leisten aus der gemischten Farbe ableiten, damit
      // Schrift und Hintergrund nie auseinanderlaufen.
      const [cr, cg, cb] = color.match(/\d+/g)!.map(Number);
      const tone = (0.2126 * cr + 0.7152 * cg + 0.0722 * cb) / 255 < 0.5 ? "dunkel" : "hell";
      document.documentElement.dataset.tone = tone;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = window.setTimeout(update, 600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
      if (raf) window.cancelAnimationFrame(raf);
      secs.forEach((s) => (s.style.backgroundColor = s.dataset.bg ?? ""));
      document.documentElement.dataset.tone = "hell";
      document.documentElement.style.removeProperty("--bgc");
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
