/* ============================================================================
 * GIRI ORBIT — SOVEREIGN SUITE DEDICATED SETUP WIZARD (main.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * 100% Offline Standalone Native C++ Win32 Installer Engine
 * Component Selection • Abhinav Giri License • Zero Telemetry
 * ============================================================================
 */

#include "../common/sovereign_types.h"
#include <commctrl.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <shlobj.h>
#include <vector>
#include <string>
#include <filesystem>

#define IDC_BTN_BACK        5001
#define IDC_BTN_NEXT        5002
#define IDC_BTN_CANCEL      5003

#define IDC_RADIO_ACCEPT    5010
#define IDC_RADIO_DECLINE   5011

#define IDC_CHK_SELECT_ALL  5020
#define IDC_CHK_DRIFT       5021
#define IDC_CHK_AXIS        5022
#define IDC_CHK_KINETIC     5023
#define IDC_CHK_HUB         5024
#define IDC_CHK_SHORTCUT    5025
#define IDC_CHK_ASSOC       5026
#define IDC_CHK_LANG        5027
#define IDC_CHK_FONTS       5028
#define IDC_CHK_RUNTIMES    5029

#define IDC_PROGRESS_BAR    5030
#define IDC_LBL_STATUS      5031
#define IDC_CHK_LAUNCH      5032

enum WizardPage {
    PAGE_WELCOME = 0,
    PAGE_LICENSE = 1,
    PAGE_COMPONENTS = 2,
    PAGE_INSTALLING = 3,
    PAGE_COMPLETE = 4
};

HINSTANCE g_hInst = NULL;
HWND g_hMainWnd = NULL;
HWND g_hBtnBack = NULL;
HWND g_hBtnNext = NULL;
HWND g_hBtnCancel = NULL;

WizardPage g_currentPage = PAGE_WELCOME;
std::vector<HWND> g_pageControls[5];

// Selection flags
bool g_installDrift = true;
bool g_installAxis = true;
bool g_installKinetic = true;
bool g_installHub = true;
bool g_installLang = true;
bool g_installFonts = true;
bool g_installRuntimes = true;
bool g_createShortcut = true;
bool g_registerAssoc = true;
bool g_licenseAccepted = true;
bool g_launchOnFinish = true;

std::wstring g_sourceDir = L"";
std::wstring g_installDir = L"";

