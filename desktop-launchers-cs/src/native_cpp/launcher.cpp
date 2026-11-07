/* ============================================================================
 * GIRI ORBIT — MASTER WIN32 DESKTOP LAUNCHER (launcher.cpp)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * Architecture Support: x86 (32-bit), x64 (64-bit), ARM64
 * Integrated GitHub Auto-Updater and Browser Optimization Engine
 * ============================================================================
 */

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shellapi.h>
#include <shlobj.h>
#include <tchar.h>
#include <string>
#include <sstream>
#include "AutoUpdater.h"

// Target Architecture definition
#if defined(_M_ARM64) || defined(__aarch64__)
    #define GIRI_ORBIT_ARCH _T("ARM64")
#elif defined(_M_X64) || defined(__x86_64__)
    #define GIRI_ORBIT_ARCH _T("x64")
#else
    #define GIRI_ORBIT_ARCH _T("x86")
#endif

// Configure Windows Registry Browser Emulation for maximum HTML5 / CSS3 / ES6 engine
void SetupBrowserEmulation(LPCTSTR exeName) {
    HKEY hKey;
    LPCTSTR subKey = _T("Software\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_BROWSER_EMULATION");
    if (RegCreateKeyEx(HKEY_CURRENT_USER, subKey, 0, NULL, REG_OPTION_NON_VOLATILE, KEY_SET_VALUE, NULL, &hKey, NULL) == ERROR_SUCCESS) {
        DWORD dwValue = 11001; // IE11 Edge Mode
        RegSetValueEx(hKey, exeName, 0, REG_DWORD, (const BYTE*)&dwValue, sizeof(dwValue));
        RegCloseKey(hKey);
    }
}

// WinMain Entry Point
int WINAPI _tWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPTSTR lpCmdLine, int nCmdShow) {
    // 1. Ensure Per-Monitor High DPI Awareness
    SetProcessDPIAware();

    // 2. Start background GitHub repository auto-updater (checks when online every 15 minutes)
    GiriOrbit::AutoUpdater::Instance().StartBackgroundCheck(
        L"https://raw.githubusercontent.com/abhinavgiri45/giri-orbit/main/version.json", 15);

    // 3. Identify executable location
    TCHAR modulePath[MAX_PATH];
    GetModuleFileName(NULL, modulePath, MAX_PATH);

    TCHAR* lastSlash = _tcsrchr(modulePath, _T('\\'));
    TCHAR dirPath[MAX_PATH] = {0};
    TCHAR exeName[MAX_PATH] = {0};

    if (lastSlash != NULL) {
        _tcscpy_s(exeName, MAX_PATH, lastSlash + 1);
        size_t dirLen = lastSlash - modulePath;
        _tcsncpy_s(dirPath, MAX_PATH, modulePath, dirLen);
    }

    // 4. Register Browser Emulation Key
    SetupBrowserEmulation(exeName);
    SetupBrowserEmulation(_T("GiriOrbit.exe"));
    SetupBrowserEmulation(_T("GiriDrift.exe"));
    SetupBrowserEmulation(_T("GiriAxis.exe"));
    SetupBrowserEmulation(_T("GiriKinetic.exe"));
    SetupBrowserEmulation(_T("GiriAegis.exe"));
    SetupBrowserEmulation(_T("Girionix.exe"));

    // 5. Launch Dedicated Core Application Engine
    TCHAR targetApp[MAX_PATH];
    _stprintf_s(targetApp, MAX_PATH, _T("%s\\GiriOrbit.exe"), dirPath);

    DWORD attr = GetFileAttributes(targetApp);
    if (attr == INVALID_FILE_ATTRIBUTES || (attr & FILE_ATTRIBUTE_DIRECTORY)) {
        TCHAR msg[512];
        _stprintf_s(msg, 512, _T("Giri Orbit [%s Edition]\n\nStarting Giri Orbit Core Desktop Suite..."), GIRI_ORBIT_ARCH);
        MessageBox(NULL, msg, _T("Giri Orbit — Zero-Gravity Suite"), MB_OK | MB_ICONINFORMATION);
    }

    STARTUPINFO si = { sizeof(si) };
    PROCESS_INFORMATION pi = { 0 };

    std::wstring cmd = targetApp;
    if (lpCmdLine && _tcslen(lpCmdLine) > 0) {
        cmd += _T(" ");
        cmd += lpCmdLine;
    }

    if (CreateProcess(NULL, const_cast<LPTSTR>(cmd.c_str()), NULL, NULL, FALSE, 0, NULL, dirPath, &si, &pi)) {
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        return 0;
    }

    return 1;
}
