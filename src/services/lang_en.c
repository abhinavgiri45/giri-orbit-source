#include <windows.h>
BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved) { return TRUE; }
__declspec(dllexport) const char* GetLanguageCode(void) { return "en_US"; }
__declspec(dllexport) const wchar_t* GetLanguageName(void) { return L"English"; }
