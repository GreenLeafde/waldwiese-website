import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { LeafDivider } from "@/components/leaf-divider";
import { LeafMark } from "@/components/diet-leaf";
import { IMG } from "@/lib/images";
import { BREAKFAST_MENU, BREAKFAST_WELCOME, type BreakfastDish } from "@/lib/menu";
import { CONTACT, RESERVATION_URL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Brunch in Sinzing bei Regensburg — Frühstück, Brote, Bowls & Mittagstisch",
  description:
    "Die Brunch-Karte von Wald & Wiese in Sinzing bei Regensburg: täglich von 8–14 Uhr Frühstück, Brote, „Schmusi“-Bowls und ab 11:30 Uhr der Mittagstisch. Hausgemacht, regional, vegan & vegetarisch, hundefreundlich. Mit Kaffee, der seinen Namen verdient.",
  alternates: { canonical: "/brunch" },
  openGraph: {
    title: "Brunch bei Wald & Wiese — Sinzing bei Regensburg",
    description:
      "Täglich 8–14 Uhr: Frühstück, Brote, Bowls & Mittagstisch. Hausgemacht, regional, mitten im Grünen.",
    url: "/brunch",
    type: "website",
  },
};

/** FAQ — alle Antworten aus bestätigten Fakten (Karte, Zeiten, Standort). */
const faqs: Array<{ q: string; a: string }> = [
  {
    q: "Was ist der Unterschied zwischen Frühstück und Brunch bei Wald & Wiese?",
    a: "Bei uns fließt beides ineinander. Von 8 Uhr an gibt es Frühstücke, Brote und Bowls, ab 11:30 Uhr kommen die Mittagsgerichte dazu — Currywurst, Burger und Salate. Du entscheidest, wie spät dein Morgen wird.",
  },
  {
    q: "Wann gibt es Brunch?",
    a: "Jeden Tag von 8 bis 14 Uhr. Die Mittagsgerichte gibt es ab 11:30 Uhr bis 14 Uhr.",
  },
  {
    q: "Wo ist euer Restaurant?",
    a: `${CONTACT.street}, ${CONTACT.postalCode} ${CONTACT.city} — direkt am Waldrand und nur wenige Minuten von Regensburg. Mit eigenem Parkplatz.`,
  },
  {
    q: "Gibt es veganen und vegetarischen Brunch?",
    a: "Ja. Vegan, vegetarisch und herzhaft stehen bei uns gleichberechtigt auf der Karte — von der veganen „grünen Gretl“ bis zu den Schmusi-Bowls. Frag gern unser Serviceteam nach den Kennzeichnungen.",
  },
  {
    q: "Kann ich meinen Hund mitbringen?",
    a: "Sehr gerne. Wald & Wiese ist ein hundefreundliches Restaurant — drinnen wie draußen auf der Terrasse ist dein Hund herzlich willkommen.",
  },
  {
    q: "Muss ich einen Tisch reservieren?",
    a: "Reservieren ist nicht Pflicht, aber gerade am Wochenende empfehlenswert. Du kannst bequem online reservieren oder uns einfach anrufen.",
  },
  {
    q: "Gibt es bei euch auch Abendessen?",
    a: "Ja — von Freitag bis Sonntag sind wir zusätzlich von 17 bis 22 Uhr für dich da: Burger, Bowls und vom Grill. Die ganze Auswahl steht auf unserer Abendkarte.",
  },
];

type MenuTag = NonNullable<BreakfastDish["tags"]>[number];

const TAG_LABEL: Record<MenuTag, string> = {
  vegan: "Vegan",
  vegetarisch: "Vegetarisch",
  "vegan möglich": "Vegan möglich",
  "vegetarisch möglich": "Vegetarisch möglich",
};

function Tag({ tag }: { tag: MenuTag }) {
  const vegan = tag === "vegan" || tag === "vegan möglich";
  return (
    <span className="ml-3 inline-flex items-center gap-1 align-middle text-[0.6rem] tracking-[0.2em] uppercase text-waldgruen/70 font-body font-medium">
      <LeafMark filled={vegan} className="w-3 h-3 shrink-0" />
      {TAG_LABEL[tag]}
    </span>
  );
}

