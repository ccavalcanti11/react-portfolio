"use client";

// ---------------------------------------------------------------------------
// CaseStudyGrid — client component that owns filter state via useShowcaseFilters.
//
// Pattern:
//   - The parent page (server component) fetches all summaries at build time
//     and passes them as a serialisable prop.
//   - This component manages filter state (useReducer) and derived results
//     (useMemo) entirely in the browser — zero additional network requests.
//   - CaseStudyFilters receives state/dispatch; CaseStudyCard is stateless.
//
// This mirrors the server-fetches / client-interacts pattern recommended by
// the Next.js App Router documentation.
// ---------------------------------------------------------------------------

import type { CaseStudySummary } from "@/lib/showcase/types";
import { useShowcaseFilters } from "@/hooks/useShowcaseFilters";
import { CaseStudyFilters } from "./CaseStudyFilters";
import { CaseStudyCard } from "./CaseStudyCard";

interface CaseStudyGridProps {
  studies: CaseStudySummary[];
}

export function CaseStudyGrid({ studies }: CaseStudyGridProps) {
  const { state, dispatch, visibleStudies, activeFilterCount } =
    useShowcaseFilters(studies);

  return (
    <div className="flex flex-col gap-10">
      {/* Filters */}
      <CaseStudyFilters
        state={state}
        dispatch={dispatch}
        resultCount={visibleStudies.length}
        totalCount={studies.length}
        activeFilterCount={activeFilterCount}
      />

      {/* Grid */}
      {visibleStudies.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleStudies.map((study, i) => (
            <CaseStudyCard key={study.id} study={study} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <span className="text-5xl" role="img" aria-label="No results">
        🔍
      </span>
      <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
        No case studies match your filters.
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Try adjusting your industry or service selection, or clear the search.
      </p>
    </div>
  );
}
