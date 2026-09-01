import Link from "next/link";
import { dbReachable } from "@/lib/db";
import { DbNotice } from "@/components/admin/db-notice";
import { verlauf } from "@/lib/aufgaben";
import {
  NACHWEIS_LABEL,
  SCHICHT_ZEIT,
  berlinDatum,
  datumLang,
  tagDavor,
} from "@/lib/schichten";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verlauf",
};

/** Wie viele Tage zurück gezeigt werden. */
const TAGE = 14;

export default async function VerlaufPage() {
  const heute = berlinDatum(new Date());
  let von = heute;
  for (let i = 0; i < TAGE - 1; i++) von = tagDavor(von);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-display font-normal text-waldgruen">Verlauf</h1>
          <Link
            href="/admin/aufgaben"
            className="text-sm text-waldgruen/50 underline underline-offset-2 hover:text-waldgruen"
          >
            zu den Aufgaben
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-waldgruen/55">
          Was in den letzten {TAGE} Tagen erledigt wurde — von wem, wann, und mit welchem
          Nachweis. Und was liegen geblieben ist.
        </p>
      </div>

      {!(await dbReachable()) ? (
        <DbNotice />
      ) : (
        <VerlaufListe von={von} bis={heute} />
      )}
    </div>
  );
}

async function VerlaufListe({ von, bis }: { von: string; bis: string }) {
  const schichten = await verlauf(von, bis);

  if (schichten.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-waldgruen/10">
        <p className="text-waldgruen/55">
          Noch nichts zu sehen. Sobald Aufgaben hinterlegt sind und das Team sie abhakt,
          steht hier der Rückblick.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {schichten.map((s) => {
        const z = SCHICHT_ZEIT[s.schicht];
        const gesamt = s.erledigt.length + s.offen.length;
        const vollstaendig = s.offen.length === 0;

        return (
          <section
            key={`${s.datum}-${s.schicht}`}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-waldgruen/10"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-waldgruen/8 px-5 py-3">
              <div>
                <h2 className="font-display text-lg text-waldgruen">{datumLang(s.datum)}</h2>
                <p className="text-xs uppercase tracking-wide text-tonwarm-dark">
                  {z.label} · {z.von}–{z.bis} Uhr
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium tabular-nums ${
                  vollstaendig
                    ? "bg-waldgruen text-mehlcreme"
                    : "bg-tonwarm/12 text-tonwarm-dark"
                }`}
              >
                {s.erledigt.length} von {gesamt}
              </span>
            </header>

            <ul className="divide-y divide-waldgruen/6">
              {s.erledigt.map((e, i) => (
                <li key={`${e.titel}-${i}`} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-waldgruen text-mehlcreme">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 6.4 4.6 9 10 3" />
                    </svg>
                  </span>
                  <span className="min-w-[8rem] flex-1 text-sm text-waldgruen">{e.titel}</span>

                  {e.nachweisUrl && (
                    <a
                      href={e.nachweisUrl}
                      target="_blank"
                      rel="noopener"
                      className="shrink-0 overflow-hidden rounded-lg ring-1 ring-waldgruen/15 transition-opacity hover:opacity-80"
                      title={`${NACHWEIS_LABEL[e.nachweis]} ansehen`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={e.nachweisUrl}
                        alt={`${NACHWEIS_LABEL[e.nachweis]} zu „${e.titel}"`}
                        className="h-12 w-16 bg-white object-cover"
                        loading="lazy"
                      />
                    </a>
                  )}

                  <span className="shrink-0 text-xs tabular-nums text-waldgruen/45">
                    {e.von ?? "unbekannt"} · {e.um}
                  </span>
                </li>
              ))}

              {s.offen.map((titel) => (
                <li
                  key={titel}
                  className="flex items-center gap-3 bg-tonwarm/6 px-5 py-3"
                >
                  <span className="h-5 w-5 shrink-0 rounded border border-tonwarm/40" />
                  <span className="flex-1 text-sm text-waldgruen/60">{titel}</span>
                  <span className="shrink-0 text-xs text-tonwarm-dark">offen geblieben</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
