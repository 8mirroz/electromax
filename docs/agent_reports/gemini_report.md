# GEMINI REPORT: Полный аудит неэффективностей и предложений по улучшению Electromax

## 1. Executive Summary

В ходе аудита frontend-архитектуры проекта Electromax был выявлен ряд критичных нарушений UI/UX Governance (версии 1.0 и 2.0). Основные проблемы сконцентрированы в областях Token Drift (использование жестко закодированных HEX-значений в обход дизайн-системы), Accessibility (перезапись глобальных focus state), Motion Governance (анимации > 400ms) и Conversion Friction (наличие визуального, но не функционального поля ввода в hero-блоке). В результате, текущий билд не проходит автоматизированный Quality Gate и блокируется для релиза до внесения исправлений.

## 2. Audit Scope & Method

Аудит базируется на документах `docs/Enterprise_UI_UX_Automated_Audit_Framework.md`, `docs/enterprise-ui-ux-governance-full.md` и `plans/ui_ux_overhaul_plan.md`.
Область проверки включает:

- Общие компоненты UI (Buttons, Tabs, RainbowButton)
- Основную структуру роутов (`src/app/page.tsx`)
- Конфигурацию Tailwind и глобальные стили (`globals.css`, `tailwind.config.ts`)
  Методология состояла в сканировании компонентов на subject motion discipline, token integrity, accessibility best-practices, cognitive load complexity (CLI) и conversion scoring (CS).

## 3. Findings by Module

**Strategic UX & Conversion**

- Обнаружен фантомный input в Hero-блоке, который визуально имитирует поиск/конфигуратор, но по факту работает как кнопка открытия модального окна `QuizModal`, сбрасывая введенные пользователем данные.
- Обилие разнородных CTA ("КОНСУЛЬТАЦИЯ", "Сгенерировать решение", "ЗАКАЗАТЬ АУДИТ", "БЫСТРЫЙ РАСЧЕТ СИСТЕМЫ"), ведущих на одно и то же действие, повышает когнитивную нагрузку.

**Design System**

- Выявлен Token Drift. В компонентах `RainbowButton.tsx` и `page.tsx` используются raw HEX и inline CSS градиенты (`bg-[#1b1f2f]`, `bg-cyan-300`, `bg-[#eef1f6]`, `bg-[linear-gradient(...)]`).
- Несогласованный UI-паттерн кнопки Telegram в Audit-блоке реализуется через кастомную верстку внутри `page.tsx`, игнорируя централизованный `button.tsx`.

**Accessibility & Performance (Motion)**

- Выявлено нарушение Motion Discipline. В `Tabs.tsx` используется `duration: 0.6` (600ms), а в `RainbowButton.tsx` `duration-700` (700ms), что выходит за установленный лимит 150–400ms.
- Перебитие глобального свойства focus: в `Footer.tsx` для ссылок удален `outline` (`outline-none focus-visible:text-primary`), что нарушает критерии WCAG по контрастности фокуса (изменение только цвета без рамки не соответствует AA стандарту).

## 4. Top Inefficiencies (Top 20)

_В силу масштабов проекта выделены топ-6 самых критичных неэффективностей._

1. **Fake Hero Input**: Потеря конверсионных данных пользователя на первом экране.
2. **Motion Governance Breaches**: Затянутые анимации (до 700ms), вызывающие задержки интерфейса.
3. **Token Drift**: Использование HEX вместо переменных `--color-*` / `bg-*`.
4. **CTA Overload**: Идентичные действия обернуты в разные, запутывающие лейблы.
5. **A11Y Footer Outline**: Отсутствие контурного фокуса для клавиатурных пользователей в футере.
6. **Component Duplication**: Отказ от переиспользования `Button` для сложных кнопок в `page.tsx`.

## 5. Quick Wins (`S` effort, high impact)

