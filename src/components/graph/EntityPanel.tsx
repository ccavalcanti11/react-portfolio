"use client";

// ---------------------------------------------------------------------------
// EntityPanel — context panel for the selected graph node
//
// Shows:
//   • Node type, label, and domain-specific properties
//   • All connected edges and their neighbour nodes
//   • "Find shortest path to …" interactive path finder
//
// This panel embodies the "knowledge discovery" experience: once you select
// a node you can see exactly how it connects to the rest of the graph and
// navigate to any connected entity with a single click.
// ---------------------------------------------------------------------------

import { useState } from "react";
import type {
  CompanyProperties,
  CommodityProperties,
  CountryProperties,
  GraphEdge,
  GraphNode,
  NodeType,
  TradeEdgeProperties,
  OperationalEdgeProperties,
} from "@/lib/graph/types";
import { GRAPH_DATA } from "@/lib/graph/mock-data";
import { getNodeEdges } from "@/lib/graph/graph-utils";

// ── Config ───────────────────────────────────────────────────────────────────
const TYPE_BADGE: Record<NodeType, string> = {
  country: "bg-blue-900/70 text-blue-300 border-blue-700",
  commodity: "bg-amber-900/70 text-amber-300 border-amber-700",
  company: "bg-emerald-900/70 text-emerald-300 border-emerald-700",
};

const EDGE_COLOR: Record<string, string> = {
  EXPORTS: "#60a5fa",
  IMPORTS: "#34d399",
  PRODUCES: "#a78bfa",
  OPERATES_IN: "#f472b6",
  TRADE_FLOW: "#fb923c",
};

const TREND_ICON = {
  rising: "↗",
  stable: "→",
  declining: "↘",
} as const;
const TREND_COLOR = {
  rising: "text-emerald-400",
  stable: "text-zinc-400",
  declining: "text-rose-400",
} as const;

interface EntityPanelProps {
  node: GraphNode | null;
  onNodeClick: (node: GraphNode) => void;
  onFindPath: (toId: string) => void;
}

