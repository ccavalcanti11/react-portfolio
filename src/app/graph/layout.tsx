import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

// ---------------------------------------------------------------------------
// Graph section layout — /graph and any future sub-routes
// ---------------------------------------------------------------------------

export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-full items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-400 transition-colors hover:text-sky-400"
            >
              ← Portfolio
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-zinc-700">|</span>
              <span className="text-sm font-semibold text-zinc-100">
                Trade Intelligence Knowledge Graph
              </span>
              <span className="rounded-full bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 text-xs text-emerald-400">
                ✓ Live
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {children}
    </div>
  );
}
