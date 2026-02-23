import { render, screen } from "@testing-library/react";
import { RepositoryCard } from "@/components/github/RepositoryCard";
import type { GitHubRepository } from "@/lib/github/types";

const THREE_DAYS_AGO = new Date(
  Date.now() - 3 * 24 * 60 * 60 * 1000
).toISOString();

const baseRepo: GitHubRepository = {
  id: "repo-1",
  name: "awesome-project",
  description: "A very cool open-source project",
  url: "https://github.com/user/awesome-project",
  stargazerCount: 42,
  forkCount: 7,
  isArchived: false,
  primaryLanguage: { name: "TypeScript", color: "#3178c6" },
  updatedAt: THREE_DAYS_AGO,
};

describe("RepositoryCard", () => {
  it("renders the repository name", () => {
    render(<RepositoryCard repo={baseRepo} />);
    expect(screen.getByText("awesome-project")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<RepositoryCard repo={baseRepo} />);
    expect(
      screen.getByText("A very cool open-source project")
    ).toBeInTheDocument();
  });

  it("renders the primary language", () => {
    render(<RepositoryCard repo={baseRepo} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the star count", () => {
    render(<RepositoryCard repo={baseRepo} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders the fork count", () => {
    render(<RepositoryCard repo={baseRepo} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("links to the GitHub repository URL", () => {
    render(<RepositoryCard repo={baseRepo} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/user/awesome-project"
    );
  });

  it("opens the link in a new tab", () => {
    render(<RepositoryCard repo={baseRepo} />);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("does not render an archived badge for active repos", () => {
    render(<RepositoryCard repo={baseRepo} />);
    expect(screen.queryByText("archived")).not.toBeInTheDocument();
  });

  it("shows an archived badge for archived repos", () => {
    render(<RepositoryCard repo={{ ...baseRepo, isArchived: true }} />);
    expect(screen.getByText("archived")).toBeInTheDocument();
  });

  it("omits description when null", () => {
    render(<RepositoryCard repo={{ ...baseRepo, description: null }} />);
    expect(
      screen.queryByText("A very cool open-source project")
    ).not.toBeInTheDocument();
  });

  it("omits star count when zero", () => {
    render(<RepositoryCard repo={{ ...baseRepo, stargazerCount: 0 }} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
