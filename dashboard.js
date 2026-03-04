// Fleet Orchestration Market Intelligence Dashboard
// Greenbay: The Context Layer for Fleet Operations

(function() {
"use strict";

try {

var React = window.React;
var ReactDOM = window.ReactDOM;
var Recharts = window.Recharts;

var useState = React.useState;
var useEffect = React.useEffect;
var createElement = React.createElement;

// Recharts components
var LineChart = Recharts.LineChart;
var BarChart = Recharts.BarChart;
var AreaChart = Recharts.AreaChart;
var PieChart = Recharts.PieChart;
var RadarChart = Recharts.RadarChart;
var ComposedChart = Recharts.ComposedChart;
var Treemap = Recharts.Treemap;
var Line = Recharts.Line;
var Bar = Recharts.Bar;
var Area = Recharts.Area;
var Pie = Recharts.Pie;
var Radar = Recharts.Radar;
var PolarGrid = Recharts.PolarGrid;
var PolarAngleAxis = Recharts.PolarAngleAxis;
var PolarRadiusAxis = Recharts.PolarRadiusAxis;
var XAxis = Recharts.XAxis;
var YAxis = Recharts.YAxis;
var CartesianGrid = Recharts.CartesianGrid;
var Tooltip = Recharts.Tooltip;
var Legend = Recharts.Legend;
var ResponsiveContainer = Recharts.ResponsiveContainer;
var Cell = Recharts.Cell;
var ReferenceLine = Recharts.ReferenceLine;

// ============ COLOR PALETTE ============
var COLORS = {
  primary: "#00d4aa",
  secondary: "#6366f1",
  accent: "#f59e0b",
  danger: "#ef4444",
  success: "#22c55e",
  info: "#3b82f6",
  purple: "#a855f7",
  pink: "#ec4899",
  cyan: "#06b6d4",
  orange: "#f97316",
  lime: "#84cc16",
  emerald: "#10b981",
  background: "#050B18",
  card: "#0d1525",
  cardHover: "#1a2744",
  border: "#1e3a5f",
  text: "#e5e7eb",
  textMuted: "#9ca3af",
  textDim: "#6b7280"
};

var CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.info, COLORS.purple, COLORS.pink, COLORS.cyan, COLORS.orange];

// ============ MARKET DATA ============
// Sources: MarketsandMarkets (Dec 2024), Mordor Intelligence, IEA Global EV Outlook 2025
var MARKET_SIZE_DATA = {
  // TAM/SAM/SOM Analysis (aligned with Fleet Electrification Intel report)
  // TAM: Global fleet management software market
  tam: {
    current: 32.9,      // 2025 in $B (Mordor Intelligence)
    projected: 70,      // 2030 in $B (MarketsandMarkets)
    cagr: 13.3,         // % (MarketsandMarkets)
    source: "MarketsandMarkets Fleet Management Market Report 2025-2030"
  },
  // SAM: Heavy-Duty Trucking Segment (Transportation & Logistics = 45% of TAM)
  sam: {
    current: 14.8,      // 2025 in $B (45% of TAM)
    projected: 32,      // 2030 in $B (45% of $70B TAM)
    share: 45,          // % of TAM
    description: "HD trucking segment (T&L = 45% of market)",
    source: "MarketsandMarkets (T&L segment share)"
  },
  // SOM: EV Fleet Orchestration (Greenbay's addressable market)
  // Bottom-up calculation based on target customer segments
  som: {
    projected: 42,      // $42M base case (in millions, not billions)
    projectedLow: 15,   // $15M conservative
    projectedHigh: 80,  // $80M aggressive
    description: "Bottom-up: Transit + Commercial E-Fleets (US + Europe)",
    source: "Greenbay Analysis - Bottom-up model",
    isEstimate: true,
    methodology: "Target customers × ACV × win rate"
  },
  // Bottom-up Model Details
  bottomUpModel: {
    // Target Customer Segments
    segments: [
      {
        name: "Enterprise Transit (500+ vehicles)",
        description: "Large transit agencies with E-Bus fleets",
        usCount: 50,      // MTA, LA Metro, CTA, SEPTA, etc.
        euCount: 100,     // TfL, RATP, BVG, ATM Milan, etc.
        total: 150,
        acv: 400000,      // $400K/year
        source: "FTA NTD, UITP Europe"
      },
      {
        name: "Mid-Market Transit (100-500 vehicles)",
        description: "Regional transit agencies deploying E-Buses",
        usCount: 150,
        euCount: 200,
        total: 350,
        acv: 250000,      // $250K/year
        source: "FTA NTD (~850 urban agencies), UITP (500+ EU operators)"
      },
      {
        name: "Enterprise Commercial (500+ vehicles)",
        description: "Large logistics/delivery fleets with EVs",
        usCount: 100,     // Amazon, FedEx, UPS, Walmart, etc.
        euCount: 150,     // DHL, DB Schenker, Royal Mail, etc.
        total: 250,
        acv: 350000,      // $350K/year
        source: "EV100 Climate Group, company announcements"
      }
    ],
    totalTargetCustomers: 750,
    // Scenarios
    scenarios: [
      {
        name: "Conservative",
        description: "Transit focus, early traction",
        targetCustomers: 500,
        winRate: 0.10,
        avgAcv: 300000,
        som: 15,          // $15M
        assumptions: "10% win rate, transit-only focus"
      },
      {
        name: "Base Case",
        description: "Transit + selective commercial",
        targetCustomers: 750,
        winRate: 0.15,
        avgAcv: 375000,
        som: 42,          // $42M
        assumptions: "15% win rate, balanced market approach"
      },
      {
        name: "Aggressive",
        description: "Full market penetration",
        targetCustomers: 1000,
        winRate: 0.20,
        avgAcv: 400000,
        som: 80,          // $80M
        assumptions: "20% win rate, category leadership"
      }
    ],
    sources: [
      "FTA National Transit Database (~3,000 US transit operators, ~850 urban)",
      "UITP Europe (500+ transit operators in EU)",
      "APTA 2023 Fact Book (54,000 US transit buses)",
      "Sustainable Bus (9,346 EU E-bus registrations Jan-Sep 2025)",
      "Climate Group EV100 (corporate fleet commitments)"
    ]
  },
  // 5-Year ARR Projection (2026-2030)
  arrProjection: {
    startYear: 2026,
    avgAcv: 375000,  // $375K base case ACV
    // Conservative Scenario
    conservative: [
      { year: 2026, arr: 0.5, customers: 2, newCustomers: 2, churn: 0, growth: null, note: "Early traction" },
      { year: 2027, arr: 1.5, customers: 5, newCustomers: 4, churn: 1, growth: 200, note: "Product-market fit" },
      { year: 2028, arr: 4.0, customers: 13, newCustomers: 9, churn: 1, growth: 167, note: "Sales scaling" },
      { year: 2029, arr: 8.0, customers: 25, newCustomers: 14, churn: 2, growth: 100, note: "Market expansion" },
      { year: 2030, arr: 15.0, customers: 50, newCustomers: 28, churn: 3, growth: 88, note: "Reaching SOM" }
    ],
    // Base Case Scenario
    base: [
      { year: 2026, arr: 0.75, customers: 2, newCustomers: 2, churn: 0, growth: null, note: "Launch with 2 design partners" },
      { year: 2027, arr: 3.0, customers: 8, newCustomers: 7, churn: 1, growth: 300, note: "Product-market fit, 4x growth" },
      { year: 2028, arr: 10.0, customers: 27, newCustomers: 21, churn: 2, growth: 233, note: "Sales team scaling" },
      { year: 2029, arr: 22.0, customers: 59, newCustomers: 35, churn: 3, growth: 120, note: "Geographic expansion" },
      { year: 2030, arr: 42.0, customers: 112, newCustomers: 58, churn: 5, growth: 91, note: "Category leadership" }
    ],
    // Aggressive Scenario
    aggressive: [
      { year: 2026, arr: 1.0, customers: 3, newCustomers: 3, churn: 0, growth: null, note: "Strong launch" },
      { year: 2027, arr: 5.0, customers: 13, newCustomers: 11, churn: 1, growth: 400, note: "Viral adoption" },
      { year: 2028, arr: 18.0, customers: 45, newCustomers: 35, churn: 3, growth: 260, note: "Market dominance" },
      { year: 2029, arr: 40.0, customers: 100, newCustomers: 60, churn: 5, growth: 122, note: "International scale" },
      { year: 2030, arr: 80.0, customers: 200, newCustomers: 108, churn: 8, growth: 100, note: "Category leader" }
    ],
    assumptions: {
      avgAcv: "$375K (blended across segments)",
      churnRate: "5-10% annual (typical enterprise SaaS)",
      salesCycle: "6-12 months for enterprise transit",
      netRevenueRetention: "110-120% (expansion within accounts)",
      teamScaling: "Sales team doubles each year in growth phase"
    }
  },
  // Unit Economics
  unitEconomics: {
    // Core Metrics
    acv: 375000,              // $375K average contract value
    grossMargin: 0.72,        // 72% (70-75% range, some services)
    cac: 125000,              // $125K (100-150K range, enterprise sales)
    customerLifetime: 10,     // 10 years (5% annual churn)
    annualChurn: 0.05,        // 5% logo churn
    nrr: 1.15,                // 115% net revenue retention
    // Calculated Metrics
    get ltv() { return this.acv * this.grossMargin * this.customerLifetime; },           // $2.7M
    get ltvCacRatio() { return this.ltv / this.cac; },                                    // 21.6x
    get cacPaybackMonths() { return this.cac / (this.acv * this.grossMargin / 12); },    // 5.6 months
    get grossProfit() { return this.acv * this.grossMargin; },                            // $270K
    // Scenario Analysis
    scenarios: [
      {
        name: "Conservative",
        grossMargin: 0.68,
        cac: 150000,
        lifetime: 7,
        nrr: 1.08,
        description: "Higher CAC, more churn, lower margins"
      },
      {
        name: "Base Case",
        grossMargin: 0.72,
        cac: 125000,
        lifetime: 10,
        nrr: 1.15,
        description: "Balanced assumptions"
      },
      {
        name: "Optimistic",
        grossMargin: 0.78,
        cac: 100000,
        lifetime: 12,
        nrr: 1.22,
        description: "Strong product-led growth, high retention"
      }
    ],
    // Cost Structure (% of revenue at scale)
    costStructure: {
      cogs: 0.28,             // 28% - hosting, support, implementation
      salesMarketing: 0.35,   // 35% - sales team, marketing, events
      rd: 0.20,               // 20% - engineering, product
      ga: 0.10,               // 10% - admin, legal, finance
      operatingMargin: 0.07   // 7% operating margin at scale
    },
    // Benchmarks for comparison
    benchmarks: {
      saasMedianLtvCac: 3.0,
      saasTopQuartileLtvCac: 5.0,
      saasMedianCacPayback: 18,
      saasMedianGrossMargin: 0.75,
      saasMedianNrr: 1.10
    },
    // Sources and notes
    sources: [
      "Gross Margin: 70-75% typical for enterprise SaaS with implementation services",
      "CAC: $100-150K for enterprise sales with 6-12 month cycles",
      "Lifetime: 10 years based on 5% annual churn (mission-critical infrastructure)",
      "NRR: 115% assuming 10% expansion, 5% churn within existing accounts",
      "Benchmarks: OpenView Partners SaaS Benchmarks 2024, Bessemer Cloud Index"
    ]
  },
  // Segments - based on industry analyst reports
  segments: [
    { name: "Telematics & Tracking", size: 11.5, share: 35, growth: 12 },
    { name: "Fleet Analytics", size: 6.6, share: 20, growth: 18 },
    { name: "Route Optimization", size: 4.9, share: 15, growth: 15 },
    { name: "Maintenance Management", size: 3.9, share: 12, growth: 11 },
    { name: "Fuel/Energy Management", size: 3.3, share: 10, growth: 22 },
    { name: "Orchestration & Integration", size: 2.5, share: 8, growth: 33, isEstimate: true }
  ],
  // Regional breakdown - Mordor Intelligence
  regions: [
    { region: "North America", share: 36, size: 11.8, growth: 13 },
    { region: "Europe", share: 28, size: 9.2, growth: 15 },
    { region: "Asia Pacific", share: 26, size: 8.6, growth: 15.4 },
    { region: "Rest of World", share: 10, size: 3.3, growth: 14 }
  ],
  // Market projections - interpolated from MarketsandMarkets/Mordor
  projections: [
    { year: 2022, total: 24.0, orchestration: 1.2 },
    { year: 2023, total: 27.5, orchestration: 1.6 },
    { year: 2024, total: 30.2, orchestration: 2.0 },
    { year: 2025, total: 32.9, orchestration: 2.5 },
    { year: 2026, total: 38.5, orchestration: 3.5 },
    { year: 2027, total: 45.0, orchestration: 4.8 },
    { year: 2028, total: 52.5, orchestration: 6.5 },
    { year: 2029, total: 61.0, orchestration: 8.5 },
    { year: 2030, total: 70.0, orchestration: 10.5 }
  ],
  // EV Market Context (from Fleet Electrification Intel)
  evMarketContext: {
    usEuHdTruckSales2024: 608000,  // US (~280K) + EU (~328K) annual HD truck sales
    evSales2024: 11700,            // IEA actuals
    evShare2024: 1.9,              // %
    evSales2030: 121000,           // IEA STEPS projection
    evShare2030: 19,               // %
    source: "IEA Global EV Outlook 2025, ACEA Vehicles in Use Report"
  }
};

// ── CANONICAL DATA OVERLAY ──────────────────────────────────────────────────
// Merge canonical values from shared.json over inline MARKET_SIZE_DATA.
// Inline data above serves as fallback.
(function applyCanonical() {
  var C = window.__GREENBAY_CANONICAL__;
  if (!C) return;
  if (C.market_sizing) {
    var ms = C.market_sizing;
    if (ms.tam) {
      MARKET_SIZE_DATA.tam.current = ms.tam.current_usd_b || MARKET_SIZE_DATA.tam.current;
      MARKET_SIZE_DATA.tam.projected = ms.tam.projected_usd_b || MARKET_SIZE_DATA.tam.projected;
      MARKET_SIZE_DATA.tam.cagr = ms.tam.cagr_pct || MARKET_SIZE_DATA.tam.cagr;
    }
    if (ms.sam) {
      MARKET_SIZE_DATA.sam.current = ms.sam.current_usd_b || MARKET_SIZE_DATA.sam.current;
      MARKET_SIZE_DATA.sam.projected = ms.sam.projected_usd_b || MARKET_SIZE_DATA.sam.projected;
      MARKET_SIZE_DATA.sam.share = ms.sam.share_of_tam_pct || MARKET_SIZE_DATA.sam.share;
    }
    if (ms.som) {
      MARKET_SIZE_DATA.som.projected = ms.som.base_usd_m || MARKET_SIZE_DATA.som.projected;
      MARKET_SIZE_DATA.som.projectedLow = ms.som.conservative_usd_m || MARKET_SIZE_DATA.som.projectedLow;
      MARKET_SIZE_DATA.som.projectedHigh = ms.som.aggressive_usd_m || MARKET_SIZE_DATA.som.projectedHigh;
    }
  }
  if (C.unit_economics) {
    var ue = C.unit_economics;
    MARKET_SIZE_DATA.unitEconomics.acv = ue.acv_usd || MARKET_SIZE_DATA.unitEconomics.acv;
    MARKET_SIZE_DATA.unitEconomics.grossMargin = (ue.gross_margin_pct || 72) / 100;
    MARKET_SIZE_DATA.unitEconomics.cac = ue.cac_usd || MARKET_SIZE_DATA.unitEconomics.cac;
    MARKET_SIZE_DATA.unitEconomics.customerLifetime = ue.customer_lifetime_years || MARKET_SIZE_DATA.unitEconomics.customerLifetime;
    MARKET_SIZE_DATA.unitEconomics.annualChurn = (ue.annual_churn_pct || 5) / 100;
    MARKET_SIZE_DATA.unitEconomics.nrr = (ue.nrr_pct || 115) / 100;
  }
  if (C.fleet_stats && C.fleet_stats.ev_market_context) {
    var ev = C.fleet_stats.ev_market_context;
    MARKET_SIZE_DATA.evMarketContext.evSales2024 = ev.ev_sales_2024_us_eu || MARKET_SIZE_DATA.evMarketContext.evSales2024;
    MARKET_SIZE_DATA.evMarketContext.evShare2024 = ev.ev_share_2024_pct || MARKET_SIZE_DATA.evMarketContext.evShare2024;
  }
  console.log('Canonical data applied (v' + (C._canonical_version || '?') + ')');
})();

// ============ FLEET TECH STACK ============
var TECH_STACK_LAYERS = [
  {
    layer: "Strategy & Planning",
    level: 4,
    description: "Business objectives, network design, fleet sizing",
    solutions: ["TMS", "Network Optimization", "Capacity Planning", "CapEx Planning"],
    players: ["Oracle", "SAP", "Blue Yonder", "Manhattan Associates"],
    color: COLORS.purple
  },
  {
    layer: "Orchestration",
    level: 3,
    description: "Context layer connecting plans to operations",
    solutions: ["Plan Synchronization", "Cross-system Integration", "Real-time Adjustments", "Constraint Management"],
    players: ["Greenbay", "Emerging players"],
    color: COLORS.primary,
    isGreenbay: true
  },
  {
    layer: "Execution & Operations",
    level: 2,
    description: "Day-to-day fleet operations and monitoring",
    solutions: ["Route Execution", "Driver Management", "Telematics", "Dispatch"],
    players: ["Samsara", "Geotab", "Verizon Connect", "Motive"],
    color: COLORS.info
  },
  {
    layer: "Assets & Infrastructure",
    level: 1,
    description: "Physical fleet assets and supporting infrastructure",
    solutions: ["Vehicles", "Depots", "Chargers", "Maintenance Facilities"],
    players: ["OEMs", "ChargePoint", "ABB", "Siemens"],
    color: COLORS.accent
  }
];

var ORCHESTRATION_VALUE_PROPS = [
  {
    problem: "Plan-to-Execution Gap",
    description: "Strategic plans don't translate to daily operations",
    impact: "15-25% efficiency loss",
    solution: "Real-time plan synchronization across all systems"
  },
  {
    problem: "Siloed Systems",
    description: "TMS, telematics, charging, maintenance don't communicate",
    impact: "$50K-200K annual integration costs",
    solution: "Unified context layer with bi-directional sync"
  },
  {
    problem: "Reactive Operations",
    description: "Issues discovered after they become problems",
    impact: "30% of fleet downtime preventable",
    solution: "Proactive constraint management and alerts"
  },
  {
    problem: "EV Complexity",
    description: "Charging, range, grid constraints add new variables",
    impact: "2-3x operational complexity vs ICE",
    solution: "Energy-aware orchestration with depot optimization"
  }
];

// ============ COMPETITIVE LANDSCAPE ============
// Sources: SEC filings, Crunchbase, PitchBook, company announcements, vendor websites
var COMPETITORS = [
  // Point Solutions - Telematics
  {
    name: "Samsara",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2015,
    funding: "Public (NYSE: IOT)",
    valuation: 15000,  // ~$15B market cap (varies)
    revenue: 1249,     // FY2025 (ended Feb 2025) - SEC filing
    revenueSource: "SEC 10-K FY2025",
    customers: 20000,  // Company reported
    focus: ["Telematics", "Video Safety", "Equipment Monitoring"],
    strengths: ["Easy deployment", "Strong brand", "Video AI"],
    weaknesses: ["Limited orchestration", "Execution-focused"],
    positioning: { x: 75, y: 30 },  // x: enterprise focus, y: orchestration depth
    // Pricing data - Sources: tech.co, oiengine.com, multiple industry reviews
    pricing: {
      perVehicleMonth: "$27-33",
      hardwareCost: "$99-148 (device) or $350-500 with installation",
      contractLength: "3 years (required)",
      paymentTerms: "Prepaid upfront for SMB",
      source: "Industry reviews (tech.co, oiengine.com, 2025)"
    },
    pricingStrategy: {
      model: "Quote-based, tiered by features",
      approach: "No public pricing. 3-year contract minimum. Hardware bundled or separate. Volume discounts for larger fleets.",
      notes: "30-day free trial available",
      source: "Samsara website, industry reviews"
    },
    fleetTypes: {
      industries: ["Transportation & Logistics", "Construction", "Food & Beverage", "Field Services", "Manufacturing", "Passenger Transit", "Utilities", "Oil & Gas", "Public Sector"],
      fleetSizes: "SMB to Enterprise (10,000+ customers)",
      vehicleTypes: ["Light-duty", "Heavy-duty trucks", "Trailers", "Heavy equipment"],
      notableCustomers: ["Alaska Airlines", "Sobeys", "Swissport"],
      source: "Samsara website, company reports"
    }
  },
  {
    name: "Geotab",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2000,
    funding: "Private (bootstrapped)",
    valuation: 1000,   // Unicorn status confirmed, exact figure undisclosed
    revenue: 680,      // ~$680M USD (2024 estimate, company reports CAD)
    revenueSource: "Company reports, The Logic",
    customers: 100000, // Company reported
    devices: 4600000,  // 4.6M connected devices
    focus: ["Telematics", "Fleet Analytics", "EV Solutions"],
    strengths: ["Open platform", "Data depth", "Global reach", "No outside investors"],
    weaknesses: ["Complex for SMB", "Integration heavy"],
    positioning: { x: 60, y: 35 },
    // Pricing data - Sources: tech.co, Geotab blogs, industry reviews
    pricing: {
      perVehicleMonth: "$30-40 (with hardware bundle)",
      hardwareCost: "$80-120 (buy-to-own)",
      contractLength: "Varies by reseller",
      paymentTerms: "Set by authorized resellers",
      source: "tech.co, Geotab support docs, 2025"
    },
    pricingStrategy: {
      model: "Tiered rate plans via reseller network",
      approach: "Sold through authorized resellers (prices vary). Four tiers: Base, Regulatory, Pro, ProPlus with increasing features.",
      notes: "Pricing not standardized - depends on reseller and fleet needs",
      source: "Geotab rate plan documentation"
    },
    fleetTypes: {
      industries: ["Construction", "Courier & Delivery", "Utilities", "Oil, Gas & Mining", "Food & Beverage", "Waste & Recycling", "Logistics", "Public Transport", "Government"],
      fleetSizes: "SMB to Enterprise (up to 300K vehicles)",
      vehicleTypes: ["Light-duty", "Heavy-duty", "EVs", "Mixed fleets"],
      notableCustomers: ["U.S. Air Force (21K vehicles)", "U.S. DHS"],
      source: "Geotab website, Wikipedia, government contract announcements"
    }
  },
  {
    name: "Motive",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2013,
    funding: "Private ($777M raised)",
    valuation: 2850,   // Series F 2022 - confirmed
    revenue: 230,      // ~$230M ARR (Oct 2024 estimate)
    revenueSource: "GetLatka, industry estimates",
    customers: 100000, // Company reported "nearly 100,000"
    focus: ["ELD Compliance", "Safety", "Spend Management"],
    strengths: ["SMB focus", "Compliance expertise", "Easy UX"],
    weaknesses: ["Less enterprise", "Narrow scope"],
    positioning: { x: 35, y: 25 },
    // Pricing data - Sources: tech.co, SelectHub, industry reviews
    pricing: {
      perVehicleMonth: "$35-65+ (depending on features)",
      hardwareCost: "Included or leased",
      contractLength: "1-3 years typical",
      paymentTerms: "Not publicly disclosed",
      source: "tech.co, SelectHub, industry estimates 2025"
    },
    pricingStrategy: {
      model: "Quote-based (no public pricing)",
      approach: "Single plan fits all approach (post-2022 rebrand). Previously had tiered: Free, Starter ($20), Pro ($35), Enterprise.",
      notes: "Free trial and demo available. Hardware pricing not disclosed.",
      source: "Motive website, tech.co review"
    },
    fleetTypes: {
      industries: ["Trucking & Logistics", "Construction", "Oil & Gas", "Food & Beverage", "Field Service", "Agriculture", "Passenger Transit", "Delivery", "Utilities & Telecom", "Waste & Recycling", "Public Sector"],
      fleetSizes: "SMB to Fortune 500",
      vehicleTypes: ["Trucks", "Commercial vehicles", "Equipment"],
      notableCustomers: ["Halliburton", "KONE", "Komatsu", "NBC Universal", "Maersk"],
      source: "Motive website, CB Insights"
    }
  },
  {
    name: "Verizon Connect",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2018,
    funding: "Verizon subsidiary",
    valuation: null,   // Part of Verizon
    revenue: null,     // Not separately disclosed
    revenueSource: "Not publicly disclosed",
    customers: null,   // Not disclosed
    focus: ["Telematics", "Workforce Management", "Compliance"],
    strengths: ["Carrier backing", "Network coverage", "Scale"],
    weaknesses: ["Legacy tech debt", "Slow innovation"],
    positioning: { x: 70, y: 20 },
    // Pricing data - Sources: business.com, tech.co, ExpertMarket
    pricing: {
      perVehicleMonth: "$23.50-30",
      hardwareCost: "Bundled (no extra cost), self-install option",
      contractLength: "3 years (required with hardware)",
      paymentTerms: "Upfront payment, no refunds after 30 days",
      source: "business.com, tech.co, ExpertMarket 2025"
    },
    pricingStrategy: {
      model: "Quote-based with bundled hardware",
      approach: "3-year contract minimum. Hardware included. Cannot remove trucks from contract. Add-ons: AI dashcams, field service, asset tracking.",
      notes: "GSA, Sourcewell, NASPO approved vendor for government",
      source: "Verizon Connect website, industry reviews"
    },
    fleetTypes: {
      industries: ["Construction (13%)", "Transportation/Trucking (7%)", "IT Services (7%)", "Oil & Energy (6%)", "Food & Beverage", "Retail", "Government/Public Sector", "Field Services", "HVAC/Plumbing"],
      fleetSizes: "25% small (<50), 45% mid-size, 29% enterprise (>1000)",
      vehicleTypes: ["Commercial vehicles", "Service vehicles", "Delivery fleets"],
      notableCustomers: ["Largest state/municipal government customer base"],
      source: "Enlyft market analysis, Verizon Connect website"
    }
  },
  // Platform Players
  {
    name: "Trimble",
    category: "Fleet Platform",
    type: "platform",
    founded: 1978,
    funding: "Public (NASDAQ: TRMB)",
    valuation: 14000,  // ~$14B market cap (varies)
    revenue: 3683,     // FY2024 total company - SEC filing
    transportationRevenue: 789, // T&L segment FY2024
    revenueSource: "SEC 10-K FY2024",
    customers: null,
    focus: ["TMS", "Routing", "Mobility", "Visibility", "Transporeon"],
    strengths: ["Full suite", "Enterprise relationships", "Breadth"],
    weaknesses: ["Complex", "Slower to adapt", "Divesting telematics"],
    positioning: { x: 85, y: 50 },
    // Pricing data - Limited public information
    pricing: {
      perVehicleMonth: "Not publicly disclosed",
      hardwareCost: "Subscription bundles available (no upfront CapEx option)",
      contractLength: "Custom enterprise agreements",
      paymentTerms: "Not disclosed",
      source: "Trimble website - quote required"
    },
    pricingStrategy: {
      model: "Enterprise quote-based",
      approach: "Higher-end pricing targeting large enterprises. Flexible bundles for hardware + software. Focus on complex transportation needs.",
      notes: "Personalized pricing breakdowns, not generic estimates",
      source: "Trimble website, industry reviews"
    },
    fleetTypes: {
      industries: ["Trucking", "Logistics", "3PL/Brokers", "Shippers"],
      fleetSizes: "Enterprise (large carriers, shippers, 3PLs)",
      vehicleTypes: ["OTR trucks", "Regional fleets", "Multi-modal"],
      notableCustomers: ["Evans Distribution Systems", "MODE Global/Transporeon"],
      source: "Trimble website, case studies"
    }
  },
  {
    name: "Omnitracs",
    category: "Fleet Platform",
    type: "platform",
    founded: 1988,
    funding: "Solera Holdings (acquired 2021)",
    valuation: null,   // Part of Solera
    revenue: 400,      // Estimated $400-500M (2019 FreightWaves)
    revenueSource: "Industry estimates (not current)",
    customers: 30000,  // Company website
    focus: ["TMS", "Telematics", "Compliance", "Analytics"],
    strengths: ["Trucking heritage", "Compliance depth"],
    weaknesses: ["Aging platform", "PE ownership challenges"],
    positioning: { x: 80, y: 45 },
    // Pricing data - Not publicly available
    pricing: {
      perVehicleMonth: "Not publicly disclosed",
      hardwareCost: "Not publicly disclosed",
      contractLength: "Not publicly disclosed",
      paymentTerms: "Not publicly disclosed",
      source: "No public pricing information available"
    },
    pricingStrategy: {
      model: "Enterprise quote-based",
      approach: "Traditional enterprise sales model. No public pricing. Focus on large trucking fleets.",
      notes: "Now part of Solera Holdings (PE-backed)",
      source: "Industry knowledge"
    },
    fleetTypes: {
      industries: ["Trucking", "Transportation", "Logistics"],
      fleetSizes: "Mid-market to Enterprise",
      vehicleTypes: ["OTR trucks", "Commercial fleets"],
      notableCustomers: null,
      source: "Omnitracs website"
    }
  },
  {
    name: "Platform Science",
    category: "Fleet Platform",
    type: "platform",
    founded: 2015,
    funding: "Private ($322M raised)",
    valuation: null,   // Not disclosed
    revenue: null,     // Not disclosed
    revenueSource: "Not publicly disclosed",
    customers: null,
    focus: ["Open Platform", "App Marketplace", "Telematics", "OEM Partnerships"],
    strengths: ["Modern architecture", "OEM relationships (DTNA, Paccar)", "Acquiring Trimble telematics"],
    weaknesses: ["Revenue not proven", "Integration complexity"],
    positioning: { x: 55, y: 55 },
    // Pricing data - Not publicly available (B2B/OEM focus)
    pricing: {
      perVehicleMonth: "Not publicly disclosed",
      hardwareCost: "Not publicly disclosed",
      contractLength: "Not publicly disclosed",
      paymentTerms: "Not publicly disclosed",
      source: "No public pricing - OEM partnership model"
    },
    pricingStrategy: {
      model: "OEM partnership + marketplace",
      approach: "Platform embedded in OEM vehicles (DTNA, Paccar). Revenue through OEM partnerships and app marketplace.",
      notes: "Acquired Trimble telematics units in 2025",
      source: "Company announcements, Crunchbase"
    },
    fleetTypes: {
      industries: ["Trucking", "Logistics", "Transportation"],
      fleetSizes: "Enterprise (via OEM partnerships)",
      vehicleTypes: ["Class 8 trucks (DTNA, Paccar OEM integration)"],
      notableCustomers: ["Daimler Truck North America", "Paccar"],
      source: "Platform Science website, press releases"
    }
  },
  // Emerging Orchestration
  {
    name: "Greenbay",
    category: "Fleet Orchestration",
    type: "orchestration",
    founded: 2025,
    funding: "Private",
    valuation: null,
    revenue: null,
    customers: null,
    focus: ["Fleet Orchestration", "E-Bus/Transit", "Charging Management", "Yard Management", "Predictive Maintenance"],
    strengths: ["Purpose-built for orchestration", "EV-native", "AI-powered optimization", "Transit expertise"],
    weaknesses: ["Early stage", "Building market category"],
    positioning: { x: 65, y: 85 },
    isGreenbay: true,
    pricing: {
      perVehicleMonth: "Not publicly disclosed",
      hardwareCost: "Software-only (no hardware)",
      contractLength: "Not disclosed",
      paymentTerms: "Not disclosed",
      source: "Early-stage, pricing not public"
    },
    pricingStrategy: {
      model: "Not disclosed",
      approach: "Early-stage company, pricing model in development",
      notes: null,
      source: "N/A"
    },
    fleetTypes: {
      industries: ["Public Transit", "E-Bus Fleets", "Mixed Fleet Operators"],
      fleetSizes: "Target: Transit agencies, mid-market to enterprise",
      vehicleTypes: ["Electric buses", "Mixed ICE/EV transit fleets"],
      notableCustomers: null,
      source: "greenbay.solutions"
    }
  }
];

// Market share is ESTIMATED based on available revenue data
// Many companies don't disclose fleet-specific revenue
var MARKET_SHARE_DATA = [
  { name: "Samsara", share: 14, revenue: 1249, verified: true },
  { name: "Trimble T&L", share: 9, revenue: 789, verified: true },
  { name: "Geotab", share: 8, revenue: 680, verified: false },
  { name: "Omnitracs", share: 5, revenue: 400, verified: false },
  { name: "Motive", share: 3, revenue: 230, verified: false },
  { name: "Others", share: 61, revenue: 5500, verified: false }
];

// ============ MARKET DYNAMICS ============
var MARKET_DRIVERS = [
  {
    driver: "EV Fleet Transition",
    impact: "High",
    description: "Electric fleets require orchestration of charging, range, and grid constraints",
    metrics: "500K+ commercial EVs in US by 2030",
    trend: "accelerating"
  },
  {
    driver: "Regulatory Pressure",
    impact: "High",
    description: "EPA, CARB, EU regulations mandate emissions tracking and reporting",
    metrics: "100% ZEV sales required in CA by 2035",
    trend: "accelerating"
  },
  {
    driver: "Cost Optimization",
    impact: "High",
    description: "Fuel/energy represents 30-40% of fleet costs, pressure to optimize",
    metrics: "5-15% cost savings from optimization",
    trend: "stable"
  },
  {
    driver: "Driver Shortage",
    impact: "Medium",
    description: "80K driver shortage in US trucking, need to maximize utilization",
    metrics: "8% annual driver turnover",
    trend: "stable"
  },
  {
    driver: "ESG Requirements",
    impact: "Medium",
    description: "Scope 3 emissions reporting driving fleet visibility needs",
    metrics: "70% of Fortune 500 with net-zero commitments",
    trend: "accelerating"
  },
  {
    driver: "Technology Convergence",
    impact: "Medium",
    description: "IoT, AI, cloud enabling new integration possibilities",
    metrics: "90% of new fleets cloud-connected",
    trend: "accelerating"
  }
];

var ADOPTION_BARRIERS = [
  { barrier: "Integration Complexity", severity: 85, description: "Legacy systems, multiple vendors, data silos" },
  { barrier: "Change Management", severity: 70, description: "Driver/operator resistance, training needs" },
  { barrier: "ROI Uncertainty", severity: 65, description: "Difficulty proving orchestration value upfront" },
  { barrier: "Vendor Lock-in Concerns", severity: 60, description: "Fear of dependency on single platform" },
  { barrier: "Budget Constraints", severity: 55, description: "Competing priorities, capital allocation" },
  { barrier: "Technical Expertise", severity: 50, description: "Lack of internal capability to manage" }
];

var BUYER_PERSONAS = [
  {
    role: "VP of Fleet Operations",
    priority: 1,
    concerns: ["Uptime", "Driver productivity", "Compliance"],
    metrics: ["Fleet utilization", "Cost per mile", "On-time delivery"],
    influence: "Primary decision maker"
  },
  {
    role: "Chief Sustainability Officer",
    priority: 2,
    concerns: ["Emissions tracking", "EV transition", "Reporting"],
    metrics: ["CO2 reduction", "ZEV %", "Scope 3 data"],
    influence: "Growing influence, budget holder for ESG"
  },
  {
    role: "CFO / Finance",
    priority: 3,
    concerns: ["TCO", "CapEx planning", "ROI"],
    metrics: ["Cost savings", "Payback period", "Budget variance"],
    influence: "Final approval, ROI focus"
  },
  {
    role: "IT / Digital",
    priority: 4,
    concerns: ["Integration", "Security", "Maintenance"],
    metrics: ["System uptime", "Integration time", "Support tickets"],
    influence: "Technical veto power"
  }
];

// ============ TRENDS & OUTLOOK ============
var TECHNOLOGY_TRENDS = [
  {
    trend: "AI/ML in Fleet Operations",
    maturity: "Growth",
    impact: "High",
    timeline: "Now",
    description: "Predictive maintenance, route optimization, demand forecasting"
  },
  {
    trend: "EV Fleet Management",
    maturity: "Early Growth",
    impact: "High",
    timeline: "Now",
    description: "Charging orchestration, range optimization, energy management"
  },
  {
    trend: "API-First Platforms",
    maturity: "Growth",
    impact: "Medium",
    timeline: "Now",
    description: "Open ecosystems, composable solutions, easy integration"
  },
  {
    trend: "Real-Time Visibility",
    maturity: "Mature",
    impact: "Medium",
    timeline: "Now",
    description: "Live tracking, ETAs, exception management"
  },
  {
    trend: "Autonomous Vehicle Integration",
    maturity: "Emerging",
    impact: "High",
    timeline: "2027+",
    description: "Mixed fleet orchestration, AV-ready platforms"
  },
  {
    trend: "Energy Grid Integration",
    maturity: "Emerging",
    impact: "Medium",
    timeline: "2025+",
    description: "V2G, demand response, smart charging"
  }
];

// EV Fleet adoption - based on Cox Automotive, IEA projections
// evFleets = number of commercial fleets with EVs (US)
// Current: 14% of fleets operate EVs, projected 4M+ EVs in fleets by 2030
var EV_FLEET_GROWTH = [
  { year: 2022, evFleets: 8000, orchestrationNeed: 15 },
  { year: 2023, evFleets: 12000, orchestrationNeed: 25 },
  { year: 2024, evFleets: 18000, orchestrationNeed: 38 },   // 14% of fleets have EVs
  { year: 2025, evFleets: 28000, orchestrationNeed: 52 },
  { year: 2026, evFleets: 42000, orchestrationNeed: 65 },
  { year: 2027, evFleets: 60000, orchestrationNeed: 76 },
  { year: 2028, evFleets: 85000, orchestrationNeed: 84 },
  { year: 2029, evFleets: 115000, orchestrationNeed: 90 },
  { year: 2030, evFleets: 150000, orchestrationNeed: 95 }   // 87% plan EVs in 5 years
];

var MA_ACTIVITY = [
  { year: 2021, deals: 45, totalValue: 4200, avgDeal: 93 },
  { year: 2022, deals: 52, totalValue: 5800, avgDeal: 112 },
  { year: 2023, deals: 38, totalValue: 3200, avgDeal: 84 },
  { year: 2024, deals: 42, totalValue: 4500, avgDeal: 107 },
  { year: 2025, deals: 55, totalValue: 6200, avgDeal: 113 }
];

// Verified M&A transactions
var KEY_ACQUISITIONS = [
  { year: 2025, acquirer: "Platform Science", target: "Trimble Telematics Units", value: 300, rationale: "Telematics expansion (~$300M revenue acquired)", verified: true },
  { year: 2023, acquirer: "Trimble", target: "Transporeon", value: 2000, rationale: "European visibility platform (€1.88B)", verified: true },
  { year: 2024, acquirer: "Platform Science", target: "Series C", value: 125, rationale: "Growth funding with OEM partners", verified: true },
  { year: 2022, acquirer: "Motive", target: "Series F", value: 150, rationale: "Growth at $2.85B valuation", verified: true },
  { year: 2021, acquirer: "Solera", target: "Omnitracs", value: 800, rationale: "PE consolidation play", verified: true }
];

// ============ SOURCES ============
var DASHBOARD_SOURCES = [
  {
    category: "Market Research",
    sources: [
      { name: "MarketsandMarkets", description: "Fleet Management Market Report 2024", url: "https://www.marketsandmarkets.com/" },
      { name: "Grand View Research", description: "Fleet Management Software Analysis", url: "https://www.grandviewresearch.com/" },
      { name: "Gartner", description: "Transportation Management Systems Magic Quadrant", url: "https://www.gartner.com/" },
      { name: "IDC", description: "Commercial Vehicle Telematics Forecast", url: "https://www.idc.com/" }
    ]
  },
  {
    category: "Industry Data",
    sources: [
      { name: "American Trucking Associations", description: "Trucking industry statistics", url: "https://www.trucking.org/" },
      { name: "IEA", description: "Global EV Outlook - commercial vehicles", url: "https://www.iea.org/" },
      { name: "ACT Research", description: "Commercial vehicle market data", url: "https://www.actresearch.net/" },
      { name: "Frost & Sullivan", description: "Fleet technology analysis", url: "https://www.frost.com/" }
    ]
  },
  {
    category: "Company Data",
    sources: [
      { name: "SEC Filings", description: "Public company financials (Samsara, Trimble)", url: "https://www.sec.gov/" },
      { name: "Crunchbase", description: "Startup funding data", url: "https://www.crunchbase.com/" },
      { name: "PitchBook", description: "Private company valuations", url: "https://pitchbook.com/" },
      { name: "Greenbay Solutions", description: "Company website", url: "https://www.greenbay.solutions" }
    ]
  },
  {
    category: "Pricing & Reviews",
    sources: [
      { name: "tech.co", description: "Fleet management reviews and pricing comparisons (2025)", url: "https://tech.co/fleet-management" },
      { name: "business.com", description: "Vendor pricing analysis", url: "https://www.business.com/" },
      { name: "SelectHub", description: "Software pricing and feature comparisons", url: "https://www.selecthub.com/" },
      { name: "Capterra", description: "User reviews and pricing data", url: "https://www.capterra.com/" },
      { name: "oiengine.com", description: "Fleet tracking reviews", url: "https://oiengine.com/" }
    ]
  }
];

// ============ UTILITY FUNCTIONS ============
function formatCurrency(value) {
  if (value >= 1000000000) return "$" + (value / 1000000000).toFixed(1) + "B";
  if (value >= 1000000) return "$" + (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return "$" + (value / 1000).toFixed(0) + "K";
  return "$" + value;
}

function formatNumber(value) {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toString();
}

// ============ SHARED STYLES ============
var styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: COLORS.background,
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    color: COLORS.text
  },
  header: {
    background: "linear-gradient(135deg, " + COLORS.background + " 0%, " + COLORS.card + " 100%)",
    borderBottom: "1px solid " + COLORS.border,
    padding: "24px 32px"
  },
  headerTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "28px",
    color: COLORS.text,
    marginBottom: "4px"
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: "14px"
  },
  nav: {
    display: "flex",
    gap: "8px",
    padding: "16px 32px",
    borderBottom: "1px solid " + COLORS.border,
    backgroundColor: COLORS.card,
    overflowX: "auto",
    flexWrap: "wrap"
  },
  navButton: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "1px solid " + COLORS.border,
    background: "transparent",
    color: COLORS.textMuted,
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap"
  },
  navButtonActive: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "1px solid " + COLORS.primary,
    background: COLORS.primary + "15",
    color: COLORS.primary,
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  main: {
    padding: "32px",
    maxWidth: "1600px",
    margin: "0 auto"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "24px"
  },
  gridWide: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px"
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: "12px",
    border: "1px solid " + COLORS.border,
    padding: "24px",
    transition: "border-color 0.2s ease"
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid " + COLORS.border
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px"
  },
  th: {
    padding: "12px 8px",
    textAlign: "left",
    borderBottom: "2px solid " + COLORS.border,
    color: COLORS.textMuted,
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  td: {
    padding: "12px 8px",
    borderBottom: "1px solid " + COLORS.border,
    color: COLORS.text
  },
  footer: {
    borderTop: "1px solid " + COLORS.border,
    padding: "20px 32px",
    textAlign: "center",
    color: COLORS.textDim,
    fontSize: "12px",
    backgroundColor: COLORS.card
  }
};

