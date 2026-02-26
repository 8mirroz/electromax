"use client";

import type { ServicePageModel } from "@/types";

interface Props {
  model: ServicePageModel;
  onPrimaryCta: () => void;
}

export function ServiceHeroCompact({ model, onPrimaryCta }: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-5 sm:p-8"
      style={{ backgroundColor: model.theme.accentSoft }}
      data-testid="service-hero-compact"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.05]" />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: `${model.theme.accent}33` }}
      />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80"
            style={{ borderColor: `${model.theme.accent}44` }}>
            {model.shortName} • Аудит и запуск проекта
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight uppercase text-foreground">
            {model.hero.title}
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-foreground/80">
            {model.hero.subtitle}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {model.hero.trustItems?.slice(0, 3).map((item) => (
              <div key={item} className="rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-xs font-medium text-foreground/80">
                {item}
              </div>
            ))}
          </div>
          {model.hero.priceDisclaimer ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{model.hero.priceDisclaimer}</p>
          ) : null}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[280px]">
          <button
            type="button"
            onClick={onPrimaryCta}
            data-testid="hero-audit-cta"
            className="inline-flex h-12 items-center justify-center rounded-xl px-4 text-sm font-black tracking-wide text-white shadow-lg transition hover:opacity-95"
            style={{ backgroundColor: model.theme.accent }}
          >
            {model.hero.ctaLabel}
          </button>
          <p className="text-xs leading-relaxed text-foreground/70">{model.hero.ctaHint ?? "Получите план этапов, ориентир бюджета и список рисков по объекту."}</p>
        </div>
      </div>
    </section>
  );
}