export function EntityPanel({ node, onNodeClick, onFindPath }: EntityPanelProps) {
  const [showPathFinder, setShowPathFinder] = useState(false);
  const [pathQuery, setPathQuery] = useState("");

  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-full p-6 text-center">
        <span className="text-4xl opacity-40">🕸️</span>
        <p className="text-sm text-zinc-500 leading-relaxed max-w-[200px]">
          Click any node in the graph to explore its connections.
        </p>
        <p className="text-xs text-zinc-600">
          Drag to move nodes · Scroll to zoom · Double-click background to reset
        </p>
      </div>
    );
  }

  const edges = getNodeEdges(node.id, GRAPH_DATA.edges);
  const nodeMap = new Map(GRAPH_DATA.nodes.map((n) => [n.id, n]));

  // Path-finder search results
  const filteredNodes = pathQuery.trim()
    ? GRAPH_DATA.nodes.filter(
        (n) =>
          n.id !== node.id &&
          n.label.toLowerCase().includes(pathQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col gap-0 overflow-hidden h-full">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-700/60">
        <div className="flex items-start gap-2 mb-1">
          <span
            className={`shrink-0 mt-0.5 rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${TYPE_BADGE[node.type]}`}
          >
            {node.type}
          </span>
        </div>
        <h2 className="text-base font-bold text-zinc-100 leading-snug">
          {node.type === "country"
            ? `${(node.properties as CountryProperties).flagEmoji}  ${node.label}`
            : node.label}
        </h2>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {/* Properties */}
        <NodeProperties node={node} />

        {/* Connections */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Connections ({edges.length})
          </h3>
          <ul className="flex flex-col gap-1">
            {edges.map((edge) => {
              const otherId =
                edge.source === node.id || (edge.source as unknown as GraphNode)?.id === node.id
                  ? edge.target
                  : edge.source;
              const otherNode = nodeMap.get(
                typeof otherId === "string"
                  ? otherId
                  : (otherId as unknown as GraphNode).id
              );
              if (!otherNode) return null;

              const props = edge.properties as Partial<TradeEdgeProperties>;
              const trend = props.trend;

              return (
                <li key={edge.id}>
                  <button
                    onClick={() => onNodeClick(otherNode)}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100 transition-colors group"
                  >
                    {/* Edge type indicator */}
                    <span
                      className="shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: EDGE_COLOR[edge.type] ?? "#64748b" }}
                    />
                    {/* Edge label */}
                    <span
                      className="shrink-0 text-[10px] font-mono"
                      style={{ color: EDGE_COLOR[edge.type] ?? "#94a3b8" }}
                    >
                      {edge.type.replace("_", " ")}
                    </span>
                    {/* Neighbour name */}
                    <span className="flex-1 font-medium truncate">
                      {otherNode.label}
                    </span>
                    {/* Volume + trend */}
                    {props.volumeLabel && (
                      <span className="shrink-0 text-zinc-500">
                        {props.volumeLabel}
                      </span>
                    )}
                    {trend && (
                      <span
                        className={`shrink-0 font-bold ${TREND_COLOR[trend]}`}
                      >
                        {TREND_ICON[trend]}
                      </span>
                    )}
                    {/* Navigate arrow */}
                    <span className="shrink-0 text-zinc-600 group-hover:text-zinc-300 transition-colors">
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Path Finder ─────────────────────────────────────────────── */}
        <div className="border-t border-zinc-700/60 pt-3">
          <button
            onClick={() => {
              setShowPathFinder((v) => !v);
              setPathQuery("");
            }}
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <span>🔗 Find shortest path to…</span>
            <span className="text-zinc-600">{showPathFinder ? "▲" : "▼"}</span>
          </button>

          {showPathFinder && (
            <div className="mt-2 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Type a node name…"
                value={pathQuery}
                onChange={(e) => setPathQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500/60 transition-colors"
                autoFocus
              />
              {filteredNodes.length > 0 && (
                <ul className="flex flex-col gap-0.5 max-h-36 overflow-y-auto">
                  {filteredNodes.map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => {
                          onFindPath(n.id);
                          setPathQuery("");
                          setShowPathFinder(false);
                        }}
                        className="w-full text-left rounded px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-orange-500/10 hover:text-orange-300 transition-colors"
                      >
                        {n.label}
                        <span className="ml-1.5 text-zinc-600 capitalize">
                          ({n.type})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {pathQuery.trim() && filteredNodes.length === 0 && (
                <p className="text-xs text-zinc-500 italic px-1">
                  No nodes match "{pathQuery}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Node-type specific property sections ─────────────────────────────────────
function NodeProperties({ node }: { node: GraphNode }) {
  const p = node.properties;

  if (node.type === "country") {
    const cp = p as CountryProperties;
    return (
      <div className="flex flex-col gap-2">
        <PropRow label="Region" value={cp.region} />
        <PropRow label="GDP" value={`$${cp.gdpBillions.toLocaleString()} B` } />
        <PropRow label="Population" value={cp.population} />
        <KeyFact text={cp.keyFact} />
      </div>
    );
  }

  if (node.type === "commodity") {
    const cp = p as CommodityProperties;
    return (
      <div className="flex flex-col gap-2">
        <PropRow label="Category" value={cp.category} />
        <PropRow label="Unit" value={cp.unit} />
        <PropRow label="Global demand" value={cp.globalDemand} />
        <PropRow label="Spot price" value={cp.spotPrice} />
        <KeyFact text={cp.keyFact} />
      </div>
    );
  }

  // company
  const cp = p as CompanyProperties;
  return (
    <div className="flex flex-col gap-2">
      <PropRow label="HQ" value={cp.hq} />
      <PropRow label="Type" value={cp.companyType} />
      {cp.marketCapBillions && (
        <PropRow label="Market cap" value={`$${cp.marketCapBillions.toLocaleString()} B`} />
      )}
      <KeyFact text={cp.keyFact} />
    </div>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 text-xs">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className="text-zinc-300 text-right">{value}</span>
    </div>
  );
}

function KeyFact({ text }: { text: string }) {
  return (
    <p className="text-xs text-zinc-400 bg-zinc-800/60 rounded-lg px-3 py-2 leading-relaxed border border-zinc-700/40 italic">
      {text}
    </p>
  );
}
