"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { track } from "@/components/analytics";
import { subscribeToLaunchList } from "@/app/actions/newsletter";
import { NEWSLETTER_INITIAL_STATE } from "@/lib/newsletter";
import {
  ANLASS_OPTIONS,
  GESCHMACK_OPTIONS,
  PERSONEN_OPTIONS,
  ZEIT_OPTIONS,
  getEmpfehlung,
  personenLabel,
  type Anlass,
} from "@/lib/sommelier";

const TOTAL = 4;

type Props = {
  /** Wird nach Navigation (z. B. „Tisch sichern") aufgerufen — schließt das Panel. */
  onNavigate?: () => void;
};

export function SommelierQuiz({ onNavigate }: Props) {
  const [step, setStep] = useState(0);
  const [anlass, setAnlass] = useState<Anlass | null>(null);
  const [geschmack, setGeschmack] = useState<string | null>(null);
  const [personen, setPersonen] = useState<number | null>(null);
  const [zeit, setZeit] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function restart() {
    setStep(0);
    setAnlass(null);
    setGeschmack(null);
    setPersonen(null);
    setZeit(null);
    setDone(false);
  }

  function back() {
    if (done) {
      setDone(false);
      setStep(3);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }

  if (done && anlass && geschmack && personen && zeit) {
    return (
      <Card>
        <Result
          anlass={anlass}
          geschmack={geschmack}
          personen={personen}
          zeit={zeit}
          onRestart={restart}
          onBack={back}
          onNavigate={onNavigate}
        />
      </Card>
    );
  }

  const progress = Math.round((step / TOTAL) * 100);

  return (
    <Card>
      <Header step={step} progress={progress} onBack={back} />

      {step === 0 && (
        <Question prompt="Wann darf's sein?">
          <div className="grid gap-3">
            {ANLASS_OPTIONS.map((o) => (
              <OptionButton
                key={o.key}
                onClick={() => {
                  setAnlass(o.key);
                  setGeschmack(null);
                  setStep(1);
                }}
              >
                <span className="font-display text-lg text-waldgruen group-hover:text-tonwarm-dark transition-colors">
                  {o.label}
                </span>
                <span className="block text-sm text-waldgruen/50">{o.sub}</span>
              </OptionButton>
            ))}
          </div>
        </Question>
      )}

      {step === 1 && anlass && (
        <Question prompt="Worauf hast du Lust?">
          <div className="grid gap-3 sm:grid-cols-2">
            {GESCHMACK_OPTIONS[anlass].map((o) => (
              <OptionButton
                key={o.key}
                onClick={() => {
                  setGeschmack(o.key);
                  setStep(2);
                }}
              >
                <span className="font-display text-lg text-waldgruen group-hover:text-tonwarm-dark transition-colors">
                  {o.label}
                </span>
              </OptionButton>
            ))}
          </div>
        </Question>
      )}

      {step === 2 && (
        <Question prompt="Für wie viele?">
          <div className="grid grid-cols-4 gap-3">
            {PERSONEN_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setPersonen(n);
                  setStep(3);
                }}
                className="rounded-2xl border border-waldgruen/15 bg-mehlcreme/40 py-4 font-display text-xl text-waldgruen transition-all hover:border-tonwarm hover:bg-tonwarm/5 hover:-translate-y-0.5"
              >
                {n === 8 ? "8+" : n}
              </button>
            ))}
          </div>
        </Question>
      )}

      {step === 3 && anlass && (
        <Question prompt="Wann ungefähr?">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {ZEIT_OPTIONS[anlass].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setZeit(t);
                  setDone(true);
                }}
                className="rounded-2xl border border-waldgruen/15 bg-mehlcreme/40 py-4 font-display text-base text-waldgruen transition-all hover:border-tonwarm hover:bg-tonwarm/5 hover:-translate-y-0.5"
              >
                {t}
              </button>
            ))}
          </div>
        </Question>
      )}
    </Card>
  );
}

/* --------------------------------- Bausteine ------------------------------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl ring-1 ring-waldgruen/10 bg-white px-6 py-9 md:px-10 md:py-12 shadow-sm">
      {children}
    </div>
  );
}

function Header({
  step,
  progress,
  onBack,
}: {
  step: number;
  progress: number;
  onBack: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between text-[0.7rem] tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        <span>
          Schritt {step + 1} von {TOTAL}
        </span>
        {step > 0 && (
          <button type="button" onClick={onBack} className="hover:text-tonwarm transition-colors">
            ← zurück
          </button>
        )}
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-waldgruen/10 overflow-hidden">
        <div
          className="h-full bg-tonwarm transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}

function Question({
  prompt,
  children,
}: {
  prompt: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h3 className="mt-8 text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen">
        {prompt}
      </h3>
      <div className="mt-7">{children}</div>
    </>
  );
}

function OptionButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-waldgruen/15 bg-mehlcreme/40 px-5 py-4 text-left transition-all hover:border-tonwarm hover:bg-tonwarm/5 hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
}

/* ---------------------------------- Ergebnis ------------------------------- */

