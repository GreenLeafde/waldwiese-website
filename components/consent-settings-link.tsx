"use client";

import { useConsent } from "./consent-provider";

/**
 * Footer-Link zum erneuten Öffnen der Cookie-Einstellungen.
 * Pflicht: Einwilligung muss jederzeit widerrufbar/änderbar sein.
 */
export function ConsentSettingsLink({ className }: { className?: string }) {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
