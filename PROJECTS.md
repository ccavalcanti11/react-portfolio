# Portfolio Projects

This is a **single Next.js application** that hosts all four portfolio projects under one roof. All projects share the same codebase, design system, Apollo client, and deployment — just like a real-world product that grows one feature at a time.

A portfolio hub at `/` acts as the landing page: four project cards, each linking into its own route. The recruiter lands on one URL, sees everything immediately, and dives into whichever project interests them.

---

## Architecture

### Why one app instead of three

- **One URL to share.** A single link showcases everything. Three separate links risk the reviewer only visiting one.
- **Demonstrates real-world structure.** Knowing how to organise multiple feature areas inside one scalable codebase is itself a skill worth showing.
- **Shared infrastructure.** The Apollo client, design tokens, reusable components (buttons, cards, skeletons), and Tailwind config are written once and used everywhere.
- **One deployment.** One Vercel/Netlify project, one `.env`, one CI pipeline.

### Folder structure

```
src/app/
  page.tsx                   ← Portfolio hub — cards linking to all 4 projects
  github/
    [username]/page.tsx       ← Project 1: GitHub Profile Explorer
  blog/
    page.tsx                  ← Project 2: Dev Blog
    [slug]/page.tsx
  board/
    page.tsx                  ← Project 3: Real-Time Kanban Board
  graph/
    page.tsx                  ← Project 4: Trade Intelligence Knowledge Graph
```

### Note on Project 3

Project 3 requires a GraphQL **subscriptions** server (WebSocket transport). That backend will be hosted separately (e.g. a small Node + `graphql-ws` server). The frontend still lives in this app — it simply connects to an external endpoint. This is standard practice in production and is a realistic architecture to demonstrate.

---

## Project 1 — GitHub Profile Explorer

**Status:** ✅ Complete — live at `/github/:username`

