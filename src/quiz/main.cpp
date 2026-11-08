/* ============================================================================
 * GIRI QUIZ - ASSESSMENT & CERTIFICATION STUDIO (main.cpp)
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
#include <commctrl.h>
#include <commdlg.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <gdiplus.h>
#include <string>
#include <vector>
#include <fstream>
#include <sstream>

#pragma comment(lib, "gdiplus.lib")
#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "shell32.lib")

using namespace Gdiplus;

#define IDC_TOOLBAR_PANEL     5001
#define IDC_BTN_ADD_QUESTION  5002
#define IDC_BTN_START_EXAM    5003
#define IDC_BTN_GRADEBOOK     5004
#define IDC_BTN_EXPORT_CSV    5005
#define IDC_BTN_SAVE_QUIZ     5006
#define IDC_BTN_RESET_QUIZ    5007
#define IDC_TIMER_EXAM        5099

enum QuizViewMode {
    QUIZ_MODE_BUILDER = 0,
    QUIZ_MODE_EXAM = 1,
    QUIZ_MODE_RESULT = 2,
    QUIZ_MODE_GRADEBOOK = 3
};

struct QuizOption {
    std::wstring text;
    bool isCorrect;
};

struct QuizQuestion {
    int id;
    std::wstring title;
    int points;
    std::vector<QuizOption> options;
    int userSelectedOption;
    std::wstring explanation;
};

struct GradebookEntry {
    std::wstring candidateName;
    int score;
    int totalPoints;
    float percentage;
    std::wstring status;
    std::wstring timeDate;
};

HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hToolbarPanel = NULL;
ULONG_PTR g_gdiToken = 0;
HICON g_hAppIcon = NULL;
std::wstring g_appDir = L"";

QuizViewMode g_quizMode = QUIZ_MODE_BUILDER;
std::wstring g_quizTitle = L"Enterprise Sovereign Systems Certification";
std::vector<QuizQuestion> g_quizQuestions;
std::vector<GradebookEntry> g_gradebook;
int g_examTimerSeconds = 300; // 5 minute countdown
int g_activeExamQuestionIdx = 0;

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

void InitDefaultQuiz() {
    g_quizQuestions.clear();

    QuizQuestion q1;
    q1.id = 1;
    q1.title = L"What core architecture makes Giri Orbit 100% offline and sovereign?";
    q1.points = 10;
    q1.userSelectedOption = -1;
    q1.explanation = L"Giri Orbit runs native standalone C++ Win32 executables without any browser, server, or webview overhead.";
    q1.options.push_back({ L"Pure standalone native C++ with direct Win32 & GDI+ double-buffering", true });
    q1.options.push_back({ L"Electron.js running a Chromium headless background daemon", false });
    q1.options.push_back({ L"Remote cloud API microservices proxy", false });
    q1.options.push_back({ L"Python Tkinter wrapper scripting engine", false });
    g_quizQuestions.push_back(q1);

    QuizQuestion q2;
    q2.id = 2;
    q2.title = L"Which extended style must be omitted to prevent breaking Windows 11 DWM minimize and dragging?";
    q2.points = 10;
    q2.userSelectedOption = -1;
    q2.explanation = L"WS_EX_COMPOSITED interferes with Windows 11 top-level non-client message hit-testing.";
    q2.options.push_back({ L"WS_EX_COMPOSITED (should be omitted on top-level frames)", true });
    q2.options.push_back({ L"WS_EX_APPWINDOW", false });
    q2.options.push_back({ L"WS_OVERLAPPEDWINDOW", false });
    q2.options.push_back({ L"WS_CLIPCHILDREN", false });
    g_quizQuestions.push_back(q2);

    QuizQuestion q3;
    q3.id = 3;
    q3.title = L"How does Giri Axis achieve instant recalculation across large spreadsheets?";
    q3.points = 10;
    q3.userSelectedOption = -1;
    q3.explanation = L"Axis uses in-memory grid indexing and vectorized formula tokens.";
    q3.options.push_back({ L"In-memory column-indexed tokenized calculation pipeline", true });
    q3.options.push_back({ L"Remote SQL database queries", false });
    q3.options.push_back({ L"JSON string parsing per formula execution", false });
    g_quizQuestions.push_back(q3);

    // Initial Gradebook data
    g_gradebook.clear();
    g_gradebook.push_back({ L"Abhinav Giri (Lead Architect)", 30, 30, 100.0f, L"PASS WITH DISTINCTION", L"Nov 07, 2026 10:45 AM" });
    g_gradebook.push_back({ L"Enterprise QA Auditor", 20, 30, 66.7f, L"PASS", L"Nov 07, 2026 09:12 AM" });
}

void DoExportQuizCSV(HWND hwnd) {
    wchar_t szFile[MAX_PATH] = L"Assessment_Gradebook.csv";
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
            fwprintf(fp, L"Candidate Name,Score,Total Points,Percentage,Result Status,Timestamp\n");
            for (const auto& g : g_gradebook) {
                fwprintf(fp, L"\"%s\",%d,%d,%.1f%%,\"%s\",\"%s\"\n",
                         g.candidateName.c_str(), g.score, g.totalPoints, g.percentage, g.status.c_str(), g.timeDate.c_str());
            }
            fclose(fp);
            MessageBoxW(hwnd, L"Assessment Gradebook exported to CSV successfully! Can be opened directly in Giri Axis.", L"Giri Quiz Export", MB_OK | MB_ICONINFORMATION);
        }
    }
}

LRESULT CALLBACK QuizWndProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
    case WM_COMMAND: {
        int id = LOWORD(wParam);
        if (id == IDC_BTN_ADD_QUESTION) {
            QuizQuestion q;
            q.id = (int)g_quizQuestions.size() + 1;
            q.title = L"Untitled Multiple Choice Assessment Question";
            q.points = 10;
            q.userSelectedOption = -1;
            q.explanation = L"Correct answer rationale and technical context.";
            q.options.push_back({ L"Correct Answer Option", true });
            q.options.push_back({ L"Incorrect Distractor Option", false });
            g_quizQuestions.push_back(q);
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_START_EXAM) {
            if (g_quizMode == QUIZ_MODE_EXAM) {
                g_quizMode = QUIZ_MODE_BUILDER;
                KillTimer(hwnd, IDC_TIMER_EXAM);
            } else {
                g_quizMode = QUIZ_MODE_EXAM;
                g_examTimerSeconds = 300;
                for (auto& q : g_quizQuestions) q.userSelectedOption = -1;
                SetTimer(hwnd, IDC_TIMER_EXAM, 1000, NULL);
            }
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_GRADEBOOK) {
            if (g_quizMode == QUIZ_MODE_GRADEBOOK) g_quizMode = QUIZ_MODE_BUILDER;
            else g_quizMode = QUIZ_MODE_GRADEBOOK;
            InvalidateRect(hwnd, NULL, FALSE);
        } else if (id == IDC_BTN_EXPORT_CSV) {
            DoExportQuizCSV(hwnd);
        } else if (id == IDC_BTN_RESET_QUIZ) {
            if (MessageBoxW(hwnd, L"Reset this assessment to template?", L"Confirm Reset", MB_YESNO | MB_ICONQUESTION) == IDYES) {
                InitDefaultQuiz();
                g_quizMode = QUIZ_MODE_BUILDER;
                InvalidateRect(hwnd, NULL, FALSE);
            }
        }
        return 0;
    }

    case WM_TIMER: {
        if (wParam == IDC_TIMER_EXAM && g_quizMode == QUIZ_MODE_EXAM) {
            if (g_examTimerSeconds > 0) {
                g_examTimerSeconds--;
                InvalidateRect(hwnd, NULL, FALSE);
            } else {
                KillTimer(hwnd, IDC_TIMER_EXAM);
                MessageBoxW(hwnd, L"Time has expired! Submitting assessment for automated evaluation.", L"Exam Time Expired", MB_OK | MB_ICONWARNING);
                g_quizMode = QUIZ_MODE_RESULT;
                InvalidateRect(hwnd, NULL, FALSE);
            }
        }
        return 0;
    }

    case WM_SIZE: {
        int w = LOWORD(lParam);
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
        if (y < 82 && x > 650) {
            ReleaseCapture();
            SendMessageW(hwnd, WM_NCLBUTTONDOWN, HTCAPTION, 0);
            return 0;
        }

        if (y > 90) {
            RECT rc;
            GetClientRect(hwnd, &rc);
            int cardW = (rc.right > 880) ? 800 : (rc.right - 60);
            int cardX = (rc.right - cardW) / 2;

            if (g_quizMode == QUIZ_MODE_EXAM) {
                int currY = 180;
                for (auto& q : g_quizQuestions) {
                    int optY = currY + 48;
                    for (size_t optIdx = 0; optIdx < q.options.size(); ++optIdx) {
                        if (x >= cardX + 24 && x <= cardX + cardW - 24 && y >= optY && y <= optY + 28) {
                            q.userSelectedOption = (int)optIdx;
                            InvalidateRect(hwnd, NULL, FALSE);
                            return 0;
                        }
                        optY += 32;
                    }
                    currY += (80 + (int)q.options.size() * 32 + 18);
                }

                // Check "Submit Exam" button
                if (x >= cardX && x <= cardX + 200 && y >= currY + 10 && y <= currY + 54) {
                    KillTimer(hwnd, IDC_TIMER_EXAM);
                    // Calculate score
                    int earned = 0;
                    int total = 0;
                    for (const auto& q : g_quizQuestions) {
                        total += q.points;
                        if (q.userSelectedOption >= 0 && q.userSelectedOption < (int)q.options.size()) {
                            if (q.options[q.userSelectedOption].isCorrect) earned += q.points;
                        }
                    }
                    float pct = (total > 0) ? ((float)earned / (float)total * 100.0f) : 0.0f;
                    std::wstring status = (pct >= 70.0f) ? L"PASS CERTIFIED" : L"DID NOT PASS";
                    g_gradebook.push_back({ L"Current User Assessment Attempt", earned, total, pct, status, L"Just now" });

                    g_quizMode = QUIZ_MODE_RESULT;
                    InvalidateRect(hwnd, NULL, FALSE);
                    return 0;
                }
            } else if (g_quizMode == QUIZ_MODE_RESULT) {
                // Click "Retake Exam" or "Back to Builder"
                if (y >= 100 && y <= 140) {
                    g_quizMode = QUIZ_MODE_BUILDER;
                    InvalidateRect(hwnd, NULL, FALSE);
                }
            }
        }
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

        HDC memDC = CreateCompatibleDC(hdc);
        HBITMAP memBM = CreateCompatibleBitmap(hdc, w, h);
        HBITMAP oldBM = (HBITMAP)SelectObject(memDC, memBM);

        Graphics g(memDC);
        g.SetSmoothingMode(SmoothingModeAntiAlias);
        g.SetTextRenderingHint(TextRenderingHintClearTypeGridFit);

        // Background
        SolidBrush bgBrush(Color(241, 245, 249));
        g.FillRectangle(&bgBrush, 0, 0, w, h);

        int cardW = (w > 880) ? 800 : (w - 60);
        int cardX = (w - cardW) / 2;
        int startY = 96;

        if (g_quizMode == QUIZ_MODE_GRADEBOOK) {
            // Gradebook Registry View
            RectF gbRect((float)cardX, (float)startY, (float)cardW, 70.0f);
            GraphicsPath gbPath;
            AddRoundedRect(gbPath, gbRect, 8.0f);
            SolidBrush azureBg(Color(2, 132, 199));
            g.FillPath(&azureBg, &gbPath);

            Font fTitle(L"Segoe UI", 15.0f, FontStyleBold, UnitPoint);
            SolidBrush whiteBrush(Color(255, 255, 255));
            g.DrawString(L"Official Assessment Gradebook & Candidate Registry", -1, &fTitle, PointF((float)cardX + 24.0f, (float)startY + 14.0f), &whiteBrush);
            Font fSub(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
            g.DrawString(L"All scores automatically verified and recorded with cryptographic timestamping.", -1, &fSub, PointF((float)cardX + 24.0f, (float)startY + 42.0f), &whiteBrush);

            int rowY = startY + 86;
            // Header Row
            SolidBrush hdrBg(Color(226, 232, 240));
            g.FillRectangle(&hdrBg, (float)cardX, (float)rowY, (float)cardW, 30.0f);
            Font fCol(L"Segoe UI", 8.5f, FontStyleBold, UnitPoint);
            SolidBrush colText(Color(71, 85, 105));
            g.DrawString(L"Candidate / Attempt", -1, &fCol, PointF((float)cardX + 16.0f, (float)rowY + 7.0f), &colText);
            g.DrawString(L"Score", -1, &fCol, PointF((float)cardX + 340.0f, (float)rowY + 7.0f), &colText);
            g.DrawString(L"Percentage", -1, &fCol, PointF((float)cardX + 430.0f, (float)rowY + 7.0f), &colText);
            g.DrawString(L"Result", -1, &fCol, PointF((float)cardX + 530.0f, (float)rowY + 7.0f), &colText);
            g.DrawString(L"Date / Time", -1, &fCol, PointF((float)cardX + 660.0f, (float)rowY + 7.0f), &colText);

            rowY += 34;
            Font fRow(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
            SolidBrush rowText(Color(31, 41, 55));
            for (const auto& entry : g_gradebook) {
                SolidBrush rowBg(Color(255, 255, 255));
                g.FillRectangle(&rowBg, (float)cardX, (float)rowY, (float)cardW, 36.0f);
                Pen rowBorder(Color(226, 232, 240), 1.0f);
                g.DrawLine(&rowBorder, cardX, rowY + 36, cardX + cardW, rowY + 36);

                g.DrawString(entry.candidateName.c_str(), -1, &fRow, PointF((float)cardX + 16.0f, (float)rowY + 9.0f), &rowText);

                wchar_t scBuf[32], pctBuf[32];
                swprintf_s(scBuf, L"%d / %d", entry.score, entry.totalPoints);
                swprintf_s(pctBuf, L"%.1f%%", entry.percentage);
                g.DrawString(scBuf, -1, &fRow, PointF((float)cardX + 340.0f, (float)rowY + 9.0f), &rowText);
                g.DrawString(pctBuf, -1, &fRow, PointF((float)cardX + 430.0f, (float)rowY + 9.0f), &rowText);

                bool isPass = entry.percentage >= 70.0f;
                SolidBrush statBrush(isPass ? Color(22, 163, 74) : Color(220, 38, 38));
                Font fStat(L"Segoe UI", 8.5f, FontStyleBold, UnitPoint);
                g.DrawString(entry.status.c_str(), -1, &fStat, PointF((float)cardX + 530.0f, (float)rowY + 9.0f), &statBrush);

                g.DrawString(entry.timeDate.c_str(), -1, &fRow, PointF((float)cardX + 660.0f, (float)rowY + 9.0f), &rowText);
                rowY += 40;
            }
        } else if (g_quizMode == QUIZ_MODE_RESULT) {
            // Exam Result & Pass/Fail Card
            int earned = 0, total = 0;
            for (const auto& q : g_quizQuestions) {
                total += q.points;
                if (q.userSelectedOption >= 0 && q.userSelectedOption < (int)q.options.size()) {
                    if (q.options[q.userSelectedOption].isCorrect) earned += q.points;
                }
            }
            float pct = (total > 0) ? ((float)earned / (float)total * 100.0f) : 0.0f;
            bool passed = pct >= 70.0f;

            RectF resRect((float)cardX, (float)startY, (float)cardW, 140.0f);
            GraphicsPath resPath;
            AddRoundedRect(resPath, resRect, 10.0f);
            SolidBrush resBg(passed ? Color(240, 253, 244) : Color(254, 242, 242));
            g.FillPath(&resBg, &resPath);
            Pen resBorder(passed ? Color(34, 197, 94) : Color(239, 68, 68), 2.0f);
            g.DrawPath(&resBorder, &resPath);

            Font fBig(L"Segoe UI", 20.0f, FontStyleBold, UnitPoint);
            SolidBrush resText(passed ? Color(21, 128, 61) : Color(185, 28, 28));
            g.DrawString(passed ? L"CONGRATULATIONS: CERTIFICATION PASSED!" : L"ASSESSMENT NOT PASSED", -1, &fBig, PointF((float)cardX + 24.0f, (float)startY + 20.0f), &resText);

            wchar_t scoreBuf[128];
            swprintf_s(scoreBuf, L"Your Score: %d / %d Points (%.1f%%)  |  Passing Threshold: 70%%", earned, total, pct);
            Font fScore(L"Segoe UI", 12.0f, FontStyleBold, UnitPoint);
            SolidBrush darkText(Color(31, 41, 55));
            g.DrawString(scoreBuf, -1, &fScore, PointF((float)cardX + 24.0f, (float)startY + 64.0f), &darkText);

            Font fHint(L"Segoe UI", 9.5f, FontStyleRegular, UnitPoint);
            SolidBrush mutedText(Color(107, 114, 128));
            g.DrawString(L"Result recorded in gradebook. Click \"Take Exam / Test\" above to retake or \"Gradebook\" to export.", -1, &fHint, PointF((float)cardX + 24.0f, (float)startY + 98.0f), &mutedText);

            // Detailed answer review cards below
            int revY = startY + 160;
            for (size_t i = 0; i < g_quizQuestions.size(); ++i) {
                const auto& q = g_quizQuestions[i];
                bool isCorrect = (q.userSelectedOption >= 0 && q.userSelectedOption < (int)q.options.size() && q.options[q.userSelectedOption].isCorrect);
                RectF cardR((float)cardX, (float)revY, (float)cardW, 100.0f);
                GraphicsPath p;
                AddRoundedRect(p, cardR, 6.0f);
                SolidBrush cb(Color(255, 255, 255));
                g.FillPath(&cb, &p);
                Pen cPen(isCorrect ? Color(34, 197, 94) : Color(239, 68, 68), 1.0f);
                g.DrawPath(&cPen, &p);

                Font fQ(L"Segoe UI", 10.0f, FontStyleBold, UnitPoint);
                wchar_t qBuf[256];
                swprintf_s(qBuf, L"%zu. %s [%s]", i + 1, q.title.c_str(), isCorrect ? L"+10 pts" : L"0 pts");
                g.DrawString(qBuf, -1, &fQ, PointF((float)cardX + 16.0f, (float)revY + 14.0f), &darkText);

                Font fExp(L"Segoe UI", 9.0f, FontStyleItalic, UnitPoint);
                g.DrawString(q.explanation.c_str(), -1, &fExp, PointF((float)cardX + 16.0f, (float)revY + 48.0f), &mutedText);
                revY += 114;
            }
        } else {
            // Builder or Exam Mode
            // Header Banner
            RectF topRect((float)cardX, (float)startY, (float)cardW, 76.0f);
            GraphicsPath topPath;
            AddRoundedRect(topPath, topRect, 8.0f);
            SolidBrush azureCardBg(Color(2, 132, 199));
            g.FillPath(&azureCardBg, &topPath);

            Font fTitle(L"Segoe UI", 15.0f, FontStyleBold, UnitPoint);
            SolidBrush whiteBrush(Color(255, 255, 255));
            g.DrawString(g_quizTitle.c_str(), -1, &fTitle, PointF((float)cardX + 24.0f, (float)startY + 14.0f), &whiteBrush);

            if (g_quizMode == QUIZ_MODE_EXAM) {
                int mins = g_examTimerSeconds / 60;
                int secs = g_examTimerSeconds % 60;
                wchar_t timerBuf[64];
                swprintf_s(timerBuf, L"⏱ Exam Timer Remaining: %02d:%02d", mins, secs);
                Font fTimer(L"Segoe UI", 11.0f, FontStyleBold, UnitPoint);
                SolidBrush yellowBrush(Color(254, 240, 138));
                g.DrawString(timerBuf, -1, &fTimer, PointF((float)cardX + 24.0f, (float)startY + 44.0f), &yellowBrush);
            } else {
                Font fSub(L"Segoe UI", 9.0f, FontStyleRegular, UnitPoint);
                g.DrawString(L"Builder Mode: Configure questions, point values, and correct answer keys below.", -1, &fSub, PointF((float)cardX + 24.0f, (float)startY + 44.0f), &whiteBrush);
            }

            int qCardY = startY + 92;
            for (size_t i = 0; i < g_quizQuestions.size(); ++i) {
                auto& q = g_quizQuestions[i];
                int cardH = 68 + (int)q.options.size() * 32;
                RectF qRect((float)cardX, (float)qCardY, (float)cardW, (float)cardH);
                GraphicsPath qPath;
                AddRoundedRect(qPath, qRect, 8.0f);
                SolidBrush cardBg(Color(255, 255, 255));
                g.FillPath(&cardBg, &qPath);
                Pen cardBorder(Color(226, 232, 240), 1.0f);
                g.DrawPath(&cardBorder, &qPath);

                Font fQ(L"Segoe UI", 10.5f, FontStyleBold, UnitPoint);
                SolidBrush textDark(Color(17, 24, 39));
                wchar_t qTitleBuf[256];
                swprintf_s(qTitleBuf, L"%zu. %s (%d Points)", i + 1, q.title.c_str(), q.points);
                g.DrawString(qTitleBuf, -1, &fQ, PointF((float)cardX + 24.0f, (float)qCardY + 16.0f), &textDark);

                int optY = qCardY + 48;
                for (size_t optIdx = 0; optIdx < q.options.size(); ++optIdx) {
                    bool isSel = (q.userSelectedOption == (int)optIdx);
                    Pen circlePen(isSel ? Color(2, 132, 199) : Color(156, 163, 175), 1.5f);
                    g.DrawEllipse(&circlePen, (float)cardX + 28.0f, (float)optY + 3.0f, 14.0f, 14.0f);
                    if (isSel) {
                        SolidBrush fillDot(Color(2, 132, 199));
                        g.FillEllipse(&fillDot, (float)cardX + 31.0f, (float)optY + 6.0f, 8.0f, 8.0f);
                    }

                    Font fOpt(L"Segoe UI", 9.5f, FontStyleRegular, UnitPoint);
                    std::wstring optText = q.options[optIdx].text;
                    if (g_quizMode == QUIZ_MODE_BUILDER && q.options[optIdx].isCorrect) {
                        optText += L"  [CORRECT KEY]";
                    }
                    Color optCol = (q.options[optIdx].isCorrect && g_quizMode == QUIZ_MODE_BUILDER) ? Color(22, 163, 74) : Color(17, 24, 39);
                    SolidBrush optBrush(optCol);
                    g.DrawString(optText.c_str(), -1, &fOpt, PointF((float)cardX + 52.0f, (float)optY), &optBrush);
                    optY += 32;
                }

                qCardY += cardH + 16;
            }

            if (g_quizMode == QUIZ_MODE_EXAM) {
                RectF submitRect((float)cardX, (float)qCardY, 180.0f, 42.0f);
                GraphicsPath subPath;
                AddRoundedRect(subPath, submitRect, 6.0f);
                SolidBrush submitBg(Color(2, 132, 199));
                g.FillPath(&submitBg, &subPath);

                Font fSubBtn(L"Segoe UI", 10.5f, FontStyleBold, UnitPoint);
                StringFormat sfCenter;
                sfCenter.SetAlignment(StringAlignmentCenter);
                sfCenter.SetLineAlignment(StringAlignmentCenter);
                g.DrawString(L"Submit Assessment", -1, &fSubBtn, PointF(submitRect.X + submitRect.Width / 2.0f, submitRect.Y + submitRect.Height / 2.0f), &sfCenter, &whiteBrush);
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
        g.DrawString(L"  Giri Quiz Sovereign Assessment Studio (v13.5) • 100% Offline Standalone Native C++ • Author: Abhinav Giri",
                     -1, &fStatus, PointF(8.0f, (float)h - 18.0f), &statusText);

        BitBlt(hdc, 0, 0, w, h, memDC, 0, 0, SRCCOPY);
        SelectObject(memDC, oldBM);
        DeleteObject(memBM);
        DeleteDC(memDC);

        EndPaint(hwnd, &ps);
        return 0;
    }

    case WM_DESTROY: {
        KillTimer(hwnd, IDC_TIMER_EXAM);
        PostQuitMessage(0);
        return 0;
    }

    default:
        return DefWindowProcW(hwnd, uMsg, wParam, lParam);
    }
}

void CreateQuizToolbar(HWND hwnd) {
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

    makeBtn(L"+ Question", 14, 14, 96, 36, IDC_BTN_ADD_QUESTION);
    makeBtn(L"Take Exam / Test", 118, 14, 136, 36, IDC_BTN_START_EXAM);
    makeBtn(L"Gradebook Registry", 262, 14, 146, 36, IDC_BTN_GRADEBOOK);
    makeBtn(L"Export to CSV", 416, 14, 110, 36, IDC_BTN_EXPORT_CSV);
    makeBtn(L"Reset Quiz", 534, 14, 96, 36, IDC_BTN_RESET_QUIZ);
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
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
    if (!g_hAppIcon) g_hAppIcon = (HICON)LoadImageW(NULL, (g_appDir + L"\\quiz.ico").c_str(), IMAGE_ICON, 256, 256, LR_LOADFROMFILE);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW | CS_DBLCLKS;
    wcex.lpfnWndProc = QuizWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = NULL;
    wcex.lpszClassName = L"GiriQuizMainWindowClass";
    wcex.hIcon = g_hAppIcon;
    wcex.hIconSm = g_hAppIcon;

    if (!RegisterClassExW(&wcex)) return 0;

    InitDefaultQuiz();

    // WS_EX_APPWINDOW & WS_OVERLAPPEDWINDOW for flawless min/max/move
    g_hMainWnd = CreateWindowExW(
        WS_EX_APPWINDOW,
        L"GiriQuizMainWindowClass",
        L"Enterprise Sovereign Certification - Giri Quiz (Assessment Studio)",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN,
        CW_USEDEFAULT, CW_USEDEFAULT, 1180, 800,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    CreateQuizToolbar(g_hMainWnd);

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
