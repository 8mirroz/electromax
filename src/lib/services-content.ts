import generatedServicesJson from "@/generated/services-content.json";
import { GENERATED_SERVICE_SLUGS, type GeneratedServiceSlug } from "@/generated/services-index";
import { SERVICES_DB } from "@/data/services";
import type {
  AiAssistRule,
  BenchmarkPriceRange,
  CatalogItem,
  PriceType,
  ProcessRoadmapStep,
  SeoFaqItem,
  ServiceCatalogSection,
  ServiceConfig,
  ServiceHeroModel,
  ServicePageModel,
  ServicePageSeoBlock,
  ServiceStatCard,
  ServiceThemeTokens,
  SolutionKit,
} from "@/types";

type SeedTheme = Partial<ServiceThemeTokens>;
type SeedHero = Partial<ServiceHeroModel>;

type ServicePageSeed = {
  slug: GeneratedServiceSlug;
  title?: string;
  shortName?: string;
  description?: string;
  theme?: SeedTheme;
  hero?: SeedHero;
};

type Agent2AltCatalogItem = {
  itemCode?: string;
  itemName?: string;
  category?: string;
  unit?: string;
  priceType?: PriceType;
  priceMin?: number;
  priceMax?: number;
  currency?: "RUB";
  descriptionShort?: string;
  leadTimeMinDays?: number;
  leadTimeMaxDays?: number;
  includes?: string[];
  excludes?: string[];
  objectTypes?: string[];
  priceDependsOn?: string[];
  addToProjectDefaultQty?: number;
};

type Agent2AltProcessStep = {
  stepId?: string;
  title?: string;
  clientAction?: string;
  contractorAction?: string;
  artifact?: string;
  leadTime?: string;
};

type Agent2AltSeoBlock = {
  title?: string;
  description?: string;
  textBlock?: string;
  faq?: Array<{ question?: string; answer?: string; schemaInclude?: boolean; intentTag?: string }>;
};

type Agent2AltPageModel = {
  slug: string;
  title?: string;
  shortName?: string;
  description?: string;
  themeColor?: string;
  hero?: { title?: string; subtitle?: string; trustFactors?: string[]; disclaimer?: string };
  stats?: Array<{
    label?: string;
    value?: string;
    subValue?: string;
    isMarketing?: boolean;
    id?: string;
    description?: string;
  }>;
  solutionKits?: Array<{
    kitId?: string;
    kitName?: string;
    useCase?: string;
    targetObject?: string;
    bullets?: string[];
    includedItemCodes?: string[];
    budgetMin?: number;
    budgetMax?: number;
    durationText?: string;
    ctaLabel?: string;
  }>;
  catalogItems?: Agent2AltCatalogItem[];
  processSteps?: Agent2AltProcessStep[];
  aiRules?: Array<{
    ruleId?: string;
    triggerType?: string;
    triggerValue?: string;
    recommendItemCode?: string;
    messageText?: string;
    priority?: number;
    conditionJson?: string;
  }>;
  seoBlock?: Agent2AltSeoBlock;
};

type GeneratedServicesFile =
  | { services?: Array<Partial<ServicePageModel> & { slug: string }> }
  | Agent2AltPageModel[]
  | {
      schemaVersion?: string;
      generatedAt?: string;
      services?: Array<Partial<ServicePageModel> & { slug: string }>;
    };

const generatedServiceRows = (() => {
  const raw = generatedServicesJson as unknown as GeneratedServicesFile;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.services)) return raw.services;
  return [];
})();

const seedMap = new Map(
  generatedServiceRows
    .filter((seed): seed is ServicePageSeed => typeof (seed as { slug?: string }).slug === "string")
    .map((seed) => [seed.slug as GeneratedServiceSlug, seed]),
);

const generatedRowMap = new Map(
  generatedServiceRows
    .filter(
      (row): row is (Partial<ServicePageModel> & { slug: string }) | Agent2AltPageModel =>
        typeof (row as { slug?: string }).slug === "string",
    )
    .map((row) => [row.slug, row]),
);

const objectTypeLabels: Record<string, string> = {
  office: "офис",
  warehouse: "склад",
  industrial: "производство",
  mall: "торговый объект",
};

const slugThemeDefaults: Record<string, ServiceThemeTokens> = {
  aps: { accent: "#ef4444", accentSoft: "#fff1f1", accentStrong: "#991b1b" },
  asuz: { accent: "#14b8a6", accentSoft: "#ecfeff", accentStrong: "#115e59" },
  eom: { accent: "#f59e0b", accentSoft: "#fffbeb", accentStrong: "#92400e" },
  eo: { accent: "#06b6d4", accentSoft: "#ecfeff", accentStrong: "#155e75" },
  os: { accent: "#16a34a", accentSoft: "#f0fdf4", accentStrong: "#14532d" },
  sks: { accent: "#7c3aed", accentSoft: "#f5f3ff", accentStrong: "#4c1d95" },
  skud: { accent: "#22c55e", accentSoft: "#f0fdf4", accentStrong: "#166534" },
  sot: { accent: "#2563eb", accentSoft: "#eff6ff", accentStrong: "#1e3a8a" },
  soue: { accent: "#f97316", accentSoft: "#fff7ed", accentStrong: "#9a3412" },
  to: { accent: "#ea580c", accentSoft: "#fff7ed", accentStrong: "#9a3412" },
  ov: { accent: "#06b6d4", accentSoft: "#ecfeff", accentStrong: "#155e75" },
  p: { accent: "#8b5cf6", accentSoft: "#f5f3ff", accentStrong: "#5b21b6" },
  pnr: { accent: "#f97316", accentSoft: "#fff7ed", accentStrong: "#9a3412" },
};

