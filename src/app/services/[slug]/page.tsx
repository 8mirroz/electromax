import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defaultOgImage, getSiteUrl } from "@/lib/seo";
import { getServicePageModel, getServicePageSlugs } from "@/lib/services-content";
import { ServicePageClient } from "./ServicePageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getServicePageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = getServicePageModel(slug);

  if (!model) {
    return { title: "Услуга не найдена" };
  }

  const siteUrl = getSiteUrl();
  const url = siteUrl ? `${siteUrl}/services/${model.slug}` : undefined;

  return {
    title: model.title,
    description: model.description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: `${model.title} | Electromax`,
      description: model.description,
      type: "website",
      locale: "ru_RU",
      url,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${model.title} | Electromax`,
      description: model.description,
      images: [defaultOgImage],
    },
  };
}

function getOfferRange(model: NonNullable<ReturnType<typeof getServicePageModel>>) {
  const pricedItems = model.catalog
    .flatMap((section) => section.items)
    .filter((item) => typeof item.priceMin === "number");
  const low = pricedItems.length
    ? Math.min(...pricedItems.map((item) => item.priceMin ?? 0))
    : undefined;
  const highCandidates = pricedItems
    .map((item) => item.priceMax ?? item.priceMin ?? 0)
    .filter(Boolean);
  const high = highCandidates.length ? Math.max(...highCandidates) : low;
  return { low, high };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const model = getServicePageModel(slug);

  if (!model) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = siteUrl ? `${siteUrl}/services/${model.slug}` : `/services/${model.slug}`;
  const faqSchemaItems = model.faq.filter((item) => item.schemaInclude);
  const offer = getOfferRange(model);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: model.title,
    serviceType: model.title,
    description: model.description,
    areaServed: model.seo.serviceArea || "Москва и Московская область",
    provider: {
      "@type": "LocalBusiness",
      name: "Electromax",
      areaServed: "Москва и Московская область",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: offer.low,
      highPrice: offer.high,
      offerCount: model.catalog.reduce((sum, section) => sum + section.items.length, 0),
    },
    url: pageUrl,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSchemaItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl ? `${siteUrl}/` : "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Услуги",
        item: siteUrl ? `${siteUrl}/services` : "/services",
      },
      { "@type": "ListItem", position: 3, name: model.shortName, item: pageUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="border-b border-border bg-muted/20 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-2 text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-muted-foreground/60"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-primary transition-colors">
              Услуги
            </Link>
            <span>/</span>
            <span className="text-foreground">{model.shortName}</span>
          </nav>
        </div>
      </div>

      <ServicePageClient model={model} />
    </main>
  );
}