### What it is
A search tool that lets users look up any GitHub username and browse their public repositories, languages, stars, and activity. Data is fetched through a **GraphQL API** (GitHub's public GraphQL endpoint) using **Apollo Client**.

### Objective
Demonstrate real-world GraphQL consumption — writing queries, handling loading/error states, and managing the Apollo cache — inside a Next.js App Router application.

### Scope
- Search input with debounce (no request on every keystroke)
- Profile page showing avatar, bio, follower count, and pinned repos
- Repository list with language badges, star/fork counts, and links
- Pagination or infinite scroll for repositories
- Skeleton loading states and graceful error handling
- Fully responsive layout (mobile → desktop)

### Skills highlighted
| Skill | How it shows up |
|---|---|
| React / Next.js | App Router pages, server and client components |
| GraphQL + Apollo Client | GitHub GraphQL API, queries, variables, caching |
| TypeScript | Typed query results with `graphql-codegen` or manual types |
| JavaScript ES6+ | Debounce, async patterns, optional chaining |
| Responsive UI | Fluid grid layout for all screen sizes |
| Performance | Apollo cache preventing redundant network calls |
| Clean code | Reusable components, custom hooks (`useProfileQuery`) |

### Business value

Most product companies consume at least one external GraphQL API — payment providers, CMSs, internal microservices, or third-party data sources. The core challenge is always the same: write a typed query, handle the network lifecycle cleanly (loading, error, empty, success), cache responses so the UI feels instant, and paginate without re-fetching already-loaded data.

This project demonstrates exactly that workflow in a realistic context. A frontend engineer who can do this with the GitHub API on day one can do it against any company API with minimal ramp-up time.

---

## Project 2 — Dev Blog with CMS-backed Content

**Status:** ✅ Complete — live at `/blog`

### What it is
A personal developer blog where posts are managed in a headless CMS (e.g., **Hygraph** or **Contentful**, both of which expose a GraphQL API) and rendered as statically generated pages via Next.js.

### Objective
Showcase **static site generation (SSG)** and **incremental static regeneration (ISR)** inside Next.js, combined with GraphQL data fetching at build time and on-demand revalidation — a common pattern in production codebases.

### Scope
- Home page listing all posts (title, excerpt, cover image, tags, date)
- Individual post pages generated statically at build time (`generateStaticParams`)
- Tag filtering to browse posts by topic
- Dark/light theme toggle persisted in `localStorage`
- SEO metadata per page (`next/metadata` API)
- ISR so new CMS content appears without a full redeploy
- Responsive typography and layout

### Skills highlighted
| Skill | How it shows up |
|---|---|
| Next.js | SSG, ISR, App Router, `generateStaticParams`, `metadata` API |
| GraphQL + Apollo Client | Build-time and server-side queries against CMS GraphQL API |
| TypeScript | Typed CMS response models, strict null checks |
| HTML5 / CSS3 | Semantic markup, accessible blog post layout |
| Responsive UI | Mobile-first post list and reading view |
| Performance | Static generation + ISR = near-zero server response time |
| Clean, maintainable code | Separation of data-fetching logic from UI components |
| Scalable architecture | Feature-based folder structure, reusable content components |

### Business value

Marketing pages, documentation sites, product landing pages, and editorial content are overwhelmingly built with SSG and ISR today — because a static HTML file served from a CDN edge node loads in milliseconds anywhere in the world, costs almost nothing to host, and scores near-perfect on Core Web Vitals.

The pattern this project demonstrates — pull content from a CMS at build time, ship pre-rendered HTML, revalidate on demand when editors publish — is the default architecture for any content-heavy production site. A frontend engineer who understands ISR revalidation, `generateStaticParams`, and `next/metadata` can own the performance and SEO story of a company's public-facing pages from day one.

---

## Project 3 — Real-Time Task Board (Kanban)

**Status:** ✅ Complete — live at `/board`

### What it is
A drag-and-drop Kanban board (think a simplified Trello) where tasks can be created, moved between columns, and updated. It uses a **GraphQL API with subscriptions** to reflect changes in real time across browser tabs.

### Objective
Demonstrate advanced GraphQL usage (mutations, subscriptions), optimistic UI updates, and the ability to build a non-trivial, interactive feature that requires careful state management and performance thinking.

### Scope
- Columns representing task statuses (e.g., To Do → In Progress → Done)
- Drag-and-drop reordering of tasks within and between columns
- Create / edit / delete tasks via **GraphQL mutations**
- Real-time updates via **GraphQL subscriptions** (WebSocket transport)
- Optimistic UI — the card moves instantly before the server confirms
- Filtering tasks by label or priority
- Fully responsive — usable on tablet and desktop
- Unit tests for core components and hooks

### Skills highlighted
| Skill | How it shows up |
|---|---|
| ReactJS | Complex interactive UI, drag-and-drop, controlled state |
| Next.js | App Router, client components where interactivity requires it |
| GraphQL + Apollo Client | Queries, mutations, subscriptions, optimistic responses |
| TypeScript | Strict types for task models, board state, mutation variables |
| Performance optimization | Optimistic UI, memoization to avoid unnecessary re-renders |
| Responsive UI | Board layout that adapts from desktop columns to mobile scroll |
| Clean, maintainable code | Custom hooks isolating board logic from presentation |
| Cross-browser debugging | Drag-and-drop behaviour tested across Chrome, Firefox, Safari |
| Engineering practices | Unit tests with Jest + React Testing Library |
| Scalable architecture | Domain-driven folder structure ready to add features |

### Business value

Collaborative, real-time UIs are one of the hardest frontend problems to get right: a card that moves on screen before the server confirms, a list that stays consistent across tabs, a drag-and-drop interaction that never loses state. Getting these wrong produces the most visible, user-facing bugs — and fixing them under pressure is expensive.

This project shows the three techniques that solve it in production: **optimistic UI** (instant feedback without waiting for the network), **GraphQL subscriptions** (push-based updates that replace polling), and **memoisation** (preventing the entire board from re-rendering when one card changes). A frontend engineer who has built this from scratch can reason about real-time state, spot race conditions, and make informed trade-offs about where to put optimistic logic — skills directly applicable to any product with collaborative or live-updating features.

---

## Project 4 — Trade Intelligence Knowledge Graph

**Status:** ✅ Complete — live at `/graph`

### What it is
An interactive, force-directed knowledge graph explorer that models global commodity trade flows — 12 countries, 4 commodities (LNG, Crude Oil, Iron Ore, LPG), and 8 major energy companies (Saudi Aramco, QatarEnergy, Shell, BP, TotalEnergies, Equinor, Chevron, CNOOC) connected by 58 typed relationships grounded in realistic 2024 market data.

The core interaction is **"walking the data"**: click any node to see its connections and domain-specific properties, follow an edge to navigate to a neighbour, and build up a breadcrumb trail of the exploration path. A BFS path finder lets users discover the shortest relationship chain between any two entities in the graph.

### Objective
Demonstrate advanced data visualisation and the ability to build intuitive, high-performance UIs for complex, interconnected data structures — directly mirroring the "knowledge graph platform" concept where users collaboratively explore relationships to discover high-value insights.

### Scope
- Force-directed graph simulation powered by **D3 v7** (`d3-force`, `d3-zoom`, `d3-drag`)
- 24 typed nodes across three entity types: `country`, `commodity`, `company`
- 58 typed edges across five relationship types: `TRADE_FLOW`, `EXPORTS`, `IMPORTS`, `PRODUCES`, `OPERATES_IN`
- Click a node to select it — highlights all direct neighbours, dims the rest, and appends to the walk trail
- **"Walk the data"** breadcrumb — a clickable trail of every node visited; click any prior step to jump back
- **BFS shortest-path finder** — type any node name in the panel to highlight the shortest relationship chain across the graph
- Node type filter, edge type filter, and full-text search to focus on specific subgraphs
- Animated arrowheads indicating edge directionality; stroke width encodes trade volume weight
- Entity panel showing domain-specific properties per node type (GDP, market cap, spot prices, global demand figures)
- Drag to pin/unpin individual nodes; scroll/pinch to zoom; double-click background to reset view
- Stats overlay showing visible node/edge counts and active path length
- Fully responsive — entity panel on the side on desktop, slides up from bottom on mobile

### Data model

The graph follows the **property graph model** used by databases such as Neo4j and AWS Neptune:

```
(Node { id, type, label, properties })
-[Edge { id, type, source, target, weight, properties }]->
(Node)
```

Edge properties are typed per relationship:
- `TradeEdgeProperties` — `{ volumeLabel, yearEstimate, trend, notes? }`
- `OperationalEdgeProperties` — `{ since?, notes? }`

The BFS path finder mirrors the graph traversal query `shortestPath((a)-[*]-(b))` in Cypher (Neo4j) or `g.V(a).repeat(both().simplePath()).until(hasId(b)).path().limit(1)` in Gremlin (AWS Neptune).

### Skills highlighted
| Skill | How it shows up |
|---|---|
| React / Next.js | Client components, custom hooks, layout system |
| D3.js v7 | Force simulation, zoom, drag, tick-based SVG rendering |
| TypeScript | Discriminated union types per node/edge, fully typed D3 generics |
| Data visualisation | Force layout, directional arrowheads, opacity/glow highlighting |
| Graph algorithms | BFS shortest path, adjacency map construction, filter engine |
| Advanced state management | `useGraph` hook managing selection, walk trail, path, and filters |
| Performance | D3 simulation runs off React's render cycle; second effect updates only visual styles without restarting physics |
| Domain knowledge | Realistic 2024 commodity trade data: LNG flows, crude diversion routes, company-country-commodity relationships |
| Clean, maintainable code | Separation of simulation logic (D3 effect), visual update logic (second effect), and state (hook) |
| Scalable architecture | Graph lib layer (`types`, `mock-data`, `graph-utils`) fully decoupled from components |

### Business value

The hardest part of building a data product is not fetching and storing the data — it is making complex, interconnected data **navigable** for a non-technical user. A knowledge graph is the most demanding version of this problem: every node is both data and navigation, every edge is both a relationship and a path, and the user needs to feel oriented even when the dataset is large.

This project demonstrates the three capabilities that make a knowledge graph UI genuinely useful:

1. **Spatial layout that encodes meaning.** The D3 force simulation places highly-connected nodes (e.g. China, Qatar, LNG) near the centre of the graph naturally — the structure itself becomes a visual signal about which entities are most important.
2. **Progressive disclosure through walking.** Rather than presenting all 58 relationships at once, the entity panel reveals only the edges of the selected node. The walk trail provides context of how the user arrived there, so they never feel lost.
3. **Algorithmic insight on demand.** The BFS path finder answers the kind of question that drives real commodity intelligence: *"What is the shortest chain of relationships between Saudi Aramco and Germany?"* — surfacing non-obvious connections without requiring the user to manually trace edges.

A frontend engineer who can build this from scratch — managing a physics simulation off the React lifecycle, writing a BFS traversal that highlights results in the UI, and modelling a typed graph schema that mirrors Neo4j's property graph — is directly equipped to work on data-product UIs, knowledge platforms, and trade intelligence applications.

---

## Development order

The projects are listed in recommended build order — each one builds on the concepts introduced by the previous:

1. **GitHub Profile Explorer** — establishes GraphQL querying and Apollo Client setup
2. **Dev Blog** — introduces SSG/ISR and server-side GraphQL patterns
3. **Kanban Board** — adds mutations, subscriptions, and advanced state management
4. **Trade Intelligence Knowledge Graph** — introduces D3 force simulation, graph algorithms, and domain-specific data visualisation

---

## Next step

All four projects are complete. The portfolio is live and ready to share.
