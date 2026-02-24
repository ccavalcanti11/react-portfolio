import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

// ---------------------------------------------------------------------------
// Blog section layout — shared across /blog and /blog/[slug].
//
// Adds the sticky navigation bar (back link + theme toggle) and a consistent
// page width constraint. The root layout's ApolloWrapper still wraps this
// section, so any future client components here can use Apollo hooks.
// ---------------------------------------------------------------------------

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-900 transition-colors hover:text-sky-500 dark:text-white dark:hover:text-sky-400"
          >
            ← Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              Dev Blog
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main>{children}</main>
    </div>
  );
}
