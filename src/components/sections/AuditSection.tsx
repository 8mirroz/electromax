"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import {
  ShieldCheck,
  Ban,
  Settings,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const AUDIT_TRIGGER_CARDS = [
  {
    title: "Перед проверкой надзора",
    description:
      "Сверим состояние систем и документации, чтобы сократить риск замечаний и повторного выезда.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bg: "bg-blue-50/50",
    borderColor: "border-blue-200",
  },
  {
    title: "Задержка запуска объекта",
    description:
      "Найдем критичные блокеры по АПС, СКУД, СОТ и электрике до выхода на монтаж и пусконаладку.",
    icon: Ban,
    color: "text-red-500",
    bg: "bg-red-50/50",
    borderColor: "border-red-200",
  },
  {
    title: "Сбойная или устаревшая система",
    description:
      "Оценим износ, совместимость оборудования и точки отказа без полной остановки площадки.",
    icon: Settings,
    color: "text-amber-500",
    bg: "bg-amber-50/50",
    borderColor: "border-amber-200",
  },
  {
    title: "Расширение / масштабирование",
    description:
      "Подготовим архитектурный план расширения под новые зоны, здания и сценарии доступа.",
    icon: Layers,
    color: "text-indigo-500",
    bg: "bg-indigo-50/50",
    borderColor: "border-indigo-200",
  },
];

const AUDIT_CHECKLIST = [
  {
    text: "Чек-лист замечаний и критичности",
    subtext: "что исправить в первую очередь",
  },
  {
    text: "Карта рисков по системам",
    subtext: "АПС / СОУЭ / СКУД / СОТ / ЭОМ",
  },
  {
    text: "Рекомендации по этапам",
    subtext: "срочно / планово / при модернизации",
  },
  {
    text: "Предварительный бюджет и план работ",
    subtext: "для согласования с руководством",
  },
];

export function AuditSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-24 lg:py-36"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-emerald-200/20 rounded-full blur-2xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 items-start">
          {/* Левая колонка */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-200 text-blue-600 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Профессиональный аудит
              </div>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <h2 className="text-[clamp(2.25rem,5vw,3.5rem)] font-display font-black leading-[1.05] tracking-tight text-slate-900 mb-8">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Быстрый аудит
                </span>{" "}
                объекта перед запуском, проверкой или модернизацией
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl"
            >
              По рынку конкуренты часто продают «монтаж под ключ», но аудит и диагностика помогают
              быстрее принять решение и снизить риск ошибок в смете. Мы переводим это в понятный
              следующий шаг: проверка текущего состояния, карта рисков и план исправлений с
              приоритетами.
            </motion.p>

            {/* Trigger Cards Grid */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4 mb-10">
              {AUDIT_TRIGGER_CARDS.map((card) => (
                <motion.div
                  key={card.title}
                  variants={cardVariants}
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  className={`group relative p-5 rounded-2xl ${card.bg} border ${card.borderColor} backdrop-blur-sm transition-all duration-300`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-sm rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              >
                Заказать аудит
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Правая колонка — Карточка действия */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            className="relative lg:sticky lg:top-32"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/50 to-blue-50/50 opacity-50" />

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Что вы получите</h3>
                    <p className="text-sm text-slate-500">В результате аудита</p>
                  </div>
                </div>

                <ul className="space-y-5">
                  {AUDIT_CHECKLIST.map((item, index) => (
                    <motion.li
                      key={item.text}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="group flex items-start gap-4"
                    >
                      <div className="relative mt-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        {index < AUDIT_CHECKLIST.length - 1 && (
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-emerald-200 to-transparent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                          {item.text}
                        </p>
                        <p className="text-sm text-slate-500">{item.subtext}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {/* Bottom decoration */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                        </div>
                      ))}
                    </div>
                    <span>Более 200 объектов проверено</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
