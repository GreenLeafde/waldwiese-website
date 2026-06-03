"use client";

import { useConsent } from "./consent-provider";
import { CONTACT, GOOGLE_MAPS_URL } from "@/lib/site";

/** Kostenlose, key-lose Google-Maps-Einbettung (output=embed) — keine API-Kosten. */
const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  `Wald und Wiese, ${CONTACT.street}, ${CONTACT.postalCode} ${CONTACT.city}`,
)}&output=embed`;

/**
 * Google-Maps-Karte mit Klick-zum-Laden (Opt-in). Ohne Einwilligung wird
 * nichts von Google nachgeladen — stattdessen ein Platzhalter mit
 * „Karte laden"-Button (Einwilligung für externe Medien) und einem Link
 * aufs echte Google-Listing.
 */
export function MapsEmbed() {
  const { ready, consent, grant } = useConsent();

  if (ready && consent.externalMedia) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-waldgruen/10">
        <iframe
          title={`Karte: ${CONTACT.street}, ${CONTACT.postalCode} ${CONTACT.city}`}
          src={EMBED_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-waldgruen/10 bg-stone-soft flex items-center justify-center">
      <div className="px-6 py-8 text-center max-w-sm">
        <p className="font-display text-lg text-waldgruen">
          Karte von Google Maps
        </p>
        <p className="mt-2 text-sm text-stone-500 leading-relaxed">
          Wenn du die Karte lädst, werden Daten an Google übertragen. Mehr in
          unserer Datenschutzerklärung.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => grant("externalMedia")}
            disabled={!ready}
            className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-60"
          >
            Karte laden
          </button>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
          >
            In Google Maps öffnen
          </a>
        </div>
      </div>
    </div>
  );
}
