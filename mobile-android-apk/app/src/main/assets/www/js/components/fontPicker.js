/**
 * ============================================================================
 * GIRI ORBIT — SEARCHABLE FLUENT FONT PICKER (fontPicker.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * ============================================================================
 * Provides an authentic Fluent Office style Font Family Picker:
 * - Trigger button displaying active font name in its own typeface (defaulting to Calibri)
 * - Fixed position portal dropdown that NEVER clips on ribbon boundaries
 * - Search bar with instant real-time live filtering and clear button
 * - 175+ world fonts organized into categorized groups
 * - Real typeface preview for each row with checkmark indicator and web font loader
 * - Full keyboard navigation (Up, Down, Enter, Escape)
 */

import { 
  WORLD_FONTS_CATALOG, 
  DEFAULT_FONT_NAME, 
  DEFAULT_FONT_FAMILY, 
  loadGoogleFont, 
  getFontFamilyByName, 
  findFont 
} from '../data/fonts.js';

export class FluentFontPicker {
  constructor(mountContainer, options = {}) {
    this.mountContainer = mountContainer;
    this.currentFontName = options.defaultFont || DEFAULT_FONT_NAME;
    this.currentFontFamily = this.getFamilyByName(this.currentFontName);
    this.onSelect = options.onSelect || (() => {});
    this.isOpen = false;
    this.recentFonts = ['Calibri', 'Aptos', 'Times New Roman', 'Arial', 'Segoe UI', 'Inter'];

    this.render();
    this.bindEvents();
  }

  getFamilyByName(name) {
    return getFontFamilyByName(name);
  }

  render() {
    this.mountContainer.innerHTML = `
      <div class="fluent-font-picker-wrap" id="fluent-font-picker-wrap">
        <!-- Trigger Button -->
        <button type="button" class="fluent-font-picker-btn" id="font-picker-trigger" title="Font Family">
          <span class="font-picker-active-name" style="font-family: ${this.currentFontFamily};">
            ${this.currentFontName}
          </span>
          <span class="font-picker-arrow">▾</span>
        </button>
      </div>
    `;

    // Remove any previously orphaned dropdown associated with this container
    if (this.mountContainer._activeFontDropdown) {
      try {
        this.mountContainer._activeFontDropdown.remove();
      } catch {}
    }

    // Portal dropdown directly to document.body so it is NEVER clipped by parent overflows
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'fluent-font-picker-dropdown';
    this.dropdown.id = `font-picker-dropdown-${Date.now()}`;
    this.dropdown.style.display = 'none';
    this.dropdown.setAttribute('role', 'listbox');
    this.dropdown.innerHTML = `
      <!-- Search Header -->
      <div class="font-picker-search-box">
        <svg class="font-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" class="font-picker-search-input" id="font-picker-search-input" placeholder="Search fonts (e.g. Calibri, Aptos, Poppins)..." spellcheck="false" autocomplete="off">
        <button type="button" class="font-picker-search-clear" id="btn-clear-font-search" style="display:none;" title="Clear">✕</button>
      </div>

      <!-- Font List Items Container -->
      <div class="font-picker-list" id="font-picker-list"></div>
    `;

    document.body.appendChild(this.dropdown);
    this.mountContainer._activeFontDropdown = this.dropdown;

    this.triggerBtn = this.mountContainer.querySelector('#font-picker-trigger');
    this.searchInput = this.dropdown.querySelector('.font-picker-search-input');
    this.clearBtn = this.dropdown.querySelector('.font-picker-search-clear');
    this.listContainer = this.dropdown.querySelector('.font-picker-list');
    this.activeLabel = this.mountContainer.querySelector('.font-picker-active-name');

    this.renderFontList('');
  }

