"use client";

import { useActionState } from "react";
import {
  cancelScheduledAction,
  type SendState,
} from "@/app/actions/newsletter-admin";

const INITIAL: SendState = { status: "idle", message: "" };

/** „Abbrechen" — nimmt einen geplanten Versand zurück, solange noch nichts raus ist. */
export function CancelScheduledButton({ newsletterId }: { newsletterId: string }) {
  const [state, action, pending] = useActionState(cancelScheduledAction, INITIAL);

  return (
    <div className="flex flex-col items-end gap-1">
      <form
        action={action}
        onSubmit={(e) => {
          if (!window.confirm("Geplanten Versand wirklich abbrechen? Es geht dann nichts raus.")) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="newsletterId" value={newsletterId} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-waldgruen/25 px-5 py-2 text-sm font-medium text-waldgruen/70 transition-colors hover:border-waldgruen hover:text-waldgruen disabled:opacity-60 whitespace-nowrap"
        >
          {pending ? "Moment …" : "Abbrechen"}
        </button>
      </form>
      {state.status !== "idle" && (
        <p
          role="alert"
          className={`max-w-xs text-right text-xs ${
            state.status === "ok" ? "text-waldgruen/70" : "text-tonwarm-dark"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