function Price({ price }: { price: BreakfastDish["price"] }) {
  if (Array.isArray(price)) {
    return (
      <span className="font-display text-lg md:text-xl text-tonwarm whitespace-nowrap text-right leading-tight">
        {price.map((p) => (
          <span key={p} className="block">
            {p}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="font-display text-lg md:text-xl text-tonwarm whitespace-nowrap">
      {price}
    </span>
  );
}

export default function BrunchPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const menuJsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Brunch-Karte",
    url: `${SITE.url}/brunch`,
    hasMenuSection: BREAKFAST_MENU.map((cat) => ({
      "@type": "MenuSection",
      name: cat.title,
      hasMenuItem: cat.items.map((dish) => ({
        "@type": "MenuItem",
        name: dish.name,
        ...(dish.desc ? { description: dish.desc } : {}),
      })),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />

      {/* HERO — Vollbild-Foto mit grünem Schleier */}
      <section className="relative isolate flex items-center min-h-svh text-mehlcreme overflow-hidden">
        <Image
          src={IMG.fruehstueckFoto.src}
          alt={IMG.fruehstueckFoto.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover parallax"
          style={{ objectPosition: "center 55%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark/95 via-waldgruen-dark/75 to-waldgruen-dark/35"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-waldgruen-dark/80 via-transparent to-transparent"
        />
        <div className="relative w-full">
          <div className="mx-auto max-w-7xl px-6 md:px-10 pt-28 md:pt-36">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/60 hover:text-tonwarm transition-colors"
            >
              <span aria-hidden>←</span> Startseite
            </Link>
          </div>
          <div className="mx-auto max-w-7xl px-6 md:px-10 pt-10 md:pt-14 pb-20 md:pb-28">
            <div className="max-w-2xl reveal">
              <p className="eyebrow no-line text-tonwarm">
                Brunch · täglich 8–14 Uhr · Sinzing bei Regensburg
              </p>
              <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
                Brunch,{" "}
                <span className="accent">mitten im Grünen.</span>
              </h1>
              <p className="mt-7 text-xl md:text-2xl text-mehlcreme/90">
                Frühstück, Brote, Bowls — und ab 11:30 Uhr der Mittagstisch.
                Hausgemacht, regional, so lange du magst.
              </p>
              <p className="mt-6 text-lg text-mehlcreme/80 max-w-xl leading-relaxed">
                Vegan, vegetarisch und herzhaft stehen gleichberechtigt auf der
                Karte. Bring den Hund mit, genieß den Blick ins Grüne.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href={RESERVATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Tisch reservieren <span aria-hidden>→</span>
                </a>
                <Link
                  href="/getraenke"
                  className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
                >
                  Getränkekarte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WILLKOMMEN — kurzer Text von der Karte */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <p className="eyebrow no-line justify-center">
            {BREAKFAST_WELCOME.headline}
          </p>
          <div className="mt-8 space-y-5 text-lg md:text-xl text-waldgruen/75 leading-relaxed">
            {BREAKFAST_WELCOME.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 italic text-tonwarm">
            {BREAKFAST_WELCOME.signoff.join(" ")}
          </p>
        </div>
      </section>

      {/* TABS */}
      <CategoryTabs
        tabs={BREAKFAST_MENU.map((c) => ({ slug: c.slug, title: c.title }))}
        scrollOffset={150}
      />

      {/* MENÜ */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32 space-y-20 md:space-y-28">
          {BREAKFAST_MENU.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="reveal scroll-mt-[150px]">
              <div className="mb-12">
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  Brunch-Karte · Kategorie
                </p>
                <h2 className="mt-3 text-4xl md:text-5xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                  {cat.title}
                </h2>
                {cat.hint && (
                  <p className="mt-3 italic text-waldgruen/65">{cat.hint}</p>
                )}
              </div>

              <ul className="space-y-9">
                {cat.items.map((dish) => (
                  <li key={dish.name}>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-xl md:text-2xl font-display font-normal leading-tight tracking-tight text-waldgruen">
                        {dish.name}
                        {dish.tags?.map((t) => (
                          <Tag key={t} tag={t} />
                        ))}
                      </h3>
                      <span
                        aria-hidden
                        className="flex-1 border-b border-dotted border-waldgruen/20 translate-y-[-4px]"
                      />
                      <Price price={dish.price} />
                    </div>
                    {dish.desc && (
                      <p className="mt-2 italic text-waldgruen/65 leading-relaxed max-w-2xl">
                        {dish.desc}
                      </p>
                    )}
                    {dish.options?.map((opt) => (
                      <p key={opt.label} className="mt-1 text-sm text-tonwarm">
                        + {opt.label}{" "}
                        <span className="text-waldgruen/45">{opt.price}</span>
                      </p>
                    ))}
                    {dish.hint && (
                      <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-waldgruen/45">
                        {dish.hint}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-center text-sm italic text-waldgruen/45">
            Alle Preise inkl. MwSt. · Über Allergene &amp; Zusatzstoffe
            informiert dich gerne unser Serviceteam · Änderungen vorbehalten.
          </p>
          <LeafDivider tone="dark" className="mt-12 opacity-90" />
        </div>
      </section>

      {/* SUB-CTA — Getränke & Abendkarte */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-28 text-center reveal">
          <p className="eyebrow no-line justify-center">Und dazu?</p>
          <h2 className="mt-7 text-3xl md:text-4xl font-display font-normal leading-tight tracking-tight text-mehlcreme">
            Kaffee mit <span className="accent">Charakter.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-mehlcreme/80 leading-relaxed">
            Filterkaffee, Latte, Matcha, hausgemachte Limonaden und mehr — auch
            entkoffeiniert, mit Hafermilch oder laktosefrei. Abends (Fr – So)
            gibt es zusätzlich Burger, Bowls & vom Grill.
          </p>
          <div className="mt-9 flex flex-wrap justify-center items-center gap-5">
            <Link
              href="/getraenke"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Zur Getränkekarte <span aria-hidden>→</span>
            </Link>
            <Link
              href="/abendessen"
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Zur Abendkarte
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — mit FAQPage-Schema */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32">
          <div className="text-center reveal">
            <p className="eyebrow no-line justify-center">Häufige Fragen</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Gut zu <span className="accent">wissen.</span>
            </h2>
          </div>
          <dl className="mt-14 divide-y divide-waldgruen/15">
            {faqs.map((f) => (
              <div key={f.q} className="py-7 reveal-1">
                <dt className="text-xl md:text-2xl font-display font-normal leading-snug tracking-tight text-waldgruen">
                  {f.q}
                </dt>
                <dd className="mt-3 text-waldgruen/70 leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
