/**
 * Giri Orbit — Local File Direct Sync Engine
 * Sovereign Direct-to-Disk Read/Write via File System Access API
 * Eliminates re-downloads, re-uploads, and server roundtrips.
 */

class LocalFileDirectSyncEngine {
  constructor() {
    this.activeHandles = {
      drift: null,
      axis: null,
      kinetic: null,
      pdf: null
    };

    this.activeFileNames = {
      drift: null,
      axis: null,
      kinetic: null,
      pdf: null
    };

    this.listeners = new Set();
  }

  isSupported() {
    return typeof window !== 'undefined' && 'showSaveFilePicker' in window;
  }

  getActiveHandle(tool) {
    return this.activeHandles[tool] || null;
  }

  getActiveFileName(tool) {
    return this.activeFileNames[tool] || null;
  }

  clearHandle(tool) {
    this.activeHandles[tool] = null;
    this.activeFileNames[tool] = null;
    this._notifyChange(tool);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notifyChange(tool) {
    this.listeners.forEach(fn => {
      try {
        fn(tool, this.activeFileNames[tool], this.activeHandles[tool]);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  /**
   * Save content directly to local disk.
   * If a file handle is already linked, writes directly without prompts.
   * If forcePicker is true or no handle exists, prompts native OS save picker.
   */
  async saveToDevice({
    tool,
    content,
    suggestedName = 'document',
    extension = 'gdrift',
    mimeType = 'text/plain',
    forcePicker = false
  }) {
    let handle = forcePicker ? null : this.activeHandles[tool];

    if (!handle) {
      if (!this.isSupported()) {
        this._fallbackDownload(content, `${suggestedName}.${extension}`, mimeType);
        if (window.orbitPlatform) {
          window.orbitPlatform.triggerToast(`Downloaded "${suggestedName}.${extension}" (Direct sync requires Chromium browser)`);
        }
        return { success: true, mode: 'download', name: `${suggestedName}.${extension}` };
      }

      const options = {
        suggestedName: suggestedName.endsWith(`.${extension}`) ? suggestedName : `${suggestedName}.${extension}`,
        types: [
          {
            description: `${tool.toUpperCase()} Document (*.${extension})`,
            accept: {
              [mimeType]: [`.${extension}`]
            }
          }
        ]
      };

      try {
        handle = await window.showSaveFilePicker(options);
        this.activeHandles[tool] = handle;
        this.activeFileNames[tool] = handle.name;
        this._notifyChange(tool);
      } catch (err) {
        if (err.name === 'AbortError') {
          return { success: false, aborted: true };
        }
        console.warn('showSaveFilePicker error:', err);
        this._fallbackDownload(content, `${suggestedName}.${extension}`, mimeType);
        return { success: true, mode: 'download', name: `${suggestedName}.${extension}` };
      }
    }

    try {
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();

      const fileName = handle.name;
      this.activeFileNames[tool] = fileName;
      this._notifyChange(tool);

      if (window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`✓ Saved directly to disk: ${fileName}`);
      }

      return { success: true, mode: 'direct', name: fileName, handle };
    } catch (err) {
      console.error('Error writing directly to handle:', err);
      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        this.clearHandle(tool);
        return this.saveToDevice({
          tool,
          content,
          suggestedName,
          extension,
          mimeType,
          forcePicker: true
        });
      }
      throw err;
    }
  }

  /**
   * Open a file directly from local disk and retain handle for subsequent direct saves.
   */
  async openFromDevice({ tool, acceptTypes = {} }) {
    if (!this.isSupported()) {
      return new Promise((resolve) => {
        let input = document.getElementById(`giri-file-picker-fallback-${tool}`);
        if (!input) {
          input = document.createElement('input');
          input.type = 'file';
          input.id = `giri-file-picker-fallback-${tool}`;
          input.style.display = 'none';
          document.body.appendChild(input);
        }
        const extList = [];
        Object.values(acceptTypes).forEach(extensions => {
          if (Array.isArray(extensions)) extList.push(...extensions);
        });
        input.accept = extList.join(',') || '*/*';
        input.onchange = (e) => {
          const file = e.target.files?.[0];
          if (!file) {
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const content = ev.target?.result;
            this.activeHandles[tool] = null;
            this.activeFileNames[tool] = file.name;
            this._notifyChange(tool);
            if (window.orbitPlatform) {
              window.orbitPlatform.triggerToast(`✓ Opened "${file.name}"`);
            }
            resolve({
              handle: null,
              name: file.name,
              content,
              file
            });
          };
          reader.onerror = () => resolve(null);
          reader.readAsText(file);
          input.value = '';
        };
        input.click();
      });
    }

    try {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: `${tool.toUpperCase()} Files`,
            accept: acceptTypes
          }
        ]
      });

      if (!handle) return null;

      const file = await handle.getFile();
      const content = await file.text();

      this.activeHandles[tool] = handle;
      this.activeFileNames[tool] = handle.name;
      this._notifyChange(tool);

      if (window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`✓ Opened "${handle.name}" (Direct Disk Sync Active)`);
      }

      return {
        handle,
        name: handle.name,
        content,
        file
      };
    } catch (err) {
      if (err.name === 'AbortError') return null;
      console.error('openFromDevice error:', err);
      return null;
    }
  }

  _fallbackDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const localSync = new LocalFileDirectSyncEngine();
