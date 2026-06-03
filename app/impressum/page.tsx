import { Eyebrow } from "@/components/eyebrow";
import { LeafDivider } from "@/components/leaf-divider";
import { CONTACT, SITE } from "@/lib/site";

export const metadata = {
  title: "Impressum",
  description: "Impressum von Wald & Wiese in Sinzing bei Regensburg.",
  alternates: { canonical: "/impressum" },
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <article>
      {/* KOPF — Waldgrün, ruhig (kein Vollbild, Rechtstext bleibt lesbar) */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-5 md:px-8 pt-28 md:pt-36 pb-14 md:pb-16 reveal">
          <Eyebrow>Pflichtangaben</Eyebrow>
          <h1 className="mt-6 text-5xl md:text-6xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Impressum
          </h1>
          <LeafDivider tone="light" className="mt-10 justify-start opacity-80" />
        </div>
      </section>

      {/* RECHTSTEXT — Creme, dunkelgrüner Body */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-5 md:px-8 pt-14 md:pt-16 pb-20 text-waldgruen/75">
          <div className="space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-waldgruen">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="mt-3">
              {SITE.legalName}
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.postalCode} {CONTACT.city}
              <br />
              {CONTACT.country}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Vertreten durch</h2>
            <p className="mt-3">Sven Leber (Geschäftsführer)</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Kontakt</h2>
            <p className="mt-3">
              Telefon: {CONTACT.phone}
              <br />
              E-Mail: {CONTACT.email}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              Registereintrag
            </h2>
            <p className="mt-3">
              Eintragung im Handelsregister
              <br />
              Registergericht: Amtsgericht Regensburg
              <br />
              Registernummer: HRB 21989
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Umsatzsteuer-ID</h2>
            <p className="mt-3">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a
              Umsatzsteuergesetz:
              <br />
              DE459044362
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p className="mt-3">
              Sven Leber
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.postalCode} {CONTACT.city}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              Streitschlichtung
            </h2>
            <p className="mt-3">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tonwarm hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .
              <br />
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              Haftung für Inhalte
            </h2>
            <p className="mt-3">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
              gespeicherte fremde Informationen zu überwachen oder nach
              Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
              hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
              Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
              hiervon unberührt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              Haftung für Links
            </h2>
            <p className="mt-3">
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">Urheberrecht</h2>
            <p className="mt-3">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge
              Dritter sind als solche gekennzeichnet. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb
              der Grenzen des Urheberrechts bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
          </div>
        </div>
      </section>
    </article>
  );
}