type LegacyLike = Pick<
  ServiceConfig,
  | "id"
  | "title"
  | "shortName"
  | "description"
  | "basePricePerSqm"
  | "complexity"
  | "content"
  | "packages"
  | "includedSteps"
  | "equipment"
>;

const stubServices: Record<string, LegacyLike> = {
  asuz: {
    id: "asuz",
    title: "Автоматизация и диспетчеризация инженерных систем (АСУЗ)",
    shortName: "АСУЗ",
    description:
      "Интеграция инженерных подсистем в единый контур управления: диспетчеризация, сценарии, мониторинг и алерты.",
    basePricePerSqm: 1200,
    complexity: { office: 1, warehouse: 1.2, industrial: 1.5 },
    content: {
      hero: {
        subtitle:
          "Проверяем текущую автоматику, точки отказа и сценарии взаимодействия между вентиляцией, электроснабжением, освещением и безопасностью.",
        features: [
          "Интеграция подсистем",
          "Сценарии и аварийные режимы",
          "Диспетчерский контроль 24/7",
        ],
      },
      problems: [
        {
          title: "Разрозненные системы",
          description: "Подсистемы работают отдельно и не передают статусы в единый центр.",
        },
        {
          title: "Нет логов и алертов",
          description: "Аварии обнаруживаются поздно, без понятной причины и истории событий.",
        },
        {
          title: "Сложное масштабирование",
          description: "При расширении объекта текущая автоматика плохо переносится и конфликтует.",
        },
      ],
    },
    packages: [
      {
        title: "Аудит и карта интеграций",
        oneTimePrice: 45000,
        features: ["Инвентаризация контуров и протоколов"],
      },
      {
        title: "Сценарии и диспетчеризация",
        oneTimePrice: 180000,
        features: ["Настройка логики, алертов и панелей"],
      },
      {
        title: "Сопровождение",
        monthlyPrice: 15000,
        features: ["Регламентное обслуживание и корректировки"],
      },
    ],
    includedSteps: [
      { title: "Аудит", description: "Сбор текущей схемы, протоколов и зависимостей" },
      { title: "Проект", description: "Проектирование интеграционной архитектуры" },
      { title: "Реализация", description: "Монтаж/подключение контроллеров и шлюзов" },
      { title: "ПНР", description: "Настройка сценариев, журналов и уведомлений" },
      { title: "Сопровождение", description: "Поддержка и оптимизация логики" },
    ],
    equipment: [
      "Контроллеры автоматизации",
      "I/O модули и шлюзы протоколов",
      "Диспетчерские панели",
      "Сервер/ПО визуализации",
      "Датчики и исполнительные устройства",
    ],
  },
  to: {
    id: "to",
    title: "Техническое обслуживание инженерных и слаботочных систем (ТО)",
    shortName: "ТО",
    description:
      "Регламентные работы, аварийный выезд, журналы обслуживания и сопровождение систем безопасности и инженерии.",
    basePricePerSqm: 120,
    complexity: { office: 1, warehouse: 1.1, industrial: 1.3 },
    content: {
      hero: {
        subtitle:
          "Оцениваем состояние систем, полноту регламентов и фактическую готовность объекта к проверкам и аварийным сценариям.",
        features: [
          "SLA и аварийный выезд",
          "Журналы и регламенты",
          "Плановые проверки и профилактика",
        ],
      },
      problems: [
        {
          title: "Формальное ТО",
          description: "Работы закрываются на бумаге, а реальные неисправности накапливаются.",
        },
        {
          title: "Срыв SLA",
          description: "Нет понятного графика и ответственного за критичные узлы.",
        },
        {
          title: "Проверки и замечания",
          description: "Документы и фактическое состояние объекта расходятся.",
        },
      ],
    },
    packages: [
      { title: "Ежемесячное ТО", monthlyPrice: 9000, features: ["Плановые регламентные работы"] },
      {
        title: "Расширенное SLA",
        monthlyPrice: 25000,
        features: ["Приоритетный выезд и аварийные вызовы"],
      },
      {
        title: "Разовый аудит состояния",
        oneTimePrice: 30000,
        features: ["Чек-лист, риски, план восстановления"],
      },
    ],
    includedSteps: [
      { title: "Приемка", description: "Аудит состояния и сбор документации" },
      { title: "Регламент", description: "Формирование графика ТО и SLA" },
      { title: "Плановые работы", description: "Проверка, тестирование, профилактика" },
      { title: "Аварийное реагирование", description: "Выезд, локализация и восстановление" },
      { title: "Отчетность", description: "Журнал работ и рекомендации" },
    ],
    equipment: [
      "Контрольные приборы и панели",
      "Линии связи и питания",
      "Периферийные датчики и оповещатели",
      "Запорная и исполнительная арматура (по системам)",
      "Журналы и исполнительная документация",
    ],
  },
};

const relatedServiceMap: Record<string, string[]> = {
  aps: ["soue", "to", "skud"],
  asuz: ["eom", "eo", "to"],
  eom: ["eo", "asuz", "to"],
  eo: ["eom", "asuz", "to"],
  os: ["sot", "skud", "to"],
  sks: ["sot", "skud", "asuz"],
  skud: ["aps", "os", "to"],
  sot: ["os", "sks", "to"],
  soue: ["aps", "to", "skud"],
  to: ["aps", "soue", "skud"],
  ov: ["asuz", "eom", "to"],
  p: ["aps", "eom", "asuz"],
  pnr: ["p", "asuz", "to"],
};

function capitalize(text: string) {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
}

