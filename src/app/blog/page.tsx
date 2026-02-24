import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog/client";
import { PostList } from "@/components/blog/PostList";
import type { BlogTag } from "@/lib/blog/types";

// ---------------------------------------------------------------------------
// ISR — revalidate the post list every hour.
// Next.js serves the cached HTML and regenerates in the background after the
// interval elapses, meaning new CMS posts appear without a full redeploy.
// ---------------------------------------------------------------------------
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Dev Blog",
  description:
    "Articles on React, Next.js, GraphQL, TypeScript, and frontend engineering — written by a developer who builds these patterns daily.",
  openGraph: {
    title: "Dev Blog",
    description:
      "Articles on React, Next.js, GraphQL, TypeScript, and frontend engineering.",
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * Blog home — server component.
 *
 * Fetches all post summaries at build time (SSG) and revalidates via ISR.
 * Passes the serialised data to PostList, a client component that handles
 * tag-filter state entirely in the browser — no additional requests needed.
 */
export default async function BlogPage() {
  const posts = await getAllPosts();

  // Derive a deduplicated list of all tags for the filter UI.
  const tagMap = new Map<string, BlogTag>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag.slug, tag);
    }
  }
  const allTags = Array.from(tagMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      {/* Hero */}
      <div className="mb-12 flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Dev Blog
        </h1>
        <p className="max-w-xl text-base text-zinc-500 dark:text-zinc-400">
          Practical articles on React, Next.js, GraphQL, TypeScript, and the
          patterns that make frontend codebases scale.
        </p>
      </div>

      {/* Post list with client-side tag filter */}
      <PostList posts={posts} allTags={allTags} />
    </div>
  );
}
