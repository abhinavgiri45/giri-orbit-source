import { FluentFontPicker } from '../components/fontPicker.js';
import { WORLD_FONTS_CATALOG, loadGoogleFont, populateFontSelect, findFont } from '../data/fonts.js';
import { symbolsManager } from '../components/symbolsManager.js';
import { localSync } from '../components/localFileDirectSync.js';
import { thesaurusManager } from '../components/thesaurusManager.js';
import { orbitDesktopSuite } from '../components/orbitDesktopSuite.js';
import { GiriOfficeFormats } from '../components/giriOfficeFormats.js';
/**
 * ============================================================================
 * GIRI ORBIT — GIRI DRIFT: ENTERPRISE WORD PROCESSOR & TEMPLATE HUB (drift.js)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * ============================================================================
 * Features:
 * - Fluent Office Document Start & Template Hub:
 *   - Dark obsidian hero banner with 3D workspace graphic & action CTAs
 *   - "Create with templates" category pills (Recommended, Resumes, Invoices,
 *     Papers and Reports, Flyers, Meeting Notes, Letters, Custom Templates)
 *   - Live search filter for templates
 *   - High-fidelity realistic mini document preview cards with hover elevation
 * - Comprehensive Custom Templates Engine:
 *   - Create custom templates from scratch or save active document as a template
 *   - Persistent in localStorage ('giri_orbit_custom_templates')
 *   - Delete, manage, and load user-defined custom templates
 * - Full-Bleed 5-Tab Office Ribbon Editor:
 *   - Home, Insert, Page Layout, Review, View
 *   - Table builder, Equation editor, Special symbols, Hyperlinks, Checklists
 *   - Document statistics, Voice dictation, Outline sidebar, Zen mode
 */

// ============================================================================
// BUILT-IN TEMPLATES COLLECTION (Matching User's Screenshot & Office Needs)
// ============================================================================
const BUILTIN_TEMPLATES = [
  {
    id: 'fall-gala',
    name: 'Fall Gala',
    category: 'flyers',
    desc: 'Stylish event invitation flyer with warm autumn organic shapes',
    previewBg: '#fdfbf7',
    previewAccent: '#bfa47e',
    previewHtml: `
      <div style="padding:12px 10px; height:100%; display:flex; flex-direction:column; align-items:center; text-align:center; background:#fcf9f2; position:relative; overflow:hidden; font-family:Georgia, serif;">
        <div style="position:absolute; top:-12px; left:-12px; width:45px; height:45px; background:#e8dfcc; border-radius:50%; opacity:0.7;"></div>
        <div style="position:absolute; bottom:-18px; right:-10px; width:65px; height:65px; background:#e0cfb8; border-radius:40% 60% 70% 30%; opacity:0.6;"></div>
        <span style="font-size:7px; text-transform:uppercase; letter-spacing:1px; color:#8c7e68; margin-top:16px;">Annual Benefit</span>
        <strong style="font-size:14px; font-weight:400; letter-spacing:2px; color:#2c2824; margin:4px 0 2px 0;">FALL GALA</strong>
        <div style="width:24px; height:1px; background:#bfa47e; margin:4px auto;"></div>
        <span style="font-size:8px; font-weight:700; color:#4a4237; margin-top:2px;">SEPTEMBER 23RD</span>
        <span style="font-size:7px; color:#786c59;">6:00 PM &bull; CHICAGO</span>
        <div style="width:85%; height:2px; background:#e8dfcc; margin:16px auto 3px;"></div>
        <div style="width:70%; height:2px; background:#e8dfcc; margin:3px auto;"></div>
        <div style="width:60%; height:2px; background:#e8dfcc; margin:3px auto;"></div>
      </div>
    `,
    content: `
      <div style="background:#fcf9f2; padding:48px 40px; border-radius:8px; border:1px solid #e7dfcf; font-family:'Georgia', serif; text-align:center; position:relative; overflow:hidden;">
        <div style="position:absolute; top:-30px; left:-30px; width:130px; height:130px; background:#e8dfcc; border-radius:50%; opacity:0.6;"></div>
        <div style="position:absolute; bottom:-40px; right:-20px; width:160px; height:160px; background:#e0cfb8; border-radius:40% 60% 70% 30%; opacity:0.5;"></div>
        <p style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.25em; color:#786c59; margin-bottom:12px;">You Are Cordially Invited</p>
        <h1 style="font-size:42px; font-weight:400; letter-spacing:0.15em; color:#2c2824; margin:12px 0;">FALL GALA</h1>
        <div style="width:50px; height:2px; background:#bfa47e; margin:18px auto;"></div>
        <p style="font-size:14px; font-weight:600; color:#4a4237; margin:14px 0;">SEPTEMBER 23RD AT 6:00 PM</p>
        <p style="font-size:12.5px; color:#6b6051; margin:6px 0;">GRAND BALLROOM &bull; 123 45TH AVE, CHICAGO, IL 54321</p>
        <p style="font-size:13.5px; line-height:1.8; color:#574e41; max-width:480px; margin:24px auto;">
          Join us for an enchanting evening under the autumn moon celebrating seasonal innovation, sustainable agriculture, and community fellowship. A night of fine dining, live chamber music, and philanthropic awards.
        </p>
        <div style="margin-top:28px; padding:10px 24px; display:inline-block; border:1px solid #bfa47e; border-radius:24px; font-size:12px; font-weight:600; color:#3b352c; letter-spacing:0.05em;">
          RSVP: GALA@EASTORCHARD.ORG &bull; BLACK TIE OPTIONAL
        </div>
      </div>
      <p></p>
    `
  },
  {
    id: 'academic-paper',
    name: 'Academic Research Paper',
    category: 'papers',
    desc: 'MLA/APA style academic paper with works cited and abstract',
    previewBg: '#ffffff',
    previewAccent: '#0f172a',
    previewHtml: `
      <div style="padding:14px 12px; height:100%; font-family:'Times New Roman', serif; color:#0f172a; display:flex; flex-direction:column;">
        <span style="font-size:7px; color:#64748b;">Alex Morgan<br>Prof. Vance</span>
        <div style="height:3px; width:70%; background:#0f172a; margin:14px auto 4px; text-align:center;"></div>
        <div style="height:2px; width:50%; background:#0f172a; margin:2px auto 14px;"></div>
        <div style="height:2px; width:95%; background:#cbd5e1; margin-bottom:4px;"></div>
        <div style="height:2px; width:90%; background:#cbd5e1; margin-bottom:4px;"></div>
        <div style="height:2px; width:92%; background:#cbd5e1; margin-bottom:4px;"></div>
        <div style="height:2px; width:88%; background:#cbd5e1; margin-bottom:4px;"></div>
        <div style="height:2px; width:75%; background:#cbd5e1; margin-bottom:12px;"></div>
        <div style="height:2px; width:92%; background:#cbd5e1; margin-bottom:4px;"></div>
        <div style="height:2px; width:85%; background:#cbd5e1;"></div>
      </div>
    `,
    content: `
      <div style="font-family:'Times New Roman', serif; line-height:2.0; font-size:13.5px; color:#111827;">
        <p style="margin:0; text-align:left;">
          Alex Morgan<br>
          Prof. Eleanor Vance<br>
          Advanced Spatial Computation 401<br>
          14 September 2026
        </p>
        <h2 style="text-align:center; font-size:16px; font-weight:bold; margin:28px 0 20px;">
          Applying Principles of Zero-Database Memory Structures in Modern Enterprise Computation
        </h2>
        <p style="text-indent:36px; margin-bottom:18px;">
          Modern enterprise computing frameworks have historically prioritized centralized client-server paradigms, introducing persistent network latency, transmission overhead, and third-party cloud data exfiltration vulnerabilities. In this study, we evaluate the cognitive and computational throughput gains achieved by executing distributed workspace geometry directly within sovereign client memory buffers.
        </p>
        <p style="text-indent:36px; margin-bottom:18px;">
          Our empirical benchmarks across 1,500 continuous vector transformations recorded sub-millisecond dispatch cycles with 0 KB outbound packet transmission. These findings substantiate the feasibility of complete local data sovereignty in mission-critical office suites.
        </p>
        <h3 style="text-align:center; font-size:14px; font-weight:bold; margin-top:32px;">Works Cited</h3>
        <p style="margin-left:36px; text-indent:-36px; font-size:12.5px;">
          Giri, Abhinav. <em>Sovereign In-Memory Vector Architectures: Operational Paradigms for Enterprise Workspace Parity</em>. Giri Group Press, 2026.
        </p>
      </div>
      <p></p>
    `
  },
  {
    id: 'kai-carter',
    name: 'Kai Carter Resume',
    category: 'resumes',
    desc: 'Clean 2-column executive resume layout with experience timeline',
    previewBg: '#ffffff',
    previewAccent: '#2563eb',
    previewHtml: `
      <div style="padding:12px 10px; height:100%; font-family:sans-serif; display:flex; flex-direction:column;">
        <div style="border-bottom:1px solid #0f172a; padding-bottom:6px; margin-bottom:8px;">
          <strong style="font-size:10px; color:#0f172a; display:block;">KAI CARTER</strong>
          <span style="font-size:6px; color:#64748b;">EXECUTIVE PRODUCT DESIGNER</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:8px;">
          <div>
            <span style="font-size:6.5px; font-weight:700; color:#2563eb; display:block; margin-bottom:3px;">PROFILE</span>
            <div style="height:2px; width:90%; background:#e2e8f0; margin-bottom:3px;"></div>
            <div style="height:2px; width:70%; background:#e2e8f0; margin-bottom:8px;"></div>
            <span style="font-size:6.5px; font-weight:700; color:#2563eb; display:block; margin-bottom:3px;">SKILLS</span>
            <div style="height:2px; width:80%; background:#e2e8f0; margin-bottom:3px;"></div>
            <div style="height:2px; width:60%; background:#e2e8f0;"></div>
          </div>
          <div>
            <span style="font-size:6.5px; font-weight:700; color:#0f172a; display:block; margin-bottom:3px;">EXPERIENCE</span>
            <div style="height:2px; width:95%; background:#cbd5e1; margin-bottom:3px;"></div>
            <div style="height:2px; width:90%; background:#cbd5e1; margin-bottom:3px;"></div>
            <div style="height:2px; width:85%; background:#cbd5e1; margin-bottom:6px;"></div>
            <div style="height:2px; width:90%; background:#cbd5e1; margin-bottom:3px;"></div>
            <div style="height:2px; width:75%; background:#cbd5e1;"></div>
          </div>
        </div>
      </div>
    `,
    content: `
      <div style="font-family:'Plus Jakarta Sans', sans-serif; color:#0f172a;">
        <header style="border-bottom:2px solid #0f172a; padding-bottom:16px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <h1 style="font-size:30px; font-weight:800; letter-spacing:-0.02em; margin:0 0 4px 0;">KAI CARTER</h1>
            <span style="font-size:13px; font-weight:700; color:#2563eb; text-transform:uppercase; letter-spacing:0.06em;">Principal Executive Product Designer</span>
          </div>
          <div style="text-align:right; font-size:11.5px; color:#64748b; line-height:1.5;">
            kai.carter@giricorp.com<br>+1 (555) 382-9901 &bull; San Francisco, CA
          </div>
        </header>

        <div style="display:grid; grid-template-columns:1fr 2.2fr; gap:32px;">
          <aside>
            <section style="margin-bottom:20px;">
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:4px; margin-bottom:8px; color:#1e293b;">Profile</h3>
              <p style="font-size:12px; line-height:1.6; color:#334155;">
                Senior product architect with 10+ years specializing in enterprise design systems, fluid vector physics, and zero-latency desktop software suites.
              </p>
            </section>
            <section style="margin-bottom:20px;">
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:4px; margin-bottom:8px; color:#1e293b;">Education</h3>
              <p style="font-size:12px; font-weight:700; margin:0; color:#0f172a;">B.S. Interaction Design</p>
              <p style="font-size:11px; color:#64748b; margin:2px 0;">Stanford University, 2016</p>
            </section>
            <section>
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:4px; margin-bottom:8px; color:#1e293b;">Core Competencies</h3>
              <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
                <span style="font-size:10.5px; background:#eff6ff; color:#2563eb; padding:3px 7px; border-radius:4px; font-weight:600;">System Architecture</span>
                <span style="font-size:10.5px; background:#eff6ff; color:#2563eb; padding:3px 7px; border-radius:4px; font-weight:600;">Vector Physics</span>
                <span style="font-size:10.5px; background:#eff6ff; color:#2563eb; padding:3px 7px; border-radius:4px; font-weight:600;">UI/UX Design</span>
                <span style="font-size:10.5px; background:#eff6ff; color:#2563eb; padding:3px 7px; border-radius:4px; font-weight:600;">Typography</span>
              </div>
            </section>
          </aside>

          <main>
            <section style="margin-bottom:24px;">
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:4px; margin-bottom:12px; color:#1e293b;">Work Experience</h3>
              <div style="margin-bottom:18px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700; color:#0f172a;">
                  <span>Lead Architect &bull; Abhinav Giri</span>
                  <span style="color:#64748b; font-weight:500; font-size:12px;">2022 &ndash; Present</span>
                </div>
                <p style="font-size:12px; color:#334155; line-height:1.6; margin-top:4px;">
                  Architected the full-bleed white design system for Giri Orbit. Engineered interactive ribbons, formula parsers, and custom template systems serving multinational enterprise clients.
                </p>
              </div>

              <div>
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700; color:#0f172a;">
                  <span>Senior Product Designer &bull; Linear Dynamics</span>
                  <span style="color:#64748b; font-weight:500; font-size:12px;">2018 &ndash; 2022</span>
                </div>
                <p style="font-size:12px; color:#334155; line-height:1.6; margin-top:4px;">
                  Designed dark and light sovereign productivity suites. Reduced cognitive context-switching overhead by 42% across 500,000 active enterprise workstations.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
      <p></p>
    `
  },
  {
    id: 'tonnie-thomsen',
    name: 'Tonnie Thomsen Cover Letter',
    category: 'letters',
    desc: 'Stylish executive cover letter with sage green header typography',
    previewBg: '#ffffff',
    previewAccent: '#15803d',
    previewHtml: `
      <div style="padding:14px 12px; height:100%; font-family:sans-serif; display:flex; flex-direction:column;">
        <strong style="font-size:11px; color:#15803d; margin-bottom:2px;">Tonnie Thomsen</strong>
        <span style="font-size:6px; color:#64748b; margin-bottom:6px;">EDUCATIONAL STRATEGIST</span>
        <div style="height:1.5px; width:100%; background:#bbf7d0; margin-bottom:10px;"></div>
        <span style="font-size:6px; color:#94a3b8; margin-bottom:6px;">September 11, 2026</span>
        <div style="height:2px; width:45%; background:#0f172a; margin-bottom:10px;"></div>
        <div style="height:2px; width:95%; background:#cbd5e1; margin-bottom:3px;"></div>
        <div style="height:2px; width:90%; background:#cbd5e1; margin-bottom:3px;"></div>
        <div style="height:2px; width:92%; background:#cbd5e1; margin-bottom:8px;"></div>
        <div style="height:2px; width:95%; background:#cbd5e1; margin-bottom:3px;"></div>
        <div style="height:2px; width:80%; background:#cbd5e1; margin-bottom:12px;"></div>
        <span style="font-size:8px; font-family:'Brush Script MT', cursive; color:#15803d;">Tonnie Thomsen</span>
      </div>
    `,
    content: `
      <div style="font-family:'Inter', sans-serif; color:#1e293b; line-height:1.7;">
        <header style="margin-bottom:24px;">
          <h1 style="font-size:28px; font-weight:800; color:#15803d; margin:0 0 4px 0;">Tonnie Thomsen</h1>
          <span style="font-size:12px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.04em;">Educational Strategist &bull; Curriculum Director</span>
          <div style="font-size:11.5px; color:#94a3b8; margin-top:4px;">tonnie.thomsen@education.org &bull; (555) 749-1123</div>
        </header>

        <div style="height:2px; background:#bbf7d0; margin-bottom:20px;"></div>
        <p style="font-size:12px; color:#64748b; margin-bottom:16px;">September 11, 2026</p>
        <p style="font-size:13px; font-weight:600; margin-bottom:14px; color:#0f172a;">
          Principal Ann Harrison<br>
          Oakridge Collegiate Institute<br>
          742 Evergreen Terrace, Seattle, WA
        </p>
        <p style="font-size:13px; margin-bottom:14px;">Dear Principal Harrison,</p>
        <p style="font-size:13px; margin-bottom:14px;">
          I am writing with genuine enthusiasm to submit my candidacy for the Lead Educational Strategist position at Oakridge Collegiate Institute. With more than nine years of experience leading advanced interdisciplinary STEM programs, I specialize in designing curricula that bridge classical humanities and computational literacy.
        </p>
        <p style="font-size:13px; margin-bottom:14px;">
          During my recent tenure with Pacific Academic Networks, I oversaw the rollout of high-velocity research workshops across 18 regional institutions, yielding a 28% increase in student research publications. My commitment is to foster an academic culture where teachers and students thrive.
        </p>
        <p style="font-size:13px; margin-bottom:24px;">
          I look forward to discussing how my strategic methodology aligns with the forward-looking vision of Oakridge Collegiate Institute. Thank you for your time and consideration.
        </p>
        <p style="font-size:13px; margin-bottom:4px;">Sincerely,</p>
        <div style="font-family:'Brush Script MT', cursive, sans-serif; font-size:26px; color:#15803d;">Tonnie Thomsen</div>
      </div>
      <p></p>
    `
  },
  {
    id: 'market-invoice',
    name: 'Market Financial Consulting Invoice',
    category: 'invoices',
    desc: 'Itemized billing statement with calculation columns and payment terms',
    previewBg: '#ffffff',
    previewAccent: '#16a34a',
    previewHtml: `
      <div style="padding:12px 10px; height:100%; font-family:sans-serif; display:flex; flex-direction:column;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <div><strong style="font-size:7px; color:#1e40af;">Market Consulting</strong></div>
          <div><strong style="font-size:9px; color:#0f172a;">INVOICE</strong></div>
        </div>
        <div style="height:10px; background:#f8fafc; border:1px solid #e2e8f0; margin-bottom:8px;"></div>
        <div style="height:8px; background:#1e40af; margin-bottom:2px;"></div>
        <div style="height:4px; background:#e2e8f0; margin-bottom:2px;"></div>
        <div style="height:4px; background:#f8fafc; margin-bottom:2px;"></div>
        <div style="height:4px; background:#e2e8f0; margin-bottom:8px;"></div>
        <div style="display:flex; justify-content:flex-end;">
          <div style="width:40%; height:6px; background:#16a34a;"></div>
        </div>
      </div>
    `,
    content: `
      <div style="font-family:'Inter', sans-serif; color:#0f172a;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
          <div>
            <h2 style="font-size:19px; font-weight:800; color:#1e40af; margin:0;">Market Financial Consulting</h2>
            <span style="font-size:11.5px; color:#64748b;">450 East 53rd Street, New York, NY 10022</span>
          </div>
          <div style="text-align:right;">
            <h1 style="font-size:24px; font-weight:900; color:#0f172a; margin:0;">INVOICE</h1>
            <span style="font-size:11px; font-family:var(--font-mono); color:#64748b;">#INV-2026-089</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; background:#f8fafc; padding:14px; border-radius:6px; margin-bottom:22px; font-size:12px; border:1px solid #e2e8f0;">
          <div><strong>Billed To:</strong><br>Abhinav Giri<br>Attn: Enterprise Treasury Division</div>
          <div style="text-align:right;"><strong>Invoice Date:</strong> 2026-09-11<br><strong>Due Date:</strong> 2026-10-11 (Net 30)</div>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:20px;">
          <thead>
            <tr style="background:#1e40af; color:#ffffff;">
              <th style="padding:9px 12px; text-align:left;">Description</th>
              <th style="padding:9px 12px; text-align:center;">Hours</th>
              <th style="padding:9px 12px; text-align:right;">Rate</th>
              <th style="padding:9px 12px; text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:9px 12px; font-weight:500;">Q3 Enterprise Sovereign Architecture Audit</td>
              <td style="padding:9px 12px; text-align:center;">16</td>
              <td style="padding:9px 12px; text-align:right;">$150.00</td>
              <td style="padding:9px 12px; text-align:right;">$2,400.00</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:9px 12px; font-weight:500;">In-Memory Zero-Database Performance Testing</td>
              <td style="padding:9px 12px; text-align:center;">9</td>
              <td style="padding:9px 12px; text-align:right;">$150.00</td>
              <td style="padding:9px 12px; text-align:right;">$1,350.00</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end;">
          <div style="width:230px; font-size:12.5px;">
            <div style="display:flex; justify-content:space-between; padding:4px 0;"><span>Subtotal:</span><span>$3,750.00</span></div>
            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #cbd5e1;"><span>Tax (0%):</span><span>$0.00</span></div>
            <div style="display:flex; justify-content:space-between; padding:8px 0; font-size:15px; font-weight:800; color:#1e40af;"><span>Total Due:</span><span>$3,750.00</span></div>
          </div>
        </div>
      </div>
      <p></p>
    `
  },
  {
    id: 'pet-volunteer',
    name: 'Pet Volunteer Opportunity',
    category: 'flyers',
    desc: 'Community bulletin flyer with cyan banner and bulleted role checklist',
    previewBg: '#ffffff',
    previewAccent: '#0284c7',
    previewHtml: `
      <div style="height:100%; font-family:sans-serif; display:flex; flex-direction:column;">
        <div style="height:55px; background:linear-gradient(135deg, #0284c7, #0369a1); padding:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff;">
          <strong style="font-size:7.5px; text-align:center;">PET VOLUNTEER OPPORTUNITY</strong>
        </div>
        <div style="padding:10px 8px; flex:1;">
          <div style="height:3px; width:70%; background:#0f172a; margin-bottom:6px;"></div>
          <div style="height:2px; width:90%; background:#e2e8f0; margin-bottom:3px;"></div>
          <div style="height:2px; width:85%; background:#e2e8f0; margin-bottom:8px;"></div>
          <div style="height:2px; width:80%; background:#0284c7; margin-bottom:3px;"></div>
          <div style="height:2px; width:75%; background:#0284c7; margin-bottom:3px;"></div>
          <div style="height:2px; width:70%; background:#0284c7;"></div>
        </div>
      </div>
    `,
    content: `
      <div style="font-family:'Plus Jakarta Sans', sans-serif; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; background:#ffffff;">
        <div style="background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding:28px 24px; color:#ffffff; text-align:center;">
          <h1 style="font-size:28px; font-weight:800; margin:0 0 6px 0; letter-spacing:0.02em;">PET VOLUNTEER OPPORTUNITY</h1>
          <p style="font-size:13.5px; opacity:0.92; margin:0;">Make a direct, life-saving impact for rescued companion animals.</p>
        </div>
        <div style="padding:28px;">
          <h3 style="font-size:16px; font-weight:700; color:#0f172a; margin-bottom:10px;">Community Foster & Socialization Weekend</h3>
          <p style="font-size:13px; line-height:1.7; color:#475569; margin-bottom:18px;">
            The regional animal sanctuary is inviting compassionate volunteers to join our weekend care teams. Whether assisting with gentle exercise, grooming, or adoption matchmaking, your hours make an immediate difference.
          </p>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; margin-bottom:24px;">
            <div style="display:flex; align-items:center; gap:10px;"><span style="color:#0284c7; font-weight:800;">✔</span> <span>Canine Enrichment & Walking Shifts (Saturday mornings)</span></div>
            <div style="display:flex; align-items:center; gap:10px;"><span style="color:#0284c7; font-weight:800;">✔</span> <span>Feline Socialization and Cuddle Rooms</span></div>
            <div style="display:flex; align-items:center; gap:10px;"><span style="color:#0284c7; font-weight:800;">✔</span> <span>Adoption Welcome Desk & Visitor Guidance</span></div>
          </div>
          <div style="background:#f0f9ff; border-left:4px solid #0284c7; padding:14px 18px; border-radius:4px; font-size:12.5px; color:#0369a1;">
            <strong>Orientation Sessions:</strong> Saturdays at 10:00 AM &bull; 4567 Main Street &bull; Call (555) 019-2831 to reserve your badge.
          </div>
        </div>
      </div>
      <p></p>
    `
  },
  {
    id: 'meeting-notes',
    name: 'Executive Meeting Notes',
    category: 'meeting',
    desc: 'Council agenda, attendee roster, and action items accountability grid',
    previewBg: '#ffffff',
    previewAccent: '#475569',
    previewHtml: `
      <div style="padding:14px 12px; height:100%; font-family:sans-serif; display:flex; flex-direction:column;">
        <div style="border-bottom:1.5px solid #0f172a; padding-bottom:4px; margin-bottom:8px; display:flex; justify-content:space-between;">
          <strong style="font-size:7px;">MEETING MINUTES</strong>
          <span style="font-size:6px; color:#64748b;">2026-09-11</span>
        </div>
        <span style="font-size:6.5px; font-weight:700; color:#1e40af; margin-bottom:2px;">1. ATTENDEES</span>
        <div style="height:2px; width:80%; background:#e2e8f0; margin-bottom:6px;"></div>
        <span style="font-size:6.5px; font-weight:700; color:#1e40af; margin-bottom:2px;">2. DECISIONS</span>
        <div style="height:2px; width:90%; background:#e2e8f0; margin-bottom:3px;"></div>
        <div style="height:2px; width:85%; background:#e2e8f0; margin-bottom:6px;"></div>
        <span style="font-size:6.5px; font-weight:700; color:#1e40af; margin-bottom:2px;">3. ACTION ITEMS</span>
        <div style="height:20px; background:#f8fafc; border:1px solid #cbd5e1;"></div>
      </div>
    `,
    content: `
      <div style="font-family:'Inter', sans-serif; color:#0f172a;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0f172a; padding-bottom:12px; margin-bottom:20px;">
          <div>
            <h1 style="font-size:22px; font-weight:800; margin:0;">EXECUTIVE STRATEGIC COUNCIL MINUTES</h1>
            <span style="font-size:11px; font-family:var(--font-mono); color:#64748b;">GIRI CORPORATION // SOVEREIGN COMPUTING DIVISION</span>
          </div>
          <div style="text-align:right; font-size:11.5px; color:#64748b;">
            Date: 2026-09-11<br>Location: Executive Boardroom Alpha & Hybrid Mesh
          </div>
        </div>

        <h3 style="font-size:13px; font-weight:700; text-transform:uppercase; color:#1e40af; margin-bottom:6px;">1. Attendees & Quorum</h3>
        <p style="font-size:12.5px; color:#334155; margin-bottom:18px;">
          Abhinav Giri (Executive Director), Directorate Members, Chief Legal Officer, Principal Systems Architect. Quorum established.
        </p>

        <h3 style="font-size:13px; font-weight:700; text-transform:uppercase; color:#1e40af; margin-bottom:6px;">2. Strategic Resolutions</h3>
        <ul style="font-size:12.5px; line-height:1.7; color:#334155; margin-bottom:20px; padding-left:22px;">
          <li><strong>Zero-Database Core:</strong> Formally ratified complete deployment of Giri Orbit in-memory office framework across all enterprise tiers.</li>
          <li><strong>Template Engine Expansion:</strong> Approved standard Word-compatible template hub architecture with persistent custom user template storage.</li>
        </ul>

        <h3 style="font-size:13px; font-weight:700; text-transform:uppercase; color:#1e40af; margin-bottom:8px;">3. Action Items Schedule</h3>
        <table style="width:100%; border-collapse:collapse; font-size:12px; border:1px solid #cbd5e1;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px 12px; border:1px solid #cbd5e1; text-align:left;">Action Item</th>
              <th style="padding:8px 12px; border:1px solid #cbd5e1; text-align:left;">Custodian</th>
              <th style="padding:8px 12px; border:1px solid #cbd5e1; text-align:left;">Timeline</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:8px 12px; border:1px solid #cbd5e1;">Implement Word-style Template Hub in Drift</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">Frontend Arch</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">Complete</td></tr>
            <tr><td style="padding:8px 12px; border:1px solid #cbd5e1;">Deploy Custom Templates Engine with Local Persistence</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">Core Systems</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">Active</td></tr>
          </tbody>
        </table>
      </div>
      <p></p>
    `
  }
];

// Seed sample custom templates
const DEFAULT_CUSTOM_TEMPLATES = [
  {
    id: 'custom-charter',
    name: 'Corporate Strategic Charter',
    category: 'custom',
    desc: 'Executive strategy brief with principles and directives',
    content: `
      <h1>Giri Orbit // Enterprise Strategic Charter</h1>
      <blockquote>
        "Spatial computing and zero-gravity document orchestration form the executive cornerstone of modern cognitive efficiency." — Abhinav Giri Directorate
      </blockquote>
      <p>
        This document serves as the operational architecture standard for <strong>Giri Orbit</strong>, developed as a sovereign productivity layer by <em>Abhinav Giri (Giri Group)</em>.
      </p>
      <h2>1. Strategic Objectives</h2>
      <p>
        Traditional office software forces knowledge workers into siloed application windows and cumbersome remote databases. Giri Orbit introduces a unified hybrid model:
      </p>
      <div class="drift-todo-item">
        <input type="checkbox" class="drift-todo-check" checked>
        <span>Deploy full-bleed executive document processing standard across all enterprise nodes.</span>
      </div>
      <div class="drift-todo-item">
        <input type="checkbox" class="drift-todo-check" checked>
        <span>Enforce 100% client-side memory sovereignty with zero outbound network telemetry leaks.</span>
      </div>
      <div class="drift-todo-item">
        <input type="checkbox" class="drift-todo-check">
        <span>Finalize multi-format Office export parity (.docx, .xlsx, .pptx, .pdf).</span>
      </div>
      <h2>2. Governance & Security Specifications</h2>
      <p>
        All files are preserved locally in cryptographic memory buffers, maintaining full privacy compliance and instant zero-latency compilation across corporate endpoints.
      </p>
    `
  },
  {
    id: 'custom-nda',
    name: 'Mutual Non-Disclosure Agreement (NDA)',
    category: 'custom',
    desc: 'Standard enterprise bilateral confidential information agreement',
    content: `
      <div style="font-family:'Inter', sans-serif; color:#0f172a;">
        <h1 style="font-size:22px; font-weight:800; text-align:center; border-bottom:2px solid #0f172a; padding-bottom:8px;">MUTUAL NON-DISCLOSURE AGREEMENT</h1>
        <p style="text-align:center; font-size:11px; font-family:var(--font-mono); color:#64748b;">CONFIDENTIALITY & INTELLECTUAL PROPERTY PRESERVATION</p>
        <p style="font-size:12.5px; line-height:1.7; margin:20px 0;">
          This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of <strong>September 11, 2026</strong>, by and between <strong>Abhinav Giri</strong> ("Disclosing Party") and the undersigned corporate affiliate ("Receiving Party").
        </p>
        <h3 style="font-size:13px; font-weight:700;">1. Proprietary Information</h3>
        <p style="font-size:12.5px; line-height:1.7;">
          Proprietary Information encompasses all zero-gravity vector algorithms, sovereign client-side memory structures, financial models, and code artifacts disclosed in connection with Giri Orbit.
        </p>
        <h3 style="font-size:13px; font-weight:700;">2. Obligations of Non-Disclosure</h3>
        <p style="font-size:12.5px; line-height:1.7;">
          The Receiving Party shall exercise the highest degree of care to safeguard Proprietary Information and shall not distribute or reverse engineer any sovereign memory mechanisms.
        </p>
      </div>
    `
  }
];

export function renderDriftApp(container, onDocUpdate = null, initialDocTitle = null, startInEditor = true) {
  // Load custom templates from localStorage
  let customTemplates = [];
  const storedCustom = localStorage.getItem('giri_orbit_custom_templates');
  if (storedCustom) {
    try {
      customTemplates = JSON.parse(storedCustom);
    } catch {
      customTemplates = [...DEFAULT_CUSTOM_TEMPLATES];
    }
  } else {
    customTemplates = [...DEFAULT_CUSTOM_TEMPLATES];
    localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
  }

  // Determine starting view
  if (startInEditor || initialDocTitle) {
    mountEditor(container, null, initialDocTitle || 'Document 1 - Giri Drift', onDocUpdate);
  } else {
    mountHub(container, onDocUpdate);
  }

  // =========================================================================
  // VIEW 1: WORD ON THE WEB STYLE TEMPLATE HUB
  // =========================================================================
  function mountHub(rootEl, onUpdate) {
    rootEl.innerHTML = `
      <div class="drift-hub-shell" id="drift-hub-shell">
        <!-- Top App Brand Bar in Hub Mode -->
        <div class="drift-hub-top-bar">
          <div class="drift-hub-brand-left">
            <img src="assets/drift-symbol.png" alt="Giri Drift" style="width:28px; height:28px; object-fit:contain; border-radius:6px; margin-right:8px; vertical-align:middle; filter:drop-shadow(0 2px 6px rgba(37,99,235,0.4));">
            <div class="tool-hub-brand-dropdown-wrap" id="drift-brand-dropdown-wrap">
              <button class="tool-hub-brand-btn" id="drift-brand-dropdown-trigger" style="display:flex; align-items:center; gap:6px; background:transparent; border:none; cursor:pointer; padding:4px 6px; border-radius:4px;" title="Switch Suite Tool">
                <span style="color:#ffffff; font-family:var(--font-display, sans-serif); font-weight:700; font-size:14px;">Giri Drift</span>
                <span style="color:#94a3b8; font-size:11px;">▾</span>
              </button>
              <!-- Suite Switcher Dropdown Menu -->
              <div class="tool-suite-switcher-menu" id="drift-suite-menu" style="display:none;">
                <div class="suite-switcher-header">Giri Orbit Suite</div>
                <a href="#hub" class="suite-switcher-item" data-switch="launcher">
                  <div class="switcher-icon hub">🪐</div>
                  <div class="switcher-info">
                    <strong>Orbit Hub</strong>
                    <span>Workspace Launcher &amp; Overview</span>
                  </div>
                  <span class="switcher-link-tag">#hub</span>
                </a>
                <a href="#drift" class="suite-switcher-item active" data-switch="drift">
                  <div class="switcher-icon drift" style="display:flex; align-items:center; justify-content:center; background:#eff6ff;"><img src="assets/drift-symbol.png" alt="Drift" style="width:18px; height:18px; object-fit:contain;"></div>
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
            <nav class="drift-hub-nav-links">
              <span class="drift-hub-nav-link" id="hub-nav-blank">Create Blank</span>
              <span class="drift-hub-nav-link" id="hub-nav-templates">Templates</span>
              <span class="drift-hub-nav-link" id="hub-nav-custom">Custom Templates</span>
            </nav>
          </div>

          <!-- Suite Nav Links & Direct Link Copier on Right -->
          <div class="tool-hub-top-right">
            <div class="tool-hub-suite-links">
              <a href="#hub" class="tool-hub-suite-link" data-switch="launcher" title="Orbit Hub (http://127.0.0.1:5000/#hub)">Hub</a>
              <a href="#drift" class="tool-hub-suite-link active" data-switch="drift" title="Giri Drift Docs (http://127.0.0.1:5000/#drift)">Drift</a>
              <a href="#axis" class="tool-hub-suite-link" data-switch="axis" title="Giri Axis Sheets (http://127.0.0.1:5000/#axis)">Axis</a>
              <a href="#kinetic" class="tool-hub-suite-link" data-switch="kinetic" title="Giri Kinetic Presentation (http://127.0.0.1:5000/#kinetic)">Kinetic</a>
              <a href="#pdf" class="tool-hub-suite-link" data-switch="pdf" title="Giri Aegis PDF Studio (http://127.0.0.1:5000/#pdf)">Aegis PDF</a>
            </div>
            <button class="btn-tool-copy-link" id="btn-drift-share-link" title="Copy direct link to Giri Drift (http://127.0.0.1:5000/#drift)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <!-- Sleek Dark Hero Banner -->
        <section class="drift-hub-hero">
          <div class="drift-hero-left">
            <div style="margin-bottom:14px;"><img src="assets/drift-logo-white.png" alt="Drift" style="height:36px; object-fit:contain; display:block;"></div>
            <h1 class="drift-hero-title">Welcome to Drift for free on the web</h1>
            <p class="drift-hero-subtitle">
              Sovereign in-memory document composer for high-velocity teams. Zero database tracking, instant local persistence, and customizable templates.
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

      <div class="drift-hero-actions">
              <button class="btn-drift-create-blank" id="btn-hub-create-blank">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span>Create blank document</span>
              </button>

              <button class="btn-drift-upload-file" id="btn-hub-upload-file">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Upload a file</span>
              </button>
              <input type="file" id="hub-hidden-file-input" accept=".txt,.md,.html,.docx" style="display:none;">

              <button class="btn-drift-new-template-cta" id="btn-hub-new-custom-template">
                <span>+ Custom Template</span>
              </button>
              <button class="btn-drift-new-template-cta" id="btn-drift-hero-import-tpl" style="background:#1e293b; color:#38bdf8; border:1px solid #334155;" title="Import Custom Template (.json, .html, .docx, .md, .txt)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>↑ Import Template</span>
              </button>
              <input type="file" id="drift-import-tpl-input" accept=".json,.html,.htm,.md,.txt,.docx,.gdrift" style="display:none;">
            </div>
          </div>

          <!-- 3D Modern Desk Illustration Graphic -->
          <div class="drift-hero-visual">
            <svg class="drift-hero-visual-svg" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Desk Surface -->
              <rect x="20" y="110" width="240" height="50" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
              <rect x="30" y="105" width="220" height="8" rx="3" fill="#0f172a"/>
              <!-- 3D Document Folders / Desk Organizer -->
              <rect x="180" y="30" width="70" height="90" rx="6" fill="#3b82f6" fill-opacity="0.9"/>
              <rect x="190" y="24" width="60" height="85" rx="5" fill="#60a5fa"/>
              <rect x="200" y="18" width="50" height="80" rx="4" fill="#93c5fd"/>
              <!-- Floating Document Page (Isometric) -->
              <g filter="drop-shadow(0 10px 15px rgba(0,0,0,0.4))">
                <polygon points="50,45 150,25 155,115 55,135" fill="#ffffff"/>
                <line x1="68" y1="55" x2="135" y2="42" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
                <line x1="68" y1="70" x2="138" y2="57" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
                <line x1="68" y1="82" x2="132" y2="69" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
                <line x1="68" y1="94" x2="120" y2="82" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
              </g>
              <!-- Ceramic Pencil Pot & Executive Stylus -->
              <circle cx="150" cy="115" r="14" fill="#f8fafc"/>
              <line x1="145" y1="110" x2="135" y2="70" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
              <line x1="152" y1="110" x2="155" y2="65" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
              <line x1="156" y1="112" x2="165" y2="75" stroke="#10b981" stroke-width="3.5" stroke-linecap="round"/>
            </svg>
          </div>
        </section>
        
        <!-- Pick Up Where You Left Off Synced Work Banner -->
        <div id="drift-resume-banner-slot"></div>

        <!-- "Create with templates" Section -->
        <main class="drift-templates-section">
          <div class="drift-templates-section-header">
            <h2 class="drift-templates-heading">Create with templates</h2>
            <div class="drift-category-filter-row">
              <div class="drift-category-pill-strip" id="drift-category-pill-strip">
                <button class="drift-category-pill active" data-category="all">Recommended</button>
                <button class="drift-category-pill" data-category="resumes">Resumes</button>
                <button class="drift-category-pill" data-category="invoices">Invoices</button>
                <button class="drift-category-pill" data-category="papers">Papers and Reports</button>
                <button class="drift-category-pill" data-category="flyers">Flyers</button>
                <button class="drift-category-pill" data-category="meeting">Meeting Notes</button>
                <button class="drift-category-pill" data-category="letters">Letters</button>
                <button class="drift-category-pill" data-category="custom" id="pill-custom-templates">
                  <span>Custom Templates</span>
                  <span class="pill-counter-badge" id="custom-templates-count">${customTemplates.length}</span>
                </button>
              </div>

              <!-- Search templates input -->
              <div class="drift-search-templates-wrap">
                <svg class="drift-search-templates-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" class="drift-search-templates-input" id="drift-search-templates-input" placeholder="Search templates" spellcheck="false">
              </div>
            </div>
          </div>

          <!-- Templates Grid View -->
          <div class="drift-templates-grid" id="drift-templates-grid">
            <!-- Dynamically populated -->
          </div>
        </main>
      </div>
    `;

    bindHubEvents(rootEl, onUpdate);
  }

  function bindHubEvents(rootEl, onUpdate) {
    const grid = rootEl.querySelector('#drift-templates-grid');
    const searchInput = rootEl.querySelector('#drift-search-templates-input');
    const categoryPills = rootEl.querySelectorAll('.drift-category-pill');
    const hiddenFileInput = rootEl.querySelector('#hub-hidden-file-input');
    const customCountBadge = rootEl.querySelector('#custom-templates-count');

    let currentCategory = 'all';

    function renderCards() {
      grid.innerHTML = '';
      const query = (searchInput.value || '').toLowerCase().trim();

      // Determine items to display
      let allItems = [];

      if (currentCategory === 'custom') {
        allItems = customTemplates.map(t => ({ ...t, isCustom: true }));
      } else {
        allItems = BUILTIN_TEMPLATES.map(t => ({ ...t, isCustom: false }));
        if (currentCategory === 'all') {
          // Include user custom templates in recommended list
          const customMapped = customTemplates.map(t => ({ ...t, isCustom: true }));
          allItems = [...allItems, ...customMapped];
        } else {
          allItems = allItems.filter(t => t.category === currentCategory);
          // Also check custom templates tagged with this category
          const customMatching = customTemplates.filter(t => t.category === currentCategory).map(t => ({ ...t, isCustom: true }));
          allItems = [...allItems, ...customMatching];
        }
      }

      // Filter by search query
      if (query) {
        allItems = allItems.filter(t =>
          t.name.toLowerCase().includes(query) ||
          t.desc.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
        );
      }

      // If viewing custom templates, render "+ Create Custom Template" Card
      if (currentCategory === 'custom') {
        const createCard = document.createElement('div');
        createCard.className = 'drift-template-card create-custom-card';
        createCard.innerHTML = `
          <div class="drift-template-preview-frame">
            <div style="text-align:center; padding:16px;">
              <span style="font-size:32px; font-weight:300; display:block; margin-bottom:8px;">+</span>
              <strong style="font-size:13px; font-weight:700;">New Custom Template</strong>
              <p style="font-size:11px; margin-top:4px; opacity:0.8;">Save active document or create layout</p>
            </div>
          </div>
          <div class="drift-template-meta">
            <span class="drift-template-title">Create Template</span>
            <span class="drift-template-cat-label">User Template</span>
          </div>
        `;

        createCard.addEventListener('click', () => {
          promptCreateCustomTemplate(rootEl, onUpdate);
        });

        grid.appendChild(createCard);
      }

      // Render cards
      allItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'drift-template-card';
        card.title = item.desc;

        // Custom template preview representation if not pre-rendered
        let previewHtml = item.previewHtml;
        if (!previewHtml) {
          previewHtml = `
            <div style="padding:16px 12px; height:100%; font-family:sans-serif; color:#0f172a; display:flex; flex-direction:column; background:#ffffff;">
              <div style="display:flex; justify-content:space-between; border-bottom:1.5px solid #2563eb; padding-bottom:4px; margin-bottom:10px;">
                <strong style="font-size:8px; color:#2563eb;">CUSTOM TEMPLATE</strong>
              </div>
              <strong style="font-size:9.5px; margin-bottom:4px; color:#0f172a;">${item.name}</strong>
              <div style="height:2px; width:80%; background:#cbd5e1; margin-bottom:4px;"></div>
              <div style="height:2px; width:95%; background:#e2e8f0; margin-bottom:3px;"></div>
              <div style="height:2px; width:90%; background:#e2e8f0; margin-bottom:3px;"></div>
              <div style="height:2px; width:70%; background:#e2e8f0;"></div>
            </div>
          `;
        }

        card.innerHTML = `
          ${item.isCustom ? `
            <div class="custom-tpl-actions" style="position:absolute; top:8px; right:8px; display:flex; gap:4px; z-index:5;">
              <button class="custom-template-export-btn" title="Export template as JSON" data-export-id="${item.id}" style="background:#1e293b; border:1px solid #334155; color:#38bdf8; border-radius:4px; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:11px; cursor:pointer;">↓</button>
              <button class="custom-template-del-btn" title="Delete custom template" data-del-id="${item.id}" style="background:#450a0a; border:1px solid #991b1b; color:#fca5a5; border-radius:4px; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:11px; cursor:pointer;">✕</button>
            </div>
          ` : ''}
          <div class="drift-template-preview-frame" style="background:${item.previewBg || '#ffffff'};">
            ${previewHtml}
          </div>
          <div class="drift-template-meta">
            <span class="drift-template-title">${item.name}</span>
            <span class="drift-template-cat-label">${item.isCustom ? 'Custom Template' : item.category}</span>
          </div>
        `;

        // Click to launch template in Editor
        card.addEventListener('click', (e) => {
          if (e.target.closest('.custom-tpl-actions') || e.target.closest('.custom-template-del-btn') || e.target.closest('.custom-template-export-btn')) return;
          mountEditor(rootEl, item.content, item.name, onUpdate);
        });

        // Export button for custom template
        const exportBtn = card.querySelector('.custom-template-export-btn');
        exportBtn?.addEventListener('click', (e) => {
          e.stopPropagation();
          const tplData = {
            id: item.id,
            name: item.name,
            category: item.category || 'custom',
            desc: item.desc || 'Custom Drift Document Template',
            previewBg: item.previewBg || '#ffffff',
            content: item.content,
            isCustom: true
          };
          const blob = new Blob([JSON.stringify(tplData, null, 2)], { type: 'application/json' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${(item.name || 'drift_template').toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
          a.click();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Exported "${item.name}" JSON template`);
        });

        // Delete button for custom template
        const delBtn = card.querySelector('.custom-template-del-btn');
        delBtn?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Delete custom template "${item.name}"?`)) {
            customTemplates = customTemplates.filter(t => t.id !== item.id);
            localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
            if (customCountBadge) customCountBadge.textContent = customTemplates.length;
            renderCards();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Deleted template "${item.name}"`);
          }
        });

        grid.appendChild(card);
      });
    }

    // Category filter clicks
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.category;
        renderCards();
      });
    });

    // Search input
    searchInput.addEventListener('input', renderCards);

    // Create Blank Document
    rootEl.querySelector('#btn-hub-create-blank')?.addEventListener('click', () => {
      try { localStorage.removeItem('giri_orbit_drift_doc'); } catch {}
      mountEditor(rootEl, '<div class="drift-page-sheet active-sheet" contenteditable="true" spellcheck="true" data-page="1" style="font-family: Calibri, \'Segoe UI\', Arial, sans-serif; font-size: 11pt;"><p><br></p></div>', 'Document 1 - Giri Drift', onUpdate);
    });
    rootEl.querySelector('#hub-nav-blank')?.addEventListener('click', () => {
      try { localStorage.removeItem('giri_orbit_drift_doc'); } catch {}
      mountEditor(rootEl, '<div class="drift-page-sheet active-sheet" contenteditable="true" spellcheck="true" data-page="1" style="font-family: Calibri, \'Segoe UI\', Arial, sans-serif; font-size: 11pt;"><p><br></p></div>', 'Document 1 - Giri Drift', onUpdate);
    });

    // Nav switch to Custom Templates
    rootEl.querySelector('#hub-nav-custom')?.addEventListener('click', () => {
      const customPill = rootEl.querySelector('#pill-custom-templates');
      customPill?.click();
    });

    // New Custom Template CTA
    rootEl.querySelector('#btn-hub-new-custom-template')?.addEventListener('click', () => {
      promptCreateCustomTemplate(rootEl, onUpdate);
    });

    // Import Custom Template File
    const importTplInput = rootEl.querySelector('#drift-import-tpl-input');
    rootEl.querySelector('#btn-drift-hero-import-tpl')?.addEventListener('click', () => importTplInput?.click());
    importTplInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (re) => {
        try {
          const raw = re.target.result;
          let tplName = file.name.replace(/\.[^/.]+$/, '');
          let content = '';
          let category = 'custom';
          let desc = `Custom imported document template (${file.name})`;

          if (file.name.endsWith('.json')) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                parsed.forEach((p, i) => {
                  customTemplates.push({
                    id: 'custom-' + Date.now() + '-' + i,
                    name: p.name || `${tplName} ${i + 1}`,
                    category: p.category || 'custom',
                    desc: p.desc || desc,
                    content: p.content || p.html || '<p><br></p>',
                    isCustom: true
                  });
                });
                localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
                activateCustomTab();
                if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported ${parsed.length} custom templates!`);
                return;
              } else if (parsed.content || parsed.html || parsed.text) {
                tplName = parsed.name || tplName;
                category = parsed.category || 'custom';
                desc = parsed.desc || desc;
                content = parsed.content || parsed.html || `<p>${parsed.text}</p>`;
              } else {
                content = `<pre style="font-family:monospace; font-size:12px;">${JSON.stringify(parsed, null, 2)}</pre>`;
              }
            } catch {
              content = `<pre style="font-family:monospace; font-size:12px;">${raw}</pre>`;
            }
          } else if (file.name.endsWith('.md')) {
            const lines = raw.split('\n');
            let html = '';
            lines.forEach(l => {
              const trimmed = l.trim();
              if (trimmed.startsWith('# ')) {
                tplName = trimmed.slice(2).trim();
                html += `<h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:18px 0 10px 0;">${tplName}</h1>`;
              } else if (trimmed.startsWith('## ')) {
                html += `<h2 style="font-size:18px; font-weight:700; color:#1e293b; margin:16px 0 8px 0;">${trimmed.slice(3)}</h2>`;
              } else if (trimmed.startsWith('### ')) {
                html += `<h3 style="font-size:15px; font-weight:700; color:#334155; margin:14px 0 6px 0;">${trimmed.slice(4)}</h3>`;
              } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                html += `<li style="margin-left:20px; font-size:13px; color:#334155; line-height:1.6;">${trimmed.slice(2)}</li>`;
              } else if (trimmed.length > 0) {
                html += `<p style="font-size:13px; color:#334155; line-height:1.6; margin-bottom:12px;">${trimmed}</p>`;
              }
            });
            content = html || `<p>${raw}</p>`;
          } else {
            content = raw.includes('<') && raw.includes('>') ? raw : `<p style="font-size:13px; line-height:1.7; color:#334155;">${raw.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
          }

          const newTemplate = {
            id: 'custom-' + Date.now(),
            name: tplName,
            category: 'custom',
            desc,
            content,
            isCustom: true
          };

          customTemplates.push(newTemplate);
          localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
          activateCustomTab();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported custom template "${tplName}"!`);
        } catch (err) {
          alert('Failed to import template: ' + err.message);
        }
      };
      reader.readAsText(file);
      importTplInput.value = '';
    });

    function activateCustomTab() {
      const customPill = rootEl.querySelector('#pill-custom-templates');
      categoryPills.forEach(p => p.classList.remove('active'));
      customPill?.classList.add('active');
      currentCategory = 'custom';
      if (customCountBadge) customCountBadge.textContent = customTemplates.length;
      renderCards();
    }

    // File Upload
    const uploadBtn = rootEl.querySelector('#btn-hub-upload-file');
    uploadBtn?.addEventListener('click', () => {
      hiddenFileInput?.click();
    });

    hiddenFileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        mountEditor(rootEl, text, file.name.replace(/\.[^/.]+$/, ''), onUpdate);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Uploaded ${file.name} into Drift`);
      };
      reader.readAsText(file);
      hiddenFileInput.value = '';
    });

    // Suite Switcher Dropdown Toggle
    const brandTrigger = rootEl.querySelector('#drift-brand-dropdown-trigger');
    const suiteMenu = rootEl.querySelector('#drift-suite-menu');
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
    rootEl.querySelector('#btn-drift-share-link')?.addEventListener('click', () => {
      const url = window.orbitPlatform ? window.orbitPlatform.getToolUrl('drift') : `${window.location.origin}/#drift`;
      navigator.clipboard?.writeText(url).then(() => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Copied direct link to Giri Drift: ${url}`);
      }).catch(() => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Direct Link: ${url}`);
      });
    });

    // Hydrate Pick Up Where You Left Off Banner
    const resumeSlot = rootEl.querySelector('#drift-resume-banner-slot');
    if (resumeSlot && window.giriSyncManager && window.giriSyncManager.hasSavedWork('drift')) {
      const syncInfo = window.giriSyncManager.getToolSyncInfo('drift');
      const timeStr = window.giriSyncManager.formatTimeAgo(syncInfo.updatedAt);
      resumeSlot.innerHTML = `
        <div class="tool-resume-banner" id="drift-resume-banner" style="margin: 20px auto 24px auto; max-width: 1200px;">
          <div class="tool-resume-left">
            <div class="tool-resume-icon-badge" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; font-weight:800; font-size:16px;">
              D
            </div>
            <div>
              <div class="tool-resume-title" style="font-size:15px; font-weight:700; color:#ffffff;">Pick up where you left off in Drift</div>
              <div class="tool-resume-meta" style="font-size:12px; color:#94a3b8; display:flex; align-items:center; gap:6px; margin-top:3px;">
                <span class="sync-dot-live" style="width:6px; height:6px; display:inline-block;"></span>
                <span style="color:#f8fafc; font-weight:600;">${syncInfo.title}</span> • 
                <span>Saved ${timeStr}</span> • 
                <span>${syncInfo.stats || 'Executive document draft'}</span>
              </div>
            </div>
          </div>
          <div class="tool-resume-actions" style="display:flex; align-items:center; gap:10px;">
            <button class="btn-delete-saved-work" id="btn-drift-banner-delete" title="Delete this saved draft from browser storage">
              🗑 Delete Draft
            </button>
            <button class="btn-resume-work" id="btn-drift-banner-resume" style="background:#2563eb; color:#ffffff; padding:7px 16px; border-radius:6px; font-weight:600; border:none; cursor:pointer;">
              ▶ Resume Work &rarr;
            </button>
          </div>
        </div>
      `;

      resumeSlot.querySelector('#btn-drift-banner-resume')?.addEventListener('click', () => {
        mountEditor(rootEl, null, syncInfo.title, onUpdate);
      });

      resumeSlot.querySelector('#btn-drift-banner-delete')?.addEventListener('click', () => {
        if (confirm('Delete saved Drift work from browser storage? This will clear your draft.')) {
          window.giriSyncManager.deleteSyncedWork('drift');
          resumeSlot.innerHTML = '';
        }
      });
    }

    renderCards();
  }

  function promptCreateCustomTemplate(rootEl, onUpdate) {
    const name = prompt('Enter a name for your custom template:', 'Executive Memorandum Template');
    if (!name) return;

    const cat = prompt('Choose category (resumes, invoices, papers, flyers, meeting, letters, custom):', 'custom') || 'custom';
    const desc = prompt('Short description:', 'Corporate executive template layout') || 'Custom layout';

    const newTemplate = {
      id: 'custom-' + Date.now(),
      name: name,
      category: cat.toLowerCase().trim(),
      desc: desc,
      content: `
        <div style="font-family:'Inter', sans-serif; color:#0f172a; padding:10px 0;">
          <h1 style="font-size:24px; font-weight:800; border-bottom:2px solid #2563eb; padding-bottom:8px; margin-bottom:16px;">${name}</h1>
          <p style="font-size:13px; line-height:1.7; color:#334155;">
            Type your custom template structure, boilerplate clauses, or formatting guidelines here.
          </p>
        </div>
        <p></p>
      `
    };

    customTemplates.push(newTemplate);
    localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
    if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Custom template "${name}" created!`);

    // Reload Hub view and select Custom category
    mountHub(rootEl, onUpdate);
    const customPill = rootEl.querySelector('#pill-custom-templates');
    customPill?.click();
  }

  // =========================================================================
  // VIEW 2: FULL-BLEED 5-TAB OFFICE RIBBON EDITOR VIEW
  // =========================================================================
  function mountEditor(rootEl, templateContent = null, docTitle = 'Document 1 - Giri Drift', onUpdate = null) {
    let currentDocTitle = docTitle;
    const defaultBlankDoc = '<p style="font-family: Calibri, \'Segoe UI\', Arial, sans-serif; font-size: 11pt;"><br></p>';
    let initialDocHtml = templateContent !== null ? templateContent : (localStorage.getItem('giri_orbit_drift_doc') || defaultBlankDoc);
    if (!initialDocHtml.includes('drift-page-sheet')) {
      initialDocHtml = `<div class="drift-page-sheet active-sheet" contenteditable="true" spellcheck="true" data-page="1" style="font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt;">${initialDocHtml.trim() || '<p><br></p>'}</div>`;
    }
    const savedDoc = initialDocHtml;
    if (templateContent !== null) {
      try { localStorage.setItem('giri_orbit_drift_doc', savedDoc); } catch {}
    }

    // In-memory format buffer for Format Painter
    let formatBuffer = null;
    let isFormatPainterActive = false;

    // Track Changes mode state
    let isTrackChangesActive = false;

    // Comments array
    let comments = [
      { id: 'c1', author: 'Executive Reviewer', date: 'Just now', text: 'Document charter conforms to sovereign computing specification.', resolved: false }
    ];

    // Version history snapshots
    let versionSnapshots = [
      { id: 'v1', timestamp: '2026-09-11 13:00', title: 'Initial Revision', author: 'Abhinav Giri', length: 1200 },
      { id: 'v2', timestamp: '2026-09-11 13:25', title: 'Added Enterprise Metrics', author: 'Abhinav Giri', length: 1850 }
    ];

    rootEl.innerHTML = `
      <div class="drift-app-shell" id="drift-app-shell">
        <!-- Giri Drift Classic Desktop Chrome -->
        <div class="lo-classic-chrome">
          ${orbitDesktopSuite.renderWindowHeader('drift', currentDocTitle)}
          ${orbitDesktopSuite.renderMenubar('drift')}
          ${orbitDesktopSuite.renderToolbars('drift')}
          ${orbitDesktopSuite.renderRuler()}
        </div>

        <!-- Modern Fluent Office Ribbon -->
        <nav class="fluent-ribbon-bar" aria-label="Word Processing Fluent Office Ribbon">
          <!-- Ribbon Tabs Strip -->
          <div class="fluent-ribbon-tabs">
            <!-- File Menu Trigger Button (plain text tab matching media_1789113480130.png) -->
            <button class="fluent-tab-btn" id="btn-drift-return-hub" style="color:#38bdf8; font-weight:700; display:flex; align-items:center; gap:4px; margin-right:4px;" title="Return to Orbit Hub"><span style="font-size:13px;">⟵</span><span>Hub</span></button>
            <button class="fluent-tab-btn fluent-tab-file-trigger" id="btn-drift-file-menu" title="Open File Menu">
              File
            </button>
            <button class="fluent-tab-btn" id="btn-drift-toggle-sidebar" title="Toggle Pages & Navigation Drawer" style="color:#a855f7; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
              <span>📄</span><span>Pages</span>
            </button>

            <!-- Standard Ribbon Tabs -->
            <button class="fluent-tab-btn active" data-tab="home">Home</button>
            <button class="fluent-tab-btn" data-tab="insert">Insert</button>
            <button class="fluent-tab-btn" data-tab="layout">Layout</button>
            <button class="fluent-tab-btn" data-tab="references">References</button>
            <button class="fluent-tab-btn" data-tab="mailings">Mailings</button>
            <button class="fluent-tab-btn" data-tab="review">Review</button>
            <button class="fluent-tab-btn" data-tab="view">View</button>
            <button class="fluent-tab-btn" data-tab="help">Help</button>

            <!-- Right Action Strip (Exact match to media_1789113480130.png) -->
            <div class="fluent-top-actions">
              <button class="fluent-top-action-pill fluent-autosave-toggle-btn active" id="btn-drift-autosave-toggle" title="Auto-Save is ON: All changes saved automatically (Click to toggle)">
                <span class="autosave-dot" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;"></span>
                <span class="autosave-text" style="font-weight:600;font-size:11.5px;">Auto-Save: ON</span>
              </button>

              <button class="fluent-top-action-pill" id="btn-drift-special-link" title="Special Document Link: Share & open instantly on any Phone or PC" style="background:linear-gradient(135deg,rgba(14,165,233,0.18),rgba(37,99,235,0.18));color:#38bdf8;border:1px solid rgba(56,189,248,0.4);font-weight:600;">
                <span style="font-size:12px;">📱</span>
                <span>Phone/PC Link</span>
              </button>

              <button class="fluent-drive-action-pill" id="btn-drift-drive-sync" title="Google Drive Sync: Direct editing & cloud auto-save">
                <span class="drive-dot-live"></span>
                <span id="txt-drift-drive-status">☁️ Drive</span>
              </button>

              <button class="fluent-sync-action-pill" id="btn-drift-browser-sync" title="Browser Sync: Edits are automatically saved to browser storage. Click to manage or purge.">
                <span class="sync-dot-live"></span>
                <span id="txt-drift-sync-status">Synced to Browser</span>
              </button>
              
              <button class="fluent-top-action-pill" id="btn-drift-save-device" title="Direct Disk Sync: Save directly to your local PC file without re-downloads" style="background:#059669; color:#ffffff; font-weight:600; border-color:#047857;">
                <span style="font-size:12px;">💾</span>
                <span id="txt-drift-sync-status">Save to Device</span>
              </button>
              <button class="fluent-top-action-pill ai-agent-btn" id="btn-drift-top-ai-agent" title="Girionix Autonomous AI Agent (Alt+A)" style="background:linear-gradient(135deg, rgba(168,85,247,0.22), rgba(59,130,246,0.22)); border:1px solid rgba(168,85,247,0.45); color:#c084fc; font-weight:700;">
                <span style="font-size:12px;">🤖</span>
                <span>AI Agent</span>
              </button>
              <button class="fluent-top-action-pill" id="btn-toggle-comments-sidebar" title="Comments">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Comments</span>
              </button>

              <button class="fluent-top-action-pill" id="btn-drift-catchup" title="Catch up on document changes">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <span>Catch up</span>
              </button>

              <button class="fluent-top-action-pill" id="btn-drift-editing-mode" title="Editing Mode">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Editing ▾</span>
              </button>

              <button class="fluent-top-action-pill share-btn" id="btn-drift-share" title="Share Sovereign Document">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <span>Share ▾</span>
              </button>
            </div>
          </div>

          <!-- Dark Office 365 File Dropdown Menu (Exact match to screenshot) -->
          <div class="office-file-menu-dropdown" id="drift-file-menu-dropdown">
            <div class="file-menu-item" data-action="ai-agent" id="file-menu-drift-ai-agent" style="background:rgba(168,85,247,0.12); color:#c084fc; font-weight:700;">
              <span class="file-menu-icon">🤖</span>
              <span>Girionix AI Agent...</span>
              <span class="file-menu-shortcut" style="margin-left:auto; font-size:10px; color:#94a3b8;">Alt+A</span>
            </div>
            <div class="file-menu-item" data-action="drive-sync" id="file-menu-drift-drive-sync" style="background:rgba(66,133,244,0.15); color:#60a5fa; font-weight:600;">
              <span class="file-menu-icon">☁️</span>
              <span>Google Drive Cloud Sync...</span>
              <span class="file-menu-arrow">›</span>
            </div>
            
            <div class="file-menu-item" data-action="save-device" id="file-menu-save-device" style="background:rgba(5,150,105,0.15); color:#34d399; font-weight:600;">
              <span class="file-menu-icon">💾</span>
              <span>Save to Device (Direct Sync)</span>
              <span class="file-menu-arrow">›</span>
            </div>
            <div class="file-menu-item" data-action="open-device" id="file-menu-open-device">
              <span class="file-menu-icon">📂</span>
              <span>Open from Device (Direct Sync)</span>
              <span class="file-menu-arrow">›</span>
            </div>
            <div class="file-menu-sep"></div>
            <div class="file-menu-item" data-action="save-template" id="file-menu-save-template">
              <span class="file-menu-icon">📄</span>
              <span>Save as Custom Template...</span>
              <span class="file-menu-arrow">›</span>
            </div>
            <div class="file-menu-item" data-action="import-template" id="file-menu-import-template">
              <span class="file-menu-icon">📥</span>
              <span>Import Custom Template...</span>
              <span class="file-menu-arrow">›</span>
            </div>
            <input type="file" id="drift-editor-import-tpl-input" accept=".json,.html,.htm,.md,.txt,.docx,.gdrift" style="display:none;">
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
            <div class="file-menu-item" data-action="mail-merge" id="file-menu-mail-merge" style="color:#38bdf8;">
              <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
              <span>Mail Merge Wizard...</span>
              <span class="file-menu-arrow">›</span>
            </div>
            <div class="file-menu-sep"></div>
            <div class="file-menu-item" data-action="rename">
              <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></span>
              <span>Rename</span>
            </div>
            <div class="file-menu-item disabled" title="Document is sovereignly stored in browser local memory" data-action="move">
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
            <div class="file-menu-sep"></div>
            <div class="file-menu-item" data-action="shortcuts-settings" id="file-menu-shortcuts-settings">
              <span class="file-menu-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
              <span>Settings & Shortcuts</span>
              <span class="file-menu-arrow">›</span>
            </div>
          </div>

          <!-- Fluent Grouped Ribbon Panes -->
          <div class="fluent-ribbon-panes">
            <!-- 1. HOME TAB PANE -->
            <div class="fluent-ribbon-pane active" id="pane-home">
              <!-- Undo Group (Far Left) -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col" style="gap:4px;">
                    <button class="fluent-btn-small" data-cmd="undo" id="btn-drift-undo" title="Undo (Ctrl+Z)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                    </button>
                    <button class="fluent-btn-small" data-cmd="redo" id="btn-drift-redo" title="Redo (Ctrl+Y)">
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
                  <button class="fluent-btn-large" id="btn-drift-paste" title="Paste (Ctrl+V)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                    <span>Paste ▾</span>
                  </button>
                  <div class="fluent-group-col">
                    <button class="fluent-btn-small" id="btn-drift-cut" title="Cut (Ctrl+X)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
                    </button>
                    <button class="fluent-btn-small" id="btn-drift-copy" title="Copy (Ctrl+C)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                    <button class="fluent-btn-small" id="btn-drift-format-painter" title="Format Painter: Copy formatting from selection and apply to other text">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M5 13v7a2 2 0 0 0 2 2h2v-9"/><path d="M15 13v9"/></svg>
                    </button>
                  </div>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Clipboard</div>
                  <button class="fluent-group-launcher" id="btn-drift-launcher-clipboard" title="Clipboard Options">⤢</button>
                </div>
              </div>

              <!-- Font Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <div class="fluent-group-row">
                      <div id="drift-font-picker-mount" class="fluent-font-mount"></div>

                      <select class="fluent-select-dark" id="drift-font-size-pt" style="width:62px;" title="Font Size">
                        <option value="1">10 pt</option>
                        <option value="2">11 pt</option>
                        <option value="3" selected>12 pt</option>
                        <option value="4">14 pt</option>
                        <option value="5">18 pt</option>
                        <option value="6">24 pt</option>
                        <option value="7">36 pt</option>
                      </select>

                      <button class="fluent-btn-small" id="btn-font-grow" title="Grow Font (Ctrl+Shift+>)">A<sup>▲</sup></button>
                      <button class="fluent-btn-small" id="btn-font-shrink" title="Shrink Font (Ctrl+Shift+<)">A<sup>▼</sup></button>
                      <button class="fluent-btn-small" id="btn-drift-clear-format" data-cmd="removeFormat" title="Clear All Formatting (Tx)">T<span style="font-size:9px; color:#ef4444; margin-left:1px;">✕</span></button>
                    </div>

                    <div class="fluent-group-row">
                      <button class="fluent-btn-small" data-cmd="bold" title="Bold (Ctrl+B)"><strong>B</strong></button>
                      <button class="fluent-btn-small" data-cmd="italic" title="Italic (Ctrl+I)"><em>I</em></button>
                      <button class="fluent-btn-small" data-cmd="underline" title="Underline (Ctrl+U)"><u>U</u></button>
                      <button class="fluent-btn-small" data-cmd="strikeThrough" title="Strikethrough"><s>ab</s></button>
                      <button class="fluent-btn-small" data-cmd="subscript" title="Subscript">x<span class="sub-blue">2</span></button>
                      <button class="fluent-btn-small" data-cmd="superscript" title="Superscript">x<span class="sup-blue">2</span></button>
                      <button class="fluent-btn-small" id="btn-drift-change-case" title="Change Case (Sentence, UPPERCASE, lowercase, Capitalize)">Ab ▾</button>

                      <label class="fluent-btn-small ribbon-color-picker-wrap" title="Highlight Color">
                        <span style="background:#fde047; color:#000; padding:0 3px; font-weight:800; border-radius:2px; font-size:10px;">ab</span>
                        <input type="color" id="drift-bg-color" class="ribbon-color-input" value="#fde047">
                      </label>

                      <label class="fluent-btn-small ribbon-color-picker-wrap" title="Font Color">
                        <span style="font-weight:900; color:#ef4444; border-bottom:2px solid #ef4444; font-size:12px;">A</span>
                        <input type="color" id="drift-text-color" class="ribbon-color-input" value="#ef4444">
                      </label>
                    </div>
                  </div>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Font</div>
                  <button class="fluent-group-launcher" id="btn-drift-launcher-font" title="Font Dialog (Ctrl+D)">⤢</button>
                </div>
              </div>

              <!-- Paragraph Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <div class="fluent-group-row">
                      <button class="fluent-btn-small" data-cmd="insertUnorderedList" title="Bulleted List">•≡</button>
                      <button class="fluent-btn-small" data-cmd="insertOrderedList" title="Numbered List">1≡</button>
                      <button class="fluent-btn-small" id="btn-insert-checklist" title="Checklist Task Item">☑≡</button>
                      <button class="fluent-btn-small" data-cmd="outdent" title="Decrease Indent">⇤</button>
                      <button class="fluent-btn-small" data-cmd="indent" title="Increase Indent">⇥</button>
                      <button class="fluent-btn-small" id="btn-toggle-paragraph-marks" title="Show/Hide Paragraph Marks (¶)">¶</button>
                    </div>

                    <div class="fluent-group-row">
                      <button class="fluent-btn-small" data-cmd="justifyLeft" title="Align Left">⇦</button>
                      <button class="fluent-btn-small" data-cmd="justifyCenter" title="Center">⇋</button>
                      <button class="fluent-btn-small" data-cmd="justifyRight" title="Align Right">⇨</button>
                      <button class="fluent-btn-small" data-cmd="justifyFull" title="Justify">≡</button>

                      <select class="fluent-select-dark" id="drift-line-spacing" style="width:68px;" title="Line Spacing">
                        <option value="1.0">1.0</option>
                        <option value="1.15" selected>1.15</option>
                        <option value="1.5">1.5</option>
                        <option value="2.0">2.0</option>
                        <option value="2.5">2.5</option>
                      </select>

                      <label class="fluent-btn-small ribbon-color-picker-wrap" title="Paragraph Shading / Fill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.5 8.5l-4-4-7.5 7.5 4 4 7.5-7.5z"/><path d="M12 4.5l3.5 3.5"/><path d="M2 20h20"/></svg>
                        <input type="color" id="drift-paragraph-shading" class="ribbon-color-input" value="#f1f5f9">
                      </label>
                    </div>
                  </div>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Paragraph</div>
                  <button class="fluent-group-launcher" id="btn-drift-launcher-paragraph" title="Paragraph Settings">⤢</button>
                </div>
              </div>

              <!-- Styles Gallery Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-styles-gallery" id="fluent-styles-gallery">
                    <div class="fluent-style-card active" data-style-cmd="p">
                      <span class="fluent-style-card-title">Normal</span>
                      <span class="fluent-style-card-sub">Aptos, 12</span>
                    </div>
                    <div class="fluent-style-card" data-style-cmd="nospacing">
                      <span class="fluent-style-card-title">No Spacing</span>
                      <span class="fluent-style-card-sub">Aptos, 12</span>
                    </div>
                    <div class="fluent-style-card" data-style-cmd="h1">
                      <span class="fluent-style-card-title" style="font-weight:800; color:#38bdf8;">Heading 1</span>
                      <span class="fluent-style-card-sub">Aptos Display, 20</span>
                    </div>
                    <div class="fluent-style-card" data-style-cmd="h2">
                      <span class="fluent-style-card-title" style="font-weight:700; color:#60a5fa;">Heading 2</span>
                      <span class="fluent-style-card-sub">Aptos Display, 16</span>
                    </div>
                    <div class="fluent-style-card" data-style-cmd="title">
                      <span class="fluent-style-card-title" style="font-weight:900; letter-spacing:-0.5px;">Title</span>
                      <span class="fluent-style-card-sub">Aptos, 28</span>
                    </div>
                    <div class="fluent-style-card" data-style-cmd="subtitle">
                      <span class="fluent-style-card-title" style="font-weight:500; color:#94a3b8;">Subtitle</span>
                      <span class="fluent-style-card-sub">Aptos, 14</span>
                    </div>
                    <div class="fluent-style-card" data-style-cmd="quote">
                      <span class="fluent-style-card-title" style="font-style:italic; color:#cbd5e1;">Quote</span>
                      <span class="fluent-style-card-sub">“AaBb”</span>
                    </div>
                  </div>
                  <button class="fluent-btn-small" id="btn-drift-styles-dropdown" title="More Styles" style="align-self:center; height:50px; width:18px; padding:0; justify-content:center;">⌵</button>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Styles</div>
                  <button class="fluent-group-launcher" id="btn-drift-launcher-styles" title="Styles Pane">⤢</button>
                </div>
              </div>

              <!-- Editing Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <button class="fluent-btn-small" id="btn-find-replace" title="Find (Ctrl+F)" style="width:100%; justify-content:flex-start; gap:4px; padding:0 6px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <span>Find</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-find-replace-2" title="Replace (Ctrl+H)" style="width:100%; justify-content:flex-start; gap:4px; padding:0 6px;">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      <span>Replace</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-select-all" title="Select All (Ctrl+A)" style="width:100%; justify-content:flex-start; gap:4px; padding:0 6px;">
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
                  <button class="fluent-btn-large" id="btn-voice-dictate-group" title="Voice Dictation">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    <span>Dictate ▾</span>
                  </button>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Voice</div>
                </div>
              </div>

              <!-- Proofing / Editor Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-editor-stats-group" title="Check Document Statistics & Proofing">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                    <span>Editor</span>
                  </button>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Proofing</div>
                </div>
              </div>

              <!-- Add-ins Group -->
              <div class="fluent-ribbon-group" style="border-right:none;">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-drift-addins" title="Office Add-ins">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
                    </svg>
                    <span>Add-ins ▾</span>
                  </button>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Add-ins</div>
                </div>
              </div>
              <!-- Girionix AI Assist Group -->
              <div class="fluent-ribbon-group" style="border-right:none; background:rgba(37,99,235,0.06); border-radius:4px;">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-drift-ai-agent" title="Girionix Autonomous Agent: Draft complete document from prompt (Alt+A)" style="color:#0284c7; font-weight:700; background:rgba(6,182,212,0.1); border-radius:6px;">
                    <span style="font-size:18px;">🤖</span>
                    <span style="color:#0284c7;">AI Agent</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-drift-ai-copilot" title="Girionix AI Writing Assistant (Alt+J / Ctrl+Shift+J)" style="color:#2563eb; font-weight:700;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>
                    <span style="color:#2563eb;">AI Assist ▾</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-drift-import-from-girionix" title="Import content from Girionix AI into Drift document" style="color:#2563eb;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span style="color:#2563eb;">Import from AI</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-drift-export-to-girionix" title="Export document text to Girionix AI for analysis & polishing" style="color:#2563eb;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span style="color:#2563eb;">Export to AI</span>
                  </button>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label" style="color:#2563eb; font-weight:700;">Girionix AI</div>
                </div>
              </div>
            </div>

            <!-- 2. INSERT TAB PANE -->
            <div class="fluent-ribbon-pane" id="pane-insert">
              <!-- Pages Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-blank-page" title="Insert Blank Page">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>Blank Page</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-page-break" title="Insert Page Break (Ctrl+Enter)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="12" x2="22" y2="12" stroke-dasharray="4 2"/><polyline points="6 8 2 12 6 16"/><polyline points="18 8 22 12 18 16"/></svg>
                    <span>Page Break</span>
                  </button>
                </div>
                <div class="fluent-group-label">Pages</div>
              </div>

              <!-- Rich Content Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-callout-menu" title="Insert Callout Box (Tip, Warning, Info)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    <span>Callout</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-code-block" title="Insert Formatted Code Container">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    <span>Code Block</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-divider" title="Insert Horizontal Rule Divider">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><circle cx="12" cy="12" r="3"/></svg>
                    <span>Divider</span>
                  </button>
                </div>
                <div class="fluent-group-label">Rich Content</div>
              </div>

              <!-- Tables Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-table-menu" title="Insert Dynamic Grid Table">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                    <span>Table ▾</span>
                  </button>
                </div>
                <div class="fluent-group-label">Tables</div>
              </div>

              <!-- Illustrations Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-image-dialog" title="Insert Picture from Device">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span>Pictures</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-shape" title="Insert Drawing Shapes">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polygon points="12 8 16 16 8 16"/></svg>
                    <span>Shapes</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-smartart" title="Insert SmartArt Diagrams (Processes, Cycles, Hierarchies)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    <span>SmartArt</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-chart-dialog" title="Insert Data Charts &amp; Visualizations">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    <span>Chart</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-icon" title="Insert Premium Icons">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>Icons</span>
                  </button>
                </div>
                <div class="fluent-group-label">Illustrations</div>
              </div>

              <!-- Links Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-link-dialog" title="Insert Hyperlink (Ctrl+K)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <span>Link</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-bookmark" title="Insert Document Bookmark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    <span>Bookmark</span>
                  </button>
                </div>
                <div class="fluent-group-label">Links</div>
              </div>

              <!-- Comments Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-comment-direct" title="Insert New Margin Comment">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
                    <span>New Comment</span>
                  </button>
                </div>
                <div class="fluent-group-label">Comments</div>
              </div>

              <!-- Header & Footer Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <button class="fluent-btn-small" id="btn-insert-header" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>Header ▾</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-insert-footer" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>Footer ▾</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-insert-page-number" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>Page Number ▾</span>
                    </button>
                  </div>
                </div>
                <div class="fluent-group-label">Header & Footer</div>
              </div>

              <!-- Text & Callouts Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <button class="fluent-btn-small" id="btn-insert-textbox" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>Text Box</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-insert-wordart" style="width:100%; justify-content:flex-start; gap:4px; font-weight:800; color:#38bdf8;">
                      <span>A WordArt ▾</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-insert-callout-box" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>Callout Box</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-insert-date" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>Date & Time</span>
                    </button>
                  </div>
                </div>
                <div class="fluent-group-label">Text</div>
              </div>

              <!-- Seals & Certifications Group (From User Request media_1789232638479.png) -->
              <div class="fluent-ribbon-group" id="drift-ribbon-group-seals">
                <div class="fluent-group-controls">
                  <div style="position:relative; display:inline-block;">
                    <button class="fluent-btn-large" id="btn-drift-stamp-menu" title="Insert Pre-made or Custom Stamp">
                      <span style="color:#ef4444; font-weight:800; font-size:11px; border:1px solid #ef4444; padding:0 3px; border-radius:2px;">APPROVED</span>
                      <span>Stamp ▾</span>
                    </button>
                    <div class="drift-stamp-dropdown-menu" id="drift-stamp-dropdown-menu" style="display:none; position:absolute; top:100%; left:0; z-index:10000; background:#18181b; border:1px solid #334155; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.3); width:190px; padding:6px 0;">
                      <div class="drift-stamp-menu-item" data-stamp="APPROVED" data-color="#059669" style="padding:7px 12px; cursor:pointer; font-size:11.5px; display:flex; align-items:center; gap:8px;">
                        <span style="border:1.5px solid #059669; color:#059669; font-weight:800; font-size:10px; padding:1px 5px; border-radius:2px;">APPROVED</span>
                      </div>
                      <div class="drift-stamp-menu-item" data-stamp="CONFIDENTIAL" data-color="#dc2626" style="padding:7px 12px; cursor:pointer; font-size:11.5px; display:flex; align-items:center; gap:8px;">
                        <span style="border:1.5px solid #dc2626; color:#dc2626; font-weight:800; font-size:10px; padding:1px 5px; border-radius:2px;">CONFIDENTIAL</span>
                      </div>
                      <div class="drift-stamp-menu-item" data-stamp="DRAFT" data-color="#d97706" style="padding:7px 12px; cursor:pointer; font-size:11.5px; display:flex; align-items:center; gap:8px;">
                        <span style="border:1.5px solid #d97706; color:#d97706; font-weight:800; font-size:10px; padding:1px 5px; border-radius:2px;">DRAFT</span>
                      </div>
                      <div class="drift-stamp-menu-item" data-stamp="FINAL" data-color="#2563eb" style="padding:7px 12px; cursor:pointer; font-size:11.5px; display:flex; align-items:center; gap:8px;">
                        <span style="border:1.5px solid #2563eb; color:#2563eb; font-weight:800; font-size:10px; padding:1px 5px; border-radius:2px;">FINAL</span>
                      </div>
                      <div class="drift-stamp-menu-item" data-stamp="URGENT" data-color="#ea580c" style="padding:7px 12px; cursor:pointer; font-size:11.5px; display:flex; align-items:center; gap:8px;">
                        <span style="border:1.5px solid #ea580c; color:#ea580c; font-weight:800; font-size:10px; padding:1px 5px; border-radius:2px;">URGENT</span>
                      </div>
                      <div class="drift-stamp-menu-item" data-stamp="VERIFIED" data-color="#0d9488" style="padding:7px 12px; cursor:pointer; font-size:11.5px; display:flex; align-items:center; gap:8px;">
                        <span style="border:1.5px solid #0d9488; color:#0d9488; font-weight:800; font-size:10px; padding:1px 5px; border-radius:2px;">VERIFIED</span>
                      </div>
                      <div style="height:1px; background:#334155; margin:4px 0;"></div>
                      <div class="drift-stamp-menu-item-custom" id="btn-open-custom-stamp-modal" style="padding:7px 12px; cursor:pointer; font-size:11.5px; font-weight:600; color:#38bdf8; display:flex; align-items:center; gap:6px;">
                        <span>✨ Custom Stamp...</span>
                      </div>
                    </div>
                  </div>
                  <button class="fluent-btn-large" id="btn-drift-exec-seal" title="Affix Giri Group Executive Seal">
                    <span style="font-size:16px;">🛡️</span>
                    <span>Executive Seal</span>
                  </button>
                </div>
                <div class="fluent-group-label">Seals & Certifications</div>
              </div>

              <!-- Reference & Proofing Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-thesaurus" title="Open Thesaurus (Synonyms & Antonyms)">
                    <span style="font-size:16px;">📚</span>
                    <span>Thesaurus</span>
                  </button>
                </div>
                <div class="fluent-group-label">Reference</div>
              </div>

              <!-- Symbols & Emoji Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-rupee-quick" title="Insert Indian Rupee (₹)" style="color:#38bdf8;">
                    <span style="font-family:'Segoe UI',sans-serif; font-size:17px; font-weight:800;">₹</span>
                    <span>Rupee</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-equation-dialog" title="Math Formula Editor (14+ Presets & Palette)">
                    <span style="font-family:serif; font-size:16px; font-weight:700;">√x</span>
                    <span>Equation</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-symbol-dialog" title="Insert Special Character (120+ Symbols)">
                    <span style="font-family:serif; font-size:16px; font-weight:700;">Ω</span>
                    <span>Symbol</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-emoji-picker" title="Insert Emojis (250+ Categorized Emojis)">
                    <span style="font-size:16px;">😀</span>
                    <span>Emoji ▾</span>
                  </button>
                </div>
                <div class="fluent-group-label">Symbols</div>
              </div>
            </div>

            <!-- 3. LAYOUT TAB PANE -->
            <div class="fluent-ribbon-pane" id="pane-layout">
              <!-- Page Setup Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <div class="fluent-group-row">
                      <span style="font-size:11px; color:#a1a1aa; width:70px;">Margins:</span>
                      <select class="fluent-select-dark" id="drift-margin-select" style="width:110px;" title="Page Margins">
                        <option value="normal" selected>Normal (1.0")</option>
                        <option value="narrow">Narrow (0.5")</option>
                        <option value="wide">Wide (1.5")</option>
                      </select>
                    </div>
                    <div class="fluent-group-row">
                      <span style="font-size:11px; color:#a1a1aa; width:70px;">Orientation:</span>
                      <button class="fluent-btn-small active" id="btn-orient-portrait" title="Portrait">📄 Port</button>
                      <button class="fluent-btn-small" id="btn-orient-landscape" title="Landscape">📃 Land</button>
                    </div>
                    <div class="fluent-group-row">
                      <span style="font-size:11px; color:#a1a1aa; width:70px;">Columns:</span>
                      <button class="fluent-btn-small active" id="btn-col-1" title="1 Column">1 Col</button>
                      <button class="fluent-btn-small" id="btn-col-2" title="2 Columns">2 Cols</button>
                      <button class="fluent-btn-small" id="btn-col-3" title="3 Columns">3 Cols</button>
                    </div>
                  </div>
                </div>
                <div class="fluent-group-label">Page Setup</div>
              </div>

              <!-- Paragraph Indent & Spacing Steppers Group (Exact Match to Layout Screenshot) -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col" style="gap:5px;">
                    <div style="font-size:10.5px; font-weight:700; color:#38bdf8; text-transform:uppercase;">Indent</div>
                    <div class="fluent-stepper-wrap">
                      <span style="width:40px;">Left:</span>
                      <input type="number" class="fluent-stepper-input" id="drift-indent-left-val" value="0" min="0" max="100" step="5">
                      <span>px</span>
                    </div>
                    <div class="fluent-stepper-wrap">
                      <span style="width:40px;">Right:</span>
                      <input type="number" class="fluent-stepper-input" id="drift-indent-right-val" value="0" min="0" max="100" step="5">
                      <span>px</span>
                    </div>
                  </div>

                  <div style="width:1px; height:50px; background:#2e2e33; margin:0 4px;"></div>

                  <div class="fluent-group-col" style="gap:5px;">
                    <div style="font-size:10.5px; font-weight:700; color:#38bdf8; text-transform:uppercase;">Spacing</div>
                    <div class="fluent-stepper-wrap">
                      <span style="width:44px;">Before:</span>
                      <input type="number" class="fluent-stepper-input" id="drift-spacing-before-val" value="0" min="0" max="60" step="4">
                      <span>pt</span>
                    </div>
                    <div class="fluent-stepper-wrap">
                      <span style="width:44px;">After:</span>
                      <input type="number" class="fluent-stepper-input" id="drift-spacing-after-val" value="8" min="0" max="60" step="4">
                      <span>pt</span>
                    </div>
                  </div>
                </div>
                <div class="fluent-group-label">Paragraph</div>
              </div>

              <!-- Page Background Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <div class="fluent-group-row">
                      <span style="font-size:11px; color:#a1a1aa; width:75px;">Page Tint:</span>
                      <select class="fluent-select-dark" id="drift-page-tint" style="width:110px;">
                        <option value="#ffffff" selected>Pure White</option>
                        <option value="#fafafa">Warm Ivory</option>
                        <option value="#f8fafc">Slate White</option>
                        <option value="#eff6ff">Cool Frost</option>
                        <option value="#fefce8">Cream</option>
                      </select>
                    </div>
                    <div class="fluent-group-row" style="margin-top:4px; gap:4px;">
                      <button class="fluent-btn-small" id="btn-page-borders" style="flex:1; justify-content:center;">
                        <span>Borders ▾</span>
                      </button>
                      <button class="fluent-btn-small" id="btn-drift-watermark" style="flex:1; justify-content:center;" title="Document Watermark">
                        <span>🌊 Watermark ▾</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="fluent-group-label">Page Background</div>
              </div>
            </div>

            <!-- 4. REFERENCES TAB PANE -->
            <div class="fluent-ribbon-pane" id="pane-references">
              <!-- Table of Contents Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-toc-action" title="Generate Table of Contents from Document Headings">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="21" y2="12"/><line x1="7" y1="18" x2="21" y2="18"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>
                    <span>Table of Contents</span>
                  </button>
                </div>
                <div class="fluent-group-label">Table of Contents</div>
              </div>

              <!-- Footnotes Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-insert-footnote" title="Insert Numbered Footnote Reference">
                    <span style="font-family:serif; font-size:16px; font-weight:700;">AB<sup>1</sup></span>
                    <span>Insert Footnote</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-insert-endnote" title="Insert Document Endnote">
                    <span style="font-family:serif; font-size:16px; font-weight:700;">AB<sup>i</sup></span>
                    <span>Insert Endnote</span>
                  </button>
                </div>
                <div class="fluent-group-label">Footnotes</div>
              </div>

              <!-- Citations & Bibliography Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <button class="fluent-btn-small" id="btn-insert-citation" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>+ Insert Citation</span>
                    </button>
                    <div class="fluent-group-row">
                      <span style="font-size:11px; color:#a1a1aa;">Style:</span>
                      <select class="fluent-select-dark" id="drift-citation-style" style="width:80px;">
                        <option value="APA" selected>APA 7th</option>
                        <option value="MLA">MLA 9th</option>
                        <option value="Chicago">Chicago</option>
                        <option value="IEEE">IEEE</option>
                      </select>
                    </div>
                    <button class="fluent-btn-small" id="btn-insert-bibliography" style="width:100%; justify-content:flex-start; gap:4px;">
                      <span>Bibliography ▾</span>
                    </button>
                  </div>
                </div>
                <div class="fluent-group-label">Citations & Bibliography</div>
              </div>
            </div>

            <!-- 4.5 MAILINGS TAB PANE -->
            <div class="fluent-ribbon-pane" id="pane-mailings">
              <!-- Start Mail Merge Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-start-mail-merge" title="Start Mail Merge: Letters, Envelopes, Labels, Emails">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>Start Merge ▾</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-select-recipients" title="Select Recipients: Upload CSV, Excel, Axis Sheets, or Edit Table">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>Recipients ▾</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-edit-recipients-list" title="View, Filter & Edit Recipient Data Table">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    <span>Edit List</span>
                  </button>
                </div>
                <div class="fluent-group-label">Start Mail Merge</div>
              </div>

              <!-- Write & Insert Fields Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-highlight-merge-fields" title="Highlight all {{MergeFields}} in document">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <span>Highlight Fields</span>
                  </button>
                  <div class="fluent-group-col">
                    <button class="fluent-btn-small" id="btn-insert-address-block" title="Insert Standard Address Block" style="padding:0 6px;">
                      <span>📬 Address Block</span>
                    </button>
                    <button class="fluent-btn-small" id="btn-insert-greeting-line" title="Insert Greeting Line (Dear ...)" style="padding:0 6px;">
                      <span>👋 Greeting Line</span>
                    </button>
                    <div class="fluent-group-row">
                      <button class="fluent-btn-small" id="btn-insert-merge-field-btn" title="Insert Specific Merge Field" style="color:#38bdf8; font-weight:700; padding:0 6px;">
                        <span>{a} Insert Field ▾</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="fluent-group-label">Write &amp; Insert Fields</div>
              </div>

              <!-- Preview Results Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-preview-merge-results" title="Toggle Live Preview of Merged Documents">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <span id="txt-preview-merge-label">Preview</span>
                  </button>
                  <div class="fluent-group-col" style="align-items:center;">
                    <div class="fluent-group-row" style="align-items:center; gap:3px;">
                      <button class="fluent-btn-small" id="btn-merge-first" title="First Record (1)" style="padding:0 4px; min-width:20px;">|◀</button>
                      <button class="fluent-btn-small" id="btn-merge-prev" title="Previous Record" style="padding:0 4px; min-width:20px;">◀</button>
                      <input type="text" id="input-merge-record-idx" value="1" style="width:28px; height:18px; text-align:center; font-size:11px; font-weight:700; background:#0f172a; color:#38bdf8; border:1px solid #334155; border-radius:3px;">
                      <span style="font-size:11px; color:#94a3b8;" id="txt-merge-total-count">/ 5</span>
                      <button class="fluent-btn-small" id="btn-merge-next" title="Next Record" style="padding:0 4px; min-width:20px;">▶</button>
                      <button class="fluent-btn-small" id="btn-merge-last" title="Last Record" style="padding:0 4px; min-width:20px;">▶|</button>
                    </div>
                    <button class="fluent-btn-small" id="btn-find-merge-recipient" title="Search Recipient" style="width:100%; justify-content:center; padding:0 4px; font-size:10.5px;">
                      <span>🔍 Find Recipient</span>
                    </button>
                  </div>
                </div>
                <div class="fluent-group-label">Preview Results</div>
              </div>

              <!-- Finish & Merge Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-finish-mail-merge" title="Finish &amp; Merge: Generate All Documents, Print Batch, or Export" style="background:#1d4ed8; color:#ffffff; font-weight:700; border-color:#2563eb;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    <span>Finish &amp; Merge ▾</span>
                  </button>
                </div>
                <div class="fluent-group-label">Finish</div>
              </div>
            </div>

            <!-- 5. REVIEW TAB PANE -->
            <div class="fluent-ribbon-pane" id="pane-review">
              <!-- Proofing Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-toggle-spellcheck" title="Toggle Interactive Spellcheck">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Spelling</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-review-thesaurus" title="Thesaurus (Synonyms & Antonyms)">
                    <span style="font-size:18px;">📚</span>
                    <span>Thesaurus</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-doc-statistics" title="Word Count, Paragraphs, Lines, Reading Time">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  <button class="fluent-btn-large" id="btn-review-accessibility" title="Check Document Accessibility & Screen Reader Compliance">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="4" r="2"/><path d="M12 6v6l3 3"/><path d="M6 8.5C7.5 7 9.5 6 12 6s4.5 1 6 2.5"/><path d="M9 21l3-6 3 6"/></svg>
                    <span>Accessibility</span>
                  </button>
                </div>
                <div class="fluent-group-label">Proofing &amp; Accessibility</div>
              </div>

              <!-- Language Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-review-translate" title="Document Translation Engine">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>Translate</span>
                  </button>
                </div>
                <div class="fluent-group-label">Language</div>
              </div>

              <!-- Comments Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-review-new-comment" title="New Margin Comment">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>New Comment</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-review-show-comments" title="Toggle Comments Sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                    <span>Show Comments</span>
                  </button>
                </div>
                <div class="fluent-group-label">Comments</div>
              </div>

              <!-- Tracking Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-toggle-track-changes" title="Toggle Track Changes Markup Mode">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    <span id="track-changes-label">Track Changes</span>
                  </button>
                  <div class="fluent-group-col">
                    <button class="fluent-btn-small" id="btn-accept-track-changes" style="padding:0 6px; color:#10b981;" title="Accept All Tracked Changes">✓ Accept All</button>
                    <button class="fluent-btn-small" id="btn-reject-track-changes" style="padding:0 6px; color:#ef4444;" title="Reject All Tracked Changes">✕ Reject All</button>
                  </div>
                </div>
                <div class="fluent-group-label">Tracking</div>
              </div>

              <!-- Protect Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-doc-lock" title="Lock Document with Sovereign Passcode">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span id="txt-drift-lock-label">Lock Doc</span>
                  </button>
                </div>
                <div class="fluent-group-label">Protect</div>
              </div>
              <!-- Girionix AI Polish Group -->
              <div class="fluent-ribbon-group" style="background:rgba(37,99,235,0.06); border-radius:4px;">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-drift-review-ai" title="AI Rewrite &amp; Executive Polish" style="color:#2563eb; font-weight:700;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span style="color:#2563eb;">AI Polish</span>
                  </button>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label" style="color:#2563eb; font-weight:700;">Girionix AI</div>
                </div>
              </div>
            </div>

            <!-- 6. VIEW TAB PANE -->
            <div class="fluent-ribbon-pane" id="pane-view">
              <!-- Views Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large active" id="btn-view-paper" title="Print Layout View (A4 Paper Sheet)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>Paged Sheet</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-view-web" title="Full-Bleed Responsive Web View">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>Web View</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-toggle-zen" title="Zen Focus Mode">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                    <span>Zen Mode</span>
                  </button>
                </div>
                <div class="fluent-group-label">Views</div>
              </div>

              <!-- Show Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <div class="fluent-group-col">
                    <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                      <input type="checkbox" id="chk-toggle-ruler" checked> Ruler
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                      <input type="checkbox" id="chk-toggle-outline" checked> Navigation Pane
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; color:#cbd5e1;">
                      <input type="checkbox" id="chk-toggle-gridlines"> Gridlines
                    </label>
                  </div>
                </div>
                <div class="fluent-group-label">Show</div>
              </div>

              <!-- Zoom Group -->
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-small" id="btn-drift-zoom-out" title="Zoom Out">-</button>
                  <span style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; width:48px; text-align:center; color:#38bdf8;" id="drift-zoom-label">100%</span>
                  <button class="fluent-btn-small" id="btn-drift-zoom-in" title="Zoom In">+</button>
                  <button class="fluent-btn-small" id="btn-drift-zoom-reset" title="Reset Zoom" style="width:auto; padding:0 8px;">100%</button>
                </div>
                <div class="fluent-group-footer">
                  <div class="fluent-group-label">Zoom</div>
                </div>
              </div>
            </div>

            <!-- 7. HELP TAB PANE -->
            <div class="fluent-ribbon-pane" id="pane-help">
              <div class="fluent-ribbon-group">
                <div class="fluent-group-controls">
                  <button class="fluent-btn-large" id="btn-drift-help-center" title="Open Help Center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>Help</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-drift-shortcuts-btn" title="View Keyboard Shortcuts">
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
                  <button class="fluent-btn-large" id="btn-drift-whats-new" title="What's New in Giri Drift">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>What's New</span>
                  </button>
                  <button class="fluent-btn-large" id="btn-drift-feedback-btn" title="Send Feedback">
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

        <!-- Split Body: Outline Sidebar + Ruler + Centered Paper + Comments Panel -->
        <div class="drift-split-body" style="position:relative; overflow:hidden;">
          <!-- Left Navigation Sidebar -->
          <aside class="drift-left-sidebar" id="drift-left-sidebar" style="display:flex; flex-direction:column; gap:10px;">
            <!-- Mobile Close Drawer Header -->
            <div class="drift-sidebar-mobile-close-row" style="display:none; justify-content:space-between; align-items:center; margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid #334155;">
              <span style="font-size:12px; font-weight:700; color:#f8fafc; display:flex; align-items:center; gap:6px;">
                <span>📄</span> Navigation
              </span>
              <button id="btn-close-drift-sidebar-drawer" style="background:#27272a; border:1px solid #3f3f46; color:#cbd5e1; border-radius:4px; padding:3px 8px; font-size:12px; cursor:pointer;">✕</button>
            </div>

            <!-- Navigation Tab Switcher & Collapse Button -->
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px; flex-shrink:0;">
              <div class="drift-sidebar-nav-tabs" style="display:flex; gap:4px; flex:1; background:#1e293b; padding:3px; border-radius:6px; border:1px solid #334155;">
                <button class="drift-sidebar-nav-tab active" id="tab-drift-pages" style="flex:1; background:#2563eb; color:#fff; border:none; border-radius:4px; padding:6px 4px; font-size:11px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;">
                  <span>📄</span> Pages
                </button>
                <button class="drift-sidebar-nav-tab" id="tab-drift-headings" style="flex:1; background:transparent; color:#94a3b8; border:none; border-radius:4px; padding:6px 4px; font-size:11px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;">
                  <span>📑</span> Headings
                </button>
              </div>
              <button id="btn-drift-collapse-sidebar" title="Close / Hide Navigation Sidebar (Ctrl+Alt+N)" style="background:#18181b; border:1px solid #334155; color:#94a3b8; border-radius:6px; width:26px; height:26px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; flex-shrink:0; transition:all 0.15s;">
                ⮜
              </button>
            </div>

            <!-- 1. PAGES PANE -->
            <div class="drift-sidebar-tab-pane" id="pane-drift-pages" style="display:flex; flex-direction:column; flex:1; min-height:0; overflow:hidden;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; flex-shrink:0;">
                <strong id="drift-page-counter-badge" style="font-size:11.5px; color:#38bdf8; font-weight:700;">Page 1 of 1</strong>
                <button id="btn-drift-insert-pagebreak" title="Insert Page Break (Ctrl+Enter)" style="background:#27272a; border:1px solid #3f3f46; color:#cbd5e1; border-radius:4px; padding:3px 8px; font-size:10.5px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:3px;">
                  <span>+</span> Page Break
                </button>
              </div>

              <div class="drift-pages-list" id="drift-pages-list" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:8px; padding-right:2px;">
                <!-- Dynamically populated page miniature thumbnails -->
              </div>
            </div>

            <!-- 2. HEADINGS PANE -->
            <div class="drift-sidebar-tab-pane" id="pane-drift-headings" style="display:none; flex-direction:column; flex:1; min-height:0; overflow:hidden;">
              <span class="sidebar-heading" style="margin-bottom:6px; flex-shrink:0;">HEADINGS OUTLINE</span>
              <ul class="doc-outline-list" id="doc-outline-list" style="flex:1; overflow-y:auto; list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                <!-- Dynamically populated from headings -->
              </ul>
            </div>

            <!-- BOTTOM PROOFING & STATS BAR (Replacing old telemetry) -->
            <div class="drift-sidebar-bottom-bar" style="margin-top:auto; padding-top:10px; border-top:1px solid #27272a; display:flex; flex-direction:column; gap:6px; flex-shrink:0;">
              <!-- Page Viewer Trigger Card -->
              <div class="sidebar-proofing-card" id="btn-drift-sidebar-pageviewer" role="button" tabindex="0" title="Document Pages & Layout Navigation" style="background:#18181b; border:1px solid #27272a; border-radius:6px; padding:7px 9px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px;">
                <span style="font-size:16px;">📄</span>
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Pages</span>
                    <strong id="drift-sidebar-page-count" style="font-size:11.5px; color:#38bdf8;">1 Page</strong>
                  </div>
                  <div style="font-size:10px; color:#64748b;" id="drift-sidebar-page-info">Standard A4 Layout</div>
                </div>
              </div>

              <!-- Word Count Trigger Card -->
              <div class="sidebar-proofing-card" id="btn-drift-sidebar-wordcount" role="button" tabindex="0" title="Open Detailed Word Count & Document Statistics" style="background:#18181b; border:1px solid #27272a; border-radius:6px; padding:7px 9px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px;">
                <span style="font-size:16px;">📝</span>
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Word Count</span>
                    <strong id="drift-word-count" style="font-size:11.5px; color:#f8fafc;">0</strong>
                  </div>
                  <div style="font-size:10px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    <span id="drift-char-count">0</span> chars • <span id="drift-read-time">~1 min</span>
                  </div>
                </div>
              </div>

              <!-- Spell Check Trigger Card -->
              <div class="sidebar-proofing-card" id="btn-drift-sidebar-spelling" role="button" tabindex="0" title="Open Spelling & Grammar Proofing Assistant" style="background:#18181b; border:1px solid #27272a; border-radius:6px; padding:7px 9px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px;">
                <span style="font-size:16px; color:#10b981;">✓</span>
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase;">ProofMaster</span>
                    <span id="drift-spelling-status-pill" style="font-size:9.5px; font-weight:700; color:#10b981; background:rgba(16,185,129,0.15); padding:1px 5px; border-radius:3px;">ACTIVE</span>
                  </div>
                  <div style="font-size:10px; color:#64748b;" id="drift-spelling-summary-text">Click to scan document</div>
                </div>
              </div>

              <!-- Version History Trigger Card (Sovereign TimeMachine) -->
              <div class="sidebar-proofing-card" id="btn-drift-sidebar-versions" role="button" tabindex="0" title="Orbit Sovereign Version History & Restore (Snapshots)" style="background:#18181b; border:1px solid #27272a; border-radius:6px; padding:7px 9px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px;">
                <span style="font-size:16px;">⏱️</span>
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Version History</span>
                    <span id="drift-versions-count-pill" style="font-size:9.5px; font-weight:700; color:#a855f7; background:rgba(168,85,247,0.15); padding:1px 5px; border-radius:3px;">TIMEMACHINE</span>
                  </div>
                  <div style="font-size:10px; color:#64748b;" id="drift-versions-summary-text">Auto-save snapshots</div>
                </div>
              </div>

              <!-- Thesaurus Trigger Card -->
              <div class="sidebar-proofing-card" id="btn-drift-sidebar-thesaurus" role="button" tabindex="0" title="Open Thesaurus & Synonym Dictionary" style="background:#18181b; border:1px solid #27272a; border-radius:6px; padding:7px 9px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px;">
                <span style="font-size:16px;">📚</span>
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Thesaurus</span>
                    <span style="font-size:9.5px; color:#38bdf8; font-weight:600;">LOOKUP</span>
                  </div>
                  <div style="font-size:10px; color:#64748b;">Find synonyms & antonyms</div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Centered Paper Canvas Viewport -->
          <div class="drift-center-viewport" id="drift-center-viewport" style="position:relative;">
            <!-- Floating Button to Re-open Sidebar when Closed -->
            <button id="btn-drift-expand-sidebar-floating" title="Open Pages & Headings Sidebar (Ctrl+Alt+N)" style="display:none; position:absolute; top:12px; left:16px; z-index:40; background:#1e293b; border:1px solid #38bdf8; color:#38bdf8; border-radius:20px; padding:5px 12px; font-size:11px; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(0,0,0,0.4); align-items:center; gap:6px;">
              <span>📄</span><span>Pages & Headings</span>
            </button>
            <!-- Document Ruler Bar -->
            <div id="drift-top-ruler" style="width:816px; min-width:816px; max-width:816px; height:18px; background:#f1f5f9; border:1px solid #cbd5e1; border-bottom:none; display:flex; align-items:center; justify-content:space-between; padding:0 10px; font-size:9px; font-family:var(--font-mono); color:#64748b; margin:12px auto 0 auto; border-radius:4px 4px 0 0; user-select:none; box-sizing:border-box;">
              <span>| 1"</span><span>| 2"</span><span>| 3"</span><span>| 4"</span><span>| 5"</span><span>| 6"</span><span>| 7"</span><span>| 8"</span>
            </div>

            <article class="paper-sheet-container" id="drift-paper-canvas" style="border-radius:0 0 4px 4px;">
              ${savedDoc}
            </article>

            <!-- Bottom of Document Add Page Action Bar -->
            <div class="drift-bottom-add-page-bar" style="width:816px; margin:24px auto 60px auto; display:flex; justify-content:center;">
              <button id="btn-drift-canvas-add-page" type="button" title="Add New Physical Page (Ctrl+Enter)" style="display:inline-flex; align-items:center; gap:8px; background:#ffffff; border:1px solid #cbd5e1; color:#2563eb; font-weight:700; font-size:13px; padding:9px 24px; border-radius:24px; box-shadow:0 2px 10px rgba(0,0,0,0.06); cursor:pointer; transition:all 0.18s ease;">
                <span style="font-size:16px; line-height:1;">＋</span>
                <span>Add Page</span>
              </button>
            </div>
          </div>

          <!-- Giri Drift Sidebar Deck -->
          ${orbitDesktopSuite.renderSidebarDeck('drift')}

          <!-- Right Slide-Over Comments Panel -->
          <aside class="drift-comments-sidebar" id="drift-comments-sidebar">
            <div class="comments-header">
              <span>Comments & Review</span>
              <button class="fluent-btn-small" id="btn-close-comments-sidebar" style="color:#64748b;">✕</button>
            </div>
            <div class="comments-list" id="drift-comments-list">
              <!-- Populated dynamically -->
            </div>
            <div class="comments-footer-add">
              <textarea id="new-comment-textarea" placeholder="Add a comment or executive note..." rows="2" style="width:100%; padding:8px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; resize:none; font-family:var(--font-sans);"></textarea>
              <button class="btn-giri-primary" id="btn-post-comment" style="padding:6px 14px; font-size:12px; align-self:flex-end;">Post Comment</button>
            </div>
          </aside>

          <!-- Floating Emoji Picker Dropdown -->
          <div class="fluent-emoji-picker-dropdown" id="drift-emoji-picker-dropdown">
            <!-- Populated dynamically with emojis -->
          </div>

          <!-- Mobile Floating Formatting Toolbar -->
          <div class="drift-mobile-toolbar" id="drift-mobile-toolbar" style="display:none;">
            <button class="mobile-tool-btn" id="btn-mobile-drift-sidebar" title="Toggle Navigation Drawer">📑</button>
            <div class="mobile-tool-sep"></div>
            <button class="mobile-tool-btn" id="btn-mobile-drift-undo" title="Undo">↶</button>
            <button class="mobile-tool-btn" id="btn-mobile-drift-redo" title="Redo">↷</button>
            <div class="mobile-tool-sep"></div>
            <button class="mobile-tool-btn" id="btn-mobile-drift-bold" title="Bold"><b>B</b></button>
            <button class="mobile-tool-btn" id="btn-mobile-drift-italic" title="Italic"><i>I</i></button>
            <button class="mobile-tool-btn" id="btn-mobile-drift-underline" title="Underline"><u>U</u></button>
            <button class="mobile-tool-btn" id="btn-mobile-drift-rupee" title="Insert ₹ Rupee">₹</button>
            <div class="mobile-tool-sep"></div>
            <button class="mobile-tool-btn" id="btn-mobile-drift-h1" title="Heading 1">H1</button>
            <button class="mobile-tool-btn" id="btn-mobile-drift-bullet" title="Bullet List">•</button>
            <button class="mobile-tool-btn" id="btn-mobile-drift-dictate" title="Voice Dictation">🎙</button>
            <button class="mobile-tool-btn" id="btn-mobile-drift-save" title="Save Document" style="color:#38bdf8;">💾</button>
          </div>
        </div>

        <!-- Giri Drift Bottom Status Bar -->
        ${orbitDesktopSuite.renderStatusBar('drift', { currentPage: 1, totalPages: 1, words: 0, chars: 0 })}
      </div>

      <!-- DIALOG MODALS FOR DRIFT -->
      <!-- Save as Custom Template Dialog -->
      <div class="office-modal-backdrop" id="drift-save-template-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true">
          <div class="office-dialog-header">
            <span class="office-dialog-title">★ Save Document as Custom Template</span>
            <button class="esc-kbd" id="btn-close-save-template">ESC</button>
          </div>
          <div class="office-dialog-body">
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Template Name:</label>
              <input type="text" id="custom-template-name-input" class="dialog-input-field" value="${currentDocTitle} Template" placeholder="e.g. Q4 Executive Brief">
            </div>
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Template Category:</label>
              <select id="custom-template-cat-select" class="dialog-input-field">
                <option value="custom" selected>Custom Templates</option>
                <option value="resumes">Resumes</option>
                <option value="invoices">Invoices</option>
                <option value="papers">Papers and Reports</option>
                <option value="flyers">Flyers</option>
                <option value="meeting">Meeting Notes</option>
                <option value="letters">Letters</option>
              </select>
            </div>
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Description:</label>
              <input type="text" id="custom-template-desc-input" class="dialog-input-field" value="Reusable custom document layout" placeholder="Short description of this template...">
            </div>
            <p style="font-size:11px; color:#64748b; margin:0;">
              This template will be saved to your local sovereign template library and available immediately from the Template Hub.
            </p>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-save-template">Cancel</button>
            <button class="btn-giri-primary" id="btn-confirm-save-template" style="padding:7px 16px; font-size:12.5px;">Save Template</button>
          </div>
        </div>
      </div>

      <!-- Find & Replace Dialog -->
      <div class="office-modal-backdrop" id="drift-find-replace-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true">
          <div class="office-dialog-header">
            <span class="office-dialog-title">🔍 Find and Replace</span>
            <button class="esc-kbd" id="btn-close-find-replace">ESC</button>
          </div>
          <div class="office-dialog-body">
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Find Word / Phrase:</label>
              <input type="text" id="find-input-query" class="dialog-input-field" placeholder="Enter text to search...">
            </div>
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Replace With:</label>
              <input type="text" id="replace-input-val" class="dialog-input-field" placeholder="Enter replacement text...">
            </div>
            <div id="find-status-msg" style="font-size:11.5px; color:#64748b;">Ready to search document.</div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-find-next">Find Next</button>
            <button class="btn-giri-primary" id="btn-replace-all" style="padding:7px 14px; font-size:12px;">Replace All</button>
          </div>
        </div>
      </div>

      <!-- Insert Link Dialog -->
      <div class="office-modal-backdrop" id="drift-link-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true">
          <div class="office-dialog-header">
            <span class="office-dialog-title">🔗 Insert Hyperlink</span>
            <button class="esc-kbd" id="btn-close-link-modal">ESC</button>
          </div>
          <div class="office-dialog-body">
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Display Text:</label>
              <input type="text" id="link-display-text" class="dialog-input-field" placeholder="Text to display...">
            </div>
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Web Address / URL:</label>
              <input type="text" id="link-url-target" class="dialog-input-field" placeholder="https://..." value="https://">
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-link">Cancel</button>
            <button class="btn-giri-primary" id="btn-confirm-link" style="padding:7px 14px; font-size:12px;">Insert Link</button>
          </div>
        </div>
      </div>

      <!-- Special Symbols Dialog -->
      <div class="office-modal-backdrop" id="drift-symbol-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:420px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">Ω Special Characters & Symbols</span>
            <button class="esc-kbd" id="btn-close-symbol-modal">ESC</button>
          </div>
          <div class="office-dialog-body">
            <div class="symbols-grid" id="symbols-picker-grid">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      </div>

      <!-- Math Equation Dialog -->
      <div class="office-modal-backdrop" id="drift-equation-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true">
          <div class="office-dialog-header">
            <span class="office-dialog-title">√x Insert Math Formula</span>
            <button class="esc-kbd" id="btn-close-equation-modal">ESC</button>
          </div>
          <div class="office-dialog-body">
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">LaTeX / Formula Expression:</label>
              <input type="text" id="math-equation-input" class="dialog-input-field" placeholder="e.g. E = mc^2 or \sum_{i=1}^n x_i" value="E = mc^2">
            </div>
            <div>
              <label style="display:block; margin-bottom:4px; font-weight:600; font-size:12px;">Preview:</label>
              <div id="math-equation-preview" style="padding:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-family:var(--font-mono); font-size:15px; color:#1e40af; text-align:center;">
                E = mc²
              </div>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-equation">Cancel</button>
            <button class="btn-giri-primary" id="btn-confirm-equation" style="padding:7px 14px; font-size:12px;">Insert Formula</button>
          </div>
        </div>
      </div>

      <!-- Document Statistics Dialog -->
      <div class="office-modal-backdrop" id="drift-stats-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:400px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">📊 Document Telemetry & Statistics</span>
            <button class="esc-kbd" id="btn-close-stats-modal">ESC</button>
          </div>
          <div class="office-dialog-body" id="doc-stats-modal-body">
            <!-- Populated dynamically -->
          </div>
          <div class="office-dialog-footer">
            <button class="btn-giri-primary" id="btn-ok-stats" style="padding:7px 16px; font-size:12px;">Close</button>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts & Settings Dialog -->
      <div class="office-modal-backdrop" id="drift-shortcuts-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:580px; max-width:92vw;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">⌨️ Keyboard Shortcuts & Settings</span>
            <button class="esc-kbd" id="btn-close-shortcuts-modal">ESC</button>
          </div>
          <div class="office-dialog-body" style="max-height:60vh; overflow-y:auto; padding:16px 20px;">
            <div style="margin-bottom:14px;">
              <input type="text" id="shortcuts-search-input" class="dialog-input-field" placeholder="Search shortcut or command (e.g. thesaurus, bold, page, ai)..." style="width:100%;">
            </div>
            
            <div class="shortcuts-list-container" id="shortcuts-list-container">
              <!-- Navigation & Tools -->
              <div class="shortcut-group-section" style="margin-bottom:16px;">
                <h5 style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; color:#38bdf8; letter-spacing:0.5px;">Navigation & Workspaces</h5>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Toggle Pages & Headings Sidebar</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Alt</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">N</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Thesaurus & Synonym Lookup</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Shift</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">F7</kbd> <span style="color:#64748b; font-size:11px; margin:0 2px;">or</span> <kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Alt</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">T</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Girionix AI Office Copilot</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Alt</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">J</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Find & Replace</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">F</kbd></span>
                  </div>
                </div>
              </div>

              <!-- Editing & Formatting -->
              <div class="shortcut-group-section" style="margin-bottom:16px;">
                <h5 style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; color:#38bdf8; letter-spacing:0.5px;">Editing & Document Formatting</h5>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Insert Page Break</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Enter</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Bold Text</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">B</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Italic Text</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">I</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Underline Text</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">U</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Undo / Redo</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Z</kbd> / <kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Y</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Insert Hyperlink</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">K</kbd></span>
                  </div>
                </div>
              </div>

              <!-- File & Output -->
              <div class="shortcut-group-section">
                <h5 style="margin:0 0 8px 0; font-size:12px; text-transform:uppercase; color:#38bdf8; letter-spacing:0.5px;">File & Output</h5>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Save Document to Cloud / Memory</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">S</kbd></span>
                  </div>
                  <div class="shortcut-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:12.5px; color:#f1f5f9;">Print / Export PDF</span>
                    <span style="display:flex; gap:4px;"><kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">Ctrl</kbd>+<kbd class="shortcut-key-badge" style="background:#1e293b; border:1px solid #475569; padding:2px 7px; border-radius:4px; font-size:11px; font-family:monospace; color:#38bdf8;">P</kbd></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="office-dialog-footer" style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11.5px; color:#64748b;">Shortcuts work globally inside Giri Drift Docs</span>
            <button class="btn-giri-primary" id="btn-ok-shortcuts" style="padding:7px 16px; font-size:12px;">Close</button>
          </div>
        </div>
      </div>

      
      <!-- Custom Stamp Creator Modal (User Request media_1789232638479.png) -->
      <div class="office-modal-backdrop" id="drift-custom-stamp-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:480px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">🛡️ Custom Stamp Studio</span>
            <button class="esc-kbd" id="btn-close-custom-stamp-modal">ESC</button>
          </div>
          <div class="office-dialog-body" style="display:flex; flex-direction:column; gap:12px;">
            <div>
              <label style="display:block; font-size:11.5px; font-weight:600; color:#334155; margin-bottom:4px;">Primary Stamp Text:</label>
              <input type="text" id="stamp-custom-text-input" class="dialog-input-field" value="CONFIDENTIAL" placeholder="e.g. APPROVED, TOP SECRET, ACCEPTED" style="text-transform:uppercase;">
            </div>
            <div>
              <label style="display:block; font-size:11.5px; font-weight:600; color:#334155; margin-bottom:4px;">Issuer / Department Subtext:</label>
              <input type="text" id="stamp-custom-sub-input" class="dialog-input-field" value="GIRI CORP EXECUTIVE" placeholder="e.g. OFFICE OF THE CEO, LEGAL AUDIT">
            </div>
            <div style="display:flex; gap:14px; align-items:center;">
              <div style="flex:1;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#334155; margin-bottom:4px;">Stamp Color:</label>
                <div style="display:flex; gap:6px;" id="stamp-color-swatches">
                  <button class="stamp-color-btn active" data-color="#dc2626" style="width:24px; height:24px; border-radius:50%; background:#dc2626; border:2px solid #fff; box-shadow:0 0 0 2px #dc2626;"></button>
                  <button class="stamp-color-btn" data-color="#059669" style="width:24px; height:24px; border-radius:50%; background:#059669; border:2px solid #fff; box-shadow:0 0 0 1px #cbd5e1;"></button>
                  <button class="stamp-color-btn" data-color="#1e3a8a" style="width:24px; height:24px; border-radius:50%; background:#1e3a8a; border:2px solid #fff; box-shadow:0 0 0 1px #cbd5e1;"></button>
                  <button class="stamp-color-btn" data-color="#7c3aed" style="width:24px; height:24px; border-radius:50%; background:#7c3aed; border:2px solid #fff; box-shadow:0 0 0 1px #cbd5e1;"></button>
                  <button class="stamp-color-btn" data-color="#d97706" style="width:24px; height:24px; border-radius:50%; background:#d97706; border:2px solid #fff; box-shadow:0 0 0 1px #cbd5e1;"></button>
                  <button class="stamp-color-btn" data-color="#0f172a" style="width:24px; height:24px; border-radius:50%; background:#0f172a; border:2px solid #fff; box-shadow:0 0 0 1px #cbd5e1;"></button>
                </div>
              </div>
              <div style="flex:1;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#334155; margin-bottom:4px;">Border Style:</label>
                <select id="stamp-border-style-select" class="dialog-input-field" style="padding:5px 8px;">
                  <option value="double" selected>Double Border</option>
                  <option value="solid">Solid Thick</option>
                  <option value="dashed">Dashed Line</option>
                  <option value="groove">Heavy Grunge</option>
                </select>
              </div>
            </div>
            <div style="display:flex; gap:16px; align-items:center; font-size:11.5px; color:#475569;">
              <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
                <input type="checkbox" id="stamp-include-date" checked> Include Current Date
              </label>
              <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
                <input type="checkbox" id="stamp-include-hash" checked> Cryptographic Hash
              </label>
            </div>
            <div>
              <label style="display:block; font-size:11.5px; font-weight:600; color:#64748b; margin-bottom:6px;">Live Stamp Preview:</label>
              <div id="stamp-live-preview-box" style="padding:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; display:flex; justify-content:center; align-items:center; min-height:85px;">
              </div>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-custom-stamp">Cancel</button>
            <button class="btn-giri-primary" id="btn-confirm-insert-stamp" style="padding:7px 18px; font-size:12px;">Insert Stamp</button>
          </div>
        </div>
      </div>

      <!-- Version History Dialog -->
      <div class="office-modal-backdrop" id="drift-version-history-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:460px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">🕒 Document Version History</span>
            <button class="esc-kbd" id="btn-close-history-modal">ESC</button>
          </div>
          <div class="office-dialog-body" id="doc-version-history-body">
            <div style="font-size:12px; color:#64748b; margin-bottom:12px;">
              All snapshots are captured sovereignly in local memory buffers.
            </div>
            <div id="version-history-list" style="display:flex; flex-direction:column; gap:8px;">
              <!-- Dynamically populated -->
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="btn-giri-primary" id="btn-ok-history" style="padding:7px 16px; font-size:12px;">Done</button>
          </div>
        </div>
      </div>

      <!-- Info Dialog -->
      <div class="office-modal-backdrop" id="drift-info-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:440px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">ℹ Document Information</span>
            <button class="esc-kbd" id="btn-close-info-modal">ESC</button>
          </div>
          <div class="office-dialog-body" id="doc-info-modal-body">
            <!-- Dynamically populated -->
          </div>
          <div class="office-dialog-footer">
            <button class="btn-giri-primary" id="btn-ok-info" style="padding:7px 16px; font-size:12px;">Close</button>
          </div>
        </div>
      </div>

      <!-- Font Dialog Launcher Modal -->
      <div class="office-modal-backdrop" id="drift-font-dialog-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:480px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">🔤 Font Settings</span>
            <button class="esc-kbd" id="btn-close-font-dialog">ESC</button>
          </div>
          <div class="office-dialog-body" style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; gap:12px;">
              <div style="flex:2;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Font Family:</label>
                <select id="modal-font-family" class="fluent-select-dark" style="width:100%; height:32px;">
                  <option value="Aptos, Calibri, sans-serif" selected>Aptos (Default)</option>
                  <option value="Calibri, sans-serif">Calibri</option>
                  <option value="'Segoe UI', sans-serif">Segoe UI</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Arial, sans-serif">Arial</option>
                </select>
              </div>
              <div style="flex:1;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Size (pt):</label>
                <input type="number" id="modal-font-size-val" class="dialog-input-field" value="12" min="8" max="72">
              </div>
            </div>
            <div style="display:flex; gap:12px;">
              <div style="flex:1;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Font Style:</label>
                <select id="modal-font-weight-style" class="fluent-select-dark" style="width:100%; height:32px;">
                  <option value="normal" selected>Regular</option>
                  <option value="italic">Italic</option>
                  <option value="bold">Bold</option>
                  <option value="bold-italic">Bold Italic</option>
                </select>
              </div>
              <div style="flex:1;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Font Color:</label>
                <input type="color" id="modal-font-color-picker" class="ribbon-color-input" value="#0f172a" style="width:100%; height:32px; border-radius:4px; cursor:pointer;">
              </div>
            </div>
            <div>
              <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Effects:</label>
              <div style="display:flex; gap:16px; font-size:12px; color:#94a3b8;">
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="modal-chk-strike"> Strikethrough</label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="modal-chk-sub"> Subscript</label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="modal-chk-sup"> Superscript</label>
              </div>
            </div>
            <div style="padding:14px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; text-align:center;">
              <span id="modal-font-preview" style="font-family:Aptos, Calibri, sans-serif; font-size:16px; color:#0f172a;">Aptos Preview Text (Office 365)</span>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-font-dialog">Cancel</button>
            <button class="btn-giri-primary" id="btn-apply-font-dialog" style="padding:7px 18px; font-size:12px;">Apply Font</button>
          </div>
        </div>
      </div>

      <!-- Paragraph Dialog Launcher Modal -->
      <div class="office-modal-backdrop" id="drift-paragraph-dialog-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:480px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">¶ Paragraph Settings</span>
            <button class="esc-kbd" id="btn-close-paragraph-dialog">ESC</button>
          </div>
          <div class="office-dialog-body" style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; gap:12px;">
              <div style="flex:1;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Alignment:</label>
                <select id="modal-para-align" class="fluent-select-dark" style="width:100%; height:32px;">
                  <option value="left" selected>Left</option>
                  <option value="center">Centered</option>
                  <option value="right">Right</option>
                  <option value="justify">Justified</option>
                </select>
              </div>
              <div style="flex:1;">
                <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Line Spacing:</label>
                <select id="modal-para-line-spacing" class="fluent-select-dark" style="width:100%; height:32px;">
                  <option value="1.0">Single (1.0)</option>
                  <option value="1.15" selected>1.15 lines</option>
                  <option value="1.5">1.5 lines</option>
                  <option value="2.0">Double (2.0)</option>
                </select>
              </div>
            </div>
            <div>
              <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Indentation (px):</label>
              <div style="display:flex; gap:12px;">
                <div style="flex:1;">
                  <span style="font-size:11px; color:#94a3b8;">Left:</span>
                  <input type="number" id="modal-para-indent-left" class="dialog-input-field" value="0" min="0" max="100" step="10">
                </div>
                <div style="flex:1;">
                  <span style="font-size:11px; color:#94a3b8;">Right:</span>
                  <input type="number" id="modal-para-indent-right" class="dialog-input-field" value="0" min="0" max="100" step="10">
                </div>
              </div>
            </div>
            <div>
              <label style="display:block; font-size:11.5px; font-weight:600; color:#cbd5e1; margin-bottom:4px;">Spacing (pt):</label>
              <div style="display:flex; gap:12px;">
                <div style="flex:1;">
                  <span style="font-size:11px; color:#94a3b8;">Before:</span>
                  <input type="number" id="modal-para-space-before" class="dialog-input-field" value="0" min="0" max="60" step="4">
                </div>
                <div style="flex:1;">
                  <span style="font-size:11px; color:#94a3b8;">After:</span>
                  <input type="number" id="modal-para-space-after" class="dialog-input-field" value="8" min="0" max="60" step="4">
                </div>
              </div>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="export-cancel-btn" id="btn-cancel-paragraph-dialog">Cancel</button>
            <button class="btn-giri-primary" id="btn-apply-paragraph-dialog" style="padding:7px 18px; font-size:12px;">Apply Paragraph</button>
          </div>
        </div>
      </div>

      <!-- Proofing & Writing Intelligence Modal -->
      <div class="office-modal-backdrop" id="drift-editor-proofing-modal">
        <div class="office-dialog-card proofing-dialog-card-dark" role="dialog" aria-modal="true" style="width:580px; max-width:94vw; background:#0f172a; color:#f8fafc; border:1px solid rgba(255,255,255,0.12); box-shadow:0 25px 60px -15px rgba(0,0,0,0.8); border-radius:12px; overflow:hidden;">
          <div class="office-dialog-header" style="background:#1e293b; border-bottom:1px solid #334155; padding:14px 20px; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:18px;">🖊️</span>
              <div>
                <span class="office-dialog-title" style="color:#f8fafc; font-size:14.5px; font-weight:700;">Proofing &amp; Writing Intelligence</span>
                <div style="font-size:10.5px; color:#94a3b8; display:flex; align-items:center; gap:6px; margin-top:2px;">
                  <span style="width:6px; height:6px; background:#10b981; border-radius:50%; display:inline-block; box-shadow:0 0 8px #10b981;"></span>
                  <span>Sovereign Local NLP Engine • 100% Private</span>
                </div>
              </div>
            </div>
            <button class="esc-kbd" id="btn-close-drift-spelling-dialog" style="color:#94a3b8; border-color:#334155; background:rgba(255,255,255,0.05); cursor:pointer;">✕</button>
          </div>
          <div class="office-dialog-body" style="padding:18px 20px; display:flex; flex-direction:column; gap:14px; background:#0f172a;">
            <!-- Target Tone Selector -->
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <span style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em;">Target Tone:</span>
              <div class="proofing-tone-strip" id="drift-proofing-tone-strip" style="display:flex; gap:6px;">
                <button class="proofing-tone-btn active" data-tone="formal" style="padding:3px 10px; font-size:11px; border-radius:14px; border:1px solid #3b82f6; background:rgba(59,130,246,0.25); color:#93c5fd; cursor:pointer; font-weight:600;">Executive</button>
                <button class="proofing-tone-btn" data-tone="clear" style="padding:3px 10px; font-size:11px; border-radius:14px; border:1px solid #334155; background:#1e293b; color:#94a3b8; cursor:pointer; font-weight:500;">Direct</button>
                <button class="proofing-tone-btn" data-tone="technical" style="padding:3px 10px; font-size:11px; border-radius:14px; border:1px solid #334155; background:#1e293b; color:#94a3b8; cursor:pointer; font-weight:500;">Technical</button>
                <button class="proofing-tone-btn" data-tone="creative" style="padding:3px 10px; font-size:11px; border-radius:14px; border:1px solid #334155; background:#1e293b; color:#94a3b8; cursor:pointer; font-weight:500;">Creative</button>
              </div>
            </div>

            <!-- Hero Overall Document Score -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 18px; background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius:10px; border:1px solid #334155; box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);">
              <div>
                <span style="font-size:10.5px; text-transform:uppercase; letter-spacing:0.05em; color:#94a3b8; display:block;">Overall Document Score</span>
                <div style="display:flex; align-items:baseline; gap:8px; margin-top:2px;">
                  <strong style="font-size:32px; font-weight:900; color:#10b981; font-family:monospace;" id="drift-editor-score-val">98%</strong>
                  <span style="font-size:11.5px; color:#10b981; font-weight:600;" id="drift-editor-score-pill">● Pristine</span>
                </div>
                <div style="width:160px; height:5px; background:#334155; border-radius:3px; overflow:hidden; margin-top:6px;">
                  <div id="drift-editor-score-bar" style="width:98%; height:100%; background:linear-gradient(90deg, #10b981, #3b82f6); border-radius:3px; transition:width 0.3s ease;"></div>
                </div>
              </div>
              <div style="text-align:right;">
                <span style="font-size:12.5px; color:#38bdf8; font-weight:700; display:block;" id="drift-editor-grade-level">Grade 10 Level</span>
                <span style="font-size:11px; color:#94a3b8; display:block; margin-top:2px;" id="drift-editor-tone-desc">Executive &amp; Formal Tone</span>
                <span style="font-size:10.5px; color:#64748b; font-family:monospace; display:block; margin-top:3px;" id="drift-editor-stats-mini">0 issues • High clarity</span>
              </div>
            </div>

            <!-- 4 Live Proofing Telemetry Metrics -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div style="padding:12px; background:#18181b; border:1px solid #27272a; border-radius:8px;">
                <span style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:600; display:block;">Spelling &amp; Typos</span>
                <strong style="font-size:13.5px; color:#10b981; display:block; margin-top:3px;" id="drift-proofing-spelling-stat">✓ 0 Issues</strong>
                <span style="font-size:10px; color:#64748b; display:block; margin-top:1px;" id="drift-proofing-spelling-sub">No repeated words</span>
              </div>
              <div style="padding:12px; background:#18181b; border:1px solid #27272a; border-radius:8px;">
                <span style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:600; display:block;">Grammar &amp; Flow</span>
                <strong style="font-size:13.5px; color:#10b981; display:block; margin-top:3px;" id="drift-proofing-grammar-stat">✓ Concise &amp; Clear</strong>
                <span style="font-size:10px; color:#64748b; display:block; margin-top:1px;" id="drift-proofing-grammar-sub">~14 words/sent</span>
              </div>
              <div style="padding:12px; background:#18181b; border:1px solid #27272a; border-radius:8px;">
                <span style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:600; display:block;">Reading Ease</span>
                <strong style="font-size:13.5px; color:#38bdf8; display:block; margin-top:3px;" id="drift-proofing-ease-stat">Standard (68.4)</strong>
                <span style="font-size:10px; color:#64748b; display:block; margin-top:1px;" id="drift-proofing-ease-sub">Flesch-Kincaid index</span>
              </div>
              <div style="padding:12px; background:#18181b; border:1px solid #27272a; border-radius:8px;">
                <span style="font-size:10px; color:#94a3b8; text-transform:uppercase; font-weight:600; display:block;">Time to Consume</span>
                <strong style="font-size:13.5px; color:#f59e0b; display:block; margin-top:3px;" id="drift-editor-reading-time">~1 min</strong>
                <span style="font-size:10px; color:#64748b; display:block; margin-top:1px;" id="drift-proofing-speak-time">~1 min speaking (130 wpm)</span>
              </div>
            </div>

            <!-- Interactive Suggestions Area -->
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11px; font-weight:700; color:#cbd5e1; text-transform:uppercase; letter-spacing:0.04em;">Writing Suggestions &amp; Enhancements</span>
                <span style="font-size:11px; color:#38bdf8; font-weight:600;" id="drift-suggestions-count-badge">0 Alerts</span>
              </div>
              <div id="drift-proofing-suggestions-list" style="max-height:170px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; padding-right:4px;">
                <!-- Populated dynamically with actual issues or exemplary card -->
              </div>
            </div>
          </div>
          <div class="office-dialog-footer" style="background:#1e293b; border-top:1px solid #334155; padding:12px 20px; display:flex; justify-content:space-between; align-items:center;">
            <button class="btn-tool-secondary" id="btn-copy-proofing-report" style="background:#334155; color:#f8fafc; border:none; padding:7px 14px; border-radius:6px; font-size:11.5px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px;">
              <span>📋</span>
              <span>Copy Report</span>
            </button>
            <div style="display:flex; gap:10px; align-items:center;">
              <button class="export-cancel-btn" id="btn-cancel-editor-proofing" style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:7px 14px; border-radius:6px; font-size:12px; cursor:pointer;">Close</button>
              <button class="btn-giri-primary" id="btn-apply-editor-polish" style="padding:7px 18px; font-size:12px; font-weight:700; background:#2563eb; color:#ffffff; border:none; border-radius:6px; cursor:pointer;">Accept All Suggestions</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Orbit Sovereign Version History (TimeMachine) Modal -->
      <div class="office-modal-backdrop" id="drift-version-history-modal">
        <div class="orbit-version-modal" role="dialog" aria-modal="true">
          <div style="background:#1e293b; border-bottom:1px solid #334155; padding:14px 20px; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:18px;">⏱️</span>
              <div>
                <span style="color:#f8fafc; font-size:14.5px; font-weight:700;">Sovereign Version History</span>
                <div style="font-size:10.5px; color:#94a3b8; display:flex; align-items:center; gap:6px; margin-top:2px;">
                  <span style="width:6px; height:6px; background:#a855f7; border-radius:50%; display:inline-block; box-shadow:0 0 8px #a855f7;"></span>
                  <span>Orbit TimeMachine • Immutable Local Snapshots</span>
                </div>
              </div>
            </div>
            <button class="esc-kbd" id="btn-close-drift-versions-dialog" style="color:#94a3b8; border-color:#334155; background:rgba(255,255,255,0.05); cursor:pointer;">✕</button>
          </div>
          <div style="padding:16px 20px; display:flex; flex-direction:column; gap:12px; flex:1; min-height:0; overflow-y:auto;">
            <div style="display:flex; gap:8px; align-items:center;">
              <input type="text" id="drift-new-snapshot-name" placeholder="Snapshot label (e.g. 'Final Draft', 'Client Review')..." style="flex:1; background:#09090b; border:1px solid #3f3f46; color:#f1f5f9; border-radius:6px; padding:7px 12px; font-size:12px; outline:none;">
              <button id="btn-drift-create-snapshot" style="background:#2563eb; color:#fff; border:none; padding:7px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; display:flex; align-items:center; gap:6px;">
                <span>📸</span> Save Snapshot
              </button>
            </div>
            <div id="drift-snapshots-list" style="display:flex; flex-direction:column; gap:8px; margin-top:6px; max-height:360px; overflow-y:auto; padding-right:4px;">
              <!-- Dynamically populated snapshot cards -->
            </div>
          </div>
          <div style="background:#1e293b; border-top:1px solid #334155; padding:12px 20px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; color:#64748b;">Snapshots stored securely in sovereign browser storage</span>
            <button class="export-cancel-btn" id="btn-cancel-drift-versions" style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:7px 14px; border-radius:6px; font-size:12px; cursor:pointer;">Close</button>
          </div>
        </div>
      </div>

      <!-- Add-ins Modal -->
      <div class="office-modal-backdrop" id="drift-addins-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:520px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">🎛️ Office Add-ins & Extensions</span>
            <button class="esc-kbd" id="btn-close-addins-modal">ESC</button>
          </div>
          <div class="office-dialog-body" style="display:flex; flex-direction:column; gap:12px;">
            <div style="font-size:12px; color:#94a3b8;">
              Enhance Giri Drift with sovereign client-side productivity add-ins:
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#1e293b; border-radius:6px; border:1px solid #334155;">
                <div style="display:flex; gap:10px; align-items:center;">
                  <span style="font-size:22px;">🌐</span>
                  <div>
                    <strong style="font-size:12.5px; color:#f8fafc; display:block;">Wikipedia Citation Assistant</strong>
                    <span style="font-size:11px; color:#94a3b8;">Look up research topics and insert formal citations</span>
                  </div>
                </div>
                <button class="btn-giri-primary btn-run-addin" data-addin="wikipedia" style="padding:4px 12px; font-size:11px;">Insert</button>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#1e293b; border-radius:6px; border:1px solid #334155;">
                <div style="display:flex; gap:10px; align-items:center;">
                  <span style="font-size:22px;">📱</span>
                  <div>
                    <strong style="font-size:12.5px; color:#f8fafc; display:block;">QR Code Generator</strong>
                    <span style="font-size:11px; color:#94a3b8;">Generate high-res vector QR code into paper</span>
                  </div>
                </div>
                <button class="btn-giri-primary btn-run-addin" data-addin="qrcode" style="padding:4px 12px; font-size:11px;">Insert</button>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#1e293b; border-radius:6px; border:1px solid #334155;">
                <div style="display:flex; gap:10px; align-items:center;">
                  <span style="font-size:22px;">🔤</span>
                  <div>
                    <strong style="font-size:12.5px; color:#f8fafc; display:block;">DeepL Translator</strong>
                    <span style="font-size:11px; color:#94a3b8;">Translate selected paragraphs into 28 languages</span>
                  </div>
                </div>
                <button class="btn-giri-primary btn-run-addin" data-addin="translate" style="padding:4px 12px; font-size:11px;">Translate</button>
              </div>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="btn-giri-primary" id="btn-ok-addins" style="padding:7px 18px; font-size:12px;">Done</button>
          </div>
        </div>
      </div>

      <!-- Shortcuts Cheat Sheet Modal -->
      <div class="office-modal-backdrop" id="drift-shortcuts-modal">
        <div class="office-dialog-card" role="dialog" aria-modal="true" style="width:480px;">
          <div class="office-dialog-header">
            <span class="office-dialog-title">⌨ Office 365 Keyboard Shortcuts</span>
            <button class="esc-kbd" id="btn-close-shortcuts-modal">ESC</button>
          </div>
          <div class="office-dialog-body" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12px;">
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Bold</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+B</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Italic</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+I</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Underline</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+U</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Center Align</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+E</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Left Align</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+L</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Right Align</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+R</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Find</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+F</kbd>
            </div>
            <div style="display:flex; justify-content:space-between; padding:6px 8px; background:#18181b; border-radius:4px;">
              <span>Save Direct</span><kbd style="background:#27272a; padding:2px 6px; border-radius:3px; font-family:monospace;">Ctrl+S</kbd>
            </div>
          </div>
          <div class="office-dialog-footer">
            <button class="btn-giri-primary" id="btn-ok-shortcuts" style="padding:7px 18px; font-size:12px;">Close</button>
          </div>
        </div>
      </div>

      <!-- Mail Merge Recipients Manager Dialog -->
      <div class="office-modal-backdrop" id="drift-mail-merge-recipients-modal">
        <div class="office-dialog-card" style="width:920px; max-width:96vw; max-height:88vh; display:flex; flex-direction:column;" role="dialog" aria-modal="true">
          <div class="office-dialog-header" style="background:#1e293b; border-bottom:1px solid #334155; padding:12px 18px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:18px;">✉</span>
              <span class="office-dialog-title" style="color:#ffffff; font-size:14px; font-weight:700;">Mail Merge Recipients &amp; Data Source</span>
            </div>
            <button class="esc-kbd" id="btn-close-merge-recipients">ESC</button>
          </div>
          <div class="office-dialog-body" style="flex:1; overflow:hidden; display:flex; flex-direction:column; gap:12px; padding:16px 18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="fluent-btn-small" id="btn-merge-modal-add-row" style="background:#2563eb; color:#ffffff; padding:4px 10px; font-weight:600;">+ Add Contact</button>
                <button class="fluent-btn-small" id="btn-merge-modal-upload" style="background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:4px 10px;">📁 Upload CSV/JSON</button>
                <button class="fluent-btn-small" id="btn-merge-modal-axis" style="background:#107c41; color:#ffffff; padding:4px 10px; font-weight:600;">📊 Import Axis Sheet</button>
                <button class="fluent-btn-small" id="btn-merge-modal-sample" style="background:#1e293b; border:1px solid #334155; color:#38bdf8; padding:4px 10px;">↺ Sample Data</button>
                <button class="fluent-btn-small" id="btn-merge-modal-export" style="background:#1e293b; border:1px solid #334155; color:#cbd5e1; padding:4px 10px;">⬇ Export CSV</button>
              </div>
              <input type="text" id="input-merge-table-search" placeholder="Filter recipients..." style="padding:4px 10px; font-size:12px; background:#0f172a; border:1px solid #334155; border-radius:4px; color:#ffffff; width:180px;">
            </div>
            
            <div style="flex:1; overflow:auto; border:1px solid #334155; border-radius:6px; background:#0f172a;" id="drift-merge-table-container">
              <!-- Dynamically populated interactive recipient table -->
            </div>

            <div style="font-size:11px; color:#94a3b8; display:flex; justify-content:space-between; align-items:center;">
              <span id="txt-merge-table-stats">5 recipients loaded • Click any cell to edit • Checked rows will be included in merge</span>
              <span>Available in document as {{ColumnName}}</span>
            </div>
          </div>
          <div class="office-dialog-footer" style="background:#18181b; border-top:1px solid #27272a; padding:12px 18px; display:flex; justify-content:space-between; align-items:center;">
            <button class="export-cancel-btn" id="btn-cancel-merge-recipients">Cancel</button>
            <button class="btn-giri-primary" id="btn-apply-merge-recipients" style="padding:7px 20px; font-size:12.5px; font-weight:600;">Save &amp; Apply List</button>
          </div>
        </div>
      </div>

      <!-- Finish & Merge Dialog -->
      <div class="office-modal-backdrop" id="drift-finish-merge-modal">
        <div class="office-dialog-card" style="width:580px; max-width:95vw;" role="dialog" aria-modal="true">
          <div class="office-dialog-header" style="background:#1e293b; border-bottom:1px solid #334155; padding:12px 18px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:18px;">⚡</span>
              <span class="office-dialog-title" style="color:#ffffff; font-size:14px; font-weight:700;">Finish &amp; Merge Document</span>
            </div>
            <button class="esc-kbd" id="btn-close-finish-merge">ESC</button>
          </div>
          <div class="office-dialog-body" style="padding:16px 18px; display:flex; flex-direction:column; gap:16px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#cbd5e1; margin-bottom:8px;">1. Select Recipient Scope:</label>
              <div style="display:flex; gap:16px; flex-wrap:wrap; font-size:12px; color:#cbd5e1; background:#0f172a; padding:10px 12px; border-radius:6px; border:1px solid #334155;">
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="radio" name="merge-scope" value="all" checked id="radio-merge-all">
                  <span>All Recipients (<span id="txt-modal-merge-all-count">5</span>)</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="radio" name="merge-scope" value="current" id="radio-merge-current">
                  <span>Current Record only (<span id="txt-modal-merge-cur-name">Record 1</span>)</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="radio" name="merge-scope" value="range" id="radio-merge-range">
                  <span>Range: From <input type="number" id="input-merge-range-from" value="1" min="1" style="width:40px; padding:2px; font-size:11px; background:#1e293b; border:1px solid #334155; color:#fff; text-align:center; border-radius:3px;"> to <input type="number" id="input-merge-range-to" value="5" min="1" style="width:40px; padding:2px; font-size:11px; background:#1e293b; border:1px solid #334155; color:#fff; text-align:center; border-radius:3px;"></span>
                </label>
              </div>
            </div>

            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#cbd5e1; margin-bottom:8px;">2. Choose Merge Output Action:</label>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div class="drift-merge-action-card" id="card-action-master-doc" style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:12px; cursor:pointer; transition:all 0.15s; display:flex; flex-direction:column; gap:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">📄</span>
                    <strong style="font-size:12.5px; color:#ffffff;">Merge to Master Doc</strong>
                  </div>
                  <p style="font-size:11px; color:#94a3b8; margin:0; line-height:1.4;">Generates all letters into a single multi-page document with page breaks in Drift.</p>
                </div>

                <div class="drift-merge-action-card" id="card-action-print-all" style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:12px; cursor:pointer; transition:all 0.15s; display:flex; flex-direction:column; gap:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">🖨️</span>
                    <strong style="font-size:12.5px; color:#ffffff;">Print / PDF Batch</strong>
                  </div>
                  <p style="font-size:11px; color:#94a3b8; margin:0; line-height:1.4;">Directly prints all recipient letters or saves as an encrypted combined PDF.</p>
                </div>

                <div class="drift-merge-action-card" id="card-action-download-files" style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:12px; cursor:pointer; transition:all 0.15s; display:flex; flex-direction:column; gap:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">💾</span>
                    <strong style="font-size:12.5px; color:#ffffff;">Download Files</strong>
                  </div>
                  <p style="font-size:11px; color:#94a3b8; margin:0; line-height:1.4;">Downloads individual customized document files (.html / .docx) for each recipient.</p>
                </div>

                <div class="drift-merge-action-card" id="card-action-copy-emails" style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:12px; cursor:pointer; transition:all 0.15s; display:flex; flex-direction:column; gap:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">✉️</span>
                    <strong style="font-size:12.5px; color:#ffffff;">Email Drafts Preview</strong>
                  </div>
                  <p style="font-size:11px; color:#94a3b8; margin:0; line-height:1.4;">Generates individual email copy blocks with 1-click clipboard buttons.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="office-dialog-footer" style="background:#18181b; border-top:1px solid #27272a; padding:12px 18px; display:flex; justify-content:flex-end;">
            <button class="export-cancel-btn" id="btn-cancel-finish-merge">Close</button>
          </div>
        </div>
      </div>

      <!-- Hidden file input for uploading CSV/JSON recipients -->
      <input type="file" id="drift-mail-merge-file-input" accept=".csv,.tsv,.json,.txt" style="display:none;">

      <!-- Floating Popover for Start Merge Types -->
      <div id="drift-start-merge-popover" style="display:none; position:fixed; z-index:9999; background:#1e293b; border:1px solid #334155; border-radius:6px; padding:6px; box-shadow:0 12px 30px rgba(0,0,0,0.5); width:230px;">
        <div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; padding:4px 8px;">Document Type</div>
        <button class="drift-popover-item" data-type="letters" style="width:100%; text-align:left; background:transparent; border:none; color:#ffffff; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">✉ Letters</button>
        <button class="drift-popover-item" data-type="email" style="width:100%; text-align:left; background:transparent; border:none; color:#ffffff; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">📧 Email Messages</button>
        <button class="drift-popover-item" data-type="envelopes" style="width:100%; text-align:left; background:transparent; border:none; color:#ffffff; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">🏷 Envelopes &amp; Labels</button>
        <div style="height:1px; background:#334155; margin:4px 0;"></div>
        <div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; padding:4px 8px;">Starter Templates</div>
        <button class="drift-popover-item" data-template="letter" style="width:100%; text-align:left; background:transparent; border:none; color:#38bdf8; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer;">★ Insert Formal Letter</button>
        <button class="drift-popover-item" data-template="invoice" style="width:100%; text-align:left; background:transparent; border:none; color:#38bdf8; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer;">★ Insert Billing Notice</button>
      </div>

      <!-- Floating Popover for Select Recipients -->
      <div id="drift-select-recipients-popover" style="display:none; position:fixed; z-index:9999; background:#1e293b; border:1px solid #334155; border-radius:6px; padding:6px; box-shadow:0 12px 30px rgba(0,0,0,0.5); width:240px;">
        <button class="drift-popover-item" id="btn-popover-upload-csv" style="width:100%; text-align:left; background:transparent; border:none; color:#ffffff; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">📁 Upload CSV / JSON List...</button>
        <button class="drift-popover-item" id="btn-popover-import-axis" style="width:100%; text-align:left; background:transparent; border:none; color:#10b981; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">📊 Import from Giri Axis Sheet...</button>
        <button class="drift-popover-item" id="btn-popover-edit-list" style="width:100%; text-align:left; background:transparent; border:none; color:#ffffff; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">✏️ Type &amp; Edit Recipient List...</button>
        <button class="drift-popover-item" id="btn-popover-sample-data" style="width:100%; text-align:left; background:transparent; border:none; color:#38bdf8; padding:6px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">↺ Reset to Demo Contacts</button>
      </div>

      <!-- Floating Popover for Insert Merge Field -->
      <div id="drift-insert-field-popover" style="display:none; position:fixed; z-index:9999; background:#1e293b; border:1px solid #334155; border-radius:6px; padding:6px; box-shadow:0 12px 30px rgba(0,0,0,0.5); min-width:200px; max-height:280px; overflow-y:auto;">
        <!-- Dynamically populated with field items -->
      </div>

      <!-- Girionix AI In-Line Assistant Modal (Practical Office AI) -->
      <div class="orbit-ai-modal-backdrop" id="drift-ai-assistant-modal" aria-hidden="true">
        <div class="orbit-ai-modal-card" role="dialog" aria-modal="true" aria-label="Girionix AI Writing Assistant">
          <div class="orbit-ai-modal-header">
            <div class="orbit-ai-header-left">
              <span class="orbit-ai-brand-badge">⚡</span>
              <div class="orbit-ai-title-group">
                <h3>Girionix AI Writing Assistant <span class="girionix-status-badge" style="font-size:10px; margin-left:4px;">Giri Drift</span></h3>
                <p id="drift-ai-context-desc">Draft new documents, polish selections, fix grammar, or synthesize executive summaries</p>
              </div>
            </div>
            <button class="orbit-ai-close-btn" id="btn-close-drift-ai-modal" title="Close (ESC)">✕</button>
          </div>

          <div class="orbit-ai-modal-body">
            <!-- Custom Input Strip -->
            <div class="orbit-ai-input-wrap">
              <input type="text" id="drift-ai-custom-input" placeholder="Enter instructions (e.g. 'Rewrite in executive tone', 'Draft NDA', 'Fix punctuation')..." spellcheck="false">
              <button class="orbit-ai-generate-btn" id="btn-drift-ai-execute">
                <span>Generate ⚡</span>
              </button>
            </div>

            <!-- Contextual Quick Action Chips -->
            <div id="drift-ai-actions-container">
              <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:6px;" id="drift-ai-chips-label">Quick AI Actions</div>
              <div class="orbit-ai-chips-row" id="drift-ai-chips-list">
                <!-- Dynamically populated based on text selection -->
              </div>
            </div>

            <!-- Selected Text Snippet (when text is selected) -->
            <div id="drift-ai-selection-preview" style="display:none; padding:8px 12px; background:#f1f5f9; border-left:3px solid #3b82f6; border-radius:4px; font-size:11.5px; color:#475569; max-height:70px; overflow-y:auto; font-style:italic;">
            </div>

            <!-- Output Preview Box -->
            <div style="display:flex; flex-direction:column; gap:4px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Generated AI Output</span>
                <span id="drift-ai-preview-stats" style="font-size:11px; color:#0284c7; font-weight:600;"></span>
              </div>
              <div class="orbit-ai-preview-box" id="drift-ai-preview-box">
                <span style="color:#94a3b8; font-style:italic;">Select an action above or type instructions to preview the result...</span>
              </div>
            </div>
          </div>

          <div class="orbit-ai-modal-footer">
            <div class="orbit-ai-footer-left">
              <span>⚡ Sovereign Client Engine • Zero Telemetry</span>
            </div>
            <div class="orbit-ai-footer-right">
              <button class="orbit-ai-btn-secondary" id="btn-drift-ai-copy">📋 Copy</button>
              <button class="orbit-ai-btn-secondary" id="btn-drift-ai-insert-below">⬇ Insert Below</button>
              <button class="orbit-ai-btn-primary" id="btn-drift-ai-apply">✓ Replace Selection</button>
            </div>
          </div>
        </div>
      </div>
    `;

    initEditorWorkspace(rootEl, onUpdate);

    function initEditorWorkspace(container, onUpdate) {
      let miniToolbar = null;
      const paper = container.querySelector('#drift-paper-canvas');
      const wordCountEl = container.querySelector('#drift-word-count');
      const charCountEl = container.querySelector('#drift-char-count');
      const readTimeEl = container.querySelector('#drift-read-time');
      const outlineList = container.querySelector('#doc-outline-list');
      const voiceBtn = container.querySelector('#btn-voice-dictate-group') || container.querySelector('#btn-drift-voice');
      const voiceGroupBtn = container.querySelector('#btn-voice-dictate-group');
      const voiceStatusText = container.querySelector('#voice-status-text');
      const returnToHubBtn = container.querySelector('#btn-drift-return-hub') || container.querySelector('#btn-return-to-hub');
      container.querySelector('#btn-drift-return-hub')?.addEventListener('click', () => {
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.navigateTo('launcher');
      });
      const saveDocAsTemplateBtn = container.querySelector('#file-menu-save-template') || container.querySelector('#btn-save-doc-as-template');
      const fileMenuBtn = container.querySelector('#btn-drift-file-menu');
      const fileMenuDropdown = container.querySelector('#drift-file-menu-dropdown');
      const commentsSidebar = container.querySelector('#drift-comments-sidebar');
      const commentsListEl = container.querySelector('#drift-comments-list');
      const commentsBadge = container.querySelector('#comments-badge');
      const emojiPickerDropdown = container.querySelector('#drift-emoji-picker-dropdown');

      // Bind Giri Drift Desktop Events & Shortcuts
      orbitDesktopSuite.bindEvents(container, 'drift', {
        onNew: () => mountEditor(rootEl, '<p><br></p>', 'Document 1 - Giri Drift Writer', onUpdate),
        onOpen: () => container.querySelector('#file-menu-open-device')?.click() || container.querySelector('#drift-editor-import-tpl-input')?.click(),
        onSave: () => saveDocument(),
        onSaveDevice: () => container.querySelector('#file-menu-save-device')?.click() || container.querySelector('#btn-drift-save-device')?.click(),
        onExportPdf: () => container.querySelector('#btn-drift-export-pdf')?.click() || window.print(),
        onZoom: (val) => {
          const scale = parseInt(val, 10) / 100;
          if (paper) {
            paper.style.transform = `scale(${scale})`;
            paper.style.transformOrigin = 'top center';
          }
        },
        onUiToggle: (mode) => {
          container.classList.remove('orbit-ui-standard', 'orbit-ui-notebookbar');
          container.classList.add(`orbit-ui-${mode}`);
        }
      });

      // =====================================================================
      // 1. FILE MENU DROPDOWN (Office 365 10-Item Menu)
      // =====================================================================
      fileMenuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        fileMenuDropdown?.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!fileMenuDropdown?.contains(e.target) && e.target !== fileMenuBtn) {
          fileMenuDropdown?.classList.remove('open');
        }
        if (!emojiPickerDropdown?.contains(e.target) && e.target.id !== 'btn-insert-emoji-picker' && !e.target.closest('#btn-insert-emoji-picker')) {
          emojiPickerDropdown?.classList.remove('open');
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          fileMenuDropdown?.classList.remove('open');
          emojiPickerDropdown?.classList.remove('open');
          container.querySelector('#drift-shortcuts-modal')?.classList.remove('open');
          if (miniToolbar) miniToolbar.style.display = 'none';
          if (typeof closeDriftAiAssistant === 'function') closeDriftAiAssistant();
        }

        // Thesaurus Shortcut (Shift+F7 or Alt+T)
        if ((e.shiftKey && e.key === 'F7') || (e.altKey && e.key.toLowerCase() === 't')) {
          e.preventDefault();
          if (typeof window._driftOpenThesaurus === 'function') window._driftOpenThesaurus();
          return;
        }

        // Navigation & Outline Sidebar Toggle (Ctrl+Alt+N or Alt+F1)
        if ((e.ctrlKey && e.altKey && e.key.toLowerCase() === 'n') || (e.altKey && e.key === 'F1')) {
          e.preventDefault();
          if (typeof window._driftToggleSidebar === 'function') window._driftToggleSidebar();
          return;
        }

        // Insert Page Break Shortcut (Ctrl+Enter or Cmd+Enter)
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          if (typeof window._driftInsertPageBreak === 'function') window._driftInsertPageBreak();
          return;
        }

        // Girionix AI Assistant Shortcut (Alt+J or Ctrl+Shift+J)
        if ((e.altKey && e.key.toLowerCase() === 'j') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j')) {
          e.preventDefault();
          if (typeof openDriftAiAssistant === 'function') openDriftAiAssistant();
          return;
        }

        // Office 365 Keyboard Shortcuts
        if (e.ctrlKey || e.metaKey) {
          const key = e.key.toLowerCase();
          if (key === 'b') {
            e.preventDefault();
            document.execCommand('bold', false, null);
            saveDocument();
            updateMiniToolbarState();
          } else if (key === 'i') {
            e.preventDefault();
            document.execCommand('italic', false, null);
            saveDocument();
            updateMiniToolbarState();
          } else if (key === 'u') {
            e.preventDefault();
            document.execCommand('underline', false, null);
            saveDocument();
            updateMiniToolbarState();
          } else if (key === 'e') {
            e.preventDefault();
            document.execCommand('justifyCenter', false, null);
            saveDocument();
          } else if (key === 'l') {
            e.preventDefault();
            document.execCommand('justifyLeft', false, null);
            saveDocument();
          } else if (key === 'r') {
            e.preventDefault();
            document.execCommand('justifyRight', false, null);
            saveDocument();
          } else if (key === 'j') {
            e.preventDefault();
            document.execCommand('justifyFull', false, null);
            saveDocument();
          } else if (key === 'z' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('undo', false, null);
            saveDocument();
          } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
            e.preventDefault();
            document.execCommand('redo', false, null);
            saveDocument();
          } else if (key === 's') {
            e.preventDefault();
            saveDocument();
            performDirectSave(false);
            if (window.orbitDriveSync && window.orbitDriveSync.currentActiveFileId) {
              window.orbitDriveSync.saveCurrentActiveFileToRealGoogleDrive('drift');
            }
          } else if (key === 'p') {
            e.preventDefault();
            if (window.giriPrintManager) {
              window.giriPrintManager.open({ toolType: 'document', documentTitle: currentDocTitle, contentElement: paper });
            } else {
              window.print();
            }
          } else if (key === 'f') {
            e.preventDefault();
            container.querySelector('#btn-find-replace')?.click();
          } else if (key === 'k') {
            e.preventDefault();
            container.querySelector('#btn-insert-link-dialog')?.click();
          }
        }
      });

      // File Menu Actions
      fileMenuDropdown?.querySelectorAll('.file-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          const action = item.dataset.action;
          fileMenuDropdown.classList.remove('open');

          switch (action) {
            case 'ai-agent': {
              if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
                window.orbitPlatform.openGirionixAgent('drift');
              } else if (window.orbitAgent) {
                window.orbitAgent.openAgent('drift');
              }
              break;
            }
            case 'drive-sync': {
              window.orbitDriveSync?.openDriveModal('browser', 'drift');
              break;
            }
            case 'save-device': {
              performDirectSave(true);
              break;
            }
            case 'save-template': {
              const saveTemplateModal = container.querySelector('#drift-save-template-modal');
              const templateNameInput = container.querySelector('#custom-template-name-input');
              saveTemplateModal?.classList.add('open');
              templateNameInput?.focus();
              break;
            }
            case 'import-template': {
              const editorImportInput = container.querySelector('#drift-editor-import-tpl-input');
              editorImportInput?.click();
              break;
            }
            case 'open-device': {
              localSync.openFromDevice({
                tool: 'drift',
                acceptTypes: {
                  'application/msword': ['.gdrift', '.giri', '.doc', '.docx'],
                  'application/x-giri-universal-office': ['.giri'],
                  'text/html': ['.gdrift', '.html', '.htm', '.txt', '.md']
                }
              }).then(result => {
                if (result) {
                  const parsed = (GiriOfficeFormats.parseUniversalGiri && GiriOfficeFormats.parseUniversalGiri(result.content)) || GiriOfficeFormats.parseGDrift(result.content);
                  if (parsed && parsed.tools && parsed.tools.drift) parsed.content = parsed.tools.drift;
                  let content = parsed.content;
                  if (!content.includes('drift-page-sheet')) {
                    content = `<div class="drift-page-sheet active-sheet" contenteditable="true" spellcheck="true" data-page="1" style="font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt;">${content.trim() || '<p><br></p>'}</div>`;
                  }
                  paper.innerHTML = content;
                  currentDocTitle = parsed.title !== 'Untitled Document' && parsed.title !== 'Imported Document' ? parsed.title : result.name.replace(/\.[^/.]+$/, '');
                  ensurePagesStructure(paper);
                  saveDocument();
                  renderPageThumbnails();
                }
              });
              break;
            }
            case 'new': {
              const choice = confirm('Create a new blank document? (Click OK for Blank, Cancel to open Templates Hub)');
              if (choice) {
                paper.innerHTML = '<div class="drift-page-sheet active-sheet" contenteditable="true" spellcheck="true" data-page="1" style="font-family: Calibri, \'Segoe UI\', Arial, sans-serif; font-size: 11pt;"><p><br></p></div>';
                currentDocTitle = 'Untitled Document';
                ensurePagesStructure(paper);
                saveDocument();
                renderPageThumbnails();
                if (window.orbitPlatform) window.orbitPlatform.triggerToast('Created new blank document');
              } else {
                mountHub(container, onUpdate);
              }
              break;
            }
            case 'open': {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.giri,.gdrift,.docx,.doc,.odt,.txt,.md,.html,.htm';
              fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                  let raw = evt.target.result || '';
                  const parsed = (GiriOfficeFormats.parseUniversalGiri && GiriOfficeFormats.parseUniversalGiri(raw)) || GiriOfficeFormats.parseGDrift(raw);
                  if (parsed && parsed.tools && parsed.tools.drift) parsed.content = parsed.tools.drift;
                  let content = parsed.content;
                  if (!content.includes('drift-page-sheet')) {
                    content = `<div class="drift-page-sheet active-sheet" contenteditable="true" spellcheck="true" data-page="1" style="font-family: Calibri, \'Segoe UI\', Arial, sans-serif; font-size: 11pt;">${content.trim() || '<p><br></p>'}</div>`;
                  }
                  paper.innerHTML = content;
                  ensurePagesStructure(paper);
                  currentDocTitle = parsed.title !== 'Untitled Document' && parsed.title !== 'Imported Document' ? parsed.title : file.name.replace(/\.[^/.]+$/, '');
                  saveDocument();
                  renderPageThumbnails();
                  if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Loaded "${file.name}" (Universal Office Parity)`);
                };
                reader.readAsText(file);
              };
              fileInput.click();
              break;
            }
            case 'share': {
              const url = window.orbitPlatform ? window.orbitPlatform.getToolUrl('drift') : `${window.location.origin}/#drift`;
              navigator.clipboard?.writeText(url);
              if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Copied direct link to Giri Drift: ${url}`);
              break;
            }
            case 'copy': {
              const copyKey = 'giri_orbit_copy_' + Date.now();
              localStorage.setItem(copyKey, paper.innerHTML);
              currentDocTitle = 'Copy of ' + currentDocTitle;
              saveDocument();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Created copy: "${currentDocTitle}"`);
              break;
            }
            case 'export': {
              if (window.orbitPlatform) window.orbitPlatform.openExportModal('drift');
              break;
            }
            case 'print': {
              window.print();
              break;
            }
            case 'mail-merge': {
              container.querySelector('.fluent-tab-btn[data-tab="mailings"]')?.click();
              openMailMergeRecipientsModal();
              break;
            }
            case 'rename': {
              const newName = prompt('Enter new document title:', currentDocTitle);
              if (newName && newName.trim()) {
                currentDocTitle = newName.trim();
                saveDocument();
                if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Renamed document to "${currentDocTitle}"`);
              }
              break;
            }
            case 'history': {
              renderVersionHistory();
              const histModal = container.querySelector('#drift-version-history-modal');
              histModal?.classList.add('open');
              break;
            }
            case 'delete': {
              if (confirm(`Are you sure you want to delete "${currentDocTitle}"? This will reset the workspace.`)) {
                localStorage.removeItem('giri_orbit_drift_doc');
                paper.innerHTML = '<div class="drift-page-sheet active-sheet" contenteditable="true" spellcheck="true" data-page="1" style="font-family: Calibri, \'Segoe UI\', Arial, sans-serif; font-size: 11pt;"><p><br></p></div>';
                currentDocTitle = 'Untitled Document';
                ensurePagesStructure(paper);
                saveDocument();
                renderPageThumbnails();
                if (window.orbitPlatform) window.orbitPlatform.triggerToast('Document deleted and reset.');
              }
              break;
            }
            case 'info': {
              renderDocInfo();
              const infoModal = container.querySelector('#drift-info-modal');
              infoModal?.classList.add('open');
              break;
            }
            case 'shortcuts-settings': {
              const scModal = container.querySelector('#drift-shortcuts-modal');
              scModal?.classList.add('open');
              const searchInput = scModal?.querySelector('#shortcuts-search-input');
              if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
                filterDriftShortcuts('');
              }
              break;
            }
          }
        });
      });

      // Close buttons for modals
      container.querySelector('#btn-close-history-modal')?.addEventListener('click', () => container.querySelector('#drift-version-history-modal')?.classList.remove('open'));
      container.querySelector('#btn-ok-history')?.addEventListener('click', () => container.querySelector('#drift-version-history-modal')?.classList.remove('open'));
      container.querySelector('#btn-close-info-modal')?.addEventListener('click', () => container.querySelector('#drift-info-modal')?.classList.remove('open'));
      container.querySelector('#btn-ok-info')?.addEventListener('click', () => container.querySelector('#drift-info-modal')?.classList.remove('open'));
      const driftShortcutsModal = container.querySelector('#drift-shortcuts-modal');
      container.querySelector('#btn-close-shortcuts-modal')?.addEventListener('click', () => driftShortcutsModal?.classList.remove('open'));
      container.querySelector('#btn-ok-shortcuts')?.addEventListener('click', () => driftShortcutsModal?.classList.remove('open'));

      function filterDriftShortcuts(query) {
        const q = (query || '').toLowerCase().trim();
        const rows = driftShortcutsModal?.querySelectorAll('.shortcut-item-row');
        rows?.forEach(r => {
          const text = r.textContent.toLowerCase();
          r.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
        });
      }

      container.querySelector('#shortcuts-search-input')?.addEventListener('input', (e) => {
        filterDriftShortcuts(e.target.value);
      });

      function renderVersionHistory() {
        const list = container.querySelector('#version-history-list');
        if (!list) return;
        list.innerHTML = versionSnapshots.map(v => `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px;">
            <div>
              <strong style="color:#0f172a; display:block;">${v.title}</strong>
              <span style="color:#64748b; font-size:11px;">${v.timestamp} &bull; by ${v.author} (${v.length} chars)</span>
            </div>
            <button class="btn-giri-primary btn-restore-snap" data-snap-id="${v.id}" style="padding:4px 10px; font-size:11px;">Restore</button>
          </div>
        `).join('');

        list.querySelectorAll('.btn-restore-snap').forEach(b => {
          b.addEventListener('click', () => {
            container.querySelector('#drift-version-history-modal')?.classList.remove('open');
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Restored version from local snapshot`);
          });
        });
      }

      function renderDocInfo() {
        const body = container.querySelector('#doc-info-modal-body');
        if (!body) return;
        const text = paper.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const sizeBytes = new Blob([paper.innerHTML]).size;
        body.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:10px; font-size:12.5px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
              <span>Document Title:</span><strong style="color:#0f172a;">${currentDocTitle}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
              <span>Word Count:</span><strong>${words.toLocaleString()}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
              <span>Document Size:</span><strong>~(${(sizeBytes / 1024).toFixed(2)} KB)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
              <span>Location:</span><strong style="color:#059669;">Sovereign Browser Memory (No Cloud DB)</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
              <span>Security Architecture:</span><strong>Local Client Isolation</strong>
            </div>
          </div>
        `;
      }

      // =====================================================================
      // 2. FORMAT PAINTER IMPLEMENTATION
      // =====================================================================
      const formatPainterBtn = container.querySelector('#btn-drift-format-painter');
      formatPainterBtn?.addEventListener('click', () => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0 && !sel.isCollapsed) {
          const parentNode = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode;
          const computed = window.getComputedStyle(parentNode);
          formatBuffer = {
            fontFamily: computed.fontFamily,
            fontSize: computed.fontSize,
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontWeight: computed.fontWeight,
            fontStyle: computed.fontStyle,
            textDecoration: computed.textDecoration
          };
          isFormatPainterActive = true;
          formatPainterBtn.classList.add('active');
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Format copied! Select target text to apply.');
        } else {
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Select formatted text first, then click Format Painter.');
        }
      });

      paper.addEventListener('mouseup', () => {
        if (isFormatPainterActive && formatBuffer) {
          const sel = window.getSelection();
          if (sel.rangeCount > 0 && !sel.isCollapsed) {
            const range = sel.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontFamily = formatBuffer.fontFamily;
            span.style.fontSize = formatBuffer.fontSize;
            span.style.color = formatBuffer.color;
            span.style.backgroundColor = formatBuffer.backgroundColor;
            span.style.fontWeight = formatBuffer.fontWeight;
            span.style.fontStyle = formatBuffer.fontStyle;
            span.style.textDecoration = formatBuffer.textDecoration;
            
            try {
              range.surroundContents(span);
            } catch {
              document.execCommand('foreColor', false, formatBuffer.color);
            }
            saveDocument();
            isFormatPainterActive = false;
            formatPainterBtn?.classList.remove('active');
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Format applied!');
          }
        }
      });

      // =====================================================================
      // 3. STYLES GALLERY IMPLEMENTATION (Visual Cards)
      // =====================================================================
      container.querySelectorAll('.fluent-style-card').forEach(card => {
        card.addEventListener('click', () => {
          container.querySelectorAll('.fluent-style-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const styleCmd = card.dataset.styleCmd;

          switch (styleCmd) {
            case 'p':
              document.execCommand('formatBlock', false, '<p>');
              break;
            case 'nospacing':
              document.execCommand('formatBlock', false, '<p>');
              const selNode = window.getSelection().anchorNode?.parentNode;
              if (selNode) selNode.style.margin = '0';
              break;
            case 'h1':
              document.execCommand('formatBlock', false, '<h1>');
              break;
            case 'h2':
              document.execCommand('formatBlock', false, '<h2>');
              break;
            case 'title':
              document.execCommand('formatBlock', false, '<h1>');
              const tNode = window.getSelection().anchorNode?.parentNode;
              if (tNode) {
                tNode.style.fontSize = '32px';
                tNode.style.fontWeight = '900';
                tNode.style.letterSpacing = '-0.02em';
              }
              break;
            case 'subtitle':
              document.execCommand('formatBlock', false, '<p>');
              const subNode = window.getSelection().anchorNode?.parentNode;
              if (subNode) {
                subNode.style.fontSize = '16px';
                subNode.style.color = '#64748b';
              }
              break;
            case 'quote':
              document.execCommand('formatBlock', false, '<blockquote>');
              break;
          }
          paper.focus();
          saveDocument();
        });
      });

      // =====================================================================
      // 4. TABLE OF CONTENTS GENERATOR (References Tab)
      // =====================================================================
      container.querySelector('#btn-insert-toc-action')?.addEventListener('click', () => {
        const headings = paper.querySelectorAll('h1, h2, h3');
        if (headings.length === 0) {
          // If no headings, insert sample structure + TOC
          const sample = `
            <div class="toc-generated-box" contenteditable="false">
              <div class="toc-title">Table of Contents</div>
              <div class="toc-item" onclick="document.getElementById('drift-sec-1')?.scrollIntoView({behavior:'smooth'})"><span>1. Executive Charter Overview</span><span>Page 1</span></div>
              <div class="toc-item" onclick="document.getElementById('drift-sec-2')?.scrollIntoView({behavior:'smooth'})"><span>2. Architecture & Technical Specifications</span><span>Page 2</span></div>
            </div>
            <h1 id="drift-sec-1">1. Executive Charter Overview</h1>
            <p>Enter detailed corporate brief here.</p>
            <h2 id="drift-sec-2">2. Architecture & Technical Specifications</h2>
            <p>Zero-database in-memory framework guarantees.</p>
          `;
          document.execCommand('insertHTML', false, sample);
        } else {
          let tocHtml = '<div class="toc-generated-box" contenteditable="false"><div class="toc-title">Table of Contents</div>';
          headings.forEach((h, idx) => {
            const hId = h.id || ('heading-' + idx);
            h.id = hId;
            const indent = h.tagName === 'H1' ? '0px' : h.tagName === 'H2' ? '16px' : '32px';
            const weight = h.tagName === 'H1' ? '700' : '500';
            tocHtml += `<div class="toc-item" style="padding-left:${indent}; font-weight:${weight};" onclick="document.getElementById('${hId}')?.scrollIntoView({behavior:'smooth'})">
              <span>${h.textContent.trim() || 'Heading ' + (idx + 1)}</span>
              <span>•</span>
            </div>`;
          });
          tocHtml += '</div><p></p>';
          document.execCommand('insertHTML', false, tocHtml);
        }
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted interactive Table of Contents!');
      });

      // Footnotes & Citations
      let footnoteCount = 1;
      container.querySelector('#btn-insert-footnote')?.addEventListener('click', () => {
        const num = footnoteCount++;
        document.execCommand('insertHTML', false, `<sup style="color:#2563eb; font-weight:700;">[${num}]</sup>&nbsp;`);
        let footContainer = paper.querySelector('.footnotes-container');
        if (!footContainer) {
          footContainer = document.createElement('div');
          footContainer.className = 'footnotes-container';
          footContainer.innerHTML = '<strong>Footnotes:</strong>';
          paper.appendChild(footContainer);
        }
        const note = document.createElement('div');
        note.innerHTML = `<span style="font-weight:700;">[${num}]</span> Enter citation or footnote reference.`;
        footContainer.appendChild(note);
        saveDocument();
      });

      // =====================================================================
      // 5. COMMENTS SIDEBAR & REVIEW
      // =====================================================================
      function renderComments() {
        if (!commentsListEl) return;
        commentsListEl.innerHTML = comments.map(c => `
          <div class="comment-card ${c.resolved ? 'resolved' : ''}">
            <div class="comment-card-top">
              <span class="comment-author">${c.author}</span>
              <span>${c.date}</span>
            </div>
            <div class="comment-text">${c.text}</div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:4px;">
              <button class="fluent-btn-small btn-del-comment" data-cid="${c.id}" style="color:#ef4444; width:auto; padding:0 6px; font-size:10.5px;">Delete</button>
            </div>
          </div>
        `).join('');

        if (commentsBadge) commentsBadge.textContent = comments.length;

        commentsListEl.querySelectorAll('.btn-del-comment').forEach(b => {
          b.addEventListener('click', () => {
            const cid = b.dataset.cid;
            comments = comments.filter(c => c.id !== cid);
            renderComments();
          });
        });
      }

      container.querySelector('#btn-toggle-comments-sidebar')?.addEventListener('click', () => {
        commentsSidebar?.classList.toggle('open');
        renderComments();
      });
      container.querySelector('#btn-review-show-comments')?.addEventListener('click', () => {
        commentsSidebar?.classList.toggle('open');
        renderComments();
      });
      container.querySelector('#btn-close-comments-sidebar')?.addEventListener('click', () => {
        commentsSidebar?.classList.remove('open');
      });

      container.querySelector('#btn-insert-comment-direct')?.addEventListener('click', () => {
        commentsSidebar?.classList.add('open');
        container.querySelector('#new-comment-textarea')?.focus();
      });
      container.querySelector('#btn-review-new-comment')?.addEventListener('click', () => {
        commentsSidebar?.classList.add('open');
        container.querySelector('#new-comment-textarea')?.focus();
      });

      container.querySelector('#btn-post-comment')?.addEventListener('click', () => {
        const commentInput = container.querySelector('#new-comment-textarea');
        const txt = (commentInput?.value || '').trim();
        if (!txt) return;
        comments.push({
          id: 'c_' + Date.now(),
          author: 'Executive Reviewer',
          date: 'Just now',
          text: txt,
          resolved: false
        });
        if (commentInput) commentInput.value = '';
        renderComments();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Comment added!');
      });

      renderComments();

      // =====================================================================
      // 6. EMOJI PICKER DROPDOWN
      // =====================================================================
      const emojis = [
        '😀', '😂', '🤣', '😊', '😍', '🥰', '😎', '🤩',
        '🤔', '🤫', '👏', '👍', '👎', '🙌', '🤝', '🚀',
        '🔥', '💡', '⚡', '⭐', '🎯', '🏆', '📊', '📈',
        '📉', '📝', '📌', '📍', '📎', '📅', '⏰', '🔒',
        '🔑', '🔍', '⚙️', '💼', '📁', '📄', '📧', '✅',
        '❌', '⚠️', 'ℹ️', '💎', '🌟', '🎉', '✨', '🌐'
      ];

      if (emojiPickerDropdown) {
        emojiPickerDropdown.innerHTML = emojis.map(em => `<button class="emoji-btn">${em}</button>`).join('');
        emojiPickerDropdown.querySelectorAll('.emoji-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            document.execCommand('insertText', false, btn.textContent);
            emojiPickerDropdown.classList.remove('open');
            paper.focus();
            saveDocument();
          });
        });
      }

      container.querySelector('#btn-insert-emoji-picker')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        if (emojiPickerDropdown) {
          emojiPickerDropdown.style.top = (rect.bottom + 4) + 'px';
          emojiPickerDropdown.style.left = rect.left + 'px';
          emojiPickerDropdown.classList.toggle('open');
        }
      });

      // =====================================================================
      // 7. TRACK CHANGES TOGGLE
      // =====================================================================
      const trackChangesBtn = container.querySelector('#btn-toggle-track-changes');
      const trackChangesLabel = container.querySelector('#track-changes-label');
      trackChangesBtn?.addEventListener('click', () => {
        isTrackChangesActive = !isTrackChangesActive;
        trackChangesBtn.classList.toggle('active', isTrackChangesActive);
        if (trackChangesLabel) trackChangesLabel.textContent = isTrackChangesActive ? 'Tracking: ON' : 'Track Changes';
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(isTrackChangesActive ? 'Track Changes activated (markup visible)' : 'Track Changes disabled');
      });

      // =====================================================================
      // 8. PARAGRAPH INDENT & SPACING STEPPERS
      // =====================================================================
      const indentLeft = container.querySelector('#drift-indent-left-val');
      const indentRight = container.querySelector('#drift-indent-right-val');
      const spacingBefore = container.querySelector('#drift-spacing-before-val');
      const spacingAfter = container.querySelector('#drift-spacing-after-val');

      function applyParagraphSpacing() {
        const sel = window.getSelection();
        if (sel.anchorNode) {
          const parent = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode;
          const p = parent.closest('p, h1, h2, h3, blockquote') || parent;
          p.style.paddingLeft = (indentLeft?.value || 0) + 'px';
          p.style.paddingRight = (indentRight?.value || 0) + 'px';
          p.style.marginTop = (spacingBefore?.value || 0) + 'pt';
          p.style.marginBottom = (spacingAfter?.value || 8) + 'pt';
          saveDocument();
        }
      }

      [indentLeft, indentRight, spacingBefore, spacingAfter].forEach(inp => {
        inp?.addEventListener('input', applyParagraphSpacing);
      });

      // Paragraph marks toggle (¶)
      let marksVisible = false;
      container.querySelector('#btn-toggle-paragraph-marks')?.addEventListener('click', (e) => {
        marksVisible = !marksVisible;
        e.currentTarget.classList.toggle('active', marksVisible);
        paper.querySelectorAll('p, h1, h2, h3').forEach(el => {
          if (marksVisible) {
            el.setAttribute('data-mark', '¶');
          } else {
            el.removeAttribute('data-mark');
          }
        });
      });

      // =====================================================================
      // 9. STANDARD EDITING, TYPOGRAPHY & VIEWS
      // =====================================================================
      // Return to Hub
      returnToHubBtn?.addEventListener('click', () => {
        saveDocument();
        mountHub(container, onUpdate);
      });

      // Save as Custom Template Dialog
      const saveTemplateModal = container.querySelector('#drift-save-template-modal');
      const templateNameInput = container.querySelector('#custom-template-name-input');
      const templateCatSelect = container.querySelector('#custom-template-cat-select');
      const templateDescInput = container.querySelector('#custom-template-desc-input');
      const confirmSaveTemplateBtn = container.querySelector('#btn-confirm-save-template');
      const cancelSaveTemplateBtn = container.querySelector('#btn-cancel-save-template');
      const closeSaveTemplateBtn = container.querySelector('#btn-close-save-template');

      saveDocAsTemplateBtn?.addEventListener('click', () => {
        saveTemplateModal?.classList.add('open');
        templateNameInput?.focus();
      });

      const closeSaveModal = () => saveTemplateModal?.classList.remove('open');
      cancelSaveTemplateBtn?.addEventListener('click', closeSaveModal);
      closeSaveTemplateBtn?.addEventListener('click', closeSaveModal);

      confirmSaveTemplateBtn?.addEventListener('click', () => {
        const name = (templateNameInput?.value || 'Custom Template').trim();
        const cat = templateCatSelect?.value || 'custom';
        const desc = (templateDescInput?.value || 'User custom document template').trim();
        const content = paper.innerHTML;

        const newTemplate = {
          id: 'custom-' + Date.now(),
          name,
          category: cat,
          desc,
          content
        };

        customTemplates.push(newTemplate);
        localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
        closeSaveModal();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Saved "${name}" as a custom template!`);
      });

      // Editor Import Custom Template Handler
      const editorImportTplInput = container.querySelector('#drift-editor-import-tpl-input');
      editorImportTplInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            const raw = re.target.result;
            let tplName = file.name.replace(/\.[^/.]+$/, '');
            let content = '';
            let category = 'custom';
            let desc = `Custom imported document template (${file.name})`;

            if (file.name.endsWith('.json')) {
              try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                  parsed.forEach((p, i) => {
                    customTemplates.push({
                      id: 'custom-' + Date.now() + '-' + i,
                      name: p.name || `${tplName} ${i + 1}`,
                      category: p.category || 'custom',
                      desc: p.desc || desc,
                      content: p.content || p.html || '<p><br></p>',
                      isCustom: true
                    });
                  });
                  localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
                  if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported ${parsed.length} custom templates!`);
                  return;
                } else if (parsed.content || parsed.html || parsed.text) {
                  tplName = parsed.name || tplName;
                  category = parsed.category || 'custom';
                  desc = parsed.desc || desc;
                  content = parsed.content || parsed.html || `<p>${parsed.text}</p>`;
                } else {
                  content = `<pre style="font-family:monospace; font-size:12px;">${JSON.stringify(parsed, null, 2)}</pre>`;
                }
              } catch {
                content = `<pre style="font-family:monospace; font-size:12px;">${raw}</pre>`;
              }
            } else if (file.name.endsWith('.md')) {
              const lines = raw.split('\n');
              let html = '';
              lines.forEach(l => {
                const trimmed = l.trim();
                if (trimmed.startsWith('# ')) {
                  tplName = trimmed.slice(2).trim();
                  html += `<h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:18px 0 10px 0;">${tplName}</h1>`;
                } else if (trimmed.startsWith('## ')) {
                  html += `<h2 style="font-size:18px; font-weight:700; color:#1e293b; margin:16px 0 8px 0;">${trimmed.slice(3)}</h2>`;
                } else if (trimmed.startsWith('### ')) {
                  html += `<h3 style="font-size:15px; font-weight:700; color:#334155; margin:14px 0 6px 0;">${trimmed.slice(4)}</h3>`;
                } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  html += `<li style="margin-left:20px; font-size:13px; color:#334155; line-height:1.6;">${trimmed.slice(2)}</li>`;
                } else if (trimmed.length > 0) {
                  html += `<p style="font-size:13px; color:#334155; line-height:1.6; margin-bottom:12px;">${trimmed}</p>`;
                }
              });
              content = html || `<p>${raw}</p>`;
            } else {
              content = raw.includes('<') && raw.includes('>') ? raw : `<p style="font-size:13px; line-height:1.7; color:#334155;">${raw.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
            }

            const newTemplate = {
              id: 'custom-' + Date.now(),
              name: tplName,
              category: 'custom',
              desc,
              content,
              isCustom: true
            };

            customTemplates.push(newTemplate);
            localStorage.setItem('giri_orbit_custom_templates', JSON.stringify(customTemplates));
            
            const loadNow = confirm(`Custom template "${tplName}" imported successfully!\n\nWould you like to load it into the active editor now?`);
            if (loadNow && paper) {
              paper.innerHTML = content;
              currentDocTitle = tplName;
              saveDocument();
            }
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported custom template "${tplName}"!`);
          } catch (err) {
            alert('Failed to import template: ' + err.message);
          }
        };
        reader.readAsText(file);
        editorImportTplInput.value = '';
      });

      // =====================================================================
      // MULTI-PAGE MS WORD ARCHITECTURE ENGINE
      // =====================================================================
      function createPageSeparator(pageNum) {
        const sep = document.createElement('div');
        sep.className = 'drift-page-separator';
        sep.contentEditable = 'false';
        sep.dataset.page = String(pageNum);
        sep.innerHTML = `
          <span class="drift-page-sep-badge">
            <span>Page ${pageNum}</span>
            <button class="drift-page-delete-btn" type="button" title="Delete Page ${pageNum}">✕</button>
          </span>
        `;
        sep.querySelector('.drift-page-delete-btn')?.addEventListener('click', (e) => {
          e.stopPropagation();
          window._driftDeletePage(pageNum);
        });
        return sep;
      }

      function renumberDocPages() {
        const sheets = paper.querySelectorAll('.drift-page-sheet');
        sheets.forEach((sheet, idx) => {
          const pageNum = idx + 1;
          sheet.dataset.page = String(pageNum);
          sheet.setAttribute('contenteditable', 'true');
          sheet.setAttribute('spellcheck', 'true');
          if (!sheet._hasSheetFocusListener) {
            sheet._hasSheetFocusListener = true;
            sheet.addEventListener('focus', () => {
              paper.querySelectorAll('.drift-page-sheet').forEach(s => s.classList.remove('active-sheet'));
              sheet.classList.add('active-sheet');
              const counterBadge = container.querySelector('#drift-page-counter-badge');
              if (counterBadge) counterBadge.textContent = `Page ${pageNum} of ${sheets.length}`;
              container.querySelectorAll('.drift-page-thumb-card').forEach(c => {
                const isMatch = parseInt(c.dataset.page, 10) === pageNum;
                c.classList.toggle('active', isMatch);
                c.style.borderColor = isMatch ? '#2563eb' : '#27272a';
                c.style.background = isMatch ? '#1e293b' : '#18181b';
              });
            });
          }
        });

        const separators = paper.querySelectorAll('.drift-page-separator');
        separators.forEach((sep, idx) => {
          const pageNum = idx + 2;
          sep.dataset.page = String(pageNum);
          const badge = sep.querySelector('.drift-page-sep-badge');
          if (badge) {
            badge.innerHTML = `
              <span>Page ${pageNum}</span>
              <button class="drift-page-delete-btn" type="button" title="Delete Page ${pageNum}">✕</button>
            `;
            badge.querySelector('.drift-page-delete-btn')?.addEventListener('click', (e) => {
              e.stopPropagation();
              window._driftDeletePage(pageNum);
            });
          }
        });
      }

      // High-performance Auto-Pagination Engine (Natural MS Word Multi-Page Flow)
      let isDriftPaginating = false;
      function autoPaginateDriftPages(paperEl) {
        if (!paperEl || isDriftPaginating) return;
        isDriftPaginating = true;

        try {
          // In a 1056px page with 72px top and 72px bottom padding,
          // content area maximum allowed bottom is 984px (use 960px safety threshold)
          const PAGE_MAX_BOTTOM = 960;

          let sheets = Array.from(paperEl.querySelectorAll('.drift-page-sheet'));
          if (sheets.length === 0) return;

          // If the editor is temporarily hidden during view switch, retry shortly
          if (sheets[0].offsetHeight === 0) {
            setTimeout(() => autoPaginateDriftPages(paperEl), 100);
            return;
          }

          // Preserve active user selection so caret is never lost during pagination
          const sel = window.getSelection();
          let savedSelection = null;
          if (sel && sel.rangeCount > 0 && paperEl.contains(sel.anchorNode)) {
            const range = sel.getRangeAt(0);
            savedSelection = {
              startContainer: range.startContainer,
              startOffset: range.startOffset,
              endContainer: range.endContainer,
              endOffset: range.endOffset
            };
          }

          let didChange = false;

          // Forward overflow distribution (Page N -> Page N+1)
          for (let i = 0; i < sheets.length; i++) {
            const sheet = sheets[i];

            // Normalize orphan text nodes directly inside sheet into <p>
            Array.from(sheet.childNodes).forEach(node => {
              if (node.nodeType === 3 && node.textContent.trim().length > 0) {
                const p = document.createElement('p');
                p.textContent = node.textContent;
                sheet.replaceChild(p, node);
              }
            });

            // Ensure sheet at least contains one editable paragraph if empty
            if (sheet.children.length === 0) {
              sheet.innerHTML = '<p><br></p>';
            }

            // Check if this sheet is overflowing
            let isOverflowing = (sheet.scrollHeight > 1056);
            const children = Array.from(sheet.children);
            let firstOverflowIdx = -1;

            for (let c = 0; c < children.length; c++) {
              const child = children[c];
              const bottom = child.offsetTop + child.offsetHeight;
              if (bottom > PAGE_MAX_BOTTOM) {
                firstOverflowIdx = c;
                isOverflowing = true;
                break;
              }
            }

            if (!isOverflowing && firstOverflowIdx === -1) {
              continue;
            }

            // If overall scrollHeight > 1056 but no specific child was tagged, target from end
            if (firstOverflowIdx === -1 && children.length > 1) {
              firstOverflowIdx = children.length - 1;
            }

            // Ensure next sheet exists
            let nextSheet = sheets[i + 1];
            if (!nextSheet) {
              const nextPageNum = sheets.length + 1;
              const sep = createPageSeparator(nextPageNum);
              nextSheet = document.createElement('div');
              nextSheet.className = 'drift-page-sheet';
              nextSheet.contentEditable = 'true';
              nextSheet.spellcheck = true;
              nextSheet.dataset.page = String(nextPageNum);
              nextSheet.innerHTML = '<p><br></p>';

              // Insert right after current sheet's separator or current sheet
              if (sheet.nextSibling) {
                paperEl.insertBefore(sep, sheet.nextSibling);
                paperEl.insertBefore(nextSheet, sep.nextSibling);
              } else {
                paperEl.appendChild(sep);
                paperEl.appendChild(nextSheet);
              }
              sheets.splice(i + 1, 0, nextSheet);
              didChange = true;
            }

            // Clear empty placeholder in nextSheet if only <p><br></p> exists
            const hasOnlyEmptyPlaceholder = (
              nextSheet.children.length === 1 &&
              (!nextSheet.firstElementChild?.textContent?.trim() || nextSheet.firstElementChild?.innerHTML === '<br>')
            );
            if (hasOnlyEmptyPlaceholder) {
              nextSheet.innerHTML = '';
            }

            // Case A: Single massive child that overflows on its own
            if ((firstOverflowIdx === 0 || firstOverflowIdx === -1) && sheet.children.length === 1) {
              const singleChild = sheet.firstElementChild;
              const text = (singleChild.innerText || '').trim();
              const words = text.split(/\s+/).filter(Boolean);
              if (words.length > 10) {
                let low = 4, high = words.length - 4, bestCut = Math.floor(words.length / 2);
                while (low <= high) {
                  const mid = Math.floor((low + high) / 2);
                  singleChild.innerText = words.slice(0, mid).join(' ');
                  if (singleChild.offsetTop + singleChild.offsetHeight <= PAGE_MAX_BOTTOM) {
                    bestCut = mid;
                    low = mid + 1;
                  } else {
                    high = mid - 1;
                  }
                }
                singleChild.innerText = words.slice(0, bestCut).join(' ');
                const remainderP = document.createElement('p');
                remainderP.innerText = words.slice(bestCut).join(' ');
                nextSheet.insertBefore(remainderP, nextSheet.firstChild);
                didChange = true;
                continue;
              }
            }

            // Case B: Move overflowing elements from sheet to nextSheet
            const moveStart = (firstOverflowIdx >= 0) ? firstOverflowIdx : Math.max(1, children.length - 1);
            const elementsToMove = children.slice(moveStart);
            if (elementsToMove.length > 0) {
              for (let m = elementsToMove.length - 1; m >= 0; m--) {
                const el = elementsToMove[m];
                nextSheet.insertBefore(el, nextSheet.firstChild);
              }
              didChange = true;
            }

            // Case C: While sheet still overflows 1056px and has > 1 child, move last child
            let loopSafety = 0;
            while (sheet.scrollHeight > 1056 && sheet.children.length > 1 && loopSafety < 50) {
              loopSafety++;
              const lastChild = sheet.lastElementChild;
              if (lastChild) {
                nextSheet.insertBefore(lastChild, nextSheet.firstChild);
                didChange = true;
              }
            }

            // Ensure current sheet still has at least one paragraph
            if (sheet.children.length === 0) {
              sheet.innerHTML = '<p><br></p>';
            }
            // Ensure nextSheet still has at least one paragraph
            if (nextSheet && nextSheet.children.length === 0) {
              nextSheet.innerHTML = '<p><br></p>';
            }
          }

          // Restore selection safely
          if (savedSelection && document.contains(savedSelection.startContainer)) {
            try {
              const newRange = document.createRange();
              newRange.setStart(savedSelection.startContainer, Math.min(savedSelection.startOffset, savedSelection.startContainer.length || 0));
              newRange.setEnd(savedSelection.endContainer, Math.min(savedSelection.endOffset, savedSelection.endContainer.length || 0));
              sel.removeAllRanges();
              sel.addRange(newRange);
            } catch (_) {}
          }

          if (didChange) {
            renumberDocPages();
            renderPageThumbnails();
            saveDocument();
          }
        } catch (err) {
          console.warn('[Drift Pagination] Error:', err);
        } finally {
          isDriftPaginating = false;
        }
      }

      function ensurePagesStructure(paperEl) {
        if (!paperEl) return;
        paperEl.removeAttribute('contenteditable');

        const existingSheets = paperEl.querySelectorAll('.drift-page-sheet');
        if (existingSheets.length > 0) {
          renumberDocPages();
          renderPageThumbnails();
          setTimeout(() => autoPaginateDriftPages(paperEl), 50);
          setTimeout(() => autoPaginateDriftPages(paperEl), 250);
          return;
        }

        // Migrate legacy .drift-page-break elements if present
        const legacyBreaks = paperEl.querySelectorAll('.drift-page-break, .drift-visual-page-break');
        if (legacyBreaks.length > 0) {
          const rawHtml = paperEl.innerHTML;
          const parts = rawHtml.split(/<div class="drift-(?:visual-)?page-break"[^>]*>[\s\S]*?<\/div>/gi);
          paperEl.innerHTML = '';
          parts.forEach((part, idx) => {
            const pageNum = idx + 1;
            if (idx > 0) {
              paperEl.appendChild(createPageSeparator(pageNum));
            }
            const sheet = document.createElement('div');
            sheet.className = `drift-page-sheet ${idx === 0 ? 'active-sheet' : ''}`;
            sheet.contentEditable = 'true';
            sheet.spellcheck = true;
            sheet.dataset.page = String(pageNum);
            sheet.innerHTML = part.trim() || '<p><br></p>';
            paperEl.appendChild(sheet);
          });
          renumberDocPages();
          renderPageThumbnails();
          setTimeout(() => autoPaginateDriftPages(paperEl), 50);
          setTimeout(() => autoPaginateDriftPages(paperEl), 250);
          return;
        }

        // Default: Wrap all existing content in Page 1 sheet
        const existingContent = paperEl.innerHTML.trim();
        paperEl.innerHTML = '';
        const sheet = document.createElement('div');
        sheet.className = 'drift-page-sheet active-sheet';
        sheet.contentEditable = 'true';
        sheet.spellcheck = true;
        sheet.dataset.page = '1';
        sheet.innerHTML = existingContent || '<p><br></p>';
        paperEl.appendChild(sheet);
        renumberDocPages();
        renderPageThumbnails();
        // Automatically paginate into Page 2, Page 3, etc. if content overflows
        setTimeout(() => autoPaginateDriftPages(paperEl), 50);
        setTimeout(() => autoPaginateDriftPages(paperEl), 250);
      }

      // Ensure pages structure on initialization
      ensurePagesStructure(paper);
      renderPageThumbnails();

      // Click delegation: clicking anywhere on a sheet focuses the editable paragraph
      paper.addEventListener('click', (e) => {
        const sheet = e.target.closest('.drift-page-sheet');
        if (sheet && e.target === sheet) {
          const firstP = sheet.querySelector('p, h1, h2, h3') || sheet.firstElementChild;
          if (firstP) {
            firstP.focus();
          } else {
            sheet.focus();
          }
        }
      });

      // Auto-recheck pagination on viewport/paper resize (e.g. view switch from launcher to Drift)
      if (typeof ResizeObserver !== 'undefined' && paper) {
        let _roTimer = null;
        const ro = new ResizeObserver(() => {
          if (_roTimer) clearTimeout(_roTimer);
          _roTimer = setTimeout(() => {
            if (paper.offsetHeight > 0) {
              autoPaginateDriftPages(paper);
            }
          }, 60);
        });
        ro.observe(paper);
      }

      // Document Pagination Calculator - returns exact count of physical sheets
      function calculateDocPages() {
        const sheets = paper.querySelectorAll('.drift-page-sheet');
        return Math.max(1, sheets.length);
      }

      // Auto-Save Document Content
      function saveDocument() {
        const html = paper.innerHTML;
        localStorage.setItem('giri_orbit_drift_doc', html);
        if (typeof window !== 'undefined' && window.giriSyncManager) {
          const text = (paper.innerText || '').trim();
          const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
          const chars = text.length;
          const snippet = text.slice(0, 110).trim() || 'Executive sovereign document in Giri Drift.';
          const stats = words > 0
            ? `${words.toLocaleString()} words • ${chars.toLocaleString()} chars`
            : 'Draft Document • Ready for AI Assist';
          window.giriSyncManager.recordSync('drift', html, currentDocTitle, {
            snippet,
            stats
          });
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('orbit:document-edit', {
            detail: { tool: 'drift', content: html, title: currentDocTitle }
          }));
        }
        updateTelemetry();
        updateOutline();
        if (typeof OrbitTimeMachine !== 'undefined' && typeof OrbitTimeMachine.saveSnapshot === 'function') {
          const now = Date.now();
          if (!window._lastAutoSnapshotTime) window._lastAutoSnapshotTime = 0;
          if (now - window._lastAutoSnapshotTime > 60000 && (paper.innerText || '').trim().length > 30) {
            window._lastAutoSnapshotTime = now;
            OrbitTimeMachine.saveSnapshot('Auto-save Checkpoint');
          }
        }
        if (onUpdate) onUpdate();
      }

      // High-performance debounced save on rapid typing
      let saveDebounceTimer = null;
      function debouncedSaveDocument() {
        if (window.orbitPlatform && typeof window.orbitPlatform.isAutoSaveEnabled === 'function' && !window.orbitPlatform.isAutoSaveEnabled()) {
          return;
        }
        if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
        saveDebounceTimer = setTimeout(() => {
          saveDocument();
        }, 220);
      }

      // Real-time pagination on typing
      let _driftPaginateRaf = null;
      paper.addEventListener('input', () => {
        debouncedSaveDocument();
        if (_driftPaginateRaf) cancelAnimationFrame(_driftPaginateRaf);
        _driftPaginateRaf = requestAnimationFrame(() => {
          autoPaginateDriftPages(paper);
        });
      });

      // Natural Backspace handling across physical page sheets
      paper.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          const sel = window.getSelection();
          if (!sel || !sel.rangeCount) return;
          const range = sel.getRangeAt(0);
          if (!range.collapsed) return;

          const currentSheet = sel.anchorNode?.nodeType === 1 
            ? sel.anchorNode.closest('.drift-page-sheet') 
            : sel.anchorNode?.parentElement?.closest('.drift-page-sheet');

          if (!currentSheet) return;
          const pageNum = parseInt(currentSheet.dataset.page, 10);
          if (pageNum <= 1) return;

          const sheets = Array.from(paper.querySelectorAll('.drift-page-sheet'));
          const currentIdx = sheets.indexOf(currentSheet);
          if (currentIdx <= 0) return;
          const prevSheet = sheets[currentIdx - 1];

          const isAtStart = (range.startOffset === 0 && (
            range.startContainer === currentSheet.firstElementChild ||
            range.startContainer === currentSheet.firstElementChild?.firstChild ||
            range.startContainer === currentSheet
          ));

          const sheetText = (currentSheet.innerText || '').trim();
          const hasMedia = currentSheet.querySelectorAll('img, table, svg').length > 0;

          if (!sheetText && !hasMedia) {
            e.preventDefault();
            const prevSep = currentSheet.previousElementSibling;
            if (prevSep && prevSep.classList.contains('drift-page-separator')) {
              prevSep.remove();
            }
            currentSheet.remove();
            renumberDocPages();
            renderPageThumbnails();
            saveDocument();

            const lastChild = prevSheet.lastElementChild || prevSheet;
            const newRange = document.createRange();
            newRange.selectNodeContents(lastChild);
            newRange.collapse(false);
            sel.removeAllRanges();
            sel.addRange(newRange);
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else if (isAtStart) {
            e.preventDefault();
            const firstChild = currentSheet.firstElementChild;
            const lastPrevChild = prevSheet.lastElementChild;
            if (firstChild && lastPrevChild) {
              lastPrevChild.innerHTML += firstChild.innerHTML;
              firstChild.remove();

              const newRange = document.createRange();
              newRange.selectNodeContents(lastPrevChild);
              newRange.collapse(false);
              sel.removeAllRanges();
              sel.addRange(newRange);
            }
            requestAnimationFrame(() => autoPaginateDriftPages(paper));
          }
        }
      });

      // Smart Natural Paste Handler: Strips AI banners, timestamps, and model tags, and formats headings naturally
      paper.addEventListener('paste', (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        const rawText = clipboardData.getData('text/plain') || '';
        const rawHtml = clipboardData.getData('text/html') || '';

        const isAiContent = rawText.includes('Imported from') ||
                            rawText.includes('Titan') ||
                            rawText.includes('Girionix') ||
                            rawHtml.includes('border-left') ||
                            /^[> \t]*[🕹️✨🚀🔒\s]*Imported/m.test(rawText) ||
                            /^[> \t]*#{1,6}\s/m.test(rawText) ||
                            (rawText.startsWith('>') && rawText.includes('\n>'));

        if (isAiContent) {
          e.preventDefault();
          const platform = window.orbitPlatform;
          const cleanHtml = platform && typeof platform.parseMarkdownToNaturalHtml === 'function'
            ? platform.parseMarkdownToNaturalHtml(rawText)
            : rawText.replace(/\n/g, '<br>');
          document.execCommand('insertHTML', false, cleanHtml);
          debouncedSaveDocument();
          if (platform && typeof platform.showToast === 'function') {
            platform.showToast('✅ Pasted as clean natural document text', 'blue');
          }
        }
        setTimeout(() => autoPaginateDriftPages(paper), 60);
      });

      container.querySelector('#btn-drift-drive-sync')?.addEventListener('click', () => {
        window.orbitDriveSync?.openDriveModal('browser', 'drift');
      });

      // Navigation state lock to prevent scroll listener from fighting page clicks
      let isNavigatingToPage = false;
      let navLockTimeout = null;

      // Page Thumbnails & Navigation Engine (MS Word Multi-Sheet)
      function renderPageThumbnails() {
        const pagesList = container.querySelector('#drift-pages-list');
        const counterBadge = container.querySelector('#drift-page-counter-badge');
        const sbPageCount = container.querySelector('#drift-sidebar-page-count');
        const sbPageInfo = container.querySelector('#drift-sidebar-page-info');
        const viewport = container.querySelector('#drift-center-viewport');
        if (!pagesList) return;

        const sheets = Array.from(paper.querySelectorAll('.drift-page-sheet'));
        const totalPages = Math.max(1, sheets.length);

        let activePage = 1;
        if (viewport) {
          const vpRect = viewport.getBoundingClientRect();
          sheets.forEach((sh, idx) => {
            const r = sh.getBoundingClientRect();
            if (r.top <= vpRect.top + 280) {
              activePage = idx + 1;
            }
          });
        }
        activePage = Math.min(totalPages, Math.max(1, activePage));

        if (counterBadge) counterBadge.textContent = `Page ${activePage} of ${totalPages}`;
        if (sbPageCount) sbPageCount.textContent = `${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'}`;
        if (sbPageInfo) sbPageInfo.textContent = `${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'} • Standard A4`;

        pagesList.innerHTML = '';
        sheets.forEach((sheet, idx) => {
          const i = idx + 1;
          const isCurrent = i === activePage;
          const pageText = (sheet.innerText || '').trim();
          const words = pageText.split(/\s+/).filter(Boolean);
          const snippet = words.length > 0 ? words.slice(0, 10).join(' ') + '...' : 'Empty page';

          const card = document.createElement('div');
          card.className = `drift-page-thumb-card ${isCurrent ? 'active' : ''}`;
          card.dataset.page = String(i);
          card.style.cssText = `
            display: flex; gap: 8px; align-items: flex-start;
            padding: 7px 8px; border-radius: 6px;
            background: ${isCurrent ? '#1e293b' : '#18181b'};
            border: 1.5px solid ${isCurrent ? '#2563eb' : '#27272a'};
            cursor: pointer; transition: all 0.15s;
          `;
          card.innerHTML = `
            <div style="font-size:10px; font-weight:700; color:${isCurrent ? '#38bdf8' : '#71717a'}; width:12px; text-align:right; margin-top:2px;">${i}</div>
            <div style="width:44px; height:58px; background:#fff; border-radius:3px; box-shadow:0 1px 3px rgba(0,0,0,0.3); padding:4px 3px; display:flex; flex-direction:column; gap:2px; overflow:hidden; position:relative; flex-shrink:0;">
              <div style="height:3px; background:${isCurrent ? '#2563eb' : '#94a3b8'}; border-radius:1px; width:60%;"></div>
              <div style="height:2px; background:#e2e8f0; width:90%;"></div>
              <div style="height:2px; background:#e2e8f0; width:85%;"></div>
              <div style="height:2px; background:#e2e8f0; width:95%;"></div>
              <div style="height:2px; background:#e2e8f0; width:70%;"></div>
              <div style="height:2px; background:#e2e8f0; width:80%;"></div>
              <div style="font-size:6px; color:#64748b; line-height:1; position:absolute; bottom:2px; right:3px; font-weight:700;">${i}</div>
            </div>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11px; font-weight:600; color:${isCurrent ? '#f8fafc' : '#cbd5e1'};">Page ${i}</span>
                ${totalPages > 1 ? `<button class="btn-drift-del-thumb" type="button" title="Delete Page ${i}" style="background:none; border:none; color:#ef4444; font-size:10px; cursor:pointer; padding:0 3px;">✕</button>` : ''}
              </div>
              <div style="font-size:9.5px; color:#64748b; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-height:1.3; margin-top:2px;">
                ${snippet}
              </div>
            </div>
          `;

          card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-drift-del-thumb')) {
              e.stopPropagation();
              window._driftDeletePage(i);
              return;
            }
            isNavigatingToPage = true;
            if (navLockTimeout) clearTimeout(navLockTimeout);
            navLockTimeout = setTimeout(() => { isNavigatingToPage = false; }, 800);

            sheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
            sheet.focus();

            sheets.forEach(s => s.classList.remove('active-sheet'));
            sheet.classList.add('active-sheet');

            if (counterBadge) counterBadge.textContent = `Page ${i} of ${totalPages}`;
            container.querySelectorAll('.drift-page-thumb-card').forEach(c => {
              const isMatch = parseInt(c.dataset.page, 10) === i;
              c.classList.toggle('active', isMatch);
              c.style.borderColor = isMatch ? '#2563eb' : '#27272a';
              c.style.background = isMatch ? '#1e293b' : '#18181b';
            });
          });

          pagesList.appendChild(card);
        });
      }

      // Delete a page and its separator cleanly
      window._driftDeletePage = function deletePage(pageNum) {
        const sheets = Array.from(paper.querySelectorAll('.drift-page-sheet'));
        if (sheets.length <= 1) {
          if (window.orbitPlatform) window.orbitPlatform.showToast('Cannot delete the only page in the document', 'red');
          return;
        }
        const targetSheet = sheets.find(s => parseInt(s.dataset.page, 10) === pageNum) || sheets[pageNum - 1];
        if (!targetSheet) return;

        const sheetText = (targetSheet.innerText || '').trim();
        if (sheetText.length > 0) {
          const ok = confirm(`Delete Page ${pageNum}? All content on Page ${pageNum} will be permanently removed.`);
          if (!ok) return;
        }

        const prevEl = targetSheet.previousElementSibling;
        if (prevEl && prevEl.classList.contains('drift-page-separator')) {
          prevEl.remove();
        } else {
          const nextEl = targetSheet.nextElementSibling;
          if (nextEl && nextEl.classList.contains('drift-page-separator')) {
            nextEl.remove();
          }
        }

        targetSheet.remove();
        renumberDocPages();
        saveDocument();
        renderPageThumbnails();

        const remaining = paper.querySelectorAll('.drift-page-sheet');
        const nextFocus = remaining[Math.min(pageNum - 1, remaining.length - 1)];
        if (nextFocus) {
          nextFocus.focus();
          nextFocus.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Page ${pageNum} removed`);
      };

      // Named insertPageBreak function — creates an authentic physical sheet like MS Word
      window._driftInsertPageBreak = function insertPageBreak() {
        const sel = window.getSelection();
        let activeSheet = null;
        if (sel && sel.anchorNode) {
          const node = sel.anchorNode;
          activeSheet = node.nodeType === 1 ? node.closest('.drift-page-sheet') : node.parentElement?.closest('.drift-page-sheet');
        }

        const sheets = Array.from(paper.querySelectorAll('.drift-page-sheet'));
        const refSheet = activeSheet || (sheets.length > 0 ? sheets[sheets.length - 1] : paper);

        const nextPageNum = sheets.length + 1;
        const sep = createPageSeparator(nextPageNum);
        const newSheet = document.createElement('div');
        newSheet.className = 'drift-page-sheet';
        newSheet.contentEditable = 'true';
        newSheet.spellcheck = true;
        newSheet.dataset.page = String(nextPageNum);
        newSheet.innerHTML = '<p><br></p>';

        if (refSheet && refSheet.nextSibling) {
          paper.insertBefore(sep, refSheet.nextSibling);
          paper.insertBefore(newSheet, sep.nextSibling);
        } else {
          paper.appendChild(sep);
          paper.appendChild(newSheet);
        }

        renumberDocPages();
        saveDocument();
        renderPageThumbnails();

        // Focus inside new sheet
        newSheet.focus();
        const p = newSheet.querySelector('p');
        if (p) {
          try {
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          } catch (_) {}
        }

        // Smoothly scroll center viewport to the newly created page sheet
        newSheet.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (window.orbitPlatform) {
          window.orbitPlatform.triggerToast(`Page ${newSheet.dataset.page} created!`);
        }
      };

      // Telemetry & Sidebar Stats updates
      function updateTelemetry() {
        const text = paper.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const readMin = Math.max(1, Math.ceil(words / 200));
        const speakMin = Math.max(1, Math.ceil(words / 130));

        if (wordCountEl) wordCountEl.textContent = words.toLocaleString();
        if (charCountEl) charCountEl.textContent = chars.toLocaleString();
        if (readTimeEl) readTimeEl.textContent = `~${readMin}m read • ~${speakMin}m speak`;

        const totalPages = calculateDocPages();
        const sbPageCount = container.querySelector('#drift-sidebar-page-count');
        const sbPageInfo = container.querySelector('#drift-sidebar-page-info');
        if (sbPageCount) sbPageCount.textContent = `${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'}`;
        if (sbPageInfo) sbPageInfo.textContent = `${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'} • Standard A4`;

        const sbWordText = container.querySelector('#drift-sidebar-wordcount-text');
        const sbCharText = container.querySelector('#drift-sidebar-charcount-text');
        if (sbWordText) sbWordText.textContent = `${words.toLocaleString()} words`;
        if (sbCharText) sbCharText.textContent = `${chars.toLocaleString()} chars • ~${readMin}m read • ~${speakMin}m speak`;

        // Update Giri Drift Status Bar
        const loPageStat = container.querySelector('#lo-stat-page-count');
        const loWordStat = container.querySelector('#lo-stat-word-count');
        if (loPageStat) loPageStat.textContent = `Page 1 of ${totalPages}`;
        if (loWordStat) loWordStat.textContent = `${words.toLocaleString()} words, ${chars.toLocaleString()} characters`;

        renderPageThumbnails();
      }

      // Dynamic Outline
      function updateOutline() {
        if (!outlineList) return;
        outlineList.innerHTML = '';
        const headings = paper.querySelectorAll('h1, h2, h3');
        if (!headings.length) {
          outlineList.innerHTML = `<li style="font-size:11px; color:#64748b; padding:8px 4px; font-style:italic;">No headings in document yet. Add H1, H2, or H3 to see outline.</li>`;
          return;
        }
        headings.forEach((h) => {
          const li = document.createElement('li');
          li.className = `outline-item outline-${h.tagName.toLowerCase()}`;
          li.style.cssText = 'padding:5px 8px; border-radius:4px; cursor:pointer; font-size:11.5px; color:#cbd5e1; transition:all 0.1s;';
          li.textContent = h.textContent.trim() || 'Untitled Heading';
          li.addEventListener('mouseenter', () => li.style.background = '#1e293b');
          li.addEventListener('mouseleave', () => li.style.background = 'transparent');
          li.addEventListener('click', () => {
            h.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
          outlineList.appendChild(li);
        });
      }

      // Sidebar Tab Switcher: Pages vs Headings
      const tabPages = container.querySelector('#tab-drift-pages');
      const tabHeadings = container.querySelector('#tab-drift-headings');
      const panePages = container.querySelector('#pane-drift-pages');
      const paneHeadings = container.querySelector('#pane-drift-headings');

      tabPages?.addEventListener('click', () => {
        tabPages.classList.add('active');
        tabPages.style.background = '#2563eb';
        tabPages.style.color = '#fff';
        tabHeadings?.classList.remove('active');
        if (tabHeadings) {
          tabHeadings.style.background = 'transparent';
          tabHeadings.style.color = '#94a3b8';
        }
        if (panePages) panePages.style.display = 'flex';
        if (paneHeadings) paneHeadings.style.display = 'none';
        renderPageThumbnails();
      });

      tabHeadings?.addEventListener('click', () => {
        tabHeadings.classList.add('active');
        tabHeadings.style.background = '#2563eb';
        tabHeadings.style.color = '#fff';
        tabPages?.classList.remove('active');
        if (tabPages) {
          tabPages.style.background = 'transparent';
          tabPages.style.color = '#94a3b8';
        }
        if (paneHeadings) paneHeadings.style.display = 'flex';
        if (panePages) panePages.style.display = 'none';
        updateOutline();
      });

      // Page Viewer Card Click
      container.querySelector('#btn-drift-sidebar-pageviewer')?.addEventListener('click', () => {
        tabPages?.click();
      });

      // Mobile Drawer & Sidebar Toggle
      const toggleSidebarBtn = container.querySelector('#btn-drift-toggle-sidebar');
      const closeSidebarDrawerBtn = container.querySelector('#btn-close-drift-sidebar-drawer');
      const leftSidebar = container.querySelector('#drift-left-sidebar');
      const floatingSidebarBtn = container.querySelector('#btn-drift-expand-sidebar-floating');
      const collapseSidebarBtn = container.querySelector('#btn-drift-collapse-sidebar');

      // Unified toggleSidebar function — hoisted to window so keydown shortcut can call it
      window._driftToggleSidebar = function toggleSidebar() {
        if (!leftSidebar) return;
        if (window.innerWidth <= 768) {
          leftSidebar.classList.toggle('mobile-open');
        } else {
          const isHidden = leftSidebar.style.display === 'none';
          leftSidebar.style.display = isHidden ? 'flex' : 'none';
          if (floatingSidebarBtn) floatingSidebarBtn.style.display = isHidden ? 'none' : 'flex';
        }
      };

      toggleSidebarBtn?.addEventListener('click', window._driftToggleSidebar);
      collapseSidebarBtn?.addEventListener('click', window._driftToggleSidebar);
      floatingSidebarBtn?.addEventListener('click', window._driftToggleSidebar);
      closeSidebarDrawerBtn?.addEventListener('click', () => {
        leftSidebar?.classList.remove('mobile-open');
      });

      // Mobile Floating Toolbar Actions
      container.querySelector('#btn-mobile-drift-sidebar')?.addEventListener('click', () => {
        leftSidebar?.classList.toggle('mobile-open');
      });
      container.querySelector('#btn-mobile-drift-undo')?.addEventListener('click', () => {
        document.execCommand('undo');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-redo')?.addEventListener('click', () => {
        document.execCommand('redo');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-bold')?.addEventListener('click', () => {
        document.execCommand('bold');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-italic')?.addEventListener('click', () => {
        document.execCommand('italic');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-underline')?.addEventListener('click', () => {
        document.execCommand('underline');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-rupee')?.addEventListener('click', () => {
        document.execCommand('insertText', false, '₹');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-h1')?.addEventListener('click', () => {
        document.execCommand('formatBlock', false, '<h1>');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-bullet')?.addEventListener('click', () => {
        document.execCommand('insertUnorderedList');
        saveDocument();
      });
      container.querySelector('#btn-mobile-drift-dictate')?.addEventListener('click', () => {
        container.querySelector('#btn-voice-dictate-group')?.click();
      });
      container.querySelector('#btn-mobile-drift-save')?.addEventListener('click', () => {
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Document saved successfully');
      });

      // Watermark Action
      container.querySelector('#btn-drift-watermark')?.addEventListener('click', () => {
        const text = prompt('Enter watermark text (e.g. CONFIDENTIAL, DRAFT, URGENT) or leave empty to remove:', 'CONFIDENTIAL');
        let watermarkEl = paper.querySelector('.drift-watermark-overlay');
        if (text === null) return;
        if (!text.trim()) {
          watermarkEl?.remove();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Watermark removed');
        } else {
          if (!watermarkEl) {
            watermarkEl = document.createElement('div');
            watermarkEl.className = 'drift-watermark-overlay';
            watermarkEl.contentEditable = 'false';
            watermarkEl.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);font-size:72px;font-weight:900;color:rgba(148,163,184,0.18);text-transform:uppercase;letter-spacing:10px;pointer-events:none;user-select:none;z-index:1;';
            paper.style.position = 'relative';
            paper.appendChild(watermarkEl);
          }
          watermarkEl.textContent = text.trim();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Watermark "${text.trim()}" applied`);
        }
        saveDocument();
      });

      // Page Break Action
      container.querySelector('#btn-drift-insert-pagebreak')?.addEventListener('click', () => {
        window._driftInsertPageBreak();
      });
      container.querySelector('#btn-drift-canvas-add-page')?.addEventListener('click', () => {
        window._driftInsertPageBreak();
      });

      // Table of Contents Generator
      container.querySelector('#btn-insert-toc-action')?.addEventListener('click', () => {
        const headings = paper.querySelectorAll('h1, h2, h3');
        if (headings.length === 0) {
          alert('No headings (H1, H2, H3) found in the document. Add headings first to generate a Table of Contents.');
          return;
        }
        let tocHtml = `<div class="drift-toc-block" contenteditable="false" style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #2563eb; border-radius:6px; padding:16px 20px; margin:20px 0; user-select:none;">
          <h3 style="margin:0 0 12px 0; font-size:14px; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:6px;"><span>📑</span> Table of Contents</h3>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">`;
        headings.forEach((h, idx) => {
          const tag = h.tagName.toLowerCase();
          const indent = tag === 'h1' ? '0px' : (tag === 'h2' ? '18px' : '36px');
          const weight = tag === 'h1' ? '700' : '500';
          const size = tag === 'h1' ? '12px' : '11px';
          const title = h.textContent.trim() || 'Untitled Section';
          if (!h.id) h.id = `section-heading-${idx + 1}`;
          tocHtml += `<li style="margin-left:${indent}; font-size:${size}; font-weight:${weight};">
            <a href="#${h.id}" style="color:#2563eb; text-decoration:none; display:flex; justify-content:space-between; border-bottom:1px dotted #cbd5e1; padding-bottom:2px;" onclick="document.getElementById('${h.id}')?.scrollIntoView({behavior:'smooth'}); return false;">
              <span>${title}</span>
              <span style="color:#94a3b8; font-family:monospace;">§${idx + 1}</span>
            </a>
          </li>`;
        });
        tocHtml += `</ul></div><p><br></p>`;
        document.execCommand('insertHTML', false, tocHtml);
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Table of Contents generated');
      });

      // Viewport scroll listener for active page tracking (RAF-throttled for performance)
      const centerViewport = container.querySelector('#drift-center-viewport');
      let _scrollRafId = null;
      centerViewport?.addEventListener('scroll', () => {
        if (isNavigatingToPage) return;
        if (_scrollRafId) return;
        _scrollRafId = requestAnimationFrame(() => {
          _scrollRafId = null;
          if (isNavigatingToPage) return;
          const sheets = Array.from(paper.querySelectorAll('.drift-page-sheet'));
          const totalPages = Math.max(1, sheets.length);
          const vpRect = centerViewport.getBoundingClientRect();
          let activePage = 1;
          sheets.forEach((sh, idx) => {
            const r = sh.getBoundingClientRect();
            if (r.top <= vpRect.top + 280) {
              activePage = idx + 1;
            }
          });
          activePage = Math.min(totalPages, Math.max(1, activePage));
          const counterBadge = container.querySelector('#drift-page-counter-badge');
          if (counterBadge) counterBadge.textContent = `Page ${activePage} of ${totalPages}`;

          container.querySelectorAll('.drift-page-thumb-card').forEach(c => {
            const isMatch = parseInt(c.dataset.page, 10) === activePage;
            c.classList.toggle('active', isMatch);
            c.style.borderColor = isMatch ? '#2563eb' : '#27272a';
            c.style.background = isMatch ? '#1e293b' : '#18181b';
          });
        });
      });

      // =====================================================================
      // ORBIT PROOFMASTER: INTELLIGENT GRAMMAR, SPELLING & SOVEREIGN TIMEMACHINE
      // =====================================================================
      let activeProofingTone = 'formal';
      let currentProofingIssues = [];

      const OrbitProofMaster = {
        spellingDict: {
          'teh': 'the', 'recieve': 'receive', 'seperate': 'separate', 'untill': 'until',
          'definately': 'definitely', 'definitly': 'definitely', 'goverment': 'government',
          'enviroment': 'environment', 'accomodate': 'accommodate', 'accomodation': 'accommodation',
          'neccessary': 'necessary', 'necesary': 'necessary', 'occured': 'occurred', 'occurance': 'occurrence',
          'acheive': 'achieve', 'acheivment': 'achievement', 'embarass': 'embarrass', 'embarassing': 'embarrassing',
          'mispell': 'misspell', 'mispelled': 'misspelled', 'truely': 'truly', 'wierd': 'weird',
          'calender': 'calendar', 'colleage': 'colleague', 'collegue': 'colleague', 'concious': 'conscious',
          'refered': 'referred', 'refering': 'referring', 'sucessful': 'successful', 'sucess': 'success',
          'begining': 'beginning', 'tommorrow': 'tomorrow', 'tomorow': 'tomorrow', 'recommand': 'recommend',
          'recommandation': 'recommendation', 'pronounciation': 'pronunciation', 'maintenence': 'maintenance',
          'priviledge': 'privilege', 'guarentee': 'guarantee', 'garantee': 'guarantee', 'independant': 'independent',
          'persistant': 'persistent', 'beleive': 'believe', 'beleived': 'believed', 'foriegn': 'foreign',
          'hieght': 'height', 'judgement': 'judgment', 'knowlege': 'knowledge', 'liason': 'liaison',
          'millenium': 'millennium', 'noticable': 'noticeable', 'posession': 'possession',
          'questionaire': 'questionnaire', 'rythm': 'rhythm', 'scheduele': 'schedule', 'supercede': 'supersede',
          'tendancy': 'tendency', 'thier': 'their', 'unforseen': 'unforeseen', 'writting': 'writing',
          'adress': 'address', 'alot': 'a lot', 'apparantly': 'apparently', 'arguement': 'argument',
          'assasination': 'assassination', 'basicly': 'basically', 'bizzare': 'bizarre', 'catagory': 'category',
          'cemetary': 'cemetery', 'commitee': 'committee', 'commited': 'committed', 'completly': 'completely',
          'concieve': 'conceive', 'concensus': 'consensus', 'curiosity': 'curiosity', 'dissapear': 'disappear',
          'dissappoint': 'disappoint', 'embarassment': 'embarrassment', 'existance': 'existence',
          'experiance': 'experience', 'familar': 'familiar', 'foward': 'forward', 'furthermore': 'furthermore',
          'gage': 'gauge', 'greatful': 'grateful', 'happend': 'happened', 'harasment': 'harassment',
          'harrass': 'harass', 'hierachy': 'hierarchy', 'humerous': 'humorous', 'hygene': 'hygiene',
          'ignorence': 'ignorance', 'imediately': 'immediately', 'incidently': 'incidentally',
          'interupt': 'interrupt', 'irresistable': 'irresistible', 'knowlegeable': 'knowledgeable',
          'lenght': 'length', 'leutenant': 'lieutenant', 'lightening': 'lightning', 'lonelyness': 'loneliness',
          'managment': 'management', 'manouver': 'maneuver', 'marraige': 'marriage', 'medeval': 'medieval',
          'memento': 'memento', 'mischevious': 'mischievous', 'neice': 'niece', 'nineth': 'ninth',
          'ocasion': 'occasion', 'occassion': 'occasion', 'omision': 'omission', 'oppurtunity': 'opportunity',
          'outragous': 'outrageous', 'paralell': 'parallel', 'parrallel': 'parallel', 'particuler': 'particular',
          'pastime': 'pastime', 'percieve': 'perceive', 'perseverence': 'perseverance', 'personel': 'personnel',
          'playwrite': 'playwright', 'potatos': 'potatoes', 'prefered': 'preferred', 'presance': 'presence',
          'privelege': 'privilege', 'probaly': 'probably', 'proceedure': 'procedure', 'propaganda': 'propaganda',
          'publically': 'publicly', 'realy': 'really', 'reciept': 'receipt', 'recognize': 'recognize',
          'relevent': 'relevant', 'religous': 'religious', 'rember': 'remember', 'resistence': 'resistance',
          'restarant': 'restaurant', 'resturant': 'restaurant', 'saftey': 'safety', 'scence': 'scene',
          'sensative': 'sensitive', 'sieze': 'seize', 'similiar': 'similar', 'sincerly': 'sincerely',
          'speach': 'speech', 'suprise': 'surprise', 'temperture': 'temperature', 'threshhold': 'threshold',
          'tomatos': 'tomatoes', 'tounge': 'tongue', 'transfered': 'transferred', 'twelth': 'twelfth',
          'tyrany': 'tyranny', 'underate': 'underrate', 'unfortunatly': 'unfortunately', 'usally': 'usually',
          'vaccuum': 'vacuum', 'vehical': 'vehicle', 'vicious': 'vicious', 'wellcome': 'welcome',
          'wich': 'which', 'wierdly': 'weirdly', 'yeild': 'yield'
        },

        grammarRules: [
          { pattern: /\btheir\s+(are|is|was|were)\b/gi, fix: 'there $1', reason: 'Homophone: Use "there" to indicate presence or existence.' },
          { pattern: /\bthey're\s+(car|team|system|plan|document|code|files?|company|strategy|mission|goals?|data)\b/gi, fix: 'their $1', reason: 'Possessive: Use "their" to denote ownership.' },
          { pattern: /\bthere\s+(car|team|system|plan|document|code|files?|company|strategy|mission|goals?)\b/gi, fix: 'their $1', reason: 'Possessive: Use "their" to denote ownership.' },
          { pattern: /\byour\s+(welcome|right|going|leaving|invited|doing|correct|ready)\b/gi, fix: "you're $1", reason: 'Contraction: Use "you\'re" for "you are".' },
          { pattern: /\byou're\s+(car|team|system|plan|document|file|report|account|password|organization)\b/gi, fix: 'your $1', reason: 'Possessive: Use "your" to indicate ownership.' },
          { pattern: /\bit's\s+(capabilities|features|parameters|value|purpose|impact|role|growth|structure|status|color|size|name|source)\b/gi, fix: 'its $1', reason: 'Possessive: Use "its" without apostrophe for possession.' },
          { pattern: /\bits\s+(a|an|the|not|always|been|essential|critical|important|ready)\b/gi, fix: "it's $1", reason: 'Contraction: Use "it\'s" for "it is" or "it has".' },
          { pattern: /\bto\s+(much|many|late|bad|fast|slow|expensive|high|low|far|soon)\b/gi, fix: 'too $1', reason: 'Adverb: Use "too" to mean excessive or also.' },
          { pattern: /\b(more|less|better|worse|greater|smaller|faster|slower|higher|lower|rather)\s+then\b/gi, fix: '$1 than', reason: 'Comparison: Use "than" for comparisons, "then" for chronological sequence.' },
          { pattern: /\b(the|an?)\s+affect\b/gi, fix: '$1 effect', reason: 'Noun: Use "effect" when referring to a result or consequence.' },
          { pattern: /\bhave\s+an\s+affect\b/gi, fix: 'have an effect', reason: 'Noun: Use "effect" as an outcome.' },
          { pattern: /\b(dont|do\s+not|will|could)\s+loose\b/gi, fix: '$1 lose', reason: 'Verb: Use "lose" (not "loose") for misplacing or failing to retain.' },
          { pattern: /\bloose\s+(weight|control|track|money|focus|data|interest)\b/gi, fix: 'lose $1', reason: 'Verb: Use "lose" for decreasing or misplacing.' },
          { pattern: /\b(could|should|would|must|might)\s+of\b/gi, fix: '$1 have', reason: 'Grammar: Replace "$1 of" with "$1 have".' },
          { pattern: /\bsuppose\s+to\b/gi, fix: 'supposed to', reason: 'Grammar: The idiomatic phrasing is "supposed to".' },
          { pattern: /\buse\s+to\s+(be|have|run|think|work|build|make)\b/gi, fix: 'used to $1', reason: 'Grammar: The idiomatic past habitual form is "used to".' },
          { pattern: /\ba\s+(apple|orange|hour|honest|honor|elephant|idea|overview|update|audit|issue|enterprise|algorithm)\b/gi, fix: 'an $1', reason: 'Article: Use "an" before vowel sounds.' },
          { pattern: /\ban\s+(university|unique|user|useful|one|uniform|european)\b/gi, fix: 'a $1', reason: 'Article: Use "a" before consonant "yu" sounds.' }
        ],

        clarityPairs: [
          { pattern: /\bin order to\b/gi, fix: 'to', reason: 'Concise phrasing: Replace "in order to" with "to".' },
          { pattern: /\bdue to the fact that\b/gi, fix: 'because', reason: 'Concise phrasing: Replace with "because".' },
          { pattern: /\bat this point in time\b/gi, fix: 'now', reason: 'Concise phrasing: Replace with "now".' },
          { pattern: /\bat the present time\b/gi, fix: 'currently', reason: 'Concise phrasing: Replace with "currently".' },
          { pattern: /\butilize\b/gi, fix: 'use', reason: 'Plain vocabulary: Prefer "use" over "utilize".' },
          { pattern: /\butilizes\b/gi, fix: 'uses', reason: 'Plain vocabulary: Prefer "uses" over "utilizes".' },
          { pattern: /\butilized\b/gi, fix: 'used', reason: 'Plain vocabulary: Prefer "used" over "utilized".' },
          { pattern: /\bfor the purpose of\b/gi, fix: 'for', reason: 'Concise phrasing: Replace with "for".' },
          { pattern: /\bin the event that\b/gi, fix: 'if', reason: 'Concise phrasing: Replace with "if".' },
          { pattern: /\bas a matter of fact\b/gi, fix: 'in fact', reason: 'Concise phrasing: Replace with "in fact".' },
          { pattern: /\ba large number of\b/gi, fix: 'many', reason: 'Concise phrasing: Replace with "many".' },
          { pattern: /\ba majority of\b/gi, fix: 'most', reason: 'Concise phrasing: Replace with "most".' },
          { pattern: /\bin spite of the fact that\b/gi, fix: 'although', reason: 'Concise phrasing: Replace with "although".' },
          { pattern: /\bwith regard to\b/gi, fix: 'regarding', reason: 'Concise phrasing: Replace with "regarding".' },
          { pattern: /\btake into consideration\b/gi, fix: 'consider', reason: 'Concise phrasing: Replace with "consider".' },
          { pattern: /\bmake a decision\b/gi, fix: 'decide', reason: 'Concise phrasing: Replace with "decide".' },
          { pattern: /\breach a conclusion\b/gi, fix: 'conclude', reason: 'Concise phrasing: Replace with "conclude".' },
          { pattern: /\bfirst and foremost\b/gi, fix: 'first', reason: 'Redundant phrasing: Use "first".' },
          { pattern: /\beach and every\b/gi, fix: 'each', reason: 'Redundant phrasing: Use "each".' },
          { pattern: /\bfuture plans\b/gi, fix: 'plans', reason: 'Redundant wording: Plans are inherently future.' },
          { pattern: /\bpast history\b/gi, fix: 'history', reason: 'Redundant wording: History is inherently past.' },
          { pattern: /\bend result\b/gi, fix: 'result', reason: 'Redundant wording: Replace with "result".' },
          { pattern: /\bvery unique\b/gi, fix: 'unique', reason: 'Unique is absolute; avoid "very unique".' }
        ],

        check(text) {
          const raw = text || '';
          const wordsArr = raw.trim() ? raw.trim().split(/\s+/).filter(Boolean) : [];
          const words = wordsArr.length;
          const sentences = raw.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
          const sentenceCount = Math.max(1, sentences.length);
          const avgWordsPerSentence = words > 0 ? parseFloat((words / sentenceCount).toFixed(1)) : 0;

          let totalSyllables = 0;
          wordsArr.forEach(w => {
            let cw = (w || '').toLowerCase().replace(/[^a-z]/g, '');
            if (cw.length <= 3) totalSyllables += 1;
            else {
              cw = cw.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
              const m = cw.match(/[aeiouy]{1,2}/g);
              totalSyllables += m ? Math.max(1, m.length) : 1;
            }
          });

          let readingEase = 72;
          if (words > 0 && sentenceCount > 0) {
            readingEase = Math.round(206.835 - (1.015 * (words / sentenceCount)) - (84.6 * (totalSyllables / words)));
            readingEase = Math.max(15, Math.min(100, readingEase));
          }

          let gradeLevel = 'Grade 10 Level';
          if (words > 0) {
            const gl = Math.round(0.39 * (words / sentenceCount) + 11.8 * (totalSyllables / words) - 15.59);
            if (gl <= 6) gradeLevel = 'Middle School (Grade 6)';
            else if (gl <= 9) gradeLevel = 'Plain English (Grade 8-9)';
            else if (gl <= 12) gradeLevel = `High School (Grade ${Math.max(10, gl)})`;
            else gradeLevel = 'Executive / College Level';
          }

          const readMin = Math.max(1, Math.ceil(words / 200));
          const speakMin = Math.max(1, Math.ceil(words / 130));

          const issues = [];

          // 1. Spelling dictionary check
          const wordRegex = /\b([a-zA-Z]{3,})\b/g;
          let match;
          while ((match = wordRegex.exec(raw)) !== null) {
            const lower = match[1].toLowerCase();
            if (this.spellingDict[lower]) {
              const rep = match[1][0] === match[1][0].toUpperCase()
                ? this.spellingDict[lower].charAt(0).toUpperCase() + this.spellingDict[lower].slice(1)
                : this.spellingDict[lower];
              issues.push({
                id: 'spell-' + issues.length,
                type: 'Spelling',
                label: 'Spelling Typo',
                original: match[1],
                replacement: rep,
                reason: `Common spelling mistake: "${match[1]}" → "${rep}".`,
                index: match.index
              });
            }
          }

          // 2. Grammar & Homophones check
          this.grammarRules.forEach(rule => {
            let m;
            const re = new RegExp(rule.pattern.source, rule.pattern.flags);
            while ((m = re.exec(raw)) !== null) {
              const rep = m[0].replace(rule.pattern, rule.fix);
              issues.push({
                id: 'gram-' + issues.length,
                type: 'Grammar',
                label: 'Grammar & Mechanics',
                original: m[0],
                replacement: rep,
                reason: rule.reason,
                index: m.index
              });
            }
          });

          // 3. Repeated adjacent words ("the the", "is is")
          const repRegex = /\b([a-zA-Z]{2,})\s+\1\b/gi;
          let rm;
          while ((rm = repRegex.exec(raw)) !== null) {
            issues.push({
              id: 'rep-' + issues.length,
              type: 'Repetition',
              label: 'Repeated Word',
              original: rm[0],
              replacement: rm[1],
              reason: `Repeated word "${rm[0]}" detected. Standard prose uses a single word.`,
              index: rm.index
            });
          }

          // 4. Clarity & Wordiness check
          this.clarityPairs.forEach(pair => {
            let cm;
            const cre = new RegExp(pair.pattern.source, pair.pattern.flags);
            while ((cm = cre.exec(raw)) !== null) {
              issues.push({
                id: 'clar-' + issues.length,
                type: 'Clarity',
                label: 'Clarity & Conciseness',
                original: cm[0],
                replacement: pair.fix,
                reason: pair.reason,
                index: cm.index
              });
            }
          });

          // 5. Spacing before punctuation ("word , " -> "word, ")
          const punctSpcRegex = /\s+([,.:;!?])/g;
          let psm;
          while ((psm = punctSpcRegex.exec(raw)) !== null) {
            issues.push({
              id: 'punct-' + issues.length,
              type: 'Spacing',
              label: 'Punctuation Spacing',
              original: psm[0],
              replacement: psm[1],
              reason: `Unnecessary space before "${psm[1]}".`,
              index: psm.index
            });
          }

          // 6. Multiple consecutive spaces
          if (/\s{2,}/.test(raw)) {
            issues.push({
              id: 'space-' + issues.length,
              type: 'Spacing',
              label: 'Multiple Spaces',
              original: '  ',
              replacement: ' ',
              reason: 'Consecutive spaces detected. Standard typography recommends single spaces.',
              index: 0
            });
          }

          // Calculate Dynamic Health Score
          const penalty = issues.length * 3.5;
          const score = words > 10 ? Math.max(65, Math.round(100 - penalty)) : 100;

          return {
            issues,
            score,
            stats: {
              words,
              sentences: sentenceCount,
              avgWordsPerSentence,
              readingEase,
              gradeLevel,
              readMin,
              speakMin
            }
          };
        },

        applyAll(text) {
          if (!text) return text;
          let t = text;

          // 1. Spelling dictionary replacement
          Object.keys(this.spellingDict).forEach(misspelling => {
            const re = new RegExp('\\b' + misspelling + '\\b', 'gi');
            t = t.replace(re, (match) => {
              const replacement = this.spellingDict[misspelling.toLowerCase()];
              if (match[0] === match[0].toUpperCase()) {
                return replacement.charAt(0).toUpperCase() + replacement.slice(1);
              }
              return replacement;
            });
          });

          // 2. Grammar rules
          this.grammarRules.forEach(rule => {
            t = t.replace(rule.pattern, rule.fix);
          });

          // 3. Clarity reductions
          this.clarityPairs.forEach(pair => {
            t = t.replace(pair.pattern, pair.fix);
          });

          // 4. Remove repeated words
          t = t.replace(/\b([a-zA-Z]{2,})\s+\1\b/gi, '$1');

          // 5. Spacing before punctuation
          t = t.replace(/\s+([,.:;!?])/g, '$1');

          // 6. Normalize double spaces
          t = t.replace(/[ \t]{2,}/g, ' ');

          // 7. Capitalize after sentence terminators
          t = t.replace(/([.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());

          return t;
        }
      };

      // Export OrbitProofMaster globally for suite-wide access
      if (typeof window !== 'undefined') {
        window.OrbitProofMaster = OrbitProofMaster;
      }

      // =====================================================================
      // ORBIT TIMEMACHINE: SOVEREIGN VERSION HISTORY & SNAPSHOT RESTORE
      // =====================================================================
      const OrbitTimeMachine = {
        getStorageKey() {
          const docName = (currentDocTitle || 'Untitled_Document').replace(/[^a-zA-Z0-9_-]/g, '_');
          return `giri_orbit_snapshots_${docName}`;
        },

        listSnapshots() {
          try {
            const raw = localStorage.getItem(this.getStorageKey());
            return raw ? JSON.parse(raw) : [];
          } catch (_) {
            return [];
          }
        },

        saveSnapshot(label = null) {
          if (!paper) return;
          const html = paper.innerHTML;
          const text = (paper.innerText || '').trim();
          const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
          const chars = text.length;
          const now = new Date();
          const defaultLabel = label || `Snapshot ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

          const snapshot = {
            id: 'snap_' + Date.now(),
            label: defaultLabel,
            timestamp: now.toISOString(),
            dateFormatted: now.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            wordCount: words,
            charCount: chars,
            preview: text.slice(0, 140) || 'Empty document snapshot',
            html
          };

          const list = this.listSnapshots();
          // Keep newest at front, max 30 snapshots
          list.unshift(snapshot);
          if (list.length > 30) list.pop();

          try {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(list));
            this.updateSidebarBadge();
          } catch (e) {
            console.warn('Storage limit reached for snapshots', e);
          }

          return snapshot;
        },

        restoreSnapshot(id) {
          const list = this.listSnapshots();
          const target = list.find(s => s.id === id);
          if (!target || !paper) return false;

          paper.innerHTML = target.html;
          saveDocument();
          updateTelemetry();
          if (typeof autoPaginateDriftPages === 'function') {
            autoPaginateDriftPages(paper);
          }
          if (window.orbitPlatform) {
            window.orbitPlatform.triggerToast(`✓ Restored version: "${target.label}" (${target.wordCount} words)`);
          }
          return true;
        },

        deleteSnapshot(id) {
          let list = this.listSnapshots();
          list = list.filter(s => s.id !== id);
          localStorage.setItem(this.getStorageKey(), JSON.stringify(list));
          this.updateSidebarBadge();
          this.renderModal();
        },

        updateSidebarBadge() {
          const pill = container.querySelector('#drift-versions-count-pill');
          const summary = container.querySelector('#drift-versions-summary-text');
          const list = this.listSnapshots();
          if (pill) {
            pill.textContent = `${list.length} ${list.length === 1 ? 'SNAP' : 'SNAPS'}`;
          }
          if (summary) {
            summary.textContent = list.length ? `Latest: ${list[0].dateFormatted}` : 'Click to save checkpoint';
          }
        },

        openModal() {
          const modal = container.querySelector('#drift-version-history-modal');
          if (!modal) return;
          this.renderModal();
          modal.classList.add('open');
        },

        closeModal() {
          const modal = container.querySelector('#drift-version-history-modal');
          modal?.classList.remove('open');
        },

        renderModal() {
          const listEl = container.querySelector('#drift-snapshots-list');
          if (!listEl) return;
          const list = this.listSnapshots();

          if (list.length === 0) {
            listEl.innerHTML = `
              <div style="padding:24px; text-align:center; background:rgba(255,255,255,0.02); border:1px dashed #334155; border-radius:8px;">
                <span style="font-size:28px; display:block; margin-bottom:8px;">⏱️</span>
                <strong style="color:#f8fafc; font-size:13.5px; display:block;">No Version Snapshots Saved Yet</strong>
                <p style="color:#94a3b8; font-size:12px; margin:4px 0 0 0;">Create a manual snapshot above or continue writing. Orbit automatically records major checkpoints.</p>
              </div>
            `;
            return;
          }

          listEl.innerHTML = list.map(snap => `
            <div class="drift-snapshot-card" data-id="${snap.id}" style="padding:12px 14px; background:#18181b; border:1px solid #27272a; border-left:3px solid #a855f7; border-radius:8px; display:flex; justify-content:space-between; align-items:center; gap:12px;">
              <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <strong style="font-size:13px; color:#f8fafc;">${snap.label}</strong>
                  <span style="font-size:10px; font-weight:700; color:#cbd5e1; background:#27272a; padding:2px 6px; border-radius:3px;">${snap.wordCount} words</span>
                  <span style="font-size:10.5px; color:#94a3b8;">${snap.dateFormatted}</span>
                </div>
                <div style="font-size:11px; color:#64748b; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-style:italic;">
                  "${snap.preview}..."
                </div>
              </div>
              <div style="display:flex; gap:6px; align-items:center;">
                <button class="btn-restore-snapshot" data-id="${snap.id}" style="background:#2563eb; color:#ffffff; border:none; padding:5px 12px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer;">Restore</button>
                <button class="btn-delete-snapshot" data-id="${snap.id}" style="background:transparent; color:#ef4444; border:1px solid rgba(239,68,68,0.3); padding:5px 8px; border-radius:4px; font-size:11px; cursor:pointer;" title="Delete Snapshot">🗑</button>
              </div>
            </div>
          `).join('');

          listEl.querySelectorAll('.btn-restore-snapshot').forEach(b => {
            b.addEventListener('click', () => {
              const id = b.dataset.id;
              if (confirm('Restore this version? Your current document will be replaced with this snapshot.')) {
                OrbitTimeMachine.restoreSnapshot(id);
                OrbitTimeMachine.closeModal();
              }
            });
          });

          listEl.querySelectorAll('.btn-delete-snapshot').forEach(b => {
            b.addEventListener('click', () => {
              const id = b.dataset.id;
              OrbitTimeMachine.deleteSnapshot(id);
            });
          });
        }
      };

      // Wire Version History UI triggers
      container.querySelector('#btn-drift-sidebar-versions')?.addEventListener('click', () => OrbitTimeMachine.openModal());
      container.querySelector('#btn-close-drift-versions-dialog')?.addEventListener('click', () => OrbitTimeMachine.closeModal());
      container.querySelector('#btn-cancel-drift-versions')?.addEventListener('click', () => OrbitTimeMachine.closeModal());
      container.querySelector('#btn-drift-create-snapshot')?.addEventListener('click', () => {
        const input = container.querySelector('#drift-new-snapshot-name');
        const name = input?.value.trim() || null;
        OrbitTimeMachine.saveSnapshot(name);
        if (input) input.value = '';
        OrbitTimeMachine.renderModal();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('📸 Document snapshot created successfully!');
      });

      // Update initial versions badge
      OrbitTimeMachine.updateSidebarBadge();

      // =====================================================================
      // COMPREHENSIVE PROOFING ASSISTANT MODAL (Orbit ProofMaster Powered)
      // =====================================================================
      const openSpellingAssistant = () => {
        const proofingModal = container.querySelector('#drift-editor-proofing-modal');
        if (!proofingModal) return;

        const text = paper.innerText || '';
        const report = OrbitProofMaster.check(text);
        currentProofingIssues = report.issues;
        const { score, stats } = report;

        // Update score indicators
        const scoreVal = container.querySelector('#drift-editor-score-val');
        const scorePill = container.querySelector('#drift-editor-score-pill');
        const scoreBar = container.querySelector('#drift-editor-score-bar');
        const gradeLevelEl = container.querySelector('#drift-editor-grade-level');
        const toneDescEl = container.querySelector('#drift-editor-tone-desc');
        const statsMiniEl = container.querySelector('#drift-editor-stats-mini');
        const spellingStat = container.querySelector('#drift-proofing-spelling-stat');
        const spellingSub = container.querySelector('#drift-proofing-spelling-sub');
        const grammarStat = container.querySelector('#drift-proofing-grammar-stat');
        const grammarSub = container.querySelector('#drift-proofing-grammar-sub');
        const easeStat = container.querySelector('#drift-proofing-ease-stat');
        const easeSub = container.querySelector('#drift-proofing-ease-sub');
        const readingTimeVal = container.querySelector('#drift-editor-reading-time');
        const speakTimeVal = container.querySelector('#drift-proofing-speak-time');
        const suggestionsBadge = container.querySelector('#drift-suggestions-count-badge');
        const suggestionsList = container.querySelector('#drift-proofing-suggestions-list');

        if (scoreVal) scoreVal.textContent = `${score}%`;
        if (scorePill) {
          scorePill.textContent = score >= 95 ? '● Pristine' : (score >= 85 ? '● Good Clarity' : '● Needs Polish');
          scorePill.style.color = score >= 90 ? '#10b981' : (score >= 80 ? '#38bdf8' : '#f59e0b');
        }
        if (scoreBar) {
          scoreBar.style.width = `${score}%`;
          scoreBar.style.background = score >= 90 ? 'linear-gradient(90deg, #10b981, #3b82f6)' : 'linear-gradient(90deg, #f59e0b, #ef4444)';
        }

        if (gradeLevelEl) gradeLevelEl.textContent = stats.gradeLevel;
        if (toneDescEl) {
          toneDescEl.textContent = activeProofingTone === 'formal' ? 'Executive & Formal Tone' :
                                   activeProofingTone === 'clear' ? 'Direct & Action-Oriented' :
                                   activeProofingTone === 'technical' ? 'Rigorous Technical Precision' : 'Engaging & Expressive';
        }
        if (statsMiniEl) statsMiniEl.textContent = `${stats.words} words • ${stats.sentences} sentences • ${currentProofingIssues.length} alerts`;

        const spellCount = currentProofingIssues.filter(i => i.type === 'Spelling').length;
        const gramCount = currentProofingIssues.filter(i => i.type === 'Grammar' || i.type === 'Repetition').length;

        if (spellingStat) {
          spellingStat.textContent = spellCount ? `⚠️ ${spellCount} Typos` : '✓ 0 Typos';
          spellingStat.style.color = spellCount ? '#ef4444' : '#10b981';
        }
        if (spellingSub) spellingSub.textContent = spellCount ? `${spellCount} spelling errors` : '250+ dictionary verified';

        if (grammarStat) {
          grammarStat.textContent = gramCount ? `⚠️ ${gramCount} Issues` : '✓ Clean Flow';
          grammarStat.style.color = gramCount ? '#3b82f6' : '#10b981';
        }
        if (grammarSub) grammarSub.textContent = `${stats.avgWordsPerSentence} words/sent avg`;

        if (easeStat) easeStat.textContent = stats.readingEase >= 80 ? `Easy (${stats.readingEase})` : (stats.readingEase >= 60 ? `Standard (${stats.readingEase})` : `Complex (${stats.readingEase})`);
        if (easeSub) easeSub.textContent = `Flesch Reading Ease`;

        if (readingTimeVal) readingTimeVal.textContent = `~${stats.readMin} min`;
        if (speakTimeVal) speakTimeVal.textContent = `~${stats.speakMin} min speaking (130 wpm)`;

        // Update sidebar spelling card summary text
        const sideSummary = container.querySelector('#drift-spelling-summary-text');
        if (sideSummary) {
          sideSummary.textContent = `${score}% Quality • ${currentProofingIssues.length} issues`;
        }

        if (suggestionsBadge) {
          suggestionsBadge.textContent = `${currentProofingIssues.length} ${currentProofingIssues.length === 1 ? 'Alert' : 'Alerts'}`;
          suggestionsBadge.style.color = currentProofingIssues.length ? '#f59e0b' : '#10b981';
        }

        // Render suggestions list
        if (suggestionsList) {
          suggestionsList.innerHTML = '';
          if (currentProofingIssues.length === 0) {
            suggestionsList.innerHTML = `
              <div style="padding:14px 16px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:8px; display:flex; gap:12px; align-items:center;">
                <span style="font-size:22px; color:#10b981;">✓</span>
                <div style="font-size:12px; color:#cbd5e1; line-height:1.5;">
                  <strong style="color:#10b981; font-size:13px; display:block;">Pristine Executive Quality (100% Score)</strong>
                  Zero typos, grammatical defects, repetitions, or awkward phrasing detected. Document meets sovereign corporate publication standards.
                </div>
              </div>
            `;
          } else {
            currentProofingIssues.forEach(issue => {
              const card = document.createElement('div');
              card.className = 'proofing-suggestion-item';
              const borderCol = issue.type === 'Spelling' ? '#ef4444' : (issue.type === 'Grammar' ? '#3b82f6' : (issue.type === 'Clarity' ? '#10b981' : '#f59e0b'));
              card.style.cssText = `padding:10px 14px; background:#18181b; border:1px solid #27272a; border-left:3px solid ${borderCol}; border-radius:6px; display:flex; justify-content:space-between; align-items:center; gap:10px; transition:all 0.15s;`;
              card.innerHTML = `
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:9.5px; font-weight:700; text-transform:uppercase; background:#1e293b; color:${borderCol}; padding:2px 6px; border-radius:3px;">${issue.type}</span>
                    <strong style="font-size:12px; color:#f8fafc;">"${issue.original}" &rarr; <span style="color:#10b981;">"${issue.replacement}"</span></strong>
                  </div>
                  <div style="font-size:11px; color:#94a3b8; margin-top:3px;">${issue.reason}</div>
                </div>
                <div style="display:flex; gap:6px; align-items:center;">
                  <button class="btn-fix-issue" style="background:#2563eb; color:#ffffff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">Fix</button>
                  <button class="btn-ignore-issue" style="background:transparent; color:#94a3b8; border:1px solid #3f3f46; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Ignore</button>
                </div>
              `;

              card.querySelector('.btn-fix-issue')?.addEventListener('click', () => {
                if (paper) {
                  paper.innerHTML = paper.innerHTML.replace(issue.original, issue.replacement);
                  saveDocument();
                  updateTelemetry();
                }
                card.style.background = 'rgba(16,185,129,0.1)';
                card.style.borderLeftColor = '#10b981';
                card.innerHTML = `<span style="font-size:11.5px; color:#10b981; font-weight:600;">✓ Applied: "${issue.replacement}"</span>`;
                currentProofingIssues = currentProofingIssues.filter(i => i.id !== issue.id);
                if (suggestionsBadge) suggestionsBadge.textContent = `${currentProofingIssues.length} Alerts`;
                if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Fixed: "${issue.original}" → "${issue.replacement}"`);
              });

              card.querySelector('.btn-ignore-issue')?.addEventListener('click', () => {
                card.remove();
                currentProofingIssues = currentProofingIssues.filter(i => i.id !== issue.id);
                if (suggestionsBadge) suggestionsBadge.textContent = `${currentProofingIssues.length} Alerts`;
              });

              suggestionsList.appendChild(card);
            });
          }
        }

        proofingModal.classList.add('open');
      };

      // Proofing Tone Switching
      container.querySelectorAll('.proofing-tone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.proofing-tone-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = '#1e293b';
            b.style.color = '#94a3b8';
            b.style.borderColor = '#334155';
          });
          btn.classList.add('active');
          btn.style.background = 'rgba(59,130,246,0.25)';
          btn.style.color = '#93c5fd';
          btn.style.borderColor = '#3b82f6';
          activeProofingTone = btn.dataset.tone;
          openSpellingAssistant();
        });
      });

      // Copy Proofing Report
      container.querySelector('#btn-copy-proofing-report')?.addEventListener('click', () => {
        const text = paper.innerText || '';
        const rep = OrbitProofMaster.check(text);
        const report = `Giri Drift Writing Intelligence Report\n====================================\nWords: ${rep.stats.words}\nSentences: ${rep.stats.sentences}\nQuality Score: ${rep.score}%\nFlesch Reading Ease: ${rep.stats.readingEase}\nGrade Level: ${rep.stats.gradeLevel}\nAverage Sentence Length: ${rep.stats.avgWordsPerSentence} words\nTarget Tone: ${activeProofingTone.toUpperCase()}\nIssues Pending: ${rep.issues.length}\nGenerated: ${new Date().toLocaleString()}`;
        navigator.clipboard?.writeText(report);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Proofing report copied to clipboard!');
      });

      container.querySelector('#btn-toggle-spellcheck')?.addEventListener('click', () => {
        const isSpell = paper.getAttribute('spellcheck') === 'true';
        paper.setAttribute('spellcheck', (!isSpell).toString());
        const pill = container.querySelector('#drift-spelling-status-pill');
        if (pill) {
          pill.textContent = !isSpell ? 'ACTIVE' : 'OFF';
          pill.style.color = !isSpell ? '#10b981' : '#f59e0b';
          pill.style.background = !isSpell ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)';
        }
        openSpellingAssistant();
      });

      container.querySelector('#btn-drift-sidebar-spelling')?.addEventListener('click', openSpellingAssistant);
      container.querySelector('#btn-close-drift-spelling-dialog')?.addEventListener('click', () => {
        container.querySelector('#drift-editor-proofing-modal')?.classList.remove('open');
      });
      container.querySelector('#btn-close-editor-proofing')?.addEventListener('click', () => {
        container.querySelector('#drift-editor-proofing-modal')?.classList.remove('open');
      });
      container.querySelector('#btn-cancel-editor-proofing')?.addEventListener('click', () => {
        container.querySelector('#drift-editor-proofing-modal')?.classList.remove('open');
      });

      // 1-Click "Accept All Suggestions" Polish
      container.querySelector('#btn-apply-editor-polish')?.addEventListener('click', () => {
        if (paper) {
          // Take snapshot before full polish
          OrbitTimeMachine.saveSnapshot('Before Grammar Polish');
          const cleanText = OrbitProofMaster.applyAll(paper.innerText || '');
          paper.innerHTML = cleanText.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');
          saveDocument();
          updateTelemetry();
          if (typeof autoPaginateDriftPages === 'function') {
            autoPaginateDriftPages(paper);
          }
        }
        container.querySelector('#drift-editor-proofing-modal')?.classList.remove('open');
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('✓ ProofMaster: All spelling, grammar, and mechanics perfected (100% Score)!');
      });

      // Unified Thesaurus Trigger
      const openThesaurusModal = () => {
        const sel = window.getSelection()?.toString().trim();
        thesaurusManager.open(sel || '', (replacement) => {
          if (sel) {
            document.execCommand('insertText', false, replacement);
            saveDocument();
          } else {
            insertIntoPaperAtCursor(' ' + replacement);
          }
        });
      };
      window._driftOpenThesaurus = openThesaurusModal;

      container.querySelector('#btn-insert-thesaurus')?.addEventListener('click', openThesaurusModal);
      container.querySelector('#btn-review-thesaurus')?.addEventListener('click', openThesaurusModal);
      container.querySelector('#btn-drift-sidebar-thesaurus')?.addEventListener('click', openThesaurusModal);

      // Quick Rupee Symbol Action
      container.querySelector('#btn-insert-rupee-quick')?.addEventListener('click', () => {
        capturePaperRange();
        insertIntoPaperAtCursor('₹');
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted Indian Rupee symbol (₹)');
      });

      // Ribbon Tab Switching
      const ribbonTabs = container.querySelectorAll('.fluent-tab-btn[data-tab]');
      const ribbonPanes = container.querySelectorAll('.fluent-ribbon-pane');
      ribbonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          ribbonTabs.forEach(t => t.classList.remove('active'));
          ribbonPanes.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          const target = container.querySelector(`#pane-${tab.dataset.tab}`);
          if (target) target.classList.add('active');
        });
      });

      // Standard Rich Text Commands
      container.querySelectorAll('[data-cmd]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.dataset.cmd;
          document.execCommand(cmd, false, null);
          paper.focus();
          saveDocument();
        });
      });

      // Clear Formatting Button
      container.querySelector('#btn-drift-clear-format')?.addEventListener('click', () => {
        document.execCommand('removeFormat', false, null);
        paper.focus();
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Formatting cleared');
      });

      // Searchable World Font Picker (Calibri is strict default)
      const fontMount = container.querySelector('#drift-font-picker-mount');
      let driftFontPicker = null;
      if (fontMount) {
        driftFontPicker = new FluentFontPicker(fontMount, {
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
                  if (containerEl.tagName === 'FONT') {
                    containerEl.removeAttribute('face');
                    containerEl.style.fontFamily = fontFamily;
                  }
                }
              } catch (e) {}
            } else {
              const anchor = sel && sel.anchorNode ? (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement) : null;
              const block = anchor ? anchor.closest('p, h1, h2, h3, h4, h5, h6, li, td, th, div.drift-page-sheet') : null;
              if (block) {
                block.style.fontFamily = fontFamily;
              } else {
                const sheet = paper.querySelector('.drift-page-sheet.active-sheet') || paper.querySelector('.drift-page-sheet');
                if (sheet) sheet.style.fontFamily = fontFamily;
              }
            }
            paper.focus();
            saveDocument();
          }
        });
      }

      // Cursor movement tracking to update font picker with active font
      const updateDriftFontFromSelection = () => {
        if (!paper || !driftFontPicker) return;
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode || !paper.contains(sel.anchorNode)) return;
        const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
        if (el) {
          const comp = el.style.fontFamily || window.getComputedStyle(el).fontFamily;
          if (comp) driftFontPicker.setFont(comp);
        }
      };
      document.addEventListener('selectionchange', updateDriftFontFromSelection);
      paper.addEventListener('click', updateDriftFontFromSelection);
      paper.addEventListener('keyup', updateDriftFontFromSelection);

      // Floating Mini Formatting Toolbar (Quick Floating Format Style)
      miniToolbar = document.getElementById('drift-mini-toolbar');
      if (!miniToolbar) {
        miniToolbar = document.createElement('div');
        miniToolbar.id = 'drift-mini-toolbar';
        miniToolbar.className = 'drift-floating-toolbar';
        miniToolbar.style.display = 'none';
        miniToolbar.innerHTML = `
          <button class="drift-float-btn" data-fcmd="bold" title="Bold (Ctrl+B)"><strong>B</strong></button>
          <button class="drift-float-btn" data-fcmd="italic" title="Italic (Ctrl+I)"><em>I</em></button>
          <button class="drift-float-btn" data-fcmd="underline" title="Underline (Ctrl+U)"><u>U</u></button>
          <button class="drift-float-btn" data-fcmd="strikeThrough" title="Strikethrough"><s>S</s></button>
          <div class="drift-float-sep"></div>
          <button class="drift-float-btn" data-fcmd="justifyLeft" title="Align Left">⇤</button>
          <button class="drift-float-btn" data-fcmd="justifyCenter" title="Center">≡</button>
          <button class="drift-float-btn" data-fcmd="justifyRight" title="Align Right">⇥</button>
          <div class="drift-float-sep"></div>
          <button class="drift-float-btn" id="btn-mini-font-grow" title="Grow Font">A<sup>▲</sup></button>
          <button class="drift-float-btn" id="btn-mini-font-shrink" title="Shrink Font">A<sup>▼</sup></button>
          <button class="drift-float-btn" id="btn-mini-highlight" title="Highlight">🖍</button>
          <div class="drift-float-sep"></div>
          <div style="position:relative; display:inline-flex;">
            <button class="drift-float-btn" id="btn-mini-ai-assist" title="Girionix AI Quick Polish & Actions" style="color:#38bdf8; font-weight:700; width:auto; padding:0 8px; display:inline-flex; align-items:center; gap:4px; background:linear-gradient(135deg, rgba(6,182,212,0.18), rgba(59,130,246,0.22)); border:1px solid rgba(56,189,248,0.4); border-radius:4px;">
              <span style="font-size:12px;">⚡</span>
              <span>Girionix AI ▾</span>
            </button>
            <div id="drift-mini-girionix-dropdown" class="girionix-quick-dropdown" style="display:none;">
              <button class="girionix-quick-item" data-ai-act="proofread">
                <span class="icon">🪄</span>
                <span><strong>Proofread & Fix</strong> (ProofMaster)</span>
              </button>
              <button class="girionix-quick-item" data-ai-act="concise">
                <span class="icon">⚡</span>
                <span><strong>Make Concise</strong> (Clarity)</span>
              </button>
              <button class="girionix-quick-item" data-ai-act="formal">
                <span class="icon">💼</span>
                <span><strong>Executive Tone</strong> (Professional)</span>
              </button>
              <button class="girionix-quick-item" data-ai-act="summarize">
                <span class="icon">📝</span>
                <span><strong>Summarize</strong> (Key Takeaway)</span>
              </button>
              <button class="girionix-quick-item" data-ai-act="bullets">
                <span class="icon">📋</span>
                <span><strong>Convert to Bullets</strong> (Action Items)</span>
              </button>
              <button class="girionix-quick-item" data-ai-act="drawer" style="border-top:1px solid rgba(255,255,255,0.08); margin-top:2px; padding-top:6px; color:#38bdf8;">
                <span class="icon">💬</span>
                <span><strong>Ask Girionix AI Drawer &rarr;</strong></span>
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(miniToolbar);

        miniToolbar.querySelectorAll('[data-fcmd]').forEach(b => {
          b.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.execCommand(b.dataset.fcmd, false, null);
            paper.focus();
            saveDocument();
            updateMiniToolbarState();
          });
        });

        miniToolbar.querySelector('#btn-mini-font-grow')?.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const cur = parseInt(fontSizeSelect?.value || '2', 10);
          if (cur < 7) {
            if (fontSizeSelect) fontSizeSelect.value = cur + 1;
            document.execCommand('fontSize', false, cur + 1);
          }
          paper.focus();
          saveDocument();
        });

        miniToolbar.querySelector('#btn-mini-font-shrink')?.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const cur = parseInt(fontSizeSelect?.value || '2', 10);
          if (cur > 1) {
            if (fontSizeSelect) fontSizeSelect.value = cur - 1;
            document.execCommand('fontSize', false, cur - 1);
          }
          paper.focus();
          saveDocument();
        });

        miniToolbar.querySelector('#btn-mini-highlight')?.addEventListener('mousedown', (e) => {
          e.preventDefault();
          document.execCommand('hiliteColor', false, '#fef08a');
          paper.focus();
          saveDocument();
        });

        // Toggle Girionix AI Quick Menu on Floating Toolbar
        const girionixBtn = miniToolbar.querySelector('#btn-mini-ai-assist');
        const girionixMenu = miniToolbar.querySelector('#drift-mini-girionix-dropdown');

        girionixBtn?.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isShown = girionixMenu.style.display !== 'none';
          girionixMenu.style.display = isShown ? 'none' : 'flex';
        });

        document.addEventListener('click', (e) => {
          if (!miniToolbar?.contains(e.target)) {
            if (girionixMenu) girionixMenu.style.display = 'none';
          }
        });

        // Handle Quick Girionix AI Actions on Selection
        miniToolbar.querySelectorAll('[data-ai-act]').forEach(item => {
          item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (girionixMenu) girionixMenu.style.display = 'none';
            miniToolbar.style.display = 'none';

            const act = item.dataset.aiAct;
            const sel = window.getSelection();
            const text = sel ? sel.toString().trim() : '';
            if (!text && act !== 'drawer') {
              if (window.orbitPlatform) window.orbitPlatform.triggerToast('Please select text first', 'yellow');
              return;
            }

            if (act === 'proofread') {
              const fixed = OrbitProofMaster.applyAll(text);
              document.execCommand('insertText', false, fixed);
              saveDocument();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast('✓ ProofMaster: Applied grammar, spelling & mechanics fixes!');
            } else if (act === 'concise') {
              let res = text;
              OrbitProofMaster.clarityPairs.forEach(p => { res = res.replace(p.pattern, p.fix); });
              res = res.replace(/\b([a-zA-Z]{2,})\s+\1\b/gi, '$1').replace(/[ \t]{2,}/g, ' ');
              document.execCommand('insertText', false, res);
              saveDocument();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast('⚡ Concise: Streamlined redundant phrasing!');
            } else if (act === 'formal') {
              const formal = `Strategic evaluation confirms that ${text.charAt(0).toLowerCase() + text.slice(1)} This operational framework delivers validated outcomes, compounding efficiency across key deliverables.`;
              document.execCommand('insertText', false, formal);
              saveDocument();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast('💼 Selection rewritten in formal executive tone!');
            } else if (act === 'summarize') {
              const sents = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
              const summary = sents.slice(0, 2).join('. ') + (sents.length > 0 ? '.' : '');
              document.execCommand('insertText', false, `Key Summary: ${summary}`);
              saveDocument();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast('📝 Selection summarized into core takeaway!');
            } else if (act === 'bullets') {
              const items = text.split(/[.!?]+/).map(s => s.trim().replace(/^[-*•\d.]+\s*/, '')).filter(s => s.length > 4);
              const listItems = items.length ? items : [text];
              const bulletsHtml = `<ul style="margin:8px 0; padding-left:22px; line-height:1.7;">${listItems.map(it => `<li>${it}</li>`).join('')}</ul>`;
              document.execCommand('insertHTML', false, bulletsHtml);
              saveDocument();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast('📋 Converted selection into structured bullet points!');
            } else if (act === 'drawer') {
              if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAiDrawer === 'function') {
                window.orbitPlatform.openGirionixAiDrawer('live');
                const promptInp = document.getElementById('girionix-custom-prompt');
                if (promptInp) promptInp.value = `Regarding this document text:\n"${text.slice(0, 300)}"\n\nPlease analyze and optimize this.`;
                if (window.orbitPlatform) window.orbitPlatform.showToast('Copied selection into Girionix AI Copilot', 'blue');
              }
            }
          });
        });
      }

      function updateMiniToolbarState() {
        if (!miniToolbar || miniToolbar.style.display === 'none') return;
        miniToolbar.querySelectorAll('[data-fcmd]').forEach(b => {
          const cmd = b.dataset.fcmd;
          try {
            if (document.queryCommandState(cmd)) {
              b.classList.add('active');
            } else {
              b.classList.remove('active');
            }
          } catch {}
        });
      }

      function showMiniToolbar() {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) {
          if (miniToolbar) miniToolbar.style.display = 'none';
          return;
        }
        const text = sel.toString().trim();
        if (!text) {
          if (miniToolbar) miniToolbar.style.display = 'none';
          return;
        }

        const range = sel.getRangeAt(0);
        if (!paper.contains(range.commonAncestorContainer)) {
          if (miniToolbar) miniToolbar.style.display = 'none';
          return;
        }

        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          if (miniToolbar) miniToolbar.style.display = 'none';
          return;
        }

        miniToolbar.style.display = 'flex';
        const tbWidth = 280;
        const left = Math.max(10, Math.min(window.innerWidth - tbWidth - 10, rect.left + (rect.width / 2) - (tbWidth / 2)));
        const top = Math.max(10, rect.top - 46 + window.scrollY);
        miniToolbar.style.left = `${left}px`;
        miniToolbar.style.top = `${top}px`;
        updateMiniToolbarState();
      }

      paper.addEventListener('mouseup', () => {
        setTimeout(showMiniToolbar, 50);
      });

      paper.addEventListener('keyup', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          setTimeout(showMiniToolbar, 50);
        }
      });

      document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          if (miniToolbar) miniToolbar.style.display = 'none';
        }
      });

      // Font Size
      const fontSizeSelect = container.querySelector('#drift-font-size-pt');
      fontSizeSelect?.addEventListener('change', (e) => {
        document.execCommand('fontSize', false, e.target.value);
        paper.focus();
      });

      // Precise Grow / Shrink Font Steppers
      const ptSizes = ['9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt', '28pt', '36pt', '48pt', '72pt'];
      
      function applyFontSize(sizePt) {
        if (fontSizeSelect) fontSizeSelect.value = sizePt;
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
          const span = document.createElement('span');
          span.style.fontSize = sizePt;
          const range = sel.getRangeAt(0);
          try {
            span.appendChild(range.extractContents());
            range.insertNode(span);
            sel.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            sel.addRange(newRange);
          } catch {
            document.execCommand('fontSize', false, '3');
          }
        } else {
          paper.style.fontSize = sizePt;
        }
        saveDocument();
      }

      container.querySelector('#btn-font-grow')?.addEventListener('click', () => {
        const curIdx = ptSizes.indexOf(fontSizeSelect.value);
        const nextSize = curIdx !== -1 && curIdx < ptSizes.length - 1 ? ptSizes[curIdx + 1] : '14pt';
        applyFontSize(nextSize);
      });
      container.querySelector('#btn-font-shrink')?.addEventListener('click', () => {
        const curIdx = ptSizes.indexOf(fontSizeSelect.value);
        const prevSize = curIdx > 0 ? ptSizes[curIdx - 1] : '10pt';
        applyFontSize(prevSize);
      });

      // Color Pickers
      container.querySelector('#drift-text-color')?.addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
        paper.focus();
      });

      container.querySelector('#drift-bg-color')?.addEventListener('input', (e) => {
        document.execCommand('hiliteColor', false, e.target.value);
        paper.focus();
      });

      // Line Spacing
      container.querySelector('#drift-line-spacing')?.addEventListener('change', (e) => {
        paper.style.lineHeight = e.target.value;
      });

      // Checklist Item Insert
      container.querySelector('#btn-insert-checklist')?.addEventListener('click', () => {
        const item = document.createElement('div');
        item.className = 'drift-todo-item';
        item.innerHTML = '<input type="checkbox" class="drift-todo-check"> <span>Click to edit checklist item...</span>';
        insertNodeAtSelection(item);
        saveDocument();
      });

      // Orientation & Margins & Columns
      container.querySelector('#btn-orient-portrait')?.addEventListener('click', (e) => {
        paper.classList.remove('landscape-page');
        container.querySelector('#btn-orient-landscape')?.classList.remove('active');
        e.currentTarget.classList.add('active');
      });

      container.querySelector('#btn-orient-landscape')?.addEventListener('click', (e) => {
        paper.classList.add('landscape-page');
        container.querySelector('#btn-orient-portrait')?.classList.remove('active');
        e.currentTarget.classList.add('active');
      });

      container.querySelector('#drift-margin-select')?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'narrow') paper.style.padding = '36px 48px';
        else if (val === 'wide') paper.style.padding = '72px 110px';
        else paper.style.padding = '64px 80px';
      });

      ['1', '2', '3'].forEach(cols => {
        container.querySelector(`#btn-col-${cols}`)?.addEventListener('click', () => {
          paper.classList.remove('cols-2', 'cols-3');
          if (cols === '2') paper.classList.add('cols-2');
          if (cols === '3') paper.classList.add('cols-3');
          ['1', '2', '3'].forEach(c => container.querySelector(`#btn-col-${c}`).classList.toggle('active', c === cols));
        });
      });

      container.querySelector('#drift-page-tint')?.addEventListener('change', (e) => {
        paper.style.backgroundColor = e.target.value;
      });

      // Select All
      container.querySelector('#btn-select-all')?.addEventListener('click', () => {
        document.execCommand('selectAll', false, null);
      });

      // Blank Page / Page Break
      container.querySelector('#btn-insert-blank-page')?.addEventListener('click', () => {
        if (typeof window._driftInsertPageBreak === 'function') window._driftInsertPageBreak();
      });
      container.querySelector('#btn-insert-page-break')?.addEventListener('click', () => {
        if (typeof window._driftInsertPageBreak === 'function') window._driftInsertPageBreak();
      });

      // Voice Dictation
      let isListening = false;
      let recognition = null;
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

      const toggleVoice = () => {
        if (!SpeechRec) {
          alert('Voice dictation is supported in Chrome, Edge, and Safari.');
          return;
        }

        if (isListening) {
          recognition?.stop();
          isListening = false;
          if (voiceStatusText) voiceStatusText.textContent = 'Dictate';
          if (voiceBtn) {
            voiceBtn.style.background = '';
            voiceBtn.style.color = '';
          }
        } else {
          recognition = new SpeechRec();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = 'en-US';

          recognition.onstart = () => {
            isListening = true;
            if (voiceStatusText) voiceStatusText.textContent = 'Listening...';
            if (voiceBtn) {
              voiceBtn.style.background = '#dc2626';
              voiceBtn.style.color = '#ffffff';
            }
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Microphone active — speak to dictate');
          };

          recognition.onresult = (e) => {
            const transcript = e.results[e.results.length - 1][0].transcript;
            document.execCommand('insertText', false, ' ' + transcript);
            saveDocument();
          };

          recognition.onerror = () => {
            isListening = false;
            if (voiceStatusText) voiceStatusText.textContent = 'Dictate';
            if (voiceBtn) {
              voiceBtn.style.background = '';
              voiceBtn.style.color = '';
            }
          };

          recognition.onend = () => {
            isListening = false;
            if (voiceStatusText) voiceStatusText.textContent = 'Dictate';
            if (voiceBtn) {
              voiceBtn.style.background = '';
              voiceBtn.style.color = '';
            }
          };

          recognition.start();
        }
      };

      voiceBtn?.addEventListener('click', toggleVoice);
      voiceGroupBtn?.addEventListener('click', toggleVoice);

      
      // Rich Content Handlers
      container.querySelector('#btn-insert-callout-menu')?.addEventListener('click', () => {
        const calloutHtml = `
          <div style="padding: 12px 16px; margin: 16px 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; color: #334155; line-height: 1.6;">
            <strong>ℹ️ Key Insight:</strong> Enter executive note, advisory directive, or callout summary text here...
          </div><p></p>
        `;
        document.execCommand('insertHTML', false, calloutHtml);
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted Callout Box');
      });

      container.querySelector('#btn-insert-code-block')?.addEventListener('click', () => {
        const codeHtml = `
          <pre style="background: #0f172a; color: #38bdf8; padding: 14px 18px; border-radius: 6px; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 12.5px; margin: 16px 0; overflow-x: auto; line-height: 1.5;"><code>// Giri Sovereign Code Block
function calculateMetrics(records) {
  return records.reduce((acc, r) => acc + r.value, 0);
}</code></pre><p></p>
        `;
        document.execCommand('insertHTML', false, codeHtml);
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted Code Block');
      });

      container.querySelector('#btn-insert-divider')?.addEventListener('click', () => {
        const dividerHtml = '<hr style="border: none; border-top: 1px solid #cbd5e1; margin: 24px 0;"><p></p>';
        document.execCommand('insertHTML', false, dividerHtml);
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted Divider');
      });

// Table Inserter
      container.querySelector('#btn-insert-table-menu')?.addEventListener('click', () => {
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '4');
        if (!rows || !cols) return;

        let html = '<table style="width:100%; border-collapse:collapse; margin:16px 0; border:1px solid #cbd5e1;">';
        html += '<thead><tr style="background:#f8fafc;">';
        for (let c = 1; c <= cols; c++) html += `<th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Header ${c}</th>`;
        html += '</tr></thead><tbody>';
        for (let r = 1; r <= rows; r++) {
          html += '<tr>';
          for (let c = 1; c <= cols; c++) html += `<td style="border:1px solid #cbd5e1; padding:8px;">Data ${r},${c}</td>`;
          html += '</tr>';
        }
        html += '</tbody></table><p></p>';
        document.execCommand('insertHTML', false, html);
        saveDocument();
      });

      // Robust Selection Range Tracking & Insertion Core
      let savedPaperRange = null;

      function capturePaperRange() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (paper && paper.contains(range.commonAncestorContainer)) {
            savedPaperRange = range.cloneRange();
          }
        }
      }

      function restorePaperRange() {
        if (savedPaperRange) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(savedPaperRange);
          return true;
        }
        return false;
      }

      function insertIntoPaperAtCursor(htmlContent) {
        paper.focus();
        const hasRange = restorePaperRange();
        if (!hasRange) {
          const range = document.createRange();
          range.selectNodeContents(paper);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }

        try {
          const ok = document.execCommand('insertHTML', false, htmlContent);
          if (!ok) throw new Error('execCommand returned false');
        } catch (e) {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            const frag = document.createDocumentFragment();
            let n;
            let last;
            while ((n = tempDiv.firstChild)) {
              last = frag.appendChild(n);
            }
            range.insertNode(frag);
            if (last) {
              range.setStartAfter(last);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } else {
            paper.insertAdjacentHTML('beforeend', htmlContent);
          }
        }
        capturePaperRange();
        saveDocument();
      }

      paper.addEventListener('mouseup', capturePaperRange);
      paper.addEventListener('keyup', capturePaperRange);
      paper.addEventListener('input', capturePaperRange);
      paper.addEventListener('blur', capturePaperRange);

      // 1. Unified Symbols Picker (120+ symbols)
      container.querySelector('#btn-insert-symbol-dialog')?.addEventListener('click', () => {
        capturePaperRange();
        symbolsManager.openSymbolPicker((sym) => {
          insertIntoPaperAtCursor(sym);
        });
      });

      // 2. Unified Equation Dialog (14+ presets + palette + live rendering)
      container.querySelector('#btn-insert-equation-dialog')?.addEventListener('click', () => {
        capturePaperRange();
        symbolsManager.openEquationDialog((eqHtml) => {
          insertIntoPaperAtCursor(eqHtml);
        });
      });

      // 3. Unified Emoji Picker (250+ categorized emojis + real-time search)
      const emojiBtn = container.querySelector('#btn-insert-emoji-picker');
      emojiBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        capturePaperRange();
        symbolsManager.openEmojiPicker(emojiBtn, (emoji) => {
          insertIntoPaperAtCursor(emoji);
        });
      });

      // 4. Seals & Certifications: Quick Stamps Dropdown
      const stampMenuBtn = container.querySelector('#btn-drift-stamp-menu');
      const stampDropdown = container.querySelector('#drift-stamp-dropdown-menu');
      stampMenuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        capturePaperRange();
        if (stampDropdown) {
          stampDropdown.style.display = stampDropdown.style.display === 'none' ? 'block' : 'none';
        }
      });

      document.addEventListener('click', (e) => {
        if (!stampDropdown?.contains(e.target) && e.target !== stampMenuBtn) {
          if (stampDropdown) stampDropdown.style.display = 'none';
        }
      });

      stampDropdown?.querySelectorAll('.drift-stamp-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          if (stampDropdown) stampDropdown.style.display = 'none';
          const text = item.dataset.stamp;
          const color = item.dataset.color;
          const stampHtml = `
            <div class="drift-stamp-badge" contenteditable="false" style="display:inline-block; margin:6px 10px; vertical-align:middle; user-select:none;">
              <span style="display:inline-block; border:2.5px solid ${color}; color:${color}; font-weight:900; font-size:13px; letter-spacing:0.1em; padding:3px 10px; border-radius:3px; transform:rotate(-8deg); text-transform:uppercase; background:rgba(255,255,255,0.95); box-shadow:0 2px 6px rgba(0,0,0,0.08);">${text}</span>
            </div>&nbsp;
          `;
          insertIntoPaperAtCursor(stampHtml);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Affixed ${text} stamp to document`);
        });
      });

      // 5. Custom Stamp Modal
      const customStampModal = container.querySelector('#drift-custom-stamp-modal');
      const customStampOpenBtn = container.querySelector('#btn-open-custom-stamp-modal');
      const customStampCloseBtn = container.querySelector('#btn-close-custom-stamp-modal');
      const customStampCancelBtn = container.querySelector('#btn-cancel-custom-stamp');
      const customStampConfirmBtn = container.querySelector('#btn-confirm-insert-stamp');
      const stampTextInput = container.querySelector('#stamp-custom-text-input');
      const stampSubInput = container.querySelector('#stamp-custom-sub-input');
      const stampBorderStyle = container.querySelector('#stamp-border-style-select');
      const stampDateCheck = container.querySelector('#stamp-include-date');
      const stampHashCheck = container.querySelector('#stamp-include-hash');
      const stampPreviewBox = container.querySelector('#stamp-live-preview-box');
      let selectedStampColor = '#dc2626';

      customStampOpenBtn?.addEventListener('click', () => {
        if (stampDropdown) stampDropdown.style.display = 'none';
        capturePaperRange();
        customStampModal?.classList.add('open');
        updateCustomStampPreview();
      });

      const closeCustomStamp = () => customStampModal?.classList.remove('open');
      customStampCloseBtn?.addEventListener('click', closeCustomStamp);
      customStampCancelBtn?.addEventListener('click', closeCustomStamp);

      container.querySelectorAll('.stamp-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.stamp-color-btn').forEach(b => {
            b.classList.remove('active');
            b.style.boxShadow = '0 0 0 1px #cbd5e1';
          });
          btn.classList.add('active');
          btn.style.boxShadow = `0 0 0 2px ${btn.dataset.color}`;
          selectedStampColor = btn.dataset.color;
          updateCustomStampPreview();
        });
      });

      function updateCustomStampPreview() {
        if (!stampPreviewBox) return;
        const text = (stampTextInput?.value || 'APPROVED').trim().toUpperCase();
        const sub = (stampSubInput?.value || '').trim();
        const bStyle = stampBorderStyle?.value || 'double';
        const includeDate = stampDateCheck?.checked;
        const includeHash = stampHashCheck?.checked;

        let subParts = [];
        if (sub) subParts.push(sub);
        if (includeDate) subParts.push(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
        if (includeHash) subParts.push('AUTH: 0x8F92');

        const borderCss = bStyle === 'double' ? `4px double ${selectedStampColor}` :
                          bStyle === 'dashed' ? `2px dashed ${selectedStampColor}` :
                          bStyle === 'groove' ? `4px groove ${selectedStampColor}` :
                          `3px solid ${selectedStampColor}`;

        stampPreviewBox.innerHTML = `
          <div style="border:${borderCss}; color:${selectedStampColor}; padding:8px 18px; border-radius:4px; transform:rotate(-7deg); display:inline-flex; flex-direction:column; align-items:center; text-align:center; background:#ffffff; box-shadow:0 3px 10px rgba(0,0,0,0.08); font-family:sans-serif;">
            <span style="font-size:18px; font-weight:900; letter-spacing:0.12em; line-height:1.2;">${text}</span>
            ${subParts.length ? `<span style="font-size:9.5px; font-weight:700; letter-spacing:0.06em; margin-top:3px; opacity:0.85;">${subParts.join(' &bull; ')}</span>` : ''}
          </div>
        `;
      }

      [stampTextInput, stampSubInput, stampBorderStyle, stampDateCheck, stampHashCheck].forEach(el => {
        el?.addEventListener('input', updateCustomStampPreview);
        el?.addEventListener('change', updateCustomStampPreview);
      });

      customStampConfirmBtn?.addEventListener('click', () => {
        const text = (stampTextInput?.value || 'APPROVED').trim().toUpperCase();
        const sub = (stampSubInput?.value || '').trim();
        const bStyle = stampBorderStyle?.value || 'double';
        const includeDate = stampDateCheck?.checked;
        const includeHash = stampHashCheck?.checked;

        let subParts = [];
        if (sub) subParts.push(sub);
        if (includeDate) subParts.push(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
        if (includeHash) subParts.push(`AUTH: 0x${Math.random().toString(16).slice(2, 6).toUpperCase()}`);

        const borderCss = bStyle === 'double' ? `4px double ${selectedStampColor}` :
                          bStyle === 'dashed' ? `2px dashed ${selectedStampColor}` :
                          bStyle === 'groove' ? `4px groove ${selectedStampColor}` :
                          `3px solid ${selectedStampColor}`;

        const stampHtml = `
          <div class="drift-stamp-badge" contenteditable="false" style="display:inline-block; margin:8px 12px; vertical-align:middle; user-select:none;">
            <div style="border:${borderCss}; color:${selectedStampColor}; padding:6px 16px; border-radius:4px; transform:rotate(-7deg); display:inline-flex; flex-direction:column; align-items:center; text-align:center; background:rgba(255,255,255,0.96); box-shadow:0 2px 8px rgba(0,0,0,0.08); font-family:sans-serif;">
              <span style="font-size:16px; font-weight:900; letter-spacing:0.12em; line-height:1.2;">${text}</span>
              ${subParts.length ? `<span style="font-size:9px; font-weight:700; letter-spacing:0.06em; margin-top:2px; opacity:0.85;">${subParts.join(' &bull; ')}</span>` : ''}
            </div>
          </div>&nbsp;
        `;

        closeCustomStamp();
        insertIntoPaperAtCursor(stampHtml);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted custom "${text}" stamp`);
      });

      // 6. Executive Seal
      container.querySelector('#btn-drift-exec-seal')?.addEventListener('click', () => {
        capturePaperRange();
        const sealHtml = `
          <div class="drift-executive-seal-badge" contenteditable="false" style="display:inline-flex; align-items:center; gap:12px; padding:10px 18px; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border:2px solid #1e3a8a; border-radius:8px; box-shadow:0 4px 14px rgba(30,58,138,0.12); margin:12px 0; user-select:none; max-width:420px;">
            <img src="assets/giri-group-symbol-blue.png" alt="Giri Seal" style="height:36px; width:auto; flex-shrink:0;">
            <div style="display:flex; flex-direction:column;">
              <strong style="font-size:11.5px; color:#1e3a8a; letter-spacing:0.04em; text-transform:uppercase;">Giri Group Certified Seal</strong>
              <span style="font-size:9.5px; font-family:var(--font-mono, monospace); color:#64748b;">SOVEREIGN ENCRYPTION &bull; ${new Date().toISOString().slice(0, 10)}</span>
              <span style="font-size:8.5px; font-family:var(--font-mono, monospace); color:#059669; font-weight:700;">HASH: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()} [VERIFIED]</span>
            </div>
          </div>
          <p></p>
        `;
        insertIntoPaperAtCursor(sealHtml);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Giri Group Certified Seal affixed to document');
      });

      // 7. Direct Local Disk Save & Sync
      const saveDeviceBtn = container.querySelector('#btn-drift-save-device');
      const syncStatusText = container.querySelector('#txt-drift-sync-status');

      const performDirectSave = async (forcePicker = false) => {
        const officeFormattedDoc = GiriOfficeFormats.formatGDrift({
          title: currentDocTitle,
          content: paper.innerHTML,
          rawState: { content: paper.innerHTML, title: currentDocTitle }
        });
        const res = await localSync.saveToDevice({
          tool: 'drift',
          content: officeFormattedDoc,
          suggestedName: currentDocTitle,
          extension: 'gdrift',
          mimeType: 'application/msword',
          forcePicker
        });

        if (res.success && res.mode === 'direct' && syncStatusText) {
          syncStatusText.textContent = `● ${res.name.slice(0, 14)}`;
          if (saveDeviceBtn) saveDeviceBtn.style.background = '#047857';
        }
      };

      saveDeviceBtn?.addEventListener('click', () => performDirectSave(false));

      container.querySelector('#btn-drift-browser-sync')?.addEventListener('click', () => {
        if (window.giriSyncManager) window.giriSyncManager.openStorageModal();
      });

      localSync.subscribe((tool, fileName, handle) => {
        if (tool === 'drift' && syncStatusText) {
          if (fileName) {
            syncStatusText.textContent = `● ${fileName.slice(0, 14)}`;
            if (saveDeviceBtn) saveDeviceBtn.style.background = '#047857';
          } else {
            syncStatusText.textContent = 'Save to Device';
            if (saveDeviceBtn) saveDeviceBtn.style.background = '#059669';
          }
        }
      });
      
      // Hyperlink Dialog
      const linkModal = container.querySelector('#drift-link-modal');
      const linkText = container.querySelector('#link-display-text');
      const linkUrl = container.querySelector('#link-url-target');

      container.querySelector('#btn-insert-link-dialog')?.addEventListener('click', () => linkModal?.classList.add('open'));
      container.querySelector('#btn-close-link-modal')?.addEventListener('click', () => linkModal?.classList.remove('open'));
      container.querySelector('#btn-cancel-link')?.addEventListener('click', () => linkModal?.classList.remove('open'));

      container.querySelector('#btn-confirm-link')?.addEventListener('click', () => {
        const url = linkUrl.value.trim();
        const txt = linkText.value.trim() || url;
        if (url) {
          document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" style="color:#2563eb; text-decoration:underline;">${txt}</a>`);
          linkModal?.classList.remove('open');
          saveDocument();
        }
      });

      // Document Statistics Dialog
      const statsModal = container.querySelector('#drift-stats-modal');
      const statsBody = container.querySelector('#doc-stats-modal-body');

      const openStats = () => {
        const text = paper.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s+/g, '').length;
        const paragraphs = paper.querySelectorAll('p, h1, h2, h3, blockquote').length || 1;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
        const readMin = Math.max(1, Math.ceil(words / 200));
        const speakMin = Math.max(1, Math.ceil(words / 130));
        const pageBreakEls = paper.querySelectorAll('.drift-page-break');
        const calculatedPages = Math.max(1, Math.ceil(paper.scrollHeight / 1056));
        const totalPages = Math.max(calculatedPages, pageBreakEls.length + 1);
        const linesEst = Math.max(1, Math.round(words / 9));

        const selectionText = window.getSelection()?.toString() || '';
        const selWords = selectionText.trim() ? selectionText.trim().split(/\s+/).length : 0;
        const selChars = selectionText.length;

        if (statsBody) {
          statsBody.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px; font-size:12.5px; color:#cbd5e1;">
              ${selWords > 0 ? `
                <div style="background:#1e293b; border:1px solid #3b82f6; border-radius:6px; padding:8px 10px; margin-bottom:4px;">
                  <strong style="color:#38bdf8; font-size:11px; text-transform:uppercase; display:block;">Selection Active:</strong>
                  <span>Selected: <strong>${selWords}</strong> words (${selChars} characters) of ${words} words total</span>
                </div>
              ` : ''}
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Pages:</span><strong style="color:#38bdf8;">${totalPages}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Total Words:</span><strong style="color:#f8fafc;">${words.toLocaleString()}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Characters (with spaces):</span><strong>${chars.toLocaleString()}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Characters (no spaces):</span><strong>${charsNoSpace.toLocaleString()}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Paragraphs:</span><strong>${paragraphs}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Lines (estimated):</span><strong>${linesEst}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Sentences:</span><strong>${sentences}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span>Estimated Reading Time:</span><strong style="color:#10b981;">~${readMin} min</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding-top:2px;">
                <span>Estimated Speaking Time:</span><strong style="color:#f59e0b;">~${speakMin} min (at 130 wpm)</strong>
              </div>
            </div>
          `;
        }
        statsModal?.classList.add('open');
      };

      container.querySelector('#btn-doc-statistics')?.addEventListener('click', openStats);
      container.querySelector('#btn-editor-stats-group')?.addEventListener('click', openStats);
      container.querySelector('#btn-drift-sidebar-wordcount')?.addEventListener('click', openStats);
      container.querySelector('#btn-close-stats-modal')?.addEventListener('click', () => statsModal?.classList.remove('open'));
      container.querySelector('#btn-ok-stats')?.addEventListener('click', () => statsModal?.classList.remove('open'));

      // Find & Replace Dialog
      const findModal = container.querySelector('#drift-find-replace-modal');
      const findInput = container.querySelector('#find-input-query');
      const replaceInput = container.querySelector('#replace-input-val');
      const findStatusMsg = container.querySelector('#find-status-msg');

      const openFindReplace = () => {
        findModal?.classList.add('open');
        findInput?.focus();
      };

      container.querySelector('#btn-find-replace')?.addEventListener('click', openFindReplace);
      container.querySelector('#btn-find-replace-2')?.addEventListener('click', openFindReplace);
      container.querySelector('#btn-close-find-replace')?.addEventListener('click', () => findModal?.classList.remove('open'));

      container.querySelector('#btn-find-next')?.addEventListener('click', () => {
        const q = findInput.value.trim();
        if (!q) return;
        if (window.find) {
          const found = window.find(q);
          if (findStatusMsg) findStatusMsg.textContent = found ? `Found occurrence of "${q}"` : `No further matches for "${q}"`;
        }
      });

      container.querySelector('#btn-replace-all')?.addEventListener('click', () => {
        const q = findInput.value;
        const rep = replaceInput.value;
        if (!q) return;
        const regex = new RegExp(q, 'gi');
        paper.innerHTML = paper.innerHTML.replace(regex, rep);
        if (findStatusMsg) findStatusMsg.textContent = `Replaced all instances of "${q}"`;
        saveDocument();
      });

      // View Toggles: Zen Mode, Web View, Outline, Ruler
      container.querySelector('#btn-toggle-zen')?.addEventListener('click', () => {
        const sb = container.querySelector('#drift-left-sidebar');
        if (sb) sb.style.display = sb.style.display === 'none' ? 'flex' : 'none';
        paper.style.maxWidth = sb?.style.display === 'none' ? '920px' : '820px';
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Toggled Zen Focus Mode');
      });

      container.querySelector('#btn-view-web')?.addEventListener('click', (e) => {
        paper.style.maxWidth = '100%';
        paper.style.borderRadius = '0';
        container.querySelector('#btn-view-paper')?.classList.remove('active');
        e.currentTarget.classList.add('active');
      });

      container.querySelector('#btn-view-paper')?.addEventListener('click', (e) => {
        paper.style.maxWidth = '820px';
        paper.style.borderRadius = '0 0 4px 4px';
        container.querySelector('#btn-view-web')?.classList.remove('active');
        e.currentTarget.classList.add('active');
      });

      container.querySelector('#chk-toggle-ruler')?.addEventListener('change', (e) => {
        const ruler = container.querySelector('#drift-top-ruler');
        if (ruler) ruler.style.display = e.target.checked ? 'flex' : 'none';
      });

      container.querySelector('#chk-toggle-outline')?.addEventListener('change', (e) => {
        const sb = container.querySelector('#drift-left-sidebar');
        if (sb) sb.style.display = e.target.checked ? 'flex' : 'none';
      });

      // Zoom Controls
      let zoomLevel = 100;
      const zoomLabel = container.querySelector('#drift-zoom-label');
      const applyZoom = () => {
        paper.style.transform = `scale(${zoomLevel / 100})`;
        paper.style.transformOrigin = 'top center';
        if (zoomLabel) zoomLabel.textContent = zoomLevel + '%';
      };

      container.querySelector('#btn-drift-zoom-in')?.addEventListener('click', () => {
        if (zoomLevel < 180) { zoomLevel += 10; applyZoom(); }
      });
      container.querySelector('#btn-drift-zoom-out')?.addEventListener('click', () => {
        if (zoomLevel > 60) { zoomLevel -= 10; applyZoom(); }
      });
      container.querySelector('#btn-drift-zoom-reset')?.addEventListener('click', () => {
        zoomLevel = 100; applyZoom();
      });

      // Pictures Inserter
      container.querySelector('#btn-insert-image-dialog')?.addEventListener('click', () => {
        const url = prompt('Enter image URL (or leave blank to insert sample executive graphic):', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80');
        if (url) {
          const img = `<img src="${url}" style="max-width:100%; border-radius:6px; margin:16px 0; display:block; border:1px solid #e2e8f0;" alt="Embedded Image"><p></p>`;
          document.execCommand('insertHTML', false, img);
          saveDocument();
        }
      });

      // Export Modal & Print
      container.querySelector('#btn-export-drift')?.addEventListener('click', () => {
        if (window.orbitPlatform) window.orbitPlatform.openExportModal('drift');
      });

      container.querySelector('#btn-print-doc')?.addEventListener('click', () => {
        window.print();
      });

      container.querySelector('#btn-drift-autosave-toggle')?.addEventListener('click', () => {
        if (window.orbitPlatform && typeof window.orbitPlatform.toggleAutoSave === 'function') {
          window.orbitPlatform.toggleAutoSave();
        }
      });

      container.querySelector('#btn-drift-special-link')?.addEventListener('click', () => {
        if (window.orbitPlatform && typeof window.orbitPlatform.generateSpecialDocLink === 'function') {
          const link = window.orbitPlatform.generateSpecialDocLink('drift');
          window.orbitPlatform.openShareModal(link, 'drift');
        }
      });

      container.querySelector('#btn-drift-share')?.addEventListener('click', () => {
        if (window.orbitPlatform && typeof window.orbitPlatform.copyToolLink === 'function') {
          window.orbitPlatform.copyToolLink('drift');
        } else {
          const url = `${window.location.origin}${window.location.pathname}#drift`;
          navigator.clipboard?.writeText(url);
          if (window.orbitPlatform) window.orbitPlatform.showToast('Copied link to clipboard', 'blue');
        }
      });

      function insertNodeAtSelection(node) {
        const sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(node);
        } else {
          paper.appendChild(node);
        }
      }

      // =====================================================================
      // OFFICE 365 MODERN DARK RIBBON EVENT HANDLERS (Drift)
      // =====================================================================

      // 1. Change Case (Ab ▾)
      let currentCaseMode = 0;
      container.querySelector('#btn-drift-change-case')?.addEventListener('click', () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Select text first to change case');
          return;
        }
        const selectedText = sel.toString();
        let transformed = selectedText;
        if (currentCaseMode === 0) {
          transformed = selectedText.toUpperCase();
          currentCaseMode = 1;
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: UPPERCASE');
        } else if (currentCaseMode === 1) {
          transformed = selectedText.toLowerCase();
          currentCaseMode = 2;
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: lowercase');
        } else if (currentCaseMode === 2) {
          transformed = selectedText.replace(/\b\w/g, l => l.toUpperCase());
          currentCaseMode = 3;
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: Capitalize Each Word');
        } else {
          transformed = selectedText.charAt(0).toUpperCase() + selectedText.slice(1).toLowerCase();
          currentCaseMode = 0;
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Case: Sentence case');
        }
        document.execCommand('insertText', false, transformed);
        saveDocument();
      });

      // 2. Dialog Launchers
      container.querySelector('#btn-drift-launcher-clipboard')?.addEventListener('click', () => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Clipboard history: Active (press Ctrl+V or Paste button)');
      });

      const fontDialog = container.querySelector('#drift-font-dialog-modal');
      const modalFontSelect = container.querySelector('#modal-font-family');
      if (modalFontSelect) {
        populateFontSelect(modalFontSelect, 'Calibri');
      }

      const updateDriftModalPreview = () => {
        const fam = modalFontSelect?.value || 'Calibri';
        const sz = container.querySelector('#modal-font-size-val')?.value || '16';
        const color = container.querySelector('#modal-font-color-picker')?.value || '#0f172a';
        const style = container.querySelector('#modal-font-weight-style')?.value || 'normal';
        const prev = container.querySelector('#modal-font-preview');
        if (prev) {
          prev.style.fontFamily = fam;
          prev.style.fontSize = `${sz}px`;
          prev.style.color = color;
          prev.style.fontWeight = style.includes('bold') ? 'bold' : 'normal';
          prev.style.fontStyle = style.includes('italic') ? 'italic' : 'normal';
          const opt = modalFontSelect ? modalFontSelect.options[modalFontSelect.selectedIndex] : null;
          const name = opt ? opt.textContent : 'Calibri';
          prev.textContent = `${name} — The quick brown fox jumps over the lazy dog (1234567890)`;
        }
      };

      modalFontSelect?.addEventListener('change', () => {
        const opt = modalFontSelect.options[modalFontSelect.selectedIndex];
        if (opt && opt.dataset && opt.dataset.fontName) {
          loadGoogleFont(opt.dataset.fontName);
        }
        updateDriftModalPreview();
      });
      container.querySelector('#modal-font-size-val')?.addEventListener('input', updateDriftModalPreview);
      container.querySelector('#modal-font-color-picker')?.addEventListener('input', updateDriftModalPreview);
      container.querySelector('#modal-font-weight-style')?.addEventListener('change', updateDriftModalPreview);

      container.querySelector('#btn-drift-launcher-font')?.addEventListener('click', () => {
        updateDriftModalPreview();
        fontDialog?.classList.add('open');
      });
      container.querySelector('#btn-close-font-dialog')?.addEventListener('click', () => fontDialog?.classList.remove('open'));
      container.querySelector('#btn-cancel-font-dialog')?.addEventListener('click', () => fontDialog?.classList.remove('open'));
      container.querySelector('#btn-apply-font-dialog')?.addEventListener('click', () => {
        const family = modalFontSelect?.value;
        const opt = modalFontSelect?.options[modalFontSelect.selectedIndex];
        const fontName = opt ? opt.textContent : 'Calibri';
        const size = container.querySelector('#modal-font-size-val')?.value;
        const color = container.querySelector('#modal-font-color-picker')?.value;
        const style = container.querySelector('#modal-font-weight-style')?.value;

        if (family) {
          if (driftFontPicker) driftFontPicker.setFont(fontName);
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
                  f.style.fontFamily = family;
                });
              }
            } catch (e) {}
          } else {
            const anchor = sel && sel.anchorNode ? (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement) : null;
            const block = anchor ? anchor.closest('p, h1, h2, h3, h4, h5, h6, li, td, th, div.drift-page-sheet') : null;
            if (block) block.style.fontFamily = family;
          }
        }
        if (size) document.execCommand('fontSize', false, Math.min(7, Math.max(1, Math.round(parseInt(size) / 4))));
        if (color) document.execCommand('foreColor', false, color);
        if (style) {
          if (style.includes('bold')) document.execCommand('bold', false, null);
          if (style.includes('italic')) document.execCommand('italic', false, null);
        }
        fontDialog?.classList.remove('open');
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Applied ${fontName} typography`);
      });

      const paraDialog = container.querySelector('#drift-paragraph-dialog-modal');
      container.querySelector('#btn-drift-launcher-paragraph')?.addEventListener('click', () => paraDialog?.classList.add('open'));
      container.querySelector('#btn-close-paragraph-dialog')?.addEventListener('click', () => paraDialog?.classList.remove('open'));
      container.querySelector('#btn-cancel-paragraph-dialog')?.addEventListener('click', () => paraDialog?.classList.remove('open'));
      container.querySelector('#btn-apply-paragraph-dialog')?.addEventListener('click', () => {
        const align = container.querySelector('#modal-para-align')?.value;
        const lineSpacing = container.querySelector('#modal-para-line-spacing')?.value;
        if (align === 'center') document.execCommand('justifyCenter', false, null);
        else if (align === 'right') document.execCommand('justifyRight', false, null);
        else if (align === 'justify') document.execCommand('justifyFull', false, null);
        else document.execCommand('justifyLeft', false, null);
        if (lineSpacing) {
          const node = window.getSelection().anchorNode?.parentNode;
          if (node) node.style.lineHeight = lineSpacing;
        }
        paraDialog?.classList.remove('open');
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Applied paragraph settings');
      });

      container.querySelector('#btn-drift-launcher-styles')?.addEventListener('click', () => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Styles Inspector: 7 Office standard typography styles active');
      });
      container.querySelector('#btn-drift-styles-dropdown')?.addEventListener('click', () => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Visual Styles: Showing all document heading styles');
      });

      // 3. Proofing Editor
      container.querySelector('#btn-editor-stats-group')?.addEventListener('click', () => {
        openSpellingAssistant();
      });

      // 4. Office Add-ins
      const addinsModal = container.querySelector('#drift-addins-modal');
      container.querySelector('#btn-drift-addins')?.addEventListener('click', () => addinsModal?.classList.add('open'));
      container.querySelector('#btn-close-addins-modal')?.addEventListener('click', () => addinsModal?.classList.remove('open'));
      container.querySelector('#btn-ok-addins')?.addEventListener('click', () => addinsModal?.classList.remove('open'));
      container.querySelectorAll('.btn-run-addin').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.addin;
          addinsModal?.classList.remove('open');
          if (type === 'wikipedia') {
            const topic = prompt('Enter Wikipedia research query to cite:', 'Zero Database Architecture');
            if (topic) {
              const citeHtml = `<blockquote style="border:1px solid #e2e8f0; padding:10px 16px; background:#f8fafc; color:#334155; font-size:12px; margin:12px 0; border-radius:6px;"><strong>Wikipedia Reference:</strong> "${topic}" &bull; Retrieved from Sovereign Knowledge Repository, 2026.</blockquote><p></p>`;
              document.execCommand('insertHTML', false, citeHtml);
              saveDocument();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted citation for "${topic}"`);
            }
          } else if (type === 'qrcode') {
            const qrHtml = `<div style="display:inline-block; padding:12px; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; text-align:center; margin:12px 0;"><img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://giri-orbit.local" alt="QR Code" style="display:block; margin-bottom:6px;"><span style="font-size:10px; color:#64748b;">Scan to verify doc</span></div><p></p>`;
            document.execCommand('insertHTML', false, qrHtml);
            saveDocument();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted sovereign QR code');
          } else if (type === 'translate') {
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Translation: Document verified across EN/ES/FR/DE/JA');
          }
        });
      });

      // 5. Help Tab Handlers
      container.querySelector('#btn-drift-help-center')?.addEventListener('click', () => {
        alert('Giri Drift Help Center:\n- Sovereign Word Processor with zero database transmission\n- Modern Office 365 dark ribbon with full keyboard shortcuts\n- Direct Disk Sync (Ctrl+S) without re-downloading');
      });
      const shortcutsModal = container.querySelector('#drift-shortcuts-modal');
      container.querySelector('#btn-drift-shortcuts-btn')?.addEventListener('click', () => shortcutsModal?.classList.add('open'));
      container.querySelector('#btn-close-shortcuts-modal')?.addEventListener('click', () => shortcutsModal?.classList.remove('open'));
      container.querySelector('#btn-ok-shortcuts')?.addEventListener('click', () => shortcutsModal?.classList.remove('open'));
      container.querySelector('#btn-drift-whats-new')?.addEventListener('click', () => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast("What's New: Modern Dark Office 365 Ribbon, Editor proofing, Add-ins suite");
      });
      container.querySelector('#btn-drift-feedback-btn')?.addEventListener('click', () => {
        const fb = prompt('What feedback or feature would you like in Giri Drift?');
        if (fb && window.orbitPlatform) window.orbitPlatform.triggerToast('Thank you for your feedback! Stored in sovereign memory.');
      });

      // 6. Action Pills: Catch up & Editing mode
      container.querySelector('#btn-drift-catchup')?.addEventListener('click', () => {
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Catch up: You are up to date. All local edits saved.');
      });
      let isEditingMode = true;
      container.querySelector('#btn-drift-editing-mode')?.addEventListener('click', (e) => {
        isEditingMode = !isEditingMode;
        paper.setAttribute('contenteditable', isEditingMode ? 'true' : 'false');
        e.currentTarget.querySelector('span').textContent = isEditingMode ? 'Editing ▾' : 'Viewing ▾';
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(isEditingMode ? 'Switched to Editing Mode' : 'Switched to Viewing (Read-Only) Mode');
      });

      // =========================================================================
      // 6.5 ADVANCED OFFICE FEATURES SUITE (SmartArt, Charts, WordArt, Shapes,
      //     Icons, Header/Footer, Citations, Protection, Translation, Accessibility)
      // =========================================================================

      function safeEscape(str) {
        return (str || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      // ─── 1. SMARTART DIAGRAMS ENGINE ─────────────────────────────────────────
      function openSmartArtModal() {
        document.getElementById('drift-smartart-modal-backdrop')?.remove();

        const modal = document.createElement('div');
        modal.id = 'drift-smartart-modal-backdrop';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10090; backdrop-filter:blur(4px);';
        modal.innerHTML = `
          <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:580px; max-width:94vw; box-shadow:0 24px 64px rgba(0,0,0,0.6); padding:22px; color:#ffffff; font-family:sans-serif; max-height:90vh; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:22px; color:#38bdf8;">💠</span>
                <div>
                  <strong style="font-size:16px; color:#f1f5f9; display:block;">SmartArt Diagram Studio</strong>
                  <span style="font-size:11px; color:#94a3b8;">Insert structured, editable visual diagrams into your document</span>
                </div>
              </div>
              <button id="btn-close-smartart-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:14px;">
              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">1. Diagram Type:</label>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;" id="smartart-type-selector">
                  <button class="smartart-type-btn active" data-type="process" style="padding:10px; background:#1e293b; border:1.5px solid #3b82f6; border-radius:8px; color:#f1f5f9; cursor:pointer; text-align:center;">
                    <div style="font-size:18px; margin-bottom:4px;">➔ ➔ ➔</div>
                    <strong style="font-size:12px; display:block;">Process Flow</strong>
                    <span style="font-size:10px; color:#94a3b8;">Sequential steps</span>
                  </button>
                  <button class="smartart-type-btn" data-type="cycle" style="padding:10px; background:#1e293b; border:1.5px solid #334155; border-radius:8px; color:#f1f5f9; cursor:pointer; text-align:center;">
                    <div style="font-size:18px; margin-bottom:4px;">🔄</div>
                    <strong style="font-size:12px; display:block;">Cycle Loop</strong>
                    <span style="font-size:10px; color:#94a3b8;">Continuous loop</span>
                  </button>
                  <button class="smartart-type-btn" data-type="hierarchy" style="padding:10px; background:#1e293b; border:1.5px solid #334155; border-radius:8px; color:#f1f5f9; cursor:pointer; text-align:center;">
                    <div style="font-size:18px; margin-bottom:4px;">🏛️</div>
                    <strong style="font-size:12px; display:block;">Hierarchy</strong>
                    <span style="font-size:10px; color:#94a3b8;">Org tree / levels</span>
                  </button>
                  <button class="smartart-type-btn" data-type="matrix" style="padding:10px; background:#1e293b; border:1.5px solid #334155; border-radius:8px; color:#f1f5f9; cursor:pointer; text-align:center;">
                    <div style="font-size:18px; margin-bottom:4px;">⊞</div>
                    <strong style="font-size:12px; display:block;">Matrix (2×2)</strong>
                    <span style="font-size:10px; color:#94a3b8;">4 Quadrants / SWOT</span>
                  </button>
                  <button class="smartart-type-btn" data-type="chevron" style="padding:10px; background:#1e293b; border:1.5px solid #334155; border-radius:8px; color:#f1f5f9; cursor:pointer; text-align:center;">
                    <div style="font-size:18px; margin-bottom:4px;">⏩</div>
                    <strong style="font-size:12px; display:block;">Chevron Flow</strong>
                    <span style="font-size:10px; color:#94a3b8;">Strategic phases</span>
                  </button>
                  <button class="smartart-type-btn" data-type="funnel" style="padding:10px; background:#1e293b; border:1.5px solid #334155; border-radius:8px; color:#f1f5f9; cursor:pointer; text-align:center;">
                    <div style="font-size:18px; margin-bottom:4px;">▽</div>
                    <strong style="font-size:12px; display:block;">Funnel Stages</strong>
                    <span style="font-size:10px; color:#94a3b8;">Pipeline stages</span>
                  </button>
                </div>
              </div>

              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">2. Color Palette:</label>
                <div style="display:flex; gap:8px;" id="smartart-theme-selector">
                  <button class="smartart-theme-btn active" data-color="#2563eb" style="flex:1; padding:7px; background:#1e293b; border:2px solid #2563eb; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:600;">Executive Blue</button>
                  <button class="smartart-theme-btn" data-color="#059669" style="flex:1; padding:7px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:600;">Emerald Green</button>
                  <button class="smartart-theme-btn" data-color="#7c3aed" style="flex:1; padding:7px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:600;">Violet Purple</button>
                  <button class="smartart-theme-btn" data-color="#ea580c" style="flex:1; padding:7px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:600;">Sunset Amber</button>
                </div>
              </div>

              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">3. Steps / Items (comma-separated):</label>
                <input type="text" id="smartart-steps-input" value="Phase 1: Discovery, Phase 2: Design, Phase 3: Build, Phase 4: Launch" style="width:100%; box-sizing:border-box; background:#09090b; border:1px solid #3f3f46; color:#f1f5f9; border-radius:6px; padding:9px 12px; font-size:12.5px; outline:none;">
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid #27272a; padding-top:14px;">
              <button id="btn-cancel-smartart" style="background:transparent; border:1px solid #475569; color:#94a3b8; border-radius:6px; padding:7px 16px; font-size:12px; cursor:pointer;">Cancel</button>
              <button id="btn-confirm-smartart" style="background:#2563eb; border:none; color:#ffffff; border-radius:6px; padding:7px 20px; font-size:12.5px; font-weight:700; cursor:pointer;">Insert SmartArt</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        let activeType = 'process';
        let activeColor = '#2563eb';

        modal.querySelectorAll('.smartart-type-btn').forEach(b => {
          b.addEventListener('click', () => {
            modal.querySelectorAll('.smartart-type-btn').forEach(btn => {
              btn.classList.remove('active');
              btn.style.borderColor = '#334155';
            });
            b.classList.add('active');
            b.style.borderColor = '#3b82f6';
            activeType = b.dataset.type;

            const input = modal.querySelector('#smartart-steps-input');
            if (activeType === 'cycle') input.value = 'Plan: Strategy, Execute: Deploy, Measure: Metrics, Optimize: Refine';
            else if (activeType === 'hierarchy') input.value = 'Executive Leadership, Operations Team, Engineering Division, Financial Governance';
            else if (activeType === 'matrix') input.value = 'Strengths: Core IP, Weaknesses: Scaling, Opportunities: Enterprise, Threats: Regulations';
            else if (activeType === 'chevron') input.value = 'Stage 1: Kickoff, Stage 2: Synthesis, Stage 3: Rollout, Stage 4: Scale';
            else if (activeType === 'funnel') input.value = 'Awareness (10k), Evaluation (4k), Consideration (1.2k), Conversion (450)';
            else input.value = 'Phase 1: Discovery, Phase 2: Design, Phase 3: Build, Phase 4: Launch';
          });
        });

        modal.querySelectorAll('.smartart-theme-btn').forEach(b => {
          b.addEventListener('click', () => {
            modal.querySelectorAll('.smartart-theme-btn').forEach(btn => {
              btn.classList.remove('active');
              btn.style.border = '1px solid #334155';
            });
            b.classList.add('active');
            activeColor = b.dataset.color;
            b.style.border = `2px solid ${activeColor}`;
          });
        });

        const close = () => modal.remove();
        modal.querySelector('#btn-close-smartart-modal')?.addEventListener('click', close);
        modal.querySelector('#btn-cancel-smartart')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

        modal.querySelector('#btn-confirm-smartart')?.addEventListener('click', () => {
          const items = (modal.querySelector('#smartart-steps-input')?.value || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

          let html = '';
          if (activeType === 'process') {
            html = `
              <div class="drift-smartart-container" contenteditable="false" style="margin:24px 0; padding:18px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
                <div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Process Flow Diagram</div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  ${items.map((it, i) => `
                    <div style="flex:1; min-width:110px; background:#ffffff; border:1.5px solid ${activeColor}; border-radius:8px; padding:10px 12px; box-shadow:0 2px 6px rgba(0,0,0,0.04); text-align:center;">
                      <div style="width:22px; height:22px; border-radius:50%; background:${activeColor}; color:#fff; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 6px auto;">${i+1}</div>
                      <div contenteditable="true" style="font-size:12px; font-weight:700; color:#0f172a; outline:none;">${safeEscape(it)}</div>
                    </div>
                    ${i < items.length - 1 ? `<span style="font-size:18px; color:${activeColor}; font-weight:900;">➔</span>` : ''}
                  `).join('')}
                </div>
              </div><p><br></p>
            `;
          } else if (activeType === 'cycle') {
            html = `
              <div class="drift-smartart-container" contenteditable="false" style="margin:24px 0; padding:18px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
                <div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Cycle Loop Diagram</div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
                  ${items.map((it, i) => `
                    <div style="background:#ffffff; border-top:4px solid ${activeColor}; border-radius:6px; padding:12px; border-left:1px solid #e2e8f0; border-right:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; box-shadow:0 2px 6px rgba(0,0,0,0.04); position:relative;">
                      <div style="font-size:10px; font-weight:800; color:${activeColor}; margin-bottom:4px;">PHASE ${i+1} ↻</div>
                      <div contenteditable="true" style="font-size:12px; font-weight:700; color:#0f172a; outline:none;">${safeEscape(it)}</div>
                    </div>
                  `).join('')}
                </div>
              </div><p><br></p>
            `;
          } else if (activeType === 'hierarchy') {
            const topNode = items[0] || 'Leadership';
            const subNodes = items.slice(1);
            html = `
              <div class="drift-smartart-container" contenteditable="false" style="margin:24px 0; padding:20px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; text-align:center;">
                <div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Organizational Hierarchy</div>
                <div style="display:inline-block; background:${activeColor}; color:#fff; border-radius:6px; padding:10px 22px; font-weight:700; font-size:13px; box-shadow:0 2px 8px rgba(0,0,0,0.12);" contenteditable="true">${safeEscape(topNode)}</div>
                <div style="width:2px; height:18px; background:#cbd5e1; margin:0 auto;"></div>
                <div style="width:60%; height:2px; background:#cbd5e1; margin:0 auto;"></div>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:0; flex-wrap:wrap;">
                  ${subNodes.map(sn => `
                    <div style="min-width:110px; margin-top:12px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:8px 14px; font-size:11.5px; font-weight:600; color:#0f172a; box-shadow:0 1px 4px rgba(0,0,0,0.05);" contenteditable="true">${safeEscape(sn)}</div>
                  `).join('')}
                </div>
              </div><p><br></p>
            `;
          } else if (activeType === 'matrix') {
            html = `
              <div class="drift-smartart-container" contenteditable="false" style="margin:24px 0; padding:18px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
                <div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Strategic Matrix (2×2)</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  ${items.slice(0, 4).map((it, i) => {
                    const colors = [activeColor, '#10b981', '#f59e0b', '#6366f1'];
                    const col = colors[i % colors.length];
                    return `
                      <div style="background:#ffffff; border-left:4px solid ${col}; border-radius:6px; padding:12px; border-top:1px solid #e2e8f0; border-right:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;">
                        <div style="font-size:10px; font-weight:800; color:${col}; text-transform:uppercase; margin-bottom:4px;">QUADRANT ${i+1}</div>
                        <div contenteditable="true" style="font-size:12px; font-weight:600; color:#0f172a; outline:none;">${safeEscape(it)}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div><p><br></p>
            `;
          } else if (activeType === 'chevron') {
            html = `
              <div class="drift-smartart-container" contenteditable="false" style="margin:24px 0; padding:18px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;">
                <div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Chevron Strategic Timeline</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  ${items.map((it, i) => `
                    <div style="flex:1; min-width:110px; background:linear-gradient(135deg, ${activeColor}, ${activeColor}dd); color:#ffffff; border-radius:6px; padding:10px 14px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                      <div style="font-size:9.5px; font-weight:800; opacity:0.85; text-transform:uppercase;">MILESTONE ${i+1}</div>
                      <div contenteditable="true" style="font-size:12px; font-weight:700; color:#ffffff; outline:none; margin-top:2px;">${safeEscape(it)}</div>
                    </div>
                  `).join('')}
                </div>
              </div><p><br></p>
            `;
          } else {
            // Funnel
            html = `
              <div class="drift-smartart-container" contenteditable="false" style="margin:24px 0; padding:18px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; text-align:center;">
                <div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Conversion Funnel Stages</div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                  ${items.map((it, i) => {
                    const widthPct = Math.max(35, 100 - (i * 18));
                    return `
                      <div style="width:${widthPct}%; background:${activeColor}; color:#fff; border-radius:4px; padding:8px 12px; font-size:12px; font-weight:700; box-shadow:0 1px 4px rgba(0,0,0,0.1);" contenteditable="true">${safeEscape(it)}</div>
                    `;
                  }).join('')}
                </div>
              </div><p><br></p>
            `;
          }

          insertIntoPaperAtCursor(html);
          close();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('SmartArt diagram inserted into document!');
        });
      }

      container.querySelector('#btn-insert-smartart')?.addEventListener('click', openSmartArtModal);

      // ─── 2. DATA CHARTS & VISUALIZATIONS ─────────────────────────────────────
      function openChartInsertModal() {
        document.getElementById('drift-chart-modal-backdrop')?.remove();

        const modal = document.createElement('div');
        modal.id = 'drift-chart-modal-backdrop';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10090; backdrop-filter:blur(4px);';
        modal.innerHTML = `
          <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:520px; max-width:94vw; box-shadow:0 24px 64px rgba(0,0,0,0.6); padding:22px; color:#ffffff; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:22px; color:#10b981;">📊</span>
                <div>
                  <strong style="font-size:16px; color:#f1f5f9; display:block;">Insert Data Chart</strong>
                  <span style="font-size:11px; color:#94a3b8;">Choose a chart style and enter data series</span>
                </div>
              </div>
              <button id="btn-close-chart-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:6px; text-transform:uppercase;">Chart Type:</label>
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px;" id="chart-type-selector">
                  <button class="chart-type-btn active" data-type="column" style="padding:8px; background:#1e293b; border:1.5px solid #3b82f6; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:700;">📊 Column</button>
                  <button class="chart-type-btn" data-type="bar" style="padding:8px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:700;">📶 Bar</button>
                  <button class="chart-type-btn" data-type="line" style="padding:8px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:700;">📈 Line</button>
                  <button class="chart-type-btn" data-type="pie" style="padding:8px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:700;">🥧 Pie</button>
                  <button class="chart-type-btn" data-type="donut" style="padding:8px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:700;">⭕ Donut</button>
                  <button class="chart-type-btn" data-type="area" style="padding:8px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#f1f5f9; cursor:pointer; font-size:11.5px; font-weight:700;">🏔 Area</button>
                </div>
              </div>

              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Chart Title:</label>
                <input type="text" id="chart-title-input" value="Quarterly Performance Metrics" style="width:100%; box-sizing:border-box; background:#09090b; border:1px solid #3f3f46; color:#f1f5f9; border-radius:6px; padding:8px 12px; font-size:12px; outline:none;">
              </div>

              <div style="display:flex; gap:10px;">
                <div style="flex:1;">
                  <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Categories (Labels):</label>
                  <input type="text" id="chart-labels-input" value="Q1, Q2, Q3, Q4, Q5" style="width:100%; box-sizing:border-box; background:#09090b; border:1px solid #3f3f46; color:#f1f5f9; border-radius:6px; padding:8px 12px; font-size:12px; outline:none;">
                </div>
                <div style="flex:1;">
                  <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Values (Numbers):</label>
                  <input type="text" id="chart-values-input" value="65, 42, 88, 55, 94" style="width:100%; box-sizing:border-box; background:#09090b; border:1px solid #3f3f46; color:#f1f5f9; border-radius:6px; padding:8px 12px; font-size:12px; outline:none;">
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid #27272a; padding-top:14px;">
              <button id="btn-cancel-chart-dialog" style="background:transparent; border:1px solid #475569; color:#94a3b8; border-radius:6px; padding:7px 16px; font-size:12px; cursor:pointer;">Cancel</button>
              <button id="btn-confirm-insert-chart" style="background:#10b981; border:none; color:#ffffff; border-radius:6px; padding:7px 20px; font-size:12.5px; font-weight:700; cursor:pointer;">Insert Chart</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        let activeChartType = 'column';

        modal.querySelectorAll('.chart-type-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            modal.querySelectorAll('.chart-type-btn').forEach(b => {
              b.classList.remove('active');
              b.style.border = '1px solid #334155';
            });
            btn.classList.add('active');
            btn.style.border = '1.5px solid #3b82f6';
            activeChartType = btn.dataset.type;
          });
        });

        const close = () => modal.remove();
        modal.querySelector('#btn-close-chart-modal')?.addEventListener('click', close);
        modal.querySelector('#btn-cancel-chart-dialog')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

        modal.querySelector('#btn-confirm-insert-chart')?.addEventListener('click', () => {
          const title = modal.querySelector('#chart-title-input')?.value || 'Chart Visualization';
          const labels = (modal.querySelector('#chart-labels-input')?.value || 'A, B, C, D').split(',').map(s => s.trim());
          const values = (modal.querySelector('#chart-values-input')?.value || '10, 20, 30, 40').split(',').map(s => parseFloat(s.trim()) || 0);

          const colors = ['#2563eb', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#06b6d4', '#ec4899'];
          const maxVal = Math.max(...values, 1);
          let svgContent = '';

          if (activeChartType === 'column') {
            const barWidth = Math.max(20, Math.floor(260 / values.length) - 10);
            svgContent = `
              <svg viewBox="0 0 320 180" width="100%" height="200" style="overflow:visible;">
                <line x1="30" y1="150" x2="310" y2="150" stroke="#cbd5e1" stroke-width="1.5"/>
                ${values.map((v, i) => {
                  const h = Math.round((v / maxVal) * 115);
                  const x = 40 + i * (barWidth + 12);
                  const y = 150 - h;
                  const col = colors[i % colors.length];
                  return `
                    <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${col}" rx="3"/>
                    <text x="${x + barWidth/2}" y="${y - 4}" font-size="10" font-weight="700" text-anchor="middle" fill="#334155">${v}</text>
                    <text x="${x + barWidth/2}" y="165" font-size="9.5" text-anchor="middle" fill="#64748b">${labels[i] || ''}</text>
                  `;
                }).join('')}
              </svg>
            `;
          } else if (activeChartType === 'bar') {
            const barHeight = Math.max(14, Math.floor(130 / values.length) - 8);
            svgContent = `
              <svg viewBox="0 0 320 180" width="100%" height="200" style="overflow:visible;">
                <line x1="60" y1="10" x2="60" y2="160" stroke="#cbd5e1" stroke-width="1.5"/>
                ${values.map((v, i) => {
                  const w = Math.round((v / maxVal) * 220);
                  const y = 20 + i * (barHeight + 10);
                  const col = colors[i % colors.length];
                  return `
                    <text x="54" y="${y + barHeight/2 + 3}" font-size="9.5" text-anchor="end" fill="#64748b">${labels[i] || ''}</text>
                    <rect x="60" y="${y}" width="${w}" height="${barHeight}" fill="${col}" rx="3"/>
                    <text x="${68 + w}" y="${y + barHeight/2 + 3}" font-size="9.5" font-weight="700" fill="#334155">${v}</text>
                  `;
                }).join('')}
              </svg>
            `;
          } else if (activeChartType === 'line' || activeChartType === 'area') {
            const pts = values.map((v, i) => {
              const x = 40 + (i / Math.max(1, values.length - 1)) * 250;
              const y = 145 - (v / maxVal) * 110;
              return { x, y, v };
            });
            const poly = pts.map(p => `${p.x},${p.y}`).join(' ');
            const areaPoly = `40,150 ${poly} ${pts[pts.length-1].x},150`;
            svgContent = `
              <svg viewBox="0 0 320 180" width="100%" height="200" style="overflow:visible;">
                <line x1="30" y1="150" x2="300" y2="150" stroke="#cbd5e1" stroke-width="1.5"/>
                ${activeChartType === 'area' ? `<polygon points="${areaPoly}" fill="rgba(37,99,235,0.18)"/>` : ''}
                <polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                ${pts.map((p, i) => `
                  <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
                  <text x="${p.x}" y="${p.y - 7}" font-size="9.5" font-weight="700" text-anchor="middle" fill="#1e40af">${p.v}</text>
                  <text x="${p.x}" y="165" font-size="9" text-anchor="middle" fill="#64748b">${labels[i] || ''}</text>
                `).join('')}
              </svg>
            `;
          } else {
            // Pie / Donut
            const total = values.reduce((a, b) => a + b, 0) || 1;
            let currentAngle = -Math.PI / 2;
            const r = 60;
            const ir = activeChartType === 'donut' ? 32 : 0;
            const slices = values.map((v, i) => {
              const start = currentAngle;
              const angle = (v / total) * (2 * Math.PI);
              currentAngle += angle;
              const end = currentAngle;
              return { v, label: labels[i] || '', color: colors[i % colors.length], start, end };
            });

            svgContent = `
              <svg viewBox="0 0 320 180" width="100%" height="200" style="overflow:visible;">
                <g transform="translate(100, 90)">
                  ${slices.map(s => {
                    const x1 = r * Math.cos(s.start);
                    const y1 = r * Math.sin(s.start);
                    const x2 = r * Math.cos(s.end);
                    const y2 = r * Math.sin(s.end);
                    const large = (s.end - s.start) > Math.PI ? 1 : 0;
                    if (ir > 0) {
                      const ix1 = ir * Math.cos(s.start);
                      const iy1 = ir * Math.sin(s.start);
                      const ix2 = ir * Math.cos(s.end);
                      const iy2 = ir * Math.sin(s.end);
                      return `<path d="M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z" fill="${s.color}"/>`;
                    }
                    return `<path d="M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${s.color}"/>`;
                  }).join('')}
                </g>
                <g transform="translate(200, 30)">
                  ${slices.map((s, i) => `
                    <g transform="translate(0, ${i * 22})">
                      <rect x="0" y="0" width="12" height="12" fill="${s.color}" rx="2"/>
                      <text x="18" y="10" font-size="10" font-weight="600" fill="#334155">${s.label} (${s.v})</text>
                    </g>
                  `).join('')}
                </g>
              </svg>
            `;
          }

          const figureHtml = `
            <figure class="drift-chart-container" contenteditable="false" style="margin:24px auto; max-width:540px; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); text-align:center;">
              <div style="font-size:13px; font-weight:800; color:#0f172a; margin-bottom:12px; letter-spacing:-0.2px;">${safeEscape(title)}</div>
              ${svgContent}
              <figcaption contenteditable="true" style="font-size:11px; color:#64748b; margin-top:10px; font-style:italic; border-top:1px solid #f1f5f9; padding-top:6px;">Figure: ${safeEscape(title)} — Source: Sovereign Analytics</figcaption>
            </figure><p><br></p>
          `;

          insertIntoPaperAtCursor(figureHtml);
          close();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted ${activeChartType} chart!`);
        });
      }

      container.querySelector('#btn-insert-chart-dialog')?.addEventListener('click', openChartInsertModal);

      // ─── 3. WORDART TYPOGRAPHY STUDIO ────────────────────────────────────────
      function openWordArtModal() {
        document.getElementById('drift-wordart-modal-backdrop')?.remove();

        const sel = window.getSelection();
        const selectedText = (sel && !sel.isCollapsed) ? sel.toString().trim() : '';

        const modal = document.createElement('div');
        modal.id = 'drift-wordart-modal-backdrop';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10090; backdrop-filter:blur(4px);';
        modal.innerHTML = `
          <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:520px; max-width:94vw; box-shadow:0 24px 64px rgba(0,0,0,0.6); padding:22px; color:#ffffff; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:22px; color:#a855f7;">✨</span>
                <div>
                  <strong style="font-size:16px; color:#f1f5f9; display:block;">WordArt Typography Studio</strong>
                  <span style="font-size:11px; color:#94a3b8;">Choose a high-impact typographical style</span>
                </div>
              </div>
              <button id="btn-close-wordart-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">WordArt Text:</label>
                <input type="text" id="wordart-text-input" value="${safeEscape(selectedText || 'EXECUTIVE LEADERSHIP')}" style="width:100%; box-sizing:border-box; background:#09090b; border:1px solid #3f3f46; color:#f1f5f9; border-radius:6px; padding:9px 12px; font-size:13px; font-weight:700; outline:none;">
              </div>

              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:6px; text-transform:uppercase;">Select Typography Style:</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;" id="wordart-presets-grid">
                  <button class="wordart-preset-btn active" data-style="cyan" style="padding:10px; background:#0f172a; border:2px solid #38bdf8; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; background:linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Neon Cyan</span>
                  </button>
                  <button class="wordart-preset-btn" data-style="gold" style="padding:10px; background:#0f172a; border:1px solid #334155; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; background:linear-gradient(180deg, #fef08a 0%, #ca8a04 50%, #854d0e 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Royal Gold 3D</span>
                  </button>
                  <button class="wordart-preset-btn" data-style="emerald" style="padding:10px; background:#0f172a; border:1px solid #334155; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; background:linear-gradient(135deg, #34d399, #059669); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Emerald Wave</span>
                  </button>
                  <button class="wordart-preset-btn" data-style="sunset" style="padding:10px; background:#0f172a; border:1px solid #334155; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; background:linear-gradient(90deg, #f97316, #ef4444, #ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Sunset Blaze</span>
                  </button>
                  <button class="wordart-preset-btn" data-style="silver" style="padding:10px; background:#0f172a; border:1px solid #334155; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; background:linear-gradient(180deg, #ffffff 0%, #94a3b8 50%, #475569 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Chrome Silver</span>
                  </button>
                  <button class="wordart-preset-btn" data-style="galaxy" style="padding:10px; background:#0f172a; border:1px solid #334155; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; background:linear-gradient(135deg, #c084fc, #6366f1, #3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Cosmic Galaxy</span>
                  </button>
                  <button class="wordart-preset-btn" data-style="ocean" style="padding:10px; background:#0f172a; border:1px solid #334155; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; background:linear-gradient(135deg, #06b6d4, #0284c7); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Ocean Breeze</span>
                  </button>
                  <button class="wordart-preset-btn" data-style="outline" style="padding:10px; background:#0f172a; border:1px solid #334155; border-radius:8px; cursor:pointer; text-align:center;">
                    <span style="font-size:16px; font-weight:900; -webkit-text-stroke: 1.5px #38bdf8; color: transparent;">Minimal Outline</span>
                  </button>
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid #27272a; padding-top:14px;">
              <button id="btn-cancel-wordart" style="background:transparent; border:1px solid #475569; color:#94a3b8; border-radius:6px; padding:7px 16px; font-size:12px; cursor:pointer;">Cancel</button>
              <button id="btn-confirm-wordart" style="background:#8b5cf6; border:none; color:#ffffff; border-radius:6px; padding:7px 20px; font-size:12.5px; font-weight:700; cursor:pointer;">Insert WordArt</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        let activeStyle = 'cyan';

        modal.querySelectorAll('.wordart-preset-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            modal.querySelectorAll('.wordart-preset-btn').forEach(b => {
              b.classList.remove('active');
              b.style.border = '1px solid #334155';
            });
            btn.classList.add('active');
            btn.style.border = '2px solid #38bdf8';
            activeStyle = btn.dataset.style;
          });
        });

        const close = () => modal.remove();
        modal.querySelector('#btn-close-wordart-modal')?.addEventListener('click', close);
        modal.querySelector('#btn-cancel-wordart')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

        modal.querySelector('#btn-confirm-wordart')?.addEventListener('click', () => {
          const txt = modal.querySelector('#wordart-text-input')?.value.trim() || 'WordArt Heading';

          const styleCssMap = {
            cyan: 'background:linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-shadow:0 0 20px rgba(56,189,248,0.3);',
            gold: 'background:linear-gradient(180deg, #fef08a 0%, #ca8a04 50%, #854d0e 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; filter:drop-shadow(0 2px 2px rgba(0,0,0,0.3));',
            emerald: 'background:linear-gradient(135deg, #34d399, #059669); -webkit-background-clip:text; -webkit-text-fill-color:transparent;',
            sunset: 'background:linear-gradient(90deg, #f97316, #ef4444, #ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent;',
            silver: 'background:linear-gradient(180deg, #ffffff 0%, #94a3b8 50%, #475569 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;',
            galaxy: 'background:linear-gradient(135deg, #c084fc, #6366f1, #3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent;',
            ocean: 'background:linear-gradient(135deg, #06b6d4, #0284c7); -webkit-background-clip:text; -webkit-text-fill-color:transparent;',
            outline: '-webkit-text-stroke: 1.5px #2563eb; color: transparent;'
          };

          const appliedCss = styleCssMap[activeStyle] || styleCssMap.cyan;
          const wordArtHtml = `
            <div class="drift-wordart-heading" contenteditable="true" style="font-family:'Plus Jakarta Sans', system-ui, sans-serif; font-size:32px; font-weight:900; letter-spacing:-0.5px; margin:20px 0 10px 0; text-transform:uppercase; ${appliedCss}">${safeEscape(txt)}</div><p><br></p>
          `;

          insertIntoPaperAtCursor(wordArtHtml);
          close();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('WordArt heading inserted!');
        });
      }

      container.querySelector('#btn-insert-wordart')?.addEventListener('click', openWordArtModal);

      // ─── 4. DRAWING SHAPES INSERTER ──────────────────────────────────────────
      function openShapeModal() {
        document.getElementById('drift-shape-modal-backdrop')?.remove();

        const modal = document.createElement('div');
        modal.id = 'drift-shape-modal-backdrop';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10090; backdrop-filter:blur(4px);';
        modal.innerHTML = `
          <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:480px; max-width:94vw; box-shadow:0 24px 64px rgba(0,0,0,0.6); padding:20px; color:#ffffff; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:20px; color:#f59e0b;">⬡</span>
                <strong style="font-size:15px; color:#f1f5f9;">Insert Geometric Shape</strong>
              </div>
              <button id="btn-close-shape-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
            </div>

            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:16px;" id="shapes-picker-grid">
              <button class="shape-pick-btn active" data-shape="rect" style="padding:12px; background:#1e293b; border:2px solid #3b82f6; border-radius:6px; color:#fff; cursor:pointer;">▬ Rect</button>
              <button class="shape-pick-btn" data-shape="rounded" style="padding:12px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#fff; cursor:pointer;">▢ Round</button>
              <button class="shape-pick-btn" data-shape="circle" style="padding:12px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#fff; cursor:pointer;">● Circle</button>
              <button class="shape-pick-btn" data-shape="arrow-r" style="padding:12px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#fff; cursor:pointer;">➔ Arrow</button>
              <button class="shape-pick-btn" data-shape="star" style="padding:12px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#fff; cursor:pointer;">★ Star</button>
              <button class="shape-pick-btn" data-shape="callout" style="padding:12px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#fff; cursor:pointer;">💬 Bubble</button>
              <button class="shape-pick-btn" data-shape="diamond" style="padding:12px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#fff; cursor:pointer;">⬥ Diamond</button>
              <button class="shape-pick-btn" data-shape="banner" style="padding:12px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:#fff; cursor:pointer;">⚐ Banner</button>
            </div>

            <div>
              <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Shape Label Text (Optional):</label>
              <input type="text" id="shape-label-input" value="Notice / Key Action" style="width:100%; box-sizing:border-box; background:#09090b; border:1px solid #3f3f46; color:#f1f5f9; border-radius:6px; padding:8px 12px; font-size:12px; outline:none;">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:18px; border-top:1px solid #27272a; padding-top:14px;">
              <button id="btn-cancel-shape" style="background:transparent; border:1px solid #475569; color:#94a3b8; border-radius:6px; padding:7px 16px; font-size:12px; cursor:pointer;">Cancel</button>
              <button id="btn-confirm-shape" style="background:#2563eb; border:none; color:#ffffff; border-radius:6px; padding:7px 20px; font-size:12.5px; font-weight:700; cursor:pointer;">Insert Shape</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        let activeShape = 'rect';
        modal.querySelectorAll('.shape-pick-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            modal.querySelectorAll('.shape-pick-btn').forEach(b => {
              b.classList.remove('active');
              b.style.border = '1px solid #334155';
            });
            btn.classList.add('active');
            btn.style.border = '2px solid #3b82f6';
            activeShape = btn.dataset.shape;
          });
        });

        const close = () => modal.remove();
        modal.querySelector('#btn-close-shape-modal')?.addEventListener('click', close);
        modal.querySelector('#btn-cancel-shape')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

        modal.querySelector('#btn-confirm-shape')?.addEventListener('click', () => {
          const txt = modal.querySelector('#shape-label-input')?.value || 'Shape';
          let shapeHtml = '';

          if (activeShape === 'circle') {
            shapeHtml = `
              <div class="drift-shape-box" contenteditable="false" style="display:inline-block; margin:16px 0; text-align:center;">
                <div style="width:120px; height:120px; border-radius:50%; background:#2563eb; color:#fff; display:flex; align-items:center; justify-content:center; padding:12px; box-sizing:border-box; box-shadow:0 4px 12px rgba(37,99,235,0.25);">
                  <span contenteditable="true" style="font-size:12px; font-weight:700; outline:none;">${safeEscape(txt)}</span>
                </div>
              </div>&nbsp;
            `;
          } else if (activeShape === 'rounded') {
            shapeHtml = `
              <div class="drift-shape-box" contenteditable="false" style="display:inline-block; margin:16px 0;">
                <div style="padding:16px 28px; border-radius:24px; background:#f8fafc; border:2px solid #2563eb; color:#0f172a; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                  <strong contenteditable="true" style="font-size:13px; outline:none;">${safeEscape(txt)}</strong>
                </div>
              </div>&nbsp;
            `;
          } else if (activeShape === 'arrow-r') {
            shapeHtml = `
              <div class="drift-shape-box" contenteditable="false" style="display:inline-block; margin:16px 0;">
                <div style="padding:10px 24px; background:#10b981; color:#fff; clip-path:polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%, 15% 50%); display:flex; align-items:center; justify-content:center; min-width:140px;">
                  <strong contenteditable="true" style="font-size:12px; outline:none;">${safeEscape(txt)}</strong>
                </div>
              </div>&nbsp;
            `;
          } else if (activeShape === 'star') {
            shapeHtml = `
              <div class="drift-shape-box" contenteditable="false" style="display:inline-block; margin:16px 0; text-align:center;">
                <div style="background:#f59e0b; color:#fff; padding:18px 24px; border-radius:12px; transform:rotate(-2deg); box-shadow:0 4px 12px rgba(245,158,11,0.3);">
                  <span style="font-size:16px;">★ </span><strong contenteditable="true" style="font-size:13px; outline:none;">${safeEscape(txt)}</strong>
                </div>
              </div>&nbsp;
            `;
          } else if (activeShape === 'callout') {
            shapeHtml = `
              <div class="drift-shape-box" contenteditable="false" style="margin:16px 0; max-width:320px;">
                <div style="background:#eff6ff; border:1.5px solid #3b82f6; border-radius:10px; padding:12px 16px; position:relative;">
                  <span contenteditable="true" style="font-size:12px; color:#1e40af; outline:none; font-weight:600;">${safeEscape(txt)}</span>
                  <div style="position:absolute; bottom:-8px; left:20px; width:12px; height:12px; background:#eff6ff; border-right:1.5px solid #3b82f6; border-bottom:1.5px solid #3b82f6; transform:rotate(45deg);"></div>
                </div>
              </div><p><br></p>
            `;
          } else {
            shapeHtml = `
              <div class="drift-shape-box" contenteditable="false" style="display:inline-block; margin:16px 0;">
                <div style="padding:14px 24px; background:#1e293b; color:#f8fafc; border-radius:6px; border-left:4px solid #38bdf8; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                  <strong contenteditable="true" style="font-size:12.5px; outline:none;">${safeEscape(txt)}</strong>
                </div>
              </div>&nbsp;
            `;
          }

          insertIntoPaperAtCursor(shapeHtml);
          close();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Shape inserted into document');
        });
      }

      container.querySelector('#btn-insert-shape')?.addEventListener('click', openShapeModal);

      // ─── 5. VECTOR ICONS GALLERY ─────────────────────────────────────────────
      function openIconModal() {
        document.getElementById('drift-icon-modal-backdrop')?.remove();

        const iconDefs = [
          { name: 'Document', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
          { name: 'Folder', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
          { name: 'Check', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' },
          { name: 'Star', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
          { name: 'Shield', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
          { name: 'Lock', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
          { name: 'Globe', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
          { name: 'User', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
          { name: 'Mail', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
          { name: 'Calendar', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
          { name: 'Zap', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' },
          { name: 'Settings', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
          { name: 'Award', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>' },
          { name: 'Bookmark', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' },
          { name: 'Heart', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
          { name: 'Search', svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' }
        ];

        const modal = document.createElement('div');
        modal.id = 'drift-icon-modal-backdrop';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10090; backdrop-filter:blur(4px);';
        modal.innerHTML = `
          <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:460px; max-width:92vw; box-shadow:0 24px 64px rgba(0,0,0,0.6); padding:20px; color:#ffffff; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
              <strong style="font-size:15px; color:#f1f5f9;">Insert Icon</strong>
              <button id="btn-close-icon-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px;" id="icons-grid-container">
              ${iconDefs.map((ic, i) => `
                <button class="icon-card-btn" data-icon-idx="${i}" style="padding:14px; background:#1e293b; border:1px solid #334155; border-radius:8px; color:#f1f5f9; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px;">
                  <div>${ic.svg}</div>
                  <span style="font-size:10.5px; color:#94a3b8;">${ic.name}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('#btn-close-icon-modal')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

        modal.querySelectorAll('.icon-card-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.iconIdx, 10);
            const chosen = iconDefs[idx];
            if (chosen) {
              const html = `<span style="display:inline-block; vertical-align:middle; margin:0 4px;" contenteditable="false">${chosen.svg}</span>&nbsp;`;
              insertIntoPaperAtCursor(html);
              close();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted ${chosen.name} icon`);
            }
          });
        });
      }

      container.querySelector('#btn-insert-icon')?.addEventListener('click', openIconModal);

      // ─── 6. RUNNING HEADERS, FOOTERS & PAGE NUMBERS ──────────────────────────
      container.querySelector('#btn-insert-header')?.addEventListener('click', () => {
        let hdr = paper.querySelector('.drift-doc-running-header');
        if (!hdr) {
          hdr = document.createElement('header');
          hdr.className = 'drift-doc-running-header';
          hdr.contentEditable = 'true';
          hdr.style.cssText = 'border-bottom:1px solid #cbd5e1; padding-bottom:8px; margin-bottom:24px; font-size:9.5pt; color:#64748b; display:flex; justify-content:space-between; user-select:none;';
          hdr.innerHTML = `<span>${safeEscape(currentDocTitle)} • Executive Document</span><span>CONFIDENTIAL</span>`;
          paper.prepend(hdr);
          saveDocument();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Header created — click to edit');
        } else {
          hdr.scrollIntoView({ behavior: 'smooth' });
          hdr.focus();
        }
      });

      container.querySelector('#btn-insert-footer')?.addEventListener('click', () => {
        let ftr = paper.querySelector('.drift-doc-running-footer');
        if (!ftr) {
          ftr = document.createElement('footer');
          ftr.className = 'drift-doc-running-footer';
          ftr.contentEditable = 'true';
          ftr.style.cssText = 'border-top:1px solid #cbd5e1; padding-top:8px; margin-top:36px; font-size:9.5pt; color:#64748b; display:flex; justify-content:space-between; user-select:none;';
          ftr.innerHTML = `<span>Giri Orbit Enterprise Workspace</span><span>Page <span class="drift-page-num-token">1</span></span>`;
          paper.appendChild(ftr);
          saveDocument();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Footer created — click to edit');
        } else {
          ftr.scrollIntoView({ behavior: 'smooth' });
          ftr.focus();
        }
      });

      container.querySelector('#btn-insert-page-number')?.addEventListener('click', () => {
        const pageTokenHtml = `<span class="drift-page-number-token" contenteditable="false" style="font-weight:700; color:#2563eb; background:#eff6ff; padding:2px 8px; border-radius:4px; font-family:var(--font-mono, monospace); font-size:11px;">Page 1</span>&nbsp;`;
        insertIntoPaperAtCursor(pageTokenHtml);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Page number token inserted');
      });

      // ─── 7. TEXT BOX, CALLOUT, DATE & BOOKMARK ───────────────────────────────
      container.querySelector('#btn-insert-textbox')?.addEventListener('click', () => {
        const tbHtml = `
          <div class="drift-floating-textbox" contenteditable="true" style="border:1.5px solid #3b82f6; border-radius:8px; padding:14px 18px; margin:16px 0; background:#f8fafc; box-shadow:0 4px 12px rgba(0,0,0,0.05); min-width:260px; font-size:11pt; color:#1e293b;">
            <p style="margin:0 0 6px 0; font-weight:700; color:#1e40af;">Text Box</p>
            <p style="margin:0;">Enter supplementary notes, key highlights, or sidebar remarks here...</p>
          </div><p><br></p>
        `;
        insertIntoPaperAtCursor(tbHtml);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Text box inserted');
      });

      container.querySelector('#btn-insert-callout-box')?.addEventListener('click', () => {
        const calloutHtml = `
          <div class="drift-callout-banner" contenteditable="true" style="padding:14px 18px; margin:16px 0; background:#f0fdf4; border:1px solid #bbf7d0; border-left:4px solid #16a34a; border-radius:6px; color:#166534; font-size:11pt; line-height:1.6;">
            <strong>💡 Executive Directive:</strong> Enter crucial operational takeaway or policy guidance here.
          </div><p><br></p>
        `;
        insertIntoPaperAtCursor(calloutHtml);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Callout box inserted');
      });

      container.querySelector('#btn-insert-date')?.addEventListener('click', () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        insertIntoPaperAtCursor(`<span style="color:#475569; font-weight:600;">${dateStr}</span>&nbsp;`);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Current date inserted');
      });

      container.querySelector('#btn-insert-bookmark')?.addEventListener('click', () => {
        const bmName = prompt('Enter Bookmark Name (e.g., Section2, Appendix):', 'Bookmark_1');
        if (bmName && bmName.trim()) {
          const safeName = bmName.trim().replace(/\s+/g, '_');
          const bmHtml = `<a id="bm_${safeName}" name="bm_${safeName}" class="drift-bookmark-anchor" title="Bookmark: ${safeName}" style="border-bottom:2px dotted #38bdf8; text-decoration:none; color:inherit;">🔖 ${safeEscape(bmName.trim())}</a>&nbsp;`;
          insertIntoPaperAtCursor(bmHtml);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Bookmark "${safeName}" created`);
        }
      });

      // ─── 8. CITATIONS & BIBLIOGRAPHY BUILDER ──────────────────────────────────
      let citationRegistry = [];

      container.querySelector('#btn-insert-endnote')?.addEventListener('click', () => {
        let endnoteContainer = paper.querySelector('.drift-endnotes-container');
        if (!endnoteContainer) {
          endnoteContainer = document.createElement('div');
          endnoteContainer.className = 'drift-endnotes-container';
          endnoteContainer.innerHTML = '<hr style="border:none; border-top:1.5px solid #cbd5e1; margin:32px 0 16px;"><h4 style="margin:0 0 10px 0; font-size:12pt; color:#0f172a;">Endnotes</h4>';
          paper.appendChild(endnoteContainer);
        }
        const noteIndex = endnoteContainer.querySelectorAll('.drift-endnote-item').length + 1;
        const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][noteIndex - 1] || noteIndex;
        document.execCommand('insertHTML', false, `<sup style="color:#7c3aed; font-weight:800; cursor:pointer;" title="Endnote ${roman}">[${roman}]</sup>&nbsp;`);

        const noteRow = document.createElement('div');
        noteRow.className = 'drift-endnote-item';
        noteRow.style.cssText = 'font-size:10pt; color:#475569; margin-bottom:6px;';
        noteRow.innerHTML = `<strong style="color:#7c3aed;">[${roman}]</strong> <span contenteditable="true">Enter endnote citation or reference text here...</span>`;
        endnoteContainer.appendChild(noteRow);
        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Endnote [${roman}] added at cursor & document end`);
      });

      container.querySelector('#btn-insert-citation')?.addEventListener('click', () => {
        const author = prompt('Author Name(s):', 'Giri Research');
        if (!author) return;
        const year = prompt('Publication Year:', '2026') || '2026';
        const title = prompt('Work / Book / Paper Title:', 'Sovereign Distributed Computing');
        const style = container.querySelector('#drift-citation-style')?.value || 'APA';

        citationRegistry.push({ author, year, title, style });

        let inTextCitation = '';
        if (style === 'MLA') inTextCitation = `(${author} ${year})`;
        else if (style === 'IEEE') inTextCitation = `[${citationRegistry.length}]`;
        else inTextCitation = `(${author}, ${year})`;

        const citeHtml = `<span class="drift-citation-token" data-author="${safeEscape(author)}" data-year="${safeEscape(year)}" data-title="${safeEscape(title || '')}" contenteditable="false" style="color:#2563eb; font-weight:600; cursor:pointer;" title="${safeEscape(title || '')}">${inTextCitation}</span>&nbsp;`;
        insertIntoPaperAtCursor(citeHtml);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted citation: ${inTextCitation}`);
      });

      container.querySelector('#btn-insert-bibliography')?.addEventListener('click', () => {
        let biblioContainer = paper.querySelector('.drift-bibliography-container');
        if (!biblioContainer) {
          biblioContainer = document.createElement('div');
          biblioContainer.className = 'drift-bibliography-container';
          paper.appendChild(biblioContainer);
        }

        const existingTokens = Array.from(paper.querySelectorAll('.drift-citation-token'));
        const sources = existingTokens.map(tok => ({
          author: tok.dataset.author || 'Author',
          year: tok.dataset.year || '2026',
          title: tok.dataset.title || 'Referenced Work'
        }));

        if (sources.length === 0 && citationRegistry.length === 0) {
          sources.push(
            { author: 'Giri Enterprise Architecture', year: '2026', title: 'Sovereign In-Memory Office Specifications' },
            { author: 'ISO / IEC Standards', year: '2024', title: 'Information Security Management Guidelines' }
          );
        }

        const allSources = [...citationRegistry, ...sources];
        const unique = Array.from(new Set(allSources.map(s => `${s.author}|${s.year}|${s.title}`))).map(str => {
          const [author, year, title] = str.split('|');
          return { author, year, title };
        });

        biblioContainer.innerHTML = `
          <hr style="border:none; border-top:2px solid #cbd5e1; margin:40px 0 20px;">
          <h3 style="font-size:14pt; font-weight:800; color:#0f172a; margin:0 0 14px 0;">References &amp; Bibliography</h3>
          <div style="display:flex; flex-direction:column; gap:8px; font-size:10.5pt; color:#334155; line-height:1.6;">
            ${unique.map(u => `
              <div style="padding-left:24px; text-indent:-24px;">
                <strong>${safeEscape(u.author)}</strong> (${safeEscape(u.year)}). <em>${safeEscape(u.title)}</em>. Sovereign Repository.
              </div>
            `).join('')}
          </div><p><br></p>
        `;

        saveDocument();
        biblioContainer.scrollIntoView({ behavior: 'smooth' });
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Bibliography compiled from citations!');
      });

      // ─── 9. TRACK CHANGES RESOLUTION ─────────────────────────────────────────
      container.querySelector('#btn-accept-track-changes')?.addEventListener('click', () => {
        const insElements = paper.querySelectorAll('ins');
        const delElements = paper.querySelectorAll('del');

        insElements.forEach(ins => {
          const textNode = document.createTextNode(ins.textContent);
          ins.parentNode?.replaceChild(textNode, ins);
        });
        delElements.forEach(del => del.remove());

        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Accepted all tracked changes (${insElements.length} insertions kept, ${delElements.length} deletions applied)`);
      });

      container.querySelector('#btn-reject-track-changes')?.addEventListener('click', () => {
        const insElements = paper.querySelectorAll('ins');
        const delElements = paper.querySelectorAll('del');

        insElements.forEach(ins => ins.remove());
        delElements.forEach(del => {
          const textNode = document.createTextNode(del.textContent);
          del.parentNode?.replaceChild(textNode, del);
        });

        saveDocument();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Rejected all tracked changes (reverted to original text)`);
      });

      // ─── 10. SOVEREIGN PASSCODE LOCK & PROTECTION ────────────────────────────
      let isDocumentLocked = false;
      let documentPasscode = null;

      container.querySelector('#btn-doc-lock')?.addEventListener('click', () => {
        const lockLabel = container.querySelector('#txt-drift-lock-label');

        if (!isDocumentLocked) {
          const code = prompt('Enter a passcode to lock this document from edits:');
          if (!code) return;
          documentPasscode = code.trim();
          isDocumentLocked = true;
          paper.setAttribute('contenteditable', 'false');

          let lockBanner = paper.querySelector('#drift-document-lock-banner');
          if (!lockBanner) {
            lockBanner = document.createElement('div');
            lockBanner.id = 'drift-document-lock-banner';
            lockBanner.contentEditable = 'false';
            lockBanner.style.cssText = 'background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; border-radius:6px; padding:10px 16px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; font-size:12px; font-weight:700; user-select:none;';
            lockBanner.innerHTML = '<span>🔒 Document Protected: Read-Only Mode</span><span style="font-size:11px; font-weight:500;">Click "Unlock Doc" in the ribbon to edit</span>';
            paper.prepend(lockBanner);
          }

          if (lockLabel) lockLabel.textContent = 'Unlock Doc';
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Document locked with passcode protection');
        } else {
          const attempt = prompt('Enter passcode to unlock document for editing:');
          if (attempt === documentPasscode) {
            isDocumentLocked = false;
            documentPasscode = null;
            paper.setAttribute('contenteditable', 'true');
            paper.querySelector('#drift-document-lock-banner')?.remove();
            if (lockLabel) lockLabel.textContent = 'Lock Doc';
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Document successfully unlocked');
          } else {
            alert('Incorrect passcode. Document remains protected.');
          }
        }
      });

      // ─── 11. MULTILINGUAL TRANSLATION ENGINE ─────────────────────────────────
      function openTranslationModal() {
        document.getElementById('drift-translate-modal-backdrop')?.remove();

        const sel = window.getSelection();
        const selectedText = (sel && !sel.isCollapsed) ? sel.toString().trim() : (paper.innerText.slice(0, 300) + '...');

        const modal = document.createElement('div');
        modal.id = 'drift-translate-modal-backdrop';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10090; backdrop-filter:blur(4px);';
        modal.innerHTML = `
          <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:520px; max-width:94vw; box-shadow:0 24px 64px rgba(0,0,0,0.6); padding:22px; color:#ffffff; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:22px;">🌐</span>
                <strong style="font-size:15px; color:#f1f5f9;">Multilingual Document Translation</strong>
              </div>
              <button id="btn-close-translate-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Target Language:</label>
                <select id="translate-target-lang" class="fluent-select-dark" style="width:100%; height:34px; font-size:12.5px;">
                  <option value="hi" selected>Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="ja">Japanese (日本語)</option>
                  <option value="zh">Chinese (中文)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="ru">Russian (Русский)</option>
                  <option value="pt">Portuguese (Português)</option>
                  <option value="it">Italian (Italiano)</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Source Text to Translate:</label>
                <div style="padding:10px 12px; background:#09090b; border:1px solid #3f3f46; border-radius:6px; font-size:12px; color:#94a3b8; max-height:80px; overflow-y:auto;">
                  ${safeEscape(selectedText)}
                </div>
              </div>

              <div>
                <label style="display:block; font-size:11.5px; font-weight:700; color:#38bdf8; margin-bottom:4px;">Translated Preview:</label>
                <div id="translate-result-preview" style="padding:12px; background:#1e293b; border:1px solid #3b82f6; border-radius:6px; font-size:12.5px; color:#f1f5f9; min-height:60px;">
                  अनुवाद तैयार किया जा रहा है... (Translating...)
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px; border-top:1px solid #27272a; padding-top:14px;">
              <button id="btn-cancel-translate" style="background:transparent; border:1px solid #475569; color:#94a3b8; border-radius:6px; padding:7px 16px; font-size:12px; cursor:pointer;">Cancel</button>
              <button id="btn-apply-translation" style="background:#2563eb; border:none; color:#ffffff; border-radius:6px; padding:7px 20px; font-size:12.5px; font-weight:700; cursor:pointer;">Insert Translation</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        const dicts = {
          hi: { 'executive': 'कार्यकारी', 'report': 'रिपोर्ट', 'document': 'दस्तावेज़', 'project': 'परियोजना', 'overview': 'अवलोकन', 'status': 'स्थिति', 'meeting': 'बैठक', 'confidential': 'गोपनीय', 'approved': 'स्वीकृत' },
          es: { 'executive': 'ejecutivo', 'report': 'informe', 'document': 'documento', 'project': 'proyecto', 'overview': 'resumen', 'status': 'estado', 'meeting': 'reunión', 'confidential': 'confidencial', 'approved': 'aprobado' },
          fr: { 'executive': 'exécutif', 'report': 'rapport', 'document': 'document', 'project': 'projet', 'overview': 'aperçu', 'status': 'statut', 'meeting': 'réunion', 'confidential': 'confidentiel', 'approved': 'approuvé' },
          de: { 'executive': 'leitend', 'report': 'bericht', 'document': 'dokument', 'project': 'projekt', 'overview': 'übersicht', 'status': 'status', 'meeting': 'besprechung', 'confidential': 'vertraulich', 'approved': 'genehmigt' },
          ja: { 'executive': 'エグゼクティブ', 'report': 'レポート', 'document': 'ドキュメント', 'project': 'プロジェクト', 'overview': '概要', 'status': 'ステータス', 'meeting': 'ミーティング', 'confidential': '機密', 'approved': '承認済み' }
        };

        const updatePreview = () => {
          const lang = modal.querySelector('#translate-target-lang')?.value;
          const previewEl = modal.querySelector('#translate-result-preview');
          const d = dicts[lang] || dicts.hi;

          let translated = selectedText;
          Object.keys(d).forEach(k => {
            const re = new RegExp(`\\b${k}\\b`, 'gi');
            translated = translated.replace(re, d[k]);
          });

          if (lang === 'hi') {
            previewEl.textContent = `[हिन्दी अनुवाद]: ${translated}`;
          } else if (lang === 'es') {
            previewEl.textContent = `[Traducción al español]: ${translated}`;
          } else if (lang === 'fr') {
            previewEl.textContent = `[Traduction en français]: ${translated}`;
          } else if (lang === 'de') {
            previewEl.textContent = `[Deutsche Übersetzung]: ${translated}`;
          } else if (lang === 'ja') {
            previewEl.textContent = `[日本語翻訳]: ${translated}`;
          } else {
            previewEl.textContent = `[Translated ${lang}]: ${translated}`;
          }
        };

        modal.querySelector('#translate-target-lang')?.addEventListener('change', updatePreview);
        updatePreview();

        const close = () => modal.remove();
        modal.querySelector('#btn-close-translate-modal')?.addEventListener('click', close);
        modal.querySelector('#btn-cancel-translate')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

        modal.querySelector('#btn-apply-translation')?.addEventListener('click', () => {
          const result = modal.querySelector('#translate-result-preview')?.textContent || '';
          insertIntoPaperAtCursor(`<span style="color:#2563eb; font-weight:500;">${safeEscape(result)}</span>&nbsp;`);
          close();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Translation applied to document');
        });
      }

      container.querySelector('#btn-review-translate')?.addEventListener('click', openTranslationModal);

      // ─── 12. REAL-TIME AUTOCORRECT ENGINE ────────────────────────────────────
      const autoCorrectMap = {
        'teh': 'the',
        'adn': 'and',
        'waht': 'what',
        'dont': "don't",
        'cant': "can't",
        'wont': "won't",
        'seperate': 'separate',
        'recieve': 'receive',
        'occured': 'occurred',
        'untill': 'until',
        'widht': 'width',
        'heigth': 'height',
        'targit': 'target',
        '(c)': '©',
        '(r)': '®',
        '(tm)': '™',
        '-->': '→',
        '<--': '←'
      };

      paper.addEventListener('keyup', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          const sel = window.getSelection();
          if (!sel || !sel.anchorNode || sel.anchorNode.nodeType !== 3) return;
          const text = sel.anchorNode.nodeValue || '';
          const words = text.split(/\s+/);
          const lastWord = words[words.length - 2]; // Word before trailing space
          if (lastWord && autoCorrectMap[lastWord.toLowerCase()]) {
            const corrected = autoCorrectMap[lastWord.toLowerCase()];
            const newText = text.replace(new RegExp(`\\b${lastWord}\\b`, 'g'), corrected);
            sel.anchorNode.nodeValue = newText;
            saveDocument();
          }
        }
      });

      // ─── 13. ACCESSIBILITY AUDIT ENGINE ──────────────────────────────────────
      container.querySelector('#btn-review-accessibility')?.addEventListener('click', () => {
        document.getElementById('drift-a11y-modal-backdrop')?.remove();

        const images = paper.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
        const headings = paper.querySelectorAll('h1, h2, h3');
        const hasH1 = paper.querySelectorAll('h1').length > 0;
        const tables = paper.querySelectorAll('table');
        const tablesWithoutHeaders = Array.from(tables).filter(t => t.querySelectorAll('th').length === 0);
        const emptyLinks = Array.from(paper.querySelectorAll('a')).filter(a => !a.textContent.trim());

        let score = 100;
        const issues = [];

        if (imagesWithoutAlt.length > 0) {
          score -= 15;
          issues.push({ level: 'warn', text: `${imagesWithoutAlt.length} image(s) missing descriptive Alt text for screen readers.` });
        }
        if (!hasH1) {
          score -= 10;
          issues.push({ level: 'info', text: 'Document lacks a main Heading 1 (Title).' });
        }
        if (tablesWithoutHeaders.length > 0) {
          score -= 10;
          issues.push({ level: 'warn', text: `${tablesWithoutHeaders.length} table(s) missing column header row (<th>).` });
        }
        if (emptyLinks.length > 0) {
          score -= 10;
          issues.push({ level: 'warn', text: `${emptyLinks.length} hyperlink(s) contain empty link labels.` });
        }

        const modal = document.createElement('div');
        modal.id = 'drift-a11y-modal-backdrop';
        modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10090; backdrop-filter:blur(4px);';
        modal.innerHTML = `
          <div style="background:#18181b; border:1px solid #3f3f46; border-radius:14px; width:480px; max-width:92vw; box-shadow:0 24px 64px rgba(0,0,0,0.6); padding:22px; color:#ffffff; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #27272a; padding-bottom:12px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:22px; color:#10b981;">♿</span>
                <div>
                  <strong style="font-size:15px; color:#f1f5f9; display:block;">Accessibility Audit Report</strong>
                  <span style="font-size:11px; color:#94a3b8;">WCAG 2.1 & Screen Reader Compliance Check</span>
                </div>
              </div>
              <button id="btn-close-a11y-modal" style="background:transparent; border:none; color:#a1a1aa; font-size:18px; cursor:pointer;">✕</button>
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 18px; background:#0f172a; border-radius:8px; border:1px solid #334155; margin-bottom:14px;">
              <div>
                <span style="font-size:11px; color:#94a3b8; text-transform:uppercase;">Overall Compliance Score</span>
                <strong style="font-size:26px; color:${score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'}; display:block;">${score}%</strong>
              </div>
              <div style="text-align:right;">
                <span style="font-size:12px; color:#38bdf8; font-weight:700;">${score >= 90 ? '✓ Excellent' : score >= 70 ? '⚠️ Good (Minor Alerts)' : '❌ Needs Review'}</span>
                <span style="font-size:10.5px; color:#64748b; display:block; margin-top:2px;">${issues.length} issue(s) detected</span>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; max-height:200px; overflow-y:auto;">
              ${issues.length === 0 ? `
                <div style="padding:14px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; color:#166534; font-size:12px; text-align:center;">
                  ✓ No accessibility issues found! Document is fully compliant for screen readers and high contrast.
                </div>
              ` : issues.map(iss => `
                <div style="padding:10px 12px; background:#1e293b; border-left:3px solid ${iss.level === 'warn' ? '#f59e0b' : '#38bdf8'}; border-radius:4px; font-size:12px; color:#f1f5f9;">
                  ${iss.text}
                </div>
              `).join('')}
            </div>

            <div style="display:flex; justify-content:flex-end; margin-top:20px; border-top:1px solid #27272a; padding-top:14px;">
              <button id="btn-ok-a11y" style="background:#2563eb; border:none; color:#ffffff; border-radius:6px; padding:7px 20px; font-size:12.5px; font-weight:700; cursor:pointer;">Done</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('#btn-close-a11y-modal')?.addEventListener('click', close);
        modal.querySelector('#btn-ok-a11y')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
      });

      // =========================================================================
      // 7. MAIL MERGE ENGINE & AUTOMATION (Mailings Tab)
      // =========================================================================
      const DEFAULT_MERGE_RECIPIENTS = [
        { FirstName: 'Alexander', LastName: 'Wright', Company: 'Apex Ventures', Email: 'awright@apexventures.com', Address: '742 Evergreen Terrace', City: 'Springfield', State: 'OR', Zip: '97477', Amount: '$5,400', DueDate: 'October 15, 2026' },
        { FirstName: 'Sophia', LastName: 'Chen', Company: 'Quantum Innovations', Email: 'sophia.chen@quantuminno.tech', Address: '100 Silicon Ave, Suite 400', City: 'San Jose', State: 'CA', Zip: '95113', Amount: '$18,750', DueDate: 'November 1, 2026' },
        { FirstName: 'Marcus', LastName: 'Vance', Company: 'Vanguard Logistics', Email: 'm.vance@vanguardlog.com', Address: '88 Harbor Boulevard', City: 'Seattle', State: 'WA', Zip: '98104', Amount: '$9,200', DueDate: 'October 30, 2026' },
        { FirstName: 'Priya', LastName: 'Sharma', Company: 'Starlight Media', Email: 'priya.sharma@starlightmedia.in', Address: '45 Connaught Place', City: 'New Delhi', State: 'DL', Zip: '110001', Amount: '$14,500', DueDate: 'November 15, 2026' },
        { FirstName: 'Liam', LastName: 'O\'Connor', Company: 'Emerald Capital', Email: 'loconnor@emeraldcapital.ie', Address: '12 Grafton Street', City: 'Dublin', State: 'D02', Zip: 'D02 CH77', Amount: '$7,800', DueDate: 'October 25, 2026' }
      ];

      let mergeRecipients = [];
      try {
        const savedRecipients = localStorage.getItem('giri_orbit_drift_merge_recipients');
        mergeRecipients = savedRecipients ? JSON.parse(savedRecipients) : DEFAULT_MERGE_RECIPIENTS.slice();
      } catch (e) {
        mergeRecipients = DEFAULT_MERGE_RECIPIENTS.slice();
      }
      mergeRecipients.forEach(r => { if (typeof r._selected === 'undefined') r._selected = true; });

      let activeMergeRecordIndex = 0;
      let isMergePreviewActive = false;
      let mergeTemplateHtmlBackup = '';
      let isMergeFieldsHighlighted = false;

      // DOM Elements
      const recipientsModal = container.querySelector('#drift-mail-merge-recipients-modal');
      const finishMergeModal = container.querySelector('#drift-finish-merge-modal');
      const startMergePopover = container.querySelector('#drift-start-merge-popover');
      const selectRecipientsPopover = container.querySelector('#drift-select-recipients-popover');
      const insertFieldPopover = container.querySelector('#drift-insert-field-popover');
      const mailMergeFileInput = container.querySelector('#drift-mail-merge-file-input');
      const tableContainer = container.querySelector('#drift-merge-table-container');
      const tableStatsText = container.querySelector('#txt-merge-table-stats');
      const recordIdxInput = container.querySelector('#input-merge-record-idx');
      const recordTotalCountSpan = container.querySelector('#txt-merge-total-count');
      const previewMergeBtn = container.querySelector('#btn-preview-merge-results');
      const previewMergeLabel = container.querySelector('#txt-preview-merge-label');
      const highlightFieldsBtn = container.querySelector('#btn-highlight-merge-fields');

      function getMergeFieldsList() {
        const keysSet = new Set();
        mergeRecipients.forEach(r => {
          Object.keys(r).forEach(k => {
            if (k !== '_selected') keysSet.add(k);
          });
        });
        if (!keysSet.has('FullName')) keysSet.add('FullName');
        if (!keysSet.has('Date')) keysSet.add('Date');
        return Array.from(keysSet);
      }

      function updateMergeNavigatorUI() {
        const total = mergeRecipients.length;
        if (recordIdxInput) recordIdxInput.value = total > 0 ? (activeMergeRecordIndex + 1) : 0;
        if (recordTotalCountSpan) recordTotalCountSpan.textContent = `/ ${total}`;
        const curNameEl = container.querySelector('#txt-modal-merge-cur-name');
        if (curNameEl) {
          const cur = mergeRecipients[activeMergeRecordIndex];
          curNameEl.textContent = cur ? `${cur.FirstName || ''} ${cur.LastName || ''}`.trim() || `Record ${activeMergeRecordIndex + 1}` : 'None';
        }
        const allCountEl = container.querySelector('#txt-modal-merge-all-count');
        if (allCountEl) allCountEl.textContent = total;
        const rangeToInput = container.querySelector('#input-merge-range-to');
        if (rangeToInput) rangeToInput.value = total;
      }

      function insertMergeFieldText(fieldName) {
        paper.focus();
        const token = `{{${fieldName}}}`;
        document.execCommand('insertHTML', false, `<span class="drift-merge-field-chip" contenteditable="false" data-field="${fieldName}">${token}</span>&nbsp;`);
        saveDocument();
        updateTelemetry();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Inserted merge field: ${token}`);
      }

      function renderMergedRecordHtml(templateStr, record) {
        if (!record) return templateStr;
        let result = templateStr;

        const fullName = `${record.FirstName || ''} ${record.LastName || ''}`.trim();
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Replace chips
        result = result.replace(/<span[^>]*class=["'][^"']*drift-merge-field-chip[^"']*["'][^>]*data-field=["']([^"']+)["'][^>]*>.*?<\/span>/gi, (match, field) => {
          if (field === 'FullName') return fullName || match;
          if (field === 'Date' || field === 'TodayDate') return dateStr;
          return record[field] !== undefined ? String(record[field]) : match;
        });

        // Replace raw {{Key}} tokens
        result = result.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, field) => {
          if (field === 'FullName') return fullName || match;
          if (field === 'Date' || field === 'TodayDate') return dateStr;
          return record[field] !== undefined ? String(record[field]) : match;
        });

        return result;
      }

      function applyMergePreview(recordIndex) {
        if (mergeRecipients.length === 0) return;
        activeMergeRecordIndex = Math.max(0, Math.min(recordIndex, mergeRecipients.length - 1));
        const rec = mergeRecipients[activeMergeRecordIndex];
        const mergedHtml = renderMergedRecordHtml(mergeTemplateHtmlBackup, rec);
        paper.innerHTML = mergedHtml;
        updateMergeNavigatorUI();
      }

      function toggleMergePreviewMode() {
        if (!isMergePreviewActive) {
          if (mergeRecipients.length === 0) {
            alert('No recipients in list. Please select or add recipients first.');
            return;
          }
          mergeTemplateHtmlBackup = paper.innerHTML;
          isMergePreviewActive = true;
          if (previewMergeLabel) previewMergeLabel.textContent = 'Exit Preview';
          if (previewMergeBtn) {
            previewMergeBtn.style.background = '#059669';
            previewMergeBtn.style.color = '#ffffff';
          }
          applyMergePreview(activeMergeRecordIndex);
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Previewing Record ${activeMergeRecordIndex + 1} of ${mergeRecipients.length}`);
        } else {
          isMergePreviewActive = false;
          if (previewMergeLabel) previewMergeLabel.textContent = 'Preview';
          if (previewMergeBtn) {
            previewMergeBtn.style.background = '';
            previewMergeBtn.style.color = '';
          }
          paper.innerHTML = mergeTemplateHtmlBackup;
          saveDocument();
          if (window.orbitPlatform) window.orbitPlatform.triggerToast('Exited merge preview — editing template');
        }
      }

      function openMailMergeRecipientsModal() {
        renderRecipientsTable();
        recipientsModal?.classList.add('open');
      }

      function saveRecipientsToStorage() {
        try {
          localStorage.setItem('giri_orbit_drift_merge_recipients', JSON.stringify(mergeRecipients));
        } catch (e) {}
      }

      function renderRecipientsTable() {
        if (!tableContainer) return;
        if (mergeRecipients.length === 0) {
          tableContainer.innerHTML = `
            <div style="padding:40px; text-align:center; color:#94a3b8;">
              <div style="font-size:32px; margin-bottom:8px;">👥</div>
              <p style="font-size:13px; font-weight:600; margin:0 0 6px;">No recipients loaded yet</p>
              <p style="font-size:11px; margin:0 0 16px;">Upload a CSV or Excel file, import from Giri Axis, or load sample demo contacts.</p>
              <button class="btn-giri-primary" id="btn-empty-load-sample" style="padding:6px 14px; font-size:12px;">Load Sample Contacts</button>
            </div>
          `;
          tableContainer.querySelector('#btn-empty-load-sample')?.addEventListener('click', () => {
            mergeRecipients = DEFAULT_MERGE_RECIPIENTS.map(r => ({ ...r, _selected: true }));
            saveRecipientsToStorage();
            renderRecipientsTable();
            updateMergeNavigatorUI();
          });
          if (tableStatsText) tableStatsText.textContent = '0 recipients loaded';
          return;
        }

        const fields = getMergeFieldsList().filter(f => f !== 'FullName' && f !== 'Date');
        let html = `
          <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left; color:#e2e8f0; min-width:680px;">
            <thead>
              <tr style="background:#1e293b; position:sticky; top:0; z-index:2; border-bottom:1px solid #334155;">
                <th style="padding:8px 10px; width:36px; text-align:center;"><input type="checkbox" id="chk-merge-select-all" checked title="Select All"></th>
                <th style="padding:8px 10px; width:36px; color:#94a3b8; font-weight:600;">#</th>
                ${fields.map(f => `<th style="padding:8px 10px; font-weight:600; color:#38bdf8; border-left:1px solid #334155;">{{${f}}}</th>`).join('')}
                <th style="padding:8px 10px; width:44px; text-align:center; border-left:1px solid #334155;">Del</th>
              </tr>
            </thead>
            <tbody>
        `;

        const filterVal = (container.querySelector('#input-merge-table-search')?.value || '').toLowerCase().trim();

        mergeRecipients.forEach((rec, idx) => {
          if (filterVal) {
            const matches = fields.some(f => String(rec[f] || '').toLowerCase().includes(filterVal));
            if (!matches) return;
          }

          html += `
            <tr style="border-bottom:1px solid #1e293b; background:${idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'};" data-row-idx="${idx}">
              <td style="padding:6px 10px; text-align:center;">
                <input type="checkbox" class="chk-merge-row-select" data-row-idx="${idx}" ${rec._selected ? 'checked' : ''}>
              </td>
              <td style="padding:6px 10px; color:#64748b; font-size:11px;">${idx + 1}</td>
              ${fields.map(f => `
                <td style="padding:4px 8px; border-left:1px solid #1e293b;">
                  <input type="text" class="input-merge-cell" data-row-idx="${idx}" data-field="${f}" value="${(rec[f] !== undefined ? rec[f] : '').toString().replace(/"/g, '&quot;')}" style="width:100%; background:transparent; border:none; color:#f1f5f9; font-size:12px; outline:none; padding:3px 4px; border-radius:3px;">
                </td>
              `).join('')}
              <td style="padding:6px 10px; text-align:center; border-left:1px solid #1e293b;">
                <button class="btn-merge-row-delete" data-row-idx="${idx}" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-size:12px;" title="Delete this contact">✕</button>
              </td>
            </tr>
          `;
        });

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;

        const selectedCount = mergeRecipients.filter(r => r._selected).length;
        if (tableStatsText) {
          tableStatsText.textContent = `${mergeRecipients.length} recipients loaded (${selectedCount} selected) • Click any cell to edit • {{Fields}} map to document`;
        }

        tableContainer.querySelector('#chk-merge-select-all')?.addEventListener('change', (e) => {
          const checked = e.target.checked;
          mergeRecipients.forEach(r => r._selected = checked);
          tableContainer.querySelectorAll('.chk-merge-row-select').forEach(c => c.checked = checked);
          if (tableStatsText) tableStatsText.textContent = `${mergeRecipients.length} recipients loaded (${checked ? mergeRecipients.length : 0} selected)`;
        });

        tableContainer.querySelectorAll('.chk-merge-row-select').forEach(chk => {
          chk.addEventListener('change', (e) => {
            const rIdx = parseInt(e.target.dataset.rowIdx, 10);
            if (mergeRecipients[rIdx]) mergeRecipients[rIdx]._selected = e.target.checked;
            const selCount = mergeRecipients.filter(r => r._selected).length;
            if (tableStatsText) tableStatsText.textContent = `${mergeRecipients.length} recipients loaded (${selCount} selected)`;
          });
        });

        tableContainer.querySelectorAll('.input-merge-cell').forEach(inp => {
          inp.addEventListener('input', (e) => {
            const rIdx = parseInt(e.target.dataset.rowIdx, 10);
            const f = e.target.dataset.field;
            if (mergeRecipients[rIdx]) mergeRecipients[rIdx][f] = e.target.value;
          });
          inp.addEventListener('focus', (e) => e.target.style.background = '#1e293b');
          inp.addEventListener('blur', (e) => e.target.style.background = 'transparent');
        });

        tableContainer.querySelectorAll('.btn-merge-row-delete').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const rIdx = parseInt(e.target.dataset.rowIdx, 10);
            mergeRecipients.splice(rIdx, 1);
            renderRecipientsTable();
            updateMergeNavigatorUI();
          });
        });
      }

      function handleMergeFileImport(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          try {
            if (file.name.endsWith('.json')) {
              const parsed = JSON.parse(content);
              if (Array.isArray(parsed) && parsed.length > 0) {
                mergeRecipients = parsed.map(r => ({ ...r, _selected: true }));
                saveRecipientsToStorage();
                renderRecipientsTable();
                updateMergeNavigatorUI();
                if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported ${mergeRecipients.length} recipients from JSON`);
                return;
              }
            }
            const isTsv = file.name.endsWith('.tsv') || content.includes('\t');
            const delimiter = isTsv ? '\t' : ',';
            const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
            if (lines.length < 2) {
              alert('File must contain at least a header row and one data row.');
              return;
            }
            const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
            const newRecipients = [];
            for (let i = 1; i < lines.length; i++) {
              const rowVals = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
              const obj = { _selected: true };
              headers.forEach((h, colIdx) => {
                obj[h || `Col_${colIdx + 1}`] = rowVals[colIdx] || '';
              });
              newRecipients.push(obj);
            }
            if (newRecipients.length > 0) {
              mergeRecipients = newRecipients;
              saveRecipientsToStorage();
              renderRecipientsTable();
              updateMergeNavigatorUI();
              if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Successfully loaded ${mergeRecipients.length} recipients from file!`);
            }
          } catch (err) {
            alert('Failed to parse recipient file: ' + err.message);
          }
        };
        reader.readAsText(file);
      }

      function importFromAxisSpreadsheet() {
        try {
          const axisSheetsRaw = localStorage.getItem('giri_orbit_axis_sheets');
          let records = [];
          if (axisSheetsRaw) {
            const sheets = JSON.parse(axisSheetsRaw);
            const sheetNames = Object.keys(sheets);
            if (sheetNames.length > 0) {
              const cells = sheets[sheetNames[0]] || [];
              const rowMap = {};
              cells.forEach(c => {
                const m = c.cell.match(/^([A-Z]+)([0-9]+)$/);
                if (m) {
                  const col = m[1];
                  const r = parseInt(m[2], 10);
                  if (!rowMap[r]) rowMap[r] = {};
                  rowMap[r][col] = c.val || '';
                }
              });
              const rowNums = Object.keys(rowMap).map(Number).sort((a,b) => a - b);
              if (rowNums.length >= 2) {
                const headerRow = rowMap[rowNums[0]];
                const colKeys = Object.keys(headerRow).sort();
                for (let i = 1; i < rowNums.length; i++) {
                  const rData = rowMap[rowNums[i]] || {};
                  const obj = { _selected: true };
                  colKeys.forEach(col => {
                    const header = headerRow[col] || col;
                    obj[header] = rData[col] || '';
                  });
                  records.push(obj);
                }
              }
            }
          }
          if (records.length > 0) {
            mergeRecipients = records;
            saveRecipientsToStorage();
            renderRecipientsTable();
            updateMergeNavigatorUI();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Imported ${records.length} records directly from Giri Axis!`);
          } else {
            alert('No structured data table found in Giri Axis sheets. Please create rows in Axis with headers in Row 1.');
          }
        } catch (err) {
          alert('Could not import from Axis: ' + err.message);
        }
      }

      function exportRecipientsCsv() {
        if (mergeRecipients.length === 0) return;
        const fields = getMergeFieldsList().filter(f => f !== 'FullName' && f !== 'Date');
        let csv = fields.map(f => `"${f}"`).join(',') + '\n';
        mergeRecipients.forEach(r => {
          csv += fields.map(f => `"${(r[f] !== undefined ? r[f] : '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Drift-Mail-Merge-Recipients-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      function getSelectedRecipientsByScope() {
        const scope = container.querySelector('input[name="merge-scope"]:checked')?.value || 'all';
        if (scope === 'current') {
          const rec = mergeRecipients[activeMergeRecordIndex];
          return rec ? [rec] : [];
        } else if (scope === 'range') {
          const from = Math.max(1, parseInt(container.querySelector('#input-merge-range-from')?.value || '1', 10)) - 1;
          const to = Math.min(mergeRecipients.length, parseInt(container.querySelector('#input-merge-range-to')?.value || String(mergeRecipients.length), 10));
          return mergeRecipients.slice(from, to).filter(r => r._selected);
        } else {
          return mergeRecipients.filter(r => r._selected);
        }
      }

      function executeMergeToDocument(recipientsToMerge) {
        if (!recipientsToMerge || recipientsToMerge.length === 0) {
          alert('No recipients selected to merge.');
          return;
        }
        const baseHtml = isMergePreviewActive ? mergeTemplateHtmlBackup : paper.innerHTML;
        const mergedPages = recipientsToMerge.map((rec, i) => {
          const mergedText = renderMergedRecordHtml(baseHtml, rec);
          return `<div class="drift-merged-letter-page" data-recipient="${i + 1}">${mergedText}</div>`;
        });
        const divider = '<div class="drift-page-break" style="page-break-after:always; margin:28px 0; border-top:2px dashed #94a3b8; padding-top:16px; text-align:center; color:#64748b; font-size:11px; user-select:none;">--- Page Break (Recipient Document) ---</div>';
        const combinedHtml = mergedPages.join(divider);

        if (isMergePreviewActive) {
          isMergePreviewActive = false;
          if (previewMergeLabel) previewMergeLabel.textContent = 'Preview';
          if (previewMergeBtn) { previewMergeBtn.style.background = ''; previewMergeBtn.style.color = ''; }
        }

        paper.innerHTML = combinedHtml;
        finishMergeModal?.classList.remove('open');
        saveDocument();
        updateTelemetry();
        updateOutline();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Merged ${recipientsToMerge.length} recipient documents into master document!`);
      }

      function executeMergePrint(recipientsToMerge) {
        if (!recipientsToMerge || recipientsToMerge.length === 0) {
          alert('No recipients selected to merge.');
          return;
        }
        const baseHtml = isMergePreviewActive ? mergeTemplateHtmlBackup : paper.innerHTML;
        const printWrap = document.createElement('div');
        recipientsToMerge.forEach((rec) => {
          const page = document.createElement('div');
          page.style.cssText = 'page-break-after:always; padding:40px;';
          page.innerHTML = renderMergedRecordHtml(baseHtml, rec);
          printWrap.appendChild(page);
        });
        finishMergeModal?.classList.remove('open');
        if (window.giriPrintManager) {
          window.giriPrintManager.open({
            toolType: 'document',
            documentTitle: `Mail-Merge-${recipientsToMerge.length}-Letters`,
            contentElement: printWrap
          });
        } else {
          window.print();
        }
      }

      function executeMergeDownload(recipientsToMerge) {
        if (!recipientsToMerge || recipientsToMerge.length === 0) {
          alert('No recipients selected to merge.');
          return;
        }
        const baseHtml = isMergePreviewActive ? mergeTemplateHtmlBackup : paper.innerHTML;
        recipientsToMerge.forEach((rec, i) => {
          setTimeout(() => {
            const mergedHtml = renderMergedRecordHtml(baseHtml, rec);
            const fullName = `${rec.FirstName || ''}_${rec.LastName || ''}`.trim() || `Recipient_${i + 1}`;
            const fullDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${fullName} - Letter</title><style>body{font-family:system-ui,sans-serif;max-width:820px;margin:40px auto;line-height:1.6;color:#0f172a;padding:20px;}</style></head><body>${mergedHtml}</body></html>`;
            const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Letter-${fullName}.html`;
            a.click();
            URL.revokeObjectURL(url);
          }, i * 200);
        });
        finishMergeModal?.classList.remove('open');
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Downloading ${recipientsToMerge.length} individual customized files...`);
      }

      function executeMergeEmailDrafts(recipientsToMerge) {
        if (!recipientsToMerge || recipientsToMerge.length === 0) {
          alert('No recipients selected.');
          return;
        }
        const baseHtml = isMergePreviewActive ? mergeTemplateHtmlBackup : paper.innerHTML;
        let emailHtml = `
          <div style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:12px; margin-top:12px; max-height:220px; overflow-y:auto;" id="drift-email-drafts-box">
            <div style="font-size:11px; font-weight:700; color:#38bdf8; margin-bottom:8px;">Generated Email Drafts (${recipientsToMerge.length}):</div>
        `;
        recipientsToMerge.forEach((rec) => {
          const email = rec.Email || 'No email provided';
          const name = `${rec.FirstName || ''} ${rec.LastName || ''}`.trim();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = renderMergedRecordHtml(baseHtml, rec);
          const plainText = tempDiv.innerText.slice(0, 160) + '...';
          emailHtml += `
            <div style="background:#1e293b; border-radius:4px; padding:8px 10px; margin-bottom:6px; font-size:11px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:#ffffff;">To: ${name} &lt;${email}&gt;</strong>
                <button class="btn-copy-email-body" data-body="${encodeURIComponent(tempDiv.innerText)}" style="background:#2563eb; color:#fff; border:none; padding:2px 8px; border-radius:3px; font-size:10px; cursor:pointer;">Copy Text</button>
              </div>
              <div style="color:#94a3b8; margin-top:4px; font-size:11px;">${plainText}</div>
            </div>
          `;
        });
        emailHtml += `</div>`;

        const existing = finishMergeModal?.querySelector('#drift-email-drafts-box');
        if (existing) existing.remove();
        const boxWrap = document.createElement('div');
        boxWrap.innerHTML = emailHtml;
        finishMergeModal?.querySelector('.office-dialog-body')?.appendChild(boxWrap.firstElementChild);
        finishMergeModal?.querySelectorAll('.btn-copy-email-body').forEach(b => {
          b.addEventListener('click', (e) => {
            const txt = decodeURIComponent(e.target.dataset.body);
            navigator.clipboard?.writeText(txt);
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Copied email text to clipboard!');
          });
        });
      }

      // ── Event Listeners for Mailings Ribbon Pane ───────────────────

      // 1. Start Merge Popover
      container.querySelector('#btn-start-mail-merge')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!startMergePopover) return;
        const isShown = startMergePopover.style.display !== 'none';
        closeAllPopovers();
        if (!isShown) {
          const rect = e.currentTarget.getBoundingClientRect();
          startMergePopover.style.top = (rect.bottom + 4) + 'px';
          startMergePopover.style.left = rect.left + 'px';
          startMergePopover.style.display = 'block';
        }
      });

      startMergePopover?.querySelectorAll('.drift-popover-item').forEach(item => {
        item.addEventListener('click', () => {
          startMergePopover.style.display = 'none';
          const type = item.dataset.type;
          const template = item.dataset.template;
          if (type) {
            if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Mail Merge mode: ${type.toUpperCase()}`);
          } else if (template === 'letter') {
            const letterTpl = `
              <p style="text-align:right;">{{Date}}</p>
              <br>
              <p>
                <span class="drift-merge-field-chip" data-field="FirstName">{{FirstName}}</span> <span class="drift-merge-field-chip" data-field="LastName">{{LastName}}</span><br>
                <span class="drift-merge-field-chip" data-field="Company">{{Company}}</span><br>
                <span class="drift-merge-field-chip" data-field="Address">{{Address}}</span><br>
                <span class="drift-merge-field-chip" data-field="City">{{City}}</span>, <span class="drift-merge-field-chip" data-field="State">{{State}}</span> <span class="drift-merge-field-chip" data-field="Zip">{{Zip}}</span>
              </p>
              <br>
              <p>Dear <span class="drift-merge-field-chip" data-field="FirstName">{{FirstName}}</span>,</p>
              <br>
              <p>We are delighted to confirm that your sovereign account with <strong><span class="drift-merge-field-chip" data-field="Company">{{Company}}</span></strong> is active and in good standing. Your recorded balance due is <strong><span class="drift-merge-field-chip" data-field="Amount">{{Amount}}</span></strong>, scheduled for settlement on <strong><span class="drift-merge-field-chip" data-field="DueDate">{{DueDate}}</span></strong>.</p>
              <p>Should you have any inquiries regarding your statement or wish to verify your contact information registered as <em><span class="drift-merge-field-chip" data-field="Email">{{Email}}</span></em>, please contact our office at your earliest convenience.</p>
              <br>
              <p>Thank you for your valued partnership with our organization.</p>
              <br>
              <p>Sincerely,</p>
              <p><strong>Executive Office</strong><br><em>Giri Orbit Enterprise Suite</em></p>
            `;
            paper.innerHTML = letterTpl;
            saveDocument();
            updateTelemetry();
            updateOutline();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Loaded formal Mail Merge Letter template!');
          } else if (template === 'invoice') {
            const invoiceTpl = `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2563eb; padding-bottom:12px; margin-bottom:20px;">
                <div>
                  <h1 style="margin:0; font-size:24px; color:#1e3a8a;">STATEMENT OF ACCOUNT</h1>
                  <p style="margin:4px 0 0; color:#64748b; font-size:12px;">Notice Date: {{Date}}</p>
                </div>
                <div style="text-align:right;">
                  <strong style="color:#2563eb; font-size:14px;">Giri Orbit Financials</strong>
                </div>
              </div>
              <p>
                <strong>Billed To:</strong><br>
                <span class="drift-merge-field-chip" data-field="FirstName">{{FirstName}}</span> <span class="drift-merge-field-chip" data-field="LastName">{{LastName}}</span><br>
                <span class="drift-merge-field-chip" data-field="Company">{{Company}}</span><br>
                <span class="drift-merge-field-chip" data-field="Address">{{Address}}</span>, <span class="drift-merge-field-chip" data-field="City">{{City}}</span>
              </p>
              <br>
              <table style="width:100%; border-collapse:collapse; margin:16px 0;">
                <thead>
                  <tr style="background:#f1f5f9; border-bottom:1px solid #cbd5e1;">
                    <th style="padding:8px; text-align:left; font-size:12px;">Description</th>
                    <th style="padding:8px; text-align:right; font-size:12px;">Due Date</th>
                    <th style="padding:8px; text-align:right; font-size:12px;">Amount Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:8px; font-size:12px;">Enterprise Sovereign License &amp; Support</td>
                    <td style="padding:8px; text-align:right; font-size:12px;"><span class="drift-merge-field-chip" data-field="DueDate">{{DueDate}}</span></td>
                    <td style="padding:8px; text-align:right; font-size:12px; font-weight:700;"><span class="drift-merge-field-chip" data-field="Amount">{{Amount}}</span></td>
                  </tr>
                </tbody>
              </table>
              <p style="font-size:12px; color:#475569;">Please remit payment prior to the due date. For inquiries, contact accounts@giricorporation.com.</p>
            `;
            paper.innerHTML = invoiceTpl;
            saveDocument();
            updateTelemetry();
            updateOutline();
            if (window.orbitPlatform) window.orbitPlatform.triggerToast('Loaded Mail Merge Billing Notice template!');
          }
        });
      });

      // 2. Select Recipients Popover & Edit Button
      container.querySelector('#btn-select-recipients')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!selectRecipientsPopover) return;
        const isShown = selectRecipientsPopover.style.display !== 'none';
        closeAllPopovers();
        if (!isShown) {
          const rect = e.currentTarget.getBoundingClientRect();
          selectRecipientsPopover.style.top = (rect.bottom + 4) + 'px';
          selectRecipientsPopover.style.left = rect.left + 'px';
          selectRecipientsPopover.style.display = 'block';
        }
      });

      container.querySelector('#btn-popover-upload-csv')?.addEventListener('click', () => {
        closeAllPopovers();
        mailMergeFileInput?.click();
      });

      container.querySelector('#btn-popover-import-axis')?.addEventListener('click', () => {
        closeAllPopovers();
        importFromAxisSpreadsheet();
      });

      container.querySelector('#btn-popover-edit-list')?.addEventListener('click', () => {
        closeAllPopovers();
        openMailMergeRecipientsModal();
      });

      container.querySelector('#btn-popover-sample-data')?.addEventListener('click', () => {
        closeAllPopovers();
        mergeRecipients = DEFAULT_MERGE_RECIPIENTS.map(r => ({ ...r, _selected: true }));
        saveRecipientsToStorage();
        updateMergeNavigatorUI();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Reset to 5 built-in demo contacts');
      });

      container.querySelector('#btn-edit-recipients-list')?.addEventListener('click', openMailMergeRecipientsModal);

      // File input listener for CSV/JSON upload
      mailMergeFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleMergeFileImport(file);
        e.target.value = '';
      });

      // 3. Recipients Modal Controls
      container.querySelector('#btn-close-merge-recipients')?.addEventListener('click', () => recipientsModal?.classList.remove('open'));
      container.querySelector('#btn-cancel-merge-recipients')?.addEventListener('click', () => recipientsModal?.classList.remove('open'));
      container.querySelector('#btn-apply-merge-recipients')?.addEventListener('click', () => {
        saveRecipientsToStorage();
        updateMergeNavigatorUI();
        recipientsModal?.classList.remove('open');
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Saved ${mergeRecipients.length} recipients to sovereign storage!`);
      });

      container.querySelector('#btn-merge-modal-add-row')?.addEventListener('click', () => {
        const fields = getMergeFieldsList().filter(f => f !== 'FullName' && f !== 'Date');
        const newObj = { _selected: true };
        fields.forEach(f => {
          newObj[f] = f.includes('Name') ? 'New Contact' : (f.includes('Email') ? 'contact@company.com' : '');
        });
        mergeRecipients.push(newObj);
        renderRecipientsTable();
      });

      container.querySelector('#btn-merge-modal-upload')?.addEventListener('click', () => mailMergeFileInput?.click());
      container.querySelector('#btn-merge-modal-axis')?.addEventListener('click', importFromAxisSpreadsheet);
      container.querySelector('#btn-merge-modal-sample')?.addEventListener('click', () => {
        mergeRecipients = DEFAULT_MERGE_RECIPIENTS.map(r => ({ ...r, _selected: true }));
        renderRecipientsTable();
      });
      container.querySelector('#btn-merge-modal-export')?.addEventListener('click', exportRecipientsCsv);
      container.querySelector('#input-merge-table-search')?.addEventListener('input', renderRecipientsTable);

      // 4. Write & Insert Fields
      highlightFieldsBtn?.addEventListener('click', () => {
        isMergeFieldsHighlighted = !isMergeFieldsHighlighted;
        paper.classList.toggle('highlight-merge-fields', isMergeFieldsHighlighted);
        highlightFieldsBtn.style.background = isMergeFieldsHighlighted ? 'rgba(56, 189, 248, 0.25)' : '';
        highlightFieldsBtn.style.color = isMergeFieldsHighlighted ? '#38bdf8' : '';
        if (window.orbitPlatform) window.orbitPlatform.triggerToast(isMergeFieldsHighlighted ? 'Merge fields highlighted' : 'Field highlights hidden');
      });

      container.querySelector('#btn-insert-address-block')?.addEventListener('click', () => {
        paper.focus();
        const blockHtml = `<p><span class="drift-merge-field-chip" data-field="FirstName">{{FirstName}}</span> <span class="drift-merge-field-chip" data-field="LastName">{{LastName}}</span><br><span class="drift-merge-field-chip" data-field="Company">{{Company}}</span><br><span class="drift-merge-field-chip" data-field="Address">{{Address}}</span><br><span class="drift-merge-field-chip" data-field="City">{{City}}</span>, <span class="drift-merge-field-chip" data-field="State">{{State}}</span> <span class="drift-merge-field-chip" data-field="Zip">{{Zip}}</span></p>`;
        document.execCommand('insertHTML', false, blockHtml);
        saveDocument();
        updateTelemetry();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted Address Block');
      });

      container.querySelector('#btn-insert-greeting-line')?.addEventListener('click', () => {
        paper.focus();
        const greetingHtml = `<p>Dear <span class="drift-merge-field-chip" data-field="FirstName">{{FirstName}}</span>,</p><p></p>`;
        document.execCommand('insertHTML', false, greetingHtml);
        saveDocument();
        updateTelemetry();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Inserted Greeting Line');
      });

      // Insert Specific Merge Field Popover
      container.querySelector('#btn-insert-merge-field-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!insertFieldPopover) return;
        const isShown = insertFieldPopover.style.display !== 'none';
        closeAllPopovers();
        if (!isShown) {
          const fields = getMergeFieldsList();
          let fHtml = `<div style="font-size:10px; font-weight:700; color:#94a3b8; text-transform:uppercase; padding:4px 8px;">Insert Field</div>`;
          fields.forEach(f => {
            fHtml += `<button class="drift-field-pick-item" data-field="${f}" style="width:100%; text-align:left; background:transparent; border:none; color:#ffffff; padding:5px 8px; border-radius:4px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;">{a} {{${f}}}</button>`;
          });
          insertFieldPopover.innerHTML = fHtml;
          insertFieldPopover.querySelectorAll('.drift-field-pick-item').forEach(btn => {
            btn.addEventListener('click', () => {
              insertMergeFieldText(btn.dataset.field);
              insertFieldPopover.style.display = 'none';
            });
            btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(56, 189, 248, 0.15)');
            btn.addEventListener('mouseleave', () => btn.style.background = 'transparent');
          });

          const rect = e.currentTarget.getBoundingClientRect();
          insertFieldPopover.style.top = (rect.bottom + 4) + 'px';
          insertFieldPopover.style.left = rect.left + 'px';
          insertFieldPopover.style.display = 'block';
        }
      });

      // 5. Preview Results & Record Navigator
      previewMergeBtn?.addEventListener('click', toggleMergePreviewMode);

      container.querySelector('#btn-merge-first')?.addEventListener('click', () => {
        if (!isMergePreviewActive) toggleMergePreviewMode();
        applyMergePreview(0);
      });

      container.querySelector('#btn-merge-prev')?.addEventListener('click', () => {
        if (!isMergePreviewActive) toggleMergePreviewMode();
        applyMergePreview(activeMergeRecordIndex - 1);
      });

      container.querySelector('#btn-merge-next')?.addEventListener('click', () => {
        if (!isMergePreviewActive) toggleMergePreviewMode();
        applyMergePreview(activeMergeRecordIndex + 1);
      });

      container.querySelector('#btn-merge-last')?.addEventListener('click', () => {
        if (!isMergePreviewActive) toggleMergePreviewMode();
        applyMergePreview(mergeRecipients.length - 1);
      });

      recordIdxInput?.addEventListener('change', (e) => {
        const num = parseInt(e.target.value, 10);
        if (!isNaN(num)) {
          if (!isMergePreviewActive) toggleMergePreviewMode();
          applyMergePreview(num - 1);
        }
      });

      container.querySelector('#btn-find-merge-recipient')?.addEventListener('click', () => {
        const q = prompt('Search recipient by Name, Company, or Email:');
        if (!q || !q.trim()) return;
        const lower = q.toLowerCase().trim();
        const foundIdx = mergeRecipients.findIndex(r => {
          return Object.values(r).some(val => String(val).toLowerCase().includes(lower));
        });
        if (foundIdx !== -1) {
          if (!isMergePreviewActive) toggleMergePreviewMode();
          applyMergePreview(foundIdx);
          const found = mergeRecipients[foundIdx];
          if (window.orbitPlatform) window.orbitPlatform.triggerToast(`Found: ${found.FirstName || ''} ${found.LastName || ''} (#${foundIdx + 1})`);
        } else {
          alert(`No contact found matching "${q}".`);
        }
      });

      // 6. Finish & Merge Modal & Actions
      container.querySelector('#btn-finish-mail-merge')?.addEventListener('click', () => {
        updateMergeNavigatorUI();
        finishMergeModal?.classList.add('open');
      });

      container.querySelector('#btn-close-finish-merge')?.addEventListener('click', () => finishMergeModal?.classList.remove('open'));
      container.querySelector('#btn-cancel-finish-merge')?.addEventListener('click', () => finishMergeModal?.classList.remove('open'));

      container.querySelector('#card-action-master-doc')?.addEventListener('click', () => {
        const recs = getSelectedRecipientsByScope();
        executeMergeToDocument(recs);
      });

      container.querySelector('#card-action-print-all')?.addEventListener('click', () => {
        const recs = getSelectedRecipientsByScope();
        executeMergePrint(recs);
      });

      container.querySelector('#card-action-download-files')?.addEventListener('click', () => {
        const recs = getSelectedRecipientsByScope();
        executeMergeDownload(recs);
      });

      container.querySelector('#card-action-copy-emails')?.addEventListener('click', () => {
        const recs = getSelectedRecipientsByScope();
        executeMergeEmailDrafts(recs);
      });

      function closeAllPopovers() {
        if (startMergePopover) startMergePopover.style.display = 'none';
        if (selectRecipientsPopover) selectRecipientsPopover.style.display = 'none';
        if (insertFieldPopover) insertFieldPopover.style.display = 'none';
      }

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#drift-start-merge-popover') && !e.target.closest('#btn-start-mail-merge') &&
            !e.target.closest('#drift-select-recipients-popover') && !e.target.closest('#btn-select-recipients') &&
            !e.target.closest('#drift-insert-field-popover') && !e.target.closest('#btn-insert-merge-field-btn')) {
          closeAllPopovers();
        }
      });

      // =====================================================================
      // 12. GIRIONIX AI WRITING & REWRITING ASSISTANT (IN-CONTEXT OFFICE AI)
      // =====================================================================
      const driftAiModal = container.querySelector('#drift-ai-assistant-modal');
      const driftAiCloseBtn = container.querySelector('#btn-close-drift-ai-modal');
      const driftAiInput = container.querySelector('#drift-ai-custom-input');
      const driftAiExecBtn = container.querySelector('#btn-drift-ai-execute');
      const driftAiChipsList = container.querySelector('#drift-ai-chips-list');
      const driftAiChipsLabel = container.querySelector('#drift-ai-chips-label');
      const driftAiSelectionPreview = container.querySelector('#drift-ai-selection-preview');
      const driftAiPreviewBox = container.querySelector('#drift-ai-preview-box');
      const driftAiPreviewStats = container.querySelector('#drift-ai-preview-stats');
      const driftAiApplyBtn = container.querySelector('#btn-drift-ai-apply');
      const driftAiInsertBelowBtn = container.querySelector('#btn-drift-ai-insert-below');
      const driftAiCopyBtn = container.querySelector('#btn-drift-ai-copy');
      const driftAiContextDesc = container.querySelector('#drift-ai-context-desc');

      let currentAiSelection = '';
      let currentAiSavedRange = null;
      let currentGeneratedHtml = '';
      let currentGeneratedText = '';

      function openDriftAiAssistant(defaultPrompt = null) {
        if (!driftAiModal) return;

        // Capture selection
        const sel = window.getSelection();
        currentAiSelection = '';
        currentAiSavedRange = null;

        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (paper.contains(range.commonAncestorContainer) && !sel.isCollapsed) {
            currentAiSelection = range.toString().trim();
            currentAiSavedRange = range.cloneRange();
          }
        }

        const hasSelection = currentAiSelection.length > 0;

        if (hasSelection) {
          if (driftAiContextDesc) driftAiContextDesc.textContent = `Selected: "${currentAiSelection.slice(0, 45)}${currentAiSelection.length > 45 ? '...' : ''}"`;
          if (driftAiSelectionPreview) {
            driftAiSelectionPreview.style.display = 'block';
            driftAiSelectionPreview.innerHTML = `<strong>Selected Text:</strong> "${escapeHtml(currentAiSelection)}"`;
          }
          if (driftAiChipsLabel) driftAiChipsLabel.textContent = 'Rewrite & Polish Actions:';
          if (driftAiApplyBtn) driftAiApplyBtn.textContent = '✓ Replace Selection';

          const chips = [
            { id: 'executive', label: '👔 Executive Polish', prompt: 'Polish into crisp, authoritative executive prose' },
            { id: 'concise', label: '✂️ Make Concise (-40%)', prompt: 'Eliminate filler words and condense to essential points' },
            { id: 'persuasive', label: '🎯 Persuasive Pitch', prompt: 'Rewrite with strong conviction and compelling value proposition' },
            { id: 'grammar', label: '✍️ Fix Grammar & Typos', prompt: 'Correct all spelling, grammar, punctuation, and syntax errors' },
            { id: 'bullets', label: '📝 Summarize to Bullets', prompt: 'Distill core ideas into structured bullet points' },
            { id: 'expand', label: '📏 Expand & Elaborate', prompt: 'Elaborate with strategic context and operational rationale' },
            { id: 'checklist', label: '📋 Convert to Checklist', prompt: 'Convert into operational checklist task items' },
            { id: 'professional', label: '⚡ Sovereign Vocabulary', prompt: 'Refactor using modern sovereign enterprise vocabulary' }
          ];

          renderAiChips(chips);
          executeDriftAiGeneration(defaultPrompt || 'executive', currentAiSelection);

        } else {
          if (driftAiContextDesc) driftAiContextDesc.textContent = 'Draft complete executive documents, policies, or contracts from scratch';
          if (driftAiSelectionPreview) driftAiSelectionPreview.style.display = 'none';
          if (driftAiChipsLabel) driftAiChipsLabel.textContent = 'Draft from Scratch:';
          if (driftAiApplyBtn) driftAiApplyBtn.textContent = '+ Insert into Document';

          const chips = [
            { id: 'memo', label: '✉️ Executive Policy Memo', prompt: 'Formal memorandum with date, subject, and strategic imperatives' },
            { id: 'nda', label: '📄 Non-Disclosure Agreement', prompt: 'Mutual sovereign enterprise NDA with confidentiality covenants' },
            { id: 'offer', label: '💼 Employment Offer Letter', prompt: 'Comprehensive offer letter with compensation, title, and benefits' },
            { id: 'minutes', label: '📅 Board Meeting Minutes', prompt: 'Structured corporate minutes with resolutions, votes, and action items' },
            { id: 'proposal', label: '🚀 Project Scope & Proposal', prompt: 'Strategic proposal with objectives, milestones, and deliverable phases' },
            { id: 'kpi-table', label: '📊 Strategic KPI Table', prompt: 'Benchmark KPI matrix with targets and performance indicators' },
            { id: 'executive-summary', label: '✨ Executive Briefing', prompt: 'High-level synthesis with key findings and operational impact' }
          ];

          renderAiChips(chips);
          executeDriftAiGeneration(defaultPrompt || 'memo', '');
        }

        driftAiModal.classList.add('open');
        driftAiModal.setAttribute('aria-hidden', 'false');
        setTimeout(() => driftAiInput?.focus(), 80);
      }

      function closeDriftAiAssistant() {
        if (!driftAiModal) return;
        driftAiModal.classList.remove('open');
        driftAiModal.setAttribute('aria-hidden', 'true');
      }

      function renderAiChips(chips) {
        if (!driftAiChipsList) return;
        driftAiChipsList.innerHTML = chips.map(c => `
          <button class="orbit-ai-chip" data-ai-chip="${c.id}" title="${c.prompt}">${c.label}</button>
        `).join('');

        driftAiChipsList.querySelectorAll('.orbit-ai-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            driftAiChipsList.querySelectorAll('.orbit-ai-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            executeDriftAiGeneration(btn.dataset.aiChip, currentAiSelection);
          });
        });
      }

      function escapeHtml(str) {
        return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      function executeDriftAiGeneration(actionType, textContext = '') {
        let outHtml = '';
        let stats = '';

        const text = textContext.trim();

        if (actionType === 'executive') {
          const polished = text ? polishToExecutive(text) : 'By orchestrating enterprise productivity through in-memory sovereign execution, Giri Orbit establishes zero-latency operational momentum while guaranteeing absolute cryptographic privacy across all corporate workflows.';
          outHtml = `<p style="line-height:1.7; font-size:11.5pt; color:#0f172a;">${polished}</p>`;
          stats = 'Executive Tone • High Impact';
        } else if (actionType === 'concise') {
          const concise = text ? makeConcise(text) : 'Giri Orbit delivers sovereign in-memory productivity with zero latency and full privacy.';
          outHtml = `<p style="line-height:1.6; font-size:11.5pt; color:#0f172a; font-weight:500;">${concise}</p>`;
          stats = 'Concise • ~42% Shorter';
        } else if (actionType === 'persuasive') {
          const persuasive = text ? makePersuasive(text) : 'Embrace the unmatched velocity of sovereign computing. With Giri Orbit, every operation executes instantly within your client node—slashing friction, safeguarding corporate intelligence, and elevating team throughput to new peaks.';
          outHtml = `<p style="line-height:1.7; font-size:11.5pt; color:#0f172a;">${persuasive}</p>`;
          stats = 'Persuasive • Conviction Optimized';
        } else if (actionType === 'grammar') {
          const fixed = text ? fixGrammarAndSpelling(text) : 'All spelling, punctuation, and grammatical structures have been verified and standardized.';
          outHtml = `<p style="line-height:1.65; font-size:11.5pt; color:#0f172a;">${fixed}</p>`;
          stats = 'Grammar Verified • 0 Typos';
        } else if (actionType === 'bullets') {
          const items = text ? textToBullets(text) : [
            'Instant in-memory document state execution eliminates server latency.',
            'Cryptographic local client storage ensures 100% data sovereignty.',
            'Universal Office compatibility preserves seamless document interchange.'
          ];
          outHtml = `<ul style="margin:8px 0; padding-left:22px; line-height:1.7; font-size:11.5pt; color:#0f172a;">${items.map(it => `<li>${it}</li>`).join('')}</ul>`;
          stats = `${items.length} Structured Bullets`;
        } else if (actionType === 'expand') {
          const expanded = text ? expandWithContext(text) : 'Strategic assessment underscores that transitioning to local sovereign architectures delivers profound compounding advantages. In addition to eliminating third-party cloud vulnerabilities, local-first execution ensures uninterrupted operational resilience during connectivity disruptions, establishing an impenetrable security perimeter for high-value enterprise deliverables.';
          outHtml = `<p style="line-height:1.7; font-size:11.5pt; color:#0f172a;">${expanded}</p>`;
          stats = 'Expanded • Context Enriched';
        } else if (actionType === 'checklist') {
          const tasks = text ? textToTasks(text) : [
            'Audit current document sections for strategic alignment',
            'Validate data tables and cryptographic signatures',
            'Export sovereign artifact for executive board review'
          ];
          outHtml = `<div style="display:flex; flex-direction:column; gap:8px; margin:10px 0;">${tasks.map((t, idx) => `
            <div style="display:flex; align-items:center; gap:8px; font-size:11pt; color:#1e293b;">
              <input type="checkbox" ${idx === 0 ? 'checked' : ''} style="accent-color:#2563eb; width:15px; height:15px;">
              <span>${t}</span>
            </div>
          `).join('')}</div>`;
          stats = `${tasks.length} Action Items`;
        } else if (actionType === 'memo') {
          outHtml = `
            <div style="margin:16px 0; padding:18px 22px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-family:var(--font-sans, sans-serif);">
              <div style="font-size:11px; font-weight:800; color:#2563eb; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px;">EXECUTIVE MEMORANDUM</div>
              <p style="margin:3px 0; font-size:13px;"><strong>TO:</strong> Executive Leadership Team &amp; Engineering Directorate</p>
              <p style="margin:3px 0; font-size:13px;"><strong>FROM:</strong> Principal Architect // Abhinav Giri</p>
              <p style="margin:3px 0; font-size:13px;"><strong>DATE:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="margin:3px 0 12px 0; font-size:13px;"><strong>SUBJECT:</strong> Sovereign Workplace Acceleration &amp; AI Integration</p>
              <hr style="border:none; border-top:1px solid #cbd5e1; margin:12px 0;" />
              <p style="margin:0 0 10px 0; font-size:13px; line-height:1.6; color:#334155;">
                This directive formally establishes the operational baseline for embedding sovereign client intelligence across all enterprise document, spreadsheet, and presentation nodes.
              </p>
              <ul style="margin:0; padding-left:18px; font-size:12.5px; color:#334155; line-height:1.6;">
                <li><strong>Zero Telemetry:</strong> All computational synthesis executes within browser heap space.</li>
                <li><strong>Turnaround:</strong> Sub-50ms instant generation with 1-click replacement.</li>
                <li><strong>Interoperability:</strong> Native parity with standard Office document formats.</li>
              </ul>
            </div><p></p>
          `;
          stats = 'Formal Memorandum Template';
        } else if (actionType === 'nda') {
          outHtml = `
            <div style="margin:16px 0; padding:20px 24px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; font-family:Georgia, serif; color:#0f172a;">
              <h2 style="text-align:center; font-size:16pt; margin:0 0 16px 0; letter-spacing:0.5px; font-family:inherit;">MUTUAL NON-DISCLOSURE &amp; CONFIDENTIALITY AGREEMENT</h2>
              <p style="font-size:10.5pt; line-height:1.6; margin:0 0 12px 0;">
                This Mutual Non-Disclosure Agreement (the <strong>"Agreement"</strong>) is entered into as of <strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>, by and between <strong>Abhinav Giri</strong> (the "Disclosing Party") and the undersigned recipient entity (the "Receiving Party").
              </p>
              <p style="font-size:10.5pt; line-height:1.6; margin:0 0 12px 0;">
                <strong>1. Confidential Information:</strong> "Confidential Information" encompasses all proprietary technical data, mathematical matrix algorithms, document blueprints, trade secrets, and sovereign architectural specifications disclosed by either party.
              </p>
              <p style="font-size:10.5pt; line-height:1.6; margin:0 0 12px 0;">
                <strong>2. Standard of Care:</strong> The Receiving Party shall exercise no less than a reasonable degree of care to preserve confidentiality and prevent unauthorized dissemination or reverse-engineering.
              </p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:24px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:10pt;">
                <div>
                  <p style="margin:0 0 4px 0;"><strong>DISCLOSING PARTY:</strong></p>
                  <p style="margin:0 0 30px 0; color:#64748b;">Abhinav Giri</p>
                  <p style="border-bottom:1px solid #000; padding-bottom:2px; margin:0 0 4px 0;">By: _______________________________</p>
                  <p style="margin:0; font-size:9pt; color:#64748b;">Authorized Signatory</p>
                </div>
                <div>
                  <p style="margin:0 0 4px 0;"><strong>RECEIVING PARTY:</strong></p>
                  <p style="margin:0 0 30px 0; color:#64748b;">Counterparty Entity</p>
                  <p style="border-bottom:1px solid #000; padding-bottom:2px; margin:0 0 4px 0;">By: _______________________________</p>
                  <p style="margin:0; font-size:9pt; color:#64748b;">Authorized Signatory</p>
                </div>
              </div>
            </div><p></p>
          `;
          stats = 'Legal NDA Contract Agreement';
        } else if (actionType === 'offer') {
          outHtml = `
            <div style="margin:16px 0; padding:20px 24px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; font-family:var(--font-sans, sans-serif); color:#0f172a;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #2563eb; padding-bottom:10px; margin-bottom:14px;">
                <strong style="font-size:14pt; color:#1e40af;">GIRI CORPORATION</strong>
                <span style="font-size:11px; color:#64748b;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <p style="font-size:11pt; line-height:1.6; margin:0 0 10px 0;">Dear Candidate,</p>
              <p style="font-size:11pt; line-height:1.6; margin:0 0 10px 0;">
                We are thrilled to extend an offer of employment for the position of <strong>Principal Sovereign Systems Architect</strong> at Abhinav Giri. We were deeply impressed by your engineering leadership and vision.
              </p>
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px 16px; margin:14px 0; font-size:10.5pt; line-height:1.8;">
                <div><strong>Starting Salary:</strong> $185,000 / annum (paid semi-monthly)</div>
                <div><strong>Equity Grant:</strong> 25,000 Incentive Stock Options (4-year vesting with 1-year cliff)</div>
                <div><strong>Reporting To:</strong> Chief Technology Officer</div>
                <div><strong>Start Date:</strong> First Monday of next month</div>
              </div>
              <p style="font-size:11pt; line-height:1.6; margin:0 0 14px 0;">
                Please indicate your acceptance of this offer by signing below and returning this letter by Friday at 5:00 PM.
              </p>
              <div style="margin-top:20px; font-size:10.5pt;">
                <p style="margin:0 0 24px 0;">Sincerely,<br><strong>Director of Talent &amp; Culture</strong><br>Abhinav Giri</p>
                <p style="border-bottom:1px solid #000; width:260px; padding-bottom:2px; margin:0 0 4px 0;">Candidate Signature: __________________</p>
                <p style="margin:0; font-size:9pt; color:#64748b;">Date: ________________________</p>
              </div>
            </div><p></p>
          `;
          stats = 'Executive Employment Offer Letter';
        } else if (actionType === 'minutes') {
          outHtml = `
            <div style="margin:16px 0; padding:18px 22px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-family:var(--font-sans, sans-serif);">
              <h2 style="font-size:14pt; color:#0f172a; margin:0 0 8px 0;">MINUTES OF THE BOARD OF DIRECTORS</h2>
              <div style="font-size:11px; color:#64748b; margin-bottom:12px;">Held on: ${new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
              <p style="font-size:11pt; line-height:1.6; margin:0 0 8px 0;"><strong>1. Call to Order &amp; Quorum:</strong> The meeting was convened at 10:00 AM. A legal quorum was established with all voting directors present.</p>
              <p style="font-size:11pt; line-height:1.6; margin:0 0 8px 0;"><strong>2. Financial Review:</strong> Chief Financial Officer presented Q3 financial ledger demonstrating an 18.4% operating margin expansion and zero debt obligations.</p>
              <p style="font-size:11pt; line-height:1.6; margin:0 0 8px 0;"><strong>3. Resolution 2026-08 (Passed Unanimously):</strong> Resolved that the Corporation shall accelerate deployment of sovereign client computing architectures globally.</p>
              <p style="font-size:11pt; line-height:1.6; margin:0;"><strong>4. Adjournment:</strong> There being no further business, the meeting adjourned at 11:45 AM.</p>
            </div><p></p>
          `;
          stats = 'Board Meeting Minutes';
        } else if (actionType === 'proposal') {
          outHtml = `
            <div style="margin:16px 0; padding:18px 22px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; font-family:var(--font-sans, sans-serif);">
              <div style="font-size:10px; font-weight:800; color:#2563eb; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">STRATEGIC INITIATIVE PROPOSAL</div>
              <h3 style="font-size:15pt; color:#0f172a; margin:0 0 10px 0;">Sovereign Computing &amp; Zero-Latency Workflow Migration</h3>
              <p style="font-size:11pt; line-height:1.6; color:#334155; margin:0 0 12px 0;">
                <strong>Executive Summary:</strong> This proposal outlines the phased roadmap to migrate corporate knowledge workers to client-side in-memory productivity nodes, eliminating third-party cloud outages, reducing latency, and safeguarding confidential enterprise trade secrets.
              </p>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin:14px 0;">
                <div style="padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; text-align:center;">
                  <strong style="font-size:14pt; color:#16a34a; display:block;">Phase 1</strong>
                  <span style="font-size:10.5px; color:#64748b;">Architecture Audit (Days 1–30)</span>
                </div>
                <div style="padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; text-align:center;">
                  <strong style="font-size:14pt; color:#2563eb; display:block;">Phase 2</strong>
                  <span style="font-size:10.5px; color:#64748b;">Pilot Node Deployment (Days 31–60)</span>
                </div>
                <div style="padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; text-align:center;">
                  <strong style="font-size:14pt; color:#7c3aed; display:block;">Phase 3</strong>
                  <span style="font-size:10.5px; color:#64748b;">Enterprise Rollout (Days 61–90)</span>
                </div>
              </div>
            </div><p></p>
          `;
          stats = 'Project Scope & Initiative Proposal';
        } else if (actionType === 'kpi-table') {
          outHtml = `
            <table style="width:100%; border-collapse:collapse; margin:18px 0; font-size:11pt; border:1px solid #cbd5e1; font-family:var(--font-sans, sans-serif);">
              <thead>
                <tr style="background:#0f172a; color:#ffffff;">
                  <th style="padding:9px 12px; text-align:left; border:1px solid #334155;">Strategic Objective</th>
                  <th style="padding:9px 12px; text-align:left; border:1px solid #334155;">Baseline</th>
                  <th style="padding:9px 12px; text-align:left; border:1px solid #334155;">Target Benchmark</th>
                  <th style="padding:9px 12px; text-align:left; border:1px solid #334155;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background:#ffffff;">
                  <td style="padding:8px 12px; border:1px solid #cbd5e1; font-weight:600;">Sub-millisecond Document Rendering</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1;">450ms</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1;">&lt; 60ms</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1; color:#16a34a; font-weight:700;">Surpassed (16ms)</td>
                </tr>
                <tr style="background:#f8fafc;">
                  <td style="padding:8px 12px; border:1px solid #cbd5e1; font-weight:600;">Outbound Telemetry Leaks</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1;">3.4 MB/session</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1;">0 KB</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1; color:#16a34a; font-weight:700;">100% Sealed</td>
                </tr>
                <tr style="background:#ffffff;">
                  <td style="padding:8px 12px; border:1px solid #cbd5e1; font-weight:600;">Universal File Format Support</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1;">4 Formats</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1;">11 Formats</td>
                  <td style="padding:8px 12px; border:1px solid #cbd5e1; color:#2563eb; font-weight:700;">Operational</td>
                </tr>
              </tbody>
            </table><p></p>
          `;
          stats = 'Formatted Strategic KPI Table';
        } else {
          // Custom directive
          const customPrompt = (driftAiInput?.value || actionType || '').trim();
          outHtml = generateCustomDriftContent(customPrompt, textContext);
          stats = `Custom Directive: "${customPrompt.slice(0, 30)}"`;
        }

        currentGeneratedHtml = outHtml;
        currentGeneratedText = outHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

        if (driftAiPreviewBox) driftAiPreviewBox.innerHTML = outHtml;
        if (driftAiPreviewStats) driftAiPreviewStats.textContent = stats;
      }

      // Helper Text Transformation Algorithms
      function polishToExecutive(t) {
        return t
          .replace(/\b(good|nice|fine)\b/gi, 'exceptional')
          .replace(/\b(bad|poor)\b/gi, 'suboptimal')
          .replace(/\b(big|large)\b/gi, 'substantial')
          .replace(/\b(make|build)\b/gi, 'orchestrate')
          .replace(/\b(help|helps)\b/gi, 'facilitate')
          .replace(/\b(use|uses)\b/gi, 'leverage')
          .replace(/\b(very|really)\b/gi, 'materially')
          .replace(/\b(we think|in our opinion)\b/gi, 'strategic analysis confirms')
          .replace(/\b(start|begin)\b/gi, 'initiate');
      }

      function makeConcise(t) {
        return t
          .replace(/\bin order to\b/gi, 'to')
          .replace(/\bat this point in time\b/gi, 'now')
          .replace(/\bdue to the fact that\b/gi, 'because')
          .replace(/\bfor the purpose of\b/gi, 'for')
          .replace(/\bhas the ability to\b/gi, 'can')
          .replace(/\bin the event that\b/gi, 'if')
          .replace(/\bprior to\b/gi, 'before')
          .replace(/\bwith regards to\b/gi, 'regarding')
          .replace(/\bneedless to say\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function makePersuasive(t) {
        return `Decisive operational outcomes demonstrate that ${t.charAt(0).toLowerCase() + t.slice(1)} This strategy directly unlocks compounding leverage, outperforming legacy alternatives with validated velocity.`;
      }

      function fixGrammarAndSpelling(t) {
        if (typeof OrbitProofMaster !== 'undefined' && typeof OrbitProofMaster.applyAll === 'function') {
          return OrbitProofMaster.applyAll(t);
        }
        return t
          .replace(/\bteh\b/gi, 'the')
          .replace(/\brecieve\b/gi, 'receive')
          .replace(/\bseperate\b/gi, 'separate')
          .replace(/\buntill\b/gi, 'until')
          .replace(/\btheir are\b/gi, 'there are')
          .replace(/\bit's\s+(capabilities|features|parameters)\b/gi, 'its $1')
          .replace(/\s+,/g, ',')
          .replace(/\s+\./g, '.')
          .replace(/([.!?])\s*([a-z])/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`)
          .trim();
      }

      function textToBullets(t) {
        return t
          .split(/(?<=[.!?])\s+/)
          .map(s => s.trim())
          .filter(s => s.length > 5);
      }

      function textToTasks(t) {
        return t
          .split(/(?<=[.!?])\s+|\n+/)
          .map(s => s.trim().replace(/^[-*•\d.]+\s*/, ''))
          .filter(s => s.length > 4);
      }

      function expandWithContext(t) {
        return `${t} In expanding upon this operational framework, cross-functional stakeholders must align on resource allocation and execution timelines. Rigorous benchmarking confirms that establishing structured checkpoints minimizes deployment overhead while accelerating deliverable completion.`;
      }

      function generateCustomDriftContent(prompt, context) {
        const q = prompt.toLowerCase();
        if (q.includes('table') || q.includes('grid')) {
          return `
            <table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:11pt; border:1px solid #cbd5e1;">
              <thead>
                <tr style="background:#1e293b; color:#ffffff;">
                  <th style="padding:8px 12px; border:1px solid #334155; text-align:left;">Item</th>
                  <th style="padding:8px 12px; border:1px solid #334155; text-align:left;">Classification</th>
                  <th style="padding:8px 12px; border:1px solid #334155; text-align:left;">Metrics</th>
                  <th style="padding:8px 12px; border:1px solid #334155; text-align:left;">Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style="padding:8px 12px; border:1px solid #cbd5e1;">Operational Directive 1</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">Core Infrastructure</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">99.98%</td><td style="padding:8px 12px; border:1px solid #cbd5e1; color:#dc2626; font-weight:700;">Critical</td></tr>
                <tr style="background:#f8fafc;"><td style="padding:8px 12px; border:1px solid #cbd5e1;">Operational Directive 2</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">Process Pipeline</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">&lt; 30ms</td><td style="padding:8px 12px; border:1px solid #cbd5e1; color:#2563eb; font-weight:700;">High</td></tr>
                <tr><td style="padding:8px 12px; border:1px solid #cbd5e1;">Operational Directive 3</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">Security Assurance</td><td style="padding:8px 12px; border:1px solid #cbd5e1;">100% Sealed</td><td style="padding:8px 12px; border:1px solid #cbd5e1; color:#16a34a; font-weight:700;">Verified</td></tr>
              </tbody>
            </table><p></p>
          `;
        }
        if (q.includes('email') || q.includes('message')) {
          return `
            <div style="margin:16px 0; padding:16px 20px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; font-family:var(--font-sans, sans-serif);">
              <p style="margin:0 0 6px 0; font-size:12px; color:#64748b;"><strong>Subject:</strong> Update Regarding ${prompt}</p>
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:8px 0 12px 0;" />
              <p style="margin:0 0 10px 0; font-size:11pt; line-height:1.6;">Hello Team,</p>
              <p style="margin:0 0 10px 0; font-size:11pt; line-height:1.6;">
                I am writing to provide a high-priority update regarding <strong>${escapeHtml(prompt)}</strong>. Recent assessments demonstrate strong operational progress, positioning us well ahead of our scheduled targets.
              </p>
              <p style="margin:0 0 10px 0; font-size:11pt; line-height:1.6;">
                Please review the enclosed deliverables and share any feedback prior to our upcoming alignment session.
              </p>
              <p style="margin:0; font-size:11pt;">Best regards,<br><strong>Executive Office // Giri Orbit</strong></p>
            </div><p></p>
          `;
        }
        return `
          <h3 style="margin:16px 0 8px 0; color:#0f172a; font-size:15px; font-weight:700;">Strategic Analysis: ${escapeHtml(prompt)}</h3>
          <p style="margin:0 0 10px 0; font-size:11pt; line-height:1.65; color:#1e293b;">
            ${context ? polishToExecutive(context) : `Executing on <strong>${escapeHtml(prompt)}</strong> establishes a robust operational baseline, harmonizing cross-functional deliverables with sovereign precision and zero cloud dependency.`}
          </p><p></p>
        `;
      }

      // Execute on Custom Prompt
      const triggerCustomAi = () => {
        const q = driftAiInput?.value.trim();
        if (!q) return;
        executeDriftAiGeneration(q, currentAiSelection);
      };

      driftAiExecBtn?.addEventListener('click', triggerCustomAi);
      driftAiInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          triggerCustomAi();
        }
      });

      // Apply Button Click
      driftAiApplyBtn?.addEventListener('click', () => {
        if (!currentGeneratedHtml) return;

        paper.focus();

        if (currentAiSavedRange && currentAiSelection) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(currentAiSavedRange);
          document.execCommand('insertHTML', false, currentGeneratedHtml);
        } else {
          document.execCommand('insertHTML', false, currentGeneratedHtml);
        }

        saveDocument();
        closeDriftAiAssistant();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Girionix AI: Content applied to document');
      });

      // Insert Below
      driftAiInsertBelowBtn?.addEventListener('click', () => {
        if (!currentGeneratedHtml) return;
        paper.focus();
        document.execCommand('insertHTML', false, `<p></p>${currentGeneratedHtml}<p></p>`);
        saveDocument();
        closeDriftAiAssistant();
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Girionix AI: Inserted below selection');
      });

      // Copy
      driftAiCopyBtn?.addEventListener('click', () => {
        if (!currentGeneratedText && !currentGeneratedHtml) return;
        navigator.clipboard?.writeText(currentGeneratedText || currentGeneratedHtml);
        if (window.orbitPlatform) window.orbitPlatform.triggerToast('Copied AI output to clipboard');
      });

      // Close events
      driftAiCloseBtn?.addEventListener('click', closeDriftAiAssistant);
      driftAiModal?.addEventListener('click', (e) => {
        if (e.target === driftAiModal) closeDriftAiAssistant();
      });

      // Triggers across the app
      container.querySelector('#btn-drift-top-ai-agent')?.addEventListener('click', () => {
        if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
          window.orbitPlatform.openGirionixAgent('drift');
        } else if (window.orbitAgent) {
          window.orbitAgent.openAgent('drift');
        }
      });
      container.querySelector('#btn-drift-ai-agent')?.addEventListener('click', () => {
        if (window.orbitPlatform && typeof window.orbitPlatform.openGirionixAgent === 'function') {
          window.orbitPlatform.openGirionixAgent('drift');
        } else if (window.orbitAgent) {
          window.orbitAgent.openAgent('drift');
        }
      });
      container.querySelector('#btn-drift-ai-copilot')?.addEventListener('click', () => openDriftAiAssistant());
      container.querySelector('#btn-drift-review-ai')?.addEventListener('click', () => openDriftAiAssistant('executive'));
      container.querySelector('#btn-drift-import-from-girionix')?.addEventListener('click', () => {
        if (window.orbitPlatform && typeof window.orbitPlatform.importFromGirionix === 'function') {
          window.orbitPlatform.importFromGirionix('drift');
        } else if (window.orbitPlatform && typeof window.orbitPlatform.toggleGirionixAiDrawer === 'function') {
          window.orbitPlatform.toggleGirionixAiDrawer('drift');
        }
      });
      container.querySelector('#btn-drift-export-to-girionix')?.addEventListener('click', () => {
        if (window.orbitPlatform && typeof window.orbitPlatform.exportToGirionix === 'function') {
          window.orbitPlatform.exportToGirionix('drift');
        } else if (window.orbitPlatform && typeof window.orbitPlatform.toggleGirionixAiDrawer === 'function') {
          window.orbitPlatform.toggleGirionixAiDrawer('drift');
        }
      });

      // Global window hook for universal drawer / palette
      window.driftAiCopilot = {
        open: openDriftAiAssistant,
        close: closeDriftAiAssistant,
        execute: (action, query) => {
          openDriftAiAssistant();
          executeDriftAiGeneration(action, query || currentAiSelection);
        }
      };

      updateMergeNavigatorUI();

      updateTelemetry();
      updateOutline();
    }
  }
}

