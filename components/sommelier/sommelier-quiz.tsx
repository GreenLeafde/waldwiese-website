"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@/components/analytics";
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
                selected={anlass === o.key}
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
                selected={geschmack === o.key}
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
                aria-pressed={personen === n}
                className={`rounded-2xl border py-4 font-display text-xl transition-all hover:border-tonwarm hover:bg-tonwarm/5 hover:-translate-y-0.5 ${
                  personen === n
                    ? "border-tonwarm bg-tonwarm/10 ring-1 ring-tonwarm/30 text-tonwarm-dark"
                    : "border-waldgruen/15 bg-mehlcreme/40 text-waldgruen"
                }`}
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
                aria-pressed={zeit === t}
                className={`rounded-2xl border py-4 font-display text-base transition-all hover:border-tonwarm hover:bg-tonwarm/5 hover:-translate-y-0.5 ${
                  zeit === t
                    ? "border-tonwarm bg-tonwarm/10 ring-1 ring-tonwarm/30 text-tonwarm-dark"
                    : "border-waldgruen/15 bg-mehlcreme/40 text-waldgruen"
                }`}
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
  selected = false,
  children,
}: {
  onClick: () => void;
  selected?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group rounded-2xl border px-5 py-4 text-left transition-all hover:border-tonwarm hover:bg-tonwarm/5 hover:-translate-y-0.5 ${
        selected
          ? "border-tonwarm bg-tonwarm/10 ring-1 ring-tonwarm/30"
          : "border-waldgruen/15 bg-mehlcreme/40"
      }`}
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
        {anlass === "fruehstueck" ? "Dein Frühstücks-Match" : "Unsere Empfehlung"}
      </p>

      <div className="mt-4">
        <p className="italic text-waldgruen/70">{empf.intro}</p>
        {empf.dish && <PickRow pick={empf.dish} kicker="Zum Essen" />}
        {empf.drink && <PickRow pick={empf.drink} kicker="Dazu" />}
      </div>

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

