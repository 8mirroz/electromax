import type { CollectionConfig } from "payload";

import { localeField } from "./shared";

export const SiteSettings: CollectionConfig = {
  slug: "siteSettings",
  admin: {
    useAsTitle: "siteName",
  },
  fields: [
    localeField,
    { name: "siteName", type: "text", required: true },
    { name: "defaultTitle", type: "text", required: true },
    { name: "defaultDescription", type: "textarea", required: true },
    { name: "defaultOgImage", type: "text" },
  ],
};
