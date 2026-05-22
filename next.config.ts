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
};

export default nextConfig;
