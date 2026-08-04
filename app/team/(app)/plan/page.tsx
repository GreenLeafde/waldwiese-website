import Link from "next/link";
import { istLeitung, requireStaff } from "@/lib/staff-auth";
import {
  bereichLabel,
  getAvailability,
  getShifts,
  listStaff,
  staffConfigured,
} from "@/lib/staff-db";
import { fmtWeekdayLong, mondayOf, toIsoDate, weekDays } from "@/lib/work-time";
import { ShiftPlanner, type PlanPerson } from "@/components/team/shift-planner";

export const dynamic = "force-dynamic";

/** Angabe der Person in einem Satz, den man beim Planen lesen kann. */
function verfuegbarkeitsText(w: {
  wish_type: string;
  from_time: string | null;
  to_time: string | null;
} | undefined): { text: string; kannNicht: boolean } {
  if (!w) return { text: "keine Angabe", kannNicht: false };
  switch (w.wish_type) {
    case "flexibel":
      return { text: "ganztägig flexibel", kannNicht: false };
    case "nicht_moeglich":
    case "nicht_verfuegbar":
      return { text: "kann nicht", kannNicht: true };
    case "nur_ab":
      return { text: `erst ab ${w.from_time ?? "?"}`, kannNicht: false };
    case "nur_bis":
      return { text: `nur bis ${w.to_time ?? "?"}`, kannNicht: false };
    case "nur_von_bis":
      return { text: `nur ${w.from_time ?? "?"}–${w.to_time ?? "?"}`, kannNicht: false };
    default:
      return { text: w.wish_type, kannNicht: false };
  }
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const staff = await requireStaff();
  const params = await searchParams;

  if (!istLeitung(staff)) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl text-waldgruen">Nur für die Leitung</h1>
        <p className="mt-3 text-sm text-waldgruen/70">
          Deine eigenen Schichten stehen auf{" "}
          <Link href="/team" className="underline underline-offset-2 hover:text-tonwarm">
            Meine Zeit
          </Link>
          .
        </p>
      </div>
    );
  }

  if (!staffConfigured()) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="font-display text-2xl text-waldgruen">Noch nicht verbunden</h1>
        <p className="mt-3 text-sm text-waldgruen/70">
          Es fehlen die Zugangsdaten (<code>NATURLICH_API_URL</code> und{" "}
          <code>NATURLICH_PARTNER_KEY</code>).
        </p>
      </div>
    );
  }

  const tag = /^\d{4}-\d{2}-\d{2}$/.test(params.tag ?? "")
    ? (params.tag as string)
    : toIsoDate(new Date());
  const woche = weekDays(mondayOf(new Date(tag + "T12:00:00")));

  let personen: PlanPerson[] = [];
  let wochenSchichten: Awaited<ReturnType<typeof getShifts>> = [];
  let ladeFehler = "";

  try {
    const [team, { wishes }, shifts] = await Promise.all([
      listStaff(),
      getAvailability(tag, tag),
      getShifts(woche[0], woche[6]),
    ]);
    wochenSchichten = shifts;

    const wunschProPerson = new Map(wishes.map((w) => [w.user_id ?? "", w]));
    const schichtProPerson = new Map(
      shifts.filter((s) => s.date.slice(0, 10) === tag).map((s) => [s.user_id ?? "", s]),
    );

    personen = team.map((p) => {
      const v = verfuegbarkeitsText(wunschProPerson.get(p.id));
      const s = schichtProPerson.get(p.id);
      return {
        id: p.id,
        name: p.name,
        verfuegbarkeit: v.text,
        kannNicht: v.kannNicht,
        shift: s
          ? {
              id: s.id,
              type: s.shift_type,
              label: bereichLabel(s.shift_type),
              start: s.start_time ?? "",
              end: s.end_time ?? "",
            }
          : null,
      };
    });
  } catch (e) {
    ladeFehler = e instanceof Error ? e.message : "Der Plan konnte nicht geladen werden.";
  }

  const eingeteilt = personen.filter((p) => p.shift && !["frei", "urlaub", "krank"].includes(p.shift.type)).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow no-line text-tonwarm">Planung</p>
        <h1 className="mt-2 font-display text-3xl font-normal text-waldgruen">Schichtplan</h1>
      </div>

      {/* Woche: Tag wählen, mit Anzahl der eingeteilten Leute */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {woche.map((d) => {
            const anzahl = wochenSchichten.filter(
              (s) => s.date.slice(0, 10) === d && !["frei", "urlaub", "krank"].includes(s.shift_type),
            ).length;
            const aktiv = d === tag;
            return (
              <Link
                key={d}
                href={`/team/plan?tag=${d}`}
                className={`rounded-xl px-4 py-3 text-center text-sm transition-colors ${
                  aktiv
                    ? "bg-waldgruen text-mehlcreme"
                    : "bg-white text-waldgruen/70 hover:text-tonwarm"
                }`}
              >
                <span className="block">{fmtWeekdayLong(d).split(",")[0]}</span>
                <span className="block text-xs opacity-70">{d.slice(8, 10)}.{d.slice(5, 7)}.</span>
                <span className="mt-1 block text-xs opacity-70">
                  {anzahl > 0 ? `${anzahl} eingeteilt` : "–"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl text-waldgruen">{fmtWeekdayLong(tag)}</h2>
        <span className="text-sm text-waldgruen/60">{eingeteilt} eingeteilt</span>
      </div>

      {ladeFehler ? (
        <p role="alert" className="rounded-xl bg-white p-4 text-sm text-tonwarm-dark shadow-sm">
          {ladeFehler}
        </p>
      ) : (
        <ShiftPlanner tag={tag} personen={personen} />
      )}
    </div>
  );
}
