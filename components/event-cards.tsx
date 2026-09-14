import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/lib/events";

/**
 * Karten-Liste der Veranstaltungen — Aufbau wie die Ratgeber-/Rezept-Karten:
 * Bild, Datums-Band, Titel, Teaser, Link auf die Detailseite. Der Ticketkauf
 * bleibt bewusst auf der Detailseite (und geht dort zum externen Veranstalter).
 */
export function EventCards({
  events,
  headingId,
  variant = "upcoming",
}: {
  events: EventItem[];
  headingId?: string;
  variant?: "upcoming" | "past";
}) {
  if (events.length === 0) return null;

  return (
    <ul
      aria-labelledby={headingId}
      className="grid gap-8 md:grid-cols-2 reveal-1"
    >
      {events.map((e) => (
        <li key={e.slug} className="h-full">
          <Link
            href={`/veranstaltungen/${e.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl bg-mehlcreme ring-1 ring-mehlcreme/15 shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative aspect-[27/20] overflow-hidden">
              <Image
                src={e.hero.src}
                alt={e.hero.alt}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className={`object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
                  variant === "past" ? "grayscale opacity-70" : ""
                }`}
              />
              <span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-waldgruen/90 px-4 py-1.5 text-[0.7rem] tracking-[0.16em] uppercase text-mehlcreme backdrop-blur-sm">
                {variant === "past" ? "Vorbei" : e.dateLabel}
              </span>
            </div>

            {/* text-waldgruen am Container: globales `h1–h5 { color: inherit }`
                schlägt sonst die Utility-Klasse direkt auf der Überschrift. */}
            <div className="flex flex-1 flex-col p-8 md:p-9 text-waldgruen">
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                {e.kicker}
              </p>
              <h3 className="mt-4 text-2xl md:text-[1.75rem] font-display font-normal leading-tight tracking-tight">
                <span className="group-hover:text-tonwarm-dark transition-colors">
                  {e.title}
                </span>
              </h3>
              <p className="mt-4 text-waldgruen/65 leading-relaxed">
                {e.teaser}
              </p>

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-waldgruen/70">
                <div className="flex items-baseline gap-2">
                  <dt className="sr-only">Beginn</dt>
                  <dd>
                    <time dateTime={e.startsAt}>
                      {e.dateLabel}, {e.timeLabel}
                    </time>
                  </dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="sr-only">Preis</dt>
                  <dd className="font-medium text-waldgruen">{e.priceLabel}</dd>
                </div>
              </dl>

              <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-tonwarm">
                {variant === "past" ? "Nachlesen" : "Details & Tickets"}{" "}
                <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
