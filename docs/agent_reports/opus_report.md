# OPUS REPORT: Enterprise UI/UX Governance + Conversion Audit for Electromax

## 1. Executive Summary

Выполнен кодовый аудит основных маркетинговых и shared UI-компонентов Electromax против правил `docs/Enterprise_UI_UX_Automated_Audit_Framework.md`, `docs/enterprise-ui-ux-governance-full.md` и locked constraints из `plans/ui_ux_overhaul_plan.md`.

### Итог

- `release_status`: **BLOCKED**
- Основные блокеры: потеря ввода в hero-конфигураторе, сломанные ссылки на сервисы с риском `404`, нарушения motion governance, drift от locked footer constraints.

## 2. Scope & Method

Проверены:

- `src/app/page.tsx`
- `src/components/ui/RainbowButton.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/MobileNav.tsx`
- `src/components/sections/Footer.tsx`
- `src/generated/services-index.ts`
- `src/app/services/[slug]/page.tsx`

Метод:

- code review по governance rules
- сверка с locked UX constraints из overhaul plan
- верификация evidence по line-level ссылкам

## 3. Findings (Opus)

### UIX-OPUS-001

- `id`: UIX-OPUS-001
- `severity`: critical
- `priority`: P0
- `domain`: conversion
- `route`: `/`
- `component`: `PremiumHero`
- `evidence`: `src/app/page.tsx:390` (editable input), `src/app/page.tsx:400` (`setIsQuizOpen(true)`), отсутствие state binding для значения input.
- `problem`: Hero input принимает текст, но введенное значение не сохраняется и не передается в `QuizModal`.
- `impact`: Высокая фрустрация на первом экране; потеря сигнала намерения пользователя.
- `recommendation`: Сделать controlled input и передавать draft в `QuizModal`, либо заменить editable input на псевдо-поле/кнопку.
- `effort`: M
- `dependencies`: `src/components/ui/QuizModal.tsx`
- `acceptance_check`: Текст из hero сохраняется после открытия квиза и предзаполняет поле в квизе, либо поле перестает принимать ввод.

### UIX-OPUS-002

- `id`: UIX-OPUS-002
- `severity`: critical
- `priority`: P0
- `domain`: navigation
- `route`: `/` -> `/services/*`
- `component`: `HomePage service cards`
- `evidence`: `src/app/page.tsx:147` (`/services/iot`), `src/app/page.tsx:160` (`/services/proekt`), `src/app/page.tsx:177` (`/services/pnr`); отсутствуют в `src/generated/services-index.ts:4`; неизвестные slug приводят к `notFound()` в `src/app/services/[slug]/page.tsx:60`.
- `problem`: Часть service cards ведет на slug, не поддерживаемые service-route model.
- `impact`: Пользователь попадает на 404 с ключевых карточек услуг.
- `recommendation`: Синхронизировать slug на главной с `getServicePageSlugs()` (например, `asuz` вместо `iot`) или добавить недостающие page models.
- `effort`: M
- `dependencies`: `src/lib/services-content.ts`, `src/generated/services-index.ts`
- `acceptance_check`: Все ссылки из блока services главной открывают валидные service pages без `notFound()`.

### UIX-OPUS-003

- `id`: UIX-OPUS-003
- `severity`: major
- `priority`: P1
- `domain`: governance
- `route`: `Global`
- `component`: `Footer`
- `evidence`: `plans/ui_ux_overhaul_plan.md:113` (locked footer abbreviations set), `src/components/sections/Footer.tsx:12` (текущий список), `src/components/sections/Footer.tsx:151` (`space-y-3` single column list).
- `problem`: Footer отклонен от locked UX constraints: отсутствует 2-column services grid и обязательный набор кириллических аббревиатур (`АПС`, `АСУЗ`, `ЭО`, `ОС`, `СОУЭ` и т.д.); используются другие значения (`ОПС`, `АСУ`, `Проект`, `ПНР`).
- `impact`: Нарушение согласованного UX baseline и регрессия against approved plan.
- `recommendation`: Восстановить locked footer structure и список abbreviations без изменения бизнес-данных вне согласованного набора.
- `effort`: M
- `dependencies`: `plans/ui_ux_overhaul_plan.md`
- `acceptance_check`: Footer services отображаются в 2 колонки и совпадают с locked abbreviation list.

