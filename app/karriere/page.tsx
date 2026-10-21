import Image from "next/image";
import { ApplicationForm } from "@/components/application-form";
import { DaySection } from "@/components/day-section";
import { PageHead, UI } from "@/components/page-head";
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

/**
 * Karriere (Redesign 10/2026), hell: Stelle, vier Versprechen, Aufgaben und
 * Profil als offene Spalten, Zeiten, Formular, FAQ. Inhalte aus lib/jobs.ts.
 */
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(j)) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHead
        label="Wir suchen Verstärkung"
        title="Werde Teil von"
        accent="Wald & Wiese."
        intro={`${job.title}, ${job.employmentLabel}. Familienunternehmen in Sinzing bei Regensburg, faire Bezahlung und ein Team, das zusammenhält. Bewirb dich direkt hier, in zwei Minuten erledigt.`}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="#bewerben" className={UI.btnA}>Jetzt bewerben</a>
          <a href={`tel:${CONTACT.phoneRaw}`} className={UI.link}>Lieber anrufen? {CONTACT.phone}</a>
        </div>
      </PageHead>

      {/* FOTO + WARUM WIR */}
      <DaySection stage="morgen" className="pb-16 md:pb-24">
        <div className={`${UI.container} grid items-center gap-9 md:grid-cols-2 md:gap-16`}>
          <Image
            src={IMG.teamFamilie.src}
            alt="Das Team von Wald & Wiese in Sinzing"
            width={IMG.teamFamilie.width}
            height={IMG.teamFamilie.height}
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`${UI.foto} aspect-[4/5] w-full`}
            style={{ objectPosition: "center 25%" }}
          />
          <div>
            <p className={UI.label}>Warum bei uns</p>
            <h2 className={UI.h2}>Ein guter Ort zum Arbeiten</h2>
            <ul className="mt-6 grid list-none gap-0 p-0">
              {job.perks.map((perk) => (
                <li key={perk} className="border-b border-tanne/15 py-4 font-display text-[1.2rem] leading-snug">
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DaySection>

      {/* DIE STELLE */}
      <DaySection stage="morgen-2" id={job.slug} className="scroll-mt-24 py-16 md:py-24">
        <div className={UI.container}>
          <p className={UI.label}>Die Stelle · {job.employmentLabel} · {CONTACT.city}</p>
          <h2 className={UI.h2}>{job.title}</h2>
          <p className="mt-4 max-w-[60ch] text-[1.05rem] leading-relaxed text-muted-hell">{job.summary}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {[
              { t: "Deine Aufgaben", list: job.tasks },
              { t: "Das bringst du mit", list: job.profile },
            ].map((g) => (
              <div key={g.t} className="border-t border-tanne/15 pt-5">
                <h3 className="m-0 font-display text-[1.4rem] font-normal">{g.t}</h3>
                <ul className="mt-3 grid list-none gap-2 p-0 text-[0.95rem] leading-relaxed text-muted-hell">
                  {g.list.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t border-tanne/15 pt-5">
              <h3 className="m-0 font-display text-[1.4rem] font-normal">Arbeitszeiten</h3>
              <p className="mt-1 text-sm text-muted-hell">max. 10 Std./Woche</p>
              <dl className="mt-3 text-[0.95rem]">
                {job.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-4 border-b border-tanne/15 py-2.5">
                    <dt className="font-semibold">{h.label}</dt>
                    <dd className="text-right text-muted-hell">{h.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </DaySection>

      {/* FORMULAR */}
      <DaySection stage="vormittag" id="bewerben" className="scroll-mt-24 py-16 md:py-24">
        <div className={UI.narrow}>
          <p className={UI.label}>Direkt bewerben</p>
          <h2 className={UI.h2}>Schön, dass du dabei sein willst</h2>
          <p className="mt-3 max-w-[52ch] leading-relaxed text-muted-hell">
            Ein paar Angaben genügen, kein aufwendiges Anschreiben nötig. Wir melden uns zeitnah bei dir.
          </p>
          <div className="mt-8">
            <ApplicationForm positions={positions} />
          </div>
        </div>
      </DaySection>

      {/* FAQ + ABSCHLUSS */}
      <DaySection stage="mittag" className="py-16 md:py-24">
        <div className={UI.narrow}>
          <p className={UI.label}>Häufige Fragen</p>
          <h2 className={UI.h2}>Gut zu wissen</h2>
          <dl className="mt-8 border-t border-tanne/15">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-tanne/15 py-5">
                <dt className="font-display text-[1.25rem] font-normal">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-muted-hell">{f.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={`tel:${CONTACT.phoneRaw}`} className={UI.btnA}>{CONTACT.phone}</a>
            <a
              href={`mailto:${CONTACT.email}?subject=Bewerbung%20%E2%80%94%20${encodeURIComponent(job.title)}`}
              className={UI.link}
            >
              {CONTACT.email}
            </a>
          </div>
          <p className="mt-8 text-muted-hell">
            Wir freuen uns auf dich, <span className="font-semibold text-tanne">eure Familie Leber</span>
          </p>
        </div>
      </DaySection>
    </>
  );
}
