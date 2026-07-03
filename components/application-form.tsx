"use client";

import Link from "next/link";
import { useActionState } from "react";
import { sendApplication } from "@/app/actions/karriere";
import { APPLICATION_INITIAL_STATE } from "@/lib/application";

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

type PositionOption = { value: string; label: string };

export function ApplicationForm({
  positions,
}: {
  positions: PositionOption[];
}) {
  const [state, formAction, pending] = useActionState(
    sendApplication,
    APPLICATION_INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl ring-1 ring-waldgruen/10 bg-white px-6 py-10 md:px-10 md:py-14 text-center">
        <p className="font-display text-3xl text-waldgruen">
          Danke, wir freuen uns!
        </p>
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
            htmlFor="position"
            className="block text-sm font-medium text-waldgruen mb-1.5"
          >
            Worauf bewirbst du dich? <span className="text-tonwarm">*</span>
          </label>
          <select
            id="position"
            name="position"
            required
            defaultValue={positions.length === 1 ? positions[0].value : ""}
            className={`${inputCls} appearance-none`}
            aria-invalid={!!state.errors?.position}
            aria-describedby={
              state.errors?.position ? "err-position" : undefined
            }
          >
            {positions.length !== 1 && (
              <option value="" disabled>
                Bitte auswählen …
              </option>
            )}
            {positions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <FieldError id="err-position" message={state.errors?.position} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-waldgruen mb-1.5"
          >
            Telefon <span className="text-tonwarm">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="Für einen kurzen Rückruf"
            className={inputCls}
            aria-invalid={!!state.errors?.phone}
            aria-describedby={state.errors?.phone ? "err-phone" : undefined}
          />
          <FieldError id="err-phone" message={state.errors?.phone} />
        </div>
      </div>

      <div>
        <label
          htmlFor="availability"
          className="block text-sm font-medium text-waldgruen mb-1.5"
        >
          Ab wann & wann kannst du?{" "}
          <span className="text-waldgruen/40">(optional)</span>
        </label>
        <input
          id="availability"
          name="availability"
          type="text"
          placeholder="z. B. ab sofort, am liebsten am Wochenende"
          className={inputCls}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-waldgruen mb-1.5"
        >
          Ein paar Worte über dich{" "}
          <span className="text-waldgruen/40">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Warum du zu uns passt, Erfahrung, was dich interessiert …"
          className={`${inputCls} resize-y`}
        />
      </div>

      <div>
        <label
          htmlFor="documents"
          className="block text-sm font-medium text-waldgruen mb-1.5"
        >
          Bewerbungsunterlagen{" "}
          <span className="text-waldgruen/40">(optional)</span>
        </label>
        <input
          id="documents"
          name="documents"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-3 text-sm text-waldgruen file:mr-4 file:rounded-full file:border-0 file:bg-tonwarm/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-tonwarm-dark hover:file:bg-tonwarm/20 file:cursor-pointer"
        />
        <p className="mt-1.5 text-xs text-waldgruen/45">
          Lebenslauf, Zeugnisse o. Ä. — PDF, DOC(X), JPG oder PNG. Max. 5
          Dateien, je bis 5 MB. Kein Muss.
        </p>
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
            Bewerbung verarbeitet werden. Details in der{" "}
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
          {pending ? "Wird gesendet …" : "Bewerbung absenden"}
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
