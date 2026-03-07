import { listCmsCollection } from "@/lib/cms/client";
import Link from "next/link";

interface Props {
  limit?: number;
}

export async function TestimonialsSection({ limit = 3 }: Props) {
  const testimonials = await listCmsCollection("testimonials", { locale: "ru", limit });

  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-display font-black md:text-3xl">Отзывы клиентов</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="text-sm text-amber-500">{"★".repeat(t.rating)}</div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 text-sm font-semibold">{t.customerName}</div>
              <div className="text-xs text-muted-foreground">{t.company}</div>
            </article>
          ))}
        </div>
        <Link href="/testimonials" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">
          Все отзывы →
        </Link>
      </div>
    </section>
  );
}
