import Image from "next/image";
import type { ReactNode } from "react";

type ImageBlockProps = {
  image: { src: string; alt: string };
  focal?: string;
  /** Wo das Content-Card hängen soll. Default „bottom-left". */
  position?: "bottom-left" | "center" | "top-right";
  /** Höhe des Blocks. */
  height?: "tall" | "regular" | "wide";
  /** Wie dunkel das Overlay. */
  overlay?: number;
  /** Ob es eine subtile Card mit Mehlcreme um den Content gibt. */
  card?: boolean;
  children: ReactNode;
};

const HEIGHT_CLASS = {
  tall: "min-h-[80vh] md:min-h-[75vh]",
  regular: "min-h-[60vh] md:min-h-[55vh]",
  wide: "min-h-[50vh] md:min-h-[45vh]",
};

const POSITION_CLASS = {
  "bottom-left": "items-end justify-start",
  center: "items-center justify-center text-center",
  "top-right": "items-start justify-end",
};

/**
 * Sektion mit Bild im Hintergrund — z. B. Story-Block, Zitat-mit-Bild, CTA-Hero
 * mitten in der Seite. Anders als <Hero/>: keine sticky-Höhe, frei platzierbar.
 */
export function ImageBlock({
  image,
  focal = "center",
  position = "bottom-left",
  height = "regular",
  overlay = 0.55,
  card = false,
  children,
}: ImageBlockProps) {
  return (
    <section
      className={`relative isolate flex overflow-hidden bg-waldgruen text-mehlcreme ${HEIGHT_CLASS[height]} ${POSITION_CLASS[position]}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: focal }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark/90 via-waldgruen-dark/40 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-black"
        style={{ opacity: overlay * 0.4 }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8 py-16 md:py-24">
        {card ? (
          <div className="bg-mehlcreme text-waldgruen p-8 md:p-12 max-w-xl rounded-sm">
            {children}
          </div>
        ) : (
          <div className="max-w-3xl">{children}</div>
        )}
      </div>
    </section>
  );
}
