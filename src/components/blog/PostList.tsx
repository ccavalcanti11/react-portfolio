"use client";

// ---------------------------------------------------------------------------
// PostList — client component that owns the tag-filter state.
//
// All posts are fetched on the server and passed as a serialisable prop.
// Filtering happens entirely in the browser — no extra network round-trips.
// This is the recommended App Router pattern: server fetches, client interacts.
// ---------------------------------------------------------------------------

import { useState } from "react";
import type { BlogPostSummary, BlogTag } from "@/lib/blog/types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: BlogPostSummary[];
  allTags: BlogTag[];
}

export function PostList({ posts, allTags }: PostListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = activeTag
    ? posts.filter((p) => p.tags.some((t) => t.slug === activeTag))
    : posts;

  return (
    <div className="flex flex-col gap-10">
      {/* Tag filter */}
      <div
        role="group"
        aria-label="Filter posts by tag"
        className="flex flex-wrap gap-2"
      >
        <FilterButton
          active={activeTag === null}
          onClick={() => setActiveTag(null)}
        >
          All posts
        </FilterButton>
        {allTags.map((tag) => (
          <FilterButton
            key={tag.id}
            active={activeTag === tag.slug}
            onClick={() => setActiveTag(tag.slug)}
          >
            {tag.name}
          </FilterButton>
        ))}
      </div>

      {/* Result count */}
      {activeTag && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {visible.length} post{visible.length !== 1 ? "s" : ""} tagged{" "}
          <strong className="text-zinc-700 dark:text-zinc-300">
            {allTags.find((t) => t.slug === activeTag)?.name}
          </strong>
        </p>
      )}

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <span className="text-4xl" role="img" aria-label="Empty">
            📭
          </span>
          <p className="text-zinc-500 dark:text-zinc-400">
            No posts found for this tag.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "rounded-full px-4 py-1.5 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          : "rounded-full px-4 py-1.5 text-sm font-medium border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white"
      }
    >
      {children}
    </button>
  );
}
