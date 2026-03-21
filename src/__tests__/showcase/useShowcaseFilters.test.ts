// ---------------------------------------------------------------------------
// useShowcaseFilters — reducer + hook integration tests
//
// The reducer is a pure function, so we test it directly without React:
//   filterReducer(state, action) → newState
//
// The hook is tested via renderHook so we can verify the memoised derived
// state (visibleStudies, activeFilterCount) reacts correctly to dispatches.
// ---------------------------------------------------------------------------

import { renderHook, act } from "@testing-library/react";
import {
  filterReducer,
  useShowcaseFilters,
} from "@/hooks/useShowcaseFilters";
import type { ShowcaseFilterState } from "@/hooks/useShowcaseFilters";
import type { CaseStudySummary } from "@/lib/showcase/types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const INITIAL: ShowcaseFilterState = {
  industry: null,
  service: null,
  searchInput: "",
};

const makeStudy = (
  overrides: Partial<CaseStudySummary> = {},
): CaseStudySummary => ({
  id: "cs-001",
  slug: "test-study",
  client: "ACME Corp",
  projectTitle: "Test Project",
  excerpt: "A test case study.",
  industry: "retail",
  service: "ux-design",
  techStack: ["React", "TypeScript"],
  year: 2025,
  coverGradient: "linear-gradient(135deg, #000 0%, #fff 100%)",
  metrics: [],
  seo: null,
  ...overrides,
});

const STUDIES: CaseStudySummary[] = [
  makeStudy({ id: "cs-001", client: "RetailNow", industry: "retail", service: "digital-transformation", techStack: ["Next.js", "TypeScript"] }),
  makeStudy({ id: "cs-002", client: "HealthBridge", industry: "healthcare", service: "ux-design", techStack: ["React", "Storybook"] }),
  makeStudy({ id: "cs-003", client: "FinEdge", industry: "finance", service: "product-engineering", techStack: ["React", "D3.js"] }),
];

// ---------------------------------------------------------------------------
// filterReducer — SET_INDUSTRY
// ---------------------------------------------------------------------------

describe("filterReducer — SET_INDUSTRY", () => {
  it("sets the industry filter", () => {
    const next = filterReducer(INITIAL, { type: "SET_INDUSTRY", payload: "retail" });
    expect(next.industry).toBe("retail");
  });

  it("clears the industry filter when payload is null", () => {
    const withFilter: ShowcaseFilterState = { ...INITIAL, industry: "retail" };
    const next = filterReducer(withFilter, { type: "SET_INDUSTRY", payload: null });
    expect(next.industry).toBeNull();
  });

  it("does not mutate other filter fields", () => {
    const withService: ShowcaseFilterState = { ...INITIAL, service: "ux-design" };
    const next = filterReducer(withService, { type: "SET_INDUSTRY", payload: "finance" });
    expect(next.service).toBe("ux-design");
    expect(next.searchInput).toBe("");
  });
});

// ---------------------------------------------------------------------------
// filterReducer — SET_SERVICE
// ---------------------------------------------------------------------------

