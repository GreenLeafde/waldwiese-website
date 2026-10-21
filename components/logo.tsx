import Link from "next/link";
import { LOGO_PATH, LOGO_VIEWBOX } from "./logo-path";

type LogoProps = {
  /** light = Creme (auf dunklem Grund), dark = Tanne (auf hellem Grund), current = erbt die Textfarbe. */
  variant?: "light" | "dark" | "current";
  showSubtitle?: boolean;
  className?: string;
  /** Höhe in Pixeln; Breite ergibt sich aus dem Seitenverhältnis (297.53 : 55.95). */
  height?: number;
};

/**
 * Echte Wortmarke „WALD & WIESE" (geschwungener Ampersand) als Inline-SVG
 * aus dem Original-Vektor (public/brand/wald-und-wiese-*.svg). Inline, damit
 * die Farbe per currentColor dem Tageszeit-Ton folgt (Header auf der
 * Startseite wechselt beim Scrollen von Tanne auf Creme).
 */
export function Logo({
  variant = "current",
  showSubtitle = false,
  className = "",
  height = 22,
}: LogoProps) {
  const color =
    variant === "light" ? "text-creme" : variant === "dark" ? "text-tanne" : "";
  return (
    <Link
      href="/"
      aria-label="Wald & Wiese — Startseite"
      className={`inline-flex flex-col items-start leading-none ${color} ${className}`}
    >
      <svg
        viewBox={LOGO_VIEWBOX}
        role="img"
        aria-label="Wald & Wiese"
        style={{ height, width: "auto" }}
        className="block"
      >
        <path fill="currentColor" d={LOGO_PATH} />
      </svg>
      {showSubtitle && (
        <span className="mt-2 text-[0.65rem] tracking-[0.3em] uppercase opacity-80">
          Sinzing · bei Regensburg
        </span>
      )}
    </Link>
  );
}
