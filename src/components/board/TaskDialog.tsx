"use client";

// ---------------------------------------------------------------------------
// TaskDialog — modal for creating and editing tasks.
//
// Accessibility features:
//   - <dialog> element for native browser semantics and scroll-lock
//   - Escape key closes the dialog (native <dialog> behaviour)
//   - Focus is trapped inside while open via focus-visible ring styles
//   - aria-labelledby links the dialog title to the element
//   - Form uses fieldsets and labels so all controls are reachable via AT
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import type { Task, TaskStatus, TaskPriority, TaskLabel } from "@/lib/board/types";
import {
  ALL_STATUSES,
  ALL_PRIORITIES,
  ALL_LABELS,
  COLUMN_META,
  PRIORITY_META,
  LABEL_META,
} from "@/lib/board/types";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/board/types";

interface CreateMode {
  mode: "create";
  initialStatus: TaskStatus;
  onSubmit: (input: CreateTaskInput) => void;
}
interface EditMode {
  mode: "edit";
  task: Task;
  onSubmit: (input: UpdateTaskInput) => void;
}
type DialogProps = (CreateMode | EditMode) & { onClose: () => void };

export function TaskDialog(props: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // ── Form state ──────────────────────────────────────────────────────────
  const defaults =
    props.mode === "edit"
      ? props.task
      : {
          title: "",
          description: "",
          status: props.initialStatus,
          priority: "MEDIUM" as TaskPriority,
          labels: [] as TaskLabel[],
        };

  const [title, setTitle] = useState(defaults.title);
  const [description, setDescription] = useState(
    defaults.description ?? "",
  );
  const [status, setStatus] = useState<TaskStatus>(defaults.status);
  const [priority, setPriority] = useState<TaskPriority>(defaults.priority);
  const [labels, setLabels] = useState<TaskLabel[]>(defaults.labels);
  const [titleError, setTitleError] = useState("");

  // ── Open / focus management ─────────────────────────────────────────────
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    titleInputRef.current?.focus();

    // Close handler — ensures `onClose` fires on native Escape press too
    const handleClose = () => props.onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Label toggle ────────────────────────────────────────────────────────
  function toggleLabel(l: TaskLabel) {
    setLabels((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required");
      titleInputRef.current?.focus();
      return;
    }

    if (props.mode === "create") {
      props.onSubmit({
        title: trimmedTitle,
        description: description.trim() || null,
        status,
        priority,
        labels,
      });
    } else {
      props.onSubmit({
        id: props.task.id,
        title: trimmedTitle,
        description: description.trim() || null,
        priority,
        labels,
      });
    }
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      id="task-dialog"
      aria-labelledby="task-dialog-title"
      aria-modal="true"
      onCancel={props.onClose}
      className="m-auto w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-0 shadow-xl backdrop:bg-black/40 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2
            id="task-dialog-title"
            className="text-base font-semibold text-zinc-900 dark:text-white"
          >
            {props.mode === "create" ? "New task" : "Edit task"}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 py-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-title"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title <span aria-hidden="true">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="task-title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError("");
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="What needs to be done?"
            />
            {titleError && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                {titleError}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-desc"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Optional details…"
            />
          </div>

          {/* Status (create only — moves are done via DnD in edit mode) */}
          {props.mode === "create" && (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="task-status"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Column
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {COLUMN_META[s].title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Priority */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Priority
            </legend>
            <div className="flex flex-wrap gap-2">
              {ALL_PRIORITIES.map((p) => {
                const meta = PRIORITY_META[p];
                const active = priority === p;
                return (
                  <label
                    key={p}
                    className={[
                      "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      active
                        ? `${meta.badge} border-current`
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={active}
                      onChange={() => setPriority(p)}
                      className="sr-only"
                    />
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                      aria-hidden="true"
                    />
                    {meta.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Labels */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Labels
            </legend>
            <div className="flex flex-wrap gap-2">
              {ALL_LABELS.map((l) => {
                const meta = LABEL_META[l];
                const active = labels.includes(l);
                return (
                  <label
                    key={l}
                    className={[
                      "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      active
                        ? `${meta.badge} border-current`
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      value={l}
                      checked={active}
                      onChange={() => toggleLabel(l)}
                      className="sr-only"
                    />
                    {meta.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            {props.mode === "create" ? "Add task" : "Save changes"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function CloseIcon() {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
