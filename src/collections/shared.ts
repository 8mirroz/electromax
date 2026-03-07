import type { Field } from "payload";

export const localeField: Field = {
  name: "locale",
  type: "select",
  required: true,
  defaultValue: "ru",
  options: [
    { label: "Russian", value: "ru" },
    { label: "English", value: "en" },
    { label: "Kazakh", value: "kz" },
  ],
  index: true,
};

export const seoField: Field = {
  name: "seo",
  type: "group",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "canonical", type: "text" },
    { name: "ogImage", type: "text" },
  ],
};
