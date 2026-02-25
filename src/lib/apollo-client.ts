import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

// ---------------------------------------------------------------------------
// Apollo Client factory
//
// Two-link setup (Project 1 & 2 use only HTTP; Project 3 adds WS):
//
//   ┌─ HttpLink  ─────────────────────────────────────────────────────────┐
//   │  Handles queries & mutations → sends standard HTTP POST requests.   │
//   │  Used by all three portfolio projects.                              │
//   └─────────────────────────────────────────────────────────────────────┘
//   ┌─ GraphQLWsLink (optional) ───────────────────────────────────────────┐
//   │  Handles subscriptions → maintains a WebSocket connection with the  │
//   │  board's graphql-ws server.                                         │
//   │  Only activated when NEXT_PUBLIC_BOARD_WS_URL is set in .env.local. │
//   └─────────────────────────────────────────────────────────────────────┘
//
// When the WS URL is not configured (demo mode), all operations route through
// HTTP and the subscription simulation in useBoard.ts fires instead.
// ---------------------------------------------------------------------------

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

// Board backend endpoints — set in .env.local to connect a real server.
// Leave empty to use the in-memory subscription simulation (demo mode).
const BOARD_HTTP_URL = process.env.NEXT_PUBLIC_BOARD_HTTP_URL ?? "";
const BOARD_WS_URL = process.env.NEXT_PUBLIC_BOARD_WS_URL ?? "";

export function createApolloClient() {
  // ── HTTP link (GitHub API — always active) ─────────────────────────────
  const githubHttpLink = new HttpLink({
    uri: GITHUB_GRAPHQL_ENDPOINT,
    headers: {
      // Token is NEXT_PUBLIC_ so client components can access the GitHub API.
      // For production, proxy through an API route to keep the token server-only.
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? ""}`,
    },
  });

  // ── Board WS link (Project 3 — only when env var is set) ──────────────
  // The `split` utility routes each operation:
  //   • subscription operations → GraphQLWsLink (WebSocket)
  //   • everything else         → HttpLink
  // When the WS URL is not configured, the dummy link is never reached because
  // the board's useBoard hook uses its local simulation instead.
  const boardLink = BOARD_WS_URL
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        new GraphQLWsLink(
          createClient({
            url: BOARD_WS_URL,
            // Reconnect automatically with exponential back-off
            retryAttempts: Infinity,
          }),
        ),
        new HttpLink({ uri: BOARD_HTTP_URL }),
      )
    : githubHttpLink;

  // Route board operations to the board link, everything else to GitHub.
  // In practice the GitHub API is the only active endpoint in this demo.
  const link = BOARD_WS_URL ? boardLink : githubHttpLink;

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            repositories: {
              // `after` is the pagination cursor — exclude it from the cache key
              // so that pages with the same privacy/orderBy share one cached field.
              keyArgs: ["privacy", "orderBy"],
              merge(existing, incoming, { args }) {
                // Fresh load (no cursor): replace any stale cache
                if (!args?.after) return incoming;
                // Load-more: append newly fetched nodes to the existing list
                return {
                  ...incoming,
                  nodes: [
                    ...(existing?.nodes ?? []),
                    ...(incoming?.nodes ?? []),
                  ],
                };
              },
            },
          },
        },
      },
    }),
  });
}

