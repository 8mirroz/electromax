"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import {
    ShieldCheck,
    Ban,
    Settings,
    Layers,
    CheckCircle2,
    MessageSquare
} from "lucide-react";
import { RainbowButton } from "@/components/ui/RainbowButton";

const AUDIT_TRIGGER_CARDS = [
    {
        title: "Перед проверкой надзора",
        description: "Сверим состояние систем и документации, чтобы сократить риск замечаний и повторного выезда.",
        icon: ShieldCheck,
        color: "text-blue-500",
        bg: "bg-blue-50/50"
    },
    {
        title: "Задержка запуска объекта",
        description: "Найдем критичные блокеры по АПС, СКУД, СОТ и электрике до выхода на монтаж и пусконаладку.",
        icon: Ban,
        color: "text-red-500",
        bg: "bg-red-50/50"
    },
    {
        title: "Сбойная или устаревшая система",
        description: "Оценим износ, совместимость оборудования и точки отказа без полной остановки площадки.",
        icon: Settings,
        color: "text-amber-500",
        bg: "bg-amber-50/50"
    },
    {
        title: "Расширение / масштабирование",
        description: "Подготовим архитектурный план расширения под новые зоны, здания и сценарии доступа.",
        icon: Layers,
        color: "text-indigo-500",
        bg: "bg-indigo-50/50"
    },
];

const AUDIT_CHECKLIST = [
    "Чек-лист замечаний и критичности (что исправить в первую очередь)",
    "Карта рисков по системам: АПС / СОУЭ / СКУД / СОТ / ЭОМ",
    "Рекомендации по этапам: срочно / планово / при модернизации",
    "Предварительный бюджет и план работ для согласования с руководством",
];

const AUDIT_PROCESS = [
    "Уточняем тип объекта, площадь и текущие системы",
    "Согласовываем формат: выезд инженера или удалённый аудит",
    "Формируем сроки и состав результата для вашего кейса",
];

export function AuditSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.215, 0.61, 0.355, 1],
            },
        },
    };

    return (
        <section
            ref={ref}
            className="relative overflow-hidden bg-[#F8FAFC] py-20 lg:py-32"
        >
            <div className="container relative z-10 mx-auto max-w-7xl px-4">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">

                    {/* Левая колонка */}
                    <div className="flex flex-col">
                        <motion.div
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            variants={itemVariants}
                        >
                            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500/80 mb-4">
                                Аудит инженерных систем
                            </span>
                            <h2 className="text-[clamp(2rem,4vw,3rem)] font-display font-black leading-[1.1] tracking-tight text-slate-900 mb-6">
                                Быстрый аудит объекта перед запуском, проверкой или модернизацией
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-12 max-w-2xl">
                                По рынку конкуренты часто продают «монтаж под ключ», но аудит и диагностика помогают быстрее принять решение и снизить риск ошибок в смете. Мы переводим это в понятный следующий шаг: проверка текущего состояния, карта рисков и план исправлений с приоритетами.
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid gap-4 sm:grid-cols-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            {AUDIT_TRIGGER_CARDS.map((card) => (
                                <motion.div
                                    key={card.title}
                                    variants={itemVariants}
                                    className="group flex flex-col rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200/50 transition-all hover:shadow-md hover:border-slate-300/50"
                                >
                                    <div className={`mb-6 flex h-10 w-10 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
                                        <card.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-3 text-[17px] font-bold leading-snug text-slate-900 group-hover:text-primary transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-[14px] leading-relaxed text-slate-500">
                                        {card.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Правая колонка — Карточка действия */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="sticky top-24 overflow-hidden rounded-[2.5rem] bg-white p-8 lg:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100">
                            <h3 className="text-2xl lg:text-3xl font-display font-black text-slate-900 mb-4">
                                Закажите аудит объекта
                            </h3>
                            <p className="text-slate-500 mb-8 max-w-sm">
                                Получите инженерное заключение, список рисков и предварительный план работ — чтобы перейти к КП и запуску проекта без лишних итераций.
                            </p>

                            {/* Чек-лист */}
                            <ul className="mb-10 space-y-4">
                                {AUDIT_CHECKLIST.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                                        <span className="text-[15px] leading-relaxed text-slate-700">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Процесс (нижняя плашка) */}
                            <div className="rounded-3xl bg-slate-50 p-6 mb-8 border border-slate-100">
                                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                                    Что дальше после клика
                                </span>
                                <ol className="space-y-4">
                                    {AUDIT_PROCESS.map((step, idx) => (
                                        <li key={step} className="flex items-center gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-400 border border-slate-200">
                                                {idx + 1}
                                            </span>
                                            <span className="text-[13px] font-medium text-slate-600">
                                                {step}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Кнопки */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <RainbowButton className="px-8 py-6 text-sm font-bold uppercase tracking-widest whitespace-nowrap">
                                    Заказать аудит
                                </RainbowButton>
                                <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-slate-200 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300">
                                    <MessageSquare className="h-4 w-4" />
                                    Обсудить с инженером
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
