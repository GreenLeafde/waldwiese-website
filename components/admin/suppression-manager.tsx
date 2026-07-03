"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addSuppressionAction,
  importBouncesAction,
  removeSuppressionAction,
  type AddContactState,
  type ImportState,
} from "@/app/actions/newsletter-admin";
import type { Suppression } from "@/lib/suppressions";

const ADD_INITIAL: AddContactState = { status: "idle", message: "" };
const IMPORT_INITIAL: ImportState = { status: "idle", message: "" };

export function SuppressionManager({
  suppressions,
}: {
  suppressions: Suppression[];
}) {
  const router = useRouter();
  const [addState, addAction, adding] = useActionState(
    addSuppressionAction,
    ADD_INITIAL,
  );
  const [importState, importAction, importing] = useActionState(
    importBouncesAction,
    IMPORT_INITIAL,
  );
  const [pending, startTransition] = useTransition();

  function remove(email: string) {
    startTransition(async () => {
      await removeSuppressionAction(email);
      router.refresh();
    });
  }

  return (
    <section>
      <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        Sperrliste ({suppressions.length})
      </h2>
      <p className="mt-2 text-sm text-waldgruen/55 max-w-2xl">
        Diese Adressen werden von <strong className="text-waldgruen">jedem</strong>{" "}
        Versand ausgeschlossen — z. B. Bounces (tote Adressen) und Spam-Beschwerden.
        Das schützt deine Absender-Reputation, damit Reservierungs- und
        Kontakt-Mails zuverlässig ankommen.
      </p>

      {/* Manuell sperren */}
      <form action={addAction} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-2xl">
        <input
          type="email"
          name="email"
          required
          placeholder="adresse@beispiel.de sperren"
          className="flex-1 rounded-xl border border-waldgruen/20 bg-white px-4 py-2.5 text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
        />
        <button
          type="submit"
          disabled={adding}
          className="rounded-full bg-waldgruen hover:bg-waldgruen-dark text-mehlcreme px-6 py-2.5 font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {adding ? "…" : "Sperren"}
        </button>
      </form>
      {addState.status !== "idle" && (
        <p
          className={`mt-2 text-sm ${
            addState.status === "ok" ? "text-waldgruen/70" : "text-tonwarm-dark"
          }`}
        >
          {addState.message}
        </p>
      )}

      {/* Bounces aus CSV/Excel importieren */}
      <form
        action={importAction}
        className="mt-4 rounded-2xl border border-dashed border-waldgruen/25 bg-mehlcreme/30 px-5 py-4 max-w-2xl"
      >
        <p className="text-sm font-medium text-waldgruen">
          Bounces importieren (z. B. Resend-Export)
        </p>
        <p className="mt-1 text-xs text-waldgruen/50 leading-relaxed">
          CSV/Excel hochladen. Mit einer Status-Spalte (z. B. „last_event")
          werden nur <strong className="font-medium">Bounces &amp; Beschwerden</strong>{" "}
          gesperrt — sonst alle Adressen der Datei.
        </p>
        <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="file"
            name="file"
            required
            accept=".xlsx,.xls,.csv"
            className="flex-1 text-sm text-waldgruen file:mr-3 file:rounded-full file:border-0 file:bg-waldgruen file:px-4 file:py-2 file:text-mehlcreme file:text-sm file:font-medium hover:file:bg-waldgruen-dark file:cursor-pointer"
          />
          <button
            type="submit"
            disabled={importing}
            className="rounded-full bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-2.5 font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {importing ? "Importiere …" : "Importieren"}
          </button>
        </div>
        {importState.status !== "idle" && (
          <p
            className={`mt-2 text-sm ${
              importState.status === "ok" ? "text-waldgruen/80" : "text-tonwarm-dark"
            }`}
          >
            {importState.message}
          </p>
        )}
      </form>

      {/* Liste */}
      <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-waldgruen/10 bg-white max-w-2xl">
        {suppressions.length === 0 ? (
          <p className="px-5 py-8 text-center text-waldgruen/50 text-sm">
            Noch nichts gesperrt. Sobald der Resend-Webhook eingerichtet ist,
            landen Bounces &amp; Beschwerden hier automatisch.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-waldgruen/10 text-left text-waldgruen/45">
                <th className="px-4 py-3 font-medium">E-Mail</th>
                <th className="px-4 py-3 font-medium">Grund</th>
                <th className="px-4 py-3 font-medium text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {suppressions.map((s) => (
                <tr key={s.email} className="border-b border-waldgruen/5 last:border-0">
                  <td className="px-4 py-3 text-waldgruen break-all">{s.email}</td>
                  <td className="px-4 py-3 text-waldgruen/55">{s.reason ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => remove(s.email)}
                      className="text-xs text-waldgruen hover:text-tonwarm transition-colors disabled:opacity-50"
                    >
                      Entsperren
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
