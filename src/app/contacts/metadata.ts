import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/seo";

export const contactsMetadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь с инженерной командой Electromax. Консультация, предварительное КП, выезд инженера, подбор решений и документация для коммерческих объектов.",
  openGraph: {
    title: "Контакты | Electromax",
    description:
      "Свяжитесь с инженерной командой Electromax. Консультация, предварительное КП, выезд инженера, подбор решений.",
    type: "website",
    locale: "ru_RU",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Контакты | Electromax",
    description:
      "Свяжитесь с инженерной командой Electromax. Консультация, предварительное КП, выезд инженера.",
    images: [defaultOgImage],
  },
};
