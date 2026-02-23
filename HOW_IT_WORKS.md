# How It Works — GitHub Profile Explorer

A step-by-step walkthrough of every layer of the application, from the
browser URL to the data returned by the GitHub API.

---

## 1. Entry point — the browser hits a URL

Everything starts with Next.js's **App Router**. The `src/app/` folder is a
file-system router: each folder maps directly to a URL path, and each
`page.tsx` inside it is what gets rendered for that route.

```
src/app/
  page.tsx                        →  /               (home)
  github/
    [username]/
      page.tsx                    →  /github/:username  (profile)
```

The square brackets in `[username]` mean **dynamic segment** — Next.js will
match `/github/torvalds`, `/github/gaearon`, or any other string and pass
it into the page as a parameter.

---

## 2. The home page — `src/app/page.tsx`

When you open `http://localhost:3000` the first file executed is
[`src/app/layout.tsx`](src/app/layout.tsx). Think of it as the outer
HTML shell that wraps every page:

```
RootLayout (layout.tsx)
  └── ApolloWrapper          ← makes the Apollo client available to all children
        └── <children>       ← whatever page.tsx exports
```

`layout.tsx` renders `<html>`, `<body>`, and the `ApolloWrapper` once.
Every page just fills in the `{children}` slot.

The home `page.tsx` itself is a **Server Component** (no `"use client"`
directive, no hooks, no event handlers). Next.js renders it on the server
to plain HTML and sends it to the browser — instant first paint, no
JavaScript needed for the initial display.

It renders:

1. A heading and description.
2. A `<SearchInput>` — the only interactive piece.
3. Quick-link buttons for example users.

---

## 3. Apollo is set up once — `src/components/ApolloWrapper.tsx`

```tsx
"use client"   // ← marks this as a Client Component

export default function ApolloWrapper({ children }) {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

- **`"use client"`** tells Next.js "this component and everything inside it
  that needs interactivity runs in the browser".
- `useMemo` ensures one Apollo client instance is created for the lifetime
  of the app, not re-created on every render.
- `ApolloProvider` puts that client into React Context so any child
  component can call `useQuery` / `useQuery` without passing the client as
  a prop.

The actual client is configured in [`src/lib/apollo-client.ts`](src/lib/apollo-client.ts):

```ts
new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` },
  }),
  cache: new InMemoryCache({ ... }),
})
```

- `HttpLink` tells Apollo where to send every GraphQL request.
- `InMemoryCache` stores every response in memory so the same data is never
  fetched twice (navigate away and back — no network call).

---

## 4. The search input — `src/components/github/SearchInput.tsx`

This is the first truly interactive piece. It has `"use client"` because
it uses React hooks (`useState`, `useEffect`) and the Next.js `useRouter`.

```
User types "torvalds"
       ↓
onChange → setValue("torvalds") + setIsDirty(true)
       ↓
useDebounce waits 500 ms of silence
       ↓
debouncedValue settles → router.push("/github/torvalds")
```

**What is debounce?**  
Without it, every single keystroke would navigate to a new page. With a
500 ms debounce the navigation only fires once the user *stops* typing for
half a second. The logic lives in the tiny custom hook
[`src/hooks/useDebounce.ts`](src/hooks/useDebounce.ts):

```ts
useEffect(() => {
  const timer = setTimeout(() => setDebouncedValue(value), delay);
  return () => clearTimeout(timer);  // cancel if value changes again
}, [value, delay]);
```

The cleanup function (`return () => clearTimeout`) is the key — it cancels
the previous timer before starting a new one every time the value changes.

---

## 5. The profile page — `src/app/github/[username]/page.tsx`

When `router.push("/github/torvalds")` fires, Next.js matches the dynamic
route and runs `page.tsx`:

```ts
// Server Component — runs on the server
export default async function ProfilePage({ params }) {
  const { username } = await params;   // "torvalds"
  return <ProfileView username={username} />;
}
```

`await params` is a Next.js 15+ pattern — dynamic route params are now a
`Promise` to allow streaming and concurrent rendering.

The server component's only job is to:
1. Unwrap the `username` from the URL.
2. Generate the page `<title>` via `generateMetadata`.
3. Hand the username off to the client component.

---

## 6. Where the data is actually fetched — `src/hooks/useGitHubProfile.ts`

`ProfileView` is a `"use client"` component. The moment it mounts in the
browser it calls `useGitHubProfile("torvalds")`, which calls Apollo's
`useQuery`:

```ts
const { data, loading, error, fetchMore } = useQuery<
  GetUserProfileData,
  GetUserProfileVariables
>(GET_USER_PROFILE, {
  variables: { login: "torvalds", first: 6 },
});
```

Apollo's `useQuery` does three things:
1. Checks the **InMemoryCache** first. If the data is already there, it
   returns it instantly (no network call).
