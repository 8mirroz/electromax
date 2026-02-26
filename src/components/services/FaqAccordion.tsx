import type { SeoFaqItem } from "@/types";

export function FaqAccordion({ items }: { items: SeoFaqItem[] }) {
  return (
    <section className="space-y-4" aria-labelledby="faq-title">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">FAQ</div>
        <h2 id="faq-title" className="text-2xl font-display font-black uppercase tracking-tight">Частые вопросы</h2>
      </div>
      <div className="rounded-2xl border border-border bg-white shadow-sm" data-testid="seo-faq-block">
        {items.map((item, idx) => (
          <details key={item.id} className="group border-b border-border last:border-b-0">
            <summary className="cursor-pointer list-none px-4 py-4 font-semibold text-foreground">
              <span>{item.question}</span>
              <span className="float-right text-muted-foreground group-open:rotate-45 transition">+</span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-foreground/85">{item.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
