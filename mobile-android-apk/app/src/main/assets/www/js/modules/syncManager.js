/**
 * ============================================================================
 * GIRI ORBIT — SOVEREIGN BROWSER SYNC & STORAGE SYSTEM (syncManager.js)
 * By GIRI Corporation
 * ============================================================================
 * Features:
 * - 100% In-Memory & Browser LocalStorage Sovereign Persistence
 * - Auto-Sync on all inputs, edits, formulas, and presentations
 * - Multi-Tool Synced Registry (Drift Docs, Axis Sheets, Kinetic Show, Aegis PDF)
 * - Quick "Pick Up Where You Left Off" data hydration across Hub & Tool views
 * - Full Deletion & Reset Capabilities (individual document or full workspace purge)
 * - Interactive Browser Sync & Storage Manager Modal Dialog
 */

const TOOL_DEFAULTS = {
  drift: {
    tool: 'drift',
    toolName: 'Giri Drift',
    category: 'Writer',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    badgeText: 'D',
    defaultTitle: 'Enterprise Strategic Charter',
    defaultSnippet: 'Comprehensive sovereign document orchestration standard developed by GIRI Corporation.',
    defaultStats: '1,420 words • 8,940 chars',
    dataKey: 'giri_orbit_drift_doc',
    titleKey: 'giri_orbit_drift_title',
    timeKey: 'giri_orbit_drift_time',
    url: '#drift'
  },
  axis: {
    tool: 'axis',
    toolName: 'Giri Axis',
    category: 'Sheet',
    badgeColor: '#16a34a',
    badgeBg: '#f0fdf4',
    badgeText: 'A',
    defaultTitle: 'Capital & Revenue Matrix',
    defaultSnippet: 'Q1-Q4 capital deployment ledger, dynamic net runway analysis, and formula variance models.',
    defaultStats: '3 Sheets • 250 Data Cells • SUM/AVERAGE',
    dataKey: 'giri_orbit_axis_sheets',
    titleKey: 'giri_orbit_axis_title',
    timeKey: 'giri_orbit_axis_time',
    url: '#axis'
  },
  kinetic: {
    tool: 'kinetic',
    toolName: 'Giri Kinetic',
    category: 'Show',
    badgeColor: '#dc2626',
    badgeBg: '#fef2f2',
    badgeText: 'K',
    defaultTitle: 'Corporate Business Annual Report',
    defaultSnippet: 'Widescreen 16:9 executive presentation covering fiscal review, strategy roadmap, and ESG metrics.',
    defaultStats: '10 Slides • 16:9 Widescreen • Animations',
    dataKey: 'giri_orbit_kinetic_deck',
    titleKey: 'giri_orbit_kinetic_title',
    timeKey: 'giri_orbit_kinetic_time',
    url: '#kinetic'
  },
  pdf: {
    tool: 'pdf',
    toolName: 'Aegis PDF',
    category: 'PDF',
    badgeColor: '#ea580c',
    badgeBg: '#fff7ed',
    badgeText: 'Æ',
    defaultTitle: 'Certified Executive Memorandum',
    defaultSnippet: 'Official binding corporate authorization with SHA-256 digital verification and approved stamp.',
    defaultStats: '2 Pages • Approved Seal • PKI Signed',
    dataKey: 'giri_orbit_pdf_pages',
    titleKey: 'giri_orbit_pdf_title',
    timeKey: 'giri_orbit_pdf_time',
    url: '#pdf'
  }
};

class GiriSyncManager {
  constructor() {
    this.registryKey = 'giri_orbit_synced_registry';
    this.isAutoSyncEnabled = true;
    this.init();
  }

  init() {
    if (typeof localStorage === 'undefined') return;
    try {
      const existing = localStorage.getItem(this.registryKey);
      if (existing) {
        let registry = JSON.parse(existing);
        if (Array.isArray(registry)) {
          // Purge all mock uncustomized legacy items — ONLY keep real documents
          registry = registry.filter(r => r && r.customized === true && this.hasSavedWork(r.tool));
          localStorage.setItem(this.registryKey, JSON.stringify(registry));
        }
      } else {
        localStorage.setItem(this.registryKey, JSON.stringify([]));
      }
    } catch {}
  }

