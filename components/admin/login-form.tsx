"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/admin";

const INITIAL: LoginState = { error: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-waldgruen mb-1.5"
        >
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-3 text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-tonwarm-dark">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-60"
      >
        {pending ? "Moment …" : "Anmelden"}
      </button>
    </form>
  );
}
