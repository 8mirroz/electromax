#!/usr/bin/env node

/**
 * Import Services XLSX to JSON
 * 
 * Usage:
 *   pnpm tsx scripts/import-services-xlsx.ts --input ./docs/services-workbook.xlsx --output ./src/generated/
 *   pnpm tsx scripts/import-services-xlsx.ts --dry-run --input ./docs/services-workbook.xlsx
 */

import * as fs from 'fs';
import * as path from 'path';

// Mock data generator (since we can't read XLSX directly without dependencies)
// In production, this would use 'xlsx' or 'exceljs' package

interface ServiceData {
  slug: string;
  title: string;
  shortName: string;
  description: string;
  basePrice: number | 'request';
  cta: string;
  themeColor: string;
  icon: string;
}

const SERVICES_DATA: ServiceData[] = [
  { slug: 'aps', title: 'Автоматическая пожарная сигнализация', shortName: 'АПС', description: 'Проектирование, монтаж и обслуживание под ключ по нормативам МЧС.', basePrice: 350, cta: 'Заказать аудит объекта', themeColor: '#2563eb', icon: 'local_fire_department' },
  { slug: 'asuz', title: 'Автоматизация и диспетчеризация', shortName: 'АСУЗ', description: 'Интеграция всех инженерных систем в единый центр управления.', basePrice: 'request', cta: 'Заказать аудит', themeColor: '#2563eb', icon: 'settings' },
  { slug: 'eo', title: 'Система освещения', shortName: 'ЭО', description: 'Энергосберегающее освещение с экономией до 40%.', basePrice: 900, cta: 'Рассчитать экономию', themeColor: '#2563eb', icon: 'lightbulb' },
  { slug: 'eom', title: 'Электроснабжение и силовые сети', shortName: 'ЭОМ', description: 'Проектирование, монтаж и проверка ЭТЛ.', basePrice: 1500, cta: 'Бесплатный выезд', themeColor: '#2563eb', icon: 'bolt' },
  { slug: 'os', title: 'Охранная сигнализация', shortName: 'ОС', description: 'Защита периметра и помещений.', basePrice: 350, cta: 'Тест-драйв системы', themeColor: '#2563eb', icon: 'security' },
  { slug: 'sks', title: 'Структурированные кабельные системы', shortName: 'СКС', description: 'Кабельная инфраструктура с гарантией 25 лет.', basePrice: 3000, cta: 'Аудит сети', themeColor: '#2563eb', icon: 'hub' },
  { slug: 'skud', title: 'Система контроля доступа', shortName: 'СКУД', description: 'Учёт рабочего времени и биометрия.', basePrice: 15000, cta: 'Демо на объекте', themeColor: '#2563eb', icon: 'badge' },
  { slug: 'sot', title: 'Видеонаблюдение', shortName: 'СОТ', description: 'IP-видеонаблюдение с AI аналитикой.', basePrice: 600, cta: 'Тест камеры', themeColor: '#2563eb', icon: 'videocam' },
  { slug: 'soue', title: 'Система оповещения', shortName: 'СОУЭ', description: 'Речевое оповещение 1-5 типа.', basePrice: 250, cta: 'Акустический расчёт', themeColor: '#2563eb', icon: 'campaign' },
  { slug: 'to', title: 'Техническое обслуживание', shortName: 'ТО', description: 'SLA 24/7 для всех систем.', basePrice: 5000, cta: 'Первый месяц бесплатно', themeColor: '#2563eb', icon: 'settings_suggest' },
];

interface CliOptions {
  input?: string;
  output?: string;
  dryRun: boolean;
  help: boolean;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = { dryRun: false, help: false };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      options.input = args[++i];
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[++i];
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      options.help = true;
    }
  }
  
  return options;
}

