import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConsentProvider } from "@/components/consent-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { TrackingScripts } from "@/components/tracking-scripts";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";
import { CONTACT, OPENING_HOURS, SITE } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  keywords: [
    "Frühstück Sinzing",
    "Frühstück Regensburg",
    "Brunch Regensburg",
    "Restaurant Sinzing",
    "regional saisonal",
    "vegan vegetarisch Frühstück",
    "hundefreundliches Restaurant Regensburg",
    "Hochzeitslocation Regensburg",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#2e3d2c",
  width: "device-width",
  initialScale: 1,
};

/**
 * Schema.org Restaurant — hilft Google das Restaurant korrekt zu indexieren
 * und in Rich Results (Öffnungszeiten, Adresse, Bewertungen) anzuzeigen.
 */
const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
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
  openingHoursSpecification: OPENING_HOURS.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    description: slot.isoSpec,
  })),
  sameAs: [CONTACT.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        {/* Google Consent Mode v2 — Defaults (denied) VOR jedem Tracking. */}
        <Script
          id="consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <ConsentProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CookieBanner />
          <TrackingScripts />
        </ConsentProvider>
      </body>
    </html>
  );
}
