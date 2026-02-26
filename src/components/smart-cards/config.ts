import type { ConfigOption } from "./types";
import type { CatalogItem } from "@/types";

export const SERVICE_CONFIGS: Record<string, ConfigOption[]> = {
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
    },
    {
      id: "systems",
      label: "Системы",
      type: "button",
      options: ["СОТ", "СОТ+СКУД", "Комплекс"],
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

export function getServiceType(itemName: string): string {
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

export function calculatePrice(
  item: CatalogItem,
  options: Record<string, string>,
  configs: ConfigOption[],
): { min: number; max: number } {
  const baseMin = item.priceMin || 0;
  const baseMax = item.priceMax || baseMin;

  let multiplier = 1;
  let addition = 0;

  configs.forEach((config) => {
    const value = options[config.id];
    if (!value) return;

    if (config.priceMultiplier && config.options) {
      const index = config.options.indexOf(value);
      if (index > 0) {
        multiplier += (config.priceMultiplier - 1) * (index / (config.options.length - 1));
      }
    }

    if (config.priceAddition !== undefined && config.options) {
      const index = config.options.indexOf(value);
      addition += config.priceAddition * index;
    }
  });

  return {
    min: Math.round(baseMin * multiplier + addition),
    max: Math.round(baseMax * multiplier + addition),
  };
}
