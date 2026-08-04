"use client";

import { useActionState, useState } from "react";
import { changePinAction, type PinState } from "@/app/actions/team";

const INITIAL: PinState = { error: "", saved: false };

/**
 * Eigenen Code aendern — als Abschnitt auf der eigenen Seite, nicht als
 * eigene Unterseite. Zugeklappt, damit die Stempeluhr im Vordergrund bleibt.
 */
export function PinChange() {
  const [state, formAction, pending] = useActionState(changePinAction, INITIAL);
  const [offen, setOffen] = useState(false);

  if (!offen) {
    return (
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="text-sm text-waldgruen/60 underline underline-offset-2 hover:text-tonwarm"
      >
        Code ändern
      </button>
    );
  }

  const feld =
    "w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-3 text-center text-xl tracking-[0.3em] text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20";

  return (
    <form action={formAction} className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl text-waldgruen">Code ändern</h2>
        <button
          type="button"
          onClick={() => setOffen(false)}
          className="text-xs text-waldgruen/50 underline underline-offset-2 hover:text-tonwarm"
        >
          schließen
        </button>
      </div>

      <div>
        <label htmlFor="alt" className="block text-sm text-waldgruen/70 mb-1.5">
          Bisheriger Code
        </label>
        <input id="alt" name="alt" type="password" inputMode="numeric" required className={feld} />
      </div>
      <div>
        <label htmlFor="neu" className="block text-sm text-waldgruen/70 mb-1.5">
          Neuer Code
        </label>
        <input id="neu" name="neu" type="password" inputMode="numeric" required className={feld} />
      </div>
      <div>
        <label htmlFor="neu2" className="block text-sm text-waldgruen/70 mb-1.5">
          Neuer Code wiederholen
        </label>
        <input id="neu2" name="neu2" type="password" inputMode="numeric" required className={feld} />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-tonwarm-dark">
          {state.error}
        </p>
      )}
      {state.saved && !state.error && (
        <p className="text-sm text-waldgruen/70">
          Geändert. Beim nächsten Anmelden gilt der neue Code.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-tonwarm px-6 py-3 font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-60"
      >
        {pending ? "Moment …" : "Code speichern"}
      </button>
    </form>
  );
}
