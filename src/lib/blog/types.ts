// ---------------------------------------------------------------------------
// Dev Blog — TypeScript interfaces that mirror the Hygraph CMS GraphQL schema.
//
// These types serve as the contract between the data-fetching layer
// (lib/blog/client.ts) and the UI components. When a real Hygraph endpoint
// is configured, the GraphQL responses are cast to these shapes; when running
// on mock data, the mock objects satisfy the same interfaces.
// ---------------------------------------------------------------------------

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogCoverImage {
  url: string;
  altText: string | null;
}

/** Full post — includes content HTML, returned for the detail page. */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: BlogCoverImage | null;
  tags: BlogTag[];
  publishedAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  readingTimeMinutes: number;
  content: { html: string };
  seo: { metaTitle: string | null; metaDescription: string | null } | null;
}

/**
 * Summary — all fields except `content`.
 * Used for the blog list page to avoid sending full HTML to the client
 * before the reader navigates to an individual post.
 */
export type BlogPostSummary = Omit<BlogPost, "content">;

// ---------------------------------------------------------------------------
// GraphQL response envelopes
// ---------------------------------------------------------------------------

export interface GetAllPostsResponse {
  posts: BlogPostSummary[];
}

export interface GetPostBySlugResponse {
  post: BlogPost | null;
}

export interface GetAllSlugsResponse {
  posts: Array<{ slug: string }>;
}