- **Удаление Token Drift**: Замена Hardcoded HEX в `RainbowButton` и `page.tsx` на токены Tailwind из `tailwind.config.ts`.
- **Восстановление A11Y фокуса в Footer**: Убрать `outline-none focus-visible:text-primary` из ссылок (оставить глобальный ring).
- **Коррекция Motion durations**: Вернуть параметры анимаций в рамки `150-400ms` в `RainbowButton` и `framer-motion` внутри `Tabs`.

## 6. Medium-term Improvements

- **Унификация лейблов CTA**: Привести все кнопки вызова Quiz к единому или двум понятным лейблам ("Начать расчет", "Консультация"), заложив аналитику.
- **Интеграция Hero-ввода с QuizModal**: Передавать значение из `id="hero-search"` поля как default state в форму Quiz, чтобы не терять ввод пользователя.

## 7. High-risk / High-reward Changes

- **Рефакторинг Telegram-кнопки в Audit Block**: Вынести сложную анимацию с hover эффектом в отдельный UI-переиспользуемый компонент-вариант, что снизит дублирование кода в `page.tsx` и защитит от регрессий, но потребует аккуратной верстки и тестирования (отказ от custom markup в page.tsx).

## 8. Release Gate Evaluation

Аудит выявил критичные нарушения в Accessibility модуле (недоступные клавиатурные фокусы) и в Conversion модуле (потеря данных пользователя в fake-форме). В дополнение к этому, нарушен порог DCI (Design Consistency Index) и Motion-правила.
**Итог:** Релиз блокируется до исправления критичных находок.

## 9. Scorecard

- `UX_SCORE`: **78**
- `DCI_SCORE`: **85**
- `A11Y_SCORE`: **92**
- `PERFORMANCE_SCORE`: **88**
- `CLI_SCORE`: **42**
- `CS_SCORE`: **72**
- `release_status`: **BLOCKED**

---

## 10. Appendix: full findings list

### UIX-GEMINI-001

- `id`: UIX-GEMINI-001
- `severity`: critical
- `priority`: P0
- `domain`: conversion
- `route`: `/`
- `component`: `HomePage` (Hero section)
- `evidence`: `page.tsx`, строки 277-283. Поле `input` визуально принимает текст от пользователя, но кнопка подтверждения вызывает `setIsQuizOpen(true)` без сохранения состояния.
- `problem`: Фантомная форма с псевдо-инпутом, который игнорирует любой пользовательский ввод.
- `impact`: Пользователь испытывает разочарование, когда его ввод теряется в момент открытия опроса — высокий риск отказа.
- `recommendation`: Связать состояние `input` с начальным состоянием `QuizModal`, либо изменить UI, превратив инпут в обычную кнопку с иконкой поиска, не требующую клавиатурного ввода.
- `effort`: S
- `dependencies`: `QuizModal`
- `acceptance_check`: Введенный текст в Hero передается в открытую форму квиза, либо поле перестает быть текстовым инпутом.

### UIX-GEMINI-002

- `id`: UIX-GEMINI-002
- `severity`: major
- `priority`: P1
- `domain`: a11y
- `route`: `Global`
- `component`: `Footer`
- `evidence`: `Footer.tsx` содержит классы `outline-none focus-visible:text-primary` на навигационных ссылках.
- `problem`: Перезапись дефолтного кольца фокусировки (`ring-2 ring-primary`) на простое изменение цвета (без контура), что противоречит WCAG 2.2 AA.
- `impact`: Пользователи, использующие клавиатуру (Tab), не смогут четко видеть активный элемент в футере из-за слабого цветового контраста изменения. Снижение Accessibility score.
- `recommendation`: Удалить классы `outline-none focus-visible:text-primary`, позволяя срабатывать глобальному селектору `*:focus-visible` из `globals.css`.
- `effort`: S
- `dependencies`: None
- `acceptance_check`: При навигации Tab-ом в футере вокруг ссылок появляется четкий primary outline (описанный в globals.css).

### UIX-GEMINI-003

