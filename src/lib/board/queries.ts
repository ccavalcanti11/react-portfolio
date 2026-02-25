import { gql } from "@apollo/client";

// ---------------------------------------------------------------------------
// Kanban Board — GraphQL documents
//
// These are the exact queries, mutations, and subscriptions that would be
// sent to a live graphql-ws / Apollo Server backend. The naming and shape
// match the mock data and TypeScript interfaces in `./types.ts` so the
// backend schema and frontend types stay in sync.
//
// Connecting a real server:
//   1. Set NEXT_PUBLIC_BOARD_HTTP_URL and NEXT_PUBLIC_BOARD_WS_URL in .env.local
//   2. The Apollo Client in `lib/apollo-client.ts` will switch to split links
//   3. No changes are needed in the UI components — they use the same hooks
// ---------------------------------------------------------------------------

// ─── Query ──────────────────────────────────────────────────────────────────

export const GET_BOARD = gql`
  query GetBoard($boardId: ID!) {
    board(id: $boardId) {
      id
      title
      tasks {
        id
        title
        description
        status
        priority
        labels
        assignee
        order
        createdAt
        updatedAt
      }
    }
  }
`;

// ─── Mutations ──────────────────────────────────────────────────────────────

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      labels
      assignee
      order
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      description
      priority
      labels
      updatedAt
    }
  }
`;

export const MOVE_TASK = gql`
  mutation MoveTask($input: MoveTaskInput!) {
    moveTask(input: $input) {
      id
      status
      order
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

// ─── Subscription ────────────────────────────────────────────────────────────

/**
 * Subscribes to all task changes on a board (create / update / move / delete).
 *
 * The server pushes a `TaskEvent` object whose `type` field tells the client
 * which reducer action to dispatch. This delta-based approach means the board
 * stays consistent across tabs without any polling.
 *
 * In demo mode this subscription is replaced by a local setInterval emitter
 * in `hooks/useBoard.ts` that fires events of the same shape.
 */
export const ON_TASK_CHANGED = gql`
  subscription OnTaskChanged($boardId: ID!) {
    taskChanged(boardId: $boardId) {
      type # CREATED | UPDATED | MOVED | DELETED
      task {
        id
        title
        description
        status
        priority
        labels
        assignee
        order
        updatedAt
      }
    }
  }
`;
