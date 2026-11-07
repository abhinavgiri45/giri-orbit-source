/**
 * ============================================================================
 * GIRI ORBIT — GLOBAL ENTERPRISE TEMPLATES REPOSITORY (templates.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * ============================================================================
 * Vast catalog of world-class, executive-designed templates for:
 * 1. Giri Axis (Spreadsheets & Financial Modeling)
 * 2. Giri Kinetic (Widescreen 16:9 Presentation Decks)
 * 3. Giri Drift (Executive Documents & Contracts)
 * 4. Giri Aegis (PDF Studio & Formal Memorandums)
 */

export {
  PRESENTATION_GO_TEMPLATES,
  PRESENTATION_GO_CATEGORIES,
  PRESENTATION_GO_COLORS,
  PRESENTATION_GO_STEP_FILTERS,
  filterPresentationGoTemplates,
  getPresentationGoStats
} from './presentationGoCatalog.js';

// ============================================================================
// 1. GIRI AXIS (SPREADSHEETS / EXCEL) GLOBAL TEMPLATES
// ============================================================================
export const AXIS_BUILTIN_TEMPLATES = [
  {
    id: 'annual-corporate-budget',
    name: 'Annual Corporate Operating Budget',
    category: 'budgets',
    desc: 'Full fiscal year operating expense model with quarterly projections and automated totals',
    previewAccent: '#107c41',
    data: {
      'A1': 'GIRI CORPORATION // ANNUAL OPERATING BUDGET 2026',
      'A3': 'Category', 'B3': 'Q1 Actual', 'C3': 'Q2 Proj', 'D3': 'Q3 Proj', 'E3': 'Q4 Proj', 'F3': 'Total FY26',
      'A4': 'R&D Engineering', 'B4': '125000', 'C4': '135000', 'D4': '140000', 'E4': '155000', 'F4': '=SUM(B4:E4)',
      'A5': 'Cloud Infrastructure', 'B5': '45000', 'C5': '48000', 'D5': '52000', 'E5': '55000', 'F5': '=SUM(B5:E5)',
      'A6': 'Executive Personnel', 'B6': '210000', 'C6': '215000', 'D6': '220000', 'E6': '230000', 'F6': '=SUM(B6:E6)',
      'A7': 'Legal & Compliance', 'B7': '32000', 'C7': '30000', 'D7': '28000', 'E7': '35000', 'F7': '=SUM(B7:E7)',
      'A8': 'Marketing & Brand', 'B8': '65000', 'C8': '72000', 'D8': '80000', 'E8': '95000', 'F8': '=SUM(B8:E8)',
      'A9': 'Total Operating Cost', 'B9': '=SUM(B4:B8)', 'C9': '=SUM(C4:C8)', 'D9': '=SUM(D4:D8)', 'E9': '=SUM(E4:E8)', 'F9': '=SUM(F4:F8)',
      'A11': 'Average Quarterly Burn', 'B11': '=AVERAGE(B9:E9)'
    }
  },
  {
    id: 'q4-income-statement',
    name: 'Q4 Income Statement & Profit Analysis',
    category: 'financials',
    desc: 'Executive GAAP income statement tracking Gross Margin, EBIT, and Net Income',
    previewAccent: '#059669',
    data: {
      'A1': 'GIRI GROUP // STATEMENT OF REVENUE & OPERATIONS',
      'A3': 'Metric', 'B3': 'October', 'C3': 'November', 'D3': 'December', 'E3': 'Q4 Total',
      'A4': 'Gross Client Billings', 'B4': '420000', 'C4': '485000', 'D4': '590000', 'E4': '=SUM(B4:D4)',
      'A5': 'Cost of Goods Sold (COGS)', 'B5': '84000', 'C5': '97000', 'D5': '118000', 'E5': '=SUM(B5:D5)',
      'A6': 'Gross Profit', 'B6': '=B4-B5', 'C6': '=C4-C5', 'D6': '=D4-D5', 'E6': '=E4-E5',
      'A7': 'Sales & Administrative', 'B7': '62000', 'C7': '68000', 'D7': '74000', 'E7': '=SUM(B7:D7)',
      'A8': 'Operating Income (EBIT)', 'B8': '=B6-B7', 'C8': '=C6-C7', 'D8': '=D6-D7', 'E8': '=E6-E7',
      'A9': 'Taxes & Provisions (18%)', 'B9': '=B8*0.18', 'C9': '=C8*0.18', 'D9': '=D8*0.18', 'E9': '=E8*0.18',
      'A10': 'Net Sovereign Income', 'B10': '=B8-B9', 'C10': '=C8-C9', 'D10': '=D8-D9', 'E10': '=E8-E9'
    }
  },
  {
    id: 'saas-metrics-dashboard',
    name: 'SaaS Metrics & Cohort Growth Matrix',
    category: 'financials',
    desc: 'Key SaaS benchmarks: ARR, MRR, Net Retention Rate (NRR), CAC Payback, and Magic Number',
    previewAccent: '#2563eb',
    data: {
      'A1': 'GIRI CLOUD // SAAS EXECUTIVE PERFORMANCE DASHBOARD',
      'A3': 'KPI Metric', 'B3': 'Q1 Actual', 'C3': 'Q2 Actual', 'D3': 'Q3 Target', 'E3': 'Q4 Target',
      'A4': 'Monthly Recurring Rev (MRR)', 'B4': '145000', 'C4': '182000', 'D4': '225000', 'E4': '280000',
      'A5': 'Annual Run Rate (ARR)', 'B5': '=B4*12', 'C5': '=C4*12', 'D5': '=D4*12', 'E5': '=E4*12',
      'A6': 'Gross Customer Additions', 'B6': '48', 'C6': '62', 'D6': '80', 'E6': '105',
      'A7': 'Customer Churn (%)', 'B7': '0.012', 'C7': '0.009', 'D7': '0.008', 'E7': '0.006',
      'A8': 'Net Revenue Retention', 'B8': '1.24', 'C8': '1.28', 'D8': '1.32', 'E8': '1.35',
      'A9': 'Customer Acquisition Cost (CAC)', 'B9': '2400', 'C9': '2250', 'D9': '2100', 'E9': '1950',
      'A10': 'LTV / CAC Ratio', 'B10': '4.8', 'C10': '5.2', 'D10': '5.7', 'E10': '6.1'
    }
  },
  {
    id: 'startup-cap-table',
    name: 'Startup Capitalization (Cap) Table',
    category: 'financials',
    desc: 'Founding equity, ESOP pool, and Pre/Post-Money valuation with dilution analysis',
    previewAccent: '#8b5cf6',
    data: {
      'A1': 'GIRI CORPORATION // MASTER CAPITALIZATION TABLE',
      'A3': 'Shareholder / Class', 'B3': 'Shares Owned', 'C3': 'Ownership %', 'D3': 'Invested Capital', 'E3': 'Implied Value',
      'A4': 'Abhinav Giri (Founder)', 'B4': '5500000', 'C4': '=B4/B8', 'D4': '150000', 'E4': '=C4*25000000',
      'A5': 'Co-Founding Executives', 'B5': '2000000', 'C5': '=B5/B8', 'D5': '50000', 'E5': '=C5*25000000',
      'A6': 'Employee Pool (ESOP)', 'B6': '1000000', 'C6': '=B6/B8', 'D6': '0', 'E6': '=C6*25000000',
      'A7': 'Series Seed Syndicate', 'B7': '1500000', 'C7': '=B7/B8', 'D7': '3000000', 'E7': '=C7*25000000',
      'A8': 'Total Fully Diluted Shares', 'B8': '=SUM(B4:B7)', 'C8': '=SUM(C4:C7)', 'D8': '=SUM(D4:D7)', 'E8': '=SUM(E4:E7)'
    }
  },
  {
    id: 'project-tracker-gantt',
    name: 'Enterprise Project Delivery Tracker',
    category: 'trackers',
    desc: 'Cross-functional milestone schedule with owner attribution, completion % and risk',
    previewAccent: '#0284c7',
    data: {
      'A1': 'GIRI ORBIT DEPLOYMENT ROADMAP',
      'A3': 'Deliverable', 'B3': 'Lead Architect', 'C3': 'Start Date', 'D3': 'Target Date', 'E3': 'Status', 'F3': 'Progress',
      'A4': 'In-Memory Physics Engine', 'B4': 'Abhinav Giri', 'C4': '2026-08-01', 'D4': '2026-08-20', 'E4': 'Completed', 'F4': '100%',
      'A5': 'M365 Fluent Ribbon System', 'B5': 'Kai Carter', 'C5': '2026-08-15', 'D5': '2026-09-01', 'E5': 'Completed', 'F5': '100%',
      'A6': 'Formula Evaluation Core', 'B6': 'Eleanor Vance', 'C6': '2026-08-25', 'D6': '2026-09-08', 'E6': 'Completed', 'F6': '100%',
      'A7': 'Service Worker Offline PWA', 'B7': 'DevOps Lead', 'C7': '2026-09-05', 'D7': '2026-09-12', 'E7': 'In Progress', 'F7': '95%',
      'A8': '1M Concurrency CDN Tuning', 'B8': 'Infrastructure', 'C8': '2026-09-10', 'D8': '2026-09-15', 'E8': 'In Progress', 'F8': '90%'
    }
  },
  {
    id: 'commercial-invoice-ledger',
    name: 'Commercial Accounts Receivable Ledger',
    category: 'invoices',
    desc: 'Multi-client invoice ledger with automated aging, payment reconciliation and tax sum',
    previewAccent: '#7c3aed',
    data: {
      'A1': 'GIRI CORPORATION // RECEIVABLES REGISTER',
      'A3': 'Inv #', 'B3': 'Corporate Client', 'C3': 'Billing Date', 'D3': 'Base Amount', 'E3': 'Tax (10%)', 'F3': 'Total Due', 'G3': 'Status',
      'A4': 'INV-801', 'B4': 'Apex Logistics Ltd', 'C4': '2026-08-28', 'D4': '14500', 'E4': '=D4*0.1', 'F4': '=D4+E4', 'G4': 'Paid',
      'A5': 'INV-802', 'B5': 'Nordic Sovereign Bank', 'C5': '2026-09-02', 'D5': '48200', 'E5': '=D5*0.1', 'F5': '=D5+E5', 'G5': 'Pending',
      'A6': 'INV-803', 'B6': 'Solaria Energy Corp', 'C6': '2026-09-04', 'D6': '29300', 'E6': '=D6*0.1', 'F6': '=D6+E6', 'G6': 'Paid',
      'A7': 'INV-804', 'B7': 'Vanguard BioSystems', 'C7': '2026-09-09', 'D7': '62000', 'E7': '=D7*0.1', 'F7': '=D7+E7', 'G7': 'Pending',
      'A8': 'Total Receivables', 'D8': '=SUM(D4:D7)', 'E8': '=SUM(E4:E7)', 'F8': '=SUM(F4:F7)'
    }
  },
  {
    id: 'balance-sheet-reserves',
    name: 'Corporate Balance Sheet & Reserves',
    category: 'financials',
    desc: 'Formal balance sheet structure tracking Current/Non-Current Assets, Liabilities, and Sovereign Equity',
    previewAccent: '#0d9488',
    data: {
      'A1': 'GIRI ENTERPRISE CONSOLIDATED BALANCE SHEET',
      'A3': 'ASSETS (in USD)', 'B3': 'FY2025 Audited', 'C3': 'FY2026 Proj', 'D3': 'Variance ($)',
      'A4': 'Cash & Liquid Reserves', 'B4': '4200000', 'C4': '6850000', 'D4': '=C4-B4',
      'A5': 'Marketable Securities', 'B5': '1500000', 'C5': '2100000', 'D5': '=C5-B5',
      'A6': 'Accounts Receivable', 'B6': '820000', 'C6': '940000', 'D6': '=C6-B6',
      'A7': 'Total Current Assets', 'B7': '=SUM(B4:B6)', 'C7': '=SUM(C4:C6)', 'D7': '=C7-B7',
      'A9': 'Property & Datacenter Compute', 'B9': '3400000', 'C9': '4200000', 'D9': '=C9-B9',
      'A10': 'Intellectual Property / Patents', 'B10': '2500000', 'C10': '2500000', 'D10': '=C10-B10',
      'A11': 'Total Non-Current Assets', 'B11': '=SUM(B9:B10)', 'C11': '=SUM(C9:C10)', 'D11': '=C11-B11',
      'A12': 'TOTAL CONSOLIDATED ASSETS', 'B12': '=B7+B11', 'C12': '=C7+C11', 'D12': '=C12-B12',
      'A14': 'LIABILITIES & EQUITY', 'B14': 'FY2025 Audited', 'C14': 'FY2026 Proj', 'D14': 'Variance ($)',
      'A15': 'Accounts Payable & Trade Due', 'B15': '610000', 'C15': '540000', 'D15': '=C15-B15',
      'A16': 'Long-Term Notes Payable', 'B16': '1800000', 'C16': '1500000', 'D16': '=C16-B16',
      'A17': 'Total Liabilities', 'B17': '=B15+B16', 'C17': '=C15+C16', 'D17': '=C17-B17',
      'A18': 'Common Stock & Retained Earnings', 'B18': '10010000', 'C18': '14550000', 'D18': '=C18-B18',
      'A19': 'TOTAL LIABILITIES & EQUITY', 'B19': '=B17+B18', 'C19': '=C17+C18', 'D19': '=C19-B19'
    }
  },
  {
    id: 'cash-flow-forecast',
    name: '12-Month Cash Flow Runway Model',
    category: 'budgets',
    desc: 'Monthly cash burn forecast modeling operating collections, disbursements, and runway months',
    previewAccent: '#15803d',
    data: {
      'A1': 'GIRI CORP // 12-MONTH CASH RUNWAY PROJECTION',
      'A3': 'Cash Flow Stream', 'B3': 'Month 1', 'C3': 'Month 2', 'D3': 'Month 3', 'E3': 'Q1 Total',
      'A4': 'Opening Cash Balance', 'B4': '3500000', 'C4': '=B10', 'D4': '=C10', 'E4': '=B4',
      'A5': 'Customer Subscription Cash In', 'B5': '280000', 'C5': '310000', 'D5': '350000', 'E5': '=SUM(B5:D5)',
      'A6': 'Enterprise Licensing Receipts', 'B6': '120000', 'C6': '150000', 'D6': '180000', 'E6': '=SUM(B6:D6)',
      'A7': 'Total Cash Inflows', 'B7': '=SUM(B5:B6)', 'C7': '=SUM(C5:C6)', 'D7': '=SUM(D5:D6)', 'E7': '=SUM(E5:E6)',
      'A8': 'Operating Disbursements (Payroll+Cloud)', 'B8': '195000', 'C8': '205000', 'D8': '215000', 'E8': '=SUM(B8:D8)',
      'A9': 'Net Monthly Cash Flow', 'B9': '=B7-B8', 'C9': '=C7-C8', 'D9': '=D7-D8', 'E9': '=SUM(B9:D9)',
      'A10': 'Closing Cash Balance', 'B10': '=B4+B9', 'C10': '=C4+C9', 'D10': '=D4+D9', 'E10': '=D10'
    }
  }
];

