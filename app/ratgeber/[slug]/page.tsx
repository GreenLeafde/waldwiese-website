import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LeafDivider } from "@/components/leaf-divider";
import { getGuide, GUIDES } from "@/lib/guides";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `/ratgeber/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url: `/ratgeber/${slug}`,
      type: "article",
    },
  };
}

export default async function RatgeberDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/ratgeber/${slug}`,
    inLanguage: "de-DE",
  };

  const faqJsonLd = guide.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ratgeber",
        item: `${SITE.url}/ratgeber`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${SITE.url}/ratgeber/${slug}`,
      },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* HEADER */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
          <Link
            href="/ratgeber"
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 hover:text-tonwarm transition-colors"
          >
            <span aria-hidden>←</span> Alle Ratgeber
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-10 md:pt-14 pb-20 md:pb-28 text-center reveal">
          <p className="eyebrow no-line justify-center text-tonwarm">
            {guide.kicker}
          </p>
          <h1 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.02] tracking-tight text-mehlcreme">
            {guide.title}
          </h1>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 max-w-xl mx-auto leading-relaxed">
            {guide.teaser}
          </p>
        </div>
      </section>

      {/* INHALT — Lese-Bereich auf Creme */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-2xl px-6 md:px-10 py-20 md:py-28">
          <p className="italic text-lg md:text-xl text-waldgruen/65 leading-relaxed reveal">
            {guide.intro}
          </p>

          <div className="mt-14 space-y-14">
            {guide.sections.map((sec) => (
              <div key={sec.heading} className="reveal">
                <h2 className="text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                  {sec.heading}
                </h2>
                <div className="mt-5 space-y-4 text-waldgruen/75 leading-relaxed">
                  {sec.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {guide.faq?.length ? (
        <section className="bg-mehlcreme border-t border-waldgruen/15">
          <div className="mx-auto max-w-2xl px-6 md:px-10 py-20 md:py-28">
            <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium reveal">
              Häufige Fragen
            </p>
            <dl className="mt-8 divide-y divide-waldgruen/15">
              {guide.faq.map((f) => (
                <div key={f.q} className="py-6 reveal">
                  <dt className="text-lg md:text-xl font-display font-normal leading-snug tracking-tight text-waldgruen">
                    {f.q}
                  </dt>
                  <dd className="mt-3 text-waldgruen/70 leading-relaxed">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* CTA + RELATED — Waldgrün, fließt in den Footer */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          {guide.cta && (
            <Link
              href={guide.cta.href}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              {guide.cta.label} <span aria-hidden>→</span>
            </Link>
          )}
          {guide.related?.length ? (
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
              {guide.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="text-mehlcreme/80 border-b border-mehlcreme/25 hover:text-tonwarm hover:border-tonwarm pb-0.5 transition-colors"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          ) : null}
          <LeafDivider tone="light" className="mt-14 opacity-80" />
        </div>
      </section>
    </article>
  );
}
