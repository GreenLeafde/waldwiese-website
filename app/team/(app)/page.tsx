import { requireStaff } from "@/lib/staff-auth";
import {
  bereichLabel,
  getShifts,
  openSession,
  sessionsInRange,
  staffConfigured,
} from "@/lib/staff-db";
import {
  berlinDay,
  buildDays,
  fmtDayLabel,
  fmtDuration,
  fmtWeekdayLong,
  monthBounds,
  sessionMs,
  sumMs,
  toIsoDate,
} from "@/lib/work-time";
import { ClockCard } from "@/components/team/clock-card";
import { PinChange } from "@/components/team/pin-change";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const staff = await requireStaff();

  if (!staffConfigured()) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl text-waldgruen">Noch nicht verbunden</h1>
        <p className="mt-3 text-sm text-waldgruen/70">
          Der Team-Bereich greift auf die bestehende Zeiterfassung zu. Dafür fehlen noch die
          Zugangsdaten (<code>NATURLICH_API_URL</code> und{" "}
          <code>NATURLICH_PARTNER_KEY</code>).
        </p>
      </div>
    );
  }

  const now = new Date();
  const month = monthBounds(now);

  // Naechste zwei Wochen — so weit ist der Plan im Restaurant relevant.
  const heuteIso = toIsoDate(now);
  const bisIso = toIsoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14));

  let running: Awaited<ReturnType<typeof openSession>> = null;
  let sessions: Awaited<ReturnType<typeof sessionsInRange>> = [];
  let meineSchichten: Awaited<ReturnType<typeof getShifts>> = [];
  let loadError = "";
  try {
    const [r, s, alleSchichten] = await Promise.all([
      openSession(staff.id),
      sessionsInRange(month.from, month.to, staff.id),
      getShifts(heuteIso, bisIso),
    ]);
    running = r;
    sessions = s;
    meineSchichten = alleSchichten
      .filter((x) => x.user_id === staff.id)
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Zeiten konnten nicht geladen werden.";
  }

  // Heute bereits abgeschlossene Zeit — die laufende Sitzung zaehlt die
  // Stempeluhr selbst live dazu, sonst wuerde sie doppelt erscheinen.
  const today = berlinDay(now);
  const todayMs = sumMs(
    sessions.filter((s) => berlinDay(s.started_at) === today && s.ended_at),
    now,
  );

  const monthMs = sessions.reduce((acc, s) => acc + sessionMs(s, now), 0);
  const days = buildDays(sessions, now);

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow no-line text-tonwarm">Hallo {staff.name.split(" ")[0]}</p>
        <h1 className="mt-2 font-display text-3xl font-normal text-waldgruen">Meine Zeit</h1>
      </div>

      {loadError && (
        <p role="alert" className="rounded-xl bg-white p-4 text-sm text-tonwarm-dark shadow-sm">
          {loadError}
        </p>
      )}

      <ClockCard startedAt={running?.started_at ?? null} todayMs={todayMs} />

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl text-waldgruen">Nächste Schichten</h2>
        {meineSchichten.length === 0 ? (
          <p className="mt-3 text-sm text-waldgruen/60">
            Für die nächsten zwei Wochen ist noch nichts eingeteilt.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-waldgruen/10">
            {meineSchichten.map((s) => (
              <li key={s.id} className="py-3 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-waldgruen">{fmtWeekdayLong(s.date.slice(0, 10))}</p>
                  {s.notes && <p className="mt-0.5 text-xs text-waldgruen/50">{s.notes}</p>}
                </div>
                <span className="text-sm text-waldgruen">
                  {bereichLabel(s.shift_type)}
                  {s.start_time && ` · ${s.start_time}–${s.end_time}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl text-waldgruen">{month.label}</h2>
          <span className="text-sm text-waldgruen/60">
            {fmtDuration(monthMs)} gesamt
          </span>
        </div>

        {days.length === 0 ? (
          <p className="mt-4 text-sm text-waldgruen/60">
            In diesem Monat noch keine Zeiten erfasst.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-waldgruen/10">
            {days.map((d) => (
              <li key={d.dayIso} className="py-3 flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-waldgruen">{fmtDayLabel(d.dayIso)}</p>
                  <p className="mt-0.5 text-xs text-waldgruen/50">
                    {d.from} – {d.open ? "läuft" : d.to}
                    {d.pauseMs > 0 && ` · Pause ${fmtDuration(d.pauseMs)}`}
                  </p>
                </div>
                <span className="tabular-nums text-waldgruen">{fmtDuration(d.workMs)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs text-waldgruen/50">
          Stimmt etwas nicht? Melde dich bei der Betriebsleitung – Korrekturen laufen dort.
        </p>
      </section>

      <PinChange />
    </div>
  );
}
