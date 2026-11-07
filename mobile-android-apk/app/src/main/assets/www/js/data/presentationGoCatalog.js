/**
 * ============================================================================
 * GIRI ORBIT / GIRI KINETIC — PRESENTATIONGO & PRESENTATION TEMPLATES REPOSITORY
 * Inspired by PresentationGO (https://www.presentationgo.com/)
 * ============================================================================
 * Extensive library of 3,500+ presentation templates, diagrams, and Executive presentation decks:
 * - Executive Presentation Decks (Executive Pitch, Annual Report, AI & DeepTech, Minimalist, Healthcare, etc.)
 * - Processes & Steps (4-Phase Circular Loop, 5-Step Zigzag Diamond, Chevron Flow, Linear Cards)
 * - Timelines & Roadmaps (Winding Milestone Road, Horizontal Milestones, Chronological Tracks)
 * - Matrix & SWOT (Strategic 2x2 SWOT Matrix, Eisenhower Priority Matrix, BCG Matrix)
 * - Pyramids & Hierarchy (Maslow 5-Tier Hierarchy Pyramid, Capability Stepped Tiers)
 * - Funnels & Pipelines (Sales & Marketing Conversion Funnel, Lead Qualification Pipeline)
 * - Charts & Diagrams (Radial 6-Spoke Concept Hub, 3-Circle Venn Diagram, Gears & Cycles)
 * - Tables & Pricing (3-Tier Enterprise Pricing Matrix, Feature Scorecards)
 * - Themes & Palettes (Modern Minimalist, Obsidian Tech, Corporate Navy, Emerald, Crimson)
 */

export const PRESENTATION_GO_CATEGORIES = [
  { id: 'all', label: 'All Templates (3,500+)' },
  { id: 'presentation', label: 'Executive Presentation Decks' },
  { id: 'processes', label: 'Processes & Steps' },
  { id: 'timelines', label: 'Timelines & Roadmaps' },
  { id: 'matrix', label: 'Matrix & SWOT' },
  { id: 'pyramids', label: 'Pyramids & Hierarchy' },
  { id: 'funnels', label: 'Funnels & Pipelines' },
  { id: 'diagrams', label: 'Charts & Diagrams' },
  { id: 'tables', label: 'Tables & Pricing' },
  { id: 'themes', label: 'Themes & Palettes' }
];

export const PRESENTATION_GO_COLORS = [
  { id: 'all', label: 'All Colors', hex: '#64748b' },
  { id: 'blue', label: 'Sapphire Blue', hex: '#2563eb' },
  { id: 'green', label: 'Emerald Green', hex: '#059669' },
  { id: 'red', label: 'Crimson Red', hex: '#dc2626' },
  { id: 'purple', label: 'Violet Purple', hex: '#7c3aed' },
  { id: 'cyan', label: 'Teal & Cyan', hex: '#0891b2' },
  { id: 'amber', label: 'Amber & Gold', hex: '#d97706' },
  { id: 'dark', label: 'Obsidian Dark', hex: '#18181b' }
];

export const PRESENTATION_GO_STEP_FILTERS = [
  { id: 'all', label: 'All Steps' },
  { id: '3', label: '3 Steps' },
  { id: '4', label: '4 Steps' },
  { id: '5', label: '5 Steps' },
  { id: '6', label: '6+ Steps' }
];

