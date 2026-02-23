import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_USER_PROFILE } from "@/lib/github/queries";
import type {
  GetUserProfileData,
  GetUserProfileVariables,
} from "@/lib/github/types";

const REPOS_PER_PAGE = 6;

/**
 * Custom hook that encapsulates all Apollo Client logic for
 * fetching a GitHub user profile + their repositories.
 *
 * Features demonstrated:
 * - Typed `useQuery` with generics
 * - `fetchMore` for cursor-based pagination (Apollo merges via cache policy)
 * - Local `isLoadingMore` state to distinguish first-load vs load-more
 */
export function useGitHubProfile(login: string) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, error, fetchMore } = useQuery<
    GetUserProfileData,
    GetUserProfileVariables
  >(GET_USER_PROFILE, {
    variables: { login, first: REPOS_PER_PAGE },
    skip: !login,
  });

  const loadMoreRepos = async () => {
    const endCursor = data?.user?.repositories.pageInfo.endCursor;
    if (!endCursor) return;
    setIsLoadingMore(true);
    try {
      await fetchMore({ variables: { after: endCursor } });
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    profile: data?.user ?? null,
    loading,
    /** True while a subsequent page is being fetched via fetchMore */
    loadingMore: isLoadingMore,
    error,
    loadMoreRepos,
    hasNextPage: data?.user?.repositories.pageInfo.hasNextPage ?? false,
  };
}
