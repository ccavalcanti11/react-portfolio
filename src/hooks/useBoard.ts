"use client";

// ---------------------------------------------------------------------------
// useBoard — central state machine for the Kanban board
//
// Architecture decisions
// ──────────────────────
// 1. useReducer instead of useState/Redux:
//    All state transitions are pure functions — easy to test, no side-effects,
//    and the action log doubles as an audit trail of every change.
//
// 2. Flat task array, derived columns:
//    Tasks are stored once. Columns are derived via a memoised selector each
//    render. This eliminates the "update two places" bug common in nested
//    column-of-tasks state shapes.
//
// 3. Subscription simulation:
//    The setInterval below emits task events in the same shape as the real
//    ON_TASK_CHANGED GraphQL subscription. Swapping it for useSubscription()
//    when a backend is available requires changing only this hook.
// ---------------------------------------------------------------------------

import { useReducer, useCallback, useEffect, useRef, useMemo } from "react";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskLabel,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/lib/board/types";
import { ALL_STATUSES, COLUMN_META } from "@/lib/board/types";
import { INITIAL_TASKS, generateTaskId } from "@/lib/board/mock-data";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface BoardFilters {
  priority: TaskPriority | null;
  label: TaskLabel | null;
}

interface BoardState {
  tasks: Task[];
  filters: BoardFilters;
  /** ms timestamp of the last subscription event — used by LiveIndicator */
  lastEventAt: number | null;
}

// ---------------------------------------------------------------------------
// Reducer actions — discriminated union ensures exhaustive handling
// ---------------------------------------------------------------------------

type BoardAction =
  | { type: "CREATE_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: UpdateTaskInput }
  | { type: "DELETE_TASK"; payload: string }
  | {
      type: "MOVE_TASK";
      payload: { id: string; toStatus: TaskStatus; toIndex: number };
    }
  | {
      type: "REORDER_IN_COLUMN";
      payload: {
        id: string;
        fromIndex: number;
        toIndex: number;
        status: TaskStatus;
      };
    }
  | { type: "SUBSCRIPTION_EVENT"; payload: Task }
  | { type: "SET_FILTER_PRIORITY"; payload: TaskPriority | null }
  | { type: "SET_FILTER_LABEL"; payload: TaskLabel | null }
  | { type: "CLEAR_FILTERS" };

// ---------------------------------------------------------------------------
// Pure reducer — every transition is a deterministic function of (state, action)
// ---------------------------------------------------------------------------

export function boardReducer(
  state: BoardState,
  action: BoardAction,
): BoardState {
  switch (action.type) {
    case "CREATE_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "UPDATE_TASK": {
      const { id, ...changes } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === id
            ? { ...t, ...changes, updatedAt: new Date().toISOString() }
            : t,
        ),
      };
    }

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case "MOVE_TASK": {
      const { id, toStatus, toIndex } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return state;

      const withoutTask = state.tasks.filter((t) => t.id !== id);
      const destTasks = withoutTask
        .filter((t) => t.status === toStatus)
        .sort((a, b) => a.order - b.order);

      // Clamp to valid bounds before splicing
      const clampedIndex = Math.min(toIndex, destTasks.length);
      destTasks.splice(clampedIndex, 0, {
        ...task,
        status: toStatus,
        updatedAt: new Date().toISOString(),
      });

      // Reassign contiguous order values to the destination column
      const reindexed = destTasks.map((t, i) => ({ ...t, order: i }));
      const otherTasks = withoutTask.filter((t) => t.status !== toStatus);

      return { ...state, tasks: [...otherTasks, ...reindexed] };
    }

    case "REORDER_IN_COLUMN": {
      const { id, fromIndex, toIndex, status } = action.payload;
      if (fromIndex === toIndex) return state;

      const columnTasks = state.tasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.order - b.order);

      const reordered = [...columnTasks];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);

      const reindexed = reordered.map((t, i) => ({ ...t, order: i }));
      const otherTasks = state.tasks.filter((t) => t.status !== status);

      return { ...state, tasks: [...otherTasks, ...reindexed] };
    }

    case "SUBSCRIPTION_EVENT": {
      const incoming = action.payload;
      const exists = state.tasks.some((t) => t.id === incoming.id);
      return {
        ...state,
        lastEventAt: Date.now(),
        tasks: exists
          ? state.tasks.map((t) => (t.id === incoming.id ? incoming : t))
          : [...state.tasks, incoming],
      };
    }

    case "SET_FILTER_PRIORITY":
      return {
        ...state,
        filters: { ...state.filters, priority: action.payload },
      };

    case "SET_FILTER_LABEL":
      return {
        ...state,
        filters: { ...state.filters, label: action.payload },
      };

    case "CLEAR_FILTERS":
      return { ...state, filters: { priority: null, label: null } };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Column derivation — memoised selector that produces the shape the UI needs
// ---------------------------------------------------------------------------

export interface BoardColumnData {
  status: TaskStatus;
  title: string;
  accent: string;
  emptyLabel: string;
  tasks: Task[];
}

