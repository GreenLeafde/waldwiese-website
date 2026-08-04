/**
 * Zeit-Rechnung fuer den Team-Bereich.
 *
 * Bewusst dieselbe Mathematik wie im Hotel-Backend (dort src/lib/work-time.ts):
 * gleiche Rundung, gleiche Tages-Zuordnung, gleiche Anzeige. Sonst zeigt das
 * Restaurant andere Stunden an als die Abrechnung im Backend.
 *
 * Regeln (aus dem Original uebernommen):
 *   • Eine offene Sitzung laeuft bis "jetzt".
 *   • Eine Sitzung zaehlt komplett auf den Tag ihres Beginns (auch ueber
 *     Mitternacht).
 *   • Pause = Luecke zwischen zwei Sitzungen desselben Tages.
 *   • Anwesenheit = letztes Ende minus erster Beginn.
 */

export const BERLIN_TZ = "Europe/Berlin";

export type SessionLike = {
  started_at: string;
  ended_at: string | null;
  user_name?: string | null;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Dauer einer Sitzung in ms (offen -> bis now), nie negativ. */
export function sessionMs(s: SessionLike, now: Date): number {
  const start = new Date(s.started_at).getTime();
  const end = s.ended_at ? new Date(s.ended_at).getTime() : now.getTime();
  return Math.max(0, end - start);
}

/** Summe mehrerer Sitzungen in ms. */
export function sumMs(sessions: SessionLike[], now: Date): number {
  return sessions.reduce((acc, s) => acc + sessionMs(s, now), 0);
}

/** "H:MM" (Minuten gerundet, nie negativ). */
export function fmtHM(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalMin = Math.round(ms / 60000);
  return `${Math.floor(totalMin / 60)}:${pad(totalMin % 60)}`;
}

/** "H:MM h" — Anzeigeform wie im Backend. */
export function fmtDuration(ms: number): string {
  return `${fmtHM(ms)} h`;
}

/** "HH:MM" in Europe/Berlin. */
export function fmtTime(t: string | number | Date | null | undefined): string {
  if (t === null || t === undefined || t === "") return "–";
  const d = t instanceof Date ? t : new Date(t);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: BERLIN_TZ });
}

/** Kalendertag YYYY-MM-DD in Europe/Berlin. */
export function berlinDay(t: string | number | Date): string {
  const d = t instanceof Date ? t : new Date(t);
  return d.toLocaleDateString("en-CA", {
    timeZone: BERLIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** "Mo, 04.08." fuer Tages-Ueberschriften. */
export function fmtDayLabel(dayIso: string): string {
  const [y, m, d] = dayIso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export type WorkDay = {
  dayIso: string;
  /** "HH:MM" des ersten Beginns. */
  from: string;
  /** "HH:MM" des letzten Endes, leer solange der Tag laeuft. */
  to: string;
  open: boolean;
  workMs: number;
  pauseMs: number;
  segments: { from: string; to: string; open: boolean }[];
};

/** Sitzungen zu Arbeitstagen zusammenfassen, neueste zuerst. */
export function buildDays(sessions: SessionLike[], now: Date): WorkDay[] {
  const byDay = new Map<string, SessionLike[]>();
  for (const s of sessions) {
    if (!s.started_at) continue;
    const key = berlinDay(s.started_at);
    const list = byDay.get(key);
    if (list) list.push(s);
    else byDay.set(key, [s]);
  }

  const days: WorkDay[] = [];
  for (const [dayIso, arr] of byDay) {
    const sorted = arr
      .slice()
      .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());

    let workMs = 0;
    let open = false;
    const segments: WorkDay["segments"] = [];

    for (const s of sorted) {
      workMs += sessionMs(s, now);
      if (!s.ended_at) open = true;
      segments.push({
        from: fmtTime(s.started_at),
        to: s.ended_at ? fmtTime(s.ended_at) : "läuft",
        open: !s.ended_at,
      });
    }

    const firstStart = new Date(sorted[0].started_at).getTime();
    const last = sorted[sorted.length - 1];
    const lastEnd = last.ended_at ? new Date(last.ended_at).getTime() : now.getTime();
    const presenceMs = Math.max(0, lastEnd - firstStart);

    days.push({
      dayIso,
      from: fmtTime(firstStart),
      to: open ? "" : fmtTime(lastEnd),
      open,
      workMs,
      pauseMs: Math.max(0, presenceMs - workMs),
      segments,
    });
  }

  return days.sort((a, b) => (a.dayIso < b.dayIso ? 1 : -1));
}

// ─── Wochen (fuer die Verfuegbarkeit) ─────────────────────────────────────

/** YYYY-MM-DD eines lokalen Datums. */
export function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Montag der Woche, in der das Datum liegt. */
export function mondayOf(d: Date): string {
  const day = (d.getDay() + 6) % 7; // Mo=0 … So=6
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  return toIsoDate(monday);
}

/** Montag der Woche N Wochen nach weekStart (N darf negativ sein). */
export function shiftWeek(weekStart: string, weeks: number): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  return toIsoDate(new Date(y, (m || 1) - 1, (d || 1) + weeks * 7));
}

/** Die sieben Tage einer Woche als YYYY-MM-DD, Montag zuerst. */
export function weekDays(weekStart: string): string[] {
  const [y, m, d] = weekStart.split("-").map(Number);
  return Array.from({ length: 7 }, (_, i) => toIsoDate(new Date(y, (m || 1) - 1, (d || 1) + i)));
}

/** "10.08. – 16.08.2026" */
export function fmtWeekRange(weekStart: string): string {
  const days = weekDays(weekStart);
  const first = days[0].split("-");
  const last = days[6].split("-");
  return `${first[2]}.${first[1]}. – ${last[2]}.${last[1]}.${last[0]}`;
}

/** "Montag, 10.08." */
export function fmtWeekdayLong(dayIso: string): string {
  const [y, m, d] = dayIso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

/** Monatsgrenzen [1., 1. des Folgemonats) als ISO-Strings. */
export function monthBounds(ref: Date): { from: string; to: string; label: string } {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const from = new Date(y, m, 1);
  const to = new Date(y, m + 1, 1);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    label: from.toLocaleDateString("de-DE", { month: "long", year: "numeric" }),
  };
}
