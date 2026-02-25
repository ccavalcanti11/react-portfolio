// ---------------------------------------------------------------------------
// Kanban Board — TypeScript interfaces and display metadata
//
// These interfaces mirror a real GraphQL schema so the schema-to-TypeScript
// mapping is direct. When a graphql-ws backend is connected, response types
// are cast to these shapes with zero changes to the UI components.
// ---------------------------------------------------------------------------

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskLabel = "BUG" | "FEATURE" | "DOCS" | "REFACTOR" | "TEST";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  labels: TaskLabel[];
  assignee: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  order: number; // integer index within the column; re-assigned on every move
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  labels?: TaskLabel[];
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  labels?: TaskLabel[];
}

export interface MoveTaskInput {
  id: string;
  status: TaskStatus;
  order: number;
}

// ---------------------------------------------------------------------------
// Display metadata — colocated with the type so all consumers share one
// source of truth for colours and labels.
// ---------------------------------------------------------------------------

export const COLUMN_META: Record<
  TaskStatus,
  { title: string; accent: string; emptyLabel: string }
> = {
  TODO: {
    title: "To Do",
    accent: "text-blue-600 dark:text-blue-400",
    emptyLabel: "No tasks yet — add one below",
  },
  IN_PROGRESS: {
    title: "In Progress",
    accent: "text-amber-600 dark:text-amber-400",
    emptyLabel: "Nothing in progress",
  },
  DONE: {
    title: "Done",
    accent: "text-emerald-600 dark:text-emerald-400",
    emptyLabel: "Nothing completed yet",
  },
};

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; dot: string; badge: string }
> = {
  LOW: {
    label: "Low",
    dot: "bg-zinc-400",
    badge:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-blue-500",
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  },
  HIGH: {
    label: "High",
    dot: "bg-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-red-500",
    badge:
      "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  },
};

export const LABEL_META: Record<TaskLabel, { label: string; badge: string }> =
  {
    BUG: {
      label: "Bug",
      badge:
        "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    },
    FEATURE: {
      label: "Feature",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
    },
    DOCS: {
      label: "Docs",
      badge:
        "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400",
    },
    REFACTOR: {
      label: "Refactor",
      badge:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400",
    },
    TEST: {
      label: "Test",
      badge:
        "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400",
    },
  };

// Ordered lists used by filter bars, select inputs, and loops
export const ALL_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
export const ALL_PRIORITIES: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];
export const ALL_LABELS: TaskLabel[] = [
  "BUG",
  "FEATURE",
  "DOCS",
  "REFACTOR",
  "TEST",
];
