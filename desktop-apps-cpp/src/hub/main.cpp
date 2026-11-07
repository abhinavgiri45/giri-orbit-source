/* ============================================================================
 * GIRI ORBIT — SOVEREIGN ENTERPRISE OFFICE SUITE (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Official Contact: abhinavgiri370@gmail.com
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Telemetry • Pure Sovereign Office Hub • Ultra-Modern Fluent Dark UI
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include <shlobj.h>
#include <commdlg.h>
#include <commctrl.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <string>
#include <vector>

#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "shell32.lib")

// Control Identifiers
#define IDC_BTN_NEW_DRIFT         5001
#define IDC_BTN_OPEN_DRIFT        5002
#define IDC_BTN_DRIFT_TEMPLATE    5003

#define IDC_BTN_NEW_AXIS          5004
#define IDC_BTN_OPEN_AXIS         5005
#define IDC_BTN_AXIS_TEMPLATE     5006

#define IDC_BTN_NEW_KINETIC       5007
#define IDC_BTN_OPEN_KINETIC      5008
#define IDC_BTN_KINETIC_TEMPLATE  5009

#define IDC_BTN_OPEN_UNIVERSAL    5010
#define IDC_COMBO_SUITE_LANG      5011
#define IDC_BTN_GITHUB            5012

#define IDC_HUB_STATUSBAR         6001

HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hStatusBar = NULL;
HWND g_hLangCombo = NULL;
std::wstring g_appDir = L"";
HICON g_hAppIcon = NULL;

// Active Suite Language: 0=English, 1=Hindi (Google Writing Style), 2=Spanish, 3=French, 4=German
int g_currentLangIndex = 0;

struct SuiteLocale {
    const wchar_t* displayName;
    const wchar_t* langCode;
    const wchar_t* defaultFont;
};

const SuiteLocale g_locales[] = {
    { L"🌐 English (United States)", L"en_US", L"Segoe UI" },
    { L"🇮🇳 हिन्दी (Hindi - Google Devanagari)", L"hi_IN", L"Noto Sans Devanagari" },
    { L"🇪🇸 Español (Spanish)", L"es_ES", L"Segoe UI" },
    { L"🇫🇷 Français (French)", L"fr_FR", L"Segoe UI" },
    { L"🇩🇪 Deutsch (German)", L"de_DE", L"Segoe UI" },
    { L"🇯🇵 日本語 (Japanese)", L"ja_JP", L"Meiryo" },
    { L"🇨🇳 中文 (Simplified Chinese)", L"zh_CN", L"Microsoft YaHei" },
    { L"🇸🇦 العربية (Arabic)", L"ar_SA", L"Noto Sans Arabic" }
};

// Forward declarations
LRESULT CALLBACK HubWndProc(HWND, UINT, WPARAM, LPARAM);
void LaunchApp(const std::wstring& exeName, const std::wstring& args = L"");
void OpenUniversalFile(HWND hwnd);
void SavePreferredLanguage(int index);
int LoadPreferredLanguage();

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;

    // Resolve app directory
    wchar_t szPath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, szPath, MAX_PATH);
    PathRemoveFileSpecW(szPath);
    g_appDir = szPath;

    // Dynamically register Google Hindi Font & International Fonts
    std::wstring fontPath1 = g_appDir + L"\\Fonts\\NotoSansDevanagari.ttf";
    std::wstring fontPath2 = g_appDir + L"\\..\\fonts\\NotoSansDevanagari.ttf";
    if (PathFileExistsW(fontPath1.c_str())) AddFontResourceExW(fontPath1.c_str(), FR_PRIVATE, NULL);
    else if (PathFileExistsW(fontPath2.c_str())) AddFontResourceExW(fontPath2.c_str(), FR_PRIVATE, NULL);

    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_BAR_CLASSES };
    InitCommonControlsEx(&icex);

    g_hAppIcon = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 256, 256, LR_DEFAULTSIZE);
    if (!g_hAppIcon) g_hAppIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = HubWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = CreateSolidBrush(RGB(11, 15, 25)); // Ultra-Dark Modern Slate
    wcex.lpszClassName = L"GiriOrbitMasterHubClass";
    wcex.hIcon = g_hAppIcon;
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);

    if (!RegisterClassExW(&wcex)) return 0;

    g_currentLangIndex = LoadPreferredLanguage();

    // Create Main Hub Window (1040 x 700)
    g_hMainWnd = CreateWindowExW(
        0, L"GiriOrbitMasterHubClass",
        L"Giri Orbit — Sovereign Office Productivity Suite",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1040, 710,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    // Header Language Dropdown
    HFONT hUiFont = CreateFontW(14, 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                VARIABLE_PITCH, L"Segoe UI");

    g_hLangCombo = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
        710, 24, 275, 240,
        g_hMainWnd, (HMENU)IDC_COMBO_SUITE_LANG, hInstance, NULL
    );
    SendMessageW(g_hLangCombo, WM_SETFONT, (WPARAM)hUiFont, TRUE);

    for (const auto& loc : g_locales) {
        SendMessageW(g_hLangCombo, CB_ADDSTRING, 0, (LPARAM)loc.displayName);
    }
    SendMessageW(g_hLangCombo, CB_SETCURSEL, (WPARAM)g_currentLangIndex, 0);

    // ==========================================
    // 3 MODERN APP CARDS (Drift, Axis, Kinetic)
    // Left: 40, Width: 300 each, Gap: 30
    // Card 1: x = 40
    // Card 2: x = 370
    // Card 3: x = 700
    // ==========================================

    // CARD 1: GIRI DRIFT (Word Processor)
    HWND bDriftNew = CreateWindowExW(0, L"BUTTON", L"+ Blank Document", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                    60, 360, 260, 38, g_hMainWnd, (HMENU)IDC_BTN_NEW_DRIFT, hInstance, NULL);
    HWND bDriftTmpl = CreateWindowExW(0, L"BUTTON", L"Strategic Charter Template", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                     60, 408, 260, 34, g_hMainWnd, (HMENU)IDC_BTN_DRIFT_TEMPLATE, hInstance, NULL);
    HWND bDriftOpen = CreateWindowExW(0, L"BUTTON", L"Open Document (.giri, .docx)...", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                     60, 452, 260, 34, g_hMainWnd, (HMENU)IDC_BTN_OPEN_DRIFT, hInstance, NULL);

    // CARD 2: GIRI AXIS (Spreadsheet Matrix)
    HWND bAxisNew = CreateWindowExW(0, L"BUTTON", L"+ Blank Spreadsheet", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                   390, 360, 260, 38, g_hMainWnd, (HMENU)IDC_BTN_NEW_AXIS, hInstance, NULL);
    HWND bAxisTmpl = CreateWindowExW(0, L"BUTTON", L"Annual Budget Template", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                    390, 408, 260, 34, g_hMainWnd, (HMENU)IDC_BTN_AXIS_TEMPLATE, hInstance, NULL);
    HWND bAxisOpen = CreateWindowExW(0, L"BUTTON", L"Open Spreadsheet (.giri, .xlsx)...", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                    390, 452, 260, 34, g_hMainWnd, (HMENU)IDC_BTN_OPEN_AXIS, hInstance, NULL);

    // CARD 3: GIRI KINETIC (Presentation Studio)
    HWND bKinNew = CreateWindowExW(0, L"BUTTON", L"+ Blank Presentation", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                  720, 360, 260, 38, g_hMainWnd, (HMENU)IDC_BTN_NEW_KINETIC, hInstance, NULL);
    HWND bKinTmpl = CreateWindowExW(0, L"BUTTON", L"Keynote Pitch Deck Template", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                   720, 408, 260, 34, g_hMainWnd, (HMENU)IDC_BTN_KINETIC_TEMPLATE, hInstance, NULL);
    HWND bKinOpen = CreateWindowExW(0, L"BUTTON", L"Open Slide Deck (.giri, .pptx)...", WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                   720, 452, 260, 34, g_hMainWnd, (HMENU)IDC_BTN_OPEN_KINETIC, hInstance, NULL);

    // BOTTOM UNIVERSAL STRIP: OPEN ANY FILE
    HWND bUniv = CreateWindowExW(0, L"BUTTON", L"📁  Browse & Open Any Sovereign Office File (.giri, .docx, .xlsx, .pptx, .pdf)...",
                                WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                                40, 520, 940, 46, g_hMainWnd, (HMENU)IDC_BTN_OPEN_UNIVERSAL, hInstance, NULL);

    HWND bGit = CreateWindowExW(0, L"BUTTON", L"GitHub: @abhinavgiri45",
                               WS_CHILD | WS_VISIBLE | BS_OWNERDRAW,
                               40, 580, 200, 32, g_hMainWnd, (HMENU)IDC_BTN_GITHUB, hInstance, NULL);

    // Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)IDC_HUB_STATUSBAR, hInstance, NULL
    );
    int parts[] = { 340, 680, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 3, (LPARAM)parts);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)L" Giri Orbit v11.8.7 — Native Win32 C++");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)L" Author: Abhinav Giri (abhinavgiri370@gmail.com)");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L" 100% Offline • Zero Telemetry");

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }
    return (int)msg.wParam;
}

void SavePreferredLanguage(int index) {
    if (index < 0 || index >= sizeof(g_locales)/sizeof(g_locales[0])) return;
    std::wstring cfgDir = g_appDir;
    std::wstring cfgPath = cfgDir + L"\\locale.cfg";
    FILE* f = _wfopen(cfgPath.c_str(), L"w, ccs=UTF-8");
    if (f) {
        fwprintf(f, L"%d\n%ls\n", index, g_locales[index].langCode);
        fclose(f);
    }
}

int LoadPreferredLanguage() {
    std::wstring cfgPath = g_appDir + L"\\locale.cfg";
    FILE* f = _wfopen(cfgPath.c_str(), L"r, ccs=UTF-8");
    if (f) {
        int idx = 0;
        if (fwscanf(f, L"%d", &idx) == 1) {
            fclose(f);
            if (idx >= 0 && idx < sizeof(g_locales)/sizeof(g_locales[0])) {
                return idx;
            }
        }
        fclose(f);
    }
    return 0; // Default English
}

void LaunchApp(const std::wstring& exeName, const std::wstring& args) {
    std::wstring fullPath = g_appDir + L"\\" + exeName;
    if (!PathFileExistsW(fullPath.c_str())) {
        fullPath = g_appDir + L"\\bin\\" + exeName;
    }
    if (!PathFileExistsW(fullPath.c_str())) {
        wchar_t localApp[MAX_PATH];
        DWORD len = ExpandEnvironmentStringsW(L"%LOCALAPPDATA%\\Programs\\Giri Orbit", localApp, MAX_PATH);
        if (len > 0 && len < MAX_PATH) {
            std::wstring cand = std::wstring(localApp) + L"\\" + exeName;
            if (PathFileExistsW(cand.c_str())) fullPath = cand;
        }
    }

    // Append active language flag if Hindi or non-English selected
    std::wstring launchArgs = args;
    if (g_currentLangIndex > 0) {
        if (!launchArgs.empty()) launchArgs += L" ";
        launchArgs += L"-lang:" + std::wstring(g_locales[g_currentLangIndex].langCode);
    }

    HINSTANCE hRes = ShellExecuteW(NULL, L"open", fullPath.c_str(), launchArgs.empty() ? NULL : launchArgs.c_str(), g_appDir.c_str(), SW_SHOWNORMAL);
    if ((INT_PTR)hRes <= 32) {
        std::wstring err = L"Could not locate " + exeName + L".\nExpected path: " + fullPath;
        MessageBoxW(g_hMainWnd, err.c_str(), L"Application Launch Error", MB_OK | MB_ICONERROR);
    }
}

void OpenUniversalFile(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"All Supported Sovereign Office Files (*.giri;*.docx;*.xlsx;*.pptx;*.txt;*.csv)\0*.giri;*.docx;*.xlsx;*.pptx;*.txt;*.csv\0Sovereign Office (.giri)\0*.giri\0Word Documents (.docx)\0*.docx\0Excel Sheets (.xlsx)\0*.xlsx\0PowerPoint Presentations (.pptx)\0*.pptx\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::wstring ext = PathFindExtensionW(szFile);
        std::wstring sExt = ext;
        for (auto& c : sExt) c = towlower(c);

        std::wstring quoted = L"\"" + std::wstring(szFile) + L"\"";

        if (sExt == L".docx" || sExt == L".doc" || sExt == L".txt") {
            LaunchApp(L"GiriDrift.exe", quoted);
        } else if (sExt == L".xlsx" || sExt == L".xls" || sExt == L".csv") {
            LaunchApp(L"GiriAxis.exe", quoted);
        } else if (sExt == L".pptx" || sExt == L".ppt") {
            LaunchApp(L"GiriKinetic.exe", quoted);
        } else if (sExt == L".giri") {
            // Inspect universal file type
            std::string content, toolType;
            if (LoadUniversalGiriFile(szFile, content, toolType)) {
                if (toolType == "axis") LaunchApp(L"GiriAxis.exe", quoted);
                else if (toolType == "kinetic") LaunchApp(L"GiriKinetic.exe", quoted);
                else LaunchApp(L"GiriDrift.exe", quoted);
            } else {
                LaunchApp(L"GiriDrift.exe", quoted);
            }
        } else {
            LaunchApp(L"GiriDrift.exe", quoted);
        }
    }
}

LRESULT CALLBACK HubWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_COMMAND: {
        int wmId = LOWORD(wParam);
        int wmEvent = HIWORD(wParam);

        if (wmId == IDC_COMBO_SUITE_LANG && wmEvent == CBN_SELCHANGE) {
            int sel = (int)SendMessageW(g_hLangCombo, CB_GETCURSEL, 0, 0);
            if (sel >= 0) {
                g_currentLangIndex = sel;
                SavePreferredLanguage(sel);
                InvalidateRect(hwnd, NULL, TRUE);
            }
            return 0;
        }

        switch (wmId) {
        case IDC_BTN_NEW_DRIFT:
            LaunchApp(L"GiriDrift.exe");
            break;
        case IDC_BTN_OPEN_DRIFT: {
            wchar_t szFile[MAX_PATH] = { 0 };
            OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
            ofn.hwndOwner = hwnd;
            ofn.lpstrFilter = L"Word & Drift Documents (*.giri;*.docx;*.txt)\0*.giri;*.docx;*.txt\0All Files (*.*)\0*.*\0";
            ofn.lpstrFile = szFile;
            ofn.nMaxFile = MAX_PATH;
            ofn.Flags = OFN_FILEMUSTEXIST;
            if (GetOpenFileNameW(&ofn)) LaunchApp(L"GiriDrift.exe", L"\"" + std::wstring(szFile) + L"\"");
            break;
        }
        case IDC_BTN_DRIFT_TEMPLATE:
            LaunchApp(L"GiriDrift.exe", L"-template:charter");
            break;

        case IDC_BTN_NEW_AXIS:
            LaunchApp(L"GiriAxis.exe");
            break;
        case IDC_BTN_OPEN_AXIS: {
            wchar_t szFile[MAX_PATH] = { 0 };
            OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
            ofn.hwndOwner = hwnd;
            ofn.lpstrFilter = L"Excel & Axis Spreadsheets (*.giri;*.xlsx;*.csv)\0*.giri;*.xlsx;*.csv\0All Files (*.*)\0*.*\0";
            ofn.lpstrFile = szFile;
            ofn.nMaxFile = MAX_PATH;
            ofn.Flags = OFN_FILEMUSTEXIST;
            if (GetOpenFileNameW(&ofn)) LaunchApp(L"GiriAxis.exe", L"\"" + std::wstring(szFile) + L"\"");
            break;
        }
        case IDC_BTN_AXIS_TEMPLATE:
            LaunchApp(L"GiriAxis.exe", L"-template:budget");
            break;

        case IDC_BTN_NEW_KINETIC:
            LaunchApp(L"GiriKinetic.exe");
            break;
        case IDC_BTN_OPEN_KINETIC: {
            wchar_t szFile[MAX_PATH] = { 0 };
            OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
            ofn.hwndOwner = hwnd;
            ofn.lpstrFilter = L"PowerPoint & Kinetic Slide Decks (*.giri;*.pptx)\0*.giri;*.pptx\0All Files (*.*)\0*.*\0";
            ofn.lpstrFile = szFile;
            ofn.nMaxFile = MAX_PATH;
            ofn.Flags = OFN_FILEMUSTEXIST;
            if (GetOpenFileNameW(&ofn)) LaunchApp(L"GiriKinetic.exe", L"\"" + std::wstring(szFile) + L"\"");
            break;
        }
        case IDC_BTN_KINETIC_TEMPLATE:
            LaunchApp(L"GiriKinetic.exe", L"-template:pitch");
            break;

        case IDC_BTN_OPEN_UNIVERSAL:
            OpenUniversalFile(hwnd);
            break;

        case IDC_BTN_GITHUB:
            ShellExecuteW(NULL, L"open", L"https://github.com/abhinavgiri45", NULL, NULL, SW_SHOWNORMAL);
            break;
        }
        return 0;
    }

    case WM_DRAWITEM: {
        LPDRAWITEMSTRUCT pDis = (LPDRAWITEMSTRUCT)lParam;
        if (!pDis) return FALSE;

        HDC hdc = pDis->hDC;
        RECT rc = pDis->rcItem;
        UINT id = pDis->CtlID;
        bool isDown = (pDis->itemState & ODS_SELECTED) != 0;

        // Custom Modern Fluent Owner-Drawn Buttons
        HBRUSH hBg = NULL;
        HPEN hPen = NULL;
        COLORREF textColor = RGB(255, 255, 255);

        if (id == IDC_BTN_NEW_DRIFT) {
            hBg = CreateSolidBrush(isDown ? RGB(29, 78, 216) : RGB(37, 99, 235)); // Primary Royal Blue
            hPen = CreatePen(PS_SOLID, 1, RGB(59, 130, 246));
        } else if (id == IDC_BTN_NEW_AXIS) {
            hBg = CreateSolidBrush(isDown ? RGB(5, 150, 105) : RGB(16, 185, 129)); // Primary Emerald Green
            hPen = CreatePen(PS_SOLID, 1, RGB(52, 211, 153));
        } else if (id == IDC_BTN_NEW_KINETIC) {
            hBg = CreateSolidBrush(isDown ? RGB(217, 119, 6) : RGB(245, 158, 11)); // Primary Amber Orange
            hPen = CreatePen(PS_SOLID, 1, RGB(251, 191, 36));
        } else if (id == IDC_BTN_OPEN_UNIVERSAL) {
            hBg = CreateSolidBrush(isDown ? RGB(30, 41, 59) : RGB(15, 23, 42));
            hPen = CreatePen(PS_SOLID, 2, RGB(59, 130, 246));
            textColor = RGB(147, 197, 253);
        } else {
            // Secondary buttons
            hBg = CreateSolidBrush(isDown ? RGB(30, 41, 59) : RGB(24, 32, 47));
            hPen = CreatePen(PS_SOLID, 1, RGB(51, 65, 85));
            textColor = RGB(203, 213, 225);
        }

        HGDIOBJ oldBrush = SelectObject(hdc, hBg);
        HGDIOBJ oldPen = SelectObject(hdc, hPen);

        RoundRect(hdc, rc.left, rc.top, rc.right, rc.bottom, 8, 8);

        // Get Button text
        wchar_t text[256] = { 0 };
        GetWindowTextW(pDis->hwndItem, text, 256);

        HFONT hFont = CreateFontW(13, 0, 0, 0, (id == IDC_BTN_NEW_DRIFT || id == IDC_BTN_NEW_AXIS || id == IDC_BTN_NEW_KINETIC || id == IDC_BTN_OPEN_UNIVERSAL) ? FW_BOLD : FW_SEMIBOLD,
                                  FALSE, FALSE, FALSE, DEFAULT_CHARSET, OUT_DEFAULT_PRECIS,
                                  CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, VARIABLE_PITCH, L"Segoe UI");
        HGDIOBJ oldFont = SelectObject(hdc, hFont);

        SetBkMode(hdc, TRANSPARENT);
        SetTextColor(hdc, textColor);
        DrawTextW(hdc, text, -1, &rc, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

        SelectObject(hdc, oldFont);
        DeleteObject(hFont);
        SelectObject(hdc, oldBrush);
        SelectObject(hdc, oldPen);
        DeleteObject(hBg);
        DeleteObject(hPen);
        return TRUE;
    }

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        SetBkMode(hdc, TRANSPARENT);

        // Typography
        HFONT hFontHeaderTitle = CreateFontW(24, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                            OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                            VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontHeroTitle = CreateFontW(22, 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                          OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                          VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontSub = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                    OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                    VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontCardTitle = CreateFontW(18, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                          OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                          VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontCardSub = CreateFontW(13, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                        OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                        VARIABLE_PITCH, L"Segoe UI");
        HFONT hFontCardDesc = CreateFontW(12, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                         OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                         VARIABLE_PITCH, L"Segoe UI");

        // 1. TOP HEADER (y: 18 - 60)
        // Draw Suite Icon (36x36)
        if (g_hAppIcon) {
            DrawIconEx(hdc, 40, 20, g_hAppIcon, 36, 36, 0, NULL, DI_NORMAL);
        }

        HGDIOBJ oldFont = SelectObject(hdc, hFontHeaderTitle);
        SetTextColor(hdc, RGB(255, 255, 255));
        RECT rTitle = { 88, 22, 450, 56 };
        DrawTextW(hdc, L"GIRI ORBIT", -1, &rTitle, DT_LEFT | DT_SINGLELINE);

        SelectObject(hdc, hFontSub);
        SetTextColor(hdc, RGB(56, 189, 248)); // Sky Blue
        RECT rBadge = { 228, 28, 550, 54 };
        DrawTextW(hdc, L"SOVEREIGN PRODUCTIVITY SUITE", -1, &rBadge, DT_LEFT | DT_SINGLELINE);

        // Divider Line under Header
        HPEN hSepPen = CreatePen(PS_SOLID, 1, RGB(30, 41, 59));
        SelectObject(hdc, hSepPen);
        MoveToEx(hdc, 40, 72, NULL);
        LineTo(hdc, client.right - 40, 72);

        // 2. HERO WELCOME SECTION (y: 84 - 130)
        SelectObject(hdc, hFontHeroTitle);
        SetTextColor(hdc, RGB(241, 245, 249)); // Slate-100
        RECT rHero = { 40, 84, client.right - 40, 112 };

        if (g_currentLangIndex == 1) {
            DrawTextW(hdc, L"नमस्ते, गिरि ऑर्बिट में आपका स्वागत है", -1, &rHero, DT_LEFT | DT_SINGLELINE);
        } else {
            DrawTextW(hdc, L"Welcome to Giri Orbit Sovereign Suite", -1, &rHero, DT_LEFT | DT_SINGLELINE);
        }

        SelectObject(hdc, hFontSub);
        SetTextColor(hdc, RGB(148, 163, 184)); // Slate-400
        RECT rHeroSub = { 40, 114, client.right - 40, 136 };
        DrawTextW(hdc, L"100% Offline Standalone • Zero Telemetry • Sovereign Document, Spreadsheet & Presentation Engine", -1, &rHeroSub, DT_LEFT | DT_SINGLELINE);

        // 3. THREE PRIMARY SUITE CARDS (y: 150 to 500)
        // Width: 300 each, Heights: 350
        // Card 1: x = 40
        // Card 2: x = 370
        // Card 3: x = 700

        HBRUSH hCardBg = CreateSolidBrush(RGB(17, 24, 39)); // Slate-900 Card
        HPEN hBorderDrift = CreatePen(PS_SOLID, 1, RGB(37, 99, 235));
        HPEN hBorderAxis = CreatePen(PS_SOLID, 1, RGB(16, 185, 129));
        HPEN hBorderKinetic = CreatePen(PS_SOLID, 1, RGB(245, 158, 11));

        // CARD 1: GIRI DRIFT
        SelectObject(hdc, hBorderDrift);
        SelectObject(hdc, hCardBg);
        RoundRect(hdc, 40, 150, 340, 500, 12, 12);

        // Header Accent Stripe
        HBRUSH hDriftStripe = CreateSolidBrush(RGB(37, 99, 235));
        RECT rDriftTop = { 41, 151, 339, 158 };
        FillRect(hdc, &rDriftTop, hDriftStripe);
        DeleteObject(hDriftStripe);

        SelectObject(hdc, hFontCardTitle);
        SetTextColor(hdc, RGB(255, 255, 255));
        RECT rDTitle = { 60, 172, 320, 200 };
        DrawTextW(hdc, L"Giri Drift", -1, &rDTitle, DT_LEFT | DT_SINGLELINE);

        SelectObject(hdc, hFontCardSub);
        SetTextColor(hdc, RGB(96, 165, 250)); // Light Blue
        RECT rDSub = { 60, 202, 320, 224 };
        DrawTextW(hdc, L"Document Composer", -1, &rDSub, DT_LEFT | DT_SINGLELINE);

        SelectObject(hdc, hFontCardDesc);
        SetTextColor(hdc, RGB(148, 163, 184));
        RECT rDDesc = { 60, 232, 320, 340 };
        DrawTextW(hdc,
                  L"Professional word processing, full typography, styled tables, and universal PDF export with integrated Google Hindi (Noto Sans Devanagari) writing style.",
                  -1, &rDDesc, DT_LEFT | DT_WORDBREAK);

        // CARD 2: GIRI AXIS
        SelectObject(hdc, hBorderAxis);
        RoundRect(hdc, 370, 150, 670, 500, 12, 12);

        HBRUSH hAxisStripe = CreateSolidBrush(RGB(16, 185, 129));
        RECT rAxisTop = { 371, 151, 669, 158 };
        FillRect(hdc, &rAxisTop, hAxisStripe);
        DeleteObject(hAxisStripe);

        SelectObject(hdc, hFontCardTitle);
        SetTextColor(hdc, RGB(255, 255, 255));
        RECT rATitle = { 390, 172, 650, 200 };
        DrawTextW(hdc, L"Giri Axis", -1, &rATitle, DT_LEFT | DT_SINGLELINE);

        SelectObject(hdc, hFontCardSub);
        SetTextColor(hdc, RGB(52, 211, 153)); // Light Green
        RECT rASub = { 390, 202, 650, 224 };
        DrawTextW(hdc, L"Financial Matrix & Grid", -1, &rASub, DT_LEFT | DT_SINGLELINE);

        SelectObject(hdc, hFontCardDesc);
        SetTextColor(hdc, RGB(148, 163, 184));
        RECT rADDesc = { 390, 232, 650, 340 };
        DrawTextW(hdc,
                  L"High-velocity spreadsheet engine with real-time formulas (=SUM, AVG), Indian lakh/crore currency formatting (₹ INR), and interactive column charts.",
                  -1, &rADDesc, DT_LEFT | DT_WORDBREAK);

        // CARD 3: GIRI KINETIC
        SelectObject(hdc, hBorderKinetic);
        RoundRect(hdc, 700, 150, 1000, 500, 12, 12);

        HBRUSH hKinStripe = CreateSolidBrush(RGB(245, 158, 11));
        RECT rKinTop = { 701, 151, 999, 158 };
        FillRect(hdc, &rKinTop, hKinStripe);
        DeleteObject(hKinStripe);

        SelectObject(hdc, hFontCardTitle);
        SetTextColor(hdc, RGB(255, 255, 255));
        RECT rKTitle = { 720, 172, 980, 200 };
        DrawTextW(hdc, L"Giri Kinetic", -1, &rKTitle, DT_LEFT | DT_SINGLELINE);

        SelectObject(hdc, hFontCardSub);
        SetTextColor(hdc, RGB(251, 191, 36)); // Light Amber
        RECT rKSub = { 720, 202, 980, 224 };
        DrawTextW(hdc, L"Presentation Studio", -1, &rKSub, DT_LEFT | DT_SINGLELINE);

        SelectObject(hdc, hFontCardDesc);
        SetTextColor(hdc, RGB(148, 163, 184));
        RECT rKDesc = { 720, 232, 980, 340 };
        DrawTextW(hdc,
                  L"16:9 widescreen presentation studio with smooth 60 FPS hardware slide transitions, step-by-step element animations, and interactive laser pointer show.",
                  -1, &rKDesc, DT_LEFT | DT_WORDBREAK);

        // Clean Up GDI
        DeleteObject(hCardBg);
        DeleteObject(hBorderDrift);
        DeleteObject(hBorderAxis);
        DeleteObject(hBorderKinetic);
        DeleteObject(hSepPen);

        SelectObject(hdc, oldFont);
        DeleteObject(hFontHeaderTitle);
        DeleteObject(hFontHeroTitle);
        DeleteObject(hFontSub);
        DeleteObject(hFontCardTitle);
        DeleteObject(hFontCardSub);
        DeleteObject(hFontCardDesc);

        EndPaint(hwnd, &ps);
        return 0;
    }

    case WM_CTLCOLORSTATIC: {
        HDC hdcStatic = (HDC)wParam;
        SetTextColor(hdcStatic, RGB(241, 245, 249));
        SetBkColor(hdcStatic, RGB(11, 15, 25));
        static HBRUSH hBackBrush = CreateSolidBrush(RGB(11, 15, 25));
        return (INT_PTR)hBackBrush;
    }

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}
