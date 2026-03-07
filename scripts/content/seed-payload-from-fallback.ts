import { getPayload } from "payload";

import payloadConfig from "../../src/payload.config";
import {
  cmsFallbackArticles,
  cmsFallbackAuthors,
  cmsFallbackCaseStudies,
  cmsFallbackFaqs,
  cmsFallbackServices,
  cmsFallbackSiteSettings,
  cmsFallbackTestimonials,
  cmsFallbackVideos,
} from "../../src/lib/cms/fallback-content";

type SeedCollection =
  | "services"
  | "articles"
  | "caseStudies"
  | "testimonials"
  | "videos"
  | "faqs"
  | "siteSettings"
  | "authors";

function stripId<T extends { id?: unknown }>(doc: T): Record<string, unknown> {
  // Payload owns internal document IDs; source IDs are not persisted.
  const rest = { ...doc } as Record<string, unknown>;
  delete rest.id;
  return rest;
}

async function upsertByIdentity(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: SeedCollection,
  doc: Record<string, unknown>,
) {
  const and: Array<Record<string, unknown>> = [];

  if (typeof doc.slug === "string" && doc.slug.length > 0) {
    and.push({ slug: { equals: doc.slug } });
  }

  if (typeof doc.locale === "string" && doc.locale.length > 0) {
    and.push({ locale: { equals: doc.locale } });
  }

  const where = and.length > 0 ? { and } : undefined;

  const existing = where
    ? await payload.find({
        collection,
        where: where as never,
        limit: 1,
        depth: 0,
        pagination: false,
      })
    : { docs: [] };

  if (existing.docs.length > 0) {
    await payload.update({
      collection,
      id: existing.docs[0].id,
      data: doc,
      depth: 0,
    });
    return "updated";
  }

  await payload.create({
    collection,
    data: doc,
    depth: 0,
  });

  return "created";
}

async function seedCollection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: SeedCollection,
  docs: Record<string, unknown>[],
) {
  let created = 0;
  let updated = 0;

  for (const raw of docs) {
    const status = await upsertByIdentity(payload, collection, raw);
    if (status === "created") created += 1;
    if (status === "updated") updated += 1;
  }

  console.log(`[seed] ${collection}: created=${created}, updated=${updated}, total=${docs.length}`);
}

async function run() {
  const payload = await getPayload({ config: payloadConfig });

  await seedCollection(payload, "services", cmsFallbackServices.map(stripId));
  await seedCollection(payload, "authors", cmsFallbackAuthors.map(stripId));
  await seedCollection(payload, "faqs", cmsFallbackFaqs.map(stripId));
  await seedCollection(payload, "testimonials", cmsFallbackTestimonials.map(stripId));
  await seedCollection(payload, "videos", cmsFallbackVideos.map(stripId));
  await seedCollection(payload, "caseStudies", cmsFallbackCaseStudies.map(stripId));
  await seedCollection(payload, "articles", cmsFallbackArticles.map(stripId));
  await seedCollection(payload, "siteSettings", cmsFallbackSiteSettings.map(stripId));

  console.log("[seed] Payload fallback seed completed");
}

run().catch((error) => {
  console.error("[seed] failed", error);
  process.exit(1);
});
