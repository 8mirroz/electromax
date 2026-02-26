# План Для 3 Агентов: 10 Сервисных Страниц (Конкуренты + Маркетинг + XLSX Source Of Truth + Новый UI/UX)

## Краткое резюме

Цель: подготовить и внедрить единый шаблон страниц услуг для `10` разделов из `docs/full_service_sections_archive`, с сильной лидогенерацией под `заказ аудита / добавление в проект`, на основе конкурентного анализа РФ и лучших UX-паттернов (включая global UI-референсы), с управлением контентом и ценами через `XLSX -> импорт в JSON`.

Зафиксированные решения (по вашим ответам):

- Первая волна: `все 10 разделов` архива
- Источник данных: `XLSX + import JSON`
- Конкурентный анализ: `РФ + global UI` (РФ для офферов/цен, global для UX)
- `Project tray`: `LocalStorage v1`
- `AI assistant`: `Sticky UX + rules engine` (без LLM API в MVP)
- SEO: `10 базовых страниц /services/{slug}` + сильные SEO-блоки (без сегментации по объектам в первой волне)

## Текущее состояние (факты из репозитория)

- В проекте уже есть динамический маршрут: `src/app/services/[slug]/page.tsx`
- Есть текущий шаблон страницы услуги с калькулятором справа и lead form
- Текущая база данных услуг: `src/data/services.ts`
- В `src/data/services.ts` сейчас `8` slug (нет `asuz`, `to`)
- Архив шаблонов страниц: `docs/full_service_sections_archive/*.md` содержит `10` разделов
- Нет `admin`-маршрута в `src/app/admin`
- Есть существующий API лидов: `src/app/api/leads/route.ts`
- Есть текущие e2e тесты страниц услуг и калькулятора

## Обязательная целевая структура каждой страницы (единый алгоритм)

## 1. Hero Banner (одна CTA)

- Формат: компактный hero в фирменном стиле Electromax, без копирования референсов
- Цвет hero и анимация: привязка к цвету карточки раздела (map по slug)
- Один основной CTA: `Заказать аудит объекта` (вариант: `Заказать аудит {раздела}`)
- Обязательные элементы:
- Заголовок по услуге
- Подзаголовок (ценность + тип объектов)
- 3 trust-фактора (лицензия/срок/география/интеграция)
- Дисклеймер точности цены (если показывается ориентир)
- Поведение:
- Desktop: компактная высота (как в референсе), не “длинный” первый экран
- Mobile: CTA виден без скролла

## 2. Stats Cards

- 3–4 карточки с цифрами и преимуществами
- Типы метрик:
- SLA ответа
- типовой срок выезда/аудита
- срок подготовки КП
- количество реализованных объектов / география / техподдержка
- Требование:
- Часть цифр допускается как “операционные/маркетинговые” с пометкой/подтверждением в внутреннем контенте
- Не публиковать неподтвержденные цифры как факт

## 3. Карточки готовых кейсов / типовых решений

- 3–6 карточек на раздел
- Два формата карточек:
- “Типовой набор” (например: офис / склад / производство)
- “Решение задачи” (например: подготовка к проверке, модернизация, масштабирование)
- Обязательные поля карточки:
- Название
- Для какого объекта
- Что входит (короткий список)
- Ориентир бюджета (диапазон)
- Срок
- CTA: `Добавить в проект`

## 4. Узкий блок AI-ассистента (sticky rail)

- Формат: узкий sticky-блок справа (или под контентом на mobile)
- MVP: rules engine, не LLM
- Функции:
- Подсказки по добавлению услуг в проект
- Апселлы/кросс-селлы (например: АПС -> СОУЭ -> ТО)
- Проверка пропусков по типу объекта
- Рекомендации по шагам (аудит/проект/монтаж/ПНР/ТО)
- Состояние:
- Читает `Project tray`
- Пишет рекомендации и предложения в UI
- Не отправляет данные наружу

## 5. Перечень услуг (табличные карточки + раскрытие + “Добавить в проект”)