  /**
   * Save and synchronize tool state into browser storage
   */
  recordSync(tool, data, title = null, meta = {}) {
    const config = TOOL_DEFAULTS[tool];
    if (!config) return;

    const now = Date.now();
    try {
      if (data !== undefined && data !== null) {
        if (typeof data === 'string') {
          localStorage.setItem(config.dataKey, data);
        } else {
          localStorage.setItem(config.dataKey, JSON.stringify(data));
        }
      }
      if (title) {
        localStorage.setItem(config.titleKey, title);
      }
      localStorage.setItem(config.timeKey, String(now));
    } catch (e) {
      console.warn('[SyncManager] localStorage write error:', e);
    }

    // Update or create registry entry
    let registry = this.getRegistry();
    let entry = registry.find(r => r.tool === tool);
    if (!entry) {
      entry = { tool };
      registry.push(entry);
    }

    entry.title = title || entry.title || config.defaultTitle;
    entry.updatedAt = now;
    entry.customized = true;

    if (meta.snippet) entry.snippet = meta.snippet;
    if (meta.stats) entry.stats = meta.stats;

    try {
      localStorage.setItem(this.registryKey, JSON.stringify(registry));
    } catch {}

    // Update live indicators in DOM
    this.pulseSyncIndicators(tool);

    // Notify window listeners
    window.dispatchEvent(new CustomEvent('orbit:sync-change', {
      detail: { tool, title: entry.title, time: now }
    }));
  }

  /**
   * Check if tool has non-empty real user-saved work in browser
   */
  hasSavedWork(tool) {
    const config = TOOL_DEFAULTS[tool];
    if (!config) return false;
    const raw = localStorage.getItem(config.dataKey);
    if (!raw) return false;
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '[]' || trimmed === '{}' || trimmed === '<p><br></p>' || trimmed === '<p></p>') return false;

    // Check registry: if explicitly marked customized === false, it's mock
    const registry = this.getRegistry();
    const entry = registry.find(r => r.tool === tool);
    if (entry && entry.customized === false) return false;

