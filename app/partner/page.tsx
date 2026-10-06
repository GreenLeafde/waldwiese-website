import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LeafDivider } from "@/components/leaf-divider";
import { IMG } from "@/lib/images";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner & Empfehlungen — Entertainment & Musik aus der Region",
  description:
    "Menschen aus der Region, die wir gern weiterempfehlen: Emilian Leber — Entertainment & Zauberkunst aus Regensburg — und Udo Zahlauer, Dudelsack Regensburg, für Hochzeiten, Feste und Trauerfeiern.",
  alternates: { canonical: "/partner" },
  openGraph: {
    title: "Partner & Empfehlungen — Wald & Wiese",
    description:
      "Zauberkunst, Dudelsack, Entertainment: Menschen aus der Region um Regensburg, mit denen wir gern zusammenarbeiten und die wir weiterempfehlen.",
    url: "/partner",
  },
};

type Partner = {
  /** Kleines Versalien-Label über dem Namen. */
  kicker: string;
  name: string;
  /** Teaser für die Karte — 1–2 Sätze. */
  teaser: string;
  /** Stichpunkte: wofür man ihn bucht. */
  points: string[];
  href: string;
  /** Domain, klein unter dem Link. */
  domain: string;
  image: { src: string; alt: string; width: number; height: number };
};

const PARTNERS: Partner[] = [
  {
    kicker: "Entertainment & Zauberkunst",
    name: "Emilian Leber",
    teaser:
      "Emilian Leber aus Regensburg steht seit 2016 auf der Bühne und hat über 200 Events im Rücken. Er bringt Zauberkunst und Comedy zusammen: als Bühnenshow fürs ganze Publikum, als Close-Up direkt am Tisch der Gäste oder als Magic Dinner, einen durchkomponierten Abend von Walk-Around bis Bühnenfinale.",
    points: [
      "Bühnenshow für das ganze Publikum",
      "Close-Up-Magie direkt am Tisch der Gäste",
      "Magic Dinner — Walk-Around, Tisch-zu-Tisch, Bühnenfinale",
      "Hochzeiten, Firmenfeiern, runde Geburtstage, Messen",
    ],
    href: "https://magicel.de/",
    domain: "magicel.de",
    image: IMG.partnerMagicel,
  },
  {
    kicker: "Dudelsack Regensburg",
    name: "Udo Zahlauer",
    teaser:
      "Udo spielt Great Highland Bagpipe in Regensburg, in der Oberpfalz und in Niederbayern — beim Einzug und Auszug aus der Kirche, beim Empfang der Gäste, bei runden Geburtstagen und Familienfesten, und ebenso leise am Grab und zum Abschied. Wer selbst anfangen möchte, bekommt bei ihm Einzelunterricht vom ersten Ton an.",
    points: [
      "Hochzeiten — Einzug, Auszug, Empfang der Gäste",
      "Private Feiern — runde Geburtstage und Familienfeste",
      "Trauerfeiern — am Grab, beim Auszug, zum Abschied",
      "Einzelunterricht für Anfänger",
    ],
    href: "https://dudelsack-regensburg.de/",
    domain: "dudelsack-regensburg.de",
    image: IMG.partnerUdoZahlauer,
  },
];

export default function PartnerPage() {
  return (
    <>
      {/* ---------------------------------------------------------------
       * HEADER — gleiche Anmutung wie die Ratgeber-/Rezepte-Übersicht
       * ------------------------------------------------------------- */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        {/* Botanik-Akzent */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-12 -top-10 h-72 w-72 text-tonwarm/15 md:h-96 md:w-96"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M100 180 C100 120 100 70 100 30" />
          <path d="M100 150 C70 140 55 120 52 92 C82 96 98 118 100 150 Z" />
          <path d="M100 124 C130 116 146 96 150 70 C120 72 102 94 100 124 Z" />
          <path d="M100 96 C74 90 60 72 58 48 C84 52 98 72 100 96 Z" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="relative mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-16 md:pb-24 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            Gegenseitig empfohlen
          </p>
          <h1 className="mt-7 text-5xl md:text-7xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
            Partner &amp; <span className="accent">Empfehlungen.</span>
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Ein schöner Abend ist selten das Werk von einem allein. Hier stehen
            Menschen aus der Region, für die wir gern gutsagen.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * KARTEN — je Partner eine Karte, Bild oben, Link zur Website
       * ------------------------------------------------------------- */}
      <section className="bg-waldgruen">
        <div className="mx-auto max-w-5xl px-6 md:px-10 pb-24 md:pb-32">
          <div className="grid gap-8 md:grid-cols-2">
            {PARTNERS.map((p) => (
              <article
                key={p.name}
                className="reveal-1 group flex flex-col overflow-hidden rounded-3xl bg-mehlcreme ring-1 ring-mehlcreme/15 shadow-lg transition-shadow duration-300 hover:shadow-2xl"
              >
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[4/3] overflow-hidden bg-waldgruen-dark"
                >
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark/45 via-transparent to-transparent"
                  />
                </a>

                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-tonwarm">
                    {p.kicker}
                  </p>
                  <h2 className="mt-4 font-display text-2xl md:text-3xl font-normal leading-tight tracking-tight text-waldgruen">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors group-hover:text-tonwarm-dark"
                    >
                      {p.name}
                    </a>
                  </h2>
                  <p className="mt-4 leading-relaxed text-waldgruen/65">
                    {p.teaser}
                  </p>

                  <ul className="mt-7 divide-y divide-waldgruen/15">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-baseline gap-3 py-3">
                        <span
                          aria-hidden
                          className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-tonwarm"
                        />
                        <span className="text-sm leading-relaxed text-waldgruen/80">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-8">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-tonwarm transition-colors hover:text-tonwarm-dark"
                    >
                      Zur Website <span aria-hidden>↗</span>
                    </a>
                    <span className="text-sm text-waldgruen/45">{p.domain}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <LeafDivider tone="light" className="mt-20 opacity-80" />
        </div>
      </section>

      {/* ---------------------------------------------------------------
       * ABSCHLUSS — eigene Feiern + Hinweis für neue Partner
       * ------------------------------------------------------------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center">
          <h2 className="reveal text-3xl md:text-4xl lg:text-5xl font-display font-normal leading-[1.1] tracking-tight text-waldgruen">
            Du planst etwas <span className="accent">bei uns?</span>
          </h2>
          <p className="mt-8 reveal text-lg text-waldgruen/70 leading-relaxed">
            Für Hochzeiten, Geburtstage und Firmenfeiern haben wir Platz im
            Grünen — und sagen gern, wer den Abend musikalisch oder magisch
            rundmacht. Und wenn du selbst in der Region etwas machst, das zu uns
            passt: schreib uns.
          </p>
          <div className="mt-12 reveal-1 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/feiern"
              className="inline-flex items-center gap-2 rounded-full bg-tonwarm px-7 py-3.5 font-medium text-white transition-colors hover:bg-tonwarm-dark"
            >
              Feiern &amp; Feste <span aria-hidden>→</span>
            </Link>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-3 border-b border-waldgruen/25 pb-1 font-medium text-waldgruen transition-colors hover:border-tonwarm hover:text-tonwarm"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
