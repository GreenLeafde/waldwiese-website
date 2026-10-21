import { ContactForm } from "@/components/contact-form";
import { DaySection } from "@/components/day-section";
import { MapsEmbed } from "@/components/maps-embed";
import { PageHead, UI } from "@/components/page-head";
import { ReserveButton } from "@/components/reserve-chooser";
import { CONTACT, NEW_OPENING_HOURS } from "@/lib/site";

export const metadata = {
  title: "Kontakt & Anfahrt",
  description:
    "Wald & Wiese, Bruckdorfer Straße 42, 93161 Sinzing bei Regensburg. Telefon, E-Mail, WhatsApp, Instagram.",
  alternates: { canonical: "/kontakt" },
};

const WAYS = [
  { label: "Telefon", value: CONTACT.phone, href: `tel:${CONTACT.phoneRaw}` },
  { label: "WhatsApp", value: "Nachricht schicken", href: `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}` },
  { label: "E-Mail", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { label: "Instagram", value: CONTACT.instagramHandle, href: CONTACT.instagram },
];

/**
 * Kontakt (Redesign 10/2026), hell: Wege und Zeiten links, Formular rechts,
 * darunter die Karte. Reservierungen gehen über die Vorauswahl, nicht über
 * das Formular.
 */
export default function KontaktPage() {
  return (
    <>
      <PageHead
        label="Kontakt & Anfahrt"
        title="Sag"
        accent="Hallo."
        intro="Frage zur Karte, Idee für eine Feier, kurze Rückmeldung: Schreib einfach, wir lesen mit. Für einen Tisch geht es am schnellsten über die Reservierung."
      >
        <ReserveButton location="kontakt" className={UI.btnA}>Tisch reservieren</ReserveButton>
      </PageHead>

      <DaySection stage="morgen" className="pb-16 md:pb-24">
        <div className={`${UI.container} grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16`}>
          <div className="grid content-start gap-10">
            <div>
              <p className={UI.label}>Adresse</p>
              <address className="mt-3 font-display text-[1.6rem] not-italic leading-snug md:text-[1.9rem]">
                {CONTACT.street}
                <br />
                {CONTACT.postalCode} {CONTACT.city}
              </address>
            </div>
            <div>
              <p className={UI.label}>So erreichst du uns</p>
              <ul className="mt-3 text-[0.95rem]">
                {WAYS.map((w) => (
                  <li key={w.label} className="flex items-baseline justify-between gap-4 border-b border-tanne/15 py-4">
                    <span className="text-muted-hell">{w.label}</span>
                    <a href={w.href} target="_blank" rel="noopener noreferrer" className="break-all text-right font-semibold hover:underline underline-offset-4">
                      {w.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={UI.label}>Öffnungszeiten</p>
              <dl className="mt-3 text-[0.95rem]">
                {NEW_OPENING_HOURS.map((s) => (
                  <div key={s.days} className="flex justify-between gap-4 border-b border-tanne/15 py-4">
                    <dt className="font-semibold">{s.days}</dt>
                    <dd className="text-right tabular-nums">
                      {s.slots.map((slot) => (
                        <div key={slot}>{slot}</div>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-muted-hell">Brunch täglich, abends Freitag bis Sonntag.</p>
            </div>
          </div>

          <div id="formular" className="scroll-mt-28">
            <p className={UI.label}>Schreib uns</p>
            <h2 className={UI.h2}>Eine Nachricht genügt</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </DaySection>

      <DaySection stage="morgen-2" className="py-16 md:py-24">
        <div className={UI.container}>
          <p className={UI.label}>Anfahrt</p>
          <h2 className={UI.h2}>Am Waldrand von Sinzing, ein paar Minuten von Regensburg</h2>
          <div className="mt-6">
            <MapsEmbed />
          </div>
        </div>
      </DaySection>
    </>
  );
}
