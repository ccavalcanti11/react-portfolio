"use client";

// ---------------------------------------------------------------------------
// FilterBar — client-side filtering by priority and label.
//
// All filtering happens in the browser against the already-loaded task list.
// No extra network requests. aria-pressed communicates the current selection
// to assistive technologies (screen readers, switch access).
// ---------------------------------------------------------------------------

import type { TaskPriority, TaskLabel } from "@/lib/board/types";
import {
  ALL_PRIORITIES,
  ALL_LABELS,
  PRIORITY_META,
  LABEL_META,
} from "@/lib/board/types";

interface FilterBarProps {
  priority: TaskPriority | null;
  label: TaskLabel | null;
  hasActiveFilters: boolean;
  onPriority: (p: TaskPriority | null) => void;
  onLabel: (l: TaskLabel | null) => void;
  onClear: () => void;
}

export function FilterBar({
  priority,
  label,
  hasActiveFilters,
  onPriority,
  onLabel,
  onClear,
}: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label="Filter tasks"
      className="flex flex-wrap items-center gap-3"
    >
      {/* Priority pills */}
      <fieldset className="flex items-center gap-1.5">
        <legend className="sr-only">Filter by priority</legend>
        {ALL_PRIORITIES.map((p) => {
          const meta = PRIORITY_META[p];
          const active = priority === p;
          return (
            <button
              key={p}
              aria-pressed={active}
              onClick={() => onPriority(active ? null : p)}
              className={[
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                active
                  ? meta.badge + " ring-2 ring-offset-1 ring-current"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
              ].join(" ")}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                aria-hidden="true"
              />
              {meta.label}
            </button>
          );
        })}
      </fieldset>

      {/* Separator */}
      <span
        aria-hidden="true"
        className="h-4 w-px bg-zinc-300 dark:bg-zinc-700"
      />

      {/* Label pills */}
      <fieldset className="flex items-center gap-1.5">
        <legend className="sr-only">Filter by label</legend>
        {ALL_LABELS.map((l) => {
          const meta = LABEL_META[l];
          const active = label === l;
          return (
            <button
              key={l}
              aria-pressed={active}
              onClick={() => onLabel(active ? null : l)}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                active
                  ? meta.badge + " ring-2 ring-offset-1 ring-current"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
              ].join(" ")}
            >
              {meta.label}
            </button>
          );
        })}
      </fieldset>

      {/* Clear button — only rendered when a filter is active */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="ml-auto rounded-full px-3 py-1 text-xs font-medium text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
