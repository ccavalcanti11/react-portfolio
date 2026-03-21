// ---------------------------------------------------------------------------
// CaseStudyCard — render tests
//
// Verifies the card renders all expected fields and exposes correct
// accessibility attributes. Navigation is handled by Next.js <Link>, so we
// test the rendered href rather than simulating actual routing.
// ---------------------------------------------------------------------------

import { render, screen } from "@testing-library/react";
import { CaseStudyCard } from "@/components/showcase/CaseStudyCard";
import type { CaseStudySummary } from "@/lib/showcase/types";

// ---------------------------------------------------------------------------
// Mock Next.js Link — jsdom does not have a Next.js router, so Link is
// rendered as a plain <a> to keep tests deterministic and free of router
// setup boilerplate. This is the same pattern used throughout the project.
// ---------------------------------------------------------------------------
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const baseStudy: CaseStudySummary = {
  id: "cs-001",
  slug: "retailnow-personalization-engine",
  client: "RetailNow",
  projectTitle: "Personalization Engine",
  excerpt: "Rebuilt a monolithic e-commerce storefront into a headless Next.js platform.",
  industry: "retail",
  service: "digital-transformation",
  techStack: ["Next.js", "React", "Contentful", "TypeScript", "Tailwind CSS", "Vercel"],
  year: 2025,
  coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  metrics: [
    { label: "Conversion rate", value: "+34%", sentiment: "positive" },
    { label: "Lighthouse score", value: "98", sentiment: "positive" },
    { label: "LCP", value: "1.2 s", delta: "−68%", sentiment: "positive" },
  ],
  seo: {
    metaTitle: "RetailNow Personalization Engine — Case Study",
    metaDescription: "A description.",
  },
};

function renderCard(study = baseStudy, index = 0) {
  return render(<CaseStudyCard study={study} index={index} />);
}

// ---------------------------------------------------------------------------
// Render — core fields
// ---------------------------------------------------------------------------

describe("CaseStudyCard — rendering", () => {
  it("renders the project title", () => {
    renderCard();
    expect(screen.getByText("Personalization Engine")).toBeInTheDocument();
  });

  it("renders the client name", () => {
    renderCard();
    expect(screen.getByText(/RetailNow/)).toBeInTheDocument();
  });

  it("renders the excerpt", () => {
    renderCard();
    expect(
      screen.getByText(
        "Rebuilt a monolithic e-commerce storefront into a headless Next.js platform.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the year", () => {
    renderCard();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Render — badges
// ---------------------------------------------------------------------------

describe("CaseStudyCard — category badges", () => {
  it("renders the industry badge label", () => {
    renderCard();
    expect(screen.getByText("Retail")).toBeInTheDocument();
  });

  it("renders the service badge label", () => {
    renderCard();
    expect(screen.getByText("Digital Transformation")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Render — metrics
// ---------------------------------------------------------------------------

describe("CaseStudyCard — metrics", () => {
  it("renders metric values", () => {
    renderCard();
    expect(screen.getByText("+34%")).toBeInTheDocument();
    expect(screen.getByText("98")).toBeInTheDocument();
    expect(screen.getByText("1.2 s")).toBeInTheDocument();
  });

  it("renders metric labels", () => {
    renderCard();
    expect(screen.getByText("Conversion rate")).toBeInTheDocument();
    expect(screen.getByText("Lighthouse score")).toBeInTheDocument();
  });

  it("renders the metric delta when present", () => {
    renderCard();
    expect(screen.getByText("−68%")).toBeInTheDocument();
  });

  it("renders no metrics section when metrics array is empty", () => {
    renderCard({ ...baseStudy, metrics: [] });
    expect(screen.queryByText("+34%")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Render — tech stack
// ---------------------------------------------------------------------------

describe("CaseStudyCard — tech stack", () => {
  it("renders up to 4 tech tags", () => {
    renderCard();
    // techStack has 6 entries; only 4 should appear as TechTag pills
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Contentful")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("shows a '+N more' label when tech stack exceeds 4 entries", () => {
    renderCard();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("shows no overflow label when tech stack has 4 or fewer entries", () => {
    renderCard({ ...baseStudy, techStack: ["React", "TypeScript", "Next.js"] });
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

describe("CaseStudyCard — navigation", () => {
  it("links to the correct detail page slug", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/showcase/retailnow-personalization-engine");
  });

  it("carries an accessible aria-label combining client and project title", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "RetailNow — Personalization Engine");
  });
});
