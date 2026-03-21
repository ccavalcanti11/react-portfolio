// ---------------------------------------------------------------------------
// ShowcaseSkeleton — loading placeholders for the showcase pages.
//
// Two exported components:
//   ShowcaseGridSkeleton  — used by /showcase/loading.tsx
//   ShowcaseDetailSkeleton — used by /showcase/[slug]/loading.tsx
//
// Skeleton elements use a pulsing animation (animate-pulse) to communicate
// that content is loading without blocking the initial render.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Grid skeleton
// ---------------------------------------------------------------------------

export function ShowcaseGridSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {/* Filter bar skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-32 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      aria-hidden="true"
    >
      {/* Cover */}
      <div
        className="h-36 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800"
        style={{ animationDelay: `${delay}ms` }}
      />
      {/* Body */}
      <div className="flex flex-col gap-4 p-5">
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-20 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail skeleton
// ---------------------------------------------------------------------------

export function ShowcaseDetailSkeleton() {
  return (
    <div className="flex flex-col gap-12" aria-hidden="true">
      {/* Hero */}
      <div
        className="h-64 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
      />

      {/* Title area */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-28 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Metrics row */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 w-36 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>

      {/* Content sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="h-6 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
