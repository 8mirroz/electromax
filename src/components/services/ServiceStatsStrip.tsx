import type { ServicePageModel } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Gauge } from "lucide-react";

export function ServiceStatsStrip({ model }: { model: ServicePageModel }) {
  return (
    <section className="space-y-5" data-testid="service-stats-strip">
      <SectionHeader label="Ключевые ориентиры" title="Ориентиры проекта" icon={Gauge} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {model.stats.map((stat) => (
          <article
            key={stat.id}
            className="relative overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-[0_20px_50px_-45px_rgba(15,23,42,0.55)]"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, ${model.theme.accent}, ${model.theme.accentStrong} 55%, transparent)`,
              }}
            />
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              {stat.label}
            </div>
            <div
              className="mt-1 text-2xl font-display font-black tracking-tight"
              style={{ color: model.theme.accentStrong }}
            >
              {stat.value}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stat.description}</p>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">
              {stat.verified ? "Подтверждено" : "Операционный ориентир"}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
