import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { DaySection } from "@/components/day-section";
import { GoogleG, GoogleReviews } from "@/components/google-reviews";
import { HeroSlides } from "@/components/hero-slides";
import { IconAbend, IconBrunch, IconEvents } from "@/components/offer-icons";
import { ReserveButton } from "@/components/reserve-chooser";
import { ScrollDay } from "@/components/scroll-day";
import { DINNER_MENU, type Dish } from "@/lib/dinner-menu";
import { upcomingEvents, type EventItem } from "@/lib/events";
import { IMG } from "@/lib/images";
import { BREAKFAST_MENU, type BreakfastDish } from "@/lib/menu";
import { GOOGLE_RATING, REVIEWS } from "@/lib/reviews";
import { CONTACT, SITE } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: `${SITE.name} · Brunch & Abendessen in Sinzing bei Regensburg`,
    description:
      "Wald & Wiese — Brunch & Abendessen in Sinzing bei Regensburg. Täglich Brunch 8–14 Uhr: Frühstück, Brote, Bowls & Mittagstisch, hausgemacht mit Kaffee mit Charakter. Fr–So abends Burger, Bowls & vom Grill. Familiengeführt, regional, hundefreundlich, vegan & vegetarisch.",
    alternates: { canonical: "/" },
  };
}

/* ----------------------------------------------------------------------------
 * Startseite — „Von der Wiese in den Wald" (Redesign 10/2026)
 *
 * Die Seite ist ein Tag am Waldrand: oben Morgenlicht und Brunch, beim
 * Scrollen wird es Abend (Abendessen, Events, Gutscheine). ScrollDay mischt
 * den Hintergrund stufenlos zwischen den Tagesstufen der DaySections.
 *
 * Ein Raster für alles: Label → Überschrift → Text → ein Knopf. Fotos mit
 * 18 px Ecken, keine Rahmen-Kästen, keine Ornamente. Gerichte, Preise und
 * Termine kommen aus lib/, nichts steht hier hart drin.
 * Doku: ../redesign/CI-Website-2026.md
 * ------------------------------------------------------------------------- */

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";
const BTN = "inline-flex h-[50px] items-center justify-center rounded-full px-[26px] text-[0.95rem] font-semibold transition-colors";
const BTN_A = `${BTN} bg-akzent text-white hover:bg-akzent-hover`;
const BTN_O = `${BTN} shadow-[inset_0_0_0_1.5px_currentColor]`;
const LINK = "font-semibold border-b-[1.5px] border-current pb-0.5";
const LABEL = "text-xs font-semibold uppercase tracking-[0.16em] text-akzent";
const H2 = "font-display text-[2rem] font-normal leading-[1.1] md:text-[2.75rem]";
const FOTO = "rounded-[18px] object-cover";

/** Gerichte für die Auszüge — nach Namen aus der Karte geholt, damit Preise
 *  und Beschreibungen nie auseinanderlaufen. Fehlt ein Name, fällt er weg. */
function pick<T extends { name: string }>(menu: Array<{ items: T[] }>, names: string[]): T[] {
  const all = menu.flatMap((c) => c.items);
  return names
    .map((n) => all.find((d) => d.name === n))
    .filter((d): d is T => Boolean(d));
}

const BRUNCH_PICKS = pick<BreakfastDish>(BREAKFAST_MENU, [
  "Der gute alte Sepp",
  "Die grüne Gretl",
  "Morgenstund hat Avocado im Mund",
  "Wiesenschmuserl",
  "Omas Lieblingscurrywurst",
  "Der kleine Hansi",
]);

const ABEND_PICKS = pick<Dish>(DINNER_MENU, [
  "Der klassische Heinzi",
  "Die mähende Moni",
  "Spare Ribs",
  "Pistazientiramisu",
]);

function priceLabel(price: string | string[]): string {
  return Array.isArray(price) ? `${price[0]} · zu zweit ${price[1]}` : price;
}

/** „Sa, 20.02.2027" aus dem ISO-Start. */
function shortDate(e: EventItem): { day: string; rest: string } {
  const d = new Date(e.startsAt);
  const f = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(d);
  const g = (t: string) => f.find((p) => p.type === t)?.value ?? "";
  return { day: `${g("day")}.${g("month")}.`, rest: `${g("weekday")} · ${g("year")}` };
}

