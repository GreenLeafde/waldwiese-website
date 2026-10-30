"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import {
  aendereZeitAction,
  beendeStempelungAction,
  type ZeitState,
} from "@/app/actions/zeiten";

const INITIAL: ZeitState = { status: "idle", message: "" };

const FELD =
  "w-full rounded-xl border border-waldgruen/15 bg-white px-3.5 py-2 text-sm normal-case tracking-normal tabular-nums text-waldgruen outline-none focus:border-tonwarm";

function Dialog({
  titel,
  text,
  state,
  pending,
  action,
  schliessen,
  children,
}: {
  titel: string;
  text: string;
  state: ZeitState;
  pending: boolean;
  action: (formData: FormData) => void;
  schliessen: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-waldgruen/45 px-5"
      onClick={schliessen}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm whitespace-normal rounded-3xl bg-stone-soft p-6 text-left"
      >
        <h2 className="font-display text-2xl leading-tight text-waldgruen">{titel}</h2>
        <p className="mt-2 text-sm text-waldgruen/60">{text}</p>
        <form action={action} className="mt-4 space-y-3">
          {children}
          {state.status === "error" && (
            <p role="alert" className="text-sm text-tonwarm-dark">
              {state.message}
            </p>
          )}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={schliessen}
              className="flex-1 rounded-full border border-waldgruen/25 px-5 py-3 text-sm font-medium text-waldgruen/70 transition-colors hover:border-waldgruen hover:text-waldgruen"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-full bg-tonwarm px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-60"
            >
              {pending ? "Moment …" : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Feld({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1 text-xs uppercase tracking-[0.12em] text-waldgruen/45">
      <span>{label}</span>
      {children}
    </label>
  );
}

/** Eine falsche Stempelung korrigieren: Tag, Beginn und Ende. */
export function EintragBearbeiten({
  id,
  name,
  date,
  start,
  end,
}: {
  id: number;
  name: string;
  date: string;
  start: string;
  end: string;
}) {
  const [offen, setOffen] = useState(false);
  const [state, formAction, pending] = useActionState(aendereZeitAction, INITIAL);

  useEffect(() => {
    if (state.status === "ok") setOffen(false);
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="mr-2 text-xs font-medium text-waldgruen/50 underline-offset-2 transition-colors hover:text-waldgruen hover:underline"
      >
        Bearbeiten
      </button>
      {offen && (
        <Dialog
          titel="Zeit korrigieren"
          text={`Buchung von ${name}. Die Änderung gilt sofort für Auswertung und CSV-Export.`}
          state={state}
          pending={pending}
          action={formAction}
          schliessen={() => setOffen(false)}
        >
          <input type="hidden" name="id" value={id} />
          <Feld label="Tag">
            <input type="date" name="date" defaultValue={date} required className={FELD} />
          </Feld>
          <div className="grid grid-cols-2 gap-3">
            <Feld label="Beginn">
              <input type="time" name="start" defaultValue={start} required className={FELD} />
            </Feld>
            <Feld label="Ende">
              <input type="time" name="end" defaultValue={end} required className={FELD} />
            </Feld>
          </div>
        </Dialog>
      )}
    </>
  );
}

/** Eine vergessene Stempelung mit einer Uhrzeit beenden. */
export function StempelungBeenden({
  name,
  datum,
  seit,
}: {
  name: string;
  datum: string;
  seit: string;
}) {
  const [offen, setOffen] = useState(false);
  const [state, formAction, pending] = useActionState(beendeStempelungAction, INITIAL);

  useEffect(() => {
    if (state.status === "ok") setOffen(false);
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="font-medium underline underline-offset-2 hover:no-underline"
      >
        Ende eintragen
      </button>
      {offen && (
        <Dialog
          titel="Stempelung beenden"
          text={`${name} ist seit ${datum}, ${seit} Uhr eingestempelt. Wann war Schluss?`}
          state={state}
          pending={pending}
          action={formAction}
          schliessen={() => setOffen(false)}
        >
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="start" value={seit} />
          <Feld label="Ende">
            <input type="time" name="end" required className={FELD} />
          </Feld>
        </Dialog>
      )}
    </>
  );
}
