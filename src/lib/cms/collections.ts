import type { CmsCollection } from "@/types/cms";

export const CMS_COLLECTIONS: CmsCollection[] = [
  "services",
  "articles",
  "caseStudies",
  "testimonials",
  "videos",
  "faqs",
  "siteSettings",
  "authors",
];

export function isCmsCollection(value: string): value is CmsCollection {
  return CMS_COLLECTIONS.includes(value as CmsCollection);
}
