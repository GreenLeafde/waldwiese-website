"use client";

import { useActionState, useId } from "react";
import Link from "next/link";
import { subscribeToLaunchList } from "@/app/actions/newsletter";
import { NEWSLETTER_INITIAL_STATE } from "@/lib/newsletter";

type Theme = "dark" | "light";

/**
 * Wiederverwendbares Newsletter-Anmeldeformular (Double-Opt-in).
 * `theme="dark"` für dunkle Flächen (z. B. Footer auf Waldgrün),
 * `theme="light"` für helle Sektionen. Honeypot + Einwilligungs-Häkchen sind
 * eingebaut; der eigentliche Versand der Bestätigungsmail läuft serverseitig.
 */
export function NewsletterSignup({
  theme = "light",
  buttonLabel = "Anmelden",
  successTitle = "Schau in dein Postfach",
}: {
  theme?: Theme;
  buttonLabel?: string;
  successTitle?: string;
}) {
  const [state, formAction, pending] = useActionState(
    subscribeToLaunchList,
    NEWSLETTER_INITIAL_STATE,
  );
  const hpId = useId();
  const dark = theme === "dark";

  const inputCls = dark
    ? "flex-1 rounded-full border border-mehlcreme/25 bg-mehlcreme/10 px-5 py-3 text-mehlcreme placeholder-mehlcreme/45 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/30"
    : "flex-1 rounded-full border border-waldgruen/20 bg-white px-5 py-3 text-waldgruen placeholder-waldgruen/35 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20";
  const btnCls = dark
    ? "inline-flex items-center justify-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
    : "inline-flex items-center justify-center gap-2 bg-waldgruen hover:bg-waldgruen-dark text-mehlcreme px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap";
  const noteCls = dark ? "text-mehlcreme/55" : "text-waldgruen/60";
  const linkCls = dark
    ? "underline decoration-mehlcreme/30 underline-offset-2 hover:text-tonwarm text-mehlcreme/80"
    : "underline decoration-waldgruen/30 underline-offset-2 hover:text-tonwarm";

  if (state.status === "success") {
    return (
      <div
        className={
          dark
            ? "rounded-2xl bg-mehlcreme/10 ring-1 ring-mehlcreme/15 px-5 py-5 text-center"
            : "rounded-2xl bg-mehlcreme/60 px-5 py-5 text-center"
        }
      >
        <p
          className={
            dark
              ? "font-display text-xl text-mehlcreme"
              : "font-display text-xl text-waldgruen"
          }
        >
          {successTitle}
        </p>
        <p
          className={`mt-2 text-sm leading-relaxed ${
            dark ? "text-mehlcreme/75" : "text-waldgruen/70"
          }`}
        >
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      {/* Honeypot — für Menschen unsichtbar, fängt Bots ab. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={hpId}>Bitte frei lassen</label>
        <input id={hpId} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="du@beispiel.de"
          aria-label="E-Mail-Adresse"
          className={inputCls}
        />
        <button type="submit" disabled={pending} className={btnCls}>
          {pending ? "Moment …" : buttonLabel}
        </button>
      </div>

      <label
        className={`mt-3 flex items-start gap-2.5 text-left text-xs leading-relaxed ${noteCls}`}
      >
        <input
          type="checkbox"
          name="consent"
          className="mt-0.5 h-4 w-4 shrink-0 accent-tonwarm"
        />
        <span>
          Ich möchte den Newsletter erhalten und stimme der{" "}
          <Link href="/datenschutz" className={linkCls}>
            Datenschutzerklärung
          </Link>{" "}
          zu. Abmeldung jederzeit möglich.
        </span>
      </label>

      {state.status === "error" && (
        <p
          role="alert"
          className={`mt-3 text-sm ${dark ? "text-tonwarm" : "text-tonwarm-dark"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
