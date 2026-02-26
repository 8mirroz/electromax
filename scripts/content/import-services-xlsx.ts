import * as xlsx from 'xlsx';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// --- Zod Schemas for Validation ---

const stringToArray = (val: unknown) => {
    if (typeof val === 'string') {
        return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
};

const emptyToUndefined = (val: unknown) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return val;
};

const booleanCoerce = z.preprocess((val) => {
    if (typeof val === 'string') {
        return val.toLowerCase() === 'true' || val === '1' || val.toLowerCase() === 'yes';
    }
    return Boolean(val);
}, z.boolean());

const toNumber = (val: unknown) => {
    if (val === '' || val === null || val === undefined) return undefined;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        const normalized = val.replace(/\s+/g, '').replace(',', '.');
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : val;
    }
    return val;
};

export const ServiceHeroSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    trustFactors: z.preprocess(stringToArray, z.array(z.string())),
    disclaimer: z.string().optional(),
});

export const ServiceStatCardSchema = z.object({
    label: z.string().min(1),
    value: z.string().min(1),
    subValue: z.string().optional(),
    isMarketing: booleanCoerce.optional(),
});

export const CatalogItemSchema = z.object({
    itemCode: z.string().min(1),
    itemName: z.string().min(1),
    category: z.string().min(1),
    unit: z.string().min(1),
    priceType: z.enum(['from', 'range', 'fixed', 'request']),
    priceMin: z.preprocess(toNumber, z.number().nonnegative()),
    priceMax: z.preprocess(toNumber, z.number().nonnegative().optional()),
    currency: z.string().default('RUB'),
    vatMode: z.string().optional(),
    leadTimeMinDays: z.preprocess(toNumber, z.number().int().nonnegative().optional()),
    leadTimeMaxDays: z.preprocess(toNumber, z.number().int().nonnegative().optional()),
    objectTypes: z.preprocess(stringToArray, z.array(z.string())).optional(),
    descriptionShort: z.string().optional(),
    includes: z.preprocess(stringToArray, z.array(z.string())).optional(),
    excludes: z.preprocess(stringToArray, z.array(z.string())).optional(),
    expandableDetails: z.string().optional(),
    addToProjectDefaultQty: z.preprocess(toNumber, z.number().int().nonnegative().default(1)),
    benchmarkSourceIds: z.preprocess(stringToArray, z.array(z.string())).optional(),
});

export const SolutionKitSchema = z.object({
    kitId: z.string().min(1),
    kitName: z.string().min(1),
    useCase: z.string().min(1),
    targetObject: z.string().min(1),
    includedItemCodes: z.preprocess(stringToArray, z.array(z.string())),
    budgetMin: z.preprocess(toNumber, z.number().nonnegative()),
    budgetMax: z.preprocess(toNumber, z.number().nonnegative()),
    durationText: z.string().min(1),
    ctaLabel: z.string().min(1),
}).refine((data) => {
    if (typeof data.budgetMin === 'number' && typeof data.budgetMax === 'number') {
        return data.budgetMin <= data.budgetMax;
    }
    return true;
}, {
    message: 'budgetMin must be less than or equal to budgetMax',
    path: ['budgetMin', 'budgetMax'],
});

export const ProcessStepSchema = z.object({
    stepId: z.string().min(1),
    title: z.string().min(1),
    clientAction: z.string().min(1),
    contractorAction: z.string().min(1),
    artifact: z.string().min(1),
    leadTime: z.string().min(1),
});

export const AiAssistRuleSchema = z.object({
    ruleId: z.string().min(1),
    triggerType: z.string().min(1),
    triggerValue: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    recommendItemCode: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    messageText: z.string().min(1),
    priority: z.preprocess(toNumber, z.number().int().nonnegative()),
    conditionJson: z.string().optional(),
});

export const SeoFaqItemSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    schemaInclude: booleanCoerce.default(true),
    intentTag: z.string().optional(),
});

export const ServicePageSeoBlockSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    textBlock: z.string().min(1).optional(),
});

export const ServicePageBaseSchema = z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    title: z.string().min(1),
    shortName: z.string().min(1),
    themeColor: z.string().min(1),
    isActive: booleanCoerce.default(true),
    sortOrder: z.preprocess(toNumber, z.number().int().default(0)),
});

