"use client";

// ---------------------------------------------------------------------------
// TaskCard — a sortable card rendered inside each BoardColumn.
//
// Uses @dnd-kit/sortable's `useSortable` hook which provides:
//   - `setNodeRef`    — attaches the DOM element to the drag manager
//   - `attributes`   — accessibility attributes (role, aria-*)
//   - `listeners`    — pointer / keyboard event handlers
//   - `transform`    — live CSS translate while dragging
//   - `transition`   — CSS transition when cards animate back into place
//   - `isDragging`   — true while this card is being held
//
// When `isDragging` is true the card becomes a transparent ghost so the user
// can see both the "hole" where the card was and the DragOverlay that follows
// the pointer.
// ---------------------------------------------------------------------------

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { Task } from "@/lib/board/types";
import { PRIORITY_META, LABEL_META } from "@/lib/board/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [menuOpen, setMenuOpen] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityMeta = PRIORITY_META[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "group flex flex-col gap-3 rounded-xl border bg-white p-3.5 shadow-sm",
        "dark:bg-zinc-900",
        isDragging
          ? "cursor-grabbing border-sky-300 opacity-40 dark:border-sky-700"
          : "cursor-grab border-zinc-200 dark:border-zinc-800",
        "hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-700",
        "focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-1",
      ].join(" ")}
    >
      {/* Drag handle + menu row */}
      <div className="flex items-start justify-between gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          aria-label={`Drag ${task.title}`}
          className="mt-0.5 cursor-grab rounded p-0.5 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-600 active:cursor-grabbing dark:text-zinc-600 dark:hover:text-zinc-300"
        >
          <GripIcon />
        </button>

        {/* Overflow menu */}
        <div className="relative ml-auto">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={`Open menu for ${task.title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="rounded p-1 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <DotsIcon />
          </button>
          {menuOpen && (
            <>
              {/* Click-away overlay */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                role="menu"
                className="absolute right-0 top-7 z-20 min-w-[110px] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Edit
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-medium leading-snug text-zinc-900 dark:text-white">
        {task.title}
      </p>

      {/* Description (truncated) */}
      {task.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {task.description}
        </p>
      )}

      {/* Footer: priority + labels */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Priority badge */}
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${priorityMeta.badge}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${priorityMeta.dot}`}
            aria-hidden="true"
          />
          {priorityMeta.label}
        </span>

        {/* Label chips */}
        {task.labels.map((l) => (
          <span
            key={l}
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${LABEL_META[l].badge}`}
          >
            {LABEL_META[l].label}
          </span>
        ))}

        {/* Assignee */}
        {task.assignee && (
          <span
            className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
            title={`Assigned to ${task.assignee}`}
          >
            {task.assignee[0].toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lightweight inline SVGs — avoids a full icon library dependency
// ---------------------------------------------------------------------------

function GripIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="9" cy="7" r="1.5" />
      <circle cx="15" cy="7" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="17" r="1.5" />
      <circle cx="15" cy="17" r="1.5" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}