export function formatCatalogItemPrice(item: CatalogItem) {
  if (item.priceType === "request" || !item.priceMin) return "По запросу";
  if (item.priceType === "fixed") return `${item.priceMin.toLocaleString("ru-RU")} ₽`;
  if (item.priceMin === item.priceMax) return `${item.priceMin.toLocaleString("ru-RU")} ₽`;
  return `от ${item.priceMin.toLocaleString("ru-RU")} ₽`;
}

function toAccentTokens(accent?: string): ServiceThemeTokens | null {
  if (!accent) return null;
  return {
    accent,
    accentSoft: `${accent}14`,
    accentStrong: accent,
  };
}

function normalizeCatalogFromAlt(
  slug: string,
  shortName: string,
  items?: Agent2AltCatalogItem[],
): ServiceCatalogSection[] {
  if (!items?.length) return [];

  const normalizedItems: CatalogItem[] = items
    .filter((item) => item && (item.itemName || item.itemCode)) // Ensure it's not a stat
    .map((item, index) => ({
      id: `${slug}-alt-item-${index + 1}`,
      itemCode: item.itemCode || `SKU-${slug}-${index + 1}`,
      name: item.itemName || "Услуга",
      unit: item.unit || "услуга",
      category: item.category || "Основные работы",
      priceMin: item.priceMin || 0,
      priceMax: item.priceMax || item.priceMin || 0,
      priceType: (item.priceType as "from" | "fixed" | "request") || "from",
      includes: item.includes || [],
      excludes: item.excludes || [],
      priceDependsOn: item.priceDependsOn || ["Объема работ"],
    }));

  return [
    {
      id: `${slug}-catalog-main`,
      title: `Работы и поставка по направлению ${shortName}`,
      items: normalizedItems,
    },
  ];
}

function normalizeProcessFromAlt(
  slug: string,
  steps?: Agent2AltProcessStep[],
): ProcessRoadmapStep[] {
  if (!steps?.length) return [];
  return steps.map((step, index) => ({
    id: step.stepId || `${slug}-process-${index + 1}`,
    title: step.title || `Шаг ${index + 1}`,
    clientAction: step.clientAction || "Уточняется",
    oneDimAction: step.contractorAction || "Уточняется",
    artifact: step.artifact || "Документ/акт",
    durationText: step.leadTime || "по графику",
  }));
}

function normalizeAiRulesFromAlt(
  slug: string,
  rules?: Agent2AltPageModel["aiRules"],
): AiAssistRule[] {
  if (!rules?.length) return [];
  return rules.map((rule, index) => ({
    id: rule.ruleId || `${slug}-rule-${index + 1}`,
    triggerType: (rule.triggerType as AiAssistRule["triggerType"]) || "service_open",
    triggerValue: rule.triggerValue,
    recommendItemCode: rule.recommendItemCode,
    messageText: rule.messageText || "Проверьте состав проекта",
    priority: typeof rule.priority === "number" ? rule.priority : 10,
    conditionJson: rule.conditionJson,
  }));
}

function normalizeSeoFromAlt(
  slug: string,
  seoBlock?: Agent2AltSeoBlock,
): { seo?: ServicePageSeoBlock; faq: SeoFaqItem[] } {
  if (!seoBlock) return { faq: [] };

  const paragraphs = [seoBlock.description, seoBlock.textBlock].filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );

  const faq: SeoFaqItem[] = (seoBlock.faq || [])
    .filter((item) => item.question && item.answer)
    .map((item, index) => ({
      id: `${slug}-faq-alt-${index + 1}`,
      question: item.question as string,
      answer: item.answer as string,
      schemaInclude: item.schemaInclude ?? true,
      intentTag: item.intentTag,
    }));

  return {
    seo:
      seoBlock.title || paragraphs.length
        ? {
            title: seoBlock.title || `Услуга ${slug.toUpperCase()}`,
            paragraphs,
            relatedServiceSlugs: [],
          }
        : undefined,
    faq,
  };
}

function normalizeGeneratedRow(
  row: (Partial<ServicePageModel> & { slug: string }) | Agent2AltPageModel,
): Partial<ServicePageModel> {
  const anyRow = row as Record<string, unknown>;
  const looksLikeCurrent =
    "catalog" in anyRow ||
    "process" in anyRow ||
    "seo" in anyRow ||
    ("hero" in anyRow &&
      typeof anyRow.hero === "object" &&
      anyRow.hero !== null &&
      "ctaLabel" in (anyRow.hero as object));

  if (looksLikeCurrent) {
    return row as Partial<ServicePageModel>;
  }

  const alt = row as Agent2AltPageModel;
  const theme = toAccentTokens(alt.themeColor);
  const { seo, faq } = normalizeSeoFromAlt(alt.slug, alt.seoBlock);

  return {
    slug: alt.slug,
    title: alt.title,
    shortName: alt.shortName,
    description: alt.description,
    theme: theme ?? undefined,
    hero: alt.hero
      ? {
          title: alt.hero.title || alt.title || alt.slug,
          subtitle: alt.hero.subtitle || alt.description || "",
          ctaLabel: "Заказать аудит объекта",
          trustItems: alt.hero.trustFactors || [],
          priceDisclaimer: alt.hero.disclaimer,
        }
      : undefined,
    stats: alt.stats?.map((stat, index) => ({
      id: stat.id || `${alt.slug}-stat-alt-${index + 1}`,
      label: stat.label || "Метрика",
      value: stat.value || "-",
      description:
        stat.description ||
        stat.subValue ||
        (stat.isMarketing ? "Маркетинговая метрика" : "Операционная метрика"),
      verified: !stat.isMarketing,
    })),
    solutionKits: alt.solutionKits?.map((kit, index) => ({
      id: kit.kitId || `${alt.slug}-kit-alt-${index + 1}`,
      name: kit.kitName || `Набор ${index + 1}`,
      useCase: kit.useCase || "Типовое решение",
      targetObject: kit.targetObject || "объект",
      bullets: kit.bullets || [],
      includedItemCodes: kit.includedItemCodes || [],
      budgetMin: kit.budgetMin,
      budgetMax: kit.budgetMax,
      currency: "RUB",
      durationText: kit.durationText || "по графику",
      ctaLabel: kit.ctaLabel || "Добавить в проект",
    })),
    catalog: normalizeCatalogFromAlt(
      alt.slug,
      alt.shortName || alt.slug.toUpperCase(),
      alt.catalogItems,
    ),
    process: normalizeProcessFromAlt(alt.slug, alt.processSteps),
    aiRules: normalizeAiRulesFromAlt(alt.slug, alt.aiRules),
    seo,
    faq,
  };
}

