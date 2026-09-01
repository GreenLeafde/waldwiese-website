import {
  holeEingestempelte,
  holeMitarbeiter,
  naechsteNummer,
  stempelKonfiguriert,
  stempelProblem,
} from "@/lib/stempel";
import { MitarbeiterListe } from "@/components/admin/mitarbeiter-liste";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Team",
};

export default async function TeamStammPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">Team</h1>
        <p className="mt-2 max-w-2xl text-waldgruen/55">
          Wer stempeln darf — mit Personalnummer und Lohnart. Dieselbe Liste, die die
          bisherige Stempeluhr benutzt.
        </p>
      </div>

      {!stempelKonfiguriert() ? (
        <div className="rounded-2xl bg-white p-6 ring-1 ring-waldgruen/10">
          <p className="font-medium text-waldgruen">Noch nicht verbunden</p>
          <p className="mt-2 text-sm text-waldgruen/60">{stempelProblem()}</p>
        </div>
      ) : (
        <Inhalt />
      )}
    </div>
  );
}

async function Inhalt() {
  let mitarbeiter: Awaited<ReturnType<typeof holeMitarbeiter>> = [];
  let imDienst: string[] = [];
  let fehler = "";

  try {
    const [liste, dienst] = await Promise.all([holeMitarbeiter(), holeEingestempelte()]);
    mitarbeiter = liste;
    imDienst = dienst.map((d) => d.name);
  } catch (e) {
    fehler = e instanceof Error ? e.message : "Die Liste konnte nicht geladen werden.";
  }

  if (fehler) {
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-waldgruen/10">
        <p className="text-tonwarm-dark">{fehler}</p>
      </div>
    );
  }

  return (
    <MitarbeiterListe
      mitarbeiter={mitarbeiter}
      vorschlagNr={naechsteNummer(mitarbeiter)}
      imDienst={imDienst}
    />
  );
}
