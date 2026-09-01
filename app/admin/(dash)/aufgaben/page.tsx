import Link from "next/link";
import { dbReachable } from "@/lib/db";
import { DbNotice } from "@/components/admin/db-notice";
import { AufgabeForm } from "@/components/admin/aufgabe-form";
import { stilllegenAction, verschiebeAction } from "@/app/actions/aufgaben";
import {
  anzahlProSchicht,
  getAufgabe,
  listAufgaben,
  type Aufgabe,
} from "@/lib/aufgaben";
import {
  NACHWEIS_LABEL,
  SCHICHT_KURZ,
  SCHICHT_ZEIT,
  WOCHENTAGE,
  hatSpaetschicht,
  schichtenText,
  slotKey,
} from "@/lib/schichten";

export const metadata = {
  title: "Aufgaben",
};

function Ueberschrift() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-display font-normal text-waldgruen">Aufgaben</h1>
        <Link
          href="/admin/aufgaben/verlauf"
          className="text-sm text-waldgruen/50 underline underline-offset-2 hover:text-waldgruen"
        >
          Verlauf ansehen
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-waldgruen/55">
        Was in welcher Schicht zu tun ist. Das Team sieht beim Schichtbeginn genau die
        Punkte, die hier auf der jeweiligen Schicht liegen.
      </p>
    </div>
  );
}

