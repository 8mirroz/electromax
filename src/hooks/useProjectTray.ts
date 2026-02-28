"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import type { CatalogItem, ProjectTrayState, SolutionKit } from "@/types";
import {
  addKitToTray,
  addOrMergeTrayItem,
  clearProjectTray,
  createEmptyProjectTrayState,
  createTrayItemFromCatalogItem,
  readProjectTrayState,
  updateTrayItemParams,
  updateTrayItemQty,
  removeTrayItem,
  touchState,
  writeProjectTrayState,
} from "@/lib/project-tray";

interface UseProjectTrayOptions {
  serviceSlug?: string;
  catalogItems?: CatalogItem[];
}

export function useProjectTray({ serviceSlug, catalogItems = [] }: UseProjectTrayOptions = {}) {
  const [tray, setTray] = useState<ProjectTrayState>(() =>
    createEmptyProjectTrayState(serviceSlug ?? null),
  );
  const [isOpen, setIsOpen] = useState(false);
  const hasHydratedRef = useRef(false);

  const itemsByCode = new Map(catalogItems.map((item) => [item.itemCode, item]));

  useEffect(() => {
    const updateCount = () => {
      const saved = readProjectTrayState(
        typeof window === "undefined" ? null : window.localStorage,
      );
      if (saved) {
        setTray(saved);
      }
    };

    updateCount();
    window.addEventListener("project-tray-updated", updateCount);
    window.addEventListener("storage", updateCount);

    hasHydratedRef.current = true;

    return () => {
      window.removeEventListener("project-tray-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const apply = (updater: (state: ProjectTrayState) => ProjectTrayState) => {
    startTransition(() => {
      setTray((current) => {
        const next = updater(current);
        if (hasHydratedRef.current) {
          writeProjectTrayState(typeof window === "undefined" ? null : window.localStorage, next);
        }
        return next;
      });
    });
  };

  const addItem = (
    item: CatalogItem,
    _options?: Record<string, string>,
    _calculatedPrice?: { min: number; max: number },
  ) => {
    if (!serviceSlug) return;
    apply((current) =>
      addOrMergeTrayItem(
        { ...current, serviceSlug },
        createTrayItemFromCatalogItem({ serviceSlug, item }),
      ),
    );
  };

  const addKit = (kit: SolutionKit) => {
    if (!serviceSlug) return;
    apply((current) =>
      addKitToTray({
        state: { ...current, serviceSlug },
        serviceSlug,
        kit,
        itemsByCode,
      }),
    );
  };

  const removeItem = (itemId: string) => {
    apply((current) => removeTrayItem(current, itemId));
  };

  const updateQty = (itemId: string, qty: number) => {
    apply((current) => updateTrayItemQty(current, itemId, qty));
  };

  const updateItemNotes = (itemId: string, comment: string) => {
    apply((current) => updateTrayItemParams(current, itemId, { comment }));
  };

  const setNotes = (notes: string) => {
    apply((current) => touchState({ ...current, notes }));
  };

  const clearProject = () => {
    apply(() => clearProjectTray(serviceSlug ?? null));
  };

  return {
    tray,
    isOpen,
    setIsOpen,
    openTray: () => setIsOpen(true),
    closeTray: () => setIsOpen(false),
    addItem,
    addKit,
    removeItem,
    updateQty,
    updateItemNotes,
    setNotes,
    clearProject,
  };
}
