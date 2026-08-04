"use client";

import { useActionState, useState } from "react";
import { saveShiftAction, type ShiftState } from "@/app/actions/team";

const INITIAL: ShiftState = { error: "", saved: false };

const BEREICHE = [
  { value: "service", label: "Service", mitZeit: true },
  { value: "kueche", label: "Küche", mitZeit: true },
  { value: "theke", label: "Theke", mitZeit: true },
  { value: "spuele", label: "Spüle", mitZeit: true },
  { value: "frei", label: "Frei", mitZeit: false },
  { value: "urlaub", label: "Urlaub", mitZeit: false },
  { value: "krank", label: "Krank", mitZeit: false },
];

export type PlanPerson = {
  id: string;
  name: string;
  /** Was die Person für diesen Tag angegeben hat, schon lesbar formuliert. */
  verfuegbarkeit: string;
  /** "kann nicht" faerbt die Zeile, damit man nicht dagegen plant. */
  kannNicht: boolean;
  shift: {
    id: string;
    type: string;
    label: string;
    start: string;
    end: string;
  } | null;
};

/**
 * Planung eines Tages: alle Leute untereinander, daneben was sie angegeben
 * haben. Bewusst tageweise — im Restaurant plant man den Abend, nicht eine
 * Tabelle mit 63 Feldern auf dem Handy.
 */
export function ShiftPlanner({ tag, personen }: { tag: string; personen: PlanPerson[] }) {
  const [state, formAction, pending] = useActionState(saveShiftAction, INITIAL);
  const [offen, setOffen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {state.error && (
        <p role="alert" className="rounded-xl bg-white p-4 text-sm text-tonwarm-dark shadow-sm">
          {state.error}
        </p>
      )}

      {personen.map((p) => {
        const istOffen = offen === p.id;
        return (
          <div key={p.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-waldgruen">{p.name}</p>
                <p className={`mt-0.5 text-xs ${p.kannNicht ? "text-tonwarm-dark" : "text-waldgruen/50"}`}>
                  {p.verfuegbarkeit}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {p.shift ? (
                  <span className="rounded-full bg-waldgruen px-3 py-1 text-xs text-mehlcreme">
                    {p.shift.label}
                    {p.shift.start && ` · ${p.shift.start}–${p.shift.end}`}
                  </span>
                ) : (
                  <span className="text-xs text-waldgruen/40">nicht eingeteilt</span>
                )}
                <button
                  type="button"
                  onClick={() => setOffen(istOffen ? null : p.id)}
                  className="text-xs text-waldgruen/60 underline underline-offset-2 hover:text-tonwarm"
                >
                  {istOffen ? "zu" : p.shift ? "ändern" : "eintragen"}
                </button>
              </div>
            </div>

            {istOffen && (
              <form action={formAction} className="mt-4 space-y-3 border-t border-waldgruen/10 pt-4">
                <input type="hidden" name="staffId" value={p.id} />
                <input type="hidden" name="date" value={tag} />
                <input type="hidden" name="shiftId" value={p.shift?.id ?? ""} />

                <div className="flex flex-wrap items-end gap-3">
                  <label className="text-sm text-waldgruen/70">
                    Bereich
                    <select
                      name="type"
                      defaultValue={p.shift?.type ?? "service"}
                      className="mt-1 block rounded-xl border border-waldgruen/20 bg-white px-3 py-2 text-waldgruen outline-none focus:border-tonwarm"
                    >
                      {BEREICHE.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm text-waldgruen/70">
                    von
                    <input
                      type="time"
                      name="start"
                      defaultValue={p.shift?.start ?? "17:00"}
                      className="mt-1 block rounded-xl border border-waldgruen/20 bg-white px-3 py-2 text-waldgruen outline-none focus:border-tonwarm"
                    />
                  </label>
                  <label className="text-sm text-waldgruen/70">
                    bis
                    <input
                      type="time"
                      name="end"
                      defaultValue={p.shift?.end ?? "22:00"}
                      className="mt-1 block rounded-xl border border-waldgruen/20 bg-white px-3 py-2 text-waldgruen outline-none focus:border-tonwarm"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-full bg-tonwarm px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-60"
                  >
                    {pending ? "Moment …" : "Speichern"}
                  </button>
                  {p.shift && (
                    <button
                      type="submit"
                      name="loeschen"
                      value="1"
                      disabled={pending}
                      className="rounded-full border border-waldgruen/20 px-5 py-2.5 text-sm text-waldgruen/70 transition-colors hover:border-tonwarm hover:text-tonwarm disabled:opacity-60"
                    >
                      Schicht entfernen
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}
