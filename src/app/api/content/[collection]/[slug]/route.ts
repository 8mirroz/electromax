import { NextResponse } from "next/server";
import { isCmsCollection } from "@/lib/cms/collections";
import { getCmsItemBySlug } from "@/lib/cms/client";

interface RouteParams {
  params: Promise<{ collection: string; slug: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const { collection, slug } = await params;
  if (!isCmsCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") || undefined;

  const doc = await getCmsItemBySlug(collection, slug, {
    locale: locale as "ru" | "en" | "kz" | undefined,
  });

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ collection, slug, doc });
}
