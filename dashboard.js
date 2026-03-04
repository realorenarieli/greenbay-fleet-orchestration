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
var MARKET_SIZE_DATA = {
  // Fleet Management Software Market
  tam: {
    current: 23.1,      // 2024 in $B
    projected: 52.4,    // 2030 in $B
    cagr: 14.6,         // %
    source: "MarketsandMarkets, Grand View Research"
  },
  // Fleet Orchestration (emerging segment)
  orchestration: {
    current: 1.8,       // 2024 in $B (estimated)
    projected: 8.5,     // 2030 in $B
    cagr: 29.5,         // % - faster growth as new category
    source: "Greenbay Analysis"
  },
  // Segments
  segments: [
    { name: "Telematics & Tracking", size: 8.2, share: 35, growth: 12 },
    { name: "Fleet Analytics", size: 4.6, share: 20, growth: 18 },
    { name: "Route Optimization", size: 3.5, share: 15, growth: 15 },
    { name: "Maintenance Management", size: 2.8, share: 12, growth: 11 },
    { name: "Fuel/Energy Management", size: 2.3, share: 10, growth: 22 },
    { name: "Orchestration & Integration", size: 1.8, share: 8, growth: 30 }
  ],
  // Regional breakdown
  regions: [
    { region: "North America", share: 38, size: 8.8, growth: 13 },
    { region: "Europe", share: 31, size: 7.2, growth: 15 },
    { region: "Asia Pacific", share: 22, size: 5.1, growth: 19 },
    { region: "Rest of World", share: 9, size: 2.0, growth: 14 }
  ],
  // Market projections
  projections: [
    { year: 2022, total: 19.5, orchestration: 1.0 },
    { year: 2023, total: 21.2, orchestration: 1.4 },
    { year: 2024, total: 23.1, orchestration: 1.8 },
    { year: 2025, total: 26.5, orchestration: 2.4 },
    { year: 2026, total: 30.4, orchestration: 3.2 },
    { year: 2027, total: 34.8, orchestration: 4.2 },
    { year: 2028, total: 39.9, orchestration: 5.5 },
    { year: 2029, total: 45.7, orchestration: 6.8 },
    { year: 2030, total: 52.4, orchestration: 8.5 }
  ]
};

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
var COMPETITORS = [
  // Point Solutions - Telematics
  {
    name: "Samsara",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2015,
    funding: "Public (NYSE: IOT)",
    valuation: 15000,  // $M market cap approx
    revenue: 937,      // 2024 $M
    customers: 20000,
    focus: ["Telematics", "Video Safety", "Equipment Monitoring"],
    strengths: ["Easy deployment", "Strong brand", "Video AI"],
    weaknesses: ["Limited orchestration", "Execution-focused"],
    positioning: { x: 75, y: 30 }  // x: enterprise focus, y: orchestration depth
  },
  {
    name: "Geotab",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2000,
    funding: "Private",
    valuation: 2500,
    revenue: 600,
    customers: 47000,
    focus: ["Telematics", "Fleet Analytics", "EV Solutions"],
    strengths: ["Open platform", "Data depth", "Global reach"],
    weaknesses: ["Complex for SMB", "Integration heavy"],
    positioning: { x: 60, y: 35 }
  },
  {
    name: "Motive",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2013,
    funding: "Private",
    valuation: 2850,
    revenue: 450,
    customers: 120000,
    focus: ["ELD Compliance", "Safety", "Spend Management"],
    strengths: ["SMB focus", "Compliance expertise", "Easy UX"],
    weaknesses: ["Less enterprise", "Narrow scope"],
    positioning: { x: 35, y: 25 }
  },
  {
    name: "Verizon Connect",
    category: "Telematics Platform",
    type: "point-solution",
    founded: 2018,
    funding: "Verizon subsidiary",
    valuation: null,
    revenue: 1200,
    customers: 100000,
    focus: ["Telematics", "Workforce Management", "Compliance"],
    strengths: ["Carrier backing", "Network coverage", "Scale"],
    weaknesses: ["Legacy tech debt", "Slow innovation"],
    positioning: { x: 70, y: 20 }
  },
  // Platform Players
  {
    name: "Trimble",
    category: "Fleet Platform",
    type: "platform",
    founded: 1978,
    funding: "Public (NASDAQ: TRMB)",
    valuation: 14000,
    revenue: 3800,
    customers: 35000,
    focus: ["TMS", "Routing", "Mobility", "Visibility"],
    strengths: ["Full suite", "Enterprise relationships", "Breadth"],
    weaknesses: ["Complex", "Slower to adapt", "Integration challenges"],
    positioning: { x: 85, y: 50 }
  },
  {
    name: "Omnitracs",
    category: "Fleet Platform",
    type: "platform",
    founded: 1988,
    funding: "Private (PE-backed)",
    valuation: 3000,
    revenue: 800,
    customers: 14000,
    focus: ["TMS", "Telematics", "Compliance", "Analytics"],
    strengths: ["Trucking heritage", "Compliance depth"],
    weaknesses: ["Aging platform", "Integration debt"],
    positioning: { x: 80, y: 45 }
  },
  {
    name: "Platform Science",
    category: "Fleet Platform",
    type: "platform",
    founded: 2015,
    funding: "Private",
    valuation: 1100,
    revenue: 150,
    customers: 4000,
    focus: ["Open Platform", "App Marketplace", "Telematics"],
    strengths: ["Modern architecture", "Developer friendly"],
    weaknesses: ["Smaller scale", "Proving enterprise fit"],
    positioning: { x: 55, y: 55 }
  },
  // Emerging Orchestration
  {
    name: "Greenbay",
    category: "Fleet Orchestration",
    type: "orchestration",
    founded: 2022,
    funding: "Private",
    valuation: null,
    revenue: null,
    customers: null,
    focus: ["Orchestration", "EV Fleet", "Plan-Execution Sync", "Cross-system Integration"],
    strengths: ["Purpose-built for orchestration", "EV-native", "Modern architecture"],
    weaknesses: ["Early stage", "Building market category"],
    positioning: { x: 65, y: 85 },
    isGreenbay: true
  }
];

