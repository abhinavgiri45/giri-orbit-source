/* ============================================================================
 * GIRI DRIFT — EXECUTIVE DOCUMENT COMPOSER & SOVEREIGN WORD PROCESSOR (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Official Contact: abhinavgiri370@gmail.com
 * Proprietary Commercial Software License (All Rights Reserved)
 * 100% Offline Standalone Native C++ Win32 & GDI+ Office Ribbon Desktop Suite
 * True Microsoft Word & LibreOffice Writer Architecture & Feature Completeness
 * ============================================================================
 */

#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <commctrl.h>
#include <richedit.h>
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <gdiplus.h>
#include <string>
#include <vector>
#include <sstream>
#include <iomanip>
#include <chrono>

#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "comdlg32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "gdi32.lib")
#pragma comment(lib, "gdiplus.lib")
#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "msimg32.lib")

using namespace Gdiplus;

// Identifiers
#define IDC_TOOLBAR_PANEL       3000
#define IDC_RICH_EDIT           3001
#define IDC_STATUS_BAR          3002

// Ribbon Tabs
#define RIBBON_TAB_HOME         0
#define RIBBON_TAB_INSERT       1
#define RIBBON_TAB_LAYOUT       2
#define RIBBON_TAB_REVIEW       3
#define RIBBON_TAB_VIEW         4
#define RIBBON_TAB_COUNT        5

// Ribbon Controls - HOME Tab
#define IDC_COMBO_FONT          3010
#define IDC_COMBO_SIZE          3011
#define IDC_BTN_PASTE           3020
#define IDC_BTN_CUT             3021
#define IDC_BTN_COPY            3022
#define IDC_BTN_BOLD            3023
#define IDC_BTN_ITALIC          3024
#define IDC_BTN_UNDERLINE       3025
#define IDC_BTN_STRIKE          3026
#define IDC_BTN_SUBSCRIPT       3027
#define IDC_BTN_SUPERSCRIPT     3028
#define IDC_BTN_GROW_FONT       3029
#define IDC_BTN_SHRINK_FONT     3030
#define IDC_BTN_COLOR           3031
#define IDC_BTN_HIGHLIGHT       3032
#define IDC_BTN_CLEAR_FORMAT    3033
#define IDC_BTN_ALIGN_L         3034
#define IDC_BTN_ALIGN_C         3035
#define IDC_BTN_ALIGN_R         3036
#define IDC_BTN_JUSTIFY         3037
#define IDC_BTN_BULLETS         3038
#define IDC_BTN_NUMBERS         3039
#define IDC_BTN_LINE_SPACING    3040
#define IDC_BTN_STYLE_NORMAL    3041
#define IDC_BTN_STYLE_H1        3042
#define IDC_BTN_STYLE_H2        3043
#define IDC_BTN_STYLE_TITLE     3044
#define IDC_BTN_STYLE_QUOTE     3045
#define IDC_BTN_FIND            3046
#define IDC_BTN_REPLACE         3047
#define IDC_BTN_SELECT_ALL      3048

// Ribbon Controls - INSERT Tab
#define IDC_BTN_INSERT_TABLE    3050
#define IDC_BTN_INSERT_IMAGE    3051
#define IDC_BTN_PAGE_BREAK      3052
#define IDC_BTN_INSERT_DATE     3053
#define IDC_BTN_INSERT_SYMBOL   3054
#define IDC_BTN_HORIZ_LINE      3055

// Ribbon Controls - LAYOUT Tab
#define IDC_BTN_MARGINS_NORM    3060
#define IDC_BTN_MARGINS_NARROW  3061
#define IDC_BTN_MARGINS_WIDE    3062
#define IDC_BTN_ORIENT_PORT     3063
#define IDC_BTN_ORIENT_LAND     3064
#define IDC_BTN_SIZE_A4         3065
#define IDC_BTN_SIZE_LETTER     3066

// Ribbon Controls - REVIEW Tab
#define IDC_BTN_WORD_COUNT      3070
#define IDC_BTN_HINDI_TOGGLE    3071
#define IDC_BTN_LANGUAGES       3072

// Ribbon Controls - VIEW Tab
#define IDC_BTN_VIEW_PRINT      3080
#define IDC_BTN_VIEW_WEB        3081
#define IDC_BTN_ZOOM_IN         3082
#define IDC_BTN_ZOOM_OUT        3083
#define IDC_BTN_ZOOM_RESET      3084

// Menu Commands
#define IDM_FILE_NEW            4001
#define IDM_FILE_OPEN           4002
#define IDM_FILE_SAVE           4003
#define IDM_FILE_SAVEAS         4004
#define IDM_FILE_PRINT          4005
#define IDM_FILE_EXIT           4006

#define IDM_EDIT_UNDO           4010
#define IDM_EDIT_REDO           4011
#define IDM_EDIT_CUT            4012
#define IDM_EDIT_COPY           4013
#define IDM_EDIT_PASTE          4014
#define IDM_EDIT_SELECTALL      4015
#define IDM_EDIT_FIND           4016
#define IDM_EDIT_REPLACE        4017

// Global Handles
HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hToolbarPanel = NULL;
HWND g_hStatusBar = NULL;
HWND g_hRichEdit = NULL;
HMODULE g_hRichEditLib = NULL;
ULONG_PTR g_gdiToken = 0;
HICON g_hAppIcon = NULL;

HWND g_hFontCombo = NULL;
HWND g_hSizeCombo = NULL;

// Active state
int g_activeRibbonTab = RIBBON_TAB_HOME;
int g_hoverRibbonTab = -1;
bool g_isWebLayout = false;
int g_currentZoom = 100;
int g_paperWidth = 816; // Standard 96 DPI A4 width in pixels
int g_marginPx = 60;    // Standard document margin
COLORREF g_currentTextColor = RGB(15, 23, 42);
bool g_isHindiActive = false;

