"use client";

import type { ServicePageModel } from "@/types";
import { useProjectTray } from "@/hooks/useProjectTray";
import { ServiceHeroCompact } from "@/components/services/ServiceHeroCompact";
import { ServiceStatsStrip } from "@/components/services/ServiceStatsStrip";
import { SolutionKitsGrid } from "@/components/services/SolutionKitsGrid";
import { ServiceCatalogAccordionTable } from "@/components/services/ServiceCatalogAccordionTable";
import { ProcessRoadmapMini } from "@/components/services/ProcessRoadmapMini";
import { FaqAccordion } from "@/components/services/FaqAccordion";
import { SeoContentBlock } from "@/components/services/SeoContentBlock";

interface Props {
  model: ServicePageModel;
}

export function ServicePageClient({ model }: Props) {
  // Initialize project tray hook
  const { addItem, addKit } = useProjectTray({
    serviceSlug: model.slug,
    catalogItems: model.catalog.flatMap((s) => s.items),
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="space-y-12">
        {/* Hero Section */}
        <ServiceHeroCompact
          model={model}
          onPrimaryCta={() => window.dispatchEvent(new CustomEvent("open-project-tray"))}
        />

        {/* Stats Section */}
        <ServiceStatsStrip model={model} />

        {/* Solution Kits Section */}
        <SolutionKitsGrid model={model} onAddKit={(kit) => addKit(kit)} />

        {/* Catalog Section */}
        <ServiceCatalogAccordionTable
          sections={model.catalog}
          onAddItem={(item, options, calculatedPrice) => addItem(item, options, calculatedPrice)}
        />

        {/* Process Section */}
        <ProcessRoadmapMini steps={model.process} />

        {/* FAQ Section */}
        <FaqAccordion items={model.faq} />

        {/* SEO & Benchmarks Section */}
        {model.seo && <SeoContentBlock seo={model.seo} benchmarks={model.benchmarks} />}
      </div>
    </div>
  );
}
