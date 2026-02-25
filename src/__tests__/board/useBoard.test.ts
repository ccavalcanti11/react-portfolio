// ---------------------------------------------------------------------------
// useBoard reducer — unit tests
//
// Tests cover every action type in the discriminated union. Each test is a
// pure function call: (state, action) → newState. No React, no side-effects,
// no timers. This is the advantage of useReducer over scattered useState calls.
// ---------------------------------------------------------------------------

import { boardReducer } from "@/hooks/useBoard";
import type { BoardFilters } from "@/hooks/useBoard";
import type { Task } from "@/lib/board/types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "t1",
  title: "Test task",
  description: null,
  status: "TODO",
  priority: "MEDIUM",
  labels: [],
  assignee: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  order: 0,
  ...overrides,
});

const emptyFilters: BoardFilters = { priority: null, label: null };

const baseState = {
  tasks: [
    makeTask({ id: "t1", status: "TODO", order: 0 }),
    makeTask({ id: "t2", status: "TODO", order: 1 }),
    makeTask({ id: "t3", status: "IN_PROGRESS", order: 0 }),
  ],
  filters: emptyFilters,
  lastEventAt: null,
};

// ---------------------------------------------------------------------------
// CREATE_TASK
// ---------------------------------------------------------------------------

describe("boardReducer — CREATE_TASK", () => {
  it("appends the new task to the tasks array", () => {
    const newTask = makeTask({ id: "t99", status: "DONE", order: 0 });
    const next = boardReducer(baseState, {
      type: "CREATE_TASK",
      payload: newTask,
    });
    expect(next.tasks).toHaveLength(4);
    expect(next.tasks.find((t) => t.id === "t99")).toEqual(newTask);
  });

  it("does not mutate the existing tasks", () => {
    const newTask = makeTask({ id: "t100", status: "TODO", order: 2 });
    const next = boardReducer(baseState, {
      type: "CREATE_TASK",
      payload: newTask,
    });
    expect(baseState.tasks).toHaveLength(3);
    expect(next.tasks).not.toBe(baseState.tasks);
  });
});

// ---------------------------------------------------------------------------
// UPDATE_TASK
// ---------------------------------------------------------------------------

describe("boardReducer — UPDATE_TASK", () => {
  it("updates only the specified task fields", () => {
    const next = boardReducer(baseState, {
      type: "UPDATE_TASK",
      payload: { id: "t1", title: "Updated title", priority: "HIGH" },
    });
    const updated = next.tasks.find((t) => t.id === "t1")!;
    expect(updated.title).toBe("Updated title");
    expect(updated.priority).toBe("HIGH");
    // Other fields are untouched
    expect(updated.status).toBe("TODO");
  });

  it("updates the updatedAt timestamp", () => {
    const before = baseState.tasks.find((t) => t.id === "t1")!.updatedAt;
    const next = boardReducer(baseState, {
      type: "UPDATE_TASK",
      payload: { id: "t1", title: "New title" },
    });
    const after = next.tasks.find((t) => t.id === "t1")!.updatedAt;
    expect(after).not.toBe(before);
  });

  it("leaves other tasks unchanged", () => {
    const next = boardReducer(baseState, {
      type: "UPDATE_TASK",
      payload: { id: "t1", title: "Changed" },
    });
    expect(next.tasks.find((t) => t.id === "t2")).toEqual(
      baseState.tasks.find((t) => t.id === "t2"),
    );
  });
});

// ---------------------------------------------------------------------------
// DELETE_TASK
// ---------------------------------------------------------------------------

