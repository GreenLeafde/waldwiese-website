import Link from "next/link";
import { MapsEmbed } from "@/components/maps-embed";
import {
  BREAKFAST_LAUNCH,
  CONTACT,
  CURRENT_OPENING_HOURS,
  NEW_OPENING_HOURS,
  RESERVATION_URL,
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
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-stone-400 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center">
          <p className="eyebrow no-line justify-center">Kontakt & Anfahrt</p>
          <h1 className="mt-7 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Sag <span className="accent">Hallo.</span>
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Reservierung, Anfrage, kurze Frage — alle Wege führen zu uns.
            Antwort kommt zeitnah.
          </p>
        </div>
      </section>

      {/* DATEN */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-24 md:pb-32 grid md:grid-cols-2 gap-12 md:gap-20">
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
              <ul className="mt-5 divide-y divide-stone-200">
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
                    <span className="text-stone-500">{item.label}</span>
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
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                Öffnungszeiten · Aktuell
              </p>
              <dl className="mt-5 divide-y divide-stone-200 text-sm">
                {CURRENT_OPENING_HOURS.map((s) => (
                  <div
                    key={s.days}
                    className="py-3 flex justify-between gap-4 text-stone-600"
                  >
                    <dt className="font-medium text-waldgruen">{s.days}</dt>
                    <dd>{s.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-stone-400">Di & Mi Ruhetag.</p>
            </div>

            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                Ab {BREAKFAST_LAUNCH.dateShort}
              </p>
              <dl className="mt-5 divide-y divide-stone-200 text-sm">
                {NEW_OPENING_HOURS.map((s) => (
                  <div
                    key={s.days}
                    className="py-3 flex justify-between gap-4 text-stone-600 items-start"
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
              <p className="mt-2 text-xs text-stone-400">
                Fr – So mit Frühstück & Abendservice.
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
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-24 md:pb-32">
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
            Anfahrt
          </p>
          <div className="mt-5">
            <MapsEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
