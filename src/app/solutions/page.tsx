"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Cable,
  DoorOpen,
  FileCheck,
  Flame,
  Layers,
  Lightbulb,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Video,
  Volume2,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SolutionsGallery } from "@/components/smart-cards/SolutionsGallery";
import { QuizModal } from "@/components/ui/QuizModal";
import { SERVICES_DB } from "@/data/services";
import type { QuickStartCard } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  all: Layers,
  aps: Flame,
  soue: Volume2,
  sot: Video,
  os: ShieldCheck,
  skud: DoorOpen,
  sks: Cable,
  eom: Zap,
  eo: Lightbulb,
  to: BadgeCheck,
  ov: Wind,
  p: FileCheck,
  pnr: Target,
  custom: Sparkles,
};

const TAG_TEXT_OVERRIDES: Record<string, { shortName: string; title: string }> = {
  eom: { shortName: "ЭОМ", title: "Электро и силовые" },
  aps: { shortName: "АПС", title: "Пожарные системы" },
  eo: { shortName: "ЭО", title: "Системы освещения" },
  soue: { shortName: "СОУЭ", title: "Система оповещения" },
  sot: { shortName: "СОТ", title: "Системы видеонаблюдения" },
  ov: { shortName: "ОВ", title: "Системы вентиляции" },
  p: { shortName: "ПРОЕКТ", title: "Проектирование систем" },
  skud: { shortName: "СКУД", title: "Системы контроля" },
  sks: { shortName: "СКС", title: "Кабельные системы" },
  to: { shortName: "ТО", title: "Техническое обслуживание" },
  pnr: { shortName: "ПНР", title: "Настройка и запуск" },
};

const BASE_SERVICE_TAGS = Object.values(SERVICES_DB).map((service) => ({
  id: service.id,
  shortName: TAG_TEXT_OVERRIDES[service.id]?.shortName ?? service.shortName,
  title: TAG_TEXT_OVERRIDES[service.id]?.title ?? service.title,
}));

const SERVICE_TAGS = (() => {
  const tags = [{ id: "all", shortName: "Все", title: "Готовые решения" }, ...BASE_SERVICE_TAGS];
  const customTag = { id: "custom", shortName: "Под ключ", title: "Получить расчет" };
  const insertIndex = Math.min(7, tags.length);
  tags.splice(insertIndex, 0, customTag);
  return tags;
})();

const stripTrailingAbbreviation = (title: string) =>
  title
    .replace(/\s*\[[^\]]+\]\s*$/, "")
    .replace(/\s*\([^)]+\)\s*$/, "")
    .trim();

export default function SolutionsPage() {
  const [notification, setNotification] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [quizOpen, setQuizOpen] = useState(false);

  const handleAddToTray = (card: QuickStartCard, serviceSlug: string) => {
    setNotification(`"${card.title}" добавлено в проект-трей`);
    setTimeout(() => setNotification(null), 3000);

    console.log("Add to tray:", {
      cardId: card.id,
      cardTitle: card.title,
      serviceSlug,
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-surface-secondary/60 pt-32 pb-12 md:pt-40 md:pb-16">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(37,99,235,0.08),transparent_70%)]"
        />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-flex items-center rounded-full border border-border bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              Готовые решения
            </span>
            <h1 className="font-display text-3xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Галерея решений
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              Выберите готовое решение для вашей задачи. Вверху можно быстро отфильтровать
              направление и перейти к подходящим карточкам.
            </p>
          </motion.div>

          <div className="mt-12 mb-0 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7 md:mt-16 md:mb-0">
            {SERVICE_TAGS.map((service) => {
              const isAll = service.id === "all";
              const isCustom = service.id === "custom";
              const isActive = activeFilter === service.id;
              const Icon = ICON_MAP[service.id] || Settings2;

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    if (service.id === "custom") {
                      setQuizOpen(true);
                    } else {
                      setActiveFilter(service.id);
                    }
                  }}
                  className={`flex h-[80px] items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary text-white shadow-[0_16px_34px_-28px_rgba(37,99,235,0.6)]"
                      : isAll
                        ? "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-300 shadow-sm"
                        : isCustom
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 shadow-sm"
                          : "border-border bg-white text-foreground shadow-[0_16px_34px_-28px_rgba(15,23,42,0.25)] hover:border-primary/60 hover:shadow-md"
                  }`}
                >
                  <div className="mr-2 flex min-w-0 flex-1 flex-col justify-center">
                    <p
                      className={`truncate text-sm font-black leading-tight ${isActive ? "text-white" : "text-foreground"}`}
                    >
                      {service.shortName}
                    </p>
                    <p
                      className={`mt-0.5 min-h-[2.4em] line-clamp-2 text-[10px] font-semibold lowercase first-letter:uppercase leading-snug tracking-tight opacity-70 ${
                        isActive ? "text-white/80" : "text-text-muted"
                      }`}
                    >
                      {stripTrailingAbbreviation(service.title)}
                    </p>
                  </div>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isAll
                          ? "bg-blue-100 text-blue-700"
                          : isCustom
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <SolutionsGallery
        services={SERVICES_DB}
        onAddToTray={handleAddToTray}
        activeFilter={activeFilter}
      />

      {notification ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground px-6 py-4 text-sm font-semibold text-background shadow-lg"
        >
          {notification}
        </motion.div>
      ) : null}

      {quizOpen ? <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} /> : null}

      <Footer />
    </main>
  );
}
