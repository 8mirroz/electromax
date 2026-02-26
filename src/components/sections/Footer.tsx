"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  const footerServices = [
    { title: "СКУД", href: "/services/skud" },
    { title: "СОТ", href: "/services/sot" },
    { title: "ОПС", href: "/services/aps" },
    { title: "СКС", href: "/services/sks" },
    { title: "ЭОМ", href: "/services/eom" },
    { title: "Техобслуживание", href: "/services/to" },
    { title: "Проектирование", href: "/services" },
    { title: "Пусконаладка", href: "/services" },
  ];

  const companyLinks = [
    { title: "О компании", href: "/about" },
    { title: "Проекты", href: "/projects" },
    { title: "Лицензии", href: "/licenses" },
    { title: "Контакты", href: "/contacts" },
  ];

  return (
    <footer className="bg-surface-secondary border-t border-border" role="contentinfo">
      <div className="container mx-auto max-w-7xl">
        {/* Main footer content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* Column 1: Logo & Description */}
            <div className="lg:col-span-4 space-y-5">
              <Logo />
              <p className="text-base leading-relaxed text-text-secondary max-w-xs">
                Комплексные инженерные решения для промышленной и коммерческой инфраструктуры.
                Проектирование, монтаж и техническая поддержка.
              </p>

              {/* Social/Telegram */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://t.me/electromax_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Написать в Telegram
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Column 2: Services */}
            <div className="lg:col-span-3 lg:col-start-6">
              <h4 className="text-sm font-semibold text-foreground mb-4">Услуги</h4>
              <ul className="space-y-3">
                {footerServices.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-base text-text-secondary hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-foreground mb-4">Компания</h4>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="text-base text-text-secondary hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-semibold text-foreground mb-4">Контакты</h4>
              <div className="space-y-4">
                <a href="tel:+74951234567" className="flex items-center gap-3 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-border">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      +7 (495) 123-45-67
                    </div>
                    <div className="text-sm text-text-muted">Пн–Пт 09:00–20:00</div>
                  </div>
                </a>

                <a href="mailto:info@electromax.ru" className="flex items-center gap-3 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-border">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    info@electromax.ru
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-border shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-base text-text-secondary">
                    Москва, ул. Индустриальная 42
                    <br />
                    БЦ «Технопарк», оф. 304
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-muted text-center md:text-left">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> ELECTROMAX. Все
              права защищены.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                Политика конфиденциальности
              </Link>
              <Link
                href="/terms"
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                Пользовательское соглашение
              </Link>
            </div>
          </div>
          <p className="mt-4 text-xs text-text-muted/85 text-center md:text-left">
            Сайт носит информационный характер и не является публичной офертой (ст. 437 ГК РФ).
          </p>
        </div>
      </div>
    </footer>
  );
}
