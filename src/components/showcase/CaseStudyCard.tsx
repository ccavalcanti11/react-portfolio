import Link from "next/link";
import type { CaseStudySummary } from "@/lib/showcase/types";
import { MetricPill } from "./MetricPill";
import { TechTag } from "./TechTag";
import { IndustryBadge, ServiceBadge } from "./CategoryBadges";

// ---------------------------------------------------------------------------
// CaseStudyCard — grid card for the showcase list page.
//
// Purely presentational — all data arrives as props.
// The card is a Next.js <Link> so the entire surface is a navigation target;
// the hover/focus ring provides a clear interactive affordance.
// ---------------------------------------------------------------------------

interface CaseStudyCardProps {
  study: CaseStudySummary;
  /** Index within the rendered list — used only to stagger aria-labels. */
  index: number;
}

/** Maximum tech tags shown on the card to keep the layout compact. */
const MAX_TECH_TAGS = 4;

export function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  const visibleTech = study.techStack.slice(0, MAX_TECH_TAGS);
  const remainingTech = study.techStack.length - MAX_TECH_TAGS;

  return (
    <Link
      href={`/showcase/${study.slug}`}
      aria-label={`${study.client} — ${study.projectTitle}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:focus-visible:ring-white"
      data-testid={`case-study-card-${index}`}
    >
      {/* Gradient cover */}
      <div
        className="h-36 w-full"
        style={{ background: study.coverGradient }}
        aria-hidden="true"
      />

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <IndustryBadge industry={study.industry} />
          <ServiceBadge service={study.service} />
        </div>

        {/* Client + title */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            {study.client} · {study.year}
          </p>
          <h2 className="text-base font-semibold leading-snug text-zinc-900 group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-200">
            {study.projectTitle}
          </h2>
        </div>

        {/* Excerpt */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {study.excerpt}
        </p>

        {/* Key metrics */}
        {study.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {study.metrics.slice(0, 3).map((metric) => (
              <MetricPill key={metric.label} metric={metric} size="compact" />
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleTech.map((tech) => (
            <TechTag key={tech} name={tech} />
          ))}
          {remainingTech > 0 && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              +{remainingTech} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
