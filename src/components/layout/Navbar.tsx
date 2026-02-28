"use client";

import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/ui/MobileNav";
import { Phone, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readProjectTrayState } from "@/lib/project-tray";

export function Navbar() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Basic sync from localStorage
    const updateCount = () => {
      const state = readProjectTrayState(window.localStorage);
      setItemCount(state?.items.length || 0);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    // Custom event if needed for same-window updates
    window.addEventListener("project-tray-updated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("project-tray-updated", updateCount);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Услуги", href: "/#services" },
            { label: "Решения", href: "/solutions" },
            { label: "Проекты", href: "/projects" },
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
            className="hidden lg:flex items-center gap-2 text-[15px] font-medium text-text-secondary hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="tabular-nums">+7 (495) 123-45-67</span>
          </a>

          <Link
            href="/contacts"
            className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-lg bg-primary text-[15px] font-medium text-white hover:bg-primary/90 transition-colors"
          >
            ПРОЕКТ
          </Link>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
