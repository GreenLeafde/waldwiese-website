"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReserveButton } from "./reserve-chooser";

/** Seiten mit eigener Kaufleiste (Gutschein kaufen, Tickets) — dort nicht doppelt. */
const OWN_BAR = ["/gutscheine", "/veranstaltungen/"];

/**
 * Feste Leiste am unteren Rand, nur auf dem Handy: links Reservieren
 * (öffnet die Vorauswahl), rechts Gutschein. Auf jeder öffentlichen Seite,
 * damit der Kaufknopf immer eine Daumenbreite entfernt bleibt.
 */
export function SiteStickyBar() {
  const pathname = usePathname() ?? "";
  if (OWN_BAR.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      <div aria-hidden className="h-[72px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.5fr_1fr] gap-2 border-t border-creme/10 bg-nacht px-3 py-2.5 text-creme md:hidden">
        <ReserveButton
          location="kaufleiste"
          className="inline-flex h-12 items-center justify-center rounded-full bg-akzent px-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-akzent-hover"
        >
          Reservieren
        </ReserveButton>
        <Link
          href="/gutscheine"
          className="inline-flex h-12 items-center justify-center rounded-full px-3 text-[0.95rem] font-semibold shadow-[inset_0_0_0_1.5px_currentColor]"
        >
          Gutschein
        </Link>
      </div>
    </>
  );
}
