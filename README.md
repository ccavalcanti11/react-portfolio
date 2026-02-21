# React Portfolio

A generic boilerplate portfolio project built with **Next.js**, **React**, **GraphQL**, and **Apollo Client**, with unit testing powered by **Jest** and **React Testing Library**.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) (App Router) | Full-stack React framework |
| [React 19](https://react.dev/) | UI library |
| [Apollo Client v4](https://www.apollographql.com/docs/react/) | GraphQL state management |
| [GraphQL](https://graphql.org/) | Query language for APIs |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Jest](https://jestjs.io/) | Test runner |
| [React Testing Library](https://testing-library.com/react) | Component testing |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Configure the GraphQL endpoint

Copy `.env.example` to `.env.local` and set your GraphQL API URL:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-api.example.com/graphql
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/               # Next.js App Router pages and layouts
│   ├── layout.tsx     # Root layout (wraps the app with ApolloWrapper)
│   └── page.tsx       # Home page
├── components/
│   └── ApolloWrapper.tsx  # Client-side Apollo Provider wrapper
├── lib/
│   └── apollo-client.ts   # Apollo Client factory
└── __tests__/         # Unit tests
    ├── apollo-client.test.ts
    ├── ApolloWrapper.test.tsx
    └── page.test.tsx
```

## Using GraphQL with Apollo Client

The `ApolloWrapper` component in `src/components/ApolloWrapper.tsx` wraps the entire application with an `ApolloProvider`, making the Apollo Client available to all client components via React context.

**Example usage in a client component:**

```tsx
"use client";

import { useQuery, gql } from "@apollo/client/react";

const GET_EXAMPLE = gql`
  query GetExample {
    example {
      id
      name
    }
  }
`;

export default function ExampleComponent() {
  const { loading, error, data } = useQuery(GET_EXAMPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```
