import type { Metadata } from "next";
import { listCmsCollection } from "@/lib/cms/client";
import { getSiteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Отзывы клиентов",
  description: "Отзывы и рекомендации клиентов OneDim по внедрению инженерных систем.",
};

export default async function TestimonialsPage() {
  const testimonials = await listCmsCollection("testimonials", { locale: "ru", limit: 50 });
  const siteUrl = getSiteUrl();

  const avgRating = testimonials.length
    ? testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length
    : 5;
  const aggregateRatingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OneDim",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl || "/" },
      { "@type": "ListItem", position: 2, name: "Отзывы" },
    ],
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="border-b border-border bg-muted/20 pt-28 pb-14">
        <div className="container mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-display font-black md:text-5xl">Отзывы и рекомендации</h1>
          <p className="mt-4 text-muted-foreground">
            Подтверждения результата от клиентов коммерческих и промышленных объектов.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-6 py-12">
        <div className="space-y-5">
          {testimonials.map((item) => (
            <article key={item.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="text-sm font-semibold text-foreground">
                {item.customerName} • {item.company}
              </div>
              <p className="mt-3 text-base text-muted-foreground">“{item.quote}”</p>
              <div className="mt-3 text-sm text-amber-500">{"★".repeat(item.rating)}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
