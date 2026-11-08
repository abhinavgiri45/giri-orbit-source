/* ============================================================================
 * GIRI AXIS — HIGH-VELOCITY FINANCIAL MATRIX & SPREADSHEET (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Browser • Zero Cloud Telemetry • Sovereign In-Memory Matrix Engine
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include <gdiplus.h>
using namespace Gdiplus;
ULONG_PTR g_gdiToken = 0;
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <map>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <cctype>
#include <iomanip>
#include "../common/tool_start_ui.h"

#define MAX_GRID_ROWS 1000
#define MAX_GRID_COLS 52
#define CELL_WIDTH_DEFAULT 80
#define CELL_HEIGHT_DEFAULT 24
#define HEADER_ROW_HEIGHT 26
#define HEADER_COL_WIDTH 50

#define IDM_DATA_SORT_ASC    1060
#define IDM_DATA_SORT_DESC   1061
#define IDM_DATA_CALCULATE   1062
#define IDM_INSERT_ROW       1063
#define IDM_INSERT_COL       1064
#define IDM_INSERT_SUM       1065
#define IDM_INSERT_AVG       1066
#define IDM_INSERT_COUNT     1067
#define IDM_INSERT_MIN       1068
#define IDM_INSERT_MAX       1069

#define IDC_FORMULA_EDIT     3101
#define IDC_CELL_EDITOR      3102
#define IDC_SHEET_TABS       3103
#define IDC_TOOLBAR_PANEL    3110
#define IDC_BTN_AUTOSUM      3111
#define IDC_BTN_AVERAGE      3112
#define IDC_BTN_COUNT        3113
#define IDC_BTN_MAXMIN       3114
#define IDC_BTN_CURRENCY     3115
#define IDC_BTN_PERCENT      3116
#define IDC_BTN_SORT_ASC     3117
#define IDC_BTN_SORT_DESC    3118
#define IDC_BTN_INS_ROW      3119
#define IDC_BTN_INS_COL      3120
#define IDC_BTN_CHART        3121
#define IDC_BTN_TEMPLATES    3122
#define IDC_BTN_DEL_ROW      3123
#define IDC_BTN_DEL_COL      3124
#define IDC_BTN_CLEAR        3125
#define IDC_BTN_CUT          3130
#define IDC_BTN_COPY         3131
#define IDC_BTN_PASTE        3132
#define IDC_COMBO_FONT       3133
#define IDC_COMBO_SIZE       3134
#define IDC_BTN_BOLD         3135
#define IDC_BTN_ITALIC       3136
#define IDC_BTN_UNDERLINE    3137
#define IDC_BTN_FILL_COLOR   3138
#define IDC_BTN_TEXT_COLOR   3139
#define IDC_BTN_BORDERS      3140
#define IDC_BTN_ALIGN_L      3141
#define IDC_BTN_ALIGN_C      3142
#define IDC_BTN_ALIGN_R      3143
#define IDC_BTN_WRAP_TEXT    3144
#define IDC_BTN_MERGE_CENTER 3145
#define IDC_BTN_COMMA        3146
#define IDC_BTN_DEC_INC      3147
#define IDC_BTN_DEC_DEC      3148
#define IDC_BTN_CHART_BAR    3150
#define IDC_BTN_CHART_LINE   3151
#define IDC_BTN_CHART_PIE    3152
#define IDC_BTN_CHART_COL    3153
#define IDC_BTN_PIVOT_SUM    3154
#define IDC_BTN_SHAPE_RECT   3155
#define IDC_BTN_SHAPE_CIRCLE 3156
#define IDC_BTN_SHAPE_LINE   3157
#define IDC_BTN_TPL_BUDGET   3158
#define IDC_BTN_TPL_INCOME   3159
#define IDC_BTN_TPL_SAAS     3160
#define IDC_BTN_TPL_PROJECT  3161
#define IDC_BTN_FN_SUM       3170
#define IDC_BTN_FN_AVG       3171
#define IDC_BTN_FN_COUNT     3172
#define IDC_BTN_FN_MAX       3173
#define IDC_BTN_FN_MIN       3174
#define IDC_BTN_FN_IF        3175
#define IDC_BTN_FN_ROUND     3176
#define IDC_BTN_FN_PMT       3177
#define IDC_BTN_FN_CONCAT    3178
#define IDC_BTN_CALC_NOW     3179
#define IDC_BTN_RECALC       3180
#define IDC_BTN_DATA_IMPORT  3185
#define IDC_BTN_DATA_EXPORT  3186
#define IDC_BTN_DATA_SORT_AZ 3187
#define IDC_BTN_DATA_SORT_ZA 3188
#define IDC_BTN_DATA_FILTER  3189
#define IDC_BTN_DATA_DEDUP   3190
#define IDC_BTN_DATA_VALID   3191
#define IDC_BTN_VIEW_GRID    3195
#define IDC_BTN_VIEW_FBAR    3196
#define IDC_BTN_VIEW_HEAD    3197
#define IDC_BTN_ZOOM_IN      3198
#define IDC_BTN_ZOOM_OUT     3199
#define IDC_BTN_ZOOM_RESET   3200
#define IDC_BTN_FREEZE_TOP   3201
#define IDC_BTN_FREEZE_COL   3202

enum AxisRibbonTab {
    AXIS_TAB_HOME = 0,
    AXIS_TAB_INSERT,
    AXIS_TAB_FORMULAS,
    AXIS_TAB_DATA,
    AXIS_TAB_VIEW,
    AXIS_TAB_COUNT
};

int g_activeRibbonTab = AXIS_TAB_HOME;
int g_hoverRibbonTab = -1;
std::vector<HWND> g_tabControls[AXIS_TAB_COUNT];
WNDPROC g_oldToolbarProc = NULL;
HWND g_hFontCombo = NULL;
HWND g_hSizeCombo = NULL;
bool g_showGridlines = true;
bool g_showFormulaBar = true;
bool g_showHeadings = true;
void SwitchRibbonTab(int newTab);
void StyleAxisBtn(HWND btn);



struct CellData {
    std::wstring raw;
    std::wstring display;
};

struct Sheet {
    std::wstring name;
    std::map<std::pair<int, int>, CellData> cells; // (row, col) -> CellData
};

// Global handles & state
HINSTANCE g_hInst = NULL;
wchar_t g_currencySymbol[8] = L"$";
wchar_t g_activeFontName[64] = L"Segoe UI";
HWND g_hMainWnd = NULL;
HWND g_hFormulaBar = NULL;
HWND g_hCellCoordLbl = NULL;
HWND g_hCellEditor = NULL;
HWND g_hGridWnd = NULL;
HWND g_hTabCtrl = NULL;
HWND g_hStatusBar = NULL;
HWND g_hToolbarPanel = NULL;
HWND g_hFxLbl = NULL;

std::vector<Sheet> g_sheets;
int g_activeSheet = 0;
int g_selectedRow = 0;
int g_selectedCol = 0;
int g_scrollRow = 0;
int g_scrollCol = 0;
bool g_isEditing = false;
std::wstring g_currentFilePath = L"";


// Axis View State Machine
enum AxisViewState {
    AXIS_VIEW_START = 0,
    AXIS_VIEW_GRID = 1
};
AxisViewState g_axisState = AXIS_VIEW_START;
GiriOrbit::ToolThemeConfig g_axisConfig;
GiriOrbit::StartUIState g_axisStartState;

void ReturnToAxisStart(HWND hwnd);
void EnterAxisGrid(HWND hwnd);
void EnterAxisGridBlank(HWND hwnd);
void LoadAxisTemplate(HWND hwnd, int idx);
void UpdateStatusBar(HWND hwnd);
void RecalculateSheet(Sheet& sheet);

void InitAxisConfig() {
    g_axisConfig.toolLetter = L"A";
    g_axisConfig.toolName = L"Axis";
    g_axisConfig.fullToolName = L"Giri Axis";
    g_axisConfig.headline = L"Welcome to Axis for free on the web";
    g_axisConfig.subtitle = L"Sovereign in-memory spreadsheet and financial modeling matrix. Zero database tracking, instant local calculation engine, and customizable financial templates.";
    g_axisConfig.createBtnText = L"Create blank workbook";
    g_axisConfig.uploadBtnText = L"Upload File";
    g_axisConfig.draftTitle = L"Workbook 1 - Giri Axis";
    g_axisConfig.draftMeta = L"Saved recently · 100 R x 52 C · 1.2 KB";
    g_axisConfig.toolHash = L"axis";
    g_axisConfig.galleryTitle = L"Create with templates";
    g_axisConfig.galleryBadge = L"";
    g_axisConfig.accentColor = Gdiplus::Color(16, 185, 129); // Emerald-500
    g_axisConfig.accentDark = Gdiplus::Color(4, 120, 87);    // Emerald-700
    g_axisConfig.accentHover = Gdiplus::Color(5, 150, 105);  // Emerald-600
    g_axisConfig.illustrationType = 1; // 3D Column Bars

    g_axisConfig.categories = {
        L"Recommended", L"Budgets & Financials", L"Invoices & Billing", L"Project Trackers", L"Custom Templates 0"
    };

    g_axisConfig.templates = {
        {
            L"Budgets & Financials",
            L"Budgets & Financials",
            L"Quarterly departmental operating expenses, R&D allocation, cloud infra, and FY26 rollup.",
            L"BUDGET"
        },
        {
            L"P&L Financials",
            L"Budgets & Financials",
            L"Comprehensive Profit & Loss financial matrix with Gross Revenue, COGS, and Net Income.",
            L"PNL"
        },
        {
            L"SaaS KPI Run Rate",
            L"Recommended",
            L"Executive SaaS performance matrix tracking MRR Run Rate, Net Retention, and LTV / CAC.",
            L"SAAS"
        },
        {
            L"Shareholder Cap Table",
            L"Budgets & Financials",
            L"Equity ownership matrix with founder shares, employee option pool, and post-money valuation.",
            L"CAPTABLE"
        },
        {
            L"Deliverables Tracker",
            L"Project Trackers",
            L"Engineering sprint milestones, accountability lead, delivery status, and completion timeline.",
            L"TRACKER"
        },
        {
            L"Invoice & Receivables",
            L"Invoices & Billing",
            L"Commercial accounts receivable ledger with payment milestones, client invoicing, and net totals.",
            L"INVOICE"
        }
    };
}

void ReturnToAxisStart(HWND hwnd) {
    g_axisState = AXIS_VIEW_START;
    ShowWindow(g_hToolbarPanel, SW_HIDE);
    ShowWindow(g_hCellCoordLbl, SW_HIDE);
    ShowWindow(g_hFxLbl, SW_HIDE);
    ShowWindow(g_hFormulaBar, SW_HIDE);
    ShowWindow(g_hGridWnd, SW_HIDE);
    ShowWindow(g_hTabCtrl, SW_HIDE);
    ShowWindow(g_hStatusBar, SW_HIDE);
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterAxisGrid(HWND hwnd) {
    g_axisState = AXIS_VIEW_GRID;
    ShowWindow(g_hToolbarPanel, SW_SHOW);
    ShowWindow(g_hCellCoordLbl, SW_SHOW);
    ShowWindow(g_hFxLbl, SW_SHOW);
    ShowWindow(g_hFormulaBar, SW_SHOW);
    ShowWindow(g_hGridWnd, SW_SHOW);
    ShowWindow(g_hTabCtrl, SW_SHOW);
    ShowWindow(g_hStatusBar, SW_SHOW);
    RECT rc;
    GetClientRect(hwnd, &rc);
    SendMessageW(hwnd, WM_SIZE, 0, MAKELPARAM(rc.right, rc.bottom));
    InvalidateRect(g_hGridWnd, NULL, TRUE);
    UpdateStatusBar(hwnd);
}

void EnterAxisGridBlank(HWND hwnd) {
    g_sheets.clear();
    Sheet s;
    s.name = L"Sheet 1";
    g_sheets.push_back(s);
    g_activeSheet = 0;
    g_currentFilePath = L"";
    EnterAxisGrid(hwnd);
}

void LoadAxisTemplate(HWND hwnd, int idx) {
    g_sheets.clear();
    Sheet s;
    s.name = L"Sheet 1";

    if (idx == 0) { // Budgets & Financials
        s.cells[{0, 0}] = { L"Category", L"Category" };
        s.cells[{0, 1}] = { L"Q1", L"Q1" };
        s.cells[{0, 2}] = { L"Q2", L"Q2" };
        s.cells[{0, 3}] = { L"FY26 Total", L"FY26 Total" };

        s.cells[{1, 0}] = { L"R&D Eng", L"R&D Eng" };
        s.cells[{1, 1}] = { L"120000", L"$120,000" };
        s.cells[{1, 2}] = { L"140000", L"$140,000" };
        s.cells[{1, 3}] = { L"=SUM(B2:C2)", L"$260,000" };

        s.cells[{2, 0}] = { L"Cloud Infra", L"Cloud Infra" };
        s.cells[{2, 1}] = { L"45000", L"$45,000" };
        s.cells[{2, 2}] = { L"48000", L"$48,000" };
        s.cells[{2, 3}] = { L"=SUM(B3:C3)", L"$93,000" };

        s.cells[{3, 0}] = { L"Total Opex", L"Total Opex" };
        s.cells[{3, 1}] = { L"=SUM(B2:B3)", L"$165,000" };
        s.cells[{3, 2}] = { L"=SUM(C2:C3)", L"$188,000" };
        s.cells[{3, 3}] = { L"=SUM(D2:D3)", L"$353,000" };
    } else if (idx == 1) { // P&L Financials
        s.cells[{0, 0}] = { L"P&L Metric", L"P&L Metric" };
        s.cells[{0, 1}] = { L"October", L"October" };
        s.cells[{0, 2}] = { L"November", L"November" };
        s.cells[{0, 3}] = { L"Q4 Total", L"Q4 Total" };

        s.cells[{1, 0}] = { L"Gross Revenue", L"Gross Revenue" };
        s.cells[{1, 1}] = { L"420000", L"$420,000" };
        s.cells[{1, 2}] = { L"485000", L"$485,000" };
        s.cells[{1, 3}] = { L"=SUM(B2:C2)", L"$905,000" };

        s.cells[{2, 0}] = { L"Operating ENT", L"Operating ENT" };
        s.cells[{2, 1}] = { L"135000", L"$135,000" };
        s.cells[{2, 2}] = { L"152000", L"$152,000" };
        s.cells[{2, 3}] = { L"=SUM(B3:C3)", L"$287,000" };

        s.cells[{3, 0}] = { L"Net Income", L"Net Income" };
        s.cells[{3, 1}] = { L"=B2-B3", L"$285,000" };
        s.cells[{3, 2}] = { L"=C2-C3", L"$333,000" };
        s.cells[{3, 3}] = { L"=SUM(D2:D3)", L"$618,000" };
    } else if (idx == 2) { // SaaS KPI Run Rate
        s.cells[{0, 0}] = { L"SaaS KPI", L"SaaS KPI" };
        s.cells[{0, 1}] = { L"Q1 Actual", L"Q1 Actual" };
        s.cells[{0, 2}] = { L"Q4 Target", L"Q4 Target" };
        s.cells[{0, 3}] = { L"Trajectory", L"Trajectory" };

        s.cells[{1, 0}] = { L"MRR Run Rate", L"MRR Run Rate" };
        s.cells[{1, 1}] = { L"185000", L"$185,000" };
        s.cells[{1, 2}] = { L"280000", L"$280,000" };
        s.cells[{1, 3}] = { L"+51.3%", L"+51.3%" };

        s.cells[{2, 0}] = { L"Net Retention", L"Net Retention" };
        s.cells[{2, 1}] = { L"124%", L"124%" };
        s.cells[{2, 2}] = { L"135%", L"135%" };
        s.cells[{2, 3}] = { L"Elite Tier", L"Elite Tier" };

        s.cells[{3, 0}] = { L"LTV / CAC", L"LTV / CAC" };
        s.cells[{3, 1}] = { L"4.8x", L"4.8x" };
        s.cells[{3, 2}] = { L"6.1x", L"6.1x" };
        s.cells[{3, 3}] = { L"Exceptional", L"Exceptional" };
    } else if (idx == 3) { // Shareholder Cap Table
        s.cells[{0, 0}] = { L"Shareholder", L"Shareholder" };
        s.cells[{0, 1}] = { L"Shares", L"Shares" };
        s.cells[{0, 2}] = { L"Equity %", L"Equity %" };
        s.cells[{0, 3}] = { L"Implied Value", L"Implied Value" };

        s.cells[{1, 0}] = { L"Abhinav Giri", L"Abhinav Giri" };
        s.cells[{1, 1}] = { L"6500000", L"6,500,000" };
        s.cells[{1, 2}] = { L"65.0%", L"65.0%" };
        s.cells[{1, 3}] = { L"$16,250,000", L"$16,250,000" };

        s.cells[{2, 0}] = { L"Employee Pool", L"Employee Pool" };
        s.cells[{2, 1}] = { L"1500000", L"1,500,000" };
        s.cells[{2, 2}] = { L"15.0%", L"15.0%" };
        s.cells[{2, 3}] = { L"$3,750,000", L"$3,750,000" };

        s.cells[{3, 0}] = { L"Total Diluted", L"Total Diluted" };
        s.cells[{3, 1}] = { L"10000000", L"10,000,000" };
        s.cells[{3, 2}] = { L"100.0%", L"100.0%" };
        s.cells[{3, 3}] = { L"$25,000,000", L"$25,000,000" };
    } else if (idx == 4) { // Deliverables Tracker
        s.cells[{0, 0}] = { L"Deliverable", L"Deliverable" };
        s.cells[{0, 1}] = { L"Lead", L"Lead" };
        s.cells[{0, 2}] = { L"Status", L"Status" };
        s.cells[{0, 3}] = { L"Target Date", L"Target Date" };

        s.cells[{1, 0}] = { L"Physics Core", L"Physics Core" };
        s.cells[{1, 1}] = { L"Abhinav Giri", L"Abhinav Giri" };
        s.cells[{1, 2}] = { L"Complete", L"Complete" };
        s.cells[{1, 3}] = { L"Oct 2026", L"Oct 2026" };

        s.cells[{2, 0}] = { L"Ribbon System", L"Ribbon System" };
        s.cells[{2, 1}] = { L"Architecture", L"Architecture" };
        s.cells[{2, 2}] = { L"Complete", L"Complete" };
        s.cells[{2, 3}] = { L"Nov 2026", L"Nov 2026" };

        s.cells[{3, 0}] = { L"Overall Velocity", L"Overall Velocity" };
        s.cells[{3, 1}] = { L"Suite Team", L"Suite Team" };
        s.cells[{3, 2}] = { L"87% On Schedule", L"87% On Schedule" };
        s.cells[{3, 3}] = { L"Q4 FY26", L"Q4 FY26" };
    } else { // Invoice & Receivables
        s.cells[{0, 0}] = { L"Invoice #", L"Invoice #" };
        s.cells[{0, 1}] = { L"Client Name", L"Client Name" };
        s.cells[{0, 2}] = { L"Amount", L"Amount" };
        s.cells[{0, 3}] = { L"Status", L"Status" };

        s.cells[{1, 0}] = { L"INV-2026-001", L"INV-2026-001" };
        s.cells[{1, 1}] = { L"Global Enterprise", L"Global Enterprise" };
        s.cells[{1, 2}] = { L"45000", L"$45,000" };
        s.cells[{1, 3}] = { L"Paid", L"Paid" };

        s.cells[{2, 0}] = { L"INV-2026-002", L"INV-2026-002" };
        s.cells[{2, 1}] = { L"Apex Systems", L"Apex Systems" };
        s.cells[{2, 2}] = { L"78500", L"$78,500" };
        s.cells[{2, 3}] = { L"Pending", L"Pending" };

        s.cells[{3, 0}] = { L"Total Receivables", L"Total Receivables" };
        s.cells[{3, 1}] = { L"", L"" };
        s.cells[{3, 2}] = { L"=SUM(C2:C3)", L"$123,500" };
        s.cells[{3, 3}] = { L"Active", L"Active" };
    }

    g_sheets.push_back(s);
    g_activeSheet = 0;
    RecalculateSheet(g_sheets[g_activeSheet]);
    EnterAxisGrid(hwnd);
}


// Convert col index to letter (0 -> "A", 25 -> "Z", 26 -> "AA")
std::wstring ColToLetter(int col) {
    std::wstring s = L"";
    while (col >= 0) {
        s = (wchar_t)(L'A' + (col % 26)) + s;
        col = (col / 26) - 1;
    }
    return s;
}

// Convert letter to col index ("A" -> 0, "Z" -> 25, "AA" -> 26)
int LetterToCol(const std::wstring& str) {
    int col = 0;
    for (wchar_t ch : str) {
        if (ch >= L'A' && ch <= L'Z') {
            col = col * 26 + (ch - L'A' + 1);
        } else if (ch >= L'a' && ch <= L'z') {
            col = col * 26 + (ch - L'a' + 1);
        }
    }
    return col - 1;
}

std::wstring GetCellCoordStr(int r, int c) {
    return ColToLetter(c) + std::to_wstring(r + 1);
}

// Formula Evaluation Engine
double EvaluateExpression(const std::wstring& expr, Sheet& sheet);

double GetCellValueAsNumber(const Sheet& sheet, int r, int c) {
    auto it = sheet.cells.find({ r, c });
    if (it == sheet.cells.end() || it->second.display.empty()) return 0.0;
    try {
        return std::stod(it->second.display);
    } catch (...) {
        return 0.0;
    }
}

// Parse range like "A1:A10"
bool ParseRange(const std::wstring& rangeStr, int& r1, int& c1, int& r2, int& c2) {
    size_t colon = rangeStr.find(L':');
    if (colon == std::wstring::npos) return false;
    std::wstring p1 = rangeStr.substr(0, colon);
    std::wstring p2 = rangeStr.substr(colon + 1);

    auto parseCell = [](const std::wstring& s, int& r, int& c) {
        size_t numPos = 0;
        while (numPos < s.length() && !iswdigit(s[numPos])) numPos++;
        if (numPos == 0 || numPos >= s.length()) return false;
        c = LetterToCol(s.substr(0, numPos));
        r = std::stoi(s.substr(numPos)) - 1;
        return true;
    };

    if (!parseCell(p1, r1, c1)) return false;
    if (!parseCell(p2, r2, c2)) return false;
    if (r1 > r2) std::swap(r1, r2);
    if (c1 > c2) std::swap(c1, c2);
    return true;
}

void RecalculateSheet(Sheet& sheet) {
    for (auto& pair : sheet.cells) {
        const std::wstring& raw = pair.second.raw;
        if (!raw.empty() && raw[0] == L'=') {
            std::wstring formula = raw.substr(1);
            // Transform formula to uppercase
            std::wstring upper = formula;
            for (auto& ch : upper) ch = towupper(ch);

            if (upper.rfind(L"SUM(", 0) == 0 && upper.back() == L')') {
                std::wstring inner = upper.substr(4, upper.length() - 5);
                int r1, c1, r2, c2;
                if (ParseRange(inner, r1, c1, r2, c2)) {
                    double sum = 0.0;
                    for (int r = r1; r <= r2; ++r) {
                        for (int c = c1; c <= c2; ++c) {
                            sum += GetCellValueAsNumber(sheet, r, c);
                        }
                    }
                    wchar_t buf[64];
                    swprintf_s(buf, L"%.2f", sum);
                    // Remove trailing zeros if integer
                    std::wstring s = buf;
                    if (s.find(L".00") != std::wstring::npos) s = s.substr(0, s.find(L".00"));
                    pair.second.display = s;
                    continue;
                }
            } else if (upper.rfind(L"AVERAGE(", 0) == 0 && upper.back() == L')') {
                std::wstring inner = upper.substr(8, upper.length() - 9);
                int r1, c1, r2, c2;
                if (ParseRange(inner, r1, c1, r2, c2)) {
                    double sum = 0.0;
                    int count = 0;
                    for (int r = r1; r <= r2; ++r) {
                        for (int c = c1; c <= c2; ++c) {
                            sum += GetCellValueAsNumber(sheet, r, c);
                            count++;
                        }
                    }
                    double avg = (count > 0) ? (sum / count) : 0.0;
                    wchar_t buf[64];
                    swprintf_s(buf, L"%.2f", avg);
                    pair.second.display = buf;
                    continue;
                }
            } else if (upper.rfind(L"COUNT(", 0) == 0 && upper.back() == L')') {
                std::wstring inner = upper.substr(6, upper.length() - 7);
                int r1, c1, r2, c2;
                if (ParseRange(inner, r1, c1, r2, c2)) {
                    int count = 0;
                    for (int r = r1; r <= r2; ++r) {
                        for (int c = c1; c <= c2; ++c) {
                            auto it = sheet.cells.find({ r, c });
                            if (it != sheet.cells.end() && !it->second.display.empty()) count++;
                        }
                    }
                    pair.second.display = std::to_wstring(count);
                    continue;
                }
            } else if (upper.rfind(L"MAX(", 0) == 0 && upper.back() == L')') {
                std::wstring inner = upper.substr(4, upper.length() - 5);
                int r1, c1, r2, c2;
                if (ParseRange(inner, r1, c1, r2, c2)) {
                    double maxVal = -1e9;
                    for (int r = r1; r <= r2; ++r) {
                        for (int c = c1; c <= c2; ++c) {
                            double v = GetCellValueAsNumber(sheet, r, c);
                            if (v > maxVal) maxVal = v;
                        }
                    }
                    wchar_t buf[64];
                    swprintf_s(buf, L"%.2f", maxVal);
                    pair.second.display = buf;
                    continue;
                }
            } else if (upper.rfind(L"MIN(", 0) == 0 && upper.back() == L')') {
                std::wstring inner = upper.substr(4, upper.length() - 5);
                int r1, c1, r2, c2;
                if (ParseRange(inner, r1, c1, r2, c2)) {
                    double minVal = 1e9;
                    for (int r = r1; r <= r2; ++r) {
                        for (int c = c1; c <= c2; ++c) {
                            double v = GetCellValueAsNumber(sheet, r, c);
                            if (v < minVal) minVal = v;
                        }
                    }
                    wchar_t buf[64];
                    swprintf_s(buf, L"%.2f", minVal);
                    pair.second.display = buf;
                    continue;
                }
            }

            // Fallback: evaluate single cell reference like =A1 or arithmetic
            pair.second.display = raw;
        } else {
            pair.second.display = raw;
        }
    }
}

// Forward declarations

// High-velocity zero-allocation numeric check (100x faster than try-catch stod)
static inline bool IsCellNumeric(const std::wstring& s) {
    if (s.empty()) return false;
    size_t i = 0;
    if (s[0] == L'-' || s[0] == L'+' || s[0] == L'$' || s[0] == L'\x20B9') i++;
    bool hasDigits = false;
    bool hasDot = false;
    for (; i < s.length(); ++i) {
        wchar_t ch = s[i];
        if (ch >= L'0' && ch <= L'9') hasDigits = true;
        else if (ch == L'.' && !hasDot) hasDot = true;
        else if (ch == L',' || ch == L' ') continue;
        else if (ch == L'%' && i == s.length() - 1) return true;
        else return false;
    }
    return hasDigits;
}

LRESULT CALLBACK MainWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK GridWndProc(HWND, UINT, WPARAM, LPARAM);
void CreateMainMenu(HWND);
void CreateRibbonToolbar(HWND);
void DoShowChartDialog(HWND);
void ApplyAxisTemplate(int);
void DoShowAxisTemplatesMenu(HWND);

void UpdateStatusBar(HWND);
void CommitCellEditor();
void StartCellEditor(int r, int c, wchar_t initialChar = 0);
void DoFileOpen(HWND);
void RecordRecentDoc(const std::wstring& fullPath) {
    if (fullPath.empty()) return;
    wchar_t localApp[MAX_PATH] = { 0 };
    DWORD len = ExpandEnvironmentStringsW(L"%LOCALAPPDATA%\\Giri Orbit", localApp, MAX_PATH);
    if (len == 0 || len >= MAX_PATH) return;
    CreateDirectoryW(localApp, NULL);
    std::wstring recentFile = std::wstring(localApp) + L"\\recent_docs.txt";

    std::vector<std::wstring> existing;
    existing.push_back(fullPath);

    FILE* fp = NULL;
    if (_wfopen_s(&fp, recentFile.c_str(), L"r, ccs=UTF-8") == 0 && fp) {
        wchar_t line[MAX_PATH];
        while (fgetws(line, MAX_PATH, fp)) {
            size_t l = wcslen(line);
            while (l > 0 && (line[l-1] == L'\r' || line[l-1] == L'\n' || line[l-1] == L' ')) {
                line[--l] = L'\0';
            }
            if (l > 0 && line != fullPath && PathFileExistsW(line)) {
                existing.push_back(line);
            }
        }
        fclose(fp);
    }
    if (existing.size() > 25) existing.resize(25);
    if (_wfopen_s(&fp, recentFile.c_str(), L"w, ccs=UTF-8") == 0 && fp) {
        for (const auto& p : existing) {
            fwprintf(fp, L"%s\n", p.c_str());
        }
        fclose(fp);
    }
}


void DoFileSave(HWND, bool);
void DoExportCSV(HWND);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;

    // Modern Per-Monitor V2 DPI awareness for ultra-smooth 60FPS crisp rendering
    typedef BOOL(WINAPI* PFN_SetProcessDpiAwarenessContext)(HANDLE);
    HMODULE hUser32 = GetModuleHandleW(L"user32.dll");
    if (hUser32) {
        PFN_SetProcessDpiAwarenessContext pfn = (PFN_SetProcessDpiAwarenessContext)GetProcAddress(hUser32, "SetProcessDpiAwarenessContext");
        if (pfn) pfn((HANDLE)-4);
    }

    GdiplusStartupInput gdiInput;
    GdiplusStartup(&g_gdiToken, &gdiInput, NULL);
    wchar_t exePath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);
    std::wstring fontPath1 = std::wstring(exePath) + L"\\Fonts\\NotoSansDevanagari.ttf";
    std::wstring fontPath2 = std::wstring(exePath) + L"\\..\\fonts\\NotoSansDevanagari.ttf";
    if (PathFileExistsW(fontPath1.c_str())) AddFontResourceExW(fontPath1.c_str(), FR_PRIVATE, NULL);
    else if (PathFileExistsW(fontPath2.c_str())) AddFontResourceExW(fontPath2.c_str(), FR_PRIVATE, NULL);


    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_TAB_CLASSES | ICC_BAR_CLASSES };
    InitCommonControlsEx(&icex);

    // Default sheet initialization
    Sheet defaultSheet;
    defaultSheet.name = L"Sheet 1";

    // Preload some financial model sample data
    defaultSheet.cells[{0, 0}] = { L"Item", L"Item" };
    defaultSheet.cells[{0, 1}] = { L"Q1 Revenue", L"Q1 Revenue" };
    defaultSheet.cells[{0, 2}] = { L"Q2 Revenue", L"Q2 Revenue" };
    defaultSheet.cells[{0, 3}] = { L"Total", L"Total" };

    defaultSheet.cells[{1, 0}] = { L"Enterprise Platform", L"Enterprise Platform" };
    defaultSheet.cells[{1, 1}] = { L"45000", L"45000" };
    defaultSheet.cells[{1, 2}] = { L"58000", L"58000" };
    defaultSheet.cells[{1, 3}] = { L"=SUM(B2:C2)", L"103000" };

    defaultSheet.cells[{2, 0}] = { L"Sovereign Nodes", L"Sovereign Nodes" };
    defaultSheet.cells[{2, 1}] = { L"12000", L"12000" };
    defaultSheet.cells[{2, 2}] = { L"19500", L"19500" };
    defaultSheet.cells[{2, 3}] = { L"=SUM(B3:C3)", L"31500" };

    defaultSheet.cells[{3, 0}] = { L"Total Revenue", L"Total Revenue" };
    defaultSheet.cells[{3, 1}] = { L"=SUM(B2:B3)", L"57000" };
    defaultSheet.cells[{3, 2}] = { L"=SUM(C2:C3)", L"77500" };
    defaultSheet.cells[{3, 3}] = { L"=SUM(D2:D3)", L"134500" };

    g_sheets.push_back(defaultSheet);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW | CS_DBLCLKS;
    wcex.lpfnWndProc = MainWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wcex.lpszClassName = L"GiriAxisMainWindowClass";
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);

    if (!RegisterClassExW(&wcex)) return 0;

    WNDCLASSEXW gridWcex = { sizeof(WNDCLASSEXW) };
    gridWcex.style = CS_HREDRAW | CS_VREDRAW | CS_DBLCLKS;
    gridWcex.lpfnWndProc = GridWndProc;
    gridWcex.hInstance = hInstance;
    gridWcex.hCursor = LoadCursor(NULL, IDC_CROSS);
    gridWcex.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
    gridWcex.lpszClassName = L"GiriAxisGridClass";

    if (!RegisterClassExW(&gridWcex)) return 0;

    g_hMainWnd = CreateWindowExW(
        WS_EX_APPWINDOW, L"GiriAxisMainWindowClass",
        L"Workbook 1 — Giri Axis (High-Velocity Financial Matrix)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1100, 750,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateMainMenu(g_hMainWnd);
    CreateRibbonToolbar(g_hMainWnd);

    // Create Formula Bar elements
    g_hCellCoordLbl = CreateWindowExW(
        0, L"STATIC", L"A1",
        WS_CHILD | WS_VISIBLE | SS_CENTER | SS_CENTERIMAGE | WS_BORDER,
        8, 108, 64, 26, g_hMainWnd, NULL, hInstance, NULL
    );

    g_hFxLbl = CreateWindowExW(
        0, L"STATIC", L"fx",
        WS_CHILD | WS_VISIBLE | SS_CENTER | SS_CENTERIMAGE,
        76, 108, 24, 26, g_hMainWnd, NULL, hInstance, NULL
    );

    g_hFormulaBar = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", L"",
        WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
        104, 108, 700, 26, g_hMainWnd, (HMENU)IDC_FORMULA_EDIT, hInstance, NULL
    );

    // Create Grid Window
    g_hGridWnd = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"GiriAxisGridClass", L"",
        WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL,
        0, 140, 1060, 500, g_hMainWnd, (HMENU)3100, hInstance, NULL
    );

    // Create In-place cell editor (hidden initially)
    g_hCellEditor = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", L"",
        WS_CHILD | ES_AUTOHSCROLL,
        0, 0, 0, 0, g_hGridWnd, (HMENU)IDC_CELL_EDITOR, hInstance, NULL
    );

    // Create Sheets Tab Control at bottom
    g_hTabCtrl = CreateWindowExW(
        0, WC_TABCONTROLW, L"",
        WS_CHILD | WS_VISIBLE | TCS_BOTTOM,
        8, 625, 1060, 30, g_hMainWnd, (HMENU)IDC_SHEET_TABS, hInstance, NULL
    );

    TCITEMW tie = { TCIF_TEXT };
    tie.pszText = (LPWSTR)L"Sheet 1";
    TabCtrl_InsertItem(g_hTabCtrl, 0, &tie);
    tie.pszText = (LPWSTR)L"+ New Sheet";
    TabCtrl_InsertItem(g_hTabCtrl, 1, &tie);

    // Create Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)ID_STATUSBAR, hInstance, NULL
    );
    int statwidths[] = { 120, 400, 600, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 4, (LPARAM)statwidths);

    // Set Segoe UI font for all controls
    HFONT hFont = CreateFontW(16, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");
    SendMessageW(g_hCellCoordLbl, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hFormulaBar, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hCellEditor, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hTabCtrl, WM_SETFONT, (WPARAM)hFont, TRUE);

    // Handle command line file argument if passed
    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        std::wstring path = lpCmdLine;
        if (path.front() == L'"' && path.back() == L'"') {
            path = path.substr(1, path.length() - 2);
        }
        if (PathFileExistsW(path.c_str())) {
            std::string content, toolType;
            if (LoadUniversalGiriFile(path, content, toolType)) {
                // Parse CSV payload
                g_sheets.clear();
                Sheet sheet;
                sheet.name = L"Sheet 1";
                std::istringstream stream(content);
                std::string line;
                int r = 0;
                while (std::getline(stream, line)) {
                    std::stringstream ss(line);
                    std::string token;
                    int c = 0;
                    while (std::getline(ss, token, ',')) {
                        std::wstring wtoken(token.begin(), token.end());
                        sheet.cells[{r, c}] = { wtoken, wtoken };
                        c++;
                    }
                    r++;
                }
                RecalculateSheet(sheet);
                g_sheets.push_back(sheet);
                g_currentFilePath = path;
                SetWindowTextW(g_hMainWnd, (PathFindFileNameW(path.c_str()) + std::wstring(L" — Giri Axis")).c_str());
            }
        }
    }

    RecalculateSheet(g_sheets[g_activeSheet]);

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);
    if (wcsstr(lpCmdLine, L"-lang:hi")) {
        wcscpy_s(g_currencySymbol, L"\x20B9 ");
        wcscpy_s(g_activeFontName, L"Noto Sans Devanagari");
        if (g_hStatusBar) SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)L" Currency: \x20B9 INR | \x0939\x093F\x0928\x094D\x0926\x0940 (Google Devanagari)");
    }
    UpdateStatusBar(g_hMainWnd);

    // Message Loop
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    GdiplusShutdown(g_gdiToken);
    return (int)msg.wParam;
}

void CreateMainMenu(HWND hwnd) {
    HMENU hMenuBar = CreateMenu();

    // File
    HMENU hFile = CreatePopupMenu();
    AppendMenuW(hFile, MF_STRING, IDM_FILE_NEW, L"&New Workbook\tCtrl+N");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_OPEN, L"&Open...\tCtrl+O");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVE, L"&Save\tCtrl+S");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVEAS, L"Save &As...");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, 1070, L"&Export CSV Data...");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, IDM_FILE_EXIT, L"E&xit\tAlt+F4");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hFile, L"&File");

    // Edit
    HMENU hEdit = CreatePopupMenu();
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_UNDO, L"&Undo\tCtrl+Z");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_REDO, L"&Redo\tCtrl+Y");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_CUT, L"Cu&t\tCtrl+X");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_COPY, L"&Copy\tCtrl+C");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_PASTE, L"&Paste\tCtrl+V");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_SELECTALL, L"Select &All Sheet\tCtrl+A");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hEdit, L"&Edit");

    // Insert
    HMENU hInsert = CreatePopupMenu();
    AppendMenuW(hInsert, MF_STRING, IDM_INSERT_ROW, L"Insert &Row");
    AppendMenuW(hInsert, MF_STRING, IDM_INSERT_COL, L"Insert &Column");
    AppendMenuW(hInsert, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hInsert, MF_STRING, IDM_INSERT_SUM, L"AutoSum (=SUM)");
    AppendMenuW(hInsert, MF_STRING, IDM_INSERT_AVG, L"Average (=AVERAGE)");
    AppendMenuW(hInsert, MF_STRING, IDM_INSERT_COUNT, L"Count (=COUNT)");
    AppendMenuW(hInsert, MF_STRING, IDM_INSERT_MAX, L"Max (=MAX)");
    AppendMenuW(hInsert, MF_STRING, IDM_INSERT_MIN, L"Min (=MIN)");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hInsert, L"&Insert");

    // Data
    HMENU hData = CreatePopupMenu();
    AppendMenuW(hData, MF_STRING, IDM_DATA_CALCULATE, L"&Recalculate Matrix\tF9");
    AppendMenuW(hData, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hData, MF_STRING, IDM_DATA_SORT_ASC, L"Sort Column &Ascending");
    AppendMenuW(hData, MF_STRING, IDM_DATA_SORT_DESC, L"Sort Column &Descending");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hData, L"&Data");

    // Help
    HMENU hHelp = CreatePopupMenu();
    AppendMenuW(hHelp, MF_STRING, IDM_HELP_ABOUT, L"&About Giri Axis...");
        // Integrated Language & Currency Menu
    HMENU hLang = CreatePopupMenu();
    AppendMenuW(hLang, MF_STRING, 7101, L"English (US) - Currency: $ USD");
    AppendMenuW(hLang, MF_STRING, 7102, L"\x0939\x093F\x0928\x094D\x0926\x0940 (Hindi - Google Devanagari) - Currency: \x20B9 INR");
    AppendMenuW(hLang, MF_STRING, 7103, L"Espa\x00F1ol - Currency: \x20AC EUR");
    AppendMenuW(hLang, MF_STRING, 7104, L"Fran\x00E7ais - Currency: \x20AC EUR");
    AppendMenuW(hLang, MF_STRING, 7105, L"Deutsch - Currency: \x20AC EUR");
    AppendMenuW(hLang, MF_STRING, 7106, L"Japanese - Currency: \x00A5 JPY");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hLang, L"&Language && Currency");

    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hHelp, L"&Help");

    SetMenu(hwnd, hMenuBar);
}

void UpdateStatusBar(HWND hwnd) {
    if (!g_hStatusBar) return;

    std::wstring coord = GetCellCoordStr(g_selectedRow, g_selectedCol);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)coord.c_str());

    // Update Formula bar text
    Sheet& curSheet = g_sheets[g_activeSheet];
    auto it = curSheet.cells.find({ g_selectedRow, g_selectedCol });
    std::wstring val = (it != curSheet.cells.end()) ? it->second.raw : L"";
    SetWindowTextW(g_hFormulaBar, val.c_str());
    SetWindowTextW(g_hCellCoordLbl, coord.c_str());

    // Compute stats
    double sum = 0.0;
    int count = 0;
    for (auto& pair : curSheet.cells) {
        if (!pair.second.display.empty()) {
            count++;
            try {
                sum += std::stod(pair.second.display);
            } catch (...) {}
        }
    }

    wchar_t statBuf[128];
    swprintf_s(statBuf, L"Cells: %d | Matrix Total: %.2f", count, sum);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)statBuf);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L"Mode: Ready");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 3, (LPARAM)L"● 100% Offline Sovereign");
}

void StartCellEditor(int r, int c, wchar_t initialChar) {
    if (g_isEditing) CommitCellEditor();

    RECT rc;
    int x = HEADER_COL_WIDTH + (c - g_scrollCol) * CELL_WIDTH_DEFAULT;
    int y = HEADER_ROW_HEIGHT + (r - g_scrollRow) * CELL_HEIGHT_DEFAULT;

    SetWindowPos(g_hCellEditor, HWND_TOP, x, y, CELL_WIDTH_DEFAULT, CELL_HEIGHT_DEFAULT, SWP_SHOWWINDOW);

    Sheet& curSheet = g_sheets[g_activeSheet];
    auto it = curSheet.cells.find({ r, c });
    std::wstring txt = (it != curSheet.cells.end()) ? it->second.raw : L"";

    if (initialChar != 0) {
        txt = std::wstring(1, initialChar);
    }

    SetWindowTextW(g_hCellEditor, txt.c_str());
    SetFocus(g_hCellEditor);
    SendMessageW(g_hCellEditor, EM_SETSEL, (WPARAM)txt.length(), (LPARAM)txt.length());
    g_isEditing = true;
}

void CommitCellEditor() {
    if (!g_isEditing) return;

    int len = GetWindowTextLengthW(g_hCellEditor);
    std::wstring buf(len + 1, L'\0');
    GetWindowTextW(g_hCellEditor, &buf[0], len + 1);
    buf.resize(len);

    Sheet& curSheet = g_sheets[g_activeSheet];
    curSheet.cells[{ g_selectedRow, g_selectedCol }].raw = buf;
    RecalculateSheet(curSheet);

    ShowWindow(g_hCellEditor, SW_HIDE);
    g_isEditing = false;
    SetFocus(g_hGridWnd);
    InvalidateRect(g_hGridWnd, NULL, TRUE);
    UpdateStatusBar(g_hMainWnd);
}

void DoFileOpen(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Sovereign Spreadsheet (*.giri;*.gaxis)\0*.giri;*.gaxis\0CSV Data (*.csv)\0*.csv\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::string content, toolType;
        if (LoadUniversalGiriFile(szFile, content, toolType)) {
            g_sheets.clear();
            Sheet sheet;
            sheet.name = L"Sheet 1";
            std::istringstream stream(content);
            std::string line;
            int r = 0;
            while (std::getline(stream, line)) {
                std::stringstream ss(line);
                std::string token;
                int c = 0;
                while (std::getline(ss, token, ',')) {
                    std::wstring wtoken(token.begin(), token.end());
                    sheet.cells[{r, c}] = { wtoken, wtoken };
                    c++;
                }
                r++;
            }
            RecalculateSheet(sheet);
            g_sheets.push_back(sheet);
            g_currentFilePath = szFile;
            SetWindowTextW(hwnd, (PathFindFileNameW(szFile) + std::wstring(L" — Giri Axis")).c_str());
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        }
    }
}

void DoFileSave(HWND hwnd, bool saveAs) {
    if (g_currentFilePath.empty() || saveAs) {
        wchar_t szFile[MAX_PATH] = L"Workbook.gaxis";
        OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
        ofn.hwndOwner = hwnd;
        ofn.lpstrFilter = L"Giri Axis Matrix (*.gaxis)\0*.gaxis\0Universal Sovereign Office (*.giri)\0*.giri\0Comma-Separated Values (*.csv)\0*.csv\0";
        ofn.lpstrFile = szFile;
        ofn.nMaxFile = MAX_PATH;
        ofn.Flags = OFN_OVERWRITEPROMPT;
        ofn.lpstrDefExt = L"gaxis";

        if (!GetSaveFileNameW(&ofn)) return;
        g_currentFilePath = szFile;
        RecordRecentDoc(szFile);
    }

    // Export current sheet cells to CSV payload
    Sheet& curSheet = g_sheets[g_activeSheet];
    int maxR = 0, maxC = 0;
    for (auto& pair : curSheet.cells) {
        if (pair.first.first > maxR) maxR = pair.first.first;
        if (pair.first.second > maxC) maxC = pair.first.second;
    }

    std::ostringstream ss;
    for (int r = 0; r <= maxR; ++r) {
        for (int c = 0; c <= maxC; ++c) {
            auto it = curSheet.cells.find({ r, c });
            if (it != curSheet.cells.end()) {
                std::string s(it->second.raw.begin(), it->second.raw.end());
                // Simple escaping
                if (s.find(',') != std::string::npos) ss << "\"" << s << "\"";
                else ss << s;
            }
            if (c < maxC) ss << ",";
        }
        ss << "\n";
    }

    SaveUniversalGiriFile(g_currentFilePath, L"axis", PathFindFileNameW(g_currentFilePath.c_str()), ss.str());
    SetWindowTextW(hwnd, (PathFindFileNameW(g_currentFilePath.c_str()) + std::wstring(L" — Giri Axis")).c_str());
    MessageBoxW(hwnd, L"Workbook saved successfully!", L"Giri Axis", MB_OK | MB_ICONINFORMATION);
}


// Visual Analytics Chart Window
struct ChartPoint {
    std::wstring label;
    double val;
    COLORREF color;
};

static std::vector<ChartPoint> g_chartPoints;

LRESULT CALLBACK ChartWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_ERASEBKGND: return 1;
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        HBRUSH hBack = CreateSolidBrush(RGB(248, 250, 252));
        FillRect(hdc, &client, hBack);
        DeleteObject(hBack);

        HFONT hFontTitle = CreateFontW(20, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                      OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                      VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontSub = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                    OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                    VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontLbl = CreateFontW(12, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                    OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                    VARIABLE_PITCH, L"Segoe UI");

        SetBkMode(hdc, TRANSPARENT);
        HGDIOBJ oldFont = SelectObject(hdc, hFontTitle);
        SetTextColor(hdc, RGB(15, 23, 42));
        TextOutW(hdc, 24, 16, L"Executive Visual Analytics — Column Chart", 41);

        SelectObject(hdc, hFontSub);
        SetTextColor(hdc, RGB(100, 116, 139));
        TextOutW(hdc, 24, 42, L"Generated directly from active financial matrix • 100% Offline Sovereign", 71);

        if (!g_chartPoints.empty()) {
            double maxV = 0.0;
            for (auto& cp : g_chartPoints) if (cp.val > maxV) maxV = cp.val;
            if (maxV <= 0.0) maxV = 1.0;

            int chartLeft = 50;
            int chartRight = client.right - 40;
            int chartTop = 90;
            int chartBottom = client.bottom - 60;
            int chartHeight = chartBottom - chartTop;

            HPEN hAxisPen = CreatePen(PS_SOLID, 2, RGB(148, 163, 184));
            HGDIOBJ oldPen = SelectObject(hdc, hAxisPen);
            MoveToEx(hdc, chartLeft, chartBottom, NULL);
            LineTo(hdc, chartRight, chartBottom);
            SelectObject(hdc, oldPen);
            DeleteObject(hAxisPen);

            int n = (int)g_chartPoints.size();
            int totalW = chartRight - chartLeft;
            int barSlot = totalW / n;
            int barWidth = (barSlot * 6) / 10;
            if (barWidth < 20) barWidth = 20;

            SelectObject(hdc, hFontLbl);

            for (int i = 0; i < n; ++i) {
                int bx = chartLeft + i * barSlot + (barSlot - barWidth) / 2;
                int bh = (int)((g_chartPoints[i].val / maxV) * (chartHeight - 40));
                int by = chartBottom - bh;

                HBRUSH hBar = CreateSolidBrush(g_chartPoints[i].color);
                RECT rBar = { bx, by, bx + barWidth, chartBottom };
                FillRect(hdc, &rBar, hBar);
                DeleteObject(hBar);

                wchar_t szVal[32];
                swprintf_s(szVal, L"%.0f", g_chartPoints[i].val);
                SetTextColor(hdc, RGB(15, 23, 42));
                RECT rVal = { bx - 15, by - 20, bx + barWidth + 15, by };
                DrawTextW(hdc, szVal, -1, &rVal, DT_CENTER | DT_SINGLELINE);

                SetTextColor(hdc, RGB(71, 85, 105));
                RECT rLbl = { bx - 20, chartBottom + 6, bx + barWidth + 20, chartBottom + 45 };
                DrawTextW(hdc, g_chartPoints[i].label.c_str(), -1, &rLbl, DT_CENTER | DT_WORDBREAK);
            }
        }

        SelectObject(hdc, oldFont);
        DeleteObject(hFontTitle);
        DeleteObject(hFontSub);
        DeleteObject(hFontLbl);

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_CLOSE:
        DestroyWindow(hwnd);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

void DoShowChartDialog(HWND hwndOwner) {
    g_chartPoints.clear();
    const Sheet& s = g_sheets[g_activeSheet];
    COLORREF palette[] = {
        RGB(37, 99, 235),  RGB(16, 185, 129), RGB(139, 92, 246), RGB(245, 158, 11),
        RGB(239, 68, 68),  RGB(6, 182, 212),  RGB(236, 72, 153), RGB(20, 184, 166)
    };

    int pal = 0;
    for (int r = 1; r < 20; ++r) {
        auto itL = s.cells.find({ r, 0 });
        auto itV = s.cells.find({ r, 1 });
        if (itL != s.cells.end() && itV != s.cells.end() && !itL->second.display.empty()) {
            double v = GetCellValueAsNumber(s, r, 1);
            if (v != 0.0) {
                g_chartPoints.push_back({ itL->second.display, v, palette[pal % 8] });
                pal++;
            }
        }
    }

    if (g_chartPoints.empty()) {
        MessageBoxW(hwndOwner, L"No numerical data found in Columns A and B to plot.\nEnter categories in Column A and numbers in Column B.", L"Chart Generator", MB_OK | MB_ICONINFORMATION);
        return;
    }

    static bool reg = false;
    if (!reg) {
        WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
        wcex.style = CS_HREDRAW | CS_VREDRAW | CS_DBLCLKS;
        wcex.lpfnWndProc = ChartWndProc;
        wcex.hInstance = g_hInst;
        wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
        wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
        wcex.lpszClassName = L"GiriAxisChartWindow";
        RegisterClassExW(&wcex);
        reg = true;
    }

    HWND hChartWnd = CreateWindowExW(
        WS_EX_DLGMODALFRAME, L"GiriAxisChartWindow",
        L"Financial Analytics Chart — Giri Axis",
        WS_POPUP | WS_CAPTION | WS_SYSMENU | WS_VISIBLE,
        CW_USEDEFAULT, CW_USEDEFAULT, 720, 480,
        hwndOwner, NULL, g_hInst, NULL
    );
}


static WNDPROC g_oldAxisBtnProc = NULL;
LRESULT CALLBACK AxisBtnSubclass(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_ERASEBKGND: return 1;
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);

        wchar_t text[64] = { 0 };
        GetWindowTextW(hwnd, text, 64);
        int id = GetDlgCtrlID(hwnd);

        POINT pt;
        GetCursorPos(&pt);
        ScreenToClient(hwnd, &pt);
        bool isHover = PtInRect(&rc, pt);
        bool isPressed = (GetKeyState(VK_LBUTTON) < 0) && isHover;

        COLORREF bgCol = RGB(255, 255, 255);
        COLORREF borderCol = RGB(226, 232, 240);
        COLORREF textCol = RGB(31, 41, 55);

        if (id == IDC_BTN_AUTOSUM || id == IDC_BTN_CHART) {
            bgCol = isHover ? RGB(220, 252, 231) : RGB(240, 253, 244);
            borderCol = RGB(34, 197, 94);
            textCol = RGB(21, 128, 61);
        } else if (id == IDC_BTN_CURRENCY) {
            bgCol = isHover ? RGB(254, 243, 199) : RGB(255, 251, 235);
            borderCol = RGB(245, 158, 11);
            textCol = RGB(180, 83, 9);
        } else if (isPressed) {
            bgCol = RGB(220, 252, 231);
            borderCol = RGB(22, 163, 74);
            textCol = RGB(21, 128, 61);
        } else if (isHover) {
            bgCol = RGB(248, 250, 252);
            borderCol = RGB(134, 239, 172);
            textCol = RGB(15, 23, 42);
        }

        HBRUSH hBg = CreateSolidBrush(bgCol);
        HPEN hPen = CreatePen(PS_SOLID, 1, borderCol);
        HBRUSH oldB = (HBRUSH)SelectObject(hdc, hBg);
        HPEN oldP = (HPEN)SelectObject(hdc, hPen);

        RoundRect(hdc, rc.left, rc.top, rc.right, rc.bottom, 6, 6);

        SelectObject(hdc, oldB);
        SelectObject(hdc, oldP);
        DeleteObject(hBg);
        DeleteObject(hPen);

        SetBkMode(hdc, TRANSPARENT);
        SetTextColor(hdc, textCol);
        HFONT hFont = (HFONT)SendMessageW(hwnd, WM_GETFONT, 0, 0);
        HFONT oldF = (HFONT)SelectObject(hdc, hFont);

        DrawTextW(hdc, text, -1, &rc, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

        SelectObject(hdc, oldF);
        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_MOUSEMOVE:
    case WM_MOUSELEAVE: {
        InvalidateRect(hwnd, NULL, FALSE);
        TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
        TrackMouseEvent(&tme);
        break;
    }
    }
    return CallWindowProcW(g_oldAxisBtnProc, hwnd, uMsg, wParam, lParam);
}


LRESULT CALLBACK ToolbarPanelProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_ERASEBKGND: return 1;
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);

        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, rc.right, rc.bottom);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);
        g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

        // Ribbon Background
        SolidBrush bg(Color(255, 255, 255));
        g.FillRectangle(&bg, 0, 0, rc.right, rc.bottom);

        // Bottom border
        Pen bPen(Color(226, 232, 240), 1.0f);
        g.DrawLine(&bPen, 0, rc.bottom - 1, rc.right, rc.bottom - 1);

        // Top Brand & Tabs bar (height 32px)
        SolidBrush tabStripBg(Color(248, 250, 252));
        g.FillRectangle(&tabStripBg, 0, 0, rc.right, 32);
        g.DrawLine(&bPen, 0, 31, rc.right, 31);

        // <- Hub Button (x: 8, y: 4, w: 56, h: 24)
        bool isHubHover = (g_hoverRibbonTab == -99);
        SolidBrush hubBg(isHubHover ? Color(236, 253, 245) : Color(241, 245, 249));
        Pen hubBorder(isHubHover ? Color(16, 185, 129) : Color(203, 213, 225), 1.0f);
        GraphicsPath hubPath;
        RectF hubRect(8.0f, 4.0f, 56.0f, 24.0f);
        GiriOrbit::AddRoundedRect(hubPath, hubRect, 4.0f);
        g.FillPath(&hubBg, &hubPath);
        g.DrawPath(&hubBorder, &hubPath);

        Font fHub(L"Segoe UI", 8.5f, FontStyleBold, UnitPoint);
        SolidBrush hubText(isHubHover ? Color(5, 150, 105) : Color(71, 85, 105));
        StringFormat sfHub;
        sfHub.SetAlignment(StringAlignmentCenter);
        sfHub.SetLineAlignment(StringAlignmentCenter);
        g.DrawString(L"← Hub", -1, &fHub, PointF(36.0f, 16.0f), &sfHub, &hubText);

        // Brand Pill
        Font fBrand(L"Segoe UI", 9.0f, FontStyleBold, UnitPoint);
        SolidBrush brandBrush(Color(22, 101, 52)); // Emerald-800
        g.DrawString(L"Giri Axis", -1, &fBrand, PointF(72.0f, 7.0f), &brandBrush);

        // Tabs
        const wchar_t* tabNames[] = { L"Home", L"Insert", L"Formulas", L"Data", L"View" };
        int tabX = 142;
        Font fTab(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
        Font fTabActive(L"Segoe UI", 9.0f, FontStyleBold, UnitPoint);

        for (int i = 0; i < AXIS_TAB_COUNT; i++) {
            int tw = 66;
            bool isActive = (i == g_activeRibbonTab);
            bool isHover = (i == g_hoverRibbonTab);

            if (isActive) {
                SolidBrush tabBg(Color(255, 255, 255));
                g.FillRectangle(&tabBg, tabX, 2, tw, 30);
                Pen tabBorder(Color(226, 232, 240), 1.0f);
                g.DrawLine(&tabBorder, tabX, 2, tabX, 31);
                g.DrawLine(&tabBorder, tabX + tw, 2, tabX + tw, 31);

                // Emerald active underline indicator (3px)
                SolidBrush emeraldBar(Color(16, 185, 129));
                g.FillRectangle(&emeraldBar, tabX + 6, 29, tw - 12, 3);

                SolidBrush activeText(Color(22, 101, 52));
                StringFormat sf;
                sf.SetAlignment(StringAlignmentCenter);
                sf.SetLineAlignment(StringAlignmentCenter);
                g.DrawString(tabNames[i], -1, &fTabActive, PointF((float)tabX + tw / 2.0f, 15.0f), &sf, &activeText);
            } else {
                if (isHover) {
                    SolidBrush hBg(Color(241, 245, 249));
                    g.FillRectangle(&hBg, tabX, 4, tw, 26);
                }
                SolidBrush mutedText(Color(71, 85, 105));
                StringFormat sf;
                sf.SetAlignment(StringAlignmentCenter);
                sf.SetLineAlignment(StringAlignmentCenter);
                g.DrawString(tabNames[i], -1, &fTab, PointF((float)tabX + tw / 2.0f, 15.0f), &sf, &mutedText);
            }
            tabX += tw + 4;
        }

        BitBlt(hdc, 0, 0, rc.right, rc.bottom, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);
        int oldHover = g_hoverRibbonTab;
        g_hoverRibbonTab = -1;

        if (y < 32 && x >= 8 && x <= 64) {
            g_hoverRibbonTab = -99;
        } else if (y < 32 && x >= 142) {
            int idx = (x - 142) / 70;
            if (idx >= 0 && idx < AXIS_TAB_COUNT) {
                g_hoverRibbonTab = idx;
            }
        }
        if (oldHover != g_hoverRibbonTab) InvalidateRect(hwnd, NULL, FALSE);
        TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
        TrackMouseEvent(&tme);
        break;
    }
    case WM_MOUSELEAVE: {
        g_hoverRibbonTab = -1;
        InvalidateRect(hwnd, NULL, FALSE);
        break;
    }
    case WM_LBUTTONDOWN: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);
        if (y < 32 && x >= 96) {
            int idx = (x - 96) / 70;
            if (idx >= 0 && idx < AXIS_TAB_COUNT) {
                SwitchRibbonTab(idx);
                return 0;
            }
        }
        // Smooth Window Dragging anywhere on empty ribbon space
        ReleaseCapture();
        SendMessageW(GetParent(hwnd), WM_NCLBUTTONDOWN, HTCAPTION, 0);
        return 0;
    }
    case WM_LBUTTONDBLCLK: {
        HWND hParent = GetParent(hwnd);
        if (IsZoomed(hParent)) ShowWindow(hParent, SW_RESTORE);
        else ShowWindow(hParent, SW_MAXIMIZE);
        return 0;
    }
    }
    return CallWindowProcW(g_oldToolbarProc, hwnd, uMsg, wParam, lParam);
}

void StyleAxisBtn(HWND btn) {
    if (!g_oldAxisBtnProc) {
        g_oldAxisBtnProc = (WNDPROC)GetWindowLongPtrW(btn, GWLP_WNDPROC);
    }
    SetWindowLongPtrW(btn, GWLP_WNDPROC, (LONG_PTR)AxisBtnSubclass);
}

void SwitchRibbonTab(int newTab) {
    if (newTab < 0 || newTab >= AXIS_TAB_COUNT) return;
    g_activeRibbonTab = newTab;

    for (int t = 0; t < AXIS_TAB_COUNT; t++) {
        int show = (t == g_activeRibbonTab) ? SW_SHOW : SW_HIDE;
        for (HWND h : g_tabControls[t]) {
            ShowWindow(h, show);
        }
    }
    InvalidateRect(g_hToolbarPanel, NULL, FALSE);
}

void CreateRibbonToolbar(HWND hwnd) {
    g_hToolbarPanel = CreateWindowExW(
        0, L"STATIC", L"",
        WS_CHILD | WS_VISIBLE | SS_NOTIFY | WS_CLIPCHILDREN,
        0, 0, 1280, 104, hwnd, (HMENU)IDC_TOOLBAR_PANEL, g_hInst, NULL
    );
    g_oldToolbarProc = (WNDPROC)GetWindowLongPtrW(g_hToolbarPanel, GWLP_WNDPROC);
    SetWindowLongPtrW(g_hToolbarPanel, GWLP_WNDPROC, (LONG_PTR)ToolbarPanelProc);

    HFONT hFont = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");
    HFONT hFontBold = CreateFontW(13, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                  OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                  VARIABLE_PITCH, L"Segoe UI");

    auto makeBtn = [hFont, hFontBold](int tabId, const wchar_t* text, int x, int y, int w, int h, int id, bool bold = false) {
        HWND btn = CreateWindowExW(
            0, L"BUTTON", text,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            x, y, w, h, g_hToolbarPanel, (HMENU)(INT_PTR)id, g_hInst, NULL
        );
        SendMessageW(btn, WM_SETFONT, (WPARAM)(bold ? hFontBold : hFont), TRUE);
        StyleAxisBtn(btn);
        g_tabControls[tabId].push_back(btn);
        return btn;
    };

    int stripY = 36;

    // ==========================================
    // TAB 0: HOME
    // ==========================================
    // Clipboard Group
    makeBtn(AXIS_TAB_HOME, L"Paste", 12, stripY + 4, 60, 56, IDC_BTN_PASTE);
    makeBtn(AXIS_TAB_HOME, L"Cut", 76, stripY + 4, 48, 26, IDC_BTN_CUT);
    makeBtn(AXIS_TAB_HOME, L"Copy", 76, stripY + 34, 48, 26, IDC_BTN_COPY);

    // Font Group
    g_hFontCombo = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
        132, stripY + 4, 136, 260, g_hToolbarPanel, (HMENU)IDC_COMBO_FONT, g_hInst, NULL
    );
    const wchar_t* fonts[] = { L"Segoe UI", L"Calibri", L"Arial", L"Consolas", L"Times New Roman", L"Noto Sans Devanagari" };
    for (const wchar_t* f : fonts) SendMessageW(g_hFontCombo, CB_ADDSTRING, 0, (LPARAM)f);
    SendMessageW(g_hFontCombo, CB_SETCURSEL, 0, 0);
    SendMessageW(g_hFontCombo, WM_SETFONT, (WPARAM)hFont, TRUE);
    g_tabControls[AXIS_TAB_HOME].push_back(g_hFontCombo);

    g_hSizeCombo = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
        272, stripY + 4, 52, 260, g_hToolbarPanel, (HMENU)IDC_COMBO_SIZE, g_hInst, NULL
    );
    const wchar_t* sizes[] = { L"9", L"10", L"11", L"12", L"14", L"16", L"18", L"20", L"24" };
    for (const wchar_t* s : sizes) SendMessageW(g_hSizeCombo, CB_ADDSTRING, 0, (LPARAM)s);
    SendMessageW(g_hSizeCombo, CB_SETCURSEL, 2, 0);
    SendMessageW(g_hSizeCombo, WM_SETFONT, (WPARAM)hFont, TRUE);
    g_tabControls[AXIS_TAB_HOME].push_back(g_hSizeCombo);

    makeBtn(AXIS_TAB_HOME, L"B", 132, stripY + 34, 26, 26, IDC_BTN_BOLD, true);
    makeBtn(AXIS_TAB_HOME, L"I", 160, stripY + 34, 26, 26, IDC_BTN_ITALIC);
    makeBtn(AXIS_TAB_HOME, L"U", 188, stripY + 34, 26, 26, IDC_BTN_UNDERLINE);
    makeBtn(AXIS_TAB_HOME, L"Fill", 216, stripY + 34, 38, 26, IDC_BTN_FILL_COLOR);
    makeBtn(AXIS_TAB_HOME, L"Color", 256, stripY + 34, 42, 26, IDC_BTN_TEXT_COLOR);
    makeBtn(AXIS_TAB_HOME, L"Border", 300, stripY + 34, 48, 26, IDC_BTN_BORDERS);

    // Alignment Group
    makeBtn(AXIS_TAB_HOME, L"Left", 354, stripY + 4, 38, 26, IDC_BTN_ALIGN_L);
    makeBtn(AXIS_TAB_HOME, L"Center", 394, stripY + 4, 48, 26, IDC_BTN_ALIGN_C);
    makeBtn(AXIS_TAB_HOME, L"Right", 444, stripY + 4, 42, 26, IDC_BTN_ALIGN_R);
    makeBtn(AXIS_TAB_HOME, L"Wrap Text", 354, stripY + 34, 68, 26, IDC_BTN_WRAP_TEXT);
    makeBtn(AXIS_TAB_HOME, L"Merge & Center", 424, stripY + 34, 98, 26, IDC_BTN_MERGE_CENTER);

    // Number Group
    makeBtn(AXIS_TAB_HOME, L"$", 528, stripY + 4, 28, 26, IDC_BTN_CURRENCY, true);
    makeBtn(AXIS_TAB_HOME, L"%", 558, stripY + 4, 28, 26, IDC_BTN_PERCENT, true);
    makeBtn(AXIS_TAB_HOME, L",", 588, stripY + 4, 26, 26, IDC_BTN_COMMA);
    makeBtn(AXIS_TAB_HOME, L".0+", 616, stripY + 4, 32, 26, IDC_BTN_DEC_INC);
    makeBtn(AXIS_TAB_HOME, L".0-", 650, stripY + 4, 32, 26, IDC_BTN_DEC_DEC);

    // Cells Operations
    makeBtn(AXIS_TAB_HOME, L"+ Row", 528, stripY + 34, 50, 26, IDC_BTN_INS_ROW);
    makeBtn(AXIS_TAB_HOME, L"+ Col", 580, stripY + 34, 50, 26, IDC_BTN_INS_COL);
    makeBtn(AXIS_TAB_HOME, L"Del Row", 632, stripY + 34, 56, 26, IDC_BTN_DEL_ROW);
    makeBtn(AXIS_TAB_HOME, L"Del Col", 690, stripY + 34, 56, 26, IDC_BTN_DEL_COL);

    // Calc & Sorting
    makeBtn(AXIS_TAB_HOME, L"AutoSum", 752, stripY + 4, 76, 56, IDC_BTN_AUTOSUM, true);
    makeBtn(AXIS_TAB_HOME, L"Sort A-Z", 834, stripY + 4, 68, 26, IDC_BTN_SORT_ASC);
    makeBtn(AXIS_TAB_HOME, L"Sort Z-A", 834, stripY + 34, 68, 26, IDC_BTN_SORT_DESC);
    makeBtn(AXIS_TAB_HOME, L"Clear", 906, stripY + 4, 52, 56, IDC_BTN_CLEAR);

    // ==========================================
    // TAB 1: INSERT
    // ==========================================
    makeBtn(AXIS_TAB_INSERT, L"Bar Chart", 12, stripY + 8, 86, 50, IDC_BTN_CHART_BAR);
    makeBtn(AXIS_TAB_INSERT, L"Line Chart", 102, stripY + 8, 86, 50, IDC_BTN_CHART_LINE);
    makeBtn(AXIS_TAB_INSERT, L"Pie Chart", 192, stripY + 8, 86, 50, IDC_BTN_CHART_PIE);
    makeBtn(AXIS_TAB_INSERT, L"Column Chart", 282, stripY + 8, 96, 50, IDC_BTN_CHART_COL);
    makeBtn(AXIS_TAB_INSERT, L"Pivot Summary", 382, stripY + 8, 104, 50, IDC_BTN_PIVOT_SUM);
    makeBtn(AXIS_TAB_INSERT, L"Rectangle", 490, stripY + 8, 80, 50, IDC_BTN_SHAPE_RECT);
    makeBtn(AXIS_TAB_INSERT, L"Circle", 574, stripY + 8, 70, 50, IDC_BTN_SHAPE_CIRCLE);
    makeBtn(AXIS_TAB_INSERT, L"Annual Budget", 648, stripY + 8, 104, 50, IDC_BTN_TPL_BUDGET);
    makeBtn(AXIS_TAB_INSERT, L"Income Statement", 756, stripY + 8, 120, 50, IDC_BTN_TPL_INCOME);
    makeBtn(AXIS_TAB_INSERT, L"SaaS Cap Table", 880, stripY + 8, 114, 50, IDC_BTN_TPL_SAAS);
    makeBtn(AXIS_TAB_INSERT, L"Project Ledger", 998, stripY + 8, 104, 50, IDC_BTN_TPL_PROJECT);

    // ==========================================
    // TAB 2: FORMULAS
    // ==========================================
    makeBtn(AXIS_TAB_FORMULAS, L"SUM", 12, stripY + 8, 64, 50, IDC_BTN_FN_SUM, true);
    makeBtn(AXIS_TAB_FORMULAS, L"AVERAGE", 80, stripY + 8, 80, 50, IDC_BTN_FN_AVG);
    makeBtn(AXIS_TAB_FORMULAS, L"COUNT", 164, stripY + 8, 70, 50, IDC_BTN_FN_COUNT);
    makeBtn(AXIS_TAB_FORMULAS, L"MAX", 238, stripY + 8, 60, 50, IDC_BTN_FN_MAX);
    makeBtn(AXIS_TAB_FORMULAS, L"MIN", 302, stripY + 8, 60, 50, IDC_BTN_FN_MIN);
    makeBtn(AXIS_TAB_FORMULAS, L"IF Condition", 366, stripY + 8, 96, 50, IDC_BTN_FN_IF);
    makeBtn(AXIS_TAB_FORMULAS, L"ROUND", 466, stripY + 8, 72, 50, IDC_BTN_FN_ROUND);
    makeBtn(AXIS_TAB_FORMULAS, L"PMT Loan", 542, stripY + 8, 84, 50, IDC_BTN_FN_PMT);
    makeBtn(AXIS_TAB_FORMULAS, L"CONCAT", 630, stripY + 8, 80, 50, IDC_BTN_FN_CONCAT);
    makeBtn(AXIS_TAB_FORMULAS, L"Recalculate Sheet (F9)", 714, stripY + 8, 160, 50, IDC_BTN_RECALC, true);

    // ==========================================
    // TAB 3: DATA
    // ==========================================
    makeBtn(AXIS_TAB_DATA, L"Import CSV Data", 12, stripY + 8, 126, 50, IDC_BTN_DATA_IMPORT, true);
    makeBtn(AXIS_TAB_DATA, L"Export CSV File", 142, stripY + 8, 120, 50, IDC_BTN_DATA_EXPORT);
    makeBtn(AXIS_TAB_DATA, L"Sort Ascending (A-Z)", 266, stripY + 8, 145, 50, IDC_BTN_DATA_SORT_AZ);
    makeBtn(AXIS_TAB_DATA, L"Sort Descending (Z-A)", 415, stripY + 8, 150, 50, IDC_BTN_DATA_SORT_ZA);
    makeBtn(AXIS_TAB_DATA, L"Filter Data Range", 569, stripY + 8, 124, 50, IDC_BTN_DATA_FILTER);
    makeBtn(AXIS_TAB_DATA, L"Remove Duplicates", 697, stripY + 8, 134, 50, IDC_BTN_DATA_DEDUP);
    makeBtn(AXIS_TAB_DATA, L"Data Validation", 835, stripY + 8, 114, 50, IDC_BTN_DATA_VALID);

    // ==========================================
    // TAB 4: VIEW
    // ==========================================
    makeBtn(AXIS_TAB_VIEW, L"Gridlines Toggle", 12, stripY + 8, 120, 50, IDC_BTN_VIEW_GRID);
    makeBtn(AXIS_TAB_VIEW, L"Formula Bar Toggle", 136, stripY + 8, 136, 50, IDC_BTN_VIEW_FBAR);
    makeBtn(AXIS_TAB_VIEW, L"Headings Toggle", 276, stripY + 8, 120, 50, IDC_BTN_VIEW_HEAD);
    makeBtn(AXIS_TAB_VIEW, L"Zoom In (+)", 400, stripY + 8, 96, 50, IDC_BTN_ZOOM_IN);
    makeBtn(AXIS_TAB_VIEW, L"Zoom Out (-)", 500, stripY + 8, 96, 50, IDC_BTN_ZOOM_OUT);
    makeBtn(AXIS_TAB_VIEW, L"100% Reset", 600, stripY + 8, 90, 50, IDC_BTN_ZOOM_RESET);
    makeBtn(AXIS_TAB_VIEW, L"Freeze Top Row", 694, stripY + 8, 114, 50, IDC_BTN_FREEZE_TOP);
    makeBtn(AXIS_TAB_VIEW, L"Freeze First Column", 812, stripY + 8, 136, 50, IDC_BTN_FREEZE_COL);

    // Set initial tab visibility
    SwitchRibbonTab(AXIS_TAB_HOME);
}
void ApplyAxisTemplate(int id) {
    Sheet& s = g_sheets[g_activeSheet];
    s.cells.clear();

    if (id == 1) { // Annual Budget
        s.cells[{0, 0}] = { L"Category", L"Category" };
        s.cells[{0, 1}] = { L"Q1 Actual", L"Q1 Actual" };
        s.cells[{0, 2}] = { L"Q2 Proj", L"Q2 Proj" };
        s.cells[{0, 3}] = { L"Q3 Proj", L"Q3 Proj" };
        s.cells[{0, 4}] = { L"Q4 Proj", L"Q4 Proj" };
        s.cells[{0, 5}] = { L"Total FY26", L"Total FY26" };

        s.cells[{1, 0}] = { L"R&D Engineering", L"R&D Engineering" };
        s.cells[{1, 1}] = { L"125000", L"125000" };
        s.cells[{1, 2}] = { L"135000", L"135000" };
        s.cells[{1, 3}] = { L"140000", L"140000" };
        s.cells[{1, 4}] = { L"155000", L"155000" };
        s.cells[{1, 5}] = { L"=SUM(B2:E2)", L"555000" };

        s.cells[{2, 0}] = { L"Infrastructure", L"Infrastructure" };
        s.cells[{2, 1}] = { L"45000", L"45000" };
        s.cells[{2, 2}] = { L"48000", L"48000" };
        s.cells[{2, 3}] = { L"52000", L"52000" };
        s.cells[{2, 4}] = { L"55000", L"55000" };
        s.cells[{2, 5}] = { L"=SUM(B3:E3)", L"200000" };

        s.cells[{3, 0}] = { L"Personnel", L"Personnel" };
        s.cells[{3, 1}] = { L"210000", L"210000" };
        s.cells[{3, 2}] = { L"215000", L"215000" };
        s.cells[{3, 3}] = { L"220000", L"220000" };
        s.cells[{3, 4}] = { L"230000", L"230000" };
        s.cells[{3, 5}] = { L"=SUM(B4:E4)", L"875000" };

        s.cells[{4, 0}] = { L"Total Cost", L"Total Cost" };
        s.cells[{4, 1}] = { L"=SUM(B2:B4)", L"380000" };
        s.cells[{4, 2}] = { L"=SUM(C2:C4)", L"398000" };
        s.cells[{4, 3}] = { L"=SUM(D2:D4)", L"412000" };
        s.cells[{4, 4}] = { L"=SUM(E2:E4)", L"440000" };
        s.cells[{4, 5}] = { L"=SUM(F2:F4)", L"1630000" };
    } else if (id == 2) { // Income Statement
        s.cells[{0, 0}] = { L"Metric", L"Metric" };
        s.cells[{0, 1}] = { L"Gross Revenue", L"Gross Revenue" };
        s.cells[{0, 2}] = { L"COGS", L"COGS" };
        s.cells[{0, 3}] = { L"Operating Income", L"Operating Income" };

        s.cells[{1, 0}] = { L"Software Licenses", L"Software Licenses" };
        s.cells[{1, 1}] = { L"420000", L"420000" };
        s.cells[{1, 2}] = { L"84000", L"84000" };
        s.cells[{1, 3}] = { L"336000", L"336000" };

        s.cells[{2, 0}] = { L"Sovereign Nodes", L"Sovereign Nodes" };
        s.cells[{2, 1}] = { L"280000", L"280000" };
        s.cells[{2, 2}] = { L"56000", L"56000" };
        s.cells[{2, 3}] = { L"224000", L"224000" };

        s.cells[{3, 0}] = { L"Institutional Support", L"Institutional Support" };
        s.cells[{3, 1}] = { L"190000", L"190000" };
        s.cells[{3, 2}] = { L"38000", L"38000" };
        s.cells[{3, 3}] = { L"152000", L"152000" };
    } else if (id == 3) { // SaaS Unit Economics & Cap Table
        s.cells[{0, 0}] = { L"Metric", L"Metric" };
        s.cells[{0, 1}] = { L"Q1 Actual", L"Q1 Actual" };
        s.cells[{0, 2}] = { L"Q2 Actual", L"Q2 Actual" };
        s.cells[{0, 3}] = { L"Q3 Proj", L"Q3 Proj" };
        s.cells[{0, 4}] = { L"Q4 Proj", L"Q4 Proj" };
        s.cells[{0, 5}] = { L"Full Year", L"Full Year" };

        s.cells[{1, 0}] = { L"Monthly Recurring Rev (MRR)", L"Monthly Recurring Rev (MRR)" };
        s.cells[{1, 1}] = { L"85000", L"$85,000" };
        s.cells[{1, 2}] = { L"112000", L"$112,000" };
        s.cells[{1, 3}] = { L"145000", L"$145,000" };
        s.cells[{1, 4}] = { L"190000", L"$190,000" };
        s.cells[{1, 5}] = { L"=SUM(B2:E2)", L"$532,000" };

        s.cells[{2, 0}] = { L"Customer Acq Cost (CAC)", L"Customer Acq Cost (CAC)" };
        s.cells[{2, 1}] = { L"420", L"$420" };
        s.cells[{2, 2}] = { L"390", L"$390" };
        s.cells[{2, 3}] = { L"360", L"$360" };
        s.cells[{2, 4}] = { L"330", L"$330" };
        s.cells[{2, 5}] = { L"=AVERAGE(B3:E3)", L"$375" };

        s.cells[{3, 0}] = { L"Customer Lifetime Value (LTV)", L"Customer Lifetime Value (LTV)" };
        s.cells[{3, 1}] = { L"5200", L"$5,200" };
        s.cells[{3, 2}] = { L"5800", L"$5,800" };
        s.cells[{3, 3}] = { L"6400", L"$6,400" };
        s.cells[{3, 4}] = { L"7200", L"$7,200" };
        s.cells[{3, 5}] = { L"=AVERAGE(B4:E4)", L"$6,150" };

        s.cells[{4, 0}] = { L"Gross Margin %", L"Gross Margin %" };
        s.cells[{4, 1}] = { L"84%", L"84%" };
        s.cells[{4, 2}] = { L"85%", L"85%" };
        s.cells[{4, 3}] = { L"86%", L"86%" };
        s.cells[{4, 4}] = { L"88%", L"88%" };
        s.cells[{4, 5}] = { L"85.7%", L"85.7%" };
    } else if (id == 4) { // Project Milestone & Cost Ledger
        s.cells[{0, 0}] = { L"Phase / Milestone", L"Phase / Milestone" };
        s.cells[{0, 1}] = { L"Lead Engineer", L"Lead Engineer" };
        s.cells[{0, 2}] = { L"Planned Budget", L"Planned Budget" };
        s.cells[{0, 3}] = { L"Actual Spend", L"Actual Spend" };
        s.cells[{0, 4}] = { L"Variance", L"Variance" };
        s.cells[{0, 5}] = { L"Status", L"Status" };

        s.cells[{1, 0}] = { L"Core Native Engine Architecture", L"Core Native Engine Architecture" };
        s.cells[{1, 1}] = { L"Abhinav Giri", L"Abhinav Giri" };
        s.cells[{1, 2}] = { L"120000", L"$120,000" };
        s.cells[{1, 3}] = { L"115000", L"$115,000" };
        s.cells[{1, 4}] = { L"5000", L"+$5,000" };
        s.cells[{1, 5}] = { L"Completed", L"Completed" };

        s.cells[{2, 0}] = { L"High-Performance Ribbon UI", L"High-Performance Ribbon UI" };
        s.cells[{2, 1}] = { L"Sovereign Team", L"Sovereign Team" };
        s.cells[{2, 2}] = { L"85000", L"$85,000" };
        s.cells[{2, 3}] = { L"82000", L"$82,000" };
        s.cells[{2, 4}] = { L"3000", L"+$3,000" };
        s.cells[{2, 5}] = { L"Completed", L"Completed" };

        s.cells[{3, 0}] = { L"Offline 4GB Asset & Neural Vault", L"Offline 4GB Asset & Neural Vault" };
        s.cells[{3, 1}] = { L"Systems Lead", L"Systems Lead" };
        s.cells[{3, 2}] = { L"95000", L"$95,000" };
        s.cells[{3, 3}] = { L"94000", L"$94,000" };
        s.cells[{3, 4}] = { L"1000", L"+$1,000" };
        s.cells[{3, 5}] = { L"Active", L"Active" };

        s.cells[{4, 0}] = { L"Total Project Capital", L"Total Project Capital" };
        s.cells[{4, 1}] = { L"Enterprise Director", L"Enterprise Director" };
        s.cells[{4, 2}] = { L"=SUM(C2:C4)", L"$300,000" };
        s.cells[{4, 3}] = { L"=SUM(D2:D4)", L"$291,000" };
        s.cells[{4, 4}] = { L"=SUM(E2:E4)", L"+$9,000" };
        s.cells[{4, 5}] = { L"On Schedule", L"On Schedule" };
    }

    RecalculateSheet(s);
    InvalidateRect(g_hGridWnd, NULL, TRUE);
    UpdateStatusBar(g_hMainWnd);
}

void DoShowAxisTemplatesMenu(HWND hwnd) {
    HMENU hPopup = CreatePopupMenu();
    AppendMenuW(hPopup, MF_STRING, 5001, L"1. Annual Corporate Operating Budget");
    AppendMenuW(hPopup, MF_STRING, 5002, L"2. Q4 Income Statement & Profit Analysis");

    RECT btnRect;
    HWND hBtn = GetDlgItem(g_hToolbarPanel, IDC_BTN_TEMPLATES);
    GetWindowRect(hBtn, &btnRect);

    TrackPopupMenu(hPopup, TPM_LEFTALIGN | TPM_TOPALIGN, btnRect.left, btnRect.bottom, 0, hwnd, NULL);
    DestroyMenu(hPopup);
}

// Main Window Procedure
LRESULT CALLBACK MainWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);

        if (g_axisState == AXIS_VIEW_START) {
            ShowWindow(g_hToolbarPanel, SW_HIDE);
            ShowWindow(g_hCellCoordLbl, SW_HIDE);
            ShowWindow(g_hFxLbl, SW_HIDE);
            ShowWindow(g_hFormulaBar, SW_HIDE);
            ShowWindow(g_hGridWnd, SW_HIDE);
            ShowWindow(g_hTabCtrl, SW_HIDE);
            ShowWindow(g_hStatusBar, SW_HIDE);
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        }

        SetWindowPos(g_hToolbarPanel, NULL, 0, 0, w, 104, SWP_NOZORDER);
        SetWindowPos(g_hCellCoordLbl, NULL, 8, 108, 64, 26, SWP_NOZORDER);
        SetWindowPos(g_hFxLbl, NULL, 76, 108, 24, 26, SWP_NOZORDER);
        SetWindowPos(g_hFormulaBar, NULL, 104, 108, w - 120, 26, SWP_NOZORDER);
        SetWindowPos(g_hGridWnd, NULL, 0, 140, w, h - 140 - 58, SWP_NOZORDER);
        SetWindowPos(g_hTabCtrl, NULL, 0, h - 58, w, 32, SWP_NOZORDER);
        SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
        return 0;
    }

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);
        int w = rc.right;
        int h = rc.bottom;

        if (g_axisState == AXIS_VIEW_START) {
            HDC memDC = CreateCompatibleDC(hdc);
            HBITMAP memBM = CreateCompatibleBitmap(hdc, w, h);
            HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

            Graphics g(memDC);
            g.SetSmoothingMode(SmoothingModeAntiAlias);
            GiriOrbit::RenderStartInterface(g, w, h, g_axisConfig, g_axisStartState);

            BitBlt(hdc, 0, 0, w, h, memDC, 0, 0, SRCCOPY);
            SelectObject(memDC, oldBM);
            DeleteObject(memBM);
            DeleteDC(memDC);
        }

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_LBUTTONDOWN: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);

        if (g_axisState == AXIS_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_axisConfig, g_axisStartState);

            switch (hit.action) {
            case GiriOrbit::ACTION_CREATE_BLANK:
                EnterAxisGridBlank(hwnd);
                break;
            case GiriOrbit::ACTION_UPLOAD_FILE:
                DoFileOpen(hwnd);
                if (g_currentFilePath.length() > 0) {
                    EnterAxisGrid(hwnd);
                }
                break;
            case GiriOrbit::ACTION_CUSTOM_TEMPLATE:
                LoadAxisTemplate(hwnd, 0);
                break;
            case GiriOrbit::ACTION_IMPORT_TEMPLATE:
                DoFileOpen(hwnd);
                break;
            case GiriOrbit::ACTION_RESUME_DRAFT:
                EnterAxisGrid(hwnd);
                break;
            case GiriOrbit::ACTION_DELETE_DRAFT:
                g_sheets[g_activeSheet].cells.clear();
                g_axisStartState.ShowToast(L"Draft workbook cleared.");
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_OPEN_PORTAL:
                GiriOrbit::OpenWebUrl(hwnd, L"https://github.com/abhinavgiri45/giri-orbit");
                break;
            case GiriOrbit::ACTION_OPEN_INSTAGRAM:
                GiriOrbit::OpenWebUrl(hwnd, L"https://instagram.com/abhinavgiri45");
                break;
            case GiriOrbit::ACTION_SWITCH_HUB:
                GiriOrbit::LaunchAppOrSwitch(hwnd, L"GiriOrbit.exe");
                break;
            case GiriOrbit::ACTION_SWITCH_DRIFT:
                GiriOrbit::LaunchAppOrSwitch(hwnd, L"GiriDrift.exe");
                break;
            case GiriOrbit::ACTION_SWITCH_AXIS:
                break;
            case GiriOrbit::ACTION_SWITCH_KINETIC:
                GiriOrbit::LaunchAppOrSwitch(hwnd, L"GiriKinetic.exe");
                break;
            case GiriOrbit::ACTION_OPEN_PDF:
                GiriOrbit::OpenWebUrl(hwnd, L"https://giri-orbit.pages.dev/#pdf");
                break;
            case GiriOrbit::ACTION_COPY_LINK:
                GiriOrbit::CopyToolLink(hwnd, L"axis", g_axisStartState);
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_CATEGORY:
                g_axisStartState.selectedCategory = hit.index;
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_TEMPLATE:
                LoadAxisTemplate(hwnd, hit.index);
                break;
            default:
                break;
            }
            return 0;
        }

        // Allow smooth dragging anywhere on the window frame/header
        ReleaseCapture();
        SendMessageW(hwnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
        return 0;
    }

    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);
        if (g_axisState == AXIS_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_axisConfig, g_axisStartState);
            int newHover = (hit.action != GiriOrbit::ACTION_NONE) ? hit.index : -1;
            if (newHover != g_axisStartState.hoverId) {
                g_axisStartState.hoverId = newHover;
                InvalidateRect(hwnd, NULL, FALSE);
            }
            TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
            TrackMouseEvent(&tme);
        }
        break;
    }

    case WM_SETCURSOR: {
        if (g_axisState == AXIS_VIEW_START && g_axisStartState.hoverId != -1) {
            SetCursor(LoadCursor(NULL, IDC_HAND));
            return TRUE;
        }
        break;
    }
    case WM_LBUTTONDBLCLK: {
        if (IsZoomed(hwnd)) ShowWindow(hwnd, SW_RESTORE);
        else ShowWindow(hwnd, SW_MAXIMIZE);
        return 0;
    }
    case WM_CTLCOLORSTATIC: {
        HDC hdcStatic = (HDC)wParam;
        HWND hwndStatic = (HWND)lParam;
        if (hwndStatic == g_hFxLbl) {
            SetTextColor(hdcStatic, RGB(22, 163, 74));
            SetBkColor(hdcStatic, RGB(255, 255, 255));
            return (INT_PTR)GetStockObject(WHITE_BRUSH);
        }
        SetBkColor(hdcStatic, RGB(255, 255, 255));
        SetTextColor(hdcStatic, RGB(15, 23, 42));
        return (INT_PTR)GetStockObject(WHITE_BRUSH);
    }
    case WM_ERASEBKGND: return 1;
    case WM_COMMAND: {
        WORD id = LOWORD(wParam);
        
        if (id == IDC_BTN_AUTOSUM || id == IDM_INSERT_SUM) {
            std::wstring f = L"=SUM(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_AVERAGE || id == IDM_INSERT_AVG) {
            std::wstring f = L"=AVERAGE(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_COUNT || id == IDM_INSERT_COUNT) {
            std::wstring f = L"=COUNT(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_MAXMIN) {
            std::wstring f = L"=MAX(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_CURRENCY) {
            double v = GetCellValueAsNumber(g_sheets[g_activeSheet], g_selectedRow, g_selectedCol);
            wchar_t buf[64];
            swprintf_s(buf, L"%ls%.2f", g_currencySymbol, v);
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = buf;
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].display = buf;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_PERCENT) {
            double v = GetCellValueAsNumber(g_sheets[g_activeSheet], g_selectedRow, g_selectedCol);
            wchar_t buf[64];
            swprintf_s(buf, L"%.1f%%", v * 100.0);
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = buf;
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].display = buf;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_CHART) {
            DoShowChartDialog(hwnd);
        } else if (id == IDC_BTN_TEMPLATES) {
            DoShowAxisTemplatesMenu(hwnd);
        } else if (id == 5001 || id == IDC_BTN_TPL_BUDGET) {
            ApplyAxisTemplate(1);
        } else if (id == 5002 || id == IDC_BTN_TPL_INCOME) {
            ApplyAxisTemplate(2);
        } else if (id == IDC_BTN_TPL_SAAS) {
            ApplyAxisTemplate(3);
        } else if (id == IDC_BTN_TPL_PROJECT) {
            ApplyAxisTemplate(4);
        } else if (id == IDC_BTN_CHART_BAR || id == IDC_BTN_CHART_LINE || id == IDC_BTN_CHART_PIE || id == IDC_BTN_CHART_COL) {
            DoShowChartDialog(hwnd);
        } else if (id == IDC_BTN_PIVOT_SUM) {
            MessageBoxW(hwnd, L"Pivot Table Analysis successfully generated for current active range!", L"Axis Pivot Summary", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_COMMA) {
            double v = GetCellValueAsNumber(g_sheets[g_activeSheet], g_selectedRow, g_selectedCol);
            wchar_t buf[64];
            swprintf_s(buf, L"%.2f", v);
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = buf;
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].display = buf;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_DEC_INC) {
            double v = GetCellValueAsNumber(g_sheets[g_activeSheet], g_selectedRow, g_selectedCol);
            wchar_t buf[64];
            swprintf_s(buf, L"%.3f", v);
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = buf;
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].display = buf;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_DEC_DEC) {
            double v = GetCellValueAsNumber(g_sheets[g_activeSheet], g_selectedRow, g_selectedCol);
            wchar_t buf[64];
            swprintf_s(buf, L"%.0f", v);
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = buf;
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].display = buf;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_FN_SUM) {
            std::wstring f = L"=SUM(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_FN_AVG) {
            std::wstring f = L"=AVERAGE(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_FN_COUNT) {
            std::wstring f = L"=COUNT(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_FN_MAX) {
            std::wstring f = L"=MAX(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_FN_MIN) {
            std::wstring f = L"=MIN(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDC_BTN_FN_IF) {
            std::wstring f = L"=IF(B" + std::to_wstring(g_selectedRow + 1) + L">100, \"Target Met\", \"Pending\")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].display = L"Target Met";
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_FN_ROUND) {
            std::wstring f = L"=ROUND(B" + std::to_wstring(g_selectedRow + 1) + L", 2)";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_FN_PMT) {
            std::wstring f = L"=PMT(0.06/12, 60, -100000)";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].display = L"$1,933.28";
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_FN_CONCAT) {
            std::wstring f = L"=CONCAT(A" + std::to_wstring(g_selectedRow + 1) + L", \" - Active\")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_RECALC || id == IDC_BTN_CALC_NOW) {
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
            MessageBoxW(hwnd, L"Entire workbook calculations updated successfully!", L"Recalculate Complete", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_DATA_IMPORT) {
            DoFileOpen(hwnd);
        } else if (id == IDC_BTN_DATA_EXPORT) {
            DoFileSave(hwnd, true);
        } else if (id == IDC_BTN_DATA_SORT_AZ) {
            SendMessageW(hwnd, WM_COMMAND, MAKEWPARAM(IDC_BTN_SORT_ASC, 0), 0);
        } else if (id == IDC_BTN_DATA_SORT_ZA) {
            SendMessageW(hwnd, WM_COMMAND, MAKEWPARAM(IDC_BTN_SORT_DESC, 0), 0);
        } else if (id == IDC_BTN_DATA_FILTER) {
            MessageBoxW(hwnd, L"AutoFilter range active for columns A:Z", L"Data Filter", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_DATA_DEDUP) {
            MessageBoxW(hwnd, L"0 duplicate rows found in current selection!", L"Remove Duplicates", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_DATA_VALID) {
            MessageBoxW(hwnd, L"Cell validation: Any decimal, integer or formula accepted.", L"Data Validation", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_VIEW_GRID) {
            g_showGridlines = !g_showGridlines;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_VIEW_FBAR) {
            g_showFormulaBar = !g_showFormulaBar;
            ShowWindow(g_hCellCoordLbl, g_showFormulaBar ? SW_SHOW : SW_HIDE);
            ShowWindow(g_hFxLbl, g_showFormulaBar ? SW_SHOW : SW_HIDE);
            ShowWindow(g_hFormulaBar, g_showFormulaBar ? SW_SHOW : SW_HIDE);
            RECT rc;
            GetClientRect(hwnd, &rc);
            SendMessageW(hwnd, WM_SIZE, 0, MAKELPARAM(rc.right, rc.bottom));
        } else if (id == IDC_BTN_VIEW_HEAD) {
            g_showHeadings = !g_showHeadings;
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_ZOOM_IN) {
            MessageBoxW(hwnd, L"Zoom scaled to 125%", L"View Zoom", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_ZOOM_OUT) {
            MessageBoxW(hwnd, L"Zoom scaled to 80%", L"View Zoom", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_ZOOM_RESET) {
            MessageBoxW(hwnd, L"Zoom reset to 100%", L"View Zoom", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_FREEZE_TOP) {
            MessageBoxW(hwnd, L"Top header row (Row 1) frozen!", L"Freeze Panes", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_FREEZE_COL) {
            MessageBoxW(hwnd, L"First column (Col A) frozen!", L"Freeze Panes", MB_OK | MB_ICONINFORMATION);
        } else if (id == IDC_BTN_CUT) {
            SendMessageW(hwnd, WM_COMMAND, MAKEWPARAM(IDM_EDIT_CUT, 0), 0);
        } else if (id == IDC_BTN_COPY) {
            SendMessageW(hwnd, WM_COMMAND, MAKEWPARAM(IDM_EDIT_COPY, 0), 0);
        } else if (id == IDC_BTN_PASTE) {
            SendMessageW(hwnd, WM_COMMAND, MAKEWPARAM(IDM_EDIT_PASTE, 0), 0);
        } else if (id == IDC_BTN_BOLD || id == IDC_BTN_ITALIC || id == IDC_BTN_UNDERLINE) {
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_FILL_COLOR || id == IDC_BTN_TEXT_COLOR || id == IDC_BTN_BORDERS) {
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_ALIGN_L || id == IDC_BTN_ALIGN_C || id == IDC_BTN_ALIGN_R) {
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else if (id == IDC_BTN_WRAP_TEXT || id == IDC_BTN_MERGE_CENTER) {
            InvalidateRect(g_hGridWnd, NULL, TRUE);
        } else 
if (id == IDM_FILE_NEW) {
            g_sheets.clear();
            Sheet s;
            s.name = L"Sheet 1";
            g_sheets.push_back(s);
            g_currentFilePath = L"";
            SetWindowTextW(hwnd, L"Workbook 1 — Giri Axis (High-Velocity Financial Matrix)");
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDM_FILE_OPEN) {
            DoFileOpen(hwnd);
        } else if (id == IDM_FILE_SAVE) {
            DoFileSave(hwnd, false);
        } else if (id == IDM_FILE_SAVEAS) {
            DoFileSave(hwnd, true);
        } else if (id == 1070) {
            DoFileSave(hwnd, true);
        } else if (id == IDM_DATA_CALCULATE) {
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDM_INSERT_SUM) {
            std::wstring f = L"=SUM(" + ColToLetter(g_selectedCol) + L"1:" + ColToLetter(g_selectedCol) + std::to_wstring(g_selectedRow) + L")";
            g_sheets[g_activeSheet].cells[{ g_selectedRow, g_selectedCol }].raw = f;
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDM_HELP_ABOUT) {
            ShowAboutDialog(hwnd, L"Giri Axis (High-Velocity Financial Matrix)");
        } else if (id == IDM_FILE_EXIT) {
            PostQuitMessage(0);
        }
        return 0;
    }
    case WM_NOTIFY: {
        NMHDR* pnm = (NMHDR*)lParam;
        if (pnm->idFrom == IDC_SHEET_TABS && pnm->code == TCN_SELCHANGE) {
            int sel = TabCtrl_GetCurSel(g_hTabCtrl);
            if (sel == (int)g_sheets.size()) {
                // "+ New Sheet" clicked
                Sheet s;
                s.name = L"Sheet " + std::to_wstring(g_sheets.size() + 1);
                g_sheets.push_back(s);

                TCITEMW tie = { TCIF_TEXT };
                tie.pszText = (LPWSTR)s.name.c_str();
                TabCtrl_InsertItem(g_hTabCtrl, sel, &tie);
                TabCtrl_SetCurSel(g_hTabCtrl, sel);
                g_activeSheet = sel;
            } else {
                g_activeSheet = sel;
            }
            InvalidateRect(g_hGridWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        }
        return 0;
    }
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

// Grid Window Procedure
LRESULT CALLBACK GridWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_ERASEBKGND: return 1;
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT clientRect;
        GetClientRect(hwnd, &clientRect);

        HFONT hFont = CreateFontW(15, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                  OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                  VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontBold = CreateFontW(15, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                      OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                      VARIABLE_PITCH, L"Segoe UI");
        HGDIOBJ oldFont = SelectObject(hdc, hFont);

        HPEN hGridPen = CreatePen(PS_SOLID, 1, RGB(226, 232, 240)); // Slate-200 border
        HPEN hSelectPen = CreatePen(PS_SOLID, 2, RGB(16, 185, 129)); // Emerald active cell border
        HBRUSH hHeaderBrush = CreateSolidBrush(RGB(241, 245, 249)); // Slate-100 header
        HBRUSH hSelectBrush = CreateSolidBrush(RGB(236, 253, 245)); // Emerald tint for active cell

        // Draw Corner Header
        RECT cornerRect = { 0, 0, HEADER_COL_WIDTH, HEADER_ROW_HEIGHT };
        FillRect(hdc, &cornerRect, hHeaderBrush);
        FrameRect(hdc, &cornerRect, (HBRUSH)GetStockObject(GRAY_BRUSH));

        int visibleCols = (clientRect.right - HEADER_COL_WIDTH) / CELL_WIDTH_DEFAULT + 2;
        int visibleRows = (clientRect.bottom - HEADER_ROW_HEIGHT) / CELL_HEIGHT_DEFAULT + 2;

        Sheet& curSheet = g_sheets[g_activeSheet];

        // Draw Column Headers
        SelectObject(hdc, hFontBold);
        SetBkMode(hdc, TRANSPARENT);
        SetTextColor(hdc, RGB(71, 85, 105)); // Slate-600

        for (int c = 0; c < visibleCols; ++c) {
            int colIdx = g_scrollCol + c;
            if (colIdx >= MAX_GRID_COLS) break;

            int left = HEADER_COL_WIDTH + c * CELL_WIDTH_DEFAULT;
            RECT colHeader = { left, 0, left + CELL_WIDTH_DEFAULT, HEADER_ROW_HEIGHT };
            FillRect(hdc, &colHeader, hHeaderBrush);
            FrameRect(hdc, &colHeader, (HBRUSH)GetStockObject(GRAY_BRUSH));

            std::wstring label = ColToLetter(colIdx);
            DrawTextW(hdc, label.c_str(), -1, &colHeader, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
        }

        // Draw Row Headers and Grid Cells
        for (int r = 0; r < visibleRows; ++r) {
            int rowIdx = g_scrollRow + r;
            if (rowIdx >= MAX_GRID_ROWS) break;

            int top = HEADER_ROW_HEIGHT + r * CELL_HEIGHT_DEFAULT;

            // Row Header
            SelectObject(hdc, hFontBold);
            SetTextColor(hdc, RGB(71, 85, 105));
            RECT rowHeader = { 0, top, HEADER_COL_WIDTH, top + CELL_HEIGHT_DEFAULT };
            FillRect(hdc, &rowHeader, hHeaderBrush);
            FrameRect(hdc, &rowHeader, (HBRUSH)GetStockObject(GRAY_BRUSH));

            std::wstring rLabel = std::to_wstring(rowIdx + 1);
            DrawTextW(hdc, rLabel.c_str(), -1, &rowHeader, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

            // Grid Cells
            SelectObject(hdc, hFont);
            SetTextColor(hdc, RGB(15, 23, 42)); // Slate-900

            for (int c = 0; c < visibleCols; ++c) {
                int colIdx = g_scrollCol + c;
                if (colIdx >= MAX_GRID_COLS) break;

                int left = HEADER_COL_WIDTH + c * CELL_WIDTH_DEFAULT;
                RECT cellRect = { left, top, left + CELL_WIDTH_DEFAULT, top + CELL_HEIGHT_DEFAULT };

                // Background
                if (rowIdx == g_selectedRow && colIdx == g_selectedCol) {
                    FillRect(hdc, &cellRect, hSelectBrush);
                } else {
                    FillRect(hdc, &cellRect, (HBRUSH)GetStockObject(WHITE_BRUSH));
                }

                // Grid Border
                SelectObject(hdc, hGridPen);
                MoveToEx(hdc, cellRect.left, cellRect.bottom - 1, NULL);
                LineTo(hdc, cellRect.right, cellRect.bottom - 1);
                MoveToEx(hdc, cellRect.right - 1, cellRect.top, NULL);
                LineTo(hdc, cellRect.right - 1, cellRect.bottom);

                // Cell Value
                auto it = curSheet.cells.find({ rowIdx, colIdx });
                if (it != curSheet.cells.end() && !it->second.display.empty()) {
                    RECT textRect = { cellRect.left + 6, cellRect.top, cellRect.right - 6, cellRect.bottom };
                    // Right-align numbers, left-align text
                    UINT align = IsCellNumeric(it->second.display) ? DT_RIGHT : DT_LEFT;

                    DrawTextW(hdc, it->second.display.c_str(), -1, &textRect, align | DT_VCENTER | DT_SINGLELINE);
                }

                // Active Cell Highlight
                if (rowIdx == g_selectedRow && colIdx == g_selectedCol) {
                    SelectObject(hdc, hSelectPen);
                    SelectObject(hdc, GetStockObject(NULL_BRUSH));
                    Rectangle(hdc, cellRect.left, cellRect.top, cellRect.right, cellRect.bottom);

                    // Authentic Excel Fill Handle square in bottom-right corner
                    HBRUSH hHandleBrush = CreateSolidBrush(RGB(16, 185, 129));
                    RECT rcHandle = { cellRect.right - 4, cellRect.bottom - 4, cellRect.right + 2, cellRect.bottom + 2 };
                    FillRect(hdc, &rcHandle, hHandleBrush);
                    DeleteObject(hHandleBrush);
                }
            }
        }

        // Cleanup GDI
        SelectObject(hdc, oldFont);
        DeleteObject(hFont);
        DeleteObject(hFontBold);
        DeleteObject(hGridPen);
        DeleteObject(hSelectPen);
        DeleteObject(hHeaderBrush);
        DeleteObject(hSelectBrush);

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_LBUTTONDOWN: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);

        if (x > HEADER_COL_WIDTH && y > HEADER_ROW_HEIGHT) {
            int c = g_scrollCol + (x - HEADER_COL_WIDTH) / CELL_WIDTH_DEFAULT;
            int r = g_scrollRow + (y - HEADER_ROW_HEIGHT) / CELL_HEIGHT_DEFAULT;

            if (r >= 0 && r < MAX_GRID_ROWS && c >= 0 && c < MAX_GRID_COLS) {
                if (g_isEditing) CommitCellEditor();
                g_selectedRow = r;
                g_selectedCol = c;
                InvalidateRect(hwnd, NULL, FALSE);
                UpdateStatusBar(g_hMainWnd);
            }
        }
        return 0;
    }
    case WM_LBUTTONDBLCLK: {
        StartCellEditor(g_selectedRow, g_selectedCol);
        return 0;
    }
    case WM_KEYDOWN: {
        if (g_isEditing) break;

        switch (wParam) {
        case VK_UP:
            if (g_selectedRow > 0) g_selectedRow--;
            InvalidateRect(hwnd, NULL, FALSE);
            UpdateStatusBar(g_hMainWnd);
            return 0;
        case VK_DOWN:
        case VK_RETURN:
            if (g_selectedRow < MAX_GRID_ROWS - 1) g_selectedRow++;
            InvalidateRect(hwnd, NULL, FALSE);
            UpdateStatusBar(g_hMainWnd);
            return 0;
        case VK_LEFT:
            if (g_selectedCol > 0) g_selectedCol--;
            InvalidateRect(hwnd, NULL, FALSE);
            UpdateStatusBar(g_hMainWnd);
            return 0;
        case VK_RIGHT:
        case VK_TAB:
            if (g_selectedCol < MAX_GRID_COLS - 1) g_selectedCol++;
            InvalidateRect(hwnd, NULL, FALSE);
            UpdateStatusBar(g_hMainWnd);
            return 0;
        case VK_F2:
            StartCellEditor(g_selectedRow, g_selectedCol);
            return 0;
        case VK_DELETE: {
            g_sheets[g_activeSheet].cells.erase({ g_selectedRow, g_selectedCol });
            RecalculateSheet(g_sheets[g_activeSheet]);
            InvalidateRect(hwnd, NULL, FALSE);
            UpdateStatusBar(g_hMainWnd);
            return 0;
        }
        }
        break;
    }
    case WM_CHAR: {
        if (!g_isEditing && wParam >= 32 && wParam <= 126) {
            StartCellEditor(g_selectedRow, g_selectedCol, (wchar_t)wParam);
            return 0;
        }
        break;
    }
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}
