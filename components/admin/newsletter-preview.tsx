"use client";

import { useState } from "react";

type Props = {
  /** Gerenderte Mail (Kopfzeile + Inhalt + Footer) für die Ansicht. */
  previewHtml: string;
  /** Komplettes HTML-Dokument, so wie es verschickt wurde. */
  fullHtml: string;
  /** Nur der Inhalt aus dem Composer — passt zurück ins Editor-Feld. */
  innerHtml: string;
  /** Dunkle Vollflächen-Variante (ohne Kopfzeile/Rahmen). */
  bare: boolean;
};

type Scope = "voll" | "inhalt";

/**
 * Vorschau einer versendeten Kampagne: entweder gerendert oder als HTML-Code
 * zum Ansehen und Kopieren — einmal die ganze Mail (zum Archivieren oder in
 * einem anderen Programm weiterverwenden) und einmal nur der Inhalt (den man
 * zurück in den Composer kippen kann, um darauf aufzubauen).
 */
export function NewsletterPreview({
  previewHtml,
  fullHtml,
  innerHtml,
  bare,
}: Props) {
  const [view, setView] = useState<"ansicht" | "code">("ansicht");
  const [scope, setScope] = useState<Scope>("voll");
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fehler">("idle");

  const code = scope === "voll" ? fullHtml : innerHtml;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("ok");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("fehler");
    }
  }

  function pick(next: Scope) {
    setScope(next);
    setCopyState("idle");
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
          Vorschau
        </h2>
        <div className="inline-flex rounded-full bg-mehlcreme/40 p-1">
          {(["ansicht", "code"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                view === v
                  ? "bg-waldgruen text-mehlcreme"
                  : "text-waldgruen/70 hover:text-waldgruen"
              }`}
            >
              {v === "ansicht" ? "Ansicht" : "HTML-Code"}
            </button>
          ))}
        </div>
      </div>

      {view === "ansicht" ? (
        <div
          className={`mt-4 rounded-2xl ring-1 ring-waldgruen/10 max-h-[34rem] overflow-auto ${
            bare ? "bg-[#2e3d2c] p-0" : "bg-[#f7f6f3] p-3"
          }`}
        >
          <div
            className={bare ? "mx-auto max-w-full" : "mx-auto max-w-[600px]"}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full bg-mehlcreme/40 p-1">
              {(
                [
                  ["voll", "Ganze E-Mail"],
                  ["inhalt", "Nur Inhalt"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => pick(v)}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    scope === v
                      ? "bg-waldgruen text-mehlcreme"
                      : "text-waldgruen/70 hover:text-waldgruen"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {copyState === "ok" && (
                <span role="status" className="text-xs text-waldgruen/60">
                  Kopiert ✓
                </span>
              )}
              {copyState === "fehler" && (
                <span role="alert" className="text-xs text-tonwarm-dark">
                  Ging nicht — Text markieren und Strg + C
                </span>
              )}
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-waldgruen/30 text-waldgruen hover:border-tonwarm hover:text-tonwarm px-5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap"
              >
                Kopieren
              </button>
            </div>
          </div>

          <pre className="mt-3 rounded-2xl ring-1 ring-waldgruen/10 bg-white px-4 py-4 max-h-[34rem] overflow-auto text-xs leading-relaxed text-waldgruen/80 whitespace-pre-wrap break-words select-text">
            {code}
          </pre>

          <p className="mt-2 text-xs text-waldgruen/40 leading-relaxed">
            {scope === "voll"
              ? "Das komplette Dokument, so wie es rausgegangen ist. Platzhalter wie {{name}} stehen noch drin — die werden erst pro Empfängerin ersetzt, genau wie die Zähl-Links und der persönliche Abmeldelink."
              : "Nur der Teil, den du im Composer geschrieben hast — den kannst du dort wieder einfügen und darauf aufbauen. Kopfzeile und Footer kommen beim Senden automatisch dazu."}
          </p>
        </div>
      )}
    </section>
  );
}
