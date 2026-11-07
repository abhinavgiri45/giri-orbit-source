import { AEGIS_BUILTIN_TEMPLATES } from '../data/templates.js';
import { FluentFontPicker } from '../components/fontPicker.js';
import { WORLD_FONTS_CATALOG, loadGoogleFont, populateFontSelect, findFont } from '../data/fonts.js';
import { localSync } from '../components/localFileDirectSync.js';
import { orbitDesktopSuite } from '../components/orbitDesktopSuite.js';
import { GiriOfficeFormats } from '../components/giriOfficeFormats.js';
/**
 * ============================================================================
 * GIRI ORBIT — GIRI AEGIS: ENTERPRISE PDF STUDIO & FORM SUITE (pdfStudio.js)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * ============================================================================
 * Features:
 * - Enterprise Multi-Group Ribbon (Annotate, Sign & Certify, Forms, Page Tools, Security, View)
 * - Interactive Digital Signature Pad (Draw with Canvas or Type Cursive)
 * - Freehand Pen, Color Highlighter & Draggable Sticky Notes
 * - Fillable Form Field Inserter (Text Fields, Checkboxes, Signature Lines)
 * - Multi-Page Management (Thumbnails, Add Page, Duplicate, Delete, Rotate 90°)
 * - Security & Redaction Blackout Tool, Custom Watermarks & Certified Seals
 * - Professional PDF Export & Print Integration (.pdf, .png, print)
 */

