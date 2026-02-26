"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QuickStartCard } from "./QuickStartCard";
import type { QuickStartCard as QuickStartCardType, ServiceConfig } from "@/types";

interface SolutionsGalleryProps {
  services: Record<string, ServiceConfig>;
  onAddToTray?: (card: QuickStartCardType, serviceSlug: string) => void;
}

type FilterType = "all" | string;

export function SolutionsGallery({ services, onAddToTray }: SolutionsGalleryProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"featured" | "difficulty" | "budget">("featured");

  // Extract all quick start cards from services with their service context
  const allCards = useMemo(() => {
    const cards: Array<{
      card: QuickStartCardType;
      serviceSlug: string;
      serviceTitle: string;
      serviceShortName: string;
    }> = [];

    Object.values(services).forEach((service) => {
      if (service.quickStartCards) {
        service.quickStartCards.forEach((card) => {
          cards.push({
            card,
            serviceSlug: service.id,
            serviceTitle: service.title,
            serviceShortName: service.shortName,
          });
        });
      }
    });

    return cards;
  }, [services]);

  // Filter cards
  const filteredCards = useMemo(() => {
    if (filter === "all") return allCards;
    return allCards.filter(({ serviceSlug }) => serviceSlug === filter);
  }, [allCards, filter]);

  // Sort cards
  const sortedCards = useMemo(() => {
    const cards = [...filteredCards];

    switch (sortBy) {
      case "featured":
        return cards.sort((a, b) => {
          if (a.card.featured && !b.card.featured) return -1;
          if (!a.card.featured && b.card.featured) return 1;
          return 0;
        });
      case "difficulty":
        const difficultyOrder = { easy: 0, medium: 1, complex: 2 };
        return cards.sort(
          (a, b) => difficultyOrder[a.card.difficulty] - difficultyOrder[b.card.difficulty],
        );
      case "budget":
        return cards.sort((a, b) => (a.card.budgetFrom ?? 0) - (b.card.budgetFrom ?? 0));
      default:
        return cards;
    }
  }, [filteredCards, sortBy]);

  // Get unique service slugs for filter
  const serviceFilters = useMemo(() => {
    return [
      { id: "all", label: "Все решения", shortName: "Все" },
      ...Object.values(services).map((service) => ({
        id: service.id,
        label: service.title,
        shortName: service.shortName,
      })),
    ];
  }, [services]);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="text-2xl font-display font-black uppercase tracking-tight md:text-4xl">
            Галерея быстрых решений
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Готовые решения для различных задач. Выберите подходящее и добавьте в проект-трей для
            детального расчета.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-4 md:mb-8"
        >
          {/* Service Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {serviceFilters.map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === item.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white/80 text-foreground hover:bg-white"
                }`}
              >
                {item.shortName}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Сортировать:
            </span>
            <button
              onClick={() => setSortBy("featured")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                sortBy === "featured"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Популярные
            </button>
            <button
              onClick={() => setSortBy("difficulty")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                sortBy === "difficulty"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              По сложности
            </button>
            <button
              onClick={() => setSortBy("budget")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                sortBy === "budget"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              По бюджету
            </button>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {sortedCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center"
          >
            <p className="text-muted-foreground">
              В данном разделе пока нет быстрых решений.
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {sortedCards.map(({ card, serviceSlug, serviceTitle }) => (
                <QuickStartCard
                  key={card.id}
                  card={card}
                  serviceSlug={serviceSlug}
                  serviceTitle={serviceTitle}
                  onAddToTray={onAddToTray}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Section Dividers with Headings */}
        {filter === "all" && (
          <div className="mt-12 space-y-12">
            {Object.values(services).map((service) => {
              const serviceCards = service.quickStartCards ?? [];
              if (serviceCards.length === 0) return null;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <h3 className="text-xl font-display font-black uppercase tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {serviceCards.map((card) => (
                      <QuickStartCard
                        key={card.id}
                        card={card}
                        serviceSlug={service.id}
                        serviceTitle={service.title}
                        onAddToTray={onAddToTray}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