  positionDropdown() {
    if (!this.dropdown || !this.triggerBtn) return;
    const rect = this.triggerBtn.getBoundingClientRect();
    const dropdownWidth = 320;
    const dropdownHeight = 400;

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - dropdownWidth - 12);
    }

    let top = rect.bottom + 4;
    // Viewport collision: check if fits below
    if (top + dropdownHeight > window.innerHeight - 12) {
      if (rect.top > dropdownHeight + 12) {
        top = rect.top - dropdownHeight - 4;
      } else {
        const availableHeight = Math.max(220, window.innerHeight - top - 16);
        this.dropdown.style.maxHeight = `${availableHeight}px`;
      }
    } else {
      this.dropdown.style.maxHeight = '400px';
    }

    this.dropdown.style.position = 'fixed';
    this.dropdown.style.top = `${top}px`;
    this.dropdown.style.left = `${left}px`;
    this.dropdown.style.width = `${dropdownWidth}px`;
    this.dropdown.style.zIndex = '100000';
  }

  renderFontList(query = '') {
    const q = query.toLowerCase().trim();
    this.listContainer.innerHTML = '';

    let matchedFonts = WORLD_FONTS_CATALOG;
    if (q) {
      matchedFonts = WORLD_FONTS_CATALOG.filter(f => 
        f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
      );
    }

    if (matchedFonts.length === 0) {
      this.listContainer.innerHTML = `
        <div class="font-picker-no-results" style="padding:24px 16px; text-align:center; color:#64748b; font-size:12px;">
          <span>No fonts matching "<strong>${query}</strong>"</span>
        </div>
      `;
      return;
    }

    // Group by category
    const categories = {};
    matchedFonts.forEach(font => {
      if (!categories[font.category]) {
        categories[font.category] = [];
      }
      categories[font.category].push(font);
    });

    // If no search query, show Recently Used at top
    if (!q && this.recentFonts.length > 0) {
      const recentHeader = document.createElement('div');
      recentHeader.className = 'font-picker-group-heading';
      recentHeader.textContent = 'RECENTLY USED';
      this.listContainer.appendChild(recentHeader);

      this.recentFonts.forEach(rName => {
        const rFont = findFont(rName);
        if (rFont) {
          this.appendFontRow(rFont, true);
        }
      });
    }

    // Render categorized groups
    Object.entries(categories).forEach(([categoryName, fonts]) => {
      const groupHeader = document.createElement('div');
      groupHeader.className = 'font-picker-group-heading';
      groupHeader.textContent = categoryName.toUpperCase();
      this.listContainer.appendChild(groupHeader);

      fonts.forEach(font => {
        this.appendFontRow(font, false);
      });
    });
  }

  appendFontRow(font, isRecent = false) {
    const isSelected = font.name.toLowerCase() === this.currentFontName.toLowerCase();
    const row = document.createElement('div');
    row.className = `font-picker-item ${isSelected ? 'active' : ''}`;
    row.dataset.fontName = font.name;
    row.dataset.fontFamily = font.family;
    row.title = `${font.name} (${font.category})`;

    row.innerHTML = `
      <div class="font-item-preview" style="font-family: ${font.family}; font-size: 13.5px;">
        ${font.name}
      </div>
      <div class="font-item-meta" style="display:flex; align-items:center; gap:6px;">
        <span class="font-item-tag" style="font-size:9.5px; opacity:0.75;">${font.category}</span>
        ${isSelected ? '<span class="font-item-check" style="color:#2563eb; font-weight:bold;">✓</span>' : ''}
      </div>
    `;

    // Dynamic lazy-loading of web font on mouse hover
    row.addEventListener('mouseenter', () => {
      if (font.googleFont) {
        loadGoogleFont(font.name);
      }
    });

    row.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectFont(font.name, font.family);
    });

    this.listContainer.appendChild(row);
  }

  selectFont(name, family) {
    this.currentFontName = name;
    this.currentFontFamily = family;

    // Load web font if online
    loadGoogleFont(name);

    // Update button label
    if (this.activeLabel) {
      this.activeLabel.textContent = name;
      this.activeLabel.style.fontFamily = family;
    }

    // Update recently used
    this.recentFonts = [name, ...this.recentFonts.filter(f => f !== name)].slice(0, 6);

    // Close dropdown
    this.close();

    // Trigger callback
    this.onSelect(name, family);
  }

  setFont(nameOrFamily) {
    if (!nameOrFamily) return;
    const found = findFont(nameOrFamily);
    if (found) {
      this.currentFontName = found.name;
      this.currentFontFamily = found.family;
      loadGoogleFont(found.name);

      if (this.activeLabel) {
        this.activeLabel.textContent = found.name;
        this.activeLabel.style.fontFamily = found.family;
      }

      // Update checkmarks in dropdown if open
      if (this.dropdown) {
        this.dropdown.querySelectorAll('.font-picker-item').forEach(item => {
          const isItemActive = item.dataset.fontName.toLowerCase() === found.name.toLowerCase();
          item.classList.toggle('active', isItemActive);
          const meta = item.querySelector('.font-item-meta');
          if (meta) {
            let check = meta.querySelector('.font-item-check');
            if (isItemActive && !check) {
              const chk = document.createElement('span');
              chk.className = 'font-item-check';
              chk.style.color = '#2563eb';
              chk.style.fontWeight = 'bold';
              chk.textContent = '✓';
              meta.appendChild(chk);
            } else if (!isItemActive && check) {
              check.remove();
            }
          }
        });
      }
    }
  }

  open() {
    this.isOpen = true;
    this.dropdown.style.display = 'flex';
    this.triggerBtn.classList.add('active');
    this.searchInput.value = '';
    this.clearBtn.style.display = 'none';
    this.renderFontList('');
    this.positionDropdown();
    setTimeout(() => this.searchInput.focus(), 40);

    // Scroll active into view
    const activeItem = this.dropdown.querySelector('.font-picker-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }

  close() {
    this.isOpen = false;
    if (this.dropdown) this.dropdown.style.display = 'none';
    if (this.triggerBtn) this.triggerBtn.classList.remove('active');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  bindEvents() {
    this.triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    this.searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      this.clearBtn.style.display = val ? 'block' : 'none';
      this.renderFontList(val);
    });

    this.clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.searchInput.value = '';
      this.clearBtn.style.display = 'none';
      this.renderFontList('');
      this.searchInput.focus();
    });

    // Keyboard navigation
    this.dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
        this.triggerBtn.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = Array.from(this.listContainer.querySelectorAll('.font-picker-item'));
        if (items.length === 0) return;
        const currentIdx = items.findIndex(el => el.classList.contains('highlighted') || el.classList.contains('active'));
        let nextIdx = 0;
        if (e.key === 'ArrowDown') {
          nextIdx = (currentIdx + 1) % items.length;
        } else {
          nextIdx = (currentIdx - 1 + items.length) % items.length;
        }
        items.forEach(el => el.classList.remove('highlighted'));
        items[nextIdx].classList.add('highlighted');
        items[nextIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        const highlighted = this.listContainer.querySelector('.font-picker-item.highlighted');
        if (highlighted) {
          e.preventDefault();
          highlighted.click();
        }
      }
    });

    // Close on mousedown outside dropdown and trigger
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && !this.dropdown.contains(e.target) && !this.triggerBtn.contains(e.target)) {
        this.close();
      }
    });

    // Reposition on window resize or scroll
    window.addEventListener('resize', () => {
      if (this.isOpen) this.positionDropdown();
    });
    window.addEventListener('scroll', () => {
      if (this.isOpen) this.positionDropdown();
    }, true);
  }
}