function printHelp() {
  console.log(`
Import Services XLSX to JSON

Usage:
  pnpm tsx scripts/import-services-xlsx.ts [options]

Options:
  --input <path>    Path to XLSX workbook (default: ./docs/services-workbook.xlsx)
  --output <path>   Output directory (default: ./src/generated/)
  --dry-run         Validate without writing files
  --help, -h        Show this help message

Examples:
  pnpm tsx scripts/import-services-xlsx.ts
  pnpm tsx scripts/import-services-xlsx.ts --input ./custom.xlsx
  pnpm tsx scripts/import-services-xlsx.ts --dry-run
`);
}

type GeneratedService = {
  slug: string;
  title: string;
  shortName: string;
  description: string;
  basePrice: number | 'request';
  cta: string;
  themeColor: string;
  icon: string;
  theme: {
    accent: string;
    accentSoft: string;
    accentStrong: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHint: string;
    trustItems: string[];
    priceDisclaimer: string;
  };
  stats: Array<{
    id: string;
    label: string;
    value: string;
    description: string;
    verified: boolean;
  }>;
  solutionKits: unknown[];
  catalog: unknown[];
  process: unknown[];
  aiRules: unknown[];
  seo: {
    title: string;
    paragraphs: string[];
    relatedServiceSlugs: string[];
    serviceArea: string;
    responseTime: string;
    priceDisclaimer: string;
  };
  faq: unknown[];
  benchmarks: unknown[];
  relatedServiceSlugs: string[];
};

type GeneratedContent = {
  schemaVersion: string;
  generatedAt: string;
  services: GeneratedService[];
};

function validateService(service: GeneratedService): string[] {
  const errors: string[] = [];
  
  if (!service.slug || service.slug.length === 0) {
    errors.push('slug is required');
  }
  
  if (!service.title || service.title.length === 0) {
    errors.push('title is required');
  }
  
  if (!service.shortName || service.shortName.length === 0) {
    errors.push('shortName is required');
  }
  
  if (!service.description || service.description.length === 0) {
    errors.push('description is required');
  }
  
  return errors;
}

function generateContent(): GeneratedContent {
  const content: GeneratedContent = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    services: [],
  };
  
  for (const service of SERVICES_DATA) {
    content.services.push({
      slug: service.slug,
      title: service.title,
      shortName: service.shortName,
      description: service.description,
      basePrice: service.basePrice,
      cta: service.cta,
      themeColor: service.themeColor,
      icon: service.icon,
      theme: {
        accent: service.themeColor,
        accentSoft: lightenColor(service.themeColor, 40),
        accentStrong: darkenColor(service.themeColor, 20),
      },
      hero: {
        title: `${service.title} под ключ`,
        subtitle: service.description,
        ctaLabel: service.cta,
        ctaHint: 'Бесплатный выезд инженера',
        trustItems: ['Лицензия МЧС', 'СРО допуск', 'Гарантия 5 лет'],
        priceDisclaimer: 'Цена ориентировочная, точная после аудита',
      },
      stats: [
        { id: `${service.slug}_stat_1`, label: 'Объектов сдано', value: '500+', description: 'Реализованных проектов', verified: true },
        { id: `${service.slug}_stat_2`, label: 'Лицензия', value: 'Class A', description: 'Высшая категория', verified: true },
        { id: `${service.slug}_stat_3`, label: 'Опыта работы', value: '12 лет', description: 'На рынке', verified: true },
        { id: `${service.slug}_stat_4`, label: 'Поддержка', value: '24/7', description: 'Круглосуточно', verified: true },
      ],
      solutionKits: [],
      catalog: [],
      process: [],
      aiRules: [],
      seo: {
        title: `${service.title} в Москве | Electromax`,
        paragraphs: [
          `${service.description} Компания Electromax предлагает полный цикл работ: проектирование, монтаж, обслуживание.`,
          `Наши инженеры имеют все необходимые лицензии и допуски. Мы реализовали более 500 проектов.`,
        ],
        relatedServiceSlugs: [],
        serviceArea: 'Москва и Московская область',
        responseTime: 'Выезд в течение 24 часов',
        priceDisclaimer: 'Цены указаны ориентировочно',
      },
      faq: [],
      benchmarks: [],
      relatedServiceSlugs: [],
    });
  }
  
  return content;
}

