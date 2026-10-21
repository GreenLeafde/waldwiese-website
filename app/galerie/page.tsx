import Image from "next/image";
import { DaySection } from "@/components/day-section";
import { PageHead, UI } from "@/components/page-head";
import { ReserveButton } from "@/components/reserve-chooser";
import { IMG } from "@/lib/images";

export const metadata = {
  title: "Galerie & Bilder",
  description:
    "Fotos von Wald & Wiese in Sinzing: Terrasse im Grünen, Innenräume, Gebäude und Frühstück — echte Eindrücke aus unserem Restaurant bei Regensburg.",
  alternates: { canonical: "/galerie" },
};

/** Nur echte Fotos vom Ort, grob nach Tageszeit: erst hell, dann Abend. */
const TAG = [
  IMG.terrasseOlivenbaum,
  IMG.fruehstueckFoto,
  IMG.terrasseTische,
  IMG.hundTerrasse,
  IMG.gebaeudeLuft,
  IMG.wwFood3,
  IMG.teamFamilie,
];
const ABEND = [IMG.gebaeudeAbend, IMG.wwFood1, IMG.wwFood4, IMG.wwFood2, IMG.wwFood5, IMG.haus];

type Photo = { src: string; alt: string; width: number; height: number };

function Grid({ photos }: { photos: readonly Photo[] }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 md:gap-5">
      {photos.map((p) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className={`${UI.foto} mb-4 h-auto w-full break-inside-avoid md:mb-5`}
        />
      ))}
    </div>
  );
}

export default function GaleriePage() {
  return (
    <>
      <PageHead
        label="Galerie"
        title="Ein Blick"
        accent="zu uns."
        intro="Terrasse im Grünen, Gastraum, das Haus am Waldrand: echte Eindrücke von Wald & Wiese in Sinzing, tagsüber und abends."
      />
      <DaySection stage="morgen" className="pb-16 md:pb-24">
        <div className={UI.container}>
          <p className={`${UI.label} mb-5`}>Tagsüber</p>
          <Grid photos={TAG} />
        </div>
      </DaySection>
      <DaySection stage="abend" className="py-16 md:py-24">
        <div className={UI.container}>
          <p className={`${UI.label} mb-5`}>Abends</p>
          <Grid photos={ABEND} />
          <div className="mt-12 grid gap-6 border-t border-creme/15 pt-10 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
            <div>
              <h2 className="font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">Am schönsten in echt.</h2>
              <p className="mt-3 max-w-[50ch] leading-relaxed text-creme/75">
                Komm vorbei und überzeug dich selbst, drinnen oder auf der Terrasse im Grünen.
              </p>
            </div>
            <ReserveButton location="galerie" className={UI.btnA}>Tisch reservieren</ReserveButton>
          </div>
        </div>
      </DaySection>
    </>
  );
}
