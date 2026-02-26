"use client";

import { useState } from "react";
import type { ServicePageModel } from "@/types";
import { useProjectTray } from "@/hooks/useProjectTray";
import { useAiAssistantRules } from "@/hooks/useAiAssistantRules";
import { ServiceHeroCompact } from "@/components/services/ServiceHeroCompact";
import { ServiceStatsStrip } from "@/components/services/ServiceStatsStrip";
import { SolutionKitsGrid } from "@/components/services/SolutionKitsGrid";
import { ServiceCatalogAccordionTable } from "@/components/services/ServiceCatalogAccordionTable";
import { ProcessRoadmapMini } from "@/components/services/ProcessRoadmapMini";
import { FaqAccordion } from "@/components/services/FaqAccordion";
import { SeoContentBlock } from "@/components/services/SeoContentBlock";
import { AiAssistantRail } from "@/components/services/AiAssistantRail";
import { ProjectTrayDrawer } from "@/components/services/ProjectTrayDrawer";
import { StickyProjectButton } from "@/components/services/StickyProjectButton";

interface Props {
    model: ServicePageModel;
}

export function ServicePageClient({ model }: Props) {
    const [isTrayOpen, setIsTrayOpen] = useState(false);

    // Initialize project tray hook
    const {
        tray,
        addItem,
        addKit,
        removeItem,
        updateQty,
        updateItemNotes,
        setNotes,
        clearProject
    } = useProjectTray({
        serviceSlug: model.slug,
        catalogItems: model.catalog.flatMap((s) => s.items),
    });

    // Get AI assistant recommendations
    const { recommendations, warnings } = useAiAssistantRules({ model, tray });

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                <div className="space-y-12">
                    {/* Hero Section */}
                    <ServiceHeroCompact
                        model={model}
                        onPrimaryCta={() => setIsTrayOpen(true)}
                    />

                    {/* Stats Section */}
                    <ServiceStatsStrip model={model} />

                    {/* Solution Kits Section */}
                    <SolutionKitsGrid
                        model={model}
                        onAddKit={(kit) => addKit(kit)}
                    />

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
                    {model.seo && (
                        <SeoContentBlock seo={model.seo} benchmarks={model.benchmarks} />
                    )}
                </div>

                {/* Sidebar with AI Assistant */}
                <aside className="space-y-6">
                    <AiAssistantRail
                        recommendations={recommendations}
                        warnings={warnings}
                    />
                </aside>
            </div>

            {/* Persistent UI Elements */}
            <StickyProjectButton
                tray={tray}
                onClick={() => setIsTrayOpen(true)}
            />

            <ProjectTrayDrawer
                isOpen={isTrayOpen}
                onClose={() => setIsTrayOpen(false)}
                serviceSlug={model.slug}
                serviceTitle={model.title}
                tray={tray}
                onRemoveItem={removeItem}
                onUpdateQty={updateQty}
                onUpdateItemNotes={updateItemNotes}
                onNotesChange={setNotes}
                onClear={clearProject}
            />
        </div>
    );
}
