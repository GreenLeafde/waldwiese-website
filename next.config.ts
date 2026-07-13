import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Server Actions: Standard-Limit für den Request-Body liegt bei 1 MB. Für das
   * Bewerbungsformular (Lebenslauf/Zeugnisse als Anhang) heben wir es an.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },

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
      // Konzept 2026-07: EINE Speisekarte mit Tageszeiten (Frühstück/Mittag/Abend).
      // Frühstück & Brunch → Frühstück-Abschnitt, Abendkarte → Abend-Abschnitt.
      { source: "/fruehstueck", destination: "/speisekarte#fruehstueck", permanent: true },
      { source: "/brunch", destination: "/speisekarte#fruehstueck", permanent: true },
      { source: "/abendessen", destination: "/speisekarte#abend", permanent: true },
      { source: "/speisen", destination: "/speisekarte", permanent: true },
      // Magic Dinner / Events beendet → auf die Veranstaltungs-Seite umleiten.
      { source: "/magic-dinner-summer-edition", destination: "/veranstaltungen", permanent: true },
      { source: "/events/magic-dinner-summer-edition", destination: "/veranstaltungen", permanent: true },
      { source: "/events", destination: "/veranstaltungen", permanent: true },
      { source: "/speisen-getraenke", destination: "/speisekarte", permanent: true },
      { source: "/restaurant-regensburg", destination: "/abendessen-regensburg", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz", permanent: true },
      { source: "/cookie-richtlinie", destination: "/datenschutz", permanent: true },
      { source: "/3d-flip-book/speisekarte", destination: "/speisekarte", permanent: true },
    ];
  },
};

export default nextConfig;
