// ---------------------------------------------------------------------------
// GraphQL query strings for Hygraph (formerly GraphCMS).
//
// Hygraph exposes a native GraphQL endpoint that mirrors your content models
// exactly. These queries are written for Hygraph's auto-generated schema but
// demonstrate the same patterns used against any GraphQL CMS
// (Contentful, Sanity, DatoCMS, etc.).
//
// They are plain strings (not `gql` tagged) so that Next.js's native `fetch`
// can POST them directly — enabling per-request `next.revalidate` for ISR.
// If you prefer Apollo Client on the server, swap the `fetchCMS` helper in
// client.ts for `client.query({ query: gql`...`, variables })`.
// ---------------------------------------------------------------------------

/** Fetch all post summaries (no content HTML) ordered newest-first. */
export const GET_ALL_POSTS = /* GraphQL */ `
  query GetAllPosts {
    posts(orderBy: publishedAt_DESC, stage: PUBLISHED) {
      id
      slug
      title
      excerpt
      publishedAt
      updatedAt
      readingTimeMinutes
      tags {
        id
        name
        slug
      }
      coverImage {
        url
        altText
      }
      seo {
        metaTitle
        metaDescription
      }
    }
  }
`;

/** Fetch a single post including its full rendered HTML content. */
export const GET_POST_BY_SLUG = /* GraphQL */ `
  query GetPostBySlug($slug: String!) {
    post(where: { slug: $slug }, stage: PUBLISHED) {
      id
      slug
      title
      excerpt
      publishedAt
      updatedAt
      readingTimeMinutes
      tags {
        id
        name
        slug
      }
      coverImage {
        url
        altText
      }
      content {
        html
      }
      seo {
        metaTitle
        metaDescription
      }
    }
  }
`;

/** Fetch only slugs — used by generateStaticParams to pre-render all posts. */
export const GET_ALL_SLUGS = /* GraphQL */ `
  query GetAllSlugs {
    posts(stage: PUBLISHED) {
      slug
    }
  }
`;
