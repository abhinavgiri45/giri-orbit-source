/**
 * Giri Orbit — Unified Symbols, Equation, and Emoji Manager
 * High-velocity, sovereign, unclipped popovers & modals for Drift, Axis, and Kinetic
 */

export const SYMBOL_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'math', label: 'Math & Logic' },
  { id: 'greek', label: 'Greek' },
  { id: 'currency', label: 'Currencies' },
  { id: 'arrows', label: 'Arrows' },
  { id: 'typography', label: 'Typography' },
  { id: 'shapes', label: 'Shapes & Badges' },
  { id: 'fractions', label: 'Fractions & Super/Sub' }
];

export const SYMBOLS_DATA = [
  // Math & Logic
  { char: '±', name: 'plus minus sign', cat: 'math' },
  { char: '∓', name: 'minus plus sign', cat: 'math' },
  { char: '×', name: 'multiplication times multiply', cat: 'math' },
  { char: '÷', name: 'division divide sign', cat: 'math' },
  { char: '≠', name: 'not equal to inequality', cat: 'math' },
  { char: '≤', name: 'less than or equal to', cat: 'math' },
  { char: '≥', name: 'greater than or equal to', cat: 'math' },
  { char: '≈', name: 'almost equal to approximation approx', cat: 'math' },
  { char: '≡', name: 'identical to equivalence', cat: 'math' },
  { char: '∝', name: 'proportional to variation', cat: 'math' },
  { char: '∞', name: 'infinity infinite loop', cat: 'math' },
  { char: '√', name: 'square root radical', cat: 'math' },
  { char: '∛', name: 'cube root radical', cat: 'math' },
  { char: '∜', name: 'fourth root radical', cat: 'math' },
  { char: '∑', name: 'n-ary summation sigma series', cat: 'math' },
  { char: '∏', name: 'n-ary product pi', cat: 'math' },
  { char: '∫', name: 'integral calculus dx', cat: 'math' },
  { char: '∬', name: 'double integral calculus', cat: 'math' },
  { char: '∮', name: 'contour surface integral', cat: 'math' },
  { char: '∂', name: 'partial differential derivative', cat: 'math' },
  { char: '∇', name: 'nabla gradient del operator', cat: 'math' },
  { char: '∀', name: 'for all universal quantifier logic', cat: 'math' },
  { char: '∃', name: 'there exists existential logic', cat: 'math' },
  { char: '∄', name: 'there does not exist logic', cat: 'math' },
  { char: '∈', name: 'element of member of set', cat: 'math' },
  { char: '∉', name: 'not an element of set', cat: 'math' },
  { char: '⊂', name: 'subset of set', cat: 'math' },
  { char: '⊆', name: 'subset of or equal to set', cat: 'math' },
  { char: '⊃', name: 'superset of set', cat: 'math' },
  { char: '⊇', name: 'superset of or equal to set', cat: 'math' },
  { char: '∪', name: 'union of sets join', cat: 'math' },
  { char: '∩', name: 'intersection of sets intersect', cat: 'math' },
  { char: '∅', name: 'empty set null set zero', cat: 'math' },
  { char: '∠', name: 'angle geometric degrees', cat: 'math' },
  { char: '⟂', name: 'perpendicular orthogonal 90 degrees', cat: 'math' },
  { char: '∥', name: 'parallel to lines', cat: 'math' },
  { char: '∴', name: 'therefore proof logic', cat: 'math' },
  { char: '∵', name: 'because since proof logic', cat: 'math' },
  { char: '·', name: 'middle dot product scalar', cat: 'math' },
  { char: '∘', name: 'composite function ring composition', cat: 'math' },

  // Greek Letters
  { char: 'α', name: 'alpha lowercase', cat: 'greek' },
  { char: 'β', name: 'beta lowercase', cat: 'greek' },
  { char: 'γ', name: 'gamma lowercase', cat: 'greek' },
  { char: 'δ', name: 'delta lowercase', cat: 'greek' },
  { char: 'ε', name: 'epsilon lowercase', cat: 'greek' },
  { char: 'ζ', name: 'zeta lowercase', cat: 'greek' },
  { char: 'η', name: 'eta lowercase', cat: 'greek' },
  { char: 'θ', name: 'theta lowercase angle', cat: 'greek' },
  { char: 'ι', name: 'iota lowercase', cat: 'greek' },
  { char: 'κ', name: 'kappa lowercase', cat: 'greek' },
  { char: 'λ', name: 'lambda lowercase wavelength eigenvalue', cat: 'greek' },
  { char: 'μ', name: 'mu micro lowercase mean', cat: 'greek' },
  { char: 'ν', name: 'nu lowercase frequency', cat: 'greek' },
  { char: 'ξ', name: 'xi lowercase', cat: 'greek' },
  { char: 'π', name: 'pi constant lowercase 3.14159', cat: 'greek' },
  { char: 'ρ', name: 'rho lowercase density', cat: 'greek' },
  { char: 'σ', name: 'sigma lowercase standard deviation', cat: 'greek' },
  { char: 'τ', name: 'tau lowercase torque time', cat: 'greek' },
  { char: 'υ', name: 'upsilon lowercase', cat: 'greek' },
  { char: 'φ', name: 'phi lowercase golden ratio', cat: 'greek' },
  { char: 'χ', name: 'chi lowercase chi-square', cat: 'greek' },
  { char: 'ψ', name: 'psi lowercase wave function', cat: 'greek' },
  { char: 'ω', name: 'omega lowercase angular velocity', cat: 'greek' },
  { char: 'Γ', name: 'Gamma uppercase function', cat: 'greek' },
  { char: 'Δ', name: 'Delta uppercase change difference discriminant', cat: 'greek' },
  { char: 'Θ', name: 'Theta uppercase', cat: 'greek' },
  { char: 'Λ', name: 'Lambda uppercase matrix', cat: 'greek' },
  { char: 'Ξ', name: 'Xi uppercase', cat: 'greek' },
  { char: 'Π', name: 'Pi uppercase product', cat: 'greek' },
  { char: 'Σ', name: 'Sigma uppercase summation sum', cat: 'greek' },
  { char: 'Φ', name: 'Phi uppercase magnetic flux', cat: 'greek' },
  { char: 'Ψ', name: 'Psi uppercase wave function', cat: 'greek' },
  { char: 'Ω', name: 'Omega uppercase ohm resistance electrical', cat: 'greek' },

  // Currencies
  { char: '₹', name: 'indian rupee inr india currency symbol', cat: 'currency' },
  { char: '$', name: 'dollar sign usd united states', cat: 'currency' },
  { char: '€', name: 'euro currency eur europe european', cat: 'currency' },
  { char: '£', name: 'pound sterling gbp british great britain', cat: 'currency' },
  { char: '¥', name: 'yen yuan currency jpy cny japan china', cat: 'currency' },
  { char: '₽', name: 'russian ruble rub russia currency', cat: 'currency' },
  { char: '₩', name: 'korean won krw south korea currency', cat: 'currency' },
  { char: '₿', name: 'bitcoin cryptocurrency btc crypto digital', cat: 'currency' },
  { char: '¢', name: 'cent sign money change', cat: 'currency' },
  { char: '฿', name: 'thai baht thb thailand currency', cat: 'currency' },
  { char: '₫', name: 'vietnamese dong vnd vietnam currency', cat: 'currency' },
  { char: '₪', name: 'israeli shekel ils israel currency', cat: 'currency' },
  { char: '₸', name: 'kazakhstani tenge kzt kazakhstan currency', cat: 'currency' },
  { char: '₺', name: 'turkish lira try turkey currency', cat: 'currency' },
  { char: '₴', name: 'ukrainian hryvnia uah ukraine currency', cat: 'currency' },

  // Arrows
  { char: '←', name: 'leftwards arrow left back previous', cat: 'arrows' },
  { char: '→', name: 'rightwards arrow right forward next', cat: 'arrows' },
  { char: '↑', name: 'upwards arrow up increase higher', cat: 'arrows' },
  { char: '↓', name: 'downwards arrow down decrease lower', cat: 'arrows' },
  { char: '↔', name: 'left right arrow horizontal bidirectional', cat: 'arrows' },
  { char: '↕', name: 'up down arrow vertical bidirectional', cat: 'arrows' },
  { char: '⇐', name: 'leftwards double arrow implies logic', cat: 'arrows' },
  { char: '⇒', name: 'rightwards double arrow implies therefore result', cat: 'arrows' },
  { char: '⇑', name: 'upwards double arrow', cat: 'arrows' },
  { char: '⇓', name: 'downwards double arrow', cat: 'arrows' },
  { char: '⇔', name: 'left right double arrow iff equivalent if and only if', cat: 'arrows' },
  { char: '➔', name: 'heavy right arrow bold forward', cat: 'arrows' },
  { char: '➜', name: 'heavy round tipped right arrow pointer', cat: 'arrows' },
  { char: '↗', name: 'north east arrow diagonal up right trending growth', cat: 'arrows' },
  { char: '↘', name: 'south east arrow diagonal down right decline fall', cat: 'arrows' },
  { char: '↙', name: 'south west arrow diagonal down left', cat: 'arrows' },
  { char: '↖', name: 'north west arrow diagonal up left', cat: 'arrows' },
  { char: '↺', name: 'anticlockwise counterclockwise open circle arrow undo', cat: 'arrows' },
  { char: '↻', name: 'clockwise open circle arrow refresh reload redo', cat: 'arrows' },
  { char: '↪', name: 'rightwards arrow with hook return branch', cat: 'arrows' },
  { char: '↩', name: 'leftwards arrow with hook return enter undo', cat: 'arrows' },

  // Typography
  { char: '©', name: 'copyright sign legal all rights reserved', cat: 'typography' },
  { char: '®', name: 'registered trademark sign legal brand', cat: 'typography' },
  { char: '™', name: 'trade mark sign brand product', cat: 'typography' },
  { char: '§', name: 'section sign legal clause law', cat: 'typography' },
  { char: '¶', name: 'pilcrow paragraph sign break text', cat: 'typography' },
  { char: '†', name: 'dagger footnote reference obelisk', cat: 'typography' },
  { char: '‡', name: 'double dagger footnote reference diesis', cat: 'typography' },
  { char: '•', name: 'bullet point dot list item bullet', cat: 'typography' },
  { char: '‣', name: 'triangular bullet point triangle list item', cat: 'typography' },
  { char: '⁃', name: 'hyphen bullet dash list item', cat: 'typography' },
  { char: '—', name: 'em dash long punctuation pause', cat: 'typography' },
  { char: '–', name: 'en dash short range number', cat: 'typography' },
  { char: '…', name: 'horizontal ellipsis dots more continue pause', cat: 'typography' },
  { char: '‘', name: 'left single quotation mark quote apostrophe', cat: 'typography' },
  { char: '’', name: 'right single quotation mark quote apostrophe', cat: 'typography' },
  { char: '“', name: 'left double quotation mark quote speech', cat: 'typography' },
  { char: '”', name: 'right double quotation mark quote speech', cat: 'typography' },
  { char: '«', name: 'left double angle quote guillemet french', cat: 'typography' },
  { char: '»', name: 'right double angle quote guillemet french', cat: 'typography' },
  { char: '°', name: 'degree sign temperature weather angle celcius fahrenheit', cat: 'typography' },
  { char: '′', name: 'prime minute feet measurement', cat: 'typography' },
  { char: '″', name: 'double prime second inches measurement', cat: 'typography' },
  { char: '‰', name: 'per mille per thousand sign ratio', cat: 'typography' },
  { char: '№', name: 'numero sign number reference #', cat: 'typography' },

  // Shapes & Badges
  { char: '✓', name: 'checkmark check tick correct verified ok done', cat: 'shapes' },
  { char: '✔', name: 'heavy check mark bold check tick correct success', cat: 'shapes' },
  { char: '✕', name: 'multiplication x cross cancel wrong delete no', cat: 'shapes' },
  { char: '✖', name: 'heavy multiplication x cross cancel remove', cat: 'shapes' },
  { char: '✗', name: 'ballot x cross mark cancel no ballot', cat: 'shapes' },
  { char: '✘', name: 'heavy ballot x mark cross cancel fail', cat: 'shapes' },
  { char: '★', name: 'black star solid filled favorite gold review rating', cat: 'shapes' },
  { char: '☆', name: 'white star outline bookmark review rating', cat: 'shapes' },
  { char: '✦', name: 'black four pointed star diamond sparkle shine magic', cat: 'shapes' },
  { char: '✧', name: 'white four pointed star diamond outline sparkle', cat: 'shapes' },
  { char: '✪', name: 'circled white star seal emblem achievement', cat: 'shapes' },
  { char: '▲', name: 'black up-pointing triangle filled higher increase up', cat: 'shapes' },
  { char: '▼', name: 'black down-pointing triangle filled lower decrease down', cat: 'shapes' },
  { char: '◀', name: 'black left-pointing triangle filled backward left', cat: 'shapes' },
  { char: '▶', name: 'black right-pointing triangle play filled forward right', cat: 'shapes' },
  { char: '●', name: 'black circle filled solid round bullet', cat: 'shapes' },
  { char: '○', name: 'white circle outline radio empty round', cat: 'shapes' },
  { char: '■', name: 'black square filled solid block box stop', cat: 'shapes' },
  { char: '□', name: 'white square outline box checkbox empty task', cat: 'shapes' },
  { char: '♦', name: 'black diamond suit playing cards poker', cat: 'shapes' },
  { char: '♠', name: 'black spade suit playing cards poker', cat: 'shapes' },
  { char: '♥', name: 'black heart suit playing cards poker love', cat: 'shapes' },
  { char: '♣', name: 'black club suit playing cards poker', cat: 'shapes' },

  // Fractions & Superscripts/Subscripts
  { char: '½', name: 'vulgar fraction one half 1/2 math', cat: 'fractions' },
  { char: '⅓', name: 'vulgar fraction one third 1/3 math', cat: 'fractions' },
  { char: '⅔', name: 'vulgar fraction two thirds 2/3 math', cat: 'fractions' },
  { char: '¼', name: 'vulgar fraction one quarter fourth 1/4 math', cat: 'fractions' },
  { char: '¾', name: 'vulgar fraction three quarters fourths 3/4 math', cat: 'fractions' },
  { char: '⅕', name: 'vulgar fraction one fifth 1/5 math', cat: 'fractions' },
  { char: '⅖', name: 'vulgar fraction two fifths 2/5 math', cat: 'fractions' },
  { char: '⅗', name: 'vulgar fraction three fifths 3/5 math', cat: 'fractions' },
  { char: '⅘', name: 'vulgar fraction four fifths 4/5 math', cat: 'fractions' },
  { char: '⅙', name: 'vulgar fraction one sixth 1/6 math', cat: 'fractions' },
  { char: '⅚', name: 'vulgar fraction five sixths 5/6 math', cat: 'fractions' },
  { char: '⅛', name: 'vulgar fraction one eighth 1/8 math', cat: 'fractions' },
  { char: '⅜', name: 'vulgar fraction three eighths 3/8 math', cat: 'fractions' },
  { char: '⅝', name: 'vulgar fraction five eighths 5/8 math', cat: 'fractions' },
  { char: '⅞', name: 'vulgar fraction seven eighths 7/8 math', cat: 'fractions' },
  { char: '⁰', name: 'superscript zero 0 power index math', cat: 'fractions' },
  { char: '¹', name: 'superscript one 1 power index math', cat: 'fractions' },
  { char: '²', name: 'superscript two squared 2 power math', cat: 'fractions' },
  { char: '³', name: 'superscript three cubed 3 power math', cat: 'fractions' },
  { char: '⁴', name: 'superscript four 4 power math', cat: 'fractions' },
  { char: '⁵', name: 'superscript five 5 power math', cat: 'fractions' },
  { char: 'ⁿ', name: 'superscript n power nth variable math', cat: 'fractions' },
  { char: '⁺', name: 'superscript plus sign positive exponent', cat: 'fractions' },
  { char: '⁻', name: 'superscript minus negative sign exponent', cat: 'fractions' },
  { char: '₀', name: 'subscript zero 0 index math', cat: 'fractions' },
  { char: '₁', name: 'subscript one 1 index math', cat: 'fractions' },
  { char: '₂', name: 'subscript two 2 index math', cat: 'fractions' },
  { char: '₃', name: 'subscript three 3 index math', cat: 'fractions' },
  { char: '₄', name: 'subscript four 4 index math', cat: 'fractions' },
  { char: '₅', name: 'subscript five 5 index math', cat: 'fractions' },
  { char: 'ᵢ', name: 'subscript i index math iteration', cat: 'fractions' },
  { char: 'ⱼ', name: 'subscript j index math iteration', cat: 'fractions' },
  { char: 'ₙ', name: 'subscript n index math sequence', cat: 'fractions' }
];

