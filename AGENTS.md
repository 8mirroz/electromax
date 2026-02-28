# Design System Guidelines for Electromax

## 🎨 Кнопки / Buttons

### Акцентные кнопки (Primary/Accent Buttons)

Все основные акцентные кнопки на сайте должны использовать **21st.dev стиль**:

#### Визуальный стиль:

- **Форма**: Полностью скругленные углы (`rounded-2xl` или `rounded-[16px]`)
- **Фон**: Градиент от `blue-600` к `indigo-600` (`bg-gradient-to-r from-blue-600 to-indigo-600`)
- **Тень**: Многослойная тень с градиентным свечением:
  ```css
  box-shadow:
    0 4px 20px -4px rgba(59, 130, 246, 0.4),
    0 8px 40px -8px rgba(79, 70, 229, 0.3);
  ```
- **Текст**: Белый (`text-white`), жирный (`font-bold` или `font-semibold`), uppercase (`uppercase`), с отслеживанием (`tracking-wider`)
- **Размер**: Отступы `px-8 py-4` для основных CTA

#### Анимации (обязательны):

1. **Hover**:
   - Поднятие вверх (`-translate-y-0.5` или `hover:-translate-y-1`)
   - Усиление тени
   - Легкое свечение сверху (shine effect)
2. **Active**:
   - Уменьшение масштаба (`scale-[0.98]`)
3. **Focus**:
   - Кольцо фокуса с primary цветом

#### Пример кода (React/Tailwind):

```tsx
<motion.button
  whileHover={{
    y: -2,
    boxShadow: "0 8px 30px -4px rgba(59, 130, 246, 0.5), 0 12px 50px -8px rgba(79, 70, 229, 0.35)",
  }}
  whileTap={{ scale: 0.98 }}
  className="relative inline-flex items-center gap-3 px-8 py-4 
    bg-gradient-to-r from-blue-600 to-indigo-600 
    text-white font-bold uppercase tracking-wider text-sm 
    rounded-2xl shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4),0_8px_40px_-8px_rgba(79,70,229,0.3)]
    hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.5),0_12px_50px_-8px_rgba(79,70,229,0.35)]
    transition-all duration-300"
>
  Текст кнопки
  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  {/* Shine effect overlay */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
</motion.button>
```

#### Варианты использования:

- **Основной CTA** (Заказать аудит, Получить расчёт, Оставить заявку)
- **Кнопки в карточках услуг**
- **Кнопки в модальных окнах** для подтверждения действия

### Вторичные кнопки (Secondary Buttons)

- **Фон**: Полупрозрачный (`bg-white/10`) или светлый (`bg-surface-secondary`)
- **Граница**: Тонкая граница (`border border-white/20` или `border-border`)
- **Текст**: В зависимости от контекста (белый на темном, темный на светлом)
- **Hover**: Легкое затемнение/осветление фона

#### Пример:

```tsx
<button className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-white/80 hover:bg-white/15 transition-colors">
  Вторичное действие
</button>
```

### Цветовая палитра

- **Primary**: `#2f5bff` (blue-600)
- **Primary Gradient Start**: `#2563eb` (blue-600)
- **Primary Gradient End**: `#4f46e5` (indigo-600)
- **Background**: `#f7f9fd`
- **Surface**: `#ffffff`, `#f8fafe`
- **Text Primary**: `#10172a`
- **Text Secondary**: `#556276`

### Типографика

- **Заголовки**: Inter Variable, font-weight: 700-800
- **Body**: Inter Variable, font-weight: 400
- **Кнопки**: Uppercase, tracking-wider, font-weight: 600-700

### Анимации

Все интерактивные элементы должны иметь:

- **Duration**: 200-300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` или `[0.22, 1, 0.36, 1]`
- **Hover transitions**: Transform + Shadow
- **Reduced motion support**: `@media (prefers-reduced-motion: reduce)`

### Компоненты UI

#### Button (src/components/ui/button.tsx)

Основной компонент кнопки использует `cva` (class-variance-authority) для вариантов:

- `variant: "default"` - Акцентная кнопка (21st.dev стиль)
- `variant: "outline"` - Кнопка с границей
- `variant: "ghost"` - Прозрачная кнопка
- `variant: "secondary"` - Вторичная кнопка

#### RainbowButton (src/components/ui/RainbowButton.tsx)

Альтернативный компонент для специальных случаев.

### Где применять стиль 21st.dev

1. **Hero секции** - CTA кнопки
2. **AuditSection** - "Заказать аудит"
3. **Service cards** - Кнопки "Подробнее", "Заказать"
4. **Modals** - Первичные действия
5. **Footer** - Основные призывы к действию
6. **Contact forms** - Кнопка отправки

### НЕ применять стиль 21st.dev

- Кнопки-иконки (icon only)
- Маленькие кнопки (sm)
- Текстовые ссылки (link variant)
- Кнопки в таблицах (если их много)

---

## 📱 Responsive

- **Mobile**: Минимальная высота 44px (Apple HIG)
- **Touch targets**: min-width/min-height: 44px
- **Spacing**: Увеличенные отступы на мобильных

## ♿ Accessibility

- **Focus visible**: Обязательное кольцо фокуса
- **ARIA labels**: Для иконок и неясных действий
- **Color contrast**: Минимум 4.5:1
- **Reduced motion**: Уважать предпочтения пользователя
