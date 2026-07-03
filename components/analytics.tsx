"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readConsent } from "@/lib/consent";
import { hasReservationConversion, TRACKING } from "@/lib/tracking";
import type { EventType } from "@/lib/analytics";

/**
 * Feuert einen Google-Ads-Conversion für "Reservierung gestartet".
 * Consent Mode "Advanced": Der Event darf immer gesendet werden — bei fehlender
 * Marketing-Einwilligung sorgt der Consent Mode (ad_storage=denied) dafür, dass
 * der Ping cookielos/anonym ist und nur zur Modellierung dient. Gültige
 * Conversion-Kennung + geladenes gtag sind Voraussetzung.
 */
export function trackReservationConversion(): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!hasReservationConversion()) return;
  window.gtag("event", "conversion", {
    send_to: TRACKING.reservationConversion,
    value: 1.0,
    currency: "EUR",
  });
}

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
