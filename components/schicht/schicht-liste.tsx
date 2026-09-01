"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  hakeAbAction,
  holeStandAction,
  kommentiereAction,
  type SchichtState,
} from "@/app/actions/schicht";
import type { Kommentar, Tagesaufgabe } from "@/lib/aufgaben";
import { NACHWEIS_LABEL, SCHICHT_ZEIT, type Schicht } from "@/lib/schichten";

/** Ab hier rastet die Karte ein — knapp die halbe Breite fuehlt sich richtig an. */
const SCHWELLE = 0.4;
/** So lange laesst sich ein Haken zurueckholen. */
const RUECKGAENGIG_MS = 5000;
/** Mehrere Geraete an derselben Liste — regelmaessig nachsehen. */
const ABGLEICH_MS = 8000;

type Props = {
  datum: string;
  schicht: Schicht;
  aufgaben: Tagesaufgabe[];
  kommentare: Record<string, Kommentar[]>;
  /** Wer gerade abhakt — kommt aus der Stempelung, nicht aus einem Textfeld. */
  ich: string;
};

function Haken({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 6.4 4.6 9 10 3" />
    </svg>
  );
}

export function SchichtListe({ datum, schicht, aufgaben, kommentare, ich }: Props) {
  const [stand, setStand] = useState(aufgaben);
  const [detail, setDetail] = useState<Tagesaufgabe | null>(null);
  const [rueckgaengig, setRueckgaengig] = useState<Tagesaufgabe | null>(null);
  const [, startTransition] = useTransition();
  const name = ich;

  // Frische Serverdaten uebernehmen (nach revalidate oder Schichtwechsel).
  useEffect(() => setStand(aufgaben), [aufgaben]);

  const abgleichen = useCallback(async () => {
    try {
      const frisch = await holeStandAction(datum, schicht);
      if (frisch.length > 0) setStand(frisch);
    } catch {
      /* offline — beim naechsten Mal wieder */
    }
  }, [datum, schicht]);

  useEffect(() => {
    const id = setInterval(abgleichen, ABGLEICH_MS);
    return () => clearInterval(id);
  }, [abgleichen]);

  const setzen = useCallback(
    (aufgabe: Tagesaufgabe, erledigt: boolean) => {
      // Sofort anzeigen — im Betrieb wartet niemand auf den Server.
      setStand((alt) =>
        alt.map((a) =>
          a.id === aufgabe.id
            ? {
                ...a,
                erledigt,
                erledigtVon: erledigt ? name || null : null,
                erledigtUm: erledigt
                  ? new Date().toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
              }
            : a,
        ),
      );

      const fd = new FormData();
      fd.set("aufgabeId", aufgabe.id);
      fd.set("datum", datum);
      fd.set("schicht", schicht);
      if (name) fd.set("name", name);
      if (!erledigt) fd.set("zurueck", "1");

      startTransition(async () => {
        try {
          await hakeAbAction(fd);
        } catch {
          await abgleichen(); // Server hat das letzte Wort
        }
      });
    },
    [datum, schicht, name, abgleichen],
  );

  function erledigen(aufgabe: Tagesaufgabe) {
    setzen(aufgabe, true);
    setRueckgaengig(aufgabe);
    setTimeout(
      () => setRueckgaengig((r) => (r?.id === aufgabe.id ? null : r)),
      RUECKGAENGIG_MS,
    );
  }

  const offen = stand.filter((a) => !a.erledigt).length;
  const fertig = stand.length - offen;

  return (
    <>
      {/* Fortschritt */}
      {stand.length > 0 && (
        <div className="mb-4 flex items-center gap-3 text-sm text-waldgruen/60">
          <span className="tabular-nums">
            {fertig} von {stand.length}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-waldgruen/10">
            <span
              className="block h-full rounded-full bg-waldgruen transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${stand.length ? (fertig / stand.length) * 100 : 0}%` }}
            />
          </span>
        </div>
      )}

      {stand.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-waldgruen/10">
          <p className="text-waldgruen/55">
            Für diese Schicht ist nichts hinterlegt.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {stand.map((aufgabe) => (
            <Karte
              key={aufgabe.id}
              aufgabe={aufgabe}
              anzahlKommentare={kommentare[aufgabe.id]?.length ?? 0}
              onErledigen={() => erledigen(aufgabe)}
              onZurueck={() => setzen(aufgabe, false)}
              onOeffnen={() => setDetail(aufgabe)}
            />
          ))}
        </ul>
      )}

      {/* Rueckgaengig — versehentliches Wischen passiert staendig */}
      {rueckgaengig && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(26rem,calc(100%-2rem))] items-center justify-between gap-3 rounded-full bg-waldgruen px-5 py-3 text-sm text-mehlcreme shadow-lg"
        >
          <span className="truncate">{rueckgaengig.titel} erledigt</span>
          <button
            type="button"
            onClick={() => {
              setzen(rueckgaengig, false);
              setRueckgaengig(null);
            }}
            className="shrink-0 font-medium text-tonwarm underline underline-offset-2"
          >
            Rückgängig
          </button>
        </div>
      )}

      {detail && (
        <Detail
          aufgabe={stand.find((a) => a.id === detail.id) ?? detail}
          kommentare={kommentare[detail.id] ?? []}
          name={name}
          onSchliessen={() => setDetail(null)}
          onErledigen={() => {
            const aktuell = stand.find((a) => a.id === detail.id);
            if (aktuell && !aktuell.erledigt) erledigen(aktuell);
          }}
          onZurueck={() => {
            const aktuell = stand.find((a) => a.id === detail.id);
            if (aktuell?.erledigt) setzen(aktuell, false);
          }}
        />
      )}
    </>
  );
}

