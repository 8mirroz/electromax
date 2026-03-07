import type { CmsLocale, CmsService } from "@/types/cms";
import type { ServicePageModel } from "@/types";
import {
  getAllServicePageModels,
  getServicePageModel,
  getServicePageSlugs,
} from "@/lib/services-content";
import { getCmsItemBySlug, listCmsCollection } from "@/lib/cms/client";

function withCmsOverrides(base: ServicePageModel, service: CmsService): ServicePageModel {
  const description = service.description?.trim() || base.description;
  const seoTitle = service.seo?.title?.trim();
  const seoDescription = service.seo?.description?.trim();

  const nextSeoParagraphs = [...base.seo.paragraphs];
  if (seoDescription) {
    if (nextSeoParagraphs.length === 0) {
      nextSeoParagraphs.push(seoDescription);
    } else {
      nextSeoParagraphs[0] = seoDescription;
    }
  }

  return {
    ...base,
    title: service.title?.trim() || base.title,
    shortName: service.shortName?.trim() || base.shortName,
    description,
    hero: {
      ...base.hero,
      title: service.title?.trim() || base.hero.title,
      subtitle: description,
    },
    seo: {
      ...base.seo,
      title: seoTitle || base.seo.title,
      paragraphs: nextSeoParagraphs,
    },
  };
}

export async function getServicePageModelFromCms(
  slug: string,
  options?: { locale?: CmsLocale },
): Promise<ServicePageModel | null> {
  const base = getServicePageModel(slug);
  if (!base) return null;

  const cmsDoc = await getCmsItemBySlug("services", slug, options);
  if (!cmsDoc) return base;

  return withCmsOverrides(base, cmsDoc);
}

export async function getAllServicePageModelsFromCms(options?: {
  locale?: CmsLocale;
  limit?: number;
}): Promise<ServicePageModel[]> {
  const slugs = await getServicePageSlugsFromCms(options);
  const models = await Promise.all(
    slugs.map((slug) => getServicePageModelFromCms(slug, { locale: options?.locale })),
  );

  const filtered = models.filter((model): model is ServicePageModel => Boolean(model));
  if (!options?.limit) return filtered;
  return filtered.slice(0, options.limit);
}

export async function getServicePageSlugsFromCms(options?: {
  locale?: CmsLocale;
}): Promise<string[]> {
  const fallbackSlugs = getServicePageSlugs();
  const cmsServices = await listCmsCollection("services", { locale: options?.locale, limit: 500 });

  const cmsSlugs = cmsServices
    .map((service) => service.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);

  return Array.from(new Set([...fallbackSlugs, ...cmsSlugs]));
}

export async function getLegacyServiceModels(): Promise<ServicePageModel[]> {
  return getAllServicePageModels();
}