// ============================================================================
// 2. GIRI KINETIC (PRESENTATION STUDIO) GLOBAL TEMPLATES (16 DECKS)
// ============================================================================
export const KINETIC_BUILTIN_TEMPLATES = [
  // --- 1. PITCH DECKS & CAPITAL RAISING ---
  {
    id: 'executive-pitch-deck',
    name: 'Executive Venture Pitch Presentation',
    category: 'pitch',
    desc: 'Series A / Venture Capital Investment Presentation: Problem, Solution, Traction, Market Size, and Capital Ask',
    previewAccent: '#c43e1c',
    themeStyle: 'crimson-venture',
    slides: [
      {
        id: 1, layout: 'title', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#c43e1c', tag: 'INVESTOR BRIEFING',
        title: 'Giri Orbit // Sovereign Productivity Cloud',
        desc: 'Unbinding enterprise thought: Zero-database in-memory computing with fluid vector motion.',
        features: [
          { num: '60 FPS', title: 'Vector Motion', desc: 'Sub-millisecond inertia damping physics' },
          { num: '0 KB', title: 'Zero-DB Core', desc: '100% Client-side privacy and cryptographic safety' },
          { num: '1M/s', title: 'Peak Scale', desc: 'Edge-cached PWA offline execution' }
        ],
        notes: 'Welcome partners. Introduce the core value proposition of Giri Orbit as the premier sovereign office suite.'
      },
      {
        id: 2, layout: 'metrics', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#c43e1c', tag: 'MARKET TRACTION',
        title: 'Explosive Enterprise Velocity',
        desc: 'Addressing the 84% cognitive fatigue created by traditional latency-heavy browser software.',
        features: [
          { num: '84%', title: 'Context Retention', desc: 'Unified single-viewport workspace' },
          { num: '0ms', title: 'Local Latency', desc: 'Instant calculation and rendering' },
          { num: '10x', title: 'Efficiency Dividend', desc: 'Enterprise team throughput multiple' }
        ],
        notes: 'Highlight our performance benchmarks compared to legacy suites.'
      },
      {
        id: 3, layout: 'columns', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#c43e1c', tag: 'PRODUCT TOPOLOGY',
        title: 'Four Dedicated Power Engines',
        desc: 'Documents, Spreadsheets, Presentations, and PDF Studio unified within a single lightweight zero-cloud shell.',
        features: [
          { num: 'Drift', title: 'Word Processor', desc: 'A4 typography and document composer' },
          { num: 'Axis', title: 'Spreadsheet Matrix', desc: 'High-velocity financial calculations' },
          { num: 'Kinetic', title: 'Cinematic Presentations', desc: '16:9 widescreen presentation shows' }
        ],
        notes: 'Demonstrate instant tool switching with Ctrl+1 through Ctrl+5.'
      },
      {
        id: 4, layout: 'comparison', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#c43e1c', tag: 'BUSINESS MODEL & CAPITAL ASK',
        title: '$15M Series A Acceleration',
        desc: 'Capital allocation toward global distribution, zero-knowledge sync, and localized enterprise deployments.',
        features: [
          { num: '45%', title: 'R&D & Engineering', desc: 'WebAssembly engine optimization' },
          { num: '35%', title: 'Enterprise Go-To-Market', desc: 'Global Fortune 500 sales team' },
          { num: '20%', title: 'Security Audits', desc: 'SOC2 Type II & ISO 27001 sovereign accreditation' }
        ],
        notes: 'Close the pitch by reiterating valuation terms and investment timeline.'
      }
    ]
  },
  {
    id: 'yc-minimalist-pitch',
    name: 'Y-Combinator Clean Seed Pitch',
    category: 'pitch',
    desc: 'Ultra-concise seed round pitch presentation focusing on unfair advantage, growth rate, and founder pedigree',
    previewAccent: '#ea580c',
    themeStyle: 'sunset-warm',
    slides: [
      {
        id: 1, layout: 'title', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#ea580c', tag: 'SEED PITCH',
        title: 'Reinventing the Modern Office Suite',
        desc: 'The fastest, privacy-first software suite running 100% in browser memory with zero tracking.',
        features: [
          { num: 'Problem', title: 'Cloud Latency & Bloat', desc: 'Users lose 2.3 hours daily to sluggish enterprise tools' },
          { num: 'Solution', title: 'In-Memory Engine', desc: 'Sub-millisecond responsiveness with local data sovereignty' },
          { num: 'Growth', title: '40% MoM Organic', desc: 'Pure word-of-mouth adoption across engineers & executives' }
        ],
        notes: 'Keep opening concise: explain why legacy tools are broken.'
      },
      {
        id: 2, layout: 'columns', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#ea580c', tag: 'SECRET SAUCE',
        title: 'Why Giri Orbit Wins',
        desc: 'Zero server database overhead means infinite scalability with near-zero marginal infrastructure cost.',
        features: [
          { num: '$0', title: 'Database Cost', desc: 'Zero cloud database hosting expense' },
          { num: '100%', title: 'File Parity', desc: 'Full native import/export with standard Office suites' },
          { num: 'Global', title: 'Edge Network', desc: 'Instant load anywhere on Earth' }
        ],
        notes: 'Detail our architectural advantage over legacy software.'
      }
    ]
  },
  {
    id: 'ai-deeptech-venture',
    name: 'Frontier AI & Autonomous Systems',
    category: 'pitch',
    desc: 'DeepTech investor briefing for generative computing, local LLMs, and neural memory networks',
    previewAccent: '#8b5cf6',
    themeStyle: 'creative-gradient',
    slides: [
      {
        id: 1, layout: 'title', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#8b5cf6', tag: 'DEEPTECH 2027',
        title: 'Local-First Autonomous Intelligence',
        desc: 'Running frontier cognitive intelligence directly on consumer and enterprise edge hardware.',
        features: [
          { num: '0 ms', title: 'Cloud Roundtrip', desc: 'Edge neural weight execution' },
          { num: '100%', title: 'Air-Gapped Privacy', desc: 'Confidential enterprise data never leaves device' },
          { num: '4x', title: 'Energy Efficiency', desc: 'Quantized neural kernels tuned for silicon' }
        ],
        notes: 'Present the case for local-first artificial intelligence over centralized API clouds.'
      },
      {
        id: 2, layout: 'metrics', bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)', accent: '#8b5cf6', tag: 'BENCHMARKS',
        title: 'Unrivaled Inferencing Velocity',
        desc: 'Direct GPU shader execution delivering real-time document analysis and generative design.',
        features: [
          { num: '185 t/s', title: 'Token Throughput', desc: 'Native WebGPU acceleration' },
          { num: '1.2 GB', title: 'Memory Footprint', desc: 'Compressed model weight runtime' },
          { num: '99.4%', title: 'Recall Accuracy', desc: 'Zero-hallucination structured document synthesis' }
        ],
        notes: 'Show live throughput benchmarks.'
      }
    ]
  },

  // --- 2. EXECUTIVE STRATEGY & REVIEWS ---
  {
    id: 'quarterly-strategy-review',
    name: 'Quarterly Executive Business Review (QBR)',
    category: 'review',
    desc: 'Quarterly review presentation with departmental OKRs, revenue waterfalls, and headcount roadmap',
    previewAccent: '#b91c1c',
    themeStyle: 'corporate-navy',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)', accent: '#b91c1c', tag: 'STRATEGY 2026',
        title: 'Q3 Executive Business Review',
        desc: 'Consolidated performance overview and Strategic Priorities for Giri Corporation subsidiary units.',
        features: [
          { num: '99.9%', title: 'SLA Uptime', desc: 'Uninterrupted local edge execution' },
          { num: '$14.2M', title: 'Recognized ARR', desc: '38% YoY revenue acceleration' },
          { num: '140+', title: 'Enterprise Clients', desc: 'Global corporate deployments' }
        ],
        notes: 'Begin with broad organizational wins before drilling down into subsidiary financials.'
      },
      {
        id: 2, layout: 'comparison', bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)', accent: '#b91c1c', tag: 'STRATEGIC PILLARS',
        title: 'Infrastructure Independence',
        desc: 'Migrating enterprise workstations from third-party vendor clouds to sovereign local memory.',
        features: [
          { num: 'Pillar 1', title: 'Data Sovereignty', desc: 'Zero data exfiltration risk' },
          { num: 'Pillar 2', title: 'Hardware Utility', desc: 'GPU-accelerated vector UI' },
          { num: 'Pillar 3', title: 'Universal Export', desc: '100% M365 file format parity' }
        ],
        notes: 'Emphasize that sovereignty is our competitive moat.'
      },
      {
        id: 3, layout: 'metrics', bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)', accent: '#b91c1c', tag: 'FINANCIAL HIGHLIGHTS',
        title: 'Capital Discipline & Unit Margins',
        desc: 'Gross margins expanded 420 bps driven by zero cloud database dependencies.',
        features: [
          { num: '92.4%', title: 'Gross Margin', desc: 'Pure software economics' },
          { num: '3.4x', title: 'LTV to CAC', desc: 'High-velocity inbound expansion' },
          { num: '118%', title: 'Net Retention', desc: 'Negative customer churn' }
        ],
        notes: 'Walk board members through unit economic sustainability.'
      }
    ]
  },
  {
    id: 'board-of-directors-deck',
    name: 'Corporate Board Governance Briefing',
    category: 'review',
    desc: 'Formal boardroom presentation covering corporate governance, regulatory audits, and capital allocation',
    previewAccent: '#0f172a',
    themeStyle: 'obsidian-minimal',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)', accent: '#0f172a', tag: 'BOARD OF DIRECTORS',
        title: 'Executive Board of Directors Briefing',
        desc: 'Fiscal Year 2026 Strategic Governance, Financial Audit, and Risk Committee Review.',
        features: [
          { num: 'Audit', title: 'Clean Opinion', desc: 'Independent external audit completed' },
          { num: 'Risk', title: 'Zero Exposure', desc: 'Full sovereign regulatory compliance' },
          { num: 'Capital', title: 'Positive Cash Flow', desc: '18 months operating runway in reserve' }
        ],
        notes: 'Call meeting to order. Acknowledge quorum.'
      },
      {
        id: 2, layout: 'columns', bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)', accent: '#0f172a', tag: 'GOVERNANCE AGENDA',
        title: 'Four Core Resolutions for Vote',
        desc: 'Review and ratification of executive equity plan, R&D expansion, and subsidiary consolidation.',
        features: [
          { num: 'Item 1', title: 'Consolidation', desc: 'Giri Orbit corporate entity alignment' },
          { num: 'Item 2', title: 'Executive Comp', desc: 'Performance-based milestone vesting' },
          { num: 'Item 3', title: 'Treasury Policy', desc: 'Sovereign cash preservation protocol' }
        ],
        notes: 'Invite Committee Chairs to deliver remarks.'
      }
    ]
  },
  {
    id: 'competitive-swot-landscape',
    name: 'Market Landscape & SWOT Analysis',
    category: 'review',
    desc: 'Strategic market positioning analysis detailing internal Strengths/Weaknesses and market Opportunities/Threats',
    previewAccent: '#0284c7',
    themeStyle: 'teal-flow',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)', accent: '#0284c7', tag: 'MARKET POSITIONING',
        title: 'Global Competitive Strategy & SWOT Matrix',
        desc: 'Navigating enterprise office suite consolidation and capturing sovereign market share.',
        features: [
          { num: 'Strength', title: 'Instant Execution', desc: 'No loading spinners, zero cloud lag' },
          { num: 'Opportunity', title: 'Data Privacy Wave', desc: 'Enterprises rejecting invasive surveillance' },
          { num: 'Moat', title: '100% In-Memory', desc: 'Unbeatable speed and cost advantage' }
        ],
        notes: 'Set the macro landscape: enterprises are seeking alternatives to cloud vendor lock-in.'
      },
      {
        id: 2, layout: 'columns', bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)', accent: '#0284c7', tag: 'STRATEGIC EVALUATION',
        title: 'SWOT Quadrant Synthesis',
        desc: 'Converting architectural strengths into defensible enterprise market moats.',
        features: [
          { num: 'Strengths', title: 'Performance & UX', desc: 'Sub-millisecond render loop across all tools' },
          { num: 'Weaknesses', title: 'Ecosystem Breadth', desc: 'Rapidly addressing peripheral feature requests' },
          { num: 'Opportunities', title: 'Global Air-Gapping', desc: 'Defense, finance, and healthcare compliance' }
        ],
        notes: 'Walk executive team through SWOT action items.'
      }
    ]
  },

  // --- 3. PRODUCT LAUNCHES & ROADMAPS ---
  {
    id: 'product-launch-showcase',
    name: 'Cinematic Product Launch Keynote',
    category: 'launch',
    desc: 'Bold dark-mode presentation with hero typography for live product demonstrations',
    previewAccent: '#ea580c',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#ea580c', tag: 'KEYNOTE 2026',
        title: 'Meet Giri Orbit 2.0',
        desc: 'The world\'s fastest in-memory productivity suite. Completely free on the web.',
        features: [
          { num: 'Instant', title: 'Zero Install', desc: 'Runs in any modern browser' },
          { num: 'PWA', title: 'Works Offline', desc: 'Service worker edge caching' },
          { num: 'Office 365', title: 'True Parity', desc: 'Familiar Fluent ribbon interface' }
        ],
        notes: 'Cue the demo video right after reading the opening tagline.'
      },
      {
        id: 2, layout: 'metrics', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#ea580c', tag: 'PERFORMANCE BREAKTHROUGHS',
        title: 'Sub-Millisecond Engine Physics',
        desc: 'Engineered from the silicon up for zero lag, fluid typography, and instant calculation.',
        features: [
          { num: '< 16ms', title: 'Frame Budget', desc: 'Rock-solid 60 FPS smooth scrolling' },
          { num: '0 Cloud', title: 'Zero Database', desc: 'All records stay in browser memory' },
          { num: '100%', title: 'File Parity', desc: 'Seamless DOCX, XLSX, and PPTX compatibility' }
        ],
        notes: 'Show side-by-side performance comparison against legacy suites.'
      }
    ]
  },
  {
    id: 'product-roadmap-2027',
    name: 'Agile Product & Engineering Roadmap',
    category: 'launch',
    desc: 'Milestone delivery timeline, sprint cadence, and engineering feature horizons',
    previewAccent: '#10b981',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#10b981', tag: 'ENGINEERING HORIZON',
        title: 'Product Engineering Roadmap 2026-2027',
        desc: 'Strategic engineering milestones across core computational engines and UI frameworks.',
        features: [
          { num: 'Now', title: 'V2.0 Parity', desc: 'Full Document, Spreadsheet, Presentation, and PDF Studio engines' },
          { num: 'Next', title: 'AI Assist', desc: 'Local in-memory intelligence & document drafting' },
          { num: 'Later', title: 'P2P Sync', desc: 'Zero-knowledge end-to-end encrypted collaboration' }
        ],
        notes: 'Align technical leads on delivery commitments.'
      },
      {
        id: 2, layout: 'timeline', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#10b981', tag: 'EXECUTION TIMELINE',
        title: 'Three Continuous Release Horizons',
        desc: 'Continuous delivery model shipping sub-millisecond optimizations weekly.',
        features: [
          { num: 'Q3 2026', title: 'Core Polish', desc: 'Complete M365 UI parity and worldwide fonts' },
          { num: 'Q4 2026', title: 'Enterprise PWA', desc: 'Offline storage and sovereign data export' },
          { num: 'Q1 2027', title: 'Ecosystem APIs', desc: 'Extensible plugin architecture for custom tools' }
        ],
        notes: 'Review resource requirements with product managers.'
      }
    ]
  },
  {
    id: 'technical-system-architecture',
    name: 'Enterprise System Architecture Topology',
    category: 'launch',
    desc: 'Technical architecture blueprint for CTOs, system architects, and security officers',
    previewAccent: '#06b6d4',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#06b6d4', tag: 'SYSTEM TOPOLOGY',
        title: 'Zero-Database Distributed Architecture',
        desc: 'Cryptographically sovereign client execution with zero central points of failure.',
        features: [
          { num: 'Client', title: 'Local Sandbox', desc: 'Isolated browser memory container' },
          { num: 'Edge', title: 'Cloudflare CDN', desc: 'Global sub-20ms asset distribution' },
          { num: 'Storage', title: 'IndexedDB & RAM', desc: 'Encrypted persistent browser storage' }
        ],
        notes: 'Explain how our architecture eliminates data breach liability.'
      },
      {
        id: 2, layout: 'columns', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#06b6d4', tag: 'SECURITY LAYERS',
        title: 'Triple-Layer Cryptographic Isolation',
        desc: 'Every file edit and formula evaluation is bound to the user local security realm.',
        features: [
          { num: 'Layer 1', title: 'In-Memory State', desc: 'No telemetry or analytics tracking' },
          { num: 'Layer 2', title: 'Zero Third-Party', desc: 'Self-contained code bundle with zero external scripts' },
          { num: 'Layer 3', title: 'Client Export', desc: 'Files compile directly in browser memory' }
        ],
        notes: 'Address security compliance questions from enterprise CISOs.'
      }
    ]
  },

  // --- 4. SALES, MARKETING & GO-TO-MARKET ---
  {
    id: 'enterprise-b2b-proposal',
    name: 'Enterprise B2B Commercial Proposal',
    category: 'sales',
    desc: 'Polished client presentation for enterprise software procurement and digital transformation deals',
    previewAccent: '#2563eb',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#2563eb', tag: 'COMMERCIAL PROPOSAL',
        title: 'Sovereign Productivity for Global Enterprises',
        desc: 'Prepared exclusively for Enterprise Decision Makers by GIRI Corporation.',
        features: [
          { num: 'Cost', title: '70% Savings', desc: 'Fraction of legacy per-seat licensing fees' },
          { num: 'Speed', title: 'Instant Load', desc: 'Zero installation, zero IT rollout friction' },
          { num: 'Safety', title: 'Zero Breach', desc: 'Data never leaves corporate devices' }
        ],
        notes: 'Thank client executive committee for the opportunity to present.'
      },
      {
        id: 2, layout: 'comparison', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#2563eb', tag: 'ROI & TCO COMPARISON',
        title: 'Total Cost of Ownership Transformation',
        desc: 'Eliminating bloated cloud infrastructure and compliance liabilities permanently.',
        features: [
          { num: 'Legacy Suite', title: '$38 / User / Mo', desc: 'High latency, mandatory cloud upload' },
          { num: 'Giri Orbit', title: '$6 / User / Mo', desc: 'Sovereign, ultra-fast, zero cloud dependency' },
          { num: 'Annual ROI', title: '540% Return', desc: 'Immediate payback in under 60 days' }
        ],
        notes: 'Walk through cost modeling worksheet.'
      }
    ]
  },
  {
    id: 'gtm-growth-playbook',
    name: 'Go-To-Market Growth Playbook',
    category: 'sales',
    desc: 'Demand generation strategy, customer acquisition funnels, and enterprise sales cadence',
    previewAccent: '#059669',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#059669', tag: 'GTM STRATEGY',
        title: 'Zero-Friction Product-Led Growth',
        desc: 'How Giri Orbit scales globally through frictionless browser execution and word-of-mouth adoption.',
        features: [
          { num: 'Top Funnel', title: 'Free Web Access', desc: 'Anyone can open and use instantly' },
          { num: 'Conversion', title: 'Viral Export', desc: 'Shared files promote the platform organically' },
          { num: 'Enterprise', title: 'Inbound Upgrades', desc: 'IT departments request dedicated deployments' }
        ],
        notes: 'Outline our viral loop: every exported document is a billboard for Giri Orbit.'
      }
    ]
  },

  // --- 5. KEYNOTES, TOWN HALLS & CREATIVE ---
  {
    id: 'all-hands-town-hall',
    name: 'Company All-Hands Town Hall Keynote',
    category: 'keynote',
    desc: 'Inspiring company-wide town hall presentation celebrating team wins, cultural values, and the road ahead',
    previewAccent: '#dc2626',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#dc2626', tag: 'ALL-HANDS 2026',
        title: 'Building the Future of Knowledge Work',
        desc: 'Giri Corporation Company Town Hall // Celebrating our collective velocity and vision.',
        features: [
          { num: '1M+', title: 'Monthly Users', desc: 'Empowering knowledge workers globally' },
          { num: '99.8%', title: 'User Delight', desc: 'Fastest software suite ever built' },
          { num: '1 Team', title: 'Unbound Focus', desc: 'Relentless craftsmanship every single day' }
        ],
        notes: 'Express deep gratitude to every team member across engineering, design, and operations.'
      },
      {
        id: 2, layout: 'metrics', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#dc2626', tag: 'CORE VALUES',
        title: 'The Giri Corporation Principles',
        desc: 'Guiding how we design, build, and deliver software that honors human intelligence.',
        features: [
          { num: 'Speed', title: 'Sub-Millisecond', desc: 'Lag is an insult to human cognition' },
          { num: 'Privacy', title: 'Absolute Sovereignty', desc: 'User data belongs only to the user' },
          { num: 'Craft', title: 'Zero Compromise', desc: 'Every pixel, curve, and formula must be perfect' }
        ],
        notes: 'Reiterate why craftsmanship is our defining competitive advantage.'
      }
    ]
  },
  {
    id: 'developer-summit-keynote',
    name: 'Developer Ecosystem & API Summit',
    category: 'keynote',
    desc: 'Technical keynote address for developer communities, open source engineers, and software architects',
    previewAccent: '#16a34a',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#16a34a', tag: 'DEV SUMMIT 2026',
        title: 'The Edge-Native Computing Revolution',
        desc: 'Why the future of software runs on consumer hardware, in WebAssembly, and in local memory.',
        features: [
          { num: 'WebAssembly', title: 'Near-Native Speed', desc: 'Compiled C++ and Rust running in sandbox' },
          { num: 'WebGPU', title: 'Hardware Vector UI', desc: 'Accelerated geometry and bezier curve shaders' },
          { num: 'Open Formats', title: 'True Interoperability', desc: 'Zero proprietary lock-in formats' }
        ],
        notes: 'Welcome developers from around the world to our annual summit.'
      }
    ]
  }
