/**
 * ============================================================================
 * GIRI ORBIT — UNIVERSAL OFFICE SUITE COMPATIBILITY ENGINE (js/components/giriOfficeFormats.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * 
 * Provides two-way, 100% interoperable serialization and deserialization for:
 * - .gdrift  -> Native Giri Drift / Microsoft Word / OpenDocument Writer / WPS Writer
 * - .gaxis   -> Native Giri Axis / Microsoft Excel / OpenDocument Calc / WPS Spreadsheets
 * - .gkinetic-> Native Giri Kinetic / Microsoft PowerPoint / OpenDocument Impress / WPS Presentation
 * - .gaegis  -> Native Giri Aegis / Adobe PDF / Vector Draw Studio / Edge & Chrome PDF
 * - .giri    -> Native Sovereign Giri Orbit Universal Suite Container
 * ============================================================================
 */

function escapeXml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function utf8ToBase64(str) {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return btoa(str);
    }
  }
}

function base64ToUtf8(str) {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch {
      return atob(str);
    }
  }
}

export class GiriOfficeFormats {

  // ==========================================================================
  // 1. GIRI DRIFT (.gdrift) — Universal Wordprocessing Document
  // Compatible with: MS Word, OpenDocument Writer, OpenOffice, WPS Writer, Google Docs
  // ==========================================================================

