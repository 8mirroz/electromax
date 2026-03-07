"use client";

import { useState, useEffect } from "react";
import FocusTrap from "focus-trap-react";
import { cn } from "@/lib/utils";
import { formatPhone } from "@/lib/phone";
import { trackClientEvent } from "@/lib/analytics/events";
import { isLeadDemoMode, isValidRuPhone } from "@/lib/leads";
import {
  X,
  CheckCircle2,
  Briefcase,
  Warehouse,
  Factory,
  ShoppingBag,
  Flame,
  Bell,
  Video,
  ShieldAlert,
  CreditCard,
  Network,
  Zap,
  Lightbulb,
} from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: string;
}

const OBJECT_TYPES = [
  { id: "office", label: "Офисный центр", Icon: Briefcase },
  { id: "warehouse", label: "Складской комплекс", Icon: Warehouse },
  { id: "industrial", label: "Производство", Icon: Factory },
  { id: "mall", label: "Торговый центр", Icon: ShoppingBag },
];

const SERVICES = [
  { id: "aps", label: "АПС (Пожарная сигнализация)", Icon: Flame },
  { id: "soue", label: "СОУЭ (Оповещение)", Icon: Bell },
  { id: "sot", label: "СОТ (Видеонаблюдение)", Icon: Video },
  { id: "os", label: "ОС (Охранная сигнализация)", Icon: ShieldAlert },
  { id: "skud", label: "СКУД (Контроль доступа)", Icon: CreditCard },
  { id: "sks", label: "СКС (Кабельная система)", Icon: Network },
  { id: "eom", label: "ЭОМ (Силовые сети)", Icon: Zap },
  { id: "eo", label: "ЭО (Освещение)", Icon: Lightbulb },
];

const STEPS = [
  { id: 1, title: "Тип объекта" },
  { id: 2, title: "Площадь" },
  { id: 3, title: "Системы" },
  { id: 4, title: "Контакты" },
];

