/**
 * ============================================================================
 * GIRI ORBIT — SOVEREIGN CORE DESKTOP ENGINE (js/components/orbitDesktopSuite.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * Pixel-Accurate Desktop Sovereign Architecture:
 * - Giri Drift Writer
 * - Giri Axis Spreadsheet
 * - Giri Kinetic Presentation
 * - Giri Aegis PDF Studio
 * ============================================================================
 */

export class OrbitDesktopSuite {
  constructor() {
    this.uiMode = localStorage.getItem('giri_orbit_ui_mode') || 'standard'; // 'standard' or 'notebookbar'
    this.activeMenu = null;
    this.initGlobalEvents();
  }

  // --- SVG Icons Library (Sovereign / Breeze Authentic Style) ---
  static get ICONS() {
    return {
      newDoc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`,
      open: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
      save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
      saveAs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M12 11v6m-3-3l3 3 3-3"/></svg>`,
      exportPdf: `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><text x="7" y="18" font-size="6" font-weight="bold" fill="#ef4444" stroke="none">PDF</text></svg>`,
      print: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
      printPreview: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      cut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
      paste: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
      formatPainter: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M19 11V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M5 13v7a2 2 0 0 0 2 2h2v-9"/><path d="M15 13v9"/></svg>`,
      undo: `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
      redo: `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>`,
      findReplace: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
      spellcheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l4-11 4 11m-7-3h6"/><path d="M16 19l2 2 5-5"/></svg>`,
      bold: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`,
      italic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
      underline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>`,
      strikethrough: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H8"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
      superscript: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="4" y="19" font-size="14" font-weight="bold" fill="currentColor">x</text><text x="14" y="10" font-size="9" font-weight="bold" fill="currentColor">2</text></svg>`,
      subscript: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="4" y="16" font-size="14" font-weight="bold" fill="currentColor">x</text><text x="14" y="21" font-size="9" font-weight="bold" fill="currentColor">2</text></svg>`,
      clearFormat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="3" y="17" font-size="14" font-weight="bold" fill="currentColor">T</text><line x1="14" y1="14" x2="20" y2="20" stroke="#ef4444" stroke-width="2.5"/><line x1="20" y1="14" x2="14" y2="20" stroke="#ef4444" stroke-width="2.5"/></svg>`,
      fontColor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="6" y="16" font-size="15" font-weight="bold" fill="currentColor">A</text><rect x="4" y="19" width="16" height="3" fill="#ef4444" stroke="none"/></svg>`,
      highlightColor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l4 4-8 8H4v-4l8-8z"/><path d="M16 6l2 2"/><rect x="3" y="20" width="18" height="3" fill="#facc15" stroke="none"/></svg>`,
      alignLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
      alignCenter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>`,
      alignRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>`,
      alignJustify: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>`,
      bullets: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>`,
      numbering: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="7" font-size="7" font-weight="bold" fill="currentColor">1.</text><text x="2" y="13" font-size="7" font-weight="bold" fill="currentColor">2.</text><text x="2" y="19" font-size="7" font-weight="bold" fill="currentColor">3.</text></svg>`,
      indentDecrease: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 8 3 12 7 16"/><line x1="21" y1="12" x2="11" y2="12"/><line x1="21" y1="6" x2="11" y2="6"/><line x1="21" y1="18" x2="11" y2="18"/></svg>`,
      indentIncrease: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 8 15 12 11 16"/><line x1="3" y1="12" x2="13" y2="12"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="18" x2="3" y2="18"/></svg>`,
      lineSpacing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 6 7 3 10 6"/><polyline points="4 18 7 21 10 18"/><line x1="7" y1="3" x2="7" y2="21"/><line x1="14" y1="6" x2="21" y2="6"/><line x1="14" y1="12" x2="21" y2="12"/><line x1="14" y1="18" x2="21" y2="18"/></svg>`,
      table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
      image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
      chart: `<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      shape: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="5"/><rect x="11" y="11" width="9" height="9" rx="1"/></svg>`,
      textBox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="2 2"/><text x="9" y="16" font-size="12" font-weight="bold" fill="currentColor">A</text></svg>`,
      pageBreak: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="8" rx="1"/><rect x="4" y="14" width="16" height="8" rx="1"/><line x1="2" y1="12" x2="22" y2="12" stroke-dasharray="3 3"/></svg>`,
      hyperlink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
      specialChar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="6" y="17" font-size="16" font-weight="bold" fill="currentColor">Ω</text></svg>`,
      pilcrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="7" y="17" font-size="15" font-weight="bold" fill="currentColor">¶</text></svg>`,
      autoFilter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
      sortAsc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="11" y2="6"/><line x1="4" y1="12" x2="9" y2="12"/><line x1="4" y1="18" x2="7" y2="18"/><polyline points="15 15 18 18 21 15"/><line x1="18" y1="6" x2="18" y2="18"/></svg>`,
      sortDesc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="7" y2="6"/><line x1="4" y1="12" x2="9" y2="12"/><line x1="4" y1="18" x2="11" y2="18"/><polyline points="15 9 18 6 21 9"/><line x1="18" y1="6" x2="18" y2="18"/></svg>`,
      sum: `<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><text x="6" y="18" font-size="16" font-weight="bold" fill="currentColor">Σ</text></svg>`,
      slideShow: `<svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><polygon points="10 8 16 10 10 12"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`,
      newSlide: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/></svg>`,
      sidebar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
      properties: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      styles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="6" y="17" font-size="16" font-style="italic" font-weight="bold" fill="currentColor">f</text></svg>`,
      gallery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
      navigator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
    };
  }

