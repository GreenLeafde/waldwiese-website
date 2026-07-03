"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addContactAction,
  deleteContactAction,
  importContactsAction,
  renameContactAction,
  setContactStatusAction,
  type AddContactState,
  type ImportState,
} from "@/app/actions/newsletter-admin";
import type { Contact, ContactStatus } from "@/lib/contacts";

const ADD_INITIAL: AddContactState = { status: "idle", message: "" };
const IMPORT_INITIAL: ImportState = { status: "idle", message: "" };

const STATUS_LABEL: Record<ContactStatus, string> = {
  subscribed: "Angemeldet",
  pending: "Ausstehend",
  unsubscribed: "Abgemeldet",
};
const STATUS_CLS: Record<ContactStatus, string> = {
  subscribed: "bg-waldgruen/10 text-waldgruen",
  pending: "bg-tonwarm/10 text-tonwarm-dark",
  unsubscribed: "bg-stone-200 text-stone-600",
};

export function ContactsManager({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [addState, addAction, adding] = useActionState(addContactAction, ADD_INITIAL);
  const [importState, importAction, importing] = useActionState(
    importContactsAction,
    IMPORT_INITIAL,
  );
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContactStatus>("all");

  const CAP = 300;
  const counts = useMemo(() => {
    const c = { subscribed: 0, unsubscribed: 0, pending: 0 };
    for (const ct of contacts) c[ct.status]++;
    return c;
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (
        q &&
        !c.email.toLowerCase().includes(q) &&
        !(c.name ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [contacts, query, statusFilter]);
  const shown = filtered.slice(0, CAP);

  const FILTERS: { key: "all" | ContactStatus; label: string; count: number }[] = [
    { key: "all", label: "Alle", count: contacts.length },
    { key: "subscribed", label: "Angemeldet", count: counts.subscribed },
    { key: "unsubscribed", label: "Abgemeldet", count: counts.unsubscribed },
    { key: "pending", label: "Ausstehend", count: counts.pending },
  ];

  function act(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <section>
      <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        Kontakte ({contacts.length})
      </h2>

      {/* Hinzufügen */}
      <form
        action={addAction}
        className="mt-4 flex flex-col sm:flex-row gap-3 max-w-2xl"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="email@beispiel.de"
          className="flex-1 rounded-xl border border-waldgruen/20 bg-white px-4 py-2.5 text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
        />
        <input
          type="text"
          name="name"
          placeholder="Name (optional)"
          className="flex-1 rounded-xl border border-waldgruen/20 bg-white px-4 py-2.5 text-waldgruen outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
        />
        <button
          type="submit"
          disabled={adding}
          className="rounded-full bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-2.5 font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {adding ? "…" : "Hinzufügen"}
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

      {/* Massen-Import per Excel/CSV */}
      <form
        action={importAction}
        className="mt-4 rounded-2xl border border-dashed border-waldgruen/25 bg-mehlcreme/30 px-5 py-4 max-w-2xl"
      >
        <p className="text-sm font-medium text-waldgruen">
          Mehrere auf einmal: Excel oder CSV hochladen
        </p>
        <p className="mt-1 text-xs text-waldgruen/50 leading-relaxed">
          Eine Spalte mit E-Mail-Adressen genügt (Name optional). Hat die Datei
          eine „Newsletter"-Spalte (Ja/Nein), kommen alle rein — „Ja" als{" "}
          <strong className="font-medium">angemeldet</strong>, „Nein" als{" "}
          <strong className="font-medium">abgemeldet</strong>. Newsletter gehen
          nur an Angemeldete (DSGVO/§ 7 UWG).
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
              importState.status === "ok"
                ? "text-waldgruen/80"
                : "text-tonwarm-dark"
            }`}
          >
            {importState.message}
          </p>
        )}
      </form>

      {/* Suche + Status-Filter */}
      {contacts.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-waldgruen text-mehlcreme"
                      : "bg-white text-waldgruen/70 ring-1 ring-waldgruen/15 hover:text-tonwarm"
                  }`}
                >
                  {f.label}{" "}
                  <span className={active ? "text-mehlcreme/70" : "text-waldgruen/40"}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suchen — E-Mail oder Name …"
                className="w-full rounded-full border border-waldgruen/20 bg-white px-5 py-2.5 text-sm text-waldgruen placeholder-waldgruen/35 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
              />
            </div>
            <span className="text-xs text-waldgruen/45 whitespace-nowrap">
              {filtered.length} von {contacts.length}
            </span>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-waldgruen/10 bg-white">
        {contacts.length === 0 ? (
          <p className="px-5 py-8 text-center text-waldgruen/50 text-sm">
            Noch keine Kontakte. Füge oben welche hinzu — oder sie kommen über
            die Newsletter-Anmeldung im Frühstücks-Sommelier rein.
          </p>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-waldgruen/50 text-sm">
            {query.trim()
              ? `Keine Treffer für „${query.trim()}".`
              : "Keine Kontakte mit diesem Status."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-waldgruen/10 text-left text-waldgruen/45">
                <th className="px-4 py-3 font-medium">E-Mail</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <ContactRow
                  key={c.id}
                  contact={c}
                  busy={pending}
                  onStatus={(status) =>
                    act(() => setContactStatusAction(c.id, status))
                  }
                  onRename={(name) => act(() => renameContactAction(c.id, name))}
                  onDelete={() => act(() => deleteContactAction(c.id))}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      {filtered.length > CAP && (
        <p className="mt-2 text-xs text-waldgruen/45">
          Zeige die ersten {CAP} von {filtered.length} — verfeinere die Suche, um
          mehr einzugrenzen.
        </p>
      )}
    </section>
  );
}

function ContactRow({
  contact,
  busy,
  onStatus,
  onRename,
  onDelete,
}: {
  contact: Contact;
  busy: boolean;
  onStatus: (status: ContactStatus) => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(contact.name ?? "");

  return (
    <tr className="border-b border-waldgruen/5 last:border-0">
      <td className="px-4 py-3 text-waldgruen break-all">{contact.email}</td>
      <td className="px-4 py-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (name !== (contact.name ?? "")) onRename(name);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          placeholder="—"
          className="w-full max-w-[12rem] rounded-md border border-transparent hover:border-waldgruen/15 focus:border-tonwarm bg-transparent px-2 py-1 text-waldgruen outline-none"
        />
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLS[contact.status]}`}
        >
          {STATUS_LABEL[contact.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-3 text-xs">
          {contact.status === "unsubscribed" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onStatus("subscribed")}
              className="text-waldgruen hover:text-tonwarm transition-colors disabled:opacity-50"
            >
              Anmelden
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => onStatus("unsubscribed")}
              className="text-stone-600 hover:text-tonwarm transition-colors disabled:opacity-50"
            >
              Abmelden
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (confirm(`${contact.email} wirklich löschen?`)) onDelete();
            }}
            className="text-tonwarm-dark hover:underline disabled:opacity-50"
          >
            Löschen
          </button>
        </div>
      </td>
    </tr>
  );
}
