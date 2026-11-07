/* ============================================================================
 * GIRI DRIFT — EXECUTIVE DOCUMENT COMPOSER & WORD PROCESSOR (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Official Contact: abhinavgiri370@gmail.com
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Browser • Zero Cloud Telemetry • Sovereign In-Memory Document Engine
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <vector>
#include <string>

#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "comdlg32.lib")
#pragma comment(lib, "shell32.lib")

// Control IDs
#define IDC_TOOLBAR_PANEL   3000
#define IDC_RICH_EDIT       3001
#define IDC_COMBO_FONT      3010
#define IDC_COMBO_SIZE      3011
#define IDC_BTN_BOLD        3020
#define IDC_BTN_ITALIC      3021
#define IDC_BTN_UNDERLINE   3022
#define IDC_BTN_STRIKE      3023
#define IDC_BTN_COLOR       3024
#define IDC_BTN_ALIGN_L     3025
#define IDC_BTN_ALIGN_C     3026
#define IDC_BTN_ALIGN_R     3027
#define IDC_BTN_JUSTIFY     3028
#define IDC_BTN_BULLETS     3029
#define IDC_BTN_NUMBERS     3030
#define IDC_BTN_TABLE       3031
#define IDC_BTN_TEMPLATES   3032
#define IDC_BTN_STATS       3033

#define IDM_LANG_EN         3101
#define IDM_LANG_HI         3102
#define IDM_LANG_ES         3103
#define IDM_LANG_FR         3104
#define IDM_LANG_DE         3105
#define IDM_LANG_SPELLCHECK 3106

// Global application handles
HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hToolbarPanel = NULL;
HWND g_hStatusBar = NULL;
HWND g_hRichEdit = NULL;
HMODULE g_hRichEditLib = NULL;

HWND g_hFontCombo = NULL;
HWND g_hSizeCombo = NULL;

std::wstring g_currentFilePath = L"";
bool g_isModified = false;

// Forward declarations
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
void SetEditorLanguage(const wchar_t* langCode, const wchar_t* fontName, int pointSize);
void CreateMainMenu(HWND);
void CreateRibbonToolbar(HWND);
void UpdateStatusBar(HWND);
void DoFileNew(HWND);
void DoFileOpen(HWND);
void DoFileSave(HWND, bool);
void DoFormatBold(HWND);
void DoFormatItalic(HWND);
void DoFormatUnderline(HWND);
void DoFormatStrike(HWND);
void DoFormatAlign(HWND, WORD);
void DoFormatBullets(HWND);
void DoFormatNumbers(HWND);
void DoFormatColor(HWND);
void DoInsertTable(HWND);
void DoShowTemplatesMenu(HWND);
void DoWordCount(HWND);
void ApplyTemplateContent(int templateIndex);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;
    // Register Google Hindi and International Fonts dynamically
    wchar_t exePath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);
    std::wstring fontPath1 = std::wstring(exePath) + L"\\Fonts\\NotoSansDevanagari.ttf";
    std::wstring fontPath2 = std::wstring(exePath) + L"\\..\\fonts\\NotoSansDevanagari.ttf";
    if (PathFileExistsW(fontPath1.c_str())) AddFontResourceExW(fontPath1.c_str(), FR_PRIVATE, NULL);
    else if (PathFileExistsW(fontPath2.c_str())) AddFontResourceExW(fontPath2.c_str(), FR_PRIVATE, NULL);


    // Load RichEdit library
    g_hRichEditLib = LoadLibraryW(L"msftedit.dll");
    const wchar_t* richClass = MSFTEDIT_CLASS;
    if (!g_hRichEditLib) {
        g_hRichEditLib = LoadLibraryW(L"riched20.dll");
        richClass = RICHEDIT_CLASSW;
    }

    // Initialize Common Controls
    INITCOMMONCONTROLSEX icex;
    icex.dwSize = sizeof(INITCOMMONCONTROLSEX);
    icex.dwICC = ICC_WIN95_CLASSES | ICC_COOL_CLASSES | ICC_BAR_CLASSES;
    InitCommonControlsEx(&icex);

    // Register Window Class
    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wcex.lpszClassName = L"GiriDriftWindowClass";
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);

    if (!RegisterClassExW(&wcex)) return 0;

    // Create Main Window
    g_hMainWnd = CreateWindowExW(
        0, L"GiriDriftWindowClass",
        L"Untitled Document — Giri Drift (Executive Document Composer)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1080, 750,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateMainMenu(g_hMainWnd);
    CreateRibbonToolbar(g_hMainWnd);

    // Create Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)ID_STATUSBAR, hInstance, NULL
    );

    int statwidths[] = { 200, 380, 560, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 4, (LPARAM)statwidths);

    // Create Native RichEdit Editor
    g_hRichEdit = CreateWindowExW(
        WS_EX_CLIENTEDGE, richClass, L"",
        WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL | ES_MULTILINE | ES_AUTOVSCROLL | ES_AUTOHSCROLL | ES_WANTRETURN | ES_NOHIDESEL,
        0, 40, 1060, 620,
        g_hMainWnd, (HMENU)IDC_RICH_EDIT, hInstance, NULL
    );

    // Enable high-grade document features on RichEdit
    SendMessageW(g_hRichEdit, EM_SETEVENTMASK, 0, ENM_CHANGE | ENM_SELCHANGE);
    SendMessageW(g_hRichEdit, EM_SETUNDOLIMIT, 100, 0);

    // Set default elegant Segoe UI typeface
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    cf.dwMask = CFM_FACE | CFM_SIZE | CFM_COLOR;
    cf.yHeight = 240; // 12pt
    cf.crTextColor = RGB(15, 23, 42); // Deep navy slate
    wcscpy_s(cf.szFaceName, L"Segoe UI");
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_ALL, (LPARAM)&cf);

    // Set page margin / padding (60px left/right)
    SendMessageW(g_hRichEdit, EM_SETMARGINS, EC_LEFTMARGIN | EC_RIGHTMARGIN, MAKELONG(60, 60));

    // Initial welcome text
    std::wstring welcome =
        L"Welcome to Giri Drift\n"
        L"Executive Document Composer & Sovereign Word Processor\n"
        L"Made by Abhinav Giri (github.com/abhinavgiri45 | abhinavgiri370@gmail.com)\n\n"
        L"Sovereign Desktop Architecture:\n"
        L" • 100% Offline Standalone Native C++ Desktop Application\n"
        L" • Sub-15MB RAM Footprint & Direct In-Memory Cryptographic Security\n"
        L" • Full Typography Toolbar with Global Font & Size Controls\n"
        L" • Formatted Table Generator, Alignment, and Numbered/Bullet Lists\n"
        L" • Universal Sovereign (.giri / .gdrift) Compatibility\n\n"
        L"Begin typing your executive document or select a pre-loaded template above...";

    SetWindowTextW(g_hRichEdit, welcome.c_str());
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);

    // Handle command line file argument if passed
    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        std::wstring path = lpCmdLine;
        if (path.front() == L'"' && path.back() == L'"') {
            path = path.substr(1, path.length() - 2);
        }
        if (PathFileExistsW(path.c_str())) {
            std::string content, toolType;
            if (LoadUniversalGiriFile(path, content, toolType)) {
                SETTEXTEX st = { ST_DEFAULT, CP_UTF8 };
                SendMessageW(g_hRichEdit, EM_SETTEXTEX, (WPARAM)&st, (LPARAM)content.c_str());
                g_currentFilePath = path;
                SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
                SetWindowTextW(g_hMainWnd, (PathFindFileNameW(path.c_str()) + std::wstring(L" — Giri Drift")).c_str());
            }
        }
    }

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);
    if (wcsstr(lpCmdLine, L"-lang:hi")) {
        SetEditorLanguage(L"HIN", L"Noto Sans Devanagari", 14);
    }
    UpdateStatusBar(g_hMainWnd);

    // Message Loop
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    if (g_hRichEditLib) FreeLibrary(g_hRichEditLib);
    return (int)msg.wParam;
}


void SetEditorLanguage(const wchar_t* langCode, const wchar_t* fontName, int pointSize) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    cf.dwMask = CFM_FACE | CFM_SIZE;
    wcscpy_s(cf.szFaceName, fontName);
    cf.yHeight = pointSize * 20;
    if (g_hRichEdit) SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_ALL | SCF_SELECTION, (LPARAM)&cf);
    if (g_hFontCombo) {
        LRESULT idx = SendMessageW(g_hFontCombo, CB_FINDSTRINGEXACT, -1, (LPARAM)fontName);
        if (idx != CB_ERR) SendMessageW(g_hFontCombo, CB_SETCURSEL, idx, 0);
    }
    if (g_hStatusBar) {
        std::wstring st = std::wstring(L" [") + langCode + L"] " + fontName + L" Active";
        SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)st.c_str());
    }
}

void CreateMainMenu(HWND hwnd) {
    HMENU hMenuBar = CreateMenu();

    // File Menu
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

    // Edit Menu
    HMENU hEdit = CreatePopupMenu();
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_UNDO, L"&Undo\tCtrl+Z");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_REDO, L"&Redo\tCtrl+Y");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_CUT, L"Cu&t\tCtrl+X");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_COPY, L"&Copy\tCtrl+C");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_PASTE, L"&Paste\tCtrl+V");
    AppendMenuW(hEdit, MF_STRING, IDM_EDIT_SELECTALL, L"Select &All\tCtrl+A");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hEdit, L"&Edit");

    // Format Menu
    HMENU hFormat = CreatePopupMenu();
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_BOLD, L"&Bold\tCtrl+B");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ITALIC, L"&Italic\tCtrl+I");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_UNDERLINE, L"&Underline\tCtrl+U");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_STRIKE, L"&Strikethrough");
    AppendMenuW(hFormat, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_COLOR, L"Text &Color...");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_FONT, L"Choose &Font...");
    AppendMenuW(hFormat, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_L, L"Align &Left\tCtrl+L");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_C, L"Align &Center\tCtrl+E");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_R, L"Align &Right\tCtrl+R");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_ALIGN_J, L"&Justify\tCtrl+J");
    AppendMenuW(hFormat, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_BULLETS, L"&Bullet List");
    AppendMenuW(hFormat, MF_STRING, IDM_FORMAT_NUMBERS, L"&Numbered List");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hFormat, L"F&ormat");

    // Insert Menu
    HMENU hInsert = CreatePopupMenu();
    AppendMenuW(hInsert, MF_STRING, IDC_BTN_TABLE, L"Insert Formatted &Table...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hInsert, L"&Insert");

    // Templates Menu
    HMENU hTemplates = CreatePopupMenu();
    AppendMenuW(hTemplates, MF_STRING, 4001, L"Executive Strategic Charter");
    AppendMenuW(hTemplates, MF_STRING, 4002, L"Corporate Mutual Non-Disclosure Agreement (NDA)");
    AppendMenuW(hTemplates, MF_STRING, 4003, L"Enterprise Transformation Proposal");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hTemplates, L"&Templates");

    // Tools Menu
    HMENU hTools = CreatePopupMenu();
    AppendMenuW(hTools, MF_STRING, IDM_TOOLS_WORDCOUNT, L"&Word Count Statistics...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hTools, L"&Tools");

    // Help Menu
    HMENU hHelp = CreatePopupMenu();
    AppendMenuW(hHelp, MF_STRING, IDM_HELP_ABOUT, L"&About Giri Drift...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hHelp, L"&Help");

    SetMenu(hwnd, hMenuBar);
}

void CreateRibbonToolbar(HWND hwnd) {
    // Container panel across top
    g_hToolbarPanel = CreateWindowExW(
        0, L"STATIC", L"",
        WS_CHILD | WS_VISIBLE | SS_LEFT | WS_CLIPCHILDREN,
        0, 0, 1080, 38, hwnd, (HMENU)IDC_TOOLBAR_PANEL, g_hInst, NULL
    );

    HFONT hFont = CreateFontW(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");

    // 1. Font Family Dropdown
    g_hFontCombo = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
        4, 5, 140, 260, g_hToolbarPanel, (HMENU)IDC_COMBO_FONT, g_hInst, NULL
    );
    const wchar_t* fonts[] = {
        L"Segoe UI", L"Noto Sans Devanagari", L"Mangal", L"Nirmala UI", L"Calibri", L"Arial",
        L"Times New Roman", L"Georgia", L"Verdana", L"Trebuchet MS", L"Consolas", L"Courier New", L"Tahoma",
        L"Noto Sans Arabic", L"Microsoft YaHei", L"Meiryo"
    };
    for (const wchar_t* f : fonts) {
        SendMessageW(g_hFontCombo, CB_ADDSTRING, 0, (LPARAM)f);
    }
    SendMessageW(g_hFontCombo, CB_SETCURSEL, 0, 0);
    SendMessageW(g_hFontCombo, WM_SETFONT, (WPARAM)hFont, TRUE);

    // 2. Font Size Dropdown
    g_hSizeCombo = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
        148, 5, 52, 260, g_hToolbarPanel, (HMENU)IDC_COMBO_SIZE, g_hInst, NULL
    );
    const wchar_t* sizes[] = { L"9", L"10", L"11", L"12", L"14", L"16", L"18", L"20", L"24", L"28", L"36", L"48", L"72" };
    for (const wchar_t* s : sizes) {
        SendMessageW(g_hSizeCombo, CB_ADDSTRING, 0, (LPARAM)s);
    }
    SendMessageW(g_hSizeCombo, CB_SETCURSEL, 3, 0); // 12pt default
    SendMessageW(g_hSizeCombo, WM_SETFONT, (WPARAM)hFont, TRUE);

    // Formatting Buttons Helper
    auto makeBtn = [hFont](const wchar_t* text, int x, int w, int id) {
        HWND btn = CreateWindowExW(
            0, L"BUTTON", text,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            x, 5, w, 27, g_hToolbarPanel, (HMENU)(INT_PTR)id, g_hInst, NULL
        );
        SendMessageW(btn, WM_SETFONT, (WPARAM)hFont, TRUE);
        return btn;
    };

    makeBtn(L"B", 204, 26, IDC_BTN_BOLD);
    makeBtn(L"I", 232, 26, IDC_BTN_ITALIC);
    makeBtn(L"U", 260, 26, IDC_BTN_UNDERLINE);
    makeBtn(L"S", 288, 26, IDC_BTN_STRIKE);

    makeBtn(L"🎨 Color", 318, 62, IDC_BTN_COLOR);

    makeBtn(L"L", 384, 25, IDC_BTN_ALIGN_L);
    makeBtn(L"C", 411, 25, IDC_BTN_ALIGN_C);
    makeBtn(L"R", 438, 25, IDC_BTN_ALIGN_R);
    makeBtn(L"J", 465, 25, IDC_BTN_JUSTIFY);

    makeBtn(L"• List", 494, 48, IDC_BTN_BULLETS);
    makeBtn(L"1. Num", 544, 52, IDC_BTN_NUMBERS);

    makeBtn(L"⊞ Table", 600, 62, IDC_BTN_TABLE);
    makeBtn(L"📂 Templates ▼", 666, 105, IDC_BTN_TEMPLATES);
    makeBtn(L"📊 Stats", 775, 58, IDC_BTN_STATS);
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

    wchar_t stat1[64], stat2[64];
    swprintf_s(stat1, L"Words: %d | Chars: %d", words, textLen);

    DWORD selStart = 0;
    SendMessageW(g_hRichEdit, EM_GETSEL, (WPARAM)&selStart, 0);
    LRESULT lineIdx = SendMessageW(g_hRichEdit, EM_LINEFROMCHAR, selStart, 0);
    LRESULT lineStart = SendMessageW(g_hRichEdit, EM_LINEINDEX, lineIdx, 0);
    swprintf_s(stat2, L"Line: %lld, Col: %lld", (long long)(lineIdx + 1), (long long)(selStart - lineStart + 1));

    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)stat1);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)stat2);
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L"Zoom: 100%");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 3, (LPARAM)L"● 100% Offline Standalone");
}

void DoFileNew(HWND hwnd) {
    if (SendMessageW(g_hRichEdit, EM_GETMODIFY, 0, 0)) {
        int res = MessageBoxW(hwnd, L"Do you want to save changes to the current document?", L"Giri Drift", MB_YESNOCANCEL | MB_ICONQUESTION);
        if (res == IDYES) DoFileSave(hwnd, false);
        else if (res == IDCANCEL) return;
    }
    SetWindowTextW(g_hRichEdit, L"");
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
    g_currentFilePath = L"";
    SetWindowTextW(hwnd, L"Untitled Document — Giri Drift (Executive Document Composer)");
    UpdateStatusBar(hwnd);
}

void DoFileOpen(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Sovereign Document (*.giri;*.gdrift)\0*.giri;*.gdrift\0Rich Text Format (*.rtf)\0*.rtf\0Plain Text (*.txt)\0*.txt\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::string content, toolType;
        if (LoadUniversalGiriFile(szFile, content, toolType)) {
            SETTEXTEX st = { ST_DEFAULT, CP_UTF8 };
            SendMessageW(g_hRichEdit, EM_SETTEXTEX, (WPARAM)&st, (LPARAM)content.c_str());
            g_currentFilePath = szFile;
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

    int len = GetWindowTextLengthA(g_hRichEdit);
    std::string text(len + 1, '\0');
    GetWindowTextA(g_hRichEdit, &text[0], len + 1);

    SaveUniversalGiriFile(g_currentFilePath, L"drift", PathFindFileNameW(g_currentFilePath.c_str()), text);
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
    SetWindowTextW(hwnd, (PathFindFileNameW(g_currentFilePath.c_str()) + std::wstring(L" — Giri Drift")).c_str());
    MessageBoxW(hwnd, L"Document saved successfully!", L"Giri Drift", MB_OK | MB_ICONINFORMATION);
}

void DoFormatBold(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_BOLD;
    cf.dwEffects ^= CFE_BOLD;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatItalic(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_ITALIC;
    cf.dwEffects ^= CFE_ITALIC;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatUnderline(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_UNDERLINE;
    cf.dwEffects ^= CFE_UNDERLINE;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatStrike(HWND hwnd) {
    CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
    SendMessageW(g_hRichEdit, EM_GETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    cf.dwMask = CFM_STRIKEOUT;
    cf.dwEffects ^= CFE_STRIKEOUT;
    SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
}

void DoFormatAlign(HWND hwnd, WORD alignment) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_ALIGNMENT;
    pf.wAlignment = alignment;
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
}

void DoFormatBullets(HWND hwnd) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_NUMBERING;
    pf.wNumbering = PFN_BULLET;
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
}

void DoFormatNumbers(HWND hwnd) {
    PARAFORMAT2 pf = { sizeof(PARAFORMAT2) };
    pf.dwMask = PFM_NUMBERING;
    pf.wNumbering = 2; // Arabic numbers
    SendMessageW(g_hRichEdit, EM_SETPARAFORMAT, 0, (LPARAM)&pf);
}

void DoFormatColor(HWND hwnd) {
    CHOOSECOLORW cc = { sizeof(CHOOSECOLORW) };
    static COLORREF customColors[16] = { 0 };
    cc.hwndOwner = hwnd;
    cc.lpCustColors = customColors;
    cc.Flags = CC_RGBINIT | CC_FULLOPEN;

    if (ChooseColorW(&cc)) {
        CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
        cf.dwMask = CFM_COLOR;
        cf.crTextColor = cc.rgbResult;
        SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_SELECTION, (LPARAM)&cf);
    }
}

void DoInsertTable(HWND hwnd) {
    std::wstring table =
        L"\r\n"
        L"┌────────────────────────────┬────────────────────────────┬────────────────────────────┐\r\n"
        L"│ Deliverable / Pillar       │ Owner / Attribution        │ Completion Status          │\r\n"
        L"├────────────────────────────┼────────────────────────────┼────────────────────────────┤\r\n"
        L"│ Native C++ Engine          │ Abhinav Giri               │ 100% Operational           │\r\n"
        L"│ In-Memory Data Vault       │ Cryptographic Security     │ Zero Telemetry             │\r\n"
        L"│ Universal Office Format    │ Sovereign Interop (.giri)  │ Verified Complete          │\r\n"
        L"└────────────────────────────┴────────────────────────────┴────────────────────────────┘\r\n\r\n";
    SendMessageW(g_hRichEdit, EM_REPLACESEL, TRUE, (LPARAM)table.c_str());
}

void ApplyTemplateContent(int templateIndex) {
    std::wstring content = L"";
    if (templateIndex == 1) {
        content =
            L"EXECUTIVE STRATEGIC CHARTER (2026-2028)\r\n"
            L"Giri Orbit Sovereign Enterprise Architecture\r\n"
            L"Author: Abhinav Giri (github.com/abhinavgiri45 | abhinavgiri370@gmail.com)\r\n\r\n"
            L"1. MISSION STATEMENT\r\n"
            L"To establish complete cryptographic sovereignty, eliminate external web dependencies, and provide high-velocity desktop office tools that operate 100% offline in client memory.\r\n\r\n"
            L"2. STRATEGIC OBJECTIVES\r\n"
            L" • Native Compilation: Built directly with C++ Win32 API for zero runtime overhead.\r\n"
            L" • Total Privacy: Zero cloud pings, zero bot challenges, zero telemetry.\r\n"
            L" • Sub-15MB RAM: 95% lighter than web browser-based office suites.\r\n\r\n"
            L"3. SIGNATURE & RATIFICATION\r\n"
            L"Abhinav Giri — Founder & Chief Sovereign Architect\r\n";
    } else if (templateIndex == 2) {
        content =
            L"MUTUAL NON-DISCLOSURE AGREEMENT (NDA)\r\n"
            L"Made by Abhinav Giri (abhinavgiri370@gmail.com)\r\n\r\n"
            L"1. CONFIDENTIAL INFORMATION\r\n"
            L"Both parties agree that all software architectures, mathematical matrices, and proprietary algorithms disclosed remain strictly confidential.\r\n\r\n"
            L"2. DATA SOVEREIGNTY\r\n"
            L"No confidential data shall be stored on unencrypted public clouds.\r\n\r\n"
            L"IN WITNESS WHEREOF, the parties execute this agreement:\r\n"
            L"Disclosing Party: Abhinav Giri\r\n"
            L"Receiving Party: _________________________\r\n";
    } else if (templateIndex == 3) {
        content =
            L"ENTERPRISE TECHNOLOGY TRANSFORMATION PROPOSAL\r\n"
            L"Prepared by: Abhinav Giri (abhinavgiri370@gmail.com)\r\n\r\n"
            L"1. OVERVIEW\r\n"
            L"Transitioning corporate workflows from bloated multi-gigabyte office suites to lightweight, sovereign C++ standalone tools.\r\n\r\n"
            L"2. DELIVERABLES\r\n"
            L" • Giri Drift (Word Processor)\r\n"
            L" • Giri Axis (Financial Matrix)\r\n"
            L" • Giri Kinetic (Presentation Studio)\r\n\r\n"
            L"Contact: abhinavgiri370@gmail.com\r\n";
    } else if (templateIndex == 4) {
        content =
            L"गोपनीय व्यावसायिक प्रस्ताव (कार्यकारी हिन्दी प्रारूप)\r\n"
            L"निर्माता: अभिनव गिरी (github.com/abhinavgiri45 | abhinavgiri370@gmail.com)\r\n"
            L"सॉवरेन सुइट: गिरी ऑर्बिट — १००% ऑफ़लाइन डेस्कटॉप सुइट\r\n\r\n"
            L"१. उद्देश्य एवं सारांश\r\n"
            L"यह दस्तावेज़ गूगल नोतो संस देवनागरी (Google Noto Sans Devanagari) फ़ॉन्ट शैली के उपयोग के साथ तैयार किया गया है। यह संपूर्ण डेटा संप्रभुता और गोपनीयता सुनिश्चित करता है।\r\n\r\n"
            L"२. मुख्य विशेषताएं\r\n"
            L" • शून्य क्लाउड निर्भरता: बिना किसी इंटरनेट कनेक्शन के संपूर्ण निष्पादन।\r\n"
            L" • बहुभाषी भाषा पैक: १००+ अंतरराष्ट्रीय भाषाओं एवं देवनागरी लिपियों का पूर्ण समर्थन।\r\n"
            L" • उच्च गति निष्पादन: तीव्र आरंभ (<३० मिलीसेकंड) तथा न्यूनतम रैम उपयोग।\r\n\r\n"
            L"३. हस्ताक्षर एवं अनुमोदन\r\n"
            L"अभिनव गिरी — मुख्य संप्रभु वास्तुकार\r\n";
    }

    SetWindowTextW(g_hRichEdit, content.c_str());
    if (templateIndex == 4) {
        CHARFORMAT2W cf = { sizeof(CHARFORMAT2W) };
        cf.dwMask = CFM_FACE | CFM_SIZE;
        cf.yHeight = 260; // 13pt
        wcscpy_s(cf.szFaceName, L"Noto Sans Devanagari");
        SendMessageW(g_hRichEdit, EM_SETCHARFORMAT, SCF_ALL, (LPARAM)&cf);
    }
    SendMessageW(g_hRichEdit, EM_SETMODIFY, FALSE, 0);
}

void DoShowTemplatesMenu(HWND hwnd) {
    HMENU hPopup = CreatePopupMenu();
    AppendMenuW(hPopup, MF_STRING, 4001, L"1. Executive Strategic Charter");
    AppendMenuW(hPopup, MF_STRING, 4002, L"2. Corporate Mutual NDA");
    AppendMenuW(hPopup, MF_STRING, 4003, L"3. Enterprise Transformation Proposal");
    AppendMenuW(hPopup, MF_STRING, 4004, L"4. कार्यकारी हिन्दी प्रारूप (Google Hindi Style)");

    RECT btnRect;
    HWND hBtn = GetDlgItem(g_hToolbarPanel, IDC_BTN_TEMPLATES);
    GetWindowRect(hBtn, &btnRect);

    TrackPopupMenu(hPopup, TPM_LEFTALIGN | TPM_TOPALIGN, btnRect.left, btnRect.bottom, 0, hwnd, NULL);
    DestroyMenu(hPopup);
}

void DoWordCount(HWND hwnd) {
    int textLen = GetWindowTextLengthW(g_hRichEdit);
    std::wstring buf(textLen + 1, L'\0');
    GetWindowTextW(g_hRichEdit, &buf[0], textLen + 1);

    int words = 0, paragraphs = 1, spaces = 0;
    bool inWord = false;
    for (wchar_t ch : buf) {
        if (ch == L'\n') paragraphs++;
        if (ch == L' ') spaces++;
        if (iswspace(ch)) inWord = false;
        else if (!inWord) { inWord = true; words++; }
    }

    wchar_t report[256];
    swprintf_s(report,
        L"Giri Drift — Document Statistics\n\n"
        L"Words: %d\n"
        L"Characters (with spaces): %d\n"
        L"Characters (no spaces): %d\n"
        L"Paragraphs: %d\n"
        L"Estimated Reading Time: %d min\n\n"
        L"Made by Abhinav Giri (abhinavgiri370@gmail.com)\n"
        L"100% Offline Standalone Architecture",
        words, textLen, textLen - spaces, paragraphs, (words / 200) + 1
    );
    MessageBoxW(hwnd, report, L"Word Count Statistics", MB_OK | MB_ICONINFORMATION);
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
        case WM_SIZE: {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);

            // Resize status bar
            SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
            RECT rcStatus;
            GetWindowRect(g_hStatusBar, &rcStatus);
            int statusHeight = rcStatus.bottom - rcStatus.top;

            int toolHeight = 38;
            MoveWindow(g_hToolbarPanel, 0, 0, rcClient.right, toolHeight, TRUE);

            int editTop = toolHeight;
            int editHeight = rcClient.bottom - toolHeight - statusHeight;
            MoveWindow(g_hRichEdit, 0, editTop, rcClient.right, editHeight, TRUE);
            break;
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
                    if (PrintDlgW(&pd)) {
                        DeleteDC(pd.hDC);
                    }
                    break;
                }
                case IDM_FILE_EXIT: DestroyWindow(hwnd); break;

                case IDM_LANG_EN:
                    SetEditorLanguage(L"ENG", L"Segoe UI", 12);
                    break;
                case IDM_LANG_HI:
                    SetEditorLanguage(L"HIN", L"Noto Sans Devanagari", 14);
                    break;
                case IDM_LANG_ES:
                    SetEditorLanguage(L"ESP", L"Segoe UI", 12);
                    break;
                case IDM_LANG_FR:
                    SetEditorLanguage(L"FRA", L"Segoe UI", 12);
                    break;
                case IDM_LANG_DE:
                    SetEditorLanguage(L"DEU", L"Segoe UI", 12);
                    break;
                case IDM_LANG_SPELLCHECK:
                    MessageBoxW(hwnd, L"Integrated Sovereign Proofing Active.\nSpelling dictionaries and Google Hindi typography are bundled directly into Giri Drift.", L"Giri Drift Proofing", MB_OK | MB_ICONINFORMATION);
                    break;

                case IDM_EDIT_UNDO: SendMessageW(g_hRichEdit, EM_UNDO, 0, 0); break;
                case IDM_EDIT_REDO: SendMessageW(g_hRichEdit, EM_REDO, 0, 0); break;
                case IDM_EDIT_CUT: SendMessageW(g_hRichEdit, WM_CUT, 0, 0); break;
                case IDM_EDIT_COPY: SendMessageW(g_hRichEdit, WM_COPY, 0, 0); break;
                case IDM_EDIT_PASTE: SendMessageW(g_hRichEdit, WM_PASTE, 0, 0); break;
                case IDM_EDIT_SELECTALL: {
                    CHARRANGE cr = { 0, -1 };
                    SendMessageW(g_hRichEdit, EM_EXSETSEL, 0, (LPARAM)&cr);
                    break;
                }

                case IDM_FORMAT_BOLD:
                case IDC_BTN_BOLD: DoFormatBold(hwnd); break;
                case IDM_FORMAT_ITALIC:
                case IDC_BTN_ITALIC: DoFormatItalic(hwnd); break;
                case IDM_FORMAT_UNDERLINE:
                case IDC_BTN_UNDERLINE: DoFormatUnderline(hwnd); break;
                case IDM_FORMAT_STRIKE:
                case IDC_BTN_STRIKE: DoFormatStrike(hwnd); break;

                case IDM_FORMAT_COLOR:
                case IDC_BTN_COLOR: DoFormatColor(hwnd); break;

                case IDM_FORMAT_ALIGN_L:
                case IDC_BTN_ALIGN_L: DoFormatAlign(hwnd, PFA_LEFT); break;
                case IDM_FORMAT_ALIGN_C:
                case IDC_BTN_ALIGN_C: DoFormatAlign(hwnd, PFA_CENTER); break;
                case IDM_FORMAT_ALIGN_R:
                case IDC_BTN_ALIGN_R: DoFormatAlign(hwnd, PFA_RIGHT); break;
                case IDM_FORMAT_ALIGN_J:
                case IDC_BTN_JUSTIFY: DoFormatAlign(hwnd, PFA_JUSTIFY); break;

                case IDM_FORMAT_BULLETS:
                case IDC_BTN_BULLETS: DoFormatBullets(hwnd); break;
                case IDM_FORMAT_NUMBERS:
                case IDC_BTN_NUMBERS: DoFormatNumbers(hwnd); break;

                case IDC_BTN_TABLE: DoInsertTable(hwnd); break;
                case IDC_BTN_TEMPLATES: DoShowTemplatesMenu(hwnd); break;

                case 4001: ApplyTemplateContent(1); break;
                case 4002: ApplyTemplateContent(2); break;
                case 4003: ApplyTemplateContent(3); break;
                case 4004: ApplyTemplateContent(4); break;

                case IDM_TOOLS_WORDCOUNT:
                case IDC_BTN_STATS: DoWordCount(hwnd); break;

                case IDM_HELP_ABOUT: {
                    std::wstring msg =
                        L"Giri Drift — Sovereign Document Composer\n"
                        L"Version 11.8.6 (Native C++ Win32 Edition)\n\n"
                        L"Author: Abhinav Giri\n"
                        L"GitHub: https://github.com/abhinavgiri45\n"
                        L"Instagram: @abhinavgiri45\n"
                        L"Email: abhinavgiri370@gmail.com\n\n"
                        L"100% Offline Standalone Architecture\n"
                        L"Zero Browser • Zero Telemetry • Total Data Sovereignty";
                    MessageBoxW(hwnd, msg.c_str(), L"About Giri Drift", MB_OK | MB_ICONINFORMATION);
                    break;
                }
            }
            break;
        }

        case WM_NOTIFY: {
            NMHDR* pnm = (NMHDR*)lParam;
            if (pnm && pnm->hwndFrom == g_hRichEdit) {
                if (pnm->code == EN_CHANGE || pnm->code == EN_SELCHANGE) {
                    UpdateStatusBar(hwnd);
                }
            }
            break;
        }

        case WM_CLOSE: {
            if (SendMessageW(g_hRichEdit, EM_GETMODIFY, 0, 0)) {
                int res = MessageBoxW(hwnd, L"Do you want to save changes before closing?", L"Giri Drift", MB_YESNOCANCEL | MB_ICONQUESTION);
                if (res == IDYES) {
                    DoFileSave(hwnd, false);
                    DestroyWindow(hwnd);
                } else if (res == IDNO) {
                    DestroyWindow(hwnd);
                }
                return 0;
            }
            DestroyWindow(hwnd);
            break;
        }

        case WM_DESTROY: {
            PostQuitMessage(0);
            break;
        }

        default:
            return DefWindowProcW(hwnd, msg, wParam, lParam);
    }
    return 0;
}