,
  // --- 6. ICONIC DESIGN THEMES & PALETTES SUITE ---
  {
    id: 'facet-minimalist',
    name: 'Modern Minimalist (Facet)',
    category: 'themes',
    desc: 'Modern Minimalist Facet presentation theme with clean geometric facets and fresh sage accents',
    previewAccent: '#107c41',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#107c41', tag: 'KINETIC // FACET',
        title: 'Modern Minimalist Architecture',
        desc: 'Clean corporate design emphasizing clarity, negative space, and crisp vector layout.',
        features: [
          { num: '01', title: 'Geometric Balance', desc: 'Precision-aligned grid framework' },
          { num: '02', title: 'Sage Palette', desc: 'Subtle green and neutral gray harmony' },
          { num: '03', title: 'High Readability', desc: 'Optimized for high-resolution projection' }
        ],
        notes: 'Welcome participants and set a calm, executive tone.'
      },
      {
        id: 2, layout: 'columns', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#107c41', tag: 'FACET COLUMNS',
        title: 'Three Pillars of Modern Execution',
        desc: 'Structured breakdown aligned across distinct geometric columns.',
        features: [
          { num: 'A', title: 'Core Reliability', desc: 'Engineered for zero downtime' },
          { num: 'B', title: 'Instant Response', desc: 'Sub-millisecond user interactions' },
          { num: 'C', title: 'Universal Export', desc: 'Full universal presentation compatibility' }
        ],
        notes: 'Walk through each pillar sequentially.'
      }
    ]
  },
  {
    id: 'integral-dark',
    name: 'Celestial Dark (Integral)',
    category: 'themes',
    desc: 'The definitive Integral dark presentation theme with deep obsidian backdrop and amber highlights',
    previewAccent: '#f59e0b',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#f59e0b', tag: 'KINETIC // INTEGRAL',
        title: 'Celestial Horizon Keynote',
        desc: 'High-contrast cinematic presentation crafted for darkened auditoriums and stages.',
        features: [
          { num: 'Onyx', title: 'Dark Stage Backdrop', desc: 'Reduces visual fatigue during long briefings' },
          { num: 'Amber', title: 'Warm Energy Accents', desc: 'Directs viewer gaze to focal metrics' },
          { num: '60 FPS', title: 'Smooth Animations', desc: 'Seamless slide transitions' }
        ],
        notes: 'Pause after opening statement to let the high-contrast title sink in.'
      },
      {
        id: 2, layout: 'metrics', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#f59e0b', tag: 'INTEGRAL METRICS',
        title: 'Strategic Impact & Growth Indicators',
        desc: 'Empirical verification across key performance parameters.',
        features: [
          { num: '+142%', title: 'Engagement Surge', desc: 'Audience retention throughout presentation' },
          { num: '< 50ms', title: 'Render Latency', desc: 'Instant hardware-accelerated drawing' },
          { num: '100%', title: 'Data Privacy', desc: 'Zero cloud telemetry or exfiltration' }
        ],
        notes: 'Highlight the +142% engagement figure.'
      }
    ]
  },
  {
    id: 'ion-tech',
    name: 'Circuit Board (Ion)',
    category: 'themes',
    desc: 'Ion technical presentation template with cybernetic purple and electric cyan accents',
    previewAccent: '#06b6d4',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#06b6d4', tag: 'KINETIC // ION',
        title: 'Next-Gen Cybernetic Systems',
        desc: 'Futuristic technical briefing designed for engineering symposiums and software architecture reviews.',
        features: [
          { num: 'Ion', title: 'Cybernetic Spectrum', desc: 'Electric cyan and violet illumination' },
          { num: 'Vector', title: 'Circuit Geometry', desc: 'Precision hardware and software schematics' },
          { num: 'Edge', title: 'Local Compute', desc: 'In-browser compilation and execution' }
        ],
        notes: 'Introduce the core architectural leap forward.'
      },
      {
        id: 2, layout: 'comparison', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#06b6d4', tag: 'ION BENCHMARK',
        title: 'Legacy Cloud vs. In-Memory Edge',
        desc: 'Direct head-to-head comparison demonstrating quantum leaps in throughput and security.',
        features: [
          { num: 'Traditional', title: 'Network Dependent', desc: 'Prone to outages, jitter, and cloud latency' },
          { num: 'Giri Orbit', title: 'Autonomous Edge', desc: 'Runs offline, in-memory, instant response' },
          { num: 'Delta', title: '100x Advantage', desc: 'Unmatched speed and zero subscription costs' }
        ],
        notes: 'Walk technical leads through the benchmark metrics.'
      }
    ]
  },
  {
    id: 'dividend-executive',
    name: 'Slate Executive (Dividend)',
    category: 'themes',
    desc: 'Prestigious Dividend presentation theme with slate gray background and regal gold border detailing',
    previewAccent: '#d97706',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#d97706', tag: 'KINETIC // DIVIDEND',
        title: 'Executive Boardroom & Capital Review',
        desc: 'Formal institutional presentation format used by Fortune 100 CFOs and audit committees.',
        features: [
          { num: 'Slate', title: 'Institutional Dignity', desc: 'Subdued tones command authoritative respect' },
          { num: 'Gold', title: 'Regal Trim', desc: 'Distinguished border framing on every slide' },
          { num: 'GAAP', title: 'Financial Ready', desc: 'Precision typography for balance sheets' }
        ],
        notes: 'Call executive session to order and establish governance context.'
      },
      {
        id: 2, layout: 'metrics', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#d97706', tag: 'CAPITAL ALLOCATION',
        title: 'FY2026 Sovereign Treasury Position',
        desc: 'Consolidated capital reserves, operational runway, and risk mitigation metrics.',
        features: [
          { num: '$84.5M', title: 'Liquid Reserves', desc: 'Secured across sovereign institutional accounts' },
          { num: '32 Mo', title: 'Operating Runway', desc: 'Zero dependency on external equity rounds' },
          { num: '0.0%', title: 'Long-Term Debt', desc: 'Fortress balance sheet architecture' }
        ],
        notes: 'Confirm auditor sign-off on all reported numbers.'
      }
    ]
  },
  {
    id: 'berlin-classic',
    name: 'Berlin Classic (Berlin)',
    category: 'themes',
    desc: 'The iconic Berlin presentation theme with bold warm orange title blocks and strong typography',
    previewAccent: '#ea580c',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#ea580c', tag: 'KINETIC // BERLIN',
        title: 'Creative Agency & Design Brief',
        desc: 'Dynamic, confident, and energetic presentation with signature Berlin geometric blocks.',
        features: [
          { num: 'Block', title: 'Bold Color Blocks', desc: 'Warm terracotta and bold sunset orange' },
          { num: 'Type', title: 'Modern Sans-Serif', desc: 'Crisp readability and strong visual rhythm' },
          { num: 'Impact', title: 'High Engagement', desc: 'Ideal for pitches, creative reviews, and sprints' }
        ],
        notes: 'Kick off creative sprint presentation with enthusiasm.'
      },
      {
        id: 2, layout: 'columns', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#ea580c', tag: 'CAMPAIGN PHASES',
        title: 'Three-Stage Brand Rollout',
        desc: 'Milestone schedule for global creative deployment.',
        features: [
          { num: 'Phase 1', title: 'Teaser Wave', desc: 'Viral anticipation and influencer previews' },
          { num: 'Phase 2', title: 'Global Launch', desc: 'Synchronized worldwide press and app release' },
          { num: 'Phase 3', title: 'Community Pulse', desc: 'Ongoing feedback loops and user spotlight' }
        ],
        notes: 'Detail key responsibilities for each phase.'
      }
    ]
  },
  {
    id: 'savon-retro',
    name: 'Savon Retro (Savon)',
    category: 'themes',
    desc: 'Timeless Savon presentation theme featuring warm ivory, olive accents, and classical serif elegance',
    previewAccent: '#65a30d',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#65a30d', tag: 'KINETIC // SAVON',
        title: 'Literary & Academic Discourse',
        desc: 'Warm paper texture aesthetic tailored for research symposiums, legal analysis, and historical reviews.',
        features: [
          { num: 'Ivory', title: 'Warm Paper Tone', desc: 'Soft parchment aesthetic gentle on the eyes' },
          { num: 'Olive', title: 'Natural Accents', desc: 'Botanical harmony across headers and bullets' },
          { num: 'Serif', title: 'Scholarly Type', desc: 'Classical editorial authority' }
        ],
        notes: 'Introduce the academic thesis with historical context.'
      },
      {
        id: 2, layout: 'comparison', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#65a30d', tag: 'LITERATURE REVIEW',
        title: 'Methodological Comparison',
        desc: 'Critical contrast between historical models and empirical findings.',
        features: [
          { num: 'Hypothesis A', title: 'Theoretical Model', desc: 'Derived from classical economic frameworks' },
          { num: 'Hypothesis B', title: 'Observed Data', desc: 'Validated through real-time field telemetry' },
          { num: 'Conclusion', title: 'Synthesis', desc: 'Confirming predictive accuracy within 98.4%' }
        ],
        notes: 'Invite scholarly questions on methodology.'
      }
    ]
  },
  {
    id: 'madison-corporate',
    name: 'Madison Corporate (Madison)',
    category: 'themes',
    desc: 'The corporate Madison theme with rich crimson borders, sophisticated off-white cards, and executive polish',
    previewAccent: '#b91c1c',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#b91c1c', tag: 'KINETIC // MADISON',
        title: 'Annual Shareholder Conference',
        desc: 'Classic corporate prestige delivering annual returns, dividend distributions, and future guidance.',
        features: [
          { num: 'Crimson', title: 'Executive Crimson', desc: 'Deep red signature corporate identity' },
          { num: 'Refined', title: 'Crisp Card Grids', desc: 'Separates revenue streams clearly' },
          { num: 'Official', title: 'Shareholder Ready', desc: 'Formal presentation standard' }
        ],
        notes: 'Welcome shareholders and board members.'
      },
      {
        id: 2, layout: 'metrics', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#b91c1c', tag: 'SHAREHOLDER VALUE',
        title: 'Key Financial Metrics & EPS Growth',
        desc: 'Delivering record-breaking shareholder value through disciplined capital reinvestment.',
        features: [
          { num: '$4.82', title: 'Earnings Per Share', desc: '24% increase year-over-year' },
          { num: '$2.10', title: 'Annual Dividend', desc: 'Continuous payout increase for 8 years' },
          { num: '28.4%', title: 'Return on Equity', desc: 'Industry-leading operational efficiency' }
        ],
        notes: 'Emphasize strong balance sheet resilience.'
      }
    ]
  },
  {
    id: 'droplet-aqua',
    name: 'Droplet Aqua (Droplet)',
    category: 'themes',
    desc: 'Refreshing Droplet presentation theme with gentle ocean gradients, rounded cards, and cool aqua tones',
    previewAccent: '#0284c7',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#0284c7', tag: 'KINETIC // DROPLET',
        title: 'Environmental & Sustainability Report',
        desc: 'Fresh, modern environmental and clean-tech presentation with oceanic blue accents.',
        features: [
          { num: 'Aqua', title: 'Oceanic Blue Tones', desc: 'Clean, soothing water-inspired palette' },
          { num: 'Curved', title: 'Soft Geometry', desc: 'Friendly rounded corners and card layout' },
          { num: 'Eco', title: 'ESG & CleanTech', desc: 'Perfect for environmental disclosures' }
        ],
        notes: 'Highlight our commitment to zero carbon impact.'
      },
      {
        id: 2, layout: 'columns', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#0284c7', tag: 'ESG INITIATIVES',
        title: 'Three Pillars of Environmental Stewardship',
        desc: 'Actionable decarbonization programs across all facilities.',
        features: [
          { num: 'Solar', title: '100% Renewable', desc: 'All server hubs powered by wind and solar' },
          { num: 'Water', title: 'Zero Waste', desc: 'Closed-loop cooling systems across campuses' },
          { num: 'Circular', title: 'Hardware Recycled', desc: '100% component refurbishment and reuse' }
        ],
        notes: 'Walk attendees through the sustainability scorecard.'
      }
    ]
  },
  {
    id: 'organic-botanical',
    name: 'Organic Botanical (Organic)',
    category: 'themes',
    desc: 'Natural Organic theme with forest moss tones, earthy beige cards, and holistic presentation flow',
    previewAccent: '#15803d',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#15803d', tag: 'KINETIC // ORGANIC',
        title: 'Holistic Health & Wellness Summit',
        desc: 'Warm earthy presentation style suited for healthcare, agricultural science, and nutrition workshops.',
        features: [
          { num: 'Forest', title: 'Deep Moss & Pine', desc: 'Natural green tones creating tranquil visual flow' },
          { num: 'Warmth', title: 'Earthy Sand Cards', desc: 'Warm cream containers highlighting research' },
          { num: 'Growth', title: 'Vitality Metrics', desc: 'Clear indicators for health outcomes' }
        ],
        notes: 'Set an uplifting, human-centered tone for attendees.'
      },
      {
        id: 2, layout: 'metrics', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#15803d', tag: 'CLINICAL OUTCOMES',
        title: 'Patient Vitality & Recovery Rates',
        desc: 'Longitudinal clinical trials showing statistically significant wellness improvements.',
        features: [
          { num: '94.2%', title: 'Adherence Rate', desc: 'Patients maintained recommended program' },
          { num: '-38%', title: 'Inflammation Index', desc: 'Documented biomarker reduction' },
          { num: '4.9/5', title: 'Patient Satisfaction', desc: 'Highest rated holistic protocol' }
        ],
        notes: 'Review clinical methodology and double-blind controls.'
      }
    ]
  },
  {
    id: 'retrospect-vintage',
    name: 'Retrospect Vintage (Retrospect)',
    category: 'themes',
    desc: 'Mid-century modern Retrospect theme with warm charcoal, mustard ochre, and geometric accents',
    previewAccent: '#ca8a04',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#ca8a04', tag: 'KINETIC // RETROSPECT',
        title: 'Mid-Century Design Principles',
        desc: 'Sophisticated vintage aesthetics combining modernist architecture, warm amber, and structured grids.',
        features: [
          { num: 'Ochre', title: 'Mustard Gold & Ochre', desc: 'Warm nostalgic accents that pop on dark card' },
          { num: 'Grid', title: 'Bauhaus Layout', desc: 'Asymmetric yet rigorously balanced composition' },
          { num: 'Style', title: 'Industrial Chic', desc: 'Favored by architects and industrial designers' }
        ],
        notes: 'Introduce historical roots of the design movement.'
      },
      {
        id: 2, layout: 'columns', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#ca8a04', tag: 'DESIGN PILLARS',
        title: 'Form Follows Function in Modern Computing',
        desc: 'Applying timeless industrial design lessons to 21st-century software.',
        features: [
          { num: 'Honesty', title: 'Material Truth', desc: 'Software UI should look like software, not skeuomorphs' },
          { num: 'Simplicity', title: 'Less but Better', desc: 'Eliminate every pixel that does not serve cognition' },
          { num: 'Permanence', title: 'Built to Last', desc: 'Local files that open 30 years from now without servers' }
        ],
        notes: 'Connect Dieter Rams design ethos to Giri Orbit.'
      }
    ]
  },
  {
    id: 'badge-editorial',
    name: 'Badge Editorial (Badge)',
    category: 'themes',
    desc: 'Modern editorial magazine format with structured badge headers, high typographic polish, and clean cards',
    previewAccent: '#4f46e5',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#4f46e5', tag: 'KINETIC // BADGE',
        title: 'The Quarterly Editorial Review',
        desc: 'New York Times and Monocle inspired editorial presentation layout with distinctive section badges.',
        features: [
          { num: 'Badge', title: 'Header Badges', desc: 'Distinguished section pill tags on each slide' },
          { num: 'Editorial', title: 'Magazine Polish', desc: 'Columnar flow with quote callouts' },
          { num: 'Sharp', title: 'High Density', desc: 'Packs rich commentary without feeling cluttered' }
        ],
        notes: 'Introduce the publication overview and editorial themes.'
      },
      {
        id: 2, layout: 'comparison', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#4f46e5', tag: 'GLOBAL TRENDS',
        title: 'East vs. West Technology Adoption',
        desc: 'Comparative editorial essay exploring differing paces of cloud and edge migration.',
        features: [
          { num: 'North America', title: 'Cloud Retraction', desc: '34% of enterprises pulling data back to on-prem' },
          { num: 'Asia-Pacific', title: 'Mobile-First Edge', desc: '78% of workflows originated on portable devices' },
          { num: 'Synthesis', title: 'Convergence', desc: 'Both regions migrating toward zero-database apps' }
        ],
        notes: 'Discuss regional divergence in software procurement.'
      }
    ]
  },
  {
    id: 'metaphor-contrast',
    name: 'Metaphor High-Contrast (Metaphor)',
    category: 'themes',
    desc: 'High-voltage Metaphor theme with stark obsidian background, luminous cyber yellow lines, and laser precision',
    previewAccent: '#eab308',
    slides: [
      {
        id: 1, layout: 'title', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#eab308', tag: 'KINETIC // METAPHOR',
        title: 'Maximum Contrast Critical Briefing',
        desc: 'Uncompromising high-visibility black & yellow presentation for emergency responses, incident RCAs, and audits.',
        features: [
          { num: 'Safety', title: 'High-Voltage Yellow', desc: 'Instantly commands total situational awareness' },
          { num: 'Obsidian', title: 'Pure Black Stage', desc: 'Infinite contrast ratio on OLED and LED displays' },
          { num: 'Zero Noise', title: 'Pure Signal', desc: 'Every data point is crisp, critical, and verified' }
        ],
        notes: 'Brief incident response commanders on current operational status.'
      },
      {
        id: 2, layout: 'metrics', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#eab308', tag: 'INCIDENT TELEMETRY',
        title: 'Root Cause Analysis & Mitigation Speed',
        desc: 'Real-time telemetry captured during simulated system fault and automated containment.',
        features: [
          { num: '420ms', title: 'Fault Isolation', desc: 'Zero cascade failure across edge nodes' },
          { num: '0 Bytes', title: 'Data Corruption', desc: 'In-memory transaction logs remained pristine' },
          { num: '100%', title: 'Service Restored', desc: 'Automatic failover without human intervention' }
        ],
        notes: 'Walk technical officers through the RCA timeline.'
      }
    ]
  }

];

