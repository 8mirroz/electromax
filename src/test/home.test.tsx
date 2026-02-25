import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Home from "@/app/page";

it("renders the main heading", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { level: 1, name: /Инженерные системы/i }),
  ).toBeInTheDocument();
});
