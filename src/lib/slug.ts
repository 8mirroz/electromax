import slugify from "slugify";

export function toSlug(value: string) {
  const normalized = value.replace(/[ЪъЬь]/g, "");

  return slugify(normalized, {
    lower: true,
    strict: true,
    trim: true,
    locale: "ru",
  });
}
