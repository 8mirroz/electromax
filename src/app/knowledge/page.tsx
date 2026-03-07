import Link from "next/link";
import type { Metadata } from "next";
import { listCmsCollection } from "@/lib/cms/client";
import { defaultOgImage, getSiteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const canonical = siteUrl ? `${siteUrl}/knowledge` : undefined;

  return {
    title: "Knowledge Hub",
    description: "База знаний Electromax: статьи, гайды и чеклисты по инженерным системам для B2B.",
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: "Knowledge Hub | Electromax",
      description: "Статьи, кейсы и практические материалы по инженерным системам.",
      type: "website",
      locale: "ru_RU",
      url: canonical,
      images: [defaultOgImage],
    },
  };
}

export default async function KnowledgePage() {
  const [articles, authors] = await Promise.all([
    listCmsCollection("articles", { locale: "ru", limit: 24 }),
    listCmsCollection("authors", { locale: "ru" }),
  ]);

  const authorBySlug = new Map(authors.map((author) => [author.slug, author]));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-muted/20 pt-28 pb-14">
        <div className="container mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Knowledge Hub
          </p>
          <h1 className="mt-3 text-4xl font-display font-black leading-tight md:text-6xl">
            База знаний для B2B объектов
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            Практические статьи, чеклисты и гайды для техдиректоров, эксплуатации и закупки.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const author = authorBySlug.get(article.authorSlug);
              return (
                <article
                  key={article.id}
                  className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {article.contentType}
                  </div>
                  <h2 className="mt-3 text-xl font-display font-black leading-snug">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">{article.excerpt}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-8 text-xs text-muted-foreground">
                    {author?.fullName || "Electromax Team"} •{" "}
                    {new Date(article.updatedAt).toLocaleDateString("ru-RU")}
                  </div>

                  <Link
                    href={`/knowledge/${article.slug}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:underline"
                  >
                    Читать материал
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
