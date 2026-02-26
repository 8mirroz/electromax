import type { ServicePageModel } from "@/types";

export function ServiceStatsStrip({ model }: { model: ServicePageModel }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-testid="service-stats-strip">
      {model.stats.map((stat) => (
        <article key={stat.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">{stat.label}</div>
          <div className="mt-1 text-2xl font-display font-black tracking-tight" style={{ color: model.theme.accentStrong }}>
            {stat.value}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stat.description}</p>
          <div className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">
            {stat.verified ? "Подтверждено" : "Операционный ориентир"}
          </div>
        </article>
      ))}
    </section>
  );
}
