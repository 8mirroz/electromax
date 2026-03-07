import type { CmsCollection, CmsCollectionEntity, CmsLocale } from "@/types/cms";
import { getCmsBaseUrl, isCmsEnabled } from "@/lib/cms/feature-flags";
import {
  cmsFallbackArticles,
  cmsFallbackAuthors,
  cmsFallbackCaseStudies,
  cmsFallbackFaqs,
  cmsFallbackServices,
  cmsFallbackSiteSettings,
  cmsFallbackTestimonials,
  cmsFallbackVideos,
} from "@/lib/cms/fallback-content";

type CmsCollectionListMap = {
  [K in CmsCollection]: CmsCollectionEntity<K>[];
};

const fallbackMap: CmsCollectionListMap = {
  services: cmsFallbackServices,
  articles: cmsFallbackArticles,
  caseStudies: cmsFallbackCaseStudies,
  testimonials: cmsFallbackTestimonials,
  videos: cmsFallbackVideos,
  faqs: cmsFallbackFaqs,
  siteSettings: cmsFallbackSiteSettings,
  authors: cmsFallbackAuthors,
};

function getFallbackCollection<T extends CmsCollection>(collection: T): CmsCollectionEntity<T>[] {
  const items = fallbackMap[collection] as unknown as CmsCollectionEntity<T>[];
  return Array.isArray(items) ? items : [];
}

function filterByLocale<T extends { locale?: CmsLocale }>(items: T[], locale?: CmsLocale) {
  if (!locale) return items;
  return items.filter((item) => !item.locale || item.locale === locale);
}

function hashTagValue(value: string) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function getCollectionTag(collection: CmsCollection) {
  return `cms:${collection}`;
}

function getItemTag(collection: CmsCollection, slug: string) {
  return `cms:${collection}:${hashTagValue(slug)}`;
}

async function listViaHttp<T extends CmsCollection>(
  collection: T,
  options?: { locale?: CmsLocale; limit?: number },
): Promise<CmsCollectionEntity<T>[] | null> {
  const baseUrl = getCmsBaseUrl();
  if (!baseUrl) return null;

  try {
    const url = new URL(`/api/${collection}`, baseUrl);
    if (options?.locale) url.searchParams.set("locale", options.locale);
    if (options?.limit) url.searchParams.set("limit", String(options.limit));

    const response = await fetch(url.toString(), {
      next: { revalidate: 60, tags: [getCollectionTag(collection)] },
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { docs?: CmsCollectionEntity<T>[] };
    return Array.isArray(data.docs) ? data.docs : null;
  } catch {
    return null;
  }
}

async function getViaHttp<T extends CmsCollection>(
  collection: T,
  slug: string,
  options?: { locale?: CmsLocale },
): Promise<CmsCollectionEntity<T> | null> {
  const baseUrl = getCmsBaseUrl();
  if (!baseUrl) return null;

  try {
    const url = new URL(`/api/${collection}/${slug}`, baseUrl);
    if (options?.locale) url.searchParams.set("locale", options.locale);

    const response = await fetch(url.toString(), {
      next: { revalidate: 60, tags: [getItemTag(collection, slug)] },
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { doc?: CmsCollectionEntity<T> };
    return data.doc || null;
  } catch {
    return null;
  }
}

async function listViaPayloadLocalApi<T extends CmsCollection>(
  collection: T,
  options?: { locale?: CmsLocale; limit?: number },
): Promise<CmsCollectionEntity<T>[] | null> {
  if (process.env.CMS_USE_PAYLOAD_LOCAL_API !== "true") return null;

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("@/payload.config");
    const payload = await getPayload({ config });

    const result = await payload.find({
      collection: collection as never,
      limit: options?.limit || 100,
      overrideAccess: true,
      locale: options?.locale || "all",
    });

    return result.docs as unknown as CmsCollectionEntity<T>[];
  } catch {
    return null;
  }
}

async function getViaPayloadLocalApi<T extends CmsCollection>(
  collection: T,
  slug: string,
  options?: { locale?: CmsLocale },
): Promise<CmsCollectionEntity<T> | null> {
  if (process.env.CMS_USE_PAYLOAD_LOCAL_API !== "true") return null;

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("@/payload.config");
    const payload = await getPayload({ config });

    const result = await payload.find({
      collection: collection as never,
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      overrideAccess: true,
      locale: options?.locale || "all",
    });

    return (result.docs[0] as unknown as CmsCollectionEntity<T>) || null;
  } catch {
    return null;
  }
}

export async function listCmsCollection<T extends CmsCollection>(
  collection: T,
  options?: { locale?: CmsLocale; limit?: number },
): Promise<CmsCollectionEntity<T>[]> {
  const fallbackItems = filterByLocale(getFallbackCollection(collection), options?.locale);
  if (!isCmsEnabled()) return options?.limit ? fallbackItems.slice(0, options.limit) : fallbackItems;

  const localDocs = await listViaPayloadLocalApi(collection, options);
  if (localDocs && localDocs.length > 0) {
    return options?.limit ? localDocs.slice(0, options.limit) : localDocs;
  }

  const docs = await listViaHttp(collection, options);
  if (docs && docs.length > 0) {
    return options?.limit ? docs.slice(0, options.limit) : docs;
  }

  return options?.limit ? fallbackItems.slice(0, options.limit) : fallbackItems;
}

export async function getCmsItemBySlug<T extends CmsCollection>(
  collection: T,
  slug: string,
  options?: { locale?: CmsLocale },
): Promise<CmsCollectionEntity<T> | null> {
  const fallbackItems = await listCmsCollection(collection, options);
  const fallbackItem =
    fallbackItems.find((item) => "slug" in item && (item as { slug?: string }).slug === slug) || null;

  if (!isCmsEnabled()) return fallbackItem;

  const localDoc = await getViaPayloadLocalApi(collection, slug, options);
  if (localDoc) return localDoc;

  const doc = await getViaHttp(collection, slug, options);
  return doc || fallbackItem;
}
