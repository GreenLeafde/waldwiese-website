"use client";

import { useActionState, useState } from "react";
import { saveAvailabilityAction, type AvailabilityState } from "@/app/actions/team";

const INITIAL: AvailabilityState = { error: "", saved: false };

/** Auswahl je Tag — dieselben Möglichkeiten wie auf dem Papier-Zettel. */
const TYPEN = [
  { value: "", label: "Keine Angabe" },
  { value: "flexibel", label: "Ganztägig flexibel" },
  { value: "nur_ab", label: "Nur ab …" },
  { value: "nur_bis", label: "Nur bis …" },
  { value: "nur_von_bis", label: "Nur von – bis" },
  { value: "nicht_moeglich", label: "Nicht möglich" },
] as const;

export type DayValue = {
  date: string;
  label: string;
  wishType: string;
  fromTime: string;
  toTime: string;
};

export function AvailabilityForm({
  weekStart,
  days,
  hours,
}: {
  weekStart: string;
  days: DayValue[];
  hours: string;
}) {
  const [state, formAction, pending] = useActionState(saveAvailabilityAction, INITIAL);
  const [typen, setTypen] = useState<Record<string, string>>(
    () => Object.fromEntries(days.map((d) => [d.date, d.wishType])),
  );

  const zeigtVon = (t: string) => t === "nur_ab" || t === "nur_von_bis";
  const zeigtBis = (t: string) => t === "nur_bis" || t === "nur_von_bis";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="weekStart" value={weekStart} />

      <ul className="space-y-3">
        {days.map((d) => {
          const typ = typen[d.date] ?? "";
          return (
            <li key={d.date} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-waldgruen">{d.label}</span>
                <select
                  name={`typ-${d.date}`}
                  value={typ}
                  onChange={(e) => setTypen((p) => ({ ...p, [d.date]: e.target.value }))}
                  className="rounded-xl border border-waldgruen/20 bg-white px-3 py-2 text-sm text-waldgruen outline-none focus:border-tonwarm"
                >
                  {TYPEN.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {(zeigtVon(typ) || zeigtBis(typ)) && (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  {zeigtVon(typ) && (
                    <label className="flex items-center gap-2 text-waldgruen/70">
                      von
                      <input
                        type="time"
                        name={`von-${d.date}`}
                        defaultValue={d.fromTime}
                        className="rounded-xl border border-waldgruen/20 bg-white px-3 py-2 text-waldgruen outline-none focus:border-tonwarm"
                      />
                    </label>
                  )}
                  {zeigtBis(typ) && (
                    <label className="flex items-center gap-2 text-waldgruen/70">
                      bis
                      <input
                        type="time"
                        name={`bis-${d.date}`}
                        defaultValue={d.toTime}
                        className="rounded-xl border border-waldgruen/20 bg-white px-3 py-2 text-waldgruen outline-none focus:border-tonwarm"
                      />
                    </label>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <label htmlFor="stunden" className="block text-sm font-medium text-waldgruen">
          Arbeitsstunden in dieser Woche
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            id="stunden"
            name="stunden"
            type="number"
            min={0}
            max={80}
            step={0.5}
            defaultValue={hours}
            className="w-28 rounded-xl border border-waldgruen/20 bg-white px-3 py-2 text-waldgruen outline-none focus:border-tonwarm"
          />
          <span className="text-sm text-waldgruen/60">Stunden</span>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-tonwarm-dark">
          {state.error}
        </p>
      )}
      {state.saved && !state.error && (
        <p className="text-sm text-waldgruen/70">Gespeichert.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-tonwarm px-6 py-3 font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-60"
      >
        {pending ? "Moment …" : "Woche speichern"}
      </button>
    </form>
  );
}
