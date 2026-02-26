# Electromax — Полный план улучшений и доработок

**Дата аудита:** 2026-02-24  
**Основа:** NN/g, Baymard Institute, Laws of UX, StoryBrand, WCAG 2.1

---

## 📊 Аудит текущей ситуации

### 1. Карта сайта

| Страница                     | Статус           | Проблемы                              |
| ---------------------------- | ---------------- | ------------------------------------- |
| `/` (Главная)                | ✅ Работает      | Нет About, Projects, Contacts страниц |
| `/services/[slug]` (8 услуг) | ✅ Работает      | Не весь контент отображается          |
| `/api/leads` (API)           | ✅ Работает      | Нет тестов на ошибки                  |
| `/about`                     | ❌ Не существует | Ссылка в футере ведёт на `#`          |
| `/projects`                  | ❌ Не существует | Ссылка в футере ведёт на `#`          |
| `/contacts`                  | ❌ Не существует | Ссылка в футере ведёт на `#`          |
| `/licenses`                  | ❌ Не существует | Ссылка в футере ведёт на `#`          |
| `404`                        | ❌ Не существует | Next.js default страница              |

### 2. Контент услуг (8 сервисов)

| Услуга | ID     | Цена м² | В футере         |
| ------ | ------ | ------- | ---------------- |
| АПС    | `aps`  | 450 ₽   | ✅               |
| СОУЭ   | `soue` | 250 ₽   | ❌ **Пропущена** |
| СОТ    | `sot`  | 600 ₽   | ✅               |
| ОС     | `os`   | 350 ₽   | ❌ **Пропущена** |
| СКУД   | `skud` | 15000 ₽ | ✅               |
| СКС    | `sks`  | 3000 ₽  | ✅               |
| ЭОМ    | `eom`  | 1500 ₽  | ❌ **Пропущена** |
| ЭО     | `eo`   | 900 ₽   | ❌ **Пропущена** |

### 3. Компоненты

| Компонент        | Статус | Используется                            |
| ---------------- | ------ | --------------------------------------- |
| `CalculatorForm` | ✅     | На странице услуги                      |
| `PremiumHero`    | ✅     | На главной                              |
| `HeroBanner`     | ⚠️     | **Не используется** (есть PremiumHero)  |
| `Pricing`        | ⚠️     | **Не используется** (инлайн в странице) |
| `Tabs`           | ⚠️     | **Не используется** (инлайн в странице) |
| `Footer`         | ✅     | На всех страницах                       |
| `Breadcrumb`     | ✅     | На странице услуги                      |
| `Analytics`      | ✅     | В layout                                |

### 4. Тесты

| Тип              | Файлов | Тестов | Покрытие           |
| ---------------- | ------ | ------ | ------------------ |
| Unit (Vitest)    | 1      | 1      | Только главная     |
| E2E (Playwright) | 2      | 4      | Главная + 1 услуга |

**Не тестировано:**

- Все UI компоненты (Button, Breadcrumb, Pricing, Tabs)
- Формы (валидация, ошибки)
- API (обработка ошибок)
- Доступность (a11y)

---

## 🔴 P0 — Критические проблемы (Неделя 1)

### 1. Страница услуги не отображает 60% контента

**Проблема:** В `services.ts` определены поля, которые не рендерятся:

```typescript
// ОПРЕДЕЛЕНО В services.ts:
service.content.problems; // ❌ Не рендерится
service.includedSteps; // ❌ Не рендерится
service.equipment; // ❌ Не рендерится

// РЕНДЕРИТСЯ ТОЛЬКО:
service.content.hero.subtitle; // ✅
service.packages; // ✅
```

**Решение:** Добавить 3 секции на страницу услуги:

```tsx
{
  /* Секция "Проблемы" */
}
<section>
  <h2>Типичные проблемы</h2>
  {service.content.problems.map((problem) => (
    <ProblemCard key={problem.title} {...problem} />
  ))}
</section>;

{
  /* Секция "Процесс работы" */
}
<section>
  <h2>5 шагов реализации</h2>
  <Timeline steps={service.includedSteps} />
</section>;

{
  /* Секция "Оборудование" */
}
<section>
  <h2>Используемое оборудование</h2>
  <EquipmentList items={service.equipment} />
</section>;
```

