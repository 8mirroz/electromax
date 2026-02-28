"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QuickStartCard } from "./QuickStartCard";
import type { QuickStartCard as QuickStartCardType, ServiceConfig } from "@/types";

interface SolutionsGalleryProps {
  services: Record<string, ServiceConfig>;
  onAddToTray?: (card: QuickStartCardType, serviceSlug: string) => void;
  activeFilter?: string;
}

type FilterType = "all" | string;

const TAG_STYLES: Record<string, { label: string; accent: string }> = {
  skud: { label: "СКУД", accent: "#22c55e" },
  sot: { label: "СОТ", accent: "#2563eb" },
  aps: { label: "АПС", accent: "#ef4444" },
  soue: { label: "СОУЭ", accent: "#22c55e" },
  sks: { label: "СКС", accent: "#3b82f6" },
  eom: { label: "ЭОМ", accent: "#f59e0b" },
  eo: { label: "ЭО", accent: "#f59e0b" },
  os: { label: "ОС", accent: "#2563eb" },
  to: { label: "ТО", accent: "#f97316" },
};

const stripTrailingAbbreviation = (title: string) =>
  title
    .replace(/\s*\[[^\]]+\]\s*$/, "")
    .replace(/\s*\([^)]+\)\s*$/, "")
    .trim();

const toSentenceCase = (value: string) => {
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export function SolutionsGallery({ services, onAddToTray, activeFilter }: SolutionsGalleryProps) {
  const filter: FilterType = activeFilter ?? "all";

  const allCards = useMemo(() => {
    const cards: Array<{
      card: QuickStartCardType;
      serviceSlug: string;
      serviceTitle: string;
    }> = [];

    Object.values(services).forEach((service) => {
      if (service.quickStartCards) {
        service.quickStartCards.forEach((card) => {
          cards.push({
            card,
            serviceSlug: service.id,
            serviceTitle: service.title,
          });
        });
      }
    });

    return cards;
  }, [services]);

  const filteredCards = useMemo(() => {
    if (filter === "all") return allCards;
    return allCards.filter(({ serviceSlug }) => serviceSlug === filter);
  }, [allCards, filter]);

  const sortedCards = useMemo(() => {
    const cards = [...filteredCards];
    return cards.sort((a, b) => {
      if (a.card.featured && !b.card.featured) return -1;
      if (!a.card.featured && b.card.featured) return 1;
      return 0;
    });
  }, [filteredCards]);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {filter !== "all" ? (
          <>
            <div className="mb-8 flex items-center gap-4">
              <h3 className="text-3xl md:text-4xl font-display font-black text-foreground">
                {toSentenceCase(stripTrailingAbbreviation(services[filter]?.title ?? "Раздел"))}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              {TAG_STYLES[filter] && (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight"
                  style={{
                    color: TAG_STYLES[filter].accent,
                    backgroundColor: `${TAG_STYLES[filter].accent}15`,
                    border: `1px solid ${TAG_STYLES[filter].accent}33`,
                  }}
                >
                  {TAG_STYLES[filter].label.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                </span>
              )}
            </div>
            {sortedCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center"
              >
                <p className="text-muted-foreground">В данном разделе пока нет быстрых решений.</p>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          </>
        ) : (
          <div className="space-y-16">
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
                  <div className="mb-8 flex items-center gap-4">
                    <h3 className="text-3xl md:text-4xl font-display font-black text-foreground">
                      {toSentenceCase(stripTrailingAbbreviation(service.title))}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                    {TAG_STYLES[service.id] && (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight"
                        style={{
                          color: TAG_STYLES[service.id].accent,
                          backgroundColor: `${TAG_STYLES[service.id].accent}15`,
                          border: `1px solid ${TAG_STYLES[service.id].accent}33`,
                        }}
                      >
                        {TAG_STYLES[service.id].label
                          .toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </span>
                    )}
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
