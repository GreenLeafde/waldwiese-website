import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeafDivider } from "@/components/leaf-divider";
import { EVENTS, getEvent, isPastEvent, upcomingEvents } from "@/lib/events";
import { CONTACT, GEO, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: event.metaTitle,
    description: event.metaDescription,
    alternates: { canonical: `/veranstaltungen/${slug}` },
    openGraph: {
      title: event.title,
      description: event.metaDescription,
      url: `/veranstaltungen/${slug}`,
      type: "article",
      images: [{ url: event.hero.src, alt: event.hero.alt }],
    },
  };
}

export default async function VeranstaltungDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const isPast = isPastEvent(event);
  const otherEvents = upcomingEvents().filter((e) => e.slug !== event.slug);

  const eventLd = {
    "@context": "https://schema.org",
    "@type": "TheaterEvent",
    name: event.title,
    description: event.metaDescription,
    startDate: event.startsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE.url}${event.hero.src}`],
    url: `${SITE.url}/veranstaltungen/${slug}`,
    inLanguage: "de-DE",
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
      name: event.organizer.name,
      url: event.organizer.url,
    },
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "EUR",
      url: event.ticketUrl,
      availability: isPast
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
  };

  const faqLd = event.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: event.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

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
      {
        "@type": "ListItem",
        position: 3,
        name: event.title,
        item: `${SITE.url}/veranstaltungen/${slug}`,
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* HEADER — Waldgrün */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <nav
            aria-label="Brotkrumen"
            className="flex flex-wrap items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50"
          >
            <Link href="/" className="hover:text-tonwarm transition-colors">
              Startseite
            </Link>
            <span aria-hidden>/</span>
            <Link
              href="/veranstaltungen#termine"
              className="hover:text-tonwarm transition-colors"
            >
              Veranstaltungen
            </Link>
          </nav>
        </div>

        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-16 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            {event.kicker}
          </p>
          <h1 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.02] tracking-tight text-mehlcreme">
            {event.title}
          </h1>
          <p className="mt-7 text-lg md:text-xl text-mehlcreme">
            <time dateTime={event.startsAt}>
              {event.dateLabel} · {event.timeLabel}
            </time>
          </p>
          <p className="mt-3 text-mehlcreme/70">
            {event.priceLabel}
            {event.priceNote ? ` — ${event.priceNote}` : ""}
          </p>

          {isPast ? (
            <p className="mt-10 inline-flex items-center rounded-full border border-mehlcreme/30 px-6 py-3 text-mehlcreme/70">
              Dieser Termin ist vorbei.
            </p>
          ) : (
            <div className="mt-10 flex flex-col items-center gap-4">
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                Tickets beim Veranstalter <span aria-hidden>↗</span>
              </a>
              <p className="max-w-md text-sm text-mehlcreme/60 leading-relaxed">
                {event.ticketNote}
              </p>
            </div>
          )}
        </div>

        {/* HERO-BILD */}
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-20 md:pb-28">
          <div className="relative aspect-[27/20] md:aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-mehlcreme/10 reveal-scale">
            <Image
              src={event.hero.src}
              alt={event.hero.alt}
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-center text-xs text-mehlcreme/45">
            Szenenfoto: {event.organizer.name}
          </p>
        </div>
      </section>

      {/* INHALT */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-2xl px-6 md:px-10 py-20 md:py-28">
          <p className="italic text-lg md:text-xl text-waldgruen/65 leading-relaxed reveal">
            {event.intro}
          </p>

          {/* FAKTEN */}
          <dl className="mt-12 divide-y divide-waldgruen/15 border-y border-waldgruen/15 reveal">
            {event.facts.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6"
              >
                <dt className="sm:w-36 shrink-0 text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium sm:pt-1">
                  {f.label}
                </dt>
                <dd className="text-waldgruen/80 leading-relaxed">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 space-y-14">
            {event.sections.map((sec) => (
              <div key={sec.heading} className="reveal">
                <h2 className="text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                  {sec.heading}
                </h2>
                <div className="mt-5 space-y-4 text-waldgruen/75 leading-relaxed">
                  {sec.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE */}
      {event.gallery.length > 0 && (
        <section className="bg-mehlcreme border-t border-waldgruen/15">
          <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 md:py-24">
            <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium reveal">
              Eindrücke vom Stück
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal-1">
              {event.gallery.map((img) => (
                <li
                  key={img.src}
                  className="relative aspect-[27/20] overflow-hidden rounded-2xl ring-1 ring-waldgruen/10"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-waldgruen/45">
              Szenenfotos: {event.organizer.name}
            </p>
          </div>
        </section>
      )}

      {/* FAQ */}
      {event.faq?.length ? (
        <section className="bg-waldgruen-dark text-mehlcreme">
          <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28">
            <p className="eyebrow no-line text-tonwarm">Häufige Fragen</p>
            <h2 className="mt-6 text-3xl md:text-4xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Gut zu <span className="accent">wissen.</span>
            </h2>
            <div className="mt-10 divide-y divide-mehlcreme/15 border-y border-mehlcreme/15">
              {event.faq.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                    <span className="font-display text-lg md:text-xl text-mehlcreme">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className="text-tonwarm text-2xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-mehlcreme/75 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA + WEITERE TERMINE */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          {!isPast && (
            <>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
                Mitermitteln? <span className="accent">Platz sichern.</span>
              </h2>
              <p className="mt-6 text-mehlcreme/80 leading-relaxed max-w-xl mx-auto">
                Der Ticketverkauf läuft über {event.organizer.name} — dort
                buchst du Plätze für {event.dateLabel} und gibst gleich an, wenn
                jemand vegan, vegetarisch oder mit Allergie am Tisch sitzt.
              </p>
              <div className="mt-10">
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Tickets beim Veranstalter <span aria-hidden>↗</span>
                </a>
              </div>
            </>
          )}

          {otherEvents.length > 0 && (
            <div className={isPast ? "" : "mt-16"}>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-mehlcreme/50 font-medium">
                {isPast ? "Kommende Termine" : "Auch bei uns"}
              </p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
                {otherEvents.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/veranstaltungen/${e.slug}`}
                      className="text-mehlcreme/85 border-b border-mehlcreme/25 hover:text-tonwarm hover:border-tonwarm pb-0.5 transition-colors"
                    >
                      {e.title} — {e.dateLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            <Link
              href="/veranstaltungen#termine"
              className="text-mehlcreme/80 border-b border-mehlcreme/25 hover:text-tonwarm hover:border-tonwarm pb-0.5 transition-colors"
            >
              Alle Veranstaltungen
            </Link>
            <Link
              href="/speisekarte"
              className="text-mehlcreme/80 border-b border-mehlcreme/25 hover:text-tonwarm hover:border-tonwarm pb-0.5 transition-colors"
            >
              Unsere Speisekarte
            </Link>
            <Link
              href="/kontakt"
              className="text-mehlcreme/80 border-b border-mehlcreme/25 hover:text-tonwarm hover:border-tonwarm pb-0.5 transition-colors"
            >
              Kontakt
            </Link>
          </div>

          <LeafDivider tone="light" className="mt-14 opacity-80" />
        </div>
      </section>
    </article>
  );
}
