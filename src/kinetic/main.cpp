/* ============================================================================
 * GIRI KINETIC — CINEMATIC WIDESCREEN PRESENTATION STUDIO (PowerPoint Architecture)
 * Made by Abhinav Giri (@abhinavgiri45 | abhinavgiri370@gmail.com)
 * 100% Offline Standalone Native C++ Win32 / GDI+ Desktop Application
 * Office-Grade Ribbon Tabs, Interactive Left Slide Thumbnail Deck,
 * Double-Buffered 16:9 Widescreen Canvas & Fullscreen Presentation Mode (F5)
 * ============================================================================
 */

#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include "../common/sovereign_launcher.h"
#include <windowsx.h>
#include <commctrl.h>
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <gdiplus.h>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include "../common/settings_dlg.h"
#include <cmath>

#include "../common/sovereign_types.h"
#include "../common/universal_file.h"
#include "../common/tool_start_ui.h"

using namespace Gdiplus;

#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "comdlg32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "msimg32.lib")
#pragma comment(lib, "gdiplus.lib")

// --- Office Command IDs ---
#define ID_FILE_NEW                 1001
#define ID_FILE_OPEN                1002
#define ID_FILE_SAVE                1003
#define ID_FILE_SAVEAS              1004
#define ID_FILE_EXIT                1005
#define ID_EDIT_UNDO                1010
#define ID_EDIT_REDO                1011
#define ID_EDIT_CUT                 1012
#define ID_EDIT_COPY                1013
#define ID_EDIT_PASTE               1014
#define ID_EDIT_SELECTALL           1015
#define ID_SLIDE_NEW                1020
#define ID_SLIDE_DUPLICATE          1021
#define ID_SLIDE_DELETE             1022
#define ID_SLIDE_MOVE_UP            1023
#define ID_SLIDE_MOVE_DOWN          1024
#define ID_SHOW_START               1030
#define ID_SHOW_CURRENT             1031
#define ID_HELP_ABOUT               1040
#undef ID_STATUSBAR
#define ID_STATUSBAR                2002

// Ribbon Button IDs
#define IDC_RIBBON_BASE             2000
#define IDC_BTN_NEW_SLIDE           2001
#define IDC_BTN_DUPLICATE_SLIDE     2002
#define IDC_BTN_DELETE_SLIDE        2003
#define IDC_BTN_LAYOUT_TITLE        2004
#define IDC_BTN_LAYOUT_CONTENT      2005
#define IDC_BTN_LAYOUT_TWOCOL       2006
#define IDC_BTN_LAYOUT_METRICS      2007
#define IDC_BTN_LAYOUT_BLANK        2008
#define IDC_BTN_PASTE               2010
#define IDC_BTN_CUT                 2011
#define IDC_BTN_COPY                2012
#define IDC_COMBO_FONT              2020
#define IDC_COMBO_SIZE              2021
#define IDC_BTN_BOLD                2022
#define IDC_BTN_ITALIC              2023
#define IDC_BTN_UNDERLINE           2024
#define IDC_BTN_TEXT_COLOR          2025
#define IDC_BTN_BG_COLOR            2026
#define IDC_BTN_ALIGN_LEFT          2030
#define IDC_BTN_ALIGN_CENTER        2031
#define IDC_BTN_ALIGN_RIGHT         2032
#define IDC_BTN_BULLET              2033
#define IDC_BTN_NUMBERED            2034
#define IDC_BTN_SHAPE_RECT          2040
#define IDC_BTN_SHAPE_CIRCLE        2041
#define IDC_BTN_SHAPE_LINE          2042
#define IDC_BTN_TEXT_BOX            2043

#define IDC_BTN_INSERT_IMAGE        2050
#define IDC_BTN_INSERT_TABLE        2051
#define IDC_BTN_INSERT_DEVANAGARI   2052

#define IDC_BTN_THEME_CLEAN         2060
#define IDC_BTN_THEME_DARK          2061
#define IDC_BTN_THEME_EMERALD       2062
#define IDC_BTN_THEME_SUNSET        2063
#define IDC_BTN_RATIO_16_9          2065
#define IDC_BTN_RATIO_4_3           2066

#define IDC_COMBO_TRANSITION        2070
#define IDC_BTN_TRANS_APPLY_ALL     2071
#define IDC_BTN_TRANS_PREVIEW       2072

#define IDC_COMBO_ANIMATION         2080
#define IDC_BTN_ANIM_PREVIEW        2081

#define IDC_BTN_PRESENT_F5          2090
#define IDC_BTN_PRESENT_CURRENT     2091

#define IDC_BTN_ZOOM_FIT            2100
#define IDC_BTN_ZOOM_100            2101

// Controls
#define IDC_EDIT_INLINE_TITLE       3001
#define IDC_EDIT_INLINE_BODY        3002
#define IDT_TRANSITION_TIMER        4001

// Enums
enum RibbonTab {
    TAB_HOME = 0,
    TAB_INSERT,
    TAB_DESIGN,
    TAB_TRANSITIONS,
    TAB_ANIMATIONS,
    TAB_SLIDESHOW,
    TAB_VIEW,
    TAB_COUNT
};

enum SlideLayout {
    LAYOUT_TITLE_HERO = 0,
    LAYOUT_TITLE_CONTENT,
    LAYOUT_TWO_COLUMN,
    LAYOUT_METRICS_DASHBOARD,
    LAYOUT_BLANK
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
    std::wstring rightColText;
    SlideLayout layout;
    COLORREF bgColor;
    COLORREF textColor;
    COLORREF accentColor;
    TransitionType transition;
    int transitionSpeedMs;
    AnimationType animType;
    std::vector<std::wstring> bulletItems;
};

// Global Application State
HINSTANCE g_hInst = NULL;
ULONG_PTR g_gdiToken = 0;
HWND g_hMainWnd = NULL;
HWND g_hRibbonWnd = NULL;
HWND g_hThumbRailWnd = NULL;
HWND g_hCanvasWnd = NULL;
HWND g_hStatusBar = NULL;
HWND g_hShowWnd = NULL;
HWND g_hEditTitle = NULL;
HWND g_hEditBody = NULL;

HWND g_hComboFont = NULL;
HWND g_hComboSize = NULL;
HWND g_hComboTrans = NULL;
HWND g_hComboAnim = NULL;

std::vector<HWND> g_ribbonTabControls[TAB_COUNT];
int g_activeRibbonTab = TAB_HOME;
int g_hoverRibbonTab = -1;

std::vector<Slide> g_slides;
int g_currentSlide = 0;
int g_hoverThumb = -1;
int g_thumbScrollY = 0;
std::wstring g_currentFilePath = L"";

// Slide Show State
bool g_inSlideShow = false;
int g_showSlideIdx = 0;
bool g_laserPointer = false;
POINT g_laserPos = { 0, 0 };
std::vector<std::vector<POINT>> g_inkStrokes;
bool g_isDrawing = false;
bool g_blankScreen = false;
COLORREF g_blankColor = RGB(0, 0, 0);

// Transition animation
bool g_isTransitioning = false;
int g_transFromSlide = 0;
int g_transToSlide = 0;
DWORD g_transStartTime = 0;
int g_transDuration = 400;

// Colors
const COLORREF PPT_ORANGE = RGB(216, 59, 1);       // #d83b01 PowerPoint orange
const COLORREF PPT_ORANGE_HOVER = RGB(234, 88, 12);
const COLORREF STUDIO_BG = RGB(38, 38, 38);        // #262626 dark studio backdrop
const COLORREF RAIL_BG = RGB(248, 250, 252);       // #f8fafc light thumb rail
const COLORREF CARD_BORDER = RGB(203, 213, 225);   // #cbd5e1

// Forward Declarations
LRESULT CALLBACK MainWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK RibbonWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK ThumbRailWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK CanvasWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK ShowWndProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK RibbonBtnSubclass(HWND, UINT, WPARAM, LPARAM);

void CreateMainMenu(HWND);
void CreateRibbonBar(HWND);
void SwitchRibbonTab(int newTab);
void UpdateStatusBar();
void SyncControlsWithSlide();
void CommitInlineEdits();
void LaunchSlideShow(int startIdx);
void ExitSlideShow();
void DoFileOpen(HWND);
void DoFileSave(HWND, bool);
void RecordRecentDoc(const std::wstring& fullPath);
void StyleRibbonButton(HWND btn, bool isPrimary = false);

void InitDefaultSlides() {
    g_slides.clear();

    // Slide 1: Executive Title Slide
    Slide s1;
    s1.title = L"Giri Orbit Sovereign Suite";
    s1.subtitle = L"Next-Generation Autonomous Office Intelligence & Creative Studio";
    s1.body = L"Built with Sovereign C++ Desktop Architecture\nEngineered by Abhinav Giri (@abhinavgiri45)";
    s1.layout = LAYOUT_TITLE_HERO;
    s1.bgColor = RGB(255, 255, 255);
    s1.textColor = RGB(15, 23, 42);
    s1.accentColor = PPT_ORANGE;
    s1.transition = TRANS_FADE;
    s1.transitionSpeedMs = 400;
    s1.animType = ANIM_FADE_IN;
    g_slides.push_back(s1);

    // Slide 2: Enterprise Architecture Overview
    Slide s2;
    s2.title = L"High-Velocity Native Performance";
    s2.subtitle = L"100% Offline Standalone Execution Zero Cloud Telemetry";
    s2.body = L"Hardware-Accelerated 60+ FPS Rendering Pipeline\nSub-15MB RAM Footprint with Zero Keystroke Latency\nUniversal Sovereign Document (.giri / .gkinetic) Compatibility\nBuilt-in Fullscreen Presentation Engine with Live Laser & Digital Pen";
    s2.layout = LAYOUT_TITLE_CONTENT;
    s2.bgColor = RGB(255, 255, 255);
    s2.textColor = RGB(15, 23, 42);
    s2.accentColor = PPT_ORANGE;
    s2.transition = TRANS_PUSH_LEFT;
    s2.transitionSpeedMs = 400;
    s2.animType = ANIM_FLY_IN_BOTTOM;
    g_slides.push_back(s2);

    // Slide 3: Two-Column Strategy Matrix
    Slide s3;
    s3.title = L"Giri Suite Operational Vectors";
    s3.subtitle = L"Unified Productivity Across Text, Numbers & Cinematic Keynotes";
    s3.body = L"Core Applications:\nGiri Drift — Word Processor\nGiri Axis — Financial Matrix\nGiri Kinetic — Presentation Studio\nGiri Orbit Hub — Suite Orchestrator";
    s3.rightColText = L"Enterprise Capabilities:\nTrue Multi-tier Office Ribbon\nHigh-Res Widescreen 16:9 Canvas\nLive Formula Math Engine\nGoogle Devanagari Hindi Ready";
    s3.layout = LAYOUT_TWO_COLUMN;
    s3.bgColor = RGB(255, 255, 255);
    s3.textColor = RGB(15, 23, 42);
    s3.accentColor = RGB(37, 99, 235);
    s3.transition = TRANS_ZOOM_IN;
    s3.transitionSpeedMs = 400;
    s3.animType = ANIM_FADE_IN;
    g_slides.push_back(s3);

    // Slide 4: Key Strategic Metrics
    Slide s4;
    s4.title = L"Performance Benchmarks & Metrics";
    s4.subtitle = L"Measured on Windows 11 Enterprise Architecture";
    s4.body = L"Startup Speed: < 80ms\nRAM Consumption: 12.4 MB\nFrame Rate: Steady 60+ FPS\nOffline Integrity: 100% Sovereign";
    s4.layout = LAYOUT_METRICS_DASHBOARD;
    s4.bgColor = RGB(255, 255, 255);
    s4.textColor = RGB(15, 23, 42);
    s4.accentColor = RGB(16, 185, 129);
    s4.transition = TRANS_FADE;
    s4.transitionSpeedMs = 400;
    s4.animType = ANIM_TYPEWRITER;
    g_slides.push_back(s4);

    g_currentSlide = 0;
}


