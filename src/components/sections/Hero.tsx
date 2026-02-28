"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ShieldCheck, FileCheck, Clock3, CheckCircle2, Sparkles } from "lucide-react";
import { usePerformanceTier } from "@/components/AdaptiveProvider";
import { QuizModal } from "@/components/ui/QuizModal";

const TRUST_ITEMS = [
  { icon: ShieldCheck, value: "500+", label: "объектов сдано" },
  { icon: FileCheck, value: "ISO", label: "сертификация" },
  { icon: Clock3, value: "24ч", label: "на расчет сметы" },
  { icon: CheckCircle2, value: "МЧС", label: "сдача без замечаний" },
] as const;

export function Hero() {
  const { isLite } = usePerformanceTier();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const noMotion = !mounted || prefersReducedMotion || isLite;

  const fadeUp = (delay = 0) =>
    noMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_0%,rgba(37,99,235,0.08),transparent)] perf-lite:opacity-0"
      />

      <div className="relative container mx-auto max-w-7xl pt-10 pb-2 md:pt-14 md:pb-4">
        <div className="rounded-[28px] border border-border bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-6 text-white shadow-[0_24px_50px_-28px_rgba(30,64,175,0.65)] sm:p-8">
          <motion.div {...fadeUp(0)} className="max-w-4xl">
            <h1
              className="mt-5 font-display font-black leading-[1.08] tracking-tight text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}
            >
              Интеллектуальный архитектор
              <br />
              инженерных систем
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
              Проектирование, монтаж и обслуживание комплексных систем безопасности и электрики для
              промышленных и коммерческих объектов. Получите структуру решения за минуты.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setQuizOpen(true)}
                className="flex h-11 flex-1 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 text-sm text-white/80 shadow-inner hover:bg-white/15 transition-colors text-left"
              >
                <Sparkles className="h-4 w-4 text-white/80 shrink-0" />
                Рассчитать стоимость проекта...
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setQuizOpen(true)}
                className="h-11 px-7 rounded-2xl bg-white text-blue-600 font-bold text-[13px] tracking-tight shadow-lg shadow-blue-900/20 hover:bg-slate-50 transition-colors"
              >
                Получить расчёт
              </motion.button>
            </div>
            {quizOpen && <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />}
            <p className="mt-3 text-xs text-white/70">
              Бесплатный выезд инженера. Предварительная смета за 24 часа.
            </p>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp(0.15)}
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TRUST_ITEMS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-4 shadow-[0_16px_34px_-28px_rgba(15,23,42,0.25)]"
            >
              <div>
                <p className="text-lg font-black text-foreground leading-tight">{value}</p>
                <p className="text-xs leading-tight text-text-muted">{label}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
