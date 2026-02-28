import type { ProcessRoadmapStep } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Route } from "lucide-react";

export function ProcessRoadmapMini({ steps }: { steps: ProcessRoadmapStep[] }) {
  return (
    <section className="space-y-5" aria-labelledby="process-roadmap-title">
      <SectionHeader
        label="Мини roadmap"
        title={<span id="process-roadmap-title">Как идет проект</span>}
        icon={Route}
      />

      <ol
        className="relative space-y-3 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-[0_25px_60px_-55px_rgba(15,23,42,0.6)]"
        data-testid="process-roadmap-mini"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70" />
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="grid gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0 lg:grid-cols-[44px_1fr_1fr_1fr_120px] lg:items-start"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-black text-foreground">
              {index + 1}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Шаг</div>
              <div className="font-semibold text-foreground">{step.title}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Клиент</div>
              <div className="text-sm text-foreground/90">{step.clientAction}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Electromax
              </div>
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