function Result({
  anlass,
  geschmack,
  personen,
  zeit,
  onRestart,
  onBack,
  onNavigate,
}: {
  anlass: Anlass;
  geschmack: string;
  personen: number;
  zeit: string;
  onRestart: () => void;
  onBack: () => void;
  onNavigate?: () => void;
}) {
  const empf = getEmpfehlung(anlass, geschmack);

  useEffect(() => {
    track("sommelier_complete", { label: anlass });
  }, [anlass]);

  return (
    <div>
      <div className="flex items-center justify-between text-[0.7rem] tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
        <span>Dein Ergebnis</span>
        <button type="button" onClick={onBack} className="hover:text-tonwarm transition-colors">
          ← zurück
        </button>
      </div>

      {/* Empfehlung */}
      <p className="mt-7 text-[0.7rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
        {empf.kind === "geheim" ? "Dein Frühstücks-Match" : "Unsere Empfehlung"}
      </p>

      {empf.kind === "geheim" ? (
        <SecretRecommendation />
      ) : (
        <div className="mt-4">
          <p className="italic text-waldgruen/70">{empf.intro}</p>
          {empf.dish && <PickRow pick={empf.dish} kicker="Zum Essen" />}
          {empf.drink && <PickRow pick={empf.drink} kicker="Dazu" />}
        </div>
      )}

      {/* Tisch */}
      <div className="mt-8 rounded-2xl bg-waldgruen text-mehlcreme px-6 py-6">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
          Dein Tisch
        </p>
        <p className="mt-2 font-display text-2xl text-mehlcreme">
          {personenLabel(personen)} · gegen {zeit} Uhr
        </p>
        <p className="mt-1 text-sm text-mehlcreme/60">
          {anlass === "fruehstueck" ? "Frühstück" : "Abends am Wochenende"}
        </p>
        <Link
          href="/reservieren"
          onClick={() => {
            track("cta_click", { label: "sommelier_tisch_sichern" });
            onNavigate?.();
          }}
          className="mt-5 inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Tisch sichern <span aria-hidden>→</span>
        </Link>
        <p className="mt-3 text-xs text-mehlcreme/50">
          Personenzahl &amp; Uhrzeit wählst du im Buchungsschritt nochmal kurz.
        </p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 text-sm text-waldgruen/60 hover:text-tonwarm transition-colors"
      >
        ← Nochmal von vorn
      </button>
    </div>
  );
}

function PickRow({ pick, kicker }: { pick: { name: string; desc: string; price: string }; kicker: string }) {
  return (
    <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-waldgruen/10 pt-4">
      <div>
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-waldgruen/40 font-medium">
          {kicker}
        </p>
        <p className="mt-1 font-display text-xl text-waldgruen">{pick.name}</p>
        {pick.desc && (
          <p className="mt-1 text-sm text-waldgruen/55 leading-snug">{pick.desc}</p>
        )}
      </div>
      <span className="font-display text-base text-tonwarm whitespace-nowrap">
        {pick.price}
      </span>
    </div>
  );
}

/** Verschwommene „noch geheim"-Empfehlung fürs Frühstück + Newsletter-Anmeldung. */
function SecretRecommendation() {
  return (
    <div className="mt-4">
      <div className="relative overflow-hidden rounded-2xl bg-mehlcreme/50 px-6 py-7">
        <div aria-hidden className="space-y-3 blur-[6px] select-none">
          <div className="h-5 w-2/3 rounded bg-waldgruen/30" />
          <div className="h-3 w-full rounded bg-waldgruen/15" />
          <div className="h-3 w-5/6 rounded bg-waldgruen/15" />
          <div className="h-3 w-1/2 rounded bg-waldgruen/15" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-waldgruen/90 text-mehlcreme text-xs tracking-[0.18em] uppercase px-4 py-1.5 font-medium">
            Noch geheim
          </span>
        </div>
      </div>
      <p className="mt-5 text-waldgruen/70 leading-relaxed">
        Unsere Frühstückskarte halten wir bis zum Start noch unter Verschluss.
        Trag dich ein — dann bist du die/der Erste, die erfährt, was bei uns auf
        den Tisch kommt.
      </p>
      <div className="mt-6">
        <LaunchSignup />
      </div>
    </div>
  );
}

function LaunchSignup() {
  const [state, formAction, pending] = useActionState(
    subscribeToLaunchList,
    NEWSLETTER_INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl bg-mehlcreme/60 px-5 py-5 text-center">
        <p className="font-display text-xl text-waldgruen">Schau in dein Postfach</p>
        <p className="mt-2 text-sm text-waldgruen/70 leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="nl-website">Bitte frei lassen</label>
        <input id="nl-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="du@beispiel.de"
          aria-label="E-Mail-Adresse"
          className="flex-1 rounded-full border border-waldgruen/20 bg-white px-5 py-3 text-waldgruen placeholder-waldgruen/35 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/20"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 bg-waldgruen hover:bg-waldgruen-dark text-mehlcreme px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {pending ? "Moment …" : "Verrat es mir"}
        </button>
      </div>

      <label className="mt-3 flex items-start gap-2.5 text-left text-xs text-waldgruen/60 leading-relaxed">
        <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0 accent-tonwarm" />
        <span>
          Ich möchte zum Frühstücks-Start benachrichtigt werden und stimme der{" "}
          <Link
            href="/datenschutz"
            className="underline decoration-waldgruen/30 underline-offset-2 hover:text-tonwarm"
          >
            Datenschutzerklärung
          </Link>{" "}
          zu. Abmeldung jederzeit möglich.
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="mt-3 text-sm text-tonwarm-dark">
          {state.message}
        </p>
      )}
    </form>
  );
}
