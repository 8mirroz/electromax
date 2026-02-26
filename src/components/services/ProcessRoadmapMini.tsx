import type { ProcessRoadmapStep } from "@/types";

export function ProcessRoadmapMini({ steps }: { steps: ProcessRoadmapStep[] }) {
  return (
    <section className="space-y-4" aria-labelledby="process-roadmap-title">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Мини roadmap</div>
        <h2 id="process-roadmap-title" className="text-2xl font-display font-black uppercase tracking-tight">Как идет проект</h2>
      </div>

      <ol className="space-y-3 rounded-2xl border border-border bg-white p-4 shadow-sm" data-testid="process-roadmap-mini">
        {steps.map((step, index) => (
          <li key={step.id} className="grid gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0 lg:grid-cols-[44px_1fr_1fr_1fr_120px] lg:items-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-black text-foreground">{index + 1}</div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Шаг</div>
              <div className="font-semibold text-foreground">{step.title}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Клиент</div>
              <div className="text-sm text-foreground/90">{step.clientAction}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Electromax</div>
              <div className="text-sm text-foreground/90">{step.electromaxAction}</div>
              <div className="mt-1 text-xs text-muted-foreground">Артефакт: {step.artifact}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Срок</div>
              <div className="text-sm font-semibold text-foreground">{step.durationText}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
