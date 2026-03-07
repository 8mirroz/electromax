import type { CollectionConfig } from "payload";

import { localeField } from "./shared";

export const Faqs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
  },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "question", type: "textarea", required: true },
    { name: "answer", type: "textarea", required: true },
    { name: "intentTag", type: "text" },
    { name: "serviceSlug", type: "text" },
    localeField,
  ],
};
