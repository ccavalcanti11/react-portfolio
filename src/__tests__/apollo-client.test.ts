import { createApolloClient } from "@/lib/apollo-client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

describe("createApolloClient", () => {
  it("returns an ApolloClient instance", () => {
    const client = createApolloClient();
    expect(client).toBeInstanceOf(ApolloClient);
  });

  it("uses an InMemoryCache", () => {
    const client = createApolloClient();
    expect(client.cache).toBeInstanceOf(InMemoryCache);
  });
});
