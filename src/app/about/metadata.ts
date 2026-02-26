import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Electromax — инженерный интегратор систем безопасности и электромонтажа для коммерческих и промышленных объектов. Команда, подход, процессы и опыт.",
  openGraph: {
    title: "О компании | Electromax",
    description:
      "Electromax — инженерный интегратор систем безопасности и электромонтажа для коммерческих и промышленных объектов.",
    type: "website",
    locale: "ru_RU",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "О компании | Electromax",
    description:
      "Инженерный интегратор систем безопасности и электромонтажа. Команда, подход, процессы и опыт.",
    images: [defaultOgImage],
  },
};