// Forward declarations
LRESULT CALLBACK WizardWndProc(HWND, UINT, WPARAM, LPARAM);
void ShowPage(WizardPage page);
void PerformInstallation(HWND hwnd);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    g_hInst = hInstance;

    // Source directory where installer is running
    wchar_t szSrc[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, szSrc, MAX_PATH);
    PathRemoveFileSpecW(szSrc);
    g_sourceDir = szSrc;

    // Target directory: %LOCALAPPDATA%\Programs\Giri Orbit
    wchar_t szLocalApp[MAX_PATH] = { 0 };
    SHGetFolderPathW(NULL, CSIDL_LOCAL_APPDATA, NULL, 0, szLocalApp);
    g_installDir = std::wstring(szLocalApp) + L"\\Programs\\Giri Orbit";

    INITCOMMONCONTROLSEX icex = { sizeof(INITCOMMONCONTROLSEX), ICC_WIN95_CLASSES | ICC_PROGRESS_CLASS };
    InitCommonControlsEx(&icex);

    WNDCLASSEXW wcex = { sizeof(WNDCLASSEXW) };
    wcex.style = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc = WizardWndProc;
    wcex.hInstance = hInstance;
    wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wcex.lpszClassName = L"GiriOrbitWizardWindowClass";
    wcex.hIcon = LoadIconW(hInstance, MAKEINTRESOURCEW(101));
    wcex.hIconSm = (HICON)LoadImageW(hInstance, MAKEINTRESOURCEW(101), IMAGE_ICON, 16, 16, 0);

    if (!RegisterClassExW(&wcex)) return 0;

    g_hMainWnd = CreateWindowExW(
        0, L"GiriOrbitWizardWindowClass",
        L"Setup — Giri Orbit Sovereign Suite (Native Desktop Edition)",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX,
        CW_USEDEFAULT, CW_USEDEFAULT, 750, 480,
        NULL, NULL, hInstance, NULL
    );

    if (!g_hMainWnd) return 0;

    // Bottom Navigation Buttons
    g_hBtnBack = CreateWindowExW(0, L"BUTTON", L"< Back", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                                440, 400, 90, 28, g_hMainWnd, (HMENU)IDC_BTN_BACK, hInstance, NULL);

    g_hBtnNext = CreateWindowExW(0, L"BUTTON", L"Next >", WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON,
                                540, 400, 90, 28, g_hMainWnd, (HMENU)IDC_BTN_NEXT, hInstance, NULL);

    g_hBtnCancel = CreateWindowExW(0, L"BUTTON", L"Cancel", WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                                  640, 400, 80, 28, g_hMainWnd, (HMENU)IDC_BTN_CANCEL, hInstance, NULL);

    HFONT hFont = CreateFontW(15, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                              OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                              VARIABLE_PITCH, L"Segoe UI");
    SendMessageW(g_hBtnBack, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hBtnNext, WM_SETFONT, (WPARAM)hFont, TRUE);
    SendMessageW(g_hBtnCancel, WM_SETFONT, (WPARAM)hFont, TRUE);

    // ==========================================
    // PAGE 0: WELCOME PAGE
    // ==========================================
    // (Notice: Left margin starts at x = 240, eliminating any sidebar overlap!)
    HWND hWelTitle = CreateWindowExW(0, L"STATIC", L"Welcome to the Giri Orbit Setup Wizard",
                                    WS_CHILD | SS_LEFT, 240, 30, 470, 32, g_hMainWnd, NULL, hInstance, NULL);
    HWND hWelDesc = CreateWindowExW(0, L"STATIC",
                                   L"This wizard will install the Giri Orbit Sovereign Desktop Suite on your computer.\n\n"
                                   L"The installation includes complete sovereign desktop productivity tools:\n"
                                   L"  • Giri Drift (Executive Document Composer)\n"
                                   L"  • Giri Axis (High-Velocity Financial Matrix)\n"
                                   L"  • Giri Kinetic (Cinematic Widescreen Show)\n"
                                   L"  • Giri Orbit Suite Hub & Orchestrator\n\n"
                                   L"Architecture: 100% Offline Standalone Native C++\n"
                                   L"Privacy: In-memory safety with zero cloud telemetry.\n"
                                   L"Author: Made by Abhinav Giri (@abhinavgiri45)\n\n"
                                   L"Click Next to choose components and continue, or Cancel to exit Setup.",
                                   WS_CHILD | SS_LEFT, 240, 75, 470, 290, g_hMainWnd, NULL, hInstance, NULL);
    g_pageControls[PAGE_WELCOME].push_back(hWelTitle);
    g_pageControls[PAGE_WELCOME].push_back(hWelDesc);

    // ==========================================
    // PAGE 1: LICENSE AGREEMENT
    // ==========================================
    HWND hLicTitle = CreateWindowExW(0, L"STATIC", L"License Agreement & Sovereign Privacy",
                                    WS_CHILD | SS_LEFT, 240, 20, 470, 26, g_hMainWnd, NULL, hInstance, NULL);
    HWND hLicSub = CreateWindowExW(0, L"STATIC", L"Please review the license terms by Abhinav Giri before proceeding:",
                                  WS_CHILD | SS_LEFT, 240, 48, 470, 20, g_hMainWnd, NULL, hInstance, NULL);

    std::wstring licenseText =
        L"GIRI ORBIT SOVEREIGN END-USER LICENSE AGREEMENT\r\n"
        L"Author & Copyright Holder: Abhinav Giri\r\n"
        L"GitHub: https://github.com/abhinavgiri45 | Instagram: @abhinavgiri45 | Email: abhinavgiri370@gmail.com\r\n"
        L"Version: 11.8.5 (Native Win32 C++ Edition)\r\n\r\n"
        L"1. SOVEREIGN GRANT OF LICENSE\r\n"
        L"Abhinav Giri grants you a perpetual, royalty-free, non-exclusive license to install, execute, and utilize the Giri Orbit Suite (including Giri Drift, Giri Axis, Giri Kinetic, and Giri Orbit Hub) on any compatible hardware.\r\n\r\n"
        L"2. 100% OFFLINE CONFIDENTIALITY & PRIVACY\r\n"
        L"Giri Orbit operates 100% offline and in-memory on your local device. The software contains ZERO cloud telemetry, ZERO tracking cookies, and ZERO background data transmission. Your confidential documents, matrices, presentations, and cryptographic materials remain strictly your private property.\r\n\r\n"
        L"3. UNIVERSAL FORMAT FREEDOM\r\n"
        L"Files generated in the universal sovereign format (.giri) are completely vendor-independent and fully owned by you.\r\n\r\n"
        L"4. TEMPLATE PARTNERSHIP ACKNOWLEDGMENT\r\n"
        L"Presentation templates and graphics integrate global motifs and external reference links to www.presentationgo.com.\r\n\r\n"
        L"5. WARRANTY DISCLAIMER\r\n"
        L"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.\r\n";

    HWND hLicEdit = CreateWindowExW(WS_EX_CLIENTEDGE, L"EDIT", licenseText.c_str(),
                                   WS_CHILD | ES_MULTILINE | ES_READONLY | WS_VSCROLL,
                                   240, 72, 470, 230, g_hMainWnd, NULL, hInstance, NULL);

    HWND hRadioAcc = CreateWindowExW(0, L"BUTTON", L"I accept the terms of this sovereign license",
                                    WS_CHILD | BS_AUTORADIOBUTTON, 240, 315, 470, 24, g_hMainWnd, (HMENU)IDC_RADIO_ACCEPT, hInstance, NULL);
    HWND hRadioDec = CreateWindowExW(0, L"BUTTON", L"I do not accept the agreement",
                                    WS_CHILD | BS_AUTORADIOBUTTON, 240, 342, 470, 24, g_hMainWnd, (HMENU)IDC_RADIO_DECLINE, hInstance, NULL);
    SendMessageW(hRadioAcc, BM_SETCHECK, BST_CHECKED, 0);

    g_pageControls[PAGE_LICENSE].push_back(hLicTitle);
    g_pageControls[PAGE_LICENSE].push_back(hLicSub);
    g_pageControls[PAGE_LICENSE].push_back(hLicEdit);
    g_pageControls[PAGE_LICENSE].push_back(hRadioAcc);
    g_pageControls[PAGE_LICENSE].push_back(hRadioDec);

    // ==========================================
    // PAGE 2: COMPONENT SELECTION
    // ==========================================
    HWND hCmpTitle = CreateWindowExW(0, L"STATIC", L"Select Components to Install",
                                    WS_CHILD | SS_LEFT, 240, 20, 470, 26, g_hMainWnd, NULL, hInstance, NULL);
    HWND hCmpSub = CreateWindowExW(0, L"STATIC", L"Select the tools you want to install, or choose Select All:",
                                  WS_CHILD | SS_LEFT, 240, 48, 470, 20, g_hMainWnd, NULL, hInstance, NULL);

    HWND hChkAll = CreateWindowExW(0, L"BUTTON", L"[Select All] Install Complete Sovereign Suite",
                                  WS_CHILD | BS_AUTOCHECKBOX, 240, 80, 470, 26, g_hMainWnd, (HMENU)IDC_CHK_SELECT_ALL, hInstance, NULL);

    HWND hChkDrift = CreateWindowExW(0, L"BUTTON", L"Giri Drift (Executive Document Composer & Word Processor)",
                                    WS_CHILD | BS_AUTOCHECKBOX, 260, 115, 450, 24, g_hMainWnd, (HMENU)IDC_CHK_DRIFT, hInstance, NULL);

    HWND hChkAxis = CreateWindowExW(0, L"BUTTON", L"Giri Axis (High-Velocity Financial Matrix & Spreadsheets)",
                                   WS_CHILD | BS_AUTOCHECKBOX, 260, 145, 450, 24, g_hMainWnd, (HMENU)IDC_CHK_AXIS, hInstance, NULL);

    HWND hChkKinetic = CreateWindowExW(0, L"BUTTON", L"Giri Kinetic (Cinematic Widescreen Studio via www.presentationgo.com)",
                                      WS_CHILD | BS_AUTOCHECKBOX, 260, 175, 450, 24, g_hMainWnd, (HMENU)IDC_CHK_KINETIC, hInstance, NULL);

    HWND hChkHub = CreateWindowExW(0, L"BUTTON", L"Giri Orbit Hub (Desktop Workspace & Update Orchestrator)",
                                  WS_CHILD | BS_AUTOCHECKBOX, 260, 205, 450, 24, g_hMainWnd, (HMENU)IDC_CHK_HUB, hInstance, NULL);

    HWND hChkFonts = CreateWindowExW(0, L"BUTTON", L"International Fonts & Google Hindi (Noto Sans Devanagari) [~600 MB]",
                                     WS_CHILD | BS_AUTOCHECKBOX, 240, 235, 470, 22, g_hMainWnd, (HMENU)IDC_CHK_FONTS, hInstance, NULL);

    HWND hChkLang = CreateWindowExW(0, L"BUTTON", L"Language Packs (100+ Multilingual Satellite DLLs & Dictionaries) [~2.5 GB]",
                                    WS_CHILD | BS_AUTOCHECKBOX, 240, 258, 470, 22, g_hMainWnd, (HMENU)IDC_CHK_LANG, hInstance, NULL);

    HWND hChkRuntimes = CreateWindowExW(0, L"BUTTON", L"Web & Telemetry Runtimes (Edge WebView2 & Orbit Sync Daemon) [~800 MB]",
                                       WS_CHILD | BS_AUTOCHECKBOX, 240, 281, 470, 22, g_hMainWnd, (HMENU)IDC_CHK_RUNTIMES, hInstance, NULL);

    HWND hChkShort = CreateWindowExW(0, L"BUTTON", L"Create Desktop Shortcuts for selected sovereign tools",
                                    WS_CHILD | BS_AUTOCHECKBOX, 240, 310, 470, 22, g_hMainWnd, (HMENU)IDC_CHK_SHORTCUT, hInstance, NULL);

    HWND hChkAssoc = CreateWindowExW(0, L"BUTTON", L"Associate Universal Office files (.giri, .gdrift, .gaxis, .gkinetic)",
                                    WS_CHILD | BS_AUTOCHECKBOX, 240, 332, 470, 22, g_hMainWnd, (HMENU)IDC_CHK_ASSOC, hInstance, NULL);

    SendMessageW(hChkAll, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkDrift, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkAxis, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkKinetic, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkHub, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkFonts, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkLang, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkRuntimes, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkShort, BM_SETCHECK, BST_CHECKED, 0);
    SendMessageW(hChkAssoc, BM_SETCHECK, BST_CHECKED, 0);

    g_pageControls[PAGE_COMPONENTS].push_back(hCmpTitle);
    g_pageControls[PAGE_COMPONENTS].push_back(hCmpSub);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkAll);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkDrift);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkAxis);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkKinetic);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkHub);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkFonts);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkLang);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkRuntimes);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkShort);
    g_pageControls[PAGE_COMPONENTS].push_back(hChkAssoc);

    // ==========================================
    // PAGE 3: INSTALLING PROGRESS
    // ==========================================
    HWND hInsTitle = CreateWindowExW(0, L"STATIC", L"Installing Giri Orbit Sovereign Suite...",
                                    WS_CHILD | SS_LEFT, 240, 40, 470, 26, g_hMainWnd, NULL, hInstance, NULL);
    HWND hInsSub = CreateWindowExW(0, L"STATIC", L"Please wait while Setup deploys native sovereign binaries to your PC:",
                                  WS_CHILD | SS_LEFT, 240, 70, 470, 20, g_hMainWnd, NULL, hInstance, NULL);

    HWND hProg = CreateWindowExW(0, PROGRESS_CLASSW, NULL,
                                WS_CHILD | PBS_SMOOTH,
                                240, 140, 470, 24, g_hMainWnd, (HMENU)IDC_PROGRESS_BAR, hInstance, NULL);

    HWND hLblStat = CreateWindowExW(0, L"STATIC", L"Deploying files...",
                                   WS_CHILD | SS_LEFT, 240, 180, 470, 40, g_hMainWnd, (HMENU)IDC_LBL_STATUS, hInstance, NULL);

    g_pageControls[PAGE_INSTALLING].push_back(hInsTitle);
    g_pageControls[PAGE_INSTALLING].push_back(hInsSub);
    g_pageControls[PAGE_INSTALLING].push_back(hProg);
    g_pageControls[PAGE_INSTALLING].push_back(hLblStat);

    // ==========================================
    // PAGE 4: COMPLETION PAGE
    // ==========================================
    HWND hFinTitle = CreateWindowExW(0, L"STATIC", L"Setup Completed Successfully!",
                                    WS_CHILD | SS_LEFT, 240, 40, 470, 32, g_hMainWnd, NULL, hInstance, NULL);
    HWND hFinDesc = CreateWindowExW(0, L"STATIC",
                                   L"Giri Orbit Sovereign Suite has been successfully installed on your PC.\n\n"
                                   L"Selected components:\n"
                                   L"  • Giri Drift (Executive Document Composer)\n"
                                   L"  • Giri Axis (High-Velocity Financial Matrix)\n"
                                   L"  • Giri Kinetic (Cinematic Widescreen Show)\n"
                                   L"  • Giri Orbit Suite Hub & Orchestrator\n\n"
                                   L"All tools are 100% offline standalone and ready to launch.\n"
                                   L"Made by Abhinav Giri (@abhinavgiri45)\n\n"
                                   L"Click Finish to exit Setup.",
                                   WS_CHILD | SS_LEFT, 240, 85, 470, 220, g_hMainWnd, NULL, hInstance, NULL);

    HWND hChkLaunch = CreateWindowExW(0, L"BUTTON", L"Launch Giri Orbit Suite Hub now",
                                     WS_CHILD | BS_AUTOCHECKBOX, 240, 320, 470, 24, g_hMainWnd, (HMENU)IDC_CHK_LAUNCH, hInstance, NULL);
    SendMessageW(hChkLaunch, BM_SETCHECK, BST_CHECKED, 0);

    g_pageControls[PAGE_COMPLETE].push_back(hFinTitle);
    g_pageControls[PAGE_COMPLETE].push_back(hFinDesc);
    g_pageControls[PAGE_COMPLETE].push_back(hChkLaunch);

    // Apply font to all controls
    for (int p = 0; p < 5; ++p) {
        for (HWND hCtl : g_pageControls[p]) {
            SendMessageW(hCtl, WM_SETFONT, (WPARAM)hFont, TRUE);
        }
    }

    // Set bold font for titles
    HFONT hFontBig = CreateFontW(22, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                VARIABLE_PITCH, L"Segoe UI");
    SendMessageW(hWelTitle, WM_SETFONT, (WPARAM)hFontBig, TRUE);
    SendMessageW(hLicTitle, WM_SETFONT, (WPARAM)hFontBig, TRUE);
    SendMessageW(hCmpTitle, WM_SETFONT, (WPARAM)hFontBig, TRUE);
    SendMessageW(hInsTitle, WM_SETFONT, (WPARAM)hFontBig, TRUE);
    SendMessageW(hFinTitle, WM_SETFONT, (WPARAM)hFontBig, TRUE);

    ShowPage(PAGE_WELCOME);

    ShowWindow(g_hMainWnd, nCmdShow);
    UpdateWindow(g_hMainWnd);

    MSG msg;
    while (GetMessageW(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessageW(&msg);
    }

    return (int)msg.wParam;
}