**Файлы для изменения:**

- `/src/app/services/[slug]/page.tsx`
- `/src/components/sections/ProblemSection.tsx` (новый)
- `/src/components/sections/ProcessTimeline.tsx` (новый)
- `/src/components/sections/EquipmentList.tsx` (новый)

---

### 2. Отсутствие 4 обязательных страниц

**Проблема:** В футере есть ссылки, которые ведут на `#`:

- О компании
- Проекты
- Лицензии
- Контакты

**Решение:** Создать 4 страницы:

#### 2.1 Страница "О компании" (`/about`)

**Контент:**

- Hero с фото команды
- Цифры (12 лет, 500+ объектов, ISO 9001)
- История компании (таймлайн)
- Команда (фото + роли)
- Сертификаты (сканы)
- CTA "Обсудить проект"

**Файл:** `/src/app/about/page.tsx`

---

#### 2.2 Страница "Проекты" (`/projects`)

**Контент:**

- Фильтр по типу объекта (Офисы, Склады, Производство, ТЦ)
- Карточки проектов:
  - Фото объекта
  - Название + локация
  - Площадь
  - Выполненные работы
  - Срок реализации
  - Бюджет (опционально)
- CTA "Хочу так же"

**Файл:** `/src/app/projects/page.tsx`

**Данные:** Создать `/src/data/projects.ts`:

```typescript
export interface Project {
  id: string;
  title: string;
  location: string;
  area: number;
  type: "office" | "warehouse" | "industrial" | "mall";
  services: string[]; // IDs из SERVICES_DB
  duration: string;
  budget?: number;
  image: string;
  description: string;
}
```

---

#### 2.3 Страница "Контакты" (`/contacts`)

**Контент:**

- Карта (Яндекс.Карты API)
- Адрес, телефон, email
- Форма обратной связи
- Реквизиты компании
- Часы работы
- Соцсети

**Файл:** `/src/app/contacts/page.tsx`

**Компонент:** `/src/components/forms/ContactForm.tsx` (новая)

---

#### 2.4 Страница "Лицензии" (`/licenses`)

**Контент:**

- Лицензия МЧС (скан + номер)
- СРО (скан + номер)
- ISO 9001 (скан)
- Сертификаты сотрудников
- Благодарственные письма

**Файл:** `/src/app/licenses/page.tsx`

**Компонент:** `/src/components/ui/DocumentCard.tsx` (новый)

---

### 3. 404 страница не кастомизирована

**Проблема:** Next.js показывает стандартную 404

**Решение:** Создать `/src/app/not-found.tsx`:

```tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-black text-primary">404</h1>
        <p className="text-xl text-muted-foreground mt-4">Страница не найдена</p>
        <Link href="/" className="btn-primary mt-8">
          На главную
        </Link>
      </div>
    </div>
  );
}
```

---

### 4. Навигация не показывает все услуги

**Проблема:** В футере только 4 из 8 услуг

**Решение:** Обновить `/src/components/sections/Footer.tsx`:

```tsx
<ul className="space-y-3 text-sm text-muted-foreground">
  {Object.values(SERVICES_DB).map((service) => (
    <li key={service.id}>
      <Link className="hover:text-primary transition" href={`/services/${service.id}`}>
        {service.shortName}
      </Link>
    </li>
  ))}
</ul>
```

---

## 🟡 P1 — Важные улучшения (Неделя 2)

### 5. Улучшение формы калькулятора

**Проблемы:**

- Валидация телефона только по длине
- Нет маски ввода
- Нет email поля
  -Generic error messages

**Решение:**

