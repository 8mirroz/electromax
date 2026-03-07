// src/app/(payload)/admin/[[...segments]]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isCmsEnabled } from "@/lib/cms/feature-flags";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  if (!isCmsEnabled()) {
    return { title: "Not Found" };
  }

  const [{ generatePageMetadata }, { default: config }] = await Promise.all([
    import("@payloadcms/next/views"),
    import("@/payload.config"),
  ]);

  return generatePageMetadata({ config, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  if (!isCmsEnabled()) {
    notFound();
  }

  const [{ RootPage }, { default: config }, { importMap }] = await Promise.all([
    import("@payloadcms/next/views"),
    import("@/payload.config"),
    import("../importMap"),
  ]);

  return RootPage({ config, importMap, params, searchParams });
};

export default Page;
