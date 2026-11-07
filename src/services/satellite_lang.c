#include <windows.h>

BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved) {
    return TRUE;
}

__declspec(dllexport) const char* GetLanguageCode(void) {
#ifdef LANG_CODE
    return LANG_CODE;
#else
    return "en_US";
#endif
}

__declspec(dllexport) const wchar_t* GetLanguageNativeName(void) {
#ifdef LANG_NATIVE
    return LANG_NATIVE;
#else
    return L"English";
#endif
}
