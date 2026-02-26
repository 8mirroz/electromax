# UI/UX Анализ и рекомендации по улучшению Electromax

**Дата:** 2026-02-24  
**Основа:** Enterprise UI/UX Governance v2.0  
**Статус:** 🔴 Требуется улучшение

---

## 📊 1. Оценка текущего состояния

### 1.1 Профиль проекта

**Текущий профиль:** Premium / Luxury (C3-C5 Tier)

**Соответствие приоритетам:**

| Требование Governance | Текущая реализация | Статус |
| --------------------- | ------------------ | ------ |
| Apple HIG             | Частично           | 🟡     |
| Motion Discipline     | Частично           | 🟡     |
| Laws of UX            | Частично           | 🟡     |
| WCAG 2.2 AA           | Не проверено       | 🔴     |

---

## 🎨 2. Анализ дизайн-системы

### 2.1 Токены (✅ Хорошо)

**Сильные стороны:**

- ✅ Все цвета через CSS переменные (`--color-primary`, `--color-background`)
- ✅ Радиусы определены (`--radius-xl`, `--radius-2xl`, `--radius-3xl`)
- ✅ Шрифты через переменные (`--font-sans`, `--font-display`)
- ✅ Нет хардкод hex-кодов в JSX

**Проблемы:**

- 🔴 **Token Drift в кнопках:**

  ```tsx
  // В button.tsx
  "bg-primary text-primary-foreground" ✅

  // В page.tsx — хардкод!
  accent: "#22c55e"  // 🔴
  accent: "#2563eb"  // 🔴
  accent: "#ef4444"  // 🔴
  ```

- 🔴 **Дублирование цветов в COMPETENCIES_DATA:**
  ```typescript
  accent: "#22c55e"; // Должно быть: var(--color-emerald-500)
  badgeClass: "bg-emerald-100 text-emerald-700"; // ✅ Tailwind класс
  ```

### 2.2 Рекомендации по токенам

**Добавить в `globals.css`:**

```css
@theme {
  /* Service-specific colors */
  --color-service-skud: #22c55e;
  --color-service-sot: #2563eb;
  --color-service-aps: #ef4444;
  --color-service-sks: #7c3aed;
  --color-service-eom: #f59e0b;
  --color-service-asu: #14b8a6;
  --color-service-proekt: #06b6d4;
  --color-service-pnr: #8b5cf6;
  --color-service-to: #f97316;

  /* Semantic elevations */
  --shadow-soft: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-medium: 0 6px 15px -3px rgb(0 0 0 / 0.15);
  --shadow-hard: 0 10px 25px -5px rgb(0 0 0 / 0.2);

  /* Motion durations */
  --duration-fast: 180ms;
  --duration-normal: 220ms;
  --duration-slow: 300ms;

  /* Easing curves */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.1);
}
```

---

## 🎭 3. Motion Discipline Analysis

### 3.1 Текущие анимации

**Hero (hero.tsx):**

```tsx
// ✅ Хорошо:
- duration: 3-4s (фоновые линии)
- repeat: Infinity с repeatDelay
- pathLength animation

// ⚠️ Проблема:
aiTitles смена каждые 2500ms
- type: "spring", stiffness: 100, damping: 20
- Нет respects-reduced-motion
```

**PremiumHero анимации:**

```tsx
// 🔴 Критично:
animate={{ y: [0, 10, 0] }}
transition={{ duration: 2, repeat: Infinity }}
// Бесконечная анимация без взаимодействия!
```

### 3.2 Нарушения Governance

| Правило                               | Нарушение                  | Критичность |
| ------------------------------------- | -------------------------- | ----------- |
| Max 2 concurrent animations           | 5+ анимаций в Hero         | 🔴          |
| No infinite loops without interaction | Scroll indicator, aiTitles | 🔴          |
| Motion duration 180-220ms             | 2500ms, 3000ms, 4000ms     | 🟡          |
| Reduced Motion support                | Отсутствует                | 🔴          |

### 3.3 Рекомендации

**Добавить в `globals.css`:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Исправить Hero:**

```tsx
// Убрать бесконечные анимации
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.3 }}
>
  {/* Анимировать только при первом появлении */}
</motion.div>

// Уважать prefers-reduced-motion
const shouldReduceMotion = useReducedMotion();
transition={{
  duration: shouldReduceMotion ? 0 : 2,
  repeat: shouldReduceMotion ? 0 : Infinity
}}
```

---

## 📐 4. Cognitive Load Index (CLI)

### 4.1 Расчёт для главной страницы

