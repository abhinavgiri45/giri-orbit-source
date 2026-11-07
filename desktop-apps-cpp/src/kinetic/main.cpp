/* ============================================================================
 * GIRI KINETIC — CINEMATIC WIDESCREEN PRESENTATION STUDIO (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Official Contact: abhinavgiri370@gmail.com
 * 100% Offline Standalone Native C++ Win32 Desktop Application
 * Zero Browser • Zero Cloud Telemetry • Sovereign Presentation Engine
 * With Office-Grade Slide Transitions & In-Slide Animations
 * With PresentationGo (www.presentationgo.com) Global Template Integration
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <cmath>

#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "comdlg32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "msimg32.lib")

// Menu Identifiers
#define IDM_SLIDE_NEW_TITLE         1071
#define IDM_SLIDE_NEW_CONTENT       1072
#define IDM_SLIDE_NEW_METRICS       1073
#define IDM_SLIDE_DUPLICATE         1074
#define IDM_SLIDE_DELETE            1075
#define IDM_SHOW_FROM_START         1080
#define IDM_SHOW_FROM_CURRENT       1081
#define IDM_TEMPLATES_GALLERY       1085
#define IDM_WATERMARK_LINK          1086

// Transitions Menu Identifiers
#define IDM_TRANS_NONE              1100
#define IDM_TRANS_FADE              1101
#define IDM_TRANS_PUSH_LEFT         1102
#define IDM_TRANS_PUSH_RIGHT        1103
#define IDM_TRANS_WIPE_DOWN         1104
#define IDM_TRANS_WIPE_UP           1105
#define IDM_TRANS_ZOOM_IN           1106
#define IDM_TRANS_DISSOLVE          1107
#define IDM_TRANS_SPEED_FAST        1110
#define IDM_TRANS_SPEED_NORMAL      1111
#define IDM_TRANS_SPEED_SLOW        1112
#define IDM_TRANS_APPLY_ALL         1115
#define IDM_TRANS_PREVIEW           1116

// Animations Menu Identifiers
#define IDM_ANIM_NONE               1120
#define IDM_ANIM_FADE_IN            1121
#define IDM_ANIM_FLY_BOTTOM         1122
#define IDM_ANIM_FLY_LEFT           1123
#define IDM_ANIM_ZOOM_IN            1124
#define IDM_ANIM_TYPEWRITER         1125
#define IDM_ANIM_STEP_BY_STEP       1130
#define IDM_ANIM_PREVIEW            1131

// Controls
#define IDC_SLIDE_LIST              3201
#define IDC_CANVAS_PANE             3202
#define IDC_EDIT_TITLE              3203
#define IDC_EDIT_BODY               3204
#define IDC_COMBO_TRANS             3205
#define IDC_COMBO_ANIM              3206
#define IDC_BTN_PREVIEW_TRANS       3207
#define IDC_BTN_APPLY_ALL           3208
#define IDC_BTN_PRESENT             3209

// Timers
#define IDT_TRANSITION_TIMER        5001
#define IDT_ANIMATION_TIMER         5002

enum SlideLayout {
    LAYOUT_TITLE_HERO,
    LAYOUT_TITLE_CONTENT,
    LAYOUT_METRICS_DASHBOARD,
    LAYOUT_TWO_COLUMN
};

enum TransitionType {
    TRANS_NONE = 0,
    TRANS_FADE,
    TRANS_PUSH_LEFT,
    TRANS_PUSH_RIGHT,
    TRANS_WIPE_DOWN,
    TRANS_WIPE_UP,
    TRANS_ZOOM_IN,
    TRANS_DISSOLVE
};

enum AnimationType {
    ANIM_NONE = 0,
    ANIM_FADE_IN,
    ANIM_FLY_IN_BOTTOM,
    ANIM_FLY_IN_LEFT,
    ANIM_ZOOM_IN,
    ANIM_TYPEWRITER
};

struct Slide {
    std::wstring title;
    std::wstring subtitle;
    std::wstring body;
    SlideLayout layout;
    COLORREF bgColor;
    COLORREF textColor;
    COLORREF accentColor;
    TransitionType transition;
    int transitionSpeedMs;
    AnimationType animType;
    bool stepByStep;
};

// Global handles & state
HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hSlideListWnd = NULL;
HWND g_hCanvasWnd = NULL;
HWND g_hEditTitle = NULL;
HWND g_hEditBody = NULL;
HWND g_hComboTrans = NULL;
HWND g_hComboAnim = NULL;
HWND g_hBtnPreview = NULL;
HWND g_hBtnApplyAll = NULL;
HWND g_hBtnPresent = NULL;
HWND g_hStatusBar = NULL;
HWND g_hShowWnd = NULL;

std::vector<Slide> g_slides;
int g_currentSlide = 0;
std::wstring g_currentFilePath = L"";
bool g_inSlideShow = false;

// Transition playback state
bool g_isTransitioning = false;
int g_fromSlideIdx = 0;
int g_toSlideIdx = 0;
DWORD g_transStartTime = 0;
int g_transDuration = 450;
TransitionType g_activeTransition = TRANS_FADE;

// In-slide Animation playback state
int g_currentAnimStep = 999;
int g_maxAnimSteps = 1;
bool g_isElementAnimating = false;
DWORD g_elemAnimStartTime = 0;
int g_elemAnimDuration = 350;

// Presenter laser pointer & drawing state
bool g_laserActive = false;
POINT g_laserPos = { 0, 0 };
std::vector<std::vector<POINT>> g_penStrokes;
bool g_isDrawing = false;

// Forward declarations
LRESULT CALLBACK MainWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK CanvasWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK ShowWndProc(HWND, UINT, WPARAM, LPARAM);
void CreateMainMenu(HWND);
void UpdateStatusBar(HWND);
void DoFileOpen(HWND);
void DoFileSave(HWND, bool);
void StartSlideShow(HWND, int startIdx);
void ApplyTemplate(int templateId);
void ShowTemplateLibrary(HWND);
void TriggerSlideTransition(HWND targetWnd, int fromIdx, int toIdx, TransitionType tType, int durationMs);
void TriggerSlidePreview(HWND targetWnd);
int CountSlideAnimationSteps(const Slide& s);
void RenderSlideContent(HDC hdc, const RECT& slideRect, const Slide& slide, bool isFullHD, int animStep, float animProgress);

// Helper: split text into bullet lines
std::vector<std::wstring> SplitBulletLines(const std::wstring& text) {
    std::vector<std::wstring> lines;
    std::wistringstream ss(text);
    std::wstring line;
    while (std::getline(ss, line)) {
        if (!line.empty()) lines.push_back(line);
    }
    if (lines.empty()) lines.push_back(L"");
    return lines;
}

int CountSlideAnimationSteps(const Slide& s) {
    if (s.animType == ANIM_NONE || !s.stepByStep) return 1;
    auto lines = SplitBulletLines(s.body);
    return (int)lines.size() + 1; // 0 = Title, 1..N = bullet lines
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;

    // Dynamically Register Google Hindi & International Fonts
    wchar_t exePath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);
    std::wstring fontPath1 = std::wstring(exePath) + L"\\Fonts\\NotoSansDevanagari.ttf";
    std::wstring fontPath2 = std::wstring(exePath) + L"\\..\\fonts\\NotoSansDevanagari.ttf";
    if (PathFileExistsW(fontPath1.c_str())) AddFontResourceExW(fontPath1.c_str(), FR_PRIVATE, NULL);
    else if (PathFileExistsW(fontPath2.c_str())) AddFontResourceExW(fontPath2.c_str(), FR_PRIVATE, NULL);

    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_LISTVIEW_CLASSES | ICC_BAR_CLASSES };
    InitCommonControlsEx(&icex);

    // Initialize default executive slide deck with transitions & animations
    Slide s1;
    s1.title = L"Giri Orbit Executive Architecture";
    s1.subtitle = L"Sovereign Desktop Ecosystem & In-Memory Confidential Computing";
    s1.body = L"Made by Abhinav Giri (github.com/abhinavgiri45 | @abhinavgiri45)\n"
              L"• 100% Offline Standalone C++ Engine with Zero Cloud Telemetry\n"
              L"• Dynamic Slide Transitions: Fade, Push, Wipe, Zoom, and Dissolve\n"
              L"• Interactive In-Slide Animations: Step-by-Step Bullet Reveal\n"
              L"• Global Presentation Engine with www.presentationgo.com integration";
    s1.layout = LAYOUT_TITLE_HERO;
    s1.bgColor = RGB(15, 23, 42); // Deep Slate Navy
    s1.textColor = RGB(248, 250, 252);
    s1.accentColor = RGB(56, 189, 248); // Sky blue
    s1.transition = TRANS_FADE;
    s1.transitionSpeedMs = 450;
    s1.animType = ANIM_FLY_IN_BOTTOM;
    s1.stepByStep = true;
    g_slides.push_back(s1);

    Slide s2;
    s2.title = L"Strategic Pillar: Dynamic Transitions & Flow";
    s2.subtitle = L"Fluid Desktop Animations Without Web Overhead";
    s2.body = L"1. GPU Double-Buffered Blending: 60 FPS Win32 hardware composition\n"
              L"2. Multi-Directional Push & Wipe: Smooth slide pacing for high-stakes pitches\n"
              L"3. Alpha Crossfades: Zero flickering or tear during slide transitions\n"
              L"4. Sequential Bullet Entrance: Control speaker focus on each key point";
    s2.layout = LAYOUT_TITLE_CONTENT;
    s2.bgColor = RGB(255, 255, 255);
    s2.textColor = RGB(15, 23, 42);
    s2.accentColor = RGB(37, 99, 235);
    s2.transition = TRANS_PUSH_LEFT;
    s2.transitionSpeedMs = 450;
    s2.animType = ANIM_FLY_IN_LEFT;
    s2.stepByStep = true;
    g_slides.push_back(s2);

    Slide s3;
    s3.title = L"Key Performance & Transition Metrics";
    s3.subtitle = L"Engineering Benchmark vs Traditional Web Hybrids";
    s3.body = L"Transition Frame Rate: 60 FPS (Hardware GDI Alpha Composition)\n"
              L"Memory Consumption: 94% Reduction (12MB vs 240MB)\n"
              L"Animation Response Latency: < 1ms (Native In-Memory Win32 Execution)\n"
              L"Network Requirement: Exactly 0 KB/s (100% Sovereign Offline)";
    s3.layout = LAYOUT_METRICS_DASHBOARD;
    s3.bgColor = RGB(248, 250, 252);
    s3.textColor = RGB(15, 23, 42);
    s3.accentColor = RGB(16, 185, 129); // Emerald
    s3.transition = TRANS_ZOOM_IN;
    s3.transitionSpeedMs = 500;
    s3.animType = ANIM_ZOOM_IN;
    s3.stepByStep = true;
    g_slides.push_back(s3);

    // Register Window Classes
    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = MainWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wcex.lpszClassName = L"GiriKineticMainWindowClass";
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);
    if (!RegisterClassExW(&wcex)) return 0;

    WNDCLASSEXW canvasWcex = { sizeof(WNDCLASSEXW) };
    canvasWcex.style = CS_HREDRAW | CS_VREDRAW;
    canvasWcex.lpfnWndProc = CanvasWndProc;
    canvasWcex.hInstance = hInstance;
    canvasWcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    canvasWcex.hbrBackground = CreateSolidBrush(RGB(226, 232, 240));
    canvasWcex.lpszClassName = L"GiriKineticCanvasClass";
    if (!RegisterClassExW(&canvasWcex)) return 0;

    WNDCLASSEXW showWcex = { sizeof(WNDCLASSEXW) };
    showWcex.style = CS_HREDRAW | CS_VREDRAW;
    showWcex.lpfnWndProc = ShowWndProc;
    showWcex.hInstance = hInstance;
    showWcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    showWcex.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    showWcex.lpszClassName = L"GiriKineticSlideShowClass";
    if (!RegisterClassExW(&showWcex)) return 0;

    g_hMainWnd = CreateWindowExW(
        0, L"GiriKineticMainWindowClass",
        L"Presentation 1 — Giri Kinetic (Cinematic Widescreen Studio & Animations)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1180, 780,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateMainMenu(g_hMainWnd);

    // Left Slide List Box
    g_hSlideListWnd = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"LISTBOX", L"",
        WS_CHILD | WS_VISIBLE | LBS_NOTIFY | WS_VSCROLL,
        8, 8, 210, 680, g_hMainWnd, (HMENU)IDC_SLIDE_LIST, hInstance, NULL
    );

    // Populate Slide List
    for (size_t i = 0; i < g_slides.size(); ++i) {
        std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
        SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
    }
    SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);

    // Quick Animations & Transitions Toolbar Strip
    int tbY = 8;
    CreateWindowExW(0, L"STATIC", L"Transition:", WS_CHILD | WS_VISIBLE, 226, tbY + 4, 66, 22, g_hMainWnd, NULL, hInstance, NULL);
    g_hComboTrans = CreateWindowExW(0, L"COMBOBOX", L"", WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL, 296, tbY, 130, 200, g_hMainWnd, (HMENU)IDC_COMBO_TRANS, hInstance, NULL);
    const wchar_t* transList[] = { L"None", L"Fade (Crossfade)", L"Push Left (→)", L"Push Right (←)", L"Wipe Down (↓)", L"Wipe Up (↑)", L"Zoom Pop", L"Dissolve" };
    for (int i = 0; i < 8; ++i) SendMessageW(g_hComboTrans, CB_ADDSTRING, 0, (LPARAM)transList[i]);
    SendMessageW(g_hComboTrans, CB_SETCURSEL, (WPARAM)g_slides[0].transition, 0);

    CreateWindowExW(0, L"STATIC", L"Animation:", WS_CHILD | WS_VISIBLE, 436, tbY + 4, 66, 22, g_hMainWnd, NULL, hInstance, NULL);
    g_hComboAnim = CreateWindowExW(0, L"COMBOBOX", L"", WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL, 506, tbY, 150, 200, g_hMainWnd, (HMENU)IDC_COMBO_ANIM, hInstance, NULL);
    const wchar_t* animList[] = { L"None", L"Fade In", L"Fly In from Bottom", L"Fly In from Left", L"Zoom In", L"Typewriter Reveal" };
    for (int i = 0; i < 6; ++i) SendMessageW(g_hComboAnim, CB_ADDSTRING, 0, (LPARAM)animList[i]);
    SendMessageW(g_hComboAnim, CB_SETCURSEL, (WPARAM)g_slides[0].animType, 0);

    g_hBtnPreview = CreateWindowExW(0, L"BUTTON", L"▶ Preview (P)", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 666, tbY, 105, 26, g_hMainWnd, (HMENU)IDC_BTN_PREVIEW_TRANS, hInstance, NULL);
    g_hBtnApplyAll = CreateWindowExW(0, L"BUTTON", L"Apply to All", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 776, tbY, 95, 26, g_hMainWnd, (HMENU)IDC_BTN_APPLY_ALL, hInstance, NULL);
    g_hBtnPresent = CreateWindowExW(0, L"BUTTON", L"▶ Start Show (F5)", WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON, 876, tbY, 130, 26, g_hMainWnd, (HMENU)IDC_BTN_PRESENT, hInstance, NULL);

    // Center 16:9 Canvas Viewport
    g_hCanvasWnd = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"GiriKineticCanvasClass", L"",
        WS_CHILD | WS_VISIBLE | WS_CLIPCHILDREN,
        226, 40, 930, 500, g_hMainWnd, (HMENU)IDC_CANVAS_PANE, hInstance, NULL
    );

    // Bottom In-place Slide Editors
    CreateWindowExW(0, L"STATIC", L"Slide Title:", WS_CHILD | WS_VISIBLE, 226, 550, 80, 22, g_hMainWnd, NULL, hInstance, NULL);
    g_hEditTitle = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", g_slides[0].title.c_str(),
        WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
        310, 548, 846, 26, g_hMainWnd, (HMENU)IDC_EDIT_TITLE, hInstance, NULL
    );

    CreateWindowExW(0, L"STATIC", L"Slide Body:", WS_CHILD | WS_VISIBLE, 226, 582, 80, 22, g_hMainWnd, NULL, hInstance, NULL);
    g_hEditBody = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", g_slides[0].body.c_str(),
        WS_CHILD | WS_VISIBLE | ES_MULTILINE | ES_AUTOVSCROLL | WS_VSCROLL,
        310, 580, 846, 110, g_hMainWnd, (HMENU)IDC_EDIT_BODY, hInstance, NULL
    );

    // Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)ID_STATUSBAR, hInstance, NULL
    );
    int statwidths[] = { 180, 480, 780, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 4, (LPARAM)statwidths);

    // Set Typography Font
    HFONT hFont = CreateFontW(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");
    SendMessageW(g_hSlideListWnd, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hEditTitle, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hEditBody, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hComboTrans, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hComboAnim, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hBtnPreview, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hBtnApplyAll, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hBtnPresent, WM_SETFONT, (WPARAM)hFont, TRUE);

    // Handle command line file argument if passed
    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        std::wstring path = lpCmdLine;
        if (path.front() == L'"' && path.back() == L'"') {
            path = path.substr(1, path.length() - 2);
        }
        if (PathFileExistsW(path.c_str())) {
            std::string content, toolType;
            if (LoadUniversalGiriFile(path, content, toolType)) {
                std::istringstream ss(content);
                std::string line;
                g_slides.clear();
                Slide current;
                current.bgColor = RGB(255, 255, 255);
                current.textColor = RGB(15, 23, 42);
                current.accentColor = RGB(37, 99, 235);
                current.layout = LAYOUT_TITLE_CONTENT;
                current.transition = TRANS_FADE;
                current.transitionSpeedMs = 450;
                current.animType = ANIM_FLY_IN_BOTTOM;
                current.stepByStep = true;

                while (std::getline(ss, line)) {
                    if (line.rfind("---SLIDE---", 0) == 0) {
                        if (!current.title.empty()) g_slides.push_back(current);
                        current.title.clear();
                        current.body.clear();
                    } else if (line.rfind("TRANS:", 0) == 0) {
                        int t = 1, spd = 450, an = 2, stp = 1;
                        sscanf_s(line.c_str(), "TRANS:%d:%d:%d:%d", &t, &spd, &an, &stp);
                        current.transition = (TransitionType)t;
                        current.transitionSpeedMs = spd;
                        current.animType = (AnimationType)an;
                        current.stepByStep = (stp != 0);
                    } else if (current.title.empty()) {
                        current.title = std::wstring(line.begin(), line.end());
                    } else {
                        current.body += std::wstring(line.begin(), line.end()) + L"\n";
                    }
                }
                if (!current.title.empty()) g_slides.push_back(current);
                if (g_slides.empty()) g_slides.push_back(s1);

                g_currentFilePath = path;
                SetWindowTextW(g_hMainWnd, (PathFindFileNameW(path.c_str()) + std::wstring(L" — Giri Kinetic")).c_str());

                SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
                for (size_t i = 0; i < g_slides.size(); ++i) {
                    std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
                    SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
                }
                SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);
            }
        }
    }

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);
    UpdateStatusBar(g_hMainWnd);

    // Message Loop
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        if (msg.message == WM_KEYDOWN) {
            if (msg.wParam == VK_F5) {
                StartSlideShow(g_hMainWnd, GetAsyncKeyState(VK_SHIFT) ? g_currentSlide : 0);
                continue;
            } else if (msg.wParam == 'P' && !(GetKeyState(VK_CONTROL) & 0x8000)) {
                TriggerSlidePreview(g_hCanvasWnd);
                continue;
            }
        }
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    return (int)msg.wParam;
}

void CreateMainMenu(HWND hwnd) {
    HMENU hMenuBar = CreateMenu();

    // File
    HMENU hFile = CreatePopupMenu();
    AppendMenuW(hFile, MF_STRING, IDM_FILE_NEW, L"&New Presentation\tCtrl+N");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_OPEN, L"&Open...\tCtrl+O");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVE, L"&Save\tCtrl+S");
    AppendMenuW(hFile, MF_STRING, IDM_FILE_SAVEAS, L"Save &As...");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, IDM_FILE_EXIT, L"E&xit\tAlt+F4");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hFile, L"&File");

    // Slide
    HMENU hSlide = CreatePopupMenu();
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_NEW_TITLE, L"New &Title Slide");
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_NEW_CONTENT, L"New &Content Slide");
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_NEW_METRICS, L"New &Metrics Dashboard Slide");
    AppendMenuW(hSlide, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_DUPLICATE, L"&Duplicate Selected Slide");
    AppendMenuW(hSlide, MF_STRING, IDM_SLIDE_DELETE, L"&Delete Selected Slide\tDel");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hSlide, L"&Slide");

    // Transitions Menu
    HMENU hTrans = CreatePopupMenu();
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_NONE, L"&None");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_FADE, L"&Fade (Alpha Crossfade)");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_PUSH_LEFT, L"&Push Left (→)");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_PUSH_RIGHT, L"Push &Right (←)");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_WIPE_DOWN, L"&Wipe Down (↓)");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_WIPE_UP, L"Wipe &Up (↑)");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_ZOOM_IN, L"&Zoom Pop");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_DISSOLVE, L"&Dissolve (Dither)");
    AppendMenuW(hTrans, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_SPEED_FAST, L"Speed: Fast (200 ms)");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_SPEED_NORMAL, L"Speed: Normal (450 ms)");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_SPEED_SLOW, L"Speed: Slow (800 ms)");
    AppendMenuW(hTrans, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_APPLY_ALL, L"&Apply Current Transition to All Slides");
    AppendMenuW(hTrans, MF_STRING, IDM_TRANS_PREVIEW, L"&Preview Slide Transition\tP");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hTrans, L"&Transitions");

    // Animations Menu
    HMENU hAnim = CreatePopupMenu();
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_NONE, L"&None (Show All At Once)");
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_FADE_IN, L"Entrance: &Fade In");
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_FLY_BOTTOM, L"Entrance: Fly In from &Bottom");
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_FLY_LEFT, L"Entrance: Fly In from &Left");
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_ZOOM_IN, L"Entrance: &Zoom In");
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_TYPEWRITER, L"Entrance: &Typewriter Reveal");
    AppendMenuW(hAnim, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_STEP_BY_STEP, L"&Step-by-Step Bullet Reveal (Click to advance each point)");
    AppendMenuW(hAnim, MF_STRING, IDM_ANIM_PREVIEW, L"&Preview Animation Sequence\tA");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hAnim, L"&Animations");

    // Templates
    HMENU hTemplates = CreatePopupMenu();
    AppendMenuW(hTemplates, MF_STRING, IDM_TEMPLATES_GALLERY, L"&Global Templates & Presets Library...");
    AppendMenuW(hTemplates, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hTemplates, MF_STRING, IDM_WATERMARK_LINK, L"Visit Template Partner (www.presentationgo.com)...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hTemplates, L"&Templates");

    // Slide Show
    HMENU hShow = CreatePopupMenu();
    AppendMenuW(hShow, MF_STRING, IDM_SHOW_FROM_START, L"Start From &Beginning\tF5");
    AppendMenuW(hShow, MF_STRING, IDM_SHOW_FROM_CURRENT, L"Start From &Current Slide\tShift+F5");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hShow, L"Slide &Show");

    // Help
    HMENU hHelp = CreatePopupMenu();
    AppendMenuW(hHelp, MF_STRING, IDM_HELP_ABOUT, L"&About Giri Kinetic...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hHelp, L"&Help");

    SetMenu(hwnd, hMenuBar);
}

void UpdateStatusBar(HWND hwnd) {
    if (!g_hStatusBar) return;

    wchar_t buf1[64];
    swprintf_s(buf1, L"Slide %d of %zu", g_currentSlide + 1, g_slides.size());
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)buf1);

    if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
        const Slide& s = g_slides[g_currentSlide];
        const wchar_t* tNames[] = { L"None", L"Fade", L"Push Left", L"Push Right", L"Wipe Down", L"Wipe Up", L"Zoom Pop", L"Dissolve" };
        const wchar_t* aNames[] = { L"None", L"Fade In", L"Fly In Bottom", L"Fly In Left", L"Zoom In", L"Typewriter" };

        wchar_t buf2[128];
        swprintf_s(buf2, L"Transition: %s (%d ms) | Animation: %s", tNames[(int)s.transition], s.transitionSpeedMs, aNames[(int)s.animType]);
        SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)buf2);
    }

    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)L"Aspect Ratio: 16:9 Widescreen (Native HD)");
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 3, (LPARAM)L"● 100% Offline Sovereign (Transitions & Animations Ready)");
}

void TriggerSlideTransition(HWND targetWnd, int fromIdx, int toIdx, TransitionType tType, int durationMs) {
    if (fromIdx < 0 || fromIdx >= (int)g_slides.size()) fromIdx = toIdx;
    if (toIdx < 0 || toIdx >= (int)g_slides.size()) return;

    g_fromSlideIdx = fromIdx;
    g_toSlideIdx = toIdx;
    g_activeTransition = tType;
    g_transDuration = durationMs;
    g_transStartTime = GetTickCount();
    g_isTransitioning = true;

    SetTimer(targetWnd, IDT_TRANSITION_TIMER, 16, NULL);
    InvalidateRect(targetWnd, NULL, FALSE);
}

void TriggerSlidePreview(HWND targetWnd) {
    if (g_slides.empty() || g_currentSlide < 0) return;
    int prev = (g_currentSlide > 0) ? (g_currentSlide - 1) : ((int)g_slides.size() - 1);
    TriggerSlideTransition(targetWnd, prev, g_currentSlide, g_slides[g_currentSlide].transition, g_slides[g_currentSlide].transitionSpeedMs);
}

void RenderSlideContent(HDC hdc, const RECT& slideRect, const Slide& slide, bool isFullHD, int animStep, float animProgress) {
    // Fill slide background
    HBRUSH hBg = CreateSolidBrush(slide.bgColor);
    FillRect(hdc, &slideRect, hBg);
    DeleteObject(hBg);

    // Accent top bar
    int barHeight = isFullHD ? 12 : 6;
    RECT barRect = { slideRect.left, slideRect.top, slideRect.right, slideRect.top + barHeight };
    HBRUSH hAccent = CreateSolidBrush(slide.accentColor);
    FillRect(hdc, &barRect, hAccent);
    DeleteObject(hAccent);

    SetBkMode(hdc, TRANSPARENT);

    int titleFontSize = isFullHD ? 42 : 24;
    int bodyFontSize = isFullHD ? 22 : 14;

    HFONT hFontTitle = CreateFontW(titleFontSize, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                  OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                  VARIABLE_PITCH, L"Segoe UI");
    HFONT hFontBody = CreateFontW(bodyFontSize, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                 OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                 VARIABLE_PITCH, L"Segoe UI");
    HFONT hFontWatermark = CreateFontW(isFullHD ? 16 : 11, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                      OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                      VARIABLE_PITCH, L"Segoe UI");

    int paddingX = isFullHD ? 80 : 36;
    int paddingY = isFullHD ? 50 : 26;

    // --- 1. RENDER TITLE ---
    HGDIOBJ oldFont = SelectObject(hdc, hFontTitle);
    SetTextColor(hdc, slide.textColor);

    int titleYOffset = 0;
    if (animStep == 0 && animProgress < 1.0f) {
        if (slide.animType == ANIM_FLY_IN_BOTTOM) titleYOffset = (int)((1.0f - animProgress) * (isFullHD ? 40 : 20));
        else if (slide.animType == ANIM_FLY_IN_LEFT) titleYOffset = 0;
    }

    int titleXOffset = 0;
    if (animStep == 0 && animProgress < 1.0f && slide.animType == ANIM_FLY_IN_LEFT) {
        titleXOffset = -(int)((1.0f - animProgress) * (isFullHD ? 60 : 30));
    }

    RECT titleRect = { slideRect.left + paddingX + titleXOffset, slideRect.top + paddingY + titleYOffset, slideRect.right - paddingX, slideRect.top + paddingY + titleYOffset + (isFullHD ? 80 : 45) };

    std::wstring displayTitle = slide.title;
    if (animStep == 0 && slide.animType == ANIM_TYPEWRITER && animProgress < 1.0f) {
        size_t showChars = (size_t)(animProgress * slide.title.length());
        displayTitle = slide.title.substr(0, showChars);
    }

    DrawTextW(hdc, displayTitle.c_str(), -1, &titleRect, DT_LEFT | DT_TOP | DT_WORDBREAK);

    // --- 2. RENDER BODY / BULLET POINTS ---
    SelectObject(hdc, hFontBody);
    COLORREF bodyColor = (slide.bgColor == RGB(15, 23, 42)) ? RGB(203, 213, 225) : RGB(71, 85, 105);
    SetTextColor(hdc, bodyColor);

    auto lines = SplitBulletLines(slide.body);
    int currentY = titleRect.bottom + (isFullHD ? 24 : 12);
    int lineSpacing = isFullHD ? 34 : 22;

    for (size_t i = 0; i < lines.size(); ++i) {
        int bulletStep = (int)i + 1;
        // In presentation mode, only draw lines up to animStep
        if (animStep < bulletStep) break;

        int dy = 0;
        int dx = 0;
        if (animStep == bulletStep && animProgress < 1.0f) {
            if (slide.animType == ANIM_FLY_IN_BOTTOM) dy = (int)((1.0f - animProgress) * (isFullHD ? 30 : 16));
            else if (slide.animType == ANIM_FLY_IN_LEFT) dx = -(int)((1.0f - animProgress) * (isFullHD ? 50 : 25));
        }

        std::wstring lineText = lines[i];
        if (animStep == bulletStep && slide.animType == ANIM_TYPEWRITER && animProgress < 1.0f) {
            size_t showLen = (size_t)(animProgress * lineText.length());
            lineText = lineText.substr(0, showLen);
        }

        RECT lineRect = { slideRect.left + paddingX + dx, currentY + dy, slideRect.right - paddingX, currentY + dy + lineSpacing };
        DrawTextW(hdc, lineText.c_str(), -1, &lineRect, DT_LEFT | DT_TOP | DT_SINGLELINE);

        currentY += lineSpacing;
    }

    // --- 3. WATERMARK FOOTER ---
    SelectObject(hdc, hFontWatermark);
    SetTextColor(hdc, RGB(148, 163, 184));
    RECT waterRect = { slideRect.left + paddingX, slideRect.bottom - (isFullHD ? 46 : 24), slideRect.right - paddingX, slideRect.bottom - (isFullHD ? 10 : 4) };
    DrawTextW(hdc, L"Giri Kinetic • Sovereign Workspace | Templates via www.presentationgo.com", -1, &waterRect, DT_RIGHT | DT_SINGLELINE);

    SelectObject(hdc, oldFont);
    DeleteObject(hFontTitle);
    DeleteObject(hFontBody);
    DeleteObject(hFontWatermark);
}

// Composite transition between two memory DCs
void CompositeTransition(HDC hdcTarget, HDC hdcA, HDC hdcB, int w, int h, TransitionType type, float progress) {
    if (progress <= 0.0f) {
        BitBlt(hdcTarget, 0, 0, w, h, hdcA, 0, 0, SRCCOPY);
        return;
    }
    if (progress >= 1.0f || type == TRANS_NONE) {
        BitBlt(hdcTarget, 0, 0, w, h, hdcB, 0, 0, SRCCOPY);
        return;
    }

    switch (type) {
    case TRANS_FADE: {
        BitBlt(hdcTarget, 0, 0, w, h, hdcA, 0, 0, SRCCOPY);
        BLENDFUNCTION bf = { AC_SRC_OVER, 0, (BYTE)(progress * 255.0f), 0 };
        AlphaBlend(hdcTarget, 0, 0, w, h, hdcB, 0, 0, w, h, bf);
        break;
    }
    case TRANS_PUSH_LEFT: {
        int offset = (int)(progress * (float)w);
        BitBlt(hdcTarget, -offset, 0, w, h, hdcA, 0, 0, SRCCOPY);
        BitBlt(hdcTarget, w - offset, 0, w, h, hdcB, 0, 0, SRCCOPY);
        break;
    }
    case TRANS_PUSH_RIGHT: {
        int offset = (int)(progress * (float)w);
        BitBlt(hdcTarget, offset, 0, w, h, hdcA, 0, 0, SRCCOPY);
        BitBlt(hdcTarget, -w + offset, 0, w, h, hdcB, 0, 0, SRCCOPY);
        break;
    }
    case TRANS_WIPE_DOWN: {
        int splitY = (int)(progress * (float)h);
        BitBlt(hdcTarget, 0, 0, w, splitY, hdcB, 0, 0, SRCCOPY);
        BitBlt(hdcTarget, 0, splitY, w, h - splitY, hdcA, 0, splitY, SRCCOPY);
        break;
    }
    case TRANS_WIPE_UP: {
        int splitY = (int)((1.0f - progress) * (float)h);
        BitBlt(hdcTarget, 0, 0, w, splitY, hdcA, 0, 0, SRCCOPY);
        BitBlt(hdcTarget, 0, splitY, w, h - splitY, hdcB, 0, splitY, SRCCOPY);
        break;
    }
    case TRANS_ZOOM_IN: {
        BitBlt(hdcTarget, 0, 0, w, h, hdcA, 0, 0, SRCCOPY);
        float scale = 0.6f + 0.4f * progress;
        int zoomW = (int)(w * scale);
        int zoomH = (int)(h * scale);
        int zX = (w - zoomW) / 2;
        int zY = (h - zoomH) / 2;

        HDC hdcTemp = CreateCompatibleDC(hdcTarget);
        HBITMAP hbmTemp = CreateCompatibleBitmap(hdcTarget, w, h);
        HGDIOBJ oldBm = SelectObject(hdcTemp, hbmTemp);
        BitBlt(hdcTemp, 0, 0, w, h, hdcA, 0, 0, SRCCOPY);
        StretchBlt(hdcTemp, zX, zY, zoomW, zoomH, hdcB, 0, 0, w, h, SRCCOPY);

        BLENDFUNCTION bf = { AC_SRC_OVER, 0, (BYTE)(progress * 255.0f), 0 };
        AlphaBlend(hdcTarget, 0, 0, w, h, hdcTemp, 0, 0, w, h, bf);

        SelectObject(hdcTemp, oldBm);
        DeleteObject(hbmTemp);
        DeleteDC(hdcTemp);
        break;
    }
    case TRANS_DISSOLVE: {
        BitBlt(hdcTarget, 0, 0, w, h, hdcA, 0, 0, SRCCOPY);
        int step = 16;
        int totalCols = w / step;
        int colsToShow = (int)(progress * totalCols);
        for (int c = 0; c < colsToShow; ++c) {
            int colX = (c * 7) % totalCols;
            BitBlt(hdcTarget, colX * step, 0, step, h, hdcB, colX * step, 0, SRCCOPY);
        }
        break;
    }
    default:
        BitBlt(hdcTarget, 0, 0, w, h, hdcB, 0, 0, SRCCOPY);
        break;
    }
}

// Canvas Window Procedure (Edit & Preview Mode)
LRESULT CALLBACK CanvasWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_TIMER: {
        if (wParam == IDT_TRANSITION_TIMER) {
            DWORD elapsed = GetTickCount() - g_transStartTime;
            if (elapsed >= (DWORD)g_transDuration) {
                g_isTransitioning = false;
                KillTimer(hwnd, IDT_TRANSITION_TIMER);
            }
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        } else if (wParam == IDT_ANIMATION_TIMER) {
            DWORD elapsed = GetTickCount() - g_elemAnimStartTime;
            if (elapsed >= (DWORD)g_elemAnimDuration) {
                g_isElementAnimating = false;
                KillTimer(hwnd, IDT_ANIMATION_TIMER);
            }
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        }
        break;
    }
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        int cw = client.right;
        int ch = client.bottom;

        // Double-buffer memory DC
        HDC hdcMem = CreateCompatibleDC(hdc);
        HBITMAP hbmMem = CreateCompatibleBitmap(hdc, cw, ch);
        HGDIOBJ oldMem = SelectObject(hdcMem, hbmMem);

        // Fill background with slate canvas color
        HBRUSH hBack = CreateSolidBrush(RGB(241, 245, 249));
        FillRect(hdcMem, &client, hBack);
        DeleteObject(hBack);

        if (!g_slides.empty() && g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
            int availW = cw - 40;
            int availH = ch - 40;
            int targetW = availW;
            int targetH = (targetW * 9) / 16;
            if (targetH > availH) {
                targetH = availH;
                targetW = (targetH * 16) / 9;
            }

            int left = (cw - targetW) / 2;
            int top = (ch - targetH) / 2;
            RECT slideRect = { left, top, left + targetW, top + targetH };

            // Draw subtle drop shadow
            RECT shadow = { slideRect.left + 4, slideRect.top + 4, slideRect.right + 4, slideRect.bottom + 4 };
            HBRUSH hShadow = CreateSolidBrush(RGB(203, 213, 225));
            FillRect(hdcMem, &shadow, hShadow);
            DeleteObject(hShadow);

            if (g_isTransitioning) {
                float progress = (float)(GetTickCount() - g_transStartTime) / (float)g_transDuration;
                if (progress > 1.0f) progress = 1.0f;

                HDC hdcA = CreateCompatibleDC(hdc);
                HBITMAP hbmA = CreateCompatibleBitmap(hdc, targetW, targetH);
                HGDIOBJ oldA = SelectObject(hdcA, hbmA);

                HDC hdcB = CreateCompatibleDC(hdc);
                HBITMAP hbmB = CreateCompatibleBitmap(hdc, targetW, targetH);
                HGDIOBJ oldB = SelectObject(hdcB, hbmB);

                RECT localR = { 0, 0, targetW, targetH };
                RenderSlideContent(hdcA, localR, g_slides[g_fromSlideIdx], false, 999, 1.0f);
                RenderSlideContent(hdcB, localR, g_slides[g_toSlideIdx], false, 999, 1.0f);

                HDC hdcComp = CreateCompatibleDC(hdc);
                HBITMAP hbmComp = CreateCompatibleBitmap(hdc, targetW, targetH);
                HGDIOBJ oldComp = SelectObject(hdcComp, hbmComp);

                CompositeTransition(hdcComp, hdcA, hdcB, targetW, targetH, g_activeTransition, progress);

                BitBlt(hdcMem, left, top, targetW, targetH, hdcComp, 0, 0, SRCCOPY);

                SelectObject(hdcComp, oldComp);
                DeleteObject(hbmComp);
                DeleteDC(hdcComp);

                SelectObject(hdcB, oldB);
                DeleteObject(hbmB);
                DeleteDC(hdcB);

                SelectObject(hdcA, oldA);
                DeleteObject(hbmA);
                DeleteDC(hdcA);
            } else {
                float animProgress = 1.0f;
                if (g_isElementAnimating) {
                    animProgress = (float)(GetTickCount() - g_elemAnimStartTime) / (float)g_elemAnimDuration;
                    if (animProgress > 1.0f) animProgress = 1.0f;
                }
                RenderSlideContent(hdcMem, slideRect, g_slides[g_currentSlide], false, 999, animProgress);
            }

            // Slide border
            HPEN hBorder = CreatePen(PS_SOLID, 1, RGB(148, 163, 184));
            HGDIOBJ oldPen = SelectObject(hdcMem, hBorder);
            SelectObject(hdcMem, GetStockObject(NULL_BRUSH));
            Rectangle(hdcMem, slideRect.left, slideRect.top, slideRect.right, slideRect.bottom);
            SelectObject(hdcMem, oldPen);
            DeleteObject(hBorder);
        }

        BitBlt(hdc, 0, 0, cw, ch, hdcMem, 0, 0, SRCCOPY);

        SelectObject(hdcMem, oldMem);
        DeleteObject(hbmMem);
        DeleteDC(hdcMem);

        EndPaint(hwnd, &ps);
        return 0;
    }
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

// Fullscreen Presentation Show Window Procedure (F5 Mode with Laser Pointer & Drawing)
LRESULT CALLBACK ShowWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_TIMER: {
        if (wParam == IDT_TRANSITION_TIMER) {
            DWORD elapsed = GetTickCount() - g_transStartTime;
            if (elapsed >= (DWORD)g_transDuration) {
                g_isTransitioning = false;
                KillTimer(hwnd, IDT_TRANSITION_TIMER);
            }
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        } else if (wParam == IDT_ANIMATION_TIMER) {
            DWORD elapsed = GetTickCount() - g_elemAnimStartTime;
            if (elapsed >= (DWORD)g_elemAnimDuration) {
                g_isElementAnimating = false;
                KillTimer(hwnd, IDT_ANIMATION_TIMER);
            }
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        }
        break;
    }
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        int w = client.right;
        int h = client.bottom;

        // Double-buffer fullscreen frame
        HDC hdcMem = CreateCompatibleDC(hdc);
        HBITMAP hbmMem = CreateCompatibleBitmap(hdc, w, h);
        HGDIOBJ oldMem = SelectObject(hdcMem, hbmMem);

        FillRect(hdcMem, &client, (HBRUSH)GetStockObject(BLACK_BRUSH));

        if (!g_slides.empty() && g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
            int targetW = w;
            int targetH = (targetW * 9) / 16;
            if (targetH > h) {
                targetH = h;
                targetW = (targetH * 16) / 9;
            }

            int left = (w - targetW) / 2;
            int top = (h - targetH) / 2;
            RECT slideRect = { left, top, left + targetW, top + targetH };

            if (g_isTransitioning) {
                float progress = (float)(GetTickCount() - g_transStartTime) / (float)g_transDuration;
                if (progress > 1.0f) progress = 1.0f;

                HDC hdcA = CreateCompatibleDC(hdc);
                HBITMAP hbmA = CreateCompatibleBitmap(hdc, targetW, targetH);
                HGDIOBJ oldA = SelectObject(hdcA, hbmA);

                HDC hdcB = CreateCompatibleDC(hdc);
                HBITMAP hbmB = CreateCompatibleBitmap(hdc, targetW, targetH);
                HGDIOBJ oldB = SelectObject(hdcB, hbmB);

                RECT localR = { 0, 0, targetW, targetH };
                RenderSlideContent(hdcA, localR, g_slides[g_fromSlideIdx], true, 999, 1.0f);
                RenderSlideContent(hdcB, localR, g_slides[g_toSlideIdx], true, g_currentAnimStep, 1.0f);

                HDC hdcComp = CreateCompatibleDC(hdc);
                HBITMAP hbmComp = CreateCompatibleBitmap(hdc, targetW, targetH);
                HGDIOBJ oldComp = SelectObject(hdcComp, hbmComp);

                CompositeTransition(hdcComp, hdcA, hdcB, targetW, targetH, g_activeTransition, progress);

                BitBlt(hdcMem, left, top, targetW, targetH, hdcComp, 0, 0, SRCCOPY);

                SelectObject(hdcComp, oldComp);
                DeleteObject(hbmComp);
                DeleteDC(hdcComp);

                SelectObject(hdcB, oldB);
                DeleteObject(hbmB);
                DeleteDC(hdcB);

                SelectObject(hdcA, oldA);
                DeleteObject(hbmA);
                DeleteDC(hdcA);
            } else {
                float animProgress = 1.0f;
                if (g_isElementAnimating) {
                    animProgress = (float)(GetTickCount() - g_elemAnimStartTime) / (float)g_elemAnimDuration;
                    if (animProgress > 1.0f) animProgress = 1.0f;
                }
                RenderSlideContent(hdcMem, slideRect, g_slides[g_currentSlide], true, g_currentAnimStep, animProgress);
            }

            // Render live speaker laser pen strokes
            if (!g_penStrokes.empty()) {
                HPEN hPen = CreatePen(PS_SOLID, 4, RGB(239, 68, 68)); // Bright red ink
                HGDIOBJ oldPen = SelectObject(hdcMem, hPen);
                for (const auto& stroke : g_penStrokes) {
                    if (stroke.size() < 2) continue;
                    Polyline(hdcMem, stroke.data(), (int)stroke.size());
                }
                SelectObject(hdcMem, oldPen);
                DeleteObject(hPen);
            }

            // Render Laser Pointer
            if (g_laserActive) {
                HBRUSH hRed = CreateSolidBrush(RGB(239, 68, 68));
                HPEN hNoPen = (HPEN)GetStockObject(NULL_PEN);
                HGDIOBJ oldB = SelectObject(hdcMem, hRed);
                HGDIOBJ oldP = SelectObject(hdcMem, hNoPen);
                Ellipse(hdcMem, g_laserPos.x - 7, g_laserPos.y - 7, g_laserPos.x + 7, g_laserPos.y + 7);
                SelectObject(hdcMem, oldP);
                SelectObject(hdcMem, oldB);
                DeleteObject(hRed);
            }

            // Top-Right Slide Number HUD
            wchar_t hudBuf[64];
            swprintf_s(hudBuf, L"%d / %zu", g_currentSlide + 1, g_slides.size());
            SetBkMode(hdcMem, TRANSPARENT);
            SetTextColor(hdcMem, RGB(148, 163, 184));
            RECT hudRect = { w - 120, 16, w - 20, 44 };
            DrawTextW(hdcMem, hudBuf, -1, &hudRect, DT_RIGHT | DT_SINGLELINE);
        }

        BitBlt(hdc, 0, 0, w, h, hdcMem, 0, 0, SRCCOPY);

        SelectObject(hdcMem, oldMem);
        DeleteObject(hbmMem);
        DeleteDC(hdcMem);

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_LBUTTONDOWN: {
        if (g_laserActive) {
            g_isDrawing = true;
            g_penStrokes.push_back({ { LOWORD(lParam), HIWORD(lParam) } });
            return 0;
        }
        // Advance animation step or slide
        int maxSteps = CountSlideAnimationSteps(g_slides[g_currentSlide]);
        if (g_currentAnimStep < maxSteps - 1) {
            g_currentAnimStep++;
            g_isElementAnimating = true;
            g_elemAnimStartTime = GetTickCount();
            SetTimer(hwnd, IDT_ANIMATION_TIMER, 16, NULL);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (g_currentSlide < (int)g_slides.size() - 1) {
            int from = g_currentSlide;
            g_currentSlide++;
            g_currentAnimStep = 0;
            g_penStrokes.clear();
            const Slide& nextSlide = g_slides[g_currentSlide];
            TriggerSlideTransition(hwnd, from, g_currentSlide, nextSlide.transition, nextSlide.transitionSpeedMs);
        }
        return 0;
    }
    case WM_MOUSEMOVE: {
        g_laserPos.x = LOWORD(lParam);
        g_laserPos.y = HIWORD(lParam);
        if (g_laserActive && g_isDrawing && !g_penStrokes.empty()) {
            g_penStrokes.back().push_back(g_laserPos);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (g_laserActive) {
            InvalidateRect(hwnd, NULL, FALSE);
        }
        return 0;
    }
    case WM_LBUTTONUP: {
        g_isDrawing = false;
        return 0;
    }
    case WM_RBUTTONUP: {
        g_laserActive = !g_laserActive;
        InvalidateRect(hwnd, NULL, FALSE);
        return 0;
    }
    case WM_KEYDOWN: {
        switch (wParam) {
        case VK_ESCAPE:
            DestroyWindow(hwnd);
            g_hShowWnd = NULL;
            g_inSlideShow = false;
            return 0;
        case 'L':
            g_laserActive = !g_laserActive;
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        case 'P':
            TriggerSlideTransition(hwnd, g_currentSlide, g_currentSlide, g_slides[g_currentSlide].transition, g_slides[g_currentSlide].transitionSpeedMs);
            return 0;
        case VK_RIGHT:
        case VK_DOWN:
        case VK_SPACE: {
            int maxSteps = CountSlideAnimationSteps(g_slides[g_currentSlide]);
            if (g_currentAnimStep < maxSteps - 1) {
                g_currentAnimStep++;
                g_isElementAnimating = true;
                g_elemAnimStartTime = GetTickCount();
                SetTimer(hwnd, IDT_ANIMATION_TIMER, 16, NULL);
                InvalidateRect(hwnd, NULL, FALSE);
            } else if (g_currentSlide < (int)g_slides.size() - 1) {
                int from = g_currentSlide;
                g_currentSlide++;
                g_currentAnimStep = 0;
                g_penStrokes.clear();
                const Slide& nextSlide = g_slides[g_currentSlide];
                TriggerSlideTransition(hwnd, from, g_currentSlide, nextSlide.transition, nextSlide.transitionSpeedMs);
            }
            return 0;
        }
        case VK_LEFT:
        case VK_UP:
        case VK_BACK: {
            if (g_currentAnimStep > 0) {
                g_currentAnimStep--;
                InvalidateRect(hwnd, NULL, FALSE);
            } else if (g_currentSlide > 0) {
                int from = g_currentSlide;
                g_currentSlide--;
                g_currentAnimStep = CountSlideAnimationSteps(g_slides[g_currentSlide]) - 1;
                g_penStrokes.clear();
                const Slide& prevSlide = g_slides[g_currentSlide];
                TriggerSlideTransition(hwnd, from, g_currentSlide, prevSlide.transition, prevSlide.transitionSpeedMs);
            }
            return 0;
        }
        }
        break;
    }
    case WM_DESTROY:
        g_hShowWnd = NULL;
        g_inSlideShow = false;
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

void StartSlideShow(HWND hwnd, int startIdx) {
    if (g_slides.empty()) return;
    g_currentSlide = startIdx;
    g_currentAnimStep = 0;
    g_inSlideShow = true;
    g_laserActive = false;
    g_penStrokes.clear();

    int screenW = GetSystemMetrics(SM_CXSCREEN);
    int screenH = GetSystemMetrics(SM_CYSCREEN);

    g_hShowWnd = CreateWindowExW(
        WS_EX_TOPMOST, L"GiriKineticSlideShowClass", L"Giri Kinetic Slide Show",
        WS_POPUP | WS_VISIBLE,
        0, 0, screenW, screenH,
        hwnd, NULL, g_hInst, NULL
    );

    SetFocus(g_hShowWnd);
    TriggerSlideTransition(g_hShowWnd, g_currentSlide, g_currentSlide, g_slides[g_currentSlide].transition, g_slides[g_currentSlide].transitionSpeedMs);
}

void ShowTemplateLibrary(HWND hwnd) {
    int res = MessageBoxW(
        hwnd,
        L"GIRI KINETIC GLOBAL TEMPLATES CATALOG\n\n"
        L"Available Sovereign Master Themes:\n"
        L" [1] Executive Midnight (Deep Navy Slate & Sky Cyan)\n"
        L" [2] Silicon Minimalist (Clean Alabaster & Royal Blue)\n"
        L" [3] High-Velocity Matrix (Emerald Green Financial)\n"
        L" [4] PresentationGo Global Engine (www.presentationgo.com)\n\n"
        L"Would you like to apply the Executive Midnight Theme?",
        L"Giri Kinetic Templates Gallery",
        MB_YESNOCANCEL | MB_ICONINFORMATION
    );

    if (res == IDYES) {
        for (auto& s : g_slides) {
            s.bgColor = RGB(15, 23, 42);
            s.textColor = RGB(248, 250, 252);
            s.accentColor = RGB(56, 189, 248);
        }
        InvalidateRect(g_hCanvasWnd, NULL, TRUE);
    }
}

void DoFileOpen(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Sovereign Presentation (*.giri;*.gkinetic)\0*.giri;*.gkinetic\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::string content, toolType;
        if (LoadUniversalGiriFile(szFile, content, toolType)) {
            std::istringstream ss(content);
            std::string line;
            g_slides.clear();
            Slide current;
            current.bgColor = RGB(255, 255, 255);
            current.textColor = RGB(15, 23, 42);
            current.accentColor = RGB(37, 99, 235);
            current.layout = LAYOUT_TITLE_CONTENT;
            current.transition = TRANS_FADE;
            current.transitionSpeedMs = 450;
            current.animType = ANIM_FLY_IN_BOTTOM;
            current.stepByStep = true;

            while (std::getline(ss, line)) {
                if (line.rfind("---SLIDE---", 0) == 0) {
                    if (!current.title.empty()) g_slides.push_back(current);
                    current.title.clear();
                    current.body.clear();
                } else if (line.rfind("TRANS:", 0) == 0) {
                    int t = 1, spd = 450, an = 2, stp = 1;
                    sscanf_s(line.c_str(), "TRANS:%d:%d:%d:%d", &t, &spd, &an, &stp);
                    current.transition = (TransitionType)t;
                    current.transitionSpeedMs = spd;
                    current.animType = (AnimationType)an;
                    current.stepByStep = (stp != 0);
                } else if (current.title.empty()) {
                    current.title = std::wstring(line.begin(), line.end());
                } else {
                    current.body += std::wstring(line.begin(), line.end()) + L"\n";
                }
            }
            if (!current.title.empty()) g_slides.push_back(current);

            g_currentFilePath = szFile;
            SetWindowTextW(hwnd, (PathFindFileNameW(szFile) + std::wstring(L" — Giri Kinetic")).c_str());

            SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
            for (size_t i = 0; i < g_slides.size(); ++i) {
                std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
                SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
            }
            SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);
            g_currentSlide = 0;
            SetWindowTextW(g_hEditTitle, g_slides[0].title.c_str());
            SetWindowTextW(g_hEditBody, g_slides[0].body.c_str());
            SendMessageW(g_hComboTrans, CB_SETCURSEL, (WPARAM)g_slides[0].transition, 0);
            SendMessageW(g_hComboAnim, CB_SETCURSEL, (WPARAM)g_slides[0].animType, 0);
            InvalidateRect(g_hCanvasWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        }
    }
}

void DoFileSave(HWND hwnd, bool saveAs) {
    if (g_currentFilePath.empty() || saveAs) {
        wchar_t szFile[MAX_PATH] = L"Presentation.gkinetic";
        OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
        ofn.hwndOwner = hwnd;
        ofn.lpstrFilter = L"Giri Kinetic Presentation (*.gkinetic)\0*.gkinetic\0Universal Sovereign Office (*.giri)\0*.giri\0";
        ofn.lpstrFile = szFile;
        ofn.nMaxFile = MAX_PATH;
        ofn.Flags = OFN_OVERWRITEPROMPT;
        ofn.lpstrDefExt = L"gkinetic";

        if (!GetSaveFileNameW(&ofn)) return;
        g_currentFilePath = szFile;
    }

    std::ostringstream ss;
    for (size_t i = 0; i < g_slides.size(); ++i) {
        ss << "---SLIDE---\n";
        ss << "TRANS:" << (int)g_slides[i].transition << ":" << g_slides[i].transitionSpeedMs << ":"
           << (int)g_slides[i].animType << ":" << (g_slides[i].stepByStep ? 1 : 0) << "\n";
        std::string titleStr(g_slides[i].title.begin(), g_slides[i].title.end());
        std::string bodyStr(g_slides[i].body.begin(), g_slides[i].body.end());
        ss << titleStr << "\n";
        ss << bodyStr << "\n";
    }

    SaveUniversalGiriFile(g_currentFilePath, L"kinetic", PathFindFileNameW(g_currentFilePath.c_str()), ss.str());
    SetWindowTextW(hwnd, (PathFindFileNameW(g_currentFilePath.c_str()) + std::wstring(L" — Giri Kinetic")).c_str());
    MessageBoxW(hwnd, L"Presentation with transitions & animations saved successfully!", L"Giri Kinetic", MB_OK | MB_ICONINFORMATION);
}

// Main Window Procedure
LRESULT CALLBACK MainWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);

        SetWindowPos(g_hSlideListWnd, NULL, 8, 8, 210, h - 8 - 42, SWP_NOZORDER);
        SetWindowPos(g_hCanvasWnd, NULL, 226, 40, w - 236, h - 210, SWP_NOZORDER);
        SetWindowPos(g_hEditTitle, NULL, 310, h - 162, w - 320, 26, SWP_NOZORDER);
        SetWindowPos(g_hEditBody, NULL, 310, h - 130, w - 320, 94, SWP_NOZORDER);
        SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
        return 0;
    }
    case WM_COMMAND: {
        WORD id = LOWORD(wParam);
        WORD code = HIWORD(wParam);

        if (id == IDC_SLIDE_LIST && code == LBN_SELCHANGE) {
            int sel = (int)SendMessageW(g_hSlideListWnd, LB_GETCURSEL, 0, 0);
            if (sel >= 0 && sel < (int)g_slides.size()) {
                int oldSlide = g_currentSlide;
                g_currentSlide = sel;
                SetWindowTextW(g_hEditTitle, g_slides[sel].title.c_str());
                SetWindowTextW(g_hEditBody, g_slides[sel].body.c_str());
                SendMessageW(g_hComboTrans, CB_SETCURSEL, (WPARAM)g_slides[sel].transition, 0);
                SendMessageW(g_hComboAnim, CB_SETCURSEL, (WPARAM)g_slides[sel].animType, 0);
                UpdateStatusBar(hwnd);
                TriggerSlideTransition(g_hCanvasWnd, oldSlide, g_currentSlide, g_slides[g_currentSlide].transition, g_slides[g_currentSlide].transitionSpeedMs);
            }
            return 0;
        }

        if (id == IDC_COMBO_TRANS && code == CBN_SELCHANGE) {
            int sel = (int)SendMessageW(g_hComboTrans, CB_GETCURSEL, 0, 0);
            if (sel >= 0 && g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].transition = (TransitionType)sel;
                UpdateStatusBar(hwnd);
                TriggerSlidePreview(g_hCanvasWnd);
            }
            return 0;
        }

        if (id == IDC_COMBO_ANIM && code == CBN_SELCHANGE) {
            int sel = (int)SendMessageW(g_hComboAnim, CB_GETCURSEL, 0, 0);
            if (sel >= 0 && g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].animType = (AnimationType)sel;
                UpdateStatusBar(hwnd);
                g_isElementAnimating = true;
                g_elemAnimStartTime = GetTickCount();
                SetTimer(g_hCanvasWnd, IDT_ANIMATION_TIMER, 16, NULL);
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            }
            return 0;
        }

        if (id == IDC_BTN_PREVIEW_TRANS || id == IDM_TRANS_PREVIEW) {
            TriggerSlidePreview(g_hCanvasWnd);
            return 0;
        }

        if (id == IDC_BTN_APPLY_ALL || id == IDM_TRANS_APPLY_ALL) {
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                TransitionType t = g_slides[g_currentSlide].transition;
                int spd = g_slides[g_currentSlide].transitionSpeedMs;
                for (auto& s : g_slides) {
                    s.transition = t;
                    s.transitionSpeedMs = spd;
                }
                MessageBoxW(hwnd, L"Applied current slide transition to all slides in deck!", L"Giri Kinetic", MB_OK | MB_ICONINFORMATION);
                UpdateStatusBar(hwnd);
            }
            return 0;
        }

        if (id == IDC_BTN_PRESENT || id == IDM_SHOW_FROM_START) {
            StartSlideShow(hwnd, 0);
            return 0;
        }

        if (id >= IDM_TRANS_NONE && id <= IDM_TRANS_DISSOLVE) {
            TransitionType t = (TransitionType)(id - IDM_TRANS_NONE);
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].transition = t;
                SendMessageW(g_hComboTrans, CB_SETCURSEL, (WPARAM)t, 0);
                UpdateStatusBar(hwnd);
                TriggerSlidePreview(g_hCanvasWnd);
            }
            return 0;
        }

        if (id == IDM_TRANS_SPEED_FAST) {
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].transitionSpeedMs = 200;
                UpdateStatusBar(hwnd);
            }
            return 0;
        }
        if (id == IDM_TRANS_SPEED_NORMAL) {
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].transitionSpeedMs = 450;
                UpdateStatusBar(hwnd);
            }
            return 0;
        }
        if (id == IDM_TRANS_SPEED_SLOW) {
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].transitionSpeedMs = 800;
                UpdateStatusBar(hwnd);
            }
            return 0;
        }

        if (id >= IDM_ANIM_NONE && id <= IDM_ANIM_TYPEWRITER) {
            AnimationType an = (AnimationType)(id - IDM_ANIM_NONE);
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].animType = an;
                SendMessageW(g_hComboAnim, CB_SETCURSEL, (WPARAM)an, 0);
                UpdateStatusBar(hwnd);
                g_isElementAnimating = true;
                g_elemAnimStartTime = GetTickCount();
                SetTimer(g_hCanvasWnd, IDT_ANIMATION_TIMER, 16, NULL);
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            }
            return 0;
        }

        if (id == IDM_ANIM_STEP_BY_STEP) {
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].stepByStep = !g_slides[g_currentSlide].stepByStep;
                MessageBoxW(hwnd, g_slides[g_currentSlide].stepByStep ? L"Step-by-Step bullet reveal is now ENABLED." : L"Step-by-Step bullet reveal is now DISABLED (shows all at once).", L"Giri Kinetic Animations", MB_OK | MB_ICONINFORMATION);
            }
            return 0;
        }

        if (id == IDM_ANIM_PREVIEW) {
            g_isElementAnimating = true;
            g_elemAnimStartTime = GetTickCount();
            SetTimer(g_hCanvasWnd, IDT_ANIMATION_TIMER, 16, NULL);
            InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            return 0;
        }

        if (id == IDC_EDIT_TITLE && code == EN_CHANGE) {
            int len = GetWindowTextLengthW(g_hEditTitle);
            std::wstring buf(len + 1, L'\0');
            GetWindowTextW(g_hEditTitle, &buf[0], len + 1);
            buf.resize(len);
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].title = buf;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            }
            return 0;
        }

        if (id == IDC_EDIT_BODY && code == EN_CHANGE) {
            int len = GetWindowTextLengthW(g_hEditBody);
            std::wstring buf(len + 1, L'\0');
            GetWindowTextW(g_hEditBody, &buf[0], len + 1);
            buf.resize(len);
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].body = buf;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            }
            return 0;
        }

        if (id == IDM_FILE_NEW) {
            g_slides.clear();
            Slide s;
            s.title = L"Untitled Slide";
            s.body = L"• Click to edit strategic point\n• Add milestones and goals\n• Deliver with cinematic transitions";
            s.bgColor = RGB(255, 255, 255);
            s.textColor = RGB(15, 23, 42);
            s.accentColor = RGB(37, 99, 235);
            s.layout = LAYOUT_TITLE_CONTENT;
            s.transition = TRANS_FADE;
            s.transitionSpeedMs = 450;
            s.animType = ANIM_FLY_IN_BOTTOM;
            s.stepByStep = true;
            g_slides.push_back(s);

            SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
            SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)L"Slide 1: Untitled Slide");
            SendMessageW(g_hSlideListWnd, LB_SETCURSEL, 0, 0);
            g_currentSlide = 0;
            g_currentFilePath = L"";
            SetWindowTextW(hwnd, L"Presentation 1 — Giri Kinetic (Cinematic Widescreen Studio & Animations)");
            SetWindowTextW(g_hEditTitle, s.title.c_str());
            SetWindowTextW(g_hEditBody, s.body.c_str());
            SendMessageW(g_hComboTrans, CB_SETCURSEL, (WPARAM)s.transition, 0);
            SendMessageW(g_hComboAnim, CB_SETCURSEL, (WPARAM)s.animType, 0);
            InvalidateRect(g_hCanvasWnd, NULL, TRUE);
            UpdateStatusBar(hwnd);
        } else if (id == IDM_FILE_OPEN) {
            DoFileOpen(hwnd);
        } else if (id == IDM_FILE_SAVE) {
            DoFileSave(hwnd, false);
        } else if (id == IDM_FILE_SAVEAS) {
            DoFileSave(hwnd, true);
        } else if (id == IDM_SLIDE_NEW_TITLE || id == IDM_SLIDE_NEW_CONTENT) {
            Slide s;
            s.title = L"New Slide " + std::to_wstring(g_slides.size() + 1);
            s.body = L"• Key strategic initiative\n• Measurable milestones\n• Sovereign implementation";
            s.bgColor = RGB(255, 255, 255);
            s.textColor = RGB(15, 23, 42);
            s.accentColor = RGB(37, 99, 235);
            s.layout = LAYOUT_TITLE_CONTENT;
            s.transition = TRANS_PUSH_LEFT;
            s.transitionSpeedMs = 450;
            s.animType = ANIM_FLY_IN_BOTTOM;
            s.stepByStep = true;
            g_slides.push_back(s);

            std::wstring item = L"Slide " + std::to_wstring(g_slides.size()) + L": " + s.title;
            SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
            SendMessageW(g_hSlideListWnd, LB_SETCURSEL, (WPARAM)(g_slides.size() - 1), 0);
            int oldIdx = g_currentSlide;
            g_currentSlide = (int)g_slides.size() - 1;
            SetWindowTextW(g_hEditTitle, s.title.c_str());
            SetWindowTextW(g_hEditBody, s.body.c_str());
            SendMessageW(g_hComboTrans, CB_SETCURSEL, (WPARAM)s.transition, 0);
            SendMessageW(g_hComboAnim, CB_SETCURSEL, (WPARAM)s.animType, 0);
            UpdateStatusBar(hwnd);
            TriggerSlideTransition(g_hCanvasWnd, oldIdx, g_currentSlide, s.transition, s.transitionSpeedMs);
        } else if (id == IDM_SLIDE_DUPLICATE) {
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                Slide s = g_slides[g_currentSlide];
                s.title += L" (Copy)";
                g_slides.insert(g_slides.begin() + g_currentSlide + 1, s);
                SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
                for (size_t i = 0; i < g_slides.size(); ++i) {
                    std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
                    SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
                }
                g_currentSlide++;
                SendMessageW(g_hSlideListWnd, LB_SETCURSEL, (WPARAM)g_currentSlide, 0);
                InvalidateRect(g_hCanvasWnd, NULL, TRUE);
                UpdateStatusBar(hwnd);
            }
        } else if (id == IDM_SLIDE_DELETE) {
            if (g_slides.size() > 1 && g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                g_slides.erase(g_slides.begin() + g_currentSlide);
                if (g_currentSlide >= (int)g_slides.size()) g_currentSlide = (int)g_slides.size() - 1;
                SendMessageW(g_hSlideListWnd, LB_RESETCONTENT, 0, 0);
                for (size_t i = 0; i < g_slides.size(); ++i) {
                    std::wstring item = L"Slide " + std::to_wstring(i + 1) + L": " + g_slides[i].title;
                    SendMessageW(g_hSlideListWnd, LB_ADDSTRING, 0, (LPARAM)item.c_str());
                }
                SendMessageW(g_hSlideListWnd, LB_SETCURSEL, (WPARAM)g_currentSlide, 0);
                SetWindowTextW(g_hEditTitle, g_slides[g_currentSlide].title.c_str());
                SetWindowTextW(g_hEditBody, g_slides[g_currentSlide].body.c_str());
                InvalidateRect(g_hCanvasWnd, NULL, TRUE);
                UpdateStatusBar(hwnd);
            }
        } else if (id == IDM_SHOW_FROM_CURRENT) {
            StartSlideShow(hwnd, g_currentSlide);
        } else if (id == IDM_TEMPLATES_GALLERY) {
            ShowTemplateLibrary(hwnd);
        } else if (id == IDM_WATERMARK_LINK) {
            ShellExecuteW(hwnd, L"open", L"https://www.presentationgo.com", NULL, NULL, SW_SHOWNORMAL);
        } else if (id == IDM_HELP_ABOUT) {
            ShowAboutDialog(hwnd, L"Giri Kinetic (Cinematic Widescreen Studio & Animations)");
        } else if (id == IDM_FILE_EXIT) {
            PostQuitMessage(0);
        }
        return 0;
    }
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}
