import type {
  CmsArticle,
  CmsAuthor,
  CmsCaseStudy,
  CmsFaqItem,
  CmsService,
  CmsSiteSettings,
  CmsTestimonial,
  CmsVideo,
} from "@/types/cms";
import { toSlug } from "@/lib/slug";

const nowIso = new Date().toISOString();

export const cmsFallbackAuthors: CmsAuthor[] = [
  {
    id: "author-1",
    slug: "ivan-petrov",
    fullName: "Иван Петров",
    role: "Главный инженер",
    bio: "15+ лет в промышленной инженерной интеграции.",
    locale: "ru",
  },
  {
    id: "author-2",
    slug: "anna-sokolova",
    fullName: "Анна Соколова",
    role: "Руководитель контент-направления",
    bio: "B2B контент и продуктовый маркетинг для инженерных услуг.",
    locale: "ru",
  },
];

const ruArticleBlueprints = [
  "Как подготовить объект к аудиту АПС и СОУЭ",
  "СКУД для офисного центра: типовые ошибки внедрения",
  "Видеонаблюдение на складе: 12 критичных зон контроля",
  "Как снизить стоимость проекта ЭОМ без потери надежности",
  "Чеклист приемки инженерных систем от подрядчика",
  "SLA в техническом обслуживании: что включать в договор",
  "Интеграция систем безопасности с ERP и 1С",
  "Как пройти проверку надзорных органов без аврала",
  "План модернизации инженерной инфраструктуры на 12 месяцев",
  "FAQ для закупки: как сравнивать предложения подрядчиков",
  "Сценарии эвакуации и настройки СОУЭ для БЦ",
  "Аналитика видеопотока: где она реально окупается",
  "Как проектировать кабельную инфраструктуру под рост бизнеса",
  "Пожарная сигнализация в промышленности: практические стандарты",
  "Стратегия поэтапного обновления СКУД на работающем объекте",
  "Сравнение архитектур хранения видеоархива",
  "Паспорт инженерной системы: что должно быть в документации",
  "Аудит энергопотребления в системах освещения",
  "Как выстроить контроль подрядчиков на многоплощадочных объектах",
  "Кейс-карта рисков: от аудита до запуска объекта",
];

export const cmsFallbackArticles: CmsArticle[] = ruArticleBlueprints.map((title, index) => {
  const slug = `ru-${index + 1}-${toSlug(title)}`;
  const contentType = index % 3 === 0 ? "guide" : index % 5 === 0 ? "checklist" : "article";
  return {
    id: `article-${index + 1}`,
    slug,
    title,
    excerpt: "Практический материал для B2B заказчиков: риски, решения и критерии принятия.",
    body: [
      "## Контекст",
      "B2B объектам нужен предсказуемый путь от аудита к запуску без срывов сроков.",
      "## Что делать",
      "Опишите исходные ограничения, определите KPI, согласуйте этапы и зону ответственности.",
      "## Что проверить перед запуском",
      "Наличие техдокументации, протоколов испытаний, SLA и сценариев аварийного реагирования.",
    ].join("\n\n"),
    tags: ["b2b", "инженерные-системы", "безопасность", "эксплуатация"],
    authorSlug: index % 2 === 0 ? "ivan-petrov" : "anna-sokolova",
    contentType,
    publishedAt: nowIso,
    updatedAt: nowIso,
    locale: "ru",
    seo: {
      title: `${title} | Electromax`,
      description: "Подробный гайд для инженеров, закупки и эксплуатации коммерческих объектов.",
    },
  };
});

export const cmsFallbackCaseStudies: CmsCaseStudy[] = [
  {
    id: "case-1",
    slug: "business-center-security-upgrade",
    title: "Модернизация систем безопасности бизнес-центра класса А",
    summary: "Комплексное обновление АПС, СОУЭ, СКУД и видеонаблюдения без остановки арендаторов.",
    challenge: "Несогласованные подсистемы и высокий риск простоев при модернизации.",
    solution: "Поэтапный rollout по этажам с ночными окнами и единой диспетчеризацией.",
    outcomes: ["Срок запуска сокращен на 18%", "Ложные тревоги снижены на 42%"],
    kpiBeforeAfter: [
      { metric: "Ложные тревоги/мес", before: "31", after: "18" },
      { metric: "Время реакции, мин", before: "14", after: "8" },
    ],
    publishedAt: nowIso,
    locale: "ru",
    seo: {
      title: "Кейс: модернизация бизнес-центра | Electromax",
      description: "Практика поэтапного внедрения без остановки эксплуатации.",
    },
  },
  {
    id: "case-2",
    slug: "warehouse-cctv-analytics",
    title: "Видеоаналитика и контроль доступа для складского хаба",
    summary: "Запуск единого контура безопасности на объекте 28 000 м².",
    challenge: "Высокая нагрузка по логистике и отсутствующая сквозная аналитика.",
    solution: "Разделение зон, умные правила видеоаналитики, интеграция с WMS.",
    outcomes: ["Снижение инцидентов на 27%", "Ускорение внутренних расследований"],
    kpiBeforeAfter: [
      { metric: "Инциденты/квартал", before: "22", after: "16" },
      { metric: "Поиск события, мин", before: "45", after: "12" },
    ],
    publishedAt: nowIso,
    locale: "ru",
    seo: {
      title: "Кейс: безопасность складского хаба | Electromax",
      description: "Видеоаналитика, СКУД и процессы эксплуатации в одном проекте.",
    },
  },
  {
    id: "case-3",
    slug: "industrial-power-and-fire",
    title: "Интеграция ЭОМ и АПС на промышленной площадке",
    summary: "Устойчивое электроснабжение и адресная пожарная сигнализация под единым контролем.",
    challenge: "Разные подрядчики и разрыв между силовой и пожарной частями.",
    solution: "Единая проектная модель и регламент совместного ПНР.",
    outcomes: ["Сокращение замечаний надзора", "Прозрачность техобслуживания"],
    kpiBeforeAfter: [
      { metric: "Критичные замечания", before: "11", after: "3" },
      { metric: "Внеплановые простои/год", before: "9", after: "4" },
    ],
    publishedAt: nowIso,
    locale: "ru",
    seo: {
      title: "Кейс: ЭОМ + АПС на производстве | Electromax",
      description: "Как снизить риски на промышленном объекте через единую архитектуру.",
    },
  },
];

