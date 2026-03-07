import { expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

it("exports a valid home component", () => {
  expect(typeof Home).toBe("function");
});