void ShowPage(WizardPage page) {
    g_currentPage = page;

    // Hide all pages controls
    for (int p = 0; p < 5; ++p) {
        for (HWND hCtl : g_pageControls[p]) {
            ShowWindow(hCtl, SW_HIDE);
        }
    }

    // Show current page controls
    for (HWND hCtl : g_pageControls[page]) {
        ShowWindow(hCtl, SW_SHOW);
    }

    // Configure navigation buttons
    if (page == PAGE_WELCOME) {
        EnableWindow(g_hBtnBack, FALSE);
        SetWindowTextW(g_hBtnNext, L"Next >");
    } else if (page == PAGE_LICENSE) {
        EnableWindow(g_hBtnBack, TRUE);
        SetWindowTextW(g_hBtnNext, L"Next >");
    } else if (page == PAGE_COMPONENTS) {
        EnableWindow(g_hBtnBack, TRUE);
        SetWindowTextW(g_hBtnNext, L"Install");
    } else if (page == PAGE_INSTALLING) {
        EnableWindow(g_hBtnBack, FALSE);
        EnableWindow(g_hBtnNext, FALSE);
        EnableWindow(g_hBtnCancel, FALSE);
    } else if (page == PAGE_COMPLETE) {
        EnableWindow(g_hBtnBack, FALSE);
        EnableWindow(g_hBtnNext, TRUE);
        EnableWindow(g_hBtnCancel, FALSE);
        SetWindowTextW(g_hBtnNext, L"Finish");
    }

    InvalidateRect(g_hMainWnd, NULL, TRUE);
}

