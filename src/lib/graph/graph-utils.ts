// ---------------------------------------------------------------------------
// Graph utility functions
//
// Pure functions for graph traversal, filtering, and path finding.
// These mirror the kind of queries you'd express in Cypher (Neo4j) or
// Gremlin (AWS Neptune) when "walking the data" in a real knowledge graph.
// ---------------------------------------------------------------------------

import type { GraphData, GraphEdge, GraphFilters, GraphNode } from "./types";

// ---------------------------------------------------------------------------
// Build an undirected adjacency map from edge list
// ---------------------------------------------------------------------------
export function buildAdjacency(edges: GraphEdge[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const e of edges) {
    const src = resolveId(e.source);
    const tgt = resolveId(e.target);
    if (!map.has(src)) map.set(src, new Set());
    if (!map.has(tgt)) map.set(tgt, new Set());
    map.get(src)!.add(tgt);
    map.get(tgt)!.add(src); // undirected for walk
  }
  return map;
}

/** Resolve an edge endpoint — it may be a string ID or a resolved node object */
function resolveId(endpoint: string | GraphNode): string {
  return typeof endpoint === "string" ? endpoint : endpoint.id;
}

// ---------------------------------------------------------------------------
// Return all node IDs directly connected to a given node (1 hop)
// ---------------------------------------------------------------------------
export function getNeighbours(nodeId: string, edges: GraphEdge[]): Set<string> {
  return buildAdjacency(edges).get(nodeId) ?? new Set<string>();
}

// ---------------------------------------------------------------------------
// BFS shortest path between two nodes
// Returns an ordered array of node IDs (inclusive), or null if unreachable.
// ---------------------------------------------------------------------------
export function findShortestPath(
  fromId: string,
  toId: string,
  data: GraphData
): string[] | null {
  if (fromId === toId) return [fromId];

  const adj = buildAdjacency(data.edges);
  const visited = new Set<string>();
  const queue: Array<{ id: string; path: string[] }> = [
    { id: fromId, path: [fromId] },
  ];

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    for (const neighbour of adj.get(id) ?? []) {
      if (neighbour === toId) return [...path, neighbour];
      if (!visited.has(neighbour)) {
        queue.push({ id: neighbour, path: [...path, neighbour] });
      }
    }
  }

  return null; // nodes are not connected
}

// ---------------------------------------------------------------------------
// Filter the graph dataset to only the nodes/edges that pass active filters.
// Mirrors the WHERE clause of a graph traversal query.
// ---------------------------------------------------------------------------
export function applyFilters(
  data: GraphData,
  filters: GraphFilters
): GraphData {
  const q = filters.searchQuery.trim().toLowerCase();

  const filteredNodes = data.nodes.filter((n) => {
    if (!filters.nodeTypes.has(n.type)) return false;
    if (q && !n.label.toLowerCase().includes(q)) return false;
    return true;
  });

  const visibleIds = new Set(filteredNodes.map((n) => n.id));

  const filteredEdges = data.edges.filter((e) => {
    const src = resolveId(e.source);
    const tgt = resolveId(e.target);
    if (!visibleIds.has(src) || !visibleIds.has(tgt)) return false;
    if (!filters.edgeTypes.has(e.type)) return false;
    return true;
  });

  return { nodes: filteredNodes, edges: filteredEdges };
}

// ---------------------------------------------------------------------------
// Get all edges that connect to a specific node
// ---------------------------------------------------------------------------
export function getNodeEdges(nodeId: string, edges: GraphEdge[]): GraphEdge[] {
  return edges.filter((e) => {
    const src = resolveId(e.source);
    const tgt = resolveId(e.target);
    return src === nodeId || tgt === nodeId;
  });
}

// ---------------------------------------------------------------------------
// Determine whether two node IDs share an edge in the highlighted path
// ---------------------------------------------------------------------------
export function isPathEdge(
  srcId: string,
  tgtId: string,
  path: string[]
): boolean {
  for (let i = 0; i < path.length - 1; i++) {
    if (
      (path[i] === srcId && path[i + 1] === tgtId) ||
      (path[i] === tgtId && path[i + 1] === srcId)
    ) {
      return true;
    }
  }
  return false;
}
