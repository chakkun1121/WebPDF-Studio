import { render } from "@testing-library/react";
import Home from "./page";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("render without error", () => {
    render(<Home />);
  });

  it("renders the about article", () => {
    const { getByRole } = render(<Home />);
    const aboutArticle = getByRole("article");
    expect(aboutArticle).toBeInTheDocument();
  });
});
