import Link from "next/link";
import type { Metadata } from "next";
import { EventCards } from "@/components/event-cards";
import { LeafDivider } from "@/components/leaf-divider";
import { GrowingVine } from "@/components/growing-vine";
import { pastEvents, upcomingEvents } from "@/lib/events";
import { CONTACT, GEO, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veranstaltungen & Tickets — Krimidinner & Co. in Sinzing",
  description:
    "Alle Veranstaltungen im Wald & Wiese in Sinzing bei Regensburg: Krimidinner und weitere Abende mit Termin, Preis und Ticketlink. Jetzt Termine ansehen.",
  alternates: { canonical: "/veranstaltungen" },
};

/**
 * Öffentliche Termine mit Ticketverkauf (Krimidinner & Co.) als Karten-Liste,
 * Details je Termin unter /veranstaltungen/<slug>. Eigene Feiern — also uns
 * als Location buchen — liegen bewusst getrennt davon auf /feiern.
 */
export default function VeranstaltungenPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();

  const eventsLd = upcoming.map((e) => ({
    "@context": "https://schema.org",
    "@type": "TheaterEvent",
    name: e.title,
    description: e.teaser,
    startDate: e.startsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE.url}${e.hero.src}`,
    url: `${SITE.url}/veranstaltungen/${e.slug}`,
    location: {
      "@type": "Place",
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.street,
        postalCode: CONTACT.postalCode,
        addressLocality: CONTACT.city,
        addressRegion: CONTACT.region,
        addressCountry: "DE",
      },
      geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
    },
    organizer: {
      "@type": "Organization",
      name: e.organizer.name,
      url: e.organizer.url,
    },
    offers: {
      "@type": "Offer",
      price: e.price,
      priceCurrency: "EUR",
      url: e.ticketUrl,
      availability: "https://schema.org/InStock",
    },
  }));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Veranstaltungen",
        item: `${SITE.url}/veranstaltungen`,
      },
    ],
  };

  return (
    <>
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

      {/* HEADER */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-2 2xl:right-[5%] hidden lg:block h-[58%] max-h-[440px]"
        >
          <GrowingVine flip className="h-full w-auto" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <nav
            aria-label="Brotkrumen"
            className="flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50"
          >
            <Link href="/" className="hover:text-tonwarm transition-colors">
              Startseite
            </Link>
            <span aria-hidden>/</span>
            <span className="text-mehlcreme/80">Veranstaltungen</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-16 md:pb-20 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            Termine &amp; Tickets
          </p>
          <h1 className="mt-7 text-5xl md:text-7xl font-display font-normal leading-[0.98] tracking-tight text-mehlcreme">
            Abende mit <span className="accent">Programm.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Zwischen unseren Tischen wird nicht nur gegessen: Immer wieder
            gastieren Veranstalter mit besonderen Abenden bei uns im Grünen.
            Hier findest du alle Termine mit Datum, Preis und Ticketlink.
          </p>
        </div>
      </section>

      {/* TERMINE */}
      <section
        id="termine"
        className="scroll-mt-24 bg-waldgruen text-mehlcreme"
      >
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-20 md:pb-28">
          {upcoming.length > 0 ? (
            <>
              <h2
                id="termine-heading"
                className="text-[0.65rem] tracking-[0.22em] uppercase text-mehlcreme/50 font-medium reveal"
              >
                Kommende Termine
              </h2>
              <div className="mt-8">
                <EventCards events={upcoming} headingId="termine-heading" />
              </div>
            </>
          ) : (
            <p className="text-mehlcreme/75 leading-relaxed max-w-xl reveal">
              Gerade steht kein öffentlicher Termin im Kalender. Trag dich in
              den Newsletter ein oder schau bald wieder vorbei — dann erfährst
              du als Erstes vom nächsten Abend.
            </p>
          )}

          {past.length > 0 && (
            <div className="mt-20">
              <h2 className="text-[0.65rem] tracking-[0.22em] uppercase text-mehlcreme/50 font-medium reveal">
                Schon gelaufen
              </h2>
              <div className="mt-8">
                <EventCards events={past} variant="past" />
              </div>
            </div>
          )}

          <LeafDivider tone="light" className="mt-20 opacity-80" />
        </div>
      </section>

      {/* HINWEIS: eigene Feier ist etwas anderes */}
      <section className="bg-waldgruen-dark text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            Lieber selbst feiern?
          </p>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
            Dein Anlass, unsere <span className="accent">kleine Bühne.</span>
          </h2>
          <p className="mt-7 text-mehlcreme/80 leading-relaxed max-w-xl mx-auto">
            Geburtstag, Taufe, Firmenfeier oder Hochzeit: Für deine eigene Feier
            planen wir Menü und Ablauf persönlich mit dir — unabhängig von den
            Terminen oben.
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
            <Link
              href="/feiern"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Feiern bei uns <span aria-hidden>→</span>
            </Link>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
