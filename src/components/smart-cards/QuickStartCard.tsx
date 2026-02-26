"use client";

import { motion } from "motion/react";
import { ArrowRight, Clock, TrendingUp, Zap, Shield, Layers } from "lucide-react";
import type { QuickStartCard as QuickStartCardType } from "@/types";

interface QuickStartCardProps {
  card: QuickStartCardType;
  serviceSlug: string;
  serviceTitle: string;
  onAddToTray?: (card: QuickStartCardType, serviceSlug: string) => void;
}

const difficultyConfig = {
  easy: {
    label: "Простое",
    color: "text-emerald-700 bg-emerald-50",
    icon: Zap,
  },
  medium: {
    label: "Среднее",
    color: "text-amber-700 bg-amber-50",
    icon: TrendingUp,
  },
  complex: {
    label: "Сложное",
    color: "text-rose-700 bg-rose-50",
    icon: Shield,
  },
};

export function QuickStartCard({
  card,
  serviceSlug,
  serviceTitle,
  onAddToTray,
}: QuickStartCardProps) {
  const DifficultyIcon = difficultyConfig[card.difficulty].icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      {card.featured && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          Популярное
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-muted/50 to-muted p-5">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyConfig[card.difficulty].color}`}
          >
            <DifficultyIcon className="h-3.5 w-3.5" />
            {difficultyConfig[card.difficulty].label}
          </span>
          {card.budgetFrom && (
            <span className="text-sm font-bold text-foreground">
              от {card.budgetFrom.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
        <h3 className="text-lg font-display font-black uppercase tracking-tight text-foreground">
          {card.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Duration */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{card.duration}</span>
        </div>

        {/* Benefits */}
        <div className="mb-5 space-y-2">
          {card.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Service Badge */}
        <div className="mt-auto rounded-lg bg-muted px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {serviceTitle}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="border-t border-border bg-muted/30 p-4">
        <button
          type="button"
          onClick={() => onAddToTray?.(card, serviceSlug)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {card.ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
