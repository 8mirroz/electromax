"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPhone } from "@/lib/phone";
import { isValidRuPhone, type LeadApiResponse } from "@/lib/leads";

const contactInfo = [
  {
    icon: "location_on",
    title: "Адрес",
    content: "Москва, ул. Индустриальная 42,\nБЦ \"Технопарк\", оф. 304",
  },
  {
    icon: "phone",
    title: "Телефон",
    content: "+7 (495) 123-45-67",
    href: "tel:+74951234567",
  },
  {
    icon: "email",
    title: "Email",
    content: "info@electromax.ru",
    href: "mailto:info@electromax.ru",
  },
  {
    icon: "schedule",
    title: "Часы работы",
    content: "Пн-Пт: 9:00 - 18:00\nСб-Вс: по записи",
  },
];

const requisites = [
  { label: "ООО", value: "\"ЭЛЕКТРОМАКС\"" },
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

  useEffect(() => {
    // Load map on interaction or after 3 seconds (whichever comes first)
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

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-6">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] border border-primary/20">
              КОНТАКТЫ
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.1]">
              Свяжитесь с инженерной командой Electromax
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Поможем определить состав работ, сроки и ориентировочный бюджет. Для типовых задач даём предварительное КП в течение 24 часов, для срочных объектов — ускоренный разбор.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {[
                "Ответ инженера в течение 15 минут",
                "Предварительное КП до 24 часов",
                "Работаем с действующими объектами без остановки бизнеса",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="group p-8 rounded-[2rem] border border-border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-icons-outlined text-primary group-hover:text-white text-3xl transition-colors">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium whitespace-pre-line"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-muted-foreground whitespace-pre-line font-medium">
                    {item.content}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-display font-black mb-8">
                Отправить заявку
              </h2>
              <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-6">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-3">
                  Что ускорит расчёт
                </div>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex gap-2">
                    <span className="material-icons-outlined text-primary text-base">check_circle</span>
                    Тип объекта и примерная площадь
                  </li>
                  <li className="flex gap-2">
                    <span className="material-icons-outlined text-primary text-base">check_circle</span>
                    Какие системы нужны (АПС, СКУД, СОТ, ЭОМ и т.д.)
                  </li>
                  <li className="flex gap-2">
                    <span className="material-icons-outlined text-primary text-base">check_circle</span>
                    Срок запуска объекта и ограничения по времени работ
                  </li>
                </ul>
              </div>
              
              {status === "success" ? (
                <div className="bg-primary/5 border-2 border-primary p-12 rounded-[2.5rem] text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons-outlined text-primary text-5xl">task_alt</span>
                  </div>
                  <h3 className="text-2xl font-display font-black text-foreground mb-4">
                    Заявка принята!
                  </h3>
                  <p className="text-muted-foreground font-medium mb-6">
                    Менеджер свяжется с вами в течение 15 минут
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-xs font-black uppercase tracking-[0.14em] text-primary hover:underline"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Имя
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-5 rounded-2xl border-2 border-border bg-background font-display font-bold text-lg focus:outline-none focus:border-primary transition-all"
                      placeholder="Иван Петров"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Телефон *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                      aria-invalid={status === "error" && Boolean(errorMessage)}
                      aria-describedby={errorMessage ? "contact-phone-error" : undefined}
                      className={cn(
                        "w-full px-6 py-5 rounded-2xl border-2 bg-background font-display font-bold text-lg focus:outline-none transition-all",
                        status === "error" ? "border-destructive" : "border-border focus:border-primary"
                      )}
                      placeholder="+7 (___) ___-__-__"
                    />
                    {errorMessage && (
                      <p
                        id="contact-phone-error"
                        className="text-destructive text-xs font-black uppercase tracking-[0.14em] mt-2"
                        role="alert"
                      >
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-5 rounded-2xl border-2 border-border bg-background font-display font-bold text-lg focus:outline-none focus:border-primary transition-all"
                      placeholder="example@mail.ru"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Сообщение
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-5 rounded-2xl border-2 border-border bg-background font-display font-bold text-lg focus:outline-none focus:border-primary transition-all resize-none"
                      placeholder="Опишите вашу задачу..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "loading"}
                    className={cn(
                      "w-full h-14 rounded-2xl text-base font-bold uppercase tracking-[0.2em]",
                      status === "loading" && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {status === "loading" ? "Отправка..." : "Отправить заявку"}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-[9px] text-muted-foreground font-bold uppercase tracking-[0.14em]">
                    <span>Нажимая кнопку, вы соглашаетесь с</span>
                    <Link href="/licenses" className="text-primary hover:underline">
                      политикой конфиденциальности
                    </Link>
                    <span>и</span>
                    <Link href="/licenses" className="text-primary hover:underline">
                      условиями обработки данных
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-display font-black mb-8">
                Как нас найти
              </h2>
              <div className="mb-6 rounded-2xl border border-border bg-card p-6">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-3">
                  Работа с объектами
                </div>
                <div className="space-y-3 text-sm font-medium text-foreground">
                  <p>Москва и Московская область — выезд инженера по графику или в срочном режиме.</p>
                  <p>Регионы — удалённый аудит + командировка инженерной группы по согласованию.</p>
                </div>
              </div>
              <div className="rounded-[2rem] overflow-hidden border border-border bg-muted h-[600px] relative group">
                {!loadMap ? (
                  <>
                    {/* Preview Image / Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <div className="text-center p-8">
                        <span className="material-icons-outlined text-6xl text-slate-400 mb-4">map</span>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.14em]">Карта загружается...</p>
                      </div>
                    </div>
                    {/* Click-to-load overlay */}
                    <button
                      onClick={() => setLoadMap(true)}
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Загрузить карту"
                    >
                      <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl text-center">
                        <span className="material-icons-outlined text-primary text-4xl mb-2">map</span>
                        <p className="text-sm font-bold text-foreground uppercase tracking-[0.14em]">Показать карту</p>
                        <p className="text-xs text-muted-foreground mt-1">Яндекс.Карты</p>
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

      {/* Requisites */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-display font-black text-center mb-12">
            Реквизиты компании
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {requisites.map((req) => (
              <div
                key={req.label}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <div className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  {req.label}
                </div>
                <div className="text-lg font-bold text-foreground">
                  {req.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
