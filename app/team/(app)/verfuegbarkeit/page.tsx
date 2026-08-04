import Link from "next/link";
import { requireStaff } from "@/lib/staff-auth";
import { getAvailability, staffConfigured } from "@/lib/staff-db";
import { fmtWeekRange, fmtWeekdayLong, mondayOf, shiftWeek, weekDays } from "@/lib/work-time";
import { AvailabilityForm, type DayValue } from "@/components/team/availability-form";

export const dynamic = "force-dynamic";

export default async function VerfuegbarkeitPage({
  searchParams,
}: {
  searchParams: Promise<{ woche?: string }>;
}) {
  const staff = await requireStaff();
  const params = await searchParams;

  const heuteMontag = mondayOf(new Date());
  const gewaehlt = /^\d{4}-\d{2}-\d{2}$/.test(params.woche ?? "")
    ? (params.woche as string)
    : heuteMontag;
  // Auf Montag normalisieren, damit ein manipulierter Link keine krumme Woche erzeugt.
  const [y, m, d] = gewaehlt.split("-").map(Number);
  const weekStart = mondayOf(new Date(y, (m || 1) - 1, d || 1));

  if (!staffConfigured()) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl text-waldgruen">Noch nicht verbunden</h1>
        <p className="mt-3 text-sm text-waldgruen/70">
          Der Team-Bereich greift auf die bestehende Planung zu. Dafür fehlen noch die
          Zugangsdaten (<code>NATURLICH_API_URL</code> und <code>NATURLICH_PARTNER_KEY</code>).
        </p>
      </div>
    );
  }

  const tage = weekDays(weekStart);
  let wishes: Awaited<ReturnType<typeof getAvailability>>["wishes"] = [];
  let targets: Awaited<ReturnType<typeof getAvailability>>["targets"] = [];
  let loadError = "";
  try {
    ({ wishes, targets } = await getAvailability(tage[0], tage[6], staff.id));
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Angaben konnten nicht geladen werden.";
  }

  const proTag = new Map(wishes.map((w) => [w.date.slice(0, 10), w]));
  const days: DayValue[] = tage.map((date) => {
    const w = proTag.get(date);
    return {
      date,
      label: fmtWeekdayLong(date),
      wishType: w?.wish_type ?? "",
      fromTime: w?.from_time ?? "",
      toTime: w?.to_time ?? "",
    };
  });

  const target = targets.find((t) => t.week_start.slice(0, 10) === weekStart);
  const hours = target?.hours != null ? String(target.hours) : "";

  const zurueck = shiftWeek(weekStart, -1);
  const vor = shiftWeek(weekStart, 1);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow no-line text-tonwarm">Verfügbarkeit</p>
        <h1 className="mt-2 font-display text-3xl font-normal text-waldgruen">
          Wann kannst du?
        </h1>
        <p className="mt-2 text-sm text-waldgruen/60">
          Trag ein, wann du in dieser Woche arbeiten kannst. Die Planung sieht deine Angaben
          sofort – du musst nichts abgeben.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <Link
          href={`/team/verfuegbarkeit?woche=${zurueck}`}
          className="rounded-full border border-waldgruen/20 px-3 py-1.5 text-sm text-waldgruen/70 transition-colors hover:border-tonwarm hover:text-tonwarm"
        >
          Woche zurück
        </Link>
        <div className="text-center">
          <p className="text-waldgruen">{fmtWeekRange(weekStart)}</p>
          {weekStart === heuteMontag && (
            <p className="text-xs text-waldgruen/50">diese Woche</p>
          )}
        </div>
        <Link
          href={`/team/verfuegbarkeit?woche=${vor}`}
          className="rounded-full border border-waldgruen/20 px-3 py-1.5 text-sm text-waldgruen/70 transition-colors hover:border-tonwarm hover:text-tonwarm"
        >
          Woche vor
        </Link>
      </div>

      {loadError && (
        <p role="alert" className="rounded-xl bg-white p-4 text-sm text-tonwarm-dark shadow-sm">
          {loadError}
        </p>
      )}

      <AvailabilityForm key={weekStart} weekStart={weekStart} days={days} hours={hours} />
    </div>
  );
}
