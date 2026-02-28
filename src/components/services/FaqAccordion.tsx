import type { SeoFaqItem } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HelpCircle } from "lucide-react";

export function FaqAccordion({ items }: { items: SeoFaqItem[] }) {
  return (
    <section className="space-y-5" aria-labelledby="faq-title">
      <SectionHeader
        label="FAQ"
        title={<span id="faq-title">Частые вопросы</span>}
        icon={HelpCircle}
      />
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_25px_60px_-55px_rgba(15,23,42,0.6)]"
        data-testid="seo-faq-block"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70" />
        {items.map((item) => (
          <details key={item.id} className="group border-b border-border last:border-b-0">
            <summary className="cursor-pointer list-none px-4 py-4 font-semibold text-foreground">
              <span>{item.question}</span>
              <span className="float-right text-muted-foreground group-open:rotate-45 transition">
                +
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-foreground/85">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
