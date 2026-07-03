import Image from "next/image";
import Link from "next/link";
import { LeafDivider } from "@/components/leaf-divider";
import { ApplicationForm } from "@/components/application-form";
import { IMG } from "@/lib/images";
import { ACTIVE_JOBS, jobPostingJsonLd } from "@/lib/jobs";
import { CONTACT } from "@/lib/site";

export const metadata = {
  title: "Karriere & Jobs — Minijob in Sinzing bei Regensburg",
  description:
    "Wald & Wiese sucht Küchenhilfe & Servicekraft (m/w/d) als Minijob in Sinzing bei Regensburg — max. 10 Std./Woche, faire Bezahlung, tolles Team im Familienunternehmen. Jetzt direkt online bewerben.",
  alternates: { canonical: "/karriere" },
  openGraph: {
    title: "Jobs bei Wald & Wiese — Küchenhilfe & Servicekraft (Minijob)",
    description:
      "Verstärke unser Familienteam in Sinzing bei Regensburg: Minijob mit max. 10 Std./Woche, faire Bezahlung. Jetzt direkt online bewerben.",
    url: "/karriere",
  },
};

/** FAQ — bewerber-relevante Fragen. Speist zugleich das FAQPage-Schema (AEO). */
const faqs: Array<{ q: string; a: string }> = [
  {
    q: "Welche Stellen sind bei Wald & Wiese offen?",
    a: "Aktuell suchen wir eine Küchenhilfe bzw. Servicekraft (m/w/d) als Minijob in unserem Familienrestaurant in Sinzing bei Regensburg. Du kannst in der Küche, im Service oder in beidem mitarbeiten.",
  },
  {
    q: "Wie viele Stunden umfasst der Minijob?",
    a: "Maximal 10 Stunden pro Woche. Der Job ist als Minijob (geringfügige Beschäftigung) angelegt und lässt sich gut mit Schule, Studium, Familie oder einem anderen Job vereinbaren.",
  },
  {
    q: "Wann sind die Arbeitszeiten?",
    a: "Die Einsätze liegen Montag bis Sonntag von 8:00 bis 14:00 Uhr sowie Freitag bis Sonntag von 17:00 bis 22:00 Uhr. Die konkreten Zeiten stimmen wir gemeinsam mit dir ab.",
  },
  {
    q: "Brauche ich Erfahrung in der Gastronomie?",
    a: "Nein. Erfahrung ist willkommen, aber kein Muss — wir arbeiten dich in Ruhe ein. Wichtiger sind Zuverlässigkeit, Freundlichkeit und Lust, im Team anzupacken.",
  },
  {
    q: "Wie bewerbe ich mich?",
    a: "Am schnellsten über das Bewerbungsformular direkt auf dieser Seite. Alternativ per E-Mail an " +
      CONTACT.email +
      " oder telefonisch unter " +
      CONTACT.phone +
      ".",
  },
  {
    q: "Wo befindet sich das Restaurant?",
    a: `Wald & Wiese liegt in der ${CONTACT.street}, ${CONTACT.postalCode} ${CONTACT.city} — nur wenige Minuten von Regensburg entfernt, mitten im Grünen am Waldrand.`,
  },
];

