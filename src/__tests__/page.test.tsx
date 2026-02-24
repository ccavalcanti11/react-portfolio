import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// next/navigation is used inside child components (e.g. Link)
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe("Home page (portfolio hub)", () => {
  it("renders the main hero heading", () => {
    render(<Home />);
    // The heading is split across two lines; getByRole matches the full text
    expect(
      screen.getByRole("heading", { name: /three projects/i })
    ).toBeInTheDocument();
  });

  it("renders all three project titles", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /github profile explorer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /dev blog/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /kanban board/i })
    ).toBeInTheDocument();
  });

  it("renders example GitHub profile links", () => {
    render(<Home />);
    expect(screen.getByText("@torvalds")).toBeInTheDocument();
    expect(screen.getByText("@gaearon")).toBeInTheDocument();
    expect(screen.getByText("@sindresorhus")).toBeInTheDocument();
  });

  it("renders live CTAs for completed projects", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: /explore a profile/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /read the blog/i })
    ).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    render(<Home />);
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });
});
