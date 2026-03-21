// ---------------------------------------------------------------------------
// MetricPill — render tests
//
// Covers both size variants ("compact" and "full"), sentiment colour classes,
// and the optional delta label.
// ---------------------------------------------------------------------------

import { render, screen } from "@testing-library/react";
import { MetricPill } from "@/components/showcase/MetricPill";
import type { CaseStudyMetric } from "@/lib/showcase/types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const positiveMetric: CaseStudyMetric = {
  label: "Conversion rate",
  value: "+34%",
  delta: "vs prior quarter",
  sentiment: "positive",
};

const neutralMetric: CaseStudyMetric = {
  label: "Pages indexed",
  value: "1,240",
  sentiment: "neutral",
};

// ---------------------------------------------------------------------------
// Content rendering
// ---------------------------------------------------------------------------

describe("MetricPill — content", () => {
  it("renders the metric value", () => {
    render(<MetricPill metric={positiveMetric} />);
    expect(screen.getByText("+34%")).toBeInTheDocument();
  });

  it("renders the metric label", () => {
    render(<MetricPill metric={positiveMetric} />);
    expect(screen.getByText("Conversion rate")).toBeInTheDocument();
  });

  it("renders the delta text when provided", () => {
    render(<MetricPill metric={positiveMetric} />);
    expect(screen.getByText("vs prior quarter")).toBeInTheDocument();
  });

  it("does not render a delta element when delta is absent", () => {
    render(<MetricPill metric={neutralMetric} />);
    // neutral metric has no delta field
    expect(screen.queryByText("vs prior quarter")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("MetricPill — accessibility", () => {
  it("wraps content in a group with a descriptive aria-label (with delta)", () => {
    render(<MetricPill metric={positiveMetric} />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute(
      "aria-label",
      "Conversion rate: +34% (vs prior quarter)",
    );
  });

  it("wraps content in a group with a descriptive aria-label (no delta)", () => {
    render(<MetricPill metric={neutralMetric} />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-label", "Pages indexed: 1,240");
  });
});

// ---------------------------------------------------------------------------
// Sentiment — spot-check that the correct colour token appears in className
// ---------------------------------------------------------------------------

describe("MetricPill — sentiment classes", () => {
  it("applies emerald classes for positive sentiment", () => {
    const { container } = render(<MetricPill metric={positiveMetric} />);
    const pill = container.firstChild as HTMLElement;
    expect(pill.className).toContain("emerald");
  });

  it("applies zinc classes for neutral sentiment", () => {
    const { container } = render(<MetricPill metric={neutralMetric} />);
    const pill = container.firstChild as HTMLElement;
    expect(pill.className).toContain("zinc");
  });
});

// ---------------------------------------------------------------------------
// Size variant
// ---------------------------------------------------------------------------

describe("MetricPill — size prop", () => {
  it("defaults to compact size (text-lg value)", () => {
    const { container } = render(<MetricPill metric={positiveMetric} />);
    const valueSpan = container.querySelector("span");
    expect(valueSpan?.className).toContain("text-lg");
  });

  it("applies text-2xl to the value in full size", () => {
    const { container } = render(<MetricPill metric={positiveMetric} size="full" />);
    const valueSpan = container.querySelector("span");
    expect(valueSpan?.className).toContain("text-2xl");
  });
});
