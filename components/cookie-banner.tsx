"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConsent } from "./consent-provider";
import {
  CONSENT_CATEGORIES,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/consent";
import { hasConsentTracking } from "@/lib/tracking";

export function CookieBanner() {
  const {
    ready,
    decided,
    isOpen,
    settingsOpen,
    consent,
    acceptAll,
    rejectAll,
    save,
    close,
  } = useConsent();

  const [view, setView] = useState<"compact" | "settings">("compact");
  const [draft, setDraft] = useState<ConsentState>(consent);

  useEffect(() => {
    if (isOpen) {
      setView(settingsOpen ? "settings" : "compact");
      setDraft(consent);
    }
  }, [isOpen, settingsOpen, consent]);

  // Solange kein Tracking konfiguriert ist, brauchen wir kein Consent-Banner:
  // Das einzige externe Element (Google-Maps-Karte) holt sich die Zustimmung
  // selbst per „Karte laden". Sobald Tracking-IDs gesetzt sind, erscheint das
  // Banner automatisch wieder.
  if (!ready || !isOpen || !hasConsentTracking()) return null;

  const toggle = (key: ConsentCategory) =>
    setDraft((d) => ({ ...d, [key]: !d[key] }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie-Einstellungen"
    >
      {/* Backdrop — beim Reopen klickbar zum Schließen, beim Erstbesuch nicht */}
      <div
        className="absolute inset-0 bg-nacht/50"
        onClick={decided ? close : undefined}
        aria-hidden
      />

      <div className="relative m-0 max-h-[90vh] w-full overflow-y-auto rounded-t-[20px] bg-morgen text-tanne shadow-2xl sm:m-6 sm:max-w-2xl sm:rounded-[20px]">
        <div className="px-6 md:px-9 py-7 md:py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Datenschutz</p>
          <h2 className="mt-3 font-display text-[1.7rem] font-light leading-tight md:text-[2rem]">
            Cookies &amp; Komfort
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-hell leading-relaxed">
            Notwendige Cookies brauchen wir, damit die Seite funktioniert.
            Statistik, Marketing und die eingebettete Karte laden wir nur, wenn
            du zustimmst. Du kannst deine Wahl jederzeit ändern. Mehr dazu in
            unserer{" "}
            <Link href="/datenschutz" className="font-semibold underline underline-offset-4">
              Datenschutzerklärung
            </Link>
            .
          </p>

          {view === "settings" && (
            <ul className="mt-7 space-y-1 divide-y divide-tanne/15 border-y border-tanne/15">
              <li className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-lg">
                    Notwendig
                  </p>
                  <p className="mt-1 text-sm text-muted-hell leading-relaxed">
                    Für den Betrieb der Seite erforderlich. Immer aktiv.
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.18em] text-muted-hell">
                  Aktiv
                </span>
              </li>
              {CONSENT_CATEGORIES.map((cat) => (
                <li
                  key={cat.key}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-display text-lg">
                      {cat.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-hell leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draft[cat.key]}
                    aria-label={`${cat.label} ${draft[cat.key] ? "aktiviert" : "deaktiviert"}`}
                    onClick={() => toggle(cat.key)}
                    className={`mt-1 shrink-0 relative h-7 w-12 rounded-full transition-colors ${
                      draft[cat.key] ? "bg-akzent" : "bg-tanne/20"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                        draft[cat.key] ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
            {view === "compact" ? (
              <>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="order-1 sm:order-3 inline-flex h-[50px] justify-center items-center gap-2 rounded-full bg-akzent px-7 font-semibold text-white transition-colors hover:bg-akzent-hover"
                >
                  Alle akzeptieren
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="order-2 inline-flex h-[50px] justify-center items-center rounded-full px-7 font-semibold text-tanne shadow-[inset_0_0_0_1.5px_currentColor] transition-colors hover:bg-tanne/5"
                >
                  Nur notwendige
                </button>
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  className="order-3 sm:order-1 sm:mr-auto text-sm text-muted-hell hover:text-tanne underline underline-offset-4 transition-colors py-2"
                >
                  Einstellungen
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => save(draft)}
                  className="order-1 sm:order-3 inline-flex h-[50px] justify-center items-center gap-2 rounded-full bg-akzent px-7 font-semibold text-white transition-colors hover:bg-akzent-hover"
                >
                  Auswahl speichern
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="order-2 inline-flex h-[50px] justify-center items-center rounded-full px-7 font-semibold text-tanne shadow-[inset_0_0_0_1.5px_currentColor] transition-colors hover:bg-tanne/5"
                >
                  Alle akzeptieren
                </button>
                <button
                  type="button"
                  onClick={() => setView("compact")}
                  className="order-3 sm:order-1 sm:mr-auto text-sm text-muted-hell hover:text-tanne underline underline-offset-4 transition-colors py-2"
                >
                  Zurück
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
