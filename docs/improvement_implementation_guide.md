# ELECTROMAX — IMPLEMENTATION GUIDE

Практическое руководство по устранению критических проблем из UI/UX аудита.

---

## PRIORITY 0: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

### 1. Accessibility — Alt Text для изображений

**Файл:** `src/app/page.tsx`

**Проблема:** Изображения без alt-атрибутов (строки 789, 803, 809)

**Решение:**

```tsx
// БЫЛО:
<img
  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400"
  className="h-[300px] w-full object-cover"
/>

// СТАЛО:
<img
  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400"
  alt="Современный бизнес-центр класса A с интегрированными системами безопасности и контроля доступа"
  className="h-[300px] w-full object-cover"
/>
```

---

### 2. Performance — Next.js Image Component

**Файл:** `src/app/page.tsx`

**Проблема:** Неоптимизированные изображения, нет lazy loading

**Решение:**

```tsx
import Image from 'next/image';

// БЫЛО:
<img
  alt="Бизнес-центр"
  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400"
  className="h-[300px] w-full object-cover"
/>

// СТАЛО:
<Image
  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400"
  alt="Современный бизнес-центр класса A"
  width={1400}
  height={300}
  className="h-[300px] w-full object-cover"
  loading="lazy"
  quality={85}
/>
```

---

### 3. Accessibility — Focus Trap в Modal

**Файл:** `src/components/ui/QuizModal.tsx`

**Установка:**

```bash
pnpm add focus-trap-react
```

**Решение:**

```tsx
import FocusTrap from "focus-trap-react";

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={reset} />

      <FocusTrap>
        <div
          className="relative w-full max-w-2xl bg-card rounded-[2.5rem]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-title"
        >
          <h2 id="quiz-title" className="sr-only">
            Рассчитать стоимость проекта
          </h2>
          {/* остальной контент */}
        </div>
      </FocusTrap>
    </div>
  );
}
```

---

### 4. Accessibility — Labels для форм

**Файл:** `src/app/page.tsx` (строка 234)

**Проблема:** Input без label

**Решение:**

```tsx
<div className="mt-5 flex flex-col gap-2 rounded-2xl">
  <label htmlFor="hero-search" className="sr-only">
    Опишите ваш объект для расчета стоимости
  </label>
  <div className="flex h-11 flex-1 items-center gap-3">
    <Zap className="h-4 w-4 text-white/80" />
    <input
      id="hero-search"
      type="text"
      placeholder="Опишите объект: склад 4 000 м², АПС + СКУД + ЭОМ..."
      className="flex-1 bg-transparent text-white/75 outline-none"
      aria-label="Описание объекта"
    />
  </div>
</div>
```

---

### 5. Design System — Устранение HEX-кодов

**Файл:** `src/styles/globals.css`

**Добавить токены:**

```css
@theme {
  /* Existing tokens... */

  /* Extended color palette */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Semantic colors */
  --color-surface-primary: #eef2f7;
  --color-surface-secondary: #f8fafe;
  --color-surface-elevated: #ffffff;

  --color-text-primary: #10172a;
  --color-text-secondary: #5e697c;
  --color-text-tertiary: #637086;

  --color-border-light: #dbe2ee;
  --color-border-medium: #dde4ef;
  --color-border-strong: #d9e1ed;
}
```

**Файл:** `tailwind.config.ts`

**Добавить в theme.extend.colors:**

```typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        surface: {
          primary: "var(--color-surface-primary)",
          secondary: "var(--color-surface-secondary)",
          elevated: "var(--color-surface-elevated)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        border: {
          light: "var(--color-border-light)",
          medium: "var(--color-border-medium)",
          strong: "var(--color-border-strong)",
        },
      },
    },
  },
};
```

**Файл:** `src/app/page.tsx`

**Заменить HEX на токены:**

```tsx
// БЫЛО:
<main className="min-h-screen bg-[#eef2f7] text-foreground">
  <nav className="border-b border-[#dbe2ee] bg-[#eef2f7]/90">
    <button className="border border-[#dbe2ee] bg-white text-[#223047]">

// СТАЛО:
<main className="min-h-screen bg-surface-primary text-foreground">
  <nav className="border-b border-border-light bg-surface-primary/90">
    <button className="border border-border-light bg-surface-elevated text-text-primary">
```

---

### 6. Performance — Dynamic Import для QuizModal

**Файл:** `src/app/page.tsx`

**Решение:**