// Kinetic View State Machine
enum KineticViewState {
    KINETIC_VIEW_START = 0,
    KINETIC_VIEW_SLIDES = 1
};
KineticViewState g_kineticState = KINETIC_VIEW_START;
GiriOrbit::ToolThemeConfig g_kineticConfig;
GiriOrbit::StartUIState g_kineticStartState;

void ReturnToKineticStart(HWND hwnd);
void EnterKineticSlides(HWND hwnd);
void EnterKineticSlidesBlank(HWND hwnd);
void LoadKineticTemplate(HWND hwnd, int idx);

void InitKineticConfig() {
    g_kineticConfig.toolLetter = L"K";
    g_kineticConfig.toolName = L"Kinetic";
    g_kineticConfig.fullToolName = L"Giri Kinetic";
    g_kineticConfig.headline = L"Welcome to Kinetic for free on the web";
    g_kineticConfig.subtitle = L"Sovereign in-memory presentation show & widescreen stage. Zero database tracking, 16:9 vector layouts, and customizable presentations.";
    g_kineticConfig.createBtnText = L"Create blank presentation";
    g_kineticConfig.uploadBtnText = L"Upload presentation";
    g_kineticConfig.draftTitle = L"Golden Light Prestige";
    g_kineticConfig.draftMeta = L"Saved recently · 6 Slides · 16:9 Widescreen · 4.3 KB";
    g_kineticConfig.toolHash = L"kinetic";
    g_kineticConfig.galleryTitle = L"PresentationGO & Global Presentation Library";
    g_kineticConfig.galleryBadge = L"● 3,500+ Free Templates & Diagrams";
    g_kineticConfig.accentColor = Gdiplus::Color(249, 115, 22); // Orange-500
    g_kineticConfig.accentDark = Gdiplus::Color(194, 65, 12);   // Orange-700
    g_kineticConfig.accentHover = Gdiplus::Color(234, 88, 12);  // Orange-600
    g_kineticConfig.illustrationType = 2; // 3D Presentation Monitor

    g_kineticConfig.categories = {
        L"All (3,500+)", L"Executive Presentation Decks", L"Processes & Steps", L"Timelines & Roadmaps", L"Matrix & SWOT", L"Pyramids & Hierarchy", L"Funnels & Pipelines"
    };

    g_kineticConfig.templates = {
        {
            L"Golden Light Prestige Keynote",
            L"Executive Presentation Decks",
            L"Cinematic high-contrast executive presentation with golden amber vector highlights and widescreen layout.",
            L"GOLDEN"
        },
        {
            L"Executive Investor Pitch Deck",
            L"Executive Presentation Decks",
            L"Series A/B venture fundraising deck with problem, solution, market size, business model, and milestones.",
            L"INVESTOR"
        },
        {
            L"Quarterly Strategic Review",
            L"Executive Presentation Decks",
            L"Quarterly business review (QBR) featuring executive metrics, growth trajectories, and team accountability.",
            L"QBR"
        },
        {
            L"Product Roadmap & Architecture",
            L"Timelines & Roadmaps",
            L"Engineering systems architecture, quarterly technical deliverables, and infrastructure modernization.",
            L"ROADMAP"
        },
        {
            L"Corporate Market Analysis",
            L"Matrix & SWOT",
            L"Competitive intelligence, market landscape matrices, industry analysis, and market penetration vectors.",
            L"MARKET"
        },
        {
            L"Consulting Strategy Presentation",
            L"Processes & Steps",
            L"Management consulting presentation framework with structured discovery, analysis, and phased implementation.",
            L"CONSULTING"
        }
    };
}

void ReturnToKineticStart(HWND hwnd) {
    g_kineticState = KINETIC_VIEW_START;
    ShowWindow(g_hRibbonWnd, SW_HIDE);
    ShowWindow(g_hThumbRailWnd, SW_HIDE);
    ShowWindow(g_hCanvasWnd, SW_HIDE);
    ShowWindow(g_hEditTitle, SW_HIDE);
    ShowWindow(g_hEditBody, SW_HIDE);
    ShowWindow(g_hStatusBar, SW_HIDE);
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterKineticSlides(HWND hwnd) {
    g_kineticState = KINETIC_VIEW_SLIDES;
    ShowWindow(g_hRibbonWnd, SW_SHOW);
    ShowWindow(g_hThumbRailWnd, SW_SHOW);
    ShowWindow(g_hCanvasWnd, SW_SHOW);
    ShowWindow(g_hEditTitle, SW_SHOW);
    ShowWindow(g_hEditBody, SW_SHOW);
    ShowWindow(g_hStatusBar, SW_SHOW);
    RECT rc;
    GetClientRect(hwnd, &rc);
    SendMessageW(hwnd, WM_SIZE, 0, MAKELPARAM(rc.right, rc.bottom));
    SyncControlsWithSlide();
    InvalidateRect(g_hCanvasWnd, NULL, TRUE);
    InvalidateRect(g_hThumbRailWnd, NULL, TRUE);
    UpdateStatusBar();
}

void EnterKineticSlidesBlank(HWND hwnd) {
    g_slides.clear();
    Slide s;
    s.title = L"Untitled Presentation";
    s.subtitle = L"Click here to add title and subtitle";
    s.body = L"Add bullet points and strategic topics";
    s.layout = LAYOUT_TITLE_HERO;
    s.bgColor = RGB(255, 255, 255);
    s.textColor = RGB(15, 23, 42);
    s.accentColor = PPT_ORANGE;
    s.transition = TRANS_FADE;
    s.transitionSpeedMs = 400;
    s.animType = ANIM_FADE_IN;
    g_slides.push_back(s);
    g_currentSlide = 0;
    g_currentFilePath = L"";
    EnterKineticSlides(hwnd);
}

void LoadKineticTemplate(HWND hwnd, int idx) {
    g_slides.clear();

    if (idx == 0) { // Golden Light Prestige
        Slide s1;
        s1.title = L"Golden Light Prestige";
        s1.subtitle = L"Executive Keynote & Sovereign Widescreen Showcase";
        s1.body = L"Created with Giri Kinetic Presentation Studio\nArchitect: Abhinav Giri (@abhinavgiri45)";
        s1.layout = LAYOUT_TITLE_HERO;
        s1.bgColor = RGB(20, 24, 33);
        s1.textColor = RGB(248, 250, 252);
        s1.accentColor = RGB(245, 158, 11);
        s1.transition = TRANS_FADE;
        s1.transitionSpeedMs = 400;
        s1.animType = ANIM_FADE_IN;
        g_slides.push_back(s1);

        Slide s2;
        s2.title = L"Strategic Market Dominance";
        s2.subtitle = L"High-Velocity Offline Execution Across Edge Workstations";
        s2.body = L"• Zero-latency local execution with sub-50ms responsiveness\n• Proprietary in-memory vector graphic presentation engine\n• 100% Sovereign data protection with zero cloud tracking\n• Seamless bidirectional PPTX and PDF format interchange";
        s2.layout = LAYOUT_TITLE_CONTENT;
        s2.bgColor = RGB(255, 255, 255);
        s2.textColor = RGB(15, 23, 42);
        s2.accentColor = RGB(245, 158, 11);
        s2.transition = TRANS_PUSH_LEFT;
        s2.transitionSpeedMs = 400;
        s2.animType = ANIM_FLY_IN_BOTTOM;
        g_slides.push_back(s2);

        Slide s3;
        s3.title = L"FY2026 Commercial Trajectory";
        s3.subtitle = L"Triple-Digit Growth & Enterprise Deployment Milestones";
        s3.body = L"• Q1 ARR: $1,250,000 (Commercial Workstation Nodes)\n• Q2 ARR: $1,800,000 (Enterprise Offline Licenses)\n• Gross Margin: 89% with zero recurring cloud server overhead\n• 10,000 Corporate Seats Deployed Worldwide";
        s3.layout = LAYOUT_METRICS_DASHBOARD;
        s3.bgColor = RGB(255, 255, 255);
        s3.textColor = RGB(15, 23, 42);
        s3.accentColor = RGB(245, 158, 11);
        s3.transition = TRANS_FADE;
        s3.transitionSpeedMs = 400;
        s3.animType = ANIM_FADE_IN;
        g_slides.push_back(s3);
    } else if (idx == 1) { // Executive Investor Pitch Deck
        Slide s1;
        s1.title = L"Giri Orbit Global";
        s1.subtitle = L"Series A Sovereign Software Investment Pitch";
        s1.body = L"Presented by Abhinav Giri, Founder & Chief Architect\nOctober 2026";
        s1.layout = LAYOUT_TITLE_HERO;
        s1.bgColor = RGB(15, 23, 42);
        s1.textColor = RGB(248, 250, 252);
        s1.accentColor = PPT_ORANGE;
        s1.transition = TRANS_FADE;
        s1.transitionSpeedMs = 400;
        s1.animType = ANIM_FADE_IN;
        g_slides.push_back(s1);

        Slide s2;
        s2.title = L"The Problem: Cloud Surveillance & Lock-In";
        s2.subtitle = L"Enterprises Are Trapped in Expensive Recurring Cloud Subscriptions";
        s2.body = L"• Forced annual price hikes for standard office productivity\n• Latency and offline work restrictions during network outages\n• Enterprise data leakage and telemetric model ingestion\n• Fragile browser-based editors lacking desktop power";
        s2.layout = LAYOUT_TITLE_CONTENT;
        s2.bgColor = RGB(255, 255, 255);
        s2.textColor = RGB(15, 23, 42);
        s2.accentColor = PPT_ORANGE;
        s2.transition = TRANS_PUSH_LEFT;
        s2.transitionSpeedMs = 400;
        s2.animType = ANIM_FLY_IN_BOTTOM;
        g_slides.push_back(s2);

        Slide s3;
        s3.title = L"The Solution: 100% Sovereign Offline Suite";
        s3.subtitle = L"True Sovereign Productivity in Native C++ — Giri Orbit Suite";
        s3.body = L"• Instant cold-boot startup in under 60 milliseconds\n• 9 standalone native executables compiled with zero dependencies\n• Full Authenticode cryptographic signing and offline verification\n• Universal format compatibility across all enterprise workflows";
        s3.layout = LAYOUT_TITLE_CONTENT;
        s3.bgColor = RGB(255, 255, 255);
        s3.textColor = RGB(15, 23, 42);
        s3.accentColor = PPT_ORANGE;
        s3.transition = TRANS_FADE;
        s3.transitionSpeedMs = 400;
        s3.animType = ANIM_FADE_IN;
        g_slides.push_back(s3);
    } else { // Generic Template
        Slide s1;
        s1.title = g_kineticConfig.templates[idx].title;
        s1.subtitle = g_kineticConfig.templates[idx].description;
        s1.body = L"Authored with Giri Kinetic Sovereign Presentation Studio\nLead Engineer: Abhinav Giri (@abhinavgiri45)";
        s1.layout = LAYOUT_TITLE_HERO;
        s1.bgColor = RGB(248, 250, 252);
        s1.textColor = RGB(15, 23, 42);
        s1.accentColor = PPT_ORANGE;
        s1.transition = TRANS_FADE;
        s1.transitionSpeedMs = 400;
        s1.animType = ANIM_FADE_IN;
        g_slides.push_back(s1);

        Slide s2;
        s2.title = L"Execution Framework & Next Steps";
        s2.subtitle = L"High-Velocity Deliverables Matrix";
        s2.body = L"• Phase 1: Localized deployment and security verification\n• Phase 2: Workflow testing with Drift, Axis, and Kinetic\n• Phase 3: Final commercial sign-off and enterprise rollout";
        s2.layout = LAYOUT_TITLE_CONTENT;
        s2.bgColor = RGB(255, 255, 255);
        s2.textColor = RGB(15, 23, 42);
        s2.accentColor = PPT_ORANGE;
        s2.transition = TRANS_PUSH_LEFT;
        s2.transitionSpeedMs = 400;
        s2.animType = ANIM_FLY_IN_BOTTOM;
        g_slides.push_back(s2);
    }

    g_currentSlide = 0;
    EnterKineticSlides(hwnd);
}


// -------------------------------------------------------------
// Entry Point
// -------------------------------------------------------------
int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    // Launch Sovereign Edge App Mode for 100% Giri Orbit web & desktop parity
    if (GiriOrbit::TryLaunchSovereignAppMode(L"kinetic", lpCmdLine)) {
        return 0;
    }

    g_hInst = hInstance;

    // Modern DPI Awareness
    typedef BOOL(WINAPI* PFN_SetProcessDpiAwarenessContext)(HANDLE);
    HMODULE hUser32 = GetModuleHandleW(L"user32.dll");
    if (hUser32) {
        PFN_SetProcessDpiAwarenessContext pfn = (PFN_SetProcessDpiAwarenessContext)GetProcAddress(hUser32, "SetProcessDpiAwarenessContext");
        if (pfn) pfn((HANDLE)-4);
    }

    // Init Common Controls
    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_STANDARD_CLASSES };
    InitCommonControlsEx(&icex);

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

    InitDefaultSlides();

    // Register Window Classes
    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = MainWndProc;
    wcex.hInstance = hInstance;
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(1));
    wcex.hCursor = LoadCursorW(NULL, IDC_ARROW);
    wcex.hbrBackground = CreateSolidBrush(STUDIO_BG);
    wcex.lpszClassName = L"GiriKineticMainWindowClass";
    RegisterClassExW(&wcex);

    WNDCLASSEXW rcw = { sizeof(WNDCLASSEXW) };
    rcw.style = CS_HREDRAW | CS_VREDRAW;
    rcw.lpfnWndProc = RibbonWndProc;
    rcw.hInstance = hInstance;
    rcw.hCursor = LoadCursorW(NULL, IDC_ARROW);
    rcw.hbrBackground = CreateSolidBrush(RGB(255, 255, 255));
    rcw.lpszClassName = L"GiriKineticRibbonClass";
    RegisterClassExW(&rcw);

    WNDCLASSEXW trw = { sizeof(WNDCLASSEXW) };
    trw.style = CS_HREDRAW | CS_VREDRAW;
    trw.lpfnWndProc = ThumbRailWndProc;
    trw.hInstance = hInstance;
    trw.hCursor = LoadCursorW(NULL, IDC_ARROW);
    trw.hbrBackground = CreateSolidBrush(RAIL_BG);
    trw.lpszClassName = L"GiriKineticThumbRailClass";
    RegisterClassExW(&trw);

    WNDCLASSEXW cvw = { sizeof(WNDCLASSEXW) };
    cvw.style = CS_HREDRAW | CS_VREDRAW;
    cvw.lpfnWndProc = CanvasWndProc;
    cvw.hInstance = hInstance;
    cvw.hCursor = LoadCursorW(NULL, IDC_ARROW);
    cvw.hbrBackground = CreateSolidBrush(STUDIO_BG);
    cvw.lpszClassName = L"GiriKineticCanvasClass";
    RegisterClassExW(&cvw);

    WNDCLASSEXW shw = { sizeof(WNDCLASSEXW) };
    shw.style = CS_HREDRAW | CS_VREDRAW;
    shw.lpfnWndProc = ShowWndProc;
    shw.hInstance = hInstance;
    shw.hCursor = LoadCursorW(NULL, IDC_ARROW);
    shw.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    shw.lpszClassName = L"GiriKineticSlideShowClass";
    RegisterClassExW(&shw);

    g_hMainWnd = CreateWindowExW(
        WS_EX_APPWINDOW, L"GiriKineticMainWindowClass",
        L"Presentation 1 — Giri Kinetic (PowerPoint Studio)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1260, 840,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateMainMenu(g_hMainWnd);
    CreateRibbonBar(g_hMainWnd);

    // Left Visual Thumbnail Deck
    g_hThumbRailWnd = CreateWindowExW(
        0, L"GiriKineticThumbRailClass", L"",
        WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_CLIPCHILDREN,
        0, 130, 220, 600,
        g_hMainWnd, NULL, hInstance, NULL
    );

    // Center 16:9 Canvas Viewport
    g_hCanvasWnd = CreateWindowExW(
        0, L"GiriKineticCanvasClass", L"",
        WS_CHILD | WS_VISIBLE | WS_CLIPCHILDREN,
        220, 130, 1020, 600,
        g_hMainWnd, NULL, hInstance, NULL
    );

    // Quick In-place Editors
    HFONT hFontEdit = CreateFontW(15, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
        OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, VARIABLE_PITCH, L"Segoe UI");

    g_hEditTitle = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", g_slides[0].title.c_str(),
        WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
        240, 715, 480, 26, g_hMainWnd, (HMENU)IDC_EDIT_INLINE_TITLE, hInstance, NULL
    );
    SendMessageW(g_hEditTitle, WM_SETFONT, (WPARAM)hFontEdit, TRUE);

    g_hEditBody = CreateWindowExW(
        WS_EX_CLIENTEDGE, L"EDIT", g_slides[0].body.c_str(),
        WS_CHILD | WS_VISIBLE | ES_MULTILINE | ES_AUTOVSCROLL | WS_VSCROLL,
        730, 715, 500, 56, g_hMainWnd, (HMENU)IDC_EDIT_INLINE_BODY, hInstance, NULL
    );
    SendMessageW(g_hEditBody, WM_SETFONT, (WPARAM)hFontEdit, TRUE);

    // Status Bar
    g_hStatusBar = CreateWindowExW(
        0, STATUSCLASSNAMEW, NULL,
        WS_CHILD | WS_VISIBLE | SBARS_SIZEGRIP,
        0, 0, 0, 0, g_hMainWnd, (HMENU)ID_STATUSBAR, hInstance, NULL
    );
    int statwidths[] = { 180, 400, 600, 800, -1 };
    SendMessageW(g_hStatusBar, SB_SETPARTS, 5, (LPARAM)statwidths);

    // Handle command line file argument if passed
    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        std::wstring path = lpCmdLine;
        if (path.front() == L'"' && path.back() == L'"') {
            path = path.substr(1, path.length() - 2);
        }
        if (PathFileExistsW(path.c_str())) {
            std::string content, toolType;
            if (LoadUniversalGiriFile(path, content, toolType)) {
                // Loaded file
                g_currentFilePath = path;
                RecordRecentDoc(path);
            }
        }
    }

    InitKineticConfig();

    if (lpCmdLine && wcslen(lpCmdLine) > 0) {
        g_kineticState = KINETIC_VIEW_SLIDES;
        ShowWindow(g_hRibbonWnd, SW_SHOW);
        ShowWindow(g_hThumbRailWnd, SW_SHOW);
        ShowWindow(g_hCanvasWnd, SW_SHOW);
        ShowWindow(g_hEditTitle, SW_SHOW);
        ShowWindow(g_hEditBody, SW_SHOW);
        ShowWindow(g_hStatusBar, SW_SHOW);
    } else {
        g_kineticState = KINETIC_VIEW_START;
        ShowWindow(g_hRibbonWnd, SW_HIDE);
        ShowWindow(g_hThumbRailWnd, SW_HIDE);
        ShowWindow(g_hCanvasWnd, SW_HIDE);
        ShowWindow(g_hEditTitle, SW_HIDE);
        ShowWindow(g_hEditBody, SW_HIDE);
        ShowWindow(g_hStatusBar, SW_HIDE);
    }

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);
    if (g_kineticState == KINETIC_VIEW_SLIDES) UpdateStatusBar();
    SyncControlsWithSlide();

    // Accelerators / Message Loop
    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        if (msg.message == WM_KEYDOWN) {
            if (msg.wParam == VK_F5) {
                if (GetKeyState(VK_SHIFT) & 0x8000) {
                    LaunchSlideShow(g_currentSlide);
                } else {
                    LaunchSlideShow(0);
                }
                continue;
            }
        }
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    GdiplusShutdown(g_gdiToken);
    return (int)msg.wParam;
}

