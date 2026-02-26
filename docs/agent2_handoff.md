# Agent 2 Handoff Report — Complete

**Дата:** 2026-02-24  
**Статус:** ✅ Завершено  
**Готово для:** Agent 3 (Frontend)

---

## 📦 Созданные артефакты

| #   | Файл                                  | Назначение                     |
| --- | ------------------------------------- | ------------------------------ |
| 1   | `src/generated/services-content.json` | Полный контент для 10 сервисов |
| 2   | `src/generated/services-index.ts`     | Экспорты slug и типов          |
| 3   | `src/generated/content-meta.json`     | Метаданные генерации           |
| 4   | `scripts/import-services-xlsx.ts`     | Скрипт импорта XLSX → JSON     |
| 5   | `docs/xlsx_schema_spec.md`            | Спецификация XLSX workbook     |

---

## 🗂️ Структура Generated Content

### services-content.json

```json
{
  "schemaVersion": "1.0",
  "generatedAt": "2026-02-24T00:00:00.000Z",
  "services": [
    {
      "slug": "aps",
      "title": "Автоматическая пожарная сигнализация",
      "shortName": "АПС",
      "theme": { "accent": "#2563eb", ... },
      "hero": { ... },
      "stats": [ ... ],
      "solutionKits": [ ... ],
      "catalog": [ ... ],
      "process": [ ... ],
      "aiRules": [ ... ],
      "seo": { ... },
      "faq": [ ... ],
      "benchmarks": [ ... ]
    },
    // ... ещё 9 сервисов
  ]
}
```

### services-index.ts экспорты

```typescript
export const SERVICE_SLUGS = ["aps", "asuz", "eo", "eom", "os", "sks", "skud", "sot", "soue", "to"];
export const GENERATED_SERVICE_SLUGS = SERVICE_SLUGS; // alias
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type GeneratedServiceSlug = ServiceSlug;
```

---

## 📊 10 Сервисов в базе

| Slug   | Title                                | Base Price    | CTA                    |
| ------ | ------------------------------------ | ------------- | ---------------------- |
| `aps`  | Автоматическая пожарная сигнализация | 350 ₽/м²      | Заказать аудит объекта |
| `asuz` | Автоматизация и диспетчеризация      | request       | Заказать аудит         |
| `eo`   | Система освещения                    | 900 ₽/м²      | Рассчитать экономию    |
| `eom`  | Электроснабжение и силовые сети      | 1500 ₽/м²     | Бесплатный выезд       |
| `os`   | Охранная сигнализация                | 350 ₽/м²      | Тест-драйв системы     |
| `sks`  | Структурированные кабельные системы  | 3000 ₽/м²     | Аудит сети             |
| `skud` | Система контроля доступа             | 15000 ₽/точка | Демо на объекте        |
| `sot`  | Видеонаблюдение                      | 600 ₽/м²      | Тест камеры            |
| `soue` | Система оповещения                   | 250 ₽/м²      | Акустический расчёт    |
| `to`   | Техническое обслуживание             | 5000 ₽/мес    | Первый месяц бесплатно |

---

## 🛠️ Скрипт импорта

### Использование

```bash
# Базовый запуск
pnpm tsx scripts/import-services-xlsx.ts

# С указанием путей
pnpm tsx scripts/import-services-xlsx.ts --input ./docs/services-workbook.xlsx --output ./src/generated/

# Dry-run (валидация без записи)
pnpm tsx scripts/import-services-xlsx.ts --dry-run
```

### Валидация

- ✅ Проверка обязательных полей (slug, title, shortName, description)
- ✅ Проверка типов данных
- ✅ Проверка ссылочной целостности
- ✅ Вывод понятных ошибок для контент-менеджера

---

## 📋 Контент для каждого сервиса

### Минимальный набор (гарантирован скриптом)

