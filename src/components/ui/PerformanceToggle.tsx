"use client";

import { usePerformanceTier } from "@/components/AdaptiveProvider";
import { setManualPerformanceTier } from "@/hooks/useAdaptivePerformance";
import { Cpu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function PerformanceToggle() {
  const { tier, isLite } = usePerformanceTier();

  const toggleTier = () => {
    const nextTier = tier === "full" ? "lite" : "full";
    setManualPerformanceTier(nextTier);
  };

  return (
    <button
      onClick={toggleTier}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
        isLite
          ? "bg-surface-secondary border-border text-text-muted hover:border-primary/30 hover:text-primary"
          : "bg-white border-border text-text-primary hover:border-primary/30 hover:text-primary shadow-sm",
      )}
      title={isLite ? "Включить полный режим" : "Включить производительный режим"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={tier}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isLite ? (
            <Cpu className="h-4 w-4" />
          ) : (
            <Zap className="h-4 w-4 fill-primary/10 text-primary" />
          )}
        </motion.div>
      </AnimatePresence>

      {!isLite && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      )}
    </button>
  );
}
