import Image from "next/image";
import Link from "next/link";
import { LeafDivider } from "@/components/leaf-divider";
import { IMG } from "@/lib/images";
import { BREAKFAST_LAUNCH, CONTACT, RESERVATION_URL } from "@/lib/site";

export const metadata = {
  title: "Frühstücksrestaurant in Sinzing bei Regensburg — ab 06.07.2026",
  description: `Frühstück bei Wald & Wiese — ab ${BREAKFAST_LAUNCH.dateLong} in Sinzing bei Regensburg. Brot vom Bäcker, Obst aus Sinzing, hausgemachte Aufstriche, Granola und Kaffee mit Charakter. Regional, hundefreundlich, vegan & vegetarisch. Jetzt vormerken.`,
  alternates: { canonical: "/fruehstueck" },
};

/** Was das Frühstück ausmacht — bewusst Konzept & Zutaten, noch keine konkreten
 *  Gerichte/Preise (Coming-Soon). Die Karte folgt kurz vor dem Start. */
const teaserItems = [
  "Brot vom Bäcker aus der Region",
  "Obst aus Sinzinger Höfen",
  "Hausgemachtes Granola & Aufstriche",
  "Herzhaft, süß & alles dazwischen",
  "Vegane & vegetarische Optionen gleichberechtigt",
  "Kaffee, der seinen Namen verdient",
];

/** Drei Versprechen — kurze, werbliche Bausteine ohne Gericht-Details. */
const promises: Array<{ kicker: string; title: string; body: string }> = [
  {
    kicker: "Regional",
    title: "Von hier, für hier.",
    body: "Brot vom Bäcker um die Ecke, Obst aus Sinzinger Höfen, Aufstriche und Granola aus unserer eigenen Küche. Was hier wächst, kommt auf den Tisch.",
  },
  {
    kicker: "Für alle",
    title: "Vegan, vegetarisch, herzhaft.",
    body: "Bei uns muss niemand suchen. Pflanzlich, vegetarisch und herzhaft stehen gleichberechtigt nebeneinander — jeder bekommt seinen Lieblingsmorgen.",
  },
  {
    kicker: "Mitten im Grünen",
    title: "Hund & Terrasse inklusive.",
    body: "Direkt am Waldrand, mit eigener Terrasse und eigenem Parkplatz. Dein Hund ist nicht nur erlaubt, sondern herzlich willkommen.",
  },
];

/** FAQ — alle Antworten aus bestätigten Fakten (Standort, Zeiten, Konzept).
 *  Speist zugleich das FAQPage-Schema unten. Keine erfundenen Gerichte/Preise. */
const faqs: Array<{ q: string; a: string }> = [
  {
    q: "Ab wann gibt es Frühstück bei Wald & Wiese?",
    a: `Wir starten am ${BREAKFAST_LAUNCH.dateLong}. Ab dann gibt es bei uns in Sinzing jeden Morgen frisches Frühstück. Die vollständige Frühstückskarte verraten wir kurz vor dem Start hier und auf Instagram.`,
  },
  {
    q: "Wo ist euer Frühstücksrestaurant?",
    a: `${CONTACT.street}, ${CONTACT.postalCode} ${CONTACT.city} — direkt am Waldrand und nur wenige Minuten von Regensburg. Mit eigenem Parkplatz.`,
  },
  {
    q: "Zu welchen Zeiten kann ich frühstücken?",
    a: `Ab ${BREAKFAST_LAUNCH.dateShort}: Mo – Do von 8 bis 14 Uhr, Fr – So ebenfalls ab 8 Uhr (Fr – So zusätzlich mit Abendservice). So bleibt der ganze Vormittag Zeit zum Genießen.`,
  },
  {
    q: "Gibt es auch veganes und vegetarisches Frühstück?",
    a: "Ja. Vegan, vegetarisch und herzhaft stehen bei uns gleichberechtigt auf der Karte — niemand muss lange suchen.",
  },
  {
    q: "Kann ich meinen Hund zum Frühstück mitbringen?",
    a: "Sehr gerne. Wald & Wiese ist ein hundefreundliches Restaurant — drinnen wie draußen auf der Terrasse ist dein Hund herzlich willkommen.",
  },
  {
    q: "Muss ich einen Tisch reservieren?",
    a: "Reservieren ist nicht Pflicht, aber gerade am Wochenende empfehlenswert. Du kannst bequem online über Lightspeed buchen oder uns einfach anrufen.",
  },
  {
    q: "Was kostet das Frühstück?",
    a: `Die vollständige Frühstückskarte mit allen Preisen veröffentlichen wir kurz vor dem Start am ${BREAKFAST_LAUNCH.dateShort}. Folge uns auf Instagram, dann verpasst du nichts.`,
  },
];