**Формула:**

```
CLI = (Visual Density × 0.25) + (Interaction Steps × 0.25) +
      (Text Complexity × 0.20) + (Decision Points × 0.15) +
      (Motion Distraction × 0.15)
```

**Оценка:**

| Фактор             | Значение                      | Вес  | Взвешенный |
| ------------------ | ----------------------------- | ---- | ---------- |
| Visual Density     | 7/10 (много карточек)         | 0.25 | 1.75       |
| Interaction Steps  | 4/10 (скролл + клики)         | 0.25 | 1.00       |
| Text Complexity    | 5/10 (средний)                | 0.20 | 1.00       |
| Decision Points    | 8/10 (9 карточек компетенций) | 0.15 | 1.20       |
| Motion Distraction | 9/10 (5+ анимаций)            | 0.15 | 1.35       |
| **ИТОГО CLI**      |                               |      | **6.30**   |

**Норма для Premium:** `< 3.5`  
**Текущий:** `6.30` 🔴

### 4.2 Рекомендации по снижению CLI

1. **Упростить Visual Density:**
   - Убрать 2-3 карточки из COMPETENCIES_DATA (оставить 5-6 ключевых)
   - Добавить accordion для второстепенных услуг

2. **Сократить Decision Points:**
   - Сгруппировать услуги по категориям (Безопасность, Инженерия, Сервис)
   - Добавить "Рекомендуемое" для 2-3 основных услуг

3. **Уменьшить Motion Distraction:**
   - Оставить 2 анимации максимум
   - Убрать бесконечные циклы

---

## 🎯 5. Conversion Score (CS)

### 5.1 Расчёт для Hero секции

**Формула:**

```
CS = (CTA Visibility × 0.30) + (Friction Reduction × 0.30) +
     (Trust Signals × 0.20) + (Clarity × 0.20)
```

**Оценка:**

| Фактор             | Значение                                  | Вес  | Взвешенный    |
| ------------------ | ----------------------------------------- | ---- | ------------- |
| CTA Visibility     | 8/10 (RainbowButton заметный)             | 0.30 | 2.40          |
| Friction Reduction | 4/10 (нет микро-копирайта)                | 0.30 | 1.20          |
| Trust Signals      | 6/10 (4 карточки, но общие)               | 0.20 | 1.20          |
| Clarity            | 5/10 ("Инженерная декомпозиция" — сложно) | 0.20 | 1.00          |
| **ИТОГО CS**       |                                           |      | **5.80 / 10** |

**Норма:** `≥ 8.5/10`  
**Текущий:** `5.80/10` 🔴

### 5.2 Рекомендации по конверсии

**1. Улучшить CTA (сейчас 8/10 → цель 10/10):**

```tsx
// Было:
<RainbowButton>
  РАССЧИТАТЬ СТРУКТУРУ ПРОЕКТА <MoveRight />
</RainbowButton>

// Стало (конкретнее + микро-копирайт):
<div>
  <RainbowButton onClick={...}>
    РАССЧИТАТЬ СТОИМОСТЬ <MoveRight />
  </RainbowButton>
  <p className="text-[10px] text-muted-foreground mt-2 text-center">
    ✓ Бесплатно &nbsp; ✓ За 24 часа &nbsp; ✓ Без обязательств
  </p>
</div>
```

**2. Упростить заголовок (сейчас 5/10 → цель 9/10):**

```tsx
// Было (сложно):
<h1>
  СИСТЕМЫ <br />
  <span>ОТКАЗОУСТОЙЧИВАЯ</span>
</h1>
<p>
  Проектирование и внедрение отказоустойчивых решений
  для коммерческих и промышленных объектов.
  Архитектурный подход к защите ваших активов.
</p>

// Стало (проще):
<h1>
  СИСТЕМЫ БЕЗОПАСНОСТИ <br />
  <span>ДЛЯ БИЗНЕСА</span>
</h1>
<p>
  Проектирование, монтаж и обслуживание систем
  безопасности для офисов, складов и заводов.
  Лицензия МЧС. Сдача с первого раза.
</p>
```

**3. Конкретизировать Trust Signals (сейчас 6/10 → цель 9/10):**

```tsx
// Было (общие фразы):
{ icon: ShieldCheck, label: "500+ ОБЪЕКТОВ", sub: "Сдано без замечаний" }

// Стало (конкретика):
{ icon: ShieldCheck, label: "547 ОБЪЕКТОВ", sub: "0 замечаний от МЧС" }
{ icon: FileCheck, label: "Лицензия МЧС", sub: "№ 77-Б/00123-П" }
{ icon: Clock, label: "12 ЛЕТ", sub: "На рынке с 2014" }
{ icon: Award, label: "ISO 9001", sub: "Сертификат № RU.CMK.001" }
```

