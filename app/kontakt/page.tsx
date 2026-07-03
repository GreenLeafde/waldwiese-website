import Link from "next/link";
import { MapsEmbed } from "@/components/maps-embed";
import { LeafDivider } from "@/components/leaf-divider";
import { ContactForm } from "@/components/contact-form";
import {
  BREAKFAST_LAUNCH,
  CONTACT,
  CURRENT_OPENING_HOURS,
  NEW_OPENING_HOURS,
  RESERVATION_URL,
  hasBreakfastLaunched,
} from "@/lib/site";

export const metadata = {
  title: "Kontakt & Anfahrt",
  description:
    "Wald & Wiese, Bruckdorfer Straße 42, 93161 Sinzing bei Regensburg. Telefon, E-Mail, WhatsApp, Instagram.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <>
      {/* HEADER */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Kontakt & Anfahrt</p>
          <h1 className="mt-7 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Sag <span className="accent">Hallo.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Reservierung, Anfrage, kurze Frage — alle Wege führen zu uns.
            Antwort kommt zeitnah.
          </p>
        </div>
      </section>

      {/* SCHREIB UNS — Kontaktformular */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-2xl px-6 md:px-10 pt-20 md:pt-28">
          <div className="reveal text-center">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Schreib uns
            </p>
            <h2 className="mt-5 text-3xl md:text-4xl font-display font-normal text-waldgruen">
              Eine Nachricht genügt
            </h2>
            <p className="mt-4 italic text-waldgruen/60 max-w-md mx-auto leading-relaxed">
              Reservierungswunsch, Frage zur Karte, Idee für eine Feier — schreib
              einfach drauflos. Wir lesen mit.
            </p>
          </div>
          <div className="reveal mt-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* DATEN */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 md:gap-20">
          <div className="reveal space-y-12">
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                Adresse
              </p>
              <address className="not-italic mt-4 font-display text-2xl md:text-3xl text-waldgruen leading-snug">
                {CONTACT.street}
                <br />
                {CONTACT.postalCode} {CONTACT.city}
              </address>
            </div>

            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                So erreichst du uns
              </p>
              <ul className="mt-5 divide-y divide-waldgruen/15">
                {[
                  {
                    label: "Telefon",
                    value: CONTACT.phone,
                    href: `tel:${CONTACT.phoneRaw}`,
                  },
                  {
                    label: "WhatsApp",
                    value: "Nachricht schicken",
                    href: `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`,
                  },
                  {
                    label: "E-Mail",
                    value: CONTACT.email,
                    href: `mailto:${CONTACT.email}`,
                  },
                  {
                    label: "Instagram",
                    value: CONTACT.instagramHandle,
                    href: CONTACT.instagram,
                  },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="py-4 flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="text-waldgruen/45">{item.label}</span>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-base text-waldgruen hover:text-tonwarm break-all text-right transition-colors"
                    >
                      {item.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal space-y-12">
            {!hasBreakfastLaunched() && (
              <div>
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  Öffnungszeiten · Aktuell
                </p>
                <dl className="mt-5 divide-y divide-waldgruen/15 text-sm">
                  {CURRENT_OPENING_HOURS.map((s) => (
                    <div
                      key={s.days}
                      className="py-3 flex justify-between gap-4 text-waldgruen/70"
                    >
                      <dt className="font-medium text-waldgruen">{s.days}</dt>
                      <dd>{s.hours}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 text-xs text-waldgruen/45">Di & Mi Ruhetag.</p>
              </div>
            )}

            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                {hasBreakfastLaunched()
                  ? "Öffnungszeiten"
                  : `Ab ${BREAKFAST_LAUNCH.dateShort}`}
              </p>
              <dl className="mt-5 divide-y divide-waldgruen/15 text-sm">
                {NEW_OPENING_HOURS.map((s) => (
                  <div
                    key={s.days}
                    className="py-3 flex justify-between gap-4 text-waldgruen/70 items-start"
                  >
                    <dt className="font-medium text-waldgruen pt-0.5">
                      {s.days}
                    </dt>
                    <dd className="text-right">
                      {s.slots.map((slot) => (
                        <div key={slot}>{slot}</div>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-waldgruen/45">
                {hasBreakfastLaunched()
                  ? "Fr – So mit Frühstück & Abendservice · Di & Mi Ruhetag."
                  : "Fr – So mit Frühstück & Abendservice."}
              </p>
            </div>

            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Tisch reservieren <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ANFAHRT / KARTE */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-24 md:pb-32">
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
            Anfahrt
          </p>
          <div className="mt-5">
            <MapsEmbed />
          </div>
          <LeafDivider tone="dark" className="mt-16 md:mt-20 opacity-90" />
        </div>
      </section>
    </>
  );
}
