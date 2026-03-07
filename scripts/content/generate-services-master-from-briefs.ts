import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";

const briefsPath = path.resolve(process.cwd(), "docs/marketing_briefs_10_sections.md");
const generatedPath = path.resolve(process.cwd(), "src/generated/services-content.json");

let raw = "";
try {
  raw = fs.readFileSync(briefsPath, "utf8");
} catch (error) {
  console.error(
    `[ContentOps] Failed to read briefs at ${briefsPath}. Check the path and cwd.`,
    error,
  );
  process.exit(1);
}

let generated: { services?: Array<{ slug?: string; theme?: { accent?: string } }> } | null = null;
if (fs.existsSync(generatedPath)) {
  try {
    generated = JSON.parse(fs.readFileSync(generatedPath, "utf8"));
  } catch (error) {
    console.error(`[ContentOps] Failed to parse generated content at ${generatedPath}.`, error);
    process.exit(1);
  }
}

const slugFromCode: Record<string, string> = {
  APS: "aps",
  ASUZ: "asuz",
  EO: "eo",
  EOM: "eom",
  OS: "os",
  SKS: "sks",
  SKUD: "skud",
  SOT: "sot",
  SOUE: "soue",
  TO: "to",
};

const themeFallback = "#2563eb";

function getThemeColor(slug: string) {
  const services = generated?.services;
  if (!Array.isArray(services)) return themeFallback;
  const match = services.find((s) => s?.slug === slug);
  return match?.theme?.accent || themeFallback;
}

function getSectionBlocks(text: string) {
  const sections = text
    .split(/\n---\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sections;
}

function parseList(block: string): string[] {
  const lines = block.split(/\n/).map((l) => l.trim());
  return lines
    .filter((l) => /^\d+\./.test(l) || /^- /.test(l))
    .map((l) => l.replace(/^\d+\.\s*/, "").replace(/^[-*]\s+/, ""))
    .filter(Boolean)
    .map((l) => l.replace(/^"|"$/g, ""));
}

function extractBlock(section: string, heading: string) {
  const match = section.split(new RegExp(`\n### ${heading}(?:\\s*\\([^\\)]*\\))?\\n`, "i"));
  if (match.length < 2) return "";
  const rest = match[1];
  const nextHeading = rest.search(/\n### /);
  return nextHeading >= 0 ? rest.slice(0, nextHeading).trim() : rest.trim();
}

function parseStats(statsBlock: string) {
  const lines = parseList(statsBlock);
  return lines.map((line) => {
    const boldMatch = line.match(/\*\*(.+?)\*\*/);
    const value = boldMatch ? boldMatch[1].trim() : line;
    const label = boldMatch ? line.replace(boldMatch[0], "").trim() : "";
    return {
      value,
      label: label || "Показатель",
    };
  });
}

const sections = getSectionBlocks(raw);

const services: Array<{
  id: string;
  slug: string;
  title: string;
  shortName: string;
  themeColor: string;
  isActive: boolean;
  sortOrder: number;
  heroTitle: string;
  heroSubtitle: string;
  trustFactors: string[];
  disclaimer: string;
  stats: Array<{ label: string; value: string }>;
  faq: string[];
}> = [];

for (const section of sections) {
  const headerMatch = section.match(/##\s+\d+\.\s+([A-Z]+)\s*\(([^\)]+)\)/);
  if (!headerMatch) continue;
  const code = headerMatch[1];
  const title = headerMatch[2].trim();
  const slug = slugFromCode[code];
  if (!slug) continue;

  const heroBlock = extractBlock(section, "Hero офферы");
  const subheadBlock = extractBlock(section, "Subhead");
  const statsBlock = extractBlock(section, "Stats Cards");
  const faqBlock = extractBlock(section, "FAQ");

  const heroList = parseList(heroBlock);
  const subheadList = parseList(subheadBlock);
  const stats = parseStats(statsBlock);
  const faqList = parseList(faqBlock);

  const trustFactors = stats
    .map((s) => `${s.value}${s.label ? " " + s.label : ""}`.trim())
    .slice(0, 4);

  services.push({
    id: slug,
    slug,
    title,
    shortName: code,
    themeColor: getThemeColor(slug),
    isActive: true,
    sortOrder: services.length,
    heroTitle: heroList[0] || `${title} под ключ`,
    heroSubtitle: subheadList[0] || "Комплексные решения с инженерным аудитом",
    trustFactors,
    disclaimer: "Цена ориентировочная, точная после аудита",
    stats: stats.slice(0, 4).map((s) => ({
      label: s.label || "Показатель",
      value: s.value || "-",
    })),
    faq: faqList.slice(0, 12),
  });
}

const wb = xlsx.utils.book_new();

function addSheet(name: string, rows: Record<string, unknown>[]) {
  const ws = xlsx.utils.json_to_sheet(rows);
  xlsx.utils.book_append_sheet(wb, ws, name);
}

addSheet(
  "services",
  services.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortName: s.shortName,
    themeColor: s.themeColor,
    isActive: s.isActive,
    sortOrder: s.sortOrder,
  })),
);

