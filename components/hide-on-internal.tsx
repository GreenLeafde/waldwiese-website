"use client";

import { usePathname } from "next/navigation";

/** Bereiche, die nur fuer Mitarbeiter sind und ihre eigene Kopfzeile haben. */
const INTERN = ["/admin", "/team", "/schicht"];

/**
 * Blendet die öffentliche Seiten-Chrome (Header, Footer, Sommelier-Button,
 * Cookie-Banner) in den internen Bereichen aus. Dort soll nur die jeweilige
 * Arbeitsoberfläche zu sehen sein — sonst stehen zwei Kopfzeilen übereinander
 * und das Team tippt am Tablet versehentlich auf „Reservieren".
 *
 * Rendert ohne zusätzliches Wrapper-Element (Fragment), beeinflusst also kein
 * Layout/Positioning der öffentlichen Seiten.
 */
export function HideOnInternal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (INTERN.some((p) => pathname?.startsWith(p))) return null;
  return <>{children}</>;
}
