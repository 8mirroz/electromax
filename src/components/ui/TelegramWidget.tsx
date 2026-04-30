"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function TelegramWidget() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://t.me/onedim_support"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-full border-2 border-[#24A1DE] bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#24A1DE] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1 hover:border-[#24A1DE] hover:bg-[#24A1DE] hover:text-white hover:shadow-[0_15px_40px_-10px_rgba(36,161,222,0.5)] group",
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-10 opacity-0 scale-90 pointer-events-none",
      )}
      aria-label="Обсудить в Telegram"
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <svg
          className="h-full w-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      </div>
      <span className="hidden sm:inline">ОБСУДИТЬ В TELEGRAM</span>
    </a>
  );
}
