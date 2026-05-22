import Link from "next/link";

type LogoProps = {
  variant?: "light" | "dark";
  showSubtitle?: boolean;
  className?: string;
};

/**
 * Wortmarke „WALD & WIESE" mit Heinzi-Ampersand-Schwung.
 * Bewusst in HTML/CSS gebaut statt PNG, damit es scharf bleibt und sich
 * der Schriftfarbe anpasst (light = creme, dark = waldgruen).
 */
export function Logo({ variant = "dark", showSubtitle = false, className = "" }: LogoProps) {
  const color = variant === "light" ? "text-mehlcreme" : "text-waldgruen";
  return (
    <Link
      href="/"
      aria-label="Wald & Wiese — Startseite"
      className={`inline-flex flex-col items-center leading-none ${color} ${className}`}
    >
      <span className="font-display text-2xl md:text-3xl tracking-[0.18em] uppercase">
        Wald{" "}
        <span className="italic font-normal lowercase tracking-normal text-[1.15em] align-middle">
          &amp;
        </span>{" "}
        Wiese
      </span>
      {showSubtitle && (
        <span className="mt-2 text-[0.65rem] tracking-[0.3em] uppercase opacity-80">
          Sinzing · bei Regensburg
        </span>
      )}
    </Link>
  );
}