export default function KarrierePage() {
  const job = ACTIVE_JOBS[0];
  const positions = ACTIVE_JOBS.map((j) => ({ value: j.slug, label: j.title }));

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
      {ACTIVE_JOBS.map((j) => (
        <script
          key={j.slug}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingJsonLd(j)),
          }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* HERO — Team-Foto mit grünem Schleier */}
      <section className="relative isolate flex items-center min-h-svh text-mehlcreme overflow-hidden">
        <Image
          src={IMG.teamFamilie.src}
          alt="Das Team von Wald & Wiese in Sinzing"
          fill
          priority
          sizes="100vw"
          className="object-cover parallax"
          style={{ objectPosition: "center 30%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-waldgruen-dark/95 via-waldgruen-dark/80 to-waldgruen-dark/45"
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
                Wir suchen Verstärkung
              </p>
              <h1 className="mt-7 text-5xl md:text-7xl lg:text-8xl font-display font-normal leading-[0.95] tracking-tight text-mehlcreme">
                Werde Teil vom{" "}
                <span className="accent">Wald &amp; Wiese.</span>
              </h1>
              <p className="mt-7 text-xl md:text-2xl text-mehlcreme/90">
                {job.title} —{" "}
                <span className="italic text-tonwarm">
                  {job.employmentLabel}
                </span>
                .
              </p>
              <p className="mt-6 text-lg text-mehlcreme/80 max-w-xl leading-relaxed">
                Familienunternehmen in Sinzing bei Regensburg, faire Bezahlung
                und ein Team, das zusammenhält. Bewirb dich direkt hier — in
                zwei Minuten erledigt.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href="#bewerben"
                  className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Jetzt bewerben <span aria-hidden>↓</span>
                </a>
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
                >
                  Lieber anrufen? {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WARUM WIR — die vier Versprechen aus der Anzeige */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-24 md:py-32">
          <div className="text-center reveal">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Warum bei uns
            </p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
              Ein guter Ort zum{" "}
              <span className="accent">Arbeiten.</span>
            </h2>
          </div>
          <ul className="mt-16 grid gap-px sm:grid-cols-2 bg-mehlcreme/10 rounded-3xl overflow-hidden ring-1 ring-mehlcreme/10">
            {job.perks.map((perk) => (
              <li
                key={perk}
                className="reveal-1 flex items-start gap-4 bg-waldgruen px-7 py-8 md:px-9 md:py-10"
              >
                <span
                  aria-hidden
                  className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-tonwarm text-white text-sm"
                >
                  ✓
                </span>
                <span className="font-display text-lg md:text-xl text-mehlcreme leading-snug">
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DIE STELLE — Aufgaben, Profil, Zeiten */}
      <section id={job.slug} className="bg-mehlcreme scroll-mt-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 md:py-32">
          <div className="reveal max-w-2xl">
            <p className="eyebrow no-line">Die Stelle</p>
            <h2 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-waldgruen">
              {job.title}
            </h2>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.15em] text-tonwarm">
              {job.employmentLabel} · {CONTACT.city} bei Regensburg
            </p>
            <p className="mt-8 text-waldgruen/70 leading-relaxed text-lg">
              {job.summary}
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-2 reveal">
            <div>
              <h3 className="font-display text-2xl text-waldgruen">
                Deine Aufgaben
              </h3>
              <ul className="mt-6 divide-y divide-waldgruen/15">
                {job.tasks.map((t) => (
                  <li key={t} className="flex items-baseline gap-4 py-4">
                    <span
                      aria-hidden
                      className="inline-block w-1.5 h-1.5 rounded-full bg-tonwarm flex-shrink-0"
                    />
                    <span className="text-waldgruen/80 leading-relaxed">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-2xl text-waldgruen">
                Das bringst du mit
              </h3>
              <ul className="mt-6 divide-y divide-waldgruen/15">
                {job.profile.map((p) => (
                  <li key={p} className="flex items-baseline gap-4 py-4">
                    <span
                      aria-hidden
                      className="inline-block w-1.5 h-1.5 rounded-full bg-tonwarm flex-shrink-0"
                    />
                    <span className="text-waldgruen/80 leading-relaxed">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Arbeitszeiten */}
          <div className="mt-16 reveal rounded-3xl bg-white ring-1 ring-waldgruen/10 px-7 py-8 md:px-10 md:py-10">
            <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
              Arbeitszeiten · max. 10 Std./Woche
            </p>
            <dl className="mt-5 divide-y divide-waldgruen/15 text-sm max-w-md">
              {job.hours.map((h) => (
                <div
                  key={h.label}
                  className="py-3 flex justify-between gap-4 text-waldgruen/70"
                >
                  <dt className="font-medium text-waldgruen">{h.label}</dt>
                  <dd>{h.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* BEWERBUNGSFORMULAR */}
      <section id="bewerben" className="bg-mehlcreme scroll-mt-24">
        <div className="mx-auto max-w-2xl px-6 md:px-10 pb-8">
          <div className="reveal text-center">
            <p className="eyebrow no-line justify-center text-tonwarm">
              Direkt bewerben
            </p>
            <h2 className="mt-5 text-3xl md:text-4xl font-display font-normal text-waldgruen">
              Schön, dass du dabei sein willst
            </h2>
            <p className="mt-4 italic text-waldgruen/60 max-w-md mx-auto leading-relaxed">
              Ein paar Angaben genügen — kein aufwendiges Anschreiben nötig. Wir
              melden uns zeitnah bei dir.
            </p>
          </div>
          <div className="reveal mt-10">
            <ApplicationForm positions={positions} />
          </div>
        </div>
      </section>

      {/* FAQ — mit FAQPage-Schema (Rich Results / AEO) */}
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

      {/* ABSCHLUSS — grüner Ausklang, fließt in den Footer */}
      <section className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-6 md:px-10 py-24 md:py-32 text-center reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal leading-[1.05] tracking-tight text-mehlcreme">
            Noch Fragen?{" "}
            <span className="accent">Meld dich einfach.</span>
          </h2>
          <p className="mt-8 italic text-lg md:text-xl text-mehlcreme/80 leading-relaxed">
            Lieber persönlich als per Formular? Ruf uns an oder schreib uns —
            wir freuen uns, dich kennenzulernen.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
            >
              {CONTACT.phone} <span aria-hidden>→</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}?subject=Bewerbung%20%E2%80%94%20${encodeURIComponent(
                job.title,
              )}`}
              className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
            >
              {CONTACT.email}
            </a>
          </div>
          <LeafDivider tone="light" className="mt-16 opacity-80" />
          <p className="mt-10 italic text-base text-mehlcreme/55">
            Wir freuen uns auf dich,
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