```tsx
import dynamic from "next/dynamic";

// Динамическая загрузка модального окна
const QuizModal = dynamic(
  () => import("@/components/ui/QuizModal").then((mod) => ({ default: mod.QuizModal })),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function HomePage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <main>
      {/* Модальное окно загружается только при открытии */}
      {isQuizOpen && <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />}
    </main>
  );
}
```

---

### 7. Accessibility — ARIA Landmarks

**Файл:** `src/app/page.tsx`

**Решение:**

```tsx
export default function HomePage() {
  return (
    <>
      <nav className="sticky top-0 z-50" role="navigation" aria-label="Основная навигация">
        {/* navigation content */}
      </nav>

      <main role="main" id="main-content">
        {/* main content */}
      </main>

      <Footer />
    </>
  );
}
```

**Файл:** `src/components/sections/Footer.tsx`

```tsx
export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8" role="contentinfo">
      {/* footer content */}
    </footer>
  );
}
```

---

### 8. Accessibility — Skip to Content Link

**Файл:** `src/app/layout.tsx`

**Решение:**

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-full focus:shadow-lg"
        >
          Перейти к основному содержанию
        </a>
        {children}
      </body>
    </html>
  );
}
```

**Добавить в globals.css:**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

### 9. Accessibility — Heading Hierarchy

**Файл:** `src/app/page.tsx`

**Проблема:** Множественные h1, пропущенные уровни

**Решение:**

```tsx
// БЫЛО:
<h1>Интеллектуальная архитектура систем безопасности</h1>
{/* ... */}
<h2>Комплексные инженерные сервисы</h2>
<h3>{service.title}</h3> {/* Пропущен уровень */}

// СТАЛО:
<h1>Интеллектуальная архитектура систем безопасности</h1>
{/* ... */}
<h2>Комплексные инженерные сервисы</h2>
<h3 className="sr-only">Список услуг</h3>
<div className="text-xl font-semibold">{service.title}</div> {/* Визуально как h3, но div */}
```

---

## PRIORITY 1: ВЫСОКИЙ ПРИОРИТЕТ

### 10. Mobile Navigation

**Создать:** `src/components/ui/MobileMenu.tsx`

```tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden h-10 w-10 flex items-center justify-center"
        aria-label="Открыть меню"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <nav
            className="absolute right-0 top-0 h-full w-[280px] bg-surface-elevated p-6 shadow-2xl"
            role="navigation"
            aria-label="Мобильное меню"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center"
              aria-label="Закрыть меню"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mt-16 space-y-6">
              {["Решения", "Сервисы", "Проекты", "Ресурсы"].map((item) => (
                <Link
                  key={item}
                  href={item === "Сервисы" ? "#services" : "#"}
                  className="block text-lg font-semibold text-text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
```

**Использовать в:** `src/app/page.tsx`

```tsx
import { MobileMenu } from "@/components/ui/MobileMenu";

<nav>
  <div className="flex items-center gap-2">
    {/* Desktop menu */}
    <div className="hidden md:flex">...</div>

    {/* Mobile menu */}
    <MobileMenu />
  </div>
</nav>;
```

---

### 11. Quiz Progress Persistence

**Файл:** `src/components/ui/QuizModal.tsx`

**Добавить:**

```tsx
import { useEffect } from "react";

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  // Load saved progress
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('quiz-progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCurrentStep(data.step || 1);
          setObjectType(data.objectType || "");
          setArea(data.area || "");
          setSelectedServices(data.selectedServices || []);
        } catch (e) {
          console.error('Failed to load quiz progress', e);
        }
      }
    }
  }, [isOpen]);

  // Save progress on change
  useEffect(() => {
    if (isOpen && currentStep > 1) {
      localStorage.setItem('quiz-progress', JSON.stringify({
        step: currentStep,
        objectType,
        area,
        selectedServices,
      }));
    }
  }, [currentStep, objectType, area, selectedServices, isOpen]);

  const reset = () => {
    localStorage.removeItem('quiz-progress');
    setCurrentStep(1);
    setObjectType("");
    setArea("");
    setSelectedServices([]);
    setIsSuccess(false);
    onClose();
  };

  return (
    // ... modal content
  );
}
```

---

### 12. Unified Button Component

**Создать:** `src/components/ui/Button.tsx`

```tsx
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-display font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-primary/25",
        secondary: "border-2 border-border bg-surface-elevated text-text-primary hover:bg-muted",
        ghost: "text-text-primary hover:bg-muted",
        rainbow:
          "bg-[linear-gradient(135deg,#2f5bff_0%,#1f43e6_55%,#152a98_100%)] text-white shadow-[0_20px_60px_-20px_rgba(47,91,255,0.6)] ring-1 ring-white/15 hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        sm: "h-10 px-4 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