// -------------------------------------------------------------
// Menu Bar Creation
// -------------------------------------------------------------
void CreateMainMenu(HWND hwnd) {
    HMENU hMenuBar = CreateMenu();

    // File
    HMENU hFile = CreateMenu();
    AppendMenuW(hFile, MF_STRING, ID_FILE_NEW, L"&New Presentation\tCtrl+N");
    AppendMenuW(hFile, MF_STRING, ID_FILE_OPEN, L"&Open...\tCtrl+O");
    AppendMenuW(hFile, MF_STRING, ID_FILE_SAVE, L"&Save\tCtrl+S");
    AppendMenuW(hFile, MF_STRING, ID_FILE_SAVEAS, L"Save &As...");
    AppendMenuW(hFile, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hFile, MF_STRING, ID_FILE_EXIT, L"E&xit\tAlt+F4");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hFile, L"&File");

    // Edit
    HMENU hEdit = CreateMenu();
    AppendMenuW(hEdit, MF_STRING, ID_EDIT_UNDO, L"&Undo\tCtrl+Z");
    AppendMenuW(hEdit, MF_STRING, ID_EDIT_REDO, L"&Redo\tCtrl+Y");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, ID_EDIT_CUT, L"Cu&t\tCtrl+X");
    AppendMenuW(hEdit, MF_STRING, ID_EDIT_COPY, L"&Copy\tCtrl+C");
    AppendMenuW(hEdit, MF_STRING, ID_EDIT_PASTE, L"&Paste\tCtrl+V");
    AppendMenuW(hEdit, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hEdit, MF_STRING, ID_EDIT_SELECTALL, L"Select &All\tCtrl+A");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hEdit, L"&Edit");

    // Slide
    HMENU hSlide = CreateMenu();
    AppendMenuW(hSlide, MF_STRING, ID_SLIDE_NEW, L"&New Slide\tCtrl+M");
    AppendMenuW(hSlide, MF_STRING, ID_SLIDE_DUPLICATE, L"&Duplicate Slide\tCtrl+D");
    AppendMenuW(hSlide, MF_STRING, ID_SLIDE_DELETE, L"&Delete Slide\tDel");
    AppendMenuW(hSlide, MF_SEPARATOR, 0, NULL);
    AppendMenuW(hSlide, MF_STRING, ID_SLIDE_MOVE_UP, L"Move Slide &Up");
    AppendMenuW(hSlide, MF_STRING, ID_SLIDE_MOVE_DOWN, L"Move Slide &Down");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hSlide, L"&Slide");

    // Slide Show
    HMENU hShow = CreateMenu();
    AppendMenuW(hShow, MF_STRING, ID_SHOW_START, L"Start from &Beginning\tF5");
    AppendMenuW(hShow, MF_STRING, ID_SHOW_CURRENT, L"Start from &Current Slide\tShift+F5");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hShow, L"Slide &Show");

    // Help
    HMENU hHelp = CreateMenu();
    AppendMenuW(hHelp, MF_STRING, ID_HELP_ABOUT, L"&About Giri Kinetic...");
    AppendMenuW(hMenuBar, MF_POPUP, (UINT_PTR)hHelp, L"&Help");

    SetMenu(hwnd, hMenuBar);
}

