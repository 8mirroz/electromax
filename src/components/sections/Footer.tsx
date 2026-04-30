"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  const securityServices = [
    { title: "Видеонаблюдение", abbr: "СОТ", href: "/services/sot" },
    { title: "Контроль доступа", abbr: "СКУД", href: "/services/skud" },
    { title: "Пожарная сигнализация", abbr: "АПС", href: "/services/aps" },
    { title: "Охранная сигнализация", abbr: "ОС", href: "/services/os" },
    { title: "Система оповещения", abbr: "СОУЭ", href: "/services/soue" },
  ];

  const engineeringServices = [
    { title: "Электроснабжение", abbr: "ЭОМ", href: "/services/eom" },
    { title: "Освещение", abbr: "ЭО", href: "/services/eo" },
    { title: "Вентиляция", abbr: "ОВ", href: "/services/ov" },
    { title: "Кабельные системы", abbr: "СКС", href: "/services/sks" },
    { title: "Проектирование", abbr: "ПРОЕКТ", href: "/services/p" },
    { title: "Пусконаладка", abbr: "ПНР", href: "/services/pnr" },
    { title: "Техобслуживание", abbr: "ТО", href: "/services/to" },
  ];

  const companyLinks = [
    { title: "О компании", href: "/about" },
    { title: "Портфолио", href: "/projects" },
    { title: "Наши лицензии", href: "/licenses" },
    { title: "Контакты", href: "/contacts" },
  ];

  return (
    <footer
      className="relative overflow-hidden bg-slate-950 pt-20 pb-10 text-slate-300"
      role="contentinfo"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_top,rgba(37,99,235,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-16">
          {/* Column 1: Info & Contact CTA */}
          <div className="lg:col-span-3 space-y-8">
            <div className="invert brightness-0">
              <Logo />
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Интеллектуальный архитектор инженерных систем. Проектирование, монтаж и техническая
              поддержка комплексов безопасности и электрики для промышленных объектов.
            </p>

            <div className="space-y-4 pt-4">
              <a
                href="https://t.me/onedim_support"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-11 inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-[#24A1DE] bg-white px-8 text-[14px] font-bold tracking-tight text-[#24A1DE] transition-all duration-[var(--duration-normal)] hover:bg-[#24A1DE] hover:text-white hover:shadow-[0_10px_30px_-5px_rgba(36,161,222,0.4)] active:scale-95"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-[var(--duration-normal)] group-hover:scale-110 group-hover:rotate-12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Обсудить в Telegram
              </a>
            </div>
          </div>

          {/* Column 2: Security Services */}
          <div className="lg:col-span-2 lg:col-start-5">
            <h4 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase mb-8">
              Безопасность
            </h4>
            <ul className="space-y-4">
              {securityServices.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-[var(--duration-fast)]"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-blue-500 transition-all duration-[var(--duration-normal)]" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Engineering Services */}
          <div className="lg:col-span-2 lg:col-start-8">
            <h4 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase mb-8">
              Инженерия
            </h4>
            <ul className="space-y-4">
              {engineeringServices.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-[var(--duration-fast)]"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 text-blue-500 transition-all duration-[var(--duration-normal)]" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company & Contacts */}
          <div className="lg:col-span-2 lg:col-start-11">
            <h4 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase mb-8">
              Компания
            </h4>
            <ul className="space-y-4 mb-8 border-b border-white/10 pb-8">
              {companyLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-5">
              <a href="tel:+74951234567" className="group flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50 border border-slate-700/50 group-hover:bg-blue-900/30 group-hover:border-blue-500/30 transition-all duration-[var(--duration-normal)]">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-[var(--duration-fast)]">
                    +7 (495) 123-45-67
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Пн–Пт 09:00–20:00</div>
                </div>
              </a>

              <a href="mailto:info@onedim.ru" className="group flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50 border border-slate-700/50 group-hover:bg-blue-900/30 group-hover:border-blue-500/30 transition-all duration-[var(--duration-normal)]">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-[var(--duration-fast)]">
                  info@onedim.ru
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50 border border-slate-700/50 shrink-0">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-sm text-slate-400 leading-relaxed pt-1.5">
                  Москва, ул. Индустриальная 42
                  <br />
                  БЦ «Технопарк», оф. 304
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <p className="text-xs text-slate-500">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> ONEDIM. Все права
            защищены. <br className="hidden md:block" />
            Сайт носит информационный характер и не является публичной офертой.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
