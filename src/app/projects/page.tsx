"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PROJECT_TYPES, getProjectsByType } from "@/data/projects";
import { SERVICES_DB } from "@/data/services";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  Maximize,
  Clock,
  Banknote,
  Info,
  Layers,
  CheckCircle2,
  Settings,
  ArrowRight,
  FolderOpen,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function ProjectsPage() {
  const [activeType, setActiveType] = useState("all");
  const projects = getProjectsByType(activeType);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-6">
            <Badge icon={Briefcase} className="mb-6">
              Портфолио
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.1]">
              Реализованные проекты
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
              Более 500 успешно сданных объектов по всей России. От офисных центров до промышленных
              комплексов.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              {[
                "Кейсы с параметрами объекта и сроками",
                "Сценарии для действующих объектов без остановки",
                "Фокус на инженерном результате, а не только на оборудовании",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-foreground/[0.02] border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-black text-primary mb-2">
                500+
              </div>
              <div className="text-[10px] font-bold text-muted-foreground lowercase first-letter:uppercase tracking-tight">
                Объектов сдано
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-black text-primary mb-2">
                12
              </div>
              <div className="text-[10px] font-bold text-muted-foreground lowercase first-letter:uppercase tracking-tight">
                Лет опыта
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-black text-primary mb-2">
                100%
              </div>
              <div className="text-[10px] font-bold text-muted-foreground lowercase first-letter:uppercase tracking-tight">
                Сдача с первого раза
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-black text-primary mb-2">
                24/7
              </div>
              <div className="text-[10px] font-bold text-muted-foreground lowercase first-letter:uppercase tracking-tight">
                Поддержка
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-border sticky top-16 z-40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {PROJECT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                type="button"
                aria-pressed={activeType === type.id}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 min-h-[44px] min-w-[44px] rounded-full text-[12px] font-bold lowercase first-letter:uppercase tracking-tight whitespace-nowrap transition-all",
                  activeType === type.id
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 flex-1">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-display font-black tracking-tight text-foreground">
                {activeType === "all"
                  ? "Все кейсы"
                  : `Кейсы: ${PROJECT_TYPES.find((t) => t.id === activeType)?.label ?? "подборка"}`}
              </h2>
              <p className="text-muted-foreground font-medium mt-2">
                {projects.length}{" "}
                {projects.length === 1 ? "проект" : projects.length < 5 ? "проекта" : "проектов"} в
                выборке
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground">
              Для каждого кейса показываем тип объекта, состав систем, сроки и параметры реализации.
            </div>
          </div>

          <div className="space-y-12">
            {projects.map((project, idx) => (
              <article key={project.id} className="grid lg:grid-cols-2 gap-8 items-center group">
                {/* Image */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[2.5rem] border border-border",
                    idx % 2 === 1 ? "lg:order-2" : "",
                  )}
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={project.image}
                      alt={`${project.title} — ${project.location}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading={idx < 2 ? "eager" : "lazy"}
                      priority={idx < 2}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-bold lowercase first-letter:uppercase tracking-tight mb-4">
                      {PROJECT_TYPES.find((t) => t.id === project.type)?.label}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">{project.location}</p>
                    <div className="flex flex-wrap gap-4 text-white text-sm font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        {project.year}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4 text-primary" />
                        {project.area.toLocaleString()} м²
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" />
                        {project.duration}
                      </span>
                      {project.budget && (
                        <span className="flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-primary" />
                          {(project.budget / 1000000).toFixed(1)} млн ₽
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={cn("space-y-8", idx % 2 === 1 ? "lg:order-1" : "")}>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-muted-foreground">
                        О проекте
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-muted-foreground">
                        Выполненные работы
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {project.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-muted-foreground">
                        Системы
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((serviceId) => {
                        const service = SERVICES_DB[serviceId];
                        if (!service) return null;
                        return (
                          <span
                            key={serviceId}
                            className="px-4 py-2 rounded-full bg-muted text-sm font-bold text-muted-foreground border border-border"
                          >
                            {service.shortName}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                      <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-muted-foreground">
                        Похожая задача? Подберем аналогичный сценарий и состав работ
                      </div>
                      <Link
                        href="/contacts"
                        className="inline-flex items-center gap-2 text-primary font-black hover:text-blue-700 transition group"
                      >
                        Обсудить похожий проект
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-24">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Проекты не найдены</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90" />
        <div className="container relative z-10 mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6">
            Хотите так же?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-medium">
            Свяжитесь с нами для бесплатной консультации и расчёта стоимости вашего проекта
          </p>
          <Link
            href="/contacts"
            className="relative inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold uppercase tracking-wider text-sm rounded-2xl shadow-xl hover:bg-slate-50 transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            Оставить заявку
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
