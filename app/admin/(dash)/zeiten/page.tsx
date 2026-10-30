import Link from "next/link";
import { holeEingestempelte, stempelKonfiguriert, stempelProblem } from "@/lib/stempel";
import {
  alsAbrechnungsname,
  alsDeutschesDatum,
  imZeitraum,
  ladeZeiten,
  laufendeAbrechnung,
  letzteAbrechnung,
  werteAus,
  type Zeitraum,
} from "@/lib/zeiten";
import { ZeitraumWahl } from "@/components/admin/zeitraum-wahl";
import { StundenMailKarte } from "@/components/admin/stunden-mail-karte";
import {
  mailKonfiguriert,
  schonGesendet,
  stundenEmpfaenger,
} from "@/lib/stunden-mail";
import { EintragLoeschen } from "@/components/admin/eintrag-loeschen";
import { EintragBearbeiten, StempelungBeenden } from "@/components/admin/eintrag-bearbeiten";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Zeiten",
};

function Ueberschrift() {
  return (
    <div>
      <h1 className="text-3xl font-display font-normal text-waldgruen">Zeiten</h1>
      <p className="mt-2 max-w-2xl text-waldgruen/55">
        Die Arbeitszeiten aus der Stempeluhr. Alle Stunden stehen dezimal, 7,50 sind
        also 7 Stunden 30 Minuten.
      </p>
    </div>
  );
}

/** Heute als "YYYY-MM-DD" in Berliner Zeit. */
function heute(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
}

