import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { RECIPES } from "@/lib/recipes";
import { ORTE } from "@/lib/landing/orte";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url;

  const staticPaths: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/brunch", priority: 0.95, changeFrequency: "weekly" },
    { path: "/fruehstuecks-sommelier", priority: 0.7, changeFrequency: "monthly" },
    { path: "/abendessen", priority: 0.9, changeFrequency: "weekly" },
    { path: "/getraenke", priority: 0.85, changeFrequency: "weekly" },
    { path: "/speisen", priority: 0.7, changeFrequency: "monthly" },
    { path: "/veranstaltungen", priority: 0.8, changeFrequency: "monthly" },
    { path: "/ueber-uns", priority: 0.7, changeFrequency: "monthly" },
    { path: "/rezepte", priority: 0.7, changeFrequency: "weekly" },
    { path: "/galerie", priority: 0.6, changeFrequency: "monthly" },
    { path: "/kontakt", priority: 0.6, changeFrequency: "yearly" },
    { path: "/karriere", priority: 0.75, changeFrequency: "monthly" },
    { path: "/reservieren", priority: 0.8, changeFrequency: "yearly" },
    // SEO-/Städte-Landingpages
    { path: "/brunch-regensburg", priority: 0.85, changeFrequency: "monthly" },
    { path: "/brunch-sinzing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/brunch-nittendorf", priority: 0.75, changeFrequency: "monthly" },
    { path: "/brunch-kelheim", priority: 0.75, changeFrequency: "monthly" },
    { path: "/wochenendbrunch-regensburg", priority: 0.8, changeFrequency: "monthly" },
    { path: "/fruehstueck-regensburg", priority: 0.85, changeFrequency: "monthly" },
    { path: "/fruehstueck-sinzing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/veganes-fruehstueck-regensburg", priority: 0.8, changeFrequency: "monthly" },
    { path: "/hochzeitslocation-regensburg", priority: 0.8, changeFrequency: "monthly" },
    { path: "/restaurant-sinzing", priority: 0.8, changeFrequency: "monthly" },
    {
      path: "/hundefreundliches-restaurant-regensburg",
      priority: 0.75,
      changeFrequency: "monthly",
    },
    { path: "/abendessen-regensburg", priority: 0.8, changeFrequency: "monthly" },
    {
      path: "/vegetarisches-restaurant-regensburg",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    { path: "/burger-regensburg", priority: 0.8, changeFrequency: "monthly" },
    { path: "/restaurant-viehhausen", priority: 0.75, changeFrequency: "monthly" },
    { path: "/restaurant-nittendorf", priority: 0.75, changeFrequency: "monthly" },
    { path: "/biergarten-sinzing", priority: 0.8, changeFrequency: "monthly" },
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  for (const r of RECIPES) {
    entries.push({
      url: `${base}/rezepte/${r.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  // Nachbarort-Landingpages (/restaurant/<ort>) — nur Sitemap, nicht im Footer
  for (const o of ORTE) {
    entries.push({
      url: `${base}/restaurant/${o.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return entries;
}
