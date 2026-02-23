// ---------------------------------------------------------------------------
// GitHub GraphQL API — shared TypeScript types
// ---------------------------------------------------------------------------

export interface GitHubLanguage {
  name: string;
  /** Hex colour string supplied by GitHub (e.g. "#3178c6"), or null */
  color: string | null;
}

export interface GitHubRepository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  isArchived: boolean;
  primaryLanguage: GitHubLanguage | null;
  updatedAt: string; // ISO 8601
}

export interface GitHubPageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  url: string;
  location: string | null;
  company: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  createdAt: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: GitHubRepository[];
    pageInfo: GitHubPageInfo;
  };
  /**
   * pinnedItems returns a PinnableItem union (Repository | Gist).
   * We query only the Repository fragment, so non-Repository items
   * come back as empty objects — filter by presence of `id` before using.
   */
  pinnedItems: {
    nodes: Array<GitHubRepository | Record<string, never>>;
  };
}

// ---------------------------------------------------------------------------
// Query shape (variable + data contracts)
// ---------------------------------------------------------------------------

export interface GetUserProfileData {
  user: GitHubUser | null;
}

export interface GetUserProfileVariables {
  login: string;
  first: number;
  after?: string | null;
}
