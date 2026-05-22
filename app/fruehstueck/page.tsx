import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH, CONTACT } from "@/lib/site";

export const metadata = {
  title: "Frühstück mitten im Grünen — ab 06.07.2026 in Sinzing",
  description: `Frühstück bei Wald & Wiese — ab ${BREAKFAST_LAUNCH.dateLong} in Sinzing bei Regensburg. Brot vom Bäcker, Obst aus Sinzing, hausgemachte Aufstriche. Regional, ehrlich.`,
};

const teaserItems = [
  "Brot vom Bäcker aus der Region",
  "Obst aus Sinzing",
  "Hausgemachtes Granola",
  "Hausgemachte Aufstriche",
  "Vegane Optionen gleichberechtigt",
  "Kaffee, der seinen Namen verdient",
];

export default function FruehstueckPage() {
  return (
    <>
      {/* HEADER */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-stone-400 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-20 text-center">
          <p className="eyebrow no-line justify-center">Demnächst</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Frühstück,{" "}
            <span className="accent">mitten im Grünen.</span>
          </h1>
          <p className="mt-7 font-display italic text-xl md:text-2xl text-waldgruen/85">
            ab {BREAKFAST_LAUNCH.dateShort} · in Sinzing.
          </p>
          <p className="mt-8 text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            Wir sind kurz davor. Wenn's losgeht, startet der Tag bei uns
            früher — mit echtem Frühstück, regional, herzhaft oder süß. Bring
            den Hund mit, bleib so lange du magst.
          </p>
        </div>
      </section>

      {/* BILD */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-20 md:pb-28">
          <div className="relative aspect-[16/10] overflow-hidden reveal">
            <Image
              src={IMG.hero.src}
              alt={IMG.hero.alt}
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* WAS DICH ERWARTET */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center reveal">
            <div className="lg:col-span-5">
              <p className="eyebrow no-line">Was dich erwartet</p>
              <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
                Klein, fein,{" "}
                <span className="accent">& ehrlich.</span>
              </h2>
              <p className="mt-8 text-stone-600 leading-relaxed">
                Brot vom Bäcker aus der Region. Obst aus Sinzinger Höfen.
                Hausgemachte Aufstriche, Granola, Bananenbrot — vieles, was
                sonst nur die Oma so kocht. Vegan, vegetarisch und herzhaft
                gleichberechtigt auf der Karte.
              </p>
            </div>
            <ul className="lg:col-span-7 divide-y divide-stone-200 self-center">
              {teaserItems.map((t) => (
                <li
                  key={t}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span
                    aria-hidden
                    className="inline-block w-1.5 h-1.5 rounded-full bg-tonwarm flex-shrink-0"
                  />
                  <span className="font-display text-lg md:text-xl text-waldgruen">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAMILIE LEBER NOTE */}
      <section className="bg-stone-soft border-y border-stone-200">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
            Schön, dass du{" "}
            <span className="accent">vorbei schaust.</span>
          </h2>
          <div className="mt-10 space-y-5 font-display italic text-lg md:text-xl text-stone-600 leading-relaxed">
            <p>
              Aktuell sind wir abends für dich da — Burger, Bowls, vom Grill.
              Das Frühstücks-Konzept bauen wir gerade auf.
            </p>
            <p>
              Wenn's so weit ist, schicken wir's übers Instagram raus. Bis
              dahin: komm vorbei zum Abendessen, oder schreib uns.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              {CONTACT.instagramHandle} <span aria-hidden>→</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}?subject=Fr%C3%BChst%C3%BCck%20%E2%80%94%20wann%20geht%27s%20los%3F`}
              className="inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Schreib uns
            </a>
          </div>
          <p className="mt-16 font-display italic text-base text-stone-500">
            Genießt den Morgen,
            <br />
            <span className="text-waldgruen font-normal not-italic">
              Eure Familie Leber
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