// Curated Landmark Visual Diagrams & Authentic Executive Presentation Decks
const CURATED_LANDMARKS = [
  // ==========================================================================
  // 1. OFFICIAL PRESENTATIONGO PRESENTATION TEMPLATES (EXACT MATCH TO USER SCREENSHOTS)
  // ==========================================================================
  {
    id: 'pgo-golden-light-prestige',
    name: 'Golden Light Prestige Template',
    category: 'presentation',
    categoryLabel: 'Templates',
    subCategories: ['Templates', 'Themes'],
    diagramType: 'presentation-collage',
    themeStyle: 'golden-light',
    optionsText: '6 slides',
    steps: 6,
    color: 'amber',
    previewAccent: '#eab308',
    desc: 'Elevate your executive presentations with luxurious golden light waves and elegant typography. Perfect for high-stakes corporate briefings, luxury brands, and investor pitches.',
    tags: ['template', 'golden', 'prestige', 'presentation', 'deck', 'google slides', '6 slides', 'luxury', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'EXECUTIVE BRIEFING',
        title: 'Golden Light Prestige',
        desc: 'Sovereign Presentation Architecture & Executive Strategy',
        features: [
          { num: '01', title: 'Prestige Design', desc: 'Curated typography with luminous gold vectors' },
          { num: '02', title: 'High Impact', desc: 'Optimized for high-stakes venture and boardroom delivery' },
          { num: '03', title: '16:9 Widescreen', desc: 'Pixel-perfect cinematic widescreen stage layout' }
        ],
        notes: 'Welcome stakeholders to the Golden Light Prestige showcase.'
      },
      {
        id: 2, layout: 'columns', tag: 'AGENDA & ROADMAP',
        title: 'Strategic Priorities 2026',
        desc: 'Key milestones guiding our enterprise digital expansion.',
        features: [
          { num: 'Section I', title: 'Market Opportunity', desc: 'Unlocking $48B in sovereign corporate data sovereignty' },
          { num: 'Section II', title: 'Core Technology', desc: 'Zero-cloud in-memory client execution engine' },
          { num: 'Section III', title: 'Commercial Velocity', desc: 'Direct-to-enterprise subscription licensing' }
        ],
        notes: 'Review the three core agenda items before opening discussion.'
      },
      {
        id: 3, layout: 'metrics', tag: 'KEY PERFORMANCE INDICATORS',
        title: 'Breakthrough Market Traction',
        desc: 'Sustained acceleration across all enterprise subsidiary cohorts.',
        features: [
          { num: '99.98%', title: 'Uptime Reliability', desc: 'Air-gapped edge execution runtime' },
          { num: '3.8x', title: 'Throughput Lift', desc: 'Compared to legacy cloud-dependent software' },
          { num: '100%', title: 'Client Sovereignty', desc: 'Zero external telemetry or database logging' }
        ],
        notes: 'Highlight performance and security benchmarks.'
      },
      {
        id: 4, layout: 'milestone-road', diagramType: 'milestone-road', tag: 'EXECUTION TIMELINE',
        title: 'Multi-Horizon Execution Journey',
        desc: 'Sequential delivery milestones guiding our multi-year digital transformation.',
        features: [
          { num: '01', title: 'Q1 Launch', desc: 'Core platform deployment' },
          { num: '02', title: 'Q2 Scale', desc: 'Subsidiary roll-out' },
          { num: '03', title: 'Q3 Ecosystem', desc: '3,500+ templates library' },
          { num: '04', title: 'Q4 Sovereign', desc: 'Air-gapped compliance sign-off' }
        ],
        notes: 'Walk through each delivery horizon.'
      },
      {
        id: 5, layout: 'columns', tag: 'PORTFOLIO MATURITY',
        title: 'Sovereign Advantage vs Legacy Suites',
        desc: 'Direct architectural comparison across performance and security axes.',
        features: [
          { num: 'Privacy', title: 'Zero Cloud Logging', desc: '100% in-browser memory execution' },
          { num: 'Latency', title: 'Sub-Millisecond', desc: 'No network round-trips for document edits' },
          { num: 'Openness', title: 'Universal Export', desc: 'Full native PPTX, DOCX, XLSX, and PDF parity' }
        ],
        notes: 'Emphasize architectural differentiation.'
      },
      {
        id: 6, layout: 'title', tag: 'CONCLUSION',
        title: 'Thank You // Questions & Discussion',
        desc: 'Empowering enterprise thought with Giri Orbit & Giri Kinetic.',
        features: [
          { num: 'Web', title: 'giri-orbit.local', desc: 'Connect to private instance' },
          { num: 'Email', title: 'executive@giri.com', desc: 'Direct corporate inquiries' },
          { num: 'HQ', title: 'Giri Tower', desc: 'Sovereign Global Research Labs' }
        ],
        notes: 'Open floor for questions from partners.'
      }
    ]
  },
  {
    id: 'pgo-abstract-teal-flow',
    name: 'Abstract Teal Flow Template',
    category: 'presentation',
    categoryLabel: 'Templates',
    subCategories: ['Templates', 'Themes'],
    diagramType: 'presentation-collage',
    themeStyle: 'teal-flow',
    optionsText: '6 slides',
    steps: 6,
    color: 'cyan',
    previewAccent: '#06b6d4',
    desc: 'Sleek and modern presentation theme featuring fluid abstract teal ribbons. Designed for technology startups, design agencies, and innovative enterprise reviews.',
    tags: ['template', 'abstract', 'teal', 'flow', 'presentation', 'deck', 'google slides', '6 slides', 'cyan', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'TECHNOLOGY BRIEF',
        title: 'Abstract Teal Flow',
        desc: 'Fluid Dynamics & High-Velocity Engineering Deck',
        features: [
          { num: '01', title: 'Fluid Motion', desc: 'Dynamic vector flow ribbons with cyan gradients' },
          { num: '02', title: 'Tech Modern', desc: 'Clean sans-serif typography tailored for engineers' },
          { num: '03', title: '6 Layouts', desc: 'Complete multi-slide layout collection' }
        ],
        notes: 'Introduce the tech stack and engineering philosophy.'
      },
      {
        id: 2, layout: 'columns', tag: 'PRODUCT PILLARS',
        title: 'Core Architectural Pillars',
        desc: 'Modular software design built for resilience and zero latency.',
        features: [
          { num: 'Pillar A', title: 'In-Memory Compute', desc: 'High-speed buffer caches without database locks' },
          { num: 'Pillar B', title: 'Vector Pipeline', desc: 'GPU accelerated 60fps canvas rendering' },
          { num: 'Pillar C', title: 'Cryptographic Storage', desc: 'Local air-gapped file preservation' }
        ],
        notes: 'Walk engineering teams through each pillar.'
      },
      {
        id: 3, layout: 'metrics', tag: 'SYSTEM METRICS',
        title: 'Real-Time Telemetry & SLA',
        desc: 'Measured across 100,000 stress-tested browser sessions.',
        features: [
          { num: '< 16ms', title: 'Frame Budget', desc: 'Strict 60 FPS motion smoothness' },
          { num: '0 KB', title: 'Data Leaked', desc: 'Zero tracking or external telemetry' },
          { num: '12x', title: 'Load Speed', desc: 'Instant edge startup with local cache' }
        ],
        notes: 'Review the technical benchmarks.'
      },
      {
        id: 4, layout: 'circular-loop', diagramType: 'circular-loop', tag: 'DEVELOPMENT LIFECYCLE',
        title: 'Continuous Continuous Delivery Cycle',
        desc: '4-Phase continuous loop ensuring rapid bug fixes and smooth updates.',
        features: [
          { num: 'Phase 1', title: 'Audit & Telemetry', desc: 'Identify bottlenecks in real time' },
          { num: 'Phase 2', title: 'Build & Optimize', desc: 'Compile to WebAssembly bytecode' },
          { num: 'Phase 3', title: 'Verify & Test', desc: 'Full automated regression suites' },
          { num: 'Phase 4', title: 'Deploy Edge', desc: 'Instant client PWA deployment' }
        ],
        notes: 'Highlight our deployment speed.'
      },
      {
        id: 5, layout: 'columns', tag: 'ECOSYSTEM INTEGRATION',
        title: 'Universal Suite Integration',
        desc: 'Drift, Axis, Kinetic, and PDF Studio unified in one window.',
        features: [
          { num: 'Drift', title: 'Document Editor', desc: 'Rich A4 typographic layout engine' },
          { num: 'Axis', title: 'Data Sheets', desc: 'Real-time financial formula grid' },
          { num: 'Kinetic', title: 'Slide Studio', desc: 'Cinematic widescreen presentations' }
        ],
        notes: 'Demonstrate suite synergy.'
      },
      {
        id: 6, layout: 'title', tag: 'WRAP UP',
        title: 'Accelerate Your Workflow Today',
        desc: 'Thank you for exploring the Abstract Teal Flow template.',
        features: [
          { num: 'Docs', title: 'docs.giri.orbit', desc: 'Read the developer guide' },
          { num: 'GitHub', title: 'github.com/giri', desc: 'Explore open source modules' }
        ],
        notes: 'Conclude presentation.'
      }
    ]
  },
  {
    id: 'pgo-neon-data-waves',
    name: 'Neon Data Waves Template',
    category: 'presentation',
    categoryLabel: 'Templates',
    subCategories: ['Templates', 'Themes'],
    diagramType: 'presentation-collage',
    themeStyle: 'neon-waves',
    optionsText: '6 slides',
    steps: 6,
    color: 'purple',
    previewAccent: '#a855f7',
    desc: 'Dynamic high-tech presentation deck powered by glowing neon wireframes and cybernetic waves. Engineered for AI research, cybersecurity, and deep-tech briefings.',
    tags: ['template', 'neon', 'cyber', 'data', 'waves', 'presentation', 'deck', 'google slides', '6 slides', 'purple', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'FRONTIER AI',
        title: 'Neon Data Waves',
        desc: 'Next-Generation Cybernetic Computing & Neural Intelligence',
        features: [
          { num: '01', title: 'Cybernetic Mesh', desc: '3D glowing neon wave wireframes' },
          { num: '02', title: 'AI & Frontier', desc: 'Designed for neural tech & security briefings' },
          { num: '03', title: '6 Dark Slides', desc: 'High-contrast obsidian background' }
        ],
        notes: 'Introduce deep-tech AI research initiatives.'
      },
      {
        id: 2, layout: 'columns', tag: 'NEURAL INFRASTRUCTURE',
        title: 'Decentralized Neural Fabric',
        desc: 'Client-side machine learning inference powered by WebGPU shaders.',
        features: [
          { num: 'Shader A', title: 'Attention Matrices', desc: 'Accelerated transformer compute on local silicon' },
          { num: 'Shader B', title: 'Vector Quantization', desc: 'Sub-4-bit weights footprint with near-zero loss' },
          { num: 'Shader C', title: 'Zero Telemetry', desc: 'Prompts stay 100% confidential in GPU RAM' }
        ],
        notes: 'Review neural runtime architecture.'
      },
      {
        id: 3, layout: 'metrics', tag: 'VELOCITY BENCHMARKS',
        title: 'Token Speed & Inference Throughput',
        desc: 'Real-time performance on consumer and enterprise hardware.',
        features: [
          { num: '240 t/s', title: 'Generation Rate', desc: 'WebGPU float16 speed' },
          { num: '1.2 GB', title: 'RAM Allocation', desc: 'Ultra-lightweight edge footprint' },
          { num: '0 ms', title: 'API Network Wait', desc: 'Instant offline synthesis' }
        ],
        notes: 'Demonstrate token latency gains.'
      },
      {
        id: 4, layout: 'swot-matrix', diagramType: 'swot-matrix', tag: 'STRATEGIC MATRIX',
        title: 'Frontier AI Strategic SWOT Analysis',
        desc: 'Evaluating strengths and opportunities in decentralized client AI.',
        features: [
          { num: 'S', title: 'Edge Autonomy', desc: 'Zero dependency on central server APIs' },
          { num: 'W', title: 'Hardware Variance', desc: 'Different GPU shader driver capabilities' },
          { num: 'O', title: 'Sovereign Markets', desc: 'Defense, healthcare, and enterprise demand' },
          { num: 'T', title: 'Cloud Monopolies', desc: 'Aggressive pricing from hyperscalers' }
        ],
        notes: 'Walk board through the strategic landscape.'
      },
      {
        id: 5, layout: 'columns', tag: 'COMMERCIALIZATION',
        title: 'Enterprise Deployment Horizons',
        desc: 'Direct subscription licensing with air-gapped node verification.',
        features: [
          { num: 'Tier 1', title: 'Workstation PWA', desc: 'Local browser installation with instant offline mode' },
          { num: 'Tier 2', title: 'Corporate Private Edge', desc: 'Dedicated self-hosted container instance' },
          { num: 'Tier 3', title: 'Cryptographic Sovereign', desc: 'Air-gapped security for defense and M&A' }
        ],
        notes: 'Review enterprise tiers.'
      },
      {
        id: 6, layout: 'title', tag: 'FINALE',
        title: 'Pioneering the Sovereign Edge',
        desc: 'Thank you for reviewing the Neon Data Waves presentation.',
        features: [
          { num: 'Security', title: 'airgap.giri.orbit', desc: 'Inspect security whitepaper' },
          { num: 'Access', title: 'partner@giri.com', desc: 'Request enterprise evaluation' }
        ],
        notes: 'Conclude presentation and open for Q&A.'
      }
    ]
  },

  // ==========================================================================
  // 2. AUTHENTIC PRESENTATIONGO VECTOR DIAGRAM TEMPLATES
  // ==========================================================================
  {
    id: 'pgo-milestone-road-journey',
    name: 'Milestone Road Journey',
    category: 'timelines',
    categoryLabel: 'Charts & Diagrams',
    subCategories: ['Charts & Diagrams', 'Timelines & Roadmaps', '4 options'],
    diagramType: 'milestone-road',
    optionsText: '4 options',
    steps: 4,
    color: 'amber',
    previewAccent: '#d97706',
    desc: 'Winding asphalt perspective road roadmap with 4 colorful milestone pin markers (01 Blue, 02 Green, 03 Yellow, 04 Red) and editable callout boxes for chronological progression.',
    tags: ['charts & diagrams', 'timelines', 'road', 'journey', 'milestones', '4 options', 'google slides', 'pptx', 'global'],
    slides: [
      {
        id: 1, layout: 'milestone-road', diagramType: 'milestone-road', tag: 'TIMELINE // ROADMAP',
        title: 'Strategic Horizon Journey',
        desc: 'Winding chronological journey mapping our core enterprise milestones from initial audit to global delivery.',
        features: [
          { num: '01', title: 'Discovery & Audit', desc: 'Comprehensive telemetry synthesis and baseline security certification.' },
          { num: '02', title: 'Prototyping Sprint', desc: 'Rapid iterative component modeling with in-memory execution.' },
          { num: '03', title: 'Quality Assurance', desc: 'Full automated regression testing and sub-millisecond latency audit.' },
          { num: '04', title: 'Sovereign Launch', desc: 'Zero-cloud air-gapped deployment to global enterprise workstations.' }
        ],
        notes: 'Present the four sequential milestones along the winding road.'
      }
    ]
  },
  {
    id: 'pgo-pentagon-flag-process',
    name: 'Pentagon Flag Process',
    category: 'processes',
    categoryLabel: 'Charts & Diagrams',
    subCategories: ['Charts & Diagrams', 'Processes & Steps', '3 options'],
    diagramType: 'pentagon-flags',
    optionsText: '3 options',
    steps: 3,
    color: 'blue',
    previewAccent: '#7c3aed',
    desc: 'Three hanging banner ribbons with downward chevron cuts and bold numbers (1, 2, 3). Perfect for linear 3-step workflows, core principles, and execution pillars.',
    tags: ['charts & diagrams', 'processes', 'pentagon', 'flags', 'ribbons', 'banners', '3 options', 'google slides', 'pptx', 'global'],
    slides: [
      {
        id: 1, layout: 'pentagon-flags', diagramType: 'pentagon-flags', tag: 'PROCESS // 3 STEPS',
        title: '3-Stage Flag Process Workflow',
        desc: 'Structured 3-step execution framework represented by colorful hanging pentagon banner ribbons.',
        features: [
          { num: '1', title: 'Discover & Strategize', desc: 'Audit organizational workflows and identify legacy SaaS bottlenecks.' },
          { num: '2', title: 'Develop & Validate', desc: 'Deploy high-velocity in-memory prototypes with zero database overhead.' },
          { num: '3', title: 'Deliver & Scale', desc: 'Roll out verified air-gapped sovereign packages across enterprise nodes.' }
        ],
        notes: 'Walk audience through each hanging banner from Flag 1 to Flag 3.'
      }
    ]
  },
  {
    id: 'pgo-hand-drawn-speech-bubbles',
    name: 'Hand-Drawn Speech Bubbles',
    category: 'diagrams',
    categoryLabel: 'Charts & Diagrams',
    subCategories: ['Charts & Diagrams', 'Text & Tables', '3 options'],
    diagramType: 'speech-bubbles',
    optionsText: '3 options',
    steps: 3,
    color: 'green',
    previewAccent: '#10b981',
    desc: 'Set of 3 hand-drawn quote speech bubbles with sketch outlines and soft fill colors. Ideal for customer testimonials, quotes, feedback, and conversational talking points.',
    tags: ['charts & diagrams', 'text & tables', 'speech bubbles', 'hand drawn', 'quotes', 'testimonials', '3 options', 'google slides', 'pptx', 'global'],
    slides: [
      {
        id: 1, layout: 'speech-bubbles', diagramType: 'speech-bubbles', tag: 'TESTIMONIALS // QUOTES',
        title: 'Executive Client Testimonials',
        desc: 'Direct insights from Fortune 500 technology leaders deployed on Giri Orbit.',
        features: [
          { num: '01', title: 'Chief Technology Officer', desc: '“Giri Orbit eliminated 80% of our cloud SaaS bloat while ensuring complete air-gapped security for our confidential M&A documents.”' },
          { num: '02', title: 'VP of Product Engineering', desc: '“The speed of in-memory editing in Kinetic and Axis is unlike anything on the web. Our team cannot imagine returning to slow legacy tools.”' },
          { num: '03', title: 'Head of Global Compliance', desc: '“Having zero telemetry and cryptographic PDF verification in Aegis made our ISO 27001 audit an absolute breeze.”' }
        ],
        notes: 'Read key quotes to emphasize user satisfaction and enterprise validation.'
      }
    ]
  },
  {
    id: 'pgo-gears-process-diagram',
    name: 'Gears Process Diagram',
    category: 'processes',
    categoryLabel: 'Charts & Diagrams',
    subCategories: ['Charts & Diagrams', 'Processes & Steps', '3 options'],
    diagramType: 'gears-process',
    optionsText: '3 options',
    steps: 3,
    color: 'cyan',
    previewAccent: '#0891b2',
    desc: 'Three interlocking colorful mechanical gears illustrating how interconnected systems, teams, or processes operate in seamless synchronization.',
    tags: ['charts & diagrams', 'processes', 'gears', 'interlocking', 'sync', '3 options', 'global'],
    slides: [
      {
        id: 1, layout: 'gears-process', diagramType: 'gears-process', tag: 'SYNCHRONIZATION // GEARS',
        title: 'Interlocking Operational Engine',
        desc: 'Three synchronized operational components driving enterprise velocity and execution.',
        features: [
          { num: '01', title: 'Strategy & Vision', desc: 'Clear corporate roadmaps driving unified execution focus.' },
          { num: '02', title: 'Agile Engineering', desc: 'High-speed in-memory prototyping and rapid feature releases.' },
          { num: '03', title: 'Client Feedback', desc: 'Continuous telemetry feedback loop keeping products relevant.' }
        ],
        notes: 'Explain how each gear tooth drives the adjacent mechanism.'
      }
    ]
  },
  {
    id: 'pgo-3d-funnel-pipeline',
    name: '3D Funnel Pipeline Diagram',
    category: 'funnels',
    categoryLabel: 'Charts & Diagrams',
    subCategories: ['Charts & Diagrams', 'Funnels & Pipelines', '4 options'],
    diagramType: 'funnel-stages',
    optionsText: '4 options',
    steps: 4,
    color: 'amber',
    previewAccent: '#d97706',
    desc: 'Four-stage 3D sales and customer conversion funnel illustrating stage-gate qualification, attrition rates, and bottom-line customer acquisition.',
    tags: ['charts & diagrams', 'funnels', 'pipeline', 'sales', 'conversion', '4 options', 'global'],
    slides: [
      {
        id: 1, layout: 'funnel-stages', diagramType: 'funnel-stages', tag: 'FUNNEL // PIPELINE',
        title: 'Enterprise Client Conversion Funnel',
        desc: 'Stage-by-stage progression from initial sovereign awareness to enterprise contract signing.',
        features: [
          { num: '100%', title: 'Stage 1: Awareness', desc: '150,000 unique organic visitors evaluating zero-cloud suite' },
          { num: '42%', title: 'Stage 2: Engagement', desc: '63,000 active monthly users testing templates and files' },
          { num: '18%', title: 'Stage 3: Procurement', desc: '27,000 organizations initiating security and compliance reviews' },
          { num: '7.5%', title: 'Stage 4: Sovereign License', desc: '11,250 enterprise contracts deployed on dedicated nodes' }
        ],
        notes: 'Walk executive committee through the funnel conversion metrics.'
      }
    ]
  },
  {
    id: 'pgo-hexagon-honeycomb-matrix',
    name: 'Hexagon Honeycomb Strategy Matrix',
    category: 'matrix',
    categoryLabel: 'Charts & Diagrams',
    subCategories: ['Charts & Diagrams', 'Matrix & SWOT', '6 options'],
    diagramType: 'hexagon-cluster',
    optionsText: '6 options',
    steps: 6,
    color: 'blue',
    previewAccent: '#3b82f6',
    desc: 'Six-cell hexagonal honeycomb cluster representing modular capabilities, organizational competencies, or strategic business units.',
    tags: ['charts & diagrams', 'matrix', 'hexagon', 'honeycomb', 'cluster', '6 options', 'global'],
    slides: [
      {
        id: 1, layout: 'hexagon-cluster', diagramType: 'hexagon-cluster', tag: 'MATRIX // HONEYCOMB',
        title: '6-Pillar Modular Enterprise Architecture',
        desc: 'Interconnected hexagon cells representing our sovereign suite capabilities.',
        features: [
          { num: '01', title: 'Drift Writer', desc: 'Word processor' },
          { num: '02', title: 'Axis Matrix', desc: 'Spreadsheet engine' },
          { num: '03', title: 'Kinetic Stage', desc: 'Slide studio' },
          { num: '04', title: 'Aegis PDF', desc: 'Cryptographic sealing' },
          { num: '05', title: 'Universal Bridge', desc: 'File converter' },
          { num: '06', title: 'Local Vault', desc: 'Zero-cloud storage' }
        ],
        notes: 'Describe how the honeycomb geometry reflects architectural synergy.'
      }
    ]
  },

  // ==========================================================================
  // 3. COMPLETE AUTHENTIC PRESENTATION PRESENTATION TEMPLATES (8-10 SLIDES EACH)
  // ==========================================================================
  {
    id: 'ppt-deck-annual-report',
    name: 'Corporate Business Annual Report Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'corporate-navy',
    optionsText: '10 slides',
    steps: 10,
    color: 'blue',
    previewAccent: '#2563eb',
    desc: 'Official 10-slide presentation deck template for annual fiscal reviews, shareholder reports, CEO letters, financial statements, and multi-year executive targets.',
    tags: ['presentation', 'deck', 'annual report', 'corporate', 'finance', 'pptx', '10 slides', 'executive', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'ANNUAL REPORT FY26',
        title: 'Global Enterprise Fiscal Review',
        desc: 'Resilient Growth, Technological Sovereignty & Record Shareholder Value',
        features: [
          { num: '01', title: 'Executive Summary', desc: 'Comprehensive financial & operational audit' },
          { num: '02', title: 'Global Footprint', desc: 'Serving 4,200 enterprise customers worldwide' },
          { num: '03', title: '100% Sovereign', desc: 'Zero-cloud in-memory client architecture' }
        ],
        notes: 'Welcome shareholders and board members to the Annual General Review.'
      },
      {
        id: 2, layout: 'columns', tag: 'STRATEGIC HIGHLIGHTS',
        title: 'Executive Letter from the Chief Executive',
        desc: 'Navigating macro headwinds while accelerating proprietary technology moats.',
        features: [
          { num: 'Pillar I', title: 'Margin Expansion', desc: 'Gross margin expanded 480 bps to 88.4% through local computing' },
          { num: 'Pillar II', title: 'Client Sovereignty', desc: 'Achieved zero data exfiltration incidents across all Fortune 500 accounts' },
          { num: 'Pillar III', title: 'Ecosystem Scale', desc: 'Over 3,500+ institutional templates delivered to global teams' }
        ],
        notes: 'Deliver the core strategic takeaways from the CEO letter.'
      },
      {
        id: 3, layout: 'metrics', tag: 'FINANCIAL PERFORMANCE',
        title: 'Record Profitability & Cash Flow',
        desc: 'Key financial metrics demonstrating disciplined capital allocation.',
        features: [
          { num: '$84.5M', title: 'Operating Revenue', desc: '+42% YoY organic acceleration' },
          { num: '38.2%', title: 'Free Cash Flow Margin', desc: 'Industry-leading cash conversion' },
          { num: '142%', title: 'Net Revenue Retention', desc: 'Negative gross customer churn' }
        ],
        notes: 'Review the key financial KPIs and unit economics.'
      },
      {
        id: 4, layout: 'columns', tag: 'BUSINESS SEGMENTS',
        title: 'Multi-Division Operating Performance',
        desc: 'Performance breakdown across Enterprise Software, Sovereign Cloud & Edge Hardware.',
        features: [
          { num: 'Enterprise Soft', title: '$48.2M ARR', desc: 'Core productivity suite: Drift, Axis, Kinetic' },
          { num: 'Sovereign Cloud', title: '$24.1M ARR', desc: 'Air-gapped private corporate node licensing' },
          { num: 'Aegis Security', title: '$12.2M ARR', desc: 'Cryptographic document PKI and verification' }
        ],
        notes: 'Explain segment contributions to total revenue.'
      },
      {
        id: 5, layout: 'milestone-road', diagramType: 'milestone-road', tag: 'OPERATIONAL ROADMAP',
        title: 'Multi-Horizon Strategic Roadmap',
        desc: 'Strategic operational priorities guiding delivery through fiscal 2027.',
        features: [
          { num: 'Q1', title: 'Kernel Speed', desc: 'Wasm compute optimization' },
          { num: 'Q2', title: 'Mobile PWA', desc: 'Offline tablet touch engine' },
          { num: 'Q3', title: 'Enterprise AI', desc: 'Local quantized neural co-pilot' },
          { num: 'Q4', title: 'Global Edge', desc: 'Zero-trust distributed node sync' }
        ],
        notes: 'Review the multi-horizon roadmap with delivery milestones.'
      },
      {
        id: 6, layout: 'columns', tag: 'CORPORATE GOVERNANCE',
        title: 'Board Governance & ESG Commitment',
        desc: 'Independent board oversight, statutory compliance and net-zero commitments.',
        features: [
          { num: '100%', title: 'Statutory Compliance', desc: 'Zero regulatory non-conformances in FY26' },
          { num: 'Net Zero', title: 'Carbon Footprint', desc: '100% green renewable edge server execution' },
          { num: 'Independent', title: 'Audit Committee', desc: 'Rigorous quarterly external financial reviews' }
        ],
        notes: 'Emphasize governance standards to institutional investors.'
      },
      {
        id: 7, layout: 'columns', tag: 'CAPITAL STRUCTURE',
        title: 'Balance Sheet Strength & Reserves',
        desc: 'Prudent debt management and high-liquidity treasury reserves.',
        features: [
          { num: '$65M', title: 'Cash & Short-Term Reserves', desc: 'Ample runway for accretive strategic M&A' },
          { num: 'Zero', title: 'Funded Long-Term Debt', desc: 'Complete sovereign balance sheet freedom' },
          { num: 'AAA', title: 'Credit & Reliability Rating', desc: 'Highest institutional counterparty ranking' }
        ],
        notes: 'Highlight our fortress balance sheet.'
      },
      {
        id: 8, layout: 'columns', tag: 'LEADERSHIP',
        title: 'Executive Leadership Team',
        desc: 'Experienced operators with decades of deep software and enterprise leadership.',
        features: [
          { num: 'CEO', title: 'Abhinav Giri', desc: 'Founder & Chief Executive Officer' },
          { num: 'CTO', title: 'Chief Architect', desc: 'Head of WebAssembly & Core Systems' },
          { num: 'CFO', title: 'VP of Finance', desc: 'Capital Markets & Corporate Strategy' }
        ],
        notes: 'Introduce the executive leadership committee.'
      },
      {
        id: 9, layout: 'columns', tag: 'OUTLOOK FY27',
        title: 'Strategic Priorities for Fiscal 2027',
        desc: 'Targeting $120M ARR with sustained gross margins exceeding 85%.',
        features: [
          { num: 'Growth Target', title: '$120M ARR', desc: 'Driven by Fortune 500 expansion' },
          { num: 'Product Vision', title: 'Kinetic 3.0', desc: 'Next-gen motion graphics & 3D canvases' },
          { num: 'Global Reach', title: 'EMEA & APAC', desc: 'Expanded direct corporate sales hubs' }
        ],
        notes: 'Set the forward-looking guidance for fiscal 2027.'
      },
      {
        id: 10, layout: 'title', tag: 'CONCLUSION',
        title: 'Thank You // Annual Shareholder Q&A',
        desc: 'Investor Relations: ir@giri.com // www.giri-orbit.local',
        features: [
          { num: 'IR', title: 'ir@giri.com', desc: 'Direct shareholder inquiries' },
          { num: 'Reports', title: 'annual.giri.orbit', desc: 'Download audited 10-K filing' },
          { num: 'Call', title: '1-800-GIRI-CORP', desc: 'Conference bridge replay' }
        ],
        notes: 'Open the floor for shareholder questions.'
      }
    ]
  },
  {
    id: 'ppt-deck-unicorn-pitch',
    name: 'Unicorn Venture Capital Pitch Deck Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'crimson-venture',
    optionsText: '10 slides',
    steps: 10,
    color: 'red',
    previewAccent: '#dc2626',
    desc: 'High-impact 10-slide investor pitch deck engineered for Series A/B venture capital rounds, highlighting unfair advantage, market size, and hockey-stick traction.',
    tags: ['presentation', 'deck', 'pitch', 'venture capital', 'series a', 'series b', 'startup', '10 slides', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'VENTURE BRIEFING',
        title: 'Giri Orbit // Sovereign Productivity Cloud',
        desc: 'Reinventing Enterprise Software: In-Memory Computing with Sub-Millisecond Speed',
        features: [
          { num: '$30M', title: 'Series B Raise', desc: 'Lead investor allocation & expansion round' },
          { num: '340%', title: 'YoY Growth', desc: 'Explosive enterprise adoption' },
          { num: '$120B', title: 'Total Addressable Market', desc: 'Replacing legacy cloud suites globally' }
        ],
        notes: 'Capture partner attention immediately with traction and vision.'
      },
      {
        id: 2, layout: 'columns', tag: 'THE PROBLEM',
        title: 'Enterprise Software is Sluggish & Leaky',
        desc: 'Knowledge workers lose 2.4 hours daily to bloated, latency-heavy cloud web apps.',
        features: [
          { num: 'Latency', title: 'Cloud Bloat', desc: 'Average web app requires 85 HTTP round-trips just to type a sentence' },
          { num: 'Privacy', title: 'Data Leaks', desc: 'Confidential M&A files and corporate data sent across third-party servers' },
          { num: 'Lock-In', title: 'Exorbitant SaaS Fees', desc: 'Enterprises pay $38/user/mo for software that slows down workstations' }
        ],
        notes: 'Describe why every knowledge worker suffers from software fatigue.'
      },
      {
        id: 3, layout: 'columns', tag: 'THE SOLUTION',
        title: 'Zero-Cloud In-Memory Architecture',
        desc: 'The power of full desktop native suites running seamlessly in modern browser memory.',
        features: [
          { num: 'Instant', title: 'Sub-Millisecond', desc: 'Local memory operations execute at the speed of silicon' },
          { num: 'Private', title: 'Zero Telemetry', desc: 'Documents never leave client hardware; air-gapped security' },
          { num: 'Universal', title: 'Full Office Parity', desc: 'Native export to PPTX, DOCX, XLSX, and signed PDFs' }
        ],
        notes: 'Position Giri Orbit as the inevitable next phase of computing.'
      },
      {
        id: 4, layout: 'metrics', tag: 'MARKET SIZE',
        title: '$120B Global Workplace Cloud Market',
        desc: 'Massive market expansion driven by enterprise demands for speed and data sovereignty.',
        features: [
          { num: '$120B', title: 'TAM', desc: 'Total global enterprise productivity software spend' },
          { num: '$34B', title: 'SAM', desc: 'Regulated industries: Finance, Healthcare, Defense, Legal' },
          { num: '$4.8B', title: 'SOM (2028)', desc: 'Our target achievable market in high-velocity sectors' }
        ],
        notes: 'Walk through TAM, SAM, and SOM calculations.'
      },
      {
        id: 5, layout: 'columns', tag: 'PRODUCT TOPOLOGY',
        title: 'Four Dedicated Super-Apps in One Shell',
        desc: 'A unified single-viewport workspace replacing 6 separate SaaS subscriptions.',
        features: [
          { num: 'Drift', title: 'Word Processor', desc: 'Typographic document layout engine' },
          { num: 'Axis', title: 'Spreadsheet Matrix', desc: 'Financial modeling with 50+ formulas' },
          { num: 'Kinetic', title: 'Presentation Studio', desc: '16:9 widescreen slides with animation engine' }
        ],
        notes: 'Demonstrate how the 4 tools form an impenetrable product moat.'
      },
      {
        id: 6, layout: 'metrics', tag: 'HOCKEY-STICK TRACTION',
        title: 'Explosive Organic Adoption',
        desc: 'Zero paid marketing spend; pure developer and executive viral word-of-mouth.',
        features: [
          { num: '180K', title: 'Active Workstations', desc: '+340% YoY expansion across Fortune 500' },
          { num: '$16.4M', title: 'Current ARR', desc: 'Accelerating towards $45M next fiscal year' },
          { num: '148%', title: 'Net Retention Rate', desc: 'Best-in-class negative enterprise churn' }
        ],
        notes: 'Emphasize the viral land-and-expand sales motion.'
      },
      {
        id: 7, layout: 'columns', tag: 'BUSINESS MODEL',
        title: 'High-Margin Enterprise SaaS Economics',
        desc: 'Near-zero infrastructure cost delivers 92% software gross margins.',
        features: [
          { num: '$0', title: 'Hosting Cost/User', desc: 'Client compute runs on user hardware, not our cloud' },
          { num: '$24/mo', title: 'Pro Workstation', desc: 'High-margin individual power-user subscriptions' },
          { num: '$120k/yr', title: 'Sovereign Node', desc: 'Air-gapped enterprise compliance license' }
        ],
        notes: 'Highlight how zero cloud databases translates into incredible gross margins.'
      },
      {
        id: 8, layout: 'columns', tag: 'COMPETITIVE ADVANTAGE',
        title: 'Unfair Moat: Silicon-First Computing',
        desc: 'Why legacy cloud software giants cannot replicate our local-first speed.',
        features: [
          { num: 'Architectural', title: 'No Server Latency', desc: 'Competitors require constant round-trips to cloud databases' },
          { num: 'Cryptographic', title: 'Air-Gap Parity', desc: 'Government-grade security built into every document byte' },
          { num: 'Speed Moat', title: '60 FPS Physics', desc: 'Sub-pixel smooth canvas rendering with zero lag' }
        ],
        notes: 'Detail our technological barrier to entry.'
      },
      {
        id: 9, layout: 'columns', tag: 'USE OF FUNDS',
        title: '$30M Series B Capital Allocation',
        desc: 'Accelerating global enterprise go-to-market and WebAssembly engine R&D.',
        features: [
          { num: '45%', title: 'Global GTM Expansion', desc: 'Hiring Fortune 500 enterprise sales directors' },
          { num: '35%', title: 'Systems Engineering', desc: 'Advancing client WebGPU AI neural co-pilots' },
          { num: '20%', title: 'Compliance & Audits', desc: 'SOC2 Type II, FedRAMP & ISO 27001 certifications' }
        ],
        notes: 'Walk through capital allocation plan and runway.'
      },
      {
        id: 10, layout: 'title', tag: 'THE INVITATION',
        title: 'Join the Future of Sovereign Computing',
        desc: 'Contact: founders@giri.com // Syndicate Lead: ventures@giri.com',
        features: [
          { num: 'Pitch', title: 'deck.giri.orbit', desc: 'Access complete data room' },
          { num: 'Model', title: 'financials.giri.orbit', desc: 'Review 5-year operating forecast' },
          { num: 'HQ', title: 'Giri Tower', desc: 'Silicon Valley // Sovereign Labs' }
        ],
        notes: 'Close the pitch and solicit term sheet discussions.'
      }
    ]
  },
  {
    id: 'ppt-deck-modern-ai',
    name: 'Modern Gradient AI & DeepTech Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'creative-gradient',
    optionsText: '8 slides',
    steps: 8,
    color: 'purple',
    previewAccent: '#8b5cf6',
    desc: 'Cutting-edge 8-slide cinematic presentation deck with vibrant modern gradients designed for artificial intelligence research, neural architectures, and frontier technology briefings.',
    tags: ['presentation', 'deck', 'ai', 'deeptech', 'neural', 'machine learning', '8 slides', 'gradient', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'DEEPTECH 2026',
        title: 'Autonomous Neural Intelligence',
        desc: 'Local-First Foundation Models & Decentralized Edge Computing',
        features: [
          { num: '01', title: 'WebGPU Native', desc: 'Zero-latency neural tensor execution on client silicon' },
          { num: '02', title: 'Air-Gapped AI', desc: '100% confidential weights running without cloud APIs' },
          { num: '03', title: 'Quantized Speed', desc: '240 tokens/sec generative throughput on modern laptops' }
        ],
        notes: 'Welcome researchers and enterprise partners to the DeepTech briefing.'
      },
      {
        id: 2, layout: 'columns', tag: 'NEURAL ARCHITECTURE',
        title: 'Edge-Quantized Transformer Stack',
        desc: 'Executing sub-4-bit quantized neural weights directly within the browser WebGPU sandbox.',
        features: [
          { num: 'Memory', title: 'Direct VRAM Mapping', desc: 'Shared buffer buffers bypass traditional JavaScript GC overhead' },
          { num: 'Compute', title: 'Custom WGSL Shaders', desc: 'Matrix multiplication kernels hand-tuned for Apple & Nvidia GPUs' },
          { num: 'Privacy', title: 'Context Isolation', desc: 'Zero external telemetry; prompts stay private on local chip' }
        ],
        notes: 'Walk engineering teams through our shader execution model.'
      },
      {
        id: 3, layout: 'metrics', tag: 'BENCHMARKS',
        title: 'Unrivaled Local Inferencing Velocity',
        desc: 'Performance audited across 50,000 real-world device configurations.',
        features: [
          { num: '240 t/s', title: 'Token Velocity', desc: 'Fastest in-browser transformer engine' },
          { num: '1.1 GB', title: 'RAM Footprint', desc: 'Ultra-compressed weight quantization' },
          { num: '0 ms', title: 'Cloud Roundtrip', desc: 'Eliminates 100% of network jitter' }
        ],
        notes: 'Compare local token benchmarks against legacy cloud API latency.'
      },
      {
        id: 4, layout: 'chevron-flow', diagramType: 'chevron-flow', tag: 'PIPELINE',
        title: 'Autonomous Document Synthesis Pipeline',
        desc: 'End-to-end 4-stage pipeline translating user intent into finalized presentations and models.',
        features: [
          { num: 'Stage 1', title: 'Intent Ingestion', desc: 'Semantic extraction of core business logic' },
          { num: 'Stage 2', title: 'Structural Graph', desc: 'Automated layout & diagram selection' },
          { num: 'Stage 3', title: 'Vector Rendering', desc: 'Sub-millisecond canvas composition' },
          { num: 'Stage 4', title: 'Sovereign Sealing', desc: 'Cryptographic PKI stamp and export' }
        ],
        notes: 'Explain the 4 pipeline stages from intent to export.'
      },
      {
        id: 5, layout: 'radial-cycle', diagramType: 'radial-cycle', tag: 'MULTI-AGENT',
        title: 'Collaborative Multi-Agent Ecosystem',
        desc: 'Specialized autonomous agents operating asynchronously within local memory.',
        features: [
          { num: 'Agent 1', title: 'Analyst Copilot', desc: 'Axis financial spreadsheet modeling' },
          { num: 'Agent 2', title: 'Design Virtuoso', desc: 'Kinetic slide aesthetic and layout' },
          { num: 'Agent 3', title: 'Legal Auditor', desc: 'Drift & Aegis compliance verification' },
          { num: 'Agent 4', title: 'Data Bridge', desc: 'File converter format harmonization' }
        ],
        notes: 'Describe the multi-agent mesh architecture.'
      },
      {
        id: 6, layout: 'columns', tag: 'SECURITY',
        title: 'Military-Grade Air-Gapped Privacy',
        desc: 'Compliant with the most stringent global defense and intelligence charters.',
        features: [
          { num: 'Air-Gapped', title: 'Physical Disconnect', desc: 'Runs seamlessly with network cables unplugged' },
          { num: 'Zero Trust', title: 'Hardware Key Seals', desc: 'PKI signatures verify document provenance' },
          { num: 'No Scraping', title: 'Confidential Data', desc: 'Zero training on enterprise intellectual property' }
        ],
        notes: 'Reassure compliance and security directors.'
      },
      {
        id: 7, layout: 'columns', tag: 'DEVELOPER ROADMAP',
        title: 'Developer SDK & Ecosystem Horizons',
        desc: 'Empowering enterprise software engineers with open WebAssembly APIs.',
        features: [
          { num: 'Q1 Launch', title: 'Core Wasm API', desc: 'Public JavaScript/TypeScript SDK bindings' },
          { num: 'Q2 Ecosystem', title: 'Template Market', desc: 'Custom enterprise layout packages' },
          { num: 'Q3 Enterprise', title: 'On-Premises Nodes', desc: 'Dedicated air-gapped container appliance' }
        ],
        notes: 'Highlight developer traction and API roadmap.'
      },
      {
        id: 8, layout: 'title', tag: 'WRAP UP',
        title: 'Empower Your Intelligence Today',
        desc: 'Explore the Neural Engine at ai.giri.orbit // deeptech@giri.com',
        features: [
          { num: 'Docs', title: 'ai.giri.orbit/docs', desc: 'Developer documentation' },
          { num: 'GitHub', title: 'github.com/giri/neural', desc: 'Inspect open shaders' }
        ],
        notes: 'Conclude presentation and open floor for technical questions.'
      }
    ]
  },
  {
    id: 'ppt-deck-minimalist-creative',
    name: 'Minimalist Editorial & Creative Studio Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'obsidian-minimal',
    optionsText: '8 slides',
    steps: 8,
    color: 'dark',
    previewAccent: '#18181b',
    desc: 'Sophisticated 8-slide presentation template with stark monochrome aesthetics, elegant serif typography, and balanced white space for design agencies, fashion brands, and architecture studios.',
    tags: ['presentation', 'deck', 'minimalist', 'editorial', 'creative', 'studio', 'agency', 'portfolio', '8 slides', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'STUDIO MONOLITH',
        title: 'Form Follows Intention',
        desc: 'Selected Works, Brand Systems & Typographic Architecture 2026',
        features: [
          { num: '01', title: 'Spatial Harmony', desc: 'Rigorous 12-column Swiss typographic grid' },
          { num: '02', title: 'Quiet Luxury', desc: 'Minimalist restraint engineered for cultural brands' },
          { num: '03', title: 'Editorial Polish', desc: 'Curated font pairings and high-contrast visuals' }
        ],
        notes: 'Introduce the design studio philosophy.'
      },
      {
        id: 2, layout: 'columns', tag: 'PHILOSOPHY',
        title: 'Core Creative Principles',
        desc: 'Eliminating the superfluous so the essential message speaks clearly.',
        features: [
          { num: 'Principle I', title: 'Radical Reduction', desc: 'Every visual element must justify its presence' },
          { num: 'Principle II', title: 'Typographic Power', desc: 'Hierarchy established through scale and weight' },
          { num: 'Principle III', title: 'Material Honesty', desc: 'Authentic vector rendering with zero simulated effects' }
        ],
        notes: 'Walk clients through our architectural approach to design.'
      },
      {
        id: 3, layout: 'columns', tag: 'CASE STUDY',
        title: 'Global Identity for Sovereign Capital',
        desc: 'Complete repositioning and visual identity for a $14B venture fund.',
        features: [
          { num: 'Challenge', title: 'Legacy Fatigue', desc: 'Generic corporate styling lacked institutional gravitas' },
          { num: 'Strategy', title: 'Monochrome Dignity', desc: 'Stark black-and-white visual language with custom serif' },
          { num: 'Outcome', title: '+280% Inbound Dealflow', desc: 'Positioned fund as the preeminent institutional backer' }
        ],
        notes: 'Present the case study metrics and visual transformation.'
      },
      {
        id: 4, layout: 'metrics', tag: 'IMPACT & REACH',
        title: 'Quantified Studio Impact',
        desc: 'Delivering tangible commercial dividends for our global partners.',
        features: [
          { num: '14', title: 'Design Accolades', desc: 'International recognition for typography & identity' },
          { num: '100%', title: 'Client Retention', desc: 'Long-term ongoing advisory engagements' },
          { num: '$2.8B', title: 'Client Enterprise Value', desc: 'Created across transformed brand ecosystems' }
        ],
        notes: 'Highlight creative achievements and commercial results.'
      },
      {
        id: 5, layout: 'columns', tag: 'CAPABILITIES',
        title: 'End-to-End Creative Capabilities',
        desc: 'From initial brand strategy to digital experience design and motion systems.',
        features: [
          { num: 'Identity', title: 'Brand Architecture', desc: 'Logo systems, typography, color palettes and guidelines' },
          { num: 'Digital', title: 'Web & App Design', desc: 'High-performance interactive interfaces in Kinetic' },
          { num: 'Physical', title: 'Editorial & Spatial', desc: 'Print collateral, annual reports, and environmental signage' }
        ],
        notes: 'Review our multidisciplinary scope of services.'
      },
      {
        id: 6, layout: 'speech-bubbles', diagramType: 'speech-bubbles', tag: 'TESTIMONIALS',
        title: 'Direct Client Feedback',
        desc: 'What executive leaders say about partnering with our studio.',
        features: [
          { num: '01', title: 'Creative Director', desc: '“The level of typographic precision and restraint delivered by the team transformed our brand overnight.”' },
          { num: '02', title: 'Managing Partner', desc: '“Our deck closed our largest LP commitment within 48 hours of presentation.”' },
          { num: '03', title: 'Head of Brand', desc: '“They do not just design slides; they clarify corporate strategy with visual perfection.”' }
        ],
        notes: 'Read select quotes from executive partners.'
      },
      {
        id: 7, layout: 'columns', tag: 'ENGAGEMENT',
        title: 'Structured 6-Week Sprint Process',
        desc: 'Clear stage-gates from strategic discovery to final asset delivery.',
        features: [
          { num: 'Weeks 1-2', title: 'Immersion & Strategy', desc: 'Stakeholder interviews, market audit, and creative direction' },
          { num: 'Weeks 3-4', title: 'Design Exploration', desc: 'Three distinct concept routes presented with interactive prototypes' },
          { num: 'Weeks 5-6', title: 'Refinement & Delivery', desc: 'Complete asset production, guidelines, and team training' }
        ],
        notes: 'Walk potential clients through the project timeline.'
      },
      {
        id: 8, layout: 'title', tag: 'COMMISSIONS',
        title: 'Initiate a Creative Partnership',
        desc: 'Inquiries: studio@giri.com // Portfolio: monolith.giri.orbit',
        features: [
          { num: 'Studio', title: 'studio@giri.com', desc: 'Schedule initial consultation' },
          { num: 'Book', title: 'portfolio.giri.orbit', desc: 'Request hardcover studio monograph' }
        ],
        notes: 'Conclude presentation and invite collaboration.'
      }
    ]
  },
  {
    id: 'ppt-deck-healthcare-medical',
    name: 'Medical, Healthcare & Clinical Research Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'medical-clean',
    optionsText: '8 slides',
    steps: 8,
    color: 'cyan',
    previewAccent: '#0284c7',
    desc: 'Clinical 8-slide presentation template designed for medical conferences, pharmaceutical phase trials, hospital administration reviews, and biotechnology investment briefings.',
    tags: ['presentation', 'deck', 'medical', 'healthcare', 'clinical', 'pharma', 'biotech', 'research', '8 slides', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'CLINICAL TRIAL BRIEFING',
        title: 'Therapeutic Efficacy & Phase III Readout',
        desc: 'Randomized Double-Blind Evaluation of Novel Targeted Molecular Therapy',
        features: [
          { num: 'p < 0.001', title: 'Statistical Significance', desc: 'Primary endpoint achieved with high confidence' },
          { num: '1,420', title: 'Patient Cohort', desc: 'Multi-center international clinical trial population' },
          { num: 'FDA / EMA', title: 'Regulatory Pathway', desc: 'Accelerated approval dossier submission' }
        ],
        notes: 'Welcome clinicians, principal investigators, and medical officers.'
      },
      {
        id: 2, layout: 'columns', tag: 'TRIAL PROTOCOL',
        title: 'Study Design & Patient Demographics',
        desc: 'Rigorous multi-arm clinical design evaluating safety, dosage, and survival metrics.',
        features: [
          { num: 'Arm A (Active)', title: '710 Patients', desc: 'Once-daily oral tablet (50mg targeted formulation)' },
          { num: 'Arm B (Control)', title: '710 Patients', desc: 'Current standard-of-care baseline comparator' },
          { num: 'Duration', title: '24 Months', desc: 'Continuous longitudinal monitoring across 48 sites' }
        ],
        notes: 'Review clinical trial inclusion and exclusion criteria.'
      },
      {
        id: 3, layout: 'metrics', tag: 'PRIMARY ENDPOINTS',
        title: 'Clinically Meaningful Symptom Reduction',
        desc: 'Demonstrated superior therapeutic outcomes over standard-of-care.',
        features: [
          { num: '68.4%', title: 'Overall Response Rate', desc: 'Versus 34.2% in control group (p < 0.001)' },
          { num: '14.8 mo', title: 'Progression-Free Survival', desc: '+6.2 month median extension over baseline' },
          { num: '92.1%', title: 'Patient Tolerability', desc: 'High compliance rate with minimal discontinuations' }
        ],
        notes: 'Present the primary and secondary statistical endpoints.'
      },
      {
        id: 4, layout: 'columns', tag: 'SAFETY & TOLERABILITY',
        title: 'Favorable Safety Profile Across Cohorts',
        desc: 'Adverse event profile consistent with target pharmacology with zero novel toxicities.',
        features: [
          { num: 'Grade 1-2', title: 'Mild & Transient', desc: 'Fatigue (8.2%) and mild nausea (4.1%), self-resolving' },
          { num: 'Grade 3-4', title: '< 2.4% Incidence', desc: 'No statistically significant elevation over control' },
          { num: '0.0%', title: 'Fatal Adverse Events', desc: 'Clean toxicology profile across 24 months of dosing' }
        ],
        notes: 'Review the comprehensive pharmacovigilance safety table.'
      },
      {
        id: 5, layout: 'milestone-road', diagramType: 'milestone-road', tag: 'REGULATORY TIMELINE',
        title: 'Regulatory Submissions & Commercial Horizons',
        desc: 'Sequential milestones guiding global market authorization and clinical rollout.',
        features: [
          { num: 'Q1', title: 'IND / Phase III', desc: 'Trial readout complete' },
          { num: 'Q2', title: 'FDA Filing', desc: 'NDA priority review package' },
          { num: 'Q3', title: 'EMA Validation', desc: 'European market dossier' },
          { num: 'Q4', title: 'Global Launch', desc: 'Clinical distribution begins' }
        ],
        notes: 'Walk stakeholders through the regulatory submission timeline.'
      },
      {
        id: 6, layout: 'columns', tag: 'SCIENTIFIC ADVISORY',
        title: 'Lead Investigators & Advisory Board',
        desc: 'World-renowned medical oncologists and molecular biologists guiding the study.',
        features: [
          { num: 'PI', title: 'Dr. Sarah Bennett, MD', desc: 'Chief of Clinical Therapeutics, Harvard Medical School' },
          { num: 'Co-PI', title: 'Dr. Marcus Vance, PhD', desc: 'Director of Molecular Genetics, Johns Hopkins' },
          { num: 'Stats', title: 'Dr. Elena Rostova, PhD', desc: 'Chair of Biostatistics & Clinical Epidemiology' }
        ],
        notes: 'Highlight credentials of the principal clinical investigators.'
      },
      {
        id: 7, layout: 'columns', tag: 'MARKET ACCESS',
        title: 'Health Economics & Patient Reimbursement',
        desc: 'Demonstrated cost-effectiveness supporting universal insurance formulary inclusion.',
        features: [
          { num: 'ICER', title: 'Highly Cost-Effective', desc: 'Well below standard $50k/QALY willingness-to-pay threshold' },
          { num: 'Hospital Stay', title: '40% Reduction', desc: 'Significantly lowers inpatient hospital bed days' },
          { num: 'Access', title: 'Patient Assistance', desc: 'Comprehensive copay support program established' }
        ],
        notes: 'Explain reimbursement strategy to healthcare payers.'
      },
      {
        id: 8, layout: 'title', tag: 'CLOSING',
        title: 'Transforming Patient Outcomes Together',
        desc: 'Medical Affairs: medical@giri.com // Clinical Data: trials.giri.orbit',
        features: [
          { num: 'Reprint', title: 'thelancet.giri.orbit', desc: 'Download peer-reviewed publication' },
          { num: 'Protocol', title: 'trials.giri.orbit/protocol', desc: 'Full clinical trial registry' }
        ],
        notes: 'Conclude presentation and address physician questions.'
      }
    ]
  },
  {
    id: 'ppt-deck-cybersecurity-zerotrust',
    name: 'Enterprise Cybersecurity & Zero-Trust Architecture Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'cyber-matrix',
    optionsText: '8 slides',
    steps: 8,
    color: 'green',
    previewAccent: '#10b981',
    desc: 'Defense-grade 8-slide presentation template designed for CISOs, security councils, threat intelligence reviews, and sovereign zero-trust cryptographic audits.',
    tags: ['presentation', 'deck', 'cybersecurity', 'security', 'zero trust', 'ciso', 'soc2', 'encryption', '8 slides', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'DEFENSE BRIEFING',
        title: 'Zero-Trust Cyber Defense & Sovereignty',
        desc: 'Continuous Cryptographic Verification, Air-Gapped Workstations & Perimeter Audits',
        features: [
          { num: '0 Breaches', title: 'Air-Gapped Record', desc: 'Unblemished perimeter record across all client instances' },
          { num: 'ISO 27001', title: 'Security Standard', desc: 'Global cryptographic certification achieved' },
          { num: 'Sub-MS', title: 'Threat Containment', desc: 'Autonomous client-side anomalous telemetry quarantine' }
        ],
        notes: 'Open security council briefing with current risk posture.'
      },
      {
        id: 2, layout: 'columns', tag: 'THREAT LANDSCAPE',
        title: 'Global Cyber Threat Vectors 2026',
        desc: 'Analyzing sophisticated nation-state attacks, ransomware, and cloud supply-chain risks.',
        features: [
          { num: 'Vector 1', title: 'Cloud Database Exfiltration', desc: '82% of corporate data leaks occur via multi-tenant vendor databases' },
          { num: 'Vector 2', title: 'Session Hijacking', desc: 'Token-based browser credential theft targeting remote teams' },
          { num: 'Vector 3', title: 'Supply Chain Injections', desc: 'Malicious dependencies injected into central SaaS cloud pipelines' }
        ],
        notes: 'Highlight how centralized cloud software creates systemic risk.'
      },
      {
        id: 3, layout: 'columns', tag: 'ARCHITECTURE',
        title: 'Core Zero-Trust Architectural Stack',
        desc: 'Never Trust, Always Verify: Micro-segmented memory execution on local silicon.',
        features: [
          { num: 'Layer 1', title: 'Cryptographic Root', desc: 'Hardware enclave key storage with zero cloud private key escrow' },
          { num: 'Layer 2', title: 'Ephemeral Memory', desc: 'Document buffers shredded from RAM immediately upon window closure' },
          { num: 'Layer 3', title: 'Air-Gap Isolation', desc: '100% operation without inbound or outbound internet connections' }
        ],
        notes: 'Walk security engineers through our defense-in-depth model.'
      },
      {
        id: 4, layout: 'metrics', tag: 'TELEMETRY & AUDIT',
        title: 'Real-Time Anomaly Telemetry & SLA',
        desc: 'Security performance audited across 100,000 corporate workstation endpoints.',
        features: [
          { num: '0 KB', title: 'Data Leaked', desc: 'Zero external telemetry or tracking analytics' },
          { num: '100%', title: 'SOC2 Type II', desc: 'Passed all trust criteria controls with zero defects' },
          { num: '< 2 sec', title: 'Anomaly Containment', desc: 'Automatic local sandbox isolation on tampering' }
        ],
        notes: 'Review operational telemetry with the audit committee.'
      },
      {
        id: 5, layout: 'chevron-flow', diagramType: 'chevron-flow', tag: 'INCIDENT PROTOCOL',
        title: '4-Phase Threat Containment Protocol',
        desc: 'Automated rapid-response framework for zero-trust endpoint protection.',
        features: [
          { num: 'Phase 1', title: 'Detection', desc: 'Instant cryptographic hash mismatch flag' },
          { num: 'Phase 2', title: 'Containment', desc: 'Local memory sandbox freeze' },
          { num: 'Phase 3', title: 'Eradication', desc: 'Buffer purge & cryptographic key rotation' },
          { num: 'Phase 4', title: 'Recovery', desc: 'Rehydration from verified local vault' }
        ],
        notes: 'Walk through the automated containment protocol.'
      },
      {
        id: 6, layout: 'columns', tag: 'COMPLIANCE',
        title: 'Global Regulatory Accreditations',
        desc: 'Certified to meet the strictest financial, defense, and healthcare privacy standards.',
        features: [
          { num: 'HIPAA', title: 'Healthcare Safe', desc: 'Zero protected health info leaves hospital local network' },
          { num: 'GDPR / CCPA', title: 'Privacy by Design', desc: 'Zero personal data collection or cross-site tracking' },
          { num: 'FedRAMP High', title: 'Government Defense', desc: 'Ready for classified sovereign deployments' }
        ],
        notes: 'Review statutory accreditations with corporate counsel.'
      },
      {
        id: 7, layout: 'columns', tag: 'DEPLOYMENT',
        title: 'Enterprise Air-Gapped Deployment Model',
        desc: 'Simple deployment onto dedicated enterprise hardware with zero vendor dependencies.',
        features: [
          { num: 'Step 1', title: 'Private Binary Drop', desc: 'Pre-compiled self-contained offline PWA bundle' },
          { num: 'Step 2', title: 'Internal PKI Setup', desc: 'Link corporate certificate authority for digital signing' },
          { num: 'Step 3', title: 'Employee Rollout', desc: 'Zero training required; works directly in standard browsers' }
        ],
        notes: 'Detail the turnkey deployment timeline.'
      },
      {
        id: 8, layout: 'title', tag: 'CONCLUSION',
        title: 'Maintain Uncompromising Security Posture',
        desc: 'CISO Office: security@giri.com // Verification: certs.giri.orbit',
        features: [
          { num: 'Audit', title: 'audit.giri.orbit', desc: 'Download third-party penetration report' },
          { num: 'PKI', title: 'pki.giri.orbit', desc: 'Inspect public key certificates' }
        ],
        notes: 'Conclude security briefing and take council questions.'
      }
    ]
  },
  {
    id: 'ppt-deck-consulting-strategy',
    name: 'Consulting Frameworks & McKinsey Strategy Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'violet-luxury',
    optionsText: '8 slides',
    steps: 8,
    color: 'purple',
    previewAccent: '#7c3aed',
    desc: 'Elite 8-slide Presentation strategy presentation modeled on top-tier management consulting frameworks: Porter\'s Five Forces, Value Chain diagnostics, and 100-day transformation playbooks.',
    tags: ['presentation', 'deck', 'consulting', 'strategy', 'mckinsey', 'frameworks', 'advisory', '8 slides', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'STRATEGIC ADVISORY',
        title: 'Enterprise Value Creation Thesis',
        desc: 'Comprehensive Diagnostic, Market Re-Positioning & Operational Acceleration Playbook',
        features: [
          { num: '$85M', title: 'EBITDA Opportunity', desc: 'Identified through operational margin optimization' },
          { num: '100 Days', title: 'Execution Velocity', desc: 'Rapid delivery of high-priority strategic initiatives' },
          { num: '3 Pillars', title: 'Core Transformation', desc: 'Commercial excellence, digital speed, and capital discipline' }
        ],
        notes: 'Welcome the client executive committee to the strategic readout.'
      },
      {
        id: 2, layout: 'columns', tag: 'EXECUTIVE SUMMARY',
        title: 'The Core Strategic Diagnosis',
        desc: 'Key findings from our comprehensive 8-week enterprise diagnostic.',
        features: [
          { num: 'Finding 1', title: 'Cost Structure Inertia', desc: 'Legacy cloud vendor overhead consuming 24% of operating cash flow' },
          { num: 'Finding 2', title: 'Commercial Friction', desc: 'Disjointed sales tools creating 45-day contract closing delays' },
          { num: 'Finding 3', title: 'Untapped Pricing Power', desc: 'Enterprise clients willing to pay premium for sovereign security' }
        ],
        notes: 'Synthesize the three fundamental structural challenges.'
      },
      {
        id: 3, layout: 'swot-matrix', diagramType: 'swot-matrix', tag: 'STRATEGIC MATRIX',
        title: 'Comprehensive 2x2 SWOT Diagnostic',
        desc: 'Synthesizing internal capabilities against external market shifts.',
        features: [
          { num: 'S', title: 'Market Position', desc: 'Deeply entrenched Fortune 500 client relationships' },
          { num: 'W', title: 'Tool Fragmentation', desc: 'Employees using 14 disparate SaaS tools concurrently' },
          { num: 'O', title: 'Sovereign Demand', desc: 'Accelerating global regulatory mandates for data privacy' },
          { num: 'T', title: 'Challenger Agility', desc: 'New entrants competing with zero marginal cost models' }
        ],
        notes: 'Walk leadership through the strategic SWOT quadrants.'
      },
      {
        id: 4, layout: 'metrics', tag: 'FINANCIAL UPSIDE',
        title: 'Quantified Value Creation Potential',
        desc: 'Modeled financial impact of full transformation over 24 months.',
        features: [
          { num: '$85M', title: 'Run-Rate EBITDA', desc: '+35% lift within 18 months of rollout' },
          { num: '65%', title: 'SaaS Cost Reduction', desc: 'Consolidating to Giri Orbit sovereign suite' },
          { num: '3.2x', title: 'Enterprise Multiple Lift', desc: 'Driven by recurring revenue & margin expansion' }
        ],
        notes: 'Review the value creation financial bridge with the CFO.'
      },
      {
        id: 5, layout: 'columns', tag: 'VALUE CHAIN',
        title: 'Core Value Chain Optimization',
        desc: 'Eliminating operational handoff friction across the organization.',
        features: [
          { num: 'Inbound', title: 'Procurement Streamline', desc: 'Unified vendor licensing and consolidated contracts' },
          { num: 'Operations', title: 'In-Memory Workflows', desc: 'Instant document synthesis replacing manual email attachments' },
          { num: 'Outbound', title: 'Client Delivery', desc: 'Cryptographically sealed PDF and PPTX deliverables' }
        ],
        notes: 'Detail the operational value chain interventions.'
      },
      {
        id: 6, layout: 'milestone-road', diagramType: 'milestone-road', tag: '100-DAY PLAYBOOK',
        title: '100-Day Executive Implementation Roadmap',
        desc: 'Phased transformation milestones ensuring rapid quick-wins and structural buy-in.',
        features: [
          { num: 'Days 1-30', title: 'Quick-Wins', desc: 'Kill redundant SaaS; launch Giri Orbit pilot' },
          { num: 'Days 31-60', title: 'Process Redesign', desc: 'Implement automated financial matrices in Axis' },
          { num: 'Days 61-90', title: 'Enterprise Scale', desc: 'Deploy Kinetic presentation decks across sales' },
          { num: 'Day 100', title: 'Maturity Audit', desc: 'Validate initial $25M EBITDA savings' }
        ],
        notes: 'Present the 100-day execution roadmap.'
      },
      {
        id: 7, layout: 'columns', tag: 'CHANGE MANAGEMENT',
        title: 'Program Governance & Steering Council',
        desc: 'Ensuring accountability, milestone tracking, and cross-functional alignment.',
        features: [
          { num: 'SteerCo', title: 'Executive Committee', desc: 'Bi-weekly progress reviews with CEO & Division Presidents' },
          { num: 'PMO', title: 'Transformation Office', desc: 'Dedicated full-time agile project leaders tracking KPIs' },
          { num: 'Champions', title: 'Frontline Advocates', desc: 'Peer power-users driving grassroots tool adoption' }
        ],
        notes: 'Outline the change management governance structure.'
      },
      {
        id: 8, layout: 'title', tag: 'NEXT STEPS',
        title: 'Execute with Relentless Discipline',
        desc: 'Strategy Advisory: advisory@giri.com // Engagement Room: pmo.giri.orbit',
        features: [
          { num: 'PMO', title: 'pmo.giri.orbit', desc: 'Live transformation dashboard' },
          { num: 'Deck', title: 'strategy.giri.orbit', desc: 'Download executive summary' }
        ],
        notes: 'Conclude strategy presentation and vote to authorize Phase 1.'
      }
    ]
  },
  {
    id: 'ppt-deck-marketing-omnichannel',
    name: 'Omnichannel Marketing Strategy & Growth Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'sunset-warm',
    optionsText: '8 slides',
    steps: 8,
    color: 'amber',
    previewAccent: '#f97316',
    desc: 'Vibrant 8-slide presentation template designed for Chief Marketing Officers, growth teams, product marketing launches, omnichannel advertising campaigns, and funnel economics.',
    tags: ['presentation', 'deck', 'marketing', 'growth', 'omnichannel', 'advertising', 'funnel', '8 slides', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'GO-TO-MARKET 2026',
        title: 'Omnichannel Growth & Customer Acquisition',
        desc: 'Data-Driven Acquisition, Brand Amplification & High-LTV Enterprise Funnels',
        features: [
          { num: '3.4x', title: 'LTV to CAC', desc: 'High-efficiency inbound enterprise acquisition' },
          { num: '1.2M', title: 'Target Reach', desc: 'Qualified technology decision-makers' },
          { num: '45%', title: 'Organic Inbound', desc: 'Word-of-mouth & viral product loops' }
        ],
        notes: 'Open marketing strategy presentation with key growth targets.'
      },
      {
        id: 2, layout: 'columns', tag: 'BUYER PERSONAS',
        title: 'Target Enterprise Customer Personas',
        desc: 'Deep ICP analysis across C-Suite decision makers and technical champions.',
        features: [
          { num: 'Persona 1', title: 'Chief Information Officer', desc: 'Prioritizes data sovereignty, air-gapped security, and software spend consolidation' },
          { num: 'Persona 2', title: 'VP of Engineering', desc: 'Demands sub-millisecond execution, offline reliability, and zero browser bloat' },
          { num: 'Persona 3', title: 'Managing Director / Partner', desc: 'Needs elegant, boardroom-ready presentations and seamless PPTX exports' }
        ],
        notes: 'Review our primary enterprise buyer personas.'
      },
      {
        id: 3, layout: 'funnel-stages', diagramType: 'funnel-stages', tag: 'ACQUISITION FUNNEL',
        title: 'Full-Funnel Omnichannel Conversion Pipeline',
        desc: 'Converting brand awareness into recurring enterprise multi-seat contracts.',
        features: [
          { num: '100%', title: 'Awareness (450K)', desc: 'Organic search, technical thought leadership & social' },
          { num: '38%', title: 'Evaluation (171K)', desc: 'Interactive in-browser tool testing with zero sign-up' },
          { num: '14%', title: 'Qualified Lead (63K)', desc: 'Enterprise IT pilots and security reviews' },
          { num: '5.2%', title: 'Paid Contract (23K)', desc: 'Multi-seat annual corporate software licensing' }
        ],
        notes: 'Walk through conversion rates at each stage of the funnel.'
      },
      {
        id: 4, layout: 'metrics', tag: 'UNIT ECONOMICS',
        title: 'Marketing ROI & Acquisition Efficiency',
        desc: 'Sustained capital efficiency across all paid and organic channels.',
        features: [
          { num: '$1,850', title: 'Blended CAC', desc: 'Down 28% YoY through viral product loops' },
          { num: '$8,200', title: 'First-Year ACV', desc: 'Average contract value for enterprise teams' },
          { num: '4.4 mo', title: 'CAC Payback', desc: 'Ultra-fast cash recovery enabling reinvestment' }
        ],
        notes: 'Demonstrate unit economic sustainability to leadership.'
      },
      {
        id: 5, layout: 'columns', tag: 'CONTENT & CHANNELS',
        title: 'Multi-Channel Activation Strategy',
        desc: 'Coordinated brand presence across high-impact digital and physical touchpoints.',
        features: [
          { num: 'Technical Content', title: 'Engineering Blog', desc: 'Deep-dives on WebAssembly, WebGPU, and client memory systems' },
          { num: 'Executive Events', title: 'Sovereign Summit', desc: 'Exclusive invite-only roundtables for Fortune 500 CISOs' },
          { num: 'Product-Led', title: 'Template Library', desc: '3,500+ free viral templates driving organic daily search traffic' }
        ],
        notes: 'Explain our content-led organic expansion flywheel.'
      },
      {
        id: 6, layout: 'milestone-road', diagramType: 'milestone-road', tag: 'CAMPAIGN CALENDAR',
        title: 'Quarterly Campaign & Product Launch Horizon',
        desc: 'Synchronized go-to-market activations throughout the fiscal year.',
        features: [
          { num: 'Q1 Launch', title: 'Kinetic 3.0', desc: 'Major release with Global Presentation Engine library' },
          { num: 'Q2 Summit', title: 'Sovereign World', desc: 'Global virtual developer conference' },
          { num: 'Q3 Push', title: 'Enterprise Fall', desc: 'Targeted account-based sales campaign' },
          { num: 'Q4 Wrap', title: 'Year-End Review', desc: 'Annual customer celebration & awards' }
        ],
        notes: 'Review the quarterly campaign delivery schedule.'
      },
      {
        id: 7, layout: 'columns', tag: 'BUDGET ALLOCATION',
        title: 'Strategic Marketing Capital Allocation',
        desc: 'Disciplined deployment of the $4.5M annual marketing budget.',
        features: [
          { num: '40%', title: 'Content & Community', desc: 'Technical writers, video walkthroughs, and developer advocacy' },
          { num: '35%', title: 'High-Intent Paid Search', desc: 'Targeting enterprise users searching for office software alternatives' },
          { num: '25%', title: 'Brand & Event Activations', desc: 'Executive conferences, sponsorships, and sovereign PR' }
        ],
        notes: 'Walk the executive committee through budget allocations.'
      },
      {
        id: 8, layout: 'title', tag: 'CONCLUSION',
        title: 'Accelerate Customer Acquisition',
        desc: 'CMO Office: growth@giri.com // Marketing HQ: marketing.giri.orbit',
        features: [
          { num: 'Deck', title: 'gtm.giri.orbit', desc: 'Download complete marketing playbook' },
          { num: 'Brand', title: 'brand.giri.orbit', desc: 'Access digital asset management vault' }
        ],
        notes: 'Conclude marketing presentation and open for Q&A.'
      }
    ]
  },
  {
    id: 'ppt-deck-saas-enterprise-sales',
    name: 'SaaS Enterprise Sales Pitch & ROI Proposal Presentation Deck',
    category: 'presentation',
    categoryLabel: 'Executive Presentation Decks',
    subCategories: ['Executive Presentation Decks', 'Templates'],
    diagramType: 'presentation-collage',
    themeStyle: 'emerald-growth',
    optionsText: '8 slides',
    steps: 8,
    color: 'green',
    previewAccent: '#059669',
    desc: 'Commercial 8-slide presentation deck tailored for enterprise sales executives, procurement discussions, ROI cost calculators, and software consolidation proposals.',
    tags: ['presentation', 'deck', 'saas', 'enterprise', 'sales', 'roi', 'pricing', 'proposal', '8 slides', 'global'],
    slides: [
      {
        id: 1, layout: 'title', tag: 'ENTERPRISE PROPOSAL',
        title: 'Giri Orbit Sovereign Suite Proposal',
        desc: 'Consolidated Productivity, 65% TCO Savings & Air-Gapped Data Sovereignty',
        features: [
          { num: '65%', title: 'Cost Reduction', desc: 'Immediate savings over fragmented SaaS bundles' },
          { num: '4-in-1', title: 'Unified Suite', desc: 'Drift, Axis, Kinetic & Aegis in one license' },
          { num: '0 ms', title: 'Zero Lag', desc: '100% in-memory speed boosts employee output' }
        ],
        notes: 'Welcome the client procurement and IT committee.'
      },
      {
        id: 2, layout: 'columns', tag: 'CURRENT STATE',
        title: 'The Hidden Costs of Modern SaaS Sprawl',
        desc: 'Analyzing the true cost of juggling multiple disjointed software vendors.',
        features: [
          { num: '$48/mo/user', title: 'Vendor Licensing', desc: 'Paying for redundant document, spreadsheet, and slide tools' },
          { num: '14 hrs/mo', title: 'Lost Productivity', desc: 'Employees context switching between sluggish browser tabs' },
          { num: 'Security Risk', title: 'Multi-Tenant Clouds', desc: 'Proprietary corporate data spread across 8 third-party vendor clouds' }
        ],
        notes: 'Quantify the pain points of their existing vendor setup.'
      },
      {
        id: 3, layout: 'columns', tag: 'THE PROPOSAL',
        title: 'The Giri Orbit Sovereign Solution',
        desc: 'One seamless workspace running locally on workstation silicon.',
        features: [
          { num: 'Drift', title: 'Word Processor', desc: 'Full A4 typographic documents and contractual templates' },
          { num: 'Axis', title: 'Spreadsheet Grid', desc: 'Instant calculation modeling with Excel formula parity' },
          { num: 'Kinetic', title: 'Presentation Studio', desc: 'Widescreen presentation decks with built-in animation engine' }
        ],
        notes: 'Introduce our unified suite advantage.'
      },
      {
        id: 4, layout: 'comparison-table', diagramType: 'comparison-table', tag: 'ROI ANALYSIS',
        title: '3-Year Total Cost of Ownership (TCO) Comparison',
        desc: 'Side-by-side cost modeling demonstrating massive multi-year enterprise savings.',
        features: [
          { num: 'Legacy SaaS', title: '$1,440,000', desc: '1,000 users @ $40/mo + cloud database surcharges over 3 years' },
          { num: 'Giri Orbit', title: '$480,000', desc: 'Fixed sovereign site license with zero per-byte cloud charges' },
          { num: 'Net Savings', title: '$960,000', desc: '67% hard cash reduction directly boosting client operating margin' }
        ],
        notes: 'Walk the CFO through the 3-year TCO savings table.'
      },
      {
        id: 5, layout: 'milestone-road', diagramType: 'milestone-road', tag: 'ONBOARDING',
        title: '30-Day Phased Enterprise Deployment Plan',
        desc: 'Seamless migration with zero workflow interruption or data migration friction.',
        features: [
          { num: 'Days 1-7', title: 'Pilot Setup', desc: 'Deploy private offline PWA package to 50 power users' },
          { num: 'Days 8-14', title: 'File Validation', desc: 'Verify full import/export parity with existing PPTX/DOCX' },
          { num: 'Days 15-21', title: 'Team Rollout', desc: 'Provision department seats across all business units' },
          { num: 'Days 22-30', title: 'Full Migration', desc: 'Decommission legacy vendor subscriptions' }
        ],
        notes: 'Present the risk-free 30-day onboarding schedule.'
      },
      {
        id: 6, layout: 'speech-bubbles', diagramType: 'speech-bubbles', tag: 'CASE STUDY',
        title: 'Validated by Enterprise Industry Leaders',
        desc: 'Direct results from enterprises who transitioned from legacy cloud suites.',
        features: [
          { num: '01', title: 'Global Bank CIO', desc: '“Consolidating to Giri Orbit saved our treasury $2.4M annually while achieving total air-gapped security compliance.”' },
          { num: '02', title: 'VP of Technology', desc: '“The speed of Kinetic and Axis is unmatched. Our analysts save over an hour every day.”' },
          { num: '03', title: 'Head of Procurement', desc: '“The simplest enterprise software rollout in my 15-year career. Zero database headaches.”' }
        ],
        notes: 'Read enterprise testimonials to reassure procurement.'
      },
      {
        id: 7, layout: 'columns', tag: 'COMMERCIAL TERMS',
        title: 'Transparent Enterprise Commercial Terms',
        desc: 'Predictable, all-inclusive pricing with guaranteed uptime SLAs and dedicated support.',
        features: [
          { num: 'Licensing', title: 'Unlimited Seats', desc: 'Single corporate site license covering all global subsidiaries' },
          { num: 'Updates', title: 'Continuous Delivery', desc: 'All future templates, tools, and updates included at no extra cost' },
          { num: 'Support', title: '24/7 Dedicated Team', desc: 'Direct access to core systems engineering and dedicated account manager' }
        ],
        notes: 'Review the proposed contract terms.'
      },
      {
        id: 8, layout: 'title', tag: 'SIGN-OFF',
        title: 'Empower Your Enterprise Today',
        desc: 'Sales Director: enterprise@giri.com // Portal: contracts.giri.orbit',
        features: [
          { num: 'Proposal', title: 'proposal.giri.orbit', desc: 'Review custom statement of work' },
          { num: 'Contract', title: 'sign.giri.orbit', desc: 'Execute digital master services agreement' }
        ],
        notes: 'Close the proposal and invite agreement execution.'
      }
    ]
  },

  // ==========================================================================
  // 4. EXISTING CURATED DIAGRAM LANDMARKS
  // ==========================================================================
  {
    id: 'pgo-curated-circular-4',
    name: '4-Phase Circular Loop Process Diagram',
    category: 'processes',
    categoryLabel: 'Processes & Steps',
    diagramType: 'circular-loop',
    steps: 4,
    color: 'blue',
    previewAccent: '#2563eb',
    desc: 'Landmark circular loop process diagram from Global Presentation Engine featuring 4 interconnected colored quadrants for continuous improvement, PDCA cycles, and agile sprints.',
    tags: ['circular', 'process', 'cycle', '4 steps', 'loop', 'pdca', 'agile', 'global'],
    slides: [
      {
        id: 1, layout: 'circular-loop', diagramType: 'circular-loop', tag: 'GLOBAL // PROCESS',
        title: '4-Phase Continuous Improvement Cycle',
        desc: 'Iterative operational cycle framework ensuring continuous improvement, seamless handoffs, and rapid delivery velocity.',
        features: [
          { num: 'Phase 1', title: 'Assess & Discover', desc: 'Synthesize operational telemetry, audit requirements, and define baseline metrics.' },
          { num: 'Phase 2', title: 'Architect & Build', desc: 'Rapid prototype iteration with client-side verification and modular component specs.' },
          { num: 'Phase 3', title: 'Verify & Deploy', desc: 'Zero-downtime release with automated compliance checks and latency audits.' },
          { num: 'Phase 4', title: 'Refine & Scale', desc: 'Incorporate user telemetry, optimize throughput, and prepare subsequent iteration.' }
        ],
        notes: 'Walk audience through each phase in a clockwise direction starting from Phase 1.'
      }
    ]
  },
  {
    id: 'pgo-curated-zigzag-5',
    name: '5-Step Zigzag Diamond Process Diagram',
    category: 'processes',
    categoryLabel: 'Processes & Steps',
    diagramType: 'zigzag-process',
    steps: 5,
    color: 'cyan',
    previewAccent: '#0891b2',
    desc: 'Signature Global Presentation Engine zigzag process diagram featuring 5 diamond milestone nodes alternating across a dynamic connecting path line.',
    tags: ['zigzag', 'process', 'steps', 'diamond', 'flow', 'milestones', '5 steps', 'global'],
    slides: [
      {
        id: 1, layout: 'zigzag-process', diagramType: 'zigzag-process', tag: 'GLOBAL // PROCESS',
        title: '5-Step Zigzag Diamond Process Track',
        desc: 'Alternating sequential process flow guiding strategic execution through five structured milestones.',
        features: [
          { num: '01', title: 'Foundation Baseline', desc: 'Establish core in-memory runtime architecture and security charters.' },
          { num: '02', title: 'Velocity Acceleration', desc: 'Deploy rapid iterative microservices with sub-millisecond execution.' },
          { num: '03', title: 'Enterprise Scaling', desc: 'Expand pilot across global subsidiary units with automated governance.' },
          { num: '04', title: 'Performance Tuning', desc: 'Sub-millisecond latency audit and fine-tuning across client hardware.' },
          { num: '05', title: 'Apex Maturity', desc: 'Achieve fully autonomous operation with continuous cognitive monitoring.' }
        ],
        notes: 'Follow the zigzag path from Step 01 at the bottom left to Step 05 at the apex.'
      }
    ]
  },
  {
    id: 'pgo-curated-chevron-4',
    name: '4-Stage Chevron Arrow Process Flow',
    category: 'processes',
    categoryLabel: 'Processes & Steps',
    diagramType: 'chevron-flow',
    steps: 4,
    color: 'green',
    previewAccent: '#059669',
    desc: 'Interlocking horizontal chevron process diagram illustrating linear sequential stages from discovery to global launch.',
    tags: ['chevron', 'arrow', 'process', 'linear', 'flow', 'stages', 'global'],
    slides: [
      {
        id: 1, layout: 'chevron-flow', diagramType: 'chevron-flow', tag: 'GLOBAL // PROCESS',
        title: '4-Stage Chevron Sequential Process Flow',
        desc: 'Direct linear workflow with interlocking arrows guiding cross-functional teams from discovery to launch.',
        features: [
          { num: 'Stage 1', title: 'Market Discovery', desc: 'Analyze competitive landscapes, evaluate user friction, and finalize charters.' },
          { num: 'Stage 2', title: 'Concept Architecture', desc: 'Prototype core technical specifications and validate client-side data schemas.' },
          { num: 'Stage 3', title: 'Validation & Audit', desc: 'Conduct penetration testing, security certification, and performance benchmarking.' },
          { num: 'Stage 4', title: 'Global Launch', desc: 'Deploy verified packages to production edge nodes with zero cloud downtime.' }
        ],
        notes: 'Walk audience through stages sequentially from left to right.'
      }
    ]
  },
  {
    id: 'pgo-curated-swot-matrix',
    name: 'Strategic 2x2 SWOT Analysis Matrix',
    category: 'matrix',
    categoryLabel: 'Matrix & SWOT',
    diagramType: 'swot-matrix',
    steps: 4,
    color: 'blue',
    previewAccent: '#2563eb',
    desc: 'Classic 2x2 SWOT analysis matrix from Global Presentation Engine with dedicated color-coded quadrants for Strengths, Weaknesses, Opportunities, and Threats.',
    tags: ['swot', 'matrix', 'strategy', 'analysis', 'strengths', 'weaknesses', 'opportunities', 'threats', 'global'],
    slides: [
      {
        id: 1, layout: 'swot-matrix', diagramType: 'swot-matrix', tag: 'GLOBAL // STRATEGY',
        title: 'Strategic Enterprise SWOT Analysis',
        desc: 'Holistic 2x2 strategic framework synthesizing internal organizational capabilities against external market dynamics.',
        features: [
          { num: 'S', title: 'Strengths', desc: 'Proprietary zero-database in-memory computing runtime delivering sub-millisecond document execution.' },
          { num: 'W', title: 'Weaknesses', desc: 'Brand recognition in legacy non-technical corporate cohorts currently dominated by legacy bundles.' },
          { num: 'O', title: 'Opportunities', desc: 'Accelerating global regulatory mandates demanding sovereign, air-gapped data retention and client privacy.' },
          { num: 'T', title: 'Threats', desc: 'Aggressive predatory pricing from legacy cloud hyperscalers attempting to bundle inferior web apps.' }
        ],
        notes: 'Lead executive committee through each quadrant: Strengths, Weaknesses, Opportunities, and Threats.'
      }
    ]
  },
  {
    id: 'pgo-curated-pyramid-maslow',
    name: '5-Tier Maslow Hierarchy Pyramid Diagram',
    category: 'pyramids',
    categoryLabel: 'Pyramids & Hierarchy',
    diagramType: 'pyramid-hierarchy',
    steps: 5,
    color: 'amber',
    previewAccent: '#d97706',
    desc: 'Five-level segmented hierarchy pyramid from Global Presentation Engine illustrating layered foundations, capability tiers, or psychological hierarchies.',
    tags: ['pyramid', 'hierarchy', 'maslow', 'levels', 'foundation', 'tiers', 'structure', 'global'],
    slides: [
      {
        id: 1, layout: 'pyramid-hierarchy', diagramType: 'pyramid-hierarchy', tag: 'GLOBAL // HIERARCHY',
        title: '5-Tier Enterprise Value Pyramid',
        desc: 'Hierarchical structural capability model mapping baseline runtime necessities up to apex cognitive innovation.',
        features: [
          { num: 'L5', title: 'Apex Innovation', desc: 'Autonomous edge execution with neural cognitive co-pilots.' },
          { num: 'L4', title: 'Cognitive Velocity', desc: 'Real-time contextual insights with zero retrieval delay.' },
          { num: 'L3', title: 'Collaborative Fluidity', desc: 'Cross-functional document and matrix synchronization.' },
          { num: 'L2', title: 'Security & Governance', desc: 'Cryptographic data sealing and zero telemetry leakage.' },
          { num: 'L1', title: 'Foundation Runtime', desc: '100% in-memory client execution on local hardware.' }
        ],
        notes: 'Explain how each upper tier depends on the unshakeable foundation of the tiers beneath it.'
      }
    ]
  },
  {
    id: 'pgo-curated-funnel-sales',
    name: '4-Stage Sales & Conversion Funnel Diagram',
    category: 'funnels',
    categoryLabel: 'Funnels & Pipelines',
    diagramType: 'funnel-stages',
    steps: 4,
    color: 'purple',
    previewAccent: '#7c3aed',
    desc: 'Four-stage customer acquisition conversion funnel from Global Presentation Engine with percentage attrition metrics and stage-gate qualification criteria.',
    tags: ['funnel', 'sales', 'conversion', 'stages', 'pipeline', 'marketing', 'acquisition', 'global'],
    slides: [
      {
        id: 1, layout: 'funnel-stages', diagramType: 'funnel-stages', tag: 'GLOBAL // CONVERSION',
        title: 'Customer Acquisition Conversion Funnel',
        desc: 'Stage-gate conversion tracking across four defined lifecycle phases with attrition telemetry.',
        features: [
          { num: 'Stage 1', title: 'Awareness (100%)', desc: '150,000 unique organic visitors discovering sovereign productivity suite.' },
          { num: 'Stage 2', title: 'Interest (45%)', desc: '67,500 active monthly prospects exploring presentation and spreadsheet tools.' },
          { num: 'Stage 3', title: 'Decision (15%)', desc: '22,500 enterprise teams initiating security audits and internal trials.' },
          { num: 'Stage 4', title: 'Action (4.2%)', desc: '6,300 annual corporate contracts signed with dedicated air-gapped support.' }
        ],
        notes: 'Review conversion percentages at each stage gate with the revenue committee.'
      }
    ]
  },
  {
    id: 'pgo-curated-radial-6',
    name: 'Radial 6-Spoke Concept Hub Diagram',
    category: 'diagrams',
    categoryLabel: 'Charts & Diagrams',
    diagramType: 'radial-cycle',
    steps: 6,
    color: 'cyan',
    previewAccent: '#0891b2',
    desc: 'Global Presentation Engine signature radial concept hub featuring a central strategic nucleus surrounded by 6 interconnected satellite nodes.',
    tags: ['radial', 'spoke', 'hub', 'concept', 'circle', '6 steps', 'central', 'global'],
    slides: [
      {
        id: 1, layout: 'radial-cycle', diagramType: 'radial-cycle', tag: 'GLOBAL // CONCEPT',
        title: 'Radial 6-Spoke Central Concept Hub',
        desc: 'Unified architecture mapping six decentralized operational capabilities to a central sovereign nucleus.',
        features: [
          { num: 'Core', title: 'Sovereign Nucleus', desc: '100% In-memory execution engine' },
          { num: '01', title: 'Drift Studio', desc: 'A4 typographic document composer' },
          { num: '02', title: 'Axis Engine', desc: 'Financial matrix calculation grid' },
          { num: '03', title: 'Kinetic Stage', desc: '16:9 widescreen presentation deck' },
          { num: '04', title: 'Aegis Studio', desc: 'Cryptographic PDF document sealing' },
          { num: '05', title: 'Zero DB', desc: 'Local memory preservation vault' },
          { num: '06', title: 'Universal Parity', desc: 'Native M365 file format interchange' }
        ],
        notes: 'Explain how every satellite node directly communicates with the central sovereign core.'
      }
    ]
  },
  {
    id: 'pgo-curated-venn-3',
    name: '3-Circle Strategic Venn Diagram',
    category: 'diagrams',
    categoryLabel: 'Charts & Diagrams',
    diagramType: 'venn-diagram',
    steps: 3,
    color: 'green',
    previewAccent: '#059669',
    desc: 'Global Presentation Engine 3-circle overlapping Venn diagram illustrating the sweet spot where technical capability, market demand, and business viability intersect.',
    tags: ['venn', 'diagram', 'circles', 'overlap', 'intersection', 'sweet spot', 'global'],
    slides: [
      {
        id: 1, layout: 'venn-diagram', diagramType: 'venn-diagram', tag: 'GLOBAL // INTERSECTION',
        title: 'Strategic 3-Circle Convergence Venn Diagram',
        desc: 'Identifying the apex competitive sweet spot where technical excellence, market demand, and sovereign security intersect.',
        features: [
          { num: 'Set A', title: 'Sub-MS Performance', desc: 'Client-side hardware acceleration and zero-latency vector rendering.' },
          { num: 'Set B', title: 'Zero-Cloud Sovereignty', desc: 'Complete client data privacy, air-gapped safety, and zero telemetry.' },
          { num: 'Set C', title: 'Full Office Parity', desc: 'Seamless bidirectional compatibility with legacy PPTX, DOCX, and XLSX standards.' }
        ],
        notes: 'Focus attention on the central tri-set intersection: the ultimate sovereign sweet spot.'
      }
    ]
  },
  {
    id: 'pgo-curated-pricing-table',
    name: '3-Tier Enterprise Pricing Comparison Matrix',
    category: 'tables',
    categoryLabel: 'Tables & Pricing',
    diagramType: 'comparison-table',
    steps: 3,
    color: 'dark',
    previewAccent: '#18181b',
    desc: 'Clean 3-tier pricing comparison matrix from Global Presentation Engine detailing Starter, Professional, and Sovereign Enterprise tiers.',
    tags: ['pricing', 'table', 'tiers', 'comparison', 'saas', 'subscription', 'plans', 'global'],
    slides: [
      {
        id: 1, layout: 'comparison-table', diagramType: 'comparison-table', tag: 'GLOBAL // PRICING',
        title: 'SaaS 3-Tier Enterprise Pricing Comparison',
        desc: 'Transparent pricing matrix detailing Starter, Professional, and Sovereign Enterprise tiers.',
        features: [
          { num: '$0', title: 'Starter Free', desc: 'Complete 4-tool suite; local in-memory storage; universal exports.' },
          { num: '$29', title: 'Professional (Popular)', desc: 'Full Global Presentation Engine 3,500+ library; custom shapes; local disk sync; advanced formulas.' },
          { num: '$89', title: 'Sovereign Enterprise', desc: 'Air-gapped deployment; custom cryptographic PKI seals; priority enterprise support.' }
        ],
        notes: 'Recommend the Professional tier for executive teams.'
      }
    ]
  }
];

