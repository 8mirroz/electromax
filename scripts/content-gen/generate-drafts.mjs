#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const briefsDir = path.join(root, "content", "briefs");
const draftsDir = path.join(root, "content", "drafts");

const briefFiles = fs
  .readdirSync(briefsDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

let generated = 0;

for (const file of briefFiles) {
  const full = path.join(briefsDir, file);
  const brief = JSON.parse(fs.readFileSync(full, "utf8"));

  if (!brief.slug || !brief.locale || !brief.title) {
    console.warn(`[skip] ${file}: missing required fields`);
    continue;
  }

  const now = new Date().toISOString();
  const draft = {
    slug: brief.slug,
    locale: brief.locale,
    type: brief.type || "article",
    title: brief.title,
    excerpt: `Практический материал: ${brief.targetKeyword || brief.title}`,
    body: [
      "## Контекст",
      `Материал ориентирован на сегмент: ${brief.audience || "B2B"}.`,
      "",
      "## Рекомендованный подход",
      "1. Провести аудит текущего состояния.",
      "2. Согласовать KPI и SLA.",
      "3. Реализовать поэтапный rollout.",
      "",
      "## Контроль качества",
      "Проверить риски, сроки, budget-range и требования эксплуатации.",
      "",
      "## CTA",
      brief.cta || "Оставить заявку на аудит",
    ].join("\n"),
    tags: ["b2b", "electromax", "engineering"],
    targetKeyword: brief.targetKeyword || "",
    intent: brief.intent || "informational",
    quality: {
      factual: "pending",
      legal: "pending",
      seo: "pending",
    },
    createdAt: now,
    updatedAt: now,
  };

  const target = path.join(draftsDir, `${brief.slug}.json`);
  fs.writeFileSync(target, JSON.stringify(draft, null, 2));
  generated += 1;
}

console.log(`[content-gen] generated ${generated} drafts from ${briefFiles.length} briefs`);
