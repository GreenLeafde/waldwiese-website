import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { DaySection } from "@/components/day-section";
import { PageHead, UI } from "@/components/page-head";
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
  kicker: string;
  name: string;
  teaser: string;
  points: string[];
  href: string;
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

/** Partner (Redesign 10/2026), hell: je Partner Foto links, Text rechts, feine Linie dazwischen. */
export default function PartnerPage() {
  return (
    <>
      <PageHead
        label="Gegenseitig empfohlen"
        title="Partner &"
        accent="Empfehlungen."
        intro="Ein schöner Abend ist selten das Werk von einem allein. Hier stehen Menschen aus der Region, für die wir gern gutsagen."
      />

      <DaySection stage="morgen" className="pb-16 md:pb-24">
        <div className={UI.container}>
          {PARTNERS.map((p) => (
            <article key={p.name} className="grid gap-6 border-t border-tanne/15 py-10 md:grid-cols-[2fr_3fr] md:gap-14 md:py-14">
              <a href={p.href} target="_blank" rel="noopener noreferrer">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={p.image.width}
                  height={p.image.height}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={`${UI.foto} aspect-[4/3] w-full`}
                />
              </a>
              <div>
                <p className={UI.label}>{p.kicker}</p>
                <h2 className="mt-2 font-display text-[1.9rem] font-normal leading-tight md:text-[2.3rem]">
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                    {p.name}
                  </a>
                </h2>
                <p className="mt-3 max-w-[60ch] leading-relaxed text-muted-hell">{p.teaser}</p>
                <ul className="mt-5 grid list-none gap-1.5 p-0 text-[0.95rem] text-muted-hell">
                  {p.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className={UI.link}>
                    Zur Website
                  </a>
                  <span className="text-sm text-muted-hell">{p.domain}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </DaySection>

      <DaySection stage="morgen-2" className="py-16 md:py-24">
        <div className={`${UI.container} grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-16`}>
          <div>
            <h2 className="font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">Du planst etwas bei uns?</h2>
            <p className="mt-3 max-w-[56ch] leading-relaxed text-muted-hell">
              Für Hochzeiten, Geburtstage und Firmenfeiern haben wir Platz im Grünen und sagen gern,
              wer den Abend musikalisch oder magisch rundmacht. Und wenn du selbst in der Region
              etwas machst, das zu uns passt: schreib uns.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/feiern" className={UI.btnA}>Feiern &amp; Feste</Link>
            <a href={`mailto:${CONTACT.email}`} className={UI.link}>{CONTACT.email}</a>
          </div>
        </div>
      </DaySection>
    </>
  );
}