function mergeGeneratedIntoBase(
  base: ServicePageModel,
  generatedRow?: (Partial<ServicePageModel> & { slug: string }) | Agent2AltPageModel,
): ServicePageModel {
  if (!generatedRow) return base;

  const generated = normalizeGeneratedRow(generatedRow);
  const generatedRelated =
    generated.relatedServiceSlugs && generated.relatedServiceSlugs.length > 0
      ? generated.relatedServiceSlugs
      : base.relatedServiceSlugs;

  return {
    ...base,
    title: generated.title || base.title,
    shortName: generated.shortName || base.shortName,
    description: generated.description || base.description,
    theme: generated.theme ? { ...base.theme, ...generated.theme } : base.theme,
    hero: generated.hero ? { ...base.hero, ...generated.hero } : base.hero,
    stats: generated.stats && generated.stats.length > 0 ? generated.stats : base.stats,
    solutionKits:
      generated.solutionKits && generated.solutionKits.length > 0
        ? generated.solutionKits
        : base.solutionKits,
    catalog: generated.catalog && generated.catalog.length > 0 ? generated.catalog : base.catalog,
    process: generated.process && generated.process.length > 0 ? generated.process : base.process,
    aiRules: generated.aiRules && generated.aiRules.length > 0 ? generated.aiRules : base.aiRules,
    seo: generated.seo
      ? {
          ...base.seo,
          ...generated.seo,
          relatedServiceSlugs:
            generated.seo.relatedServiceSlugs && generated.seo.relatedServiceSlugs.length > 0
              ? generated.seo.relatedServiceSlugs
              : base.seo.relatedServiceSlugs,
        }
      : base.seo,
    faq: generated.faq && generated.faq.length > 0 ? generated.faq : base.faq,
    benchmarks:
      generated.benchmarks && generated.benchmarks.length > 0
        ? generated.benchmarks
        : base.benchmarks,
    relatedServiceSlugs: generatedRelated,
  };
}

function buildCatalogItems(service: LegacyLike): CatalogItem[] {
  const packages = service.packages || [];
  const packageItems: CatalogItem[] = packages.map((pkg, index) => {
    const price = pkg.oneTimePrice ?? pkg.monthlyPrice;
    const isMonthly = Boolean(pkg.monthlyPrice && !pkg.oneTimePrice);
    return {
      id: `${service.id}-pkg-${index + 1}`,
      itemCode: `${service.id.toUpperCase()}-PKG-${index + 1}`,
      category: "Готовые работы",
      name: pkg.title,
      unit: isMonthly ? "мес" : "проект",
      priceType: "from",
      priceMin: price,
      currency: "RUB",
      comment: pkg.features[0],
      objectTypes: Object.keys(service.complexity),
      leadTimeText: isMonthly ? "старт в течение 1-3 дней" : "3-15 дней",
      includes: pkg.features,
      excludes: ["Точная спецификация после аудита/ТЗ"],
      priceDependsOn: ["Площадь и конфигурация объекта", "Наличие действующей документации"],
      relatedServiceSlugs: relatedServiceMap[service.id] ?? [],
      addToProjectDefaultQty: 1,
    };
  });

  const stageItems: CatalogItem[] = [
    [
      "AUDIT",
      "Аудит объекта",
      "выезд",
      Math.max(12000, Math.round(service.basePricePerSqm * 20)),
      "Акт обследования и перечень замечаний",
    ],
    [
      "PROJ",
      "Проектирование / ТЗ",
      "проект",
      Math.max(25000, Math.round(service.basePricePerSqm * 60)),
      "Подготовка проектных решений",
    ],
    [
      "INSTALL",
      "Монтаж / внедрение",
      "проект",
      Math.max(45000, Math.round(service.basePricePerSqm * 100)),
      "Исполнение по согласованному объему",
    ],
    [
      "PNR",
      "Пусконаладка / тестирование",
      "проект",
      Math.max(18000, Math.round(service.basePricePerSqm * 35)),
      "Проверка сценариев и сдача",
    ],
    [
      "DOC",
      "Исполнительная документация",
      "проект",
      Math.max(10000, Math.round(service.basePricePerSqm * 20)),
      "Комплект актов и схем",
    ],
    [
      "TO",
      "Техническое обслуживание",
      "мес",
      Math.max(5000, Math.round(service.basePricePerSqm * 10)),
      "Регламентные работы по графику",
    ],
  ].map(([code, name, unit, min, comment], index) => ({
    id: `${service.id}-stage-${index + 1}`,
    itemCode: `${service.id.toUpperCase()}-${code}`,
    category: "Этапы проекта",
    name: String(name),
    unit: String(unit),
    priceType: "from" as const,
    priceMin: Number(min),
    currency: "RUB" as const,
    comment: String(comment),
    objectTypes: Object.keys(service.complexity),
    leadTimeText: index === 0 ? "1-2 дня" : "по графику проекта",
    includes: [String(comment), "Координация с ответственным от заказчика"],
    excludes: ["Материалы и оборудование, если не указаны в КП"],
    priceDependsOn: ["Площадь", "Количество зон/точек", "Срок выполнения"],
    relatedServiceSlugs: relatedServiceMap[service.id] ?? [],
    addToProjectDefaultQty: 1,
  }));

  const equipment = service.equipment || [];
  const equipmentItems: CatalogItem[] = equipment.slice(0, 9).map((eq, index) => ({
    id: `${service.id}-eq-${index + 1}`,
    itemCode: `${service.id.toUpperCase()}-SUP-${index + 1}`,
    category: "Поставка и комплектующие",
    name: `Поставка: ${eq}`,
    unit: "шт",
    priceType: "request",
    currency: "RUB",
    comment: "Цена зависит от бренда, доступности и спецификации",
    objectTypes: Object.keys(service.complexity),
    leadTimeText: "3-14 дней",
    includes: ["Подбор аналога/бренда", "Проверка совместимости с проектом"],
    excludes: ["Монтаж и ПНР, если не добавлены отдельно"],
    priceDependsOn: ["Бренд и серия", "Срок поставки", "Объем партии"],
    relatedServiceSlugs: relatedServiceMap[service.id] ?? [],
    addToProjectDefaultQty: 1,
  }));

  return [...stageItems, ...packageItems, ...equipmentItems].slice(0, 18);
}

