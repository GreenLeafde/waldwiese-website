"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readConsent } from "@/lib/consent";
import { hasReservationConversion, TRACKING } from "@/lib/tracking";
import type { EventType } from "@/lib/analytics";

/**
 * Feuert einen Google-Ads-Conversion für "Reservierung gestartet" — aber nur
 * mit Marketing-Einwilligung, geladenem gtag UND gültiger Conversion-Kennung.
 * Bewusst kein pauschaler Seitenaufruf-Conversion, sondern eine echte Aktion.
 */
export function trackReservationConversion(): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!hasReservationConversion()) return;
  const consent = readConsent();
  if (!consent?.marketing) return;
  window.gtag("event", "conversion", {
    send_to: TRACKING.reservationConversion,
    value: 1.0,
    currency: "EUR",
  });
}

/**
 * Sendet ein anonymes Event — aber nur mit Statistik-Einwilligung.
 * Cookielos, ohne personenbezogene Daten (keine IP, kein Fingerprint).
 */
export function track(
  type: EventType,
  data?: { path?: string; label?: string; referrer?: string; duration?: number },
): void {
  if (typeof window === "undefined") return;
  try {
    const consent = readConsent();
    if (!consent?.statistics) return;

    const payload = JSON.stringify({
      type,
      path: data?.path ?? window.location.pathname,
      label: data?.label,
      referrer: data?.referrer,
      duration: data?.duration,
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

// Externe Quell-Domain nur einmal pro Seitenladevorgang melden.
let referrerSent = false;

/** Seitenaufruf-Tracking + Verweildauer (anonym) bei jedem Routenwechsel. */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Das eigene Backend nicht mitzählen.
    if (pathname.startsWith("/admin")) return;

    let referrer: string | undefined;
    if (!referrerSent) {
      referrerSent = true;
      try {
        const ref = document.referrer ? new URL(document.referrer).hostname : "";
        if (ref && ref !== window.location.hostname) referrer = ref;
      } catch {
        /* ignore */
      }
    }
    track("pageview", { path: pathname, referrer });

    const start = Date.now();
    let sent = false;
    const sendTime = () => {
      if (sent) return;
      sent = true;
      const dur = Math.round((Date.now() - start) / 1000);
      if (dur > 0 && dur < 86400) {
        track("page_time", { path: pathname, duration: dur });
      }
    };
    window.addEventListener("pagehide", sendTime);

    return () => {
      window.removeEventListener("pagehide", sendTime);
      sendTime();
    };
  }, [pathname]);

  return null;
}
