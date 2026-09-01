"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { hakeMitNachweisAction, type SchichtState } from "@/app/actions/schicht";
import type { Tagesaufgabe } from "@/lib/aufgaben";
import type { Schicht } from "@/lib/schichten";

const INITIAL: SchichtState = { status: "idle", message: "" };

/** Laengste Kante nach dem Verkleinern. */
const MAX_KANTE = 1600;
const QUALITAET = 0.7;

/**
 * Das Foto wird im Browser heruntergerechnet, bevor es losgeschickt wird.
 * Aus 4 MB werden rund 200 KB — das entscheidet, ob der Upload im
 * Kuechen-WLAN durchgeht oder ewig haengt.
 *
 * `imageOrientation: "from-image"` ist wichtig: Ohne das landen Handyfotos
 * gedreht auf dem Server, weil die Drehung nur im EXIF steht.
 */
async function verkleinere(datei: File): Promise<Blob> {
  const bild = await createImageBitmap(datei, { imageOrientation: "from-image" });
  const faktor = Math.min(1, MAX_KANTE / Math.max(bild.width, bild.height));
  const breite = Math.max(1, Math.round(bild.width * faktor));
  const hoehe = Math.max(1, Math.round(bild.height * faktor));

  const flaeche = document.createElement("canvas");
  flaeche.width = breite;
  flaeche.height = hoehe;
  const ctx = flaeche.getContext("2d");
  if (!ctx) throw new Error("Bild konnte nicht verarbeitet werden.");
  ctx.drawImage(bild, 0, 0, breite, hoehe);
  bild.close();

  return new Promise((fertig, fehler) =>
    flaeche.toBlob(
      (b) => (b ? fertig(b) : fehler(new Error("Bild konnte nicht erzeugt werden."))),
      "image/jpeg",
      QUALITAET,
    ),
  );
}

export function NachweisDialog({
  aufgabe,
  datum,
  schicht,
  ich,
  onSchliessen,
  onFertig,
}: {
  aufgabe: Tagesaufgabe;
  datum: string;
  schicht: Schicht;
  ich: string;
  onSchliessen: () => void;
  onFertig: () => void;
}) {
  const [state, formAction, pending] = useActionState(hakeMitNachweisAction, INITIAL);
  const [bild, setBild] = useState<Blob | null>(null);
  const [vorschau, setVorschau] = useState("");
  const [arbeitet, setArbeitet] = useState(false);
  const [fehler, setFehler] = useState("");

  // Unterschrift: ob etwas gezeichnet wurde, und wie man es abholt. Das Bild
  // wird erst beim Absenden erzeugt — sonst haengen Anzeige ("erfasst") und
  // Knopf an zwei Zustaenden, die auseinanderlaufen koennen.
  const [unterschrieben, setUnterschrieben] = useState(false);
  const holeUnterschrift = useRef<null | (() => Promise<Blob | null>)>(null);

  const istFoto = aufgabe.nachweis === "foto";
  const bereit = istFoto ? Boolean(bild) : unterschrieben;

  useEffect(() => {
    if (!bild) {
      setVorschau("");
      return;
    }
    const url = URL.createObjectURL(bild);
    setVorschau(url);
    return () => URL.revokeObjectURL(url);
  }, [bild]);

  useEffect(() => {
    if (state.status === "ok") onFertig();
  }, [state.status, onFertig]);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") onSchliessen();
    }
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onSchliessen]);

  async function fotoGewaehlt(datei: File | undefined) {
    if (!datei) return;
    setFehler("");
    setArbeitet(true);
    try {
      setBild(await verkleinere(datei));
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Das Bild ging nicht.");
    }
    setArbeitet(false);
  }

  async function absenden() {
    setFehler("");

    // Beim Foto liegt das verkleinerte Bild schon vor, die Unterschrift wird
    // jetzt erst aus dem Zeichenfeld geholt.
    const daten = istFoto ? bild : ((await holeUnterschrift.current?.()) ?? null);

    if (!daten) {
      setFehler(istFoto ? "Bitte zuerst ein Foto aufnehmen." : "Bitte zuerst unterschreiben.");
      return;
    }
    const bild2 = daten;
    const fd = new FormData();
    fd.set("aufgabeId", aufgabe.id);
    fd.set("datum", datum);
    fd.set("schicht", schicht);
    fd.set("name", ich);
    fd.set(
      "nachweis",
      new File([bild2], istFoto ? "foto.jpg" : "unterschrift.png", { type: bild2.type }),
    );
    startTransition(() => formAction(fd));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-waldgruen/45 sm:items-center"
      onClick={onSchliessen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={aufgabe.titel}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90svh] w-full overflow-y-auto rounded-t-3xl bg-stone-soft p-6 sm:max-w-md sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl leading-tight text-waldgruen">
              {aufgabe.titel}
            </h2>
            <p className="mt-0.5 text-sm font-medium uppercase tracking-wide text-tonwarm-dark">
              {istFoto ? "Foto erforderlich" : "Unterschrift erforderlich"}
            </p>
          </div>
          <button
            type="button"
            onClick={onSchliessen}
            aria-label="Schließen"
            className="shrink-0 text-2xl leading-none text-waldgruen/35 hover:text-waldgruen"
          >
            ×
          </button>
        </div>

        {aufgabe.beschreibung && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-waldgruen/70">
            {aufgabe.beschreibung}
          </p>
        )}

        <div className="mt-5">
          {istFoto ? (
            <FotoFeld
              vorschau={vorschau}
              arbeitet={arbeitet}
              onDatei={fotoGewaehlt}
              onVerwerfen={() => setBild(null)}
            />
          ) : (
            <Unterschriftsfeld
              onInhalt={setUnterschrieben}
              registriere={(fn) => {
                holeUnterschrift.current = fn;
              }}
            />
          )}
        </div>

        {(fehler || state.status === "error") && (
          <p role="alert" className="mt-3 text-sm text-tonwarm-dark">
            {fehler || state.message}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onSchliessen}
            className="flex-1 rounded-full border border-waldgruen/25 px-5 py-3 text-sm font-medium text-waldgruen/70 transition-colors hover:border-waldgruen hover:text-waldgruen"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={absenden}
            disabled={pending || arbeitet || !bereit}
            className="flex-1 rounded-full bg-tonwarm px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-tonwarm-dark disabled:opacity-50"
          >
            {pending ? "Moment …" : "Erledigt melden"}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-waldgruen/40">
          {istFoto
            ? "Bitte nur die Sache fotografieren, keine Personen."
            : "Wird mit Name und Uhrzeit festgehalten."}
        </p>
      </div>
    </div>
  );
}

