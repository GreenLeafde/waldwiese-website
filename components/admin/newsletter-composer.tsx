"use client";

import { useActionState, useState } from "react";
import {
  sendNewsletterAction,
  type SendState,
} from "@/app/actions/newsletter-admin";

const INITIAL: SendState = { status: "idle", message: "" };

const SAMPLE = `<h1 style="font-family:Georgia,serif;color:#2e3d2c">Hallo zusammen,</h1>
<p>hier kommt eine kurze Nachricht von Wald &amp; Wiese …</p>
<p><a href="https://restaurant-waldwiese.de/reservieren" style="color:#c97c5d">Tisch reservieren →</a></p>`;

export function NewsletterComposer({ recipientCount }: { recipientCount: number }) {
  const [state, formAction, pending] = useActionState(sendNewsletterAction, INITIAL);
  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  return (
    <section>
      <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        Newsletter schreiben
      </h2>
      <p className="mt-2 text-sm text-waldgruen/55">
        Geht an <strong className="text-waldgruen">{recipientCount}</strong>{" "}
        angemeldete{recipientCount === 1 ? "n" : ""} Empfänger. Absender &amp;
        Abmeldelink werden automatisch angehängt.
      </p>

      <form action={formAction} className="mt-5 grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-waldgruen mb-1.5"
            >
              Betreff
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder="Was gibt's Neues bei Wald & Wiese?"
              className="w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-2.5 text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="html" className="text-sm font-medium text-waldgruen">
                Inhalt (HTML)
              </label>
              <button
                type="button"
                onClick={() => setHtml(SAMPLE)}
                className="text-xs text-waldgruen/50 hover:text-tonwarm transition-colors"
              >
                Beispiel einfügen
              </button>
            </div>
            <textarea
              id="html"
              name="html"
              required
              rows={14}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<h1>Überschrift</h1><p>Dein Text …</p>"
              className="w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-3 font-mono text-xs text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20 resize-y"
            />
            <p className="mt-1.5 text-xs text-waldgruen/40">
              Du kannst HTML verwenden (Überschriften, Links, Bilder per
              &lt;img src=…&gt;). Inline-Styles funktionieren am
              zuverlässigsten in E-Mail-Programmen.
            </p>
          </div>

          <label className="flex items-start gap-2.5 text-sm text-waldgruen/70">
            <input
              type="checkbox"
              name="confirm"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-tonwarm"
            />
            <span>
              Ja, diesen Newsletter an alle {recipientCount} angemeldeten
              Empfänger senden.
            </span>
          </label>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={pending || recipientCount === 0}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? "Wird gesendet …" : "Newsletter senden"}
            </button>
            {state.status !== "idle" && (
              <span
                role="alert"
                className={`text-sm ${
                  state.status === "ok" ? "text-waldgruen/70" : "text-tonwarm-dark"
                }`}
              >
                {state.message}
              </span>
            )}
          </div>
        </div>

        {/* Vorschau */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-waldgruen">Vorschau</span>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-xs text-waldgruen/50 hover:text-tonwarm transition-colors"
            >
              {showPreview ? "ausblenden" : "anzeigen"}
            </button>
          </div>
          {showPreview && (
            <div className="rounded-xl ring-1 ring-waldgruen/10 bg-white p-5 min-h-[20rem] overflow-auto">
              {html.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-sm text-waldgruen/35">
                  Hier erscheint die Live-Vorschau deines Inhalts.
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
