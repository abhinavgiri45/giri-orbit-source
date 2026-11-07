import { FluentFontPicker } from '../components/fontPicker.js';
import { WORLD_FONTS_CATALOG, loadGoogleFont, populateFontSelect, findFont } from '../data/fonts.js';
import {
  KINETIC_BUILTIN_TEMPLATES,
  PRESENTATION_GO_TEMPLATES,
  PRESENTATION_GO_CATEGORIES,
  PRESENTATION_GO_COLORS,
  PRESENTATION_GO_STEP_FILTERS,
  filterPresentationGoTemplates,
  getPresentationGoStats
} from '../data/templates.js';
import { localSync } from '../components/localFileDirectSync.js';
import { thesaurusManager } from '../components/thesaurusManager.js';
import { orbitDesktopSuite } from '../components/orbitDesktopSuite.js';
import { GiriOfficeFormats } from '../components/giriOfficeFormats.js';
/**
 * ============================================================================
 * GIRI ORBIT — GIRI KINETIC: ENTERPRISE PRESENTATION SUITE (kinetic.js)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * ============================================================================
 * Features:
 * - Full 6-Tab Office Ribbon (Home, Insert, Design, Transitions, Slide Show, View)
 * - Layout Templates: Title, Title & Content, Two Columns, Comparison, Big Metrics, Blank
 * - Shape & Object Inserter (Rectangles, Circles, Badges, Arrows, Custom Textboxes)
 * - Executive Themes: Minimalist White, Sapphire Tech, Nordic Emerald, Obsidian Night, Crimson Sovereign
 * - Aspect Ratio Switcher (16:9 Widescreen vs 4:3 Classic)
 * - Slide Transitions (Fade, Slide Push, Zoom In, Flip) with customizable duration
 * - Interactive Speaker Notes Drawer with real-time per-slide persistence
 * - Presenter Station HUD with real-time Timer, Laser Pointer, and Controls
 * - Full Export (.pptx, .ppt, .pdf, .json) & LocalStorage auto-save
 */
/**
 * Authentic Visual Thumbnail Generator for PresentationGO and PowerPoint Templates
 */
/**
 * ============================================================================
 * GIRI KINETIC - EXECUTIVE THEME & VECTOR BACKGROUND ART ENGINE
 * Dynamically resolves gradients, accent colors, and authentic SVG artwork
 * for Golden Light Prestige, Corporate Navy, Modern AI, and all presentation decks.
 * ============================================================================
 */
/**
 * ============================================================================
 * GIRI KINETIC - UNIVERSAL EXECUTIVE THEME & VECTOR BACKGROUND ART ENGINE
 * Covers 100% of all 3,560+ PresentationGO templates, curated PowerPoint decks,
 * and built-in classic presentations. Never produces a plain white slide.
 * ============================================================================
 */
export function resolveSlideTheme(slide) {
  if (!slide) slide = {};
  const style = (slide.themeStyle || '').toLowerCase();
  const title = (slide.title || '').toLowerCase();
  const tag = (slide.tag || '').toLowerCase();
  const deck = (slide.deckName || '').toLowerCase();
  const desc = (slide.desc || '').toLowerCase();
  const color = (slide.color || '').toLowerCase();
  const layout = (slide.layout || slide.diagramType || '').toLowerCase();
  const text = `${style} ${title} ${tag} ${deck} ${desc} ${color} ${layout}`;

  // Helper to generate diagram-specific ambient watermark geometry
  function getDiagramWatermark(accent) {
    if (layout === 'circular-loop' || layout === 'radial-cycle') {
      return `
        <circle cx="460" cy="259" r="130" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.2"/>
        <circle cx="460" cy="259" r="175" fill="none" stroke="${accent}" stroke-width="1" opacity="0.12"/>
        <circle cx="460" cy="259" r="220" fill="none" stroke="${accent}" stroke-width="0.8" stroke-dasharray="3,6" opacity="0.08"/>
      `;
    }
    if (layout === 'milestone-road' || layout === 'milestone-journey' || layout === 'horizontal-timeline') {
      return `
        <path d="M -50 480 Q 280 500, 520 340 T 980 180" fill="none" stroke="${accent}" stroke-width="3.5" stroke-dasharray="10,8" opacity="0.25"/>
        <circle cx="280" cy="450" r="4" fill="${accent}" opacity="0.4"/>
        <circle cx="520" cy="340" r="4" fill="${accent}" opacity="0.5"/>
        <circle cx="750" cy="240" r="4" fill="${accent}" opacity="0.4"/>
      `;
    }
    if (layout === 'swot-matrix') {
      return `
        <line x1="460" y1="40" x2="460" y2="480" stroke="${accent}" stroke-width="1.2" stroke-dasharray="6,4" opacity="0.2"/>
        <line x1="80" y1="259" x2="840" y2="259" stroke="${accent}" stroke-width="1.2" stroke-dasharray="6,4" opacity="0.2"/>
        <circle cx="460" cy="259" r="45" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.25"/>
      `;
    }
    if (layout === 'hexagon-cluster' || layout === 'hexagon-matrix') {
      return `
        <polygon points="460,180 510,210 510,270 460,300 410,270 410,210" fill="none" stroke="${accent}" stroke-width="1" opacity="0.15"/>
        <polygon points="520,280 570,310 570,370 520,400 470,370 470,310" fill="none" stroke="${accent}" stroke-width="1" opacity="0.12"/>
        <polygon points="400,280 450,310 450,370 400,400 350,370 350,310" fill="none" stroke="${accent}" stroke-width="1" opacity="0.12"/>
      `;
    }
    if (layout === 'pyramid-hierarchy') {
      return `
        <polygon points="460,80 320,450 600,450" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.18"/>
        <line x1="390" y1="260" x2="530" y2="260" stroke="${accent}" stroke-width="1" opacity="0.15"/>
      `;
    }
    if (layout === 'funnel-stages') {
      return `
        <polygon points="300,90 620,90 540,450 380,450" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="4,4" opacity="0.15"/>
      `;
    }
    if (layout === 'gears-process') {
      return `
        <circle cx="780" cy="140" r="90" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,8" opacity="0.18"/>
        <circle cx="140" cy="400" r="70" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,8" opacity="0.15"/>
      `;
    }
    return '';
  }

  // 1. GOLD / AMBER / LUXURY / COPPER
  if (style === 'golden-light' || style === 'luxury-gold' || style === 'copper-wealth' || color === 'amber' || color === 'yellow' || color === 'gold' || text.includes('golden') || text.includes('prestige') || text.includes('luxury') || text.includes('gold') || text.includes('wealth')) {
    const acc = '#fef08a';
    return {
      name: 'golden-light',
      bg: 'radial-gradient(ellipse at bottom left, #422006 0%, #170f05 50%, #09090b 100%)',
      accent: acc,
      accentBorder: 'rgba(234, 179, 8, 0.45)',
      cardBg: 'rgba(26, 18, 7, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <defs>
            <linearGradient id="gl-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
              <stop offset="50%" stop-color="#eab308" stop-opacity="0.75"/>
              <stop offset="100%" stop-color="#a16207" stop-opacity="0"/>
            </linearGradient>
            <radialGradient id="gl-gold-burst" cx="0%" cy="100%" r="90%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.45"/>
              <stop offset="50%" stop-color="#eab308" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="920" height="518" fill="url(#gl-gold-burst)"/>
          <path d="M -50 518 Q 200 200, 600 350 T 1000 100" fill="none" stroke="url(#gl-gold-grad)" stroke-width="45" opacity="0.35"/>
          <path d="M -30 540 Q 300 250, 650 400 T 1050 150" fill="none" stroke="#fef08a" stroke-width="3" opacity="0.85"/>
          <path d="M 20 560 Q 400 320, 720 440 T 1100 200" fill="none" stroke="#ca8a04" stroke-width="1.8" opacity="0.6"/>
          <circle cx="150" cy="420" r="4" fill="#ffffff" filter="drop-shadow(0 0 8px #fef08a)"/>
          <circle cx="380" cy="270" r="3" fill="#ffffff"/>
          <circle cx="680" cy="380" r="5" fill="#fef08a" filter="drop-shadow(0 0 10px #eab308)"/>
          <circle cx="850" cy="180" r="3.5" fill="#ffffff"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 2. CORPORATE NAVY / BLUE / ANNUAL REPORT / BOARD / QBR / AUDIT / SAPPHIRE
  if (style === 'corporate-navy' || color === 'blue' || text.includes('corporate') || text.includes('annual report') || text.includes('board') || text.includes('qbr') || text.includes('governance') || text.includes('navy') || text.includes('sapphire') || text.includes('finance')) {
    const acc = '#38bdf8';
    return {
      name: 'corporate-navy',
      bg: 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)',
      accent: acc,
      accentBorder: 'rgba(56, 189, 248, 0.45)',
      cardBg: 'rgba(7, 25, 47, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <defs>
            <linearGradient id="cn-navy-mesh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M -50 150 L 400 420 L 980 100" fill="none" stroke="url(#cn-navy-mesh)" stroke-width="5" opacity="0.7"/>
          <path d="M 0 250 L 460 520 L 1020 200" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.5"/>
          <polygon points="700,50 890,150 890,380 700,280" fill="#0284c7" opacity="0.2"/>
          <polygon points="500,150 700,50 700,280 500,380" fill="#38bdf8" opacity="0.15"/>
          <circle cx="400" cy="420" r="6" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)"/>
          <circle cx="700" cy="50" r="5" fill="#93c5fd"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 3. CRIMSON VENTURE / RED / ROSE / PITCH / UNICORN / CAPITAL / VC
  if (style === 'crimson-venture' || style === 'rose-vibrant' || color === 'red' || color === 'crimson' || text.includes('pitch') || text.includes('venture') || text.includes('unicorn') || text.includes('crimson') || text.includes('capital') || text.includes('seed')) {
    const acc = '#fb7185';
    return {
      name: 'crimson-venture',
      bg: 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)',
      accent: acc,
      accentBorder: 'rgba(251, 113, 133, 0.45)',
      cardBg: 'rgba(76, 5, 25, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.9; pointer-events:none;">
          <defs>
            <linearGradient id="cv-crimson-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f43f5e"/>
              <stop offset="100%" stop-color="#fda4af"/>
            </linearGradient>
          </defs>
          <polygon points="920,0 350,518 920,518" fill="#e11d48" opacity="0.25"/>
          <polygon points="920,100 500,518 920,518" fill="#f43f5e" opacity="0.18"/>
          <path d="M -50 450 Q 400 150, 980 80" fill="none" stroke="url(#cv-crimson-grad)" stroke-width="6"/>
          <circle cx="680" cy="150" r="6" fill="#ffffff" filter="drop-shadow(0 0 12px #f43f5e)"/>
          <line x1="120" y1="100" x2="300" y2="100" stroke="#fda4af" stroke-width="2" opacity="0.6"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 4. CREATIVE GRADIENT / MODERN AI / DEEPTECH / NEURAL / FRONTIER / ELECTRIC INDIGO
  if (style === 'creative-gradient' || style === 'electric-indigo' || text.includes('ai') || text.includes('deeptech') || text.includes('neural') || text.includes('frontier') || text.includes('gradient') || text.includes('cognitive') || text.includes('quantum')) {
    const acc = '#f472b6';
    return {
      name: 'creative-gradient',
      bg: 'linear-gradient(135deg, #312e81 0%, #6366f1 40%, #ec4899 100%)',
      accent: acc,
      accentBorder: 'rgba(244, 114, 182, 0.45)',
      cardBg: 'rgba(49, 46, 129, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <defs>
            <radialGradient id="cg-orb1" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#c084fc" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="cg-orb2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f472b6" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#db2777" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="720" cy="180" r="220" fill="url(#cg-orb1)"/>
          <circle cx="280" cy="360" r="180" fill="url(#cg-orb2)"/>
          <path d="M 0 260 Q 300 80, 580 340 T 980 200" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.6"/>
          <circle cx="580" cy="340" r="5" fill="#fff"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 5. TEAL & CYAN FLOW / OCEAN / CLOUD / MODERN TECH
  if (style === 'teal-flow' || color === 'cyan' || color === 'teal' || text.includes('teal') || text.includes('cyan') || text.includes('flow') || text.includes('ocean') || text.includes('cloud')) {
    const acc = '#2dd4bf';
    return {
      name: 'teal-flow',
      bg: 'radial-gradient(ellipse at top left, #042f2e 0%, #083344 50%, #020617 100%)',
      accent: acc,
      accentBorder: 'rgba(45, 212, 191, 0.45)',
      cardBg: 'rgba(4, 47, 46, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <defs>
            <linearGradient id="tf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0.2"/>
            </linearGradient>
          </defs>
          <path d="M -50 100 Q 300 400, 650 150 T 1000 450" fill="none" stroke="url(#tf-grad)" stroke-width="24" opacity="0.4"/>
          <path d="M -20 150 Q 350 450, 700 200 T 1050 500" fill="none" stroke="#2dd4bf" stroke-width="3" opacity="0.75"/>
          <circle cx="350" cy="380" r="5" fill="#5eead4" filter="drop-shadow(0 0 8px #2dd4bf)"/>
          <circle cx="700" cy="200" r="4" fill="#ffffff"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 6. NEON WAVES / CYBERPUNK / SYNTH
  if (style === 'neon-waves' || text.includes('neon') || text.includes('cyber waves') || text.includes('synth')) {
    const acc = '#c084fc';
    return {
      name: 'neon-waves',
      bg: 'radial-gradient(ellipse at bottom right, #1e1b4b 0%, #0f172a 50%, #09090b 100%)',
      accent: acc,
      accentBorder: 'rgba(192, 132, 252, 0.45)',
      cardBg: 'rgba(30, 27, 75, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <defs>
            <linearGradient id="nw-neon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="50%" stop-color="#a855f7"/>
              <stop offset="100%" stop-color="#ec4899"/>
            </linearGradient>
          </defs>
          <path d="M 0 350 Q 230 150, 460 350 T 920 350" fill="none" stroke="url(#nw-neon-grad)" stroke-width="5" filter="drop-shadow(0 0 10px #a855f7)"/>
          <path d="M 0 380 Q 230 180, 460 380 T 920 380" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.6"/>
          <circle cx="460" cy="350" r="6" fill="#ffffff" filter="drop-shadow(0 0 8px #a855f7)"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 7. ENTERPRISE CYBERSECURITY & ZERO-TRUST / TERMINAL
  if (style === 'cyber-matrix' || text.includes('cyber') || text.includes('security') || text.includes('zero-trust') || text.includes('cryptograph')) {
    const acc = '#34d399';
    return {
      name: 'cyber-matrix',
      bg: 'radial-gradient(ellipse at center, #022c22 0%, #031c15 60%, #020617 100%)',
      accent: acc,
      accentBorder: 'rgba(52, 211, 153, 0.45)',
      cardBg: 'rgba(2, 44, 34, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <defs>
            <pattern id="cm-matrix" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#065f46" stroke-width="1" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="920" height="518" fill="url(#cm-matrix)"/>
          <path d="M 50 420 L 350 420 L 520 180 L 880 180" fill="none" stroke="#10b981" stroke-width="4"/>
          <circle cx="520" cy="180" r="6" fill="#34d399" filter="drop-shadow(0 0 10px #10b981)"/>
          <polygon points="780,100 830,130 830,190 780,220 730,190 730,130" fill="none" stroke="#34d399" stroke-width="2"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 8. MEDICAL, HEALTHCARE & CLINICAL RESEARCH
  if (style === 'medical-clean' || text.includes('medical') || text.includes('healthcare') || text.includes('clinical') || text.includes('biotech') || text.includes('pharma')) {
    const acc = '#38bdf8';
    return {
      name: 'medical-clean',
      bg: 'linear-gradient(135deg, #082f49 0%, #0369a1 60%, #0ea5e9 100%)',
      accent: acc,
      accentBorder: 'rgba(56, 189, 248, 0.45)',
      cardBg: 'rgba(8, 47, 73, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <path d="M 0 300 L 250 300 L 310 120 L 370 420 L 430 220 L 490 360 L 550 300 L 920 300" fill="none" stroke="#7dd3fc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="310" cy="120" r="6" fill="#fff" filter="drop-shadow(0 0 10px #38bdf8)"/>
          <circle cx="750" cy="160" r="60" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4"/>
          <circle cx="750" cy="160" r="8" fill="#38bdf8"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 9. VIOLET LUXURY / CONSULTING / STRATEGY / MCKINSEY / AMETHYST / PURPLE
  if (style === 'violet-luxury' || color === 'purple' || color === 'violet' || text.includes('consulting') || text.includes('strategy') || text.includes('luxury') || text.includes('amethyst') || text.includes('purple')) {
    const acc = '#c084fc';
    return {
      name: 'violet-luxury',
      bg: 'radial-gradient(ellipse at bottom left, #4c1d95 0%, #2e1065 50%, #09090b 100%)',
      accent: acc,
      accentBorder: 'rgba(192, 132, 252, 0.45)',
      cardBg: 'rgba(76, 29, 149, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <defs>
            <linearGradient id="vl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e879f9"/>
              <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
          <path d="M -50 450 Q 300 50, 620 260 T 1000 80" fill="none" stroke="url(#vl-grad)" stroke-width="8" opacity="0.7"/>
          <circle cx="680" cy="150" r="80" fill="none" stroke="#c084fc" stroke-width="2" opacity="0.4"/>
          <circle cx="260" cy="320" r="5" fill="#ffffff" filter="drop-shadow(0 0 8px #e879f9)"/>
          <circle cx="800" cy="120" r="6" fill="#f5d0fe"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 10. SUNSET WARM / OMNICHANNEL MARKETING / ORANGE / CORAL
  if (style === 'sunset-warm' || color === 'orange' || color === 'coral' || text.includes('sunset') || text.includes('marketing') || text.includes('omnichannel') || text.includes('orange') || text.includes('coral')) {
    const acc = '#fed7aa';
    return {
      name: 'sunset-warm',
      bg: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)',
      accent: acc,
      accentBorder: 'rgba(254, 215, 170, 0.45)',
      cardBg: 'rgba(124, 45, 18, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <circle cx="750" cy="200" r="160" fill="#fb923c" opacity="0.3"/>
          <path d="M 0 420 Q 250 220, 500 350 T 950 180" fill="none" stroke="#ffedd5" stroke-width="5"/>
          <path d="M 50 480 Q 320 300, 600 400 T 1000 250" fill="none" stroke="#fdba74" stroke-width="2.5" opacity="0.7"/>
          <circle cx="500" cy="350" r="5" fill="#fff"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 11. EMERALD GROWTH / SAAS ENTERPRISE / FOREST ECO / GREEN
  if (style === 'emerald-growth' || style === 'forest-eco' || color === 'green' || color === 'emerald' || text.includes('saas') || text.includes('sales') || text.includes('emerald') || text.includes('green') || text.includes('eco') || text.includes('growth')) {
    const acc = '#6ee7b7';
    return {
      name: 'emerald-growth',
      bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)',
      accent: acc,
      accentBorder: 'rgba(110, 231, 183, 0.45)',
      cardBg: 'rgba(2, 44, 34, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <path d="M -50 450 Q 280 450, 500 260 T 950 80" fill="none" stroke="#34d399" stroke-width="5"/>
          <polygon points="680,360 810,230 810,430 680,430" fill="#10b981" opacity="0.2"/>
          <circle cx="500" cy="260" r="6" fill="#ffffff" filter="drop-shadow(0 0 8px #34d399)"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 12. OBSIDIAN MINIMAL / SLATE INDUSTRIAL / DARK / MONOCHROME
  if (style === 'obsidian-minimal' || style === 'slate-industrial' || color === 'dark' || color === 'slate' || text.includes('minimal') || text.includes('obsidian') || text.includes('monochrome') || text.includes('black')) {
    const acc = '#f4f4f5';
    return {
      name: 'obsidian-minimal',
      bg: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
      accent: acc,
      accentBorder: 'rgba(244, 244, 245, 0.35)',
      cardBg: 'rgba(18, 18, 20, 0.85)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.7; pointer-events:none;">
          <rect x="60" y="60" width="800" height="398" fill="none" stroke="#52525b" stroke-width="1.2" stroke-dasharray="4,4"/>
          <line x1="60" y1="259" x2="860" y2="259" stroke="#3f3f46" stroke-width="1"/>
          <line x1="460" y1="60" x2="460" y2="458" stroke="#3f3f46" stroke-width="1"/>
          <circle cx="460" cy="259" r="120" fill="none" stroke="#e4e4e7" stroke-width="1.8"/>
          <circle cx="460" cy="259" r="6" fill="#ffffff"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // 13. NORDIC FROST / ARCTIC
  if (style === 'nordic-frost' || text.includes('frost') || text.includes('arctic') || text.includes('glacial')) {
    const acc = '#7dd3fc';
    return {
      name: 'nordic-frost',
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)',
      accent: acc,
      accentBorder: 'rgba(125, 211, 252, 0.45)',
      cardBg: 'rgba(15, 23, 42, 0.72)',
      isDark: true,
      svgArt: `
        <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85; pointer-events:none;">
          <polygon points="700,100 850,30 900,180 750,250" fill="#38bdf8" opacity="0.25"/>
          <polygon points="500,180 700,100 750,250 550,320" fill="#7dd3fc" opacity="0.2"/>
          <path d="M -50 350 L 300 220 L 600 380 T 950 150" fill="none" stroke="#bae6fd" stroke-width="4"/>
          <circle cx="600" cy="380" r="6" fill="#ffffff"/>
          ${getDiagramWatermark(acc)}
        </svg>
      `
    };
  }

  // Universal Default: Premium Obsidian Sapphire with Dynamic Accent & Diagram Watermark
  const dynamicAccent = slide.previewAccent || slide.accent || '#38bdf8';
  return {
    name: 'default-executive',
    bg: slide.bg || 'linear-gradient(135deg, #070d19 0%, #0f172a 50%, #1e293b 100%)',
    accent: dynamicAccent,
    accentBorder: `${dynamicAccent}45`,
    cardBg: 'rgba(15, 23, 42, 0.72)',
    isDark: true,
    svgArt: `
      <svg viewBox="0 0 920 518" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.35; pointer-events:none;">
        <circle cx="850" cy="80" r="280" fill="${dynamicAccent}" filter="blur(90px)" opacity="0.18"/>
        <circle cx="80" cy="460" r="220" fill="#3b82f6" filter="blur(90px)" opacity="0.12"/>
        <path d="M 0 160 Q 460 380, 920 200" fill="none" stroke="${dynamicAccent}" stroke-width="2" opacity="0.3"/>
        ${getDiagramWatermark(dynamicAccent)}
      </svg>
    `
  };
}

function renderTemplateVisualThumbnail(tpl) {
  const accent = tpl.previewAccent || '#2563eb';
  const type = tpl.diagramType || (tpl.slides?.[0]?.diagramType) || (tpl.slides?.[0]?.layout) || '';
  const title = tpl.name || 'Template';
  const cleanId = String(tpl.id || Math.random()).replace(/[^a-zA-Z0-9_-]/g, '');
  const isDeck = (tpl.category === 'presentation' || tpl.category === 'powerpoint' || tpl.diagramType === 'presentation-collage' || tpl.diagramType === 'powerpoint-deck' || (tpl.slides && tpl.slides.length >= 4));

  // --- MULTI-SLIDE COLLAGE PREVIEW FOR PRESENTATION DECKS ---
  if (isDeck) {
    let heroBg = '#090d16';
    let heroArt = '';
    const nameLower = (tpl.name || '').toLowerCase();
    const style = tpl.themeStyle || '';
    
    // Theme categorization
    const isGolden = style === 'golden-light' || style === 'luxury-gold' || nameLower.includes('golden') || nameLower.includes('prestige') || nameLower.includes('gold');
    const isTeal = style === 'teal-flow' || nameLower.includes('teal') || nameLower.includes('cyan') || nameLower.includes('flow');
    const isNeon = style === 'neon-waves' || nameLower.includes('neon') || nameLower.includes('cyber waves');
    const isCorporate = style === 'corporate-navy' || nameLower.includes('annual report') || nameLower.includes('corporate') || nameLower.includes('board briefing') || nameLower.includes('qbr') || nameLower.includes('quarterly business');
    const isCrimson = style === 'crimson-venture' || nameLower.includes('pitch') || nameLower.includes('venture') || nameLower.includes('unicorn') || nameLower.includes('crimson');
    const isModernAi = style === 'creative-gradient' || nameLower.includes('ai') || nameLower.includes('deeptech') || nameLower.includes('neural') || nameLower.includes('frontier');
    const isMinimal = style === 'obsidian-minimal' || nameLower.includes('minimalist') || nameLower.includes('creative studio') || nameLower.includes('portfolio') || nameLower.includes('monochrome');
    const isMedical = style === 'medical-clean' || nameLower.includes('healthcare') || nameLower.includes('medical') || nameLower.includes('clinical') || nameLower.includes('biotech') || nameLower.includes('pharma');
    const isCyber = style === 'cyber-matrix' || nameLower.includes('cybersecurity') || nameLower.includes('zero-trust') || nameLower.includes('cryptographic') || nameLower.includes('security');
    const isConsulting = style === 'violet-luxury' || nameLower.includes('consulting') || nameLower.includes('strategy') || nameLower.includes('amethyst') || nameLower.includes('luxury');
    const isSunset = style === 'sunset-warm' || nameLower.includes('marketing') || nameLower.includes('omnichannel') || nameLower.includes('sunset') || nameLower.includes('campaign');
    const isSaaS = style === 'emerald-growth' || style === 'forest-eco' || nameLower.includes('saas') || nameLower.includes('sales') || nameLower.includes('enterprise proposal') || nameLower.includes('sustainable') || nameLower.includes('emerald');
    const isNordic = style === 'nordic-frost' || nameLower.includes('frost') || nameLower.includes('arctic') || nameLower.includes('glacial');

    let themeAccent = accent;

    if (isGolden) {
      themeAccent = '#fef08a';
      heroBg = 'radial-gradient(ellipse at bottom left, #422006 0%, #170f05 50%, #09090b 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <defs>
            <linearGradient id="gold-grad-${cleanId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
              <stop offset="50%" stop-color="#eab308" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#a16207" stop-opacity="0"/>
            </linearGradient>
            <radialGradient id="gold-burst-${cleanId}" cx="0%" cy="100%" r="90%">
              <stop offset="0%" stop-color="#fef08a" stop-opacity="0.5"/>
              <stop offset="50%" stop-color="#eab308" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="160" height="100" fill="url(#gold-burst-${cleanId})"/>
          <path d="M -20 100 Q 40 40, 110 70 T 190 20" fill="none" stroke="url(#gold-grad-${cleanId})" stroke-width="12" opacity="0.6"/>
          <path d="M -10 110 Q 60 50, 120 80 T 200 30" fill="none" stroke="#fef08a" stroke-width="2.5" opacity="0.9"/>
          <path d="M 10 115 Q 80 65, 130 90 T 210 40" fill="none" stroke="#ca8a04" stroke-width="1.5" opacity="0.7"/>
          <circle cx="25" cy="85" r="2" fill="#fff" filter="drop-shadow(0 0 4px #fef08a)"/>
          <circle cx="70" cy="55" r="1.5" fill="#fff"/>
          <circle cx="120" cy="75" r="2.5" fill="#fef08a"/>
        </svg>
      `;
    } else if (isCorporate) {
      themeAccent = '#38bdf8';
      heroBg = 'linear-gradient(135deg, #07192f 0%, #0f2c59 55%, #1e40af 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <defs>
            <linearGradient id="navy-mesh-${cleanId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M -10 30 L 70 80 L 170 20" fill="none" stroke="url(#navy-mesh-${cleanId})" stroke-width="2.5" opacity="0.7"/>
          <path d="M 0 50 L 80 100 L 180 40" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity="0.5"/>
          <polygon points="120,10 155,30 155,75 120,55" fill="#0284c7" opacity="0.25"/>
          <polygon points="85,30 120,10 120,55 85,75" fill="#38bdf8" opacity="0.2"/>
          <circle cx="70" cy="80" r="3" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)"/>
          <circle cx="120" cy="10" r="2.5" fill="#93c5fd"/>
        </svg>
      `;
    } else if (isCrimson) {
      themeAccent = '#fb7185';
      heroBg = 'radial-gradient(ellipse at top right, #881337 0%, #4c0519 50%, #09090b 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.9;">
          <defs>
            <linearGradient id="crimson-grad-${cleanId}" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f43f5e"/>
              <stop offset="100%" stop-color="#fda4af"/>
            </linearGradient>
          </defs>
          <polygon points="160,0 60,100 160,100" fill="#e11d48" opacity="0.35"/>
          <polygon points="160,20 90,100 160,100" fill="#f43f5e" opacity="0.25"/>
          <path d="M -10 90 Q 70 30, 170 15" fill="none" stroke="url(#crimson-grad-${cleanId})" stroke-width="3"/>
          <circle cx="115" cy="30" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #f43f5e)"/>
          <line x1="25" y1="20" x2="55" y2="20" stroke="#fda4af" stroke-width="1.5" opacity="0.6"/>
        </svg>
      `;
    } else if (isModernAi) {
      themeAccent = '#f472b6';
      heroBg = 'linear-gradient(135deg, #312e81 0%, #6366f1 40%, #ec4899 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <defs>
            <radialGradient id="ai-orb1-${cleanId}" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#c084fc" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="ai-orb2-${cleanId}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f472b6" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#db2777" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="125" cy="35" r="45" fill="url(#ai-orb1-${cleanId})"/>
          <circle cx="50" cy="70" r="35" fill="url(#ai-orb2-${cleanId})"/>
          <path d="M 0 50 Q 50 15, 100 65 T 170 40" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
          <circle cx="100" cy="65" r="2.5" fill="#fff"/>
        </svg>
      `;
    } else if (isMinimal) {
      themeAccent = '#f4f4f5';
      heroBg = 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.75;">
          <rect x="12" y="12" width="136" height="76" fill="none" stroke="#52525b" stroke-width="0.8" stroke-dasharray="2,2"/>
          <line x1="12" y1="50" x2="148" y2="50" stroke="#3f3f46" stroke-width="0.6"/>
          <line x1="80" y1="12" x2="80" y2="88" stroke="#3f3f46" stroke-width="0.6"/>
          <circle cx="80" cy="50" r="24" fill="none" stroke="#e4e4e7" stroke-width="1.2"/>
          <circle cx="80" cy="50" r="3" fill="#ffffff"/>
          <rect x="25" y="25" width="20" height="2" fill="#a1a1aa"/>
        </svg>
      `;
    } else if (isMedical) {
      themeAccent = '#38bdf8';
      heroBg = 'linear-gradient(135deg, #082f49 0%, #0369a1 60%, #0ea5e9 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <path d="M 0 55 L 45 55 L 55 25 L 65 75 L 75 40 L 85 65 L 95 55 L 160 55" fill="none" stroke="#7dd3fc" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="55" cy="25" r="3" fill="#fff" filter="drop-shadow(0 0 5px #38bdf8)"/>
          <circle cx="130" cy="30" r="12" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,2"/>
          <circle cx="130" cy="30" r="4" fill="#38bdf8"/>
        </svg>
      `;
    } else if (isCyber) {
      themeAccent = '#34d399';
      heroBg = 'radial-gradient(ellipse at center, #022c22 0%, #031c15 60%, #020617 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <defs>
            <pattern id="matrix-grid-${cleanId}" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#065f46" stroke-width="0.7" opacity="0.6"/>
            </pattern>
          </defs>
          <rect width="160" height="100" fill="url(#matrix-grid-${cleanId})"/>
          <path d="M 10 80 L 60 80 L 90 35 L 150 35" fill="none" stroke="#10b981" stroke-width="2.5"/>
          <circle cx="90" cy="35" r="3.5" fill="#34d399" filter="drop-shadow(0 0 6px #10b981)"/>
          <polygon points="135,20 145,26 145,38 135,44 125,38 125,26" fill="none" stroke="#34d399" stroke-width="1.2"/>
        </svg>
      `;
    } else if (isConsulting) {
      themeAccent = '#c084fc';
      heroBg = 'radial-gradient(ellipse at bottom left, #4c1d95 0%, #2e1065 50%, #09090b 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <defs>
            <linearGradient id="violet-grad-${cleanId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e879f9"/>
              <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
          <path d="M -10 90 Q 50 10, 110 50 T 180 15" fill="none" stroke="url(#violet-grad-${cleanId})" stroke-width="4" opacity="0.7"/>
          <circle cx="120" cy="30" r="18" fill="none" stroke="#c084fc" stroke-width="1.2" opacity="0.5"/>
          <circle cx="45" cy="65" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 4px #e879f9)"/>
          <circle cx="140" cy="25" r="3" fill="#f5d0fe"/>
        </svg>
      `;
    } else if (isSunset) {
      themeAccent = '#fed7aa';
      heroBg = 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <circle cx="130" cy="40" r="32" fill="#fb923c" opacity="0.4"/>
          <path d="M 0 85 Q 45 45, 90 70 T 170 35" fill="none" stroke="#ffedd5" stroke-width="3"/>
          <path d="M 10 95 Q 60 60, 110 80 T 180 50" fill="none" stroke="#fdba74" stroke-width="1.5" opacity="0.7"/>
          <circle cx="90" cy="70" r="3" fill="#fff"/>
        </svg>
      `;
    } else if (isSaaS) {
      themeAccent = '#6ee7b7';
      heroBg = 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <path d="M -10 85 Q 50 85, 90 50 T 170 15" fill="none" stroke="#34d399" stroke-width="3"/>
          <polygon points="120,70 145,45 145,85 120,85" fill="#10b981" opacity="0.3"/>
          <circle cx="90" cy="50" r="3" fill="#ffffff" filter="drop-shadow(0 0 5px #34d399)"/>
          <circle cx="140" cy="20" r="2.5" fill="#a7f3d0"/>
        </svg>
      `;
    } else if (isTeal) {
      themeAccent = '#67e8f9';
      heroBg = 'radial-gradient(ellipse at top right, #083344 0%, #031c26 50%, #020617 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <defs>
            <linearGradient id="teal-grad-${cleanId}" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8"/>
              <stop offset="60%" stop-color="#0284c7" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M -20 20 Q 50 100, 120 40 T 180 90" fill="none" stroke="url(#teal-grad-${cleanId})" stroke-width="14" opacity="0.5"/>
          <path d="M -10 30 Q 60 110, 130 50 T 190 100" fill="none" stroke="#22d3ee" stroke-width="3" opacity="0.85"/>
          <path d="M 10 40 Q 75 115, 140 60 T 200 110" fill="none" stroke="#67e8f9" stroke-width="1.5" opacity="0.7"/>
        </svg>
      `;
    } else if (isNeon) {
      themeAccent = '#c084fc';
      heroBg = 'radial-gradient(ellipse at center, #1e1035 0%, #0d061a 60%, #030108 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.9;">
          <defs>
            <linearGradient id="neon-grad-${cleanId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a855f7"/>
              <stop offset="100%" stop-color="#06b6d4"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="80" x2="160" y2="80" stroke="#3b0764" stroke-width="1"/>
          <line x1="0" y1="90" x2="160" y2="90" stroke="#3b0764" stroke-width="1"/>
          <path d="M 0 65 Q 40 20, 80 65 T 160 65" fill="none" stroke="url(#neon-grad-${cleanId})" stroke-width="3.5"/>
          <path d="M 0 75 Q 40 30, 80 75 T 160 75" fill="none" stroke="#c084fc" stroke-width="2" opacity="0.8"/>
          <path d="M 0 85 Q 40 40, 80 85 T 160 85" fill="none" stroke="#06b6d4" stroke-width="1.5" opacity="0.7"/>
        </svg>
      `;
    } else if (isNordic) {
      themeAccent = '#7dd3fc';
      heroBg = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.85;">
          <polygon points="120,20 150,5 160,35 130,50" fill="#38bdf8" opacity="0.3"/>
          <polygon points="85,35 120,20 130,50 95,65" fill="#7dd3fc" opacity="0.25"/>
          <path d="M -10 65 L 60 40 L 120 70 L 180 30" fill="none" stroke="#bae6fd" stroke-width="2"/>
          <circle cx="120" cy="70" r="3" fill="#ffffff"/>
        </svg>
      `;
    } else {
      themeAccent = accent;
      heroBg = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
      heroArt = `
        <svg viewBox="0 0 160 100" style="position:absolute; inset:0; width:100%; height:100%; opacity:0.6;">
          <circle cx="140" cy="20" r="45" fill="${accent}" fill-opacity="0.2"/>
          <rect x="15" y="70" width="70" height="4" rx="2" fill="${accent}"/>
        </svg>
      `;
    }

    const slideCount = tpl.slides?.length || 6;
    return `
      <div class="pgo-collage-wrap">
        <!-- Main Primary Hero Slide Preview -->
        <div class="pgo-collage-hero" style="background:${heroBg}; display:flex; flex-direction:column; justify-content:flex-end; padding:12px 10px;">
          ${heroArt}
          <div style="position:relative; z-index:2;">
            <span style="font-size:7px; font-weight:800; color:${themeAccent}; text-transform:uppercase; letter-spacing:0.06em;">PRESENTATION THEME</span>
            <div style="font-size:10.5px; font-weight:800; color:#ffffff; line-height:1.2; margin:2px 0; max-height:26px; overflow:hidden; text-overflow:ellipsis;">${title}</div>
            <div style="font-size:7px; color:#cbd5e1; opacity:0.8;">16:9 Widescreen Presentation</div>
          </div>
        </div>

        <!-- 4 Complementary Mini Slides in 2x2 Grid -->
        <div class="pgo-collage-grid">
          <div class="pgo-collage-mini" title="Agenda Layout">
            <span style="font-size:5px; font-weight:700; color:#94a3b8; margin-bottom:2px;">AGENDA</span>
            <div style="width:70%; height:2px; background:${themeAccent}; border-radius:1px; margin-bottom:2px;"></div>
            <div style="width:90%; height:1.5px; background:#475569; border-radius:1px; margin-bottom:1.5px;"></div>
            <div style="width:60%; height:1.5px; background:#475569; border-radius:1px;"></div>
          </div>
          <div class="pgo-collage-mini" title="Columns Layout">
            <span style="font-size:5px; font-weight:700; color:#94a3b8; margin-bottom:2px;">COLUMNS</span>
            <div style="display:flex; gap:2px; height:14px; align-items:flex-end;">
              <div style="flex:1; height:100%; background:#1e293b; border-top:1.5px solid ${themeAccent};"></div>
              <div style="flex:1; height:100%; background:#1e293b; border-top:1.5px solid #38bdf8;"></div>
            </div>
          </div>
          <div class="pgo-collage-mini" title="Metrics Layout">
            <span style="font-size:5px; font-weight:700; color:#94a3b8; margin-bottom:1px;">METRICS</span>
            <span style="font-size:8px; font-weight:900; color:${themeAccent}; line-height:1;">99%</span>
            <div style="width:80%; height:1.5px; background:#475569; border-radius:1px; margin-top:2px;"></div>
          </div>
          <div class="pgo-collage-mini" title="Conclusion Layout">
            <span style="font-size:5px; font-weight:700; color:#94a3b8; margin-bottom:2px;">THANK YOU</span>
            <div style="width:50%; height:2px; background:${themeAccent}; border-radius:1px; margin:2px 0;"></div>
            <span style="font-size:5px; color:#64748b;">Q &amp; A</span>
          </div>
        </div>

        <!-- Watermark Link -->
        <div class="pgo-watermark-line" style="bottom:6px; left:10px;">
          <a href="https://www.presentationgo.com/" target="_blank" rel="noopener noreferrer" title="PresentationGO (www.presentationgo.com)" onclick="event.stopPropagation();">www.presentationgo.com</a>
        </div>
        <!-- slides badge overlay -->
        <div class="pgo-slides-count-pill">${slideCount} slides</div>
      </div>
    `;
  }

  // --- DIAGRAM VECTOR CANVASES (LIGHT CLEAN BACKGROUND WITH REALISTIC GRAPHICS) ---
  let diagramSvg = '';

  if (type === 'milestone-road' || type === 'milestone-journey') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Winding Asphalt Road -->
        <path d="M 15 105 Q 75 125, 115 80 T 225 35" fill="none" stroke="#1e293b" stroke-width="26" stroke-linecap="round"/>
        <path d="M 15 105 Q 75 125, 115 80 T 225 35" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-dasharray="6,5"/>
        
        <!-- Milestone 01 (Blue) -->
        <circle cx="45" cy="108" r="8" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
        <text x="45" y="111" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">01</text>
        <rect x="18" y="70" width="55" height="22" rx="3" fill="#ffffff" stroke="#2563eb" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
        <text x="45.5" y="79" font-size="6" font-weight="bold" fill="#1e293b" text-anchor="middle">DISCOVERY</text>
        <text x="45.5" y="87" font-size="4.5" fill="#64748b" text-anchor="middle">Planning &amp; Audit</text>

        <!-- Milestone 02 (Green) -->
        <circle cx="105" cy="88" r="8" fill="#059669" stroke="#ffffff" stroke-width="2"/>
        <text x="105" y="91" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">02</text>
        <rect x="78" y="48" width="55" height="22" rx="3" fill="#ffffff" stroke="#059669" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
        <text x="105.5" y="57" font-size="6" font-weight="bold" fill="#1e293b" text-anchor="middle">PROTOTYPE</text>
        <text x="105.5" y="65" font-size="4.5" fill="#64748b" text-anchor="middle">Iterative Build</text>

        <!-- Milestone 03 (Amber) -->
        <circle cx="160" cy="58" r="8" fill="#d97706" stroke="#ffffff" stroke-width="2"/>
        <text x="160" y="61" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">03</text>
        <rect x="135" y="18" width="52" height="22" rx="3" fill="#ffffff" stroke="#d97706" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
        <text x="161" y="27" font-size="6" font-weight="bold" fill="#1e293b" text-anchor="middle">TESTING</text>
        <text x="161" y="35" font-size="4.5" fill="#64748b" text-anchor="middle">Quality Assurance</text>

        <!-- Milestone 04 (Red) -->
        <circle cx="210" cy="38" r="8" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        <text x="210" y="41" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">04</text>
        <rect x="180" y="62" width="54" height="22" rx="3" fill="#ffffff" stroke="#dc2626" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
        <text x="207" y="71" font-size="6" font-weight="bold" fill="#1e293b" text-anchor="middle">LAUNCH</text>
        <text x="207" y="79" font-size="4.5" fill="#64748b" text-anchor="middle">Production Go</text>
      </svg>
    `;
  } else if (type === 'pentagon-flags') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Flag 1 (Purple) -->
        <polygon points="25,15 80,15 80,85 52.5,105 25,85" fill="#7c3aed"/>
        <circle cx="52.5" cy="40" r="14" fill="#ffffff"/>
        <text x="52.5" y="45" font-size="14" font-weight="900" fill="#7c3aed" text-anchor="middle">1</text>
        <text x="52.5" y="68" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">DISCOVER</text>
        <line x1="38" y1="74" x2="67" y2="74" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
        <text x="52.5" y="80" font-size="5" fill="#f3e8ff" text-anchor="middle">Core Strategy</text>

        <!-- Flag 2 (Teal) -->
        <polygon points="92.5,15 147.5,15 147.5,85 120,105 92.5,85" fill="#0891b2"/>
        <circle cx="120" cy="40" r="14" fill="#ffffff"/>
        <text x="120" y="45" font-size="14" font-weight="900" fill="#0891b2" text-anchor="middle">2</text>
        <text x="120" y="68" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">DEVELOP</text>
        <line x1="105" y1="74" x2="135" y2="74" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
        <text x="120" y="80" font-size="5" fill="#cffafe" text-anchor="middle">Velocity Sprint</text>

        <!-- Flag 3 (Orange/Coral) -->
        <polygon points="160,15 215,15 215,85 187.5,105 160,85" fill="#ea580c"/>
        <circle cx="187.5" cy="40" r="14" fill="#ffffff"/>
        <text x="187.5" y="45" font-size="14" font-weight="900" fill="#ea580c" text-anchor="middle">3</text>
        <text x="187.5" y="68" font-size="7" font-weight="bold" fill="#ffffff" text-anchor="middle">DELIVER</text>
        <line x1="172" y1="74" x2="202" y2="74" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
        <text x="187.5" y="80" font-size="5" fill="#ffedd5" text-anchor="middle">Market Launch</text>
      </svg>
    `;
  } else if (type === 'speech-bubbles') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Bubble 1 (Yellow) -->
        <path d="M 20 25 C 20 15, 80 15, 80 25 C 80 45, 80 55, 60 55 L 45 68 L 48 55 C 20 55, 20 45, 20 25 Z" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.8" stroke-dasharray="3,1.5"/>
        <text x="32" y="32" font-size="16" font-family="Georgia, serif" font-weight="bold" fill="#ca8a04">“</text>
        <text x="50" y="34" font-size="6" font-weight="bold" fill="#854d0e">TESTIMONIAL</text>
        <text x="50" y="42" font-size="5" fill="#a16207">Client Experience</text>
        <circle cx="50" cy="80" r="10" fill="#ca8a04"/>
        <text x="50" y="83.5" font-size="7.5" font-weight="bold" fill="#fff" text-anchor="middle">01</text>
        <text x="50" y="97" font-size="6" font-weight="bold" fill="#1e293b" text-anchor="middle">Product Lead</text>

        <!-- Bubble 2 (Green) -->
        <path d="M 90 25 C 90 15, 150 15, 150 25 C 150 45, 150 55, 130 55 L 115 68 L 118 55 C 90 55, 90 45, 90 25 Z" fill="#dcfce7" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="3,1.5"/>
        <text x="102" y="32" font-size="16" font-family="Georgia, serif" font-weight="bold" fill="#16a34a">“</text>
        <text x="120" y="34" font-size="6" font-weight="bold" fill="#166534">FEEDBACK</text>
        <text x="120" y="42" font-size="5" fill="#15803d">Direct Review</text>
        <circle cx="120" cy="80" r="10" fill="#16a34a"/>
        <text x="120" y="83.5" font-size="7.5" font-weight="bold" fill="#fff" text-anchor="middle">02</text>
        <text x="120" y="97" font-size="6" font-weight="bold" fill="#1e293b" text-anchor="middle">CTO / Founder</text>

        <!-- Bubble 3 (Cyan) -->
        <path d="M 160 25 C 160 15, 220 15, 220 25 C 220 45, 220 55, 200 55 L 185 68 L 188 55 C 160 55, 160 45, 160 25 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="3,1.5"/>
        <text x="172" y="32" font-size="16" font-family="Georgia, serif" font-weight="bold" fill="#0284c7">“</text>
        <text x="190" y="34" font-size="6" font-weight="bold" fill="#075985">INSIGHTS</text>
        <text x="190" y="42" font-size="5" fill="#0369a1">User Telemetry</text>
        <circle cx="190" cy="80" r="10" fill="#0284c7"/>
        <text x="190" y="83.5" font-size="7.5" font-weight="bold" fill="#fff" text-anchor="middle">03</text>
        <text x="190" y="97" font-size="6" font-weight="bold" fill="#1e293b" text-anchor="middle">Enterprise VP</text>
      </svg>
    `;
  } else if (type === 'gears-process') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Gear 1 (Cyan) -->
        <circle cx="70" cy="65" r="34" fill="#0891b2" opacity="0.15"/>
        <circle cx="70" cy="65" r="28" fill="#0891b2" stroke="#0e7490" stroke-width="2"/>
        <circle cx="70" cy="65" r="12" fill="#ffffff"/>
        <text x="70" y="69" font-size="11" font-weight="bold" fill="#0891b2" text-anchor="middle">1</text>
        <text x="70" y="105" font-size="7" font-weight="bold" fill="#1e293b" text-anchor="middle">STRATEGY</text>

        <!-- Gear 2 (Blue) -->
        <circle cx="120" cy="45" r="28" fill="#2563eb" opacity="0.15"/>
        <circle cx="120" cy="45" r="22" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
        <circle cx="120" cy="45" r="9" fill="#ffffff"/>
        <text x="120" y="48.5" font-size="9" font-weight="bold" fill="#2563eb" text-anchor="middle">2</text>
        <text x="120" y="80" font-size="7" font-weight="bold" fill="#1e293b" text-anchor="middle">EXECUTION</text>

        <!-- Gear 3 (Green) -->
        <circle cx="170" cy="65" r="34" fill="#059669" opacity="0.15"/>
        <circle cx="170" cy="65" r="28" fill="#059669" stroke="#047857" stroke-width="2"/>
        <circle cx="170" cy="65" r="12" fill="#ffffff"/>
        <text x="170" y="69" font-size="11" font-weight="bold" fill="#059669" text-anchor="middle">3</text>
        <text x="170" y="105" font-size="7" font-weight="bold" fill="#1e293b" text-anchor="middle">FEEDBACK</text>
      </svg>
    `;
  } else if (type === 'circular-loop') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <path d="M 90 65 A 35 35 0 0 1 120 35" fill="none" stroke="#2563eb" stroke-width="10" stroke-linecap="round"/>
        <path d="M 120 35 A 35 35 0 0 1 150 65" fill="none" stroke="#059669" stroke-width="10" stroke-linecap="round"/>
        <path d="M 150 65 A 35 35 0 0 1 120 95" fill="none" stroke="#d97706" stroke-width="10" stroke-linecap="round"/>
        <path d="M 120 95 A 35 35 0 0 1 90 65" fill="none" stroke="#7c3aed" stroke-width="10" stroke-linecap="round"/>
        <circle cx="120" cy="65" r="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="120" y="68" font-size="7.5" font-weight="900" fill="#0f172a" text-anchor="middle">LOOP</text>
        <rect x="25" y="24" width="55" height="18" rx="3" fill="#eff6ff" stroke="#2563eb" stroke-width="1"/>
        <text x="52.5" y="35" font-size="6" font-weight="bold" fill="#1e40af" text-anchor="middle">01 DISCOVER</text>
        <rect x="160" y="24" width="55" height="18" rx="3" fill="#ecfdf5" stroke="#059669" stroke-width="1"/>
        <text x="187.5" y="35" font-size="6" font-weight="bold" fill="#065f46" text-anchor="middle">02 DESIGN</text>
        <rect x="160" y="88" width="55" height="18" rx="3" fill="#fffbeb" stroke="#d97706" stroke-width="1"/>
        <text x="187.5" y="99" font-size="6" font-weight="bold" fill="#92400e" text-anchor="middle">03 BUILD</text>
        <rect x="25" y="88" width="55" height="18" rx="3" fill="#faf5ff" stroke="#7c3aed" stroke-width="1"/>
        <text x="52.5" y="99" font-size="6" font-weight="bold" fill="#6b21a8" text-anchor="middle">04 SCALE</text>
      </svg>
    `;
  } else if (type === 'zigzag-process') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <polyline points="30,85 75,35 120,85 165,35 210,85" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="4,3"/>
        <polygon points="30,73 42,85 30,97 18,85" fill="#2563eb"/>
        <text x="30" y="88" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">1</text>
        <polygon points="75,23 87,35 75,47 63,35" fill="#0891b2"/>
        <text x="75" y="38" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">2</text>
        <polygon points="120,73 132,85 120,97 108,85" fill="#059669"/>
        <text x="120" y="88" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">3</text>
        <polygon points="165,23 177,35 165,47 153,35" fill="#d97706"/>
        <text x="165" y="38" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">4</text>
        <polygon points="210,73 222,85 210,97 198,85" fill="#dc2626"/>
        <text x="210" y="88" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">5</text>
      </svg>
    `;
  } else if (type === 'swot-matrix') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <rect x="35" y="15" width="80" height="45" rx="4" fill="#ecfdf5" stroke="#059669" stroke-width="1.2"/>
        <circle cx="48" cy="27" r="6" fill="#059669"/>
        <text x="48" y="30" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">S</text>
        <text x="58" y="29" font-size="6.5" font-weight="bold" fill="#065f46">STRENGTHS</text>
        <text x="58" y="38" font-size="4.5" fill="#047857">In-Memory Speed</text>

        <rect x="125" y="15" width="80" height="45" rx="4" fill="#fef2f2" stroke="#dc2626" stroke-width="1.2"/>
        <circle cx="138" cy="27" r="6" fill="#dc2626"/>
        <text x="138" y="30" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">W</text>
        <text x="148" y="29" font-size="6.5" font-weight="bold" fill="#991b1b">WEAKNESSES</text>
        <text x="148" y="38" font-size="4.5" fill="#b91c1c">Ecosystem Scope</text>

        <rect x="35" y="68" width="80" height="45" rx="4" fill="#eff6ff" stroke="#2563eb" stroke-width="1.2"/>
        <circle cx="48" cy="80" r="6" fill="#2563eb"/>
        <text x="48" y="83" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">O</text>
        <text x="58" y="82" font-size="6.5" font-weight="bold" fill="#1e40af">OPPORTUNITIES</text>
        <text x="58" y="91" font-size="4.5" fill="#1d4ed8">Sovereign Cloud</text>

        <rect x="125" y="68" width="80" height="45" rx="4" fill="#fffbeb" stroke="#d97706" stroke-width="1.2"/>
        <circle cx="138" cy="80" r="6" fill="#d97706"/>
        <text x="138" y="83" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">T</text>
        <text x="148" y="82" font-size="6.5" font-weight="bold" fill="#92400e">THREATS</text>
        <text x="148" y="91" font-size="4.5" fill="#b45309">Legacy Bundles</text>
      </svg>
    `;
  } else if (type === 'funnel-stages') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <polygon points="40,20 200,20 180,40 60,40" fill="#2563eb"/>
        <text x="120" y="32" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">AWARENESS (100%)</text>
        <polygon points="62,43 178,43 158,65 82,65" fill="#0891b2"/>
        <text x="120" y="56" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">INTEREST (45%)</text>
        <polygon points="84,68 156,68 140,90 100,90" fill="#059669"/>
        <text x="120" y="81" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">DECISION (18%)</text>
        <polygon points="102,93 138,93 126,115 114,115" fill="#dc2626"/>
        <text x="120" y="106" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">ACTION (7.5%)</text>
      </svg>
    `;
  } else if (type === 'hexagon-cluster') {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <polygon points="75,25 95,15 115,25 115,45 95,55 75,45" fill="#2563eb"/>
        <text x="95" y="38" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">01</text>
        <polygon points="120,25 140,15 160,25 160,45 140,55 120,45" fill="#0891b2"/>
        <text x="140" y="38" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">02</text>
        <polygon points="52.5,60 72.5,50 92.5,60 92.5,80 72.5,90 52.5,80" fill="#059669"/>
        <text x="72.5" y="73" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">03</text>
        <polygon points="97.5,60 117.5,50 137.5,60 137.5,80 117.5,90 97.5,80" fill="#d97706"/>
        <text x="117.5" y="73" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">04</text>
        <polygon points="142.5,60 162.5,50 182.5,60 182.5,80 162.5,90 142.5,80" fill="#7c3aed"/>
        <text x="162.5" y="73" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">05</text>
        <polygon points="75,95 95,85 115,95 115,115 95,125 75,115" fill="#dc2626"/>
        <text x="95" y="108" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">06</text>
      </svg>
    `;
  } else if (type === 'pyramid-hierarchy' || type === 'pyramid-levels' || type === 'pyramid-funnel' || type.includes('pyramid')) {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Level 1 (Top Triangle) -->
        <polygon points="120,18 102,40 138,40" fill="#dc2626"/>
        <text x="120" y="32" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">01</text>
        <!-- Level 2 (Trapezoid) -->
        <polygon points="100,43 82,65 158,65 140,43" fill="#d97706"/>
        <text x="120" y="57" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">02 STRATEGY</text>
        <!-- Level 3 (Trapezoid) -->
        <polygon points="80,68 62,90 178,90 160,68" fill="#0891b2"/>
        <text x="120" y="82" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">03 TACTICAL PROCESS</text>
        <!-- Level 4 (Base Trapezoid) -->
        <polygon points="60,93 42,115 198,115 180,93" fill="#2563eb"/>
        <text x="120" y="107" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">04 INFRASTRUCTURE BASE</text>
      </svg>
    `;
  } else if (type === 'radial-cycle' || type === 'radial-spokes' || type === 'cycle-flow' || type.includes('radial')) {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Central Hub -->
        <circle cx="120" cy="65" r="20" fill="#0f172a" stroke="#2563eb" stroke-width="2.5"/>
        <text x="120" y="63" font-size="6" font-weight="bold" fill="#94a3b8" text-anchor="middle">CORE</text>
        <text x="120" y="71" font-size="7" font-weight="bold" fill="#38bdf8" text-anchor="middle">SYSTEM</text>
        <!-- Connectors -->
        <line x1="120" y1="45" x2="120" y2="28" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="138" y1="55" x2="170" y2="40" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="138" y1="75" x2="170" y2="90" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="120" y1="85" x2="120" y2="102" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="102" y1="75" x2="70" y2="90" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2,2"/>
        <line x1="102" y1="55" x2="70" y2="40" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2,2"/>
        <!-- Satellites -->
        <circle cx="120" cy="20" r="10" fill="#2563eb"/>
        <text x="120" y="23.5" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">01</text>
        <circle cx="178" cy="35" r="10" fill="#0891b2"/>
        <text x="178" y="38.5" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">02</text>
        <circle cx="178" cy="95" r="10" fill="#059669"/>
        <text x="178" y="98.5" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">03</text>
        <circle cx="120" cy="110" r="10" fill="#d97706"/>
        <text x="120" y="113.5" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">04</text>
        <circle cx="62" cy="95" r="10" fill="#dc2626"/>
        <text x="62" y="98.5" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">05</text>
        <circle cx="62" cy="35" r="10" fill="#7c3aed"/>
        <text x="62" y="38.5" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">06</text>
      </svg>
    `;
  } else if (type === 'venn-diagram' || type === 'venn-overlap' || type.includes('venn')) {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <circle cx="100" cy="55" r="38" fill="#2563eb" fill-opacity="0.35" stroke="#2563eb" stroke-width="2"/>
        <text x="78" y="45" font-size="8" font-weight="bold" fill="#1e40af" text-anchor="middle">INNOVATION</text>
        <circle cx="140" cy="55" r="38" fill="#0891b2" fill-opacity="0.35" stroke="#0891b2" stroke-width="2"/>
        <text x="162" y="45" font-size="8" font-weight="bold" fill="#0e7490" text-anchor="middle">SCALABILITY</text>
        <circle cx="120" cy="85" r="38" fill="#059669" fill-opacity="0.35" stroke="#059669" stroke-width="2"/>
        <text x="120" y="112" font-size="8" font-weight="bold" fill="#065f46" text-anchor="middle">SECURITY</text>
        <circle cx="120" cy="65" r="9" fill="#1e293b"/>
        <text x="120" y="68" font-size="5" font-weight="bold" fill="#fff" text-anchor="middle">CORE</text>
      </svg>
    `;
  } else if (type === 'comparison-table' || type === 'pricing-table' || type === 'matrix-grid' || type.includes('table') || type.includes('pricing')) {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Col 1 -->
        <rect x="22" y="20" width="58" height="88" rx="4" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
        <rect x="22" y="20" width="58" height="20" rx="4" fill="#64748b"/>
        <text x="51" y="33" font-size="6.5" font-weight="bold" fill="#fff" text-anchor="middle">STARTER</text>
        <text x="51" y="55" font-size="11" font-weight="900" fill="#1e293b" text-anchor="middle">$0</text>
        <line x1="30" y1="65" x2="72" y2="65" stroke="#cbd5e1" stroke-width="1"/>
        <text x="51" y="76" font-size="5" fill="#64748b" text-anchor="middle">✓ Core Tools</text>
        <text x="51" y="86" font-size="5" fill="#64748b" text-anchor="middle">✓ In-Memory</text>
        <rect x="32" y="94" width="38" height="10" rx="2" fill="#cbd5e1"/>
        <text x="51" y="101" font-size="5" font-weight="bold" fill="#475569" text-anchor="middle">FREE</text>

        <!-- Col 2 (Featured) -->
        <rect x="88" y="15" width="64" height="98" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8" filter="drop-shadow(0 3px 6px rgba(37,99,235,0.15))"/>
        <rect x="88" y="15" width="64" height="22" rx="4" fill="#2563eb"/>
        <text x="120" y="29" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">PRO SUITE</text>
        <text x="120" y="53" font-size="13" font-weight="900" fill="#1e40af" text-anchor="middle">$29</text>
        <line x1="98" y1="64" x2="142" y2="64" stroke="#bfdbfe" stroke-width="1"/>
        <text x="120" y="75" font-size="5.5" font-weight="bold" fill="#1e40af" text-anchor="middle">✓ 3,500+ Templates</text>
        <text x="120" y="85" font-size="5.5" font-weight="bold" fill="#1e40af" text-anchor="middle">✓ Universal Export</text>
        <rect x="98" y="95" width="44" height="12" rx="3" fill="#2563eb"/>
        <text x="120" y="103" font-size="5.5" font-weight="bold" fill="#fff" text-anchor="middle">POPULAR</text>

        <!-- Col 3 -->
        <rect x="160" y="20" width="58" height="88" rx="4" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
        <rect x="160" y="20" width="58" height="20" rx="4" fill="#0f172a"/>
        <text x="189" y="33" font-size="6.5" font-weight="bold" fill="#fff" text-anchor="middle">ENTERPRISE</text>
        <text x="189" y="55" font-size="11" font-weight="900" fill="#1e293b" text-anchor="middle">$89</text>
        <line x1="168" y1="65" x2="210" y2="65" stroke="#cbd5e1" stroke-width="1"/>
        <text x="189" y="76" font-size="5" fill="#64748b" text-anchor="middle">✓ Air-Gapped Mode</text>
        <text x="189" y="86" font-size="5" fill="#64748b" text-anchor="middle">✓ PKI Digital Seals</text>
        <rect x="170" y="94" width="38" height="10" rx="2" fill="#0f172a"/>
        <text x="189" y="101" font-size="5" font-weight="bold" fill="#fff" text-anchor="middle">SCALE</text>
      </svg>
    `;
  } else if (type === 'horizontal-timeline' || type === 'linear-timeline' || type === 'milestone-timeline' || type.includes('timeline')) {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <!-- Connecting line -->
        <line x1="30" y1="65" x2="210" y2="65" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
        <!-- Step 1 (Above) -->
        <rect x="20" y="20" width="42" height="28" rx="3" fill="#ffffff" stroke="#2563eb" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
        <text x="41" y="32" font-size="6" font-weight="bold" fill="#2563eb" text-anchor="middle">PHASE 1</text>
        <text x="41" y="41" font-size="5" fill="#64748b" text-anchor="middle">Research</text>
        <line x1="41" y1="48" x2="41" y2="65" stroke="#2563eb" stroke-width="1.5"/>
        <circle cx="41" cy="65" r="7" fill="#2563eb" stroke="#fff" stroke-width="2"/>
        <text x="41" y="68" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">1</text>

        <!-- Step 2 (Below) -->
        <circle cx="92" cy="65" r="7" fill="#0891b2" stroke="#fff" stroke-width="2"/>
        <text x="92" y="68" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">2</text>
        <line x1="92" y1="65" x2="92" y2="82" stroke="#0891b2" stroke-width="1.5"/>
        <rect x="71" y="82" width="42" height="28" rx="3" fill="#ffffff" stroke="#0891b2" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
        <text x="92" y="94" font-size="6" font-weight="bold" fill="#0891b2" text-anchor="middle">PHASE 2</text>
        <text x="92" y="103" font-size="5" fill="#64748b" text-anchor="middle">Prototype</text>

        <!-- Step 3 (Above) -->
        <rect x="127" y="20" width="42" height="28" rx="3" fill="#ffffff" stroke="#059669" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
        <text x="148" y="32" font-size="6" font-weight="bold" fill="#059669" text-anchor="middle">PHASE 3</text>
        <text x="148" y="41" font-size="5" fill="#64748b" text-anchor="middle">Testing</text>
        <line x1="148" y1="48" x2="148" y2="65" stroke="#059669" stroke-width="1.5"/>
        <circle cx="148" cy="65" r="7" fill="#059669" stroke="#fff" stroke-width="2"/>
        <text x="148" y="68" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">3</text>

        <!-- Step 4 (Below) -->
        <circle cx="199" cy="65" r="7" fill="#ea580c" stroke="#fff" stroke-width="2"/>
        <text x="199" y="68" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">4</text>
        <line x1="199" y1="65" x2="199" y2="82" stroke="#ea580c" stroke-width="1.5"/>
        <rect x="178" y="82" width="42" height="28" rx="3" fill="#ffffff" stroke="#ea580c" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
        <text x="199" y="94" font-size="6" font-weight="bold" fill="#ea580c" text-anchor="middle">PHASE 4</text>
        <text x="199" y="103" font-size="5" fill="#64748b" text-anchor="middle">Release</text>
      </svg>
    `;
  } else if (type === 'chevron-flow' || type === 'chevron-process' || type === 'process-arrow' || type.includes('chevron')) {
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <polygon points="18,35 60,35 75,65 60,95 18,95" fill="#2563eb"/>
        <text x="42" y="58" font-size="10" font-weight="900" fill="#fff" text-anchor="middle">01</text>
        <text x="42" y="73" font-size="5" font-weight="bold" fill="#bfdbfe" text-anchor="middle">PLAN</text>

        <polygon points="65,35 110,35 125,65 110,95 65,95 80,65" fill="#0891b2"/>
        <text x="95" y="58" font-size="10" font-weight="900" fill="#fff" text-anchor="middle">02</text>
        <text x="95" y="73" font-size="5" font-weight="bold" fill="#cffafe" text-anchor="middle">BUILD</text>

        <polygon points="115,35 160,35 175,65 160,95 115,95 130,65" fill="#059669"/>
        <text x="145" y="58" font-size="10" font-weight="900" fill="#fff" text-anchor="middle">03</text>
        <text x="145" y="73" font-size="5" font-weight="bold" fill="#d1fae5" text-anchor="middle">TEST</text>

        <polygon points="165,35 210,35 225,65 210,95 165,95 180,65" fill="#d97706"/>
        <text x="195" y="58" font-size="10" font-weight="900" fill="#fff" text-anchor="middle">04</text>
        <text x="195" y="73" font-size="5" font-weight="bold" fill="#fef3c7" text-anchor="middle">SCALE</text>
      </svg>
    `;
  } else {
    // Default Clean Diagram Canvas
    diagramSvg = `
      <svg viewBox="0 0 240 130" style="width:100%; height:100%;">
        <rect x="25" y="25" width="55" height="70" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
        <circle cx="52.5" cy="45" r="12" fill="${accent}"/>
        <text x="52.5" y="48.5" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">01</text>
        <rect x="35" y="65" width="35" height="3" rx="1.5" fill="#94a3b8"/>
        
        <rect x="92.5" y="25" width="55" height="70" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
        <circle cx="120" cy="45" r="12" fill="#0891b2"/>
        <text x="120" y="48.5" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">02</text>
        <rect x="102.5" y="65" width="35" height="3" rx="1.5" fill="#94a3b8"/>

        <rect x="160" y="25" width="55" height="70" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
        <circle cx="187.5" cy="45" r="12" fill="#059669"/>
        <text x="187.5" y="48.5" font-size="9" font-weight="bold" fill="#fff" text-anchor="middle">03</text>
        <rect x="170" y="65" width="35" height="3" rx="1.5" fill="#94a3b8"/>
      </svg>
    `;
  }

  return `
    <div class="pgo-diagram-canvas">
      ${diagramSvg}
      <div class="pgo-watermark-line">
        <a href="https://www.presentationgo.com/" target="_blank" rel="noopener noreferrer" title="PresentationGO (www.presentationgo.com)" onclick="event.stopPropagation();">www.presentationgo.com</a>
      </div>
      ${tpl.optionsText ? `<div class="pgo-slides-count-pill" style="bottom:6px; right:8px; font-size:9.5px; padding:2px 7px;">${tpl.optionsText}</div>` : ''}
    </div>
  `;
}

/**
 * Rich Diagram Canvas Renderer for PresentationGO & PowerPoint Slides
 */
function renderSlideDiagram(container, slide, saveCallback, isReadOnly = false) {
  const layout = slide.layout || slide.diagramType || 'title';
  const features = slide.features || [];
  const editableAttr = isReadOnly ? '' : 'contenteditable="true" spellcheck="false"';

  if (layout === 'circular-loop') {
    const f1 = features[0] || { num: 'Phase 1', title: 'Assess & Discover', desc: 'Synthesize operational telemetry.' };
    const f2 = features[1] || { num: 'Phase 2', title: 'Architect & Build', desc: 'Rapid prototype iteration.' };
    const f3 = features[2] || { num: 'Phase 3', title: 'Verify & Deploy', desc: 'Zero-downtime release.' };
    const f4 = features[3] || { num: 'Phase 4', title: 'Refine & Scale', desc: 'Incorporate user telemetry.' };

    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-circular-layout">
        <div class="pgo-loop-node-card" style="border-left: 4px solid #2563eb;" data-fidx="0">
          <span class="pgo-node-badge" style="background:#2563eb;">${f1.num}</span>
          <div class="pgo-node-title" ${editableAttr}>${f1.title}</div>
          <div class="pgo-node-desc" ${editableAttr}>${f1.desc}</div>
        </div>

        <div class="pgo-circular-center-hub">
          <svg viewBox="0 0 160 160">
            <defs>
              <linearGradient id="pgo-c1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>
              <linearGradient id="pgo-c2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#34d399"/></linearGradient>
              <linearGradient id="pgo-c3" x1="100%" y1="100%" x2="0%" y2="100%"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient>
              <linearGradient id="pgo-c4" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient>
            </defs>
            <path d="M 45 80 A 35 35 0 0 1 80 45" fill="none" stroke="url(#pgo-c1)" stroke-width="12" stroke-linecap="round"/>
            <path d="M 80 45 A 35 35 0 0 1 115 80" fill="none" stroke="url(#pgo-c2)" stroke-width="12" stroke-linecap="round"/>
            <path d="M 115 80 A 35 35 0 0 1 80 115" fill="none" stroke="url(#pgo-c3)" stroke-width="12" stroke-linecap="round"/>
            <path d="M 80 115 A 35 35 0 0 1 45 80" fill="none" stroke="url(#pgo-c4)" stroke-width="12" stroke-linecap="round"/>
            <circle cx="80" cy="80" r="22" fill="#0f172a" stroke="#334155" stroke-width="2"/>
            <text x="80" y="78" font-size="9" font-weight="900" fill="#38bdf8" text-anchor="middle" dominant-baseline="middle">4-STEP</text>
            <text x="80" y="88" font-size="7" font-weight="700" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle">LOOP</text>
          </svg>
        </div>

        <div class="pgo-loop-node-card" style="border-left: 4px solid #059669;" data-fidx="1">
          <span class="pgo-node-badge" style="background:#059669;">${f2.num}</span>
          <div class="pgo-node-title" ${editableAttr}>${f2.title}</div>
          <div class="pgo-node-desc" ${editableAttr}>${f2.desc}</div>
        </div>

        <div class="pgo-loop-node-card" style="border-left: 4px solid #7c3aed;" data-fidx="3">
          <span class="pgo-node-badge" style="background:#7c3aed;">${f4.num}</span>
          <div class="pgo-node-title" ${editableAttr}>${f4.title}</div>
          <div class="pgo-node-desc" ${editableAttr}>${f4.desc}</div>
        </div>

        <div class="pgo-loop-node-card" style="border-left: 4px solid #d97706;" data-fidx="2">
          <span class="pgo-node-badge" style="background:#d97706;">${f3.num}</span>
          <div class="pgo-node-title" ${editableAttr}>${f3.title}</div>
          <div class="pgo-node-desc" ${editableAttr}>${f3.desc}</div>
        </div>
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'zigzag-process') {
    const colors = ['#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626'];
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-zigzag-layout">
        <svg class="pgo-zigzag-track" viewBox="0 0 500 50">
          <polyline points="50,40 150,10 250,40 350,10 450,40" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4"/>
        </svg>
        <div class="pgo-zigzag-steps-grid">
          ${(features.slice(0, 5)).map((f, idx) => `
            <div class="pgo-zigzag-card" style="border-top: 3px solid ${colors[idx % colors.length]};" data-fidx="${idx}">
              <div class="pgo-diamond-num" style="background:${colors[idx % colors.length]};">
                <span>${f.num || idx + 1}</span>
              </div>
              <div class="pgo-node-title" style="text-align:center;" ${editableAttr}>${f.title}</div>
              <div class="pgo-node-desc" style="text-align:center;" ${editableAttr}>${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'chevron-flow') {
    const colors = ['#2563eb', '#0891b2', '#059669', '#d97706'];
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-chevron-strip">
        ${(features.slice(0, 4)).map((f, idx) => `
          <div class="pgo-chevron-card" style="border-left-color:${colors[idx % colors.length]};" data-fidx="${idx}">
            <span class="pgo-node-badge" style="background:${colors[idx % colors.length]};">${f.num || 'Stage ' + (idx + 1)}</span>
            <div class="pgo-node-title" ${editableAttr}>${f.title}</div>
            <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'swot-matrix') {
    const s = features[0] || { num: 'S', title: 'Strengths', desc: 'Proprietary in-memory zero-database runtime.' };
    const w = features[1] || { num: 'W', title: 'Weaknesses', desc: 'Legacy workflow integration dependencies.' };
    const o = features[2] || { num: 'O', title: 'Opportunities', desc: 'Global regulatory mandates demanding air-gapped sovereign data.' };
    const t = features[3] || { num: 'T', title: 'Threats', desc: 'Aggressive pricing bundling from established legacy enterprise suites.' };

    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-swot-grid">
        <div class="pgo-swot-center-badge">SWOT ANALYSIS</div>
        <div class="pgo-swot-quadrant pgo-swot-s" data-fidx="0">
          <span class="pgo-swot-watermark">S</span>
          <div class="pgo-swot-header">
            <span class="pgo-swot-badge" style="background:#059669;">S</span>
            <strong style="color:#065f46; font-size:12px;" ${editableAttr}>${s.title}</strong>
          </div>
          <div class="pgo-node-desc" style="color:#047857;" ${editableAttr}>${s.desc}</div>
        </div>
        <div class="pgo-swot-quadrant pgo-swot-w" data-fidx="1">
          <span class="pgo-swot-watermark">W</span>
          <div class="pgo-swot-header">
            <span class="pgo-swot-badge" style="background:#dc2626;">W</span>
            <strong style="color:#991b1b; font-size:12px;" ${editableAttr}>${w.title}</strong>
          </div>
          <div class="pgo-node-desc" style="color:#b91c1c;" ${editableAttr}>${w.desc}</div>
        </div>
        <div class="pgo-swot-quadrant pgo-swot-o" data-fidx="2">
          <span class="pgo-swot-watermark">O</span>
          <div class="pgo-swot-header">
            <span class="pgo-swot-badge" style="background:#2563eb;">O</span>
            <strong style="color:#1e40af; font-size:12px;" ${editableAttr}>${o.title}</strong>
          </div>
          <div class="pgo-node-desc" style="color:#1d4ed8;" ${editableAttr}>${o.desc}</div>
        </div>
        <div class="pgo-swot-quadrant pgo-swot-t" data-fidx="3">
          <span class="pgo-swot-watermark">T</span>
          <div class="pgo-swot-header">
            <span class="pgo-swot-badge" style="background:#d97706;">T</span>
            <strong style="color:#92400e; font-size:12px;" ${editableAttr}>${t.title}</strong>
          </div>
          <div class="pgo-node-desc" style="color:#b45309;" ${editableAttr}>${t.desc}</div>
        </div>
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'milestone-journey' || layout === 'horizontal-timeline' || layout === 'milestone-road') {
    const colors = ['#2563eb', '#059669', '#d97706', '#dc2626'];
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-milestone-road-wrap">
        <svg viewBox="0 0 500 70" style="width:100%; height:70px;">
          <path d="M 20 50 Q 150 70, 250 40 T 480 20" fill="none" stroke="#cbd5e1" stroke-width="24" stroke-linecap="round"/>
          <path d="M 20 50 Q 150 70, 250 40 T 480 20" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="6,6"/>
          <circle cx="70" cy="53" r="8" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
          <circle cx="190" cy="50" r="8" fill="#059669" stroke="#ffffff" stroke-width="2"/>
          <circle cx="330" cy="30" r="8" fill="#d97706" stroke="#ffffff" stroke-width="2"/>
          <circle cx="440" cy="20" r="8" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
        </svg>
        <div class="pgo-milestone-cards-strip">
          ${(features.slice(0, 4)).map((f, idx) => `
            <div class="pgo-milestone-card" style="border-top: 3px solid ${colors[idx % colors.length]};" data-fidx="${idx}">
              <div class="pgo-milestone-flag" style="color:${colors[idx % colors.length]};">
                <span>🚩</span>
                <span>${f.num || 'Q' + (idx + 1)}</span>
              </div>
              <div class="pgo-node-title" ${editableAttr}>${f.title}</div>
              <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'pentagon-flags') {
    const flagColors = ['#7c3aed', '#0891b2', '#ea580c', '#059669'];
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-flags-layout">
        ${(features.slice(0, 4)).map((f, idx) => `
          <div class="pgo-flag-card" data-fidx="${idx}">
            <div class="pgo-flag-header" style="background:${flagColors[idx % flagColors.length]};">
              <div class="pgo-flag-circle" style="color:${flagColors[idx % flagColors.length]};">
                <span>${f.num || (idx + 1)}</span>
              </div>
              <div class="pgo-node-title" style="color:#ffffff; font-size:13px;" ${editableAttr}>${f.title}</div>
            </div>
            <div class="pgo-flag-body">
              <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'speech-bubbles') {
    const bubbleAccents = ['#ca8a04', '#16a34a', '#0284c7', '#7c3aed'];
    const bubbleBgs = ['#fefce8', '#f0fdf4', '#f0f9ff', '#faf5ff'];
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-bubbles-layout">
        ${(features.slice(0, 3)).map((f, idx) => `
          <div class="pgo-bubble-card" data-fidx="${idx}">
            <div class="pgo-bubble-bubble" style="background:${bubbleBgs[idx % bubbleBgs.length]}; border-color:${bubbleAccents[idx % bubbleAccents.length]};">
              <div class="pgo-bubble-quote" style="color:${bubbleAccents[idx % bubbleAccents.length]};">“</div>
              <div class="pgo-node-title" style="font-size:12px; margin-bottom:4px;" ${editableAttr}>${f.title}</div>
              <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
            </div>
            <div class="pgo-bubble-author-row">
              <div class="pgo-bubble-avatar" style="background:${bubbleAccents[idx % bubbleAccents.length]};">
                <span>${f.num || '0' + (idx + 1)}</span>
              </div>
              <div>
                <strong style="font-size:11px; color:#0f172a; display:block;">Option ${f.num || (idx + 1)}</strong>
                <span style="font-size:9.5px; color:#64748b;">Executive Testimonial Quote</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'gears-process') {
    const gearColors = ['#0891b2', '#2563eb', '#059669', '#d97706'];
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-gears-layout">
        ${(features.slice(0, 3)).map((f, idx) => `
          <div class="pgo-gear-card" style="border-top:3px solid ${gearColors[idx % gearColors.length]};" data-fidx="${idx}">
            <div class="pgo-gear-svg-wrap">
              <svg viewBox="0 0 60 60" style="width:100%; height:100%;">
                <circle cx="30" cy="30" r="26" fill="${gearColors[idx % gearColors.length]}" opacity="0.15"/>
                <circle cx="30" cy="30" r="22" fill="${gearColors[idx % gearColors.length]}"/>
                <circle cx="30" cy="30" r="10" fill="#ffffff"/>
                <text x="30" y="34" font-size="11" font-weight="900" fill="${gearColors[idx % gearColors.length]}" text-anchor="middle">${f.num || (idx + 1)}</text>
              </svg>
            </div>
            <div class="pgo-node-title" style="font-size:13px;" ${editableAttr}>${f.title}</div>
            <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'hexagon-matrix' || layout === 'hexagon-cluster') {
    const hexColors = ['#2563eb', '#0891b2', '#059669', '#d97706', '#7c3aed', '#dc2626'];
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-honeycomb-layout">
        ${(features.slice(0, 6)).map((f, idx) => `
          <div class="pgo-honeycomb-cell" style="border-left: 4px solid ${hexColors[idx % hexColors.length]};" data-fidx="${idx}">
            <span class="pgo-node-badge" style="background:${hexColors[idx % hexColors.length]};">${f.num || '0' + (idx + 1)}</span>
            <div class="pgo-node-title" ${editableAttr}>${f.title}</div>
            <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'pyramid-hierarchy') {
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-pyramid-layout">
        <div class="pgo-pyramid-graphic">
          <svg viewBox="0 0 200 180" style="width:100%; max-width:200px;">
            <polygon points="100,10 86,38 114,38" fill="#7c3aed"/>
            <polygon points="85,42 115,42 128,72 72,72" fill="#2563eb"/>
            <polygon points="71,76 129,76 142,106 58,106" fill="#0891b2"/>
            <polygon points="57,110 143,110 156,140 44,140" fill="#059669"/>
            <polygon points="43,144 157,144 170,174 30,174" fill="#d97706"/>
          </svg>
        </div>
        <div class="pgo-pyramid-tiers-col">
          ${(features.slice(0, 5)).map((f, idx) => `
            <div class="pgo-pyramid-tier-row" data-fidx="${idx}">
              <span class="pgo-node-badge" style="background:#475569;">${f.num || 'L' + (5 - idx)}</span>
              <div style="flex:1;">
                <div class="pgo-node-title" ${editableAttr}>${f.title}</div>
                <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'funnel-stages') {
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-funnel-layout">
        <svg viewBox="0 0 160 160" style="width:100%; max-width:160px;">
          <polygon points="10,10 150,10 135,42 25,42" fill="#2563eb"/>
          <polygon points="26,46 134,46 119,80 41,80" fill="#0891b2"/>
          <polygon points="42,84 118,84 104,118 56,118" fill="#059669"/>
          <polygon points="57,122 103,122 92,154 68,154" fill="#dc2626"/>
        </svg>
        <div class="pgo-funnel-stages-col">
          ${(features.slice(0, 4)).map((f, idx) => `
            <div class="pgo-funnel-stage-row" data-fidx="${idx}">
              <span class="pgo-node-badge" style="background:#2563eb;">${f.num || 'Stage ' + (idx + 1)}</span>
              <div style="flex:1;">
                <div class="pgo-node-title" ${editableAttr}>${f.title}</div>
                <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'radial-cycle') {
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-radial-layout">
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${(features.slice(1, 4)).map((f, idx) => `
            <div class="pgo-loop-node-card" style="border-right:3px solid #0891b2;" data-fidx="${idx + 1}">
              <span class="pgo-node-badge" style="background:#0891b2;">${f.num || '0' + (idx + 1)}</span>
              <div class="pgo-node-title" ${editableAttr}>${f.title}</div>
              <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
            </div>
          `).join('')}
        </div>
        <div class="pgo-radial-center">
          <strong style="font-size:11px; text-transform:uppercase;">${features[0]?.title || 'CORE HUB'}</strong>
          <span style="font-size:9px; opacity:0.85;">SOVEREIGN</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${(features.slice(4, 7)).map((f, idx) => `
            <div class="pgo-loop-node-card" style="border-left:3px solid #0284c7;" data-fidx="${idx + 4}">
              <span class="pgo-node-badge" style="background:#0284c7;">${f.num || '0' + (idx + 4)}</span>
              <div class="pgo-node-title" ${editableAttr}>${f.title}</div>
              <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  if (layout === 'comparison-table') {
    container.className = 'pgo-diagram-wrap';
    container.innerHTML = `
      <div class="pgo-pricing-layout">
        ${(features.slice(0, 3)).map((f, idx) => `
          <div class="pgo-pricing-col ${idx === 1 ? 'popular' : ''}" data-fidx="${idx}">
            ${idx === 1 ? '<span class="pgo-pricing-tag">MOST POPULAR</span>' : ''}
            <div class="pgo-node-title" style="font-size:14px; font-weight:800; color:#0f172a;" ${editableAttr}>${f.title}</div>
            <div style="font-size:22px; font-weight:900; color:${idx === 1 ? '#2563eb' : '#0f172a'}; margin:4px 0;">${f.num || '$29'}</div>
            <div class="pgo-node-desc" ${editableAttr}>${f.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    wireDiagramInputListeners(container, slide, saveCallback);
    return;
  }

  // Default Standard Cards Grid (columns, metrics, title)
  const theme = resolveSlideTheme(slide);
  container.className = 'slide-cards-grid';
  container.style.gridTemplateColumns = `repeat(${Math.min(features.length || 3, 3)}, 1fr)`;
  container.innerHTML = (features || []).map((f, idx) => `
    <div class="slide-feature-card" style="background:${theme.cardBg}; border:1px solid ${theme.accentBorder};" data-fidx="${idx}">
      <div class="feature-num" style="color:${theme.accent};" ${editableAttr}>${f.num || '0' + (idx + 1)}</div>
      <div class="feature-title" style="color:#ffffff;" ${editableAttr}>${f.title || ''}</div>
      <div class="feature-desc" style="color:#cbd5e1;" ${editableAttr}>${f.desc || ''}</div>
    </div>
  `).join('');
  wireDiagramInputListeners(container, slide, saveCallback);
}

function wireDiagramInputListeners(container, slide, saveCallback) {
  if (!saveCallback) return;
  container.querySelectorAll('[data-fidx]').forEach(card => {
    const fidx = parseInt(card.dataset.fidx, 10);
    card.addEventListener('input', () => {
      const num = card.querySelector('.feature-num, .pgo-node-badge, .pgo-diamond-num span, .pgo-milestone-flag span:last-child')?.innerText || slide.features[fidx]?.num || '';
      const title = card.querySelector('.feature-title, .pgo-node-title, .pgo-swot-header strong')?.innerText || slide.features[fidx]?.title || '';
      const desc = card.querySelector('.feature-desc, .pgo-node-desc')?.innerText || slide.features[fidx]?.desc || '';
      if (slide.features[fidx]) {
        slide.features[fidx] = { num, title, desc };
      }
      saveCallback();
    });
  });
}

export function renderKineticApp(container, onDeckUpdate = null, startInEditor = false) {
  let customTemplates = [];
  try {
    const stored = localStorage.getItem('giri_orbit_kinetic_custom_templates');
    if (stored) customTemplates = JSON.parse(stored);
  } catch {}

  if (startInEditor) {
    mountKineticEditor(container, null, onDeckUpdate);
  } else {
    mountKineticHub(container, onDeckUpdate);
  }

  function mountKineticHub(rootEl, onUpdate) {
    rootEl.innerHTML = `
      <div class="kinetic-hub-shell" id="kinetic-hub-shell">
        <div class="tool-hub-top-bar">
          <div class="tool-hub-brand-left">
            <div class="tool-app-icon-badge red">K</div>
            <div class="tool-hub-brand-dropdown-wrap" id="kinetic-brand-dropdown-wrap">
              <button class="tool-hub-brand-btn" id="kinetic-brand-dropdown-trigger" style="display:flex; align-items:center; gap:6px; background:transparent; border:none; cursor:pointer; padding:4px 6px; border-radius:4px;" title="Switch Suite Tool">
                <span style="color:#ffffff; font-family:var(--font-display, sans-serif); font-weight:700; font-size:14px;">Giri Kinetic</span>
                <span style="color:#94a3b8; font-size:11px;">▾</span>
              </button>
              <!-- Suite Switcher Dropdown Menu -->
              <div class="tool-suite-switcher-menu" id="kinetic-suite-menu" style="display:none;">
                <div class="suite-switcher-header">Giri Orbit Suite</div>
                <a href="#hub" class="suite-switcher-item" data-switch="launcher">
                  <div class="switcher-icon hub">🪐</div>
                  <div class="switcher-info">
                    <strong>Orbit Hub</strong>
                    <span>Workspace Launcher &amp; Overview</span>
                  </div>
                  <span class="switcher-link-tag">#hub</span>
                </a>
                <a href="#drift" class="suite-switcher-item" data-switch="drift">
                  <div class="switcher-icon drift">D</div>
                  <div class="switcher-info">
                    <strong>Giri Drift</strong>
                    <span>Word Processor &amp; Document Composer</span>
                  </div>
                  <span class="switcher-link-tag">#drift</span>
                </a>
                <a href="#axis" class="suite-switcher-item" data-switch="axis">
                  <div class="switcher-icon axis">A</div>
                  <div class="switcher-info">
                    <strong>Giri Axis</strong>
                    <span>Data Matrix &amp; Financial Sheets</span>
                  </div>
                  <span class="switcher-link-tag">#axis</span>
                </a>
                <a href="#kinetic" class="suite-switcher-item active" data-switch="kinetic">
                  <div class="switcher-icon kinetic">K</div>
                  <div class="switcher-info">
                    <strong>Giri Kinetic</strong>
                    <span>Cinematic Presentation Studio</span>
                  </div>
                  <span class="switcher-link-tag">#kinetic</span>
                </a>
                <a href="#pdf" class="suite-switcher-item" data-switch="pdf">
                  <div class="switcher-icon pdf">Æ</div>
                  <div class="switcher-info">
                    <strong>Giri Aegis PDF</strong>
                    <span>Cryptographic PDF &amp; Document Security</span>
                  </div>
                  <span class="switcher-link-tag">#pdf</span>
                </a>
              </div>
            </div>
            <nav class="tool-hub-nav-links">
              <span class="tool-hub-nav-link" id="btn-kinetic-nav-blank">Create Blank</span>
              <span class="tool-hub-nav-link" id="btn-kinetic-nav-templates">Templates</span>
              <span class="tool-hub-nav-link" id="btn-kinetic-nav-custom">Custom Templates</span>
            </nav>
          </div>

          <!-- Suite Nav Links & Direct Link Copier on Right -->
          <div class="tool-hub-top-right">
            <div class="tool-hub-suite-links">
              <a href="#hub" class="tool-hub-suite-link" data-switch="launcher" title="Orbit Hub (http://127.0.0.1:5000/#hub)">Hub</a>
              <a href="#drift" class="tool-hub-suite-link" data-switch="drift" title="Giri Drift Docs (http://127.0.0.1:5000/#drift)">Drift</a>
              <a href="#axis" class="tool-hub-suite-link" data-switch="axis" title="Giri Axis Sheets (http://127.0.0.1:5000/#axis)">Axis</a>
              <a href="#kinetic" class="tool-hub-suite-link active" data-switch="kinetic" title="Giri Kinetic Presentation (http://127.0.0.1:5000/#kinetic)">Kinetic</a>
              <a href="#pdf" class="tool-hub-suite-link" data-switch="pdf" title="Giri Aegis PDF Studio (http://127.0.0.1:5000/#pdf)">Aegis PDF</a>
            </div>
            <button class="btn-tool-copy-link" id="btn-kinetic-share-link" title="Copy direct link to Giri Kinetic (http://127.0.0.1:5000/#kinetic)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <section class="tool-hub-hero">
          <div class="tool-hero-left">
            <h1 class="tool-hero-title">Welcome to Kinetic for free on the web</h1>
            <p class="tool-hero-subtitle">
              Sovereign in-memory presentation show & widescreen stage. Zero database tracking, 16:9 vector layouts, and customizable presentations.
            </p>

            <div class="follow-journey-wrap" style="margin-bottom:18px; display:flex; flex-direction:row; flex-wrap:wrap; gap:14px; align-items:center;">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="follow-journey-label">OFFICIAL PORTAL</span>
                <a href="https://github.com/abhinavgiri45/giri-orbit" target="_blank" rel="noopener" class="giri-corp-card giri-corp-card-dark" title="Visit Abhinav Giri Official Website">
                  <div class="corp-logo-badge" style="width:42px; height:42px; border-radius:11px; background:#0f172a; border:1px solid #38bdf8; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <img src="assets/giri-logo-symbol.png" alt="Abhinav Giri" style="width:28px; height:28px; border-radius:50%; object-fit:cover; display:block;">
                  </div>
                  <div class="instagram-card-text">
                    <strong class="instagram-handle" style="color:#ffffff;">Abhinav Giri</strong>
                    <span class="instagram-sub" style="color:#38bdf8;">github.com/abhinavgiri45/giri-orbit &rarr;</span>
                  </div>
                </a>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="follow-journey-label">FOLLOW THE JOURNEY</span>
                <a href="https://www.instagram.com/abhinavgiri45/" target="_blank" rel="noopener" class="giri-instagram-card giri-instagram-card-dark" title="Connect with Abhinav Giri on Instagram">
                  <div class="instagram-logo-badge">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" stroke="#ffffff" stroke-width="2" fill="none"/>
                      <circle cx="12" cy="12" r="4.2" stroke="#ffffff" stroke-width="2" fill="none"/>
                      <circle cx="16.8" cy="7.2" r="1.1" fill="#ffffff"/>
                    </svg>
                  </div>
                  <div class="instagram-card-text">
                    <strong class="instagram-handle">@abhinavgiri45</strong>
                    <span class="instagram-sub">Connect on Instagram &rarr;</span>
                  </div>
                </a>
              </div>
            </div>

            <div class="tool-hero-actions">
              <button class="btn-tool-create-blank red" id="btn-kinetic-hero-blank">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <span>Create blank presentation</span>
              </button>
              <button class="btn-tool-upload-file" id="btn-kinetic-hero-upload">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Upload presentation</span>
              </button>
              <input type="file" id="kinetic-hero-file-input" accept=".gkinetic,.pptx,.ppt,.odp,.json,.html" style="display:none;">
              <button class="btn-tool-new-template-cta" id="btn-kinetic-hero-custom">
                <span>+ Custom Template</span>
              </button>
              <button class="btn-tool-new-template-cta" id="btn-kinetic-hero-import-tpl" style="background:#1e293b; color:#38bdf8; border:1px solid #334155;" title="Import Custom Template (.json, .txt, .md, .html)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>↑ Import Template</span>
              </button>
              <input type="file" id="kinetic-import-tpl-input" accept=".json,.txt,.md,.html" style="display:none;">
            </div>
          </div>

          <div class="tool-hero-visual">
            <svg class="tool-hero-visual-svg" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="25" width="220" height="130" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>
              <rect x="42" y="37" width="196" height="106" rx="4" fill="#0f172a"/>
              <rect x="55" y="50" width="70" height="10" rx="2" fill="#c43e1c"/>
              <rect x="55" y="66" width="110" height="6" rx="2" fill="#94a3b8"/>
              <rect x="55" y="78" width="90" height="6" rx="2" fill="#64748b"/>
              <circle cx="195" cy="85" r="28" fill="#c43e1c" fill-opacity="0.3"/>
              <polygon points="190,75 205,85 190,95" fill="#ffffff"/>
            </svg>
          </div>
        </section>

        <!-- Pick Up Where You Left Off Synced Work Banner -->
        <div id="kinetic-resume-banner-slot"></div>

        <main class="tool-templates-section">
          <div class="tool-templates-section-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <h2 class="tool-templates-heading" style="margin:0;">PresentationGO & Global Presentation Library</h2>
              <span class="tool-source-badge">
                <span class="dot"></span>
                <span>3,500+ Free Templates &amp; Diagrams</span>
              </span>
            </div>
            <div class="tool-category-filter-row" style="margin-top:10px;">
              <div class="tool-category-pill-strip" id="kinetic-cat-strip">
                <button class="tool-category-pill active" data-cat="all">All (3,500+)</button>
                <button class="tool-category-pill" data-cat="presentation" style="color:#f97316; font-weight:700;">📊 Executive Presentation Decks</button>
                <button class="tool-category-pill" data-cat="processes">Processes &amp; Steps</button>
                <button class="tool-category-pill" data-cat="timelines">Timelines &amp; Roadmaps</button>
                <button class="tool-category-pill" data-cat="matrix">Matrix &amp; SWOT</button>
                <button class="tool-category-pill" data-cat="pyramids">Pyramids &amp; Hierarchy</button>
                <button class="tool-category-pill" data-cat="funnels">Funnels &amp; Pipelines</button>
                <button class="tool-category-pill" data-cat="diagrams">Charts &amp; Diagrams</button>
                <button class="tool-category-pill" data-cat="tables">Tables &amp; Pricing</button>
                <button class="tool-category-pill" data-cat="themes">Themes &amp; Palettes</button>
                <button class="tool-category-pill" data-cat="custom">
                  <span>Custom Templates</span>
                  <span class="pill-counter-badge">${customTemplates.length}</span>
                </button>
              </div>

              <div class="tool-search-templates-wrap">
                <svg class="tool-search-templates-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="tool-search-templates-input" id="kinetic-template-search" placeholder="Search 3,500+ templates..." spellcheck="false">
              </div>
            </div>

            <!-- Secondary Filter Substrip (Step Options & Color Palettes) -->
            <div class="tool-filter-substrip" id="kinetic-sub-filter-strip">
              <div class="tool-filter-group">
                <span class="tool-filter-group-label">Steps:</span>
                <button class="tool-filter-chip active" data-filter-step="all">All</button>
                <button class="tool-filter-chip" data-filter-step="3">3 Steps</button>
                <button class="tool-filter-chip" data-filter-step="4">4 Steps</button>
                <button class="tool-filter-chip" data-filter-step="5">5 Steps</button>
                <button class="tool-filter-chip" data-filter-step="6">6+ Steps</button>
              </div>
              <div class="tool-filter-group" style="margin-left:12px;">
                <span class="tool-filter-group-label">Palette:</span>
                <button class="tool-filter-chip active" data-filter-color="all">All</button>
                <button class="tool-filter-chip" data-filter-color="blue"><span class="tool-color-dot" style="background:#2563eb;"></span>Blue</button>
                <button class="tool-filter-chip" data-filter-color="green"><span class="tool-color-dot" style="background:#059669;"></span>Green</button>
                <button class="tool-filter-chip" data-filter-color="red"><span class="tool-color-dot" style="background:#dc2626;"></span>Red</button>
                <button class="tool-filter-chip" data-filter-color="purple"><span class="tool-color-dot" style="background:#7c3aed;"></span>Purple</button>
                <button class="tool-filter-chip" data-filter-color="cyan"><span class="tool-color-dot" style="background:#0891b2;"></span>Cyan</button>
                <button class="tool-filter-chip" data-filter-color="amber"><span class="tool-color-dot" style="background:#d97706;"></span>Amber</button>
                <button class="tool-filter-chip" data-filter-color="dark"><span class="tool-color-dot" style="background:#18181b;"></span>Dark</button>
              </div>
            </div>

            <!-- Telemetry & Count Status Bar -->
            <div class="tool-templates-meta-bar">
              <span id="kinetic-templates-count-label">Loading Global Presentation Library...</span>
              <span style="font-size:11px; color:#94a3b8;">PresentationGO • Free for personal &amp; commercial presentations (<a href="https://www.presentationgo.com/" target="_blank" rel="noopener noreferrer" style="color:#60a5fa; text-decoration:underline;">www.presentationgo.com</a>)</span>
            </div>
          </div>

          <div class="tool-templates-grid" id="kinetic-grid-cards"></div>
          <div class="tool-load-more-wrap" id="kinetic-load-more-wrap" style="display:none;">
            <button class="btn-load-more-templates" id="btn-kinetic-load-more">
              <span>Load More Templates</span>
              <span id="txt-kinetic-load-more-remaining" style="font-size:11px; opacity:0.8;"></span>
            </button>
          </div>
        </main>
      </div>
    `;

    const cardsGrid = rootEl.querySelector('#kinetic-grid-cards');
    const searchInp = rootEl.querySelector('#kinetic-template-search');
    const pills = rootEl.querySelectorAll('#kinetic-cat-strip .tool-category-pill');
    const stepChips = rootEl.querySelectorAll('[data-filter-step]');
    const colorChips = rootEl.querySelectorAll('[data-filter-color]');
    const countLabel = rootEl.querySelector('#kinetic-templates-count-label');
    const loadMoreWrap = rootEl.querySelector('#kinetic-load-more-wrap');
    const loadMoreBtn = rootEl.querySelector('#btn-kinetic-load-more');
    const loadMoreRemaining = rootEl.querySelector('#txt-kinetic-load-more-remaining');

    let selCat = 'all';
    let selStep = 'all';
    let selColor = 'all';
    let displayedLimit = 24;
    const PAGE_SIZE = 24;

    // Combined pool combining 3,500+ PresentationGO library + classic decks
    const masterPool = [...PRESENTATION_GO_TEMPLATES, ...KINETIC_BUILTIN_TEMPLATES];

    function getFilteredPool() {
      if (selCat === 'custom') {
        const query = (searchInp.value || '').toLowerCase().trim();
        return customTemplates.filter(x => !query || x.name.toLowerCase().includes(query) || x.desc.toLowerCase().includes(query));
      }

      return filterPresentationGoTemplates(masterPool, {
        query: searchInp.value,
        category: selCat,
        steps: selStep,
        color: selColor
      });
    }

    function renderCards(append = false) {
      if (!append) {
        cardsGrid.innerHTML = '';
        displayedLimit = PAGE_SIZE;
      }

      const filtered = getFilteredPool();
      const visible = filtered.slice(0, displayedLimit);

      if (countLabel) {
        countLabel.textContent = `Showing ${visible.length.toLocaleString()} of ${filtered.length.toLocaleString()} templates`;
      }

      if (loadMoreWrap) {
        if (visible.length < filtered.length) {
          loadMoreWrap.style.display = 'flex';
          const remaining = filtered.length - visible.length;
          if (loadMoreRemaining) loadMoreRemaining.textContent = `(${Math.min(PAGE_SIZE, remaining)} more / ${remaining.toLocaleString()} left)`;
        } else {
          loadMoreWrap.style.display = 'none';
        }
      }

      if (filtered.length === 0) {
        cardsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; color: #64748b;">
            <div style="font-size: 32px; margin-bottom: 12px;">🔍</div>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">No PresentationGO templates match your filters</h3>
            <p style="font-size: 13px; max-width: 400px; margin: 0 auto 16px auto;">Try clearing the search query or selecting "All Steps" or "All Colors" to see more templates.</p>
            <button class="btn-tool-create-blank" id="btn-kinetic-reset-filters" style="margin: 0 auto; display: inline-flex;">Reset Filters</button>
          </div>
        `;
        cardsGrid.querySelector('#btn-kinetic-reset-filters')?.addEventListener('click', () => {
          searchInp.value = '';
          selCat = 'all';
          selStep = 'all';
          selColor = 'all';
          pills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
          stepChips.forEach(c => c.classList.toggle('active', c.dataset.filterStep === 'all'));
          colorChips.forEach(c => c.classList.toggle('active', c.dataset.filterColor === 'all'));
          renderCards(false);
        });
        return;
      }

      const startIndex = append ? (displayedLimit - PAGE_SIZE) : 0;
      const sliceToRender = visible.slice(startIndex, displayedLimit);

      sliceToRender.forEach(tpl => {
        const card = document.createElement('div');
        card.className = 'pgo-template-card';
        const catLabel = tpl.categoryLabel || (tpl.category ? tpl.category.toUpperCase() : 'DIAGRAM');

        card.innerHTML = `
          <div class="pgo-card-top-bar">
            <span class="pgo-brand-compat">GOOGLE SLIDES, PPTX</span>
            <span class="pgo-aspect-pill">16:9</span>
          </div>
          <div class="pgo-preview-frame">
            ${renderTemplateVisualThumbnail(tpl)}
          </div>
          <div class="pgo-card-meta">
            <div class="pgo-pills-row">
              <span class="pgo-cat-pill">${catLabel}</span>
              ${tpl.optionsText ? `<span class="pgo-option-pill">${tpl.optionsText}</span>` : ''}
            </div>
            <h4 class="pgo-card-title" title="${tpl.name}">${tpl.name}</h4>
            <p class="pgo-card-desc" title="${tpl.desc || ''}">${tpl.desc || ''}</p>
            <div class="pgo-watermark-row" style="display:flex; align-items:center; justify-content:space-between; margin-top:6px; padding-top:4px; border-top:1px dashed #e2e8f0; font-size:9.5px;">
              <a href="https://www.presentationgo.com/" target="_blank" rel="noopener noreferrer" style="color:#0284c7; text-decoration:none; display:inline-flex; align-items:center; gap:3px; font-weight:700;" onclick="event.stopPropagation();">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                www.presentationgo.com
              </a>
              <span style="color:#94a3b8; font-size:8.5px;">Free Template</span>
            </div>
            ${tpl.category === 'custom' ? `
              <div style="display:flex; justify-content:flex-end; gap:6px; margin-top:6px;" onclick="event.stopPropagation()">
                <button class="btn-export-kinetic-tpl" title="Export as JSON" style="background:#1e293b; border:1px solid #334155; color:#38bdf8; border-radius:4px; padding:3px 8px; font-size:10px; cursor:pointer;">↓ Export</button>
                <button class="btn-del-kinetic-tpl" title="Delete Template" style="background:#450a0a; border:1px solid #991b1b; color:#fca5a5; border-radius:4px; padding:3px 8px; font-size:10px; cursor:pointer;">🗑</button>
              </div>
            ` : ''}
          </div>
        `;
        if (tpl.category === 'custom') {
          card.querySelector('.btn-export-kinetic-tpl')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const blob = new Blob([JSON.stringify(tpl, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${(tpl.name || 'custom_kinetic_template').toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
            a.click();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Exported "${tpl.name}" JSON template`);
          });
          card.querySelector('.btn-del-kinetic-tpl')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete custom template "${tpl.name}"?`)) {
              customTemplates = customTemplates.filter(x => x.id !== tpl.id);
              localStorage.setItem('giri_orbit_kinetic_custom_templates', JSON.stringify(customTemplates));
              renderCards(false);
              if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Deleted template "${tpl.name}"`);
            }
          });
        }
        card.addEventListener('click', () => {
          const themedSlides = (tpl.slides || []).map(s => ({
            ...s,
            themeStyle: s.themeStyle || tpl.themeStyle,
            previewAccent: s.previewAccent || tpl.previewAccent,
            color: s.color || tpl.color,
            deckName: tpl.name
          }));
          mountKineticEditor(rootEl, themedSlides, onUpdate);
        });
        cardsGrid.appendChild(card);
      });
    }

    // Category pill listeners
    pills.forEach(btn => {
      btn.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        selCat = btn.dataset.cat;
        renderCards(false);
      });
    });

    // Step filter listeners
    stepChips.forEach(chip => {
      chip.addEventListener('click', () => {
        stepChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selStep = chip.dataset.filterStep;
        renderCards(false);
      });
    });

    // Color filter listeners
    colorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        colorChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selColor = chip.dataset.filterColor;
        renderCards(false);
      });
    });

    // Search input with debounce
    let searchTimer = null;
    searchInp?.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        renderCards(false);
      }, 150);
    });

    // Load more button listener
    loadMoreBtn?.addEventListener('click', () => {
      displayedLimit += PAGE_SIZE;
      renderCards(true);
    });

    // Initial render
    renderCards(false);
    rootEl.querySelector('#btn-kinetic-hero-blank')?.addEventListener('click', () => {
      try { localStorage.removeItem('giri_orbit_kinetic_deck'); } catch {}
      mountKineticEditor(rootEl, 'blank', onUpdate);
    });

    // Custom template upload on Hub
    const hubUploadBtn = rootEl.querySelector('#btn-kinetic-hero-upload');
    const hubFileInput = rootEl.querySelector('#kinetic-hero-file-input');
    hubUploadBtn?.addEventListener('click', () => hubFileInput?.click());
    hubFileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          let importedSlides = [];
          let tplName = file.name.replace(/\.[^/.]+$/, '');
          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(evt.target.result);
            if (Array.isArray(parsed)) importedSlides = parsed;
            else if (parsed.slides && Array.isArray(parsed.slides)) {
              importedSlides = parsed.slides;
              if (parsed.name) tplName = parsed.name;
            }
          } else {
            importedSlides = [
              {
                id: Date.now(),
                layout: 'title',
                tag: 'CUSTOM IMPORT',
                title: tplName,
                desc: 'Imported presentation from ' + file.name,
                features: [{ num: '01', title: 'Imported Presentation', desc: file.name }]
              }
            ];
          }

          const newTpl = {
            id: 'custom-tpl-' + Date.now(),
            name: tplName,
            category: 'custom',
            desc: `Custom uploaded template (${file.name})`,
            previewAccent: '#3b82f6',
            slides: importedSlides
          };

          customTemplates.push(newTpl);
          localStorage.setItem('giri_orbit_kinetic_custom_templates', JSON.stringify(customTemplates));
          selCat = 'custom';
          pills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'custom'));
          refreshCards();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Uploaded template "${tplName}" with ${importedSlides.length} slides!`);
        } catch (err) {
          alert('Error parsing template: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    rootEl.querySelector('#btn-kinetic-hero-custom')?.addEventListener('click', () => hubFileInput?.click());

    const kineticImportInput = rootEl.querySelector('#kinetic-import-tpl-input');
    rootEl.querySelector('#btn-kinetic-hero-import-tpl')?.addEventListener('click', () => kineticImportInput?.click());
    kineticImportInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const raw = evt.target.result;
          let slides = [];
          let tplName = file.name.replace(/\.[^/.]+$/, '');
          let desc = `Imported custom presentation template (${file.name})`;
          let previewAccent = '#3b82f6';
          let previewBg = '#0f172a';

          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              if (parsed.length > 0 && parsed[0].slides) {
                parsed.forEach((t, idx) => {
                  customTemplates.push({
                    id: 'custom-tpl-' + Date.now() + '-' + idx,
                    name: t.name || `${tplName} ${idx + 1}`,
                    category: 'custom',
                    desc: t.desc || desc,
                    previewAccent: t.previewAccent || previewAccent,
                    previewBg: t.previewBg || previewBg,
                    slides: t.slides || []
                  });
                });
                localStorage.setItem('giri_orbit_kinetic_custom_templates', JSON.stringify(customTemplates));
                selCat = 'custom';
                pills.forEach(p => {
                  const isC = p.dataset.cat === 'custom';
                  p.classList.toggle('active', isC);
                  if (isC) {
                    const b = p.querySelector('.pill-counter-badge');
                    if (b) b.textContent = customTemplates.length;
                  }
                });
                renderCards(false);
                if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported ${parsed.length} presentation templates!`);
                return;
              } else {
                slides = parsed;
              }
            } else if (parsed.slides && Array.isArray(parsed.slides)) {
              slides = parsed.slides;
              if (parsed.name) tplName = parsed.name;
              if (parsed.desc) desc = parsed.desc;
              if (parsed.previewAccent) previewAccent = parsed.previewAccent;
              if (parsed.previewBg) previewBg = parsed.previewBg;
            } else {
              slides = [parsed];
            }
          } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
            const rawSections = raw.split(/\n---+\n/);
            rawSections.forEach((sec, sIdx) => {
              const lines = sec.trim().split('\n').map(l => l.trim()).filter(Boolean);
              if (!lines.length) return;
              let sTitle = `Slide ${sIdx + 1}`;
              let sDesc = '';
              let sTag = `PART ${sIdx + 1}`;
              const features = [];

              lines.forEach(line => {
                if (line.startsWith('# ')) {
                  sTitle = line.slice(2).trim();
                  if (sIdx === 0) tplName = sTitle;
                } else if (line.startsWith('## ') || line.startsWith('### ')) {
                  sDesc = line.replace(/^#+\s*/, '').trim();
                } else if (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\.\s/)) {
                  const itemText = line.replace(/^[-*\d.]+\s*/, '').trim();
                  features.push({
                    num: `0${features.length + 1}`,
                    title: itemText,
                    desc: ''
                  });
                } else if (!sDesc && !line.startsWith('#')) {
                  sDesc = line;
                }
              });

              slides.push({
                id: Date.now() + sIdx,
                layout: sIdx === 0 ? 'title' : (features.length >= 3 ? 'circular-loop' : 'chevron-flow'),
                tag: sTag,
                title: sTitle,
                desc: sDesc || 'Key strategic overview points',
                accent: previewAccent,
                bg: sIdx === 0 ? '#0f172a' : '#ffffff',
                features: features.length ? features : [
                  { num: '01', title: 'Strategy', desc: 'Core execution milestone' },
                  { num: '02', title: 'Impact', desc: 'Measurable organizational value' }
                ]
              });
            });
          } else {
            slides = [
              {
                id: Date.now(),
                layout: 'title',
                tag: 'IMPORTED SLIDE',
                title: tplName,
                desc: raw.replace(/<[^>]*>/g, ' ').slice(0, 150).trim() || 'Custom imported presentation slide',
                accent: previewAccent,
                bg: '#0f172a',
                features: [
                  { num: '01', title: 'Slide Content', desc: 'Imported from ' + file.name }
                ]
              }
            ];
          }

          if (!slides.length) {
            slides = [{ id: Date.now(), layout: 'title', tag: 'SLIDE 1', title: tplName, desc: 'Presentation Overview', features: [] }];
          }

          const newTpl = {
            id: 'custom-tpl-' + Date.now(),
            name: tplName,
            category: 'custom',
            desc,
            previewAccent,
            previewBg,
            slides
          };

          customTemplates.push(newTpl);
          localStorage.setItem('giri_orbit_kinetic_custom_templates', JSON.stringify(customTemplates));
          selCat = 'custom';
          pills.forEach(p => {
            const isC = p.dataset.cat === 'custom';
            p.classList.toggle('active', isC);
            if (isC) {
              const b = p.querySelector('.pill-counter-badge');
              if (b) b.textContent = customTemplates.length;
            }
          });
          renderCards(false);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported custom template "${tplName}" (${slides.length} slides)!`);
        } catch (err) {
          alert('Failed to import template: ' + err.message);
        }
      };
      reader.readAsText(file);
      kineticImportInput.value = '';
    });
    rootEl.querySelector('#btn-kinetic-nav-custom')?.addEventListener('click', () => {
      selCat = 'custom';
      pills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'custom'));
      refreshCards();
    });
    rootEl.querySelector('#btn-kinetic-nav-blank')?.addEventListener('click', () => {
      try { localStorage.removeItem('giri_orbit_kinetic_deck'); } catch {}
      mountKineticEditor(rootEl, 'blank', onUpdate);
    });

    // Suite Switcher Dropdown Toggle
    const brandTrigger = rootEl.querySelector('#kinetic-brand-dropdown-trigger');
    const suiteMenu = rootEl.querySelector('#kinetic-suite-menu');
    brandTrigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (suiteMenu) suiteMenu.style.display = suiteMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => {
      if (suiteMenu) suiteMenu.style.display = 'none';
    });

    // Suite navigation links
    rootEl.querySelectorAll('[data-switch]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.dataset.switch;
        if (window.orbitPlatform) window.orbitPlatform.navigateTo(target);
      });
    });

    // Direct Tool Link Copier
    rootEl.querySelector('#btn-kinetic-share-link')?.addEventListener('click', () => {
      const url = window.orbitPlatform ? window.orbitPlatform.getToolUrl('kinetic') : `${window.location.origin}/#kinetic`;
      navigator.clipboard?.writeText(url).then(() => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Copied direct link to Giri Kinetic: ${url}`);
      }).catch(() => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Direct Link: ${url}`);
      });
    });

    // Hydrate Pick Up Where You Left Off Banner
    const resumeSlot = rootEl.querySelector('#kinetic-resume-banner-slot');
    if (resumeSlot && window.giriSyncManager && window.giriSyncManager.hasSavedWork('kinetic')) {
      const syncInfo = window.giriSyncManager.getToolSyncInfo('kinetic');
      const timeStr = window.giriSyncManager.formatTimeAgo(syncInfo.updatedAt);
      resumeSlot.innerHTML = `
        <div class="tool-resume-banner" id="kinetic-resume-banner" style="margin: 20px auto 24px auto; max-width: 1200px;">
          <div class="tool-resume-left">
            <div class="tool-resume-icon-badge" style="background:#fef2f2; color:#dc2626; border:1px solid #fecaca; font-weight:800; font-size:16px;">
              K
            </div>
            <div>
              <div class="tool-resume-title" style="font-size:15px; font-weight:700; color:#ffffff;">Pick up where you left off in Kinetic</div>
              <div class="tool-resume-meta" style="font-size:12px; color:#94a3b8; display:flex; align-items:center; gap:6px; margin-top:3px;">
                <span class="sync-dot-live" style="width:6px; height:6px; display:inline-block;"></span>
                <span style="color:#f8fafc; font-weight:600;">${syncInfo.title}</span> • 
                <span>Saved ${timeStr}</span> • 
                <span>${syncInfo.stats || 'Cinematic widescreen presentation deck'}</span>
              </div>
            </div>
          </div>
          <div class="tool-resume-actions" style="display:flex; align-items:center; gap:10px;">
            <button class="btn-delete-saved-work" id="btn-kinetic-banner-delete" title="Delete this saved draft from browser storage">
              🗑 Delete Draft
            </button>
            <button class="btn-resume-work" id="btn-kinetic-banner-resume" style="background:#dc2626; color:#ffffff; padding:7px 16px; border-radius:6px; font-weight:600; border:none; cursor:pointer;">
              ▶ Resume Work &rarr;
            </button>
          </div>
        </div>
      `;

      resumeSlot.querySelector('#btn-kinetic-banner-resume')?.addEventListener('click', () => {
        mountKineticEditor(rootEl, null, onUpdate);
      });

      resumeSlot.querySelector('#btn-kinetic-banner-delete')?.addEventListener('click', () => {
        if (confirm('Delete saved Kinetic presentation work from browser storage? This will clear your draft.')) {
          window.giriSyncManager.deleteSyncedWork('kinetic');
          resumeSlot.innerHTML = '';
        }
      });
    }

    refreshCards();
  }

  function mountKineticEditor(container, templateSlides = null, onDeckUpdate = null) {

  const defaultSlides = [
    {
      id: 1,
      layout: 'title',
      tag: 'SLIDE 1',
      title: 'Click to add title',
      desc: 'Click to add subtitle',
      features: [],
      notes: ''
    }
  ];

  let slidesData = defaultSlides;
  if (templateSlides === 'blank') {
    slidesData = [
      {
        id: 1,
        layout: 'blank',
        tag: 'SLIDE 1',
        title: 'Click to add title',
        desc: 'Click to add content',
        features: [],
        notes: ''
      }
    ];
    try {
      localStorage.setItem('giri_orbit_kinetic_deck', JSON.stringify(slidesData));
    } catch {}
  } else if (templateSlides && Array.isArray(templateSlides) && templateSlides.length > 0) {
    slidesData = JSON.parse(JSON.stringify(templateSlides));
    try {
      localStorage.setItem('giri_orbit_kinetic_deck', JSON.stringify(slidesData));
    } catch {}
  } else {
    const savedDeck = localStorage.getItem('giri_orbit_kinetic_deck');
    if (savedDeck) {
      try {
        slidesData = JSON.parse(savedDeck);
      } catch {}
    }
  }

  // Ensure all slides inherit executive theme gradients, accents, and styles
  slidesData = slidesData.map(s => {
    const theme = resolveSlideTheme(s);
    return {
      ...s,
      bg: s.bg || theme.bg,
      accent: s.accent || theme.accent,
      themeStyle: s.themeStyle || theme.name
    };
  });

  let currentSlideIndex = 0;
  let currentTheme = 'theme-minimalist';
  let currentTransition = 'fade';
  let aspectRatio = '16-9';

  container.innerHTML = `
    <div class="kinetic-app-shell" id="kinetic-app-shell">
      <!-- Giri Kinetic Classic Desktop Chrome -->
      <div class="lo-classic-chrome">
        ${orbitDesktopSuite.renderWindowHeader('kinetic', 'Presentation 1 - Giri Kinetic Presentation')}
        ${orbitDesktopSuite.renderMenubar('kinetic')}
        ${orbitDesktopSuite.renderToolbars('kinetic')}
      </div>

      <!-- Enterprise Multi-Tab Office Ribbon -->
      <nav class="fluent-ribbon-bar" aria-label="Presentation Fluent Office Ribbon">
        <!-- Ribbon Tabs Strip -->
        <div class="fluent-ribbon-tabs">
          <button class="fluent-tab-btn" id="btn-kinetic-return-hub" style="color:#38bdf8; font-weight:700; display:flex; align-items:center; gap:4px; margin-right:4px;" title="Return to Orbit Hub"><span style="font-size:13px;">⟵</span><span>Hub</span></button>
          <button class="fluent-tab-btn fluent-tab-file-btn" id="btn-kinetic-file-menu" title="Open File Menu">File</button>
          <button class="fluent-tab-btn active" data-tab="home">Home</button>
          <button class="fluent-tab-btn" data-tab="insert">Insert</button>
          <button class="fluent-tab-btn" data-tab="design">Design</button>
          <button class="fluent-tab-btn" data-tab="transitions">Transitions</button>
          <button class="fluent-tab-btn" data-tab="animations">Animations</button>
          <button class="fluent-tab-btn" data-tab="slideshow">Slide Show</button>
          <button class="fluent-tab-btn" data-tab="review">Review</button>
          <button class="fluent-tab-btn" data-tab="view">View</button>
          <button class="fluent-tab-btn" data-tab="help">Help</button>

          <!-- Top-Right Actions -->
          <div class="fluent-top-actions">
            <button class="fluent-top-action-pill fluent-autosave-toggle-btn active" id="btn-kinetic-autosave-toggle" title="Auto-Save is ON: All changes saved automatically (Click to toggle)">
              <span class="autosave-dot" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;"></span>
              <span class="autosave-text" style="font-weight:600;font-size:11.5px;">Auto-Save: ON</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-kinetic-special-link" title="Special Document Link: Share & open instantly on any Phone or PC" style="background:linear-gradient(135deg,rgba(234,88,12,0.18),rgba(220,38,38,0.18));color:#fb923c;border:1px solid rgba(251,146,60,0.4);font-weight:600;">
              <span style="font-size:12px;">📱</span>
              <span>Phone/PC Link</span>
            </button>
            <button class="fluent-drive-action-pill" id="btn-kinetic-drive-sync" title="Google Drive Sync: Direct editing & cloud auto-save">
              <span class="drive-dot-live"></span>
              <span id="txt-kinetic-drive-status">☁️ Drive</span>
            </button>
            <button class="fluent-sync-action-pill" id="btn-kinetic-browser-sync" title="Browser Sync: Slides automatically save to browser storage. Click to open sync manager.">
              <span class="sync-dot-live"></span>
              <span id="txt-kinetic-browser-sync-status">Synced to Browser</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-kinetic-save-device" title="Direct Disk Sync: Save presentation directly to your computer without re-downloads" style="background:#059669; color:#ffffff; font-weight:600; border-color:#047857;">
              <span style="font-size:12px;">💾</span>
              <span id="txt-kinetic-sync-status">Save to Device</span>
            </button>
            <button class="fluent-top-action-pill ai-agent-btn" id="btn-kinetic-top-ai-agent" title="Girionix Autonomous AI Agent (Alt+A)" style="background:linear-gradient(135deg, rgba(168,85,247,0.22), rgba(234,88,12,0.22)); border:1px solid rgba(168,85,247,0.45); color:#c084fc; font-weight:700;">
              <span style="font-size:12px;">🤖</span>
              <span>AI Agent</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-kinetic-comments" title="Comments">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Comments</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-kinetic-catchup" title="Catch up on presentation changes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>Catch up</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-kinetic-editing-mode" title="Editing Mode">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Editing ▾</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-quick-present" style="background:#2563eb; color:#ffffff; border-color:#1d4ed8; font-weight:600;" title="Launch Presenter Slide Show (F5)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Present</span>
            </button>
            <button class="fluent-top-action-pill share-btn" id="btn-kinetic-share" title="Share Sovereign Presentation">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span>Share ▾</span>
            </button>
          </div>
        </div>

        <!-- Dark Office 365 File Dropdown Menu (Exact match to screenshot) -->
        <div class="office-file-menu-dropdown" id="kinetic-file-menu-dropdown">
          <div class="file-menu-item" data-action="ai-agent" id="file-menu-kinetic-ai-agent" style="background:rgba(168,85,247,0.12); color:#c084fc; font-weight:700;">
            <span class="file-menu-icon">🤖</span>
            <span>Girionix AI Agent...</span>
            <span class="file-menu-shortcut" style="margin-left:auto; font-size:10px; color:#94a3b8;">Alt+A</span>
          </div>
          <div class="file-menu-item" data-action="drive-sync" id="file-menu-kinetic-drive-sync" style="background:rgba(66,133,244,0.15); color:#60a5fa; font-weight:600;">
            <span class="file-menu-icon">☁️</span>
            <span>Google Drive Cloud Sync...</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="templates" id="btn-kinetic-file-templates">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
            <span>Global Templates...</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="save-template" id="btn-kinetic-save-custom-template" style="color:#38bdf8;">
            <span class="file-menu-icon">🎨</span>
            <span>Save as Custom Template...</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="import-template" id="btn-kinetic-import-custom-template" style="color:#38bdf8;">
            <span class="file-menu-icon">📥</span>
            <span>Import Custom Template...</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <input type="file" id="kinetic-editor-import-tpl-input" accept=".json,.txt,.md,.html" style="display:none;">
          <div class="file-menu-item" data-action="save-device" id="file-menu-kinetic-save-device" style="background:rgba(5,150,105,0.15); color:#34d399; font-weight:600;">
            <span class="file-menu-icon">💾</span>
            <span>Save to Device (Direct Sync)</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="open-device" id="file-menu-kinetic-open-device">
            <span class="file-menu-icon">📂</span>
            <span>Open from Device (Direct Sync)</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-sep"></div>
          <div class="file-menu-item" data-action="new">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg></span>
            <span>New</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="open">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
            <span>Open</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="share">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></span>
            <span>Share</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="copy">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></span>
            <span>Create a copy</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="export">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
            <span>Export</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="print">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></span>
            <span>Print</span>
          </div>
          <div class="file-menu-sep"></div>
          <div class="file-menu-item" data-action="rename">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
            <span>Rename</span>
          </div>
          <div class="file-menu-item disabled" title="Presentation is sovereignly stored in browser local memory" data-action="move">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg></span>
            <span>Move File</span>
          </div>
          <div class="file-menu-item" data-action="history">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
            <span>Version history</span>
          </div>
          <div class="file-menu-sep"></div>
          <div class="file-menu-item danger" data-action="delete">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></span>
            <span>Delete</span>
          </div>
          <div class="file-menu-item" data-action="info">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
            <span>Info</span>
            <span class="file-menu-arrow">›</span>
          </div>
        </div>

        <!-- Fluent Ribbon Panes -->
        <div class="fluent-ribbon-panes">
          <!-- 1. HOME TAB PANE -->
          <div class="fluent-ribbon-pane active" id="pane-kinetic-home">
            <!-- Undo Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col" style="gap:4px;">
                  <button class="fluent-btn-small" id="btn-kinetic-undo" title="Undo (Ctrl+Z)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  </button>
                  <button class="fluent-btn-small" id="btn-kinetic-redo" title="Redo (Ctrl+Y)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Undo</div>
              </div>
            </div>

            <!-- Clipboard Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-paste" title="Paste (Ctrl+V)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                  <span>Paste ▾</span>
                </button>
                <div class="fluent-group-col">
                  <button class="fluent-btn-small" id="btn-kinetic-cut" title="Cut (Ctrl+X)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                  </button>
                  <button class="fluent-btn-small" id="btn-kinetic-copy" title="Copy (Ctrl+C)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  <button class="fluent-btn-small" id="btn-kinetic-format-painter" title="Format Painter">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M5 13v7a2 2 0 0 0 2 2h2v-9"/><path d="M15 13v9"/></svg>
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Clipboard</div>
                <button class="fluent-group-launcher" id="btn-kinetic-launcher-clipboard" title="Clipboard">⤢</button>
              </div>
            </div>

            <!-- Slides Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-new-slide-btn" title="Add New Slide">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  <span>New Slide ▾</span>
                </button>
                <div class="fluent-group-col">
                  <select class="fluent-select-dark" id="kinetic-new-slide-layout" style="width:125px; font-size:11px;">
                    <option value="" selected>Layout ▾</option>
                    <option value="title">Title Slide</option>
                    <option value="circular-loop">Circular Loop (4-Phase)</option>
                    <option value="zigzag-process">Zigzag Diamond Track</option>
                    <option value="chevron-flow">Chevron Process Flow</option>
                    <option value="swot-matrix">Strategic 2x2 SWOT</option>
                    <option value="milestone-journey">Milestone Roadmap</option>
                    <option value="pyramid-hierarchy">Maslow Pyramid</option>
                    <option value="funnel-stages">Conversion Funnel</option>
                    <option value="radial-cycle">Radial Spoke Concept</option>
                    <option value="comparison-table">3-Tier Pricing Table</option>
                    <option value="metrics">Metrics &amp; Stats</option>
                    <option value="columns">Two Columns</option>
                    <option value="blank">Blank Canvas</option>
                  </select>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-dup" title="Duplicate Slide" style="width:auto; padding:0 6px;">Duplicate</button>
                    <button class="fluent-btn-small" id="btn-kinetic-del" title="Delete Slide" style="color:#ef4444; width:auto; padding:0 6px;">Delete</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Slides</div>
                <button class="fluent-group-launcher" id="btn-kinetic-launcher-slides" title="Slides Setup">⤢</button>
              </div>
            </div>

            <!-- Font Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <div id="kinetic-font-picker-mount" class="fluent-font-mount"></div>
                    <select class="fluent-select-dark" id="kinetic-font-size-pt" style="width:58px;" title="Font Size">
                      <option value="16">16 pt</option>
                      <option value="20">20 pt</option>
                      <option value="24" selected>24 pt</option>
                      <option value="32">32 pt</option>
                      <option value="44">44 pt</option>
                      <option value="60">60 pt</option>
                    </select>
                    <button class="fluent-btn-small" id="btn-kinetic-font-grow" title="Grow Font">A<sup>▲</sup></button>
                    <button class="fluent-btn-small" id="btn-kinetic-font-shrink" title="Shrink Font">A<sup>▼</sup></button>
                    <button class="fluent-btn-small" id="btn-kinetic-clear-formatting" title="Clear Formatting (Tx)">T<span style="font-size:9px; color:#ef4444; margin-left:1px;">✕</span></button>
                  </div>

                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-bold" title="Bold (Ctrl+B)"><strong>B</strong></button>
                    <button class="fluent-btn-small" id="btn-kinetic-italic" title="Italic (Ctrl+I)"><em>I</em></button>
                    <button class="fluent-btn-small" id="btn-kinetic-underline" title="Underline (Ctrl+U)"><u>U</u></button>
                    <button class="fluent-btn-small" id="btn-kinetic-strike" title="Strikethrough"><s>ab</s></button>
                    <button class="fluent-btn-small" id="btn-kinetic-sub" title="Subscript">x<span class="sub-blue">2</span></button>
                    <button class="fluent-btn-small" id="btn-kinetic-sup" title="Superscript">x<span class="sup-blue">2</span></button>
                    <button class="fluent-btn-small" id="btn-kinetic-change-case" title="Change Case">Ab ▾</button>

                    <label class="fluent-btn-small ribbon-color-picker-wrap" title="Highlight Color">
                      <span style="background:#fde047; color:#000; padding:0 3px; font-weight:800; border-radius:2px; font-size:10px;">ab</span>
                      <input type="color" class="ribbon-color-input" id="input-kinetic-highlight" value="#fde047">
                    </label>

                    <label class="fluent-btn-small ribbon-color-picker-wrap" title="Text Color">
                      <span id="indicator-kinetic-text" style="font-weight:900; font-size:12px; color:#ef4444; border-bottom:2px solid #ef4444;">A</span>
                      <input type="color" class="ribbon-color-input" id="input-kinetic-text" value="#ef4444">
                    </label>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Font</div>
                <button class="fluent-group-launcher" id="btn-kinetic-launcher-font" title="Font Dialog">⤢</button>
              </div>
            </div>

            <!-- Paragraph Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-bullet" title="Bulleted List">•≡</button>
                    <button class="fluent-btn-small" id="btn-kinetic-number" title="Numbered List">1≡</button>
                    <button class="fluent-btn-small" id="btn-kinetic-indent-dec" title="Decrease Indent">⇤</button>
                    <button class="fluent-btn-small" id="btn-kinetic-indent-inc" title="Increase Indent">⇥</button>
                  </div>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-align-left" title="Align Left">⇦</button>
                    <button class="fluent-btn-small" id="btn-kinetic-align-center" title="Center">⇋</button>
                    <button class="fluent-btn-small" id="btn-kinetic-align-right" title="Align Right">⇨</button>
                    <button class="fluent-btn-small" id="btn-kinetic-align-justify" title="Justify">≡</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Paragraph</div>
                <button class="fluent-group-launcher" id="btn-kinetic-launcher-paragraph" title="Paragraph Settings">⤢</button>
              </div>
            </div>

            <!-- Drawing Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-shape-rect" title="Rectangle">■</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-rounded" title="Rounded Box">▢</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-circle" title="Circle">●</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-triangle" title="Triangle">▲</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-star" title="Star">★</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-arrow" title="Arrow">➔</button>
                  </div>
                  <div class="fluent-group-row">
                    <label class="fluent-btn-small ribbon-color-picker-wrap" title="Shape Fill Color" style="width:auto; padding:0 6px;">
                      <span style="font-size:11px;">Fill:</span>
                      <input type="color" class="ribbon-color-input" id="input-kinetic-shape-fill" value="#2563eb">
                    </label>
                    <label class="fluent-btn-small ribbon-color-picker-wrap" title="Shape Outline Color" style="width:auto; padding:0 6px;">
                      <span style="font-size:11px;">Line:</span>
                      <input type="color" class="ribbon-color-input" id="input-kinetic-shape-line" value="#ffffff">
                    </label>
                    <button class="fluent-btn-small" id="btn-kinetic-arrange" title="Arrange Objects" style="width:auto; padding:0 6px;">Arrange ▾</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Drawing</div>
                <button class="fluent-group-launcher" id="btn-kinetic-launcher-drawing" title="Drawing Options">⤢</button>
              </div>
            </div>

            <!-- Editing Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <button class="fluent-btn-small" id="btn-kinetic-find" title="Find Text" style="width:100%; justify-content:flex-start; gap:4px; padding:0 6px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <span>Find</span>
                  </button>
                  <button class="fluent-btn-small" id="btn-kinetic-replace" title="Replace Text" style="width:100%; justify-content:flex-start; gap:4px; padding:0 6px;">
                    <span>Replace</span>
                  </button>
                  <button class="fluent-btn-small" id="btn-kinetic-select-all" title="Select All Objects" style="width:100%; justify-content:flex-start; gap:4px; padding:0 6px;">
                    <span>Select All</span>
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Editing</div>
              </div>
            </div>

            <!-- Voice Dictate Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-voice" title="Voice Dictation (Microphone)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                  <span>Dictate ▾</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Voice</div>
              </div>
            </div>

            <!-- Designer Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-designer" title="Designer AI Presentation Layouts" style="color:#a855f7;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>Designer</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Designer</div>
              </div>
            </div>

            <!-- Girionix AI Studio Group -->
            <div class="fluent-ribbon-group" style="background:rgba(168,85,247,0.08); border-radius:4px; border-right:none;">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-ai-agent" title="Girionix Autonomous Agent: Generate full slide deck from prompt (Alt+A)" style="color:#a855f7; font-weight:700; background:rgba(168,85,247,0.12); border-radius:6px;">
                  <strong style="font-size:18px;">🤖</strong>
                  <span style="color:#a855f7;">AI Agent</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-home-ai-studio" title="Girionix AI Presentation Studio (Alt+J / Ctrl+Shift+J)" style="color:#a855f7; font-weight:700;">
                  <strong style="color:#a855f7; font-size:18px;">⚡</strong>
                  <span style="color:#a855f7;">AI Studio</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-import-from-girionix" title="Import presentation from Girionix AI" style="color:#a855f7;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span style="color:#a855f7;">Import from AI</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-export-to-girionix" title="Export presentation slides to Girionix AI for analysis & speaker notes" style="color:#a855f7;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span style="color:#a855f7;">Export to AI</span>
                </button>
              </div>
              <div class="fluent-group-footer"><span class="fluent-group-label" style="color:#a855f7; font-weight:700;">Girionix AI</span></div>
            </div>
          </div>

          <!-- 2. INSERT TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-insert">
            
            <!-- Shapes Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-shape-rect" title="Rectangle">■ Box</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-rounded" title="Rounded Box">▢ Round</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-circle" title="Circle">● Circle</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-pill" title="Pill Badge">⬭ Pill</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-triangle" title="Triangle">▲ Tri</button>
                  </div>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-shape-diamond" title="Diamond">◆ Diamond</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-star" title="5-Point Star">★ Star</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-callout" title="Speech Callout">💬 Callout</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-arrow" title="Right Arrow">➔ Arrow</button>
                    <button class="fluent-btn-small" id="btn-kinetic-shape-line" title="Connector Line">― Line</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-label">Shapes</div>
            </div>

            <!-- Vector Icons & Graphics -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-icons" title="Insert Vector Icons">
                  <span style="font-size:16px;">💎</span>
                  <span>Icons</span>
                </button>
              </div>
              <div class="fluent-group-label">Icons</div>
            </div>

            <!-- SmartArt Diagrams -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-smartart" title="Insert SmartArt Diagrams (Process, Hierarchy, Cycle, Matrix, Funnel, Chevron)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4"/></svg>
                  <span>SmartArt</span>
                </button>
              </div>
              <div class="fluent-group-label">SmartArt</div>
            </div>

            <!-- Text & Media Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-textbox" title="Insert Text Box">
                  <span style="font-size:16px;">🔤</span>
                  <span>Text Box</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-insert-img" title="Insert Picture from Device">
                  <span style="font-size:16px;">🖼️</span>
                  <span>Picture</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-edit-pic" title="Format Picture: Crop, Filters, Radius, Rotation">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Format Pic</span>
                </button>
                <input type="file" id="kinetic-img-file-input" accept="image/*" style="display:none;">

                <button class="fluent-btn-large" id="btn-kinetic-insert-audio" title="Insert Audio / Music / Narration">
                  <span style="font-size:16px;">🎵</span>
                  <span>Audio</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-insert-video" title="Insert Video (MP4 / YouTube Embed)">
                  <span style="font-size:16px;">🎬</span>
                  <span>Video</span>
                </button>

                <button class="fluent-btn-large" id="btn-kinetic-ai-gen" style="color:#a855f7; font-weight:700;" title="Girionix AI Presentation Studio (Alt+J / Ctrl+Shift+J)">
                  <strong style="color:#a855f7; font-size:18px;">⚡</strong>
                  <span style="color:#a855f7;">AI Studio</span>
                </button>
              </div>
              <div class="fluent-group-label">Media &amp; Text</div>
            </div>

            <!-- Table Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-insert-table" title="Insert Table">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                  <span>Table ▾</span>
                </button>
              </div>
              <div class="fluent-group-label">Table</div>
              <div id="kinetic-table-picker" style="display:none;position:fixed;z-index:9999;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
                <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">Select table size</div>
                <div id="table-picker-grid" style="display:grid;grid-template-columns:repeat(8,18px);gap:2px;"></div>
                <div id="table-picker-label" style="font-size:11px;color:#38bdf8;margin-top:6px;text-align:center;">0 × 0</div>
              </div>
            </div>

            <!-- Chart Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-chart="bar" style="padding:0 5px;">📊 Bar</button>
                    <button class="fluent-btn-small" data-chart="line" style="padding:0 5px;">📈 Line</button>
                    <button class="fluent-btn-small" data-chart="pie" style="padding:0 5px;">🥧 Pie</button>
                  </div>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-chart="donut" style="padding:0 5px;">⭕ Donut</button>
                    <button class="fluent-btn-small" data-chart="area" style="padding:0 5px;">🏔 Area</button>
                    <button class="fluent-btn-small" data-chart="scatter" style="padding:0 5px;">⬥ Scatter</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-label">Chart</div>
            </div>

            <!-- Links, Action Buttons & Text -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-insert-link" style="padding:0 6px;">🔗 Hyperlink</button>
                    <button class="fluent-btn-small" id="btn-kinetic-action-buttons" style="padding:0 6px; font-weight:600;">🔘 Action ▾</button>
                  </div>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-kinetic-wordart" style="padding:0 6px;font-weight:900;">A WordArt</button>
                    <button class="fluent-btn-small" id="btn-kinetic-insert-date" style="padding:0 6px;">📅 Date</button>
                    <button class="fluent-btn-small" id="btn-kinetic-insert-slidenum" style="padding:0 6px;"># Slide No</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-label">Links &amp; Actions</div>
            </div>

            <!-- Symbols & Proofing -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <button class="fluent-btn-small" id="btn-kinetic-equation" style="padding:0 6px;font-style:italic;">∑ Equation</button>
                  <button class="fluent-btn-small" id="btn-kinetic-symbol" style="padding:0 6px;">₹ Symbol</button>
                  <button class="fluent-btn-small" id="btn-kinetic-insert-thesaurus" style="padding:0 6px;">📚 Thesaurus</button>
                </div>
              </div>
              <div class="fluent-group-label">Symbols</div>
            </div>

          </div>

          <!-- REVIEW TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-review">
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-spellcheck" title="Spelling &amp; Grammar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
                  <span>Spelling</span>
                </button>
                <div class="fluent-group-col">
                  <button class="fluent-btn-small" id="btn-kinetic-word-count-btn" style="padding:0 6px;">123 Word Count</button>
                  <button class="fluent-btn-small" id="btn-kinetic-thesaurus" style="padding:0 6px;">📚 Thesaurus</button>
                </div>
              </div>
              <div class="fluent-group-label">Proofing</div>
            </div>
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <button class="fluent-btn-small" id="btn-kinetic-translate" style="padding:0 6px;">🌐 Translate</button>
                  <button class="fluent-btn-small" id="btn-kinetic-lang-set" style="padding:0 6px;">🗣 Language</button>
                </div>
              </div>
              <div class="fluent-group-label">Language</div>
            </div>
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-new-comment" title="New Comment">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/></svg>
                  <span>Comment</span>
                </button>
                <div class="fluent-group-col">
                  <button class="fluent-btn-small" id="btn-kinetic-prev-comment" style="padding:0 6px;">◀ Prev</button>
                  <button class="fluent-btn-small" id="btn-kinetic-next-comment" style="padding:0 6px;">Next ▶</button>
                </div>
              </div>
              <div class="fluent-group-label">Comments</div>
            </div>
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-accessibility" title="Accessibility Check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="4" r="2"/><path d="M12 6v6l3 3"/><path d="M6 8.5C7.5 7 9.5 6 12 6s4.5 1 6 2.5"/><path d="M9 21l3-6 3 6"/></svg>
                  <span>Check Access.</span>
                </button>
              </div>
              <div class="fluent-group-label">Accessibility</div>
            </div>

            <!-- Speech / Read Aloud Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-read-aloud" title="Read Slide Content &amp; Notes Aloud">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>Read Aloud</span>
                </button>
              </div>
              <div class="fluent-group-label">Speech</div>
            </div>
          </div>

          <!-- 3. DESIGN TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-design">
            <!-- Themes Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <select class="fluent-select-dark" id="kinetic-theme-picker" style="width:160px;">
                  <option value="theme-minimalist" selected>Minimalist White</option>
                  <option value="theme-sapphire">Sapphire Tech</option>
                  <option value="theme-emerald">Nordic Emerald</option>
                  <option value="theme-obsidian">Obsidian Executive</option>
                  <option value="theme-crimson">Crimson Sovereign</option>
                </select>
              </div>
              <div class="fluent-group-label">Themes</div>
            </div>

            <!-- Slide Ratio Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-small active" id="btn-ratio-16-9" title="16:9 Widescreen" style="width:auto; padding:0 8px;">16:9 Wide</button>
                <button class="fluent-btn-small" id="btn-ratio-4-3" title="4:3 Standard" style="width:auto; padding:0 8px;">4:3 Standard</button>
              </div>
              <div class="fluent-group-label">Slide Size</div>
            </div>

            <!-- Background Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <label class="fluent-btn-large ribbon-color-picker-wrap" title="Slide Background Color">
                  <div class="ribbon-color-indicator" id="indicator-kinetic-bg" style="background:#ffffff; width:22px; height:18px; border:1px solid #cbd5e1; border-radius:3px;"></div>
                  <span>BG Color</span>
                  <input type="color" class="ribbon-color-input" id="input-kinetic-bg" value="#ffffff">
                </label>
                <button class="fluent-btn-large" id="btn-kinetic-format-bg" title="Format Background: Gradients, Patterns, Wallpaper, Custom Colors">
                  <span style="font-size:16px;">🎨</span>
                  <span>Format BG</span>
                </button>
                <div class="fluent-group-row" style="margin-left:6px; gap:4px;">
                  <button class="kinetic-bg-preset-btn" data-bg="#ffffff" title="White Canvas" style="width:18px; height:18px; border-radius:50%; background:#ffffff; border:1px solid #71717a; cursor:pointer;"></button>
                  <button class="kinetic-bg-preset-btn" data-bg="#18181b" title="Obsidian Night" style="width:18px; height:18px; border-radius:50%; background:#18181b; border:1px solid #71717a; cursor:pointer;"></button>
                  <button class="kinetic-bg-preset-btn" data-bg="#0f172a" title="Slate Navy" style="width:18px; height:18px; border-radius:50%; background:#0f172a; border:1px solid #71717a; cursor:pointer;"></button>
                  <button class="kinetic-bg-preset-btn" data-bg="#fdfbf7" title="Warm Ivory" style="width:18px; height:18px; border-radius:50%; background:#fdfbf7; border:1px solid #71717a; cursor:pointer;"></button>
                  <button class="kinetic-bg-preset-btn" data-bg="#064e3b" title="Emerald Green" style="width:18px; height:18px; border-radius:50%; background:#064e3b; border:1px solid #71717a; cursor:pointer;"></button>
                  <button class="kinetic-bg-preset-btn" data-bg="#4c1d95" title="Royal Violet" style="width:18px; height:18px; border-radius:50%; background:#4c1d95; border:1px solid #71717a; cursor:pointer;"></button>
                </div>
              </div>
              <div class="fluent-group-label">Background</div>
            </div>
          </div>

          <!-- 4. TRANSITIONS TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-transitions">
            <!-- Preview Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-preview-trans" title="Preview Transition on Current Slide (P)">
                  <span style="font-size:16px;">▶</span>
                  <span>Preview</span>
                </button>
              </div>
              <div class="fluent-group-label">Preview</div>
            </div>

            <!-- Subtle Transitions Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-transition="none" style="width:auto; padding:0 6px;">None</button>
                    <button class="fluent-btn-small active" data-transition="fade" style="width:auto; padding:0 6px;">Fade</button>
                    <button class="fluent-btn-small" data-transition="push-left" style="width:auto; padding:0 6px;">Push Left →</button>
                    <button class="fluent-btn-small" data-transition="push-right" style="width:auto; padding:0 6px;">Push Right ←</button>
                  </div>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-transition="push-up" style="width:auto; padding:0 6px;">Push Up ↑</button>
                    <button class="fluent-btn-small" data-transition="push-down" style="width:auto; padding:0 6px;">Push Down ↓</button>
                    <button class="fluent-btn-small" data-transition="wipe-right" style="width:auto; padding:0 6px;">Wipe Right</button>
                    <button class="fluent-btn-small" data-transition="wipe-down" style="width:auto; padding:0 6px;">Wipe Down</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-label">Subtle &amp; Flow</div>
            </div>

            <!-- Dynamic & 3D Transitions Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-transition="zoom-in" style="width:auto; padding:0 6px; color:#38bdf8;">Zoom In</button>
                    <button class="fluent-btn-small" data-transition="zoom-out" style="width:auto; padding:0 6px; color:#38bdf8;">Zoom Out</button>
                    <button class="fluent-btn-small" data-transition="flip" style="width:auto; padding:0 6px; color:#ec4899;">3D Flip</button>
                  </div>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-transition="cube" style="width:auto; padding:0 6px; color:#a855f7;">3D Cube</button>
                    <button class="fluent-btn-small" data-transition="dissolve" style="width:auto; padding:0 6px; color:#10b981;">Dissolve</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-label">Dynamic &amp; 3D</div>
            </div>

            <!-- Timing Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row" style="align-items:center; gap:6px;">
                    <span style="font-size:10px; color:#94a3b8;">Duration:</span>
                    <select class="fluent-select-dark" id="kinetic-trans-speed" style="width:95px; font-size:10.5px;">
                      <option value="0.25s">Fast (0.25s)</option>
                      <option value="0.45s" selected>Normal (0.45s)</option>
                      <option value="0.8s">Slow (0.8s)</option>
                      <option value="1.2s">Cinematic (1.2s)</option>
                    </select>
                  </div>
                  <div class="fluent-group-row" style="align-items:center; gap:4px; margin-top:2px;">
                    <button class="fluent-btn-small" id="btn-kinetic-apply-all-trans" title="Apply Current Transition to All Slides" style="width:auto; padding:0 8px; font-size:10px; background:#2563eb; color:#fff; border-color:#1d4ed8;">
                      Apply to All Slides
                    </button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-label">Timing</div>
            </div>
          </div>

          <!-- ANIMATIONS TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-animations">
            <!-- Preview Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-anim-preview" title="Preview Animations on Current Slide">
                  <span style="font-size:16px;">▶</span>
                  <span>Preview</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Preview</div>
              </div>
            </div>

            <!-- Entrance Effects Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-anim-effect="none" title="None (Remove Animation)" style="width:auto; padding:0 6px;">None</button>
                    <button class="fluent-btn-small" data-anim-effect="k-fadeIn" data-anim-type="entrance" title="Fade In" style="width:auto; padding:0 6px; color:#22c55e;">★ Fade In</button>
                    <button class="fluent-btn-small" data-anim-effect="k-flyInUp" data-anim-type="entrance" title="Fly In Up" style="width:auto; padding:0 6px; color:#22c55e;">★ Fly In ↑</button>
                    <button class="fluent-btn-small" data-anim-effect="k-flyInLeft" data-anim-type="entrance" title="Fly In Left" style="width:auto; padding:0 6px; color:#22c55e;">★ Fly In →</button>
                  </div>
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-anim-effect="k-zoomIn" data-anim-type="entrance" title="Zoom In" style="width:auto; padding:0 6px; color:#22c55e;">★ Zoom In</button>
                    <button class="fluent-btn-small" data-anim-effect="k-bounceIn" data-anim-type="entrance" title="Bounce In" style="width:auto; padding:0 6px; color:#22c55e;">★ Bounce</button>
                    <button class="fluent-btn-small" data-anim-effect="k-wipeIn" data-anim-type="entrance" title="Wipe In" style="width:auto; padding:0 6px; color:#22c55e;">★ Wipe In</button>
                    <button class="fluent-btn-small" data-anim-effect="k-flipInX" data-anim-type="entrance" title="Flip In X" style="width:auto; padding:0 6px; color:#22c55e;">★ Flip In X</button>
                    <button class="fluent-btn-small" data-anim-effect="k-spinIn" data-anim-type="entrance" title="Spin In" style="width:auto; padding:0 6px; color:#22c55e;">★ Spin In</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Entrance</div>
              </div>
            </div>

            <!-- Emphasis Effects Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-anim-effect="k-pulse" data-anim-type="emphasis" title="Pulse" style="width:auto; padding:0 6px; color:#eab308;">★ Pulse</button>
                    <button class="fluent-btn-small" data-anim-effect="k-spin" data-anim-type="emphasis" title="Spin 360" style="width:auto; padding:0 6px; color:#eab308;">★ Spin 360°</button>
                    <button class="fluent-btn-small" data-anim-effect="k-teeter" data-anim-type="emphasis" title="Teeter" style="width:auto; padding:0 6px; color:#eab308;">★ Teeter</button>
                    <button class="fluent-btn-small" data-anim-effect="k-waveFloat" data-anim-type="emphasis" title="Wave Float" style="width:auto; padding:0 6px; color:#eab308;">★ Wave</button>
                    <button class="fluent-btn-small" data-anim-effect="k-growShrink" data-anim-type="emphasis" title="Grow/Shrink" style="width:auto; padding:0 6px; color:#eab308;">★ Grow</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Emphasis</div>
              </div>
            </div>

            <!-- Exit Effects Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" data-anim-effect="k-fadeOut" data-anim-type="exit" title="Fade Out" style="width:auto; padding:0 6px; color:#ef4444;">★ Fade Out</button>
                    <button class="fluent-btn-small" data-anim-effect="k-flyOutDown" data-anim-type="exit" title="Fly Out Down" style="width:auto; padding:0 6px; color:#ef4444;">★ Fly Out ↓</button>
                    <button class="fluent-btn-small" data-anim-effect="k-zoomOut" data-anim-type="exit" title="Zoom Out" style="width:auto; padding:0 6px; color:#ef4444;">★ Zoom Out</button>
                    <button class="fluent-btn-small" data-anim-effect="k-slideOutRight" data-anim-type="exit" title="Slide Out Right" style="width:auto; padding:0 6px; color:#ef4444;">★ Slide Out →</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Exit</div>
              </div>
            </div>

            <!-- Timing Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row" style="align-items:center; gap:4px;">
                    <span style="font-size:10px; color:#94a3b8;">Start:</span>
                    <select class="fluent-select-dark" id="kinetic-anim-trigger" style="width:105px; font-size:10.5px;">
                      <option value="onClick" selected>On Click</option>
                      <option value="withPrev">With Previous</option>
                      <option value="afterPrev">After Previous</option>
                    </select>
                  </div>
                  <div class="fluent-group-row" style="align-items:center; gap:4px;">
                    <span style="font-size:10px; color:#94a3b8;">Duration:</span>
                    <select class="fluent-select-dark" id="kinetic-anim-duration" style="width:95px; font-size:10.5px;">
                      <option value="0.3">Fast (0.3s)</option>
                      <option value="0.6" selected>Normal (0.6s)</option>
                      <option value="1.0">Slow (1.0s)</option>
                      <option value="2.0">Very Slow (2s)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Timing</div>
              </div>
            </div>

            <!-- Advanced Group: Animation Pane Sidebar Toggle -->
            <div class="fluent-ribbon-group" style="border-right:none;">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-toggle-anim-pane" title="Open Office Animation Pane Sidebar">
                  <span style="font-size:16px;">📑</span>
                  <span>Animation Pane</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Advanced</div>
              </div>
            </div>
          </div>

          <!-- 5. SLIDE SHOW TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-slideshow">
            <!-- Start Show Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-present-start" title="From Beginning (F5)">
                  <span style="font-size:16px;">▶</span>
                  <span>From Start</span>
                </button>
                <button class="fluent-btn-large" id="btn-present-current" title="From Current Slide (Shift+F5)">
                  <span style="font-size:16px;">⏵</span>
                  <span>From Current</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-presenter-view" title="Presenter View (Dual Screen / Notes Console)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="13" height="11" rx="1"/><rect x="17" y="3" width="5" height="5" rx="1"/><rect x="17" y="10" width="5" height="4" rx="1"/><line x1="2" y1="18" x2="22" y2="18"/></svg>
                  <span>Presenter View</span>
                </button>
              </div>
              <div class="fluent-group-label">Start Slide Show</div>
            </div>

            <!-- Rehearsal & Recording Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-rehearse-timings" title="Rehearse Timings: Practice presentation & record timing for each slide">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Rehearse</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-record-presentation" title="Record Presentation: Record narration, slide timings & audio notes" style="color:#ef4444;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="#ef4444"/></svg>
                  <span style="color:#ef4444; font-weight:700;">Record</span>
                </button>
              </div>
              <div class="fluent-group-label">Record &amp; Timings</div>
            </div>

            <!-- Presenter Options Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                    <input type="checkbox" id="chk-kinetic-laser"> Laser Pointer
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                    <input type="checkbox" id="chk-kinetic-timer" checked> Presenter Timer
                  </label>
                </div>
              </div>
              <div class="fluent-group-label">Presenter Tools</div>
            </div>
          </div>

          <!-- 6. VIEW TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-view">
            <!-- Master Views Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-slide-master" title="Slide Master: Customize universal template, header fonts & footer across all slides">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="6" y1="7" x2="18" y2="7"/><line x1="6" y1="10" x2="14" y2="10"/></svg>
                  <span>Slide Master</span>
                </button>
              </div>
              <div class="fluent-group-label">Master Views</div>
            </div>

            <!-- Presentation Views Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large active" id="btn-view-notes" title="Toggle Speaker Notes Drawer">
                  <span style="font-size:16px;">📝</span>
                  <span>Notes</span>
                </button>
                <div class="fluent-group-col">
                  <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                    <input type="checkbox" id="chk-kinetic-slide-num" checked> Slide Numbers
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                    <input type="checkbox" id="chk-kinetic-gridlines"> Gridlines
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                    <input type="checkbox" id="chk-kinetic-guides"> Guides
                  </label>
                </div>
              </div>
              <div class="fluent-group-label">Show / Hide</div>
            </div>

            <!-- Zoom Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col" style="justify-content:center;">
                  <span style="font-size:10px; color:#a1a1aa;">Zoom:</span>
                  <select class="fluent-select-dark" id="kinetic-zoom-select" style="width:80px;">
                    <option value="0.75">75%</option>
                    <option value="0.9">90%</option>
                    <option value="1" selected>100%</option>
                    <option value="1.15">115%</option>
                    <option value="1.25">125%</option>
                  </select>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Zoom</div>
              </div>
            </div>
          </div>

          <!-- 7. HELP TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-kinetic-help">
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-help-center" title="Help Center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>Help</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-shortcuts-btn" title="Keyboard Shortcuts">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>
                  <span>Shortcuts</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Help</div>
              </div>
            </div>
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-kinetic-whats-new" title="What's New in Giri Kinetic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>What's New</span>
                </button>
                <button class="fluent-btn-large" id="btn-kinetic-feedback-btn" title="Send Feedback">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  <span>Feedback</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Community</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Split Body: Left Slide Thumbnails + Center 16:9 Canvas + Bottom Speaker Notes -->
      <div class="kinetic-split-body">
        <!-- Left Thumbnail Sidebar -->
        <aside class="kinetic-slide-nav" id="kinetic-slide-nav">
          <!-- Slide Thumbnails dynamically generated -->
        </aside>

        <!-- Center Slide Canvas Viewport -->
        <div class="kinetic-stage-viewport" id="kinetic-stage-viewport">
          <article class="kinetic-slide-frame" id="kinetic-active-slide">
            <div class="slide-canvas-art" id="slide-canvas-art"></div>
            <div class="slide-header-zone">
              <div class="slide-tag-pill" id="slide-tag" contenteditable="true" spellcheck="false">ARCHITECTURE 01</div>
              <h1 class="slide-h1-editable" id="slide-title" contenteditable="true" spellcheck="false">Title</h1>
              <p class="slide-p-editable" id="slide-desc" contenteditable="true" spellcheck="false">Description</p>
            </div>

            <!-- Interactive Element Nodes Grid -->
            <div class="slide-cards-grid" id="slide-nodes-grid">
              <!-- Dynamically populated -->
            </div>

            <!-- Slide Canvas Floating Shapes & Objects Container -->
            <div id="slide-canvas-objects" style="position:absolute; inset:0; pointer-events:none;"></div>

            <!-- Alignment Gridlines & Center Guides Overlays -->
            <div id="kinetic-grid-overlay" style="display:none; position:absolute; inset:0; pointer-events:none; z-index:4; background-size:32px 32px; background-image:radial-gradient(circle, rgba(148,163,184,0.45) 1.2px, transparent 1.2px);"></div>
            <div id="kinetic-guides-overlay" style="display:none; position:absolute; inset:0; pointer-events:none; z-index:4;">
              <div style="position:absolute; top:50%; left:0; right:0; height:1px; border-top:1px dashed #0284c7; opacity:0.85;"></div>
              <div style="position:absolute; left:50%; top:0; bottom:0; width:1px; border-left:1px dashed #0284c7; opacity:0.85;"></div>
            </div>

            <div class="presenter-progress-bar" id="presenter-progress" style="width: 25%;"></div>
            <div id="kinetic-slide-number-indicator" style="position:absolute; bottom:14px; right:20px; font-size:11px; font-weight:600; color:var(--text-muted);">1</div>
          </article>

          <!-- Collapsible Speaker Notes Drawer -->
          <div class="kinetic-speaker-notes-drawer" id="kinetic-notes-drawer">
            <div style="display:flex; align-items:center; justify-content:space-between; font-size:11px; font-weight:700; color:var(--text-secondary);">
              <span>SPEAKER NOTES (CURRENT SLIDE)</span>
              <span style="font-size:10.5px; color:var(--text-muted);">Visible in Presenter View Only</span>
            </div>
            <textarea id="kinetic-slide-notes-input" placeholder="Click to add speaker notes for this slide..."></textarea>
          </div>

          <!-- Mobile Touch Navigation Pill -->
          <div class="kinetic-mobile-slide-nav-pill" id="kinetic-mobile-slide-nav-pill" style="display:none; position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.92); backdrop-filter:blur(8px); border:1px solid #334155; border-radius:24px; padding:4px 10px; gap:8px; align-items:center; z-index:100; box-shadow:0 4px 16px rgba(0,0,0,0.4); font-size:11.5px; color:#f8fafc; user-select:none; white-space:nowrap;">
            <button id="btn-kinetic-mobile-prev" style="background:none;border:none;color:#38bdf8;font-size:14px;cursor:pointer;padding:2px 4px;">◀</button>
            <span id="kinetic-mobile-slide-num" style="font-weight:700; font-family:var(--font-mono); font-size:11px;">1 / 1</span>
            <button id="btn-kinetic-mobile-next" style="background:none;border:none;color:#38bdf8;font-size:14px;cursor:pointer;padding:2px 4px;">▶</button>
            <button id="btn-kinetic-mobile-add" title="Add Slide" style="background:#334155;color:#ffffff;border:none;border-radius:12px;padding:3px 7px;font-size:10px;font-weight:700;cursor:pointer;">+ Slide</button>
            <button id="btn-kinetic-mobile-present" style="background:#2563eb;color:#ffffff;border:none;border-radius:12px;padding:3px 8px;font-size:10px;font-weight:700;cursor:pointer;">▶ Show</button>
          </div>
        </div>

        <!-- Right Animation Pane Sidebar -->
        <aside class="kinetic-animation-pane-sidebar" id="kinetic-animation-pane" style="display:none;">
          <div class="kinetic-anim-pane-header">
            <span class="kinetic-anim-pane-title">
              <span>✨</span>
              <span>Animation Pane</span>
            </span>
            <button class="kinetic-anim-pane-close" id="btn-close-anim-pane" title="Close Animation Pane">✕</button>
          </div>
          <div class="kinetic-anim-list" id="kinetic-anim-list">
            <!-- Dynamically populated with slide.animations -->
          </div>
          <div class="kinetic-anim-pane-actions">
            <button class="fluent-btn-small" id="btn-anim-play-all" title="Play All Animations">▶ Play</button>
            <div style="display:flex; gap:4px;">
              <button class="fluent-btn-small" id="btn-anim-move-up" title="Move Earlier">▲</button>
              <button class="fluent-btn-small" id="btn-anim-move-down" title="Move Later">▼</button>
              <button class="fluent-btn-small" id="btn-anim-remove-sel" title="Remove Selected Animation" style="color:#ef4444;">✕</button>
            </div>
          </div>
        </aside>
        <!-- Giri Kinetic Right Sidebar Deck -->
        ${orbitDesktopSuite.renderSidebarDeck('kinetic')}
      </div>

      <!-- Giri Kinetic Bottom Status Bar -->
      ${orbitDesktopSuite.renderStatusBar('kinetic', { totalSlides: slidesData.length })}

      <!-- Presenter Station HUD & Fullscreen Overlay -->
      <div class="presenter-fullscreen-overlay" id="presenter-overlay">
        <!-- Overlay slide viewport -->
        <div id="presenter-slide-mount" style="width:90vw; max-width:1280px; height:80vh; display:flex; align-items:center; justify-content:center;">
          <!-- Cloned active slide will display here -->
        </div>

        <!-- Floating HUD Bar -->
        <div class="presenter-hud-controls">
          <button class="ribbon-btn" id="btn-hud-prev" style="color:#ffffff;">◀ Prev</button>
          <span id="hud-slide-stepper" style="font-family:var(--font-mono); font-size:12px; font-weight:700;">1 / 4</span>
          <button class="ribbon-btn" id="btn-hud-next" style="color:#ffffff;">Next ▶</button>
          <div style="width:1px; height:16px; background:rgba(255,255,255,0.2);"></div>
          <span id="hud-timer" style="font-family:var(--font-mono); font-size:12px; color:#38bdf8;">00:00</span>
          <button class="ribbon-btn" id="btn-hud-laser" style="color:#ffffff;" title="Toggle Laser Pointer">🔴 Laser</button>
          <button class="ribbon-btn" id="btn-hud-pen" style="color:#ffffff;" title="Toggle Live Drawing Pen">✏️ Pen</button>
          <button class="ribbon-btn" id="btn-hud-clear-pen" style="color:#ffffff;" title="Clear Pen Drawings">🧹 Clear</button>
          <button class="ribbon-btn" id="btn-hud-exit" style="color:#f87171;" title="Exit Presentation (Esc)">✕ Exit</button>
        </div>
      </div>

      <!-- Laser Pointer Dot -->
      <div class="presenter-laser-dot" id="presenter-laser-dot"></div>

      <!-- Kinetic Shortcuts Modal -->
      <div class="office-modal-backdrop" id="kinetic-shortcuts-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:480px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">⌨ Kinetic Presentation Shortcuts</span>
            <button class="esc-kbd" id="btn-close-kinetic-shortcuts">ESC</button>
          </div>
          <div class="office-dialog-body" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12px;">
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Start Slide Show</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">F5</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>From Current Slide</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Shift+F5</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Duplicate Slide</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+D</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>New Slide</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+M</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Laser Pointer</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+L</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Exit Show</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Esc</kbd>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="btn-giri-primary" id="btn-ok-kinetic-shortcuts" style="padding:7px 18px; font-size:12px;">Close</button>
          </div>
        </div>
      </div>

      <!-- Girionix AI Presentation Studio Modal -->
      <div class="orbit-ai-modal-backdrop" id="kinetic-ai-studio-modal" aria-hidden="true">
        <div class="orbit-ai-modal-card" role="dialog" aria-modal="true" aria-label="Girionix AI Presentation Studio">
          <div class="orbit-ai-modal-header">
            <div class="orbit-ai-header-left">
              <span class="orbit-ai-brand-badge" style="background:linear-gradient(135deg, #a855f7, #ec4899);">⚡</span>
              <div class="orbit-ai-title-group">
                <h3>Girionix AI Presentation Studio <span class="girionix-status-badge" style="font-size:10px; margin-left:4px;" id="kinetic-ai-slide-badge">Slide 1</span></h3>
                <p>Autonomous slide deck generation, executive strategic diagrams, and slide polishing</p>
              </div>
            </div>
            <button class="orbit-ai-close-btn" id="btn-close-kinetic-ai-modal" title="Close (ESC)">✕</button>
          </div>

          <div class="orbit-ai-modal-body">
            <!-- Mode Selector -->
            <div class="orbit-ai-chips-row" style="margin-bottom:2px;">
              <button class="orbit-ai-chip active" id="kinetic-ai-tab-deck">✨ 5-Slide Pitch Deck</button>
              <button class="orbit-ai-chip" id="kinetic-ai-tab-slide">📊 Strategic Diagram Slide</button>
              <button class="orbit-ai-chip" id="kinetic-ai-tab-polish">✍️ Polish Current Slide</button>
            </div>

            <!-- Tab 1: 5-Slide Pitch Deck Generator -->
            <div id="kinetic-ai-deck-section">
              <div class="orbit-ai-input-wrap">
                <input type="text" id="kinetic-ai-deck-topic" placeholder="e.g. 'Enterprise Sovereign Cloud AI', 'Series A Fundraise', 'Supply Chain 2027'..." spellcheck="false">
                <button class="orbit-ai-generate-btn" id="btn-kinetic-ai-generate-deck" style="background:#a855f7;">
                  <span>Generate Deck ⚡</span>
                </button>
              </div>

              <!-- Topic Presets -->
              <div style="margin-top:10px;">
                <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:6px;">Executive Deck Presets:</div>
                <div class="orbit-ai-chips-row" id="kinetic-ai-deck-presets">
                  <button class="orbit-ai-chip" data-topic="Enterprise Sovereign AI &amp; Local Security">🏢 Enterprise AI</button>
                  <button class="orbit-ai-chip" data-topic="Series A Tech Investment Pitch">🚀 Series A Pitch</button>
                  <button class="orbit-ai-chip" data-topic="Q4 Business Operations &amp; Growth Roadmap">📈 Q4 Growth Review</button>
                  <button class="orbit-ai-chip" data-topic="Zero-Trust Cybersecurity Architecture">🔒 Zero-Trust Security</button>
                  <button class="orbit-ai-chip" data-topic="Global SaaS Product Launch 2026">🌐 Global SaaS Launch</button>
                </div>
              </div>

              <!-- Deck Preview Cards List -->
              <div style="margin-top:12px;" id="kinetic-ai-deck-preview-wrap">
                <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:6px;">Deck Structure Preview:</div>
                <div style="display:flex; flex-direction:column; gap:6px;" id="kinetic-ai-deck-preview-list">
                  <div style="padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>1. Vision &amp; Thesis</strong> — Title &amp; Subtitle Slide</span>
                    <span style="font-size:10px; background:#ede9fe; color:#7c3aed; padding:2px 6px; border-radius:4px; font-weight:700;">Title</span>
                  </div>
                  <div style="padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>2. Core Problem &amp; Opportunity</strong> — Split View</span>
                    <span style="font-size:10px; background:#e0f2fe; color:#0284c7; padding:2px 6px; border-radius:4px; font-weight:700;">Split</span>
                  </div>
                  <div style="padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>3. Strategic SWOT Matrix</strong> — 2x2 Competitive Quadrants</span>
                    <span style="font-size:10px; background:#dcfce7; color:#15803d; padding:2px 6px; border-radius:4px; font-weight:700;">SWOT</span>
                  </div>
                  <div style="padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>4. Execution Roadmap</strong> — 4-Stage Chevron Process Flow</span>
                    <span style="font-size:10px; background:#fef3c7; color:#b45309; padding:2px 6px; border-radius:4px; font-weight:700;">Chevron</span>
                  </div>
                  <div style="padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>5. Impact &amp; ROI Benchmarks</strong> — Key Metrics Callouts</span>
                    <span style="font-size:10px; background:#fae8ff; color:#a21caf; padding:2px 6px; border-radius:4px; font-weight:700;">Metrics</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab 2: Insert Strategic Diagram Slide -->
            <div id="kinetic-ai-slide-section" style="display:none;">
              <div style="font-size:12px; color:#64748b; margin-bottom:10px;">Select an executive diagram layout to generate and insert after the active slide:</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button class="orbit-ai-btn-secondary btn-kinetic-insert-preset" data-layout="swot-matrix" style="text-align:left; padding:12px; display:flex; flex-direction:column; gap:4px;">
                  <strong style="color:#0f172a; font-size:12.5px;">🎯 Strategic SWOT Matrix</strong>
                  <span style="font-size:11px; color:#64748b;">4-quadrant internal strengths, weaknesses, opportunities &amp; threats</span>
                </button>
                <button class="orbit-ai-btn-secondary btn-kinetic-insert-preset" data-layout="chevron-flow" style="text-align:left; padding:12px; display:flex; flex-direction:column; gap:4px;">
                  <strong style="color:#0f172a; font-size:12.5px;">⏩ 4-Phase Chevron Flow</strong>
                  <span style="font-size:11px; color:#64748b;">Step-by-step horizontal roadmap from discovery to deployment</span>
                </button>
                <button class="orbit-ai-btn-secondary btn-kinetic-insert-preset" data-layout="metrics" style="text-align:left; padding:12px; display:flex; flex-direction:column; gap:4px;">
                  <strong style="color:#0f172a; font-size:12.5px;">📊 Key Performance Metrics</strong>
                  <span style="font-size:11px; color:#64748b;">3 high-impact stat callouts with delta percentage uplifts</span>
                </button>
                <button class="orbit-ai-btn-secondary btn-kinetic-insert-preset" data-layout="comparison-table" style="text-align:left; padding:12px; display:flex; flex-direction:column; gap:4px;">
                  <strong style="color:#0f172a; font-size:12.5px;">⚖️ Solution Comparison</strong>
                  <span style="font-size:11px; color:#64748b;">Multi-tier side-by-side feature and capability matrix</span>
                </button>
              </div>
            </div>

            <!-- Tab 3: Polish Current Slide -->
            <div id="kinetic-ai-polish-section" style="display:none;">
              <div style="padding:10px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; margin-bottom:12px;">
                <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Active Slide Content:</div>
                <div id="kinetic-ai-current-slide-preview" style="font-size:12.5px; color:#0f172a; line-height:1.4;"></div>
              </div>
              <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:6px;">Choose Enhancement Tone:</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="orbit-ai-btn-secondary btn-kinetic-polish-action" data-action="executive" style="text-align:left; padding:10px;">
                  <strong>👔 Executive Polish</strong>
                  <div style="font-size:11px; color:#64748b;">High-level C-suite clarity and authoritative tone</div>
                </button>
                <button class="orbit-ai-btn-secondary btn-kinetic-polish-action" data-action="pitch" style="text-align:left; padding:10px;">
                  <strong>🚀 Investor Pitch</strong>
                  <div style="font-size:11px; color:#64748b;">Emphasize market scale, ROI, and competitive moat</div>
                </button>
                <button class="orbit-ai-btn-secondary btn-kinetic-polish-action" data-action="concise" style="text-align:left; padding:10px;">
                  <strong>⚡ Make Punchy &amp; Concise</strong>
                  <div style="font-size:11px; color:#64748b;">Remove redundant filler words for maximum legibility</div>
                </button>
                <button class="orbit-ai-btn-secondary btn-kinetic-polish-action" data-action="grammar" style="text-align:left; padding:10px;">
                  <strong>✓ Grammar &amp; Mechanics</strong>
                  <div style="font-size:11px; color:#64748b;">Flawless typography and punctuation correction</div>
                </button>
              </div>
            </div>
          </div>

          <div class="orbit-ai-modal-footer">
            <div class="orbit-ai-footer-left">
              <span>⚡ Sovereign Kinetic Engine • Client Parity</span>
            </div>
            <div class="orbit-ai-footer-right">
              <button class="orbit-ai-btn-secondary" id="btn-kinetic-ai-dismiss">Dismiss</button>
              <button class="orbit-ai-btn-primary" id="btn-kinetic-ai-action-primary" style="background:#a855f7; border-color:#9333ea;">⚡ Apply to Presentation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initKineticWorkspace(container, slidesData, currentSlideIndex, currentTheme, currentTransition, aspectRatio, onDeckUpdate);
}

function initKineticWorkspace(container, slidesData, currentSlideIndex, currentTheme, currentTransition, aspectRatio, onDeckUpdate) {
  // Giri Kinetic Desktop Suite Event Binding
  orbitDesktopSuite.bindEvents(container, 'kinetic', {
    onNew: () => mountKineticEditor(container, 'blank', onDeckUpdate),
    onOpen: () => container.querySelector('#btn-kinetic-open-deck')?.click(),
    onSave: () => saveDeck(),
    onSaveDevice: () => container.querySelector('#file-menu-save-device')?.click() || container.querySelector('#btn-kinetic-save-device')?.click(),
    onExportPdf: () => container.querySelector('#btn-kinetic-export-pdf')?.click() || window.print(),
    onAddSlide: () => container.querySelector('#btn-quick-new-slide')?.click() || container.querySelector('#btn-insert-new-slide')?.click(),
    onSelectSlide: (idx) => {
      const thumbs = container.querySelectorAll('.slide-thumb-card');
      if (thumbs[idx]) thumbs[idx].click();
    },
    onSlideShow: () => {
      container.querySelector('#btn-quick-present')?.click() || container.querySelector('#btn-present-start')?.click();
    },
    onZoom: (val) => {
      const scale = parseInt(val, 10) / 100;
      const sf = container.querySelector('#kinetic-active-slide');
      if (sf) { sf.style.transform = `scale(${scale})`; sf.style.transformOrigin = 'center center'; }
    },
    onUiToggle: (mode) => {
      container.classList.remove('orbit-ui-standard', 'orbit-ui-notebookbar');
      container.classList.add(`orbit-ui-${mode}`);
    }
  });
  const navSidebar = container.querySelector('#kinetic-slide-nav');
  const slideFrame = container.querySelector('#kinetic-active-slide');
  const tagEl = container.querySelector('#slide-tag');
  const titleEl = container.querySelector('#slide-title');
  const descEl = container.querySelector('#slide-desc');
  const nodesGrid = container.querySelector('#slide-nodes-grid');
  const progressBar = container.querySelector('#presenter-progress');
  const slideNumIndicator = container.querySelector('#kinetic-slide-number-indicator');
  const notesDrawer = container.querySelector('#kinetic-notes-drawer');
  const notesInput = container.querySelector('#kinetic-slide-notes-input');
  const objectsContainer = container.querySelector('#slide-canvas-objects');
  const ribbonTabs = container.querySelectorAll('.fluent-tab-btn[data-tab]');
  const ribbonPanes = container.querySelectorAll('.fluent-ribbon-pane');
  const fileMenuBtn = container.querySelector('#btn-kinetic-file-menu');
  const fileMenuDropdown = container.querySelector('#kinetic-file-menu-dropdown');

  // File menu dropdown toggle
  fileMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileMenuDropdown?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!fileMenuDropdown?.contains(e.target) && e.target !== fileMenuBtn) {
      fileMenuDropdown?.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fileMenuDropdown?.classList.remove('open');
  });

  fileMenuDropdown?.querySelectorAll('.file-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      fileMenuDropdown.classList.remove('open');
      switch (action) {
        case 'ai-agent':
          if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
            window.orbitPlatform.openGirionixAgent('kinetic');
          } else if (window.orbitAgent) {
            window.orbitAgent.openAgent('kinetic');
          }
          break;
        case 'drive-sync':
          window.orbitDriveSync?.openDriveModal('browser', 'kinetic');
          break;
        case 'save-device':
          performKineticDirectSave(true);
          break;
        case 'open-device':
          performKineticDirectOpen();
          break;
        case 'new':
          if (confirm('Create a new blank presentation?')) {
            slidesData = [{ id: 1, layout: 'title', tag: 'TITLE 01', title: 'New Presentation', desc: 'Presentation subtitle', features: [], notes: '' }];
            currentSlideIndex = 0;
            renderNavThumbnails();
            renderActiveSlide();
            saveDeck();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Created new presentation');
          }
          break;
        case 'open':
          container.querySelector('#kinetic-img-file-input')?.click();
          break;
        case 'share': {
          const url = window.orbitPlatform ? window.orbitPlatform.getToolUrl('kinetic') : `${window.location.origin}/#kinetic`;
          navigator.clipboard?.writeText(url);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Copied direct link to Giri Kinetic: ${url}`);
          break;
        }
        case 'copy':
          const copyKey = 'giri_orbit_kinetic_copy_' + Date.now();
          localStorage.setItem(copyKey, JSON.stringify(slidesData));
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Created local duplicate presentation');
          break;
        case 'export':
          if (window.orbitPlatform) window.orbitPlatform.openExportModal('kinetic');
          break;
        case 'print':
          if (window.orbitPlatform?.printManager) { window.orbitPlatform.printManager.open('kinetic'); } else { window.print(); }
          break;
        case 'rename': {
          const newName = prompt('Enter presentation title:', slidesData[0]?.title || 'Strategy Presentation');
          if (newName && newName.trim()) {
            slidesData[0].title = newName.trim();
            renderActiveSlide();
            saveDeck();
          }
          break;
        }
        case 'history':
          alert('Version History: Sovereign snapshot saved at ' + new Date().toLocaleTimeString());
          break;
        case 'delete':
          if (confirm('Reset presentation?')) {
            localStorage.removeItem('giri_orbit_kinetic_deck');
            slidesData = [{ id: 1, layout: 'title', tag: 'TITLE 01', title: 'New Presentation', desc: '', features: [], notes: '' }];
            currentSlideIndex = 0;
            renderNavThumbnails();
            renderActiveSlide();
            saveDeck();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Presentation reset.');
          }
          break;
        case 'info':
          alert(`Giri Kinetic Presentation Info:\nTotal Slides: ${slidesData.length}\nAspect Ratio: ${aspectRatio}\nTheme: ${currentTheme}\nStorage: Sovereign Zero-DB`);
          break;
      }
    });
  });

  container.querySelector('#btn-kinetic-autosave-toggle')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.toggleAutoSave === 'function') {
      window.orbitPlatform.toggleAutoSave();
    }
  });

  container.querySelector('#btn-kinetic-special-link')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.generateSpecialDocLink === 'function') {
      const link = window.orbitPlatform.generateSpecialDocLink('kinetic');
      window.orbitPlatform.openShareModal(link, 'kinetic');
    }
  });

  container.querySelector('#btn-kinetic-share')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.copyToolLink === 'function') {
      window.orbitPlatform.copyToolLink('kinetic');
    } else {
      const url = `${window.location.origin}${window.location.pathname}#kinetic`;
      navigator.clipboard?.writeText(url);
      if (window.orbitPlatform) window.orbitPlatform.showToast('Copied link to clipboard', 'red');
    }
  });

  // Direct Local Disk Save & Sync (FSA API)
  const kineticSaveDeviceBtn = container.querySelector('#btn-kinetic-save-device');
  const kineticSyncStatusText = container.querySelector('#txt-kinetic-sync-status');

  const performKineticDirectSave = async (forcePicker = false) => {
    saveDeck();
    const currentTitle = slidesData[0]?.title || 'Presentation';
    const formattedDeck = GiriOfficeFormats.formatGKinetic({
      slidesData,
      title: currentTitle
    });
    const res = await localSync.saveToDevice({
      tool: 'kinetic',
      content: formattedDeck,
      suggestedName: currentTitle.replace(/[^a-zA-Z0-9_-]/g, '_'),
      extension: 'gkinetic',
      mimeType: 'application/vnd.ms-powerpoint',
      forcePicker
    });
    if (res.success && res.mode === 'direct' && kineticSyncStatusText) {
      kineticSyncStatusText.textContent = `● ${res.name.slice(0, 12)}`;
      if (kineticSaveDeviceBtn) kineticSaveDeviceBtn.style.background = '#047857';
    }
  };

  const performKineticDirectOpen = async () => {
    const res = await localSync.openFromDevice({
      tool: 'kinetic',
      acceptTypes: {
        'application/vnd.ms-powerpoint': ['.gkinetic', '.giri', '.html'],
        'application/x-giri-universal-office': ['.giri'],
        'application/json': ['.json']
      }
    });
    if (res && res.content) {
      try {
        const parsed = (GiriOfficeFormats.parseUniversalGiri && GiriOfficeFormats.parseUniversalGiri(res.content)) || GiriOfficeFormats.parseGKinetic(res.content);
        if (parsed && parsed.tools && parsed.tools.kinetic) parsed.slides = parsed.tools.kinetic;
        if (Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          slidesData = parsed.slides;
          currentSlideIndex = 0;
          renderNavThumbnails();
          renderActiveSlide();
          saveDeck();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Loaded "${res.name}" (Universal Office & Impress Parity)`);
        }
      } catch (err) {
        alert('Invalid presentation file format.');
      }
    }
  };

  kineticSaveDeviceBtn?.addEventListener('click', () => performKineticDirectSave(false));
  container.querySelector('#file-menu-kinetic-save-device')?.addEventListener('click', () => performKineticDirectSave(true));
  container.querySelector('#file-menu-kinetic-open-device')?.addEventListener('click', () => performKineticDirectOpen());
  container.querySelector('#btn-kinetic-drive-sync')?.addEventListener('click', () => {
    window.orbitDriveSync?.openDriveModal('browser', 'kinetic');
  });
  container.querySelector('#file-menu-kinetic-drive-sync')?.addEventListener('click', () => {
    window.orbitDriveSync?.openDriveModal('browser', 'kinetic');
  });

  localSync.subscribe((tool, fileName, handle) => {
    if (tool === 'kinetic' && kineticSyncStatusText) {
      if (fileName) {
        kineticSyncStatusText.textContent = `● ${fileName.slice(0, 12)}`;
        if (kineticSaveDeviceBtn) kineticSaveDeviceBtn.style.background = '#047857';
      } else {
        kineticSyncStatusText.textContent = 'Save to Device';
        if (kineticSaveDeviceBtn) kineticSaveDeviceBtn.style.background = '#059669';
      }
    }
  });
  
  // Fullscreen HUD elements
  const presenterOverlay = container.querySelector('#presenter-overlay');
  const presenterSlideMount = container.querySelector('#presenter-slide-mount');
  const laserDot = container.querySelector('#presenter-laser-dot');
  const hudPrev = container.querySelector('#btn-hud-prev');
  const hudNext = container.querySelector('#btn-hud-next');
  const hudStepper = container.querySelector('#hud-slide-stepper');
  const hudTimer = container.querySelector('#hud-timer');
  const hudLaser = container.querySelector('#btn-hud-laser');
  const hudExit = container.querySelector('#btn-hud-exit');

  let isPresenting = false;
  let laserActive = false;
  let timerInterval = null;
  let timerSeconds = 0;

  // Ribbon Tab Switching
  ribbonTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      ribbonTabs.forEach(b => b.classList.remove('active'));
      ribbonPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = container.querySelector(`#pane-kinetic-${btn.dataset.tab}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  function saveDeck() {
    localStorage.setItem('giri_orbit_kinetic_deck', JSON.stringify(slidesData));
    if (typeof window !== 'undefined' && window.giriSyncManager) {
      const slideCount = Array.isArray(slidesData) ? slidesData.length : 0;
      const title = localStorage.getItem('giri_orbit_kinetic_title') || slidesData[0]?.title || 'Cinematic Presentation Deck';
      const snippet = slidesData[0]?.desc || slidesData[0]?.subtitle || 'Widescreen presentation slides in Giri Kinetic.';
      window.giriSyncManager.recordSync('kinetic', slidesData, title, {
        snippet,
        stats: `${slideCount} Slides • 16:9 Widescreen • Animations`
      });
    }
    if (typeof window !== 'undefined') {
      const title = localStorage.getItem('giri_orbit_kinetic_title') || slidesData[0]?.title || 'Cinematic Presentation Deck';
      window.dispatchEvent(new CustomEvent('orbit:document-edit', {
        detail: { tool: 'kinetic', content: JSON.stringify(slidesData), title: title }
      }));
    }
    if (onDeckUpdate) onDeckUpdate();
  }

  function getThumbIcon(layout) {
    const m = { 'title':'▬','circular-loop':'⭕','chevron-flow':'➤','swot-matrix':'⊞','milestone-journey':'⤳','pyramid-hierarchy':'△','funnel-stages':'▽','radial-cycle':'◎','comparison-table':'≡','metrics':'▦','columns':'▪','blank':'▭','zigzag-process':'⬡' };
    return m[layout] || '▭';
  }

  function renderThumbnails() {
    navSidebar.innerHTML = '';
    slidesData.forEach((slide, idx) => {
      const isActive = idx === currentSlideIndex;
      const theme = resolveSlideTheme(slide);
      const accent = theme.accent;
      const rawBg = theme.bg;
      const isDark = rawBg.includes('gradient') || rawBg === '#18181b' || rawBg === '#0f172a' || rawBg === '#09090b' || rawBg === '#000000' || rawBg.startsWith('#0') || rawBg.startsWith('#1') || rawBg.startsWith('#2');
      const textColor = isDark ? 'rgba(255,255,255,0.92)' : '#0f172a';
      const title = (slide.title || 'Untitled').replace(/</g,'&lt;').slice(0, 24);
      const tag = (slide.tag || '').replace(/</g,'&lt;').slice(0, 16);
      const nodeCount = slide.features?.length || 0;
      const icon = getThumbIcon(slide.layout || 'title');

      const thumb = document.createElement('div');
      thumb.className = `slide-thumb-card${isActive ? ' active' : ''}`;
      thumb.dataset.index = idx;
      thumb.setAttribute('draggable', 'true');
      thumb.title = `Slide ${idx + 1}: ${slide.title || 'Untitled'}`;
      thumb.innerHTML = `
        <div class="thumb-number-badge">${idx + 1}</div>
        <div class="thumb-mini-canvas" style="background:${rawBg}; color:${textColor};">
          <div class="thumb-top-stripe" style="background:${accent};"></div>
          ${tag ? `<div class="thumb-tag-label" style="color:${accent};">${tag}</div>` : ''}
          <div class="thumb-title-text">${title}</div>
          <div class="thumb-layout-zone">
            <span style="font-size:10px;opacity:0.5;">${icon}</span>
            ${nodeCount > 0 ? `<div class="thumb-node-row">${Array.from({length:Math.min(nodeCount,4)}).map(()=>`<div class="thumb-node-pip" style="background:${accent};"></div>`).join('')}</div>` : ''}
          </div>
          <div class="thumb-bottom-bar" style="background:${accent}30;"></div>
        </div>
        <div class="thumb-context-menu-btn" onclick="event.stopPropagation()" title="Slide options">⋮</div>
      `;

      thumb.addEventListener('click', (e) => {
        if (!e.target.closest('.thumb-context-menu-btn')) switchSlide(idx);
      });

      thumb.querySelector('.thumb-context-menu-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = prompt(`Slide ${idx + 1} Options:\n1. Duplicate Slide\n2. Delete Slide\n3. Move Up\n4. Move Down\n\nEnter 1, 2, 3, or 4:`, '1');
        if (action === '1') {
          const clone = JSON.parse(JSON.stringify(slidesData[idx]));
          clone.id = Date.now();
          clone.title = (clone.title || 'Slide') + ' (Copy)';
          slidesData.splice(idx + 1, 0, clone);
          currentSlideIndex = idx + 1;
          saveDeck(); renderThumbnails(); switchSlide(currentSlideIndex);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Duplicated slide ${idx + 1}`);
        } else if (action === '2') {
          if (slidesData.length <= 1) {
            alert('Cannot delete the only slide in the deck.');
            return;
          }
          if (confirm(`Delete slide ${idx + 1}?`)) {
            slidesData.splice(idx, 1);
            currentSlideIndex = Math.min(idx, slidesData.length - 1);
            saveDeck(); renderThumbnails(); switchSlide(currentSlideIndex);
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Deleted slide ${idx + 1}`);
          }
        } else if (action === '3' && idx > 0) {
          const item = slidesData.splice(idx, 1)[0];
          slidesData.splice(idx - 1, 0, item);
          currentSlideIndex = idx - 1;
          saveDeck(); renderThumbnails(); switchSlide(currentSlideIndex);
        } else if (action === '4' && idx < slidesData.length - 1) {
          const item = slidesData.splice(idx, 1)[0];
          slidesData.splice(idx + 1, 0, item);
          currentSlideIndex = idx + 1;
          saveDeck(); renderThumbnails(); switchSlide(currentSlideIndex);
        }
      });

      // Drag-to-reorder
      thumb.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', String(idx)); thumb.classList.add('dragging'); });
      thumb.addEventListener('dragend', () => thumb.classList.remove('dragging'));
      thumb.addEventListener('dragover', (e) => { e.preventDefault(); thumb.classList.add('drag-over'); });
      thumb.addEventListener('dragleave', () => thumb.classList.remove('drag-over'));
      thumb.addEventListener('drop', (e) => {
        e.preventDefault(); thumb.classList.remove('drag-over');
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (fromIdx !== idx) {
          const moved = slidesData.splice(fromIdx, 1)[0];
          slidesData.splice(idx, 0, moved);
          currentSlideIndex = idx;
          saveDeck(); renderThumbnails(); switchSlide(currentSlideIndex);
        }
      });

      navSidebar.appendChild(thumb);
    });
  }

  function switchSlide(index) {
    if (index < 0 || index >= slidesData.length) return;
    currentSlideIndex = index;
    const slide = slidesData[currentSlideIndex];

    // Apply Transition animation
    slideFrame.style.animation = 'none';
    slideFrame.offsetHeight; // trigger reflow
    const t = slide.transition || currentTransition || 'fade';
    const spd = slide.transitionSpeed || currentTransitionSpeed || '0.45s';
    
    if (t === 'fade') {
      slideFrame.style.animation = `k-trans-fade ${spd} ease`;
    } else if (t === 'push-left' || t === 'slide-push') {
      slideFrame.style.animation = `k-trans-push-left ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    } else if (t === 'push-right') {
      slideFrame.style.animation = `k-trans-push-right ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    } else if (t === 'push-up') {
      slideFrame.style.animation = `k-trans-push-up ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    } else if (t === 'push-down') {
      slideFrame.style.animation = `k-trans-push-down ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    } else if (t === 'wipe-right') {
      slideFrame.style.animation = `k-trans-wipe-right ${spd} ease-out`;
    } else if (t === 'wipe-down') {
      slideFrame.style.animation = `k-trans-wipe-down ${spd} ease-out`;
    } else if (t === 'zoom-in') {
      slideFrame.style.animation = `k-trans-zoom-in ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    } else if (t === 'zoom-out') {
      slideFrame.style.animation = `k-trans-zoom-out ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    } else if (t === 'flip') {
      slideFrame.style.animation = `k-trans-flip ${spd} ease-out`;
    } else if (t === 'cube') {
      slideFrame.style.animation = `k-trans-cube-left ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    } else if (t === 'dissolve') {
      slideFrame.style.animation = `k-trans-dissolve ${spd} ease-in-out`;
    }

    // ── Apply resolved theme, vector artwork & executive typography ──
    const theme = resolveSlideTheme(slide);
    slide.bg = theme.bg;
    slide.accent = theme.accent;
    slideFrame.style.background = theme.bg;
    slideFrame.style.setProperty('--slide-accent', theme.accent);
    slideFrame.style.boxShadow = '0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)';

    // Render background vector art layer
    let artLayer = slideFrame.querySelector('#slide-canvas-art');
    if (!artLayer) {
      artLayer = document.createElement('div');
      artLayer.className = 'slide-canvas-art';
      artLayer.id = 'slide-canvas-art';
      slideFrame.insertBefore(artLayer, slideFrame.firstChild);
    }
    artLayer.innerHTML = theme.svgArt || '';

    // Style tag pill, title and desc
    tagEl.style.color = theme.accent;
    tagEl.style.borderColor = theme.accentBorder;
    tagEl.style.background = 'rgba(255, 255, 255, 0.08)';
    titleEl.style.color = '#ffffff';
    descEl.style.color = '#cbd5e1';
    slideFrame.style.color = '#ffffff';

    // ── Set slide text content ─────────────────────────────────
    tagEl.textContent = slide.tag || `SLIDE ${index + 1}`;
    titleEl.textContent = slide.title || 'Executive Heading';
    descEl.textContent = slide.desc || 'Slide subtitle and overview text...';
    if (notesInput) notesInput.value = slide.notes || '';
    if (slideNumIndicator) slideNumIndicator.textContent = `${index + 1}`;
    const loSlideStat = container.querySelector('#lo-stat-slide-count');
    if (loSlideStat) loSlideStat.textContent = `Slide ${index + 1} of ${slidesData.length}`;

    // Layout & Diagram rendering
    applyLayout(slide.layout || 'title');
    renderSlideDiagram(nodesGrid, slide, saveDeck, false);
    renderAnimationBadges();
    renderAnimationPaneList();

    if (progressBar) {
      progressBar.style.width = `${((currentSlideIndex + 1) / slidesData.length) * 100}%`;
    }

    const thumbs = navSidebar.querySelectorAll('.slide-thumb-card');
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === currentSlideIndex);
    });

    // Update HUD if presenting
    if (isPresenting) {
      updatePresenterSlide();
    }

    // Update Mobile Slide Nav Pill
    const mobileSlideNum = container.querySelector('#kinetic-mobile-slide-num');
    if (mobileSlideNum) {
      mobileSlideNum.textContent = `${currentSlideIndex + 1} / ${slidesData.length}`;
    }
  }

  function applyLayout(layout) {
    if (layout === 'blank') {
      tagEl.style.display = 'none';
      titleEl.style.display = 'none';
      descEl.style.display = 'none';
      nodesGrid.style.display = 'none';
    } else {
      tagEl.style.display = '';
      titleEl.style.display = '';
      descEl.style.display = '';
      nodesGrid.style.display = 'block';
    }
  }

  // Live text sync
  [tagEl, titleEl, descEl].forEach(el => {
    el.addEventListener('input', () => {
      const slide = slidesData[currentSlideIndex];
      slide.tag = tagEl.innerText;
      slide.title = titleEl.innerText;
      slide.desc = descEl.innerText;
      saveDeck();
      const activeThumb = navSidebar.querySelector(`.slide-thumb-card[data-index="${currentSlideIndex}"] .thumb-title-line`);
      if (activeThumb) activeThumb.textContent = slide.title;
    });
  });

  // Notes sync
  notesInput?.addEventListener('input', () => {
    const slide = slidesData[currentSlideIndex];
    slide.notes = notesInput.value;
    saveDeck();
  });

  // =========================================================================
  // RIBBON HOME CONTROLS: NEW SLIDE, DUPLICATE, DELETE, REORDER
  // =========================================================================
  const layoutSelect = container.querySelector('#kinetic-new-slide-layout');
  layoutSelect?.addEventListener('change', (e) => {
    const layout = e.target.value;
    if (!layout) return;

    let title = 'New Strategy Deliverable';
    let tag = `SLIDE 0${slidesData.length + 1}`;
    let desc = 'Customize this widescreen slide with your executive talking points.';
    let features = [];

    if (layout === 'circular-loop') {
      title = 'Continuous 4-Phase Closed Feedback Loop';
      tag = 'PROCESS // CIRCULAR';
      desc = 'A virtuous recurring loop cycle detailing ongoing iteration and refinement.';
      features = [
        { num: 'Phase 1', title: 'Assess & Discover', desc: 'Synthesize operational telemetry and customer insights.' },
        { num: 'Phase 2', title: 'Architect & Build', desc: 'Execute rapid prototypes with in-memory zero-latency pipelines.' },
        { num: 'Phase 3', title: 'Verify & Deploy', desc: 'Zero-downtime air-gapped sovereign roll-out.' },
        { num: 'Phase 4', title: 'Refine & Scale', desc: 'Analyze real-time metrics and feed back into the discovery phase.' }
      ];
    } else if (layout === 'zigzag-process') {
      title = '5-Step Ascending Zigzag Milestone Path';
      tag = 'ROADMAP // ZIGZAG';
      desc = 'Step-by-step sequential journey through strategic operational phases.';
      features = [
        { num: '1', title: 'Discovery & Framing', desc: 'Scope problem statement and assemble core teams' },
        { num: '2', title: 'Data Highways', desc: 'Construct zero-trust cryptographic local pipelines' },
        { num: '3', title: 'Rapid Prototyping', desc: 'High-fidelity model iteration and stress testing' },
        { num: '4', title: 'Audit & Compliance', desc: 'Full sovereign governance validation check' },
        { num: '5', title: 'Production Release', desc: 'Air-gapped deployment and ecosystem enablement' }
      ];
    } else if (layout === 'chevron-flow') {
      title = '4-Stage Forward Chevron Pipeline';
      tag = 'PIPELINE // CHEVRON';
      desc = 'Linear forward progression from data ingestion to actionable executive intelligence.';
      features = [
        { num: 'Stage 01', title: 'Ingestion', desc: 'Ingest raw enterprise telemetry with zero external leakage' },
        { num: 'Stage 02', title: 'Processing', desc: 'Transform data structures with high-throughput in-memory workers' },
        { num: 'Stage 03', title: 'Synthesis', desc: 'Derive deep contextual relationships and anomalies' },
        { num: 'Stage 04', title: 'Action', desc: 'Deliver interactive dashboards and exportable executive briefs' }
      ];
    } else if (layout === 'swot-matrix') {
      title = 'Enterprise Strategic 2x2 SWOT Matrix';
      tag = 'STRATEGY // MATRIX';
      desc = 'Internal strengths and weaknesses mapped against external opportunities and threats.';
      features = [
        { num: 'S', title: 'Strengths', desc: 'Proprietary in-memory zero-database runtime architecture.' },
        { num: 'W', title: 'Weaknesses', desc: 'Learning curve for teams accustomed to legacy cloud bloat.' },
        { num: 'O', title: 'Opportunities', desc: 'Global regulatory mandates demanding air-gapped sovereign computing.' },
        { num: 'T', title: 'Threats', desc: 'Aggressive pricing bundling from established legacy enterprise suites.' }
      ];
    } else if (layout === 'milestone-journey') {
      title = 'Multi-Horizon Executive Delivery Roadmap';
      tag = 'TIMELINE // HORIZONS';
      desc = 'Sequential quarterly milestones guiding the multi-year sovereign digital transformation.';
      features = [
        { num: 'Q1', title: 'Foundation & Hardening', desc: 'Secure air-gapped local environment and core modules.' },
        { num: 'Q2', title: 'Integration Velocity', desc: 'Connect Drift, Axis, Kinetic, and PDF Studio file pipelines.' },
        { num: 'Q3', title: 'Ecosystem Expansion', desc: 'Deploy 3,500+ global visual presentation diagram engines.' },
        { num: 'Q4', title: 'Sovereign Scale', desc: 'Enterprise cryptographic verification and zero telemetry.' }
      ];
    } else if (layout === 'pyramid-hierarchy') {
      title = '5-Tier Maslow Enterprise Hierarchy';
      tag = 'HIERARCHY // PYRAMID';
      desc = 'Foundational primitives elevating to peak organizational realization and executive strategy.';
      features = [
        { num: 'L5', title: 'Executive Vision', desc: 'Strategic North Star and organizational alignment.' },
        { num: 'L4', title: 'Tactical Execution', desc: 'Cross-functional program milestones and velocity.' },
        { num: 'L3', title: 'System Architecture', desc: 'Resilient high-throughput data highways.' },
        { num: 'L2', title: 'Infrastructure', desc: 'Air-gapped secure edge computing environments.' },
        { num: 'L1', title: 'Foundation Primitives', desc: 'Core sovereign cryptographic security.' }
      ];
    } else if (layout === 'funnel-stages') {
      title = 'Enterprise Customer Conversion Funnel';
      tag = 'FUNNEL // CONVERSION';
      desc = 'Systematic stage-gate progression measuring user drop-off and conversion optimization.';
      features = [
        { num: 'Stage 1', title: 'Awareness (100%)', desc: 'Total market reach and inbound awareness across sovereign channels.' },
        { num: 'Stage 2', title: 'Engagement (45%)', desc: 'Active platform evaluation and hands-on tool workflow trials.' },
        { num: 'Stage 3', title: 'Procurement (20%)', desc: 'Security audit compliance and enterprise licensing sign-off.' },
        { num: 'Stage 4', title: 'Full Adoption (8%)', desc: 'Complete organizational rollout across all global business units.' }
      ];
    } else if (layout === 'radial-cycle') {
      title = 'Radial Spoke Integration Architecture';
      tag = 'ARCHITECTURE // RADIAL';
      desc = 'Centralized sovereign intelligence core orchestrating distributed edge applications.';
      features = [
        { num: 'HUB', title: 'Core Hub', desc: 'Central orchestration engine' },
        { num: '01', title: 'Drift Docs', desc: 'Rich Word-compatible processing' },
        { num: '02', title: 'Axis Sheets', desc: 'High-speed spreadsheet grid' },
        { num: '03', title: 'Kinetic Slides', desc: 'Visual diagram presentations' },
        { num: '04', title: 'PDF Studio', desc: 'Digital signatures & forms' },
        { num: '05', title: 'File Converter', desc: 'Universal format bridge' },
        { num: '06', title: 'Local Vault', desc: 'Air-gapped cryptographic storage' }
      ];
    } else if (layout === 'comparison-table') {
      title = 'Transparent Commercial Tier Comparison';
      tag = 'COMMERCIAL // PRICING';
      desc = 'Predictable, zero-hidden-fee pricing designed for startups to sovereign governments.';
      features = [
        { num: '$0', title: 'Starter Edition', desc: 'Unlimited local files, core tools, standard export options.' },
        { num: '$29', title: 'Professional Suite', desc: '3,500+ global visual diagrams, full export suites, batch converter.' },
        { num: '$89', title: 'Sovereign Enterprise', desc: 'Air-gapped PKI cryptographic verification, custom themes, dedicated support.' }
      ];
    } else {
      title = 'Strategic Execution Deliverable';
      tag = `DELIVERABLE // 0${slidesData.length + 1}`;
      desc = 'Customize this widescreen slide with your key executive talking points.';
      features = [
        { num: '01', title: 'Market Opportunity', desc: 'Identifying unmet consumer and enterprise demand.' },
        { num: '02', title: 'Differentiated Technology', desc: 'In-memory browser execution with zero network dependency.' },
        { num: '03', title: 'Go-To-Market Execution', desc: 'Direct-to-enterprise sovereign licensing and offline deployment.' }
      ];
    }

    const newSlide = {
      id: Date.now(),
      layout: layout,
      tag: tag,
      title: title,
      desc: desc,
      features: features,
      notes: ''
    };

    slidesData.splice(currentSlideIndex + 1, 0, newSlide);
    saveDeck();
    renderThumbnails();
    switchSlide(currentSlideIndex + 1);
    e.target.value = '';
  });

  // Duplicate
  container.querySelector('#btn-kinetic-dup')?.addEventListener('click', () => {
    const current = slidesData[currentSlideIndex];
    const cloned = JSON.parse(JSON.stringify(current));
    cloned.title += ' (Copy)';
    slidesData.splice(currentSlideIndex + 1, 0, cloned);
    saveDeck();
    renderThumbnails();
    switchSlide(currentSlideIndex + 1);
  });

  // Delete
  container.querySelector('#btn-kinetic-del')?.addEventListener('click', () => {
    if (slidesData.length <= 1) return;
    slidesData.splice(currentSlideIndex, 1);
    saveDeck();
    renderThumbnails();
    switchSlide(Math.max(0, currentSlideIndex - 1));
  });

  // Move Up
  container.querySelector('#btn-kinetic-move-up')?.addEventListener('click', () => {
    if (currentSlideIndex <= 0) return;
    const temp = slidesData[currentSlideIndex];
    slidesData[currentSlideIndex] = slidesData[currentSlideIndex - 1];
    slidesData[currentSlideIndex - 1] = temp;
    saveDeck();
    renderThumbnails();
    switchSlide(currentSlideIndex - 1);
  });

  // Move Down
  container.querySelector('#btn-kinetic-move-down')?.addEventListener('click', () => {
    if (currentSlideIndex >= slidesData.length - 1) return;
    const temp = slidesData[currentSlideIndex];
    slidesData[currentSlideIndex] = slidesData[currentSlideIndex + 1];
    slidesData[currentSlideIndex + 1] = temp;
    saveDeck();
    renderThumbnails();
    switchSlide(currentSlideIndex + 1);
  });

  // Add Node Card
  container.querySelector('#btn-kinetic-add-node')?.addEventListener('click', () => {
    const slide = slidesData[currentSlideIndex];
    if (!slide.features) slide.features = [];
    slide.features.push({
      num: 'Node',
      title: 'Strategic Indicator',
      desc: 'Performance metric description'
    });
    saveDeck();
    switchSlide(currentSlideIndex);
  });

  // Formatting buttons
  container.querySelector('#btn-kinetic-bold')?.addEventListener('click', () => {
    document.execCommand('bold');
  });
  container.querySelector('#btn-kinetic-italic')?.addEventListener('click', () => {
    document.execCommand('italic');
  });
  container.querySelector('#btn-kinetic-underline')?.addEventListener('click', () => {
    document.execCommand('underline');
  });

  container.querySelector('#input-kinetic-text')?.addEventListener('input', (e) => {
    document.execCommand('foreColor', false, e.target.value);
    const ind = container.querySelector('#indicator-kinetic-text');
    if (ind) {
      ind.style.color = e.target.value;
      ind.style.borderBottomColor = e.target.value;
    }
  });

  container.querySelector('#kinetic-font-family')?.addEventListener('change', (e) => {
    document.execCommand('fontName', false, e.target.value);
  });

  // =========================================================================
  // KINETIC MODERN DARK RIBBON EVENT HANDLERS
  // =========================================================================

  // 1. Undo & Redo
  container.querySelector('#btn-kinetic-undo')?.addEventListener('click', () => {
    document.execCommand('undo');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Undo');
  });
  container.querySelector('#btn-kinetic-redo')?.addEventListener('click', () => {
    document.execCommand('redo');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Redo');
  });

  // 2. Clipboard (Paste, Cut, Copy, Format Painter)
  container.querySelector('#btn-kinetic-paste')?.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        document.execCommand('insertText', false, text);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Pasted from clipboard');
      }
    } catch {
      document.execCommand('paste');
    }
  });
  container.querySelector('#btn-kinetic-cut')?.addEventListener('click', () => {
    document.execCommand('cut');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Cut to clipboard');
  });
  container.querySelector('#btn-kinetic-copy')?.addEventListener('click', () => {
    document.execCommand('copy');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Copied to clipboard');
  });

  // Format Painter
  let kineticPainterActive = false;
  let copiedStyle = null;
  const painterBtn = container.querySelector('#btn-kinetic-format-painter');
  painterBtn?.addEventListener('click', () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const parentNode = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode;
      const computed = window.getComputedStyle(parentNode);
      copiedStyle = {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        color: computed.color,
        fontWeight: computed.fontWeight,
        fontStyle: computed.fontStyle,
        textDecoration: computed.textDecoration
      };
      kineticPainterActive = true;
      painterBtn.classList.add('active');
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Format Painter copied! Click target text to paint.');
    } else {
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Select text first to copy formatting');
    }
  });

  slideFrame.addEventListener('mouseup', () => {
    if (kineticPainterActive && copiedStyle) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontFamily = copiedStyle.fontFamily;
        span.style.fontSize = copiedStyle.fontSize;
        span.style.color = copiedStyle.color;
        span.style.fontWeight = copiedStyle.fontWeight;
        span.style.fontStyle = copiedStyle.fontStyle;
        span.style.textDecoration = copiedStyle.textDecoration;
        try {
          range.surroundContents(span);
        } catch {
          document.execCommand('foreColor', false, copiedStyle.color);
        }
        kineticPainterActive = false;
        painterBtn?.classList.remove('active');
        saveDeck();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Applied formatting');
      }
    }
  });

  // 3. New Slide Button
  container.querySelector('#btn-kinetic-new-slide-btn')?.addEventListener('click', () => {
    const newSlide = {
      id: Date.now(),
      layout: 'title',
      tag: `SLIDE 0${slidesData.length + 1}`,
      title: 'New Executive Deliverable',
      desc: 'Customize this widescreen slide with your presentation talking points.',
      features: [
        { num: '01', title: 'Strategy', desc: 'Enterprise architecture alignment' },
        { num: '02', title: 'Execution', desc: 'In-memory sovereign data flow' }
      ],
      notes: ''
    };
    slidesData.splice(currentSlideIndex + 1, 0, newSlide);
    saveDeck();
    renderThumbnails();
    switchSlide(currentSlideIndex + 1);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Created new slide');
  });

  // 4. Extended Font Controls
  container.querySelector('#kinetic-font-size-pt')?.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    const sizeMap = { 16: 2, 20: 3, 24: 4, 32: 5, 44: 6, 60: 7 };
    document.execCommand('fontSize', false, sizeMap[val] || 4);
  });

  container.querySelector('#btn-kinetic-font-grow')?.addEventListener('click', () => {
    document.execCommand('fontSize', false, 5);
  });
  container.querySelector('#btn-kinetic-font-shrink')?.addEventListener('click', () => {
    document.execCommand('fontSize', false, 2);
  });
  container.querySelector('#btn-kinetic-clear-formatting')?.addEventListener('click', () => {
    document.execCommand('removeFormat');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Cleared text formatting');
  });

  container.querySelector('#btn-kinetic-strike')?.addEventListener('click', () => {
    document.execCommand('strikeThrough');
  });
  container.querySelector('#btn-kinetic-sub')?.addEventListener('click', () => {
    document.execCommand('subscript');
  });
  container.querySelector('#btn-kinetic-sup')?.addEventListener('click', () => {
    document.execCommand('superscript');
  });

  let kCaseMode = 0;
  container.querySelector('#btn-kinetic-change-case')?.addEventListener('click', () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Select text first to change case');
      return;
    }
    const text = sel.toString();
    let res = text;
    if (kCaseMode === 0) {
      res = text.toUpperCase();
      kCaseMode = 1;
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: UPPERCASE');
    } else if (kCaseMode === 1) {
      res = text.toLowerCase();
      kCaseMode = 2;
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: lowercase');
    } else if (kCaseMode === 2) {
      res = text.replace(/\b\w/g, l => l.toUpperCase());
      kCaseMode = 3;
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: Capitalize Each Word');
    } else {
      res = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      kCaseMode = 0;
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: Sentence case');
    }
    document.execCommand('insertText', false, res);
    saveDeck();
  });

  container.querySelector('#input-kinetic-highlight')?.addEventListener('input', (e) => {
    document.execCommand('hiliteColor', false, e.target.value);
  });

  // 5. Paragraph Controls
  container.querySelector('#btn-kinetic-bullet')?.addEventListener('click', () => {
    document.execCommand('insertUnorderedList');
  });
  container.querySelector('#btn-kinetic-number')?.addEventListener('click', () => {
    document.execCommand('insertOrderedList');
  });
  container.querySelector('#btn-kinetic-indent-dec')?.addEventListener('click', () => {
    document.execCommand('outdent');
  });
  container.querySelector('#btn-kinetic-indent-inc')?.addEventListener('click', () => {
    document.execCommand('indent');
  });
  container.querySelector('#btn-kinetic-align-left')?.addEventListener('click', () => {
    document.execCommand('justifyLeft');
  });
  container.querySelector('#btn-kinetic-align-center')?.addEventListener('click', () => {
    document.execCommand('justifyCenter');
  });
  container.querySelector('#btn-kinetic-align-right')?.addEventListener('click', () => {
    document.execCommand('justifyRight');
  });
  container.querySelector('#btn-kinetic-align-justify')?.addEventListener('click', () => {
    document.execCommand('justifyFull');
  });

  // 6. Drawing Controls (Fill, Line, Arrange)
  container.querySelector('#input-kinetic-shape-fill')?.addEventListener('input', (e) => {
    if (selectedShape) {
      selectedShape.style.backgroundColor = e.target.value;
      saveDeck();
    }
  });
  container.querySelector('#input-kinetic-shape-line')?.addEventListener('input', (e) => {
    if (selectedShape) {
      selectedShape.style.borderColor = e.target.value;
      saveDeck();
    }
  });
  container.querySelector('#btn-kinetic-arrange')?.addEventListener('click', () => {
    if (selectedShape) {
      const curZ = parseInt(selectedShape.style.zIndex || '1', 10);
      selectedShape.style.zIndex = curZ + 1;
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Brought object forward');
    } else {
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Select a shape on the slide canvas first');
    }
  });

  // 7. Editing Controls (Find, Replace, Select All)
  container.querySelector('#btn-kinetic-find')?.addEventListener('click', () => openKineticFindReplaceModal(false));
  container.querySelector('#btn-kinetic-replace')?.addEventListener('click', () => openKineticFindReplaceModal(true));
  container.querySelector('#btn-kinetic-select-all')?.addEventListener('click', () => {
    document.execCommand('selectAll');
  });

  // 8. Voice Dictation
  let kVoiceActive = false;
  let kRecognition = null;
  const SpeechRecK = window.SpeechRecognition || window.webkitSpeechRecognition;
  container.querySelector('#btn-kinetic-voice')?.addEventListener('click', () => {
    if (!SpeechRecK) {
      alert('Voice dictation is supported in Chrome, Edge, and Safari.');
      return;
    }
    if (kVoiceActive) {
      kRecognition?.stop();
      kVoiceActive = false;
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Voice dictation stopped');
    } else {
      kRecognition = new SpeechRecK();
      kRecognition.continuous = true;
      kRecognition.lang = 'en-US';
      kRecognition.onstart = () => {
        kVoiceActive = true;
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Microphone active — speak to add text');
      };
      kRecognition.onresult = (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript;
        document.execCommand('insertText', false, ' ' + transcript);
      };
      kRecognition.onerror = () => { kVoiceActive = false; };
      kRecognition.onend = () => { kVoiceActive = false; };
      kRecognition.start();
    }
  });

  // 9. Designer AI Presentation Engine
  const designerThemes = ['theme-obsidian', 'theme-sapphire', 'theme-emerald', 'theme-crimson', 'theme-minimalist'];
  let designerThemeIdx = 0;
  container.querySelector('#btn-kinetic-designer')?.addEventListener('click', () => {
    designerThemeIdx = (designerThemeIdx + 1) % designerThemes.length;
    const newTheme = designerThemes[designerThemeIdx];
    currentTheme = newTheme;
    applyTheme(newTheme);
    const themeSelect = container.querySelector('#kinetic-theme-picker');
    if (themeSelect) themeSelect.value = newTheme;
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Designer: Applied AI Layout Preset "${newTheme.replace('theme-', '')}"`);
  });

  // 10. Dialog Launchers
  container.querySelector('#btn-kinetic-launcher-clipboard')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Clipboard history: Active');
  });
  container.querySelector('#btn-kinetic-launcher-slides')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Slide Settings: ${slidesData.length} slides active in presentation`);
  });
  container.querySelector('#btn-kinetic-launcher-font')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Font Studio: 24+ Aptos/Office fonts loaded');
  });
  container.querySelector('#btn-kinetic-launcher-paragraph')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Paragraph Formatting: Active');
  });
  container.querySelector('#btn-kinetic-launcher-drawing')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Drawing Canvas: Click shapes or use 8-point handles');
  });

  // 11. Help Tab Handlers
  container.querySelector('#btn-kinetic-help-center')?.addEventListener('click', () => {
    alert('Giri Kinetic Help Center:\n- Sovereign Widescreen Presentation Studio\n- Full Modern dark ribbon presentation compatibility\n- Presenter Station (F5) with Laser Pointer & Timer');
  });
  const kShortcutsModal = container.querySelector('#kinetic-shortcuts-modal');
  container.querySelector('#btn-kinetic-shortcuts-btn')?.addEventListener('click', () => kShortcutsModal?.classList.add('open'));
  container.querySelector('#btn-close-kinetic-shortcuts')?.addEventListener('click', () => kShortcutsModal?.classList.remove('open'));
  container.querySelector('#btn-ok-kinetic-shortcuts')?.addEventListener('click', () => kShortcutsModal?.classList.remove('open'));
  container.querySelector('#btn-kinetic-whats-new')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast("What's New: Modern Dark Presentation Ribbon, AI Designer, Laser Pointer HUD");
  });
  container.querySelector('#btn-kinetic-feedback-btn')?.addEventListener('click', () => {
    const fb = prompt('What feedback or feature would you like in Giri Kinetic?');
    if (fb && window.orbitPlatform) window.orbitPlatform.triggerToast('Thank you for your feedback! Stored in sovereign memory.');
  });

  // 12. Action Pills (Browser Sync, Comments, Catch Up, Editing ▾)
  container.querySelector('#btn-kinetic-browser-sync')?.addEventListener('click', () => {
    if (window.giriSyncManager) window.giriSyncManager.openStorageModal();
  });

  container.querySelector('#btn-kinetic-comments')?.addEventListener('click', () => {
    if (notesDrawer) {
      notesDrawer.style.display = notesDrawer.style.display === 'none' ? 'block' : 'none';
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Toggled Notes & Comments drawer');
    }
  });
  container.querySelector('#btn-kinetic-catchup')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Catch up: All presentation changes saved.');
  });
  let isKineticEditingMode = true;
  container.querySelector('#btn-kinetic-editing-mode')?.addEventListener('click', (e) => {
    isKineticEditingMode = !isKineticEditingMode;
    [tagEl, titleEl, descEl].forEach(el => {
      if (el) el.setAttribute('contenteditable', isKineticEditingMode ? 'true' : 'false');
    });
    e.currentTarget.querySelector('span').textContent = isKineticEditingMode ? 'Editing ▾' : 'Viewing ▾';
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(isKineticEditingMode ? 'Switched to Editing Mode' : 'Switched to Viewing Mode');
  });

  // =========================================================================
  // MARQUEE SELECTION & ELEMENT MANIPULATION ENGINE
  // =========================================================================

  // =========================================================================
  // 8-POINT INTERACTIVE RESIZE & GEOMETRY STUDIO
  // =========================================================================
  const HANDLE_DIRS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  let activeQuickbar = null;

  function removeQuickbar() {
    if (activeQuickbar) {
      activeQuickbar.remove();
      activeQuickbar = null;
    }
  }

  function renderShapeQuickbar(shape) {
    removeQuickbar();
    if (!shape) return;

    const bar = document.createElement('div');
    bar.className = 'kinetic-shape-quickbar';

    bar.style.top = `${Math.max(10, shape.offsetTop - 38)}px`;
    bar.style.left = `${Math.max(10, shape.offsetLeft)}px`;

    bar.innerHTML = `
      <!-- Fill Colors & Gradient Presets -->
      <label class="kinetic-quick-btn" title="Fill Color">
        <span style="font-size:11px;">🎨 Fill</span>
        <input type="color" class="ribbon-color-input" id="quick-fill-color" value="#2563eb" style="opacity:0; position:absolute; width:1px; height:1px;">
      </label>
      <button class="kinetic-quick-btn" data-grad="sapphire" title="Sapphire Gradient" style="background:linear-gradient(135deg,#2563eb,#38bdf8); width:18px; height:18px; border-radius:3px; padding:0;"></button>
      <button class="kinetic-quick-btn" data-grad="emerald" title="Emerald Gradient" style="background:linear-gradient(135deg,#059669,#34d399); width:18px; height:18px; border-radius:3px; padding:0;"></button>
      <button class="kinetic-quick-btn" data-grad="amber" title="Amber Gradient" style="background:linear-gradient(135deg,#ea580c,#f59e0b); width:18px; height:18px; border-radius:3px; padding:0;"></button>
      <button class="kinetic-quick-btn" data-grad="purple" title="Purple Gradient" style="background:linear-gradient(135deg,#7c3aed,#ec4899); width:18px; height:18px; border-radius:3px; padding:0;"></button>
      
      <div class="kinetic-quick-sep"></div>

      <!-- Layer Ordering -->
      <button class="kinetic-quick-btn" id="quick-front" title="Bring to Front">Front</button>
      <button class="kinetic-quick-btn" id="quick-back" title="Send to Back">Back</button>

      <div class="kinetic-quick-sep"></div>

      <!-- Alignment -->
      <button class="kinetic-quick-btn" id="quick-align-center" title="Center on Slide">Center</button>

      <!-- Delete -->
      <button class="kinetic-quick-btn" id="quick-del" title="Delete Shape" style="color:#f87171;">✕</button>
    `;

    bar.querySelector('#quick-fill-color')?.addEventListener('input', (e) => {
      shape.style.background = e.target.value;
      saveDeck();
    });

    bar.querySelectorAll('[data-grad]').forEach(btn => {
      btn.addEventListener('click', () => {
        const g = btn.dataset.grad;
        if (g === 'sapphire') shape.style.background = 'linear-gradient(135deg, #2563eb, #38bdf8)';
        if (g === 'emerald') shape.style.background = 'linear-gradient(135deg, #059669, #34d399)';
        if (g === 'amber') shape.style.background = 'linear-gradient(135deg, #ea580c, #f59e0b)';
        if (g === 'purple') shape.style.background = 'linear-gradient(135deg, #7c3aed, #ec4899)';
        saveDeck();
      });
    });

    bar.querySelector('#quick-front')?.addEventListener('click', () => {
      shape.style.zIndex = '50';
      saveDeck();
    });

    bar.querySelector('#quick-back')?.addEventListener('click', () => {
      shape.style.zIndex = '1';
      saveDeck();
    });

    bar.querySelector('#quick-align-center')?.addEventListener('click', () => {
      const parentW = slideFrame.offsetWidth;
      const shapeW = shape.offsetWidth;
      shape.style.left = `${Math.max(20, (parentW - shapeW) / 2)}px`;
      bar.style.left = shape.style.left;
      saveDeck();
    });

    bar.querySelector('#quick-del')?.addEventListener('click', () => {
      shape.remove();
      removeQuickbar();
      clearShapeSelection();
      saveDeck();
    });

    objectsContainer.appendChild(bar);
    activeQuickbar = bar;
  }

  function render8PointHandles(shape) {
    shape.querySelectorAll('.kinetic-resize-handle').forEach(h => h.remove());

    HANDLE_DIRS.forEach(dir => {
      const handle = document.createElement('div');
      handle.className = `kinetic-resize-handle ${dir}`;
      handle.dataset.dir = dir;

      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = parseInt(shape.style.left, 10) || shape.offsetLeft;
        const startTop = parseInt(shape.style.top, 10) || shape.offsetTop;
        const startWidth = shape.offsetWidth;
        const startHeight = shape.offsetHeight;

        const onMouseMove = (moveEvt) => {
          const dx = moveEvt.clientX - startX;
          const dy = moveEvt.clientY - startY;

          let newLeft = startLeft;
          let newTop = startTop;
          let newWidth = startWidth;
          let newHeight = startHeight;

          if (dir.includes('e')) {
            newWidth = Math.max(24, startWidth + dx);
          }
          if (dir.includes('s')) {
            newHeight = Math.max(20, startHeight + dy);
          }
          if (dir.includes('w')) {
            const possibleW = startWidth - dx;
            if (possibleW >= 24) {
              newWidth = possibleW;
              newLeft = startLeft + dx;
            }
          }
          if (dir.includes('n')) {
            const possibleH = startHeight - dy;
            if (possibleH >= 20) {
              newHeight = possibleH;
              newTop = startTop + dy;
            }
          }

          shape.style.left = `${newLeft}px`;
          shape.style.top = `${newTop}px`;
          shape.style.width = `${newWidth}px`;
          shape.style.height = `${newHeight}px`;

          if (activeQuickbar) {
            activeQuickbar.style.top = `${Math.max(10, newTop - 38)}px`;
            activeQuickbar.style.left = `${Math.max(10, newLeft)}px`;
          }
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          saveDeck();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });

      shape.appendChild(handle);
    });
  }

  const selectedShapes = new Set();

  function selectShape(shape, multi = false) {
    if (!multi) {
      clearShapeSelection();
    }
    selectedShapes.add(shape);
    shape.classList.add('selected');
    render8PointHandles(shape);
    renderShapeQuickbar(shape);
    if (kineticFontPicker && shape) {
      const child = shape.querySelector('*');
      const shapeFont = shape.style.fontFamily || (child ? child.style.fontFamily : null);
      if (shapeFont) kineticFontPicker.setFont(shapeFont);
    }
  }

  function clearShapeSelection() {
    selectedShapes.forEach(s => {
      s.classList.remove('selected');
      s.querySelectorAll('.kinetic-resize-handle').forEach(h => h.remove());
    });
    selectedShapes.clear();
    removeQuickbar();
  }

  function makeDraggable(el) {
    el.classList.add('kinetic-shape-item');
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    el.addEventListener('mousedown', (e) => {
      if (e.target.isContentEditable && document.activeElement === e.target) return;
      e.stopPropagation();
      selectShape(el, e.shiftKey || e.ctrlKey);

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;

      const onMouseMove = (moveEvt) => {
        if (!isDragging) return;
        const dx = moveEvt.clientX - startX;
        const dy = moveEvt.clientY - startY;
        el.style.left = `${initialLeft + dx}px`;
        el.style.top = `${initialTop + dy}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        saveDeck();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // Slide Canvas Marquee Box Selection
  let isMarqueeActive = false;
  let marqueeBox = null;
  let marqueeStart = { x: 0, y: 0 };

  slideFrame.addEventListener('mousedown', (e) => {
    if (e.target.closest('.kinetic-shape-item') || e.target.isContentEditable) return;
    clearShapeSelection();

    const rect = slideFrame.getBoundingClientRect();
    marqueeStart = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    isMarqueeActive = true;
    if (!marqueeBox) {
      marqueeBox = document.createElement('div');
      marqueeBox.className = 'kinetic-marquee-box';
    }
    marqueeBox.style.left = `${marqueeStart.x}px`;
    marqueeBox.style.top = `${marqueeStart.y}px`;
    marqueeBox.style.width = '0px';
    marqueeBox.style.height = '0px';
    marqueeBox.style.display = 'block';
    slideFrame.appendChild(marqueeBox);

    const onMarqueeMove = (moveEvt) => {
      if (!isMarqueeActive) return;
      const curX = moveEvt.clientX - rect.left;
      const curY = moveEvt.clientY - rect.top;

      const left = Math.min(marqueeStart.x, curX);
      const top = Math.min(marqueeStart.y, curY);
      const width = Math.abs(curX - marqueeStart.x);
      const height = Math.abs(curY - marqueeStart.y);

      marqueeBox.style.left = `${left}px`;
      marqueeBox.style.top = `${top}px`;
      marqueeBox.style.width = `${width}px`;
      marqueeBox.style.height = `${height}px`;

      // Check intersection with all shapes on canvas
      const mRect = { left, top, right: left + width, bottom: top + height };
      objectsContainer.querySelectorAll('.kinetic-shape-item').forEach(shape => {
        const sLeft = shape.offsetLeft;
        const sTop = shape.offsetTop;
        const sRight = sLeft + shape.offsetWidth;
        const sBottom = sTop + shape.offsetHeight;

        const intersects = !(mRect.left > sRight || mRect.right < sLeft || mRect.top > sBottom || mRect.bottom < sTop);
        if (intersects) {
          selectShape(shape, true);
        } else if (!moveEvt.shiftKey) {
          selectedShapes.delete(shape);
          shape.classList.remove('selected');
        }
      });
    };

    const onMarqueeUp = () => {
      isMarqueeActive = false;
      if (marqueeBox) marqueeBox.style.display = 'none';
      window.removeEventListener('mousemove', onMarqueeMove);
      window.removeEventListener('mouseup', onMarqueeUp);
    };

    window.addEventListener('mousemove', onMarqueeMove);
    window.addEventListener('mouseup', onMarqueeUp);
  });

  // Searchable Fluent Font Picker (Calibri Default)
  const kineticFontMount = container.querySelector('#kinetic-font-picker-mount');
  let kineticFontPicker = null;
  if (kineticFontMount) {
    kineticFontPicker = new FluentFontPicker(kineticFontMount, {
      defaultFont: 'Calibri',
      onSelect: (fontName, fontFamily) => {
        loadGoogleFont(fontName);
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
          document.execCommand('fontName', false, fontName);
          try {
            const range = sel.getRangeAt(0);
            const common = range.commonAncestorContainer;
            const containerEl = common.nodeType === 1 ? common : common.parentElement;
            if (containerEl) {
              containerEl.querySelectorAll('font[face]').forEach(f => {
                f.removeAttribute('face');
                f.style.fontFamily = fontFamily;
              });
            }
          } catch (e) {}
        }
        if (selectedShapes.size > 0) {
          selectedShapes.forEach(shape => {
            shape.style.fontFamily = fontFamily;
            shape.querySelectorAll('*').forEach(el => el.style.fontFamily = fontFamily);
          });
        }
        try { renderSlideCollageThumbnails(); } catch (e) {}
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Applied ${fontName} to presentation`);
      }
    });
  }

  // Active text selection listener in slide canvas
  const updateKineticFontFromSelection = () => {
    if (!kineticFontPicker) return;
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;
    const canvas = container.querySelector('#kinetic-canvas-container, .kinetic-canvas');
    if (!canvas || !canvas.contains(sel.anchorNode)) return;
    const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
    if (el) {
      const comp = el.style.fontFamily || window.getComputedStyle(el).fontFamily;
      if (comp) kineticFontPicker.setFont(comp);
    }
  };
  document.addEventListener('selectionchange', updateKineticFontFromSelection);

  // INSERT TAB CONTROLS: SHAPES, TEXTBOX, IMAGE, AI SLIDE
  // =========================================================================
  function insertShape(type) {
    const shape = document.createElement('div');
    shape.style.position = 'absolute';
    shape.style.top = '30%';
    shape.style.left = '40%';
    shape.style.pointerEvents = 'auto';
    shape.style.cursor = 'move';
    shape.style.boxShadow = 'var(--shadow-hover)';
    shape.style.fontFamily = 'Calibri, sans-serif';

    if (type === 'rect') {
      shape.style.width = '140px';
      shape.style.height = '80px';
      shape.style.background = '#2563eb';
      shape.style.borderRadius = '6px';
    } else if (type === 'circle') {
      shape.style.width = '90px';
      shape.style.height = '90px';
      shape.style.background = '#10b981';
      shape.style.borderRadius = '50%';
    } else if (type === 'pill') {
      shape.style.padding = '6px 18px';
      shape.style.background = '#8b5cf6';
      shape.style.color = '#ffffff';
      shape.style.borderRadius = '9999px';
      shape.style.fontSize = '12px';
      shape.style.fontWeight = '700';
      shape.textContent = 'EXECUTIVE BADGE';
      shape.contentEditable = 'true';
    } else if (type === 'arrow') {
      shape.style.fontSize = '32px';
      shape.style.color = '#2563eb';
      shape.textContent = '➔';
    }

    makeDraggable(shape);
    shape.addEventListener('dblclick', () => shape.remove());
    objectsContainer.appendChild(shape);
    selectShape(shape);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted ${type} shape onto slide canvas`);
  }

  container.querySelector('#btn-kinetic-shape-rect')?.addEventListener('click', () => insertShape('rect'));
  container.querySelector('#btn-kinetic-shape-circle')?.addEventListener('click', () => insertShape('circle'));
  container.querySelector('#btn-kinetic-shape-pill')?.addEventListener('click', () => insertShape('pill'));
  container.querySelector('#btn-kinetic-shape-arrow')?.addEventListener('click', () => insertShape('arrow'));

  // Custom Textbox

  // Vector Icons Modal
  function openVectorIconsModal() {
    const backdrop = document.createElement('div');
    backdrop.className = 'axis-modal-backdrop';

    const ICONS_CATALOG = [
      { name: 'Cloud', svg: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>' },
      { name: 'Rocket', svg: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>' },
      { name: 'Shield', svg: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
      { name: 'Globe', svg: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
      { name: 'Database', svg: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
      { name: 'Brain', svg: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>' },
      { name: 'Trophy', svg: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>' },
      { name: 'Chart', svg: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
      { name: 'Bulb', svg: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"/>' },
      { name: 'Users', svg: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
      { name: 'Target', svg: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
      { name: 'Lock', svg: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
      { name: 'Check', svg: '<polyline points="20 6 9 17 4 12"/>' },
      { name: 'Sparkles', svg: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' },
      { name: 'Server', svg: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>' },
      { name: 'Zap', svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
      { name: 'Compass', svg: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>' },
      { name: 'Layers', svg: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },
      { name: 'Folder', svg: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>' },
      { name: 'Wifi', svg: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>' }
    ];

    backdrop.innerHTML = `
      <div class="axis-modal-dialog" style="width: 520px; max-width: 95vw;">
        <div class="axis-modal-header">
          <span class="axis-modal-title">
            <span style="font-size:16px;">💎</span>
            <span>Enterprise Vector Icon Library</span>
          </span>
          <button class="axis-modal-close" id="btn-close-icons-modal">✕</button>
        </div>
        <div class="axis-modal-body">
          <input type="text" class="axis-find-input" id="icon-search-input" placeholder="Search icons (e.g. Cloud, Shield, Database)...">
          <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:10px; max-height:280px; overflow-y:auto; padding:6px 0;" id="icons-grid-container">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    const grid = backdrop.querySelector('#icons-grid-container');
    const searchInp = backdrop.querySelector('#icon-search-input');

    function renderIcons() {
      grid.innerHTML = '';
      const q = (searchInp.value || '').toLowerCase().trim();
      const filtered = ICONS_CATALOG.filter(i => !q || i.name.toLowerCase().includes(q));

      filtered.forEach(icon => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:6px; padding:10px 6px; border:1px solid #e2e8f0; border-radius:8px; cursor:pointer; transition:all 0.15s; background:#f8fafc;';
        item.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${icon.svg}
          </svg>
          <span style="font-size:10.5px; font-weight:600; color:#334155;">${icon.name}</span>
        `;

        item.addEventListener('mouseenter', () => { item.style.borderColor = '#2563eb'; item.style.background = '#eff6ff'; });
        item.addEventListener('mouseleave', () => { item.style.borderColor = '#e2e8f0'; item.style.background = '#f8fafc'; });

        item.addEventListener('click', () => {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'position:absolute; top:35%; left:45%; width:64px; height:64px; display:flex; align-items:center; justify-content:center; cursor:move; pointer-events:auto;';
          wrap.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${icon.svg}
            </svg>
          `;
          makeDraggable(wrap);
          wrap.addEventListener('dblclick', () => wrap.remove());
          objectsContainer.appendChild(wrap);
          selectShape(wrap);
          backdrop.remove();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted ${icon.name} vector icon`);
        });

        grid.appendChild(item);
      });
    }

    searchInp.addEventListener('input', renderIcons);
    backdrop.querySelector('#btn-close-icons-modal')?.addEventListener('click', () => backdrop.remove());
    renderIcons();
  }

  container.querySelector('#btn-kinetic-icons')?.addEventListener('click', openVectorIconsModal);

  container.querySelector('#btn-kinetic-textbox')?.addEventListener('click', () => {
    const tb = document.createElement('div');
    tb.contentEditable = 'true';
    tb.spellcheck = false;
    tb.style.position = 'absolute';
    tb.style.top = '35%';
    tb.style.left = '35%';
    tb.style.padding = '8px 14px';
    tb.style.border = '1px dashed #3b82f6';
    tb.style.background = 'rgba(255,255,255,0.9)';
    tb.style.borderRadius = '6px';
    tb.style.fontSize = '14px';
    tb.style.pointerEvents = 'auto';
    tb.textContent = 'Double click to edit custom callout text';
    makeDraggable(tb);
    objectsContainer.appendChild(tb);
    selectShape(tb);
    tb.focus();
  });

  // Image Insert
  const imgFileInput = container.querySelector('#kinetic-img-file-input');
  container.querySelector('#btn-kinetic-insert-img')?.addEventListener('click', () => {
    imgFileInput?.click();
  });

  imgFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = document.createElement('img');
      img.src = evt.target.result;
      img.style.position = 'absolute';
      img.style.top = '25%';
      img.style.left = '30%';
      img.style.maxWidth = '300px';
      img.style.maxHeight = '200px';
      img.style.borderRadius = '8px';
      img.style.boxShadow = 'var(--shadow-hover)';
      img.style.pointerEvents = 'auto';
      img.addEventListener('dblclick', () => img.remove());
      objectsContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
    imgFileInput.value = '';
  });

  // =========================================================================
  // GIRIONIX AI PRESENTATION STUDIO (PRACTICAL PRESENTATION AI)
  // =========================================================================
  function initKineticAiStudio() {
    const modal = container.querySelector('#kinetic-ai-studio-modal');
    if (!modal) return;

    const topicInput = container.querySelector('#kinetic-ai-deck-topic');
    const btnGenerateDeck = container.querySelector('#btn-kinetic-ai-generate-deck');
    const btnCloseModal = container.querySelector('#btn-close-kinetic-ai-modal');
    const btnDismiss = container.querySelector('#btn-kinetic-ai-dismiss');
    const btnActionPrimary = container.querySelector('#btn-kinetic-ai-action-primary');
    const slideBadge = container.querySelector('#kinetic-ai-slide-badge');
    const slidePreviewEl = container.querySelector('#kinetic-ai-current-slide-preview');

    // Tabs & sections
    const tabDeck = container.querySelector('#kinetic-ai-tab-deck');
    const tabSlide = container.querySelector('#kinetic-ai-tab-slide');
    const tabPolish = container.querySelector('#kinetic-ai-tab-polish');
    const secDeck = container.querySelector('#kinetic-ai-deck-section');
    const secSlide = container.querySelector('#kinetic-ai-slide-section');
    const secPolish = container.querySelector('#kinetic-ai-polish-section');

    let currentMode = 'deck';

    function switchTab(mode) {
      currentMode = mode;
      [tabDeck, tabSlide, tabPolish].forEach(t => t?.classList.remove('active'));
      if (secDeck) secDeck.style.display = 'none';
      if (secSlide) secSlide.style.display = 'none';
      if (secPolish) secPolish.style.display = 'none';

      if (mode === 'deck') {
        tabDeck?.classList.add('active');
        if (secDeck) secDeck.style.display = 'block';
        if (btnActionPrimary) btnActionPrimary.textContent = '⚡ Generate 5-Slide Deck';
        setTimeout(() => topicInput?.focus(), 50);
      } else if (mode === 'slide') {
        tabSlide?.classList.add('active');
        if (secSlide) secSlide.style.display = 'block';
        if (btnActionPrimary) btnActionPrimary.textContent = '⚡ Insert Diagram Slide';
      } else if (mode === 'polish') {
        tabPolish?.classList.add('active');
        if (secPolish) secPolish.style.display = 'block';
        if (btnActionPrimary) btnActionPrimary.textContent = '⚡ Polish Current Slide';
        updateSlidePreview();
      }
    }

    tabDeck?.addEventListener('click', () => switchTab('deck'));
    tabSlide?.addEventListener('click', () => switchTab('slide'));
    tabPolish?.addEventListener('click', () => switchTab('polish'));

    function updateSlidePreview() {
      if (!slidePreviewEl) return;
      const s = slidesData[currentSlideIndex];
      if (!s) {
        slidePreviewEl.textContent = '(No active slide)';
        return;
      }
      slidePreviewEl.innerHTML = `
        <div style="font-weight:700; color:#0f172a; margin-bottom:2px;">"${s.title || 'Untitled Slide'}"</div>
        <div style="color:#64748b; font-size:11.5px;">${s.desc || 'No description provided'}</div>
        <div style="font-size:10px; color:#7c3aed; font-weight:700; margin-top:4px; text-transform:uppercase;">Layout: ${s.layout || 'standard'}</div>
      `;
    }

    function openModal(defaultMode = 'deck') {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      if (slideBadge) slideBadge.textContent = `Slide ${currentSlideIndex + 1} of ${slidesData.length}`;
      switchTab(defaultMode);
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    btnCloseModal?.addEventListener('click', closeModal);
    btnDismiss?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Preset pills for Deck Topic
    container.querySelectorAll('#kinetic-ai-deck-presets button').forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.dataset.topic || btn.textContent.trim();
        if (topicInput) topicInput.value = topic;
        generateFullPitchDeck(topic);
      });
    });

    // Generate Full 5-Slide Deck
    function generateFullPitchDeck(customTopic = null) {
      const topic = (customTopic || topicInput?.value || '').trim() || 'Enterprise Strategy & Performance 2026';
      
      const newDeck = [
        {
          id: Date.now() + 1,
          layout: 'title',
          tag: 'GIRIONIX SOVEREIGN BRIEF',
          title: topic,
          desc: `Strategic Vision, Phased Architecture, and Quantified Value Proposition for ${topic}`,
          features: [],
          notes: `Executive kickoff introducing the core transformation pillars for ${topic}.`
        },
        {
          id: Date.now() + 2,
          layout: 'split-content',
          tag: 'PROBLEM & OPPORTUNITY',
          title: 'Market Dilemma & The Solution Paradigm',
          desc: `Analyzing systemic bottlenecks in current operations and the transformative unlock offered by ${topic}.`,
          features: [
            { num: '01', title: 'Legacy Inertia', desc: 'Recurring cloud seat subscriptions and external server lock-in create immense operational overhead.' },
            { num: '02', title: 'Sovereign Advantage', desc: 'Zero-cloud dependence, offline parity, and instant local execution eliminate cyber attack surfaces.' },
            { num: '03', title: 'Scalable Parity', desc: 'Cross-platform native browser runtime delivers sub-millisecond execution without installs.' }
          ],
          notes: 'Contrast legacy vendor vulnerabilities directly against the sovereign runtime advantage.'
        },
        {
          id: Date.now() + 3,
          layout: 'swot-matrix',
          tag: 'STRATEGIC AUDIT',
          title: `${topic} SWOT Matrix`,
          desc: 'Holistic 360-degree assessment of internal enterprise capabilities and external market dynamics.',
          features: [
            { num: 'S', title: 'Core Strengths', desc: 'Zero-database client-side architecture, 100% offline data sovereignty, zero per-seat SaaS taxes.' },
            { num: 'W', title: 'Key Weaknesses', desc: 'Initial change-management curve across corporate divisions accustomed to legacy portals.' },
            { num: 'O', title: 'Market Opportunities', desc: 'Strict data protection compliance mandates (GDPR, DPDP, HIPAA) requiring verifiable air-gapping.' },
            { num: 'T', title: 'External Threats', desc: 'Aggressive ecosystem bundling and predatory discount renewals by dominant multi-nationals.' }
          ],
          notes: 'Walk through each quadrant, highlighting Strengths and Market Opportunities as our strategic moat.'
        },
        {
          id: Date.now() + 4,
          layout: 'chevron-flow',
          tag: 'EXECUTION ROADMAP',
          title: 'Phased Implementation & Rollout',
          desc: 'Structured 4-stage delivery timeline engineered to guarantee zero operational downtime.',
          features: [
            { num: 'Phase 01', title: 'Discovery & Audit', desc: 'Baseline infrastructure assessment, security threat modeling, and stakeholder alignment.' },
            { num: 'Phase 02', title: 'Architecture Setup', desc: 'Deployment of client-side sovereign engines with localized encrypted key stores.' },
            { num: 'Phase 03', title: 'Steering Pilot', desc: 'Controlled production deployment across high-security executive business units.' },
            { num: 'Phase 04', title: 'Enterprise Scale', desc: 'Complete organization-wide rollout with automated sovereign integrity audits.' }
          ],
          notes: 'Reassure executives that Phase 1 and 2 operate completely non-invasively.'
        },
        {
          id: Date.now() + 5,
          layout: 'metrics',
          tag: 'ROI & BENCHMARKS',
          title: 'Quantified Executive Impact',
          desc: `Measurable performance uplifts and fiscal efficiency achieved upon implementing ${topic}.`,
          features: [
            { num: '99.99%', title: 'Local Uptime', desc: 'Zero service outages caused by third-party cloud downtime or network blips.' },
            { num: '< 85ms', title: 'Execution Latency', desc: 'Near-instantaneous canvas interactions with zero remote server round-trips.' },
            { num: '3.8x', title: 'Net Fiscal ROI', desc: 'Immediate elimination of annual per-seat licensing fees across the organization.' }
          ],
          notes: 'Summarize the closing ask and open the floor for executive Q&A.'
        }
      ];

      slidesData.length = 0;
      newDeck.forEach(s => slidesData.push(s));
      currentSlideIndex = 0;
      saveDeck();
      renderNavThumbnails();
      switchSlide(0);
      closeModal();
      if (window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`Generated 5-Slide Executive Deck for "${topic}"`);
      }
    }

    btnGenerateDeck?.addEventListener('click', () => generateFullPitchDeck());
    topicInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generateFullPitchDeck();
      }
    });

    // Preset Insert Diagram Handlers
    container.querySelectorAll('.btn-kinetic-insert-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const layout = btn.dataset.layout;
        insertStrategicDiagramSlide(layout);
      });
    });

    function insertStrategicDiagramSlide(layout) {
      let newSlide = null;
      if (layout === 'swot-matrix') {
        newSlide = {
          id: Date.now(),
          layout: 'swot-matrix',
          tag: 'STRATEGIC MATRIX',
          title: 'Strategic SWOT Analysis',
          desc: '2x2 grid evaluating internal capabilities against external market forces.',
          features: [
            { num: 'S', title: 'Core Strengths', desc: 'Zero-DB client-side architecture, 100% offline data sovereignty, zero per-seat SaaS taxes.' },
            { num: 'W', title: 'Key Weaknesses', desc: 'Initial change-management curve across corporate divisions accustomed to legacy portals.' },
            { num: 'O', title: 'Market Opportunities', desc: 'Strict data protection compliance mandates requiring verifiable sovereign data custody.' },
            { num: 'T', title: 'External Threats', desc: 'Aggressive ecosystem bundling and predatory discount renewals by dominant multi-nationals.' }
          ],
          notes: 'Highlight Strengths as the primary defense against competitive threats.'
        };
      } else if (layout === 'chevron-flow') {
        newSlide = {
          id: Date.now(),
          layout: 'chevron-flow',
          tag: 'EXECUTION FLOW',
          title: '4-Phase Delivery Framework',
          desc: 'End-to-end operational roadmap from initial scoping to enterprise adoption.',
          features: [
            { num: 'Phase 01', title: 'Discovery & Audit', desc: 'Baseline infrastructure assessment and security threat modeling.' },
            { num: 'Phase 02', title: 'Architecture Setup', desc: 'Deployment of client-side sovereign engines with encrypted storage.' },
            { num: 'Phase 03', title: 'Pilot Rollout', desc: 'Controlled production deployment across high-security executive business units.' },
            { num: 'Phase 04', title: 'Enterprise Scale', desc: 'Complete organization-wide rollout with automated sovereign integrity audits.' }
          ],
          notes: 'Phases 1-2 complete within 14 business days without external dependencies.'
        };
      } else if (layout === 'metrics') {
        newSlide = {
          id: Date.now(),
          layout: 'metrics',
          tag: 'PERFORMANCE BENCHMARKS',
          title: 'Executive KPI Metrics',
          desc: 'Quantifiable operational metrics demonstrating performance uplift and cost reduction.',
          features: [
            { num: '99.98%', title: 'System Reliability', desc: 'Zero dependency on third-party cloud uptime.' },
            { num: '10x Faster', title: 'Processing Velocity', desc: 'Native browser engine compilation outperforms legacy client apps.' },
            { num: '$180K/yr', title: 'Licensing Savings', desc: 'Eliminates per-seat SaaS tax with sovereign office ownership.' }
          ],
          notes: 'Telemetry gathered directly from local browser benchmarking.'
        };
      } else {
        newSlide = {
          id: Date.now(),
          layout: 'comparison-table',
          tag: 'COMPETITIVE MATRIX',
          title: 'Sovereign Architecture Comparison',
          desc: 'Direct architectural differentiation between Giri Orbit and traditional legacy suites.',
          features: [
            { num: 'Giri Orbit', title: '100% Local Sovereign', desc: 'Zero database, zero cloud tracking, perpetual offline functionality.' },
            { num: 'Legacy Cloud', title: 'Cloud-Dependent', desc: 'External telemetry, recurring monthly seat fees, data vulnerability.' },
            { num: 'Open Source', title: 'Manual Maintenance', desc: 'Complex local builds, unpolished UX, lack of unified office interoperability.' }
          ],
          notes: 'Conclude with clear competitive differentiation.'
        };
      }

      slidesData.splice(currentSlideIndex + 1, 0, newSlide);
      saveDeck();
      renderNavThumbnails();
      switchSlide(currentSlideIndex + 1);
      closeModal();
      if (window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`Inserted ${newSlide.title} (Slide ${currentSlideIndex + 1})`);
      }
    }

    // Polish Current Slide Actions
    container.querySelectorAll('.btn-kinetic-polish-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        polishCurrentSlide(action);
      });
    });

    function polishCurrentSlide(action) {
      const s = slidesData[currentSlideIndex];
      if (!s) return;

      if (action === 'executive') {
        s.tag = 'EXECUTIVE BRIEF';
        s.title = s.title.replace(/^(the|a|an)\s+/i, '').replace(/\b\w/g, l => l.toUpperCase());
        s.desc = `Strategic operational overview analyzing key performance drivers, resource allocation, and high-impact deliverables for ${s.title}.`;
      } else if (action === 'pitch') {
        s.tag = 'INVESTOR THESIS';
        s.title = `${s.title}: Market Moat & Scalability`;
        s.desc = `High-conviction value proposition delivering accelerated compounding returns, defensible differentiation, and sovereign execution velocity.`;
      } else if (action === 'concise') {
        s.tag = 'CORE SUMMARY';
        s.title = s.title.split(' - ')[0].trim();
        s.desc = s.desc.split('.')[0] + '.';
      } else if (action === 'grammar') {
        s.title = s.title.trim().replace(/\s+/g, ' ');
        s.desc = s.desc.trim().replace(/\s+/g, ' ');
        if (!s.desc.endsWith('.')) s.desc += '.';
      }

      saveDeck();
      switchSlide(currentSlideIndex);
      renderNavThumbnails();
      closeModal();
      if (window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`Slide polished (${action.toUpperCase()})`);
      }
    }

    // Primary action button in footer
    btnActionPrimary?.addEventListener('click', () => {
      if (currentMode === 'deck') {
        generateFullPitchDeck();
      } else if (currentMode === 'slide') {
        insertStrategicDiagramSlide('swot-matrix');
      } else if (currentMode === 'polish') {
        polishCurrentSlide('executive');
      }
    });

    // Connect trigger buttons
    container.querySelector('#btn-kinetic-top-ai-agent')?.addEventListener('click', () => {
      if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
        window.orbitPlatform.openGirionixAgent('kinetic');
      } else if (window.orbitAgent) {
        window.orbitAgent.openAgent('kinetic');
      }
    });
    container.querySelector('#btn-kinetic-ai-agent')?.addEventListener('click', () => {
      if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
        window.orbitPlatform.openGirionixAgent('kinetic');
      } else if (window.orbitAgent) {
        window.orbitAgent.openAgent('kinetic');
      }
    });
    container.querySelector('#btn-kinetic-ai-gen')?.addEventListener('click', () => openModal('slide'));
    container.querySelector('#btn-kinetic-home-ai-studio')?.addEventListener('click', () => openModal('deck'));
    container.querySelector('#btn-kinetic-import-from-girionix')?.addEventListener('click', () => {
      if (window.orbitPlatform && typeof window.orbitPlatform.importFromGirionix === 'function') {
        window.orbitPlatform.importFromGirionix('kinetic');
      } else if (window.orbitPlatform && typeof window.orbitPlatform.toggleGirionixAiDrawer === 'function') {
        window.orbitPlatform.toggleGirionixAiDrawer('kinetic');
      }
    });
    container.querySelector('#btn-kinetic-export-to-girionix')?.addEventListener('click', () => {
      if (window.orbitPlatform && typeof window.orbitPlatform.exportToGirionix === 'function') {
        window.orbitPlatform.exportToGirionix('kinetic');
      } else if (window.orbitPlatform && typeof window.orbitPlatform.toggleGirionixAiDrawer === 'function') {
        window.orbitPlatform.toggleGirionixAiDrawer('kinetic');
      }
    });

    // Window global hook
    window.kineticAiStudio = {
      open: openModal,
      close: closeModal,
      generateDeck: generateFullPitchDeck,
      insertDiagram: insertStrategicDiagramSlide,
      polishSlide: polishCurrentSlide
    };
  }

  // Initialize Girionix AI Presentation Studio
  initKineticAiStudio();

  // =========================================================================
  // DESIGN TAB CONTROLS: THEMES, ASPECT RATIO, BG COLOR
  // =========================================================================
  const themePicker = container.querySelector('#kinetic-theme-picker');
  themePicker?.addEventListener('change', (e) => {
    slideFrame.classList.remove('theme-minimalist', 'theme-sapphire', 'theme-emerald', 'theme-obsidian', 'theme-crimson');
    currentTheme = e.target.value;
    slideFrame.classList.add(currentTheme);
  });

  // Aspect ratio
  const btnRatio169 = container.querySelector('#btn-ratio-16-9');
  const btnRatio43 = container.querySelector('#btn-ratio-4-3');

  btnRatio169?.addEventListener('click', () => {
    aspectRatio = '16-9';
    btnRatio169.classList.add('active');
    btnRatio43.classList.remove('active');
    slideFrame.style.aspectRatio = '16 / 9';
    slideFrame.style.maxWidth = '920px';
  });

  btnRatio43?.addEventListener('click', () => {
    aspectRatio = '4-3';
    btnRatio43.classList.add('active');
    btnRatio169.classList.remove('active');
    slideFrame.style.aspectRatio = '4 / 3';
    slideFrame.style.maxWidth = '780px';
  });

  // Background color
  const bgColorInput = container.querySelector('#input-kinetic-bg');
  const bgColorIndicator = container.querySelector('#indicator-kinetic-bg');
  bgColorInput?.addEventListener('input', (e) => {
    slideFrame.style.backgroundColor = e.target.value;
    if (bgColorIndicator) bgColorIndicator.style.background = e.target.value;
  });

  // =========================================================================
  // TRANSITIONS TAB CONTROLS & LIVE PREVIEW
  // =========================================================================
  let currentTransitionSpeed = '0.45s';
  const transSpeedSelect = container.querySelector('#kinetic-trans-speed');
  transSpeedSelect?.addEventListener('change', (e) => {
    currentTransitionSpeed = e.target.value;
    if (slidesData[currentSlideIndex]) {
      slidesData[currentSlideIndex].transitionSpeed = currentTransitionSpeed;
    }
  });

  function playSlideTransition(tName, tSpeed) {
    if (!slideFrame) return;
    slideFrame.style.animation = 'none';
    slideFrame.offsetHeight; // trigger reflow
    const t = tName || currentTransition || 'fade';
    const spd = tSpeed || currentTransitionSpeed || '0.45s';
    
    if (t === 'fade') slideFrame.style.animation = `k-trans-fade ${spd} ease`;
    else if (t === 'push-left' || t === 'slide-push') slideFrame.style.animation = `k-trans-push-left ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    else if (t === 'push-right') slideFrame.style.animation = `k-trans-push-right ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    else if (t === 'push-up') slideFrame.style.animation = `k-trans-push-up ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    else if (t === 'push-down') slideFrame.style.animation = `k-trans-push-down ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    else if (t === 'wipe-right') slideFrame.style.animation = `k-trans-wipe-right ${spd} ease-out`;
    else if (t === 'wipe-down') slideFrame.style.animation = `k-trans-wipe-down ${spd} ease-out`;
    else if (t === 'zoom-in') slideFrame.style.animation = `k-trans-zoom-in ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    else if (t === 'zoom-out') slideFrame.style.animation = `k-trans-zoom-out ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    else if (t === 'flip') slideFrame.style.animation = `k-trans-flip ${spd} ease-out`;
    else if (t === 'cube') slideFrame.style.animation = `k-trans-cube-left ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    else if (t === 'dissolve') slideFrame.style.animation = `k-trans-dissolve ${spd} ease-in-out`;
  }

  container.querySelectorAll('[data-transition]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-transition]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTransition = btn.dataset.transition;
      if (slidesData[currentSlideIndex]) {
        slidesData[currentSlideIndex].transition = currentTransition;
        slidesData[currentSlideIndex].transitionSpeed = currentTransitionSpeed;
      }
      playSlideTransition(currentTransition, currentTransitionSpeed);
    });
  });

  container.querySelector('#btn-kinetic-preview-trans')?.addEventListener('click', () => {
    playSlideTransition(currentTransition, currentTransitionSpeed);
  });

  container.querySelector('#btn-kinetic-apply-all-trans')?.addEventListener('click', () => {
    slidesData.forEach(s => {
      s.transition = currentTransition;
      s.transitionSpeed = currentTransitionSpeed;
    });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Applied ${currentTransition.toUpperCase()} (${currentTransitionSpeed}) transition to all ${slidesData.length} slides`);
  });

  // =========================================================================
  // ANIMATION ENGINE: TARGET SELECTION, BADGES, SIDEBAR, PREVIEW & SEQUENCING
  // =========================================================================
  let selectedAnimTarget = null;
  let selectedAnimTargetSelector = '#slide-title';
  let selectedAnimTargetName = 'Title';
  let activeAnimationIndex = -1;

  const animPane = container.querySelector('#kinetic-animation-pane');
  const animList = container.querySelector('#kinetic-anim-list');
  const btnToggleAnimPane = container.querySelector('#btn-toggle-anim-pane');
  const btnCloseAnimPane = container.querySelector('#btn-close-anim-pane');
  const btnAnimPlayAll = container.querySelector('#btn-anim-play-all');
  const btnAnimMoveUp = container.querySelector('#btn-anim-move-up');
  const btnAnimMoveDown = container.querySelector('#btn-anim-move-down');
  const btnAnimRemoveSel = container.querySelector('#btn-anim-remove-sel');
  const animTriggerSelect = container.querySelector('#kinetic-anim-trigger');
  const animDurationSelect = container.querySelector('#kinetic-anim-duration');
  const btnAnimPreview = container.querySelector('#btn-kinetic-anim-preview');

  // Toggle Animation Pane Sidebar
  btnToggleAnimPane?.addEventListener('click', () => {
    const isHidden = animPane.style.display === 'none';
    animPane.style.display = isHidden ? 'flex' : 'none';
    btnToggleAnimPane.classList.toggle('active', isHidden);
    if (isHidden) renderAnimationPaneList();
  });

  btnCloseAnimPane?.addEventListener('click', () => {
    animPane.style.display = 'none';
    btnToggleAnimPane?.classList.remove('active');
  });

  // Track user click to set active animation target
  slideFrame.addEventListener('click', (e) => {
    if (e.target.closest('.kinetic-anim-badge')) return;

    const targetCard = e.target.closest('[data-fidx]');
    const targetShape = e.target.closest('.kinetic-shape-item');
    const targetTitle = e.target.closest('#slide-title');
    const targetDesc = e.target.closest('#slide-desc');
    const targetTag = e.target.closest('#slide-tag');

    if (targetTitle) {
      selectedAnimTarget = targetTitle;
      selectedAnimTargetSelector = '#slide-title';
      selectedAnimTargetName = `Title: "${targetTitle.innerText.slice(0, 20)}..."`;
    } else if (targetDesc) {
      selectedAnimTarget = targetDesc;
      selectedAnimTargetSelector = '#slide-desc';
      selectedAnimTargetName = `Subtitle: "${targetDesc.innerText.slice(0, 20)}..."`;
    } else if (targetTag) {
      selectedAnimTarget = targetTag;
      selectedAnimTargetSelector = '#slide-tag';
      selectedAnimTargetName = `Tag: "${targetTag.innerText.slice(0, 15)}"`;
    } else if (targetCard) {
      selectedAnimTarget = targetCard;
      const fidx = targetCard.dataset.fidx;
      selectedAnimTargetSelector = `[data-fidx="${fidx}"]`;
      const cardTitle = targetCard.querySelector('.pgo-node-title, .feature-title')?.innerText || `Option ${parseInt(fidx) + 1}`;
      selectedAnimTargetName = `Node: "${cardTitle.slice(0, 20)}"`;
    } else if (targetShape) {
      selectedAnimTarget = targetShape;
      selectedAnimTargetSelector = targetShape.id ? `#${targetShape.id}` : '.kinetic-shape-item';
      selectedAnimTargetName = `Shape: ${targetShape.dataset.shape || 'Object'}`;
    }
  });

  function renderAnimationBadges() {
    slideFrame.querySelectorAll('.kinetic-anim-badge').forEach(b => b.remove());
    const slide = slidesData[currentSlideIndex];
    if (!slide || !slide.animations || slide.animations.length === 0) return;

    slide.animations.forEach((anim, idx) => {
      const target = slideFrame.querySelector(anim.targetSelector);
      if (target) {
        const badge = document.createElement('div');
        badge.className = 'kinetic-anim-badge';
        badge.textContent = idx + 1;
        badge.title = `${idx + 1}: ${anim.effectName || anim.effect} (${anim.trigger || 'onClick'})`;

        const computedPos = window.getComputedStyle(target).position;
        if (computedPos === 'static') target.style.position = 'relative';

        target.appendChild(badge);
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          activeAnimationIndex = idx;
          if (animPane.style.display === 'none') {
            animPane.style.display = 'flex';
            btnToggleAnimPane?.classList.add('active');
          }
          renderAnimationPaneList();
        });
      }
    });
  }

  function renderAnimationPaneList() {
    if (!animList) return;
    animList.innerHTML = '';
    const slide = slidesData[currentSlideIndex];
    const anims = slide?.animations || [];

    if (anims.length === 0) {
      animList.innerHTML = `
        <div style="text-align:center; padding:32px 14px; color:#94a3b8;">
          <div style="font-size:24px; margin-bottom:8px;">✨</div>
          <strong style="font-size:12px; color:#0f172a; display:block; margin-bottom:4px;">No Animations on This Slide</strong>
          <p style="font-size:11px; margin:0; line-height:1.4;">Select any title, diagram card, or shape on the canvas and click an effect in the Animations tab.</p>
        </div>
      `;
      return;
    }

    anims.forEach((anim, idx) => {
      const item = document.createElement('div');
      item.className = `kinetic-anim-item-card ${idx === activeAnimationIndex ? 'active' : ''}`;
      const typeColor = anim.type === 'entrance' ? '#22c55e' : (anim.type === 'emphasis' ? '#eab308' : '#ef4444');
      const triggerIcon = anim.trigger === 'onClick' ? '🖱️' : (anim.trigger === 'withPrev' ? '⚡' : '⏱️');

      item.innerHTML = `
        <div class="kinetic-anim-item-badge">${idx + 1}</div>
        <div class="kinetic-anim-item-info">
          <div class="kinetic-anim-item-name">${anim.targetName || 'Slide Element'}</div>
          <div class="kinetic-anim-item-effect">
            <span style="color:${typeColor};">★</span>
            <span>${anim.effectName}</span>
            <span style="font-size:9.5px; opacity:0.8;">• ${triggerIcon} ${anim.duration || 0.6}s</span>
          </div>
        </div>
        <div class="kinetic-anim-item-controls">
          <button class="kinetic-anim-btn-mini btn-play-single" title="Play Effect">▶</button>
          <button class="kinetic-anim-btn-mini btn-del-single" title="Remove" style="color:#ef4444;">✕</button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-play-single') || e.target.closest('.btn-del-single')) return;
        activeAnimationIndex = idx;
        renderAnimationPaneList();
      });

      item.querySelector('.btn-play-single').addEventListener('click', () => {
        playSingleAnimation(anim);
      });

      item.querySelector('.btn-del-single').addEventListener('click', () => {
        anims.splice(idx, 1);
        if (activeAnimationIndex >= anims.length) activeAnimationIndex = anims.length - 1;
        saveDeck();
        renderAnimationBadges();
        renderAnimationPaneList();
      });

      animList.appendChild(item);
    });
  }

  function playSingleAnimation(anim) {
    const el = slideFrame.querySelector(anim.targetSelector);
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight; // force reflow
    el.style.animation = `${anim.effect} ${anim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
  }

  function playAllAnimationsOnSlide() {
    const slide = slidesData[currentSlideIndex];
    if (!slide || !slide.animations || slide.animations.length === 0) return;
    let accumulatedDelay = 0;
    slide.animations.forEach(anim => {
      const duration = (anim.duration || 0.6) * 1000;
      if (anim.trigger === 'onClick' || anim.trigger === 'afterPrev') {
        accumulatedDelay += (anim.trigger === 'afterPrev' ? 200 : 400);
      }
      setTimeout(() => {
        playSingleAnimation(anim);
      }, accumulatedDelay);
      accumulatedDelay += duration;
    });
  }

  // Ribbon Animation Effect Buttons
  container.querySelectorAll('[data-anim-effect]').forEach(btn => {
    btn.addEventListener('click', () => {
      const effect = btn.dataset.animEffect;
      const type = btn.dataset.animType || 'entrance';
      const effectName = btn.textContent.replace('★', '').trim();
      const slide = slidesData[currentSlideIndex];
      slide.animations = slide.animations || [];

      if (!selectedAnimTarget) {
        selectedAnimTarget = titleEl;
        selectedAnimTargetSelector = '#slide-title';
        selectedAnimTargetName = `Title: "${titleEl.innerText.slice(0, 20)}"`;
      }

      if (effect === 'none') {
        slide.animations = slide.animations.filter(a => a.targetSelector !== selectedAnimTargetSelector);
        saveDeck();
        renderAnimationBadges();
        renderAnimationPaneList();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Removed animation from ${selectedAnimTargetName}`);
        return;
      }

      const existingIdx = slide.animations.findIndex(a => a.targetSelector === selectedAnimTargetSelector);
      const newAnim = {
        id: 'anim-' + Date.now(),
        targetSelector: selectedAnimTargetSelector,
        targetName: selectedAnimTargetName,
        effect: effect,
        effectName: effectName,
        type: type,
        trigger: animTriggerSelect?.value || 'onClick',
        duration: parseFloat(animDurationSelect?.value || '0.6')
      };

      if (existingIdx >= 0) {
        slide.animations[existingIdx] = newAnim;
        activeAnimationIndex = existingIdx;
      } else {
        slide.animations.push(newAnim);
        activeAnimationIndex = slide.animations.length - 1;
      }

      saveDeck();
      renderAnimationBadges();
      renderAnimationPaneList();
      playSingleAnimation(newAnim);
      if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Applied "${effectName}" to ${selectedAnimTargetName}`);
    });
  });

  btnAnimMoveUp?.addEventListener('click', () => {
    const slide = slidesData[currentSlideIndex];
    if (!slide?.animations || activeAnimationIndex <= 0) return;
    const temp = slide.animations[activeAnimationIndex];
    slide.animations[activeAnimationIndex] = slide.animations[activeAnimationIndex - 1];
    slide.animations[activeAnimationIndex - 1] = temp;
    activeAnimationIndex--;
    saveDeck();
    renderAnimationBadges();
    renderAnimationPaneList();
  });

  btnAnimMoveDown?.addEventListener('click', () => {
    const slide = slidesData[currentSlideIndex];
    if (!slide?.animations || activeAnimationIndex < 0 || activeAnimationIndex >= slide.animations.length - 1) return;
    const temp = slide.animations[activeAnimationIndex];
    slide.animations[activeAnimationIndex] = slide.animations[activeAnimationIndex + 1];
    slide.animations[activeAnimationIndex + 1] = temp;
    activeAnimationIndex++;
    saveDeck();
    renderAnimationBadges();
    renderAnimationPaneList();
  });

  btnAnimRemoveSel?.addEventListener('click', () => {
    const slide = slidesData[currentSlideIndex];
    if (!slide?.animations || activeAnimationIndex < 0) return;
    slide.animations.splice(activeAnimationIndex, 1);
    if (activeAnimationIndex >= slide.animations.length) activeAnimationIndex = slide.animations.length - 1;
    saveDeck();
    renderAnimationBadges();
    renderAnimationPaneList();
  });

  btnAnimPlayAll?.addEventListener('click', playAllAnimationsOnSlide);
  btnAnimPreview?.addEventListener('click', playAllAnimationsOnSlide);

  // Initial animation render for active slide
  renderAnimationBadges();
  renderAnimationPaneList();

  // =========================================================================
  // SLIDE SHOW TAB & FULLSCREEN PRESENTER HUD WITH SEQUENTIAL ANIMATION REVEAL
  // =========================================================================
  let presenterAnimStep = 0;

    function resolvePresenterTransition(slide) {
    const t = slide?.transition || currentTransition || 'fade';
    const spd = slide?.transitionSpeed || currentTransitionSpeed || '0.45s';
    if (t === 'fade') return `k-trans-fade ${spd} ease`;
    if (t === 'push-left' || t === 'slide-push') return `k-trans-push-left ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    if (t === 'push-right') return `k-trans-push-right ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    if (t === 'push-up') return `k-trans-push-up ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    if (t === 'push-down') return `k-trans-push-down ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    if (t === 'wipe-right') return `k-trans-wipe-right ${spd} ease-out`;
    if (t === 'wipe-down') return `k-trans-wipe-down ${spd} ease-out`;
    if (t === 'zoom-in') return `k-trans-zoom-in ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    if (t === 'zoom-out') return `k-trans-zoom-out ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    if (t === 'flip') return `k-trans-flip ${spd} ease-out`;
    if (t === 'cube') return `k-trans-cube-left ${spd} cubic-bezier(0.16, 1, 0.3, 1)`;
    if (t === 'dissolve') return `k-trans-dissolve ${spd} ease-in-out`;
    return 'none';
  }

  function launchPresenter(startIndex = 0) {
    isPresenting = true;
    presenterOverlay.classList.add('active');
    currentSlideIndex = startIndex;
    updatePresenterSlide();

    // Start timer
    timerSeconds = 0;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timerSeconds++;
      const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
      const s = String(timerSeconds % 60).padStart(2, '0');
      if (hudTimer) hudTimer.textContent = `${m}:${s}`;
    }, 1000);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  function exitPresenter() {
    isPresenting = false;
    presenterOverlay.classList.remove('active');
    if (timerInterval) clearInterval(timerInterval);
    laserDot.style.display = 'none';
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Enhanced Dual-Display Presenter Studio
  let isPenActive = false;
  let isPenDrawing = false;
  let penCanvas = null;
  let penCtx = null;

  function updatePresenterSlide() {
    const slide = slidesData[currentSlideIndex];
    if (!slide) return;
    presenterAnimStep = 0;

    hudStepper.textContent = `${currentSlideIndex + 1} / ${slidesData.length}`;
    const nextSlide = slidesData[currentSlideIndex + 1];

    presenterSlideMount.innerHTML = `
      <div class="presenter-studio-dual">
        <!-- Live Current Slide Viewport -->
        <div class="presenter-live-frame" id="presenter-live-frame-clicker" style="cursor:pointer;" title="Click to reveal next animation or advance slide">
          <div class="kinetic-slide-frame ${currentTheme}" id="presenter-active-slide-frame" style="width:100%; height:100%; box-shadow:none; border:none; pointer-events:none; animation:${resolvePresenterTransition(slide)};">
            <div>
              <div class="slide-tag-pill" id="slide-tag">${slide.tag}</div>
              <h1 class="slide-h1-editable" id="slide-title">${slide.title}</h1>
              <p class="slide-p-editable" id="slide-desc">${slide.desc}</p>
            </div>
            <div id="presenter-diagram-mount" style="flex:1; width:100%; display:flex; flex-direction:column; min-height:0; overflow:hidden;"></div>
          </div>
          <canvas id="presenter-draw-canvas" class="presenter-draw-canvas ${isPenActive ? 'drawing-active' : ''}"></canvas>
        </div>

        <!-- Presenter Control Console Aside -->
        <aside class="presenter-stage-aside">
          <div>
            <span style="font-size:11px; font-weight:700; color:#94a3b8; letter-spacing:0.05em;">NEXT SLIDE PREVIEW</span>
            <div class="presenter-next-preview">
              ${nextSlide ? `
                <span style="font-size:9px; font-weight:800; color:#c43e1c; text-transform:uppercase;">${nextSlide.tag}</span>
                <strong style="font-size:13px; color:#ffffff; margin:4px 0;">${nextSlide.title}</strong>
                <span style="font-size:11px; color:#94a3b8; line-height:1.3;">${(nextSlide.desc || '').slice(0, 75)}...</span>
              ` : `
                <div style="text-align:center; color:#64748b; font-size:12px;">End of Presentation</div>
              `}
            </div>
          </div>

          <div style="display:flex; flex-direction:column; flex:1;">
            <span style="font-size:11px; font-weight:700; color:#94a3b8; letter-spacing:0.05em; margin-bottom:4px;">SPEAKER NOTES</span>
            <div class="presenter-notes-box">
              ${slide.notes ? slide.notes : '<em style="color:#64748b;">No speaker notes for this slide.</em>'}
            </div>
          </div>
        </aside>
      </div>
    `;

    // Render live diagram into presenter viewport
    const presDiagramMount = presenterSlideMount.querySelector('#presenter-diagram-mount');
    if (presDiagramMount) {
      renderSlideDiagram(presDiagramMount, slide, null, true);
    }

    // Hide entrance animation elements initially
    const presFrame = presenterSlideMount.querySelector('#presenter-active-slide-frame');
    if (presFrame && slide.animations && slide.animations.length > 0) {
      slide.animations.forEach(anim => {
        if (anim.type === 'entrance') {
          const el = presFrame.querySelector(anim.targetSelector);
          if (el) {
            el.style.opacity = '0';
          }
        }
      });
    }

    // Click on live slide view advances animation or slide
    presenterSlideMount.querySelector('#presenter-live-frame-clicker')?.addEventListener('click', (e) => {
      if (!isPenActive && !isPenDrawing) {
        advancePresenter();
      }
    });

    // Setup Pen Drawing Canvas
    penCanvas = presenterSlideMount.querySelector('#presenter-draw-canvas');
    if (penCanvas) {
      penCanvas.width = penCanvas.offsetWidth || 800;
      penCanvas.height = penCanvas.offsetHeight || 500;
      penCtx = penCanvas.getContext('2d');
      if (penCtx) {
        penCtx.lineWidth = 3;
        penCtx.lineCap = 'round';
        penCtx.strokeStyle = '#ef4444';
      }

      penCanvas.addEventListener('mousedown', (e) => {
        if (!isPenActive || !penCtx) return;
        isPenDrawing = true;
        const rect = penCanvas.getBoundingClientRect();
        penCtx.beginPath();
        penCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      });

      penCanvas.addEventListener('mousemove', (e) => {
        if (!isPenDrawing || !isPenActive || !penCtx) return;
        const rect = penCanvas.getBoundingClientRect();
        penCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        penCtx.stroke();
      });

      window.addEventListener('mouseup', () => { isPenDrawing = false; });
    }
  }

  function advancePresenter() {
    const slide = slidesData[currentSlideIndex];
    if (slide && slide.animations && presenterAnimStep < slide.animations.length) {
      const presFrame = presenterSlideMount.querySelector('#presenter-active-slide-frame');
      const anim = slide.animations[presenterAnimStep];
      if (presFrame) {
        const el = presFrame.querySelector(anim.targetSelector);
        if (el) {
          if (anim.type === 'entrance') el.style.opacity = '1';
          el.style.animation = 'none';
          el.offsetHeight; // reflow
          el.style.animation = `${anim.effect} ${anim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
        }
      }
      presenterAnimStep++;

      // Trigger chained 'withPrev' animations
      while (presenterAnimStep < slide.animations.length && slide.animations[presenterAnimStep].trigger === 'withPrev') {
        const chainedAnim = slide.animations[presenterAnimStep];
        if (presFrame) {
          const el = presFrame.querySelector(chainedAnim.targetSelector);
          if (el) {
            if (chainedAnim.type === 'entrance') el.style.opacity = '1';
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = `${chainedAnim.effect} ${chainedAnim.duration || 0.6}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
          }
        }
        presenterAnimStep++;
      }
      return;
    }

    // Advance to next slide if all animations played
    if (currentSlideIndex < slidesData.length - 1) {
      switchSlide(currentSlideIndex + 1);
    }
  }

  container.querySelector('#btn-quick-present')?.addEventListener('click', () => launchPresenter(currentSlideIndex));
  container.querySelector('#btn-present-start')?.addEventListener('click', () => launchPresenter(0));
  container.querySelector('#btn-present-current')?.addEventListener('click', () => launchPresenter(currentSlideIndex));

  // ── Mobile Touch Navigation Pill & Swipe Gestures ─────────────
  const mobilePrev = container.querySelector('#btn-kinetic-mobile-prev');
  const mobileNext = container.querySelector('#btn-kinetic-mobile-next');
  const mobilePresent = container.querySelector('#btn-kinetic-mobile-present');

  mobilePrev?.addEventListener('click', () => {
    if (currentSlideIndex > 0) switchSlide(currentSlideIndex - 1);
  });
  mobileNext?.addEventListener('click', () => {
    if (currentSlideIndex < slidesData.length - 1) switchSlide(currentSlideIndex + 1);
  });
  mobilePresent?.addEventListener('click', () => {
    launchPresenter(currentSlideIndex);
  });
  container.querySelector('#btn-kinetic-mobile-add')?.addEventListener('click', () => {
    container.querySelector('#btn-kinetic-new-slide-btn')?.click();
  });

  // Mobile Touch Swipe Navigation (Swipe Left = Next, Swipe Right = Prev)
  let touchStartX = 0;
  let touchStartY = 0;
  const stageViewport = container.querySelector('#kinetic-stage-viewport');
  stageViewport?.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  stageViewport?.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX < 0) {
          if (currentSlideIndex < slidesData.length - 1) switchSlide(currentSlideIndex + 1);
        } else {
          if (currentSlideIndex > 0) switchSlide(currentSlideIndex - 1);
        }
      }
    }
  }, { passive: true });

  hudPrev?.addEventListener('click', () => {
    if (presenterAnimStep > 0) {
      updatePresenterSlide();
    } else if (currentSlideIndex > 0) {
      switchSlide(currentSlideIndex - 1);
    }
  });

  hudNext?.addEventListener('click', advancePresenter);

  hudExit?.addEventListener('click', exitPresenter);

  // Laser pointer toggle
  const hudPen = container.querySelector('#btn-hud-pen');
  const hudClearPen = container.querySelector('#btn-hud-clear-pen');

  hudPen?.addEventListener('click', () => {
    isPenActive = !isPenActive;
    hudPen.style.color = isPenActive ? '#38bdf8' : '#ffffff';
    if (penCanvas) penCanvas.classList.toggle('drawing-active', isPenActive);
  });

  hudClearPen?.addEventListener('click', () => {
    if (penCanvas && penCtx) {
      penCtx.clearRect(0, 0, penCanvas.width, penCanvas.height);
    }
  });

  hudLaser?.addEventListener('click', () => {
    laserActive = !laserActive;
    hudLaser.style.color = laserActive ? '#ef4444' : '#ffffff';
    laserDot.style.display = laserActive ? 'block' : 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (isPresenting && laserActive) {
      laserDot.style.left = `${e.clientX}px`;
      laserDot.style.top = `${e.clientY}px`;
    }
  });

  // Global Keyboard Navigation & Presentation Shortcuts
  window.addEventListener('keydown', (e) => {
    const target = e.target;
    if (target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

    if (e.key === 'Escape') {
      if (isPresenting) {
        exitPresenter();
      } else {
        clearShapeSelection();
        window.kineticAiStudio?.close();
      }
      return;
    }

    if ((e.altKey && e.key.toLowerCase() === 'j') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j')) {
      e.preventDefault();
      window.kineticAiStudio?.open();
      return;
    }

    // F5 starts presentation mode
    if (e.key === 'F5') {
      e.preventDefault();
      launchPresenter(e.shiftKey ? currentSlideIndex : 0);
      return;
    }

    if (isPresenting) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') {
        e.preventDefault();
        advancePresenter();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (presenterAnimStep > 0) {
          updatePresenterSlide();
        } else if (currentSlideIndex > 0) {
          switchSlide(currentSlideIndex - 1);
        }
      }
      return;
    }

    // Ctrl Shortcuts
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase();
      if (k === 'a') {
        e.preventDefault();
        objectsContainer.querySelectorAll('.kinetic-shape-item').forEach(s => selectShape(s, true));
        return;
      }
      if (k === 'd') {
        e.preventDefault();
        if (selectedShapes.size > 0) {
          const clones = [];
          selectedShapes.forEach(shape => {
            const clone = shape.cloneNode(true);
            clone.style.left = `${(parseInt(shape.style.left, 10) || 100) + 20}px`;
            clone.style.top = `${(parseInt(shape.style.top, 10) || 100) + 20}px`;
            makeDraggable(clone);
            clone.addEventListener('dblclick', () => clone.remove());
            objectsContainer.appendChild(clone);
            clones.push(clone);
          });
          clearShapeSelection();
          clones.forEach(c => selectShape(c, true));
          saveDeck();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Duplicated selected shape(s)');
        } else {
          // Duplicate active slide
          const current = slidesData[currentSlideIndex];
          if (current) {
            const dup = JSON.parse(JSON.stringify(current));
            dup.id = Date.now();
            dup.title = (dup.title || 'Slide') + ' (Copy)';
            slidesData.splice(currentSlideIndex + 1, 0, dup);
            currentSlideIndex++;
            saveDeck();
            renderThumbnails();
            switchSlide(currentSlideIndex);
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Duplicated active slide (Ctrl+D)');
          }
        }
        return;
      }
      if (k === 'p') {
        e.preventDefault();
        if (window.giriPrintManager) {
          window.giriPrintManager.open({ toolType: 'presentation', documentTitle: 'Presentation - Giri Kinetic', contentElement: slideFrame });
        } else {
          window.print();
        }
        return;
      }
    }

    // Delete / Backspace removes selected shapes or active slide
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedShapes.size > 0) {
        e.preventDefault();
        selectedShapes.forEach(s => s.remove());
        selectedShapes.clear();
        saveDeck();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Deleted selected shape(s)');
        return;
      } else if (slidesData.length > 1) {
        e.preventDefault();
        slidesData.splice(currentSlideIndex, 1);
        currentSlideIndex = Math.max(0, Math.min(currentSlideIndex, slidesData.length - 1));
        saveDeck();
        renderThumbnails();
        switchSlide(currentSlideIndex);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Deleted active slide');
        return;
      }
    }

    // Arrow keys nudge selected shape(s)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (selectedShapes.size > 0) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 2;
        selectedShapes.forEach(shape => {
          let left = parseInt(shape.style.left, 10) || shape.offsetLeft;
          let top = parseInt(shape.style.top, 10) || shape.offsetTop;
          if (e.key === 'ArrowUp') top -= delta;
          if (e.key === 'ArrowDown') top += delta;
          if (e.key === 'ArrowLeft') left -= delta;
          if (e.key === 'ArrowRight') left += delta;
          shape.style.left = `${left}px`;
          shape.style.top = `${top}px`;
        });
        saveDeck();
        return;
      }
    }
  });

  // =========================================================================
  // VIEW TAB CONTROLS: SPEAKER NOTES & ZOOM
  // =========================================================================
  const viewNotesBtn = container.querySelector('#btn-view-notes');
  let notesVisible = true;
  viewNotesBtn?.addEventListener('click', () => {
    notesVisible = !notesVisible;
    viewNotesBtn.classList.toggle('active', notesVisible);
    if (notesDrawer) notesDrawer.style.display = notesVisible ? 'flex' : 'none';
  });

  container.querySelector('#chk-kinetic-slide-num')?.addEventListener('change', (e) => {
    if (slideNumIndicator) slideNumIndicator.style.display = e.target.checked ? '' : 'none';
  });

  container.querySelector('#kinetic-zoom-select')?.addEventListener('change', (e) => {
    slideFrame.style.transform = `scale(${e.target.value})`;
    slideFrame.style.transformOrigin = 'center center';
  });

  // Export Modal
  container.querySelector('#btn-kinetic-export')?.addEventListener('click', () => {
    if (window.orbitPlatform) {
      window.orbitPlatform.openExportModal('kinetic');
    }
  });

  
  // Alias functions to ensure no runtime errors from menu handlers
  // ── Insert Tab: Table Picker ─────────────────────────────────
  const tablePicker = container.querySelector('#kinetic-table-picker');
  const tablePickerGrid = container.querySelector('#table-picker-grid');
  const tablePickerLabel = container.querySelector('#table-picker-label');
  const insertTableBtn = container.querySelector('#btn-kinetic-insert-table');
  if (insertTableBtn && tablePicker && tablePickerGrid) {
    for (let r = 1; r <= 8; r++) {
      for (let c = 1; c <= 8; c++) {
        const cell = document.createElement('div');
        cell.style.cssText = 'width:16px;height:16px;border:1px solid #334155;border-radius:2px;cursor:pointer;background:#1e293b;transition:background 0.1s;';
        cell.dataset.r = r; cell.dataset.c = c;
        cell.addEventListener('mouseenter', () => {
          tablePickerGrid.querySelectorAll('div').forEach(d => {
            d.style.background = (parseInt(d.dataset.r) <= r && parseInt(d.dataset.c) <= c) ? '#2563eb' : '#1e293b';
          });
          tablePickerLabel.textContent = `${r} × ${c}`;
        });
        cell.addEventListener('click', () => {
          tablePicker.style.display = 'none';
          let html = `<table style="border-collapse:collapse;width:100%;"><tbody>`;
          for (let tr = 0; tr < r; tr++) {
            html += '<tr>';
            for (let tc = 0; tc < c; tc++) {
              html += tr === 0
                ? `<th style="border:1px solid #cbd5e1;padding:5px 8px;background:#f1f5f9;font-size:11px;font-weight:700;" contenteditable="true">${tc === 0 ? 'Header' : 'Column ' + (tc+1)}</th>`
                : `<td style="border:1px solid #cbd5e1;padding:5px 8px;font-size:11px;" contenteditable="true"></td>`;
            }
            html += '</tr>';
          }
          html += '</tbody></table>';
          const obj = document.createElement('div');
          obj.style.cssText = 'position:absolute;top:80px;left:60px;z-index:10;cursor:move;min-width:180px;';
          obj.innerHTML = html;
          obj.setAttribute('data-shape-type','table');
          const canvas = slideFrame.querySelector('#slide-canvas-objects');
          if (canvas) { canvas.style.pointerEvents = 'all'; canvas.appendChild(obj); }
          saveDeck();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted ${r}×${c} table`);
        });
        tablePickerGrid.appendChild(cell);
      }
    }
    insertTableBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const show = tablePicker.style.display === 'none';
      tablePicker.style.display = show ? 'block' : 'none';
      if (show) {
        const rect = insertTableBtn.getBoundingClientRect();
        tablePicker.style.top = (rect.bottom + 4) + 'px';
        tablePicker.style.left = rect.left + 'px';
      }
    });
    document.addEventListener('click', () => { if (tablePicker) tablePicker.style.display = 'none'; });
  }

  // ── Insert Tab: Charts ───────────────────────────────────────
  container.querySelectorAll('[data-chart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.chart;
      const colors = ['#2563eb','#059669','#d97706','#dc2626','#7c3aed'];
      const data = [65,40,80,55,72];
      const labels = ['Q1','Q2','Q3','Q4','Q5'];
      let svg = '';
      if (t === 'bar') {
        svg = `<svg viewBox="0 0 210 120" width="210" height="120">${data.map((v,i) => `<rect x="${12+i*38}" y="${118-v}" width="30" height="${v}" fill="${colors[i]}" rx="2"/><text x="${27+i*38}" y="116" font-size="9" text-anchor="middle" fill="#64748b">${labels[i]}</text>`).join('')}</svg>`;
      } else if (t === 'line') {
        svg = `<svg viewBox="0 0 210 120" width="210" height="120"><polyline points="${data.map((v,i) => `${12+i*42},${110-v}`).join(' ')}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>${data.map((v,i) => `<circle cx="${12+i*42}" cy="${110-v}" r="3" fill="#2563eb"/>`).join('')}</svg>`;
      } else if (t === 'pie' || t === 'donut') {
        const total = data.reduce((a,b) => a+b, 0);
        let angle = -Math.PI/2;
        const r2 = t === 'donut' ? 44 : 54;
        const ir = t === 'donut' ? 26 : 0;
        const slices = data.map((v,i) => { const s=angle; angle+=v/total*2*Math.PI; return {v,i,s,e:angle}; });
        svg = `<svg viewBox="0 0 120 120" width="120" height="120">${slices.map(sl => {
          const x1=60+r2*Math.cos(sl.s),y1=60+r2*Math.sin(sl.s),x2=60+r2*Math.cos(sl.e),y2=60+r2*Math.sin(sl.e);
          const lg = sl.e-sl.s>Math.PI?1:0;
          if (ir) { const ix1=60+ir*Math.cos(sl.s),iy1=60+ir*Math.sin(sl.s),ix2=60+ir*Math.cos(sl.e),iy2=60+ir*Math.sin(sl.e); return `<path d="M ${ix1} ${iy1} L ${x1} ${y1} A ${r2} ${r2} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${lg} 0 ${ix1} ${iy1} Z" fill="${colors[sl.i]}"/>`; }
          return `<path d="M 60 60 L ${x1} ${y1} A ${r2} ${r2} 0 ${lg} 1 ${x2} ${y2} Z" fill="${colors[sl.i]}"/>`;
        }).join('')}</svg>`;
      } else {
        svg = `<svg viewBox="0 0 210 120" width="210" height="120">${data.map((v,i) => `<rect x="${12+i*38}" y="45" width="30" height="${v}" fill="${colors[i]}" opacity="0.5"/>`).join('')}</svg>`;
      }
      const obj = document.createElement('div');
      obj.style.cssText = 'position:absolute;top:80px;left:80px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;z-index:10;cursor:move;';
      obj.innerHTML = `<div style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">${t.toUpperCase()} CHART</div>${svg}`;
      obj.setAttribute('data-shape-type','chart');
      const canvas = slideFrame.querySelector('#slide-canvas-objects');
      if (canvas) { canvas.style.pointerEvents='all'; canvas.appendChild(obj); }
      saveDeck();
      if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted ${t} chart`);
    });
  });

  // ── Insert Tab: WordArt ──────────────────────────────────────
  container.querySelector('#btn-kinetic-wordart')?.addEventListener('click', () => {
    const text = prompt('WordArt text:', 'Your Text Here');
    if (!text) return;
    const styles = ['background:linear-gradient(90deg,#a855f7,#3b82f6);','background:linear-gradient(90deg,#f59e0b,#ef4444);','background:linear-gradient(90deg,#10b981,#3b82f6);'];
    const st = styles[Math.floor(Math.random()*styles.length)];
    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;top:60px;left:60px;z-index:10;cursor:move;padding:8px;';
    obj.innerHTML = `<div contenteditable="true" style="font-size:36px;font-weight:900;${st}-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-family:Plus Jakarta Sans,system-ui;letter-spacing:-1px;">${text}</div>`;
    obj.setAttribute('data-shape-type','wordart');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) { canvas.style.pointerEvents='all'; canvas.appendChild(obj); }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted WordArt');
  });

  // ── Insert Tab: Hyperlink ────────────────────────────────────
  container.querySelector('#btn-kinetic-insert-link')?.addEventListener('click', () => {
    const url = prompt('Enter URL:', 'https://');
    const label = url ? (prompt('Link label:', url) || url) : null;
    if (!url || !label) return;
    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;top:120px;left:80px;z-index:10;cursor:move;';
    obj.innerHTML = `<a href="${url}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;font-size:14px;font-weight:500;">${label}</a>`;
    obj.setAttribute('data-shape-type','hyperlink');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) { canvas.style.pointerEvents='all'; canvas.appendChild(obj); }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted hyperlink');
  });

  // ── Insert Tab: Date & Time ──────────────────────────────────
  container.querySelector('#btn-kinetic-insert-date')?.addEventListener('click', () => {
    const dateStr = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;bottom:40px;left:30px;z-index:10;cursor:move;padding:4px 8px;';
    obj.innerHTML = `<span contenteditable="true" style="font-size:12px;color:currentColor;opacity:0.65;font-style:italic;">${dateStr}</span>`;
    obj.setAttribute('data-shape-type','date');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) { canvas.style.pointerEvents='all'; canvas.appendChild(obj); }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted date & time');
  });

  // ── Insert Tab: Slide Number ─────────────────────────────────
  container.querySelector('#btn-kinetic-insert-slidenum')?.addEventListener('click', () => {
    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;bottom:14px;right:50px;z-index:10;cursor:move;';
    obj.innerHTML = `<span style="font-size:11px;font-weight:600;opacity:0.5;">${currentSlideIndex+1}</span>`;
    obj.setAttribute('data-shape-type','slidenum');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) { canvas.style.pointerEvents='all'; canvas.appendChild(obj); }
    saveDeck();
  });

  // ── Insert Tab: Equation ─────────────────────────────────────
  container.querySelector('#btn-kinetic-equation')?.addEventListener('click', () => {
    const eq = prompt('Enter equation:', 'E = mc²');
    if (!eq) return;
    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;top:150px;left:120px;z-index:10;cursor:move;padding:8px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;backdrop-filter:blur(4px);';
    obj.innerHTML = `<span contenteditable="true" style="font-size:22px;font-family:serif;font-style:italic;">${eq}</span>`;
    obj.setAttribute('data-shape-type','equation');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) { canvas.style.pointerEvents='all'; canvas.appendChild(obj); }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted equation');
  });

  // ── Insert Tab: Symbol ───────────────────────────────────────
  container.querySelector('#btn-kinetic-symbol')?.addEventListener('click', () => {
    const syms = ['₹','©','®','™','$','€','£','¥','°','±','×','÷','∞','√','∑','∆','∫','≈','≠','≤','≥','←','→','↑','↓','⭐','♦','▲','●','■'];
    const sym = prompt('Pick symbol:\n\n' + syms.join('  ') + '\n\nOr type your own:', '₹');
    if (!sym) return;
    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;top:120px;left:100px;z-index:10;cursor:move;padding:4px;';
    obj.innerHTML = `<span contenteditable="true" style="font-size:32px;">${sym}</span>`;
    obj.setAttribute('data-shape-type','symbol');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) { canvas.style.pointerEvents='all'; canvas.appendChild(obj); }
    saveDeck();
  });

  // ── Thesaurus Lookup ─────────────────────────────────────────
  const openKineticThesaurus = () => {
    const sel = window.getSelection()?.toString().trim();
    thesaurusManager.open(sel || '', (replacement) => {
      if (document.activeElement && document.activeElement.isContentEditable) {
        document.execCommand('insertText', false, replacement);
        saveDeck();
      } else {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Selected synonym: "${replacement}" (Copied)`);
        navigator.clipboard?.writeText(replacement);
      }
    });
  };

  container.querySelector('#btn-kinetic-thesaurus')?.addEventListener('click', openKineticThesaurus);
  container.querySelector('#btn-kinetic-insert-thesaurus')?.addEventListener('click', openKineticThesaurus);

  // ── Save Current Deck as Custom Template ───────────────────────
  container.querySelector('#btn-kinetic-save-custom-template')?.addEventListener('click', () => {
    const currentTitle = slidesData[0]?.title || 'Custom Presentation';
    const name = prompt('Enter custom template name:', currentTitle);
    if (!name) return;
    const desc = prompt('Enter template description:', 'Saved executive custom presentation deck');

    const newTpl = {
      id: 'custom-deck-' + Date.now(),
      name,
      category: 'custom',
      desc: desc || 'Custom presentation template',
      previewAccent: slidesData[0]?.accent || '#2563eb',
      previewBg: slidesData[0]?.bg || '#0f172a',
      slides: JSON.parse(JSON.stringify(slidesData))
    };

    let storedCustom = [];
    try {
      const existing = localStorage.getItem('giri_orbit_kinetic_custom_templates');
      if (existing) storedCustom = JSON.parse(existing);
    } catch (e) {}

    storedCustom.push(newTpl);
    localStorage.setItem('giri_orbit_kinetic_custom_templates', JSON.stringify(storedCustom));
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Saved "${name}" as custom presentation template!`);
  });

  // ── Import Custom Template into Editor ─────────────────────────
  const editorKineticImportInput = container.querySelector('#kinetic-editor-import-tpl-input');
  container.querySelector('#btn-kinetic-import-custom-template')?.addEventListener('click', () => {
    editorKineticImportInput?.click();
  });
  editorKineticImportInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const raw = evt.target.result;
        let importedSlides = [];
        let tplName = file.name.replace(/\.[^/.]+$/, '');
        let desc = `Imported presentation template (${file.name})`;
        let previewAccent = '#3b82f6';
        let previewBg = '#0f172a';

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            importedSlides = parsed;
          } else if (parsed.slides && Array.isArray(parsed.slides)) {
            importedSlides = parsed.slides;
            if (parsed.name) tplName = parsed.name;
            if (parsed.desc) desc = parsed.desc;
            if (parsed.previewAccent) previewAccent = parsed.previewAccent;
            if (parsed.previewBg) previewBg = parsed.previewBg;
          } else {
            importedSlides = [parsed];
          }
        } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          const rawSections = raw.split(/\n---+\n/);
          rawSections.forEach((sec, sIdx) => {
            const lines = sec.trim().split('\n').map(l => l.trim()).filter(Boolean);
            if (!lines.length) return;
            let sTitle = `Slide ${sIdx + 1}`;
            let sDesc = '';
            let sTag = `PART ${sIdx + 1}`;
            const features = [];

            lines.forEach(line => {
              if (line.startsWith('# ')) {
                sTitle = line.slice(2).trim();
                if (sIdx === 0) tplName = sTitle;
              } else if (line.startsWith('## ') || line.startsWith('### ')) {
                sDesc = line.replace(/^#+\s*/, '').trim();
              } else if (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\.\s/)) {
                features.push({
                  num: `0${features.length + 1}`,
                  title: line.replace(/^[-*\d.]+\s*/, '').trim(),
                  desc: ''
                });
              } else if (!sDesc && !line.startsWith('#')) {
                sDesc = line;
              }
            });

            importedSlides.push({
              id: Date.now() + sIdx,
              layout: sIdx === 0 ? 'title' : (features.length >= 3 ? 'circular-loop' : 'chevron-flow'),
              tag: sTag,
              title: sTitle,
              desc: sDesc || 'Key strategic overview points',
              accent: previewAccent,
              bg: sIdx === 0 ? '#0f172a' : '#ffffff',
              features: features.length ? features : [
                { num: '01', title: 'Strategy', desc: 'Core execution milestone' }
              ]
            });
          });
        }

        if (importedSlides.length > 0) {
          const newTpl = {
            id: 'custom-deck-' + Date.now(),
            name: tplName,
            category: 'custom',
            desc,
            previewAccent,
            previewBg,
            slides: importedSlides
          };
          let storedCustom = [];
          try {
            const existing = localStorage.getItem('giri_orbit_kinetic_custom_templates');
            if (existing) storedCustom = JSON.parse(existing);
          } catch (e) {}
          storedCustom.push(newTpl);
          localStorage.setItem('giri_orbit_kinetic_custom_templates', JSON.stringify(storedCustom));

          const loadChoice = confirm(`Imported "${tplName}" (${importedSlides.length} slides).\n\nClick OK to replace current presentation, or Cancel to keep working.`);
          if (loadChoice) {
            slidesData = importedSlides;
            currentSlideIndex = 0;
            renderNavThumbnails();
            renderActiveSlide();
            saveDeck();
          }
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported custom template "${tplName}"!`);
        }
      } catch (err) {
        alert('Failed to import template: ' + err.message);
      }
    };
    reader.readAsText(file);
    editorKineticImportInput.value = '';
  });

  // ── Review Tab: Spell Check ──────────────────────────────────
  container.querySelector('#btn-kinetic-spellcheck')?.addEventListener('click', () => {
    slideFrame.querySelectorAll('[contenteditable]').forEach(el => el.setAttribute('spellcheck','true'));
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Spell check enabled on all slide text');
  });

  // ── Review Tab: Word Count ───────────────────────────────────
  container.querySelector('#btn-kinetic-word-count-btn')?.addEventListener('click', () => {
    let total = 0;
    slidesData.forEach(s => {
      [s.title||'',s.desc||'',s.tag||''].forEach(t => { total += t.split(/\s+/).filter(Boolean).length; });
      (s.features||[]).forEach(f => { total += ((f.title||'').split(/\s+/).filter(Boolean).length + (f.desc||'').split(/\s+/).filter(Boolean).length); });
    });
    alert(`Presentation Statistics\n\nSlides: ${slidesData.length}\nWord Count: ~${total} words\nEst. Read Time: ~${Math.ceil(total/130)} min\nEst. Speak Time: ~${Math.ceil(total/100)} min (100 wpm)`);
  });

  // ── Review Tab: New Comment ──────────────────────────────────
  container.querySelector('#btn-kinetic-new-comment')?.addEventListener('click', () => {
    const text = prompt('Add a comment to slide ' + (currentSlideIndex+1) + ':');
    if (!text) return;
    if (!slidesData[currentSlideIndex].comments) slidesData[currentSlideIndex].comments = [];
    slidesData[currentSlideIndex].comments.push({text, author:'You', time:new Date().toLocaleTimeString()});
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Comment added to slide ' + (currentSlideIndex+1));
  });

  // ── Review Tab: Accessibility Check ─────────────────────────
  container.querySelector('#btn-kinetic-accessibility')?.addEventListener('click', () => {
    const issues = [];
    slidesData.forEach((s, i) => {
      if (!s.title || s.title === 'Click to add title') issues.push(`Slide ${i+1}: Missing title`);
      if (!s.desc && !s.features?.length) issues.push(`Slide ${i+1}: No content — consider adding body text or nodes`);
    });
    alert('Accessibility Check\n\n' + (issues.length ? issues.join('\n') : '✓ All slides have titles and content. No issues found.'));
  });

  // ── Review Tab: Translate ────────────────────────────────────
  container.querySelector('#btn-kinetic-translate')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Translation: Select text on the slide and right-click → Translate in your browser');
  });

  // ── Review Tab: Read Aloud ────────────────────────────────────
  container.querySelector('#btn-kinetic-read-aloud')?.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const current = slidesData[currentSlideIndex];
    if (!current) return;
    const toSpeak = [
      current.title || '',
      current.desc || '',
      ...(current.features || []).map(f => `${f.title || ''}. ${f.desc || ''}`),
      current.notes ? `Speaker notes: ${current.notes}` : ''
    ].filter(Boolean).join('. ');

    if (!toSpeak.trim()) {
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Slide has no text to read.');
      return;
    }
    const utter = new SpeechSynthesisUtterance(toSpeak);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Reading slide text aloud...');
  });

  // ── SmartArt Diagram Inserter ─────────────────────────────────
  function openKineticSmartArtModal() {
    let modal = document.getElementById('kinetic-smartart-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-smartart-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:780px;max-width:94vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);display:flex;flex-direction:column;max-height:88vh;">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #27272a;background:#18181b;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">📊</span>
              <div>
                <strong style="font-size:15px;color:#f1f5f9;">Insert SmartArt Diagram</strong>
                <p style="margin:2px 0 0 0;font-size:11.5px;color:#94a3b8;">Choose a process, hierarchy, cycle, or matrix diagram to insert onto your slide</p>
              </div>
            </div>
            <button id="btn-close-kinetic-smartart" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:20px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;">
            <!-- 1. Process Flow -->
            <div class="smartart-card" data-type="process" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px;cursor:pointer;transition:transform 0.15s, border-color 0.15s;">
              <div style="font-size:12px;font-weight:700;color:#38bdf8;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <span>➔</span> Process Flow
              </div>
              <div style="background:#0f172a;border-radius:6px;padding:10px;display:flex;align-items:center;justify-content:center;gap:6px;min-height:70px;">
                <div style="background:#2563eb;color:#fff;font-size:9px;font-weight:700;padding:4px 6px;border-radius:4px;">Step 1</div>
                <span style="color:#64748b;font-size:10px;">➔</span>
                <div style="background:#0284c7;color:#fff;font-size:9px;font-weight:700;padding:4px 6px;border-radius:4px;">Step 2</div>
                <span style="color:#64748b;font-size:10px;">➔</span>
                <div style="background:#059669;color:#fff;font-size:9px;font-weight:700;padding:4px 6px;border-radius:4px;">Step 3</div>
              </div>
              <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">Sequential workflow and milestone pipeline</p>
            </div>

            <!-- 2. Hierarchy / Org Chart -->
            <div class="smartart-card" data-type="hierarchy" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px;cursor:pointer;transition:transform 0.15s, border-color 0.15s;">
              <div style="font-size:12px;font-weight:700;color:#a855f7;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <span>△</span> Hierarchy / Tree
              </div>
              <div style="background:#0f172a;border-radius:6px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:70px;">
                <div style="background:#7c3aed;color:#fff;font-size:9px;font-weight:700;padding:3px 8px;border-radius:3px;">Leadership</div>
                <div style="width:1px;height:6px;background:#64748b;"></div>
                <div style="display:flex;gap:10px;">
                  <div style="background:#6366f1;color:#fff;font-size:8px;padding:2px 6px;border-radius:3px;">Branch A</div>
                  <div style="background:#6366f1;color:#fff;font-size:8px;padding:2px 6px;border-radius:3px;">Branch B</div>
                </div>
              </div>
              <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">Organizational and structural breakdown</p>
            </div>

            <!-- 3. Circular Cycle -->
            <div class="smartart-card" data-type="cycle" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px;cursor:pointer;transition:transform 0.15s, border-color 0.15s;">
              <div style="font-size:12px;font-weight:700;color:#10b981;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <span>⭕</span> Circular Cycle
              </div>
              <div style="background:#0f172a;border-radius:6px;padding:8px;display:flex;align-items:center;justify-content:center;min-height:70px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;width:75px;text-align:center;">
                  <div style="background:#059669;color:#fff;font-size:8px;padding:2px;border-radius:3px;">Plan</div>
                  <div style="background:#10b981;color:#fff;font-size:8px;padding:2px;border-radius:3px;">Do</div>
                  <div style="background:#14b8a6;color:#fff;font-size:8px;padding:2px;border-radius:3px;">Act</div>
                  <div style="background:#0d9488;color:#fff;font-size:8px;padding:2px;border-radius:3px;">Check</div>
                </div>
              </div>
              <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">Continuous feedback loops &amp; iterative processes</p>
            </div>

            <!-- 4. SWOT Matrix -->
            <div class="smartart-card" data-type="matrix" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px;cursor:pointer;transition:transform 0.15s, border-color 0.15s;">
              <div style="font-size:12px;font-weight:700;color:#f59e0b;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <span>⊞</span> 2×2 SWOT Matrix
              </div>
              <div style="background:#0f172a;border-radius:6px;padding:8px;display:flex;align-items:center;justify-content:center;min-height:70px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;width:95px;text-align:center;">
                  <div style="background:#22c55e;color:#fff;font-size:8px;font-weight:700;padding:3px;border-radius:2px;">Strengths</div>
                  <div style="background:#ef4444;color:#fff;font-size:8px;font-weight:700;padding:3px;border-radius:2px;">Weakness</div>
                  <div style="background:#3b82f6;color:#fff;font-size:8px;font-weight:700;padding:3px;border-radius:2px;">Opps</div>
                  <div style="background:#eab308;color:#000;font-size:8px;font-weight:700;padding:3px;border-radius:2px;">Threats</div>
                </div>
              </div>
              <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">Strategic 4-quadrant comparative analysis</p>
            </div>

            <!-- 5. Funnel Stages -->
            <div class="smartart-card" data-type="funnel" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px;cursor:pointer;transition:transform 0.15s, border-color 0.15s;">
              <div style="font-size:12px;font-weight:700;color:#ec4899;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <span>▽</span> Funnel Stages
              </div>
              <div style="background:#0f172a;border-radius:6px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:3px;min-height:70px;">
                <div style="background:#ec4899;width:75px;height:12px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;">Awareness</div>
                <div style="background:#db2777;width:55px;height:12px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;">Interest</div>
                <div style="background:#be185d;width:35px;height:12px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;">Action</div>
              </div>
              <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">Conversion, marketing &amp; sales pipeline</p>
            </div>

            <!-- 6. Chevron Journey -->
            <div class="smartart-card" data-type="chevron" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px;cursor:pointer;transition:transform 0.15s, border-color 0.15s;">
              <div style="font-size:12px;font-weight:700;color:#06b6d4;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <span>➤</span> Chevron Roadmap
              </div>
              <div style="background:#0f172a;border-radius:6px;padding:8px;display:flex;align-items:center;justify-content:center;gap:3px;min-height:70px;">
                <div style="background:#0891b2;color:#fff;font-size:8px;padding:3px 6px;clip-path:polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);">Phase 1</div>
                <div style="background:#06b6d4;color:#fff;font-size:8px;padding:3px 6px;clip-path:polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);">Phase 2</div>
                <div style="background:#22d3ee;color:#000;font-size:8px;padding:3px 6px;clip-path:polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);">Phase 3</div>
              </div>
              <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">Strategic multi-phase implementation roadmap</p>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-smartart')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      modal.querySelectorAll('.smartart-card').forEach(card => {
        card.addEventListener('mouseenter', () => { card.style.borderColor = '#38bdf8'; card.style.transform = 'translateY(-2px)'; });
        card.addEventListener('mouseleave', () => { card.style.borderColor = '#334155'; card.style.transform = 'none'; });
        card.addEventListener('click', () => {
          const type = card.dataset.type;
          insertSmartArtDiagram(type);
          modal.remove();
        });
      });
    } else {
      document.body.appendChild(modal);
    }
  }

  function insertSmartArtDiagram(type) {
    let html = '';
    if (type === 'process') {
      html = `
        <div style="display:flex;align-items:center;gap:12px;background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);border:1px solid rgba(56,189,248,0.3);border-radius:12px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,0.3);">
          <div style="flex:1;background:linear-gradient(135deg,#1e3a8a,#2563eb);border-radius:8px;padding:12px;color:#fff;">
            <div style="font-size:10px;text-transform:uppercase;opacity:0.8;font-weight:700;">Phase 01</div>
            <strong contenteditable="true" style="display:block;font-size:14px;margin:3px 0;">Discovery &amp; Research</strong>
            <p contenteditable="true" style="margin:0;font-size:11px;opacity:0.9;">Gather stakeholder requirements</p>
          </div>
          <span style="font-size:20px;color:#38bdf8;font-weight:900;">➔</span>
          <div style="flex:1;background:linear-gradient(135deg,#0369a1,#0284c7);border-radius:8px;padding:12px;color:#fff;">
            <div style="font-size:10px;text-transform:uppercase;opacity:0.8;font-weight:700;">Phase 02</div>
            <strong contenteditable="true" style="display:block;font-size:14px;margin:3px 0;">Architecture &amp; Design</strong>
            <p contenteditable="true" style="margin:0;font-size:11px;opacity:0.9;">Build models &amp; specifications</p>
          </div>
          <span style="font-size:20px;color:#38bdf8;font-weight:900;">➔</span>
          <div style="flex:1;background:linear-gradient(135deg,#047857,#059669);border-radius:8px;padding:12px;color:#fff;">
            <div style="font-size:10px;text-transform:uppercase;opacity:0.8;font-weight:700;">Phase 03</div>
            <strong contenteditable="true" style="display:block;font-size:14px;margin:3px 0;">Deployment &amp; Scale</strong>
            <p contenteditable="true" style="margin:0;font-size:11px;opacity:0.9;">Global production roll-out</p>
          </div>
        </div>
      `;
    } else if (type === 'hierarchy') {
      html = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,0.3);min-width:380px;">
          <div style="background:linear-gradient(135deg,#6d28d9,#7c3aed);color:#fff;border-radius:8px;padding:8px 20px;text-align:center;">
            <strong contenteditable="true" style="display:block;font-size:13px;">Executive Leadership</strong>
            <span contenteditable="true" style="font-size:11px;opacity:0.85;">Strategic Direction</span>
          </div>
          <div style="width:2px;height:12px;background:#64748b;"></div>
          <div style="display:flex;gap:20px;">
            <div style="background:#1e293b;border:1px solid #475569;color:#f8fafc;border-radius:8px;padding:8px 14px;text-align:center;">
              <strong contenteditable="true" style="display:block;font-size:12px;color:#a855f7;">Engineering Lead</strong>
              <span contenteditable="true" style="font-size:10.5px;color:#94a3b8;">System Architecture</span>
            </div>
            <div style="background:#1e293b;border:1px solid #475569;color:#f8fafc;border-radius:8px;padding:8px 14px;text-align:center;">
              <strong contenteditable="true" style="display:block;font-size:12px;color:#38bdf8;">Operations Lead</strong>
              <span contenteditable="true" style="font-size:10.5px;color:#94a3b8;">Execution &amp; Delivery</span>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'cycle') {
      html = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,0.3);width:340px;">
          <div style="background:linear-gradient(135deg,#065f46,#059669);color:#fff;border-radius:8px;padding:10px;text-align:center;">
            <strong contenteditable="true" style="display:block;font-size:13px;">1. Plan</strong>
            <span contenteditable="true" style="font-size:10.5px;opacity:0.85;">Define Objectives</span>
          </div>
          <div style="background:linear-gradient(135deg,#047857,#10b981);color:#fff;border-radius:8px;padding:10px;text-align:center;">
            <strong contenteditable="true" style="display:block;font-size:13px;">2. Execute</strong>
            <span contenteditable="true" style="font-size:10.5px;opacity:0.85;">Build &amp; Implement</span>
          </div>
          <div style="background:linear-gradient(135deg,#115e59,#0d9488);color:#fff;border-radius:8px;padding:10px;text-align:center;">
            <strong contenteditable="true" style="display:block;font-size:13px;">4. Optimize</strong>
            <span contenteditable="true" style="font-size:10.5px;opacity:0.85;">Iterate &amp; Refine</span>
          </div>
          <div style="background:linear-gradient(135deg,#0f766e,#14b8a6);color:#fff;border-radius:8px;padding:10px;text-align:center;">
            <strong contenteditable="true" style="display:block;font-size:13px;">3. Measure</strong>
            <span contenteditable="true" style="font-size:10.5px;opacity:0.85;">Analyze Metrics</span>
          </div>
        </div>
      `;
    } else if (type === 'matrix') {
      html = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,0.3);width:380px;">
          <div style="background:#14532d;border:1px solid #22c55e;border-radius:8px;padding:10px;color:#fff;">
            <strong contenteditable="true" style="color:#4ade80;font-size:12.5px;display:block;">STRENGTHS (S)</strong>
            <p contenteditable="true" style="margin:4px 0 0 0;font-size:11px;opacity:0.9;">• Proprietary technology<br>• Sovereign offline architecture</p>
          </div>
          <div style="background:#7f1d1d;border:1px solid #ef4444;border-radius:8px;padding:10px;color:#fff;">
            <strong contenteditable="true" style="color:#f87171;font-size:12.5px;display:block;">WEAKNESSES (W)</strong>
            <p contenteditable="true" style="margin:4px 0 0 0;font-size:11px;opacity:0.9;">• Ecosystem awareness<br>• Integration dependencies</p>
          </div>
          <div style="background:#1e3a8a;border:1px solid #3b82f6;border-radius:8px;padding:10px;color:#fff;">
            <strong contenteditable="true" style="color:#60a5fa;font-size:12.5px;display:block;">OPPORTUNITIES (O)</strong>
            <p contenteditable="true" style="margin:4px 0 0 0;font-size:11px;opacity:0.9;">• Enterprise data sovereignty<br>• Local AI agent tooling</p>
          </div>
          <div style="background:#78350f;border:1px solid #f59e0b;border-radius:8px;padding:10px;color:#fff;">
            <strong contenteditable="true" style="color:#fde047;font-size:12.5px;display:block;">THREATS (T)</strong>
            <p contenteditable="true" style="margin:4px 0 0 0;font-size:11px;opacity:0.9;">• Legacy vendor lock-in<br>• Shifting regulatory landscape</p>
          </div>
        </div>
      `;
    } else if (type === 'funnel') {
      html = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);border:1px solid rgba(236,72,153,0.3);border-radius:12px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,0.3);width:340px;">
          <div style="background:linear-gradient(90deg,#be185d,#ec4899);color:#fff;border-radius:6px;padding:8px;width:100%;text-align:center;">
            <strong contenteditable="true" style="font-size:12px;">Top of Funnel: Awareness (100%)</strong>
          </div>
          <div style="background:linear-gradient(90deg,#9d174d,#db2777);color:#fff;border-radius:6px;padding:7px;width:80%;text-align:center;">
            <strong contenteditable="true" style="font-size:11.5px;">Evaluation &amp; Intent (60%)</strong>
          </div>
          <div style="background:linear-gradient(90deg,#831843,#be185d);color:#fff;border-radius:6px;padding:6px;width:60%;text-align:center;">
            <strong contenteditable="true" style="font-size:11px;">Opportunity / Trial (30%)</strong>
          </div>
          <div style="background:linear-gradient(90deg,#701a75,#a21caf);color:#fff;border-radius:6px;padding:5px;width:40%;text-align:center;">
            <strong contenteditable="true" style="font-size:10.5px;">Closed / Won (15%)</strong>
          </div>
        </div>
      `;
    } else {
      html = `
        <div style="display:flex;align-items:center;gap:4px;background:rgba(15,23,42,0.85);backdrop-filter:blur(8px);border:1px solid rgba(6,182,212,0.3);border-radius:12px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,0.3);">
          <div style="background:linear-gradient(135deg,#0e7490,#06b6d4);color:#fff;padding:10px 20px;clip-path:polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);">
            <strong contenteditable="true" style="display:block;font-size:12.5px;">Phase 1</strong>
            <span contenteditable="true" style="font-size:10.5px;opacity:0.9;">Concept</span>
          </div>
          <div style="background:linear-gradient(135deg,#0891b2,#22d3ee);color:#0f172a;padding:10px 20px;clip-path:polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);">
            <strong contenteditable="true" style="display:block;font-size:12.5px;">Phase 2</strong>
            <span contenteditable="true" style="font-size:10.5px;opacity:0.9;">Execute</span>
          </div>
          <div style="background:linear-gradient(135deg,#0284c7,#38bdf8);color:#0f172a;padding:10px 20px;clip-path:polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%);">
            <strong contenteditable="true" style="display:block;font-size:12.5px;">Phase 3</strong>
            <span contenteditable="true" style="font-size:10.5px;opacity:0.9;">Scale</span>
          </div>
        </div>
      `;
    }

    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;top:70px;left:50px;z-index:15;cursor:move;';
    obj.innerHTML = html;
    obj.setAttribute('data-shape-type', 'smartart');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) {
      canvas.style.pointerEvents = 'all';
      canvas.appendChild(obj);
    }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted SmartArt ${type} diagram`);
  }

  // ── Audio Inserter ───────────────────────────────────────────
  function openKineticAudioModal() {
    let modal = document.getElementById('kinetic-audio-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-audio-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:480px;max-width:92vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #27272a;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">🎵</span>
              <strong style="font-size:15px;color:#f1f5f9;">Insert Audio / Narration</strong>
            </div>
            <button id="btn-close-kinetic-audio" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Upload Audio File (MP3, WAV, OGG)</label>
              <input type="file" id="kinetic-audio-file-input" accept="audio/*" style="display:block;width:100%;color:#cbd5e1;font-size:12px;background:#09090b;padding:8px;border:1px solid #3f3f46;border-radius:6px;">
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Or Audio Stream URL</label>
              <input type="text" id="kinetic-audio-url-input" placeholder="https://example.com/soundtrack.mp3" style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:12.5px;">
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px;">
              <button id="btn-cancel-kinetic-audio" style="background:transparent;border:1px solid #475569;color:#94a3b8;border-radius:6px;padding:7px 16px;font-size:12px;cursor:pointer;">Cancel</button>
              <button id="btn-confirm-kinetic-audio" style="background:#2563eb;border:none;color:#fff;border-radius:6px;padding:7px 18px;font-size:12px;font-weight:700;cursor:pointer;">Insert Audio</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-audio')?.addEventListener('click', () => modal.remove());
      modal.querySelector('#btn-cancel-kinetic-audio')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      modal.querySelector('#btn-confirm-kinetic-audio')?.addEventListener('click', () => {
        const fileInput = modal.querySelector('#kinetic-audio-file-input');
        const urlInput = modal.querySelector('#kinetic-audio-url-input');
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const audioUrl = URL.createObjectURL(file);
          insertAudioPlayer(audioUrl, file.name);
          modal.remove();
        } else if (urlInput.value.trim()) {
          insertAudioPlayer(urlInput.value.trim(), 'Web Audio');
          modal.remove();
        } else {
          alert('Please select an audio file or enter an audio URL');
        }
      });
    } else {
      document.body.appendChild(modal);
    }
  }

  function insertAudioPlayer(src, label) {
    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;top:100px;left:60px;z-index:20;cursor:move;background:#18181b;border:1px solid #3b82f6;border-radius:30px;padding:6px 14px;box-shadow:0 8px 24px rgba(0,0,0,0.5);display:flex;align-items:center;gap:10px;';
    obj.innerHTML = `
      <span style="font-size:16px;">🎵</span>
      <span contenteditable="true" style="font-size:12px;font-weight:600;color:#f1f5f9;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</span>
      <audio controls src="${src}" style="height:28px;width:180px;"></audio>
    `;
    obj.setAttribute('data-shape-type', 'audio');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) {
      canvas.style.pointerEvents = 'all';
      canvas.appendChild(obj);
    }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted audio player on slide');
  }

  // ── Video Inserter ───────────────────────────────────────────
  function openKineticVideoModal() {
    let modal = document.getElementById('kinetic-video-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-video-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:480px;max-width:92vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #27272a;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">🎬</span>
              <strong style="font-size:15px;color:#f1f5f9;">Insert Video into Slide</strong>
            </div>
            <button id="btn-close-kinetic-video" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Upload Video File (MP4, WebM)</label>
              <input type="file" id="kinetic-video-file-input" accept="video/*" style="display:block;width:100%;color:#cbd5e1;font-size:12px;background:#09090b;padding:8px;border:1px solid #3f3f46;border-radius:6px;">
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Or YouTube / Video URL</label>
              <input type="text" id="kinetic-video-url-input" placeholder="https://www.youtube.com/watch?v=..." style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:12.5px;">
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px;">
              <button id="btn-cancel-kinetic-video" style="background:transparent;border:1px solid #475569;color:#94a3b8;border-radius:6px;padding:7px 16px;font-size:12px;cursor:pointer;">Cancel</button>
              <button id="btn-confirm-kinetic-video" style="background:#2563eb;border:none;color:#fff;border-radius:6px;padding:7px 18px;font-size:12px;font-weight:700;cursor:pointer;">Insert Video</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-video')?.addEventListener('click', () => modal.remove());
      modal.querySelector('#btn-cancel-kinetic-video')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      modal.querySelector('#btn-confirm-kinetic-video')?.addEventListener('click', () => {
        const fileInput = modal.querySelector('#kinetic-video-file-input');
        const urlInput = modal.querySelector('#kinetic-video-url-input');
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const videoUrl = URL.createObjectURL(file);
          insertVideoPlayer(videoUrl, false);
          modal.remove();
        } else if (urlInput.value.trim()) {
          insertVideoPlayer(urlInput.value.trim(), true);
          modal.remove();
        } else {
          alert('Please select a video file or enter a video URL');
        }
      });
    } else {
      document.body.appendChild(modal);
    }
  }

  function insertVideoPlayer(src, isUrl) {
    let inner = '';
    const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      inner = `<iframe width="320" height="180" src="https://www.youtube-nocookie.com/embed/${ytMatch[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:8px;border:none;"></iframe>`;
    } else {
      inner = `<video controls width="320" height="180" src="${src}" style="border-radius:8px;background:#000;"></video>`;
    }

    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;top:80px;left:80px;z-index:20;cursor:move;background:#09090b;border:1px solid #3f3f46;border-radius:10px;padding:8px;box-shadow:0 12px 32px rgba(0,0,0,0.5);';
    obj.innerHTML = inner;
    obj.setAttribute('data-shape-type', 'video');
    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) {
      canvas.style.pointerEvents = 'all';
      canvas.appendChild(obj);
    }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted video player on slide');
  }

  // ── Action Buttons Inserter ───────────────────────────────────
  function openKineticActionButtonsModal() {
    let modal = document.getElementById('kinetic-actions-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-actions-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:440px;max-width:92vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #27272a;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">🔘</span>
              <strong style="font-size:15px;color:#f1f5f9;">Insert Action Navigation Button</strong>
            </div>
            <button id="btn-close-kinetic-actions" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <button class="action-btn-option" data-action="next" style="display:flex;align-items:center;gap:10px;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:8px;padding:12px;cursor:pointer;font-weight:600;font-size:12.5px;">
              <span style="background:#2563eb;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">➔</span>
              <span>Next Slide</span>
            </button>
            <button class="action-btn-option" data-action="prev" style="display:flex;align-items:center;gap:10px;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:8px;padding:12px;cursor:pointer;font-weight:600;font-size:12.5px;">
              <span style="background:#2563eb;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">⬅</span>
              <span>Prev Slide</span>
            </button>
            <button class="action-btn-option" data-action="first" style="display:flex;align-items:center;gap:10px;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:8px;padding:12px;cursor:pointer;font-weight:600;font-size:12.5px;">
              <span style="background:#0284c7;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">🏠</span>
              <span>First Slide</span>
            </button>
            <button class="action-btn-option" data-action="last" style="display:flex;align-items:center;gap:10px;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:8px;padding:12px;cursor:pointer;font-weight:600;font-size:12.5px;">
              <span style="background:#0284c7;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">🏁</span>
              <span>Last Slide</span>
            </button>
            <button class="action-btn-option" data-action="link" style="display:flex;align-items:center;gap:10px;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:8px;padding:12px;cursor:pointer;font-weight:600;font-size:12.5px;">
              <span style="background:#7c3aed;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">🔗</span>
              <span>Custom Link</span>
            </button>
            <button class="action-btn-option" data-action="info" style="display:flex;align-items:center;gap:10px;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:8px;padding:12px;cursor:pointer;font-weight:600;font-size:12.5px;">
              <span style="background:#059669;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">ℹ️</span>
              <span>Slide Info</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-actions')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      modal.querySelectorAll('.action-btn-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const act = btn.dataset.action;
          insertActionButton(act);
          modal.remove();
        });
      });
    } else {
      document.body.appendChild(modal);
    }
  }

  function insertActionButton(action) {
    let icon = '➔';
    let label = 'Next';
    let targetUrl = '';
    if (action === 'prev') { icon = '⬅'; label = 'Back'; }
    if (action === 'first') { icon = '🏠'; label = 'Home'; }
    if (action === 'last') { icon = '🏁'; label = 'End'; }
    if (action === 'info') { icon = 'ℹ️'; label = 'Info'; }
    if (action === 'link') {
      targetUrl = prompt('Enter Web URL or Slide Number (e.g., https://... or 3):', 'https://');
      if (!targetUrl) return;
      icon = '🔗'; label = 'Link';
    }

    const obj = document.createElement('div');
    obj.style.cssText = 'position:absolute;bottom:30px;right:40px;z-index:25;cursor:pointer;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:1px solid rgba(255,255,255,0.3);border-radius:24px;padding:6px 14px;box-shadow:0 6px 16px rgba(0,0,0,0.4);display:flex;align-items:center;gap:6px;user-select:none;font-weight:700;font-size:12px;';
    obj.innerHTML = `<span>${icon}</span><span contenteditable="true">${label}</span>`;
    obj.setAttribute('data-shape-type', 'action-btn');
    obj.setAttribute('data-action', action);
    if (targetUrl) obj.setAttribute('data-target-url', targetUrl);

    obj.addEventListener('click', (e) => {
      if (isPresenting || e.altKey) {
        if (action === 'next' && currentSlideIndex < slidesData.length - 1) switchSlide(currentSlideIndex + 1);
        if (action === 'prev' && currentSlideIndex > 0) switchSlide(currentSlideIndex - 1);
        if (action === 'first') switchSlide(0);
        if (action === 'last') switchSlide(slidesData.length - 1);
        if (action === 'info') alert(slidesData[currentSlideIndex]?.notes || 'No speaker notes for this slide');
        if (action === 'link') {
          const t = obj.getAttribute('data-target-url');
          if (t && t.startsWith('http')) window.open(t, '_blank');
          else if (t && !isNaN(parseInt(t))) switchSlide(Math.max(0, parseInt(t) - 1));
        }
      }
    });

    const canvas = slideFrame.querySelector('#slide-canvas-objects');
    if (canvas) {
      canvas.style.pointerEvents = 'all';
      canvas.appendChild(obj);
    }
    saveDeck();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted action button (${label})`);
  }

  // ── Slide Master Modal ───────────────────────────────────────
  function openKineticSlideMasterModal() {
    let modal = document.getElementById('kinetic-master-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-master-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:520px;max-width:92vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #27272a;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">📐</span>
              <div>
                <strong style="font-size:15px;color:#f1f5f9;">Slide Master (Universal Styling)</strong>
                <p style="margin:2px 0 0 0;font-size:11.5px;color:#94a3b8;">Set default background, typography &amp; footer for all slides</p>
              </div>
            </div>
            <button id="btn-close-kinetic-master" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Master Slide Background</label>
              <div style="display:flex;gap:8px;align-items:center;">
                <input type="color" id="kinetic-master-bg-color" value="#ffffff" style="width:36px;height:32px;border:none;border-radius:4px;cursor:pointer;background:transparent;">
                <select id="kinetic-master-bg-preset" style="flex:1;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:7px 10px;font-size:12px;">
                  <option value="#ffffff">Minimalist Clean White</option>
                  <option value="#18181b">Executive Obsidian Dark</option>
                  <option value="#0f172a">Deep Slate Navy</option>
                  <option value="linear-gradient(135deg, #0f172a, #1e293b)">Midnight Gradient</option>
                  <option value="linear-gradient(135deg, #0369a1, #0f172a)">Sapphire Horizon</option>
                  <option value="linear-gradient(135deg, #064e3b, #0f172a)">Nordic Emerald</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Master Header Font Family</label>
              <select id="kinetic-master-font" style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 10px;font-size:12.5px;">
                <option value="'Plus Jakarta Sans', system-ui, sans-serif">Plus Jakarta Sans (Modern Executive)</option>
                <option value="'Inter', system-ui, sans-serif">Inter (Clean Tech)</option>
                <option value="'Georgia', serif">Georgia (Editorial Serif)</option>
                <option value="'Playfair Display', serif">Playfair Display (Luxury High-Contrast)</option>
                <option value="'Montserrat', sans-serif">Montserrat (Bold Architectural)</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono (Technical / Code)</option>
              </select>
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Master Accent Color</label>
              <input type="color" id="kinetic-master-accent" value="#2563eb" style="width:100%;height:32px;border:none;border-radius:6px;cursor:pointer;background:transparent;">
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Master Footer Notice</label>
              <input type="text" id="kinetic-master-footer" value="© 2026 Abhinav Giri • Confidential" style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:12.5px;">
            </div>

            <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="kinetic-master-slidenums" checked> Show slide number on all slides
            </label>

            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px;">
              <button id="btn-cancel-kinetic-master" style="background:transparent;border:1px solid #475569;color:#94a3b8;border-radius:6px;padding:7px 16px;font-size:12px;cursor:pointer;">Cancel</button>
              <button id="btn-apply-kinetic-master" style="background:#2563eb;border:none;color:#fff;border-radius:6px;padding:7px 18px;font-size:12px;font-weight:700;cursor:pointer;">Apply to All Slides</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-master')?.addEventListener('click', () => modal.remove());
      modal.querySelector('#btn-cancel-kinetic-master')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      const bgPreset = modal.querySelector('#kinetic-master-bg-preset');
      const bgColor = modal.querySelector('#kinetic-master-bg-color');
      bgPreset?.addEventListener('change', () => {
        if (!bgPreset.value.includes('gradient')) bgColor.value = bgPreset.value;
      });

      modal.querySelector('#btn-apply-kinetic-master')?.addEventListener('click', () => {
        const selectedBg = bgPreset.value;
        const font = modal.querySelector('#kinetic-master-font').value;
        const accent = modal.querySelector('#kinetic-master-accent').value;
        const footer = modal.querySelector('#kinetic-master-footer').value;

        slidesData.forEach(slide => {
          slide.bg = selectedBg;
          slide.accent = accent;
          slide.masterFont = font;
          slide.footerNotice = footer;
        });

        titleEl.style.fontFamily = font;
        saveDeck();
        renderThumbnails();
        switchSlide(currentSlideIndex);
        modal.remove();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Slide Master applied to all ${slidesData.length} slides!`);
      });
    } else {
      document.body.appendChild(modal);
    }
  }

  // ── Find and Replace Modal ───────────────────────────────────
  function openKineticFindReplaceModal(startInReplace) {
    let modal = document.getElementById('kinetic-find-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-find-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:440px;max-width:92vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #27272a;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">🔍</span>
              <strong style="font-size:14.5px;color:#f1f5f9;">Find &amp; Replace</strong>
            </div>
            <button id="btn-close-kinetic-find" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:18px;display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;">Find What</label>
              <input type="text" id="kinetic-find-input" placeholder="Text to search..." style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:12.5px;">
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;">Replace With</label>
              <input type="text" id="kinetic-replace-input" placeholder="Replacement text..." style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:12.5px;">
            </div>
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#cbd5e1;cursor:pointer;">
              <input type="checkbox" id="kinetic-find-case-sensitive"> Match case
            </label>
            <div id="kinetic-find-status-pill" style="font-size:11px;color:#38bdf8;padding:4px 0;display:none;"></div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
              <button id="btn-kinetic-find-next" style="background:#1e293b;border:1px solid #475569;color:#f1f5f9;border-radius:6px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;">Find Next</button>
              <div style="display:flex;gap:8px;">
                <button id="btn-kinetic-do-replace" style="background:#2563eb;border:none;color:#fff;border-radius:6px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;">Replace</button>
                <button id="btn-kinetic-replace-all" style="background:#059669;border:none;color:#fff;border-radius:6px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;">Replace All</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-find')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      const findInput = modal.querySelector('#kinetic-find-input');
      const repInput = modal.querySelector('#kinetic-replace-input');
      const statusPill = modal.querySelector('#kinetic-find-status-pill');
      const caseBox = modal.querySelector('#kinetic-find-case-sensitive');

      let lastSearchIdx = 0;

      modal.querySelector('#btn-kinetic-find-next')?.addEventListener('click', () => {
        const q = findInput.value.trim();
        if (!q) return;
        const matchCase = caseBox.checked;
        let found = false;

        for (let i = 0; i < slidesData.length; i++) {
          const sIdx = (lastSearchIdx + i + 1) % slidesData.length;
          const s = slidesData[sIdx];
          const fullText = `${s.title||''} ${s.desc||''} ${s.tag||''} ${(s.features||[]).map(f => (f.title||'') + ' ' + (f.desc||'')).join(' ')} ${s.notes||''}`;
          const isMatch = matchCase ? fullText.includes(q) : fullText.toLowerCase().includes(q.toLowerCase());
          if (isMatch) {
            lastSearchIdx = sIdx;
            switchSlide(sIdx);
            statusPill.style.display = 'block';
            statusPill.textContent = `Match found on Slide ${sIdx + 1}`;
            found = true;
            break;
          }
        }
        if (!found) {
          statusPill.style.display = 'block';
          statusPill.textContent = `No occurrences of "${q}" found.`;
        }
      });

      modal.querySelector('#btn-kinetic-do-replace')?.addEventListener('click', () => {
        const q = findInput.value.trim();
        const rep = repInput.value;
        if (!q) return;
        const cur = slidesData[currentSlideIndex];
        if (cur) {
          const flags = caseBox.checked ? 'g' : 'gi';
          const reg = new RegExp(q, flags);
          let changed = false;
          if (cur.title && cur.title.match(reg)) { cur.title = cur.title.replace(reg, rep); changed = true; }
          if (cur.desc && cur.desc.match(reg)) { cur.desc = cur.desc.replace(reg, rep); changed = true; }
          if (cur.notes && cur.notes.match(reg)) { cur.notes = cur.notes.replace(reg, rep); changed = true; }
          if (changed) {
            saveDeck();
            switchSlide(currentSlideIndex);
            statusPill.style.display = 'block';
            statusPill.textContent = `Replaced on Slide ${currentSlideIndex + 1}`;
          }
        }
      });

      modal.querySelector('#btn-kinetic-replace-all')?.addEventListener('click', () => {
        const q = findInput.value.trim();
        const rep = repInput.value;
        if (!q) return;
        const flags = caseBox.checked ? 'g' : 'gi';
        const reg = new RegExp(q, flags);
        let count = 0;

        slidesData.forEach(s => {
          if (s.title && s.title.match(reg)) { count += (s.title.match(reg) || []).length; s.title = s.title.replace(reg, rep); }
          if (s.desc && s.desc.match(reg)) { count += (s.desc.match(reg) || []).length; s.desc = s.desc.replace(reg, rep); }
          if (s.notes && s.notes.match(reg)) { count += (s.notes.match(reg) || []).length; s.notes = s.notes.replace(reg, rep); }
          (s.features || []).forEach(f => {
            if (f.title && f.title.match(reg)) { count++; f.title = f.title.replace(reg, rep); }
            if (f.desc && f.desc.match(reg)) { count++; f.desc = f.desc.replace(reg, rep); }
          });
        });

        saveDeck();
        renderThumbnails();
        switchSlide(currentSlideIndex);
        statusPill.style.display = 'block';
        statusPill.textContent = `Replaced ${count} occurrence(s) across all slides.`;
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Replaced ${count} instances across presentation`);
      });
    } else {
      document.body.appendChild(modal);
    }
  }

  // ── Format Background Modal ──────────────────────────────────
  function openKineticFormatBgModal() {
    let modal = document.getElementById('kinetic-formatbg-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-formatbg-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:480px;max-width:92vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #27272a;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">🎨</span>
              <strong style="font-size:15px;color:#f1f5f9;">Format Slide Background</strong>
            </div>
            <button id="btn-close-kinetic-formatbg" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Solid Fill Color</label>
              <div style="display:flex;gap:10px;align-items:center;">
                <input type="color" id="kinetic-bg-solid-picker" value="#ffffff" style="width:36px;height:32px;border:none;border-radius:4px;cursor:pointer;background:transparent;">
                <div style="display:flex;gap:5px;flex-wrap:wrap;">
                  <button class="bg-swatch" data-bg="#ffffff" style="width:20px;height:20px;border-radius:50%;background:#ffffff;border:1px solid #71717a;cursor:pointer;"></button>
                  <button class="bg-swatch" data-bg="#18181b" style="width:20px;height:20px;border-radius:50%;background:#18181b;border:1px solid #71717a;cursor:pointer;"></button>
                  <button class="bg-swatch" data-bg="#0f172a" style="width:20px;height:20px;border-radius:50%;background:#0f172a;border:1px solid #71717a;cursor:pointer;"></button>
                  <button class="bg-swatch" data-bg="#fdfbf7" style="width:20px;height:20px;border-radius:50%;background:#fdfbf7;border:1px solid #71717a;cursor:pointer;"></button>
                  <button class="bg-swatch" data-bg="#064e3b" style="width:20px;height:20px;border-radius:50%;background:#064e3b;border:1px solid #71717a;cursor:pointer;"></button>
                  <button class="bg-swatch" data-bg="#4c1d95" style="width:20px;height:20px;border-radius:50%;background:#4c1d95;border:1px solid #71717a;cursor:pointer;"></button>
                </div>
              </div>
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Gradient Presets</label>
              <select id="kinetic-bg-gradient-select" style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 10px;font-size:12px;">
                <option value="">Custom / None</option>
                <option value="linear-gradient(135deg, #1e3a8a, #0f172a)">Deep Sapphire Horizon</option>
                <option value="linear-gradient(135deg, #065f46, #022c22)">Emerald Dark Canopy</option>
                <option value="linear-gradient(135deg, #7c2d12, #18181b)">Crimson Flare</option>
                <option value="linear-gradient(135deg, #4c1d95, #1e1b4b)">Purple Aurora</option>
                <option value="linear-gradient(135deg, #f8fafc, #e2e8f0)">Clean Slate Mist</option>
              </select>
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Wallpaper / Image URL</label>
              <input type="text" id="kinetic-bg-img-input" placeholder="https://images.unsplash.com/photo-..." style="width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;color:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:12.5px;">
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px;">
              <button id="btn-apply-bg-current" style="background:#2563eb;border:none;color:#fff;border-radius:6px;padding:7px 16px;font-size:12px;font-weight:600;cursor:pointer;">Apply to Current Slide</button>
              <button id="btn-apply-bg-all" style="background:#059669;border:none;color:#fff;border-radius:6px;padding:7px 16px;font-size:12px;font-weight:700;cursor:pointer;">Apply to All Slides</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-formatbg')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      const solidPicker = modal.querySelector('#kinetic-bg-solid-picker');
      const gradSelect = modal.querySelector('#kinetic-bg-gradient-select');
      const imgInput = modal.querySelector('#kinetic-bg-img-input');

      modal.querySelectorAll('.bg-swatch').forEach(s => {
        s.addEventListener('click', () => {
          solidPicker.value = s.dataset.bg;
          gradSelect.value = '';
          imgInput.value = '';
        });
      });

      const getSelectedBg = () => {
        if (imgInput.value.trim()) return `url("${imgInput.value.trim()}") center/cover no-repeat`;
        if (gradSelect.value) return gradSelect.value;
        return solidPicker.value;
      };

      modal.querySelector('#btn-apply-bg-current')?.addEventListener('click', () => {
        const bg = getSelectedBg();
        slideFrame.style.background = bg;
        if (slidesData[currentSlideIndex]) slidesData[currentSlideIndex].bg = bg;
        saveDeck();
        renderThumbnails();
        modal.remove();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Slide background updated');
      });

      modal.querySelector('#btn-apply-bg-all')?.addEventListener('click', () => {
        const bg = getSelectedBg();
        slidesData.forEach(s => s.bg = bg);
        slideFrame.style.background = bg;
        saveDeck();
        renderThumbnails();
        modal.remove();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Background applied to all ${slidesData.length} slides`);
      });
    } else {
      document.body.appendChild(modal);
    }
  }

  // ── Picture Formatting & Crop Dialog ─────────────────────────
  function openKineticPictureEditModal() {
    const activeImg = slideFrame.querySelector('#slide-canvas-objects img') || slideFrame.querySelector('img');
    if (!activeImg) {
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Please insert or select a picture on the slide first');
      return;
    }

    let modal = document.getElementById('kinetic-pic-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-pic-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width:480px;max-width:92vw;background:#18181b;border:1px solid #3f3f46;border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #27272a;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">🖼️</span>
              <strong style="font-size:15px;color:#f1f5f9;">Format Picture &amp; Crop</strong>
            </div>
            <button id="btn-close-kinetic-pic" style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;">✕</button>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Shape Crop &amp; Border Radius</label>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
                <button class="pic-shape-btn" data-radius="0" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:8px 4px;font-size:11px;cursor:pointer;">Square</button>
                <button class="pic-shape-btn" data-radius="14px" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:8px 4px;font-size:11px;cursor:pointer;">Rounded</button>
                <button class="pic-shape-btn" data-radius="50%" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:8px 4px;font-size:11px;cursor:pointer;">Circle</button>
                <button class="pic-shape-btn" data-radius="999px" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:8px 4px;font-size:11px;cursor:pointer;">Pill</button>
              </div>
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Artistic Filters</label>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
                <button class="pic-filter-btn" data-filter="none" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">Normal</button>
                <button class="pic-filter-btn" data-filter="grayscale(100%)" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">Grayscale</button>
                <button class="pic-filter-btn" data-filter="sepia(100%)" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">Sepia</button>
                <button class="pic-filter-btn" data-filter="contrast(150%) brightness(110%)" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">Vivid</button>
                <button class="pic-filter-btn" data-filter="invert(100%)" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">Invert</button>
                <button class="pic-filter-btn" data-filter="blur(2px)" style="background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">Soft Blur</button>
              </div>
            </div>

            <div>
              <label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">Rotation</label>
              <div style="display:flex;gap:8px;">
                <button id="btn-pic-rot-0" style="flex:1;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">0°</button>
                <button id="btn-pic-rot-90" style="flex:1;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">90°</button>
                <button id="btn-pic-rot-180" style="flex:1;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">180°</button>
                <button id="btn-pic-rot-270" style="flex:1;background:#1e293b;border:1px solid #334155;color:#f1f5f9;border-radius:4px;padding:6px;font-size:11px;cursor:pointer;">270°</button>
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px;">
              <button id="btn-done-kinetic-pic" style="background:#2563eb;border:none;color:#fff;border-radius:6px;padding:7px 20px;font-size:12px;font-weight:700;cursor:pointer;">Done</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#btn-close-kinetic-pic')?.addEventListener('click', () => modal.remove());
      modal.querySelector('#btn-done-kinetic-pic')?.addEventListener('click', () => { modal.remove(); saveDeck(); });
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      modal.querySelectorAll('.pic-shape-btn').forEach(b => {
        b.addEventListener('click', () => {
          activeImg.style.borderRadius = b.dataset.radius;
        });
      });

      modal.querySelectorAll('.pic-filter-btn').forEach(b => {
        b.addEventListener('click', () => {
          activeImg.style.filter = b.dataset.filter;
        });
      });

      modal.querySelector('#btn-pic-rot-0')?.addEventListener('click', () => { activeImg.style.transform = 'rotate(0deg)'; });
      modal.querySelector('#btn-pic-rot-90')?.addEventListener('click', () => { activeImg.style.transform = 'rotate(90deg)'; });
      modal.querySelector('#btn-pic-rot-180')?.addEventListener('click', () => { activeImg.style.transform = 'rotate(180deg)'; });
      modal.querySelector('#btn-pic-rot-270')?.addEventListener('click', () => { activeImg.style.transform = 'rotate(270deg)'; });
    } else {
      document.body.appendChild(modal);
    }
  }

  // ── Rehearse Timings ─────────────────────────────────────────
  let rehearseInterval = null;
  let rehearseSlideSecs = 0;
  let rehearseTotalSecs = 0;
  let rehearseHud = null;

  function startKineticRehearsal() {
    rehearseSlideSecs = 0;
    rehearseTotalSecs = 0;

    launchPresenter(0);

    rehearseHud = document.getElementById('kinetic-rehearse-hud');
    if (!rehearseHud) {
      rehearseHud = document.createElement('div');
      rehearseHud.id = 'kinetic-rehearse-hud';
      rehearseHud.style.cssText = 'position:fixed;top:14px;left:14px;z-index:999999;background:rgba(15,23,42,0.95);border:1px solid #38bdf8;border-radius:10px;padding:10px 16px;box-shadow:0 8px 32px rgba(0,0,0,0.6);display:flex;align-items:center;gap:14px;backdrop-filter:blur(8px);';
      rehearseHud.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:16px;">⏱️</span>
          <div>
            <div style="font-size:9.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Slide Time</div>
            <strong id="txt-rehearse-slide-time" style="font-size:15px;color:#38bdf8;font-family:monospace;">00:00</strong>
          </div>
        </div>
        <div style="width:1px;height:24px;background:#334155;"></div>
        <div>
          <div style="font-size:9.5px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Total Deck</div>
          <strong id="txt-rehearse-total-time" style="font-size:15px;color:#f1f5f9;font-family:monospace;">00:00</strong>
        </div>
        <button id="btn-rehearse-next-slide" style="background:#2563eb;border:none;color:#fff;border-radius:6px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;">Next ➔</button>
        <button id="btn-rehearse-end" style="background:#dc2626;border:none;color:#fff;border-radius:6px;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;">Stop &amp; Save</button>
      `;
      document.body.appendChild(rehearseHud);

      const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

      rehearseInterval = setInterval(() => {
        rehearseSlideSecs++;
        rehearseTotalSecs++;
        const sEl = document.getElementById('txt-rehearse-slide-time');
        const tEl = document.getElementById('txt-rehearse-total-time');
        if (sEl) sEl.textContent = fmt(rehearseSlideSecs);
        if (tEl) tEl.textContent = fmt(rehearseTotalSecs);
      }, 1000);

      rehearseHud.querySelector('#btn-rehearse-next-slide')?.addEventListener('click', () => {
        if (slidesData[currentSlideIndex]) {
          slidesData[currentSlideIndex].duration = rehearseSlideSecs;
        }
        rehearseSlideSecs = 0;
        if (currentSlideIndex < slidesData.length - 1) {
          switchSlide(currentSlideIndex + 1);
        } else {
          endRehearsal();
        }
      });

      rehearseHud.querySelector('#btn-rehearse-end')?.addEventListener('click', endRehearsal);
    }
  }

  function endRehearsal() {
    clearInterval(rehearseInterval);
    if (slidesData[currentSlideIndex]) {
      slidesData[currentSlideIndex].duration = rehearseSlideSecs;
    }
    rehearseHud?.remove();
    rehearseHud = null;
    exitPresenter();
    saveDeck();
    alert(`Rehearsal Complete!\n\nTotal presentation time: ${Math.floor(rehearseTotalSecs/60)}m ${rehearseTotalSecs%60}s\nSlide timings have been recorded.`);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Rehearsal slide timings recorded!');
  }

  // ── Record Presentation (Audio Narration) ─────────────────────
  let mediaRecorder = null;
  let audioChunks = [];
  let recordInterval = null;
  let recordSecs = 0;
  let recordHud = null;

  async function startKineticRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Microphone recording is not supported in your browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      recordSecs = 0;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        insertAudioPlayer(audioUrl, `Narration - Slide ${currentSlideIndex + 1}`);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Saved voice narration for Slide ${currentSlideIndex + 1}`);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();

      recordHud = document.getElementById('kinetic-record-hud');
      if (!recordHud) {
        recordHud = document.createElement('div');
        recordHud.id = 'kinetic-record-hud';
        recordHud.style.cssText = 'position:fixed;top:14px;right:14px;z-index:999999;background:rgba(15,23,42,0.95);border:1px solid #ef4444;border-radius:10px;padding:10px 16px;box-shadow:0 8px 32px rgba(0,0,0,0.6);display:flex;align-items:center;gap:12px;backdrop-filter:blur(8px);';
        recordHud.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444;box-shadow:0 0 10px #ef4444;"></span>
            <strong style="color:#ef4444;font-size:12px;font-weight:800;letter-spacing:0.5px;">REC</strong>
            <span id="txt-record-time" style="font-size:14px;color:#f1f5f9;font-family:monospace;">00:00</span>
          </div>
          <button id="btn-record-stop" style="background:#ef4444;border:none;color:#fff;border-radius:6px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;">Stop &amp; Save</button>
        `;
        document.body.appendChild(recordHud);

        recordInterval = setInterval(() => {
          recordSecs++;
          const tEl = document.getElementById('txt-record-time');
          if (tEl) tEl.textContent = `${String(Math.floor(recordSecs/60)).padStart(2,'0')}:${String(recordSecs%60).padStart(2,'0')}`;
        }, 1000);

        recordHud.querySelector('#btn-record-stop')?.addEventListener('click', () => {
          clearInterval(recordInterval);
          mediaRecorder.stop();
          recordHud?.remove();
          recordHud = null;
        });
      }
    } catch (err) {
      alert('Could not access microphone: ' + err.message);
    }
  }

  // ── Guides & Gridlines ────────────────────────────────────────
  const chkGridlines = container.querySelector('#chk-kinetic-gridlines');
  const chkGuides = container.querySelector('#chk-kinetic-guides');
  const gridOverlay = slideFrame.querySelector('#kinetic-grid-overlay');
  const guidesOverlay = slideFrame.querySelector('#kinetic-guides-overlay');

  chkGridlines?.addEventListener('change', (e) => {
    if (gridOverlay) gridOverlay.style.display = e.target.checked ? 'block' : 'none';
  });

  chkGuides?.addEventListener('change', (e) => {
    if (guidesOverlay) guidesOverlay.style.display = e.target.checked ? 'block' : 'none';
  });

  // ── Newly Added Ribbon Button Event Handlers ──────────────────
  container.querySelector('#btn-kinetic-smartart')?.addEventListener('click', openKineticSmartArtModal);
  container.querySelector('#btn-kinetic-insert-audio')?.addEventListener('click', openKineticAudioModal);
  container.querySelector('#btn-kinetic-insert-video')?.addEventListener('click', openKineticVideoModal);
  container.querySelector('#btn-kinetic-action-buttons')?.addEventListener('click', openKineticActionButtonsModal);
  container.querySelector('#btn-kinetic-slide-master')?.addEventListener('click', openKineticSlideMasterModal);
  container.querySelector('#btn-kinetic-format-bg')?.addEventListener('click', openKineticFormatBgModal);
  container.querySelector('#btn-kinetic-edit-pic')?.addEventListener('click', openKineticPictureEditModal);
  container.querySelector('#btn-kinetic-presenter-view')?.addEventListener('click', () => launchPresenter(currentSlideIndex));
  container.querySelector('#btn-kinetic-rehearse-timings')?.addEventListener('click', startKineticRehearsal);
  container.querySelector('#btn-kinetic-record-presentation')?.addEventListener('click', startKineticRecording);

  function renderNavThumbnails() { renderThumbnails(); }
  function renderActiveSlide() { switchSlide(currentSlideIndex); }

  // Keyboard navigation for slides (PageUp / PageDown / F5 / Ctrl+S)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveDeck();
      performKineticDirectSave(false);
      if (window.orbitDriveSync && window.orbitDriveSync.currentActiveFileId) {
        window.orbitDriveSync.saveCurrentActiveFileToRealGoogleDrive('kinetic');
      }
      return;
    }
    const isEditing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (e.key === 'F5') {
      e.preventDefault();
      container.querySelector('#btn-quick-present')?.click();
      return;
    }
    if (!isEditing) {
      if (e.key === 'PageDown' || (e.altKey && e.key === 'ArrowDown')) {
        e.preventDefault();
        if (currentSlideIndex < slidesData.length - 1) switchSlide(currentSlideIndex + 1);
      } else if (e.key === 'PageUp' || (e.altKey && e.key === 'ArrowUp')) {
        e.preventDefault();
        if (currentSlideIndex > 0) switchSlide(currentSlideIndex - 1);
      }
    }
  });

  // Global Presentation Templates Modal
  const btnKineticTemplates = container.querySelector('#btn-kinetic-global-templates');
  const btnRibbonTemplates = container.querySelector('#btn-kinetic-ribbon-templates');
  const btnFileTemplates = container.querySelector('#btn-kinetic-file-templates');

  btnKineticTemplates?.addEventListener('click', openKineticTemplatesModal);
  btnRibbonTemplates?.addEventListener('click', openKineticTemplatesModal);
  container.querySelector('#btn-kinetic-return-hub')?.addEventListener('click', () => {
    saveDeck();
    mountKineticHub(container, onDeckUpdate);
  });
    btnFileTemplates?.addEventListener('click', () => {
    fileMenuDropdown?.classList.remove('open');
    openKineticTemplatesModal();
  });

  function openKineticTemplatesModal() {
    let modal = container.querySelector('#kinetic-templates-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kinetic-templates-modal-backdrop';
      modal.className = 'axis-modal-backdrop';
      modal.innerHTML = `
        <div class="axis-modal-dialog" style="width: 1040px; max-width: 95vw; height: 680px; max-height: 92vh; display: flex; flex-direction: column;">
          <div class="axis-modal-header" style="background: #18181b; padding: 14px 20px; border-bottom: 1px solid #27272a;">
            <div class="axis-modal-title" style="color: #ffffff; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">🌍</span>
              <div>
                <span style="font-size: 15px; font-weight: 700;">PresentationGO & Global Presentation Library</span>
                <span style="display: block; font-size: 11px; color: #94a3b8; font-weight: 400;">3,500+ Free Templates, Process Diagrams, Timelines, Matrices, and Infographics</span>
              </div>
            </div>
            <button class="axis-modal-close" id="btn-close-kinetic-templates" style="color:#ffffff; font-size:18px;">✕</button>
          </div>
          <div class="axis-modal-body" style="padding: 16px 20px; overflow: hidden; display: flex; flex-direction: column; gap: 12px; flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
              <div class="tool-cat-strip" id="kinetic-modal-cat-strip" style="display:flex; gap:6px; flex-wrap:wrap; max-width: 680px;">
                <button class="tool-category-pill active" data-cat="all">All (3,500+)</button>
                <button class="tool-category-pill" data-cat="presentation">📊 Executive Presentation Decks</button>
                <button class="tool-category-pill" data-cat="processes">Processes &amp; Steps</button>
                <button class="tool-category-pill" data-cat="timelines">Timelines</button>
                <button class="tool-category-pill" data-cat="diagrams">Diagrams</button>
                <button class="tool-category-pill" data-cat="matrix">Matrix &amp; SWOT</button>
                <button class="tool-category-pill" data-cat="pyramids">Pyramids</button>
                <button class="tool-category-pill" data-cat="funnels">Funnels</button>
                <button class="tool-category-pill" data-cat="tables">Tables</button>
                <button class="tool-category-pill" data-cat="infographics">Infographics</button>
                <button class="tool-category-pill" data-cat="themes">Themes</button>
                <button class="tool-category-pill" data-cat="pitch">Pitch Decks</button>
                <button class="tool-category-pill" data-cat="custom">Custom</button>
              </div>
              
              <div style="display:flex; align-items:center; gap:8px;">
                <button class="btn-giri-primary" id="btn-kinetic-modal-upload" style="padding:6px 12px; font-size:11.5px; background:#2563eb; border:none; border-radius:6px; color:#fff; cursor:pointer;" title="Upload custom presentation template (.json, .pptx, .html)">+ Upload Template</button>
                <input type="file" id="kinetic-modal-file-upload-input" accept=".gkinetic,.pptx,.ppt,.odp,.json,.html" style="display:none;">
                <input type="text" id="kinetic-modal-template-search" class="tool-search-templates-input" placeholder="Search 3,500+ templates..." style="width: 220px; padding: 6px 12px; font-size: 12px; border: 1px solid #334155; background: #0f172a; color: #f8fafc; border-radius: 6px;" spellcheck="false">
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #94a3b8; border-bottom: 1px solid #334155; padding-bottom: 6px;">
              <span id="kinetic-modal-count-label">Loading library...</span>
              <span>Global Presentation Library • Enterprise Sovereign License</span>
            </div>

            <div id="kinetic-modal-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; overflow-y: auto; flex: 1; padding: 4px;">
            </div>

            <div id="kinetic-modal-load-more-wrap" style="display: none; justify-content: center; padding-top: 6px;">
              <button id="btn-kinetic-modal-load-more" style="background:#1e293b; color:#e2e8f0; border:1px solid #475569; border-radius:6px; padding:6px 18px; font-size:11.5px; font-weight:600; cursor:pointer;">Load More Templates</button>
            </div>
          </div>
        </div>
      `;
      container.appendChild(modal);

      const closeBtn = modal.querySelector('#btn-close-kinetic-templates');
      closeBtn.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });

      const cardsGrid = modal.querySelector('#kinetic-modal-cards-grid');
      const searchInput = modal.querySelector('#kinetic-modal-template-search');
      const catPills = modal.querySelectorAll('#kinetic-modal-cat-strip .tool-category-pill');
      const countLabel = modal.querySelector('#kinetic-modal-count-label');
      const loadMoreWrap = modal.querySelector('#kinetic-modal-load-more-wrap');
      const loadMoreBtn = modal.querySelector('#btn-kinetic-modal-load-more');
      let currentCat = 'all';
      let modalDisplayedLimit = 24;
      const MODAL_PAGE_SIZE = 24;

      const fullPool = [...PRESENTATION_GO_TEMPLATES, ...KINETIC_BUILTIN_TEMPLATES];

      function getModalFilteredPool() {
        const q = (searchInput.value || '').toLowerCase().trim();
        if (currentCat === 'custom') {
          return customTemplates.filter(x => !q || x.name.toLowerCase().includes(q) || x.desc.toLowerCase().includes(q));
        }
        return filterPresentationGoTemplates(fullPool, {
          query: q,
          category: currentCat
        });
      }

      function renderModalCards(append = false) {
        if (!append) {
          cardsGrid.innerHTML = '';
          modalDisplayedLimit = MODAL_PAGE_SIZE;
        }

        const filtered = getModalFilteredPool();
        const visible = filtered.slice(0, modalDisplayedLimit);

        if (countLabel) {
          countLabel.textContent = `Showing ${visible.length.toLocaleString()} of ${filtered.length.toLocaleString()} templates`;
        }

        if (loadMoreWrap) {
          if (visible.length < filtered.length) {
            loadMoreWrap.style.display = 'flex';
          } else {
            loadMoreWrap.style.display = 'none';
          }
        }

        if (filtered.length === 0) {
          cardsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; color: #94a3b8;">
              <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
              <strong style="color: #f8fafc; font-size: 14px;">No matching presentation templates found</strong>
              <p style="font-size: 12px; margin: 4px 0 0 0;">Try searching for "timeline", "funnel", "process", "matrix", or clear search.</p>
            </div>
          `;
          return;
        }

        const startIndex = append ? (modalDisplayedLimit - MODAL_PAGE_SIZE) : 0;
        const sliceToRender = visible.slice(startIndex, modalDisplayedLimit);

        sliceToRender.forEach(tpl => {
          const card = document.createElement('div');
          card.className = 'pgo-template-card';
          card.style.height = 'auto';
          const slideCount = tpl.slides ? tpl.slides.length : 1;
          const catLabel = tpl.categoryLabel || (tpl.category ? tpl.category.toUpperCase() : 'DIAGRAM');

          card.innerHTML = `
            <div class="pgo-card-top-bar">
              <span class="pgo-brand-compat">GOOGLE SLIDES, PPTX</span>
              <span class="pgo-aspect-pill">16:9</span>
            </div>
            <div class="pgo-preview-frame" style="height: 145px;">
              ${renderTemplateVisualThumbnail(tpl)}
            </div>
            <div class="pgo-card-meta">
              <div class="pgo-pills-row">
                <span class="pgo-cat-pill">${catLabel}</span>
                ${tpl.optionsText ? `<span class="pgo-option-pill">${tpl.optionsText}</span>` : `<span class="pgo-option-pill">${slideCount} slides</span>`}
              </div>
              <h4 class="pgo-card-title" title="${tpl.name}">${tpl.name}</h4>
              <p class="pgo-card-desc" title="${tpl.desc}">${tpl.desc}</p>
              <div style="display:flex; gap:8px; align-items:center; border-top:1px solid #e2e8f0; padding-top:10px; margin-top:8px;">
                <button class="btn-load-kinetic-deck" style="flex:1; background:#c43e1c; color:#ffffff; border:none; border-radius:6px; padding:6px 12px; font-size:11px; font-weight:600; cursor:pointer;" title="Replace current presentation with this template">Load Presentation</button>
                <button class="btn-append-kinetic-deck" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; border-radius:6px; padding:6px 10px; font-size:11px; font-weight:600; cursor:pointer;" title="Append slides to current presentation">+ Append</button>
              </div>
            </div>
          `;
          card.querySelector('.btn-load-kinetic-deck').addEventListener('click', () => {
            slidesData = JSON.parse(JSON.stringify(tpl.slides));
            currentSlideIndex = 0;
            saveDeck();
            renderThumbnails();
            switchSlide(0);
            modal.remove();
            if (window.orbitPlatform) {
              window.orbitPlatform.triggerToast(`Loaded "${tpl.name}" (${slideCount} slides)`);
            }
          });
          card.querySelector('.btn-append-kinetic-deck').addEventListener('click', () => {
            const newSlides = JSON.parse(JSON.stringify(tpl.slides)).map((s, idx) => ({
              ...s,
              id: Date.now() + idx
            }));
            const prevCount = slidesData.length;
            slidesData = [...slidesData, ...newSlides];
            currentSlideIndex = prevCount;
            saveDeck();
            renderThumbnails();
            switchSlide(currentSlideIndex);
            modal.remove();
            if (window.orbitPlatform) {
              window.orbitPlatform.triggerToast(`Appended ${newSlides.length} slides from "${tpl.name}"`);
            }
          });
          cardsGrid.appendChild(card);
        });
      }

      loadMoreBtn?.addEventListener('click', () => {
        modalDisplayedLimit += MODAL_PAGE_SIZE;
        renderModalCards(true);
      });

      catPills.forEach(pill => {
        pill.addEventListener('click', () => {
          catPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentCat = pill.dataset.cat;
          renderModalCards(false);
        });
      });

      let modalSearchTimer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(modalSearchTimer);
        modalSearchTimer = setTimeout(() => {
          renderModalCards(false);
        }, 150);
      });

      // Custom Template Upload in Modal
      const modalUploadBtn = modal.querySelector('#btn-kinetic-modal-upload');
      const modalUploadInput = modal.querySelector('#kinetic-modal-file-upload-input');
      modalUploadBtn?.addEventListener('click', () => modalUploadInput?.click());
      modalUploadInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            let importedSlides = [];
            let tplName = file.name.replace(/\.[^/.]+$/, '');
            if (file.name.endsWith('.json')) {
              const parsed = JSON.parse(evt.target.result);
              if (Array.isArray(parsed)) importedSlides = parsed;
              else if (parsed.slides && Array.isArray(parsed.slides)) {
                importedSlides = parsed.slides;
                if (parsed.name) tplName = parsed.name;
              }
            } else {
              importedSlides = [
                {
                  id: Date.now(),
                  layout: 'title',
                  tag: 'CUSTOM IMPORT',
                  title: tplName,
                  desc: 'Imported presentation from ' + file.name,
                  features: [{ num: '01', title: 'Imported', desc: 'Ready to customize' }]
                }
              ];
            }

            const newTpl = {
              id: 'custom-tpl-' + Date.now(),
              name: tplName,
              category: 'custom',
              desc: `User uploaded presentation template (${file.name})`,
              previewAccent: '#3b82f6',
              slides: importedSlides
            };

            customTemplates.push(newTpl);
            localStorage.setItem('giri_orbit_kinetic_custom_templates', JSON.stringify(customTemplates));
            currentCat = 'custom';
            catPills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'custom'));
            renderModalCards();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Uploaded custom template "${tplName}" (${importedSlides.length} slides)`);
          } catch (err) {
            alert('Failed to parse template: ' + err.message);
          }
        };
        reader.readAsText(file);
      });

      renderModalCards();
    }
  }

  
  // Kinetic Font Steppers & Clear Formatting
  container.querySelector('#btn-kinetic-font-grow')?.addEventListener('click', () => {
    if (selectedShapes.size > 0) {
      selectedShapes.forEach(s => {
        const cur = parseInt(s.style.fontSize || '14px', 10);
        s.style.fontSize = `${cur + 2}px`;
      });
      saveDeck();
    } else {
      const cur = parseInt(window.getComputedStyle(titleEl).fontSize, 10);
      titleEl.style.fontSize = `${cur + 2}px`;
    }
  });

  container.querySelector('#btn-kinetic-font-shrink')?.addEventListener('click', () => {
    if (selectedShapes.size > 0) {
      selectedShapes.forEach(s => {
        const cur = parseInt(s.style.fontSize || '14px', 10);
        if (cur > 10) s.style.fontSize = `${cur - 2}px`;
      });
      saveDeck();
    } else {
      const cur = parseInt(window.getComputedStyle(titleEl).fontSize, 10);
      if (cur > 16) titleEl.style.fontSize = `${cur - 2}px`;
    }
  });

  container.querySelector('#btn-kinetic-clear-formatting')?.addEventListener('click', () => {
    if (selectedShapes.size > 0) {
      selectedShapes.forEach(s => {
        s.style.fontWeight = 'normal';
        s.style.fontStyle = 'normal';
        s.style.textDecoration = 'none';
        s.style.color = '#0f172a';
        s.style.fontSize = '14px';
        s.style.fontFamily = 'Calibri, sans-serif';
      });
      saveDeck();
    }
    if (kineticFontPicker) kineticFontPicker.setFont('Calibri');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Cleared formatting');
  });

  // Kinetic Background Preset Swatches
  container.querySelectorAll('.kinetic-bg-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bg = btn.dataset.bg;
      slideFrame.style.backgroundColor = bg;
      if (slidesData[currentSlideIndex]) {
        slidesData[currentSlideIndex].bg = bg;
      }
      saveDeck();
      if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Updated slide background to ${btn.title}`);
    });
  });

  // Duplicate Slide Shortcut (Ctrl+D) fallback
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return;
    const isEditing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && !isEditing) {
      e.preventDefault();
      const dup = JSON.parse(JSON.stringify(slidesData[currentSlideIndex]));
      dup.id = Date.now();
      dup.title = (dup.title || 'Slide') + ' (Copy)';
      slidesData.splice(currentSlideIndex + 1, 0, dup);
      currentSlideIndex++;
      saveDeck();
      renderThumbnails();
      switchSlide(currentSlideIndex);
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Duplicated current slide (Ctrl+D)');
    }
  });

  renderThumbnails();
  switchSlide(0);
}
}
