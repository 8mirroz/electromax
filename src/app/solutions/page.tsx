"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SolutionsGallery } from "@/components/smart-cards/SolutionsGallery";
import { SERVICES_DB } from "@/data/services";
import type { QuickStartCard } from "@/types";

export default function SolutionsPage() {
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddToTray = (card: QuickStartCard, serviceSlug: string) => {
    setNotification(`"${card.title}" добавлено в проект-трей`);
    setTimeout(() => setNotification(null), 3000);

    console.log("Add to tray:", {
      cardId: card.id,
      cardTitle: card.title,
      serviceSlug,
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-to-b from-muted/50 to-background pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-flex items-center rounded-full border border-border bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              Готовые решения
            </span>
            <h1 className="font-display text-3xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Галерея решений
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              Выберите готовое решение для вашей задачи. Каждое решение можно добавить в проект-трей
              для детального расчета и настройки под ваш объект.
            </p>
          </motion.div>
        </div>
      </section>

      <SolutionsGallery services={SERVICES_DB} onAddToTray={handleAddToTray} />

      {notification ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground px-6 py-4 text-sm font-semibold text-background shadow-lg"
        >
          {notification}
        </motion.div>
      ) : null}

      <Footer />
    </main>
  );
}
