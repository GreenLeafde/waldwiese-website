import Image from "next/image";
import Link from "next/link";
import { LogoIntro } from "@/components/logo-intro";
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
 * Onepager-Startseite.
 *
 * Reihenfolge bewusst funktional sortiert: erst was man bei uns essen,
 * trinken und buchen kann, dann die Geschichte dahinter, dann Anlässe und
 * Inhalte zum Mitnehmen.
 *
 * Farbrhythmus: weiß ist Standard. Waldgrün als Anker (Intro, Getränke,
 * Kontakt). Mehlcreme einmalig als Beige-Akzent auf der Frühstück-Sektion.
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

export default function HomePage() {
  return (
    <>
      {/* 1 · INTRO */}
      <LogoIntro />

      {/* 1b · Hinweis-Banner direkt unter dem Hero */}
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
            <span className="font-display italic">
              {BREAKFAST_LAUNCH.dateShort}
            </span>{" "}
            in Sinzing.
          </span>
          <span aria-hidden className="text-white/80">→</span>
        </div>
      </a>

      {/* 2 · SPEISEKARTE — Kategorien als klare, lesbare Liste (kein Stock) */}
      <section id="speisekarte" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-4xl px-6 md:px-10 pt-24 md:pt-40 pb-20 md:pb-32">
          {/* Header */}
          <div className="text-center reveal">
            <p className="eyebrow no-line justify-center">Heute Abend</p>
            <h2 className="mt-6 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
              Die Karte.
            </h2>
            <p className="mt-7 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
              Burger, Bowls, vom Grill und süßes Finale. Die ganze Karte mit
              allen Gerichten und Preisen findest du{" "}
              <Link
                href="/abendessen"
                className="underline decoration-tonwarm/40 decoration-2 underline-offset-[6px] hover:decoration-tonwarm hover:text-tonwarm transition-colors"
              >
                hier
              </Link>
              .
            </p>
          </div>

          {/* Kategorien — große, lesbare Liste, verlinkt auf die volle Karte */}
          <ul className="mt-14 md:mt-20 border-t border-stone-200 reveal">
            {menuCategories.map((cat) => (
              <li key={cat.title}>
                <Link
                  href="/abendessen"
                  className="group flex items-center justify-between gap-6 py-7 md:py-8 border-b border-stone-200"
                >
                  <div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-normal tracking-tight text-waldgruen group-hover:text-tonwarm transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 font-display italic text-stone-500 text-base md:text-lg">
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

          {/* CTA */}
          <div className="mt-14 md:mt-20 text-center reveal">
            <Link
              href="/abendessen"
              className="inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Komplette Karte ansehen <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 · GETRÄNKE — dunkel, mit Bild */}
      <section
        id="getraenke"
        className="relative isolate bg-waldgruen text-mehlcreme scroll-mt-24 overflow-hidden"
      >
        <Image
          src={IMG.cocktail.src}
          alt={IMG.cocktail.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          style={{ objectPosition: "center 30%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark via-waldgruen-dark/70 to-waldgruen-dark/30"
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 reveal">
            <p className="eyebrow no-line">Getränke</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] text-mehlcreme tracking-tight">
              Was du{" "}
              <span className="text-tonwarm italic font-normal">dazu trinkst.</span>
            </h2>
            <p className="mt-8 max-w-xl text-mehlcreme/80 leading-relaxed">
              Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
              Cocktails, Schaumweine. Auch entkoffeiniert und alkoholfrei —
              hier kommt jeder auf seinen Geschmack.
            </p>
            <Link
              href="/getraenke"
              className="mt-10 inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Zur Getränkekarte <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 · RESERVIEREN */}
      <section id="reservieren" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-28 md:py-40 text-center reveal">
          <p className="eyebrow no-line justify-center">Reservieren</p>
          <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
            Tisch sichern —{" "}
            <span className="accent">ein Klick.</span>
          </h2>
          <p className="mt-8 max-w-xl mx-auto text-stone-600 leading-relaxed">
            Wir buchen über Lightspeed. Datum wählen, Uhrzeit, Personenzahl —
            fertig. Bestätigung kommt per Mail. Oder ruf einfach an, wenn dir
            das lieber ist.
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
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
              className="inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
          <div className="mt-16 mx-auto max-w-2xl grid sm:grid-cols-2 gap-10 text-left text-sm">
            <div>
              <p className="text-[0.7rem] tracking-[0.22em] uppercase text-stone-400 font-medium">
                Aktuell
              </p>
              <dl className="mt-3 divide-y divide-stone-200">
                {CURRENT_OPENING_HOURS.map((slot) => (
                  <div
                    key={slot.days}
                    className="flex justify-between py-2.5 text-stone-600 gap-4"
                  >
                    <dt className="font-medium text-waldgruen">{slot.days}</dt>
                    <dd className="text-right">{slot.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-stone-400">Di & Mi Ruhetag.</p>
            </div>
            <div>
              <p className="text-[0.7rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                Ab {BREAKFAST_LAUNCH.dateShort}
              </p>
              <dl className="mt-3 divide-y divide-stone-200">
                {NEW_OPENING_HOURS.map((slot) => (
                  <div
                    key={slot.days}
                    className="flex justify-between py-2.5 text-stone-600 gap-4"
                  >
                    <dt className="font-medium text-waldgruen pt-0.5">{slot.days}</dt>
                    <dd className="text-right">
                      {slot.slots.map((s) => (
                        <div key={s}>{s}</div>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-stone-400">
                Fr – So mit Frühstück & Abendservice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · ÜBER UNS */}
      <section
        id="ueber-uns"
        className="bg-white border-t border-stone-200 scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden reveal">
            <Image
              src={IMG.haus.src}
              alt={IMG.haus.alt}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover grayscale-[15%]"
            />
          </div>
          <div className="md:col-span-7 reveal">
            <p className="eyebrow no-line">Über uns</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Ihr{" "}
              <span className="accent">familiengeführtes</span>
              <br />
              Restaurant in Sinzing.
            </h2>
            <div className="mt-10 max-w-xl text-stone-600 leading-relaxed space-y-5">
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
              className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Mehr über uns <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5b · HUNDEFREUNDLICH — Image-Block, dark overlay */}
      <section
        id="hund"
        className="relative isolate bg-waldgruen-dark text-mehlcreme scroll-mt-24 overflow-hidden min-h-[80vh] md:min-h-[85vh] flex items-center"
      >
        <Image
          src={IMG.hundWald.src}
          alt={IMG.hundWald.alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 35%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark/90 via-waldgruen-dark/70 to-waldgruen-dark/30"
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

      {/* 6 · FRÜHSTÜCK — der eine Mehlcreme-Akzent */}
      <section id="fruehstueck" className="bg-mehlcreme scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 md:order-2 relative aspect-[4/5] overflow-hidden reveal">
            <Image
              src={IMG.hero.src}
              alt={IMG.hero.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-6 reveal">
            <p className="eyebrow no-line">Demnächst</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Frühstück,{" "}
              <span className="accent">mitten im Grünen.</span>
            </h2>
            <p className="mt-6 font-display italic text-xl md:text-2xl text-waldgruen/85">
              ab {BREAKFAST_LAUNCH.dateShort} · in Sinzing.
            </p>
            <div className="mt-8 max-w-xl text-stone-600 leading-relaxed space-y-5">
              <p>
                Wir bauen gerade unser Frühstücks-Konzept auf. Brot vom Bäcker
                aus der Region, Obst aus Sinzing, hausgemachte Aufstriche.
                Genau wie zuhause — nur eben früher aufgestanden.
              </p>
              <p>
                Wenn's so weit ist, schicken wir's übers Instagram raus.
              </p>
            </div>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.instagramHandle} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7 · VERANSTALTUNGEN */}
      <section id="veranstaltungen" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden reveal">
            <Image
              src={IMG.sceneFestive.src}
              alt="Innenraum vom Wald & Wiese mit Gästen"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
            />
          </div>
          <div className="md:col-span-7 reveal">
            <p className="eyebrow no-line">Veranstaltungen</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Wenn der Anlass{" "}
              <span className="accent">groß ist.</span>
            </h2>
            <p className="mt-8 max-w-xl text-stone-600 leading-relaxed">
              Hochzeit, Geburtstag, Firmenfeier oder einfach ein Abend mit
              vielen Menschen, die du magst. Wir planen mit dir — ehrlich
              gekocht, mit viel Liebe und ohne Schickimicki.
            </p>
            <a
              href={`mailto:${CONTACT.email}?subject=Anfrage%20Veranstaltung`}
              className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Anfrage schicken <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8 · EVENTS — kurz und ruhig */}
      <section
        id="events"
        className="bg-stone-soft scroll-mt-24 border-y border-stone-200"
      >
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
          <p className="eyebrow no-line justify-center">Events · {MAGIC_DINNER.dateShort}</p>
          <h2 className="mt-7 text-4xl md:text-5xl font-display font-normal leading-[1.1] tracking-tight text-waldgruen">
            Magic Dinner —{" "}
            <span className="accent">Summer Edition.</span>
          </h2>
          <p className="mt-7 max-w-xl mx-auto text-stone-600 leading-relaxed">
            Mehrgängiges Menü, dazwischen Tischzauberei von{" "}
            {MAGIC_DINNER.magicianName} alias {MAGIC_DINNER.magicianStageName}.
            Plätze begrenzt.
          </p>
          <Link
            href="/events/magic-dinner-summer-edition"
            className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
          >
            Programm & Tisch sichern <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* 9 · REZEPTE */}
      <section id="rezepte" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7 reveal">
            <p className="eyebrow no-line">Rezepte</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Mitkochen{" "}
              <span className="accent">zuhause.</span>
            </h2>
            <p className="mt-8 max-w-xl text-stone-600 leading-relaxed">
              Unser Pistazientiramisu — über 1.500 Mal verkauft. Bald gibt's
              das Rezept hier zum Nachmachen. Und ein paar andere
              Lieblingsgerichte dazu.
            </p>
            <Link
              href="/rezepte"
              className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Zu den Rezepten <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="md:col-span-5 relative aspect-square overflow-hidden reveal">
            <Image
              src={IMG.dessert.src}
              alt={IMG.dessert.alt}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 10 · KONTAKT — dunkler Anker am Ende, fließt nahtlos in den Footer */}
      <section
        id="kontakt"
        className="bg-waldgruen text-mehlcreme scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-28 md:py-40 grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-6 reveal">
            <p className="eyebrow no-line">Kontakt</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal text-mehlcreme leading-[1.05] tracking-tight">
              Komm{" "}
              <span className="text-tonwarm italic font-normal">vorbei.</span>
            </h2>
            <p className="mt-8 max-w-md text-mehlcreme/80 leading-relaxed">
              Bruckdorfer Straße 42, Sinzing — direkt vor dem Wald, mit
              eigenem Parkplatz. Hund mitbringen ist selbstverständlich.
            </p>
          </div>

          <div className="md:col-span-6 reveal grid sm:grid-cols-2 gap-10 text-sm">
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
              <p className="mt-4 text-xs text-mehlcreme/55">
                Di & Mi Ruhetag.
              </p>
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
