"use client";

import Link from "next/link";
import { useGitHubProfile } from "@/hooks/useGitHubProfile";
import { SearchInput } from "./SearchInput";
import { ProfileHeader } from "./ProfileHeader";
import { RepositoryList } from "./RepositoryList";
import { RepositoryCard } from "./RepositoryCard";
import {
  ProfileHeaderSkeleton,
  RepositoryGridSkeleton,
} from "./ProfileSkeleton";
import type { GitHubRepository } from "@/lib/github/types";

interface ProfileViewProps {
  username: string;
}

/**
 * Client component that owns all data-fetching and interactive state
 * for the GitHub profile page.
 *
 * Kept separate from the server-component page so that:
 *  - The page can be an async Server Component (params await, generateMetadata)
 *  - Apollo's useQuery, loading/error states, and fetchMore all live here
 */
export function ProfileView({ username }: ProfileViewProps) {
  const { profile, loading, loadingMore, error, loadMoreRepos, hasNextPage } =
    useGitHubProfile(username);

  // Pinned items come back as a PinnableItem union — filter to Repositories only
  const pinnedRepos = (
    profile?.pinnedItems.nodes ?? []
  ).filter((n): n is GitHubRepository => "id" in n && typeof n.id === "string");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ------------------------------------------------------------------ */}
      {/* Sticky top navigation                                               */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="shrink-0 text-sm font-semibold text-zinc-900 transition-colors hover:text-sky-500 dark:text-white"
          >
            ← Home
          </Link>
          <div className="max-w-md flex-1">
            <SearchInput defaultValue={username} />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main content                                                        */}
      {/* ------------------------------------------------------------------ */}
      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Loading state -------------------------------------------------- */}
        {loading && (
          <div className="flex flex-col gap-10">
            <ProfileHeaderSkeleton />
            <RepositoryGridSkeleton count={6} />
          </div>
        )}

        {/* Error state ---------------------------------------------------- */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="text-5xl" role="img" aria-label="Warning">
              ⚠️
            </span>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Something went wrong
            </h2>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              {error.message.includes("401") ||
              error.message.toLowerCase().includes("unauthorized")
                ? "Invalid or missing GitHub token. Add NEXT_PUBLIC_GITHUB_TOKEN to .env.local."
                : error.message}
            </p>
          </div>
        )}

        {/* Not found ------------------------------------------------------ */}
        {!loading && !error && !profile && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="text-5xl" role="img" aria-label="Search">
              🔍
            </span>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              User not found
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No GitHub account found for{" "}
              <strong className="text-zinc-900 dark:text-white">
                @{username}
              </strong>
              .
            </p>
            <Link
              href="/"
              className="mt-2 text-sm font-medium text-sky-500 hover:underline"
            >
              ← Try another username
            </Link>
          </div>
        )}

        {/* Profile ------------------------------------------------------- */}
        {!loading && profile && (
          <div className="flex flex-col gap-12">
            <ProfileHeader user={profile} />

            {/* Pinned repositories */}
            {pinnedRepos.length > 0 && (
              <section aria-labelledby="pinned-heading">
                <h2
                  id="pinned-heading"
                  className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white"
                >
                  Pinned
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pinnedRepos.map((repo) => (
                    <RepositoryCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </section>
            )}

            {/* All repositories with language filter + load-more */}
            <RepositoryList
              repositories={profile.repositories.nodes}
              totalCount={profile.repositories.totalCount}
              hasNextPage={hasNextPage}
              loadingMore={loadingMore}
              onLoadMore={loadMoreRepos}
            />
          </div>
        )}
      </main>
    </div>
  );
}
