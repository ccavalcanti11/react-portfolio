# Frontend Portfolio

A **single Next.js application** that hosts four production-quality frontend projects under one roof — sharing a design system, Apollo Client, and deployment. GraphQL throughout. TypeScript end-to-end.

---

## Projects

### ✅ 01 — GitHub Profile Explorer &nbsp;`/github/:username`

Look up any GitHub user and browse their public repositories, languages, stars, and activity.

- GitHub GraphQL API via Apollo Client
- Debounced search input (custom `useDebounce` hook)
- Cursor-based load-more pagination with `InMemoryCache` merge policies
- Skeleton loading states and graceful error handling
- Fully responsive layout

### ✅ 02 — Dev Blog &nbsp;`/blog`

A developer blog backed by a headless CMS (Hygraph) with statically generated pages and on-demand revalidation.

- Next.js SSG + ISR (`revalidate = 3600`) via `fetch` + `next.revalidate`
- `generateStaticParams` for all post slugs at build time
- Client-side tag filter (zero extra network requests)
- Per-page SEO metadata with the `next/metadata` API
- Dark / light theme toggle with no flash of unstyled content (blocking inline script)

### ✅ 03 — Real-Time Kanban Board &nbsp;`/board`

A drag-and-drop task board with live updates that arrive via a GraphQL subscription simulation.

