"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function RainbowButton({
  children,
  className,
  variant = "primary",
  ...props
}: RainbowButtonProps) {
  if (variant === "secondary") {
    return (
      <button
        className={cn(
          "group inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-6",
          "text-sm font-semibold text-text-primary transition-all duration-200",
          "hover:border-primary/30 hover:bg-surface-secondary hover:text-primary",
          "active:scale-[0.98] active:bg-surface-secondary",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4",
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
        "font-bold uppercase tracking-wider text-sm",
        "shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4),0_8px_40px_-8px_rgba(79,70,229,0.3)]",
        "hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.5),0_12px_50px_-8px_rgba(79,70,229,0.35)]",
        "hover:-translate-y-0.5",
        "active:scale-[0.98]",
        "transition-all",
        "duration-[var(--duration-normal)]",
        "ease-[var(--ease-enter)]",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)]" />
    </button>
  );
}
