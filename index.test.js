/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Home from "./pages/index";

describe("App", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Welcome!" })
    ).toBeInTheDocument();
  });
});