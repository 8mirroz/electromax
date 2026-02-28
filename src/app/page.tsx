"use client";

import { useRef } from "react";
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
  Lightbulb,
  Wind,
  Cpu,
} from "lucide-react";

const SERVICE_SHOWCASE_CARDS = [
  {
    id: "skud",
    title: "Контроль доступа",
    subtitle: "СКУД",
    tag: "СКУД",
    href: "/services/skud",
    icon: DoorOpen,
    accent: "#16a34a",
    points: [
      "Турникеты и шлагбаумы",
      "Биометрические считыватели",
      "Учет рабочего времени",
      "Карты и мобильные пропуска",
    ],
    price: "от 45 000 ₽",
    timeline: "1-3 дня",
  },
  {
    id: "sot",
    title: "Видеонаблюдение",
    subtitle: "СОТ",
    tag: "СОТ",
    href: "/services/sot",
    icon: Video,
    accent: "#2563eb",
    points: [
      "IP и аналоговые системы",
      "Распознавание лиц и номеров",
      "Облачное хранение архива",
      "Мобильный доступ",
    ],
    price: "от 32 000 ₽",
    timeline: "2-4 дня",
  },
  {
    id: "ops",
    title: "Пожарная сигнализация",
    subtitle: "ОПС",
    tag: "ОПС",
    href: "/services/aps",
    icon: Flame,
    accent: "#dc2626",
    points: [
      "Датчики дыма и тепла",
      "Адресные системы",
      "Проектирование по СНиП",
      "Согласование с МЧС",
    ],
    price: "от 50 000 ₽",
    timeline: "3-7 дней",
  },
  {
    id: "project",
    title: "Проектирование",
    subtitle: "ПРОЕКТ",
    tag: "ПРОЕКТ",
    href: "/services/p",
    icon: FileCheck,
    accent: "#7c3aed",
    points: [
      "Разделы ПС/СОУЭ/ЭОМ",
      "BIM-моделирование",
      "Исполнительная документация",
      "Согласование экспертизы",
    ],
    price: "от 35 000 ₽",
    timeline: "5-14 дней",
  },
  {
    id: "pnr",
    title: "Пусконаладка",
    subtitle: "ПНР",
    tag: "ПНР",
    href: "/services/pnr",
    icon: Target,
    accent: "#ea580c",
    points: [
      "Проверка сценариев",
      "Интеграция подсистем",
      "Тест аварийных режимов",
      "Обучение персонала",
    ],
    price: "от 20 000 ₽",
    timeline: "1-5 дней",
  },
  {
    id: "soue",
    title: "Система оповещения",
    subtitle: "СОУЭ",
    tag: "СОУЭ",
    href: "/services/soue",
    icon: Volume2,
    accent: "#16a34a",
    points: ["Речевые линии", "Световые табло", "Зонирование эвакуации", "Интеграция с ОПС"],
    price: "от 28 000 ₽",
    timeline: "2-5 дней",
  },
  {
    id: "sks",
    title: "Сети СКС",
    subtitle: "СКС",
    tag: "СКС",
    href: "/services/sks",
    icon: Cable,
    accent: "#2563eb",
    points: ["Локальные сети", "Серверные шкафы", "Оптоволоконные линии", "Тестирование линий"],
    price: "от 40 000 ₽",
    timeline: "1-7 дней",
  },
  {
    id: "eom",
    title: "Электроснабжение",
    subtitle: "ЭОМ",
    tag: "ЭОМ",
    href: "/services/eom",
    icon: Zap,
    accent: "#d97706",
    points: ["Электрощиты", "Силовые линии", "Заземление", "Резервное питание"],
    price: "от 65 000 ₽",
    timeline: "2-14 дней",
  },
  {
    id: "to",
    title: "Техобслуживание",
    subtitle: "ТО",
    tag: "ТО",
    href: "/services/to",
    icon: ShieldCheck,
    accent: "#ea580c",
    points: ["Регламентные выезды", "Журнал ТО", "Срочный ремонт", "Поддержка 24/7"],
    price: "от 15 000 ₽/мес",
    timeline: "по договору",
  },
  {
    id: "lighting",
    title: "Освещение",
    subtitle: "СО",
    tag: "СО",
    href: "/services/eo",
    icon: Lightbulb,
    accent: "#f59e0b",
    points: ["LED-светильники", "Аварийное освещение", "Датчики движения", "Умный свет"],
    price: "от 25 000 ₽",
    timeline: "1-5 дней",
  },
  {
    id: "ventilation",
    title: "Вентиляция",
    subtitle: "ОВ",
    tag: "ОВ",
    href: "/services/ov",
    icon: Wind,
    accent: "#06b6d4",
    points: ["Приточно-вытяжные системы", "Воздуховоды", "Фильтры и очистка", "Шумоизоляция"],
    price: "от 55 000 ₽",
    timeline: "3-10 дней",
  },
  {
    id: "automation",
    title: "Автоматизация",
    subtitle: "АСУ",
    tag: "АСУ",
    href: "/services/asuz",
    icon: Cpu,
    accent: "#8b5cf6",
    points: [
      "Умный дом и офис",
      "Сценарии управления",
      "Датчики и контроллеры",
      "Интеграция систем",
    ],
    price: "от 80 000 ₽",
    timeline: "5-21 дня",
  },
];

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      id="services"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 py-24 md:py-32"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-200/20 rounded-full blur-2xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 text-blue-700 text-sm font-semibold mb-5">
                Полный спектр услуг
              </div>
              <h2 className="text-balance text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-display font-black tracking-tight text-slate-900 mb-4">
                Инженерные системы
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  под ключ
                </span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Проектирование, монтаж и обслуживание комплексных решений безопасности для
                промышленных и коммерческих объектов любой сложности.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Лицензия МЧС</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>15+ лет опыта</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_SHOWCASE_CARDS.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
            >
              <Link href={service.href} className="block h-full group">
                <article
                  className="relative flex h-full flex-col rounded-2xl border-2 border-slate-100 bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] will-change-transform overflow-hidden"
                  style={{
                    boxShadow: `0 2px 12px -2px ${service.accent}10`,
                  }}
                >
                  {/* Top accent line - rounded bar */}
                  <div
                    className="absolute top-0 left-4 right-4 h-1 rounded-full transition-all duration-300 group-hover:h-1.5"
                    style={{ backgroundColor: service.accent }}
                  />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: `${service.accent}15`,
                        color: service.accent,
                      }}
                    >
                      <service.icon className="h-5 w-5" />
                    </div>
                    <span
                      className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-bold uppercase tracking-wider"
                      style={{
                        color: service.accent,
                        backgroundColor: `${service.accent}12`,
                      }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{service.title}</h3>

                  {/* Points - single line */}
                  <ul className="flex-1 space-y-1.5 mb-4">
                    {service.points.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: service.accent }}
                        />
                        <span className="truncate">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer with price and timeline */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[8px]">
                          ⏱
                        </span>
                        <span>{service.timeline}</span>
                      </div>
                      <span className="font-bold text-slate-900">{service.price}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-500 mb-4">Не нашли нужную услугу?</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors group"
          >
            Смотреть все услуги
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
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
