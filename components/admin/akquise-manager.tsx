"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  anrufAction,
  entwuerfeFuerNeueAction,
  importiereAction,
  loescheLeadAction,
  nachfassSendenAction,
  notizAction,
  sendeAction,
  speichereLeadAction,
  stapelAction,
  statusAction,
  verlaufAction,
  type Ergebnis,
} from "@/app/actions/akquise";
import type { LeadEingabe } from "@/lib/akquise";
import {
  ERLEDIGT,
  NACHFASS_TAGE,
  STAPEL_MAX,
  STATUS,
  STATUS_TEXT,
  TYPEN,
  TYP_TEXT,
  entwurfFuer,
  nachfassEntwurf,
  vorschauHtml,
  type Faellig,
  type Lead,
  type LeadEvent,
  type Status,
  type Typ,
} from "@/lib/akquise-texte";
import { SITE } from "@/lib/site";

/**
 * Akquise-Oberflaeche: oben was heute ansteht, links die Liste, rechts der
 * Kontakt mit Mail-Entwurf und Verlauf. Daten und Versand liegen in
 * lib/akquise.ts. Tageslimit und Abmeldeweg sitzen dort, nicht hier.
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE.url).replace(/\/+$/, "");

/** Eingabefeld ohne Breite. `IN` fuellt die Zeile, in Leisten bestimmt der Inhalt. */
const FELD =
  "rounded-xl border border-waldgruen/20 bg-white px-3.5 py-2 text-sm text-waldgruen placeholder-waldgruen/35 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20";
const IN = `${FELD} w-full`;
const BTN =
  "rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap";
const BTN_PRIM = `${BTN} bg-tonwarm hover:bg-tonwarm-dark text-white`;
const BTN_SEK = `${BTN} bg-white text-waldgruen ring-1 ring-waldgruen/20 hover:text-tonwarm hover:ring-tonwarm/50`;
const BTN_FRAGE = `${BTN} bg-[#8a2f2f] text-white`;
const LABEL =
  "block text-[0.68rem] tracking-[0.12em] uppercase font-medium text-waldgruen/50 mb-1";

const PILLE: Record<Status, string> = {
  neu: "bg-waldgruen/10 text-waldgruen",
  entwurf: "bg-stone-200 text-stone-600",
  angeschrieben: "bg-tonwarm/15 text-tonwarm-dark",
  nachgefasst: "bg-tonwarm/15 text-tonwarm-dark",
  anrufen: "bg-tonwarm/25 text-tonwarm-dark",
  antwort: "bg-waldgruen/15 text-waldgruen",
  infos: "bg-waldgruen/15 text-waldgruen",
  termin: "bg-waldgruen/15 text-waldgruen",
  kunde: "bg-waldgruen text-mehlcreme",
  abgesagt: "bg-[#f3e6e2] text-[#7a2323]",
};