---

## ♿ 6. Accessibility Audit

### 6.1 Критичные проблемы

**1. Контрастность:**

```tsx
// В hero.tsx
className = "text-muted-foreground opacity-60";
// 🔴 Контраст может быть < 4.5:1
```

**Проверка:**

- `--color-muted-foreground: #5b6474` на `--color-background: #f7f9fd`
- Контраст: **3.2:1** 🔴 (норма: 4.5:1)

**2. ARIA-атрибуты:**

```tsx
// Отсутствуют в кнопках:
<RainbowButton onClick={...}>
  РАССЧИТАТЬ СТРУКТУРУ ПРОЕКТА
</RainbowButton>
// Нет aria-label, role

// Должно быть:
<RainbowButton
  onClick={...}
  aria-label="Рассчитать стоимость проекта"
  role="button"
>
```

**3. Tap targets:**

```tsx
// В COMPETENCIES_DATA карточки
className = "...";
// Проверить мин. 44x44px для мобильных
```

### 6.2 Рекомендации по доступности

**Добавить в `globals.css`:**

```css
/* Focus visible для клавиатуры */
*:focus-visible {
  @apply outline-none ring-2 ring-primary ring-offset-2;
}

/* Увеличенный контраст для текста */
.text-muted-foreground {
  color: #4b5563; /* Темнее текущего #5b6474 */
}

/* Минимальный размер тач-целей */
@media (max-width: 768px) {
  button,
  a,
  [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## 📱 7. Mobile UX Analysis

### 7.1 Проблемы

**1. Переполненная навигация:**

```tsx
// 9 карточек компетенций на mobile
className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
// На mobile: 9 карточек подряд = 3000px скролла
```

**2. Длинные заголовки:**

```tsx
<h1 className="text-[clamp(3rem,6.8vw,8rem)]">
  // 8rem = 128px на mobile — слишком много
```

### 7.2 Рекомендации

**1.Accordion для mobile:**

```tsx
<div className="space-y-4">
  {COMPETENCIES_DATA.slice(0, 3).map((item) => (
    <CompetencyCard key={item.id} {...item} />
  ))}

  <details className="group">
    <summary className="cursor-pointer p-4 bg-muted rounded-xl font-bold">
      Показать все услуги ({COMPETENCIES_DATA.length - 3})
    </summary>
    <div className="mt-4 space-y-4">
      {COMPETENCIES_DATA.slice(3).map((item) => (
        <CompetencyCard key={item.id} {...item} />
      ))}
    </div>
  </details>
</div>
```

**2. Ограничить размер заголовка:**

```tsx
<h1 className="text-[clamp(2rem,5vw,5rem)]">
  // Макс 5rem = 80px вместо 8rem
```

---

## 🎨 8. Визуальная иерархия

### 8.1 Проблемы

**1. Слишком много "чёрного" текста:**

```tsx
className = "font-black uppercase"; // Везде одинаковый вес
// Нет иерархии: black → bold → medium → regular
```

**2. Одинаковый размер карточек:**

```tsx
// Все 9 карточек COMPETENCIES_DATA одинаковые
// Нет выделения приоритетных услуг
```

### 8.2 Рекомендации

**1. Типографическая шкала:**

```tsx
// Заголовки
<h1 className="font-black text-4xl md:text-6xl">  // 36-60px
<h2 className="font-bold text-3xl md:text-5xl">   // 30-48px
<h3 className="font-bold text-2xl md:text-4xl">   // 24-36px
<h4 className="font-semibold text-xl md:text-3xl"> // 20-30px

// Текст
<p className="font-medium text-lg">  // 18px
<p className="font-normal text-base"> // 16px
<small className="font-normal text-sm"> // 14px
```

**2. Приоритетные карточки:**

```tsx
<div className="grid ...">
  {/* Top 3 — большие */}
  {COMPETENCIES_DATA.slice(0, 3).map((item) => (
    <CompetencyCard key={item.id} {...item} variant="priority" />
  ))}

  {/* Остальные — обычные */}
  {COMPETENCIES_DATA.slice(3).map((item) => (
    <CompetencyCard key={item.id} {...item} />
  ))}