// -------------------------------------------------------------
// Ribbon Toolbar & Controls
// -------------------------------------------------------------
void CreateRibbonBar(HWND hParent) {
    g_hRibbonWnd = CreateWindowExW(
        0, L"GiriKineticRibbonClass", L"",
        WS_CHILD | WS_VISIBLE | WS_CLIPCHILDREN,
        0, 0, 1260, 130,
        hParent, NULL, g_hInst, NULL
    );

    int ribbonY = 40;
    HFONT hRibbonFont = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
        OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY, VARIABLE_PITCH, L"Segoe UI");

    auto makeBtn = [&](int tabIdx, const wchar_t* text, int x, int y, int w, int h, int id, bool primary = false) {
        HWND btn = CreateWindowExW(
            0, L"BUTTON", text,
            WS_CHILD | BS_PUSHBUTTON,
            x, y, w, h, g_hRibbonWnd, (HMENU)(INT_PTR)id, g_hInst, NULL
        );
        SendMessageW(btn, WM_SETFONT, (WPARAM)hRibbonFont, TRUE);
        StyleRibbonButton(btn, primary);
        g_ribbonTabControls[tabIdx].push_back(btn);
        return btn;
    };

    // TAB_HOME Controls
    makeBtn(TAB_HOME, L"+ New Slide", 12, ribbonY + 6, 88, 48, IDC_BTN_NEW_SLIDE, true);
    makeBtn(TAB_HOME, L"Duplicate", 104, ribbonY + 6, 75, 48, IDC_BTN_DUPLICATE_SLIDE);
    makeBtn(TAB_HOME, L"Delete", 183, ribbonY + 6, 60, 48, IDC_BTN_DELETE_SLIDE);

    makeBtn(TAB_HOME, L"Paste", 252, ribbonY + 6, 55, 48, IDC_BTN_PASTE);
    makeBtn(TAB_HOME, L"Cut", 311, ribbonY + 6, 45, 23, IDC_BTN_CUT);
    makeBtn(TAB_HOME, L"Copy", 311, ribbonY + 31, 45, 23, IDC_BTN_COPY);

    // Font Combo
    g_hComboFont = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | CBS_DROPDOWNLIST | WS_VSCROLL,
        366, ribbonY + 8, 130, 220, g_hRibbonWnd, (HMENU)IDC_COMBO_FONT, g_hInst, NULL
    );
    SendMessageW(g_hComboFont, WM_SETFONT, (WPARAM)hRibbonFont, TRUE);
    const wchar_t* fonts[] = { L"Segoe UI", L"Arial", L"Calibri", L"Georgia", L"Consolas", L"Noto Sans Devanagari" };
    for (int i = 0; i < 6; ++i) SendMessageW(g_hComboFont, CB_ADDSTRING, 0, (LPARAM)fonts[i]);
    SendMessageW(g_hComboFont, CB_SETCURSEL, 0, 0);
    g_ribbonTabControls[TAB_HOME].push_back(g_hComboFont);

    // Font Size Combo
    g_hComboSize = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | CBS_DROPDOWNLIST | WS_VSCROLL,
        502, ribbonY + 8, 55, 180, g_hRibbonWnd, (HMENU)IDC_COMBO_SIZE, g_hInst, NULL
    );
    SendMessageW(g_hComboSize, WM_SETFONT, (WPARAM)hRibbonFont, TRUE);
    const wchar_t* sizes[] = { L"18", L"24", L"28", L"32", L"40", L"48", L"60", L"72" };
    for (int i = 0; i < 8; ++i) SendMessageW(g_hComboSize, CB_ADDSTRING, 0, (LPARAM)sizes[i]);
    SendMessageW(g_hComboSize, CB_SETCURSEL, 2, 0);
    g_ribbonTabControls[TAB_HOME].push_back(g_hComboSize);

    makeBtn(TAB_HOME, L"B", 366, ribbonY + 33, 28, 24, IDC_BTN_BOLD);
    makeBtn(TAB_HOME, L"I", 398, ribbonY + 33, 28, 24, IDC_BTN_ITALIC);
    makeBtn(TAB_HOME, L"U", 430, ribbonY + 33, 28, 24, IDC_BTN_UNDERLINE);
    makeBtn(TAB_HOME, L"Color", 462, ribbonY + 33, 46, 24, IDC_BTN_TEXT_COLOR);
    makeBtn(TAB_HOME, L"BG", 512, ribbonY + 33, 45, 24, IDC_BTN_BG_COLOR);

    makeBtn(TAB_HOME, L"L", 566, ribbonY + 8, 28, 24, IDC_BTN_ALIGN_LEFT);
    makeBtn(TAB_HOME, L"C", 598, ribbonY + 8, 28, 24, IDC_BTN_ALIGN_CENTER);
    makeBtn(TAB_HOME, L"R", 630, ribbonY + 8, 28, 24, IDC_BTN_ALIGN_RIGHT);
    makeBtn(TAB_HOME, L"Bullets", 566, ribbonY + 33, 62, 24, IDC_BTN_BULLET);
    makeBtn(TAB_HOME, L"1. Num", 632, ribbonY + 33, 56, 24, IDC_BTN_NUMBERED);

    makeBtn(TAB_HOME, L"Layout: Title", 696, ribbonY + 6, 85, 48, IDC_BTN_LAYOUT_TITLE);
    makeBtn(TAB_HOME, L"Content", 785, ribbonY + 6, 68, 48, IDC_BTN_LAYOUT_CONTENT);
    makeBtn(TAB_HOME, L"2-Column", 857, ribbonY + 6, 75, 48, IDC_BTN_LAYOUT_TWOCOL);
    makeBtn(TAB_HOME, L"Metrics", 936, ribbonY + 6, 68, 48, IDC_BTN_LAYOUT_METRICS);

    makeBtn(TAB_HOME, L"Start Show (F5)", 1014, ribbonY + 6, 128, 48, IDC_BTN_PRESENT_F5, true);

    // TAB_INSERT Controls
    makeBtn(TAB_INSERT, L"+ Image / Picture", 12, ribbonY + 8, 120, 44, IDC_BTN_INSERT_IMAGE);
    makeBtn(TAB_INSERT, L"Table (3x3)", 138, ribbonY + 8, 90, 44, IDC_BTN_INSERT_TABLE);
    makeBtn(TAB_INSERT, L"Rectangle Shape", 234, ribbonY + 8, 110, 44, IDC_BTN_SHAPE_RECT);
    makeBtn(TAB_INSERT, L"Circle / Badge", 350, ribbonY + 8, 100, 44, IDC_BTN_SHAPE_CIRCLE);
    makeBtn(TAB_INSERT, L"Divider Line", 456, ribbonY + 8, 95, 44, IDC_BTN_SHAPE_LINE);
    makeBtn(TAB_INSERT, L"Google Devanagari Hindi", 558, ribbonY + 8, 160, 44, IDC_BTN_INSERT_DEVANAGARI, true);

    // TAB_DESIGN Controls
    makeBtn(TAB_DESIGN, L"Clean Executive", 12, ribbonY + 8, 120, 44, IDC_BTN_THEME_CLEAN);
    makeBtn(TAB_DESIGN, L"Dark Sovereign", 138, ribbonY + 8, 110, 44, IDC_BTN_THEME_DARK);
    makeBtn(TAB_DESIGN, L"Emerald Modern", 254, ribbonY + 8, 115, 44, IDC_BTN_THEME_EMERALD);
    makeBtn(TAB_DESIGN, L"Vibrant Sunset", 375, ribbonY + 8, 110, 44, IDC_BTN_THEME_SUNSET);
    makeBtn(TAB_DESIGN, L"16:9 Widescreen", 495, ribbonY + 8, 115, 44, IDC_BTN_RATIO_16_9, true);
    makeBtn(TAB_DESIGN, L"4:3 Standard", 616, ribbonY + 8, 95, 44, IDC_BTN_RATIO_4_3);
    makeBtn(TAB_DESIGN, L"Custom Background", 717, ribbonY + 8, 135, 44, IDC_BTN_BG_COLOR);

    // TAB_TRANSITIONS Controls
    g_hComboTrans = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | CBS_DROPDOWNLIST | WS_VSCROLL,
        12, ribbonY + 16, 170, 220, g_hRibbonWnd, (HMENU)IDC_COMBO_TRANSITION, g_hInst, NULL
    );
    SendMessageW(g_hComboTrans, WM_SETFONT, (WPARAM)hRibbonFont, TRUE);
    const wchar_t* transList[] = { L"None", L"Fade (Crossfade)", L"Push Left", L"Push Right", L"Wipe Down", L"Wipe Up", L"Zoom Pop", L"Dissolve" };
    for (int i = 0; i < 8; ++i) SendMessageW(g_hComboTrans, CB_ADDSTRING, 0, (LPARAM)transList[i]);
    SendMessageW(g_hComboTrans, CB_SETCURSEL, 1, 0);
    g_ribbonTabControls[TAB_TRANSITIONS].push_back(g_hComboTrans);

    makeBtn(TAB_TRANSITIONS, L"Preview Transition", 192, ribbonY + 10, 145, 38, IDC_BTN_TRANS_PREVIEW, true);
    makeBtn(TAB_TRANSITIONS, L"Apply to All Slides", 345, ribbonY + 10, 135, 38, IDC_BTN_TRANS_APPLY_ALL);

    // TAB_ANIMATIONS Controls
    g_hComboAnim = CreateWindowExW(
        0, L"COMBOBOX", L"",
        WS_CHILD | CBS_DROPDOWNLIST | WS_VSCROLL,
        12, ribbonY + 16, 180, 220, g_hRibbonWnd, (HMENU)IDC_COMBO_ANIMATION, g_hInst, NULL
    );
    SendMessageW(g_hComboAnim, WM_SETFONT, (WPARAM)hRibbonFont, TRUE);
    const wchar_t* animList[] = { L"None", L"Fade In", L"Fly In from Bottom", L"Fly In from Left", L"Zoom In", L"Typewriter Reveal" };
    for (int i = 0; i < 6; ++i) SendMessageW(g_hComboAnim, CB_ADDSTRING, 0, (LPARAM)animList[i]);
    SendMessageW(g_hComboAnim, CB_SETCURSEL, 1, 0);
    g_ribbonTabControls[TAB_ANIMATIONS].push_back(g_hComboAnim);

    makeBtn(TAB_ANIMATIONS, L"Preview In-Slide Animation", 202, ribbonY + 10, 185, 38, IDC_BTN_ANIM_PREVIEW, true);

    // TAB_SLIDESHOW Controls
    makeBtn(TAB_SLIDESHOW, L"From Beginning (F5)", 12, ribbonY + 8, 160, 44, IDC_BTN_PRESENT_F5, true);
    makeBtn(TAB_SLIDESHOW, L"From Current Slide", 178, ribbonY + 8, 150, 44, IDC_BTN_PRESENT_CURRENT);
    makeBtn(TAB_SLIDESHOW, L"Presentation Shortcuts Help", 336, ribbonY + 8, 175, 44, ID_HELP_ABOUT);

    // TAB_VIEW Controls
    makeBtn(TAB_VIEW, L"Fit to Window", 12, ribbonY + 8, 110, 44, IDC_BTN_ZOOM_FIT);
    makeBtn(TAB_VIEW, L"100% Zoom", 128, ribbonY + 8, 95, 44, IDC_BTN_ZOOM_100);

    // Initial Tab Visibility
    SwitchRibbonTab(TAB_HOME);
}

void SwitchRibbonTab(int newTab) {
    if (newTab < 0 || newTab >= TAB_COUNT) return;
    g_activeRibbonTab = newTab;

    for (int t = 0; t < TAB_COUNT; ++t) {
        int show = (t == newTab) ? SW_SHOW : SW_HIDE;
        for (HWND h : g_ribbonTabControls[t]) {
            ShowWindow(h, show);
        }
    }
    InvalidateRect(g_hRibbonWnd, NULL, FALSE);
}

