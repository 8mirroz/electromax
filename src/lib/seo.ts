import type { Metadata } from "next";

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
  if (!url && process.env.NODE_ENV !== "production") {
    console.warn("[SEO] NEXT_PUBLIC_SITE_URL is not set. sitemap/og urls will be empty.");
  }
  return url.replace(/\/+$/, "");
}

export const defaultMetadata: Metadata = {
  title: {
    default: "Electromax | Инженерная интеграция систем безопасности",
    template: "%s | Electromax",
  },
  description:
    "Проектирование, монтаж и обслуживание комплексных систем безопасности и инженерной инфраструктуры для коммерческих и промышленных объектов.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const defaultOgImage = {
  url: "/og/default.png",
  width: 1200,
  height: 630,
  alt: "Electromax — инженерная интеграция систем безопасности",
};