function buildCatalogSections(service: LegacyLike): ServiceCatalogSection[] {
  const items = buildCatalogItems(service);
  return [
    {
      id: `${service.id}-catalog-main`,
      title: `Работы и поставка по направлению ${service.shortName}`,
      description:
        "Ориентиры указаны для предварительной оценки. Точная стоимость формируется после аудита и согласования состава работ.",
      items,
    },
  ];
}

function buildSolutionKits(service: LegacyLike): SolutionKit[] {
  const catalogItems = buildCatalogItems(service);
  const byPrefix = (needle: string) =>
    catalogItems
      .filter((item) => item.itemCode.includes(needle))
      .slice(0, 2)
      .map((i) => i.itemCode);

  const defaults: Array<
    Pick<SolutionKit, "id" | "name" | "useCase" | "targetObject" | "durationText">
  > = [
    {
      id: `${service.id}-kit-audit`,
      name: "Стартовый аудит",
      useCase: "Подготовка к запуску работ / проверке",
      targetObject: "офис, магазин, склад",
      durationText: "1-3 дня",
    },
    {
      id: `${service.id}-kit-modernization`,
      name: "Модернизация участка",
      useCase: "Замена критичных узлов без полной остановки",
      targetObject: "действующий объект",
      durationText: "3-10 дней",
    },
    {
      id: `${service.id}-kit-scale`,
      name: "Расширение и интеграция",
      useCase: "Добавление зон, точек, сценариев",
      targetObject: "склад / производство",
      durationText: "1-4 недели",
    },
  ];

  return defaults.map((kit, index) => ({
    ...kit,
    bullets: [
      `Фокус на направлении ${service.shortName}`,
      "Чек-лист рисков и ограничений",
      "Ориентир бюджета и график этапов",
    ],
    includedItemCodes:
      index === 0
        ? byPrefix("AUDIT")
        : index === 1
          ? [...byPrefix("PROJ"), ...byPrefix("INSTALL")]
          : [...byPrefix("PNR"), ...byPrefix("TO")],
    budgetMin: Math.max(25000, Math.round(service.basePricePerSqm * (index + 1) * 40)),
    budgetMax: Math.max(60000, Math.round(service.basePricePerSqm * (index + 1) * 120)),
    currency: "RUB",
    ctaLabel: "Добавить в проект",
  }));
}

function buildStats(service: LegacyLike): ServiceStatCard[] {
  const complexityValues = Object.values(service.complexity);
  const maxComplexity = Math.max(...complexityValues, 1);
  const responseSla = maxComplexity > 1.4 ? "до 30 мин" : "до 15 мин";
  const auditDays = maxComplexity > 1.4 ? "1-3 дня" : "1-2 дня";
  const quoteHours = maxComplexity > 1.4 ? "24-72 ч" : "24-48 ч";
  const geography = "Москва и МО";

  return [
    {
      id: `${service.id}-stat-sla`,
      label: "Ответ инженера",
      value: responseSla,
      description: "Операционная метрика. Подтверждается внутренним SLA.",
      verified: false,
    },
    {
      id: `${service.id}-stat-audit`,
      label: "Выезд / аудит",
      value: auditDays,
      description: "Типовой срок первичного обследования по загруженности и географии.",
      verified: false,
    },
    {
      id: `${service.id}-stat-quote`,
      label: "Подготовка КП",
      value: quoteHours,
      description: "После аудита/ТЗ и уточнения состава работ.",
      verified: false,
    },
    {
      id: `${service.id}-stat-geo`,
      label: "География",
      value: geography,
      description: "Выезды по Москве и Московской области.",
      verified: true,
    },
  ];
}

function buildHero(service: LegacyLike): ServiceHeroModel {
  const objectHint = Object.keys(service.complexity)
    .map((key) => objectTypeLabels[key] ?? key)
    .slice(0, 3)
    .join(", ");

  const baseSubtitle = service.content?.hero?.subtitle?.trim() || service.description;
  const trustItems = service.content?.hero?.features?.filter(Boolean).slice(0, 3) ?? [];

  return {
    title: service.title,
    subtitle: `${baseSubtitle} Объекты: ${objectHint}.`,
    ctaLabel: `Заказать аудит ${service.shortName}`,
    ctaHint: "Точная цена после аудита/ТЗ. На странице показаны ориентиры.",
    trustItems:
      trustItems.length >= 3
        ? trustItems
        : [
            "Инженерный аудит до КП и договора",
            "Согласуем состав работ и сроки",
            "Интеграция со смежными системами при необходимости",
          ],
    priceDisclaimer:
      "Ориентиры стоимости на странице не являются публичной офертой. Итоговая цена зависит от объекта, ТЗ и состава работ.",
  };
}