describe("boardReducer — DELETE_TASK", () => {
  it("removes the task with the given id", () => {
    const next = boardReducer(baseState, {
      type: "DELETE_TASK",
      payload: "t1",
    });
    expect(next.tasks.find((t) => t.id === "t1")).toBeUndefined();
    expect(next.tasks).toHaveLength(2);
  });

  it("returns original state for an unknown id", () => {
    const next = boardReducer(baseState, {
      type: "DELETE_TASK",
      payload: "nonexistent",
    });
    expect(next.tasks).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// MOVE_TASK (cross-column)
// ---------------------------------------------------------------------------

describe("boardReducer — MOVE_TASK", () => {
  it("moves the task to the new status column", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_TASK",
      payload: { id: "t1", toStatus: "DONE", toIndex: 0 },
    });
    const moved = next.tasks.find((t) => t.id === "t1")!;
    expect(moved.status).toBe("DONE");
  });

  it("places the task at the specified index", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_TASK",
      payload: { id: "t1", toStatus: "IN_PROGRESS", toIndex: 0 },
    });
    const inProgress = next.tasks
      .filter((t) => t.status === "IN_PROGRESS")
      .sort((a, b) => a.order - b.order);
    expect(inProgress[0].id).toBe("t1");
  });

  it("reindexes the destination column contiguously", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_TASK",
      payload: { id: "t1", toStatus: "IN_PROGRESS", toIndex: 0 },
    });
    const inProgress = next.tasks
      .filter((t) => t.status === "IN_PROGRESS")
      .sort((a, b) => a.order - b.order);
    inProgress.forEach((t, i) => expect(t.order).toBe(i));
  });

  it("returns original state for an unknown id", () => {
    const next = boardReducer(baseState, {
      type: "MOVE_TASK",
      payload: { id: "unknown", toStatus: "DONE", toIndex: 0 },
    });
    expect(next).toEqual(baseState);
  });
});

// ---------------------------------------------------------------------------
// REORDER_IN_COLUMN (same-column)
// ---------------------------------------------------------------------------

describe("boardReducer — REORDER_IN_COLUMN", () => {
  it("swaps two tasks within the same column", () => {
    const next = boardReducer(baseState, {
      type: "REORDER_IN_COLUMN",
      payload: { id: "t1", fromIndex: 0, toIndex: 1, status: "TODO" },
    });
    const todoTasks = next.tasks
      .filter((t) => t.status === "TODO")
      .sort((a, b) => a.order - b.order);
    expect(todoTasks[0].id).toBe("t2");
    expect(todoTasks[1].id).toBe("t1");
  });

  it("is a no-op when fromIndex equals toIndex", () => {
    const next = boardReducer(baseState, {
      type: "REORDER_IN_COLUMN",
      payload: { id: "t1", fromIndex: 0, toIndex: 0, status: "TODO" },
    });
    expect(next).toBe(baseState);
  });
});

// ---------------------------------------------------------------------------
// SUBSCRIPTION_EVENT
// ---------------------------------------------------------------------------

describe("boardReducer — SUBSCRIPTION_EVENT", () => {
  it("updates an existing task when ids match", () => {
    const updated = makeTask({ id: "t1", title: "From subscription" });
    const next = boardReducer(baseState, {
      type: "SUBSCRIPTION_EVENT",
      payload: updated,
    });
    expect(next.tasks.find((t) => t.id === "t1")?.title).toBe(
      "From subscription",
    );
    expect(next.tasks).toHaveLength(3); // no duplicates
  });

  it("appends a new task when id is not found", () => {
    const newRemoteTask = makeTask({ id: "t-remote", title: "Remote task" });
    const next = boardReducer(baseState, {
      type: "SUBSCRIPTION_EVENT",
      payload: newRemoteTask,
    });
    expect(next.tasks).toHaveLength(4);
  });

  it("sets lastEventAt to a recent timestamp", () => {
    const before = Date.now();
    const next = boardReducer(baseState, {
      type: "SUBSCRIPTION_EVENT",
      payload: makeTask({ id: "t1" }),
    });
    expect(next.lastEventAt).toBeGreaterThanOrEqual(before);
  });
});

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

describe("boardReducer — filters", () => {
  it("SET_FILTER_PRIORITY sets priority filter", () => {
    const next = boardReducer(baseState, {
      type: "SET_FILTER_PRIORITY",
      payload: "HIGH",
    });
    expect(next.filters.priority).toBe("HIGH");
  });

  it("SET_FILTER_LABEL sets label filter", () => {
    const next = boardReducer(baseState, {
      type: "SET_FILTER_LABEL",
      payload: "BUG",
    });
    expect(next.filters.label).toBe("BUG");
  });

  it("CLEAR_FILTERS resets both filters to null", () => {
    const withFilters = {
      ...baseState,
      filters: { priority: "HIGH" as const, label: "BUG" as const },
    };
    const next = boardReducer(withFilters, { type: "CLEAR_FILTERS" });
    expect(next.filters.priority).toBeNull();
    expect(next.filters.label).toBeNull();
  });
});
