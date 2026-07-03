"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import {
  sendNewsletterAction,
  sendTestNewsletterAction,
  resumeNewsletterAction,
  type SendState,
} from "@/app/actions/newsletter-admin";
import {
  NEWSLETTER_TEMPLATES,
  renderTemplate,
} from "@/lib/newsletter-templates";
import {
  HEADER_DEFAULTS,
  HEADER_STYLES,
  wrapEmail,
  personalizeHtml,
  mailVars,
} from "@/lib/newsletter-shell";
import { SITE_PHOTOS } from "@/lib/site-photos";
import { CONTACT, SITE } from "@/lib/site";

const INITIAL: SendState = { status: "idle", message: "" };

const inputCls =
  "w-full rounded-xl border border-waldgruen/20 bg-white px-4 py-2.5 text-waldgruen placeholder-waldgruen/35 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20";

const chipCls =
  "rounded-full bg-mehlcreme/60 hover:bg-tonwarm/15 text-waldgruen text-xs px-3 py-1.5 transition-colors";

// E-Mail-sichere Bausteine zum Einfügen ins eigene HTML (gleiche Marken-Optik
// wie die Vorlagen-Bausteine).
const HTML_BLOCKS: { label: string; snippet: string }[] = [
  {
    label: "Überschrift",
    snippet: `\n<h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#2e3d2c;font-size:30px;line-height:1.2;margin:0 0 16px">Überschrift</h1>\n`,
  },
  {
    label: "Absatz",
    snippet: `\n<p style="margin:0 0 15px;font-size:16px;color:#3a3a36;line-height:1.7">Dein Text hier …</p>\n`,
  },
  {
    label: "Button",
    snippet: `\n<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="border-radius:9999px;background:#c97c5d"><a href="https://restaurant-waldwiese.de/reservieren" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;font-family:Helvetica,Arial,sans-serif">Tisch sichern &rarr;</a></td></tr></table>\n`,
  },
  {
    label: "Geheim-Box",
    snippet: `\n<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0"><tr><td bgcolor="#2e3d2c" style="background:#2e3d2c;border-radius:16px;padding:26px;text-align:center"><div style="text-transform:uppercase;letter-spacing:2.5px;font-size:11px;color:#c97c5d;font-weight:700;margin-bottom:8px">Noch geheim</div><div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#f2ead8;line-height:1.4">Die Karte verraten wir kurz vor dem Start.</div></td></tr></table>\n`,
  },
  {
    label: "Trennlinie",
    snippet: `\n<hr style="border:0;border-top:1px solid #e3ded0;margin:24px 0" />\n`,
  },
];

const HTML_VARS = ["{{vorname}}", "{{name}}", "{{email}}"];

