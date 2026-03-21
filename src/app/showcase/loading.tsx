import { ShowcaseGridSkeleton } from "@/components/showcase/ShowcaseSkeleton";

// ---------------------------------------------------------------------------
// /showcase/loading.tsx — Next.js App Router streaming skeleton.
//
// This file is automatically used by Next.js while the async ShowcasePage
// server component resolves (data fetch + React render). It renders
// immediately — giving the user instant visual feedback — then is replaced
// by the real content via React Suspense streaming.
// ---------------------------------------------------------------------------

export default function ShowcaseLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      {/* Hero skeleton */}
      <div className="mb-12 flex flex-col gap-3" aria-hidden="true">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 sm:h-12" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-3/4 max-w-xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <ShowcaseGridSkeleton />
    </main>
  );
}
