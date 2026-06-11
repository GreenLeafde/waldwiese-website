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
  const [values, setValues] = useState<Record<string, string>>({
    ...NEWSLETTER_TEMPLATES[0].sample,
  });

  const template =
    NEWSLETTER_TEMPLATES.find((t) => t.id === templateId) ?? NEWSLETTER_TEMPLATES[0];
  const html = useMemo(() => renderTemplate(templateId, values), [templateId, values]);

  const set = (key: string, val: string) =>
    setValues((v) => ({ ...v, [key]: val }));

  // Vorlage wählen → mit Beispiel vorbefüllen (fertige Mail zum Anpassen).
  const choose = (id: string) => {
    const t = NEWSLETTER_TEMPLATES.find((x) => x.id === id);
    setTemplateId(id);
    if (t) setValues({ ...t.sample });
  };

  return (
    <section>
      <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        Newsletter schreiben
      </h2>
      <p className="mt-2 text-sm text-waldgruen/55">
        Geht an <strong className="text-waldgruen">{recipientCount}</strong>{" "}
        angemeldete Empfänger. Wähl eine Vorlage (kommt als fertiges Beispiel),
        pass sie an — Absender &amp; Impressum-Footer kommen automatisch dazu.
      </p>

      {/* Vorlagen-Galerie mit Vorschau pro Vorlage */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {NEWSLETTER_TEMPLATES.map((t) => {
          const active = t.id === templateId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => choose(t.id)}
              className={`text-left rounded-2xl p-2 ring-1 transition-all ${
                active
                  ? "ring-2 ring-tonwarm bg-tonwarm/5"
                  : "ring-waldgruen/15 bg-white hover:ring-tonwarm/40"
              }`}
            >
              <div className="h-[150px] overflow-hidden rounded-xl ring-1 ring-waldgruen/10 bg-white">
                <div
                  style={{
                    width: 600,
                    transform: "scale(0.46)",
                    transformOrigin: "top left",
                  }}
                >
                  <div
                    style={{ padding: 16 }}
                    dangerouslySetInnerHTML={{
                      __html: renderTemplate(t.id, t.sample),
                    }}
                  />
                </div>
              </div>
              <p className="mt-2 px-1 text-sm font-medium text-waldgruen">
                {t.name}
              </p>
              <p className="px-1 text-xs text-waldgruen/45 leading-snug">
                {t.description}
              </p>
            </button>
          );
        })}
      </div>

      <form action={formAction} className="mt-7 grid lg:grid-cols-2 gap-6">
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
                  Adresse eines Bildes einfügen. Echten Datei-Upload bauen wir
                  bei Bedarf nach.
                </p>
              )}
            </div>
          ))}

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

        {/* Live-Vorschau der gewählten Vorlage */}
        <div>
          <span className="text-sm font-medium text-waldgruen">Vorschau</span>
          <div className="mt-1.5 rounded-xl ring-1 ring-waldgruen/10 bg-[#f7f6f3] p-4 min-h-[20rem] overflow-auto">
            <div className="bg-white rounded-lg p-4">
              {html.trim() ? (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-sm text-waldgruen/35">
                  Füll links die Felder aus — hier siehst du live, wie der
                  Newsletter aussieht.
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-waldgruen/40">
            Darunter wird automatisch das grüne Impressum-Footer-Band angehängt.
          </p>
        </div>
      </form>
    </section>
  );
}