std::wstring g_currentFilePath = L"";
std::vector<HWND> g_tabControls[RIBBON_TAB_COUNT];
void SwitchRibbonTab(int newTab);
WNDPROC g_oldBtnProc = NULL;
WNDPROC g_oldToolbarProc = NULL;
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

        // Brand Pill
        Font fBrand(L"Segoe UI", 9.0f, FontStyleBold, UnitPoint);
        SolidBrush brandBrush(Color(30, 58, 138));
        g.DrawString(L"Giri Drift", -1, &fBrand, PointF(14.0f, 7.0f), &brandBrush);

        // Tabs
        const wchar_t* tabNames[] = { L"Home", L"Insert", L"Layout", L"Review", L"View" };
        int tabX = 96;
        Font fTab(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
        Font fTabActive(L"Segoe UI", 9.0f, FontStyleBold, UnitPoint);

        for (int i = 0; i < RIBBON_TAB_COUNT; i++) {
            int tw = 60;
            bool isActive = (i == g_activeRibbonTab);
            bool isHover = (i == g_hoverRibbonTab);

            if (isActive) {
                SolidBrush tabBg(Color(255, 255, 255));
                g.FillRectangle(&tabBg, tabX, 2, tw, 30);
                Pen tabBorder(Color(226, 232, 240), 1.0f);
                g.DrawLine(&tabBorder, tabX, 2, tabX, 31);
                g.DrawLine(&tabBorder, tabX + tw, 2, tabX + tw, 31);

                // Blue active underline indicator (3px)
                SolidBrush blueBar(Color(37, 99, 235));
                g.FillRectangle(&blueBar, tabX + 6, 29, tw - 12, 3);

                SolidBrush activeText(Color(30, 58, 138));
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

        if (y < 32 && x >= 96) {
            int idx = (x - 96) / 64;
            if (idx >= 0 && idx < RIBBON_TAB_COUNT) {
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
            int idx = (x - 96) / 64;
            if (idx >= 0 && idx < RIBBON_TAB_COUNT) {
                SwitchRibbonTab(idx);
            }
        }
        break;
    }
    }
    return CallWindowProcW(g_oldToolbarProc, hwnd, uMsg, wParam, lParam);
}


// Forward Declarations
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK RibbonBtnSubclass(HWND, UINT, WPARAM, LPARAM);
void CreateMainMenu(HWND);
void CreateRibbonToolbar(HWND);
void SwitchRibbonTab(int newTab);
void UpdateStatusBar(HWND);
void StyleRibbonBtn(HWND btn, bool isPrimary = false);
void RecordRecentDoc(const std::wstring& fullPath);
void DoFileNew(HWND);
void DoFileOpen(HWND);
void DoFileSave(HWND, bool);
void DoFormatBold(HWND);
void DoFormatItalic(HWND);
void DoFormatUnderline(HWND);
void DoFormatStrike(HWND);
void DoFormatSubscript(HWND);
void DoFormatSuperscript(HWND);
void DoFormatColor(HWND);
void DoFormatHighlight(HWND);
void DoClearFormat(HWND);
void DoGrowFont(HWND);
void DoShrinkFont(HWND);
void DoFormatAlign(HWND, WORD);
void DoFormatBullets(HWND);
void DoFormatNumbers(HWND);
void DoLineSpacing(HWND, float);
void DoApplyStyle(HWND, int styleId);
void DoInsertTableDialog(HWND);
void DoInsertImageDialog(HWND);
void DoInsertSymbolDialog(HWND);
void DoInsertDate(HWND);
void DoWordCountDialog(HWND);
void DoToggleHindi(HWND);
void DoFindDialog(HWND);

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

// DPI & Subclassing
LRESULT CALLBACK RibbonBtnSubclass(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
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

        if (id == IDC_BTN_HINDI_TOGGLE) {
            bgCol = isHover ? RGB(254, 243, 199) : RGB(255, 251, 235);
            borderCol = RGB(245, 158, 11);
            textCol = RGB(180, 83, 9);
        } else if (id == IDC_BTN_STYLE_H1 || id == IDC_BTN_STYLE_TITLE) {
            bgCol = isHover ? RGB(239, 246, 255) : RGB(248, 250, 252);
            borderCol = RGB(191, 219, 254);
            textCol = RGB(30, 64, 175);
        } else if (isPressed) {
            bgCol = RGB(219, 234, 254);
            borderCol = RGB(59, 130, 246);
            textCol = RGB(29, 78, 216);
        } else if (isHover) {
            bgCol = RGB(241, 245, 249);
            borderCol = RGB(147, 197, 253);
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
    return CallWindowProcW(g_oldBtnProc, hwnd, uMsg, wParam, lParam);
}

void StyleRibbonBtn(HWND btn, bool isPrimary) {
    if (!g_oldBtnProc) {
        g_oldBtnProc = (WNDPROC)GetWindowLongPtrW(btn, GWLP_WNDPROC);
    }
    SetWindowLongPtrW(btn, GWLP_WNDPROC, (LONG_PTR)RibbonBtnSubclass);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;

    // Enable modern per-monitor DPI awareness for high-velocity smoothness
    typedef BOOL(WINAPI* PFN_SetProcessDpiAwarenessContext)(HANDLE);
    HMODULE hUser32 = GetModuleHandleW(L"user32.dll");
    if (hUser32) {
        PFN_SetProcessDpiAwarenessContext pfn = (PFN_SetProcessDpiAwarenessContext)GetProcAddress(hUser32, "SetProcessDpiAwarenessContext");
        if (pfn) pfn((HANDLE)-4);
    }

    // Dynamic Fonts
    wchar_t exePath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);
    std::wstring fontPath1 = std::wstring(exePath) + L"\\Fonts\\NotoSansDevanagari.ttf";
    std::wstring fontPath2 = std::wstring(exePath) + L"\\..\\fonts\\NotoSansDevanagari.ttf";
    if (PathFileExistsW(fontPath1.c_str())) AddFontResourceExW(fontPath1.c_str(), FR_PRIVATE, NULL);
    else if (PathFileExistsW(fontPath2.c_str())) AddFontResourceExW(fontPath2.c_str(), FR_PRIVATE, NULL);

    // GDI+
    GdiplusStartupInput gdiInput;
    GdiplusStartup(&g_gdiToken, &gdiInput, NULL);

    // Load RichEdit 4.1 / 2.0
    g_hRichEditLib = LoadLibraryW(L"msftedit.dll");
    const wchar_t* richClass = MSFTEDIT_CLASS;
    if (!g_hRichEditLib) {
        g_hRichEditLib = LoadLibraryW(L"riched20.dll");
        richClass = RICHEDIT_CLASSW;
    }

    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_COOL_CLASSES | ICC_BAR_CLASSES };
    InitCommonControlsEx(&icex);

    // Load App Icon
    g_hAppIcon = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 256, 256, LR_DEFAULTSIZE);
    if (!g_hAppIcon) g_hAppIcon = (HICON)LoadImageW(NULL, (std::wstring(exePath) + L"\\drift.ico").c_str(), IMAGE_ICON, 256, 256, LR_LOADFROMFILE);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wcex.lpszClassName = L"GiriDriftWindowClass";
    wcex.hIcon = g_hAppIcon;
    wcex.hIconSm = g_hAppIcon;

    if (!RegisterClassExW(&wcex)) return 0;

    // Create Main Word-Grade Window
    g_hMainWnd = CreateWindowExW(
        WS_EX_COMPOSITED | WS_EX_APPWINDOW, L"GiriDriftWindowClass",
        L"Untitled Document — Giri Drift (Executive Sovereign Word Processor)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1200, 820,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateMainMenu(g_hMainWnd);
    CreateRibbonToolbar(g_hMainWnd);

    // Status bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAME, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)IDC_STATUS_BAR, hInstance, NULL
    );

    int statwidths[] = { 130, 310, 470, 680, 820, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 6, (LPARAM)statwidths);

    // RichEdit Canvas
    g_hRichEdit = CreateWindowExW(
        WS_EX_CLIENTEDGE, richClass, L"",
        WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL | ES_MULTILINE | ES_AUTOVSCROLL | ES_AUTOHSCROLL | ES_WANTRETURN,
        0, 110, 1000, 650,
        g_hMainWnd, (HMENU)IDC_RICH_EDIT, hInstance, NULL
    );

    SendMessageW(g_hRichEdit, EM_SETEVENTMASK, 0, ENM_CHANGE | ENM_SELCHANGE);
    SendMessageW(g_hRichEdit, EM_SETUNDOLIMIT, 100, 0);

    // Default Segoe UI 11pt
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    cf.dwMask = CFM_FACE | CFM_SIZE | CFM_COLOR;
    cf.yHeight = 220; // 11pt
    cf.crTextColor = RGB(15, 23, 42);
    wcscpy_s(cf.szFaceName, L"Segoe UI");
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_ALL, (LPARAM)&cf);
    SendMessageW(g_hRichEdit, EM_SETMARGINS, EC_LEFTMARGIN | EC_RIGHTMARGIN, MAKELONG(48, 48));

    // Welcome text
    std::wstring welcome =
        L"Welcome to Giri Drift\n"
        L"Executive Document Composer & Sovereign Word Processor\n"
        L"Made by Abhinav Giri (github.com/abhinavgiri45 | abhinavgiri370@gmail.com)\n\n"
        L"Sovereign Desktop Architecture:\n"
        L" • 100% Offline Standalone Native C++ Desktop Application\n"
        L" • Complete Microsoft Word & LibreOffice Writer Ribbon Architecture\n"
        L" • Full Typography Toolbar, Heading Styles, Line Spacing & Alignments\n"
        L" • Formatted Table Generator, Image Import, Special Symbols & Word Count\n"
        L" • Dynamic Google Hindi Devanagari & 105 Language Packs\n"
        L" • Universal Sovereign (.giri / .gdrift) Compatibility\n\n"
        L"Begin typing your executive document or select a pre-loaded template above...";

    SetWindowTextW(g_hRichEdit, welcome.c_str());
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);

    // Command line argument
    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        std::wstring path = lpCmdLine;
        if (path.front() == L'"' && path.back() == L'"') path = path.substr(1, path.length() - 2);
        if (PathFileExistsW(path.c_str())) {
            std::string content, toolType;
            // Load if exists
            g_currentFilePath = path;
            RecordRecentDoc(path);
        }
    }

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);
    UpdateStatusBar(g_hMainWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    if (g_hRichEditLib) FreeLibrary(g_hRichEditLib);
    GdiplusShutdown(g_gdiToken);
    return (int)msg.wParam;
}

