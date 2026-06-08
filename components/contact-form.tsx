"use client";

import Link from "next/link";
import { useActionState } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { CONTACT_INITIAL_STATE } from "@/lib/contact";

const inputCls =
  "w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-3 text-waldgruen placeholder-waldgruen/35 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-tonwarm-dark">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    CONTACT_INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl ring-1 ring-waldgruen/10 bg-white px-6 py-10 md:px-10 md:py-14 text-center">
        <p className="font-display text-3xl text-waldgruen">Danke dir.</p>
        <p className="mt-4 text-waldgruen/70 leading-relaxed max-w-sm mx-auto">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — für Menschen unsichtbar, fängt simple Bots ab. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Bitte dieses Feld frei lassen</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-waldgruen mb-1.5"
          >
            Name <span className="text-tonwarm">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Dein Name"
            className={inputCls}
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "err-name" : undefined}
          />
          <FieldError id="err-name" message={state.errors?.name} />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-waldgruen mb-1.5"
          >
            E-Mail <span className="text-tonwarm">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="du@beispiel.de"
            className={inputCls}
            aria-invalid={!!state.errors?.email}
            aria-describedby={state.errors?.email ? "err-email" : undefined}
          />
          <FieldError id="err-email" message={state.errors?.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-waldgruen mb-1.5"
          >
            Telefon <span className="text-waldgruen/40">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Für einen Rückruf"
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-waldgruen mb-1.5"
          >
            Betreff <span className="text-waldgruen/40">(optional)</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Worum geht's?"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-waldgruen mb-1.5"
        >
          Nachricht <span className="text-tonwarm">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Schreib uns, was du auf dem Herzen hast …"
          className={`${inputCls} resize-y`}
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? "err-message" : undefined}
        />
        <FieldError id="err-message" message={state.errors?.message} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-waldgruen/70 leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 accent-tonwarm"
            aria-invalid={!!state.errors?.consent}
          />
          <span>
            Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner
            Anfrage verarbeitet werden. Details in der{" "}
            <Link
              href="/datenschutz"
              className="underline decoration-waldgruen/30 underline-offset-2 hover:text-tonwarm"
            >
              Datenschutzerklärung
            </Link>
            .
          </span>
        </label>
        <FieldError id="err-consent" message={state.errors?.consent} />
      </div>

      {state.status === "error" && !state.errors && (
        <p
          role="alert"
          className="rounded-xl bg-tonwarm/10 border border-tonwarm/30 px-4 py-3 text-sm text-tonwarm-dark"
        >
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Wird gesendet …" : "Nachricht senden"}
          {!pending && <span aria-hidden>→</span>}
        </button>
        {state.status === "error" && state.errors && (
          <span className="text-xs text-tonwarm-dark" role="alert">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
