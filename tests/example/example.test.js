/**
 * @jest-environment jsdom
 */

import React from "react";

import { render, screen } from "@testing-library/react";
import Example from "../../pages/example/index";

describe("Example", () => {
  it("renders without crashing", () => {
    render(<Example />);
    expect(
      screen.getByRole("link", { name: "Return Home" })
    ).toBeInTheDocument();
  });
});
