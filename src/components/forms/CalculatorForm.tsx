"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Turnstile } from "@marsidev/react-turnstile";
import { isValidRuPhone, type LeadApiResponse, type LeadPayload } from "@/lib/leads";
import { formatPhone } from "@/lib/phone";
import { Building2, Warehouse, Factory, Store, Ruler, Layers, Phone, ArrowRight, ShieldCheck, Zap, Info } from "lucide-react";
import { RainbowButton } from "@/components/ui/RainbowButton";

interface CalculatorFormProps {
  basePrice: number;
  complexityMap: Record<string, number>;
}

const OBJECT_TYPES = [
  { id: "office", label: "Офисный центр", icon: Building2 },
  { id: "warehouse", label: "Складской комплекс", icon: Warehouse },
  { id: "industrial", label: "Производство", icon: Factory },
  { id: "mall", label: "Торговый центр", icon: Store },
];

export function CalculatorForm({ basePrice, complexityMap }: CalculatorFormProps) {
  const [mounted, setMounted] = useState(false);
  const [objectType, setObjectType] = useState("office");
  const [area, setArea] = useState(100);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const complexityCoef = complexityMap[objectType] || 1.0;
  const estimatedPrice = Math.round(area * basePrice * complexityCoef);
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const ymLeadGoal = process.env.NEXT_PUBLIC_YANDEX_METRIKA_GOAL_LEAD_FORM || "lead_form_submitted";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidRuPhone(phone)) {
      setErrorMessage("Введите номер в формате +7 (999) 123-45-67");
      setStatus("error");
      return;
    }

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token) {
      setErrorMessage("Пожалуйста, подтвердите, что вы не робот");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const payload: LeadPayload = {
        objectType,
        areaSquareMeters: area,
        complexityCoef,
        estimatedPrice,
        contactPhone: phone,
        turnstileToken: token || undefined,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as LeadApiResponse;

      if (res.ok && data.success) {
        setStatus("success");
        if (ymId && typeof window !== "undefined" && typeof window.ym === "function") {
          window.ym(Number(ymId), "reachGoal", ymLeadGoal);
        }
      } else {
        throw new Error(data.error || "Не удалось отправить заявку. Попробуйте позже.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка сети. Попробуйте позже.";
      setErrorMessage(msg);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-background border-2 border-primary/50 p-12 rounded-[3rem] shadow-2xl text-center animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint opacity-[0.05] pointer-events-none" />
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white mx-auto mb-10 shadow-xl relative z-10">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-display font-black text-foreground mb-4 uppercase tracking-tighter relative z-10">ПРОТОКОЛ ИНИЦИИРОВАН</h2>
        <p className="text-muted-foreground font-medium mb-12 leading-relaxed relative z-10">
          Инженерный отдел получил ваши данные. Связь будет установлена в течение 15 минут.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-xs font-black uppercase tracking-[0.2em] text-primary hover:text-blue-700 transition-colors relative z-10 min-h-[44px] px-4"
        >
          Новый расчёт
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border/50 rounded-[3rem] shadow-2xl overflow-hidden group">
      <div className="bg-foreground p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-blueprint opacity-[0.05] pointer-events-none" />
        <div className="flex flex-col gap-1 relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Конфигуратор систем</div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">ИНЖЕНЕРНЫЙ КОНФИГУРАТОР</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-12">
        {/* Progress */}
        <div className="flex items-center gap-6">
          <div className="flex-1 h-[2px] bg-border relative">
            <div className="absolute inset-0 bg-primary w-2/3 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Шаг 02/03</span>
        </div>

        {/* Object Type */}
        <div className="space-y-8">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
            <Layers className="w-4 h-4 text-primary" />
            Тип объекта
          </label>
          <div className="grid grid-cols-2 gap-4">
            {OBJECT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setObjectType(type.id)}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden",
                  objectType === type.id
                    ? "border-primary/50 bg-primary/5 text-primary shadow-xl shadow-primary/5"
                    : "border-border/50 bg-background text-muted-foreground hover:border-primary/30"
                )}
              >
                <type.icon className={cn(
                  "w-5 h-5 transition-transform duration-500",
                  objectType === type.id ? "scale-110 rotate-3" : ""
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                {objectType === type.id && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-primary m-2 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Area Slider */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
              <Ruler className="w-4 h-4 text-primary" />
              AREA SPECIFICATION
            </label>
            <div className="bg-muted/50 px-5 py-2 rounded-lg text-lg font-black text-foreground border border-border/50 font-display">
              {area} <span className="text-[10px] text-muted-foreground uppercase opacity-50 ml-1">SQM</span>
            </div>
          </div>
          <input
            type="range"
            min="50"
            max="5000"
            step="50"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full h-[2px] bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Pricing Display */}
        <div className="p-10 rounded-[2.5rem] glass border border-primary/20 flex flex-col gap-6 relative overflow-hidden group/pricing">
          <div className="absolute inset-0 bg-blueprint opacity-[0.02] pointer-events-none" />
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">CALCULATED VALUATION [±15%]</div>
          <div className="text-4xl md:text-5xl font-display font-black text-primary tracking-tighter flex items-baseline gap-2">
            {mounted ? estimatedPrice.toLocaleString('ru-RU') : '---'}
            <span className="text-xl font-bold opacity-30">₽</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-emerald-500 uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Optimal industrial tier</span>
          </div>
        </div>

        {/* Lead Capture Form */}
        <div className="space-y-8 pt-4">
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              aria-invalid={status === "error" && Boolean(errorMessage)}
              aria-describedby={errorMessage ? "calculator-phone-error" : undefined}
              className={cn(
                "w-full pl-16 pr-6 py-6 rounded-2xl border bg-background font-display font-black text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-500",
                status === "error" ? "border-destructive animate-shake" : "border-border/50 focus:border-primary/50 shadow-sm"
              )}
            />
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center gap-2 text-destructive">
              <Info className="w-4 h-4" />
              <p id="calculator-phone-error" role="alert" className="text-[10px] font-black uppercase tracking-widest">
                {errorMessage}
              </p>
            </div>
          )}

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="flex justify-center py-2">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={setToken}
              />
            </div>
          )}

          <RainbowButton
            type="submit"
            disabled={status === "loading"}
            className="w-full h-20 shadow-none text-[10px] font-black tracking-[0.3em]"
          >
            {status === "loading" ? "UPLOADING DATA..." : "GET SPECIFICATION"}
          </RainbowButton>

          <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-[0.2em] leading-relaxed opacity-50">
            Secure connection established. Data is encrypted <br />according to ISO/IEC 27001 standards.
          </p>
        </div>
      </form>
    </div>
  );
}

declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string) => void;
  }
}
