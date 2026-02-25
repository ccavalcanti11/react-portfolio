import type { BlogTag } from "@/lib/blog/types";

// ---------------------------------------------------------------------------
// Tag colour map — maps a tag slug to deterministic Tailwind classes.
// Using a lookup table (rather than dynamic string interpolation) ensures
// Tailwind includes every colour variant in the generated CSS.
// ---------------------------------------------------------------------------

const TAG_STYLES: Record<string, string> = {
  graphql:
    "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-400",
  typescript:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
  "api-design":
    "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400",
  nextjs:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  react:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400",
  performance:
    "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400",
  apollo:
    "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400",
  css: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400",
  tailwind:
    "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400",
  javascript:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-400",
};

const DEFAULT_STYLE =
  "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";

interface TagBadgeProps {
  tag: BlogTag;
  className?: string;
}

export function TagBadge({ tag, className = "" }: TagBadgeProps) {
  const colorClasses = TAG_STYLES[tag.slug] ?? DEFAULT_STYLE;
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses} ${className}`}
    >
      {tag.name}
    </span>
  );
}
