// ---------------------------------------------------------------------------
// TaskCard — render tests
//
// Verifies the card renders all expected data and exposes the right
// accessibility attributes. DnD is not tested here (it requires a full
// DndContext); the interaction tests below use userEvent.
// ---------------------------------------------------------------------------

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "@/components/board/TaskCard";
import type { Task } from "@/lib/board/types";

// dnd-kit hooks read layout information that jsdom can't provide.
// Mock useSortable so the component renders without DnD errors in tests.
jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

// CSS.Transform.toString is used for the card's style.transform
jest.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => "" } },
}));

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const baseTask: Task = {
  id: "task-1",
  title: "Implement optimistic UI",
  description: "Update Apollo cache before the server confirms the mutation.",
  status: "IN_PROGRESS",
  priority: "HIGH",
  labels: ["FEATURE", "REFACTOR"],
  assignee: "Carlos",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  order: 0,
};

function renderCard(
  task: Task = baseTask,
  handlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  },
) {
  const result = render(
    <TaskCard task={task} onEdit={handlers.onEdit} onDelete={handlers.onDelete} />,
  );
  return { ...result, ...handlers };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

describe("TaskCard — rendering", () => {
  it("renders the task title", () => {
    renderCard();
    expect(screen.getByText("Implement optimistic UI")).toBeInTheDocument();
  });

  it("renders the task description", () => {
    renderCard();
    expect(
      screen.getByText(
        "Update Apollo cache before the server confirms the mutation.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the priority badge", () => {
    renderCard();
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders all label chips", () => {
    renderCard();
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Refactor")).toBeInTheDocument();
  });

  it("renders the assignee initial", () => {
    renderCard();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("omits description when null", () => {
    renderCard({ ...baseTask, description: null });
    expect(
      screen.queryByText(
        "Update Apollo cache before the server confirms the mutation.",
      ),
    ).not.toBeInTheDocument();
  });

  it("omits assignee when null", () => {
    renderCard({ ...baseTask, assignee: null });
    // "C" must not appear when there is no assignee
    expect(screen.queryByText("C")).not.toBeInTheDocument();
  });

  it("renders a drag handle with an aria-label", () => {
    renderCard();
    expect(
      screen.getByRole("button", { name: /Drag Implement optimistic UI/i }),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------

describe("TaskCard — menu interactions", () => {
  it("opens the menu on kebab button click", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(
      screen.getByRole("button", { name: /Open menu for Implement/i }),
    );
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();
  });

  it("calls onEdit with the task when Edit is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    render(
      <TaskCard task={baseTask} onEdit={onEdit} onDelete={jest.fn()} />,
    );
    await user.click(
      screen.getByRole("button", { name: /Open menu for Implement/i }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it("calls onDelete with the task id when Delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    render(
      <TaskCard task={baseTask} onEdit={jest.fn()} onDelete={onDelete} />,
    );
    await user.click(
      screen.getByRole("button", { name: /Open menu for Implement/i }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });

  it("closes the menu after clicking a menu item", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(
      screen.getByRole("button", { name: /Open menu for Implement/i }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(
      screen.queryByRole("menuitem", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });
});