    if (tool === 'drift') {
      const text = trimmed.replace(/<[^>]*>/g, ' ').trim();
      if (!text || text.length < 5) return false;
    } else if (tool === 'axis') {
      try {
        const parsed = JSON.parse(trimmed);
        const sheets = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' ? Object.values(parsed) : []);
        let cellCount = 0;
        sheets.forEach(s => {
          if (s && s.data && typeof s.data === 'object') {
            cellCount += Object.keys(s.data).length;
          } else if (Array.isArray(s)) {
            cellCount += s.length;
          } else if (typeof s === 'object' && s) {
            cellCount += Object.keys(s).length;
          }
        });
        if (cellCount === 0) return false;
      } catch {
        return false;
      }
    } else if (tool === 'kinetic') {
      try {
        const parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed) || parsed.length === 0) return false;
        if (!entry || entry.customized !== true) return false;
      } catch {
        return false;
      }
    } else if (tool === 'pdf') {
      try {
        const parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed) || parsed.length === 0) return false;
        if (!entry || entry.customized !== true) return false;
      } catch {
        return false;
      }
    }

    return true;
  }

  /**
   * Get sync metadata for a specific tool (returns null if no real user-saved work)
   */
  getToolSyncInfo(tool) {
    const config = TOOL_DEFAULTS[tool];
    if (!config) return null;

    if (!this.hasSavedWork(tool)) return null;

    const registry = this.getRegistry();
    const entry = registry.find(r => r.tool === tool);
    if (!entry || entry.customized !== true) return null;

    const savedTitle = localStorage.getItem(config.titleKey);
    const savedTime = localStorage.getItem(config.timeKey);
    const rawData = localStorage.getItem(config.dataKey) || '';

    // Calculate smart stats based on real data
    let stats = entry.stats || config.defaultStats;
    const sizeKb = rawData ? (rawData.length / 1024).toFixed(1) : '0.0';

    if (tool === 'drift') {
      const text = rawData.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      const chars = text.length;
      stats = `${words.toLocaleString()} words • ${chars.toLocaleString()} chars • ${sizeKb} KB`;
    } else if (tool === 'axis') {
      try {
        const parsed = JSON.parse(rawData);
        const sheets = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' ? Object.values(parsed) : []);
        let cellCount = 0;
        sheets.forEach(s => {
          if (s && s.data && typeof s.data === 'object') {
            cellCount += Object.keys(s.data).length;
          } else if (Array.isArray(s)) {
            cellCount += s.length;
          } else if (typeof s === 'object' && s) {
            cellCount += Object.keys(s).length;
          }
        });
        const sheetCount = sheets.length || 1;
        stats = `${sheetCount} ${sheetCount === 1 ? 'Sheet' : 'Sheets'} • ${cellCount} Cells • ${sizeKb} KB`;
      } catch (e) {
        stats = `${config.defaultStats} • ${sizeKb} KB`;
      }
    } else if (tool === 'kinetic') {
      try {
        const parsed = JSON.parse(rawData);
        const slides = Array.isArray(parsed) ? parsed : [];
        stats = `${slides.length} ${slides.length === 1 ? 'Slide' : 'Slides'} • 16:9 Widescreen • ${sizeKb} KB`;
      } catch (e) {
        stats = `${config.defaultStats} • ${sizeKb} KB`;
      }
    } else if (tool === 'pdf') {
      try {
        const parsed = JSON.parse(rawData);
        const pages = Array.isArray(parsed) ? parsed : [];
        stats = `${pages.length} ${pages.length === 1 ? 'Page' : 'Pages'} • PKI Validated • ${sizeKb} KB`;
      } catch (e) {
        stats = `${config.defaultStats} • ${sizeKb} KB`;
      }
    }

    return {
      tool,
      toolName: config.toolName,
      category: config.category,
      badgeColor: config.badgeColor,
      badgeBg: config.badgeBg,
      badgeText: config.badgeText,
      url: config.url,
      title: savedTitle || entry.title || 'Untitled Document',
      snippet: entry.snippet || 'Sovereign saved document in Giri Orbit.',
      stats: stats,
      updatedAt: savedTime ? parseInt(savedTime, 10) : (entry.updatedAt || Date.now()),
      hasSavedData: true
    };
  }

  /**
   * Rename a saved document for a specific tool
   */
  renameSyncedWork(tool, newTitle) {
    const config = TOOL_DEFAULTS[tool];
    if (!config || !newTitle) return false;

    try {
      localStorage.setItem(config.titleKey, newTitle);
      let registry = this.getRegistry();
      let entry = registry.find(r => r.tool === tool);
      if (entry) {
        entry.title = newTitle;
        entry.updatedAt = Date.now();
        localStorage.setItem(this.registryKey, JSON.stringify(registry));
      }
    } catch (e) {
      console.warn('[SyncManager] Rename error:', e);
      return false;
    }

    window.dispatchEvent(new CustomEvent('orbit:sync-change', {
      detail: { tool, action: 'rename', title: newTitle }
    }));
    return true;
  }

  /**
   * Duplicate / clone a saved document for a specific tool
   */
  duplicateSyncedWork(tool, clonedTitle) {
    const config = TOOL_DEFAULTS[tool];
    if (!config) return false;

    try {
      const currentTitle = localStorage.getItem(config.titleKey) || config.defaultTitle;
      const title = clonedTitle || `${currentTitle} (Copy)`;
      const now = Date.now();

      localStorage.setItem(config.titleKey, title);
      localStorage.setItem(config.timeKey, now.toString());

      let registry = this.getRegistry();
      let entry = registry.find(r => r.tool === tool);
      if (entry) {
        entry.title = title;
        entry.updatedAt = now;
        localStorage.setItem(this.registryKey, JSON.stringify(registry));
      }
    } catch (e) {
      console.warn('[SyncManager] Duplicate error:', e);
      return false;
    }

    window.dispatchEvent(new CustomEvent('orbit:sync-change', {
      detail: { tool, action: 'duplicate', title: clonedTitle }
    }));
    return true;
  }

  /**
   * Get list of all synced items for the Recent Documents section
   */
  getAllSyncedWork() {
    const tools = ['drift', 'axis', 'kinetic', 'pdf'];
    const list = tools.map(t => this.getToolSyncInfo(t)).filter(Boolean);
    list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return list;
  }

  /**
   * Delete saved work for a specific tool from browser storage
   */
  deleteSyncedWork(tool) {
    const config = TOOL_DEFAULTS[tool];
    if (!config) return false;

    try {
      localStorage.removeItem(config.dataKey);
      localStorage.removeItem(config.titleKey);
      localStorage.removeItem(config.timeKey);

      let registry = this.getRegistry();
      registry = registry.filter(r => r.tool !== tool);
      localStorage.setItem(this.registryKey, JSON.stringify(registry));
    } catch (e) {
      console.warn('[SyncManager] Delete error:', e);
    }

    if (window.orbitPlatform && window.orbitPlatform.showToast) {
      window.orbitPlatform.showToast(`Deleted saved ${config.toolName} work from browser storage`, 'red');
    }

    window.dispatchEvent(new CustomEvent('orbit:sync-change', {
      detail: { tool, action: 'delete' }
    }));

    return true;
  }

  /**
   * Clear all synced work across all tools
   */
  clearAllSyncedWork() {
    ['drift', 'axis', 'kinetic', 'pdf'].forEach(tool => {
      const config = TOOL_DEFAULTS[tool];
      if (config) {
        localStorage.removeItem(config.dataKey);
        localStorage.removeItem(config.titleKey);
        localStorage.removeItem(config.timeKey);
      }
    });

    try {
      localStorage.removeItem(this.registryKey);
    } catch {}

    if (window.orbitPlatform && window.orbitPlatform.showToast) {
      window.orbitPlatform.showToast('Cleared all browser-synced work across Giri Orbit', 'red');
    }

    window.dispatchEvent(new CustomEvent('orbit:sync-change', {
      detail: { action: 'clearAll' }
    }));

    return true;
  }

  /**
   * Calculate browser storage usage
   */
  getStorageUsage() {
    let totalChars = 0;
    const tools = ['drift', 'axis', 'kinetic', 'pdf'];
    const toolSizes = {};

    tools.forEach(t => {
      const config = TOOL_DEFAULTS[t];
      const data = localStorage.getItem(config.dataKey) || '';
      toolSizes[t] = (data.length / 1024).toFixed(1) + ' KB';
      totalChars += data.length;
    });

    const totalKb = (totalChars / 1024).toFixed(1);
    return {
      total: totalKb + ' KB',
      toolSizes
    };
  }

  /**
   * Convert timestamp to human-friendly relative time
   */
  formatTimeAgo(timestamp) {
    if (!timestamp) return 'Recently';
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));

    if (diffSec < 45) return 'Just now';
    if (diffSec < 3600) {
      const m = Math.floor(diffSec / 60);
      return `${m}m ago`;
    }
    if (diffSec < 86400) {
      const h = Math.floor(diffSec / 3600);
      return `${h}h ago`;
    }
    if (diffSec < 172800) return 'Yesterday';
    const d = Math.floor(diffSec / 86400);
    return `${d}d ago`;
  }

  /**
   * Visual feedback for sync pills
   */
  pulseSyncIndicators(tool) {
    const headerPillText = document.getElementById('txt-global-sync');
    const headerDot = document.querySelector('.sync-dot-live');
    if (headerPillText) {
      headerPillText.textContent = 'Synced';
    }
    if (headerDot) {
      headerDot.classList.add('syncing');
      setTimeout(() => headerDot.classList.remove('syncing'), 600);
    }

    const toolSyncText = document.getElementById(`txt-${tool}-sync-status`);
    if (toolSyncText) {
      toolSyncText.textContent = '🟢 Synced';
      setTimeout(() => {
        if (toolSyncText) toolSyncText.textContent = 'Synced to Browser';
      }, 2000);
    }
  }

  getRegistry() {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.registryKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Render or open the Browser Sync & Storage Manager Modal
   */
  openStorageModal() {
    let modalBackdrop = document.getElementById('orbit-sync-modal-backdrop');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'sync-modal-backdrop';
      modalBackdrop.id = 'orbit-sync-modal-backdrop';
      document.body.appendChild(modalBackdrop);
    }

    const items = this.getAllSyncedWork();
    const usage = this.getStorageUsage();

    modalBackdrop.innerHTML = `
      <div class="sync-modal-card" role="dialog" aria-modal="true">
        <div class="sync-modal-header">
          <div class="sync-modal-title-wrap">
            <span style="font-size:18px;">🔄</span>
            <div>
              <div class="sync-modal-title">Browser Sync &amp; Storage Manager</div>
              <div class="sync-modal-sub">100% In-Memory Browser Storage • Zero Cloud Tracking</div>
            </div>
          </div>
          <button class="esc-kbd" id="btn-close-sync-modal-top">ESC</button>
        </div>

        <div class="sync-modal-body">
          <div class="sync-storage-overview">
            <div>
              <div class="sync-meter-title">Browser Storage Status: Active</div>
              <div class="sync-meter-desc">All edits, slides, and sheets auto-sync continuously to this browser.</div>
            </div>
            <div class="sync-storage-badge">
              <span class="sync-dot-live"></span>
              <span>${usage.total} Used</span>
            </div>
          </div>

          <div style="font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:10px;">
            Saved Work Sessions (Pick up where you left off)
          </div>

          <div class="sync-items-list" id="sync-modal-items-list">
            ${items.map(item => `
              <div class="sync-item-row" data-tool="${item.tool}">
                <div class="sync-item-info">
                  <div class="sync-tool-badge" style="background:${item.badgeColor};">
                    ${item.badgeText}
                  </div>
                  <div>
                    <div class="sync-tool-title">${item.title}</div>
                    <div class="sync-tool-meta">
                      <span>${item.toolName}</span> • 
                      <span>Saved ${this.formatTimeAgo(item.updatedAt)}</span> • 
                      <span style="color:#64748b;">${usage.toolSizes[item.tool] || '0 KB'}</span>
                    </div>
                  </div>
                </div>
                <div class="sync-item-actions">
                  <button class="btn-sync-open" data-action="open" data-tool="${item.tool}">
                    ▶ Resume
                  </button>
                  <button class="btn-sync-delete" data-action="delete" data-tool="${item.tool}" title="Delete saved work from browser">
                    🗑 Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        </div>

        <div class="sync-modal-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn-clear-all-sync" id="btn-purge-all-sync" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; border-radius:6px; padding:7px 12px; font-weight:600; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Clear Browser Work...
            </button>
            <button class="btn-backup-sync" id="btn-backup-all-sync" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; border-radius:6px; padding:7px 12px; font-weight:600; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Backup JSON
            </button>
          </div>
          <button class="btn-close-sync-modal" id="btn-close-sync-modal-bottom">
            Done
          </button>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('open');

    // Attach listeners
    const close = () => modalBackdrop.classList.remove('open');
    modalBackdrop.querySelector('#btn-close-sync-modal-top')?.addEventListener('click', close);
    modalBackdrop.querySelector('#btn-close-sync-modal-bottom')?.addEventListener('click', close);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) close();
    });

    // Handle open/resume & delete actions inside modal
    modalBackdrop.querySelectorAll('.btn-sync-open').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        close();
        if (window.orbitPlatform && window.orbitPlatform.navigateTo) {
          window.orbitPlatform.navigateTo(tool);
        } else {
          window.location.hash = `#${tool}`;
        }
      });
    });

    modalBackdrop.querySelectorAll('.btn-sync-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        const config = TOOL_DEFAULTS[tool];
        if (confirm(`Delete saved ${config?.toolName || tool} work from browser storage? This will clear your draft.`)) {
          this.deleteSyncedWork(tool);
          // Re-render modal list
          this.openStorageModal();
        }
      });
    });

    modalBackdrop.querySelector('#btn-backup-all-sync')?.addEventListener('click', () => {
      this.exportBackupJson();
    });

    modalBackdrop.querySelector('#btn-purge-all-sync')?.addEventListener('click', () => {
      this.openClearStorageDialog(() => {
        this.openStorageModal();
      });
    });
  }

  /**
   * Export all browser work to a JSON file
   */
  exportBackupJson() {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      registry: this.getRegistry(),
      tools: {}
    };

    ['drift', 'axis', 'kinetic', 'pdf'].forEach(tool => {
      const config = TOOL_DEFAULTS[tool];
      if (config) {
        backup.tools[tool] = {
          title: localStorage.getItem(config.titleKey) || '',
          data: localStorage.getItem(config.dataKey) || '',
          time: localStorage.getItem(config.timeKey) || ''
        };
      }
    });

    const templates = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.includes('custom_templates') || k.startsWith('giri_orbit_'))) {
        templates[k] = localStorage.getItem(k);
      }
    }
    backup.templates = templates;

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giri_orbit_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);

    if (window.orbitPlatform && window.orbitPlatform.showToast) {
      window.orbitPlatform.showToast('Downloaded complete workspace backup (.json)', 'violet');
    }
  }

  /**
   * Dedicated Granular Cleanup Dialog
   */
  openClearStorageDialog(onComplete) {
    let dialogBackdrop = document.getElementById('orbit-cleanup-dialog-backdrop');
    if (!dialogBackdrop) {
      dialogBackdrop = document.createElement('div');
      dialogBackdrop.id = 'orbit-cleanup-dialog-backdrop';
      dialogBackdrop.className = 'office-modal-backdrop';
      dialogBackdrop.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.65);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
      document.body.appendChild(dialogBackdrop);
    }

    const usage = this.getStorageUsage();

    dialogBackdrop.innerHTML = `
      <div class="office-dialog-card" role="dialog" aria-modal="true" style="background:#ffffff;border-radius:12px;width:480px;max-width:100%;box-shadow:0 20px 48px rgba(0,0,0,0.25);overflow:hidden;border:1px solid #e2e8f0;font-family:var(--font-sans);">
        <div style="background:#fef2f2;border-bottom:1px solid #fee2e2;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:20px;background:#fee2e2;padding:6px;border-radius:8px;">⚠️</span>
            <div>
              <div style="font-size:15px;font-weight:700;color:#991b1b;">Clear Browser Storage</div>
              <div style="font-size:11.5px;color:#b91c1c;">Reset local in-memory drafts & free browser cache</div>
            </div>
          </div>
          <button id="btn-close-cleanup-dialog" style="background:none;border:none;font-size:16px;color:#991b1b;cursor:pointer;padding:4px 8px;border-radius:4px;">✕</button>
        </div>

        <div style="padding:20px;display:flex;flex-direction:column;gap:14px;font-size:13px;color:#334155;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:12px;font-weight:700;color:#0f172a;">Current Storage Utilized</div>
              <div style="font-size:11px;color:#64748b;">Drift: ${usage.toolSizes.drift || '0 KB'} • Axis: ${usage.toolSizes.axis || '0 KB'} • Kinetic: ${usage.toolSizes.kinetic || '0 KB'} • PDF: ${usage.toolSizes.pdf || '0 KB'}</div>
            </div>
            <span style="background:#dbeafe;color:#1e40af;font-size:12px;font-weight:700;padding:3px 8px;border-radius:12px;">${usage.total}</span>
          </div>

          <div style="font-size:12px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;">Select what to delete:</div>

          <div style="display:flex;flex-direction:column;gap:8px;">
            <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;background:#f8fafc;">
              <input type="radio" name="cleanup-scope" value="all" checked style="cursor:pointer;accent-color:#dc2626;">
              <div>
                <strong style="color:#0f172a;display:block;">All Work Sessions (Full Reset)</strong>
                <span style="font-size:11px;color:#64748b;">Deletes all saved drafts across Drift, Axis, Kinetic, and PDF Studio.</span>
              </div>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;">
              <input type="radio" name="cleanup-scope" value="drift" style="cursor:pointer;accent-color:#2563eb;">
              <div>
                <strong style="color:#0f172a;display:block;">Drift Documents Only (${usage.toolSizes.drift || '0 KB'})</strong>
                <span style="font-size:11px;color:#64748b;">Clears only document drafts; keeps spreadsheets & presentations.</span>
              </div>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;">
              <input type="radio" name="cleanup-scope" value="axis" style="cursor:pointer;accent-color:#16a34a;">
              <div>
                <strong style="color:#0f172a;display:block;">Axis Spreadsheets Only (${usage.toolSizes.axis || '0 KB'})</strong>
                <span style="font-size:11px;color:#64748b;">Clears financial sheets; keeps other work intact.</span>
              </div>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;">
              <input type="radio" name="cleanup-scope" value="kinetic" style="cursor:pointer;accent-color:#ea580c;">
              <div>
                <strong style="color:#0f172a;display:block;">Kinetic Presentations Only (${usage.toolSizes.kinetic || '0 KB'})</strong>
                <span style="font-size:11px;color:#64748b;">Clears slide decks; keeps documents & sheets.</span>
              </div>
            </label>
            <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;">
              <input type="radio" name="cleanup-scope" value="pdf" style="cursor:pointer;accent-color:#dc2626;">
              <div>
                <strong style="color:#0f172a;display:block;">PDF Studio Annotations (${usage.toolSizes.pdf || '0 KB'})</strong>
                <span style="font-size:11px;color:#64748b;">Clears marked PDFs & seals; keeps documents.</span>
              </div>
            </label>
          </div>

          <div style="padding:10px 12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="cleanup-download-backup" checked style="cursor:pointer;accent-color:#16a34a;">
            <label for="cleanup-download-backup" style="font-size:11.5px;color:#166534;cursor:pointer;font-weight:600;">
              Download JSON Backup file before deleting (Safely preserve my work)
            </label>
          </div>
        </div>

        <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:12px 20px;display:flex;justify-content:flex-end;gap:10px;">
          <button id="btn-cancel-cleanup" style="background:#ffffff;border:1px solid #cbd5e1;color:#475569;border-radius:6px;padding:8px 16px;font-size:12.5px;font-weight:600;cursor:pointer;">
            Cancel
          </button>
          <button id="btn-confirm-cleanup" style="background:#dc2626;border:none;color:#ffffff;border-radius:6px;padding:8px 18px;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;">
            <span>🗑️</span> Confirm Cleanup
          </button>
        </div>
      </div>
    `;

    dialogBackdrop.style.display = 'flex';

    const closeCleanup = () => { dialogBackdrop.style.display = 'none'; };
    dialogBackdrop.querySelector('#btn-close-cleanup-dialog')?.addEventListener('click', closeCleanup);
    dialogBackdrop.querySelector('#btn-cancel-cleanup')?.addEventListener('click', closeCleanup);

    dialogBackdrop.querySelector('#btn-confirm-cleanup')?.addEventListener('click', () => {
      const scope = dialogBackdrop.querySelector('input[name="cleanup-scope"]:checked')?.value || 'all';
      const doBackup = dialogBackdrop.querySelector('#cleanup-download-backup')?.checked;

      if (doBackup) {
        this.exportBackupJson();
      }

      this.cacheDeletedSnapshot(scope);

      if (scope === 'all') {
        this.clearAllSyncedWork();
      } else {
        this.deleteSyncedWork(scope);
      }

      closeCleanup();
      if (typeof onComplete === 'function') onComplete();

      this.showUndoToast(scope);
    });
  }

  cacheDeletedSnapshot(scope) {
    try {
      this._lastUndoSnapshot = {
        scope,
        time: Date.now(),
        data: {}
      };
      const keysToSave = scope === 'all' ? ['drift', 'axis', 'kinetic', 'pdf'] : [scope];
      keysToSave.forEach(tool => {
        const config = TOOL_DEFAULTS[tool];
        if (config) {
          this._lastUndoSnapshot.data[tool] = {
            data: localStorage.getItem(config.dataKey),
            title: localStorage.getItem(config.titleKey),
            time: localStorage.getItem(config.timeKey)
          };
        }
      });
    } catch {}
  }

  showUndoToast(scope) {
    const existing = document.getElementById('orbit-undo-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'orbit-undo-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#18181b;color:#f8fafc;padding:10px 18px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:100000;display:flex;align-items:center;gap:12px;font-size:12.5px;font-family:var(--font-sans);border:1px solid #334155;';
    toast.innerHTML = `
      <span>🗑️ Browser storage cleared for <strong>${scope === 'all' ? 'All Tools' : scope.toUpperCase()}</strong>.</span>
      <button id="btn-undo-action" style="background:#2563eb;color:#ffffff;border:none;padding:4px 10px;border-radius:4px;font-size:11.5px;font-weight:700;cursor:pointer;">↩ Undo (10s)</button>
    `;
    document.body.appendChild(toast);

    const timer = setTimeout(() => {
      toast.remove();
      this._lastUndoSnapshot = null;
    }, 10000);

    toast.querySelector('#btn-undo-action')?.addEventListener('click', () => {
      clearTimeout(timer);
      if (this._lastUndoSnapshot && this._lastUndoSnapshot.data) {
        Object.entries(this._lastUndoSnapshot.data).forEach(([tool, vals]) => {
          const config = TOOL_DEFAULTS[tool];
          if (config && vals.data) {
            localStorage.setItem(config.dataKey, vals.data);
            if (vals.title) localStorage.setItem(config.titleKey, vals.title);
            if (vals.time) localStorage.setItem(config.timeKey, vals.time);
            this.registerSyncedWork(tool, vals.title || config.toolName, Date.now());
          }
        });
        toast.innerHTML = `<span>✔ Restored previous browser work successfully!</span>`;
        setTimeout(() => toast.remove(), 2500);
        window.dispatchEvent(new CustomEvent('orbit:sync-change', { detail: { action: 'restore' } }));
        this.openStorageModal();
      }
    });
  }
}

export const syncManager = new GiriSyncManager();
if (typeof window !== 'undefined') {
  window.giriSyncManager = syncManager;
}
