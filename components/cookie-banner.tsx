"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConsent } from "./consent-provider";
import {
  CONSENT_CATEGORIES,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/consent";
import { hasGtm, hasHotjar } from "@/lib/tracking";

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
  if (!ready || !isOpen || !(hasGtm() || hasHotjar())) return null;

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
        className="absolute inset-0 bg-waldgruen-dark/40 backdrop-blur-[2px]"
        onClick={decided ? close : undefined}
        aria-hidden
      />

      <div className="relative w-full sm:max-w-2xl bg-white sm:rounded-2xl shadow-2xl ring-1 ring-waldgruen/10 m-0 sm:m-6 max-h-[90vh] overflow-y-auto">
        <div className="px-6 md:px-9 py-7 md:py-9">
          <p className="eyebrow no-line">Datenschutz</p>
          <h2 className="mt-4 text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen">
            Cookies &amp; <span className="accent">Komfort.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-stone-600 leading-relaxed">
            Notwendige Cookies brauchen wir, damit die Seite funktioniert.
            Statistik, Marketing und die eingebettete Karte laden wir nur, wenn
            du zustimmst. Du kannst deine Wahl jederzeit ändern. Mehr dazu in
            unserer{" "}
            <Link href="/datenschutz" className="text-tonwarm hover:underline">
              Datenschutzerklärung
            </Link>
            .
          </p>

          {view === "settings" && (
            <ul className="mt-7 space-y-1 divide-y divide-stone-200 border-y border-stone-200">
              <li className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-lg text-waldgruen">
                    Notwendig
                  </p>
                  <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                    Für den Betrieb der Seite erforderlich. Immer aktiv.
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.18em] text-stone-400">
                  Aktiv
                </span>
              </li>
              {CONSENT_CATEGORIES.map((cat) => (
                <li
                  key={cat.key}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-display text-lg text-waldgruen">
                      {cat.label}
                    </p>
                    <p className="mt-1 text-sm text-stone-500 leading-relaxed">
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
                      draft[cat.key] ? "bg-tonwarm" : "bg-stone-300"
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
                  className="order-1 sm:order-3 inline-flex justify-center items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3 rounded-full font-medium transition-colors"
                >
                  Alle akzeptieren
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="order-2 inline-flex justify-center items-center px-7 py-3 rounded-full font-medium text-waldgruen ring-1 ring-waldgruen/20 hover:ring-waldgruen/40 transition-colors"
                >
                  Nur notwendige
                </button>
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  className="order-3 sm:order-1 sm:mr-auto text-sm text-stone-500 hover:text-tonwarm underline underline-offset-4 transition-colors py-2"
                >
                  Einstellungen
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => save(draft)}
                  className="order-1 sm:order-3 inline-flex justify-center items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3 rounded-full font-medium transition-colors"
                >
                  Auswahl speichern
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="order-2 inline-flex justify-center items-center px-7 py-3 rounded-full font-medium text-waldgruen ring-1 ring-waldgruen/20 hover:ring-waldgruen/40 transition-colors"
                >
                  Alle akzeptieren
                </button>
                <button
                  type="button"
                  onClick={() => setView("compact")}
                  className="order-3 sm:order-1 sm:mr-auto text-sm text-stone-500 hover:text-tonwarm underline underline-offset-4 transition-colors py-2"
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
