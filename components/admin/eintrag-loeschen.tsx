"use client";

import { useActionState, useEffect, useState } from "react";
import { loescheZeitAction, type ZeitState } from "@/app/actions/zeiten";

const INITIAL: ZeitState = { status: "idle", message: "" };

/**
 * Eine Zeitbuchung entfernen — mit Rueckfrage.
 *
 * Der Eintrag ist Grundlage der Lohnabrechnung und laesst sich nicht
 * zurueckholen. Deshalb steht in der Rueckfrage ausgeschrieben, welche Zeit
 * verschwindet.
 */
export function EintragLoeschen({
  id,
  name,
  datum,
  von,
  bis,
  stunden,
}: {
  id: number;
  name: string;
  datum: string;
  von: string;
  bis: string;
  stunden: string;
}) {
  const [offen, setOffen] = useState(false);
  const [state, formAction, pending] = useActionState(loescheZeitAction, INITIAL);

  useEffect(() => {
    if (state.status === "ok") setOffen(false);
  }, [state.status]);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") setOffen(false);
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(true)}
        aria-label={`Eintrag von ${name} am ${datum} löschen`}
        className="px-1 text-lg leading-none text-waldgruen/25 transition-colors hover:text-tonwarm-dark"
      >
        ×
      </button>

      {offen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-waldgruen/45 px-5"
          onClick={() => setOffen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-stone-soft p-6 text-left"
          >
            <h2 className="font-display text-2xl leading-tight text-waldgruen">
              Zeit löschen?
            </h2>
            <p className="mt-2 text-sm text-waldgruen/60">
              Die Buchung verschwindet aus der Auswertung und dem CSV-Export.
            </p>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-waldgruen/50">Wer</dt>
                <dd className="font-medium text-waldgruen">{name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-waldgruen/50">Tag</dt>
                <dd className="tabular-nums text-waldgruen">{datum}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-waldgruen/50">Zeit</dt>
                <dd className="tabular-nums text-waldgruen">
                  {von}–{bis}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-waldgruen/10 pt-2">
                <dt className="text-waldgruen/50">Entfällt</dt>
                <dd className="font-medium tabular-nums text-waldgruen">{stunden} Std.</dd>
              </div>
            </dl>

            {state.status === "error" && (
              <p role="alert" className="mt-3 text-sm text-tonwarm-dark">
                {state.message}
              </p>
            )}

            <form action={formAction} className="mt-6 flex gap-3">
              <input type="hidden" name="id" value={id} />
              <button
                type="button"
                onClick={() => setOffen(false)}
                className="flex-1 rounded-full border border-waldgruen/25 px-5 py-3 text-sm font-medium text-waldgruen/70 transition-colors hover:border-waldgruen hover:text-waldgruen"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex-1 rounded-full bg-tonwarm-dark px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-tonwarm disabled:opacity-60"
              >
                {pending ? "Moment …" : "Löschen"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