function buildProcess(service: LegacyLike): ProcessRoadmapStep[] {
  const fallbackArtifacts = [
    "Акт обследования",
    "КП и договор",
    "График работ",
    "Акт ПНР / тесты",
    "Журнал ТО / рекомендации",
  ];
  return service.includedSteps.map(
    (step, index): ProcessRoadmapStep => ({
      id: `${service.id}-step-${index + 1}`,
      title: step.title,
      clientAction:
        index === 0
          ? "Согласует время доступа на объект и контактное лицо"
          : "Подтверждает решения, доступ и окна работ",
      oneDimAction: step.description,
      artifact: fallbackArtifacts[index] ?? "Акт/отчет по этапу",
      durationText:
        index === 0
          ? "1-2 дня"
          : index === service.includedSteps.length - 1
            ? "1-3 дня"
            : "по графику",
    }),
  );
}

function buildFaq(service: LegacyLike): SeoFaqItem[] {
  const specializedFaq: Record<string, SeoFaqItem[]> = {
    skud: [
      {
        id: "skud-faq-1",
        question: "Что лучше: карта или Face ID?",
        answer:
          "Оба варианта используются и часто комбинируются. Карты дешевле и проще в замене, Face ID обеспечивает более высокий уровень безопасности (нельзя передать) и удобство (нельзя забыть). Оптимально — карта + биометрия.",
        schemaInclude: true,
        intentTag: "tech",
      },
      {
        id: "skud-faq-2",
        question: "Интегрируется ли СКУД с 1С?",
        answer:
          "Да, система интегрируется с 1С:ЗУП для автоматического учета рабочего времени и формирования табелей без ручного ввода.",
        schemaInclude: true,
        intentTag: "integration",
      },
      {
        id: "skud-faq-3",
        question: "Сколько стоит установка турникета?",
        answer:
          "Стоимость зависит от типа (трипод, ротор) и пропускной способности. Базовые решения с монтажом начинаются от 70 000 руб.",
        schemaInclude: true,
        intentTag: "price",
      },
      {
        id: "skud-faq-4",
        question: "Есть ли беспроводные решения?",
        answer:
          "Да, существуют радиоканальные считыватели и замки, удобные для объектов, где нежелательна прокладка кабеля.",
        schemaInclude: true,
        intentTag: "tech",
      },
      {
        id: "skud-faq-5",
        question: "Как работает учет рабочего времени?",
        answer:
          "Система фиксирует время первого и последнего прикладывания карты, позволяя строить отчеты по опозданиям и дисциплине.",
        schemaInclude: true,
        intentTag: "features",
      },
      {
        id: "skud-faq-6",
        question: "Что будет при отключении электричества?",
        answer:
          "Предусматриваются блоки бесперебойного питания (ИБП), обеспечивающие работу системы от 4 до 24 часов самостоятельно.",
        schemaInclude: true,
        intentTag: "safety",
      },
      {
        id: "skud-faq-7",
        question: "Как быстро добавить нового сотрудника?",
        answer:
          "Администратор через ПО или мобильное приложение может мгновенно внести данные и выдать виртуальный или физ. пропуск.",
        schemaInclude: true,
        intentTag: "ops",
      },
      {
        id: "skud-faq-8",
        question: "Нужен ли выделенный сервер?",
        answer:
          "Для небольших офисов достаточно контроллера с памятью. Для крупных сетей и аналитики мы разворачиваем сервер СКУД.",
        schemaInclude: true,
        intentTag: "it",
      },
      {
        id: "skud-faq-9",
        question: "Соответствует ли система нормам Антитеррор?",
        answer:
          "Да, наши решения соответствуют требованиям постановлений по защите мест массового пребывания людей.",
        schemaInclude: true,
        intentTag: "legal",
      },
      {
        id: "skud-faq-10",
        question: "Как разблокируются двери при пожаре?",
        answer:
          "СКУД обязательно подключается к пожарной сигнализации для автоматического разблокирования всех эвакуационных путей.",
        schemaInclude: true,
        intentTag: "safety",
      },
      {
        id: "skud-faq-11",
        question: "Можно ли управлять доступом удаленно?",
        answer:
          "Да, можно открывать двери или блокировать доступ через защищенный веб-интерфейс или приложение на смартфоне.",
        schemaInclude: true,
        intentTag: "ops",
      },
      {
        id: "skud-faq-12",
        question: "Сколько хранится архив проходов?",
        answer:
          "Срок настраивается индивидуально. Обычно от 30 до 90 дней, в зависимости от требований безопасности и объема диска.",
        schemaInclude: true,
        intentTag: "it",
      },
    ],
    eo: [
      {
        id: "eo-faq-1",
        question: "Какое освещение в офисе считается оптимальным?",
        answer:
          "Рекомендуется уровень 500 люкс на рабочих местах с нейтральной цветовой температурой (4000K) для снижения утомляемости.",
        schemaInclude: true,
        intentTag: "standards",
      },
      {
        id: "eo-faq-2",
        question: "Что дает протокол DALI?",
        answer:
          "Это цифровой протокол управления, позволяющий диммировать, группировать и настраивать сценарии света программно без переделки проводки.",
        schemaInclude: true,
        intentTag: "tech",
      },
      {
        id: "eo-faq-3",
        question: "Какая реальная экономия при переходе на LED?",
        answer:
          "Светодиоды снижают потребление энергии в 3-5 раз по сравнению с люминесцентными лампами при той же освещенности.",
        schemaInclude: true,
        intentTag: "efficiency",
      },
      {
        id: "eo-faq-4",
        question: "Как проверяется соответствие нормам?",
        answer:
          "Мы проводим замеры люксметром и работаем строго по СанПиН и СП 52.13330 (Естественное и искусственное освещение).",
        schemaInclude: true,
        intentTag: "legal",
      },
      {
        id: "eo-faq-5",
        question: "Нужно ли ставить аварийное освещение?",
        answer:
          "Да, это обязательное требование для путей эвакуации. Мы ставим светильники с встроенными АКБ на 1-3 часа работы.",
        schemaInclude: true,
        intentTag: "safety",
      },
      {
        id: "eo-faq-6",
        question: "Как выбрать цветовую температуру?",
        answer:
          "3000K — теплый (отдых/уют), 4000K — нейтральный (офис/работа), 5000K+ — холодный (склады/производство).",
        schemaInclude: true,
        intentTag: "design",
      },
      {
        id: "eo-faq-7",
        question: "Какой срок службы у светодиодных панелей?",
        answer:
          "Качественные модули рассчитаны на 50 000+ часов работы, что составляет около 10-15 лет в режиме офисного дня.",
        schemaInclude: true,
        intentTag: "efficiency",
      },
      {
        id: "eo-faq-8",
        question: "Можно ли интегрировать свет в Умный дом/здание?",
        answer:
          "Да, через протоколы KNX или Modbus освещение связывается с климатом и безопасностью в единую систему.",
        schemaInclude: true,
        intentTag: "integration",
      },
      {
        id: "eo-faq-9",
        question: "Управление светом со смартфона доступно?",
        answer:
          "Да, через Bluetooth (Casambi) или Wi-Fi шлюзы можно управлять яркостью и цветом с любого мобильного устройства.",
        schemaInclude: true,
        intentTag: "ops",
      },
      {
        id: "eo-faq-10",
        question: "Нужны ли датчики движения в офисе?",
        answer:
          "Они идеальны для коридоров, лестниц и санузлов, позволяя экономить до 30% электроэнергии за счет автовыключения.",
        schemaInclude: true,
        intentTag: "efficiency",
      },
      {
        id: "eo-faq-11",
        question: "Как рассчитать количество светильников?",
        answer:
          "Мы делаем расчет в DIALux, учитывая высоту потолков, цвет стен и расстановку мебели для равномерного покрытия.",
        schemaInclude: true,
        intentTag: "design",
      },
      {
        id: "eo-faq-12",
        question: "Сколько времени занимает монтаж освещения?",
        answer:
          "Проектирование — 2-3 дня, монтаж зависит от объема. Обычно стандартный офис 200 м² зашивается за 4-5 дней.",
        schemaInclude: true,
        intentTag: "timeline",
      },
    ],
  };

  if (specializedFaq[service.id]) {
    return specializedFaq[service.id];
  }

  return [
    {
      id: `${service.id}-faq-1`,
      question: `Сколько стоит ${service.shortName}?`,
      answer:
        "На странице показаны ориентиры. Точная стоимость рассчитывается после аудита объекта или по вашему ТЗ.",
      schemaInclude: true,
      intentTag: "price",
    },
    {
      id: `${service.id}-faq-2`,
      question: "Можно ли начать с аудита без монтажа?",
      answer:
        "Да. Аудит выполняется как отдельный этап: обследование, риски, рекомендации, ориентир бюджета и этапность.",
      schemaInclude: true,
      intentTag: "audit",
    },
    {
      id: `${service.id}-faq-3`,
      question: "Работаете ли вы с действующими объектами?",
      answer:
        "Да, планируем работы поэтапно и согласовываем окна, чтобы снизить простой и влияние на эксплуатацию.",
      schemaInclude: true,
      intentTag: "operations",
    },
    {
      id: `${service.id}-faq-4`,
      question: "Что влияет на срок выполнения?",
      answer:
        "Площадь, количество зон/точек, готовность документации, режим доступа на объект и наличие оборудования.",
      schemaInclude: true,
      intentTag: "timeline",
    },
    {
      id: `${service.id}-faq-5`,
      question: "Можно ли интегрировать со смежными системами?",
      answer:
        "Да, при аудите фиксируем зависимости и закладываем интеграцию с подходящими подсистемами в проектный план.",
      schemaInclude: true,
      intentTag: "integration",
    },
    {
      id: `${service.id}-faq-6`,
      question: "Какие документы получает заказчик?",
      answer:
        "В зависимости от этапа: акт обследования, КП, договор, исполнительные документы, акты пусконаладки и рекомендации по ТО.",
      schemaInclude: true,
      intentTag: "docs",
    },
    {
      id: `${service.id}-faq-7`,
      question: "Работаете ли вы по Москве и области?",
      answer:
        "Да, базовая география выездов: Москва и Московская область. Для других регионов формат согласуем отдельно.",
      schemaInclude: true,
      intentTag: "geo",
    },
    {
      id: `${service.id}-faq-8`,
      question: "Можно ли добавить несколько услуг в один проект?",
      answer:
        "Да, используйте кнопку “Добавить в проект” в карточках и каталоге. Страница собирает состав работ в локальный проект-трей.",
      schemaInclude: true,
      intentTag: "project",
    },
  ];
}

