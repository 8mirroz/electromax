import "tsconfig-paths/register";
import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { getServicePageModel, getServicePageSlugs } from "../../src/lib/services-content";

const workbookPath = path.resolve(__dirname, "services-master.xlsx");

if (!fs.existsSync(workbookPath)) {
  console.error(`[ContentOps] Workbook not found at ${workbookPath}`);
  process.exit(1);
}

let workbook: xlsx.WorkBook;
try {
  workbook = xlsx.readFile(workbookPath);
} catch (error) {
  console.error(`[ContentOps] Failed to read workbook at ${workbookPath}`, error);
  process.exit(1);
}

function toCsv(value: string[] | undefined) {
  if (!value?.length) return "";
  return value.join(", ");
}

type CatalogRow = {
  service_slug: string;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  priceType: string;
  priceMin?: number;
  priceMax?: number;
  currency: string;
  leadTimeMinDays?: number;
  leadTimeMaxDays?: number;
  includes: string;
  excludes: string;
};

type KitRow = {
  service_slug: string;
  kitId: string;
  kitName: string;
  useCase?: string;
  targetObject?: string;
  includedItemCodes: string;
  budgetMin?: number;
  budgetMax?: number;
  durationText?: string;
  ctaLabel?: string;
};

type ProcessRow = {
  service_slug: string;
  stepId: string;
  title: string;
  clientAction?: string;
  contractorAction?: string;
  artifact?: string;
  leadTime?: string;
};

type AiRuleRow = {
  service_slug: string;
  ruleId: string;
  triggerType: string;
  triggerValue: string;
  recommendItemCode: string;
  messageText: string;
  priority?: number;
};

function replaceSheet(name: string, rows: CatalogRow[] | KitRow[] | ProcessRow[] | AiRuleRow[]) {
  const ws = xlsx.utils.json_to_sheet(rows);
  const existingIndex = workbook.SheetNames.indexOf(name);
  if (workbook.Sheets[name]) {
    delete workbook.Sheets[name];
  }
  if (existingIndex >= 0) {
    workbook.SheetNames.splice(existingIndex, 1);
  }
  xlsx.utils.book_append_sheet(workbook, ws, name);
  const appendedIndex = workbook.SheetNames.indexOf(name);
  if (existingIndex >= 0 && appendedIndex >= 0 && appendedIndex !== existingIndex) {
    const [sheetName] = workbook.SheetNames.splice(appendedIndex, 1);
    workbook.SheetNames.splice(existingIndex, 0, sheetName);
  }
}

const catalogRows: CatalogRow[] = [];
const kitRows: KitRow[] = [];
const processRows: ProcessRow[] = [];
const aiRows: AiRuleRow[] = [];

for (const slug of getServicePageSlugs()) {
  let model: ReturnType<typeof getServicePageModel>;
  try {
    model = getServicePageModel(slug);
  } catch (error) {
    console.error(`[ContentOps] Failed to load service model for ${slug}`, error);
    continue;
  }
  if (!model) continue;

  const catalog = model.catalog ?? [];
  const solutionKits = model.solutionKits ?? [];
  const processSteps = model.process ?? [];
  const aiRules = model.aiRules ?? [];

  for (const section of catalog) {
    for (const item of section.items) {
      catalogRows.push({
        service_slug: slug,
        itemCode: item.itemCode,
        itemName: item.name,
        category: item.category,
        unit: item.unit,
        priceType: item.priceType,
        priceMin: typeof item.priceMin === "number" ? item.priceMin : undefined,
        priceMax: typeof item.priceMax === "number" ? item.priceMax : undefined,
        currency: item.currency ?? "RUB",
        leadTimeMinDays: undefined,
        leadTimeMaxDays: undefined,
        includes: toCsv(item.includes),
        excludes: toCsv(item.excludes),
      });
    }
  }

  for (const kit of solutionKits) {
    kitRows.push({
      service_slug: slug,
      kitId: kit.id,
      kitName: kit.name,
      useCase: kit.useCase,
      targetObject: kit.targetObject,
      includedItemCodes: toCsv(kit.includedItemCodes),
      budgetMin: kit.budgetMin ?? undefined,
      budgetMax: kit.budgetMax ?? undefined,
      durationText: kit.durationText,
      ctaLabel: kit.ctaLabel,
    });
  }

  for (const step of processSteps) {
    processRows.push({
      service_slug: slug,
      stepId: step.id,
      title: step.title,
      clientAction: step.clientAction,
      contractorAction: step.oneDimAction,
      artifact: step.artifact,
      leadTime: step.durationText,
    });
  }

  for (const rule of aiRules) {
    aiRows.push({
      service_slug: slug,
      ruleId: rule.id,
      triggerType: rule.triggerType,
      triggerValue: rule.triggerValue ?? "",
      recommendItemCode: rule.recommendItemCode ?? "",
      messageText: rule.messageText,
      priority: rule.priority,
    });
  }
}

replaceSheet("catalog_items", catalogRows);
replaceSheet("solution_kits", kitRows);
replaceSheet("process_steps", processRows);
replaceSheet("ai_rules", aiRows);

try {
  xlsx.writeFile(workbook, workbookPath);
} catch (error) {
  console.error(`[ContentOps] Failed to write workbook at ${workbookPath}`, error);
  process.exit(1);
}
console.log(
  `[ContentOps] Backfilled workbook sheets: catalog_items (${catalogRows.length}), solution_kits (${kitRows.length}), process_steps (${processRows.length}), ai_rules (${aiRows.length})`,
);
