import type { CollectionConfig } from "payload";

import { localeField, seoField } from "./shared";
import { formatSlugHook } from "./hooks/slugHooks";

export const Services: CollectionConfig = {
  slug: "services",
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
      label: "Slug (URL identifier)",
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Full Title",
    },
    {
      name: "shortName",
      type: "text",
      required: true,
      label: "Short Name",
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
    },
    localeField,
    seoField,
  ],
};
