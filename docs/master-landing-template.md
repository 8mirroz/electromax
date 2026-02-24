# Master Landing Template --- Инженерные системы (универсальный шаблон)

## Назначение

Единый шаблон для всех услуг: АПС, СОУЭ, СОТ, ОС, СКУД, СКС, ЭОМ, ЭО,
BMS, Умный дом. Каждая услуга создается как отдельный SEO‑лендинг на
базе этого документа.

---

## URL-структура

/services/{service-slug}/ Примеры: /services/aps/ /services/skud/
/services/video/

---

## Якорная навигация (обязательная)

1.  #hero
2.  #calculator
3.  #problems
4.  #included
5.  #packages
6.  #equipment
7.  #pricing
8.  #process
9.  #cases
10. #licenses
11. #faq
12. #request

---

## Экран 1 --- HERO (#hero)

**Цель:** мгновенно объяснить услугу и зафиксировать лид.

### Контент

- Заголовок: «{Название услуги} под ключ»
- Подзаголовок: «Проектирование, монтаж, пусконаладка и сдача»
- Цена: «от {цена} ₽»
- Объекты: {офис, склад, производство, ТРЦ}
- CTA: Рассчитать стоимость

### UI компоненты

HeroBanner PrimaryCTA TrustBadges QuickContacts

### Логика

Кнопка → открывает модальное окно формы (FormModal)

---

## Экран 2 --- Мини‑калькулятор (#calculator)

### Поля

- Тип объекта
- Площадь
- Количество помещений
- Срочность
- Нужные системы

### Логика

Формула: base_price \* area \* complexity_coef

Результат: - мгновенный диапазон стоимости - отправка лида в CRM

### UI

StepForm RangeSlider DynamicPrice

---

## Экран 3 --- Проблемы клиента (#problems)

Карточки: - требования надзора - штрафы - невозможность эксплуатации -
страховые риски

UI: ProblemCards

---

## Экран 4 --- Что входит (#included)

Этапы: 1. Аудит 2. Проектирование 3. Поставка 4. Монтаж 5. Пусконаладка 6. Сдача

UI: TimelineSteps AccordionDetails

---

## Экран 5 --- Пакеты (#packages)

Пакет Для кого

---

Базовый малые помещения
Стандарт коммерция
Премиум производство/ТРЦ

UI: PricingCards ComparisonTable

---

## Экран 6 --- Состав оборудования (#equipment)

- датчики
- контроллеры
- кабель
- исполнительные устройства

UI: InteractiveScheme TooltipInfo

---

## Экран 7 --- Прайс (#pricing)

Таблица: - монтаж - настройка - пусконаладка - обслуживание

UI: SortableTable FilterByArea

---

## Экран 8 --- Процесс (#process)

1.  Заявка
2.  Выезд инженера
3.  Коммерческое предложение
4.  Договор
5.  Работы
6.  Сдача

UI: ProcessTimeline

---

## Экран 9 --- Кейсы (#cases)

Карточка кейса: - тип объекта - площадь - срок - стоимость - фото

UI: CaseGallery BeforeAfterSlider

---

## Экран 10 --- Лицензии (#licenses)

- лицензия МЧС
- СРО
- сертификаты

UI: DocumentViewer

---

## Экран 11 --- FAQ (#faq)

10--15 вопросов

UI: AccordionFAQ

---

## Экран 12 --- Заявка (#request)

Форма: - имя - телефон - email - площадь - комментарий

### Логика

Отправка: CRM Email Telegram bot

---

## CRM Интеграция

Поля лида: service area object_type price_estimate source_utm

---

## Аналитика

Отслеживаемые события: form_submit calculator_complete phone_click
whatsapp_click scroll_50 scroll_90

Инструменты: Google Analytics Yandex Metrika

---

## SEO (обязательно)

### Meta

Title: {Услуга} --- проектирование и монтаж Description: Монтаж {услуга}
под ключ

### Schema.org

LocalBusiness Service FAQPage

---

## Мультиязычность

/ru/ /en/

Переключатель в header.

---

## Компонентная архитектура (React/Next)

components/ Hero/ Calculator/ Problems/ Included/ Pricing/ Equipment/
Cases/ FAQ/ Form/

---

## Поведение мобильной версии

- sticky CTA
- упрощенный калькулятор
- кнопка звонка
- кнопка WhatsApp
