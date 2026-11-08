#pragma once
#ifndef SOVEREIGN_LAUNCHER_H
#define SOVEREIGN_LAUNCHER_H

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shlwapi.h>
#include <shlobj.h>
#include <shellapi.h>
#include <string>
#include <vector>

namespace GiriOrbit {

// 1. Locate Microsoft Edge or WebView2 runtime executable
inline std::wstring GetEdgeExecutablePath() {
    const wchar_t* candidatePaths[] = {
        L"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        L"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        L"C:\\Program Files (x86)\\Microsoft\\EdgeCore\\msedge.exe",
        L"C:\\Program Files\\Microsoft\\EdgeCore\\msedge.exe"
    };

    for (const wchar_t* p : candidatePaths) {
        if (PathFileExistsW(p)) return std::wstring(p);
    }

    wchar_t regPath[MAX_PATH] = { 0 };
    DWORD bufSize = sizeof(regPath);
    if (RegGetValueW(HKEY_LOCAL_MACHINE, L"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe",
                    NULL, RRF_RT_REG_SZ, NULL, regPath, &bufSize) == ERROR_SUCCESS) {
        if (PathFileExistsW(regPath)) return std::wstring(regPath);
    }

    bufSize = sizeof(regPath);
    if (RegGetValueW(HKEY_CURRENT_USER, L"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe",
                    NULL, RRF_RT_REG_SZ, NULL, regPath, &bufSize) == ERROR_SUCCESS) {
        if (PathFileExistsW(regPath)) return std::wstring(regPath);
    }

    return L"";
}

// 2. Locate local offline app_data/index.html
inline std::wstring GetAppDataIndexPath() {
    wchar_t exePath[MAX_PATH] = { 0 };
    GetModuleFileNameW(NULL, exePath, MAX_PATH);
    PathRemoveFileSpecW(exePath);

    // 1) Relative to executable: <exeDir>\app_data\index.html
    std::wstring p1 = std::wstring(exePath) + L"\\app_data\\index.html";
    if (PathFileExistsW(p1.c_str())) return p1;

    // 2) Parent directory: <exeDir>\..\app_data\index.html
    std::wstring p2 = std::wstring(exePath) + L"\\..\\app_data\\index.html";
    if (PathFileExistsW(p2.c_str())) return p2;

    // 3) Standard installation path: %LOCALAPPDATA%\Programs\Giri Orbit\app_data\index.html
    wchar_t localApp[MAX_PATH] = { 0 };
    if (SHGetFolderPathW(NULL, CSIDL_LOCAL_APPDATA, NULL, 0, localApp) == S_OK) {
        std::wstring p3 = std::wstring(localApp) + L"\\Programs\\Giri Orbit\\app_data\\index.html";
        if (PathFileExistsW(p3.c_str())) return p3;

        std::wstring p4 = std::wstring(localApp) + L"\\Giri Orbit\\app_data\\index.html";
        if (PathFileExistsW(p4.c_str())) return p4;
    }

    // 4) Development directory fallback
    wchar_t userProf[MAX_PATH] = { 0 };
    if (SHGetFolderPathW(NULL, CSIDL_PROFILE, NULL, 0, userProf) == S_OK) {
        std::wstring pDev = std::wstring(userProf) + L"\\OneDrive\\Desktop\\Giri Orbit\\index.html";
        if (PathFileExistsW(pDev.c_str())) return pDev;

        std::wstring pDev2 = std::wstring(userProf) + L"\\Desktop\\Giri Orbit\\index.html";
        if (PathFileExistsW(pDev2.c_str())) return pDev2;
    }

    return L"";
}

// 3. Launch dedicated standalone App Mode window
inline bool TryLaunchSovereignAppMode(const wchar_t* toolName, const wchar_t* lpCmdLine = nullptr) {
    std::wstring edgePath = GetEdgeExecutablePath();
    if (edgePath.empty()) return false;

    std::wstring indexPath = GetAppDataIndexPath();
    if (indexPath.empty()) return false;

    // Convert local Windows path to file URI
    std::wstring fileUri = L"file:///";
    for (wchar_t ch : indexPath) {
        if (ch == L'\\') fileUri += L'/';
        else fileUri += ch;
    }
    fileUri += L"#";
    fileUri += (toolName && *toolName) ? toolName : L"hub";

    // Prepare isolated DataVault profile directory
    wchar_t localApp[MAX_PATH] = { 0 };
    SHGetFolderPathW(NULL, CSIDL_LOCAL_APPDATA, NULL, 0, localApp);
    std::wstring dataVault = std::wstring(localApp) + L"\\Programs\\Giri Orbit\\DataVault\\" + ((toolName && *toolName) ? toolName : L"hub");
    SHCreateDirectoryExW(NULL, dataVault.c_str(), NULL);

    // Construct command line arguments
    std::wstring cmdArgs = L"--app=\"" + fileUri + L"\" "
                          + L"--user-data-dir=\"" + dataVault + L"\" "
                          + L"--window-size=1280,820 "
                          + L"--disable-extensions "
                          + L"--no-default-browser-check "
                          + L"--no-first-run";

    HINSTANCE hResult = ShellExecuteW(
        NULL,
        L"open",
        edgePath.c_str(),
        cmdArgs.c_str(),
        NULL,
        SW_SHOWNORMAL
    );

    return ((INT_PTR)hResult > 32);
}

} // namespace GiriOrbit

#endif // SOVEREIGN_LAUNCHER_H
