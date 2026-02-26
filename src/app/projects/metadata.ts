import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/seo";

export const projectsMetadata: Metadata = {
  title: "Проекты",
  description:
    "Реализованные проекты Electromax: инженерные системы безопасности, электромонтаж, интеграции и эксплуатационные сценарии. Параметры объектов, сроки, состав работ.",
  openGraph: {
    title: "Проекты | Electromax",
    description:
      "Реализованные проекты: параметры объектов, сроки, состав систем и результаты внедрения.",
    type: "website",
    locale: "ru_RU",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Проекты | Electromax",
    description:
      "Реализованные проекты Electromax: параметры объектов, сроки, состав систем и результаты.",
    images: [defaultOgImage],
  },
};