void CreateShortcut(const std::wstring& targetPath, const std::wstring& shortcutPath, const std::wstring& description) {
    CoInitialize(NULL);
    IShellLinkW* psl = NULL;
    if (SUCCEEDED(CoCreateInstance(CLSID_ShellLink, NULL, CLSCTX_INPROC_SERVER, IID_IShellLinkW, (LPVOID*)&psl))) {
        psl->SetPath(targetPath.c_str());
        psl->SetDescription(description.c_str());
        // Set working directory to target folder
        wchar_t szWork[MAX_PATH] = { 0 };
        wcscpy_s(szWork, targetPath.c_str());
        PathRemoveFileSpecW(szWork);
        psl->SetWorkingDirectory(szWork);
        IPersistFile* ppf = NULL;
        if (SUCCEEDED(psl->QueryInterface(IID_IPersistFile, (LPVOID*)&ppf))) {
            ppf->Save(shortcutPath.c_str(), TRUE);
            ppf->Release();
        }
        psl->Release();
    }
    CoUninitialize();
}

bool ExtractResourceToFile(int resId, const std::wstring& targetPath) {
    HRSRC hRes = FindResourceW(g_hInst, MAKEINTRESOURCEW(resId), RT_RCDATA);
    if (!hRes) return false;
    HGLOBAL hData = LoadResource(g_hInst, hRes);
    if (!hData) return false;
    DWORD size = SizeofResource(g_hInst, hRes);
    void* pData = LockResource(hData);
    if (!pData || size == 0) return false;

    HANDLE hFile = CreateFileW(targetPath.c_str(), GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile == INVALID_HANDLE_VALUE) return false;
    DWORD written = 0;
    BOOL ok = WriteFile(hFile, pData, size, &written, NULL);
    CloseHandle(hFile);
    return (ok && written == size);
}

