import type { EventItem } from "@/lib/events";
import { isPastEvent } from "@/lib/events";
import { CONTACT, GEO, SITE } from "@/lib/site";

/**
 * schema.org-Event für Liste und Detailseite — an einer Stelle, damit Google
 * und KI-Suchen überall dieselben Fakten (Ort, Einlass, Preis, Künstler) sehen.
 */
export function eventJsonLd(event: EventItem) {
  const url = `${SITE.url}/veranstaltungen/${event.slug}`;
  const isPast = isPastEvent(event);

  return {
    "@context": "https://schema.org",
    "@type": event.schemaType ?? "TheaterEvent",
    "@id": `${url}#event`,
    name: event.title,
    description: event.metaDescription,
    startDate: event.startsAt,
    ...(event.doorTime ? { doorTime: event.doorTime } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE.url}${event.hero.src}`],
    url,
    inLanguage: "de-DE",
    ...(event.keywords?.length ? { keywords: event.keywords.join(", ") } : {}),
    location: {
      "@type": "Restaurant",
      "@id": `${SITE.url}/#restaurant`,
      name: SITE.name,
      url: SITE.url,
      telephone: CONTACT.phone,
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
    ...(event.performer
      ? {
          performer: {
            "@type": "Person",
            name: event.performer.name,
            url: event.performer.url,
            ...(event.performer.sameAs ? { sameAs: event.performer.sameAs } : {}),
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "EUR",
      url: event.ticketUrl,
      ...(event.ticketsFrom ? { validFrom: event.ticketsFrom } : {}),
      availability: isPast
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
    ...(event.video
      ? {
          subjectOf: {
            "@type": "VideoObject",
            name: event.video.title,
            embedUrl: `https://www.youtube-nocookie.com/embed/${event.video.youtubeId}`,
            contentUrl: `https://www.youtube.com/watch?v=${event.video.youtubeId}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${event.video.youtubeId}/hqdefault.jpg`,
          },
        }
      : {}),
  };
}