export const PRESET_EQUATIONS = [
  {
    name: 'Quadratic Formula',
    tag: 'Algebra',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    html: '<i>x</i> = <span class="eq-frac"><span class="eq-num">−<i>b</i> ± √(<i>b</i>² − 4<i>ac</i>)</span><span class="eq-den">2<i>a</i></span></span>'
  },
  {
    name: 'Pythagorean Theorem',
    tag: 'Geometry',
    formula: 'a² + b² = c²',
    html: '<i>a</i>² + <i>b</i>² = <i>c</i>²'
  },
  {
    name: 'Area of a Circle',
    tag: 'Geometry',
    formula: 'A = πr²',
    html: '<i>A</i> = π<i>r</i>²'
  },
  {
    name: 'Mass-Energy Equivalence',
    tag: 'Physics',
    formula: 'E = mc²',
    html: '<i>E</i> = <i>m</i><i>c</i>²'
  },
  {
    name: 'Compound Interest Formula',
    tag: 'Finance',
    formula: 'A = P(1 + r/n)ⁿᵗ',
    html: '<i>A</i> = <i>P</i>(1 + <i>r</i>/<i>n</i>)<sup><i>nt</i></sup>'
  },
  {
    name: 'Binomial Theorem',
    tag: 'Algebra',
    formula: '(x + a)ⁿ = ∑ [n! / (k!(n-k)!)] xᵏ aⁿ⁻ᵏ',
    html: '(<i>x</i> + <i>a</i>)<sup><i>n</i></sup> = ∑<sub><i>k</i>=0</sub><sup><i>n</i></sup> (<sup><i>n</i></sup><sub><i>k</i></sub>) <i>x</i><sup><i>k</i></sup> <i>a</i><sup><i>n</i>−<i>k</i></sup>'
  },
  {
    name: 'Euler’s Identity',
    tag: 'Analysis',
    formula: 'e^(iπ) + 1 = 0',
    html: '<i>e</i><sup><i>i</i>π</sup> + 1 = 0'
  },
  {
    name: 'Calculus Derivative Definition',
    tag: 'Calculus',
    formula: 'df/dx = lim(h→0) [f(x+h) - f(x)] / h',
    html: '<span class="eq-frac"><span class="eq-num"><i>df</i></span><span class="eq-den"><i>dx</i></span></span> = lim<sub><i>h</i>→0</sub> <span class="eq-frac"><span class="eq-num"><i>f</i>(<i>x</i>+<i>h</i>) − <i>f</i>(<i>x</i>)</span><span class="eq-den"><i>h</i></span></span>'
  },
  {
    name: 'Fundamental Theorem of Calculus',
    tag: 'Calculus',
    formula: '∫[a,b] f(x) dx = F(b) - F(a)',
    html: '∫<sub><i>a</i></sub><sup><i>b</i></sup> <i>f</i>(<i>x</i>) <i>dx</i> = <i>F</i>(<i>b</i>) − <i>F</i>(<i>a</i>)'
  },
  {
    name: 'Gaussian Normal Distribution',
    tag: 'Statistics',
    formula: 'f(x) = (1 / (σ√(2π))) · e^(-(x-μ)² / 2σ²)',
    html: '<i>f</i>(<i>x</i>) = <span class="eq-frac"><span class="eq-num">1</span><span class="eq-den">σ√(2π)</span></span> <i>e</i><sup>−(<i>x</i>−μ)² / 2σ²</sup>'
  },
  {
    name: 'Cauchy-Schwarz Inequality',
    tag: 'Linear Algebra',
    formula: '|⟨u, v⟩|² ≤ ⟨u, u⟩ · ⟨v, v⟩',
    html: '|⟨<i>u</i>, <i>v</i>⟩|² ≤ ⟨<i>u</i>, <i>u</i>⟩ · ⟨<i>v</i>, <i>v</i>⟩'
  },
  {
    name: 'Ideal Gas Law',
    tag: 'Thermodynamics',
    formula: 'PV = nRT',
    html: '<i>P</i><i>V</i> = <i>n</i><i>R</i><i>T</i>'
  },
  {
    name: 'Ohm’s Law & Electric Power',
    tag: 'Electronics',
    formula: 'V = IR, P = VI = I²R',
    html: '<i>V</i> = <i>I</i><i>R</i>,&nbsp; <i>P</i> = <i>V</i><i>I</i> = <i>I</i>²<i>R</i>'
  },
  {
    name: 'Newton’s Universal Gravitation',
    tag: 'Physics',
    formula: 'F = G · (m₁ · m₂) / r²',
    html: '<i>F</i> = <i>G</i> <span class="eq-frac"><span class="eq-num"><i>m</i>₁ <i>m</i>₂</span><span class="eq-den"><i>r</i>²</span></span>'
  }
];