// ============================================================================
// 3. GIRI DRIFT (EXECUTIVE DOCUMENTS / WORD) GLOBAL TEMPLATES
// ============================================================================
export const DRIFT_BUILTIN_TEMPLATES = [
  {
    id: 'executive-memo',
    name: 'Executive Decision Memorandum',
    category: 'memos',
    desc: 'Standard Fortune 500 decision memorandum with structured background, options analysis, and sign-off',
    previewAccent: '#2563eb',
    content: `
      <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin-bottom:4px;">EXECUTIVE DECISION MEMORANDUM</h1>
      <p style="font-size:11px; font-family:monospace; color:#64748b; margin-bottom:20px;">CONFIDENTIAL // GIRI CORPORATION EXECUTIVE COMMITTEE</p>
      <hr style="border:none; border-top:1px solid #e2e8f0; margin:16px 0;">
      <p><strong>TO:</strong> Executive Board & Chief Executive Officer</p>
      <p><strong>FROM:</strong> Abhinav Giri, Chief Technology Architect</p>
      <p><strong>DATE:</strong> September 12, 2026</p>
      <p><strong>SUBJECT:</strong> Authorization of Sovereign In-Memory Suite Architecture</p>
      <h2 style="font-size:16px; font-weight:700; color:#0f172a; margin-top:24px;">1. Executive Summary</h2>
      <p>This memorandum recommends the formal deployment of Giri Orbit as the organization's sovereign computing environment. Operating 100% in local browser memory with zero database dependencies, this architecture guarantees zero data breach exposure while providing sub-millisecond calculation velocity.</p>
      <h2 style="font-size:16px; font-weight:700; color:#0f172a; margin-top:24px;">2. Recommendation & Next Steps</h2>
      <p>Authorize immediate migration across all corporate workstation nodes with full file parity across standard Office file formats.</p>
    `
  },
  {
    id: 'formal-nda',
    name: 'Mutual Non-Disclosure Agreement (MNDA)',
    category: 'legal',
    desc: 'Standard commercial confidentiality agreement with proprietary clauses, term limits, and signature blocks',
    previewAccent: '#dc2626',
    content: `
      <h1 style="font-size:22px; font-weight:800; text-align:center; color:#0f172a;">MUTUAL NON-DISCLOSURE AGREEMENT</h1>
      <p style="text-align:center; font-size:11px; color:#64748b; margin-bottom:24px;">STANDARD COMMERCIAL TERMS // GIRI CORPORATION</p>
      <p>This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of the date executed below between <strong>Giri Corporation</strong> and the Counterparty.</p>
      <h2 style="font-size:15px; font-weight:700; color:#0f172a; margin-top:20px;">1. Confidential Information</h2>
      <p>Each party agrees to hold all technical architectures, proprietary algorithms, financial models, and strategic documentation in strict confidence.</p>
      <h2 style="font-size:15px; font-weight:700; color:#0f172a; margin-top:20px;">2. Signatures & Execution</h2>
      <div style="margin-top:36px; display:flex; justify-content:space-between;">
        <div><strong>For Giri Corporation:</strong><br><span style="font-family:'Brush Script MT', cursive; font-size:22px; color:#2563eb;">Abhinav Giri</span></div>
        <div><strong>For Counterparty:</strong><br><span style="font-family:monospace; color:#64748b;">[Digital Signature]</span></div>
      </div>
    `
  }
];

