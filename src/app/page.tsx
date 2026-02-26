"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { Hero } from "@/components/sections/Hero";
import { AuditSection } from "@/components/sections/AuditSection";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { usePerformanceTier } from "@/components/AdaptiveProvider";
import { PROJECTS_DB } from "@/data/projects";
import {
  ShieldCheck,
  FileCheck,
  Target,
  ArrowRight,
  Flame,
  Volume2,
  Video,
  DoorOpen,
  Cable,
  Zap,
  MapPin,
  Calendar,
} from "lucide-react";
import { RainbowButton } from "@/components/ui/RainbowButton";

const SERVICE_SHOWCASE_CARDS = [
  {
    id: "skud",
    title: "Контроль доступа",
    tag: "СКУД",
    href: "/services/skud",
    icon: DoorOpen,
    accent: "#22c55e",
    points: ["Турникеты и шлагбаумы", "Биометрические считыватели", "Учет рабочего времени"],
    price: "от 45 000 ₽",
  },
  {
    id: "sot",
    title: "Видеонаблюдение",
    tag: "СОТ",
    href: "/services/sot",
    icon: Video,
    accent: "#2563eb",
    points: ["IP и аналоговые системы", "Распознавание лиц и номеров", "Облачное хранение архива"],
    price: "от 32 000 ₽",
  },
  {
    id: "ops",
    title: "Пожарная сигнализация",
    tag: "ОПС",
    href: "/services/aps",
    icon: Flame,
    accent: "#ef4444",
    points: ["Датчики дыма и тепла", "Системы оповещения", "Проектирование по нормам"],
    price: "от 50 000 ₽",
  },
  {
    id: "project",
    title: "Проектирование",
    tag: "ПРОЕКТ",
    href: "/services",
    icon: FileCheck,
    accent: "#7c3aed",
    points: ["Разработка разделов ПС/СОУЭ/ЭОМ", "BIM-моделирование", "Исполнительная документация"],
    price: "от 35 000 ₽",
  },
  {
    id: "pnr",
    title: "Пусконаладка",
    tag: "ПНР",
    href: "/services",
    icon: Target,
    accent: "#f97316",
    points: ["Проверка сценариев", "Интеграция подсистем", "Тест аварийных режимов"],
    price: "от 20 000 ₽",
  },
  {
    id: "soue",
    title: "Система оповещения",
    tag: "СОУЭ",
    href: "/services/soue",
    icon: Volume2,
    accent: "#22c55e",
    points: ["Речевые и световые линии", "Зонирование по эвакуации", "Интеграция с ОПС"],
    price: "от 28 000 ₽",
  },
  {
    id: "sks",
    title: "Кабельные сети",
    tag: "СКС",
    href: "/services/sks",
    icon: Cable,
    accent: "#3b82f6",
    points: ["Серверные и кроссовые", "Оптика и медь", "Маркировка и тестирование"],
    price: "от 40 000 ₽",
  },
  {
    id: "eom",
    title: "Электроснабжение",
    tag: "ЭОМ",
    href: "/services/eom",
    icon: Zap,
    accent: "#f59e0b",
    points: ["Щитовое оборудование", "Силовые линии", "Расчет нагрузок по ПУЭ"],
    price: "от 65 000 ₽",
  },
  {
    id: "to",
    title: "Техобслуживание",
    tag: "ТО",
    href: "/services/to",
    icon: ShieldCheck,
    accent: "#f97316",
    points: ["Регламентные выезды", "Журнал ТО и отчеты", "Срочное устранение замечаний"],
    price: "от 15 000 ₽/мес",
  },
];

const TELEGRAM_CHAT_URL = "https://t.me/electromax_support";

// Animation variants
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// KPI Cards Section
// Services Section
function ServicesSection() {
  return (
    <section id="services" className="bg-surface-secondary/60 py-20 md:py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 md:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
            Направления работы
          </p>
          <h2 className="text-balance text-[clamp(1.85rem,3.2vw,2.6rem)] leading-[1.1] font-display font-black tracking-tight text-foreground">
            Инженерные системы под ключ
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Проектирование, монтаж и обслуживание комплексных решений для промышленных и
            коммерческих объектов.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_SHOWCASE_CARDS.map((service) => (
            <div key={service.id}>
              <Link href={service.href} className="block h-full">
                <article
                  className="group relative flex h-full flex-col rounded-2xl border border-gray-200/60 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
                  style={{ borderTopWidth: "3px", borderTopColor: service.accent }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${service.accent}15`,
                        color: service.accent,
                      }}
                    >
                      <service.icon className="h-5 w-5" />
                    </div>
                    <span
                      className="inline-flex items-center rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium"
                      style={{
                        color: service.accent,
                        backgroundColor: `${service.accent}10`,
                      }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-gray-900">{service.title}</h3>

                  <ul className="mt-3 space-y-1.5 text-sm text-gray-500">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: service.accent }}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5 text-sm">
                      <span className="text-gray-500">Стоимость</span>
                      <span className="font-medium text-gray-900">{service.price}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// Projects Section
function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isLite } = usePerformanceTier();
  const shouldReduceMotion = useReducedMotion() || isLite;

  const featuredProjects = PROJECTS_DB.slice(0, 4);

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={shouldReduceMotion ? undefined : fadeUpVariants}
          custom={0}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-surface-primary text-primary text-xs font-black uppercase tracking-[0.2em] border border-border mb-6">
              Портфолио
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-foreground">
              РЕАЛИЗОВАННЫЕ ПРОЕКТЫ
            </h2>
          </div>
          <Link
            href="/projects"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Все проекты
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={shouldReduceMotion ? undefined : staggerItem}>
              <Link href={`/projects`}>
                <div className="group relative overflow-hidden rounded-2xl bg-white border border-border hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-text-primary backdrop-blur-sm">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-text-muted mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" />
                        <span suppressHydrationWarning>{project.area.toLocaleString()}</span> м²
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {project.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Fixed CTA Button
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <ServicesSection />
        <AuditSection />
        <ProjectsSection />
        <Footer />
      </div>
    </main>
  );
}
