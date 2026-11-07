#pragma once
#ifndef SOVEREIGN_TYPES_H
#define SOVEREIGN_TYPES_H

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <commctrl.h>
#include <richedit.h>
#include <string>
#include <vector>
#include <memory>
#include <fstream>
#include <sstream>

#define GIRI_ORBIT_VERSION_STR L"11.8.5"
#define GIRI_ORBIT_AUTHOR_STR  L"Made by Abhinav Giri"
#define GIRI_ORBIT_GITHUB_URL  L"https://github.com/abhinavgiri45/giri-orbit"
#define GIRI_ORBIT_INSTA_URL   L"https://instagram.com/abhinavgiri45"

// Common command IDs
#define IDM_FILE_NEW         1001
#define IDM_FILE_OPEN        1002
#define IDM_FILE_SAVE        1003
#define IDM_FILE_SAVEAS      1004
#define IDM_FILE_PRINT       1005
#define IDM_FILE_EXIT        1006

#define IDM_EDIT_UNDO        1010
#define IDM_EDIT_REDO        1011
#define IDM_EDIT_CUT         1012
#define IDM_EDIT_COPY        1013
#define IDM_EDIT_PASTE       1014
#define IDM_EDIT_SELECTALL   1015
#define IDM_EDIT_FIND        1016

#define IDM_FORMAT_BOLD      1020
#define IDM_FORMAT_ITALIC    1021
#define IDM_FORMAT_UNDERLINE 1022
#define IDM_FORMAT_STRIKE    1023
#define IDM_FORMAT_FONT      1024
#define IDM_FORMAT_COLOR     1025
#define IDM_FORMAT_HIGHLIGHT 1026
#define IDM_FORMAT_ALIGN_L   1027
#define IDM_FORMAT_ALIGN_C   1028
#define IDM_FORMAT_ALIGN_R   1029
#define IDM_FORMAT_ALIGN_J   1030
#define IDM_FORMAT_BULLETS   1031
#define IDM_FORMAT_NUMBERS   1032

#define IDM_TOOLS_WORDCOUNT  1040
#define IDM_TOOLS_OFFLINE    1041
#define IDM_HELP_ABOUT       1050

#define ID_TOOLBAR           2001
#define ID_STATUSBAR         2002

inline void ShowAboutDialog(HWND hwnd, const wchar_t* toolName) {
    std::wstring msg = std::wstring(toolName) + L"\n" +
        L"Version " + GIRI_ORBIT_VERSION_STR + L" — Native Standalone Desktop Edition\n\n" +
        GIRI_ORBIT_AUTHOR_STR + L"\n\n" +
        L"GitHub: github.com/abhinavgiri45\n" +
        L"Instagram: @abhinavgiri45\n\n" +
        L"Architecture: 100% Offline Sovereign C++ Native Win32 Engine\n" +
        L"Zero Cloud Lock-In • In-Memory Memory Safety • Cryptographic Privacy";
    MessageBoxW(hwnd, msg.c_str(), (std::wstring(L"About ") + toolName).c_str(), MB_OK | MB_ICONINFORMATION);
}

#endif // SOVEREIGN_TYPES_H