// ============================================================================
// 4. RICH GENERATOR ARCHETYPES (COVERING ALL CATEGORIES & PRESENTATION DECKS)
// ============================================================================

const GENERATOR_ARCHETYPES = [
  // 1. Deck
  { catId: 'presentation', catLabel: 'Executive Presentation Decks', name: 'Executive Board Briefing Deck', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'corporate-navy', steps: 6 },
  // 2. Timeline
  { catId: 'timelines', catLabel: 'Timelines & Roadmaps', name: 'Winding Milestone Road Journey', diagramType: 'milestone-road', isDeck: false, steps: 4 },
  // 3. Process
  { catId: 'processes', catLabel: 'Processes & Steps', name: '4-Phase Circular Loop Process', diagramType: 'circular-loop', isDeck: false, steps: 4 },
  // 4. Matrix
  { catId: 'matrix', catLabel: 'Matrix & SWOT', name: 'Strategic 2x2 SWOT Analysis Matrix', diagramType: 'swot-matrix', isDeck: false, steps: 4 },
  // 5. Deck
  { catId: 'presentation', catLabel: 'Executive Presentation Decks', name: 'High-Impact Venture Pitch Presentation', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'crimson-venture', steps: 6 },
  // 6. Funnel
  { catId: 'funnels', catLabel: 'Funnels & Pipelines', name: '4-Stage 3D Sales Conversion Funnel', diagramType: 'funnel-stages', isDeck: false, steps: 4 },
  // 7. Pyramid
  { catId: 'pyramids', catLabel: 'Pyramids & Hierarchy', name: '5-Tier Maslow Hierarchy Pyramid', diagramType: 'pyramid-hierarchy', isDeck: false, steps: 5 },
  // 8. Diagram
  { catId: 'diagrams', catLabel: 'Charts & Diagrams', name: 'Hand-Drawn Sketch Speech Bubbles', diagramType: 'speech-bubbles', isDeck: false, steps: 3 },
  // 9. Table
  { catId: 'tables', catLabel: 'Tables & Pricing', name: 'SaaS 3-Tier Enterprise Pricing Table', diagramType: 'comparison-table', isDeck: false, steps: 3 },
  // 10. Deck
  { catId: 'presentation', catLabel: 'Executive Presentation Decks', name: 'Modern Tech Horizon & AI Deck', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'creative-gradient', steps: 6 },
  // 11. Process
  { catId: 'processes', catLabel: 'Processes & Steps', name: 'Pentagon Banner Flag Process', diagramType: 'pentagon-flags', isDeck: false, steps: 3 },
  // 12. Timeline
  { catId: 'timelines', catLabel: 'Timelines & Roadmaps', name: 'Horizontal Milestone Chronology Timeline', diagramType: 'horizontal-timeline', isDeck: false, steps: 4 },
  // 13. Matrix
  { catId: 'matrix', catLabel: 'Matrix & SWOT', name: 'Hexagon Honeycomb Strategy Cluster', diagramType: 'hexagon-cluster', isDeck: false, steps: 6 },
  // 14. Deck
  { catId: 'presentation', catLabel: 'Executive Presentation Decks', name: 'Quarterly Business Review (QBR) Deck', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'corporate-navy', steps: 6 },
  // 15. Diagram
  { catId: 'diagrams', catLabel: 'Charts & Diagrams', name: 'Radial 6-Spoke Central Concept Hub', diagramType: 'radial-cycle', isDeck: false, steps: 6 },
  // 16. Process
  { catId: 'processes', catLabel: 'Processes & Steps', name: 'Interlocking Gears Process Diagram', diagramType: 'gears-process', isDeck: false, steps: 3 },
  // 17. Deck
  { catId: 'presentation', catLabel: 'Executive Presentation Decks', name: 'Minimalist Creative Showcase Presentation', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'obsidian-minimal', steps: 6 },
  // 18. Funnel
  { catId: 'funnels', catLabel: 'Funnels & Pipelines', name: 'Customer Journey Acquisition Pipeline', diagramType: 'funnel-stages', isDeck: false, steps: 4 },
  // 19. Process
  { catId: 'processes', catLabel: 'Processes & Steps', name: '5-Step Zigzag Diamond Process Track', diagramType: 'zigzag-process', isDeck: false, steps: 5 },
  // 20. Deck
  { catId: 'presentation', catLabel: 'Executive Presentation Decks', name: 'SaaS Enterprise Proposal & Roadmap Deck', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'emerald-growth', steps: 6 },
  // 21. Pyramid
  { catId: 'pyramids', catLabel: 'Pyramids & Hierarchy', name: 'Capability Foundation Stepped Pyramid', diagramType: 'pyramid-hierarchy', isDeck: false, steps: 5 },
  // 22. Diagram
  { catId: 'diagrams', catLabel: 'Charts & Diagrams', name: '3-Circle Strategic Convergence Venn', diagramType: 'venn-diagram', isDeck: false, steps: 3 },
  // 23. Timeline
  { catId: 'timelines', catLabel: 'Timelines & Roadmaps', name: 'Strategic Quarterly Horizon Track', diagramType: 'horizontal-timeline', isDeck: false, steps: 4 },
  // 24. Process
  { catId: 'processes', catLabel: 'Processes & Steps', name: '4-Stage Chevron Arrow Process Flow', diagramType: 'chevron-flow', isDeck: false, steps: 4 },
  // 25. Table
  { catId: 'tables', catLabel: 'Tables & Pricing', name: 'Competitive Feature Scorecard Table', diagramType: 'comparison-table', isDeck: false, steps: 3 },
  // 26. Theme Deck
  { catId: 'themes', catLabel: 'Themes & Palettes', name: 'Nordic Emerald Sustainable Presentation Deck', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'forest-eco', steps: 6 },
  // 27. Matrix
  { catId: 'matrix', catLabel: 'Matrix & SWOT', name: 'Executive Risk & Opportunity Grid', diagramType: 'swot-matrix', isDeck: false, steps: 4 },
  // 28. Funnel
  { catId: 'funnels', catLabel: 'Funnels & Pipelines', name: 'Lead Qualification Stage-Gate Funnel', diagramType: 'funnel-stages', isDeck: false, steps: 4 },
  // 29. Theme Deck
  { catId: 'themes', catLabel: 'Themes & Palettes', name: 'Sunset Warmth Marketing Presentation Deck', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'sunset-warm', steps: 6 },
  // 30. Diagram
  { catId: 'diagrams', catLabel: 'Charts & Diagrams', name: 'Core Ecosystem Spoke Architecture', diagramType: 'radial-cycle', isDeck: false, steps: 6 },
  // 31. Pyramid
  { catId: 'pyramids', catLabel: 'Pyramids & Hierarchy', name: 'Organizational Value Pyramid', diagramType: 'pyramid-hierarchy', isDeck: false, steps: 5 },
  // 32. Theme Deck
  { catId: 'themes', catLabel: 'Themes & Palettes', name: 'Cyber Matrix Cryptographic Deck', diagramType: 'presentation-collage', isDeck: true, slideCount: 6, theme: 'cyber-matrix', steps: 6 },
  // 33. Timeline
  { catId: 'timelines', catLabel: 'Timelines & Roadmaps', name: 'Curved Delivery Highway Journey', diagramType: 'milestone-road', isDeck: false, steps: 4 }
];

