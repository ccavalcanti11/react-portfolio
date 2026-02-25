import type { Task } from "./types";

// ---------------------------------------------------------------------------
// Seed data — tasks represent real work done on this portfolio application.
// This meta touch helps recruiters understand the project context at a glance.
// ---------------------------------------------------------------------------

export const INITIAL_TASKS: Task[] = [
  // ── DONE ─────────────────────────────────────────────────────────────────
  {
    id: "task-1",
    title: "Bootstrap Next.js project with TypeScript & Tailwind",
    description:
      "Initialise the App Router structure, configure Tailwind CSS v4, enable TypeScript strict mode, and set up ESLint.",
    status: "DONE",
    priority: "HIGH",
    labels: ["FEATURE"],
    assignee: "Carlos",
    createdAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    order: 0,
  },
  {
    id: "task-2",
    title: "Configure Apollo Client with InMemoryCache policies",
    description:
      "Set up ApolloProvider, define keyArgs for cursor-based pagination, wrap layout in ApolloWrapper.",
    status: "DONE",
    priority: "HIGH",
    labels: ["FEATURE"],
    assignee: "Carlos",
    createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
    order: 1,
  },
  {
    id: "task-3",
    title: "Build GitHub Profile Explorer (Project 1)",
    description:
      "Debounced search, profile page with avatar / bio / repos, skeleton states, load-more pagination.",
    status: "DONE",
    priority: "HIGH",
    labels: ["FEATURE"],
    assignee: "Carlos",
    createdAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    order: 2,
  },
  {
    id: "task-4",
    title: "Implement dark / light theme toggle without FOUC",
    description:
      "Blocking inline script initialises the correct class before first paint. localStorage persistence and OS-preference fallback.",
    status: "DONE",
    priority: "MEDIUM",
    labels: ["FEATURE"],
    assignee: "Carlos",
    createdAt: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    order: 3,
  },
  {
    id: "task-5",
    title: "Build Dev Blog with SSG + ISR (Project 2)",
    description:
      "Post list with client-side tag filter, generateStaticParams, ISR revalidation every hour, per-page SEO metadata.",
    status: "DONE",
    priority: "HIGH",
    labels: ["FEATURE"],
    assignee: "Carlos",
    createdAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    order: 4,
  },
  // ── IN_PROGRESS ───────────────────────────────────────────────────────────
  {
    id: "task-6",
    title: "Implement drag-and-drop with dnd-kit",
    description:
      "DragOverlay for smooth cross-column moves, SortableContext per column, PointerSensor with 8 px activation distance.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    labels: ["FEATURE"],
    assignee: "Carlos",
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
    order: 0,
  },
  {
    id: "task-7",
    title: "Wire up GraphQL subscription simulation",
    description:
      "Local setInterval emits task events matching the ON_TASK_CHANGED subscription shape — replaces with real graphql-ws when backend is connected.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    labels: ["FEATURE"],
    assignee: "Carlos",
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 3_600_000).toISOString(),
    order: 1,
  },
  // ── TODO ──────────────────────────────────────────────────────────────────
  {
    id: "task-8",
    title: "Write unit tests for TaskCard and useBoard",
    description:
      "Jest + React Testing Library: render, interactions, reducer transitions, and filter logic. Aim for 100% branch coverage on the reducer.",
    status: "TODO",
    priority: "MEDIUM",
    labels: ["TEST"],
    assignee: null,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    updatedAt: new Date(Date.now() - 86_400_000).toISOString(),
    order: 0,
  },
  {
    id: "task-9",
    title: "Add filter bar — by priority and label",
    description:
      "Client-side filtering with aria-pressed pill buttons — no extra network round-trips. Clear-all shortcut.",
    status: "TODO",
    priority: "LOW",
    labels: ["FEATURE"],
    assignee: null,
    createdAt: new Date(Date.now() - 43_200_000).toISOString(),
    updatedAt: new Date(Date.now() - 43_200_000).toISOString(),
    order: 1,
  },
  {
    id: "task-10",
    title: "Fix edge case: identical order after rapid drops",
    description:
      "Two concurrent drops can land on the same order value. Add fractional-index tiebreaker so sorting remains stable.",
    status: "TODO",
    priority: "HIGH",
    labels: ["BUG"],
    assignee: null,
    createdAt: new Date(Date.now() - 7_200_000).toISOString(),
    updatedAt: new Date(Date.now() - 7_200_000).toISOString(),
    order: 2,
  },
  {
    id: "task-11",
    title: "Document GraphQL subscription server contract",
    description:
      "README section covering the WS server schema, environment variables, and instructions for connecting a real backend.",
    status: "TODO",
    priority: "LOW",
    labels: ["DOCS"],
    assignee: null,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    updatedAt: new Date(Date.now() - 3_600_000).toISOString(),
    order: 3,
  },
];

let _counter = INITIAL_TASKS.length;

/**
 * Generate a unique task ID.
 * The numeric prefix keeps Jest snapshots deterministic across test runs.
 */
export function generateTaskId(): string {
  return `task-${++_counter}-${Date.now()}`;
}
