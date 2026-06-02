"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";
import { hasGtm, hasHotjar, TRACKING } from "@/lib/tracking";

/**
 * Lädt die Tracking-Skripte ERST, wenn die passende Einwilligung vorliegt
 * UND eine gültige ID hinterlegt ist. Ohne ID (z. B. vor Konto-Anlage)
 * passiert nichts — die Consent-Logik läuft trotzdem.
 *
 * - GTM (Container für GA4 + Google Ads): bei Statistik ODER Marketing
 * - Hotjar: nur bei Statistik
 */
export function TrackingScripts() {
  const { ready, consent } = useConsent();
  if (!ready) return null;

  const loadGtm = hasGtm() && (consent.statistics || consent.marketing);
  const loadHotjar = hasHotjar() && consent.statistics;

  return (
    <>
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
