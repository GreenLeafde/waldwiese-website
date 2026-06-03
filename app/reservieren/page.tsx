import Link from "next/link";
import {
  BREAKFAST_LAUNCH,
  CONTACT,
  CURRENT_OPENING_HOURS,
  NEW_OPENING_HOURS,
  RESERVATION_URL,
} from "@/lib/site";

export const metadata = {
  title: "Reservieren",
  description:
    "Tisch reservieren bei Wald & Wiese in Sinzing — online via Lightspeed, telefonisch oder per WhatsApp.",
  alternates: { canonical: "/reservieren" },
};

export default function ReservierenPage() {
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
          <p className="eyebrow no-line justify-center text-tonwarm">Reservieren</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Ein Tisch{" "}
            <span className="accent">für dich.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Online über Lightspeed, telefonisch oder per WhatsApp — wie es
            dir lieber ist.
          </p>
          <div className="mt-10">
            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Online reservieren <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* OPTIONEN + ÖFFNUNGSZEITEN */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-12 md:gap-20">
          <div className="reveal">
            <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
              Lieber persönlich?
            </p>
            <ul className="mt-5 divide-y divide-waldgruen/15 text-sm">
              <li className="py-4 flex justify-between items-baseline gap-4">
                <span className="text-waldgruen/45">Telefon</span>
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  className="font-display text-base text-waldgruen hover:text-tonwarm transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="py-4 flex justify-between items-baseline gap-4">
                <span className="text-waldgruen/45">WhatsApp</span>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-base text-waldgruen hover:text-tonwarm transition-colors"
                >
                  Nachricht schicken
                </a>
              </li>
              <li className="py-4 flex justify-between items-baseline gap-4">
                <span className="text-waldgruen/45">E-Mail</span>
                <a
                  href={`mailto:${CONTACT.email}?subject=Reservierung`}
                  className="font-display text-base text-waldgruen hover:text-tonwarm break-all text-right transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="reveal space-y-10">
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
            <div>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                Ab {BREAKFAST_LAUNCH.dateShort}
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
