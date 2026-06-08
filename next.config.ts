import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * remotePatterns für externe Bildhosts. Aktuell liegen alle Bilder
     * lokal in /public/photos.
     */
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },

  /**
   * 301-Weiterleitungen von den alten WordPress-URLs (restaurant-waldwiese.de)
   * auf die neuen Routen. Erhält Ranking & eingehende Links beim Umzug und
   * verhindert 404s. Quelle: Google Search Console (Stand 2026-06).
   * Reiner WordPress-Müll (/wp-admin, /feed, ?feed=rss2, 3d-flip-book-Plugin …)
   * existiert hier nicht mehr und wird absichtlich NICHT weitergeleitet — Google
   * entfernt diese Seiten nach dem Umzug von selbst.
   */
  async redirects() {
    return [
      { source: "/tiramisu-rezept", destination: "/rezepte/pistazientiramisu", permanent: true },
      { source: "/magic-dinner-summer-edition", destination: "/events/magic-dinner-summer-edition", permanent: true },
      { source: "/speisen-getraenke", destination: "/abendessen", permanent: true },
      { source: "/restaurant-regensburg", destination: "/abendessen-regensburg", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz", permanent: true },
      { source: "/cookie-richtlinie", destination: "/datenschutz", permanent: true },
      { source: "/3d-flip-book/speisekarte", destination: "/abendessen", permanent: true },
    ];
  },
};

export default nextConfig;