function deriveColumns(
  tasks: Task[],
  filters: BoardFilters,
): BoardColumnData[] {
  const filtered = tasks.filter((t) => {
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.label && !t.labels.includes(filters.label)) return false;
    return true;
  });

  return ALL_STATUSES.map((status) => ({
    status,
    ...COLUMN_META[status],
    tasks: filtered
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order),
  }));
}

// ---------------------------------------------------------------------------
// Subscription simulation helpers
//
// Production replacement: remove this block and use Apollo's useSubscription
// with the ON_TASK_CHANGED document from lib/board/queries.ts.
// ---------------------------------------------------------------------------

const SIMULATION_INTERVAL_MS = 9_000;

const SIM_TITLES = [
  "Refactor auth middleware",
  "Fix hydration mismatch warning",
  "Add E2E tests for board drag-drop",
  "Optimise bundle — lazy-load dialogs",
  "Audit Lighthouse performance score",
  "Migrate to Edge Runtime",
  "Improve a11y: add focus-visible styles",
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// The hook
// ---------------------------------------------------------------------------

export function useBoard() {
  const [state, dispatch] = useReducer(boardReducer, {
    tasks: INITIAL_TASKS,
    filters: { priority: null, label: null },
    lastEventAt: null,
  });

  // Keep a stable ref so the interval closure reads the latest tasks
  // without needing to be in the dependency array.
  const tasksRef = useRef(state.tasks);
  tasksRef.current = state.tasks;

  const simCycleRef = useRef(0);

  // ── Subscription simulation ───────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      simCycleRef.current += 1;
      const cycle = simCycleRef.current;

      if (cycle % 3 === 0) {
        // Every 3rd cycle: simulate a remote user creating a new task
        const statuses: readonly TaskStatus[] = ["TODO", "IN_PROGRESS"];
        const priorities: readonly TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
        const labels: readonly TaskLabel[] = [
          "BUG",
          "FEATURE",
          "REFACTOR",
          "TEST",
        ];
        const assignees = ["Alice", "Bob", null] as const;
        const currentTasks = tasksRef.current;
        const destStatus = pickRandom(statuses);
        const destOrder = currentTasks.filter(
          (t) => t.status === destStatus,
        ).length;

        dispatch({
          type: "SUBSCRIPTION_EVENT",
          payload: {
            id: generateTaskId(),
            title: pickRandom(SIM_TITLES),
            description: null,
            status: destStatus,
            priority: pickRandom(priorities),
            labels: [pickRandom(labels)],
            assignee: pickRandom(assignees),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            order: destOrder,
          },
        });
      } else {
        // Otherwise: simulate a remote user making a minor edit to a task
        const tasks = tasksRef.current;
        if (tasks.length === 0) return;
        const task = pickRandom(tasks);
        dispatch({
          type: "SUBSCRIPTION_EVENT",
          payload: { ...task, updatedAt: new Date().toISOString() },
        });
      }
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(id);
  }, []); // intentionally empty — reads latest state via ref

  // ── Derived columns ───────────────────────────────────────────────────────
  const columns = useMemo(
    () => deriveColumns(state.tasks, state.filters),
    [state.tasks, state.filters],
  );

  // ── Action dispatchers ────────────────────────────────────────────────────
  const createTask = useCallback(
    (input: CreateTaskInput) => {
      const colCount = state.tasks.filter(
        (t) => t.status === input.status,
      ).length;
      dispatch({
        type: "CREATE_TASK",
        payload: {
          id: generateTaskId(),
          title: input.title,
          description: input.description ?? null,
          status: input.status,
          priority: input.priority,
          labels: input.labels ?? [],
          assignee: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: colCount, // append to end of the column
        },
      });
    },
    [state.tasks],
  );

  const updateTask = useCallback((input: UpdateTaskInput) => {
    dispatch({ type: "UPDATE_TASK", payload: input });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  }, []);

  const moveTask = useCallback(
    (id: string, toStatus: TaskStatus, toIndex: number) => {
      dispatch({ type: "MOVE_TASK", payload: { id, toStatus, toIndex } });
    },
    [],
  );

  const reorderInColumn = useCallback(
    (id: string, fromIndex: number, toIndex: number, status: TaskStatus) => {
      dispatch({
        type: "REORDER_IN_COLUMN",
        payload: { id, fromIndex, toIndex, status },
      });
    },
    [],
  );

  const setFilterPriority = useCallback((priority: TaskPriority | null) => {
    dispatch({ type: "SET_FILTER_PRIORITY", payload: priority });
  }, []);

  const setFilterLabel = useCallback((label: TaskLabel | null) => {
    dispatch({ type: "SET_FILTER_LABEL", payload: label });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
  }, []);

  const hasActiveFilters =
    state.filters.priority !== null || state.filters.label !== null;

  return {
    columns,
    filters: state.filters,
    hasActiveFilters,
    lastEventAt: state.lastEventAt,
    totalTasks: state.tasks.length,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderInColumn,
    setFilterPriority,
    setFilterLabel,
    clearFilters,
  };
}
