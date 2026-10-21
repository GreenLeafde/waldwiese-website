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
                <span className="font-display text-[1.15rem] text-tanne">
                  {o.label}
                </span>
                <span className="block text-sm text-muted-hell">{o.sub}</span>
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
                <span className="font-display text-[1.15rem] text-tanne">
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
                className={`rounded-[14px] border py-4 font-display text-xl tabular-nums transition-shadow hover:shadow-[0_0_0_2px_var(--color-akzent)] ${
                  personen === n ? "border-tanne bg-white text-tanne shadow-[0_0_0_2px_var(--color-akzent)]" : "border-tanne/20 bg-white text-tanne"
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
                className={`rounded-[14px] border py-4 font-display text-base tabular-nums transition-shadow hover:shadow-[0_0_0_2px_var(--color-akzent)] ${
                  zeit === t ? "border-tanne bg-white text-tanne shadow-[0_0_0_2px_var(--color-akzent)]" : "border-tanne/20 bg-white text-tanne"
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
    <div className="px-1 pb-2 pt-1 text-tanne md:px-3">
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
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted-hell">
        <span>
          Schritt {step + 1} von {TOTAL}
        </span>
        {step > 0 && (
          <button type="button" onClick={onBack} className="normal-case tracking-normal underline underline-offset-4 hover:text-tanne">
            ← zurück
          </button>
        )}
      </div>
      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-tanne/10">
        <div
          className="h-full bg-akzent transition-all duration-500"
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
      <h3 className="mt-7 font-display text-[1.7rem] font-light leading-tight md:text-[2rem]">
        {prompt}
      </h3>
      <div className="mt-6">{children}</div>
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
      className={`group grid gap-0.5 rounded-[14px] border px-[18px] py-3.5 text-left transition-shadow hover:shadow-[0_0_0_2px_var(--color-akzent)] ${
        selected ? "border-tanne bg-white text-tanne shadow-[0_0_0_2px_var(--color-akzent)]" : "border-tanne/20 bg-white text-tanne"
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
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted-hell">
        <span>Dein Ergebnis</span>
        <button type="button" onClick={onBack} className="normal-case tracking-normal underline underline-offset-4 hover:text-tanne">
          ← zurück
        </button>
      </div>

      {/* Empfehlung */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">
        {anlass === "fruehstueck" ? "Dein Frühstücks-Match" : "Unsere Empfehlung"}
      </p>

      <div className="mt-4">
        <p className="m-0 leading-relaxed text-muted-hell">{empf.intro}</p>
        {empf.dish && <PickRow pick={empf.dish} kicker="Zum Essen" />}
        {empf.drink && <PickRow pick={empf.drink} kicker="Dazu" />}
      </div>

      {/* Tisch */}
      <div className="mt-7 rounded-[18px] bg-tanne px-6 py-6 text-creme">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8a487]">
          Dein Tisch
        </p>
        <p className="mt-2 font-display text-[1.6rem] font-normal">
          {personenLabel(personen)} · gegen {zeit} Uhr
        </p>
        <p className="mt-1 text-sm text-creme/70">
          {anlass === "fruehstueck" ? "Frühstück" : "Abends am Wochenende"}
        </p>
        <Link
          href="/reservieren"
          onClick={() => {
            track("cta_click", { label: "sommelier_tisch_sichern" });
            onNavigate?.();
          }}
          className="mt-5 inline-flex h-[50px] items-center rounded-full bg-akzent px-[26px] font-semibold text-white transition-colors hover:bg-akzent-hover"
        >
          Tisch sichern
        </Link>
        <p className="mt-3 text-xs text-creme/60">
          Personenzahl &amp; Uhrzeit wählst du im Buchungsschritt nochmal kurz.
        </p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-5 text-sm text-muted-hell underline underline-offset-4 hover:text-tanne"
      >
        Nochmal von vorn
      </button>
    </div>
  );
}

function PickRow({ pick, kicker }: { pick: { name: string; desc: string; price: string }; kicker: string }) {
  return (
    <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-tanne/15 pt-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-hell">
          {kicker}
        </p>
        <p className="mt-1 font-display text-[1.3rem]">{pick.name}</p>
        {pick.desc && (
          <p className="mt-1 text-sm leading-snug text-muted-hell">{pick.desc}</p>
        )}
      </div>
      <span className="whitespace-nowrap tabular-nums">
        {pick.price}
      </span>
    </div>
  );
}

