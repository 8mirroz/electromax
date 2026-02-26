# Knowledge Item: Система адаптивной производительности (Adaptive Mode)

## Обзор

Сайт Electromax поддерживает два режима производительности для обеспечения лучшего UX на разных устройствах и скоростях сети.

- **Full Mode**: Полный визуальный опыт, шейдеры, тяжелые анимации, блюр (backdrop-filter), фоновые сетки.
- **Lite Mode**: Оптимизированный режим. Отключает тяжелые CSS-эффекты, анимации сводятся к минимуму (или 0ms), отключаются блюры и сложные паттерны.

## Техническая реализация

1. **Хук `useAdaptivePerformance`**: Находится в `src/hooks/useAdaptivePerformance.ts`. Рассчитывает `hardwareScore` и `networkScore`.
2. **CSS Overrides**: В `src/styles/globals.css` через селектор `html.perf-lite`. Применяет переменные с нулевыми задержками и отключает анимации.
3. **Provider**: `AdaptiveProvider` (в `src/components/AdaptiveProvider.tsx`) раздает состояние `isLite` и функцию `setTier` через контекст.

## Как переключать режимы

- Функция: `setManualPerformanceTier(tier: PerformanceTier)` из хука.
- Параметры URL: `?perf=lite` или `?perf=full` (сохраняется в localStorage).
- LocalStorage key: `electromax_perf_tier`.

## Рекомендации для агентов

- **БЕЗОПАСНОСТЬ**: При добавлении новых тяжелых анимаций или Blur-эффектов ВСЕГДА проверяйте, как они ведут себя в `Lite` режиме (через `html.perf-lite`).
- **CSS**: Для новых компонентов используйте переменные из `globals.css` (`--duration-normal` и т.д.), так как они автоматически обнуляются в легком режиме.
- **КОНФЛИКТЫ**: Не удаляйте логику `perf-lite` из `globals.css` без согласования архитектуры.