// ============ REUSABLE COMPONENTS ============
function Card(props) {
  return createElement("div", { style: Object.assign({}, styles.card, props.style) }, props.children);
}

function MetricCard(props) {
  return createElement("div", {
    style: {
      backgroundColor: COLORS.card,
      borderRadius: "12px",
      padding: "20px",
      border: "1px solid " + COLORS.border,
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }
  },
    createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
      props.icon ? createElement("span", { style: { fontSize: "20px" } }, props.icon) : null,
      createElement("span", { style: { fontSize: "13px", color: COLORS.textMuted } }, props.title)
    ),
    createElement("div", { style: { fontSize: "28px", fontWeight: "700", color: props.color || COLORS.text } }, props.value),
    props.label ? createElement("div", { style: { fontSize: "12px", color: COLORS.textDim } }, props.label) : null,
    props.trend ? createElement("div", { style: { fontSize: "12px", color: COLORS.success, marginTop: "4px" } }, props.trend) : null
  );
}

function Badge(props) {
  var colors = {
    success: { bg: COLORS.success + "20", text: COLORS.success },
    warning: { bg: COLORS.accent + "20", text: COLORS.accent },
    danger: { bg: COLORS.danger + "20", text: COLORS.danger },
    info: { bg: COLORS.info + "20", text: COLORS.info },
    primary: { bg: COLORS.primary + "20", text: COLORS.primary },
    purple: { bg: COLORS.purple + "20", text: COLORS.purple }
  };
  var scheme = colors[props.variant] || colors.info;
  return createElement("span", {
    style: {
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: "600",
      backgroundColor: scheme.bg,
      color: scheme.text
    }
  }, props.children);
}