```tsx
// 1. Добавить маску телефона
import { PhoneInput } from 'react-international-phone';

// 2. Добавить email поле
<input
  type="email"
  placeholder="Email"
  required
  className={...}
/>

// 3. Улучшить валидацию
const validatePhone = (phone: string) => {
  const regex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
  return regex.test(phone);
};

// 4. Конкретные сообщения об ошибках
const errors: Record<string, string> = {
  invalid_phone: "Номер должен быть в формате +7 (___) ___-__-__",
  invalid_email: "Введите корректный email",
  network_error: "Ошибка сети. Попробуйте позже.",
  captcha_failed: "Подтвердите, что вы не робот"
};
```

**Файл:** `/src/components/forms/CalculatorForm.tsx`

---

### 6. Секция "Проблемы" на главной

**Проблема:** Пользователь может не узнать свою ситуацию

**Решение:** Вставить перед карточками услуг:

```tsx
<section className="py-24 bg-foreground/[0.02]">
  <div className="container mx-auto px-6 max-w-7xl">
    <h2 className="text-4xl font-display font-black text-center mb-16">
      Сталкиваетесь с этими проблемами?
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: "warning", text: "Предписание от МЧС" },
        { icon: "block", text: "Не проходит приёмка" },
        { icon: "broken", text: "Старая система не работает" },
        { icon: "update", text: "Нужна модернизация" },
      ].map((problem) => (
        <ProblemCard key={problem.text} {...problem} />
      ))}
    </div>
  </div>
</section>
```

---

### 7. Социальное доказательство в Hero

**Проблема:** Нет доверия в первом экране

**Решение:** Добавить в `/src/components/ui/hero.tsx`:

```tsx
<div className="flex items-center gap-8 mt-12 text-muted-foreground">
  <div className="flex items-center gap-2">
    <ShieldCheck className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium">500+ объектов</span>
  </div>
  <div className="flex items-center gap-2">
    <Award className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium">Лицензия МЧС</span>
  </div>
  <div className="flex items-center gap-2">
    <Clock className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium">12 лет на рынке</span>
  </div>
</div>
```

---

### 8. Уточнение CTA

**Проблема:** "Заказать проект" — размыто

**Решение:**

| Было            | Стало                     |
| --------------- | ------------------------- |
| Заказать проект | **Рассчитать стоимость**  |
| Все услуги      | **Получить консультацию** |

**Добавить микро-копирайт:**

```tsx
<p className="text-xs text-muted-foreground mt-3">
  ✓ Бесплатный выезд инженера &nbsp; ✓ Смета за 24 часа &nbsp; ✓ Без скрытых платежей
</p>
```

---

### 9. Липкая шапка с телефоном

**Проблема:** В навигации нет телефона

**Решение:** Обновить `/src/app/page.tsx`:

```tsx
<nav className="sticky top-0 z-50 ...">
  <div className="flex items-center gap-6">
    {/* Лого */}
    {/* Меню */}
    <div className="flex items-center gap-4 ml-auto">
      <a href="tel:+74951234567" className="font-bold text-foreground">
        +7 (495) 123-45-67
      </a>
      <Button>Заказать звонок</Button>
    </div>
  </div>
</nav>
```

---

### 10. Кейсы с цифрами

**Проблема:** "Комплексная система безопасности класса А" — ничего не говорит

**Решение:** Переписать карточки проектов:

```tsx
<div className="relative overflow-hidden rounded-[2.5rem] group">
  <img src={project.image} alt={project.title} />
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 p-12">
    <span className="text-primary text-xs font-black uppercase">{project.type}</span>
    <h3 className="text-3xl font-black text-white mt-2">{project.title}</h3>
    <div className="grid grid-cols-2 gap-4 mt-6">
      <Stat label="Площадь" value={`${project.area.toLocaleString()} м²`} />
      <Stat label="Срок" value={project.duration} />
      <Stat label="Бюджет" value={`${project.budget?.toLocaleString()} ₽`} />
      <Stat label="Камер" value={project.cameras?.toString() || "—"} />
    </div>
  </div>
</div>
```

---

## 🟢 P2 — Улучшения опыта (Неделя 3)

### 11. Квиз "Рассчитать за 1 минуту"

**Проблема:** Пользователь не готов оставить заявку сразу

**Решение:** Модальный квиз с 4 шагами:

