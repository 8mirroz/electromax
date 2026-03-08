"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FocusTrap from "focus-trap-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

const NAV_ITEMS = [
  { label: "Услуги", href: "/#services" },
  { label: "Решения", href: "/solutions" },
  { label: "Проекты", href: "/projects" },
  { label: "База знаний", href: "/knowledge" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
  { label: "Лицензии", href: "/licenses" },
] as const;

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger Button - 44px touch target */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text-primary shadow-sm transition hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Открыть меню"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        ref={triggerRef}
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <FocusTrap
              active={isOpen}
              focusTrapOptions={{
                initialFocus: () => closeButtonRef.current ?? drawerRef.current ?? undefined,
                fallbackFocus: () => drawerRef.current ?? document.body,
                clickOutsideDeactivates: true,
                escapeDeactivates: true,
                onDeactivate: () => setIsOpen(false),
              }}
            >
              <motion.div
                id="mobile-nav-drawer"
                ref={drawerRef}
                tabIndex={-1}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", damping: 28, stiffness: 220 }
                }
                className="fixed right-0 top-0 z-50 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Мобильная навигация"
              >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                  <div onClick={() => setIsOpen(false)}>
                    <Logo />
                  </div>
                  <button
                    type="button"
                    ref={closeButtonRef}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary transition hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Закрыть меню"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="px-3 py-4" aria-label="Мобильная навигация">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-text-primary transition hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="h-5 w-5 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* CTA Section - Enhanced sticky call affordance */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-surface-secondary p-4">
                  {/* Phone block */}
                  <a
                    href="tel:+74951234567"
                    className="mb-3 flex items-center gap-3 rounded-xl bg-white p-4 border border-border shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-foreground">
                        +7 (495) 123-45-67
                      </div>
                      <div className="text-sm text-text-muted">Пн–Пт 09:00–20:00</div>
                    </div>
                  </a>

                  {/* Primary CTA */}
                  <Link
                    href="/contacts"
                    onClick={() => setIsOpen(false)}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]"
                  >
                    Получить консультацию
                  </Link>
                </div>
              </motion.div>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
