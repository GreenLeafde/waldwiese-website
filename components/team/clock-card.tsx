"use client";

import { useActionState, useEffect, useState } from "react";
import { clockAction, type ClockState } from "@/app/actions/team";

const INITIAL: ClockState = { error: "" };

function fmt(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/**
 * Stempeluhr. Laeuft eine Sitzung, zeigt sie mit, wie lange schon —
 * das ist die Frage, die im Betrieb tatsaechlich gestellt wird.
 */
export function ClockCard({
  startedAt,
  todayMs,
}: {
  /** ISO-Zeit der laufenden Sitzung, null = nicht eingestempelt. */
  startedAt: string | null;
  /** Heute bereits gearbeitete Zeit (abgeschlossene Sitzungen) in ms. */
  todayMs: number;
}) {
  const [state, formAction, pending] = useActionState(clockAction, INITIAL);
  const running = Boolean(startedAt);

  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const runningMs = startedAt ? Math.max(0, now - new Date(startedAt).getTime()) : 0;
  const startLabel = startedAt
    ? new Date(startedAt).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Berlin",
      })
    : "";

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm ${
        running ? "bg-waldgruen text-mehlcreme" : "bg-white text-waldgruen"
      }`}
    >
      {running ? (
        <>
          <p className="text-sm text-mehlcreme/60">Seit {startLabel} Uhr im Dienst</p>
          <p className="mt-1 font-display text-5xl tabular-nums">{fmt(runningMs)}</p>
        </>
      ) : (
        <>
          <p className="text-sm text-waldgruen/60">Nicht eingestempelt</p>
          <p className="mt-1 font-display text-3xl">Bereit?</p>
        </>
      )}

      <p className={`mt-3 text-sm ${running ? "text-mehlcreme/60" : "text-waldgruen/60"}`}>
        Heute bisher: {fmt(todayMs + runningMs)} h
      </p>

      <form action={formAction} className="mt-6">
        <input type="hidden" name="action" value={running ? "stop" : "start"} />
        <button
          type="submit"
          disabled={pending}
          className={`w-full rounded-full px-6 py-4 text-lg font-medium transition-colors disabled:opacity-60 ${
            running
              ? "bg-mehlcreme text-waldgruen hover:bg-white"
              : "bg-tonwarm text-white hover:bg-tonwarm-dark"
          }`}
        >
          {pending ? "Moment …" : running ? "Feierabend" : "Arbeit beginnen"}
        </button>
      </form>

      {state.error && (
        <p role="alert" className="mt-3 text-sm text-tonwarm-dark">
          {state.error}
        </p>
      )}
    </div>
  );
}