/** Editor für „HTML selbst" mit Einfüge-Werkzeugen: Variablen, Bausteine, Bilder. */
function HtmlEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [showPhotos, setShowPhotos] = useState(false);

  function insert(snippet: string) {
    const ta = ref.current;
    const cur = value ?? "";
    if (!ta) {
      onChange(cur + snippet);
      return;
    }
    const start = ta.selectionStart ?? cur.length;
    const end = ta.selectionEnd ?? cur.length;
    onChange(cur.slice(0, start) + snippet + cur.slice(end));
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span className="text-xs text-waldgruen/40 mr-1">Einfügen:</span>
        {HTML_VARS.map((v) => (
          <button key={v} type="button" onClick={() => insert(v)} className={chipCls}>
            {v}
          </button>
        ))}
        {HTML_BLOCKS.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => insert(b.snippet)}
            className={chipCls}
          >
            + {b.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowPhotos((s) => !s)}
          className={chipCls}
        >
          + Bild
        </button>
      </div>

      {showPhotos && (
        <div className="mb-2 rounded-xl ring-1 ring-waldgruen/15 bg-white p-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-52 overflow-auto">
            {SITE_PHOTOS.map((p) => (
              <button
                key={p.src}
                type="button"
                title={p.label}
                onClick={() => {
                  insert(
                    `\n<img src="${p.src}" alt="" width="600" style="width:100%;max-width:100%;display:block;border-radius:16px;margin:0 0 16px" />\n`,
                  );
                  setShowPhotos(false);
                }}
                className="aspect-square rounded-lg overflow-hidden ring-1 ring-waldgruen/15 hover:ring-tonwarm/50 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.label}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        ref={ref}
        rows={14}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="<h1>…</h1><p>…</p>"
        className={`${inputCls} resize-y font-mono text-xs`}
      />
      <p className="mt-1 text-xs text-waldgruen/40">
        Kopfzeile, Footer, Personalisierung und Dark-Mode-Schutz kommen beim
        Versand automatisch dazu — wie bei den Vorlagen.
      </p>
    </div>
  );
}

/** Klickbares Raster aller Website-Fotos. Setzt die absolute Bild-URL. */
function ImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl ring-1 ring-waldgruen/15 bg-white p-2">
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-60 overflow-auto">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`aspect-square rounded-lg ring-1 flex items-center justify-center text-[10px] text-center leading-tight px-1 transition ${
            value === ""
              ? "ring-2 ring-tonwarm bg-tonwarm/5 text-tonwarm-dark"
              : "ring-waldgruen/15 text-waldgruen/45 hover:ring-tonwarm/40"
          }`}
        >
          Kein Bild
        </button>
        {SITE_PHOTOS.map((p) => {
          const active = value === p.src;
          return (
            <button
              key={p.src}
              type="button"
              onClick={() => onChange(p.src)}
              title={p.label}
              className={`relative aspect-square rounded-lg overflow-hidden ring-1 transition ${
                active
                  ? "ring-2 ring-tonwarm"
                  : "ring-waldgruen/15 hover:ring-tonwarm/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.label}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 px-1 text-xs text-waldgruen/45">
        Klick ein Foto an — es wird oben in die Mail eingebaut.
      </p>
    </div>
  );
}

type OpenCampaign = {
  id: string;
  label: string;
  sentCount: number;
  recipientCount: number;
};

/** „Kampagne fortsetzen": an die senden, die sie noch nicht haben. */
function ContinuePanel({ campaigns }: { campaigns: OpenCampaign[] }) {
  const [state, action, pending] = useActionState(resumeNewsletterAction, INITIAL);
  const [selId, setSelId] = useState(campaigns[0]?.id ?? "");

  if (campaigns.length === 0) {
    return (
      <div className="mt-5 rounded-2xl ring-1 ring-waldgruen/15 bg-white/70 p-5 max-w-2xl text-sm text-waldgruen/60">
        Alle Kampagnen sind vollständig versendet. Starte links eine neue.
      </div>
    );
  }

  const sel = campaigns.find((c) => c.id === selId) ?? campaigns[0];
  const open = Math.max(0, sel.recipientCount - sel.sentCount);

  return (
    <div className="mt-5 rounded-2xl ring-1 ring-waldgruen/15 bg-white/70 p-5 max-w-2xl">
      <p className="text-sm font-medium text-waldgruen">Kampagne fortsetzen</p>
      <p className="mt-0.5 text-xs text-waldgruen/45">
        Schickt dieselbe Kampagne an die Angemeldeten, die sie noch nicht haben
        — ohne Duplikate. (Wegen Tageslimit ggf. über mehrere Tage.)
      </p>

      <label className="mt-4 block text-xs font-medium text-waldgruen/70 mb-1">
        Welche Kampagne?
      </label>
      <select
        value={sel.id}
        onChange={(e) => setSelId(e.target.value)}
        className={inputCls}
      >
        {campaigns.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label} — {c.sentCount}/{c.recipientCount} gesendet
          </option>
        ))}
      </select>

      <p className="mt-3 text-sm text-waldgruen/70">
        <strong className="text-waldgruen">{open}</strong> haben sie noch nicht.
        {sel.sentCount === 0 && (
          <span className="text-tonwarm-dark">
            {" "}
            Achtung: hier ist noch nichts protokolliert — Fortsetzen geht an
            alle.
          </span>
        )}
      </p>

      <form action={action} className="mt-4">
        <input type="hidden" name="newsletterId" value={sel.id} />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3 rounded-full font-medium transition-colors disabled:opacity-60"
        >
          {pending ? "Wird gesendet …" : `An die restlichen ${open} senden`}
        </button>
      </form>
      {state.status !== "idle" && (
        <p
          role="alert"
          className={`mt-2 text-sm ${
            state.status === "ok" ? "text-waldgruen/70" : "text-tonwarm-dark"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}

export function NewsletterComposer({
  recipientCount,
  openCampaigns = [],
}: {
  recipientCount: number;
  openCampaigns?: OpenCampaign[];
}) {
  const [state, formAction, pending] = useActionState(sendNewsletterAction, INITIAL);
  const [mode, setMode] = useState<"new" | "continue">("new");
  const [templateId, setTemplateId] = useState(NEWSLETTER_TEMPLATES[0].id);
  const [values, setValues] = useState<Record<string, string>>({
    ...NEWSLETTER_TEMPLATES[0].sample,
  });
  // Kopfzeile gilt für jede Mail — bleibt beim Vorlagenwechsel erhalten.
  const [header, setHeader] = useState({ ...HEADER_DEFAULTS });
  const [showHeader, setShowHeader] = useState(true);
  const [subject, setSubject] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [fallbackName, setFallbackName] = useState("du");
  // Geplanter Versand: leer = sofort senden. Wert aus <input type=datetime-local>
  // (lokale Zeit) → beim Absenden in ISO (UTC) umgerechnet.
  const [scheduledLocal, setScheduledLocal] = useState("");
  const scheduledIso = useMemo(
    () => (scheduledLocal ? new Date(scheduledLocal).toISOString() : ""),
    [scheduledLocal],
  );
  const isScheduled = scheduledIso !== "";
  const [testEmail, setTestEmail] = useState<string>(CONTACT.email);
  const [testState, testFormAction, testPending] = useActionState(
    sendTestNewsletterAction,
    INITIAL,
  );

  const template =
    NEWSLETTER_TEMPLATES.find((t) => t.id === templateId) ?? NEWSLETTER_TEMPLATES[0];
  // Eigenes HTML füllt die ganze Breite (randlos, kein 600px-Rahmen).
  const bare = templateId === "html";
  const inner = useMemo(() => renderTemplate(templateId, values), [templateId, values]);
  // Volle Vorschau = exakt die Mail, die rausgeht (Header + Inhalt + Footer),
  // Platzhalter mit Beispiel-Daten gefüllt, damit man die Personalisierung sieht.
  const preview = useMemo(() => {
    const sample = mailVars(
      "Maria Musterfrau",
      testEmail || "maria@beispiel.de",
      fallbackName,
    );
    return wrapEmail(personalizeHtml(inner, sample), {
      unsubUrl: `${SITE.url}/api/newsletter/abmelden?token=vorschau`,
      header: showHeader ? header : false,
      bare,
    });
  }, [inner, header, showHeader, bare, testEmail, fallbackName]);

  const set = (key: string, val: string) =>
    setValues((v) => ({ ...v, [key]: val }));
  const setH = (key: keyof typeof header, val: string) =>
    setHeader((h) => ({ ...h, [key]: val }) as typeof h);

  // Vorlage wählen → mit Beispiel vorbefüllen (fertige Mail zum Anpassen).
  const choose = (id: string) => {
    const t = NEWSLETTER_TEMPLATES.find((x) => x.id === id);
    setTemplateId(id);
    if (t) setValues({ ...t.sample });
    // Bei eigenem HTML baut man den Kopf selbst → Kopfzeile aus.
    setShowHeader(id !== "html");
  };

  return (
    <section>
      <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        Newsletter schreiben
      </h2>
      <p className="mt-2 text-sm text-waldgruen/55">
        Geht an <strong className="text-waldgruen">{recipientCount}</strong>{" "}
        angemeldete Empfänger. Wähl eine Vorlage (kommt als fertiges Beispiel),
        pass sie an — Kopfzeile &amp; Impressum-Footer sind schon dabei.
      </p>

      {/* Kampagne: neu starten oder eine bestehende fortsetzen */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-sm text-waldgruen/60">Kampagne:</span>
        <div className="inline-flex rounded-full bg-mehlcreme/40 p-1">
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              mode === "new"
                ? "bg-waldgruen text-mehlcreme"
                : "text-waldgruen/70 hover:text-waldgruen"
            }`}
          >
            Neue starten
          </button>
          <button
            type="button"
            onClick={() => setMode("continue")}
            disabled={openCampaigns.length === 0}
            className={`rounded-full px-4 py-1.5 text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === "continue"
                ? "bg-waldgruen text-mehlcreme"
                : "text-waldgruen/70 hover:text-waldgruen"
            }`}
          >
            Fortsetzen{openCampaigns.length ? ` (${openCampaigns.length})` : ""}
          </button>
        </div>
      </div>

      {mode === "continue" && <ContinuePanel campaigns={openCampaigns} />}

      <div className={mode === "new" ? "" : "hidden"}>
        <div className="mt-5 max-w-md">
          <label
            htmlFor="campaignName"
            className="block text-sm font-medium text-waldgruen mb-1.5"
          >
            Kampagnen-Name{" "}
            <span className="font-normal text-waldgruen/40">
              (optional, zum Wiederfinden)
            </span>
          </label>
          <input
            id="campaignName"
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="z. B. Frühstücks-Start Juli"
            className={inputCls}
          />
        </div>

        {/* Vorlagen-Galerie mit Vorschau pro Vorlage */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {NEWSLETTER_TEMPLATES.map((t) => {
          const active = t.id === templateId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => choose(t.id)}
              className={`text-left rounded-2xl p-2 ring-1 transition-all ${
                active
                  ? "ring-2 ring-tonwarm bg-tonwarm/5"
                  : "ring-waldgruen/15 bg-white hover:ring-tonwarm/40"
              }`}
            >
              <div className="h-[150px] overflow-hidden rounded-xl ring-1 ring-waldgruen/10 bg-white">
                <div
                  style={{
                    width: 600,
                    transform: "scale(0.46)",
                    transformOrigin: "top left",
                  }}
                >
                  <div
                    style={{ padding: 16 }}
                    dangerouslySetInnerHTML={{
                      __html: renderTemplate(t.id, t.sample),
                    }}
                  />
                </div>
              </div>
              <p className="mt-2 px-1 text-sm font-medium text-waldgruen">
                {t.name}
              </p>
              <p className="px-1 text-xs text-waldgruen/45 leading-snug">
                {t.description}
              </p>
            </button>
          );
        })}
      </div>

      <form action={formAction} className="mt-7 grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-waldgruen mb-1.5"
            >
              Betreff
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Was gibt's Neues bei Wald & Wiese?"
              className={inputCls}
            />
          </div>

          {/* Kopfzeile (Header) — optional, bei eigenem HTML standardmäßig aus */}
          <div className="rounded-2xl ring-1 ring-waldgruen/15 bg-white/70 p-4">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span>
                <span className="block text-sm font-medium text-waldgruen">
                  Kopfzeile anzeigen
                </span>
                <span className="block text-xs text-waldgruen/45 mt-0.5">
                  Briefkopf ganz oben. Bei „HTML selbst" aus — du baust ihn dort
                  selbst. (Footer/Impressum bleibt immer.)
                </span>
              </span>
              <input
                type="checkbox"
                checked={showHeader}
                onChange={(e) => setShowHeader(e.target.checked)}
                className="h-5 w-5 shrink-0 accent-tonwarm"
              />
            </label>

            {showHeader && (
              <div className="mt-4 border-t border-waldgruen/10 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-waldgruen/70 mb-1">
                      Titel
                    </label>
                    <input
                      type="text"
                      value={header.title}
                      onChange={(e) => setH("title", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-waldgruen/70 mb-1">
                      Stil
                    </label>
                    <select
                      value={header.style}
                      onChange={(e) => setH("style", e.target.value)}
                      className={inputCls}
                    >
                      {HEADER_STYLES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-waldgruen/70 mb-1">
                    Unterzeile
                  </label>
                  <input
                    type="text"
                    value={header.tagline}
                    onChange={(e) => setH("tagline", e.target.value)}
                    placeholder="z. B. Frühstück · mitten im Grünen"
                    className={inputCls}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Personalisierung — Platzhalter, die pro Empfänger ersetzt werden */}
          <div className="rounded-2xl ring-1 ring-waldgruen/15 bg-white/70 p-4">
            <p className="text-sm font-medium text-waldgruen">Personalisierung</p>
            <p className="mt-0.5 text-xs text-waldgruen/45">
              Setz diese Platzhalter in Betreff oder Text ein — sie werden pro
              Empfänger ersetzt:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["{{vorname}}", "{{name}}", "{{email}}"].map((v) => (
                <code
                  key={v}
                  className="rounded-md bg-mehlcreme/60 px-2 py-1 text-xs text-waldgruen"
                >
                  {v}
                </code>
              ))}
            </div>
            <label className="mt-3 block text-xs font-medium text-waldgruen/70 mb-1">
              Falls kein Name bekannt ist, nutze:
            </label>
            <input
              type="text"
              value={fallbackName}
              onChange={(e) => setFallbackName(e.target.value)}
              placeholder="du"
              className={`${inputCls} max-w-xs`}
            />
          </div>

          {template.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-waldgruen mb-1.5">
                {f.label}
              </label>
              {f.type === "image" ? (
                <ImagePicker
                  value={values[f.key] ?? ""}
                  onChange={(v) => set(f.key, v)}
                />
              ) : f.type === "html" ? (
                <HtmlEditor
                  value={values[f.key] ?? ""}
                  onChange={(v) => set(f.key, v)}
                />
              ) : f.type === "textarea" ? (
                <textarea
                  rows={6}
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`${inputCls} resize-y`}
                />
              ) : (
                <input
                  type="text"
                  value={values[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              )}
            </div>
          ))}

          <input type="hidden" name="html" value={inner} />
          <input type="hidden" name="headerTitle" value={header.title} />
          <input type="hidden" name="headerTagline" value={header.tagline} />
          <input type="hidden" name="headerStyle" value={header.style} />
          <input type="hidden" name="showHeader" value={showHeader ? "1" : "0"} />
          <input type="hidden" name="bare" value={bare ? "1" : "0"} />
          <input type="hidden" name="campaignName" value={campaignName} />
          <input type="hidden" name="fallbackName" value={fallbackName} />
          <input type="hidden" name="scheduledAt" value={scheduledIso} />

          {/* Sendezeitpunkt — leer = sofort. Gesetzt = Resend plant den Versand. */}
          <div className="rounded-2xl ring-1 ring-waldgruen/15 bg-white/70 p-4">
            <label
              htmlFor="scheduledLocal"
              className="block text-sm font-medium text-waldgruen"
            >
              Wann senden?
            </label>
            <p className="mt-0.5 mb-3 text-xs text-waldgruen/45">
              Leer lassen = sofort. Oder einen Zeitpunkt wählen — dann verschickt
              Resend den Newsletter automatisch dann (auch wenn dein Rechner aus
              ist).
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="scheduledLocal"
                type="datetime-local"
                value={scheduledLocal}
                onChange={(e) => setScheduledLocal(e.target.value)}
                className={`${inputCls} max-w-xs`}
              />
              {isScheduled && (
                <button
                  type="button"
                  onClick={() => setScheduledLocal("")}
                  className="text-xs text-waldgruen/50 underline hover:text-tonwarm"
                >
                  zurücksetzen (sofort senden)
                </button>
              )}
            </div>
            {isScheduled && (
              <p className="mt-2 text-sm text-tonwarm-dark">
                ⏰ Geplant für{" "}
                <strong>
                  {new Date(scheduledLocal).toLocaleString("de-DE", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </strong>
              </p>
            )}
          </div>

          <label className="flex items-start gap-2.5 text-sm text-waldgruen/70">
            <input
              type="checkbox"
              name="confirm"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-tonwarm"
            />
            <span>
              {isScheduled
                ? `Ja, diesen Newsletter zum gewählten Zeitpunkt an alle ${recipientCount} angemeldeten Empfänger senden.`
                : `Ja, diesen Newsletter an alle ${recipientCount} angemeldeten Empfänger senden.`}
            </span>
          </label>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={pending || recipientCount === 0}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending
                ? isScheduled
                  ? "Wird eingeplant …"
                  : "Wird gesendet …"
                : isScheduled
                  ? "Versand planen"
                  : "Newsletter senden"}
            </button>
            {state.status !== "idle" && (
              <span
                role="alert"
                className={`text-sm ${
                  state.status === "ok" ? "text-waldgruen/70" : "text-tonwarm-dark"
                }`}
              >
                {state.message}
              </span>
            )}
          </div>
        </div>

        {/* Live-Vorschau: ganze Mail inkl. Kopfzeile und Footer */}
        <div>
          <span className="text-sm font-medium text-waldgruen">
            Vorschau (komplette Mail)
          </span>
          <div
            className={`mt-1.5 rounded-xl ring-1 ring-waldgruen/10 min-h-[20rem] overflow-auto ${
              bare ? "bg-[#2e3d2c] p-0" : "bg-[#f7f6f3] p-3"
            }`}
          >
            <div
              className={bare ? "mx-auto max-w-full" : "mx-auto max-w-[600px]"}
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
          <p className="mt-2 text-xs text-waldgruen/40">
            So kommt die Mail an — Kopfzeile, dein Inhalt und das
            Impressum-Footer-Band. Platzhalter sind hier mit Beispiel-Daten
            gefüllt (z. B. Maria); pro Empfänger steht dann der echte Name. Der
            Abmelde-Link ist nur ein Platzhalter.
          </p>
        </div>
      </form>

      {/* Test-Versand (eigenes Formular, nicht im Sende-Formular verschachtelt) */}
      <form
        action={testFormAction}
        className="mt-6 rounded-2xl ring-1 ring-waldgruen/15 bg-white/70 p-4"
      >
        <p className="text-sm font-medium text-waldgruen">Erst testen</p>
        <p className="mt-0.5 mb-3 text-xs text-waldgruen/45">
          Schick dir den aktuellen Entwurf an eine Adresse, bevor er an alle
          geht. Der Betreff bekommt ein „[Test]" vorangestellt.
        </p>

        <input type="hidden" name="subject" value={subject} />
        <input type="hidden" name="html" value={inner} />
        <input type="hidden" name="headerTitle" value={header.title} />
        <input type="hidden" name="headerTagline" value={header.tagline} />
        <input type="hidden" name="headerStyle" value={header.style} />
        <input type="hidden" name="showHeader" value={showHeader ? "1" : "0"} />
        <input type="hidden" name="bare" value={bare ? "1" : "0"} />

        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="email"
            name="testEmail"
            required
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@beispiel.de"
            className={inputCls}
          />
          <button
            type="submit"
            disabled={testPending}
            className="rounded-full border border-waldgruen/30 text-waldgruen hover:border-tonwarm hover:text-tonwarm px-6 py-2.5 font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {testPending ? "Sende Test …" : "Test senden"}
          </button>
        </div>
        {testState.status !== "idle" && (
          <p
            role="alert"
            className={`mt-2 text-sm ${
              testState.status === "ok" ? "text-waldgruen/70" : "text-tonwarm-dark"
            }`}
          >
            {testState.message}
          </p>
        )}
      </form>
      </div>
    </section>
  );
}
