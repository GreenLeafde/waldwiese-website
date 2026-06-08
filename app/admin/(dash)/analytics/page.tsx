import Link from "next/link";
import {
  cutoffMs,
  dailyPageviews,
  eventCounts,
  topCtas,
  topPaths,
} from "@/lib/analytics";

const RANGES = [
  { days: 1, label: "Heute" },
  { days: 7, label: "7 Tage" },
  { days: 30, label: "30 Tage" },
];

const KPIS: { type: string; label: string }[] = [
  { type: "pageview", label: "Seitenaufrufe" },
  { type: "reservation_open", label: "Reservierungs-Öffnungen" },
  { type: "sommelier_complete", label: "Sommelier-Abschlüsse" },
  { type: "newsletter_signup", label: "Newsletter-Anmeldungen" },
  { type: "newsletter_confirmed", label: "Bestätigte Anmeldungen" },
  { type: "contact_submit", label: "Kontakt-Nachrichten" },
];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const days = RANGES.some((r) => String(r.days) === range) ? Number(range) : 7;
  const sinceMs = cutoffMs(days);

  const [counts, daily, paths, ctas] = await Promise.all([
    eventCounts(sinceMs),
    dailyPageviews(sinceMs),
    topPaths(sinceMs, 10),
    topCtas(sinceMs, 8),
  ]);

  const maxDaily = Math.max(1, ...daily.map((d) => d.count));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-normal text-waldgruen">
            Auswertungen
          </h1>
          <p className="mt-2 text-waldgruen/55 text-sm">
            Anonym &amp; cookielos erfasst — nur mit Statistik-Einwilligung der
            Besucher. Anmeldungen &amp; Nachrichten werden immer gezählt.
          </p>
        </div>
        <div className="flex gap-1.5">
          {RANGES.map((r) => {
            const active = r.days === days;
            return (
              <Link
                key={r.days}
                href={`/admin/analytics?range=${r.days}`}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-waldgruen text-mehlcreme"
                    : "bg-white text-waldgruen/70 ring-1 ring-waldgruen/10 hover:text-tonwarm"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI-Karten */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {KPIS.map((k) => (
          <div
            key={k.type}
            className="rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-5"
          >
            <p className="font-display text-4xl text-waldgruen">
              {counts[k.type] ?? 0}
            </p>
            <p className="mt-1 text-sm text-waldgruen/50">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Aufrufe pro Tag */}
      <section>
        <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
          Seitenaufrufe pro Tag
        </h2>
        <div className="mt-4 rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-6">
          {daily.length === 0 ? (
            <p className="text-sm text-waldgruen/40 py-8 text-center">
              Noch keine Aufrufe im Zeitraum.
            </p>
          ) : (
            <div className="flex items-end gap-1.5 h-40">
              {daily.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
                  title={`${d.day}: ${d.count}`}
                >
                  <div
                    className="w-full rounded-t bg-tonwarm/80"
                    style={{ height: `${(d.count / maxDaily) * 100}%` }}
                  />
                  <span className="text-[0.6rem] text-waldgruen/40 truncate w-full text-center">
                    {d.day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top-Seiten */}
        <section>
          <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
            Top-Seiten
          </h2>
          <RankList
            rows={paths.map((p) => ({ label: p.path, count: p.count }))}
            empty="Noch keine Seitenaufrufe."
          />
        </section>

        {/* Top-CTAs */}
        <section>
          <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
            Button-Klicks (CTAs)
          </h2>
          <RankList
            rows={ctas.map((c) => ({ label: c.label, count: c.count }))}
            empty="Noch keine CTA-Klicks erfasst."
          />
        </section>
      </div>
    </div>
  );
}

function RankList({
  rows,
  empty,
}: {
  rows: { label: string; count: number }[];
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="mt-4 rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-8 text-center text-sm text-waldgruen/40">
        {empty}
      </div>
    );
  }
  return (
    <ul className="mt-4 rounded-2xl bg-white ring-1 ring-waldgruen/10 divide-y divide-waldgruen/5 overflow-hidden">
      {rows.map((r) => (
        <li
          key={r.label}
          className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
        >
          <span className="text-waldgruen/80 truncate">{r.label}</span>
          <span className="font-display text-waldgruen shrink-0">{r.count}</span>
        </li>
      ))}
    </ul>
  );
}
