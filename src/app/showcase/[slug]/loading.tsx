import { ShowcaseDetailSkeleton } from "@/components/showcase/ShowcaseSkeleton";

// ---------------------------------------------------------------------------
// /showcase/[slug]/loading.tsx — streamed skeleton for the detail page.
// Displays while the async server component resolves the CMS fetch.
// ---------------------------------------------------------------------------

export default function CaseStudyDetailLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      {/* Back link skeleton */}
      <div
        className="mb-10 h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"
        aria-hidden="true"
      />
      <ShowcaseDetailSkeleton />
    </main>
  );
}
