import Link from "next/link";
import type { Metadata } from "next";
import { DaySection } from "@/components/day-section";
import { EventCards } from "@/components/event-cards";
import { PageTone } from "@/components/page-tone";
import { pastEvents, upcomingEvents } from "@/lib/events";
import { eventJsonLd } from "@/lib/event-schema";
import { CONTACT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veranstaltungen & Tickets — Magic Dinner, Krimidinner & Co. bei Regensburg",
  description:
    "Alle Veranstaltungen im Wald & Wiese in Sinzing bei Regensburg: Magic Dinner mit Zauberer Emilian Leber, Krimidinner und weitere Dinnershows mit Termin, Preis und Ticketlink.",
  alternates: { canonical: "/veranstaltungen" },
};

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";

/**
 * Öffentliche Termine mit Ticketverkauf (Krimidinner & Co.) als Liste,
 * Details je Termin unter /veranstaltungen/<slug>. Eigene Feiern — also uns
 * als Location buchen — liegen bewusst getrennt davon auf /feiern.
 * Dunkle Seite (Abend), siehe CI.
 */
export default function VeranstaltungenPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  const eventsLd = upcoming.map(eventJsonLd);
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Veranstaltungen", item: `${SITE.url}/veranstaltungen` },
    ],
  };

  return (
    <>
      <PageTone tone="dunkel" />
      {eventsLd.map((ld) => (
        <script
          key={ld.url}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <DaySection stage="tanne" className="pt-[116px] pb-10 md:pt-[140px] md:pb-14">
        <div className={CONTAINER}>
          <nav aria-label="Brotkrumen" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-creme/60">
            <Link href="/" className="hover:underline underline-offset-4">Startseite</Link>
            <span aria-hidden>/</span>
            <span>Veranstaltungen</span>
          </nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Termine &amp; Tickets</p>
          <h1 className="mt-3 max-w-[16ch] font-display text-[2.6rem] font-light leading-[1.05] md:text-[3.75rem]">
            Abende mit Programm.
          </h1>
          <p className="mt-5 max-w-[56ch] text-[1.05rem] leading-relaxed text-creme/75">
            Zwischen unseren Tischen wird nicht nur gegessen: Immer wieder gastieren
            Veranstalter mit besonderen Abenden bei uns im Grünen. Hier stehen alle Termine
            mit Datum, Preis und Ticketlink.
          </p>
        </div>
      </DaySection>

      <DaySection stage="tanne" id="termine" className="scroll-mt-24 pb-16 md:pb-24">
        <div className={CONTAINER}>
          {upcoming.length > 0 ? (
            <>
              <h2 id="termine-heading" className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">
                Kommende Termine
              </h2>
              <EventCards events={upcoming} headingId="termine-heading" />
            </>
          ) : (
            <p className="max-w-[56ch] leading-relaxed text-creme/75">
              Gerade steht kein öffentlicher Termin im Kalender. Trag dich in den Newsletter
              ein oder schau bald wieder vorbei, dann erfährst du als Erstes vom nächsten Abend.
            </p>
          )}
          {past.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Schon gelaufen</h2>
              <EventCards events={past} variant="past" />
            </div>
          )}
        </div>
      </DaySection>

      <DaySection stage="wald-2" className="py-14 md:py-20">
        <div className={`${CONTAINER} grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-16`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">Lieber selbst feiern?</p>
            <h2 className="mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">
              Dein Anlass, unsere kleine Bühne.
            </h2>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-creme/75">
              Geburtstag, Taufe, Firmenfeier oder Hochzeit: Für deine eigene Feier planen wir
              Menü und Ablauf persönlich mit dir, unabhängig von den Terminen oben.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/feiern"
              className="inline-flex h-[50px] items-center rounded-full bg-akzent px-[26px] text-[0.95rem] font-semibold text-white transition-colors hover:bg-akzent-hover"
            >
              Feiern bei uns
            </Link>
            <a href={`tel:${CONTACT.phoneRaw}`} className="font-semibold border-b-[1.5px] border-current pb-0.5">
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </DaySection>
    </>
  );
}
