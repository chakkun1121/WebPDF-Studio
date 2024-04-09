import { render } from "@testing-library/react";
import Home from "./page";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("render without error", () => {
    render(<Home />);
  });
  it("renders the main section", () => {
    const { getByRole } = render(<Home />);
    const mainSection = getByRole("main");
    expect(mainSection).toBeInTheDocument();
  });

  it("renders the about article", () => {
    const { getByRole } = render(<Home />);
    const aboutArticle = getByRole("article");
    expect(aboutArticle).toBeInTheDocument();
  });
});