function SourceLink(props) {
  return createElement("a", {
    href: props.url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      fontSize: "12px",
      color: COLORS.info,
      textDecoration: "none",
      padding: "4px 8px",
      backgroundColor: COLORS.info + "10",
      borderRadius: "4px",
      display: "inline-block"
    }
  }, props.name);
}

// ============ MARKET OVERVIEW TAB ============
function MarketOverviewTab() {
  return createElement("div", null,
    // TAM/SAM/SOM Overview
    createElement("div", { style: styles.sectionTitle }, "Greenbay Market Opportunity (TAM/SAM/SOM)"),
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "24px" } },
      // TAM
      createElement("div", { style: {
        backgroundColor: COLORS.card,
        borderRadius: "12px",
        padding: "24px",
        border: "2px solid " + COLORS.info,
        textAlign: "center"
      }},
        createElement("div", { style: { fontSize: "13px", color: COLORS.info, fontWeight: "600", marginBottom: "8px" } }, "TAM"),
        createElement("div", { style: { fontSize: "36px", fontWeight: "700", color: COLORS.text } }, "$" + MARKET_SIZE_DATA.tam.projected + "B"),
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "4px" } }, "by 2030"),
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "12px", padding: "8px", backgroundColor: COLORS.background, borderRadius: "6px" } },
          "Global Fleet Management Software Market"
        ),
        createElement("div", { style: { fontSize: "11px", color: COLORS.success, marginTop: "8px" } }, MARKET_SIZE_DATA.tam.cagr + "% CAGR")
      ),
      // SAM
      createElement("div", { style: {
        backgroundColor: COLORS.card,
        borderRadius: "12px",
        padding: "24px",
        border: "2px solid " + COLORS.primary,
        textAlign: "center"
      }},
        createElement("div", { style: { fontSize: "13px", color: COLORS.primary, fontWeight: "600", marginBottom: "8px" } }, "SAM"),
        createElement("div", { style: { fontSize: "36px", fontWeight: "700", color: COLORS.text } }, "$" + MARKET_SIZE_DATA.sam.projected + "B"),
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "4px" } }, "by 2030"),
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "12px", padding: "8px", backgroundColor: COLORS.background, borderRadius: "6px" } },
          MARKET_SIZE_DATA.sam.description
        ),
        createElement("div", { style: { fontSize: "11px", color: COLORS.textDim, marginTop: "8px" } }, MARKET_SIZE_DATA.sam.share + "% of TAM")
      ),
      // SOM
      createElement("div", { style: {
        backgroundColor: COLORS.primary + "15",
        borderRadius: "12px",
        padding: "24px",
        border: "2px solid " + COLORS.accent,
        textAlign: "center"
      }},
        createElement("div", { style: { fontSize: "13px", color: COLORS.accent, fontWeight: "600", marginBottom: "8px" } }, "SOM (Bottom-Up)"),
        createElement("div", { style: { fontSize: "36px", fontWeight: "700", color: COLORS.accent } }, "$" + MARKET_SIZE_DATA.som.projected + "M"),
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "4px" } }, "Base Case"),
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "12px", padding: "8px", backgroundColor: COLORS.background, borderRadius: "6px" } },
          "$" + MARKET_SIZE_DATA.som.projectedLow + "M - $" + MARKET_SIZE_DATA.som.projectedHigh + "M range"
        ),
        createElement("div", { style: { fontSize: "11px", color: COLORS.textDim, marginTop: "8px" } }, "Transit + Commercial E-Fleets")
      )
    ),

    // Bottom-Up Model Section
    createElement("div", { style: styles.sectionTitle }, "Bottom-Up SOM Model"),

    // Target Customer Segments
    createElement(Card, { style: { marginBottom: "20px" } },
      createElement("div", { style: styles.cardTitle }, "🎯 Target Customer Segments (US + Europe)"),
      createElement("table", { style: styles.table },
        createElement("thead", null,
          createElement("tr", null,
            createElement("th", { style: styles.th }, "Segment"),
            createElement("th", { style: styles.th }, "US"),
            createElement("th", { style: styles.th }, "Europe"),
            createElement("th", { style: styles.th }, "Total"),
            createElement("th", { style: styles.th }, "ACV"),
            createElement("th", { style: styles.th }, "Source")
          )
        ),
        createElement("tbody", null,
          MARKET_SIZE_DATA.bottomUpModel.segments.map(function(seg, i) {
            return createElement("tr", { key: i },
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600" }) },
                createElement("div", null, seg.name),
                createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, fontWeight: "400" } }, seg.description)
              ),
              createElement("td", { style: styles.td }, seg.usCount),
              createElement("td", { style: styles.td }, seg.euCount),
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600", color: COLORS.primary }) }, seg.total),
              createElement("td", { style: Object.assign({}, styles.td, { color: COLORS.success }) }, "$" + (seg.acv / 1000) + "K"),
              createElement("td", { style: Object.assign({}, styles.td, { fontSize: "11px", color: COLORS.textDim }) }, seg.source)
            );
          }),
          createElement("tr", { style: { backgroundColor: COLORS.primary + "10" } },
            createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "700" }) }, "Total Target Market"),
            createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600" }) }, "300"),
            createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600" }) }, "450"),
            createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "700", color: COLORS.primary, fontSize: "16px" }) }, "750"),
            createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600", color: COLORS.success }) }, "$300-400K"),
            createElement("td", { style: styles.td }, "")
          )
        )
      )
    ),

    // SOM Scenarios
    createElement(Card, { style: { marginBottom: "24px" } },
      createElement("div", { style: styles.cardTitle }, "📊 SOM Scenarios"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" } },
        MARKET_SIZE_DATA.bottomUpModel.scenarios.map(function(scenario, i) {
          var colors = [COLORS.textMuted, COLORS.primary, COLORS.success];
          var isBase = scenario.name === "Base Case";
          return createElement("div", { key: i, style: {
            padding: "20px",
            backgroundColor: isBase ? COLORS.primary + "15" : COLORS.background,
            borderRadius: "12px",
            border: isBase ? "2px solid " + COLORS.primary : "1px solid " + COLORS.border,
            textAlign: "center"
          }},
            createElement("div", { style: { fontSize: "14px", fontWeight: "600", color: colors[i], marginBottom: "8px" } }, scenario.name),
            createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: isBase ? COLORS.primary : COLORS.text } }, "$" + scenario.som + "M"),
            createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "8px" } }, scenario.description),
            createElement("div", { style: { marginTop: "12px", padding: "8px", backgroundColor: COLORS.card, borderRadius: "6px", fontSize: "11px", color: COLORS.textDim, textAlign: "left" } },
              createElement("div", null, "Customers: " + scenario.targetCustomers),
              createElement("div", null, "Win Rate: " + (scenario.winRate * 100) + "%"),
              createElement("div", null, "Avg ACV: $" + (scenario.avgAcv / 1000) + "K")
            ),
            createElement("div", { style: { fontSize: "10px", color: COLORS.textDim, marginTop: "8px", fontStyle: "italic" } }, scenario.assumptions)
          );
        })
      )
    ),

    // Formula & Sources
    createElement(Card, { style: { marginBottom: "24px", background: COLORS.info + "10", borderColor: COLORS.info + "40" } },
      createElement("div", { style: { fontSize: "13px", color: COLORS.textMuted, lineHeight: "1.7" } },
        createElement("div", { style: { marginBottom: "12px" } },
          createElement("strong", { style: { color: COLORS.text } }, "Formula: "),
          "SOM = Target Customers × Win Rate × Average ACV"
        ),
        createElement("div", { style: { marginBottom: "8px" } },
          createElement("strong", { style: { color: COLORS.text } }, "Base Case: "),
          "750 customers × 15% win rate × $375K ACV = ",
          createElement("span", { style: { color: COLORS.primary, fontWeight: "600" } }, "$42M")
        ),
        createElement("div", { style: { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid " + COLORS.border } },
          createElement("strong", { style: { color: COLORS.text } }, "Data Sources: ")
        ),
        MARKET_SIZE_DATA.bottomUpModel.sources.map(function(src, i) {
          return createElement("div", { key: i, style: { marginTop: "4px", fontSize: "11px" } }, "• " + src);
        })
      )
    ),

    // 5-Year ARR Projection
    createElement("div", { style: styles.sectionTitle }, "5-Year ARR Projection (2026-2030)"),

    // ARR Chart
    createElement(Card, { style: { marginBottom: "20px" } },
      createElement("div", { style: styles.cardTitle }, "📈 ARR Growth Scenarios"),
      createElement(ResponsiveContainer, { width: "100%", height: 350 },
        createElement(ComposedChart, {
          data: MARKET_SIZE_DATA.arrProjection.base.map(function(d, i) {
            return {
              year: d.year,
              conservative: MARKET_SIZE_DATA.arrProjection.conservative[i].arr,
              base: d.arr,
              aggressive: MARKET_SIZE_DATA.arrProjection.aggressive[i].arr,
              customers: d.customers
            };
          }),
          margin: { top: 20, right: 30, left: 20, bottom: 20 }
        },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.border }),
          createElement(XAxis, { dataKey: "year", stroke: COLORS.textMuted }),
          createElement(YAxis, { yAxisId: "left", stroke: COLORS.textMuted, tickFormatter: function(v) { return "$" + v + "M"; } }),
          createElement(YAxis, { yAxisId: "right", orientation: "right", stroke: COLORS.accent }),
          createElement(Tooltip, {
            contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" },
            formatter: function(value, name) {
              if (name === "customers") return [value, "Customers (Base)"];
              return ["$" + value + "M", name.charAt(0).toUpperCase() + name.slice(1)];
            }
          }),
          createElement(Legend, null),
          createElement(Area, { yAxisId: "left", type: "monotone", dataKey: "conservative", name: "Conservative", fill: COLORS.textMuted + "30", stroke: COLORS.textMuted, strokeWidth: 2, strokeDasharray: "5 5" }),
          createElement(Area, { yAxisId: "left", type: "monotone", dataKey: "base", name: "Base Case", fill: COLORS.primary + "40", stroke: COLORS.primary, strokeWidth: 3 }),
          createElement(Area, { yAxisId: "left", type: "monotone", dataKey: "aggressive", name: "Aggressive", fill: COLORS.success + "30", stroke: COLORS.success, strokeWidth: 2, strokeDasharray: "5 5" }),
          createElement(Line, { yAxisId: "right", type: "monotone", dataKey: "customers", name: "Customers (Base)", stroke: COLORS.accent, strokeWidth: 2, dot: { fill: COLORS.accent, r: 4 } })
        )
      )
    ),

    // ARR Table
    createElement(Card, { style: { marginBottom: "20px" } },
      createElement("div", { style: styles.cardTitle }, "📊 Base Case ARR Details"),
      createElement("table", { style: styles.table },
        createElement("thead", null,
          createElement("tr", null,
            createElement("th", { style: styles.th }, "Year"),
            createElement("th", { style: styles.th }, "ARR"),
            createElement("th", { style: styles.th }, "YoY Growth"),
            createElement("th", { style: styles.th }, "Customers"),
            createElement("th", { style: styles.th }, "New"),
            createElement("th", { style: styles.th }, "Churn"),
            createElement("th", { style: styles.th }, "Notes")
          )
        ),
        createElement("tbody", null,
          MARKET_SIZE_DATA.arrProjection.base.map(function(row, i) {
            return createElement("tr", { key: i, style: i === 4 ? { backgroundColor: COLORS.primary + "10" } : {} },
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600" }) }, row.year),
              createElement("td", { style: Object.assign({}, styles.td, { color: COLORS.primary, fontWeight: "700", fontSize: "16px" }) }, "$" + row.arr + "M"),
              createElement("td", { style: Object.assign({}, styles.td, { color: row.growth ? COLORS.success : COLORS.textDim }) }, row.growth ? row.growth + "%" : "—"),
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600" }) }, row.customers),
              createElement("td", { style: Object.assign({}, styles.td, { color: COLORS.success }) }, "+" + row.newCustomers),
              createElement("td", { style: Object.assign({}, styles.td, { color: row.churn > 0 ? COLORS.danger : COLORS.textDim }) }, row.churn > 0 ? "-" + row.churn : "—"),
              createElement("td", { style: Object.assign({}, styles.td, { fontSize: "12px", color: COLORS.textMuted }) }, row.note)
            );
          })
        )
      )
    ),

    // ARR Scenario Comparison
    createElement(Card, { style: { marginBottom: "20px" } },
      createElement("div", { style: styles.cardTitle }, "🎯 2030 ARR by Scenario"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" } },
        [
          { name: "Conservative", data: MARKET_SIZE_DATA.arrProjection.conservative, color: COLORS.textMuted },
          { name: "Base Case", data: MARKET_SIZE_DATA.arrProjection.base, color: COLORS.primary },
          { name: "Aggressive", data: MARKET_SIZE_DATA.arrProjection.aggressive, color: COLORS.success }
        ].map(function(scenario, i) {
          var finalYear = scenario.data[4];
          var isBase = scenario.name === "Base Case";
          return createElement("div", { key: i, style: {
            padding: "20px",
            backgroundColor: isBase ? COLORS.primary + "15" : COLORS.background,
            borderRadius: "12px",
            border: isBase ? "2px solid " + COLORS.primary : "1px solid " + COLORS.border,
            textAlign: "center"
          }},
            createElement("div", { style: { fontSize: "14px", fontWeight: "600", color: scenario.color, marginBottom: "8px" } }, scenario.name),
            createElement("div", { style: { fontSize: "36px", fontWeight: "700", color: isBase ? COLORS.primary : COLORS.text } }, "$" + finalYear.arr + "M"),
            createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "4px" } }, "ARR by 2030"),
            createElement("div", { style: { marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" } },
              createElement("div", { style: { padding: "8px", backgroundColor: COLORS.card, borderRadius: "6px" } },
                createElement("div", { style: { color: COLORS.textDim, fontSize: "10px" } }, "Customers"),
                createElement("div", { style: { fontWeight: "600", color: COLORS.text } }, finalYear.customers)
              ),
              createElement("div", { style: { padding: "8px", backgroundColor: COLORS.card, borderRadius: "6px" } },
                createElement("div", { style: { color: COLORS.textDim, fontSize: "10px" } }, "5Y CAGR"),
                createElement("div", { style: { fontWeight: "600", color: COLORS.success } },
                  Math.round(Math.pow(finalYear.arr / scenario.data[0].arr, 1/4) * 100 - 100) + "%"
                )
              )
            )
          );
        })
      )
    ),

    // ARR Assumptions
    createElement(Card, { style: { marginBottom: "24px", background: COLORS.accent + "10", borderColor: COLORS.accent + "40" } },
      createElement("div", { style: styles.cardTitle }, "📋 ARR Projection Assumptions"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" } },
        Object.entries(MARKET_SIZE_DATA.arrProjection.assumptions).map(function(entry, i) {
          var key = entry[0];
          var value = entry[1];
          var labels = {
            avgAcv: "Average ACV",
            churnRate: "Churn Rate",
            salesCycle: "Sales Cycle",
            netRevenueRetention: "Net Revenue Retention",
            teamScaling: "Team Scaling"
          };
          return createElement("div", { key: i, style: { padding: "12px", backgroundColor: COLORS.card, borderRadius: "8px" } },
            createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" } }, labels[key] || key),
            createElement("div", { style: { fontSize: "13px", color: COLORS.text, fontWeight: "500" } }, value)
          );
        })
      )
    ),

    // Unit Economics Section
    createElement("div", { style: styles.sectionTitle }, "Unit Economics"),

    // Key Unit Economics Metrics
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" } },
      // LTV
      createElement("div", { style: {
        backgroundColor: COLORS.card,
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid " + COLORS.border,
        textAlign: "center"
      }},
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginBottom: "8px" } }, "Lifetime Value (LTV)"),
        createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: COLORS.success } },
          "$" + (MARKET_SIZE_DATA.unitEconomics.acv * MARKET_SIZE_DATA.unitEconomics.grossMargin * MARKET_SIZE_DATA.unitEconomics.customerLifetime / 1000000).toFixed(1) + "M"
        ),
        createElement("div", { style: { fontSize: "11px", color: COLORS.textDim, marginTop: "4px" } }, "ACV × Gross Margin × Lifetime")
      ),
      // CAC
      createElement("div", { style: {
        backgroundColor: COLORS.card,
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid " + COLORS.border,
        textAlign: "center"
      }},
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginBottom: "8px" } }, "Customer Acquisition Cost"),
        createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: COLORS.accent } },
          "$" + (MARKET_SIZE_DATA.unitEconomics.cac / 1000) + "K"
        ),
        createElement("div", { style: { fontSize: "11px", color: COLORS.textDim, marginTop: "4px" } }, "Enterprise sales motion")
      ),
      // LTV:CAC
      createElement("div", { style: {
        backgroundColor: COLORS.primary + "15",
        borderRadius: "12px",
        padding: "20px",
        border: "2px solid " + COLORS.primary,
        textAlign: "center"
      }},
        createElement("div", { style: { fontSize: "12px", color: COLORS.primary, marginBottom: "8px" } }, "LTV:CAC Ratio"),
        createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: COLORS.primary } },
          ((MARKET_SIZE_DATA.unitEconomics.acv * MARKET_SIZE_DATA.unitEconomics.grossMargin * MARKET_SIZE_DATA.unitEconomics.customerLifetime) / MARKET_SIZE_DATA.unitEconomics.cac).toFixed(1) + "x"
        ),
        createElement("div", { style: { fontSize: "11px", color: COLORS.textDim, marginTop: "4px" } }, "Target: >3x (SaaS benchmark)")
      ),
      // CAC Payback
      createElement("div", { style: {
        backgroundColor: COLORS.card,
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid " + COLORS.border,
        textAlign: "center"
      }},
        createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginBottom: "8px" } }, "CAC Payback"),
        createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: COLORS.info } },
          Math.round(MARKET_SIZE_DATA.unitEconomics.cac / (MARKET_SIZE_DATA.unitEconomics.acv * MARKET_SIZE_DATA.unitEconomics.grossMargin / 12)) + " mo"
        ),
        createElement("div", { style: { fontSize: "11px", color: COLORS.textDim, marginTop: "4px" } }, "Months to recover CAC")
      )
    ),

    // Additional Metrics Row
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" } },
      createElement("div", { style: { backgroundColor: COLORS.card, borderRadius: "12px", padding: "16px", border: "1px solid " + COLORS.border, textAlign: "center" } },
        createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" } }, "Average ACV"),
        createElement("div", { style: { fontSize: "24px", fontWeight: "700", color: COLORS.text } }, "$" + (MARKET_SIZE_DATA.unitEconomics.acv / 1000) + "K")
      ),
      createElement("div", { style: { backgroundColor: COLORS.card, borderRadius: "12px", padding: "16px", border: "1px solid " + COLORS.border, textAlign: "center" } },
        createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" } }, "Gross Margin"),
        createElement("div", { style: { fontSize: "24px", fontWeight: "700", color: COLORS.text } }, (MARKET_SIZE_DATA.unitEconomics.grossMargin * 100) + "%")
      ),
      createElement("div", { style: { backgroundColor: COLORS.card, borderRadius: "12px", padding: "16px", border: "1px solid " + COLORS.border, textAlign: "center" } },
        createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" } }, "Net Revenue Retention"),
        createElement("div", { style: { fontSize: "24px", fontWeight: "700", color: COLORS.success } }, (MARKET_SIZE_DATA.unitEconomics.nrr * 100) + "%")
      ),
      createElement("div", { style: { backgroundColor: COLORS.card, borderRadius: "12px", padding: "16px", border: "1px solid " + COLORS.border, textAlign: "center" } },
        createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" } }, "Customer Lifetime"),
        createElement("div", { style: { fontSize: "24px", fontWeight: "700", color: COLORS.text } }, MARKET_SIZE_DATA.unitEconomics.customerLifetime + " yrs")
      )
    ),

    // Unit Economics Scenarios
    createElement(Card, { style: { marginBottom: "20px" } },
      createElement("div", { style: styles.cardTitle }, "📊 Unit Economics by Scenario"),
      createElement("table", { style: styles.table },
        createElement("thead", null,
          createElement("tr", null,
            createElement("th", { style: styles.th }, "Scenario"),
            createElement("th", { style: styles.th }, "Gross Margin"),
            createElement("th", { style: styles.th }, "CAC"),
            createElement("th", { style: styles.th }, "Lifetime"),
            createElement("th", { style: styles.th }, "NRR"),
            createElement("th", { style: styles.th }, "LTV"),
            createElement("th", { style: styles.th }, "LTV:CAC"),
            createElement("th", { style: styles.th }, "Payback")
          )
        ),
        createElement("tbody", null,
          MARKET_SIZE_DATA.unitEconomics.scenarios.map(function(scenario, i) {
            var ltv = MARKET_SIZE_DATA.unitEconomics.acv * scenario.grossMargin * scenario.lifetime;
            var ltvCac = ltv / scenario.cac;
            var payback = scenario.cac / (MARKET_SIZE_DATA.unitEconomics.acv * scenario.grossMargin / 12);
            var isBase = scenario.name === "Base Case";
            return createElement("tr", { key: i, style: isBase ? { backgroundColor: COLORS.primary + "10" } : {} },
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600" }) },
                createElement("div", null, scenario.name),
                createElement("div", { style: { fontSize: "10px", color: COLORS.textDim, fontWeight: "400" } }, scenario.description)
              ),
              createElement("td", { style: styles.td }, (scenario.grossMargin * 100) + "%"),
              createElement("td", { style: styles.td }, "$" + (scenario.cac / 1000) + "K"),
              createElement("td", { style: styles.td }, scenario.lifetime + " yrs"),
              createElement("td", { style: Object.assign({}, styles.td, { color: scenario.nrr >= 1.1 ? COLORS.success : COLORS.text }) }, (scenario.nrr * 100) + "%"),
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600", color: COLORS.success }) }, "$" + (ltv / 1000000).toFixed(1) + "M"),
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "700", color: ltvCac >= 10 ? COLORS.primary : COLORS.text }) }, ltvCac.toFixed(1) + "x"),
              createElement("td", { style: Object.assign({}, styles.td, { color: payback <= 12 ? COLORS.success : COLORS.accent }) }, Math.round(payback) + " mo")
            );
          })
        )
      )
    ),

    // Cost Structure at Scale
    createElement(Card, { style: { marginBottom: "20px" } },
      createElement("div", { style: styles.cardTitle }, "💰 Cost Structure at Scale (% of Revenue)"),
      createElement("div", { style: { display: "flex", gap: "4px", height: "40px", marginBottom: "16px" } },
        [
          { name: "COGS", value: MARKET_SIZE_DATA.unitEconomics.costStructure.cogs, color: COLORS.danger },
          { name: "S&M", value: MARKET_SIZE_DATA.unitEconomics.costStructure.salesMarketing, color: COLORS.accent },
          { name: "R&D", value: MARKET_SIZE_DATA.unitEconomics.costStructure.rd, color: COLORS.info },
          { name: "G&A", value: MARKET_SIZE_DATA.unitEconomics.costStructure.ga, color: COLORS.purple },
          { name: "Op. Margin", value: MARKET_SIZE_DATA.unitEconomics.costStructure.operatingMargin, color: COLORS.success }
        ].map(function(item, i) {
          return createElement("div", { key: i, style: {
            width: (item.value * 100) + "%",
            backgroundColor: item.color,
            borderRadius: i === 0 ? "6px 0 0 6px" : i === 4 ? "0 6px 6px 0" : "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }},
            createElement("span", { style: { fontSize: "10px", fontWeight: "600", color: "#fff" } }, (item.value * 100) + "%")
          );
        })
      ),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" } },
        [
          { name: "COGS", value: MARKET_SIZE_DATA.unitEconomics.costStructure.cogs, color: COLORS.danger, desc: "Hosting, support, implementation" },
          { name: "Sales & Marketing", value: MARKET_SIZE_DATA.unitEconomics.costStructure.salesMarketing, color: COLORS.accent, desc: "Sales team, marketing, events" },
          { name: "R&D", value: MARKET_SIZE_DATA.unitEconomics.costStructure.rd, color: COLORS.info, desc: "Engineering, product" },
          { name: "G&A", value: MARKET_SIZE_DATA.unitEconomics.costStructure.ga, color: COLORS.purple, desc: "Admin, legal, finance" },
          { name: "Operating Margin", value: MARKET_SIZE_DATA.unitEconomics.costStructure.operatingMargin, color: COLORS.success, desc: "Profit at scale" }
        ].map(function(item, i) {
          return createElement("div", { key: i, style: { textAlign: "center" } },
            createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "4px" } },
              createElement("span", { style: { width: "10px", height: "10px", borderRadius: "2px", backgroundColor: item.color } }),
              createElement("span", { style: { fontSize: "12px", fontWeight: "600", color: COLORS.text } }, item.name)
            ),
            createElement("div", { style: { fontSize: "18px", fontWeight: "700", color: item.color } }, (item.value * 100) + "%"),
            createElement("div", { style: { fontSize: "10px", color: COLORS.textDim } }, item.desc)
          );
        })
      )
    ),

    // Benchmarks Comparison
    createElement(Card, { style: { marginBottom: "24px", background: COLORS.info + "10", borderColor: COLORS.info + "40" } },
      createElement("div", { style: styles.cardTitle }, "📈 vs. SaaS Benchmarks"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" } },
        [
          { metric: "LTV:CAC Ratio", greenbay: ((MARKET_SIZE_DATA.unitEconomics.acv * MARKET_SIZE_DATA.unitEconomics.grossMargin * MARKET_SIZE_DATA.unitEconomics.customerLifetime) / MARKET_SIZE_DATA.unitEconomics.cac).toFixed(1) + "x", benchmark: "3-5x", status: "excellent" },
          { metric: "CAC Payback", greenbay: Math.round(MARKET_SIZE_DATA.unitEconomics.cac / (MARKET_SIZE_DATA.unitEconomics.acv * MARKET_SIZE_DATA.unitEconomics.grossMargin / 12)) + " mo", benchmark: "12-18 mo", status: "excellent" },
          { metric: "Gross Margin", greenbay: (MARKET_SIZE_DATA.unitEconomics.grossMargin * 100) + "%", benchmark: "70-80%", status: "good" },
          { metric: "Net Revenue Retention", greenbay: (MARKET_SIZE_DATA.unitEconomics.nrr * 100) + "%", benchmark: "100-120%", status: "good" }
        ].map(function(item, i) {
          var statusColors = { excellent: COLORS.success, good: COLORS.primary, average: COLORS.accent };
          return createElement("div", { key: i, style: { padding: "16px", backgroundColor: COLORS.card, borderRadius: "8px", textAlign: "center" } },
            createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "8px" } }, item.metric),
            createElement("div", { style: { fontSize: "24px", fontWeight: "700", color: statusColors[item.status] } }, item.greenbay),
            createElement("div", { style: { fontSize: "11px", color: COLORS.textDim, marginTop: "4px" } }, "Benchmark: " + item.benchmark),
            createElement("div", { style: {
              marginTop: "8px", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "600",
              backgroundColor: statusColors[item.status] + "20", color: statusColors[item.status], display: "inline-block"
            }}, item.status.toUpperCase())
          );
        })
      ),
      createElement("div", { style: { marginTop: "16px", fontSize: "11px", color: COLORS.textDim } },
        "Sources: OpenView Partners SaaS Benchmarks 2024, Bessemer Cloud Index"
      )
    ),

    // Key Metrics Row
    createElement("div", { style: styles.grid },
      createElement(MetricCard, {
        icon: "📊",
        title: "Fleet Management TAM (2025)",
        value: "$" + MARKET_SIZE_DATA.tam.current + "B",
        label: "Growing to $" + MARKET_SIZE_DATA.tam.projected + "B by 2030",
        color: COLORS.info,
        trend: MARKET_SIZE_DATA.tam.cagr + "% CAGR"
      }),
      createElement(MetricCard, {
        icon: "🚛",
        title: "EV Truck Sales (2024)",
        value: (MARKET_SIZE_DATA.evMarketContext.evSales2024 / 1000).toFixed(1) + "K",
        label: "US + EU combined",
        color: COLORS.primary,
        trend: MARKET_SIZE_DATA.evMarketContext.evShare2024 + "% market share"
      }),
      createElement(MetricCard, {
        icon: "⚡",
        title: "EV Truck Sales (2030)",
        value: (MARKET_SIZE_DATA.evMarketContext.evSales2030 / 1000).toFixed(0) + "K",
        label: "IEA STEPS projection",
        color: COLORS.success,
        trend: MARKET_SIZE_DATA.evMarketContext.evShare2030 + "% market share"
      }),
      createElement(MetricCard, {
        icon: "🌍",
        title: "North America Share",
        value: MARKET_SIZE_DATA.regions[0].share + "%",
        label: "Largest regional market",
        color: COLORS.accent
      })
    ),

    // Market Projections Chart
    createElement("div", { style: { marginTop: "32px" } },
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "📈 Fleet Management Market Growth with Orchestration Segment"),
        createElement(ResponsiveContainer, { width: "100%", height: 400 },
          createElement(AreaChart, { data: MARKET_SIZE_DATA.projections, margin: { top: 20, right: 30, left: 20, bottom: 20 } },
            createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.border }),
            createElement(XAxis, { dataKey: "year", stroke: COLORS.textMuted }),
            createElement(YAxis, { stroke: COLORS.textMuted, tickFormatter: function(v) { return "$" + v + "B"; } }),
            createElement(Tooltip, {
              contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" },
              formatter: function(value) { return "$" + value + "B"; }
            }),
            createElement(Legend, null),
            createElement(Area, { type: "monotone", dataKey: "total", name: "Total Fleet Management", fill: COLORS.info + "40", stroke: COLORS.info, strokeWidth: 2 }),
            createElement(Area, { type: "monotone", dataKey: "orchestration", name: "Orchestration Segment", fill: COLORS.primary + "60", stroke: COLORS.primary, strokeWidth: 3 })
          )
        ),
        createElement("div", { style: { marginTop: "12px", fontSize: "11px", color: COLORS.textMuted } },
          "Source: MarketsandMarkets Fleet Management Market Report 2025-2030, IEA Global EV Outlook 2025, ACEA"
        )
      )
    ),

    // Segment Breakdown
    createElement("div", { style: { marginTop: "32px" } },
      createElement("div", { style: styles.sectionTitle }, "Market Segments"),
      createElement("div", { style: styles.gridWide },
        createElement(Card, null,
          createElement("div", { style: styles.cardTitle }, "📊 Market by Segment (2024)"),
          createElement(ResponsiveContainer, { width: "100%", height: 300 },
            createElement(BarChart, { data: MARKET_SIZE_DATA.segments, layout: "vertical", margin: { left: 150, right: 30 } },
              createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.border }),
              createElement(XAxis, { type: "number", stroke: COLORS.textMuted, tickFormatter: function(v) { return "$" + v + "B"; } }),
              createElement(YAxis, { type: "category", dataKey: "name", stroke: COLORS.textMuted, width: 140 }),
              createElement(Tooltip, {
                contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" },
                formatter: function(value) { return "$" + value + "B"; }
              }),
              createElement(Bar, { dataKey: "size", fill: COLORS.primary, radius: [0, 4, 4, 0] })
            )
          )
        ),
        createElement(Card, null,
          createElement("div", { style: styles.cardTitle }, "🌍 Regional Distribution"),
          createElement(ResponsiveContainer, { width: "100%", height: 300 },
            createElement(PieChart, null,
              createElement(Pie, {
                data: MARKET_SIZE_DATA.regions,
                dataKey: "share",
                nameKey: "region",
                cx: "50%",
                cy: "50%",
                outerRadius: 100,
                label: function(entry) { return entry.region + " (" + entry.share + "%)"; },
                labelLine: { stroke: COLORS.textMuted }
              },
                MARKET_SIZE_DATA.regions.map(function(entry, index) {
                  return createElement(Cell, { key: index, fill: CHART_COLORS[index] });
                })
              ),
              createElement(Tooltip, {
                contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" }
              })
            )
          )
        )
      )
    ),

    // Growth by Segment
    createElement("div", { style: { marginTop: "32px" } },
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "📈 Growth Rate by Segment (CAGR %)")
      ),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", padding: "0 24px 24px 24px" } },
        MARKET_SIZE_DATA.segments.map(function(seg, i) {
          var isOrchestration = seg.name.includes("Orchestration");
          return createElement("div", { key: i, style: {
            padding: "16px",
            backgroundColor: isOrchestration ? COLORS.primary + "15" : COLORS.background,
            borderRadius: "8px",
            textAlign: "center",
            border: isOrchestration ? "2px solid " + COLORS.primary : "1px solid " + COLORS.border
          }},
            createElement("div", { style: { fontSize: "28px", fontWeight: "700", color: isOrchestration ? COLORS.primary : COLORS.text } }, seg.growth + "%"),
            createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted, marginTop: "4px" } }, seg.name)
          );
        })
      )
    )
  );
}

