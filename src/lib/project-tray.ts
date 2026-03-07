import type {
  CatalogItem,
  ProjectTrayItem,
  ProjectTrayRange,
  ProjectTrayState,
  SolutionKit,
} from "@/types";

export const PROJECT_TRAY_STORAGE_KEY = "electromax-project-v1";

export function createEmptyProjectTrayState(serviceSlug: string | null = null): ProjectTrayState {
  return {
    serviceSlug,
    items: [],
    selectedKitIds: [],
    notes: "",
    estimatedRange: null,
    updatedAt: null,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeQty(qty: number | undefined) {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.round(Number(qty)));
}

function itemRange(item: ProjectTrayItem): ProjectTrayRange | null {
  const qty = normalizeQty(item.qty);
  const min = typeof item.priceMin === "number" ? item.priceMin * qty : 0;

  if (item.priceType === "request") {
    return null;
  }
  if (item.priceType === "fixed") {
    return { min, max: min, currency: item.currency ?? "RUB" };
  }
  if (item.priceType === "range") {
    const max = typeof item.priceMax === "number" ? item.priceMax * qty : min;
    return { min, max, currency: item.currency ?? "RUB" };
  }
  const inferredMax =
    typeof item.priceMax === "number" ? item.priceMax * qty : Math.round(min * 1.2);
  return { min, max: inferredMax, currency: item.currency ?? "RUB" };
}

export function deriveEstimatedRange(items: ProjectTrayItem[]): ProjectTrayRange | null {
  let min = 0;
  let max = 0;
  let hasPriced = false;

  for (const item of items) {
    const range = itemRange(item);
    if (!range) continue;
    hasPriced = true;
    min += range.min;
    max += range.max;
  }

  if (!hasPriced) return null;
  return { min, max, currency: "RUB" };
}

export function touchState(state: ProjectTrayState): ProjectTrayState {
  return {
    ...state,
    estimatedRange: deriveEstimatedRange(state.items),
    updatedAt: nowIso(),
  };
}

export function readProjectTrayState(storage: Storage | null): ProjectTrayState | null {
  if (!storage) return null;

  try {
    const raw = storage.getItem(PROJECT_TRAY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProjectTrayState>;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) return null;

    return touchState({
      serviceSlug: typeof parsed.serviceSlug === "string" ? parsed.serviceSlug : null,
      items: parsed.items.filter(Boolean).map((item) => ({
        ...item,
        qty: normalizeQty(item.qty),
      })) as ProjectTrayItem[],
      selectedKitIds: Array.isArray(parsed.selectedKitIds)
        ? parsed.selectedKitIds.filter((v): v is string => typeof v === "string")
        : [],
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
      estimatedRange: null,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    });
  } catch {
    return null;
  }
}

export function writeProjectTrayState(storage: Storage | null, state: ProjectTrayState) {
  if (!storage) return;
  storage.setItem(PROJECT_TRAY_STORAGE_KEY, JSON.stringify(state));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("project-tray-updated"));
  }
}

export function createTrayItemFromCatalogItem(args: {
  serviceSlug: string;
  item: CatalogItem;
  sourceKind?: ProjectTrayItem["sourceKind"];
  sourceId?: string;
  sourceLabel?: string;
}): ProjectTrayItem {
  const { serviceSlug, item } = args;
  return {
    id: `${args.sourceKind ?? "catalog"}:${args.sourceId ?? item.id}:${item.itemCode}`,
    serviceSlug,
    itemCode: item.itemCode,
    itemName: item.name,
    unit: item.unit,
    qty: normalizeQty(item.addToProjectDefaultQty),
    priceType: item.priceType,
    priceMin: item.priceMin,
    priceMax: item.priceMax,
    currency: item.currency ?? "RUB",
    category: item.category,
    sourceKind: args.sourceKind ?? "catalog",
    sourceId: args.sourceId ?? item.id,
    sourceLabel: args.sourceLabel ?? item.name,
  };
}

export function addOrMergeTrayItem(
  state: ProjectTrayState,
  nextItem: ProjectTrayItem,
): ProjectTrayState {
  const existingIndex = state.items.findIndex(
    (item) => item.serviceSlug === nextItem.serviceSlug && item.itemCode === nextItem.itemCode,
  );

  const items = [...state.items];
  if (existingIndex >= 0) {
    const current = items[existingIndex];
    items[existingIndex] = { ...current, qty: normalizeQty(current.qty + nextItem.qty) };
  } else {
    items.push(nextItem);
  }

  return touchState({
    ...state,
    serviceSlug: nextItem.serviceSlug,
    items,
  });
}

export function removeTrayItem(state: ProjectTrayState, itemId: string): ProjectTrayState {
  return touchState({
    ...state,
    items: state.items.filter((item) => item.id !== itemId),
  });
}

export function updateTrayItemQty(
  state: ProjectTrayState,
  itemId: string,
  qty: number,
): ProjectTrayState {
  return touchState({
    ...state,
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, qty: normalizeQty(qty) } : item,
    ),
  });
}

export function updateTrayItemParams(
  state: ProjectTrayState,
  itemId: string,
  patch: Pick<ProjectTrayItem, "comment" | "params">,
): ProjectTrayState {
  return touchState({
    ...state,
    items: state.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
  });
}

export function addKitToTray(args: {
  state: ProjectTrayState;
  serviceSlug: string;
  kit: SolutionKit;
  itemsByCode: Map<string, CatalogItem>;
}): ProjectTrayState {
  let next = { ...args.state };

  for (const code of args.kit.includedItemCodes) {
    const catalogItem = args.itemsByCode.get(code);
    if (!catalogItem) continue;
    next = addOrMergeTrayItem(
      next,
      createTrayItemFromCatalogItem({
        serviceSlug: args.serviceSlug,
        item: catalogItem,
        sourceKind: "kit",
        sourceId: args.kit.id,
        sourceLabel: args.kit.name,
      }),
    );
  }

  const selectedKitIds = Array.from(new Set([...next.selectedKitIds, args.kit.id]));
  return touchState({ ...next, selectedKitIds, serviceSlug: args.serviceSlug });
}

export function clearProjectTray(serviceSlug: string | null = null): ProjectTrayState {
  return touchState(createEmptyProjectTrayState(serviceSlug));
}

export function formatProjectTrayRange(range: ProjectTrayRange | null) {
  if (!range) return "Ориентир суммы появится после выбора позиций";
  if (range.min === range.max) return `${range.min.toLocaleString("ru-RU")} ₽`;
  return `${range.min.toLocaleString("ru-RU")}–${range.max.toLocaleString("ru-RU")} ₽`;
}
