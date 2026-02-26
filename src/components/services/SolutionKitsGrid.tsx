"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleCheck, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { SolutionKit, ServicePageModel, CatalogItem } from "@/types";
import { formatCatalogItemPrice } from "@/lib/services-content";

interface SolutionKitsGridProps {
  model: ServicePageModel;
  onAddKit: (kit: SolutionKit) => void;
}

/**
 * Generates placeholder kits to ensure we always have exactly 6 cards.
 */
function getKitsWithPlaceholders(model: ServicePageModel): SolutionKit[] {
  const existingKits = model.solutionKits || [];
  const placeholdersCount = Math.max(0, 6 - existingKits.length);

  const placeholders: SolutionKit[] = Array.from({ length: placeholdersCount }).map((_, i) => ({
    id: `placeholder-${model.slug}-${i}`,
    name: `Типовое решение #${existingKits.length + i + 1}`,
    useCase: "Уточняется",
    targetObject: model.shortName,
    bullets: [
      "Индивидуальный подбор оборудования",
      "Расчет оптимальной конфигурации",
      "Полный цикл монтажных работ",
      "Гарантийное обслуживание"
    ],
    includedItemCodes: [],
    budgetMin: 50000 + (i * 25000),
    budgetMax: 150000 + (i * 50000),
    durationText: "1-3 дня",
    ctaLabel: "Добавить в проект",
  }));

  return [...existingKits, ...placeholders].slice(0, 6);
}

export function SolutionKitsGrid({ model, onAddKit }: SolutionKitsGridProps) {
  const [selectedKit, setSelectedKit] = useState<SolutionKit | null>(null);
  const kits = getKitsWithPlaceholders(model);

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedKit(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section className="space-y-4 py-4" aria-labelledby="solution-kits-title">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/70">
            Типовые решения
          </span>
          <h2 id="solution-kits-title" className="text-xl font-display font-black tracking-tight uppercase sm:text-2xl">
            Наборы для быстрого старта
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kits.map((kit, index) => (
          <SolutionCard
            key={kit.id}
            kit={kit}
            index={index}
            accent={model.theme.accent}
            onClick={() => setSelectedKit(kit)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedKit && (
          <ExpandedKitModal
            kit={selectedKit}
            model={model}
            onClose={() => setSelectedKit(null)}
            onAdd={() => {
              onAddKit(selectedKit);
              setSelectedKit(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function SolutionCard({
  kit,
  index,
  accent,
  onClick
}: {
  kit: SolutionKit;
  index: number;
  accent: string;
  onClick: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-white/40 bg-white/60 p-4 shadow-md ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer backdrop-blur-xl"
    >
      <div
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl transition-opacity opacity-10 group-hover:opacity-30"
        style={{ backgroundColor: accent }}
      />

      <div className="relative mb-2 flex items-center justify-between">
        <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/80">
          {kit.useCase}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white/80 text-[9px] font-bold">
          {index + 1}
        </span>
      </div>

      <h3 className="relative mb-1.5 text-base font-display font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
        {kit.name}
      </h3>

      <div className="relative mb-3 space-y-1">
        {kit.bullets.slice(0, 3).map((bullet, i) => (
          <div key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground">
            <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <span className="line-clamp-1">{bullet}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-2 border-t border-border/40 pt-3">
        <div className="flex flex-col">
          <div className="text-[8px] font-bold uppercase text-muted-foreground/60">Бюджет</div>
          <div className="text-xs font-black text-foreground">
            {kit.budgetMin ? `от ${kit.budgetMin.toLocaleString('ru-RU')} ₽` : "По запросу"}
          </div>
        </div>
        <button className="flex h-8 items-center gap-1.5 rounded-lg border border-primary/20 bg-white px-3 text-[11px] font-bold text-foreground transition-all hover:bg-primary hover:text-white">
          Подробнее
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.article>
  );
}

function ExpandedKitModal({
  kit,
  model,
  onClose,
  onAdd
}: {
  kit: SolutionKit;
  model: ServicePageModel;
  onClose: () => void;
  onAdd: () => void;
}) {
  const includedItems = kit.includedItemCodes
    .map(code => {
      for (const section of model.catalog) {
        const item = section.items.find(i => i.itemCode === code);
        if (item) return item;
      }
      return null;
    })
    .filter((n): n is CatalogItem => n !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      <motion.div
        layoutId={`kit-${kit.id}`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-white/20 bg-white shadow-2xl flex flex-col"
      >
        {/* Header Decor */}
        <div
          className="absolute inset-x-0 top-0 h-64 opacity-10 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${model.theme.accent}, transparent)` }}
        />

        <div className="relative flex items-center justify-between border-b border-border/50 p-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Детали решения</span>
            <h3 className="text-2xl font-display font-black tracking-tight">{kit.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-muted-foreground transition-colors hover:bg-slate-200 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-widest text-primary">Что включено</div>
                <div className="grid gap-3">
                  {kit.bullets.map((bullet, i) => (
                    <div key={i} className="flex gap-3 rounded-2xl border border-border/50 bg-slate-50/50 p-4">
                      <CircleCheck className="h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm leading-relaxed text-foreground/80">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-border/50 bg-slate-50/50 p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Срок запуска</div>
                  <div className="text-xl font-black text-foreground">{kit.durationText}</div>
                </div>
                <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
                  <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Бюджет</div>
                  <div className="text-xl font-black text-primary">
                    {kit.budgetMin ? `${kit.budgetMin.toLocaleString('ru-RU')} ₽` : "По запросу"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-widest text-primary">Состав системы</div>
                <div className="space-y-2">
                  {includedItems.length > 0 ? (
                    includedItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-border/40 p-3 text-sm">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-muted-foreground">{formatCatalogItemPrice(item)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Состав уточняется специалистом при аудите</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900 p-6 text-white">
                <h4 className="mb-2 font-display font-bold">Готовое решение</h4>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Этот комплект содержит базовый набор оборудования и услуг. Вы можете добавить его в проект и позже скорректировать количество или выбрать другие модели в каталоге.
                </p>
                <button
                  onClick={onAdd}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Добавить в основной проект
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
