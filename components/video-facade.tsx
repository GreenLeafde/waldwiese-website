"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * YouTube erst nach dem Klick laden: Vorher geht keine Verbindung zu Google
 * raus (Datenschutz) und die Seite bleibt schnell. Danach die
 * youtube-nocookie-Variante, die ohne Tracking-Cookies startet.
 */
export function VideoFacade({
  youtubeId,
  title,
  poster,
  posterAlt,
}: {
  youtubeId: string;
  title: string;
  poster: string;
  posterAlt: string;
}) {
  const [aktiv, setAktiv] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-waldgruen-dark ring-1 ring-mehlcreme/10 shadow-2xl">
      {aktiv ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAktiv(true)}
          className="group absolute inset-0 h-full w-full text-left"
          aria-label={`Video abspielen: ${title}`}
        >
          <Image
            src={poster}
            alt={posterAlt}
            fill
            sizes="(min-width: 768px) 70vw, 100vw"
            className="object-cover opacity-70 transition-opacity group-hover:opacity-85"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-tonwarm text-white shadow-xl transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-5 pt-12 text-sm text-mehlcreme/85">
            {title} · Beim Abspielen wird YouTube geladen.
          </span>
        </button>
      )}
    </div>
  );
}
