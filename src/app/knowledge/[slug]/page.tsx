import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCmsItemBySlug, listCmsCollection } from "@/lib/cms/client";
import { defaultOgImage, getSiteUrl } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await listCmsCollection("articles", { locale: "ru", limit: 100 });
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getCmsItemBySlug("articles", slug, { locale: "ru" });
  if (!article) {
    return { title: "Материал не найден" };
  }

  const siteUrl = getSiteUrl();
  const canonical = siteUrl ? `${siteUrl}/knowledge/${slug}` : undefined;
  return {
    title: article.seo.title || article.title,
    description: article.seo.description || article.excerpt,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: article.seo.title || article.title,
      description: article.seo.description || article.excerpt,
      type: "article",
      locale: "ru_RU",
      url: canonical,
      images: [defaultOgImage],
    },
  };
}

export default async function KnowledgeArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [article, authors] = await Promise.all([
    getCmsItemBySlug("articles", slug, { locale: "ru" }),
    listCmsCollection("authors", { locale: "ru" }),
  ]);

  if (!article) notFound();

  const author = authors.find((item) => item.slug === article.authorSlug);

  const siteUrl = getSiteUrl();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: author?.fullName || "Electromax Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Electromax",
      logo: siteUrl ? { "@type": "ImageObject", url: `${siteUrl}/logo.png` } : undefined,
    },
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: siteUrl ? `${siteUrl}/knowledge/${slug}` : undefined,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl || "/" },
      { "@type": "ListItem", position: 2, name: "База знаний", item: siteUrl ? `${siteUrl}/knowledge` : "/knowledge" },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article className="container mx-auto max-w-4xl px-6 pt-28 pb-16">
        <Link href="/knowledge" className="text-sm font-semibold text-primary hover:underline">
          ← Все материалы
        </Link>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {article.contentType}
        </p>
        <h1 className="mt-3 text-4xl font-display font-black leading-tight md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{article.excerpt}</p>

        <div className="mt-5 text-sm text-muted-foreground">
          {author?.fullName || "Electromax Team"} •{" "}
          {new Date(article.updatedAt).toLocaleDateString("ru-RU")}
        </div>

        <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap">{article.body}</div>
      </article>
    </main>
  );
}
