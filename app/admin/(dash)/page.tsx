import Link from "next/link";
import { countByStatus } from "@/lib/contacts";
import { cutoffMs, eventCounts } from "@/lib/analytics";
import { dbReachable } from "@/lib/db";
import { DbNotice } from "@/components/admin/db-notice";

export default async function AdminHome() {
  if (!(await dbReachable())) {
    return (
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">
          Übersicht
        </h1>
        <div className="mt-6">
          <DbNotice />
        </div>
      </div>
    );
  }

  const [counts, events] = await Promise.all([
    countByStatus(),
    eventCounts(cutoffMs(7)),
  ]);

  const activity = [
    { label: "Seitenaufrufe", value: events.pageview ?? 0 },
    { label: "Reservierungs-Öffnungen", value: events.reservation_open ?? 0 },
    { label: "Sommelier-Abschlüsse", value: events.sommelier_complete ?? 0 },
    { label: "Newsletter-Anmeldungen", value: events.newsletter_signup ?? 0 },
  ];

  const stats = [
    { label: "Angemeldet", value: counts.subscribed, tone: "text-waldgruen" },
    { label: "Ausstehend", value: counts.pending, tone: "text-tonwarm" },
    { label: "Abgemeldet", value: counts.unsubscribed, tone: "text-stone-400" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-normal text-waldgruen">
        Übersicht
      </h1>
      <p className="mt-2 text-waldgruen/55">
        Willkommen im Backend. Hier verwaltest du die Newsletter-Liste und
        siehst, was auf der Website passiert.
      </p>

      <section className="mt-8">
        <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
          Newsletter-Liste
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-4 max-w-2xl">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-6"
            >
              <p className={`font-display text-4xl ${s.tone}`}>{s.value}</p>
              <p className="mt-1 text-sm text-waldgruen/50">{s.label}</p>
            </div>
          ))}
        </div>
        <Link
          href="/admin/newsletter"
          className="mt-5 inline-flex items-center gap-2 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
        >
          Kontakte verwalten &amp; Newsletter senden →
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
          Letzte 7 Tage
        </h2>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
          {activity.map((a) => (
            <div
              key={a.label}
              className="rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-5"
            >
              <p className="font-display text-3xl text-waldgruen">{a.value}</p>
              <p className="mt-1 text-xs text-waldgruen/50 leading-snug">
                {a.label}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/admin/analytics"
          className="mt-5 inline-flex items-center gap-2 text-waldgruen font-medium border-b border-waldgruen/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
        >
          Alle Auswertungen ansehen →
        </Link>
      </section>
    </div>
  );
}