// ─── Eine Aufgabe ───────────────────────────────────────────────────────────

function Karte({
  aufgabe,
  anzahlKommentare,
  onErledigen,
  onZurueck,
  onOeffnen,
}: {
  aufgabe: Tagesaufgabe;
  anzahlKommentare: number;
  onErledigen: () => void;
  onZurueck: () => void;
  onOeffnen: () => void;
}) {
  const [dx, setDx] = useState(0);
  const [zieht, setZieht] = useState(false);
  // Breite beim Anfassen merken: waehrend des Zeichnens darf die Ref nicht
  // gelesen werden, und die Karte aendert ihre Breite dabei ohnehin nicht.
  const [breite, setBreite] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const richtungKlar = useRef<"quer" | "hoch" | null>(null);
  const el = useRef<HTMLLIElement>(null);

  const erledigt = aufgabe.erledigt;

  function zeigerRunter(e: React.PointerEvent) {
    if (erledigt) return;
    start.current = { x: e.clientX, y: e.clientY };
    richtungKlar.current = null;
    setBreite(el.current?.offsetWidth ?? 0);
  }

  function zeigerBewegt(e: React.PointerEvent) {
    if (!start.current) return;
    const dxRoh = e.clientX - start.current.x;
    const dyRoh = e.clientY - start.current.y;

    // Erst entscheiden, ob gewischt oder gescrollt wird — sonst klebt die
    // Seite beim Scrollen an den Karten fest.
    //
    // Ein Wisch muss deutlich waagerecht sein (mehr als doppelt so weit quer
    // wie hoch). Mit dem Daumen scrollt man schraeg; waere schon "eher quer
    // als hoch" genug, haekelt ein Scrollversuch Aufgaben ab.
    if (!richtungKlar.current) {
      if (Math.abs(dxRoh) < 10 && Math.abs(dyRoh) < 10) return;
      richtungKlar.current =
        Math.abs(dxRoh) > Math.abs(dyRoh) * 2 ? "quer" : "hoch";
      if (richtungKlar.current === "quer") {
        setZieht(true);
        el.current?.setPointerCapture(e.pointerId);
      }
    }
    if (richtungKlar.current !== "quer") return;

    setDx(Math.min(0, dxRoh)); // nur nach links
  }

  function zeigerHoch(e: React.PointerEvent) {
    const gezogen = richtungKlar.current === "quer";
    const weit = breite > 0 && -dx > breite * SCHWELLE;

    if (gezogen) {
      try {
        el.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* war nie gefangen */
      }
      if (weit) onErledigen();
    } else if (start.current) {
      // Kaum bewegt = Antippen.
      onOeffnen();
    }

    start.current = null;
    richtungKlar.current = null;
    setZieht(false);
    setDx(0);
  }

  const anteil = breite > 0 ? Math.min(1, -dx / (breite * SCHWELLE)) : 0;

  return (
    <li
      ref={el}
      onPointerDown={zeigerRunter}
      onPointerMove={zeigerBewegt}
      onPointerUp={zeigerHoch}
      onPointerCancel={zeigerHoch}
      className={`relative overflow-hidden rounded-2xl ${
        erledigt ? "bg-waldgruen/8" : "bg-white ring-1 ring-waldgruen/10"
      }`}
      style={{ touchAction: "pan-y" }}
    >
      {/* Was hinter der Karte zum Vorschein kommt */}
      {!erledigt && dx < 0 && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 flex items-center gap-2 pr-6 text-sm font-medium"
          style={{ color: `rgba(74,107,63,${0.35 + anteil * 0.65})` }}
        >
          <Haken className="h-4 w-4" />
          Erledigt
        </span>
      )}

      <div
        className={`relative flex items-center gap-3 px-4 py-4 ${
          erledigt ? "" : "bg-white"
        } ${zieht ? "" : "transition-transform duration-200 motion-reduce:transition-none"}`}
        style={{ transform: `translateX(${dx}px)` }}
      >
        {/* Kaestchen — auch antippbar, Wischen darf nie der einzige Weg sein */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (erledigt) onZurueck();
            else onErledigen();
          }}
          aria-label={erledigt ? "Haken wegnehmen" : "Als erledigt markieren"}
          aria-pressed={erledigt}
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-colors ${
            erledigt
              ? "border-waldgruen bg-waldgruen text-mehlcreme"
              : "border-waldgruen/25 bg-white text-transparent hover:border-waldgruen/60"
          }`}
        >
          <Haken className="h-3.5 w-3.5" />
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[15px] font-medium ${
              erledigt ? "text-waldgruen/45 line-through" : "text-waldgruen"
            }`}
          >
            {aufgabe.titel}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-waldgruen/45">
            {aufgabe.erledigt && aufgabe.erledigtUm && (
              <span className="tabular-nums">
                {aufgabe.erledigtVon ? `${aufgabe.erledigtVon} · ` : ""}
                {aufgabe.erledigtUm}
              </span>
            )}
            {aufgabe.bereich && !aufgabe.erledigt && <span>{aufgabe.bereich}</span>}
            {anzahlKommentare > 0 && (
              <span>
                {anzahlKommentare} {anzahlKommentare === 1 ? "Kommentar" : "Kommentare"}
              </span>
            )}
            {aufgabe.einmalig && <span className="text-tonwarm-dark">heute einmalig</span>}
          </div>
        </div>

        {aufgabe.nachweis !== "keiner" && !erledigt && (
          <span className="shrink-0 rounded-full border border-tonwarm/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-tonwarm-dark">
            {NACHWEIS_LABEL[aufgabe.nachweis]}
          </span>
        )}
      </div>
    </li>
  );
}