export default async function ZeitenPage({
  searchParams,
}: {
  searchParams: Promise<{ art?: string; wert?: string }>;
}) {
  const p = await searchParams;

  if (!stempelKonfiguriert()) {
    return (
      <div className="space-y-6">
        <Ueberschrift />
        <div className="rounded-2xl bg-white p-6 ring-1 ring-waldgruen/10">
          <p className="font-medium text-waldgruen">Noch nicht verbunden</p>
          <p className="mt-2 text-sm text-waldgruen/60">{stempelProblem()}</p>
        </div>
      </div>
    );
  }

  // Die Abrechnung läuft vom 25. bis zum 24., darum ist sie die Voreinstellung.
  const art: "abrechnung" | "monat" | "tag" =
    p.art === "tag" || p.art === "monat" ? p.art : "abrechnung";
  const roh = (p.wert ?? "").trim();
  const passt =
    art === "tag" ? /^\d{4}-\d{2}-\d{2}$/.test(roh) : /^\d{4}-\d{2}$/.test(roh);
  const wert = passt
    ? roh
    : art === "tag"
      ? heute()
      : art === "monat"
        ? heute().slice(0, 7)
        : laufendeAbrechnung(heute());

  const zeitraum = { art, wert } as Zeitraum;

  let auswertung: ReturnType<typeof werteAus> | null = null;
  let offen: Awaited<ReturnType<typeof holeEingestempelte>> = [];
  let fehler = "";
  try {
    const [{ eintraege, mitarbeiter }, imDienst] = await Promise.all([
      ladeZeiten(),
      holeEingestempelte(),
    ]);
    auswertung = werteAus(eintraege, mitarbeiter, zeitraum);
    offen = imDienst.filter((e) => imZeitraum(e.datum, zeitraum));
  } catch (e) {
    fehler = e instanceof Error ? e.message : "Zeiten konnten nicht geladen werden.";
  }

  if (fehler || !auswertung) {
    return (
      <div className="space-y-6">
        <Ueberschrift />
        <div className="rounded-2xl bg-white p-6 ring-1 ring-waldgruen/10">
          <p className="text-tonwarm-dark">{fehler}</p>
        </div>
      </div>
    );
  }

  const leer = auswertung.eintraege.length === 0;

  // Die Monatsmail bezieht sich immer auf die zuletzt abgeschlossene Abrechnung,
  // unabhaengig davon, welchen Zeitraum man sich hier gerade ansieht.
  const monatFuerMail = letzteAbrechnung(heute());
  const mailRaus = await schonGesendet(monatFuerMail).catch(() => false);
  const mailStand =
    art === "abrechnung" && wert === monatFuerMail
      ? { anzahl: auswertung.eintraege.length, gesamt: auswertung.gesamt }
      : await (async () => {
          try {
            const { eintraege, mitarbeiter } = await ladeZeiten();
            const m = werteAus(eintraege, mitarbeiter, {
              art: "abrechnung",
              wert: monatFuerMail,
            });
            return { anzahl: m.eintraege.length, gesamt: m.gesamt };
          } catch {
            return { anzahl: 0, gesamt: "0,00" };
          }
        })();

  return (
    <div className="space-y-8">
      <Ueberschrift />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <ZeitraumWahl art={art} wert={wert} />
          {art === "abrechnung" && (
            <p className="mt-2 text-sm tabular-nums text-waldgruen/60">
              {alsAbrechnungsname(wert)}
            </p>
          )}
        </div>
        <a
          href={`/admin/zeiten/csv?art=${art}&wert=${wert}`}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            leer
              ? "pointer-events-none bg-waldgruen/10 text-waldgruen/35"
              : "bg-tonwarm text-white hover:bg-tonwarm-dark"
          }`}
        >
          CSV herunterladen
        </a>
      </div>

      {offen.length > 0 && (
        <div className="rounded-2xl bg-tonwarm/8 px-5 py-4 text-sm text-tonwarm-dark">
          <p className="font-medium">Noch nicht ausgestempelt</p>
          <ul className="mt-2 space-y-1">
            {offen.map((o) => (
              <li key={o.name} className="flex flex-wrap items-center gap-x-3">
                <span>
                  {o.name} ({alsDeutschesDatum(o.datum)} seit {o.seit})
                </span>
                <StempelungBeenden name={o.name} datum={alsDeutschesDatum(o.datum)} seit={o.seit} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-tonwarm-dark/70">
            Diese Zeiten sind noch in keiner Summe enthalten.
          </p>
        </div>
      )}

      {/* Summen */}
      {auswertung.summen.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {auswertung.summen.map((s) => (
            <div
              key={s.name}
              className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-waldgruen/10"
            >
              <span className="text-waldgruen/55">{s.name}: </span>
              <span className="font-medium tabular-nums text-waldgruen">{s.stunden} h</span>
            </div>
          ))}
          <div className="rounded-full bg-waldgruen px-4 py-2 text-sm text-mehlcreme">
            <span className="text-mehlcreme/60">Gesamt: </span>
            <span className="font-medium tabular-nums">{auswertung.gesamt} h</span>
          </div>
        </div>
      )}

      {leer ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-waldgruen/10">
          <p className="text-waldgruen/55">Keine Einträge für {auswertung.bezeichnung}.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-waldgruen/10">
          <table className="w-full min-w-[38rem] text-sm">
            <thead>
              <tr className="border-b border-waldgruen/10 text-left">
                {["Datum", "Name", "Nr.", "Lohnart", "Start", "Ende", "Stunden", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-waldgruen/40"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {auswertung.eintraege.map((e) => (
                <tr key={e.id} className="border-b border-waldgruen/6 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-waldgruen/60">
                    {alsDeutschesDatum(e.date)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: e.color || "#888" }}
                      />
                      <span className="text-waldgruen">{e.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-waldgruen/60">{e.nr}</td>
                  <td className="px-4 py-2.5 tabular-nums text-waldgruen/60">{e.lohnart}</td>
                  <td className="px-4 py-2.5 tabular-nums text-waldgruen/60">{e.start}</td>
                  <td className="px-4 py-2.5 tabular-nums text-waldgruen/60">{e.end}</td>
                  <td className="px-4 py-2.5 font-medium tabular-nums text-waldgruen">
                    {e.stunden}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right">
                    <EintragBearbeiten
                      id={e.id}
                      name={e.name}
                      date={e.date}
                      start={e.start}
                      end={e.end}
                    />
                    <EintragLoeschen
                      id={e.id}
                      name={e.name}
                      datum={alsDeutschesDatum(e.date)}
                      von={e.start}
                      bis={e.end}
                      stunden={e.stunden}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StundenMailKarte
        monat={monatFuerMail}
        monatName={alsAbrechnungsname(monatFuerMail)}
        empfaenger={stundenEmpfaenger()}
        schonGesendet={mailRaus}
        konfiguriert={mailKonfiguriert()}
        anzahlEintraege={mailStand.anzahl}
        gesamt={mailStand.gesamt}
      />

      <p className="text-xs text-waldgruen/40">
        Dieselben Buchungen wie in der bisherigen App (dort aber in Stunden:Minuten) —{" "}
        <Link
          href="https://zeiterfassung-waldwiese.vercel.app"
          target="_blank"
          className="underline hover:text-waldgruen"
        >
          dort
        </Link>{" "}
        steht unverändert dasselbe.
      </p>
    </div>
  );
}
