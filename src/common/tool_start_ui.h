#pragma once

#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <gdiplus.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <string>
#include <vector>
#include <algorithm>

namespace GiriOrbit {

using namespace Gdiplus;

struct TemplateCardDef {
    std::wstring title;
    std::wstring category;
    std::wstring description;
    std::wstring content;
};

struct ToolThemeConfig {
    std::wstring toolLetter;    // L"D", L"A", L"K", L"F", L"Q", L"L", L"G"
    std::wstring toolName;      // L"Drift", L"Axis", L"Kinetic", etc.
    std::wstring fullToolName;  // L"Giri Drift", L"Giri Axis", etc.
    std::wstring headline;      // L"Welcome to Giri Drift"
    std::wstring subtitle;      // L"Sovereign in-memory document composer..."
    std::wstring createBtnText; // L"Create blank document"
    std::wstring uploadBtnText; // L"Upload a file"
    std::wstring draftTitle;    // L"Document 1 - Giri Drift"
    std::wstring draftMeta;     // L"Saved recently · 2 words · 12 chars · 0.3 KB"
    std::wstring toolHash;      // L"drift", L"axis", L"kinetic"
    std::wstring galleryTitle;  // L"Create with templates"
    std::wstring galleryBadge;  // L"● 3,500+ Free Templates & Diagrams" or L""
    
    Color accentColor;          // e.g. Color(37, 99, 235)
    Color accentDark;           // e.g. Color(30, 58, 138)
    Color accentHover;          // e.g. Color(29, 78, 216)
    
    std::vector<std::wstring> categories;
    std::vector<TemplateCardDef> templates;
    int illustrationType;       // 0 = Drift doc, 1 = Axis bars, 2 = Kinetic presentation, 3 = Studio stack
};

enum StartActionType {
    ACTION_NONE = 0,
    ACTION_CREATE_BLANK,
    ACTION_UPLOAD_FILE,
    ACTION_CUSTOM_TEMPLATE,
    ACTION_IMPORT_TEMPLATE,
    ACTION_RESUME_DRAFT,
    ACTION_DELETE_DRAFT,
    ACTION_OPEN_PORTAL,
    ACTION_OPEN_INSTAGRAM,
    ACTION_SWITCH_HUB,
    ACTION_SWITCH_DRIFT,
    ACTION_SWITCH_AXIS,
    ACTION_SWITCH_KINETIC,
    ACTION_OPEN_PDF,
    ACTION_COPY_LINK,
    ACTION_SELECT_CATEGORY,
    ACTION_SELECT_TEMPLATE
};

struct StartHitResult {
    StartActionType action;
    int index;
};

// Global interactive state for start interfaces
struct StartUIState {
    int hoverId = -1;
    int selectedCategory = 0;
    std::wstring toastMessage = L"";
    DWORD toastExpireTime = 0;

    void ShowToast(const std::wstring& msg) {
        toastMessage = msg;
        toastExpireTime = GetTickCount() + 2500;
    }
};

// Helper: Open external URL safely
inline void OpenWebUrl(HWND hwnd, const wchar_t* url) {
    ShellExecuteW(hwnd, L"open", url, NULL, NULL, SW_SHOWNORMAL);
}

// Helper: Launch or switch to peer app in installation directory
inline void LaunchAppOrSwitch(HWND hwnd, const wchar_t* exeName) {
    wchar_t exePath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);
    std::wstring target = std::wstring(exePath) + L"\\" + exeName;
    if (PathFileExistsW(target.c_str())) {
        ShellExecuteW(hwnd, L"open", target.c_str(), NULL, exePath, SW_SHOWNORMAL);
    }
}

// Helper: Copy sovereign web link to clipboard
inline void CopyToolLink(HWND hwnd, const wchar_t* toolHash, StartUIState& state) {
    std::wstring url = std::wstring(L"https://giri-orbit.pages.dev/#") + toolHash;
    if (OpenClipboard(hwnd)) {
        EmptyClipboard();
        size_t len = (url.length() + 1) * sizeof(wchar_t);
        HGLOBAL hMem = GlobalAlloc(GMEM_MOVEABLE, len);
        if (hMem) {
            memcpy(GlobalLock(hMem), url.c_str(), len);
            GlobalUnlock(hMem);
            SetClipboardData(CF_UNICODETEXT, hMem);
        }
        CloseClipboard();
        state.ShowToast(L"Link copied to clipboard!");
        InvalidateRect(hwnd, NULL, FALSE);
    }
}

// Helper: Draw rounded rectangle path
inline void AddRoundedRect(GraphicsPath& path, const RectF& rect, float radius) {
    float d = radius * 2.0f;
    path.AddArc(rect.X, rect.Y, d, d, 180, 90);
    path.AddArc(rect.X + rect.Width - d, rect.Y, d, d, 270, 90);
    path.AddArc(rect.X + rect.Width - d, rect.Y + rect.Height - d, d, d, 0, 90);
    path.AddArc(rect.X, rect.Y + rect.Height - d, d, d, 90, 90);
    path.CloseFigure();
}

