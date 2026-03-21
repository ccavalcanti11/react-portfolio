"use client";

// ---------------------------------------------------------------------------
// CaseStudyFilters — filter bar for the showcase grid.
//
// Presentational component: all state lives in the parent (CaseStudyGrid via
// useShowcaseFilters). This component only calls the dispatch callbacks it
// receives as props, making it trivially testable and reusable.
//
// Accessibility notes:
//   - Filter button groups use role="group" + aria-label.
//   - Each button carries aria-pressed to communicate the active state to
//     screen readers without relying solely on visual styling.
//   - The search input has an explicit <label> (visually hidden via sr-only).
// ---------------------------------------------------------------------------

import type { Industry, ServiceType } from "@/lib/showcase/types";
import { INDUSTRY_LABELS, SERVICE_LABELS } from "@/lib/showcase/types";
import type { ShowcaseAction, ShowcaseFilterState } from "@/hooks/useShowcaseFilters";

interface CaseStudyFiltersProps {
  state: ShowcaseFilterState;
  dispatch: React.Dispatch<ShowcaseAction>;
  resultCount: number;
  totalCount: number;
  activeFilterCount: number;
}

const INDUSTRIES = Object.keys(INDUSTRY_LABELS) as Industry[];
const SERVICES = Object.keys(SERVICE_LABELS) as ServiceType[];

export function CaseStudyFilters({
  state,
  dispatch,
  resultCount,
  totalCount,
  activeFilterCount,
}: CaseStudyFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <label htmlFor="showcase-search" className="sr-only">
          Search case studies
        </label>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          id="showcase-search"
          type="search"
          placeholder="Search by client, project, or technology…"
          value={state.searchInput}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH", payload: e.target.value })
          }
          className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
        />
      </div>

      {/* Industry filter */}
      <div
        role="group"
        aria-label="Filter by industry"
        className="flex flex-wrap gap-2"
      >
        <FilterChip
          label="All industries"
          active={state.industry === null}
          onClick={() => dispatch({ type: "SET_INDUSTRY", payload: null })}
        />
        {INDUSTRIES.map((ind) => (
          <FilterChip
            key={ind}
            label={INDUSTRY_LABELS[ind]}
            active={state.industry === ind}
            onClick={() =>
              dispatch({
                type: "SET_INDUSTRY",
                payload: state.industry === ind ? null : ind,
              })
            }
          />
        ))}
      </div>

      {/* Service filter */}
      <div
        role="group"
        aria-label="Filter by service"
        className="flex flex-wrap gap-2"
      >
        <FilterChip
          label="All services"
          active={state.service === null}
          onClick={() => dispatch({ type: "SET_SERVICE", payload: null })}
        />
        {SERVICES.map((svc) => (
          <FilterChip
            key={svc}
            label={SERVICE_LABELS[svc]}
            active={state.service === svc}
            onClick={() =>
              dispatch({
                type: "SET_SERVICE",
                payload: state.service === svc ? null : svc,
              })
            }
          />
        ))}
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {activeFilterCount > 0 ? (
            <>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {resultCount}
              </span>{" "}
              of {totalCount} case{totalCount !== 1 ? " studies" : " study"}
            </>
          ) : (
            <>
              {totalCount} case {totalCount !== 1 ? "studies" : "study"}
            </>
          )}
        </p>

        {activeFilterCount > 0 && (
          <button
            onClick={() => dispatch({ type: "CLEAR" })}
            className="text-sm font-medium text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-white"
          >
            Clear filters ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "rounded-full px-3.5 py-1 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          : "rounded-full px-3.5 py-1 text-sm font-medium border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white"
      }
    >
      {label}
    </button>
  );
}
