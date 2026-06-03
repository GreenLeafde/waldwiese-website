import { Eyebrow } from "@/components/eyebrow";
import { CONTACT, SITE } from "@/lib/site";

export const metadata = {
  title: "AGB",
  description:
    "Allgemeine Geschäftsbedingungen — Wald & Wiese, Sinzing bei Regensburg.",
  alternates: { canonical: "/agb" },
  robots: { index: false },
};

// Hinweis fürs Team: Die Veranstaltungs-, Storno- und Gutscheinregeln sind
// vom Betreiber bestätigt (Stand 2026-06). Vor Launch empfiehlt sich ein
// kurzer anwaltlicher Check der Zahlungs- und Stornoklauseln (AGB-Recht).

export default function AgbPage() {
  return (
    <article className="bg-mehlcreme">
      <div className="mx-auto max-w-3xl px-5 md:px-8 pt-12 md:pt-20 pb-20">
        <Eyebrow>Pflichtangaben</Eyebrow>
        <h1 className="mt-6 text-5xl md:text-6xl font-display leading-[0.95]">
          AGB
        </h1>
        <p className="mt-4 text-sm text-waldgruen/60">
          Allgemeine Geschäftsbedingungen der {SITE.legalName}
        </p>

        <div className="mt-10 space-y-10 text-base leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-tonwarm">
              § 1 Geltungsbereich &amp; Anbieter
            </h2>
            <p className="mt-3">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für
              Tischreservierungen, die Buchung von Veranstaltungen sowie den
              Erwerb von Gutscheinen bei der {SITE.legalName},{" "}
              {CONTACT.street}, {CONTACT.postalCode} {CONTACT.city}{" "}
              (nachfolgend „Wald &amp; Wiese"). Abweichende Bedingungen des
              Gastes werden nur dann Vertragsbestandteil, wenn Wald &amp; Wiese
              ihnen ausdrücklich schriftlich zustimmt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              § 2 Tischreservierungen
            </h2>
            <p className="mt-3">
              Tischreservierungen sind kostenfrei. Für nicht wahrgenommene
              Reservierungen (No-Show) oder kurzfristige Absagen erheben wir
              keine Gebühr. Wir bitten dich jedoch, eine Reservierung, die du
              nicht wahrnehmen kannst, rechtzeitig telefonisch oder per E-Mail
              abzusagen, damit wir den Tisch anderweitig vergeben können.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              § 3 Veranstaltungen (Hochzeiten, Feiern &amp; Gruppen)
            </h2>
            <div className="mt-3 space-y-3">
              <p>
                <strong className="font-medium">Vertragsschluss.</strong> Für
                Veranstaltungen erstellen wir auf Anfrage ein individuelles
                Angebot. Der Vertrag kommt mit der schriftlichen
                Buchungsbestätigung durch Wald &amp; Wiese zustande. Die
                Einzelheiten (Menü, Personenzahl, Ablauf, Preise) werden
                individuell und vertraglich geregelt.
              </p>
              <p>
                <strong className="font-medium">
                  Mindestumsatz bei Hochzeiten.
                </strong>{" "}
                Bei Hochzeiten gilt ein Mindestumsatz von 3.000 € je Tag, an
                dem die Räumlichkeiten exklusiv für die Veranstaltung reserviert
                (gesperrt) werden. Wird ausschließlich der Abend gebucht, gilt
                dies als ein Tag. Müssen für Auf- und Abbau oder mehrtägige
                Feiern weitere Tage gesperrt werden, erhöht sich der
                Mindestumsatz entsprechend je zusätzlich gesperrtem Tag.
              </p>
              <p>
                <strong className="font-medium">Anzahlung.</strong> Mit der
                Buchungsbestätigung wird eine Anzahlung in Höhe von 50 % des
                voraussichtlichen Gesamtbetrags fällig. Der Restbetrag wird
                individuell und vertraglich vereinbart und nach der
                Veranstaltung abgerechnet.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              § 4 Storno &amp; Rücktritt bei Veranstaltungen
            </h2>
            <p className="mt-3">
              Tritt der Gast von einer bestätigten Veranstaltung zurück, gelten
              folgende Stornobedingungen, gestaffelt nach dem Zeitpunkt des
              Eingangs der Stornierung vor dem Veranstaltungstermin:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3">
                <span aria-hidden className="text-tonwarm">
                  •
                </span>
                <span>
                  <strong className="font-medium">
                    Früher als 12 Monate vor dem Termin:
                  </strong>{" "}
                  Es wird lediglich eine Bearbeitungspauschale von 300 € für den
                  bereits entstandenen Aufwand berechnet.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-tonwarm">
                  •
                </span>
                <span>
                  <strong className="font-medium">
                    Ab 12 Monate bis 2 Wochen vor dem Termin:
                  </strong>{" "}
                  Die geleistete Anzahlung (50 %) wird einbehalten.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="text-tonwarm">
                  •
                </span>
                <span>
                  <strong className="font-medium">
                    Innerhalb der letzten 2 Wochen vor dem Termin:
                  </strong>{" "}
                  Es werden 80 % des vereinbarten Gesamtbetrags berechnet.
                </span>
              </li>
            </ul>
            <p className="mt-4">
              Dem Gast bleibt es unbenommen nachzuweisen, dass Wald &amp; Wiese
              kein oder ein wesentlich geringerer Schaden entstanden ist. Wald
              &amp; Wiese bleibt der Nachweis eines höheren tatsächlichen
              Schadens vorbehalten. Die Stornierung bedarf der Textform
              (z. B. E-Mail).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">§ 5 Gutscheine</h2>
            <div className="mt-3 space-y-3">
              <p>
                Gutscheine sind ausschließlich vor Ort bei Wald &amp; Wiese
                erhältlich. Ein Online-Verkauf von Gutscheinen findet derzeit
                nicht statt.
              </p>
              <p>
                Gutscheine sind ab dem Ende des Jahres, in dem sie erworben
                wurden, drei Jahre gültig. Nach Ablauf der Gültigkeit kann der
                Gutschein nicht mehr eingelöst werden.
              </p>
              <p>
                Eine Barauszahlung des Gutscheinwerts oder eines
                Restguthabens ist nicht möglich. Wird ein Gutschein nicht in
                voller Höhe eingelöst, bleibt das Restguthaben bis zum Ablauf
                der Gültigkeit erhalten. Für verlorene oder gestohlene
                Gutscheine übernehmen wir keine Haftung; ein Ersatz ist nicht
                möglich.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              § 6 Preise &amp; Zahlung
            </h2>
            <p className="mt-3">
              Alle Preise verstehen sich inklusive der gesetzlichen
              Umsatzsteuer. Die Bezahlung von Speisen und Getränken erfolgt
              vor Ort. Für Veranstaltungen gelten die in der jeweiligen
              Buchungsbestätigung genannten Zahlungsmodalitäten.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">§ 7 Haftung</h2>
            <p className="mt-3">
              Wald &amp; Wiese haftet uneingeschränkt für Schäden aus der
              Verletzung des Lebens, des Körpers oder der Gesundheit sowie für
              Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen. Im
              Übrigen haftet Wald &amp; Wiese nur für die Verletzung
              wesentlicher Vertragspflichten und begrenzt auf den
              vertragstypischen, vorhersehbaren Schaden. Für mitgebrachte
              Gegenstände und in der Garderobe abgelegte Sachen wird keine
              Haftung übernommen, soweit gesetzlich zulässig.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              § 8 Schlussbestimmungen
            </h2>
            <p className="mt-3">
              Es gilt das Recht der Bundesrepublik Deutschland. Sollte eine
              Bestimmung dieser AGB unwirksam sein oder werden, bleibt die
              Wirksamkeit der übrigen Bestimmungen davon unberührt. Anstelle
              der unwirksamen Bestimmung gilt die gesetzliche Regelung.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
