import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DaySection } from "@/components/day-section";
import { PageTone } from "@/components/page-tone";
import { VideoFacade } from "@/components/video-facade";
import { EVENTS, getEvent, isPastEvent, upcomingEvents } from "@/lib/events";
import { eventJsonLd } from "@/lib/event-schema";
import { SITE } from "@/lib/site";
import { isXmasSeason } from "@/lib/season";
import { StickyCta } from "@/components/sticky-cta";

type Props = { params: Promise<{ slug: string }> };

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";
const LABEL = "text-xs font-semibold uppercase tracking-[0.16em] text-akzent";
const H2 = "mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]";
const MUTED = "text-creme/75";
const BTN_A = "inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-akzent px-[26px] text-[0.95rem] font-semibold text-white transition-colors hover:bg-akzent-hover";
const LINK = "font-semibold border-b-[1.5px] border-current pb-0.5";

// Stündlich neu bauen: Geschenk-Block endet am 25.12. von selbst.
export const revalidate = 3600;

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    // metaTitle nennt das Restaurant schon selbst — ohne Layout-Suffix.
    title: { absolute: event.metaTitle },
    description: event.metaDescription,
    alternates: { canonical: `/veranstaltungen/${slug}` },
    ...(event.keywords?.length ? { keywords: event.keywords } : {}),
    openGraph: {
      title: event.title,
      description: event.metaDescription,
      url: `/veranstaltungen/${slug}`,
      type: "article",
      images: [
        {
          url: event.hero.src,
          alt: event.hero.alt,
          width: event.hero.width,
          height: event.hero.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.metaDescription,
      images: [event.hero.src],
    },
  };
}

