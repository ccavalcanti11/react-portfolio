import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCaseStudyBySlug, getAllSlugs } from "@/lib/showcase/client";
import { MetricPill } from "@/components/showcase/MetricPill";
import { TechTag } from "@/components/showcase/TechTag";
import { IndustryBadge, ServiceBadge } from "@/components/showcase/CategoryBadges";
import { JsonLd } from "@/components/showcase/JsonLd";

// ---------------------------------------------------------------------------
// ISR — revalidate each detail page every hour alongside the list.
// ---------------------------------------------------------------------------
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// generateStaticParams — pre-render all slugs at build time (full SSG).
//
// Next.js calls this at build time and generates a static HTML file for every
// returned slug. Visitors get a pre-rendered page from the CDN edge —
// no server processing on every request.
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// generateMetadata — per-page SEO (title, description, Open Graph).
//
// Using the async variant lets us fetch the CMS record and produce accurate,
// content-specific meta tags rather than generic page-level fallbacks.
// This is the recommended App Router pattern for dynamic page metadata.
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) {
    return { title: "Case Study Not Found" };
  }

  const title = study.seo?.metaTitle ?? `${study.client} — ${study.projectTitle}`;
  const description =
    study.seo?.metaDescription ?? study.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  // Returning notFound() triggers the nearest not-found.tsx boundary.
  if (!study) notFound();

  // JSON-LD structured data — schema.org Article for rich SERP eligibility.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${study.client} — ${study.projectTitle}`,
    description: study.excerpt,
    author: {
      "@type": "Person",
      name: "Carlos Cavalcanti",
      url: "https://github.com/ccavalcanti11",
    },
    publisher: {
      "@type": "Organization",
      name: "Frontend Portfolio",
    },
    datePublished: `${study.year}-01-01`,
    keywords: study.techStack.join(", "),
  };

  return (
    <>
      {/* Inject JSON-LD into <head> via React's out-of-order streaming */}
      <JsonLd data={jsonLd} />

      <main className="mx-auto max-w-3xl px-4 py-14">
        {/* Back link */}
        <Link
          href="/showcase"
          className="mb-10 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          All case studies
        </Link>

        {/* Hero gradient banner */}
        <div
          className="mb-10 h-48 w-full rounded-2xl sm:h-64"
          style={{ background: study.coverGradient }}
          aria-hidden="true"
        />

        {/* Header */}
        <header className="mb-10 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <IndustryBadge industry={study.industry} />
            <ServiceBadge service={study.service} />
            <span className="inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              {study.year}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {study.client}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {study.projectTitle}
            </h1>
          </div>

          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {study.excerpt}
          </p>
        </header>

        {/* Key metrics */}
        <section
          aria-label="Key performance metrics"
          className="mb-12 flex flex-wrap gap-3"
        >
          {study.metrics.map((metric) => (
            <MetricPill key={metric.label} metric={metric} size="full" />
          ))}
        </section>

        {/* Content sections: challenge / solution / results */}
        <div className="flex flex-col gap-12">
          <ContentSection section={study.challenge} />
          <ContentSection section={study.solution} />
          <ContentSection section={study.results} />
        </div>

        {/* Testimonial */}
        {study.testimonial && (
          <figure className="mt-14 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <blockquote className="text-base italic leading-relaxed text-zinc-700 dark:text-zinc-300">
              &ldquo;{study.testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {study.testimonial.author}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {study.testimonial.role}
              </span>
            </figcaption>
          </figure>
        )}

        {/* Tech stack */}
        <section aria-label="Technologies used" className="mt-14">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {study.techStack.map((tech) => (
              <TechTag key={tech} name={tech} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// ContentSection — renders a CaseStudySection with its heading and rich HTML.
//
// `dangerouslySetInnerHTML` is intentional: the HTML comes from a trusted CMS
// (Contentful), not from user input, making XSS risk equivalent to rendering
// the CMS content in any other framework.
// ---------------------------------------------------------------------------

function ContentSection({
  section,
}: {
  section: { heading: string; body: string };
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
        {section.heading}
      </h2>
      <div
        className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-zinc-900 prose-pre:rounded-lg prose-pre:bg-zinc-900 prose-pre:text-zinc-100 dark:prose-a:text-white"
        dangerouslySetInnerHTML={{ __html: section.body }}
      />
    </section>
  );
}