// Core Rendering Engine for Start Interface
inline void RenderStartInterface(Graphics& g, int w, int h, const ToolThemeConfig& cfg, StartUIState& state) {
    g.SetSmoothingMode(SmoothingModeAntiAlias);
    g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

    // =========================================================================
    // 1. TOP NAVIGATION BAR (y: 0 to 48)
    // =========================================================================
    SolidBrush topNavBg(Color(7, 11, 20)); // Deep obsidian navy
    g.FillRectangle(&topNavBg, 0, 0, w, 48);

    Pen topBorderPen(Color(30, 41, 59), 1.0f);
    g.DrawLine(&topBorderPen, 0, 47, w, 47);

    // Left brand icon
    RectF brandIconRect(20.0f, 11.0f, 26.0f, 26.0f);
    GraphicsPath brandIconPath;
    AddRoundedRect(brandIconPath, brandIconRect, 5.0f);
    SolidBrush brandIconBg(cfg.accentColor);
    g.FillPath(&brandIconBg, &brandIconPath);

    Font fLetter(L"Segoe UI", 11.0f, FontStyleBold, UnitPoint);
    SolidBrush whiteBrush(Color(255, 255, 255));
    StringFormat sfCenter;
    sfCenter.SetAlignment(StringAlignmentCenter);
    sfCenter.SetLineAlignment(StringAlignmentCenter);
    g.DrawString(cfg.toolLetter.c_str(), -1, &fLetter, PointF(33.0f, 23.5f), &sfCenter, &whiteBrush);

    // Full Tool Name
    Font fToolName(L"Segoe UI", 10.5f, FontStyleBold, UnitPoint);
    SolidBrush textLight(Color(248, 250, 252));
    g.DrawString(cfg.fullToolName.c_str(), -1, &fToolName, PointF(54.0f, 13.0f), &textLight);

    // Sub-actions in top bar
    Font fSubNav(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
    SolidBrush textMuted(Color(148, 163, 184));
    std::wstring subnav = L"·   Create Blank   Templates   Custom Templates";
    float nameOffset = (float)(54 + (int)cfg.fullToolName.length() * 9);
    g.DrawString(subnav.c_str(), -1, &fSubNav, PointF(nameOffset, 15.0f), &textMuted);

    // Right Switcher Pills
    struct TopPill {
        const wchar_t* label;
        int id;
        int width;
        bool isActive;
    };
    TopPill pills[] = {
        { L"Hub", 100, 48, false },
        { L"Drift", 101, 48, (cfg.toolHash == L"drift") },
        { L"Axis", 102, 48, (cfg.toolHash == L"axis") },
        { L"Kinetic", 103, 56, (cfg.toolHash == L"kinetic") },
        { L"Aegis PDF", 104, 70, false },
        { L"🔗 Copy Link", 105, 88, false }
    };

    float pillRight = (float)w - 20.0f;
    for (int i = 5; i >= 0; --i) {
        float pillW = (float)pills[i].width;
        float pillX = pillRight - pillW;
        RectF pillRect(pillX, 11.0f, pillW, 26.0f);
        GraphicsPath pPath;
        AddRoundedRect(pPath, pillRect, 13.0f);

        bool isHover = (state.hoverId == pills[i].id);
        if (pills[i].isActive) {
            SolidBrush actBg(cfg.accentDark);
            Pen actBorder(cfg.accentColor, 1.0f);
            g.FillPath(&actBg, &pPath);
            g.DrawPath(&actBorder, &pPath);
            Font fPillAct(L"Segoe UI", 8.5f, FontStyleBold, UnitPoint);
            g.DrawString(pills[i].label, -1, &fPillAct, PointF(pillX + pillW / 2.0f, 23.5f), &sfCenter, &whiteBrush);
        } else {
            SolidBrush inactBg(isHover ? Color(40, 53, 72) : Color(20, 27, 45));
            Pen inactBorder(Color(45, 55, 72), 1.0f);
            g.FillPath(&inactBg, &pPath);
            g.DrawPath(&inactBorder, &pPath);
            Font fPill(L"Segoe UI", 8.5f, isHover ? FontStyleBold : FontStyleRegular, UnitPoint);
            SolidBrush pText(isHover ? Color(255, 255, 255) : Color(203, 213, 225));
            g.DrawString(pills[i].label, -1, &fPill, PointF(pillX + pillW / 2.0f, 23.5f), &sfCenter, &pText);
        }
        pillRight = pillX - 8.0f;
    }

    // =========================================================================
    // 2. HERO SECTION (y: 48 to 365)
    // =========================================================================
    SolidBrush heroBg(Color(11, 16, 30));
    g.FillRectangle(&heroBg, 0, 48, w, 317);

    // Subtle ambient glow on right
    GraphicsPath glowPath;
    glowPath.AddEllipse((float)w - 400.0f, 60.0f, 380.0f, 260.0f);
    PathGradientBrush pgb(&glowPath);
    Color centerColor(35, cfg.accentColor.GetR(), cfg.accentColor.GetG(), cfg.accentColor.GetB());
    pgb.SetCenterColor(centerColor);
    Color surroundColor(0, 11, 16, 30);
    int sCount = 1;
    pgb.SetSurroundColors(&surroundColor, &sCount);
    g.FillPath(&pgb, &glowPath);

    // Tool badge: [Icon] Drift
    RectF badgeRect(48.0f, 68.0f, 96.0f, 26.0f);
    GraphicsPath bPath;
    AddRoundedRect(bPath, badgeRect, 6.0f);
    SolidBrush badgeBg(Color(20, 30, 50));
    Pen badgeBorder(Color(37, 50, 75), 1.0f);
    g.FillPath(&badgeBg, &bPath);
    g.DrawPath(&badgeBorder, &bPath);

    RectF bIconR(54.0f, 72.0f, 18.0f, 18.0f);
    GraphicsPath biPath;
    AddRoundedRect(biPath, bIconR, 3.0f);
    g.FillPath(&brandIconBg, &biPath);
    Font fMiniLetter(L"Segoe UI", 8.0f, FontStyleBold, UnitPoint);
    g.DrawString(cfg.toolLetter.c_str(), -1, &fMiniLetter, PointF(63.0f, 80.5f), &sfCenter, &whiteBrush);

    Font fBadgeText(L"Segoe UI", 9.5f, FontStyleBold, UnitPoint);
    SolidBrush badgeTextB(Color(241, 245, 249));
    g.DrawString(cfg.toolName.c_str(), -1, &fBadgeText, PointF(76.0f, 71.0f), &badgeTextB);

    // Headline
    Font fHeadline(L"Segoe UI", 21.0f, FontStyleBold, UnitPoint);
    g.DrawString(cfg.headline.c_str(), -1, &fHeadline, PointF(48.0f, 102.0f), &whiteBrush);

    // Subtitle
    Font fSubtitle(L"Segoe UI", 9.8f, FontStyleRegular, UnitPoint);
    RectF subRect(48.0f, 145.0f, 620.0f, 44.0f);
    g.DrawString(cfg.subtitle.c_str(), -1, &fSubtitle, subRect, NULL, &textMuted);

    // Link Cards: OFFICIAL PORTAL & FOLLOW THE JOURNEY
    // 1. Official Portal Card (id: 201)
    RectF portalRect(48.0f, 198.0f, 280.0f, 44.0f);
    GraphicsPath portalPath;
    AddRoundedRect(portalPath, portalRect, 8.0f);
    bool isPortalHover = (state.hoverId == 201);
    SolidBrush portalBg(isPortalHover ? Color(24, 34, 56) : Color(15, 23, 42));
    Pen portalBorder(isPortalHover ? Color(59, 130, 246) : Color(30, 41, 59), 1.0f);
    g.FillPath(&portalBg, &portalPath);
    g.DrawPath(&portalBorder, &portalPath);

    // Portal icon
    RectF pIconBox(58.0f, 207.0f, 26.0f, 26.0f);
    GraphicsPath piBoxPath;
    AddRoundedRect(piBoxPath, pIconBox, 5.0f);
    SolidBrush piBoxBg(Color(30, 58, 138));
    g.FillPath(&piBoxBg, &piBoxPath);
    Pen piPen(Color(147, 197, 253), 1.2f);
    g.DrawEllipse(&piPen, 64.0f, 213.0f, 14.0f, 14.0f);

    Font fPortalLabel(L"Segoe UI", 7.5f, FontStyleBold, UnitPoint);
    SolidBrush fPortalLblB(Color(148, 163, 184));
    g.DrawString(L"OFFICIAL PORTAL", -1, &fPortalLabel, PointF(92.0f, 203.0f), &fPortalLblB);

    Font fPortalUrl(L"Segoe UI", 8.8f, FontStyleBold, UnitPoint);
    SolidBrush fPortalUrlB(isPortalHover ? Color(147, 197, 253) : Color(96, 165, 250));
    g.DrawString(L"Abhinav Giri github.com/abhinavgiri45/giri-orbit →", -1, &fPortalUrl, PointF(92.0f, 218.0f), &fPortalUrlB);

    // 2. Follow Journey Instagram Card (id: 202)
    RectF igRect(338.0f, 198.0f, 260.0f, 44.0f);
    GraphicsPath igPath;
    AddRoundedRect(igPath, igRect, 8.0f);
    bool isIgHover = (state.hoverId == 202);
    SolidBrush igBg(isIgHover ? Color(35, 25, 45) : Color(15, 23, 42));
    Pen igBorder(isIgHover ? Color(236, 72, 153) : Color(30, 41, 59), 1.0f);
    g.FillPath(&igBg, &igPath);
    g.DrawPath(&igBorder, &igPath);

    // IG icon box
    RectF igIconBox(348.0f, 207.0f, 26.0f, 26.0f);
    GraphicsPath igiBoxPath;
    AddRoundedRect(igiBoxPath, igIconBox, 5.0f);
    SolidBrush igiBoxBg(Color(157, 23, 77));
    g.FillPath(&igiBoxBg, &igiBoxPath);
    Pen igiPen(Color(251, 207, 232), 1.2f);
    g.DrawRectangle(&igiPen, 353.0f, 212.0f, 16.0f, 16.0f);
    g.DrawEllipse(&igiPen, 357.0f, 216.0f, 8.0f, 8.0f);

    Font fIgLabel(L"Segoe UI", 7.5f, FontStyleBold, UnitPoint);
    g.DrawString(L"FOLLOW THE JOURNEY", -1, &fIgLabel, PointF(382.0f, 203.0f), &fPortalLblB);

    Font fIgUrl(L"Segoe UI", 8.8f, FontStyleBold, UnitPoint);
    SolidBrush fIgUrlB(isIgHover ? Color(244, 114, 182) : Color(248, 250, 252));
    g.DrawString(L"@abhinavgiri45 Connect on Instagram →", -1, &fIgUrl, PointF(382.0f, 218.0f), &fIgUrlB);

    // Action Buttons Row (y: 256)
    // 1. Create Blank Primary Pill (id: 301)
    RectF createRect(48.0f, 256.0f, 195.0f, 38.0f);
    GraphicsPath crPath;
    AddRoundedRect(crPath, createRect, 19.0f);
    bool isCreateHover = (state.hoverId == 301);
    SolidBrush crBg(isCreateHover ? cfg.accentHover : cfg.accentColor);
    g.FillPath(&crBg, &crPath);
    Font fBtnBold(L"Segoe UI", 9.2f, FontStyleBold, UnitPoint);
    std::wstring createText = L"⊕  " + cfg.createBtnText;
    g.DrawString(createText.c_str(), -1, &fBtnBold, PointF(145.0f, 274.5f), &sfCenter, &whiteBrush);

    // 2. Upload Button (id: 302)
    RectF upRect(253.0f, 256.0f, 135.0f, 38.0f);
    GraphicsPath upPath;
    AddRoundedRect(upPath, upRect, 19.0f);
    bool isUpHover = (state.hoverId == 302);
    SolidBrush upBg(isUpHover ? Color(30, 41, 59) : Color(18, 26, 44));
    Pen upBorder(isUpHover ? Color(100, 116, 139) : Color(51, 65, 85), 1.0f);
    g.FillPath(&upBg, &upPath);
    g.DrawPath(&upBorder, &upPath);
    std::wstring upText = L"↑  " + cfg.uploadBtnText;
    SolidBrush upTextB(isUpHover ? Color(255, 255, 255) : Color(226, 232, 240));
    g.DrawString(upText.c_str(), -1, &fBtnBold, PointF(320.0f, 274.5f), &sfCenter, &upTextB);

    // 3. Custom Template Button (id: 303)
    RectF custRect(398.0f, 256.0f, 150.0f, 38.0f);
    GraphicsPath custPath;
    AddRoundedRect(custPath, custRect, 19.0f);
    bool isCustHover = (state.hoverId == 303);
    SolidBrush custBg(isCustHover ? Color(25, 35, 52) : Color(15, 23, 42));
    Pen custBorder(isCustHover ? Color(96, 165, 250) : Color(64, 78, 100), 1.0f);
    custBorder.SetDashStyle(DashStyleDash);
    g.FillPath(&custBg, &custPath);
    g.DrawPath(&custBorder, &custPath);
    SolidBrush custTextB(isCustHover ? Color(248, 250, 252) : Color(148, 163, 184));
    g.DrawString(L"+ Custom Template", -1, &fBtnBold, PointF(473.0f, 274.5f), &sfCenter, &custTextB);

    // 4. Import Template Button (id: 304)
    RectF impRect(48.0f, 306.0f, 135.0f, 28.0f);
    GraphicsPath impPath;
    AddRoundedRect(impPath, impRect, 6.0f);
    bool isImpHover = (state.hoverId == 304);
    SolidBrush impBg(isImpHover ? Color(25, 35, 55) : Color(15, 23, 42));
    Pen impBorder(isImpHover ? Color(100, 116, 139) : Color(30, 41, 59), 1.0f);
    g.FillPath(&impBg, &impPath);
    g.DrawPath(&impBorder, &impPath);
    Font fMiniBtn(L"Segoe UI", 8.3f, FontStyleBold, UnitPoint);
    g.DrawString(L"↑ Import Template", -1, &fMiniBtn, PointF(115.5f, 319.5f), &sfCenter, &custTextB);

    // 3D Isometric Art on the right side of hero
    float artX = (float)w - 380.0f;
    float artY = 90.0f;
    if (artX > 620.0f) {
        if (cfg.illustrationType == 0) {
            // DRIFT: 3D Isometric Document Stack & Colored Pens
            // Shadow
            SolidBrush ash(Color(25, 0, 0, 0));
            g.FillRectangle(&ash, artX + 25.0f, artY + 45.0f, 180.0f, 190.0f);

            // Blue folder behind
            SolidBrush fldBg(Color(30, 58, 138));
            g.FillRectangle(&fldBg, artX + 40.0f, artY + 20.0f, 175.0f, 195.0f);
            SolidBrush fldLight(Color(37, 99, 235));
            g.FillRectangle(&fldLight, artX + 40.0f, artY + 20.0f, 60.0f, 16.0f);

            // White paper sheet in front
            SolidBrush paperBg(Color(255, 255, 255));
            g.FillRectangle(&paperBg, artX + 15.0f, artY + 35.0f, 165.0f, 190.0f);
            Pen paperBorder(Color(203, 213, 225), 1.0f);
            g.DrawRectangle(&paperBorder, artX + 15.0f, artY + 35.0f, 165.0f, 190.0f);

            // Header line on sheet
            SolidBrush lineBlue(Color(37, 99, 235));
            g.FillRectangle(&lineBlue, artX + 30.0f, artY + 55.0f, 90.0f, 7.0f);

            // Content lines
            SolidBrush lineGrey(Color(226, 232, 240));
            for (int l = 0; l < 8; ++l) {
                float lw = (l % 2 == 0) ? 130.0f : 100.0f;
                g.FillRectangle(&lineGrey, artX + 30.0f, artY + 75.0f + l * 14.0f, lw, 5.0f);
            }

            // Pen Cup on right
            SolidBrush cupBg(Color(241, 245, 249));
            g.FillRectangle(&cupBg, artX + 175.0f, artY + 120.0f, 42.0f, 65.0f);
            Pen cupPen(Color(203, 213, 225), 1.0f);
            g.DrawRectangle(&cupPen, artX + 175.0f, artY + 120.0f, 42.0f, 65.0f);

            // Pencils in cup
            SolidBrush pAmber(Color(245, 158, 11));
            SolidBrush pGreen(Color(16, 185, 129));
            SolidBrush pRed(Color(239, 68, 68));
            g.FillRectangle(&pAmber, artX + 180.0f, artY + 75.0f, 6.0f, 45.0f);
            g.FillRectangle(&pGreen, artX + 192.0f, artY + 68.0f, 6.0f, 52.0f);
            g.FillRectangle(&pRed, artX + 204.0f, artY + 80.0f, 6.0f, 40.0f);
        } else if (cfg.illustrationType == 1) {
            // AXIS: 3D Isometric Column Bars Chart
            SolidBrush gridFloor(Color(15, 23, 42));
            g.FillRectangle(&gridFloor, artX + 10.0f, artY + 150.0f, 220.0f, 40.0f);
            Pen gridLine(Color(30, 41, 59), 1.0f);
            for (int k = 0; k < 6; ++k) {
                g.DrawLine(&gridLine, artX + 10.0f + k * 40.0f, artY + 150.0f, artX + 10.0f + k * 40.0f, artY + 190.0f);
            }

            // Rising 3D Emerald Bars
            SolidBrush b1(Color(16, 185, 129));
            SolidBrush b1Top(Color(52, 211, 153));
            g.FillRectangle(&b1, artX + 35.0f, artY + 80.0f, 32.0f, 90.0f);
            g.FillRectangle(&b1Top, artX + 35.0f, artY + 74.0f, 32.0f, 6.0f);

            SolidBrush b2(Color(5, 150, 105));
            SolidBrush b2Top(Color(16, 185, 129));
            g.FillRectangle(&b2, artX + 85.0f, artY + 50.0f, 32.0f, 120.0f);
            g.FillRectangle(&b2Top, artX + 85.0f, artY + 44.0f, 32.0f, 6.0f);

            SolidBrush b3(Color(4, 120, 87));
            SolidBrush b3Top(Color(52, 211, 153));
            g.FillRectangle(&b3, artX + 135.0f, artY + 25.0f, 32.0f, 145.0f);
            g.FillRectangle(&b3Top, artX + 135.0f, artY + 19.0f, 32.0f, 6.0f);

            SolidBrush b4(Color(16, 185, 129));
            SolidBrush b4Top(Color(110, 231, 183));
            g.FillRectangle(&b4, artX + 185.0f, artY + 60.0f, 32.0f, 110.0f);
            g.FillRectangle(&b4Top, artX + 185.0f, artY + 54.0f, 32.0f, 6.0f);
        } else if (cfg.illustrationType == 2) {
            // KINETIC: 3D Presentation Monitor
            SolidBrush monBase(Color(15, 23, 42));
            g.FillRectangle(&monBase, artX + 30.0f, artY + 30.0f, 220.0f, 140.0f);
            Pen monPen(Color(249, 115, 22), 1.5f);
            g.DrawRectangle(&monPen, artX + 30.0f, artY + 30.0f, 220.0f, 140.0f);

            SolidBrush slideScreen(Color(25, 35, 55));
            g.FillRectangle(&slideScreen, artX + 40.0f, artY + 40.0f, 200.0f, 120.0f);

            SolidBrush oranBar(Color(249, 115, 22));
            g.FillRectangle(&oranBar, artX + 55.0f, artY + 58.0f, 60.0f, 8.0f);
            SolidBrush textGrey(Color(100, 116, 139));
            g.FillRectangle(&textGrey, artX + 55.0f, artY + 75.0f, 100.0f, 6.0f);
            g.FillRectangle(&textGrey, artX + 55.0f, artY + 90.0f, 80.0f, 6.0f);

            // Play Circle
            SolidBrush playBg(Color(234, 88, 12));
            g.FillEllipse(&playBg, artX + 175.0f, artY + 75.0f, 42.0f, 42.0f);
            PointF tri[3] = { PointF(artX + 192.0f, artY + 88.0f), PointF(artX + 192.0f, artY + 104.0f), PointF(artX + 206.0f, artY + 96.0f) };
            g.FillPolygon(&whiteBrush, tri, 3);
        }
    }

    // =========================================================================
    // 3. DRAFT RESUME BANNER (y: 375, h: 56)
    // =========================================================================
    RectF draftRect(48.0f, 375.0f, (float)w - 96.0f, 56.0f);
    GraphicsPath dPath;
    AddRoundedRect(dPath, draftRect, 10.0f);
    SolidBrush draftBg(Color(17, 24, 39));
    Pen draftBorder(Color(31, 41, 55), 1.0f);
    g.FillPath(&draftBg, &dPath);
    g.DrawPath(&draftBorder, &dPath);

    // Tool Icon Box
    RectF dIconR(62.0f, 387.0f, 32.0f, 32.0f);
    GraphicsPath diPath;
    AddRoundedRect(diPath, dIconR, 6.0f);
    SolidBrush diBg(cfg.accentDark);
    Pen diPen(cfg.accentColor, 1.0f);
    g.FillPath(&diBg, &diPath);
    g.DrawPath(&diPen, &diPath);
    g.DrawString(cfg.toolLetter.c_str(), -1, &fLetter, PointF(78.0f, 402.5f), &sfCenter, &whiteBrush);

    // Title
    std::wstring draftHeading = L"Pick up where you left off in " + cfg.toolName;
    Font fDraftHead(L"Segoe UI", 10.0f, FontStyleBold, UnitPoint);
    g.DrawString(draftHeading.c_str(), -1, &fDraftHead, PointF(106.0f, 384.0f), &textLight);

    // Green status dot
    SolidBrush greenDot(Color(34, 197, 94));
    g.FillEllipse(&greenDot, 107.0f, 408.0f, 7.0f, 7.0f);

    // Metadata
    std::wstring draftFullMeta = cfg.draftTitle + L" · " + cfg.draftMeta;
    Font fDraftMeta(L"Segoe UI", 8.5f, FontStyleRegular, UnitPoint);
    g.DrawString(draftFullMeta.c_str(), -1, &fDraftMeta, PointF(120.0f, 404.0f), &textMuted);

    // Delete Draft Button (id: 401)
    float delW = 96.0f;
    float delX = (float)w - 245.0f;
    RectF delRect(delX, 387.0f, delW, 32.0f);
    GraphicsPath delPath;
    AddRoundedRect(delPath, delRect, 6.0f);
    bool isDelHover = (state.hoverId == 401);
    SolidBrush delBg(isDelHover ? Color(45, 18, 25) : Color(25, 15, 20));
    Pen delBorder(isDelHover ? Color(239, 68, 68) : Color(127, 29, 29), 1.0f);
    g.FillPath(&delBg, &delPath);
    g.DrawPath(&delBorder, &delPath);
    Font fDelFont(L"Segoe UI", 8.8f, FontStyleBold, UnitPoint);
    SolidBrush delText(isDelHover ? Color(252, 165, 165) : Color(248, 113, 113));
    g.DrawString(L"🗑 Delete Draft", -1, &fDelFont, PointF(delX + delW / 2.0f, 402.5f), &sfCenter, &delText);

    // Resume Work Button (id: 402)
    float resW = 125.0f;
    float resX = (float)w - 140.0f;
    RectF resRect(resX, 387.0f, resW, 32.0f);
    GraphicsPath resPath;
    AddRoundedRect(resPath, resRect, 6.0f);
    bool isResHover = (state.hoverId == 402);
    SolidBrush resBg(isResHover ? cfg.accentHover : cfg.accentColor);
    g.FillPath(&resBg, &resPath);
    g.DrawString(L"▶ Resume Work →", -1, &fDelFont, PointF(resX + resW / 2.0f, 402.5f), &sfCenter, &whiteBrush);

    // =========================================================================
    // 4. TEMPLATE GALLERY SECTION (y: 445 to h)
    // =========================================================================
    SolidBrush galBg(Color(248, 250, 252));
    g.FillRectangle(&galBg, 0, 445, w, h - 445);
    Pen galBorderTop(Color(226, 232, 240), 1.0f);
    g.DrawLine(&galBorderTop, 0, 445, w, 445);

    // Section Header
    Font fGalHead(L"Segoe UI", 13.0f, FontStyleBold, UnitPoint);
    SolidBrush darkText(Color(15, 23, 42));
    g.DrawString(cfg.galleryTitle.c_str(), -1, &fGalHead, PointF(48.0f, 456.0f), &darkText);

    // Optional Gallery Badge
    if (!cfg.galleryBadge.empty()) {
        RectF gBadgeR(360.0f, 458.0f, 190.0f, 22.0f);
        GraphicsPath gbPath;
        AddRoundedRect(gbPath, gBadgeR, 11.0f);
        SolidBrush gbBg(Color(241, 245, 249));
        Pen gbPen(Color(203, 213, 225), 1.0f);
        g.FillPath(&gbBg, &gbPath);
        g.DrawPath(&gbPen, &gbPath);
        Font fGbFont(L"Segoe UI", 8.0f, FontStyleBold, UnitPoint);
        SolidBrush gbText(Color(16, 185, 129));
        g.DrawString(cfg.galleryBadge.c_str(), -1, &fGbFont, PointF(455.0f, 468.5f), &sfCenter, &gbText);
    }

    // Category Filter Pills (y: 490)
    float catX = 48.0f;
    for (size_t c = 0; c < cfg.categories.size(); ++c) {
        float cW = (float)(cfg.categories[c].length() * 8 + 26);
        if (cW < 60.0f) cW = 60.0f;
        RectF cRect(catX, 490.0f, cW, 28.0f);
        GraphicsPath cpPath;
        AddRoundedRect(cpPath, cRect, 14.0f);

        bool isCatActive = ((int)c == state.selectedCategory);
        bool isCatHover = (state.hoverId == (500 + (int)c));

        if (isCatActive) {
            SolidBrush actCatBg(Color(15, 23, 42));
            g.FillPath(&actCatBg, &cpPath);
            Font fCatAct(L"Segoe UI", 8.8f, FontStyleBold, UnitPoint);
            g.DrawString(cfg.categories[c].c_str(), -1, &fCatAct, PointF(catX + cW / 2.0f, 503.5f), &sfCenter, &whiteBrush);
        } else {
            SolidBrush inactCatBg(isCatHover ? Color(226, 232, 240) : Color(255, 255, 255));
            Pen inactCatPen(Color(203, 213, 225), 1.0f);
            g.FillPath(&inactCatBg, &cpPath);
            g.DrawPath(&inactCatPen, &cpPath);
            Font fCat(L"Segoe UI", 8.8f, FontStyleRegular, UnitPoint);
            SolidBrush inactCatText(Color(71, 85, 105));
            g.DrawString(cfg.categories[c].c_str(), -1, &fCat, PointF(catX + cW / 2.0f, 503.5f), &sfCenter, &inactCatText);
        }
        catX += cW + 10.0f;
    }

    // Search Box on Right (y: 490)
    float sBoxW = 200.0f;
    float sBoxX = (float)w - sBoxW - 48.0f;
    RectF sBoxR(sBoxX, 490.0f, sBoxW, 28.0f);
    GraphicsPath sbPath;
    AddRoundedRect(sbPath, sBoxR, 6.0f);
    SolidBrush sbBg(Color(255, 255, 255));
    Pen sbPen(Color(203, 213, 225), 1.0f);
    g.FillPath(&sbBg, &sbPath);
    g.DrawPath(&sbPen, &sbPath);
    Font fSearch(L"Segoe UI", 8.5f, FontStyleRegular, UnitPoint);
    SolidBrush searchColor(Color(148, 163, 184));
    g.DrawString(L"🔍  Search templates", -1, &fSearch, PointF(sBoxX + 12.0f, 496.0f), &searchColor);

    // 6 Template Cards Grid (y: 530)
    int cardsPerRow = 3;
    float cardMarginX = 48.0f;
    float cardGap = 16.0f;
    float totalGridW = (float)w - cardMarginX * 2.0f;
    float cardW = (totalGridW - cardGap * (cardsPerRow - 1)) / cardsPerRow;
    if (cardW < 220.0f) cardW = 220.0f;
    float cardH = 115.0f;

    for (size_t t = 0; t < cfg.templates.size() && t < 6; ++t) {
        int row = (int)(t / cardsPerRow);
        int col = (int)(t % cardsPerRow);

        float cx = cardMarginX + col * (cardW + cardGap);
        float cy = 530.0f + row * (cardH + 16.0f);

        RectF cardRect(cx, cy, cardW, cardH);
        GraphicsPath cdPath;
        AddRoundedRect(cdPath, cardRect, 8.0f);

        bool isCardHover = (state.hoverId == (600 + (int)t));

        // Subtle Drop shadow
        RectF shRect(cx + 1.0f, cy + 2.0f, cardW, cardH);
        GraphicsPath shPath;
        AddRoundedRect(shPath, shRect, 8.0f);
        SolidBrush cardSh(isCardHover ? Color(20, 0, 0, 0) : Color(8, 0, 0, 0));
        g.FillPath(&cardSh, &shPath);

        // Card Body
        SolidBrush cBg(Color(255, 255, 255));
        Pen cBorder(isCardHover ? cfg.accentColor : Color(226, 232, 240), isCardHover ? 1.5f : 1.0f);
        g.FillPath(&cBg, &cdPath);
        g.DrawPath(&cBorder, &cdPath);

        // Top mini preview stripe
        RectF pStrip(cx, cy, cardW, 24.0f);
        GraphicsPath psPath;
        float d = 8.0f * 2.0f;
        psPath.AddArc(cx, cy, d, d, 180, 90);
        psPath.AddArc(cx + cardW - d, cy, d, d, 270, 90);
        psPath.AddLine(cx + cardW, cy + 24.0f, cx, cy + 24.0f);
        psPath.CloseFigure();
        SolidBrush psBg(isCardHover ? Color(239, 246, 255) : Color(248, 250, 252));
        Pen psLine(Color(226, 232, 240), 1.0f);
        g.FillPath(&psBg, &psPath);
        g.DrawLine(&psLine, cx, cy + 24.0f, cx + cardW, cy + 24.0f);

        // Mini preview lines on stripe
        SolidBrush miniLine(cfg.accentColor);
        g.FillRectangle(&miniLine, cx + 12.0f, cy + 8.0f, 40.0f, 4.0f);
        SolidBrush miniGrey(Color(203, 213, 225));
        g.FillRectangle(&miniGrey, cx + 58.0f, cy + 8.0f, 30.0f, 4.0f);

        // Title
        Font fCardTitle(L"Segoe UI", 9.2f, FontStyleBold, UnitPoint);
        SolidBrush ctBrush(Color(15, 23, 42));
        g.DrawString(cfg.templates[t].title.c_str(), -1, &fCardTitle, PointF(cx + 12.0f, cy + 32.0f), &ctBrush);

        // Category Tag
        Font fCardCat(L"Segoe UI", 7.6f, FontStyleBold, UnitPoint);
        SolidBrush catTagColor(cfg.accentDark);
        g.DrawString(cfg.templates[t].category.c_str(), -1, &fCardCat, PointF(cx + 12.0f, cy + 52.0f), &catTagColor);

        // Description
        Font fCardDesc(L"Segoe UI", 8.2f, FontStyleRegular, UnitPoint);
        SolidBrush cdBrush(Color(100, 116, 139));
        RectF descRect(cx + 12.0f, cy + 68.0f, cardW - 24.0f, 40.0f);
        g.DrawString(cfg.templates[t].description.c_str(), -1, &fCardDesc, descRect, NULL, &cdBrush);
    }

    // =========================================================================
    // 5. TOAST NOTIFICATION (if active)
    // =========================================================================
    if (!state.toastMessage.empty() && GetTickCount() < state.toastExpireTime) {
        float toastW = 280.0f;
        float toastH = 38.0f;
        float toastX = ((float)w - toastW) / 2.0f;
        float toastY = (float)h - 60.0f;

        RectF tRect(toastX, toastY, toastW, toastH);
        GraphicsPath tPath;
        AddRoundedRect(tPath, tRect, 19.0f);
        SolidBrush tBg(Color(15, 23, 42));
        Pen tBorder(Color(59, 130, 246), 1.0f);
        g.FillPath(&tBg, &tPath);
        g.DrawPath(&tBorder, &tPath);

        Font fToast(L"Segoe UI", 9.0f, FontStyleBold, UnitPoint);
        g.DrawString(state.toastMessage.c_str(), -1, &fToast, PointF(toastX + toastW / 2.0f, toastY + toastH / 2.0f), &sfCenter, &whiteBrush);
    }
}

// Core Hit-testing for Start Interface
inline StartHitResult HitTestStartInterface(int x, int y, int w, int h, const ToolThemeConfig& cfg, StartUIState& state) {
    StartHitResult res = { ACTION_NONE, -1 };

    // 1. Top Nav Switcher Pills (y: 11 to 37)
    if (y >= 11 && y <= 37) {
        struct TopPill {
            int id;
            int width;
            StartActionType act;
        };
        TopPill pills[] = {
            { 100, 48, ACTION_SWITCH_HUB },
            { 101, 48, ACTION_SWITCH_DRIFT },
            { 102, 48, ACTION_SWITCH_AXIS },
            { 103, 56, ACTION_SWITCH_KINETIC },
            { 104, 70, ACTION_OPEN_PDF },
            { 105, 88, ACTION_COPY_LINK }
        };

        float pillRight = (float)w - 20.0f;
        for (int i = 5; i >= 0; --i) {
            float pillW = (float)pills[i].width;
            float pillX = pillRight - pillW;
            if (x >= pillX && x <= pillRight) {
                res.action = pills[i].act;
                res.index = pills[i].id;
                return res;
            }
            pillRight = pillX - 8.0f;
        }
    }

    // 2. Link Cards (y: 198 to 242)
    if (y >= 198 && y <= 242) {
        if (x >= 48 && x <= 328) {
            res.action = ACTION_OPEN_PORTAL;
            res.index = 201;
            return res;
        }
        if (x >= 338 && x <= 598) {
            res.action = ACTION_OPEN_INSTAGRAM;
            res.index = 202;
            return res;
        }
    }

    // 3. Action Buttons (y: 256 to 294)
    if (y >= 256 && y <= 294) {
        if (x >= 48 && x <= 243) {
            res.action = ACTION_CREATE_BLANK;
            res.index = 301;
            return res;
        }
        if (x >= 253 && x <= 388) {
            res.action = ACTION_UPLOAD_FILE;
            res.index = 302;
            return res;
        }
        if (x >= 398 && x <= 548) {
            res.action = ACTION_CUSTOM_TEMPLATE;
            res.index = 303;
            return res;
        }
    }

    // Import Template Button (y: 306 to 334)
    if (y >= 306 && y <= 334 && x >= 48 && x <= 183) {
        res.action = ACTION_IMPORT_TEMPLATE;
        res.index = 304;
        return res;
    }

    // 4. Draft Banner (y: 375 to 431)
    if (y >= 375 && y <= 431) {
        float delX = (float)w - 245.0f;
        if (x >= delX && x <= delX + 96.0f) {
            res.action = ACTION_DELETE_DRAFT;
            res.index = 401;
            return res;
        }
        float resX = (float)w - 140.0f;
        if (x >= resX && x <= resX + 125.0f) {
            res.action = ACTION_RESUME_DRAFT;
            res.index = 402;
            return res;
        }
    }

    // 5. Category Pills (y: 490 to 518)
    if (y >= 490 && y <= 518) {
        float catX = 48.0f;
        for (size_t c = 0; c < cfg.categories.size(); ++c) {
            float cW = (float)(cfg.categories[c].length() * 8 + 26);
            if (cW < 60.0f) cW = 60.0f;
            if (x >= catX && x <= catX + cW) {
                res.action = ACTION_SELECT_CATEGORY;
                res.index = (int)c;
                return res;
            }
            catX += cW + 10.0f;
        }
    }

    // 6. Template Cards (y: 530 onwards)
    if (y >= 530) {
        int cardsPerRow = 3;
        float cardMarginX = 48.0f;
        float cardGap = 16.0f;
        float totalGridW = (float)w - cardMarginX * 2.0f;
        float cardW = (totalGridW - cardGap * (cardsPerRow - 1)) / cardsPerRow;
        if (cardW < 220.0f) cardW = 220.0f;
        float cardH = 115.0f;

        for (size_t t = 0; t < cfg.templates.size() && t < 6; ++t) {
            int row = (int)(t / cardsPerRow);
            int col = (int)(t % cardsPerRow);

            float cx = cardMarginX + col * (cardW + cardGap);
            float cy = 530.0f + row * (cardH + 16.0f);

            if (x >= cx && x <= cx + cardW && y >= cy && y <= cy + cardH) {
                res.action = ACTION_SELECT_TEMPLATE;
                res.index = (int)t;
                return res;
            }
        }
    }

    return res;
}

} // namespace GiriOrbit
