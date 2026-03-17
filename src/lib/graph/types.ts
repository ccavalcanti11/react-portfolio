// ---------------------------------------------------------------------------
// Knowledge Graph — Domain Types
//
// Models entities and relationships in a global trade intelligence graph.
// Conceptually mirrors the node/edge model of graph databases such as
// Neo4j and AWS Neptune, adapted to Kpler's commodity-trade domain.
// ---------------------------------------------------------------------------

export type NodeType = "country" | "commodity" | "company";

export type EdgeType =
  | "EXPORTS"
  | "IMPORTS"
  | "PRODUCES"
  | "OPERATES_IN"
  | "TRADE_FLOW";

// ---------------------------------------------------------------------------
// Node properties — discriminated by NodeType
// ---------------------------------------------------------------------------
export interface CountryProperties {
  region:
    | "Middle East"
    | "North America"
    | "Europe"
    | "Asia Pacific"
    | "South America"
    | "Africa";
  flagEmoji: string;
  gdpBillions: number;
  population: string;
  keyFact: string;
}

export interface CommodityProperties {
  category: "LNG" | "Crude Oil" | "Dry Bulk" | "LPG" | "Refined Products";
  unit: string;
  globalDemand: string;
  spotPrice: string;
  keyFact: string;
}

export interface CompanyProperties {
  hq: string;
  companyType: "NOC" | "IOC" | "Independent";
  marketCapBillions: number | null;
  keyFact: string;
}

export type NodeProperties =
  | CountryProperties
  | CommodityProperties
  | CompanyProperties;

// ---------------------------------------------------------------------------
// Graph node — extends D3's simulation datum interface
// ---------------------------------------------------------------------------
export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: NodeProperties;
  /** D3 simulation mutable fields */
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

// ---------------------------------------------------------------------------
// Edge properties — discriminated by EdgeType
// ---------------------------------------------------------------------------
export interface TradeEdgeProperties {
  volumeLabel: string;
  yearEstimate: number;
  trend: "rising" | "stable" | "declining";
  notes?: string;
}

export interface OperationalEdgeProperties {
  since?: number;
  notes?: string;
}

export type EdgeProperties = TradeEdgeProperties | OperationalEdgeProperties;

// ---------------------------------------------------------------------------
// Graph edge — source/target are IDs before simulation resolves them
// ---------------------------------------------------------------------------
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  properties: EdgeProperties;
  /** Visual weight in [0, 1] — drives stroke-width */
  weight?: number;
}

// ---------------------------------------------------------------------------
// SimEdge — after d3-force resolves source/target to full node objects
// ---------------------------------------------------------------------------
export interface SimEdge extends Omit<GraphEdge, "source" | "target"> {
  source: GraphNode;
  target: GraphNode;
}

// ---------------------------------------------------------------------------
// Graph dataset
// ---------------------------------------------------------------------------
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ---------------------------------------------------------------------------
// UI state types
// ---------------------------------------------------------------------------
export interface GraphFilters {
  nodeTypes: Set<NodeType>;
  edgeTypes: Set<EdgeType>;
  searchQuery: string;
}

/** A single step in the "walk the data" breadcrumb trail */
export interface WalkStep {
  nodeId: string;
  label: string;
  type: NodeType;
}
