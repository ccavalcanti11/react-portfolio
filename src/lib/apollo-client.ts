import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "https://api.example.com/graphql";

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: GRAPHQL_ENDPOINT }),
    cache: new InMemoryCache(),
  });
}
