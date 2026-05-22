import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { RECIPES } from "@/lib/recipes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url;

  const staticPaths: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/abendessen", priority: 0.95, changeFrequency: "weekly" },
    { path: "/getraenke", priority: 0.9, changeFrequency: "weekly" },
    { path: "/fruehstueck", priority: 0.7, changeFrequency: "weekly" },
    { path: "/speisen", priority: 0.7, changeFrequency: "monthly" },
    { path: "/veranstaltungen", priority: 0.8, changeFrequency: "monthly" },
    { path: "/events", priority: 0.7, changeFrequency: "weekly" },
    { path: "/ueber-uns", priority: 0.7, changeFrequency: "monthly" },
    { path: "/rezepte", priority: 0.7, changeFrequency: "weekly" },
    { path: "/kontakt", priority: 0.6, changeFrequency: "yearly" },
    { path: "/reservieren", priority: 0.8, changeFrequency: "yearly" },
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

  return entries;
}
