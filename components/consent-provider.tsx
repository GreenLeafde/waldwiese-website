"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ALL_GRANTED,
  consentModeUpdate,
  type ConsentCategory,
  type ConsentState,
  DEFAULT_CONSENT,
  readConsent,
  writeConsent,
} from "@/lib/consent";

type ConsentContextValue = {
  /** true, sobald der Cookie clientseitig gelesen wurde (verhindert SSR-Mismatch). */
  ready: boolean;
  /** Hat der Nutzer bereits eine Entscheidung getroffen? */
  decided: boolean;
  consent: ConsentState;
  /** Soll das Banner/der Dialog sichtbar sein? */
  isOpen: boolean;
  /** true = direkt die Detail-Einstellungen zeigen (Reopen via Footer). */
  settingsOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (consent: ConsentState) => void;
  grant: (category: ConsentCategory) => void;
  openSettings: () => void;
  close: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent muss innerhalb von <ConsentProvider> genutzt werden.");
  }
  return ctx;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setConsent(stored);
      setDecided(true);
      consentModeUpdate(stored);
    }
    setReady(true);
  }, []);

  const apply = useCallback((next: ConsentState) => {
    setConsent(next);
    setDecided(true);
    writeConsent(next);
    consentModeUpdate(next);
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(() => apply(ALL_GRANTED), [apply]);
  const rejectAll = useCallback(() => apply(DEFAULT_CONSENT), [apply]);
  const save = useCallback((next: ConsentState) => apply(next), [apply]);
  const grant = useCallback(
    (category: ConsentCategory) => apply({ ...consent, [category]: true }),
    [apply, consent],
  );
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const close = useCallback(() => setSettingsOpen(false), []);

  const isOpen = ready && (!decided || settingsOpen);

  return (
    <ConsentContext.Provider
      value={{
        ready,
        decided,
        consent,
        isOpen,
        settingsOpen,
        acceptAll,
        rejectAll,
        save,
        grant,
        openSettings,
        close,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
