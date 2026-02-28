"use client";

import type { ServicePageModel } from "@/types";

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const isShort = normalized.length === 3;
  const full = isShort
    ? normalized
        .split("")
        .map((char) => char + char)
        .join("")
    : normalized;
  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface Props {
  model: ServicePageModel;
  onPrimaryCta: () => void;
}

export function ServiceHeroCompact({ model, onPrimaryCta }: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-white/15 p-6 text-white shadow-[0_24px_50px_-28px_rgba(15,23,42,0.55)] sm:p-8"
      style={{
        backgroundImage: `linear-gradient(135deg, ${model.theme.accent} 0%, ${model.theme.accent} 45%, ${model.theme.accentStrong} 100%)`,
      }}
      data-testid="service-hero-compact"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 0% 0%, ${hexToRgba(
            model.theme.accent,
            0.55,
          )}, transparent 60%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.06]" />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: hexToRgba(model.theme.accent, 0.25) }}
      />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          <h1
            className="font-display font-black leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(1.9rem, 3.7vw, 3.2rem)" }}
          >
            {model.hero.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {model.hero.subtitle}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {model.hero.trustItems?.slice(0, 3).map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white/85 shadow-sm shadow-black/10"
              >
                {item}
              </div>
            ))}
          </div>
          {model.hero.priceDisclaimer ? (
            <p className="text-xs leading-relaxed text-white/70">{model.hero.priceDisclaimer}</p>
          ) : null}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[280px]">
          <button
            type="button"
            onClick={onPrimaryCta}
            data-testid="hero-audit-cta"
            className="h-12 rounded-2xl bg-white px-6 text-[14px] font-bold uppercase tracking-wider shadow-lg shadow-black/20 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{ color: model.theme.accentStrong }}
          >
            {model.hero.ctaLabel}
          </button>
          <p className="text-xs leading-relaxed text-white/75">
            {model.hero.ctaHint ??
              "Получите план этапов, ориентир бюджета и список рисков по объекту."}
          </p>
        </div>
      </div>
    </section>
  );
}
