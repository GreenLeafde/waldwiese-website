/**
 * Offene Stellen — zentrale Quelle für die Karriere-Seite UND das
 * JobPosting-Schema (schema.org) zugleich. Alle Angaben aus der aktuellen
 * Stellenanzeige (Küchenhilfe / Servicekraft, Minijob) — nichts erfunden.
 *
 * Neue Stelle? Einfach ein weiteres Objekt in JOBS ergänzen. Ist ein Job
 * besetzt, `active: false` setzen (bleibt für's Archiv erhalten, verschwindet
 * aber von der Seite).
 */

import { CONTACT, SITE } from "./site";

export type Job = {
  /** URL-Slug, z. B. "kuechenhilfe-servicekraft-minijob". */
  slug: string;
  /** Titel wie in der Anzeige. */
  title: string;
  /** Kurz-Untertitel / Beschäftigungsart in Worten. */
  kicker: string;
  /** Beschäftigungsart für schema.org (JobPosting.employmentType). */
  employmentType: "PART_TIME" | "FULL_TIME" | "CONTRACTOR" | "TEMPORARY";
  /** Menschlich lesbare Beschäftigungsart (z. B. "Minijob · Teilzeit"). */
  employmentLabel: string;
  /** Ein, zwei Sätze fürs Intro / die Meta-Description. */
  summary: string;
  /** Datum der Veröffentlichung (ISO), für JobPosting.datePosted. */
  datePosted: string;
  /** Gültig bis (ISO) — Pflichtfeld für saubere Rich Results. */
  validThrough: string;
  /** Die Kernvorteile aus der Anzeige (Häkchen-Liste). */
  perks: string[];
  /** Was der Job umfasst. */
  tasks: string[];
  /** Was wir uns wünschen (bewusst niedrigschwellig). */
  profile: string[];
  /** Arbeitszeit-Fenster im Klartext (aus der Anzeige). */
  hours: { label: string; detail: string }[];
  /** Ist die Stelle aktuell ausgeschrieben? */
  active: boolean;
};

export const JOBS: Job[] = [
  {
    slug: "kuechenhilfe-servicekraft-minijob",
    title: "Küchenhilfe / Servicekraft (m/w/d)",
    kicker: "Minijob im Familienunternehmen",
    employmentType: "PART_TIME",
    employmentLabel: "Minijob · max. 10 Std./Woche",
    summary:
      "Wir suchen Verstärkung für Küche und Service in unserem Familien­restaurant in Sinzing bei Regensburg — als Minijob mit maximal 10 Stunden pro Woche, fairer Bezahlung und einem Team, in dem du dich wohlfühlst.",
    datePosted: "2026-07-02",
    validThrough: "2026-12-31",
    perks: [
      "Familienunternehmen mit Herz — kurze Wege, echtes Miteinander",
      "Max. 10 Std. / Woche — planbar und gut mit anderem vereinbar",
      "Faire Bezahlung",
      "Tolles Team, das zusammenhält",
    ],
    tasks: [
      "In der Küche zur Hand gehen: vorbereiten, anrichten, sauber halten",
      "Im Service unsere Gäste freundlich betreuen — vom Frühstück bis zum Abend",
      "Getränke und Speisen servieren, Tische eindecken und abräumen",
      "Für einen reibungslosen, schönen Ablauf sorgen",
    ],
    profile: [
      "Freude am Umgang mit Menschen und ein freundliches Auftreten",
      "Zuverlässigkeit und Lust, im Team anzupacken",
      "Erfahrung ist schön, aber kein Muss — wir arbeiten dich ein",
      "Bereitschaft, auch am Wochenende mit dabei zu sein",
    ],
    hours: [
      { label: "Mo – So", detail: "8:00 – 14:00 Uhr" },
      { label: "Fr – So", detail: "17:00 – 22:00 Uhr" },
    ],
    active: true,
  },
];

/** Nur die aktuell ausgeschriebenen Stellen. */
export const ACTIVE_JOBS = JOBS.filter((j) => j.active);

/**
 * JobPosting-Schema (schema.org) für Google Jobs & Co. Baut eine Stelle in
 * ein valides JSON-LD-Objekt um. Wird auf der Karriere-Seite eingebettet.
 */
export function jobPostingJsonLd(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: buildJobDescriptionHtml(job),
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: SITE.legalName,
      alternateName: SITE.name,
      sameAs: SITE.url,
      logo: `${SITE.url}/icon.svg`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT.street,
        postalCode: CONTACT.postalCode,
        addressLocality: CONTACT.city,
        addressRegion: CONTACT.region,
        addressCountry: "DE",
      },
    },
    directApply: true,
    url: `${SITE.url}/karriere#${job.slug}`,
    industry: "Gastronomie",
  };
}

/** Fasst eine Stelle als schlichtes HTML zusammen — für JobPosting.description. */
function buildJobDescriptionHtml(job: Job): string {
  const li = (items: string[]) =>
    `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  return [
    `<p>${job.summary}</p>`,
    `<p><strong>Deine Aufgaben:</strong></p>`,
    li(job.tasks),
    `<p><strong>Das bringst du mit:</strong></p>`,
    li(job.profile),
    `<p><strong>Das bieten wir:</strong></p>`,
    li(job.perks),
  ].join("");
}