const DOMAINS = [
  'Enterprise Strategy',
  'Venture Capital',
  'Frontier AI & Neural Systems',
  'Cloud & Sovereign Computing',
  'Global Supply Chain',
  'Clinical Healthcare & Biotech',
  'Financial Markets & Wealth',
  'Cybersecurity & Zero-Trust',
  'Product Engineering & Design',
  'Omnichannel Digital Marketing',
  'Corporate Governance & ESG',
  'E-Commerce & Retail Scale',
  'Aerospace & Defense Systems',
  'Talent, Culture & Operations',
  'Customer Success & Retention',
  'Global Real Estate & Infrastructure'
];

const PALETTES = [
  { color: 'blue', hex: '#2563eb', label: 'Sapphire Blue' },
  { color: 'green', hex: '#059669', label: 'Emerald Green' },
  { color: 'red', hex: '#dc2626', label: 'Crimson Red' },
  { color: 'purple', hex: '#7c3aed', label: 'Violet Purple' },
  { color: 'cyan', hex: '#0891b2', label: 'Teal & Cyan' },
  { color: 'amber', hex: '#d97706', label: 'Amber & Gold' },
  { color: 'dark', hex: '#18181b', label: 'Obsidian Dark' }
];

const THEME_STYLES = [
  'corporate-navy',
  'crimson-venture',
  'creative-gradient',
  'obsidian-minimal',
  'medical-clean',
  'cyber-matrix',
  'sunset-warm',
  'nordic-frost',
  'violet-luxury',
  'emerald-growth',
  'luxury-gold',
  'electric-indigo',
  'slate-industrial',
  'rose-vibrant',
  'forest-eco',
  'copper-wealth'
];

