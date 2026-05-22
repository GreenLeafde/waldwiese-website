import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /**
   * Explizit setzen, weil oberhalb dieses Verzeichnisses noch ein
   * package-lock.json liegt (User-Home). Sonst pickt Turbopack den falschen
   * Root und meckert mit einer Warnung.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    /**
     * remotePatterns wird gebraucht falls wir später Unsplash-Stock-Fotos
     * direkt einbinden. Aktuell liegen alle Bilder lokal in /public/photos.
     */
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
