"use client";

// ---------------------------------------------------------------------------
// useShowcaseFilters — multi-dimensional filter state for the case-study grid.
//
// Design decisions:
//
//   useReducer (not useState × 3)
//     A single reducer handles all filter actions atomically. The discriminated
//     union `ShowcaseAction` makes it impossible to dispatch an unknown action
//     type; the `default: never` exhaustiveness check catches missing cases at
//     compile time rather than at runtime.
//
//   useMemo for derived state
//     `visibleStudies` is computed from `allStudies` + filter state. Memoising
//     it avoids re-filtering on every re-render unrelated to filters (e.g. a
//     parent re-render from an unrelated cause).
//
//   useDebounce for search
//     Raw keystrokes update `state.searchInput` immediately (good for UX).
//     The filter logic runs against `debouncedSearch` so the list only
//     recomputes 300 ms after the user stops typing — no input lag, no
//     unnecessary renders.
//
// Extension note:
//   URL-synced filters (shareable links) can be layered on top by reading
//   initial state from `useSearchParams()` and writing back via `useRouter`
//   in a `useEffect` that depends on the filter state.
// ---------------------------------------------------------------------------

import { useReducer, useMemo } from "react";
import { useDebounce } from "./useDebounce";
import type { CaseStudySummary, Industry, ServiceType } from "@/lib/showcase/types";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface ShowcaseFilterState {
  industry: Industry | null;
  service: ServiceType | null;
  /** Raw value of the search input — debounced before filtering. */
  searchInput: string;
}

// ---------------------------------------------------------------------------
// Discriminated union of all possible actions
// ---------------------------------------------------------------------------

export type ShowcaseAction =
  | { type: "SET_INDUSTRY"; payload: Industry | null }
  | { type: "SET_SERVICE"; payload: ServiceType | null }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "CLEAR" };

// ---------------------------------------------------------------------------
// Pure reducer — trivially unit-testable without any React machinery
// ---------------------------------------------------------------------------

const INITIAL_STATE: ShowcaseFilterState = {
  industry: null,
  service: null,
  searchInput: "",
};

export function filterReducer(
  state: ShowcaseFilterState,
  action: ShowcaseAction,
): ShowcaseFilterState {
  switch (action.type) {
    case "SET_INDUSTRY":
      return { ...state, industry: action.payload };
    case "SET_SERVICE":
      return { ...state, service: action.payload };
    case "SET_SEARCH":
      return { ...state, searchInput: action.payload };
    case "CLEAR":
      return INITIAL_STATE;
    default: {
      // Exhaustiveness check: if a new action type is added to ShowcaseAction
      // without a corresponding case, TypeScript raises a compile-time error.
      const _exhaustive: never = action;
      return state;
    }
  }
}

// ---------------------------------------------------------------------------
// Hook return type — explicit interface keeps consumers type-safe
// ---------------------------------------------------------------------------

export interface UseShowcaseFiltersReturn {
  state: ShowcaseFilterState;
  /** Debounced search value used by the filter logic (lags searchInput by 300 ms). */
  debouncedSearch: string;
  dispatch: React.Dispatch<ShowcaseAction>;
  /** Case studies that pass every active filter — memoised. */
  visibleStudies: CaseStudySummary[];
  /** Number of active filters — used to show/hide the clear button. */
  activeFilterCount: number;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useShowcaseFilters(
  allStudies: CaseStudySummary[],
): UseShowcaseFiltersReturn {
  const [state, dispatch] = useReducer(filterReducer, INITIAL_STATE);
  const debouncedSearch = useDebounce(state.searchInput, 300);

  const visibleStudies = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    return allStudies.filter((study) => {
      if (state.industry !== null && study.industry !== state.industry) {
        return false;
      }
      if (state.service !== null && study.service !== state.service) {
        return false;
      }
      if (q) {
        const haystack = [
          study.client,
          study.projectTitle,
          study.excerpt,
          ...study.techStack,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allStudies, state.industry, state.service, debouncedSearch]);

  const activeFilterCount = [
    state.industry,
    state.service,
    debouncedSearch.trim() || null,
  ].filter(Boolean).length;

  return { state, debouncedSearch, dispatch, visibleStudies, activeFilterCount };
}
