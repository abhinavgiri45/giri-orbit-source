/* ============================================================================
 * GIRI DESIGNER - CREATIVE GRAPHIC & BANNER STUDIO (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Official Contact: abhinavgiri370@gmail.com
 * Proprietary Commercial Software License (All Rights Reserved)
 * 100% Offline Standalone Native C++ Win32 & GDI+ Modern Fluent UI
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
#include "../common/sovereign_launcher.h"
#include <commctrl.h>
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <gdiplus.h>
#include <string>
#include <vector>
#include "../common/tool_start_ui.h"

#define IDC_BTN_BACK_HUB      7099

#pragma comment(lib, "gdiplus.lib")
#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "shell32.lib")

using namespace Gdiplus;

#define IDC_TOOLBAR_PANEL      7001
#define IDC_BTN_PRESET_BANNER  7002
#define IDC_BTN_PRESET_SQUARE  7003
#define IDC_BTN_PRESET_SLIDE   7004
#define IDC_BTN_ADD_HEADING    7005
#define IDC_BTN_ADD_SHAPE      7006
#define IDC_BTN_ADD_BADGE      7007
#define IDC_BTN_CYCLE_GRADIENT 7008
#define IDC_BTN_EXPORT_IMAGE   7009
#define IDC_BTN_RESET_CANVAS   7010

enum LayerType {
    LAYER_TEXT = 0,
    LAYER_RECT = 1,
    LAYER_CIRCLE = 2
};

struct DesignLayer {
    int id;
    LayerType type;
    float x;
    float y;
    float w;
    float h;
    std::wstring text;
    float fontSize;
    Color color;
    Color bgFill;
    bool isDragging;
};

HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hToolbarPanel = NULL;
ULONG_PTR g_gdiToken = 0;
HICON g_hAppIcon = NULL;
std::wstring g_appDir = L"";

int g_canvasW = 860;
int g_canvasH = 460;
int g_activeGradientTheme = 0; // 0: Royal Blue/Indigo, 1: Electric Sunset, 2: Emerald Modern, 3: Midnight Neon
std::vector<DesignLayer> g_layers;
int g_selectedLayerIdx = -1;
POINT g_lastMouse = { 0, 0 };

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

void InitDefaultDesign() {
    g_layers.clear();

    // Layer 1: Accent Glass Card
    DesignLayer l1;
    l1.id = 1;
    l1.type = LAYER_RECT;
    l1.x = 40.0f;
    l1.y = 40.0f;
    l1.w = 560.0f;
    l1.h = 320.0f;
    l1.bgFill = Color(200, 255, 255, 255);
    l1.color = Color(226, 232, 240);
    l1.isDragging = false;
    g_layers.push_back(l1);

    // Layer 2: Badge Pill
    DesignLayer l2;
    l2.id = 2;
    l2.type = LAYER_RECT;
    l2.x = 70.0f;
    l2.y = 70.0f;
    l2.w = 160.0f;
    l2.h = 30.0f;
    l2.text = L"SOVEREIGN SUITE";
    l2.fontSize = 9.0f;
    l2.color = Color(255, 255, 255);
    l2.bgFill = Color(219, 39, 119); // Magenta
    l2.isDragging = false;
    g_layers.push_back(l2);

    // Layer 3: Main Headline
    DesignLayer l3;
    l3.id = 3;
    l3.type = LAYER_TEXT;
    l3.x = 70.0f;
    l3.y = 116.0f;
    l3.w = 480.0f;
    l3.h = 80.0f;
    l3.text = L"Giri Orbit Studio 2026";
    l3.fontSize = 24.0f;
    l3.color = Color(15, 23, 42);
    l3.isDragging = false;
    g_layers.push_back(l3);

    // Layer 4: Subtitle Text
    DesignLayer l4;
    l4.id = 4;
    l4.type = LAYER_TEXT;
    l4.x = 70.0f;
    l4.y = 200.0f;
    l4.w = 480.0f;
    l4.h = 50.0f;
    l4.text = L"Architected by Abhinav Giri • 100% Offline Standalone Native C++\nHigh-Performance Zero-Tearing Fluent Graphics Engine";
    l4.fontSize = 10.5f;
    l4.color = Color(71, 85, 105);
    l4.isDragging = false;
    g_layers.push_back(l4);

    // Layer 5: Decorative Circle Badge
    DesignLayer l5;
    l5.id = 5;
    l5.type = LAYER_CIRCLE;
    l5.x = 640.0f;
    l5.y = 120.0f;
    l5.w = 160.0f;
    l5.h = 160.0f;
    l5.text = L"60+ FPS";
    l5.fontSize = 15.0f;
    l5.color = Color(255, 255, 255);
    l5.bgFill = Color(236, 72, 153);
    l5.isDragging = false;
    g_layers.push_back(l5);
}

// Designer View State Machine
enum DesignerViewState {
    DESIGNER_VIEW_START = 0,
    DESIGNER_VIEW_CANVAS = 1
};
DesignerViewState g_designerState = DESIGNER_VIEW_START;
GiriOrbit::ToolThemeConfig g_designerConfig;
GiriOrbit::StartUIState g_designerStartState;

void ReturnToDesignerStart(HWND hwnd);
void EnterDesignerCanvas(HWND hwnd);
void EnterDesignerCanvasBlank(HWND hwnd);
void LoadDesignerTemplate(HWND hwnd, int idx);

void InitDesignerConfig() {
    g_designerConfig.toolLetter = L"D";
    g_designerConfig.toolName = L"Designer";
    g_designerConfig.fullToolName = L"Giri Designer";
    g_designerConfig.headline = L"Welcome to Designer for free on the web";
    g_designerConfig.subtitle = L"Sovereign vector graphic canvas, wireframing, and visual composition studio. Zero cloud telemetry, instant vector export, and high-fidelity shapes.";
    g_designerConfig.createBtnText = L"Create blank design";
    g_designerConfig.uploadBtnText = L"Upload Design";
    g_designerConfig.draftTitle = L"Product Marketing Banner - Giri Designer";
    g_designerConfig.draftMeta = L"Saved recently • 1200x630 • 5 Vector Layers • 1.8 KB";
    g_designerConfig.toolHash = L"designer";
    g_designerConfig.galleryTitle = L"Create with templates";
    g_designerConfig.galleryBadge = L"";
    g_designerConfig.accentColor = Gdiplus::Color(219, 39, 119); // Pink/Magenta-600
    g_designerConfig.accentDark = Gdiplus::Color(190, 24, 93);   // Pink-700
    g_designerConfig.accentHover = Gdiplus::Color(236, 72, 153); // Pink-500
    g_designerConfig.illustrationType = 3;

    g_designerConfig.categories = {
        L"Recommended", L"Social & Banners", L"Architecture & Diagrams", L"UI/UX Wireframes", L"Print & Posters"
    };

    g_designerConfig.templates = {
        {
            L"Social Media Hero Banner (1200x630)",
            L"Social & Banners",
            L"High-impact landscape composition with glassmorphism badge and gradient contrast typography.",
            L"BANNER"
        },
        {
            L"Enterprise Systems Architecture Diagram",
            L"Architecture & Diagrams",
            L"Clean vector flow diagrams for decoupled microservices, message buses, and cache layers.",
            L"SYSTEMS"
        },
        {
            L"Square Instagram & Community Post (1080x1080)",
            L"Social & Banners",
            L"Modern balanced square ratio canvas optimized for mobile product feeds and community announcements.",
            L"SQUARE"
        },
        {
            L"Product Feature Infographic & Slide (16:9)",
            L"Recommended",
            L"Widescreen presentation graphic highlighting key feature metrics, speed comparisons, and value props.",
            L"INFOGRAPHIC"
        },
        {
            L"Mobile Application UI/UX Wireframe",
            L"UI/UX Wireframes",
            L"Phone viewport wireframe with navigation header, card stack, action buttons, and status indicator.",
            L"WIREFRAME"
        },
        {
            L"Executive Certificate of Achievement",
            L"Print & Posters",
            L"Formal gold-accented legal recognition award layout with border scrollwork and signature lines.",
            L"CERTIFICATE"
        }
    };
}

void ReturnToDesignerStart(HWND hwnd) {
    g_designerState = DESIGNER_VIEW_START;
    ShowWindow(g_hToolbarPanel, SW_HIDE);
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterDesignerCanvas(HWND hwnd) {
    g_designerState = DESIGNER_VIEW_CANVAS;
    ShowWindow(g_hToolbarPanel, SW_SHOW);
    RECT rc;
    GetClientRect(hwnd, &rc);
    SendMessageW(hwnd, WM_SIZE, 0, MAKELPARAM(rc.right, rc.bottom));
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterDesignerCanvasBlank(HWND hwnd) {
    g_layers.clear();
    g_canvasW = 860;
    g_canvasH = 460;
    g_activeGradientTheme = 0;
    DesignLayer l;
    l.id = 1;
    l.type = LAYER_TEXT;
    l.x = 80.0f;
    l.y = 80.0f;
    l.w = 500.0f;
    l.h = 60.0f;
    l.text = L"Your Sovereign Creative Canvas";
    l.fontSize = 24.0f;
    l.color = Color(255, 255, 255);
    l.isDragging = false;
    g_layers.push_back(l);
    EnterDesignerCanvas(hwnd);
}

void LoadDesignerTemplate(HWND hwnd, int idx) {
    if (idx == 0) { // Banner
        g_canvasW = 860;
        g_canvasH = 460;
        InitDefaultDesign();
    } else if (idx == 1) { // Systems
        g_canvasW = 960;
        g_canvasH = 540;
        g_activeGradientTheme = 2; // Emerald
        InitDefaultDesign();
    } else if (idx == 2) { // Square
        g_canvasW = 560;
        g_canvasH = 560;
        g_activeGradientTheme = 1; // Sunset
        InitDefaultDesign();
    } else {
        g_canvasW = 960;
        g_canvasH = 540;
        InitDefaultDesign();
    }
    EnterDesignerCanvas(hwnd);
}


void DoExportDesignImage(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = L"Giri_Designer_Banner.bmp";
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Windows Bitmap (*.bmp)\0*.bmp\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_OVERWRITEPROMPT | OFN_PATHMUSTEXIST;
    ofn.lpstrDefExt = L"bmp";

    if (GetSaveFileNameW(&ofn)) {
        // Render high-res bitmap
        HDC screenDC = GetDC(NULL);
        HDC memDC = CreateCompatibleDC(screenDC);
        HBITMAP hBM = CreateCompatibleBitmap(screenDC, g_canvasW, g_canvasH);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, hBM);

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);
        g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

        // Render gradient background
        Color c1(30, 58, 138), c2(99, 102, 241);
        if (g_activeGradientTheme == 1) { c1 = Color(185, 28, 28); c2 = Color(245, 158, 11); }
        else if (g_activeGradientTheme == 2) { c1 = Color(6, 95, 70); c2 = Color(16, 185, 129); }
        else if (g_activeGradientTheme == 3) { c1 = Color(15, 23, 42); c2 = Color(147, 51, 234); }

        LinearGradientBrush grad(Rect(0, 0, g_canvasW, g_canvasH), c1, c2, LinearGradientModeForwardDiagonal);
        g.FillRectangle(&grad, 0, 0, g_canvasW, g_canvasH);

        for (const auto& l : g_layers) {
            if (l.type == LAYER_RECT) {
                GraphicsPath p;
                AddRoundedRect(p, RectF(l.x, l.y, l.w, l.h), 8.0f);
                SolidBrush b(l.bgFill);
                g.FillPath(&b, &p);
                Pen pen(l.color, 1.0f);
                g.DrawPath(&pen, &p);
                if (!l.text.empty()) {
                    Font f(L"Segoe UI", l.fontSize, FontStyleBold, UnitPoint);
                    SolidBrush tb(l.color);
                    StringFormat sf;
                    sf.SetAlignment(StringAlignmentCenter);
                    sf.SetLineAlignment(StringAlignmentCenter);
                    g.DrawString(l.text.c_str(), -1, &f, PointF(l.x + l.w / 2.0f, l.y + l.h / 2.0f), &sf, &tb);
                }
            } else if (l.type == LAYER_CIRCLE) {
                SolidBrush b(l.bgFill);
                g.FillEllipse(&b, l.x, l.y, l.w, l.h);
                if (!l.text.empty()) {
                    Font f(L"Segoe UI", l.fontSize, FontStyleBold, UnitPoint);
                    SolidBrush tb(l.color);
                    StringFormat sf;
                    sf.SetAlignment(StringAlignmentCenter);
                    sf.SetLineAlignment(StringAlignmentCenter);
                    g.DrawString(l.text.c_str(), -1, &f, PointF(l.x + l.w / 2.0f, l.y + l.h / 2.0f), &sf, &tb);
                }
            } else if (l.type == LAYER_TEXT) {
                Font f(L"Segoe UI", l.fontSize, FontStyleBold, UnitPoint);
                SolidBrush tb(l.color);
                g.DrawString(l.text.c_str(), -1, &f, PointF(l.x, l.y), &tb);
            }
        }

        // Save Bitmap to file
        BITMAP bmp;
        GetObject(hBM, sizeof(BITMAP), &bmp);
        BITMAPFILEHEADER bfh = { 0 };
        BITMAPINFOHEADER bih = { 0 };
        bih.biSize = sizeof(BITMAPINFOHEADER);
        bih.biWidth = bmp.bmWidth;
        bih.biHeight = bmp.bmHeight;
        bih.biPlanes = 1;
        bih.biBitCount = 32;
        bih.biCompression = BI_RGB;
        DWORD dwSize = ((bmp.bmWidth * 32 + 31) / 32) * 4 * bmp.bmHeight;
        bfh.bfType = 0x4D42; // 'BM'
        bfh.bfSize = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + dwSize;
        bfh.bfOffBits = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);

        std::vector<BYTE> bits(dwSize);
        GetDIBits(memDC, hBM, 0, bmp.bmHeight, &bits[0], (BITMAPINFO*)&bih, DIB_RGB_COLORS);

        HANDLE hFile = CreateFileW(szFile, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
        if (hFile != INVALID_HANDLE_VALUE) {
            DWORD dwWritten = 0;
            WriteFile(hFile, &bfh, sizeof(bfh), &dwWritten, NULL);
            WriteFile(hFile, &bih, sizeof(bih), &dwWritten, NULL);
            WriteFile(hFile, &bits[0], dwSize, &dwWritten, NULL);
            CloseHandle(hFile);
            MessageBoxW(hwnd, L"Design exported to high-resolution Bitmap image successfully!", L"Giri Designer Export", MB_OK | MB_ICONINFORMATION);
        }

        SelectObject(memDC, oldBM);
        DeleteObject(hBM);
        DeleteDC(memDC);
        ReleaseDC(NULL, screenDC);
    }
}

LRESULT CALLBACK DesignerWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_COMMAND: {
        int id = LOWORD(wParam);
        if (id == IDC_BTN_BACK_HUB) {
            ReturnToDesignerStart(hwnd);
            return 0;
        }
        if (id == IDC_BTN_PRESET_BANNER) {
            g_canvasW = 860;
            g_canvasH = 460;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_PRESET_SQUARE) {
            g_canvasW = 560;
            g_canvasH = 560;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_PRESET_SLIDE) {
            g_canvasW = 960;
            g_canvasH = 540;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_ADD_HEADING) {
            DesignLayer l;
            l.id = (int)g_layers.size() + 1;
            l.type = LAYER_TEXT;
            l.x = 100.0f;
            l.y = 100.0f;
            l.w = 340.0f;
            l.h = 50.0f;
            l.text = L"New Creative Typography Headline";
            l.fontSize = 20.0f;
            l.color = Color(255, 255, 255);
            l.isDragging = false;
            g_layers.push_back(l);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_ADD_SHAPE) {
            DesignLayer l;
            l.id = (int)g_layers.size() + 1;
            l.type = LAYER_RECT;
            l.x = 120.0f;
            l.y = 120.0f;
            l.w = 200.0f;
            l.h = 100.0f;
            l.bgFill = Color(220, 255, 255, 255);
            l.color = Color(219, 39, 119);
            l.isDragging = false;
            g_layers.push_back(l);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_ADD_BADGE) {
            DesignLayer l;
            l.id = (int)g_layers.size() + 1;
            l.type = LAYER_CIRCLE;
            l.x = 200.0f;
            l.y = 200.0f;
            l.w = 120.0f;
            l.h = 120.0f;
            l.text = L"STAR";
            l.fontSize = 14.0f;
            l.color = Color(255, 255, 255);
            l.bgFill = Color(245, 158, 11);
            l.isDragging = false;
            g_layers.push_back(l);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_CYCLE_GRADIENT) {
            g_activeGradientTheme = (g_activeGradientTheme + 1) % 4;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_EXPORT_IMAGE) {
            DoExportDesignImage(hwnd);
        } else if (id == IDC_BTN_RESET_CANVAS) {
            if (MessageBoxW(hwnd, L"Reset canvas to default social banner?", L"Confirm Reset", MB_YESNO | MB_ICONQUESTION) == IDYES) {
                InitDefaultDesign();
                InvalidateRect(hwnd, NULL, FALSE);
            }
        }
        return 0;
    }

    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);
        if (g_designerState == DESIGNER_VIEW_START) {
            if (g_hToolbarPanel) ShowWindow(g_hToolbarPanel, SW_HIDE);
            InvalidateRect(hwnd, NULL, FALSE);
            return 0;
        }
        if (g_hToolbarPanel) {
            SetWindowPos(g_hToolbarPanel, NULL, 0, 0, w, 82, SWP_NOZORDER);
        }
        InvalidateRect(hwnd, NULL, FALSE);
        return 0;
    }

    case WM_LBUTTONDOWN: {
        int mx = LOWORD(lParam);
        int my = HIWORD(lParam);

        if (g_designerState == DESIGNER_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(mx, my, rcClient.right, rcClient.bottom, g_designerConfig, g_designerStartState);

            switch (hit.action) {
            case GiriOrbit::ACTION_CREATE_BLANK:
                EnterDesignerCanvasBlank(hwnd);
                break;
            case GiriOrbit::ACTION_UPLOAD_FILE:
                EnterDesignerCanvas(hwnd);
                break;
            case GiriOrbit::ACTION_CUSTOM_TEMPLATE:
                LoadDesignerTemplate(hwnd, 0);
                break;
            case GiriOrbit::ACTION_IMPORT_TEMPLATE:
                EnterDesignerCanvas(hwnd);
                break;
            case GiriOrbit::ACTION_RESUME_DRAFT:
                EnterDesignerCanvas(hwnd);
                break;
            case GiriOrbit::ACTION_DELETE_DRAFT:
                g_layers.clear();
                g_designerStartState.ShowToast(L"Draft design cleared.");
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
                GiriOrbit::LaunchAppOrSwitch(hwnd, L"GiriKinetic.exe");
                break;
            case GiriOrbit::ACTION_OPEN_PDF:
                GiriOrbit::OpenWebUrl(hwnd, L"https://giri-orbit.pages.dev/#pdf");
                break;
            case GiriOrbit::ACTION_COPY_LINK:
                GiriOrbit::CopyToolLink(hwnd, L"designer", g_designerStartState);
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_CATEGORY:
                g_designerStartState.selectedCategory = hit.index;
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_TEMPLATE:
                LoadDesignerTemplate(hwnd, hit.index);
                break;
            default:
                break;
            }
            return 0;
        }

        RECT rc;
        GetClientRect(hwnd, &rc);
        int cx = (rc.right - g_canvasW) / 2;
        int cy = 96 + (rc.bottom - 96 - 24 - g_canvasH) / 2;

        int localX = mx - cx;
        int localY = my - cy;

        g_selectedLayerIdx = -1;
        // Search top to bottom
        for (int i = (int)g_layers.size() - 1; i >= 0; --i) {
            auto& l = g_layers[i];
            if (localX >= l.x && localX <= l.x + l.w && localY >= l.y && localY <= l.y + l.h) {
                g_selectedLayerIdx = i;
                l.isDragging = true;
                g_lastMouse.x = mx;
                g_lastMouse.y = my;
                SetCapture(hwnd);
                InvalidateRect(hwnd, NULL, FALSE);
                return 0;
            }
        }
        return 0;
    }

    case WM_MOUSEMOVE: {
        if (g_selectedLayerIdx >= 0 && g_selectedLayerIdx < (int)g_layers.size()) {
            auto& l = g_layers[g_selectedLayerIdx];
            if (l.isDragging) {
                int mx = LOWORD(lParam);
                int my = HIWORD(lParam);
                int dx = mx - g_lastMouse.x;
                int dy = my - g_lastMouse.y;
                l.x += (float)dx;
                l.y += (float)dy;
                g_lastMouse.x = mx;
                g_lastMouse.y = my;
                InvalidateRect(hwnd, NULL, FALSE);
            }
        }
        return 0;
    }

    case WM_LBUTTONUP: {
        if (g_selectedLayerIdx >= 0 && g_selectedLayerIdx < (int)g_layers.size()) {
            g_layers[g_selectedLayerIdx].isDragging = false;
            ReleaseCapture();
            InvalidateRect(hwnd, NULL, FALSE);
        }
        g_selectedLayerIdx = -1;
        return 0;
    }

    case WM_ERASEBKGND: return 1;

    case WM_SETCURSOR: {
        if (g_designerState == DESIGNER_VIEW_START && g_designerStartState.hoverId != -1) {
            SetCursor(LoadCursor(NULL, IDC_HAND));
            return TRUE;
        }
        break;
    }

    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);

        RECT rc;
        GetClientRect(hwnd, &rc);
        int w = rc.right;
        int h = rc.bottom;

        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, w, h);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);
        g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

        if (g_designerState == DESIGNER_VIEW_START) {
            GiriOrbit::RenderStartInterface(g, w, h, g_designerConfig, g_designerStartState);
        } else {
        // Backdrop Workspace (Dark Studio Grey #1e293b)
        SolidBrush bgBrush(Color(24, 24, 27));
        g.FillRectangle(&bgBrush, 0, 0, w, h);

        int cx = (w - g_canvasW) / 2;
        int cy = 96 + (h - 96 - 24 - g_canvasH) / 2;
        if (cy < 96) cy = 96;

        // Canvas Drop Shadow
        RectF shadowRect((float)cx - 4.0f, (float)cy + 4.0f, (float)g_canvasW + 8.0f, (float)g_canvasH + 8.0f);
        GraphicsPath sp;
        AddRoundedRect(sp, shadowRect, 10.0f);
        SolidBrush shBrush(Color(70, 0, 0, 0));
        g.FillPath(&shBrush, &sp);

        // Canvas Surface Clip Area
        RectF canvasRect((float)cx, (float)cy, (float)g_canvasW, (float)g_canvasH);
        GraphicsPath cp;
        AddRoundedRect(cp, canvasRect, 6.0f);
        g.SetClip(&cp);

        // Background Gradient
        Color c1(30, 58, 138), c2(99, 102, 241); // Royal Indigo
        if (g_activeGradientTheme == 1) { c1 = Color(185, 28, 28); c2 = Color(245, 158, 11); } // Sunset
        else if (g_activeGradientTheme == 2) { c1 = Color(6, 95, 70); c2 = Color(16, 185, 129); } // Emerald
        else if (g_activeGradientTheme == 3) { c1 = Color(15, 23, 42); c2 = Color(147, 51, 234); } // Neon

        LinearGradientBrush grad(Rect(cx, cy, g_canvasW, g_canvasH), c1, c2, LinearGradientModeForwardDiagonal);
        g.FillRectangle(&grad, cx, cy, g_canvasW, g_canvasH);

        // Draw Layers
        for (size_t i = 0; i < g_layers.size(); ++i) {
            const auto& l = g_layers[i];
            float lx = cx + l.x;
            float ly = cy + l.y;

            if (l.type == LAYER_RECT) {
                GraphicsPath p;
                AddRoundedRect(p, RectF(lx, ly, l.w, l.h), 8.0f);
                SolidBrush b(l.bgFill);
                g.FillPath(&b, &p);
                Pen pen(l.color, 1.0f);
                g.DrawPath(&pen, &p);

                if (!l.text.empty()) {
                    Font f(L"Segoe UI", l.fontSize, FontStyleBold, UnitPoint);
                    SolidBrush tb(l.color);
                    StringFormat sf;
                    sf.SetAlignment(StringAlignmentCenter);
                    sf.SetLineAlignment(StringAlignmentCenter);
                    g.DrawString(l.text.c_str(), -1, &f, PointF(lx + l.w / 2.0f, ly + l.h / 2.0f), &sf, &tb);
                }
            } else if (l.type == LAYER_CIRCLE) {
                SolidBrush b(l.bgFill);
                g.FillEllipse(&b, lx, ly, l.w, l.h);
                if (!l.text.empty()) {
                    Font f(L"Segoe UI", l.fontSize, FontStyleBold, UnitPoint);
                    SolidBrush tb(l.color);
                    StringFormat sf;
                    sf.SetAlignment(StringAlignmentCenter);
                    sf.SetLineAlignment(StringAlignmentCenter);
                    g.DrawString(l.text.c_str(), -1, &f, PointF(lx + l.w / 2.0f, ly + l.h / 2.0f), &sf, &tb);
                }
            } else if (l.type == LAYER_TEXT) {
                Font f(L"Segoe UI", l.fontSize, FontStyleBold, UnitPoint);
                SolidBrush tb(l.color);
                g.DrawString(l.text.c_str(), -1, &f, PointF(lx, ly), &tb);
            }

            // Selection Outline
            if ((int)i == g_selectedLayerIdx) {
                Pen selPen(Color(255, 255, 255), 1.5f);
                selPen.SetDashStyle(DashStyleDash);
                g.DrawRectangle(&selPen, lx - 2.0f, ly - 2.0f, l.w + 4.0f, l.h + 4.0f);
            }
        }

        g.ResetClip();

        // Canvas Dimensions Label
        Font fDim(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
        SolidBrush dimBrush(Color(161, 161, 170));
        wchar_t dimBuf[64];
        swprintf_s(dimBuf, L"Canvas: %d x %d px (Drag layers to move)", g_canvasW, g_canvasH);
        g.DrawString(dimBuf, -1, &fDim, PointF((float)cx, (float)cy - 22.0f), &dimBrush);

        // Status Bar at bottom
        RectF statusRect(0.0f, (float)h - 24.0f, (float)w, 24.0f);
        SolidBrush statusBg(Color(9, 9, 11));
        g.FillRectangle(&statusBg, statusRect);
        Pen statusDiv(Color(39, 39, 42), 1.0f);
        g.DrawLine(&statusDiv, 0, h - 24, w, h - 24);

        Font fStatus(L"Segoe UI", 8.0f, FontStyleRegular, UnitPoint);
        SolidBrush statusText(Color(161, 161, 170));
        g.DrawString(L"  Giri Designer Sovereign Graphic Studio (v13.5) • 100% Offline Standalone Native C++ • Author: Abhinav Giri",
                     -1, &fStatus, PointF(8.0f, (float)h - 18.0f), &statusText);

        }
        BitBlt(hdc, 0, 0, w, h, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);

        EndPaint(hwnd, &ps);
        return 0;
    }

    case WM_DESTROY: {
        PostQuitMessage(0);
        return 0;
    }

    default:
        return DefWindowProcW(hwnd, uMsg, wParam, lParam);
    }
}

void CreateDesignerToolbar(HWND hwnd) {
    g_hToolbarPanel = CreateWindowExW(
        0, L"STATIC", L"",
        WS_CHILD | WS_VISIBLE | SS_NOTIFY | WS_CLIPCHILDREN,
        0, 0, 1200, 82, hwnd, (HMENU)IDC_TOOLBAR_PANEL, g_hInst, NULL
    );

    HFONT hFont = CreateFontW(13, 0, 0, 0, FW_SEMIBOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");

    auto makeBtn = [hFont](const wchar_t* text, int x, int y, int w, int h, int id) {
        HWND btn = CreateWindowExW(
            0, L"BUTTON", text,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            x, y, w, h, g_hToolbarPanel, (HMENU)(INT_PTR)id, g_hInst, NULL
        );
        SendMessageW(btn, WM_SETFONT, (WPARAM)hFont, TRUE);
        return btn;
    };

    makeBtn(L"← Hub", 14, 14, 76, 36, IDC_BTN_BACK_HUB);
    makeBtn(L"Banner (1200x630)", 98, 14, 136, 36, IDC_BTN_PRESET_BANNER);
    makeBtn(L"Square (1080x1080)", 240, 14, 140, 36, IDC_BTN_PRESET_SQUARE);
    makeBtn(L"Slide 16:9", 386, 14, 88, 36, IDC_BTN_PRESET_SLIDE);
    makeBtn(L"+ Text", 480, 14, 82, 36, IDC_BTN_ADD_HEADING);
    makeBtn(L"+ Shape", 568, 14, 82, 36, IDC_BTN_ADD_SHAPE);
    makeBtn(L"+ Badge", 656, 14, 82, 36, IDC_BTN_ADD_BADGE);
    makeBtn(L"Cycle Gradient", 744, 14, 120, 36, IDC_BTN_CYCLE_GRADIENT);
    makeBtn(L"Export Image", 870, 14, 110, 36, IDC_BTN_EXPORT_IMAGE);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    // Launch Sovereign Edge App Mode for 100% Giri Orbit web & desktop parity
    if (GiriOrbit::TryLaunchSovereignAppMode(L"designer", lpCmdLine)) {
        return 0;
    }

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

    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_STANDARD_CLASSES };
    InitCommonControlsEx(&icex);

    wchar_t szPath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, szPath, MAX_PATH);
    PathRemoveFileSpecW(szPath);
    g_appDir = szPath;

    g_hAppIcon = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 256, 256, LR_DEFAULTSIZE);
    if (!g_hAppIcon) g_hAppIcon = (HICON)LoadImageW(NULL, (g_appDir + L"\\designer.ico").c_str(), IMAGE_ICON, 256, 256, LR_LOADFROMFILE);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW | CS_DBLCLKS;
    wcex.lpfnWndProc = DesignerWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = NULL;
    wcex.lpszClassName = L"GiriDesignerMainWindowClass";
    wcex.hIcon = g_hAppIcon;
    wcex.hIconSm = g_hAppIcon;

    if (!RegisterClassExW(&wcex)) return 0;

    InitDefaultDesign();

    // WS_EX_APPWINDOW & WS_OVERLAPPEDWINDOW for flawless min/max/move
    g_hMainWnd = CreateWindowExW(
        WS_EX_APPWINDOW,
        L"GiriDesignerMainWindowClass",
        L"Social Banner - Giri Designer (Creative Graphic & Vector Studio)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1260, 820,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    InitDesignerConfig();
    CreateDesignerToolbar(g_hMainWnd);
    ShowWindow(g_hToolbarPanel, SW_HIDE);

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    GdiplusShutdown(g_gdiToken);
    return (int)msg.wParam;
}
