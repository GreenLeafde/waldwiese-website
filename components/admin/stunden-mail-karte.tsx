"use client";

import { useActionState, useEffect, useState } from "react";
import { sendeStundenMailAction, type ZeitState } from "@/app/actions/zeiten";

const INITIAL: ZeitState = { status: "idle", message: "" };

/**
 * Die Monatsmail an die Lohnbuchhaltung — Stand und Knopf zum Sofortversand.
 *
 * Der Knopf fragt nach: Es geht eine echte E-Mail an eine echte Adresse, und
 * das laesst sich nicht zurueckholen.
 */
export function StundenMailKarte({
  monat,
  monatName,
  empfaenger,
  schonGesendet,
  konfiguriert,
  anzahlEintraege,
  gesamt,
}: {
  monat: string;
  monatName: string;
  empfaenger: string;
  schonGesendet: boolean;
  konfiguriert: boolean;
  anzahlEintraege: number;
  gesamt: string;
}) {
  const [frage, setFrage] = useState(false);
  const [state, formAction, pending] = useActionState(sendeStundenMailAction, INITIAL);

  useEffect(() => {
    if (state.status === "ok") setFrage(false);
  }, [state.status]);

  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-waldgruen/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-medium text-waldgruen">Monatsmail an die Lohnbuchhaltung</h2>
          <p className="mt-1 max-w-lg text-sm text-waldgruen/55">
            Geht automatisch am 25. jedes Monats an{" "}
            <span className="font-medium text-waldgruen">{empfaenger}</span> — mit den
            Summen im Text und der CSV-Datei im Anhang, im gewohnten Format.
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            schonGesendet
              ? "bg-waldgruen text-mehlcreme"
              : "bg-waldgruen/8 text-waldgruen/60"
          }`}
        >
          {schonGesendet ? `${monatName} verschickt` : "diesen Monat noch nicht"}
        </span>
      </div>

      {!konfiguriert && (
        <p className="mt-4 rounded-xl bg-tonwarm/8 px-4 py-3 text-sm text-tonwarm-dark">
          Für den Versand fehlt noch <code>RESEND_API_KEY</code> in den Einstellungen
          dieses Projekts.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!konfiguriert}
          onClick={() => setFrage(true)}
          className="rounded-full border border-waldgruen/25 px-5 py-2.5 text-sm font-medium text-waldgruen transition-colors hover:border-waldgruen disabled:opacity-50"
        >
          Jetzt verschicken
        </button>
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

      {frage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-waldgruen/45 px-5"
          onClick={() => setFrage(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-stone-soft p-6"
          >
            <h3 className="font-display text-2xl leading-tight text-waldgruen">
              E-Mail jetzt verschicken?
            </h3>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-waldgruen/50">An</dt>
                <dd className="break-all text-right font-medium text-waldgruen">
                  {empfaenger}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-waldgruen/50">Zeitraum</dt>
                <dd className="text-waldgruen">{monatName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-waldgruen/50">Enthält</dt>
                <dd className="tabular-nums text-waldgruen">
                  {anzahlEintraege} {anzahlEintraege === 1 ? "Buchung" : "Buchungen"} ·{" "}
                  {gesamt} h
                </dd>
              </div>
            </dl>

            {schonGesendet && (
              <p className="mt-4 rounded-xl bg-tonwarm/8 px-4 py-3 text-sm text-tonwarm-dark">
                Für {monatName} ging bereits eine Mail raus. Diese hier käme zusätzlich.
              </p>
            )}

            {state.status === "error" && (
              <p role="alert" className="mt-3 text-sm text-tonwarm-dark">
                {state.message}
              </p>
            )}

            <form action={formAction} className="mt-6 flex gap-3">
              <input type="hidden" name="monat" value={monat} />
              <button
                type="button"
                onClick={() => setFrage(false)}
                className="flex-1 rounded-full border border-waldgruen/25 px-5 py-3 text-sm font-medium text-waldgruen/70 transition-colors hover:border-waldgruen hover:text-waldgruen"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex-1 rounded-full bg-tonwarm px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-60"
              >
                {pending ? "Wird gesendet …" : "Verschicken"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
