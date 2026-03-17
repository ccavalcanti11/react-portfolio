"use client";

// ---------------------------------------------------------------------------
// useGraph — central state manager for the Knowledge Graph Explorer
//
// Manages:
//   - Node selection  (click a node → see its details, highlight its edges)
//   - Walk trail      (breadcrumb of nodes visited in the current session)
//   - Path finder     (BFS shortest path between selected node and a target)
//   - Filters         (visible node/edge types + search query)
//
// This hook is the React equivalent of a graph traversal session —
// exactly the "walk the data" concept described in Kpler's knowledge-graph
// platform.
// ---------------------------------------------------------------------------

import { useCallback, useMemo, useState } from "react";
import type {
  EdgeType,
  GraphFilters,
  GraphNode,
  NodeType,
  WalkStep,
} from "@/lib/graph/types";
import { GRAPH_DATA } from "@/lib/graph/mock-data";
import {
  applyFilters,
  findShortestPath,
  getNeighbours,
} from "@/lib/graph/graph-utils";

const ALL_NODE_TYPES = new Set<NodeType>(["country", "commodity", "company"]);
const ALL_EDGE_TYPES = new Set<EdgeType>([
  "EXPORTS",
  "IMPORTS",
  "PRODUCES",
  "OPERATES_IN",
  "TRADE_FLOW",
]);

const DEFAULT_FILTERS: GraphFilters = {
  nodeTypes: ALL_NODE_TYPES,
  edgeTypes: ALL_EDGE_TYPES,
  searchQuery: "",
};

export function useGraph() {
  // ── Selection ────────────────────────────────────────────────────────────
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // ── Walk trail (exploration breadcrumb) ──────────────────────────────────
  const [walkPath, setWalkPath] = useState<WalkStep[]>([]);

  // ── Path finder ──────────────────────────────────────────────────────────
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<GraphFilters>(DEFAULT_FILTERS);

  // ── Derived data ─────────────────────────────────────────────────────────
  const visibleData = useMemo(
    () => applyFilters(GRAPH_DATA, filters),
    [filters]
  );

  const selectedNode = useMemo(
    () => GRAPH_DATA.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [selectedNodeId]
  );

  /** Direct neighbours of the selected node (1 hop) */
  const neighbours = useMemo(
    () =>
      selectedNodeId
        ? getNeighbours(selectedNodeId, GRAPH_DATA.edges)
        : new Set<string>(),
    [selectedNodeId]
  );

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Select a node and append it to the walk trail */
  const selectNode = useCallback((node: GraphNode) => {
    setSelectedNodeId(node.id);
    setHighlightedPath([]); // clear previous path highlight on new click
    setWalkPath((prev) => {
      // Avoid duplicate consecutive entries
      if (prev.length > 0 && prev[prev.length - 1].nodeId === node.id)
        return prev;
      return [...prev, { nodeId: node.id, label: node.label, type: node.type }];
    });
  }, []);

  /** Jump back to a prior walk step (clicking a breadcrumb) */
  const jumpToWalkStep = useCallback(
    (index: number) => {
      const step = walkPath[index];
      if (!step) return;
      setWalkPath((prev) => prev.slice(0, index + 1));
      setSelectedNodeId(step.nodeId);
      setHighlightedPath([]);
    },
    [walkPath]
  );

  /** Clear the entire walk session */
  const clearWalk = useCallback(() => {
    setWalkPath([]);
    setSelectedNodeId(null);
    setHighlightedPath([]);
  }, []);

  /** Deselect without clearing the trail */
  const deselect = useCallback(() => {
    setSelectedNodeId(null);
    setHighlightedPath([]);
  }, []);

  /** Find and highlight shortest path from selected node to a target */
  const findPath = useCallback(
    (toId: string) => {
      if (!selectedNodeId) return;
      const path = findShortestPath(selectedNodeId, toId, GRAPH_DATA);
      setHighlightedPath(path ?? []);
    },
    [selectedNodeId]
  );

  /** Toggle a node type in the filter set */
  const toggleNodeType = useCallback((type: NodeType) => {
    setFilters((prev) => {
      const next = new Set(prev.nodeTypes);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type); // always keep at least one
      } else {
        next.add(type);
      }
      return { ...prev, nodeTypes: next };
    });
  }, []);

  /** Toggle an edge type in the filter set */
  const toggleEdgeType = useCallback((type: EdgeType) => {
    setFilters((prev) => {
      const next = new Set(prev.edgeTypes);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return { ...prev, edgeTypes: next };
    });
  }, []);

  /** Update the free-text search filter */
  const setSearchQuery = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
  }, []);

  /** Reset all filters to defaults */
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    // raw full dataset (always available for BFS across the whole graph)
    fullData: GRAPH_DATA,
    // filtered dataset sent to the canvas
    visibleData,
    // selection state
    selectedNode,
    selectedNodeId,
    neighbours,
    // walk trail
    walkPath,
    // path finder
    highlightedPath,
    // filter state
    filters,
    // actions
    selectNode,
    jumpToWalkStep,
    clearWalk,
    deselect,
    findPath,
    toggleNodeType,
    toggleEdgeType,
    setSearchQuery,
    resetFilters,
  };
}