### UIX-OPUS-004

- `id`: UIX-OPUS-004
- `severity`: major
- `priority`: P1
- `domain`: accessibility
- `route`: `Global`
- `component`: `MobileNav`
- `evidence`: `src/components/ui/MobileNav.tsx:78` (`role="dialog" aria-modal="true"`) при отсутствии focus trap / initial focus / focus return logic; есть только ESC handler (`src/components/ui/MobileNav.tsx:32`).
- `problem`: Мобильный drawer помечен как modal dialog, но не обеспечивает keyboard focus containment.
- `impact`: Keyboard users могут tab-нуться в фоновые элементы, что нарушает expected dialog behavior (WCAG / keyboard navigation completeness).
- `recommendation`: Добавить focus trap и restore focus to trigger; обеспечить initial focus на кнопку закрытия или первый link.
- `effort`: S
- `dependencies`: `focus-trap-react` уже используется в `QuizModal`
- `acceptance_check`: При открытом drawer Tab/Shift+Tab циклически перемещается только внутри drawer; после закрытия focus возвращается на hamburger.

### UIX-OPUS-005

- `id`: UIX-OPUS-005
- `severity`: major
- `priority`: P1
- `domain`: motion
- `route`: `Global`
- `component`: `Hero`, `Footer`, `Tabs`, `RainbowButton`
- `evidence`: `docs/Enterprise_UI_UX_Automated_Audit_Framework.md:116` (150-400ms), `src/app/page.tsx:309` (`0.8s`), `src/components/sections/Footer.tsx:47` (`0.6`), `src/components/ui/Tabs.tsx:58` (`0.6`), `src/components/ui/RainbowButton.tsx:35` (`duration-700`).
- `problem`: Множественные transitions/animations превышают governance duration budget.
- `impact`: Снижение perceived responsiveness, риск блокировки release по performance/motion governance.
- `recommendation`: Привести durations к `--duration-*` (150/220/300/400ms), отдельно документировать исключения.
- `effort`: S
- `dependencies`: `src/styles/globals.css` motion tokens
- `acceptance_check`: В audited components нет анимаций >400ms без явного approved exception.

### UIX-OPUS-006

- `id`: UIX-OPUS-006
- `severity`: major
- `priority`: P1
- `domain`: motion
- `route`: `/`, `Global`
- `component`: `PremiumHero`, `Footer`
- `evidence`: `docs/enterprise-ui-ux-governance-full.md:138` (no infinite loops without user interaction), `src/app/page.tsx:319`, `src/app/page.tsx:327`, `src/app/page.tsx:335`, `src/app/page.tsx:349`, `src/app/page.tsx:498`, `src/components/sections/Footer.tsx:65`, `src/components/sections/Footer.tsx:73`, `src/components/sections/Footer.tsx:274` (`repeat: Infinity`).
- `problem`: Декоративные анимации запускаются в бесконечном цикле без пользовательского триггера и одновременно превышают лимит concurrent animations.
- `impact`: CPU/GPU overhead, distraction, motion sensitivity risk.
- `recommendation`: Оставить максимум 1-2 key loops на экране, остальные заменить на once-on-enter / hover-triggered; добавить reduced-motion bypass.
- `effort`: M
- `dependencies`: Motion audit across landing + footer
- `acceptance_check`: Нет бесконечных декоративных loop-анимаций без explicit product exception; одновременно активных loop-анимаций <=2.

### UIX-OPUS-007