- Терминология:
- Везде заменить `корзина` на `проект`
- Формат блока:
- Заголовок направления
- Табличные строки/карточки
- Раскрытие (accordion/details) для уточняющих опций
- Правая кнопка: `Добавить в проект`
- Обязательное наполнение по строке:
- Наименование услуги
- Единица (`шт`, `м`, `точка`, `м²`, `выезд`, `проект`)
- Ориентир цены (диапазон / от)
- Комментарий/ограничение
- Тип объекта (если релевантно)
- Срок/lead time (если релевантно)
- Источник цены (внутренний/публичный benchmark) — хранится в данных, не обязательно показывается в UI
- Раскрытие строки (если есть):
- Что включено
- Что не включено
- От чего зависит цена
- Связанные услуги
- CTA: `Добавить в проект`

## 6. Мини Roadmap процесса

- Линейный/пошаговый блок: `Заказ -> Аудит -> КП/Договор -> Исполнение -> ПНР/Сдача -> ТО`
- На каждом шаге:
- Что делает клиент
- Что делает Electromax
- Какой артефакт получает клиент
- Типовой срок шага
- Вариативность:
- Некоторые разделы могут скрывать лишние шаги (например, только аудит/модернизация)

## 7. Project Tray (бывшая корзина) из правого угла

- Формат:
- Floating trigger button (правый верх/правый край)
- Drawer справа на desktop, bottom sheet на mobile
- Состояние `LocalStorage v1`
- Что хранит:
- выбранные услуги
- параметры (кол-во, площадь, комментарии)
- источник страницы/кейса
- subtotal/диапазон
- Что умеет:
- добавлять/удалять позицию
- менять количество/параметры
- показать ориентир суммы
- перейти к заявке
- связка с AI rail:
- AI rail видит состав tray и предлагает доп. позиции

## 8. SEO Блок

- Состав:
- SEO-текст (по интенту раздела)
- FAQ (возражения + процесс + цена + сроки + документы)
- Кейсы/сценарии (если не выше)
- Микроразметка:
- `Service`
- `FAQPage`
- `BreadcrumbList`
- Дополнительно:
- Внутренние ссылки на связанные услуги и кейсы
- География и время выезда
- Явные ограничения (точная цена после аудита/ТЗ)

## Целевой набор разделов (1-я волна)

Разделы из архива:

- `aps`
- `asuz`
- `eom`
- `eo`
- `os`
- `sks`
- `skud`
- `sot`
- `soue`
- `to`

Важно:

- В текущем `src/data/services.ts` отсутствуют `asuz`, `to` — это обязательное расширение схемы и контента

## План по 3 агентам (decision-complete)

## Агент 1 — Research / Competitors / Marketing Content (Контент-стратег и аналитик)

### Зона ответственности

- Конкурентный анализ по каждому из 10 разделов
- Маркетинговые офферы, боли, возражения, CTA, кейсы, FAQ, trust-блоки
- Публичные ценовые ориентиры (как benchmark, не “наш прайс”)
- SEO-структура и семантические сущности по каждому разделу
- Наполнение XLSX (контентная часть + benchmark prices + кейсы + FAQ)

### Источники (обязательные)

- Внутренние документы:
- `docs/deep-research-report.md`
- `docs/master-landing-template.md`
- `docs/service_cards_stitch_instruction.md`
- `docs/*.md` по услугам (`APS.md`, `EOM.md`, `...`)
- `docs/full_service_sections_archive/*.md`
- Внешние (перепроверка на дату выполнения):
- РФ конкуренты по структуре/UX/офферам (список из `docs/master-landing-template.md`)
- РФ источники публичных ориентиров цен (список из `docs/master-landing-template.md`)
- Global UI-референсы (только UX/информационная архитектура, без копирования контента)

### Методика анализа (фиксируем)

