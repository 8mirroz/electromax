export interface PricingPackage {
  title: string;
  monthlyPrice?: number;
  oneTimePrice?: number;
  features: string[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ProblemCase {
  title: string;
  description: string;
}

export interface ServiceContent {
  hero: {
    subtitle: string;
    features: string[];
  };
  problems: ProblemCase[];
}

export interface QuickStartCard {
  id: string;
  title: string;
  description: string;
  icon?: string;
  difficulty: "easy" | "medium" | "complex";
  duration: string;
  budgetFrom?: number;
  benefits: string[];
  ctaLabel: string;
  featured?: boolean;
}

export interface ServiceConfig {
  id: string; // slug
  title: string;
  shortName: string;
  description: string;
  basePricePerSqm: number;
  complexity: Record<string, number>;
  content: ServiceContent;
  packages: PricingPackage[];
  includedSteps: ProcessStep[];
  equipment: string[];
  quickStartCards?: QuickStartCard[];
}

export type PriceType = "from" | "range" | "fixed" | "request";

export interface ServiceThemeTokens {
  accent: string;
  accentSoft: string;
  accentStrong: string;
}

export interface ServiceHeroModel {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHint?: string;
  trustItems?: string[];
  trustFactors?: string[]; // Alias for trustItems in some data sources
  priceDisclaimer?: string;
  disclaimer?: string;      // Alias for priceDisclaimer in some data sources
}

export interface ServiceStatCard {
  id: string;
  label: string;
  value: string;
  description: string;
  verified?: boolean;
}

export interface SolutionKit {
  id: string;
  name: string;
  useCase: string;
  targetObject: string;
  bullets: string[];
  includedItemCodes: string[];
  budgetMin?: number;
  budgetMax?: number;
  currency?: "RUB";
  durationText: string;
  ctaLabel: string;
}

export interface CatalogItem {
  id: string;
  itemCode: string;
  category: string;
  name: string;
  unit: string;
  priceType: PriceType;
  priceMin?: number;
  priceMax?: number;
  currency?: "RUB";
  comment?: string;
  objectTypes?: string[];
  leadTimeText?: string;
  includes?: string[];
  excludes?: string[];
  priceDependsOn?: string[];
  relatedServiceSlugs?: string[];
  addToProjectDefaultQty?: number;
}

export interface ServiceCatalogSection {
  id: string;
  title: string;
  description?: string;
  items: CatalogItem[];
}

export interface ProcessRoadmapStep {
  id: string;
  title: string;
  clientAction: string;
  electromaxAction: string;
  artifact: string;
  durationText: string;
}

export interface AiAssistRule {
  id: string;
  triggerType:
    | "service_open"
    | "tray_empty"
    | "has_item"
    | "missing_category"
    | "selected_kit";
  triggerValue?: string;
  recommendItemCode?: string;
  recommendServiceSlug?: string;
  messageText: string;
  priority: number;
  conditionJson?: string;
}

export interface AiAssistantRecommendation {
  id: string;
  type: "add_service" | "check_dependency" | "normative" | "next_step";
  message: string;
  actionLabel?: string;
  recommendItemCode?: string;
  recommendServiceSlug?: string;
  priority: number;
}

export interface SeoFaqItem {
  id: string;
  question: string;
  answer: string;
  schemaInclude: boolean;
  intentTag?: string;
}

export interface BenchmarkPriceRange {
  id: string;
  label: string;
  unit: string;
  priceMin?: number;
  priceMax?: number;
  currency: "RUB";
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
}

export interface ServicePageSeoBlock {
  title: string;
  paragraphs: string[];
  relatedServiceSlugs: string[];
  serviceArea?: string;
  responseTime?: string;
  priceDisclaimer?: string;
}

export interface ServicePageModel {
  slug: string;
  title: string;
  shortName: string;
  description: string;
  theme: ServiceThemeTokens;
  hero: ServiceHeroModel;
  stats: ServiceStatCard[];
  solutionKits: SolutionKit[];
  catalog: ServiceCatalogSection[];
  process: ProcessRoadmapStep[];
  aiRules: AiAssistRule[];
  seo: ServicePageSeoBlock;
  faq: SeoFaqItem[];
  benchmarks: BenchmarkPriceRange[];
  relatedServiceSlugs: string[];
}

export interface ProjectTrayRange {
  min: number;
  max: number;
  currency: "RUB";
}

export interface ProjectTrayItem {
  id: string;
  serviceSlug: string;
  itemCode: string;
  itemName: string;
  unit: string;
  qty: number;
  priceType: PriceType;
  priceMin?: number;
  priceMax?: number;
  currency?: "RUB";
  category?: string;
  sourceKind: "catalog" | "kit";
  sourceId: string;
  sourceLabel?: string;
  params?: Record<string, string | number>;
  comment?: string;
}

export interface ProjectTrayState {
  serviceSlug: string | null;
  items: ProjectTrayItem[];
  selectedKitIds: string[];
  notes: string;
  estimatedRange: ProjectTrayRange | null;
  updatedAt: string | null;
}