// -------------------------------------------------------------
// Ribbon Window Procedure (Two-Tier Office Design)
// -------------------------------------------------------------
LRESULT CALLBACK RibbonWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_ERASEBKGND:
        return 1;

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);

        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, rc.right, rc.bottom);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        // Header Background
        HBRUSH hBrTop = CreateSolidBrush(RGB(255, 255, 255));
        RECT topRc = { 0, 0, rc.right, 34 };
        FillRect(memDC, &topRc, hBrTop);
        DeleteObject(hBrTop);

        // Ribbon Body Background
        HBRUSH hBrBody = CreateSolidBrush(RGB(248, 250, 252));
        RECT bodyRc = { 0, 34, rc.right, rc.bottom };
        FillRect(memDC, &bodyRc, hBrBody);
        DeleteObject(hBrBody);

        // Divider Line
        HPEN hPen = CreatePen(PS_SOLID, 1, RGB(226, 232, 240));
        HPEN oldPen = (HPEN)SelectObject(memDC, hPen);
        MoveToEx(memDC, 0, 34, NULL);
        LineTo(memDC, rc.right, 34);
        MoveToEx(memDC, 0, rc.bottom - 1, NULL);
        LineTo(memDC, rc.right, rc.bottom - 1);
        SelectObject(memDC, oldPen);
        DeleteObject(hPen);

        // Draw Tabs
        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);

        // <- Hub Button (x: 8, y: 4, w: 56, h: 26)
        bool isHubHover = (g_hoverRibbonTab == -99);
        SolidBrush hubBg(isHubHover ? Color(255, 247, 237) : Color(241, 245, 249));
        Pen hubBorder(isHubHover ? Color(249, 115, 22) : Color(203, 213, 225), 1.0f);
        GraphicsPath hubPath;
        RectF hubRect(8.0f, 4.0f, 56.0f, 26.0f);
        GiriOrbit::AddRoundedRect(hubPath, hubRect, 4.0f);
        g.FillPath(&hubBg, &hubPath);
        g.DrawPath(&hubBorder, &hubPath);

        FontFamily ffHub(L"Segoe UI");
        Gdiplus::Font fHub(&ffHub, 9, FontStyleBold, UnitPoint);
        SolidBrush hubText(isHubHover ? Color(194, 65, 12) : Color(71, 85, 105));
        StringFormat sfHub;
        sfHub.SetAlignment(StringAlignmentCenter);
        sfHub.SetLineAlignment(StringAlignmentCenter);
        g.DrawString(L"← Hub", -1, &fHub, PointF(36.0f, 17.0f), &sfHub, &hubText);

        const wchar_t* tabTitles[] = { L"Home", L"Insert", L"Design", L"Transitions", L"Animations", L"Slide Show", L"View" };
        int tabX = 74;
        FontFamily ff(L"Segoe UI");
        Gdiplus::Font tabFont(&ff, 10, FontStyleRegular, UnitPoint);
        Gdiplus::Font boldTabFont(&ff, 10, FontStyleBold, UnitPoint);

        SolidBrush brNormal(Color(255, 100, 116, 139));
        SolidBrush brActive(Color(255, 216, 59, 1));
        SolidBrush brHover(Color(255, 15, 23, 42));
        SolidBrush brUnderline(Color(255, 216, 59, 1));

        for (int i = 0; i < TAB_COUNT; ++i) {
            RectF bounds;
            g.MeasureString(tabTitles[i], -1, &tabFont, PointF((REAL)tabX, 8), &bounds);
            int tabW = (int)bounds.Width + 24;

            if (i == g_activeRibbonTab) {
                g.DrawString(tabTitles[i], -1, &boldTabFont, PointF((REAL)tabX + 12, 8), &brActive);
                // Active Underline
                g.FillRectangle(&brUnderline, (REAL)tabX + 4.0f, 31.0f, (REAL)tabW - 8.0f, 3.0f);
            } else if (i == g_hoverRibbonTab) {
                SolidBrush hovBg(Color(20, 0, 0, 0));
                g.FillRectangle(&hovBg, (REAL)tabX, 4.0f, (REAL)tabW, 28.0f);
                g.DrawString(tabTitles[i], -1, &tabFont, PointF((REAL)tabX + 12, 8), &brHover);
            } else {
                g.DrawString(tabTitles[i], -1, &tabFont, PointF((REAL)tabX + 12, 8), &brNormal);
            }
            tabX += tabW + 6;
        }

        BitBlt(hdc, 0, 0, rc.right, rc.bottom, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);
        EndPaint(hwnd, &ps);
        return 0;
    }

    case WM_MOUSEMOVE: {
        int x = GET_X_LPARAM(lParam);
        int y = GET_Y_LPARAM(lParam);
        int oldHover = g_hoverRibbonTab;
        g_hoverRibbonTab = -1;

        if (y < 34) {
            int tabX = 16;
            for (int i = 0; i < TAB_COUNT; ++i) {
                int tabW = 75; // Approx
                if (x >= tabX && x <= tabX + tabW) {
                    g_hoverRibbonTab = i;
                    break;
                }
                tabX += tabW + 6;
            }
        }
        if (oldHover != g_hoverRibbonTab) InvalidateRect(hwnd, NULL, FALSE);

        TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
        TrackMouseEvent(&tme);
        break;
    }

    case WM_MOUSELEAVE:
        g_hoverRibbonTab = -1;
        InvalidateRect(hwnd, NULL, FALSE);
        break;

    case WM_LBUTTONDOWN: {
        int x = GET_X_LPARAM(lParam);
        int y = GET_Y_LPARAM(lParam);
        if (y < 34) {
            int tabX = 16;
            for (int i = 0; i < TAB_COUNT; ++i) {
                int tabW = 75;
                if (x >= tabX && x <= tabX + tabW) {
                    SwitchRibbonTab(i);
                    break;
                }
                tabX += tabW + 6;
            }
        }
        break;
    }
    }
    return DefWindowProcW(hwnd, uMsg, wParam, lParam);
}

// -------------------------------------------------------------
// Left Slide Rail (Thumbnail Deck)
// -------------------------------------------------------------
LRESULT CALLBACK ThumbRailWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_ERASEBKGND:
        return 1;

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);

        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, rc.right, rc.bottom);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        HBRUSH hBr = CreateSolidBrush(RAIL_BG);
        FillRect(memDC, &rc, hBr);
        DeleteObject(hBr);

        // Divider on right edge of rail
        HPEN hPen = CreatePen(PS_SOLID, 1, RGB(226, 232, 240));
        HPEN oldPen = (HPEN)SelectObject(memDC, hPen);
        MoveToEx(memDC, rc.right - 1, 0, NULL);
        LineTo(memDC, rc.right - 1, rc.bottom);
        SelectObject(memDC, oldPen);
        DeleteObject(hPen);

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);
        g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

        FontFamily ff(L"Segoe UI");
        Gdiplus::Font numFont(&ff, 10, FontStyleBold, UnitPoint);
        Gdiplus::Font titleFont(&ff, 7, FontStyleBold, UnitPoint);
        Gdiplus::Font bodyFont(&ff, 5.5f, FontStyleRegular, UnitPoint);

        SolidBrush brText(Color(255, 15, 23, 42));
        SolidBrush brMuted(Color(255, 100, 116, 139));
        SolidBrush brOrange(Color(255, 216, 59, 1));
        Pen penOrange(Color(255, 216, 59, 1), 3.0f);
        Pen penNormal(Color(255, 203, 213, 225), 1.0f);

        int thumbW = 160;
        int thumbH = 90; // 16:9 ratio
        int startX = 38;
        int startY = 16 - g_thumbScrollY;

        for (size_t i = 0; i < g_slides.size(); ++i) {
            int cardY = startY + (int)i * (thumbH + 20);

            // Draw slide number pill
            std::wstring numStr = std::to_wstring(i + 1);
            g.DrawString(numStr.c_str(), -1, &numFont, PointF(12.0f, (REAL)cardY + thumbH / 2 - 8), &brMuted);

            // Slide Card Background
            Color cardBg(255, GetRValue(g_slides[i].bgColor), GetGValue(g_slides[i].bgColor), GetBValue(g_slides[i].bgColor));
            SolidBrush brCard(cardBg);
            g.FillRectangle(&brCard, (REAL)startX, (REAL)cardY, (REAL)thumbW, (REAL)thumbH);

            // Slide miniature content preview
            Color slideTextColor(255, GetRValue(g_slides[i].textColor), GetGValue(g_slides[i].textColor), GetBValue(g_slides[i].textColor));
            SolidBrush brSlideText(slideTextColor);

            RectF titleBox((REAL)startX + 6, (REAL)cardY + 6, (REAL)thumbW - 12, 24);
            g.DrawString(g_slides[i].title.c_str(), -1, &titleFont, titleBox, NULL, &brSlideText);

            if (!g_slides[i].body.empty()) {
                RectF bodyBox((REAL)startX + 6, (REAL)cardY + 30, (REAL)thumbW - 12, (REAL)thumbH - 36);
                g.DrawString(g_slides[i].body.c_str(), -1, &bodyFont, bodyBox, NULL, &brMuted);
            }

            // Selection / Active border
            if ((int)i == g_currentSlide) {
                g.DrawRectangle(&penOrange, (REAL)startX, (REAL)cardY, (REAL)thumbW, (REAL)thumbH);
            } else if ((int)i == g_hoverThumb) {
                Pen penHov(Color(255, 148, 163, 184), 1.5f);
                g.DrawRectangle(&penHov, (REAL)startX, (REAL)cardY, (REAL)thumbW, (REAL)thumbH);
            } else {
                g.DrawRectangle(&penNormal, (REAL)startX, (REAL)cardY, (REAL)thumbW, (REAL)thumbH);
            }
        }

        BitBlt(hdc, 0, 0, rc.right, rc.bottom, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);
        EndPaint(hwnd, &ps);
        return 0;
    }

    case WM_MOUSEMOVE: {
        int y = GET_Y_LPARAM(lParam) + g_thumbScrollY;
        int oldHover = g_hoverThumb;
        g_hoverThumb = -1;

        int thumbH = 90;
        int step = thumbH + 20;
        int idx = (y - 16) / step;
        if (idx >= 0 && idx < (int)g_slides.size()) {
            g_hoverThumb = idx;
        }

        if (oldHover != g_hoverThumb) InvalidateRect(hwnd, NULL, FALSE);
        TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
        TrackMouseEvent(&tme);
        break;
    }

    case WM_MOUSELEAVE:
        g_hoverThumb = -1;
        InvalidateRect(hwnd, NULL, FALSE);
        break;

    case WM_LBUTTONDOWN: {
        int y = GET_Y_LPARAM(lParam) + g_thumbScrollY;
        int thumbH = 90;
        int step = thumbH + 20;
        int idx = (y - 16) / step;
        if (idx >= 0 && idx < (int)g_slides.size()) {
            CommitInlineEdits();
            g_currentSlide = idx;
            InvalidateRect(hwnd, NULL, FALSE);
            InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            SyncControlsWithSlide();
            UpdateStatusBar();
        }
        break;
    }

    case WM_MOUSEWHEEL: {
        int delta = GET_WHEEL_DELTA_WPARAM(wParam);
        g_thumbScrollY -= (delta / 120) * 40;
        if (g_thumbScrollY < 0) g_thumbScrollY = 0;
        InvalidateRect(hwnd, NULL, FALSE);
        break;
    }
    }
    return DefWindowProcW(hwnd, uMsg, wParam, lParam);
}