- `id`: UIX-OPUS-007
- `severity`: major
- `priority`: P1
- `domain`: design-system
- `route`: `Global`
- `component`: `HomePage`, `Tabs`, `RainbowButton`
- `evidence`: `docs/Enterprise_UI_UX_Automated_Audit_Framework.md:69` (no inline styles), `src/app/page.tsx:301`, `src/app/page.tsx:338`, `src/app/page.tsx:648`, `src/app/page.tsx:658`, `src/components/ui/Tabs.tsx:52`; raw/inline color gradients in `src/app/page.tsx:306`, `src/components/ui/RainbowButton.tsx:23`.
- `problem`: Inline styles и raw color values обходят token governance и ухудшают enforceability автоматических проверок.
- `impact`: Token drift, сложность CI validation, рост визуальных регрессий.
- `recommendation`: Перевести visual styles на токены/классы; inline transform styles от motion отделить как justified exception и задокументировать.
- `effort`: M
- `dependencies`: `tailwind.config.ts`, `src/styles/globals.css`
- `acceptance_check`: Нет inline style для colors/layout; motion-only inline values задокументированы и минимизированы.

### UIX-OPUS-008

- `id`: UIX-OPUS-008
- `severity`: major
- `priority`: P2
- `domain`: component-api
- `route`: `Global`
- `component`: `AnimatedTabs`
- `evidence`: `src/components/ui/Tabs.tsx:28` state инициализируется из `activeTabId`, но далее prop changes не синхронизируются; компонент декларирует `activeTabId` и `onChange` (`src/components/ui/Tabs.tsx:13`).
- `problem`: Компонент выглядит как partially controlled API, но фактически ведет себя как uncontrolled after mount.
- `impact`: Риски рассинхронизации UI при внешнем управлении вкладками.
- `recommendation`: Поддержать controlled mode (`activeTabId` source of truth when provided`) либо явно удалить controlled API из props.
- `effort`: S
- `dependencies`: Consumers of `AnimatedTabs`
- `acceptance_check`: Изменение `activeTabId` prop извне обновляет активную вкладку без клика пользователя.

### UIX-OPUS-009

- `id`: UIX-OPUS-009
- `severity`: major
- `priority`: P1
- `domain`: accessibility
- `route`: `Global`
- `component`: `Framer/Motion components`
- `evidence`: `src/components/ui/MobileNav.tsx` и `src/components/sections/Footer.tsx` содержат motion-анимации без `useReducedMotion`/`MotionConfig`; CSS reduced-motion rule в `src/styles/globals.css` не покрывает JS-driven motion semantics полностью.
- `problem`: Части motion системы не учитывают пользовательское preference на уровне animation orchestration.
- `impact`: Accessibility degradation for motion-sensitive users.
- `recommendation`: Добавить `useReducedMotion()` или `MotionConfig reducedMotion="user"` для ключевых анимированных компонентов.
- `effort`: S
- `dependencies`: `motion/react` integration policy
- `acceptance_check`: При `prefers-reduced-motion` отключаются non-essential motion sequences (drawer transitions, footer decorative motion, hero decorative loops).

### UIX-OPUS-010

- `id`: UIX-OPUS-010
- `severity`: minor
- `priority`: P2
- `domain`: content
- `route`: `/`
- `component`: CTA labels
- `evidence`: `src/app/page.tsx:412` (`Сгенерировать решение`), `src/app/page.tsx:888` (`ЗАКАЗАТЬ АУДИТ`), `src/components/ui/MobileNav.tsx:141` (`Получить консультацию`).
- `problem`: Несколько разных CTA labels/casing для близких действий повышают когнитивную вариативность.
- `impact`: Размывание primary action semantics.
- `recommendation`: Свести CTA taxonomy к 1-2 стандартным формулировкам и единому casing policy.
- `effort`: XS
- `dependencies`: Product/marketing copy alignment
- `acceptance_check`: Для одинаковых user intents используются согласованные CTA labels.

## 4. Release Gate Evaluation

С учетом `UIX-OPUS-001` и `UIX-OPUS-002` (critical), а также системных motion/design-system нарушений, проект не проходит release gate.

- `critical_issues`: 2
- `a11y_risk`: present
- `motion_governance_risk`: present
- `design_system_risk`: present
- `release_status`: **BLOCKED**

## 5. Scorecard (Opus Estimate)

- `UX_SCORE`: 74
- `DCI_SCORE`: 79
- `A11Y_SCORE`: 88
- `PERFORMANCE_SCORE`: 84
- `CLI_SCORE`: 46
- `CS_SCORE`: 70
- `release_status`: `BLOCKED`
