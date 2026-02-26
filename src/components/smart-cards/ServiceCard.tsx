"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CatalogItem } from "@/types";
import { formatCatalogItemPrice } from "@/lib/services-content";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

interface ServiceCardProps {
  item: CatalogItem & { sectionTitle: string };
  isActive: boolean;
  onClick: () => void;
}

export function ServiceCard({ item, isActive, onClick }: ServiceCardProps) {
  const { isLite } = usePerformanceTier();
  const prefersReduced = useReducedMotion();
  const noMotion = isLite || !!prefersReduced;

  return (
    <motion.div
      layoutId={`card-${item.id}`}
      className={`service-card ${isActive ? "active-card" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${item.name} — ${item.sectionTitle}. Нажмите для настройки`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      whileHover={!isActive && !noMotion ? { y: -8, scale: 1.02 } : {}}
      whileTap={!isActive && !noMotion ? { scale: 0.98 } : {}}
      transition={{ duration: noMotion ? 0 : 0.2, ease: "easeOut" }}
    >
      {/* Badge */}
      <div className="service-card-badge">{item.category || item.sectionTitle}</div>

      {/* Title */}
      <h3 className="service-card-title">{item.name}</h3>

      {/* Meta */}
      <div className="service-card-meta">
        <span className="service-card-unit">{item.unit}</span>
        <span className="service-card-code">{item.itemCode}</span>
      </div>

      {/* Price */}
      <div className="service-card-price">{formatCatalogItemPrice(item)}</div>

      {/* CTA Button */}
      <motion.button
        className="service-card-button"
        whileHover={!noMotion ? { scale: 1.05 } : {}}
        whileTap={!noMotion ? { scale: 0.95 } : {}}
        transition={{ duration: noMotion ? 0 : 0.2 }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Настроить
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-2 inline-block">
          <path
            d="M3 8H13M13 8L9 4M13 8L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
}
