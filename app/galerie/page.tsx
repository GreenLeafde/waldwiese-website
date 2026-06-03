import Image from "next/image";
import Link from "next/link";
import { LeafDivider } from "@/components/leaf-divider";
import { IMG } from "@/lib/images";
import { RESERVATION_URL } from "@/lib/site";

export const metadata = {
  title: "Galerie & Bilder",
  description:
    "Fotos von Wald & Wiese in Sinzing: Terrasse im Grünen, Innenräume, Gebäude und Frühstück — echte Eindrücke aus unserem Restaurant bei Regensburg.",
  alternates: { canonical: "/galerie" },
};

/** Nur echte Fotos vom Ort. (Magic-Dinner-Bilder bewusst nicht dabei.) */
const PHOTOS = [
  IMG.terrasseOlivenbaum,
  IMG.fruehstueckFoto,
  IMG.gebaeudeAbend,
  IMG.wwFood3,
  IMG.terrasseTische,
  IMG.wwFood1,
  IMG.gebaeudeLuft,
  IMG.wwFood4,
  IMG.hundTerrasse,
  IMG.wwFood2,
  IMG.haus,
  IMG.wwFood5,
  IMG.teamFamilie,
];

export default function GaleriePage() {
  return (
    <>
      {/* HEADER — Waldgrün */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/60 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Startseite
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-16 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">Galerie</p>
          <h1 className="mt-7 text-5xl md:text-7xl font-display font-normal leading-[0.98] tracking-tight text-mehlcreme">
            Ein Blick <span className="accent">zu uns.</span>
          </h1>
          <p className="mt-8 text-lg text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            Terrasse im Grünen, gemütlicher Innenraum, das Haus am Waldrand —
            ein paar echte Eindrücke von Wald &amp; Wiese in Sinzing.
          </p>
        </div>
      </section>

      {/* MASONRY-RASTER — Creme-Lesebereich, Botanik-Trenner darüber */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-6xl px-6 md:px-10 pt-16 md:pt-20 pb-24 md:pb-32">
          <LeafDivider tone="dark" className="mb-12 md:mb-16 opacity-90" />
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
            {PHOTOS.map((p) => (
              <div
                key={p.src}
                className="mb-4 md:mb-6 break-inside-avoid overflow-hidden rounded-2xl ring-1 ring-waldgruen/15 reveal"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-waldgruen-dark text-mehlcreme">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
            Am schönsten <span className="accent">in echt.</span>
          </h2>
          <p className="mt-8 text-mehlcreme/85 leading-relaxed max-w-xl mx-auto">
            Komm vorbei und überzeug dich selbst — drinnen oder auf der Terrasse
            im Grünen.
          </p>
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
      </section>
    </>
  );
}