// ============================================================================
// 4. GIRI AEGIS (PDF STUDIO & CRYPTOGRAPHIC SEALS) TEMPLATES
// ============================================================================
export const AEGIS_BUILTIN_TEMPLATES = [
  {
    id: 'executive-deployment-memo',
    name: 'Executive Deployment Authorization Memo',
    category: 'memos',
    desc: 'Formal enterprise memorandum with cryptographic verification stamp and executive signature lines',
    previewAccent: '#dc2626',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'GIRI ENTERPRISE MEMORANDUM // DEPLOYMENT AUTHORIZATION',
        ref: 'GIRI-AEGIS-2026-X01',
        htmlContent: `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <img src="assets/giri-logo-symbol.png" alt="Giri Group" style="height:38px; width:auto; display:block;">
              <div>
                <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:0; letter-spacing:-0.01em;">GIRI ENTERPRISE MEMORANDUM</h1>
                <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">REF: GIRI-AEGIS-2026-X01 // SOVEREIGN COMPUTING DIVISION</span>
              </div>
            </div>
            <div style="border:2px solid #e42528; color:#e42528; padding:4px 10px; border-radius:4px; font-weight:800; font-size:12px; text-transform:uppercase; transform:rotate(-6deg);">
              APPROVED
              <span style="font-size:8px; display:block; font-weight:500;">GIRI CORP EXECUTIVE</span>
            </div>
          </div>
          <div style="height:1px; background:#e2e8f0; margin:16px 0;"></div>
          <h2 style="font-size:15px; font-weight:700; color:#0f172a; margin-bottom:8px;">Executive Summary & Formal Authorization</h2>
          <p style="font-size:12.5px; line-height:1.7; color:#334155; margin-bottom:14px;">
            This executive authorization grants formal deployment permission for <strong>Giri Orbit Suite</strong> across enterprise nodes. Operating strictly within local browser memory, this software suite guarantees zero data exfiltration, cryptographic safety, and 100% standard Office file format interchangeability.
          </p>
          <div style="margin:20px 0; padding:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
            <h3 style="font-size:13px; font-weight:700; color:#0f172a; margin-bottom:8px;">Authorized System Scope</h3>
            <ul style="font-size:12px; color:#475569; line-height:1.8; margin:0; padding-left:20px;">
              <li><strong>Giri Drift:</strong> Sovereign Document Processor & Technical Editor</li>
              <li><strong>Giri Axis:</strong> Financial Matrix & Formula Modeling Engine</li>
              <li><strong>Giri Kinetic:</strong> 3,500+ PresentationGO Diagram Studio</li>
              <li><strong>Giri Aegis:</strong> Cryptographic PDF & Seal Verification Studio</li>
            </ul>
          </div>
          <div style="margin-top:36px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:28px; color:#1e40af; border-bottom:1.5px solid #0f172a; display:inline-block; padding-bottom:2px;">
                Abhinav Giri
              </div>
              <span style="display:block; font-size:10px; font-family:var(--font-mono); color:#64748b; margin-top:4px;">
                Validated by Chief Technology Architect // SHA-256 Verified
              </span>
            </div>
            <div style="text-align:right;">
              <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">DATE EXECUTED:</span>
              <strong style="font-size:11px; display:block; color:#0f172a;">2026-09-13</strong>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'mutual-nda-agreement',
    name: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'agreements',
    desc: 'Standard bilateral confidentiality agreement safeguarding proprietary architecture, algorithms, and commercial data',
    previewAccent: '#2563eb',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'MUTUAL NON-DISCLOSURE & PROPRIETARY RIGHTS AGREEMENT',
        ref: 'GIRI-NDA-2026-SEC',
        htmlContent: `
          <div style="text-align:center; margin-bottom:24px;">
            <span style="font-size:10px; font-weight:800; color:#2563eb; letter-spacing:0.1em; text-transform:uppercase;">LEGAL CONTRACT // CONFIDENTIAL</span>
            <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:4px 0 6px 0;">MUTUAL NON-DISCLOSURE AGREEMENT</h1>
            <span style="font-size:11px; color:#64748b;">EFFECTIVE DATE: SEPTEMBER 2026</span>
          </div>
          <div style="height:1px; background:#e2e8f0; margin:16px 0;"></div>
          <p style="font-size:12px; line-height:1.7; color:#334155; margin-bottom:12px;">
            This Mutual Non-Disclosure Agreement ("Agreement") is entered into by and between <strong>GIRI CORPORATION</strong> ("Disclosing Party") and the undersigned corporate counterparty ("Recipient").
          </p>
          <h3 style="font-size:12.5px; font-weight:700; color:#0f172a; margin:14px 0 6px 0;">1. Definition of Confidential Information</h3>
          <p style="font-size:11.5px; line-height:1.6; color:#475569; margin-bottom:10px;">
            "Confidential Information" includes all non-public technical data, source models, memory state structures, cryptographic proofs, and product roadmap telemetry related to the Giri Orbit suite.
          </p>
          <h3 style="font-size:12.5px; font-weight:700; color:#0f172a; margin:14px 0 6px 0;">2. Obligations & Safeguards</h3>
          <p style="font-size:11.5px; line-height:1.6; color:#475569; margin-bottom:14px;">
            The Recipient agrees to hold all Confidential Information in strict confidence, applying no less than reasonable care, and shall not disclose or reverse-engineer any portion without prior written consent.
          </p>
          <div style="margin-top:32px; display:grid; grid-template-columns:1fr 1fr; gap:24px; padding-top:16px; border-top:1px solid #e2e8f0;">
            <div>
              <span style="font-size:10.5px; font-weight:700; color:#0f172a; display:block; margin-bottom:16px;">FOR: GIRI CORPORATION</span>
              <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:24px; color:#1e40af; border-bottom:1px solid #cbd5e1; padding-bottom:4px;">Abhinav Giri</div>
              <span style="font-size:10px; color:#64748b; display:block; margin-top:4px;">Signature / Authorized Representative</span>
            </div>
            <div>
              <span style="font-size:10.5px; font-weight:700; color:#0f172a; display:block; margin-bottom:16px;">FOR: ENTERPRISE COUNTERPARTY</span>
              <div style="border-bottom:1px dashed #94a3b8; height:32px; margin-bottom:4px;"></div>
              <span style="font-size:10px; color:#64748b; display:block;">Sign Here via Digital Signature Pad</span>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'enterprise-msa',
    name: 'Enterprise Master Services Agreement (MSA)',
    category: 'agreements',
    desc: 'Comprehensive multi-year enterprise software and sovereign deployment services agreement',
    previewAccent: '#059669',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'MASTER SERVICES AGREEMENT // SOVEREIGN COMPUTING',
        ref: 'GIRI-MSA-2026-ENT',
        htmlContent: `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <span style="font-size:9.5px; font-weight:800; color:#059669; letter-spacing:0.08em; text-transform:uppercase;">STANDARD CONTRACT FORM</span>
              <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:4px 0;">MASTER SERVICES AGREEMENT</h1>
            </div>
            <div style="text-align:right;">
              <span style="font-size:9px; font-family:var(--font-mono); color:#64748b; display:block;">MSA ID: GIRI-2026-904</span>
              <span style="font-size:9px; font-weight:700; color:#059669; background:#dcfce7; padding:2px 6px; border-radius:3px;">TIER 1 SOVEREIGN</span>
            </div>
          </div>
          <div style="height:1px; background:#e2e8f0; margin:12px 0 16px 0;"></div>
          <p style="font-size:12px; line-height:1.7; color:#334155; margin-bottom:12px;">
            This Master Services Agreement ("MSA") governs the procurement, implementation, and long-term licensing of the Giri Orbit sovereign suite across client global operational subsidiaries.
          </p>
          <table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:11.5px;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:left;">Service Scope</th>
                <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:left;">SLA Standard</th>
                <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:left;">Air-Gap Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border:1px solid #cbd5e1; padding:6px 10px;">Core Suite Licensing (Drift, Axis, Kinetic, Aegis)</td>
                <td style="border:1px solid #cbd5e1; padding:6px 10px;">99.999% Local In-Memory</td>
                <td style="border:1px solid #cbd5e1; padding:6px 10px; color:#059669; font-weight:600;">100% Offline Capable</td>
              </tr>
              <tr>
                <td style="border:1px solid #cbd5e1; padding:6px 10px;">PresentationGO Vector Diagram Engine</td>
                <td style="border:1px solid #cbd5e1; padding:6px 10px;">Sub-millisecond Render</td>
                <td style="border:1px solid #cbd5e1; padding:6px 10px; color:#059669; font-weight:600;">Embedded Zero-CDN</td>
              </tr>
            </tbody>
          </table>
          <h3 style="font-size:12.5px; font-weight:700; color:#0f172a; margin:16px 0 6px 0;">Intellectual Property & Data Custody</h3>
          <p style="font-size:11.5px; line-height:1.6; color:#475569; margin-bottom:18px;">
            All document models, spreadsheet calculations, presentation slides, and cryptographic keys generated within the suite remain the exclusive, inalienable property of the Client.
          </p>
          <div style="margin-top:24px; padding:12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; color:#64748b;">
            Formal execution valid upon digital timestamp and bilateral cryptographic signature.
          </div>
        `
      }
    ]
  },
  {
    id: 'air-gap-security-certificate',
    name: 'Air-Gap Sovereign Security Compliance Certificate',
    category: 'certificates',
    desc: 'Cryptographic compliance audit certificate validating zero data exfiltration, local storage encryption, and PKI integrity',
    previewAccent: '#7c3aed',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'SOVEREIGN AUDIT CERTIFICATE // ZERO DATA EXFILTRATION',
        ref: 'GIRI-CERT-2026-PKI',
        htmlContent: `
          <div style="text-align:center; padding:16px; border:2px solid #7c3aed; border-radius:8px; background:linear-gradient(180deg, #faf5ff 0%, #ffffff 100%); margin-bottom:20px;">
            <div style="font-size:28px; margin-bottom:6px;">🛡️</div>
            <span style="font-size:10px; font-weight:800; color:#7c3aed; letter-spacing:0.12em; text-transform:uppercase;">INDEPENDENT CRYPTOGRAPHIC AUDIT</span>
            <h1 style="font-size:20px; font-weight:900; color:#1e1b4b; margin:6px 0;">CERTIFICATE OF SOVEREIGN COMPLIANCE</h1>
            <span style="font-size:11px; font-family:var(--font-mono); color:#6b21a8;">VERIFICATION SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
          </div>
          <p style="font-size:12px; line-height:1.7; color:#334155; margin-bottom:14px;">
            This document certifies that the <strong>Giri Orbit Suite</strong> runtime environment has completed rigorous air-gapped security evaluation and meets the highest enterprise specifications for offline data isolation.
          </p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:16px 0;">
            <div style="padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
              <strong style="font-size:11.5px; color:#0f172a; display:block;">Telemetry Inspection:</strong>
              <span style="font-size:11px; color:#059669; font-weight:700;">PASSED (0 outbound network packets)</span>
            </div>
            <div style="padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
              <strong style="font-size:11.5px; color:#0f172a; display:block;">Local Encryption:</strong>
              <span style="font-size:11px; color:#059669; font-weight:700;">PASSED (AES-GCM &amp; LocalStorage Isolation)</span>
            </div>
          </div>
          <div style="margin-top:32px; text-align:center;">
            <div style="display:inline-block; border:2px solid #7c3aed; padding:8px 24px; border-radius:24px; color:#7c3aed; font-weight:800; font-size:12px;">
              OFFICIALLY CERTIFIED SOVEREIGN ENVIRONMENT
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'board-formal-resolution',
    name: 'Board of Directors Formal Resolution',
    category: 'memos',
    desc: 'Official corporate board resolution document with unanimous vote record, secretary certification, and execution seal',
    previewAccent: '#0f172a',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'UNANIMOUS WRITTEN CONSENT OF THE BOARD OF DIRECTORS',
        ref: 'GIRI-BOD-2026-RES',
        htmlContent: `
          <div style="text-align:center; margin-bottom:20px;">
            <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:0 0 4px 0;">GIRI CORPORATION</h1>
            <span style="font-size:11px; font-weight:700; color:#64748b; letter-spacing:0.05em;">ACTION BY UNANIMOUS WRITTEN CONSENT OF THE BOARD OF DIRECTORS</span>
          </div>
          <div style="height:1px; background:#e2e8f0; margin:14px 0;"></div>
          <p style="font-size:12px; line-height:1.7; color:#334155; margin-bottom:12px;">
            The undersigned, constituting all of the members of the Board of Directors of <strong>Giri Corporation</strong>, hereby adopt the following resolutions pursuant to Section 141 of the General Corporation Law:
          </p>
          <h3 style="font-size:12.5px; font-weight:700; color:#0f172a; margin:14px 0 6px 0;">ADOPTION OF SOVEREIGN PLATFORM ARCHITECTURE</h3>
          <p style="font-size:11.5px; line-height:1.6; color:#475569; margin-bottom:10px;">
            <strong>RESOLVED:</strong> That the deployment of the Giri Orbit Zero-Gravity Suite is hereby formally ratified, authorized, and approved for enterprise-wide implementation.
          </p>
          <p style="font-size:11.5px; line-height:1.6; color:#475569; margin-bottom:14px;">
            <strong>FURTHER RESOLVED:</strong> That executive officers of the Corporation are authorized to sign and execute all associated commercial licensing agreements and regulatory disclosures.
          </p>
          <div style="margin-top:32px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:26px; color:#0f172a; border-bottom:1px solid #0f172a; display:inline-block; padding-bottom:2px;">
                Abhinav Giri
              </div>
              <span style="display:block; font-size:10px; color:#64748b; margin-top:4px;">Chairman of the Board &amp; CEO</span>
            </div>
            <div style="text-align:right;">
              <span style="font-size:10px; color:#64748b;">DATE OF ADOPTION:</span>
              <strong style="font-size:11px; display:block; color:#0f172a;">SEPTEMBER 13, 2026</strong>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'commercial-tax-invoice',
    name: 'Commercial Tax Invoice & Billing Ledger',
    category: 'invoices',
    desc: 'Formal itemized corporate billing statement with remittance details, tax line items, and digital payment terms',
    previewAccent: '#0d9488',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'COMMERCIAL TAX INVOICE // ENTERPRISE BILLING',
        ref: 'GIRI-INV-2026-904',
        htmlContent: `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
            <div>
              <h1 style="font-size:22px; font-weight:900; color:#0d9488; margin:0;">INVOICE</h1>
              <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">INVOICE #: GIRI-INV-2026-904</span>
            </div>
            <div style="text-align:right;">
              <strong style="font-size:14px; color:#0f172a; display:block;">GIRI CORPORATION</strong>
              <span style="font-size:11px; color:#64748b;">Sovereign Computing Technologies Division</span>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:16px 0; padding:12px; background:#f8fafc; border-radius:6px;">
            <div>
              <span style="font-size:10px; font-weight:700; color:#64748b; display:block; text-transform:uppercase;">BILL TO:</span>
              <strong style="font-size:12px; color:#0f172a;">Enterprise Client Solutions Inc.</strong>
              <span style="font-size:11px; color:#475569; display:block;">Global Headquarters &bull; Technology Procurement</span>
            </div>
            <div style="text-align:right;">
              <span style="font-size:10px; font-weight:700; color:#64748b; display:block; text-transform:uppercase;">ISSUE DATE:</span>
              <strong style="font-size:12px; color:#0f172a;">2026-09-13</strong>
              <span style="font-size:10px; color:#dc2626; font-weight:700; display:block;">PAYMENT TERMS: NET 30</span>
            </div>
          </div>
          <table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:11.5px;">
            <thead>
              <tr style="background:#0d9488; color:#ffffff;">
                <th style="padding:8px 10px; text-align:left;">Item Description</th>
                <th style="padding:8px 10px; text-align:center;">Qty</th>
                <th style="padding:8px 10px; text-align:right;">Rate</th>
                <th style="padding:8px 10px; text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">Giri Orbit Sovereign Enterprise Workspace (Annual License)</td>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:center;">1</td>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:right;">$24,000.00</td>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:right;">$24,000.00</td>
              </tr>
              <tr>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">PresentationGO Vector Diagram 3,500+ Extended Library</td>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:center;">1</td>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:right;">$4,500.00</td>
                <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:right;">$4,500.00</td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex; justify-content:flex-end; margin-top:16px;">
            <div style="width:220px; font-size:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Subtotal:</span>
                <strong>$28,500.00</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Tax (0% Sovereign Export):</span>
                <span>$0.00</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:14px; font-weight:800; color:#0d9488; border-top:2px solid #0d9488; padding-top:6px;">
                <span>Total Due:</span>
                <span>$28,500.00</span>
              </div>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'consulting-services-contract',
    name: 'Independent Contractor Consulting Agreement',
    category: 'agreements',
    desc: 'Contractor agreement defining deliverables, compensation schedule, intellectual property assignment, and covenants',
    previewAccent: '#ea580c',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'INDEPENDENT CONTRACTOR CONSULTING SERVICES AGREEMENT',
        ref: 'GIRI-ICA-2026-ENG',
        htmlContent: `
          <div style="text-align:center; margin-bottom:20px;">
            <span style="font-size:9.5px; font-weight:800; color:#ea580c; letter-spacing:0.08em; text-transform:uppercase;">CONSULTING SERVICES CONTRACT</span>
            <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:4px 0;">INDEPENDENT CONTRACTOR AGREEMENT</h1>
          </div>
          <div style="height:1px; background:#e2e8f0; margin:14px 0;"></div>
          <p style="font-size:12px; line-height:1.7; color:#334155; margin-bottom:12px;">
            This Consulting Services Agreement is entered into by <strong>Giri Corporation</strong> ("Company") and the undersigned independent engineering consultant ("Consultant").
          </p>
          <h3 style="font-size:12.5px; font-weight:700; color:#0f172a; margin:14px 0 6px 0;">1. Scope of Deliverables</h3>
          <p style="font-size:11.5px; line-height:1.6; color:#475569; margin-bottom:12px;">
            Consultant agrees to provide high-throughput architecture optimization, memory leak audits, and multi-format export engineering for the Giri Orbit sovereign productivity platform.
          </p>
          <h3 style="font-size:12.5px; font-weight:700; color:#0f172a; margin:14px 0 6px 0;">2. Proprietary Inventions & IP Assignment</h3>
          <p style="font-size:11.5px; line-height:1.6; color:#475569; margin-bottom:16px;">
            Consultant hereby assigns to Company all right, title, and interest in and to any inventions, designs, code algorithms, and works of authorship developed during the performance of services.
          </p>
          <div style="margin-top:28px; display:grid; grid-template-columns:1fr 1fr; gap:20px; border-top:1px solid #e2e8f0; padding-top:14px;">
            <div>
              <span style="font-size:10px; font-weight:700; color:#0f172a; display:block; margin-bottom:12px;">COMPANY SIGNATURE:</span>
              <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:24px; color:#1e40af; border-bottom:1px solid #cbd5e1;">Abhinav Giri</div>
            </div>
            <div>
              <span style="font-size:10px; font-weight:700; color:#0f172a; display:block; margin-bottom:12px;">CONSULTANT SIGNATURE:</span>
              <div style="border-bottom:1px dashed #94a3b8; height:30px;"></div>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'change-order-addendum',
    name: 'Project Scope Change Order Addendum',
    category: 'memos',
    desc: 'Formal change order tracking scope modifications, timeline revisions, and budget variances with sign-off authorization',
    previewAccent: '#d97706',
    pages: [
      {
        id: 1, rotation: 0,
        title: 'PROJECT SCOPE CHANGE ORDER // ENGINEERING REVISION',
        ref: 'GIRI-CO-2026-08',
        htmlContent: `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <span style="font-size:9.5px; font-weight:800; color:#d97706; letter-spacing:0.08em; text-transform:uppercase;">CHANGE ORDER ADDENDUM</span>
              <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:4px 0;">CHANGE ORDER #08</h1>
            </div>
            <div style="background:#fef3c7; border:1px solid #fde68a; padding:4px 10px; border-radius:4px; color:#92400e; font-weight:800; font-size:11px;">
              STATUS: PENDING SIGN-OFF
            </div>
          </div>
          <div style="height:1px; background:#e2e8f0; margin:12px 0 16px 0;"></div>
          <p style="font-size:12px; line-height:1.7; color:#334155; margin-bottom:12px;">
            This Change Order modifies the Scope of Work under the Master Architecture Agreement between <strong>Giri Corporation</strong> and Client.
          </p>
          <div style="margin:16px 0; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
            <strong style="font-size:12px; color:#0f172a; display:block; margin-bottom:6px;">Description of Changes:</strong>
            <span style="font-size:11.5px; color:#475569; line-height:1.6; display:block;">
              1. Addition of PresentationGO 3,500+ vector diagram catalog with interactive editable nodes.<br>
              2. Integration of PowerPoint Deck templates tab in Kinetic presentation studio.<br>
              3. Hardening of air-gap cryptographic PDF verification signatures in Aegis studio.
            </span>
          </div>
          <div style="margin-top:28px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:24px; color:#1e40af; border-bottom:1.5px solid #0f172a; display:inline-block; padding-bottom:2px;">
                Abhinav Giri
              </div>
              <span style="display:block; font-size:10px; color:#64748b; margin-top:4px;">Technical Project Director</span>
            </div>
            <div style="text-align:right;">
              <span style="font-size:10px; color:#64748b;">EXECUTION DATE:</span>
              <strong style="font-size:11px; display:block; color:#0f172a;">2026-09-13</strong>
            </div>
          </div>
        `
      }
    ]
  }
];