- Для каждого раздела собрать матрицу:
- Позиционирование (что обещают)
- Основной CTA / secondary CTA
- Лидоген-паттерн (квиз/калькулятор/заявка/звонок)
- Доказательства доверия (лицензии, SLA, кейсы, бренды)
- Формат кейсов (что показывают)
- Формат прайсов (пакеты/поэлементно/по площади/по запросу)
- Процесс работ (этапы)
- FAQ/возражения
- SEO-интент и сущности
- Для каждого найденного пункта фиксировать:
- URL
- дата проверки
- краткая выжимка
- как использовать у нас (адаптировать/не использовать)
- запрет на прямое копирование формулировок/кейсов/изображений

### Выходные артефакты (обязательные)

- `Competitive Matrix` по 10 разделам (для команды)
- `Marketing Brief` по каждому разделу:
- Hero message ladder (3 варианта заголовка + 3 субхеда)
- CTA (1 основной + микро-доверие)
- Stats cards (4 варианта метрик)
- Типовые наборы/кейсы (3–6)
- FAQ (8–12)
- SEO-блок outline + ключевые сущности
- `Benchmark Pricing Pack` (рынок, диапазоны, единицы, источники, дисклеймеры)
- Заполнение соответствующих листов XLSX

### Acceptance критерии для Агента 1

- Для каждого `slug` есть полный Marketing Brief
- Для каждого `slug` есть минимум:
- 3 hero оффера
- 4 stats
- 3 типовых решения/кейса
- 15+ строк услуг/работ (если применимо)
- 8 FAQ
- benchmark price ranges с источниками
- Все внешние данные имеют дату проверки и URL
- Нет копипаста чужого текста/кейсов/визуалов

## Агент 2 — Data / ContentOps / XLSX Import Pipeline (Данные и контент-операции)

### Зона ответственности

- Проектирование единого XLSX как source of truth
- Схема данных для сайта и будущей админки
- Импорт из XLSX в валидированный JSON/TS
- Генерация данных для `10` сервисных страниц
- Обновление/расширение типов и адаптеров контента
- Подготовка контентного конвейера для офлайн-редактирования цен

### Формат источника данных (зафиксировано)

- `XLSX master workbook` — основной формат редактирования
- Импорт в проект через скрипт (offline batch)
- Результат импорта — generated JSON/TS для фронта
- Admin upload сейчас не делаем, но готовим контракт

### Рекомендуемая структура workbook (листы)

- `services`
- `hero`
- `stats_cards`
- `solution_kits`
- `catalog_items`
- `catalog_item_options`
- `process_steps`
- `ai_rules`
- `seo_blocks`
- `faq`
- `price_benchmarks`
- `competitor_sources`
- `cross_sell_map`
- `glossary_units`
- `meta` (версия, дата обновления, ответственный)

### Минимальный состав колонок (обязательный)

- Во всех листах:
- `id`
- `service_slug`
- `is_active`
- `sort_order`
- `updated_at`
- `source_note` (если benchmark/SEO)
- Для `catalog_items`:
- `item_code`
- `item_name`
- `category`
- `unit`
- `price_type` (`from`, `range`, `fixed`, `request`)
- `price_min`
- `price_max`
- `currency`
- `vat_mode`
- `lead_time_min_days`
- `lead_time_max_days`
- `object_types`
- `description_short`
- `includes`
- `excludes`
- `expandable_details`
- `add_to_project_default_qty`
- `benchmark_source_ids`
- Для `solution_kits`:
- `kit_name`
- `use_case`
- `target_object`
- `included_item_codes`
- `budget_min`
- `budget_max`
- `duration_text`
- `cta_label`
- Для `ai_rules`:
- `trigger_type`
- `trigger_value`
- `recommend_item_code`
- `message_text`
- `priority`
- `condition_json`
- Для `seo_blocks` / `faq`:
- `question`
- `answer`
- `schema_include`
- `intent_tag`

### Импортный pipeline (обязательный)

- Скрипт импорта: `scripts/import-services-xlsx.ts` (или `scripts/content/import-services-xlsx.ts`)
- Валидация:
- структурная (обязательные колонки)
- типы данных (числа/диапазоны/slug)
- ссылочная целостность (`service_slug`, `item_code`, `benchmark_source_ids`)
- бизнес-валидация:
- нет отрицательных цен
- `price_min <= price_max`
- unit задан для catalog items
- у каждого `service_slug` полный минимальный набор секций
- Выходные файлы (generated):
- `src/generated/services-content.json`
- `src/generated/services-index.ts`
- `src/generated/content-meta.json`
- Не редактируются вручную (правило)
- Лог ошибок импорта — понятный для контент-менеджера