function buildBenchmarks(service: LegacyLike): BenchmarkPriceRange[] {
  const min = Math.max(5000, Math.round(service.basePricePerSqm * 15));
  const max = Math.max(min + 10000, Math.round(service.basePricePerSqm * 120));
  return [
    {
      id: `${service.id}-bm-1`,
      label: `Рыночный ориентир работ по ${service.shortName}`,
      unit: "проект",
      priceMin: min,
      priceMax: max,
      currency: "RUB",
      sourceLabel: "Внутренний benchmark / подготовка контента",
      sourceUrl: "https://example.invalid/internal-benchmark",
      checkedAt: "2026-02-24",
    },
    {
      id: `${service.id}-bm-2`,
      label: "Выездной аудит",
      unit: "выезд",
      priceMin: Math.max(10000, Math.round(service.basePricePerSqm * 20)),
      priceMax: Math.max(20000, Math.round(service.basePricePerSqm * 45)),
      currency: "RUB",
      sourceLabel: "Внутренний benchmark / подготовка контента",
      sourceUrl: "https://example.invalid/internal-benchmark",
      checkedAt: "2026-02-24",
    },
  ];
}

function buildSeoBlock(service: LegacyLike): ServicePageSeoBlock {
  return {
    title: `${service.shortName}: аудит, проектирование, монтаж и обслуживание`,
    paragraphs: [
      `${capitalize(service.shortName)} для коммерческих и промышленных объектов требует точной привязки к фактической планировке, режиму эксплуатации и смежным системам. Поэтому базовый сценарий на странице начинается с аудита объекта и фиксации ограничений.`,
      "На странице указаны ориентиры цен и типовые наборы работ для предварительной оценки. Точный бюджет и сроки подтверждаются после аудита объекта или получения ТЗ, так как на итоговую стоимость влияют объем работ, доступ, бренд оборудования и сроки поставки.",
      "OneDim выполняет работы поэтапно: обследование, подготовка КП/договора, реализация, пусконаладка и при необходимости техническое обслуживание. Для смежных задач можно собрать единый проект из нескольких услуг.",
    ],
    relatedServiceSlugs: relatedServiceMap[service.id] ?? [],
    serviceArea: "Москва и Московская область",
    responseTime: "Ответ инженера в рабочее время в день обращения",
    priceDisclaimer:
      "Все цены на странице являются ориентировочными и не являются публичной офертой. Точная стоимость определяется после аудита/ТЗ.",
  };
}

