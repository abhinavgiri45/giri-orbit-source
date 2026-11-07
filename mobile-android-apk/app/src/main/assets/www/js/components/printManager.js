/**
 * ============================================================================
 * GIRI ORBIT — SOVEREIGN PRINT STUDIO & ENGINE (printManager.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * ============================================================================
 * Provides an authentic Office Print Experience:
 * - Interactive WYSIWYG Print Studio Dialog with live paper page preview
 * - Print settings: Destination, Copies, Page Range, Orientation, Paper Size, Margins, Scale
 * - Instant Vector PDF Download or formatted System Print
 * - Intercepts Ctrl+P across all tools to open the Print Studio
 */

export class PrintStudioManager {
  constructor(appInstance) {
    this.app = appInstance;
    this.activeSettings = {
      destination: 'printer',
      copies: 1,
      range: 'all',
      customRange: '1',
      orientation: 'portrait',
      paperSize: 'a4',
      margins: 'normal',
      scale: 'fit'
    };
    this.currentPage = 1;
    this.totalPages = 1;
    this.initGlobalListener();
  }

  initGlobalListener() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        this.open();
      }
    });
  }

  open(toolName = null) {
    const activeTool = toolName || (this.app ? this.app.currentView : 'drift');
    this.activeTool = activeTool;
    this.currentPage = 1;
    this.renderModal();
  }

  close() {
    const backdrop = document.getElementById('orbit-print-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      setTimeout(() => backdrop.remove(), 200);
    }
  }

  renderModal() {
    let existing = document.getElementById('orbit-print-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'print-modal-backdrop open';
    backdrop.id = 'orbit-print-modal-backdrop';

    const toolTitles = {
      drift: 'Giri Drift Document',
      axis: 'Giri Axis Spreadsheet',
      kinetic: 'Giri Kinetic Presentation Deck',
      pdf: 'Giri Aegis PDF Document'
    };
    const title = toolTitles[this.activeTool] || 'Giri Orbit Document';

    backdrop.innerHTML = `
      <div class="print-modal-window" role="dialog" aria-modal="true" aria-label="Print Document">
        <!-- Top Bar -->
        <div class="print-modal-header">
          <div class="print-header-left">
            <div class="print-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
            </div>
            <div>
              <h2 class="print-header-title">Print — ${title}</h2>
              <span class="print-header-subtitle">High-Fidelity Vector Print Engine</span>
            </div>
          </div>
          <button class="print-modal-close" id="btn-close-print-modal" title="Close (Esc)">✕</button>
        </div>

        <!-- Body: Left Settings + Right Live Preview -->
        <div class="print-modal-body">
          <!-- Left: Settings Form -->
          <div class="print-settings-pane">
            <!-- Printer / Destination -->
            <div class="print-setting-group">
              <label class="print-label">Destination</label>
              <select class="print-select" id="print-destination">
                <option value="printer" selected>System Default Printer</option>
                <option value="pdf">Save as PDF (Vector Document)</option>
              </select>
            </div>

            <!-- Copies -->
            <div class="print-setting-group">
              <label class="print-label">Copies</label>
              <div class="print-stepper">
                <button type="button" class="print-stepper-btn" id="btn-copy-dec">-</button>
                <input type="number" class="print-stepper-input" id="print-copies" value="1" min="1" max="99">
                <button type="button" class="print-stepper-btn" id="btn-copy-inc">+</button>
              </div>
            </div>

            <!-- Pages / Range -->
            <div class="print-setting-group">
              <label class="print-label">Pages</label>
              <div class="print-radio-group">
                <label class="print-radio"><input type="radio" name="print-range" value="all" checked> All Pages</label>
                <label class="print-radio"><input type="radio" name="print-range" value="current"> Current Page</label>
                <label class="print-radio"><input type="radio" name="print-range" value="custom"> Custom</label>
              </div>
              <input type="text" class="print-input" id="print-custom-range" placeholder="e.g. 1-3, 5" style="display:none; margin-top:6px;">
            </div>

            <!-- Layout / Orientation -->
            <div class="print-setting-group">
              <label class="print-label">Orientation</label>
              <div class="print-pill-toggle">
                <button type="button" class="print-pill-btn active" id="btn-orient-portrait" data-orient="portrait">
                  <svg width="12" height="14" viewBox="0 0 12 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="10" height="14" rx="1"/></svg>
                  <span>Portrait</span>
                </button>
                <button type="button" class="print-pill-btn" id="btn-orient-landscape" data-orient="landscape">
                  <svg width="14" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="14" height="10" rx="1"/></svg>
                  <span>Landscape</span>
                </button>
              </div>
            </div>

            <!-- Paper Size -->
            <div class="print-setting-group">
              <label class="print-label">Paper Size</label>
              <select class="print-select" id="print-paper-size">
                <option value="a4" selected>A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
                <option value="legal">US Legal (8.5 × 14 in)</option>
                <option value="tabloid">Tabloid (11 × 17 in)</option>
              </select>
            </div>

            <!-- Margins -->
            <div class="print-setting-group">
              <label class="print-label">Margins</label>
              <select class="print-select" id="print-margins">
                <option value="normal" selected>Normal (1.0 inch / 25.4 mm)</option>
                <option value="narrow">Narrow (0.5 inch / 12.7 mm)</option>
                <option value="wide">Wide (2.0 inches / 50.8 mm)</option>
                <option value="none">Zero Margins (Edge-to-Edge)</option>
              </select>
            </div>

            <!-- Scale -->
            <div class="print-setting-group">
              <label class="print-label">Scale</label>
              <select class="print-select" id="print-scale">
                <option value="fit" selected>Fit to Printable Page</option>
                <option value="100">100% (Actual Size)</option>
                <option value="80">80% (Compact)</option>
              </select>
            </div>
          </div>

          <!-- Right: Interactive Live Paper Preview -->
          <div class="print-preview-pane">
            <div class="print-preview-header">
              <span class="preview-zoom-tag">WYSIWYG Live Paper Preview</span>
              <div class="preview-page-stepper">
                <button type="button" class="preview-step-btn" id="btn-prev-page" title="Previous Page">‹</button>
                <span id="preview-page-indicator">Page 1 of 1</span>
                <button type="button" class="preview-step-btn" id="btn-next-page" title="Next Page">›</button>
              </div>
            </div>

            <div class="print-preview-stage" id="print-preview-stage">
              <!-- Rendered Paper Sheet -->
              <div class="print-paper-sheet" id="print-paper-sheet">
                <div class="print-paper-content" id="print-paper-content">
                  <!-- Injected live content from active tool -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="print-modal-footer">
          <div class="print-footer-info">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; margin-right:6px;"></span>
            <span>Print ready: Clean page breaks enabled. Toolbars and ribbons suppressed.</span>
          </div>
          <div class="print-footer-buttons">
            <button class="print-btn-secondary" id="btn-print-cancel">Cancel</button>
            <button class="print-btn-export-pdf" id="btn-print-export-pdf" title="Instantly save as PDF file">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Quick PDF</span>
            </button>
            <button class="print-btn-primary" id="btn-print-submit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span>Print Document</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    this.bindModalEvents(backdrop);
    this.updatePreviewContent();
  }

  updatePreviewContent() {
    const sheet = document.getElementById('print-paper-sheet');
    const contentBox = document.getElementById('print-paper-content');
    const indicator = document.getElementById('preview-page-indicator');
    if (!sheet || !contentBox) return;

    // Apply orientation
    sheet.className = `print-paper-sheet ${this.activeSettings.orientation}`;

    // Grab content according to active tool
    if (this.activeTool === 'drift') {
      const editor = document.querySelector('.drift-paper-sheet') || document.querySelector('#drift-editor');
      if (editor) {
        contentBox.innerHTML = editor.innerHTML;
      } else {
        contentBox.innerHTML = `
          <h1 style="font-size:24px; color:#0f172a; margin-bottom:12px;">Enterprise Strategic Document</h1>
          <p style="font-size:13px; line-height:1.8; color:#334155;">
            Giri Orbit sovereign document architecture delivers uncompromised client privacy and instantaneous zero-database execution.
          </p>
        `;
      }
      this.totalPages = 1;
    } else if (this.activeTool === 'axis') {
      const table = document.querySelector('.axis-grid-table');
      if (table) {
        contentBox.innerHTML = `
          <div style="font-family:sans-serif; margin-bottom:14px;">
            <h2 style="font-size:16px; margin:0 0 4px 0; color:#0f172a;">Giri Axis Financial Statement</h2>
            <span style="font-size:11px; color:#64748b;">Printed from Giri Orbit Sovereign Suite</span>
          </div>
          <div style="overflow-x:auto;">
            ${table.outerHTML}
          </div>
        `;
      } else {
        contentBox.innerHTML = `<h2>Axis Spreadsheet Preview</h2><p>Data grid ready for printing.</p>`;
      }
      this.totalPages = 1;
    } else if (this.activeTool === 'kinetic') {
      const slide = document.querySelector('.kinetic-stage-slide');
      if (slide) {
        contentBox.innerHTML = slide.innerHTML;
      } else {
        contentBox.innerHTML = `
          <div style="text-align:center; padding:40px;">
            <h1 style="font-size:28px; color:#0f172a;">Giri Kinetic Presentation</h1>
            <p style="color:#64748b;">Slide Handout Ready</p>
          </div>
        `;
      }
      this.totalPages = 1;
    } else if (this.activeTool === 'pdf') {
      const pdfPage = document.querySelector('.pdf-page-sheet');
      if (pdfPage) {
        contentBox.innerHTML = pdfPage.innerHTML;
      } else {
        contentBox.innerHTML = `<h2>Giri Aegis PDF Document</h2><p>Digitally sealed vector pages.</p>`;
      }
      this.totalPages = 1;
    }

    if (indicator) indicator.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
  }

  bindModalEvents(backdrop) {
    // Close button & backdrop click
    backdrop.querySelector('#btn-close-print-modal')?.addEventListener('click', () => this.close());
    backdrop.querySelector('#btn-print-cancel')?.addEventListener('click', () => this.close());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    // Orientation toggle
    const portBtn = backdrop.querySelector('#btn-orient-portrait');
    const landBtn = backdrop.querySelector('#btn-orient-landscape');
    portBtn?.addEventListener('click', () => {
      this.activeSettings.orientation = 'portrait';
      portBtn.classList.add('active');
      landBtn.classList.remove('active');
      this.updatePreviewContent();
    });
    landBtn?.addEventListener('click', () => {
      this.activeSettings.orientation = 'landscape';
      landBtn.classList.add('active');
      portBtn.classList.remove('active');
      this.updatePreviewContent();
    });

    // Destination change
    backdrop.querySelector('#print-destination')?.addEventListener('change', (e) => {
      this.activeSettings.destination = e.target.value;
      const submitBtn = backdrop.querySelector('#btn-print-submit');
      if (submitBtn) {
        submitBtn.innerHTML = e.target.value === 'pdf' ? `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Save as PDF</span>
        ` : `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          <span>Print Document</span>
        `;
      }
    });

    // Copies stepper
    const copiesInput = backdrop.querySelector('#print-copies');
    backdrop.querySelector('#btn-copy-dec')?.addEventListener('click', () => {
      let val = parseInt(copiesInput.value, 10) || 1;
      if (val > 1) copiesInput.value = val - 1;
    });
    backdrop.querySelector('#btn-copy-inc')?.addEventListener('click', () => {
      let val = parseInt(copiesInput.value, 10) || 1;
      if (val < 99) copiesInput.value = val + 1;
    });

    // Page range radios
    const customRangeInput = backdrop.querySelector('#print-custom-range');
    backdrop.querySelectorAll('input[name="print-range"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.activeSettings.range = e.target.value;
        if (customRangeInput) {
          customRangeInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
        }
      });
    });

    // Quick Vector PDF
    backdrop.querySelector('#btn-print-export-pdf')?.addEventListener('click', () => {
      this.close();
      if (this.app && this.app.exportActiveTool) {
        this.app.exportActiveTool('pdf');
      } else {
        window.print();
      }
    });

    // Main Print Submit
    backdrop.querySelector('#btn-print-submit')?.addEventListener('click', () => {
      if (this.activeSettings.destination === 'pdf') {
        this.close();
        if (this.app && this.app.exportActiveTool) {
          this.app.exportActiveTool('pdf');
        } else {
          window.print();
        }
      } else {
        this.close();
        // Allow modal DOM removal before triggering browser print
        setTimeout(() => {
          window.print();
        }, 150);
      }
    });
  }
}
