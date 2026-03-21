// ---------------------------------------------------------------------------
// Showcase data-fetching layer
//
// Architecture — why fetch instead of Apollo Client here:
//
//   Apollo Client (useQuery) is the right tool for *client components* that
//   need reactive state, cache sharing, and optimistic updates.
//
//   For *server components* running at build time or on the server, the
//   Next.js `fetch` API drives ISR natively via `next.revalidate`. We get
//   the same GraphQL queries, the same TypeScript safety, and first-class ISR
//   with one option — no Apollo server-side packages required.
//
// To connect a real Contentful space:
//   1. Add CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN to .env.local
//   2. Restart the dev server — mock data is replaced automatically
//
// Contentful Content Delivery API endpoint format:
//   https://graphql.contentful.com/content/v1/spaces/{SPACE_ID}
// ---------------------------------------------------------------------------

import type {
  CaseStudy,
  CaseStudySummary,
  GetAllCaseStudiesResponse,
  GetAllSlugsResponse,
  GetCaseStudyBySlugResponse,
} from "./types";
import {
  GET_ALL_CASE_STUDIES,
  GET_ALL_SLUGS,
  GET_CASE_STUDY_BY_SLUG,
} from "./queries";
import { MOCK_CASE_STUDIES } from "./mock-data";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID ?? "";
const DELIVERY_TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN ?? "";
const CMS_ENDPOINT = SPACE_ID
  ? `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`
  : "";

/** ISR revalidation — 1 hour. Contentful webhooks can purge on-demand too. */
const REVALIDATE_SECONDS = 3600;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function hasCMSConfig(): boolean {
  return Boolean(CMS_ENDPOINT && DELIVERY_TOKEN);
}

/**
 * Generic GraphQL POST helper wired into Next.js's data cache.
 * `next: { revalidate }` is the ISR hook: Next.js serves stale HTML until the
 * interval elapses, then regenerates in the background on the next request.
 */
async function fetchCMS<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(CMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DELIVERY_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`Contentful request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };

  if (json.errors?.length) {
    throw new Error(`Contentful GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  if (!json.data) {
    throw new Error("Contentful returned no data");
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all case-study summaries for the grid page, ordered newest first.
 *
 * Uses ISR (`revalidate` set in fetchCMS) so the list stays fresh without
 * a full redeploy whenever new case studies are published in Contentful.
 */
export async function getAllCaseStudies(): Promise<CaseStudySummary[]> {
  if (!hasCMSConfig()) {
    // Simulate network latency in development so skeletons are visible.
    if (process.env.NODE_ENV === "development") {
      await new Promise((r) => setTimeout(r, 300));
    }
    return MOCK_CASE_STUDIES.map(({ challenge, solution, results, testimonial, ...summary }) => summary);
  }

  const data = await fetchCMS<GetAllCaseStudiesResponse>(GET_ALL_CASE_STUDIES);
  return data.caseStudyCollection.items;
}

/**
 * Returns a single full case study by slug.
 * Used by the detail page — includes rich-text `challenge`, `solution`, and
 * `results` sections that are omitted from the list query.
 *
 * Returns `null` when the slug is not found (triggers a 404 in Next.js).
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (!hasCMSConfig()) {
    if (process.env.NODE_ENV === "development") {
      await new Promise((r) => setTimeout(r, 200));
    }
    return MOCK_CASE_STUDIES.find((s) => s.slug === slug) ?? null;
  }

  const data = await fetchCMS<GetCaseStudyBySlugResponse>(
    GET_CASE_STUDY_BY_SLUG,
    { slug },
  );
  return data.caseStudyCollection.items[0] ?? null;
}

/**
 * Returns all slugs — consumed by `generateStaticParams` so Next.js
 * pre-renders every detail page at build time (full SSG).
 */
export async function getAllSlugs(): Promise<string[]> {
  if (!hasCMSConfig()) {
    return MOCK_CASE_STUDIES.map((s) => s.slug);
  }

  const data = await fetchCMS<GetAllSlugsResponse>(GET_ALL_SLUGS);
  return data.caseStudyCollection.items.map((item) => item.slug);
}
