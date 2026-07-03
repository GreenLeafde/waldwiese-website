"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";
import {
  hasAds,
  hasAdsPageviewConversion,
  hasGa,
  hasGtm,
  hasHotjar,
  TRACKING,
} from "@/lib/tracking";

/**
 * Lädt die Tracking-Skripte ERST, wenn die passende Einwilligung vorliegt
 * UND eine gültige ID hinterlegt ist. Ohne ID (z. B. vor Konto-Anlage)
 * passiert nichts — die Consent-Logik läuft trotzdem.
 *
 * - GA4 (direkt per gtag.js): nur bei Statistik. Nur wenn KEIN GTM-Container
 *   gesetzt ist (läuft GA4 dort, würde es sonst doppelt zählen).
 * - Google Ads (Conversion-Tracking): nur bei Marketing. Nur ohne GTM.
 * - GTM (Container für GA4 + Google Ads): bei Statistik ODER Marketing
 * - Hotjar: nur bei Statistik
 *
 * gtag() ist bereits global definiert (CONSENT_DEFAULT_SCRIPT im Layout),
 * inkl. Consent Mode v2 Defaults (denied) — GA4/Ads respektieren das automatisch.
 * gtag.js selbst wird nur EINMAL geladen; die einzelnen Produkte werden danach
 * je nach Einwilligung per gtag('config', …) aktiviert.
 */
export function TrackingScripts() {
  const { ready, consent } = useConsent();
  if (!ready) return null;

  const loadGa = hasGa() && !hasGtm() && consent.statistics;
  const loadAds = hasAds() && !hasGtm() && consent.marketing;
  const loadGtm = hasGtm() && (consent.statistics || consent.marketing);
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
            __html: `gtag('js', new Date());gtag('config', '${TRACKING.adsId}');${
              hasAdsPageviewConversion()
                ? `gtag('event','conversion',{'send_to':'${TRACKING.adsPageviewConversion}','value':1.0,'currency':'EUR'});`
                : ""
            }`,
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
