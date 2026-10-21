"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = { src: string; pos?: string };

/**
 * Bewegter Hintergrund für den Hero: Fotos blenden langsam ineinander über,
 * jedes Bild zoomt dabei ganz leicht heraus. `offset` versetzt den Wechsel,
 * damit mehrere Felder nebeneinander nicht gleichzeitig umspringen.
 * Bei „weniger Bewegung" im System bleibt das erste Bild stehen.
 */
export function HeroSlides({
  slides,
  interval = 6500,
  offset = 0,
  sizes,
  priority = false,
}: {
  slides: Slide[];
  interval?: number;
  offset?: number;
  sizes: string;
  priority?: boolean;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: number | undefined;
    const start = window.setTimeout(() => {
      setI((n) => (n + 1) % slides.length);
      id = window.setInterval(() => setI((n) => (n + 1) % slides.length), interval);
    }, interval + offset);
    return () => {
      window.clearTimeout(start);
      if (id) window.clearInterval(id);
    };
  }, [slides.length, interval, offset]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {slides.map((s, n) => (
        <div
          key={s.src}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
          style={{ opacity: n === i ? 1 : 0 }}
        >
          <Image
            // key wechselt mit dem aktiven Bild, damit der Zoom neu startet
            key={n === i ? `${s.src}-on` : s.src}
            src={s.src}
            alt=""
            fill
            priority={priority && n === 0}
            sizes={sizes}
            className="slow-zoom no-reveal object-cover"
            style={{ objectPosition: s.pos ?? "center" }}
          />
        </div>
      ))}
    </div>
  );
}