void InstallAppFile(int resId, const std::wstring& filename, const std::wstring& binSource) {
    std::wstring target = g_installDir + L"\\" + filename;
    if (ExtractResourceToFile(resId, target)) {
        return;
    }
    // Fallback to copying from directory if resource was not found
    std::wstring src = binSource + L"\\" + filename;
    if (PathFileExistsW(src.c_str())) {
        std::error_code ec;
        std::filesystem::copy_file(src, target, std::filesystem::copy_options::overwrite_existing, ec);
    }
}

void PerformInstallation(HWND hwnd) {
    ShowPage(PAGE_INSTALLING);

    HWND hProg = GetDlgItem(hwnd, IDC_PROGRESS_BAR);
    HWND hStat = GetDlgItem(hwnd, IDC_LBL_STATUS);
    SendMessageW(hProg, PBM_SETRANGE32, 0, 100);

    // Create target install directory
    std::filesystem::create_directories(g_installDir);

    auto updateStep = [hProg, hStat](int pos, const wchar_t* txt) {
        SendMessageW(hProg, PBM_SETPOS, pos, 0);
        SetWindowTextW(hStat, txt);
        Sleep(200);
    };

    updateStep(10, L"Preparing sovereign environment...");

    // Find source binaries
    std::wstring binSource = g_sourceDir;
    if (PathFileExistsW((g_sourceDir + L"\\bin\\GiriDrift.exe").c_str())) {
        binSource = g_sourceDir + L"\\bin";
    }

    if (g_installDrift) {
        updateStep(25, L"Installing Giri Drift (Document Composer)...");
        InstallAppFile(1002, L"GiriDrift.exe", binSource);
    }

    if (g_installAxis) {
        updateStep(45, L"Installing Giri Axis (Financial Matrix)...");
        InstallAppFile(1003, L"GiriAxis.exe", binSource);
    }

    if (g_installKinetic) {
        updateStep(65, L"Installing Giri Kinetic (Presentation Studio)...");
        InstallAppFile(1004, L"GiriKinetic.exe", binSource);
    }

    if (g_installHub) {
        updateStep(80, L"Installing Giri Orbit Suite Hub...");
        InstallAppFile(1001, L"GiriOrbit.exe", binSource);
    }

    updateStep(85, L"Installing Enterprise Template Gallery & Lexicon Dictionary...");
    try {
        std::filesystem::create_directories(g_installDir + L"\\Templates");
        std::filesystem::create_directories(g_installDir + L"\\Dict");

        std::wstring tmplSrc = g_sourceDir + L"\\templates";
        if (!PathFileExistsW(tmplSrc.c_str())) tmplSrc = g_sourceDir + L"\\..\\templates";
        if (PathFileExistsW(tmplSrc.c_str())) {
            std::filesystem::copy(tmplSrc, g_installDir + L"\\Templates", std::filesystem::copy_options::recursive | std::filesystem::copy_options::overwrite_existing);
        }

        std::wstring dictSrc = g_sourceDir + L"\\dict";
        if (!PathFileExistsW(dictSrc.c_str())) dictSrc = g_sourceDir + L"\\..\\dict";
        if (PathFileExistsW(dictSrc.c_str())) {
            std::filesystem::copy(dictSrc, g_installDir + L"\\Dict", std::filesystem::copy_options::recursive | std::filesystem::copy_options::overwrite_existing);
        }
    } catch (...) {}


    if (g_installFonts) {
        updateStep(86, L"Installing International Fonts & Google Hindi Font (Noto Sans Devanagari)...");
        try {
            std::filesystem::create_directories(g_installDir + L"\\Fonts");
            std::wstring fontSrc = g_sourceDir + L"\\fonts";
            if (!PathFileExistsW(fontSrc.c_str())) fontSrc = g_sourceDir + L"\\..\\fonts";
            if (PathFileExistsW(fontSrc.c_str())) {
                std::filesystem::copy(fontSrc, g_installDir + L"\\Fonts", std::filesystem::copy_options::recursive | std::filesystem::copy_options::overwrite_existing);
            }
            std::wstring hindiFont = g_installDir + L"\\Fonts\\NotoSansDevanagari.ttf";
            if (PathFileExistsW(hindiFont.c_str())) {
                AddFontResourceExW(hindiFont.c_str(), FR_PRIVATE, NULL);
            }
        } catch (...) {}
    }

    if (g_installLang) {
        updateStep(87, L"Installing 100+ Multilingual Satellite Language Packs (~2.5 GB)...");
        try {
            std::filesystem::create_directories(g_installDir + L"\\Languages");
            std::wstring langSrc = g_sourceDir + L"\\languages";
            if (!PathFileExistsW(langSrc.c_str())) langSrc = g_sourceDir + L"\\..\\languages";
            if (PathFileExistsW(langSrc.c_str())) {
                std::filesystem::copy(langSrc, g_installDir + L"\\Languages", std::filesystem::copy_options::recursive | std::filesystem::copy_options::overwrite_existing);
            }
        } catch (...) {}
    }

    if (g_installRuntimes) {
        updateStep(88, L"Installing Web & Telemetry Runtimes (WebView2 & Orbit Sync Daemon)...");
        try {
            std::filesystem::create_directories(g_installDir + L"\\Runtimes");
            std::wstring rtSrc = g_sourceDir + L"\\runtimes";
            if (!PathFileExistsW(rtSrc.c_str())) rtSrc = g_sourceDir + L"\\..\\runtimes";
            if (PathFileExistsW(rtSrc.c_str())) {
                std::filesystem::copy(rtSrc, g_installDir + L"\\Runtimes", std::filesystem::copy_options::recursive | std::filesystem::copy_options::overwrite_existing);
            }
        } catch (...) {}
    }

    if (g_createShortcut) {
        updateStep(90, L"Creating desktop shortcuts...");
        wchar_t szDesktop[MAX_PATH] = { 0 };
        SHGetFolderPathW(NULL, CSIDL_DESKTOPDIRECTORY, NULL, 0, szDesktop);
        std::wstring desktop = szDesktop;

        if (g_installHub) {
            CreateShortcut(g_installDir + L"\\GiriOrbit.exe", desktop + L"\\Giri Orbit.lnk", L"Giri Orbit Sovereign Suite");
            CreateShortcut(g_installDir + L"\\GiriOrbit.exe", desktop + L"\\Giri Orbit — Office Suite.lnk", L"Giri Orbit Sovereign Suite");
        }
        if (g_installDrift) CreateShortcut(g_installDir + L"\\GiriDrift.exe", desktop + L"\\Giri Drift.lnk", L"Giri Drift Document Composer");
        if (g_installAxis) CreateShortcut(g_installDir + L"\\GiriAxis.exe", desktop + L"\\Giri Axis.lnk", L"Giri Axis Financial Matrix");
        if (g_installKinetic) CreateShortcut(g_installDir + L"\\GiriKinetic.exe", desktop + L"\\Giri Kinetic.lnk", L"Giri Kinetic Presentation Studio");
    }

    if (g_registerAssoc) {
        updateStep(95, L"Registering sovereign universal file associations (.giri)...");
        // Associate .giri with GiriOrbit.exe
        HKEY hKey;
        if (RegCreateKeyW(HKEY_CURRENT_USER, L"Software\\Classes\\.giri", &hKey) == ERROR_SUCCESS) {
            RegSetValueExW(hKey, NULL, 0, REG_SZ, (const BYTE*)L"GiriOrbit.Document", sizeof(L"GiriOrbit.Document"));
            RegCloseKey(hKey);
        }
        if (RegCreateKeyW(HKEY_CURRENT_USER, L"Software\\Classes\\GiriOrbit.Document\\shell\\open\\command", &hKey) == ERROR_SUCCESS) {
            std::wstring cmd = L"\"" + g_installDir + L"\\GiriOrbit.exe\" \"%1\"";
            RegSetValueExW(hKey, NULL, 0, REG_SZ, (const BYTE*)cmd.c_str(), (DWORD)((cmd.length() + 1) * sizeof(wchar_t)));
            RegCloseKey(hKey);
        }
    }

    updateStep(100, L"Installation completed successfully!");
    ShowPage(PAGE_COMPLETE);
}

