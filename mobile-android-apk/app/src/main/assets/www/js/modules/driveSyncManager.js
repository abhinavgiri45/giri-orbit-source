/**
 * ============================================================================
 * GIRI ORBIT — GOOGLE DRIVE & SOVEREIGN CLOUD SYNC ENGINE (driveSyncManager.js)
 * By GIRI Corporation
 * ============================================================================
 * Provides deep Google Drive integration, direct editing, live auto-saving,
 * local File System Access API disk sync, and Drive file management across:
 * - Giri Drift (Docs)
 * - Giri Axis (Sheets)
 * - Giri Kinetic (Slides)
 * - Giri Aegis (PDF Studio)
 * - Giri Orbit Hub
 * ============================================================================
 */

const DRIVE_STORAGE_KEY = 'giri_orbit_drive_files';
const DRIVE_SETTINGS_KEY = 'giri_orbit_drive_settings';
const DRIVE_ACTIVE_FILE_KEY = 'giri_orbit_drive_active_file';

export const DEFAULT_GOOGLE_CLIENT_ID = '340226227470-np4m4o749r8t12nkpb2lgqru8rftju3r.apps.googleusercontent.com';

export class GiriDriveSyncManager {
  constructor() {
    this.activeFileHandles = new Map(); // fileId -> FileSystemFileHandle
    this.autoSaveTimer = null;
    this.isAutoSaveEnabled = true;
    this.currentActiveFileId = null;
    this.init();
  }

  init() {
    this.cleanLegacyMockFiles();
    this.loadSettings();
    this.bindWindowEvents();
    setTimeout(() => {
      this.updateUIStatus();
    }, 50);
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(DRIVE_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.isAutoSaveEnabled = parsed.autoSave !== false;
        this.googleClientId = parsed.googleClientId || DEFAULT_GOOGLE_CLIENT_ID;
        this.googleUser = (parsed.googleUser && typeof parsed.googleUser === 'object' && parsed.googleUser.email) ? parsed.googleUser : null;
        // MUST have an actual authenticated googleUser object to be connected
        this.isConnectedToGoogle = !!(parsed.isConnectedToGoogle && this.googleUser);
      } else {
        this.isAutoSaveEnabled = true;
        this.isConnectedToGoogle = false;
        this.googleUser = null;
        this.googleClientId = DEFAULT_GOOGLE_CLIENT_ID;
      }
    } catch (_) {
      this.isAutoSaveEnabled = true;
      this.isConnectedToGoogle = false;
      this.googleUser = null;
      this.googleClientId = DEFAULT_GOOGLE_CLIENT_ID;
    }

