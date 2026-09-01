"use client";

import { useActionState, useState } from "react";
import { speichereAufgabeAction, type AufgabeState } from "@/app/actions/aufgaben";
import {
  BEREICHE,
  SCHICHTEN,
  SCHICHT_KURZ,
  WOCHENTAGE,
  slotKey,
  wochentagVonDatum,
  type Nachweis,
  type Rhythmus,
  type Schicht,
  type SchichtSlot,
} from "@/lib/schichten";

const INITIAL: AufgabeState = { status: "idle", message: "" };

export type AufgabeFormWerte = {
  id: string;
  titel: string;
  beschreibung: string | null;
  bereich: string | null;
  nachweis: Nachweis;
  rhythmus: Rhythmus;
  datum: string | null;
  schichten: SchichtSlot[];
};

const feldClass =
  "w-full rounded-xl border border-waldgruen/15 bg-white px-3.5 py-2.5 text-sm " +
  "text-waldgruen placeholder:text-waldgruen/35 outline-none " +
  "focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20";

const labelClass = "text-xs uppercase tracking-[0.12em] text-waldgruen/45 font-medium";

/** Auswahl-Pille. Sieht in beiden Zustaenden anklickbar aus. */
function Pille({
  children,
  aktiv,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { aktiv: boolean }) {
  return (
    <label
      className={`cursor-pointer select-none rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        aktiv
          ? "border-waldgruen bg-waldgruen text-mehlcreme"
          : "border-waldgruen/20 bg-white text-waldgruen/70 hover:border-waldgruen/45"
      }`}
    >
      <input {...props} className="sr-only" />
      {children}
    </label>
  );
}

export function AufgabeForm({ werte }: { werte?: AufgabeFormWerte }) {
  const [state, formAction, pending] = useActionState(speichereAufgabeAction, INITIAL);
  const bearbeitet = Boolean(werte);

  const [rhythmus, setRhythmus] = useState<Rhythmus>(werte?.rhythmus ?? "woechentlich");
  const [nachweis, setNachweis] = useState<Nachweis>(werte?.nachweis ?? "keiner");
  const [bereich, setBereich] = useState<string>(werte?.bereich ?? "");
  const [datum, setDatum] = useState<string>(werte?.datum ?? "");
  const [schichtEinmalig, setSchichtEinmalig] = useState<Schicht>(
    werte?.schichten[0]?.schicht ?? "frueh",
  );
  const [gewaehlt, setGewaehlt] = useState<Set<string>>(
    () => new Set((werte?.schichten ?? []).map(slotKey)),
  );

  function toggleSlot(key: string) {
    setGewaehlt((alt) => {
      const neu = new Set(alt);
      if (neu.has(key)) neu.delete(key);
      else neu.add(key);
      return neu;
    });
  }

  /** Ganze Zeile auf einmal — sonst tippt man zehnmal einzeln. */
  function alleDerSchicht(schicht: Schicht) {
    const keys = SCHICHTEN.filter((s) => s.schicht === schicht).map(slotKey);
    setGewaehlt((alt) => {
      const neu = new Set(alt);
      const allesDrin = keys.every((k) => neu.has(k));
      keys.forEach((k) => (allesDrin ? neu.delete(k) : neu.add(k)));
      return neu;
    });
  }

  // Bei einmaligen Aufgaben ergibt sich der Wochentag aus dem Datum. Ist es
  // ein Mo–Do, gibt es dort keine Spaetschicht — dann gar nicht erst anbieten.
  const tagDesDatums = datum ? wochentagVonDatum(datum) : null;
  const spaetMoeglich = tagDesDatums === null || tagDesDatums >= 5;
  const tagName = tagDesDatums
    ? WOCHENTAGE.find((w) => w.wert === tagDesDatums)?.lang
    : null;

  return (
    <form action={formAction} className="space-y-5">
      {werte && <input type="hidden" name="id" value={werte.id} />}

      <div className="space-y-1.5">
        <label htmlFor="titel" className={labelClass}>
          Titel
        </label>
        <input
          id="titel"
          name="titel"
          required
          maxLength={120}
          defaultValue={werte?.titel ?? ""}
          placeholder="z. B. Kühlhaus-Temperatur"
          className={feldClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="beschreibung" className={labelClass}>
          Beschreibung <span className="normal-case tracking-normal">(erscheint beim Antippen)</span>
        </label>
        <textarea
          id="beschreibung"
          name="beschreibung"
          rows={3}
          defaultValue={werte?.beschreibung ?? ""}
          placeholder="Was genau ist zu tun? Woran erkennt man, dass es erledigt ist?"
          className={feldClass}
        />
      </div>

      {/* Rhythmus */}
      <div className="space-y-2">
        <span className={labelClass}>Rhythmus</span>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["woechentlich", "Jede Woche"],
              ["einmalig", "Einmalig an einem Datum"],
            ] as const
          ).map(([wert, label]) => (
            <Pille
              key={wert}
              type="radio"
              name="rhythmus"
              value={wert}
              checked={rhythmus === wert}
              onChange={() => setRhythmus(wert)}
              aktiv={rhythmus === wert}
            >
              {label}
            </Pille>
          ))}
        </div>
      </div>

      {/* Schichten — je nach Rhythmus zwei ganz verschiedene Fragen */}
      {rhythmus === "woechentlich" ? (
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className={labelClass}>Gilt für diese Schichten</span>
            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => alleDerSchicht("frueh")}
                className="text-tonwarm-dark hover:underline"
              >
                alle Frühschichten
              </button>
              <button
                type="button"
                onClick={() => alleDerSchicht("spaet")}
                className="text-tonwarm-dark hover:underline"
              >
                alle Spätschichten
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SCHICHTEN.map((slot) => {
              const key = slotKey(slot);
              const aktiv = gewaehlt.has(key);
              const tag = WOCHENTAGE.find((w) => w.wert === slot.wochentag)?.kurz;
              return (
                <Pille
                  key={key}
                  type="checkbox"
                  name="slot"
                  value={key}
                  checked={aktiv}
                  onChange={() => toggleSlot(key)}
                  aktiv={aktiv}
                >
                  {tag} {SCHICHT_KURZ[slot.schicht]}
                </Pille>
              );
            })}
          </div>
          <p className="text-xs text-waldgruen/45">
            Mo–Do gibt es nur die Frühschicht. Eine Aufgabe kann auf beliebig vielen
            Schichten liegen.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="datum" className={labelClass}>
              Datum
            </label>
            <input
              id="datum"
              name="datum"
              type="date"
              required
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className={feldClass}
            />
            {tagName && <p className="text-xs text-waldgruen/45">Das ist ein {tagName}.</p>}
          </div>
          <div className="space-y-2">
            <span className={labelClass}>Schicht</span>
            <div className="flex flex-wrap gap-2">
              {(["frueh", "spaet"] as const).map((s) => {
                const gesperrt = s === "spaet" && !spaetMoeglich;
                return (
                  <Pille
                    key={s}
                    type="radio"
                    name="schichtEinmalig"
                    value={s}
                    checked={schichtEinmalig === s && !gesperrt}
                    disabled={gesperrt}
                    onChange={() => setSchichtEinmalig(s)}
                    aktiv={schichtEinmalig === s && !gesperrt}
                  >
                    <span className={gesperrt ? "opacity-40" : undefined}>
                      {s === "frueh" ? "Früh" : "Spät"}
                    </span>
                  </Pille>
                );
              })}
            </div>
            {!spaetMoeglich && (
              <p className="text-xs text-waldgruen/45">
                {tagName}s gibt es keine Spätschicht.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Nachweis */}
      <div className="space-y-2">
        <span className={labelClass}>Nachweis</span>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["keiner", "Keiner"],
              ["foto", "Foto"],
              ["unterschrift", "Unterschrift"],
            ] as const
          ).map(([wert, label]) => (
            <Pille
              key={wert}
              type="radio"
              name="nachweis"
              value={wert}
              checked={nachweis === wert}
              onChange={() => setNachweis(wert)}
              aktiv={nachweis === wert}
            >
              {label}
            </Pille>
          ))}
        </div>
        {nachweis !== "keiner" && (
          <p className="text-xs text-waldgruen/45">
            {nachweis === "foto"
              ? "Beim Abhaken öffnet sich die Kamera. Ohne Foto lässt sich die Aufgabe nicht erledigen — auch nicht durch Wischen."
              : "Beim Abhaken erscheint ein Feld zum Unterschreiben. Ohne Unterschrift lässt sich die Aufgabe nicht erledigen — auch nicht durch Wischen."}
          </p>
        )}
      </div>

      {/* Bereich */}
      <div className="space-y-2">
        <span className={labelClass}>
          Bereich <span className="normal-case tracking-normal">(optional)</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <Pille
            type="radio"
            name="bereich"
            value=""
            checked={bereich === ""}
            onChange={() => setBereich("")}
            aktiv={bereich === ""}
          >
            Alle
          </Pille>
          {BEREICHE.map((b) => (
            <Pille
              key={b}
              type="radio"
              name="bereich"
              value={b}
              checked={bereich === b}
              onChange={() => setBereich(b)}
              aktiv={bereich === b}
            >
              {b}
            </Pille>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-tonwarm px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-60"
        >
          {pending ? "Moment …" : bearbeitet ? "Änderungen speichern" : "Aufgabe anlegen"}
        </button>

        {bearbeitet && (
          <a href="/admin/aufgaben" className="text-sm text-waldgruen/55 hover:text-waldgruen">
            Abbrechen
          </a>
        )}

        {state.status !== "idle" && (
          <p
            role="status"
            className={`text-sm ${
              state.status === "error" ? "text-tonwarm-dark" : "text-waldgruen/70"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