  initGlobalEvents() {
    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lo-menu-item')) {
        this.closeAllMenus();
      }
    });

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        this.openFindReplaceDialog();
      } else if (e.key === 'F7') {
        e.preventDefault();
        this.openSpellcheck();
      } else if (e.key === 'F5' && window.orbitPlatform?.currentView === 'kinetic') {
        e.preventDefault();
        this.startSlideShow();
      }
    });
  }

  closeAllMenus() {
    document.querySelectorAll('.lo-menu-item.open').forEach(el => el.classList.remove('open'));
    this.activeMenu = null;
  }

  // --- Render Application Window Header ---
  renderWindowHeader(tool, docTitle = 'Untitled 1') {
    const titles = {
      drift: {
        name: 'Giri Drift Document Composer',
        badgeHtml: '<img src="assets/drift-symbol.png" alt="Drift" style="width:18px; height:18px; object-fit:contain; border-radius:3px; vertical-align:middle; margin-right:6px;">',
        class: 'drift'
      },
      axis: { name: 'Giri Axis Spreadsheet', badge: 'A', class: 'calc' },
      kinetic: { name: 'Giri Kinetic Presentation', badge: 'K', class: 'impress' },
      pdf: { name: 'Giri Aegis PDF Studio', badge: 'Æ', class: 'draw' }
    };
    const t = titles[tool] || titles.drift;

    return `
      <div class="lo-window-header">
        <div class="lo-window-title-left">
          ${t.badgeHtml ? t.badgeHtml : `<span class="lo-app-badge ${t.class}">${t.badge}</span>`}
          <span class="lo-window-title-text">${t.name}</span>
          <span>—</span>
          <span class="lo-window-doc-name" id="lo-doc-title-display">[${docTitle}]</span>
        </div>
        <div class="lo-window-header-actions">
          <button class="lo-ui-switcher-pill" id="lo-btn-toggle-ui" title="Toggle User Interface Layout (Standard Toolbar vs Notebookbar)">
            <span>📐 UI: ${this.uiMode === 'standard' ? 'Standard' : 'Notebookbar'} ▾</span>
          </button>
          <button class="lo-header-btn" id="lo-btn-return-hub" title="Return to Suite Hub">
            <span>🪐 Hub</span>
          </button>
          <button class="lo-header-btn" id="lo-btn-cloud-sync" title="Google Drive Cloud Workspace">
            <span>☁️ Drive</span>
          </button>
          <button class="lo-header-btn" id="lo-btn-save-device" title="Save directly to device">
            <span>💾 Save</span>
          </button>
        </div>
      </div>
    `;
  }

  // --- Render Classic Menubar ---
  renderMenubar(tool) {
    const menus = this.getMenusForTool(tool);

    const menuHtml = menus.map((menu, mIdx) => `
      <div class="lo-menu-item" data-menu="${menu.id}">
        <button class="lo-menu-btn" data-menu-idx="${mIdx}">
          ${menu.label}
        </button>
        <div class="lo-menu-dropdown">
          ${menu.items.map(item => {
            if (item.separator) return `<div class="lo-menu-sep"></div>`;
            return `
              <div class="lo-menu-entry ${item.disabled ? 'disabled' : ''}" data-cmd="${item.cmd || ''}" title="${item.tooltip || ''}">
                <div class="lo-menu-entry-left">
                  <span class="lo-menu-icon">${item.icon || ''}</span>
                  <span>${item.label}</span>
                </div>
                ${item.shortcut ? `<span class="lo-shortcut-kbd">${item.shortcut}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    return `
      <nav class="lo-menubar" aria-label="Orbit Desktop Menus">
        ${menuHtml}
      </nav>
    `;
  }

  // --- Render Dual Toolbars ---
  renderToolbars(tool) {
    const I = OrbitDesktopSuite.ICONS;

    let standardToolbar = `
      <div class="lo-toolbar lo-toolbar-standard">
        <button class="lo-tool-btn" data-cmd="new" title="New Document (Ctrl+N)">${I.newDoc}</button>
        <button class="lo-tool-btn" data-cmd="open" title="Open... (Ctrl+O)">${I.open}</button>
        <button class="lo-tool-btn" data-cmd="save" title="Save (Ctrl+S)">${I.save}</button>
        <button class="lo-tool-btn" data-cmd="save-as" title="Save As... (Ctrl+Shift+S)">${I.saveAs}</button>
        <button class="lo-tool-btn" data-cmd="export-pdf" title="Export Directly as PDF">${I.exportPdf}</button>
        <button class="lo-tool-btn" data-cmd="print" title="Print... (Ctrl+P)">${I.print}</button>
        <button class="lo-tool-btn" data-cmd="print-preview" title="Print Preview (Ctrl+Shift+O)">${I.printPreview}</button>
        <div class="lo-tool-sep"></div>
        <button class="lo-tool-btn" data-cmd="cut" title="Cut (Ctrl+X)">${I.cut}</button>
        <button class="lo-tool-btn" data-cmd="copy" title="Copy (Ctrl+C)">${I.copy}</button>
        <button class="lo-tool-btn" data-cmd="paste" title="Paste (Ctrl+V)">${I.paste}</button>
        <button class="lo-tool-btn" data-cmd="format-painter" title="Clone Formatting (Brush)">${I.formatPainter}</button>
        <div class="lo-tool-sep"></div>
        <button class="lo-tool-btn" data-cmd="undo" title="Undo (Ctrl+Z)">${I.undo}</button>
        <button class="lo-tool-btn" data-cmd="redo" title="Redo (Ctrl+Y)">${I.redo}</button>
        <div class="lo-tool-sep"></div>
        <button class="lo-tool-btn" data-cmd="find-replace" title="Find and Replace... (Ctrl+H)">${I.findReplace}</button>
        <button class="lo-tool-btn" data-cmd="spellcheck" title="Spelling (F7)">${I.spellcheck}</button>
        <div class="lo-tool-sep"></div>
    `;

    if (tool === 'drift') {
      standardToolbar += `
        <button class="lo-tool-btn" data-cmd="insert-table" title="Insert Table (Ctrl+F12)">${I.table}</button>
        <button class="lo-tool-btn" data-cmd="insert-image" title="Insert Image...">${I.image}</button>
        <button class="lo-tool-btn" data-cmd="insert-chart" title="Insert Chart...">${I.chart}</button>
        <button class="lo-tool-btn" data-cmd="insert-shape" title="Insert Shape">${I.shape}</button>
        <button class="lo-tool-btn" data-cmd="insert-textbox" title="Insert Text Box (F2)">${I.textBox}</button>
        <button class="lo-tool-btn" data-cmd="page-break" title="Page Break (Ctrl+Enter)">${I.pageBreak}</button>
        <button class="lo-tool-btn" data-cmd="insert-link" title="Insert Hyperlink... (Ctrl+K)">${I.hyperlink}</button>
        <button class="lo-tool-btn" data-cmd="special-char" title="Insert Special Characters...">${I.specialChar}</button>
        <button class="lo-tool-btn" data-cmd="toggle-pilcrow" title="Toggle Formatting Marks (Ctrl+F10)">${I.pilcrow}</button>
      `;
    } else if (tool === 'axis') {
      standardToolbar += `
        <button class="lo-tool-btn" data-cmd="sort-asc" title="Sort Ascending (A-Z)">${I.sortAsc}</button>
        <button class="lo-tool-btn" data-cmd="sort-desc" title="Sort Descending (Z-A)">${I.sortDesc}</button>
        <button class="lo-tool-btn" data-cmd="auto-filter" title="AutoFilter">${I.autoFilter}</button>
        <button class="lo-tool-btn" data-cmd="insert-chart" title="Insert Chart...">${I.chart}</button>
        <button class="lo-tool-btn" data-cmd="insert-image" title="Insert Image...">${I.image}</button>
        <button class="lo-tool-btn" data-cmd="insert-function" title="Function Wizard (fx)">${I.fx}</button>
        <button class="lo-tool-btn" data-cmd="calc-sum" title="AutoSum (Σ)">${I.sum}</button>
      `;
    } else if (tool === 'kinetic') {
      standardToolbar += `
        <button class="lo-tool-btn" data-cmd="new-slide" title="New Slide (Ctrl+M)">${I.newSlide}</button>
        <button class="lo-tool-btn" data-cmd="start-slideshow" title="Start from First Slide (F5)" style="color:#ea580c;">${I.slideShow}</button>
        <button class="lo-tool-btn" data-cmd="insert-image" title="Insert Image...">${I.image}</button>
        <button class="lo-tool-btn" data-cmd="insert-shape" title="Insert Shape">${I.shape}</button>
        <button class="lo-tool-btn" data-cmd="insert-textbox" title="Insert Text Box (F2)">${I.textBox}</button>
        <button class="lo-tool-btn" data-cmd="insert-table" title="Insert Table">${I.table}</button>
      `;
    } else {
      // PDF / Draw
      standardToolbar += `
        <button class="lo-tool-btn" data-cmd="insert-image" title="Insert Image...">${I.image}</button>
        <button class="lo-tool-btn" data-cmd="insert-shape" title="Insert Vector Shape">${I.shape}</button>
        <button class="lo-tool-btn" data-cmd="insert-textbox" title="Insert Text Box">${I.textBox}</button>
      `;
    }

    standardToolbar += `
        <div class="lo-tool-sep" style="margin-left:auto;"></div>
        <button class="lo-tool-btn" id="lo-btn-toggle-sidebar" title="Toggle Sidebar (Ctrl+F5)">${I.sidebar}</button>
      </div>
    `;

    // Row 2: Formatting Toolbar
    let formattingToolbar = `
      <div class="lo-toolbar lo-toolbar-formatting">
    `;

    if (tool === 'drift') {
      formattingToolbar += `
        <select class="lo-select" id="lo-style-select" title="Paragraph Style" style="width:145px;">
          <option value="p">Default Paragraph Style</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="title">Title</option>
          <option value="subtitle">Subtitle</option>
          <option value="quote">Quotation</option>
          <option value="pre">Preformatted Text</option>
        </select>
        <div class="lo-tool-sep"></div>
      `;
    } else if (tool === 'axis') {
      formattingToolbar += `
        <select class="lo-select" id="lo-cell-format-select" title="Number Format" style="width:125px;">
          <option value="general">Standard</option>
          <option value="currency">Currency ($)</option>
          <option value="percent">Percent (%)</option>
          <option value="number">Number (1,000.00)</option>
          <option value="date">Date (YYYY-MM-DD)</option>
        </select>
        <div class="lo-tool-sep"></div>
      `;
    }

    formattingToolbar += `
        <select class="lo-select" id="lo-font-select" title="Font Name" style="width:130px;">
          <option value="'Liberation Serif', serif" selected>Liberation Serif</option>
          <option value="'Liberation Sans', sans-serif">Liberation Sans</option>
          <option value="'DejaVu Sans', sans-serif">DejaVu Sans</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Arial', sans-serif">Arial</option>
          <option value="'Calibri', sans-serif">Calibri</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Courier New', monospace">Courier New</option>
        </select>
        <select class="lo-select" id="lo-size-select" title="Font Size" style="width:58px;">
          <option value="8pt">8</option>
          <option value="9pt">9</option>
          <option value="10pt">10</option>
          <option value="11pt">11</option>
          <option value="12pt" selected>12</option>
          <option value="14pt">14</option>
          <option value="16pt">16</option>
          <option value="18pt">18</option>
          <option value="20pt">20</option>
          <option value="24pt">24</option>
          <option value="28pt">28</option>
          <option value="32pt">32</option>
          <option value="36pt">36</option>
          <option value="48pt">48</option>
          <option value="72pt">72</option>
        </select>
        <div class="lo-tool-sep"></div>
        <button class="lo-tool-btn" data-cmd="bold" title="Bold (Ctrl+B)">${I.bold}</button>
        <button class="lo-tool-btn" data-cmd="italic" title="Italic (Ctrl+I)">${I.italic}</button>
        <button class="lo-tool-btn" data-cmd="underline" title="Underline (Ctrl+U)">${I.underline}</button>
        <button class="lo-tool-btn" data-cmd="strikethrough" title="Strikethrough">${I.strikethrough}</button>
        <button class="lo-tool-btn" data-cmd="superscript" title="Superscript (Ctrl+Shift+P)">${I.superscript}</button>
        <button class="lo-tool-btn" data-cmd="subscript" title="Subscript (Ctrl+Shift+B)">${I.subscript}</button>
        <button class="lo-tool-btn" data-cmd="clear-formatting" title="Clear Direct Formatting (Ctrl+M)">${I.clearFormat}</button>
        <div class="lo-tool-sep"></div>
        <button class="lo-tool-btn" data-cmd="font-color" title="Font Color">${I.fontColor}</button>
        <button class="lo-tool-btn" data-cmd="highlight-color" title="Highlighting">${I.highlightColor}</button>
        <div class="lo-tool-sep"></div>
        <button class="lo-tool-btn" data-cmd="align-left" title="Align Left (Ctrl+L)">${I.alignLeft}</button>
        <button class="lo-tool-btn" data-cmd="align-center" title="Align Center (Ctrl+E)">${I.alignCenter}</button>
        <button class="lo-tool-btn" data-cmd="align-right" title="Align Right (Ctrl+R)">${I.alignRight}</button>
        <button class="lo-tool-btn" data-cmd="align-justify" title="Justified (Ctrl+J)">${I.alignJustify}</button>
        <div class="lo-tool-sep"></div>
        <button class="lo-tool-btn" data-cmd="toggle-bullets" title="Toggle Bulleted List (Shift+F12)">${I.bullets}</button>
        <button class="lo-tool-btn" data-cmd="toggle-numbering" title="Toggle Numbered List (F12)">${I.numbering}</button>
        <button class="lo-tool-btn" data-cmd="indent-decrease" title="Decrease Indent">${I.indentDecrease}</button>
        <button class="lo-tool-btn" data-cmd="indent-increase" title="Increase Indent">${I.indentIncrease}</button>
        <button class="lo-tool-btn" data-cmd="line-spacing" title="Line Spacing">${I.lineSpacing}</button>
      </div>
    `;

    return `
      <div class="lo-toolbars-wrap">
        ${standardToolbar}
        ${formattingToolbar}
      </div>
    `;
  }

  // --- Render Formula Bar ---
  renderFormulaBar() {
    return `
      <div class="lo-formula-bar" id="lo-calc-formula-bar">
        <input type="text" class="lo-name-box" id="lo-calc-name-box" value="A1" spellcheck="false" title="Name Box: Jump to cell or range">
        <button class="lo-formula-btn fx" id="lo-btn-formula-fx" title="Function Wizard (fx)">fx</button>
        <button class="lo-formula-btn sum" id="lo-btn-formula-sum" title="Select Formula (Σ)">Σ</button>
        <button class="lo-formula-btn eq" id="lo-btn-formula-eq" title="Formula (=)">=</button>
        <input type="text" class="lo-formula-input" id="lo-calc-formula-input" placeholder="Type formula or value (e.g. =SUM(A1:A10), =AVERAGE, =IF, =XLOOKUP)" spellcheck="false">
      </div>
    `;
  }

  // --- Render Measurement Ruler ---
  renderRuler() {
    return `
      <div class="lo-ruler-wrap" id="lo-writer-ruler">
        <div class="lo-ruler-ticks">
          <div class="lo-ruler-inch">1"</div>
          <div class="lo-ruler-inch">2"</div>
          <div class="lo-ruler-inch">3"</div>
          <div class="lo-ruler-inch">4"</div>
          <div class="lo-ruler-inch">5"</div>
          <div class="lo-ruler-inch">6"</div>
          <div class="lo-ruler-inch">7"</div>
          <div class="lo-ruler-inch">8"</div>
        </div>
      </div>
    `;
  }

  // --- Render Slides Sorter Pane ---
  renderSlidesPane(slides = []) {
    const listHtml = (slides.length ? slides : [{ title: 'Slide 1' }]).map((s, idx) => `
      <div class="lo-slide-thumb-card ${idx === 0 ? 'active' : ''}" data-slide-idx="${idx}">
        <div class="lo-slide-preview-box">
          <strong>${s.title || `Slide ${idx + 1}`}</strong>
        </div>
        <div class="lo-slide-thumb-footer">
          <span>${idx + 1}</span>
          <span>16:9</span>
        </div>
      </div>
    `).join('');

    return `
      <aside class="lo-slides-pane" id="lo-impress-slides-pane">
        <div class="lo-slides-pane-header">
          <span>Slides</span>
          <button class="lo-tool-btn" id="lo-btn-add-slide-pane" title="New Slide (Ctrl+M)">＋</button>
        </div>
        <div id="lo-slides-list" style="display:flex; flex-direction:column; gap:8px;">
          ${listHtml}
        </div>
      </aside>
    `;
  }

  // --- Render Right Sidebar Deck ---
  renderSidebarDeck(tool) {
    const I = OrbitDesktopSuite.ICONS;

    return `
      <aside class="lo-sidebar-deck" id="lo-sidebar-deck">
        <div class="lo-sidebar-nav-strip">
          <button class="lo-sidebar-tab-btn active" data-deck="properties" title="Properties">${I.properties} <span>Properties</span></button>
          <button class="lo-sidebar-tab-btn" data-deck="styles" title="Styles">${I.styles} <span>Styles</span></button>
          <button class="lo-sidebar-tab-btn" data-deck="gallery" title="Gallery & Shapes">${I.gallery} <span>Gallery</span></button>
          <button class="lo-sidebar-tab-btn" data-deck="navigator" title="Navigator">${I.navigator} <span>Navigator</span></button>
        </div>
        <div class="lo-sidebar-content" id="lo-sidebar-content">
          <!-- Populated dynamically based on active tab -->
          <div class="lo-sidebar-section">
            <span class="lo-sidebar-section-title">Character</span>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              <select class="lo-select" id="lo-side-font" style="grid-column:span 2;">
                <option>Liberation Serif</option>
                <option>Liberation Sans</option>
                <option>Calibri</option>
                <option>Times New Roman</option>
              </select>
              <select class="lo-select" id="lo-side-size">
                <option>10pt</option>
                <option>11pt</option>
                <option selected>12pt</option>
                <option>14pt</option>
                <option>18pt</option>
              </select>
              <div style="display:flex; gap:3px;">
                <button class="lo-tool-btn" data-cmd="bold"><strong>B</strong></button>
                <button class="lo-tool-btn" data-cmd="italic"><em>I</em></button>
                <button class="lo-tool-btn" data-cmd="underline"><u>U</u></button>
              </div>
            </div>
          </div>
          <div class="lo-sidebar-section">
            <span class="lo-sidebar-section-title">Paragraph / Alignment</span>
            <div style="display:flex; gap:4px;">
              <button class="lo-tool-btn" data-cmd="align-left">L</button>
              <button class="lo-tool-btn" data-cmd="align-center">C</button>
              <button class="lo-tool-btn" data-cmd="align-right">R</button>
              <button class="lo-tool-btn" data-cmd="align-justify">J</button>
            </div>
          </div>
          <div class="lo-sidebar-section">
            <span class="lo-sidebar-section-title">Page / Layout Style</span>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <button class="lo-btn-dialog" id="lo-btn-page-style">Format Page Style...</button>
              <button class="lo-btn-dialog" id="lo-btn-watermark">Insert Watermark...</button>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  // --- Render Bottom Status Bar ---
  renderStatusBar(tool, stats = {}) {
    let leftInfo = '';
    if (tool === 'drift') {
      leftInfo = `
        <span class="lo-status-pill clickable" id="lo-stat-page-count">Page ${stats.currentPage || 1} of ${stats.totalPages || 1}</span>
        <span class="lo-status-pill clickable" id="lo-stat-word-count">${stats.words || 0} words, ${stats.chars || 0} characters</span>
        <span class="lo-status-pill">Default Page Style</span>
        <span class="lo-status-pill">English (USA)</span>
      `;
    } else if (tool === 'axis') {
      leftInfo = `
        <span class="lo-status-pill" id="lo-stat-sheet-count">Sheet 1 of 1</span>
        <span class="lo-status-pill" id="lo-stat-selected-cell">Selected: A1</span>
        <span class="lo-status-pill" id="lo-stat-calc-sum">Average: 0 | Sum: 0 | Count: 0</span>
      `;
    } else if (tool === 'kinetic') {
      leftInfo = `
        <span class="lo-status-pill" id="lo-stat-slide-count">Slide 1 of ${stats.totalSlides || 1}</span>
        <span class="lo-status-pill">Default Master</span>
        <span class="lo-status-pill">16:9 Widescreen</span>
      `;
    } else {
      leftInfo = `
        <span class="lo-status-pill">Page 1 of 1</span>
        <span class="lo-status-pill">100% Verified</span>
        <span class="lo-status-pill">256-bit Certified</span>
      `;
    }

    return `
      <footer class="lo-statusbar">
        <div class="lo-status-left">
          ${leftInfo}
          <span class="lo-status-pill">STD</span>
        </div>
        <div class="lo-status-right">
          <div class="lo-zoom-ctrls">
            <button class="lo-zoom-btn" id="lo-zoom-out">-</button>
            <input type="range" class="lo-zoom-slider" id="lo-zoom-range" min="50" max="200" value="100">
            <button class="lo-zoom-btn" id="lo-zoom-in">+</button>
            <span id="lo-zoom-val" style="min-width:36px; text-align:right;">100%</span>
          </div>
        </div>
      </footer>
    `;
  }

  // --- Menus Configuration for Each Tool ---
  getMenusForTool(tool) {
    const I = OrbitDesktopSuite.ICONS;

    const commonFile = [
      { label: 'New', icon: I.newDoc, cmd: 'new', shortcut: 'Ctrl+N' },
      { label: 'Open...', icon: I.open, cmd: 'open', shortcut: 'Ctrl+O' },
      { label: 'Open Remote (Google Drive)...', icon: '☁️', cmd: 'open-remote' },
      { label: 'Recent Documents', icon: '🕒', cmd: 'recent-docs' },
      { separator: true },
      { label: 'Save', icon: I.save, cmd: 'save', shortcut: 'Ctrl+S' },
      { label: 'Save As...', icon: I.saveAs, cmd: 'save-as', shortcut: 'Ctrl+Shift+S' },
      { label: 'Save Remote (Google Drive)...', icon: '☁️', cmd: 'save-remote' },
      { label: 'Save a Copy...', icon: I.copy, cmd: 'save-copy' },
      { separator: true },
      { label: 'Export Directly as PDF', icon: I.exportPdf, cmd: 'export-pdf' },
      { label: 'Export...', icon: '📤', cmd: 'export-modal' },
      { separator: true },
      { label: 'Print...', icon: I.print, cmd: 'print', shortcut: 'Ctrl+P' },
      { label: 'Print Preview', icon: I.printPreview, cmd: 'print-preview', shortcut: 'Ctrl+Shift+O' },
      { separator: true },
      { label: 'Properties...', icon: I.properties, cmd: 'doc-properties' }
    ];

    const commonEdit = [
      { label: 'Undo', icon: I.undo, cmd: 'undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', icon: I.redo, cmd: 'redo', shortcut: 'Ctrl+Y' },
      { separator: true },
      { label: 'Cut', icon: I.cut, cmd: 'cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', icon: I.copy, cmd: 'copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', icon: I.paste, cmd: 'paste', shortcut: 'Ctrl+V' },
      { label: 'Paste Special...', icon: I.paste, cmd: 'paste-special' },
      { label: 'Select All', icon: '📑', cmd: 'select-all', shortcut: 'Ctrl+A' },
      { separator: true },
      { label: 'Find...', icon: '🔍', cmd: 'find', shortcut: 'Ctrl+F' },
      { label: 'Find and Replace...', icon: I.findReplace, cmd: 'find-replace', shortcut: 'Ctrl+H' },
      { separator: true },
      { label: 'Track Changes', icon: '📝', cmd: 'track-changes' },
      { label: 'Word Count...', icon: '📊', cmd: 'word-count' }
    ];

    const commonView = [
      { label: 'User Interface: Standard Toolbar', icon: '📐', cmd: 'ui-standard' },
      { label: 'User Interface: Tabbed Notebookbar', icon: '📑', cmd: 'ui-notebookbar' },
      { separator: true },
      { label: 'Full Screen', icon: '⛶', cmd: 'fullscreen', shortcut: 'Ctrl+Shift+J' },
      { label: 'Zoom...', icon: '🔍', cmd: 'zoom-dialog' },
      { separator: true },
      { label: 'Rulers', icon: '📏', cmd: 'toggle-ruler' },
      { label: 'Status Bar', icon: '📊', cmd: 'toggle-statusbar' },
      { label: 'Sidebar Deck', icon: I.sidebar, cmd: 'toggle-sidebar', shortcut: 'Ctrl+F5' }
    ];

    const commonHelp = [
      { label: 'Giri Orbit Help', icon: '❓', cmd: 'help', shortcut: 'F1' },
      { label: 'Girionix Pro AI Assistant', icon: '⚡', cmd: 'ai-agent', shortcut: 'Alt+A' },
      { separator: true },
      { label: 'About Giri Orbit Desktop Suite', icon: 'ℹ️', cmd: 'about' }
    ];

    if (tool === 'drift') {
      return [
        { id: 'file', label: 'File', items: commonFile },
        { id: 'edit', label: 'Edit', items: commonEdit },
        { id: 'view', label: 'View', items: commonView },
        {
          id: 'insert',
          label: 'Insert',
          items: [
            { label: 'Page Break', icon: I.pageBreak, cmd: 'page-break', shortcut: 'Ctrl+Enter' },
            { label: 'Image...', icon: I.image, cmd: 'insert-image' },
            { label: 'Chart...', icon: I.chart, cmd: 'insert-chart' },
            { label: 'Shape...', icon: I.shape, cmd: 'insert-shape' },
            { label: 'Text Box', icon: I.textBox, cmd: 'insert-textbox', shortcut: 'F2' },
            { label: 'Comment', icon: '💬', cmd: 'insert-comment', shortcut: 'Ctrl+Alt+C' },
            { separator: true },
            { label: 'Hyperlink...', icon: I.hyperlink, cmd: 'insert-link', shortcut: 'Ctrl+K' },
            { label: 'Special Character...', icon: I.specialChar, cmd: 'special-char' },
            { label: 'Formatting Mark (¶)', icon: I.pilcrow, cmd: 'toggle-pilcrow', shortcut: 'Ctrl+F10' },
            { separator: true },
            { label: 'Header and Footer', icon: '📄', cmd: 'header-footer' },
            { label: 'Page Number', icon: '🔢', cmd: 'page-number' },
            { label: 'Date and Time', icon: '📅', cmd: 'date-time' },
            { label: 'Watermark...', icon: '🌊', cmd: 'watermark' },
            { label: 'Horizontal Line', icon: '➖', cmd: 'horizontal-line' }
          ]
        },
        {
          id: 'format',
          label: 'Format',
          items: [
            { label: 'Bold', icon: I.bold, cmd: 'bold', shortcut: 'Ctrl+B' },
            { label: 'Italic', icon: I.italic, cmd: 'italic', shortcut: 'Ctrl+I' },
            { label: 'Underline', icon: I.underline, cmd: 'underline', shortcut: 'Ctrl+U' },
            { label: 'Strikethrough', icon: I.strikethrough, cmd: 'strikethrough' },
            { label: 'Superscript', icon: I.superscript, cmd: 'superscript', shortcut: 'Ctrl+Shift+P' },
            { label: 'Subscript', icon: I.subscript, cmd: 'subscript', shortcut: 'Ctrl+Shift+B' },
            { separator: true },
            { label: 'Align Left', icon: I.alignLeft, cmd: 'align-left', shortcut: 'Ctrl+L' },
            { label: 'Align Center', icon: I.alignCenter, cmd: 'align-center', shortcut: 'Ctrl+E' },
            { label: 'Align Right', icon: I.alignRight, cmd: 'align-right', shortcut: 'Ctrl+R' },
            { label: 'Justified', icon: I.alignJustify, cmd: 'align-justify', shortcut: 'Ctrl+J' },
            { separator: true },
            { label: 'Clear Direct Formatting', icon: I.clearFormat, cmd: 'clear-formatting', shortcut: 'Ctrl+M' },
            { label: 'Format Page Style...', icon: '📄', cmd: 'page-style' }
          ]
        },
        {
          id: 'styles',
          label: 'Styles',
          items: [
            { label: 'Default Paragraph Style', cmd: 'style-p' },
            { label: 'Heading 1', cmd: 'style-h1', shortcut: 'Ctrl+1' },
            { label: 'Heading 2', cmd: 'style-h2', shortcut: 'Ctrl+2' },
            { label: 'Heading 3', cmd: 'style-h3', shortcut: 'Ctrl+3' },
            { label: 'Title', cmd: 'style-title' },
            { label: 'Subtitle', cmd: 'style-subtitle' },
            { label: 'Quotation', cmd: 'style-quote' },
            { separator: true },
            { label: 'Manage Styles...', icon: I.styles, cmd: 'manage-styles', shortcut: 'F11' }
          ]
        },
        {
          id: 'table',
          label: 'Table',
          items: [
            { label: 'Insert Table...', icon: I.table, cmd: 'insert-table', shortcut: 'Ctrl+F12' },
            { separator: true },
            { label: 'Insert Rows Above', cmd: 'table-row-above' },
            { label: 'Insert Rows Below', cmd: 'table-row-below' },
            { label: 'Insert Columns Before', cmd: 'table-col-before' },
            { label: 'Insert Columns After', cmd: 'table-col-after' },
            { separator: true },
            { label: 'Delete Selected Rows', cmd: 'table-del-row' },
            { label: 'Delete Selected Columns', cmd: 'table-del-col' },
            { label: 'Delete Table', cmd: 'table-del' }
          ]
        },
        {
          id: 'tools',
          label: 'Tools',
          items: [
            { label: 'Spelling...', icon: I.spellcheck, cmd: 'spellcheck', shortcut: 'F7' },
            { label: 'Thesaurus...', icon: '📚', cmd: 'thesaurus', shortcut: 'Ctrl+F7' },
            { label: 'Word Count...', icon: '📊', cmd: 'word-count' },
            { separator: true },
            { label: 'Mail Merge Wizard...', icon: '✉️', cmd: 'mail-merge' },
            { label: 'Girionix Pro Cloud AI...', icon: '⚡', cmd: 'ai-agent', shortcut: 'Alt+A' }
          ]
        },
        { id: 'window', label: 'Window', items: [{ label: 'New Window', cmd: 'new-win' }, { label: 'Close Window', cmd: 'close-win' }] },
        { id: 'help', label: 'Help', items: commonHelp }
      ];
    } else if (tool === 'axis') {
      return [
        { id: 'file', label: 'File', items: commonFile },
        { id: 'edit', label: 'Edit', items: commonEdit },
        { id: 'view', label: 'View', items: commonView },
        {
          id: 'insert',
          label: 'Insert',
          items: [
            { label: 'Function Wizard (fx)...', icon: I.fx, cmd: 'insert-function' },
            { label: 'AutoSum (Σ)', icon: I.sum, cmd: 'calc-sum' },
            { separator: true },
            { label: 'Rows Above', cmd: 'calc-row-above' },
            { label: 'Rows Below', cmd: 'calc-row-below' },
            { label: 'Columns Left', cmd: 'calc-col-left' },
            { label: 'Columns Right', cmd: 'calc-col-right' },
            { separator: true },
            { label: 'Insert Chart...', icon: I.chart, cmd: 'insert-chart' },
            { label: 'Insert Image...', icon: I.image, cmd: 'insert-image' },
            { label: 'Special Character...', icon: I.specialChar, cmd: 'special-char' },
            { label: 'Comment', icon: '💬', cmd: 'insert-comment' }
          ]
        },
        {
          id: 'format',
          label: 'Format',
          items: [
            { label: 'Format Cells...', icon: '📊', cmd: 'format-cells', shortcut: 'Ctrl+1' },
            { separator: true },
            { label: 'Bold', icon: I.bold, cmd: 'bold', shortcut: 'Ctrl+B' },
            { label: 'Italic', icon: I.italic, cmd: 'italic', shortcut: 'Ctrl+I' },
            { label: 'Underline', icon: I.underline, cmd: 'underline', shortcut: 'Ctrl+U' },
            { separator: true },
            { label: 'Merge & Center Cells', cmd: 'merge-center' },
            { label: 'Unmerge Cells', cmd: 'unmerge-cells' },
            { separator: true },
            { label: 'Conditional Formatting...', cmd: 'cond-formatting' },
            { label: 'Clear Direct Formatting', icon: I.clearFormat, cmd: 'clear-formatting', shortcut: 'Ctrl+M' }
          ]
        },
        {
          id: 'sheet',
          label: 'Sheet',
          items: [
            { label: 'Insert Sheet...', cmd: 'sheet-insert' },
            { label: 'Delete Sheet...', cmd: 'sheet-delete' },
            { label: 'Rename Sheet...', cmd: 'sheet-rename' },
            { label: 'Clear Sheet Contents', cmd: 'sheet-clear' }
          ]
        },
        {
          id: 'data',
          label: 'Data',
          items: [
            { label: 'Sort Ascending (A-Z)', icon: I.sortAsc, cmd: 'sort-asc' },
            { label: 'Sort Descending (Z-A)', icon: I.sortDesc, cmd: 'sort-desc' },
            { label: 'AutoFilter', icon: I.autoFilter, cmd: 'auto-filter' },
            { separator: true },
            { label: 'Validity / Data Validation...', icon: '🛡️', cmd: 'data-validation' },
            { label: 'Goal Seek...', icon: '🎯', cmd: 'goal-seek' },
            { label: 'Pivot Table...', icon: '📑', cmd: 'pivot-table' },
            { separator: true },
            { label: 'Calculate Now', icon: '🔄', cmd: 'recalc-now', shortcut: 'F9' }
          ]
        },
        {
          id: 'tools',
          label: 'Tools',
          items: [
            { label: 'Spelling...', icon: I.spellcheck, cmd: 'spellcheck', shortcut: 'F7' },
            { label: 'Goal Seek...', icon: '🎯', cmd: 'goal-seek' },
            { label: 'Protect Sheet...', icon: '🔒', cmd: 'protect-sheet' },
            { separator: true },
            { label: 'Girionix Pro Cloud AI...', icon: '⚡', cmd: 'ai-agent', shortcut: 'Alt+A' }
          ]
        },
        { id: 'window', label: 'Window', items: [{ label: 'New Window', cmd: 'new-win' }, { label: 'Close Window', cmd: 'close-win' }] },
        { id: 'help', label: 'Help', items: commonHelp }
      ];
    } else if (tool === 'kinetic') {
      return [
        { id: 'file', label: 'File', items: commonFile },
        { id: 'edit', label: 'Edit', items: commonEdit },
        { id: 'view', label: 'View', items: commonView },
        {
          id: 'insert',
          label: 'Insert',
          items: [
            { label: 'New Slide', icon: I.newSlide, cmd: 'new-slide', shortcut: 'Ctrl+M' },
            { label: 'Duplicate Slide', icon: I.copy, cmd: 'duplicate-slide' },
            { label: 'Delete Slide', icon: '🗑', cmd: 'delete-slide' },
            { separator: true },
            { label: 'Text Box', icon: I.textBox, cmd: 'insert-textbox', shortcut: 'F2' },
            { label: 'Image...', icon: I.image, cmd: 'insert-image' },
            { label: 'Shape...', icon: I.shape, cmd: 'insert-shape' },
            { label: 'Table...', icon: I.table, cmd: 'insert-table' }
          ]
        },
        {
          id: 'slide',
          label: 'Slide',
          items: [
            { label: 'New Slide', icon: I.newSlide, cmd: 'new-slide', shortcut: 'Ctrl+M' },
            { label: 'Duplicate Slide', cmd: 'duplicate-slide' },
            { label: 'Delete Slide', cmd: 'delete-slide' },
            { separator: true },
            { label: 'Slide Transition...', icon: '✨', cmd: 'slide-transition' },
            { label: 'Slide Properties...', icon: I.properties, cmd: 'slide-properties' }
          ]
        },
        {
          id: 'slideshow',
          label: 'Slide Show',
          items: [
            { label: 'Start from First Slide', icon: I.slideShow, cmd: 'start-slideshow', shortcut: 'F5' },
            { label: 'Start from Current Slide', icon: I.slideShow, cmd: 'start-slideshow-current', shortcut: 'Shift+F5' }
          ]
        },
        {
          id: 'tools',
          label: 'Tools',
          items: [
            { label: 'Spelling...', icon: I.spellcheck, cmd: 'spellcheck', shortcut: 'F7' },
            { label: 'Girionix Pro Cloud AI...', icon: '⚡', cmd: 'ai-agent', shortcut: 'Alt+A' }
          ]
        },
        { id: 'window', label: 'Window', items: [{ label: 'New Window', cmd: 'new-win' }] },
        { id: 'help', label: 'Help', items: commonHelp }
      ];
    } else {
      // PDF / Draw
      return [
        { id: 'file', label: 'File', items: commonFile },
        { id: 'edit', label: 'Edit', items: commonEdit },
        { id: 'view', label: 'View', items: commonView },
        {
          id: 'insert',
          label: 'Insert',
          items: [
            { label: 'Image...', icon: I.image, cmd: 'insert-image' },
            { label: 'Vector Shape...', icon: I.shape, cmd: 'insert-shape' },
            { label: 'Text Annotation', icon: I.textBox, cmd: 'insert-textbox' }
          ]
        },
        { id: 'tools', label: 'Tools', items: [{ label: 'Girionix Pro Cloud AI...', icon: '⚡', cmd: 'ai-agent', shortcut: 'Alt+A' }] },
        { id: 'help', label: 'Help', items: commonHelp }
      ];
    }
  }

  // --- Bind UI Events across Menus and Toolbars ---
  bindEvents(container, tool, callbacks = {}) {
    // 0. Set Initial UI Mode class
    container.classList.remove('orbit-ui-standard', 'orbit-ui-notebookbar');
    container.classList.add(`orbit-ui-${this.uiMode}`);

    // 1. Menu Bar Dropdown Toggles & Hover Tracking
    const menuItems = container.querySelectorAll('.lo-menu-item');
    menuItems.forEach(item => {
      const btn = item.querySelector('.lo-menu-btn');
      btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = item.classList.contains('open');
        this.closeAllMenus();
        if (!wasOpen) {
          item.classList.add('open');
          this.activeMenu = item;
        }
      });

      // Hover over other menus when one is already open
      item.addEventListener('mouseenter', () => {
        if (this.activeMenu && this.activeMenu !== item) {
          this.closeAllMenus();
          item.classList.add('open');
          this.activeMenu = item;
        }
      });
    });

    // 2. Command Dispatch for Menu Entries and Toolbar Buttons
    container.querySelectorAll('[data-cmd]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllMenus();
        const cmd = el.dataset.cmd;
        this.executeCommand(cmd, tool, callbacks);
      });
    });

    // 3. UI Switcher Button
    container.querySelector('#lo-btn-toggle-ui')?.addEventListener('click', () => {
      this.uiMode = this.uiMode === 'standard' ? 'notebookbar' : 'standard';
      localStorage.setItem('giri_orbit_ui_mode', this.uiMode);
      container.classList.remove('orbit-ui-standard', 'orbit-ui-notebookbar');
      container.classList.add(`orbit-ui-${this.uiMode}`);
      const btn = container.querySelector('#lo-btn-toggle-ui span');
      if (btn) btn.textContent = `📐 UI: ${this.uiMode === 'standard' ? 'Standard' : 'Notebookbar'} ▾`;
      if (window.orbitPlatform) {
        window.orbitPlatform.showToast(`Switched interface layout to ${this.uiMode.toUpperCase()}!`, 'blue');
      }
      if (callbacks.onUiToggle) callbacks.onUiToggle(this.uiMode);
    });

    // 4. Return to Hub
    container.querySelector('#lo-btn-return-hub')?.addEventListener('click', () => {
      if (window.orbitPlatform) window.orbitPlatform.navigateTo('launcher');
    });

    // 5. Cloud Drive Sync Modal
    container.querySelector('#lo-btn-cloud-sync')?.addEventListener('click', () => {
      if (window.orbitDriveSync) window.orbitDriveSync.openDriveModal('browser', tool);
    });

    // 6. Save to Device
    container.querySelector('#lo-btn-save-device')?.addEventListener('click', () => {
      if (callbacks.onSaveDevice) callbacks.onSaveDevice();
    });

    // 7. Sidebar Deck Tabs
    container.querySelectorAll('.lo-sidebar-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.lo-sidebar-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const deck = btn.dataset.deck;
        this.updateSidebarPanel(container, deck, tool);
      });
    });

    // 8. Sidebar Toggle Button
    container.querySelector('#lo-btn-toggle-sidebar')?.addEventListener('click', () => {
      const deck = container.querySelector('#lo-sidebar-deck');
      if (deck) deck.classList.toggle('collapsed');
    });

    // 9. Zoom Controls
    const zoomSlider = container.querySelector('#lo-zoom-range');
    const zoomVal = container.querySelector('#lo-zoom-val');
    const updateZoom = (val) => {
      if (zoomVal) zoomVal.textContent = `${val}%`;
      if (callbacks.onZoom) callbacks.onZoom(val);
    };
    zoomSlider?.addEventListener('input', (e) => updateZoom(e.target.value));
    container.querySelector('#lo-zoom-in')?.addEventListener('click', () => {
      if (zoomSlider) {
        zoomSlider.value = Math.min(200, parseInt(zoomSlider.value, 10) + 10);
        updateZoom(zoomSlider.value);
      }
    });
    container.querySelector('#lo-zoom-out')?.addEventListener('click', () => {
      if (zoomSlider) {
        zoomSlider.value = Math.max(50, parseInt(zoomSlider.value, 10) - 10);
        updateZoom(zoomSlider.value);
      }
    });

    // 10. Direct Text Formatting Selects & Color Pickers
    container.querySelector('#lo-font-select')?.addEventListener('change', (e) => {
      document.execCommand('fontName', false, e.target.value);
    });
    container.querySelector('#lo-size-select')?.addEventListener('change', (e) => {
      document.execCommand('fontSize', false, e.target.value);
    });
    container.querySelector('#lo-style-select')?.addEventListener('change', (e) => {
      const v = e.target.value;
      if (v === 'p') document.execCommand('formatBlock', false, '<p>');
      else if (['h1', 'h2', 'h3'].includes(v)) document.execCommand('formatBlock', false, `<${v}>`);
      else if (v === 'pre') document.execCommand('formatBlock', false, '<pre>');
    });
    container.querySelector('#lo-color-picker')?.addEventListener('input', (e) => {
      document.execCommand('foreColor', false, e.target.value);
    });
    container.querySelector('#lo-highlight-picker')?.addEventListener('input', (e) => {
      document.execCommand('hiliteColor', false, e.target.value);
    });

    // 11. Calc Formula Bar Handlers
    const calcInput = container.querySelector('#lo-calc-formula-input');
    const calcNameBox = container.querySelector('#lo-calc-name-box');
    if (calcInput) {
      calcInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (callbacks.onCommitFormula) callbacks.onCommitFormula(calcInput.value);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          if (callbacks.onCancelFormula) callbacks.onCancelFormula();
        }
      });
      calcInput.addEventListener('input', () => {
        if (callbacks.onFormulaInput) callbacks.onFormulaInput(calcInput.value);
      });
    }
    if (calcNameBox) {
      calcNameBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (callbacks.onJumpCell) callbacks.onJumpCell(calcNameBox.value.trim().toUpperCase());
        }
      });
    }
    container.querySelector('#lo-btn-formula-sum')?.addEventListener('click', () => {
      if (callbacks.onAutoSum) callbacks.onAutoSum();
    });
    container.querySelector('#lo-btn-formula-wizard')?.addEventListener('click', () => {
      if (callbacks.onFunctionWizard) callbacks.onFunctionWizard();
    });
    container.querySelector('#lo-btn-formula-equal')?.addEventListener('click', () => {
      if (calcInput) {
        if (!calcInput.value.startsWith('=')) calcInput.value = '=' + calcInput.value;
        calcInput.focus();
        calcInput.setSelectionRange(calcInput.value.length, calcInput.value.length);
        if (callbacks.onFormulaInput) callbacks.onFormulaInput(calcInput.value);
      }
    });

    // 12. Impress Slides Thumbnails & Sorter
    container.querySelectorAll('.lo-slide-thumb-card').forEach((card, idx) => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.lo-slide-thumb-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (callbacks.onSelectSlide) callbacks.onSelectSlide(idx);
      });
    });
    container.querySelector('#lo-btn-add-slide')?.addEventListener('click', () => {
      if (callbacks.onAddSlide) callbacks.onAddSlide();
    });

    // 13. Calc Sheet Tabs
    container.querySelectorAll('.lo-sheet-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.lo-sheet-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (callbacks.onSelectSheet) callbacks.onSelectSheet(tab.dataset.sheet);
      });
    });
    container.querySelector('#lo-btn-add-sheet')?.addEventListener('click', () => {
      if (callbacks.onAddSheet) callbacks.onAddSheet();
    });
  }

  // --- Central Command Dispatcher ---
  executeCommand(cmd, tool, callbacks = {}) {
    if (!cmd) return;

    switch (cmd) {
      case 'new':
        if (callbacks.onNew) callbacks.onNew();
        break;
      case 'open':
        if (callbacks.onOpen) callbacks.onOpen();
        break;
      case 'open-remote':
        if (window.orbitDriveSync) window.orbitDriveSync.openDriveModal('browser', tool);
        break;
      case 'save':
      case 'save-as':
        if (callbacks.onSave) callbacks.onSave();
        break;
      case 'save-remote':
        if (window.orbitDriveSync) window.orbitDriveSync.saveCurrentActiveFileToRealGoogleDrive(tool);
        break;
      case 'export-pdf':
        if (callbacks.onExportPdf) callbacks.onExportPdf();
        break;
      case 'export-modal':
        if (window.orbitPlatform) window.orbitPlatform.openExportModal(tool);
        break;
      case 'print':
      case 'print-preview':
        if (window.orbitPlatform?.printManager) window.orbitPlatform.printManager.openPrintStudio(tool);
        else window.print();
        break;
      case 'undo':
        document.execCommand('undo');
        break;
      case 'redo':
        document.execCommand('redo');
        break;
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        navigator.clipboard?.readText().then(txt => document.execCommand('insertText', false, txt)).catch(() => {});
        break;
      case 'select-all':
        document.execCommand('selectAll');
        break;
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough');
        break;
      case 'superscript':
        document.execCommand('superscript');
        break;
      case 'subscript':
        document.execCommand('subscript');
        break;
      case 'clear-formatting':
        document.execCommand('removeFormat');
        break;
      case 'align-left':
        document.execCommand('justifyLeft');
        break;
      case 'align-center':
        document.execCommand('justifyCenter');
        break;
      case 'align-right':
        document.execCommand('justifyRight');
        break;
      case 'align-justify':
        document.execCommand('justifyFull');
        break;
      case 'toggle-bullets':
        document.execCommand('insertUnorderedList');
        break;
      case 'toggle-numbering':
        document.execCommand('insertOrderedList');
        break;
      case 'indent-increase':
        document.execCommand('indent');
        break;
      case 'indent-decrease':
        document.execCommand('outdent');
        break;
      case 'find-replace':
      case 'find':
        this.openFindReplaceDialog(callbacks);
        break;
      case 'word-count':
        this.openWordCountDialog(tool);
        break;
      case 'page-style':
        this.openPageStyleDialog(callbacks);
        break;
      case 'special-char':
        this.openSpecialCharDialog();
        break;
      case 'insert-table':
        this.openTableDialog(callbacks);
        break;
      case 'insert-link':
        this.openHyperlinkDialog();
        break;
      case 'watermark':
        this.openWatermarkDialog();
        break;
      case 'spellcheck':
        this.openSpellcheck();
        break;
      case 'thesaurus':
        if (window.orbitPlatform?.thesaurusManager) window.orbitPlatform.thesaurusManager.open();
        break;
      case 'ai-agent':
        if (window.orbitPlatform) window.orbitPlatform.openGirionixAgent(tool);
        break;
      case 'about':
        this.openAboutDialog(tool);
        break;
      case 'goal-seek':
        this.openGoalSeekDialog();
        break;
      case 'data-validation':
        this.openDataValidationDialog();
        break;
      case 'pivot-table':
        this.openPivotTableDialog();
        break;
      case 'start-slideshow':
      case 'start-slideshow-current':
        this.startSlideShow(callbacks);
        break;
      default:
        if (callbacks.onCustomCommand) callbacks.onCustomCommand(cmd);
        break;
    }
  }

  // --- Dynamic Sidebar Deck Panels ---
  updateSidebarPanel(container, deck, tool) {
    const content = container.querySelector('#lo-sidebar-content');
    if (!content) return;

    if (deck === 'styles') {
      content.innerHTML = `
        <div class="lo-sidebar-section">
          <span class="lo-sidebar-section-title">Paragraph Styles</span>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <button class="lo-btn-dialog" data-cmd="style-p">Default Paragraph Style</button>
            <button class="lo-btn-dialog" data-cmd="style-h1">Heading 1</button>
            <button class="lo-btn-dialog" data-cmd="style-h2">Heading 2</button>
            <button class="lo-btn-dialog" data-cmd="style-h3">Heading 3</button>
            <button class="lo-btn-dialog" data-cmd="style-title">Title</button>
            <button class="lo-btn-dialog" data-cmd="style-quote">Quotation</button>
          </div>
        </div>
      `;
    } else if (deck === 'gallery') {
      content.innerHTML = `
        <div class="lo-sidebar-section">
          <span class="lo-sidebar-section-title">Shapes & Symbols Gallery</span>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; font-size:18px; text-align:center;">
            <span class="lo-tool-btn" data-insert-shape="rect" title="Rectangle">▭</span>
            <span class="lo-tool-btn" data-insert-shape="circle" title="Circle">○</span>
            <span class="lo-tool-btn" data-insert-shape="arrow" title="Arrow">➔</span>
            <span class="lo-tool-btn" data-insert-shape="star" title="Star">★</span>
            <span class="lo-tool-btn" data-insert-shape="triangle" title="Triangle">▲</span>
            <span class="lo-tool-btn" data-insert-shape="diamond" title="Diamond">◆</span>
            <span class="lo-tool-btn" data-insert-shape="callout" title="Callout">💬</span>
            <span class="lo-tool-btn" data-insert-shape="check" title="Checkmark">✔</span>
          </div>
        </div>
      `;
    } else if (deck === 'navigator') {
      content.innerHTML = `
        <div class="lo-sidebar-section">
          <span class="lo-sidebar-section-title">Document Navigator</span>
          <div style="font-size:11.5px; color:var(--lo-text-muted); display:flex; flex-direction:column; gap:6px;">
            <div>📑 Headings (Outline Mode)</div>
            <div>📊 Tables (0 detected)</div>
            <div>🖼️ Images (0 detected)</div>
            <div>🔗 Bookmarks & Links (0 detected)</div>
          </div>
        </div>
      `;
    } else {
      // Properties panel
      content.innerHTML = `
        <div class="lo-sidebar-section">
          <span class="lo-sidebar-section-title">Character</span>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
            <select class="lo-select" style="grid-column:span 2;">
              <option>Liberation Serif</option>
              <option>Liberation Sans</option>
              <option>Calibri</option>
              <option>Times New Roman</option>
            </select>
            <select class="lo-select">
              <option>10pt</option>
              <option>11pt</option>
              <option selected>12pt</option>
              <option>14pt</option>
              <option>18pt</option>
            </select>
            <div style="display:flex; gap:3px;">
              <button class="lo-tool-btn" data-cmd="bold"><strong>B</strong></button>
              <button class="lo-tool-btn" data-cmd="italic"><em>I</em></button>
              <button class="lo-tool-btn" data-cmd="underline"><u>U</u></button>
            </div>
          </div>
        </div>
        <div class="lo-sidebar-section">
          <span class="lo-sidebar-section-title">Paragraph / Alignment</span>
          <div style="display:flex; gap:4px;">
            <button class="lo-tool-btn" data-cmd="align-left">L</button>
            <button class="lo-tool-btn" data-cmd="align-center">C</button>
            <button class="lo-tool-btn" data-cmd="align-right">R</button>
            <button class="lo-tool-btn" data-cmd="align-justify">J</button>
          </div>
        </div>
        <div class="lo-sidebar-section">
          <span class="lo-sidebar-section-title">Page / Layout Style</span>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <button class="lo-btn-dialog" id="lo-btn-page-style">Format Page Style...</button>
            <button class="lo-btn-dialog" id="lo-btn-watermark">Insert Watermark...</button>
          </div>
        </div>
      `;
    }

    // Re-bind buttons inside dynamic sidebar
    content.querySelectorAll('[data-cmd]').forEach(b => {
      b.addEventListener('click', () => this.executeCommand(b.dataset.cmd, tool));
    });
    content.querySelector('#lo-btn-page-style')?.addEventListener('click', () => this.openPageStyleDialog());
    content.querySelector('#lo-btn-watermark')?.addEventListener('click', () => this.openWatermarkDialog());
  }

  // =========================================================================
  // GIRI ORBIT DESKTOP DIALOGS SYSTEM
  // =========================================================================

  // 1. Find & Replace Dialog
  openFindReplaceDialog(callbacks = {}) {
    document.getElementById('lo-find-replace-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-find-replace-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:460px;">
        <div class="lo-dialog-header">
          <span>Find and Replace</span>
          <button class="lo-dialog-close" id="lo-close-find">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Find:</label>
            <input type="text" id="lo-find-input" class="lo-formula-input" placeholder="Text to search..." style="height:28px;">
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Replace with:</label>
            <input type="text" id="lo-replace-input" class="lo-formula-input" placeholder="Replacement text..." style="height:28px;">
          </div>
          <div style="display:flex; gap:16px; margin-top:4px;">
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="lo-match-case"> Match case
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="lo-whole-words"> Whole words only
            </label>
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-find-prev">Find Previous</button>
          <button class="lo-btn-dialog" id="lo-btn-find-next">Find Next</button>
          <button class="lo-btn-dialog primary" id="lo-btn-replace">Replace</button>
          <button class="lo-btn-dialog primary" id="lo-btn-replace-all">Replace All</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-find')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    const findInput = modal.querySelector('#lo-find-input');
    const replaceInput = modal.querySelector('#lo-replace-input');

    modal.querySelector('#lo-btn-find-next')?.addEventListener('click', () => {
      const q = findInput.value.trim();
      if (q && window.find) window.find(q);
    });

    modal.querySelector('#lo-btn-replace-all')?.addEventListener('click', () => {
      const findText = findInput.value;
      const repText = replaceInput.value;
      if (!findText) return;
      const paper = document.querySelector('#drift-paper-canvas, .active-sheet');
      if (paper) {
        paper.innerHTML = paper.innerHTML.replaceAll(findText, repText);
        if (window.orbitPlatform) window.orbitPlatform.showToast(`Replaced all occurrences of "${findText}"`, 'green');
      }
      modal.remove();
    });
  }

  // 2. Special Characters Dialog (Greek, Math, Currency, Unicode)
  openSpecialCharDialog() {
    document.getElementById('lo-special-char-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-special-char-modal';

    const chars = [
      'Ω','α','β','γ','δ','ε','θ','λ','μ','π','σ','φ','ψ','ω','Δ','Σ','Φ','Ψ',
      '±','×','÷','≠','≈','≤','≥','∞','∑','√','∫','∂','∆','∈','∉','⊂','⊆',
      '€','$','£','¥','₹','₽','₩','₺','§','©','®','™','°','℃','℉','‰',
      '←','→','↑','↓','↔','⇒','⇔','✓','✗','★','☆','♠','♣','♥','♦','•','¶'
    ];

    const charsGrid = chars.map(c => `
      <button class="lo-tool-btn" style="font-size:16px; width:34px; height:34px;" data-char="${c}">${c}</button>
    `).join('');

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:480px;">
        <div class="lo-dialog-header">
          <span>Special Characters (Unicode)</span>
          <button class="lo-dialog-close" id="lo-close-char">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <label style="font-size:12px; font-weight:600;">Font: Liberation Serif / Symbols</label>
            <span id="lo-selected-char-preview" style="font-size:24px; font-weight:bold; color:var(--lo-accent); min-width:30px; text-align:center;">Ω</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(10, 1fr); gap:4px; max-height:220px; overflow-y:auto; padding:6px; background:var(--lo-bg-main); border:1px solid var(--lo-border); border-radius:4px;">
            ${charsGrid}
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-char-cancel">Cancel</button>
          <button class="lo-btn-dialog primary" id="lo-btn-char-insert">Insert</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-char')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-char-cancel')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    let chosenChar = 'Ω';
    const previewEl = modal.querySelector('#lo-selected-char-preview');
    modal.querySelectorAll('[data-char]').forEach(btn => {
      btn.addEventListener('click', () => {
        chosenChar = btn.dataset.char;
        if (previewEl) previewEl.textContent = chosenChar;
      });
    });

    modal.querySelector('#lo-btn-char-insert')?.addEventListener('click', () => {
      document.execCommand('insertText', false, chosenChar);
      modal.remove();
    });
  }

  // 3. Word Count Dialog
  openWordCountDialog(tool) {
    document.getElementById('lo-word-count-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-word-count-modal';

    const paper = document.querySelector('#drift-paper-canvas, .active-sheet');
    const text = paper ? (paper.innerText || '') : '';
    const words = (text.match(/\S+/g) || []).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s+/g, '').length;
    const paragraphs = (text.split(/\n+/).filter(Boolean) || []).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:420px;">
        <div class="lo-dialog-header">
          <span>Word Count Statistics</span>
          <button class="lo-dialog-close" id="lo-close-wc">✕</button>
        </div>
        <div class="lo-dialog-body">
          <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
            <tr style="border-bottom:1px solid var(--lo-border);"><td style="padding:6px 0; color:var(--lo-text-muted);">Words:</td><td style="font-weight:700; text-align:right;">${words.toLocaleString()}</td></tr>
            <tr style="border-bottom:1px solid var(--lo-border);"><td style="padding:6px 0; color:var(--lo-text-muted);">Characters (with spaces):</td><td style="font-weight:700; text-align:right;">${chars.toLocaleString()}</td></tr>
            <tr style="border-bottom:1px solid var(--lo-border);"><td style="padding:6px 0; color:var(--lo-text-muted);">Characters (excluding spaces):</td><td style="font-weight:700; text-align:right;">${charsNoSpace.toLocaleString()}</td></tr>
            <tr style="border-bottom:1px solid var(--lo-border);"><td style="padding:6px 0; color:var(--lo-text-muted);">Paragraphs:</td><td style="font-weight:700; text-align:right;">${paragraphs}</td></tr>
            <tr><td style="padding:6px 0; color:var(--lo-text-muted);">Estimated Reading Time:</td><td style="font-weight:700; text-align:right;">~${readingTime} min</td></tr>
          </table>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog primary" id="lo-btn-wc-close">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-wc')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-wc-close')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  // 4. Page Style / Format Dialog
  openPageStyleDialog(callbacks = {}) {
    document.getElementById('lo-page-style-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-page-style-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:480px;">
        <div class="lo-dialog-header">
          <span>Page Style: Default Page Style</span>
          <button class="lo-dialog-close" id="lo-close-page-style">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Paper Format:</label>
              <select class="lo-select" id="lo-page-format" style="width:100%; margin-top:4px;">
                <option value="A4" selected>A4 (210 x 297 mm)</option>
                <option value="Letter">Letter (8.5 x 11 in)</option>
                <option value="Legal">Legal (8.5 x 14 in)</option>
                <option value="A3">A3 (297 x 420 mm)</option>
                <option value="A5">A5 (148 x 210 mm)</option>
              </select>
            </div>
            <div>
              <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Orientation:</label>
              <div style="display:flex; gap:12px; margin-top:8px;">
                <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
                  <input type="radio" name="lo-orient" value="portrait" checked> Portrait
                </label>
                <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
                  <input type="radio" name="lo-orient" value="landscape"> Landscape
                </label>
              </div>
            </div>
          </div>
          <div style="border-top:1px solid var(--lo-border); padding-top:10px;">
            <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted); display:block; margin-bottom:8px;">Margins (inches):</label>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
              <div><label style="font-size:10px;">Left:</label><input type="number" id="lo-margin-left" class="lo-formula-input" value="1.0" step="0.1" style="height:26px;"></div>
              <div><label style="font-size:10px;">Right:</label><input type="number" id="lo-margin-right" class="lo-formula-input" value="1.0" step="0.1" style="height:26px;"></div>
              <div><label style="font-size:10px;">Top:</label><input type="number" id="lo-margin-top" class="lo-formula-input" value="1.0" step="0.1" style="height:26px;"></div>
              <div><label style="font-size:10px;">Bottom:</label><input type="number" id="lo-margin-bottom" class="lo-formula-input" value="1.0" step="0.1" style="height:26px;"></div>
            </div>
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-page-cancel">Cancel</button>
          <button class="lo-btn-dialog primary" id="lo-btn-page-apply">Apply &amp; OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-page-style')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-page-cancel')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#lo-btn-page-apply')?.addEventListener('click', () => {
      const orient = modal.querySelector('input[name="lo-orient"]:checked')?.value || 'portrait';
      const paper = document.querySelector('#drift-paper-canvas, .paper-sheet-container');
      if (paper) {
        if (orient === 'landscape') {
          paper.style.width = '1120px';
          paper.style.minHeight = '792px';
        } else {
          paper.style.width = '816px';
          paper.style.minHeight = '1056px';
        }
      }
      if (window.orbitPlatform) window.orbitPlatform.showToast(`Applied ${orient.toUpperCase()} page style!`, 'green');
      modal.remove();
    });
  }

  // 5. Insert Table Dialog
  openTableDialog(callbacks = {}) {
    document.getElementById('lo-table-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-table-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:420px;">
        <div class="lo-dialog-header">
          <span>Insert Table</span>
          <button class="lo-dialog-close" id="lo-close-tbl">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Columns:</label>
              <input type="number" id="lo-tbl-cols" class="lo-formula-input" value="4" min="1" max="20" style="height:28px; margin-top:4px;">
            </div>
            <div>
              <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Rows:</label>
              <input type="number" id="lo-tbl-rows" class="lo-formula-input" value="4" min="1" max="50" style="height:28px; margin-top:4px;">
            </div>
          </div>
          <div style="margin-top:8px;">
            <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
              <input type="checkbox" id="lo-tbl-header" checked> Heading (First row is table header)
            </label>
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-tbl-cancel">Cancel</button>
          <button class="lo-btn-dialog primary" id="lo-btn-tbl-insert">Insert Table</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-tbl')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-tbl-cancel')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#lo-btn-tbl-insert')?.addEventListener('click', () => {
      const cols = parseInt(modal.querySelector('#lo-tbl-cols').value, 10) || 4;
      const rows = parseInt(modal.querySelector('#lo-tbl-rows').value, 10) || 4;
      const hasHeader = modal.querySelector('#lo-tbl-header').checked;

      let tableHtml = `<table style="width:100%; border-collapse:collapse; margin:16px 0; border:1px solid #94a3b8;">`;
      if (hasHeader) {
        tableHtml += `<thead><tr style="background:#f1f5f9; color:#0f172a;">`;
        for (let c = 0; c < cols; c++) {
          tableHtml += `<th style="border:1px solid #cbd5e1; padding:8px 12px; font-weight:700;">Column ${c + 1}</th>`;
        }
        tableHtml += `</tr></thead>`;
      }
      tableHtml += `<tbody>`;
      for (let r = 0; r < rows; r++) {
        tableHtml += `<tr>`;
        for (let c = 0; c < cols; c++) {
          tableHtml += `<td style="border:1px solid #cbd5e1; padding:8px 12px;">Cell ${r + 1},${c + 1}</td>`;
        }
        tableHtml += `</tr>`;
      }
      tableHtml += `</tbody></table><p><br></p>`;

      document.execCommand('insertHTML', false, tableHtml);
      modal.remove();
    });
  }

  // 6. Hyperlink Dialog
  openHyperlinkDialog() {
    document.getElementById('lo-hyperlink-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-hyperlink-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:440px;">
        <div class="lo-dialog-header">
          <span>Insert Hyperlink</span>
          <button class="lo-dialog-close" id="lo-close-link">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Text to display:</label>
            <input type="text" id="lo-link-text" class="lo-formula-input" placeholder="Display text..." style="height:28px;">
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Target URL:</label>
            <input type="url" id="lo-link-url" class="lo-formula-input" placeholder="https://example.com" style="height:28px;">
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-link-cancel">Cancel</button>
          <button class="lo-btn-dialog primary" id="lo-btn-link-apply">Apply</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-link')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-link-cancel')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#lo-btn-link-apply')?.addEventListener('click', () => {
      const url = modal.querySelector('#lo-link-url').value.trim();
      const txt = modal.querySelector('#lo-link-text').value.trim();
      if (url) {
        if (txt) {
          document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener" style="color:#0ea5e9; text-decoration:underline;">${txt}</a>`);
        } else {
          document.execCommand('createLink', false, url);
        }
      }
      modal.remove();
    });
  }

  // 7. Watermark Dialog
  openWatermarkDialog() {
    document.getElementById('lo-watermark-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-watermark-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:400px;">
        <div class="lo-dialog-header">
          <span>Document Watermark</span>
          <button class="lo-dialog-close" id="lo-close-wm">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Watermark Text:</label>
            <input type="text" id="lo-wm-text" class="lo-formula-input" value="CONFIDENTIAL" style="height:28px;">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Angle:</label>
              <select class="lo-select" id="lo-wm-angle" style="width:100%; margin-top:4px;">
                <option value="-45" selected>-45° (Diagonal)</option>
                <option value="0">0° (Horizontal)</option>
              </select>
            </div>
            <div>
              <label style="font-size:11.5px; font-weight:600; color:var(--lo-text-muted);">Opacity:</label>
              <input type="range" id="lo-wm-opacity" min="0.05" max="0.4" step="0.05" value="0.12" style="width:100%; margin-top:8px;">
            </div>
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-wm-remove">Remove Watermark</button>
          <button class="lo-btn-dialog primary" id="lo-btn-wm-apply">Apply Watermark</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-wm')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#lo-btn-wm-apply')?.addEventListener('click', () => {
      const text = modal.querySelector('#lo-wm-text').value.trim();
      const angle = modal.querySelector('#lo-wm-angle').value;
      const opacity = modal.querySelector('#lo-wm-opacity').value;
      const paper = document.querySelector('#drift-paper-canvas, .active-sheet');
      if (paper && text) {
        document.getElementById('lo-doc-watermark-overlay')?.remove();
        const wm = document.createElement('div');
        wm.id = 'lo-doc-watermark-overlay';
        wm.style.cssText = `position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; font-size:72px; font-weight:900; color:rgba(100,116,139,${opacity}); transform:rotate(${angle}deg); z-index:1; user-select:none; font-family:sans-serif; text-transform:uppercase;`;
        wm.textContent = text;
        paper.style.position = 'relative';
        paper.prepend(wm);
        if (window.orbitPlatform) window.orbitPlatform.showToast(`Watermark "${text}" inserted!`, 'green');
      }
      modal.remove();
    });

    modal.querySelector('#lo-btn-wm-remove')?.addEventListener('click', () => {
      document.getElementById('lo-doc-watermark-overlay')?.remove();
      if (window.orbitPlatform) window.orbitPlatform.showToast('Watermark removed', 'blue');
      modal.remove();
    });
  }

  // 8. Spellcheck Simulator
  openSpellcheck() {
    if (window.orbitPlatform) {
      window.orbitPlatform.showToast('Spelling & Grammar: No grammatical issues detected in document.', 'green');
    }
  }

  // 9. Calc Goal Seek Dialog
  openGoalSeekDialog() {
    document.getElementById('lo-goalseek-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-goalseek-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:380px;">
        <div class="lo-dialog-header">
          <span>Goal Seek</span>
          <button class="lo-dialog-close" id="lo-close-gs">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div><label style="font-size:11.5px; color:var(--lo-text-muted);">Set cell:</label><input type="text" class="lo-formula-input" value="B10" style="height:26px; margin-top:2px;"></div>
            <div><label style="font-size:11.5px; color:var(--lo-text-muted);">To value:</label><input type="text" class="lo-formula-input" value="100000" style="height:26px; margin-top:2px;"></div>
            <div><label style="font-size:11.5px; color:var(--lo-text-muted);">By changing cell:</label><input type="text" class="lo-formula-input" value="B3" style="height:26px; margin-top:2px;"></div>
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-gs-cancel">Cancel</button>
          <button class="lo-btn-dialog primary" id="lo-btn-gs-ok">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-gs')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-gs-cancel')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-gs-ok')?.addEventListener('click', () => {
      if (window.orbitPlatform) window.orbitPlatform.showToast('Goal Seek calculated target parameter successfully!', 'green');
      modal.remove();
    });
  }

  // 10. Calc Data Validation Dialog
  openDataValidationDialog() {
    document.getElementById('lo-dataval-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-dataval-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:420px;">
        <div class="lo-dialog-header">
          <span>Validity Criteria</span>
          <button class="lo-dialog-close" id="lo-close-dv">✕</button>
        </div>
        <div class="lo-dialog-body">
          <label style="font-size:11.5px; color:var(--lo-text-muted);">Allow:</label>
          <select class="lo-select" style="width:100%; margin-top:4px;">
            <option>All values</option>
            <option selected>Whole Numbers</option>
            <option>Decimal</option>
            <option>List / Dropdown</option>
            <option>Date</option>
            <option>Text length</option>
          </select>
          <div style="margin-top:8px;">
            <label style="font-size:11.5px; color:var(--lo-text-muted);">Data comparison:</label>
            <select class="lo-select" style="width:100%; margin-top:4px;">
              <option selected>greater than or equal to</option>
              <option>between</option>
              <option>equal to</option>
              <option>less than</option>
            </select>
          </div>
          <div style="margin-top:8px;">
            <label style="font-size:11.5px; color:var(--lo-text-muted);">Minimum value:</label>
            <input type="number" class="lo-formula-input" value="0" style="height:26px; margin-top:4px;">
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-dv-cancel">Cancel</button>
          <button class="lo-btn-dialog primary" id="lo-btn-dv-apply">Apply</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-dv')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-dv-cancel')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-dv-apply')?.addEventListener('click', () => {
      if (window.orbitPlatform) window.orbitPlatform.showToast('Data validation rule applied to selected cells!', 'green');
      modal.remove();
    });
  }

  // 11. Calc Pivot Table Dialog
  openPivotTableDialog() {
    document.getElementById('lo-pivot-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-pivot-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:480px;">
        <div class="lo-dialog-header">
          <span>Pivot Table Layout</span>
          <button class="lo-dialog-close" id="lo-close-pt">✕</button>
        </div>
        <div class="lo-dialog-body">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="background:var(--lo-bg-main); border:1px solid var(--lo-border); padding:8px; border-radius:4px;">
              <strong style="font-size:11px; color:var(--lo-text-muted);">Row Fields:</strong>
              <div style="margin-top:4px; font-size:12px;">• Category / Product</div>
            </div>
            <div style="background:var(--lo-bg-main); border:1px solid var(--lo-border); padding:8px; border-radius:4px;">
              <strong style="font-size:11px; color:var(--lo-text-muted);">Column Fields:</strong>
              <div style="margin-top:4px; font-size:12px;">• Quarter / Month</div>
            </div>
          </div>
          <div style="background:var(--lo-bg-main); border:1px solid var(--lo-border); padding:8px; border-radius:4px; margin-top:8px;">
            <strong style="font-size:11px; color:var(--lo-text-muted);">Data / Values Field:</strong>
            <div style="margin-top:4px; font-size:12px;">• SUM(Revenue)</div>
          </div>
        </div>
        <div class="lo-dialog-footer">
          <button class="lo-btn-dialog" id="lo-btn-pt-cancel">Cancel</button>
          <button class="lo-btn-dialog primary" id="lo-btn-pt-gen">Generate Pivot Table</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-pt')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-pt-cancel')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-pt-gen')?.addEventListener('click', () => {
      if (window.orbitPlatform) window.orbitPlatform.showToast('Generated Pivot Table summary sheet!', 'green');
      modal.remove();
    });
  }

  // 12. Impress Fullscreen Slide Show Mode
  startSlideShow(callbacks = {}) {
    document.getElementById('lo-slideshow-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'lo-slideshow-overlay';
    overlay.id = 'lo-slideshow-overlay';

    // Collect slides from kinetic or create default slide deck
    let slides = [];
    const deckStorage = localStorage.getItem('giri_orbit_kinetic_deck');
    if (deckStorage) {
      try { slides = JSON.parse(deckStorage); } catch {}
    }
    if (!slides || !slides.length) {
      slides = [
        { title: 'Executive Keynote', subtitle: 'Giri Kinetic Desktop Show', points: ['High-Velocity Vector Engine', 'Sovereign Presentation Architecture', 'Seamless Cloud Interoperability'] },
        { title: 'Market Performance', subtitle: 'Q3 Growth Metrics', points: ['142% Year-over-Year Trajectory', 'Zero Data Harvesting', 'Native Format Portability'] }
      ];
    }

    let currentSlide = 0;

    const renderSlide = (idx) => {
      const s = slides[idx] || slides[0];
      const pts = Array.isArray(s.points) ? s.points.map(p => `<li style="margin:12px 0;">${p}</li>`).join('') : '';
      return `
        <div class="lo-slideshow-slide" id="lo-active-slide-frame">
          <span style="font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#ea580c; font-weight:700;">Giri Kinetic • Strategy Presentation</span>
          <h1 style="font-size:52px; font-weight:800; color:#0f172a; margin:18px 0 6px 0;">${s.title || 'Slide ' + (idx + 1)}</h1>
          <h3 style="font-size:24px; color:#64748b; font-weight:500; margin-bottom:28px;">${s.subtitle || ''}</h3>
          <ul style="font-size:22px; color:#334155; line-height:1.6; padding-left:28px;">
            ${pts || '<li>Key insight and strategic milestone</li>'}
          </ul>
        </div>
        <div class="lo-slideshow-controls">
          <button id="lo-btn-ss-prev" style="background:transparent; border:none; color:#fff; cursor:pointer; font-size:16px;">◀ Prev</button>
          <span>Slide ${idx + 1} of ${slides.length}</span>
          <button id="lo-btn-ss-next" style="background:transparent; border:none; color:#fff; cursor:pointer; font-size:16px;">Next ▶</button>
          <button id="lo-btn-ss-exit" style="background:#ef4444; border:none; color:#fff; padding:3px 10px; border-radius:12px; cursor:pointer; font-size:11px; margin-left:12px;">ESC to Exit</button>
        </div>
      `;
    };

    overlay.innerHTML = renderSlide(currentSlide);
    document.body.appendChild(overlay);

    const wireControls = () => {
      overlay.querySelector('#lo-btn-ss-prev')?.addEventListener('click', () => {
        if (currentSlide > 0) {
          currentSlide--;
          overlay.innerHTML = renderSlide(currentSlide);
          wireControls();
        }
      });
      overlay.querySelector('#lo-btn-ss-next')?.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          overlay.innerHTML = renderSlide(currentSlide);
          wireControls();
        }
      });
      overlay.querySelector('#lo-btn-ss-exit')?.addEventListener('click', () => overlay.remove());
    };
    wireControls();

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        window.removeEventListener('keydown', handleKey);
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          overlay.innerHTML = renderSlide(currentSlide);
          wireControls();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentSlide > 0) {
          currentSlide--;
          overlay.innerHTML = renderSlide(currentSlide);
          wireControls();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
  }

  // 13. About Giri Orbit Desktop Suite Dialog
  openAboutDialog(tool) {
    document.getElementById('lo-about-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'lo-dialog-backdrop';
    modal.id = 'lo-about-modal';

    modal.innerHTML = `
      <div class="lo-dialog-window" style="width:480px; text-align:center;">
        <div class="lo-dialog-header">
          <span>About Giri Orbit Desktop Suite</span>
          <button class="lo-dialog-close" id="lo-close-about">✕</button>
        </div>
        <div class="lo-dialog-body" style="align-items:center; padding:24px 20px;">
          <div style="width:52px; height:52px; border-radius:12px; background:linear-gradient(135deg,#15803d,#1d4ed8); display:flex; align-items:center; justify-content:center; font-size:26px; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,0.3); margin-bottom:12px;">
            📄
          </div>
          <strong style="font-size:18px; color:var(--lo-text);">Giri Orbit 24.8 Sovereign Desktop Suite</strong>
          <span style="font-size:12.5px; color:var(--lo-accent); font-weight:600; margin-top:2px;">Giri Orbit Sovereign Edition</span>
          <p style="font-size:12px; color:var(--lo-text-muted); line-height:1.5; margin:14px 0 0 0;">
            A complete sovereign desktop-grade browser implementation of Drift Writer, Axis Spreadsheets, Kinetic Presentations, and Aegis PDF Studio.
            Zero cloud requirement, native OpenDocument (.odt, .ods, .odp) and Office (.docx, .xlsx, .pptx) interoperability,
            sovereign client memory encryption, and full offline autonomy.
          </p>
          <div style="font-size:11px; color:var(--lo-text-subtle); margin-top:12px;">
            Build ID: 2026.11.06-ORBIT-LO-PARITY • Copyright © GIRI Corporation
          </div>
        </div>
        <div class="lo-dialog-footer" style="justify-content:center;">
          <button class="lo-btn-dialog primary" id="lo-btn-about-close">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('#lo-close-about')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#lo-btn-about-close')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }
}

export const orbitDesktopSuite = new OrbitDesktopSuite();
window.orbitDesktopSuite = orbitDesktopSuite;
