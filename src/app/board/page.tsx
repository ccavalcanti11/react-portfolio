"use client";

// ---------------------------------------------------------------------------
// Board page — /board
//
// Renders three Kanban columns (To Do / In Progress / Done) in a
// DragDropContext powered by @dnd-kit.
//
// Drag-and-drop architecture
// ──────────────────────────
// 1. DndContext wraps the entire board.
// 2. Each column is a useDroppable zone and a SortableContext of card IDs.
// 3. On drag-end the page calls either `reorderInColumn` (same-column move)
//    or `moveTask` (cross-column move), both dispatched to the useBoard reducer.
// 4. A DragOverlay renders a frozen copy of the dragged card that follows the
//    pointer — the original card becomes an invisible ghost.
//
// Optimistic UI note:
//    The board state updates locally *before* any server round-trip. When the
//    real backend is connected, mutations fire in the background; the
//    subscription will confirm (or roll back) the change.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useCallback } from "react";
import { useBoard } from "@/hooks/useBoard";
import { BoardColumn } from "@/components/board/BoardColumn";
import { TaskCard } from "@/components/board/TaskCard";
import { TaskDialog } from "@/components/board/TaskDialog";
import { FilterBar } from "@/components/board/FilterBar";
import { LiveIndicator } from "@/components/board/LiveIndicator";
import type { Task, TaskStatus } from "@/lib/board/types";

// ---------------------------------------------------------------------------
// Dialog state — union type ensures props always match the active mode
// ---------------------------------------------------------------------------
type DialogState =
  | { open: false }
  | { open: true; mode: "create"; initialStatus: TaskStatus }
  | { open: true; mode: "edit"; task: Task };

// ---------------------------------------------------------------------------
// Page component (client — DnD requires browser APIs)
// ---------------------------------------------------------------------------

export default function BoardPage() {
  const {
    columns,
    filters,
    hasActiveFilters,
    lastEventAt,
    totalTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderInColumn,
    setFilterPriority,
    setFilterLabel,
    clearFilters,
  } = useBoard();

  const [dialogState, setDialogState] = useState<DialogState>({ open: false });
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

  // ── dnd-kit sensors ────────────────────────────────────────────────────
  // PointerSensor: activates after 8 px movement (prevents accidental drags)
  // KeyboardSensor: allows full keyboard accessibility (arrow keys to move)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // ── Drag handlers ──────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = columns
        .flatMap((c) => c.tasks)
        .find((t) => t.id === event.active.id);
      setActiveDragTask(task ?? null);
    },
    [columns],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragTask(null);
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;
      if (activeId === overId) return;

      // Determine source and destination columns
      const sourceCol = columns.find((c) =>
        c.tasks.some((t) => t.id === activeId),
      );
      if (!sourceCol) return;

      const isDestColumn = (["TODO", "IN_PROGRESS", "DONE"] as const).includes(
        overId as TaskStatus,
      );

      if (isDestColumn) {
        // Dropped onto a column header / empty zone
        const destStatus = overId as TaskStatus;
        const destTasks = columns.find((c) => c.status === destStatus)?.tasks ?? [];
        if (sourceCol.status === destStatus) return; // no-op
        moveTask(activeId, destStatus, destTasks.length);
      } else {
        // Dropped onto another card — find that card's column and position
        const destCol = columns.find((c) =>
          c.tasks.some((t) => t.id === overId),
        );
        if (!destCol) return;

        const destIndex = destCol.tasks.findIndex((t) => t.id === overId);

        if (sourceCol.status === destCol.status) {
          // Same-column reorder
          const fromIndex = sourceCol.tasks.findIndex((t) => t.id === activeId);
          reorderInColumn(activeId, fromIndex, destIndex, sourceCol.status);
        } else {
          // Cross-column move
          moveTask(activeId, destCol.status, destIndex);
        }
      }
    },
    [columns, moveTask, reorderInColumn],
  );

  // ── Dialog helpers ─────────────────────────────────────────────────────
  const openCreate = useCallback((status: TaskStatus) => {
    setDialogState({ open: true, mode: "create", initialStatus: status });
  }, []);

  const openEdit = useCallback((task: Task) => {
    setDialogState({ open: true, mode: "edit", task });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({ open: false });
  }, []);

  return (
    <div className="flex flex-col gap-5 px-4 py-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Kanban Board
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Drag cards between columns · real-time updates via GraphQL
              subscriptions
            </p>
          </div>

          {/* Add task (global) */}
          <button
            onClick={() => openCreate("TODO")}
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <PlusIcon />
            New task
          </button>
        </div>

        {/* Metadata row */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <LiveIndicator lastEventAt={lastEventAt} />
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {totalTasks} task{totalTasks !== 1 ? "s" : ""} total
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar
        priority={filters.priority}
        label={filters.label}
        hasActiveFilters={hasActiveFilters}
        onPriority={setFilterPriority}
        onLabel={setFilterLabel}
        onClear={clearFilters}
      />

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {columns.map((col) => (
            <BoardColumn
              key={col.status}
              status={col.status}
              title={col.title}
              accent={col.accent}
              emptyLabel={col.emptyLabel}
              tasks={col.tasks}
              onAddTask={openCreate}
              onEditTask={openEdit}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>

        {/* DragOverlay — renders the card clone following the pointer */}
        <DragOverlay>
          {activeDragTask && (
            <div className="rotate-1 opacity-95 shadow-2xl">
              <TaskCard
                task={activeDragTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Architecture callout */}
      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          How it works
        </h2>
        <ul className="flex flex-col gap-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          <li>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Drag & drop
            </span>{" "}
            — @dnd-kit with PointerSensor (8 px activation distance) and
            KeyboardSensor for full accessibility.
          </li>
          <li>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Optimistic UI
            </span>{" "}
            — cards move instantly; the useReducer state machine applies the
            change before any server round-trip.
          </li>
          <li>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Subscription simulation
            </span>{" "}
            — a local setInterval emits events in the same shape as the real{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
              ON_TASK_CHANGED
            </code>{" "}
            GraphQL subscription. Replace with{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
              useSubscription
            </code>{" "}
            + graphql-ws to go live.
          </li>
          <li>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              State
            </span>{" "}
            — flat task array in{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
              useReducer
            </code>
            ; columns are derived via a memoised selector each render.
          </li>
        </ul>
      </div>

      {/* Dialog */}
      {dialogState.open && (
        dialogState.mode === "create" ? (
          <TaskDialog
            mode="create"
            initialStatus={dialogState.initialStatus}
            onSubmit={createTask}
            onClose={closeDialog}
          />
        ) : (
          <TaskDialog
            mode="edit"
            task={dialogState.task}
            onSubmit={updateTask}
            onClose={closeDialog}
          />
        )
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
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