/**
 * Procedurally synthesize 3,500+ templates with rich slides, interleaved categories,
 * authentic Executive presentation decks, diverse diagrams, and zero monotonous repetition!
 */
function buildPresentationGoCatalog() {
  const catalog = CURATED_LANDMARKS.map(tpl => ({
    ...tpl,
    slides: (tpl.slides || []).map(s => ({
      ...s,
      themeStyle: s.themeStyle || tpl.themeStyle,
      previewAccent: s.previewAccent || tpl.previewAccent,
      color: s.color || tpl.color,
      deckName: tpl.name
    }))
  }));
  let idCounter = 1;
  const totalArchetypes = GENERATOR_ARCHETYPES.length;

  for (let step = 0; step < 3600; step++) {
    const arch = GENERATOR_ARCHETYPES[step % totalArchetypes];
    const dom = DOMAINS[Math.floor(step / totalArchetypes) % DOMAINS.length];
    const pal = PALETTES[(step + Math.floor(step / totalArchetypes)) % PALETTES.length];
    const steps = arch.steps || 4;
    const tplId = `pgo-${arch.catId}-${idCounter}`;
    const tplName = `${arch.name} // ${dom}`;
    const tagCode = `GLOBAL // ${arch.catId.toUpperCase()}`;
    const isDeck = arch.isDeck;
    const themeStyle = arch.theme || THEME_STYLES[idCounter % THEME_STYLES.length];

    let slides = [];

        if (isDeck) {
          // --- FULL MULTI-SLIDE PRESENTATION PRESENTATION DECK (6 SLIDES) ---
          slides = [
            {
              id: 1, layout: 'title', tag: `${dom.toUpperCase()} // BRIEFING`,
              title: `${dom}: Strategic Overview`,
              desc: `Comprehensive presentation deck for executive briefing, alignment, and review.`,
              features: [
                { num: '01', title: 'Strategic Priorities', desc: `Critical milestones guiding our ${dom.toLowerCase()} agenda.` },
                { num: '02', title: 'Operational Speed', desc: 'Zero-cloud in-memory client execution engine.' },
                { num: '03', title: 'Measurable Impact', desc: 'Delivering verified quantitative outcomes.' }
              ],
              notes: `Introduce the core objectives for ${dom}.`
            },
            {
              id: 2, layout: 'columns', tag: 'STRATEGIC PRIORITIES',
              title: `${dom} Core Pillars`,
              desc: `Three essential components driving operational acceleration.`,
              features: [
                { num: 'Pillar I', title: 'Foundation & Governance', desc: `Establishing rigorous baselines and compliance for ${dom.toLowerCase()}.` },
                { num: 'Pillar II', title: 'Execution Velocity', desc: 'Deploying high-speed in-memory workflows across teams.' },
                { num: 'Pillar III', title: 'Ecosystem Scale', desc: 'Expanding verified sovereign packages to enterprise nodes.' }
              ],
              notes: `Walk through each strategic pillar.`
            },
            {
              id: 3, layout: 'metrics', tag: 'KEY PERFORMANCE INDICATORS',
              title: `${dom} Performance Benchmarks`,
              desc: `Demonstrated metrics and measurable outcomes.`,
              features: [
                { num: '99.9%', title: 'Target Reliability', desc: 'Air-gapped edge execution uptime' },
                { num: '3.8x', title: 'Throughput Multiple', desc: 'Sub-millisecond processing speed lift' },
                { num: '100%', title: 'Data Sovereignty', desc: 'Zero external telemetry or database logging' }
              ],
              notes: `Review the quantitative metrics.`
            },
            {
              id: 4, layout: 'milestone-road', diagramType: 'milestone-road', tag: 'DELIVERY ROADMAP',
              title: `${dom} Execution Roadmap`,
              desc: `Sequential delivery milestones from inception to global rollout.`,
              features: [
                { num: 'Q1', title: 'Audit & Baseline', desc: 'Assess existing architecture and set KPIs' },
                { num: 'Q2', title: 'Rapid Prototype', desc: 'Deploy core modules with zero latency' },
                { num: 'Q3', title: 'Validation & Test', desc: 'Full compliance certification audit' },
                { num: 'Q4', title: 'Global Delivery', desc: 'Enterprise rollout across client nodes' }
              ],
              notes: `Walk stakeholders through the roadmap.`
            },
            {
              id: 5, layout: 'columns', tag: 'COMPETITIVE ADVANTAGE',
              title: 'Sovereign Advantage vs Legacy Tools',
              desc: `Direct performance and security comparison.`,
              features: [
                { num: 'Privacy', title: 'Zero Cloud Leaks', desc: '100% in-browser memory execution' },
                { num: 'Speed', title: 'Sub-Millisecond', desc: 'No network round-trips for document edits' },
                { num: 'Openness', title: 'Universal Parity', desc: 'Full native PPTX, DOCX, XLSX, and PDF export' }
              ],
              notes: 'Highlight key differentiators.'
            },
            {
              id: 6, layout: 'title', tag: 'CONCLUSION',
              title: 'Thank You // Q&A and Discussion',
              desc: `Empowering enterprise execution with Giri Orbit // executive@giri.com`,
              features: [
                { num: 'Web', title: 'giri-orbit.local', desc: 'Connect to private workspace' },
                { num: 'Contact', title: 'executive@giri.com', desc: 'Direct corporate inquiries' }
              ],
              notes: 'Open floor for questions.'
            }
          ];
        } else {
          // --- RICH DIAGRAM TEMPLATE (3 SLIDES: DIAGRAM + IMPLEMENTATION + METRICS) ---
          const features = [];
          if (arch.diagramType === 'swot-matrix') {
            features.push(
              { num: 'S', title: `${dom} Strengths`, desc: 'Core proprietary capabilities and speed advantage.' },
              { num: 'W', title: `${dom} Weaknesses`, desc: 'Ecosystem dependencies currently being transitioned.' },
              { num: 'O', title: `${dom} Opportunities`, desc: 'Emerging global demand for sovereign enterprise tools.' },
              { num: 'T', title: `${dom} Threats`, desc: 'Competitive market maneuvers from legacy multi-tenant suites.' }
            );
          } else if (arch.diagramType === 'milestone-road' || arch.diagramType === 'horizontal-timeline') {
            features.push(
              { num: 'Q1', title: `${dom} Discovery`, desc: 'Baseline telemetry audit and architecture sign-off.' },
              { num: 'Q2', title: `${dom} Development`, desc: 'Deployment of zero-cloud memory matrix and workspace.' },
              { num: 'Q3', title: `${dom} Validation`, desc: 'Sub-millisecond latency audit and compliance checks.' },
              { num: 'Q4', title: `${dom} Expansion`, desc: 'Full sovereign distribution across client hardware.' }
            );
          } else if (arch.diagramType === 'pentagon-flags') {
            features.push(
              { num: '1', title: 'Discover', desc: `Assess current ${dom.toLowerCase()} workflows.` },
              { num: '2', title: 'Develop', desc: 'Build zero-latency in-memory prototype.' },
              { num: '3', title: 'Deliver', desc: 'Roll out verified air-gapped solution.' }
            );
          } else if (arch.diagramType === 'speech-bubbles') {
            features.push(
              { num: '01', title: 'Chief Executive', desc: `“Giri Orbit accelerated our ${dom.toLowerCase()} delivery by over 40% in our very first quarter.”` },
              { num: '02', title: 'VP of Technology', desc: `“Zero cloud latency and instant PPTX export revolutionized how our team collaborates.”` },
              { num: '03', title: 'Compliance Lead', desc: `“Air-gapped data retention made our statutory security audit completely painless.”` }
            );
          } else if (arch.diagramType === 'gears-process') {
            features.push(
              { num: '01', title: 'Strategy', desc: `Unified vision guiding our ${dom.toLowerCase()} roadmap.` },
              { num: '02', title: 'Engineering', desc: 'High-speed in-memory calculation and rendering.' },
              { num: '03', title: 'Feedback', desc: 'Continuous user telemetry keeping software optimized.' }
            );
          } else if (arch.diagramType === 'pyramid-hierarchy') {
            features.push(
              { num: 'L5', title: `${dom} Apex Innovation`, desc: 'Autonomous edge execution with cognitive co-pilots.' },
              { num: 'L4', title: `${dom} Cognitive Velocity`, desc: 'Real-time contextual insights with zero retrieval delay.' },
              { num: 'L3', title: `${dom} Collaborative Fluidity`, desc: 'Cross-functional document and matrix synchronization.' },
              { num: 'L2', title: `${dom} Security & Governance`, desc: 'Cryptographic data sealing and zero telemetry leakage.' },
              { num: 'L1', title: `${dom} Foundation Runtime`, desc: '100% in-memory client execution on local hardware.' }
            );
          } else if (arch.diagramType === 'funnel-stages') {
            features.push(
              { num: 'Stage 1', title: `${dom} Awareness (100%)`, desc: 'Broad market reach and executive brand discovery.' },
              { num: 'Stage 2', title: `${dom} Interest (45%)`, desc: 'Active exploration of in-browser productivity engines.' },
              { num: 'Stage 3', title: `${dom} Decision (15%)`, desc: 'Private sovereign trial deployments within enterprises.' },
              { num: 'Stage 4', title: `${dom} Action (4.2%)`, desc: 'Long-term enterprise contract commitments and scale.' }
            );
          } else if (arch.diagramType === 'comparison-table') {
            features.push(
              { num: '$0', title: `${dom} Starter`, desc: 'Core workspace engines with local storage.' },
              { num: '$29', title: `${dom} Professional (Popular)`, desc: 'Full 3,500+ template library and disk sync.' },
              { num: '$89', title: `${dom} Enterprise`, desc: 'Air-gapped deployment and cryptographic PKI.' }
            );
          } else {
            for (let s = 1; s <= steps; s++) {
              features.push({
                num: `0${s}`,
                title: `${dom} Step ${s}`,
                desc: `Structured deliverable milestone for ${arch.name.toLowerCase()}.`
              });
            }
          }

          slides = [
            {
              id: 1,
              layout: arch.diagramType,
              diagramType: arch.diagramType,
              tag: tagCode,
              title: `${arch.name}: ${dom}`,
              desc: `Executive visual diagram template from the Global Presentation Engine Library. Engineered for clear communication, visual hierarchy, and strategic alignment.`,
              features: features,
              notes: `Present ${arch.name} focusing on the strategic goals for ${dom}.`
            },
            {
              id: 2,
              layout: 'columns',
              diagramType: 'columns',
              tag: `${arch.catId.toUpperCase()} IMPLEMENTATION`,
              title: `${dom} Execution Deliverables`,
              desc: `Key operational requirements and phase-gate milestones.`,
              features: features.slice(0, 3),
              notes: `Review tactical implementation dependencies.`
            },
            {
              id: 3,
              layout: 'metrics',
              diagramType: 'metrics',
              tag: 'TARGET METRICS',
              title: `${dom} Key Milestones`,
              desc: `Sustained performance metrics guiding the delivery team.`,
              features: [
                { num: '99.9%', title: 'Delivery SLA', desc: 'On-time milestone execution' },
                { num: '3.4x', title: 'Throughput Lift', desc: 'Efficiency gain over manual workflows' },
                { num: '100%', title: 'Audit Passed', desc: 'Full compliance verified' }
              ],
              notes: 'Review performance targets.'
            }
          ];
        }

        catalog.push({
          id: tplId,
          name: tplName,
          category: arch.catId,
          categoryLabel: arch.catLabel,
          diagramType: arch.diagramType,
          themeStyle: themeStyle,
          steps: steps,
          optionsText: isDeck ? `${slides.length} slides` : `${steps} options`,
          color: pal.color,
          previewAccent: pal.hex,
          desc: isDeck
            ? `Complete ${slides.length}-slide cinematic presentation deck for ${dom}. Includes executive briefing, strategy pillars, metrics, timeline, and closing slides with ${themeStyle} styling.`
            : `Global Presentation Engine ${arch.name} visual diagram template customized for ${dom}. Includes ${steps} stages with ${pal.label} accent styling.`,
          tags: [
            arch.catId,
            arch.diagramType,
            dom.toLowerCase(),
            `${steps} steps`,
            pal.color,
            'global',
            isDeck ? 'presentation' : 'diagram',
            isDeck ? 'deck' : 'chart'
          ],
          slides: slides.map(s => ({
            ...s,
            themeStyle: themeStyle,
            previewAccent: pal.hex,
            color: pal.color,
            deckName: tplName
          }))
        });

    idCounter++;
    if (catalog.length >= 3560) {
      return catalog;
    }
  }

  return catalog;
}

