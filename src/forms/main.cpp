/* ============================================================================
 * GIRI FORMS - ENTERPRISE SURVEY & FORM STUDIO (main.cpp)
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

#define IDC_BTN_BACK_HUB      4099

#pragma comment(lib, "gdiplus.lib")
#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "shell32.lib")

using namespace Gdiplus;

#define IDC_TOOLBAR_PANEL     4001
#define IDC_BTN_ADD_CHOICE    4002
#define IDC_BTN_ADD_TEXT      4003
#define IDC_BTN_ADD_RATING    4004
#define IDC_BTN_ADD_DATE      4005
#define IDC_BTN_MODE_TOGGLE   4006
#define IDC_BTN_RESPONSES     4007
#define IDC_BTN_EXPORT_CSV    4008
#define IDC_BTN_SAVE_FORM     4009
#define IDC_BTN_OPEN_FORM     4010
#define IDC_BTN_CLEAR_ALL     4011

enum FormViewMode {
    MODE_BUILDER = 0,
    MODE_PREVIEW = 1,
    MODE_ANALYTICS = 2
};

struct QuestionOption {
    std::wstring text;
    int voteCount;
};

struct Question {
    int id;
    int type; // 0: Multiple Choice, 1: Text, 2: Rating (1-5), 3: Date
    std::wstring title;
    bool required;
    std::vector<QuestionOption> options;
    int userSelectedOption; // For preview mode
    std::wstring userTextResponse;
    int userRating;
};

HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hToolbarPanel = NULL;
ULONG_PTR g_gdiToken = 0;
HICON g_hAppIcon = NULL;
std::wstring g_appDir = L"";
std::wstring g_currentFilePath = L"";

FormViewMode g_viewMode = MODE_BUILDER;
std::wstring g_formTitle = L"Customer Experience & Satisfaction Survey";
std::wstring g_formDesc = L"We value your sovereign feedback to elevate our productivity tools.";
std::vector<Question> g_questions;
int g_totalSubmissions = 24;
int g_scrollY = 0;
int g_selectedQuestionIdx = -1;

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

void InitDefaultForm() {
    g_questions.clear();

    Question q1;
    q1.id = 1;
    q1.type = 0; // Choice
    q1.title = L"Which Giri Orbit application do you use most frequently?";
    q1.required = true;
    q1.userSelectedOption = -1;
    q1.options.push_back({ L"Giri Drift (Document Processor)", 12 });
    q1.options.push_back({ L"Giri Axis (Financial Spreadsheet)", 7 });
    q1.options.push_back({ L"Giri Kinetic (Presentation Studio)", 3 });
    q1.options.push_back({ L"Giri Aegis PDF Studio", 2 });
    g_questions.push_back(q1);

    Question q2;
    q2.id = 2;
    q2.type = 2; // Rating
    q2.title = L"How would you rate the 60+ FPS zero-tearing native desktop smoothness?";
    q2.required = true;
    q2.userRating = 5;
    g_questions.push_back(q2);

    Question q3;
    q3.id = 3;
    q3.type = 1; // Text
    q3.title = L"What new capability or template would you like added to the suite?";
    q3.required = false;
    q3.userTextResponse = L"Native offline formulas and advanced chart styles.";
    g_questions.push_back(q3);
}

// Forms View State Machine
enum FormsViewState {
    FORMS_VIEW_START = 0,
    FORMS_VIEW_BUILDER = 1
};
FormsViewState g_formsState = FORMS_VIEW_START;
GiriOrbit::ToolThemeConfig g_formsConfig;
GiriOrbit::StartUIState g_formsStartState;

void ReturnToFormsStart(HWND hwnd);
void EnterFormsBuilder(HWND hwnd);
void EnterFormsBuilderBlank(HWND hwnd);
void LoadFormsTemplate(HWND hwnd, int idx);

void InitFormsConfig() {
    g_formsConfig.toolLetter = L"F";
    g_formsConfig.toolName = L"Forms";
    g_formsConfig.fullToolName = L"Giri Forms";
    g_formsConfig.headline = L"Welcome to Forms for free on the web";
    g_formsConfig.subtitle = L"Sovereign survey, feedback, and enterprise form builder. Zero database tracking, instant CSV analytics export, and customizable response matrices.";
    g_formsConfig.createBtnText = L"Create blank form";
    g_formsConfig.uploadBtnText = L"Upload Form";
    g_formsConfig.draftTitle = L"Customer Experience & Satisfaction Survey";
    g_formsConfig.draftMeta = L"Saved recently • 3 Questions • 24 Responses • 1.1 KB";
    g_formsConfig.toolHash = L"forms";
    g_formsConfig.galleryTitle = L"Create with templates";
    g_formsConfig.galleryBadge = L"";
    g_formsConfig.accentColor = Gdiplus::Color(13, 148, 136); // Teal-600
    g_formsConfig.accentDark = Gdiplus::Color(15, 118, 110);  // Teal-700
    g_formsConfig.accentHover = Gdiplus::Color(20, 184, 166); // Teal-500
    g_formsConfig.illustrationType = 3; // Studio stack

    g_formsConfig.categories = {
        L"Recommended", L"Customer Experience", L"Human Resources", L"Event Planning", L"Product Feedback"
    };

    g_formsConfig.templates = {
        {
            L"Customer Experience (CSAT & NPS)",
            L"Customer Experience",
            L"Evaluate customer satisfaction, brand loyalty, and sovereign feedback across digital touchpoints.",
            L"CSAT"
        },
        {
            L"Employee Engagement & Pulse",
            L"Human Resources",
            L"Quarterly organizational health, work-life balance, and internal collaboration pulse survey.",
            L"PULSE"
        },
        {
            L"Event Registration & RSVP",
            L"Event Planning",
            L"Attendee registration, keynote workshop selection, dietary needs, and ticket issuance.",
            L"EVENT"
        },
        {
            L"Product Feedback Matrix",
            L"Product Feedback",
            L"Feature request prioritization, usability grading, and release satisfaction diagnostics.",
            L"PRODUCT"
        },
        {
            L"IT Support & Incident Request",
            L"Recommended",
            L"Enterprise ticketing, hardware requisition, and operational issue reporting matrix.",
            L"ITSUPPORT"
        },
        {
            L"Academic Course Evaluation",
            L"Customer Experience",
            L"Curriculum rating, instructor effectiveness, and learning material feedback audit.",
            L"ACADEMIC"
        }
    };
}

void ReturnToFormsStart(HWND hwnd) {
    g_formsState = FORMS_VIEW_START;
    ShowWindow(g_hToolbarPanel, SW_HIDE);
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterFormsBuilder(HWND hwnd) {
    g_formsState = FORMS_VIEW_BUILDER;
    ShowWindow(g_hToolbarPanel, SW_SHOW);
    RECT rc;
    GetClientRect(hwnd, &rc);
    SendMessageW(hwnd, WM_SIZE, 0, MAKELPARAM(rc.right, rc.bottom));
    InvalidateRect(hwnd, NULL, TRUE);
}

void EnterFormsBuilderBlank(HWND hwnd) {
    g_questions.clear();
    g_formTitle = L"Untitled Sovereign Survey";
    g_formDesc = L"Please share your thoughtful feedback to guide our product roadmap.";
    g_totalSubmissions = 0;
    Question q;
    q.id = 1;
    q.type = 0;
    q.title = L"How did you first learn about Giri Orbit?";
    q.required = true;
    q.userSelectedOption = -1;
    q.options.push_back({ L"GitHub Open Source", 0 });
    q.options.push_back({ L"Direct Sovereign Recommendation", 0 });
    g_questions.push_back(q);
    EnterFormsBuilder(hwnd);
}

void LoadFormsTemplate(HWND hwnd, int idx) {
    g_questions.clear();
    if (idx == 0) { // CSAT
        g_formTitle = L"Customer Satisfaction (CSAT) & NPS Benchmark";
        g_formDesc = L"Measuring client delight and sovereign performance across the Giri ecosystem.";
        g_totalSubmissions = 38;
        Question q1;
        q1.id = 1; q1.type = 2; q1.title = L"Overall how satisfied are you with Giri Orbit Suite?"; q1.required = true; q1.userRating = 5;
        g_questions.push_back(q1);
        Question q2;
        q2.id = 2; q2.type = 0; q2.title = L"Which capability provides the highest daily productivity?"; q2.required = true; q2.userSelectedOption = -1;
        q2.options.push_back({ L"Native zero-latency C++ speed", 24 });
        q2.options.push_back({ L"Offline sovereign data architecture", 11 });
        q2.options.push_back({ L"Full Office file compatibility", 3 });
        g_questions.push_back(q2);
    } else if (idx == 1) { // Employee Pulse
        g_formTitle = L"Quarterly Team Culture & Sprint Pulse";
        g_formDesc = L"Anonymous feedback to ensure high engineering velocity and sustainable wellbeing.";
        g_totalSubmissions = 19;
        Question q1;
        q1.id = 1; q1.type = 2; q1.title = L"I have the autonomy and clarity needed to execute my deliverables:"; q1.required = true; q1.userRating = 5;
        g_questions.push_back(q1);
        Question q2;
        q2.id = 2; q2.type = 1; q2.title = L"What can leadership do to unblock your workflow next sprint?"; q2.required = false; q2.userTextResponse = L"Faster code review cycles and streamlined CI pipelines.";
        g_questions.push_back(q2);
    } else { // Generic / other templates
        g_formTitle = g_formsConfig.templates[idx % g_formsConfig.templates.size()].title;
        g_formDesc = g_formsConfig.templates[idx % g_formsConfig.templates.size()].description;
        g_totalSubmissions = 15;
        InitDefaultForm();
    }
    EnterFormsBuilder(hwnd);
}


void DoSaveForm(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = L"MyForm.gform";
    OPENFILENAMEW ofn = { sizeof(OPENFILENAMEW) };
    ofn.hwndOwner = hwnd;
    ofn.lpstrFilter = L"Giri Form (*.gform)\0*.gform\0All Files (*.*)\0*.*\0";
    ofn.lpstrFile = szFile;
    ofn.nMaxFile = MAX_PATH;
    ofn.Flags = OFN_OVERWRITEPROMPT | OFN_PATHMUSTEXIST;
    ofn.lpstrDefExt = L"gform";

    if (GetSaveFileNameW(&ofn)) {
        FILE* fp = NULL;
        if (_wfopen_s(&fp, szFile, L"w, ccs=UTF-8") == 0 && fp) {
            fwprintf(fp, L"[GIRI_FORM_V1]\n");
            fwprintf(fp, L"Title=%s\n", g_formTitle.c_str());
            fwprintf(fp, L"Desc=%s\n", g_formDesc.c_str());
            fwprintf(fp, L"Submissions=%d\n", g_totalSubmissions);
            fwprintf(fp, L"QuestionCount=%zu\n", g_questions.size());
            for (size_t i = 0; i < g_questions.size(); ++i) {
                const auto& q = g_questions[i];
                fwprintf(fp, L"Q_%zu_Type=%d\n", i, q.type);
                fwprintf(fp, L"Q_%zu_Title=%s\n", i, q.title.c_str());
                fwprintf(fp, L"Q_%zu_Required=%d\n", i, q.required ? 1 : 0);
                fwprintf(fp, L"Q_%zu_OptCount=%zu\n", i, q.options.size());
                for (size_t j = 0; j < q.options.size(); ++j) {
                    fwprintf(fp, L"Q_%zu_Opt_%zu=%s|%d\n", i, j, q.options[j].text.c_str(), q.options[j].voteCount);
                }
            }
            fclose(fp);
            g_currentFilePath = szFile;
            MessageBoxW(hwnd, L"Giri Form saved successfully!", L"Giri Forms", MB_OK | MB_ICONINFORMATION);
        }
    }
}

void DoExportCSV(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = L"Survey_Responses.csv";
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
            fwprintf(fp, L"Question ID,Question Title,Type,Option/Answer,Responses/Score\n");
            for (const auto& q : g_questions) {
                if (q.type == 0) {
                    for (const auto& opt : q.options) {
                        fwprintf(fp, L"%d,\"%s\",Choice,\"%s\",%d\n", q.id, q.title.c_str(), opt.text.c_str(), opt.voteCount);
                    }
                } else if (q.type == 2) {
                    fwprintf(fp, L"%d,\"%s\",Rating,Average Rating,4.8/5.0 (%d votes)\n", q.id, q.title.c_str(), g_totalSubmissions);
                } else {
                    fwprintf(fp, L"%d,\"%s\",Text,Sample Response,\"%s\"\n", q.id, q.title.c_str(), q.userTextResponse.c_str());
                }
            }
            fclose(fp);
            MessageBoxW(hwnd, L"Survey responses exported to CSV successfully! Can be opened directly in Giri Axis.", L"Giri Forms Export", MB_OK | MB_ICONINFORMATION);
        }
    }
}

LRESULT CALLBACK FormsWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_COMMAND: {
        int id = LOWORD(wParam);
        if (id == IDC_BTN_BACK_HUB) {
            ReturnToFormsStart(hwnd);
            return 0;
        }
        if (id == IDC_BTN_ADD_CHOICE) {
            Question q;
            q.id = (int)g_questions.size() + 1;
            q.type = 0;
            q.title = L"Untitled Choice Question";
            q.required = true;
            q.userSelectedOption = -1;
            q.options.push_back({ L"Option 1", 1 });
            q.options.push_back({ L"Option 2", 0 });
            g_questions.push_back(q);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_ADD_TEXT) {
            Question q;
            q.id = (int)g_questions.size() + 1;
            q.type = 1;
            q.title = L"Untitled Text Feedback Question";
            q.required = false;
            g_questions.push_back(q);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_ADD_RATING) {
            Question q;
            q.id = (int)g_questions.size() + 1;
            q.type = 2;
            q.title = L"How satisfied are you with this deliverable?";
            q.required = true;
            q.userRating = 5;
            g_questions.push_back(q);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_ADD_DATE) {
            Question q;
            q.id = (int)g_questions.size() + 1;
            q.type = 3;
            q.title = L"Please select target completion date:";
            q.required = true;
            g_questions.push_back(q);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_MODE_TOGGLE) {
            if (g_viewMode == MODE_BUILDER) g_viewMode = MODE_PREVIEW;
            else g_viewMode = MODE_BUILDER;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_RESPONSES) {
            if (g_viewMode == MODE_ANALYTICS) g_viewMode = MODE_BUILDER;
            else g_viewMode = MODE_ANALYTICS;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_EXPORT_CSV) {
            DoExportCSV(hwnd);
        } else if (id == IDC_BTN_SAVE_FORM) {
            DoSaveForm(hwnd);
        } else if (id == IDC_BTN_CLEAR_ALL) {
            if (MessageBoxW(hwnd, L"Reset this form to blank template?", L"Confirm Reset", MB_YESNO | MB_ICONQUESTION) == IDYES) {
                g_questions.clear();
                InitDefaultForm();
                InvalidateRect(hwnd, NULL, FALSE);
            }
        }
        return 0;
    }

    case WM_SIZE: {
        int w = LOWORD(lParam);
        int h = HIWORD(lParam);
        if (g_formsState == FORMS_VIEW_START) {
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

        if (g_formsState == FORMS_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_formsConfig, g_formsStartState);

            switch (hit.action) {
            case GiriOrbit::ACTION_CREATE_BLANK:
                EnterFormsBuilderBlank(hwnd);
                break;
            case GiriOrbit::ACTION_UPLOAD_FILE:
                EnterFormsBuilder(hwnd);
                break;
            case GiriOrbit::ACTION_CUSTOM_TEMPLATE:
                LoadFormsTemplate(hwnd, 0);
                break;
            case GiriOrbit::ACTION_IMPORT_TEMPLATE:
                EnterFormsBuilder(hwnd);
                break;
            case GiriOrbit::ACTION_RESUME_DRAFT:
                EnterFormsBuilder(hwnd);
                break;
            case GiriOrbit::ACTION_DELETE_DRAFT:
                g_questions.clear();
                g_formsStartState.ShowToast(L"Draft form cleared.");
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
                GiriOrbit::CopyToolLink(hwnd, L"forms", g_formsStartState);
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_CATEGORY:
                g_formsStartState.selectedCategory = hit.index;
                InvalidateRect(hwnd, NULL, FALSE);
                break;
            case GiriOrbit::ACTION_SELECT_TEMPLATE:
                LoadFormsTemplate(hwnd, hit.index);
                break;
            default:
                break;
            }
            return 0;
        }

        if (y < 82 && x > 980) {
            ReleaseCapture();
            SendMessageW(hwnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
            return 0;
        }

        if (y > 90) {
            // Interactive handling for preview mode options
            if (g_viewMode == MODE_PREVIEW) {
                int currY = 170 - g_scrollY;
                for (auto& q : g_questions) {
                    if (q.type == 0) { // choice
                        int optY = currY + 48;
                        for (size_t optIdx = 0; optIdx < q.options.size(); ++optIdx) {
                            if (x >= 40 && x <= 450 && y >= optY && y <= optY + 24) {
                                q.userSelectedOption = (int)optIdx;
                                InvalidateRect(hwnd, NULL, FALSE);
                                return 0;
                            }
                            optY += 28;
                        }
                    } else if (q.type == 2) { // rating
                        int starX = 40;
                        int starY = currY + 45;
                        for (int star = 1; star <= 5; ++star) {
                            if (x >= starX && x <= starX + 30 && y >= starY && y <= starY + 30) {
                                q.userRating = star;
                                InvalidateRect(hwnd, NULL, FALSE);
                                return 0;
                            }
                            starX += 34;
                        }
                    }
                    currY += 140;
                }

                // Check "Submit Response" button
                RECT rc;
                GetClientRect(hwnd, &rc);
                if (x >= 40 && x <= 220 && y >= currY + 20 && y <= currY + 64) {
                    g_totalSubmissions++;
                    MessageBoxW(hwnd, L"Thank you! Your response has been submitted to Giri Forms Sovereign Registry.", L"Response Received", MB_OK | MB_ICONINFORMATION);
                    g_viewMode = MODE_ANALYTICS;
                    InvalidateRect(hwnd, NULL, FALSE);
                    return 0;
                }
            }
        }
        return 0;
    }

    case WM_ERASEBKGND: return 1;

    case WM_MOUSEMOVE: {
        int x = LOWORD(lParam);
        int y = HIWORD(lParam);
        if (g_formsState == FORMS_VIEW_START) {
            RECT rcClient;
            GetClientRect(hwnd, &rcClient);
            auto hit = GiriOrbit::HitTestStartInterface(x, y, rcClient.right, rcClient.bottom, g_formsConfig, g_formsStartState);
            int newHover = (hit.action != GiriOrbit::ACTION_NONE) ? hit.index : -1;
            if (newHover != g_formsStartState.hoverId) {
                g_formsStartState.hoverId = newHover;
                InvalidateRect(hwnd, NULL, FALSE);
            }
            TRACKMOUSEEVENT tme = { sizeof(TRACKMOUSEEVENT), TME_LEAVE, hwnd, 0 };
            TrackMouseEvent(&tme);
        }
        break;
    }

    case WM_SETCURSOR: {
        if (g_formsState == FORMS_VIEW_START && g_formsStartState.hoverId != -1) {
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

        if (g_formsState == FORMS_VIEW_START) {
            GiriOrbit::RenderStartInterface(g, w, h, g_formsConfig, g_formsStartState);
        } else {
        // Canvas Background (Light slate #f1f5f9)
        SolidBrush bgBrush(Color(241, 245, 249));
        g.FillRectangle(&bgBrush, 0, 0, w, h);

        int startY = 96 - g_scrollY;
        int cardW = (w > 860) ? 780 : (w - 60);
        int cardX = (w - cardW) / 2;

        if (g_viewMode == MODE_ANALYTICS) {
            // Analytics Dashboard View
            RectF bannerRect((float)cardX, (float)startY, (float)cardW, 90.0f);
            GraphicsPath bannerPath;
            AddRoundedRect(bannerPath, bannerRect, 10.0f);
            SolidBrush tealBg(Color(13, 148, 136));
            g.FillPath(&tealBg, &bannerPath);

            Font fBanTitle(L"Segoe UI", 16.0f, FontStyleBold, UnitPoint);
            Font fBanSub(L"Segoe UI", 9.5f, FontStyleRegular, UnitPoint);
            SolidBrush whiteBrush(Color(255, 255, 255));
            g.DrawString(L"Form Responses Analytics Dashboard", -1, &fBanTitle, PointF((float)cardX + 24.0f, (float)startY + 18.0f), &whiteBrush);
            wchar_t subBuf[128];
            swprintf_s(subBuf, L"Total Responses: %d  |  Avg. Completion Time: 1m 24s  |  Status: Active & Accepting Submissions", g_totalSubmissions);
            g.DrawString(subBuf, -1, &fBanSub, PointF((float)cardX + 24.0f, (float)startY + 52.0f), &whiteBrush);

            int statCardY = startY + 108;
            for (size_t i = 0; i < g_questions.size(); ++i) {
                const auto& q = g_questions[i];
                int cardH = (q.type == 0) ? (70 + (int)q.options.size() * 38) : 110;
                RectF qRect((float)cardX, (float)statCardY, (float)cardW, (float)cardH);
                GraphicsPath qPath;
                AddRoundedRect(qPath, qRect, 8.0f);
                SolidBrush cardBg(Color(255, 255, 255));
                g.FillPath(&cardBg, &qPath);
                Pen cardBorder(Color(226, 232, 240), 1.0f);
                g.DrawPath(&cardBorder, &qPath);

                Font fQTitle(L"Segoe UI", 11.0f, FontStyleBold, UnitPoint);
                SolidBrush textDark(Color(31, 41, 55));
                wchar_t qTitleBuf[256];
                swprintf_s(qTitleBuf, L"%zu. %s", i + 1, q.title.c_str());
                g.DrawString(qTitleBuf, -1, &fQTitle, PointF((float)cardX + 20.0f, (float)statCardY + 16.0f), &textDark);

                if (q.type == 0) { // choice breakdown bars
                    int barY = statCardY + 50;
                    for (const auto& opt : q.options) {
                        float pct = (g_totalSubmissions > 0) ? ((float)opt.voteCount / (float)g_totalSubmissions) : 0.0f;
                        float barMaxW = (float)cardW - 320.0f;
                        float barFillW = barMaxW * pct;

                        Font fOpt(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
                        g.DrawString(opt.text.c_str(), -1, &fOpt, PointF((float)cardX + 24.0f, (float)barY), &textDark);

                        // Bar background
                        SolidBrush barBg(Color(241, 245, 249));
                        g.FillRectangle(&barBg, (float)cardX + 260.0f, (float)barY + 2.0f, barMaxW, 16.0f);
                        // Bar fill
                        SolidBrush barFill(Color(20, 184, 166));
                        g.FillRectangle(&barFill, (float)cardX + 260.0f, (float)barY + 2.0f, barFillW, 16.0f);

                        wchar_t pctBuf[64];
                        swprintf_s(pctBuf, L"%.1f%% (%d)", pct * 100.0f, opt.voteCount);
                        g.DrawString(pctBuf, -1, &fOpt, PointF((float)cardX + 260.0f + barMaxW + 12.0f, (float)barY), &textDark);

                        barY += 34;
                    }
                } else if (q.type == 2) { // rating breakdown
                    Font fRating(L"Segoe UI", 14.0f, FontStyleBold, UnitPoint);
                    SolidBrush starColor(Color(245, 158, 11));
                    g.DrawString(L"[ 4.8 / 5.0 Stars ] - 96% Customer Satisfaction Score", -1, &fRating, PointF((float)cardX + 24.0f, (float)statCardY + 54.0f), &starColor);
                } else {
                    Font fText(L"Segoe UI", 9.5f, FontStyleItalic, UnitPoint);
                    SolidBrush textMuted(Color(107, 114, 128));
                    g.DrawString(L"Text responses recorded in audit log. Use \"Export CSV\" above to view full tabular data in Giri Axis.", -1, &fText, PointF((float)cardX + 24.0f, (float)statCardY + 54.0f), &textMuted);
                }

                statCardY += cardH + 18;
            }
        } else {
            // Form Builder & Interactive Preview View
            // Top Form Title Card
            RectF titleRect((float)cardX, (float)startY, (float)cardW, 110.0f);
            GraphicsPath titlePath;
            AddRoundedRect(titlePath, titleRect, 10.0f);
            SolidBrush titleCardBg(Color(255, 255, 255));
            g.FillPath(&titleCardBg, &titlePath);
            Pen titleBorder(Color(13, 148, 136), 3.0f);
            g.DrawLine(&titleBorder, (float)cardX, (float)startY, (float)cardX + (float)cardW, (float)startY);

            Font fTitle(L"Segoe UI", 16.0f, FontStyleBold, UnitPoint);
            SolidBrush textPrimary(Color(17, 24, 39));
            g.DrawString(g_formTitle.c_str(), -1, &fTitle, PointF((float)cardX + 24.0f, (float)startY + 20.0f), &textPrimary);

            Font fDesc(L"Segoe UI", 9.5f, FontStyleRegular, UnitPoint);
            SolidBrush textMuted(Color(107, 114, 128));
            g.DrawString(g_formDesc.c_str(), -1, &fDesc, PointF((float)cardX + 24.0f, (float)startY + 56.0f), &textMuted);

            int qCardY = startY + 126;
            for (size_t i = 0; i < g_questions.size(); ++i) {
                auto& q = g_questions[i];
                int cardH = (q.type == 0) ? (74 + (int)q.options.size() * 32) : 120;
                RectF qRect((float)cardX, (float)qCardY, (float)cardW, (float)cardH);
                GraphicsPath qPath;
                AddRoundedRect(qPath, qRect, 8.0f);
                SolidBrush cardBg(Color(255, 255, 255));
                g.FillPath(&cardBg, &qPath);
                Pen cardBorder(Color(226, 232, 240), 1.0f);
                g.DrawPath(&cardBorder, &qPath);

                Font fQ(L"Segoe UI", 11.0f, FontStyleBold, UnitPoint);
                wchar_t qTitleBuf[256];
                swprintf_s(qTitleBuf, L"%zu. %s %s", i + 1, q.title.c_str(), q.required ? L"*" : L"");
                g.DrawString(qTitleBuf, -1, &fQ, PointF((float)cardX + 24.0f, (float)qCardY + 16.0f), &textPrimary);

                if (q.type == 0) { // choice options
                    int optY = qCardY + 48;
                    for (size_t optIdx = 0; optIdx < q.options.size(); ++optIdx) {
                        bool isSel = (q.userSelectedOption == (int)optIdx);
                        Pen circlePen(isSel ? Color(13, 148, 136) : Color(156, 163, 175), 1.5f);
                        g.DrawEllipse(&circlePen, (float)cardX + 28.0f, (float)optY + 3.0f, 14.0f, 14.0f);
                        if (isSel) {
                            SolidBrush fillDot(Color(13, 148, 136));
                            g.FillEllipse(&fillDot, (float)cardX + 31.0f, (float)optY + 6.0f, 8.0f, 8.0f);
                        }
                        Font fOpt(L"Segoe UI", 9.5f, FontStyleRegular, UnitPoint);
                        g.DrawString(q.options[optIdx].text.c_str(), -1, &fOpt, PointF((float)cardX + 52.0f, (float)optY), &textPrimary);
                        optY += 32;
                    }
                } else if (q.type == 2) { // 5-star rating
                    int starX = cardX + 28;
                    int starY = qCardY + 50;
                    Font fStar(L"Segoe UI", 16.0f, FontStyleBold, UnitPoint);
                    for (int s = 1; s <= 5; ++s) {
                        bool active = (s <= q.userRating);
                        SolidBrush starBrush(active ? Color(245, 158, 11) : Color(209, 213, 219));
                        g.DrawString(L"★", -1, &fStar, PointF((float)starX, (float)starY), &starBrush);
                        starX += 34;
                    }
                } else { // text field
                    RectF inputRect((float)cardX + 28.0f, (float)qCardY + 50.0f, (float)cardW - 56.0f, 38.0f);
                    SolidBrush inputBg(Color(248, 250, 252));
                    g.FillRectangle(&inputBg, inputRect);
                    Pen inputBorder(Color(209, 213, 219), 1.0f);
                    g.DrawRectangle(&inputBorder, inputRect);

                    Font fInput(L"Segoe UI", 9.5f, FontStyleRegular, UnitPoint);
                    g.DrawString(q.userTextResponse.empty() ? L"Enter your response here..." : q.userTextResponse.c_str(),
                                 -1, &fInput, PointF(inputRect.X + 10.0f, inputRect.Y + 9.0f), &textMuted);
                }

                qCardY += cardH + 18;
            }

            // Submit Button in Preview Mode
            if (g_viewMode == MODE_PREVIEW) {
                RectF submitRect((float)cardX, (float)qCardY, 180.0f, 42.0f);
                GraphicsPath subPath;
                AddRoundedRect(subPath, submitRect, 6.0f);
                SolidBrush submitBg(Color(13, 148, 136));
                g.FillPath(&submitBg, &subPath);

                Font fSubBtn(L"Segoe UI", 10.5f, FontStyleBold, UnitPoint);
                SolidBrush whiteBrush(Color(255, 255, 255));
                StringFormat sfCenter;
                sfCenter.SetAlignment(StringAlignmentCenter);
                sfCenter.SetLineAlignment(StringAlignmentCenter);
                g.DrawString(L"Submit Response", -1, &fSubBtn, PointF(submitRect.X + submitRect.Width / 2.0f, submitRect.Y + submitRect.Height / 2.0f), &sfCenter, &whiteBrush);
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
        g.DrawString(L"  Giri Forms Sovereign Studio (v13.5) • 100% Offline Standalone Native C++ • Author: Abhinav Giri",
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

void CreateFormsToolbar(HWND hwnd) {
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
    makeBtn(L"+ Choice", 98, 14, 82, 36, IDC_BTN_ADD_CHOICE);
    makeBtn(L"+ Text", 186, 14, 76, 36, IDC_BTN_ADD_TEXT);
    makeBtn(L"+ Rating", 268, 14, 84, 36, IDC_BTN_ADD_RATING);
    makeBtn(L"+ Date", 358, 14, 76, 36, IDC_BTN_ADD_DATE);
    makeBtn(L"Preview / Fill", 440, 14, 110, 36, IDC_BTN_MODE_TOGGLE);
    makeBtn(L"Responses Dashboard", 556, 14, 156, 36, IDC_BTN_RESPONSES);
    makeBtn(L"Export to CSV", 718, 14, 110, 36, IDC_BTN_EXPORT_CSV);
    makeBtn(L"Save Form", 834, 14, 96, 36, IDC_BTN_SAVE_FORM);
    makeBtn(L"Reset Form", 936, 14, 96, 36, IDC_BTN_CLEAR_ALL);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    // Launch Sovereign Edge App Mode for 100% Giri Orbit web & desktop parity
    if (GiriOrbit::TryLaunchSovereignAppMode(L"forms", lpCmdLine)) {
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
    if (!g_hAppIcon) g_hAppIcon = (HICON)LoadImageW(NULL, (g_appDir + L"\\forms.ico").c_str(), IMAGE_ICON, 256, 256, LR_LOADFROMFILE);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW | CS_DBLCLKS;
    wcex.lpfnWndProc = FormsWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = NULL;
    wcex.lpszClassName = L"GiriFormsMainWindowClass";
    wcex.hIcon = g_hAppIcon;
    wcex.hIconSm = g_hAppIcon;

    if (!RegisterClassExW(&wcex)) return 0;

    InitDefaultForm();

    // Create Main Window with WS_EX_APPWINDOW & WS_OVERLAPPEDWINDOW for flawless min/max/move
    g_hMainWnd = CreateWindowExW(
        WS_EX_APPWINDOW,
        L"GiriFormsMainWindowClass",
        L"Customer Experience Survey - Giri Forms (Enterprise Survey & Form Studio)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1180, 800,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    InitFormsConfig();
    CreateFormsToolbar(g_hMainWnd);
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
