import Image from "next/image";
import Link from "next/link";
import { LeafDivider } from "@/components/leaf-divider";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH } from "@/lib/site";

export const metadata = {
  title: "Über uns — Familie Leber",
  description:
    "Wir sind die Familie Leber — Tanja, Sven, Sophia, Julia und Emilian. Klein, fein und ehrlich. Wald & Wiese in Sinzing bei Regensburg — ab 6. Juli 2026 auch zum Frühstück.",
  alternates: { canonical: "/ueber-uns" },
};

export default function UeberUnsPage() {
  return (
    <>
      {/* HEADER */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            Familie Leber · Sinzing
          </p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Klein, fein,{" "}
            <span className="accent">& ehrlich.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Wir sind die Familie Leber — Tanja, Sven, Sophia, Julia und
            Emilian. Kein Sterne-Tempel, eher das Lieblingsrestaurant deiner
            Freunde. Nur eben mit besserem Pistazientiramisu.
          </p>
        </div>
      </section>

      {/* FAMILIENFOTO — echtes Familienfoto, weich gerahmt auf Grün */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pb-20 md:pb-28">
          <div className="relative aspect-[3/4] sm:aspect-[16/10] overflow-hidden rounded-3xl shadow-xl ring-1 ring-mehlcreme/10 reveal-scale">
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
          <p className="mt-4 text-center text-xs tracking-[0.22em] uppercase text-mehlcreme/55">
            Tanja · Sven · Sophia · Julia · Emilian
          </p>
        </div>
      </section>

      {/* GESCHICHTE — der EINE beige Lese-Akzent */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-2xl px-6 md:px-10 py-24 md:py-32 reveal">
          <p className="eyebrow no-line">Unsere Geschichte</p>
          <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
            Familie + Crew —{" "}
            <span className="accent">ein Tisch.</span>
          </h2>
          <div className="mt-9 space-y-5 text-waldgruen/70 leading-relaxed text-base md:text-lg">
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
            <p>
              Gerade schreiben wir ein neues Kapitel: Ab dem{" "}
              {BREAKFAST_LAUNCH.dateLong} wird Wald &amp; Wiese zum
              Frühstücksrestaurant — morgens im Grünen, regional und ehrlich,
              genau wie alles bei uns.{" "}
              <Link
                href="/speisekarte"
                className="text-tonwarm underline decoration-tonwarm/40 decoration-2 underline-offset-[5px] hover:decoration-tonwarm transition-colors"
              >
                Mehr zum Frühstück
              </Link>
              .
            </p>
          </div>
          <LeafDivider tone="dark" className="mt-14 opacity-90" />
        </div>
      </section>

      {/* SVEN AN DER BAR — grüne Typo-Sektion (Stock-Foto entfernt) */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Sven · Bar</p>
          <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
            An der Bar steht{" "}
            <span className="accent">Sven.</span>
          </h2>
          <p className="mt-8 text-mehlcreme/80 leading-relaxed max-w-lg mx-auto">
            Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine,
            Cocktails, Schaumweine. Sven mixt für jeden Anlass die
            passenden Drinks — auch entkoffeiniert und alkoholfrei.
          </p>
          <div className="mt-10">
            <Link
              href="/getraenke"
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Zur Getränkekarte <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KÜCHENTEAM / TANJA — grüne Typo-Sektion (Stock-Foto entfernt) */}
      <section className="relative isolate bg-waldgruen-dark text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 reveal">
          <p className="eyebrow no-line text-tonwarm">Tanja · Küche & Patisserie</p>
          <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
            In der Küche kocht{" "}
            <span className="accent">Tanja.</span>
          </h2>
          <p className="mt-8 text-mehlcreme/80 leading-relaxed max-w-lg">
            Patissière aus Leidenschaft. Mit Julia in der Küche, mit dem
            ganzen Service-Team an ihrer Seite. Hier ist nichts vom Band —
            Dips, Aufstriche, Desserts hausgemacht, regional und saisonal.
          </p>
          <blockquote className="mt-8 font-display italic text-2xl md:text-3xl text-mehlcreme leading-relaxed max-w-xl">
            „Ein Dessert ist für mich mehr als nur ein süßer Abschluss — es
            ist ein Moment der Freude."
          </blockquote>
          <Link
            href="/rezepte/pistazientiramisu"
            className="mt-10 inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
          >
            Tanjas Pistazientiramisu-Rezept <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* EMILIAN / MAGICEL — echtes Foto, weich gerahmt auf Grün */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl ring-1 ring-mehlcreme/10 reveal-scale">
            <Image
              src={IMG.magicBalloon.src}
              alt={IMG.magicBalloon.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
          <div className="md:col-span-6 reveal-1">
            <p className="eyebrow no-line text-tonwarm">Emilian Leber · alias Magicel</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Emilian{" "}
              <span className="accent">zaubert.</span>
            </h2>
            <p className="mt-8 text-mehlcreme/80 leading-relaxed max-w-lg">
              Emilian Leber, Bühnenname Magicel. Auftrittsmagier für
              Hochzeiten, Firmenfeiern und Events — und wenn er bei uns
              vorbeischaut, wandert er auch schon mal zwischen den Tischen und
              sorgt für Momente, von denen am Tag danach noch geredet wird.
            </p>
          </div>
        </div>
      </section>

      {/* HAUS — echtes Ort-Foto, weich gerahmt auf Grün */}
      <section className="bg-waldgruen-dark text-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32">
          <div className="text-center mb-12 reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">Bruckdorfer Straße 42</p>
            <h2 className="mt-7 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-mehlcreme">
              Mitten in{" "}
              <span className="accent">Sinzing.</span>
            </h2>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-xl ring-1 ring-mehlcreme/10 reveal-scale">
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
