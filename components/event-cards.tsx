import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/lib/events";

/** „23.01." und „Sa · 2027" aus dem ISO-Start (Berlin-Zeit). */
function shortDate(e: EventItem): { day: string; rest: string } {
  const f = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date(e.startsAt));
  const g = (t: string) => f.find((p) => p.type === t)?.value ?? "";
  return { day: `${g("day")}.${g("month")}.`, rest: `${g("weekday")} · ${g("year")}` };
}

/**
 * Terminliste (Redesign 10/2026): Datum groß links, Foto, Titel, Teaser,
 * Preis und Knopf, zwischen den Terminen eine feine Linie. Keine Kästen.
 * Der Ticketkauf bleibt auf der Detailseite (extern beim Veranstalter).
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
  const past = variant === "past";

  return (
    <ul aria-labelledby={headingId} className="m-0 list-none p-0">
      {events.map((e) => {
        const d = shortDate(e);
        return (
          <li
            key={e.slug}
            className="grid gap-5 border-t py-7 last:border-b md:grid-cols-[120px_minmax(0,1fr)_280px] md:gap-8 md:py-9"
            style={{ borderColor: "var(--linie)" }}
          >
            <span className="font-display text-[1.9rem] leading-none tabular-nums md:text-[2.2rem]">
              {d.day}
              <small className="mt-1.5 block font-body text-[0.8rem] text-muted">
                {d.rest} · {e.timeLabel}
              </small>
            </span>
            <div className="min-w-0">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">{e.kicker}</p>
              <h3 className="mt-2 font-display text-[1.5rem] font-normal leading-tight md:text-[1.8rem]">
                <Link href={`/veranstaltungen/${e.slug}`} className="hover:underline underline-offset-4">
                  {e.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-[56ch] leading-relaxed text-muted">{e.teaser}</p>
              <p className="mt-3 text-[0.95rem]">
                <time dateTime={e.startsAt}>{e.dateLabel}, {e.timeLabel}</time>
                {!past && <span className="font-semibold"> · {e.priceLabel}</span>}
              </p>
              <Link
                href={`/veranstaltungen/${e.slug}`}
                className={`mt-4 inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold ${
                  past
                    ? "shadow-[inset_0_0_0_1.5px_currentColor]"
                    : "bg-akzent text-white transition-colors hover:bg-akzent-hover"
                }`}
              >
                {past ? "Nachlesen" : "Tickets & Infos"}
              </Link>
            </div>
            <Link href={`/veranstaltungen/${e.slug}`} className="md:order-none" aria-hidden tabIndex={-1}>
              <Image
                src={e.hero.src}
                alt=""
                width={e.hero.width}
                height={e.hero.height}
                sizes="(min-width: 768px) 280px, 100vw"
                className={`aspect-[3/2] w-full rounded-[18px] object-cover ${past ? "opacity-70 grayscale" : ""}`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