// ============ TECH STACK TAB ============
function TechStackTab() {
  return createElement("div", null,
    // Introduction
    createElement("div", { style: { marginBottom: "32px" } },
      createElement(Card, { style: { background: "linear-gradient(135deg, " + COLORS.primary + "10 0%, " + COLORS.card + " 100%)", borderColor: COLORS.primary + "40" } },
        createElement("div", { style: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" } },
          createElement("div", { style: { fontSize: "48px" } }, "🔗"),
          createElement("div", null,
            createElement("h2", { style: { fontSize: "22px", fontWeight: "600", color: COLORS.text, marginBottom: "8px" } }, "The Fleet Orchestration Layer"),
            createElement("p", { style: { color: COLORS.textMuted, fontSize: "14px", lineHeight: "1.6", maxWidth: "700px" } },
              "Orchestration is the context layer that connects business decisions to operational reality. It ensures vehicles, depots, chargers, and drivers stay synchronized with what was originally planned — bridging the gap between strategy and execution."
            )
          )
        )
      )
    ),

    // Tech Stack Visualization
    createElement("div", { style: styles.sectionTitle }, "Fleet Technology Stack"),
    createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" } },
      TECH_STACK_LAYERS.map(function(layer, i) {
        return createElement("div", { key: i, style: {
          display: "flex",
          alignItems: "stretch",
          gap: "16px",
          padding: layer.isGreenbay ? "20px" : "16px",
          backgroundColor: layer.isGreenbay ? layer.color + "15" : COLORS.card,
          border: layer.isGreenbay ? "2px solid " + layer.color : "1px solid " + COLORS.border,
          borderRadius: "12px"
        }},
          createElement("div", { style: {
            width: "8px",
            backgroundColor: layer.color,
            borderRadius: "4px",
            flexShrink: 0
          }}),
          createElement("div", { style: { flex: 1 } },
            createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" } },
              createElement("span", { style: { fontSize: "18px", fontWeight: "700", color: layer.color } }, layer.layer),
              layer.isGreenbay ? createElement(Badge, { variant: "primary" }, "Greenbay") : null
            ),
            createElement("p", { style: { fontSize: "13px", color: COLORS.textMuted, marginBottom: "12px" } }, layer.description),
            createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" } },
              layer.solutions.map(function(sol, j) {
                return createElement("span", { key: j, style: {
                  padding: "4px 10px",
                  backgroundColor: COLORS.background,
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: COLORS.text
                }}, sol);
              })
            ),
            createElement("div", { style: { fontSize: "12px", color: COLORS.textDim } },
              "Key Players: ", layer.players.join(", ")
            )
          )
        );
      })
    ),

    // Value Props
    createElement("div", { style: styles.sectionTitle }, "Why Orchestration Matters"),
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" } },
      ORCHESTRATION_VALUE_PROPS.map(function(prop, i) {
        return createElement(Card, { key: i },
          createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: "16px" } },
            createElement("div", { style: {
              width: "48px", height: "48px", borderRadius: "12px",
              backgroundColor: COLORS.danger + "20",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0
            }}, "⚠️"),
            createElement("div", null,
              createElement("h3", { style: { fontSize: "15px", fontWeight: "600", color: COLORS.text, marginBottom: "6px" } }, prop.problem),
              createElement("p", { style: { fontSize: "13px", color: COLORS.textMuted, marginBottom: "8px" } }, prop.description),
              createElement("div", { style: { fontSize: "14px", fontWeight: "600", color: COLORS.danger, marginBottom: "12px" } }, prop.impact)
            )
          ),
          createElement("div", { style: {
            marginTop: "12px", padding: "12px", backgroundColor: COLORS.primary + "10",
            borderRadius: "8px", borderLeft: "3px solid " + COLORS.primary
          }},
            createElement("div", { style: { fontSize: "12px", color: COLORS.primary, fontWeight: "600", marginBottom: "4px" } }, "Solution"),
            createElement("div", { style: { fontSize: "13px", color: COLORS.text } }, prop.solution)
          )
        );
      })
    ),

    // Integration Points
    createElement("div", { style: { marginTop: "32px" } },
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "🔌 Orchestration Integration Points"),
        createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" } },
          [
            { name: "TMS / ERP", icon: "📋", direction: "Receives plans, sends execution status" },
            { name: "Telematics", icon: "📍", direction: "Receives location, sends route adjustments" },
            { name: "Charging / Energy", icon: "⚡", direction: "Receives constraints, sends schedules" },
            { name: "Maintenance", icon: "🔧", direction: "Receives vehicle status, sends work orders" },
            { name: "Driver Apps", icon: "📱", direction: "Receives tasks, sends compliance data" },
            { name: "Analytics / BI", icon: "📊", direction: "Sends unified operational data" }
          ].map(function(int, i) {
            return createElement("div", { key: i, style: {
              padding: "16px", backgroundColor: COLORS.background, borderRadius: "8px",
              textAlign: "center"
            }},
              createElement("div", { style: { fontSize: "28px", marginBottom: "8px" } }, int.icon),
              createElement("div", { style: { fontSize: "14px", fontWeight: "600", color: COLORS.text, marginBottom: "4px" } }, int.name),
              createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted } }, int.direction)
            );
          })
        )
      )
    )
  );
}

