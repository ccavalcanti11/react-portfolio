import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

// ---------------------------------------------------------------------------
// Portfolio hub — the single URL that shows all three projects.
// A recruiter lands here, sees everything at a glance, and dives in.
// ---------------------------------------------------------------------------

const PROJECTS = [
  {
    number: "01",
    status: "live" as const,
    title: "GitHub Profile Explorer",
    description:
      "Look up any GitHub user and browse their public repositories, languages, stars, and activity — powered by GitHub's GraphQL API and Apollo Client.",
    href: "/github/torvalds",
    cta: "Explore a profile →",
    tech: ["Next.js", "Apollo Client", "GraphQL", "TypeScript"],
    pills: [
      { label: "@torvalds", href: "/github/torvalds" },
      { label: "@gaearon", href: "/github/gaearon" },
      { label: "@sindresorhus", href: "/github/sindresorhus" },
    ],
  },
  {
    number: "02",
    status: "live" as const,
    title: "Dev Blog",
    description:
      "A developer blog with statically generated posts, ISR revalidation, tag filtering, and dark mode — backed by a headless CMS GraphQL API.",
    href: "/blog",
    cta: "Read the blog →",
    tech: ["Next.js SSG/ISR", "Hygraph GraphQL", "TypeScript", "CSS3"],
    pills: [],
  },
  {
    number: "03",
    status: "live" as const,
    title: "Real-Time Kanban Board",
    description:
      "A drag-and-drop task board with live updates across browser tabs via GraphQL subscriptions, optimistic UI, and complex state management.",
    href: "/board",
    cta: "Open board →",
    tech: ["GraphQL Subscriptions", "dnd-kit", "useReducer", "WebSockets"],
    pills: [],
  },
  {
    number: "04",
    status: "live" as const,
    title: "Trade Intelligence Knowledge Graph",
    description:
      "An interactive force-directed knowledge graph modelling global commodity trade flows — countries, commodities, and companies connected by real 2024 data. Click any node to \"walk the data\", discover connections, and find shortest paths between any two entities. Designed around the knowledge-graph platform concept.",
    href: "/graph",
    cta: "Explore the graph →",
    tech: ["D3.js v7", "Force Simulation", "BFS Path Finder", "TypeScript"],
    pills: [],
  },
] as const;

const STATUS_BADGE = {
  live: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  soon: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            Frontend Portfolio
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero */}
        <div className="mb-16 flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Three projects.
            <br />
            One codebase.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            A portfolio built the way real products are built — multiple feature
            areas sharing a design system, Apollo client, and deployment.
            GraphQL throughout. TypeScript end-to-end.
          </p>
        </div>

        {/* Project cards */}
        <div className="flex flex-col gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.number}
              className="group relative flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-start sm:gap-8"
            >
              {/* Number */}
              <span className="shrink-0 text-4xl font-black text-zinc-100 dark:text-zinc-800 sm:text-5xl">
                {project.number}
              </span>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-4">
                {/* Header row */}
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {project.title}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[project.status]}`}
                  >
                    {project.status === "live" ? "✓ Live" : "Coming soon"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA + example links */}
                <div className="flex flex-wrap items-center gap-3">
                  {project.status === "live" ? (
                    <Link
                      href={project.href}
                      className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                    >
                      {project.cta}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-700">
                      {project.cta}
                    </span>
                  )}

                  {project.pills.map((pill) => (
                    <Link
                      key={pill.label}
                      href={pill.href}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white"
                    >
                      {pill.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
