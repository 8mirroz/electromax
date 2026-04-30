"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPhone } from "@/lib/phone";
import { isLeadDemoMode, isValidRuPhone, type LeadApiResponse } from "@/lib/leads";
import { MapPin, Phone, Mail, Clock, CheckCircle, Map, Copy, Check, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const contactInfo = [
  {
    icon: MapPin,
    title: "Адрес",
    content: 'Москва, ул. Индустриальная 42,\nБЦ "Технопарк", оф. 304',
  },
  {
    icon: Phone,
    title: "Телефон",
    content: "+7 (495) 123-45-67",
    href: "tel:+74951234567",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@onedim.ru",
    href: "mailto:info@onedim.ru",
  },
  {
    icon: Clock,
    title: "Часы работы",
    content: "Пн-Пт: 9:00 - 18:00\nСб-Вс: по записи",
  },
];

const requisites = [
  { label: "ООО", value: '"УАНДИМ"' },
  { label: "ИНН", value: "7701234567" },
  { label: "КПП", value: "770101001" },
  { label: "ОГРН", value: "1157746123456" },
  { label: "Р/с", value: "40702810100000001234" },
  { label: "Банк", value: "ПАО Сбербанк" },
  { label: "БИК", value: "044525225" },
  { label: "К/с", value: "30101810400000000225" },
];

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadMap, setLoadMap] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const isDemoMode = isLeadDemoMode();

  useEffect(() => {
    const timer = setTimeout(() => setLoadMap(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidRuPhone(formData.phone)) {
      setErrorMessage("Введите номер в формате +7 (999) 123-45-67");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectType: "contact_form",
          areaSquareMeters: 0,
          complexityCoef: 1,
          estimatedPrice: 0,
          contactPhone: formData.phone,
          contactName: formData.name,
          contactEmail: formData.email,
          message: formData.message,
        }),
      });

      const data = (await res.json()) as LeadApiResponse;

      if (res.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        throw new Error(data.error || "Не удалось отправить заявку. Попробуйте позже.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка сети. Попробуйте позже.";
      setErrorMessage(msg);
      setStatus("error");
    }
  };

  const copyToClipboard = async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value.replace(/"/g, ""));
      setCopyError(null);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
      setCopyError("Не удалось скопировать. Попробуйте еще раз.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="max-w-4xl">
            <Badge icon={Phone} className="mb-6">
              Контакты
            </Badge>

            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-display font-black tracking-tight leading-[1.05] text-slate-900 mb-6">
              Свяжитесь с командой{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OneDim
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Поможем определить состав работ, сроки и ориентировочный бюджет. Для типовых задач
              даём предварительное КП в течение 24 часов.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: Zap, text: "Ответ за 15 минут" },
                { icon: Clock, text: "КП до 24 часов" },
                { icon: CheckCircle, text: "Работаем без остановки" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm"
                >
                  <item.icon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="group relative h-full rounded-2xl border-2 border-slate-100 bg-white p-6 hover:border-slate-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-600">
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>

                {item.href ? (
                  <a
                    href={item.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors font-medium whitespace-pre-line text-sm leading-relaxed"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-slate-600 whitespace-pre-line font-medium text-sm leading-relaxed">
                    {item.content}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 mb-2">
                  Отправить заявку
                </h2>
                <p className="text-sm text-slate-500">Заполните форму, мы перезвоним</p>
                {isDemoMode ? (
                  <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
                    Demo mode: форма подтверждает сценарий, но не отправляет заявку менеджеру.
                  </p>
                ) : null}
              </div>

              <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-slate-500 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Что ускорит расчёт
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  {[
                    "Тип объекта и примерная площадь",
                    "Какие системы нужны (АПС, СКУД, СОТ, ЭОМ и т.д.)",
                    "Срок запуска объекта и ограничения по времени работ",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {status === "success" ? (
                <div className="rounded-3xl bg-emerald-50 border-2 border-emerald-200 p-10 text-center">
                  <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-slate-900 mb-3">
                    Заявка принята!
                  </h3>
                  <p className="text-slate-600 font-medium mb-6">
                    {isDemoMode
                      ? "Демо-режим Vercel: сценарий проверен, но заявка не отправлена менеджеру."
                      : "Менеджер свяжется с вами в течение 15 минут"}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[11px] font-bold lowercase first-letter:uppercase tracking-tight text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Имя
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Ваше имя"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: formatPhone(e.target.value) })
                      }
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border-2 bg-white text-slate-900 focus:outline-none focus:ring-2 transition-all",
                        status === "error"
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20",
                      )}
                      placeholder="+7 (___) ___-__-__"
                    />
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="example@mail.ru"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Сообщение
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder="Опишите вашу задачу..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "loading"}
                    className="w-full h-14 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    {status === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Отправка...
                      </span>
                    ) : (
                      "Отправить заявку"
                    )}
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                    <span>Нажимая кнопку, вы соглашаетесь с</span>
                    <Link
                      href="/licenses"
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      политикой конфиденциальности
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Map Section */}
            <div className="lg:col-span-5">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-black text-slate-900 mb-2">
                  Как нас найти
                </h2>
                <p className="text-sm text-slate-500">Москва и регионы</p>
              </div>

              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-slate-500 mb-3">
                  Зона работы
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <p>
                      Москва и Московская область — выезд инженера по графику или в срочном режиме.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p>
                      Регионы — удалённый аудит + командировка инженерной группы по согласованию.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 h-[500px] relative">
                {!loadMap ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Map className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 lowercase first-letter:uppercase tracking-tight">
                          Карта загружается...
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setLoadMap(true)}
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                      aria-label="Загрузить карту"
                    >
                      <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl text-center">
                        <Map className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                        <p className="text-[11px] font-bold text-slate-900 lowercase first-letter:uppercase tracking-tight">
                          Показать карту
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Яндекс.Карты</p>
                      </div>
                    </button>
                  </>
                ) : (
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=37.617635%2C55.755814&z=10"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Карта"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requisites Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-100/50 to-slate-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-black text-slate-900 mb-3">
              Реквизиты компании
            </h2>
            <p className="text-slate-600">Для договоров и оплаты</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {requisites.map((req, index) => (
              <div
                key={req.label}
                className="group relative rounded-xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:border-slate-300 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => copyToClipboard(req.value, index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    copyToClipboard(req.value, index);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold lowercase first-letter:uppercase tracking-tight text-slate-400 mb-1">
                      {req.label}
                    </div>
                    <div className="text-base font-bold text-slate-900 font-mono">{req.value}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Нажмите на реквизит, чтобы скопировать
          </p>
          {copyError && <p className="text-center text-xs text-rose-500 mt-2">{copyError}</p>}
        </div>
      </section>

      <Footer />
    </main>
  );
}
