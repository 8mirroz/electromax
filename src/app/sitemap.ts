import type { MetadataRoute } from "next";
import { SERVICES_DB } from "@/data/services";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/contacts",
    "/licenses",
    "/services",
    "/privacy",
    "/terms",
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));

  const serviceEntries = Object.keys(SERVICES_DB).map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified,
  }));

  return [...staticEntries, ...serviceEntries];
}
