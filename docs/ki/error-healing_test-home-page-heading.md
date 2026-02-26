# Несоответствие Unit-теста после обновления UI компонент

**Симптом**: Сборка CI падает на шаге `npm test` (vitest)
**Ошибка**: `@testing-library/react` не может найти элемент (Heading), так как он ожидает стандартный Next.js Boilerplate текст: `to get started, edit the page.tsx file`.
**Причина**: Frontend-инженер обновил `src/app/page.tsx` с кастомным дизайном (HeroBanner "Инженерные Системы"), но забыл обновить unit-тест `src/test/home.test.tsx`, который проверял старый заголовок.
**Фикс**:

1. Обновлен RegExp в `tests/home.test.tsx` на `name: /Инженерные Системы/i`.
2. Добавлен импорт `expect, it` напрямую из `vitest`, чтобы избежать ошибок TS (`Cannot find name 'it'`).

**Lessons Learned**:

- При глобальном обновлении корневого `page.tsx`, всегда прогонять `npm test`, а не только `playwright test` или `npm run build`.
- Файлы в `src/test` часто содержат жесткие assertion'ы, завязанные на текст.
