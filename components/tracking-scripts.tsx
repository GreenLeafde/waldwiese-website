"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";
import { hasAds, hasGa, hasGtm, hasHotjar, TRACKING } from "@/lib/tracking";

/**
 * Google Consent Mode "Advanced": Die Google-Tags (GA4, Ads, ggf. GTM) laden
 * IMMER, sobald eine gültige ID hinterlegt ist — UNABHÄNGIG von der Einwilligung.
 * Sie starten dank CONSENT_DEFAULT_SCRIPT (Layout) im Zustand "denied": cookielos,
 * ohne personenbezogene Daten, nur anonyme Pings zur Conversion-Modellierung.
 * Erst consentModeUpdate() (bei Zustimmung) kippt sie auf "granted" → dann erst
 * Cookies + personenbezogene Erfassung.
 *
 * - GA4 / Google Ads: laden immer (nur wenn KEIN GTM-Container gesetzt ist,
 *   sonst liefe GA4/Ads dort → Doppelzählung).
 * - GTM: lädt immer (Consent Mode wird im Container konfiguriert).
 * - Hotjar: KENNT keinen Consent Mode → weiterhin nur bei Statistik-Einwilligung.
 *
 * gtag.js wird nur EINMAL geladen; die Produkte danach per gtag('config', …).
 */
export function TrackingScripts() {
  const { ready, consent } = useConsent();
  if (!ready) return null;

  const loadGa = hasGa() && !hasGtm();
  const loadAds = hasAds() && !hasGtm();
  const loadGtm = hasGtm();
  const loadHotjar = hasHotjar() && consent.statistics;

  const gtagBootId = loadGa ? TRACKING.gaId : loadAds ? TRACKING.adsId : "";

  return (
    <>
      {gtagBootId && (
        <Script
          id="gtag-loader"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtagBootId}`}
        />
      )}
      {loadGa && (
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `gtag('js', new Date());gtag('config', '${TRACKING.gaId}');`,
          }}
        />
      )}
      {loadAds && (
        <Script
          id="google-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            // Nur den Ads-Tag laden/konfigurieren (ermöglicht Remarketing).
            // Ein Conversion wird bewusst NICHT pauschal pro Seitenaufruf
            // gefeuert — er soll gezielt bei einer echten Aktion (z. B.
            // abgeschlossene Reservierung) ausgelöst werden, sobald dafür ein
            // zuverlässiges Signal existiert.
            __html: `gtag('js', new Date());gtag('config', '${TRACKING.adsId}');`,
          }}
        />
      )}
      {loadGtm && (
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TRACKING.gtmId}');`,
          }}
        />
      )}
      {loadHotjar && (
        <Script
          id="hotjar-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${TRACKING.hotjarId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        />
      )}
    </>
  );
}
