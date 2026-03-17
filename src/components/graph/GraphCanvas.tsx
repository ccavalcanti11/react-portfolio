"use client";

// ---------------------------------------------------------------------------
// GraphCanvas — D3 force-directed knowledge graph
//
// Architecture: D3 owns the SVG DOM, React provides the container and
// communicates state changes back to D3 via secondary effects.
//
// Two effects:
//   1. [data]           — builds/rebuilds the full simulation when the
//                         visible node/edge dataset changes.
//   2. [selection, …]  — updates visual state (opacity, stroke) when
//                         the selected node, neighbour set, or path changes,
//                         WITHOUT touching the simulation positions.
//
// Interactions:
//   • Click node        → onNodeClick callback (drives useGraph)
//   • Drag node         → pin while dragging, release to float
//   • Scroll / pinch    → zoom + pan via d3-zoom
//   • Double-click bg   → reset zoom to identity
// ---------------------------------------------------------------------------

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { GraphData, GraphNode, NodeType, SimEdge } from "@/lib/graph/types";

// ── Visual config per node type ─────────────────────────────────────────────
const NODE_FILL: Record<NodeType, string> = {
  country: "#1d4ed8",
  commodity: "#b45309",
  company: "#047857",
};
const NODE_STROKE: Record<NodeType, string> = {
  country: "#93c5fd",
  commodity: "#fcd34d",
  company: "#6ee7b7",
};
const NODE_RADIUS: Record<NodeType, number> = {
  country: 26,
  commodity: 22,
  company: 18,
};
const EDGE_COLOR: Record<string, string> = {
  EXPORTS: "#60a5fa",
  IMPORTS: "#34d399",
  PRODUCES: "#a78bfa",
  OPERATES_IN: "#f472b6",
  TRADE_FLOW: "#fb923c",
};

function nodeEmoji(node: GraphNode): string {
  if (node.type === "country") {
    return (node.properties as { flagEmoji: string }).flagEmoji ?? "🌍";
  }
  if (node.type === "commodity") {
    const cat = (node.properties as { category: string }).category;
    const map: Record<string, string> = {
      LNG: "🔵",
      "Crude Oil": "🛢️",
      "Dry Bulk": "⛏️",
      LPG: "💨",
      "Refined Products": "⚗️",
    };
    return map[cat] ?? "📦";
  }
  return "🏢";
}

// ── Props ───────────────────────────────────────────────────────────────────
interface GraphCanvasProps {
  data: GraphData;
  selectedNodeId: string | null;
  neighbours: Set<string>;
  highlightedPath: string[];
  onNodeClick: (node: GraphNode) => void;
  onBackgroundClick: () => void;
}

