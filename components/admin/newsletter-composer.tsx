"use client";

import { useActionState, useMemo, useState } from "react";
import {
  sendNewsletterAction,
  type SendState,
} from "@/app/actions/newsletter-admin";
import {
  NEWSLETTER_TEMPLATES,
  renderTemplate,
} from "@/lib/newsletter-templates";

const INITIAL: SendState = { status: "idle", message: "" };

const inputCls =
  "w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-2.5 text-waldgruen placeholder-waldgruen/35 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20";

export function NewsletterComposer({ recipientCount }: { recipientCount: number }) {
  const [state, formAction, pending] = useActionState(sendNewsletterAction, INITIAL);
  const [templateId, setTemplateId] = useState(NEWSLETTER_TEMPLATES[0].id);
  const [values, setValues] = useState<Record<string, string>>({});

  const template =
    NEWSLETTER_TEMPLATES.find((t) => t.id === templateId) ?? NEWSLETTER_TEMPLATES[0];
  const html = useMemo(() => renderTemplate(templateId, values), [templateId, values]);

  const set = (key: string, val: string) =>
    setValues((v) => ({ ...v, [key]: val }));

  return (
    <section>
      <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        Newsletter schreiben
      </h2>
      <p className="mt-2 text-sm text-waldgruen/55">
        Geht an <strong className="text-waldgruen">{recipientCount}</strong>{" "}
        angemeldete Empfänger. Wähl eine Vorlage und füll sie aus — Absender &amp;
        Impressum-Footer kommen automatisch dazu.
      </p>

      {/* Vorlagen-Auswahl */}
      <div className="mt-5 flex flex-wrap gap-2">
        {NEWSLETTER_TEMPLATES.map((t) => {
          const active = t.id === templateId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-waldgruen text-mehlcreme"
                  : "bg-white text-waldgruen/70 ring-1 ring-waldgruen/15 hover:text-tonwarm"
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-waldgruen/45">{template.description}</p>

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
              className={inputCls}
            />
          </div>

          {/* Vorlagen-Felder */}
          {template.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-waldgruen mb-1.5">
                {f.label}
              </label>
              {f.type === "textarea" || f.type === "html" ? (
                <textarea
                  rows={f.type === "html" ? 12 : 6}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`${inputCls} resize-y ${
                    f.type === "html" ? "font-mono text-xs" : ""
                  }`}
                />
              ) : (
                <input
                  type="text"
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
              {f.type === "image" && (
                <p className="mt-1 text-xs text-waldgruen/40">
                  Bild-Adresse einfügen (z. B. von eurer Website oder Instagram).
                  Echte Datei-Uploads bauen wir bei Bedarf nach.
                </p>
              )}
            </div>
          ))}

          {/* Zusammengebautes HTML für den Versand */}
          <input type="hidden" name="html" value={html} />

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
          <span className="text-sm font-medium text-waldgruen">Vorschau</span>
          <div className="mt-1.5 rounded-xl ring-1 ring-waldgruen/10 bg-white p-5 min-h-[20rem] overflow-auto">
            {html.trim() ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-sm text-waldgruen/35">
                Füll links die Felder aus — hier siehst du live, wie der
                Newsletter aussieht.
              </p>
            )}
          </div>
          <p className="mt-2 text-xs text-waldgruen/40">
            Darunter wird automatisch das grüne Impressum-Footer-Band angehängt.
          </p>
        </div>
      </form>
    </section>
  );
}
