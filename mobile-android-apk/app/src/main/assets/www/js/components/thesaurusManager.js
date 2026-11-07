/**
 * Giri Orbit — Enterprise Thesaurus & Synonym Engine
 * Sovereign client-side dictionary with online fallback and instant editor replacement
 */

export const THESAURUS_DB = {
  'improve': { pos: 'verb', def: 'Make or become better in quality or condition.', syn: ['enhance', 'upgrade', 'elevate', 'refine', 'boost', 'ameliorate', 'develop', 'polish', 'augment'], ant: ['worsen', 'deteriorate', 'degrade', 'diminish'] },
  'create': { pos: 'verb', def: 'Bring something into existence or generate novel work.', syn: ['generate', 'produce', 'craft', 'build', 'formulate', 'design', 'establish', 'originate', 'construct'], ant: ['destroy', 'dismantle', 'terminate', 'annihilate'] },
  'important': { pos: 'adj', def: 'Of great significance, value, or consequence.', syn: ['critical', 'crucial', 'essential', 'paramount', 'vital', 'pivotal', 'significant', 'substantial', 'imperative'], ant: ['trivial', 'minor', 'negligible', 'insignificant'] },
  'make': { pos: 'verb', def: 'Form, construct, or produce something.', syn: ['construct', 'fabricate', 'forge', 'compose', 'manufacture', 'produce', 'execute', 'assemble'], ant: ['destroy', 'ruin', 'undo'] },
  'big': { pos: 'adj', def: 'Of considerable size, extent, or intensity.', syn: ['immense', 'massive', 'substantial', 'colossal', 'extensive', 'monumental', 'vast', 'prominent'], ant: ['tiny', 'diminutive', 'minute', 'compact'] },
  'small': { pos: 'adj', def: 'Of a size that is less than normal or usual.', syn: ['compact', 'diminutive', 'slight', 'modest', 'subtle', 'miniature', 'concise'], ant: ['immense', 'huge', 'colossal', 'sprawling'] },
  'good': { pos: 'adj', def: 'To be desired or approved of; of high quality.', syn: ['exceptional', 'superb', 'sterling', 'admirable', 'proficient', 'competent', 'favorable', 'exemplary'], ant: ['poor', 'inferior', 'deficient', 'subpar'] },
  'bad': { pos: 'adj', def: 'Of poor quality or a low standard.', syn: ['subpar', 'deficient', 'unfavorable', 'detrimental', 'adverse', 'flawed', 'inferior'], ant: ['superior', 'excellent', 'stellar'] },
  'help': { pos: 'verb', def: 'Make it easier for someone to do something or provide assistance.', syn: ['assist', 'support', 'facilitate', 'aid', 'bolster', 'expedite', 'sustain'], ant: ['hinder', 'impede', 'obstruct', 'thwart'] },
  'fast': { pos: 'adj/adv', def: 'Moving or capable of moving at high speed.', syn: ['rapid', 'swift', 'expedited', 'brisk', 'accelerated', 'fleet', 'prompt'], ant: ['sluggish', 'tardy', 'delayed', 'leisurely'] },
  'slow': { pos: 'adj', def: 'Operating, moving, or progressing at a low speed.', syn: ['gradual', 'deliberate', 'unhurried', 'measured', 'sluggish', 'methodical'], ant: ['rapid', 'swift', 'instantaneous'] },
  'change': { pos: 'verb/noun', def: 'Make or become different.', syn: ['transform', 'modify', 'alter', 'adapt', 'evolve', 'revolutionize', 'revise', 'transition'], ant: ['preserve', 'maintain', 'stagnate', 'retain'] },
  'plan': { pos: 'noun/verb', def: 'A detailed proposal for doing or achieving something.', syn: ['strategy', 'roadmap', 'framework', 'blueprint', 'scheme', 'design', 'architecture', 'agenda'], ant: ['improvisation', 'disarray', 'chaos'] },
  'problem': { pos: 'noun', def: 'A matter or situation regarded as unwelcome or harmful.', syn: ['challenge', 'obstacle', 'impediment', 'bottleneck', 'dilemma', 'complication', 'hurdle'], ant: ['solution', 'resolution', 'asset', 'advantage'] },
  'result': { pos: 'noun', def: 'A consequence, effect, or outcome of an action or process.', syn: ['outcome', 'consequence', 'deliverable', 'culmination', 'finding', 'yield', 'upshot'], ant: ['cause', 'origin', 'premise'] },
  'show': { pos: 'verb', def: 'Allow or cause something to be visible or understood.', syn: ['demonstrate', 'illustrate', 'exhibit', 'manifest', 'depict', 'clarify', 'elucidate', 'display'], ant: ['conceal', 'obscure', 'suppress', 'hide'] },
  'use': { pos: 'verb', def: 'Take, hold, or deploy as a means of accomplishing an end.', syn: ['utilize', 'leverage', 'deploy', 'harness', 'employ', 'operationalize', 'apply'], ant: ['neglect', 'disregard', 'abandon'] },
  'need': { pos: 'verb/noun', def: 'Require something because it is essential or very important.', syn: ['require', 'necessitate', 'demand', 'entail', 'mandate', 'call for'], ant: ['surplus', 'excess', 'redundancy'] },
  'think': { pos: 'verb', def: 'Have a particular opinion, belief, or idea.', syn: ['contemplate', 'deliberate', 'postulate', 'evaluate', 'reason', 'conceptualize', 'deduce'], ant: ['ignore', 'overlook', 'disregard'] },
  'start': { pos: 'verb', def: 'Begin or initiate a process or action.', syn: ['initiate', 'commence', 'embark', 'launch', 'inaugurate', 'originate', 'trigger'], ant: ['conclude', 'finalize', 'terminate', 'cease'] },
  'end': { pos: 'verb/noun', def: 'Bring or come to an official conclusion.', syn: ['conclude', 'finalize', 'terminate', 'culminate', 'complete', 'cease', 'wrap up'], ant: ['commence', 'initiate', 'originate'] },
  'system': { pos: 'noun', def: 'A set of connected things or parts forming a complex whole.', syn: ['framework', 'infrastructure', 'architecture', 'ecosystem', 'platform', 'mechanism', 'network'], ant: ['disorganization', 'chaos', 'fragmentation'] },
  'data': { pos: 'noun', def: 'Facts and statistics collected together for reference or analysis.', syn: ['telemetry', 'metrics', 'information', 'analytics', 'records', 'empirical findings', 'inputs'], ant: ['speculation', 'conjecture'] },
  'lead': { pos: 'verb', def: 'Cause a person or group to go with one; guide or conduct.', syn: ['spearhead', 'champion', 'orchestrate', 'guide', 'navigate', 'pilot', 'govern'], ant: ['follow', 'succumb', 'yield'] },
  'manage': { pos: 'verb', def: 'Be in charge of, administer, or regulate.', syn: ['administer', 'oversee', 'direct', 'orchestrate', 'supervise', 'coordinate', 'govern'], ant: ['mismanage', 'neglect', 'abandon'] },
  'strong': { pos: 'adj', def: 'Having the power to withstand forces or exert great force.', syn: ['robust', 'resilient', 'formidable', 'vigorous', 'potent', 'stalwart', 'tenacious'], ant: ['fragile', 'vulnerable', 'feeble', 'flimsy'] },
  'secure': { pos: 'adj/verb', def: 'Free from danger or threat; protect against risk.', syn: ['bulletproof', 'fortified', 'cryptographic', 'sovereign', 'hardened', 'safeguarded', 'impermeable'], ant: ['vulnerable', 'exposed', 'perilous', 'compromised'] },
  'innovative': { pos: 'adj', def: 'Featuring new methods; advanced and original.', syn: ['groundbreaking', 'pioneering', 'trailblazing', 'avant-garde', 'novel', 'state-of-the-art', 'disruptive'], ant: ['conventional', 'archaic', 'derivative', 'outdated'] },
  'efficient': { pos: 'adj', def: 'Achieving maximum productivity with minimum wasted effort.', syn: ['streamlined', 'optimized', 'productive', 'lean', 'competent', 'frictionless', 'high-throughput'], ant: ['wasteful', 'ineffectual', 'cumbersome', 'sluggish'] },
  'collaborate': { pos: 'verb', def: 'Work jointly on an activity or project.', syn: ['cooperate', 'synergize', 'partner', 'co-create', 'unite', 'coordinate', 'integrate'], ant: ['compete', 'isolate', 'segregate'] },
  'communicate': { pos: 'verb', def: 'Share or exchange information, news, or ideas.', syn: ['convey', 'articulate', 'disseminate', 'transmit', 'express', 'broadcast', 'impart'], ant: ['withhold', 'conceal', 'suppress'] },
  'report': { pos: 'noun/verb', def: 'An account given of a particular matter.', syn: ['dispatch', 'briefing', 'dossier', 'chronicle', 'memorandum', 'synthesis', 'overview'], ant: ['rumor', 'hearsay'] },
  'design': { pos: 'verb/noun', def: 'Do or plan something with a specific purpose in mind.', syn: ['architect', 'engineer', 'devise', 'prototype', 'blueprint', 'compose', 'tailor'], ant: ['botch', 'ruin'] },
  'build': { pos: 'verb', def: 'Construct by putting parts or material together.', syn: ['construct', 'engineer', 'fabricate', 'assemble', 'synthesize', 'erect'], ant: ['demolish', 'dismantle', 'tear down'] },
  'feature': { pos: 'noun', def: 'A distinctive attribute or aspect of something.', syn: ['capability', 'attribute', 'functionality', 'trait', 'hallmark', 'dimension', 'characteristic'], ant: ['defect', 'flaw'] },
  'template': { pos: 'noun', def: 'A preset format used as a guide to create files.', syn: ['archetype', 'prototype', 'blueprint', 'exemplar', 'pattern', 'standard', 'framework'], ant: ['anomaly', 'aberration'] },
  'convert': { pos: 'verb', def: 'Change the form, character, or function of something.', syn: ['transform', 'transmute', 'translate', 'adapt', 'transcode', 'reform', 'render'], ant: ['maintain', 'freeze'] },
  'save': { pos: 'verb', def: 'Keep safe or store for future use.', syn: ['persist', 'preserve', 'safeguard', 'retain', 'archive', 'cache', 'commit'], ant: ['discard', 'erase', 'purge'] },
  'share': { pos: 'verb', def: 'Have a portion of or give a portion to others.', syn: ['distribute', 'disseminate', 'impart', 'co-own', 'allocate', 'broadcast'], ant: ['hoard', 'withhold', 'isolate'] },
  'review': { pos: 'verb/noun', def: 'A formal assessment of something with the possibility of change.', syn: ['audit', 'appraise', 'scrutinize', 'evaluate', 'inspect', 'survey', 're-examine'], ant: ['ignore', 'skip', 'rubber-stamp'] }
};

