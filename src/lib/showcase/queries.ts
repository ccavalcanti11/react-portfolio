// ---------------------------------------------------------------------------
// GraphQL queries — Contentful Content Delivery API compatible.
//
// These queries work against a Contentful space with a `caseStudy` content
// type. Field names map 1-to-1 to the TypeScript interfaces in ./types.ts.
// ---------------------------------------------------------------------------

/**
 * Fetch all case-study summaries for the grid page.
 * Omits heavy rich-text `body` fields to keep the list payload lean.
 */
export const GET_ALL_CASE_STUDIES = `
  query GetAllCaseStudies {
    caseStudyCollection(order: year_DESC) {
      items {
        sys { id }
        slug
        client
        projectTitle
        excerpt
        industry
        service
        techStack
        year
        coverGradient
        metrics {
          label
          value
          delta
          sentiment
        }
        seo {
          metaTitle
          metaDescription
        }
      }
    }
  }
`;

/**
 * Fetch one full case study by slug for the detail page.
 * Includes the three rich-text sections and optional testimonial.
 */
export const GET_CASE_STUDY_BY_SLUG = `
  query GetCaseStudyBySlug($slug: String!) {
    caseStudyCollection(where: { slug: $slug }, limit: 1) {
      items {
        sys { id }
        slug
        client
        projectTitle
        excerpt
        industry
        service
        techStack
        year
        coverGradient
        metrics {
          label
          value
          delta
          sentiment
        }
        seo {
          metaTitle
          metaDescription
        }
        challenge {
          heading
          body
        }
        solution {
          heading
          body
        }
        results {
          heading
          body
        }
        testimonial {
          quote
          author
          role
        }
      }
    }
  }
`;

/**
 * Fetch only slugs — used by `generateStaticParams` to pre-render all detail
 * pages at build time without fetching full content.
 */
export const GET_ALL_SLUGS = `
  query GetAllSlugs {
    caseStudyCollection {
      items {
        slug
      }
    }
  }
`;
