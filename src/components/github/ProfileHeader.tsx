import Image from "next/image";
import type { GitHubUser } from "@/lib/github/types";

/** Compact number formatter (1 500 → "1.5k", 2 000 000 → "2M") */
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------

interface ProfileHeaderProps {
  user: GitHubUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const websiteHref = user.websiteUrl
    ? user.websiteUrl.startsWith("http")
      ? user.websiteUrl
      : `https://${user.websiteUrl}`
    : null;

  const websiteLabel = user.websiteUrl?.replace(/^https?:\/\//, "");

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
      {/* Avatar */}
      <div className="shrink-0">
        <Image
          src={user.avatarUrl}
          alt={`${user.login}'s avatar`}
          width={120}
          height={120}
          className="rounded-full ring-4 ring-zinc-100 dark:ring-zinc-800"
          priority
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3">
        <div>
          {user.name && (
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {user.name}
            </h1>
          )}
          <a
            href={user.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-zinc-500 transition-colors hover:text-sky-500 dark:text-zinc-400"
          >
            @{user.login}
          </a>
        </div>

        {user.bio && (
          <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-300">
            {user.bio}
          </p>
        )}

        {/* Meta links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          {user.location && (
            <span className="flex items-center gap-1.5">
              <LocationIcon />
              {user.location}
            </span>
          )}
          {user.company && (
            <span className="flex items-center gap-1.5">
              <CompanyIcon />
              {user.company.replace(/^@/, "")}
            </span>
          )}
          {websiteHref && (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-sky-500"
            >
              <LinkIcon />
              {websiteLabel}
            </a>
          )}
          {user.twitterUsername && (
            <a
              href={`https://twitter.com/${user.twitterUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-sky-500"
            >
              <XIcon />@{user.twitterUsername}
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm">
          <StatBadge
            label="followers"
            count={user.followers.totalCount}
            href={`${user.url}?tab=followers`}
          />
          <StatBadge
            label="following"
            count={user.following.totalCount}
            href={`${user.url}?tab=following`}
          />
          <StatBadge
            label="repos"
            count={user.repositories.totalCount}
            href={`${user.url}?tab=repositories`}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatBadge({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 transition-colors hover:text-sky-500 dark:text-zinc-300"
    >
      <span className="font-semibold text-zinc-900 dark:text-white">
        {formatCount(count)}
      </span>
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
    </a>
  );
}

// Minimal inline SVG icons — no external icon library required

function LocationIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