// ============ COMPETITIVE LANDSCAPE TAB ============
function CompetitiveLandscapeTab() {
  var categoryState = useState("all");
  var selectedCategory = categoryState[0];
  var setSelectedCategory = categoryState[1];

  var filteredCompetitors = selectedCategory === "all"
    ? COMPETITORS
    : COMPETITORS.filter(function(c) { return c.type === selectedCategory; });

  var categories = [
    { id: "all", label: "All Players" },
    { id: "point-solution", label: "Point Solutions" },
    { id: "platform", label: "Platforms" },
    { id: "orchestration", label: "Orchestration" }
  ];

  return createElement("div", null,
    // Category Filter
    createElement("div", { style: { display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" } },
      categories.map(function(cat) {
        var isActive = selectedCategory === cat.id;
        return createElement("button", {
          key: cat.id,
          onClick: function() { setSelectedCategory(cat.id); },
          style: isActive ? styles.navButtonActive : styles.navButton
        }, cat.label);
      })
    ),

    // Market Share Chart
    createElement("div", { style: styles.gridWide },
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "📊 Market Share by Revenue"),
        createElement(ResponsiveContainer, { width: "100%", height: 300 },
          createElement(PieChart, null,
            createElement(Pie, {
              data: MARKET_SHARE_DATA,
              dataKey: "share",
              nameKey: "name",
              cx: "50%",
              cy: "50%",
              outerRadius: 100,
              label: function(entry) { return entry.name + " (" + entry.share + "%)"; },
              labelLine: { stroke: COLORS.textMuted }
            },
              MARKET_SHARE_DATA.map(function(entry, index) {
                return createElement(Cell, { key: index, fill: CHART_COLORS[index % CHART_COLORS.length] });
              })
            ),
            createElement(Tooltip, {
              contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" },
              formatter: function(value, name, props) { return [value + "% share, $" + props.payload.revenue + "M revenue", name]; }
            })
          )
        )
      ),
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "🎯 Competitive Positioning"),
        createElement("div", { style: { position: "relative", height: 300, backgroundColor: COLORS.background, borderRadius: "8px", padding: "20px" } },
          // Axes labels
          createElement("div", { style: { position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)", fontSize: "11px", color: COLORS.textMuted } }, "Enterprise Focus →"),
          createElement("div", { style: { position: "absolute", left: "5px", top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: "11px", color: COLORS.textMuted } }, "Orchestration Depth →"),
          // Competitor dots
          filteredCompetitors.map(function(comp, i) {
            return createElement("div", {
              key: i,
              style: {
                position: "absolute",
                left: (comp.positioning.x * 0.9 + 5) + "%",
                bottom: (comp.positioning.y * 0.85 + 5) + "%",
                transform: "translate(-50%, 50%)"
              }
            },
              createElement("div", { style: {
                width: comp.isGreenbay ? "16px" : "12px",
                height: comp.isGreenbay ? "16px" : "12px",
                borderRadius: "50%",
                backgroundColor: comp.isGreenbay ? COLORS.primary : comp.type === "platform" ? COLORS.purple : COLORS.info,
                border: comp.isGreenbay ? "3px solid " + COLORS.primary : "2px solid " + COLORS.background
              }}),
              createElement("div", { style: {
                position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)",
                fontSize: "10px", color: comp.isGreenbay ? COLORS.primary : COLORS.textMuted,
                fontWeight: comp.isGreenbay ? "600" : "400",
                whiteSpace: "nowrap"
              }}, comp.name)
            );
          })
        ),
        createElement("div", { style: { display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px", fontSize: "11px" } },
          createElement("span", { style: { display: "flex", alignItems: "center", gap: "4px" } },
            createElement("span", { style: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: COLORS.info } }),
            " Point Solutions"
          ),
          createElement("span", { style: { display: "flex", alignItems: "center", gap: "4px" } },
            createElement("span", { style: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: COLORS.purple } }),
            " Platforms"
          ),
          createElement("span", { style: { display: "flex", alignItems: "center", gap: "4px" } },
            createElement("span", { style: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: COLORS.primary } }),
            " Orchestration"
          )
        )
      )
    ),

    // Competitor Cards
    createElement("div", { style: { marginTop: "32px" } },
      createElement("div", { style: styles.sectionTitle }, "Competitive Analysis"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" } },
        filteredCompetitors.map(function(comp, i) {
          return createElement(Card, { key: i, style: comp.isGreenbay ? { borderColor: COLORS.primary, background: COLORS.primary + "08" } : {} },
            createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" } },
              createElement("div", null,
                createElement("h3", { style: { fontSize: "18px", fontWeight: "600", color: comp.isGreenbay ? COLORS.primary : COLORS.text } }, comp.name),
                createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted } }, comp.category)
              ),
              createElement(Badge, { variant: comp.type === "orchestration" ? "primary" : comp.type === "platform" ? "purple" : "info" }, comp.type)
            ),
            createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" } },
              comp.revenue ? createElement("div", null,
                createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted } }, "Revenue"),
                createElement("div", { style: { fontSize: "16px", fontWeight: "600", color: COLORS.text } }, "$" + comp.revenue + "M")
              ) : null,
              comp.valuation ? createElement("div", null,
                createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted } }, "Valuation"),
                createElement("div", { style: { fontSize: "16px", fontWeight: "600", color: COLORS.text } }, "$" + (comp.valuation / 1000).toFixed(1) + "B")
              ) : null,
              comp.customers ? createElement("div", null,
                createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted } }, "Customers"),
                createElement("div", { style: { fontSize: "16px", fontWeight: "600", color: COLORS.text } }, formatNumber(comp.customers))
              ) : null,
              createElement("div", null,
                createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted } }, "Founded"),
                createElement("div", { style: { fontSize: "16px", fontWeight: "600", color: COLORS.text } }, comp.founded)
              )
            ),
            createElement("div", { style: { marginBottom: "12px" } },
              createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "6px" } }, "Focus Areas"),
              createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } },
                comp.focus.map(function(f, j) {
                  return createElement("span", { key: j, style: {
                    padding: "3px 8px", backgroundColor: COLORS.background, borderRadius: "4px", fontSize: "11px", color: COLORS.text
                  }}, f);
                })
              )
            ),
            createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" } },
              createElement("div", null,
                createElement("div", { style: { color: COLORS.success, fontWeight: "600", marginBottom: "4px" } }, "Strengths"),
                comp.strengths.map(function(s, j) {
                  return createElement("div", { key: j, style: { color: COLORS.textMuted, marginBottom: "2px" } }, "• " + s);
                })
              ),
              createElement("div", null,
                createElement("div", { style: { color: COLORS.danger, fontWeight: "600", marginBottom: "4px" } }, "Gaps"),
                comp.weaknesses.map(function(w, j) {
                  return createElement("div", { key: j, style: { color: COLORS.textMuted, marginBottom: "2px" } }, "• " + w);
                })
              )
            )
          );
        })
      )
    ),

    // Pricing Comparison Section
    createElement("div", { style: { marginTop: "32px" } },
      createElement("div", { style: styles.sectionTitle }, "Pricing Comparison"),
      createElement("div", { style: { overflowX: "auto" } },
        createElement("table", { style: styles.table },
          createElement("thead", null,
            createElement("tr", null,
              createElement("th", { style: styles.th }, "Company"),
              createElement("th", { style: styles.th }, "Per Vehicle/Month"),
              createElement("th", { style: styles.th }, "Hardware"),
              createElement("th", { style: styles.th }, "Contract"),
              createElement("th", { style: styles.th }, "Pricing Model"),
              createElement("th", { style: styles.th }, "Source")
            )
          ),
          createElement("tbody", null,
            filteredCompetitors.filter(function(c) { return c.pricing; }).map(function(comp, i) {
              var isNotDisclosed = comp.pricing.perVehicleMonth === "Not publicly disclosed";
              return createElement("tr", { key: i },
                createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600", color: comp.isGreenbay ? COLORS.primary : COLORS.text }) }, comp.name),
                createElement("td", { style: Object.assign({}, styles.td, { color: isNotDisclosed ? COLORS.textDim : COLORS.success, fontStyle: isNotDisclosed ? "italic" : "normal" }) }, comp.pricing.perVehicleMonth),
                createElement("td", { style: Object.assign({}, styles.td, { fontSize: "12px" }) }, comp.pricing.hardwareCost),
                createElement("td", { style: styles.td }, comp.pricing.contractLength),
                createElement("td", { style: Object.assign({}, styles.td, { fontSize: "12px" }) }, comp.pricingStrategy ? comp.pricingStrategy.model : "N/A"),
                createElement("td", { style: Object.assign({}, styles.td, { fontSize: "11px", color: COLORS.textDim }) }, comp.pricing.source)
              );
            })
          )
        )
      ),
      createElement("div", { style: { marginTop: "12px", padding: "12px", backgroundColor: COLORS.info + "10", borderRadius: "8px", fontSize: "12px", color: COLORS.textMuted } },
        createElement("strong", { style: { color: COLORS.info } }, "Note: "),
        "Pricing varies by fleet size, features, and negotiation. \"Not publicly disclosed\" indicates the company does not publish pricing. All figures are estimates from industry reviews and should be verified with vendors."
      )
    ),

    // Fleet Types Served Section
    createElement("div", { style: { marginTop: "32px" } },
      createElement("div", { style: styles.sectionTitle }, "Fleet Types & Industries Served"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" } },
        filteredCompetitors.filter(function(c) { return c.fleetTypes && c.fleetTypes.industries; }).map(function(comp, i) {
          return createElement(Card, { key: i, style: comp.isGreenbay ? { borderColor: COLORS.primary } : {} },
            createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
              createElement("h3", { style: { fontSize: "16px", fontWeight: "600", color: comp.isGreenbay ? COLORS.primary : COLORS.text } }, comp.name),
              createElement(Badge, { variant: comp.type === "orchestration" ? "primary" : comp.type === "platform" ? "purple" : "info" }, comp.type)
            ),
            createElement("div", { style: { marginBottom: "12px" } },
              createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, fontWeight: "600", marginBottom: "6px" } }, "INDUSTRIES"),
              createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } },
                comp.fleetTypes.industries.slice(0, 6).map(function(ind, j) {
                  return createElement("span", { key: j, style: {
                    padding: "4px 8px", backgroundColor: COLORS.info + "15", borderRadius: "4px", fontSize: "11px", color: COLORS.info
                  }}, ind);
                }),
                comp.fleetTypes.industries.length > 6 ? createElement("span", { style: {
                  padding: "4px 8px", backgroundColor: COLORS.background, borderRadius: "4px", fontSize: "11px", color: COLORS.textMuted
                }}, "+" + (comp.fleetTypes.industries.length - 6) + " more") : null
              )
            ),
            createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" } },
              createElement("div", null,
                createElement("div", { style: { color: COLORS.textMuted, fontWeight: "600", marginBottom: "4px", fontSize: "11px" } }, "FLEET SIZES"),
                createElement("div", { style: { color: COLORS.text } }, comp.fleetTypes.fleetSizes)
              ),
              createElement("div", null,
                createElement("div", { style: { color: COLORS.textMuted, fontWeight: "600", marginBottom: "4px", fontSize: "11px" } }, "VEHICLE TYPES"),
                createElement("div", { style: { color: COLORS.text } }, comp.fleetTypes.vehicleTypes ? comp.fleetTypes.vehicleTypes.join(", ") : "N/A")
              )
            ),
            comp.fleetTypes.notableCustomers ? createElement("div", { style: { marginTop: "12px", padding: "8px", backgroundColor: COLORS.background, borderRadius: "6px" } },
              createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px" } }, "Notable Customers"),
              createElement("div", { style: { fontSize: "12px", color: COLORS.accent } },
                Array.isArray(comp.fleetTypes.notableCustomers) ? comp.fleetTypes.notableCustomers.join(", ") : comp.fleetTypes.notableCustomers
              )
            ) : null,
            createElement("div", { style: { marginTop: "8px", fontSize: "10px", color: COLORS.textDim } }, "Source: " + comp.fleetTypes.source)
          );
        })
      )
    )
  );
}

