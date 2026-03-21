// ---------------------------------------------------------------------------
// Category badges — IndustryBadge and ServiceBadge.
//
// Each badge resolves its colour from a static map keyed on the enum value.
// Adding a new industry or service type requires only a map entry here —
// the TypeScript Record ensures exhaustive coverage at compile time.
// ---------------------------------------------------------------------------

import type { Industry, ServiceType } from "@/lib/showcase/types";
import { INDUSTRY_LABELS, SERVICE_LABELS } from "@/lib/showcase/types";

// ---------------------------------------------------------------------------
// Colour maps
// ---------------------------------------------------------------------------

const INDUSTRY_COLOURS: Record<Industry, string> = {
  retail: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  healthcare: "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
  finance: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
  education: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300",
  automotive: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
};

const SERVICE_COLOURS: Record<ServiceType, string> = {
  "digital-transformation": "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  "ux-design": "bg-pink-100 text-pink-800 dark:bg-pink-950/50 dark:text-pink-300",
  "product-engineering": "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300",
  "platform-architecture": "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  "campaign-management": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
};

// ---------------------------------------------------------------------------
// Base pill
// ---------------------------------------------------------------------------

function Pill({
  label,
  colourClass,
}: {
  label: string;
  colourClass: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colourClass}`}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Public components
// ---------------------------------------------------------------------------

export function IndustryBadge({ industry }: { industry: Industry }) {
  return (
    <Pill label={INDUSTRY_LABELS[industry]} colourClass={INDUSTRY_COLOURS[industry]} />
  );
}

export function ServiceBadge({ service }: { service: ServiceType }) {
  return (
    <Pill label={SERVICE_LABELS[service]} colourClass={SERVICE_COLOURS[service]} />
  );
}
