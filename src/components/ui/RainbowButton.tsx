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
          "group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6",
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
        "group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6",
        "text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(47,91,255,0.4)] transition-all duration-200",
        "hover:bg-primary/90 hover:shadow-[0_6px_20px_-4px_rgba(47,91,255,0.5)]",
        "active:scale-[0.98] active:bg-primary/95",
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