```tsx
<QuizModal>
  <Step1>Тип объекта: [Офис] [Склад] [Производство] [ТЦ]</Step1>
  <Step2>Площадь: [____] м²</Step2>
  <Step3>Что нужно: ☑ АПС ☑ СКУД ☑ СОТ</Step3>
  <Step4>Контакты: [Телефон] [Email] → Получить расчёт</Step4>
</QuizModal>
```

**Файлы:**

- `/src/components/forms/QuizModal.tsx` (новый)
- `/src/components/ui/QuizStep.tsx` (новый)

---

### 12. Telegram-виджет

**Проблема:** Не все хотят звонить

**Решение:** Плавающая кнопка:

```tsx
<FloatingButton className="bottom-6 right-6 z-50">
  <TelegramIcon className="w-6 h-6" />
  <span>Написать в Telegram</span>
</FloatingButton>
```

**Файл:** `/src/components/ui/TelegramButton.tsx` (новый)

---

### 13. Хлебные крошки на главной

**Проблема:** Нет навигационной цепочки

**Решение:** Добавить на страницы второго уровня:

```tsx
<Breadcrumb
  items={[
    { label: "Главная", href: "/" },
    { label: "Услуги", href: "/#services" },
    { label: service.shortName, href: `/services/${service.id}` },
  ]}
/>
```

---

### 14. Loading состояния

**Проблема:** Нет скелетонов при загрузке

**Решение:** Добавить в `/src/app/services/[slug]/page.tsx`:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// В компоненте:
<Suspense fallback={<ServiceSkeleton />}>
  <ServiceContent />
</Suspense>;
```

**Файл:** `/src/components/ui/skeleton.tsx` (новый)

---

### 15. Изображения с оптимизацией

**Проблема:** Нет lazy loading, placeholders

**Решение:** Использовать Next.js Image:

```tsx
<Image
  src={project.image}
  alt={project.title}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL={project.imageBlur}
  className="object-cover"
/>
```

---

## ♿ P3 — Доступность и SEO (Неделя 4)

### 16. ARIA-атрибуты

**Проблема:** Нет accessibility атрибутов

**Решение:**

```tsx
// Кнопки
<button aria-label="Закрыть модальное окно">

// Навигация
<nav aria-label="Основная навигация">

// Формы
<label htmlFor="phone">Телефон</label>
<input id="phone" aria-describedby="phone-error" />
<span id="phone-error" role="alert">Ошибка</span>
```

---

### 17. Мета-теги для каждой услуги

**Проблема:** Одинаковые meta descriptions

**Решение:** В `generateMetadata`:

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = SERVICES_DB[params.slug];

  return {
    title: `${service.title} | Монтаж от ${service.basePricePerSqm} ₽/м²`,
    description: `${service.description} Срок: от 3 дней. Гарантия: 3 года. Лицензия МЧС.`,
    openGraph: {
      images: [`/og/services/${service.id}.png`],
    },
  };
}
```

---

### 18. Sitemap и Robots

**Проблема:** Нет sitemap.xml

**Решение:** Создать `/src/app/sitemap.ts`:

```tsx
export default function sitemap(): MetadataRoute.Sitemap {
  const services = Object.keys(SERVICES_DB).map((slug) => ({
    url: `https://electromax.ru/services/${slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: "https://electromax.ru", lastModified: new Date() },
    ...services,
    { url: "https://electromax.ru/about", lastModified: new Date() },
    { url: "https://electromax.ru/projects", lastModified: new Date() },
    { url: "https://electromax.ru/contacts", lastModified: new Date() },
  ];
}
```

**Файл:** `/src/app/robots.ts` (новый):

```tsx
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://electromax.ru/sitemap.xml",
  };
}
```

---

## 🧪 Тесты

### 19. Расширить покрытие тестов

**Unit тесты:**

```tsx
// src/test/components/Button.test.tsx
describe("Button", () => {
  it("renders with variant", () => {});
  it("handles click", () => {});
  it("is disabled when loading", () => {});
});