// ─── Detailansicht ──────────────────────────────────────────────────────────

const KOMMENTAR_INITIAL: SchichtState = { status: "idle", message: "" };

function Detail({
  aufgabe,
  kommentare,
  name,
  onSchliessen,
  onErledigen,
  onZurueck,
}: {
  aufgabe: Tagesaufgabe;
  kommentare: Kommentar[];
  name: string;
  onSchliessen: () => void;
  onErledigen: () => void;
  onZurueck: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    kommentiereAction,
    KOMMENTAR_INITIAL,
  );

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onSchliessen();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onSchliessen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-waldgruen/40 sm:items-center"
      onClick={onSchliessen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={aufgabe.titel}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88svh] w-full overflow-y-auto rounded-t-3xl bg-stone-soft p-6 sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl leading-tight text-waldgruen">
            {aufgabe.titel}
          </h2>
          <button
            type="button"
            onClick={onSchliessen}
            aria-label="Schließen"
            className="shrink-0 text-2xl leading-none text-waldgruen/35 hover:text-waldgruen"
          >
            ×
          </button>
        </div>

        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          {aufgabe.bereich && (
            <span className="rounded-full bg-waldgruen/8 px-2.5 py-1 text-waldgruen/60">
              {aufgabe.bereich}
            </span>
          )}
          {aufgabe.nachweis !== "keiner" && (
            <span className="rounded-full border border-tonwarm/40 px-2.5 py-1 uppercase tracking-wide text-tonwarm-dark">
              {NACHWEIS_LABEL[aufgabe.nachweis]} erforderlich
            </span>
          )}
        </div>

        {aufgabe.beschreibung && (
          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-waldgruen/75">
            {aufgabe.beschreibung}
          </p>
        )}

        {aufgabe.nachweis !== "keiner" && (
          <p className="mt-4 rounded-xl bg-tonwarm/8 px-4 py-3 text-sm text-tonwarm-dark">
            {NACHWEIS_LABEL[aufgabe.nachweis]} wird noch nicht abgefragt — das kommt mit
            dem nächsten Ausbauschritt.
          </p>
        )}

        <div className="mt-5">
          {aufgabe.erledigt ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-waldgruen/60">
                Erledigt{aufgabe.erledigtVon ? ` von ${aufgabe.erledigtVon}` : ""}
                {aufgabe.erledigtUm ? `, ${aufgabe.erledigtUm} Uhr` : ""}
              </span>
              <button
                type="button"
                onClick={onZurueck}
                className="text-sm text-waldgruen/45 underline underline-offset-2 hover:text-tonwarm-dark"
              >
                Haken wegnehmen
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onErledigen();
                onSchliessen();
              }}
              className="w-full rounded-full bg-tonwarm px-6 py-3 font-medium text-white transition-colors hover:bg-tonwarm-dark"
            >
              Als erledigt markieren
            </button>
          )}
        </div>

        {/* Kommentare */}
        <h3 className="mt-7 text-xs font-medium uppercase tracking-[0.12em] text-waldgruen/45">
          Kommentare
        </h3>
        <p className="mt-1 text-xs text-waldgruen/40">
          Bleiben an der Aufgabe — ein Hinweis steht nächste Woche wieder da.
        </p>

        <ul className="mt-3 space-y-2">
          {kommentare.length === 0 ? (
            <li className="text-sm text-waldgruen/40">Noch keine.</li>
          ) : (
            kommentare.map((k) => (
              <li key={k.id} className="rounded-xl bg-white px-4 py-3 ring-1 ring-waldgruen/8">
                <p className="whitespace-pre-line text-sm text-waldgruen/80">{k.inhalt}</p>
                <p className="mt-1 text-xs text-waldgruen/40">
                  {k.autor ?? "Unbekannt"} ·{" "}
                  {new Date(k.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </p>
              </li>
            ))
          )}
        </ul>

        <form action={formAction} className="mt-3 space-y-2">
          <input type="hidden" name="aufgabeId" value={aufgabe.id} />
          <input type="hidden" name="name" value={name} />
          <textarea
            name="inhalt"
            rows={2}
            maxLength={1000}
            placeholder="Etwas anmerken …"
            className="w-full rounded-xl border border-waldgruen/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-tonwarm"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full border border-waldgruen/25 px-4 py-1.5 text-sm text-waldgruen transition-colors hover:border-waldgruen disabled:opacity-60"
            >
              {pending ? "Moment …" : "Kommentar speichern"}
            </button>
            {state.status !== "idle" && (
              <span
                role="status"
                className={`text-sm ${
                  state.status === "error" ? "text-tonwarm-dark" : "text-waldgruen/55"
                }`}
              >
                {state.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export function SchichtZeit({ schicht }: { schicht: Schicht }) {
  const z = SCHICHT_ZEIT[schicht];
  return (
    <>
      {z.label} · {z.von}–{z.bis} Uhr
    </>
  );
}
