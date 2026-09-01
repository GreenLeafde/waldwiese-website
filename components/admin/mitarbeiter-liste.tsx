"use client";

import { useActionState, useEffect, useState } from "react";
import {
  entferneMitarbeiterAction,
  speichereMitarbeiterAction,
  type StammState,
} from "@/app/actions/team-stamm";
import type { Mitarbeiter } from "@/lib/stempel";

const INITIAL: StammState = { status: "idle", message: "" };

const feld =
  "w-full rounded-xl border border-waldgruen/15 bg-white px-3.5 py-2.5 text-sm " +
  "text-waldgruen placeholder:text-waldgruen/35 outline-none focus:border-tonwarm";
const label = "block text-xs uppercase tracking-[0.12em] text-waldgruen/45 mb-1";

export function MitarbeiterListe({
  mitarbeiter,
  vorschlagNr,
  imDienst,
}: {
  mitarbeiter: Mitarbeiter[];
  vorschlagNr: number;
  imDienst: string[];
}) {
  const [bearbeite, setBearbeite] = useState<Mitarbeiter | null>(null);
  const [entfernen, setEntfernen] = useState<Mitarbeiter | null>(null);

  return (
    <div className="space-y-8">
      <section className="max-w-xl rounded-2xl bg-white p-6 ring-1 ring-waldgruen/10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-waldgruen/45">
          {bearbeite ? `${bearbeite.name} bearbeiten` : "Person hinzufügen"}
        </h2>
        <Formular
          key={bearbeite?.id ?? "neu"}
          person={bearbeite}
          vorschlagNr={vorschlagNr}
          onFertig={() => setBearbeite(null)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-waldgruen/45">
          Im Team ({mitarbeiter.length})
        </h2>

        {mitarbeiter.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-waldgruen/10">
            <p className="text-waldgruen/55">Noch niemand angelegt.</p>
          </div>
        ) : (
          <ul className="divide-y divide-waldgruen/8 overflow-hidden rounded-2xl bg-white ring-1 ring-waldgruen/10">
            {mitarbeiter.map((m) => {
              const drin = imDienst.includes(m.name);
              return (
                <li key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                    style={{ background: m.color || "#888" }}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-[9rem] flex-1">
                    <span className="block font-medium text-waldgruen">{m.name}</span>
                    <span className="block text-xs tabular-nums text-waldgruen/45">
                      Nr. {m.nr} · Lohnart {m.lohnart}
                    </span>
                  </span>

                  {drin && (
                    <span className="shrink-0 rounded-full bg-waldgruen px-2.5 py-1 text-xs text-mehlcreme">
                      im Dienst
                    </span>
                  )}

                  <span className="flex shrink-0 items-center gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setBearbeite(m);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-waldgruen/55 transition-colors hover:text-waldgruen"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntfernen(m)}
                      className="text-waldgruen/40 transition-colors hover:text-tonwarm-dark"
                    >
                      Entfernen
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <p className="max-w-xl text-xs text-waldgruen/45">
          Diese Liste ist dieselbe, die die Stempeluhr benutzt — Änderungen sind sofort auch
          dort und in der Schichtansicht zu sehen.
        </p>
      </section>

      {entfernen && (
        <EntfernenDialog person={entfernen} onSchliessen={() => setEntfernen(null)} />
      )}
    </div>
  );
}

function Formular({
  person,
  vorschlagNr,
  onFertig,
}: {
  person: Mitarbeiter | null;
  vorschlagNr: number;
  onFertig: () => void;
}) {
  const [state, formAction, pending] = useActionState(speichereMitarbeiterAction, INITIAL);

  useEffect(() => {
    if (state.status === "ok") onFertig();
  }, [state.status, onFertig]);

  return (
    <form action={formAction} className="space-y-4">
      {person && <input type="hidden" name="id" value={person.id} />}

      <div>
        <label className={label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={60}
          defaultValue={person?.name ?? ""}
          placeholder="Vor- und Nachname"
          className={feld}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="nr">
            Personalnummer
          </label>
          <input
            id="nr"
            name="nr"
            type="number"
            min={1}
            required
            defaultValue={person?.nr ?? vorschlagNr}
            className={feld}
          />
        </div>
        <div>
          <label className={label} htmlFor="lohnart">
            Lohnart
          </label>
          <input
            id="lohnart"
            name="lohnart"
            defaultValue={person?.lohnart ?? "0001"}
            className={feld}
          />
        </div>
      </div>

      <p className="text-xs text-waldgruen/45">
        Die Nummer steht so im CSV für die Lohnbuchhaltung. Vorgeschlagen ist die nächste
        freie — trag die richtige ein, falls sie abweicht.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-tonwarm px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-60"
        >
          {pending ? "Moment …" : person ? "Änderungen speichern" : "Hinzufügen"}
        </button>
        {person && (
          <button
            type="button"
            onClick={onFertig}
            className="text-sm text-waldgruen/55 hover:text-waldgruen"
          >
            Abbrechen
          </button>
        )}
        {state.status !== "idle" && (
          <span
            role="status"
            className={`text-sm ${
              state.status === "error" ? "text-tonwarm-dark" : "text-waldgruen/60"
            }`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

function EntfernenDialog({
  person,
  onSchliessen,
}: {
  person: Mitarbeiter;
  onSchliessen: () => void;
}) {
  const [state, formAction, pending] = useActionState(entferneMitarbeiterAction, INITIAL);

  useEffect(() => {
    if (state.status === "ok") onSchliessen();
  }, [state.status, onSchliessen]);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onSchliessen();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onSchliessen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-waldgruen/45 px-5"
      onClick={onSchliessen}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-stone-soft p-6"
      >
        <h2 className="font-display text-2xl leading-tight text-waldgruen">
          {person.name} entfernen?
        </h2>
        <p className="mt-3 text-sm text-waldgruen/65">
          Die Person verschwindet aus der Stempeluhr und der Schichtansicht.{" "}
          <strong className="font-medium text-waldgruen">
            Bereits erfasste Arbeitszeiten bleiben erhalten
          </strong>{" "}
          — sie gehören in die Abrechnung.
        </p>

        {state.status === "error" && (
          <p role="alert" className="mt-3 text-sm text-tonwarm-dark">
            {state.message}
          </p>
        )}

        <form action={formAction} className="mt-6 flex gap-3">
          <input type="hidden" name="id" value={person.id} />
          <button
            type="button"
            onClick={onSchliessen}
            className="flex-1 rounded-full border border-waldgruen/25 px-5 py-3 text-sm font-medium text-waldgruen/70 transition-colors hover:border-waldgruen hover:text-waldgruen"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-full bg-tonwarm-dark px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-tonwarm disabled:opacity-60"
          >
            {pending ? "Moment …" : "Entfernen"}
          </button>
        </form>
      </div>
    </div>
  );
}
