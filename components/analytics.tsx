"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readConsent } from "@/lib/consent";
import type { EventType } from "@/lib/analytics";

/**
 * Sendet ein anonymes Event — aber nur, wenn die Statistik-Einwilligung
 * vorliegt. Cookielos, ohne personenbezogene Daten.
 */
export function track(
  type: EventType,
  data?: { path?: string; label?: string },
): void {
  if (typeof window === "undefined") return;
  try {
    const consent = readConsent();
    if (!consent?.statistics) return;

    const payload = JSON.stringify({
      type,
      path: data?.path ?? window.location.pathname,
      label: data?.label,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" }),
      );
    } else {
      void fetch("/api/track", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  } catch {
    /* Tracking darf nie die Seite stören */
  }
}

/** Automatisches Seitenaufruf-Tracking bei jedem Routenwechsel. */
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    // Das eigene Backend nicht mitzählen.
    if (pathname.startsWith("/admin")) return;
    track("pageview", { path: pathname });
  }, [pathname]);
  return null;
}