// ============ MARKET DYNAMICS TAB ============
function MarketDynamicsTab() {
  return createElement("div", null,
    // Market Drivers
    createElement("div", { style: styles.sectionTitle }, "Market Drivers"),
    createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginBottom: "32px" } },
      MARKET_DRIVERS.map(function(driver, i) {
        var trendColor = driver.trend === "accelerating" ? COLORS.success : driver.trend === "stable" ? COLORS.accent : COLORS.textMuted;
        var impactColor = driver.impact === "High" ? COLORS.primary : COLORS.info;
        return createElement(Card, { key: i },
          createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" } },
            createElement("h3", { style: { fontSize: "15px", fontWeight: "600", color: COLORS.text } }, driver.driver),
            createElement("div", { style: { display: "flex", gap: "6px" } },
              createElement(Badge, { variant: driver.impact === "High" ? "primary" : "info" }, driver.impact),
              createElement("span", { style: {
                padding: "4px 8px", borderRadius: "4px", fontSize: "10px",
                backgroundColor: trendColor + "20", color: trendColor, fontWeight: "600"
              }}, driver.trend)
            )
          ),
          createElement("p", { style: { fontSize: "13px", color: COLORS.textMuted, marginBottom: "12px" } }, driver.description),
          createElement("div", { style: { padding: "10px", backgroundColor: COLORS.background, borderRadius: "6px", fontSize: "13px", color: COLORS.text } },
            driver.metrics
          )
        );
      })
    ),

    // Adoption Barriers
    createElement("div", { style: styles.sectionTitle }, "Adoption Barriers"),
    createElement(Card, null,
      createElement(ResponsiveContainer, { width: "100%", height: 300 },
        createElement(BarChart, { data: ADOPTION_BARRIERS, layout: "vertical", margin: { left: 180, right: 30 } },
          createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.border }),
          createElement(XAxis, { type: "number", stroke: COLORS.textMuted, domain: [0, 100] }),
          createElement(YAxis, { type: "category", dataKey: "barrier", stroke: COLORS.textMuted, width: 170 }),
          createElement(Tooltip, {
            contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" },
            formatter: function(value, name, props) { return [value + "% severity - " + props.payload.description]; }
          }),
          createElement(Bar, { dataKey: "severity", fill: COLORS.danger, radius: [0, 4, 4, 0] })
        )
      )
    ),

    // Buyer Personas
    createElement("div", { style: { marginTop: "32px" } },
      createElement("div", { style: styles.sectionTitle }, "Buyer Personas"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" } },
        BUYER_PERSONAS.map(function(persona, i) {
          return createElement(Card, { key: i },
            createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" } },
              createElement("div", { style: {
                width: "48px", height: "48px", borderRadius: "12px",
                backgroundColor: CHART_COLORS[i] + "20",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px"
              }}, ["👔", "🌱", "💰", "💻"][i]),
              createElement("div", null,
                createElement("h3", { style: { fontSize: "15px", fontWeight: "600", color: COLORS.text } }, persona.role),
                createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted } }, persona.influence)
              )
            ),
            createElement("div", { style: { marginBottom: "12px" } },
              createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, fontWeight: "600", marginBottom: "6px" } }, "KEY CONCERNS"),
              createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } },
                persona.concerns.map(function(c, j) {
                  return createElement("span", { key: j, style: {
                    padding: "4px 8px", backgroundColor: COLORS.background, borderRadius: "4px", fontSize: "11px"
                  }}, c);
                })
              )
            ),
            createElement("div", null,
              createElement("div", { style: { fontSize: "11px", color: COLORS.textMuted, fontWeight: "600", marginBottom: "6px" } }, "SUCCESS METRICS"),
              persona.metrics.map(function(m, j) {
                return createElement("div", { key: j, style: { fontSize: "12px", color: COLORS.text, marginBottom: "2px" } }, "• " + m);
              })
            )
          );
        })
      )
    )
  );
}