// -------------------------------------------------------------
// Central 16:9 Canvas Viewport
// -------------------------------------------------------------
LRESULT CALLBACK CanvasWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_ERASEBKGND:
        return 1;

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);

        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, rc.right, rc.bottom);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        // Studio Dark Backdrop
        HBRUSH hBr = CreateSolidBrush(STUDIO_BG);
        FillRect(memDC, &rc, hBr);
        DeleteObject(hBr);

        if (g_slides.empty() || g_currentSlide < 0 || g_currentSlide >= (int)g_slides.size()) {
            BitBlt(hdc, 0, 0, rc.right, rc.bottom, memDC, 0, 0, SRCCOPY);
            SelectObject(memDC, oldBM);
            DeleteObject(memBM);
            DeleteDC(memDC);
            EndPaint(hwnd, &ps);
            return 0;
        }

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);
        g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

        // Calculate 16:9 Slide Dimensions
        int pad = 28;
        int maxW = rc.right - pad * 2;
        int maxH = rc.bottom - pad * 2;

        int slideW = maxW;
        int slideH = (slideW * 9) / 16;
        if (slideH > maxH) {
            slideH = maxH;
            slideW = (slideH * 16) / 9;
        }

        int slideX = (rc.right - slideW) / 2;
        int slideY = (rc.bottom - slideH) / 2;

        // Realistic Drop Shadow
        for (int s = 8; s >= 1; --s) {
            SolidBrush shadowBr(Color(12, 0, 0, 0));
            g.FillRectangle(&shadowBr, (REAL)(slideX - s + 4), (REAL)(slideY - s + 6), (REAL)(slideW + s * 2), (REAL)(slideH + s * 2));
        }

        const Slide& slide = g_slides[g_currentSlide];

        // Slide Background
        Color bgCol(255, GetRValue(slide.bgColor), GetGValue(slide.bgColor), GetBValue(slide.bgColor));
        SolidBrush brBg(bgCol);
        g.FillRectangle(&brBg, (REAL)slideX, (REAL)slideY, (REAL)slideW, (REAL)slideH);

        // Slide Border
        Pen borderPen(Color(255, 226, 232, 240), 1.0f);
        g.DrawRectangle(&borderPen, (REAL)slideX, (REAL)slideY, (REAL)slideW, (REAL)slideH);

        // Fonts
        FontFamily ff(L"Segoe UI");
        Gdiplus::Font heroTitleFont(&ff, 28, FontStyleBold, UnitPoint);
        Gdiplus::Font contentTitleFont(&ff, 22, FontStyleBold, UnitPoint);
        Gdiplus::Font subFont(&ff, 14, FontStyleRegular, UnitPoint);
        Gdiplus::Font bodyFont(&ff, 13, FontStyleRegular, UnitPoint);
        Gdiplus::Font metricValFont(&ff, 32, FontStyleBold, UnitPoint);

        Color textCol(255, GetRValue(slide.textColor), GetGValue(slide.textColor), GetBValue(slide.textColor));
        SolidBrush brText(textCol);
        SolidBrush brMuted(Color(255, 100, 116, 139));
        Color accentCol(255, GetRValue(slide.accentColor), GetGValue(slide.accentColor), GetBValue(slide.accentColor));
        SolidBrush brAccent(accentCol);

        // Accent decorative top line
        g.FillRectangle(&brAccent, (REAL)slideX, (REAL)slideY, (REAL)slideW, 6.0f);

        if (slide.layout == LAYOUT_TITLE_HERO) {
            // Centered Hero Layout
            StringFormat sf;
            sf.SetAlignment(StringAlignmentCenter);
            sf.SetLineAlignment(StringAlignmentCenter);

            RectF titleBox((REAL)slideX + 40, (REAL)slideY + (slideH / 2) - 80, (REAL)slideW - 80, 80);
            g.DrawString(slide.title.c_str(), -1, &heroTitleFont, titleBox, &sf, &brText);

            RectF subBox((REAL)slideX + 40, (REAL)slideY + (slideH / 2) + 10, (REAL)slideW - 80, 40);
            g.DrawString(slide.subtitle.c_str(), -1, &subFont, subBox, &sf, &brMuted);

            RectF bodyBox((REAL)slideX + 60, (REAL)slideY + (slideH / 2) + 55, (REAL)slideW - 120, 70);
            g.DrawString(slide.body.c_str(), -1, &bodyFont, bodyBox, &sf, &brMuted);

        } else if (slide.layout == LAYOUT_TITLE_CONTENT) {
            // Standard Title + Content Layout
            RectF titleBox((REAL)slideX + 40, (REAL)slideY + 36, (REAL)slideW - 80, 50);
            g.DrawString(slide.title.c_str(), -1, &contentTitleFont, titleBox, NULL, &brText);

            if (!slide.subtitle.empty()) {
                RectF subBox((REAL)slideX + 40, (REAL)slideY + 85, (REAL)slideW - 80, 30);
                g.DrawString(slide.subtitle.c_str(), -1, &subFont, subBox, NULL, &brMuted);
            }

            RectF bodyBox((REAL)slideX + 40, (REAL)slideY + 125, (REAL)slideW - 80, (REAL)slideH - 160);
            g.DrawString(slide.body.c_str(), -1, &bodyFont, bodyBox, NULL, &brText);

        } else if (slide.layout == LAYOUT_TWO_COLUMN) {
            // Two-Column Layout
            RectF titleBox((REAL)slideX + 40, (REAL)slideY + 36, (REAL)slideW - 80, 50);
            g.DrawString(slide.title.c_str(), -1, &contentTitleFont, titleBox, NULL, &brText);

            float colW = (slideW - 110) / 2.0f;
            RectF col1((REAL)slideX + 40, (REAL)slideY + 110, colW, (REAL)slideH - 150);
            g.DrawString(slide.body.c_str(), -1, &bodyFont, col1, NULL, &brText);

            RectF col2((REAL)slideX + 50 + colW, (REAL)slideY + 110, colW, (REAL)slideH - 150);
            g.DrawString(slide.rightColText.c_str(), -1, &bodyFont, col2, NULL, &brText);

        } else if (slide.layout == LAYOUT_METRICS_DASHBOARD) {
            // Metrics Dashboard Layout
            RectF titleBox((REAL)slideX + 40, (REAL)slideY + 36, (REAL)slideW - 80, 50);
            g.DrawString(slide.title.c_str(), -1, &contentTitleFont, titleBox, NULL, &brText);

            // Draw Metric Cards
            std::wstringstream ss(slide.body);
            std::wstring line;
            int cardIdx = 0;
            float cW = (slideW - 120) / 4.0f;
            float cH = 120.0f;
            float cY = (REAL)slideY + 130;

            while (std::getline(ss, line) && cardIdx < 4) {
                float cX = (REAL)slideX + 40 + cardIdx * (cW + 12);
                SolidBrush cardBg(Color(255, 241, 245, 249));
                g.FillRectangle(&cardBg, cX, cY, cW, cH);
                Pen cardBorder(Color(255, 226, 232, 240), 1.0f);
                g.DrawRectangle(&cardBorder, cX, cY, cW, cH);

                size_t colon = line.find(L":");
                if (colon != std::wstring::npos) {
                    std::wstring label = line.substr(0, colon);
                    std::wstring val = line.substr(colon + 1);

                    RectF valBox(cX + 10, cY + 18, cW - 20, 50);
                    g.DrawString(val.c_str(), -1, &metricValFont, valBox, NULL, &brAccent);

                    RectF lblBox(cX + 10, cY + 75, cW - 20, 35);
                    g.DrawString(label.c_str(), -1, &bodyFont, lblBox, NULL, &brMuted);
                } else {
                    RectF lineBox(cX + 10, cY + 30, cW - 20, 60);
                    g.DrawString(line.c_str(), -1, &bodyFont, lineBox, NULL, &brText);
                }
                cardIdx++;
            }
        }

        // Selection Handle Indicators (8 dots around active card)
        SolidBrush handleBr(Color(255, 216, 59, 1));
        Pen handlePen(Color(255, 255, 255), 1.5f);
        auto drawHandle = [&](int hx, int hy) {
            g.FillEllipse(&handleBr, hx - 4, hy - 4, 8, 8);
            g.DrawEllipse(&handlePen, hx - 4, hy - 4, 8, 8);
        };
        drawHandle(slideX, slideY);
        drawHandle(slideX + slideW / 2, slideY);
        drawHandle(slideX + slideW, slideY);
        drawHandle(slideX + slideW, slideY + slideH / 2);
        drawHandle(slideX + slideW, slideY + slideH);
        drawHandle(slideX + slideW / 2, slideY + slideH);
        drawHandle(slideX, slideY + slideH);
        drawHandle(slideX, slideY + slideH / 2);

        BitBlt(hdc, 0, 0, rc.right, rc.bottom, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);
        EndPaint(hwnd, &ps);
        return 0;
    }
    }
    return DefWindowProcW(hwnd, uMsg, wParam, lParam);
}

// -------------------------------------------------------------
// Slide Show Window (Fullscreen F5)
// -------------------------------------------------------------
void LaunchSlideShow(int startIdx) {
    if (g_slides.empty()) return;
    CommitInlineEdits();
    g_inSlideShow = true;
    g_showSlideIdx = startIdx;
    if (g_showSlideIdx < 0 || g_showSlideIdx >= (int)g_slides.size()) g_showSlideIdx = 0;
    g_inkStrokes.clear();

    int screenW = GetSystemMetrics(SM_CXSCREEN);
    int screenH = GetSystemMetrics(SM_CYSCREEN);

    g_hShowWnd = CreateWindowExW(
        WS_EX_TOPMOST, L"GiriKineticSlideShowClass", L"Giri Kinetic Slide Show",
        WS_POPUP | WS_VISIBLE,
        0, 0, screenW, screenH,
        g_hMainWnd, NULL, g_hInst, NULL
    );

    ShowCursor(TRUE);
    SetFocus(g_hShowWnd);
}

void ExitSlideShow() {
    if (g_hShowWnd) {
        DestroyWindow(g_hShowWnd);
        g_hShowWnd = NULL;
    }
    g_inSlideShow = false;
    SetFocus(g_hMainWnd);
    InvalidateRect(g_hCanvasWnd, NULL, FALSE);
    InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
}

LRESULT CALLBACK ShowWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_ERASEBKGND:
        return 1;

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);

        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, rc.right, rc.bottom);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        if (g_blankScreen) {
            HBRUSH hBr = CreateSolidBrush(g_blankColor);
            FillRect(memDC, &rc, hBr);
            DeleteObject(hBr);
        } else {
            Graphics g(memDC);
            g.SetSmoothingMode(SmoothingModeAntiAlias);
            g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

            const Slide& slide = g_slides[g_showSlideIdx];

            // Fill Background
            Color bgCol(255, GetRValue(slide.bgColor), GetGValue(slide.bgColor), GetBValue(slide.bgColor));
            SolidBrush brBg(bgCol);
            g.FillRectangle(&brBg, 0, 0, rc.right, rc.bottom);

            // Typography
            FontFamily ff(L"Segoe UI");
            Gdiplus::Font heroTitleFont(&ff, 38, FontStyleBold, UnitPoint);
            Gdiplus::Font contentTitleFont(&ff, 30, FontStyleBold, UnitPoint);
            Gdiplus::Font subFont(&ff, 20, FontStyleRegular, UnitPoint);
            Gdiplus::Font bodyFont(&ff, 18, FontStyleRegular, UnitPoint);

            Color textCol(255, GetRValue(slide.textColor), GetGValue(slide.textColor), GetBValue(slide.textColor));
            SolidBrush brText(textCol);
            SolidBrush brMuted(Color(255, 100, 116, 139));
            Color accentCol(255, GetRValue(slide.accentColor), GetGValue(slide.accentColor), GetBValue(slide.accentColor));
            SolidBrush brAccent(accentCol);

            // Accent bar
            g.FillRectangle(&brAccent, 0.0f, 0.0f, (REAL)rc.right, 8.0f);

            if (slide.layout == LAYOUT_TITLE_HERO) {
                StringFormat sf;
                sf.SetAlignment(StringAlignmentCenter);
                sf.SetLineAlignment(StringAlignmentCenter);

                RectF titleBox(60.0f, (REAL)(rc.bottom / 2) - 140, (REAL)rc.right - 120, 120);
                g.DrawString(slide.title.c_str(), -1, &heroTitleFont, titleBox, &sf, &brText);

                RectF subBox(60.0f, (REAL)(rc.bottom / 2) - 10, (REAL)rc.right - 120, 60);
                g.DrawString(slide.subtitle.c_str(), -1, &subFont, subBox, &sf, &brMuted);

                RectF bodyBox(80.0f, (REAL)(rc.bottom / 2) + 60, (REAL)rc.right - 160, 100);
                g.DrawString(slide.body.c_str(), -1, &bodyFont, bodyBox, &sf, &brMuted);

            } else {
                RectF titleBox(80.0f, 60.0f, (REAL)rc.right - 160, 80);
                g.DrawString(slide.title.c_str(), -1, &contentTitleFont, titleBox, NULL, &brText);

                if (!slide.subtitle.empty()) {
                    RectF subBox(80.0f, 140.0f, (REAL)rc.right - 160, 40);
                    g.DrawString(slide.subtitle.c_str(), -1, &subFont, subBox, NULL, &brMuted);
                }

                RectF bodyBox(80.0f, 200.0f, (REAL)rc.right - 160, (REAL)rc.bottom - 260);
                g.DrawString(slide.body.c_str(), -1, &bodyFont, bodyBox, NULL, &brText);
            }

            // Draw Ink Annotations
            Pen inkPen(Color(255, 239, 68, 68), 3.0f);
            for (const auto& stroke : g_inkStrokes) {
                for (size_t p = 1; p < stroke.size(); ++p) {
                    g.DrawLine(&inkPen, (REAL)stroke[p - 1].x, (REAL)stroke[p - 1].y, (REAL)stroke[p].x, (REAL)stroke[p].y);
                }
            }

            // Draw Laser Pointer if active
            if (g_laserPointer) {
                SolidBrush laserBr(Color(255, 239, 68, 68));
                g.FillEllipse(&laserBr, g_laserPos.x - 7, g_laserPos.y - 7, 14, 14);
            }
        }

        BitBlt(hdc, 0, 0, rc.right, rc.bottom, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);
        EndPaint(hwnd, &ps);
        return 0;
    }

    case WM_KEYDOWN: {
        switch (wParam) {
        case VK_ESCAPE:
            ExitSlideShow();
            return 0;

        case VK_SPACE:
        case VK_RETURN:
        case VK_RIGHT:
        case VK_DOWN:
        case VK_NEXT:
            if (g_showSlideIdx < (int)g_slides.size() - 1) {
                g_showSlideIdx++;
                g_currentSlide = g_showSlideIdx;
                g_inkStrokes.clear();
                InvalidateRect(hwnd, NULL, FALSE);
            } else {
                ExitSlideShow();
            }
            return 0;

        case VK_LEFT:
        case VK_UP:
        case VK_PRIOR:
        case VK_BACK:
            if (g_showSlideIdx > 0) {
                g_showSlideIdx--;
                g_currentSlide = g_showSlideIdx;
                g_inkStrokes.clear();
                InvalidateRect(hwnd, NULL, FALSE);
            }
            return 0;

        case 'B':
            g_blankScreen = !g_blankScreen;
            g_blankColor = RGB(0, 0, 0);
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;

        case 'W':
            g_blankScreen = !g_blankScreen;
            g_blankColor = RGB(255, 255, 255);
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;

        case 'L':
            g_laserPointer = !g_laserPointer;
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;

        case 'E':
            g_inkStrokes.clear();
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        }
        break;
    }

    case WM_LBUTTONDOWN: {
        if (GetKeyState(VK_CONTROL) & 0x8000) {
            // Ink drawing start
            g_isDrawing = true;
            std::vector<POINT> newStroke;
            POINT pt = { GET_X_LPARAM(lParam), GET_Y_LPARAM(lParam) };
            newStroke.push_back(pt);
            g_inkStrokes.push_back(newStroke);
        } else {
            // Next Slide
            if (g_showSlideIdx < (int)g_slides.size() - 1) {
                g_showSlideIdx++;
                g_currentSlide = g_showSlideIdx;
                g_inkStrokes.clear();
                InvalidateRect(hwnd, NULL, FALSE);
            } else {
                ExitSlideShow();
            }
        }
        break;
    }

    case WM_MOUSEMOVE: {
        g_laserPos.x = GET_X_LPARAM(lParam);
        g_laserPos.y = GET_Y_LPARAM(lParam);
        if (g_isDrawing && !g_inkStrokes.empty()) {
            g_inkStrokes.back().push_back(g_laserPos);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (g_laserPointer) {
            InvalidateRect(hwnd, NULL, FALSE);
        }
        break;
    }

    case WM_LBUTTONUP:
        g_isDrawing = false;
        break;

    case WM_RBUTTONDOWN:
        // Right click exits or goes back
        if (g_showSlideIdx > 0) {
            g_showSlideIdx--;
            g_currentSlide = g_showSlideIdx;
            g_inkStrokes.clear();
            InvalidateRect(hwnd, NULL, FALSE);
        }
        break;
    }
    return DefWindowProcW(hwnd, uMsg, wParam, lParam);
}

