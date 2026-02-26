"use client";

import { useState } from "react";
import type { CatalogItem, ServiceCatalogSection } from "@/types";
import { formatCatalogItemPrice } from "@/lib/services-content";

// Опции конфигурации для миниблоков
interface ConfigOption {
  id: string;
  label: string;
  type: "button" | "input";
  priceMultiplier?: number;
  priceAddition?: number;
  placeholder?: string;
  options?: string[];
}

// Конфигурация миниблоков по типам услуг
const SERVICE_CONFIGS: Record<string, ConfigOption[]> = {
  audit: [
    {
      id: "object_type",
      label: "Тип объекта",
      type: "button",
      options: ["Офис", "Склад", "Производство", "Торговля"],
    },
    { id: "area", label: "Площадь (м²)", type: "input", placeholder: "Например: 500" },
    {
      id: "urgency",
      label: "Срочность",
      type: "button",
      options: ["Стандарт", "Срочно (48ч)", "Экспресс (24ч)"],
      priceAddition: 0,
    },
    {
      id: "systems",
      label: "Системы",
      type: "button",
      options: ["СОТ", "СОТ+СКУД", "Комплекс"],
      priceMultiplier: 1,
    },
    {
      id: "report_format",
      label: "Формат отчета",
      type: "button",
      options: ["PDF", "PDF+Excel", "Презентация"],
    },
    {
      id: "consultation",
      label: "Консультация",
      type: "button",
      options: ["Без консультации", "30 мин", "1 час"],
      priceAddition: 0,
    },
  ],
  design: [
    {
      id: "object_type",
      label: "Тип объекта",
      type: "button",
      options: ["Офис", "Склад", "Производство", "Торговля"],
    },
    {
      id: "cameras_count",
      label: "Кол-во камер",
      type: "input",
      placeholder: "Например: 16",
    },
    {
      id: "resolution",
      label: "Разрешение",
      type: "button",
      options: ["2MP", "4MP", "8MP", "4K"],
    },
    { id: "storage_days", label: "Архив (дней)", type: "input", placeholder: "30" },
    {
      id: "analytics",
      label: "Аналитика",
      type: "button",
      options: ["Базовая", "Распознавание лиц", "Полный AI"],
    },
    {
      id: "integration",
      label: "Интеграция",
      type: "button",
      options: ["Нет", "СКУД", "СКУД+ОПС", "Полная"],
    },
  ],
  montage: [
    {
      id: "cable_type",
      label: "Тип кабеля",
      type: "button",
      options: ["Витая пара", "Комбинированный", "Оптика"],
    },
    {
      id: "cable_length",
      label: "Длина (м)",
      type: "input",
      placeholder: "Пример: 500",
    },
    {
      id: "mounting_type",
      label: "Монтаж",
      type: "button",
      options: ["Открытый", "Закладка", "Гофра/Кабель-канал"],
    },
    {
      id: "height",
      label: "Высота работ",
      type: "button",
      options: ["До 3м", "3-6м", "Выше 6м"],
    },
    {
      id: "power_supply",
      label: "Питание",
      type: "button",
      options: ["PoE", "Отдельное", "Комбинированное"],
    },
    {
      id: "testing",
      label: "Тестирование",
      type: "button",
      options: ["Базовое", "Полное", "С нагрузкой"],
    },
  ],
  commissioning: [
    {
      id: "devices_count",
      label: "Устройств",
      type: "input",
      placeholder: "Количество",
    },
    {
      id: "network_setup",
      label: "Настройка сети",
      type: "button",
      options: ["DHCP", "Статика", "VLAN"],
    },
    {
      id: "remote_access",
      label: "Удаленка",
      type: "button",
      options: ["Локально", "Облако", "VPN"],
    },
    {
      id: "notifications",
      label: "Оповещения",
      type: "button",
      options: ["Email", "SMS", "Telegram", "Все"],
    },
    {
      id: "backup",
      label: "Резервирование",
      type: "button",
      options: ["Нет", "RAID 1", "RAID 5", "Облако"],
    },
    {
      id: "training",
      label: "Обучение",
      type: "button",
      options: ["Без обучения", "1 час", "2 часа", "Полный курс"],
    },
  ],
  documentation: [
    {
      id: "doc_type",
      label: "Тип документа",
      type: "button",
      options: ["Исполнительная", "ППР", "ПТМ", "Полный пакет"],
    },
    { id: "pages", label: "Объем (стр.)", type: "input", placeholder: "Пример: 50" },
    {
      id: "drawings",
      label: "Чертежи",
      type: "button",
      options: ["Нет", "Простые", "3D визуализация"],
    },
    {
      id: "approval",
      label: "Согласование",
      type: "button",
      options: ["Нет", "МЧС", "Эксплуатация", "Полное"],
    },
    { id: "copies", label: "Копии", type: "input", placeholder: "Количество экз." },
    {
      id: "urgency",
      label: "Срочность",
      type: "button",
      options: ["Стандарт", "Срочно", "Экспресс"],
    },
  ],
  maintenance: [
    {
      id: "contract_type",
      label: "Тип договора",
      type: "button",
      options: ["Разовый", "3 мес", "6 мес", "12 мес"],
    },
    { id: "cameras_count", label: "Камер", type: "input", placeholder: "Количество" },
    {
      id: "visit_frequency",
      label: "Выезды",
      type: "button",
      options: ["По вызову", "1/мес", "2/мес", "4/мес"],
    },
    {
      id: "response_time",
      label: "Реакция",
      type: "button",
      options: ["24ч", "8ч", "4ч", "2ч"],
    },
    {
      id: "spare_parts",
      label: "ЗИП",
      type: "button",
      options: ["Не включен", "Базовый", "Полный"],
    },
    {
      id: "reports",
      label: "Отчеты",
      type: "button",
      options: ["Нет", "По факту", "Ежемесячно"],
    },
  ],
  camera: [
    {
      id: "camera_type",
      label: "Тип камеры",
      type: "button",
      options: ["Купольная", "Цилиндр", "PTZ", "Панорамная"],
    },
    {
      id: "resolution",
      label: "Разрешение",
      type: "button",
      options: ["2MP", "4MP", "8MP", "4K"],
    },
    {
      id: "lens",
      label: "Объектив",
      type: "button",
      options: ["Фикс", "Вариофокал", "Моторизованный"],
    },
    { id: "quantity", label: "Количество", type: "input", placeholder: "шт" },
    {
      id: "installation",
      label: "Монтаж",
      type: "button",
      options: ["Только поставка", "С монтажом", "Под ключ"],
    },
    {
      id: "warranty",
      label: "Гарантия",
      type: "button",
      options: ["Стандарт", "+1 год", "+2 года"],
    },
  ],
  default: [
    {
      id: "object_type",
      label: "Тип объекта",
      type: "button",
      options: ["Офис", "Склад", "Производство", "Торговля"],
    },
    { id: "area", label: "Площадь (м²)", type: "input", placeholder: "Например: 500" },

    {
      id: "timeline",
      label: "Сроки",
      type: "button",
      options: ["Стандарт", "Ускоренно", "Срочно"],
    },
    {
      id: "add_services",
      label: "Доп. услуги",
      type: "button",
      options: ["Нет", "Обучение", "Поддержка", "Все"],
    },
    {
      id: "payment",
      label: "Оплата",
      type: "button",
      options: ["Предоплата", "Поэтапно", "Постоплата"],
    },
  ],
};

