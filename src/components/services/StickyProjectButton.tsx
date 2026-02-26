"use client";

import { formatProjectTrayRange } from "@/lib/project-tray";
import type { ProjectTrayState } from "@/types";

export function StickyProjectButton({ tray, onClick }: { tray: ProjectTrayState; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="project-tray-trigger"
      className="fixed bottom-4 right-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-border bg-white/95 p-3 text-left shadow-2xl backdrop-blur md:w-[340px]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Проект</div>
          <div className="text-sm font-semibold text-foreground">
            {tray.items.length > 0 ? `${tray.items.length} поз.` : "Пока пусто"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Ориентир</div>
          <div className="text-sm font-semibold text-foreground">{formatProjectTrayRange(tray.estimatedRange)}</div>
        </div>
      </div>
    </button>
  );
}