function DishRow({ dish, hide }: { dish: BreakfastDish | Dish; hide?: boolean }) {
  const tag = dish.tags?.find((t) => t === "vegan" || t === "vegan möglich" || t === "vegetarisch");
  return (
    <div
      className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t py-4 ${
        hide ? "hidden md:grid" : ""
      }`}
      style={{ borderColor: "var(--linie)" }}
    >
      <b className="font-display text-[1.2rem] font-normal leading-tight md:text-[1.3rem]">
        {dish.name}
        {tag && <span className="ml-2 font-body text-xs font-normal text-muted">{tag}</span>}
      </b>
      <span className="whitespace-nowrap text-[0.95rem] tabular-nums">{priceLabel(dish.price)}</span>
      {dish.desc && <p className="col-span-2 m-0 text-[0.9rem] leading-snug text-muted">{dish.desc}</p>}
    </div>
  );
}

export default function HomePage() {
  const nextEvents = upcomingEvents().slice(0, 2);
  const reviewsJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    url: SITE.url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(GOOGLE_RATING.value),
      reviewCount: GOOGLE_RATING.count,
      bestRating: "5",
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />
      <ScrollDay>
        {/* 1 · HERO — ein Foto, ein Satz, was wir sind und wann. Darunter
            sofort die drei Dinge, die es bei uns gibt, jeweils mit Foto. */}
        <DaySection stage="morgen" className="pt-[92px]">
          <div className="relative isolate flex min-h-[calc(100svh-92px)] items-center justify-center text-center">
            {/* Bewegter Hintergrund aus echten Fotos. Handy: ein Feld, Desktop:
                drei Felder nebeneinander, versetzt überblendend — so wird kein
                Foto über seine Originalbreite gestreckt (Brunch-Foto: 900 px). */}
            <div className="absolute inset-0 -z-20 md:hidden">
              <HeroSlides
                priority
                sizes="100vw"
                slides={[
                  { src: IMG.fruehstueckFoto.src, pos: "center 62%" },
                  { src: IMG.burger.src, pos: "center 55%" },
                  { src: IMG.cocktail.src, pos: "center 40%" },
                  { src: IMG.terrasseOlivenbaum.src, pos: "center 35%" },
                ]}
              />
            </div>
            <div className="absolute inset-0 -z-20 hidden grid-cols-3 md:grid">
              {[
                { offset: 0, slides: [{ src: IMG.fruehstueckFoto.src, pos: "center 65%" }, { src: IMG.terrasseOlivenbaum.src, pos: "center 35%" }] },
                { offset: 2200, slides: [{ src: IMG.wwFood5.src, pos: "center 55%" }, { src: IMG.burger.src, pos: "center 55%" }] },
                { offset: 4400, slides: [{ src: IMG.cocktail.src, pos: "center 40%" }, { src: IMG.gebaeudeAbend.src, pos: "center 60%" }] },
              ].map((panel) => (
                <div key={panel.slides[0].src} className="relative">
                  <HeroSlides priority sizes="34vw" offset={panel.offset} slides={panel.slides} />
                </div>
              ))}
            </div>
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(1,28,13,.72) 0%, rgba(1,28,13,.5) 55%, rgba(1,28,13,.35) 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 md:h-56"
              style={{ background: "linear-gradient(0deg, var(--color-morgen) 0%, rgba(247,244,236,0) 100%)" }}
            />
            <div
              className={`${CONTAINER} hero-in grid justify-items-center gap-4 py-16 text-creme md:gap-5`}
              style={{ textShadow: "0 1px 14px rgba(1,28,13,.5)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8a487]">
                Restaurant in Sinzing bei Regensburg
              </span>
              <h1 className="font-display text-[3rem] font-normal leading-none md:text-[5rem]">
                Wald &amp; Wiese
              </h1>
              <p className="m-0 grid justify-items-center gap-0.5 text-[1.15rem] leading-snug md:text-[1.4rem]">
                <span>Brunch · täglich 8–14 Uhr</span>
                <span>Abendessen · Fr–So 17–22 Uhr</span>
              </p>
              {/* Reservieren steht auf dem Handy schon in der festen Leiste unten. */}
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3" style={{ textShadow: "none" }}>
                <span className="hidden md:inline-flex">
                  <ReserveButton location="hero" className={BTN_A}>
                    Tisch reservieren
                  </ReserveButton>
                </span>
                <Link href="/speisekarte" className={`${BTN_O} text-creme`}>
                  Speisekarte ansehen
                </Link>
              </div>
              <a
                href="#rezensionen"
                className="mt-1 inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-sm text-[#1f1f1f]"
                style={{ textShadow: "none" }}
              >
                <GoogleG className="h-5 w-5" />
                <b className="font-semibold">{GOOGLE_RATING.value.toLocaleString("de-DE")}</b>
                <span className="tracking-[1px] text-[#FBBC04]">★★★★★</span>
                <span className="text-[#5f6368]">{GOOGLE_RATING.count} Bewertungen</span>
              </a>
            </div>
          </div>

          {/* WAS ES BEI UNS GIBT — drei Fotos mit klarer Unterschrift */}
          <div className={`${CONTAINER} pb-20 pt-14 md:pb-28 md:pt-20`}>
            <div className="mx-auto grid max-w-[1040px] grid-cols-3 gap-3 md:gap-8">
              {[
                { Icon: IconBrunch, t: "Brunch", s: "täglich 8–14 Uhr", href: "/speisekarte#fruehstueck" },
                { Icon: IconAbend, t: "Abendessen", s: "Fr–So 17–22 Uhr", href: "/speisekarte#abend" },
                { Icon: IconEvents, t: "Events", s: "Shows & Feiern", href: "/veranstaltungen" },
              ].map((c) => (
                <Link
                  key={c.t}
                  href={c.href}
                  className="group grid content-start justify-items-center gap-1.5 text-center md:gap-3"
                >
                  <span className="mb-1 grid h-16 w-16 place-items-center rounded-full bg-mittag md:h-24 md:w-24 text-tanne transition-transform duration-300 group-hover:-translate-y-1">
                    <c.Icon className="h-8 w-8 md:h-11 md:w-11" />
                  </span>
                  <b className="whitespace-nowrap font-display text-[1.1rem] font-normal leading-tight md:text-[2rem]">{c.t}</b>
                  <span className="whitespace-nowrap text-[0.78rem] leading-snug text-muted md:text-[1.05rem]">{c.s}</span>
                </Link>
              ))}
            </div>
          </div>
        </DaySection>

        {/* 2 · BRUNCH IM GRÜNEN */}
        <DaySection stage="morgen-2" className="py-16 md:py-[104px]">
          <div className={`${CONTAINER} grid items-center gap-9 md:grid-cols-2 md:gap-14`}>
            <div className="grid grid-cols-2 items-end gap-3.5">
              <Image
                src={IMG.terrasseTische.src}
                alt={IMG.terrasseTische.alt}
                width={IMG.terrasseTische.width}
                height={IMG.terrasseTische.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                className={`${FOTO} mb-6 aspect-[4/5] w-full md:mb-10`}
              />
              <Image
                src={IMG.wwFood5.src}
                alt="Tisch am Fenster mit Messinglampe und Blick ins Grüne"
                width={IMG.wwFood5.width}
                height={IMG.wwFood5.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                className={`${FOTO} aspect-[4/5] w-full`}
              />
            </div>
            <div className="grid justify-items-start gap-4 md:gap-[18px]">
              <span className={LABEL}>Morgens · täglich 8 bis 14 Uhr</span>
              <h2 className={H2}>Brunch im Grünen</h2>
              <p className="m-0 max-w-[46ch] leading-relaxed">
                Sauerteigbrote, Bowls, Rührei und Kaffee, der seinen Namen verdient.
                <span className="hidden md:inline">
                  {" "}
                  Ab 11:30 Uhr dazu der Mittagstisch. Draußen auf der Terrasse, drinnen am
                  Fenster, der Hund liegt daneben.
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <ReserveButton location="brunch" pre="brunch" className={BTN_A}>
                  Brunch reservieren
                </ReserveButton>
                <Link href="/speisekarte#fruehstueck" className={LINK}>
                  Zur Brunch-Karte
                </Link>
              </div>
            </div>
          </div>
        </DaySection>

        {/* 3 · AUS DER BRUNCH-KARTE */}
        <DaySection stage="vormittag" className="py-16 md:py-[104px]">
          <div className={CONTAINER}>
            <div className="mb-6 grid gap-3 md:mb-10 md:flex md:items-end md:justify-between">
              <div>
                <span className={LABEL}>Aus der Brunch-Karte</span>
                <h2 className={`${H2} mt-2`}>Bei uns hat jedes Gericht einen Namen</h2>
              </div>
              <Link href="/speisekarte" className={`${LINK} justify-self-start`}>
                Ganze Karte mit Preisen
              </Link>
            </div>
            <div className="grid md:grid-cols-2 md:gap-x-10">
              {BRUNCH_PICKS.map((d, i) => (
                <DishRow key={d.name} dish={d} hide={i >= 4} />
              ))}
            </div>
            <div
              className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-5 text-sm"
              style={{ borderColor: "var(--linie)" }}
            >
              <span className="hidden text-muted md:inline">
                Vegan und vegetarisch stehen gleichberechtigt auf der Karte.
              </span>
              <Link href="/speisekarte" className={LINK}>
                Speisekarte ansehen
              </Link>
            </div>
          </div>
        </DaySection>

        {/* 4 · FAMILIE LEBER — Mittag */}
        <DaySection stage="mittag" className="py-16 md:py-[104px]">
          <div className={`${CONTAINER} grid items-center gap-9 md:grid-cols-[0.8fr_1.2fr] md:gap-16`}>
            <Image
              src={IMG.teamFamilie.src}
              alt={IMG.teamFamilie.alt}
              width={IMG.teamFamilie.width}
              height={IMG.teamFamilie.height}
              sizes="(min-width: 768px) 40vw, 100vw"
              className={`${FOTO} aspect-[4/5] w-full`}
              style={{ objectPosition: "center 20%" }}
            />
            <div className="grid justify-items-start gap-4 md:gap-[18px]">
              <span className={LABEL}>Familie Leber</span>
              <h2 className={H2}>Schön, dass du da bist.</h2>
              <p className="m-0 max-w-[54ch] leading-relaxed">
                Wir sind ein Familienbetrieb am Waldrand von Sinzing. Tanja kocht, Sven mixt,
                und bei uns heißt nichts einfach nur „Burger“: Der Heinzi ist nach unserem
                Hund Henry benannt, Sophias Garten nach Sophia.
              </p>
              <p className="m-0 hidden max-w-[54ch] leading-relaxed md:block">
                Kein Sterne-Tempel, sondern das Lieblingsrestaurant deiner Freunde. Dein Hund
                ist Gast, nicht geduldet.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm font-semibold">
                <span>Familiengeführt</span>
                <span>Hunde willkommen</span>
                <span>Regional &amp; saisonal</span>
                <span>Vegan &amp; vegetarisch</span>
              </div>
              <Link href="/ueber-uns" className={LINK}>
                Mehr über uns
              </Link>
            </div>
          </div>
        </DaySection>

        {/* 5 · DÄMMERUNG — Vollbild-Foto als Übergang hell → dunkel */}
        <DaySection stage="daemmerung" className="relative isolate flex min-h-[600px] items-end md:min-h-[720px]">
          <Image
            src={IMG.gebaeudeAbend.src}
            alt={IMG.gebaeudeAbend.alt}
            fill
            sizes="100vw"
            className="no-reveal -z-20 object-cover"
            style={{ objectPosition: "center 60%" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                // Oben weicher Übergang aus der hellen Sektion, links und unten
                // ein kräftiger Schleier, damit der Text auf dem Foto lesbar bleibt.
                "linear-gradient(180deg, var(--color-mittag) 0%, rgba(1,28,13,0) 20%), linear-gradient(90deg, rgba(1,28,13,.88) 0%, rgba(1,28,13,.7) 45%, rgba(1,28,13,.15) 80%), linear-gradient(0deg, rgba(1,28,13,.9) 0%, rgba(1,28,13,0) 60%)",
            }}
          />
          <div className={`${CONTAINER} grid justify-items-start gap-4 pb-12 pt-32 md:gap-5 md:pb-[72px]`} style={{ textShadow: "0 1px 12px rgba(1,28,13,.55)" }}>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8a487]">Abends · Freitag bis Sonntag, 17 bis 22 Uhr</span>
            <h2 className="max-w-[16ch] font-display text-[2.4rem] font-normal leading-[1.08] md:text-[3.5rem]">
              Wenn es dunkel wird, <em className="font-normal italic">geht bei uns das Licht an.</em>
            </h2>
            <p className="m-0 max-w-[44ch] text-[1.05rem] leading-relaxed text-creme md:text-lg">
              Am Wochenende kochen wir abends weiter: Burger, vom Grill und ein süßes Finale.
              <span className="hidden md:inline"> Sven steht an der Bar.</span>
            </p>
            <ReserveButton location="daemmerung" pre="abend" className={BTN_A}>
              Abend reservieren
            </ReserveButton>
          </div>
        </DaySection>

        {/* 6 · AUS DER ABENDKARTE */}
        <DaySection stage="abend" className="py-16 md:py-[104px]">
          <div className={`${CONTAINER} grid items-center gap-9 md:grid-cols-2 md:gap-14`}>
            <div className="grid justify-items-start gap-4 md:gap-[18px]">
              <span className={LABEL}>Aus der Abendkarte</span>
              <h2 className={H2}>Burger, Grill und Pistazientiramisu</h2>
              <p className="m-0 max-w-[46ch] leading-relaxed">
                Der klassische Heinzi, die mähende Moni mit Ziegenkäse, dazu Cocktails von Sven.
                <span className="hidden md:inline"> Zum Schluss unser Pistazientiramisu.</span>
              </p>
              <div className="w-full">
                {ABEND_PICKS.map((d, i) => (
                  <DishRow key={d.name} dish={d} hide={i >= 3} />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <ReserveButton location="abend" pre="abend" className={BTN_A}>
                  Abend reservieren
                </ReserveButton>
                <Link href="/speisekarte#abend" className={LINK}>
                  Ganze Abendkarte
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 items-end gap-3.5">
              <Image
                src={IMG.burger.src}
                alt={IMG.burger.alt}
                width={IMG.burger.width}
                height={IMG.burger.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                className={`${FOTO} mb-6 aspect-[4/5] w-full md:mb-10`}
              />
              <Image
                src={IMG.cocktail.src}
                alt={IMG.cocktail.alt}
                width={IMG.cocktail.width}
                height={IMG.cocktail.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                className={`${FOTO} aspect-[4/5] w-full`}
              />
            </div>
          </div>
        </DaySection>

        {/* 7 · EVENTS */}
        {nextEvents.length > 0 && (
          <DaySection stage="wald" className="py-16 md:py-[104px]">
            <div className={CONTAINER}>
              <div className="mb-6 grid gap-3 md:mb-10 md:flex md:items-end md:justify-between">
                <div>
                  <span className={LABEL}>Abende mit Programm</span>
                  <h2 className={`${H2} mt-2`}>Krimidinner und Magic Dinner</h2>
                </div>
                <Link href="/veranstaltungen" className={`${LINK} justify-self-start`}>
                  Alle Termine
                </Link>
              </div>
              <div className="grid items-center gap-9 md:grid-cols-2 md:gap-14">
                <Image
                  src={IMG.wwEvent.src}
                  alt="Emilian Leber zaubert beim Magic Dinner vor Gästen im Gastraum"
                  width={IMG.wwEvent.width}
                  height={IMG.wwEvent.height}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`${FOTO} aspect-[3/2] w-full`}
                />
                <div>
                  {nextEvents.map((e) => {
                    const d = shortDate(e);
                    return (
                      <div
                        key={e.slug}
                        className="grid gap-2 border-t py-5 md:grid-cols-[120px_1fr] md:gap-5 last:border-b"
                        style={{ borderColor: "var(--linie)" }}
                      >
                        <span className="font-display text-[1.8rem] leading-none tabular-nums md:text-[2rem]">
                          {d.day}
                          <small className="mt-1.5 block font-body text-[0.8rem] text-muted">
                            {d.rest} · {e.timeLabel}
                          </small>
                        </span>
                        <div>
                          <h3 className="m-0 font-display text-[1.35rem] font-normal leading-tight md:text-[1.5rem]">
                            {e.title}
                          </h3>
                          <p className="mb-3 mt-1 text-[0.95rem] text-muted">
                            {e.kicker} · {e.priceLabel}
                          </p>
                          <Link
                            href={`/veranstaltungen/${e.slug}`}
                            className="inline-flex h-[42px] items-center rounded-full px-[18px] text-sm font-semibold shadow-[inset_0_0_0_1.5px_currentColor]"
                          >
                            Tickets &amp; Infos
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </DaySection>
        )}

        {/* 8 · FEIERN — offene Spalten */}
        <DaySection stage="wald-2" className="py-16 md:py-[104px]">
          <div className={CONTAINER}>
            <div className="mb-6 grid gap-3 md:mb-10 md:flex md:items-end md:justify-between">
              <div>
                <span className={LABEL}>Feiern</span>
                <h2 className={`${H2} mt-2`}>Dein Fest bei uns im Grünen</h2>
              </div>
              <Link href="/feiern" className={`${BTN_O} justify-self-start`}>
                Feier anfragen
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-10">
              {[
                { t: "Geburtstag & Familie", s: "Brunch mit der ganzen Familie oder ein Abend für euch. Wir planen den Tisch mit dir.", href: "/feiern", l: "Anfragen" },
                { t: "Firmenfeier", s: "Teamfrühstück am Morgen oder Abendessen am Wochenende, auf Wunsch mit Zaubershow.", href: "/feiern", l: "Anfragen" },
                { t: "Weihnachtsfeier", s: "Die Termine im Dezember vergeben wir zuerst an die, die früh fragen.", href: "/weihnachtsfeier", l: "Weihnachtsfeier planen" },
              ].map((c) => (
                <div key={c.t} className="grid content-start gap-2.5 border-t pt-5" style={{ borderColor: "var(--linie)" }}>
                  <h3 className="m-0 font-display text-[1.4rem] font-normal leading-tight md:text-[1.6rem]">{c.t}</h3>
                  <p className="m-0 text-[0.95rem] leading-relaxed text-muted">{c.s}</p>
                  <Link href={c.href} className={`${LINK} mt-1 justify-self-start`}>
                    {c.l}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </DaySection>

        {/* 9 · GOOGLE-BEWERTUNGEN */}
        <DaySection stage="tanne" id="rezensionen" className="py-16 md:py-[104px]">
          <div className={CONTAINER}>
            <div className="mb-6 md:mb-10">
              <span className={LABEL}>Gäste über uns</span>
              <h2 className={`${H2} mt-2`}>Das sagen unsere Gäste</h2>
            </div>
            <GoogleReviews limit={4} />
          </div>
        </DaySection>

        {/* 10 · GUTSCHEINE + INSTAGRAM — Nacht (Newsletter folgt in der Fußzeile) */}
        <DaySection stage="nacht" className="py-16 md:py-[104px]">
          <div className={`${CONTAINER} grid items-center gap-9 md:grid-cols-2 md:gap-14`}>
            <div className="grid justify-items-start gap-4 md:gap-[18px]">
              <span className={LABEL}>Verschenken</span>
              <h2 className={H2}>
                Verschenk einen Morgen <em className="font-light italic">oder einen Abend</em> bei uns.
              </h2>
              <p className="m-0 max-w-[46ch] leading-relaxed text-creme/80">
                Wertgutscheine kaufst du online bei BON BON und bekommst sie sofort als PDF.
                <span className="hidden md:inline"> Gilt für Brunch, Abendessen und an der Bar.</span>
              </p>
              <Link href="/gutscheine" className={BTN_A}>
                Gutschein kaufen
              </Link>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`${LINK} mt-2`}
              >
                {CONTACT.instagramHandle} auf Instagram
              </a>
            </div>
            <Image
              src={IMG.wwFood5.src}
              alt="Tisch am Fenster mit Messinglampe und Blick ins Grüne"
              width={IMG.wwFood5.width}
              height={IMG.wwFood5.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`${FOTO} aspect-[4/5] w-full`}
            />
          </div>
        </DaySection>
      </ScrollDay>
    </>
  );
}
