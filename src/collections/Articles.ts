import type { CollectionConfig } from "payload";

import { localeField, seoField } from "./shared";
import { formatSlugHook } from "./hooks/slugHooks";

export const Articles: CollectionConfig = {
  slug: "articles",
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
    { name: "excerpt", type: "textarea", required: true },
    { name: "body", type: "textarea", required: true },
    { name: "tags", type: "text", hasMany: true },
    { name: "authorSlug", type: "text", required: true, index: true },
    {
      name: "contentType",
      type: "select",
      required: true,
      defaultValue: "article",
      options: [
        { label: "Article", value: "article" },
        { label: "Guide", value: "guide" },
        { label: "Checklist", value: "checklist" },
      ],
    },
    { name: "publishedAt", type: "date", required: true },
    { name: "updatedAt", type: "date", required: true },
    localeField,
    seoField,
  ],
};
