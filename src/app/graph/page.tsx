"use client";

// ---------------------------------------------------------------------------
// /graph — Trade Intelligence Knowledge Graph Explorer
//
// A portfolio project that directly mirrors the "walk the data" concept
// described by Kpler's knowledge graph platform:
//
//   • Force-directed graph of 12 countries, 4 commodities, 8 major energy
//     companies — connected by realistic 2024 trade-flow data.
//   • Click any node → highlight its connections, view domain-specific
//     properties, and add it to a breadcrumb walk trail.
//   • BFS path finder — discover the shortest relationship chain between
//     any two entities in the graph.
//   • Filter by node type and edge type; full-text search on labels.
//   • Drag nodes, zoom/pan, double-click background to reset.
//
// Tech: Next.js · TypeScript · D3 v7 (force simulation + zoom + drag)
// ---------------------------------------------------------------------------

import { useGraph } from "@/hooks/useGraph";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { EntityPanel } from "@/components/graph/EntityPanel";
import { GraphToolbar } from "@/components/graph/GraphToolbar";
import { WalkBreadcrumb } from "@/components/graph/WalkBreadcrumb";
import { GraphLegend } from "@/components/graph/GraphLegend";

export default function GraphPage() {
  const {
    visibleData,
    selectedNode,
    selectedNodeId,
    neighbours,
    walkPath,
    highlightedPath,
    filters,
    selectNode,
    jumpToWalkStep,
    clearWalk,
    deselect,
    findPath,
    toggleNodeType,
    toggleEdgeType,
    setSearchQuery,
    resetFilters,
  } = useGraph();

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 49px)" }}>
      {/* ── Toolbar (search + filters) ─────────────────────────────────── */}
      <GraphToolbar
        filters={filters}
        onToggleNodeType={toggleNodeType}
        onToggleEdgeType={toggleEdgeType}
        onSearchChange={setSearchQuery}
        onReset={resetFilters}
      />

      {/* ── Walk trail ─────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800 bg-zinc-950/60">
        <WalkBreadcrumb
          path={walkPath}
          onStepClick={jumpToWalkStep}
          onClear={clearWalk}
        />
      </div>

      {/* ── Main area: graph canvas + entity panel ─────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — entity details */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 border-r border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <EntityPanel
            node={selectedNode}
            onNodeClick={selectNode}
            onFindPath={findPath}
          />
        </aside>

        {/* Graph canvas */}
        <main className="relative flex-1 overflow-hidden bg-zinc-950">
          {/* Stats overlay — top-right */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 text-xs text-zinc-500">
            <span className="bg-zinc-900/80 border border-zinc-800 rounded-md px-2 py-1">
              {visibleData.nodes.length} nodes
            </span>
            <span className="bg-zinc-900/80 border border-zinc-800 rounded-md px-2 py-1">
              {visibleData.edges.length} edges
            </span>
            {highlightedPath.length > 1 && (
              <span className="bg-orange-950/80 border border-orange-800 text-orange-300 rounded-md px-2 py-1">
                Path: {highlightedPath.length - 1} hop
                {highlightedPath.length - 1 !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Hint overlay — bottom-left */}
          <div className="absolute bottom-3 left-3 z-10 text-[10px] text-zinc-600 space-y-0.5 pointer-events-none">
            <p>Scroll to zoom · Drag canvas to pan · Drag node to pin</p>
            <p>Double-click background to reset view</p>
          </div>

          <GraphCanvas
            data={visibleData}
            selectedNodeId={selectedNodeId}
            neighbours={neighbours}
            highlightedPath={highlightedPath}
            onNodeClick={selectNode}
            onBackgroundClick={deselect}
          />
        </main>

        {/* Mobile entity panel — below graph on small screens */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 z-10 max-h-64 overflow-y-auto bg-zinc-900/95 border-t border-zinc-800 backdrop-blur">
          <EntityPanel
            node={selectedNode}
            onNodeClick={selectNode}
            onFindPath={findPath}
          />
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <GraphLegend />
    </div>
  );
}
