"use client";

import { useActionState } from "react";
import {
  replaceNewsletterTextAction,
  type SendState,
} from "@/app/actions/newsletter-admin";

const INITIAL: SendState = { status: "idle", message: "" };

/** „Text korrigieren" — Suchen/Ersetzen in einer geplanten oder laufenden Kampagne. */
export function ReplaceTextForm({ newsletterId }: { newsletterId: string }) {
  const [state, action, pending] = useActionState(replaceNewsletterTextAction, INITIAL);
  const field =
    "w-full rounded-xl bg-white ring-1 ring-waldgruen/15 px-3 py-2 text-sm text-waldgruen focus:outline-none focus:ring-tonwarm/50";

  return (
    <section className="mt-10">
      <h2 className="text-lg font-display text-waldgruen">Text korrigieren</h2>
      <p className="mt-1 text-sm text-waldgruen/60">
        Für alle, die den Newsletter noch nicht bekommen haben: Ersetzt den Text in Betreff und Inhalt.
        Bereits verschickte Mails bleiben, wie sie sind.
      </p>
      <form action={action} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
        <input type="hidden" name="newsletterId" value={newsletterId} />
        <label className="grid gap-1 text-xs text-waldgruen/70">
          Alter Text (exakt)
          <input name="find" className={field} required />
        </label>
        <label className="grid gap-1 text-xs text-waldgruen/70">
          Neuer Text
          <input name="replace" className={field} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-tonwarm hover:bg-tonwarm-dark text-white px-5 py-2 text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {pending ? "Ersetze …" : "Ersetzen"}
        </button>
      </form>
      {state.status !== "idle" && (
        <p
          role="alert"
          className={`mt-2 text-sm ${state.status === "ok" ? "text-waldgruen/70" : "text-tonwarm-dark"}`}
        >
          {state.message}
        </p>
      )}
    </section>
  );
}
