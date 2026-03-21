// ---------------------------------------------------------------------------
// MetricPill — displays a single KPI with value, label, and optional delta.
//
// Sentiment drives colour: positive → green, neutral → zinc.
// Used on CaseStudyCard (compact) and the detail page (larger variant).
// ---------------------------------------------------------------------------

import type { CaseStudyMetric } from "@/lib/showcase/types";

interface MetricPillProps {
  metric: CaseStudyMetric;
  /** "compact" is used on cards; "full" adds more padding on the detail page. */
  size?: "compact" | "full";
}

const SENTIMENT_STYLES = {
  positive: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
} as const;

export function MetricPill({ metric, size = "compact" }: MetricPillProps) {
  const sentimentClass = SENTIMENT_STYLES[metric.sentiment];
  const padding = size === "full" ? "px-4 py-3" : "px-3 py-2";

  return (
    <div
      className={`${sentimentClass} ${padding} flex flex-col gap-0.5 rounded-lg`}
      role="group"
      aria-label={`${metric.label}: ${metric.value}${metric.delta ? ` (${metric.delta})` : ""}`}
    >
      <span
        className={`font-bold leading-none tabular-nums ${
          size === "full" ? "text-2xl" : "text-lg"
        }`}
      >
        {metric.value}
        {metric.delta && (
          <span className="ml-1.5 text-xs font-semibold opacity-80">
            {metric.delta}
          </span>
        )}
      </span>
      <span
        className={`leading-tight opacity-75 ${
          size === "full" ? "text-sm" : "text-xs"
        }`}
      >
        {metric.label}
      </span>
    </div>
  );
}