### Изменения в типах/интерфейсах (публичные)

- Расширить `ServiceConfig` или ввести новый тип `ServicePageModel`
- Добавить типы:
- `ServiceHeroModel`
- `ServiceStatCard`
- `SolutionKit`
- `CatalogItem`
- `CatalogItemOption`
- `ProjectTrayItem`
- `AiAssistRule`
- `SeoFaqItem`
- `BenchmarkPriceRange`
- `ServicePageSeoBlock`
- Источник страницы должен переключиться с `src/data/services.ts` на generated data adapter
- Сохранить backward compatibility на период миграции (adapter layer)

### Future admin compatibility (контракт, без реализации UI)

- Подготовить spec импорта:
- expected `.xlsx` sheets
- версия schema (`schema_version`)
- ответ ошибок
- dry-run режим
- Это ляжет в будущую админку upload/import

### Acceptance критерии для Агента 2

- Импорт проходит для тестового XLSX с 10 разделами
- Генерация данных детерминирована
- Все 10 `slug` доступны в generated index
- Ошибки XLSX валидируются с понятными сообщениями
- Типы фронта покрывают все блоки новой страницы
- `asuz` и `to` поддержаны на уровне данных/типов/роутинга

## Агент 3 — Frontend / UX Template / Project Tray / AI Rail (Продуктовый фронтенд)

### Зона ответственности

- Пересборка шаблона страницы услуги под новую структуру (8 блоков)
- Компоненты UI в стиле Electromax (не копировать референсы)
- Project Tray (`LocalStorage v1`)
- Sticky AI rail (rules engine UI)
- Интеграция generated content
- SEO блок и микроразметка
- e2e и визуальная QA новых страниц

### UI/UX принцип (зафиксирован)

- Визуально: наш стиль (Electromax), референсы только как направление
- Композиционно: компактный hero + быстрые доказательства + наборы решений + каталог + процесс + SEO
- Терминология: только `проект`, не `корзина`

### Целевая компонентная архитектура (предлагаемая, фиксируем)

- `src/components/services/ServiceHeroCompact.tsx`
- `src/components/services/ServiceStatsStrip.tsx`
- `src/components/services/SolutionKitsGrid.tsx`
- `src/components/services/AiAssistantRail.tsx`
- `src/components/services/ServiceCatalogAccordionTable.tsx`
- `src/components/services/ProcessRoadmapMini.tsx`
- `src/components/services/ProjectTrayDrawer.tsx`
- `src/components/services/SeoContentBlock.tsx`
- `src/components/services/FaqAccordion.tsx`
- `src/components/services/StickyProjectButton.tsx`
- `src/hooks/useProjectTray.ts`
- `src/hooks/useAiAssistantRules.ts`
- `src/lib/project-tray.ts`

### Новое поведение страниц услуг (зафиксировано)

- Маршрут остаётся: `/services/[slug]`
- Первая волна без `/services/{slug}/{object-type}`
- На desktop:
- основная колонка контента + правый rail
- AI rail sticky
- project tray drawer вызывается из floating button справа
- На mobile:
- AI rail становится collapsible block в потоке
- project tray drawer превращается в bottom sheet
- Hero CTA всегда видим
- В каталоге услуг:
- каждая строка имеет `Добавить в проект`
- строка может раскрывать детали/опции
- данные берутся только из generated content

### Project Tray v1 (LocalStorage) — контракт

- Storage key: `electromax-project-v1`
- Содержимое:
- `serviceSlug`
- список `items`
- `selectedKitIds`
- `notes`
- `estimatedRange`
- `updatedAt`
- Действия:
- add item
- remove item
- update qty/params
- add kit (bulk add items)
- clear project
- sync derived totals
- UI состояния:
- empty
- has items
- validation warnings (например, нет обязательного шага)
- lead handoff:
- tray summary подставляется в существующую форму/новую форму заявки проекта

