export interface BenchmarkPriceRange {
  min: number;
  max: number;
  currency: string;
  sourceNote?: string;
}

export interface CatalogItemOption {
  optionCode: string;
  optionName: string;
  priceDelta: number;
}

export interface CatalogItem {
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  priceType: "from" | "range" | "fixed" | "request";
  priceMin: number;
  priceMax?: number;
  currency: string;
  vatMode?: string;
  leadTimeMinDays?: number;
  leadTimeMaxDays?: number;
  objectTypes?: string[];
  descriptionShort?: string;
  includes?: string[];
  excludes?: string[];
  expandableDetails?: string;
  addToProjectDefaultQty: number;
  benchmarkSourceIds?: string[];
  options?: CatalogItemOption[];
}

export interface SolutionKit {
  kitId: string;
  kitName: string;
  useCase: string;
  targetObject: string;
  includedItemCodes: string[];
  budgetMin: number;
  budgetMax: number;
  durationText: string;
  ctaLabel: string;
}

export interface ServiceHeroModel {
  title: string;
  subtitle: string;
  trustFactors: string[];
  disclaimer?: string;
}

export interface ServiceStatCard {
  label: string;
  value: string;
  subValue?: string;
  isMarketing?: boolean;
}

export interface ProcessStep {
  stepId: string;
  title: string;
  clientAction: string;
  contractorAction: string;
  artifact: string;
  leadTime: string;
}

export interface AiAssistRule {
  ruleId: string;
  triggerType: string;
  triggerValue: string;
  recommendItemCode: string;
  messageText: string;
  priority: number;
  conditionJson?: string;
}

export interface SeoFaqItem {
  question: string;
  answer: string;
  schemaInclude: boolean;
  intentTag?: string;
}

export interface ServicePageSeoBlock {
  title: string;
  description: string;
  textBlock: string;
  faq: SeoFaqItem[];
}

export interface ServicePageModel {
  id: string; // Internal ID
  slug: string;
  title: string; // Full title
  shortName: string; // For badges
  themeColor: string; // Accent color hex
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;

  hero: ServiceHeroModel;
  stats: ServiceStatCard[];
  solutionKits: SolutionKit[];
  catalogItems: CatalogItem[];
  processSteps: ProcessStep[];
  aiRules: AiAssistRule[];
  seoBlock: ServicePageSeoBlock;
}
