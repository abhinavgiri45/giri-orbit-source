/* ============================================================================
 * GIRI ORBIT — COPILOT SOVEREIGN OFFICE SUITE (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Official Contact: abhinavgiri370@gmail.com
 * Proprietary Commercial Software License (All Rights Reserved)
 * 100% Offline Standalone Native C++ Win32 & GDI+ Modern Fluent Copilot UI
 * Zero Browser • Zero Webview • Zero Localhost • Independent C++ Desktop Architecture
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
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <gdiplus.h>
#include <string>
#include <vector>
#include <algorithm>

#pragma comment(lib, "gdiplus.lib")
#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "shell32.lib")

using namespace Gdiplus;

// Identifiers
#define IDC_SEARCH_EDIT 2001

HINSTANCE g_hInst = NULL;
HWND g_hWnd = NULL;
HWND g_hSearchEdit = NULL;
HICON g_hAppIcon = NULL;
std::wstring g_appDir = L"";
ULONG_PTR g_gdiToken = 0;

// View dimensions
const int LEFT_RAIL_WIDTH = 70;
const int CARD_WIDTH = 120;
const int CARD_HEIGHT = 150;
const int CARD_GAP = 14;

// Hover & Active States
enum RailItem {
    RAIL_HOME = 0,
    RAIL_COPILOT,
    RAIL_CREATE,
    RAIL_MYCONTENT,
    RAIL_APPS,
    RAIL_DRIFT,
    RAIL_AXIS,
    RAIL_KINETIC,
    RAIL_AEGIS,
    RAIL_SETTINGS,
    RAIL_PROFILE,
    RAIL_COUNT
};

int g_activeRail = RAIL_HOME;
int g_hoverRail = -1;
int g_hoverCard = -1;
int g_hoverTableRow = -1;
int g_activeFilterPill = 0; // 0=Recently opened, 1=Shared, 2=Favorites
int g_hoverFilterPill = -1;
bool g_hoverUpload = false;
bool g_isGridView = false;
std::wstring g_searchQuery = L"";

// Recent Document Struct
struct RecentDoc {
    std::wstring name;
    std::wstring type;      // "drift", "axis", "kinetic", "pdf"
    std::wstring modified;
    std::wstring location;
    std::wstring activity;
    std::wstring fullPath;
};

std::vector<RecentDoc> g_recentDocs;
std::vector<RecentDoc> g_filteredDocs;

// Forward Declarations
LRESULT CALLBACK HubWndProc(HWND, UINT, WPARAM, LPARAM);
void LaunchApp(const std::wstring& exeName, const std::wstring& args = L"");
void OpenAnyFileDialog(HWND hwnd);
void PopulateRecentDocs();
void FilterDocs(const std::wstring& query);

// Helper for GDI+ Rounded Rectangle
void AddRoundedRect(GraphicsPath& path, RectF rect, float radius) {
    float diameter = radius * 2.0f;
    float right = rect.X + rect.Width;
    float bottom = rect.Y + rect.Height;
    path.AddArc(rect.X, rect.Y, diameter, diameter, 180.0f, 90.0f);
    path.AddArc(right - diameter, rect.Y, diameter, diameter, 270.0f, 90.0f);
    path.AddArc(right - diameter, bottom - diameter, diameter, diameter, 0.0f, 90.0f);
    path.AddArc(rect.X, bottom - diameter, diameter, diameter, 90.0f, 90.0f);
    path.CloseFigure();
}

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

    // Initialize GDI+
    GdiplusStartupInput gdiInput;
    GdiplusStartup(&g_gdiToken, &gdiInput, NULL);

    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_STANDARD_CLASSES };
    InitCommonControlsEx(&icex);

    // Load App Icon
    g_hAppIcon = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 256, 256, LR_DEFAULTSIZE);
    if (!g_hAppIcon) g_hAppIcon = (HICON)LoadImageW(NULL, (g_appDir + L"\\orbit.ico").c_str(), IMAGE_ICON, 256, 256, LR_LOADFROMFILE);

    // Register Window Class
    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = HubWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wcex.lpszClassName = L"GiriOrbitCopilotHubClass";
    wcex.hIcon = g_hAppIcon;
    wcex.hIconSm = g_hAppIcon;

    if (!RegisterClassExW(&wcex)) return 0;

    PopulateRecentDocs();
    FilterDocs(L"");

    // Create Main Copilot Window (1220 x 800)
    g_hWnd = CreateWindowExW(
        WS_EX_APPWINDOW,
        L"GiriOrbitCopilotHubClass",
        L"Giri Orbit Copilot — Sovereign Office Productivity Suite",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX | WS_MAXIMIZEBOX | WS_THICKFRAME | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1220, 800,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hWnd) return 0;

    // Create Search Edit control inside pill
    HFONT hFontSearch = CreateFontW(17, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                   OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                   VARIABLE_PITCH, L"Segoe UI");

    g_hSearchEdit = CreateWindowExW(
        0, L"EDIT", L"",
        WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
        370, 117, 470, 24,
        g_hWnd, (HMENU)IDC_SEARCH_EDIT, hInstance, NULL
    );
    SendMessageW(g_hSearchEdit, WM_SETFONT, (WPARAM)hFontSearch, TRUE);
    SendMessageW(g_hSearchEdit, EM_SETCUEBANNER, TRUE, (LPARAM)L"Search for apps, files, templates and more");

    ShowWindow(g_hWnd, nCmdShow);
    UpdateWindow(g_hWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    GdiplusShutdown(g_gdiToken);
    return (int)msg.wParam;
}

std::wstring GetRecentDocsFilePath() {
    wchar_t localApp[MAX_PATH] = { 0 };
    DWORD len = ExpandEnvironmentStringsW(L"%LOCALAPPDATA%\\Giri Orbit", localApp, MAX_PATH);
    if (len > 0 && len < MAX_PATH) {
        CreateDirectoryW(localApp, NULL);
        return std::wstring(localApp) + L"\\recent_docs.txt";
    }
    return g_appDir + L"\\recent_docs.txt";
}

void AddRecentDoc(const std::wstring& fullPath) {
    if (fullPath.empty() || !PathFileExistsW(fullPath.c_str())) return;

    std::wstring recentFile = GetRecentDocsFilePath();
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
            if (l > 0) {
                std::wstring p = line;
                if (p != fullPath && PathFileExistsW(p.c_str())) {
                    existing.push_back(p);
                }
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

    PopulateRecentDocs();
    FilterDocs(g_searchQuery);
    if (g_hWnd) InvalidateRect(g_hWnd, NULL, FALSE);
}

void PopulateRecentDocs() {
    g_recentDocs.clear();

    // 100% Real User Documents Only - Zero Fake / Mock Files
    std::wstring recentFile = GetRecentDocsFilePath();
    FILE* fp = NULL;
    if (_wfopen_s(&fp, recentFile.c_str(), L"r, ccs=UTF-8") == 0 && fp) {
        wchar_t line[MAX_PATH];
        while (fgetws(line, MAX_PATH, fp)) {
            size_t l = wcslen(line);
            while (l > 0 && (line[l-1] == L'\r' || line[l-1] == L'\n' || line[l-1] == L' ')) {
                line[--l] = L'\0';
            }
            if (l > 0 && PathFileExistsW(line)) {
                std::wstring p = line;
                std::wstring ext = PathFindExtensionW(p.c_str());
                std::transform(ext.begin(), ext.end(), ext.begin(), ::towlower);

                std::wstring type = L"drift";
                if (ext == L".xlsx" || ext == L".xls" || ext == L".csv" || ext == L".gaxis") type = L"axis";
                else if (ext == L".pptx" || ext == L".ppt" || ext == L".gkinetic") type = L"kinetic";
                else if (ext == L".pdf" || ext == L".aegis") type = L"pdf";

                std::wstring name = PathFindFileNameW(p.c_str());

                std::wstring modStr = L"Recent";
                WIN32_FILE_ATTRIBUTE_DATA fad;
                if (GetFileAttributesExW(p.c_str(), GetFileExInfoStandard, &fad)) {
                    SYSTEMTIME st;
                    FileTimeToSystemTime(&fad.ftLastWriteTime, &st);
                    wchar_t buf[64];
                    swprintf_s(buf, L"%02d/%02d/%04d", st.wMonth, st.wDay, st.wYear);
                    modStr = buf;
                }

                g_recentDocs.push_back({ name, type, modStr, L"This PC", L"Opened by you", p });
            }
        }
        fclose(fp);
    }
}

void FilterDocs(const std::wstring& query) {
    g_filteredDocs.clear();
    std::wstring qLower = query;
    std::transform(qLower.begin(), qLower.end(), qLower.begin(), ::towlower);

    for (const auto& doc : g_recentDocs) {
        if (qLower.empty()) {
            g_filteredDocs.push_back(doc);
        } else {
            std::wstring nLower = doc.name;
            std::transform(nLower.begin(), nLower.end(), nLower.begin(), ::towlower);
            if (nLower.find(qLower) != std::wstring::npos) {
                g_filteredDocs.push_back(doc);
            }
        }
    }
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

    ShellExecuteW(NULL, L"open", fullPath.c_str(), args.empty() ? NULL : args.c_str(), g_appDir.c_str(), SW_SHOWNORMAL);
}

void OpenAnyFileDialog(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = { 0 };
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"All Giri Sovereign Files (*.giri;*.gdrift;*.docx;*.xlsx;*.pptx)\0*.giri;*.gdrift;*.docx;*.xlsx;*.pptx\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;

    if (GetOpenFileNameW(&ofn)) {
        std::wstring path = szFile;
        AddRecentDoc(path);
        std::wstring ext = PathFindExtensionW(path.c_str());
        std::transform(ext.begin(), ext.end(), ext.begin(), ::towlower);

        if (ext == L".xlsx" || ext == L".csv") {
            LaunchApp(L"GiriAxis.exe", L"\"" + path + L"\"");
        } else if (ext == L".pptx") {
            LaunchApp(L"GiriKinetic.exe", L"\"" + path + L"\"");
        } else {
            LaunchApp(L"GiriDrift.exe", L"\"" + path + L"\"");
        }
    }
}

// Render Left Navigation Rail
void RenderLeftRail(Graphics& g, int w, int h) {
    // Background
    SolidBrush railBg(Color(255, 255, 255));
    g.FillRectangle(&railBg, 0, 0, LEFT_RAIL_WIDTH, h);

    // Right border line
    Pen borderPen(Color(229, 231, 235), 1.0f);
    g.DrawLine(&borderPen, LEFT_RAIL_WIDTH - 1, 0, LEFT_RAIL_WIDTH - 1, h);

    Font fontLabel(L"Segoe UI", 8.0f, FontStyleRegular, UnitPoint);
    Font fontProfile(L"Segoe UI", 10.0f, FontStyleBold, UnitPoint);
    StringFormat sf;
    sf.SetAlignment(StringAlignmentCenter);
    sf.SetLineAlignment(StringAlignmentCenter);

    // Navigation Items
    struct RailDef {
        int id;
        const wchar_t* label;
        Color activeColor;
        Color iconBg;
    };

    RailDef railItems[] = {
        { RAIL_HOME, L"Home", Color(79, 70, 229), Color(238, 242, 255) },
        { RAIL_COPILOT, L"Copilot", Color(124, 58, 237), Color(245, 243, 255) },
        { RAIL_CREATE, L"Create", Color(75, 85, 99), Color(243, 244, 246) },
        { RAIL_MYCONTENT, L"My Content", Color(75, 85, 99), Color(243, 244, 246) },
        { RAIL_APPS, L"Apps", Color(75, 85, 99), Color(243, 244, 246) },
        { -1, L"", Color(0,0,0), Color(0,0,0) }, // divider
        { RAIL_DRIFT, L"Word", Color(37, 99, 235), Color(239, 246, 255) },
        { RAIL_AXIS, L"Excel", Color(22, 163, 74), Color(240, 253, 244) },
        { RAIL_KINETIC, L"PowerPoint", Color(234, 88, 12), Color(255, 247, 237) },
        { RAIL_AEGIS, L"PDF", Color(220, 38, 38), Color(254, 242, 242) }
    };

    int y = 14;
    for (const auto& item : railItems) {
        if (item.id == -1) {
            // Divider
            Pen divPen(Color(229, 231, 235), 1.0f);
            g.DrawLine(&divPen, 16, y + 6, LEFT_RAIL_WIDTH - 16, y + 6);
            y += 16;
            continue;
        }

        bool isActive = (g_activeRail == item.id);
        bool isHover = (g_hoverRail == item.id);

        RectF itemRect(8.0f, (float)y, (float)LEFT_RAIL_WIDTH - 16.0f, 48.0f);

        if (isActive) {
            GraphicsPath path;
            AddRoundedRect(path, itemRect, 8.0f);
            SolidBrush activeBrush(Color(238, 242, 255));
            g.FillPath(&activeBrush, &path);
            Pen activeBorder(Color(199, 210, 254), 1.0f);
            g.DrawPath(&activeBorder, &path);
        } else if (isHover) {
            GraphicsPath path;
            AddRoundedRect(path, itemRect, 8.0f);
            SolidBrush hoverBrush(Color(248, 250, 252));
            g.FillPath(&hoverBrush, &path);
        }

        // Draw Icon representation
        int iconCx = LEFT_RAIL_WIDTH / 2;
        int iconCy = y + 16;

        if (item.id == RAIL_HOME) {
            SolidBrush b(isActive ? Color(79, 70, 229) : Color(107, 114, 128));
            Point pts[3] = { Point(iconCx, iconCy - 9), Point(iconCx - 9, iconCy), Point(iconCx + 9, iconCy) };
            g.FillPolygon(&b, pts, 3);
            g.FillRectangle(&b, iconCx - 6, iconCy, 12, 8);
        } else if (item.id == RAIL_COPILOT) {
            SolidBrush b(Color(124, 58, 237));
            Point pts[4] = { Point(iconCx, iconCy - 10), Point(iconCx + 4, iconCy), Point(iconCx, iconCy + 10), Point(iconCx - 4, iconCy) };
            g.FillPolygon(&b, pts, 4);
            Point pts2[4] = { Point(iconCx - 10, iconCy), Point(iconCx, iconCy + 4), Point(iconCx + 10, iconCy), Point(iconCx, iconCy - 4) };
            g.FillPolygon(&b, pts2, 4);
        } else if (item.id == RAIL_CREATE) {
            Pen p(Color(107, 114, 128), 2.0f);
            g.DrawLine(&p, iconCx - 7, iconCy, iconCx + 7, iconCy);
            g.DrawLine(&p, iconCx, iconCy - 7, iconCx, iconCy + 7);
        } else if (item.id == RAIL_MYCONTENT) {
            SolidBrush b(Color(107, 114, 128));
            g.FillRectangle(&b, iconCx - 8, iconCy - 5, 16, 12);
            g.FillRectangle(&b, iconCx - 8, iconCy - 8, 8, 4);
        } else if (item.id == RAIL_APPS) {
            SolidBrush b(Color(107, 114, 128));
            g.FillRectangle(&b, iconCx - 7, iconCy - 7, 5, 5);
            g.FillRectangle(&b, iconCx + 2, iconCy - 7, 5, 5);
            g.FillRectangle(&b, iconCx - 7, iconCy + 2, 5, 5);
            g.FillRectangle(&b, iconCx + 2, iconCy + 2, 5, 5);
        } else if (item.id == RAIL_DRIFT) {
            // Word blue tile
            GraphicsPath p;
            AddRoundedRect(p, RectF((float)iconCx - 9, (float)iconCy - 9, 18, 18), 3.0f);
            SolidBrush b(Color(37, 99, 235));
            g.FillPath(&b, &p);
            Font f(L"Segoe UI", 8.0f, FontStyleBold, UnitPoint);
            SolidBrush wb(Color(255, 255, 255));
            g.DrawString(L"W", -1, &f, PointF((float)iconCx, (float)iconCy - 1), &sf, &wb);
        } else if (item.id == RAIL_AXIS) {
            // Excel green tile
            GraphicsPath p;
            AddRoundedRect(p, RectF((float)iconCx - 9, (float)iconCy - 9, 18, 18), 3.0f);
            SolidBrush b(Color(22, 163, 74));
            g.FillPath(&b, &p);
            Font f(L"Segoe UI", 8.0f, FontStyleBold, UnitPoint);
            SolidBrush wb(Color(255, 255, 255));
            g.DrawString(L"X", -1, &f, PointF((float)iconCx, (float)iconCy - 1), &sf, &wb);
        } else if (item.id == RAIL_KINETIC) {
            // PowerPoint orange tile
            GraphicsPath p;
            AddRoundedRect(p, RectF((float)iconCx - 9, (float)iconCy - 9, 18, 18), 3.0f);
            SolidBrush b(Color(234, 88, 12));
            g.FillPath(&b, &p);
            Font f(L"Segoe UI", 8.0f, FontStyleBold, UnitPoint);
            SolidBrush wb(Color(255, 255, 255));
            g.DrawString(L"P", -1, &f, PointF((float)iconCx, (float)iconCy - 1), &sf, &wb);
        } else if (item.id == RAIL_AEGIS) {
            // PDF red tile
            GraphicsPath p;
            AddRoundedRect(p, RectF((float)iconCx - 9, (float)iconCy - 9, 18, 18), 3.0f);
            SolidBrush b(Color(220, 38, 38));
            g.FillPath(&b, &p);
            Font f(L"Segoe UI", 7.5f, FontStyleBold, UnitPoint);
            SolidBrush wb(Color(255, 255, 255));
            g.DrawString(L"PDF", -1, &f, PointF((float)iconCx, (float)iconCy - 1), &sf, &wb);
        }

        // Label
        SolidBrush textBrush(isActive ? item.activeColor : Color(107, 114, 128));
        RectF textRect(0.0f, (float)y + 30.0f, (float)LEFT_RAIL_WIDTH, 14.0f);
        g.DrawString(item.label, -1, &fontLabel, textRect, &sf, &textBrush);

        y += 54;
    }

    // Bottom Items: Settings & Profile Avatar
    int bottomY = h - 100;
    // Settings
    int sCx = LEFT_RAIL_WIDTH / 2;
    int sCy = bottomY + 12;
    Pen sp(Color(107, 114, 128), 1.8f);
    g.DrawEllipse(&sp, sCx - 7, sCy - 7, 14, 14);
    SolidBrush sb(Color(107, 114, 128));
    g.FillEllipse(&sb, sCx - 3, sCy - 3, 6, 6);
    RectF stTextRect(0.0f, (float)bottomY + 22.0f, (float)LEFT_RAIL_WIDTH, 14.0f);
    g.DrawString(L"Settings", -1, &fontLabel, stTextRect, &sf, &sb);

    // Profile Avatar (AG)
    int pCy = bottomY + 54;
    SolidBrush profBg(Color(37, 99, 235));
    g.FillEllipse(&profBg, sCx - 16, pCy - 16, 32, 32);
    SolidBrush profText(Color(255, 255, 255));
    g.DrawString(L"AG", -1, &fontProfile, PointF((float)sCx, (float)pCy), &sf, &profText);
}

// Render "Create New" Card
void RenderCreateCard(Graphics& g, int x, int y, int index, bool isHover) {
    float fx = (float)x;
    float fy = (float)(isHover ? y - 3 : y);
    RectF cardRect(fx, fy, (float)CARD_WIDTH, (float)CARD_HEIGHT);

    // Drop shadow on hover
    if (isHover) {
        GraphicsPath shPath;
        AddRoundedRect(shPath, RectF(fx, fy + 4, (float)CARD_WIDTH, (float)CARD_HEIGHT), 10.0f);
        SolidBrush shBrush(Color(25, 0, 0, 0));
        g.FillPath(&shBrush, &shPath);
    }

    // Card background
    GraphicsPath cardPath;
    AddRoundedRect(cardPath, cardRect, 10.0f);
    SolidBrush cardBg(Color(255, 255, 255));
    g.FillPath(&cardBg, &cardPath);

    Pen borderPen(isHover ? Color(99, 102, 241) : Color(229, 231, 235), isHover ? 1.5f : 1.0f);
    g.DrawPath(&borderPen, &cardPath);

    // Card Interior Preview Illustration
    float previewW = (float)CARD_WIDTH - 24.0f;
    float previewH = 76.0f;
    float px = fx + 12.0f;
    float py = fy + 12.0f;

    // Background preview plate
    GraphicsPath prevPlate;
    AddRoundedRect(prevPlate, RectF(px, py, previewW, previewH), 6.0f);
    SolidBrush plateBg(Color(248, 250, 252));
    g.FillPath(&plateBg, &prevPlate);

    // Card Types
    struct CardMeta {
        const wchar_t* title;
        const wchar_t* sub;
        Color badgeColor;
        const wchar_t* badgeChar;
    };

    CardMeta metas[] = {
        { L"Document", L"Drift", Color(37, 99, 235), L"D" },
        { L"Presentation", L"Kinetic", Color(234, 88, 12), L"K" },
        { L"Workbook", L"Axis", Color(22, 163, 74), L"A" },
        { L"Form", L"Forms", Color(13, 148, 136), L"F" },
        { L"Quiz", L"Quiz", Color(8, 145, 178), L"Q" },
        { L"List", L"Lists", Color(124, 58, 237), L"L" },
        { L"Design", L"Designer", Color(219, 39, 119), L"G" }
    };

    if (index >= 0 && index < 7) {
        const auto& m = metas[index];

        if (index == 0) {
            // Document (Drift) preview
            GraphicsPath docSheet;
            AddRoundedRect(docSheet, RectF(px + 18, py + 8, previewW - 36, previewH - 16), 3.0f);
            SolidBrush whiteBrush(Color(255, 255, 255));
            g.FillPath(&whiteBrush, &docSheet);
            Pen shBorder(Color(226, 232, 240), 1.0f);
            g.DrawPath(&shBorder, &docSheet);

            // Blue header block on sheet
            SolidBrush bHeader(Color(37, 99, 235));
            g.FillRectangle(&bHeader, px + 24, py + 14, previewW - 48, 6.0f);

            // Gray text lines
            SolidBrush bLines(Color(203, 213, 225));
            g.FillRectangle(&bLines, px + 24, py + 24, previewW - 48, 3.0f);
            g.FillRectangle(&bLines, px + 24, py + 30, previewW - 48, 3.0f);
            g.FillRectangle(&bLines, px + 24, py + 36, previewW - 60, 3.0f);
        } else if (index == 1) {
            // Presentation (Kinetic) preview
            GraphicsPath slideBox;
            AddRoundedRect(slideBox, RectF(px + 12, py + 12, previewW - 24, previewH - 24), 3.0f);
            SolidBrush sBg(Color(255, 255, 255));
            g.FillPath(&sBg, &slideBox);

            SolidBrush corHeader(Color(254, 215, 170));
            g.FillRectangle(&corHeader, px + 16, py + 16, previewW - 32, 6.0f);

            SolidBrush corCol1(Color(254, 243, 199));
            g.FillRectangle(&corCol1, px + 16, py + 26, (previewW - 36) / 2, 18.0f);
            SolidBrush corCol2(Color(255, 237, 213));
            g.FillRectangle(&corCol2, px + 18 + (previewW - 36) / 2, py + 26, (previewW - 36) / 2, 18.0f);
        } else if (index == 2) {
            // Workbook (Axis) preview
            GraphicsPath sheetBox;
            AddRoundedRect(sheetBox, RectF(px + 14, py + 10, previewW - 28, previewH - 20), 3.0f);
            SolidBrush sBg(Color(255, 255, 255));
            g.FillPath(&sBg, &sheetBox);

            SolidBrush gHead(Color(187, 247, 208));
            g.FillRectangle(&gHead, px + 16, py + 12, previewW - 32, 6.0f);

            Pen gGrid(Color(226, 232, 240), 1.0f);
            for (int r = 0; r < 4; r++) {
                float gy = py + 22.0f + r * 7.0f;
                g.DrawLine(&gGrid, px + 16, gy, px + previewW - 16, gy);
            }
            g.DrawLine(&gGrid, px + 16 + (previewW - 32) * 0.33f, py + 18, px + 16 + (previewW - 32) * 0.33f, py + 48);
            g.DrawLine(&gGrid, px + 16 + (previewW - 32) * 0.66f, py + 18, px + 16 + (previewW - 32) * 0.66f, py + 48);
        } else if (index == 3 || index == 4) {
            // Form / Quiz preview
            SolidBrush fHead(index == 3 ? Color(13, 148, 136) : Color(8, 145, 178));
            g.FillRectangle(&fHead, px + 18, py + 14, previewW - 36, 6.0f);

            SolidBrush dotCol(Color(203, 213, 225));
            g.FillEllipse(&dotCol, px + 18, py + 26, 6.0f, 6.0f);
            g.FillRectangle(&dotCol, px + 28, py + 27, previewW - 50, 4.0f);

            g.FillEllipse(&dotCol, px + 18, py + 36, 6.0f, 6.0f);
            g.FillRectangle(&dotCol, px + 28, py + 37, previewW - 50, 4.0f);
        } else if (index == 5) {
            // List preview
            SolidBrush lHead(Color(124, 58, 237));
            g.FillRectangle(&lHead, px + 18, py + 14, previewW - 36, 6.0f);
            SolidBrush lRow1(Color(243, 232, 255));
            g.FillRectangle(&lRow1, px + 18, py + 24, previewW - 36, 6.0f);
            SolidBrush lRow2(Color(248, 250, 252));
            g.FillRectangle(&lRow2, px + 18, py + 32, previewW - 36, 6.0f);
        } else {
            // Design preview (Abstract shapes)
            SolidBrush dCir(Color(244, 114, 182));
            g.FillEllipse(&dCir, px + 18, py + 14, 22.0f, 22.0f);
            SolidBrush dRect(Color(192, 132, 252));
            g.FillRectangle(&dRect, px + 44, py + 18, 18.0f, 18.0f);
        }

        // App badge inside preview
        GraphicsPath bPath;
        AddRoundedRect(bPath, RectF(px + 4, py + previewH - 18, 16, 16), 3.0f);
        SolidBrush bBrush(m.badgeColor);
        g.FillPath(&bBrush, &bPath);
        Font bFont(L"Segoe UI", 7.0f, FontStyleBold, UnitPoint);
        SolidBrush wb(Color(255, 255, 255));
        StringFormat bSf;
        bSf.SetAlignment(StringAlignmentCenter);
        bSf.SetLineAlignment(StringAlignmentCenter);
        g.DrawString(m.badgeChar, -1, &bFont, PointF(px + 12, py + previewH - 10), &bSf, &wb);

        // Text Labels below preview
        Font fTitle(L"Segoe UI", 9.5f, FontStyleBold, UnitPoint);
        Font fSub(L"Segoe UI", 8.0f, FontStyleRegular, UnitPoint);
        SolidBrush titleBrush(Color(31, 41, 55));
        SolidBrush subBrush(Color(107, 114, 128));

        g.DrawString(m.title, -1, &fTitle, PointF(fx + 12.0f, fy + previewH + 20.0f), &titleBrush);
        g.DrawString(m.sub, -1, &fSub, PointF(fx + 12.0f, fy + previewH + 36.0f), &subBrush);
    }
}

// Render Quick Access Table
void RenderQuickAccess(Graphics& g, int contentX, int startY, int w) {
    Font fSection(L"Segoe UI", 12.5f, FontStyleBold, UnitPoint);
    Font fPill(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
    Font fTh(L"Segoe UI", 8.5f, FontStyleBold, UnitPoint);
    Font fTd(L"Segoe UI", 9.5f, FontStyleRegular, UnitPoint);
    Font fTdBold(L"Segoe UI", 9.5f, FontStyleBold, UnitPoint);
    Font fTdSub(L"Segoe UI", 8.5f, FontStyleRegular, UnitPoint);

    SolidBrush textDark(Color(31, 41, 55));
    SolidBrush textMuted(Color(107, 114, 128));

    // Section Title
    g.DrawString(L"Quick access", -1, &fSection, PointF((float)contentX, (float)startY), &textDark);

    // Filter Pills Bar
    int pillY = startY + 34;
    int pillX = contentX;

    const wchar_t* pills[] = { L"🕒 Recently opened", L"👥 Shared", L"★ Favorites" };
    for (int i = 0; i < 3; i++) {
        bool isActive = (g_activeFilterPill == i);
        bool isHover = (g_hoverFilterPill == i);

        int pillW = (i == 0) ? 140 : (i == 1 ? 84 : 96);
        RectF pRect((float)pillX, (float)pillY, (float)pillW, 30.0f);

        GraphicsPath pPath;
        AddRoundedRect(pPath, pRect, 15.0f);

        if (isActive) {
            SolidBrush darkBg(Color(15, 23, 42));
            g.FillPath(&darkBg, &pPath);
            SolidBrush wt(Color(255, 255, 255));
            StringFormat sf;
            sf.SetAlignment(StringAlignmentCenter);
            sf.SetLineAlignment(StringAlignmentCenter);
            g.DrawString(pills[i], -1, &fPill, PointF((float)pillX + pillW / 2.0f, (float)pillY + 15.0f), &sf, &wt);
        } else {
            SolidBrush pBg(isHover ? Color(241, 245, 249) : Color(255, 255, 255));
            g.FillPath(&pBg, &pPath);
            Pen bPen(Color(226, 232, 240), 1.0f);
            g.DrawPath(&bPen, &pPath);

            SolidBrush gt(Color(71, 85, 105));
            StringFormat sf;
            sf.SetAlignment(StringAlignmentCenter);
            sf.SetLineAlignment(StringAlignmentCenter);
            g.DrawString(pills[i], -1, &fPill, PointF((float)pillX + pillW / 2.0f, (float)pillY + 15.0f), &sf, &gt);
        }

        pillX += pillW + 10;
    }

    // Right Controls: Upload Button & View Toggles
    int rightControlsX = w - 160;
    RectF upRect((float)rightControlsX, (float)pillY, 86.0f, 30.0f);
    GraphicsPath upPath;
    AddRoundedRect(upPath, upRect, 6.0f);
    SolidBrush upBg(g_hoverUpload ? Color(241, 245, 249) : Color(255, 255, 255));
    g.FillPath(&upBg, &upPath);
    Pen upPen(Color(209, 213, 219), 1.0f);
    g.DrawPath(&upPen, &upPath);

    StringFormat upSf;
    upSf.SetAlignment(StringAlignmentCenter);
    upSf.SetLineAlignment(StringAlignmentCenter);
    SolidBrush upText(Color(31, 41, 55));
    g.DrawString(L"↑ Upload", -1, &fPill, PointF((float)rightControlsX + 43.0f, (float)pillY + 15.0f), &upSf, &upText);

    // List & Grid icons
    int iconX = rightControlsX + 98;
    Pen vPen(Color(107, 114, 128), 1.5f);
    // List icon
    g.DrawLine(&vPen, iconX, pillY + 8, iconX + 14, pillY + 8);
    g.DrawLine(&vPen, iconX, pillY + 14, iconX + 14, pillY + 14);
    g.DrawLine(&vPen, iconX, pillY + 20, iconX + 14, pillY + 20);

    // Grid icon
    int gX = iconX + 22;
    g.DrawRectangle(&vPen, gX, pillY + 8, 5, 5);
    g.DrawRectangle(&vPen, gX + 8, pillY + 8, 5, 5);
    g.DrawRectangle(&vPen, gX, pillY + 16, 5, 5);
    g.DrawRectangle(&vPen, gX + 8, pillY + 16, 5, 5);

    // If NO real documents exist: display the modern empty state card
    if (g_filteredDocs.empty()) {
        int emptyY = pillY + 44;
        int emptyW = w - contentX - 40;
        int emptyH = 190;

        GraphicsPath emptyCard;
        AddRoundedRect(emptyCard, RectF((float)contentX, (float)emptyY, (float)emptyW, (float)emptyH), 8.0f);
        SolidBrush emptyBg(Color(250, 250, 252));
        g.FillPath(&emptyBg, &emptyCard);

        Pen emptyBorder(Color(226, 232, 240), 1.0f);
        emptyBorder.SetDashStyle(DashStyleDash);
        g.DrawPath(&emptyBorder, &emptyCard);

        StringFormat sfCenter;
        sfCenter.SetAlignment(StringAlignmentCenter);
        sfCenter.SetLineAlignment(StringAlignmentCenter);

        Font fIcon(L"Segoe UI", 24.0f, FontStyleRegular, UnitPoint);
        SolidBrush iconBrush(Color(156, 163, 175));
        g.DrawString(L"[ - ]", -1, &fIcon, PointF((float)contentX + emptyW / 2.0f, (float)emptyY + 36.0f), &sfCenter, &iconBrush);

        Font fEmptyTitle(L"Segoe UI", 12.0f, FontStyleBold, UnitPoint);
        SolidBrush textTitle(Color(55, 65, 81));
        g.DrawString(L"No documents yet", -1, &fEmptyTitle, PointF((float)contentX + emptyW / 2.0f, (float)emptyY + 78.0f), &sfCenter, &textTitle);

        Font fEmptySub(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
        SolidBrush textSub(Color(107, 114, 128));
        g.DrawString(L"Files you create, open, or save will appear here automatically.", -1, &fEmptySub, PointF((float)contentX + emptyW / 2.0f, (float)emptyY + 106.0f), &sfCenter, &textSub);
        g.DrawString(L"All files remain 100% private, sovereign, and saved locally on your device.", -1, &fEmptySub, PointF((float)contentX + emptyW / 2.0f, (float)emptyY + 124.0f), &sfCenter, &textSub);

        Font fHint(L"Segoe UI", 8.5f, FontStyleBold, UnitPoint);
        SolidBrush textHint(Color(37, 99, 235));
        g.DrawString(L"Click \"+ Document\", \"+ Presentation\", or \"+ Workbook\" above to get started", -1, &fHint, PointF((float)contentX + emptyW / 2.0f, (float)emptyY + 152.0f), &sfCenter, &textHint);
        return;
    }

    // Table Header
    int tableY = pillY + 44;
    int tableW = w - contentX - 40;

    g.DrawString(L"Name", -1, &fTh, PointF((float)contentX + 36.0f, (float)tableY), &textMuted);
    g.DrawString(L"Date modified", -1, &fTh, PointF((float)contentX + tableW * 0.52f, (float)tableY), &textMuted);
    g.DrawString(L"Location", -1, &fTh, PointF((float)contentX + tableW * 0.72f, (float)tableY), &textMuted);
    g.DrawString(L"Activity", -1, &fTh, PointF((float)contentX + tableW * 0.86f, (float)tableY), &textMuted);

    Pen thDivPen(Color(241, 245, 249), 1.0f);
    g.DrawLine(&thDivPen, contentX, tableY + 20, contentX + tableW, tableY + 20);

    // Table Rows
    int rowY = tableY + 24;
    int rowH = 40;

    for (size_t i = 0; i < g_filteredDocs.size(); i++) {
        const auto& doc = g_filteredDocs[i];
        bool isHover = ((int)i == g_hoverTableRow);

        if (isHover) {
            GraphicsPath rowPath;
            AddRoundedRect(rowPath, RectF((float)contentX, (float)rowY, (float)tableW, (float)rowH), 6.0f);
            SolidBrush rowHoverBg(Color(248, 250, 252));
            g.FillPath(&rowHoverBg, &rowPath);
        }

        // App file icon
        int icX = contentX + 8;
        int icY = rowY + 10;
        GraphicsPath ip;
        AddRoundedRect(ip, RectF((float)icX, (float)icY, 20.0f, 20.0f), 3.0f);

        Color bColor = Color(37, 99, 235);
        const wchar_t* ch = L"D";
        if (doc.type == L"axis") { bColor = Color(22, 163, 74); ch = L"A"; }
        else if (doc.type == L"kinetic") { bColor = Color(234, 88, 12); ch = L"K"; }
        else if (doc.type == L"pdf") { bColor = Color(220, 38, 38); ch = L"P"; }

        SolidBrush ib(bColor);
        g.FillPath(&ib, &ip);
        Font fSmall(L"Segoe UI", 7.5f, FontStyleBold, UnitPoint);
        SolidBrush wb(Color(255, 255, 255));
        StringFormat sf;
        sf.SetAlignment(StringAlignmentCenter);
        sf.SetLineAlignment(StringAlignmentCenter);
        g.DrawString(ch, -1, &fSmall, PointF((float)icX + 10.0f, (float)icY + 10.0f), &sf, &wb);

        // Document Name
        g.DrawString(doc.name.c_str(), -1, &fTdBold, PointF((float)contentX + 38.0f, (float)rowY + 10.0f), &textDark);

        // Date modified
        g.DrawString(doc.modified.c_str(), -1, &fTd, PointF((float)contentX + tableW * 0.52f, (float)rowY + 10.0f), &textMuted);

        // Location
        g.DrawString(doc.location.c_str(), -1, &fTd, PointF((float)contentX + tableW * 0.72f, (float)rowY + 10.0f), &textMuted);

        // Activity
        g.DrawString(doc.activity.c_str(), -1, &fTdSub, PointF((float)contentX + tableW * 0.86f, (float)rowY + 10.0f), &textMuted);

        // Subtle row bottom divider
        Pen rowDiv(Color(248, 250, 252), 1.0f);
        g.DrawLine(&rowDiv, contentX + 38, rowY + rowH, contentX + tableW, rowY + rowH);

        rowY += rowH;
    }
}

// Window Procedure
LRESULT CALLBACK HubWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_CREATE: {
        SetTimer(hwnd, 1, 50, NULL);
        return 0;
    }

    case WM_COMMAND: {
        if (LOWORD(wParam) == IDC_SEARCH_EDIT && HIWORD(wParam) == EN_CHANGE) {
            wchar_t buf[256] = { 0 };
            GetWindowTextW(g_hSearchEdit, buf, 256);
            g_searchQuery = buf;
            FilterDocs(g_searchQuery);
            InvalidateRect(hwnd, NULL, FALSE);
        }
        return 0;
    }

    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);

        // Reposition search input inside pill
        int contentX = LEFT_RAIL_WIDTH + 48;
        int searchW = (w - contentX - 48);
        if (searchW > 640) searchW = 640;
        int searchX = contentX + ((w - contentX) - searchW) / 2 - 20;

        if (g_hSearchEdit) {
            SetWindowPos(g_hSearchEdit, NULL, searchX + 38, 118, searchW - 54, 24, SWP_NOZORDER);
        }
        InvalidateRect(hwnd, NULL, FALSE);
        return 0;
    }

    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);

        int oldHoverRail = g_hoverRail;
        int oldHoverCard = g_hoverCard;
        int oldHoverRow = g_hoverTableRow;
        int oldHoverPill = g_hoverFilterPill;
        bool oldUpload = g_hoverUpload;

        g_hoverRail = -1;
        g_hoverCard = -1;
        g_hoverTableRow = -1;
        g_hoverFilterPill = -1;
        g_hoverUpload = false;

        // Check Rail hover
        if (x < LEFT_RAIL_WIDTH) {
            int ry = 14;
            int ids[] = { RAIL_HOME, RAIL_COPILOT, RAIL_CREATE, RAIL_MYCONTENT, RAIL_APPS, -1, RAIL_DRIFT, RAIL_AXIS, RAIL_KINETIC, RAIL_AEGIS };
            for (int id : ids) {
                if (id == -1) { ry += 16; continue; }
                if (y >= ry && y < ry + 48) {
                    g_hoverRail = id;
                    break;
                }
                ry += 54;
            }
        }

        // Check Cards hover
        int cardStartY = 176;
        int contentX = LEFT_RAIL_WIDTH + 48;
        if (y >= cardStartY && y <= cardStartY + CARD_HEIGHT) {
            for (int i = 0; i < 7; i++) {
                int cx = contentX + i * (CARD_WIDTH + CARD_GAP);
                if (x >= cx && x <= cx + CARD_WIDTH) {
                    g_hoverCard = i;
                    break;
                }
            }
        }

        // Check Quick Access Row hover
        int tableStartY = 390 + 34 + 44 + 24;
        int rowH = 40;
        if (y >= tableStartY && x >= contentX) {
            int rowIdx = (y - tableStartY) / rowH;
            if (rowIdx >= 0 && rowIdx < (int)g_filteredDocs.size()) {
                g_hoverTableRow = rowIdx;
            }
        }

        // Check Filter Pill hover
        int pillY = 390 + 34;
        if (y >= pillY && y <= pillY + 30) {
            int px = contentX;
            int widths[] = { 140, 84, 96 };
            for (int i = 0; i < 3; i++) {
                if (x >= px && x <= px + widths[i]) {
                    g_hoverFilterPill = i;
                    break;
                }
                px += widths[i] + 10;
            }

            RECT rc;
            GetClientRect(hwnd, &rc);
            int upX = rc.right - 160;
            if (x >= upX && x <= upX + 86) {
                g_hoverUpload = true;
            }
        }

        if (oldHoverRail != g_hoverRail || oldHoverCard != g_hoverCard ||
            oldHoverRow != g_hoverTableRow || oldHoverPill != g_hoverFilterPill ||
            oldUpload != g_hoverUpload) {
            InvalidateRect(hwnd, NULL, FALSE);
        }

        // Hand Cursor for clickable items
        if (g_hoverRail != -1 || g_hoverCard != -1 || g_hoverTableRow != -1 ||
            g_hoverFilterPill != -1 || g_hoverUpload) {
            SetCursor(LoadCursor(NULL, IDC_HAND));
        } else {
            SetCursor(LoadCursor(NULL, IDC_ARROW));
        }
        return 0;
    }

    case WM_LBUTTONDOWN: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);

        // Click Rail Items
        if (x < LEFT_RAIL_WIDTH) {
            if (g_hoverRail == RAIL_HOME) { g_activeRail = RAIL_HOME; InvalidateRect(hwnd, NULL, FALSE); }
            else if (g_hoverRail == RAIL_DRIFT) { LaunchApp(L"GiriDrift.exe"); }
            else if (g_hoverRail == RAIL_AXIS) { LaunchApp(L"GiriAxis.exe"); }
            else if (g_hoverRail == RAIL_KINETIC) { LaunchApp(L"GiriKinetic.exe"); }
            else if (g_hoverRail == RAIL_AEGIS) { OpenAnyFileDialog(hwnd); }
            else if (g_hoverRail == RAIL_CREATE) { LaunchApp(L"GiriDrift.exe"); }
            else if (g_hoverRail == RAIL_MYCONTENT) { OpenAnyFileDialog(hwnd); }
            return 0;
        }

        // Click Create Cards
        if (g_hoverCard != -1) {
            if (g_hoverCard == 0) LaunchApp(L"GiriDrift.exe");
            else if (g_hoverCard == 1) LaunchApp(L"GiriKinetic.exe");
            else if (g_hoverCard == 2) LaunchApp(L"GiriAxis.exe");
            else if (g_hoverCard == 3 || g_hoverCard == 4) LaunchApp(L"GiriDrift.exe");
            else if (g_hoverCard == 5) LaunchApp(L"GiriAxis.exe");
            else if (g_hoverCard == 6) LaunchApp(L"GiriKinetic.exe");
            return 0;
        }

        // Click Filter Pills
        if (g_hoverFilterPill != -1) {
            g_activeFilterPill = g_hoverFilterPill;
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        }

        // Click Upload
        if (g_hoverUpload) {
            OpenAnyFileDialog(hwnd);
            return 0;
        }

        // Click Table Rows
        if (g_hoverTableRow != -1 && g_hoverTableRow < (int)g_filteredDocs.size()) {
            const auto& doc = g_filteredDocs[g_hoverTableRow];
            if (doc.type == L"drift") LaunchApp(L"GiriDrift.exe", L"\"" + doc.fullPath + L"\"");
            else if (doc.type == L"axis") LaunchApp(L"GiriAxis.exe", L"\"" + doc.fullPath + L"\"");
            else if (doc.type == L"kinetic") LaunchApp(L"GiriKinetic.exe", L"\"" + doc.fullPath + L"\"");
            else OpenAnyFileDialog(hwnd);
            return 0;
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

        // Double Buffering with Memory Bitmap
        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, w, h);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);
        g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

        // 1. Viewport Background
        SolidBrush bgBrush(Color(255, 255, 255));
        g.FillRectangle(&bgBrush, 0, 0, w, h);

        // 2. Left Navigation Rail
        RenderLeftRail(g, w, h);

        int contentX = LEFT_RAIL_WIDTH + 48;

        // 3. Header: "Welcome to Giri Orbit Copilot"
        Font fTitle(L"Segoe UI", 21.0f, FontStyleBold, UnitPoint);
        SolidBrush titleBrush(Color(31, 41, 55));
        StringFormat sfCenter;
        sfCenter.SetAlignment(StringAlignmentCenter);

        int centerHeaderX = contentX + (w - contentX) / 2;
        g.DrawString(L"Welcome to Giri Orbit Copilot", -1, &fTitle, PointF((float)centerHeaderX, 36.0f), &sfCenter, &titleBrush);

        // Subtitle Status: Free pill + Offline Sovereign Storage
        int subY = 76;
        GraphicsPath freePill;
        AddRoundedRect(freePill, RectF((float)centerHeaderX - 145.0f, (float)subY, 44.0f, 20.0f), 10.0f);
        SolidBrush freeBg(Color(241, 245, 249));
        g.FillPath(&freeBg, &freePill);
        Pen freeBorder(Color(226, 232, 240), 1.0f);
        g.DrawPath(&freeBorder, &freePill);

        Font fFree(L"Segoe UI", 8.0f, FontStyleBold, UnitPoint);
        SolidBrush freeText(Color(71, 85, 105));
        StringFormat sfFree;
        sfFree.SetAlignment(StringAlignmentCenter);
        sfFree.SetLineAlignment(StringAlignmentCenter);
        g.DrawString(L"Free", -1, &fFree, PointF((float)centerHeaderX - 123.0f, (float)subY + 10.0f), &sfFree, &freeText);

        Font fSub(L"Segoe UI", 8.5f, FontStyleRegular, UnitPoint);
        SolidBrush subText(Color(107, 114, 128));
        g.DrawString(L"🛡️ 0 MB used of Sovereign Storage (100% Offline Standalone)", -1, &fSub, PointF((float)centerHeaderX - 90.0f, (float)subY + 2.0f), &subText);

        // 4. Centered Search Pill
        int searchW = (w - contentX - 48);
        if (searchW > 640) searchW = 640;
        int searchX = contentX + ((w - contentX) - searchW) / 2 - 20;
        int searchY = 110;

        GraphicsPath searchPill;
        AddRoundedRect(searchPill, RectF((float)searchX, (float)searchY, (float)searchW, 40.0f), 20.0f);
        SolidBrush spBg(Color(255, 255, 255));
        g.FillPath(&spBg, &searchPill);
        Pen spBorder(Color(209, 213, 219), 1.0f);
        g.DrawPath(&spBorder, &searchPill);

        // Search Magnifying Glass Icon
        Pen searchIconPen(Color(156, 163, 175), 1.8f);
        g.DrawEllipse(&searchIconPen, searchX + 16, searchY + 13, 10, 10);
        g.DrawLine(&searchIconPen, searchX + 24, searchY + 21, searchX + 28, searchY + 25);

        // 5. "Create New" Section
        int createY = 176;
        Font fSection(L"Segoe UI", 12.0f, FontStyleBold, UnitPoint);
        g.DrawString(L"Create New", -1, &fSection, PointF((float)contentX, (float)createY - 26.0f), &titleBrush);

        // Right "See more in Create ->"
        int cardsRight = contentX + 7 * (CARD_WIDTH + CARD_GAP) - CARD_GAP;
        Font fLink(L"Segoe UI", 8.5f, FontStyleBold, UnitPoint);
        SolidBrush linkBrush(Color(37, 99, 235));
        StringFormat sfRight;
        sfRight.SetAlignment(StringAlignmentFar);
        g.DrawString(L"See more in Create →", -1, &fLink, PointF((float)cardsRight, (float)createY - 24.0f), &sfRight, &linkBrush);

        for (int i = 0; i < 7; i++) {
            int cx = contentX + i * (CARD_WIDTH + CARD_GAP);
            RenderCreateCard(g, cx, createY, i, (g_hoverCard == i));
        }

        // 6. Quick Access Section
        int qaStartY = createY + CARD_HEIGHT + 36;
        RenderQuickAccess(g, contentX, qaStartY, w);

        // 7. Status Bar at Bottom
        RectF statusRect(0.0f, (float)h - 24.0f, (float)w, 24.0f);
        SolidBrush statusBg(Color(248, 250, 252));
        g.FillRectangle(&statusBg, statusRect);
        Pen statusDiv(Color(226, 232, 240), 1.0f);
        g.DrawLine(&statusDiv, 0, h - 24, w, h - 24);

        Font fStatus(L"Segoe UI", 8.0f, FontStyleRegular, UnitPoint);
        SolidBrush statusText(Color(107, 114, 128));
        g.DrawString(L"  Giri Orbit Sovereign Suite Copilot (v12.0) • 100% Offline Standalone Native C++ • Author: Abhinav Giri (abhinavgiri370@gmail.com)",
                     -1, &fStatus, PointF(8.0f, (float)h - 18.0f), &statusText);

        BitBlt(hdc, 0, 0, w, h, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);

        EndPaint(hwnd, &ps);
        return 0;
    }

    case WM_CTLCOLOREDIT: {
        HDC hdcEdit = (HDC)wParam;
        SetTextColor(hdcEdit, RGB(31, 41, 55));
        SetBkColor(hdcEdit, RGB(255, 255, 255));
        return (LRESULT)GetStockObject(WHITE_BRUSH);
    }

    case WM_DESTROY: {
        PostQuitMessage(0);
        return 0;
    }

    default:
        return DefWindowProcW(hwnd, uMsg, wParam, lParam);
    }
}
