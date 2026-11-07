/* ============================================================================
 * GIRI AXIS — HIGH-VELOCITY FINANCIAL MATRIX & SPREADSHEET (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Browser • Zero Cloud Telemetry • Sovereign In-Memory Matrix Engine
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
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
void DoFileSave(HWND, bool);
void DoExportCSV(HWND);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;
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
    wcex.style = CS_HREDRAW | CS_VREDRAW;
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
        0, L"GiriAxisMainWindowClass",
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
        8, 42, 64, 26, g_hMainWnd, NULL, hInstance, NULL
    );

    g_hFxLbl = CreateWindowExW(
        0, L"STATIC", L"fx",
        WS_CHILD | WS_VISIBLE | SS_CENTER | SS_CENTERIMAGE,
        76, 42, 24, 26, g_hMainWnd, NULL, hInstance, NULL
    );

    g_hFormulaBar = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", L"",
        WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
        104, 42, 700, 26, g_hMainWnd, (HMENU)IDC_FORMULA_EDIT, hInstance, NULL
    );

    // Create Grid Window
    g_hGridWnd = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"GiriAxisGridClass", L"",
        WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL,
        8, 40, 1060, 580, g_hMainWnd, (HMENU)3100, hInstance, NULL
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
    UpdateStatusBar(g_hMainWnd);

    // Message Loop
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

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
        wcex.style = CS_HREDRAW | CS_VREDRAW;
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

void CreateRibbonToolbar(HWND hwnd) {
    g_hToolbarPanel = CreateWindowExW(
        0, L"STATIC", L"",
        WS_CHILD | WS_VISIBLE | SS_LEFT | WS_CLIPCHILDREN,
        0, 0, 1100, 36, hwnd, (HMENU)IDC_TOOLBAR_PANEL, g_hInst, NULL
    );

    HFONT hFont = CreateFontW(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");

    auto makeBtn = [hFont](const wchar_t* text, int x, int w, int id) {
        HWND btn = CreateWindowExW(
            0, L"BUTTON", text,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            x, 4, w, 28, g_hToolbarPanel, (HMENU)(INT_PTR)id, g_hInst, NULL
        );
        SendMessageW(btn, WM_SETFONT, (WPARAM)hFont, TRUE);
        return btn;
    };

    makeBtn(L"Σ AutoSum", 6, 85, IDC_BTN_AUTOSUM);
    makeBtn(L"Average", 95, 68, IDC_BTN_AVERAGE);
    makeBtn(L"Count", 167, 56, IDC_BTN_COUNT);
    makeBtn(L"Max/Min", 227, 68, IDC_BTN_MAXMIN);
    makeBtn(L"$ Currency", 299, 78, IDC_BTN_CURRENCY);
    makeBtn(L"% Percent", 381, 72, IDC_BTN_PERCENT);
    makeBtn(L"Sort A-Z", 457, 68, IDC_BTN_SORT_ASC);
    makeBtn(L"Sort Z-A", 529, 68, IDC_BTN_SORT_DESC);
    makeBtn(L"+ Row", 601, 56, IDC_BTN_INS_ROW);
    makeBtn(L"+ Col", 661, 56, IDC_BTN_INS_COL);
    makeBtn(L"📊 Chart", 721, 68, IDC_BTN_CHART);
    makeBtn(L"📂 Templates ▼", 793, 105, IDC_BTN_TEMPLATES);
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

        SetWindowPos(g_hToolbarPanel, NULL, 0, 0, w, 36, SWP_NOZORDER);
        SetWindowPos(g_hCellCoordLbl, NULL, 8, 42, 64, 26, SWP_NOZORDER);
        SetWindowPos(g_hFxLbl, NULL, 76, 42, 24, 26, SWP_NOZORDER);
        SetWindowPos(g_hFormulaBar, NULL, 104, 42, w - 120, 26, SWP_NOZORDER);
        SetWindowPos(g_hGridWnd, NULL, 0, 74, w, h - 74 - 58, SWP_NOZORDER);
        SetWindowPos(g_hTabCtrl, NULL, 0, h - 58, w, 32, SWP_NOZORDER);
        SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
        return 0;
    }
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
            swprintf_s(buf, L"$%.2f", v);
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
        } else if (id == 5001) {
            ApplyAxisTemplate(1);
        } else if (id == 5002) {
            ApplyAxisTemplate(2);
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
                    UINT align = DT_LEFT;
                    try {
                        std::stod(it->second.display);
                        align = DT_RIGHT;
                    } catch (...) {}

                    DrawTextW(hdc, it->second.display.c_str(), -1, &textRect, align | DT_VCENTER | DT_SINGLELINE);
                }

                // Active Cell Highlight
                if (rowIdx == g_selectedRow && colIdx == g_selectedCol) {
                    SelectObject(hdc, hSelectPen);
                    SelectObject(hdc, GetStockObject(NULL_BRUSH));
                    Rectangle(hdc, cellRect.left, cellRect.top, cellRect.right, cellRect.bottom);
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
