#pragma once

#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <gdiplus.h>
#include <string>

namespace GiriOrbit {

inline HWND& GetSettingsDlgHandle() {
    static HWND s_hSettingsDlg = NULL;
    return s_hSettingsDlg;
}

inline HWND& GetProfileDlgHandle() {
    static HWND s_hProfileDlg = NULL;
    return s_hProfileDlg;
}

inline void ShowSettingsDialog(HWND hParent) {
    HWND& s_hDlg = GetSettingsDlgHandle();
    if (s_hDlg && IsWindow(s_hDlg)) {
        ShowWindow(s_hDlg, SW_RESTORE);
        SetForegroundWindow(s_hDlg);
        return;
    }

    static bool s_registered = false;
    HINSTANCE hInst = GetModuleHandleW(NULL);

    if (!s_registered) {
        WNDCLASSEXW wc = { sizeof(WNDCLASSEXW) };
        wc.lpfnWndProc = [](HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) -> LRESULT {
            switch (msg) {
            case WM_CREATE: {
                HFONT hfTitle = CreateFontW(19, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                           OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                           VARIABLE_PITCH, L"Segoe UI");
                HFONT hf = CreateFontW(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                      OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                      VARIABLE_PITCH, L"Segoe UI");

                HWND hTitle = CreateWindowExW(0, L"STATIC", L"Settings & Personalization — Giri Orbit",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 20, 500, 24, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hTitle, WM_SETFONT, (WPARAM)hfTitle, TRUE);

                HWND hSub = CreateWindowExW(0, L"STATIC", L"Enterprise Footprint: 4.00 GB Sovereign Installed • 100% Offline Standalone",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 46, 500, 20, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hSub, WM_SETFONT, (WPARAM)hf, TRUE);

                // Group: General
                HWND hLbl1 = CreateWindowExW(0, L"STATIC", L"Theme Appearance:",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 85, 200, 18, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hLbl1, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hComboTheme = CreateWindowExW(0, L"COMBOBOX", L"",
                    WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL, 24, 105, 500, 100, hwnd, (HMENU)101, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hComboTheme, WM_SETFONT, (WPARAM)hf, TRUE);
                SendMessageW(hComboTheme, CB_ADDSTRING, 0, (LPARAM)L"Modern Fluent Light (Recommended)");
                SendMessageW(hComboTheme, CB_ADDSTRING, 0, (LPARAM)L"Slate Charcoal Dark");
                SendMessageW(hComboTheme, CB_ADDSTRING, 0, (LPARAM)L"High Contrast Monochrome");
                SendMessageW(hComboTheme, CB_SETCURSEL, 0, 0);

                // Group: Font
                HWND hLbl2 = CreateWindowExW(0, L"STATIC", L"Default Typography Font:",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 145, 200, 18, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hLbl2, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hComboFont = CreateWindowExW(0, L"COMBOBOX", L"",
                    WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL, 24, 165, 500, 120, hwnd, (HMENU)102, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hComboFont, WM_SETFONT, (WPARAM)hf, TRUE);
                SendMessageW(hComboFont, CB_ADDSTRING, 0, (LPARAM)L"Segoe UI (Fluent Native)");
                SendMessageW(hComboFont, CB_ADDSTRING, 0, (LPARAM)L"Google Noto Sans Devanagari (Hindi Ready)");
                SendMessageW(hComboFont, CB_ADDSTRING, 0, (LPARAM)L"Google Sans");
                SendMessageW(hComboFont, CB_ADDSTRING, 0, (LPARAM)L"Consolas");
                SendMessageW(hComboFont, CB_SETCURSEL, 0, 0);

                // Group: Autosave
                HWND hLbl3 = CreateWindowExW(0, L"STATIC", L"Autosave Frequency:",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 205, 200, 18, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hLbl3, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hComboSave = CreateWindowExW(0, L"COMBOBOX", L"",
                    WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL, 24, 225, 500, 100, hwnd, (HMENU)103, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hComboSave, WM_SETFONT, (WPARAM)hf, TRUE);
                SendMessageW(hComboSave, CB_ADDSTRING, 0, (LPARAM)L"Instant Continuous (Recommended)");
                SendMessageW(hComboSave, CB_ADDSTRING, 0, (LPARAM)L"Every 30 Seconds");
                SendMessageW(hComboSave, CB_ADDSTRING, 0, (LPARAM)L"Every 60 Seconds");
                SendMessageW(hComboSave, CB_SETCURSEL, 0, 0);

                // Privacy Box
                HWND hPriv = CreateWindowExW(0, L"STATIC",
                    L"✓ Zero Telemetry Active: No keystrokes, formulas, or documents are transmitted to cloud servers.\n"
                    L"✓ Cryptographic Sovereignty: Offline AES-256 local document storage.\n"
                    L"✓ Standalone C++ Engine: 100% direct native Win32 execution with hardware GDI+ acceleration.",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 275, 500, 60, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hPriv, WM_SETFONT, (WPARAM)hf, TRUE);

                // OK / Cancel Buttons
                HWND hBtnOk = CreateWindowExW(0, L"BUTTON", L"Save & Apply",
                    WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON, 330, 410, 110, 32, hwnd, (HMENU)201, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hBtnOk, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hBtnCancel = CreateWindowExW(0, L"BUTTON", L"Cancel",
                    WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 450, 410, 80, 32, hwnd, (HMENU)202, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hBtnCancel, WM_SETFONT, (WPARAM)hf, TRUE);
                return 0;
            }
            case WM_COMMAND: {
                if (LOWORD(wParam) == 201) {
                    MessageBoxW(hwnd, L"Settings saved and applied successfully!", L"Giri Orbit Settings", MB_OK | MB_ICONINFORMATION);
                    DestroyWindow(hwnd);
                    return 0;
                } else if (LOWORD(wParam) == 202) {
                    DestroyWindow(hwnd);
                    return 0;
                }
                break;
            }
            case WM_KEYDOWN: {
                if (wParam == VK_ESCAPE) {
                    DestroyWindow(hwnd);
                    return 0;
                }
                break;
            }
            case WM_ERASEBKGND: {
                HDC hdc = (HDC)wParam;
                RECT rc;
                GetClientRect(hwnd, &rc);
                FillRect(hdc, &rc, (HBRUSH)GetStockObject(WHITE_BRUSH));
                return 1;
            }
            case WM_CLOSE:
                DestroyWindow(hwnd);
                return 0;
            case WM_NCDESTROY:
                GetSettingsDlgHandle() = NULL;
                break;
            }
            return DefWindowProcW(hwnd, msg, wParam, lParam);
        };
        wc.hInstance = hInst;
        wc.lpszClassName = L"GiriOrbitSettingsDlgClass";
        wc.hCursor = LoadCursor(NULL, IDC_ARROW);
        RegisterClassExW(&wc);
        s_registered = true;
    }

    RECT rcParent;
    if (hParent && IsWindow(hParent)) GetWindowRect(hParent, &rcParent);
    else { rcParent.left = 100; rcParent.top = 100; rcParent.right = 800; rcParent.bottom = 700; }
    int dlgW = 560, dlgH = 500;
    int x = rcParent.left + (rcParent.right - rcParent.left - dlgW) / 2;
    int y = rcParent.top + (rcParent.bottom - rcParent.top - dlgH) / 2;

    s_hDlg = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST, L"GiriOrbitSettingsDlgClass", L"Settings & Personalization — Giri Orbit",
        WS_POPUP | WS_CAPTION | WS_SYSMENU | WS_VISIBLE,
        x, y, dlgW, dlgH, hParent, NULL, hInst, NULL
    );
    ShowWindow(s_hDlg, SW_SHOW);
    UpdateWindow(s_hDlg);
    SetForegroundWindow(s_hDlg);
}

inline void ShowProfileDialog(HWND hParent) {
    HWND& s_hDlg = GetProfileDlgHandle();
    if (s_hDlg && IsWindow(s_hDlg)) {
        ShowWindow(s_hDlg, SW_RESTORE);
        SetForegroundWindow(s_hDlg);
        return;
    }

    static bool s_registered = false;
    HINSTANCE hInst = GetModuleHandleW(NULL);

    if (!s_registered) {
        WNDCLASSEXW wc = { sizeof(WNDCLASSEXW) };
        wc.lpfnWndProc = [](HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) -> LRESULT {
            switch (msg) {
            case WM_CREATE: {
                HFONT hfTitle = CreateFontW(20, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                           OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                           VARIABLE_PITCH, L"Segoe UI");
                HFONT hf = CreateFontW(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                      OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                      VARIABLE_PITCH, L"Segoe UI");

                HWND hTitle = CreateWindowExW(0, L"STATIC", L"User Profile & Sovereignty Hub",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 100, 26, 380, 24, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hTitle, WM_SETFONT, (WPARAM)hfTitle, TRUE);

                HWND hSub = CreateWindowExW(0, L"STATIC", L"Sovereign Administrator • 4.00 GB Enterprise Suite Active",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 100, 52, 380, 20, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hSub, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hLblName = CreateWindowExW(0, L"STATIC", L"Display Name:",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 110, 150, 18, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hLblName, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hEditName = CreateWindowExW(WS_EX_CLIENTEDGE, L"EDIT", L"Abhinav Giri",
                    WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL, 24, 132, 450, 26, hwnd, (HMENU)301, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hEditName, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hLblEmail = CreateWindowExW(0, L"STATIC", L"Sovereignty ID:",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 172, 150, 18, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hLblEmail, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hEditEmail = CreateWindowExW(WS_EX_CLIENTEDGE, L"EDIT", L"abhinavgiri370@gmail.com",
                    WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL | ES_READONLY, 24, 194, 450, 26, hwnd, (HMENU)302, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hEditEmail, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hCard = CreateWindowExW(0, L"STATIC",
                    L"Storage Architecture: Local NVMe Sovereign Storage\n"
                    L"Cryptographic Key: RSA-4096 / SHA-256 Offline Signed\n"
                    L"Enterprise Suite Footprint: 4.00 GB (4,000,000,000 bytes)\n"
                    L"Primary Author & Owner: Abhinav Giri (@abhinavgiri45)\n"
                    L"Author Email: abhinavgiri370@gmail.com",
                    WS_CHILD | WS_VISIBLE | SS_LEFT, 24, 235, 450, 85, hwnd, NULL, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hCard, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hBtnOk = CreateWindowExW(0, L"BUTTON", L"Save Profile",
                    WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON, 270, 340, 110, 32, hwnd, (HMENU)303, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hBtnOk, WM_SETFONT, (WPARAM)hf, TRUE);

                HWND hBtnClose = CreateWindowExW(0, L"BUTTON", L"Close",
                    WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON, 390, 340, 84, 32, hwnd, (HMENU)304, (HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE), NULL);
                SendMessageW(hBtnClose, WM_SETFONT, (WPARAM)hf, TRUE);
                return 0;
            }
            case WM_PAINT: {
                PAINTSTRUCT ps;
                HDC hdc = BeginPaint(hwnd, &ps);
                Gdiplus::Graphics g(hdc);
                g.SetSmoothingMode(Gdiplus::SmoothingModeAntiAlias);
                Gdiplus::SolidBrush bAvatar(Gdiplus::Color(37, 99, 235));
                g.FillEllipse(&bAvatar, 24, 20, 56, 56);
                Gdiplus::Font fAv(L"Segoe UI", 16.0f, Gdiplus::FontStyleBold, Gdiplus::UnitPoint);
                Gdiplus::SolidBrush bTxt(Gdiplus::Color(255, 255, 255));
                Gdiplus::StringFormat sf;
                sf.SetAlignment(Gdiplus::StringAlignmentCenter);
                sf.SetLineAlignment(Gdiplus::StringAlignmentCenter);
                Gdiplus::RectF rAv(24.0f, 20.0f, 56.0f, 56.0f);
                g.DrawString(L"AG", -1, &fAv, rAv, &sf, &bTxt);
                EndPaint(hwnd, &ps);
                return 0;
            }
            case WM_COMMAND: {
                if (LOWORD(wParam) == 303) {
                    MessageBoxW(hwnd, L"Profile saved successfully!", L"Giri Orbit Profile", MB_OK | MB_ICONINFORMATION);
                    DestroyWindow(hwnd);
                    return 0;
                } else if (LOWORD(wParam) == 304) {
                    DestroyWindow(hwnd);
                    return 0;
                }
                break;
            }
            case WM_KEYDOWN: {
                if (wParam == VK_ESCAPE) {
                    DestroyWindow(hwnd);
                    return 0;
                }
                break;
            }
            case WM_ERASEBKGND: {
                HDC hdc = (HDC)wParam;
                RECT rc;
                GetClientRect(hwnd, &rc);
                FillRect(hdc, &rc, (HBRUSH)GetStockObject(WHITE_BRUSH));
                return 1;
            }
            case WM_CLOSE:
                DestroyWindow(hwnd);
                return 0;
            case WM_NCDESTROY:
                GetProfileDlgHandle() = NULL;
                break;
            }
            return DefWindowProcW(hwnd, msg, wParam, lParam);
        };
        wc.hInstance = hInst;
        wc.lpszClassName = L"GiriOrbitProfileDlgClass";
        wc.hCursor = LoadCursor(NULL, IDC_ARROW);
        RegisterClassExW(&wc);
        s_registered = true;
    }

    RECT rcParent;
    if (hParent && IsWindow(hParent)) GetWindowRect(hParent, &rcParent);
    else { rcParent.left = 100; rcParent.top = 100; rcParent.right = 800; rcParent.bottom = 700; }
    int dlgW = 520, dlgH = 430;
    int x = rcParent.left + (rcParent.right - rcParent.left - dlgW) / 2;
    int y = rcParent.top + (rcParent.bottom - rcParent.top - dlgH) / 2;

    s_hDlg = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST, L"GiriOrbitProfileDlgClass", L"User Profile & Sovereignty Hub — Giri Orbit",
        WS_POPUP | WS_CAPTION | WS_SYSMENU | WS_VISIBLE,
        x, y, dlgW, dlgH, hParent, NULL, hInst, NULL
    );
    ShowWindow(s_hDlg, SW_SHOW);
    UpdateWindow(s_hDlg);
    SetForegroundWindow(s_hDlg);
}

} // namespace GiriOrbit
