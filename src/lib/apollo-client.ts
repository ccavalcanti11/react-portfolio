import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: GITHUB_GRAPHQL_ENDPOINT,
      headers: {
        // Token is NEXT_PUBLIC_ so client components can access the GitHub API.
        // For production, proxy through an API route to keep the token server-only.
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? ""}`,
      },
    }),
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

