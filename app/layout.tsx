import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConsentProvider } from "@/components/consent-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { SommelierFab } from "@/components/sommelier/sommelier-fab";
import { TrackingScripts } from "@/components/tracking-scripts";
import { Analytics } from "@/components/analytics";
import { HideOnAdmin } from "@/components/hide-on-admin";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";
import {
  CONTACT,
  GEO,
  GOOGLE_MAPS_URL,
  SITE,
  liveOpeningHours,
  siteDescription,
} from "@/lib/site";
import "./globals.css";

/**
 * Site-weites ISR: alle Seiten werden regelmäßig neu generiert, damit die
 * Datumsweiche (Coming-Soon → Frühstückskarte, Öffnungszeiten) am 06.07. 00:00
 * OHNE neuen Deploy greift. Einzelne Seiten dürfen kürzer revalidieren.
 */
export const revalidate = 600;

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const description = siteDescription();
  return {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  keywords: [
    "Frühstücksrestaurant Regensburg",
    "Frühstücksrestaurant Sinzing",
    "Frühstück Sinzing",
    "Frühstück Regensburg",
    "Frühstücken gehen Regensburg",
    "Brunch Regensburg",
    "Brunch Sinzing",
    "veganes Frühstück Regensburg",
    "Restaurant Sinzing",
    "regional saisonal",
    "hundefreundliches Restaurant Regensburg",
    "Hochzeitslocation Regensburg",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} · ${SITE.tagline}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} · ${SITE.tagline}`,
    description,
  },
  };
}

export const viewport: Viewport = {
  themeColor: "#2e3d2c",
  width: "device-width",
  initialScale: 1,
};

/**
 * Schema.org Restaurant — hilft Google das Restaurant korrekt zu indexieren
 * und in Rich Results (Öffnungszeiten, Adresse, Bewertungen) anzuzeigen.
 */
function buildRestaurantJsonLd() {
  return {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  url: SITE.url,
  description: siteDescription(),
  servesCuisine: ["Frühstück", "Regional", "Vegetarisch", "Vegan"],
  priceRange: "€€",
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.street,
    postalCode: CONTACT.postalCode,
    addressLocality: CONTACT.city,
    addressRegion: CONTACT.region,
    addressCountry: "DE",
  },
  openingHoursSpecification: liveOpeningHours().map((slot) => ({
    "@type": "OpeningHoursSpecification",
    description: slot.isoSpec,
  })),
  geo: {
    "@type": "GeoCoordinates",
    latitude: GEO.lat,
    longitude: GEO.lng,
  },
  hasMap: GOOGLE_MAPS_URL,
  sameAs: [CONTACT.instagram],
  };
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  inLanguage: "de-DE",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-mehlcreme text-ink">
        {/* Google Consent Mode v2 — Defaults (denied) VOR jedem Tracking. */}
        <Script
          id="consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildRestaurantJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ConsentProvider>
          <HideOnAdmin>
            <SiteHeader />
          </HideOnAdmin>
          <main className="flex-1">{children}</main>
          <HideOnAdmin>
            <SiteFooter />
            <SommelierFab />
          </HideOnAdmin>
          <CookieBanner />
          <TrackingScripts />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
