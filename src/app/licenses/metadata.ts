import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Лицензии и допуски",
  description:
    "Документы OneDim: лицензии, допуски, подтверждения качества. Информация для тендеров, служб безопасности и внутренних проверок.",
  openGraph: {
    title: "Лицензии и допуски | OneDim",
    description:
      "Документы OneDim: лицензии, допуски, подтверждения качества для коммерческих и промышленных объектов.",
    type: "website",
    locale: "ru_RU",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Лицензии и допуски | OneDim",
    description:
      "Документы OneDim: лицензии, допуски, подтверждения качества для коммерческих и промышленных объектов.",
    images: [defaultOgImage],
  },
};
