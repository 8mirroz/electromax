import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

it("renders the main heading", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", {
      name: /to get started, edit the page\.tsx file/i,
    }),
  ).toBeInTheDocument();
});
