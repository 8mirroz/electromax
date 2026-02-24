"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface LeadPayload {
  objectType: "office" | "warehouse" | "retail" | "industrial";
  areaSquareMeters: number;
  complexityCoef: number;
  estimatedPrice: number;
  contactPhone: string;
}

interface CalculatorFormProps {
  basePrice: number;
  serviceSlug: string;
  onLeadCapture?: (payload: LeadPayload) => Promise<{ success: boolean; error?: string }>;
}

const COMPLEXITY_MAP = {
  office: 1.0,
  retail: 1.2,
  warehouse: 0.8,
  industrial: 1.5,
};

const OBJECT_LABELS = {
  office: "Офисное помещение",
  retail: "Торговая площадь",
  warehouse: "Склад",
  industrial: "Промышленный объект",
};

export function CalculatorForm({ basePrice, serviceSlug, onLeadCapture }: CalculatorFormProps) {
  const [objectType, setObjectType] = useState<keyof typeof COMPLEXITY_MAP>("office");
  const [area, setArea] = useState<number>(100);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complexityCoef = COMPLEXITY_MAP[objectType];
  const estimatedPrice = Math.round(basePrice * area * complexityCoef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError("Пожалуйста, введите телефон");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: LeadPayload = {
      objectType,
      areaSquareMeters: area,
      complexityCoef,
      estimatedPrice,
      contactPhone: phone,
    };

    try {
      if (onLeadCapture) {
        const res = await onLeadCapture(payload);
        if (res.success) {
          setSuccess(true);
        } else {
          setError(res.error || "Произошла ошибка при отправке");
        }
      } else {
        // Fallback simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSuccess(true);
      }
    } catch (err) {
      setError("Ошибка сети");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 bg-green-50 dark:bg-green-950/20 text-green-900 border border-green-200 dark:border-green-900 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-2xl font-bold mb-2">Спасибо за заявку!</h3>
        <p className="text-center opacity-80">
          Мы получили ваши данные. Примерная стоимость: {estimatedPrice.toLocaleString("ru-RU")}{" "}
          руб. Наш инженер свяжется с вами в течение 10 минут.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-card text-card-foreground border rounded-2xl shadow-sm w-full max-w-xl mx-auto">
      <h3 className="text-2xl font-extrabold tracking-tight mb-6">Калькулятор стоимости</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Тип объекта</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(COMPLEXITY_MAP) as Array<keyof typeof COMPLEXITY_MAP>).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setObjectType(type)}
                className={cn(
                  "px-4 py-2 border rounded-xl text-sm font-medium transition-colors",
                  objectType === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800",
                )}
              >
                {OBJECT_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Площадь объекта: {area} м²</label>
          <input
            type="range"
            min="20"
            max="2000"
            step="10"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="p-4 bg-muted text-muted-foreground rounded-xl flex justify-between items-center">
          <span className="font-medium">Примерная стоимость:</span>
          <span className="text-2xl font-bold text-foreground">
            {estimatedPrice.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Контактный телефон</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 000-00-00"
            className="w-full px-4 py-3 border bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Отправка..." : "Получить точный расчет"}
        </button>
      </form>
    </div>
  );
}