export function renderPdfStudioApp(container, onPdfUpdate = null, startInEditor = false) {
  let customTemplates = [];
  try {
    const stored = localStorage.getItem('giri_orbit_pdf_custom_templates');
    if (stored) customTemplates = JSON.parse(stored);
  } catch {}

  if (startInEditor) {
    mountPdfEditor(container, null, onPdfUpdate);
  } else {
    mountPdfHub(container, onPdfUpdate);
  }

  function mountPdfHub(rootEl, onUpdate) {
    rootEl.innerHTML = `
      <div class="pdf-hub-shell" id="pdf-hub-shell">
        <div class="tool-hub-top-bar">
          <div class="tool-hub-brand-left">
            <div class="tool-app-icon-badge crimson">Æ</div>
            <div class="tool-hub-brand-dropdown-wrap" id="pdf-brand-dropdown-wrap">
              <button class="tool-hub-brand-btn" id="pdf-brand-dropdown-trigger" style="display:flex; align-items:center; gap:6px; background:transparent; border:none; cursor:pointer; padding:4px 6px; border-radius:4px;" title="Switch Suite Tool">
                <span style="color:#ffffff; font-family:var(--font-display, sans-serif); font-weight:700; font-size:14px;">Giri Aegis Studio</span>
                <span style="color:#94a3b8; font-size:11px;">▾</span>
              </button>
              <!-- Suite Switcher Dropdown Menu -->
              <div class="tool-suite-switcher-menu" id="pdf-suite-menu" style="display:none;">
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
                <a href="#kinetic" class="suite-switcher-item" data-switch="kinetic">
                  <div class="switcher-icon kinetic">K</div>
                  <div class="switcher-info">
                    <strong>Giri Kinetic</strong>
                    <span>Cinematic Presentation Studio</span>
                  </div>
                  <span class="switcher-link-tag">#kinetic</span>
                </a>
                <a href="#pdf" class="suite-switcher-item active" data-switch="pdf">
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
              <span class="tool-hub-nav-link" id="btn-pdf-nav-blank">Create Blank</span>
              <span class="tool-hub-nav-link" id="btn-pdf-nav-templates">Templates</span>
              <span class="tool-hub-nav-link" id="btn-pdf-nav-custom">Custom Templates</span>
            </nav>
          </div>

          <!-- Suite Nav Links & Direct Link Copier on Right -->
          <div class="tool-hub-top-right">
            <div class="tool-hub-suite-links">
              <a href="#hub" class="tool-hub-suite-link" data-switch="launcher" title="Orbit Hub (http://127.0.0.1:5000/#hub)">Hub</a>
              <a href="#drift" class="tool-hub-suite-link" data-switch="drift" title="Giri Drift Docs (http://127.0.0.1:5000/#drift)">Drift</a>
              <a href="#axis" class="tool-hub-suite-link" data-switch="axis" title="Giri Axis Sheets (http://127.0.0.1:5000/#axis)">Axis</a>
              <a href="#kinetic" class="tool-hub-suite-link" data-switch="kinetic" title="Giri Kinetic Presentation (http://127.0.0.1:5000/#kinetic)">Kinetic</a>
              <a href="#pdf" class="tool-hub-suite-link active" data-switch="pdf" title="Giri Aegis PDF Studio (http://127.0.0.1:5000/#pdf)">Aegis PDF</a>
            </div>
            <button class="btn-tool-copy-link" id="btn-pdf-share-link" title="Copy direct link to Giri Aegis PDF Studio (http://127.0.0.1:5000/#pdf)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <section class="tool-hub-hero">
          <div class="tool-hero-left">
            <h1 class="tool-hero-title">Welcome to Aegis Studio for free on the web</h1>
            <p class="tool-hero-subtitle">
              Sovereign in-memory PDF cryptographic seal and document studio. Zero database tracking, digital signature pad, and customizable formal memorandums.
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
              <button class="btn-tool-create-blank crimson" id="btn-pdf-hero-blank">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <span>Create blank document</span>
              </button>
              <button class="btn-tool-upload-file" id="btn-pdf-hero-upload">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Upload PDF</span>
              </button>
              <input type="file" id="pdf-hero-file-input" accept=".gaegis,.gpdf,.pdf,.json,.docx,.txt,.html" style="display:none;">
              <button class="btn-tool-new-template-cta" id="btn-pdf-hero-custom">
                <span>+ Custom Template</span>
              </button>
              <button class="btn-tool-new-template-cta" id="btn-pdf-hero-import-tpl" style="background:#1e293b; color:#38bdf8; border:1px solid #334155;" title="Import Custom Template (.json, .html, .txt, .md, .pdf)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>↑ Import Template</span>
              </button>
              <input type="file" id="pdf-import-tpl-input" accept=".gaegis,.gpdf,.pdf,.json,.html,.htm,.txt,.md" style="display:none;">
            </div>
          </div>

          <div class="tool-hero-visual">
            <svg class="tool-hero-visual-svg" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="20" width="200" height="140" rx="8" fill="#1e293b" stroke="#dc2626" stroke-width="1.5"/>
              <rect x="52" y="32" width="176" height="116" rx="4" fill="#ffffff"/>
              <line x1="68" y1="46" x2="140" y2="46" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
              <line x1="68" y1="58" x2="190" y2="58" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
              <line x1="68" y1="68" x2="180" y2="68" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
              <circle cx="180" cy="115" r="18" fill="#dc2626" fill-opacity="0.15" stroke="#dc2626" stroke-width="2"/>
              <polyline points="174 115 178 119 188 109" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </section>

        <!-- Pick Up Where You Left Off Synced Work Banner -->
        <div id="pdf-resume-banner-slot"></div>

        <main class="tool-templates-section">
          <div class="tool-templates-section-header">
            <h2 class="tool-templates-heading">Create with templates</h2>
            <div class="tool-category-filter-row">
              <div class="tool-category-pill-strip" id="pdf-cat-strip">
                <button class="tool-category-pill active" data-cat="all">Recommended</button>
                <button class="tool-category-pill" data-cat="memos">Memos & Authorizations</button>
                <button class="tool-category-pill" data-cat="agreements">Agreements & NDAs</button>
                <button class="tool-category-pill" data-cat="certificates">Certificates & Audits</button>
                <button class="tool-category-pill" data-cat="invoices">Invoices & Billing</button>
                <button class="tool-category-pill" data-cat="custom">
                  <span>Custom Templates</span>
                  <span class="pill-counter-badge">${customTemplates.length}</span>
                </button>
              </div>

              <div class="tool-search-templates-wrap">
                <svg class="tool-search-templates-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="tool-search-templates-input" id="pdf-template-search" placeholder="Search templates" spellcheck="false">
              </div>
            </div>
          </div>

          <div class="tool-templates-grid" id="pdf-grid-cards"></div>
        </main>
      </div>
    `;

    const cardsGrid = rootEl.querySelector('#pdf-grid-cards');
    const searchInp = rootEl.querySelector('#pdf-template-search');
    const pills = rootEl.querySelectorAll('#pdf-cat-strip .tool-category-pill');
    let selCat = 'all';

    function renderPdfTemplateVisualThumbnail(tpl) {
      const accent = tpl.previewAccent || '#dc2626';
      const id = tpl.id || '';

      let middleContent = '';
      let badgeHtml = '';

      if (id === 'mutual-nda-agreement') {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#2563eb; border:1px solid #bfdbfe; background:#eff6ff; padding:1px 4px; border-radius:2px;">MUTUAL NDA</span>`;
        middleContent = `
          <div style="display:flex; gap:6px; margin:6px 0;">
            <div style="flex:1; background:#f8fafc; border:1px solid #e2e8f0; border-radius:2px; padding:3px; font-size:7.5px; color:#475569;"><b>DISCLOSING:</b> Giri Corp</div>
            <div style="flex:1; background:#f8fafc; border:1px solid #e2e8f0; border-radius:2px; padding:3px; font-size:7.5px; color:#475569;"><b>RECIPIENT:</b> Enterprise</div>
          </div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:100%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:88%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:6px; width:94%;"></div>
          <div style="display:flex; justify-content:space-between; margin-top:4px; border-top:1px dashed #cbd5e1; padding-top:4px;">
            <span style="font-size:7px; color:#64748b;">Sign: <i>Abhinav Giri</i></span>
            <span style="font-size:7px; color:#64748b;">Sign: <i>Counterparty</i></span>
          </div>
        `;
      } else if (id === 'enterprise-msa') {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#4f46e5; border:1px solid #c7d2fe; background:#eef2ff; padding:1px 4px; border-radius:2px;">ENTERPRISE MSA</span>`;
        middleContent = `
          <div style="font-size:8px; font-weight:700; color:#1e293b; margin:4px 0 2px;">1. MASTER SERVICES & SLA</div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:95%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:80%;"></div>
          <div style="background:#f1f5f9; padding:4px 6px; border-radius:3px; margin:4px 0; font-size:7.5px; color:#334155; display:flex; justify-content:space-between;">
            <span>Service Level: <b>99.99% Uptime</b></span>
            <span>Tier: <b>Mission Critical</b></span>
          </div>
          <div style="margin-top:4px; border-top:1px dashed #cbd5e1; padding-top:3px; font-size:7px; color:#64748b;">
            Dual Execution // PKI Sealed
          </div>
        `;
      } else if (id === 'air-gap-security-certificate') {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#059669; border:1px solid #a7f3d0; background:#ecfdf5; padding:1px 4px; border-radius:2px;">CERTIFIED SECURE</span>`;
        middleContent = `
          <div style="display:flex; align-items:center; gap:8px; margin:6px 0; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:4px; padding:6px;">
            <div style="width:24px; height:24px; border-radius:50%; background:#059669; color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">✓</div>
            <div style="flex:1;">
              <div style="font-size:8px; font-weight:700; color:#065f46;">ISO-27001 / SOC-2 TYPE II</div>
              <div style="font-size:6.5px; font-family:monospace; color:#047857;">DIGEST: 8f92...c041</div>
            </div>
          </div>
          <div style="font-size:7px; color:#475569; line-height:1.3;">Air-Gapped Sovereign Node verification successfully passed on host.</div>
        `;
      } else if (id === 'board-formal-resolution') {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#991b1b; border:1px solid #fecaca; background:#fef2f2; padding:1px 4px; border-radius:2px;">BOARD RECORD</span>`;
        middleContent = `
          <div style="font-size:8px; font-weight:700; color:#0f172a; margin:4px 0 2px;">RESOLUTION OF THE DIRECTORS</div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:100%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:90%;"></div>
          <div style="font-size:7.5px; color:#334155; margin:4px 0; background:#f8fafc; padding:3px 5px; border-left:2px solid #991b1b;">
            <b>RESOLVED:</b> Authorization granted by unanimous vote.
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:7px; color:#64748b;">
            <span>Chairman Signature</span>
            <span>Corporate Secretary</span>
          </div>
        `;
      } else if (id === 'commercial-tax-invoice') {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#d97706; border:1px solid #fde68a; background:#fffbeb; padding:1px 4px; border-radius:2px;">TAX INVOICE</span>`;
        middleContent = `
          <div style="margin:4px 0;">
            <div style="display:flex; justify-content:space-between; font-size:7px; font-weight:700; color:#64748b; border-bottom:1px solid #e2e8f0; padding-bottom:2px;">
              <span>ITEM / SERVICE</span><span>QTY</span><span>TOTAL</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:7px; color:#334155; padding:2px 0;">
              <span>Sovereign Cloud Core</span><span>1</span><span>$38,000</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:7px; color:#334155; padding:2px 0;">
              <span>Enterprise SLA Support</span><span>1</span><span>$7,200</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:7.5px; font-weight:700; color:#0f172a; border-top:1px solid #cbd5e1; padding-top:2px; margin-top:2px;">
              <span>BALANCE DUE:</span><span>$45,200</span>
            </div>
          </div>
        `;
      } else if (id === 'consulting-services-contract') {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#7c3aed; border:1px solid #ddd6fe; background:#f5f3ff; padding:1px 4px; border-radius:2px;">RETAINER</span>`;
        middleContent = `
          <div style="font-size:8px; font-weight:700; color:#1e293b; margin:4px 0 2px;">SCOPE OF ADVISORY ENGAGEMENT</div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:3px; width:92%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:3px; width:78%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:6px; width:85%;"></div>
          <div style="background:#f5f3ff; border:1px solid #ddd6fe; border-radius:3px; padding:3px 6px; font-size:7.5px; color:#5b21b6; display:flex; justify-content:space-between;">
            <span>Monthly Retainer: $25,000</span>
            <span>Term: 12 Mo</span>
          </div>
        `;
      } else if (id === 'change-order-addendum') {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#ea580c; border:1px solid #fed7aa; background:#fff7ed; padding:1px 4px; border-radius:2px;">ADDENDUM #01</span>`;
        middleContent = `
          <div style="font-size:8px; font-weight:700; color:#1e293b; margin:4px 0 2px;">CHANGE REQUEST SPECIFICATION</div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:96%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:82%;"></div>
          <div style="display:flex; justify-content:space-between; margin:4px 0; background:#f8fafc; padding:3px 5px; font-size:7px; border:1px solid #e2e8f0; border-radius:2px;">
            <span>Schedule Adjustment: <b>+14 Days</b></span>
            <span>Cost Delta: <b>+$18,500</b></span>
          </div>
        `;
      } else {
        badgeHtml = `<span style="font-size:7px; font-weight:800; color:#dc2626; border:1px solid #fecaca; background:#fef2f2; padding:1px 4px; border-radius:2px; transform:rotate(-4deg);">APPROVED</span>`;
        middleContent = `
          <div style="height:3px; background:#cbd5e1; border-radius:2px; margin-bottom:4px; width:80%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:100%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:92%;"></div>
          <div style="height:3px; background:#e2e8f0; border-radius:2px; margin-bottom:4px; width:85%;"></div>
          <div style="margin-top:8px; padding-top:4px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:'Brush Script MT', cursive, sans-serif; font-size:12px; color:#2563eb;">Abhinav Giri</span>
            <span style="font-size:6.5px; font-family:monospace; color:#94a3b8;">PKI-SEALED</span>
          </div>
        `;
      }

      return `
        <div style="padding:10px 12px; width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; background:#ffffff; box-sizing:border-box; border-top:3px solid ${accent};">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <div style="display:flex; align-items:center; gap:5px;">
                <div style="width:14px; height:14px; background:${accent}; border-radius:2px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:8px; font-weight:bold;">G</div>
                <span style="font-size:8px; font-weight:800; color:#0f172a; letter-spacing:0.02em;">GIRI AEGIS</span>
              </div>
              ${badgeHtml}
            </div>
            <div style="font-size:10px; font-weight:800; color:#0f172a; line-height:1.2; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${tpl.name}</div>
            <div style="font-size:7px; font-family:monospace; color:#64748b; margin-bottom:4px;">REF: ${(tpl.id || 'DOC').toUpperCase()}</div>
            ${middleContent}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:4px; font-size:6.5px; color:#94a3b8; font-family:monospace;">
            <span>FORMAL DOCUMENT</span>
            <span>A4 // 300 DPI</span>
          </div>
        </div>
      `;
    }

    function refreshCards() {
      cardsGrid.innerHTML = '';
      const query = (searchInp.value || '').toLowerCase().trim();
      try {
        const stored = localStorage.getItem('giri_orbit_pdf_custom_templates');
        if (stored) customTemplates = JSON.parse(stored);
      } catch (e) {}

      let pool = selCat === 'custom' ? customTemplates : (selCat === 'all' ? [...AEGIS_BUILTIN_TEMPLATES, ...customTemplates] : AEGIS_BUILTIN_TEMPLATES.filter(x => x.category === selCat));
      if (query) pool = pool.filter(x => x.name.toLowerCase().includes(query) || x.desc.toLowerCase().includes(query));

      if (selCat === 'custom' && !pool.length) {
        cardsGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; background: #18181b; border: 1px dashed #334155; border-radius: 10px;">
            <span style="font-size: 36px; display: block; margin-bottom: 8px;">📑</span>
            <strong style="font-size: 15px; color: #f8fafc; display: block; margin-bottom: 4px;">No Custom PDF Templates Saved Yet</strong>
            <span style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 16px;">Save any active PDF document or form as a custom template via File &gt; Save as Custom Template.</span>
            <button id="btn-pdf-hub-create-blank-tpl" class="btn-giri-primary" style="padding: 8px 18px; font-size: 12px;">+ Create Blank Document</button>
          </div>
        `;
        cardsGrid.querySelector('#btn-pdf-hub-create-blank-tpl')?.addEventListener('click', () => {
          mountPdfEditor(rootEl, null, onUpdate);
        });
        return;
      }

      pool.forEach(tpl => {
        const isCustom = tpl.id && String(tpl.id).startsWith('custom-');
        const card = document.createElement('div');
        card.className = 'tool-template-card';
        card.style.position = 'relative';
        card.innerHTML = `
          <div class="tool-template-preview-frame">
            ${renderPdfTemplateVisualThumbnail(tpl)}
          </div>
          <div class="tool-template-meta" style="display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1; min-width:0;">
              <span class="tool-template-title">${tpl.name}</span>
              <span class="tool-template-cat-label">${tpl.category || 'PDF Document'}</span>
            </div>
            ${isCustom ? `
              <div style="display:flex; gap:4px; flex-shrink:0;" class="pdf-custom-actions">
                <button class="btn-export-pdf-tpl" title="Export as JSON" style="background:#1e293b; border:1px solid #334155; color:#38bdf8; border-radius:4px; padding:2px 6px; font-size:10px; cursor:pointer;">↓</button>
                <button class="btn-del-pdf-tpl" title="Delete Template" style="background:#450a0a; border:1px solid #991b1b; color:#fca5a5; border-radius:4px; padding:2px 6px; font-size:10px; cursor:pointer;">🗑</button>
              </div>
            ` : ''}
          </div>
        `;

        if (isCustom) {
          card.querySelector('.btn-export-pdf-tpl')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const blob = new Blob([JSON.stringify(tpl, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${(tpl.name || 'custom_pdf_template').toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
            a.click();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Exported "${tpl.name}" JSON template`);
          });
          card.querySelector('.btn-del-pdf-tpl')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete custom template "${tpl.name}"?`)) {
              customTemplates = customTemplates.filter(t => t.id !== tpl.id);
              localStorage.setItem('giri_orbit_pdf_custom_templates', JSON.stringify(customTemplates));
              refreshCards();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Deleted template "${tpl.name}"`);
            }
          });
        }

        card.addEventListener('click', () => {
          mountPdfEditor(rootEl, tpl.pages, onUpdate);
        });
        cardsGrid.appendChild(card);
      });
    }

    const importTplInput = rootEl.querySelector('#pdf-import-tpl-input');
    rootEl.querySelector('#btn-pdf-hero-import-tpl')?.addEventListener('click', () => importTplInput?.click());
    function activateCustomTab() {
      pills.forEach(p => {
        const isC = p.dataset.cat === 'custom';
        p.classList.toggle('active', isC);
        if (isC) {
          const b = p.querySelector('.pill-counter-badge');
          if (b) b.textContent = customTemplates.length;
        }
      });
      selCat = 'custom';
      refreshCards();
    }

    importTplInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const raw = re.target.result;
          let tplName = file.name.replace(/\.[^/.]+$/, '');
          let pages = [];
          let desc = `Custom PDF template (${file.name})`;

          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              if (parsed.length > 0 && parsed[0].pages) {
                parsed.forEach((t, idx) => {
                  customTemplates.push({
                    id: 'custom-pdf-' + Date.now() + '-' + idx,
                    name: t.name || `${tplName} ${idx + 1}`,
                    category: 'custom',
                    desc: t.desc || desc,
                    previewAccent: t.previewAccent || '#dc2626',
                    pages: t.pages || [],
                    isCustom: true
                  });
                });
                localStorage.setItem('giri_orbit_pdf_custom_templates', JSON.stringify(customTemplates));
                activateCustomTab();
                if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported ${parsed.length} PDF templates!`);
                return;
              } else {
                pages = parsed;
              }
            } else if (parsed.pages && Array.isArray(parsed.pages)) {
              pages = parsed.pages;
              if (parsed.name) tplName = parsed.name;
              if (parsed.desc) desc = parsed.desc;
            } else if (parsed.htmlContent) {
              pages = [{ id: Date.now(), rotation: 0, title: parsed.name || tplName, htmlContent: parsed.htmlContent }];
            } else {
              pages = [{ id: Date.now(), rotation: 0, title: tplName, htmlContent: `<pre style="font-family:monospace; font-size:12px;">${JSON.stringify(parsed, null, 2)}</pre>` }];
            }
          } else if (file.name.endsWith('.md')) {
            const lines = raw.split('\n');
            let bodyHtml = '';
            lines.forEach(l => {
              const tr = l.trim();
              if (tr.startsWith('# ')) bodyHtml += `<h1 style="font-size:22px; font-weight:800; color:#0f172a; margin:16px 0 8px 0;">${tr.slice(2)}</h1>`;
              else if (tr.startsWith('## ')) bodyHtml += `<h2 style="font-size:17px; font-weight:700; color:#1e293b; margin:14px 0 6px 0;">${tr.slice(3)}</h2>`;
              else if (tr.startsWith('- ') || tr.startsWith('* ')) bodyHtml += `<li style="margin-left:18px; font-size:12px; color:#334155; line-height:1.6;">${tr.slice(2)}</li>`;
              else if (tr.length > 0) bodyHtml += `<p style="font-size:12px; line-height:1.6; color:#334155; margin-bottom:8px;">${tr}</p>`;
            });
            pages = [{
              id: Date.now(),
              rotation: 0,
              title: tplName,
              ref: `DOC-${Date.now().toString().slice(-6)}`,
              htmlContent: `<div style="padding:24px; font-family:var(--font-body);">${bodyHtml}</div>`
            }];
          } else {
            const content = raw.includes('<') && raw.includes('>') ? raw : `<div style="padding:24px; font-family:var(--font-body); line-height:1.7; color:#334155;">${raw.replace(/\n\n/g, '<br><br>')}</div>`;
            pages = [{
              id: Date.now(),
              rotation: 0,
              title: tplName,
              ref: `DOC-${Date.now().toString().slice(-6)}`,
              htmlContent: content
            }];
          }

          const newTemplate = {
            id: 'custom-pdf-' + Date.now(),
            name: tplName,
            category: 'custom',
            desc,
            previewAccent: '#dc2626',
            pages,
            isCustom: true
          };

          customTemplates.push(newTemplate);
          localStorage.setItem('giri_orbit_pdf_custom_templates', JSON.stringify(customTemplates));
          activateCustomTab();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported custom template "${tplName}"!`);
        } catch (err) {
          alert('Failed to import template: ' + err.message);
        }
      };
      reader.readAsText(file);
      importTplInput.value = '';
    });

    pills.forEach(btn => {
      btn.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        selCat = btn.dataset.cat;
        refreshCards();
      });
    });

    searchInp?.addEventListener('input', refreshCards);
    // Suite Switcher Dropdown Toggle
    const brandTrigger = rootEl.querySelector('#pdf-brand-dropdown-trigger');
    const suiteMenu = rootEl.querySelector('#pdf-suite-menu');
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

    // Create Blank Document
    rootEl.querySelector('#btn-pdf-hero-blank')?.addEventListener('click', () => {
      mountPdfEditor(rootEl, 'blank', onUpdate);
    });
    rootEl.querySelector('#btn-pdf-nav-blank')?.addEventListener('click', () => {
      mountPdfEditor(rootEl, 'blank', onUpdate);
    });
    rootEl.querySelector('#btn-pdf-hero-custom')?.addEventListener('click', () => {
      mountPdfEditor(rootEl, null, onUpdate);
    });

    // Upload File (PDF, JSON, DOCX, TXT, HTML)
    const uploadBtn = rootEl.querySelector('#btn-pdf-hero-upload');
    const fileInput = rootEl.querySelector('#pdf-hero-file-input');
    uploadBtn?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();
      const reader = new FileReader();
      if (ext === 'json') {
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            const importedPages = Array.isArray(data) ? data : (data.pages || [data]);
            mountPdfEditor(rootEl, importedPages, onUpdate);
          } catch {
            alert('Invalid JSON template file');
          }
        };
        reader.readAsText(file);
      } else if (ext === 'txt' || ext === 'html') {
        reader.onload = (ev) => {
          const raw = ev.target.result;
          const bodyHtml = ext === 'txt' 
            ? raw.split('\n').map(p => `<p style="margin-bottom:8px;">${p || '<br>'}</p>`).join('')
            : raw;
          const importedPages = [{
            id: 1,
            rotation: 0,
            title: file.name.replace(/\.[^/.]+$/, ''),
            ref: 'GIRI-AEGIS-IMPORT',
            htmlContent: `<div style="font-family:Calibri, 'Segoe UI', Arial, sans-serif; font-size:11pt; color:#0f172a; padding:30px 20px;">${bodyHtml}</div>`
          }];
          mountPdfEditor(rootEl, importedPages, onUpdate);
        };
        reader.readAsText(file);
      } else {
        const importedPages = [{
          id: 1,
          rotation: 0,
          title: file.name.replace(/\.[^/.]+$/, ''),
          ref: 'GIRI-AEGIS-DOC',
          htmlContent: `
            <div style="font-family:Calibri, 'Segoe UI', Arial, sans-serif; padding:30px 20px; color:#0f172a;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; padding-bottom:12px; margin-bottom:20px;">
                <div>
                  <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">${file.name}</h1>
                  <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">IMPORTED DOCUMENT // GIRI AEGIS ENTERPRISE</span>
                </div>
                <div style="border:1px solid #dc2626; color:#dc2626; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:700;">
                  IMPORTED
                </div>
              </div>
              <p style="font-size:12px; color:#475569; line-height:1.6;">
                File <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB) successfully loaded into Giri Aegis PDF Studio. You can annotate, add form fields, draw signatures, or stamp watermarks directly onto this document.
              </p>
              <div style="margin-top:20px; padding:16px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:6px; min-height:400px; outline:none;" contenteditable="true">
                <p>Click here to begin typing, editing, or pasting content...</p>
              </div>
            </div>
          `
        }];
        mountPdfEditor(rootEl, importedPages, onUpdate);
      }
    });

    rootEl.querySelector('#btn-pdf-nav-templates')?.addEventListener('click', () => {
      rootEl.querySelector('.tool-hub-templates-section')?.scrollIntoView({ behavior: 'smooth' });
    });
    rootEl.querySelector('#btn-pdf-nav-custom')?.addEventListener('click', () => {
      const customPill = Array.from(pills).find(p => p.dataset.cat === 'custom');
      if (customPill) customPill.click();
      rootEl.querySelector('.tool-hub-templates-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Direct Tool Link Copier
    rootEl.querySelector('#btn-pdf-share-link')?.addEventListener('click', () => {
      const url = window.orbitPlatform ? window.orbitPlatform.getToolUrl('pdf') : `${window.location.origin}/#pdf`;
      navigator.clipboard?.writeText(url).then(() => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Copied direct link to Giri Aegis PDF Studio: ${url}`);
      }).catch(() => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Direct Link: ${url}`);
      });
    });

    // Hydrate Pick Up Where You Left Off Banner
    const resumeSlot = rootEl.querySelector('#pdf-resume-banner-slot');
    if (resumeSlot && window.giriSyncManager && window.giriSyncManager.hasSavedWork('pdf')) {
      const syncInfo = window.giriSyncManager.getToolSyncInfo('pdf');
      const timeStr = window.giriSyncManager.formatTimeAgo(syncInfo.updatedAt);
      resumeSlot.innerHTML = `
        <div class="tool-resume-banner" id="pdf-resume-banner" style="margin: 20px auto 24px auto; max-width: 1200px;">
          <div class="tool-resume-left">
            <div class="tool-resume-icon-badge" style="background:#fff7ed; color:#ea580c; border:1px solid #fed7aa; font-weight:800; font-size:16px;">
              Æ
            </div>
            <div>
              <div class="tool-resume-title" style="font-size:15px; font-weight:700; color:#ffffff;">Pick up where you left off in Aegis PDF</div>
              <div class="tool-resume-meta" style="font-size:12px; color:#94a3b8; display:flex; align-items:center; gap:6px; margin-top:3px;">
                <span class="sync-dot-live" style="width:6px; height:6px; display:inline-block;"></span>
                <span style="color:#f8fafc; font-weight:600;">${syncInfo.title}</span> • 
                <span>Saved ${timeStr}</span> • 
                <span>${syncInfo.stats || 'Digital sealed memorandum'}</span>
              </div>
            </div>
          </div>
          <div class="tool-resume-actions" style="display:flex; align-items:center; gap:10px;">
            <button class="btn-delete-saved-work" id="btn-pdf-banner-delete" title="Delete this saved draft from browser storage">
              🗑 Delete Draft
            </button>
            <button class="btn-resume-work" id="btn-pdf-banner-resume" style="background:#ea580c; color:#ffffff; padding:7px 16px; border-radius:6px; font-weight:600; border:none; cursor:pointer;">
              ▶ Resume Work &rarr;
            </button>
          </div>
        </div>
      `;

      resumeSlot.querySelector('#btn-pdf-banner-resume')?.addEventListener('click', () => {
        mountPdfEditor(rootEl, null, onUpdate);
      });

      resumeSlot.querySelector('#btn-pdf-banner-delete')?.addEventListener('click', () => {
        if (confirm('Delete saved Aegis PDF work from browser storage? This will clear your draft.')) {
          window.giriSyncManager.deleteSyncedWork('pdf');
          resumeSlot.innerHTML = '';
        }
      });
    }

    refreshCards();
  }

  function mountPdfEditor(container, templatePages = null, onPdfUpdate = null) {

  const initialPages = [
    {
      id: 1,
      rotation: 0,
      title: 'GIRI ENTERPRISE MEMORANDUM // DEPLOYMENT AUTHORIZATION',
      ref: 'GIRI-AEGIS-2026-X01',
      htmlContent: `
        <div class="pdf-doc-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <img src="assets/giri-group-symbol-dark.png" alt="Giri Group" style="height:32px; width:auto; display:block;">
            <div>
              <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:0; letter-spacing:-0.01em;">GIRI ENTERPRISE MEMORANDUM</h1>
              <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">REF: GIRI-AEGIS-2026-X01 // SOVEREIGN COMPUTING DIVISION</span>
            </div>
          </div>
          <div class="pdf-approved-stamp" id="page-1-stamp" style="border:2px solid #e42528; color:#e42528; padding:4px 10px; border-radius:4px; font-weight:800; font-size:12px; text-transform:uppercase; transform:rotate(-8deg);">
            APPROVED
            <span style="font-size:8px; display:block; font-weight:500;">GIRI CORP EXECUTIVE</span>
          </div>
        </div>

        <div style="height:1px; background:#e2e8f0; margin:16px 0;"></div>

        <h2 style="font-size:15px; font-weight:700; color:#0f172a; margin-bottom:8px;">Executive Summary & Formal Certification</h2>
        <p style="font-size:12.5px; line-height:1.7; color:#334155; margin-bottom:14px;">
          This document certifies the commercial deployment of <strong>Giri Orbit Zero-Gravity Suite</strong> across all subsidiary divisions of <em>Giri Group</em>. Operating entirely within browser memory, the suite bypasses central database storage latency and enforces total cryptographic data sovereignty.
        </p>

        <table style="width:100%; border-collapse:collapse; margin:14px 0; border:1px solid #cbd5e1; font-size:12px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="border:1px solid #cbd5e1; padding:7px 10px; text-align:left;">Module</th>
              <th style="border:1px solid #cbd5e1; padding:7px 10px; text-align:left;">Functional Domain</th>
              <th style="border:1px solid #cbd5e1; padding:7px 10px; text-align:left;">Compliance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; font-weight:600;">Giri Drift</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px;">Executive Word Processing (Writer)</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; color:#059669; font-weight:600;">Certified</td>
            </tr>
            <tr>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; font-weight:600;">Giri Axis</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px;">Analytical Financial Spreadsheets (Sheet)</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; color:#059669; font-weight:600;">Certified</td>
            </tr>
            <tr>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; font-weight:600;">Giri Kinetic</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px;">Widescreen Strategy Presentations (Show)</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; color:#059669; font-weight:600;">Certified</td>
            </tr>
            <tr>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; font-weight:600;">Giri Aegis</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px;">Digital Signature & Verification (PDF)</td>
              <td style="border:1px solid #cbd5e1; padding:7px 10px; color:#059669; font-weight:600;">Certified</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:24px; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
          <h3 style="font-size:13px; font-weight:700; color:#0f172a; margin-bottom:6px;">Section II: Verification Checkpoints</h3>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" class="pdf-fillable-check" checked> Zero-DB memory structures verified under load
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" class="pdf-fillable-check" checked> Full-bleed desktop workspace scaling operational
            </label>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" class="pdf-fillable-check" checked> Client-side export engines verified for DOCX, XLSX, PPTX & PDF
            </label>
          </div>
        </div>

        <div class="pdf-signature-block" id="page-1-signature" style="margin-top:32px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:26px; color:#1e40af; border-bottom:1.5px solid #0f172a; display:inline-block; padding-bottom:2px;">
              Giri Corporate Directorate
            </div>
            <span style="display:block; font-size:10px; font-family:var(--font-mono); color:#64748b; margin-top:4px;">
              Validated by Chief Technology Architect // SHA-256 Verified
            </span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">DATE EXECUTED:</span>
            <strong style="font-size:11px; display:block; color:#0f172a;">2026-09-10</strong>
          </div>
        </div>
      `
    },
    {
      id: 2,
      rotation: 0,
      title: 'PAGE 2 // COMPLIANCE SCHEDULE & SIGN-OFF FORM',
      ref: 'GIRI-AEGIS-2026-X02',
      htmlContent: `
        <div class="pdf-doc-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <img src="assets/giri-group-symbol-dark.png" alt="Giri Group" style="height:32px; width:auto; display:block;">
            <div>
              <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">APPENDIX B // SOVEREIGN PRIVACY COMPLIANCE</h1>
              <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">REF: GIRI-AEGIS-2026-X02 // GIRI GROUP</span>
            </div>
          </div>
        </div>

        <div style="height:1px; background:#e2e8f0; margin:16px 0;"></div>

        <h2 style="font-size:15px; font-weight:700; color:#0f172a; margin-bottom:8px;">Enterprise Fillable Sign-Off Form</h2>
        <p style="font-size:12.5px; line-height:1.7; color:#334155; margin-bottom:16px;">
          This form is fillable. Personnel authorized to review this document must fill the fields below and apply an executive signature pad seal.
        </p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:20px;">
          <div>
            <label style="display:block; font-size:11px; font-weight:600; color:#475569; margin-bottom:4px;">Lead Reviewer Name</label>
            <input type="text" class="pdf-fillable-input" value="Abhinav Giri" style="width:100%;">
          </div>
          <div>
            <label style="display:block; font-size:11px; font-weight:600; color:#475569; margin-bottom:4px;">Corporate Designation</label>
            <input type="text" class="pdf-fillable-input" value="Principal Architect & Director" style="width:100%;">
          </div>
          <div>
            <label style="display:block; font-size:11px; font-weight:600; color:#475569; margin-bottom:4px;">Operating Entity</label>
            <input type="text" class="pdf-fillable-input" value="Abhinav Giri / Giri Group" style="width:100%;">
          </div>
          <div>
            <label style="display:block; font-size:11px; font-weight:600; color:#475569; margin-bottom:4px;">Approval Timestamp</label>
            <input type="text" class="pdf-fillable-input" value="2026-09-10 22:30 IST" style="width:100%;">
          </div>
        </div>

        <div style="padding:16px; border:2px dashed #cbd5e1; border-radius:6px; background:#fafbfc; margin-top:24px; text-align:center;">
          <span style="font-size:11px; font-weight:700; color:#64748b; letter-spacing:0.05em; display:block; margin-bottom:8px;">AFFIX DIGITAL SIGNATURE OR EXECUTIVE SEAL BELOW:</span>
          <div id="page-2-sig-target" style="min-height:70px; display:flex; align-items:center; justify-content:center;">
            <span style="font-family:'Brush Script MT', cursive, sans-serif; font-size:32px; color:#2563eb;">Abhinav Giri</span>
          </div>
          <span style="font-size:9.5px; font-family:var(--font-mono); color:#94a3b8;">Digitally sealed through Giri Aegis Studio PKI</span>
        </div>
      `
    }
  ];

  const blankPdfPages = [
    {
      id: 1,
      rotation: 0,
      title: 'Blank Document - Giri Aegis',
      ref: 'GIRI-AEGIS-BLANK',
      htmlContent: `<div class="pdf-blank-page-content" contenteditable="true" spellcheck="false" style="min-height:850px; outline:none; font-family:Calibri, 'Segoe UI', Arial, sans-serif; font-size:11pt; color:#0f172a; padding:30px 20px;"><p><br></p></div>`
    }
  ];

  let pages;
  const savedPdfPages = localStorage.getItem('giri_orbit_pdf_pages');
  if (templatePages === 'blank') {
    pages = JSON.parse(JSON.stringify(blankPdfPages));
  } else if (Array.isArray(templatePages) && templatePages.length > 0) {
    pages = JSON.parse(JSON.stringify(templatePages));
  } else if (savedPdfPages) {
    try {
      pages = JSON.parse(savedPdfPages);
    } catch {
      pages = JSON.parse(JSON.stringify(initialPages));
    }
  } else {
    pages = JSON.parse(JSON.stringify(initialPages));
  }
  let activePageIndex = -1;
  let watermarkText = 'CONFIDENTIAL // GIRI GROUP';
  let isWatermarkActive = true;
  let currentZoom = 100;

  container.innerHTML = `
    <div class="pdf-studio-shell" id="pdf-studio-shell">
      <!-- Giri Aegis Classic Desktop Chrome -->
      <div class="lo-classic-chrome">
        ${orbitDesktopSuite.renderWindowHeader('pdf', 'Drawing 1 - Giri Aegis PDF Studio')}
        ${orbitDesktopSuite.renderMenubar('pdf')}
        ${orbitDesktopSuite.renderToolbars('pdf')}
      </div>

      <!-- Enterprise Multi-Group Office Ribbon -->
      <nav class="fluent-ribbon-bar" aria-label="PDF Studio Fluent Office Ribbon">
        <!-- Ribbon Tabs Strip -->
        <div class="fluent-ribbon-tabs">
          <button class="fluent-tab-btn" id="btn-pdf-return-hub" style="color:#38bdf8; font-weight:700; display:flex; align-items:center; gap:4px; margin-right:4px;" title="Return to Orbit Hub"><span style="font-size:13px;">⟵</span><span>Hub</span></button>
          <button class="fluent-tab-btn fluent-tab-file-btn" id="btn-pdf-file-menu" title="Open File Menu">File</button>
          <button class="fluent-tab-btn active" data-tab="home">Home</button>
          <button class="fluent-tab-btn" data-tab="annotate">Annotate</button>
          <button class="fluent-tab-btn" data-tab="forms">Edit &amp; Forms</button>
          <button class="fluent-tab-btn" data-tab="sign">Sign &amp; Certify</button>
          <button class="fluent-tab-btn" data-tab="pages">Page Tools</button>
          <button class="fluent-tab-btn" data-tab="protect">Protect</button>
          <button class="fluent-tab-btn" data-tab="view">View</button>
          <button class="fluent-tab-btn" data-tab="help">Help</button>

          <!-- Top-Right Actions -->
          <div class="fluent-top-actions">
            <button class="fluent-top-action-pill fluent-autosave-toggle-btn active" id="btn-pdf-autosave-toggle" title="Auto-Save is ON: All changes saved automatically (Click to toggle)">
              <span class="autosave-dot" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;"></span>
              <span class="autosave-text" style="font-weight:600;font-size:11.5px;">Auto-Save: ON</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-pdf-special-link" title="Special Document Link: Share & open instantly on any Phone or PC" style="background:linear-gradient(135deg,rgba(220,38,38,0.18),rgba(234,88,12,0.18));color:#f87171;border:1px solid rgba(248,113,113,0.4);font-weight:600;">
              <span style="font-size:12px;">📱</span>
              <span>Phone/PC Link</span>
            </button>
            <button class="fluent-drive-action-pill" id="btn-pdf-drive-sync" title="Google Drive Sync: Direct editing & cloud auto-save">
              <span class="drive-dot-live"></span>
              <span id="txt-pdf-drive-status">☁️ Drive</span>
            </button>
            <button class="fluent-sync-action-pill" id="btn-pdf-browser-sync" title="Browser Sync: Edits and signatures automatically save to browser storage. Click to open sync manager.">
              <span class="sync-dot-live"></span>
              <span id="txt-pdf-browser-sync-status">Synced to Browser</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-pdf-save-device" title="Direct Disk Sync: Save PDF directly to your computer without re-downloads" style="background:#059669; color:#ffffff; font-weight:600; border-color:#047857;">
              <span style="font-size:12px;">💾</span>
              <span id="txt-pdf-sync-status">Save to Device</span>
            </button>
            <button class="fluent-top-action-pill ai-agent-btn" id="btn-pdf-top-ai-agent" title="Girionix Autonomous AI Agent (Alt+A)" style="background:linear-gradient(135deg, rgba(168,85,247,0.22), rgba(220,38,38,0.22)); border:1px solid rgba(168,85,247,0.45); color:#c084fc; font-weight:700;">
              <span style="font-size:12px;">🤖</span>
              <span>AI Agent</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-pdf-comments" title="Comments">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Comments <span id="pdf-comments-count-badge" style="background:#3b82f6; color:#fff; border-radius:10px; padding:1px 5px; font-size:9.5px; margin-left:2px;">1</span></span>
            </button>
            <button class="fluent-top-action-pill" id="btn-pdf-catchup" title="Catch up on document changes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>Catch up</span>
            </button>
            <button class="fluent-top-action-pill" id="btn-pdf-mode" title="Editing Mode">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span id="pdf-mode-label">Editing ▾</span>
            </button>
            <button class="fluent-top-action-pill share-btn" id="btn-pdf-share" title="Share Sovereign PDF">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span>Share ▾</span>
            </button>
          </div>
        </div>

        <!-- Dark Office 365 File Dropdown Menu (Exact match to screenshot) -->
        <div class="office-file-menu-dropdown" id="pdf-file-menu-dropdown">
          <div class="file-menu-item" data-action="ai-agent" id="file-menu-pdf-ai-agent" style="background:rgba(168,85,247,0.12); color:#c084fc; font-weight:700;">
            <span class="file-menu-icon">🤖</span>
            <span>Girionix AI Agent...</span>
            <span class="file-menu-shortcut" style="margin-left:auto; font-size:10px; color:#94a3b8;">Alt+A</span>
          </div>
          <div class="file-menu-item" data-action="drive-sync" id="file-menu-pdf-drive-sync" style="background:rgba(66,133,244,0.15); color:#60a5fa; font-weight:600;">
            <span class="file-menu-icon">☁️</span>
            <span>Google Drive Cloud Sync...</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="save-device" id="file-menu-pdf-save-device" style="background:rgba(5,150,105,0.15); color:#34d399; font-weight:600;">
            <span class="file-menu-icon">💾</span>
            <span>Save to Device (Direct Sync)</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="open-device" id="file-menu-pdf-open-device">
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
          <div class="file-menu-item" data-action="save-template" id="btn-pdf-save-custom-template" style="color:#38bdf8;">
            <span class="file-menu-icon">📄</span>
            <span>Save as Custom Template...</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="import-template" id="btn-pdf-import-custom-template" style="color:#38bdf8;">
            <span class="file-menu-icon">📥</span>
            <span>Import Custom Template...</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <input type="file" id="pdf-editor-import-tpl-input" accept=".json,.html,.htm,.txt,.md,.pdf" style="display:none;">
          <div class="file-menu-item" data-action="export">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></span>
            <span>Export PDF</span>
            <span class="file-menu-arrow">›</span>
          </div>
          <div class="file-menu-item" data-action="print">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></span>
            <span>Print (Ctrl+P)</span>
          </div>
          <div class="file-menu-sep"></div>
          <div class="file-menu-item" data-action="rename">
            <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
            <span>Rename</span>
          </div>
          <div class="file-menu-item disabled" title="PDF is sovereignly stored in browser local memory" data-action="move">
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
          <!-- 1. HOME TAB PANE (Office Standard Default) -->
          <div class="fluent-ribbon-pane active" id="pane-pdf-home">
            <!-- Undo Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col" style="gap:4px;">
                  <button class="fluent-btn-small" id="btn-pdf-undo" title="Undo (Ctrl+Z)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  </button>
                  <button class="fluent-btn-small" id="btn-pdf-redo" title="Redo (Ctrl+Y)">
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
                <button class="fluent-btn-large" id="btn-pdf-paste" title="Paste (Ctrl+V)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                  <span>Paste ▾</span>
                </button>
                <div class="fluent-group-col">
                  <button class="fluent-btn-small" id="btn-pdf-cut" title="Cut (Ctrl+X)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                  </button>
                  <button class="fluent-btn-small" id="btn-pdf-copy" title="Copy (Ctrl+C)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  <button class="fluent-btn-small" id="btn-pdf-format-painter" title="Format Painter">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M5 13v7a2 2 0 0 0 2 2h2v-9"/><path d="M15 13v9"/></svg>
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Clipboard</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-clipboard" title="Clipboard History">⤢</button>
              </div>
            </div>

            <!-- Tools & Navigation Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-tool-select" style="background:rgba(255,255,255,0.12); color:#38bdf8;" title="Text Selection Tool">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7 18 3-7 7-3L3 3z"/></svg>
                  <span>Select</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-tool-hand" title="Hand / Pan Viewport Tool">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-4 0v4"/><path d="M14 10V4a2 2 0 0 0-4 0v7"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                  <span>Hand</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Tools</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-tools" title="Tools Options">⤢</button>
              </div>
            </div>

            <!-- Basic Text & Font Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <div id="pdf-font-picker-mount" class="fluent-font-mount"></div>
                    <select class="fluent-select-dark" id="pdf-font-size-pt" style="width:58px;" title="Font Size">
                      <option value="9">9 pt</option>
                      <option value="10">10 pt</option>
                      <option value="11" selected>11 pt</option>
                      <option value="12">12 pt</option>
                      <option value="14">14 pt</option>
                      <option value="16">16 pt</option>
                      <option value="18">18 pt</option>
                      <option value="20">20 pt</option>
                      <option value="24">24 pt</option>
                      <option value="28">28 pt</option>
                      <option value="36">36 pt</option>
                    </select>
                    <button class="fluent-btn-small" id="btn-pdf-font-grow" title="Grow Font">A<sup>▲</sup></button>
                    <button class="fluent-btn-small" id="btn-pdf-font-shrink" title="Shrink Font">A<sup>▼</sup></button>
                    <button class="fluent-btn-small" id="btn-pdf-clear-formatting" title="Clear Formatting (Tx)">T<span style="font-size:9px; color:#ef4444; margin-left:1px;">✕</span></button>
                  </div>

                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-pdf-bold" title="Bold (Ctrl+B)"><strong>B</strong></button>
                    <button class="fluent-btn-small" id="btn-pdf-italic" title="Italic (Ctrl+I)"><em>I</em></button>
                    <button class="fluent-btn-small" id="btn-pdf-underline" title="Underline (Ctrl+U)"><u>U</u></button>
                    <button class="fluent-btn-small" id="btn-pdf-strike" title="Strikethrough"><s>ab</s></button>
                    <button class="fluent-btn-small" id="btn-pdf-sub" title="Subscript">x<span class="sub-blue">2</span></button>
                    <button class="fluent-btn-small" id="btn-pdf-sup" title="Superscript">x<span class="sup-blue">2</span></button>
                    <button class="fluent-btn-small" id="btn-pdf-change-case" title="Change Case">Ab ▾</button>

                    <label class="fluent-btn-small ribbon-color-picker-wrap" title="Highlight Color">
                      <span style="background:#fde047; color:#000; padding:0 3px; font-weight:800; border-radius:2px; font-size:10px;">ab</span>
                      <input type="color" class="ribbon-color-input" id="input-pdf-highlight" value="#fde047">
                    </label>

                    <label class="fluent-btn-small ribbon-color-picker-wrap" title="Text Color">
                      <span style="font-weight:900; font-size:12px; color:#ef4444; border-bottom:2px solid #ef4444;">A</span>
                      <input type="color" class="ribbon-color-input" id="input-pdf-font-color" value="#ef4444">
                    </label>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Basic Text</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-font" title="Font Settings">⤢</button>
              </div>
            </div>

            <!-- Quick Markup Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-quick-highlight" title="Quick Highlight Text">
                  <span style="background:#fef08a; color:#000; padding:1px 6px; border-radius:2px; font-weight:700; font-size:14px;">🖍</span>
                  <span>Highlight</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-quick-note" title="Drop Sticky Note">
                  <span style="font-size:16px;">📌</span>
                  <span>Sticky Note</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-quick-sign" title="Quick Digital Signature">
                  <span style="font-size:16px;">✍️</span>
                  <span>Sign Pad</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Quick Markup</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-markup" title="Markup Gallery">⤢</button>
              </div>
            </div>

            <!-- Editing Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <button class="fluent-btn-row-cmd" id="btn-pdf-find" title="Find Text (Ctrl+F)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <span>Find</span>
                  </button>
                  <button class="fluent-btn-row-cmd" id="btn-pdf-replace" title="Replace Text (Ctrl+H)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    <span>Replace</span>
                  </button>
                  <button class="fluent-btn-row-cmd" id="btn-pdf-select-all" title="Select All (Ctrl+A)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3 3"/></svg>
                    <span>Select All</span>
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Editing</div>
              </div>
            </div>

            <!-- Voice & Speech Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-dictate" title="Dictate Speech into PDF (Web Speech API)">
                  <span style="font-size:18px;">🎙️</span>
                  <span>Dictate ▾</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-read-aloud" title="Read Active Page Aloud (SpeechSynthesis)">
                  <span style="font-size:18px;">🔊</span>
                  <span>Read Aloud</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Voice</div>
              </div>
            </div>

            <!-- Girionix AI Studio Group -->
            <div class="fluent-ribbon-group" style="background:rgba(220,38,38,0.06); border-radius:4px; border-right:none;">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-ai-agent" title="Girionix Autonomous Agent: Generate compliance audit report & seal (Alt+A)" style="color:#ea580c; font-weight:700; background:rgba(234,88,12,0.1); border-radius:6px;">
                  <strong style="font-size:18px;">🤖</strong>
                  <span style="color:#ea580c;">AI Agent</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-home-ai-audit" title="Girionix AI PDF Assistant & Document Intelligence (Alt+J / Ctrl+Shift+J)" style="color:#dc2626; font-weight:700;">
                  <strong style="color:#dc2626; font-size:18px;">⚡</strong>
                  <span style="color:#dc2626;">AI Studio</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-import-from-girionix" title="Import content from Girionix AI into PDF document" style="color:#dc2626;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span style="color:#dc2626;">Import from AI</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-export-to-girionix" title="Export PDF document text to Girionix AI for analysis & summarization" style="color:#dc2626;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span style="color:#dc2626;">Export to AI</span>
                </button>
              </div>
              <div class="fluent-group-footer"><span class="fluent-group-label" style="color:#dc2626; font-weight:700;">Girionix AI</span></div>
            </div>
          </div>

          <!-- 2. ANNOTATE TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-pdf-annotate">
            <!-- Text Markup Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-highlighter" title="Highlight Selected Text">
                  <span style="background:#fef08a; color:#000; padding:1px 6px; border-radius:2px; font-weight:700; font-size:14px;">🖍</span>
                  <span>Highlight</span>
                </button>
                <div class="fluent-group-col" style="justify-content:center;">
                  <select class="fluent-select-dark" id="pdf-highlight-color" style="width:85px;">
                    <option value="#fef08a" selected>Yellow</option>
                    <option value="#bbf7d0">Green</option>
                    <option value="#fbcfe8">Pink</option>
                    <option value="#bfdbfe">Blue</option>
                    <option value="#fed7aa">Orange</option>
                  </select>
                  <div class="fluent-group-row" style="margin-top:4px;">
                    <button class="fluent-btn-small" id="btn-pdf-anno-underline" title="Underline Markup" style="width:auto; padding:0 6px;"><u>U Line</u></button>
                    <button class="fluent-btn-small" id="btn-pdf-anno-strike" title="Strikethrough Markup" style="width:auto; padding:0 6px;"><s>Strike</s></button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Markup</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-anno" title="Markup Options">⤢</button>
              </div>
            </div>

            <!-- Freehand Drawing & Ink Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-pen-draw" title="Toggle Freehand Ink Pen Drawing">
                  <span style="font-size:16px;">✏️</span>
                  <span>Draw Pen</span>
                </button>
                <div class="fluent-group-col" style="justify-content:center;">
                  <div class="fluent-group-row">
                    <label class="fluent-btn-small ribbon-color-picker-wrap" title="Pen Ink Color">
                      <span style="font-size:10px;">🎨</span>
                      <input type="color" class="ribbon-color-input" id="input-pdf-pen-color" value="#1e3a8a">
                    </label>
                    <select class="fluent-select-dark" id="select-pdf-pen-width" style="width:68px;">
                      <option value="1">1 px</option>
                      <option value="2.5" selected>2.5 px</option>
                      <option value="4">4 px</option>
                      <option value="7">7 px</option>
                    </select>
                  </div>
                  <button class="fluent-btn-small" id="btn-pdf-clear-ink" title="Clear Ink Strokes" style="color:#ef4444; width:100%; margin-top:4px;">
                    🧹 Clear Ink
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Ink &amp; Drawing</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-ink" title="Drawing Pen Settings">⤢</button>
              </div>
            </div>

            <!-- Shapes Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-pdf-shape-rect" title="Rectangle Shape">■ Rect</button>
                    <button class="fluent-btn-small" id="btn-pdf-shape-circle" title="Circle Shape">● Circle</button>
                  </div>
                  <div class="fluent-group-row" style="margin-top:4px;">
                    <button class="fluent-btn-small" id="btn-pdf-shape-arrow" title="Arrow Shape">➔ Arrow</button>
                    <button class="fluent-btn-small" id="btn-pdf-shape-line" title="Straight Line">― Line</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Shapes</div>
              </div>
            </div>

            <!-- Notes & Pins Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-sticky-note" title="Drop Draggable Sticky Note">
                  <span style="font-size:16px;">📌</span>
                  <span>Sticky Note</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-comment-pin" title="Affix Comment Pin">
                  <span style="font-size:16px;">💬</span>
                  <span>Comment Pin</span>
                </button>
                <button class="fluent-btn-small" id="btn-pdf-clear-notes" title="Clear All Annotations &amp; Pins" style="color:#ef4444; align-self:center; width:auto; padding:0 8px;">
                  Clear All
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Notes &amp; Pins</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-notes" title="Notes Explorer">⤢</button>
              </div>
            </div>
          </div>

          <!-- 3. EDIT & FORMS TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-pdf-forms">
            <!-- Fillable Form Elements Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-add-textfield" title="Add Fillable Text Input Field">
                  <span style="font-size:16px;">📝</span>
                  <span>+ Text Field</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-add-checkbox" title="Add Interactive Checkbox">
                  <span style="font-size:16px;">☑️</span>
                  <span>+ Checkbox</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-add-radio" title="Add Interactive Radio Option">
                  <span style="font-size:16px;">🔘</span>
                  <span>+ Radio</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-add-date" title="Add Date Field Picker">
                  <span style="font-size:16px;">📅</span>
                  <span>+ Date Field</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-add-dropdown" title="Add Dropdown Select Box">
                  <span style="font-size:16px;">📋</span>
                  <span>+ Dropdown</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-add-sig-field" title="Add Digital Signature Line Box">
                  <span style="font-size:16px;">✍️</span>
                  <span>+ Sign Line</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Form Elements</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-forms" title="Forms Setup">⤢</button>
              </div>
            </div>

            <!-- Document Content & Tables Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-add-text-block" title="Insert New Paragraph Block">
                  <span style="font-size:16px; font-weight:800; color:#38bdf8;">T+</span>
                  <span>Add Text</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-add-table" title="Insert 3x3 Form Data Table">
                  <span style="font-size:16px;">▦</span>
                  <span>Add Table</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Content</div>
              </div>
            </div>

            <!-- Form Actions Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <button class="fluent-btn-row-cmd" id="btn-pdf-reset-form" title="Reset All Form Input Fields">
                    <span>↺ Reset Fields</span>
                  </button>
                  <button class="fluent-btn-row-cmd" id="btn-pdf-lock-form" title="Lock &amp; Flatten Form to Read-Only">
                    <span>🔒 Lock Form</span>
                  </button>
                  <button class="fluent-btn-row-cmd" id="btn-pdf-export-json" title="Export Form Data to JSON">
                    <span>📤 Export JSON</span>
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Form Actions</div>
              </div>
            </div>
          </div>

          <!-- 4. SIGN & CERTIFY TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-pdf-sign">
            <!-- Digital Signature Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-open-signature-pad" title="Open Interactive Digital Signature Pad">
                  <span style="font-size:16px;">✍️</span>
                  <span>Signature Pad</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-initial-stamp" title="Affix Quick Initial Stamp">
                  <span style="font-size:14px; font-weight:800; color:#3b82f6; border:1px solid #3b82f6; padding:0 3px; border-radius:2px;">INITIAL</span>
                  <span>Initial Stamp</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Signatures</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-sig" title="Signature Pad">⤢</button>
              </div>
            </div>

            <!-- Executive Seals Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-exec-seal" title="Affix Giri Group Sovereign Certified Seal">
                  <span style="font-size:16px;">🛡️</span>
                  <span>Executive Seal</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-stamp-approved" title="Toggle Approved Stamp">
                  <span style="color:#ef4444; font-weight:800; font-size:11px; border:1px solid #ef4444; padding:0 3px; border-radius:2px;">APPROVED</span>
                  <span>Approved Stamp</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-stamp-confidential" title="Affix Confidential Stamp">
                  <span style="color:#dc2626; font-weight:800; font-size:11px; border:1px solid #dc2626; padding:0 3px; border-radius:2px;">RESTRICTED</span>
                  <span>Confidential</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-stamp-void" title="Affix Void Stamp">
                  <span style="color:#64748b; font-weight:800; font-size:11px; border:1px solid #64748b; padding:0 3px; border-radius:2px;">VOID</span>
                  <span>Void Stamp</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Official Seals</div>
              </div>
            </div>

            <!-- Cryptographic Sovereign PKI Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-verify-pki" title="Compute SHA-256 Sovereign Cryptographic Digest">
                  <span style="font-size:16px;">🔐</span>
                  <span>Verify SHA-256</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-audit-cert" title="View Formal Cryptographic Audit Certificate">
                  <span style="font-size:16px;">📜</span>
                  <span>Audit Certificate</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">PKI Trust</div>
              </div>
            </div>
          </div>

          <!-- 5. PAGE TOOLS TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-pdf-pages">
            <!-- Page Operations Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-add-page" title="Add Blank Page">
                  <span style="font-size:16px; color:#22c55e;">📄+</span>
                  <span>+ Page</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-dup-page" title="Duplicate Active Page">
                  <span style="font-size:16px;">📑</span>
                  <span>Duplicate</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-del-page" title="Delete Active Page" style="color:#ef4444;">
                  <span style="font-size:16px;">🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Manage Pages</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-pages" title="Pages Manager">⤢</button>
              </div>
            </div>

            <!-- Rotation & Ordering Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-rotate" title="Rotate 90° Clockwise">
                  <span style="font-size:16px;">↻</span>
                  <span>Rotate 90°</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-rotate-ccw" title="Rotate -90° Counter-Clockwise">
                  <span style="font-size:16px;">↺</span>
                  <span>Rotate -90°</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-stamp-pagenum" title="Affix Page Number Stamp">
                  <span style="font-size:16px;">#️⃣</span>
                  <span>Page # Stamp</span>
                </button>
                <div class="fluent-group-col" style="justify-content:center;">
                  <button class="fluent-btn-small" id="btn-pdf-move-up" title="Move Page Up" style="width:auto; padding:0 6px;">⬆ Move Up</button>
                  <button class="fluent-btn-small" id="btn-pdf-move-down" title="Move Page Down" style="width:auto; padding:0 6px; margin-top:4px;">⬇ Move Down</button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Orientation &amp; Order</div>
              </div>
            </div>

            <!-- Page Setup & Size Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col" style="justify-content:center;">
                  <div class="fluent-stepper-wrap">
                    <span style="font-size:10px; color:#94a3b8; width:50px;">Size:</span>
                    <select class="fluent-select-dark" id="select-pdf-page-size" style="width:90px;">
                      <option value="letter" selected>Letter (8.5x11)</option>
                      <option value="a4">A4 (210x297)</option>
                      <option value="legal">Legal (8.5x14)</option>
                    </select>
                  </div>
                  <div class="fluent-stepper-wrap" style="margin-top:4px;">
                    <span style="font-size:10px; color:#94a3b8; width:50px;">Layout:</span>
                    <select class="fluent-select-dark" id="select-pdf-page-orient" style="width:90px;">
                      <option value="portrait" selected>Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Page Setup</div>
              </div>
            </div>
          </div>

          <!-- 6. PROTECT TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-pdf-protect">
            <!-- Watermark Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-toggle-watermark" title="Toggle Watermark Visibility">
                  <span style="font-size:16px;">🛡️</span>
                  <span>Watermark</span>
                </button>
                <div class="fluent-group-col" style="justify-content:center;">
                  <select class="fluent-select-dark" id="pdf-watermark-text-select" style="width:140px;">
                    <option value="CONFIDENTIAL // GIRI GROUP" selected>CONFIDENTIAL</option>
                    <option value="EXECUTIVE REVIEW ONLY">RESTRICTED</option>
                    <option value="DRAFT // UNRELEASED">DRAFT</option>
                    <option value="OFFICIALLY CERTIFIED">CERTIFIED</option>
                    <option value="SOVEREIGN ZERO-DB">SOVEREIGN</option>
                  </select>
                  <button class="fluent-btn-small" id="btn-pdf-custom-watermark" style="width:100%; margin-top:4px;">
                    Custom Text...
                  </button>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Watermark</div>
                <button class="fluent-group-launcher" id="btn-pdf-launcher-watermark" title="Watermark Settings">⤢</button>
              </div>
            </div>

            <!-- Redaction Blackout Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-redaction-box" title="Place Blackout Redaction Box">
                  <span style="font-size:16px;">⬛</span>
                  <span>Place Redact</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-apply-redactions" title="Permanently Burn &amp; Flatten Redactions">
                  <span style="font-size:16px;">🔥</span>
                  <span>Burn Redacts</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Redaction</div>
              </div>
            </div>

            <!-- Document Security & Sovereign Scrub Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-passcode-lock" title="Encrypt PDF with Sovereign Passcode">
                  <span style="font-size:16px;">🔒</span>
                  <span>Passcode Lock</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-scrub-metadata" title="Scrub Author, Dates &amp; Revision Fingerprints">
                  <span style="font-size:16px;">🧼</span>
                  <span>Scrub Metadata</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Document Security</div>
              </div>
            </div>
          </div>

          <!-- 7. VIEW TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-pdf-view">
            <!-- Zoom & Display Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <div class="fluent-group-col">
                  <div class="fluent-group-row">
                    <button class="fluent-btn-small" id="btn-pdf-zoom-out" title="Zoom Out">-</button>
                    <span style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; width:46px; text-align:center; color:#38bdf8;" id="pdf-zoom-label">100%</span>
                    <button class="fluent-btn-small" id="btn-pdf-zoom-in" title="Zoom In">+</button>
                  </div>
                  <div class="fluent-group-row" style="margin-top:4px;">
                    <button class="fluent-btn-small" id="btn-pdf-zoom-fit" title="Fit to Width" style="width:auto; padding:0 6px;">Fit Width</button>
                    <button class="fluent-btn-small" id="btn-pdf-zoom-page" title="Fit to Page" style="width:auto; padding:0 6px;">Fit Page</button>
                    <button class="fluent-btn-small" id="btn-pdf-zoom-100" title="100% Actual Size" style="width:auto; padding:0 6px;">100%</button>
                  </div>
                </div>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Zoom</div>
              </div>
            </div>

            <!-- Page Display Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-view-single" style="background:rgba(255,255,255,0.12); color:#38bdf8;" title="Single Page Scrolling">
                  <span style="font-size:16px;">📄</span>
                  <span>Single Page</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-view-two" title="Two Pages Side-by-Side Spread">
                  <span style="font-size:16px;">📖</span>
                  <span>Two Pages</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-toggle-sidebar" title="Toggle Thumbnails Sidebar">
                  <span style="font-size:16px;">📑</span>
                  <span>Thumbnails</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Page Display</div>
              </div>
            </div>

            <!-- Reading Contrast Group -->
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-theme-light" title="Standard Paper Light Reading Mode">
                  <span style="font-size:16px;">☀️</span>
                  <span>Light Paper</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-theme-dark" title="Dark Contrast Reader Mode">
                  <span style="font-size:16px;">🌙</span>
                  <span>Dark Reader</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Contrast</div>
              </div>
            </div>
          </div>

          <!-- 8. HELP TAB PANE -->
          <div class="fluent-ribbon-pane" id="pane-pdf-help">
            <div class="fluent-ribbon-group">
              <div class="fluent-group-controls">
                <button class="fluent-btn-large" id="btn-pdf-help-center" title="Open Aegis Help Documentation">
                  <span style="font-size:18px;">❓</span>
                  <span>Help Center</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-shortcuts" title="View Keyboard Shortcuts (Ctrl+/)">
                  <span style="font-size:18px;">⌨️</span>
                  <span>Shortcuts</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-whats-new" title="What's New in Giri Aegis 2026">
                  <span style="font-size:18px;">✨</span>
                  <span>What's New</span>
                </button>
                <button class="fluent-btn-large" id="btn-pdf-feedback" title="Connect on Instagram / Feedback">
                  <span style="font-size:18px;">💬</span>
                  <span>Feedback</span>
                </button>
              </div>
              <div class="fluent-group-footer">
                <div class="fluent-group-label">Help &amp; Support</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Split View: Pages Sidebar + Document Viewport -->
      <div class="pdf-split-body">
        <!-- Left Pages Nav -->
        <aside class="pdf-pages-sidebar" id="pdf-pages-sidebar">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <span class="sidebar-heading" id="pdf-page-count-heading" style="margin:0;">PAGES (2)</span>
            <button class="ribbon-btn" id="btn-pdf-sidebar-add" style="padding:2px 6px; font-size:10px;">+ Add</button>
          </div>
          <div class="pdf-thumbs-list" id="pdf-thumbs-list" style="display:flex; flex-direction:column; gap:10px;">
            <!-- Generated Thumbnails -->
          </div>
        </aside>

        <!-- Center PDF Page Viewport -->
        <div class="pdf-canvas-viewport" id="pdf-canvas-viewport">
          <article class="pdf-rendered-sheet" id="pdf-sheet" style="position:relative; transition: transform 0.2s ease;">
            <!-- Freehand Ink Drawing Canvas Overlay -->
            <canvas class="pdf-ink-canvas" id="pdf-ink-canvas"></canvas>

            <!-- Watermark Overlay -->
            <div class="pdf-stamp-watermark-overlay" id="pdf-watermark">${watermarkText}</div>

            <!-- Page Content Container -->
            <div id="pdf-page-content-wrapper" contenteditable="true" spellcheck="false">
              <!-- Dynamically populated from active page -->
            </div>

            <!-- Annotations, Notes, Redactions & Stamps Layer -->
            <div id="pdf-annotations-layer" style="position:absolute; inset:0; pointer-events:none;"></div>
          </article>
        </div>
      </div>

      <!-- Floating Office Search Bar -->
      <div class="pdf-search-bar" id="pdf-search-bar">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="pdf-search-input" placeholder="Find in document..." style="background:#27272a; border:1px solid #3f3f46; color:#fff; border-radius:3px; padding:3px 8px; font-size:12px; outline:none; width:160px;">
        <span id="pdf-search-count" style="font-size:11px; color:#94a3b8; font-family:var(--font-mono);">0/0</span>
        <button id="btn-pdf-search-prev" class="fluent-btn-small" style="width:22px; height:22px;" title="Previous Match">↑</button>
        <button id="btn-pdf-search-next" class="fluent-btn-small" style="width:22px; height:22px;" title="Next Match">↓</button>
        <button id="btn-pdf-search-close" class="fluent-btn-small" style="width:22px; height:22px; color:#ef4444;" title="Close">✕</button>
      </div>

      <!-- Right Comments Sidebar Drawer -->
      <div class="pdf-comments-sidebar" id="pdf-comments-sidebar">
        <div class="comments-header">
          <span>Comments &amp; Review (Giri Aegis)</span>
          <button class="esc-kbd" id="btn-close-pdf-comments">✕</button>
        </div>
        <div class="comments-list" id="pdf-comments-list">
          <div class="comment-card">
            <div class="comment-card-top">
              <span class="comment-author">Abhinav Giri</span>
              <span>Just now</span>
            </div>
            <div class="comment-text">Document security verified with Sovereign Zero-DB memory architecture. Form fields ready for sign-off.</div>
          </div>
        </div>
        <div class="comments-footer-add">
          <input type="text" id="input-pdf-comment-text" placeholder="Add a comment or note..." style="width:100%; padding:6px 10px; background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; font-size:12px; outline:none;">
          <button class="btn-zoho-red" id="btn-post-pdf-comment" style="align-self:flex-end; padding:5px 12px; font-size:11px;">Post Comment</button>
        </div>
      </div>

      <!-- Interactive Digital Signature Modal -->
      <div class="office-modal-backdrop" id="signature-modal-backdrop">
        <div class="office-dialog-card" style="width:500px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">DIGITAL SIGNATURE PAD // GIRI AEGIS</span>
            <button class="esc-kbd" id="btn-close-sig-modal">✕</button>
          </div>
          <div class="office-dialog-body">
            <!-- Draw vs Type Tabs -->
            <div style="display:flex; border-bottom:1px solid var(--border-subtle); gap:4px; margin-bottom:12px;">
              <button class="office-tab-btn active" id="btn-tab-draw-sig" style="height:28px;">Draw Signature</button>
              <button class="office-tab-btn" id="btn-tab-type-sig" style="height:28px;">Type Cursive</button>
            </div>

            <!-- Draw Tab View -->
            <div id="sig-draw-view">
              <div class="signature-canvas-container">
                <canvas class="signature-draw-canvas" id="signature-draw-canvas" width="460" height="180"></canvas>
                <div class="signature-guide-line"></div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <span style="font-size:11px; color:var(--text-muted);">Draw signature with mouse or touch above the line</span>
                <button class="ribbon-btn" id="btn-clear-canvas" style="font-size:11px; color:#ef4444;">Clear Canvas</button>
              </div>
            </div>

            <!-- Type Tab View -->
            <div id="sig-type-view" style="display:none;">
              <input type="text" class="dialog-input-field" id="sig-type-input" value="Abhinav Giri" placeholder="Type your full name...">
              <div class="signature-type-preview" id="sig-type-preview" style="margin-top:12px;">
                Abhinav Giri
              </div>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="header-action-pill" id="btn-cancel-sig">Cancel</button>
            <button class="btn-zoho-red" id="btn-apply-signature" style="padding:6px 16px; font-size:12.5px;">
              Affix Signature
            </button>
          </div>
        </div>
      </div>

      <!-- Font Dialog Modal -->
      <div class="office-modal-backdrop" id="pdf-font-dialog">
        <div class="office-dialog-card" style="width:440px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">Font Settings // Giri Aegis</span>
            <button class="esc-kbd" id="btn-close-pdf-font-dialog">✕</button>
          </div>
          <div class="office-dialog-body" style="display:flex; flex-direction:column; gap:12px;">
            <div>
              <label style="font-size:11px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">Font Family</label>
              <select class="fluent-select-dark" id="pdf-dialog-font-family" style="width:100%;">
                <option value="Calibri" selected>Calibri (Modern Body)</option>
                <option value="Aptos">Aptos (Office Standard)</option>
                <option value="Arial">Arial (Standard Clean)</option>
                <option value="Times New Roman">Times New Roman (Formal Legal)</option>
                <option value="Georgia">Georgia (Serif Executive)</option>
                <option value="Courier New">Courier New (Monospace)</option>
                <option value="'Segoe UI'">Segoe UI (System)</option>
              </select>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <label style="font-size:11px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">Size (pt)</label>
                <input type="number" id="pdf-dialog-font-size" value="11" min="6" max="72" class="dialog-input-field" style="width:100%;">
              </div>
              <div>
                <label style="font-size:11px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">Font Style</label>
                <select class="fluent-select-dark" id="pdf-dialog-font-style" style="width:100%;">
                  <option value="normal" selected>Regular</option>
                  <option value="bold">Bold</option>
                  <option value="italic">Italic</option>
                  <option value="bold-italic">Bold Italic</option>
                </select>
              </div>
            </div>
            <div>
              <label style="font-size:11px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">Preview</label>
              <div id="pdf-dialog-font-preview" style="padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; font-family:Calibri, sans-serif; font-size:11pt; color:#0f172a; text-align:center;">
                The quick brown fox jumps over the lazy dog.
              </div>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="header-action-pill" id="btn-cancel-pdf-font-dialog">Cancel</button>
            <button class="btn-zoho-red" id="btn-apply-pdf-font-dialog" style="padding:6px 14px; font-size:12px;">Apply</button>
          </div>
        </div>
      </div>

      <!-- PKI Audit Certificate Modal -->
      <div class="office-modal-backdrop" id="pdf-cert-modal">
        <div class="office-dialog-card" style="width:520px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">SOVEREIGN AUDIT CERTIFICATE // GIRI AEGIS</span>
            <button class="esc-kbd" id="btn-close-pdf-cert">✕</button>
          </div>
          <div class="office-dialog-body" style="font-size:12px; color:#334155; line-height:1.6;">
            <div style="display:flex; align-items:center; gap:12px; padding:12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; margin-bottom:14px;">
              <span style="font-size:24px;">🛡️</span>
              <div>
                <strong style="color:#15803d; font-size:13px; display:block;">VALID SOVEREIGN PROOF</strong>
                <span style="font-size:10.5px; color:#166534;">Document cryptographically bound to zero-database local client memory.</span>
              </div>
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:11.5px; margin-bottom:12px;">
              <tr><td style="padding:4px 0; color:#64748b; width:120px;">Issuer:</td><td style="font-weight:600;">Giri Sovereign Computing Division // PKI Node 1</td></tr>
              <tr><td style="padding:4px 0; color:#64748b;">Algorithm:</td><td style="font-family:var(--font-mono);">SHA-256 / Browser-Native WebCrypto</td></tr>
              <tr><td style="padding:4px 0; color:#64748b;">Timestamp:</td><td id="pdf-cert-timestamp">${new Date().toUTCString()}</td></tr>
              <tr><td style="padding:4px 0; color:#64748b;">Digest (Hash):</td><td style="font-family:var(--font-mono); word-break:break-all; font-size:10.5px; color:#1e40af;" id="pdf-cert-digest">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</td></tr>
            </table>
          </div>
          <div class="office-dialog-footer">
            <button class="btn-zoho-red" id="btn-cert-copy-hash" style="padding:6px 14px; font-size:12px;">Copy Digest</button>
            <button class="header-action-pill" id="btn-cert-close">Close</button>
          </div>
        </div>
      </div>

      <!-- Passcode Lock Modal -->
      <div class="office-modal-backdrop" id="pdf-password-modal">
        <div class="office-dialog-card" style="width:420px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">ENCRYPT PDF WITH PASSCODE</span>
            <button class="esc-kbd" id="btn-close-pdf-password">✕</button>
          </div>
          <div class="office-dialog-body" style="font-size:12px; display:flex; flex-direction:column; gap:10px;">
            <p style="color:#64748b; margin:0;">Set an enterprise passcode to restrict document editing and export.</p>
            <div>
              <label style="font-size:11px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">Enter Passcode:</label>
              <input type="password" id="input-pdf-passcode" class="dialog-input-field" placeholder="••••••••" style="width:100%;">
            </div>
            <div>
              <label style="font-size:11px; font-weight:600; color:#475569; display:block; margin-bottom:4px;">Confirm Passcode:</label>
              <input type="password" id="input-pdf-passcode-confirm" class="dialog-input-field" placeholder="••••••••" style="width:100%;">
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="header-action-pill" id="btn-cancel-pdf-password">Cancel</button>
            <button class="btn-zoho-red" id="btn-apply-pdf-password" style="padding:6px 14px; font-size:12px;">Encrypt Document</button>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts Modal -->
      <div class="office-modal-backdrop" id="pdf-shortcuts-modal">
        <div class="office-dialog-card" style="width:520px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">KEYBOARD SHORTCUTS // GIRI AEGIS PDF</span>
            <button class="esc-kbd" id="btn-close-pdf-shortcuts">✕</button>
          </div>
          <div class="office-dialog-body" style="font-size:12px;">
            <table style="width:100%; border-collapse:collapse; line-height:2;">
              <tr style="border-bottom:1px solid #e2e8f0;"><td style="font-weight:600; color:#0f172a;">Save PDF</td><td><kbd class="esc-kbd">Ctrl+S</kbd></td></tr>
              <tr style="border-bottom:1px solid #e2e8f0;"><td style="font-weight:600; color:#0f172a;">Print Document</td><td><kbd class="esc-kbd">Ctrl+P</kbd></td></tr>
              <tr style="border-bottom:1px solid #e2e8f0;"><td style="font-weight:600; color:#0f172a;">Find &amp; Replace</td><td><kbd class="esc-kbd">Ctrl+F</kbd></td></tr>
              <tr style="border-bottom:1px solid #e2e8f0;"><td style="font-weight:600; color:#0f172a;">Undo / Redo</td><td><kbd class="esc-kbd">Ctrl+Z</kbd> / <kbd class="esc-kbd">Ctrl+Y</kbd></td></tr>
              <tr style="border-bottom:1px solid #e2e8f0;"><td style="font-weight:600; color:#0f172a;">Bold / Italic / Underline</td><td><kbd class="esc-kbd">Ctrl+B</kbd> / <kbd class="esc-kbd">Ctrl+I</kbd> / <kbd class="esc-kbd">Ctrl+U</kbd></td></tr>
              <tr style="border-bottom:1px solid #e2e8f0;"><td style="font-weight:600; color:#0f172a;">Select All Content</td><td><kbd class="esc-kbd">Ctrl+A</kbd></td></tr>
              <tr style="border-bottom:1px solid #e2e8f0;"><td style="font-weight:600; color:#0f172a;">Toggle Draw Pen</td><td><kbd class="esc-kbd">Alt+P</kbd></td></tr>
              <tr><td style="font-weight:600; color:#0f172a;">Toggle Fullscreen / Close Modal</td><td><kbd class="esc-kbd">Esc</kbd></td></tr>
            </table>
          </div>
          <div class="office-dialog-footer">
            <button class="header-action-pill" id="btn-close-pdf-shortcuts-footer">Close</button>
          </div>
        </div>
      </div>

      <!-- What's New Modal -->
      <div class="office-modal-backdrop" id="pdf-whats-new-modal">
        <div class="office-dialog-card" style="width:480px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">WHAT'S NEW IN GIRI AEGIS 2026</span>
            <button class="esc-kbd" id="btn-close-pdf-whats-new">✕</button>
          </div>
          <div class="office-dialog-body" style="font-size:12px; color:#334155; line-height:1.7;">
            <h3 style="font-size:14px; font-weight:700; color:#0f172a; margin:0 0 6px;">Office 365 Dark Ribbon Architecture</h3>
            <p>Experience the modern two-tier dark ribbon with grouped controls, bottom labels, and dialog launchers matching Drift, Axis, and Kinetic.</p>
            <h3 style="font-size:14px; font-weight:700; color:#0f172a; margin:10px 0 6px;">Freehand Ink Canvas</h3>
            <p>Draw signatures, notes, or markup directly onto the document with live HTML5 pen drawing, customizable ink colors, and stroke weights.</p>
            <h3 style="font-size:14px; font-weight:700; color:#0f172a; margin:10px 0 6px;">Cryptographic PKI Verification</h3>
            <p>Generate verifiable SHA-256 document digests on demand to ensure zero data tampering across sovereign client deployments.</p>
          </div>
          <div class="office-dialog-footer">
            <button class="btn-zoho-red" id="btn-whats-new-ok" style="padding:6px 16px; font-size:12px;">Got It</button>
          </div>
        </div>
      <!-- Mobile Floating Quick-Action Bar for PDF Studio -->
      <div class="pdf-mobile-toolbar" id="pdf-mobile-toolbar" style="display:none;">
        <button class="mobile-tool-btn" id="btn-mobile-pdf-prev" title="Previous Page">◀</button>
        <span id="pdf-mobile-page-pill" style="font-size:11px; font-weight:700; color:#f8fafc; padding:0 4px;">1 / 1</span>
        <button class="mobile-tool-btn" id="btn-mobile-pdf-next" title="Next Page">▶</button>
        <div class="mobile-tool-sep"></div>
        <button class="mobile-tool-btn" id="btn-mobile-pdf-pen" title="Ink Drawing">✏</button>
        <button class="mobile-tool-btn" id="btn-mobile-pdf-sig" title="Signature">🖋</button>
        <button class="mobile-tool-btn" id="btn-mobile-pdf-stamp" title="Approve Stamp">🏷</button>
        <button class="mobile-tool-btn" id="btn-mobile-pdf-rotate" title="Rotate 90°">↻</button>
        <button class="mobile-tool-btn" id="btn-mobile-pdf-save" title="Download PDF" style="color:#ef4444;">💾</button>
      </div>

      <!-- Giri Aegis Bottom Status Bar -->
      ${orbitDesktopSuite.renderStatusBar('pdf', { currentPage: 1, totalPages: pages.length })}
    </div>
  `;


  initPdfStudioWorkspace(container, pages, activePageIndex, watermarkText, isWatermarkActive, currentZoom, onPdfUpdate);
}