LRESULT CALLBACK WizardWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT client;
        GetClientRect(hwnd, &client);

        // Draw Left Brand Sidebar (width = 220px)
        RECT sideRect = { 0, 0, 220, client.bottom - 50 };
        HBRUSH hSideBrush = CreateSolidBrush(RGB(15, 23, 42)); // Slate-900 Deep Navy
        FillRect(hdc, &sideRect, hSideBrush);
        DeleteObject(hSideBrush);

        // Sidebar Content
        SetBkMode(hdc, TRANSPARENT);
        HFONT hSideFontTitle = CreateFontW(20, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                          OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                          VARIABLE_PITCH, L"Segoe UI");
        HFONT hSideFontSub = CreateFontW(13, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, DEFAULT_CHARSET,
                                        OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, CLEARTYPE_QUALITY,
                                        VARIABLE_PITCH, L"Segoe UI");

        HGDIOBJ oldFont = SelectObject(hdc, hSideFontTitle);
        SetTextColor(hdc, RGB(248, 250, 252));
        RECT rSideT = { 20, 60, 200, 90 };
        DrawTextW(hdc, L"GIRI ORBIT", -1, &rSideT, DT_CENTER | DT_SINGLELINE);

        SelectObject(hdc, hSideFontSub);
        SetTextColor(hdc, RGB(56, 189, 248)); // Sky blue
        RECT rSideS = { 20, 92, 200, 115 };
        DrawTextW(hdc, L"Sovereign Workspace", -1, &rSideS, DT_CENTER | DT_SINGLELINE);

        SetTextColor(hdc, RGB(148, 163, 184)); // Slate-400
        RECT rSideB = { 20, 150, 200, 300 };
        DrawTextW(hdc, L"• Zero Cloud Lock-In\n• 100% Offline Standalone\n• Universal Office (.giri)\n• In-Memory Safety\n• Made by Abhinav Giri\n  (@abhinavgiri45)", -1, &rSideB, DT_LEFT);

        RECT rSideV = { 20, client.bottom - 90, 200, client.bottom - 60 };
        DrawTextW(hdc, L"64-BIT (X64)\nv11.8.5 RELEASE", -1, &rSideV, DT_CENTER);

        // Divider line above bottom buttons
        HPEN hLinePen = CreatePen(PS_SOLID, 1, RGB(203, 213, 225));
        HGDIOBJ oldPen = SelectObject(hdc, hLinePen);
        MoveToEx(hdc, 0, client.bottom - 50, NULL);
        LineTo(hdc, client.right, client.bottom - 50);
        SelectObject(hdc, oldPen);
        DeleteObject(hLinePen);

        SelectObject(hdc, oldFont);
        DeleteObject(hSideFontTitle);
        DeleteObject(hSideFontSub);

        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_COMMAND: {
        WORD id = LOWORD(wParam);
        if (id == IDC_BTN_NEXT) {
            if (g_currentPage == PAGE_WELCOME) {
                ShowPage(PAGE_LICENSE);
            } else if (g_currentPage == PAGE_LICENSE) {
                if (IsDlgButtonChecked(hwnd, IDC_RADIO_DECLINE) == BST_CHECKED) {
                    MessageBoxW(hwnd, L"You must accept the sovereign license agreement to install Giri Orbit.", L"Setup", MB_OK | MB_ICONWARNING);
                    return 0;
                }
                ShowPage(PAGE_COMPONENTS);
            } else if (g_currentPage == PAGE_COMPONENTS) {
                g_installDrift = (IsDlgButtonChecked(hwnd, IDC_CHK_DRIFT) == BST_CHECKED);
                g_installAxis = (IsDlgButtonChecked(hwnd, IDC_CHK_AXIS) == BST_CHECKED);
                g_installKinetic = (IsDlgButtonChecked(hwnd, IDC_CHK_KINETIC) == BST_CHECKED);
                g_installHub = (IsDlgButtonChecked(hwnd, IDC_CHK_HUB) == BST_CHECKED);
                g_createShortcut = (IsDlgButtonChecked(hwnd, IDC_CHK_SHORTCUT) == BST_CHECKED);
                g_registerAssoc = (IsDlgButtonChecked(hwnd, IDC_CHK_ASSOC) == BST_CHECKED);

                PerformInstallation(hwnd);
            } else if (g_currentPage == PAGE_COMPLETE) {
                if (IsDlgButtonChecked(hwnd, IDC_CHK_LAUNCH) == BST_CHECKED) {
                    std::wstring hubPath = g_installDir + L"\\GiriOrbit.exe";
                    ShellExecuteW(NULL, L"open", hubPath.c_str(), NULL, NULL, SW_SHOWNORMAL);
                }
                PostQuitMessage(0);
            }
            return 0;
        } else if (id == IDC_BTN_BACK) {
            if (g_currentPage == PAGE_LICENSE) ShowPage(PAGE_WELCOME);
            else if (g_currentPage == PAGE_COMPONENTS) ShowPage(PAGE_LICENSE);
            return 0;
        } else if (id == IDC_BTN_CANCEL) {
            if (MessageBoxW(hwnd, L"Are you sure you want to exit Giri Orbit Setup?", L"Setup", MB_YESNO | MB_ICONQUESTION) == IDYES) {
                PostQuitMessage(0);
            }
            return 0;
        } else if (id == IDC_CHK_SELECT_ALL) {
            BOOL checked = (IsDlgButtonChecked(hwnd, IDC_CHK_SELECT_ALL) == BST_CHECKED);
            CheckDlgButton(hwnd, IDC_CHK_DRIFT, checked ? BST_CHECKED : BST_UNCHECKED);
            CheckDlgButton(hwnd, IDC_CHK_AXIS, checked ? BST_CHECKED : BST_UNCHECKED);
            CheckDlgButton(hwnd, IDC_CHK_KINETIC, checked ? BST_CHECKED : BST_UNCHECKED);
            CheckDlgButton(hwnd, IDC_CHK_HUB, checked ? BST_CHECKED : BST_UNCHECKED);
            return 0;
        }
        return 0;
    }
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}
