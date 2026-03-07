import type { CollectionConfig } from "payload";

import { localeField, seoField } from "./shared";
import { formatSlugHook } from "./hooks/slugHooks";

export const CaseStudies: CollectionConfig = {
  slug: "caseStudies",
  admin: {
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
    },
    { name: "title", type: "text", required: true },
    { name: "summary", type: "textarea", required: true },
    { name: "challenge", type: "textarea", required: true },
    { name: "solution", type: "textarea", required: true },
    { name: "outcomes", type: "text", hasMany: true },
    {
      name: "kpiBeforeAfter",
      type: "array",
      fields: [
        { name: "metric", type: "text", required: true },
        { name: "before", type: "text", required: true },
        { name: "after", type: "text", required: true },
      ],
    },
    { name: "publishedAt", type: "date", required: true },
    localeField,
    seoField,
  ],
};
