"use client";

// ---------------------------------------------------------------------------
// GraphLegend — colour key for node types and edge types
// ---------------------------------------------------------------------------

const NODE_LEGEND = [
  { color: "#1d4ed8", stroke: "#93c5fd", label: "Country" },
  { color: "#b45309", stroke: "#fcd34d", label: "Commodity" },
  { color: "#047857", stroke: "#6ee7b7", label: "Company" },
];

const EDGE_LEGEND = [
  { color: "#fb923c", label: "Trade Flow" },
  { color: "#60a5fa", label: "Exports" },
  { color: "#34d399", label: "Imports" },
  { color: "#a78bfa", label: "Produces" },
  { color: "#f472b6", label: "Operates In" },
];

export function GraphLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 py-2 border-t border-zinc-700/60 text-xs text-zinc-400">
      {NODE_LEGEND.map((n) => (
        <div key={n.label} className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle
              cx="7"
              cy="7"
              r="5"
              fill={n.color}
              stroke={n.stroke}
              strokeWidth="1.5"
            />
          </svg>
          <span>{n.label}</span>
        </div>
      ))}

      <span className="text-zinc-600">|</span>

      {EDGE_LEGEND.map((e) => (
        <div key={e.label} className="flex items-center gap-1.5">
          <svg width="18" height="6" viewBox="0 0 18 6">
            <line
              x1="0"
              y1="3"
              x2="14"
              y2="3"
              stroke={e.color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polygon points="14,0 18,3 14,6" fill={e.color} />
          </svg>
          <span>{e.label}</span>
        </div>
      ))}
    </div>
  );
}
