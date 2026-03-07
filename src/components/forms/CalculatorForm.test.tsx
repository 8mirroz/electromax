import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CalculatorForm } from "@/components/forms/CalculatorForm";

describe("CalculatorForm", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_CONSENT_MODE", "disabled");
  });

  it("shows validation error for invalid phone", { timeout: 15000 }, async () => {
    render(
      <CalculatorForm
        basePrice={450}
        complexityMap={{ office: 1, warehouse: 1.2, industrial: 1.5, mall: 1.3 }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/\+7/), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /get specification/i }));

    await waitFor(() => {
      expect(screen.getByText("Введите номер в формате +7 (999) 123-45-67")).toBeInTheDocument();
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows network error on fetch failure", { timeout: 15000 }, async () => {
    fetchMock.mockRejectedValueOnce(new Error("Ошибка сети. Попробуйте позже."));

    render(
      <CalculatorForm
        basePrice={450}
        complexityMap={{ office: 1, warehouse: 1.2, industrial: 1.5, mall: 1.3 }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/\+7/), {
      target: { value: "+7 (999) 123-45-67" },
    });
    fireEvent.click(screen.getByRole("button", { name: /get specification/i }));

    await waitFor(
      () => {
        expect(screen.getByRole("alert")).toHaveTextContent("Ошибка сети. Попробуйте позже.");
      },
      { timeout: 12000 },
    );
  });

  it("submits and shows success state", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "ok" }),
    });
    vi.stubEnv("NEXT_PUBLIC_YANDEX_METRIKA_ID", "123456");
    window.ym = vi.fn();

    render(
      <CalculatorForm
        basePrice={450}
        complexityMap={{ office: 1, warehouse: 1.2, industrial: 1.5, mall: 1.3 }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/\+7/), {
      target: { value: "+7 (999) 123-45-67" },
    });
    fireEvent.click(screen.getByRole("button", { name: /get specification/i }));

    await waitFor(() => {
      expect(screen.getByText(/протокол инициирован/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/leads",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(window.ym).toHaveBeenCalledWith(
      123456,
      "reachGoal",
      "lead_form_submitted",
      expect.objectContaining({
        source: "calculator_form",
      }),
    );
    expect(window.ym).toHaveBeenCalledWith(
      123456,
      "reachGoal",
      "calculator_complete",
      expect.any(Object),
    );
  });
});