| Блок          | Количество | Данные                                             |
| ------------- | ---------- | -------------------------------------------------- |
| Stats Cards   | 4          | "500+ объектов", "Class A", "12 лет", "24/7"       |
| Solution Kits | 0-3        | Заполняется из XLSX                                |
| Catalog Items | 5-15       | Заполняется из XLSX                                |
| Process Steps | 5          | Аудит → Проектирование → Поставка → Монтаж → Сдача |
| AI Rules      | 3          | Кросс-продажи, зависимости                         |
| FAQ Items     | 8          | Schema.org совместимые                             |
| Benchmarks    | 2          | Диапазоны цен из конкурентов                       |

---

## 🎨 Agent 3 (Frontend) — следующие шаги

### 1. Компоненты UI

Создать в `src/components/services/`:

- [ ] `ServiceHeroCompact.tsx`
- [ ] `ServiceStatsStrip.tsx`
- [ ] `SolutionKitsGrid.tsx`
- [ ] `AiAssistantRail.tsx`
- [ ] `ServiceCatalogAccordionTable.tsx`
- [ ] `ProcessRoadmapMini.tsx`
- [ ] `ProjectTrayDrawer.tsx`
- [ ] `SeoContentBlock.tsx`
- [ ] `FaqAccordion.tsx`
- [ ] `StickyProjectButton.tsx`

### 2. Hooks

Создать в `src/hooks/`:

- [ ] `useProjectTray.ts` — LocalStorage v1
- [ ] `useAiAssistantRules.ts` — rules engine

### 3. Утилиты

Создать в `src/lib/`:

- [ ] `project-tray.ts` — контракт Project Tray

### 4. Интеграция

Обновить `src/app/services/[slug]/page.tsx`:

- [ ] Подключить `services-content.json`
- [ ] Рендеринг 8 блоков страницы
- [ ] Project Tray integration
- [ ] AI rail integration
- [ ] SEO блок + JSON-LD

---

## 🔗 Контракты данных

### Project Tray v1 (LocalStorage)

```typescript
interface ProjectTrayState {
  serviceSlug: string | null;
  items: ProjectTrayItem[];
  selectedKitIds: string[];
  notes: string;
  estimatedRange: ProjectTrayRange | null;
  updatedAt: string | null;
}

// Storage key: 'electromax-project-v1'
```

### AI Assistant Rail v1

```typescript
interface AiAssistRule {
  id: string;
  triggerType: "service_open" | "tray_empty" | "has_item" | "missing_category" | "selected_kit";
  triggerValue?: string;
  recommendItemCode?: string;
  recommendServiceSlug?: string;
  messageText: string;
  priority: number; // 1-10
}
```

### Catalog Item

```typescript
interface CatalogItem {
  id: string;
  itemCode: string;
  category: string;
  name: string;
  unit: string;
  priceType: "from" | "range" | "fixed" | "request";
  priceMin?: number;
  priceMax?: number;
  currency?: "RUB";
  comment?: string;
  objectTypes?: string[];
  leadTimeText?: string;
  includes?: string[];
  excludes?: string[];
  addToProjectDefaultQty?: number;
}
```

---

## ✅ Acceptance критерии для Agent 3

- [ ] Все 10 страниц рендерятся из generated data
- [ ] Hero compact по высоте, CTA один
- [ ] Project Tray работает между переходами (LocalStorage)
- [ ] AI rail sticky на desktop, fallback на mobile
- [ ] В каталоге услуг нет слова "корзина" (только "проект")
- [ ] Все CTA ведут в `проект`
- [ ] SEO блок и FAQ рендерятся, JSON-LD валиден
- [ ] Нет TypeScript ошибок
- [ ] Сборка проходит без ошибок

---

## 📞 Контакты для вопросов

**Agent 2 (Data/ContentOps):**

- Все данные в `src/generated/`
- Скрипт импорта: `scripts/import-services-xlsx.ts`
- Спецификация: `docs/xlsx_schema_spec.md`

**Для уточнений по типам:**

- `src/types/index.ts` — все интерфейсы
- `src/generated/services-index.ts` — экспорты slug

---

**Статус:** ✅ Готово к передаче  
**Следующий этап:** Agent 3 реализует UI компоненты
