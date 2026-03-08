"use client";

import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/ui/MobileNav";
import { Phone } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex h-16 w-[min(1280px,calc(100%-2rem))] items-center justify-between sm:w-[min(1280px,calc(100%-3rem))]">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Основная навигация">
          {[
            { label: "Услуги", href: "/#services" },
            { label: "Решения", href: "/solutions" },
            { label: "Проекты", href: "/projects" },
            { label: "База знаний", href: "/knowledge" },
            { label: "О компании", href: "/about" },
            { label: "Контакты", href: "/contacts" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-[15px] font-medium text-text-secondary hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+74951234567"
            className="hidden lg:flex items-center gap-2 text-[17px] font-bold text-text-primary hover:text-primary transition-colors mr-6"
          >
            <Phone className="h-5 w-5 text-primary" />
            <span className="tabular-nums">+7 (495) 123-45-67</span>
          </a>

          <a
            href="https://t.me/electromax_support"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center justify-center w-11 h-11 rounded-full bg-slate-100 text-[#24A1DE] hover:bg-[#24A1DE] hover:text-white transition-all duration-[var(--duration-normal)]"
            aria-label="Telegram"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>

          <button
            type="button"
            onClick={() => {
              const event = new CustomEvent("open-project-tray", { cancelable: true });
              window.dispatchEvent(event);
              if (!event.defaultPrevented) {
                window.location.href = "/contacts";
              }
            }}
            className="hidden sm:inline-flex items-center justify-center h-11 px-6 rounded-2xl bg-primary text-[14px] font-bold uppercase tracking-wider text-white hover:bg-primary/90 transition-all active:scale-95"
          >
            ПРОЕКТ
          </button>

          {/* Mobile Navigation - Always rendered for mobile users */}
          <div className="md:hidden" aria-label="Мобильная навигация">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
