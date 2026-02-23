import { gql } from "@apollo/client";

// ---------------------------------------------------------------------------
// Shared fragment — reused by both the repo list and pinnedItems
// ---------------------------------------------------------------------------
const REPOSITORY_FIELDS = gql`
  fragment RepositoryFields on Repository {
    id
    name
    description
    url
    stargazerCount
    forkCount
    isArchived
    primaryLanguage {
      name
      color
    }
    updatedAt
  }
`;

// ---------------------------------------------------------------------------
// Main query
// Variables:
//   $login  — GitHub username
//   $first  — page size (default: 6)
//   $after  — cursor for pagination (omit on first load)
// ---------------------------------------------------------------------------
export const GET_USER_PROFILE = gql`
  ${REPOSITORY_FIELDS}

  query GetUserProfile($login: String!, $first: Int!, $after: String) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl
      url
      location
      company
      websiteUrl
      twitterUsername
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: $first
        after: $after
        orderBy: { field: STARGAZERS, direction: DESC }
        privacy: PUBLIC
      ) {
        totalCount
        nodes {
          ...RepositoryFields
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            ...RepositoryFields
          }
        }
      }
    }
  }
`;