// -------------------------------------------------------------
// Synchronization & State
// -------------------------------------------------------------
void CommitInlineEdits() {
    if (g_currentSlide < 0 || g_currentSlide >= (int)g_slides.size()) return;
    int lenTitle = GetWindowTextLengthW(g_hEditTitle);
    std::wstring t(lenTitle + 1, L'\0');
    GetWindowTextW(g_hEditTitle, &t[0], lenTitle + 1);
    t.resize(lenTitle);
    g_slides[g_currentSlide].title = t;

    int lenBody = GetWindowTextLengthW(g_hEditBody);
    std::wstring b(lenBody + 1, L'\0');
    GetWindowTextW(g_hEditBody, &b[0], lenBody + 1);
    b.resize(lenBody);
    g_slides[g_currentSlide].body = b;
}

void SyncControlsWithSlide() {
    if (g_currentSlide < 0 || g_currentSlide >= (int)g_slides.size()) return;
    const Slide& s = g_slides[g_currentSlide];
    SetWindowTextW(g_hEditTitle, s.title.c_str());
    SetWindowTextW(g_hEditBody, s.body.c_str());
    if (g_hComboTrans) SendMessageW(g_hComboTrans, CB_SETCURSEL, (WPARAM)s.transition, 0);
    if (g_hComboAnim) SendMessageW(g_hComboAnim, CB_SETCURSEL, (WPARAM)s.animType, 0);
}

void UpdateStatusBar() {
    if (!g_hStatusBar) return;
    std::wstring part1 = L"Slide " + std::to_wstring(g_currentSlide + 1) + L" of " + std::to_wstring(g_slides.size());
    std::wstring part2 = L"Theme: PowerPoint Modern 16:9 Widescreen";
    std::wstring part3 = L"100% Sovereign Offline Engine";
    std::wstring part4 = L"English (United States)";
    std::wstring part5 = L"[F5] Slide Show";

    SendMessageW(g_hStatusBar, SB_SETTEXTW, 0, (LPARAM)part1.c_str());
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 1, (LPARAM)part2.c_str());
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 2, (LPARAM)part3.c_str());
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 3, (LPARAM)part4.c_str());
    SendMessageW(g_hStatusBar, SB_SETTEXTW, 4, (LPARAM)part5.c_str());
}

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

void DoFileSave(HWND hwnd, bool saveAs) {
    CommitInlineEdits();
    if (g_currentFilePath.empty() || saveAs) {
        wchar_t szFile[MAX_PATH] = L"Presentation1.gkinetic";
        OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
        ofn.hwndOwner = hwnd;
        ofn.lpstrFilter = L"Giri Kinetic Presentation (*.gkinetic)\0*.gkinetic\0Universal Sovereign File (*.giri)\0*.giri\0All Files (*.*)\0*.*\0";
        ofn.lpstrFile = szFile;
        ofn.nMaxFile = MAX_PATH;
        ofn.Flags = OFN_OVERWRITEPROMPT;
        ofn.lpstrDefExt = L"gkinetic";
        if (!GetSaveFileNameW(&ofn)) return;
        g_currentFilePath = szFile;
    }

    // Serialize slides
    std::string content = "";
    for (size_t i = 0; i < g_slides.size(); ++i) {
        content += "[SLIDE]\n";
        // Convert wstring to UTF-8
        int sTitle = WideCharToMultiByte(CP_UTF8, 0, g_slides[i].title.c_str(), -1, NULL, 0, NULL, NULL);
        std::string uTitle(sTitle, '\0');
        WideCharToMultiByte(CP_UTF8, 0, g_slides[i].title.c_str(), -1, &uTitle[0], sTitle, NULL, NULL);

        int sBody = WideCharToMultiByte(CP_UTF8, 0, g_slides[i].body.c_str(), -1, NULL, 0, NULL, NULL);
        std::string uBody(sBody, '\0');
        WideCharToMultiByte(CP_UTF8, 0, g_slides[i].body.c_str(), -1, &uBody[0], sBody, NULL, NULL);

        content += "TITLE: " + uTitle + "\n";
        content += "BODY: " + uBody + "\n";
        content += "LAYOUT: " + std::to_string((int)g_slides[i].layout) + "\n";
    }

    if (SaveUniversalGiriFile(g_currentFilePath, L"kinetic", g_slides[g_currentSlide].title, content)) {
        RecordRecentDoc(g_currentFilePath);
        std::wstring title = PathFindFileNameW(g_currentFilePath.c_str());
        title += L" — Giri Kinetic (PowerPoint Studio)";
        SetWindowTextW(g_hMainWnd, title.c_str());
        MessageBoxW(hwnd, L"Presentation saved successfully in sovereign native format!", L"Giri Kinetic", MB_OK | MB_ICONINFORMATION);
    }
}

void DoFileOpen(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Giri Kinetic Presentations (*.gkinetic;*.giri)\0*.gkinetic;*.giri\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST;
    if (GetOpenFileNameW(&ofn)) {
        std::string content, toolType;
        if (LoadUniversalGiriFile(szFile, content, toolType)) {
            g_currentFilePath = szFile;
            RecordRecentDoc(szFile);
            std::wstring title = PathFindFileNameW(szFile);
            title += L" — Giri Kinetic (PowerPoint Studio)";
            SetWindowTextW(g_hMainWnd, title.c_str());
            InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            SyncControlsWithSlide();
            UpdateStatusBar();
        }
    }
}

// -------------------------------------------------------------
// Button Styling Subclass
// -------------------------------------------------------------
struct BtnData {
    bool isPrimary;
    bool isHover;
    WNDPROC oldProc;
};

LRESULT CALLBACK RibbonBtnSubclass(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    BtnData* bd = (BtnData*)GetPropW(hwnd, L"BtnData");
    if (!bd) return DefWindowProcW(hwnd, uMsg, wParam, lParam);

    switch (uMsg) {
    case WM_MOUSEMOVE:
        if (!bd->isHover) {
            bd->isHover = true;
            InvalidateRect(hwnd, NULL, FALSE);
            TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
            TrackMouseEvent(&tme);
        }
        break;

    case WM_MOUSELEAVE:
        bd->isHover = false;
        InvalidateRect(hwnd, NULL, FALSE);
        break;

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);

        COLORREF bg, border, textColor;
        if (bd->isPrimary) {
            bg = bd->isHover ? PPT_ORANGE_HOVER : PPT_ORANGE;
            border = bg;
            textColor = RGB(255, 255, 255);
        } else {
            bg = bd->isHover ? RGB(241, 245, 249) : RGB(255, 255, 255);
            border = bd->isHover ? RGB(203, 213, 225) : RGB(226, 232, 240);
            textColor = RGB(15, 23, 42);
        }

        HBRUSH hBr = CreateSolidBrush(bg);
        FillRect(hdc, &rc, hBr);
        DeleteObject(hBr);

        HPEN hPen = CreatePen(PS_SOLID, 1, border);
        HPEN oldPen = (HPEN)SelectObject(hdc, hPen);
        SelectObject(hdc, GetStockObject(NULL_BRUSH));
        RoundRect(hdc, rc.left, rc.top, rc.right, rc.bottom, 4, 4);
        SelectObject(hdc, oldPen);
        DeleteObject(hPen);

        wchar_t text[128] = { 0 };
        GetWindowTextW(hwnd, text, 128);
        SetBkMode(hdc, TRANSPARENT);
        SetTextColor(hdc, textColor);

        HFONT hFont = (HFONT)SendMessageW(hwnd, WM_GETFONT, 0, 0);
        HFONT oldFont = (HFONT)SelectObject(hdc, hFont);
        DrawTextW(hdc, text, -1, &rc, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
        SelectObject(hdc, oldFont);

        EndPaint(hwnd, &ps);
        return 0;
    }
    }
    return CallWindowProcW(bd->oldProc, hwnd, uMsg, wParam, lParam);
}

void StyleRibbonButton(HWND btn, bool isPrimary) {
    BtnData* bd = new BtnData();
    bd->isPrimary = isPrimary;
    bd->isHover = false;
    bd->oldProc = (WNDPROC)GetWindowLongPtrW(btn, GWLP_WNDPROC);
    SetPropW(btn, L"BtnData", (HANDLE)bd);
    SetWindowLongPtrW(btn, GWLP_WNDPROC, (LONG_PTR)RibbonBtnSubclass);
}

