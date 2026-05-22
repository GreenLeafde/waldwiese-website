import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";
import { MAGIC_DINNER } from "@/lib/site";

export const metadata = {
  title: "Über uns — Familie Leber",
  description:
    "Wir sind die Familie Leber — Tanja, Sven, Sophia, Julia und Emilian. Klein, fein und ehrlich. Wald & Wiese in Sinzing bei Regensburg.",
};

export default function UeberUnsPage() {
  return (
    <>
      {/* HEADER */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-stone-400 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center">
          <p className="eyebrow no-line justify-center">
            Familie Leber · Sinzing
          </p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Klein, fein,{" "}
            <span className="accent">& ehrlich.</span>
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Wir sind die Familie Leber — Tanja, Sven, Sophia, Julia und
            Emilian. Kein Sterne-Tempel, eher das Lieblingsrestaurant deiner
            Freunde. Nur eben mit besserem Pistazientiramisu.
          </p>
        </div>
      </section>

      {/* FAMILIENFOTO — full bleed */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pb-20 md:pb-28">
          <div className="relative aspect-[3/4] sm:aspect-[16/10] overflow-hidden reveal">
            <Image
              src={IMG.teamFamilie.src}
              alt={IMG.teamFamilie.alt}
              fill
              priority
              sizes="(min-width: 768px) 90vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
          <p className="mt-4 text-center text-xs tracking-[0.22em] uppercase text-stone-400">
            Tanja · Sven · Sophia · Julia · Emilian
          </p>
        </div>
      </section>

      {/* GESCHICHTE */}
      <section className="bg-white">
        <div className="mx-auto max-w-2xl px-6 md:px-10 pb-24 md:pb-32 reveal">
          <p className="eyebrow no-line">Unsere Geschichte</p>
          <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
            Familie + Crew —{" "}
            <span className="accent">ein Tisch.</span>
          </h2>
          <div className="mt-9 space-y-5 text-stone-600 leading-relaxed text-base md:text-lg">
            <p>
              Was uns ausmacht ist das Miteinander. Entscheidungen treffen wir
              gemeinsam, wir unterstützen uns im Alltag und bringen unsere
              Persönlichkeit in das ein, was wir tun. Diese familiäre
              Atmosphäre soll man bei uns spüren — vom ersten Moment an.
            </p>
            <p>
              Wer zu uns kommt, ist nicht einfach Gast, sondern willkommen
              bei unserer Familie. Hund liegt mit auf der Karte, Heinzi-Burger
              heißt nach unserem Hund Henry, und die Prinzessin auf der
              Kichererbse kommt direkt aus dem Märchenbuch.
            </p>
          </div>
        </div>
      </section>

      {/* SVEN AN DER BAR */}
      <section className="bg-stone-soft border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 relative aspect-[3/4] overflow-hidden reveal">
            <Image
              src={IMG.teamSven.src}
              alt={IMG.teamSven.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 25%" }}
            />
          </div>
          <div className="md:col-span-6 reveal">
            <p className="eyebrow no-line">Sven · Bar</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              An der Bar steht{" "}
              <span className="accent">Sven.</span>
            </h2>
            <p className="mt-8 text-stone-600 leading-relaxed max-w-lg">
              Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
              Cocktails, Schaumweine. Sven mixt für jeden Anlass die
              passenden Drinks — auch entkoffeiniert und alkoholfrei.
            </p>
            <Link
              href="/getraenke"
              className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Zur Getränkekarte <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KÜCHENTEAM / TANJA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 md:order-2 relative aspect-square overflow-hidden reveal">
            <Image
              src={IMG.teamKueche.src}
              alt={IMG.teamKueche.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-6 md:order-1 reveal">
            <p className="eyebrow no-line">Tanja · Küche & Patisserie</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              In der Küche kocht{" "}
              <span className="accent">Tanja.</span>
            </h2>
            <p className="mt-8 text-stone-600 leading-relaxed max-w-lg">
              Patissière aus Leidenschaft. Mit Julia in der Küche, mit dem
              ganzen Service-Team an ihrer Seite. Hier ist nichts vom Band —
              Dips, Aufstriche, Desserts hausgemacht, regional und saisonal.
            </p>
            <blockquote className="mt-8 font-display italic text-lg md:text-xl text-stone-600 leading-relaxed max-w-lg">
              „Ein Dessert ist für mich mehr als nur ein süßer Abschluss — es
              ist ein Moment der Freude."
            </blockquote>
            <Link
              href="/rezepte/pistazientiramisu"
              className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Tanjas Pistazientiramisu-Rezept <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* EMILIAN / MAGICEL */}
      <section className="bg-stone-soft border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 relative aspect-[3/4] overflow-hidden reveal">
            <Image
              src={IMG.magicBalloon.src}
              alt={IMG.magicBalloon.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
          <div className="md:col-span-6 reveal">
            <p className="eyebrow no-line">Emilian Leber · alias Magicel</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Emilian{" "}
              <span className="accent">zaubert.</span>
            </h2>
            <p className="mt-8 text-stone-600 leading-relaxed max-w-lg">
              Emilian Leber, Bühnenname Magicel. Auftrittsmagier für
              Hochzeiten, Firmenfeiern und Events. Beim Magic Dinner wandert
              er zwischen den Tischen und sorgt für Momente, von denen am Tag
              danach noch geredet wird.
            </p>
            <Link
              href="/events/magic-dinner-summer-edition"
              className="mt-10 inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Magic Dinner · {MAGIC_DINNER.dateShort}{" "}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* HAUS */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32">
          <div className="text-center mb-12 reveal">
            <p className="eyebrow no-line justify-center">Bruckdorfer Straße 42</p>
            <h2 className="mt-7 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-waldgruen">
              Mitten in{" "}
              <span className="accent">Sinzing.</span>
            </h2>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden reveal">
            <Image
              src={IMG.haus.src}
              alt={IMG.haus.alt}
              fill
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* WAS UNS WICHTIG IST */}
      <section className="relative isolate bg-waldgruen-dark text-mehlcreme overflow-hidden">
        <Image
          src={IMG.hundWald.src}
          alt={IMG.hundWald.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          style={{ objectPosition: "center 30%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark via-waldgruen-dark/85 to-waldgruen-dark/40"
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-36">
          <div className="max-w-2xl reveal">
            <p className="eyebrow no-line text-tonwarm">Was uns wichtig ist</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Bodenständig, modern,{" "}
              <span className="accent">ohne Schnickschnack.</span>
            </h2>
            <p className="mt-9 text-mehlcreme/85 leading-relaxed text-base md:text-lg max-w-xl">
              Was hier wächst, kommt auf den Teller. Ehrlich, ohne
              Etikettenschwindel. Vegan und vegetarisch gleichberechtigt auf
              der Karte. Hund willkommen — drinnen und draußen.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
