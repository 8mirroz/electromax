#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const draftsDir = path.join(root, "content", "drafts");
const qaDir = path.join(root, "content", "qa");

if (!fs.existsSync(qaDir)) {
  fs.mkdirSync(qaDir, { recursive: true });
}

const required = ["slug", "locale", "type", "title", "excerpt", "body"];
const files = fs.existsSync(draftsDir)
  ? fs
      .readdirSync(draftsDir)
      .filter((f) => f.endsWith(".json"))
      .sort()
  : [];

const report = {
  checkedAt: new Date().toISOString(),
  total: files.length,
  passed: 0,
  failed: 0,
  issues: [],
};

for (const file of files) {
  const full = path.join(draftsDir, file);
  const json = JSON.parse(fs.readFileSync(full, "utf8"));

  const missing = required.filter((field) => !json[field]);
  if (missing.length) {
    report.failed += 1;
    report.issues.push({ file, missing });
    continue;
  }

  report.passed += 1;
}

const output = path.join(qaDir, "draft-validation-report.json");
fs.writeFileSync(output, JSON.stringify(report, null, 2));

if (report.failed > 0) {
  console.error(`[content-gen] validation failed: ${report.failed}/${report.total}`);
  process.exit(1);
}

console.log(`[content-gen] validation passed: ${report.passed}/${report.total}`);