addSheet(
  "hero",
  services.map((s) => ({
    service_slug: s.slug,
    title: s.heroTitle,
    subtitle: s.heroSubtitle,
    trustFactors: s.trustFactors.join(", "),
    disclaimer: s.disclaimer,
  })),
);

const statRows: Array<Record<string, string>> = [];
services.forEach((s) => {
  s.stats.forEach((stat) => {
    statRows.push({
      service_slug: s.slug,
      label: stat.label,
      value: stat.value,
      subValue: "",
      isMarketing: "true",
    });
  });
});
addSheet("stats_cards", statRows);

const catalogHeaders = [
  [
    "service_slug",
    "itemCode",
    "itemName",
    "category",
    "unit",
    "priceType",
    "priceMin",
    "priceMax",
    "currency",
    "leadTimeMinDays",
    "leadTimeMaxDays",
    "includes",
    "excludes",
  ],
];
const kitHeaders = [
  [
    "service_slug",
    "kitId",
    "kitName",
    "useCase",
    "targetObject",
    "includedItemCodes",
    "budgetMin",
    "budgetMax",
    "durationText",
    "ctaLabel",
  ],
];
const processHeaders = [
  ["service_slug", "stepId", "title", "clientAction", "contractorAction", "artifact", "leadTime"],
];
const aiRuleHeaders = [
  [
    "service_slug",
    "ruleId",
    "triggerType",
    "triggerValue",
    "recommendItemCode",
    "messageText",
    "priority",
  ],
];

xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(catalogHeaders), "catalog_items");
xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(kitHeaders), "solution_kits");
xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(processHeaders), "process_steps");
xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(aiRuleHeaders), "ai_rules");

addSheet(
  "seo_blocks",
  services.map((s) => ({
    service_slug: s.slug,
    title: `${s.title} в Москве | Electromax`,
    description: s.heroSubtitle,
    textBlock: `${s.heroTitle} ${s.heroSubtitle} Полный цикл: аудит, проектирование, монтаж, обслуживание.`,
  })),
);

const faqRows: Array<Record<string, string>> = [];
services.forEach((s) => {
  s.faq.forEach((question) => {
    faqRows.push({
      service_slug: s.slug,
      question,
      answer: "Ответ уточняется. Расскажем после аудита или по вашему ТЗ.",
      schemaInclude: "true",
      intentTag: "general",
    });
  });
});
addSheet("faq", faqRows);

const outPath = path.resolve(process.cwd(), "scripts/content/services-master.xlsx");
if (!fs.existsSync(path.dirname(outPath))) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
}

xlsx.writeFile(wb, outPath);
console.log(`[ContentOps] Workbook generated at ${outPath}`);
