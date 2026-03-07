import type { FieldHook } from "payload";

import { toSlug } from "@/lib/slug";

export const formatSlug = (value: string): string => toSlug(value);

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === "string") {
      return formatSlug(value);
    }

    if (operation === "create" || operation === "update") {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback];

      if (fallbackData && typeof fallbackData === "string") {
        return formatSlug(fallbackData);
      }
    }

    return value;
  };
