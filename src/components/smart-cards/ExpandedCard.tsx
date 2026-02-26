"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { CatalogItem } from "@/types";
import { SERVICE_CONFIGS, getServiceType, calculatePrice } from "./config";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

interface ExpandedCardProps {
  item: CatalogItem & { sectionTitle: string };
  onClose: () => void;
  onAddItem: (
    item: CatalogItem,
    options?: Record<string, string>,
    calculatedPrice?: { min: number; max: number },
  ) => void;
}

export function ExpandedCard({ item, onClose, onAddItem }: ExpandedCardProps) {
  const { isLite } = usePerformanceTier();
  const prefersReduced = useReducedMotion();
  const noMotion = isLite || !!prefersReduced;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const serviceType = getServiceType(item.name);
  const configs = SERVICE_CONFIGS[serviceType] || SERVICE_CONFIGS.default;

  const calculatedPrice = useMemo(() => {
    return calculatePrice(item, selectedOptions, configs);
  }, [selectedOptions, item, configs]);

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const handleAddToProject = () => {
    onAddItem(item, selectedOptions, calculatedPrice || undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <motion.div
      ref={overlayRef}
      className="expanded-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: noMotion ? 0 : 0.3 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        layoutId={`card-${item.id}`}
        className="expanded-card"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: noMotion ? 0 : 0.4, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="expanded-close-btn" onClick={onClose} aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="expanded-header">
          <span className="expanded-badge">{item.category || item.sectionTitle}</span>
          <h2 className="expanded-title">{item.name}</h2>
          <p className="expanded-code">Код: {item.itemCode}</p>
        </div>

        {/* Configuration Grid */}
        <div className="expanded-config">
          <h3 className="expanded-config-title">Конфигурация под объект</h3>
          <div className="expanded-config-grid">
            {configs.map((config, index) => (
              <motion.div
                key={config.id}
                className="config-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * (noMotion ? 0 : 0.06), duration: noMotion ? 0 : 0.3 }}
              >
                <label className="config-label">{config.label}</label>
                {config.type === "input" ? (
                  <input
                    type="text"
                    placeholder={config.placeholder}
                    value={selectedOptions[config.id] || ""}
                    onChange={(e) => handleOptionChange(config.id, e.target.value)}
                    className="config-input"
                  />
                ) : (
                  <div className="config-segmented">
                    {config.options?.map((option) => (
                      <button
                        key={option}
                        className={`config-segment ${
                          selectedOptions[config.id] === option ? "active" : ""
                        }`}
                        onClick={() => handleOptionChange(config.id, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Sections */}
        <div className="expanded-info">
          {(item.includes?.length ?? 0) > 0 && (
            <div className="info-section">
              <h4 className="info-title">Что включено</h4>
              <ul className="info-list">
                {item.includes?.map((entry) => (
                  <li key={entry} className="info-item included">
                    <span className="info-dot included" />
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(item.excludes?.length ?? 0) > 0 && (
            <div className="info-section">
              <h4 className="info-title">Что не включено</h4>
              <ul className="info-list">
                {item.excludes?.map((entry) => (
                  <li key={entry} className="info-item excluded">
                    <span className="info-dot excluded" />
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer with Price and CTA */}
        <div className="expanded-footer">
          <div className="expanded-price-block">
            <span className="expanded-price-label">Итоговая стоимость</span>
            <AnimatePresence mode="wait">
              {calculatedPrice && (
                <motion.div
                  key={`${calculatedPrice.min}-${calculatedPrice.max}`}
                  className="expanded-price-value"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: noMotion ? 0 : 0.2 }}
                >
                  {calculatedPrice.min === calculatedPrice.max
                    ? `${calculatedPrice.min.toLocaleString("ru-RU")} ₽`
                    : `${calculatedPrice.min.toLocaleString("ru-RU")} – ${calculatedPrice.max.toLocaleString("ru-RU")} ₽`}
                </motion.div>
              )}
            </AnimatePresence>
            {item.leadTimeText && <span className="expanded-timeline">{item.leadTimeText}</span>}
          </div>

          <motion.button
            className={`expanded-cta ${isAdded ? "success" : ""}`}
            onClick={handleAddToProject}
            whileHover={!noMotion ? { scale: 1.02 } : {}}
            whileTap={!noMotion ? { scale: 0.98 } : {}}
            disabled={isAdded}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: noMotion ? 0 : 0.2 }}
                >
                  Добавлено ✓
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: noMotion ? 0 : 0.2 }}
                >
                  Добавить в проект
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