### AI Assistant Rail v1 (rules engine) — контракт

- Вход:
- текущий `serviceSlug`
- `project tray` state
- тип объекта (если выбран)
- Выход:
- список рекомендаций:
- “добавить услугу”
- “проверить зависимость”
- “учесть норматив”
- “перейти к аудиту”
- Правила из `ai_rules` sheet
- Без LLM/API вызовов

### SEO блок — реализация

- На каждой странице:
- SEO-текст (управляемый из данных)
- FAQ accordion
- JSON-LD:
- `Service`
- `FAQPage`
- `BreadcrumbList`
- Связанные услуги / internal links
- Дисклеймеры по ценам и точности расчёта

### Acceptance критерии для Агента 3

- Все 10 страниц рендерятся из generated data
- Hero compact по высоте, CTA один
- Project Tray работает между переходами страниц (LocalStorage)
- AI rail sticky на desktop, корректный fallback на mobile
- В каталоге услуг нет слова “корзина”
- Все CTA в каталоге/наборах ведут в `проект`
- SEO блок и FAQ рендерятся, JSON-LD валиден

## Синхронизация между агентами (handoff contracts)

## Контракт 1: Agent 1 -> Agent 2

- Контент и benchmark prices заполняются строго по XLSX схеме
- Все новые типы контента только через согласованные листы/колонки
- Изменение схемы после freeze запрещено без ревью

## Контракт 2: Agent 2 -> Agent 3

- Generated data schema versioned
- Документирован mapping `slug -> theme color -> UI tokens`
- Demo dataset для всех 10 страниц обязателен до начала массовой верстки

## Контракт 3: Agent 3 -> Agent 1

- Список полей, которые “не помещаются” в UI
- Ограничения длины:
- hero title
- subtitle
- stats labels
- kit bullets
- catalog labels
- FAQ question length

## Порядок выполнения (по фазам, 3 агента параллельно)

## Фаза 0 — Freeze спецификации (0.5–1 день)

- Агент 2 фиксирует XLSX schema v1
- Агент 3 фиксирует UI block contracts и лимиты текста
- Агент 1 подтверждает, что schema покрывает маркетинговые поля
- Результат:
- `Schema Freeze v1`
- `UI Content Limits v1`

## Фаза 1 — Research + Data foundation + UI skeleton (2–4 дня)

- Агент 1:
- собирает конкурентную матрицу и marketing briefs
- начинает заполнять XLSX по 10 разделам
- Агент 2:
- делает importer + validation + generated files
- добавляет типы и адаптеры
- Агент 3:
- собирает новые компоненты страницы и проект-трей UI scaffold
- без финального контента, с mock/generated placeholders

## Фаза 2 — End-to-end integration (2–4 дня)

- Агент 2:
- поставляет полноценный generated dataset для 10 разделов
- Агент 3:
- подключает data-driven rendering всех 8 блоков
- реализует `Project Tray v1` и `AI rail rules engine`
- Агент 1:
- контент QA на читаемость, UX-тон, CTA, disclaimers, SEO

## Фаза 3 — QA / SEO / Regression (2–3 дня)

- Агент 3:
- e2e + responsive + a11y sanity
- Agent 2:
- импортные тесты и content validation checks
- Agent 1:
- финальный контент-аудит по чеклисту (10 страниц)

## Фаза 4 — Release package / handoff (1 день)

- Итоговые артефакты:
- 10 страниц
- XLSX master
- importer docs
- content ops guide
- roadmap для будущей admin upload части

## Изменения в публичных API / интерфейсах / типах (обязательный список)

