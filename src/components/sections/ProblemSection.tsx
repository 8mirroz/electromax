"use client";

import { motion } from "motion/react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

interface Problem {
  title: string;
  description: string;
}

interface ProblemSectionProps {
  problems: Problem[];
}

export function ProblemSection({ problems }: ProblemSectionProps) {
  const { isLite } = usePerformanceTier();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background border-y border-border/50">
      <div className="absolute inset-0 bg-blueprint opacity-[0.05] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: isLite ? 0 : 0.3 }}
            className="text-primary font-display font-black text-[10px] tracking-[0.4em] uppercase"
          >
            Сценарии деградации безопасности
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase leading-none text-foreground max-w-4xl">
            ВЕКТОРЫ <span className="text-primary">УЯЗВИМОСТИ</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium tracking-tight">
            Анализ критических рисков современных коммерческих объектов и методология их
            нейтрализации.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-border/50">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: isLite ? 0 : idx * 0.1, duration: isLite ? 0 : 0.3 }}
              className="group p-10 border-r border-b border-border/50 bg-background hover:bg-muted/30 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl glass text-primary transition-transform duration-300">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="h-[1px] flex-grow bg-border/50" />
                <div className="text-[10px] font-black text-muted-foreground opacity-30">
                  0{idx + 1}
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-display font-black tracking-tighter uppercase mb-4 group-hover:text-primary transition-colors duration-300">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium text-sm">
                  {problem.description}
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-primary uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>РЕШЕНИЕ ELECTROMAX</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
