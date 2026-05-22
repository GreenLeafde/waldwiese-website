import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/images";
import { CONTACT } from "@/lib/site";

export const metadata = {
  title: "Veranstaltungen — Hochzeit, Geburtstag, Firmenfeier",
  description:
    "Hochzeitslocation bei Regensburg. Geburtstage, Firmenfeiern, Taufen — familiengeführt, regional, mit Tischzauberei auf Wunsch.",
};

const occasions = [
  {
    title: "Hochzeit",
    text: "Vom Standesamt direkt zu uns oder die ganze Feier — drinnen, draußen, mit Hund, mit Familie.",
  },
  {
    title: "Geburtstag & Taufe",
    text: "Runde Geburtstage, kleine Familienfeiern, oder ein langes Tischessen für deine Lieblingsmenschen.",
  },
  {
    title: "Firmenfeier",
    text: "Sommerfest, Weihnachtsfeier, Workshop-Catering — auch außerhalb der regulären Öffnungszeiten.",
  },
];

export default function VeranstaltungenPage() {
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
          <p className="eyebrow no-line justify-center">Veranstaltungen</p>
          <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-waldgruen">
            Wenn der Anlass{" "}
            <span className="accent">groß ist.</span>
          </h1>
          <p className="mt-8 font-display italic text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
            Hochzeit, Geburtstag, Firmenfeier oder einfach ein Abend mit
            vielen Menschen, die du magst. Wir planen mit dir — ehrlich
            gekocht, ohne Schickimicki.
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
            <a
              href={`mailto:${CONTACT.email}?subject=Anfrage%20Veranstaltung`}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Anfrage schicken <span aria-hidden>→</span>
            </a>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ANLÄSSE */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-24 md:pb-32">
          <ul className="grid md:grid-cols-3 gap-y-12 md:gap-x-10">
            {occasions.map((o, i) => (
              <li key={o.title} className="reveal">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-display italic text-tonwarm text-xl leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                    {o.title}
                  </h2>
                </div>
                <p className="font-display italic text-stone-600 leading-relaxed">
                  {o.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* IMAGE BLOCK */}
      <section className="relative isolate bg-waldgruen-dark text-mehlcreme overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center">
        <Image
          src={IMG.sceneFestive.src}
          alt={IMG.sceneFestive.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          style={{ objectPosition: "center 40%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark/90 via-waldgruen-dark/60 to-waldgruen-dark/30"
        />
        <div className="relative w-full mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="reveal">
            <p className="eyebrow no-line text-tonwarm justify-center">
              Erzähl uns vom Anlass
            </p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Schreib uns kurz:{" "}
              <span className="accent">was wird gefeiert?</span>
            </h2>
            <p className="mt-8 text-mehlcreme/85 leading-relaxed max-w-xl mx-auto">
              Datum, ungefähre Personenzahl, Anlass. Wir melden uns mit
              Vorschlägen — Menü, Räume, Tischzauberei.
            </p>
            <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
              <a
                href={`mailto:${CONTACT.email}?subject=Anfrage%20Veranstaltung`}
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/40 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
              >
                {CONTACT.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
