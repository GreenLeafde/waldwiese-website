import Link from "next/link";
import {
  avgDuration,
  ctrStats,
  cutoffMs,
  dailyByType,
  dailyPageviews,
  eventCounts,
  topCountries,
  topCtas,
  topPaths,
  topReferrers,
} from "@/lib/analytics";
import { countByStatus, recentSubscribed, sourceCounts } from "@/lib/contacts";
import { dbReachable } from "@/lib/db";
import { DbNotice } from "@/components/admin/db-notice";

const RANGES = [
  { days: 1, label: "Heute" },
  { days: 7, label: "7 Tage" },
  { days: 30, label: "30 Tage" },
  { days: 90, label: "90 Tage" },
];

const KPIS: { type: string; label: string }[] = [
  { type: "pageview", label: "Seitenaufrufe" },
  { type: "reservation_open", label: "Reservierungs-Öffnungen" },
  { type: "sommelier_complete", label: "Sommelier-Abschlüsse" },
  { type: "newsletter_signup", label: "Newsletter-Anmeldungen" },
  { type: "newsletter_confirmed", label: "Bestätigte Anmeldungen" },
  { type: "contact_submit", label: "Kontakt-Nachrichten" },
  { type: "application_submit", label: "Bewerbungen" },
];

const SOURCE_LABEL: Record<string, string> = {
  sommelier: "Sommelier-Formular",
  admin: "Manuell angelegt",
  import: "Import",
  unbekannt: "Unbekannt",
};

const COUNTRY_NAME: Record<string, string> = {
  DE: "Deutschland",
  AT: "Österreich",
  CH: "Schweiz",
  US: "USA",
  GB: "Großbritannien",
  FR: "Frankreich",
  IT: "Italien",
  NL: "Niederlande",
};