// src/test/components/CalculatorForm.test.tsx
describe("CalculatorForm", () => {
  it("validates phone", () => {});
  it("calculates price", () => {});
  it("shows error on network failure", () => {});
});
```

**E2E тесты:**

```tsx
// tests/e2e/about.spec.ts
test("About page renders", async ({ page }) => {});

// tests/e2e/contacts.spec.ts
test("Contact form submits", async ({ page }) => {});

// tests/e2e/accessibility.spec.ts
test("No accessibility violations", async ({ page }) => {
  const results = await axe();
  expect(results.violations).toHaveLength(0);
});
```

---

## 📊 Метрики успеха

| Метрика            | Сейчас | Цель P0 | Цель P1 | Цель P2 |
| ------------------ | ------ | ------- | ------- | ------- |
| Конверсия в заявку | ?      | +20%    | +35%    | +50%    |
| Время на сайте     | ?      | +15%    | +25%    | +40%    |
| Отказы (Bounce)    | ?      | -15%    | -25%    | -35%    |
| Глубина просмотра  | 1.8    | 2.5     | 3.0     | 3.5+    |
| Core Web Vitals    | ?      | 90+     | 95+     | 98+     |

---

## 🗺️ Дорожная карта по неделям

### Неделя 1 (P0 — Критическое)

| Задача                                   | Файлы                                   | Часы         |
| ---------------------------------------- | --------------------------------------- | ------------ |
| 1.1 Секция "Проблемы" на странице услуги | `page.tsx`, `ProblemSection.tsx`        | 4            |
| 1.2 Секция "Процесс" на странице услуги  | `page.tsx`, `ProcessTimeline.tsx`       | 4            |
| 1.3 Секция "Оборудование"                | `page.tsx`, `EquipmentList.tsx`         | 3            |
| 1.4 Страница "О компании"                | `/about/page.tsx`                       | 6            |
| 1.5 Страница "Контакты"                  | `/contacts/page.tsx`, `ContactForm.tsx` | 6            |
| 1.6 Страница "404"                       | `not-found.tsx`                         | 2            |
| 1.7 Обновить футер (все услуги)          | `Footer.tsx`                            | 1            |
| **Итого**                                |                                         | **26 часов** |

---

### Неделя 2 (P1 — Важное)

| Задача                             | Файлы                               | Часы        |
| ---------------------------------- | ----------------------------------- | ----------- |
| 2.1 Улучшение валидации формы      | `CalculatorForm.tsx`                | 4           |
| 2.2 Секция "Проблемы" на главной   | `page.tsx`                          | 3           |
| 2.3 Соц. доказательство в Hero     | `hero.tsx`                          | 2           |
| 2.4 Уточнение CTA + микро-копирайт | `page.tsx`, `hero.tsx`              | 2           |
| 2.5 Телефон в шапке                | `page.tsx`                          | 1           |
| 2.6 Страница "Проекты"             | `/projects/page.tsx`, `projects.ts` | 8           |
| 2.7 Страница "Лицензии"            | `/licenses/page.tsx`                | 4           |
| **Итого**                          |                                     | **24 часа** |

---

### Неделя 3 (P2 — Опыт)

| Задача                      | Файлы                           | Часы         |
| --------------------------- | ------------------------------- | ------------ |
| 3.1 Квиз-калькулятор        | `QuizModal.tsx`, `QuizStep.tsx` | 8            |
| 3.2 Telegram-виджет         | `TelegramButton.tsx`            | 2            |
| 3.3 Loading скелетоны       | `skeleton.tsx`, `page.tsx`      | 3            |
| 3.4 Оптимизация изображений | Все страницы                    | 4            |
| 3.5 Хлебные крошки          | `Breadcrumb.tsx`                | 2            |
| **Итого**                   |                                 | **19 часов** |

---

### Неделя 4 (P3 — SEO + A11y)

| Задача                     | Файлы                     | Часы         |
| -------------------------- | ------------------------- | ------------ |
| 4.1 ARIA-атрибуты          | Все компоненты            | 6            |
| 4.2 Мета-теги для услуг    | `page.tsx`                | 2            |
| 4.3 Sitemap + Robots       | `sitemap.ts`, `robots.ts` | 2            |
| 4.4 Unit тесты компонентов | `*.test.tsx`              | 8            |
| 4.5 E2E тесты страниц      | `*.spec.ts`               | 6            |
| 4.6 A11y тесты             | `accessibility.spec.ts`   | 4            |
| **Итого**                  |                           | **28 часов** |

---

## 📁 Структура новых файлов

```
src/
├── app/
│   ├── about/
│   │   └── page.tsx                    # О компании
│   ├── projects/
│   │   └── page.tsx                    # Проекты
│   ├── contacts/
│   │   └── page.tsx                    # Контакты
│   ├── licenses/
│   │   └── page.tsx                    # Лицензии
│   ├── sitemap.ts                      # Sitemap
│   ├── robots.ts                       # Robots.txt
│   └── not-found.tsx                   # 404 страница
│
├── components/
│   ├── forms/
│   │   ├── ContactForm.tsx             # Форма контактов
│   │   └── QuizModal.tsx               # Квиз
│   ├── sections/
│   │   ├── ProblemSection.tsx          # Секция проблем
│   │   ├── ProcessTimeline.tsx         # Таймлайн процесса
│   │   └── EquipmentList.tsx           # Список оборудования
│   └── ui/
│       ├── Skeleton.tsx                # Скелетон загрузки
│       ├── TelegramButton.tsx          # Telegram виджет
│       └── QuizStep.tsx                # Шаг квиза
│
├── data/
│   └── projects.ts                     # База проектов
│
└── test/
    ├── components/
    │   ├── Button.test.tsx
    │   ├── CalculatorForm.test.tsx
    │   └── Breadcrumb.test.tsx
    └── e2e/
        ├── about.spec.ts
        ├── projects.spec.ts
        └── accessibility.spec.ts
