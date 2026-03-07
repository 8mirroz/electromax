"use client";

import { motion } from "motion/react";

interface Step {
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: Step[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-muted/20">
      <div className="absolute inset-0 bg-blueprint opacity-[0.05] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-20 gap-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-display font-black text-[10px] tracking-[0.4em] uppercase"
          >
            Алгоритм соответствия стандартам
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase leading-none text-foreground">
            ЦИКЛ <span className="text-primary">РЕАЛИЗАЦИИ</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium tracking-tight">
            Протоколированный процесс внедрения: от первичной диагностики до сдачи в промышленную
            эксплуатацию.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 relative">
          {/* Connector Line (Desktop) with Animation */}
          <div className="hidden lg:block absolute top-[60px] left-0 w-full h-[1px] bg-border/50 z-0 overflow-hidden">
            <motion.div
              className="w-full h-full bg-primary"
              initial={{ x: "-100%" }}
              whileInView={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-28 h-28 rounded-2xl bg-background border border-border flex items-center justify-center mb-8 group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-300 transform group-hover:-translate-y-2">
                <span className="text-4xl font-display font-black text-primary/10 group-hover:text-primary transition-colors duration-300">
                  {idx + 1}
                </span>

                {/* Decorative corner */}
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-border group-hover:border-primary transition-colors" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-border group-hover:border-primary transition-colors" />
              </div>

              <h3 className="text-sm font-display font-black tracking-widest uppercase mb-4 text-foreground group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
