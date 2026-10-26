import Image from "next/image";
import Link from "next/link";
import { DaySection, type Tone } from "@/components/day-section";
import { GoogleReviews } from "@/components/google-reviews";
import { KarteDish } from "@/components/karte";
import { LANDING_STAGES, landingPreset } from "@/components/landing-extras";
import { PageTone } from "@/components/page-tone";
import { ReserveButton } from "@/components/reserve-chooser";
import type { ReserveSlot } from "@/lib/reservation";
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

const CONTAINER = "mx-auto w-full max-w-[1180px] px-5 md:px-12";
const LABEL = "text-xs font-semibold uppercase tracking-[0.16em] text-akzent";
const H2 = "mt-2 font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]";
const BTN_A = "inline-flex h-[50px] items-center justify-center rounded-full bg-akzent px-[26px] text-[0.95rem] font-semibold text-white transition-colors hover:bg-akzent-hover";
const LINK = "font-semibold border-b-[1.5px] border-current pb-0.5";

/** Primärer Knopf: Reservieren öffnet die Vorauswahl, alles andere ist ein Link. */
function LandingCta({
  cta,
  location,
  slot,
}: {
  cta: { label: string; href: string };
  location: string;
  slot?: ReserveSlot;
}) {
  if (cta.href === "/reservieren") {
    return (
      <ReserveButton location={location} pre={slot} className={BTN_A}>
        {cta.label}
      </ReserveButton>
    );
  }
  return (
    <Link href={cta.href} className={BTN_A}>
      {cta.label}
    </Link>
  );
}

/**
 * Landingpage-Template (Redesign 10/2026): Kopf mit Text und großem Foto →
 * drei Punkte als offene Spalten → Karten-Auszug mit echten Preisen →
 * optionaler Textblock → Zahlen → FAQ → Google-Bewertungen → Abschluss.
 * Ein Raster, keine Kästen, keine Ornamente. Ton, Gerichte und
 * Reservierungs-Slot kommen aus landingPreset(path), `tone` kann es
 * überschreiben (Feiern-Seiten).
 */
