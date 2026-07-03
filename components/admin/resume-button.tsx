"use client";

import { useActionState } from "react";
import {
  resumeNewsletterAction,
  type SendState,
} from "@/app/actions/newsletter-admin";

const INITIAL: SendState = { status: "idle", message: "" };

/** „Weiter senden" — schickt die Kampagne an noch nicht erreichte Empfänger. */
export function ResumeButton({ newsletterId }: { newsletterId: string }) {
  const [state, action, pending] = useActionState(resumeNewsletterAction, INITIAL);

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={action}>
        <input type="hidden" name="newsletterId" value={newsletterId} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-tonwarm hover:bg-tonwarm-dark text-white px-5 py-2 text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {pending ? "Sende …" : "Weiter senden"}
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
