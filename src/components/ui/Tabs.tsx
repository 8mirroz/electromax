"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeTabId?: string;
  onChange?: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export function AnimatedTabs({
  tabs,
  activeTabId,
  onChange,
  className,
  tabClassName,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(activeTabId || tabs[0]?.id);
  const shouldReduceMotion = useReducedMotion();

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="flex max-w-fit items-center gap-1.5 rounded-full border border-white/60 bg-white/60 p-2 shadow-[0_1px_0_rgba(255,255,255,0.75)_inset,0_14px_26px_-20px_rgba(15,23,42,0.24)] backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative flex-1 rounded-full px-5 py-3 text-sm font-semibold tracking-tight transition-[color,transform,box-shadow,background-color] duration-200 hover:-translate-y-[1px]",
                isActive
                  ? "text-neutral-950"
                  : "text-neutral-500 hover:bg-white/35 hover:text-neutral-800",
                tabClassName,
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,252,0.92))] shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_-10px_14px_-16px_rgba(15,23,42,0.16)_inset,0_10px_18px_-16px_rgba(15,23,42,0.22)]"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: shouldReduceMotion ? 0 : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration-slow')) || 0.6,
                  }}
                />
              )}
              {isActive && (
                <span className="pointer-events-none absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.85),transparent_58%)]" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4">{tabs.find((t) => t.id === activeTab)?.content}</div>
    </div>
  );
}
