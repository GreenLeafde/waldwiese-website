import Image from "next/image";
import type { ReactNode } from "react";

type HeroProps = {
  image: { src: string; alt: string };
  /** Position des Hintergrundbild-Fokus (Tailwind object-position). */
  focal?: string;
  /** Wie dunkel das Overlay ist — 0 = transparent, 1 = schwarz. Default 0.6 */
  overlay?: number;
  /** Höhe; default = große Hero-Höhe für Startseite. */
  height?: "lg" | "md" | "sm";
  children: ReactNode;
};

const HEIGHT_CLASS = {
  lg: "min-h-[88vh] md:min-h-[92vh]",
  md: "min-h-[68vh] md:min-h-[72vh]",
  sm: "min-h-[52vh] md:min-h-[58vh]",
};

/**
 * Full-bleed Hero mit Bild im Hintergrund.
 * Dunkles Gradient-Overlay sorgt dafür, dass die Mehlcreme-Schrift immer lesbar bleibt,
 * egal wie hell das Bild ist.
 */
export function Hero({
  image,
  focal = "center",
  overlay = 0.55,
  height = "lg",
  children,
}: HeroProps) {
  return (
    <section
      className={`relative isolate flex items-end overflow-hidden bg-waldgruen text-mehlcreme ${HEIGHT_CLASS[height]}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: focal }}
      />
      {/* Dunkles Gradient von unten — Text bleibt immer lesbar */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark via-waldgruen-dark/60 to-transparent"
        style={{ opacity: overlay + 0.1 }}
      />
      {/* Sanfter Dunkler-Schleier insgesamt für mehr Drama */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black"
        style={{ opacity: overlay * 0.35 }}
      />
      <div className="relative w-full mx-auto max-w-7xl px-5 md:px-8 pb-16 md:pb-24">
        {children}
      </div>
    </section>
  );
}
