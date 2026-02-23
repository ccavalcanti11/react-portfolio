import { SearchInput } from "@/components/github/SearchInput";

const EXAMPLE_USERS = ["torvalds", "gaearon", "sindresorhus", "tj"];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        {/* Hero */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            GitHub Profile Explorer
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Look up any GitHub user — browse their repos, languages, stars, and
            more.
          </p>
        </div>

        {/* Search */}
        <div className="w-full">
          <SearchInput size="large" />
        </div>

        {/* Example users */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-400">
          <span>Try:</span>
          {EXAMPLE_USERS.map((user) => (
            <a
              key={user}
              href={`/github/${user}`}
              className="rounded-full border border-zinc-200 px-3 py-1 text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
            >
              @{user}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