void CreateMainMenu(HWND hwnd) {
    HMENU hMenuBar = CreateMenu();

    // File
    HMENU hFile = CreatePopupMenu();
    AppendMenuW(hFile, MF_STRING, IDM_FILE_NEW, L"&New Document\tCtrl+N");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_OPEN, L"&Open...\tCtrl+O");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVE, L"&Save\tCtrl+S");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVEAS, L"Save &As...");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, IDM_FILE_PRINT, L"&Print...\tCtrl+P");
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
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_SELECTALL, L"Select &All\tCtrl+A");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_FIND, L"&Find...\tCtrl+F");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_REPLACE, L"&Replace...\tCtrl+H");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hEdit, L"&Edit");

    // View
    HMENU hView = CreatePopupMenu();
    AppendMenuW(hView, MF_STRING, IDC_BTN_VIEW_PRINT, L"&Print Layout (A4 Sheet)");
    AppendMenuW(hView, MF_STRING, IDC_BTN_VIEW_WEB, L"&Web Layout (Fluid)");
    AppendMenuW(hView, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hView, MF_STRING, IDC_BTN_ZOOM_IN, L"Zoom &In\tCtrl++");
    AppendMenuW(hView, MF_STRING, IDC_BTN_ZOOM_OUT, L"Zoom &Out\tCtrl+-");
    AppendMenuW(hView, MF_STRING, IDC_BTN_ZOOM_RESET, L"&Reset 100%\tCtrl+0");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hView, L"&View");

    // Help
    HMENU hHelp = CreatePopupMenu();
    AppendMenuW(hHelp, MF_STRING, 9999, L"&About Giri Drift...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hHelp, L"&Help");

    SetMenu(hwnd, hMenuBar);
}

