// ---------------------------------------------------------------------------
// Brand Campaign Showcase — TypeScript interfaces mirroring a Contentful CMS
// schema.
//
// Design rationale:
//   - `CaseStudySummary` carries only the fields needed for the grid page,
//     keeping the list payload lean (no heavy HTML bodies).
//   - `CaseStudy` extends the summary and adds the three rich-text sections
//     and an optional testimonial — fetched only on the detail page.
//   - The `GraphQL response envelopes` reflect Contentful's collection API
//     shape, so swapping the mock client for a real `fetchCMS` call requires
//     only setting the CONTENTFUL_* environment variables.
// ---------------------------------------------------------------------------

/** Client industry vertical — drives badge colour and filter options. */
export type Industry =
  | "retail"
  | "healthcare"
  | "finance"
  | "education"
  | "automotive";

/** Agency service line — drives badge colour and filter options. */
export type ServiceType =
  | "digital-transformation"
  | "ux-design"
  | "product-engineering"
  | "platform-architecture"
  | "campaign-management";

/** A single quantitative outcome displayed on the card and detail page. */
export interface CaseStudyMetric {
  label: string;
  /** Display value, e.g. "98", "1.2 s", "$2.4 M". */
  value: string;
  /** Signed delta string, e.g. "+34%" or "−12 s". Optional. */
  delta?: string;
  /** Drives pill colour — green for wins, grey for neutral KPIs. */
  sentiment: "positive" | "neutral";
}

/** A named content section used on the detail page (challenge / solution / results). */
export interface CaseStudySection {
  heading: string;
  /** Rich HTML produced by a Contentful rich-text field. */
  body: string;
}

// ---------------------------------------------------------------------------
// Summary — returned by the list query (no rich HTML, keeps payload small)
// ---------------------------------------------------------------------------

export interface CaseStudySummary {
  id: string;
  slug: string;
  /** Company name, e.g. "RetailNow". */
  client: string;
  /** Short project title, e.g. "Personalization Engine". */
  projectTitle: string;
  /** One-sentence description for the card excerpt. */
  excerpt: string;
  industry: Industry;
  service: ServiceType;
  /** Ordered list of technologies used, e.g. ["Next.js", "Contentful"]. */
  techStack: string[];
  /** Top-level KPIs shown on the card (usually 3). */
  metrics: CaseStudyMetric[];
  /** CSS gradient string stored in the CMS — assigned at authoring time. */
  coverGradient: string;
  year: number;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
}

// ---------------------------------------------------------------------------
// Full study — adds rich-text sections and optional client testimonial
// ---------------------------------------------------------------------------

export interface CaseStudy extends CaseStudySummary {
  challenge: CaseStudySection;
  solution: CaseStudySection;
  results: CaseStudySection;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

// ---------------------------------------------------------------------------
// Display-label maps — used in filter UI and badge components
// ---------------------------------------------------------------------------

export const INDUSTRY_LABELS: Record<Industry, string> = {
  retail: "Retail",
  healthcare: "Healthcare",
  finance: "Finance",
  education: "Education",
  automotive: "Automotive",
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  "digital-transformation": "Digital Transformation",
  "ux-design": "UX Design",
  "product-engineering": "Product Engineering",
  "platform-architecture": "Platform Architecture",
  "campaign-management": "Campaign Management",
};

// ---------------------------------------------------------------------------
// GraphQL response envelopes (Contentful Collection API shape)
// ---------------------------------------------------------------------------

export interface GetAllCaseStudiesResponse {
  caseStudyCollection: { items: CaseStudySummary[] };
}

export interface GetCaseStudyBySlugResponse {
  caseStudyCollection: { items: CaseStudy[] };
}

export interface GetAllSlugsResponse {
  caseStudyCollection: { items: Array<{ slug: string }> };
}