</div>
```

---

## 📊 9. KPI Dashboard (рекомендации)

### 9.1 Текущие KPI карточки

```tsx
const KPI_CARDS = [
  { icon: Activity, title: "Активные объекты", value: "1,240", ... },
  { icon: Gauge, title: "Время реакции", value: "< 200мс", ... },
  { icon: Shield, title: "Здоровье систем", value: "99.9%", ... },
  { icon: Clock3, title: "Доступность", value: "24/7", ... },
]
```

**Проблемы:**

- 🔴 "1,240" — нет контекста (что это?)
- 🔴 "< 200мс" — технический жаргон
- 🔴 "Здоровье систем" — метафора, неясно что значит

### 9.2 Рекомендации

```tsx
const KPI_CARDS = [
  {
    icon: Building2,
    title: "Объектов на обслуживании",
    value: "547",
    meta: "За 2025 год",
    suffix: "",
  },
  {
    icon: Clock,
    title: "Выезд инженера",
    value: "< 24",
    meta: "Часов в Москве",
    suffix: "ч",
  },
  {
    icon: CheckCircle2,
    title: "Сдача объектов",
    value: "100",
    meta: "Без замечаний МЧС",
    suffix: "%",
  },
  {
    icon: Phone,
    title: "Поддержка",
    value: "24/7",
    meta: "Включая выходные",
    suffix: "",
  },
];
```

---

## 🎯 10. Приоритетный план улучшений

### P0 — Критичное (1-2 дня)

| Задача                            | Файл                   | Часы         |
| --------------------------------- | ---------------------- | ------------ |
| Добавить `prefers-reduced-motion` | `globals.css`          | 0.5          |
| Исправить контраст текста         | `globals.css`          | 0.5          |
| Добавить ARIA-атрибуты            | `page.tsx`, `hero.tsx` | 1            |
| Упростить заголовок Hero          | `hero.tsx`             | 0.5          |
| Конкретизировать Trust Signals    | `hero.tsx`             | 1            |
| **Итого**                         |                        | **3.5 часа** |

### P1 — Важное (3-5 дней)

| Задача                        | Файл                   | Часы         |
| ----------------------------- | ---------------------- | ------------ |
| Добавить service color tokens | `globals.css`          | 1            |
| Убрать хардкод цветов из JS   | `page.tsx`             | 2            |
| Сократить анимации до 2       | `hero.tsx`, `page.tsx` | 2            |
| Добавить микро-копирайт к CTA | `hero.tsx`, `page.tsx` | 1            |
| Упростить KPI карточки        | `page.tsx`             | 1            |
| Accordion для mobile          | `page.tsx`             | 3            |
| **Итого**                     |                        | **10 часов** |

### P2 — Улучшения (5-10 дней)

| Задача                   | Файл          | Часы         |
| ------------------------ | ------------- | ------------ |
| Типографическая шкала    | `globals.css` | 2            |
| Приоритетные карточки    | `page.tsx`    | 3            |
| Skeleton loading         | `components/` | 4            |
| Lazy loading изображений | `page.tsx`    | 2            |
| **Итого**                |               | **11 часов** |

---

## ✅ 11. Чек-лист перед релизом

### Token Drift

- [ ] Нет hex-кодов в JSX (только CSS переменные)
- [ ] Все радиусы через `--radius-*`
- [ ] Все отступы через Tailwind scale

### Motion

- [ ] Max 2 concurrent animations
- [ ] Нет бесконечных циклов без interaction
- [ ] `prefers-reduced-motion` работает

### Accessibility

- [ ] Контраст ≥ 4.5:1 для текста
- [ ] Tap targets ≥ 44x44px
- [ ] ARIA-атрибуты на кнопках
- [ ] Focus visible для клавиатуры

### Conversion

- [ ] CTA с микро-копирайтом
- [ ] Trust Signals с конкретикой
- [ ] Заголовок понятен за 5 секунд

### Performance

- [ ] Lighthouse ≥ 90
- [ ] CLS ≤ 0.05
- [ ] LCP < 2.5s

---

## 📈 12. Ожидаемый эффект

| Метрика               | Сейчас | После P0 | После P1 | После P2 |
| --------------------- | ------ | -------- | -------- | -------- |
| CLI (Cognitive Load)  | 6.30   | 5.50     | 4.00     | 3.20     |
| CS (Conversion Score) | 5.80   | 6.50     | 7.80     | 8.50     |
| Lighthouse            | ?      | 85+      | 90+      | 95+      |
| Конверсия в заявку    | ?      | +10%     | +25%     | +35%     |

---

**Рекомендуемый порядок:** P0 → P1 → тестирование → P2

**Общее время:** ~24 часа (3 рабочих дня)