// ============ TRENDS & OUTLOOK TAB ============
function TrendsOutlookTab() {
  return createElement("div", null,
    // Technology Trends
    createElement("div", { style: styles.sectionTitle }, "Technology Trends"),
    createElement("div", { style: { overflowX: "auto", marginBottom: "32px" } },
      createElement("table", { style: styles.table },
        createElement("thead", null,
          createElement("tr", null,
            createElement("th", { style: styles.th }, "Trend"),
            createElement("th", { style: styles.th }, "Maturity"),
            createElement("th", { style: styles.th }, "Impact"),
            createElement("th", { style: styles.th }, "Timeline"),
            createElement("th", { style: styles.th }, "Description")
          )
        ),
        createElement("tbody", null,
          TECHNOLOGY_TRENDS.map(function(trend, i) {
            var maturityColors = {
              "Mature": COLORS.info,
              "Growth": COLORS.success,
              "Early Growth": COLORS.primary,
              "Emerging": COLORS.accent
            };
            return createElement("tr", { key: i },
              createElement("td", { style: Object.assign({}, styles.td, { fontWeight: "600" }) }, trend.trend),
              createElement("td", { style: styles.td },
                createElement(Badge, { variant: trend.maturity === "Emerging" ? "warning" : trend.maturity === "Growth" ? "success" : "info" }, trend.maturity)
              ),
              createElement("td", { style: styles.td },
                createElement("span", { style: { color: trend.impact === "High" ? COLORS.primary : COLORS.textMuted, fontWeight: "600" } }, trend.impact)
              ),
              createElement("td", { style: styles.td }, trend.timeline),
              createElement("td", { style: Object.assign({}, styles.td, { color: COLORS.textMuted, fontSize: "12px" }) }, trend.description)
            );
          })
        )
      )
    ),

    // EV Fleet Growth & Orchestration Need
    createElement("div", { style: styles.gridWide },
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "⚡ EV Fleet Growth Drives Orchestration Need"),
        createElement(ResponsiveContainer, { width: "100%", height: 350 },
          createElement(ComposedChart, { data: EV_FLEET_GROWTH, margin: { top: 20, right: 30, left: 20, bottom: 20 } },
            createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.border }),
            createElement(XAxis, { dataKey: "year", stroke: COLORS.textMuted }),
            createElement(YAxis, { yAxisId: "left", stroke: COLORS.textMuted, tickFormatter: function(v) { return formatNumber(v); } }),
            createElement(YAxis, { yAxisId: "right", orientation: "right", stroke: COLORS.primary, domain: [0, 100], unit: "%" }),
            createElement(Tooltip, {
              contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" }
            }),
            createElement(Legend, null),
            createElement(Bar, { yAxisId: "left", dataKey: "evFleets", name: "EV Fleets (US)", fill: COLORS.info, radius: [4, 4, 0, 0] }),
            createElement(Line, { yAxisId: "right", type: "monotone", dataKey: "orchestrationNeed", name: "Orchestration Adoption %", stroke: COLORS.primary, strokeWidth: 3, dot: { fill: COLORS.primary, r: 5 } })
          )
        ),
        createElement("div", { style: { marginTop: "12px", fontSize: "12px", color: COLORS.textMuted } },
          "As EV fleets grow, the complexity of managing charging, range, and depot constraints drives orchestration adoption"
        )
      ),
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "💰 M&A Activity in Fleet Tech"),
        createElement(ResponsiveContainer, { width: "100%", height: 350 },
          createElement(ComposedChart, { data: MA_ACTIVITY, margin: { top: 20, right: 30, left: 20, bottom: 20 } },
            createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.border }),
            createElement(XAxis, { dataKey: "year", stroke: COLORS.textMuted }),
            createElement(YAxis, { yAxisId: "left", stroke: COLORS.textMuted }),
            createElement(YAxis, { yAxisId: "right", orientation: "right", stroke: COLORS.accent, tickFormatter: function(v) { return "$" + v + "M"; } }),
            createElement(Tooltip, {
              contentStyle: { background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: "8px" }
            }),
            createElement(Legend, null),
            createElement(Bar, { yAxisId: "left", dataKey: "deals", name: "# of Deals", fill: COLORS.secondary, radius: [4, 4, 0, 0] }),
            createElement(Line, { yAxisId: "right", type: "monotone", dataKey: "totalValue", name: "Total Value ($M)", stroke: COLORS.accent, strokeWidth: 3, dot: { fill: COLORS.accent, r: 5 } })
          )
        )
      )
    ),

    // Key Acquisitions
    createElement("div", { style: { marginTop: "32px" } },
      createElement("div", { style: styles.sectionTitle }, "Notable M&A / Funding"),
      createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" } },
        KEY_ACQUISITIONS.map(function(deal, i) {
          return createElement(Card, { key: i },
            createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
              createElement("div", null,
                createElement("div", { style: { fontSize: "14px", fontWeight: "600", color: COLORS.text } }, deal.acquirer),
                createElement("div", { style: { fontSize: "12px", color: COLORS.textMuted } }, deal.target)
              ),
              createElement("div", { style: { textAlign: "right" } },
                deal.value ? createElement("div", { style: { fontSize: "18px", fontWeight: "700", color: COLORS.success } }, "$" + deal.value + "M") : null,
                createElement("div", { style: { fontSize: "11px", color: COLORS.textDim } }, deal.year)
              )
            ),
            createElement("div", { style: { marginTop: "12px", fontSize: "12px", color: COLORS.textMuted, padding: "8px", backgroundColor: COLORS.background, borderRadius: "6px" } },
              deal.rationale
            )
          );
        })
      )
    ),

    // 2030 Outlook
    createElement("div", { style: { marginTop: "32px" } },
      createElement(Card, { style: { background: "linear-gradient(135deg, " + COLORS.primary + "10 0%, " + COLORS.card + " 100%)", borderColor: COLORS.primary + "40" } },
        createElement("div", { style: styles.cardTitle }, "🔮 2030 Outlook"),
        createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" } },
          [
            { label: "Fleet Management Market", value: "$52B+", note: "14.6% CAGR" },
            { label: "Orchestration Segment", value: "$8.5B", note: "29.5% CAGR" },
            { label: "EV Fleets (US)", value: "85K+", note: "From 7.5K in 2024" },
            { label: "Orchestration Adoption", value: "95%", note: "For EV fleets" }
          ].map(function(item, i) {
            return createElement("div", { key: i, style: { textAlign: "center", padding: "16px" } },
              createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: COLORS.primary } }, item.value),
              createElement("div", { style: { fontSize: "14px", color: COLORS.text, marginTop: "4px" } }, item.label),
              createElement("div", { style: { fontSize: "12px", color: COLORS.success, marginTop: "4px" } }, item.note)
            );
          })
        )
      )
    )
  );
}

