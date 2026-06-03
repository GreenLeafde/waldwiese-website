import Image from "next/image";
import Link from "next/link";
import { LogoIntro } from "@/components/logo-intro";
import { LeafDivider } from "@/components/leaf-divider";
import { LeafOrnament } from "@/components/leaf-ornament";
import { GrowingVine } from "@/components/growing-vine";
import { StampBadge } from "@/components/stamp-badge";
import { ReviewsSection } from "@/components/reviews-section";
import { GOOGLE_RATING, REVIEWS } from "@/lib/reviews";
import { IMG } from "@/lib/images";
import {
  BREAKFAST_LAUNCH,
  CONTACT,
  CURRENT_OPENING_HOURS,
  MAGIC_DINNER,
  NEW_OPENING_HOURS,
  RESERVATION_URL,
  SITE,
} from "@/lib/site";

export const metadata = {
  title: `${SITE.name} · Familiengeführtes Restaurant in Sinzing`,
  description:
    "Wald & Wiese — Sinzing bei Regensburg. Familiengeführt, regional, ehrlich. Heute Abend für dich da — bald auch zum Frühstück mitten im Grünen.",
  alternates: { canonical: "/" },
};

/* ----------------------------------------------------------------------------
 * Onepager-Startseite — Redesign nach der Brunch-Karte 2026.
 *
 * Leitidee:
 *   - GRÜN trägt die Seite. Beige nur ein einziges Mal (familiäre „Über uns").
 *   - Jede Sektion ist ein Vollbild (min-h-svh), Inhalt vertikal zentriert.
 *   - Bilder gezielt & nie gestapelt: drei echte Foto-Sektionen (Frühstück,
 *     Hund, Terrasse), dazwischen immer eine grüne Typo-Sektion.
 *   - Botanik (wiegende Blatt-Ornamente, Blatt-Trenner) + Scroll-Reveals +
 *     sanfter Parallax auf den Fotos sorgen fürs „lieblich" Durchscrollen.
 *   - Serif nur für große Headings; Beschreibungen in kursivem Sans.
 * ------------------------------------------------------------------------- */

/** Startseite zeigt nur die Kategorien + je ein konkretes Highlight — nicht
 *  die ganze Karte. Details & Preise stehen auf /abendessen. Keine Food-Stock-
 *  Bilder (echte Gericht-Fotos liegen noch nicht vor). */
const menuCategories: Array<{ title: string; highlight: string }> = [
  { title: "Beginner", highlight: "Rote Bete Carpaccio · Gemüse im Tempurateig" },
  { title: "Burger", highlight: "Die mähende Moni · Der fetzige Sven · Heinzi" },
  {
    title: "Schüssel voller Glück",
    highlight: "Prinzessin auf der Kichererbse · Caesar",
  },
  { title: "Vom Grill", highlight: "Steak, Spare Ribs & Teriyaki-Lachs" },
  { title: "Finale", highlight: "Pistazientiramisu · Krachender Crumble" },
];

/** Wiegende Blatt-Ornamente in den seitlichen Freiräumen grüner Sektionen.
 *  Erst ab xl sichtbar, damit sie auf schmalen Screens nichts überlagern. */
function SideLeaves({
  flip = false,
}: {
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden xl:block"
    >
      <div
        className={`absolute ${
          flip ? "right-[4%] 2xl:right-[8%]" : "left-[4%] 2xl:left-[8%]"
        } top-1/2 -translate-y-1/2 h-[46%] max-h-[330px] w-auto sway opacity-80`}
      >
        <LeafOrnament variant="leaves-berries" className="h-full w-auto" />
      </div>
      <div
        className={`absolute ${
          flip ? "left-[4%] 2xl:left-[8%]" : "right-[4%] 2xl:right-[8%]"
        } top-1/2 -translate-y-1/2 h-[46%] max-h-[330px] w-auto sway-slow opacity-80`}
      >
        <LeafOrnament variant="berries-stem" className="h-full w-auto" />
      </div>
    </div>
  );
}

/** Wachsende Ranke in einer Seitenkante grüner Sektionen (zeichnet sich beim
 *  Scrollen). Erst ab xl sichtbar, damit auf schmaleren Screens nichts mit dem
 *  Inhalt kollidiert. */
