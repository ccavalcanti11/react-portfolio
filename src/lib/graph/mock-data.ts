// ---------------------------------------------------------------------------
// Trade Intelligence Knowledge Graph — Mock Data
//
// Nodes: 12 countries, 4 commodities, 8 major energy companies.
// Edges: OPERATES_IN, PRODUCES, EXPORTS, IMPORTS, TRADE_FLOW.
//
// All figures are realistic 2024 estimates drawn from publicly available
// energy-market data (IEA, EIA, BP Statistical Review, Kpler reports).
// This dataset is intentionally domain-aligned with Kpler's commodity
// intelligence business to demonstrate industry context.
// ---------------------------------------------------------------------------

import type { GraphData } from "./types";

export const GRAPH_DATA: GraphData = {
  nodes: [
    // ── COUNTRIES ────────────────────────────────────────────────────────
    {
      id: "sa",
      type: "country",
      label: "Saudi Arabia",
      properties: {
        region: "Middle East",
        flagEmoji: "🇸🇦",
        gdpBillions: 1061,
        population: "36 M",
        keyFact:
          "World's largest crude oil exporter — ~7.2 mb/d in 2024; OPEC+ swing producer.",
      },
    },
    {
      id: "us",
      type: "country",
      label: "United States",
      properties: {
        region: "North America",
        flagEmoji: "🇺🇸",
        gdpBillions: 27360,
        population: "335 M",
        keyFact:
          "World's #1 LNG exporter since 2023 (~91 bcm/y) and #1 crude producer (~13 mb/d).",
      },
    },
    {
      id: "ru",
      type: "country",
      label: "Russia",
      properties: {
        region: "Europe",
        flagEmoji: "🇷🇺",
        gdpBillions: 1862,
        population: "143 M",
        keyFact:
          "Post-2022 sanctions reshuffled crude & gas flows — massive pivot to Asian buyers.",
      },
    },
    {
      id: "qa",
      type: "country",
      label: "Qatar",
      properties: {
        region: "Middle East",
        flagEmoji: "🇶🇦",
        gdpBillions: 221,
        population: "3 M",
        keyFact:
          "2nd largest LNG exporter (77 mtpa); NFS expansion targets 126 mtpa by 2027.",
      },
    },
    {
      id: "cn",
      type: "country",
      label: "China",
      properties: {
        region: "Asia Pacific",
        flagEmoji: "🇨🇳",
        gdpBillions: 17700,
        population: "1.4 B",
        keyFact:
          "World's largest LNG and crude importer; drives ~70 % of global iron-ore demand.",
      },
    },
    {
      id: "jp",
      type: "country",
      label: "Japan",
      properties: {
        region: "Asia Pacific",
        flagEmoji: "🇯🇵",
        gdpBillions: 4212,
        population: "125 M",
        keyFact:
          "Historically the world's top LNG importer; 100 % dependent on imports for LNG.",
      },
    },
    {
      id: "kr",
      type: "country",
      label: "South Korea",
      properties: {
        region: "Asia Pacific",
        flagEmoji: "🇰🇷",
        gdpBillions: 1709,
        population: "52 M",
        keyFact:
          "3rd largest LNG importer; significant spot buyer sensitive to JKM price swings.",
      },
    },
    {
      id: "de",
      type: "country",
      label: "Germany",
      properties: {
        region: "Europe",
        flagEmoji: "🇩🇪",
        gdpBillions: 4456,
        population: "84 M",
        keyFact:
          "Rapid LNG diversification post-2022: 5 new FSRUs commissioned in 12 months.",
      },
    },
    {
      id: "in",
      type: "country",
      label: "India",
      properties: {
        region: "Asia Pacific",
        flagEmoji: "🇮🇳",
        gdpBillions: 3730,
        population: "1.4 B",
        keyFact:
          "Fast-growing energy importer; became Russia's #1 crude buyer by volume in 2023.",
      },
    },
    {
      id: "br",
      type: "country",
      label: "Brazil",
      properties: {
        region: "South America",
        flagEmoji: "🇧🇷",
        gdpBillions: 2174,
        population: "215 M",
        keyFact:
          "Pre-salt crude ramp-up: Petrobras targeting 2 mb/d output by 2030.",
      },
    },
    {
      id: "au",
      type: "country",
      label: "Australia",
      properties: {
        region: "Asia Pacific",
        flagEmoji: "🇦🇺",
        gdpBillions: 1707,
        population: "26 M",
        keyFact:
          "Largest LNG export capacity globally (~80 mtpa); world's top iron-ore exporter.",
      },
    },
    {
      id: "no",
      type: "country",
      label: "Norway",
      properties: {
        region: "Europe",
        flagEmoji: "🇳🇴",
        gdpBillions: 546,
        population: "5.5 M",
        keyFact:
          "Europe's top pipeline gas supplier post-2022; Hammerfest LNG key asset.",
      },
    },

    // ── COMMODITIES ──────────────────────────────────────────────────────
    {
      id: "lng",
      type: "commodity",
      label: "LNG",
      properties: {
        category: "LNG",
        unit: "mtpa",
        globalDemand: "~400 mtpa (2024)",
        spotPrice: "$9–12 /MMBtu JKM spot",
        keyFact:
          "Fastest-growing traded energy commodity; market expected to double by 2040.",
      },
    },
    {
      id: "crude",
      type: "commodity",
      label: "Crude Oil",
      properties: {
        category: "Crude Oil",
        unit: "mb/d",
        globalDemand: "~102 mb/d (2024)",
        spotPrice: "$75–85 /bbl Brent",
        keyFact:
          "Backbone of global energy; OPEC+ supply management remains the key price driver.",
      },
    },
    {
      id: "iron_ore",
      type: "commodity",
      label: "Iron Ore",
      properties: {
        category: "Dry Bulk",
        unit: "mt/y",
        globalDemand: "~2,600 mt/y (2024)",
        spotPrice: "$100–130 /t CFR China",
        keyFact:
          "China's steel sector dominates demand; Australia and Brazil supply ~80 % of seaborne trade.",
      },
    },
    {
      id: "lpg",
      type: "commodity",
      label: "LPG",
      properties: {
        category: "LPG",
        unit: "mt/y",
        globalDemand: "~330 mt/y (2024)",
        spotPrice: "$450–550 /t Saudi CP",
        keyFact:
          "Dual-use: petrochemical feedstock in Asia, cooking fuel in emerging markets.",
      },
    },

    // ── COMPANIES ────────────────────────────────────────────────────────
    {
      id: "aramco",
      type: "company",
      label: "Saudi Aramco",
      properties: {
        hq: "Dhahran, Saudi Arabia",
        companyType: "NOC",
        marketCapBillions: 1800,
        keyFact:
          "World's largest oil producer (~12 % of global output); lowest-cost producer at ~$3 /bbl.",
      },
    },
    {
      id: "qe",
      type: "company",
      label: "QatarEnergy",
      properties: {
        hq: "Doha, Qatar",
        companyType: "NOC",
        marketCapBillions: null,
        keyFact:
          "State monopoly controlling all Qatari LNG; world's largest single LNG portfolio holder.",
      },
    },
    {
      id: "shell",
      type: "company",
      label: "Shell",
      properties: {
        hq: "London, UK",
        companyType: "IOC",
        marketCapBillions: 210,
        keyFact:
          "World's largest LNG trader (~31 mtpa equity + third-party); operates Prelude FLNG.",
      },
    },
    {
      id: "bp",
      type: "company",
      label: "BP",
      properties: {
        hq: "London, UK",
        companyType: "IOC",
        marketCapBillions: 90,
        keyFact:
          "Active in LNG shipping and gas trading; divested Rosneft stake post-2022.",
      },
    },
    {
      id: "total",
      type: "company",
      label: "TotalEnergies",
      properties: {
        hq: "Paris, France",
        companyType: "IOC",
        marketCapBillions: 145,
        keyFact:
          "Top LNG portfolio holder (~21 mtpa); backed Qatar NFS expansion as key JV partner.",
      },
    },
    {
      id: "equinor",
      type: "company",
      label: "Equinor",
      properties: {
        hq: "Stavanger, Norway",
        companyType: "IOC",
        marketCapBillions: 80,
        keyFact:
          "Operates Hammerfest LNG; critical backstop for European gas supply post-2022.",
      },
    },
    {
      id: "chevron",
      type: "company",
      label: "Chevron",
      properties: {
        hq: "San Ramon, CA, USA",
        companyType: "IOC",
        marketCapBillions: 280,
        keyFact:
          "Operates Gorgon & Wheatstone in Australia — combined ~16.6 mtpa LNG capacity.",
      },
    },
    {
      id: "cnooc",
      type: "company",
      label: "CNOOC",
      properties: {
        hq: "Beijing, China",
        companyType: "NOC",
        marketCapBillions: 75,
        keyFact:
          "China's largest offshore oil producer; major long-term LNG buyer securing supply.",
      },
    },
  ],

  edges: [
    // ── OPERATES_IN ──────────────────────────────────────────────────────
    {
      id: "op1",
      source: "aramco",
      target: "sa",
      type: "OPERATES_IN",
      properties: { since: 1933, notes: "Fully nationalised by 1980" },
    },
    {
      id: "op2",
      source: "qe",
      target: "qa",
      type: "OPERATES_IN",
      properties: { since: 1974, notes: "State monopoly on all Qatari resources" },
    },
    {
      id: "op3",
      source: "equinor",
      target: "no",
      type: "OPERATES_IN",
      properties: { since: 1972 },
    },
    {
      id: "op4",
      source: "chevron",
      target: "us",
      type: "OPERATES_IN",
      properties: { since: 1879 },
    },
    {
      id: "op5",
      source: "chevron",
      target: "au",
      type: "OPERATES_IN",
      properties: { notes: "Gorgon & Wheatstone LNG" },
    },
    {
      id: "op6",
      source: "shell",
      target: "au",
      type: "OPERATES_IN",
      properties: { notes: "Prelude FLNG, QG6 stake" },
    },
    {
      id: "op7",
      source: "shell",
      target: "qa",
      type: "OPERATES_IN",
      properties: { notes: "JV partner in QatarGas trains" },
    },
    {
      id: "op8",
      source: "total",
      target: "qa",
      type: "OPERATES_IN",
      properties: { notes: "NFS expansion JV partner" },
    },
    {
      id: "op9",
      source: "cnooc",
      target: "cn",
      type: "OPERATES_IN",
      properties: { since: 1982 },
    },
    {
      id: "op10",
      source: "bp",
      target: "in",
      type: "OPERATES_IN",
      properties: { notes: "Upstream exploration blocks" },
    },

    // ── PRODUCES ─────────────────────────────────────────────────────────
    {
      id: "pr1",
      source: "aramco",
      target: "crude",
      type: "PRODUCES",
      properties: { volumeLabel: "12 mb/d", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "pr2",
      source: "aramco",
      target: "lpg",
      type: "PRODUCES",
      properties: { volumeLabel: "12 mt/y", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "pr3",
      source: "qe",
      target: "lng",
      type: "PRODUCES",
      properties: { volumeLabel: "77 mtpa", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "pr4",
      source: "equinor",
      target: "lng",
      type: "PRODUCES",
      properties: { volumeLabel: "4.8 mtpa", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "pr5",
      source: "chevron",
      target: "lng",
      type: "PRODUCES",
      properties: {
        volumeLabel: "16.6 mtpa",
        yearEstimate: 2024,
        trend: "stable",
        notes: "Gorgon + Wheatstone combined",
      },
    },
    {
      id: "pr6",
      source: "chevron",
      target: "crude",
      type: "PRODUCES",
      properties: { volumeLabel: "3.1 mb/d", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "pr7",
      source: "shell",
      target: "lng",
      type: "PRODUCES",
      properties: {
        volumeLabel: "31 mtpa",
        yearEstimate: 2024,
        trend: "stable",
        notes: "World's largest equity + traded portfolio",
      },
    },
    {
      id: "pr8",
      source: "total",
      target: "lng",
      type: "PRODUCES",
      properties: { volumeLabel: "21 mtpa", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "pr9",
      source: "cnooc",
      target: "crude",
      type: "PRODUCES",
      properties: { volumeLabel: "0.66 mb/d", yearEstimate: 2024, trend: "rising" },
    },

    // ── EXPORTS ──────────────────────────────────────────────────────────
    {
      id: "ex1",
      source: "sa",
      target: "crude",
      type: "EXPORTS",
      weight: 1.0,
      properties: { volumeLabel: "7.2 mb/d", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "ex2",
      source: "sa",
      target: "lpg",
      type: "EXPORTS",
      weight: 0.8,
      properties: { volumeLabel: "16 mt/y", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "ex3",
      source: "us",
      target: "lng",
      type: "EXPORTS",
      weight: 1.0,
      properties: {
        volumeLabel: "91 bcm/y",
        yearEstimate: 2024,
        trend: "rising",
        notes: "Overtook Australia & Qatar in 2023",
      },
    },
    {
      id: "ex4",
      source: "us",
      target: "crude",
      type: "EXPORTS",
      weight: 0.7,
      properties: { volumeLabel: "4.1 mb/d", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "ex5",
      source: "ru",
      target: "crude",
      type: "EXPORTS",
      weight: 0.85,
      properties: {
        volumeLabel: "4.8 mb/d",
        yearEstimate: 2024,
        trend: "declining",
        notes: "G7 price cap; redirected East post-2022",
      },
    },
    {
      id: "ex6",
      source: "qa",
      target: "lng",
      type: "EXPORTS",
      weight: 0.95,
      properties: { volumeLabel: "77 mtpa", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "ex7",
      source: "au",
      target: "lng",
      type: "EXPORTS",
      weight: 0.9,
      properties: { volumeLabel: "80 mtpa", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "ex8",
      source: "au",
      target: "iron_ore",
      type: "EXPORTS",
      weight: 0.95,
      properties: { volumeLabel: "900 mt/y", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "ex9",
      source: "no",
      target: "lng",
      type: "EXPORTS",
      weight: 0.5,
      properties: { volumeLabel: "6 mtpa", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "ex10",
      source: "br",
      target: "crude",
      type: "EXPORTS",
      weight: 0.6,
      properties: {
        volumeLabel: "1.4 mb/d",
        yearEstimate: 2024,
        trend: "rising",
        notes: "Pre-salt Lula/Búzios fields",
      },
    },

    // ── IMPORTS ──────────────────────────────────────────────────────────
    {
      id: "im1",
      source: "cn",
      target: "lng",
      type: "IMPORTS",
      weight: 0.9,
      properties: { volumeLabel: "71 mtpa", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "im2",
      source: "cn",
      target: "crude",
      type: "IMPORTS",
      weight: 1.0,
      properties: { volumeLabel: "11 mb/d", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "im3",
      source: "cn",
      target: "iron_ore",
      type: "IMPORTS",
      weight: 0.95,
      properties: { volumeLabel: "1,180 mt/y", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "im4",
      source: "jp",
      target: "lng",
      type: "IMPORTS",
      weight: 0.85,
      properties: { volumeLabel: "63 mtpa", yearEstimate: 2024, trend: "declining" },
    },
    {
      id: "im5",
      source: "jp",
      target: "crude",
      type: "IMPORTS",
      weight: 0.7,
      properties: { volumeLabel: "2.7 mb/d", yearEstimate: 2024, trend: "declining" },
    },
    {
      id: "im6",
      source: "kr",
      target: "lng",
      type: "IMPORTS",
      weight: 0.7,
      properties: { volumeLabel: "44 mtpa", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "im7",
      source: "de",
      target: "lng",
      type: "IMPORTS",
      weight: 0.55,
      properties: {
        volumeLabel: "20 mtpa",
        yearEstimate: 2024,
        trend: "rising",
        notes: "5 new FSRUs since 2023",
      },
    },
    {
      id: "im8",
      source: "in",
      target: "crude",
      type: "IMPORTS",
      weight: 0.75,
      properties: { volumeLabel: "4.6 mb/d", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "im9",
      source: "in",
      target: "lng",
      type: "IMPORTS",
      weight: 0.5,
      properties: { volumeLabel: "25 mtpa", yearEstimate: 2024, trend: "rising" },
    },

    // ── TRADE_FLOW (bilateral shipping routes) ────────────────────────────
    {
      id: "tf1",
      source: "qa",
      target: "cn",
      type: "TRADE_FLOW",
      weight: 0.9,
      properties: {
        volumeLabel: "14 mtpa LNG",
        yearEstimate: 2024,
        trend: "rising",
        notes: "27-year SPA signed Nov 2022",
      },
    },
    {
      id: "tf2",
      source: "qa",
      target: "jp",
      type: "TRADE_FLOW",
      weight: 0.85,
      properties: {
        volumeLabel: "13 mtpa LNG",
        yearEstimate: 2024,
        trend: "stable",
        notes: "Long-term contracts active since 1990s",
      },
    },
    {
      id: "tf3",
      source: "qa",
      target: "kr",
      type: "TRADE_FLOW",
      weight: 0.7,
      properties: { volumeLabel: "9 mtpa LNG", yearEstimate: 2024, trend: "stable" },
    },
    {
      id: "tf4",
      source: "qa",
      target: "de",
      type: "TRADE_FLOW",
      weight: 0.5,
      properties: {
        volumeLabel: "3 mtpa LNG",
        yearEstimate: 2024,
        trend: "rising",
        notes: "New contracts post-2022 energy crisis",
      },
    },
    {
      id: "tf5",
      source: "qa",
      target: "in",
      type: "TRADE_FLOW",
      weight: 0.55,
      properties: { volumeLabel: "8 mtpa LNG", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "tf6",
      source: "us",
      target: "jp",
      type: "TRADE_FLOW",
      weight: 0.7,
      properties: { volumeLabel: "10 mtpa LNG", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "tf7",
      source: "us",
      target: "kr",
      type: "TRADE_FLOW",
      weight: 0.65,
      properties: { volumeLabel: "8 mtpa LNG", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "tf8",
      source: "us",
      target: "de",
      type: "TRADE_FLOW",
      weight: 0.7,
      properties: {
        volumeLabel: "12 mtpa LNG",
        yearEstimate: 2024,
        trend: "rising",
        notes: "Replacing lost Russian pipeline gas",
      },
    },
    {
      id: "tf9",
      source: "us",
      target: "cn",
      type: "TRADE_FLOW",
      weight: 0.4,
      properties: {
        volumeLabel: "5 mtpa LNG",
        yearEstimate: 2024,
        trend: "declining",
        notes: "Volatile; subject to US-China trade tensions",
      },
    },
    {
      id: "tf10",
      source: "us",
      target: "in",
      type: "TRADE_FLOW",
      weight: 0.6,
      properties: { volumeLabel: "7 mtpa LNG", yearEstimate: 2024, trend: "rising" },
    },
    {
      id: "tf11",
      source: "sa",
      target: "cn",
      type: "TRADE_FLOW",
      weight: 0.85,
      properties: {
        volumeLabel: "1.8 mb/d crude",
        yearEstimate: 2024,
        trend: "stable",
      },
    },
    {
      id: "tf12",
      source: "sa",
      target: "jp",
      type: "TRADE_FLOW",
      weight: 0.7,
      properties: {
        volumeLabel: "1.1 mb/d crude",
        yearEstimate: 2024,
        trend: "declining",
      },
    },
    {
      id: "tf13",
      source: "sa",
      target: "in",
      type: "TRADE_FLOW",
      weight: 0.75,
      properties: {
        volumeLabel: "0.9 mb/d crude",
        yearEstimate: 2024,
        trend: "stable",
      },
    },
    {
      id: "tf14",
      source: "ru",
      target: "cn",
      type: "TRADE_FLOW",
      weight: 0.9,
      properties: {
        volumeLabel: "2.1 mb/d crude",
        yearEstimate: 2024,
        trend: "rising",
        notes: "Significant diversion after 2022 sanctions",
      },
    },
    {
      id: "tf15",
      source: "ru",
      target: "in",
      type: "TRADE_FLOW",
      weight: 0.85,
      properties: {
        volumeLabel: "1.9 mb/d crude",
        yearEstimate: 2024,
        trend: "rising",
        notes: "India's largest crude supplier as of 2023",
      },
    },
    {
      id: "tf16",
      source: "au",
      target: "cn",
      type: "TRADE_FLOW",
      weight: 0.95,
      properties: {
        volumeLabel: "800 mt/y iron ore",
        yearEstimate: 2024,
        trend: "stable",
      },
    },
    {
      id: "tf17",
      source: "au",
      target: "jp",
      type: "TRADE_FLOW",
      weight: 0.8,
      properties: {
        volumeLabel: "30 mtpa LNG",
        yearEstimate: 2024,
        trend: "stable",
      },
    },
    {
      id: "tf18",
      source: "au",
      target: "kr",
      type: "TRADE_FLOW",
      weight: 0.65,
      properties: {
        volumeLabel: "12 mtpa LNG",
        yearEstimate: 2024,
        trend: "stable",
      },
    },
    {
      id: "tf19",
      source: "no",
      target: "de",
      type: "TRADE_FLOW",
      weight: 0.6,
      properties: {
        volumeLabel: "5 mtpa LNG",
        yearEstimate: 2024,
        trend: "rising",
        notes: "Pipeline + LNG; critical European supply backstop",
      },
    },
    {
      id: "tf20",
      source: "br",
      target: "cn",
      type: "TRADE_FLOW",
      weight: 0.7,
      properties: {
        volumeLabel: "0.8 mb/d crude",
        yearEstimate: 2024,
        trend: "rising",
        notes: "Pre-salt heavy crude highly valued by Chinese refiners",
      },
    },
  ],
};
