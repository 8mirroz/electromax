import { SERVICES_DB } from "@/data/services";
import Link from "next/link";

interface Props {
  currentSlug: string;
  limit?: number;
}

export function RelatedServicesSection({ currentSlug, limit = 3 }: Props) {
  const others = Object.entries(SERVICES_DB)
    .filter(([slug]) => slug !== currentSlug)
    .slice(0, limit)
    .map(([slug, s]) => ({ slug, ...s }));

  if (others.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-display font-black md:text-3xl">Другие услуги</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {others.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <h3 className="text-base font-display font-bold group-hover:text-primary">
                {s.shortName || s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
