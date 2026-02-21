"use client";

import { ApolloProvider } from "@apollo/client/react";
import { createApolloClient } from "@/lib/apollo-client";
import { ReactNode, useMemo } from "react";

interface ApolloWrapperProps {
  children: ReactNode;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  const client = useMemo(() => createApolloClient(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
