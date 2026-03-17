"use client";

// ---------------------------------------------------------------------------
// WalkBreadcrumb — visual trail of the user's exploration path
//
// Each click on a node appends a step to the trail.  Clicking a past step
// jumps back to that point, truncating the trail.  This is the core "walk
// the data" UX concept described in Kpler's knowledge-graph platform.
// ---------------------------------------------------------------------------

import type { NodeType, WalkStep } from "@/lib/graph/types";

interface WalkBreadcrumbProps {
  path: WalkStep[];
  onStepClick: (index: number) => void;
  onClear: () => void;
}

const TYPE_STYLE: Record<NodeType, string> = {
  country: "bg-blue-900/60 text-blue-300 border-blue-700",
  commodity: "bg-amber-900/60 text-amber-300 border-amber-700",
  company: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
};

const TYPE_ICON: Record<NodeType, string> = {
  country: "🌍",
  commodity: "📦",
  company: "🏢",
};

export function WalkBreadcrumb({
  path,
  onStepClick,
  onClear,
}: WalkBreadcrumbProps) {
  if (path.length === 0) {
    return (
      <div className="px-4 py-2.5 text-xs text-zinc-500 italic">
        Click any node to start walking the data…
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2.5 overflow-x-auto flex-nowrap scrollbar-thin">
      <span className="text-xs text-zinc-500 shrink-0 mr-1">Walk:</span>

      {path.map((step, i) => (
        <div key={`${step.nodeId}-${i}`} className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onStepClick(i)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all
              hover:brightness-125
              ${
                i === path.length - 1
                  ? `${TYPE_STYLE[step.type]} ring-1 ring-yellow-400/60 shadow-sm`
                  : `${TYPE_STYLE[step.type]} opacity-70`
              }`}
            title={`Jump back to ${step.label}`}
          >
            <span>{TYPE_ICON[step.type]}</span>
            {step.label}
          </button>
          {i < path.length - 1 && (
            <span className="text-zinc-600 text-xs">→</span>
          )}
        </div>
      ))}

      <button
        onClick={onClear}
        className="ml-2 shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        title="Clear walk trail"
      >
        ✕
      </button>
    </div>
  );
}