export default async function VeranstaltungDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const isPast = isPastEvent(event);
  const gift = !isPast && isXmasSeason() ? event.gift : undefined;
  const otherEvents = upcomingEvents().filter((e) => e.slug !== event.slug);

  const eventLd = eventJsonLd(event);

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

      <PageTone tone="dunkel" />
      {/* KOPF — dunkel, Foto rechts, Ticket-Knopf oben */}
      <DaySection stage="tanne" className="pt-[116px] pb-14 md:pt-[140px] md:pb-20">
        <div className={CONTAINER}>
          <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-creme/60">
            <Link href="/" className="hover:underline underline-offset-4">Startseite</Link>
            <span aria-hidden>/</span>
            <Link href="/veranstaltungen#termine" className="hover:underline underline-offset-4">Veranstaltungen</Link>
          </nav>
          <div className="mt-8 grid items-center gap-9 md:grid-cols-2 md:gap-14">
            <div className="grid justify-items-start gap-4">
              {gift && (
                <span className="inline-flex items-center rounded-full bg-akzent px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
                  {gift.badge}
                </span>
              )}
              <p className={LABEL}>{event.kicker}</p>
              <h1 className="font-display text-[2.4rem] font-light leading-[1.05] md:text-[3.25rem]">{event.title}</h1>
              <p className="m-0 text-[1.1rem] md:text-[1.25rem]">
                <time dateTime={event.startsAt}>{event.dateLabel} · {event.timeLabel}</time>
              </p>
              <p className={`m-0 ${MUTED}`}>
                {event.priceLabel}
                {event.priceNote ? ` — ${event.priceNote}` : ""}
              </p>
              {isPast ? (
                <p className="m-0 inline-flex h-[50px] items-center rounded-full px-[26px] text-[0.95rem] font-semibold shadow-[inset_0_0_0_1.5px_currentColor]">
                  Dieser Termin ist vorbei.
                </p>
              ) : (
                <>
                  <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={BTN_A}>
                    {event.ticketButtonLabel ?? "Tickets beim Veranstalter"} <span aria-hidden>↗</span>
                  </a>
                  <p className={`m-0 max-w-[48ch] text-sm leading-relaxed ${MUTED}`}>{event.ticketNote}</p>
                </>
              )}
            </div>
            <figure className="m-0">
              <Image
                src={event.hero.src}
                alt={event.hero.alt}
                width={event.hero.width}
                height={event.hero.height}
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/3] w-full rounded-[18px] object-cover"
              />
              <figcaption className={`mt-2 text-xs ${MUTED}`}>
                {event.heroCredit ?? `Szenenfoto: ${event.organizer.name}`}
              </figcaption>
            </figure>
          </div>
        </div>
      </DaySection>

      {/* GESCHENK — nur in der Weihnachtszeit */}
      {gift && (
        <DaySection stage="abend" className="py-14 md:py-20">
          <div className={`${CONTAINER} max-w-[860px]`}>
            <p className={LABEL}>Verschenken</p>
            <h2 className={H2}>{gift.heading} {gift.accent}</h2>
            <p className={`mt-3 leading-relaxed ${MUTED}`}>{gift.text}</p>
            <ul className="mt-5 grid list-none gap-2 p-0">
              {gift.points.map((p) => (
                <li key={p} className="flex gap-3"><span aria-hidden className="text-akzent">✓</span>{p}</li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={BTN_A}>
                Tickets verschenken <span aria-hidden>↗</span>
              </a>
              <Link href="/gutscheine" className={LINK}>Lieber flexibel? Wertgutschein</Link>
            </div>
          </div>
        </DaySection>
      )}

      {/* INHALT */}
      <DaySection stage="abend" className="py-14 md:py-20">
        <div className={`${CONTAINER} max-w-[860px]`}>
          <p className="text-[1.15rem] leading-relaxed md:text-[1.25rem]">{event.intro}</p>
          <dl className="mt-10 border-t border-creme/15">
            {event.facts.map((f) => (
              <div key={f.label} className="grid gap-1 border-b border-creme/15 py-4 sm:grid-cols-[150px_1fr] sm:gap-6">
                <dt className={LABEL}>{f.label}</dt>
                <dd className={`leading-relaxed ${MUTED}`}>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 grid gap-12">
            {event.sections.map((sec) => (
              <div key={sec.heading}>
                <h2 className="font-display text-[1.6rem] font-normal leading-tight md:text-[2rem]">{sec.heading}</h2>
                <div className={`mt-4 grid gap-4 leading-relaxed ${MUTED}`}>
                  {sec.body.map((p) => (<p key={p} className="m-0">{p}</p>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DaySection>

      {/* VIDEO */}
      {event.video && (
        <DaySection stage="wald" className="py-14 md:py-20">
          <div className={`${CONTAINER} max-w-[960px]`}>
            <p className={LABEL}>Video-Vorschau</p>
            <h2 className={`${H2} mb-8`}>So fühlt sich der Abend an</h2>
            <VideoFacade
              youtubeId={event.video.youtubeId}
              title={event.video.title}
              poster={event.hero.src}
              posterAlt={event.hero.alt}
            />
          </div>
        </DaySection>
      )}

      {/* GALERIE */}
      {event.gallery.length > 0 && (
        <DaySection stage="wald" className="py-14 md:py-20">
          <div className={CONTAINER}>
            <p className={LABEL}>Eindrücke vom Stück</p>
            <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {event.gallery.map((img) => (
                <li key={img.src} className="relative aspect-[27/20] overflow-hidden rounded-[18px]">
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                </li>
              ))}
            </ul>
            <p className={`mt-3 text-xs ${MUTED}`}>Szenenfotos: {event.organizer.name}</p>
          </div>
        </DaySection>
      )}

      {/* FAQ */}
      {event.faq?.length ? (
        <DaySection stage="wald-2" className="py-14 md:py-20">
          <div className={`${CONTAINER} max-w-[860px]`}>
            <p className={LABEL}>Häufige Fragen</p>
            <h2 className={H2}>Gut zu wissen</h2>
            <div className="mt-8 border-t border-creme/15">
              {event.faq.map((f) => (
                <details key={f.q} className="group border-b border-creme/15 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-display text-[1.25rem] font-normal">{f.q}</span>
                    <span aria-hidden className="text-2xl leading-none text-akzent transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className={`mt-3 leading-relaxed ${MUTED}`}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </DaySection>
      ) : null}

      {/* CTA + WEITERE TERMINE */}
      <DaySection stage="nacht" className="py-14 md:py-20">
        <div className={`${CONTAINER} max-w-[860px]`}>
          {!isPast && (
            <>
              <h2 className="font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">
                {event.cta?.heading ?? "Mitermitteln?"} {event.cta?.accent ?? "Platz sichern."}
              </h2>
              <p className={`mt-3 max-w-[56ch] leading-relaxed ${MUTED}`}>
                {event.cta?.text ??
                  `Der Ticketverkauf läuft über ${event.organizer.name} — dort buchst du Plätze für ${event.dateLabel} und gibst gleich an, wenn jemand vegan, vegetarisch oder mit Allergie am Tisch sitzt.`}
              </p>
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={`${BTN_A} mt-7`}>
                {event.ticketButtonLabel ?? "Tickets beim Veranstalter"} <span aria-hidden>↗</span>
              </a>
            </>
          )}
          {otherEvents.length > 0 && (
            <div className={isPast ? "" : "mt-12 border-t border-creme/15 pt-8"}>
              <p className={LABEL}>{isPast ? "Kommende Termine" : "Auch bei uns"}</p>
              <ul className="mt-3 grid list-none gap-2 p-0">
                {otherEvents.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/veranstaltungen/${e.slug}`} className={LINK}>{e.title}</Link>
                    <span className={`ml-2 text-sm ${MUTED}`}>{e.dateLabel}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={`mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-creme/15 pt-6 text-sm ${MUTED}`}>
            <Link href="/veranstaltungen#termine" className="hover:underline underline-offset-4">Alle Veranstaltungen</Link>
            <Link href="/speisekarte" className="hover:underline underline-offset-4">Unsere Speisekarte</Link>
            <Link href="/kontakt" className="hover:underline underline-offset-4">Kontakt</Link>
          </div>
        </div>
      </DaySection>

      {!isPast && (
        <StickyCta
          href={event.ticketUrl}
          label={gift ? "Tickets verschenken" : "Tickets sichern"}
          note={`${event.priceLabel} · ${event.dateLabel.replace(/^\w+, /, "")}`}
        />
      )}
    </article>
  );
}
