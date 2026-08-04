"use client";

import { useActionState, useState } from "react";
import { teamLoginAction, type TeamLoginState } from "@/app/actions/team";

const INITIAL: TeamLoginState = { error: "" };

/**
 * Anmeldung fuers Restaurant: Namen antippen, Code eingeben. Kein Tippen von
 * E-Mail-Adressen — das Team steht am Handy oder am Tablet in der Kueche.
 */
export function TeamLoginForm({ staff }: { staff: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(teamLoginAction, INITIAL);
  const [gewaehlt, setGewaehlt] = useState<{ id: string; name: string } | null>(null);

  if (staff.length === 0) {
    return (
      <p className="text-sm text-waldgruen/70">
        Es ist noch niemand für den Team-Bereich freigeschaltet. Melde dich bei der
        Betriebsleitung.
      </p>
    );
  }

  if (!gewaehlt) {
    return (
      <div>
        <p className="text-sm font-medium text-waldgruen">Wer bist du?</p>
        <ul className="mt-3 space-y-2">
          {staff.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setGewaehlt(s)}
                className="w-full rounded-xl border border-waldgruen/15 bg-white px-4 py-3 text-left text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm"
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="userId" value={gewaehlt.id} />

      <div className="flex items-center justify-between gap-3">
        <span className="text-waldgruen">{gewaehlt.name}</span>
        <button
          type="button"
          onClick={() => setGewaehlt(null)}
          className="text-xs text-waldgruen/50 underline underline-offset-2 hover:text-tonwarm"
        >
          nicht ich
        </button>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-waldgruen mb-1.5">
          Code
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          className="w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-3 text-center text-2xl tracking-[0.4em] text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
        />
        <p className="mt-1.5 text-xs text-waldgruen/50">
          Den Code bekommst du von der Betriebsleitung.
        </p>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-tonwarm-dark">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-60"
      >
        {pending ? "Moment …" : "Anmelden"}
      </button>
    </form>
  );
}
