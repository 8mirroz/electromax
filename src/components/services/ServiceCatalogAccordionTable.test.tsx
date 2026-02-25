import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import type { ServiceCatalogSection } from "@/types";
import { ServiceCatalogAccordionTable } from "@/components/services/ServiceCatalogAccordionTable";

const sections: ServiceCatalogSection[] = [
  {
    id: "s1",
    title: "Основные работы",
    description: "Ориентиры",
    items: [
      {
        id: "i1",
        itemCode: "APS-AUDIT",
        category: "Этапы проекта",
        name: "Аудит объекта",
        unit: "выезд",
        priceType: "range",
        priceMin: 10000,
        priceMax: 15000,
        currency: "RUB",
        comment: "Выезд инженера",
        includes: ["Осмотр", "Чек-лист"],
        excludes: ["Монтаж"],
        priceDependsOn: ["Площадь"],
      },
    ],
  },
];

describe("ServiceCatalogAccordionTable", () => {
  it("renders row, expands details and adds item to project", { timeout: 10000 }, () => {
    const onAddItem = vi.fn();

    render(<ServiceCatalogAccordionTable sections={sections} onAddItem={onAddItem} />);

    expect(screen.getByText("Аудит объекта")).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /добавить в проект/i }));
    expect(onAddItem).toHaveBeenCalled();
    const [itemArg, optionsArg, priceArg] = onAddItem.mock.calls[0] ?? [];
    expect(itemArg).toEqual(sections[0].items[0]);
    expect(optionsArg).toEqual({});
    expect(priceArg).toBeUndefined();

    act(() => {
      screen.getByTestId("catalog-row-APS-AUDIT").setAttribute("open", "");
    });
    expect(screen.getByText("Что включено")).toBeInTheDocument();
    expect(screen.getByText(/Осмотр/)).toBeInTheDocument();
  });
});
