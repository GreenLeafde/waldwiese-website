import type { CSSProperties, ReactNode } from "react";

/** Tagesstufen aus der CI — Hintergrund einer Sektion. */
export const DAY_STAGES = {
  morgen: "#f7f4ec",
  "morgen-2": "#f1f2e6",
  vormittag: "#e8ebdc",
  mittag: "#dce3d2",
  daemmerung: "#1e3a2a",
  abend: "#0a3821",
  wald: "#052e18",
  "wald-2": "#042a16",
  tanne: "#022914",
  nacht: "#011c0d",
} as const;

export type DayStage = keyof typeof DAY_STAGES;
export type Tone = "hell" | "dunkel";

/** Welche Stufen hell gelesen werden (dunkle Schrift). */
const HELL: ReadonlySet<DayStage> = new Set(["morgen", "morgen-2", "vormittag", "mittag"]);

export function toneOf(stage: DayStage): Tone {
  return HELL.has(stage) ? "hell" : "dunkel";
}

/**
 * Eine Sektion mit Tagesstufe. Setzt Hintergrund und Schriftton und
 * hinterlegt beides als data-Attribute, damit ScrollDay (Startseite) den
 * Verlauf zwischen den Sektionen rechnen kann. Innerhalb von ScrollDay ist
 * der eigene Hintergrund transparent, der Verlauf liegt dahinter.
 */
export function DaySection({
  stage,
  id,
  className = "",
  style,
  children,
  as: Tag = "section",
}: {
  stage: DayStage;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  as?: "section" | "div" | "footer" | "header";
}) {
  const tone = toneOf(stage);
  return (
    <Tag
      id={id}
      data-tone={tone}
      data-bg={DAY_STAGES[stage]}
      className={`day-section ${tone === "hell" ? "text-tanne" : "text-creme"} ${className}`}
      style={{ backgroundColor: DAY_STAGES[stage], ...style }}
    >
      {children}
    </Tag>
  );
}