export const EMOJIS_CATEGORIES = [
  { id: 'smileys', icon: '😃', label: 'Smileys' },
  { id: 'gestures', icon: '👍', label: 'Gestures' },
  { id: 'work', icon: '💼', label: 'Office' },
  { id: 'tech', icon: '🚀', label: 'Tech' },
  { id: 'symbols', icon: '⭐', label: 'Symbols' },
  { id: 'nature', icon: '🌿', label: 'Nature' },
  { id: 'food', icon: '🍔', label: 'Food' }
];

export const EMOJIS_DATA = [
  // Smileys & Emotion
  { char: '😀', name: 'grinning face happy smile', cat: 'smileys' },
  { char: '😃', name: 'smiling face with big eyes happy', cat: 'smileys' },
  { char: '😄', name: 'grinning face with smiling eyes happy laugh', cat: 'smileys' },
  { char: '😁', name: 'beaming face with smiling eyes teeth grin', cat: 'smileys' },
  { char: '😆', name: 'grinning squinting face laugh haha', cat: 'smileys' },
  { char: '😅', name: 'grinning face with sweat relief phew', cat: 'smileys' },
  { char: '🤣', name: 'rolling on the floor laughing rofl funny', cat: 'smileys' },
  { char: '😂', name: 'face with tears of joy laugh cry funny', cat: 'smileys' },
  { char: '🙂', name: 'slightly smiling face smile okay', cat: 'smileys' },
  { char: '🙃', name: 'upside down face silly sarcasm', cat: 'smileys' },
  { char: '😉', name: 'winking face wink secret', cat: 'smileys' },
  { char: '😊', name: 'smiling face with smiling eyes warm blush', cat: 'smileys' },
  { char: '😇', name: 'smiling face with halo angel innocent', cat: 'smileys' },
  { char: '🥰', name: 'smiling face with hearts love crush adoration', cat: 'smileys' },
  { char: '😍', name: 'smiling face with heart eyes love heart', cat: 'smileys' },
  { char: '🤩', name: 'star struck excited amazing wow', cat: 'smileys' },
  { char: '😘', name: 'face blowing a kiss kiss love', cat: 'smileys' },
  { char: '😋', name: 'face savoring food delicious yummy yum', cat: 'smileys' },
  { char: '😛', name: 'face with tongue playful', cat: 'smileys' },
  { char: '😜', name: 'winking face with tongue crazy wild', cat: 'smileys' },
  { char: '🤪', name: 'zany face crazy googly silly', cat: 'smileys' },
  { char: '🤑', name: 'money mouth face rich cash money dollar', cat: 'smileys' },
  { char: '🤗', name: 'smiling face with open hands hug hugs warmth', cat: 'smileys' },
  { char: '🤭', name: 'face with hand over mouth oops teehee giggle', cat: 'smileys' },
  { char: '🤫', name: 'shushing face quiet shh secret whisper', cat: 'smileys' },
  { char: '🤔', name: 'thinking face hmm wonder ponder curious', cat: 'smileys' },
  { char: '🤐', name: 'zipper mouth face silent shut quiet', cat: 'smileys' },
  { char: '🤨', name: 'face with raised eyebrow skeptical suspect doubt', cat: 'smileys' },
  { char: '😐', name: 'neutral face straight poker blank', cat: 'smileys' },
  { char: '😑', name: 'expressionless face whatever done', cat: 'smileys' },
  { char: '😶', name: 'face without mouth mute silence', cat: 'smileys' },
  { char: '😏', name: 'smirking face smirk sly confident', cat: 'smileys' },
  { char: '😒', name: 'unamused face meh bored annoying', cat: 'smileys' },
  { char: '🙄', name: 'face with rolling eyes eye roll whatever', cat: 'smileys' },
  { char: '😬', name: 'grimacing face awkward yikes nervous', cat: 'smileys' },
  { char: '🤥', name: 'lying face pinocchio liar lie', cat: 'smileys' },
  { char: '😌', name: 'relieved face calm peaceful relaxed', cat: 'smileys' },
  { char: '😔', name: 'pensive face sad sorrow regret', cat: 'smileys' },
  { char: '😪', name: 'sleepy face snot tired drip', cat: 'smileys' },
  { char: '🤤', name: 'drooling face drool saliva delicious want', cat: 'smileys' },
  { char: '😴', name: 'sleeping face zzz sleep snore tired', cat: 'smileys' },
  { char: '😷', name: 'face with medical mask sick doctor mask', cat: 'smileys' },
  { char: '🤒', name: 'face with thermometer fever sick flu', cat: 'smileys' },
  { char: '🤕', name: 'face with head bandage hurt injured bandage', cat: 'smileys' },
  { char: '🤢', name: 'nauseated face gross sick green vomit', cat: 'smileys' },
  { char: '🤮', name: 'face vomiting puking throw up disgust', cat: 'smileys' },
  { char: '🥵', name: 'hot face sweating heat red sunburn fever', cat: 'smileys' },
  { char: '🥶', name: 'cold face freezing blue ice frost shivering', cat: 'smileys' },
  { char: '🥴', name: 'woozy face dizzy drunk intoxicated tipsy', cat: 'smileys' },
  { char: '😵', name: 'dizzy face knocked out spin', cat: 'smileys' },
  { char: '🤯', name: 'exploding head mind blown shock amazed boom', cat: 'smileys' },
  { char: '🤠', name: 'cowboy hat face western yeehaw ranch', cat: 'smileys' },
  { char: '🥳', name: 'partying face party celebrate horn hat confetti', cat: 'smileys' },
  { char: '😎', name: 'smiling face with sunglasses cool boss swag rad', cat: 'smileys' },
  { char: '🤓', name: 'nerd face geek glasses smart intellectual', cat: 'smileys' },
  { char: '🧐', name: 'face with monocle detective classy inspect examine', cat: 'smileys' },
  { char: '😕', name: 'confused face puzzle what uncertain', cat: 'smileys' },
  { char: '😟', name: 'worried face anxious stress panic', cat: 'smileys' },
  { char: '🙁', name: 'slightly frowning face unhappy sad frown', cat: 'smileys' },
  { char: '😮', name: 'face with open mouth surprised wow gasping', cat: 'smileys' },
  { char: '😯', name: 'hushed face silent surprise oh', cat: 'smileys' },
  { char: '😲', name: 'astonished face shock stunned unbelievable', cat: 'smileys' },
  { char: '😳', name: 'flushed face blushed red shy stunned wide eyes', cat: 'smileys' },
  { char: '🥺', name: 'pleading face puppy eyes please beg cute', cat: 'smileys' },
  { char: '😦', name: 'frowning face with open mouth caught upset', cat: 'smileys' },
  { char: '😧', name: 'anguished face painful shock dismay', cat: 'smileys' },
  { char: '😨', name: 'fearful face scared frightened horrified panic', cat: 'smileys' },
  { char: '😰', name: 'anxious face with sweat nervous worried panic', cat: 'smileys' },
  { char: '😥', name: 'sad but relieved face whew sweat wipe', cat: 'smileys' },
  { char: '😢', name: 'crying face tear sad weeping cry', cat: 'smileys' },
  { char: '😭', name: 'loudly crying face bawling sobbing tears sob', cat: 'smileys' },
  { char: '😱', name: 'face screaming in fear scream terror shock', cat: 'smileys' },
  { char: '😖', name: 'confounded face frustrated struggle stress', cat: 'smileys' },
  { char: '😣', name: 'persevering face endure try push strain', cat: 'smileys' },
  { char: '😞', name: 'disappointed face let down bummed gloomy', cat: 'smileys' },
  { char: '😓', name: 'downcast face with sweat stress exhausted', cat: 'smileys' },
  { char: '😩', name: 'weary face tired exasperated done give up', cat: 'smileys' },
  { char: '😫', name: 'tired face exhausted frustrated overload', cat: 'smileys' },
  { char: '🥱', name: 'yawning face yawn sleepy bored bed', cat: 'smileys' },
  { char: '😤', name: 'face with steam from nose proud huff triumph', cat: 'smileys' },
  { char: '😡', name: 'enraged face angry red furious mad pouting', cat: 'smileys' },
  { char: '😠', name: 'angry face mad annoyed irritated cross', cat: 'smileys' },
  { char: '🤬', name: 'face with symbols on mouth swear cuss rage', cat: 'smileys' },
  { char: '😈', name: 'smiling face with horns devil evil playful imp', cat: 'smileys' },
  { char: '👿', name: 'angry face with horns demon devil furious evil', cat: 'smileys' },
  { char: '💀', name: 'skull skeleton dead death dead laughter dying', cat: 'smileys' },
  { char: '☠️', name: 'skull and crossbones pirate poison danger toxic', cat: 'smileys' },
  { char: '💩', name: 'pile of poo poop funny crap brown', cat: 'smileys' },
  { char: '🤡', name: 'clown face circus silly fool joke', cat: 'smileys' },
  { char: '👻', name: 'ghost spirit spooky halloween boo haunt', cat: 'smileys' },
  { char: '👽', name: 'alien extraterrestrial ufo space sci-fi', cat: 'smileys' },
  { char: '🤖', name: 'robot bot android machine artificial intelligence ai', cat: 'smileys' },

  // People & Gestures
  { char: '👋', name: 'waving hand wave hello hi goodbye bye', cat: 'gestures' },
  { char: '🤚', name: 'raised back of hand stop high five backhand', cat: 'gestures' },
  { char: '🖐️', name: 'hand with fingers splayed palm high five', cat: 'gestures' },
  { char: '✋', name: 'raised hand stop halt high five wait', cat: 'gestures' },
  { char: '🖖', name: 'vulcan salute live long and prosper spock sci-fi', cat: 'gestures' },
  { char: '👌', name: 'ok hand okay perfect excellent fine all good', cat: 'gestures' },
  { char: '🤌', name: 'pinched fingers italian what do you want gesture', cat: 'gestures' },
  { char: '🤏', name: 'pinching hand tiny small little bit pinch', cat: 'gestures' },
  { char: '✌️', name: 'victory hand peace two v sign win', cat: 'gestures' },
  { char: '🤞', name: 'crossed fingers good luck hope wish promise', cat: 'gestures' },
  { char: '🤟', name: 'love you gesture sign language rock love', cat: 'gestures' },
  { char: '🤘', name: 'sign of the horns rock on metal music concert', cat: 'gestures' },
  { char: '🤙', name: 'call me hand shaka hang loose surf phone', cat: 'gestures' },
  { char: '👈', name: 'backhand index pointing left point left direction', cat: 'gestures' },
  { char: '👉', name: 'backhand index pointing right point right direction', cat: 'gestures' },
  { char: '👆', name: 'backhand index pointing up point up direction above', cat: 'gestures' },
  { char: '👇', name: 'backhand index pointing down point down direction below', cat: 'gestures' },
  { char: '☝️', name: 'index pointing up one listen attention point up', cat: 'gestures' },
  { char: '👍', name: 'thumbs up approve yes like good correct agree', cat: 'gestures' },
  { char: '👎', name: 'thumbs down disapprove no dislike bad disagree', cat: 'gestures' },
  { char: '✊', name: 'raised fist solidarity strength power resistance', cat: 'gestures' },
  { char: '👊', name: 'oncoming fist bro fist punch bump pound', cat: 'gestures' },
  { char: '🤛', name: 'left-facing fist bump fist', cat: 'gestures' },
  { char: '🤜', name: 'right-facing fist bump fist', cat: 'gestures' },
  { char: '👏', name: 'clapping hands applause bravo congrats cheer well done', cat: 'gestures' },
  { char: '🙌', name: 'raising hands celebrate praise hooray excitement', cat: 'gestures' },
  { char: '👐', name: 'open hands embrace jazz hands offering welcome', cat: 'gestures' },
  { char: '🤲', name: 'palms up together pray prayer offering cupped hands', cat: 'gestures' },
  { char: '🤝', name: 'handshake deal agreement partnership shake hello', cat: 'gestures' },
  { char: '🙏', name: 'folded hands please thank you pray namaste gratitude bless', cat: 'gestures' },
  { char: '✍️', name: 'writing hand write pencil pen author compose', cat: 'gestures' },
  { char: '💪', name: 'flexed biceps muscle strong power workout fitness gym', cat: 'gestures' },
  { char: '👀', name: 'eyes look see glance curious watch inspect', cat: 'gestures' },
  { char: '🧠', name: 'brain smart intellect genius think mental idea', cat: 'gestures' },
  { char: '❤️', name: 'red heart love romance passion favorite like', cat: 'gestures' },
  { char: '🧡', name: 'orange heart warm care affection', cat: 'gestures' },
  { char: '💛', name: 'yellow heart friendship happiness loyalty', cat: 'gestures' },
  { char: '💚', name: 'green heart nature eco envy health', cat: 'gestures' },
  { char: '💙', name: 'blue heart trust peace loyalty corporate', cat: 'gestures' },
  { char: '💜', name: 'purple heart royalty luxury compassion', cat: 'gestures' },
  { char: '🖤', name: 'black heart dark gothic sleek sorrow', cat: 'gestures' },
  { char: '🤍', name: 'white heart pure peace angel clean', cat: 'gestures' },
  { char: '💔', name: 'broken heart heartbreak break up sad grief', cat: 'gestures' },
  { char: '💖', name: 'sparkling heart glitter love glowing affection', cat: 'gestures' },
  { char: '🔥', name: 'fire hot lit trending popular flame blaze energy', cat: 'gestures' },

  // Office & Business
  { char: '💼', name: 'briefcase work job business executive office corporate', cat: 'work' },
  { char: '📁', name: 'file folder directory organize storage documents', cat: 'work' },
  { char: '📂', name: 'open file folder directory documents view', cat: 'work' },
  { char: '📄', name: 'page facing up document paper text contract', cat: 'work' },
  { char: '📃', name: 'page with curl document scroll receipt contract', cat: 'work' },
  { char: '📑', name: 'bookmark tabs document organize index notes', cat: 'work' },
  { char: '📊', name: 'bar chart analytics statistics graph metrics growth', cat: 'work' },
  { char: '📈', name: 'chart increasing upward trend profit growth success stocks', cat: 'work' },
  { char: '📉', name: 'chart decreasing downward trend loss drop stocks deficit', cat: 'work' },
  { char: '📋', name: 'clipboard tasks list survey checklist audit', cat: 'work' },
  { char: '📌', name: 'pushpin pin urgent mark notice board important', cat: 'work' },
  { char: '📍', name: 'round pushpin location map pin spot destination', cat: 'work' },
  { char: '📎', name: 'paperclip attach attachment file paper office', cat: 'work' },
  { char: '🖇️', name: 'linked paperclips attach links documents together', cat: 'work' },
  { char: '📏', name: 'straight ruler measure length engineering design rule', cat: 'work' },
  { char: '📐', name: 'triangular ruler geometry architecture engineering math', cat: 'work' },
  { char: '✂️', name: 'scissors cut snip crop trim office tool', cat: 'work' },
  { char: '🗃️', name: 'card file box archive database catalog organize records', cat: 'work' },
  { char: '🗄️', name: 'file cabinet office archive storage records storage', cat: 'work' },
  { char: '🗑️', name: 'wastebasket trash can delete bin remove discard', cat: 'work' },
  { char: '🔒', name: 'locked padlock security safe protect privacy encrypted', cat: 'work' },
  { char: '🔓', name: 'unlocked padlock open access accessible unprotect decrypt', cat: 'work' },
  { char: '🔑', name: 'key security password unlock access secret credential', cat: 'work' },
  { char: '🗝️', name: 'old key antique vintage secret mystery access', cat: 'work' },
  { char: '🔨', name: 'hammer tool build construction maintenance repair fix', cat: 'work' },
  { char: '🛠️', name: 'hammer and wrench tools settings fix configure build', cat: 'work' },
  { char: '⚙️', name: 'gear settings options configure preferences engineering', cat: 'work' },
  { char: '💵', name: 'dollar banknote cash money payment currency funds', cat: 'work' },
  { char: '💶', name: 'euro banknote cash currency money europe funds', cat: 'work' },
  { char: '💷', name: 'pound banknote cash currency money uk sterling', cat: 'work' },
  { char: '🪙', name: 'coin money currency cash gold crypto token', cat: 'work' },
  { char: '💰', name: 'money bag rich wealth budget investment profit capital', cat: 'work' },
  { char: '💳', name: 'credit card payment purchase visa mastercard debt finance', cat: 'work' },
  { char: '💎', name: 'gem stone diamond crystal luxury premium expensive VIP', cat: 'work' },
  { char: '⚖️', name: 'balance scale justice legal law court fair ethics', cat: 'work' },
  { char: '✉️', name: 'envelope letter mail postal message contact post', cat: 'work' },
  { char: '📧', name: 'e-mail email letter electronic mail send message communication', cat: 'work' },
  { char: '📦', name: 'package parcel box delivery shipping amazon product order', cat: 'work' },

  // Tech & Science
  { char: '💡', name: 'light bulb idea creative innovation insight genius tip solution', cat: 'tech' },
  { char: '⚡', name: 'high voltage lightning bolt power energy electric fast swift', cat: 'tech' },
  { char: '💻', name: 'laptop personal computer macbook pc work code developer tech', cat: 'tech' },
  { char: '🖥️', name: 'desktop computer monitor screen imac workstation pc tech', cat: 'tech' },
  { char: '🖨️', name: 'printer print document paper hardcopy office ink', cat: 'tech' },
  { char: '⌨️', name: 'keyboard typing input computer code key writer', cat: 'tech' },
  { char: '🖱️', name: 'computer mouse click pointer hardware navigation', cat: 'tech' },
  { char: '📱', name: 'mobile phone smartphone iphone android cell call screen', cat: 'tech' },
  { char: '⏱️', name: 'stopwatch timer clock measure performance speed', cat: 'tech' },
  { char: '⏰', name: 'alarm clock time schedule wake alert reminder deadline', cat: 'tech' },
  { char: '📡', name: 'satellite antenna communication signal wireless broadcast radar', cat: 'tech' },
  { char: '🔋', name: 'battery power energy charge level electric life', cat: 'tech' },
  { char: '🔌', name: 'electric plug power connect socket adapter cable electric', cat: 'tech' },
  { char: '🔭', name: 'telescope astronomy look stars universe cosmos observe research', cat: 'tech' },
  { char: '🔬', name: 'microscope science biology research lab inspect discovery zoom', cat: 'tech' },
  { char: '🧪', name: 'test tube chemistry lab science experiment beaker discovery', cat: 'tech' },
  { char: '🧫', name: 'petri dish biology culture bacteria lab science culture', cat: 'tech' },
  { char: '🧬', name: 'dna genetics biology science evolution genome medicine gene', cat: 'tech' },
  { char: '🚀', name: 'rocket ship blast off launch startup fast velocity space orbit', cat: 'tech' },
  { char: '🛰️', name: 'satellite orbit space communication observation cosmos gps', cat: 'tech' },
  { char: '🛸', name: 'flying saucer ufo alien extraterrestrial sci-fi space', cat: 'tech' },
  { char: '🌐', name: 'globe with meridians world internet network web global online earth', cat: 'tech' },
  { char: '🪐', name: 'ringed planet saturn space cosmos universe astronomy', cat: 'tech' },
  { char: '☀️', name: 'sun sunny weather bright warm summer daylight light', cat: 'tech' },
  { char: '🌙', name: 'crescent moon night evening dark sky astronomy sleep', cat: 'tech' },
  { char: '✨', name: 'sparkles stars shine magic clean special new AI feature glow', cat: 'tech' },

  // Symbols & Badges
  { char: '✅', name: 'check mark button green white check yes done success pass approve', cat: 'symbols' },
  { char: '❌', name: 'cross mark red x cancel no error fail reject wrong', cat: 'symbols' },
  { char: '❎', name: 'cross mark button green square x cancel reject', cat: 'symbols' },
  { char: '➕', name: 'heavy plus sign add sum positive increase new', cat: 'symbols' },
  { char: '➖', name: 'heavy minus sign subtract remove negative decrease', cat: 'symbols' },
  { char: '➗', name: 'heavy division sign divide math operator calculate', cat: 'symbols' },
  { char: '✖️', name: 'heavy multiplication x times multiply math cross', cat: 'symbols' },
  { char: '♾️', name: 'infinity symbol forever infinite endless loop limitless', cat: 'symbols' },
  { char: '‼️', name: 'double exclamation mark alert urgent warning pay attention', cat: 'symbols' },
  { char: '⁉️', name: 'exclamation question mark interrobang surprise confused what huh', cat: 'symbols' },
  { char: '❓', name: 'red question mark help query ask confused wonder FAQ', cat: 'symbols' },
  { char: '❔', name: 'white question mark help query ask confused info', cat: 'symbols' },
  { char: '❕', name: 'white exclamation mark alert notice info point', cat: 'symbols' },
  { char: '❗', name: 'red exclamation mark alert notice danger warning important priority', cat: 'symbols' },
  { char: '⭕', name: 'heavy large circle round ring target correct o mark', cat: 'symbols' },
  { char: '🛑', name: 'stop sign octagon red halt cease danger traffic', cat: 'symbols' },
  { char: '⛔', name: 'no entry road sign forbidden blocked denied access barrier', cat: 'symbols' },
  { char: '🚫', name: 'prohibited forbidden banned denied restricted no sign', cat: 'symbols' },
  { char: '⚠️', name: 'warning sign caution danger hazard attention alert alert', cat: 'symbols' },
  { char: 'ℹ️', name: 'information info details note help guide tooltip', cat: 'symbols' },
  { char: '♻️', name: 'recycling symbol recycle eco green sustainability reuse', cat: 'symbols' },
  { char: '❇️', name: 'sparkle green star burst flourish badge shine', cat: 'symbols' },
  { char: '✳️', name: 'eight-spoked asterisk green star symbol note', cat: 'symbols' },
  { char: '✴️', name: 'eight-pointed star orange badge emblem symbol', cat: 'symbols' },
  { char: '💠', name: 'diamond with a dot kawaii flower cute blue gem emblem', cat: 'symbols' },
  { char: '🆗', name: 'OK button okay approve accept good confirm fine', cat: 'symbols' },
  { char: '🆙', name: 'UP! button level up update upgrade increase higher promote', cat: 'symbols' },
  { char: '🆒', name: 'COOL button cool radical neat fresh awesome', cat: 'symbols' },
  { char: '🆕', name: 'NEW button brand new recent fresh latest modern', cat: 'symbols' },
  { char: '🆓', name: 'FREE button zero cost gratis trial complimentary', cat: 'symbols' },
  { char: '⭐', name: 'star gold favorite rating bookmark review top quality', cat: 'symbols' },
  { char: '🌟', name: 'glowing star bright shine night award achievement excellence', cat: 'symbols' },
  { char: '🎯', name: 'direct hit bullseye target goal objective accuracy aim marketing', cat: 'symbols' },
  { char: '🏆', name: 'trophy champion win winner victory prize tournament best award', cat: 'symbols' },
  { char: '🥇', name: 'first place medal gold winner champion 1st rank victory', cat: 'symbols' },
  { char: '🥈', name: 'second place medal silver 2nd rank runner up award', cat: 'symbols' },
  { char: '🥉', name: 'third place medal bronze 3rd rank podium award', cat: 'symbols' },
  { char: '🎖️', name: 'military medal honor distinction decoration hero merit', cat: 'symbols' },
  { char: '🎉', name: 'party popper celebration congrats celebrate congrats milestone yay', cat: 'symbols' },
  { char: '🎊', name: 'confetti ball celebration party congrats festival event', cat: 'symbols' },
  { char: '✨', name: 'sparkles clean magic stars shiny sparkle new fresh', cat: 'symbols' },
  { char: '🎈', name: 'balloon birthday celebrate festive party joy', cat: 'symbols' },
  { char: '🚀', name: 'rocket launch startup spaceship blast fast speed velocity', cat: 'symbols' },
  { char: '🌍', name: 'earth globe europe africa world planet international global', cat: 'symbols' },
  { char: '🌎', name: 'earth globe americas world planet global international', cat: 'symbols' },
  { char: '🌏', name: 'earth globe asia australia world planet global international', cat: 'symbols' },
  { char: '🗺️', name: 'world map geography travel cartography navigation location', cat: 'symbols' },
  { char: '🧭', name: 'compass direction navigate orientation exploration guide', cat: 'symbols' },
  { char: '⚖️', name: 'balance scale justice law legal fairness equality court', cat: 'symbols' },
  { char: '🛠️', name: 'hammer and wrench tools fix repair customize build craft', cat: 'symbols' },
  { char: '⚙️', name: 'gear settings engine mechanics configuration options', cat: 'symbols' },
  { char: '🛡️', name: 'shield security protection defend safety sovereign secure', cat: 'symbols' },
  { char: '🔑', name: 'key access unlock password auth security secret token', cat: 'symbols' },
  { char: '🔐', name: 'locked with key secure encrypted protected cipher private', cat: 'symbols' },
  { char: '💡', name: 'light bulb idea creative innovation eureka smart inspire', cat: 'symbols' },
  { char: '🔋', name: 'battery energy power charge battery full life', cat: 'symbols' },
  { char: '🔌', name: 'electric plug power connect charge electrical wire', cat: 'symbols' },
  { char: '📡', name: 'satellite antenna radar signal wireless transmission telemetry', cat: 'symbols' },
  { char: '🔭', name: 'telescope astronomy research explore science discovery stars', cat: 'symbols' },
  { char: '🔬', name: 'microscope science lab research biological test analysis', cat: 'symbols' },
  { char: '💎', name: 'gem stone diamond precious luxury crystal value quality', cat: 'symbols' },
  { char: '🛎️', name: 'bellhop bell service hotel reception call concierge alert', cat: 'symbols' },
  { char: '🏷️', name: 'label tag price metadata brand category classification', cat: 'symbols' },
  { char: '🔖', name: 'bookmark ribbon reading mark save favorite reference', cat: 'symbols' }
];