export function GraphCanvas({
  data,
  selectedNodeId,
  neighbours,
  highlightedPath,
  onNodeClick,
  onBackgroundClick,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Hold references to D3 selections so the second effect can update them
  const nodeSelRef = useRef<d3.Selection<
    SVGGElement,
    GraphNode,
    SVGGElement,
    unknown
  > | null>(null);
  const linkSelRef = useRef<d3.Selection<
    SVGLineElement,
    SimEdge,
    SVGGElement,
    unknown
  > | null>(null);
  const simRef = useRef<d3.Simulation<GraphNode, SimEdge> | null>(null);

  // ── Effect 1: build simulation ──────────────────────────────────────────
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = svgEl.clientWidth || 900;
    const height = svgEl.clientHeight || 600;

    // ── Arrow markers ──────────────────────────────────────────────────────
    const defs = svg.append("defs");
    Object.entries(EDGE_COLOR).forEach(([type, color]) => {
      defs
        .append("marker")
        .attr("id", `arrow-${type}`)
        .attr("viewBox", "0 -4 8 8")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .attr("fill", color)
        .attr("opacity", 0.8);
    });

    // ── Main group (must be declared before zoom handler captures it) ──────
    const g = svg.append("g");

    // ── Zoom ───────────────────────────────────────────────────────────────
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg
      .call(zoom)
      .on("dblclick.zoom", null) // disable double-click zoom
      .on("click", (event) => {
        // Background click = deselect
        if (event.target === svgEl) onBackgroundClick();
      });

    // Initial zoom-out so the full graph is visible on load
    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.75)
    );

    // ── Data copies (D3 mutates positions in-place) ────────────────────────
    const nodes: GraphNode[] = data.nodes.map((n) => ({ ...n }));
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    const links: SimEdge[] = data.edges
      .map((e) => ({
        ...e,
        source: nodeMap.get(
          typeof e.source === "string" ? e.source : (e.source as GraphNode).id
        )!,
        target: nodeMap.get(
          typeof e.target === "string" ? e.target : (e.target as GraphNode).id
        )!,
      }))
      .filter((e) => e.source && e.target);

    // ── Force simulation ───────────────────────────────────────────────────
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, SimEdge>(links)
          .id((d) => d.id)
          .distance(130)
          .strength(0.4)
      )
      .force("charge", d3.forceManyBody<GraphNode>().strength(-500))
      .force("center", d3.forceCenter(0, 0))
      .force(
        "collision",
        d3
          .forceCollide<GraphNode>()
          .radius((d) => NODE_RADIUS[d.type] + 18)
      )
      .force("x", d3.forceX(0).strength(0.04))
      .force("y", d3.forceY(0).strength(0.04))
      .alphaDecay(0.03);

    simRef.current = simulation;

    // ── Edges ──────────────────────────────────────────────────────────────
    const linkSel = g
      .append("g")
      .attr("class", "links")
      .selectAll<SVGLineElement, SimEdge>("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => EDGE_COLOR[d.type] ?? "#64748b")
      .attr("stroke-width", (d) => Math.max(1, (d.weight ?? 0.5) * 3.5))
      .attr("stroke-opacity", 0.55)
      .attr("stroke-linecap", "round")
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

    linkSelRef.current = linkSel;

    // ── Edge volume labels (TRADE_FLOW only) ───────────────────────────────
    const edgeLabelSel = g
      .append("g")
      .attr("class", "edge-labels")
      .selectAll<SVGTextElement, SimEdge>("text")
      .data(links.filter((d) => d.type === "TRADE_FLOW"))
      .join("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#94a3b8")
      .attr("pointer-events", "none")
      .attr("opacity", 0)
      .text((d) => (d.properties as { volumeLabel: string }).volumeLabel ?? "");

    // ── Nodes ──────────────────────────────────────────────────────────────
    const nodeSel = g
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes, (d) => d.id)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d);
      });

    nodeSelRef.current = nodeSel;

    // Shadow / glow filter
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Outer ring (selection indicator — hidden by default)
    nodeSel
      .append("circle")
      .attr("class", "ring")
      .attr("r", (d) => NODE_RADIUS[d.type] + 7)
      .attr("fill", "none")
      .attr("stroke", "#facc15")
      .attr("stroke-width", 2.5)
      .attr("opacity", 0)
      .attr("filter", "url(#glow)");

    // Main circle
    nodeSel
      .append("circle")
      .attr("class", "body")
      .attr("r", (d) => NODE_RADIUS[d.type])
      .attr("fill", (d) => NODE_FILL[d.type])
      .attr("stroke", (d) => NODE_STROKE[d.type])
      .attr("stroke-width", 1.5);

    // Emoji icon
    nodeSel
      .append("text")
      .attr("class", "icon")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d) => `${NODE_RADIUS[d.type] * 0.78}px`)
      .attr("pointer-events", "none")
      .text((d) => nodeEmoji(d));

    // Node label below circle
    nodeSel
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => NODE_RADIUS[d.type] + 14)
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", "#e2e8f0")
      .attr("pointer-events", "none")
      .text((d) => d.label);

    // ── Tick ───────────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d) => {
          const r = NODE_RADIUS[(d.source as GraphNode).type];
          return offsetEndpoint(
            d.source as GraphNode,
            d.target as GraphNode,
            r
          ).x;
        })
        .attr("y1", (d) => {
          const r = NODE_RADIUS[(d.source as GraphNode).type];
          return offsetEndpoint(
            d.source as GraphNode,
            d.target as GraphNode,
            r
          ).y;
        })
        .attr("x2", (d) => {
          const r = NODE_RADIUS[(d.target as GraphNode).type] + 10;
          return offsetEndpoint(
            d.target as GraphNode,
            d.source as GraphNode,
            r
          ).x;
        })
        .attr("y2", (d) => {
          const r = NODE_RADIUS[(d.target as GraphNode).type] + 10;
          return offsetEndpoint(
            d.target as GraphNode,
            d.source as GraphNode,
            r
          ).y;
        });

      edgeLabelSel
        .attr(
          "x",
          (d) =>
            ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2
        )
        .attr(
          "y",
          (d) =>
            ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2 - 5
        );

      nodeSel.attr(
        "transform",
        (d) => `translate(${d.x ?? 0},${d.y ?? 0})`
      );
    });

    return () => {
      simulation.stop();
    };
    // onNodeClick / onBackgroundClick are stable callbacks — intentionally
    // excluded to avoid rebuilding the simulation on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ── Effect 2: update visual state on selection/path change ─────────────
  useEffect(() => {
    const nodeSel = nodeSelRef.current;
    const linkSel = linkSelRef.current;
    if (!nodeSel || !linkSel) return;

    const hasFocus = selectedNodeId !== null;

    // Nodes
    nodeSel.each(function (d) {
      const el = d3.select(this);
      const isSelected = d.id === selectedNodeId;
      const isNeighbour = neighbours.has(d.id);
      const isInPath = highlightedPath.includes(d.id);
      const isActive = isSelected || isNeighbour || isInPath;

      // Ring visibility
      el.select<SVGCircleElement>(".ring").attr(
        "opacity",
        isSelected ? 1 : isInPath ? 0.6 : 0
      );

      // Body opacity
      el.select<SVGCircleElement>(".body")
        .attr("opacity", hasFocus && !isActive ? 0.15 : 1)
        .attr(
          "stroke",
          isSelected
            ? "#facc15"
            : isInPath
            ? "#fb923c"
            : NODE_STROKE[d.type]
        )
        .attr("stroke-width", isSelected ? 3 : isInPath ? 2.5 : 1.5);

      // Text opacity
      el.select<SVGTextElement>(".label").attr(
        "opacity",
        hasFocus && !isActive ? 0.12 : 1
      );
      el.select<SVGTextElement>(".icon").attr(
        "opacity",
        hasFocus && !isActive ? 0.15 : 1
      );
    });

    // Edges
    linkSel.each(function (d) {
      const el = d3.select(this);
      const srcId = (d.source as GraphNode).id;
      const tgtId = (d.target as GraphNode).id;

      const isPathEdge =
        highlightedPath.length > 1 &&
        highlightedPath.some(
          (id, i) =>
            i < highlightedPath.length - 1 &&
            ((id === srcId && highlightedPath[i + 1] === tgtId) ||
              (id === tgtId && highlightedPath[i + 1] === srcId))
        );

      const isSelectedEdge =
        srcId === selectedNodeId || tgtId === selectedNodeId;

      let opacity = 0.55;
      let strokeWidth = Math.max(1, (d.weight ?? 0.5) * 3.5);

      if (hasFocus) {
        if (isPathEdge) {
          opacity = 1;
          strokeWidth = 4;
        } else if (isSelectedEdge) {
          opacity = 0.85;
        } else {
          opacity = 0.04;
        }
      }

      el.attr("stroke-opacity", opacity).attr("stroke-width", strokeWidth);
    });
  }, [selectedNodeId, neighbours, highlightedPath]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      aria-label="Trade Intelligence Knowledge Graph"
    />
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Offset an edge endpoint so arrowheads land on the node perimeter */
function offsetEndpoint(
  from: GraphNode,
  to: GraphNode,
  radius: number
): { x: number; y: number } {
  const dx = (to.x ?? 0) - (from.x ?? 0);
  const dy = (to.y ?? 0) - (from.y ?? 0);
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: (from.x ?? 0) + (dx / dist) * radius,
    y: (from.y ?? 0) + (dy / dist) * radius,
  };
}
