import Image from "next/image";
import Link from "next/link";
import { CONTACT, SITE } from "@/lib/site";

export type LandingContent = {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  eyebrow: string;
  h1Lead: string;
  h1Accent: string;
  intro: string;
  primaryCta: { label: string; href: string };
  features: {
    heading: string;
    accent: string;
    items: { title: string; text: string }[];
  };
  stats: { value: string; label: string }[];
  faq: { question: string; answer: string }[];
  /** Optionaler, kurzer Akzent-Textblock (eine Sektion mehr). */
  split?: { eyebrow: string; heading: string; accent: string; paragraphs: string[] };
  /** Aus früherem Template — nicht gerendert, daher optional. */
  story?: { heading: string; accent: string; paragraphs: string[] };
  related?: { label: string; href: string; blurb: string }[];
  closing: {
    heading: string;
    accent: string;
    text: string;
    cta: { label: string; href: string };
  };
};

/**
 * Bild-geführtes Landingpage-Layout mit etwas Schwung, aber wenig Text:
 * Hero → großes Foto → nummerierte Punkte → (optionaler Akzent-Block) →
 * Claim-Band (tonwarm) → Zahlen-Band → FAQ (eingeklappt) → CTA.
 */
export function RichLanding({
  content,
  path,
  splitImage,
}: {
  content: LandingContent;
  path: string;
  splitImage: { src: string; alt: string; position?: string };
}) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumb,
        item: `${SITE.url}${path}`,
      },
    ],
  };

  const features = content.features.items.slice(0, 3);
  const splitParas = content.split?.paragraphs.slice(0, 2) ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* HERO */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <nav
            aria-label="Brotkrumen"
            className="flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-stone-400"
          >
            <Link href="/" className="hover:text-tonwarm transition-colors">
              Startseite
            </Link>
            <span aria-hidden>/</span>
            <span className="text-stone-500">{content.breadcrumb}</span>
          </nav>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-14 md:pb-16 text-center">
          <p className="eyebrow no-line justify-center">{content.eyebrow}</p>
          <h1 className="mt-7 text-5xl md:text-7xl font-display font-normal leading-[0.98] tracking-tight text-waldgruen">
            {content.h1Lead} <span className="accent">{content.h1Accent}</span>
          </h1>
          <p className="mt-8 text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            {content.intro}
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
            <Link
              href={content.primaryCta.href}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              {content.primaryCta.label} <span aria-hidden>→</span>
            </Link>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-3 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.phone}
            </a>
          </div>
        </div>

        {/* GROSSES ECHTES FOTO */}
        <div className="mx-auto max-w-6xl px-6 md:px-10 pb-20 md:pb-28">
          <div className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-3xl reveal">
            <Image
              src={splitImage.src}
              alt={splitImage.alt}
              fill
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
              style={{ objectPosition: splitImage.position ?? "center" }}
            />
          </div>
        </div>
      </section>

      {/* NUMMERIERTE PUNKTE */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-20 md:py-28">
          <h2 className="max-w-2xl text-3xl md:text-4xl lg:text-5xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
            {content.features.heading}{" "}
            <span className="accent">{content.features.accent}</span>
          </h2>
          <ul className="mt-12 grid sm:grid-cols-3 gap-x-10 gap-y-10">
            {features.map((item, i) => (
              <li key={item.title} className="border-t border-stone-200 pt-5">
                <span className="font-display italic text-tonwarm text-2xl leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-display font-normal tracking-tight text-waldgruen">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-stone-600 leading-relaxed">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OPTIONALER AKZENT-BLOCK */}
      {content.split && splitParas.length > 0 && (
        <section className="bg-stone-soft border-y border-stone-200">
          <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 reveal">
            <p className="eyebrow no-line">{content.split.eyebrow}</p>
            <h2 className="mt-6 text-3xl md:text-4xl font-display font-normal leading-[1.08] tracking-tight text-waldgruen">
              {content.split.heading}{" "}
              <span className="accent">{content.split.accent}</span>
            </h2>
            <div className="mt-7 space-y-4 text-stone-600 leading-relaxed text-lg">
              {splitParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLAIM-BAND — warmer Farb-Pop */}
      <section className="bg-tonwarm text-white">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-16 md:py-20 text-center">
          <p className="font-display italic text-3xl md:text-4xl lg:text-5xl leading-[1.1]">
            Klein, fein &amp; ehrlich.
          </p>
          <p className="mt-4 text-white/85 tracking-[0.04em]">
            Familiengeführt in Sinzing — mitten im Grünen, bei Regensburg.
          </p>
        </div>
      </section>

      {/* ZAHLEN-BAND */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 md:py-20">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
            {content.stats.map((s) => (
              <li key={s.label}>
                <p className="font-display text-4xl md:text-5xl text-mehlcreme leading-none">
                  {s.value}
                </p>
                <p className="mt-3 text-sm tracking-[0.06em] text-mehlcreme/70">
                  {s.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28">
          <p className="eyebrow no-line">Häufige Fragen</p>
          <h2 className="mt-6 text-3xl md:text-4xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
            Gut zu <span className="accent">wissen.</span>
          </h2>
          <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
            {content.faq.map((f) => (
              <details key={f.question} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="font-display text-lg md:text-xl text-waldgruen">
                    {f.question}
                  </span>
                  <span
                    aria-hidden
                    className="text-tonwarm text-2xl leading-none transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-stone-600 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-waldgruen-dark text-mehlcreme">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
            {content.closing.heading}{" "}
            <span className="accent">{content.closing.accent}</span>
          </h2>
          <p className="mt-8 text-mehlcreme/85 leading-relaxed max-w-xl mx-auto">
            {content.closing.text}
          </p>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5">
            <Link
              href={content.closing.cta.href}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              {content.closing.cta.label} <span aria-hidden>→</span>
            </Link>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/40 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