export default function FruehstueckPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* HERO — Vollbild-Foto (echtes Gästefoto) mit grünem Schleier */}
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
                Bald · Frühstück in Sinzing bei Regensburg
              </p>
              <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
                Frühstück,{" "}
                <span className="accent">mitten im Grünen.</span>
              </h1>
              <p className="mt-7 text-xl md:text-2xl text-mehlcreme/90">
                Wir werden zum Frühstücksrestaurant — Start am{" "}
                <span className="italic text-tonwarm">
                  {BREAKFAST_LAUNCH.dateLong}
                </span>
                .
              </p>
              <p className="mt-6 text-lg text-mehlcreme/80 max-w-xl leading-relaxed">
                Ab dann beginnt der Tag bei uns früher: regional, herzhaft oder
                süß, mit Brot vom Bäcker und Kaffee mit Charakter. Bring den Hund
                mit, bleib so lange du magst.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Start nicht verpassen <span aria-hidden>→</span>
                </a>
                <a
                  href={RESERVATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
                >
                  Tisch vormerken
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAS DICH ERWARTET — Creme-Lesebereich */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center reveal">
            <div className="lg:col-span-5">
              <p className="eyebrow no-line">Was dich erwartet</p>
              <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
                Klein, fein,{" "}
                <span className="accent">& ehrlich.</span>
              </h2>
              <p className="mt-8 text-waldgruen/70 leading-relaxed">
                Brot vom Bäcker aus der Region. Obst aus Sinzinger Höfen.
                Hausgemachte Aufstriche, Granola, Bananenbrot — vieles, was sonst
                nur die Oma so macht. Vegan, vegetarisch und herzhaft
                gleichberechtigt auf der Karte.
              </p>
            </div>
            <ul className="lg:col-span-7 divide-y divide-waldgruen/15 self-center">
              {teaserItems.map((t) => (
                <li key={t} className="flex items-baseline gap-4 py-4">
                  <span
                    aria-hidden
                    className="inline-block w-1.5 h-1.5 rounded-full bg-tonwarm flex-shrink-0"
                  />
                  <span className="font-display text-lg md:text-xl text-waldgruen">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DREI VERSPRECHEN — grüne Sektion, werblich, ohne Gericht-Details */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
          <div className="text-center reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Warum bei uns
            </p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Frühstücken, wie es{" "}
              <span className="accent">sein soll.</span>
            </h2>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-12">
            {promises.map((p) => (
              <div key={p.title} className="reveal-1">
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                  {p.kicker}
                </p>
                <h3 className="mt-3 text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-mehlcreme">
                  {p.title}
                </h3>
                <p className="mt-4 text-mehlcreme/75 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <LeafDivider tone="light" className="mt-20 opacity-80" />
        </div>
      </section>

      {/* SOMMELIER-TEASER — Creme, führt zum interaktiven Quiz */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-20 md:py-28">
          <div className="rounded-3xl bg-waldgruen text-mehlcreme px-8 py-12 md:px-14 md:py-16 text-center reveal-scale">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Frühstücks-Sommelier
            </p>
            <h2 className="mt-5 text-3xl md:text-5xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Was passt{" "}
              <span className="accent">zu dir?</span>
            </h2>
            <p className="mt-6 italic text-lg text-mehlcreme/80 max-w-md mx-auto leading-relaxed">
              Ein paar Fragen — und am Ende hast du deine Empfehlung und einen
              Tisch zur passenden Zeit.
            </p>
            <div className="mt-9">
              <Link
                href="/fruehstuecks-sommelier"
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                Zum Frühstücks-Sommelier <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — Creme, mit FAQPage-Schema (Rich Results) */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32">
          <div className="text-center reveal">
            <p className="eyebrow no-line justify-center">Häufige Fragen</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Gut zu{" "}
              <span className="accent">wissen.</span>
            </h2>
          </div>
          <dl className="mt-14 divide-y divide-waldgruen/15">
            {faqs.map((f) => (
              <div key={f.q} className="py-7 reveal-1">
                <dt className="text-xl md:text-2xl font-display font-normal leading-snug tracking-tight text-waldgruen">
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

      {/* FAMILIE LEBER NOTE — grüner Abschluss, fließt in den Footer */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
            Sei beim{" "}
            <span className="accent">Start dabei.</span>
          </h2>
          <div className="mt-10 space-y-5 italic text-lg md:text-xl text-mehlcreme/80 leading-relaxed">
            <p>
              Aktuell sind wir abends für dich da — Burger, Bowls, vom Grill. Das
              Frühstücks-Konzept bauen wir gerade mit viel Liebe auf.
            </p>
            <p>
              Wenn&apos;s am {BREAKFAST_LAUNCH.dateShort} so weit ist, schicken
              wir&apos;s als Erstes übers Instagram raus. Folg uns, dann bist du
              vom ersten Morgen an dabei.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              {CONTACT.instagramHandle} <span aria-hidden>→</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}?subject=Fr%C3%BChst%C3%BCck%20%E2%80%94%20wann%20geht%27s%20los%3F`}
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              Schreib uns
            </a>
          </div>
          <LeafDivider tone="light" className="mt-16 opacity-80" />
          <p className="mt-10 italic text-base text-mehlcreme/55">
            Genießt den Morgen,
            <br />
            <span className="text-mehlcreme font-normal not-italic">
              Eure Familie Leber
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
