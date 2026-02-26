"use client";

import Link from "next/link";
import type { AiAssistantRecommendation } from "@/types";

export function AiAssistantRail({
  recommendations,
  warnings,
}: {
  recommendations: AiAssistantRecommendation[];
  warnings: string[];
}) {
  const content = (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-sm" data-testid="ai-rail">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Assistant v1</div>
        <h3 className="mt-1 text-lg font-display font-black uppercase tracking-tight">Подсказки по проекту</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Локальные правила, без отправки данных наружу. Анализирует состав проекта на этой странице.
        </p>
      </div>

      {warnings.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div key={rec.id} className="rounded-xl border border-border px-3 py-3">
            <p className="text-sm leading-relaxed text-foreground/90">{rec.message}</p>
            {rec.recommendServiceSlug ? (
              <Link href={`/services/${rec.recommendServiceSlug}`} className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline">
                {rec.actionLabel ?? "Открыть"}
              </Link>
            ) : (
              <div className="mt-2 text-xs font-semibold text-primary">{rec.actionLabel ?? "Проверьте"}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block lg:sticky lg:top-24">{content}</div>
      <details className="lg:hidden rounded-2xl border border-border bg-white p-3 shadow-sm">
        <summary className="cursor-pointer list-none text-sm font-semibold">AI Assistant v1: рекомендации по проекту</summary>
        <div className="pt-3">{content}</div>
      </details>
    </>
  );
}
