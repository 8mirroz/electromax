import type { CollectionConfig } from "payload";

import { localeField } from "./shared";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "customerName",
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "customerName", type: "text", required: true },
    { name: "company", type: "text", required: true },
    { name: "quote", type: "textarea", required: true },
    {
      name: "rating",
      type: "number",
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
    },
    { name: "videoUrl", type: "text" },
    localeField,
  ],
};
