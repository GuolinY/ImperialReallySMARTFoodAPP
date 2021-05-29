/**
 * @jest-environment jsdom
 */

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