// ─── Foto ───────────────────────────────────────────────────────────────────

function FotoFeld({
  vorschau,
  arbeitet,
  onDatei,
  onVerwerfen,
}: {
  vorschau: string;
  arbeitet: boolean;
  onDatei: (d: File | undefined) => void;
  onVerwerfen: () => void;
}) {
  const feld = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={feld}
        type="file"
        accept="image/*"
        // Oeffnet am Handy direkt die Kamera — keine App noetig.
        capture="environment"
        className="sr-only"
        onChange={(e) => onDatei(e.target.files?.[0])}
      />

      {vorschau ? (
        <div className="space-y-3">
          {/* Nur eine Vorschau aus dem Arbeitsspeicher — next/image bringt hier nichts. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vorschau}
            alt="Aufgenommenes Foto"
            className="max-h-64 w-full rounded-2xl object-contain"
          />
          <button
            type="button"
            onClick={() => {
              onVerwerfen();
              feld.current?.click();
            }}
            className="text-sm text-waldgruen/55 underline underline-offset-2 hover:text-waldgruen"
          >
            Neu aufnehmen
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => feld.current?.click()}
          disabled={arbeitet}
          className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-waldgruen/25 bg-white/60 px-6 py-10 text-waldgruen transition-colors hover:border-tonwarm disabled:opacity-60"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="font-medium">
            {arbeitet ? "Bild wird verarbeitet …" : "Foto aufnehmen"}
          </span>
        </button>
      )}
    </div>
  );
}

// ─── Unterschrift ───────────────────────────────────────────────────────────

function Unterschriftsfeld({
  onInhalt,
  registriere,
}: {
  /** Meldet, ob ueberhaupt etwas gezeichnet wurde. */
  onInhalt: (hat: boolean) => void;
  /** Gibt dem Dialog eine Funktion, mit der er das Bild abholen kann. */
  registriere: (hole: () => Promise<Blob | null>) => void;
}) {
  const flaeche = useRef<HTMLCanvasElement>(null);
  const zeichnet = useRef(false);
  const [leer, setLeer] = useState(true);

  // Das Bild wird erst beim Absenden aus der Zeichenflaeche geholt.
  useEffect(() => {
    registriere(
      () =>
        new Promise<Blob | null>((fertig) => {
          const c = flaeche.current;
          if (!c) return fertig(null);
          c.toBlob((b) => fertig(b), "image/png");
        }),
    );
  }, [registriere]);

  // Auf die tatsaechliche Groesse skalieren, sonst ist der Strich verpixelt.
  useEffect(() => {
    const c = flaeche.current;
    if (!c) return;
    const dichte = window.devicePixelRatio || 1;
    const breite = c.clientWidth;
    const hoehe = c.clientHeight;
    c.width = Math.round(breite * dichte);
    c.height = Math.round(hoehe * dichte);

    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dichte, dichte);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, breite, hoehe);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2e3d2c";
  }, []);

  function punkt(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = flaeche.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function runter(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = flaeche.current?.getContext("2d");
    if (!ctx) return;
    zeichnet.current = true;
    try {
      flaeche.current?.setPointerCapture(e.pointerId);
    } catch {
      // Zeiger schon weg — dann eben ohne Fang zeichnen.
    }
    const { x, y } = punkt(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function bewegt(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!zeichnet.current) return;
    const ctx = flaeche.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = punkt(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (leer) {
      setLeer(false);
      onInhalt(true);
    }
  }

  function hoch(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!zeichnet.current) return;
    zeichnet.current = false;
    try {
      flaeche.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* war nie gefangen */
    }
  }

  function leeren() {
    const c = flaeche.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
    setLeer(true);
    onInhalt(false);
  }

  return (
    <div className="space-y-2">
      <canvas
        ref={flaeche}
        onPointerDown={runter}
        onPointerMove={bewegt}
        onPointerUp={hoch}
        onPointerCancel={hoch}
        aria-label="Feld zum Unterschreiben"
        className="h-40 w-full cursor-crosshair touch-none rounded-2xl border-2 border-dashed border-waldgruen/25 bg-white"
      />
      <div className="flex items-center justify-between text-sm">
        <span className="text-waldgruen/45">
          {leer ? "Mit dem Finger unterschreiben" : "Unterschrift erfasst"}
        </span>
        <button
          type="button"
          onClick={leeren}
          className="text-waldgruen/55 underline underline-offset-2 hover:text-waldgruen"
        >
          Nochmal
        </button>
      </div>
    </div>
  );
}
