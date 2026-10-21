"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { reservationHref, type ReserveSlot } from "@/lib/reservation";

export type { ReserveSlot };

type Ctx = {
  /** Öffnet die Vorauswahl. `pre` markiert einen Slot vor, `location` landet im Tracking. */
  open: (opts?: { pre?: ReserveSlot; location?: string }) => void;
};

const ReserveContext = createContext<Ctx | null>(null);

export function useReserve(): Ctx {
  const ctx = useContext(ReserveContext);
  if (!ctx) throw new Error("useReserve braucht den ReserveChooserProvider");
  return ctx;
}

/**
 * Stellt die Vorauswahl „Brunch oder Abendessen?" bereit. Jeder
 * Reservieren-Knopf der Seite öffnet dieses eine Modal; erst die Wahl darin
 * führt zu Lightspeed. Feiern und größere Gruppen gehen zur Anfrage.
 */
export function ReserveChooserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; pre?: ReserveSlot; location?: string }>({
    open: false,
  });
  const [picked, setPicked] = useState<ReserveSlot | "feier" | null>(null);
  const firstRef = useRef<HTMLAnchorElement>(null);

  const open = useCallback<Ctx["open"]>((opts) => {
    setPicked(opts?.pre ?? null);
    setState({ open: true, pre: opts?.pre, location: opts?.location });
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  useEffect(() => {
    if (!state.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [state.open, close]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ReserveContext.Provider value={value}>
      {children}
      {state.open && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-nacht/60 p-4 md:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reserve-title"
            className="w-full max-w-[480px] rounded-[20px] bg-morgen p-6 md:p-7 text-tanne shadow-2xl grid gap-3.5"
          >
            <h2 id="reserve-title" className="font-display font-light text-[1.7rem] leading-tight">
              Brunch oder Abendessen?
            </h2>

            <ChooserOption
              ref={firstRef}
              href={reservationHref("brunch")}
              location={state.location}
              title="Brunch"
              sub="Montag bis Sonntag, 8–14 Uhr"
              active={picked === "brunch"}
              onPick={() => setPicked("brunch")}
              onDone={close}
            />
            <ChooserOption
              href={reservationHref("abend")}
              location={state.location}
              title="Abendessen"
              sub="Freitag bis Sonntag, 17–22 Uhr"
              dark
              active={picked === "abend"}
              onPick={() => setPicked("abend")}
              onDone={close}
            />
            <Link
              href="/feiern#anfrage"
              onClick={close}
              className={`grid gap-0.5 rounded-[14px] border px-4 py-3.5 text-left transition-shadow hover:shadow-[0_0_0_2px_var(--color-akzent)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-akzent)] ${
                picked === "feier" ? "shadow-[0_0_0_2px_var(--color-akzent)]" : ""
              } border-tanne/20 bg-white`}
            >
              <span className="font-semibold">Feier oder größere Gruppe</span>
              <span className="text-sm text-muted-hell">Anfrage statt Online-Buchung</span>
            </Link>

            <p className="m-0 text-[0.8rem] text-muted-hell">
              Die Buchung läuft über unseren Reservierungs-Dienst Lightspeed und
              öffnet in einem neuen Tab.
            </p>
            <button
              type="button"
              onClick={close}
              className="justify-self-end text-sm text-muted-hell underline underline-offset-4 hover:text-tanne"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </ReserveContext.Provider>
  );
}

function ChooserOption({
  ref,
  href,
  location,
  title,
  sub,
  dark = false,
  active,
  onPick,
  onDone,
}: {
  ref?: React.Ref<HTMLAnchorElement>;
  href: string;
  /** Wo der Reservieren-Knopf saß — liest das Klick-Tracking (analytics.tsx). */
  location?: string;
  title: string;
  sub: string;
  dark?: boolean;
  active: boolean;
  onPick: () => void;
  onDone: () => void;
}) {
  return (
    <a
      ref={ref}
      href={href}
      data-location={location}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onPick}
      onFocus={onPick}
      onClick={onDone}
      className={`grid gap-0.5 rounded-[14px] border px-4 py-3.5 text-left transition-shadow hover:shadow-[0_0_0_2px_var(--color-akzent)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-akzent)] ${
        active ? "shadow-[0_0_0_2px_var(--color-akzent)]" : ""
      } ${dark ? "border-tanne bg-tanne text-creme" : "border-tanne/20 bg-white text-tanne"}`}
    >
      <span className="font-semibold text-[1.05rem]">{title}</span>
      <span className={`text-sm ${dark ? "text-creme/75" : "text-muted-hell"}`}>{sub}</span>
    </a>
  );
}

/**
 * Knopf, der die Vorauswahl öffnet. Ersetzt die direkten Lightspeed-Links.
 * `location` beschreibt den Ort für die Auswertung (z. B. "header", "hero").
 */
export function ReserveButton({
  children = "Reservieren",
  className = "",
  pre,
  location,
}: {
  children?: ReactNode;
  className?: string;
  pre?: ReserveSlot;
  location?: string;
}) {
  const { open } = useReserve();
  return (
    <button type="button" onClick={() => open({ pre, location })} className={className}>
      {children}
    </button>
  );
}