// ============ SOURCES TAB ============
function SourcesTab() {
  return createElement("div", null,
    createElement("div", { style: { marginBottom: "32px" } },
      createElement(Card, { style: { background: COLORS.info + "10", borderColor: COLORS.info + "40" } },
        createElement("div", { style: { display: "flex", alignItems: "center", gap: "12px" } },
          createElement("span", { style: { fontSize: "24px" } }, "📚"),
          createElement("div", null,
            createElement("h3", { style: { fontSize: "16px", fontWeight: "600", color: COLORS.text } }, "Data Sources & Methodology"),
            createElement("p", { style: { fontSize: "13px", color: COLORS.textMuted } },
              "This dashboard aggregates data from multiple industry sources. Market sizing estimates and projections are based on published reports and internal analysis."
            )
          )
        )
      )
    ),

    DASHBOARD_SOURCES.map(function(category, i) {
      return createElement("div", { key: i, style: { marginBottom: "24px" } },
        createElement("div", { style: styles.sectionTitle }, category.category),
        createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" } },
          category.sources.map(function(source, j) {
            return createElement(Card, { key: j },
              createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                createElement("div", null,
                  createElement("h4", { style: { fontSize: "15px", fontWeight: "600", color: COLORS.text, marginBottom: "4px" } }, source.name),
                  createElement("p", { style: { fontSize: "12px", color: COLORS.textMuted } }, source.description)
                ),
                createElement("a", {
                  href: source.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    padding: "6px 12px", backgroundColor: COLORS.info + "20", color: COLORS.info,
                    borderRadius: "6px", fontSize: "12px", textDecoration: "none"
                  }
                }, "Visit →")
              )
            );
          })
        )
      );
    }),

    // Methodology Note
    createElement("div", { style: { marginTop: "32px" } },
      createElement(Card, null,
        createElement("div", { style: styles.cardTitle }, "📋 Methodology Notes"),
        createElement("div", { style: { fontSize: "13px", color: COLORS.textMuted, lineHeight: "1.7" } },
          createElement("p", { style: { marginBottom: "12px" } },
            createElement("strong", { style: { color: COLORS.text } }, "Market Sizing: "),
            "Total Addressable Market (TAM) figures are derived from MarketsandMarkets and Grand View Research reports. The orchestration segment is estimated based on Greenbay's analysis of adjacent markets and customer research."
          ),
          createElement("p", { style: { marginBottom: "12px" } },
            createElement("strong", { style: { color: COLORS.text } }, "Competitive Data: "),
            "Revenue and valuation figures for public companies are from SEC filings. Private company data is estimated from PitchBook, Crunchbase, and industry reports."
          ),
          createElement("p", null,
            createElement("strong", { style: { color: COLORS.text } }, "Projections: "),
            "Growth projections are based on current market trajectories and regulatory timelines. Actual results may vary based on economic conditions and technology adoption rates."
          )
        )
      )
    )
  );
}

// ============ MAIN APP ============
function App() {
  var tabState = useState("overview");
  var activeTab = tabState[0];
  var setActiveTab = tabState[1];

  var tabs = [
    { id: "overview", label: "📊 Market Overview", component: MarketOverviewTab },
    { id: "techstack", label: "🔗 Tech Stack", component: TechStackTab },
    { id: "competitive", label: "🏢 Competitive", component: CompetitiveLandscapeTab },
    { id: "dynamics", label: "📈 Dynamics", component: MarketDynamicsTab },
    { id: "trends", label: "🔮 Trends & Outlook", component: TrendsOutlookTab },
    { id: "sources", label: "📚 Sources", component: SourcesTab }
  ];

  var ActiveComponent = tabs.find(function(t) { return t.id === activeTab; }).component;

  return createElement("div", { style: styles.app },
    // Header
    createElement("header", { style: styles.header },
      createElement("h1", { style: styles.headerTitle }, "Fleet Orchestration Market Intelligence"),
      createElement("p", { style: styles.headerSubtitle }, "Competitive landscape, market dynamics, and technology trends")
    ),

    // Navigation
    createElement("nav", { style: styles.nav },
      tabs.map(function(tab) {
        return createElement("button", {
          key: tab.id,
          onClick: function() { setActiveTab(tab.id); },
          style: activeTab === tab.id ? styles.navButtonActive : styles.navButton
        }, tab.label);
      })
    ),

    // Main Content
    createElement("main", { style: styles.main },
      createElement(ActiveComponent, null)
    ),

    // Footer
    createElement("footer", { style: styles.footer },
      "© 2026 Greenbay. All rights reserved.",
      createElement("div", { style: { marginTop: "4px", fontSize: "10px", opacity: 0.6 } },
        "Data synced from canonical v" + ((window.__GREENBAY_CANONICAL__ && window.__GREENBAY_CANONICAL__._canonical_version) || "local")
      )
    )
  );
}

// ============ RENDER ============
var rootElement = document.getElementById("root");
var loadingElement = document.getElementById("loading");

ReactDOM.render(createElement(App), rootElement);
loadingElement.style.display = "none";

} catch (error) {
  console.error("Dashboard Error:", error);
  var loadStatus = document.getElementById("load-status");
  var errorMsg = document.getElementById("error-msg");
  if (loadStatus) loadStatus.textContent = "Error loading dashboard";
  if (errorMsg) {
    errorMsg.style.display = "block";
    errorMsg.textContent = error.message || "An unexpected error occurred";
  }
}

})();
