"use client";

import { usePathname } from "next/navigation";

/**
 * Blendet die öffentliche Seiten-Chrome (Header, Footer, Sommelier-Button) im
 * Backend aus. Auf /admin-Seiten soll nur die Admin-Oberfläche zu sehen sein.
 * Rendert ohne zusätzliches Wrapper-Element (Fragment), beeinflusst also kein
 * Layout/Positioning der öffentlichen Seiten.
 */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
