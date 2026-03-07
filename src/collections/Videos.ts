import type { CollectionConfig } from "payload";

import { localeField, seoField } from "./shared";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: {
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "title", type: "text", required: true },
    { name: "summary", type: "textarea", required: true },
    { name: "videoUrl", type: "text", required: true },
    { name: "durationSeconds", type: "number", required: true, min: 0 },
    { name: "transcript", type: "textarea" },
    localeField,
    seoField,
  ],
};