2. If not cached, sends the GraphQL query to `api.github.com/graphql`.
3. While waiting, sets `loading: true` so the UI can show a skeleton.

The query itself is defined in [`src/lib/github/queries.ts`](src/lib/github/queries.ts)
and specifies exactly what fields are needed — one of GraphQL's key
advantages over REST is that you get only what you ask for.

---

## 7. The rendering pipeline — what the user actually sees

```
URL: /github/torvalds

① Server renders ProfilePage (server component)
   └─ Streams initial HTML shell to browser

② Browser hydrates — React takes over the DOM
   └─ ProfileView mounts → useGitHubProfile("torvalds") runs

③ Apollo checks cache — miss on first load
   └─ HTTP POST → https://api.github.com/graphql
      Body: { query: "...", variables: { login: "torvalds", first: 6 } }

④ loading = true → ProfileHeaderSkeleton + RepositoryGridSkeleton render
   (animate-pulse placeholders)

⑤ GitHub responds with JSON data

⑥ Apollo writes to InMemoryCache, re-renders with real data
   └─ ProfileHeader + RepositoryList appear

⑦ User clicks "Load more"
   └─ fetchMore({ variables: { after: "<cursor>" } })
   └─ Apollo merges new repos into cache (field policy in apollo-client.ts)
   └─ RepositoryList re-renders with combined list
```

---

## 8. The cache merge — why scrolling is instant on revisit

In `apollo-client.ts` there is a **field policy** on the `User.repositories`
field:

```ts
repositories: {
  keyArgs: ["privacy", "orderBy"],
  merge(existing, incoming, { args }) {
    if (!args?.after) return incoming;          // fresh load → replace
    return {
      ...incoming,
      nodes: [...existing.nodes, ...incoming.nodes],  // load-more → append
    };
  },
}
```

- On the **first** load (`after` is undefined) the fresh data replaces the
  cache.
- On every **"Load more"** click the new page's `nodes` are appended to the
  already-cached ones.
- If you navigate away and back, all pages already fetched come from the
  cache — zero network requests.

---

## 9. TypeScript — how everything is typed end-to-end

[`src/lib/github/types.ts`](src/lib/github/types.ts) defines interfaces that
mirror the exact shape of the GitHub GraphQL response:

```ts
interface GitHubUser {
  login: string;
  name: string | null;    // ← nullable — GitHub may not have this
  bio: string | null;
  avatarUrl: string;
  repositories: {
    nodes: GitHubRepository[];
    pageInfo: GitHubPageInfo;
  };
  ...
}
```

These are passed as type parameters to `useQuery<Data, Variables>`, so
TypeScript knows the exact shape of `data.user` — no `any`, no guessing,
no runtime surprises.

---

## 10. Component hierarchy — the full tree

```
RootLayout                        (server)
  ApolloWrapper                   (client — wraps the whole app)
    Home page  /                  (server)
      SearchInput                 (client)

    Profile page  /github/:user   (server)
      ProfileView                 (client — owns all data-fetching state)
        header
          SearchInput             (client)
        ProfileHeaderSkeleton     (client, shown while loading)
        ProfileHeader             (client, shown when data arrives)
        RepositoryList            (client — language filter, load-more)
          RepositoryCard × N      (no hooks — pure presentational)
        RepositoryGridSkeleton    (client, shown while loading)
```

**Server vs Client components** in one sentence:
> Server Components run once on the server — great for static layout and
> data-free markup. Client Components run in the browser — required for
> hooks, event handlers, and anything interactive.

---

## 11. File map

```
src/
  app/
    layout.tsx                 Root HTML shell + ApolloWrapper
    page.tsx                   Home page (/ route)
    globals.css                Tailwind import + CSS variables
    github/
      [username]/
        page.tsx               Profile page (/github/:username route)
  components/
    ApolloWrapper.tsx          Apollo context provider
    github/
      SearchInput.tsx          Debounced search bar
      ProfileHeader.tsx        Avatar + bio + stats
      RepositoryCard.tsx       Single repo card (language, stars, forks)
      RepositoryList.tsx       Grid + language filter + load-more
      ProfileSkeleton.tsx      Pulse placeholders for loading state
      ProfileView.tsx          Main client component — ties everything together
  hooks/
    useDebounce.ts             Generic debounce hook
    useGitHubProfile.ts        Apollo useQuery + fetchMore wrapper
  lib/
    apollo-client.ts           Apollo client factory + cache config
    github/
      queries.ts               GraphQL query + fragment
      types.ts                 TypeScript interfaces for API responses
  __tests__/
    page.test.tsx              Home page rendering tests
    apollo-client.test.ts      Apollo client instantiation tests
    ApolloWrapper.test.tsx     Provider wrapper tests
    useDebounce.test.ts        Debounce hook timer tests
    RepositoryCard.test.tsx    Repository card rendering tests
```