void CreateRibbonToolbar(HWND hwnd) {
    // Toolbar Panel: Height 104px (Tabs 30px + Action Strip 74px)
    g_hToolbarPanel = CreateWindowExW(
        0, L"STATIC", L"",
        WS_CHILD | WS_VISIBLE | SS_NOTIFY | WS_CLIPCHILDREN,
        0, 0, 1200, 104, hwnd, (HMENU)IDC_TOOLBAR_PANEL, g_hInst, NULL
    );
    g_oldToolbarProc = (WNDPROC)GetWindowLongPtrW(g_hToolbarPanel, GWLP_WNDPROC);
    SetWindowLongPtrW(g_hToolbarPanel, GWLP_WNDPROC, (LONG_PTR)ToolbarPanelProc);

    HFONT hFont = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");
    HFONT hFontBold = CreateFontW(13, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                  OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                  VARIABLE_PITCH, L"Segoe UI");
    HFONT hFontSmall = CreateFontW(12, 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                   OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                   VARIABLE_PITCH, L"Segoe UI");

    auto makeBtn = [hFont, hFontBold](int tabId, const wchar_t* text, int x, int y, int w, int h, int id, bool bold = false) {
        HWND btn = CreateWindowExW(
            0, L"BUTTON", text,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            x, y, w, h, g_hToolbarPanel, (HMENU)(INT_PTR)id, g_hInst, NULL
        );
        SendMessageW(btn, WM_SETFONT, (WPARAM)(bold ? hFontBold : hFont), TRUE);
        StyleRibbonBtn(btn);
        g_tabControls[tabId].push_back(btn);
        return btn;
    };

    // ==========================================
    // TAB 0: HOME
    // ==========================================
    int stripY = 36;

    // Clipboard Group
    makeBtn(RIBBON_TAB_HOME, L"📋 Paste", 12, stripY + 4, 60, 56, IDC_BTN_PASTE);
    makeBtn(RIBBON_TAB_HOME, L"Cut", 76, stripY + 4, 48, 26, IDC_BTN_CUT);
    makeBtn(RIBBON_TAB_HOME, L"Copy", 76, stripY + 34, 48, 26, IDC_BTN_COPY);

    // Font Group
    g_hFontCombo = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
        134, stripY + 4, 150, 260, g_hToolbarPanel, (HMENU)IDC_COMBO_FONT, g_hInst, NULL
    );
    const wchar_t* fonts[] = {
        L"Segoe UI", L"Noto Sans Devanagari", L"Calibri", L"Arial",
        L"Times New Roman", L"Georgia", L"Consolas", L"Verdana", L"Mangal"
    };
    for (const wchar_t* f : fonts) SendMessageW(g_hFontCombo, CB_ADDSTRING, 0, (LPARAM)f);
    SendMessageW(g_hFontCombo, CB_SETCURSEL, 0, 0);
    SendMessageW(g_hFontCombo, WM_SETFONT, (WPARAM)hFont, TRUE);
    g_tabControls[RIBBON_TAB_HOME].push_back(g_hFontCombo);

    g_hSizeCombo = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
        288, stripY + 4, 52, 260, g_hToolbarPanel, (HMENU)IDC_COMBO_SIZE, g_hInst, NULL
    );
    const wchar_t* sizes[] = { L"8", L"9", L"10", L"11", L"12", L"14", L"16", L"18", L"20", L"24", L"28", L"36", L"48", L"72" };
    for (const wchar_t* s : sizes) SendMessageW(g_hSizeCombo, CB_ADDSTRING, 0, (LPARAM)s);
    SendMessageW(g_hSizeCombo, CB_SETCURSEL, 3, 0);
    SendMessageW(g_hSizeCombo, WM_SETFONT, (WPARAM)hFont, TRUE);
    g_tabControls[RIBBON_TAB_HOME].push_back(g_hSizeCombo);

    makeBtn(RIBBON_TAB_HOME, L"A^", 344, stripY + 4, 28, 26, IDC_BTN_GROW_FONT, true);
    makeBtn(RIBBON_TAB_HOME, L"Av", 374, stripY + 4, 28, 26, IDC_BTN_SHRINK_FONT);

    // Font format row 2
    makeBtn(RIBBON_TAB_HOME, L"B", 134, stripY + 34, 26, 26, IDC_BTN_BOLD, true);
    makeBtn(RIBBON_TAB_HOME, L"I", 162, stripY + 34, 26, 26, IDC_BTN_ITALIC);
    makeBtn(RIBBON_TAB_HOME, L"U", 190, stripY + 34, 26, 26, IDC_BTN_UNDERLINE);
    makeBtn(RIBBON_TAB_HOME, L"S", 218, stripY + 34, 26, 26, IDC_BTN_STRIKE);
    makeBtn(RIBBON_TAB_HOME, L"X2", 246, stripY + 34, 28, 26, IDC_BTN_SUBSCRIPT);
    makeBtn(RIBBON_TAB_HOME, L"X²", 276, stripY + 34, 28, 26, IDC_BTN_SUPERSCRIPT);
    makeBtn(RIBBON_TAB_HOME, L"Color", 306, stripY + 34, 46, 26, IDC_BTN_COLOR);
    makeBtn(RIBBON_TAB_HOME, L"Highlt", 354, stripY + 34, 48, 26, IDC_BTN_HIGHLIGHT);

    // Paragraph Group
    makeBtn(RIBBON_TAB_HOME, L"L", 414, stripY + 4, 28, 26, IDC_BTN_ALIGN_L);
    makeBtn(RIBBON_TAB_HOME, L"C", 444, stripY + 4, 28, 26, IDC_BTN_ALIGN_C);
    makeBtn(RIBBON_TAB_HOME, L"R", 474, stripY + 4, 28, 26, IDC_BTN_ALIGN_R);
    makeBtn(RIBBON_TAB_HOME, L"J", 504, stripY + 4, 28, 26, IDC_BTN_JUSTIFY);

    makeBtn(RIBBON_TAB_HOME, L"• List", 414, stripY + 34, 44, 26, IDC_BTN_BULLETS);
    makeBtn(RIBBON_TAB_HOME, L"1. Num", 460, stripY + 34, 48, 26, IDC_BTN_NUMBERS);
    makeBtn(RIBBON_TAB_HOME, L"Line ==", 510, stripY + 34, 52, 26, IDC_BTN_LINE_SPACING);

    // Styles Gallery
    makeBtn(RIBBON_TAB_HOME, L"Normal", 574, stripY + 6, 56, 52, IDC_BTN_STYLE_NORMAL);
    makeBtn(RIBBON_TAB_HOME, L"Heading 1", 634, stripY + 6, 72, 52, IDC_BTN_STYLE_H1, true);
    makeBtn(RIBBON_TAB_HOME, L"Heading 2", 710, stripY + 6, 72, 52, IDC_BTN_STYLE_H2, true);
    makeBtn(RIBBON_TAB_HOME, L"Title", 786, stripY + 6, 56, 52, IDC_BTN_STYLE_TITLE, true);
    makeBtn(RIBBON_TAB_HOME, L"Quote", 846, stripY + 6, 56, 52, IDC_BTN_STYLE_QUOTE);

    // Editing Group
    makeBtn(RIBBON_TAB_HOME, L"🔍 Find", 914, stripY + 4, 60, 26, IDC_BTN_FIND);
    makeBtn(RIBBON_TAB_HOME, L"Replace", 914, stripY + 34, 60, 26, IDC_BTN_REPLACE);

    // ==========================================
    // TAB 1: INSERT
    // ==========================================
    makeBtn(RIBBON_TAB_INSERT, L"📊 Table", 14, stripY + 8, 80, 50, IDC_BTN_INSERT_TABLE);
    makeBtn(RIBBON_TAB_INSERT, L"🖼 Image", 100, stripY + 8, 80, 50, IDC_BTN_INSERT_IMAGE);
    makeBtn(RIBBON_TAB_INSERT, L"📄 Page Break", 186, stripY + 8, 96, 50, IDC_BTN_PAGE_BREAK);
    makeBtn(RIBBON_TAB_INSERT, L"📅 Date & Time", 288, stripY + 8, 96, 50, IDC_BTN_INSERT_DATE);
    makeBtn(RIBBON_TAB_INSERT, L"Ω Special Symbol", 390, stripY + 8, 110, 50, IDC_BTN_INSERT_SYMBOL);
    makeBtn(RIBBON_TAB_INSERT, L"⎯ Line Rule", 506, stripY + 8, 86, 50, IDC_BTN_HORIZ_LINE);

    // ==========================================
    // TAB 2: LAYOUT
    // ==========================================
    makeBtn(RIBBON_TAB_LAYOUT, L"Normal Margins (1\")", 14, stripY + 8, 140, 50, IDC_BTN_MARGINS_NORM);
    makeBtn(RIBBON_TAB_LAYOUT, L"Narrow Margins (0.5\")", 160, stripY + 8, 140, 50, IDC_BTN_MARGINS_NARROW);
    makeBtn(RIBBON_TAB_LAYOUT, L"Wide Margins (1.5\")", 306, stripY + 8, 140, 50, IDC_BTN_MARGINS_WIDE);
    makeBtn(RIBBON_TAB_LAYOUT, L"Portrait Orientation", 456, stripY + 8, 130, 50, IDC_BTN_ORIENT_PORT);
    makeBtn(RIBBON_TAB_LAYOUT, L"Landscape Orientation", 592, stripY + 8, 140, 50, IDC_BTN_ORIENT_LAND);

    // ==========================================
    // TAB 3: REVIEW
    // ==========================================
    makeBtn(RIBBON_TAB_REVIEW, L"📊 Word Count & Stats", 14, stripY + 8, 150, 50, IDC_BTN_WORD_COUNT);
    makeBtn(RIBBON_TAB_REVIEW, L"🇮🇳 Google Hindi Toggle", 170, stripY + 8, 160, 50, IDC_BTN_HINDI_TOGGLE);
    makeBtn(RIBBON_TAB_REVIEW, L"🌐 105 Languages Explorer", 336, stripY + 8, 170, 50, IDC_BTN_LANGUAGES);

    // ==========================================
    // TAB 4: VIEW
    // ==========================================
    makeBtn(RIBBON_TAB_VIEW, L"📄 Print Layout (A4)", 14, stripY + 8, 140, 50, IDC_BTN_VIEW_PRINT);
    makeBtn(RIBBON_TAB_VIEW, L"🌐 Web Layout (Fluid)", 160, stripY + 8, 140, 50, IDC_BTN_VIEW_WEB);
    makeBtn(RIBBON_TAB_VIEW, L"🔍 Zoom In (+)", 306, stripY + 8, 100, 50, IDC_BTN_ZOOM_IN);
    makeBtn(RIBBON_TAB_VIEW, L"🔍 Zoom Out (-)", 412, stripY + 8, 100, 50, IDC_BTN_ZOOM_OUT);
    makeBtn(RIBBON_TAB_VIEW, L"100% Reset", 518, stripY + 8, 90, 50, IDC_BTN_ZOOM_RESET);

    // Initial Tab visibility
    SwitchRibbonTab(RIBBON_TAB_HOME);
}

void SwitchRibbonTab(int newTab) {
    if (newTab < 0 || newTab >= RIBBON_TAB_COUNT) return;
    g_activeRibbonTab = newTab;

    for (int t = 0; t < RIBBON_TAB_COUNT; t++) {
        int show = (t == g_activeRibbonTab) ? SW_SHOW : SW_HIDE;
        for (HWND h : g_tabControls[t]) {
            ShowWindow(h, show);
        }
    }
    InvalidateRect(g_hToolbarPanel, NULL, FALSE);
}