export function QuizModal({ isOpen, onClose, initialNote }: QuizModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [objectType, setObjectType] = useState("");
  const [area, setArea] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const isDemoMode = isLeadDemoMode();

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("quiz-progress");
      // A non-empty initialNote means the user deliberately typed something in the
      // Hero input and clicked "Сгенерировать решение". Treat it as a fresh intent:
      // override any saved note and restart from step 1 so they aren't dropped into
      // the middle of a stale quiz session.
      if (initialNote && initialNote.trim()) {
        if (saved) {
          try {
            const data = JSON.parse(saved);
            setObjectType(data.objectType || "");
            setArea(data.area || "");
            setSelectedServices(data.selectedServices || []);
          } catch (e) {
            console.error("Failed to load quiz progress", e);
          }
        }
        setCurrentStep(1);
        setNote(initialNote);
      } else if (saved) {
        try {
          const data = JSON.parse(saved);
          setCurrentStep(data.step || 1);
          setObjectType(data.objectType || "");
          setArea(data.area || "");
          setSelectedServices(data.selectedServices || []);
          setNote(data.note || "");
        } catch (e) {
          console.error("Failed to load quiz progress", e);
        }
      }
    }
  }, [isOpen, initialNote]);

  useEffect(() => {
    if (isOpen && currentStep > 1) {
      localStorage.setItem(
        "quiz-progress",
        JSON.stringify({
          step: currentStep,
          objectType,
          area,
          selectedServices,
          note,
        }),
      );
    }
  }, [currentStep, objectType, area, selectedServices, note, isOpen]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1 && !objectType) {
      setError("Выберите тип объекта");
      return;
    }
    if (currentStep === 2 && (!area || Number(area) < 10)) {
      setError("Укажите площадь от 10 м²");
      return;
    }
    if (currentStep === 3 && selectedServices.length === 0) {
      setError("Выберите хотя бы одну систему");
      return;
    }
    if (currentStep === 4) {
      if (!name.trim()) {
        setError("Введите имя");
        return;
      }
      if (!isValidRuPhone(phone)) {
        setError("Введите корректный номер телефона");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !isValidRuPhone(phone)) {
      setError("Заполните имя и телефон");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectType,
          areaSquareMeters: Number(area),
          complexityCoef: 1,
          estimatedPrice: 0,
          contactPhone: phone,
          contactName: name,
          selectedServices,
          leadNote: note.trim() ? note.trim() : undefined,
          source: "quiz_modal",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        await trackClientEvent("lead_form_submit", {
          source: "quiz_modal",
          object_type: objectType,
          area: Number(area) || 0,
          selected_services_count: selectedServices.length,
        });
      } else {
        throw new Error(data.error || "Ошибка отправки");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Произошла ошибка";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    localStorage.removeItem("quiz-progress");
    setCurrentStep(1);
    setObjectType("");
    setArea("");
    setSelectedServices([]);
    setName("");
    setPhone("");
    setNote("");
    setIsSuccess(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={reset}
        aria-hidden="true"
      />

      <FocusTrap
        focusTrapOptions={{
          initialFocus: false,
          fallbackFocus: "#quiz-title",
          allowOutsideClick: true,
        }}
      >
        <div
          className="relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-title"
        >
          <h2 id="quiz-title" className="sr-only" tabIndex={-1}>
            Рассчитать стоимость проекта
          </h2>
          {/* Close button */}
          <button
            onClick={reset}
            className="absolute top-6 right-6 h-11 w-11 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors z-10"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5 text-muted-foreground" aria-hidden />
          </button>

          {isSuccess ? (
            /* Success State */
            <div className="p-12 text-center">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden />
              </div>
              <h2 className="text-3xl font-display font-black text-foreground mb-4">
                Заявка принята!
              </h2>
              <p className="text-muted-foreground font-medium mb-8">
                {isDemoMode
                  ? "Демо-режим Vercel: сценарий закрыт успешно, но заявка не отправляется менеджеру."
                  : "Инженер свяжется с вами в течение 15 минут для уточнения деталей"}
              </p>
              <button
                onClick={reset}
                className="px-8 py-4 rounded-full bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-primary p-8">
                <h2 className="text-2xl font-display font-black text-white mb-2">
                  Рассчитать стоимость проекта
                </h2>
                <p className="text-primary-foreground/80 text-sm font-bold uppercase tracking-widest">
                  Ответьте на 4 вопроса за 1 минуту
                </p>

                {/* Progress */}
                <div className="flex items-center gap-2 mt-6">
                  {STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden"
                    >
                      <div
                        className={cn(
                          "h-full bg-white rounded-full transition-all duration-500",
                          currentStep >= step.id ? "w-full" : "w-0",
                        )}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                    Шаг {currentStep} из 4
                  </span>
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                    {STEPS[currentStep - 1]?.title}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {isDemoMode ? (
                  <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                    Demo mode: заявка подтверждается только в интерфейсе.
                  </div>
                ) : null}
                {/* Step 1: Object Type */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Выберите тип объекта</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {OBJECT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setObjectType(type.id)}
                          aria-pressed={objectType === type.id}
                          className={cn(
                            "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300",
                            objectType === type.id
                              ? "border-primary bg-primary/5 text-primary shadow-lg"
                              : "border-border bg-background text-muted-foreground hover:border-primary/20",
                          )}
                        >
                          <type.Icon
                            className={cn(
                              "h-8 w-8 transition-transform",
                              objectType === type.id ? "scale-110" : "",
                            )}
                            aria-hidden
                          />
                          <span className="text-sm font-bold text-center">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Area */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Укажите примерную площадь
                    </h3>
                    <div className="text-center py-8">
                      <div className="text-6xl font-display font-black text-primary mb-4">
                        {area || "0"}
                        <span className="text-2xl text-muted-foreground ml-2">м²</span>
                      </div>
                      <label htmlFor="quiz-area" className="sr-only">
                        Площадь объекта в м²
                      </label>
                      <input
                        id="quiz-area"
                        type="range"
                        min="10"
                        max="10000"
                        step="10"
                        value={area || 100}
                        aria-valuemin={10}
                        aria-valuemax={10000}
                        aria-valuenow={Number(area) || 100}
                        aria-valuetext={`${area || 100} м²`}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      />
                      <div className="flex justify-between mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span>10 м²</span>
                        <span>10 000 м²</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Services */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Какие системы нужны?</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto overscroll-contain">
                      {SERVICES.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          aria-pressed={selectedServices.includes(service.id)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 text-left",
                            selectedServices.includes(service.id)
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-primary/20",
                          )}
                        >
                          <service.Icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              selectedServices.includes(service.id) ? "text-primary" : "",
                            )}
                            aria-hidden
                          />
                          <span className="text-xs font-bold">{service.label}</span>
                        </button>
                      ))}
                    </div>
                    {selectedServices.length > 0 && (
                      <p className="text-sm text-muted-foreground text-center">
                        Выбрано систем:{" "}
                        <span className="font-bold text-foreground">{selectedServices.length}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Step 4: Contacts */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Куда отправить расчёт?
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="quiz-name"
                          className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2"
                        >
                          Имя *
                        </label>
                        <input
                          id="quiz-name"
                          type="text"
                          autoComplete="name"
                          required
                          aria-required="true"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-border bg-background font-display font-bold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus:border-primary transition-all"
                          placeholder="Иван Петров"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="quiz-phone"
                          className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2"
                        >
                          Телефон *
                        </label>
                        <input
                          id="quiz-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          aria-required="true"
                          value={phone}
                          onChange={(e) => setPhone(formatPhone(e.target.value))}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-border bg-background font-display font-bold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus:border-primary transition-all"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="quiz-note"
                          className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2"
                        >
                          Комментарий
                        </label>
                        <textarea
                          id="quiz-note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={3}
                          className="w-full px-6 py-4 rounded-2xl border-2 border-border bg-background font-display font-bold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus:border-primary transition-all"
                          placeholder="Опишите объект или требования"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-destructive text-sm font-bold text-center" role="alert">
                      {error}
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-4 mt-8">
                  {currentStep > 1 ? (
                    <button
                      onClick={handleBack}
                      className="flex-1 py-4 px-6 rounded-2xl border-2 border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-muted transition"
                    >
                      Назад
                    </button>
                  ) : (
                    <button
                      onClick={reset}
                      className="flex-1 py-4 px-6 rounded-2xl border-2 border-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-muted transition"
                    >
                      Закрыть
                    </button>
                  )}
                  {currentStep < 4 ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-4 px-6 rounded-2xl bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-primary/25"
                    >
                      Далее
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={cn(
                        "flex-1 py-4 px-6 rounded-2xl bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-primary/25",
                        isSubmitting && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      {isSubmitting ? "Отправка..." : "Получить расчёт"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </FocusTrap>
    </div>
  );
}
