/* ============================================================================
 * GIRI ORBIT — NATIVE WIN32 C++ AUTO-UPDATER (AutoUpdater.h)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * High-Performance WinINet Background Online GitHub Repository Synchronization
 * ============================================================================
 */

#pragma once

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <wininet.h>
#include <tchar.h>
#include <string>
#include <thread>
#include <atomic>
#include <chrono>

#pragma comment(lib, "wininet.lib")

namespace GiriOrbit {

class AutoUpdater {
public:
    static AutoUpdater& Instance() {
        static AutoUpdater instance;
        return instance;
    }

    void StartBackgroundCheck(const std::wstring& repoVersionUrl, int checkIntervalMinutes = 15) {
        if (m_running.exchange(true)) return;
        m_versionUrl = repoVersionUrl;
        m_intervalMinutes = checkIntervalMinutes;

        m_workerThread = std::thread([this]() {
            // Initial delayed check (15 seconds after launch)
            std::this_thread::sleep_for(std::chrono::seconds(15));
            PerformUpdateCheck();

            // Periodic polling while application runs
            while (m_running) {
                for (int i = 0; i < m_intervalMinutes * 60 && m_running; ++i) {
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                }
                if (m_running) {
                    PerformUpdateCheck();
                }
            }
        });
        m_workerThread.detach();
    }

    void Stop() {
        m_running = false;
    }

    bool CheckForUpdatesSync(std::wstring& outRemoteVersion, std::wstring& outBundleUrl) {
        return FetchRemoteVersion(outRemoteVersion, outBundleUrl);
    }

private:
    AutoUpdater() : m_running(false), m_intervalMinutes(15) {}
    ~AutoUpdater() { Stop(); }

    std::atomic<bool> m_running;
    std::wstring m_versionUrl;
    int m_intervalMinutes;
    std::thread m_workerThread;
    const std::wstring m_currentVersion = L"11.8.2";

    bool IsSystemOnline() {
        DWORD flags = 0;
        return InternetGetConnectedState(&flags, 0) != FALSE;
    }

    bool FetchRemoteVersion(std::wstring& outVer, std::wstring& outUrl) {
        if (!IsSystemOnline()) return false;

        HINTERNET hInternet = InternetOpen(L"GiriOrbit-Native-Updater/11.8", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
        if (!hInternet) return false;

        DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE | INTERNET_FLAG_SECURE;
        HINTERNET hUrl = InternetOpenUrl(hInternet, m_versionUrl.c_str(), NULL, 0, flags, 0);
        if (!hUrl) {
            InternetCloseHandle(hInternet);
            return false;
        }

        std::string json;
        char buffer[2048];
        DWORD bytesRead = 0;
        while (InternetReadFile(hUrl, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
            buffer[bytesRead] = '\0';
            json += buffer;
        }

        InternetCloseHandle(hUrl);
        InternetCloseHandle(hInternet);

        if (json.empty()) return false;

        // Parse version
        size_t verPos = json.find("\"version\":");
        if (verPos != std::string::npos) {
            size_t start = json.find("\"", verPos + 10);
            if (start != std::string::npos) {
                size_t end = json.find("\"", start + 1);
                if (end != std::string::npos) {
                    std::string verStr = json.substr(start + 1, end - start - 1);
                    outVer = std::wstring(verStr.begin(), verStr.end());
                }
            }
        }

        // Parse assetsBundleUrl
        size_t urlPos = json.find("\"assetsBundleUrl\":");
        if (urlPos != std::string::npos) {
            size_t start = json.find("\"", urlPos + 18);
            if (start != std::string::npos) {
                size_t end = json.find("\"", start + 1);
                if (end != std::string::npos) {
                    std::string urlStr = json.substr(start + 1, end - start - 1);
                    outUrl = std::wstring(urlStr.begin(), urlStr.end());
                }
            }
        }

        return !outVer.empty();
    }

    void PerformUpdateCheck() {
        std::wstring remoteVer, bundleUrl;
        if (FetchRemoteVersion(remoteVer, bundleUrl)) {
            if (!remoteVer.empty() && remoteVer != m_currentVersion) {
                DownloadAndApplyUpdate(bundleUrl, remoteVer);
            }
        }
    }

    bool DownloadAndApplyUpdate(const std::wstring& bundleUrl, const std::wstring& newVer) {
        if (bundleUrl.empty()) return false;

        WCHAR tempPath[MAX_PATH];
        GetTempPathW(MAX_PATH, tempPath);
        std::wstring tempZip = std::wstring(tempPath) + L"giri_orbit_native_update.zip";

        HINTERNET hInternet = InternetOpen(L"GiriOrbit-Native-Updater/11.8", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
        if (!hInternet) return false;

        HINTERNET hUrl = InternetOpenUrl(hInternet, bundleUrl.c_str(), NULL, 0, INTERNET_FLAG_RELOAD | INTERNET_FLAG_SECURE, 0);
        if (!hUrl) {
            InternetCloseHandle(hInternet);
            return false;
        }

        HANDLE hFile = CreateFileW(tempZip.c_str(), GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
        if (hFile == INVALID_HANDLE_VALUE) {
            InternetCloseHandle(hUrl);
            InternetCloseHandle(hInternet);
            return false;
        }

        BYTE buf[8192];
        DWORD readBytes = 0, written = 0;
        while (InternetReadFile(hUrl, buf, sizeof(buf), &readBytes) && readBytes > 0) {
            WriteFile(hFile, buf, readBytes, &written, NULL);
        }

        CloseHandle(hFile);
        InternetCloseHandle(hUrl);
        InternetCloseHandle(hInternet);

        // Target application directory
        WCHAR modulePath[MAX_PATH];
        GetModuleFileNameW(NULL, modulePath, MAX_PATH);
        WCHAR* lastSlash = wcsrchr(modulePath, L'\\');
        if (lastSlash) *lastSlash = L'\0';

        std::wstring appDataDir = std::wstring(modulePath) + L"\\app_data";
        CreateDirectoryW(appDataDir.c_str(), NULL);

        // Unpack archive using native Windows tar
        std::wstring tarCmd = L"tar.exe -xf \"" + tempZip + L"\" -C \"" + appDataDir + L"\"";
        STARTUPINFO si = { sizeof(si) };
        si.dwFlags = STARTF_USESHOWWINDOW;
        si.wShowWindow = SW_HIDE;
        PROCESS_INFORMATION pi = { 0 };

        if (CreateProcessW(NULL, const_cast<LPWSTR>(tarCmd.c_str()), NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, NULL, &si, &pi)) {
            WaitForSingleObject(pi.hProcess, 30000);
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
        }

        DeleteFileW(tempZip.c_str());
        return true;
    }
};

} // namespace GiriOrbit
