import Link from "next/link";
import { CONTACT, SITE } from "@/lib/site";

export const dynamic = "force-static";

export const metadata = {
  title: "Was gespeichert wird",
  robots: { index: false, follow: false },
};

/**
 * Information für die Beschäftigten nach Art. 13 DSGVO.
 *
 * Bewusst eine eigene Seite und nicht nur ein Absatz in der
 * Datenschutzerklärung: Die richtet sich an Website-Besucher, diese hier an
 * das Team — und sie muss dort erreichbar sein, wo gearbeitet wird. Deshalb
 * ist sie vom Schichtzettel aus verlinkt.
 *
 * Sprache: so knapp und klar wie möglich. Wer nach der Schicht draufschaut,
 * soll es in zwei Minuten verstehen, nicht in zwanzig.
 */
export default function SchichtDatenschutzPage() {
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
            Zurück
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="font-display text-3xl leading-tight text-waldgruen">
          Was hier gespeichert wird
        </h1>
        <p className="mt-3 text-waldgruen/70">
          Kurz und ehrlich: Diese Seite erfasst deine Arbeitszeit und was du in deiner
          Schicht erledigt hast. Hier steht, was davon gespeichert wird, warum, wie lange
          — und welche Rechte du hast.
        </p>

        <div className="mt-8 space-y-7 text-[15px] leading-relaxed text-waldgruen/75">
          <section>
            <h2 className="font-display text-xl text-waldgruen">Was gespeichert wird</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Dein Name und deine Personalnummer.</li>
              <li>Wann du deine Schicht startest und beendest.</li>
              <li>
                Welche Aufgaben du abgehakt hast — mit deinem Namen und der Uhrzeit.
              </li>
              <li>
                Bei einzelnen Aufgaben ein Foto oder deine Unterschrift, wenn die Aufgabe
                das verlangt.
              </li>
              <li>Kommentare, die du freiwillig zu einer Aufgabe schreibst.</li>
            </ul>
            <p className="mt-3">
              Fotos sollen die Sache zeigen, um die es geht — die Temperaturanzeige, die
              gereinigte Fläche. Personen gehören nicht darauf.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Wofür</h2>
            <p className="mt-3">
              Die Arbeitszeit brauchen wir für deine Lohnabrechnung, und wir sind
              gesetzlich verpflichtet, sie aufzuzeichnen (§ 16 Abs. 2 Arbeitszeitgesetz).
              Die Aufgabenliste sorgt dafür, dass im Betrieb klar ist, was ansteht, und
              dass wir Hygiene- und Kontrollschritte belegen können.
            </p>
            <p className="mt-3">
              <strong className="font-medium text-waldgruen">
                Was wir damit nicht tun:
              </strong>{" "}
              Wir werten nicht aus, wer wie schnell ist oder wer wie viel abhakt. Wenn
              etwas liegen bleibt, ist das kein Vorwurf — dafür gibt es die Übergabe an
              die nächste Schicht.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Wie lange</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Fotos: 90 Tage, danach werden sie automatisch gelöscht.</li>
              <li>Unterschriften: zwei Jahre.</li>
              <li>
                Arbeitszeiten: mindestens zwei Jahre, wie gesetzlich vorgeschrieben — und
                so lange, wie die Aufbewahrungsfristen für Lohnunterlagen es verlangen.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Wer das sieht</h2>
            <p className="mt-3">
              Die Geschäftsleitung und die Stelle, die unsere Löhne abrechnet. Innerhalb
              der Schicht sehen deine Kolleginnen und Kollegen, welche Aufgaben erledigt
              sind und von wem — das gehört zur Übergabe. Nach außen gehen diese Daten
              nicht.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Deine Rechte</h2>
            <p className="mt-3">
              Du kannst jederzeit erfahren, welche Daten wir über dich gespeichert haben
              (Art. 15 DSGVO), Falsches berichtigen lassen (Art. 16), Löschung verlangen
              (Art. 17), die Verarbeitung einschränken lassen (Art. 18), deine Daten in
              einem gängigen Format bekommen (Art. 20) und der Verarbeitung widersprechen
              (Art. 21). Außerdem kannst du dich bei der Datenschutz-Aufsichtsbehörde
              beschweren.
            </p>
            <p className="mt-3">
              Sprich uns einfach an oder schreib an{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="underline underline-offset-2 hover:text-waldgruen"
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Verantwortlich</h2>
            <p className="mt-3">
              {SITE.legalName}
              <br />
              Sven Leber
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.postalCode} {CONTACT.city}
              <br />
              {CONTACT.phone}
            </p>
          </section>
        </div>

        <p className="mt-10 text-sm text-waldgruen/45">
          Die ausführliche Fassung steht in der{" "}
          <Link href="/datenschutz" className="underline underline-offset-2">
            Datenschutzerklärung
          </Link>{" "}
          unter Punkt 14.
        </p>
      </main>
    </div>
  );
}