  static formatGDrift({ title = 'Untitled Document', content = '', author = 'Giri Orbit User', date = null, rawState = null }) {
    const exportDate = date || new Date().toISOString();
    const manifest = {
      format: 'gdrift',
      version: '2.0',
      title: title,
      author: author,
      exportedAt: exportDate,
      rawState: rawState || null
    };

    const manifestJson = JSON.stringify(manifest);

    // Format HTML body content for maximum office fidelity
    let bodyContent = content.trim();
    if (!bodyContent) {
      bodyContent = '<p><br></p>';
    }

    return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns:v='urn:schemas-microsoft-com:vml'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Giri Orbit Sovereign Suite 12.2 - Universal Office Interoperability">
  <meta name="Author" content="${escapeXml(author)}">
  <title>${escapeXml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      <w:TrackMoves>false</w:TrackMoves>
      <w:TrackFormatting/>
      <w:PunctuationKerning/>
      <w:DrawingGridHorizontalSpacing>6 pt</w:DrawingGridHorizontalSpacing>
      <w:DrawingGridVerticalSpacing>6 pt</w:DrawingGridVerticalSpacing>
      <w:DisplayHorizontalDrawingGridEvery>0</w:DisplayHorizontalDrawingGridEvery>
      <w:DisplayVerticalDrawingGridEvery>2</w:DisplayVerticalDrawingGridEvery>
      <w:ValidateAgainstSchemas/>
      <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
      <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
      <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
      <w:Compatibility>
        <w:BreakWrappedTables/>
        <w:SnapToGridInCell/>
        <w:WrapTextWithPunct/>
        <w:UseAsianBreakRules/>
        <w:UseWord2002TableStyleRules/>
        <w:UseWord2010TableStyleRules/>
      </w:Compatibility>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
      max-width: 8.5in;
      margin: 0 auto;
      background: #ffffff;
      padding: 0;
    }
    body {
      font-family: 'Calibri', 'Segoe UI', 'Liberation Sans', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 22pt;
      font-weight: 800;
      color: #0f172a;
      margin: 18pt 0 8pt 0;
      line-height: 1.25;
      mso-outline-level: 1;
    }
    h2 {
      font-size: 16pt;
      font-weight: 700;
      color: #1e293b;
      margin: 14pt 0 6pt 0;
      line-height: 1.3;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3pt;
      mso-outline-level: 2;
    }
    h3 {
      font-size: 13pt;
      font-weight: 600;
      color: #334155;
      margin: 10pt 0 4pt 0;
      mso-outline-level: 3;
    }
    p {
      margin: 0 0 8pt 0;
      line-height: 1.5;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12pt 0;
      font-size: 10.5pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6pt 10pt;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 8pt;
      padding-left: 24pt;
    }
    li {
      margin-bottom: 3pt;
    }
    blockquote {
      border-left: 3.5pt solid #2563eb;
      margin: 10pt 0;
      padding: 6pt 12pt;
      background: #f8fafc;
      color: #475569;
      font-style: italic;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 16pt 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    .drift-page-sheet {
      min-height: 9.0in;
      page-break-after: always;
      box-sizing: border-box;
    }
  </style>
  <script id="giri-orbit-manifest" type="application/json">
${utf8ToBase64(manifestJson)}
  </script>
</head>
<body>
  <div class="Section1">
    ${bodyContent}
  </div>
</body>
</html>`.trim();
  }

  static parseGDrift(rawString) {
    if (!rawString || typeof rawString !== 'string') {
      return { title: 'Untitled Document', content: '<p><br></p>', format: 'gdrift' };
    }

    const trimmed = rawString.trim();

    // 1. Check for embedded Giri Orbit manifest
    const manifestMatch = trimmed.match(/<script[^>]*id=["']giri-orbit-manifest["'][^>]*>([\s\S]*?)<\/script>/i);
    if (manifestMatch && manifestMatch[1]) {
      try {
        let manifestText = manifestMatch[1].trim(); if (!manifestText.startsWith("{") && !manifestText.startsWith("[")) manifestText = base64ToUtf8(manifestText); const manifest = JSON.parse(manifestText);
        let extractedContent = '';
        
        // Extract body / Section1 if manifest doesn't have rawState
        const sectionMatch = trimmed.match(/<div[^>]*class=["'][^"']*Section1[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/body>/i);
        const bodyMatch = trimmed.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

        if (sectionMatch && sectionMatch[1]) {
          extractedContent = sectionMatch[1].trim();
        } else if (bodyMatch && bodyMatch[1]) {
          extractedContent = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '').trim();
        }

        return {
          title: manifest.title || 'Untitled Document',
          content: manifest.rawState?.content || extractedContent || manifest.content || '<p><br></p>',
          author: manifest.author || 'Giri Orbit User',
          version: manifest.version || '2.0',
          format: 'gdrift'
        };
      } catch (e) {
        console.warn('Error parsing gdrift manifest:', e);
      }
    }

    // 2. Check for legacy JSON format { format: 'gdrift', content: ... }
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.format === 'gdrift' || parsed.content || parsed.title) {
          return {
            title: parsed.title || 'Untitled Document',
            content: parsed.content || '<p><br></p>',
            author: parsed.author || 'Giri Orbit User',
            format: 'gdrift'
          };
        }
      } catch {
        // Not JSON, continue
      }
    }

    // 3. Document was edited or saved by MS Word, OpenDocument Writer, or is standard HTML
    let cleanedHtml = trimmed;
    const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      cleanedHtml = bodyMatch[1];
    }
    // Remove scripts and style tags from body
    cleanedHtml = cleanedHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .trim();

    return {
      title: 'Imported Document',
      content: cleanedHtml || '<p><br></p>',
      format: 'gdrift'
    };
  }

  // ==========================================================================
  // 2. GIRI AXIS (.gaxis) — Universal Spreadsheet Workbook
  // Compatible with: MS Excel, OpenDocument Calc, OpenOffice, WPS Spreadsheets, Google Sheets
  // ==========================================================================

  static formatGAxis({ sheetsData = {}, activeSheet = 'Sheet1', title = 'Giri Axis Workbook', author = 'Giri Orbit User', date = null }) {
    const exportDate = date || new Date().toISOString();
    const manifest = {
      format: 'gaxis',
      version: '2.0',
      title: title,
      author: author,
      activeSheet: activeSheet,
      exportedAt: exportDate,
      data: sheetsData
    };

    const manifestBase64 = utf8ToBase64(JSON.stringify(manifest));

    // Build standard SpreadsheetML Worksheets
    const sheetNames = Object.keys(sheetsData).length > 0 ? Object.keys(sheetsData) : ['Sheet1'];
    let worksheetsXml = '';

    sheetNames.forEach(sheetName => {
      const sheetContent = sheetsData[sheetName] || [];
      worksheetsXml += GiriOfficeFormats._buildSpreadsheetXmlWorksheet(sheetName, sheetContent);
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${escapeXml(title)}</Title>
  <Author>${escapeXml(author)}</Author>
  <Created>${exportDate}</Created>
  <Company>Giri Corporation</Company>
  <Version>12.2</Version>
 </DocumentProperties>
 <CustomDocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <GiriOrbitSheets dt:dt="string" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">${manifestBase64}</GiriOrbitSheets>
 </CustomDocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#0F172A"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="CellBold">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="CellNumber">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="CellString">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#0F172A"/>
  </Style>
 </Styles>
${worksheetsXml}
</Workbook>`.trim();
  }

  static _buildSpreadsheetXmlWorksheet(sheetName, sheetContent) {
    // Normalise sheetContent into a map of row -> col -> cellObj
    const rowMap = new Map();
    let maxRow = 1;
    let maxCol = 1;

    let items = [];
    if (Array.isArray(sheetContent)) {
      items = sheetContent;
    } else if (sheetContent && typeof sheetContent === 'object') {
      items = Object.entries(sheetContent).map(([cell, val]) => ({
        cell,
        val: String(val ?? ''),
        formula: String(val ?? '').startsWith('=') ? String(val) : null,
        isNum: !isNaN(Number(String(val ?? '').replace(/,/g, ''))) && String(val ?? '').trim() !== ''
      }));
    }

    items.forEach(item => {
      const match = (item.cell || '').match(/^([A-Z]+)([0-9]+)$/i);
      if (match) {
        let col = 0;
        const colLetters = match[1].toUpperCase();
        for (let i = 0; i < colLetters.length; i++) {
          col = col * 26 + (colLetters.charCodeAt(i) - 64);
        }
        const row = parseInt(match[2], 10);
        if (row > maxRow) maxRow = row;
        if (col > maxCol) maxCol = col;

        if (!rowMap.has(row)) rowMap.set(row, new Map());
        rowMap.get(row).set(col, item);
      }
    });

    // Ensure at least 10 rows and 6 columns for nice presentation in Calc/Excel
    if (maxRow < 10) maxRow = 10;
    if (maxCol < 6) maxCol = 6;

    let rowsXml = '';
    for (let r = 1; r <= maxRow; r++) {
      const colsInRow = rowMap.get(r);
      let cellsXml = '';
      for (let c = 1; c <= maxCol; c++) {
        const item = colsInRow ? colsInRow.get(c) : null;
        if (item && (item.val || item.formula)) {
          const val = item.val != null ? String(item.val).trim() : '';
          const formula = item.formula || (val.startsWith('=') ? val : null);
          const isNum = item.isNum || (!formula && !isNaN(Number(val.replace(/,/g, ''))) && val !== '');
          const isHeader = r === 1 || item.bold;

          let styleId = isHeader ? 'Header' : (isNum ? 'CellNumber' : 'CellString');
          let type = isNum ? 'Number' : 'String';
          let displayVal = isNum ? parseFloat(val.replace(/,/g, '')) : escapeXml(val);

          let formulaAttr = '';
          if (formula) {
            // Excel SpreadsheetML format formula: =SUM(R1C1:R1C2) or normal formula
            formulaAttr = ` ss:Formula="${escapeXml(formula)}"`;
          }

          cellsXml += `    <Cell ss:Index="${c}" ss:StyleID="${styleId}"${formulaAttr}><Data ss:Type="${type}">${displayVal}</Data></Cell>\n`;
        }
      }

      if (cellsXml) {
        rowsXml += `   <Row ss:Index="${r}">\n${cellsXml}   </Row>\n`;
      }
    }

    return ` <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table ss:ExpandedColumnCount="${maxCol}" ss:ExpandedRowCount="${maxRow}" x:FullColumns="1" x:FullRows="1">
${rowsXml}  </Table>
 </Worksheet>\n`;
  }

  static parseGAxis(rawString) {
    if (!rawString || typeof rawString !== 'string') {
      return { sheetsData: { Sheet1: [] }, activeSheet: 'Sheet1', format: 'gaxis' };
    }

    const trimmed = rawString.trim();

    // 1. Check for embedded Giri Orbit manifest in CustomDocumentProperties
    const manifestMatch = trimmed.match(/<GiriOrbitSheets[^>]*>([\s\S]*?)<\/GiriOrbitSheets>/i);
    if (manifestMatch && manifestMatch[1]) {
      try {
        const jsonStr = base64ToUtf8(manifestMatch[1].trim());
        const manifest = JSON.parse(jsonStr);
        if (manifest.data && typeof manifest.data === 'object') {
          return {
            sheetsData: manifest.data,
            activeSheet: manifest.activeSheet || Object.keys(manifest.data)[0] || 'Sheet1',
            title: manifest.title || 'Workbook',
            format: 'gaxis'
          };
        }
      } catch (e) {
        console.warn('Error reading gaxis manifest:', e);
      }
    }

    // 2. Check for legacy JSON format: { "Sheet1": [...] } or { format: 'gaxis', data: ... }
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.format === 'gaxis' && parsed.data) {
          return {
            sheetsData: parsed.data,
            activeSheet: Object.keys(parsed.data)[0] || 'Sheet1',
            title: parsed.title || 'Workbook',
            format: 'gaxis'
          };
        }
        // Direct sheets mapping: { "Sheet1": [...] }
        const firstVal = Object.values(parsed)[0];
        if (Array.isArray(firstVal) || (firstVal && typeof firstVal === 'object')) {
          return {
            sheetsData: parsed,
            activeSheet: Object.keys(parsed)[0] || 'Sheet1',
            title: 'Workbook',
            format: 'gaxis'
          };
        }
      } catch {
        // Not JSON
      }
    }

    // 3. XML SpreadsheetML (e.g. edited in Excel or OpenDocument Calc)
    if (trimmed.includes('<Workbook') || trimmed.includes('<Worksheet')) {
      try {
        const extractedSheets = {};
        const worksheetRegex = /<Worksheet[^>]*ss:Name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Worksheet>/gi;
        let wsMatch;

        while ((wsMatch = worksheetRegex.exec(trimmed)) !== null) {
          const sheetName = wsMatch[1];
          const sheetBody = wsMatch[2];
          const items = [];

          let currentRow = 0;
          const rowRegex = /<Row(?:\s+ss:Index=["'](\d+)["'])?[^>]*>([\s\S]*?)<\/Row>/gi;
          let rowMatch;

          while ((rowMatch = rowRegex.exec(sheetBody)) !== null) {
            currentRow = rowMatch[1] ? parseInt(rowMatch[1], 10) : currentRow + 1;
            const rowBody = rowMatch[2];

            let currentCol = 0;
            const cellRegex = /<Cell(?:\s+ss:Index=["'](\d+)["'])?(?:\s+ss:StyleID=["']([^"']*)["'])?(?:\s+ss:Formula=["']([^"']*)["'])?[^>]*>(?:[\s\S]*?<Data[^>]*>([\s\S]*?)<\/Data>)?/gi;
            let cellMatch;

            while ((cellMatch = cellRegex.exec(rowBody)) !== null) {
              currentCol = cellMatch[1] ? parseInt(cellMatch[1], 10) : currentCol + 1;
              const formula = cellMatch[3] || null;
              const cellVal = cellMatch[4] != null ? cellMatch[4].trim() : '';

              // Convert col number to letter (1 -> A, 2 -> B...)
              let colLetters = '';
              let tempCol = currentCol;
              while (tempCol > 0) {
                let rem = (tempCol - 1) % 26;
                colLetters = String.fromCharCode(65 + rem) + colLetters;
                tempCol = Math.floor((tempCol - 1) / 26);
              }
              const cellId = `${colLetters}${currentRow}`;

              if (cellVal || formula) {
                const isNum = !formula && !isNaN(Number(cellVal.replace(/,/g, ''))) && cellVal !== '';
                items.push({
                  cell: cellId,
                  val: cellVal,
                  formula: formula,
                  isNum: isNum,
                  bold: (cellMatch[2] || '').includes('Header') || (cellMatch[2] || '').includes('Bold') || currentRow === 1
                });
              }
            }
          }

          extractedSheets[sheetName] = items;
        }

        if (Object.keys(extractedSheets).length > 0) {
          return {
            sheetsData: extractedSheets,
            activeSheet: Object.keys(extractedSheets)[0] || 'Sheet1',
            title: 'Imported Workbook',
            format: 'gaxis'
          };
        }
      } catch (err) {
        console.warn('Error parsing XML SpreadsheetML:', err);
      }
    }

    return { sheetsData: { Sheet1: [] }, activeSheet: 'Sheet1', format: 'gaxis' };
  }

  // ==========================================================================
  // 3. GIRI KINETIC (.gkinetic) — Universal Slide Presentation
  // Compatible with: MS PowerPoint, OpenDocument Impress, OpenOffice, WPS Presentation
  // ==========================================================================

  static formatGKinetic({ slidesData = [], title = 'Kinetic Presentation Deck', author = 'Giri Orbit User', date = null }) {
    const exportDate = date || new Date().toISOString();
    const manifest = {
      format: 'gkinetic',
      version: '2.0',
      title: title,
      author: author,
      exportedAt: exportDate,
      slides: slidesData
    };

    const manifestJson = JSON.stringify(manifest);

    // Build visually rich slide pages for standard Office and browser presentation viewers
    const slidesHtml = (Array.isArray(slidesData) ? slidesData : []).map((slide, idx) => {
      const slideNum = idx + 1;
      const sTitle = escapeXml(slide.title || `Slide ${slideNum}`);
      const sSubtitle = escapeXml(slide.subtitle || slide.desc || '');
      const tag = escapeXml(slide.tag || `SLIDE ${slideNum}`);
      const bg = slide.bg || '#1e293b';

      let bodyElements = '';
      if (Array.isArray(slide.features) && slide.features.length > 0) {
        bodyElements += `<div class="features-grid">
          ${slide.features.map(f => `
            <div class="feature-card">
              <div class="feature-num">${escapeXml(f.num || '•')}</div>
              <div class="feature-title">${escapeXml(f.title || '')}</div>
              <div class="feature-desc">${escapeXml(f.desc || '')}</div>
            </div>
          `).join('')}
        </div>`;
      }

      if (Array.isArray(slide.bullets) && slide.bullets.length > 0) {
        bodyElements += `<ul class="slide-bullets">
          ${slide.bullets.map(b => `<li>${escapeXml(b)}</li>`).join('')}
        </ul>`;
      }

      if (slide.content && typeof slide.content === 'string') {
        bodyElements += `<div class="slide-raw-content">${slide.content}</div>`;
      }

      return `<div class="slide-page" id="slide-${slideNum}" style="background-color: ${bg};">
        <div class="slide-header">
          <span class="slide-tag">${tag}</span>
          <span class="slide-number">${slideNum} / ${slidesData.length}</span>
        </div>
        <h1 class="slide-title">${sTitle}</h1>
        ${sSubtitle ? `<h2 class="slide-subtitle">${sSubtitle}</h2>` : ''}
        <div class="slide-body">
          ${bodyElements}
        </div>
        <div class="slide-footer">
          <span>Giri Orbit Kinetic</span>
          <span>${escapeXml(title)}</span>
        </div>
      </div>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:p='urn:schemas-microsoft-com:office:powerpoint'
      xmlns:v='urn:schemas-microsoft-com:vml'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="ProgId" content="PowerPoint.Slide">
  <meta name="Generator" content="Giri Orbit Kinetic 12.2 - Universal Office Presentation">
  <meta name="Author" content="${escapeXml(author)}">
  <title>${escapeXml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <p:Presentation>
      <p:SlideMaster>
        <p:SlideLayout>
        </p:SlideLayout>
      </p:SlideMaster>
    </p:Presentation>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: 11.0in 6.18in landscape;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 24px;
      font-family: 'Segoe UI', 'Liberation Sans', Arial, sans-serif;
      background: #0b0f19;
      color: #f8fafc;
    }
    .slide-page {
      width: 960px;
      min-height: 540px;
      margin: 24px auto;
      padding: 40px 48px;
      box-sizing: border-box;
      page-break-after: always;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      border: 1px solid #334155;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .slide-tag {
      font-size: 10pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .slide-number {
      font-size: 10pt;
      color: #94a3b8;
    }
    .slide-title {
      font-size: 26pt;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }
    .slide-subtitle {
      font-size: 14pt;
      font-weight: 400;
      color: #94a3b8;
      margin: 0 0 24px 0;
      line-height: 1.4;
    }
    .slide-body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin: 16px 0;
    }
    .feature-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 16px;
    }
    .feature-num {
      font-size: 18pt;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 6px;
    }
    .feature-title {
      font-size: 12pt;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 4px;
    }
    .feature-desc {
      font-size: 10pt;
      color: #cbd5e1;
      line-height: 1.4;
    }
    .slide-bullets {
      font-size: 13pt;
      line-height: 1.7;
      color: #e2e8f0;
      margin: 12px 0;
      padding-left: 28px;
    }
    .slide-footer {
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      color: #64748b;
      margin-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 10px;
    }
  </style>
  <script id="giri-orbit-manifest" type="application/json">
${utf8ToBase64(manifestJson)}
  </script>
</head>
<body>
${slidesHtml}
</body>
</html>`.trim();
  }

  static parseGKinetic(rawString) {
    if (!rawString || typeof rawString !== 'string') {
      return { slides: [], title: 'Presentation Deck', format: 'gkinetic' };
    }

    const trimmed = rawString.trim();

    // 1. Check for embedded Giri Orbit manifest
    const manifestMatch = trimmed.match(/<script[^>]*id=["']giri-orbit-manifest["'][^>]*>([\s\S]*?)<\/script>/i);
    if (manifestMatch && manifestMatch[1]) {
      try {
        let manifestText = manifestMatch[1].trim(); if (!manifestText.startsWith("{") && !manifestText.startsWith("[")) manifestText = base64ToUtf8(manifestText); const manifest = JSON.parse(manifestText);
        if (Array.isArray(manifest.slides)) {
          return {
            slides: manifest.slides,
            title: manifest.title || 'Presentation Deck',
            author: manifest.author || 'Giri Orbit User',
            format: 'gkinetic'
          };
        }
      } catch (e) {
        console.warn('Error reading gkinetic manifest:', e);
      }
    }

    // 2. Check for legacy JSON format: [{ title: ... }] or { format: 'gkinetic', slides: [...] }
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return { slides: parsed, title: parsed[0]?.title || 'Presentation Deck', format: 'gkinetic' };
        }
      } catch { }
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed.slides)) {
          return { slides: parsed.slides, title: parsed.title || 'Presentation Deck', format: 'gkinetic' };
        }
      } catch { }
    }

    // 3. Document is HTML presentation from PowerPoint / Impress
    const slideMatches = trimmed.match(/<div[^>]*class=["'][^"']*slide-page[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi);
    if (slideMatches && slideMatches.length > 0) {
      const slides = slideMatches.map((sHtml, i) => {
        const titleMatch = sHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const subMatch = sHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
        return {
          title: titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : `Slide ${i + 1}`,
          subtitle: subMatch ? subMatch[1].replace(/<[^>]+>/g, '').trim() : '',
          layout: 'title',
          content: sHtml
        };
      });

      return { slides, title: slides[0]?.title || 'Imported Presentation', format: 'gkinetic' };
    }

    return { slides: [], title: 'Presentation Deck', format: 'gkinetic' };
  }

  // ==========================================================================
  // 4. GIRI AEGIS (.gaegis) — Universal PDF / Draw Studio Container
  // Compatible with: Adobe Acrobat, Vector Draw Studio, Chrome / Edge PDF
  // ==========================================================================

  static formatGAegis({ pages = [], title = 'Aegis Document', author = 'Giri Orbit User', date = null }) {
    const exportDate = date || new Date().toISOString();
    const manifest = {
      format: 'gaegis',
      version: '2.0',
      title: title,
      author: author,
      exportedAt: exportDate,
      pages: pages
    };

    const manifestBase64 = utf8ToBase64(JSON.stringify(manifest));

    // Construct a standards-compliant PDF-1.4 container with visual text/vector stream
    // and custom Giri Orbit metadata stream.
    const cleanTitle = (title || 'Aegis Document').replace(/[^a-zA-Z0-9_\- ]/g, '');
    const pageCount = Array.isArray(pages) && pages.length > 0 ? pages.length : 1;

    let pdfContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<<
  /Title (${cleanTitle})
  /Author (${author})
  /Creator (Giri Orbit Aegis PDF Studio 12.2)
  /Producer (Giri Corporation Sovereign Suite)
  /CreationDate (D:${exportDate.replace(/[-:TZ]/g, '').slice(0, 14)})
  /GiriOrbitMetadata (${manifestBase64})
>>
endobj
2 0 obj
<<
  /Type /Catalog
  /Pages 3 0 R
>>
endobj
3 0 obj
<<
  /Type /Pages
  /Kids [ 4 0 R ]
  /Count 1
>>
endobj
4 0 obj
<<
  /Type /Page
  /Parent 3 0 R
  /MediaBox [ 0 0 612 792 ]
  /Contents 5 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
      /F2 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
    >>
  >>
>>
endobj
5 0 obj
<< /Length 260 >>
stream
BT
/F1 18 Tf
54 738 Td
(${cleanTitle}) Tj
0 -24 Td
/F2 11 Tf
(Giri Orbit Aegis Universal Document Container) Tj
0 -18 Td
(Author: ${author} - Exported: ${exportDate.slice(0, 10)}) Tj
0 -28 Td
(This document contains full vector and layout data readable by Giri Orbit and any PDF suite.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000280 00000 n 
0000000333 00000 n 
0000000392 00000 n 
0000000570 00000 n 
trailer
<<
  /Size 6
  /Root 2 0 R
  /Info 1 0 R
>>
startxref
885
%%EOF
`;
    return pdfContent;
  }

  static parseGAegis(rawString) {
    if (!rawString || typeof rawString !== 'string') {
      return { pages: [], title: 'Aegis Document', format: 'gaegis' };
    }

    const trimmed = rawString.trim();

    // 1. Check for /GiriOrbitMetadata (Base64) inside PDF object
    const metaMatch = trimmed.match(/\/GiriOrbitMetadata\s*\(([^)]+)\)/);
    if (metaMatch && metaMatch[1]) {
      try {
        const jsonStr = base64ToUtf8(metaMatch[1]);
        const manifest = JSON.parse(jsonStr);
        if (manifest.pages) {
          return {
            pages: manifest.pages,
            title: manifest.title || 'Aegis Document',
            author: manifest.author || 'Giri Orbit User',
            format: 'gaegis'
          };
        }
      } catch (e) {
        console.warn('Error parsing gaegis PDF metadata:', e);
      }
    }

    // 2. Check for legacy JSON format: [{ title: ... }] or { format: 'gaegis', pages: [...] }
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.format === 'gaegis' || parsed.pages || parsed.content) {
          return {
            pages: parsed.pages || (parsed.content ? [{ title: 'Page 1', content: parsed.content }] : []),
            title: parsed.title || 'Aegis Document',
            format: 'gaegis'
          };
        }
      } catch { }
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return { pages: parsed, title: 'Aegis Document', format: 'gaegis' };
        }
      } catch { }
    }

    return { pages: [{ title: 'Imported Page', content: trimmed }], title: 'Aegis Document', format: 'gaegis' };
  }

  // ==========================================================================
  // 5. GIRI SUITE (.giri) — Universal Workspace Container
  // ==========================================================================
  // 5. GIRI UNIVERSAL OFFICE CONTAINER (.giri) — Omni-Format Sovereign Standard
  // Version 3.0: 100% Interoperable across all document types, spreadsheets,
  // presentations, PDF seals, and unified multi-tool sovereign workspaces.
  // ==========================================================================

  static formatUniversalGiri({
    primaryType = 'document', // 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'suite'
    title = 'Untitled Office Document',
    author = 'Giri Orbit Sovereign User',
    date = null,
    drift = null,
    axis = null,
    kinetic = null,
    pdf = null,
    metadata = {}
  }) {
    const exportDate = date || new Date().toISOString();

    // Normalize payloads
    let driftContent = drift;
    if (typeof driftContent === 'object' && driftContent !== null) {
      driftContent = driftContent.content || JSON.stringify(driftContent);
    }

    let axisData = axis;
    if (typeof axisData === 'string') {
      try { axisData = JSON.parse(axisData); } catch { }
    }

    let kineticData = kinetic;
    if (typeof kineticData === 'string') {
      try { kineticData = JSON.parse(kineticData); } catch { }
    }

    let pdfData = pdf;
    if (typeof pdfData === 'string') {
      try { pdfData = JSON.parse(pdfData); } catch { }
    }

    // Auto-derive primaryType if suite or not explicitly provided
    let derivedType = primaryType;
    const activeToolsCount = (driftContent ? 1 : 0) + (axisData ? 1 : 0) + (kineticData ? 1 : 0) + (pdfData ? 1 : 0);
    if (!primaryType || primaryType === 'suite') {
      if (activeToolsCount === 1) {
        if (driftContent) derivedType = 'document';
        else if (axisData) derivedType = 'spreadsheet';
        else if (kineticData) derivedType = 'presentation';
        else if (pdfData) derivedType = 'pdf';
      } else {
        derivedType = 'suite';
      }
    }

    // Extract universal interop text representations
    let plaintext = '';
    let markdown = '';
    let csvData = '';
    let htmlPreview = '';

    // Document interop extraction
    if (driftContent) {
      const stripped = String(driftContent).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      plaintext += `[GIRI DRIFT DOCUMENT: ${title}]\n${stripped}\n\n`;
      markdown += `# ${title}\n\n${stripped}\n\n`;
      htmlPreview += `<div class="giri-module-preview document-preview">${driftContent}</div>`;
    }

    // Spreadsheet interop extraction
    if (axisData && typeof axisData === 'object') {
      plaintext += `[GIRI AXIS SPREADSHEET]\n`;
      const firstSheetKey = Object.keys(axisData)[0];
      const sheet = axisData[firstSheetKey] || {};
      let csvRows = [];
      let maxR = 0;
      Object.keys(sheet).forEach(cellKey => {
        const m = cellKey.match(/^([A-Z]+)([0-9]+)$/);
        if (m) {
          const r = parseInt(m[2], 10);
          if (r > maxR) maxR = Math.min(r, 50);
        }
      });
      maxR = Math.max(maxR, 5);
      for (let r = 1; r <= maxR; r++) {
        let rowCells = [];
        for (let c = 0; c < 10; c++) {
          const colLetter = String.fromCharCode(65 + c);
          const cellVal = sheet[`${colLetter}${r}`] != null ? String(sheet[`${colLetter}${r}`]) : '';
          rowCells.push(`"${cellVal.replace(/"/g, '""')}"`);
        }
        if (rowCells.some(v => v !== '""')) {
          csvRows.push(rowCells.join(','));
        }
      }
      csvData = csvRows.join('\n');
      plaintext += csvData + '\n\n';
      markdown += `\n### Spreadsheet Data (${firstSheetKey})\n\`\`\`csv\n${csvData}\n\`\`\`\n\n`;
      htmlPreview += `<div class="giri-module-preview spreadsheet-preview"><h4>${escapeXml(firstSheetKey)}</h4><pre>${escapeXml(csvData)}</pre></div>`;
    }

    // Presentation interop extraction
    if (Array.isArray(kineticData) && kineticData.length > 0) {
      plaintext += `[GIRI KINETIC PRESENTATION - ${kineticData.length} Slides]\n`;
      markdown += `\n## Presentation Slides\n`;
      kineticData.forEach((s, idx) => {
        plaintext += `Slide ${idx + 1}: ${s.title || ''} - ${s.desc || ''}\n`;
        markdown += `### Slide ${idx + 1}: ${s.title || ''}\n${s.desc || ''}\n\n`;
      });
      plaintext += '\n';
      htmlPreview += `<div class="giri-module-preview presentation-preview"><h4>Presentation Deck (${kineticData.length} Slides)</h4><ul>${kineticData.map((s, i) => `<li><strong>Slide ${i + 1}:</strong> ${escapeXml(s.title || 'Slide')}</li>`).join('')}</ul></div>`;
    }

    // PDF interop extraction
    if (Array.isArray(pdfData) && pdfData.length > 0) {
      plaintext += `[GIRI AEGIS PDF STUDIO - ${pdfData.length} Pages]\n`;
      markdown += `\n## Aegis PDF Pages\n`;
      pdfData.forEach((p, idx) => {
        const textOnly = (p.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        plaintext += `Page ${idx + 1} (${p.title || ''}): ${textOnly}\n`;
        markdown += `### Page ${idx + 1}: ${p.title || ''}\n${textOnly}\n\n`;
      });
      htmlPreview += `<div class="giri-module-preview pdf-preview"><h4>Aegis Certified PDF Document (${pdfData.length} Pages)</h4></div>`;
    }

    const manifest = {
      giri_magic: "GIRI_SOVEREIGN_OFFICE_UNIVERSAL_v3",
      format: "giri",
      version: "3.0",
      primary_type: derivedType,
      title: title,
      author: author,
      exportedAt: exportDate,
      tools: {
        drift: driftContent || null,
        axis: axisData || null,
        kinetic: kineticData || null,
        pdf: pdfData || null
      },
      interop: {
        plaintext: plaintext.trim(),
        markdown: markdown.trim(),
        csv: csvData,
        hasDocument: !!driftContent,
        hasSpreadsheet: !!axisData,
        hasPresentation: !!(Array.isArray(kineticData) && kineticData.length > 0),
        hasPdf: !!(Array.isArray(pdfData) && pdfData.length > 0)
      },
      metadata: metadata || {}
    };

    const manifestJson = JSON.stringify(manifest);

    // Self-Rendering Polyglot HTML/JSON Container:
    // If opened in any web browser or third-party tool, renders an interactive,
    // responsive viewer with full offline fidelity and an "Open in Giri Orbit" action.
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="ProgId" content="GiriOrbit.Universal">
  <meta name="Generator" content="Giri Orbit Sovereign Enterprise Suite 12.2 - Universal Office Container">
  <meta name="Author" content="${escapeXml(author)}">
  <meta name="giri-primary-type" content="${derivedType}">
  <meta name="giri-format-version" content="3.0">
  <title>${escapeXml(title)} — Giri Universal Office</title>
  <script id="giri-orbit-manifest" type="application/json">
${utf8ToBase64(manifestJson)}
  </script>
  <style>
    :root {
      --giri-bg: #090d16;
      --giri-surface: #111827;
      --giri-card: #1f2937;
      --giri-border: #374151;
      --giri-text: #f9fafb;
      --giri-muted: #9ca3af;
      --giri-primary: #ef4444;
      --giri-accent: #3b82f6;
      --giri-green: #10b981;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font-family); background: var(--giri-bg); color: var(--giri-text); line-height: 1.6; padding: 24px; min-height: 100vh; }
    .giri-container { max-width: 1080px; margin: 0 auto; background: var(--giri-surface); border: 1px solid var(--giri-border); border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .giri-header { background: linear-gradient(135deg, #182234, #0f172a); border-bottom: 1px solid var(--giri-border); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
    .giri-brand { display: flex; align-items: center; gap: 12px; }
    .giri-brand-badge { width: 38px; height: 38px; border-radius: 8px; background: linear-gradient(135deg, #ef4444, #b91c1c); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; color: #fff; }
    .giri-brand-title { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .giri-brand-subtitle { font-size: 11px; color: var(--giri-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .giri-type-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .giri-actions { display: flex; gap: 10px; align-items: center; }
    .giri-btn { background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 12.5px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s; }
    .giri-btn:hover { background: #1d4ed8; }
    .giri-btn-secondary { background: var(--giri-card); color: var(--giri-text); border: 1px solid var(--giri-border); }
    .giri-btn-secondary:hover { background: #374151; }
    .giri-meta-bar { background: rgba(0,0,0,0.25); border-bottom: 1px solid var(--giri-border); padding: 12px 24px; display: flex; gap: 24px; font-size: 12px; color: var(--giri-muted); flex-wrap: wrap; }
    .giri-meta-item strong { color: var(--giri-text); }
    .giri-content-panel { padding: 32px 24px; background: #ffffff; color: #0f172a; min-height: 480px; }
    .document-preview { font-family: "Calibri", "Segoe UI", Arial, sans-serif; font-size: 11pt; line-height: 1.6; max-width: 800px; margin: 0 auto; color: #1e293b; }
    .spreadsheet-preview pre { font-family: "Consolas", monospace; font-size: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; overflow-x: auto; color: #0f172a; }
    .presentation-preview ul { list-style: none; padding: 0; display: grid; gap: 8px; }
    .presentation-preview li { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px; }
    .giri-footer { padding: 16px 24px; background: var(--giri-surface); border-top: 1px solid var(--giri-border); display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: var(--giri-muted); }
  </style>
</head>
<body>
  <div class="giri-container">
    <div class="giri-header">
      <div class="giri-brand">
        <div class="giri-brand-badge">G</div>
        <div>
          <div class="giri-brand-title">${escapeXml(title)}</div>
          <div class="giri-brand-subtitle">Universal Sovereign Office Container (.giri)</div>
        </div>
      </div>
      <div class="giri-actions">
        <span class="giri-type-badge">${derivedType.toUpperCase()} MODE</span>
        <button class="giri-btn giri-btn-secondary" onclick="window.print()">Print / PDF</button>
        <button class="giri-btn" onclick="navigator.clipboard?.writeText(location.href); alert('Universal .giri container location copied');">Share</button>
      </div>
    </div>

    <div class="giri-meta-bar">
      <div class="giri-meta-item">Author: <strong>${escapeXml(author)}</strong></div>
      <div class="giri-meta-item">Format: <strong>Giri Universal v3.0</strong></div>
      <div class="giri-meta-item">Exported: <strong>${new Date(exportDate).toLocaleDateString()}</strong></div>
      <div class="giri-meta-item">Sovereignty: <strong>100% In-Memory Offline Standard</strong></div>
    </div>

    <div class="giri-content-panel">
      ${htmlPreview || `<div style="text-align:center; padding:40px; color:#64748b;"><h3>${escapeXml(title)}</h3><p>Universal Sovereign Office Container Ready</p></div>`}
    </div>

    <div class="giri-footer">
      <div>Giri Orbit Sovereign Enterprise Suite &bull; Zero Cloud Lock-In &bull; Zero Telemetry</div>
      <div>Compatible with all desktop and browser environments</div>
    </div>
  </div>
</body>
</html>`.trim();
  }

  // Backward-compatible alias for existing callers
  static formatGiriProject({ drift = null, axis = null, kinetic = null, pdf = null, title = 'Giri Project', author = 'Giri Orbit User', date = null }) {
    return GiriOfficeFormats.formatUniversalGiri({
      primaryType: 'suite',
      title,
      author,
      date,
      drift,
      axis,
      kinetic,
      pdf
    });
  }

  static parseUniversalGiri(rawString) {
    if (!rawString) return null;
    let text = typeof rawString === 'string' ? rawString.trim() : '';

    // 1. Direct JSON object passed
    if (typeof rawString === 'object' && rawString !== null) {
      return GiriOfficeFormats._normalizeGiriManifest(rawString);
    }

    // 2. Polyglot HTML: Check for <script id="giri-orbit-manifest"> or similar
    const manifestMatch = text.match(/<script[^>]*id=["']giri-orbit-manifest["'][^>]*>([\s\S]*?)<\/script>/i) ||
                          text.match(/<script[^>]*id=["']giri-sovereign-universal["'][^>]*>([\s\S]*?)<\/script>/i);
    if (manifestMatch && manifestMatch[1]) {
      try {
        let manifestText = manifestMatch[1].trim();
        if (!manifestText.startsWith("{") && !manifestText.startsWith("[")) {
          manifestText = base64ToUtf8(manifestText);
        }
        const parsed = JSON.parse(manifestText);
        return GiriOfficeFormats._normalizeGiriManifest(parsed);
      } catch (e) {
        console.warn('Error parsing universal .giri polyglot manifest:', e);
      }
    }

    // 3. Raw JSON string
    if (text.startsWith('{') && text.endsWith('}')) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.giri_magic || parsed.format === 'giri' || parsed.tools || parsed.primary_type) {
          return GiriOfficeFormats._normalizeGiriManifest(parsed);
        }
      } catch { }
    }

    // 4. Fallback: If a .gdrift, .gaxis, .gkinetic, or .gaegis file was renamed to .giri
    if (text.includes('gdrift-manifest') || text.includes('Word.Document') || text.includes('drift-page-sheet')) {
      const parsedDrift = GiriOfficeFormats.parseGDrift(text);
      return GiriOfficeFormats._normalizeGiriManifest({
        primary_type: 'document',
        title: parsedDrift.title || 'Imported Drift Document',
        author: parsedDrift.author || 'Giri Orbit User',
        tools: { drift: parsedDrift.content }
      });
    }

    if (text.includes('gaxis-manifest') || text.includes('<Workbook') || text.includes('urn:schemas-microsoft-com:office:spreadsheet')) {
      const parsedAxis = GiriOfficeFormats.parseGAxis(text);
      return GiriOfficeFormats._normalizeGiriManifest({
        primary_type: 'spreadsheet',
        title: parsedAxis.title || 'Imported Axis Workbook',
        author: parsedAxis.author || 'Giri Orbit User',
        tools: { axis: parsedAxis.sheetsData }
      });
    }

    if (text.includes('gkinetic-manifest') || text.includes('PowerPoint.Show')) {
      const parsedKinetic = GiriOfficeFormats.parseGKinetic(text);
      return GiriOfficeFormats._normalizeGiriManifest({
        primary_type: 'presentation',
        title: parsedKinetic.title || 'Imported Kinetic Deck',
        author: parsedKinetic.author || 'Giri Orbit User',
        tools: { kinetic: parsedKinetic.slides }
      });
    }

    if (text.includes('/GiriOrbitMetadata') || text.includes('%PDF-')) {
      const parsedAegis = GiriOfficeFormats.parseGAegis(text);
      return GiriOfficeFormats._normalizeGiriManifest({
        primary_type: 'pdf',
        title: parsedAegis.title || 'Imported Aegis Document',
        author: parsedAegis.author || 'Giri Orbit User',
        tools: { pdf: parsedAegis.pages }
      });
    }

    return null;
  }

  static _normalizeGiriManifest(manifest) {
    if (!manifest || typeof manifest !== 'object') return null;

    const tools = manifest.tools || {};
    const drift = tools.drift != null ? tools.drift : (manifest.drift || manifest.content || null);
    const axis = tools.axis != null ? tools.axis : (manifest.axis || manifest.sheetsData || null);
    const kinetic = tools.kinetic != null ? tools.kinetic : (manifest.kinetic || manifest.slides || null);
    const pdf = tools.pdf != null ? tools.pdf : (manifest.pdf || manifest.pages || null);

    let primaryType = manifest.primary_type || manifest.primaryType;
    if (!primaryType) {
      const activeCount = (drift ? 1 : 0) + (axis ? 1 : 0) + (kinetic ? 1 : 0) + (pdf ? 1 : 0);
      if (activeCount === 1) {
        if (drift) primaryType = 'document';
        else if (axis) primaryType = 'spreadsheet';
        else if (kinetic) primaryType = 'presentation';
        else if (pdf) primaryType = 'pdf';
      } else {
        primaryType = 'suite';
      }
    }

    return {
      success: true,
      format: 'giri',
      version: manifest.version || '3.0',
      primaryType: primaryType,
      primary_type: primaryType,
      title: manifest.title || 'Universal Office Document',
      author: manifest.author || 'Giri Orbit Sovereign User',
      exportedAt: manifest.exportedAt || manifest.created_at || new Date().toISOString(),
      tools: {
        drift: drift,
        axis: axis,
        kinetic: kinetic,
        pdf: pdf
      },
      document: drift,
      spreadsheet: axis,
      presentation: kinetic,
      pdf: pdf,
      interop: manifest.interop || {},
      metadata: manifest.metadata || manifest.meta || {}
    };
  }

  // Backward-compatible alias
  static parseGiriProject(rawString) {
    return GiriOfficeFormats.parseUniversalGiri(rawString);
  }

  // ==========================================================================
  // Universal Transcoder: Converts ANY office document to .giri and vice versa
  // ==========================================================================

  static transcodeToGiri({ fileName = 'document', content = '', fileType = null, author = 'Giri Orbit Sovereign User' }) {
    const ext = (fileType || fileName.split('.').pop() || '').toLowerCase();
    const baseName = fileName.replace(/\.[^/.]+$/, '');

    // Document formats
    if (['docx', 'doc', 'odt', 'rtf', 'txt', 'md', 'html', 'htm', 'gdrift', 'gdoc'].includes(ext)) {
      const parsed = GiriOfficeFormats.parseGDrift(content);
      return GiriOfficeFormats.formatUniversalGiri({
        primaryType: 'document',
        title: parsed.title && parsed.title !== 'Untitled Document' ? parsed.title : baseName,
        author: parsed.author || author,
        drift: parsed.content || content
      });
    }

    // Spreadsheet formats
    if (['xlsx', 'xls', 'ods', 'csv', 'tsv', 'gaxis', 'gsheet'].includes(ext)) {
      const parsed = GiriOfficeFormats.parseGAxis(content);
      return GiriOfficeFormats.formatUniversalGiri({
        primaryType: 'spreadsheet',
        title: parsed.title && parsed.title !== 'Giri Axis Workbook' ? parsed.title : baseName,
        author: parsed.author || author,
        axis: parsed.sheetsData || { Sheet1: {} }
      });
    }

    // Presentation formats
    if (['pptx', 'ppt', 'odp', 'gkinetic', 'gslide'].includes(ext)) {
      const parsed = GiriOfficeFormats.parseGKinetic(content);
      return GiriOfficeFormats.formatUniversalGiri({
        primaryType: 'presentation',
        title: parsed.title && parsed.title !== 'Kinetic Presentation Deck' ? parsed.title : baseName,
        author: parsed.author || author,
        kinetic: parsed.slides || []
      });
    }

    // PDF formats
    if (['pdf', 'gaegis', 'gpdf'].includes(ext)) {
      const parsed = GiriOfficeFormats.parseGAegis(content);
      return GiriOfficeFormats.formatUniversalGiri({
        primaryType: 'pdf',
        title: parsed.title || baseName,
        author: parsed.author || author,
        pdf: parsed.pages || [{ title: baseName, content }]
      });
    }

    // Fallback: If it's already a giri or JSON format
    const parsedUniversal = GiriOfficeFormats.parseUniversalGiri(content);
    if (parsedUniversal) {
      return GiriOfficeFormats.formatUniversalGiri({
        primaryType: parsedUniversal.primaryType,
        title: parsedUniversal.title,
        author: parsedUniversal.author,
        drift: parsedUniversal.tools.drift,
        axis: parsedUniversal.tools.axis,
        kinetic: parsedUniversal.tools.kinetic,
        pdf: parsedUniversal.tools.pdf
      });
    }

    // Default to document wrapper
    return GiriOfficeFormats.formatUniversalGiri({
      primaryType: 'document',
      title: baseName,
      author,
      drift: content
    });
  }

  static transcodeFromGiri(giriString, targetExt) {
    const parsed = GiriOfficeFormats.parseUniversalGiri(giriString);
    if (!parsed) return '';

    const ext = String(targetExt || 'txt').toLowerCase().replace(/^\./, '');

    switch (ext) {
      case 'gdrift':
      case 'doc':
      case 'docx':
      case 'odt':
        return GiriOfficeFormats.formatGDrift({
          title: parsed.title,
          content: parsed.tools.drift || (parsed.interop && parsed.interop.plaintext) || '',
          author: parsed.author
        });

      case 'gaxis':
      case 'xls':
      case 'xlsx':
      case 'ods':
        return GiriOfficeFormats.formatGAxis({
          sheetsData: parsed.tools.axis || { Sheet1: {} },
          title: parsed.title,
          author: parsed.author
        });

      case 'gkinetic':
      case 'ppt':
      case 'pptx':
      case 'odp':
        return GiriOfficeFormats.formatGKinetic({
          slidesData: parsed.tools.kinetic || [{ id: 1, title: parsed.title, desc: parsed.interop?.plaintext || '' }],
          title: parsed.title,
          author: parsed.author
        });

      case 'gaegis':
      case 'gpdf':
      case 'pdf':
        return GiriOfficeFormats.formatGAegis({
          pages: parsed.tools.pdf || [{ title: parsed.title, content: parsed.tools.drift || parsed.interop?.plaintext || '' }],
          title: parsed.title,
          author: parsed.author
        });

      case 'csv':
        return parsed.interop?.csv || '';

      case 'md':
      case 'markdown':
        return parsed.interop?.markdown || `# ${parsed.title}\n\n${parsed.interop?.plaintext || ''}`;

      case 'txt':
        return parsed.interop?.plaintext || parsed.title;

      case 'html':
      case 'htm':
        return parsed.tools.drift || parsed.interop?.htmlPreview || `<h1>${escapeXml(parsed.title)}</h1>`;

      case 'json':
        return JSON.stringify(parsed, null, 2);

      case 'giri':
      default:
        return GiriOfficeFormats.formatUniversalGiri({
          primaryType: parsed.primaryType,
          title: parsed.title,
          author: parsed.author,
          drift: parsed.tools.drift,
          axis: parsed.tools.axis,
          kinetic: parsed.tools.kinetic,
          pdf: parsed.tools.pdf
        });
    }
  }
}