/**
 * Formats simple math/formula syntax into clean styled HTML math notation
 */
export function formatEquationHtml(raw) {
  if (!raw || !raw.trim()) return '<i>Formula</i>';
  let s = raw.trim();

  // Common symbol replacements
  s = s.replace(/<=/g, '≤')
       .replace(/>=/g, '≥')
       .replace(/!=/g, '≠')
       .replace(/\+\/-/g, '±')
       .replace(/\+-/g, '±')
       .replace(/\*|\btimes\b/g, '·')
       .replace(/\bpi\b/gi, 'π')
       .replace(/\binfty\b/gi, '∞')
       .replace(/\bint\b/gi, '∫')
       .replace(/\bsum\b/gi, '∑');

  // Fractions: \frac{a}{b}
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="eq-frac"><span class="eq-num">$1</span><span class="eq-den">$2</span></span>');

  // Square roots: \sqrt{...}
  s = s.replace(/\\sqrt\{([^}]+)\}/g, '√<span class="eq-radicand">$1</span>');

  // Superscripts: x^2 or x^{abc}
  s = s.replace(/\^{([^}]+)\}/g, '<sup>$1</sup>');
  s = s.replace(/\^([0-9a-zA-Z+-]+)/g, '<sup>$1</sup>');

  // Subscripts: x_1 or x_{abc}
  s = s.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
  s = s.replace(/_([0-9a-zA-Z+-]+)/g, '<sub>$1</sub>');

  // Variables in italic tags if single isolated letters
  s = s.replace(/\b([a-zA-Z])\b(?![^<]*>)/g, '<i>$1</i>');

  return s;
}

