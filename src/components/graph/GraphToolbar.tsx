"use client";

// ---------------------------------------------------------------------------
// GraphToolbar — search + filter controls for the knowledge graph
// ---------------------------------------------------------------------------

import { useCallback } from "react";
import type { EdgeType, GraphFilters, NodeType } from "@/lib/graph/types";

interface GraphToolbarProps {
  filters: GraphFilters;
  onToggleNodeType: (type: NodeType) => void;
  onToggleEdgeType: (type: EdgeType) => void;
  onSearchChange: (q: string) => void;
  onReset: () => void;
}

const NODE_TYPE_CONFIG: Array<{
  type: NodeType;
  label: string;
  color: string;
  icon: string;
}> = [
  { type: "country", label: "Countries", color: "text-blue-400 border-blue-500 bg-blue-500/10", icon: "🌍" },
  { type: "commodity", label: "Commodities", color: "text-amber-400 border-amber-500 bg-amber-500/10", icon: "📦" },
  { type: "company", label: "Companies", color: "text-emerald-400 border-emerald-500 bg-emerald-500/10", icon: "🏢" },
];

const EDGE_TYPE_CONFIG: Array<{
  type: EdgeType;
  label: string;
  color: string;
}> = [
  { type: "TRADE_FLOW", label: "Trade Flows", color: "text-orange-400 border-orange-500 bg-orange-500/10" },
  { type: "EXPORTS", label: "Exports", color: "text-blue-400 border-blue-500 bg-blue-500/10" },
  { type: "IMPORTS", label: "Imports", color: "text-teal-400 border-teal-500 bg-teal-500/10" },
  { type: "PRODUCES", label: "Produces", color: "text-violet-400 border-violet-500 bg-violet-500/10" },
  { type: "OPERATES_IN", label: "Operates In", color: "text-pink-400 border-pink-500 bg-pink-500/10" },
];

export function GraphToolbar({
  filters,
  onToggleNodeType,
  onToggleEdgeType,
  onSearchChange,
  onReset,
}: GraphToolbarProps) {
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const isDefaultFilters =
    filters.nodeTypes.size === 3 &&
    filters.edgeTypes.size === 5 &&
    filters.searchQuery === "";

  return (
    <div className="flex flex-col gap-3 px-4 py-3 border-b border-zinc-700/60">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm select-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search nodes…"
          value={filters.searchQuery}
          onChange={handleSearch}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-colors"
        />
      </div>

      {/* Node type filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-zinc-500 mr-1 shrink-0">Nodes:</span>
        {NODE_TYPE_CONFIG.map(({ type, label, color, icon }) => (
          <button
            key={type}
            onClick={() => onToggleNodeType(type)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all
              ${
                filters.nodeTypes.has(type)
                  ? color
                  : "border-zinc-700 text-zinc-500 bg-transparent"
              }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Edge type filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-zinc-500 mr-1 shrink-0">Edges:</span>
        {EDGE_TYPE_CONFIG.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => onToggleEdgeType(type)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all
              ${
                filters.edgeTypes.has(type)
                  ? color
                  : "border-zinc-700 text-zinc-500 bg-transparent"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Reset button — only shown when filters are non-default */}
      {!isDefaultFilters && (
        <button
          onClick={onReset}
          className="self-start text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-200 transition-colors"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
