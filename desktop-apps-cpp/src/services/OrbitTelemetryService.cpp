/* ============================================================================
 * GIRI ORBIT — TELEMETRY & SYSTEM HEALTH MONITORING DAEMON (OrbitTelemetryService.cpp)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Official Contact: abhinavgiri370@gmail.com
 * Sovereign Offline Diagnostic & Performance Telemetry Engine
 * ============================================================================
 */

#include <windows.h>
#include <psapi.h>
#include <string>
#include <fstream>
#include <chrono>
#include <iomanip>
#include <sstream>

static bool g_running = true;

std::wstring GetTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::wstringstream ss;
    ss << std::put_time(std::localtime(&in_time_t), L"%Y-%m-%d %H:%M:%S");
    return ss.str();
}

void LogTelemetryMetric(const std::wstring& logPath) {
    MEMORYSTATUSEX memInfo;
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);
    GlobalMemoryStatusEx(&memInfo);

    std::wofstream log(logPath.c_str(), std::ios::app);
    if (log.is_open()) {
        log << L"[" << GetTimestamp() << L"] GIRI ORBIT HEALTH HEARTBEAT | "
            << L"RAM Load: " << memInfo.dwMemoryLoad << L"% | "
            << L"Available Physical RAM: " << (memInfo.ullAvailPhys / (1024 * 1024)) << L" MB | "
            << L"Status: OPTIMAL (100% Sovereign Offline)" << std::endl;
    }
}

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPWSTR lpCmdLine, int nCmdShow) {
    // Only one instance allowed
    HANDLE hMutex = CreateMutexW(NULL, TRUE, L"GiriOrbit_Telemetry_Daemon_Mutex_2026");
    if (GetLastError() == ERROR_ALREADY_EXISTS) {
        CloseHandle(hMutex);
        return 0;
    }

    wchar_t localApp[MAX_PATH] = { 0 };
    GetEnvironmentVariableW(L"LOCALAPPDATA", localApp, MAX_PATH);
    std::wstring logDir = std::wstring(localApp) + L"\\Programs\\Giri Orbit\\Logs";
    CreateDirectoryW(logDir.c_str(), NULL);
    std::wstring logFile = logDir + L"\\telemetry_health.log";

    // Immediate initial heartbeat
    LogTelemetryMetric(logFile);

    // Heartbeat every 60 seconds (or runs once if passed -once)
    if (lpCmdLine && wcsstr(lpCmdLine, L"-once")) {
        CloseHandle(hMutex);
        return 0;
    }

    // Low priority background thread
    SetPriorityClass(GetCurrentProcess(), BELOW_NORMAL_PRIORITY_CLASS);

    int count = 0;
    while (g_running && count < 10) { // Keep background footprint minimal
        Sleep(60000); // 1 minute
        LogTelemetryMetric(logFile);
        count++;
    }

    CloseHandle(hMutex);
    return 0;
}