- `src/types/index.ts`
- Добавить новые типы для полной страницы услуги (hero/stats/kits/catalog/process/ai/seo/faq/benchmarks)
- `src/data/services.ts`
- Перевести на adapter или заменить generated data source
- Добавить `asuz`, `to` (через generated pipeline)
- `src/app/services/[slug]/page.tsx`
- Перейти на новый page assembly
- Добавить интеграцию `ProjectTray` + `AI rail` + `SEO block`
- `src/app/services/[slug]/ServiceContent.tsx`
- Вероятно декомпозировать/заменить на new sections
- `src/components/forms/CalculatorForm.tsx`
- Либо адаптировать под “проект”, либо вынести как отдельный optional block (в зависимости от UX решения страницы)
- `src/app/api/leads/route.ts`
- Поддержать payload с `project tray summary` (если не поддерживает сейчас)
- Новый импортный script CLI
- Новый generated content слой
- Новый localStorage contract `electromax-project-v1`

## Тесты и сценарии (обязательные)

## Data / Import tests

- Успешный импорт валидного XLSX (10 разделов)
- Ошибка при пропущенном обязательном листе
- Ошибка при неизвестном `service_slug`
- Ошибка при broken reference (`catalog_item_options -> item_code`)
- Ошибка при `price_min > price_max`
- Проверка, что у каждого `slug` есть hero/stats/catalog/process/seo/faq

## Unit/UI tests

- `useProjectTray`:
- add/remove/update/persist/clear
- `useAiAssistantRules`:
- рекомендации по триггерам и составу проекта
- `ServiceCatalogAccordionTable`:
- раскрытие строки
- добавление в проект
- отображение диапазонов цен

## E2E (Playwright)

- Все 10 `slug` открываются без runtime ошибок
- Hero CTA видим на первом экране (desktop + mobile)
- Добавление позиции в `проект` из каталога
- Добавление набора (kit) в `проект`
- `Project Tray` сохраняется после перехода на другую страницу услуги
- AI rail предлагает релевантные доп. позиции после добавления базовой услуги
- SEO FAQ отображается
- JSON-LD присутствует на странице

## Manual QA / UX checks

- Высота hero соответствует компактному паттерну
- Нигде нет слова “корзина”
- Кнопки `Добавить в проект` читаемы и consistent
- Цвет hero и акцент соответствуют разделу
- Mobile:
- project tray как bottom sheet
- AI rail не мешает чтению
- таблицы/accordion не ломают layout

## Контентные правила (зафиксированные для всей команды)

- Не копировать у конкурентов:
- тексты
- кейсы
- изображения
- логотипы
- формулировки один-в-один
- Использовать конкурентов как источник:
- структуры
- оффер-паттернов
- FAQ-паттернов
- диапазонов цен (с указанием источников внутри внутренней базы)
- На сайте показывать:
- ориентиры и диапазоны
- дисклеймер про точную цену после аудита/ТЗ
- Везде использовать термин `проект` вместо `корзина`

## Что входит / не входит в первую волну (фиксируем)

### Входит

- 10 базовых страниц `/services/{slug}`
- новый шаблон из 8 блоков
- competitor + marketing research (RF + global UI patterns)
- XLSX source of truth + importer
- generated content layer
- Project Tray `LocalStorage v1`
- AI Assistant rail `rules engine v1`
- SEO block + FAQ + JSON-LD

### Не входит (перенос в следующую волну)

- Админка загрузки XLSX (UI)
- LLM-интеграция для AI-ассистента
- SEO-сегментация `/services/{slug}/{object-type}`
- Server-side sync проекта (tray)
- CRM-интеграция нового “проекта” (кроме передачи summary в лид-форму, если будет сделано в рамках страницы)

## Явные допущения и выбранные defaults

- Базовый CTA hero по умолчанию: `Заказать аудит объекта` (персонализируется по разделу при необходимости)
- Источник маркетинговых/benchmark данных: внутренние docs + live web verification на дату выполнения
- Валюта публичных ориентиров для сайта: `RUB`
- Excel является единственным редактируемым источником цен/услуг для первой волны
- Будущая админка будет читать ту же схему XLSX (через import contract), но не реализуется сейчас
- `asuz` и `to` будут добавлены как полноценные страницы наравне с текущими 8 slug
- Визуальный стиль сохраняет язык Electromax, а референсы используются только как UX-направление
