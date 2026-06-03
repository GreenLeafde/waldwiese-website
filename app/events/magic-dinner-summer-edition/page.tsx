import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MagicDinnerForm } from "@/components/magic-dinner-form";
import { StampBadge } from "@/components/stamp-badge";
import { LeafDivider } from "@/components/leaf-divider";
import { IMG } from "@/lib/images";
import { CONTACT, MAGIC_DINNER, RESERVATION_URL, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Magic Dinner — Summer Edition · ${MAGIC_DINNER.dateShort}`,
  description: `Mehrgängiges Menü mit Tischzauberei von ${MAGIC_DINNER.magicianName} alias ${MAGIC_DINNER.magicianStageName} — ${MAGIC_DINNER.dateLong} ab ${MAGIC_DINNER.startTime} im Wald & Wiese, Sinzing.`,
  alternates: { canonical: "/events/magic-dinner-summer-edition" },
  openGraph: {
    title: `Magic Dinner — Summer Edition · ${MAGIC_DINNER.dateShort}`,
    description: `Close-Up-Magie direkt am Tisch. ${MAGIC_DINNER.dateLong} im Wald & Wiese, Sinzing.`,
    type: "article",
  },
};

const programItems = [
  {
    time: "ab 17:00",
    title: "Empfang",
    desc: "Aperitif auf der Terrasse, sobald du da bist.",
  },
  {
    time: "ca. 17:30",
    title: "Mehrgängiges Menü",
    desc: "Aus der Wald & Wiese-Küche, abgestimmt auf den Abend.",
  },
  {
    time: "zwischen den Gängen",
    title: "Close-Up-Magie am Tisch",
    desc: `${MAGIC_DINNER.magicianStageName} bewegt sich zwischen den Tischen — Karten, Münzen, kleine Wunder direkt vor dir.`,
  },
  {
    time: "zum Abschluss",
    title: "Dessert & Bühnen-Finale",
    desc: "Süßes Finale und der letzte große Moment.",
  },
];

export default function MagicDinnerPage() {
  return (
    <>
      {/* HERO — Waldgrün, echtes Foto + Datums-Stempel */}
      <section className="relative isolate bg-waldgruen text-mehlcreme overflow-hidden pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7 reveal">
            <nav
              aria-label="Brotkrumen"
              className="text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/50 mb-7"
            >
              <Link
                href="/events"
                className="hover:text-tonwarm transition-colors"
              >
                Events
              </Link>
              <span aria-hidden className="mx-3">
                /
              </span>
              <span className="text-mehlcreme/80">Magic Dinner</span>
            </nav>
            <p className="eyebrow no-line text-tonwarm">
              {MAGIC_DINNER.dateLong} · ab {MAGIC_DINNER.startTime}
            </p>
            <h1 className="mt-6 text-6xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
              Magic Dinner.
              <br />
              <span className="accent">Summer Edition.</span>
            </h1>
            <p className="mt-8 max-w-xl italic text-lg md:text-xl text-mehlcreme/80 leading-relaxed">
              Ein Abend zwischen Küche und Magie. Mehrgängiges Menü aus der
              Wald & Wiese-Küche, dazwischen Tischzauberei direkt vor dir.
            </p>
            <a
              href="#reservieren"
              className="mt-10 inline-flex items-center gap-3 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              Tisch sichern <span aria-hidden>→</span>
            </a>
          </div>
          <div className="md:col-span-5 reveal">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-mehlcreme/10">
              <Image
                src={IMG.magicBalloon.src}
                alt={IMG.magicBalloon.alt}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "center 25%" }}
              />
              {/* Datums-Stempel frei in der Ecke */}
              <StampBadge
                tone="light"
                rotate={-8}
                className="hidden sm:grid absolute z-10 top-5 right-5 w-28 h-28 md:w-32 md:h-32"
              >
                <span className="block text-[0.5rem] tracking-[0.12em] uppercase text-mehlcreme/80">
                  Save the date
                </span>
                <span className="block font-display text-sm md:text-base mt-1">
                  {MAGIC_DINNER.dateShort}
                </span>
              </StampBadge>
            </div>
          </div>
        </div>
      </section>

      {/* DAS WUNDERBARE — Story, Lese-Bereich auf Creme */}
      <section className="bg-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-32 text-center reveal">
          <p className="eyebrow no-line justify-center">
            Wer macht die Magie
          </p>
          <h2 className="mt-6 text-4xl md:text-5xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
            {MAGIC_DINNER.magicianName} —{" "}
            <span className="accent">alias {MAGIC_DINNER.magicianStageName}.</span>
          </h2>
          <p className="mt-8 italic text-lg md:text-xl text-waldgruen/65 max-w-xl mx-auto leading-relaxed">
            Mitglied der Familie Leber. Auftragsmagier für Hochzeiten,
            Firmenfeiern und Events. Beim Magic Dinner wandert er zwischen
            den Tischen und sorgt mit Close-Up-Magie für die Momente, von
            denen am Tag danach noch geredet wird.
          </p>
          <a
            href={MAGIC_DINNER.magicianUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm text-waldgruen hover:text-tonwarm border-b border-waldgruen/30 hover:border-tonwarm pb-0.5 transition-colors"
          >
            Mehr über Magicel <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* PROGRAMM — dunkles Grün */}
      <section className="bg-waldgruen-dark text-mehlcreme">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-20 md:py-32">
          <div className="reveal text-center">
            <p className="eyebrow no-line justify-center text-tonwarm">Ablauf</p>
            <h2 className="mt-6 text-4xl md:text-5xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              So läuft der Abend.
            </h2>
          </div>
          <ol className="mt-16 space-y-12 md:space-y-14">
            {programItems.map((item, i) => (
              <li
                key={item.title}
                className="grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-12 gap-y-1 items-baseline reveal"
              >
                <span className="font-display italic text-2xl md:text-3xl text-tonwarm leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[0.7rem] tracking-[0.22em] uppercase text-mehlcreme/55 mb-2">
                    {item.time}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-display font-normal leading-tight tracking-tight text-mehlcreme">
                    {item.title}
                  </h3>
                  <p className="mt-3 italic text-mehlcreme/75 leading-relaxed max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAKTEN-LEISTE — Waldgrün-Akzentband */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Datum", value: MAGIC_DINNER.dateLong },
            { label: "Beginn", value: MAGIC_DINNER.startTime },
            { label: "Ort", value: "Terrasse & Innen" },
            { label: "Plätze", value: "Begrenzt" },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                {f.label}
              </p>
              <p className="mt-3 font-display text-lg md:text-xl text-mehlcreme leading-tight">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RESERVIEREN — Formular, Lese-/Eingabe-Bereich auf Creme */}
      <section
        id="reservieren"
        className="bg-mehlcreme scroll-mt-24"
      >
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-20 md:py-32">
          <div className="text-center reveal">
            <p className="eyebrow no-line justify-center">Tisch sichern</p>
            <h2 className="mt-6 text-4xl md:text-5xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              Wir freuen uns auf dich.
            </h2>
            <p className="mt-7 italic text-lg text-waldgruen/65 max-w-xl mx-auto leading-relaxed">
              Schick uns kurz dein Datum und die Anzahl Personen — wir
              bestätigen meistens am selben Tag.
            </p>
          </div>

          <div className="mt-14 reveal">
            <MagicDinnerForm />
          </div>

          <div className="mt-14 pt-10 border-t border-waldgruen/15 reveal">
            <p className="text-[0.7rem] tracking-[0.22em] uppercase text-waldgruen/45 mb-5 text-center">
              Lieber direkt buchen?
            </p>
            <div className="max-w-md mx-auto">
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-waldgruen/15 hover:border-tonwarm p-6 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-xl text-waldgruen group-hover:text-tonwarm transition-colors">
                    Lightspeed
                  </span>
                  <span className="text-[0.6rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                    Online-Buchung
                  </span>
                </div>
                <p className="mt-2 text-sm text-waldgruen/65">
                  Tisch buchen, Datum {MAGIC_DINNER.dateShort} wählen.
                </p>
                <p className="mt-3 text-sm text-tonwarm">
                  Reservieren <span aria-hidden>→</span>
                </p>
              </a>
            </div>
            <p className="mt-6 text-center text-sm">
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="text-waldgruen/65 hover:text-tonwarm transition-colors"
              >
                oder anrufen · {CONTACT.phone}
              </a>
            </p>
          </div>
          <LeafDivider tone="dark" className="mt-16 opacity-90" />
        </div>
      </section>

      {/* JSON-LD strukturierte Daten für das Event */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Magic Dinner — Summer Edition",
            startDate: `${MAGIC_DINNER.date}T17:00`,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: SITE.name,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Bruckdorfer Straße 42",
                postalCode: "93161",
                addressLocality: "Sinzing",
                addressCountry: "DE",
              },
            },
            performer: {
              "@type": "Person",
              name: `${MAGIC_DINNER.magicianName} (${MAGIC_DINNER.magicianStageName})`,
              url: MAGIC_DINNER.magicianUrl,
            },
            organizer: {
              "@type": "Organization",
              name: SITE.name,
              url: SITE.url,
            },
            description:
              "Mehrgängiges Menü mit Close-Up-Magie am Tisch im Wald & Wiese, Sinzing.",
          }),
        }}
      />
    </>
  );
}
