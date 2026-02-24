import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/blog/client";
import { PostContent } from "@/components/blog/PostContent";
import { TagBadge } from "@/components/blog/TagBadge";

// ---------------------------------------------------------------------------
// ISR — revalidate individual post pages every hour.
// When an author updates a post in Hygraph, the stale HTML is replaced within
// one hour automatically. For immediate updates, call revalidatePath() from
// a CMS webhook pointing at /api/revalidate.
// ---------------------------------------------------------------------------
export const revalidate = 3600;

// ---------------------------------------------------------------------------
// SSG — pre-render every known slug at build time.
//
// generateStaticParams tells Next.js which dynamic route values to pre-render.
// Each slug becomes a fully static HTML file served from the CDN edge —
// zero server latency for the first byte, near-perfect Core Web Vitals.
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Per-page SEO metadata
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags.map((t) => t.name),
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * Individual blog post page — server component.
 *
 * Fetching strategy:
 *  - Statically generated at build time for every known slug
 *  - Revalidated via ISR (revalidate = 3600)
 *  - Falls back to on-demand generation for slugs published after build
 *
 * Content is rendered from the CMS HTML string via PostContent.
 */
export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 text-sm text-zinc-500 dark:text-zinc-400"
      >
        <Link
          href="/blog"
          className="transition-colors hover:text-zinc-900 dark:hover:text-white"
        >
          Blog
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-zinc-900 dark:text-white">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 flex flex-col gap-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-5 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
          {post.updatedAt !== post.publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <span>Updated {formatDate(post.updatedAt)}</span>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <PostContent html={post.content.html} />

      {/* Footer navigation */}
      <footer className="mt-16 border-t border-zinc-100 pt-8 dark:border-zinc-800">
        <Link
          href="/blog"
          className="text-sm font-medium text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
