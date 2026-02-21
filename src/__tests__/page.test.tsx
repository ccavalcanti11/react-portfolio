import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders the portfolio heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /react portfolio/i })
    ).toBeInTheDocument();
  });

  it("mentions key technologies", () => {
    render(<Home />);
    const body = screen.getByText(/next\.js/i);
    expect(body).toBeInTheDocument();
    expect(screen.getByText(/graphql/i)).toBeInTheDocument();
    expect(screen.getByText(/apollo client/i)).toBeInTheDocument();
  });
});
