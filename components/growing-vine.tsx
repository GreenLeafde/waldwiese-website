import type { CSSProperties } from "react";

/**
 * Botanische Ranke, die beim Scrollen „wächst": Der Stiel zeichnet sich von
 * unten nach oben (stroke-dashoffset), danach gehen die Blätter & Beeren
 * nacheinander auf. Komplett scroll-getrieben (CSS view-timeline `--vine` in
 * globals.css), kein JS. Mehlcreme-Blätter → für grüne Hintergründe.
 *
 * `flip` spiegelt die Ranke (für die jeweils andere Seitenkante).
 */
type Leaf = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  range: string;
};

type Berry = { cx: number; cy: number; r: number; range: string };

// Reihenfolge von unten (hohes y) nach oben — so geht die Ranke „hoch".
const LEAVES: Leaf[] = [
  { cx: 22, cy: 280, rx: 12, ry: 5.5, rot: -34, range: "entry 6% cover 24%" },
  { cx: 42, cy: 248, rx: 12, ry: 5.5, rot: 34, range: "entry 13% cover 31%" },
  { cx: 20, cy: 208, rx: 13, ry: 6, rot: -30, range: "entry 22% cover 40%" },
  { cx: 44, cy: 172, rx: 13, ry: 6, rot: 30, range: "entry 32% cover 50%" },
  { cx: 21, cy: 134, rx: 12, ry: 5.5, rot: -30, range: "entry 42% cover 60%" },
  { cx: 43, cy: 98, rx: 11, ry: 5, rot: 32, range: "entry 52% cover 70%" },
  { cx: 30, cy: 58, rx: 10, ry: 4.8, rot: -8, range: "entry 62% cover 80%" },
];

const BERRIES: Berry[] = [
  { cx: 40, cy: 230, r: 3, range: "entry 17% cover 35%" },
  { cx: 18, cy: 154, r: 3, range: "entry 46% cover 64%" },
  { cx: 38, cy: 84, r: 2.6, range: "entry 58% cover 76%" },
];

function leafStyle(rot: number, range: string): CSSProperties {
  return { "--rot": `${rot}deg`, animationRange: range } as CSSProperties;
}

export function GrowingVine({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
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
            style={leafStyle(l.rot, l.range)}
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
            style={leafStyle(0, b.range)}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
          />
        ))}
      </g>
    </svg>
  );
}
