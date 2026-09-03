import Link from "next/link";
import {
  aufgabenFuerSchicht,
  kommentareZuMehreren,
  offeneUebertraege,
  type Kommentar,
} from "@/lib/aufgaben";
import { dbReachable } from "@/lib/db";
import {
  SCHICHT_ZEIT,
  aktuelleSchicht,
  berlinDatum,
  datumLang,
  hatSpaetschicht,
  tagDanach,
  tagDavor,
  wochentagVonDatum,
  type Schicht,
} from "@/lib/schichten";
import { SchichtBereich } from "@/components/schicht/schicht-bereich";
import {
  holeEingestempelte,
  holeMitarbeiter,
  stempelKonfiguriert,
  stempelProblem,
} from "@/lib/stempel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Schichtzettel",
  robots: { index: false, follow: false },
};

const DATUM_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Reiter zwischen Früh und Spät — nur wo es beide gibt. */
function SchichtWahl({
  datum,
  aktiv,
}: {
  datum: string;
  aktiv: Schicht;
}) {
  const tag = wochentagVonDatum(datum);
  if (!tag || !hatSpaetschicht(tag)) return null;

  return (
    <div className="flex gap-1 rounded-full bg-waldgruen/8 p-1">
      {(["frueh", "spaet"] as const).map((s) => (
        <Link
          key={s}
          href={`/schicht?datum=${datum}&schicht=${s}`}
          scroll={false}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            aktiv === s
              ? "bg-waldgruen font-medium text-mehlcreme"
              : "text-waldgruen/60 hover:text-waldgruen"
          }`}
        >
          {s === "frueh" ? "Früh" : "Spät"}
        </Link>
      ))}
    </div>
  );
}

export default async function SchichtPage({
  searchParams,
}: {
  searchParams: Promise<{ datum?: string; schicht?: string }>;
}) {
  const p = await searchParams;
  const jetzt = aktuelleSchicht(new Date());

  // Vorgaben aus der Adresse, sonst die laufende Schicht.
  const gewaehltesDatum =
    p.datum && DATUM_RE.test(p.datum) && wochentagVonDatum(p.datum) ? p.datum : jetzt.datum;
  const tag = wochentagVonDatum(gewaehltesDatum);
  let schicht: Schicht =
    p.schicht === "frueh" || p.schicht === "spaet" ? p.schicht : jetzt.schicht;
  // An Tagen ohne Spätschicht gibt es nur die eine.
  if (schicht === "spaet" && tag && !hatSpaetschicht(tag)) schicht = "frueh";

  const heute = berlinDatum(new Date());

  if (!(await dbReachable())) {
    return (
      <Rahmen datum={gewaehltesDatum} schicht={schicht} heute={heute}>
        <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-waldgruen/10">
          <p className="text-waldgruen/60">
            Die Aufgabenliste ist gerade nicht erreichbar. Bitte gleich noch einmal
            versuchen.
          </p>
        </div>
      </Rahmen>
    );
  }

  // Ohne Anschluss an die Zeiterfassung gibt es keine Anmeldung — und ohne
  // Anmeldung bewusst auch keine Aufgabenliste.
  if (!stempelKonfiguriert()) {
    return (
      <Rahmen datum={gewaehltesDatum} schicht={schicht} heute={heute}>
        <div className="rounded-2xl bg-white px-6 py-10 ring-1 ring-waldgruen/10">
          <p className="font-display text-xl text-waldgruen">Noch nicht verbunden</p>
          <p className="mt-2 text-sm text-waldgruen/60">
            Die Schichtansicht meldet über die Zeiterfassung an. {stempelProblem()}
          </p>
        </div>
      </Rahmen>
    );
  }

  const [aufgaben, uebertrag, mitarbeiter, imDienst] = await Promise.all([
    aufgabenFuerSchicht(gewaehltesDatum, schicht),
    offeneUebertraege(gewaehltesDatum, schicht),
    holeMitarbeiter(),
    holeEingestempelte(),
  ]);
  const kommentarMap = await kommentareZuMehreren(
    [...aufgaben, ...uebertrag].map((a) => a.id),
  );

  // Map laesst sich nicht an eine Client-Komponente uebergeben.
  const kommentare: Record<string, Kommentar[]> = {};
  for (const [id, liste] of kommentarMap) kommentare[id] = liste;

  return (
    <Rahmen datum={gewaehltesDatum} schicht={schicht} heute={heute}>
      <SchichtBereich
        key={`${gewaehltesDatum}-${schicht}`}
        datum={gewaehltesDatum}
        schicht={schicht}
        aufgaben={aufgaben}
        uebertrag={uebertrag}
        kommentare={kommentare}
        mitarbeiter={mitarbeiter.map((m) => m.name)}
        imDienst={imDienst}
        istHeute={gewaehltesDatum === heute}
      />
    </Rahmen>
  );
}

function Rahmen({
  datum,
  schicht,
  heute,
  children,
}: {
  datum: string;
  schicht: Schicht;
  heute: string;
  children: React.ReactNode;
}) {
  const z = SCHICHT_ZEIT[schicht];
  const istHeute = datum === heute;

  return (
    <div className="min-h-svh bg-stone-soft">
      <header className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-4">
          <span className="font-display text-lg">
            Wald &amp; Wiese
            <span className="text-tonwarm"> · Schicht</span>
          </span>
          <Link
            href="/schicht"
            className="text-xs text-mehlcreme/50 transition-colors hover:text-tonwarm"
          >
            {istHeute ? "Jetzt" : "Zu heute"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl leading-tight text-waldgruen">
              {datumLang(datum)}
            </h1>
            <p className="mt-0.5 text-sm font-medium uppercase tracking-wide text-tonwarm-dark">
              {z.label} · {z.von}–{z.bis} Uhr
            </p>
          </div>
          <SchichtWahl datum={datum} aktiv={schicht} />
        </div>

        {!istHeute && (
          <p className="mb-4 rounded-xl bg-tonwarm/8 px-4 py-2.5 text-sm text-tonwarm-dark">
            Du siehst {datum < heute ? "einen vergangenen" : "einen kommenden"} Tag.
          </p>
        )}

        {children}

        {/* Nachbartage — fuer das Nachtragen am Morgen danach */}
        <nav className="mt-8 flex justify-between text-sm text-waldgruen/45">
          <Link href={`/schicht?datum=${tagDavor(datum)}`} className="hover:text-waldgruen">
            ← {datumLang(tagDavor(datum)).split(",")[0]}
          </Link>
          <Link href={`/schicht?datum=${tagDanach(datum)}`} className="hover:text-waldgruen">
            {datumLang(tagDanach(datum)).split(",")[0]} →
          </Link>
        </nav>

        {/* Pflichtinformation nach Art. 13 DSGVO — muss dort erreichbar sein,
            wo die Daten erhoben werden. */}
        <p className="mt-10 text-center text-xs text-waldgruen/40">
          <Link
            href="/schicht/datenschutz"
            className="underline underline-offset-2 hover:text-waldgruen"
          >
            Was hier gespeichert wird
          </Link>
        </p>
      </main>
    </div>
  );
}
