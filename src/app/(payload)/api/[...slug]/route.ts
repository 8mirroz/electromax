import { notFound } from "next/navigation";

import { isCmsEnabled } from "@/lib/cms/feature-flags";

type RouteContext = {
  params: Promise<{
    slug: string[];
  }>;
};

async function getRestHandlers() {
  const [{ REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT }, { default: config }] =
    await Promise.all([import("@payloadcms/next/routes"), import("@/payload.config")]);

  return {
    GET: REST_GET(config),
    POST: REST_POST(config),
    DELETE: REST_DELETE(config),
    PUT: REST_PUT(config),
    PATCH: REST_PATCH(config),
    OPTIONS: REST_OPTIONS(config),
  };
}

async function runRoute(method: keyof Awaited<ReturnType<typeof getRestHandlers>>, req: Request, context: RouteContext) {
  if (!isCmsEnabled()) {
    notFound();
  }

  const handlers = await getRestHandlers();
  return handlers[method](req, context);
}

export async function GET(req: Request, context: RouteContext) {
  return runRoute("GET", req, context);
}

export async function POST(req: Request, context: RouteContext) {
  return runRoute("POST", req, context);
}

export async function DELETE(req: Request, context: RouteContext) {
  return runRoute("DELETE", req, context);
}

export async function PUT(req: Request, context: RouteContext) {
  return runRoute("PUT", req, context);
}

export async function PATCH(req: Request, context: RouteContext) {
  return runRoute("PATCH", req, context);
}

export async function OPTIONS(req: Request, context: RouteContext) {
  return runRoute("OPTIONS", req, context);
}
