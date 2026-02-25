import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

// ---------------------------------------------------------------------------
// Board section layout — shared across /board and any future board sub-routes.
//
// Uses the same sticky-header pattern as the blog layout so the portfolio
// feels consistent. The root layout's ApolloWrapper still wraps this section,
// meaning board components that switch to real Apollo queries/subscriptions
// will have access to the client without any extra provider wiring.
// ---------------------------------------------------------------------------

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-900 transition-colors hover:text-sky-500 dark:text-white dark:hover:text-sky-400"
          >
            ← Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              Kanban Board
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Board fills the remaining viewport height */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