// Instantiate catalog once in memory
export const PRESENTATION_GO_TEMPLATES = buildPresentationGoCatalog();

/**
 * Filter the Global Presentation Engine catalog by multiple criteria
 */
export function filterPresentationGoTemplates(pool = PRESENTATION_GO_TEMPLATES, { query = '', category = 'all', steps = 'all', color = 'all' } = {}) {
  const q = (query || '').toLowerCase().trim();

  return pool.filter(tpl => {
    // Category match
    if (category !== 'all') {
      if (category === 'presentation') {
        if (tpl.category !== 'presentation' && tpl.diagramType !== 'presentation-collage' && tpl.diagramType !== 'powerpoint-deck' && tpl.category !== 'pitch' && tpl.category !== 'review') {
          return false;
        }
      } else if (tpl.category !== category) {
        return false;
      }
    }

    // Steps filter match
    if (steps !== 'all') {
      if (steps === '6') {
        if (tpl.steps < 6) return false;
      } else {
        const stepNum = parseInt(steps, 10);
        if (tpl.steps !== stepNum) return false;
      }
    }

    // Color filter match
    if (color !== 'all' && tpl.color !== color) {
      return false;
    }

    // Search query match
    if (q) {
      const matchName = tpl.name.toLowerCase().includes(q);
      const matchDesc = tpl.desc.toLowerCase().includes(q);
      const matchTags = tpl.tags?.some(t => t.includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    return true;
  });
}

/**
 * Get library telemetry & count
 */
export function getPresentationGoStats() {
  const pptCount = PRESENTATION_GO_TEMPLATES.filter(t => t.category === 'presentation' || t.diagramType === 'presentation-collage').length;
  return {
    total: PRESENTATION_GO_TEMPLATES.length,
    powerpointDecks: pptCount,
    categories: PRESENTATION_GO_CATEGORIES.length,
    colors: PRESENTATION_GO_COLORS.length
  };
}
