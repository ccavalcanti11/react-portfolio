import type { GitHubRepository } from "@/lib/github/types";

/** Format a date string as a human-readable relative time */
function formatRelativeDate(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ---------------------------------------------------------------------------

interface RepositoryCardProps {
  repo: GitHubRepository;
}

export function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${repo.name} on GitHub`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      {/* Header row: name + archived badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-sky-600 group-hover:underline dark:text-sky-400">
          {repo.name}
        </span>
        {repo.isArchived && (
          <span className="shrink-0 rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-500">
            archived
          </span>
        )}
      </div>

      {/* Description */}
      {repo.description && (
        <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
          {repo.description}
        </p>
      )}

      {/* Footer: language · stars · forks · updated */}
      <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        {repo.primaryLanguage && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: repo.primaryLanguage.color ?? "#ccc",
              }}
              aria-hidden="true"
            />
            {repo.primaryLanguage.name}
          </span>
        )}

        {repo.stargazerCount > 0 && (
          <span className="flex items-center gap-1">
            <StarIcon />
            {repo.stargazerCount.toLocaleString()}
          </span>
        )}

        {repo.forkCount > 0 && (
          <span className="flex items-center gap-1">
            <ForkIcon />
            {repo.forkCount.toLocaleString()}
          </span>
        )}

        <span className="ml-auto">
          Updated {formatRelativeDate(repo.updatedAt)}
        </span>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Minimal inline SVG icons
// ---------------------------------------------------------------------------

function StarIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
      />
    </svg>
  );
}
