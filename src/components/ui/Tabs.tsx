"use client";

import { motion } from "framer-motion";
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

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="flex space-x-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl max-w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative flex-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                isActive
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
                tabClassName,
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
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