var MARKET_SHARE_DATA = [
  { name: "Verizon Connect", share: 14, revenue: 1200 },
  { name: "Samsara", share: 11, revenue: 937 },
  { name: "Trimble", share: 10, revenue: 850 },
  { name: "Geotab", share: 7, revenue: 600 },
  { name: "Omnitracs", share: 6, revenue: 500 },
  { name: "Motive", share: 5, revenue: 450 },
  { name: "Others", share: 47, revenue: 4000 }
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

var EV_FLEET_GROWTH = [
  { year: 2022, evFleets: 2500, orchestrationNeed: 15 },
  { year: 2023, evFleets: 4200, orchestrationNeed: 25 },
  { year: 2024, evFleets: 7500, orchestrationNeed: 38 },
  { year: 2025, evFleets: 12000, orchestrationNeed: 52 },
  { year: 2026, evFleets: 18500, orchestrationNeed: 65 },
  { year: 2027, evFleets: 28000, orchestrationNeed: 76 },
  { year: 2028, evFleets: 42000, orchestrationNeed: 84 },
  { year: 2029, evFleets: 60000, orchestrationNeed: 90 },
  { year: 2030, evFleets: 85000, orchestrationNeed: 95 }
];

var MA_ACTIVITY = [
  { year: 2021, deals: 45, totalValue: 4200, avgDeal: 93 },
  { year: 2022, deals: 52, totalValue: 5800, avgDeal: 112 },
  { year: 2023, deals: 38, totalValue: 3200, avgDeal: 84 },
  { year: 2024, deals: 42, totalValue: 4500, avgDeal: 107 },
  { year: 2025, deals: 55, totalValue: 6200, avgDeal: 113 }
];

var KEY_ACQUISITIONS = [
  { year: 2024, acquirer: "Trimble", target: "Transporeon", value: 1900, rationale: "European visibility expansion" },
  { year: 2023, acquirer: "Verizon", target: "Various tuck-ins", value: 200, rationale: "Capability expansion" },
  { year: 2022, acquirer: "Samsara", target: "Multiple", value: 150, rationale: "Product expansion" },
  { year: 2021, acquirer: "Motive", target: "KeepTruckin rebrand", value: null, rationale: "Brand repositioning" },
  { year: 2021, acquirer: "Platform Science", target: "Series D", value: 125, rationale: "Growth funding" }
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
      { name: "PitchBook", description: "Private company valuations", url: "https://pitchbook.com/" }
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
    // Key Metrics
    createElement("div", { style: styles.grid },
      createElement(MetricCard, {
        icon: "📊",
        title: "Fleet Management TAM (2024)",
        value: "$" + MARKET_SIZE_DATA.tam.current + "B",
        label: "Growing to $" + MARKET_SIZE_DATA.tam.projected + "B by 2030",
        color: COLORS.primary,
        trend: MARKET_SIZE_DATA.tam.cagr + "% CAGR"
      }),
      createElement(MetricCard, {
        icon: "🎯",
        title: "Orchestration Segment (2024)",
        value: "$" + MARKET_SIZE_DATA.orchestration.current + "B",
        label: "Growing to $" + MARKET_SIZE_DATA.orchestration.projected + "B by 2030",
        color: COLORS.success,
        trend: MARKET_SIZE_DATA.orchestration.cagr + "% CAGR"
      }),
      createElement(MetricCard, {
        icon: "🚀",
        title: "Orchestration Share by 2030",
        value: "16%",
        label: "Of total fleet management market",
        color: COLORS.accent
      }),
      createElement(MetricCard, {
        icon: "🌍",
        title: "North America Share",
        value: MARKET_SIZE_DATA.regions[0].share + "%",
        label: "Largest regional market",
        color: COLORS.info
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
          "Source: MarketsandMarkets, Grand View Research, Greenbay Analysis"
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
      "© 2026 Greenbay. All rights reserved."
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