function buildAiRules(service: LegacyLike): AiAssistRule[] {
  const related = relatedServiceMap[service.id] ?? [];
  return [
    {
      id: `${service.id}-rule-open`,
      triggerType: "tray_empty",
      messageText:
        "Начните с аудита объекта: это сократит риски по срокам и стоимости на следующих этапах.",
      priority: 100,
    },
    {
      id: `${service.id}-rule-stage`,
      triggerType: "missing_category",
      triggerValue: "Этапы проекта",
      messageText:
        "В проекте нет базового этапа работ (аудит/проект/монтаж). Добавьте этап для корректного ориентирного расчета.",
      priority: 90,
    },
    ...related.slice(0, 2).map((slug, index) => ({
      id: `${service.id}-rule-related-${slug}`,
      triggerType: "service_open" as const,
      triggerValue: slug,
      recommendServiceSlug: slug,
      messageText: `Проверьте связанную услугу: ${slug.toUpperCase()}. Она часто влияет на объем, сроки или сдачу проекта.`,
      priority: 70 - index,
    })),
  ];
}

function mergeTheme(slug: string, seed?: ServicePageSeed): ServiceThemeTokens {
  return {
    ...slugThemeDefaults[slug],
    ...(seed?.theme ?? {}),
  };
}

function buildBaseModel(service: LegacyLike): ServicePageModel {
  return {
    slug: service.id,
    title: service.title,
    shortName: service.shortName,
    description: service.description,
    theme: slugThemeDefaults[service.id] ?? slugThemeDefaults.aps,
    hero: buildHero(service),
    stats: buildStats(service),
    solutionKits: buildSolutionKits(service),
    catalog: buildCatalogSections(service),
    process: buildProcess(service),
    aiRules: buildAiRules(service),
    seo: buildSeoBlock(service),
    faq: buildFaq(service),
    benchmarks: buildBenchmarks(service),
    relatedServiceSlugs: relatedServiceMap[service.id] ?? [],
  };
}

function getLegacyLike(slug: string): LegacyLike | null {
  if (SERVICES_DB[slug]) return SERVICES_DB[slug];
  if (stubServices[slug]) return stubServices[slug];
  return null;
}

function applySeedOverrides(model: ServicePageModel, seed?: ServicePageSeed): ServicePageModel {
  if (!seed) return model;
  return {
    ...model,
    title: seed.title ?? model.title,
    shortName: seed.shortName ?? model.shortName,
    description: seed.description ?? model.description,
    theme: mergeTheme(model.slug, seed),
    hero: {
      ...model.hero,
      ...(seed.hero ?? {}),
      title: seed.title ?? model.hero.title,
      subtitle: seed.description
        ? `${seed.description} ${model.hero.subtitle}`
        : model.hero.subtitle,
    },
  };
}

export function getServicePageModel(slug: string): ServicePageModel | null {
  const legacyLike = getLegacyLike(slug);
  if (!legacyLike) return null;
  const base = buildBaseModel(legacyLike);
  const merged = mergeGeneratedIntoBase(base, generatedRowMap.get(slug));
  return applySeedOverrides(merged, seedMap.get(slug as GeneratedServiceSlug));
}

export function getServicePageSlugs(): string[] {
  const generatedSlugs = generatedServiceRows
    .map((row) => (typeof row.slug === "string" ? row.slug : null))
    .filter((slug): slug is string => Boolean(slug));

  return Array.from(new Set([...generatedSlugs, ...GENERATED_SERVICE_SLUGS]));
}

export function getAllServicePageModels(): ServicePageModel[] {
  return getServicePageSlugs()
    .map((slug) => getServicePageModel(slug))
    .filter((model): model is ServicePageModel => Boolean(model));
}
