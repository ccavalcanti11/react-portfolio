import type { Metadata } from "next";
import { getAllCaseStudies } from "@/lib/showcase/client";
import { CaseStudyGrid } from "@/components/showcase/CaseStudyGrid";

// ---------------------------------------------------------------------------
// ISR — revalidate the showcase list every hour.
// New case studies published in Contentful appear without a full redeploy.
// ---------------------------------------------------------------------------
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Client Showcase",
  description:
    "Case studies demonstrating end-to-end digital transformation across retail, healthcare, finance, education, and automotive — built with Next.js, React, TypeScript, and headless CMS.",
  openGraph: {
    title: "Client Showcase",
    description:
      "Real-world case studies: headless CMS, real-time dashboards, accessible portals, and multi-market campaign platforms.",
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// Page — server component
//
// Fetches all case-study summaries at build time (SSG) and revalidates via ISR.
// Passes serialisable data to CaseStudyGrid, a client component that owns
// the filter state — no additional requests once the page has loaded.
// ---------------------------------------------------------------------------
export default async function ShowcasePage() {
  const studies = await getAllCaseStudies();

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      {/* Hero */}
      <div className="mb-12 flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Client Showcase
        </h1>
        <p className="max-w-2xl text-base text-zinc-500 dark:text-zinc-400">
          Five end-to-end engagements — from headless CMS migrations and
          accessible patient portals to real-time trading dashboards and
          multi-market campaign platforms. Filter by industry or service to find
          what&apos;s most relevant to you.
        </p>
      </div>

      {/* Grid with client-side filters */}
      <CaseStudyGrid studies={studies} />
    </main>
  );
}