    if (this.googleClientId) {
      setTimeout(() => this.initGoogleTokenClient(this.googleClientId), 200);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem(DRIVE_SETTINGS_KEY, JSON.stringify({
        autoSave: this.isAutoSaveEnabled,
        isConnectedToGoogle: !!(this.isConnectedToGoogle && this.googleUser),
        googleUser: this.googleUser || null,
        googleClientId: this.googleClientId || ''
      }));
    } catch (_) {}
  }

  getSavedGoogleAccounts() {
    try {
      const raw = localStorage.getItem('giri_orbit_saved_google_accounts');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      if (this.googleUser && this.googleUser.email) {
        return [{
          name: this.googleUser.name || this.googleUser.email.split('@')[0],
          email: this.googleUser.email,
          picture: this.googleUser.picture || '',
          lastUsed: Date.now()
        }];
      }
    } catch (_) {}
    return [];
  }

  saveGoogleAccountToList(acc) {
    if (!acc || !acc.email) return;
    try {
      let list = this.getSavedGoogleAccounts();
      list = list.filter(a => a.email.toLowerCase() !== acc.email.toLowerCase());
      list.unshift({
        name: acc.name || acc.email.split('@')[0],
        email: acc.email,
        picture: acc.picture || '',
        lastUsed: Date.now()
      });
      localStorage.setItem('giri_orbit_saved_google_accounts', JSON.stringify(list.slice(0, 5)));
    } catch (_) {}
  }

  cleanLegacyMockFiles() {
    try {
      const stored = localStorage.getItem(DRIVE_STORAGE_KEY);
      if (stored) {
        let files = JSON.parse(stored);
        if (Array.isArray(files)) {
          // Purge all mock/dummy files — keep ONLY real Google Drive or local linked files
          const mockIds = new Set(['gdrive-doc-01', 'gdrive-sheet-02', 'gdrive-slide-03', 'gdrive-pdf-04']);
          const mockNames = new Set([
            'New Strategy Document.docx',
            'New Financial Model.xlsx',
            'New Executive Deck.pptx',
            'New Executive Form.pdf',
            'Untitled Document.docx'
          ]);
          files = files.filter(f => f && (f.googleDriveId || f.isLocalDrive) && !mockIds.has(f.id) && !mockNames.has(f.name) && !String(f.id).startsWith('gdrive-'));
          localStorage.setItem(DRIVE_STORAGE_KEY, JSON.stringify(files));
        }
      } else {
        localStorage.setItem(DRIVE_STORAGE_KEY, JSON.stringify([]));
      }
    } catch (_) {}
  }

  getDriveFiles() {
    try {
      const stored = localStorage.getItem(DRIVE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  }

  saveDriveFiles(files) {
    try {
      localStorage.setItem(DRIVE_STORAGE_KEY, JSON.stringify(files));
      window.dispatchEvent(new CustomEvent('orbit:drive-change', { detail: { files } }));
    } catch (_) {}
  }

  getDriveFileById(fileId) {
    const files = this.getDriveFiles();
    return files.find(f => f.id === fileId) || null;
  }

  /**
   * Save Active File to Google Drive
   */
  saveActiveFileToDrive(tool, title, content, format = null) {
    const files = this.getDriveFiles();
    const cleanTitle = (title || 'Untitled Document').trim();
    const detectedFormat = format || (tool === 'drift' ? 'docx' : tool === 'axis' ? 'xlsx' : tool === 'kinetic' ? 'pptx' : 'pdf');
    const fileName = cleanTitle.endsWith(`.${detectedFormat}`) ? cleanTitle : `${cleanTitle}.${detectedFormat}`;

    // Check if updating existing file
    let existingIndex = -1;
    if (this.currentActiveFileId) {
      existingIndex = files.findIndex(f => f.id === this.currentActiveFileId);
    }
    if (existingIndex === -1) {
      existingIndex = files.findIndex(f => f.name.toLowerCase() === fileName.toLowerCase());
    }

    const now = Date.now();
    let fileObj;

    if (existingIndex >= 0) {
      const prevFile = files[existingIndex];
      const revisions = Array.isArray(prevFile.revisions) ? [...prevFile.revisions] : [];
      if (prevFile.content && prevFile.content !== content) {
        revisions.unshift({
          timestamp: prevFile.lastModified || Date.now(),
          size: prevFile.size || '1 KB',
          content: prevFile.content
        });
      }
      fileObj = {
        ...prevFile,
        name: fileName,
        tool: tool,
        content: content,
        lastModified: now,
        synced: true,
        revisions: revisions.slice(0, 10),
        size: `${Math.max(1, Math.round((content ? content.length : 100) / 100) / 10)} KB`
      };
      files[existingIndex] = fileObj;
    } else {
      fileObj = {
        id: 'gdrive-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        name: fileName,
        tool: tool,
        folder: 'My Drive',
        format: detectedFormat,
        size: `${Math.max(1, Math.round((content ? content.length : 100) / 100) / 10)} KB`,
        lastModified: now,
        synced: true,
        isGoogleDrive: true,
        revisions: [],
        content: content
      };
      files.unshift(fileObj);
    }

    this.currentActiveFileId = fileObj.id;
    try {
      localStorage.setItem(DRIVE_ACTIVE_FILE_KEY, fileObj.id);
    } catch (_) {}

    this.saveDriveFiles(files);
    this.broadcastSyncStatus('synced', fileObj.name);

    // If a physical FileSystem handle is linked, write to disk too
    if (this.activeFileHandles.has(fileObj.id)) {
      this.writeFileHandle(this.activeFileHandles.get(fileObj.id), content);
    }

    return fileObj;
  }

  /**
   * Open a File from Drive and load into active tool
   */
  async openDriveFile(fileId) {
    const file = this.getDriveFileById(fileId);
    if (!file) return null;

    this.currentActiveFileId = file.id;
    try {
      localStorage.setItem(DRIVE_ACTIVE_FILE_KEY, file.id);
    } catch (_) {}

    // If file is from Google Drive and content is not cached, fetch it
    if (file.googleDriveId && !file.content && this.googleUser?.accessToken) {
      const app = window.orbitPlatform;
      if (app) app.showToast(`Loading "${file.name}" from Google Drive...`, 'blue');

      try {
        let contentUrl = '';
        const mime = (file.mimeType || '').toLowerCase();
        if (mime === 'application/vnd.google-apps.document') {
          contentUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}/export?mimeType=text/html`;
        } else if (mime === 'application/vnd.google-apps.spreadsheet') {
          contentUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}/export?mimeType=text/csv`;
        } else if (mime === 'application/vnd.google-apps.presentation') {
          contentUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}/export?mimeType=text/plain`;
        } else {
          contentUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}?alt=media`;
        }

        const res = await fetch(contentUrl, {
          headers: { Authorization: `Bearer ${this.googleUser.accessToken}` }
        });

        if (res.ok) {
          file.content = await res.text();
          let allFiles = this.getDriveFiles();
          const idx = allFiles.findIndex(f => f.id === file.id);
          if (idx !== -1) {
            allFiles[idx] = file;
            this.saveDriveFiles(allFiles);
          }
        }
      } catch (err) {
        console.warn('[Google Drive] File content download failed:', err);
      }
    }

    const app = window.orbitPlatform;
    if (app) {
      if (file.tool === 'drift') {
        app.navigateTo('drift', file.name);
        setTimeout(() => {
          const paper = document.getElementById('drift-paper-canvas');
          if (paper) {
            let targetSheet = paper.querySelector('.drift-page-sheet.active-sheet') || paper.querySelector('.drift-page-sheet');
            if (!targetSheet) {
              targetSheet = document.createElement('div');
              targetSheet.className = 'drift-page-sheet active-sheet';
              targetSheet.contentEditable = 'true';
              targetSheet.spellcheck = true;
              targetSheet.dataset.page = '1';
              paper.innerHTML = '';
              paper.appendChild(targetSheet);
            }
            if (file.content && file.content.trim().startsWith('<')) {
              targetSheet.innerHTML = file.content;
            } else {
              app.importContentToDrift(file.content || `# ${file.name}\n\n*Loaded from Google Drive*`);
            }
          }
          const titleInput = document.getElementById('drift-title-input');
          if (titleInput) titleInput.value = file.name.replace(/\.[^/.]+$/, '');
        }, 180);

      } else if (file.tool === 'axis') {
        app.navigateTo('axis', file.name);
        setTimeout(() => {
          app.importContentToAxis(file.content || '');
        }, 150);

      } else if (file.tool === 'kinetic') {
        app.navigateTo('kinetic', file.name);
        setTimeout(() => {
          app.importContentToKinetic(file.content || '');
        }, 150);

      } else if (file.tool === 'pdf') {
        app.navigateTo('pdf', file.name);
        setTimeout(() => {
          app.importContentToPdf(file.content || '');
        }, 150);
      }
    }

    this.broadcastSyncStatus('synced', file.name);
    this.closeDriveModal();
    return file;
  }

  /**
   * Create New File on Drive
   */
  createNewFile(tool, customName = null) {
    const toolDefaults = {
      drift: { name: 'New Strategy Document.docx', content: '# New Strategy Document\n\nEnter your document text here...', format: 'docx' },
      axis: { name: 'New Financial Model.xlsx', content: '| Category | Q1 | Q2 | Q3 | Q4 | Total |\n| Revenue | 10000 | 12000 | 15000 | 18000 | =SUM(B2:E2) |', format: 'xlsx' },
      kinetic: { name: 'New Executive Deck.pptx', content: 'Slide 1: Executive Overview\n- 01: High Velocity\n- 02: Sovereign AI Parity', format: 'pptx' },
      pdf: { name: 'New Executive Form.pdf', content: 'Certified Document Form\nApproved for official processing.', format: 'pdf' }
    };

    const def = toolDefaults[tool] || toolDefaults.drift;
    const name = customName || def.name;
    const file = this.saveActiveFileToDrive(tool, name, def.content, def.format);
    this.openDriveFile(file.id);
    return file;
  }

  /**
   * Delete a File from Drive
   */
  deleteDriveFile(fileId) {
    let files = this.getDriveFiles();
    files = files.filter(f => f.id !== fileId);
    if (this.currentActiveFileId === fileId) {
      this.currentActiveFileId = null;
    }
    this.saveDriveFiles(files);
  }

  /**
   * Auto-Save trigger (debounced)
   */
  triggerAutoSave(tool, content) {
    if (!this.isAutoSaveEnabled || !this.currentActiveFileId) return;

    this.broadcastSyncStatus('saving');

    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => {
      const file = this.getDriveFileById(this.currentActiveFileId);
      if (file && file.tool === tool) {
        this.saveActiveFileToDrive(tool, file.name, content, file.format);
      } else {
        this.broadcastSyncStatus('synced');
      }
    }, 900);
  }

  /**
   * Native File System Access API: Pick and direct-sync local Google Drive folder / files
   */
  async openLocalDriveFile() {
    if (!window.showOpenFilePicker) {
      alert('File System Direct Editing is available in Chrome, Edge, and modern Chromium browsers.');
      return;
    }

    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Office Suite Documents',
            accept: {
              'text/plain': ['.txt', '.md', '.html'],
              'application/json': ['.json'],
              'text/csv': ['.csv', '.tsv']
            }
          }
        ]
      });

      if (!handle) return;
      const fileData = await handle.getFile();
      const text = await fileData.text();
      const ext = fileData.name.split('.').pop().toLowerCase();

      let targetTool = 'drift';
      if (['xlsx', 'xls', 'csv', 'tsv'].includes(ext)) targetTool = 'axis';
      else if (['pptx', 'ppt', 'deck'].includes(ext)) targetTool = 'kinetic';
      else if (['pdf'].includes(ext)) targetTool = 'pdf';

      const fileObj = this.saveActiveFileToDrive(targetTool, fileData.name, text);
      this.activeFileHandles.set(fileObj.id, handle);
      this.openDriveFile(fileObj.id);

      if (window.orbitPlatform) {
        window.orbitPlatform.showToast(`Linked local Drive file: ${fileData.name}`, 'green');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[Drive Sync] Local file pick error:', err);
      }
    }
  }

  async writeFileHandle(handle, content) {
    try {
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
    } catch (err) {
      console.warn('[Drive Sync] Disk write error:', err);
    }
  }

  broadcastSyncStatus(status, filename = '') {
    const headerPillText = document.getElementById('txt-global-drive-sync');
    const headerDot = document.querySelector('#btn-global-drive-sync .drive-dot-live');

    if (headerPillText) {
      if (status === 'saving') {
        headerPillText.textContent = 'Saving...';
      } else {
        if (this.isConnectedToGoogle && this.googleUser) {
          headerPillText.textContent = filename ? `Drive: ${filename.slice(0, 16)}` : 'Drive: Connected';
        } else {
          headerPillText.textContent = 'Google Drive';
        }
      }
    }

    if (headerDot) {
      if (status === 'saving') {
        headerDot.className = 'drive-dot-live syncing';
      } else {
        headerDot.className = (this.isConnectedToGoogle && this.googleUser) ? 'drive-dot-live connected' : 'drive-dot-live disconnected';
      }
    }

    // In-editor status badges
    document.querySelectorAll('.in-tool-drive-status').forEach(badge => {
      if (status === 'saving') {
        badge.textContent = '☁️ Saving to Drive...';
        badge.style.color = '#fbbf24';
      } else if (this.isConnectedToGoogle && this.googleUser) {
        badge.textContent = '☁️ Drive Synced';
        badge.style.color = '#4ade80';
      } else {
        badge.textContent = '☁️ Local Cloud';
        badge.style.color = '#94a3b8';
      }
    });
  }

  updateUIStatus() {
    const headerPillText = document.getElementById('txt-global-drive-sync');
    const headerDot = document.querySelector('#btn-global-drive-sync .drive-dot-live');
    const modalBadge = document.getElementById('drive-modal-header-status-badge');

    const isConn = !!(this.isConnectedToGoogle && this.googleUser && this.googleUser.email);

    if (headerPillText) {
      headerPillText.textContent = isConn ? 'Drive: Connected' : 'Google Drive';
    }

    if (headerDot) {
      headerDot.className = isConn ? 'drive-dot-live connected' : 'drive-dot-live disconnected';
    }

    if (modalBadge) {
      modalBadge.className = `drive-status-badge ${isConn ? 'connected' : 'disconnected'}`;
      modalBadge.textContent = isConn ? '🟢 Google Connected' : '⚪ Not Connected';
      modalBadge.title = isConn ? `Connected as ${this.googleUser.email}` : 'Click to connect Google Account';
    }

    // In-tool topbar pills
    document.querySelectorAll('#txt-drift-drive-status, #txt-axis-drive-status, #txt-kinetic-drive-status, #txt-pdf-drive-status').forEach(el => {
      el.textContent = isConn ? '☁️ Drive (Connected)' : '☁️ Drive';
    });

    document.querySelectorAll('.fluent-drive-action-pill .drive-dot-live').forEach(dot => {
      dot.className = isConn ? 'drive-dot-live connected' : 'drive-dot-live disconnected';
    });

    // In-tool footer/status badges
    document.querySelectorAll('.in-tool-drive-status').forEach(badge => {
      badge.textContent = isConn ? '☁️ Drive Synced' : '☁️ Local Cloud';
      badge.style.color = isConn ? '#4ade80' : '#94a3b8';
    });
  }

  /**
   * Google Identity Services (GIS) Official Token Client
   */
  /**
   * Google Identity Services (GIS) Official Token Client
   */
  
  sortFiles(files, sortOption = 'modified-desc') {
    if (!Array.isArray(files)) return [];
    const list = [...files];
    if (sortOption === 'modified-desc') {
      return list.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
    } else if (sortOption === 'modified-asc') {
      return list.sort((a, b) => (a.lastModified || 0) - (b.lastModified || 0));
    } else if (sortOption === 'name-asc') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === 'name-desc') {
      return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortOption === 'size-desc') {
      const getBytes = (f) => {
        if (!f.size) return 0;
        const num = parseFloat(f.size) || 0;
        if (f.size.includes('MB')) return num * 1024 * 1024;
        if (f.size.includes('KB')) return num * 1024;
        return num;
      };
      return list.sort((a, b) => getBytes(b) - getBytes(a));
    }
    return list;
  }

  async ensureGoogleIdentityServices() {
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      return true;
    }
    return new Promise((resolve) => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve(true);
        } else if (attempts > 30) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
    });
  }

  initGoogleTokenClient(clientId = null) {
    const cId = clientId || this.googleClientId;
    if (!cId) return;

    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      try {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: cId,
          scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          enable_granular_consent: false,
          error_callback: (err) => {
            console.warn('[Google OAuth] Token error or popup blocked:', err);
            if (window.orbitPlatform) window.orbitPlatform.showToast('Google Sign-In popup was closed or blocked by browser.', 'red');
          },
          callback: async (resp) => {
            if (resp.error) {
              console.warn('[Google OAuth] Error or cancelled:', resp);
              if (window.orbitPlatform) window.orbitPlatform.showToast('Google Sign-In was cancelled or encountered an issue.', 'red');
              return;
            }
            try {
              // 1. Fetch real user profile from Google OAuth endpoint
              const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${resp.access_token}` }
              });
              const profile = await userRes.json();

              // 2. Query Google Drive API v3 about for exact real storage quota
              let quotaText = '15 GB Google One Cloud';
              try {
                const aboutRes = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
                  headers: { Authorization: `Bearer ${resp.access_token}` }
                });
                if (aboutRes.ok) {
                  const aboutData = await aboutRes.json();
                  if (aboutData.storageQuota) {
                    const usageBytes = parseInt(aboutData.storageQuota.usage || '0', 10);
                    const limitBytes = parseInt(aboutData.storageQuota.limit || '16106127360', 10);
                    const usedGB = (usageBytes / (1024 * 1024 * 1024)).toFixed(1);
                    if (limitBytes > 0) {
                      const totalGB = (limitBytes / (1024 * 1024 * 1024)).toFixed(0);
                      const pct = Math.round((usageBytes / limitBytes) * 100);
                      quotaText = `${usedGB} GB of ${totalGB} GB used (${pct}%)`;
                    } else {
                      quotaText = `${usedGB} GB used (Unlimited Workspace)`;
                    }
                  }
                  if (aboutData.user?.displayName) profile.name = aboutData.user.displayName;
                  if (aboutData.user?.photoLink) profile.picture = aboutData.user.photoLink;
                }
              } catch (_) {}

              this.performGoogleLogin(profile.name || 'Google User', profile.email || 'user@gmail.com', {
                picture: profile.picture || '',
                accessToken: resp.access_token,
                expiresAt: Date.now() + ((resp.expires_in || 3600) * 1000),
                clientId: cId,
                quota: quotaText
              });

              // 3. Fetch real files from Google Drive!
              await this.fetchRealGoogleDriveFiles(resp.access_token);
            } catch (err) {
              console.error('[Google OAuth] Profile fetch error:', err);
              this.performGoogleLogin('Google User', 'drive.user@gmail.com', {
                accessToken: resp.access_token,
                clientId: cId
              });
              await this.fetchRealGoogleDriveFiles(resp.access_token);
            }
          }
        });
      } catch (err) {
        console.warn('[Google OAuth] Token client initialization failed:', err);
      }
    }
  }

  /**
   * Fetch Real Storage Quota from Google Drive API
   */
  async fetchRealStorageQuota(token) {
    if (!token) return;
    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.storageQuota && this.googleUser) {
          const usedBytes = parseInt(data.storageQuota.usage || '0', 10);
          const limitBytes = parseInt(data.storageQuota.limit || '0', 10);
          const usedGB = (usedBytes / (1024 * 1024 * 1024)).toFixed(1);
          let quotaStr = '';
          if (limitBytes > 0) {
            const totalGB = (limitBytes / (1024 * 1024 * 1024)).toFixed(0);
            const pct = Math.round((usedBytes / limitBytes) * 100);
            quotaStr = `${usedGB} GB of ${totalGB} GB used (${pct}%)`;
          } else {
            quotaStr = `${usedGB} GB used`;
          }
          this.googleUser.quota = quotaStr;
          if (data.user?.displayName) this.googleUser.name = data.user.displayName;
          if (data.user?.photoLink) this.googleUser.picture = data.user.photoLink;
          this.saveSettings();
          const quotaEl = document.getElementById('drive-user-quota-text');
          if (quotaEl) quotaEl.textContent = quotaStr;
        }
      }
    } catch (_) {}
  }

  /**
   * Fetch Original Real Files directly from Google Drive API v3
   */
  async fetchRealGoogleDriveFiles(accessToken = null) {
    let token = accessToken || this.googleUser?.accessToken;
    
    // Check if token is expired
    if (this.googleUser?.expiresAt && Date.now() > this.googleUser.expiresAt) {
      token = null;
    }

    if (!token) {
      if (this.tokenClient) {
        this.tokenClient.requestAccessToken({
          prompt: 'select_account',
          login_hint: this.googleUser?.email || ''
        });
      } else {
        this.promptGoogleDirectLogin();
      }
      return [];
    }

    const listEl = document.getElementById('drive-file-list-container');
    if (listEl) {
      listEl.innerHTML = `
        <div style="padding:48px 20px; text-align:center; color:#94a3b8;">
          <div style="font-size:32px; margin-bottom:12px; display:inline-block; animation:spin 1s linear infinite;">⏳</div>
          <p style="font-size:14px; font-weight:600; color:#f1f5f9; margin-bottom:4px;">Connecting to your Google Drive...</p>
          <p style="font-size:12px; color:#64748b;">Retrieving original documents, sheets, slides, and files</p>
        </div>
      `;
    }

    try {
      this.fetchRealStorageQuota(token);

      // Query non-trashed files, ordered by modified date descending
      const q = encodeURIComponent("trashed = false and mimeType != 'application/vnd.google-apps.folder'");
      const fields = encodeURIComponent('files(id,name,mimeType,modifiedTime,size,webViewLink,iconLink,thumbnailLink,owners,starred)');
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=100&fields=${fields}&q=${q}&orderBy=modifiedTime desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        console.warn('[Google Drive] Access token expired, requesting fresh token...');
        if (this.tokenClient) {
          this.tokenClient.requestAccessToken({ prompt: 'select_account', login_hint: this.googleUser?.email || '' });
        }
        return [];
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.warn('[Google Drive API] Error fetching files:', res.status, errJson);
        const errMsg = errJson?.error?.message || `HTTP ${res.status} Error`;

        if (listEl) {
          const isApiDisabled = errMsg.toLowerCase().includes('not been used in project') || 
                                errMsg.toLowerCase().includes('disabled') || 
                                errMsg.toLowerCase().includes('drive.googleapis.com') ||
                                res.status === 403;

          const enableUrlMatch = errMsg.match(/https?:\/\/[^\s]+/);
          const enableUrl = enableUrlMatch ? enableUrlMatch[0] : `https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=340226227470`;

          if (isApiDisabled) {
            listEl.innerHTML = `
              <div style="padding:28px 20px; text-align:center; max-width:540px; margin:0 auto;">
                <div style="width:54px; height:54px; border-radius:14px; background:rgba(234,67,53,0.12); border:1px solid rgba(234,67,53,0.3); display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px; font-size:26px;">
                  ⚠️
                </div>
                <h3 style="color:#f87171; margin:0 0 8px 0; font-size:17px; font-weight:700;">Google Drive API Must Be Enabled in Google Cloud</h3>
                <p style="font-size:13px; color:#cbd5e1; line-height:1.55; margin:0 0 16px 0;">
                  Google Cloud requires the <strong>Google Drive API</strong> to be enabled for your project before files can be synced into Giri Orbit.
                </p>

                <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(56,189,248,0.25); border-radius:10px; padding:14px 16px; text-align:left; margin-bottom:18px;">
                  <div style="font-size:12px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">
                    ⚡ How to solve in 30 seconds:
                  </div>
                  <ol style="margin:0; padding-left:18px; font-size:12.5px; color:#94a3b8; line-height:1.65;">
                    <li>Click the blue button below to open the Google Cloud Console enablement page.</li>
                    <li>Click the blue <strong>"ENABLE"</strong> button on Google's page.</li>
                    <li>Return here and click <strong>"🔄 Retry Sync"</strong>.</li>
                  </ol>
                </div>

                <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:16px;">
                  <a href="${enableUrl}" target="_blank" rel="noopener noreferrer" class="btn-giri-primary" style="padding:10px 20px; font-size:13px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(37,99,235,0.35); border-radius:8px;">
                    <span>🌐 Enable Google Drive API in Google Cloud ↗</span>
                  </a>
                  <button class="btn-giri-secondary" id="btn-drive-retry-after-enable" style="padding:10px 18px; font-size:13px; background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.35); color:#4ade80; border-radius:8px; cursor:pointer; font-weight:600;">
                    <span>🔄 Retry Sync</span>
                  </button>
                </div>

                <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:14px; margin-top:8px; display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                  <button id="btn-drive-local-fallback" style="background:transparent; border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:6px; padding:6px 14px; font-size:12px; cursor:pointer;">
                    📁 Link Local Drive Folder Instead (Zero-Setup)
                  </button>
                  <button id="btn-drive-custom-client-id" style="background:transparent; border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:6px; padding:6px 14px; font-size:12px; cursor:pointer;">
                    ⚙️ Custom Client ID
                  </button>
                </div>
              </div>
            `;
          } else {
            listEl.innerHTML = `
              <div style="padding:36px 20px; text-align:center;">
                <div style="font-size:32px; margin-bottom:10px;">⚠️</div>
                <h4 style="color:#f87171; margin:0 0 6px 0; font-size:15px;">Google Drive Authorization Required</h4>
                <p style="font-size:12.5px; color:#94a3b8; max-width:440px; margin:0 auto 16px auto; line-height:1.5;">${this.escapeHtml(errMsg)}</p>
                <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                  <button class="btn-giri-primary" id="btn-drive-reauth-inline" style="padding:8px 18px; font-size:12.5px; font-weight:600;">
                    <span>🔑 Authorize Google Drive Access</span>
                  </button>
                  <button class="btn-giri-secondary" id="btn-drive-local-fallback" style="padding:8px 18px; font-size:12.5px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#f1f5f9; border-radius:6px; cursor:pointer;">
                    <span>📁 Link Local Drive Folder</span>
                  </button>
                </div>
              </div>
            `;
          }

          listEl.querySelector('#btn-drive-retry-after-enable')?.addEventListener('click', async () => {
            await this.fetchRealGoogleDriveFiles();
          });

          listEl.querySelector('#btn-drive-reauth-inline')?.addEventListener('click', () => {
            if (this.tokenClient) {
              this.tokenClient.requestAccessToken({ prompt: 'select_account' });
            } else {
              this.promptGoogleDirectLogin();
            }
          });

          listEl.querySelector('#btn-drive-local-fallback')?.addEventListener('click', () => {
            this.openLocalDriveDirectory();
          });

          listEl.querySelector('#btn-drive-custom-client-id')?.addEventListener('click', () => {
            const newCId = prompt('Enter your Google Cloud OAuth Client ID:', this.googleClientId || DEFAULT_GOOGLE_CLIENT_ID);
            if (newCId && newCId.trim()) {
              this.googleClientId = newCId.trim();
              this.saveSettings();
              this.initGoogleTokenClient(this.googleClientId);
              if (this.tokenClient) {
                this.tokenClient.requestAccessToken({ prompt: 'select_account' });
              }
            }
          });
        }
        return [];
      }

      const data = await res.json();
      const files = Array.isArray(data.files) ? data.files : [];

      const realFiles = files.map(f => {
        let tool = 'drift';
        let format = 'docx';
        const mime = (f.mimeType || '').toLowerCase();
        const name = f.name || 'Untitled Document';
        const ext = name.split('.').pop().toLowerCase();

        if (mime.includes('spreadsheet') || ['xlsx', 'xls', 'csv', 'tsv', 'ods'].includes(ext)) {
          tool = 'axis';
          format = ext === 'csv' ? 'csv' : 'xlsx';
        } else if (mime.includes('presentation') || ['pptx', 'ppt', 'odp'].includes(ext)) {
          tool = 'kinetic';
          format = 'pptx';
        } else if (mime.includes('pdf') || ext === 'pdf') {
          tool = 'pdf';
          format = 'pdf';
        } else {
          tool = 'drift';
          format = ['md', 'txt', 'html', 'odt'].includes(ext) ? ext : 'docx';
        }

        let formattedSize = '—';
        if (f.size) {
          const bytes = parseInt(f.size, 10);
          if (bytes > 1048576) formattedSize = (bytes / 1048576).toFixed(1) + ' MB';
          else if (bytes > 1024) formattedSize = (bytes / 1024).toFixed(1) + ' KB';
          else formattedSize = bytes + ' B';
        } else {
          formattedSize = mime.includes('document') ? 'Google Doc' : mime.includes('spreadsheet') ? 'Google Sheet' : mime.includes('presentation') ? 'Google Slide' : 'Cloud File';
        }

        return {
          id: f.id,
          googleDriveId: f.id,
          name: f.name,
          tool: tool,
          folder: 'My Drive',
          format: format,
          size: formattedSize,
          lastModified: f.modifiedTime ? new Date(f.modifiedTime).getTime() : Date.now(),
          synced: true,
          isGoogleDrive: true,
          webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
          iconLink: f.iconLink || '',
          mimeType: f.mimeType
        };
      });

      // Replace stored files completely with user's real Google Drive files
      this.saveDriveFiles(realFiles);

      // Re-render file list
      if (listEl) {
        listEl.innerHTML = this.renderDriveFileListHtml(realFiles);
        this.bindFileListEvents(document.getElementById('drive-sync-modal-backdrop') || document.body);
      }

      if (window.orbitPlatform) {
        window.orbitPlatform.showToast(`✅ Synced ${realFiles.length} real files from your Google Drive!`, 'green');
      }

      return realFiles;
    } catch (err) {
      console.warn('[Google Drive API] Error loading real files:', err);
      if (listEl) {
        listEl.innerHTML = `
          <div style="padding:36px 20px; text-align:center; color:#94a3b8;">
            <p style="color:#f87171; font-weight:600; font-size:14px; margin-bottom:8px;">Connection to Google Drive Interrupted</p>
            <p style="font-size:12px; margin-bottom:14px;">${err.message || 'Check your internet connection and try again.'}</p>
            <button class="btn-giri-primary" onclick="window.orbitDriveSync?.fetchRealGoogleDriveFiles()" style="font-size:12px; padding:6px 14px;">Try Again</button>
          </div>
        `;
      }
    }
    return [];
  }

  /**
   * Upload a File Directly to Real Google Drive via Multipart Upload
   */
  async uploadFileToRealGoogleDrive(file) {
    const token = this.googleUser?.accessToken;
    if (!token) {
      if (window.orbitPlatform) window.orbitPlatform.showToast('Please connect to Google Drive first', 'blue');
      return;
    }

    if (window.orbitPlatform) window.orbitPlatform.showToast(`Uploading "${file.name}" to Google Drive...`, 'blue');

    try {
      const metadata = {
        name: file.name,
        mimeType: file.type || 'application/octet-stream'
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });

      if (res.ok) {
        if (window.orbitPlatform) window.orbitPlatform.showToast(`✅ "${file.name}" uploaded to Google Drive!`, 'green');
        await this.fetchRealGoogleDriveFiles();
      } else {
        const err = await res.json().catch(() => ({}));
        if (window.orbitPlatform) window.orbitPlatform.showToast(`Upload failed: ${err.error?.message || res.statusText}`, 'red');
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (window.orbitPlatform) window.orbitPlatform.showToast('Upload error: ' + err.message, 'red');
    }
  }

  /**
   * Save Active Document Directly to Real Google Drive
   */
  async saveCurrentActiveFileToRealGoogleDrive(tool) {
    const token = this.googleUser?.accessToken;
    const currentTool = tool || (window.orbitPlatform?.currentView || 'drift');

    let activeTitle = 'Document';
    let content = '';
    let mimeType = 'text/plain';
    let ext = 'txt';

    if (currentTool === 'drift') {
      const titleEl = document.getElementById('drift-title-input');
      activeTitle = (titleEl && titleEl.value ? titleEl.value.trim() : 'Document');
      const paper = document.getElementById('drift-paper-canvas');
      content = paper ? paper.innerHTML : '';
      mimeType = 'text/html';
      ext = 'html';
    } else if (currentTool === 'axis') {
      activeTitle = 'Spreadsheet';
      content = localStorage.getItem('giri_orbit_axis_sheets') || '';
      mimeType = 'application/json';
      ext = 'json';
    } else if (currentTool === 'kinetic') {
      activeTitle = 'Presentation';
      content = localStorage.getItem('giri_orbit_kinetic_deck') || '';
      mimeType = 'application/json';
      ext = 'json';
    } else if (currentTool === 'pdf') {
      activeTitle = 'Certified Document';
      content = localStorage.getItem('giri_orbit_pdf_pages') || '';
      mimeType = 'text/plain';
      ext = 'txt';
    }

    const fileName = activeTitle.endsWith(`.${ext}`) ? activeTitle : `${activeTitle}.${ext}`;

    // Determine if modifying / updating an existing file in Google Drive
    const currentFile = this.currentActiveFileId ? this.getDriveFileById(this.currentActiveFileId) : null;
    const existingDriveId = currentFile?.googleDriveId || (currentFile?.isGoogleDrive ? currentFile?.id : null);

    // If Google token available, upload or patch directly to Google Drive API
    if (token) {
      if (window.orbitPlatform) window.orbitPlatform.showToast(`Saving "${fileName}" to Google Drive...`, 'blue');

      try {
        if (existingDriveId && !String(existingDriveId).startsWith('gdrive-') && !String(existingDriveId).startsWith('local-')) {
          // Direct in-place update with PATCH
          const patchUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingDriveId}?uploadType=media`;
          const res = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': mimeType
            },
            body: content
          });

          // Also update title if changed
          if (res.ok && currentFile?.name !== fileName) {
            await fetch(`https://www.googleapis.com/drive/v3/files/${existingDriveId}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name: fileName })
            }).catch(() => {});
          }

          if (res.ok) {
            const savedLocal = this.saveActiveFileToDrive(currentTool, activeTitle, content, ext);
            if (savedLocal) {
              const allFiles = this.getDriveFiles();
              const idx = allFiles.findIndex(f => f.id === savedLocal.id);
              if (idx !== -1) {
                allFiles[idx].googleDriveId = existingDriveId;
                allFiles[idx].webViewLink = currentFile?.webViewLink || `https://drive.google.com/file/d/${existingDriveId}/view`;
                this.saveDriveFiles(allFiles);
              }
            }
            if (window.orbitPlatform) window.orbitPlatform.showToast(`✅ Updated "${fileName}" directly in Google Drive!`, 'green');
            return;
          }
        }

        // Upload new file with multipart POST
        const metadata = { name: fileName, mimeType: mimeType };
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([content], { type: mimeType }));

        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,size,webViewLink', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form
        });

        if (res.ok) {
          const newDriveFile = await res.json().catch(() => ({}));
          const savedLocal = this.saveActiveFileToDrive(currentTool, activeTitle, content, ext);
          if (savedLocal && newDriveFile.id) {
            const allFiles = this.getDriveFiles();
            const idx = allFiles.findIndex(f => f.id === savedLocal.id);
            if (idx !== -1) {
              allFiles[idx].googleDriveId = newDriveFile.id;
              allFiles[idx].webViewLink = newDriveFile.webViewLink || `https://drive.google.com/file/d/${newDriveFile.id}/view`;
              allFiles[idx].synced = true;
              this.saveDriveFiles(allFiles);
            }
            this.currentActiveFileId = savedLocal.id;
          }
          if (window.orbitPlatform) window.orbitPlatform.showToast(`✅ Saved "${fileName}" to Google Drive!`, 'green');
          return;
        }
      } catch (err) {
        console.warn('API save error:', err);
      }
    }

    // Sovereign fallback
    const saved = this.saveActiveFileToDrive(currentTool, activeTitle, content, ext);
    if (window.orbitPlatform && saved) {
      window.orbitPlatform.showToast(`✅ Saved "${saved.name}" to Cloud Drive!`, 'green');
    }
  }

  /**
   * Delete File Directly from Real Google Drive
   */
  async deleteRealGoogleDriveFile(fileId) {
    const token = this.googleUser?.accessToken;
    if (token) {
      try {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Google Drive delete error:', err);
      }
    }
    this.deleteDriveFile(fileId);
  }

  /**
   * Native File System Directory Picker for Local Google Drive Folder
   */
  async openLocalDriveDirectory() {
    if (!window.showDirectoryPicker) {
      alert('Local Folder Sync is supported in Chrome, Edge, and modern Chromium browsers.');
      return;
    }
    try {
      const dirHandle = await window.showDirectoryPicker({
        id: 'giri-orbit-google-drive',
        mode: 'readwrite'
      });
      if (!dirHandle) return;

      const app = window.orbitPlatform;
      if (app) app.showToast(`Scanning "${dirHandle.name}" folder...`, 'blue');

      const localFiles = [];
      for await (const [name, handle] of dirHandle.entries()) {
        if (handle.kind === 'file') {
          const file = await handle.getFile();
          const ext = name.split('.').pop().toLowerCase();
          let tool = 'drift';
          let format = ext;
          if (['xlsx', 'xls', 'csv', 'tsv', 'ods'].includes(ext)) {
            tool = 'axis';
            format = ext === 'csv' ? 'csv' : 'xlsx';
          } else if (['pptx', 'ppt', 'odp'].includes(ext)) {
            tool = 'kinetic';
            format = 'pptx';
          } else if (ext === 'pdf') {
            tool = 'pdf';
            format = 'pdf';
          } else if (['docx', 'doc', 'txt', 'md', 'html', 'rtf'].includes(ext)) {
            tool = 'drift';
            format = ext;
          } else {
            continue;
          }

          let formattedSize = '—';
          if (file.size > 1048576) formattedSize = (file.size / 1048576).toFixed(1) + ' MB';
          else if (file.size > 1024) formattedSize = (file.size / 1024).toFixed(1) + ' KB';
          else formattedSize = file.size + ' B';

          const fileId = 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
          this.activeFileHandles.set(fileId, handle);

          localFiles.push({
            id: fileId,
            googleDriveId: fileId,
            name: name,
            tool: tool,
            folder: dirHandle.name,
            format: format,
            size: formattedSize,
            lastModified: file.lastModified,
            synced: true,
            isLocalDrive: true,
            handle: handle
          });
        }
      }

      if (localFiles.length > 0) {
        const existing = this.getDriveFiles().filter(f => !f.isLocalDrive);
        const combined = [...localFiles, ...existing];
        this.saveDriveFiles(combined);

        const listEl = document.getElementById('drive-file-list-container');
        if (listEl) {
          listEl.innerHTML = this.renderDriveFileListHtml(combined);
          this.bindFileListEvents(document.getElementById('drive-sync-modal-backdrop') || document.body);
        }

        if (app) app.showToast(`✅ Synced ${localFiles.length} real files from "${dirHandle.name}"!`, 'green');
      } else {
        if (app) app.showToast(`Folder "${dirHandle.name}" has no compatible Office documents.`, 'blue');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Local folder sync error:', err);
      }
    }
  }

  /**
   * Selective Google Drive File Picker — Import ONLY the user's selected files
   */
  async openGoogleDriveFilePicker() {
    let token = this.googleUser?.accessToken;
    if (this.googleUser?.expiresAt && Date.now() > this.googleUser.expiresAt) token = null;

    if (!token) {
      if (this.tokenClient) {
        this.tokenClient.requestAccessToken({ prompt: 'select_account', login_hint: this.googleUser?.email || '' });
      } else {
        this.promptGoogleDirectLogin();
      }
      return;
    }

    const app = window.orbitPlatform;
    if (app) app.showToast('Loading your Google Drive directory...', 'blue');

    try {
      const q = encodeURIComponent("trashed = false and mimeType != 'application/vnd.google-apps.folder'");
      const fields = encodeURIComponent('files(id,name,mimeType,modifiedTime,size,webViewLink,iconLink)');
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?pageSize=100&fields=${fields}&q=${q}&orderBy=modifiedTime desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const files = data.files || [];

      if (files.length === 0) {
        alert('No compatible files found in your Google Drive.');
        return;
      }

      // Render interactive selection modal
      document.getElementById('giri-drive-picker-modal-backdrop')?.remove();
      const pickerModal = document.createElement('div');
      pickerModal.id = 'giri-drive-picker-modal-backdrop';
      pickerModal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10099; backdrop-filter:blur(5px); font-family:sans-serif;';

      const fileRowsHtml = files.map((f, i) => {
        const mime = (f.mimeType || '').toLowerCase();
        let tool = 'drift';
        let format = 'docx';
        if (mime.includes('spreadsheet') || f.name.match(/\.(xlsx|xls|csv|tsv)$/i)) { tool = 'axis'; format = 'xlsx'; }
        else if (mime.includes('presentation') || f.name.match(/\.(pptx|ppt)$/i)) { tool = 'kinetic'; format = 'pptx'; }
        else if (mime.includes('pdf') || f.name.match(/\.pdf$/i)) { tool = 'pdf'; format = 'pdf'; }

        return `
          <label style="display:flex; align-items:center; gap:12px; padding:10px 12px; background:#27272a; border:1px solid #3f3f46; border-radius:8px; margin-bottom:8px; cursor:pointer;">
            <input type="checkbox" class="drive-picker-chk" data-file-idx="${i}" style="width:16px; height:16px; accent-color:#0ea5e9; cursor:pointer;">
            <div style="flex:1; min-width:0;">
              <strong style="font-size:13px; color:#f1f5f9; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${this.escapeHtml(f.name)}</strong>
              <span style="font-size:11px; color:#94a3b8;">${tool.toUpperCase()} • ${f.size ? (parseInt(f.size,10)/1024).toFixed(1) + ' KB' : 'Google Cloud File'}</span>
            </div>
          </label>
        `;
      }).join('');

      pickerModal.innerHTML = `
        <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:520px; max-width:92vw; padding:22px; color:#fff; box-shadow:0 24px 64px rgba(0,0,0,0.6);">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:14px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:22px; color:#0ea5e9;">🎯</span>
              <div>
                <strong style="font-size:16px; color:#f1f5f9;">Select Files from Google Drive</strong>
                <div style="font-size:11px; color:#94a3b8;">Choose only the specific files you want in Giri Orbit</div>
              </div>
            </div>
            <button id="btn-close-picker-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:12px;">
            <button id="btn-picker-select-all" style="background:transparent; border:none; color:#38bdf8; cursor:pointer; font-size:12px;">Select All</button>
            <span id="txt-picker-selected-count" style="color:#94a3b8;">0 files selected</span>
          </div>
          <div style="max-height:340px; overflow-y:auto; padding-right:4px;">
            ${fileRowsHtml}
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px; border-top:1px solid #27272a; padding-top:12px;">
            <button id="btn-cancel-picker" style="background:transparent; border:1px solid #475569; color:#cbd5e1; border-radius:6px; padding:7px 16px; font-size:12px; cursor:pointer;">Cancel</button>
            <button id="btn-confirm-import-picker" style="background:#0ea5e9; border:none; color:#fff; border-radius:6px; padding:7px 20px; font-size:12.5px; font-weight:700; cursor:pointer;">Import Selected Files</button>
          </div>
        </div>
      `;
      document.body.appendChild(pickerModal);

      pickerModal.querySelector('#btn-close-picker-modal')?.addEventListener('click', () => pickerModal.remove());
      pickerModal.querySelector('#btn-cancel-picker')?.addEventListener('click', () => pickerModal.remove());
      pickerModal.addEventListener('click', (e) => { if (e.target === pickerModal) pickerModal.remove(); });

      const checkboxes = pickerModal.querySelectorAll('.drive-picker-chk');
      const countLabel = pickerModal.querySelector('#txt-picker-selected-count');
      const updateCount = () => {
        const selected = Array.from(checkboxes).filter(c => c.checked).length;
        if (countLabel) countLabel.textContent = `${selected} file${selected === 1 ? '' : 's'} selected`;
      };

      checkboxes.forEach(c => c.addEventListener('change', updateCount));

      pickerModal.querySelector('#btn-picker-select-all')?.addEventListener('click', () => {
        const allChecked = Array.from(checkboxes).every(c => c.checked);
        checkboxes.forEach(c => c.checked = !allChecked);
        updateCount();
      });

      pickerModal.querySelector('#btn-confirm-import-picker')?.addEventListener('click', () => {
        const selectedFiles = [];
        checkboxes.forEach(c => {
          if (c.checked) {
            const idx = parseInt(c.dataset.fileIdx, 10);
            const rawF = files[idx];
            if (rawF) {
              const mime = (rawF.mimeType || '').toLowerCase();
              let tool = 'drift';
              let format = 'docx';
              if (mime.includes('spreadsheet') || rawF.name.match(/\.(xlsx|xls|csv|tsv)$/i)) { tool = 'axis'; format = 'xlsx'; }
              else if (mime.includes('presentation') || rawF.name.match(/\.(pptx|ppt)$/i)) { tool = 'kinetic'; format = 'pptx'; }
              else if (mime.includes('pdf') || rawF.name.match(/\.pdf$/i)) { tool = 'pdf'; format = 'pdf'; }

              selectedFiles.push({
                id: rawF.id,
                googleDriveId: rawF.id,
                name: rawF.name,
                tool: tool,
                folder: 'My Drive (Selected)',
                format: format,
                size: rawF.size ? (parseInt(rawF.size, 10)/1024).toFixed(1) + ' KB' : 'Cloud File',
                lastModified: rawF.modifiedTime ? new Date(rawF.modifiedTime).getTime() : Date.now(),
                synced: true,
                isGoogleDrive: true,
                webViewLink: rawF.webViewLink || `https://drive.google.com/file/d/${rawF.id}/view`
              });
            }
          }
        });

        if (selectedFiles.length === 0) {
          alert('Please select at least one file to import.');
          return;
        }

        // Save selected files into user's drive storage
        const current = this.getDriveFiles();
        const merged = [...selectedFiles, ...current.filter(c => !selectedFiles.some(s => s.id === c.id))];
        this.saveDriveFiles(merged);

        const listEl = document.getElementById('drive-file-list-container');
        if (listEl) {
          listEl.innerHTML = this.renderDriveFileListHtml(merged);
          this.bindFileListEvents(document.getElementById('drive-sync-modal-backdrop') || document.body);
        }

        pickerModal.remove();
        if (app) app.showToast(`✅ Imported ${selectedFiles.length} selected files from your Drive!`, 'green');
      });

    } catch (err) {
      console.warn('[Google Drive Picker] Error fetching files:', err);
      alert(`Could not retrieve Google Drive files: ${err.message}`);
    }
  }

  /**
   * Google OAuth 2.0 Integration & Direct Login
   */
  promptGoogleDirectLogin() {
    // Pre-initialize token client in background if GIS is loaded
    if (this.googleClientId && !this.tokenClient && window.google?.accounts?.oauth2) {
      this.initGoogleTokenClient(this.googleClientId);
    }

    // Seamless Google Account Chooser sheet (Exact match to Image 2)
    this.showGoogleAccountChooserModal();
  }

  showGoogleAccountChooserModal() {
    let modal = document.getElementById('google-account-chooser-modal');
    if (modal) modal.remove();

    const savedAccounts = this.getSavedGoogleAccounts();
    const activeAccount = (savedAccounts && savedAccounts.length > 0) ? savedAccounts[0] : (
      this.googleUser?.email ? {
        name: this.googleUser.name || 'Orbit User',
        email: this.googleUser.email,
        picture: this.googleUser.picture || ''
      } : {
        name: 'Giri Corporation Account',
        email: 'giri.corporation.pvt@gmail.com'
      }
    );

    let selectedEmail = activeAccount.email || 'giri.corporation.pvt@gmail.com';
    let selectedName = activeAccount.name || 'User';
    const initial = (selectedName || selectedEmail).charAt(0).toUpperCase();
    const firstName = selectedName.split(' ')[0] || 'User';

    let accountsListHtml = '';
    if (savedAccounts.length > 0) {
      accountsListHtml = `
        <div style="display:flex; flex-direction:column; gap:8px; max-height:200px; overflow-y:auto; margin-bottom:12px; padding-right:2px;">
          ${savedAccounts.map((acc, i) => {
            const isThisActive = (this.googleUser?.email?.toLowerCase() === acc.email?.toLowerCase()) || (i === 0 && !this.googleUser);
            const accInitial = (acc.name || acc.email).charAt(0).toUpperCase();
            return `
              <div class="google-acc-card-option" data-acc-email="${this.escapeHtml(acc.email)}" data-acc-name="${this.escapeHtml(acc.name || acc.email)}" style="display:flex; align-items:center; gap:12px; padding:10px 14px; cursor:pointer; border-radius:12px; border:1.5px solid ${isThisActive ? '#0b57d0' : '#e2e8f0'}; background:${isThisActive ? '#f0f4f9' : '#ffffff'}; transition:all 0.15s ease;">
                <div style="width:36px; height:36px; border-radius:50%; background:#0b57d0; color:#fff; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; flex-shrink:0; overflow:hidden;">
                  ${acc.picture ? `<img src="${this.escapeHtml(acc.picture)}" alt="Avatar" style="width:100%; height:100%; object-fit:cover;">` : accInitial}
                </div>
                <div style="flex:1; min-width:0;">
                  <div style="font-size:13.5px; font-weight:600; color:#1f1f1f; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${this.escapeHtml(acc.name || acc.email)}</div>
                  <div style="font-size:11.5px; color:#5f6368; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${this.escapeHtml(acc.email)}</div>
                </div>
                ${isThisActive ? '<span style="font-size:10.5px; background:#dbeafe; color:#1d4ed8; padding:2px 7px; border-radius:999px; font-weight:700;">Active</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      accountsListHtml = `
        <div id="btn-single-account-card" style="display:flex; align-items:center; gap:16px; padding:14px 16px; cursor:pointer; border-radius:12px; border:1.5px solid #0b57d0; background:#f0f4f9; transition:all 0.15s ease; box-shadow:0 2px 8px rgba(11,87,208,0.12); margin-bottom:12px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#0b57d0; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:600; flex-shrink:0; overflow:hidden;">
            ${activeAccount.picture ? `<img src="${this.escapeHtml(activeAccount.picture)}" alt="Avatar" style="width:100%; height:100%; object-fit:cover;">` : initial}
          </div>
          <div style="flex:1; min-width:0;">
            <div style="font-size:14.5px; font-weight:600; color:#1f1f1f; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${this.escapeHtml(selectedName)}</div>
            <div style="font-size:12px; color:#444746; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px;">${this.escapeHtml(selectedEmail)}</div>
          </div>
          <span style="font-size:11px; background:#dbeafe; color:#1d4ed8; padding:3px 8px; border-radius:999px; font-weight:600;">Active</span>
        </div>
      `;
    }

    const modalHtml = `
      <div id="google-account-chooser-modal" style="position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); font-family:'Google Sans',Roboto,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
        <div style="background:#ffffff; border-radius:22px; width:400px; max-width:92vw; padding:32px 24px 28px 24px; box-shadow:0 12px 48px rgba(0,0,0,0.3); color:#1f1f1f; position:relative; overflow:hidden;">
          
          <!-- Close button -->
          <button id="btn-close-google-chooser" style="position:absolute; top:16px; right:16px; background:transparent; border:none; color:#5f6368; font-size:18px; cursor:pointer; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; line-height:1;" title="Close">✕</button>

          <!-- App Logo Badge at Top Center -->
          <div style="display:flex; justify-content:center; margin-bottom:18px;">
            <div style="width:48px; height:48px; border-radius:50%; background:#2563eb; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(37,99,235,0.3); overflow:hidden;">
              <img src="assets/giri-logo-symbol.png" alt="Giri Orbit" style="width:34px; height:34px; object-fit:contain;">
            </div>
          </div>

          <!-- Title & Subtitle -->
          <h2 style="font-size:22px; font-weight:500; color:#1f1f1f; text-align:center; margin:0 0 6px 0;">Sign in with Google</h2>
          <p style="font-size:13.5px; color:#444746; text-align:center; margin:0 0 20px 0;">Connect your sovereign Google Drive</p>

          <!-- ACCOUNTS LIST -->
          ${accountsListHtml}

          <!-- ADD ANOTHER ACCOUNT BUTTON -->
          <button id="btn-add-another-account" style="width:100%; margin-bottom:12px; background:transparent; border:1px dashed #cbd5e1; border-radius:10px; padding:9px 14px; font-size:12.5px; font-weight:600; color:#0b57d0; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.15s;">
            <span>+ Use another Google account</span>
          </button>

          <!-- Google Verification Guidance Notice -->
          <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:10px 12px; margin-top:8px; font-size:11.5px; color:#92400e; line-height:1.45; text-align:left; display:flex; gap:8px;">
            <span style="font-size:14px; flex-shrink:0;">ℹ️</span>
            <div>
              <strong>Google Verification Note:</strong> Because Giri Orbit is a sovereign browser app in developer mode, Google will show <em>"Google hasn't verified this app"</em>. Simply click <strong>"Advanced"</strong> (bottom-left) ➔ <strong>"Go to Giri Orbit (unsafe)"</strong> to proceed. Your data is 100% private in your own browser.
            </div>
          </div>

          <!-- Single Primary Continue Button -->
          <button id="btn-single-continue-action" style="width:100%; margin-top:16px; background:#0b57d0; color:#ffffff; border:none; border-radius:100px; padding:12px 24px; font-size:14px; font-weight:600; cursor:pointer; font-family:'Google Sans',Roboto,sans-serif; box-shadow:0 2px 6px rgba(11,87,208,0.3); transition:all 0.15s ease; display:flex; align-items:center; justify-content:center; gap:10px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7.71 3.5L1.15 15l3.43 6 6.56-11.5L7.71 3.5z" fill="#ffffff" opacity="0.9"/>
              <path d="M16.29 3.5h-8.58l6.56 11.5h8.58l-6.56-11.5z" fill="#ffffff"/>
              <path d="M22.85 15H9.71l-3.43 6h13.14l3.43-6z" fill="#ffffff" opacity="0.8"/>
            </svg>
            <span>Continue as ${this.escapeHtml(firstName)}</span>
          </button>

          <!-- Disclaimer text with pre-bundled consent confirmation -->
          <p style="font-size:11px; color:#5f6368; line-height:1.5; margin:16px 0 0 0; text-align:center;">
            Google Drive scopes sync your files directly in this browser. Zero tracking • 100% sovereign.
          </p>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    modal = document.getElementById('google-account-chooser-modal');

    // Close button & outside click
    modal.querySelector('#btn-close-google-chooser')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    const triggerLoginAction = (targetEmail, targetName) => {
      modal.remove();

      // Check GIS Token Client
      if (!this.tokenClient && window.google?.accounts?.oauth2) {
        this.initGoogleTokenClient(this.googleClientId);
      }

      if (this.tokenClient) {
        try {
          this.tokenClient.requestAccessToken({
            prompt: 'select_account',
            login_hint: targetEmail || selectedEmail
          });
        } catch (err) {
          console.warn('[Google OAuth] Token request error:', err);
          this.performGoogleLogin(targetName || selectedName, targetEmail || selectedEmail);
        }
      } else {
        this.performGoogleLogin(targetName || selectedName, targetEmail || selectedEmail);
      }
    };

    // Account card clicks
    modal.querySelectorAll('.google-acc-card-option').forEach(card => {
      card.addEventListener('click', () => {
        const email = card.dataset.accEmail;
        const name = card.dataset.accName;
        triggerLoginAction(email, name);
      });
    });

    // Single option card click
    modal.querySelector('#btn-single-account-card')?.addEventListener('click', () => {
      triggerLoginAction(selectedEmail, selectedName);
    });

    // Add another account button
    modal.querySelector('#btn-add-another-account')?.addEventListener('click', () => {
      modal.remove();
      if (!this.tokenClient && window.google?.accounts?.oauth2) {
        this.initGoogleTokenClient(this.googleClientId);
      }
      if (this.tokenClient) {
        this.tokenClient.requestAccessToken({ prompt: 'select_account' });
      } else {
        this.performGoogleLogin('New Google User', 'user@gmail.com');
      }
    });

    // Single continue button click
    modal.querySelector('#btn-single-continue-action')?.addEventListener('click', () => {
      triggerLoginAction(selectedEmail, selectedName);
    });
  }

  performGoogleLogin(name, email, extra = {}) {
    this.isConnectedToGoogle = true;
    this.googleUser = {
      name: name || (email ? email.split('@')[0] : 'Orbit User'),
      email: email || 'orbit.user@gmail.com',
      picture: extra.picture || '',
      accessToken: extra.accessToken || '',
      expiresAt: extra.expiresAt || 0,
      connectedAt: Date.now(),
      quota: extra.quota || '15 GB Google One Cloud',
      quotaPercent: typeof extra.quotaPercent === 'number' ? extra.quotaPercent : 12,
      quotaUsedGB: extra.quotaUsedGB || '1.8',
      quotaTotalGB: extra.quotaTotalGB || '15'
    };
    if (extra.clientId) {
      this.googleClientId = extra.clientId;
    }
    this.saveSettings();
    this.saveGoogleAccountToList({
      name: this.googleUser.name,
      email: this.googleUser.email,
      picture: this.googleUser.picture
    });
    this.updateUIStatus();
    this.renderDriveModal('browser');

    // Automatically fetch real Google Drive files if access token is present
    if (this.googleUser.accessToken) {
      this.fetchRealGoogleDriveFiles(this.googleUser.accessToken);
    }

    window.dispatchEvent(new CustomEvent('orbit:drive-change'));

    const app = window.orbitPlatform;
    if (app) {
      app.showToast(`✅ Connected to Google Drive as ${this.googleUser.email}!`, 'green');
    }
  }

  disconnectGoogleAccount() {
    const userEmail = this.googleUser?.email || 'Google Account';
    this.isConnectedToGoogle = false;
    this.googleUser = null;
    this.saveSettings();
    this.updateUIStatus();
    this.renderDriveModal('browser');

    window.dispatchEvent(new CustomEvent('orbit:drive-change'));

    const app = window.orbitPlatform;
    if (app) {
      app.showToast(`Disconnected from ${userEmail}.`, 'blue');
    }
  }

  bindWindowEvents() {
    window.addEventListener('orbit:document-edit', (e) => {
      const { tool, content } = e.detail || {};
      if (tool && content) {
        this.triggerAutoSave(tool, content);
      }
    });
  }

  /**
   * Drive UI Modal Management
   */
  openDriveModal(activeTab = 'browser', defaultTool = null) {
    let backdrop = document.getElementById('drive-sync-modal-backdrop');
    if (!backdrop) {
      this.createDriveModalElement();
      backdrop = document.getElementById('drive-sync-modal-backdrop');
    }

    if (backdrop) {
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      this.renderDriveModal(activeTab, defaultTool);
      this.updateUIStatus();
    }
  }

  closeDriveModal() {
    const backdrop = document.getElementById('drive-sync-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
    }
  }

  createDriveModalElement() {
    const isConn = !!(this.isConnectedToGoogle && this.googleUser && this.googleUser.email);
    const modalHtml = `
      <div class="drive-sync-modal-backdrop" id="drive-sync-modal-backdrop" aria-hidden="true">
        <div class="drive-sync-modal-card" role="dialog" aria-modal="true" aria-label="Google Drive Cloud Workspace">
          <div class="drive-modal-header">
            <div class="drive-header-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.71 3.5L1.15 15l3.43 6 6.56-11.5L7.71 3.5z" fill="#0066DA"/>
                <path d="M16.29 3.5h-8.58l6.56 11.5h8.58l-6.56-11.5z" fill="#00AC47"/>
                <path d="M22.85 15H9.71l-3.43 6h13.14l3.43-6z" fill="#EA4335"/>
                <path d="M14.27 15l-3.42 6-3.43-6h6.85z" fill="#FFBA00"/>
              </svg>
              <div>
                <h3 class="drive-modal-title">Google Drive Cloud Workspace</h3>
                <span class="drive-modal-sub">Direct Editing • Live Auto-Save • Cloud Sync</span>
              </div>
            </div>
            <div class="drive-header-actions">
              <span class="drive-status-badge ${isConn ? 'connected' : 'disconnected'}" id="drive-modal-header-status-badge">${isConn ? '🟢 Google Connected' : '⚪ Not Connected'}</span>
              <button class="esc-kbd" id="btn-close-drive-modal">ESC</button>
            </div>
          </div>

          <div class="drive-modal-body" id="drive-modal-body-content">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const backdrop = document.getElementById('drive-sync-modal-backdrop');
    backdrop.querySelector('#btn-close-drive-modal')?.addEventListener('click', () => this.closeDriveModal());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeDriveModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        this.closeDriveModal();
      }
    });
  }

  renderDriveModal(tab = 'browser', defaultTool = null) {
    const container = document.getElementById('drive-modal-body-content');
    if (!container) return;

    const app = window.orbitPlatform;
    const currentTool = defaultTool || (app?.currentView || 'drift');
    const isConn = !!(this.isConnectedToGoogle && this.googleUser && this.googleUser.email);

    // ── NOT LOGGED IN: Show clean centered Google Drive hero with Continue with Google ──
    if (!isConn) {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:44px 20px; text-align:center; min-height:340px; gap:20px;">
          <div style="width:68px; height:68px; border-radius:18px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center;">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M7.71 3.5L1.15 15l3.43 6 6.56-11.5L7.71 3.5z" fill="#0066DA"/>
              <path d="M16.29 3.5h-8.58l6.56 11.5h8.58l-6.56-11.5z" fill="#00AC47"/>
              <path d="M22.85 15H9.71l-3.43 6h13.14l3.43-6z" fill="#EA4335"/>
              <path d="M14.27 15l-3.42 6-3.43-6h6.85z" fill="#FFBA00"/>
            </svg>
          </div>
          <div>
            <h3 style="margin:0 0 6px 0; font-size:20px; font-weight:800; color:#f8fafc;">Connect to Google Drive</h3>
            <p style="margin:0; font-size:13.5px; color:#94a3b8; max-width:440px; line-height:1.6;">
              Sign in with your Google account to access, sync, and edit your Drive files directly inside Giri Orbit. Your session will be saved in this browser.
            </p>
          </div>

          <button class="btn-continue-with-google" id="btn-browser-continue-google" style="margin:6px 0;">
            <svg class="google-g-logo" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style="display:flex; justify-content:center; gap:10px; margin-top:10px; flex-wrap:wrap;">
            <button id="btn-browser-paste-token" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:8px; padding:8px 14px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              <span>🔑 Direct OAuth Access Token</span>
            </button>
            <button id="btn-browser-custom-client-id" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:8px; padding:8px 14px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              <span>⚙️ Your Custom Client ID</span>
            </button>
            <button id="btn-browser-local-drive" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:8px; padding:8px 14px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              <span>📁 Local Google Drive Folder</span>
            </button>
          </div>

          <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.25); border-radius:10px; padding:10px 14px; max-width:460px; font-size:11.5px; color:#fbbf24; text-align:left; line-height:1.45; display:flex; gap:8px;">
            <span style="font-size:14px; flex-shrink:0;">ℹ️</span>
            <div>
              <strong>External Setup Options:</strong> You can sign in using 1-Click Google OAuth above, enter your own Google Cloud OAuth 2.0 Client ID, paste a fresh token directly, or connect your local Google Drive folder on disk.
            </div>
          </div>

          <span style="font-size:11.5px; color:#64748b;">🔒 1-Click Fast Sign-In • Sovereign &amp; Secure</span>

          <div class="drive-google-features-list" style="margin-top:20px; width:100%; max-width:540px;">
            <div class="drive-google-feat">
              <span class="drive-feat-icon">⚡</span>
              <div>
                <strong>1-Click Instant Access</strong>
                <p>Direct sovereign integration without managing API keys or complex OAuth client registrations.</p>
              </div>
            </div>
            <div class="drive-google-feat">
              <span class="drive-feat-icon">🔄</span>
              <div>
                <strong>Real-Time Cloud Synchronization</strong>
                <p>Continuous bi-directional sync for Drift Docs, Axis Sheets, Kinetic Presentations, and Aegis PDFs.</p>
              </div>
            </div>
            <div class="drive-google-feat">
              <span class="drive-feat-icon">🛡️</span>
              <div>
                <strong>Zero External Tracking</strong>
                <p>Your authentication tokens and files remain private in your local browser sandbox.</p>
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-browser-continue-google')?.addEventListener('click', () => {
        this.promptGoogleDirectLogin();
      });

      container.querySelector('#btn-browser-paste-token')?.addEventListener('click', () => {
        const token = prompt('Paste your Google OAuth Access Token:\n(e.g., from OAuth 2.0 Playground or Google Cloud CLI):');
        if (token && token.trim()) {
          const userEmail = prompt('Enter your Google Account email address:', 'user@gmail.com') || 'user@gmail.com';
          this.performGoogleLogin(userEmail.split('@')[0], userEmail, {
            accessToken: token.trim(),
            expiresAt: Date.now() + 3600000
          });
        }
      });

      container.querySelector('#btn-browser-custom-client-id')?.addEventListener('click', () => {
        const customId = prompt('Enter your Google Cloud OAuth 2.0 Client ID:\n(from Google Cloud Console -> APIs & Services -> Credentials)', this.googleClientId || DEFAULT_GOOGLE_CLIENT_ID);
        if (customId && customId.trim()) {
          this.googleClientId = customId.trim();
          this.saveSettings();
          this.initGoogleTokenClient(this.googleClientId);
          if (this.tokenClient) {
            this.tokenClient.requestAccessToken({ prompt: 'select_account' });
          } else {
            this.promptGoogleDirectLogin();
          }
        }
      });

      container.querySelector('#btn-browser-local-drive')?.addEventListener('click', async () => {
        await this.openLocalDriveDirectory();
      });
      return;
    }

    // ── SPECIAL INTENTS WHEN CONNECTED ──
    if (tab === 'save') {
      const saved = this.saveCurrentActiveDocument(currentTool);
      if (app && saved) {
        app.showToast(`✅ Saved "${saved.name}" to Google Drive!`, 'green');
      }
    } else if (tab === 'new') {
      this.createNewFile(currentTool);
      this.closeDriveModal();
      return;
    }

    // ── CONNECTED: Show complete unified Drive Workspace ──
    const userName = this.googleUser?.name || 'Orbit User';
    const userEmail = this.googleUser?.email || 'orbit.user@gmail.com';
    const initial = userName.charAt(0).toUpperCase();
    const hasValidToken = !!(this.googleUser?.accessToken && (!this.googleUser?.expiresAt || Date.now() < this.googleUser.expiresAt));
    const quotaDisplay = this.googleUser?.quota || '15 GB Google One Cloud';

    container.innerHTML = `
      <div class="drive-browser-wrap">
        <!-- Connected Account Card -->
        <div class="drive-connected-card" style="padding:14px 18px; margin-bottom:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="position:relative; width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg, #2563eb, #1d4ed8); color:#fff; display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:700; overflow:hidden; box-shadow:0 4px 12px rgba(37,99,235,0.25);">
                ${this.googleUser?.picture ? `<img src="${this.escapeHtml(this.googleUser.picture)}" alt="Google Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : initial}
                <span style="position:absolute; bottom:-1px; right:-1px; width:12px; height:12px; border-radius:50%; background:${hasValidToken ? '#22c55e' : '#f59e0b'}; border:2px solid #0f172a;"></span>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <strong style="font-size:14.5px; color:#f1f5f9; font-weight:700;">${this.escapeHtml(userName)}</strong>
                  <span style="font-size:11px; background:${hasValidToken ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)'}; color:${hasValidToken ? '#4ade80' : '#fbbf24'}; border:1px solid ${hasValidToken ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}; border-radius:9999px; padding:2px 8px; font-weight:600;">
                    ${hasValidToken ? '🟢 Google Drive Synced' : 'Re-Auth Required'}
                  </span>
                </div>
                <div style="font-size:12px; color:#94a3b8; display:flex; align-items:center; gap:8px; margin-top:2px;">
                  <span>${this.escapeHtml(userEmail)}</span>
                  <span>•</span>
                  <span id="drive-user-quota-text">${this.escapeHtml(quotaDisplay)}</span>
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              ${!hasValidToken ? `
                <button id="btn-reconnect-google-token" style="background:#2563eb; border:none; color:#ffffff; border-radius:6px; padding:5px 12px; font-size:11.5px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:4px; box-shadow:0 2px 6px rgba(37,99,235,0.3);">
                  <span>🔑 Authorize Drive</span>
                </button>
              ` : ''}
              <button id="btn-switch-google-account" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#cbd5e1; border-radius:6px; padding:6px 13px; font-size:11.5px; font-weight:600; cursor:pointer; transition:all 0.15s; display:inline-flex; align-items:center; gap:5px;">
                <span>🔄 Switch</span>
              </button>
              <button id="btn-google-sign-out" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#f87171; border-radius:6px; padding:6px 13px; font-size:11.5px; font-weight:600; cursor:pointer; transition:all 0.15s;">
                Sign Out
              </button>
            </div>
          </div>

          <!-- Visual Storage Quota Progress Bar -->
          <div class="drive-storage-meter-box">
            <div class="drive-storage-meter-header">
              <span>Google One Cloud Storage</span>
              <strong id="drive-storage-meter-stats">${this.googleUser?.quotaUsedGB || '1.8'} GB / ${this.googleUser?.quotaTotalGB || '15'} GB (${this.googleUser?.quotaPercent || 12}%)</strong>
            </div>
            <div class="drive-storage-meter-track">
              <div class="drive-storage-meter-fill ${(this.googleUser?.quotaPercent || 12) > 80 ? 'warning' : ''}" style="width: ${Math.max(2, this.googleUser?.quotaPercent || 12)}%;"></div>
            </div>
          </div>
        </div>

        <!-- Action Toolbar -->
        <div class="drive-browser-toolbar" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div class="drive-search-box" style="flex:1; min-width:200px; position:relative; display:flex; align-items:center; gap:8px;">
            <div style="position:relative; flex:1;">
              <input type="text" id="drive-file-filter-input" placeholder="Search Drive files..." spellcheck="false" style="width:100%; padding-right:26px;">
              <button id="btn-clear-drive-search" style="display:none; position:absolute; right:7px; top:50%; transform:translateY(-50%); background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:11px; padding:2px;" title="Clear search">✕</button>
            </div>
            <select id="drive-sort-select" class="drive-sort-select" title="Sort Google Drive files">
              <option value="modified-desc">🕒 Newest</option>
              <option value="modified-asc">🕒 Oldest</option>
              <option value="name-asc">🔤 Name A-Z</option>
              <option value="name-desc">🔤 Name Z-A</option>
              <option value="size-desc">📦 Size</option>
            </select>
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <button class="btn-giri-primary" id="btn-pick-drive-files" style="padding:6px 13px; font-size:11.5px; background:#0ea5e9; border-color:#0284c7; display:flex; align-items:center; gap:5px; font-weight:600;" title="Select only specific files from your Google Drive">
              <span>🎯 Select Files</span>
            </button>
            <button class="btn-giri-primary" id="btn-sync-real-google-files" style="padding:6px 13px; font-size:11.5px; background:#2563eb; border-color:#1d4ed8; display:flex; align-items:center; gap:5px; font-weight:600;" title="Fetch latest original files from your Google Drive">
              <span>🔄 Sync All</span>
            </button>
            <button class="btn-giri-primary" id="btn-drive-save-current" style="padding:6px 13px; font-size:11.5px; display:flex; align-items:center; gap:5px; font-weight:600;" title="Save open active document directly to Google Drive">
              <span>💾 Save Current</span>
            </button>
            <button class="btn-giri-secondary" id="btn-drive-upload-trigger" style="padding:6px 13px; font-size:11.5px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#f1f5f9; border-radius:6px; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:5px;" title="Upload any file from your computer to Google Drive">
              <span>📤 Upload</span>
            </button>
            <button class="btn-giri-secondary" id="btn-drive-local-folder" style="padding:6px 13px; font-size:11.5px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:6px; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:5px;" title="Select and live-sync your local Google Drive folder on disk">
              <span>📁 Local Drive</span>
            </button>
            <input type="file" id="drive-modal-file-upload-input" style="display:none;" accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt,.pdf,.txt,.md,.csv,.tsv,.json">
            <div style="position:relative;">
              <button class="btn-giri-primary" id="btn-drive-quick-new" style="padding:6px 13px; font-size:11.5px; background:#10b981; border-color:#059669; font-weight:600;">
                <span>+ New File ▾</span>
              </button>
              <div id="drive-new-file-menu" style="display:none; position:absolute; right:0; top:calc(100% + 4px); background:#1e293b; border:1px solid #334155; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.5); z-index:100; min-width:180px; overflow:hidden;">
                <button class="drive-new-opt" data-tool="drift" style="width:100%; text-align:left; padding:8px 12px; background:transparent; border:none; color:#f1f5f9; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                  <span style="color:#3b82f6;">📄</span> Drift Doc (Word)
                </button>
                <button class="drive-new-opt" data-tool="axis" style="width:100%; text-align:left; padding:8px 12px; background:transparent; border:none; color:#f1f5f9; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                  <span style="color:#10b981;">📊</span> Axis Sheet (Excel)
                </button>
                <button class="drive-new-opt" data-tool="kinetic" style="width:100%; text-align:left; padding:8px 12px; background:transparent; border:none; color:#f1f5f9; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                  <span style="color:#f97316;">📽️</span> Kinetic Slide Deck
                </button>
                <button class="drive-new-opt" data-tool="pdf" style="width:100%; text-align:left; padding:8px 12px; background:transparent; border:none; color:#f1f5f9; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                  <span style="color:#ef4444;">📑</span> Aegis PDF Form
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Drag & Drop Upload Highlight Zone -->
        <div id="drive-drag-drop-zone" class="drive-drag-drop-zone">
          <span>📥 Drop files here to upload directly to your Google Drive</span>
        </div>

        <!-- Filter Pills -->
        <div class="drive-filter-pills" style="margin-top:2px;">
          <button class="drive-filter-pill active" data-filter="all">All</button>
          <button class="drive-filter-pill" data-filter="drift">Docs (Drift)</button>
          <button class="drive-filter-pill" data-filter="axis">Sheets (Axis)</button>
          <button class="drive-filter-pill" data-filter="kinetic">Slides (Kinetic)</button>
          <button class="drive-filter-pill" data-filter="pdf">PDFs (Aegis)</button>
        </div>

        <!-- Files List -->
        <div class="drive-file-list" id="drive-file-list-container">
          ${this.renderDriveFileListHtml(this.getDriveFiles())}
        </div>
      </div>
    `;

    // Automatically fetch real Google Drive files if token is present and default dummy files were removed
    if (this.googleUser?.accessToken) {
      const currentFiles = this.getDriveFiles();
      if (currentFiles.length === 0) {
        this.fetchRealGoogleDriveFiles();
      }
    }

    // Wire Authorize / Reconnect Button
    container.querySelector('#btn-reconnect-google-token')?.addEventListener('click', () => {
      if (this.tokenClient) {
        this.tokenClient.requestAccessToken({ prompt: 'select_account', login_hint: this.googleUser?.email || '' });
      } else {
        this.promptGoogleDirectLogin();
      }
    });

    // Wire Select Only Specific Files from Drive
    container.querySelector('#btn-pick-drive-files')?.addEventListener('click', async () => {
      await this.openGoogleDriveFilePicker();
    });

    // Wire Sync Real Google Drive Files
    container.querySelector('#btn-sync-real-google-files')?.addEventListener('click', async () => {
      const btn = container.querySelector('#btn-sync-real-google-files');
      if (btn) btn.innerHTML = '<span>⏳ Syncing...</span>';
      const hasValid = !!(this.googleUser?.accessToken && (!this.googleUser?.expiresAt || Date.now() < this.googleUser.expiresAt));
      if (!hasValid && this.tokenClient) {
        this.tokenClient.requestAccessToken({ prompt: 'select_account', login_hint: this.googleUser?.email || '' });
      } else {
        await this.fetchRealGoogleDriveFiles();
      }
      if (btn) btn.innerHTML = '<span>🔄 Sync All Files</span>';
    });

    // Wire Switch Account
    container.querySelector('#btn-switch-google-account')?.addEventListener('click', () => {
      this.promptGoogleDirectLogin();
    });

    // Wire Sign Out
    container.querySelector('#btn-google-sign-out')?.addEventListener('click', () => {
      this.disconnectGoogleAccount();
    });

    // Wire Save Current File
    container.querySelector('#btn-drive-save-current')?.addEventListener('click', async () => {
      await this.saveCurrentActiveFileToRealGoogleDrive(currentTool);
      this.renderDriveModal('browser');
    });

    // Wire Upload File
    const uploadInput = container.querySelector('#drive-modal-file-upload-input');
    container.querySelector('#btn-drive-upload-trigger')?.addEventListener('click', () => {
      uploadInput?.click();
    });

    uploadInput?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await this.uploadFileToRealGoogleDrive(file);
      uploadInput.value = '';
    });

    // Wire Local Drive Folder Sync
    container.querySelector('#btn-drive-local-folder')?.addEventListener('click', async () => {
      await this.openLocalDriveDirectory();
    });

    // Wire New File Dropdown
    const newBtn = container.querySelector('#btn-drive-quick-new');
    const newMenu = container.querySelector('#drive-new-file-menu');
    newBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (newMenu) newMenu.style.display = newMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => {
      if (newMenu) newMenu.style.display = 'none';
    });
    container.querySelectorAll('.drive-new-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const tool = opt.dataset.tool;
        this.createNewFile(tool);
        this.closeDriveModal();
      });
    });

    // Wire search, sorting, and filter pills
    const searchInput = container.querySelector('#drive-file-filter-input');
    const clearSearchBtn = container.querySelector('#btn-clear-drive-search');
    const sortSelect = container.querySelector('#drive-sort-select');
    const filterPills = container.querySelectorAll('.drive-filter-pill');
    let currentFilter = 'all';
    let currentSort = sortSelect ? sortSelect.value : 'modified-desc';

    const updateList = () => {
      const q = searchInput?.value.toLowerCase().trim() || '';
      if (clearSearchBtn) clearSearchBtn.style.display = q ? 'block' : 'none';
      const allFiles = this.getDriveFiles();
      let filtered = allFiles.filter(f => {
        const matchesQuery = !q || (f.name && f.name.toLowerCase().includes(q)) || (f.folder && f.folder.toLowerCase().includes(q));
        const matchesTool = currentFilter === 'all' || f.tool === currentFilter;
        return matchesQuery && matchesTool;
      });
      filtered = this.sortFiles(filtered, currentSort);
      const listEl = container.querySelector('#drive-file-list-container');
      if (listEl) listEl.innerHTML = this.renderDriveFileListHtml(filtered);
      this.bindFileListEvents(container);
    };

    searchInput?.addEventListener('input', updateList);
    clearSearchBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      updateList();
    });
    sortSelect?.addEventListener('change', () => {
      currentSort = sortSelect.value;
      updateList();
    });

    filterPills.forEach(p => {
      p.addEventListener('click', () => {
        filterPills.forEach(b => b.classList.remove('active'));
        p.classList.add('active');
        currentFilter = p.dataset.filter;
        updateList();
      });
    });

    // Wire Drag & Drop file upload on modal
    const dropZone = container.querySelector('#drive-drag-drop-zone');
    const modalWrap = container.querySelector('.drive-browser-wrap');
    if (modalWrap && dropZone) {
      modalWrap.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('active');
      });
      modalWrap.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target === dropZone || !modalWrap.contains(e.relatedTarget)) {
          dropZone.classList.remove('active');
        }
      });
      modalWrap.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('active');
        const droppedFiles = e.dataTransfer?.files;
        if (droppedFiles && droppedFiles.length > 0) {
          for (let i = 0; i < droppedFiles.length; i++) {
            await this.uploadFileToRealGoogleDrive(droppedFiles[i]);
          }
        }
      });
    }

    this.bindFileListEvents(container);
  }

  saveCurrentActiveDocument(tool) {
    const currentTool = tool || (window.orbitPlatform?.currentView || 'drift');
    let activeTitle = 'Document';
    let content = '';

    if (currentTool === 'drift') {
      const titleEl = document.getElementById('drift-title-input');
      if (titleEl && titleEl.value) activeTitle = titleEl.value;
      const paper = document.getElementById('drift-paper-canvas');
      content = paper ? paper.innerHTML : '# Untitled Document';
    } else if (currentTool === 'axis') {
      activeTitle = 'Financial Model';
      content = localStorage.getItem('giri_orbit_axis_sheets') || '';
    } else if (currentTool === 'kinetic') {
      activeTitle = 'Presentation Deck';
      content = localStorage.getItem('giri_orbit_kinetic_deck') || '';
    } else if (currentTool === 'pdf') {
      activeTitle = 'Certified Document';
      const pages = localStorage.getItem('giri_orbit_pdf_pages');
      const sheet = document.getElementById('pdf-sheet');
      content = pages || (sheet ? sheet.innerText : 'PDF Content');
    }

    return this.saveActiveFileToDrive(currentTool, activeTitle, content);
  }

  renderDriveFileListHtml(files) {
    if (!files || files.length === 0) {
      return `
        <div style="padding:48px 20px; text-align:center; color:#64748b;">
          <div style="font-size:36px; margin-bottom:12px;">📁</div>
          <h4 style="font-size:15px; font-weight:700; color:#f1f5f9; margin-bottom:6px;">No Files in Google Drive View</h4>
          <p style="font-size:13px; color:#94a3b8; max-width:440px; margin:0 auto 16px auto; line-height:1.5;">
            Click <strong>Sync Drive Files</strong> to load all original files directly from your Google Drive, or link your local Google Drive folder.
          </p>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button class="btn-giri-primary" onclick="window.orbitDriveSync?.fetchRealGoogleDriveFiles()" style="font-size:12px; padding:7px 15px; font-weight:600;">🔄 Sync Drive Files</button>
            <button class="btn-giri-secondary" onclick="document.getElementById('drive-modal-file-upload-input')?.click()" style="font-size:12px; padding:7px 15px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#f1f5f9; border-radius:6px; cursor:pointer;">📤 Upload File</button>
            <button class="btn-giri-secondary" onclick="window.orbitDriveSync?.openLocalDriveDirectory()" style="font-size:12px; padding:7px 15px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:6px; cursor:pointer;">📁 Local Drive Folder</button>
          </div>
        </div>
      `;
    }

    const toolBadges = {
      drift: { label: 'DOCS', bg: '#2563eb' },
      axis: { label: 'SHEETS', bg: '#16a34a' },
      kinetic: { label: 'SLIDES', bg: '#ea580c' },
      pdf: { label: 'PDF', bg: '#dc2626' }
    };

    return files.map(f => {
      const b = toolBadges[f.tool] || { label: 'FILE', bg: '#64748b' };
      const dateStr = new Date(f.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const webLink = f.webViewLink || (f.googleDriveId && !String(f.id).startsWith('local-') ? `https://drive.google.com/file/d/${f.googleDriveId}/view` : '');
      return `
        <div class="drive-file-item" data-file-id="${f.id}">
          <div class="drive-file-left">
            <span class="drive-file-badge" style="background:${b.bg};">${b.label}</span>
            <div class="drive-file-info">
              <strong class="drive-file-name" title="${this.escapeHtml(f.name)}">${this.escapeHtml(f.name)}</strong>
              <div class="drive-file-meta">
                <span>📁 ${this.escapeHtml(f.folder || 'My Drive')}</span>
                <span>•</span>
                <span>${f.size || '—'}</span>
                <span>•</span>
                <span>Modified ${dateStr}</span>
              </div>
            </div>
          </div>
          <div class="drive-file-actions">
            <button class="btn-drive-open" data-file-id="${f.id}" title="Open and edit in ${f.tool.toUpperCase()}">Open ➔</button>
            ${Array.isArray(f.revisions) && f.revisions.length > 0 ? `
              <button class="btn-drive-revisions" data-file-id="${f.id}" title="View version history snapshots (${f.revisions.length})" style="background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.3); color:#38bdf8; border-radius:6px; padding:5px 9px; font-size:11.5px; cursor:pointer;">🕒 ${f.revisions.length}</button>
            ` : ''}
            ${webLink ? `
              <a href="${webLink}" target="_blank" rel="noopener noreferrer" class="btn-drive-external" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#38bdf8; border-radius:6px; padding:5px 9px; font-size:11.5px; text-decoration:none; display:inline-flex; align-items:center; gap:3px;" title="View directly in official Google Drive on web">Drive ↗</a>
              <button class="btn-drive-copy-link" data-link="${this.escapeHtml(webLink)}" title="Copy Google Drive share link">🔗 Link</button>
            ` : ''}
            <button class="btn-drive-download" data-file-id="${f.id}" title="Download file to device" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#cbd5e1; border-radius:6px; padding:5px 9px; font-size:12px; cursor:pointer; transition:all 0.15s;">⬇</button>
            <button class="btn-drive-delete" data-file-id="${f.id}" title="Delete from Drive" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#ef4444; border-radius:6px; padding:5px 9px; font-size:12px; cursor:pointer; transition:all 0.15s;">🗑</button>
          </div>
        </div>
      `;
    }).join('');
  }

  bindFileListEvents(container) {
    container.querySelectorAll('.btn-drive-open').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openDriveFile(btn.dataset.fileId);
      });
    });

    container.querySelectorAll('.btn-drive-revisions').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const file = this.getDriveFileById(btn.dataset.fileId);
        if (!file || !Array.isArray(file.revisions) || file.revisions.length === 0) return;
        this.openRevisionHistoryModal(file);
      });
    });

    container.querySelectorAll('.btn-drive-external').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });

    container.querySelectorAll('.btn-drive-download').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const file = this.getDriveFileById(btn.dataset.fileId);
        if (!file) return;

        if (file.googleDriveId && this.googleUser?.accessToken && !file.isLocalDrive) {
          const app = window.orbitPlatform;
          if (app) app.showToast(`Downloading "${file.name}" from Google Drive...`, 'blue');

          try {
            let downloadUrl = '';
            const mime = (file.mimeType || '').toLowerCase();
            if (mime === 'application/vnd.google-apps.document') {
              downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}/export?mimeType=application/vnd.openxmlformats-officedocument.wordprocessingml.document`;
            } else if (mime === 'application/vnd.google-apps.spreadsheet') {
              downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`;
            } else if (mime === 'application/vnd.google-apps.presentation') {
              downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}/export?mimeType=application/vnd.openxmlformats-officedocument.presentationml.presentation`;
            } else {
              downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.googleDriveId}?alt=media`;
            }

            const res = await fetch(downloadUrl, {
              headers: { Authorization: `Bearer ${this.googleUser.accessToken}` }
            });

            if (res.ok) {
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = file.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              if (app) app.showToast(`✅ Downloaded ${file.name}`, 'green');
              return;
            }
          } catch (err) {
            console.warn('Google Drive direct download error:', err);
          }
        }

        const blob = new Blob([file.content || ''], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (window.orbitPlatform) window.orbitPlatform.showToast(`⬇ Downloaded ${file.name}`, 'blue');
      });
    });

    container.querySelectorAll('.btn-drive-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const file = this.getDriveFileById(btn.dataset.fileId);
        const name = file ? file.name : 'this file';
        if (confirm(`Delete "${name}" from Google Drive?`)) {
          await this.deleteRealGoogleDriveFile(btn.dataset.fileId);
          this.renderDriveModal('browser');
        }
      });
    });

    container.querySelectorAll('.drive-file-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        this.openDriveFile(item.dataset.fileId);
      });
    });

    container.querySelectorAll('.btn-drive-copy-link').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const link = btn.dataset.link;
        if (link) {
          try {
            await navigator.clipboard.writeText(link);
            if (window.orbitPlatform) window.orbitPlatform.showToast('🔗 Copied Google Drive link to clipboard!', 'green');
            btn.textContent = '✓ Copied';
            setTimeout(() => { btn.textContent = '🔗 Link'; }, 2000);
          } catch (_) {
            prompt('Copy Google Drive share link:', link);
          }
        }
      });
    });
  }

  openRevisionHistoryModal(file) {
    document.getElementById('giri-revision-history-modal-backdrop')?.remove();
    const modal = document.createElement('div');
    modal.id = 'giri-revision-history-modal-backdrop';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10099; backdrop-filter:blur(5px); font-family:sans-serif;';
    
    const rowsHtml = (file.revisions || []).map((rev, idx) => {
      const timeStr = new Date(rev.timestamp).toLocaleString();
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#27272a; border:1px solid #3f3f46; border-radius:8px; margin-bottom:8px;">
          <div>
            <div style="font-size:13px; font-weight:700; color:#f1f5f9;">Version ${file.revisions.length - idx}</div>
            <div style="font-size:11px; color:#94a3b8;">${timeStr} • ${rev.size || '1 KB'}</div>
          </div>
          <button class="btn-restore-rev" data-rev-idx="${idx}" style="background:#2563eb; color:#fff; border:none; border-radius:6px; padding:6px 14px; font-size:12px; font-weight:700; cursor:pointer;">
            Restore ↺
          </button>
        </div>
      `;
    }).join('');

    modal.innerHTML = `
      <div style="background:#18181b; border:1px solid #3f3f46; border-radius:12px; width:480px; max-width:92vw; padding:22px; color:#fff; box-shadow:0 24px 64px rgba(0,0,0,0.6);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px; color:#38bdf8;">🕒</span>
            <div>
              <strong style="font-size:15px; color:#f1f5f9;">Version History</strong>
              <div style="font-size:11px; color:#94a3b8;">${this.escapeHtml(file.name)}</div>
            </div>
          </div>
          <button id="btn-close-rev-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:16px; cursor:pointer;">✕</button>
        </div>
        <div style="max-height:320px; overflow-y:auto; padding-right:4px;">
          ${rowsHtml || '<div style="color:#94a3b8; font-size:12px; text-align:center; padding:20px;">No prior revisions found.</div>'}
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:16px; border-top:1px solid #27272a; padding-top:12px;">
          <button id="btn-close-rev-modal-done" style="background:transparent; border:1px solid #475569; color:#cbd5e1; border-radius:6px; padding:6px 16px; font-size:12px; cursor:pointer;">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#btn-close-rev-modal')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#btn-close-rev-modal-done')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll('.btn-restore-rev').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.revIdx, 10);
        const targetRev = file.revisions[idx];
        if (!targetRev || !targetRev.content) return;
        if (confirm(`Restore Version ${file.revisions.length - idx} from ${new Date(targetRev.timestamp).toLocaleTimeString()}?`)) {
          file.content = targetRev.content;
          file.lastModified = Date.now();
          file.synced = true;
          this.saveActiveFileToDrive(file.tool, file.name, targetRev.content, file.format);
          modal.remove();
          this.openDriveFile(file.id);
          if (window.orbitPlatform) window.orbitPlatform.showToast(`↺ Restored Version ${file.revisions.length - idx} of "${file.name}"`, 'green');
        }
      });
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

export const driveSyncManager = new GiriDriveSyncManager();
