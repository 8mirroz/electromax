import { listCmsCollection } from "@/lib/cms/client";
import Link from "next/link";

interface Props {
  /** Tags to match against article tags */
  tags?: string[];
  limit?: number;
}

export async function RelatedArticlesSection({ tags = [], limit = 3 }: Props) {
  const articles = await listCmsCollection("articles", { locale: "ru", limit: 50 });

  const related = tags.length
    ? articles.filter((a) => a.tags?.some((t: string) => tags.includes(t))).slice(0, limit)
    : articles.slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-display font-black md:text-3xl">Полезные материалы</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/knowledge/${a.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {a.contentType}
              </p>
              <h3 className="mt-2 text-base font-display font-bold group-hover:text-primary">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