function SideVine({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 hidden xl:block h-[55%] max-h-[440px] ${
        side === "left" ? "left-2 2xl:left-[5%]" : "right-2 2xl:right-[5%]"
      }`}
    >
      <GrowingVine flip={side === "right"} className="h-full w-auto" />
    </div>
  );
}

export default function HomePage() {
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
      {/* Marker: aktiviert Sektions-Snap NUR auf der Startseite (globals.css) */}
      <div className="snap-home" aria-hidden hidden />

      {/* 1 · INTRO — Waldgrün-Wortmarke, sticky, Vollbild */}
      <LogoIntro />

      {/* 1b · Hinweis-Banner — schmaler Tonwarm-Akzent, kein Vollbild */}
      <a
        href="#fruehstueck"
        className="block bg-tonwarm text-white hover:bg-tonwarm-dark transition-colors"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-4 md:py-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-sm md:text-base">
          <span className="text-[0.7rem] md:text-xs tracking-[0.28em] uppercase text-white/75">
            Demnächst
          </span>
          <span className="font-medium">
            Frühstück mitten im Grünen — ab{" "}
            <span className="italic">{BREAKFAST_LAUNCH.dateShort}</span> in
            Sinzing.
          </span>
          <span aria-hidden className="text-white/80">
            →
          </span>
        </div>
      </a>

      {/* 2 · SPEISEKARTE — grün, große Serif-Headline, Kategorien als Liste */}
      <section
        id="speisekarte"
        className="relative isolate min-h-svh flex items-center bg-waldgruen text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <SideVine side="left" />
        <div className="relative w-full mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-28">
          <div className="text-center reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Heute Abend
            </p>
            <h2 className="mt-6 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
              Die Karte.
            </h2>
            <p className="mt-7 italic text-lg md:text-xl text-mehlcreme/75 max-w-xl mx-auto leading-relaxed">
              Burger, Bowls, vom Grill und süßes Finale. Die ganze Karte mit
              allen Gerichten und Preisen findest du{" "}
              <Link
                href="/abendessen"
                className="not-italic underline decoration-tonwarm/50 decoration-2 underline-offset-[6px] hover:decoration-tonwarm hover:text-tonwarm transition-colors"
              >
                hier
              </Link>
              .
            </p>
          </div>

          {/* Kategorien — große, lesbare Liste, verlinkt auf die volle Karte */}
          <ul className="mt-12 md:mt-16 border-t border-mehlcreme/15 reveal-1">
            {menuCategories.map((cat) => (
              <li key={cat.title}>
                <Link
                  href="/abendessen"
                  className="group flex items-center justify-between gap-6 py-6 md:py-7 border-b border-mehlcreme/15"
                >
                  <div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-normal tracking-tight text-mehlcreme group-hover:text-tonwarm transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 italic text-mehlcreme/55 text-base md:text-lg">
                      {cat.highlight}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 text-tonwarm text-2xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 md:mt-16 text-center reveal-2">
            <Link
              href="/abendessen"
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Komplette Karte ansehen <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 · FRÜHSTÜCK — Vollbild-Foto (echtes Gästefoto) mit grünem Schleier */}
      <section
        id="fruehstueck"
        className="relative isolate min-h-svh flex items-center text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <Image
          src={IMG.fruehstueckFoto.src}
          alt={IMG.fruehstueckFoto.alt}
          fill
          sizes="100vw"
          className="object-cover parallax"
          style={{ objectPosition: "center 55%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark/95 via-waldgruen-dark/75 to-waldgruen-dark/35"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark/80 via-transparent to-transparent"
        />
        {/* Stempel frei in der Ecke — überlappt den Text nicht */}
        <StampBadge
          tone="light"
          rotate={-8}
          className="hidden sm:grid absolute z-10 top-24 right-6 md:right-12 lg:right-20 w-28 h-28 md:w-32 md:h-32"
        >
          <span className="block text-[0.5rem] tracking-[0.2em] uppercase text-mehlcreme/80">
            Neu ab
          </span>
          <span className="block font-display text-base md:text-lg mt-0.5">
            {BREAKFAST_LAUNCH.dateShort}
          </span>
        </StampBadge>
        <div className="relative w-full mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
          <div className="max-w-xl reveal">
            <p className="eyebrow no-line text-tonwarm">Demnächst</p>
            <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Frühstück,{" "}
              <span className="accent">mitten im Grünen.</span>
            </h2>
            <p className="mt-6 italic text-xl md:text-2xl text-mehlcreme/85">
              ab {BREAKFAST_LAUNCH.dateShort} · in Sinzing.
            </p>
            <div className="mt-7 text-mehlcreme/80 leading-relaxed space-y-5">
              <p>
                Wir bauen gerade unser Frühstücks-Konzept auf. Brot vom Bäcker
                aus der Region, Obst aus Sinzing, hausgemachte Aufstriche. Genau
                wie zuhause — nur eben früher aufgestanden.
              </p>
              <p>Wenn&apos;s so weit ist, schicken wir&apos;s übers Instagram raus.</p>
            </div>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.instagramHandle} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4 · GETRÄNKE — dunkles Grün, ruhig, mit Botanik (kein Stock-Foto) */}
      <section
        id="getraenke"
        className="relative isolate min-h-svh flex items-center bg-waldgruen-dark text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <SideLeaves flip />
        <div className="relative w-full mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Getränke
            </p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] text-mehlcreme tracking-tight">
              Was du{" "}
              <span className="accent">dazu trinkst.</span>
            </h2>
          </div>
          <p className="mt-8 max-w-xl mx-auto text-mehlcreme/80 leading-relaxed reveal-1">
            Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
            Cocktails, Schaumweine. Auch entkoffeiniert und alkoholfrei — hier
            kommt jeder auf seinen Geschmack.
          </p>
          <div className="mt-10 reveal-2">
            <Link
              href="/getraenke"
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Zur Getränkekarte <span aria-hidden>→</span>
            </Link>
          </div>
          <LeafDivider tone="light" className="mt-14 opacity-80" />
        </div>
      </section>

      {/* 5 · ÜBER UNS — der EINE beige Akzent: familiär, lieblich, mit Familienfoto */}
      <section
        id="ueber-uns"
        className="relative isolate min-h-svh flex items-center bg-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <div className="relative w-full mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl reveal-scale">
              <Image
                src={IMG.teamFamilie.src}
                alt={IMG.teamFamilie.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="md:col-span-7 reveal-1">
              <p className="eyebrow no-line">Über uns</p>
              <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
                Dein{" "}
                <span className="accent">familiengeführtes</span>
                <br />
                Restaurant in Sinzing.
              </h2>
              <div className="mt-9 max-w-xl text-waldgruen/75 leading-relaxed space-y-5">
                <p>
                  Wir sind die Familie Leber — Tanja, Sven, Sophia, Julia und
                  Emilian. Klein, fein, ehrlich. Mehr Frühstückstisch als feines
                  Restaurant.
                </p>
                <p>
                  Was hier wächst, kommt auf den Teller. Vegan, vegetarisch und
                  herzhaft, gleichberechtigt auf der Karte.
                </p>
              </div>
              <Link
                href="/ueber-uns"
                className="mt-9 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
              >
                Mehr über uns <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <LeafDivider tone="dark" className="mt-16 md:mt-20 opacity-90" />
        </div>
      </section>

      {/* 6 · RESERVIEREN — grün, Öffnungszeiten + CTA (Puffer zwischen zwei Fotos) */}
      <section
        id="reservieren"
        className="relative isolate min-h-svh flex items-center bg-waldgruen text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <SideVine side="right" />
        <div className="relative w-full mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Reservieren
            </p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Tisch sichern —{" "}
              <span className="accent">ein Klick.</span>
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-mehlcreme/80 leading-relaxed">
              Wir buchen über Lightspeed. Datum wählen, Uhrzeit, Personenzahl —
              fertig. Bestätigung kommt per Mail. Oder ruf einfach an, wenn dir
              das lieber ist.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5 reveal-1">
            <a
              href={RESERVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Online reservieren <span aria-hidden>→</span>
            </a>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
          <div className="mt-14 mx-auto max-w-2xl grid sm:grid-cols-2 gap-10 text-left text-sm reveal-2">
            <div>
              <p className="text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/55 font-medium">
                Aktuell
              </p>
              <dl className="mt-3 divide-y divide-mehlcreme/15">
                {CURRENT_OPENING_HOURS.map((slot) => (
                  <div
                    key={slot.days}
                    className="flex justify-between py-2.5 text-mehlcreme/80 gap-4"
                  >
                    <dt className="font-medium text-mehlcreme">{slot.days}</dt>
                    <dd className="text-right">{slot.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-mehlcreme/45">Di & Mi Ruhetag.</p>
            </div>
            <div>
              <p className="text-[0.7rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                Ab {BREAKFAST_LAUNCH.dateShort}
              </p>
              <dl className="mt-3 divide-y divide-mehlcreme/15">
                {NEW_OPENING_HOURS.map((slot) => (
                  <div
                    key={slot.days}
                    className="flex justify-between py-2.5 text-mehlcreme/80 gap-4"
                  >
                    <dt className="font-medium text-mehlcreme pt-0.5">
                      {slot.days}
                    </dt>
                    <dd className="text-right">
                      {slot.slots.map((s) => (
                        <div key={s}>{s}</div>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-mehlcreme/45">
                Fr – So mit Frühstück & Abendservice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · HUNDEFREUNDLICH — Vollbild-Foto (echte Hunde im Wald) + grüner Schleier */}
      <section
        id="hund"
        className="relative isolate min-h-svh flex items-center text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <Image
          src={IMG.hundWald.src}
          alt={IMG.hundWald.alt}
          fill
          sizes="100vw"
          className="object-cover parallax"
          style={{ objectPosition: "center 35%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark/90 via-waldgruen-dark/65 to-waldgruen-dark/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark/80 via-transparent to-transparent"
        />
        <div className="relative w-full mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="reveal">
            <p className="eyebrow no-line text-tonwarm justify-center">
              Hundefreundliches Restaurant in Sinzing
            </p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Dein Hund ist nicht nur erlaubt, sondern{" "}
              <span className="accent">herzlich willkommen.</span>
            </h2>
            <div className="mt-10">
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                Tisch reservieren <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · EVENTS — Magic Dinner, dunkles Grün, mittig, mit Datum-Stempel */}
      <section
        id="events"
        className="relative isolate min-h-svh flex items-center bg-waldgruen-dark text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <SideLeaves flip />
        <div className="relative w-full mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="flex justify-center reveal">
            <StampBadge tone="light" rotate={-6} className="w-28 h-28 md:w-32 md:h-32">
              <span className="block text-[0.55rem] tracking-[0.22em] uppercase text-mehlcreme/80">
                Save the date
              </span>
              <span className="block font-display text-base md:text-lg mt-0.5">
                {MAGIC_DINNER.dateShort}
              </span>
            </StampBadge>
          </div>
          <h2 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.1] tracking-tight text-mehlcreme reveal-1">
            Magic Dinner —{" "}
            <span className="accent">Summer Edition.</span>
          </h2>
          <p className="mt-7 max-w-xl mx-auto text-mehlcreme/80 leading-relaxed reveal-2">
            Mehrgängiges Menü, dazwischen Tischzauberei von{" "}
            {MAGIC_DINNER.magicianName} alias {MAGIC_DINNER.magicianStageName}.
            Plätze begrenzt.
          </p>
          <div className="mt-10 reveal-3">
            <Link
              href="/events/magic-dinner-summer-edition"
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Programm &amp; Tisch sichern <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9 · VERANSTALTUNGEN — Vollbild-Foto (echte Terrasse) + grüner Schleier */}
      <section
        id="veranstaltungen"
        className="relative isolate min-h-svh flex items-center text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <Image
          src={IMG.terrasseTische.src}
          alt={IMG.terrasseTische.alt}
          fill
          sizes="100vw"
          className="object-cover parallax"
          style={{ objectPosition: "center 50%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark/92 via-waldgruen-dark/70 to-waldgruen-dark/30"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark/80 via-transparent to-transparent"
        />
        <div className="relative w-full mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32">
          <div className="max-w-xl reveal">
            <p className="eyebrow no-line text-tonwarm">Veranstaltungen</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Wenn der Anlass{" "}
              <span className="accent">groß ist.</span>
            </h2>
            <p className="mt-8 text-mehlcreme/85 leading-relaxed">
              Hochzeit, Geburtstag, Firmenfeier oder einfach ein Abend mit
              vielen Menschen, die du magst. Wir planen mit dir — ehrlich
              gekocht, mit viel Liebe und ohne Schickimicki.
            </p>
            <a
              href={`mailto:${CONTACT.email}?subject=Anfrage%20Veranstaltung`}
              className="mt-9 inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Anfrage schicken <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 10 · REZEPTE — grün, Typo (Stock-Dessertbild entfernt) */}
      <section
        id="rezepte"
        className="relative isolate min-h-svh flex items-center bg-waldgruen text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <SideVine side="left" />
        <div className="relative w-full mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">Rezepte</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Mitkochen{" "}
              <span className="accent">zuhause.</span>
            </h2>
          </div>
          <p className="mt-8 max-w-xl mx-auto text-mehlcreme/80 leading-relaxed reveal-1">
            Unser Pistazientiramisu — über 1.500 Mal verkauft. Bald gibt&apos;s
            das Rezept hier zum Nachmachen. Und ein paar andere
            Lieblingsgerichte dazu.
          </p>
          <div className="mt-10 reveal-2">
            <Link
              href="/rezepte"
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Zu den Rezepten <span aria-hidden>→</span>
            </Link>
          </div>
          <LeafDivider tone="light" className="mt-14 opacity-80" />
        </div>
      </section>

      {/* 11 · REZENSIONEN — echte Google-Bewertungen (jetzt auf Grün) */}
      <ReviewsSection />

      {/* 12 · KONTAKT — dunkler Anker am Ende, fließt nahtlos in den Footer */}
      <section
        id="kontakt"
        className="relative isolate min-h-svh flex items-center bg-waldgruen-dark text-mehlcreme scroll-mt-24 overflow-hidden snap-sec"
      >
        <div className="relative w-full mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-6 reveal">
            <p className="eyebrow no-line text-tonwarm">Kontakt</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal text-mehlcreme leading-[1.05] tracking-tight">
              Komm{" "}
              <span className="accent">vorbei.</span>
            </h2>
            <p className="mt-8 max-w-md text-mehlcreme/80 leading-relaxed">
              Bruckdorfer Straße 42, Sinzing — direkt vor dem Wald, mit eigenem
              Parkplatz. Hund mitbringen ist selbstverständlich.
            </p>
          </div>

          <div className="md:col-span-6 reveal-1 grid sm:grid-cols-2 gap-10 text-sm">
            <div>
              <p className="eyebrow no-line text-tonwarm">Adresse</p>
              <address className="not-italic mt-4 leading-relaxed text-mehlcreme/90">
                {CONTACT.street}
                <br />
                {CONTACT.postalCode} {CONTACT.city}
              </address>
              <div className="mt-6 space-y-1.5 text-mehlcreme/90">
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  className="block hover:text-tonwarm"
                >
                  {CONTACT.phone}
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="block hover:text-tonwarm break-all"
                >
                  {CONTACT.email}
                </a>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-tonwarm"
                >
                  {CONTACT.instagramHandle}
                </a>
              </div>
            </div>
            <div>
              <p className="eyebrow no-line text-tonwarm">Öffnungszeiten</p>
              <dl className="mt-4 space-y-2 text-mehlcreme/90">
                {CURRENT_OPENING_HOURS.map((slot) => (
                  <div key={slot.days} className="flex justify-between gap-4">
                    <dt>{slot.days}</dt>
                    <dd>{slot.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-mehlcreme/55">Di & Mi Ruhetag.</p>
              <div className="mt-6 pt-5 border-t border-mehlcreme/15">
                <p className="text-[0.7rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  Ab {BREAKFAST_LAUNCH.dateShort}
                </p>
                <dl className="mt-3 space-y-2 text-mehlcreme/80 text-[0.78rem]">
                  {NEW_OPENING_HOURS.map((slot) => (
                    <div
                      key={slot.days}
                      className="flex justify-between gap-4 items-start"
                    >
                      <dt>{slot.days}</dt>
                      <dd className="text-right">
                        {slot.slots.map((s) => (
                          <div key={s}>{s}</div>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
