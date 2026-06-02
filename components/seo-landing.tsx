import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

export type SeoPoint = { title: string; text: string };

export type SeoLandingProps = {
  eyebrow: string;
  /** H1 ohne Akzentwort. */
  titleLead: string;
  /** Akzentwort/-teil der H1 (kursiv, tonwarm). */
  titleAccent: string;
  lead: string;
  image?: { src: string; alt: string };
  points: SeoPoint[];
  primaryCta: { href: string; label: string };
  closing: {
    heading: string;
    accent: string;
    text: string;
    cta: { href: string; label: string };
  };
};

/**
 * Geteiltes Layout für die SEO-/Städte-Landingpages. Inhalte kommen pro Seite
 * unterschiedlich rein (eigener Text-Winkel je Keyword), damit kein
 * Duplicate-Content entsteht.
 */
export function SeoLanding({
  eyebrow,
  titleLead,
  titleAccent,
  lead,
  image,
  points,
  primaryCta,
  closing,
}: SeoLandingProps) {
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
          <p className="eyebrow no-line justify-center">{eyebrow}</p>
          <h1 className="mt-7 text-4xl md:text-6xl lg:text-7xl font-display font-normal leading-[0.98] tracking-tight text-waldgruen">
            {titleLead} <span className="accent">{titleAccent}</span>
          </h1>
          <p className="mt-8 text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            {lead}
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              {primaryCta.label} <span aria-hidden>→</span>
            </Link>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </section>

      {/* BILD */}
      {image && (
        <section className="bg-mehlcreme">
          <div className="mx-auto max-w-5xl px-6 md:px-10 pb-20 md:pb-28">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl reveal">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 80vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* PUNKTE */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32">
          <ul className="grid md:grid-cols-3 gap-y-12 md:gap-x-10">
            {points.map((p, i) => (
              <li key={p.title} className="reveal">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-display italic text-tonwarm text-xl leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                    {p.title}
                  </h2>
                </div>
                <p className="font-display italic text-stone-600 leading-relaxed">
                  {p.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 text-center">
          <div className="reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              {closing.heading} <span className="accent">{closing.accent}</span>
            </h2>
            <p className="mt-8 text-mehlcreme/85 leading-relaxed max-w-xl mx-auto">
              {closing.text}
            </p>
            <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
              <Link
                href={closing.cta.href}
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                {closing.cta.label} <span aria-hidden>→</span>
              </Link>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/40 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