**Использовать:**

```tsx
import { Button } from "@/components/ui/Button";

<Button variant="rainbow" size="lg" onClick={() => setIsQuizOpen(true)}>
  КОНСУЛЬТАЦИЯ
</Button>

<Button variant="secondary" size="md">
  Обсудить с инженером
</Button>
```

---

## PRIORITY 2: СРЕДНИЙ ПРИОРИТЕТ

### 13. Reduce Quiz Steps (4 → 3)

**Файл:** `src/components/ui/QuizModal.tsx`

**Объединить шаги 1 и 2:**

```tsx
const STEPS = [
  { id: 1, title: "Объект" },
  { id: 2, title: "Системы" },
  { id: 3, title: "Контакты" },
];

{
  /* Step 1: Object Type + Area */
}
{
  currentStep === 1 && (
    <div className="space-y-6">
      <h3>Выберите тип объекта</h3>
      <div className="grid grid-cols-2 gap-4">
        {OBJECT_TYPES.map((type) => (
          <button key={type.id} onClick={() => setObjectType(type.id)}>
            {type.label}
          </button>
        ))}
      </div>

      {objectType && (
        <div className="mt-6">
          <h4>Укажите площадь</h4>
          <input
            type="range"
            min="10"
            max="10000"
            value={area || 100}
            onChange={(e) => setArea(e.target.value)}
          />
          <div className="text-4xl font-bold">{area || 0} м²</div>
        </div>
      )}
    </div>
  );
}
```

---

### 14. Loading States

**Создать:** `src/components/ui/Skeleton.tsx`

```tsx
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />;
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-[20px] border border-border bg-surface-elevated p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-6 w-3/4" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
```

**Использовать:**

```tsx
import { ServiceCardSkeleton } from "@/components/ui/Skeleton";

{
  isLoading ? (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  ) : (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </div>
  );
}
```

---

## TESTING CHECKLIST

После внедрения исправлений проверить:

### Accessibility

- [ ] Все изображения имеют alt-атрибуты
- [ ] Контраст текста ≥ 4.5:1 (проверить с WebAIM Contrast Checker)
- [ ] Навигация с клавиатуры работает (Tab, Enter, Escape)
- [ ] Focus trap в модальном окне работает
- [ ] Screen reader читает все элементы корректно (тест с NVDA/VoiceOver)
- [ ] Heading hierarchy корректна (h1 → h2 → h3)
- [ ] ARIA landmarks определены

### Performance

- [ ] Lighthouse Score ≥ 90
- [ ] LCP < 2.5s
- [ ] CLS ≤ 0.1
- [ ] Images lazy load
- [ ] QuizModal загружается динамически

### Design System

- [ ] Нет raw HEX values в компонентах
- [ ] Все цвета через CSS variables
- [ ] Spacing consistent (4px scale)
- [ ] Button variants unified

### UX

- [ ] Mobile navigation работает
- [ ] Quiz progress сохраняется
- [ ] Loading states показываются
- [ ] Error states обрабатываются

---

## AUTOMATED CHECKS

**Создать:** `.github/workflows/ui-audit.yml`

```yaml
name: UI/UX Audit

on:
  pull_request:
    paths:
      - "src/**"

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm dlx @axe-core/cli http://localhost:3000

  design-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for raw HEX values
        run: |
          if grep -rE '#[0-9a-fA-F]{6}' src/app src/components; then
            echo "❌ Raw HEX values found. Use CSS variables instead."
            exit 1
          fi
          echo "✅ No raw HEX values found"

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: http://localhost:3000
          uploadArtifacts: true
```

---

## NEXT STEPS

1. **Week 1:** Implement P0 fixes (items 1-9)
2. **Week 2:** Implement P1 fixes (items 10-12)
3. **Week 3:** Implement P2 fixes (items 13-14)
4. **Week 4:** Testing and refinement

**Expected Outcome:**

- A11Y_SCORE: 68 → 96
- PERFORMANCE_SCORE: 75 → 91
- DCI_SCORE: 81 → 96
- UX_SCORE: 72 → 85
- **RELEASE STATUS: UNBLOCKED** ✅
