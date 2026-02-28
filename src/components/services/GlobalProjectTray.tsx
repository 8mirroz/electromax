"use client";

import { useProjectTray } from "@/hooks/useProjectTray";
import { ProjectTrayDrawer } from "@/components/services/ProjectTrayDrawer";
import { useEffect, useState } from "react";

export function GlobalProjectTray() {
  const [isOpen, setIsOpen] = useState(false);

  // Use a global mode - no specific service-specific catalog items for the main drawer view
  const { tray, removeItem, updateQty, updateItemNotes, setNotes, clearProject } = useProjectTray();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      e.preventDefault();
      setIsOpen(true);
    };
    window.addEventListener("open-project-tray", handleOpen);
    return () => window.removeEventListener("open-project-tray", handleOpen);
  }, []);

  return (
    <ProjectTrayDrawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      serviceSlug={tray.serviceSlug || "general"}
      serviceTitle={tray.serviceSlug ? tray.serviceSlug.toUpperCase() : "Ваш проект"}
      tray={tray}
      onRemoveItem={removeItem}
      onUpdateQty={updateQty}
      onUpdateItemNotes={updateItemNotes}
      onNotesChange={setNotes}
      onClear={clearProject}
    />
  );
}
