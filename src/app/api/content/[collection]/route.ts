import { NextResponse } from "next/server";
import { isCmsCollection } from "@/lib/cms/collections";
import { listCmsCollection } from "@/lib/cms/client";

interface RouteParams {
  params: Promise<{ collection: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { collection } = await params;
  if (!isCmsCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") || undefined;
  const limit = url.searchParams.get("limit");
  const parsedLimit = limit ? Number(limit) : undefined;

  const docs = await listCmsCollection(collection, {
    locale: locale as "ru" | "en" | "kz" | undefined,
    limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
  });

  return NextResponse.json({
    collection,
    count: docs.length,
    docs,
  });
}