// Определить тип услуги по названию
function getServiceType(itemName: string): string {
  const name = itemName.toLowerCase();
  if (name.includes("аудит")) return "audit";
  if (name.includes("проект") || name.includes("тз")) return "design";
  if (name.includes("монтаж")) return "montage";
  if (name.includes("пуск") || name.includes("наладка")) return "commissioning";
  if (name.includes("документ") || name.includes("исполнительн")) return "documentation";
  if (name.includes("обслуживание") || name.includes("то")) return "maintenance";
  if (name.includes("камер") || name.includes("ip")) return "camera";
  return "default";
}

function getServiceBadge(item: CatalogItem): string {
  return item.category || "Услуга";
}

// Интерфейс для выбранных опций
interface SelectedOptions {
  [itemId: string]: {
    [optionId: string]: string;
  };
}

// Интерфейс для рассчитанных цен
interface CalculatedPrices {
  [itemId: string]: {
    min: number;
    max: number;
  };
}

export function ServiceCatalogAccordionTable({
  sections,
  onAddItem,
}: {
  sections: ServiceCatalogSection[];
  onAddItem: (
    item: CatalogItem,
    options?: Record<string, string>,
    calculatedPrice?: { min: number; max: number },
  ) => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [calculatedPrices, setCalculatedPrices] = useState<CalculatedPrices>({});

  const handleOptionChange = (item: CatalogItem, optionId: string, value: string) => {
    const newOptions = {
      ...(selectedOptions[item.id] || {}),
      [optionId]: value,
    };

    setSelectedOptions((prev) => ({
      ...prev,
      [item.id]: newOptions,
    }));

    // Автоматический пересчет цены
    const price = calculatePrice(item, newOptions);
    setCalculatedPrices((prev) => ({
      ...prev,
      [item.id]: price,
    }));
  };

  const calculatePrice = (
    item: CatalogItem,
    options: Record<string, string>,
  ): { min: number; max: number } => {
    const baseMin = item.priceMin || 0;
    const baseMax = item.priceMax || baseMin;

    let multiplier = 1;
    let addition = 0;

    const serviceType = getServiceType(item.name);
    const configs = SERVICE_CONFIGS[serviceType] || SERVICE_CONFIGS.default;

    configs.forEach((config) => {
      const value = options[config.id];
      if (!value) return;

      if (config.priceMultiplier) {
        if (config.options) {
          const index = config.options.indexOf(value);
          if (index > 0) {
            multiplier += (config.priceMultiplier - 1) * (index / (config.options.length - 1));
          }
        }
      }

      if (config.priceAddition !== undefined) {
        if (config.options) {
          const index = config.options.indexOf(value);
          addition += config.priceAddition * index;
        }
      }
    });

    return {
      min: Math.round(baseMin * multiplier + addition),
      max: Math.round(baseMax * multiplier + addition),
    };
  };



  const handleAddToProject = (item: CatalogItem) => {
    const options = selectedOptions[item.id] || {};
    const price = calculatedPrices[item.id];
    onAddItem(item, options, price);
  };

  return (
    <section className="space-y-4" aria-labelledby="service-catalog-title">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Перечень услуг
          </div>
          <h2
            id="service-catalog-title"
            className="text-xl font-display font-black uppercase tracking-tight sm:text-2xl"
          >
            Добавьте позиции в проект
          </h2>
        </div>
      </div>

      {sections.map((section) => (
        <div
          key={section.id}
          className="overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.45)]"
        >
          <div className="border-b border-border/70 bg-slate-950 px-5 py-4 text-white">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-semibold uppercase tracking-wide">{section.title}</h3>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                Прайс + конфигуратор
              </span>
            </div>
            {section.description ? (
              <p className="mt-2 text-xs text-white/70">{section.description}</p>
            ) : null}
          </div>

          {/* Убрана колонка "Комментарий" */}
          <div className="hidden grid-cols-[minmax(0,1.6fr)_120px_180px_160px] gap-3 border-b border-border/70 bg-white/80 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:grid">
            <div>Позиция</div>
            <div>Ед.</div>
            <div>Бюджет</div>
            <div className="text-right">Действие</div>
          </div>

          <div className="divide-y divide-border/70" data-testid="service-catalog-table">
            {section.items.map((item) => {
              const calculatedPrice = calculatedPrices[item.id];
              const serviceType = getServiceType(item.name);
              const configs = SERVICE_CONFIGS[serviceType] || SERVICE_CONFIGS.default;
              const currentOptions = selectedOptions[item.id] || {};

              return (
                <details
                  key={item.id}
                  className="group"
                  data-testid={`catalog-row-${item.itemCode}`}
                >
                  <summary className="list-none cursor-pointer px-4 py-3 transition-all group-open:bg-white group-open:shadow-[0_-4px_30px_rgba(255,255,255,0.8)] group-open:z-20 relative hover:bg-slate-50/80">
                    <div className="grid gap-2 md:grid-cols-[minmax(0,1.6fr)_100px_160px_140px] md:items-center">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-bold text-foreground">{item.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="rounded-full border border-border/70 bg-white px-2 py-0.5">
                              {getServiceBadge(item)}
                            </span>
                            <span className="text-foreground/40 text-[9px]">Код: {item.itemCode}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[13px] text-foreground/70">{item.unit}</div>
                      <div className="text-[13px] font-bold text-foreground">
                        {calculatedPrice ? (
                          <span className="text-emerald-600 font-black">
                            {calculatedPrice.min === calculatedPrice.max
                              ? `${calculatedPrice.min.toLocaleString("ru-RU")} ₽`
                              : `${calculatedPrice.min.toLocaleString("ru-RU")}–${calculatedPrice.max.toLocaleString("ru-RU")} ₽`}
                          </span>
                        ) : (
                          <span className="font-bold">{formatCatalogItemPrice(item)}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="h-8 rounded-lg bg-primary px-3 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
                          data-testid={`add-to-project-${item.itemCode}`}
                          onClick={(event) => {
                            event.preventDefault();
                            handleAddToProject(item);
                          }}
                        >
                          В проект
                        </button>
                      </div>
                    </div>
                  </summary>

                  <div className="border-t border-border/60 bg-white px-5 py-5 shadow-[0_15px_30px_-10px_rgba(255,255,255,1),0_10px_20px_-5px_rgba(0,0,0,0.02)] relative z-0">
                    <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                      {/* Левая часть: Что включено */}
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Что включено</div>
                        <ul className="space-y-2">
                          {(item.includes?.slice(0, 4) || ["Состав уточняется"]).map((entry) => (
                            <li key={entry} className="flex items-start gap-2 text-[12px] leading-relaxed text-foreground/80">
                              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                              {entry}
                            </li>
                          ))}
                        </ul>
                        {item.priceDependsOn && item.priceDependsOn.length > 0 && (
                          <div className="pt-2 border-t border-border/40">
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Цена зависит от</div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              {item.priceDependsOn[0]}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Правая часть: Конфигуратор */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">Конфигурация параметров</div>
                          {Object.keys(selectedOptions[item.id] || {}).length > 0 && (
                            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Параметры применены</div>
                          )}
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {configs.map((config) => (
                            <div key={config.id} className="rounded-xl border border-border/50 bg-slate-50/30 p-2.5 transition-colors hover:border-border hover:bg-slate-50/60">
                              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                {config.label}
                              </div>
                              {config.type === "input" ? (
                                <input
                                  type="text"
                                  placeholder={config.placeholder}
                                  value={currentOptions[config.id] || ""}
                                  onChange={(e) => handleOptionChange(item, config.id, e.target.value)}
                                  className="w-full rounded-lg border border-border/60 bg-white px-2.5 py-1.5 text-[12px] focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/5"
                                />
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {config.options?.map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => handleOptionChange(item, config.id, option)}
                                      className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-tight transition-all ${currentOptions[config.id] === option
                                        ? "border-primary bg-primary text-white"
                                        : "border-border/60 bg-white hover:border-border hover:bg-slate-50 text-foreground/70"
                                        }`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