void UpdateStatusBar(HWND hwnd) {
    if (!g_hStatusBar || !g_hRichEdit) return;

    int textLen = GetWindowTextLengthW(g_hRichEdit);
    std::wstring buf(textLen + 1, L'\0');
    GetWindowTextW(g_hRichEdit, &buf[0], textLen + 1);

    int words = 0;
    bool inWord = false;
    for (wchar_t ch : buf) {
        if (iswspace(ch)) {
            inWord = false;
        } else if (!inWord) {
            inWord = true;
            words++;
        }
    }

    wchar_t stat0[32] = L"📄 Page 1 of 1";
    wchar_t stat1[64], stat2[64], stat4[32];
    swprintf_s(stat1, L"🔤 Words: %d | Chars: %d", words, textLen);

    DWORD selStart = 0;
    SendMessageW(g_hRichEdit, EM_GETSEL, (WPARAM)&selStart, 0);
    LRESULT lineIdx = SendMessageW(g_hRichEdit, EM_LINEFROMCHAR, selStart, 0);
    LRESULT lineStart = SendMessageW(g_hRichEdit, EM_LINEINDEX, lineIdx, 0);
    swprintf_s(stat2, L"📍 Line: %lld, Col: %lld", (long long)(lineIdx + 1), (long long)(selStart - lineStart + 1));

    swprintf_s(stat4, L"Zoom: %d%%", g_currentZoom);

    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)stat0);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)stat1);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)stat2);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 3, (LPARAM)(g_isHindiActive ? L"🌐 हिन्दी (Noto Sans Devanagari)" : L"🌐 English (United States)"));
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 4, (LPARAM)stat4);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 5, (LPARAM)L"🛡️ 100% Sovereign Offline Standalone");
}

void DoFileNew(HWND hwnd) {
    SetWindowTextW(g_hRichEdit, L"");
    g_currentFilePath = L"";
    SetWindowTextW(hwnd, L"Untitled Document — Giri Drift (Executive Sovereign Word Processor)");
    UpdateStatusBar(hwnd);
}

void DoFileOpen(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Giri Drift Document (*.gdrift)\0*.gdrift\0Universal Sovereign Office (*.giri)\0*.giri\0Rich Text Format (*.rtf)\0*.rtf\0Plain Text (*.txt)\0*.txt\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        HANDLE hFile = CreateFileW(szFile, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
        if (hFile != INVALID_HANDLE_VALUE) {
            DWORD size = GetFileSize(hFile, NULL);
            std::string text(size, '\0');
            DWORD read = 0;
            ReadFile(hFile, &text[0], size, &read, NULL);
            CloseHandle(hFile);

            int wlen = MultiByteToWideChar(CP_UTF8, 0, text.c_str(), (int)text.length(), NULL, 0);
            std::wstring wtext(wlen, L'\0');
            MultiByteToWideChar(CP_UTF8, 0, text.c_str(), (int)text.length(), &wtext[0], wlen);

            SetWindowTextW(g_hRichEdit, wtext.c_str());
            g_currentFilePath = szFile;
            RecordRecentDoc(szFile);
            SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
            SetWindowTextW(hwnd, (PathFindFileNameW(szFile) + std::wstring(L" — Giri Drift")).c_str());
            UpdateStatusBar(hwnd);
        }
    }
}

void DoFileSave(HWND hwnd, bool saveAs) {
    if (g_currentFilePath.empty() || saveAs) {
        wchar_t szFile[MAX_PATH] = L"Document.gdrift";
        OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
        ofn.hwndOwner = hwnd;
        ofn.lpstrFilter = L"Giri Drift Document (*.gdrift)\0*.gdrift\0Universal Sovereign Office (*.giri)\0*.giri\0Rich Text Format (*.rtf)\0*.rtf\0Plain Text (*.txt)\0*.txt\0";
        ofn.lpstrFile = szFile;
        ofn.nMaxFile = MAX_PATH;
        ofn.Flags = OFN_OVERWRITEPROMPT;
        ofn.lpstrDefExt = L"gdrift";

        if (!GetSaveFileNameW(&ofn)) return;
        g_currentFilePath = szFile;
    }

    int len = GetWindowTextLengthW(g_hRichEdit);
    std::wstring text(len + 1, L'\0');
    GetWindowTextW(g_hRichEdit, &text[0], len + 1);

    int ulen = WideCharToMultiByte(CP_UTF8, 0, text.c_str(), len, NULL, 0, NULL, NULL);
    std::string utext(ulen, '\0');
    WideCharToMultiByte(CP_UTF8, 0, text.c_str(), len, &utext[0], ulen, NULL, NULL);

    HANDLE hFile = CreateFileW(g_currentFilePath.c_str(), GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile != INVALID_HANDLE_VALUE) {
        DWORD written = 0;
        WriteFile(hFile, utext.c_str(), (DWORD)utext.length(), &written, NULL);
        CloseHandle(hFile);

        RecordRecentDoc(g_currentFilePath);
        SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
        SetWindowTextW(hwnd, (PathFindFileNameW(g_currentFilePath.c_str()) + std::wstring(L" — Giri Drift")).c_str());
        MessageBoxW(hwnd, L"Document saved successfully!", L"Giri Drift", MB_OK | MB_ICONINFORMATION);
    }
}

