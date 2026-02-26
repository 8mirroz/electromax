"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { AnimatePresence } from "motion/react";
import { ServiceCard } from "./ServiceCard";
import { ExpandedCard } from "./ExpandedCard";
import type { CatalogItem, ServiceCatalogSection } from "@/types";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

gsap.registerPlugin(Flip);

interface ServiceCardsSectionProps {
  sections: ServiceCatalogSection[];
  onAddItem: (
    item: CatalogItem,
    options?: Record<string, string>,
    calculatedPrice?: { min: number; max: number },
  ) => void;
}

export function ServiceCardsSection({ sections, onAddItem }: ServiceCardsSectionProps) {
  const { isLite } = usePerformanceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const allItems = sections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      sectionTitle: section.title,
      sectionId: section.id,
    })),
  );

  const filteredItems =
    filter === "all" ? allItems : allItems.filter((item) => item.sectionId === filter);

  const openCard = useCallback(
    (id: string) => {
      if (isAnimating || activeId === id) return;
      setIsAnimating(true);

      const state = Flip.getState(".service-card");

      // Animate other cards (skip in lite mode)
      if (!isLite) {
        gsap.to(".service-card:not(.active-card)", {
          opacity: 0.3,
          scale: 0.96,
          filter: "blur(2px)",
          stagger: 0.03,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      setActiveId(id);

      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: isLite ? 0 : 0.6,
          ease: isLite ? "none" : "power3.inOut",
          absolute: true,
          onComplete: () => setIsAnimating(false),
        });
      });

      document.body.style.overflow = "hidden";
    },
    [isAnimating, activeId, isLite],
  );

  const closeCard = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const state = Flip.getState(".service-card");

    setActiveId(null);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: isLite ? 0 : 0.5,
        ease: isLite ? "none" : "power3.inOut",
        absolute: true,
        onComplete: () => {
          setIsAnimating(false);
          if (!isLite) {
            gsap.to(".service-card", {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.3,
              clearProps: "all",
            });
          }
        },
      });
    });

    document.body.style.overflow = "";
  }, [isAnimating, isLite]);

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCard();
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [closeCard]);

  const activeItem = allItems.find((item) => item.id === activeId);

  return (
    <section ref={containerRef} className="service-cards-section">
      {/* Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-card text-foreground hover:bg-surface-secondary border border-border"
          }`}
        >
          Все услуги
        </button>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setFilter(section.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === section.id
                ? "bg-primary text-white"
                : "bg-card text-foreground hover:bg-surface-secondary border border-border"
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className={`service-cards-grid ${activeId ? "has-active" : ""}`}>
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <ServiceCard
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={() => openCard(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Expanded Card Overlay */}
      <AnimatePresence>
        {activeId && activeItem && (
          <ExpandedCard item={activeItem} onClose={closeCard} onAddItem={onAddItem} />
        )}
      </AnimatePresence>
    </section>
  );
}
