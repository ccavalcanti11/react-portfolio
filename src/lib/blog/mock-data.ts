// ---------------------------------------------------------------------------
// Static mock data — used when HYGRAPH_ENDPOINT is not configured.
//
// Structured to exactly mirror the shape of a real Hygraph response so that
// switching to a live CMS requires only setting the environment variable.
// The topics intentionally overlap with the portfolio projects to reinforce
// the skills on display and improve recruiter engagement.
// ---------------------------------------------------------------------------

import type { BlogPost } from "./types";

export const MOCK_POSTS: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Post 1 — Newest
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "post-1",
    slug: "building-type-safe-apis-graphql-typescript",
    title: "Building Type-Safe APIs with GraphQL and TypeScript",
    excerpt:
      "Combining GraphQL's schema-first type system with TypeScript gives you end-to-end type safety from your database to your React components — and lets the compiler catch breaking changes before they reach production.",
    coverImage: null,
    tags: [
      { id: "tag-graphql", name: "GraphQL", slug: "graphql" },
      { id: "tag-typescript", name: "TypeScript", slug: "typescript" },
      { id: "tag-api", name: "API Design", slug: "api-design" },
    ],
    publishedAt: "2026-02-22T08:00:00.000Z",
    updatedAt: "2026-02-22T10:00:00.000Z",
    readingTimeMinutes: 7,
    content: {
      html: `
<p>When you combine GraphQL's schema-first type system with TypeScript, you get something remarkable: a single source of truth that spans your entire stack. Your schema becomes the contract, and the TypeScript compiler enforces it everywhere — from the query you write to the component that renders the data.</p>

<h2>The Problem with Untyped GraphQL Responses</h2>
<p>Without types, every GraphQL response is effectively <code>any</code>. You're guessing at field names, optional fields silently return <code>undefined</code>, and a schema change breaks things at runtime instead of at compile time — usually on a Friday afternoon.</p>
<pre><code class="language-typescript">// ❌ Untyped — silent failure waiting to happen
const { data } = useQuery(GET_USER);
console.log(data.user.profle.avatarUrl); // typo goes undetected until runtime
</code></pre>

<h2>Code Generation with graphql-codegen</h2>
<p>The gold standard is to generate TypeScript types directly from your schema using <code>@graphql-codegen/cli</code>. Every time the schema changes, you re-run the generator and TypeScript immediately surfaces anything that's broken.</p>
<pre><code class="language-bash">npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations
</code></pre>
<p>A minimal <code>codegen.ts</code> for the GitHub API looks like this:</p>
<pre><code class="language-typescript">import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.github.com/graphql",
  documents: "src/**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
};

export default config;
</code></pre>

<h2>Using Generated Types with Apollo Client</h2>
<p>Apollo's <code>useQuery</code> accepts generic type parameters for the response data and variables. Plugging in generated types gives you full IntelliSense and compile-time validation on every field access.</p>
<pre><code class="language-typescript">import type {
  GetUserProfileQuery,
  GetUserProfileQueryVariables,
} from "@/generated/graphql";

const { data } = useQuery&lt;GetUserProfileQuery, GetUserProfileQueryVariables&gt;(
  GET_USER_PROFILE,
  { variables: { login: username, first: 6 } },
);

// ✅ TypeScript now knows the exact shape — including which fields are nullable
const name = data?.user?.name; // string | null | undefined
</code></pre>

<h2>When Build-Time Generation Isn't Available</h2>
<p>In projects where running a codegen step isn't practical, you can write the types by hand, mirroring the shape of your queries exactly. It requires more discipline to keep in sync, but the safety benefits are identical. The GitHub Explorer in this portfolio uses hand-written types in <code>src/lib/github/types.ts</code> — proving you don't need tooling to get end-to-end type safety.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Let your GraphQL schema be the single source of truth for all types</li>
  <li>Use <code>graphql-codegen</code> in larger teams to auto-generate and stay in sync</li>
  <li>Hand-written types are a valid, low-friction alternative for smaller projects</li>
  <li>Apollo's generic type parameters (<code>useQuery&lt;TData, TVariables&gt;</code>) make consuming generated types seamless</li>
  <li>Run codegen in CI to catch schema drift before it merges</li>
</ul>
`,
    },
    seo: {
      metaTitle: "Building Type-Safe APIs with GraphQL and TypeScript",
      metaDescription:
        "Learn how to pair GraphQL's type system with TypeScript using graphql-codegen and Apollo Client for end-to-end type safety across your full stack.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Post 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "post-2",
    slug: "nextjs-app-router-ssg-isr-server-components",
    title: "Next.js App Router: SSG, ISR, and Server Components Explained",
    excerpt:
      "The App Router introduced a fundamentally different mental model for data fetching in Next.js. Understanding when to use SSG, ISR, and Server Components — and how they compose — is the key to building fast, scalable web applications.",
    coverImage: null,
    tags: [
      { id: "tag-nextjs", name: "Next.js", slug: "nextjs" },
      { id: "tag-react", name: "React", slug: "react" },
      { id: "tag-performance", name: "Performance", slug: "performance" },
    ],
    publishedAt: "2026-02-18T09:00:00.000Z",
    updatedAt: "2026-02-18T11:00:00.000Z",
    readingTimeMinutes: 8,
    content: {
      html: `
<p>Next.js 13+ App Router fundamentally changed how we think about rendering. Instead of choosing between <code>getStaticProps</code>, <code>getServerSideProps</code>, and client-side fetching at the page level, every component decides independently how it fetches data — and the framework composes those decisions into the optimal output.</p>

<h2>Static Site Generation (SSG) with generateStaticParams</h2>
<p>SSG pre-renders a page to static HTML at build time. The result is served directly from a CDN edge node — typically under 50ms TTFB anywhere in the world, and near-perfect Core Web Vitals scores. In the App Router, you opt into SSG simply by not using any dynamic APIs (cookies, headers, searchParams) and by exporting <code>generateStaticParams</code> for dynamic routes.</p>
<pre><code class="language-typescript">// app/blog/[slug]/page.tsx

// Pre-renders every known slug at build time
export async function generateStaticParams() {
  const slugs = await getAllSlugs(); // fetch from CMS at build time
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise&lt;{ slug: string }&gt; }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug); // result is cached statically
  if (!post) notFound();
  return &lt;PostContent post={post} /&gt;;
}
</code></pre>

<h2>Incremental Static Regeneration (ISR)</h2>
<p>SSG is perfect for content that rarely changes. But what about a blog where you publish a new post every week? Rebuilding the entire site for one new post is wasteful. ISR solves this: the page is generated statically on first request, cached, then re-generated in the background after a time interval you control.</p>
<pre><code class="language-typescript">// Revalidate the blog list page every hour.
// Next.js serves the stale HTML until the interval elapses, then
// regenerates silently — zero downtime, zero user-visible latency.
export const revalidate = 3600;
</code></pre>
<p>Combined with on-demand revalidation (calling <code>revalidatePath()</code> from a CMS webhook), ISR gives you the performance of static HTML with the freshness of server-side rendering — the best of both worlds.</p>

<h2>Server Components vs Client Components</h2>
<p>By default, every component in the App Router is a Server Component. It runs only on the server, can <code>await</code> any async operation directly, and sends zero JavaScript to the browser. When you need interactivity — click handlers, state, browser APIs — you opt in with <code>"use client"</code>.</p>
<pre><code class="language-typescript">// Server Component — runs only on server, async by default
async function BlogPage() {
  const posts = await getAllPosts(); // direct async call, no useEffect
  return &lt;PostList posts={posts} /&gt;; // PostList is a Client Component
}

// Client Component — handles tag filtering state in the browser
"use client";
function PostList({ posts }: { posts: BlogPostSummary[] }) {
  const [tag, setTag] = useState&lt;string | null&gt;(null);
  // ...
}
</code></pre>
<p>The key insight is the boundary: Server Components fetch and pass data as <em>serialisable props</em> to Client Components. This keeps the data-fetching logic on the server (where it should be) while enabling full interactivity on the client.</p>

<h2>Key Takeaways</h2>
<ul>
  <li>Default to SSG for content that changes infrequently — fastest possible load times</li>
  <li>Use ISR (<code>export const revalidate = N</code>) when content changes regularly but not on every request</li>
  <li>Server Components eliminate client-side data-fetching boilerplate for non-interactive content</li>
  <li>Push the Server/Client boundary as far down the component tree as possible</li>
  <li>On-demand revalidation with CMS webhooks is the production pattern for ISR</li>
</ul>
`,
    },
    seo: {
      metaTitle: "Next.js App Router: SSG, ISR, and Server Components",
      metaDescription:
        "A practical guide to static generation, incremental static regeneration, and Server Components in the Next.js App Router — with code examples.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Post 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "post-3",
    slug: "apollo-client-caching-deep-dive",
    title: "Apollo Client Caching Strategies for Production Apps",
    excerpt:
      "Apollo's normalised cache is one of its most powerful — and most misunderstood — features. Mastering field policies and type policies turns sluggish, request-heavy UIs into instant, data-consistent experiences.",
    coverImage: null,
    tags: [
      { id: "tag-graphql", name: "GraphQL", slug: "graphql" },
      { id: "tag-apollo", name: "Apollo", slug: "apollo" },
      { id: "tag-react", name: "React", slug: "react" },
    ],
    publishedAt: "2026-02-10T08:00:00.000Z",
    updatedAt: "2026-02-11T09:00:00.000Z",
    readingTimeMinutes: 6,
    content: {
      html: `
<p>Most Apollo Client tutorials show you how to run a query and display the result. What they skip is how the cache works under the hood — and why understanding it is the difference between an app that makes redundant network requests and one that feels instant.</p>

<h2>How Normalisation Works</h2>
<p>Apollo doesn't store responses as JSON trees. It normalises every object into a flat lookup table keyed by a <em>cache key</em> (usually <code>__typename:id</code>). When two queries return the same user, they share one object in the store — update it once and every component that references it re-renders automatically.</p>
<pre><code class="language-typescript">// Both of these queries end up sharing the same cache entry
// for Repository:MDEwOlJlcG9zaXRvcnkxNjc2MDIx

const { data: profile } = useQuery(GET_USER_PROFILE, { variables: { login: "torvalds" } });
const { data: repo } = useQuery(GET_REPO, { variables: { id: "MDEwOlJlcG9zaXRvcnkxNjc2MDIx" } });
</code></pre>

<h2>Type Policies for Pagination</h2>
<p>Pagination is where the cache needs explicit guidance. Without a type policy, each page of results overwrites the previous one. With a <code>merge</code> function, you control exactly how incoming pages are combined with existing data.</p>
<pre><code class="language-typescript">new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        repositories: {
          // Exclude the cursor from the cache key so all pages share one entry
          keyArgs: ["privacy", "orderBy"],
          merge(existing, incoming, { args }) {
            if (!args?.after) return incoming; // first page: replace
            return {
              ...incoming,
              nodes: [...(existing?.nodes ?? []), ...(incoming?.nodes ?? [])],
            };
          },
        },
      },
    },
  },
})
</code></pre>
<p>This is exactly the configuration used in the GitHub Profile Explorer — click "Load more" and notice there's no spinner on previously loaded repos; only the new batch is fetched.</p>

<h2>Fetch Policies</h2>
<p>Apollo offers several fetch policies that control the cache/network trade-off per query:</p>
<ul>
  <li><code>cache-first</code> (default) — serve cache if present, skip network. Best for immutable data.</li>
  <li><code>cache-and-network</code> — serve cache immediately, then update from network. Best for frequently updated lists.</li>
  <li><code>network-only</code> — always hit the network. Best for mutations that need fresh data.</li>
  <li><code>no-cache</code> — like <code>network-only</code> but doesn't write back to cache.</li>
</ul>

<h2>Key Takeaways</h2>
<ul>
  <li>Apollo normalises by <code>__typename:id</code> — always request <code>id</code> in your queries</li>
  <li>Use <code>keyArgs</code> to control which variables create separate cache entries vs share one</li>
  <li>Write a <code>merge</code> function for any paginated field to enable cursor-based load-more without refetching</li>
  <li>Choose your fetch policy deliberately — <code>cache-first</code> is not always the right default</li>
</ul>
`,
    },
    seo: {
      metaTitle: "Apollo Client Caching Strategies for Production Apps",
      metaDescription:
        "A deep dive into Apollo Client's normalised cache — type policies, field policies, pagination merge functions, and fetch policy trade-offs.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Post 4
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "post-4",
    slug: "react-performance-patterns",
    title: "React Performance Patterns Every Developer Should Know",
    excerpt:
      "useMemo, useCallback, and React.memo are the most over-used and under-understood hooks in the React ecosystem. Here's a clear framework for when they actually help — and when they make things worse.",
    coverImage: null,
    tags: [
      { id: "tag-react", name: "React", slug: "react" },
      { id: "tag-performance", name: "Performance", slug: "performance" },
      { id: "tag-javascript", name: "JavaScript", slug: "javascript" },
    ],
    publishedAt: "2026-01-28T08:00:00.000Z",
    updatedAt: "2026-01-29T09:00:00.000Z",
    readingTimeMinutes: 5,
    content: {
      html: `
<p>React's rendering model is straightforward: when state or props change, the component re-renders. The performance tools — <code>useMemo</code>, <code>useCallback</code>, <code>React.memo</code> — exist to skip re-renders that are expensive and unnecessary. The problem is that most developers reach for them too early, adding complexity without measurable benefit.</p>

<h2>The Golden Rule: Measure First</h2>
<p>Every memoisation call adds memory overhead, comparison cost, and cognitive load. Before applying any of these tools, profile the component with React DevTools' Profiler tab. If a component takes less than 1ms to render, wrapping it in <code>React.memo</code> costs more than it saves.</p>

<h2>useMemo — Cache Expensive Computations</h2>
<p>Use <code>useMemo</code> when you have a pure, referentially expensive computation that runs on every render. The canonical example is sorting or filtering a large list.</p>
<pre><code class="language-typescript">// ✅ The sort is O(n log n) — worth memoising if \`repos\` has thousands of items
const sortedRepos = useMemo(
  () => [...repos].sort((a, b) => b.stargazerCount - a.stargazerCount),
  [repos],
);

// ❌ Not worth memoising — this is O(1) and cheaper than the memo overhead
const fullName = useMemo(() => \`\${user.firstName} \${user.lastName}\`, [user]);
</code></pre>

<h2>useCallback — Stable Function References</h2>
<p><code>useCallback</code> returns a memoised function reference. Its primary use case is passing callbacks to child components wrapped in <code>React.memo</code> — without it, a new function object is created on every render, defeating the memo.</p>
<pre><code class="language-typescript">// ✅ loadMore is passed to a memoised RepositoryList — stable reference prevents
// unnecessary re-renders of the child when the parent re-renders for other reasons
const loadMore = useCallback(() => {
  fetchMore({ variables: { after: pageInfo.endCursor } });
}, [fetchMore, pageInfo.endCursor]);
</code></pre>

<h2>React.memo — Skip Child Re-Renders</h2>
<p>Wrap a component in <code>React.memo</code> when it's rendered frequently by a parent that re-renders for unrelated reasons, and its own props haven't changed. The comparison is shallow by default — objects and arrays need stable references to benefit.</p>
<pre><code class="language-typescript">// ✅ RepositoryCard receives only primitive + stable object props
export const RepositoryCard = React.memo(function RepositoryCard({ repo }: Props) {
  return /* ... */;
});
</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Profile before optimising — most components don't need memoisation</li>
  <li><code>useMemo</code> is for expensive pure computations, not simple string concatenation</li>
  <li><code>useCallback</code> is only meaningful when the function is a dependency of another hook or a prop to a memoised child</li>
  <li><code>React.memo</code> requires all object/array props to have stable references to be effective</li>
  <li>State colocation — keeping state as close to where it's used as possible — often fixes performance better than any of the above</li>
</ul>
`,
    },
    seo: {
      metaTitle: "React Performance Patterns Every Developer Should Know",
      metaDescription:
        "A practical guide to useMemo, useCallback, and React.memo — when they help, when they hurt, and a framework for measuring before optimising.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Post 5
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "post-5",
    slug: "dark-mode-done-right",
    title: "Dark Mode Done Right: CSS Variables, Tailwind, and localStorage",
    excerpt:
      "A flash of the wrong theme on load is one of the most jarring UX regressions you can ship. Here's the pattern that prevents it — and how to tie user preference to system preference as a sensible default.",
    coverImage: null,
    tags: [
      { id: "tag-css", name: "CSS", slug: "css" },
      { id: "tag-tailwind", name: "Tailwind", slug: "tailwind" },
      { id: "tag-javascript", name: "JavaScript", slug: "javascript" },
    ],
    publishedAt: "2026-01-20T08:00:00.000Z",
    updatedAt: "2026-01-20T10:00:00.000Z",
    readingTimeMinutes: 4,
    content: {
      html: `
<p>Implementing dark mode is deceptively tricky. The browser renders HTML before JavaScript runs, which means if your theme is stored in <code>localStorage</code> and applied by a React component, users see a white flash before the dark theme kicks in. This post covers the pattern that eliminates that flash entirely.</p>

<h2>The Class Strategy vs Media Query Strategy</h2>
<p>Tailwind supports two dark mode strategies. The default <code>media</code> strategy applies <code>dark:</code> variants when the OS prefers dark mode — no JavaScript required, but no user toggle either. The <code>class</code> strategy applies dark styles when a <code>dark</code> class is present on the <code>&lt;html&gt;</code> element, giving you full programmatic control.</p>
<pre><code class="language-css">/* Tailwind v4 — opt into class-based dark mode */
@variant dark (&:where(.dark, .dark *));
</code></pre>

<h2>Blocking the Flash with an Inline Script</h2>
<p>The trick is to inject a tiny synchronous script into the <code>&lt;head&gt;</code> that runs <em>before</em> any CSS or React code. It reads <code>localStorage</code> and adds the <code>dark</code> class before the first paint, so there's never a flash.</p>
<pre><code class="language-tsx">// app/layout.tsx
&lt;html lang="en" suppressHydrationWarning&gt;
  &lt;head&gt;
    &lt;script
      dangerouslySetInnerHTML={{
        __html: \`(function(){
          var t = localStorage.getItem('theme');
          if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
            document.documentElement.classList.add('dark');
          }
        })()\`,
      }}
    /&gt;
  &lt;/head&gt;
  &lt;body&gt;...&lt;/body&gt;
&lt;/html&gt;
</code></pre>
<p>The <code>suppressHydrationWarning</code> attribute on <code>&lt;html&gt;</code> is necessary because the class will differ between server render (no class) and client hydration (possible <code>dark</code> class), which would otherwise cause a hydration mismatch warning.</p>

<h2>The Toggle Component</h2>
<p>With the blocking script in place, the React toggle component just needs to sync its local state with <code>localStorage</code> and the HTML class:</p>
<pre><code class="language-tsx">"use client";
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return &lt;button onClick={toggle}&gt;{dark ? "☀️" : "🌙"}&lt;/button&gt;;
}
</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Use the <code>class</code> strategy when you need a user-controlled toggle</li>
  <li>Always use a blocking inline script in <code>&lt;head&gt;</code> to prevent the flash — never apply the theme in a <code>useEffect</code></li>
  <li>Fall back to <code>prefers-color-scheme</code> for first-time visitors who haven't set a preference</li>
  <li>Add <code>suppressHydrationWarning</code> to <code>&lt;html&gt;</code> to silence the expected hydration mismatch</li>
</ul>
`,
    },
    seo: {
      metaTitle: "Dark Mode Done Right: CSS Variables, Tailwind, and localStorage",
      metaDescription:
        "Eliminate the flash of unstyled content in dark mode with a blocking inline script, Tailwind's class strategy, and a React toggle that syncs to localStorage.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Post 6 — Oldest
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "post-6",
    slug: "custom-react-hooks-debounce-throttle",
    title: "Custom React Hooks: Debounce, Throttle, and AbortController",
    excerpt:
      "Three custom hooks every React developer should have in their toolkit — and the real-world problems they solve: noisy search inputs, expensive scroll handlers, and stale network responses.",
    coverImage: null,
    tags: [
      { id: "tag-react", name: "React", slug: "react" },
      { id: "tag-javascript", name: "JavaScript", slug: "javascript" },
      { id: "tag-typescript", name: "TypeScript", slug: "typescript" },
    ],
    publishedAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
    readingTimeMinutes: 5,
    content: {
      html: `
<p>Custom hooks are React's composition primitive. They let you extract stateful logic, side effects, and cleanup into reusable functions — keeping components focused on rendering. Here are three hooks that solve common, concrete problems.</p>

<h2>useDebounce — Calm a Noisy Input</h2>
<p>A search field that fires a network request on every keystroke will hammer your API and produce a poor UX. <code>useDebounce</code> delays updating a value until the user pauses typing, collapsing many keystrokes into one request.</p>
<pre><code class="language-typescript">import { useState, useEffect } from "react";

export function useDebounce&lt;T&gt;(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState&lt;T&gt;(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer); // cancel if value changes before delay
  }, [value, delayMs]);

  return debouncedValue;
}

// Usage in a search component
const debouncedQuery = useDebounce(inputValue, 400);
useEffect(() => {
  if (debouncedQuery) fetchResults(debouncedQuery);
}, [debouncedQuery]);
</code></pre>
<p>This is the exact hook used in the GitHub Profile Explorer. Type a username and notice the network tab — one request fires 400ms after you stop, not on every keystroke.</p>

<h2>useThrottle — Tame Scroll and Resize Events</h2>
<p>Scroll and resize events can fire hundreds of times per second. Throttling caps the execution rate — useful for reading scroll position, updating sticky headers, or triggering animations.</p>
<pre><code class="language-typescript">import { useState, useEffect, useRef } from "react";

export function useThrottle&lt;T&gt;(value: T, limitMs: number): T {
  const [throttled, setThrottled] = useState&lt;T&gt;(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const elapsed = Date.now() - lastRan.current;
    if (elapsed &gt;= limitMs) {
      setThrottled(value);
      lastRan.current = Date.now();
    } else {
      const timer = setTimeout(() => {
        setThrottled(value);
        lastRan.current = Date.now();
      }, limitMs - elapsed);
      return () => clearTimeout(timer);
    }
  }, [value, limitMs]);

  return throttled;
}
</code></pre>

<h2>useFetch with AbortController — Prevent Stale Responses</h2>
<p>When a user types quickly, multiple requests can be in-flight simultaneously. Without cancellation, an earlier slow response can overwrite a later fast response — a classic race condition. <code>AbortController</code> cancels the previous request whenever a new one starts.</p>
<pre><code class="language-typescript">import { useState, useEffect } from "react";

export function useFetch&lt;T&gt;(url: string) {
  const [data, setData] = useState&lt;T | null&gt;(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => res.json() as Promise&lt;T&gt;)
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort(); // fires when url changes or component unmounts
  }, [url]);

  return { data, loading };
}
</code></pre>

<h2>Key Takeaways</h2>
<ul>
  <li>Always return a cleanup function from <code>useEffect</code> — clearing timers and aborting requests prevents memory leaks</li>
  <li>Debounce is for reducing the <em>number</em> of calls; throttle is for limiting their <em>frequency</em></li>
  <li><code>AbortController</code> is the correct way to cancel fetch requests — not a <code>cancelled</code> flag</li>
  <li>Custom hooks with TypeScript generics (<code>useDebounce&lt;T&gt;</code>) are reusable across any value type</li>
</ul>
`,
    },
    seo: {
      metaTitle: "Custom React Hooks: Debounce, Throttle, and AbortController",
      metaDescription:
        "Build three essential custom React hooks — useDebounce, useThrottle, and a fetch hook with AbortController — that solve real-world async problems.",
    },
  },
];