class OfficeThesaurusManager {
  constructor() {
    this.modalEl = null;
    this.currentCallback = null;
    this.recentLookups = ['improve', 'create', 'important', 'system', 'secure'];
  }

  ensureModal() {
    if (this.modalEl && document.body.contains(this.modalEl)) return;

    const div = document.createElement('div');
    div.id = 'unified-thesaurus-modal';
    div.className = 'office-modal-backdrop';
    div.style.cssText = 'position:fixed; inset:0; z-index:99999; background:rgba(15,23,42,0.75); backdrop-filter:blur(8px); display:none; align-items:center; justify-content:center; padding:16px;';
    
    div.innerHTML = `
      <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:520px; max-width:96vw; max-height:85vh; background:#18181b; border:1px solid #334155; border-radius:12px; box-shadow:0 24px 48px rgba(0,0,0,0.5); display:flex; flex-direction:column; overflow:hidden; font-family:'Segoe UI',system-ui,sans-serif; color:#f8fafc;">
        <div class="office-dialog-header" style="display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #27272a; background:#1e293b;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">📚</span>
            <span style="font-size:14px; font-weight:700; color:#f8fafc; letter-spacing:0.02em;">Giri Thesaurus & Synonym Engine</span>
          </div>
          <button class="esc-kbd" id="btn-close-thesaurus" style="background:#27272a; border:1px solid #3f3f46; color:#a1a1aa; border-radius:4px; padding:3px 8px; font-size:11px; cursor:pointer;">ESC</button>
        </div>

        <div style="padding:14px 18px; background:#0f172a; border-bottom:1px solid #1e293b;">
          <div style="display:flex; gap:8px;">
            <input type="text" id="thesaurus-search-input" placeholder="Enter word to look up synonyms (e.g. improve, create, strategy)..." style="flex:1; background:#1e293b; border:1px solid #334155; border-radius:6px; padding:8px 12px; color:#f8fafc; font-size:13px; outline:none;" />
            <button id="btn-thesaurus-lookup" style="background:#2563eb; color:#fff; border:none; border-radius:6px; padding:8px 16px; font-size:12px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px;">
              <span>Search</span>
            </button>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-top:8px; font-size:11px; color:#64748b;">
            <span>Suggestions:</span>
            <div id="thesaurus-recent-tags" style="display:flex; gap:5px; flex-wrap:wrap;"></div>
          </div>
        </div>

        <div class="office-dialog-body" id="thesaurus-results-body" style="padding:18px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:16px;">
          <!-- Dynamically populated -->
        </div>

        <div class="office-dialog-footer" style="padding:12px 18px; border-top:1px solid #27272a; background:#1e293b; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:11px; color:#64748b;" id="thesaurus-source-badge">Local Sovereign Dictionary</div>
          <div style="display:flex; gap:8px;">
            <button class="export-cancel-btn" id="btn-dismiss-thesaurus" style="background:transparent; border:1px solid #3f3f46; color:#cbd5e1; border-radius:6px; padding:6px 14px; font-size:12px; cursor:pointer;">Close</button>
            <button class="btn-giri-primary" id="btn-thesaurus-replace-selected" style="background:#2563eb; color:#fff; border:none; border-radius:6px; padding:6px 16px; font-size:12px; font-weight:600; cursor:pointer;" disabled>Replace Selected Text</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(div);
    this.modalEl = div;

    // Events
    const closeBtn = div.querySelector('#btn-close-thesaurus');
    const dismissBtn = div.querySelector('#btn-dismiss-thesaurus');
    const input = div.querySelector('#thesaurus-search-input');
    const lookupBtn = div.querySelector('#btn-thesaurus-lookup');
    const replaceBtn = div.querySelector('#btn-thesaurus-replace-selected');

    const close = () => {
      div.style.display = 'none';
      div.classList.remove('open');
    };

    closeBtn.onclick = close;
    dismissBtn.onclick = close;
    div.onclick = (e) => {
      if (e.target === div) close();
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') this.lookup(input.value.trim());
      if (e.key === 'Escape') close();
    };

    lookupBtn.onclick = () => this.lookup(input.value.trim());

    replaceBtn.onclick = () => {
      if (this.selectedWordToInsert && this.currentCallback) {
        this.currentCallback(this.selectedWordToInsert);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Replaced with "${this.selectedWordToInsert}"`);
        close();
      }
    };
  }

  renderRecentTags() {
    const container = this.modalEl?.querySelector('#thesaurus-recent-tags');
    if (!container) return;
    container.innerHTML = this.recentLookups.map(w => `
      <span class="thesaurus-tag" style="background:#1e293b; border:1px solid #334155; color:#38bdf8; border-radius:4px; padding:2px 7px; cursor:pointer; font-size:11px;">${w}</span>
    `).join('');

    container.querySelectorAll('.thesaurus-tag').forEach(tag => {
      tag.onclick = () => {
        const input = this.modalEl.querySelector('#thesaurus-search-input');
        if (input) input.value = tag.textContent;
        this.lookup(tag.textContent);
      };
    });
  }

  async lookup(query) {
    if (!query) return;
    const cleanWord = query.toLowerCase().trim().replace(/[^a-z-]/g, '');
    if (!cleanWord) return;

    if (!this.recentLookups.includes(cleanWord)) {
      this.recentLookups.unshift(cleanWord);
      if (this.recentLookups.length > 8) this.recentLookups.pop();
      this.renderRecentTags();
    }

    const body = this.modalEl.querySelector('#thesaurus-results-body');
    const sourceBadge = this.modalEl.querySelector('#thesaurus-source-badge');
    const replaceBtn = this.modalEl.querySelector('#btn-thesaurus-replace-selected');
    if (!body) return;

    body.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; gap:8px; padding:30px; color:#94a3b8;">
        <span style="animation:spin 1s linear infinite;">⏳</span> Looking up synonyms for "<strong>${cleanWord}</strong>"...
      </div>
    `;

    // 1. Try local dictionary
    let result = THESAURUS_DB[cleanWord];
    let source = 'Local Sovereign Dictionary';

    // 2. If not found in local db, try Datamuse online API fallback
    if (!result && typeof fetch !== 'undefined') {
      try {
        const [synRes, antRes] = await Promise.all([
          fetch(`https://api.datamuse.com/words?rel_syn=${cleanWord}&max=15`),
          fetch(`https://api.datamuse.com/words?rel_ant=${cleanWord}&max=8`)
        ]);
        if (synRes.ok) {
          const syns = await synRes.json();
          const ants = antRes.ok ? await antRes.json() : [];
          if (syns.length > 0) {
            result = {
              pos: 'term',
              def: `Synonyms and related terms for "${cleanWord}".`,
              syn: syns.map(item => item.word),
              ant: ants.map(item => item.word)
            };
            source = 'Giri Online Semantic Lexicon';
          }
        }
      } catch (e) {
        // Offline mode
      }
    }

    if (sourceBadge) sourceBadge.textContent = source;

    if (!result || (!result.syn?.length && !result.ant?.length)) {
      body.innerHTML = `
        <div style="padding:24px; text-align:center; background:#1e293b; border-radius:8px; border:1px solid #334155;">
          <span style="font-size:28px; display:block; margin-bottom:8px;">🔍</span>
          <strong style="color:#f8fafc; font-size:15px; display:block; margin-bottom:4px;">No direct synonyms found for "${cleanWord}"</strong>
          <span style="font-size:12px; color:#94a3b8; display:block; margin-bottom:12px;">Try searching for the root verb or noun (e.g. "create", "enhance", "rapid", "plan").</span>
          <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap;">
            ${['improve', 'create', 'important', 'help', 'fast', 'secure', 'manage'].map(w => `
              <button class="thesaurus-suggest-btn" style="background:#27272a; border:1px solid #3f3f46; color:#38bdf8; border-radius:4px; padding:4px 10px; font-size:11.5px; cursor:pointer;">${w}</button>
            `).join('')}
          </div>
        </div>
      `;
      body.querySelectorAll('.thesaurus-suggest-btn').forEach(btn => {
        btn.onclick = () => {
          this.modalEl.querySelector('#thesaurus-search-input').value = btn.textContent;
          this.lookup(btn.textContent);
        };
      });
      replaceBtn.disabled = true;
      return;
    }

    this.selectedWordToInsert = result.syn?.[0] || '';
    replaceBtn.disabled = !this.selectedWordToInsert;
    replaceBtn.textContent = this.selectedWordToInsert ? `Replace with "${this.selectedWordToInsert}"` : 'Replace Selected Text';

    const renderPills = (list, isSyn = true) => {
      if (!list || !list.length) return `<span style="font-size:12px; color:#64748b; font-style:italic;">None listed</span>`;
      return list.map(item => `
        <button class="synonym-pill-btn" data-word="${item}" style="background:${isSyn ? '#1e293b' : '#27272a'}; border:1px solid ${isSyn ? '#3b82f6' : '#64748b'}; color:${isSyn ? '#93c5fd' : '#cbd5e1'}; padding:5px 12px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.15s; display:inline-flex; align-items:center; gap:5px;">
          <span>${item}</span>
          <span style="font-size:10px; opacity:0.6;">↳</span>
        </button>
      `).join(' ');
    };

    body.innerHTML = `
      <div style="display:flex; align-items:baseline; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:10px;">
        <div>
          <span style="font-size:22px; font-weight:800; color:#f8fafc; text-transform:capitalize;">${cleanWord}</span>
          <span style="font-size:12px; color:#38bdf8; font-style:italic; margin-left:8px;">[${result.pos || 'word'}]</span>
        </div>
        <button id="btn-thesaurus-copy-word" style="background:#27272a; border:1px solid #3f3f46; color:#cbd5e1; border-radius:4px; padding:3px 8px; font-size:11px; cursor:pointer;">Copy Word</button>
      </div>

      <div style="background:#0f172a; border-radius:8px; padding:10px 14px; border:1px solid #1e293b; font-size:12.5px; color:#cbd5e1; line-height:1.4;">
        <strong style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:2px;">Definition</strong>
        ${result.def || 'Standard vocabulary definition.'}
      </div>

      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <strong style="font-size:12px; text-transform:uppercase; letter-spacing:0.04em; color:#38bdf8;">Synonyms (${result.syn?.length || 0})</strong>
          <span style="font-size:11px; color:#64748b;">Click any synonym to select</span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;" id="thesaurus-synonyms-container">
          ${renderPills(result.syn, true)}
        </div>
      </div>

      ${result.ant?.length ? `
        <div style="margin-top:4px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <strong style="font-size:12px; text-transform:uppercase; letter-spacing:0.04em; color:#f43f5e;">Antonyms (${result.ant.length})</strong>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${renderPills(result.ant, false)}
          </div>
        </div>
      ` : ''}
    `;

    body.querySelector('#btn-thesaurus-copy-word')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(cleanWord);
      if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Copied "${cleanWord}"`);
    });

    body.querySelectorAll('.synonym-pill-btn').forEach(pill => {
      pill.onclick = () => {
        body.querySelectorAll('.synonym-pill-btn').forEach(p => p.style.borderColor = '');
        pill.style.borderColor = '#10b981';
        pill.style.background = '#064e3b';
        pill.style.color = '#6ee7b7';
        this.selectedWordToInsert = pill.dataset.word;
        replaceBtn.disabled = false;
        replaceBtn.textContent = `Replace with "${this.selectedWordToInsert}"`;

        if (this.currentCallback) {
          this.currentCallback(this.selectedWordToInsert);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted synonym: "${this.selectedWordToInsert}"`);
          this.modalEl.style.display = 'none';
        }
      };
    });
  }

  open(initialWord = '', onReplace = null) {
    this.ensureModal();
    this.currentCallback = onReplace;
    this.selectedWordToInsert = null;

    const input = this.modalEl.querySelector('#thesaurus-search-input');
    const replaceBtn = this.modalEl.querySelector('#btn-thesaurus-replace-selected');

    this.renderRecentTags();

    const wordToLookup = (initialWord || '').trim().replace(/[^a-zA-Z-]/g, '');
    if (input) input.value = wordToLookup || 'improve';

    this.modalEl.style.display = 'flex';
    this.modalEl.classList.add('open');

    setTimeout(() => {
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);

    this.lookup(wordToLookup || 'improve');
  }
}

export const thesaurusManager = new OfficeThesaurusManager();
