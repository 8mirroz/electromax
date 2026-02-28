"use client";

import { startTransition, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  serviceSlug: string;
  catalogItems: CatalogItem[];
}

export function useProjectTray({ serviceSlug, catalogItems }: UseProjectTrayOptions) {
  const [tray, setTray] = useState<ProjectTrayState>(() =>
    createEmptyProjectTrayState(serviceSlug),
  );
  const [isOpen, setIsOpen] = useState(false);
  const hasHydratedRef = useRef(false);

  const itemsByCode = new Map(catalogItems.map((item) => [item.itemCode, item]));

  useEffect(() => {
    const saved = readProjectTrayState(typeof window === "undefined" ? null : window.localStorage);
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate tray from persisted storage
      setTray(saved);
    } else {
      setTray(touchState(createEmptyProjectTrayState(serviceSlug)));
    }
    hasHydratedRef.current = true;
  }, [serviceSlug]);

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
    options?: Record<string, string>,
    calculatedPrice?: { min: number; max: number },
  ) => {
    apply((current) =>
      addOrMergeTrayItem(
        { ...current, serviceSlug },
        createTrayItemFromCatalogItem({ serviceSlug, item }),
      ),
    );
  };

  const addKit = (kit: SolutionKit) => {
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
    apply((current) => touchState({ ...current, serviceSlug, notes }));
  };

  const clearProject = () => {
    apply(() => clearProjectTray(serviceSlug));
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
