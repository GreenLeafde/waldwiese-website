import Image from "next/image";
import Link from "next/link";
import { DaySection } from "@/components/day-section";
import { GoogleReviews } from "@/components/google-reviews";
import { PageHead, UI } from "@/components/page-head";
import { ReserveButton } from "@/components/reserve-chooser";
import { IMG } from "@/lib/images";

export const metadata = {
  title: "Über uns — Familie Leber",
  description:
    "Wir sind die Familie Leber — Tanja, Sven, Sophia, Julia und Emilian. Klein, fein und ehrlich. Wald & Wiese in Sinzing bei Regensburg: Brunch täglich, Abendessen am Wochenende.",
  alternates: { canonical: "/ueber-uns" },
};

/**
 * Über uns (Redesign 10/2026), helle Seite: Familie zuerst, dann die drei
 * Menschen hinter Küche, Bar und Bühne mit echten Fotos, das Haus, was uns
 * wichtig ist, Google-Bewertungen. Texte aus der bisherigen Seite und der CI.
 */
export default function UeberUnsPage() {
  return (
    <>
      <PageHead
        label="Familie Leber · Sinzing"
        title="Klein, fein"
        accent="und ehrlich."
        intro="Wir sind die Familie Leber: Tanja, Sven, Sophia, Julia und Emilian. Kein Sterne-Tempel, eher das Lieblingsrestaurant deiner Freunde. Nur eben mit besserem Pistazientiramisu."
      />

      {/* FAMILIE + GESCHICHTE */}
      <DaySection stage="morgen" className="pb-16 md:pb-24">
        <div className={`${UI.container} grid items-center gap-9 md:grid-cols-[0.8fr_1.2fr] md:gap-16`}>
          <Image
            src={IMG.teamFamilie.src}
            alt={IMG.teamFamilie.alt}
            width={IMG.teamFamilie.width}
            height={IMG.teamFamilie.height}
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className={`${UI.foto} aspect-[4/5] w-full`}
            style={{ objectPosition: "center 20%" }}
          />
          <div className="grid gap-4">
            <p className={UI.label}>Unsere Geschichte</p>
            <h2 className="font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">
              Familie und Crew, ein Tisch.
            </h2>
            <p className="m-0 max-w-[54ch] leading-relaxed text-muted-hell">
              Was uns ausmacht, ist das Miteinander. Entscheidungen treffen wir gemeinsam, wir
              unterstützen uns im Alltag und bringen unsere Persönlichkeit in das ein, was wir
              tun. Diese familiäre Atmosphäre soll man bei uns spüren, vom ersten Moment an.
            </p>
            <p className="m-0 max-w-[54ch] leading-relaxed text-muted-hell">
              Wer zu uns kommt, ist nicht einfach Gast, sondern willkommen bei unserer Familie.
              Der Hund liegt mit auf der Karte: Der Heinzi-Burger heißt nach unserem Hund Henry,
              und die Prinzessin auf der Kichererbse kommt direkt aus dem Märchenbuch.
            </p>
            <p className="m-0 max-w-[54ch] leading-relaxed text-muted-hell">
              Seit Juli 2026 beginnt der Tag bei uns früher: Brunch täglich von 8 bis 14 Uhr,
              am Wochenende abends weiter.{" "}
              <Link href="/speisekarte" className={UI.link}>Zur Karte</Link>
            </p>
          </div>
        </div>
      </DaySection>

      {/* DREI MENSCHEN — offene Spalten */}
      <DaySection stage="morgen-2" className="py-16 md:py-[104px]">
        <div className={UI.container}>
          <p className={UI.label}>Wer hier was macht</p>
          <h2 className={UI.h2}>Tanja kocht, Sven mixt, Emilian zaubert.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {[
              {
                k: "Tanja · Küche & Patisserie",
                t: "In der Küche kocht Tanja.",
                p: "Patissière aus Leidenschaft, mit Julia in der Küche und dem Service-Team an ihrer Seite. Hier ist nichts vom Band: Dips, Aufstriche und Desserts hausgemacht, regional und saisonal.",
                q: "„Ein Dessert ist für mich mehr als nur ein süßer Abschluss, es ist ein Moment der Freude.“",
                href: "/rezepte/pistazientiramisu",
                l: "Tanjas Pistazientiramisu-Rezept",
              },
              {
                k: "Sven · Bar",
                t: "An der Bar steht Sven.",
                p: "Kaffee mit Charakter, hausgemachte Limonaden, regionale Weine, Cocktails und Schaumweine. Sven mixt für jeden Anlass die passenden Drinks, auch entkoffeiniert und alkoholfrei.",
                href: "/getraenke",
                l: "Zur Getränkekarte",
              },
              {
                k: "Emilian · alias Magicel",
                t: "Emilian zaubert.",
                p: "Auftrittsmagier für Hochzeiten, Firmenfeiern und Events. Wenn er bei uns vorbeischaut, wandert er auch mal zwischen den Tischen und sorgt für Momente, von denen am Tag danach noch geredet wird.",
                href: "/veranstaltungen",
                l: "Magic Dinner & Termine",
              },
            ].map((m) => (
              <div key={m.k} className="grid content-start gap-3 border-t border-tanne/15 pt-5">
                <span className={UI.label}>{m.k}</span>
                <h3 className="m-0 font-display text-[1.5rem] font-normal leading-tight">{m.t}</h3>
                <p className="m-0 leading-relaxed text-muted-hell">{m.p}</p>
                {m.q && <p className="m-0 font-display text-[1.15rem] font-light italic leading-snug">{m.q}</p>}
                <Link href={m.href} className={`${UI.link} justify-self-start`}>{m.l}</Link>
              </div>
            ))}
          </div>
        </div>
      </DaySection>

      {/* EMILIAN + HAUS — zwei echte Fotos */}
      <DaySection stage="vormittag" className="py-16 md:py-[104px]">
        <div className={`${UI.container} grid gap-4 md:grid-cols-2 md:gap-6`}>
          <figure className="m-0 grid gap-2">
            <Image
              src={IMG.magicBalloon.src}
              alt={IMG.magicBalloon.alt}
              width={IMG.magicBalloon.width}
              height={IMG.magicBalloon.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`${UI.foto} aspect-[4/3] w-full`}
              style={{ objectPosition: "center 20%" }}
            />
            <figcaption className="text-sm text-muted-hell">Emilian beim Magic Dinner</figcaption>
          </figure>
          <figure className="m-0 grid gap-2">
            <Image
              src={IMG.gebaeudeAbend.src}
              alt={IMG.gebaeudeAbend.alt}
              width={IMG.gebaeudeAbend.width}
              height={IMG.gebaeudeAbend.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`${UI.foto} aspect-[4/3] w-full`}
              style={{ objectPosition: "center 55%" }}
            />
            <figcaption className="text-sm text-muted-hell">Bruckdorfer Straße 42, Sinzing, am Waldrand</figcaption>
          </figure>
        </div>
      </DaySection>

      {/* WAS UNS WICHTIG IST */}
      <DaySection stage="mittag" className="py-16 md:py-[104px]">
        <div className={`${UI.container} grid items-center gap-9 md:grid-cols-2 md:gap-16`}>
          <div className="grid justify-items-start gap-4">
            <p className={UI.label}>Was uns wichtig ist</p>
            <h2 className="font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">
              Bodenständig, modern, ohne Schnickschnack.
            </h2>
            <p className="m-0 max-w-[50ch] leading-relaxed text-muted-hell">
              Was hier wächst, kommt auf den Teller. Ehrlich, ohne Etikettenschwindel. Vegan und
              vegetarisch gleichberechtigt auf der Karte. Hund willkommen, drinnen und draußen.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm font-semibold">
              <span>Familiengeführt</span>
              <span>Hunde willkommen</span>
              <span>Regional &amp; saisonal</span>
              <span>Vegan &amp; vegetarisch</span>
            </div>
            <ReserveButton location="ueber-uns" className={`${UI.btnA} mt-2`}>
              Tisch reservieren
            </ReserveButton>
          </div>
          <Image
            src={IMG.hundWald.src}
            alt={IMG.hundWald.alt}
            width={IMG.hundWald.width}
            height={IMG.hundWald.height}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`${UI.foto} aspect-[4/3] w-full`}
            style={{ objectPosition: "center 40%" }}
          />
        </div>
      </DaySection>

      {/* GOOGLE */}
      <DaySection stage="tanne" className="py-16 md:py-[104px]">
        <div className={UI.container}>
          <p className={UI.label}>Gäste über uns</p>
          <h2 className={UI.h2}>Das sagen unsere Gäste</h2>
          <GoogleReviews limit={4} className="mt-8" />
        </div>
      </DaySection>
    </>
  );
}