// --- Importer Logic ---

interface CliOptions {
    input?: string;
    output?: string;
    dryRun: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = { dryRun: false };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--input' && args[i + 1]) {
            options.input = args[++i];
        } else if (args[i] === '--output' && args[i + 1]) {
            options.output = args[++i];
        } else if (args[i] === '--dry-run') {
            options.dryRun = true;
        }
    }

    return options;
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    const filePath = path.resolve(process.cwd(), options.input || path.join('scripts', 'content', 'services-master.xlsx'));
    const outputDir = path.resolve(process.cwd(), options.output || path.join('src', 'generated'));

    if (!fs.existsSync(filePath)) {
        console.warn(`[ContentOps] Master XLSX file not found at ${filePath}. Creating a strict basic template for Agent 1...`);
        createTemplateXlsx(filePath);
        return;
    }

    console.log('[ContentOps] Reading XLSX master workbook...');
    const workbook = xlsx.readFile(filePath);

    const getSheetData = (sheetName: string): Array<Record<string, unknown>> => {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) return [];
        return xlsx.utils.sheet_to_json(sheet, { defval: '' });
    };

    // Load raw data
    const rawServices = getSheetData('services');
    const rawHeroes = getSheetData('hero');
    const rawStats = getSheetData('stats_cards');
    const rawCatalog = getSheetData('catalog_items');
    const rawKits = getSheetData('solution_kits');
    const rawProcess = getSheetData('process_steps');
    const rawAiRules = getSheetData('ai_rules');
    const rawSeo = getSheetData('seo_blocks');
    const rawFaq = getSheetData('faq');

    console.log(`[ContentOps] Found ${rawServices.length} base services. Validation started...`);

    const generatedPages: Array<Record<string, unknown>> = [];
    const errors: string[] = [];

    for (const rawService of rawServices) {
        try {
            const baseInfo = ServicePageBaseSchema.parse(rawService);
            if (!baseInfo.isActive) continue;

            const slug = baseInfo.slug;

            const heroData = rawHeroes.find(
                (r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug,
            );
            if (!heroData) throw new Error(`Missing hero sheet data for slug: ${slug}`);
            const hero = ServiceHeroSchema.parse(heroData);

            const stats = rawStats
                .filter((r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug)
                .map((s) => ServiceStatCardSchema.parse(s));
            const catalogItems = rawCatalog
                .filter((r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug)
                .map((s) => CatalogItemSchema.parse(s));
            const solutionKits = rawKits
                .filter((r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug)
                .map((s) => SolutionKitSchema.parse(s));
            const processSteps = rawProcess
                .filter((r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug)
                .map((s) => ProcessStepSchema.parse(s));
            const aiRules = rawAiRules
                .filter((r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug)
                .map((s) => AiAssistRuleSchema.parse(s));

            const seoData = rawSeo.find(
                (r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug,
            );
            const seoBase = seoData ? ServicePageSeoBlockSchema.parse(seoData) : {};
            const faq = rawFaq
                .filter((r): r is Record<string, unknown> => (r as Record<string, unknown>).service_slug === slug)
                .map((s) => SeoFaqItemSchema.parse(s));

            const seoBlock = { ...seoBase, faq };

            // Business Logic validations
            catalogItems.forEach(item => {
                if (item.priceMax && item.priceMin > item.priceMax) {
                    throw new Error(`[${slug}] CatalogItem ${item.itemCode} has min_price > max_price`);
                }
            });

            const pageModel = {
                ...baseInfo,
                updatedAt: new Date().toISOString(),
                hero,
                stats,
                solutionKits,
                catalogItems,
                processSteps,
                aiRules,
                seoBlock
            };

            generatedPages.push(pageModel);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            const slugValue = typeof rawService?.slug === 'string' ? rawService.slug : 'UNKNOWN';
            errors.push(`Error processing service slug [${slugValue}]: ${message}`);
        }
    }

    if (errors.length > 0) {
        console.error(`\n[ContentOps] Import Failed with ${errors.length} errors!`);
        errors.forEach(err => console.error(' ❌ ' + err));
        process.exit(1);
    }

    // Generate artifacts
    if (options.dryRun) {
        console.log('[ContentOps] Dry-run enabled. Skipping file writes.');
        return;
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const jsonDest = path.join(outputDir, 'services-content.json');
    const payload = {
        schemaVersion: '1.0',
        generatedAt: new Date().toISOString(),
        services: generatedPages,
    };
    fs.writeFileSync(jsonDest, JSON.stringify(payload, null, 2));

    const contentMeta = {
        schemaVersion: '1.0',
        generatedAt: payload.generatedAt,
        totalServices: generatedPages.length,
        services: generatedPages.map((service) => ({
            slug: service.slug,
            title: service.title,
            shortName: service.shortName,
        })),
    };
    fs.writeFileSync(path.join(outputDir, 'content-meta.json'), JSON.stringify(contentMeta, null, 2));

    // Generate TS Index
    const slugList = generatedPages.map((service) => `  ${JSON.stringify(service.slug)},`).join('\n');
    const titleMap = generatedPages.map((service) => `  ${JSON.stringify(service.slug)}: ${JSON.stringify(service.title)},`).join('\n');
    const shortNameMap = generatedPages.map((service) => `  ${JSON.stringify(service.slug)}: ${JSON.stringify(service.shortName)},`).join('\n');

    const tsContent = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated at: ${payload.generatedAt}

export const SERVICE_SLUGS = [
${slugList}
] as const;

// Alias for backward compatibility
export const GENERATED_SERVICE_SLUGS = SERVICE_SLUGS;

export type ServiceSlug = typeof SERVICE_SLUGS[number];
export type GeneratedServiceSlug = ServiceSlug;

export const SERVICE_TITLES: Record<ServiceSlug, string> = {
${titleMap}
};

export const SERVICE_SHORT_NAMES: Record<ServiceSlug, string> = {
${shortNameMap}
};

export function getServiceBySlug(slug: string): ServiceSlug | undefined {
  return SERVICE_SLUGS.find(s => s === slug);
}

export function isValidServiceSlug(slug: string): slug is ServiceSlug {
  return SERVICE_SLUGS.includes(slug as ServiceSlug);
}
`;
    fs.writeFileSync(path.join(outputDir, 'services-index.ts'), tsContent);

    console.log(`[ContentOps] Success! Generated ${generatedPages.length} services to ${jsonDest}`);
}

function createTemplateXlsx(filePath: string) {
    const wb = xlsx.utils.book_new();

    const addSheet = (name: string, headers: string[]) => {
        const ws = xlsx.utils.aoa_to_sheet([headers]);
        xlsx.utils.book_append_sheet(wb, ws, name);
    };

    addSheet('services', ['id', 'slug', 'title', 'shortName', 'themeColor', 'isActive', 'sortOrder']);
    addSheet('hero', ['service_slug', 'title', 'subtitle', 'trustFactors', 'disclaimer']);
    addSheet('stats_cards', ['service_slug', 'label', 'value', 'subValue', 'isMarketing']);
    addSheet('catalog_items', ['service_slug', 'itemCode', 'itemName', 'category', 'unit', 'priceType', 'priceMin', 'priceMax', 'currency', 'leadTimeMinDays', 'leadTimeMaxDays', 'includes', 'excludes']);
    addSheet('solution_kits', ['service_slug', 'kitId', 'kitName', 'useCase', 'targetObject', 'includedItemCodes', 'budgetMin', 'budgetMax', 'durationText', 'ctaLabel']);
    addSheet('process_steps', ['service_slug', 'stepId', 'title', 'clientAction', 'contractorAction', 'artifact', 'leadTime']);
    addSheet('ai_rules', ['service_slug', 'ruleId', 'triggerType', 'triggerValue', 'recommendItemCode', 'messageText', 'priority']);
    addSheet('seo_blocks', ['service_slug', 'title', 'description', 'textBlock']);
    addSheet('faq', ['service_slug', 'question', 'answer', 'schemaInclude', 'intentTag']);

    xlsx.writeFile(wb, filePath);
    console.log(`[ContentOps] Basic template created at ${filePath}. Fill it with data.`);
}

main().catch(console.error);
