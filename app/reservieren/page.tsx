import Link from "next/link";
import { DaySection } from "@/components/day-section";
import { PageTone } from "@/components/page-tone";
import { reservationHref } from "@/lib/reservation";
import { ReservationWidget } from "@/components/reservation-widget";
import { CONTACT, NEW_OPENING_HOURS } from "@/lib/site";

export const metadata = {
  title: "Reservieren",
  description:
    "Tisch reservieren bei Wald & Wiese in Sinzing — online direkt auf der Seite, telefonisch oder per WhatsApp.",
  alternates: { canonical: "/reservieren" },
};

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";

/**
 * Reservieren (Redesign 10/2026), dunkle Seite: oben die Vorauswahl Brunch
 * oder Abendessen groß auf der Seite (nicht nur als Modal), dann das
 * Lightspeed-Widget, dann persönliche Wege und Öffnungszeiten.
 */
export default function ReservierenPage() {
  const slots = [
    {
      k: "brunch" as const,
      title: "Brunch",
      sub: "Montag bis Sonntag, 8–14 Uhr",
      text: "Frühstück, Brote, Bowls, ab 11:30 Uhr Mittagstisch.",
    },
    {
      k: "abend" as const,
      title: "Abendessen",
      sub: "Freitag bis Sonntag, 17–22 Uhr",
      text: "Burger, vom Grill, Cocktails und ein süßes Finale.",
    },
  ];

  return (
    <>
      <PageTone tone="dunkel" />

      <DaySection stage="tanne" className="pt-[116px] pb-14 md:pt-[140px] md:pb-20">
        <div className={CONTAINER}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-creme/60 hover:underline underline-offset-4"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Reservieren</p>
          <h1 className="mt-3 max-w-[16ch] font-display text-[2.6rem] font-light leading-[1.05] md:text-[3.75rem]">
            Ein Tisch für dich.
          </h1>
          <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-creme/75">
            Sag uns, wofür du kommst, dann geht es direkt zur Online-Buchung. Für Feiern
            und größere Gruppen planen wir lieber persönlich mit dir.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {slots.map((s) => (
              <a
                key={s.k}
                href={reservationHref(s.k)}
                target="_blank"
                rel="noopener noreferrer"
                className="grid content-start gap-2 border-t border-creme/20 pt-5 transition-colors hover:border-akzent"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">{s.sub}</span>
                <span className="font-display text-[1.7rem] font-normal leading-tight md:text-[2rem]">{s.title}</span>
                <span className="text-[0.95rem] text-creme/75">{s.text}</span>
                <span className="mt-2 inline-flex h-11 w-fit items-center rounded-full bg-akzent px-5 text-sm font-semibold text-white">
                  {s.title} reservieren
                </span>
              </a>
            ))}
            <Link
              href="/feiern#anfrage"
              className="grid content-start gap-2 border-t border-creme/20 pt-5 transition-colors hover:border-akzent"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Ab etwa 10 Personen</span>
              <span className="font-display text-[1.7rem] font-normal leading-tight md:text-[2rem]">Feier oder Gruppe</span>
              <span className="text-[0.95rem] text-creme/75">Anfrage statt Online-Buchung, wir melden uns mit Vorschlägen.</span>
              <span className="mt-2 inline-flex h-11 w-fit items-center rounded-full px-5 text-sm font-semibold shadow-[inset_0_0_0_1.5px_currentColor]">
                Anfragen
              </span>
            </Link>
          </div>
        </div>
      </DaySection>

      {/* LIGHTSPEED-WIDGET */}
      <DaySection stage="abend" id="reservierung" className="scroll-mt-24 py-14 md:py-20">
        <div className={`${CONTAINER} max-w-[860px]`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Online reservieren</p>
          <h2 className="mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">
            Direkt hier auf der Seite
          </h2>
          <p className="mt-3 max-w-[52ch] leading-relaxed text-creme/75">
            Datum, Uhrzeit, Personen, in wenigen Schritten erledigt. Die Buchung läuft
            über unseren Reservierungs-Dienst Lightspeed.
          </p>
          <div className="mt-8 text-tanne">
            <ReservationWidget />
          </div>
        </div>
      </DaySection>

      {/* PERSÖNLICH + ZEITEN */}
      <DaySection stage="wald" className="py-14 md:py-20">
        <div className={`${CONTAINER} grid gap-12 md:grid-cols-2 md:gap-20`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Lieber persönlich?</p>
            <ul className="mt-4 text-[0.95rem]">
              {[
                { l: "Telefon", v: CONTACT.phone, href: `tel:${CONTACT.phoneRaw}` },
                { l: "WhatsApp", v: "Nachricht schicken", href: `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}` },
                { l: "E-Mail", v: CONTACT.email, href: `mailto:${CONTACT.email}?subject=Reservierung` },
              ].map((r) => (
                <li key={r.l} className="flex items-baseline justify-between gap-4 border-b border-creme/15 py-4">
                  <span className="text-creme/60">{r.l}</span>
                  <a href={r.href} className="break-all text-right font-semibold hover:underline underline-offset-4">
                    {r.v}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Öffnungszeiten</p>
            <dl className="mt-4 text-[0.95rem]">
              {NEW_OPENING_HOURS.map((s) => (
                <div key={s.days} className="flex justify-between gap-4 border-b border-creme/15 py-4">
                  <dt className="font-semibold">{s.days}</dt>
                  <dd className="text-right tabular-nums">
                    {s.slots.map((slot) => (
                      <div key={slot}>{slot}</div>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-creme/60">
              Brunch täglich, abends Freitag bis Sonntag. An Feiertagen sag uns kurz Bescheid.
            </p>
          </div>
        </div>
      </DaySection>
    </>
  );
}
