// ---------------------------------------------------------------------------
// Static mock data — used when CONTENTFUL_SPACE_ID is not configured.
//
// Every field mirrors the Contentful schema exactly so that replacing mock
// data with a live CMS call is a single environment-variable change.
//
// Five case studies cover all filter dimensions:
//   Industries : retail · healthcare · finance · education · automotive
//   Services   : digital-transformation · ux-design · product-engineering ·
//                platform-architecture · campaign-management
// ---------------------------------------------------------------------------

import type { CaseStudy } from "./types";

export const MOCK_CASE_STUDIES: CaseStudy[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. RetailNow — Personalization Engine
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cs-001",
    slug: "retailnow-personalization-engine",
    client: "RetailNow",
    projectTitle: "Personalization Engine",
    excerpt:
      "Rebuilt a monolithic e-commerce storefront into a headless Next.js + Contentful platform with real-time personalisation, cutting LCP by 68 % and lifting conversion by 34 %.",
    industry: "retail",
    service: "digital-transformation",
    techStack: ["Next.js", "React", "Contentful", "TypeScript", "Tailwind CSS", "Vercel"],
    year: 2025,
    coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    metrics: [
      { label: "Conversion rate", value: "+34%", sentiment: "positive" },
      { label: "Lighthouse score", value: "98", sentiment: "positive" },
      { label: "LCP", value: "1.2 s", delta: "−68%", sentiment: "positive" },
    ],
    seo: {
      metaTitle: "RetailNow Personalization Engine — Case Study",
      metaDescription:
        "How we rebuilt RetailNow's e-commerce storefront with Next.js ISR and Contentful, dropping LCP to 1.2 s and lifting conversions by 34 %.",
    },
    challenge: {
      heading: "The Problem",
      body: `
<p>RetailNow's e-commerce platform — serving 2.3 million monthly active users — had grown organically for eight years into a tightly coupled monolith with no content-management strategy. Product pages rebuilt on every code deploy, average Time to Interactive sat at 4.2 s on a median 4G connection, and cart abandonment hovered at 78 %.</p>
<p>Marketing waited up to three weeks for any copy change to ship through the engineering pipeline, blocking seasonal campaigns and killing agility in a fast-moving retail market. There was no personalisation, no A/B testing capability, and SEO performance was deteriorating year-over-year.</p>
<ul>
  <li>4.2 s average Time to Interactive on mobile</li>
  <li>78 % cart abandonment rate</li>
  <li>3-week marketing deployment cycle</li>
  <li>Zero personalisation or A/B testing capability</li>
</ul>`,
    },
    solution: {
      heading: "Our Approach",
      body: `
<p>We decoupled the frontend from the monolith by migrating the storefront to <strong>Next.js with Incremental Static Regeneration (ISR)</strong> backed by <strong>Contentful</strong> as the headless CMS. Product and campaign pages are pre-rendered at build time and silently revalidated every 60 seconds — marketing can publish in seconds while every visitor gets sub-second static delivery.</p>
<p>A thin <strong>personalisation middleware</strong> layer reads Contentful's audience-segmentation content model and injects targeted heroes, carousels, and pricing tiers based on browser context, without giving up the performance of static HTML. Image optimisation through Next.js <code>Image</code> and CDN-level caching brought LCP from 3.8 s to 1.2 s.</p>
<pre><code class="language-typescript">// ISR product page — marketing-speed publishing, CDN-level performance
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}
</code></pre>`,
    },
    results: {
      heading: "Outcomes",
      body: `
<p>Within 90 days of launch the redesigned storefront delivered measurable business impact across every key metric tracked by the client's analytics team.</p>
<ul>
  <li><strong>+34 %</strong> overall conversion rate improvement</li>
  <li><strong>−41 %</strong> bounce rate reduction</li>
  <li><strong>98 / 91</strong> Lighthouse score (desktop / mobile)</li>
  <li><strong>$2.4 M</strong> attributed annual revenue lift</li>
  <li>Marketing deployment cycle: 3 weeks → same-day</li>
</ul>`,
    },
    testimonial: {
      quote:
        "The team transformed our digital storefront in 12 weeks. We can now react to market trends in hours instead of weeks — and our conversion numbers speak for themselves.",
      author: "Laura Chen",
      role: "VP of Digital, RetailNow",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. HealthBridge — Patient Portal
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cs-002",
    slug: "healthbridge-patient-portal",
    client: "HealthBridge Medical Group",
    projectTitle: "Patient Portal Redesign",
    excerpt:
      "Replaced a decade-old, WCAG-non-compliant patient portal with a fully accessible React application, achieving a 100 Lighthouse accessibility score and 68 % mobile adoption.",
    industry: "healthcare",
    service: "ux-design",
    techStack: ["React", "TypeScript", "GraphQL", "Storybook", "WCAG 2.1 AA", "Jest"],
    year: 2025,
    coverGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    metrics: [
      { label: "Accessibility score", value: "100", sentiment: "positive" },
      { label: "Mobile adoption", value: "+68%", sentiment: "positive" },
      { label: "Support tickets", value: "−62%", sentiment: "positive" },
    ],
    seo: {
      metaTitle: "HealthBridge Patient Portal — Case Study",
      metaDescription:
        "Rebuilding HealthBridge's legacy patient portal with React and WCAG 2.1 AA compliance, achieving a 100 Lighthouse accessibility score and 68 % mobile adoption.",
    },
    challenge: {
      heading: "The Problem",
      body: `
<p>HealthBridge Medical Group's patient portal — used by 180,000 registered patients — was built in 2013 using jQuery and server-side templates. It was WCAG non-compliant, rendering it inaccessible to patients with disabilities, and the mobile experience was effectively non-functional on screens smaller than 1024 px.</p>
<p>Patients with visual impairments could not use a screen reader to navigate appointments or read lab results. Support call volume related to portal usability was consuming 62 % of the help-desk team's capacity. Regulatory risk was escalating as healthcare accessibility requirements tightened.</p>
<ul>
  <li>Zero WCAG 2.1 compliance — multiple critical failures (missing ARIA labels, non-keyboard-navigable widgets)</li>
  <li>0 % functional mobile usage — layout broke below 1024 px</li>
  <li>4.7 / 5 star requirement from patient satisfaction surveys — actual score: 2.1 / 5</li>
  <li>62 % of help-desk volume attributed to portal usability issues</li>
</ul>`,
    },
    solution: {
      heading: "Our Approach",
      body: `
<p>We conducted a full accessibility audit using axe DevTools and NVDA screen-reader testing, cataloguing 147 WCAG 2.1 failures before writing a single line of new code. This became the acceptance-test backlog for the rebuild.</p>
<p>The new portal is a <strong>React + TypeScript</strong> single-page application designed accessibility-first: every interactive component was built in <strong>Storybook</strong> with automated accessibility tests (axe-core) before integration. A custom design token system enforces minimum contrast ratios (4.5:1 normal text, 3:1 large text) across all themes.</p>
<p>Focus management, keyboard navigation, and ARIA live regions were treated as first-class requirements — not retrofitted after the fact. Every component ships with a <code>data-testid</code> and a corresponding Jest + Testing Library spec that includes accessibility assertions.</p>`,
    },
    results: {
      heading: "Outcomes",
      body: `
<p>The portal launched with zero WCAG 2.1 AA violations and a Lighthouse accessibility score of 100. Patient satisfaction rose from 2.1 to 4.7 out of 5 in the first post-launch survey.</p>
<ul>
  <li><strong>100 / 100</strong> Lighthouse accessibility score at launch</li>
  <li><strong>4.7 / 5</strong> patient satisfaction (up from 2.1)</li>
  <li><strong>+68 %</strong> mobile session share within 60 days</li>
  <li><strong>−62 %</strong> usability-related support tickets</li>
  <li>Zero WCAG 2.1 AA violations on third-party audit</li>
</ul>`,
    },
    testimonial: {
      quote:
        "Accessibility was never optional for us — it's a legal and ethical obligation. The team understood that from day one and delivered a portal that every one of our patients can actually use.",
      author: "Dr. Marcus Webb",
      role: "Chief Digital Officer, HealthBridge Medical Group",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. FinEdge — Real-Time Trading Dashboard
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cs-003",
    slug: "finedge-trading-dashboard",
    client: "FinEdge Capital",
    projectTitle: "Real-Time Trading Dashboard",
    excerpt:
      "Built a sub-200 ms real-time trading dashboard with WebSocket feeds, D3 visualisations, and responsive layout — replacing a spreadsheet-driven workflow and boosting trader productivity by 55 %.",
    industry: "finance",
    service: "product-engineering",
    techStack: ["React", "TypeScript", "WebSockets", "D3.js", "Zustand", "React Query"],
    year: 2024,
    coverGradient: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
    metrics: [
      { label: "Data latency", value: "<180 ms", sentiment: "positive" },
      { label: "Trader productivity", value: "+55%", sentiment: "positive" },
      { label: "Uptime", value: "99.97%", sentiment: "positive" },
    ],
    seo: {
      metaTitle: "FinEdge Capital Trading Dashboard — Case Study",
      metaDescription:
        "How we replaced FinEdge Capital's spreadsheet-based workflow with a sub-200 ms real-time React dashboard, boosting trader productivity by 55 %.",
    },
    challenge: {
      heading: "The Problem",
      body: `
<p>FinEdge Capital's 40-person trading desk was managing a multi-billion-dollar portfolio with a combination of Excel spreadsheets and a legacy internal tool last updated in 2017. Market data refreshed every 45 seconds — a lifetime in algorithmic trading. The tool was desktop-only, with no responsive layout and no real-time feed.</p>
<p>Traders were context-switching between four applications to correlate positions, risk metrics, and order books, leading to decision latency that cost the desk an estimated $1.2 M in missed opportunities in the prior fiscal year. A new regulatory requirement mandated audit-trail logging of all trading-decision data within two years.</p>
<ul>
  <li>45-second market-data refresh cycle</li>
  <li>Four-application context switch for position management</li>
  <li>Zero mobile / tablet support</li>
  <li>No structured audit-trail logging for regulatory compliance</li>
</ul>`,
    },
    solution: {
      heading: "Our Approach",
      body: `
<p>We replaced the fragmented toolset with a unified <strong>React + TypeScript</strong> dashboard powered by <strong>WebSocket subscriptions</strong> for real-time market data at sub-200 ms latency. <strong>D3.js</strong> drives the candlestick charts, order-book depth visualisations, and portfolio heat maps — all rendered directly on Canvas for 60 fps performance even during high-volatility sessions.</p>
<p>Global UI state is managed with <strong>Zustand</strong>: lightweight, devtools-compatible, and trivially serialisable for the audit-log requirement. Server state (positions, orders, P&amp;L) is owned by <strong>React Query</strong>, giving traders automatic background refetches and optimistic mutations without boilerplate.</p>
<p>The layout is fully responsive — the same codebase serves the desk's 27" monitors and the portfolio managers' tablets, with a breakpoint-aware column system that reflows from a four-panel desktop view to a single-column mobile drill-down.</p>`,
    },
    results: {
      heading: "Outcomes",
      body: `
<p>The dashboard went live in Q3 2024 after a six-month build with a three-engineer team. Six months post-launch there have been zero critical production incidents.</p>
<ul>
  <li><strong>&lt;180 ms</strong> end-to-end market-data latency (from exchange to UI)</li>
  <li><strong>+55 %</strong> self-reported trader productivity increase (internal survey)</li>
  <li><strong>99.97 %</strong> measured uptime across 26 weeks</li>
  <li><strong>0</strong> critical production bugs in six months post-launch</li>
  <li>Full audit-trail compliance delivered ahead of regulatory deadline</li>
</ul>`,
    },
    testimonial: {
      quote:
        "We went from refreshing a spreadsheet every 45 seconds to having live data at our fingertips. The productivity gain was visible within the first week.",
      author: "James Okafor",
      role: "Head of Equities Trading, FinEdge Capital",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. EduFlow — Adaptive Learning Platform
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cs-004",
    slug: "eduflow-adaptive-learning-platform",
    client: "EduFlow Inc.",
    projectTitle: "Adaptive Learning Platform",
    excerpt:
      "Replaced a monolithic LMS with a headless Next.js + Sanity architecture and PWA offline support, tripling engagement and lifting course-completion rates from 31 % to 89 %.",
    industry: "education",
    service: "platform-architecture",
    techStack: ["Next.js", "React", "Sanity CMS", "TypeScript", "Service Workers", "Vercel Edge"],
    year: 2024,
    coverGradient: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)",
    metrics: [
      { label: "Engagement", value: "3.2×", sentiment: "positive" },
      { label: "Course completion", value: "89%", delta: "+58 pp", sentiment: "positive" },
      { label: "Infrastructure cost", value: "−70%", sentiment: "positive" },
    ],
    seo: {
      metaTitle: "EduFlow Adaptive Learning Platform — Case Study",
      metaDescription:
        "How we replaced EduFlow's monolithic LMS with a headless Next.js + Sanity platform and PWA, tripling engagement and lifting completion rates from 31 % to 89 %.",
    },
    challenge: {
      heading: "The Problem",
      body: `
<p>EduFlow's learning management system served 50,000 students across 14 countries from a single-region server running a monolithic PHP application. Average page load in South-East Asia exceeded eight seconds; course-completion rates sat at 31 %. Educators had no tooling to update content without an engineering ticket.</p>
<p>The platform had no offline capability — a critical gap for learners in regions with intermittent connectivity. Infrastructure costs were scaling linearly with user growth, and the team projected a 3× cost increase to support planned expansion to four new markets.</p>
<ul>
  <li>8+ s page load in distant regions</li>
  <li>31 % course completion rate</li>
  <li>Zero offline / low-bandwidth support</li>
  <li>3-week content publishing cycle requiring engineering involvement</li>
  <li>Infrastructure costs projected to triple on growth plan</li>
</ul>`,
    },
    solution: {
      heading: "Our Approach",
      body: `
<p>We decomposed the monolith into a headless architecture: <strong>Next.js App Router</strong> for the learner frontend, <strong>Sanity Studio</strong> as the headless CMS for educators, and <strong>Vercel Edge Functions</strong> for regionalised content delivery — collapsing average TTFB from 2.1 s to 180 ms globally.</p>
<p>A <strong>Service Worker</strong> strategy based on Workbox pre-caches enrolled course content on first visit, enabling full offline lesson playback. Progress is stored in IndexedDB and synchronised with the server when connectivity resumes — transparent to the learner.</p>
<p>Sanity's GROQ API drives an adaptive content graph: the platform selects and sequences learning modules based on each learner's quiz performance and engagement signals, without any round-trip to a server on each interaction.</p>`,
    },
    results: {
      heading: "Outcomes",
      body: `
<p>The platform launched across all 14 markets simultaneously in Q2 2024. Learner satisfaction and completion metrics improved dramatically within the first semester.</p>
<ul>
  <li><strong>3.2×</strong> average session engagement increase</li>
  <li><strong>89 %</strong> course completion rate (up from 31 %)</li>
  <li><strong>−70 %</strong> monthly infrastructure cost</li>
  <li><strong>180 ms</strong> median TTFB globally (down from 2.1 s)</li>
  <li>Educators publish content changes in minutes, not weeks</li>
</ul>`,
    },
    testimonial: {
      quote:
        "Our learners in rural Indonesia can now complete a full course module on a 2G connection. That's the kind of impact we always wanted to deliver but never thought was technically possible.",
      author: "Priya Nair",
      role: "CEO, EduFlow Inc.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. AutoBrand — Multi-Market Campaign Hub
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cs-005",
    slug: "autobrand-campaign-hub",
    client: "AutoBrand Group",
    projectTitle: "Multi-Market Campaign Hub",
    excerpt:
      "Unified 12 inconsistent regional microsites into a single design-token-driven Next.js platform with Contentful multi-site, collapsing campaign deployment from 8 weeks to 3 days.",
    industry: "automotive",
    service: "campaign-management",
    techStack: ["React", "Next.js", "Contentful", "TypeScript", "Design Tokens", "Chromatic"],
    year: 2023,
    coverGradient: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
    metrics: [
      { label: "Deployment time", value: "3 days", delta: "−94%", sentiment: "positive" },
      { label: "Campaign ROI", value: "+28%", sentiment: "positive" },
      { label: "Brand consistency", value: "100%", sentiment: "positive" },
    ],
    seo: {
      metaTitle: "AutoBrand Multi-Market Campaign Hub — Case Study",
      metaDescription:
        "How we consolidated AutoBrand Group's 12 regional microsites into a unified Next.js + Contentful platform, cutting campaign deployment from 8 weeks to 3 days.",
    },
    challenge: {
      heading: "The Problem",
      body: `
<p>AutoBrand Group operated 12 separate regional microsites across Europe, each maintained by a different agency with its own tech stack, design language, and CMS. A single campaign launch — synchronising hero banners, pricing overlays, legal copy, and regional CTAs across all markets — required 8 weeks of coordination and invariably shipped with visual inconsistencies.</p>
<p>Brand audits consistently flagged colour-value drift, typographic inconsistency, and image-ratio mismatches between markets. Three agencies used different accessibility standards; two sites were WCAG non-compliant. Marketing leadership had no visibility into campaign performance across regions from a single interface.</p>
<ul>
  <li>12 separate codebases across 5 agencies</li>
  <li>8-week average time-to-market for cross-regional campaigns</li>
  <li>Documented brand inconsistencies in every quarterly audit</li>
  <li>No unified analytics or campaign-performance view</li>
</ul>`,
    },
    solution: {
      heading: "Our Approach",
      body: `
<p>We consolidated all 12 sites into a single <strong>Next.js</strong> monorepo with a shared <strong>React component library</strong> governed by a W3C Design Tokens Community Group-compliant token system. Every spacing value, colour, radius, and typographic scale is defined once in platform-agnostic JSON and compiled to CSS custom properties — guaranteeing visual consistency across markets at the token level.</p>
<p><strong>Contentful's multi-site</strong> capability gives each regional marketing team its own content space while sharing a global component and template library. A campaign can be authored once, localised per-market, and published simultaneously to all 12 regions in a single workflow — no engineering involvement required after initial template setup.</p>
<p><strong>Chromatic</strong> visual regression testing runs on every pull request, catching any unintended style changes before they reach a staging environment. The result is a design system with a documented, auditable, and enforceable standard.</p>`,
    },
    results: {
      heading: "Outcomes",
      body: `
<p>All five priority markets launched on the new platform within six months. The campaign deployment cycle compressed from eight weeks to three days; the most recent quarterly brand audit returned zero consistency violations for the first time in AutoBrand's recorded history.</p>
<ul>
  <li><strong>3 days</strong> campaign deployment cycle (down from 8 weeks)</li>
  <li><strong>+28 %</strong> campaign ROI across unified markets</li>
  <li><strong>100 %</strong> brand consistency score on independent audit</li>
  <li><strong>5 markets</strong> launched simultaneously on a single platform</li>
  <li>Marketing team publishes campaigns independently — zero engineering tickets</li>
</ul>`,
    },
    testimonial: {
      quote:
        "For the first time in five years, I can look at all twelve of our regional sites and see the same brand. That consistency directly drives the trust our customers place in us.",
      author: "Stefan Müller",
      role: "Global Head of Digital Marketing, AutoBrand Group",
    },
  },
];
