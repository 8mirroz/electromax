import type { CollectionConfig } from "payload";

import { localeField } from "./shared";
import { formatSlugHook } from "./hooks/slugHooks";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "fullName",
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [formatSlugHook('fullName')],
      },
    },
    { name: "fullName", type: "text", required: true },
    { name: "role", type: "text", required: true },
    { name: "bio", type: "textarea" },
    { name: "avatarUrl", type: "text" },
    localeField,
  ],
};
