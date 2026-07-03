import { Eyebrow } from "@/components/eyebrow";
import { LeafDivider } from "@/components/leaf-divider";
import { CONTACT, SITE } from "@/lib/site";

export const metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Wald & Wiese.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <article>
      {/* KOPF — Waldgrün, ruhig (kein Vollbild, Rechtstext bleibt lesbar) */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-5 md:px-8 pt-28 md:pt-36 pb-14 md:pb-16 reveal">
          <Eyebrow>Pflichtangaben</Eyebrow>
          <h1 className="mt-6 text-5xl md:text-6xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Datenschutz
          </h1>
          <LeafDivider tone="light" className="mt-10 justify-start opacity-80" />
        </div>
      </section>

      {/* RECHTSTEXT — Creme, dunkelgrüner Body */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-5 md:px-8 pt-14 md:pt-16 pb-20 text-waldgruen/75">
          <div className="space-y-10 text-base leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-waldgruen">
              1. Verantwortlicher
            </h2>
            <p className="mt-3">
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              <br />
              <br />
              {SITE.legalName}
              <br />
              Sven Leber
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.postalCode} {CONTACT.city}
              <br />
              Telefon: {CONTACT.phone}
              <br />
              E-Mail: {CONTACT.email}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              2. Allgemeines zur Datenverarbeitung
            </h2>
            <p className="mt-3">
              Wir verarbeiten personenbezogene Daten unserer Nutzer
              grundsätzlich nur, soweit dies zur Bereitstellung einer
              funktionsfähigen Website sowie unserer Inhalte erforderlich ist
              oder du eingewilligt hast. Rechtsgrundlagen sind insbesondere
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), lit. b DSGVO
              (Vertragserfüllung) und lit. f DSGVO (berechtigtes Interesse).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              3. Hosting (Vercel)
            </h2>
            <p className="mt-3">
              Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133,
              Walnut, CA 91789, USA, gehostet. Beim Aufruf der Website
              verarbeitet Vercel technisch notwendige Daten (siehe
              Server-Logfiles). Mit Vercel besteht ein
              Auftragsverarbeitungsvertrag. Die Datenübermittlung in die USA
              wird über die EU-Standardvertragsklauseln abgesichert.
              Rechtsgrundlage ist unser berechtigtes Interesse an einem
              sicheren und effizienten Betrieb der Website (Art. 6 Abs. 1 lit. f
              DSGVO).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              4. Server-Logfiles
            </h2>
            <p className="mt-3">
              Bei jedem Aufruf der Website werden automatisch Informationen
              erfasst, die dein Browser übermittelt: Browsertyp und -version,
              verwendetes Betriebssystem, Referrer-URL, Hostname des
              zugreifenden Rechners, Uhrzeit der Serveranfrage und die
              IP-Adresse. Diese Daten werden nicht mit anderen Datenquellen
              zusammengeführt und dienen der technischen Sicherheit und
              Stabilität. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              5. Cookies &amp; externe Inhalte
            </h2>
            <p className="mt-3">
              Wir setzen nur technisch notwendige Cookies ein (Art. 6 Abs. 1
              lit. f DSGVO bzw. § 25 Abs. 2 TTDSG). Externe Inhalte, die Daten
              an Dritte übertragen können — insbesondere die eingebettete
              Google-Maps-Karte —, werden erst geladen, nachdem du aktiv
              zugestimmt hast (Klick auf „Karte laden"; Art. 6 Abs. 1 lit. a
              DSGVO, § 25 Abs. 1 TTDSG).
            </p>
            <p className="mt-3">
              Zur Reichweitenmessung setzen wir <strong className="font-medium">
              Google Analytics 4</strong> und zur Erfolgsmessung unserer
              Anzeigen <strong className="font-medium">Google Ads
              (Conversion-Tracking)</strong> ein — beides beschrieben in
              Abschnitt 6. Weitere Analyse-Tools (z. B. Hotjar) nutzen wir
              derzeit nicht. Sollten wir solche Dienste künftig einsetzen,
              geschieht das ausschließlich nach deiner Einwilligung, und wir
              ergänzen diese Erklärung vorher entsprechend.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              6. Google Analytics 4 &amp; Google Ads
            </h2>
            <p className="mt-3">
              Um zu verstehen, wie unsere Website genutzt wird, verwenden wir
              Google Analytics 4, einen Dienst der Google Ireland Limited,
              Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics
              verwendet Cookies und ähnliche Technologien, um Informationen über
              deine Nutzung der Website (z. B. aufgerufene Seiten, Verweildauer,
              ungefähre Herkunft anhand der gekürzten IP-Adresse, Geräte- und
              Browsertyp) zu erheben und auszuwerten.
            </p>
            <p className="mt-3">
              Google Analytics wird <strong className="font-medium">erst
              geladen, nachdem du im Cookie-Banner der Kategorie „Statistik"
              zugestimmt hast</strong>. Rechtsgrundlage ist deine Einwilligung
              (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Über den Google
              Consent Mode ist sichergestellt, dass ohne deine Zustimmung keine
              Analyse-Cookies gesetzt und keine Daten an Google übertragen
              werden.
            </p>
            <p className="mt-3">
              Bei aktivierter Statistik-Einwilligung kann deine (gekürzte)
              IP-Adresse an Server von Google, auch in den USA, übertragen
              werden. Google LLC ist unter dem EU-US Data Privacy Framework
              zertifiziert; ergänzend gelten die EU-Standardvertragsklauseln.
              Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft
              widerrufen, indem du deine Cookie-Einstellungen über das Banner
              (Link im Footer) änderst.
            </p>
            <p className="mt-3">
              Zur Messung des Erfolgs unserer Online-Anzeigen verwenden wir
              außerdem Google Ads mit Conversion-Tracking, ebenfalls ein Dienst
              der Google Ireland Limited. Damit erkennen wir, ob Nutzer nach dem
              Klick auf eine unserer Anzeigen bestimmte Aktionen auf der Website
              ausführen (z. B. eine Reservierung starten). Dabei kann ein Cookie
              gesetzt werden; wir erhalten von Google nur zusammengefasste,
              nicht auf einzelne Personen zurückführbare Statistiken.
            </p>
            <p className="mt-3">
              Google Ads wird <strong className="font-medium">erst geladen,
              nachdem du im Cookie-Banner der Kategorie „Marketing" zugestimmt
              hast</strong>. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs.
              1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Ohne diese Zustimmung werden
              über den Google Consent Mode keine Marketing-Cookies gesetzt und
              keine Daten an Google Ads übertragen. Auch hier ist eine
              Übermittlung in die USA möglich (EU-US Data Privacy Framework bzw.
              EU-Standardvertragsklauseln), und du kannst deine Einwilligung
              jederzeit über die Cookie-Einstellungen widerrufen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              7. Google Maps
            </h2>
            <p className="mt-3">
              Zur Darstellung unserer Anfahrt binden wir auf der Kontaktseite
              Kartenmaterial von Google Maps (Google Ireland Limited) ein. Die
              Karte wird erst geladen, nachdem du auf „Karte laden" geklickt
              und damit eingewilligt hast (Art. 6 Abs. 1 lit. a DSGVO). Beim
              Laden wird deine IP-Adresse an Google übertragen; eine
              Übermittlung in die USA ist möglich und über die
              EU-Standardvertragsklauseln abgesichert. Ohne Einwilligung zeigen
              wir dir alternativ unsere Adresse als Text sowie einen Link zur
              externen Kartenansicht.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              8. Reservierung über Lightspeed
            </h2>
            <p className="mt-3">
              Für Tischreservierungen binden wir auf der Reservieren-Seite das
              Reservierungs-Widget unseres Dienstleisters Lightspeed direkt ein
              (als iframe). Das Widget wird erst geladen, nachdem du auf
              „Reservierung laden" geklickt und damit eingewilligt hast (Art. 6
              Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Beim Laden werden Daten an
              Lightspeed sowie an Google (zum Schutz vor Missbrauch über Google
              reCAPTCHA) übertragen; eine Übermittlung in die USA ist möglich und
              über die EU-Standardvertragsklauseln abgesichert. Für die
              eigentliche Reservierung gilt zusätzlich die Datenschutzerklärung
              von Lightspeed. Ohne Einwilligung zeigen wir dir alternativ einen
              Link, über den du das Reservierungsformular extern öffnen kannst.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              9. Externe Links (Instagram, WhatsApp)
            </h2>
            <p className="mt-3">
              Wir verlinken auf unser Instagram-Profil und bieten eine
              Kontaktmöglichkeit über WhatsApp. Diese Inhalte werden nicht auf
              unserer Website eingebettet, sondern lediglich verlinkt. Erst
              wenn du einem Link folgst, gelten die Datenschutzbestimmungen des
              jeweiligen Anbieters.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              10. Reichweitenmessung (eigene, anonyme Statistik)
            </h2>
            <p className="mt-3">
              Um zu verstehen, wie unsere Website genutzt wird, erfassen wir
              anonyme Nutzungsstatistiken mit einer eigenen Lösung. Dabei werden
              <strong className="font-medium">
                {" "}
                keine Cookies gesetzt, keine IP-Adressen und keine
                personenbezogenen Daten gespeichert
              </strong>
              . Wir zählen ausschließlich anonyme Ereignisse ohne Bezug zu
              einer Person: Seitenaufrufe, Klicks auf bestimmte Schaltflächen,
              die Verweildauer auf einer Seite, die Quell-Domain (von welcher
              Website du kamst, z. B. „google.com" — ohne vollständige Adresse)
              sowie eine grobe Herkunft (nur Ländercode, z. B. „DE"), die aus
              der Verbindung abgeleitet wird, <strong className="font-medium">
              ohne dass die IP-Adresse gespeichert wird</strong>. Diese Daten
              lassen keinen Rückschluss auf einzelne Personen zu und werden
              nicht zu Profilen zusammengeführt. Die clientseitige Erfassung
              (etwa Seitenaufrufe) erfolgt nur, wenn du der Kategorie „Statistik" im
              Cookie-Banner zugestimmt hast (Art. 6 Abs. 1 lit. a DSGVO). Anonyme
              Zähldaten zu bewussten Aktionen (z. B. ein abgesendetes Formular)
              verarbeiten wir auf Grundlage unseres berechtigten Interesses an
              einer bedarfsgerechten Gestaltung (Art. 6 Abs. 1 lit. f DSGVO). Es
              findet keine Profilbildung statt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              11. Kontaktformular
            </h2>
            <p className="mt-3">
              Wenn du uns über das Kontaktformular schreibst, verarbeiten wir die
              von dir angegebenen Daten (Name, E-Mail-Adresse, optional
              Telefonnummer und Betreff sowie deine Nachricht), um deine Anfrage
              zu bearbeiten (Art. 6 Abs. 1 lit. b und lit. f DSGVO). Für den
              Versand der E-Mail nutzen wir den Dienst Resend (Resend, Inc.,
              USA); dabei werden deine Angaben an Resend übermittelt. Die
              Übermittlung in die USA ist über die EU-Standardvertragsklauseln
              abgesichert. Wir verwenden deine Angaben ausschließlich zur
              Bearbeitung deiner Anfrage.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              12. Bewerbungen (Karriere-Seite)
            </h2>
            <p className="mt-3">
              Wenn du dich über das Bewerbungsformular auf unserer
              Karriere-Seite bewirbst, verarbeiten wir die von dir angegebenen
              Daten (Name, E-Mail-Adresse, Telefonnummer, ausgewählte Stelle,
              Angaben zur Verfügbarkeit, deine Nachricht) sowie die von dir
              optional hochgeladenen Bewerbungsunterlagen (z. B. Lebenslauf,
              Zeugnisse). Diese Daten nutzen wir ausschließlich zur Durchführung
              des Bewerbungsverfahrens und zur Entscheidung über eine
              Begründung des Beschäftigungsverhältnisses. Rechtsgrundlage ist
              Art. 6 Abs. 1 lit. b DSGVO i. V. m. § 26 Abs. 1 BDSG
              (Anbahnung eines Beschäftigungsverhältnisses).
            </p>
            <p className="mt-3">
              Für den Versand der Bewerbung nutzen wir den Dienst Resend
              (Resend, Inc., USA); dabei werden deine Angaben und Anhänge an
              Resend übermittelt. Die Übermittlung in die USA ist über die
              EU-Standardvertragsklauseln abgesichert. Eine automatisierte
              Entscheidungsfindung findet nicht statt.
            </p>
            <p className="mt-3">
              Kommt es nicht zu einer Einstellung, löschen wir deine
              Bewerbungsdaten spätestens sechs Monate nach Abschluss des
              Verfahrens, sofern du keiner längeren Speicherung zugestimmt hast
              und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Im
              Fall einer Einstellung werden die erforderlichen Daten in die
              Personalakte übernommen. Du kannst deine Einwilligung jederzeit mit
              Wirkung für die Zukunft widerrufen und die Löschung deiner
              Bewerbungsdaten verlangen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              13. Newsletter
            </h2>
            <p className="mt-3">
              Du kannst dich für unseren Newsletter (u. a. Benachrichtigung zum
              Frühstücks-Start) anmelden. Wir verwenden das
              Double-Opt-in-Verfahren: Nach deiner Anmeldung erhältst du eine
              E-Mail mit einem Bestätigungslink; erst nach deiner Bestätigung
              nehmen wir deine E-Mail-Adresse in den Verteiler auf (Art. 6 Abs. 1
              lit. a DSGVO). Für Speicherung und Versand nutzen wir unsere
              Datenbank sowie den Dienst Resend (USA, abgesichert über die
              EU-Standardvertragsklauseln). Du kannst dich jederzeit über den
              Abmeldelink am Ende jeder Newsletter-E-Mail wieder austragen; deine
              Einwilligung gilt damit als für die Zukunft widerrufen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              14. Deine Rechte
            </h2>
            <p className="mt-3">
              Dir stehen gegenüber uns folgende Rechte hinsichtlich deiner
              personenbezogenen Daten zu: Recht auf Auskunft (Art. 15 DSGVO),
              Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
              Einschränkung der Verarbeitung (Art. 18 DSGVO),
              Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen die
              Verarbeitung (Art. 21 DSGVO). Eine erteilte Einwilligung kannst du
              jederzeit mit Wirkung für die Zukunft widerrufen. Zur Ausübung
              deiner Rechte genügt eine Nachricht an die oben genannten
              Kontaktdaten.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              15. Beschwerderecht bei der Aufsichtsbehörde
            </h2>
            <p className="mt-3">
              Dir steht ein Beschwerderecht bei einer
              Datenschutz-Aufsichtsbehörde zu. Zuständig ist das Bayerische
              Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522
              Ansbach.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-waldgruen">
              16. SSL-/TLS-Verschlüsselung
            </h2>
            <p className="mt-3">
              Diese Website nutzt aus Sicherheitsgründen eine
              SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennst
              du an dem „https://" in der Adresszeile deines Browsers.
            </p>
          </section>
          </div>
        </div>
      </section>
    </article>
  );
}
