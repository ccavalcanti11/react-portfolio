# Portfolio Projects

This is a **single Next.js application** that hosts all three portfolio projects under one roof. All projects share the same codebase, design system, Apollo client, and deployment — just like a real-world product that grows one feature at a time.

A portfolio hub at `/` acts as the landing page: three project cards, each linking into its own route. The recruiter lands on one URL, sees everything immediately, and dives into whichever project interests them.

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
  page.tsx                   ← Portfolio hub — cards linking to all 3 projects
  github/
    [username]/page.tsx       ← Project 1: GitHub Profile Explorer
  blog/
    page.tsx                  ← Project 2: Dev Blog
    [slug]/page.tsx
  board/
    page.tsx                  ← Project 3: Real-Time Kanban Board
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

---

## Project 2 — Dev Blog with CMS-backed Content

**Status:** 🔲 Not started

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

---

## Project 3 — Real-Time Task Board (Kanban)

**Status:** 🔲 Not started

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

---

## Development order

The projects are listed in recommended build order — each one builds on the GraphQL and Next.js concepts introduced by the previous:

1. **GitHub Profile Explorer** — establishes GraphQL querying and Apollo Client setup
2. **Dev Blog** — introduces SSG/ISR and server-side GraphQL patterns
3. **Kanban Board** — adds mutations, subscriptions, and advanced state management

---

## Next step

Once this document is approved, development will begin with **Project 1 — GitHub Profile Explorer**.
