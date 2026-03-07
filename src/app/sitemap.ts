import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { listCmsCollection } from "@/lib/cms/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    "/knowledge",
    "/videos",
    "/testimonials",
    "/privacy",
    "/terms",
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));

  const [articles, services] = await Promise.all([
    listCmsCollection("articles", { locale: "ru", limit: 200 }),
    listCmsCollection("services", { locale: "ru", limit: 200 }),
  ]);

  const serviceEntries = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified,
  }));

  const articleEntries = articles.map((article) => ({
    url: `${siteUrl}/knowledge/${article.slug}`,
    lastModified: new Date(article.updatedAt || lastModified),
  }));

  return [...staticEntries, ...serviceEntries, ...articleEntries];
}
