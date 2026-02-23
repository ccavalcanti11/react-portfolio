"use client";

import { useState, useMemo } from "react";
import { RepositoryCard } from "./RepositoryCard";
import type { GitHubRepository } from "@/lib/github/types";

interface RepositoryListProps {
  repositories: GitHubRepository[];
  totalCount: number;
  hasNextPage: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  title?: string;
}

/**
 * Displays a filterable grid of repository cards with "Load more" pagination.
 *
 * The language dropdown is derived from the already-loaded repositories so it
 * never triggers an extra network request — filtering is pure client-side.
 */
export function RepositoryList({
  repositories,
  totalCount,
  hasNextPage,
  loadingMore,
  onLoadMore,
  title = "Repositories",
}: RepositoryListProps) {
  const [languageFilter, setLanguageFilter] = useState("all");

  // Derive the unique language list from currently loaded repos
  const languages = useMemo(() => {
    const langs = new Set<string>();
    repositories.forEach((r) => {
      if (r.primaryLanguage) langs.add(r.primaryLanguage.name);
    });
    return Array.from(langs).sort();
  }, [repositories]);

  const filtered = useMemo(
    () =>
      languageFilter === "all"
        ? repositories
        : repositories.filter(
            (r) => r.primaryLanguage?.name === languageFilter
          ),
    [repositories, languageFilter]
  );

  return (
    <section aria-labelledby="repos-heading">
      {/* Section header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="repos-heading"
          className="text-lg font-semibold text-zinc-900 dark:text-white"
        >
          {title}
          <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
            ({totalCount.toLocaleString()})
          </span>
        </h2>

        {languages.length > 1 && (
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label="Filter by language"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="all">All languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No repositories match the selected language.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((repo) => (
            <RepositoryCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-500 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
