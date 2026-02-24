import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/types";
import { TagBadge } from "./TagBadge";

// ---------------------------------------------------------------------------
// Cover gradient palette — assigned by cycling through the array using the
// post's array index so each card has a distinct, visually appealing colour.
// Inline styles are used because Tailwind can't process dynamically assembled
// gradient class names at build time.
// ---------------------------------------------------------------------------

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
];

/** Format an ISO date string as a human-readable label (e.g. "Feb 22, 2026"). */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------

interface PostCardProps {
  post: BlogPostSummary;
  /** Index within the rendered list — used to assign the cover gradient. */
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const gradient = COVER_GRADIENTS[index % COVER_GRADIENTS.length];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      {/* Cover */}
      <div
        className="h-40 w-full"
        style={{ background: gradient }}
        aria-hidden="true"
      />

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-base font-semibold leading-snug text-zinc-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-auto flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