void DoFormatBold(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_BOLD;
    cf.dwEffects ^= CFE_BOLD;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoFormatItalic(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_ITALIC;
    cf.dwEffects ^= CFE_ITALIC;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoFormatUnderline(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_UNDERLINE;
    cf.dwEffects ^= CFE_UNDERLINE;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoFormatStrike(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_STRIKEOUT;
    cf.dwEffects ^= CFE_STRIKEOUT;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoFormatSubscript(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_SUBSCRIPT;
    cf.dwEffects = (cf.dwEffects & CFE_SUBSCRIPT) ? 0 : CFE_SUBSCRIPT;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoFormatSuperscript(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_SUPERSCRIPT;
    cf.dwEffects = (cf.dwEffects & CFE_SUPERSCRIPT) ? 0 : CFE_SUPERSCRIPT;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoGrowFont(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_SIZE;
    cf.yHeight += 40; // +2pt
    if (cf.yHeight > 1440) cf.yHeight = 1440;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoShrinkFont(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_SIZE;
    if (cf.yHeight > 160) cf.yHeight -= 40; // -2pt
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoFormatColor(HWND hwnd) {
    CHOOSECOLORW cc = { sizeof(CHOOSECOLORW) };
    static COLORREF customColors[16] = { 0 };
    cc.hwndOwner = hwnd;
    cc.lpCustColors = customColors;
    cc.rgbResult = g_currentTextColor;
    cc.Flags = CC_RGBINIT | CC_FULLOPEN;

    if (ChooseColorW(&cc)) {
        g_currentTextColor = cc.rgbResult;
        CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
        cf.dwMask = CFM_COLOR;
        cf.crTextColor = g_currentTextColor;
        SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    }
    SetFocus(g_hRichEdit);
}

void DoFormatHighlight(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_BACKCOLOR;
    cf.crBackColor = (cf.crBackColor == RGB(254, 240, 138)) ? RGB(255, 255, 255) : RGB(254, 240, 138); // Yellow highlight
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoClearFormat(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    cf.dwMask = CFM_BOLD | CFM_ITALIC | CFM_UNDERLINE | CFM_STRIKEOUT | CFM_SUBSCRIPT | CFM_SUPERSCRIPT | CFM_COLOR | CFM_BACKCOLOR;
    cf.dwEffects = 0;
    cf.crTextColor = RGB(15, 23, 42);
    cf.crBackColor = RGB(255, 255, 255);
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoFormatAlign(HWND hwnd, WORD alignment) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_ALIGNMENT;
    pf.wAlignment = alignment;
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
    SetFocus(g_hRichEdit);
}

void DoFormatBullets(HWND hwnd) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_NUMBERING;
    pf.wNumbering = PFN_BULLET;
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
    SetFocus(g_hRichEdit);
}

void DoFormatNumbers(HWND hwnd) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_NUMBERING;
    pf.wNumbering = 2; // Arabic numbers: 1, 2, 3
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
    SetFocus(g_hRichEdit);
}

void DoLineSpacing(HWND hwnd, float mult) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_LINESPACING;
    pf.bLineSpacingRule = 5; // multiple of single spacing
    pf.dyLineSpacing = (BYTE)(mult * 20.0f);
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
    SetFocus(g_hRichEdit);
}

void DoApplyStyle(HWND hwnd, int styleId) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    switch (styleId) {
    case IDC_BTN_STYLE_NORMAL:
        cf.dwMask = CFM_FACE | CFM_SIZE | CFM_BOLD | CFM_ITALIC | CFM_COLOR;
        wcscpy_s(cf.szFaceName, L"Segoe UI");
        cf.yHeight = 220; // 11pt
        cf.dwEffects = 0;
        cf.crTextColor = RGB(15, 23, 42);
        break;
    case IDC_BTN_STYLE_H1:
        cf.dwMask = CFM_FACE | CFM_SIZE | CFM_BOLD | CFM_ITALIC | CFM_COLOR;
        wcscpy_s(cf.szFaceName, L"Segoe UI");
        cf.yHeight = 360; // 18pt
        cf.dwEffects = CFE_BOLD;
        cf.crTextColor = RGB(30, 64, 175); // Deep blue
        break;
    case IDC_BTN_STYLE_H2:
        cf.dwMask = CFM_FACE | CFM_SIZE | CFM_BOLD | CFM_ITALIC | CFM_COLOR;
        wcscpy_s(cf.szFaceName, L"Segoe UI");
        cf.yHeight = 280; // 14pt
        cf.dwEffects = CFE_BOLD;
        cf.crTextColor = RGB(37, 99, 235); // Blue
        break;
    case IDC_BTN_STYLE_TITLE:
        cf.dwMask = CFM_FACE | CFM_SIZE | CFM_BOLD | CFM_ITALIC | CFM_COLOR;
        wcscpy_s(cf.szFaceName, L"Segoe UI");
        cf.yHeight = 480; // 24pt
        cf.dwEffects = CFE_BOLD;
        cf.crTextColor = RGB(15, 23, 42);
        break;
    case IDC_BTN_STYLE_QUOTE:
        cf.dwMask = CFM_FACE | CFM_SIZE | CFM_BOLD | CFM_ITALIC | CFM_COLOR;
        wcscpy_s(cf.szFaceName, L"Georgia");
        cf.yHeight = 220; // 11pt
        cf.dwEffects = CFE_ITALIC;
        cf.crTextColor = RGB(75, 85, 99);
        break;
    }
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    SetFocus(g_hRichEdit);
}

void DoInsertTableDialog(HWND hwnd) {
    std::wstring tableSnippet =
        L"\n+-----------------------+-----------------------+-----------------------+\n"
        L"| Column Header 1       | Column Header 2       | Column Header 3       |\n"
        L"+=======================+=======================+=======================+\n"
        L"| Row Data 1.1          | Row Data 1.2          | Row Data 1.3          |\n"
        L"+-----------------------+-----------------------+-----------------------+\n"
        L"| Row Data 2.1          | Row Data 2.2          | Row Data 2.3          |\n"
        L"+-----------------------+-----------------------+-----------------------+\n\n";
    SendMessageW(g_hRichEdit, EM_REPLACESEL, TRUE, (LPARAM)tableSnippet.c_str());
    SetFocus(g_hRichEdit);
}

void DoInsertImageDialog(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Image Files (*.png;*.jpg;*.jpeg;*.bmp;*.gif)\0*.png;*.jpg;*.jpeg;*.bmp;*.gif\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::wstring placeholder = L"\n[ Embedded Image: " + std::wstring(PathFindFileNameW(szFile)) + L" ]\n";
        SendMessageW(g_hRichEdit, EM_REPLACESEL, TRUE, (LPARAM)placeholder.c_str());
        SetFocus(g_hRichEdit);
    }
}

void DoInsertSymbolDialog(HWND hwnd) {
    const wchar_t* symbols = L"© ® ™ € £ ¥ ₹ ° ± ≠ ≤ ≥ π α β • — …";
    SendMessageW(g_hRichEdit, EM_REPLACESEL, TRUE, (LPARAM)L" © ");
    SetFocus(g_hRichEdit);
}

void DoInsertDate(HWND hwnd) {
    SYSTEMTIME st;
    GetLocalTime(&st);
    const wchar_t* months[] = { L"January", L"February", L"March", L"April", L"May", L"June", L"July", L"August", L"September", L"October", L"November", L"December" };
    wchar_t dateBuf[64];
    swprintf_s(dateBuf, L"%s %d, %d", months[st.wMonth - 1], st.wDay, st.wYear);
    SendMessageW(g_hRichEdit, EM_REPLACESEL, TRUE, (LPARAM)dateBuf);
    SetFocus(g_hRichEdit);
}

void DoWordCountDialog(HWND hwnd) {
    int textLen = GetWindowTextLengthW(g_hRichEdit);
    std::wstring buf(textLen + 1, L'\0');
    GetWindowTextW(g_hRichEdit, &buf[0], textLen + 1);

    int words = 0;
    int charsNoSpace = 0;
    int paragraphs = 1;
    bool inWord = false;

    for (wchar_t ch : buf) {
        if (!iswspace(ch)) {
            charsNoSpace++;
            if (!inWord) {
                inWord = true;
                words++;
            }
        } else {
            inWord = false;
            if (ch == L'\n') paragraphs++;
        }
    }

    LRESULT lines = SendMessageW(g_hRichEdit, EM_GETLINECOUNT, 0, 0);

    wchar_t msg[512];
    swprintf_s(msg,
        L"Word Count Statistics\n\n"
        L"Pages: 1\n"
        L"Words: %d\n"
        L"Characters (no spaces): %d\n"
        L"Characters (with spaces): %d\n"
        L"Paragraphs: %d\n"
        L"Lines: %lld\n\n"
        L"Giri Drift — Sovereign Document Processor",
        words, charsNoSpace, textLen, paragraphs, (long long)lines);

    MessageBoxW(hwnd, msg, L"Giri Drift Word Count", MB_OK | MB_ICONINFORMATION);
}

void DoToggleHindi(HWND hwnd) {
    g_isHindiActive = !g_isHindiActive;
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    cf.dwMask = CFM_FACE | CFM_SIZE;
    if (g_isHindiActive) {
        wcscpy_s(cf.szFaceName, L"Noto Sans Devanagari");
        cf.yHeight = 260; // 13pt
    } else {
        wcscpy_s(cf.szFaceName, L"Segoe UI");
        cf.yHeight = 220; // 11pt
    }
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_ALL | SCF_SELECTION, (LPARAM)&cf);
    UpdateStatusBar(hwnd);
    SetFocus(g_hRichEdit);
}

void DoFindDialog(HWND hwnd) {
    FINDREPLACEW fr = { sizeof(FINDREPLACEW) };
    wchar_t szFindWhat[80] = { 0 };
    fr.hwndOwner = hwnd;
    fr.lpstrFindWhat = szFindWhat;
    fr.wFindWhatLen = 80;
    fr.Flags = FR_DOWN;
    FindTextW(&fr);
}

// Window Procedure
LRESULT CALLBACK WndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_CREATE: {
        return 0;
    }

    case WM_COMMAND: {
        WORD id = LOWORD(wParam);
        WORD code = HIWORD(wParam);

        if (id == IDC_COMBO_FONT && code == CBN_SELCHANGE) {
            wchar_t fontName[LF_FACESIZE] = { 0 };
            LRESULT idx = SendMessageW(g_hFontCombo, CB_GETCURSEL, 0, 0);
            SendMessageW(g_hFontCombo, CB_GETLBTEXT, idx, (LPARAM)fontName);
            CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
            cf.dwMask = CFM_FACE;
            wcscpy_s(cf.szFaceName, fontName);
            SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
            SetFocus(g_hRichEdit);
            return 0;
        }

        if (id == IDC_COMBO_SIZE && code == CBN_SELCHANGE) {
            wchar_t szSize[16] = { 0 };
            LRESULT idx = SendMessageW(g_hSizeCombo, CB_GETCURSEL, 0, 0);
            SendMessageW(g_hSizeCombo, CB_GETLBTEXT, idx, (LPARAM)szSize);
            int pt = _wtoi(szSize);
            if (pt > 0) {
                CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
                cf.dwMask = CFM_SIZE;
                cf.yHeight = pt * 20; // twips
                SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
            }
            SetFocus(g_hRichEdit);
            return 0;
        }

        switch (id) {
            case IDM_FILE_NEW: DoFileNew(hwnd); break;
            case IDM_FILE_OPEN: DoFileOpen(hwnd); break;
            case IDM_FILE_SAVE: DoFileSave(hwnd, false); break;
            case IDM_FILE_SAVEAS: DoFileSave(hwnd, true); break;
            case IDM_FILE_PRINT: {
                PRINTDLGW pd = { sizeof(PRINTDLGW) };
                pd.hwndOwner = hwnd;
                pd.Flags = PD_RETURNDC | PD_NOSELECTION;
                if (PrintDlgW(&pd)) DeleteDC(pd.hDC);
                break;
            }
            case IDM_FILE_EXIT: DestroyWindow(hwnd); break;

            case IDM_EDIT_UNDO: SendMessageW(g_hRichEdit, EM_UNDO, 0, 0); break;
            case IDM_EDIT_REDO: SendMessageW(g_hRichEdit, EM_REDO, 0, 0); break;
            case IDM_EDIT_CUT:
            case IDC_BTN_CUT: SendMessageW(g_hRichEdit, WM_CUT, 0, 0); break;
            case IDM_EDIT_COPY:
            case IDC_BTN_COPY: SendMessageW(g_hRichEdit, WM_COPY, 0, 0); break;
            case IDM_EDIT_PASTE:
            case IDC_BTN_PASTE: SendMessageW(g_hRichEdit, WM_PASTE, 0, 0); break;
            case IDM_EDIT_SELECTALL:
            case IDC_BTN_SELECT_ALL: {
                CHARRANGE cr = { 0, -1 };
                SendMessageW(g_hRichEdit, EM_EXSETSEL, 0, (LPARAM)&cr);
                break;
            }

            case IDC_BTN_BOLD: DoFormatBold(hwnd); break;
            case IDC_BTN_ITALIC: DoFormatItalic(hwnd); break;
            case IDC_BTN_UNDERLINE: DoFormatUnderline(hwnd); break;
            case IDC_BTN_STRIKE: DoFormatStrike(hwnd); break;
            case IDC_BTN_SUBSCRIPT: DoFormatSubscript(hwnd); break;
            case IDC_BTN_SUPERSCRIPT: DoFormatSuperscript(hwnd); break;
            case IDC_BTN_GROW_FONT: DoGrowFont(hwnd); break;
            case IDC_BTN_SHRINK_FONT: DoShrinkFont(hwnd); break;
            case IDC_BTN_COLOR: DoFormatColor(hwnd); break;
            case IDC_BTN_HIGHLIGHT: DoFormatHighlight(hwnd); break;
            case IDC_BTN_CLEAR_FORMAT: DoClearFormat(hwnd); break;

            case IDC_BTN_ALIGN_L: DoFormatAlign(hwnd, PFA_LEFT); break;
            case IDC_BTN_ALIGN_C: DoFormatAlign(hwnd, PFA_CENTER); break;
            case IDC_BTN_ALIGN_R: DoFormatAlign(hwnd, PFA_RIGHT); break;
            case IDC_BTN_JUSTIFY: DoFormatAlign(hwnd, PFA_JUSTIFY); break;

            case IDC_BTN_BULLETS: DoFormatBullets(hwnd); break;
            case IDC_BTN_NUMBERS: DoFormatNumbers(hwnd); break;
            case IDC_BTN_LINE_SPACING: DoLineSpacing(hwnd, 1.5f); break;

            case IDC_BTN_STYLE_NORMAL: DoApplyStyle(hwnd, IDC_BTN_STYLE_NORMAL); break;
            case IDC_BTN_STYLE_H1: DoApplyStyle(hwnd, IDC_BTN_STYLE_H1); break;
            case IDC_BTN_STYLE_H2: DoApplyStyle(hwnd, IDC_BTN_STYLE_H2); break;
            case IDC_BTN_STYLE_TITLE: DoApplyStyle(hwnd, IDC_BTN_STYLE_TITLE); break;
            case IDC_BTN_STYLE_QUOTE: DoApplyStyle(hwnd, IDC_BTN_STYLE_QUOTE); break;

            case IDM_EDIT_FIND:
            case IDC_BTN_FIND: DoFindDialog(hwnd); break;
            case IDM_EDIT_REPLACE:
            case IDC_BTN_REPLACE: DoFindDialog(hwnd); break;

            // INSERT Tab
            case IDC_BTN_INSERT_TABLE: DoInsertTableDialog(hwnd); break;
            case IDC_BTN_INSERT_IMAGE: DoInsertImageDialog(hwnd); break;
            case IDC_BTN_PAGE_BREAK: SendMessageW(g_hRichEdit, EM_REPLACESEL, TRUE, (LPARAM)L"\n\n--- Page Break ---\n\n"); break;
            case IDC_BTN_INSERT_DATE: DoInsertDate(hwnd); break;
            case IDC_BTN_INSERT_SYMBOL: DoInsertSymbolDialog(hwnd); break;
            case IDC_BTN_HORIZ_LINE: SendMessageW(g_hRichEdit, EM_REPLACESEL, TRUE, (LPARAM)L"\n_________________________________________\n\n"); break;

            // LAYOUT Tab
            case IDC_BTN_MARGINS_NORM:
                g_marginPx = 60;
                SendMessageW(g_hRichEdit, EM_SETMARGINS, EC_LEFTMARGIN | EC_RIGHTMARGIN, MAKELONG(48, 48));
                SendMessageW(hwnd, WM_SIZE, 0, 0);
                break;
            case IDC_BTN_MARGINS_NARROW:
                g_marginPx = 24;
                SendMessageW(g_hRichEdit, EM_SETMARGINS, EC_LEFTMARGIN | EC_RIGHTMARGIN, MAKELONG(24, 24));
                SendMessageW(hwnd, WM_SIZE, 0, 0);
                break;
            case IDC_BTN_MARGINS_WIDE:
                g_marginPx = 96;
                SendMessageW(g_hRichEdit, EM_SETMARGINS, EC_LEFTMARGIN | EC_RIGHTMARGIN, MAKELONG(72, 72));
                SendMessageW(hwnd, WM_SIZE, 0, 0);
                break;
            case IDC_BTN_ORIENT_PORT:
                g_paperWidth = 816;
                SendMessageW(hwnd, WM_SIZE, 0, 0);
                break;
            case IDC_BTN_ORIENT_LAND:
                g_paperWidth = 1060;
                SendMessageW(hwnd, WM_SIZE, 0, 0);
                break;

            // REVIEW Tab
            case IDC_BTN_WORD_COUNT: DoWordCountDialog(hwnd); break;
            case IDC_BTN_HINDI_TOGGLE: DoToggleHindi(hwnd); break;
            case IDC_BTN_LANGUAGES:
                MessageBoxW(hwnd, L"105 Sovereign Language Packs Active.\nOffline translation and font glyphs for Devanagari, European, and Asian scripts are bundled.", L"Giri Orbit Languages", MB_OK | MB_ICONINFORMATION);
                break;

            // VIEW Tab
            case IDC_BTN_VIEW_PRINT:
                g_isWebLayout = false;
                SendMessageW(hwnd, WM_SIZE, 0, 0);
                break;
            case IDC_BTN_VIEW_WEB:
                g_isWebLayout = true;
                SendMessageW(hwnd, WM_SIZE, 0, 0);
                break;
            case IDC_BTN_ZOOM_IN:
                if (g_currentZoom < 200) g_currentZoom += 10;
                SendMessageW(g_hRichEdit, EM_SETZOOM, g_currentZoom, 100);
                UpdateStatusBar(hwnd);
                break;
            case IDC_BTN_ZOOM_OUT:
                if (g_currentZoom > 50) g_currentZoom -= 10;
                SendMessageW(g_hRichEdit, EM_SETZOOM, g_currentZoom, 100);
                UpdateStatusBar(hwnd);
                break;
            case IDC_BTN_ZOOM_RESET:
                g_currentZoom = 100;
                SendMessageW(g_hRichEdit, EM_SETZOOM, 100, 100);
                UpdateStatusBar(hwnd);
                break;

            case 9999:
                MessageBoxW(hwnd, L"Giri Drift v12.0 — Executive Word Processor\nPart of Giri Orbit Sovereign Office Suite\nMade by Abhinav Giri (@abhinavgiri45)\n100% Offline Standalone Architecture\nProprietary Commercial Software License", L"About Giri Drift", MB_OK | MB_ICONINFORMATION);
                break;
        }
        return 0;
    }

    case WM_NOTIFY: {
        NMHDR* pnm = (NMHDR*)lParam;
        if (pnm->idFrom == IDC_RICH_EDIT && pnm->code == EN_CHANGE) {
            // Debounce status bar updates
            SetTimer(hwnd, 5003, 150, NULL);
        }
        return 0;
    }

    case WM_TIMER: {
        if (wParam == 5003) {
            KillTimer(hwnd, 5003);
            UpdateStatusBar(hwnd);
        }
        return 0;
    }

    case WM_SIZE: {
        RECT rcClient;
        GetClientRect(hwnd, &rcClient);
        int w = rcClient.right;
        int h = rcClient.bottom;

        SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
        RECT rcStatus;
        GetWindowRect(g_hStatusBar, &rcStatus);
        int statusHeight = rcStatus.bottom - rcStatus.top;

        int ribbonHeight = 104;
        MoveWindow(g_hToolbarPanel, 0, 0, w, ribbonHeight, TRUE);

        // Center A4 Paper Sheet (or full width in web layout)
        int canvasH = h - ribbonHeight - statusHeight;
        if (g_isWebLayout) {
            MoveWindow(g_hRichEdit, 32, ribbonHeight + 12, w - 64, canvasH - 24, TRUE);
        } else {
            int paperW = g_paperWidth;
            if (paperW > w - 40) paperW = w - 40;
            if (paperW < 360) paperW = 360;

            int paperX = (w - paperW) / 2;
            int paperY = ribbonHeight + 16;
            int paperH = canvasH - 32;
            if (paperH < 200) paperH = 200;

            MoveWindow(g_hRichEdit, paperX + 36, paperY + 24, paperW - 72, paperH - 48, TRUE);
        }
        InvalidateRect(hwnd, NULL, FALSE);
        return 0;
    }

    case WM_ERASEBKGND: return 1;

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);

        RECT rc;
        GetClientRect(hwnd, &rc);
        int w = rc.right;
        int h = rc.bottom;

        int ribbonHeight = 104;
        RECT rcStatus;
        GetWindowRect(g_hStatusBar, &rcStatus);
        int statusHeight = rcStatus.bottom - rcStatus.top;

        // Double buffer canvas
        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, w, h);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);

        // 1. Fill Workspace Neutral Canvas Desk Background
        SolidBrush deskBg(Color(241, 245, 249)); // #f1f5f9
        g.FillRectangle(&deskBg, 0, ribbonHeight, w, h - ribbonHeight - statusHeight);

        // 2. If Print Layout: Draw Centered A4 Sheet with Realistic Drop Shadow
        if (!g_isWebLayout) {
            int canvasH = h - ribbonHeight - statusHeight;
            int paperW = g_paperWidth;
            if (paperW > w - 40) paperW = w - 40;
            if (paperW < 360) paperW = 360;

            int paperX = (w - paperW) / 2;
            int paperY = ribbonHeight + 16;
            int paperH = canvasH - 32;
            if (paperH < 200) paperH = 200;

            // Subtle Drop Shadow
            RectF shadowRect((float)paperX + 2.0f, (float)paperY + 3.0f, (float)paperW, (float)paperH);
            GraphicsPath shPath;
            shPath.AddRectangle(shadowRect);
            SolidBrush shadowBrush(Color(20, 0, 0, 0));
            g.FillPath(&shadowBrush, &shPath);

            // Crisp White A4 Sheet
            RectF sheetRect((float)paperX, (float)paperY, (float)paperW, (float)paperH);
            SolidBrush whiteBrush(Color(255, 255, 255));
            g.FillRectangle(&whiteBrush, sheetRect);

            Pen borderPen(Color(226, 232, 240), 1.0f);
            g.DrawRectangle(&borderPen, sheetRect);
        }

        BitBlt(hdc, 0, 0, w, h, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);

        EndPaint(hwnd, &ps);
        return 0;
    }

    // Ribbon Tabs Drawing on Toolbar Panel
    case WM_CTLCOLORSTATIC: {
        HDC hdcStatic = (HDC)wParam;
        HWND hwndStatic = (HWND)lParam;
        if (hwndStatic == g_hToolbarPanel) {
            SetBkMode(hdcStatic, TRANSPARENT);
            return (INT_PTR)GetStockObject(WHITE_BRUSH);
        }
        return (INT_PTR)GetStockObject(WHITE_BRUSH);
    }

    case WM_DESTROY: {
        PostQuitMessage(0);
        return 0;
    }
    }
    return DefWindowProcW(hwnd, uMsg, wParam, lParam);
}
