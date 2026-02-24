// ---------------------------------------------------------------------------
// CMS data-fetching layer
//
// Architecture note — why `fetch` instead of Apollo Client here:
//
//   Apollo Client (via `useQuery`) is the right choice for *client components*
//   that need reactive state, cache sharing, and optimistic updates — exactly
//   what the GitHub Profile Explorer uses.
//
//   For *server components* that run at build time or on the server, the
//   Next.js `fetch` API is the recommended approach because its `next.revalidate`
//   option drives ISR natively. You get the same GraphQL queries (just POSTed
//   as plain strings), the same TypeScript safety, and first-class ISR with a
//   single option — no extra Apollo server-side packages required.
//
// To connect a real Hygraph project:
//   1. Set HYGRAPH_ENDPOINT in .env.local
//   2. Optionally set HYGRAPH_TOKEN for content behind authentication
//   3. Restart the dev server — mock data is replaced automatically.
// ---------------------------------------------------------------------------

import type {
  BlogPost,
  BlogPostSummary,
  GetAllPostsResponse,
  GetAllSlugsResponse,
  GetPostBySlugResponse,
} from "./types";
import { GET_ALL_POSTS, GET_ALL_SLUGS, GET_POST_BY_SLUG } from "./queries";
import { MOCK_POSTS } from "./mock-data";

const CMS_ENDPOINT = process.env.HYGRAPH_ENDPOINT ?? "";
const CMS_TOKEN = process.env.HYGRAPH_TOKEN ?? "";

/** ISR revalidation interval — 1 hour. Adjust per publishing frequency. */
const REVALIDATE_SECONDS = 3600;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function hasCMSConfig(): boolean {
  return Boolean(CMS_ENDPOINT);
}

/**
 * Generic GraphQL POST helper that participates in Next.js's data cache.
 * The `next: { revalidate }` option is what enables ISR: Next.js serves
 * the stale HTML until the interval elapses, then regenerates in background.
 */
async function fetchCMS<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(CMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(CMS_TOKEN ? { Authorization: `Bearer ${CMS_TOKEN}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };

  if (json.errors?.length) {
    throw new Error(`CMS GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  if (!json.data) {
    throw new Error("CMS returned no data");
  }

  return json.data;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return all post summaries (no content HTML) sorted newest-first.
 * Falls back to static mock data when HYGRAPH_ENDPOINT is not set.
 */
export async function getAllPosts(): Promise<BlogPostSummary[]> {
  if (!hasCMSConfig()) {
    return MOCK_POSTS.map(
      // Strip the `content` field — callers of this function only need summaries
      ({ content: _content, ...summary }) => summary,
    );
  }

  const data = await fetchCMS<GetAllPostsResponse>(GET_ALL_POSTS);
  return data.posts;
}

/**
 * Return all published slugs for `generateStaticParams`.
 * Pre-rendering every slug at build time means each post page is served as
 * static HTML from the CDN edge — zero server latency for the first byte.
 */
export async function getAllSlugs(): Promise<string[]> {
  if (!hasCMSConfig()) {
    return MOCK_POSTS.map((p) => p.slug);
  }

  const data = await fetchCMS<GetAllSlugsResponse>(GET_ALL_SLUGS);
  return data.posts.map((p) => p.slug);
}

/**
 * Fetch a single post by slug, including its full HTML content.
 * Falls back to mock data when HYGRAPH_ENDPOINT is not set.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasCMSConfig()) {
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const data = await fetchCMS<GetPostBySlugResponse>(GET_POST_BY_SLUG, {
    slug,
  });
  return data.post;
}
