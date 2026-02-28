"use client";

import { motion } from "motion/react";
import { Clock, TrendingUp, Zap, Shield, Layers } from "lucide-react";
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
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-muted/50 to-muted p-5">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold lowercase first-letter:uppercase tracking-tight ${difficultyConfig[card.difficulty].color}`}
          >
            <DifficultyIcon className="h-3.5 w-3.5" />
            {difficultyConfig[card.difficulty].label}
          </span>
        </div>
        <h3 className="text-base font-display font-black lowercase first-letter:uppercase tracking-tight text-foreground leading-tight">
          {card.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Benefits */}
        <div className="mb-5 space-y-2">
          {card.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto" />
      </div>

      {/* Footer Meta */}
      <div className="border-t border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{card.duration}</span>
          </div>
          {card.budgetFrom && (
            <span className="font-bold text-foreground">
              от {card.budgetFrom.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
