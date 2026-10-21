import Link from "next/link";
import type { ReactNode } from "react";
import { DaySection, type DayStage, toneOf } from "@/components/day-section";
import { PageTone } from "@/components/page-tone";

/**
 * Seitenkopf (Redesign 10/2026) für Unterseiten ohne Foto im Kopf: Zurück-
 * Link oder Brotkrumen, Label, große Überschrift, ein Absatz, Platz für
 * Knöpfe. Hell oder dunkel je nach Tagesstufe; bei dunkler Stufe wechselt
 * auch der Header (PageTone).
 */
export function PageHead({
  stage = "morgen",
  crumb,
  label,
  title,
  accent,
  intro,
  children,
}: {
  stage?: DayStage;
  /** Zweite Brotkrume; ohne Angabe steht „← Startseite". */
  crumb?: string;
  label: string;
  title: string;
  accent?: string;
  intro?: string;
  children?: ReactNode;
}) {
  const dark = toneOf(stage) === "dunkel";
  const soft = dark ? "text-creme/60" : "text-tanne/60";
  const muted = dark ? "text-creme/75" : "text-muted-hell";
  return (
    <>
      {dark && <PageTone tone="dunkel" />}
      <DaySection stage={stage} className="pt-[116px] pb-12 md:pt-[140px] md:pb-16">
        <div className="mx-auto w-full max-w-[1180px] px-5 md:px-12">
          {crumb ? (
            <nav aria-label="Brotkrumen" className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${soft}`}>
              <Link href="/" className="hover:underline underline-offset-4">Startseite</Link>
              <span aria-hidden>/</span>
              <span>{crumb}</span>
            </nav>
          ) : (
            <Link
              href="/"
              className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${soft} hover:underline underline-offset-4`}
            >
              <span aria-hidden>←</span> Startseite
            </Link>
          )}
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">{label}</p>
          <h1 className="mt-3 max-w-[18ch] font-display text-[2.6rem] font-light leading-[1.05] md:text-[3.75rem]">
            {title}
            {accent && (
              <>
                {" "}
                <span className="font-normal">{accent}</span>
              </>
            )}
          </h1>
          {intro && <p className={`mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed ${muted}`}>{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </DaySection>
    </>
  );
}

/** Gemeinsame Klassen für Unterseiten, damit alle gleich gesetzt sind. */
export const UI = {
  container: "mx-auto w-full max-w-[1180px] px-5 md:px-12",
  narrow: "mx-auto w-full max-w-[860px] px-5 md:px-12",
  label: "text-xs font-semibold uppercase tracking-[0.16em] text-akzent",
  h2: "mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]",
  btnA: "inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-akzent px-[26px] text-[0.95rem] font-semibold text-white transition-colors hover:bg-akzent-hover",
  btnO: "inline-flex h-[50px] items-center justify-center gap-2 rounded-full px-[26px] text-[0.95rem] font-semibold shadow-[inset_0_0_0_1.5px_currentColor]",
  link: "font-semibold border-b-[1.5px] border-current pb-0.5",
  foto: "rounded-[18px] object-cover",
} as const;
