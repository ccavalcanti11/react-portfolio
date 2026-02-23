/**
 * Skeleton loading components — match the visual shape of their real
 * counterparts so the page layout doesn't jump when content arrives.
 *
 * Tailwind's `animate-pulse` provides the breathing effect without
 * any extra CSS or libraries.
 */

// ---------------------------------------------------------------------------
// Profile header skeleton
// ---------------------------------------------------------------------------

export function ProfileHeaderSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8"
      aria-busy="true"
      aria-label="Loading profile"
    >
      {/* Avatar placeholder */}
      <div className="h-[120px] w-[120px] shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />

      {/* Text placeholders */}
      <div className="flex flex-1 flex-col gap-3 pt-1">
        <div className="h-7 w-44 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-28 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-56 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-4 pt-1">
          {[80, 80, 64].map((w, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single repository card skeleton
// ---------------------------------------------------------------------------

export function RepositoryCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      aria-hidden="true"
    >
      <div className="h-4 w-36 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      <div className="space-y-1.5">
        <div className="h-3 w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-3/4 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="flex gap-3">
        <div className="h-3 w-16 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-10 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-10 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grid of repository card skeletons
// ---------------------------------------------------------------------------

export function RepositoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <RepositoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
