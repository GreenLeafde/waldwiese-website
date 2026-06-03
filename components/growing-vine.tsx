"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/**
 * Botanische Ranke, die „wächst", sobald ihre Sektion ins Bild kommt: Der Stiel
 * zeichnet sich von unten nach oben, danach gehen Blätter & Beeren gestaffelt
 * auf. Ausgelöst per IntersectionObserver (Klasse `grow`) → ZEITBASIERTE CSS-
 * Animation, läuft in allen Browsern und passt zum Snap-Springen (wächst beim
 * Ankommen). Ohne JS bleibt sie einfach fertig gezeichnet stehen.
 *
 * `flip` spiegelt die Ranke (für die jeweils andere Seitenkante).
 */
type Leaf = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  /** Verzögerung in ms, gestaffelt von unten nach oben. */
  delay: number;
};

type Berry = { cx: number; cy: number; r: number; delay: number };

// Reihenfolge von unten (hohes y) nach oben — so geht die Ranke „hoch".
const LEAVES: Leaf[] = [
  { cx: 22, cy: 280, rx: 12, ry: 5.5, rot: -34, delay: 160 },
  { cx: 42, cy: 248, rx: 12, ry: 5.5, rot: 34, delay: 250 },
  { cx: 20, cy: 208, rx: 13, ry: 6, rot: -30, delay: 360 },
  { cx: 44, cy: 172, rx: 13, ry: 6, rot: 30, delay: 470 },
  { cx: 21, cy: 134, rx: 12, ry: 5.5, rot: -30, delay: 580 },
  { cx: 43, cy: 98, rx: 11, ry: 5, rot: 32, delay: 690 },
  { cx: 30, cy: 58, rx: 10, ry: 4.8, rot: -8, delay: 800 },
];

const BERRIES: Berry[] = [
  { cx: 40, cy: 230, r: 3, delay: 300 },
  { cx: 18, cy: 154, r: 3, delay: 620 },
  { cx: 38, cy: 84, r: 2.6, delay: 760 },
];

function leafStyle(rot: number, delay: number): CSSProperties {
  return { "--rot": `${rot}deg`, "--delay": `${delay}ms` } as CSSProperties;
}

export function GrowingVine({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduzierte Bewegung oder kein Observer → einfach fertig gezeichnet lassen.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    // „armed" = versteckt; passiert außerhalb des Sichtfelds → kein Aufblitzen.
    el.classList.add("armed");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Beim Hineinkommen wachsen, beim Verlassen zurücksetzen (Replay).
          el.classList.toggle("grow", entry.isIntersecting);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 64 320"
      fill="none"
      aria-hidden
      className={`vine ${flip ? "-scale-x-100" : ""} ${className}`}
    >
      {/* Stiel — zeichnet sich von unten nach oben */}
      <path
        className="vine-stem"
        pathLength={1}
        d="M32 314 C 30 282 37 252 31 222 C 26 194 37 164 30 134 C 25 106 36 80 31 54 C 30 46 30 40 30 34"
        stroke="var(--color-mehlcreme)"
        strokeOpacity="0.5"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Blätter — gehen gestaffelt auf */}
      <g fill="var(--color-mehlcreme)" fillOpacity="0.92">
        {LEAVES.map((l, i) => (
          <ellipse
            key={`l${i}`}
            className="vine-leaf"
            style={leafStyle(l.rot, l.delay)}
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
          />
        ))}
      </g>
      {/* Beeren — Tonwarm-Akzente */}
      <g fill="var(--color-tonwarm)">
        {BERRIES.map((b, i) => (
          <circle
            key={`b${i}`}
            className="vine-leaf"
            style={leafStyle(0, b.delay)}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
          />
        ))}
      </g>
    </svg>
  );
}
