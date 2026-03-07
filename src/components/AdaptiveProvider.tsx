"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import {
  useAdaptivePerformance,
  PerformanceTier,
  setManualPerformanceTier,
} from "@/hooks/useAdaptivePerformance";

interface AdaptiveContextType {
  tier: PerformanceTier;
  isLite: boolean;
  score: number;
  setTier: (tier: PerformanceTier) => void;
}

const AdaptiveContext = createContext<AdaptiveContextType | undefined>(undefined);

export function AdaptiveProvider({ children }: { children: ReactNode }) {
  const perf = useAdaptivePerformance();

  const value = useMemo(
    () => ({
      tier: perf.tier,
      isLite: perf.tier === "lite",
      score: perf.score,
      setTier: setManualPerformanceTier,
    }),
    [perf.tier, perf.score],
  );

  return <AdaptiveContext.Provider value={value}>{children}</AdaptiveContext.Provider>;
}

export function usePerformanceTier() {
  const context = useContext(AdaptiveContext);
  if (context === undefined) {
    // Return a safe default for SSR / before provider initializes
    return { tier: "full" as PerformanceTier, isLite: false, score: 100, setTier: () => {} };
  }
  return context;
}
