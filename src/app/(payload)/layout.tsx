import React from "react";
import { notFound } from "next/navigation";
import type { ServerFunctionClient } from "payload";

import { isCmsEnabled } from "@/lib/cms/feature-flags";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  const [{ handleServerFunctions }, { default: config }, { importMap }] = await Promise.all([
    import("@payloadcms/next/layouts"),
    import("@/payload.config"),
    import("./admin/importMap"),
  ]);
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = async ({ children }: Args) => {
  if (!isCmsEnabled()) {
    notFound();
  }

  const [{ RootLayout }, { default: config }, { importMap }] = await Promise.all([
    import("@payloadcms/next/layouts"),
    import("@/payload.config"),
    import("./admin/importMap"),
  ]);

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
};

export default Layout;