export const cmsFallbackTestimonials: CmsTestimonial[] = [
  {
    id: "testimonial-1",
    slug: "bc-vega-cto-review",
    customerName: "Алексей Романов",
    company: "БЦ Вега",
    quote: "Команда дала понятный план и соблюла сроки внедрения без потери доступности объекта.",
    rating: 5,
    locale: "ru",
  },
  {
    id: "testimonial-2",
    slug: "logistic-hub-security-head",
    customerName: "Марина Климова",
    company: "FM Logistic Hub",
    quote: "Ключевая ценность — прозрачная аналитика инцидентов и дисциплина регламентов.",
    rating: 5,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    locale: "ru",
  },
  {
    id: "testimonial-3",
    slug: "industrial-plant-ops-director",
    customerName: "Олег Денисов",
    company: "Техно Маш",
    quote: "После запуска снизили число внеплановых остановок и упростили обслуживание.",
    rating: 5,
    locale: "ru",
  },
];

export const cmsFallbackVideos: CmsVideo[] = [
  {
    id: "video-1",
    slug: "audit-walkthrough",
    title: "Разбор инженерного аудита на коммерческом объекте",
    summary: "Пошаговый процесс диагностики и подготовки карты рисков.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    durationSeconds: 420,
    locale: "ru",
    seo: {
      title: "Видео: инженерный аудит | Electromax",
      description: "Практический разбор этапов аудита для B2B объектов.",
    },
  },
  {
    id: "video-2",
    slug: "case-study-walkthrough",
    title: "Кейс: модернизация БЦ без остановки эксплуатации",
    summary: "Что делать, чтобы обновить критичные системы в рабочем здании.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    durationSeconds: 510,
    locale: "ru",
    seo: {
      title: "Видео-кейс: модернизация БЦ | Electromax",
      description: "Пошаговая схема rollout и контроля рисков.",
    },
  },
];

export const cmsFallbackFaqs: CmsFaqItem[] = [
  {
    id: "faq-1",
    slug: "faq-sla-response-time",
    question: "Какой SLA вы фиксируете на аварийный выезд?",
    answer: "Обычно фиксируем SLA в договоре по категориям критичности инцидентов.",
    intentTag: "sla",
    locale: "ru",
  },
  {
    id: "faq-2",
    slug: "faq-audit-duration",
    question: "Сколько длится аудит перед проектированием?",
    answer: "В среднем 3-7 рабочих дней, в зависимости от площади и сложности объекта.",
    intentTag: "audit",
    locale: "ru",
  },
];

export const cmsFallbackServices: CmsService[] = [
  {
    id: "svc-1",
    slug: "aps",
    title: "Автоматическая пожарная сигнализация",
    shortName: "АПС",
    description: "Проектирование и монтаж АПС.",
    locale: "ru",
    seo: { title: "АПС | Electromax", description: "Услуги по АПС для B2B объектов." },
  },
  {
    id: "svc-2",
    slug: "soue",
    title: "Система оповещения и управления эвакуацией",
    shortName: "СОУЭ",
    description: "Речевое и световое оповещение.",
    locale: "ru",
    seo: { title: "СОУЭ | Electromax", description: "Услуги по СОУЭ для B2B объектов." },
  },
  {
    id: "svc-3",
    slug: "sot",
    title: "Системы видеонаблюдения",
    shortName: "СОТ",
    description: "Видеоаналитика и контроль событий.",
    locale: "ru",
    seo: { title: "СОТ | Electromax", description: "Видеонаблюдение и аналитика." },
  },
];

export const cmsFallbackSiteSettings: CmsSiteSettings[] = [
  {
    id: "settings-ru",
    locale: "ru",
    siteName: "Electromax",
    defaultTitle: "Electromax | Инженерная интеграция систем безопасности",
    defaultDescription: "Контентная и инженерная платформа для B2B объектов.",
  },
];
