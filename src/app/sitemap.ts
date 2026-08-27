import type { MetadataRoute } from "next";

import { getAllClientIds } from "@/data/client-story";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/gallery", "/about", "/services", "/contact"];
  const clientRoutes = getAllClientIds().map((clientId) => `/work/${clientId}`);

  return [...staticRoutes, ...clientRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
