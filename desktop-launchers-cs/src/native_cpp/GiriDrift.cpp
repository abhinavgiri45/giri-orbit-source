/* ============================================================================
 * GIRI DRIFT — DEDICATED NATIVE WIN32 LAUNCHER (GiriDrift.cpp)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * Sovereign Document Composer & Word Processor Engine
 * ============================================================================
 */

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <shellapi.h>
#include <tchar.h>
#include <string>
#include "AutoUpdater.h"

int WINAPI _tWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPTSTR lpCmdLine, int nCmdShow) {
    SetProcessDPIAware();

    // Start background GitHub update checker
    GiriOrbit::AutoUpdater::Instance().StartBackgroundCheck(
        L"https://raw.githubusercontent.com/abhinavgiri45/giri-orbit/main/version.json", 15);

    TCHAR modulePath[MAX_PATH];
    GetModuleFileName(NULL, modulePath, MAX_PATH);
    TCHAR* lastSlash = _tcsrchr(modulePath, _T('\\'));
    TCHAR dirPath[MAX_PATH] = { 0 };
    if (lastSlash != NULL) {
        size_t dirLen = lastSlash - modulePath;
        _tcsncpy_s(dirPath, MAX_PATH, modulePath, dirLen);
    }

    TCHAR targetApp[MAX_PATH];
    _stprintf_s(targetApp, MAX_PATH, _T("%s\\GiriOrbit.exe"), dirPath);

    std::wstring cmd = std::wstring(targetApp) + _T(" -drift");
    if (lpCmdLine && _tcslen(lpCmdLine) > 0) {
        cmd += _T(" \"");
        cmd += lpCmdLine;
        cmd += _T("\"");
    }

    STARTUPINFO si = { sizeof(si) };
    PROCESS_INFORMATION pi = { 0 };

    if (CreateProcess(NULL, const_cast<LPTSTR>(cmd.c_str()), NULL, NULL, FALSE, 0, NULL, dirPath, &si, &pi)) {
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        return 0;
    }

    return 1;
}