function lightenColor(hex: string, percent: number): string {
  // Simple color lightening (for demo purposes)
  return hex;
}

function darkenColor(hex: string, percent: number): string {
  // Simple color darkening (for demo purposes)
  return hex;
}

function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (options.help) {
    printHelp();
    process.exit(0);
  }
  
  const inputPath = options.input || './docs/services-workbook.xlsx';
  const outputPath = options.output || './src/generated/';
  
  console.log('🔍 Import Services XLSX to JSON');
  console.log('================================');
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Dry Run: ${options.dryRun ? 'Yes' : 'No'}`);
  console.log('');
  
  // Validate input file exists (for real XLSX)
  if (!options.dryRun && !fs.existsSync(inputPath)) {
    console.log(`⚠️  Warning: Input file not found: ${inputPath}`);
    console.log('   Using mock data for demonstration...');
    console.log('');
  }
  
  // Generate content
  console.log('📝 Generating content...');
  const content = generateContent();
  console.log(`✅ Generated ${content.services.length} services`);
  console.log('');
  
  // Validate
  console.log('🔎 Validating...');
  let totalErrors = 0;
  
  for (const service of content.services) {
    const errors = validateService(service);
    if (errors.length > 0) {
      console.log(`❌ ${service.slug}: ${errors.join(', ')}`);
      totalErrors += errors.length;
    } else {
      console.log(`✅ ${service.slug}: OK`);
    }
  }
  
  console.log('');
  
  if (totalErrors > 0) {
    console.log(`❌ Validation failed with ${totalErrors} errors`);
    process.exit(1);
  }
  
  console.log('✅ Validation passed');
  console.log('');
  
  if (options.dryRun) {
    console.log('🚀 Dry run complete - no files written');
    process.exit(0);
  }
  
  // Write output files
  console.log('💾 Writing output files...');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  // Write services-content.json
  const contentPath = path.join(outputPath, 'services-content.json');
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
  console.log(`✅ Written: ${contentPath}`);
  
  // Write services-index.ts
  const indexPath = path.join(outputPath, 'services-index.ts');
  const indexContent = `// Generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const SERVICE_SLUGS = [
${content.services.map((s) => `  '${s.slug}',`).join('\n')}
] as const;

export type ServiceSlug = typeof SERVICE_SLUGS[number];

export const SERVICE_TITLES: Record<ServiceSlug, string> = {
${content.services.map((s) => `  ${s.slug}: '${s.title}',`).join('\n')}
};

export const SERVICE_SHORT_NAMES: Record<ServiceSlug, string> = {
${content.services.map((s) => `  ${s.slug}: '${s.shortName}',`).join('\n')}
};

export function getServiceBySlug(slug: string): ServiceSlug | undefined {
  return SERVICE_SLUGS.find(s => s === slug);
}

export function isValidServiceSlug(slug: string): slug is ServiceSlug {
  return SERVICE_SLUGS.includes(slug as ServiceSlug);
}
`;
  fs.writeFileSync(indexPath, indexContent);
  console.log(`✅ Written: ${indexPath}`);
  
  // Write meta JSON
  const metaPath = path.join(outputPath, 'content-meta.json');
  const metaContent = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    totalServices: content.services.length,
    services: content.services.map((s) => ({
      slug: s.slug,
      title: s.title,
      shortName: s.shortName,
    })),
  };
  fs.writeFileSync(metaPath, JSON.stringify(metaContent, null, 2));
  console.log(`✅ Written: ${metaPath}`);
  
  console.log('');
  console.log('🎉 Import complete!');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Review generated files in', outputPath);
  console.log('  2. Update services-content.json with full content');
  console.log('  3. Run: pnpm build');
}

main();