function datum(ms: number | null): string {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Europe/Berlin",
  });
}
const tag = (iso: string | null) =>
  iso ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(2, 4)}` : "";

/**
 * Knopf, der beim ersten Klick fragt und beim zweiten handelt. Statt eines
 * Dialogs, der jedes Mal aufploppt. Ohne zweiten Klick springt er nach sechs
 * Sekunden zurueck.
 */
function ZweiKlick({
  label,
  frage,
  onConfirm,
  disabled,
  className = BTN_PRIM,
}: {
  label: string;
  frage: string;
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const [fragt, setFragt] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  return (
    <button
      type="button"
      disabled={disabled}
      className={fragt ? BTN_FRAGE : className}
      onClick={() => {
        if (!fragt) {
          setFragt(true);
          timer.current = setTimeout(() => setFragt(false), 6000);
          return;
        }
        if (timer.current) clearTimeout(timer.current);
        setFragt(false);
        onConfirm();
      }}
    >
      {fragt ? frage : label}
    </button>
  );
}

/** Anruf festhalten: was besprochen wurde und wie es weitergeht. */
function AnrufFormular({
  onSave,
  onCancel,
  busy,
}: {
  onSave: (ergebnis: string, status: string, tage: number) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const [ergebnis, setErgebnis] = useState("");
  const [status, setStatus] = useState<Status>("antwort");
  const [tage, setTage] = useState(7);
  return (
    <div className="mt-3 grid gap-2 rounded-xl bg-mehlcreme/40 p-3">
      <textarea
        className={IN}
        rows={2}
        autoFocus
        value={ergebnis}
        onChange={(e) => setErgebnis(e.target.value)}
        placeholder="Was wurde besprochen? Wer ist zuständig? Was ist verabredet?"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={FELD}
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          aria-label="Stand nach dem Anruf"
        >
          {(["antwort", "infos", "termin", "anrufen", "kunde", "abgesagt"] as Status[]).map(
            (s) => (
              <option key={s} value={s}>
                {STATUS_TEXT[s]}
              </option>
            ),
          )}
        </select>
        <label className="flex items-center gap-2 text-xs text-waldgruen/60">
          wieder vorlegen in
          <input
            type="number"
            min={0}
            max={120}
            value={tage}
            onChange={(e) => setTage(Number(e.target.value) || 0)}
            className={`${FELD} w-20 text-center`}
          />
          Tagen
        </label>
        <button
          type="button"
          className={BTN_PRIM}
          disabled={busy || !ergebnis.trim()}
          onClick={() => onSave(ergebnis, status, tage)}
        >
          Speichern
        </button>
        <button type="button" className={BTN_SEK} onClick={onCancel}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}

export function AkquiseManager({
  leads,
  faellig,
  heute,
  limit,
  versandBereit,
  anhang,
}: {
  leads: Lead[];
  faellig: Faellig[];
  heute: number;
  limit: number;
  versandBereit: boolean;
  anhang: { datei: string; pfad: string };
}) {
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [meldung, setMeldung] = useState<Ergebnis | null>(null);
  const [query, setQuery] = useState("");
  const [typFilter, setTypFilter] = useState<Typ | "">("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [aktivId, setAktivId] = useState<string | null>(null);
  const [offen, setOffen] = useState<"" | "neu" | "import">("");
  const [stapel, setStapel] = useState(20);
  const [anrufFuer, setAnrufFuer] = useState<string | null>(null);
  const [vorschau, setVorschau] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [alleLaeuft, setAlleLaeuft] = useState(false);
  const anhalten = useRef(false);

  /**
   * "Alle senden" wie im Natuerlich: arbeitet sich in Bloecken durch, bis
   * nichts mehr offen ist. In Bloecken, weil eine einzige Anfrage ueber
   * Minuten in den Vercel-Timeout liefe. Der Browser muss dafuer offen
   * bleiben. Zwischen den Bloecken zwei Sekunden Pause.
   */
  async function alleSenden() {
    anhalten.current = false;
    setAlleLaeuft(true);
    let summe = 0;
    let probleme: { firma: string; grund: string }[] = [];
    const nicht = () =>
      probleme.length
        ? ` ${probleme.length} nicht: ${probleme
            .slice(0, 5)
            .map((f) => `${f.firma} (${f.grund})`)
            .join("; ")}${probleme.length > 5 ? " …" : ""}`
        : "";
    for (;;) {
      if (anhalten.current) {
        setMeldung({ ok: true, message: `${summe} gesendet, angehalten.${nicht()}` });
        break;
      }
      setMeldung({ ok: true, message: `Sendet … ${summe} raus.` });
      const r = await stapelAction(20, typFilter);
      summe += r.gesendet;
      probleme = probleme.concat(r.fehler);
      router.refresh();
      if (!r.ok && r.gesendet === 0 && r.fehler.length === 0) {
        setMeldung({ ok: false, message: `Abgebrochen nach ${summe}: ${r.message}` });
        break;
      }
      if (r.limitErreicht) {
        setMeldung({ ok: false, message: `${summe} gesendet. Tageslimit erreicht, morgen weiter.${nicht()}` });
        break;
      }
      if (!r.offen) {
        setMeldung({ ok: probleme.length === 0, message: `Fertig: ${summe} gesendet.${nicht()}` });
        break;
      }
      if (!r.gesendet) {
        setMeldung({ ok: false, message: `${summe} gesendet, der Rest geht nicht.${nicht()}` });
        break;
      }
      await new Promise((f) => setTimeout(f, 2000));
    }
    setAlleLaeuft(false);
  }

  /** Fuehrt eine Aktion aus, zeigt ihre Meldung und laedt die Daten neu. */
  function tue(fn: () => Promise<Ergebnis>, danach?: (r: Ergebnis) => void) {
    startTransition(async () => {
      const r = await fn();
      setMeldung(r.message ? r : null);
      danach?.(r);
      router.refresh();
    });
  }

  const zahlen = useMemo(() => {
    const z = (s: Status) => leads.filter((l) => l.status === s).length;
    return {
      gesamt: leads.length,
      neu: z("neu") + z("entwurf"),
      unterwegs: z("angeschrieben") + z("nachgefasst") + z("anrufen"),
      antworten: z("antwort") + z("infos") + z("termin"),
      kunden: z("kunde"),
      wartend: leads.filter(
        (l) => l.status === "entwurf" && !l.angeschrieben_am && l.entwurf && !l.gesperrt,
      ).length,
    };
  }, [leads]);

  const gefiltert = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (typFilter && l.typ !== typFilter) return false;
      if (statusFilter && l.status !== statusFilter) return false;
      if (!q) return true;
      return [l.firma, l.person, l.email, l.ort, l.branche].some((v) =>
        (v ?? "").toLowerCase().includes(q),
      );
    });
  }, [leads, query, typFilter, statusFilter]);

  const aktiv = leads.find((l) => l.id === aktivId) ?? null;

  function oeffne(id: string) {
    setAktivId(id);
    setAnrufFuer(null);
    requestAnimationFrame(() =>
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    );
  }

  const kpis = [
    { label: "Kontakte", wert: String(zahlen.gesamt) },
    { label: "noch nicht angeschrieben", wert: String(zahlen.neu) },
    { label: "unterwegs", wert: String(zahlen.unterwegs) },
    { label: "Antworten", wert: String(zahlen.antworten) },
    { label: "Kunden", wert: String(zahlen.kunden) },
    { label: "heute versendet", wert: `${heute} / ${limit}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">Akquise</h1>
        <p className="mt-2 max-w-2xl text-waldgruen/55">
          Firmen, Praxen und Vereine für Weihnachtsfeiern: Kontakte, fertiger
          Mail-Entwurf, Versand und Verlauf. Am Erstkontakt hängt{" "}
          <a
            href={anhang.pfad}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-waldgruen/30 text-waldgruen hover:border-tonwarm hover:text-tonwarm"
          >
            das Weihnachtsfeier-Blatt
          </a>
          . Höchstens {limit} Mails pro Tag.
        </p>
      </div>

      {!versandBereit && (
        <p className="max-w-2xl rounded-2xl bg-tonwarm/5 px-5 py-4 text-sm text-waldgruen/80 ring-1 ring-tonwarm/30">
          Der Mailversand ist hier noch nicht eingerichtet. Kontakte und
          Entwürfe lassen sich anlegen, gesendet wird erst, wenn{" "}
          <code>RESEND_API_KEY</code>, <code>CONTACT_FROM_EMAIL</code> und{" "}
          <code>NEWSLETTER_SECRET</code> gesetzt sind.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white px-4 py-4 ring-1 ring-waldgruen/10">
            <p className="font-display text-2xl text-waldgruen">{k.wert}</p>
            <p className="mt-1 text-xs leading-snug text-waldgruen/50">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Arbeitsliste: steht oben, weil sie die Arbeit ist, die den Stapel
          Richtung Zusage oder Absage bewegt. */}
      <section className="rounded-2xl border-l-[3px] border-tonwarm bg-white px-5 py-4 ring-1 ring-waldgruen/10">
        <h2 className="text-sm font-medium text-waldgruen">
          Heute zu tun{" "}
          {faellig.length > 0 && <span className="text-waldgruen/45">({faellig.length})</span>}
        </h2>
        {faellig.length === 0 ? (
          <p className="mt-2 text-sm text-waldgruen/50">
            Nichts offen. Nachfassen wird {NACHFASS_TAGE} Tage nach der ersten
            Mail fällig, der Anruf {NACHFASS_TAGE} Tage nach der zweiten.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-waldgruen/5">
            {faellig.map((f) => (
              <li key={f.id} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-waldgruen">{f.firma}</p>
                    <p className="text-xs text-waldgruen/50">
                      {f.schritt === "nachfassen"
                        ? "Nachfassen"
                        : f.schritt === "anrufen"
                          ? "Anrufen"
                          : "Wiedervorlage"}{" "}
                      · seit {f.seitTagen} {f.seitTagen === 1 ? "Tag" : "Tagen"} ·{" "}
                      {STATUS_TEXT[f.status]}
                      {f.telefon ? ` · ${f.telefon}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {f.schritt === "nachfassen" ? (
                      <ZweiKlick
                        label="Nachfass-Mail senden"
                        frage="Wirklich senden?"
                        disabled={busy}
                        onConfirm={() => tue(() => nachfassSendenAction(f.id))}
                      />
                    ) : (
                      <button
                        type="button"
                        className={BTN_PRIM}
                        onClick={() => setAnrufFuer(anrufFuer === f.id ? null : f.id)}
                      >
                        Anruf notieren
                      </button>
                    )}
                    <ZweiKlick
                      label="Kein Interesse"
                      frage="Als abgesagt ablegen?"
                      className={BTN_SEK}
                      disabled={busy}
                      onConfirm={() => tue(() => statusAction(f.id, "abgesagt"))}
                    />
                    <button type="button" className={BTN_SEK} onClick={() => oeffne(f.id)}>
                      Öffnen
                    </button>
                  </div>
                </div>
                {anrufFuer === f.id && (
                  <AnrufFormular
                    busy={busy}
                    onCancel={() => setAnrufFuer(null)}
                    onSave={(ergebnis, status, tage) =>
                      tue(
                        () => anrufAction({ id: f.id, ergebnis, status, tage }),
                        (r) => r.ok && setAnrufFuer(null),
                      )
                    }
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Leiste: suchen, filtern, anlegen, Stapel */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchen: Firma, Person, E-Mail, Ort"
          className={`${FELD} min-w-[14rem] flex-1`}
        />
        <select
          className={FELD}
          value={typFilter}
          onChange={(e) => setTypFilter(e.target.value as Typ | "")}
          aria-label="Zielgruppe"
        >
          <option value="">Alle Zielgruppen</option>
          {TYPEN.map((t) => (
            <option key={t} value={t}>
              {TYP_TEXT[t]}
            </option>
          ))}
        </select>
        <select
          className={FELD}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "")}
          aria-label="Stand"
        >
          <option value="">Alle Stände</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {STATUS_TEXT[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={BTN_SEK}
          onClick={() => setOffen(offen === "neu" ? "" : "neu")}
        >
          Kontakt anlegen
        </button>
        <button
          type="button"
          className={BTN_SEK}
          onClick={() => setOffen(offen === "import" ? "" : "import")}
        >
          Liste einfügen
        </button>
      </div>

      {offen === "neu" && (
        <NeuFormular
          busy={busy}
          vorgabeTyp={typFilter || "firma"}
          onSave={(eingabe) =>
            tue(
              () => speichereLeadAction(null, eingabe),
              (r) => {
                const id = (r as Ergebnis & { id?: string }).id;
                if (r.ok && id) {
                  setOffen("");
                  setAktivId(id);
                }
              },
            )
          }
        />
      )}
      {offen === "import" && (
        <ImportFormular
          busy={busy}
          vorgabeTyp={typFilter || "firma"}
          onImport={(text, typ) => tue(() => importiereAction(text, typ))}
        />
      )}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-5 py-3 ring-1 ring-waldgruen/10">
        <p className="mr-auto text-sm text-waldgruen/70">
          <span className="font-medium text-waldgruen">{zahlen.wartend}</span> fertige
          Entwürfe warten auf den Versand
          {typFilter ? ` (Stapel nimmt nur ${TYP_TEXT[typFilter]})` : ""}.
        </p>
        <ZweiKlick
          label="Entwürfe für neue Kontakte schreiben"
          frage="Für alle neuen schreiben?"
          className={BTN_SEK}
          disabled={busy}
          onConfirm={() => tue(() => entwuerfeFuerNeueAction())}
        />
        <input
          type="number"
          min={1}
          max={STAPEL_MAX}
          value={stapel}
          onChange={(e) =>
            setStapel(Math.max(1, Math.min(STAPEL_MAX, Number(e.target.value) || 1)))
          }
          className={`${FELD} w-20 text-center`}
          aria-label="Wie viele auf einmal"
        />
        <ZweiKlick
          label="Stapel senden"
          frage={`${Math.min(stapel, zahlen.wartend)} Mails wirklich senden?`}
          disabled={busy || alleLaeuft || !versandBereit || zahlen.wartend === 0}
          onConfirm={() => tue(() => stapelAction(stapel, typFilter))}
        />
        {alleLaeuft ? (
          <button
            type="button"
            className={BTN_SEK}
            onClick={() => {
              anhalten.current = true;
            }}
          >
            Anhalten
          </button>
        ) : (
          <ZweiKlick
            label="Alle senden"
            frage={`Wirklich alle ${zahlen.wartend} senden?`}
            className={BTN_SEK}
            disabled={busy || !versandBereit || zahlen.wartend === 0}
            onConfirm={() => void alleSenden()}
          />
        )}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-[1.25rem] text-sm ${
          meldung ? (meldung.ok ? "text-waldgruen/80" : "text-[#8a2f2f]") : ""
        }`}
      >
        {busy ? "Arbeitet …" : (meldung?.message ?? "")}
      </p>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="max-h-[78vh] overflow-auto rounded-2xl bg-white ring-1 ring-waldgruen/10">
          {leads.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-waldgruen/50">
              Noch keine Kontakte. Oben einen anlegen oder eine Liste einfügen.
            </p>
          ) : gefiltert.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-waldgruen/50">
              Keine Treffer mit diesem Filter.
            </p>
          ) : (
            <ul>
              {gefiltert.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => oeffne(l.id)}
                    aria-current={aktivId === l.id}
                    className={`flex w-full items-start justify-between gap-3 border-b border-waldgruen/5 px-4 py-3 text-left transition-colors hover:bg-mehlcreme/40 ${
                      aktivId === l.id ? "bg-mehlcreme/60 shadow-[inset_3px_0_0_var(--color-waldgruen)]" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-waldgruen">
                        {l.firma}
                      </span>
                      <span className="block truncate text-xs text-waldgruen/50">
                        {[l.person, l.ort, l.branche].filter(Boolean).join(" · ") ||
                          TYP_TEXT[l.typ]}
                      </span>
                      {l.faellig_am && !ERLEDIGT.includes(l.status) && (
                        <span className="block text-xs text-tonwarm-dark">
                          {l.naechster_schritt ?? "fällig"} {tag(l.faellig_am)}
                        </span>
                      )}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${PILLE[l.status]}`}
                    >
                      {STATUS_TEXT[l.status]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={detailRef} className="rounded-2xl bg-white p-5 ring-1 ring-waldgruen/10">
          {aktiv ? (
            <Detail
              key={`${aktiv.id}:${aktiv.updated_at}`}
              lead={aktiv}
              busy={busy}
              versandBereit={versandBereit}
              anhangDatei={anhang.datei}
              tue={tue}
              onVorschau={setVorschau}
              onGeloescht={() => setAktivId(null)}
            />
          ) : (
            <p className="text-sm text-waldgruen/50">Links einen Kontakt wählen.</p>
          )}
        </div>
      </div>

      {vorschau && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-waldgruen/50 p-4"
          onClick={() => setVorschau(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vorschau der Mail"
        >
          <div
            className="flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-waldgruen/10 px-5 py-3">
              <p className="text-sm font-medium text-waldgruen">
                So kommt die Mail an
              </p>
              <button type="button" className={BTN_SEK} onClick={() => setVorschau(null)}>
                Schließen
              </button>
            </div>
            <iframe title="Vorschau der Mail" srcDoc={vorschau} className="w-full flex-1" />
          </div>
        </div>
      )}
    </div>
  );
}

function NeuFormular({
  onSave,
  busy,
  vorgabeTyp,
}: {
  onSave: (eingabe: LeadEingabe) => void;
  busy: boolean;
  vorgabeTyp: Typ;
}) {
  const [firma, setFirma] = useState("");
  const [email, setEmail] = useState("");
  const [typ, setTyp] = useState<Typ>(vorgabeTyp);
  return (
    <form
      className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-5 py-4 ring-1 ring-waldgruen/10"
      onSubmit={(e) => {
        e.preventDefault();
        if (firma.trim()) onSave({ firma, email, typ, status: "neu", quelle: "von Hand" });
      }}
    >
      <input
        className={`${FELD} min-w-[12rem] flex-1`}
        value={firma}
        onChange={(e) => setFirma(e.target.value)}
        placeholder="Firma, Praxis oder Verein"
        autoFocus
        required
      />
      <input
        className={`${FELD} min-w-[12rem] flex-1`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail (kann später kommen)"
      />
      <select
        className={FELD}
        value={typ}
        onChange={(e) => setTyp(e.target.value as Typ)}
        aria-label="Zielgruppe"
      >
        {TYPEN.map((t) => (
          <option key={t} value={t}>
            {TYP_TEXT[t]}
          </option>
        ))}
      </select>
      <button type="submit" className={BTN_PRIM} disabled={busy}>
        Anlegen
      </button>
    </form>
  );
}

function ImportFormular({
  onImport,
  busy,
  vorgabeTyp,
}: {
  onImport: (text: string, typ: Typ) => void;
  busy: boolean;
  vorgabeTyp: Typ;
}) {
  const [text, setText] = useState("");
  const [typ, setTyp] = useState<Typ>(vorgabeTyp);
  return (
    <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-waldgruen/10">
      <p className="text-sm text-waldgruen/70">
        Eine Zeile je Kontakt, Felder mit Semikolon getrennt (aus Excel
        kopierte Zeilen gehen auch):
      </p>
      <p className="mt-1 text-xs text-waldgruen/50">
        <code>
          Firma; Person; Rolle; E-Mail; Telefon; Ort; Branche; Website; Fakt; Passung
        </code>
        <br />
        Person mit „Frau“ oder „Herr“ davor ergibt die richtige Anrede. „Fakt“
        ist ein ganzer Satz mit etwas Konkretem von deren Website, „Passung“
        ein Satz, warum wir zu ihnen passen. Beides ist freiwillig und macht
        die Mail persönlich.
      </p>
      <textarea
        className={`${IN} mt-3 font-mono text-xs`}
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Muster GmbH; Frau Anna Muster; Personal; anna@muster.de; 0941 123; Regensburg; Maschinenbau; muster.de"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          className={FELD}
          value={typ}
          onChange={(e) => setTyp(e.target.value as Typ)}
          aria-label="Zielgruppe für diese Liste"
        >
          {TYPEN.map((t) => (
            <option key={t} value={t}>
              als {TYP_TEXT[t]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={BTN_PRIM}
          disabled={busy || !text.trim()}
          onClick={() => {
            onImport(text, typ);
            setText("");
          }}
        >
          Einfügen
        </button>
      </div>
    </div>
  );
}

const FORMFELDER = [
  "firma",
  "person",
  "rolle",
  "branche",
  "email",
  "telefon",
  "ort",
  "website",
  "typ",
  "status",
  "naechster_schritt",
  "faellig_am",
  "fakt",
  "passung",
  "notiz",
  "betreff",
  "entwurf",
] as const;
type Formfeld = (typeof FORMFELDER)[number];

function Detail({
  lead,
  busy,
  versandBereit,
  anhangDatei,
  tue,
  onVorschau,
  onGeloescht,
}: {
  lead: Lead;
  busy: boolean;
  versandBereit: boolean;
  anhangDatei: string;
  tue: (fn: () => Promise<Ergebnis>, danach?: (r: Ergebnis) => void) => void;
  onVorschau: (html: string) => void;
  onGeloescht: () => void;
}) {
  const [f, setF] = useState<Record<Formfeld, string>>(
    () =>
      Object.fromEntries(FORMFELDER.map((k) => [k, String(lead[k] ?? "")])) as Record<
        Formfeld,
        string
      >,
  );
  const [events, setEvents] = useState<LeadEvent[] | null>(null);
  const [anruf, setAnruf] = useState(false);
  const [notiz, setNotiz] = useState("");

  useEffect(() => {
    let da = true;
    verlaufAction(lead.id).then((e) => da && setEvents(e));
    return () => {
      da = false;
    };
  }, [lead.id, lead.updated_at]);

  const setze = (k: Formfeld) => (e: { target: { value: string } }) =>
    setF((alt) => ({ ...alt, [k]: e.target.value }));
  const eingabe = (): LeadEingabe => ({ ...f });
  // Der Entwurf rechnet mit dem, was gerade im Formular steht, nicht mit dem
  // zuletzt gespeicherten Stand.
  const kopf = { ...lead, ...f, typ: f.typ as Typ, status: f.status as Status };

  const erstkontaktOffen = !lead.angeschrieben_am;
  const kannNachfassen =
    Boolean(lead.angeschrieben_am) && !lead.nachgefasst_am && !ERLEDIGT.includes(lead.status);
  const sendenGesperrt =
    busy || !versandBereit || lead.gesperrt || !f.email.trim() || !f.entwurf.trim();

  const feld = (k: Formfeld, label: string, type = "text") => (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <input className={IN} type={type} value={f[k]} onChange={setze(k)} />
    </label>
  );

  function schreibe(v: { betreff: string; text: string }) {
    if (f.entwurf.trim() && f.entwurf.trim() !== v.text.trim()) {
      if (!window.confirm("Im Feld steht schon ein Text. Durch den Vorschlag ersetzen?")) return;
    }
    setF((alt) => ({ ...alt, betreff: v.betreff, entwurf: v.text }));
  }

  return (
    <div className="space-y-3">
      {lead.gesperrt && (
        <p className="rounded-xl bg-[#f3e6e2] px-4 py-2.5 text-sm font-medium text-[#7a2323]">
          Hat sich abgemeldet. Dieser Kontakt wird nicht mehr angeschrieben.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {feld("firma", "Firma")}
        {feld("person", "Ansprechpartner (mit Frau/Herr)")}
        {feld("rolle", "Rolle")}
        {feld("branche", "Branche")}
        {feld("email", "E-Mail", "email")}
        {feld("telefon", "Telefon")}
        {feld("ort", "Ort")}
        {feld("website", "Website")}
        <label className="block">
          <span className={LABEL}>Zielgruppe</span>
          <select className={IN} value={f.typ} onChange={setze("typ")}>
            {TYPEN.map((t) => (
              <option key={t} value={t}>
                {TYP_TEXT[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={LABEL}>Stand</span>
          <select className={IN} value={f.status} onChange={setze("status")}>
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {STATUS_TEXT[s]}
              </option>
            ))}
          </select>
        </label>
        {feld("naechster_schritt", "Nächster Schritt")}
        {feld("faellig_am", "fällig am", "date")}
      </div>

      {feld("fakt", "Fakt über die Firma (ganzer Satz, z. B. „Sie bauen Sondermaschinen.“)")}
      {feld("passung", "Warum wir passen (ganzer Satz)")}
      <label className="block">
        <span className={LABEL}>Notiz</span>
        <textarea className={IN} rows={2} value={f.notiz} onChange={setze("notiz")} />
      </label>
      {feld("betreff", "Betreff")}
      <label className="block">
        <span className={LABEL}>Mail-Text</span>
        <textarea
          className={`${IN} leading-relaxed`}
          rows={14}
          value={f.entwurf}
          onChange={setze("entwurf")}
        />
      </label>
      <p className="text-xs text-waldgruen/45">
        Signatur, Pflichtangaben und der Abmeldeweg kommen automatisch dazu.
        {erstkontaktOffen ? ` Anhang: ${anhangDatei}.` : " Kein Anhang mehr, der hing an der ersten Mail."}
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {erstkontaktOffen && (
          <button type="button" className={BTN_SEK} onClick={() => schreibe(entwurfFuer(kopf))}>
            Entwurf schreiben
          </button>
        )}
        {kannNachfassen && (
          <button
            type="button"
            className={BTN_SEK}
            onClick={() => schreibe(nachfassEntwurf({ ...lead, person: f.person }))}
          >
            Nachfass-Vorschlag
          </button>
        )}
        <button
          type="button"
          className={BTN_SEK}
          disabled={busy}
          onClick={() => tue(() => speichereLeadAction(lead.id, eingabe()))}
        >
          Speichern
        </button>
        <button
          type="button"
          className={BTN_SEK}
          disabled={!f.entwurf.trim()}
          onClick={() =>
            onVorschau(
              vorschauHtml({
                an: f.email,
                betreff: f.betreff,
                text: f.entwurf,
                mitAnhang: erstkontaktOffen,
                siteUrl: SITE_URL,
              }),
            )
          }
        >
          Vorschau
        </button>
        {/* Die erste Mail geht je Kontakt genau einmal. Danach gibt es zwei
            Wege: eine freie Antwort im laufenden Gespraech, oder das eine
            Nachfassen, wenn nichts zurueckkam. */}
        {erstkontaktOffen ? (
          <ZweiKlick
            label="Mail senden"
            frage="Wirklich senden?"
            disabled={sendenGesperrt}
            onConfirm={() => tue(() => sendeAction(lead.id, "erst", eingabe()))}
          />
        ) : (
          <>
            <ZweiKlick
              label="Antwort senden"
              frage="Wirklich senden?"
              disabled={sendenGesperrt}
              onConfirm={() => tue(() => sendeAction(lead.id, "antwort", eingabe()))}
            />
            {kannNachfassen && (
              <ZweiKlick
                label="Als Nachfass-Mail senden"
                frage="Wirklich senden?"
                className={BTN_SEK}
                disabled={sendenGesperrt}
                onConfirm={() => tue(() => sendeAction(lead.id, "nachfass", eingabe()))}
              />
            )}
          </>
        )}
        <button type="button" className={BTN_SEK} onClick={() => setAnruf(!anruf)}>
          Anruf vermerken
        </button>
        <button
          type="button"
          className={`${BTN_SEK} ml-auto`}
          disabled={busy}
          onClick={() => {
            if (window.confirm(`${lead.firma} wirklich löschen? Der Verlauf geht mit verloren.`)) {
              tue(
                () => loescheLeadAction(lead.id),
                (r) => r.ok && onGeloescht(),
              );
            }
          }}
        >
          Löschen
        </button>
      </div>

      {anruf && (
        <AnrufFormular
          busy={busy}
          onCancel={() => setAnruf(false)}
          onSave={(ergebnis, status, tage) =>
            tue(() => anrufAction({ id: lead.id, ergebnis, status, tage }))
          }
        />
      )}

      {(lead.angeschrieben_am || lead.nachgefasst_am) && (
        <p className="text-xs text-waldgruen/55">
          {lead.angeschrieben_am ? `Angeschrieben am ${datum(lead.angeschrieben_am)}` : ""}
          {lead.nachgefasst_am ? ` · nachgefasst am ${datum(lead.nachgefasst_am)}` : ""}
        </p>
      )}

      <div className="border-t border-waldgruen/10 pt-3">
        <h3 className={LABEL}>Verlauf</h3>
        <form
          className="mb-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (notiz.trim()) tue(() => notizAction(lead.id, notiz));
          }}
        >
          <input
            className={IN}
            value={notiz}
            onChange={(e) => setNotiz(e.target.value)}
            placeholder="Notiz zum Verlauf"
          />
          <button type="submit" className={BTN_SEK} disabled={busy || !notiz.trim()}>
            Notieren
          </button>
        </form>
        {events === null ? (
          <p className="text-xs text-waldgruen/45">Lade …</p>
        ) : events.length === 0 ? (
          <p className="text-xs text-waldgruen/45">Noch nichts passiert.</p>
        ) : (
          <ul className="divide-y divide-waldgruen/5">
            {events.map((e) => (
              <li key={e.id} className="py-1.5 text-sm text-waldgruen/75">
                <span className="font-medium text-waldgruen">{e.art}</span> ·{" "}
                {datum(e.created_at)} · {e.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
