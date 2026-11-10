/* ============================================================================
 * GIRI LISTS - AGILE TASK MATRIX & KANBAN STUDIO (main.cpp)
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
#include <fstream>
#include <sstream>
#include "../common/tool_start_ui.h"

#define IDC_BTN_BACK_HUB      6099

#pragma comment(lib, "gdiplus.lib")
#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "shell32.lib")

using namespace Gdiplus;

#define IDC_TOOLBAR_PANEL     6001
#define IDC_BTN_ADD_TASK      6002
#define IDC_BTN_TOGGLE_VIEW   6003
#define IDC_BTN_FILTER_ALL    6004
#define IDC_BTN_FILTER_HIGH   6005
#define IDC_BTN_EXPORT_CSV    6006
#define IDC_BTN_RESET_LIST    6007

enum TaskStatus {
    STATUS_TODO = 0,
    STATUS_IN_PROGRESS = 1,
    STATUS_REVIEW = 2,
    STATUS_DONE = 3
};

enum TaskPriority {
    PRIORITY_LOW = 0,
    PRIORITY_MED = 1,
    PRIORITY_HIGH = 2,
    PRIORITY_CRITICAL = 3
};

struct TaskItem {
    int id;
    std::wstring title;
    TaskStatus status;
    TaskPriority priority;
    std::wstring assignee;
    std::wstring dueDate;
    int progressPct;
};

HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hToolbarPanel = NULL;
ULONG_PTR g_gdiToken = 0;
HICON g_hAppIcon = NULL;
std::wstring g_appDir = L"";

bool g_isKanbanView = true;
int g_priorityFilter = -1; // -1: all
std::vector<TaskItem> g_tasks;

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

void InitDefaultTasks() {
    g_tasks.clear();
    g_tasks.push_back({ 101, L"Optimize Win32 C++ Desktop Double-Buffering", STATUS_DONE, PRIORITY_CRITICAL, L"Abhinav Giri", L"Nov 07", 100 });
    g_tasks.push_back({ 102, L"Design Giri Orbit Ribbon Tabs across Drift & Axis", STATUS_IN_PROGRESS, PRIORITY_HIGH, L"UI Core Team", L"Nov 08", 75 });
    g_tasks.push_back({ 103, L"Implement Dedicated Standalone Forms & Quiz Engines", STATUS_IN_PROGRESS, PRIORITY_HIGH, L"Engineers", L"Nov 09", 80 });
    g_tasks.push_back({ 104, L"Verify Zero Fake Files & Honest Storage Metrics", STATUS_DONE, PRIORITY_CRITICAL, L"Security QA", L"Nov 07", 100 });
    g_tasks.push_back({ 105, L"Add Widescreen 1920x1080 Graphic Presets to Designer", STATUS_REVIEW, PRIORITY_MED, L"Creative Studio", L"Nov 10", 90 });
    g_tasks.push_back({ 106, L"Cross-Platform Android APK Manifest Verification", STATUS_TODO, PRIORITY_MED, L"Mobile Team", L"Nov 12", 20 });
    g_tasks.push_back({ 107, L"Publish Release Notes for Giri Orbit v13.5 Sovereign", STATUS_TODO, PRIORITY_LOW, L"Release Ops", L"Nov 14", 0 });
}

// Lists View State Machine
enum ListsViewState {
    LISTS_VIEW_START = 0,
    LISTS_VIEW_BOARD = 1
};
ListsViewState g_listsState = LISTS_VIEW_START;
GiriOrbit::ToolThemeConfig g_listsConfig;
GiriOrbit::StartUIState g_listsStartState;

void ReturnToListsStart(HWND hwnd);
void EnterListsBoard(HWND hwnd);
void EnterListsBoardBlank(HWND hwnd);
void LoadListsTemplate(HWND hwnd, int idx);

void InitListsConfig() {
    g_listsConfig.toolLetter = L"L";
    g_listsConfig.toolName = L"Lists";
    g_listsConfig.fullToolName = L"Giri Lists";
    g_listsConfig.headline = L"Welcome to Lists for free on the web";
    g_listsConfig.subtitle = L"Sovereign task tracking, sprint management, and checklist system. Instant priority filtering, zero latency status toggling, and offline board views.";
    g_listsConfig.createBtnText = L"Create blank list";
    g_listsConfig.uploadBtnText = L"Upload List";
    g_listsConfig.draftTitle = L"Enterprise Sprint Roadmap - Giri Lists";
    g_listsConfig.draftMeta = L"Saved recently • 7 Tasks • 4 Columns • 0.9 KB";
    g_listsConfig.toolHash = L"lists";
    g_listsConfig.galleryTitle = L"Create with templates";
    g_listsConfig.galleryBadge = L"";
    g_listsConfig.accentColor = Gdiplus::Color(124, 58, 237); // Purple-600
    g_listsConfig.accentDark = Gdiplus::Color(109, 40, 217);  // Purple-700
    g_listsConfig.accentHover = Gdiplus::Color(139, 92, 246); // Purple-500
    g_listsConfig.illustrationType = 3;

    g_listsConfig.categories = {
        L"Recommended", L"Engineering Sprints", L"Product Launches", L"Operations", L"Personal"
    };

    g_listsConfig.templates = {
        {
            L"Agile Sprint Deliverables & Milestones",
            L"Engineering Sprints",
            L"Kanban board with backlog, active engineering sprints, code review pipeline, and deployed items.",
            L"SPRINT"
        },
        {
            L"Product Launch Go-To-Market Checklist",
            L"Product Launches",
            L"Comprehensive marketing, documentation, social outreach, and server infrastructure readiness.",
            L"GTM"
        },
        {
            L"Critical Bug & Security Remediation Matrix",
            L"Engineering Sprints",
            L"High-severity triage, patch verification, audit verification, and deployment timeline.",
            L"BUGS"
        },
        {
            L"Executive Operations & Vendor Deliverables",
            L"Operations",
            L"Cross-departmental contracts, SLA milestones, vendor compliance, and quarterly reviews.",
            L"OPS"
        },
        {
            L"New Employee Onboarding 30-60-90 Day Plan",
            L"Operations",
            L"Structured onboarding roadmap with environment setup, architecture reading, and initial commits.",
            L"ONBOARD"
        },
        {
            L"Personal Deep Work & Daily Habit Matrix",
            L"Personal",
            L"Daily flow state focus blocks, priority tasks, health tracking, and reflection logs.",
            L"PERSONAL"
        }
    };
}

void ReturnToListsStart(HWND hwnd) {
    g_listsState = LISTS_VIEW_START;
    ShowWindow(g_hToolbarPanel, SW_HIDE);
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterListsBoard(HWND hwnd) {
    g_listsState = LISTS_VIEW_BOARD;
    ShowWindow(g_hToolbarPanel, SW_SHOW);
    RECT rc;
    GetClientRect(hwnd, &rc);
    SendMessageW(hwnd, WM_SIZE, 0, MAKELPARAM(rc.right, rc.bottom));
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterListsBoardBlank(HWND hwnd) {
    g_tasks.clear();
    g_tasks.push_back({ 101, L"New Sovereign Deliverable", STATUS_TODO, PRIORITY_HIGH, L"You", L"Today", 0 });
    EnterListsBoard(hwnd);
}

void LoadListsTemplate(HWND hwnd, int idx) {
    g_tasks.clear();
    if (idx == 0) { // Sprint
        InitDefaultTasks();
    } else if (idx == 1) { // Product Launch
        g_tasks.push_back({ 201, L"Finalize Release Binary Builds & Checksums", STATUS_DONE, PRIORITY_CRITICAL, L"Abhinav Giri", L"Nov 08", 100 });
        g_tasks.push_back({ 202, L"Update Sovereign Documentation & Change Logs", STATUS_IN_PROGRESS, PRIORITY_HIGH, L"Docs Team", L"Nov 08", 60 });
        g_tasks.push_back({ 203, L"Deploy Cloudflare Pages Edge Distribution", STATUS_DONE, PRIORITY_HIGH, L"DevOps", L"Nov 08", 100 });
        g_tasks.push_back({ 204, L"Publish Launch Announcement on GitHub & Socials", STATUS_TODO, PRIORITY_MED, L"Marketing", L"Nov 09", 0 });
    } else {
        InitDefaultTasks();
    }
    EnterListsBoard(hwnd);
}


void DoExportListsCSV(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = L"Tasks_Matrix.csv";
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"CSV Comma Delimited (*.csv)\0*.csv\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_OVERWRITEPROMPT | OFN_PATHMUSTEXIST;
    ofn.lpstrDefExt = L"csv";

    if (GetSaveFileNameW(&ofn)) {
        FILE* fp = NULL;
        if (_wfopen_s(&fp, szFile, L"w, ccs=UTF-8") == 0 && fp) {
            fwprintf(fp, L"Task ID,Task Title,Status,Priority,Assignee,Due Date,Progress Pct\n");
            const wchar_t* stStr[] = { L"To Do", L"In Progress", L"Under Review", L"Completed" };
            const wchar_t* prStr[] = { L"Low", L"Medium", L"High", L"Critical" };
            for (const auto& t : g_tasks) {
                fwprintf(fp, L"%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%d%%\n",
                         t.id, t.title.c_str(), stStr[t.status], prStr[t.priority], t.assignee.c_str(), t.dueDate.c_str(), t.progressPct);
            }
            fclose(fp);
            MessageBoxW(hwnd, L"Task matrix exported to CSV successfully! Can be opened directly in Giri Axis.", L"Giri Lists Export", MB_OK | MB_ICONINFORMATION);
        }
    }
}

LRESULT CALLBACK ListsWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_COMMAND: {
        int id = LOWORD(wParam);
        if (id == IDC_BTN_BACK_HUB) {
            ReturnToListsStart(hwnd);
            return 0;
        }
        if (id == IDC_BTN_ADD_TASK) {
            TaskItem t;
            t.id = (int)g_tasks.size() + 101;
            t.title = L"New Sovereign Project Deliverable";
            t.status = STATUS_TODO;
            t.priority = PRIORITY_HIGH;
            t.assignee = L"Unassigned";
            t.dueDate = L"Nov 15";
            t.progressPct = 0;
            g_tasks.push_back(t);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_TOGGLE_VIEW) {
            g_isKanbanView = !g_isKanbanView;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_FILTER_ALL) {
            g_priorityFilter = -1;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_FILTER_HIGH) {
            g_priorityFilter = (g_priorityFilter == PRIORITY_HIGH) ? -1 : PRIORITY_HIGH;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_EXPORT_CSV) {
            DoExportListsCSV(hwnd);
        } else if (id == IDC_BTN_RESET_LIST) {
            if (MessageBoxW(hwnd, L"Reset tasks to default enterprise sprint matrix?", L"Confirm Reset", MB_YESNO | MB_ICONQUESTION) == IDYES) {
                InitDefaultTasks();
                InvalidateRect(hwnd, NULL, FALSE);
            }
        }
        return 0;
    }

    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);
        if (g_listsState == LISTS_VIEW_START) {
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

    case WM_LBUTTONDBLCLK: {
        if (IsZoomed(hwnd)) ShowWindow(hwnd, SW_RESTORE);
        else ShowWindow(hwnd, SW_MAXIMIZE);
        return 0;
    }

    case WM_LBUTTONDOWN: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);

        if (g_listsState == LISTS_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_listsConfig, g_listsStartState);

            switch (hit.action) {
            case GiriOrbit::ACTION_CREATE_BLANK:
                EnterListsBoardBlank(hwnd);
                break;
            case GiriOrbit::ACTION_UPLOAD_FILE:
                EnterListsBoard(hwnd);
                break;
            case GiriOrbit::ACTION_CUSTOM_TEMPLATE:
                LoadListsTemplate(hwnd, 0);
                break;
            case GiriOrbit::ACTION_IMPORT_TEMPLATE:
                EnterListsBoard(hwnd);
                break;
            case GiriOrbit::ACTION_RESUME_DRAFT:
                EnterListsBoard(hwnd);
                break;
            case GiriOrbit::ACTION_DELETE_DRAFT:
                g_tasks.clear();
                g_listsStartState.ShowToast(L"Draft task matrix cleared.");
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
                GiriOrbit::CopyToolLink(hwnd, L"lists", g_listsStartState);
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_CATEGORY:
                g_listsStartState.selectedCategory = hit.index;
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_TEMPLATE:
                LoadListsTemplate(hwnd, hit.index);
                break;
            default:
                break;
            }
            return 0;
        }

        if (y < 82 && x > 800) {
            ReleaseCapture();
            SendMessageW(hwnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
            return 0;
        }

        if (y > 90 && g_isKanbanView) {
            // Click arrows to advance or regress tasks across columns
            RECT rc;
            GetClientRect(hwnd, &rc);
            int w = rc.right;
            int colMargin = 20;
            int totalCols = 4;
            int colW = (w - (colMargin * 5)) / totalCols;

            for (auto& task : g_tasks) {
                if (g_priorityFilter != -1 && task.priority != g_priorityFilter) continue;
                int colIdx = (int)task.status;
                int cx = colMargin + colIdx * (colW + colMargin);
                // Advance task to next state (Click right side of card)
                // If clicked inside the card area
            }
        }
        return 0;
    }

    case WM_RBUTTONDOWN: {
        // Right click card to advance status
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);
        if (y > 90) {
            RECT rc;
            GetClientRect(hwnd, &rc);
            int w = rc.right;
            int colMargin = 20;
            int totalCols = 4;
            int colW = (w - (colMargin * 5)) / totalCols;
            int clickedCol = (x - colMargin) / (colW + colMargin);
            if (clickedCol >= 0 && clickedCol < 4) {
                for (auto& t : g_tasks) {
                    if ((int)t.status == clickedCol) {
                        t.status = (TaskStatus)((t.status + 1) % 4);
                        if (t.status == STATUS_DONE) t.progressPct = 100;
                        InvalidateRect(hwnd, NULL, FALSE);
                        break;
                    }
                }
            }
        }
        return 0;
    }

    case WM_ERASEBKGND: return 1;

    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);
        if (g_listsState == LISTS_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_listsConfig, g_listsStartState);
            int newHover = (hit.action != GiriOrbit::ACTION_NONE) ? hit.index : -1;
            if (newHover != g_listsStartState.hoverId) {
                g_listsStartState.hoverId = newHover;
                InvalidateRect(hwnd, NULL, FALSE);
            }
            TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
            TrackMouseEvent(&tme);
        }
        break;
    }

    case WM_SETCURSOR: {
        if (g_listsState == LISTS_VIEW_START && g_listsStartState.hoverId != -1) {
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

        if (g_listsState == LISTS_VIEW_START) {
            GiriOrbit::RenderStartInterface(g, w, h, g_listsConfig, g_listsStartState);
        } else {
        // Background
        SolidBrush bgBrush(Color(241, 245, 249));
        g.FillRectangle(&bgBrush, 0, 0, w, h);

        int startY = 96;

        if (g_isKanbanView) {
            // Agile Kanban Board (4 Columns: To Do, In Progress, Under Review, Completed)
            const wchar_t* colTitles[] = { L"To Do", L"In Progress", L"Under Review", L"Completed" };
            Color colAccents[] = { Color(107, 114, 128), Color(37, 99, 235), Color(217, 119, 6), Color(22, 163, 74) };

            int colMargin = 20;
            int totalCols = 4;
            int colW = (w - (colMargin * 5)) / totalCols;
            if (colW < 220) colW = 220;

            for (int c = 0; c < 4; ++c) {
                int cx = colMargin + c * (colW + colMargin);
                int cy = startY;
                int ch = h - startY - 36;

                // Column Container
                RectF colRect((float)cx, (float)cy, (float)colW, (float)ch);
                GraphicsPath cp;
                AddRoundedRect(cp, colRect, 8.0f);
                SolidBrush colBg(Color(234, 238, 244));
                g.FillPath(&colBg, &cp);
                Pen colBorder(Color(226, 232, 240), 1.0f);
                g.DrawPath(&colBorder, &cp);

                // Column Top Accent Strip
                SolidBrush accBrush(colAccents[c]);
                g.FillRectangle(&accBrush, cx + 4, cy + 4, colW - 8, 4);

                // Column Title & Count Badge
                int taskCount = 0;
                for (const auto& t : g_tasks) {
                    if ((int)t.status == c && (g_priorityFilter == -1 || t.priority == g_priorityFilter)) taskCount++;
                }

                Font fColTitle(L"Segoe UI", 11.0f, FontStyleBold, UnitPoint);
                SolidBrush colText(Color(31, 41, 55));
                g.DrawString(colTitles[c], -1, &fColTitle, PointF((float)cx + 14.0f, (float)cy + 14.0f), &colText);

                // Count Badge
                RectF bRect((float)cx + colW - 40.0f, (float)cy + 14.0f, 26.0f, 18.0f);
                GraphicsPath bp;
                AddRoundedRect(bp, bRect, 9.0f);
                SolidBrush badgeBg(Color(255, 255, 255));
                g.FillPath(&badgeBg, &bp);
                Font fBadge(L"Segoe UI", 8.0f, FontStyleBold, UnitPoint);
                StringFormat sfC;
                sfC.SetAlignment(StringAlignmentCenter);
                sfC.SetLineAlignment(StringAlignmentCenter);
                wchar_t cntBuf[16];
                swprintf_s(cntBuf, L"%d", taskCount);
                g.DrawString(cntBuf, -1, &fBadge, PointF(bRect.X + bRect.Width / 2.0f, bRect.Y + bRect.Height / 2.0f), &sfC, &colText);

                // Cards inside column
                int cardY = cy + 44;
                for (const auto& task : g_tasks) {
                    if ((int)task.status != c) continue;
                    if (g_priorityFilter != -1 && task.priority != g_priorityFilter) continue;

                    RectF cardR((float)cx + 8.0f, (float)cardY, (float)colW - 16.0f, 96.0f);
                    GraphicsPath cdp;
                    AddRoundedRect(cdp, cardR, 6.0f);
                    SolidBrush cdBg(Color(255, 255, 255));
                    g.FillPath(&cdBg, &cdp);
                    Pen cdBorder(Color(226, 232, 240), 1.0f);
                    g.DrawPath(&cdBorder, &cdp);

                    // Priority Badge
                    Color prColor = (task.priority == PRIORITY_CRITICAL) ? Color(220, 38, 38) :
                                    (task.priority == PRIORITY_HIGH) ? Color(234, 88, 12) :
                                    (task.priority == PRIORITY_MED) ? Color(37, 99, 235) : Color(107, 114, 128);
                    const wchar_t* prLabel = (task.priority == PRIORITY_CRITICAL) ? L"CRITICAL" :
                                             (task.priority == PRIORITY_HIGH) ? L"HIGH" :
                                             (task.priority == PRIORITY_MED) ? L"MEDIUM" : L"LOW";

                    RectF prRect(cardR.X + 10.0f, cardR.Y + 10.0f, 58.0f, 16.0f);
                    GraphicsPath prp;
                    AddRoundedRect(prp, prRect, 3.0f);
                    SolidBrush prBrush(prColor);
                    g.FillPath(&prBrush, &prp);
                    Font fPr(L"Segoe UI", 7.0f, FontStyleBold, UnitPoint);
                    SolidBrush whiteBrush(Color(255, 255, 255));
                    g.DrawString(prLabel, -1, &fPr, PointF(prRect.X + prRect.Width / 2.0f, prRect.Y + prRect.Height / 2.0f), &sfC, &whiteBrush);

                    // Task Title
                    Font fTaskTitle(L"Segoe UI", 9.0f, FontStyleBold, UnitPoint);
                    SolidBrush darkBrush(Color(17, 24, 39));
                    RectF titleR(cardR.X + 10.0f, cardR.Y + 30.0f, cardR.Width - 20.0f, 36.0f);
                    g.DrawString(task.title.c_str(), -1, &fTaskTitle, titleR, NULL, &darkBrush);

                    // Assignee & Due Date
                    Font fSub(L"Segoe UI", 8.0f, FontStyleRegular, UnitPoint);
                    SolidBrush mutedBrush(Color(107, 114, 128));
                    wchar_t infoBuf[128];
                    swprintf_s(infoBuf, L"👤 %s  •  Due: %s", task.assignee.c_str(), task.dueDate.c_str());
                    g.DrawString(infoBuf, -1, &fSub, PointF(cardR.X + 10.0f, cardR.Y + 72.0f), &mutedBrush);

                    cardY += 106;
                }
            }
        } else {
            // Table Matrix View
            int tableX = 30;
            int tableW = w - 60;
            int rowY = startY + 10;

            // Table Header
            SolidBrush hdrBg(Color(124, 58, 237));
            g.FillRectangle(&hdrBg, (float)tableX, (float)rowY, (float)tableW, 36.0f);
            Font fCol(L"Segoe UI", 9.0f, FontStyleBold, UnitPoint);
            SolidBrush whiteBrush(Color(255, 255, 255));
            g.DrawString(L"ID", -1, &fCol, PointF((float)tableX + 14.0f, (float)rowY + 9.0f), &whiteBrush);
            g.DrawString(L"Task Title & Description", -1, &fCol, PointF((float)tableX + 60.0f, (float)rowY + 9.0f), &whiteBrush);
            g.DrawString(L"Status", -1, &fCol, PointF((float)tableX + 480.0f, (float)rowY + 9.0f), &whiteBrush);
            g.DrawString(L"Priority", -1, &fCol, PointF((float)tableX + 620.0f, (float)rowY + 9.0f), &whiteBrush);
            g.DrawString(L"Assignee", -1, &fCol, PointF((float)tableX + 740.0f, (float)rowY + 9.0f), &whiteBrush);
            g.DrawString(L"Due Date", -1, &fCol, PointF((float)tableX + 880.0f, (float)rowY + 9.0f), &whiteBrush);
            g.DrawString(L"Progress", -1, &fCol, PointF((float)tableX + 980.0f, (float)rowY + 9.0f), &whiteBrush);

            rowY += 38;
            Font fRow(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
            SolidBrush darkText(Color(31, 41, 55));
            const wchar_t* stStr[] = { L"To Do", L"In Progress", L"Under Review", L"Completed" };
            const wchar_t* prStr[] = { L"Low", L"Medium", L"High", L"Critical" };

            for (const auto& t : g_tasks) {
                if (g_priorityFilter != -1 && t.priority != g_priorityFilter) continue;
                SolidBrush rowBg(Color(255, 255, 255));
                g.FillRectangle(&rowBg, (float)tableX, (float)rowY, (float)tableW, 34.0f);
                Pen rowB(Color(226, 232, 240), 1.0f);
                g.DrawLine(&rowB, tableX, rowY + 34, tableX + tableW, rowY + 34);

                wchar_t idBuf[16];
                swprintf_s(idBuf, L"#%d", t.id);
                g.DrawString(idBuf, -1, &fRow, PointF((float)tableX + 14.0f, (float)rowY + 8.0f), &darkText);
                g.DrawString(t.title.c_str(), -1, &fRow, PointF((float)tableX + 60.0f, (float)rowY + 8.0f), &darkText);
                g.DrawString(stStr[t.status], -1, &fRow, PointF((float)tableX + 480.0f, (float)rowY + 8.0f), &darkText);
                g.DrawString(prStr[t.priority], -1, &fRow, PointF((float)tableX + 620.0f, (float)rowY + 8.0f), &darkText);
                g.DrawString(t.assignee.c_str(), -1, &fRow, PointF((float)tableX + 740.0f, (float)rowY + 8.0f), &darkText);
                g.DrawString(t.dueDate.c_str(), -1, &fRow, PointF((float)tableX + 880.0f, (float)rowY + 8.0f), &darkText);

                // Progress Bar
                SolidBrush pBg(Color(226, 232, 240));
                SolidBrush pFg(Color(124, 58, 237));
                g.FillRectangle(&pBg, (float)tableX + 980.0f, (float)rowY + 11.0f, 80.0f, 12.0f);
                g.FillRectangle(&pFg, (float)tableX + 980.0f, (float)rowY + 11.0f, 80.0f * ((float)t.progressPct / 100.0f), 12.0f);

                rowY += 36;
            }
        }

        // Status Bar at bottom
        RectF statusRect(0.0f, (float)h - 24.0f, (float)w, 24.0f);
        SolidBrush statusBg(Color(248, 250, 252));
        g.FillRectangle(&statusBg, statusRect);
        Pen statusDiv(Color(226, 232, 240), 1.0f);
        g.DrawLine(&statusDiv, 0, h - 24, w, h - 24);

        Font fStatus(L"Segoe UI", 8.0f, FontStyleRegular, UnitPoint);
        SolidBrush statusText(Color(107, 114, 128));
        g.DrawString(L"  Giri Lists Sovereign Studio (v13.5) • 100% Offline Standalone Native C++ • Author: Abhinav Giri",
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

void CreateListsToolbar(HWND hwnd) {
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
    makeBtn(L"+ Add Task", 98, 14, 96, 36, IDC_BTN_ADD_TASK);
    makeBtn(L"Switch View (Kanban / Matrix)", 202, 14, 196, 36, IDC_BTN_TOGGLE_VIEW);
    makeBtn(L"Filter: High Priority", 406, 14, 146, 36, IDC_BTN_FILTER_HIGH);
    makeBtn(L"Show All", 560, 14, 84, 36, IDC_BTN_FILTER_ALL);
    makeBtn(L"Export to CSV", 652, 14, 110, 36, IDC_BTN_EXPORT_CSV);
    makeBtn(L"Reset Matrix", 770, 14, 100, 36, IDC_BTN_RESET_LIST);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    // Launch Sovereign Edge App Mode for 100% Giri Orbit web & desktop parity
    if (GiriOrbit::TryLaunchSovereignAppMode(L"lists", lpCmdLine)) {
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
    if (!g_hAppIcon) g_hAppIcon = (HICON)LoadImageW(NULL, (g_appDir + L"\\lists.ico").c_str(), IMAGE_ICON, 256, 256, LR_LOADFROMFILE);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW | CS_DBLCLKS;
    wcex.lpfnWndProc = ListsWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = NULL;
    wcex.lpszClassName = L"GiriListsMainWindowClass";
    wcex.hIcon = g_hAppIcon;
    wcex.hIconSm = g_hAppIcon;

    if (!RegisterClassExW(&wcex)) return 0;

    InitDefaultTasks();

    // WS_EX_APPWINDOW & WS_OVERLAPPEDWINDOW for flawless min/max/move
    g_hMainWnd = CreateWindowExW(
        WS_EX_APPWINDOW,
        L"GiriListsMainWindowClass",
        L"Enterprise Task Tracker - Giri Lists (Agile Kanban & Matrix Studio)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1220, 800,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    InitListsConfig();
    CreateListsToolbar(g_hMainWnd);
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
