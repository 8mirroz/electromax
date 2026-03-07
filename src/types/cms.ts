export type CmsLocale = "ru" | "en" | "kz";

export type CmsCollection =
  | "services"
  | "articles"
  | "caseStudies"
  | "testimonials"
  | "videos"
  | "faqs"
  | "siteSettings"
  | "authors";

export interface CmsSeoMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export interface CmsAuthor {
  id: string;
  slug: string;
  fullName: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  locale: CmsLocale;
}

export interface CmsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  authorSlug: string;
  contentType: "article" | "guide" | "checklist";
  publishedAt: string;
  updatedAt: string;
  locale: CmsLocale;
  seo: CmsSeoMeta;
}

export interface CmsCaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  kpiBeforeAfter: Array<{
    metric: string;
    before: string;
    after: string;
  }>;
  publishedAt: string;
  locale: CmsLocale;
  seo: CmsSeoMeta;
}

export interface CmsTestimonial {
  id: string;
  slug: string;
  customerName: string;
  company: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  videoUrl?: string;
  locale: CmsLocale;
}

export interface CmsVideo {
  id: string;
  slug: string;
  title: string;
  summary: string;
  videoUrl: string;
  durationSeconds: number;
  transcript?: string;
  locale: CmsLocale;
  seo: CmsSeoMeta;
}

export interface CmsFaqItem {
  id: string;
  slug: string;
  question: string;
  answer: string;
  intentTag?: string;
  serviceSlug?: string;
  locale: CmsLocale;
}

export interface CmsService {
  id: string;
  slug: string;
  title: string;
  shortName: string;
  description: string;
  locale: CmsLocale;
  seo: CmsSeoMeta;
}

export interface CmsSiteSettings {
  id: string;
  locale: CmsLocale;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: string;
}

export type CmsCollectionEntityMap = {
  services: CmsService;
  articles: CmsArticle;
  caseStudies: CmsCaseStudy;
  testimonials: CmsTestimonial;
  videos: CmsVideo;
  faqs: CmsFaqItem;
  siteSettings: CmsSiteSettings;
  authors: CmsAuthor;
};

export type CmsCollectionEntity<T extends CmsCollection> = CmsCollectionEntityMap[T];