function fmtDuration(s: number): string {
  if (s <= 0) return "—";
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const days = RANGES.some((r) => String(r.days) === range) ? Number(range) : 7;
  const sinceMs = cutoffMs(days);

  if (!(await dbReachable())) {
    return (
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">
          Auswertungen
        </h1>
        <div className="mt-6">
          <DbNotice />
        </div>
      </div>
    );
  }

  const [
    counts,
    daily,
    paths,
    ctas,
    ctr,
    refs,
    countries,
    dur,
    confirmsDaily,
    statusCounts,
    sources,
    recent,
  ] = await Promise.all([
    eventCounts(sinceMs),
    dailyPageviews(sinceMs),
    topPaths(sinceMs, 10),
    topCtas(sinceMs, 8),
    ctrStats(sinceMs),
    topReferrers(sinceMs, 8),
    topCountries(sinceMs, 8),
    avgDuration(sinceMs),
    dailyByType(sinceMs, "newsletter_confirmed"),
    countByStatus(),
    sourceCounts(),
    recentSubscribed(8),
  ]);

  const maxDaily = Math.max(1, ...daily.map((d) => d.count));
  const maxConf = Math.max(1, ...confirmsDaily.map((d) => d.count));
  const signups = counts.newsletter_signup ?? 0;
  const confirmed = counts.newsletter_confirmed ?? 0;
  const confirmRate = signups > 0 ? Math.round((confirmed / signups) * 100) : 0;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-normal text-waldgruen">
            Auswertungen
          </h1>
          <p className="mt-2 text-waldgruen/55 text-sm max-w-2xl">
            Anonym &amp; cookielos erfasst — nur mit Statistik-Einwilligung,
            ohne IP-Speicherung. Anmeldungen &amp; Nachrichten werden immer
            gezählt. Länder grob (nur Ländercode), Verweildauer aggregiert.
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

      {/* Verhalten: CTR + Verweildauer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric value={`${ctr.ctr} %`} label="Klickrate (CTA / Aufruf)" />
        <Metric value={String(ctr.ctaClicks)} label="Button-Klicks gesamt" />
        <Metric value={fmtDuration(dur)} label="Ø Verweildauer / Seite" />
        <Metric value={String(statusCounts.subscribed)} label="Angemeldet (Liste)" />
      </div>

      {/* NEWSLETTER */}
      <section>
        <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
          Newsletter-Anmeldungen
        </h2>
        <div className="mt-4 grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-6">
            <div className="flex flex-wrap gap-6">
              <Inline value={signups} label="Anmeldungen (Zeitraum)" />
              <Inline value={confirmed} label="bestätigt" />
              <Inline value={`${confirmRate} %`} label="Bestätigungsrate" />
            </div>
            <div className="mt-5">
              <p className="text-xs text-waldgruen/40 mb-2">
                Bestätigte Anmeldungen pro Tag
              </p>
              {confirmsDaily.length === 0 ? (
                <p className="text-sm text-waldgruen/40 py-6 text-center">
                  Noch keine Bestätigungen im Zeitraum.
                </p>
              ) : (
                <div className="flex items-end gap-1.5 h-28">
                  {confirmsDaily.map((d) => (
                    <div
                      key={d.day}
                      className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
                      title={`${d.day}: ${d.count}`}
                    >
                      <div
                        className="w-full rounded-t bg-waldgruen/70"
                        style={{ height: `${(d.count / maxConf) * 100}%` }}
                      />
                      <span className="text-[0.6rem] text-waldgruen/40 truncate w-full text-center">
                        {d.day.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-waldgruen/40 mb-2">Quelle der Anmeldungen</p>
              <RankList
                rows={sources.map((s) => ({
                  label: SOURCE_LABEL[s.source] ?? s.source,
                  count: s.count,
                }))}
                empty="Noch keine Anmeldungen."
              />
            </div>
          </div>
        </div>

        {/* Neueste Anmeldungen */}
        <div className="mt-6">
          <p className="text-xs text-waldgruen/40 mb-2">Neueste Anmeldungen</p>
          <div className="rounded-2xl bg-white ring-1 ring-waldgruen/10 overflow-hidden">
            {recent.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-waldgruen/40">
                Noch keine Anmeldungen.
              </p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {recent.map((c) => (
                    <tr
                      key={c.email}
                      className="border-b border-waldgruen/5 last:border-0"
                    >
                      <td className="px-4 py-3 text-waldgruen break-all">{c.email}</td>
                      <td className="px-4 py-3 text-waldgruen/60">{c.name ?? "—"}</td>
                      <td className="px-4 py-3 text-waldgruen/45 text-xs">
                        {SOURCE_LABEL[c.source ?? "unbekannt"] ?? c.source}
                      </td>
                      <td className="px-4 py-3 text-right text-waldgruen/45 text-xs whitespace-nowrap">
                        {c.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

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
        <section>
          <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
            Top-Seiten
          </h2>
          <RankList
            rows={paths.map((p) => ({ label: p.path, count: p.count }))}
            empty="Noch keine Seitenaufrufe."
          />
        </section>

        <section>
          <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
            Button-Klicks (CTAs)
          </h2>
          <RankList
            rows={ctas.map((c) => ({ label: c.label, count: c.count }))}
            empty="Noch keine CTA-Klicks erfasst."
          />
        </section>

        <section>
          <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
            Woher die Besucher kamen
          </h2>
          <RankList
            rows={refs.map((r) => ({ label: r.referrer, count: r.count }))}
            empty="Noch keine Referrer erfasst."
          />
        </section>

        <section>
          <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
            Länder (grob)
          </h2>
          <RankList
            rows={countries.map((c) => ({
              label: COUNTRY_NAME[c.country] ?? c.country,
              count: c.count,
            }))}
            empty="Noch keine Länderdaten."
          />
        </section>
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-5">
      <p className="font-display text-3xl text-waldgruen">{value}</p>
      <p className="mt-1 text-sm text-waldgruen/50">{label}</p>
    </div>
  );
}

function Inline({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl text-waldgruen leading-none">{value}</p>
      <p className="mt-1 text-xs text-waldgruen/45">{label}</p>
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