```

---

## 🛠️ Технические долги

### 1. Tailwind v4 vs v3

**Проблема:** `globals.css` использует v4 синтаксис (`@theme`), а `tailwind.config.ts` — v3

**Решение:** Мигрировать на v4 полностью:

```bash
pnpm add tailwindcss@next @tailwindcss/postcss@next
```

Удалить `tailwind.config.ts`, перенести всё в `globals.css`.

---

### 2. Удалить неиспользуемые компоненты

**Проблема:** `HeroBanner`, `Pricing`, `Tabs` не используются

**Решение:**

- Либо удалить
- Либо использовать в новых страницах

---

### 3. Environment variables

**Проблема:** Хардкод ID в `Analytics.tsx`

**Решение:** Вынести в `.env`:

```env
NEXT_PUBLIC_YANDEX_METRIKA_ID=100155250
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x000000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
SMTP_TO=...
```

---

## ✅ Чек-лист перед запуском

- [ ] Все 8 услуг отображаются в футере
- [ ] Страницы услуг показывают проблемы, процесс, оборудование
- [ ] Страницы /about, /projects, /contacts, /licenses работают
- [ ] 404 страница кастомная
- [ ] Форма имеет маску телефона + email
- [ ] Телефон в шапке кликабельный
- [ ] Sitemap.xml доступен
- [ ] Robots.txt настроен
- [ ] Все тесты проходят
- [ ] Lighthouse score 90+
- [ ] Нет ошибок в консоли
- [ ] Метрика считает цели

---

## 📚 Использованные источники

| Источник                                         | Применение                    |
| ------------------------------------------------ | ----------------------------- |
| [NN/g](https://nngroup.com)                      | Доверие, юзабилити, контент   |
| [Baymard Institute](https://baymard.com)         | Формы, e-commerce паттерны    |
| [StoryBrand](https://storybrand.com)             | Позиционирование, копирайтинг |
| [Laws of UX](https://lawsofux.com)               | Fitts's Law, Hick's Law       |
| [WCAG 2.1](https://wcag.com)                     | Доступность                   |
| [Google Core Web Vitals](https://web.dev/vitals) | Производительность            |

---

**Общий объём работ:** ~97 часов (2.5 недели full-time)

**Рекомендуемый приоритет:** Недели 1-2 дадут 80% результата за 50% усилий
