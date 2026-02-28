"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, type Variants } from "motion/react";
import { CheckCircle2, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
  const router = useRouter();

  const handleOrderAudit = () => {
    router.push("/contacts");
  };

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
            <motion.div variants={itemVariants}>
              <Badge icon={Search} className="mb-6">
                Профессиональный аудит
              </Badge>
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

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="mt-6">
              <button
                type="button"
                onClick={handleOrderAudit}
                className="relative h-11 inline-flex items-center justify-center px-7 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-tight text-[13px] rounded-2xl shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4),0_8px_40px_-8px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.5),0_12px_50px_-8px_rgba(79,70,229,0.35)] transition-[box-shadow,filter] duration-200 hover:brightness-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
              >
                Заказать аудит
              </button>
              <a
                href="https://t.me/electromax_support"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 h-11 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#24A1DE] bg-white px-7 text-[13px] font-bold tracking-tight text-[#24A1DE] transition-colors duration-200 hover:bg-[#24A1DE] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24A1DE]/40 focus-visible:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Обсудить в Telegram
              </a>
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
