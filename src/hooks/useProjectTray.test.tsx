import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { CatalogItem, SolutionKit } from "@/types";
import { PROJECT_TRAY_STORAGE_KEY } from "@/lib/project-tray";
import { useProjectTray } from "@/hooks/useProjectTray";

const catalogItems: CatalogItem[] = [
  {
    id: "i1",
    itemCode: "APS-AUDIT",
    category: "Этапы проекта",
    name: "Аудит объекта",
    unit: "выезд",
    priceType: "from",
    priceMin: 15000,
    currency: "RUB",
    addToProjectDefaultQty: 1,
  },
  {
    id: "i2",
    itemCode: "APS-INSTALL",
    category: "Этапы проекта",
    name: "Монтаж",
    unit: "проект",
    priceType: "range",
    priceMin: 50000,
    priceMax: 90000,
    currency: "RUB",
    addToProjectDefaultQty: 1,
  },
];

const kit: SolutionKit = {
  id: "kit1",
  name: "Старт",
  useCase: "Проверка",
  targetObject: "офис",
  bullets: ["Аудит", "Монтаж"],
  includedItemCodes: ["APS-AUDIT", "APS-INSTALL"],
  durationText: "3 дня",
  ctaLabel: "Добавить в проект",
};

describe("useProjectTray", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds, updates, removes and clears items with persistence", async () => {
    const { result } = renderHook(() => useProjectTray({ serviceSlug: "aps", catalogItems }));

    await waitFor(() => {
      expect(result.current.tray.serviceSlug).toBe("aps");
    });

    act(() => {
      result.current.addItem(catalogItems[0]);
    });

    await waitFor(() => {
      expect(result.current.tray.items).toHaveLength(1);
    });

    expect(result.current.tray.estimatedRange?.min).toBeGreaterThan(0);
    expect(window.localStorage.getItem(PROJECT_TRAY_STORAGE_KEY)).toContain("APS-AUDIT");

    const itemId = result.current.tray.items[0].id;

    act(() => {
      result.current.updateQty(itemId, 3);
      result.current.updateItemNotes(itemId, "ночной допуск");
      result.current.setNotes("Объект на 2 этаже");
    });

    await waitFor(() => {
      expect(result.current.tray.items[0].qty).toBe(3);
      expect(result.current.tray.items[0].comment).toBe("ночной допуск");
      expect(result.current.tray.notes).toBe("Объект на 2 этаже");
    });

    act(() => {
      result.current.removeItem(itemId);
    });

    await waitFor(() => {
      expect(result.current.tray.items).toHaveLength(0);
    });

    act(() => {
      result.current.addKit(kit);
    });

    await waitFor(() => {
      expect(result.current.tray.items).toHaveLength(2);
      expect(result.current.tray.selectedKitIds).toContain("kit1");
    });

    act(() => {
      result.current.clearProject();
    });

    await waitFor(() => {
      expect(result.current.tray.items).toHaveLength(0);
      expect(result.current.tray.selectedKitIds).toHaveLength(0);
    });
  });

  it("rehydrates from localStorage", async () => {
    window.localStorage.setItem(
      PROJECT_TRAY_STORAGE_KEY,
      JSON.stringify({
        serviceSlug: "aps",
        items: [
          {
            id: "catalog:i1:APS-AUDIT",
            serviceSlug: "aps",
            itemCode: "APS-AUDIT",
            itemName: "Аудит объекта",
            unit: "выезд",
            qty: 2,
            priceType: "from",
            priceMin: 15000,
            currency: "RUB",
            category: "Этапы проекта",
            sourceKind: "catalog",
            sourceId: "i1",
          },
        ],
        selectedKitIds: [],
        notes: "предзаполнено",
        updatedAt: new Date().toISOString(),
      }),
    );

    const { result } = renderHook(() => useProjectTray({ serviceSlug: "aps", catalogItems }));

    await waitFor(() => {
      expect(result.current.tray.items[0]?.qty).toBe(2);
      expect(result.current.tray.notes).toBe("предзаполнено");
    });
  });
});
