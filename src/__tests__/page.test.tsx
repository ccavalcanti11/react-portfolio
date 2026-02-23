import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// next/navigation is used inside SearchInput (useRouter)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe("Home page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /github profile explorer/i })
    ).toBeInTheDocument();
  });

  it("renders the search form", () => {
    render(<Home />);
    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search github username/i)
    ).toBeInTheDocument();
  });

  it("renders example profile links", () => {
    render(<Home />);
    expect(screen.getByText("@torvalds")).toBeInTheDocument();
    expect(screen.getByText("@gaearon")).toBeInTheDocument();
  });
});
