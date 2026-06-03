"use client";

import { useEffect, useRef } from "react";

/**
 * Full-Page-Snap für die Startseite: eine Scroll-Geste (Wheel/Swipe/Pfeiltaste)
 * springt zur nächsten Sektion und rastet ein — kein freies Scrollen dazwischen.
 * Der Übergang ist ein kurzer grüner Fade (Overlay) mit Instant-Sprung dahinter,
 * also „direkt springen, aber smooth".
 *
 * Sektionen, die höher als der Bildschirm sind (z. B. die lange Karten-Liste,
 * Über uns), bekommen einen zweiten „Stopp" am unteren Rand — so wird der
 * Inhalt in zwei Schritten durchgeblättert und nichts bleibt versteckt.
 *
 * Fällt sauber zurück:
 *   - prefers-reduced-motion → kein Hijack, normales Scrollen (+ CSS-Snap).
 *   - kein JS → das gerenderte Overlay ist unsichtbar/inert, Seite scrollt normal.
 * Greift NICHT, solange das mobile Menü offen ist (body overflow:hidden).
 */
export function SectionSnap() {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const html = document.documentElement;
    const prevSnap = html.style.scrollSnapType;
    const prevBehavior = html.style.scrollBehavior;
    // JS übernimmt die Kontrolle — CSS-Snap & Smooth aus, damit nichts doppelt wirkt.
    html.style.scrollSnapType = "none";
    html.style.scrollBehavior = "auto";

    const overlay = overlayRef.current;
    const timers = new Set<number>();
    const after = (ms: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    let stops: number[] = [];
    const computeStops = () => {
      const vh = window.innerHeight;
      const secs = Array.from(
        document.querySelectorAll("main section"),
      ) as HTMLElement[];
      const list: number[] = [];
      for (const el of secs) {
        const top = Math.round(el.offsetTop);
        const h = el.offsetHeight;
        list.push(top);
        // Deutlich höher als der Viewport: zweiter Stopp am unteren Rand.
        // Schwelle großzügig (+110), damit knapp-zu-hohe Sektionen keinen
        // störenden Mini-Schritt erzeugen (minimaler Rand-Clip ist ok, da
        // Inhalt vertikal zentriert ist).
        if (h > vh + 110) list.push(Math.round(top + h - vh));
      }
      stops = Array.from(new Set(list)).sort((a, b) => a - b);
    };
    computeStops();

    const menuOpen = () => document.body.style.overflow === "hidden";

    let locked = false;
    const nearestIndex = () => {
      const y = window.scrollY;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < stops.length; i++) {
        const d = Math.abs(stops[i] - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    };

    const goTo = (index: number) => {
      const clamped = Math.min(Math.max(index, 0), stops.length - 1);
      const current = nearestIndex();
      if (clamped === current || locked || !stops.length) return;
      locked = true;
      if (overlay) {
        overlay.style.transition = "opacity 190ms ease";
        overlay.style.opacity = "1";
      }
      after(200, () => {
        window.scrollTo({ top: stops[clamped], left: 0, behavior: "auto" });
        if (overlay) {
          requestAnimationFrame(() => {
            overlay.style.transition = "opacity 300ms ease";
            overlay.style.opacity = "0";
          });
        }
        after(310, () => {
          locked = false;
        });
      });
    };
    const step = (dir: number) => goTo(nearestIndex() + dir);

    const onWheel = (e: WheelEvent) => {
      if (menuOpen()) return;
      // Horizontale Gesten (z. B. Rezensions-Karussell) nicht abfangen.
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 4) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    let startY: number | null = null;
    let startX = 0;
    let axis: "v" | "h" | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (menuOpen() || e.touches.length !== 1) {
        startY = null;
        return;
      }
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      axis = null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY == null) return;
      const dy = e.touches[0].clientY - startY;
      const dx = e.touches[0].clientX - startX;
      if (axis == null && Math.abs(dx) + Math.abs(dy) > 8) {
        axis = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
      }
      // Nur vertikale Gesten kapern; horizontale (Karussell) frei lassen.
      if (axis === "v" && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startY == null) return;
      const dy = startY - e.changedTouches[0].clientY;
      if (axis === "v" && Math.abs(dy) > 45) step(dy > 0 ? 1 : -1);
      startY = null;
      axis = null;
    };

    const onKey = (e: KeyboardEvent) => {
      if (menuOpen()) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(stops.length - 1);
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(computeStops, 150);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", computeStops);
    // Nach Schriften/Bildern noch einmal nachmessen.
    after(700, computeStops);

    return () => {
      html.style.scrollSnapType = prevSnap;
      html.style.scrollBehavior = prevBehavior;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", computeStops);
      window.clearTimeout(resizeTimer);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Grünes Übergangs-Overlay (liegt UNTER dem Header, der bleibt sichtbar).
  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="fixed inset-0 z-30 bg-waldgruen-dark pointer-events-none"
      style={{ opacity: 0 }}
    />
  );
}