describe("filterReducer — SET_SERVICE", () => {
  it("sets the service filter", () => {
    const next = filterReducer(INITIAL, { type: "SET_SERVICE", payload: "ux-design" });
    expect(next.service).toBe("ux-design");
  });

  it("clears the service filter when payload is null", () => {
    const withFilter: ShowcaseFilterState = { ...INITIAL, service: "ux-design" };
    const next = filterReducer(withFilter, { type: "SET_SERVICE", payload: null });
    expect(next.service).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// filterReducer — SET_SEARCH
// ---------------------------------------------------------------------------

describe("filterReducer — SET_SEARCH", () => {
  it("updates the searchInput field", () => {
    const next = filterReducer(INITIAL, { type: "SET_SEARCH", payload: "react" });
    expect(next.searchInput).toBe("react");
  });

  it("does not modify other fields", () => {
    const withFilters: ShowcaseFilterState = {
      industry: "retail",
      service: "ux-design",
      searchInput: "",
    };
    const next = filterReducer(withFilters, { type: "SET_SEARCH", payload: "next" });
    expect(next.industry).toBe("retail");
    expect(next.service).toBe("ux-design");
  });
});

// ---------------------------------------------------------------------------
// filterReducer — CLEAR
// ---------------------------------------------------------------------------

describe("filterReducer — CLEAR", () => {
  it("resets all filters to their initial values", () => {
    const dirty: ShowcaseFilterState = {
      industry: "finance",
      service: "product-engineering",
      searchInput: "react query",
    };
    const next = filterReducer(dirty, { type: "CLEAR" });
    expect(next.industry).toBeNull();
    expect(next.service).toBeNull();
    expect(next.searchInput).toBe("");
  });
});

// ---------------------------------------------------------------------------
// useShowcaseFilters — derived state
// ---------------------------------------------------------------------------

describe("useShowcaseFilters — visibleStudies", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("returns all studies when no filters are active", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    expect(result.current.visibleStudies).toHaveLength(3);
  });

  it("filters by industry", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_INDUSTRY", payload: "retail" });
    });
    expect(result.current.visibleStudies).toHaveLength(1);
    expect(result.current.visibleStudies[0].id).toBe("cs-001");
  });

  it("filters by service", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_SERVICE", payload: "ux-design" });
    });
    expect(result.current.visibleStudies).toHaveLength(1);
    expect(result.current.visibleStudies[0].id).toBe("cs-002");
  });

  it("filters by both industry and service (AND logic)", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_INDUSTRY", payload: "finance" });
      result.current.dispatch({ type: "SET_SERVICE", payload: "ux-design" });
    });
    // finance × ux-design — no study matches both
    expect(result.current.visibleStudies).toHaveLength(0);
  });

  it("filters by search query (case-insensitive, matches client name)", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_SEARCH", payload: "finedge" });
    });
    // Debounce: advance timers past 300 ms delay
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.visibleStudies).toHaveLength(1);
    expect(result.current.visibleStudies[0].id).toBe("cs-003");
  });

  it("filters by search query matching a technology", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_SEARCH", payload: "Storybook" });
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.visibleStudies).toHaveLength(1);
    expect(result.current.visibleStudies[0].id).toBe("cs-002");
  });

  it("returns empty array when no study matches the search", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_SEARCH", payload: "xyzzy-nonexistent" });
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.visibleStudies).toHaveLength(0);
  });

  it("restores all studies after CLEAR", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_INDUSTRY", payload: "retail" });
    });
    expect(result.current.visibleStudies).toHaveLength(1);
    act(() => {
      result.current.dispatch({ type: "CLEAR" });
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.visibleStudies).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// useShowcaseFilters — activeFilterCount
// ---------------------------------------------------------------------------

describe("useShowcaseFilters — activeFilterCount", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("is 0 when no filters are active", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    expect(result.current.activeFilterCount).toBe(0);
  });

  it("increments by 1 for each active filter dimension", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_INDUSTRY", payload: "retail" });
    });
    expect(result.current.activeFilterCount).toBe(1);

    act(() => {
      result.current.dispatch({ type: "SET_SERVICE", payload: "digital-transformation" });
    });
    expect(result.current.activeFilterCount).toBe(2);

    act(() => {
      result.current.dispatch({ type: "SET_SEARCH", payload: "next" });
    });
    act(() => { jest.advanceTimersByTime(400); });
    expect(result.current.activeFilterCount).toBe(3);
  });

  it("decrements when a filter is cleared individually", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_INDUSTRY", payload: "retail" });
      result.current.dispatch({ type: "SET_SERVICE", payload: "ux-design" });
    });
    expect(result.current.activeFilterCount).toBe(2);
    act(() => {
      result.current.dispatch({ type: "SET_INDUSTRY", payload: null });
    });
    expect(result.current.activeFilterCount).toBe(1);
  });

  it("resets to 0 after CLEAR", () => {
    const { result } = renderHook(() => useShowcaseFilters(STUDIES));
    act(() => {
      result.current.dispatch({ type: "SET_INDUSTRY", payload: "finance" });
      result.current.dispatch({ type: "SET_SERVICE", payload: "product-engineering" });
    });
    act(() => {
      result.current.dispatch({ type: "CLEAR" });
    });
    act(() => { jest.advanceTimersByTime(400); });
    expect(result.current.activeFilterCount).toBe(0);
  });
});
