"use client";

import { motion } from "motion/react";
import { Cpu } from "lucide-react";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

interface EquipmentListProps {
  items: string[];
}

export function EquipmentList({ items }: EquipmentListProps) {
  const { isLite } = usePerformanceTier();

  return (
    <section className="relative py-24 overflow-hidden border-t border-border/50 bg-background">
      <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 mb-16">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Technical Bill of Materials</div>
          <h2 className="text-3xl font-display font-black tracking-tight uppercase">Спецификация компонентов</h2>
          <div className="h-1 w-20 bg-primary mt-2" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/50 border border-border/50">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: isLite ? 0 : idx * 0.02, duration: isLite ? 0 : 0.3 }}
              className="flex items-center gap-4 p-8 bg-background group hover:bg-muted/30 transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