- Drag & drop with [@dnd-kit](https://dndkit.com/) — `PointerSensor` (8 px activation distance) + `KeyboardSensor` for full accessibility
- Optimistic UI — cards move instantly before any server round-trip
- `useReducer` state machine with 8 action types; columns derived via memoised selector
- `ON_TASK_CHANGED` GraphQL subscription document wired to a local `setInterval` emitter (drop-in replacement for a real `graphql-ws` backend)
- Create / edit / delete tasks via a native `<dialog>` modal with focus management
- Priority + label filter bar (`aria-pressed` pills)
- Live indicator that pulses on each subscription event

### ✅ 04 — Trade Intelligence Knowledge Graph &nbsp;`/graph`

An interactive, force-directed knowledge graph explorer modelling global commodity trade flows — countries, commodities, and energy companies connected by realistic 2024 market data.

- **D3 v7 force simulation** — physics-based layout with zoom, pan, and per-node drag; arrowheads encode edge directionality; stroke width encodes trade volume
- **"Walk the data"** — click any node to highlight its connections and see domain-specific properties (GDP, market cap, spot prices, global demand); every click appends a step to a clickable breadcrumb trail
- **BFS shortest-path finder** — type any entity name in the side panel to highlight the shortest relationship chain across the full graph, mirroring Cypher's `shortestPath()` pattern
- 24 typed nodes across three entity types (`country`, `commodity`, `company`) and 58 typed edges across five relationship types (`TRADE_FLOW`, `EXPORTS`, `IMPORTS`, `PRODUCES`, `OPERATES_IN`)
- Node type filter, edge type filter, and full-text search to focus on specific subgraphs
- Fully responsive — entity panel on the side on desktop, slides up from bottom on mobile
- D3 simulation runs off React's render cycle; a dedicated second effect updates only visual properties (opacity, stroke) without restarting physics

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework — SSG, ISR, server & client components |
| [React 19](https://react.dev/) | UI library |
| [Apollo Client v4](https://www.apollographql.com/docs/react/) | GraphQL client — queries, mutations, subscriptions |
| [GraphQL](https://graphql.org/) | Query language used across all four projects |
| [D3.js v7](https://d3js.org/) | Force simulation, zoom, drag — knowledge graph (Project 4) |
| [@dnd-kit](https://dndkit.com/) | Accessible drag-and-drop (Project 3) |
| [graphql-ws](https://github.com/enisdenjo/graphql-ws) | WebSocket subscription transport (Project 3) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first design system |
| [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety end-to-end |
| [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react) | Unit testing |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm / yarn)

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Create `.env.local` and add the relevant tokens:

```env
# Project 1 — GitHub GraphQL API
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token

# Project 2 — Hygraph CMS (optional — falls back to mock data)
HYGRAPH_ENDPOINT=https://your-region.hygraph.com/v2/your-project/master
HYGRAPH_TOKEN=your_hygraph_token

# Project 3 — Kanban board backend (optional — falls back to simulation)
NEXT_PUBLIC_BOARD_HTTP_URL=https://your-board-server.example.com/graphql
NEXT_PUBLIC_BOARD_WS_URL=wss://your-board-server.example.com/graphql
```

> **Without any env vars the app runs in demo mode**: mock blog posts, a subscription simulation, and a fully self-contained graph dataset are used so everything is visible without external services.

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Portfolio hub — cards linking to all 4 projects
│   ├── layout.tsx                # Root layout — ApolloWrapper, theme script
│   ├── github/[username]/        # Project 1: GitHub Profile Explorer
│   ├── blog/                     # Project 2: Dev Blog (SSG + ISR)
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── board/                    # Project 3: Real-Time Kanban Board
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── graph/                    # Project 4: Trade Intelligence Knowledge Graph
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── ApolloWrapper.tsx          # Apollo Provider (client component)
│   ├── ThemeToggle.tsx            # Dark / light toggle
│   ├── github/                   # Project 1 components
│   ├── blog/                     # Project 2 components
│   ├── board/                    # Project 3 components
│   │   ├── BoardColumn.tsx        # Droppable column with SortableContext
│   │   ├── TaskCard.tsx           # Sortable card with drag handle + menu
│   │   ├── TaskDialog.tsx         # Create / edit modal (<dialog>)
│   │   ├── FilterBar.tsx          # Priority + label filter pills
│   │   └── LiveIndicator.tsx      # Subscription pulse indicator
│   └── graph/                    # Project 4 components
│       ├── GraphCanvas.tsx        # D3 force simulation — full SVG rendering
│       ├── EntityPanel.tsx        # Node details + path finder UI
│       ├── GraphToolbar.tsx       # Node/edge type filters + search
│       ├── WalkBreadcrumb.tsx     # Clickable exploration trail
│       └── GraphLegend.tsx        # SVG colour key
├── hooks/
│   ├── useDebounce.ts             # Generic debounce hook (Project 1)
│   ├── useGitHubProfile.ts        # GitHub data hook (Project 1)
│   ├── useBoard.ts                # Kanban state machine (Project 3)
│   └── useGraph.ts                # Graph selection, walk trail, BFS, filters (Project 4)
├── lib/
│   ├── apollo-client.ts           # HTTP + WS split-link Apollo factory
│   ├── github/                   # Project 1 — types & GraphQL queries
│   ├── blog/                     # Project 2 — types, queries, CMS client
│   ├── board/                    # Project 3 — types, queries, mock data
│   └── graph/                    # Project 4 — types, mock data, graph utilities
│       ├── types.ts               # GraphNode, GraphEdge, WalkStep, SimEdge…
│       ├── mock-data.ts           # 24 nodes, 58 edges — 2024 trade data
│       └── graph-utils.ts         # BFS path finder, adjacency map, filter engine
└── __tests__/                    # Unit tests (Jest + RTL)
    ├── apollo-client.test.ts
    ├── ApolloWrapper.test.tsx
    ├── page.test.tsx
    ├── RepositoryCard.test.tsx
    ├── useDebounce.test.ts
    └── board/
        ├── useBoard.test.ts       # Pure reducer — 8 action types
        └── TaskCard.test.tsx      # Render + interaction tests
```

---

## Architecture highlights

**One app, four feature areas.** All projects share the same Tailwind design tokens, Apollo Client, and root layout — the same way a real product grows one feature at a time inside a single codebase.

**Server vs. client components.** The blog uses server components for static rendering; the GitHub explorer, Kanban board, and knowledge graph use client components where interactivity and hooks are required. Both patterns live side-by-side in the same App Router app.

**GraphQL subscription architecture.** The Apollo Client is configured with a `split` link: subscription operations route to a `GraphQLWsLink` (WebSocket); queries and mutations route to `HttpLink`. When `NEXT_PUBLIC_BOARD_WS_URL` is not set the board falls back to a local simulation — no backend required to evaluate the project.

**Pure reducer state.** The Kanban board's `boardReducer` is a plain function — no React, no side-effects. Every state transition is tested directly by passing `(state, action)` pairs, giving complete branch coverage without mounting any components.

**D3 + React co-existence.** The knowledge graph runs D3's force simulation entirely outside React's render cycle. The first `useEffect` builds the simulation and the full SVG DOM when the dataset changes. A second, lighter `useEffect` updates only visual properties (opacity, stroke colour, ring visibility) when selection or path state changes — without ever restarting the physics engine. This pattern avoids the common pitfall of tearing down and rebuilding a simulation on every render.
