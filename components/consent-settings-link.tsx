"use client";

import { useConsent } from "./consent-provider";
import { hasConsentTracking } from "@/lib/tracking";

/**
 * Footer-Link zum erneuten Öffnen der Cookie-Einstellungen.
 * Nur sichtbar, wenn Tracking konfiguriert ist (sonst gibt es kein Banner).
 */
export function ConsentSettingsLink({ className }: { className?: string }) {
  const { openSettings } = useConsent();
  if (!hasConsentTracking()) return null;
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
