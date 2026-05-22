"use client";

import { useState } from "react";
import { CONTACT, MAGIC_DINNER } from "@/lib/site";

type FormState = {
  name: string;
  email: string;
  phone: string;
  seats: string;
  notes: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  seats: "2",
  notes: "",
};

/**
 * Reservierungsformular für das Magic Dinner.
 *
 * Da kein Backend angeschlossen ist, baut der Submit eine fertig
 * vorausgefüllte Mail an info@restaurant-waldwiese.de zusammen und öffnet
 * den Mail-Client des Nutzers. Sobald ein Backend (z. B. Resend, eigene API)
 * oder eine Lightspeed-Integration ergänzt wird, hier den fetch-POST eintauschen.
 */
export function MagicDinnerForm() {
  const [data, setData] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = `Reservierung Magic Dinner — ${MAGIC_DINNER.dateShort}`;
    const body = [
      `Name: ${data.name}`,
      `E-Mail: ${data.email}`,
      `Telefon: ${data.phone || "—"}`,
      `Anzahl Personen: ${data.seats}`,
      "",
      "Anmerkung:",
      data.notes || "—",
      "",
      "—",
      `Reservierungsanfrage für das Magic Dinner am ${MAGIC_DINNER.dateLong}, ab ${MAGIC_DINNER.startTime}.`,
    ].join("\n");

    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border-l-2 border-tonwarm bg-stone-soft px-7 py-8">
        <p className="eyebrow no-line text-tonwarm">Anfrage übergeben</p>
        <p className="mt-4 font-display italic text-xl text-waldgruen leading-snug max-w-md">
          Dein Mail-Programm sollte sich gerade geöffnet haben — schick
          die fertige Nachricht einfach ab, wir melden uns dann bei dir.
        </p>
        <button
          type="button"
          onClick={() => {
            setData(INITIAL);
            setSubmitted(false);
          }}
          className="mt-5 inline-flex items-center gap-2 text-sm text-waldgruen border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-0.5 transition-colors"
        >
          Neue Anfrage stellen
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 sm:grid-cols-2"
      noValidate
    >
      <Field label="Name" required>
        <input
          type="text"
          required
          autoComplete="name"
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          className="input"
        />
      </Field>
      <Field label="E-Mail" required>
        <input
          type="email"
          required
          autoComplete="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          className="input"
        />
      </Field>
      <Field label="Telefon">
        <input
          type="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="input"
        />
      </Field>
      <Field label="Personen" required>
        <select
          required
          value={data.seats}
          onChange={(e) => update("seats", e.target.value)}
          className="input appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2010%206%22%20fill=%22%232E3D2C%22><path%20d=%22M0%200l5%206%205-6z%22/></svg>')] bg-[length:0.6rem] bg-[right_0.9rem_center] bg-no-repeat pr-9"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "Person" : "Personen"}
            </option>
          ))}
          <option value="9+">mehr als 8 — bitte anmerken</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Anmerkung — Allergien, Wünsche, große Gruppe?">
          <textarea
            rows={4}
            value={data.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="input resize-none"
          />
        </Field>
      </div>

      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-5 mt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-3 bg-waldgruen hover:bg-waldgruen-dark text-mehlcreme px-7 py-3.5 rounded-full font-medium text-sm transition-colors"
        >
          Anfrage senden <span aria-hidden>→</span>
        </button>
        <p className="text-xs text-stone-500 leading-relaxed">
          Du bekommst eine Bestätigung per Mail — meistens innerhalb von
          24 Stunden. Lieber telefonisch?{" "}
          <a
            href={`tel:${CONTACT.phoneRaw}`}
            className="text-waldgruen hover:text-tonwarm underline decoration-stone-300 underline-offset-2"
          >
            {CONTACT.phone}
          </a>
        </p>
      </div>

      <style jsx>{`
        .input {
          display: block;
          width: 100%;
          background: white;
          border: none;
          border-bottom: 1px solid #d6d3cb;
          padding: 0.65rem 0;
          font-size: 1rem;
          color: #2e3d2c;
          font-family: inherit;
          transition: border-color 180ms ease;
          border-radius: 0;
        }
        .input:focus {
          outline: none;
          border-bottom-color: #c97c5d;
        }
        .input::placeholder {
          color: #b3b0a7;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] tracking-[0.18em] uppercase font-medium text-stone-500 mb-1">
        {label}
        {required && <span className="text-tonwarm ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
