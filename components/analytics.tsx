"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readConsent } from "@/lib/consent";
import { hasReservationConversion, TRACKING } from "@/lib/tracking";
import type { EventType } from "@/lib/analytics";
import { RESERVATION_URL } from "@/lib/site";

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
 * Klick auf einen "Reservieren"-Link zu Lightspeed. Die Buchung selbst läuft
 * dort ohne Rückmeldung an uns — der Klick ist das letzte messbare Signal.
 * GA4-Event + Ads-Conversion (wie trackReservationConversion: Consent Mode
 * regelt, ob cookielos oder mit Cookies) + anonym ins eigene Dashboard.
 */
export function trackReservationClick(location: string): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "reservation_click", { link_location: location });
  }
  trackReservationConversion();
  track("reservation_open", { label: `link:${location}` });
}

/** Ort eines Links grob einordnen (Header/Footer/Seite) für die Auswertung. */
function linkLocation(link: HTMLAnchorElement): string {
  const area = link.closest("header")
    ? "header"
    : link.closest("footer")
      ? "footer"
      : "seite";
  return `${area}:${window.location.pathname}`;
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

  // Alle Links zur Lightspeed-Reservierung (Header, Mobil-Menü, Seiten-CTAs)
  // zentral per Event-Delegation erfassen — statt an jedem Button einzeln.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || !link.href.startsWith(RESERVATION_URL)) return;
      trackReservationClick(linkLocation(link));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