/** Zehn Kacheln — leere Schichten sollen sofort auffallen. */
function Wochenraster({ anzahl }: { anzahl: Map<string, number> }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="grid min-w-[38rem] grid-cols-7 gap-2">
        {WOCHENTAGE.map((tag) => (
          <div key={tag.wert} className="space-y-2">
            <p className="text-center text-xs font-medium text-waldgruen/50">{tag.kurz}</p>

            {(["frueh", "spaet"] as const).map((schicht) => {
              if (schicht === "spaet" && !hatSpaetschicht(tag.wert)) {
                return (
                  <div
                    key={schicht}
                    className="rounded-xl border border-dashed border-waldgruen/12 px-2 py-4 text-center text-xs text-waldgruen/25"
                  >
                    —
                  </div>
                );
              }
              const n = anzahl.get(slotKey({ wochentag: tag.wert, schicht })) ?? 0;
              const leer = n === 0;
              return (
                <div
                  key={schicht}
                  className={`rounded-xl px-2 py-4 text-center ${
                    leer
                      ? "border border-dashed border-tonwarm/40 bg-tonwarm/5"
                      : "bg-waldgruen text-mehlcreme"
                  }`}
                >
                  <p
                    className={`font-display text-2xl ${
                      leer ? "text-tonwarm-dark" : "text-mehlcreme"
                    }`}
                  >
                    {leer ? "0" : n}
                  </p>
                  <p
                    className={`mt-0.5 text-[11px] ${
                      leer ? "text-tonwarm-dark/70" : "text-mehlcreme/60"
                    }`}
                  >
                    {SCHICHT_KURZ[schicht]}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function AufgabeZeile({
  aufgabe,
  erste,
  letzte,
}: {
  aufgabe: Aufgabe;
  erste: boolean;
  letzte: boolean;
}) {
  const slots = aufgabe.schichten;

  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-2 px-5 py-4">
      {/* Reihenfolge */}
      {aufgabe.aktiv && (
        <div className="flex flex-col gap-0.5 pt-0.5">
          {(
            [
              ["hoch", "↑", erste],
              ["runter", "↓", letzte],
            ] as const
          ).map(([richtung, zeichen, gesperrt]) => (
            <form key={richtung} action={verschiebeAction}>
              <input type="hidden" name="id" value={aufgabe.id} />
              <input type="hidden" name="richtung" value={richtung} />
              <button
                type="submit"
                disabled={gesperrt}
                aria-label={richtung === "hoch" ? "Nach oben" : "Nach unten"}
                className="px-1 text-xs leading-none text-waldgruen/35 transition-colors hover:text-waldgruen disabled:opacity-20 disabled:hover:text-waldgruen/35"
              >
                {zeichen}
              </button>
            </form>
          ))}
        </div>
      )}

      <div className="min-w-[14rem] flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-waldgruen">{aufgabe.titel}</span>
          {aufgabe.nachweis !== "keiner" && (
            <span className="rounded-full border border-tonwarm/40 px-2 py-0.5 text-[11px] uppercase tracking-wide text-tonwarm-dark">
              {NACHWEIS_LABEL[aufgabe.nachweis]}
            </span>
          )}
          {aufgabe.bereich && (
            <span className="rounded-full bg-waldgruen/8 px-2 py-0.5 text-[11px] text-waldgruen/60">
              {aufgabe.bereich}
            </span>
          )}
        </div>

        {aufgabe.beschreibung && (
          <p className="mt-1 line-clamp-2 text-sm text-waldgruen/55">{aufgabe.beschreibung}</p>
        )}

        <p className="mt-1.5 text-xs text-waldgruen/45">
          {aufgabe.rhythmus === "einmalig"
            ? `Einmalig am ${aufgabe.datum ?? "?"}${
                slots[0] ? ` · ${SCHICHT_ZEIT[slots[0].schicht].label}` : ""
              }`
            : schichtenText(slots)}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-0.5">
        <Link
          href={`/admin/aufgaben?bearbeiten=${aufgabe.id}#formular`}
          className="text-sm text-waldgruen/55 transition-colors hover:text-waldgruen"
        >
          Bearbeiten
        </Link>
        <form action={stilllegenAction}>
          <input type="hidden" name="id" value={aufgabe.id} />
          <input type="hidden" name="aktiv" value={aufgabe.aktiv ? "0" : "1"} />
          <button
            type="submit"
            className="text-sm text-waldgruen/40 transition-colors hover:text-tonwarm-dark"
          >
            {aufgabe.aktiv ? "Stilllegen" : "Wieder aufnehmen"}
          </button>
        </form>
      </div>
    </li>
  );
}

export default async function AufgabenPage({
  searchParams,
}: {
  searchParams: Promise<{ bearbeiten?: string }>;
}) {
  if (!(await dbReachable())) {
    return (
      <div>
        <Ueberschrift />
        <div className="mt-6">
          <DbNotice />
        </div>
      </div>
    );
  }

  const { bearbeiten } = await searchParams;

  const [aktive, alle, anzahl, entwurf] = await Promise.all([
    listAufgaben(true),
    listAufgaben(false),
    anzahlProSchicht(),
    bearbeiten ? getAufgabe(bearbeiten) : Promise.resolve(null),
  ]);

  const stillgelegt = alle.filter((a) => !a.aktiv);

  return (
    <div className="space-y-10">
      <Ueberschrift />

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-waldgruen/45">
          Die Woche im Überblick
        </h2>
        <Wochenraster anzahl={anzahl} />
        <p className="text-xs text-waldgruen/45">
          Früh {SCHICHT_ZEIT.frueh.von}–{SCHICHT_ZEIT.frueh.bis} Uhr, spät{" "}
          {SCHICHT_ZEIT.spaet.von}–{SCHICHT_ZEIT.spaet.bis} Uhr. Einmalige Aufgaben sind
          hier nicht mitgezählt.
        </p>
      </section>

      <section id="formular" className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-waldgruen/45">
          {entwurf ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
        </h2>
        <div className="max-w-2xl rounded-2xl bg-white p-6 ring-1 ring-waldgruen/10">
          {bearbeiten && !entwurf ? (
            <p className="text-sm text-tonwarm-dark">
              Diese Aufgabe gibt es nicht mehr.{" "}
              <Link href="/admin/aufgaben" className="underline">
                Zurück zur Liste
              </Link>
            </p>
          ) : (
            <AufgabeForm
              key={entwurf?.id ?? "neu"}
              werte={
                entwurf
                  ? {
                      id: entwurf.id,
                      titel: entwurf.titel,
                      beschreibung: entwurf.beschreibung,
                      bereich: entwurf.bereich,
                      nachweis: entwurf.nachweis,
                      rhythmus: entwurf.rhythmus,
                      datum: entwurf.datum,
                      schichten: entwurf.schichten,
                    }
                  : undefined
              }
            />
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-waldgruen/45">
          Alle Aufgaben ({aktive.length})
        </h2>

        {aktive.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-waldgruen/10">
            <p className="text-waldgruen/55">
              Noch nichts angelegt. Trag oben die erste Aufgabe ein.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-waldgruen/8 overflow-hidden rounded-2xl bg-white ring-1 ring-waldgruen/10">
            {aktive.map((a, i) => (
              <AufgabeZeile
                key={a.id}
                aufgabe={a}
                erste={i === 0}
                letzte={i === aktive.length - 1}
              />
            ))}
          </ul>
        )}
      </section>

      {stillgelegt.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-waldgruen/45">
            Stillgelegt ({stillgelegt.length})
          </h2>
          <p className="max-w-2xl text-sm text-waldgruen/50">
            Taucht in keiner Schicht mehr auf. Nicht gelöscht, damit der Verlauf lesbar
            bleibt — jederzeit wieder aufnehmbar.
          </p>
          <ul className="divide-y divide-waldgruen/8 overflow-hidden rounded-2xl bg-white/60 opacity-70 ring-1 ring-waldgruen/10">
            {stillgelegt.map((a) => (
              <AufgabeZeile key={a.id} aufgabe={a} erste letzte />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
