import Link from "next/link";
import type { BenchmarkPriceRange, ServicePageSeoBlock } from "@/types";

function formatBenchmark(item: BenchmarkPriceRange) {
  if (typeof item.priceMin === "number" && typeof item.priceMax === "number") {
    return `${item.priceMin.toLocaleString("ru-RU")}–${item.priceMax.toLocaleString("ru-RU")} ${item.currency}`;
  }
  if (typeof item.priceMin === "number") {
    return `от ${item.priceMin.toLocaleString("ru-RU")} ${item.currency}`;
  }
  return "по запросу";
}

export function SeoContentBlock({ seo, benchmarks }: { seo: ServicePageSeoBlock; benchmarks: BenchmarkPriceRange[] }) {
  return (
    <section className="space-y-4" aria-labelledby="seo-block-title">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO блок</div>
        <h2 id="seo-block-title" className="text-2xl font-display font-black uppercase tracking-tight">{seo.title}</h2>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div className="space-y-4 text-sm leading-7 text-foreground/90">
          {seo.paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {benchmarks.length > 0 ? (
          <div className="mt-5 rounded-xl border border-border bg-muted/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ориентиры рынка (внутренний benchmark)</div>
            <ul className="mt-2 space-y-2 text-sm">
              {benchmarks.slice(0, 3).map((benchmark) => (
                <li key={benchmark.id}>
                  <span className="font-semibold">{benchmark.label}:</span> {formatBenchmark(benchmark)} ({benchmark.unit})
                  <div className="text-xs text-muted-foreground">Проверка: {benchmark.checkedAt}. Источник хранится во внутренней базе контента.</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {seo.serviceArea ? (
            <div className="rounded-xl bg-muted px-3 py-2 text-sm">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">География</div>
              <div className="font-medium text-foreground">{seo.serviceArea}</div>
            </div>
          ) : null}
          {seo.responseTime ? (
            <div className="rounded-xl bg-muted px-3 py-2 text-sm">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Время ответа</div>
              <div className="font-medium text-foreground">{seo.responseTime}</div>
            </div>
          ) : null}
        </div>

        {seo.relatedServiceSlugs.length > 0 ? (
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Связанные услуги</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {seo.relatedServiceSlugs.map((slug) => (
                <Link key={slug} href={`/services/${slug}`} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:border-primary hover:text-primary">
                  /services/{slug}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {seo.priceDisclaimer ? (
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{seo.priceDisclaimer}</p>
        ) : null}
      </div>
    </section>
  );
}
