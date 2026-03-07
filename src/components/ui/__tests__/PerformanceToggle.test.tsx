import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PerformanceToggle } from "@/components/ui/PerformanceToggle";

const mockSetManualPerformanceTier = vi.fn();
const mockUsePerformanceTier = vi.fn();

vi.mock("@/components/AdaptiveProvider", () => ({
  usePerformanceTier: () => mockUsePerformanceTier(),
}));

vi.mock("@/hooks/useAdaptivePerformance", () => ({
  setManualPerformanceTier: (tier: "full" | "lite") => mockSetManualPerformanceTier(tier),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...(Object.fromEntries(Object.entries(props).filter(([k]) => !['initial','animate','exit','transition'].includes(k))))}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe("PerformanceToggle", () => {
  beforeEach(() => {
    mockSetManualPerformanceTier.mockReset();
  });

  it("switches to lite when current tier is full", () => {
    mockUsePerformanceTier.mockReturnValue({
      tier: "full",
      isLite: false,
      score: 100,
    });

    render(<PerformanceToggle />);
    fireEvent.click(screen.getByRole("button"));

    expect(mockSetManualPerformanceTier).toHaveBeenCalledWith("lite");
  });

  it("switches to full when current tier is lite", () => {
    mockUsePerformanceTier.mockReturnValue({
      tier: "lite",
      isLite: true,
      score: 40,
    });

    render(<PerformanceToggle />);
    fireEvent.click(screen.getByRole("button"));

    expect(mockSetManualPerformanceTier).toHaveBeenCalledWith("full");
  });
});
