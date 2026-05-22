import { Eyebrow } from "@/components/eyebrow";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { CONTACT, SITE } from "@/lib/site";

export const metadata = {
  title: "Impressum",
  description: "Impressum von Wald & Wiese in Sinzing bei Regensburg.",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <article className="bg-mehlcreme">
      <div className="mx-auto max-w-3xl px-5 md:px-8 pt-12 md:pt-20 pb-20">
        <Eyebrow>Pflichtangaben</Eyebrow>
        <h1 className="mt-6 text-5xl md:text-6xl font-display leading-[0.95]">
          Impressum
        </h1>

        <PlaceholderNotice title="Volltext durch Familie Leber prüfen">
          Die folgenden Angaben sind aus den bestätigten Stammdaten
          zusammengestellt. Bitte ergänzen: Geschäftsführer, Handelsregister
          (Amtsgericht / HRB-Nummer), USt-IdNr., Verantwortliche/r i. S. d.
          § 18 Abs. 2 MStV. Erst danach freigeben.
        </PlaceholderNotice>

        <div className="mt-10 space-y-8 text-base leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-tonwarm">
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
            <h2 className="font-display text-xl text-tonwarm">Vertreten durch</h2>
            <p className="mt-3 text-waldgruen/60 italic">[Geschäftsführer ergänzen]</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">Kontakt</h2>
            <p className="mt-3">
              Telefon: {CONTACT.phone}
              <br />
              E-Mail: {CONTACT.email}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              Registereintrag
            </h2>
            <p className="mt-3 text-waldgruen/60 italic">
              [Eintragung im Handelsregister · Registergericht · Registernummer
              ergänzen]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">Umsatzsteuer-ID</h2>
            <p className="mt-3 text-waldgruen/60 italic">
              [USt-IdNr. nach § 27 a UStG ergänzen]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p className="mt-3 text-waldgruen/60 italic">
              [Name + Anschrift der verantwortlichen Person ergänzen]
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
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
        </div>
      </div>
    </article>
  );
}
