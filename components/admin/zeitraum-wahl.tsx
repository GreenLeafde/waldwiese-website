"use client";

import { useRouter } from "next/navigation";

/**
 * Tag oder Monat waehlen. Monat ist die Voreinstellung — fuer die
 * Lohnabrechnung zaehlt der Monat, der Tag ist der Ausnahmefall.
 */
export function ZeitraumWahl({ art, wert }: { art: "tag" | "monat"; wert: string }) {
  const router = useRouter();

  function gehe(neueArt: "tag" | "monat", neuerWert: string) {
    router.push(`/admin/zeiten?art=${neueArt}&wert=${neuerWert}`);
  }

  /** Beim Umschalten den Zeitraum sinnvoll mitnehmen statt zurückzuspringen. */
  function wechsle(neueArt: "tag" | "monat") {
    if (neueArt === art) return;
    if (neueArt === "monat") gehe("monat", wert.slice(0, 7));
    else gehe("tag", `${wert}-01`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex gap-1 rounded-full bg-waldgruen/8 p-1">
        {(["monat", "tag"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => wechsle(a)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              art === a
                ? "bg-waldgruen font-medium text-mehlcreme"
                : "text-waldgruen/60 hover:text-waldgruen"
            }`}
          >
            {a === "monat" ? "Monat" : "Tag"}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="zeitraum"
          className="block text-xs uppercase tracking-[0.12em] text-waldgruen/45"
        >
          {art === "monat" ? "Monat" : "Datum"}
        </label>
        <input
          id="zeitraum"
          type={art === "monat" ? "month" : "date"}
          value={wert}
          onChange={(e) => e.target.value && gehe(art, e.target.value)}
          className="rounded-xl border border-waldgruen/15 bg-white px-3.5 py-2 text-sm text-waldgruen outline-none focus:border-tonwarm"
        />
      </div>
    </div>
  );
}
