#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const draftsDir = path.join(root, "content", "drafts");

const files = fs.existsSync(draftsDir)
  ? fs
      .readdirSync(draftsDir)
      .filter((f) => f.endsWith(".json"))
      .sort()
  : [];

let generated = 0;

for (const file of files) {
  const full = path.join(draftsDir, file);
  const draft = JSON.parse(fs.readFileSync(full, "utf8"));

  if (draft.locale !== "ru") continue;

  for (const locale of ["en", "kz"]) {
    const localized = {
      ...draft,
      locale,
      slug: `${draft.slug}-${locale}`,
      title: locale === "en" ? `[EN] ${draft.title}` : `[KZ] ${draft.title}`,
      excerpt: locale === "en" ? `[EN] ${draft.excerpt}` : `[KZ] ${draft.excerpt}`,
      body:
        locale === "en"
          ? `# EN localization draft\n\n${draft.body}`
          : `# KZ localization draft\n\n${draft.body}`,
      sourceLocale: "ru",
      localizedAt: new Date().toISOString(),
      quality: {
        factual: "pending",
        legal: "pending",
        seo: "pending",
        localization: "pending",
      },
    };

    const out = path.join(draftsDir, `${localized.slug}.json`);
    fs.writeFileSync(out, JSON.stringify(localized, null, 2));
    generated += 1;
  }
}

console.log(`[content-gen] generated ${generated} localized drafts (EN/KZ)`);