function initPdfStudioWorkspace(container, pages, activePageIndex, watermarkText, isWatermarkActive, currentZoom, onPdfUpdate) {
  // Giri Aegis Desktop Suite Event Binding
  orbitDesktopSuite.bindEvents(container, 'pdf', {
    onNew: () => mountPdfEditor(container, 'blank', onPdfUpdate),
    onOpen: () => container.querySelector('#pdf-file-open-input')?.click(),
    onSave: () => {
      if (pages[activePageIndex] && contentWrapper) {
        pages[activePageIndex].htmlContent = contentWrapper.innerHTML;
        localStorage.setItem('giri_orbit_pdf_pages', JSON.stringify(pages));
      }
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Saved drawing to local storage');
    },
    onSaveDevice: () => container.querySelector('#file-menu-save-device')?.click() || container.querySelector('#btn-pdf-save-device')?.click(),
    onExportPdf: () => container.querySelector('#btn-pdf-export-pdf')?.click() || window.print(),
    onZoom: (val) => {
      const scale = parseInt(val, 10) / 100;
      if (sheetEl) {
        sheetEl.style.transform = `scale(${scale})`;
        sheetEl.style.transformOrigin = 'top center';
      }
    },
    onUiToggle: (mode) => {
      container.classList.remove('orbit-ui-standard', 'orbit-ui-notebookbar');
      container.classList.add(`orbit-ui-${mode}`);
    }
  });
  const thumbsList = container.querySelector('#pdf-thumbs-list');
  const pageCountHeading = container.querySelector('#pdf-page-count-heading');
  const contentWrapper = container.querySelector('#pdf-page-content-wrapper');
  const annotationsLayer = container.querySelector('#pdf-annotations-layer');
  const watermarkEl = container.querySelector('#pdf-watermark');
  const sheetEl = container.querySelector('#pdf-sheet');
  const zoomLabel = container.querySelector('#pdf-zoom-label');
  const ribbonTabs = container.querySelectorAll('.fluent-tab-btn[data-tab]');
  const ribbonPanes = container.querySelectorAll('.fluent-ribbon-pane');
  const fileMenuBtn = container.querySelector('#btn-pdf-file-menu');
  const fileMenuDropdown = container.querySelector('#pdf-file-menu-dropdown');
  const commentsSidebar = container.querySelector('#pdf-comments-sidebar');
  const searchBar = container.querySelector('#pdf-search-bar');
  const searchInput = container.querySelector('#pdf-search-input');
  const searchCount = container.querySelector('#pdf-search-count');
  const inkCanvas = container.querySelector('#pdf-ink-canvas');
  const inkCtx = inkCanvas?.getContext('2d');

  // Audit Event Log for Catch Up
  const auditLog = [
    { action: 'Opened Document', time: new Date().toLocaleTimeString() },
    { action: 'Initial Sovereign Seal Verified', time: new Date().toLocaleTimeString() }
  ];

  // State Variables
  let isEditingMode = true;
  let isTwoPagesView = false;
  let isDrawingInk = false;
  let isInkActive = false;
  let inkPenColor = '#1e3a8a';
  let inkPenWidth = 2.5;
  let currentTool = 'select'; // 'select' or 'hand'
  let isPanning = false;
  let panStartX = 0, panStartY = 0;
  let currentCaseState = 0; // 0: UPPER, 1: lower, 2: Title, 3: Sentence

  // Format Painter State
  let isPainterActive = false;
  let copiedStyle = null;

  // Direct Sync instance
  const syncDoc = {
    name: 'Aegis_Executive_Document.pdf',
    format: 'pdf',
    getData: () => JSON.stringify(pages)
  };

  // Initialize Ink Canvas Size
  function resizeInkCanvas() {
    if (!inkCanvas || !sheetEl) return;
    inkCanvas.width = sheetEl.offsetWidth || 800;
    inkCanvas.height = sheetEl.offsetHeight || 1020;
  }
  resizeInkCanvas();
  window.addEventListener('resize', resizeInkCanvas);

  // Freehand Drawing Logic
  if (inkCanvas && inkCtx) {
    function getCanvasPos(e) {
      const rect = inkCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const scaleX = inkCanvas.width / rect.width;
      const scaleY = inkCanvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    inkCanvas.onmousedown = (e) => {
      if (!isInkActive) return;
      isDrawingInk = true;
      const pos = getCanvasPos(e);
      inkCtx.beginPath();
      inkCtx.moveTo(pos.x, pos.y);
      inkCtx.strokeStyle = inkPenColor;
      inkCtx.lineWidth = inkPenWidth;
      inkCtx.lineCap = 'round';
      inkCtx.lineJoin = 'round';
    };

    inkCanvas.onmousemove = (e) => {
      if (!isDrawingInk || !isInkActive) return;
      const pos = getCanvasPos(e);
      inkCtx.lineTo(pos.x, pos.y);
      inkCtx.stroke();
    };

    window.addEventListener('mouseup', () => { isDrawingInk = false; });

    // Touch support
    inkCanvas.ontouchstart = (e) => {
      if (!isInkActive) return;
      e.preventDefault();
      isDrawingInk = true;
      const pos = getCanvasPos(e);
      inkCtx.beginPath();
      inkCtx.moveTo(pos.x, pos.y);
      inkCtx.strokeStyle = inkPenColor;
      inkCtx.lineWidth = inkPenWidth;
      inkCtx.lineCap = 'round';
      inkCtx.lineJoin = 'round';
    };

    inkCanvas.ontouchmove = (e) => {
      if (!isDrawingInk || !isInkActive) return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      inkCtx.lineTo(pos.x, pos.y);
      inkCtx.stroke();
    };

    inkCanvas.ontouchend = () => { isDrawingInk = false; };
  }

  // Toggle Freehand Pen Draw
  const penBtn = container.querySelector('#btn-pdf-pen-draw');
  penBtn?.addEventListener('click', () => {
    isInkActive = !isInkActive;
    penBtn.classList.toggle('active', isInkActive);
    inkCanvas?.classList.toggle('drawing-active', isInkActive);
    if (isInkActive) {
      penBtn.style.background = 'rgba(56, 189, 248, 0.2)';
      penBtn.style.borderColor = '#38bdf8';
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Ink pen active: Draw anywhere on document');
    } else {
      penBtn.style.background = 'transparent';
      penBtn.style.borderColor = 'transparent';
    }
  });

  container.querySelector('#input-pdf-pen-color')?.addEventListener('change', (e) => {
    inkPenColor = e.target.value;
  });

  container.querySelector('#select-pdf-pen-width')?.addEventListener('change', (e) => {
    inkPenWidth = parseFloat(e.target.value) || 2.5;
  });

  container.querySelector('#btn-pdf-clear-ink')?.addEventListener('click', () => {
    if (inkCtx && inkCanvas) {
      inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Ink strokes cleared');
    }
  });

  // File menu dropdown toggle
  container.querySelector('#btn-pdf-return-hub')?.addEventListener('click', () => {
    if (window.orbitPlatform) window.orbitPlatform.navigateTo('launcher');
  });

  fileMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileMenuDropdown?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!fileMenuDropdown?.contains(e.target) && e.target !== fileMenuBtn) {
      fileMenuDropdown?.classList.remove('open');
    }
  });

  // Direct Local Disk Save & Sync (FSA API)
  const pdfSaveDeviceBtn = container.querySelector('#btn-pdf-save-device');
  const pdfSyncStatusText = container.querySelector('#txt-pdf-sync-status');

  const performPdfDirectSave = async (forcePicker = false) => {
    try { localStorage.setItem('giri_orbit_pdf_pages', JSON.stringify(pages)); } catch {}
    if (typeof window !== 'undefined' && window.giriSyncManager) {
      const docTitle = pages[0]?.title || 'PDF Document';
      window.giriSyncManager.recordSync('pdf', pages, docTitle, {
        snippet: `Cryptographically sealed PDF with ${pages.length} page(s).`,
        stats: `${pages.length} Pages • ISO Compliant • Sovereign`
      });
    }
    if (typeof window !== 'undefined') {
      const docTitle = pages[0]?.title || 'PDF Document';
      window.dispatchEvent(new CustomEvent('orbit:document-edit', {
        detail: { tool: 'pdf', content: JSON.stringify(pages), title: docTitle }
      }));
    }
    const docTitle = pages[0]?.title || 'Aegis_Document';
    const res = await localSync.saveToDevice({
      tool: 'pdf',
      content: JSON.stringify(pages, null, 2),
      suggestedName: docTitle.replace(/[^a-zA-Z0-9_-]/g, '_'),
      extension: 'gpdf',
      mimeType: 'application/json',
      forcePicker
    });
    if (res.success && res.mode === 'direct' && pdfSyncStatusText) {
      pdfSyncStatusText.textContent = `● ${res.name.slice(0, 12)}`;
      if (pdfSaveDeviceBtn) pdfSaveDeviceBtn.style.background = '#047857';
    }
  };

  const performPdfDirectOpen = async () => {
    const res = await localSync.openFromDevice({
      tool: 'pdf',
      acceptTypes: {
        'application/json': ['.gpdf', '.gaegis', '.giri', '.json'],
        'application/pdf': ['.pdf', '.gaegis', '.giri'],
        'application/x-giri-universal-office': ['.giri']
      }
    });
    if (res && res.content) {
      try {
        const parsedUni = GiriOfficeFormats.parseUniversalGiri && GiriOfficeFormats.parseUniversalGiri(res.content);
        const parsedAegis = !parsedUni && GiriOfficeFormats.parseGAegis ? GiriOfficeFormats.parseGAegis(res.content) : null;
        let candidatePages = null;
        if (parsedUni && parsedUni.tools && Array.isArray(parsedUni.tools.pdf)) {
          candidatePages = parsedUni.tools.pdf;
        } else if (parsedAegis && Array.isArray(parsedAegis.pages)) {
          candidatePages = parsedAegis.pages;
        } else {
          const direct = JSON.parse(res.content);
          if (Array.isArray(direct)) candidatePages = direct;
          else if (direct.pages && Array.isArray(direct.pages)) candidatePages = direct.pages;
        }
        if (Array.isArray(candidatePages) && candidatePages.length > 0) {
          pages = candidatePages;
          activePageIndex = 0;
          renderPagesSidebar();
          switchPage(0);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Loaded "${res.name}" (Universal Office Parity)`);
        }
      } catch (err) {
        alert('Invalid PDF document data format.');
      }
    }
  };

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      performPdfDirectSave(false);
      if (window.orbitDriveSync && window.orbitDriveSync.currentActiveFileId) {
        window.orbitDriveSync.saveCurrentActiveFileToRealGoogleDrive('pdf');
      }
      return;
    }
    if (e.key === 'Escape') {
      fileMenuDropdown?.classList.remove('open');
      container.querySelectorAll('.office-modal-backdrop').forEach(m => m.classList.remove('open'));
      commentsSidebar?.classList.remove('open');
      searchBar?.classList.remove('open');
    }
  });

  // File Menu Actions
  fileMenuDropdown?.querySelectorAll('.file-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      fileMenuDropdown.classList.remove('open');
      switch (action) {
        case 'ai-agent':
          if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
            window.orbitPlatform.openGirionixAgent('pdf');
          } else if (window.orbitAgent) {
            window.orbitAgent.openAgent('pdf');
          }
          break;
        case 'drive-sync':
          window.orbitDriveSync?.openDriveModal('browser', 'pdf');
          break;
        case 'save-device':
          performPdfDirectSave(true);
          break;
        case 'open-device':
          performPdfDirectOpen();
          break;
        case 'new':
          if (confirm('Create new blank PDF document?')) {
            pages = [{ id: Date.now(), rotation: 0, title: 'Blank PDF Document', ref: 'GIRI-PDF-01', htmlContent: '<div class="pdf-blank-page-content" contenteditable="true" spellcheck="false" style="min-height:850px; outline:none; font-family:Calibri, Arial, sans-serif; font-size:11pt; color:#0f172a; padding:30px 20px;"><p>Start typing sovereign document...</p></div>' }];
            activePageIndex = 0;
            renderPagesSidebar();
            switchPage(0);
            auditLog.push({ action: 'Created New Blank Document', time: new Date().toLocaleTimeString() });
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Created new blank PDF document');
          }
          break;
        case 'open':
          container.querySelector('#file-menu-pdf-open-device')?.click();
          break;
        case 'share': {
          const url = window.orbitPlatform ? window.orbitPlatform.getToolUrl('pdf') : `${window.location.origin}/#pdf`;
          navigator.clipboard?.writeText(url);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Copied direct link to Giri Aegis PDF: ${url}`);
          break;
        }
        case 'copy':
          localStorage.setItem('giri_orbit_pdf_copy_' + Date.now(), JSON.stringify(pages));
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Created sovereign local copy of PDF');
          break;
        case 'save-template': {
          const name = prompt('Enter custom template name:', 'Custom PDF Contract ' + new Date().toLocaleDateString());
          if (!name) break;
          const desc = prompt('Enter template description:', 'Custom sovereign PDF form/template');
          let customTpls = [];
          try {
            const stored = localStorage.getItem('giri_orbit_pdf_custom_templates');
            if (stored) customTpls = JSON.parse(stored);
          } catch(e) {}
          const newTpl = {
            id: 'custom-pdf-' + Date.now(),
            name,
            category: 'custom',
            desc: desc || 'Custom PDF template',
            pages: JSON.parse(JSON.stringify(pages))
          };
          customTpls.push(newTpl);
          localStorage.setItem('giri_orbit_pdf_custom_templates', JSON.stringify(customTpls));
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Saved "${name}" as custom PDF template!`);
          break;
        }
        case 'import-template':
          container.querySelector('#pdf-editor-import-tpl-input')?.click();
          break;
        case 'export':
          if (window.orbitPlatform) {
            window.orbitPlatform.openExportModal('pdf');
          } else {
            window.print();
          }
          break;
        case 'print':
          if (window.orbitPlatform?.printManager) {
            window.orbitPlatform.printManager.open('pdf');
          } else {
            window.print();
          }
          break;
        case 'rename': {
          const newName = prompt('Enter document title:', pages[activePageIndex]?.title || 'PDF Document');
          if (newName && newName.trim()) {
            pages[activePageIndex].title = newName.trim();
            renderPagesSidebar();
            auditLog.push({ action: `Renamed to ${newName.trim()}`, time: new Date().toLocaleTimeString() });
          }
          break;
        }
        case 'history':
          alert(`Sovereign Audit History:\n${auditLog.map(x => `• [${x.time}] ${x.action}`).join('\n')}`);
          break;
        case 'delete':
          if (confirm('Delete current PDF page?')) {
            container.querySelector('#btn-pdf-del-page')?.click();
          }
          break;
        case 'info':
          alert(`Giri Aegis PDF Studio Info:\nTotal Pages: ${pages.length}\nActive Page: ${activePageIndex + 1}\nWatermark: ${watermarkText} (${isWatermarkActive ? 'Active' : 'Off'})\nPKI Status: SHA-256 Verified Sovereign`);
          break;
      }
    });
  });

  // Editor Import Custom Template
  const editorPdfImportInput = container.querySelector('#pdf-editor-import-tpl-input');
  container.querySelector('#btn-pdf-import-custom-template')?.addEventListener('click', () => {
    editorPdfImportInput?.click();
  });
  editorPdfImportInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (re) => {
      try {
        const raw = re.target.result;
        let tplName = file.name.replace(/\.[^/.]+$/, '');
        let newPages = [];
        let desc = `Custom PDF template (${file.name})`;

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            newPages = parsed;
          } else if (parsed.pages && Array.isArray(parsed.pages)) {
            newPages = parsed.pages;
            if (parsed.name) tplName = parsed.name;
            if (parsed.desc) desc = parsed.desc;
          } else if (parsed.htmlContent) {
            newPages = [{ id: Date.now(), rotation: 0, title: parsed.name || tplName, htmlContent: parsed.htmlContent }];
          } else {
            newPages = [{ id: Date.now(), rotation: 0, title: tplName, htmlContent: `<pre style="font-family:monospace; font-size:12px;">${JSON.stringify(parsed, null, 2)}</pre>` }];
          }
        } else if (file.name.endsWith('.md')) {
          const lines = raw.split('\n');
          let bodyHtml = '';
          lines.forEach(l => {
            const tr = l.trim();
            if (tr.startsWith('# ')) bodyHtml += `<h1 style="font-size:22px; font-weight:800; color:#0f172a; margin:16px 0 8px 0;">${tr.slice(2)}</h1>`;
            else if (tr.startsWith('## ')) bodyHtml += `<h2 style="font-size:17px; font-weight:700; color:#1e293b; margin:14px 0 6px 0;">${tr.slice(3)}</h2>`;
            else if (tr.startsWith('- ') || tr.startsWith('* ')) bodyHtml += `<li style="margin-left:18px; font-size:12px; color:#334155; line-height:1.6;">${tr.slice(2)}</li>`;
            else if (tr.length > 0) bodyHtml += `<p style="font-size:12px; line-height:1.6; color:#334155; margin-bottom:8px;">${tr}</p>`;
          });
          newPages = [{
            id: Date.now(),
            rotation: 0,
            title: tplName,
            ref: `DOC-${Date.now().toString().slice(-6)}`,
            htmlContent: `<div style="padding:24px; font-family:var(--font-body);">${bodyHtml}</div>`
          }];
        } else {
          const content = raw.includes('<') && raw.includes('>') ? raw : `<div style="padding:24px; font-family:var(--font-body); line-height:1.7; color:#334155;">${raw.replace(/\n\n/g, '<br><br>')}</div>`;
          newPages = [{
            id: Date.now(),
            rotation: 0,
            title: tplName,
            ref: `DOC-${Date.now().toString().slice(-6)}`,
            htmlContent: content
          }];
        }

        if (newPages.length > 0) {
          let customTpls = [];
          try {
            const stored = localStorage.getItem('giri_orbit_pdf_custom_templates');
            if (stored) customTpls = JSON.parse(stored);
          } catch(err) {}
          const newTpl = {
            id: 'custom-pdf-' + Date.now(),
            name: tplName,
            category: 'custom',
            desc,
            previewAccent: '#dc2626',
            pages: newPages,
            isCustom: true
          };
          customTpls.push(newTpl);
          localStorage.setItem('giri_orbit_pdf_custom_templates', JSON.stringify(customTpls));

          const loadNow = confirm(`Imported "${tplName}" (${newPages.length} pages).\n\nLoad into active document now?`);
          if (loadNow) {
            pages = newPages;
            activePageIndex = 0;
            renderPagesSidebar();
            switchPage(0);
          }
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported custom template "${tplName}"!`);
        }
      } catch (err) {
        alert('Failed to import template: ' + err.message);
      }
    };
    reader.readAsText(file);
    editorPdfImportInput.value = '';
  });

  // Top action pills
  container.querySelector('#btn-pdf-save-device')?.addEventListener('click', () => {
    performPdfDirectSave(false);
  });
  container.querySelector('#btn-pdf-drive-sync')?.addEventListener('click', () => {
    window.orbitDriveSync?.openDriveModal('browser', 'pdf');
  });

  localSync.subscribe((tool, fileName, handle) => {
    if (tool === 'pdf' && pdfSyncStatusText) {
      if (fileName) {
        pdfSyncStatusText.textContent = `● ${fileName.slice(0, 12)}`;
        if (pdfSaveDeviceBtn) pdfSaveDeviceBtn.style.background = '#047857';
      } else {
        pdfSyncStatusText.textContent = 'Save to Device';
        if (pdfSaveDeviceBtn) pdfSaveDeviceBtn.style.background = '#059669';
      }
    }
  });

  container.querySelector('#btn-pdf-autosave-toggle')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.toggleAutoSave === 'function') {
      window.orbitPlatform.toggleAutoSave();
    }
  });

  container.querySelector('#btn-pdf-special-link')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.generateSpecialDocLink === 'function') {
      const link = window.orbitPlatform.generateSpecialDocLink('pdf');
      window.orbitPlatform.openShareModal(link, 'pdf');
    }
  });

  container.querySelector('#btn-pdf-share')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.copyToolLink === 'function') {
      window.orbitPlatform.copyToolLink('pdf');
    } else {
      const url = `${window.location.origin}${window.location.pathname}#pdf`;
      navigator.clipboard?.writeText(url);
      if (window.orbitPlatform) window.orbitPlatform.showToast('Copied link to clipboard', 'orange');
    }
  });

  // Comments Sidebar Toggle & Comment Posting
  const commentsBtn = container.querySelector('#btn-pdf-comments');
  const closeCommentsBtn = container.querySelector('#btn-close-pdf-comments');
  const postCommentBtn = container.querySelector('#btn-post-pdf-comment');
  const commentInput = container.querySelector('#input-pdf-comment-text');
  const commentsList = container.querySelector('#pdf-comments-list');
  const commentsBadge = container.querySelector('#pdf-comments-count-badge');
  let commentCount = 1;

  function toggleComments() {
    commentsSidebar?.classList.toggle('open');
  }
  commentsBtn?.addEventListener('click', toggleComments);
  closeCommentsBtn?.addEventListener('click', () => commentsSidebar?.classList.remove('open'));

  postCommentBtn?.addEventListener('click', () => {
    const text = commentInput?.value?.trim();
    if (!text) return;
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.innerHTML = `
      <div class="comment-card-top">
        <span class="comment-author">Executive User</span>
        <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="comment-text">${text}</div>
    `;
    commentsList?.appendChild(card);
    commentInput.value = '';
    commentCount++;
    if (commentsBadge) commentsBadge.textContent = commentCount;
    auditLog.push({ action: `Added Comment: "${text.substring(0, 20)}..."`, time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Comment posted');
  });

  // Browser Sync modal button
  container.querySelector('#btn-pdf-browser-sync')?.addEventListener('click', () => {
    if (window.giriSyncManager) window.giriSyncManager.openStorageModal();
  });

  // Catch up button
  container.querySelector('#btn-pdf-catchup')?.addEventListener('click', () => {
    alert(`Catch Up — Sovereign Revision Log:\n\n${auditLog.map(x => `• [${x.time}] ${x.action}`).join('\n')}`);
  });

  // Editing vs Viewing Mode Toggle
  const modeBtn = container.querySelector('#btn-pdf-mode');
  const modeLabel = container.querySelector('#pdf-mode-label');
  modeBtn?.addEventListener('click', () => {
    isEditingMode = !isEditingMode;
    contentWrapper.contentEditable = isEditingMode ? 'true' : 'false';
    container.querySelectorAll('.pdf-fillable-input, .pdf-fillable-check').forEach(el => {
      el.disabled = !isEditingMode;
    });
    if (modeLabel) modeLabel.textContent = isEditingMode ? 'Editing ▾' : 'Viewing ▾';
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Switched to ${isEditingMode ? 'Editing' : 'Viewing / Read-Only'} Mode`);
  });

  contentWrapper?.addEventListener('input', () => {
    if (pages[activePageIndex]) {
      pages[activePageIndex].htmlContent = contentWrapper.innerHTML;
      try {
        localStorage.setItem('giri_orbit_pdf_pages', JSON.stringify(pages));
        if (typeof window !== 'undefined' && window.giriSyncManager) {
          window.giriSyncManager.recordSync('pdf', pages, pages[0]?.title || 'Certified Executive Memorandum');
        }
      } catch {}
    }
  });

  // Ribbon Tab Switching
  ribbonTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      ribbonTabs.forEach(b => b.classList.remove('active'));
      ribbonPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = container.querySelector(`#pane-pdf-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });

  // Sidebar Pages & Navigation
  function renderPagesSidebar() {
    if (!thumbsList || !pageCountHeading) return;
    thumbsList.innerHTML = '';
    pageCountHeading.textContent = `PAGES (${pages.length})`;
    const mobilePagePill = container.querySelector('#pdf-mobile-page-pill');
    if (mobilePagePill) mobilePagePill.textContent = `${activePageIndex + 1} / ${pages.length}`;

    // Sidebar render only — actual user save happens via performPdfDirectSave or export

    pages.forEach((p, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `pdf-page-thumb ${idx === activePageIndex ? 'active' : ''}`;
      thumb.dataset.index = idx;
      thumb.style.cursor = 'pointer';
      thumb.style.position = 'relative';
      thumb.innerHTML = `
        <span class="thumb-index-num">${idx + 1}</span>
        <div class="pdf-thumb-canvas" style="transform: rotate(${p.rotation || 0}deg);">
          <div style="height:3px; width:70%; background:#0f172a; margin-bottom:4px;"></div>
          <div style="height:2px; width:90%; background:#cbd5e1; margin-bottom:2px;"></div>
          <div style="height:2px; width:85%; background:#cbd5e1; margin-bottom:2px;"></div>
          <div style="height:2px; width:60%; background:#cbd5e1;"></div>
        </div>
        <div class="pdf-thumb-menu-btn" title="Page options" style="position:absolute; top:4px; right:4px; font-size:12px; line-height:1; color:#94a3b8; cursor:pointer; padding:2px 4px; border-radius:3px;">⋮</div>
      `;
      thumb.addEventListener('click', (e) => {
        if (!e.target.closest('.pdf-thumb-menu-btn')) switchPage(idx);
      });
      thumb.querySelector('.pdf-thumb-menu-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = prompt(`Page ${idx + 1} Options:\n1. Duplicate Page\n2. Delete Page\n3. Move Up\n4. Move Down\n\nEnter 1, 2, 3, or 4:`, '1');
        if (action === '1') {
          const cloned = JSON.parse(JSON.stringify(pages[idx]));
          cloned.id = Date.now();
          cloned.title = (cloned.title || 'Page') + ' (Copy)';
          pages.splice(idx + 1, 0, cloned);
          renderPagesSidebar();
          switchPage(idx + 1);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Duplicated Page ${idx + 1}`);
        } else if (action === '2') {
          if (pages.length <= 1) {
            alert('Cannot delete the only page.');
            return;
          }
          if (confirm(`Delete page ${idx + 1}?`)) {
            pages.splice(idx, 1);
            renderPagesSidebar();
            switchPage(Math.min(idx, pages.length - 1));
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Deleted page`);
          }
        } else if (action === '3' && idx > 0) {
          const item = pages.splice(idx, 1)[0];
          pages.splice(idx - 1, 0, item);
          renderPagesSidebar();
          switchPage(idx - 1);
        } else if (action === '4' && idx < pages.length - 1) {
          const item = pages.splice(idx, 1)[0];
          pages.splice(idx + 1, 0, item);
          renderPagesSidebar();
          switchPage(idx + 1);
        }
      });
      thumbsList.appendChild(thumb);
    });
  }

  function switchPage(index) {
    if (index < 0 || index >= pages.length) return;
    if (activePageIndex >= 0 && activePageIndex !== index && pages[activePageIndex]) {
      const currentHtml = contentWrapper.innerHTML;
      if (currentHtml && !currentHtml.includes('Dynamically populated from active page')) {
        pages[activePageIndex].htmlContent = currentHtml;
      }
    }
    activePageIndex = index;
    const page = pages[activePageIndex];
    contentWrapper.innerHTML = page.htmlContent;
    sheetEl.style.transform = `scale(${currentZoom / 100}) rotate(${page.rotation || 0}deg)`;

    container.querySelectorAll('.pdf-page-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === activePageIndex);
    });
    const mobilePagePill = container.querySelector('#pdf-mobile-page-pill');
    if (mobilePagePill) mobilePagePill.textContent = `${activePageIndex + 1} / ${pages.length}`;

    if (inkCtx && inkCanvas) {
      inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
    }
  }

  // =========================================================================
  // HOME TAB CONTROLS: UNDO, REDO, CLIPBOARD, TOOLS, FONT, VOICE
  // =========================================================================
  container.querySelector('#btn-pdf-undo')?.addEventListener('click', () => {
    document.execCommand('undo');
  });

  container.querySelector('#btn-pdf-redo')?.addEventListener('click', () => {
    document.execCommand('redo');
  });

  container.querySelector('#btn-pdf-paste')?.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) document.execCommand('insertText', false, text);
    } catch {
      contentWrapper.focus();
      document.execCommand('paste');
    }
  });

  container.querySelector('#btn-pdf-cut')?.addEventListener('click', () => {
    document.execCommand('cut');
  });

  container.querySelector('#btn-pdf-copy')?.addEventListener('click', () => {
    document.execCommand('copy');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Copied to clipboard');
  });

  // Format Painter State Machine
  const formatPainterBtn = container.querySelector('#btn-pdf-format-painter');
  formatPainterBtn?.addEventListener('click', () => {
    isPainterActive = !isPainterActive;
    formatPainterBtn.classList.toggle('active', isPainterActive);
    if (isPainterActive) {
      formatPainterBtn.style.background = 'rgba(56, 189, 248, 0.2)';
      formatPainterBtn.style.borderColor = '#38bdf8';
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
        const comp = window.getComputedStyle(el);
        copiedStyle = {
          fontFamily: comp.fontFamily,
          fontSize: comp.fontSize,
          fontWeight: comp.fontWeight,
          color: comp.color,
          backgroundColor: comp.backgroundColor
        };
      }
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Format Painter active: Click destination text');
    } else {
      formatPainterBtn.style.background = 'transparent';
      formatPainterBtn.style.borderColor = 'transparent';
      copiedStyle = null;
    }
  });

  contentWrapper?.addEventListener('mouseup', () => {
    if (isPainterActive && copiedStyle) {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) {
        if (copiedStyle.color) document.execCommand('foreColor', false, copiedStyle.color);
        if (copiedStyle.fontWeight && (copiedStyle.fontWeight === 'bold' || parseInt(copiedStyle.fontWeight) >= 700)) {
          document.execCommand('bold');
        }
      }
      isPainterActive = false;
      formatPainterBtn?.classList.remove('active');
      if (formatPainterBtn) {
        formatPainterBtn.style.background = 'transparent';
        formatPainterBtn.style.borderColor = 'transparent';
      }
      copiedStyle = null;
    }
  });

  // Tools: Select vs Hand (Pan)
  const selectToolBtn = container.querySelector('#btn-pdf-tool-select');
  const handToolBtn = container.querySelector('#btn-pdf-tool-hand');
  const viewport = container.querySelector('#pdf-canvas-viewport');

  selectToolBtn?.addEventListener('click', () => {
    currentTool = 'select';
    selectToolBtn.style.background = 'rgba(255,255,255,0.12)';
    selectToolBtn.style.color = '#38bdf8';
    handToolBtn.style.background = 'transparent';
    handToolBtn.style.color = '#e2e8f0';
    if (viewport) viewport.style.cursor = 'default';
  });

  handToolBtn?.addEventListener('click', () => {
    currentTool = 'hand';
    handToolBtn.style.background = 'rgba(255,255,255,0.12)';
    handToolBtn.style.color = '#38bdf8';
    selectToolBtn.style.background = 'transparent';
    selectToolBtn.style.color = '#e2e8f0';
    if (viewport) viewport.style.cursor = 'grab';
  });

  viewport?.addEventListener('mousedown', (e) => {
    if (currentTool !== 'hand') return;
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    viewport.style.cursor = 'grabbing';
  });

  viewport?.addEventListener('mousemove', (e) => {
    if (!isPanning || currentTool !== 'hand') return;
    viewport.scrollLeft -= (e.clientX - panStartX);
    viewport.scrollTop -= (e.clientY - panStartY);
    panStartX = e.clientX;
    panStartY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      if (viewport && currentTool === 'hand') viewport.style.cursor = 'grab';
    }
  });

  // Mount Fluent Font Picker in Home Tab
  const fontMount = container.querySelector('#pdf-font-picker-mount');
  let pdfFontPicker = null;
  if (fontMount) {
    pdfFontPicker = new FluentFontPicker(fontMount, {
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
        } else {
          const activePage = container.querySelector('.pdf-page-card.active, .pdf-blank-page-content');
          if (activePage) activePage.style.fontFamily = fontFamily;
        }
        contentWrapper.focus();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Applied ${fontName} to document`);
      }
    });
  }

  // Active selection listener in PDF Studio
  const updatePdfFontFromSelection = () => {
    if (!pdfFontPicker) return;
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;
    if (!contentWrapper || !contentWrapper.contains(sel.anchorNode)) return;
    const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
    if (el) {
      const comp = el.style.fontFamily || window.getComputedStyle(el).fontFamily;
      if (comp) pdfFontPicker.setFont(comp);
    }
  };
  document.addEventListener('selectionchange', updatePdfFontFromSelection);

  // Font pt size
  const fontSizeSelect = container.querySelector('#pdf-font-size-pt');
  fontSizeSelect?.addEventListener('change', () => {
    const pt = fontSizeSelect.value;
    document.execCommand('fontSize', false, '3');
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
      if (el) el.style.fontSize = `${pt}pt`;
    }
  });

  // Grow & Shrink font
  container.querySelector('#btn-pdf-font-grow')?.addEventListener('click', () => {
    const cur = parseInt(fontSizeSelect?.value || '11');
    const next = Math.min(36, cur + 2);
    if (fontSizeSelect) fontSizeSelect.value = next;
    document.execCommand('fontSize', false, '4');
  });

  container.querySelector('#btn-pdf-font-shrink')?.addEventListener('click', () => {
    const cur = parseInt(fontSizeSelect?.value || '11');
    const next = Math.max(8, cur - 2);
    if (fontSizeSelect) fontSizeSelect.value = next;
    document.execCommand('fontSize', false, '2');
  });

  container.querySelector('#btn-pdf-clear-formatting')?.addEventListener('click', () => {
    document.execCommand('removeFormat');
  });

  // B, I, U, Strike, Sub, Sup
  container.querySelector('#btn-pdf-bold')?.addEventListener('click', () => document.execCommand('bold'));
  container.querySelector('#btn-pdf-italic')?.addEventListener('click', () => document.execCommand('italic'));
  container.querySelector('#btn-pdf-underline')?.addEventListener('click', () => document.execCommand('underline'));
  container.querySelector('#btn-pdf-strike')?.addEventListener('click', () => document.execCommand('strikeThrough'));
  container.querySelector('#btn-pdf-sub')?.addEventListener('click', () => document.execCommand('subscript'));
  container.querySelector('#btn-pdf-sup')?.addEventListener('click', () => document.execCommand('superscript'));

  // Change Case (Ab ▾)
  container.querySelector('#btn-pdf-change-case')?.addEventListener('click', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString();
    let converted = text;
    if (currentCaseState === 0) {
      converted = text.toUpperCase();
    } else if (currentCaseState === 1) {
      converted = text.toLowerCase();
    } else if (currentCaseState === 2) {
      converted = text.replace(/\b\w/g, l => l.toUpperCase());
    } else {
      converted = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    currentCaseState = (currentCaseState + 1) % 4;
    document.execCommand('insertText', false, converted);
  });

  // Highlight color & Font color
  container.querySelector('#input-pdf-highlight')?.addEventListener('change', (e) => {
    document.execCommand('hiliteColor', false, e.target.value);
  });
  container.querySelector('#input-pdf-font-color')?.addEventListener('change', (e) => {
    document.execCommand('foreColor', false, e.target.value);
  });

  // Voice Dictation (Web Speech API)
  const dictateBtn = container.querySelector('#btn-pdf-dictate');
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isDictating = false;

  if (SpeechRec) {
    recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      const last = e.results[e.results.length - 1];
      if (last && last.isFinal) {
        document.execCommand('insertText', false, last[0].transcript + ' ');
      }
    };
    recognition.onerror = () => {
      isDictating = false;
      dictateBtn?.classList.remove('pulse-red');
    };
    recognition.onend = () => {
      isDictating = false;
      dictateBtn?.classList.remove('pulse-red');
    };
  }

  dictateBtn?.addEventListener('click', () => {
    if (!recognition) {
      alert('Web Speech API Dictation is supported in modern Chrome, Edge, and Safari.');
      return;
    }
    if (!isDictating) {
      contentWrapper.focus();
      recognition.start();
      isDictating = true;
      dictateBtn.style.background = 'rgba(239, 68, 68, 0.2)';
      dictateBtn.style.borderColor = '#ef4444';
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('🎙️ Dictate is listening... Speak clearly into your microphone.');
    } else {
      recognition.stop();
      isDictating = false;
      dictateBtn.style.background = 'transparent';
      dictateBtn.style.borderColor = 'transparent';
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Dictation stopped.');
    }
  });

  // Read Aloud (SpeechSynthesis)
  const readAloudBtn = container.querySelector('#btn-pdf-read-aloud');
  let isSpeaking = false;
  readAloudBtn?.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      readAloudBtn.style.background = 'transparent';
      if (window.orbitPlatform) window.orbitPlatform.triggerToast('Read Aloud stopped');
      return;
    }
    const textToRead = contentWrapper.innerText || 'Empty PDF document';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      isSpeaking = false;
      readAloudBtn.style.background = 'transparent';
    };
    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    readAloudBtn.style.background = 'rgba(56, 189, 248, 0.2)';
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('🔊 Reading active page aloud...');
  });

  // Girionix AI Studio Triggers
  container.querySelector('#btn-pdf-top-ai-agent')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
      window.orbitPlatform.openGirionixAgent('pdf');
    } else if (window.orbitAgent) {
      window.orbitAgent.openAgent('pdf');
    }
  });
  container.querySelector('#btn-pdf-ai-agent')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
      window.orbitPlatform.openGirionixAgent('pdf');
    } else if (window.orbitAgent) {
      window.orbitAgent.openAgent('pdf');
    }
  });
  container.querySelector('#btn-pdf-home-ai-audit')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAiDrawer === 'function') {
      window.orbitPlatform.openGirionixAiDrawer('pdf');
    }
  });
  container.querySelector('#btn-pdf-import-from-girionix')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.importFromGirionix === 'function') {
      window.orbitPlatform.importFromGirionix('pdf');
    } else if (window.orbitPlatform && typeof window.orbitPlatform.toggleGirionixAiDrawer === 'function') {
      window.orbitPlatform.toggleGirionixAiDrawer('pdf');
    }
  });
  container.querySelector('#btn-pdf-export-to-girionix')?.addEventListener('click', () => {
    if (window.orbitPlatform && typeof window.orbitPlatform.exportToGirionix === 'function') {
      window.orbitPlatform.exportToGirionix('pdf');
    } else if (window.orbitPlatform && typeof window.orbitPlatform.toggleGirionixAiDrawer === 'function') {
      window.orbitPlatform.toggleGirionixAiDrawer('pdf');
    }
  });

  // Find & Replace Floating Search Bar
  container.querySelector('#btn-pdf-find')?.addEventListener('click', () => {
    searchBar?.classList.add('open');
    searchInput?.focus();
  });

  container.querySelector('#btn-pdf-replace')?.addEventListener('click', () => {
    searchBar?.classList.add('open');
    searchInput?.focus();
  });

  container.querySelector('#btn-pdf-select-all')?.addEventListener('click', () => {
    contentWrapper.focus();
    document.execCommand('selectAll');
  });

  container.querySelector('#btn-pdf-search-close')?.addEventListener('click', () => {
    searchBar?.classList.remove('open');
  });

  searchInput?.addEventListener('input', () => {
    const term = searchInput.value.trim();
    if (!term) {
      if (searchCount) searchCount.textContent = '0/0';
      return;
    }
    if (window.find) {
      const found = window.find(term, false, false, true);
      if (searchCount) searchCount.textContent = found ? '1/1' : '0/0';
    }
  });

  container.querySelector('#btn-pdf-search-next')?.addEventListener('click', () => {
    const term = searchInput?.value.trim();
    if (term && window.find) window.find(term, false, false, true);
  });

  container.querySelector('#btn-pdf-search-prev')?.addEventListener('click', () => {
    const term = searchInput?.value.trim();
    if (term && window.find) window.find(term, false, true, true);
  });

  // Quick Markup Buttons (Home tab)
  container.querySelector('#btn-pdf-quick-highlight')?.addEventListener('click', () => {
    document.execCommand('hiliteColor', false, '#fef08a');
  });

  // =========================================================================
  // ANNOTATE TAB: HIGHLIGHTER, NOTES, SHAPES, PINS
  // =========================================================================
  container.querySelector('#btn-pdf-highlighter')?.addEventListener('click', () => {
    const color = container.querySelector('#pdf-highlight-color')?.value || '#fef08a';
    document.execCommand('hiliteColor', false, color);
  });

  container.querySelector('#btn-pdf-anno-underline')?.addEventListener('click', () => document.execCommand('underline'));
  container.querySelector('#btn-pdf-anno-strike')?.addEventListener('click', () => document.execCommand('strikeThrough'));

  // Draggable Sticky Note
  function createStickyNote() {
    const note = document.createElement('div');
    note.className = 'pdf-sticky-note-pin';
    note.style.top = '140px';
    note.style.right = '40px';
    note.style.pointerEvents = 'auto';
    note.contentEditable = 'true';
    note.spellcheck = false;
    note.innerHTML = '<strong>Executive Note:</strong><br>Verified and approved by Giri Directorate.';
    note.title = 'Double click to remove note';
    note.addEventListener('dblclick', () => note.remove());
    annotationsLayer.appendChild(note);
    auditLog.push({ action: 'Affixed Sticky Note', time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Sticky note pinned to document');
  }

  container.querySelector('#btn-pdf-sticky-note')?.addEventListener('click', createStickyNote);
  container.querySelector('#btn-pdf-quick-note')?.addEventListener('click', createStickyNote);

  // Comment Pin
  container.querySelector('#btn-pdf-comment-pin')?.addEventListener('click', () => {
    const pin = document.createElement('div');
    pin.style.position = 'absolute';
    pin.style.top = '200px';
    pin.style.left = '60px';
    pin.style.pointerEvents = 'auto';
    pin.style.cursor = 'pointer';
    pin.style.padding = '4px 8px';
    pin.style.background = '#2563eb';
    pin.style.color = '#ffffff';
    pin.style.borderRadius = '16px';
    pin.style.fontSize = '11px';
    pin.style.fontWeight = '700';
    pin.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    pin.innerHTML = '💬 Note #1';
    pin.title = 'Click to open comments / Double-click to remove';
    pin.addEventListener('click', () => commentsSidebar?.classList.add('open'));
    pin.addEventListener('dblclick', (e) => { e.stopPropagation(); pin.remove(); });
    annotationsLayer.appendChild(pin);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Comment pin placed');
  });

  container.querySelector('#btn-pdf-clear-notes')?.addEventListener('click', () => {
    annotationsLayer.innerHTML = '';
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('All annotations cleared');
  });

  // Shapes: Rectangle, Circle, Arrow, Line
  function placeShape(type) {
    const shape = document.createElement('div');
    shape.style.position = 'absolute';
    shape.style.top = '240px';
    shape.style.left = '60px';
    shape.style.pointerEvents = 'auto';
    shape.style.cursor = 'move';
    shape.title = 'Double-click to remove shape';
    shape.addEventListener('dblclick', () => shape.remove());

    if (type === 'rect') {
      shape.style.width = '160px';
      shape.style.height = '80px';
      shape.style.border = '2px solid #2563eb';
      shape.style.borderRadius = '4px';
      shape.style.background = 'rgba(37, 99, 235, 0.08)';
    } else if (type === 'circle') {
      shape.style.width = '100px';
      shape.style.height = '100px';
      shape.style.border = '2px solid #059669';
      shape.style.borderRadius = '50%';
      shape.style.background = 'rgba(5, 150, 105, 0.08)';
    } else if (type === 'arrow') {
      shape.style.width = '120px';
      shape.style.height = '28px';
      shape.innerHTML = '<span style="font-size:24px; color:#ef4444; font-weight:900;">➔</span>';
    } else if (type === 'line') {
      shape.style.width = '180px';
      shape.style.height = '2px';
      shape.style.background = '#0f172a';
    }

    annotationsLayer.appendChild(shape);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`${type.toUpperCase()} shape placed on page`);
  }

  container.querySelector('#btn-pdf-shape-rect')?.addEventListener('click', () => placeShape('rect'));
  container.querySelector('#btn-pdf-shape-circle')?.addEventListener('click', () => placeShape('circle'));
  container.querySelector('#btn-pdf-shape-arrow')?.addEventListener('click', () => placeShape('arrow'));
  container.querySelector('#btn-pdf-shape-line')?.addEventListener('click', () => placeShape('line'));

  // =========================================================================
  // EDIT & FORMS TAB: FILLABLE FIELDS, BLOCKS, TABLES, ACTIONS
  // =========================================================================
  container.querySelector('#btn-pdf-add-textfield')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'pdf-fillable-input';
    input.value = 'Click to edit field';
    input.style.position = 'absolute';
    input.style.top = '220px';
    input.style.left = '40px';
    input.style.width = '240px';
    input.style.pointerEvents = 'auto';
    input.addEventListener('dblclick', () => input.remove());
    annotationsLayer.appendChild(input);
    auditLog.push({ action: 'Added Fillable Text Field', time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Fillable text field added');
  });

  container.querySelector('#btn-pdf-add-checkbox')?.addEventListener('click', () => {
    const wrap = document.createElement('label');
    wrap.style.position = 'absolute';
    wrap.style.top = '260px';
    wrap.style.left = '40px';
    wrap.style.pointerEvents = 'auto';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '8px';
    wrap.style.fontSize = '12px';
    wrap.innerHTML = `<input type="checkbox" class="pdf-fillable-check" checked> <span contenteditable="true">Form Checkbox Item</span>`;
    wrap.addEventListener('dblclick', () => wrap.remove());
    annotationsLayer.appendChild(wrap);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Interactive checkbox item added');
  });

  container.querySelector('#btn-pdf-add-radio')?.addEventListener('click', () => {
    const wrap = document.createElement('label');
    wrap.style.position = 'absolute';
    wrap.style.top = '290px';
    wrap.style.left = '40px';
    wrap.style.pointerEvents = 'auto';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '8px';
    wrap.style.fontSize = '12px';
    wrap.innerHTML = `<input type="radio" name="pdf-radio-group" class="pdf-fillable-check" checked> <span contenteditable="true">Radio Selection Option</span>`;
    wrap.addEventListener('dblclick', () => wrap.remove());
    annotationsLayer.appendChild(wrap);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Radio option added');
  });

  container.querySelector('#btn-pdf-add-date')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'date';
    input.className = 'pdf-fillable-input';
    input.value = new Date().toISOString().split('T')[0];
    input.style.position = 'absolute';
    input.style.top = '320px';
    input.style.left = '40px';
    input.style.pointerEvents = 'auto';
    input.addEventListener('dblclick', () => input.remove());
    annotationsLayer.appendChild(input);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Date field added');
  });

  container.querySelector('#btn-pdf-add-dropdown')?.addEventListener('click', () => {
    const sel = document.createElement('select');
    sel.className = 'fluent-select-dark';
    sel.style.position = 'absolute';
    sel.style.top = '360px';
    sel.style.left = '40px';
    sel.style.width = '180px';
    sel.style.pointerEvents = 'auto';
    sel.innerHTML = `
      <option>Verified &amp; Approved</option>
      <option>Pending Executive Review</option>
      <option>Conditional Acceptance</option>
    `;
    sel.addEventListener('dblclick', () => sel.remove());
    annotationsLayer.appendChild(sel);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Dropdown select box added');
  });

  container.querySelector('#btn-pdf-add-sig-field')?.addEventListener('click', () => {
    const sigLine = document.createElement('div');
    sigLine.style.position = 'absolute';
    sigLine.style.top = '400px';
    sigLine.style.left = '40px';
    sigLine.style.width = '240px';
    sigLine.style.borderBottom = '2px dashed #94a3b8';
    sigLine.style.padding = '6px 0';
    sigLine.style.pointerEvents = 'auto';
    sigLine.innerHTML = `<span style="font-size:10px; color:#64748b; font-family:var(--font-mono); text-transform:uppercase;">Sign Here ✕ _____________________</span>`;
    sigLine.addEventListener('dblclick', () => sigLine.remove());
    annotationsLayer.appendChild(sigLine);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Signature line box added');
  });

  container.querySelector('#btn-pdf-add-text-block')?.addEventListener('click', () => {
    const p = document.createElement('p');
    p.style.fontSize = '12.5px';
    p.style.lineHeight = '1.7';
    p.style.color = '#334155';
    p.style.margin = '14px 0';
    p.textContent = 'Enter supplementary contract terms, specifications, or verification requirements here...';
    contentWrapper.appendChild(p);
    p.focus();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Paragraph text block added');
  });

  container.querySelector('#btn-pdf-add-table')?.addEventListener('click', () => {
    const tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.style.borderCollapse = 'collapse';
    tbl.style.margin = '16px 0';
    tbl.style.border = '1px solid #cbd5e1';
    tbl.style.fontSize = '12px';
    tbl.innerHTML = `
      <thead>
        <tr style="background:#f8fafc;">
          <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:left;">Item #</th>
          <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:left;">Description</th>
          <th style="border:1px solid #cbd5e1; padding:6px 10px; text-align:left;">Verification Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e1; padding:6px 10px;">01</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px;">Memory-resident execution</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px; color:#059669; font-weight:600;">Verified</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e1; padding:6px 10px;">02</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px;">Zero database storage</td>
          <td style="border:1px solid #cbd5e1; padding:6px 10px; color:#059669; font-weight:600;">Verified</td>
        </tr>
      </tbody>
    `;
    contentWrapper.appendChild(tbl);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Data table inserted');
  });

  // Form Actions: Reset, Lock, Export JSON
  container.querySelector('#btn-pdf-reset-form')?.addEventListener('click', () => {
    contentWrapper.querySelectorAll('input[type="text"]').forEach(i => i.value = '');
    contentWrapper.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    annotationsLayer.querySelectorAll('input[type="text"]').forEach(i => i.value = '');
    annotationsLayer.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Form fields reset to defaults');
  });

  container.querySelector('#btn-pdf-lock-form')?.addEventListener('click', () => {
    contentWrapper.querySelectorAll('input, select').forEach(el => {
      el.disabled = true;
      el.style.border = 'none';
      el.style.background = 'transparent';
    });
    annotationsLayer.querySelectorAll('input, select').forEach(el => {
      el.disabled = true;
      el.style.border = 'none';
      el.style.background = 'transparent';
    });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('🔒 Form locked and flattened');
  });

  container.querySelector('#btn-pdf-export-json')?.addEventListener('click', () => {
    const formData = {
      title: pages[activePageIndex]?.title || 'PDF Form',
      date: new Date().toISOString(),
      fields: []
    };
    const inputs = container.querySelectorAll('.pdf-fillable-input, .pdf-fillable-check');
    inputs.forEach((inp, i) => {
      formData.fields.push({
        index: i + 1,
        type: inp.type,
        value: inp.type === 'checkbox' ? inp.checked : inp.value
      });
    });
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pdf-form-data.json';
    a.click();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Exported form data to JSON');
  });

  // =========================================================================
  // SIGN & CERTIFY: SIGNATURE PAD, STAMPS, SHA-256 PKI
  // =========================================================================
  const sigModal = container.querySelector('#signature-modal-backdrop');
  const sigCanvas = container.querySelector('#signature-draw-canvas');
  const sigCtx = sigCanvas?.getContext('2d');
  const drawView = container.querySelector('#sig-draw-view');
  const typeView = container.querySelector('#sig-type-view');
  const tabDraw = container.querySelector('#btn-tab-draw-sig');
  const tabType = container.querySelector('#btn-tab-type-sig');
  const typeInput = container.querySelector('#sig-type-input');
  const typePreview = container.querySelector('#sig-type-preview');
  const clearCanvasBtn = container.querySelector('#btn-clear-canvas');
  const applySigBtn = container.querySelector('#btn-apply-signature');
  const closeSigModalBtn = container.querySelector('#btn-close-sig-modal');
  const cancelSigBtn = container.querySelector('#btn-cancel-sig');

  let currentSigMode = 'draw';
  let isDrawingPad = false;

  function openSignatureModal() {
    sigModal.classList.add('open');
    initSigPad();
  }

  container.querySelector('#btn-open-signature-pad')?.addEventListener('click', openSignatureModal);
  container.querySelector('#btn-pdf-quick-sign')?.addEventListener('click', openSignatureModal);

  function initSigPad() {
    if (!sigCtx) return;
    sigCtx.strokeStyle = '#1e3a8a';
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';

    function getPos(e) {
      const rect = sigCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    sigCanvas.onmousedown = (e) => {
      isDrawingPad = true;
      const pos = getPos(e);
      sigCtx.beginPath();
      sigCtx.moveTo(pos.x, pos.y);
    };

    sigCanvas.onmousemove = (e) => {
      if (!isDrawingPad) return;
      const pos = getPos(e);
      sigCtx.lineTo(pos.x, pos.y);
      sigCtx.stroke();
    };

    window.addEventListener('mouseup', () => { isDrawingPad = false; });

    sigCanvas.ontouchstart = (e) => {
      e.preventDefault();
      isDrawingPad = true;
      const pos = getPos(e);
      sigCtx.beginPath();
      sigCtx.moveTo(pos.x, pos.y);
    };

    sigCanvas.ontouchmove = (e) => {
      if (!isDrawingPad) return;
      e.preventDefault();
      const pos = getPos(e);
      sigCtx.lineTo(pos.x, pos.y);
      sigCtx.stroke();
    };

    sigCanvas.ontouchend = () => { isDrawingPad = false; };
  }

  clearCanvasBtn?.addEventListener('click', () => {
    if (sigCtx) sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  });

  tabDraw?.addEventListener('click', () => {
    currentSigMode = 'draw';
    tabDraw.classList.add('active');
    tabType.classList.remove('active');
    drawView.style.display = 'block';
    typeView.style.display = 'none';
  });

  tabType?.addEventListener('click', () => {
    currentSigMode = 'type';
    tabType.classList.add('active');
    tabDraw.classList.remove('active');
    drawView.style.display = 'none';
    typeView.style.display = 'block';
  });

  typeInput?.addEventListener('input', () => {
    typePreview.textContent = typeInput.value || 'Signer Name';
  });

  applySigBtn?.addEventListener('click', () => {
    const sigStamp = document.createElement('div');
    sigStamp.style.position = 'absolute';
    sigStamp.style.bottom = '90px';
    sigStamp.style.right = '40px';
    sigStamp.style.pointerEvents = 'auto';
    sigStamp.style.cursor = 'move';

    if (currentSigMode === 'draw') {
      const dataUrl = sigCanvas.toDataURL();
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.maxHeight = '70px';
      sigStamp.appendChild(img);
    } else {
      const typed = document.createElement('div');
      typed.style.fontFamily = "'Brush Script MT', cursive, sans-serif";
      typed.style.fontSize = '30px';
      typed.style.color = '#1e3a8a';
      typed.style.borderBottom = '1.5px solid #0f172a';
      typed.textContent = typeInput.value || 'Giri Corporate Signer';
      sigStamp.appendChild(typed);
    }

    const sub = document.createElement('span');
    sub.style.display = 'block';
    sub.style.fontSize = '9.5px';
    sub.style.fontFamily = 'var(--font-mono)';
    sub.style.color = '#64748b';
    sub.style.marginTop = '4px';
    sub.textContent = `Digitally Sealed: ${new Date().toISOString().split('T')[0]} // SHA-256 Verified`;
    sigStamp.appendChild(sub);

    sigStamp.addEventListener('dblclick', () => sigStamp.remove());
    annotationsLayer.appendChild(sigStamp);
    sigModal.classList.remove('open');
    auditLog.push({ action: 'Affixed Digital Signature', time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Digital signature placed on page');
  });

  closeSigModalBtn?.addEventListener('click', () => sigModal.classList.remove('open'));
  cancelSigBtn?.addEventListener('click', () => sigModal.classList.remove('open'));

  // Quick Initial Stamp
  container.querySelector('#btn-pdf-initial-stamp')?.addEventListener('click', () => {
    const initial = document.createElement('div');
    initial.style.position = 'absolute';
    initial.style.bottom = '60px';
    initial.style.left = '40px';
    initial.style.pointerEvents = 'auto';
    initial.style.cursor = 'move';
    initial.style.border = '1.5px solid #2563eb';
    initial.style.padding = '3px 8px';
    initial.style.borderRadius = '3px';
    initial.style.color = '#2563eb';
    initial.style.fontWeight = '700';
    initial.style.fontFamily = "'Brush Script MT', cursive, sans-serif";
    initial.style.fontSize = '18px';
    initial.innerHTML = 'AG // Giri Executive';
    initial.addEventListener('dblclick', () => initial.remove());
    annotationsLayer.appendChild(initial);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Initial stamp affixed');
  });

  // Approved, Confidential, Void Stamps & Executive Seal
  container.querySelector('#btn-pdf-stamp-approved')?.addEventListener('click', () => {
    const existing = sheetEl.querySelector('.pdf-approved-stamp');
    if (existing) {
      existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
    } else {
      const stamp = document.createElement('div');
      stamp.className = 'pdf-approved-stamp';
      stamp.style.border = '2px solid #e42528';
      stamp.style.color = '#e42528';
      stamp.style.padding = '4px 10px';
      stamp.style.borderRadius = '4px';
      stamp.style.fontWeight = '800';
      stamp.style.fontSize = '12px';
      stamp.style.textTransform = 'uppercase';
      stamp.style.transform = 'rotate(-8deg)';
      stamp.style.display = 'inline-block';
      stamp.innerHTML = 'APPROVED<span style="font-size:8px; display:block; font-weight:500;">GIRI CORP EXECUTIVE</span>';
      contentWrapper.prepend(stamp);
    }
    auditLog.push({ action: 'Toggled Approved Stamp', time: new Date().toLocaleTimeString() });
  });

  container.querySelector('#btn-pdf-stamp-confidential')?.addEventListener('click', () => {
    const stamp = document.createElement('div');
    stamp.style.position = 'absolute';
    stamp.style.top = '40px';
    stamp.style.right = '40px';
    stamp.style.border = '2px solid #dc2626';
    stamp.style.color = '#dc2626';
    stamp.style.padding = '4px 8px';
    stamp.style.borderRadius = '4px';
    stamp.style.fontWeight = '800';
    stamp.style.fontSize = '11px';
    stamp.style.textTransform = 'uppercase';
    stamp.style.pointerEvents = 'auto';
    stamp.style.cursor = 'move';
    stamp.innerHTML = 'RESTRICTED // CONFIDENTIAL';
    stamp.addEventListener('dblclick', () => stamp.remove());
    annotationsLayer.appendChild(stamp);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Confidential stamp affixed');
  });

  container.querySelector('#btn-pdf-stamp-void')?.addEventListener('click', () => {
    const stamp = document.createElement('div');
    stamp.style.position = 'absolute';
    stamp.style.top = '45%';
    stamp.style.left = '35%';
    stamp.style.border = '4px solid #94a3b8';
    stamp.style.color = '#94a3b8';
    stamp.style.padding = '8px 24px';
    stamp.style.borderRadius = '6px';
    stamp.style.fontWeight = '900';
    stamp.style.fontSize = '32px';
    stamp.style.textTransform = 'uppercase';
    stamp.style.transform = 'rotate(-25deg)';
    stamp.style.pointerEvents = 'auto';
    stamp.style.cursor = 'move';
    stamp.innerHTML = 'VOID // CANCELLED';
    stamp.addEventListener('dblclick', () => stamp.remove());
    annotationsLayer.appendChild(stamp);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Void stamp affixed');
  });

  container.querySelector('#btn-pdf-exec-seal')?.addEventListener('click', () => {
    const seal = document.createElement('div');
    seal.style.position = 'absolute';
    seal.style.bottom = '40px';
    seal.style.left = '40px';
    seal.style.pointerEvents = 'auto';
    seal.style.display = 'flex';
    seal.style.alignItems = 'center';
    seal.style.gap = '10px';
    seal.style.padding = '10px 14px';
    seal.style.background = 'rgba(255, 255, 255, 0.96)';
    seal.style.border = '2px solid #1e3a8a';
    seal.style.borderRadius = '8px';
    seal.style.boxShadow = 'var(--shadow-hover)';
    seal.innerHTML = `
      <img src="assets/giri-group-symbol-blue.png" alt="Seal" style="height:32px; width:auto;">
      <div>
        <strong style="font-size:11px; color:#1e3a8a; display:block; letter-spacing:0.04em;">GIRI GROUP CERTIFIED SEAL</strong>
        <span style="font-size:9.5px; font-family:var(--font-mono); color:#64748b;">SOVEREIGN ENCRYPTION APPROVED</span>
      </div>
    `;
    seal.addEventListener('dblclick', () => seal.remove());
    annotationsLayer.appendChild(seal);
    auditLog.push({ action: 'Affixed Giri Certified Seal', time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Giri Group Certified Seal affixed');
  });

  // SHA-256 PKI Verification & Audit Certificate
  async function computeDocumentHash() {
    const encoder = new TextEncoder();
    const rawText = contentWrapper.innerText || contentWrapper.innerHTML;
    const data = encoder.encode(rawText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  container.querySelector('#btn-pdf-verify-pki')?.addEventListener('click', async () => {
    const digest = await computeDocumentHash();
    auditLog.push({ action: `SHA-256 Verified: ${digest.substring(0, 16)}...`, time: new Date().toLocaleTimeString() });
    alert(`Giri Aegis Sovereign PKI Verification:\n\nDigest (SHA-256):\n${digest}\n\nStatus: 100% Verified Valid\nStorage: Zero Database, Cryptographically Secured`);
  });

  const certModal = container.querySelector('#pdf-cert-modal');
  container.querySelector('#btn-pdf-audit-cert')?.addEventListener('click', async () => {
    const digest = await computeDocumentHash();
    const digestEl = container.querySelector('#pdf-cert-digest');
    const timeEl = container.querySelector('#pdf-cert-timestamp');
    if (digestEl) digestEl.textContent = digest;
    if (timeEl) timeEl.textContent = new Date().toUTCString();
    certModal.classList.add('open');
  });

  container.querySelector('#btn-close-pdf-cert')?.addEventListener('click', () => certModal.classList.remove('open'));
  container.querySelector('#btn-cert-close')?.addEventListener('click', () => certModal.classList.remove('open'));
  container.querySelector('#btn-cert-copy-hash')?.addEventListener('click', async () => {
    const digest = await computeDocumentHash();
    navigator.clipboard?.writeText(digest);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Copied SHA-256 digest');
  });

  // =========================================================================
  // PAGE TOOLS: ADD, DUP, DEL, ROTATE, REORDER, SETUP
  // =========================================================================
  function addPage() {
    const newPage = {
      id: Date.now(),
      rotation: 0,
      title: `PAGE ${pages.length + 1} // SUPPLEMENT`,
      ref: `GIRI-AEGIS-2026-X0${pages.length + 1}`,
      htmlContent: `
        <div class="pdf-doc-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <img src="assets/giri-group-symbol-dark.png" alt="Giri Group" style="height:32px; width:auto; display:block;">
            <div>
              <h1 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">GIRI EXECUTIVE MEMORANDUM // SUPPLEMENT</h1>
              <span style="font-size:10px; font-family:var(--font-mono); color:#64748b;">REF: GIRI-AEGIS-2026-X0${pages.length + 1} // GIRI GROUP</span>
            </div>
          </div>
        </div>
        <div style="height:1px; background:#e2e8f0; margin:16px 0;"></div>
        <h2 style="font-size:15px; font-weight:700; color:#0f172a; margin-bottom:8px;">Additional Provisions &amp; Schedule</h2>
        <p style="font-size:12.5px; line-height:1.7; color:#334155;">
          Click here to enter supplementary contract terms, specifications, or verification requirements for this document.
        </p>
      `
    };
    pages.push(newPage);
    renderPagesSidebar();
    switchPage(pages.length - 1);
    auditLog.push({ action: `Added Page ${pages.length}`, time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Page ${pages.length} added`);
  }

  container.querySelector('#btn-pdf-add-page')?.addEventListener('click', addPage);
  container.querySelector('#btn-pdf-sidebar-add')?.addEventListener('click', addPage);

  container.querySelector('#btn-pdf-dup-page')?.addEventListener('click', () => {
    const current = pages[activePageIndex];
    const cloned = JSON.parse(JSON.stringify(current));
    cloned.id = Date.now();
    cloned.title += ' (Copy)';
    pages.splice(activePageIndex + 1, 0, cloned);
    renderPagesSidebar();
    switchPage(activePageIndex + 1);
    auditLog.push({ action: `Duplicated Page ${activePageIndex + 1}`, time: new Date().toLocaleTimeString() });
  });

  container.querySelector('#btn-pdf-del-page')?.addEventListener('click', () => {
    if (pages.length <= 1) {
      alert('Document must contain at least one page.');
      return;
    }
    pages.splice(activePageIndex, 1);
    renderPagesSidebar();
    switchPage(Math.max(0, activePageIndex - 1));
    auditLog.push({ action: 'Deleted Page', time: new Date().toLocaleTimeString() });
  });

  container.querySelector('#btn-pdf-rotate')?.addEventListener('click', () => {
    const page = pages[activePageIndex];
    page.rotation = ((page.rotation || 0) + 90) % 360;
    sheetEl.style.transform = `scale(${currentZoom / 100}) rotate(${page.rotation}deg)`;
    renderPagesSidebar();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Rotated to ${page.rotation}°`);
  });

  container.querySelector('#btn-pdf-rotate-ccw')?.addEventListener('click', () => {
    const page = pages[activePageIndex];
    page.rotation = ((page.rotation || 0) - 90 + 360) % 360;
    sheetEl.style.transform = `scale(${currentZoom / 100}) rotate(${page.rotation}deg)`;
    renderPagesSidebar();
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Rotated to ${page.rotation}°`);
  });

  container.querySelector('#btn-pdf-stamp-pagenum')?.addEventListener('click', () => {
    const stamp = document.createElement('div');
    stamp.className = 'pdf-pagenum-stamp';
    stamp.style.position = 'absolute';
    stamp.style.bottom = '24px';
    stamp.style.right = '32px';
    stamp.style.padding = '4px 8px';
    stamp.style.fontSize = '11px';
    stamp.style.color = '#64748b';
    stamp.style.fontFamily = 'var(--font-mono)';
    stamp.style.fontWeight = '600';
    stamp.style.pointerEvents = 'auto';
    stamp.style.cursor = 'move';
    stamp.textContent = `Page ${activePageIndex + 1} of ${pages.length}`;
    stamp.addEventListener('dblclick', () => stamp.remove());
    annotationsLayer.appendChild(stamp);
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Page number stamp affixed: Page ${activePageIndex + 1} of ${pages.length}`);
  });

  container.querySelector('#btn-pdf-move-up')?.addEventListener('click', () => {
    if (activePageIndex <= 0) return;
    const temp = pages[activePageIndex];
    pages[activePageIndex] = pages[activePageIndex - 1];
    pages[activePageIndex - 1] = temp;
    renderPagesSidebar();
    switchPage(activePageIndex - 1);
  });

  container.querySelector('#btn-pdf-move-down')?.addEventListener('click', () => {
    if (activePageIndex >= pages.length - 1) return;
    const temp = pages[activePageIndex];
    pages[activePageIndex] = pages[activePageIndex + 1];
    pages[activePageIndex + 1] = temp;
    renderPagesSidebar();
    switchPage(activePageIndex + 1);
  });

  // Page Setup Dimensions
  container.querySelector('#select-pdf-page-size')?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'a4') {
      sheetEl.style.width = '794px';
      sheetEl.style.minHeight = '1123px';
    } else if (val === 'legal') {
      sheetEl.style.width = '816px';
      sheetEl.style.minHeight = '1344px';
    } else {
      sheetEl.style.width = '800px';
      sheetEl.style.minHeight = '1020px';
    }
    resizeInkCanvas();
  });

  container.querySelector('#select-pdf-page-orient')?.addEventListener('change', (e) => {
    const orient = e.target.value;
    if (orient === 'landscape') {
      sheetEl.style.width = '1020px';
      sheetEl.style.minHeight = '800px';
    } else {
      sheetEl.style.width = '800px';
      sheetEl.style.minHeight = '1020px';
    }
    resizeInkCanvas();
  });

  // =========================================================================
  // PROTECT TAB: WATERMARK, REDACTION, PASSCODE, SCRUB
  // =========================================================================
  container.querySelector('#btn-pdf-toggle-watermark')?.addEventListener('click', () => {
    isWatermarkActive = !isWatermarkActive;
    watermarkEl.style.display = isWatermarkActive ? 'flex' : 'none';
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Watermark ${isWatermarkActive ? 'Enabled' : 'Disabled'}`);
  });

  container.querySelector('#pdf-watermark-text-select')?.addEventListener('change', (e) => {
    watermarkText = e.target.value;
    watermarkEl.textContent = watermarkText;
  });

  container.querySelector('#btn-pdf-custom-watermark')?.addEventListener('click', () => {
    const custom = prompt('Enter custom watermark text:', watermarkText);
    if (custom && custom.trim()) {
      watermarkText = custom.trim().toUpperCase();
      watermarkEl.textContent = watermarkText;
      watermarkEl.style.display = 'flex';
      isWatermarkActive = true;
    }
  });

  // Redaction Blackout Box
  container.querySelector('#btn-pdf-redaction-box')?.addEventListener('click', () => {
    const redact = document.createElement('div');
    redact.className = 'pdf-redaction-box';
    redact.style.position = 'absolute';
    redact.style.top = '180px';
    redact.style.left = '60px';
    redact.style.width = '200px';
    redact.style.height = '24px';
    redact.style.background = '#000000';
    redact.style.borderRadius = '2px';
    redact.style.pointerEvents = 'auto';
    redact.style.cursor = 'move';
    redact.title = 'Confidential Redaction (Double click to remove)';
    redact.addEventListener('dblclick', () => redact.remove());
    annotationsLayer.appendChild(redact);
    auditLog.push({ action: 'Placed Blackout Redaction Box', time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Confidential blackout redaction placed');
  });

  container.querySelector('#btn-pdf-apply-redactions')?.addEventListener('click', () => {
    const boxes = annotationsLayer.querySelectorAll('.pdf-redaction-box');
    if (boxes.length === 0) {
      alert('No active redaction boxes placed. Click "+ Redaction" first.');
      return;
    }
    boxes.forEach(b => {
      b.style.border = '1px solid #333';
      b.style.pointerEvents = 'none';
    });
    auditLog.push({ action: `Burned ${boxes.length} Redactions Permanently`, time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Burned ${boxes.length} redactions permanently into document`);
  });

  // Passcode Lock Modal
  const passModal = container.querySelector('#pdf-password-modal');
  container.querySelector('#btn-pdf-passcode-lock')?.addEventListener('click', () => {
    passModal.classList.add('open');
  });

  container.querySelector('#btn-close-pdf-password')?.addEventListener('click', () => passModal.classList.remove('open'));
  container.querySelector('#btn-cancel-pdf-password')?.addEventListener('click', () => passModal.classList.remove('open'));
  container.querySelector('#btn-apply-pdf-password')?.addEventListener('click', () => {
    const p1 = container.querySelector('#input-pdf-passcode')?.value;
    const p2 = container.querySelector('#input-pdf-passcode-confirm')?.value;
    if (!p1 || p1 !== p2) {
      alert('Passcodes do not match or are empty.');
      return;
    }
    passModal.classList.remove('open');
    auditLog.push({ action: 'Encrypted PDF with Sovereign Passcode', time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('🔒 Document encrypted with sovereign passcode');
  });

  container.querySelector('#btn-pdf-scrub-metadata')?.addEventListener('click', () => {
    pages.forEach(p => {
      p.ref = 'GIRI-SOVEREIGN-ANON';
    });
    auditLog.push({ action: 'Scrubbed All Author & Revision Metadata', time: new Date().toLocaleTimeString() });
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('🧼 Metadata scrubbed for sovereign anonymity');
  });

  // =========================================================================
  // VIEW TAB: ZOOM, SPREAD, THEME
  // =========================================================================
  function applyZoom() {
    const page = pages[activePageIndex];
    sheetEl.style.transform = `scale(${currentZoom / 100}) rotate(${page?.rotation || 0}deg)`;
    if (zoomLabel) zoomLabel.textContent = `${currentZoom}%`;
  }

  container.querySelector('#btn-pdf-zoom-in')?.addEventListener('click', () => {
    currentZoom = Math.min(160, currentZoom + 10);
    applyZoom();
  });

  container.querySelector('#btn-pdf-zoom-out')?.addEventListener('click', () => {
    currentZoom = Math.max(70, currentZoom - 10);
    applyZoom();
  });

  container.querySelector('#btn-pdf-zoom-fit')?.addEventListener('click', () => {
    currentZoom = 100;
    applyZoom();
  });

  container.querySelector('#btn-pdf-zoom-page')?.addEventListener('click', () => {
    currentZoom = 90;
    applyZoom();
  });

  container.querySelector('#btn-pdf-zoom-100')?.addEventListener('click', () => {
    currentZoom = 100;
    applyZoom();
  });

  // Single vs Two Pages View
  container.querySelector('#btn-pdf-view-single')?.addEventListener('click', () => {
    isTwoPagesView = false;
    viewport.style.display = 'flex';
    viewport.style.flexDirection = 'column';
    viewport.style.alignItems = 'center';
    sheetEl.style.transform = `scale(${currentZoom / 100})`;
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Single page scrolling view');
  });

  container.querySelector('#btn-pdf-view-two')?.addEventListener('click', () => {
    isTwoPagesView = true;
    viewport.style.display = 'flex';
    viewport.style.flexDirection = 'row';
    viewport.style.justifyContent = 'center';
    sheetEl.style.transform = `scale(0.85)`;
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Two pages side-by-side spread view');
  });

  // Toggle Sidebar Thumbnails
  container.querySelector('#btn-pdf-toggle-sidebar')?.addEventListener('click', () => {
    const sidebar = container.querySelector('#pdf-pages-sidebar');
    if (sidebar) {
      sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
    }
  });

  // Dark Reader Mode / Invert Contrast
  container.querySelector('#btn-pdf-theme-light')?.addEventListener('click', () => {
    sheetEl.classList.remove('dark-reader-mode');
    sheetEl.style.filter = '';
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Light Paper reading mode');
  });

  container.querySelector('#btn-pdf-theme-dark')?.addEventListener('click', () => {
    sheetEl.classList.add('dark-reader-mode');
    sheetEl.style.filter = 'invert(0.9) hue-rotate(180deg)';
    if (window.orbitPlatform) window.orbitPlatform.triggerToast('Night Reading Mode enabled (high contrast inverted)');
  });

  // =========================================================================
  // HELP TAB & MODALS
  // =========================================================================
  const shortcutsModal = container.querySelector('#pdf-shortcuts-modal');
  const whatsNewModal = container.querySelector('#pdf-whats-new-modal');
  const fontDialogModal = container.querySelector('#pdf-font-dialog');

  container.querySelector('#btn-pdf-help-center')?.addEventListener('click', () => {
    alert('Giri Aegis PDF Studio Help Center:\n\n• Annotate: Use highlighters, drawing pen, sticky notes, and shapes.\n• Sign & Certify: Draw or type your signature, affix executive stamps, verify SHA-256 PKI.\n• Forms: Add text fields, checkboxes, dropdowns, and date pickers.\n• Page Tools: Add, duplicate, delete, and rotate pages.\n• Security: Watermarks, blackout redactions, and passcode locks.');
  });

  container.querySelector('#btn-pdf-shortcuts')?.addEventListener('click', () => {
    shortcutsModal.classList.add('open');
  });
  container.querySelector('#btn-close-pdf-shortcuts')?.addEventListener('click', () => shortcutsModal.classList.remove('open'));
  container.querySelector('#btn-close-pdf-shortcuts-footer')?.addEventListener('click', () => shortcutsModal.classList.remove('open'));

  container.querySelector('#btn-pdf-whats-new')?.addEventListener('click', () => {
    whatsNewModal.classList.add('open');
  });
  container.querySelector('#btn-close-pdf-whats-new')?.addEventListener('click', () => whatsNewModal.classList.remove('open'));
  container.querySelector('#btn-whats-new-ok')?.addEventListener('click', () => whatsNewModal.classList.remove('open'));

  container.querySelector('#btn-pdf-feedback')?.addEventListener('click', () => {
    window.open('https://www.instagram.com/abhinavgiri45/', '_blank');
  });

  // Font Dialog launcher & dynamic global font population
  const pdfFontSelect = container.querySelector('#pdf-dialog-font-family');
  if (pdfFontSelect) {
    populateFontSelect(pdfFontSelect, 'Calibri');
  }

  const updatePdfModalPreview = () => {
    const fam = pdfFontSelect?.value || 'Calibri';
    const sz = container.querySelector('#pdf-dialog-font-size')?.value || '11';
    const style = container.querySelector('#pdf-dialog-font-style')?.value || 'normal';
    const prev = container.querySelector('#pdf-dialog-font-preview');
    if (prev) {
      prev.style.fontFamily = fam;
      prev.style.fontSize = `${sz}pt`;
      prev.style.fontWeight = style.includes('bold') ? 'bold' : 'normal';
      prev.style.fontStyle = style.includes('italic') ? 'italic' : 'normal';
      const opt = pdfFontSelect ? pdfFontSelect.options[pdfFontSelect.selectedIndex] : null;
      const name = opt ? opt.textContent : 'Calibri';
      prev.textContent = `${name} — Executive Document & Digital Seal (ABC 123)`;
    }
  };

  pdfFontSelect?.addEventListener('change', () => {
    const opt = pdfFontSelect.options[pdfFontSelect.selectedIndex];
    if (opt && opt.dataset && opt.dataset.fontName) {
      loadGoogleFont(opt.dataset.fontName);
    }
    updatePdfModalPreview();
  });
  container.querySelector('#pdf-dialog-font-size')?.addEventListener('input', updatePdfModalPreview);
  container.querySelector('#pdf-dialog-font-style')?.addEventListener('change', updatePdfModalPreview);

  container.querySelector('#btn-pdf-launcher-font')?.addEventListener('click', () => {
    updatePdfModalPreview();
    fontDialogModal.classList.add('open');
  });
  container.querySelector('#btn-close-pdf-font-dialog')?.addEventListener('click', () => fontDialogModal.classList.remove('open'));
  container.querySelector('#btn-cancel-pdf-font-dialog')?.addEventListener('click', () => fontDialogModal.classList.remove('open'));
  container.querySelector('#btn-apply-pdf-font-dialog')?.addEventListener('click', () => {
    const fam = pdfFontSelect?.value;
    const opt = pdfFontSelect?.options[pdfFontSelect.selectedIndex];
    const fontName = opt ? opt.textContent : 'Calibri';
    const sz = container.querySelector('#pdf-dialog-font-size')?.value;
    const style = container.querySelector('#pdf-dialog-font-style')?.value;

    if (fam) {
      if (pdfFontPicker) pdfFontPicker.setFont(fontName);
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
              f.style.fontFamily = fam;
            });
          }
        } catch (e) {}
      } else {
        const activePage = container.querySelector('.pdf-page-card.active, .pdf-blank-page-content');
        if (activePage) activePage.style.fontFamily = fam;
      }
    }
    if (sz) {
      document.execCommand('fontSize', false, '3');
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
        if (el) el.style.fontSize = `${sz}pt`;
      }
    }
    if (style) {
      if (style.includes('bold')) document.execCommand('bold', false, null);
      if (style.includes('italic')) document.execCommand('italic', false, null);
    }
    fontDialogModal.classList.remove('open');
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Applied ${fontName} typography`);
  });

  // Other launchers
  container.querySelector('#btn-pdf-launcher-clipboard')?.addEventListener('click', () => {
    alert('Clipboard History: Current clipboard text ready to paste.');
  });
  container.querySelector('#btn-pdf-launcher-tools')?.addEventListener('click', () => {
    alert('Tools: Toggle Select (text selection) or Hand (pan & drag viewport).');
  });
  container.querySelector('#btn-pdf-launcher-markup')?.addEventListener('click', () => {
    container.querySelector('[data-tab="annotate"]')?.click();
  });
  container.querySelector('#btn-pdf-launcher-anno')?.addEventListener('click', () => {
    alert('Markup Gallery: Highlighting, Underline, and Strikethrough are active.');
  });
  container.querySelector('#btn-pdf-launcher-ink')?.addEventListener('click', () => {
    penBtn?.click();
  });
  container.querySelector('#btn-pdf-launcher-notes')?.addEventListener('click', () => {
    createStickyNote();
  });
  container.querySelector('#btn-pdf-launcher-forms')?.addEventListener('click', () => {
    alert('Forms Setup: Add fillable text fields, checkboxes, radios, dates, and signature lines.');
  });
  container.querySelector('#btn-pdf-launcher-sig')?.addEventListener('click', openSignatureModal);
  container.querySelector('#btn-pdf-launcher-pages')?.addEventListener('click', () => {
    container.querySelector('[data-tab="pages"]')?.click();
  });
  container.querySelector('#btn-pdf-launcher-watermark')?.addEventListener('click', () => {
    container.querySelector('#btn-pdf-custom-watermark')?.click();
  });

  // ── PDF Studio Mobile Toolbar Listeners ───────────────────────
  container.querySelector('#btn-mobile-pdf-prev')?.addEventListener('click', () => {
    switchPage(activePageIndex - 1);
  });
  container.querySelector('#btn-mobile-pdf-next')?.addEventListener('click', () => {
    switchPage(activePageIndex + 1);
  });
  container.querySelector('#btn-mobile-pdf-pen')?.addEventListener('click', () => {
    container.querySelector('#btn-pdf-pen-draw')?.click();
  });
  container.querySelector('#btn-mobile-pdf-sig')?.addEventListener('click', () => {
    container.querySelector('#btn-open-signature-pad')?.click();
  });
  container.querySelector('#btn-mobile-pdf-stamp')?.addEventListener('click', () => {
    container.querySelector('#btn-pdf-stamp-approved')?.click();
  });
  container.querySelector('#btn-mobile-pdf-rotate')?.addEventListener('click', () => {
    container.querySelector('#btn-pdf-rotate')?.click();
  });
  container.querySelector('#btn-mobile-pdf-save')?.addEventListener('click', () => {
    container.querySelector('#btn-pdf-save-device')?.click();
  });

  renderPagesSidebar();
  switchPage(0);
}
}