export function RichLanding({
  content,
  path,
  splitImage,
  tone,
}: {
  content: LandingContent;
  path: string;
  splitImage: { src: string; alt: string; position?: string };
  tone?: Tone;
}) {
  const preset = landingPreset(path);
  const t: Tone = tone ?? preset.tone;
  const dark = t === "dunkel";
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
      { "@type": "ListItem", position: 2, name: content.breadcrumb, item: `${SITE.url}${path}` },
    ],
  };

  const features = content.features.items.slice(0, 3);
  const splitParas = content.split?.paragraphs.slice(0, 2) ?? [];
  const [s0, s1, s2, s3, s4, s5, s6] = LANDING_STAGES[t];
  const muted = dark ? "text-creme/75" : "text-muted-hell";
  const soft = dark ? "text-creme/60" : "text-tanne/60";
  /** Feiern-Seiten zeigen keinen Karten-Auszug; dort geht es um die Anfrage. */
  const showDishes = !tone && preset.dishes.length > 0;

  return (
    <>
      {dark && <PageTone tone="dunkel" />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* KOPF: Text links, Foto rechts */}
      <DaySection stage={s0} className="pt-[116px] pb-14 md:pt-[140px] md:pb-20">
        <div className={CONTAINER}>
          <nav aria-label="Brotkrumen" className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${soft}`}>
            <Link href="/" className="hover:underline underline-offset-4">Startseite</Link>
            <span aria-hidden>/</span>
            <span>{content.breadcrumb}</span>
          </nav>
          <div className="mt-8 grid items-center gap-9 md:grid-cols-[1.05fr_1fr] md:gap-14">
            <div className="grid justify-items-start gap-4 md:gap-5">
              <p className={LABEL}>{content.eyebrow}</p>
              <h1 className="font-display text-[2.5rem] font-light leading-[1.05] md:text-[3.5rem]">
                {content.h1Lead} <span className="font-normal">{content.h1Accent}</span>
              </h1>
              <p className={`m-0 max-w-[48ch] text-[1.05rem] leading-relaxed md:text-[1.15rem] ${muted}`}>
                {content.intro}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <LandingCta cta={content.primaryCta} location={`landing-kopf:${path}`} slot={preset.slot} />
                <a href={`tel:${CONTACT.phoneRaw}`} className={LINK}>
                  {CONTACT.phone}
                </a>
              </div>
            </div>
            <Image
              src={splitImage.src}
              alt={splitImage.alt}
              width={1600}
              height={1200}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/3] w-full rounded-[18px] object-cover"
              style={{ objectPosition: splitImage.position ?? "center" }}
            />
          </div>
        </div>
      </DaySection>

      {/* DREI PUNKTE — offene Spalten */}
      <DaySection stage={s1} className="py-14 md:py-20">
        <div className={CONTAINER}>
          <h2 className="max-w-[24ch] font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">
            {content.features.heading} {content.features.accent}
          </h2>
          <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-3 md:gap-10">
            {features.map((item) => (
              <li key={item.title} className="border-t pt-5" style={{ borderColor: "var(--linie)" }}>
                <h3 className="m-0 font-display text-[1.4rem] font-normal leading-tight">{item.title}</h3>
                <p className={`mt-2 leading-relaxed ${muted}`}>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </DaySection>

      {/* KARTEN-AUSZUG mit echten Preisen */}
      {showDishes && (
        <DaySection stage={s2} className="py-14 md:py-20">
          <div className={CONTAINER}>
            <div className="mb-6 grid gap-3 md:mb-8 md:flex md:items-end md:justify-between">
              <div>
                <p className={LABEL}>{preset.dishesTitle}</p>
                <h2 className={H2}>Bei uns hat jedes Gericht einen Namen</h2>
              </div>
              <Link href="/speisekarte" className={`${LINK} justify-self-start`}>Ganze Karte mit Preisen</Link>
            </div>
            <ul className="m-0 grid list-none p-0 md:grid-cols-2 md:gap-x-10">
              {preset.dishes.map((d) => (
                <KarteDish key={d.name} dish={d} tone={dark ? "light" : "dark"} />
              ))}
            </ul>
            {preset.slot && (
              <div className="mt-8">
                <ReserveButton location={`landing-karte:${path}`} pre={preset.slot} className={BTN_A}>
                  {preset.slot === "abend" ? "Abend reservieren" : "Brunch reservieren"}
                </ReserveButton>
              </div>
            )}
          </div>
        </DaySection>
      )}

      {/* OPTIONALER TEXTBLOCK */}
      {content.split && splitParas.length > 0 && (
        <DaySection stage={s3} className="py-14 md:py-20">
          <div className={`${CONTAINER} max-w-[860px]`}>
            <p className={LABEL}>{content.split.eyebrow}</p>
            <h2 className={H2}>
              {content.split.heading} {content.split.accent}
            </h2>
            <div className={`mt-5 grid gap-4 text-[1.05rem] leading-relaxed ${muted}`}>
              {splitParas.map((p, i) => (
                <p key={i} className="m-0">{p}</p>
              ))}
            </div>
          </div>
        </DaySection>
      )}

      {/* ZAHLEN */}
      <DaySection stage={s4} className="py-14 md:py-20">
        <div className={CONTAINER}>
          <ul className="grid list-none gap-6 p-0 sm:grid-cols-3 md:gap-10">
            {content.stats.map((s) => (
              <li key={s.label} className="border-t pt-5" style={{ borderColor: "var(--linie)" }}>
                <p className="m-0 font-display text-[2.4rem] font-light leading-none md:text-[3rem]">{s.value}</p>
                <p className={`mt-2 text-sm ${muted}`}>{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </DaySection>

      {/* FAQ */}
      <DaySection stage={s5} className="py-14 md:py-20">
        <div className={`${CONTAINER} max-w-[860px]`}>
          <p className={LABEL}>Häufige Fragen</p>
          <h2 className={H2}>Gut zu wissen</h2>
          <div className="mt-8 border-t" style={{ borderColor: "var(--linie)" }}>
            {content.faq.map((f) => (
              <details key={f.question} className="group border-b py-5" style={{ borderColor: "var(--linie)" }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-display text-[1.25rem] font-normal">{f.question}</span>
                  <span aria-hidden className="text-2xl leading-none text-akzent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className={`mt-3 leading-relaxed ${muted}`}>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </DaySection>

      {/* WEITERFÜHREND — interne Links zu verwandten Seiten */}
      {content.related && content.related.length > 0 && (
        <DaySection stage={s4} className="py-14 md:py-16">
          <div className={CONTAINER}>
            <p className={LABEL}>Auch interessant</p>
            <ul className="mt-6 grid list-none gap-6 p-0 md:grid-cols-3 md:gap-10">
              {content.related.slice(0, 3).map((r) => (
                <li key={r.href} className="border-t pt-5" style={{ borderColor: "var(--linie)" }}>
                  <Link href={r.href} className="font-display text-[1.3rem] font-normal leading-tight hover:underline underline-offset-4">
                    {r.label} →
                  </Link>
                  <p className={`mt-2 leading-relaxed ${muted}`}>{r.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        </DaySection>
      )}

      {/* GOOGLE-BEWERTUNGEN + ABSCHLUSS — id="anfrage": Ziel der Vorauswahl „Feier" */}
      <DaySection stage={s6} id="anfrage" className="scroll-mt-24 py-14 md:py-20">
        <div className={CONTAINER}>
          <p className={LABEL}>Gäste über uns</p>
          <GoogleReviews limit={4} className="mt-4" />
          <div className="mt-14 grid gap-6 border-t pt-10 md:grid-cols-[1fr_auto] md:items-end md:gap-16" style={{ borderColor: "var(--linie)" }}>
            <div>
              <h2 className="font-display text-[2rem] font-normal leading-[1.1] md:text-[2.5rem]">
                {content.closing.heading} {content.closing.accent}
              </h2>
              <p className={`mt-3 max-w-[56ch] leading-relaxed ${muted}`}>{content.closing.text}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <LandingCta cta={content.closing.cta} location={`landing-abschluss:${path}`} slot={preset.slot} />
              <a href={`mailto:${CONTACT.email}`} className={LINK}>
                {CONTACT.email}
              </a>
            </div>
          </div>
        </div>
      </DaySection>
    </>
  );
}
