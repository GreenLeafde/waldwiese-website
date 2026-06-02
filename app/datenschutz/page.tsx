import { Eyebrow } from "@/components/eyebrow";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { CONTACT, SITE } from "@/lib/site";

export const metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Wald & Wiese.",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <article className="bg-mehlcreme">
      <div className="mx-auto max-w-3xl px-5 md:px-8 pt-12 md:pt-20 pb-20">
        <Eyebrow>Pflichtangaben</Eyebrow>
        <h1 className="mt-6 text-5xl md:text-6xl font-display leading-[0.95]">
          Datenschutz
        </h1>

        <PlaceholderNotice title="Vor Launch: IDs eintragen & AV-Verträge">
          Consent-Banner und Opt-in-Gating sind eingebaut: Google Analytics 4,
          Google Tag Manager, Hotjar, Google Ads und die Google-Maps-Karte
          laden erst nach aktiver Einwilligung. Vor dem Launch noch offen:
          Tracking-IDs in der Umgebungskonfiguration hinterlegen (siehe
          .env.example) und Auftragsverarbeitungsverträge mit Google und Hotjar
          abschließen.
        </PlaceholderNotice>

        <div className="mt-10 space-y-10 text-base leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-tonwarm">
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
            <h2 className="font-display text-xl text-tonwarm">
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
            <h2 className="font-display text-xl text-tonwarm">
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
            <h2 className="font-display text-xl text-tonwarm">
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
            <h2 className="font-display text-xl text-tonwarm">
              5. Cookies &amp; Einwilligung
            </h2>
            <p className="mt-3">
              Technisch notwendige Cookies setzen wir auf Grundlage unseres
              berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO bzw. § 25
              Abs. 2 TTDSG). Alle nicht notwendigen Dienste (insbesondere
              Statistik- und Marketing-Tools sowie eingebettete Karten) werden
              erst geladen, nachdem du im Consent-Banner aktiv eingewilligt
              hast (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG). Deine
              Auswahl kannst du jederzeit über die Cookie-Einstellungen
              widerrufen oder anpassen. Soweit Google-Dienste eingesetzt
              werden, nutzen wir den Google Consent Mode v2, der das
              Verhalten der Tags an deine Einwilligung anpasst.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              6. Google Tag Manager
            </h2>
            <p className="mt-3">
              Wir nutzen den Google Tag Manager (Google Ireland Limited, Gordon
              House, Barrow Street, Dublin 4, Irland). Der Tag Manager ist ein
              Werkzeug, mit dem Tracking- und Marketing-Tags verwaltet werden.
              Der Google Tag Manager selbst setzt keine Cookies und erfasst
              keine personenbezogenen Daten; er sorgt lediglich für das
              Auslösen anderer Tags, die ihrerseits Daten erfassen können.
              Tools, die eine Einwilligung erfordern, werden erst nach deiner
              Zustimmung aktiviert.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              7. Google Analytics 4
            </h2>
            <p className="mt-3">
              Auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              nutzen wir Google Analytics 4, einen Webanalysedienst der Google
              Ireland Limited. Google Analytics verwendet Cookies und ähnliche
              Technologien, um die Nutzung der Website zu analysieren (z. B.
              aufgerufene Seiten, Verweildauer, ungefährer Standort). Die
              IP-Adresse wird von Google gekürzt verarbeitet. Dabei können
              Daten auch an Server von Google in den USA übermittelt werden;
              die Übermittlung ist über die EU-Standardvertragsklauseln
              abgesichert. Mit Google besteht ein
              Auftragsverarbeitungsvertrag. Deine Einwilligung kannst du
              jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">8. Hotjar</h2>
            <p className="mt-3">
              Auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              setzen wir Hotjar ein, einen Analysedienst der Hotjar Ltd., Level
              2, St Julian&apos;s Business Centre, 3, Elia Zammit Street, St
              Julian&apos;s STJ 1000, Malta. Mit Hotjar erfassen wir das
              Nutzungsverhalten (z. B. Mausbewegungen, Klicks, Scrollverhalten)
              in Form von pseudonymisierten Nutzungsprofilen und Heatmaps, um
              unsere Website zu verbessern. Es werden keine Daten erhoben, mit
              denen du persönlich identifiziert wirst. Mit Hotjar besteht ein
              Auftragsverarbeitungsvertrag. Deine Einwilligung kannst du
              jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              9. Google Ads &amp; Conversion-Tracking
            </h2>
            <p className="mt-3">
              Auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
              nutzen wir Google Ads mit Conversion-Tracking (Google Ireland
              Limited). Damit können wir messen, ob Nutzer, die über eine
              Google-Anzeige auf unsere Website gelangt sind, eine bestimmte
              Aktion durchführen. Dazu wird ein Cookie gesetzt. Wir erhalten von
              Google statistische Auswertungen und können dich nicht persönlich
              identifizieren. Auch hier kann eine Datenübermittlung in die USA
              erfolgen, abgesichert über die EU-Standardvertragsklauseln. Deine
              Einwilligung kannst du jederzeit mit Wirkung für die Zukunft
              widerrufen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              10. Google Maps
            </h2>
            <p className="mt-3">
              Zur Darstellung unserer Anfahrt binden wir Kartenmaterial von
              Google Maps (Google Ireland Limited) ein. Die Karte wird erst
              geladen, nachdem du eingewilligt hast (Art. 6 Abs. 1 lit. a
              DSGVO). Beim Laden der Karte wird deine IP-Adresse an Google
              übertragen; eine Übermittlung in die USA ist möglich und über die
              EU-Standardvertragsklauseln abgesichert. Ohne Einwilligung zeigen
              wir dir alternativ unsere Adresse als Text sowie einen Link zur
              externen Kartenansicht.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              11. Reservierung über Lightspeed
            </h2>
            <p className="mt-3">
              Für Tischreservierungen verlinken wir auf das externe
              Reservierungssystem von Lightspeed. Wenn du auf den
              Reservierungs-Button klickst, wirst du auf die Seite des Anbieters
              weitergeleitet. Eine Datenübermittlung an Lightspeed findet erst
              auf dessen Plattform statt; es gilt dann die Datenschutzerklärung
              von Lightspeed. Auf unserer Website selbst werden durch den Link
              keine Reservierungsdaten verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              12. Externe Links (Instagram, WhatsApp)
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
            <h2 className="font-display text-xl text-tonwarm">
              13. Deine Rechte
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
            <h2 className="font-display text-xl text-tonwarm">
              14. Beschwerderecht bei der Aufsichtsbehörde
            </h2>
            <p className="mt-3">
              Dir steht ein Beschwerderecht bei einer Datenschutz-Aufsichts­behörde
              zu. Zuständig ist das Bayerische Landesamt für Datenschutzaufsicht
              (BayLDA), Promenade 18, 91522 Ansbach.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-tonwarm">
              15. SSL-/TLS-Verschlüsselung
            </h2>
            <p className="mt-3">
              Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-
              Verschlüsselung. Eine verschlüsselte Verbindung erkennst du an
              dem „https://" in der Adresszeile deines Browsers.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
