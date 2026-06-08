"use client";

import { useState } from "react";
import { useConsent } from "./consent-provider";
import { track } from "./analytics";
import { RESERVATION_URL } from "@/lib/site";

/**
 * Eingebettetes Lightspeed-Reservierungs-Widget ("LSK Reservation").
 *
 * Lightspeed bietet keinen offiziellen Embed-Code, die Reservierungsseite hat
 * aber KEIN X-Frame-Options/CSP — sie lässt sich also direkt als iframe
 * einbetten. Das Widget lädt Google reCAPTCHA + Google Fonts nach, überträgt
 * also Daten an Dritte → genau wie die Maps-Karte hinter die Einwilligung
 * "Externe Medien" gehängt (Klick-zum-Laden).
 *
 * Defensiv: Ein fremdes Buchungs-Widget nutzt eigene Cookies/Session. Manche
 * Browser blocken Third-Party-Cookies im iframe — deshalb immer ein sichtbarer
 * "in neuem Tab öffnen"-Fallback, falls das Absenden im iframe hakt.
 */
export function ReservationWidget() {
  const { ready, consent, grant } = useConsent();
  const [loaded, setLoaded] = useState(false);

  const fallback = (
    <a
      href={RESERVATION_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
    >
      In neuem Tab öffnen <span aria-hidden>→</span>
    </a>
  );

  if (ready && consent.externalMedia) {
    return (
      <div>
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-waldgruen/10 bg-white">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-soft">
              <span
                role="status"
                className="inline-flex items-center gap-3 text-sm text-waldgruen/60"
              >
                <span
                  aria-hidden
                  className="h-5 w-5 rounded-full border-2 border-waldgruen/20 border-t-tonwarm animate-spin"
                />
                Reservierung wird geladen …
              </span>
            </div>
          )}
          <iframe
            title="Tisch reservieren bei Wald & Wiese"
            src={RESERVATION_URL}
            onLoad={() => {
              setLoaded(true);
              track("reservation_open");
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[760px] w-full border-0"
          />
        </div>
        <p className="mt-4 text-xs text-waldgruen/50">
          Formular lädt nicht oder hakt beim Absenden? {fallback}
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl ring-1 ring-waldgruen/10 bg-stone-soft min-h-[380px] flex items-center justify-center">
      <div className="px-6 py-10 text-center max-w-md">
        <p className="font-display text-xl text-waldgruen">
          Online reservieren über Lightspeed
        </p>
        <p className="mt-3 text-sm text-waldgruen/60 leading-relaxed">
          Das Buchungs-Widget läuft über unseren Reservierungs-Dienst
          Lightspeed. Beim Laden werden Daten an Lightspeed und Google
          (reCAPTCHA) übertragen. Mehr dazu in unserer Datenschutzerklärung.
        </p>
        <div className="mt-6 flex flex-wrap justify-center items-center gap-5">
          <button
            type="button"
            onClick={() => grant("externalMedia")}
            disabled={!ready}
            className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-60"
          >
            Reservierung laden
          </button>
          {fallback}
        </div>
      </div>
    </div>
  );
}