/**
 * Unified Office Symbols, Equation & Emoji Manager
 */
class OfficeSymbolsManager {
  constructor() {
    this.activeEmojiPicker = null;
  }

  // --- 1. EMOJI PICKER POPOVER (Portaled to document.body, Unclipped) ---
  openEmojiPicker(triggerBtn, onInsert) {
    if (this.activeEmojiPicker) {
      this.closeEmojiPicker();
      return;
    }

    const popover = document.createElement('div');
    popover.className = 'drift-emoji-picker-popover open';
    popover.id = 'unified-emoji-popover';

    popover.innerHTML = `
      <div class="emoji-picker-header">
        <div class="emoji-search-box">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="emoji-search-field" placeholder="Search emojis (smile, fire, check...)" spellcheck="false" autocomplete="off">
          <button class="emoji-search-clear" title="Clear search" style="display:none;">✕</button>
        </div>
      </div>
      <div class="emoji-category-bar">
        ${EMOJIS_CATEGORIES.map(c => `
          <button class="emoji-cat-btn ${c.id === 'smileys' ? 'active' : ''}" data-cat="${c.id}" title="${c.label}">
            <span>${c.icon}</span>
          </button>
        `).join('')}
      </div>
      <div class="emoji-picker-body">
        <div class="emoji-grid" id="emoji-grid-content"></div>
      </div>
      <div class="emoji-picker-footer">
        <span class="emoji-preview-name">Select an emoji to insert</span>
      </div>
    `;

    document.body.appendChild(popover);
    this.activeEmojiPicker = popover;

    // Position dynamically relative to trigger button
    const updatePosition = () => {
      if (!triggerBtn || !document.body.contains(popover)) return;
      const rect = triggerBtn.getBoundingClientRect();
      let top = rect.bottom + 6;
      let left = rect.left;

      const popoverWidth = 320;
      const popoverHeight = 360;

      if (left + popoverWidth > window.innerWidth - 12) {
        left = window.innerWidth - popoverWidth - 12;
      }
      if (left < 12) left = 12;

      if (top + popoverHeight > window.innerHeight - 12) {
        top = Math.max(12, rect.top - popoverHeight - 6);
      }

      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const grid = popover.querySelector('#emoji-grid-content');
    const searchInput = popover.querySelector('.emoji-search-field');
    const clearBtn = popover.querySelector('.emoji-search-clear');
    const footerName = popover.querySelector('.emoji-preview-name');
    const catBtns = popover.querySelectorAll('.emoji-cat-btn');

    let currentCat = 'smileys';
    let searchQuery = '';

    const renderEmojis = () => {
      let list = EMOJIS_DATA;
      if (searchQuery) {
        list = list.filter(e => e.name.toLowerCase().includes(searchQuery));
      } else if (currentCat !== 'all') {
        list = list.filter(e => e.cat === currentCat);
      }

      if (list.length === 0) {
        grid.innerHTML = `<div class="emoji-empty-hint">No emojis matching "${searchQuery}"</div>`;
        return;
      }

      grid.innerHTML = list.map(e => `
        <button class="emoji-item-btn" data-char="${e.char}" data-name="${e.name}" title="${e.name}">
          ${e.char}
        </button>
      `).join('');

      grid.querySelectorAll('.emoji-item-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          if (footerName) footerName.textContent = btn.dataset.name;
        });
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const char = btn.dataset.char;
          onInsert(char);
          this.closeEmojiPicker();
        });
      });
    };

    renderEmojis();
    setTimeout(() => searchInput.focus(), 30);

    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      clearBtn.style.display = searchQuery ? 'block' : 'none';
      renderEmojis();
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      renderEmojis();
      searchInput.focus();
    });

    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = btn.dataset.cat;
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        renderEmojis();
      });
    });

    // Close on outside click or ESC
    const onDocClick = (e) => {
      if (!popover.contains(e.target) && e.target !== triggerBtn && !triggerBtn.contains(e.target)) {
        this.closeEmojiPicker();
      }
    };
    const onDocKey = (e) => {
      if (e.key === 'Escape') {
        this.closeEmojiPicker();
      }
    };

    setTimeout(() => {
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', onDocKey);
      popover._cleanup = () => {
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onDocKey);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, 10);
  }

  closeEmojiPicker() {
    if (this.activeEmojiPicker) {
      if (this.activeEmojiPicker._cleanup) this.activeEmojiPicker._cleanup();
      this.activeEmojiPicker.remove();
      this.activeEmojiPicker = null;
    }
  }

  // --- 2. SPECIAL SYMBOLS DIALOG ---
  openSymbolPicker(onInsert) {
    let modal = document.getElementById('unified-symbols-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'office-modal-backdrop';
      modal.id = 'unified-symbols-modal';
      modal.innerHTML = `
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:580px;">
          <div class="office-dialog-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-family:serif; font-size:18px; font-weight:700; color:#2563eb;">Ω</span>
              <span class="office-dialog-title">Insert Special Symbol & Character</span>
            </div>
            <button class="esc-kbd" id="btn-close-unified-symbol">ESC</button>
          </div>
          <div class="office-dialog-body" style="padding:14px 18px; gap:10px;">
            <div style="display:flex; gap:8px; align-items:center;">
              <input type="text" id="unified-symbol-search" class="dialog-input-field" placeholder="Search symbols (e.g. arrow, euro, alpha, check, infinity, fraction)..." autocomplete="off">
            </div>
            <div class="symbol-category-strip" id="unified-symbol-cat-strip">
              ${SYMBOL_CATEGORIES.map(c => `
                <button class="symbol-cat-tab ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>
              `).join('')}
            </div>
            <div class="symbols-grid-container" style="max-height:250px; overflow-y:auto; padding:2px;">
              <div class="symbols-grid" id="unified-symbols-grid"></div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:#64748b; padding-top:6px; border-top:1px solid #f1f5f9;">
              <span id="unified-symbol-hover-desc">Click any symbol to insert instantly at your document cursor.</span>
              <label style="display:flex; align-items:center; gap:5px; cursor:pointer; font-weight:500;">
                <input type="checkbox" id="unified-symbol-keep-open">
                <span>Keep dialog open</span>
              </label>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-unified-symbols">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const searchInput = modal.querySelector('#unified-symbol-search');
    const grid = modal.querySelector('#unified-symbols-grid');
    const hoverDesc = modal.querySelector('#unified-symbol-hover-desc');
    const keepOpen = modal.querySelector('#unified-symbol-keep-open');
    const catTabs = modal.querySelectorAll('.symbol-cat-tab');

    let currentCat = 'all';
    let searchQuery = '';

    const renderSymbols = () => {
      let list = SYMBOLS_DATA;
      if (searchQuery) {
        list = list.filter(s => s.name.toLowerCase().includes(searchQuery) || s.char.includes(searchQuery));
      } else if (currentCat !== 'all') {
        list = list.filter(s => s.cat === currentCat);
      }

      if (list.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:24px; color:#94a3b8;">No symbols matching "${searchQuery}"</div>`;
        return;
      }

      grid.innerHTML = list.map(s => `
        <button class="symbol-item-btn" data-sym="${s.char}" data-name="${s.name}" title="${s.name}">
          ${s.char}
        </button>
      `).join('');

      grid.querySelectorAll('.symbol-item-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          if (hoverDesc) hoverDesc.textContent = `${btn.dataset.sym}  —  ${btn.dataset.name}`;
        });
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sym = btn.dataset.sym;
          onInsert(sym);
          if (!keepOpen?.checked) {
            modal.classList.remove('open');
          }
        });
      });
    };

    renderSymbols();
    modal.classList.add('open');
    setTimeout(() => searchInput?.focus(), 30);

    searchInput.oninput = () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderSymbols();
    };

    catTabs.forEach(tab => {
      tab.onclick = () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCat = tab.dataset.cat;
        renderSymbols();
      };
    });

    const close = () => modal.classList.remove('open');
    modal.querySelector('#btn-close-unified-symbol').onclick = close;
    modal.querySelector('#btn-cancel-unified-symbols').onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };
  }

  // --- 3. MATHEMATICAL EQUATION DIALOG ---
  openEquationDialog(onInsert) {
    let modal = document.getElementById('unified-equation-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'office-modal-backdrop';
      modal.id = 'unified-equation-modal';
      modal.innerHTML = `
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:640px;">
          <div class="office-dialog-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-family:serif; font-size:18px; font-weight:700; color:#2563eb;">√x</span>
              <span class="office-dialog-title">Mathematical Equation Studio</span>
            </div>
            <button class="esc-kbd" id="btn-close-unified-equation">ESC</button>
          </div>
          <div class="office-dialog-body" style="padding:14px 18px; gap:12px;">
            <!-- Standard Formula Presets -->
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label style="font-weight:600; font-size:12px; color:#334155;">1-Click Standard Formulas:</label>
                <span style="font-size:11px; color:#2563eb;">Click any preset to load</span>
              </div>
              <div class="equation-preset-grid" id="unified-eq-presets" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; max-height:130px; overflow-y:auto; padding:2px;">
                ${PRESET_EQUATIONS.map((eq, idx) => `
                  <button class="equation-preset-btn ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
                    <span class="eq-preset-name">${eq.name}</span>
                    <span class="eq-preset-math">${eq.formula}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Quick Math Palette -->
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:11.5px; color:#334155;">Quick Math Symbols:</label>
              <div class="equation-palette-bar" id="unified-eq-palette" style="display:flex; flex-wrap:wrap; gap:4px;">
                <button class="eq-pal-btn" data-insert="\\frac{a}{b}" title="Fraction">a/b</button>
                <button class="eq-pal-btn" data-insert="\\sqrt{x}" title="Square Root">√x</button>
                <button class="eq-pal-btn" data-insert="x^2" title="Superscript">x²</button>
                <button class="eq-pal-btn" data-insert="x_1" title="Subscript">x₁</button>
                <button class="eq-pal-btn" data-insert="∫" title="Integral">∫</button>
                <button class="eq-pal-btn" data-insert="∑" title="Sum">∑</button>
                <button class="eq-pal-btn" data-insert="∏" title="Product">∏</button>
                <button class="eq-pal-btn" data-insert="lim_{x→0}" title="Limit">lim</button>
                <button class="eq-pal-btn" data-insert="±" title="Plus-Minus">±</button>
                <button class="eq-pal-btn" data-insert="·" title="Dot Product">·</button>
                <button class="eq-pal-btn" data-insert="×" title="Multiply">×</button>
                <button class="eq-pal-btn" data-insert="÷" title="Divide">÷</button>
                <button class="eq-pal-btn" data-insert="≠" title="Not Equal">≠</button>
                <button class="eq-pal-btn" data-insert="≤" title="Less Than or Equal">≤</button>
                <button class="eq-pal-btn" data-insert="≥" title="Greater Than or Equal">≥</button>
                <button class="eq-pal-btn" data-insert="≈" title="Approx">≈</button>
                <button class="eq-pal-btn" data-insert="∞" title="Infinity">∞</button>
                <button class="eq-pal-btn" data-insert="π" title="Pi">π</button>
                <button class="eq-pal-btn" data-insert="θ" title="Theta">θ</button>
                <button class="eq-pal-btn" data-insert="λ" title="Lambda">λ</button>
                <button class="eq-pal-btn" data-insert="Δ" title="Delta">Δ</button>
                <button class="eq-pal-btn" data-insert="Ω" title="Omega">Ω</button>
                <button class="eq-pal-btn" data-insert="∂" title="Partial">∂</button>
              </div>
            </div>

            <!-- Formula Expression Input & Mode -->
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <label style="font-weight:600; font-size:12px; color:#334155;">Equation Expression:</label>
                <div style="display:flex; align-items:center; gap:10px; font-size:11.5px;">
                  <label style="cursor:pointer; display:flex; align-items:center; gap:3px;">
                    <input type="radio" name="unified-eq-mode" value="inline" checked> Inline Pill
                  </label>
                  <label style="cursor:pointer; display:flex; align-items:center; gap:3px;">
                    <input type="radio" name="unified-eq-mode" value="display"> Centered Block
                  </label>
                </div>
              </div>
              <input type="text" id="unified-equation-input" class="dialog-input-field" placeholder="Type formula expression..." value="x = (-b ± √(b² - 4ac)) / (2a)">
            </div>

            <!-- Visual Math Preview -->
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:11.5px; color:#64748b;">Visual Equation Rendering:</label>
              <div id="unified-equation-preview" class="office-equation-preview-box"></div>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-unified-eq">Cancel</button>
            <button class="btn-giri-primary" id="btn-confirm-unified-eq" style="padding:7px 18px; font-size:12px;">Insert Equation</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const input = modal.querySelector('#unified-equation-input');
    const preview = modal.querySelector('#unified-equation-preview');
    const presetBtns = modal.querySelectorAll('.equation-preset-btn');
    const palBtns = modal.querySelectorAll('.eq-pal-btn');

    const updatePreview = () => {
      const val = input.value.trim();
      const formatted = formatEquationHtml(val);
      preview.innerHTML = formatted;
    };

    presetBtns.forEach(btn => {
      btn.onclick = () => {
        presetBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const eq = PRESET_EQUATIONS[parseInt(btn.dataset.idx, 10)];
        if (eq) {
          input.value = eq.formula;
          updatePreview();
        }
      };
    });

    palBtns.forEach(btn => {
      btn.onclick = () => {
        const toAdd = btn.dataset.insert;
        input.value += (input.value ? ' ' : '') + toAdd;
        updatePreview();
        input.focus();
      };
    });

    input.oninput = updatePreview;
    updatePreview();

    modal.classList.add('open');
    setTimeout(() => input.focus(), 30);

    const close = () => modal.classList.remove('open');
    modal.querySelector('#btn-close-unified-equation').onclick = close;
    modal.querySelector('#btn-cancel-unified-eq').onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };

    modal.querySelector('#btn-confirm-unified-eq').onclick = () => {
      const val = input.value.trim();
      if (!val) return;
      const isDisplay = modal.querySelector('input[name="unified-eq-mode"]:checked')?.value === 'display';
      const formatted = formatEquationHtml(val);
      
      let htmlBlock = '';
      if (isDisplay) {
        htmlBlock = `<div class="office-equation-block" contenteditable="false" data-formula="${val}"><div class="office-equation-inner"><span class="eq-symbol-tag">√x</span><span class="eq-content-rendered">${formatted}</span></div></div><p></p>`;
      } else {
        htmlBlock = `<span class="office-equation-pill" contenteditable="false" data-formula="${val}"><span class="eq-symbol-tag">√x</span><span class="eq-content-rendered">${formatted}</span></span>&nbsp;`;
      }
      
      onInsert(htmlBlock, isDisplay, val);
      close();
    };
  }
}

export const symbolsManager = new OfficeSymbolsManager();