- `id`: UIX-GEMINI-003
- `severity`: major
- `priority`: P1
- `domain`: motion
- `route`: `Global`
- `component`: `RainbowButton`, `Tabs`
- `evidence`: Использование `duration-700` в `RainbowButton.tsx` (строка 35) и `duration: 0.6` (600ms) во `framer-motion` компоненте `Tabs.tsx` (строка 58).
- `problem`: Рамки автоматизированного Governance диктуют ограничение анимаций длинами `150-400ms`. Текущие значения это превышают.
- `impact`: Создает ощущение "лагучего" интерфейса, нарушает Enterprise premium responsiveness guidelines.
- `recommendation`: Заменить durations на значения `duration-300` или кастомные motion tokens (например, `--duration-slow`).
- `effort`: S
- `dependencies`: `tailwind.config.ts`, `globals.css` (motion tokens)
- `acceptance_check`: Нет ни одной анимации > 400ms в скомпилированных css/js.

### UIX-GEMINI-004

- `id`: UIX-GEMINI-004
- `severity`: major
- `priority`: P2
- `domain`: design-system
- `route`: `Global`
- `component`: `RainbowButton`, `HomePage`
- `evidence`: Наличие явных HEX в коде, например: `bg-[#1b1f2f]`, `bg-[#eef1f6]`, `bg-[#229ED9]`, `bg-cyan-300` в `RainbowButton.tsx` и `page.tsx`.
- `problem`: Token Drift. Отход от использования дизайн-токенов (`--color-background`, `bg-muted` и семантических цветов).
- `impact`: Усложняет поддержку тем (Dark Mode), нарушает архитектурную чистоту DCI.
- `recommendation`: Внести необходимые цвета в `tailwind.config.ts` в качестве семантических токенов или использовать существующие (e.g., `bg-primary`, `bg-muted`).
- `effort`: M
- `dependencies`: `globals.css`, `tailwind.config.ts`
- `acceptance_check`: В codebase отсутствуют raw HEX значения `#` для атрибутов цвета после сборки (`grep_search` не должен отдавать прямых совпадений по цветам).

### UIX-GEMINI-005

- `id`: UIX-GEMINI-005
- `severity`: minor
- `priority`: P3
- `domain`: code-quality
- `route`: `/`
- `component`: `Audit CTA Block`
- `evidence`: Строка 478 в `page.tsx`. Telegram-кнопка собрана из десятков кастомных Tailwind слоев "напрямую" (`group relative inline-flex h-12 overflow-hidden bg-white...`).
- `problem`: Дублирование компонента Button. Неиспользование `<Button asChild>` или кастомного UI примитива.
- `impact`: Засорение `page.tsx` визуальным шумом, снижение Component reuse ratio.
- `recommendation`: Вынести Telegram-кнопку в отдельный компонент `src/components/ui/animated-button.tsx` (или аналогичный) и использовать его в странице.
- `effort`: M
- `dependencies`: `src/components/ui/*`
- `acceptance_check`: Отсутствие огромного полотна inline-классов для кнопок в корневом layout'e лендинга.

### UIX-GEMINI-006

- `id`: UIX-GEMINI-006
- `severity`: minor
- `priority`: P3
- `domain`: ux
- `route`: `/`
- `component`: `HomePage`
- `evidence`: Более 4 различных формулировок кнопок, вызывающих один и тот же компонент (`QuizModal`).
- `problem`: Высокая вариативность названий CTAs рассеивает внимание и повышает Cognitive Load Index (CLI).
- `impact`: Отсутствие четкого понимания у пользователя, что произойдет при клике (открывается расчет или форма обратной связи?).
- `recommendation`: Привести все формулировки к 1-2 согласованным стандартам по Enterprise Governance Conversion Score.
- `effort`: S
- `dependencies`: None
- `acceptance_check`: Снижение текстовой энтропии кнопок в маркетинговых блоках.
