"use client";

import { useActionState, useEffect, useState } from "react";
import {
  beendeSchichtAction,
  starteSchichtAction,
  type SchichtState,
} from "@/app/actions/schicht";
import { SCHICHT_ZEIT, datumLang, type Schicht } from "@/lib/schichten";

export type DienstPerson = { name: string; seit: string; datum: string };

const INITIAL: SchichtState = { status: "idle", message: "" };

type Props = {
  /** Alle Namen aus der Zeiterfassung — frei getippte gibt es hier nicht. */
  mitarbeiter: string[];
  imDienst: DienstPerson[];
  datum: string;
  schicht: Schicht;
  ich: string;
  onIch: (name: string) => void;
};

/** Minuten seit "HH:MM" bis jetzt, fuer die laufende Dauer im Dialog. */
function seitMinuten(seit: string): number {
  if (!/^\d{1,2}:\d{2}$/.test(seit)) return 0;
  const [h, m] = seit.split(":").map(Number);
  const jetzt = new Date();
  const min =
    jetzt.getHours() * 60 + jetzt.getMinutes() - (h * 60 + m);
  return Math.max(0, min);
}

function alsDauer(min: number): string {
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;
}

export function Dienst({
  mitarbeiter,
  imDienst,
  datum,
  schicht,
  ich,
  onIch,
}: Props) {
  // Eine gemeinsame Meldung: sonst steht nach dem Beenden noch die alte
  // "Schicht gestartet"-Zeile da.
  const [meldung, setMeldung] = useState(INITIAL);
  // null = kein Dialog offen
  const [frage, setFrage] = useState<
    { art: "start" | "ende"; name: string; seit?: string } | null
  >(null);

  const z = SCHICHT_ZEIT[schicht];
  const nichtImDienst = mitarbeiter.filter(
    (m) => !imDienst.some((d) => d.name === m),
  );

  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-waldgruen/45">
        Im Dienst
      </h2>

      {imDienst.length === 0 ? (
        <p className="mb-3 text-sm text-waldgruen/55">
          Gerade ist niemand eingestempelt.
        </p>
      ) : (
        <ul className="mb-3 space-y-2">
          {imDienst.map((p) => {
            const binIch = p.name === ich;
            return (
              <li
                key={p.name}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                  binIch
                    ? "bg-waldgruen text-mehlcreme"
                    : "bg-white ring-1 ring-waldgruen/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onIch(p.name)}
                  className="min-w-0 flex-1 text-left"
                  aria-pressed={binIch}
                >
                  <span className="block font-medium">{p.name}</span>
                  <span
                    className={`block text-xs tabular-nums ${
                      binIch ? "text-mehlcreme/60" : "text-waldgruen/45"
                    }`}
                  >
                    seit {p.seit} Uhr{binIch ? " · das bist du" : ""}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFrage({ art: "ende", name: p.name, seit: p.seit })}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    binIch
                      ? "bg-mehlcreme/15 text-mehlcreme hover:bg-mehlcreme/25"
                      : "border border-waldgruen/20 text-waldgruen/70 hover:border-waldgruen"
                  }`}
                >
                  Beenden
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Schicht starten */}
      {nichtImDienst.length > 0 && (
        <details className="group rounded-2xl bg-white ring-1 ring-waldgruen/10">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-waldgruen marker:content-none">
            Schicht starten
            <span className="float-right text-waldgruen/35 transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="flex flex-wrap gap-2 border-t border-waldgruen/8 px-4 py-3">
            {nichtImDienst.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFrage({ art: "start", name })}
                className="rounded-full border border-waldgruen/20 px-4 py-2 text-sm text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm-dark"
              >
                {name}
              </button>
            ))}
          </div>
        </details>
      )}

      {meldung.status !== "idle" && (
        <p
          role="status"
          className={`mt-2 text-sm ${
            meldung.status === "error" ? "text-tonwarm-dark" : "text-waldgruen/60"
          }`}
        >
          {meldung.message}
        </p>
      )}

      {frage && (
        <Rueckfrage
          frage={frage}
          datum={datum}
          zeitfenster={`${z.label} · ${z.von}–${z.bis} Uhr`}
          onSchliessen={() => setFrage(null)}
          onFertig={(zustand, art, name) => {
            setMeldung(zustand);
            if (zustand.status === "ok") {
              if (art === "start") onIch(name);
              else if (name === ich) onIch("");
            }
            setFrage(null);
          }}
        />
      )}
    </section>
  );
}

/**
 * Sicherheitsabfrage vor Start und Ende.
 *
 * Ein versehentlicher Tipp aufs Tablet darf keine Arbeitszeit anlegen oder
 * beenden — das landet am Monatsende in der Lohnabrechnung. Deshalb steht hier
 * ausgeschrieben, wer, welche Schicht und welche Uhrzeit gebucht wird.
 */
function Rueckfrage({
  frage,
  datum,
  zeitfenster,
  onSchliessen,
  onFertig,
}: {
  frage: { art: "start" | "ende"; name: string; seit?: string };
  datum: string;
  zeitfenster: string;
  onSchliessen: () => void;
  onFertig: (zustand: SchichtState, art: "start" | "ende", name: string) => void;
}) {
  const istStart = frage.art === "start";
  const [zustand, formAction, pending] = useActionState(
    istStart ? starteSchichtAction : beendeSchichtAction,
    INITIAL,
  );

  // Uhrzeit erst im Browser setzen, sonst zeigt der Server eine andere an.
  const [uhr, setUhr] = useState("");
  useEffect(() => {
    const tick = () =>
      setUhr(
        new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (zustand.status !== "idle") onFertig(zustand, frage.art, frage.name);
  }, [zustand, frage.art, frage.name, onFertig]);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onSchliessen();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onSchliessen]);

  const dauer = frage.seit ? alsDauer(seitMinuten(frage.seit)) : "";

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
          {istStart ? "Schicht starten?" : "Schicht beenden?"}
        </h2>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-waldgruen/50">Wer</dt>
            <dd className="font-medium text-waldgruen">{frage.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-waldgruen/50">Tag</dt>
            <dd className="text-right text-waldgruen">{datumLang(datum)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-waldgruen/50">Schicht</dt>
            <dd className="text-right text-waldgruen">{zeitfenster}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-waldgruen/50">{istStart ? "Beginn" : "Ende"}</dt>
            <dd className="font-medium tabular-nums text-waldgruen">{uhr || "…"} Uhr</dd>
          </div>
          {!istStart && frage.seit && (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-waldgruen/50">Beginn war</dt>
                <dd className="tabular-nums text-waldgruen">{frage.seit} Uhr</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-waldgruen/10 pt-2">
                <dt className="text-waldgruen/50">Wird gebucht</dt>
                <dd className="font-medium tabular-nums text-waldgruen">{dauer} Std.</dd>
              </div>
            </>
          )}
        </dl>

        <form action={formAction} className="mt-6 flex gap-3">
          <input type="hidden" name="name" value={frage.name} />
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
            className={`flex-1 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
              istStart
                ? "bg-tonwarm hover:bg-tonwarm-dark"
                : "bg-waldgruen hover:bg-waldgruen-dark"
            }`}
          >
            {pending ? "Moment …" : istStart ? "Starten" : "Beenden"}
          </button>
        </form>
      </div>
    </div>
  );
}