// -------------------------------------------------------------
// Main Window Procedure
// -------------------------------------------------------------
LRESULT CALLBACK MainWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_ERASEBKGND:
        return 1;

    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);

        if (g_kineticState == KINETIC_VIEW_START) {
            ShowWindow(g_hRibbonWnd, SW_HIDE);
            ShowWindow(g_hThumbRailWnd, SW_HIDE);
            ShowWindow(g_hCanvasWnd, SW_HIDE);
            ShowWindow(g_hEditTitle, SW_HIDE);
            ShowWindow(g_hEditBody, SW_HIDE);
            ShowWindow(g_hStatusBar, SW_HIDE);
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        }

        if (g_hRibbonWnd) MoveWindow(g_hRibbonWnd, 0, 0, w, 105, TRUE);

        int bodyY = 105;
        int statusH = 24;
        int editH = 75;
        int centerH = h - bodyY - statusH - editH;

        int railW = 210;
        int canvasW = w - railW;

        if (g_hThumbRailWnd) MoveWindow(g_hThumbRailWnd, 0, bodyY, railW, centerH, TRUE);
        if (g_hCanvasWnd) MoveWindow(g_hCanvasWnd, railW, bodyY, canvasW, centerH, TRUE);

        // Edit Title and Body below canvas
        int editY = bodyY + centerH + 8;
        if (g_hEditTitle) MoveWindow(g_hEditTitle, railW + 16, editY, (canvasW - 40) / 2, 28, TRUE);
        if (g_hEditBody) MoveWindow(g_hEditBody, railW + 24 + (canvasW - 40) / 2, editY, (canvasW - 40) / 2, 54, TRUE);

        if (g_hStatusBar) {
            SendMessageW(g_hStatusBar, WM_SIZE, wParam, lParam);
            int statwidths[] = { 180, 480, 780, 980, -1 };
            SendMessageW(g_hStatusBar, SB_SETPARTS, 5, (LPARAM)statwidths);
        }
        return 0;
    }

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rc;
        GetClientRect(hwnd, &rc);
        int w = rc.right;
        int h = rc.bottom;

        if (g_kineticState == KINETIC_VIEW_START) {
            HDC memDC = CreateCompatibleDC(hdc);
            HBITMAP memBM = CreateCompatibleBitmap(hdc, w, h);
            HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

            Graphics g(memDC);
            g.SetSmoothingMode(SmoothingModeAntiAlias);
            GiriOrbit::RenderStartInterface(g, w, h, g_kineticConfig, g_kineticStartState);

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

        if (g_kineticState == KINETIC_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_kineticConfig, g_kineticStartState);

            switch (hit.action) {
            case GiriOrbit::ACTION_CREATE_BLANK:
                EnterKineticSlidesBlank(hwnd);
                break;
            case GiriOrbit::ACTION_UPLOAD_FILE:
                DoFileOpen(hwnd);
                if (g_currentFilePath.length() > 0) {
                    EnterKineticSlides(hwnd);
                }
                break;
            case GiriOrbit::ACTION_CUSTOM_TEMPLATE:
                LoadKineticTemplate(hwnd, 0);
                break;
            case GiriOrbit::ACTION_IMPORT_TEMPLATE:
                DoFileOpen(hwnd);
                break;
            case GiriOrbit::ACTION_RESUME_DRAFT:
                EnterKineticSlides(hwnd);
                break;
            case GiriOrbit::ACTION_DELETE_DRAFT:
                InitDefaultSlides();
                g_kineticStartState.ShowToast(L"Draft presentation reset.");
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
                GiriOrbit::LaunchAppOrSwitch(hwnd, L"GiriAxis.exe");
                break;
            case GiriOrbit::ACTION_SWITCH_KINETIC:
                break;
            case GiriOrbit::ACTION_OPEN_PDF:
                GiriOrbit::OpenWebUrl(hwnd, L"https://giri-orbit.pages.dev/#pdf");
                break;
            case GiriOrbit::ACTION_COPY_LINK:
                GiriOrbit::CopyToolLink(hwnd, L"kinetic", g_kineticStartState);
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_CATEGORY:
                g_kineticStartState.selectedCategory = hit.index;
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_TEMPLATE:
                LoadKineticTemplate(hwnd, hit.index);
                break;
            default:
                break;
            }
            return 0;
        }
        break;
    }

    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);
        if (g_kineticState == KINETIC_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_kineticConfig, g_kineticStartState);
            int newHover = (hit.action != GiriOrbit::ACTION_NONE) ? hit.index : -1;
            if (newHover != g_kineticStartState.hoverId) {
                g_kineticStartState.hoverId = newHover;
                InvalidateRect(hwnd, NULL, FALSE);
            }
            TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
            TrackMouseEvent(&tme);
        }
        break;
    }

    case WM_SETCURSOR: {
        if (g_kineticState == KINETIC_VIEW_START && g_kineticStartState.hoverId != -1) {
            SetCursor(LoadCursor(NULL, IDC_HAND));
            return TRUE;
        }
        break;
    }

    case WM_COMMAND: {
        int id = LOWORD(wParam);
        int code = HIWORD(wParam);

        // Inline edit updates
        if (code == EN_CHANGE) {
            if (id == IDC_EDIT_INLINE_TITLE || id == IDC_EDIT_INLINE_BODY) {
                CommitInlineEdits();
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
        }

        switch (id) {
        case ID_FILE_NEW:
        case IDC_BTN_NEW_SLIDE: {
            CommitInlineEdits();
            Slide s;
            s.title = L"New Slide";
            s.subtitle = L"Click below to add bullet points or subtitle";
            s.body = L"First strategic discussion item\nHigh-impact deliverable milestone\nNext steps and accountability schedule";
            s.layout = LAYOUT_TITLE_CONTENT;
            s.bgColor = RGB(255, 255, 255);
            s.textColor = RGB(15, 23, 42);
            s.accentColor = PPT_ORANGE;
            s.transition = TRANS_FADE;
            s.transitionSpeedMs = 400;
            s.animType = ANIM_FADE_IN;
            g_slides.push_back(s);
            g_currentSlide = (int)g_slides.size() - 1;
            SyncControlsWithSlide();
            InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            InvalidateRect(g_hCanvasWnd, NULL, FALSE);
            UpdateStatusBar();
            break;
        }

        case ID_SLIDE_DUPLICATE:
        case IDC_BTN_DUPLICATE_SLIDE: {
            if (g_currentSlide >= 0 && g_currentSlide < (int)g_slides.size()) {
                CommitInlineEdits();
                Slide dup = g_slides[g_currentSlide];
                dup.title += L" (Copy)";
                g_slides.insert(g_slides.begin() + g_currentSlide + 1, dup);
                g_currentSlide++;
                SyncControlsWithSlide();
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                UpdateStatusBar();
            }
            break;
        }

        case ID_SLIDE_DELETE:
        case IDC_BTN_DELETE_SLIDE: {
            if (g_slides.size() > 1) {
                g_slides.erase(g_slides.begin() + g_currentSlide);
                if (g_currentSlide >= (int)g_slides.size()) g_currentSlide = (int)g_slides.size() - 1;
                SyncControlsWithSlide();
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                UpdateStatusBar();
            } else {
                MessageBoxW(hwnd, L"A presentation must contain at least one slide.", L"Giri Kinetic", MB_OK | MB_ICONINFORMATION);
            }
            break;
        }

        case IDC_BTN_LAYOUT_TITLE:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].layout = LAYOUT_TITLE_HERO;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_LAYOUT_CONTENT:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].layout = LAYOUT_TITLE_CONTENT;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_LAYOUT_TWOCOL:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].layout = LAYOUT_TWO_COLUMN;
                if (g_slides[g_currentSlide].rightColText.empty()) {
                    g_slides[g_currentSlide].rightColText = L"Secondary Column Notes:\nQuantitative proof point A\nVerification vector B";
                }
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_LAYOUT_METRICS:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].layout = LAYOUT_METRICS_DASHBOARD;
                g_slides[g_currentSlide].body = L"Annual Run Rate: $12.4M\nGross Margin: 84.6%\nNet Retention: 128%\nPayback Period: 9 Mos";
                SetWindowTextW(g_hEditBody, g_slides[g_currentSlide].body.c_str());
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_THEME_CLEAN:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].bgColor = RGB(255, 255, 255);
                g_slides[g_currentSlide].textColor = RGB(15, 23, 42);
                g_slides[g_currentSlide].accentColor = PPT_ORANGE;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_THEME_DARK:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].bgColor = RGB(15, 23, 42);
                g_slides[g_currentSlide].textColor = RGB(248, 250, 252);
                g_slides[g_currentSlide].accentColor = RGB(249, 115, 22);
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_THEME_EMERALD:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].bgColor = RGB(240, 253, 244);
                g_slides[g_currentSlide].textColor = RGB(6, 78, 59);
                g_slides[g_currentSlide].accentColor = RGB(16, 185, 129);
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_THEME_SUNSET:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].bgColor = RGB(255, 241, 242);
                g_slides[g_currentSlide].textColor = RGB(136, 19, 55);
                g_slides[g_currentSlide].accentColor = RGB(225, 29, 72);
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_INSERT_DEVANAGARI:
            if (g_currentSlide < (int)g_slides.size()) {
                g_slides[g_currentSlide].title = L"गिरि ऑर्बिट प्रेजेंटेशन";
                g_slides[g_currentSlide].subtitle = L"संपूर्ण स्वायत्त ऑफिस सुइट एवं प्रेजेंटेशन स्टूडियो";
                g_slides[g_currentSlide].body = L"१००% सुरक्षित एवं ऑफलाइन आर्किटेक्चर\nतेज एवं बिना किसी रुकावट के प्रस्तुति\nअभिनव गिरि द्वारा निर्मित";
                SyncControlsWithSlide();
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;

        case IDC_BTN_BG_COLOR: {
            CHOOSECOLORW cc = { sizeof(CHOOSECOLORW) };
            static COLORREF customColors[16] = { 0 };
            cc.hwndOwner = hwnd;
            cc.lpCustColors = customColors;
            cc.Flags = CC_RGBINIT | CC_FULLOPEN;
            if (ChooseColorW(&cc)) {
                g_slides[g_currentSlide].bgColor = cc.rgbResult;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;
        }

        case IDC_BTN_TEXT_COLOR: {
            CHOOSECOLORW cc = { sizeof(CHOOSECOLORW) };
            static COLORREF customColors[16] = { 0 };
            cc.hwndOwner = hwnd;
            cc.lpCustColors = customColors;
            cc.Flags = CC_RGBINIT | CC_FULLOPEN;
            if (ChooseColorW(&cc)) {
                g_slides[g_currentSlide].textColor = cc.rgbResult;
                InvalidateRect(g_hCanvasWnd, NULL, FALSE);
                InvalidateRect(g_hThumbRailWnd, NULL, FALSE);
            }
            break;
        }

        case ID_SHOW_START:
        case IDC_BTN_PRESENT_F5:
            LaunchSlideShow(0);
            break;

        case ID_SHOW_CURRENT:
        case IDC_BTN_PRESENT_CURRENT:
            LaunchSlideShow(g_currentSlide);
            break;

        case ID_FILE_SAVE:
            DoFileSave(hwnd, false);
            break;

        case ID_FILE_SAVEAS:
            DoFileSave(hwnd, true);
            break;

        case ID_FILE_OPEN:
            DoFileOpen(hwnd);
            break;

        case ID_FILE_EXIT:
            PostMessageW(hwnd, WM_CLOSE, 0, 0);
            break;

        case ID_HELP_ABOUT:
            MessageBoxW(hwnd,
                L"Giri Kinetic — Cinematic Widescreen Presentation Studio\n"
                L"Giri Orbit Kinetic Presentation Architecture\n\n"
                L"Made by Abhinav Giri (@abhinavgiri45)\n"
                L"100% Offline Standalone Native C++ Desktop Application\n"
                L"Part of Giri Orbit Sovereign Suite\n\n"
                L"Shortcuts:\n"
                L"F5: Start Slide Show from beginning\n"
                L"Shift+F5: Start Slide Show from current slide\n"
                L"Ctrl+M: New Slide\n"
                L"Ctrl+D: Duplicate Slide\n"
                L"Del: Delete Slide\n"
                L"In Slide Show: Space / Arrow keys for navigation, L for Laser, Ctrl+Drag for Digital Pen, E to Erase ink",
                L"About Giri Kinetic", MB_OK | MB_ICONINFORMATION);
            break;
        }
        break;
    }

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, uMsg, wParam, lParam);
}
