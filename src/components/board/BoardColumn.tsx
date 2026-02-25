"use client";

// ---------------------------------------------------------------------------
// BoardColumn — a droppable column containing a sorted list of TaskCards.
//
// useDroppable makes the entire column area a valid drop target.
// SortableContext provides the ordered list of IDs that dnd-kit uses to
// compute insertion positions as the user drags over the column.
// ---------------------------------------------------------------------------

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@/lib/board/types";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  status: TaskStatus;
  title: string;
  accent: string;
  emptyLabel: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function BoardColumn({
  status,
  title,
  accent,
  emptyLabel,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      className={[
        "flex flex-1 flex-col rounded-2xl border p-3 transition-colors",
        isOver
          ? "border-sky-400 bg-sky-50/50 dark:border-sky-700 dark:bg-sky-950/20"
          : "border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/40",
      ].join(" ")}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className={`text-sm font-semibold ${accent}`}>{title}</h2>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {tasks.length}
          </span>
        </div>

        {/* Quick-add button */}
        <button
          onClick={() => onAddTask(status)}
          aria-label={`Add task to ${title}`}
          className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Sortable task list */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={[
            "flex min-h-[120px] flex-col gap-2",
            tasks.length === 0 ? "items-center justify-center" : "",
          ].join(" ")}
        >
          {tasks.length === 0 ? (
            <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
              {emptyLabel}
            </p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Add task button (bottom) */}
      <button
        onClick={() => onAddTask(status)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-300 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-600 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-400"
      >
        <PlusIcon /> Add task
      </button>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v14M5 12h14"
      />
    </svg>
  );
}
