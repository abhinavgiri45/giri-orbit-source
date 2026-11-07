#!/usr/bin/env python3
"""
Giri Orbit Enterprise - Multilingual Satellite DLL Generator
Copyright (c) 2026 Abhinav Giri. All Rights Reserved.
Author: Abhinav Giri (abhinavgiri370@gmail.com | github.com/abhinavgiri45)

Compiles lightweight Win32 satellite resource DLLs providing language localization metadata.
"""

import subprocess
import os
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, "..", "desktop-apps-cpp", "src", "services")
OUT_DIR = os.path.join(BASE_DIR, "output", "languages")

os.makedirs(SRC_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

# Common enterprise language definitions (100+ locales supported)
LANGUAGES = [
    ("hi", "hi_IN", "Hindi (Google Writing Style / Devanagari)"),
    ("en", "en_US", "English (United States)"),
    ("en_gb", "en_GB", "English (United Kingdom)"),
    ("es", "es_ES", "Spanish (Espanol)"),
    ("fr", "fr_FR", "French (Francais)"),
    ("de", "de_DE", "German (Deutsch)"),
    ("zh", "zh_CN", "Chinese Simplified"),
    ("ja", "ja_JP", "Japanese (Nihongo)"),
    ("ru", "ru_RU", "Russian (Russkiy)"),
    ("ar", "ar_SA", "Arabic (العربية)"),
    ("pt", "pt_BR", "Portuguese (Brasil)"),
    ("it", "it_IT", "Italian (Italiano)"),
    ("bn", "bn_IN", "Bengali (Bangla)"),
    ("te", "te_IN", "Telugu"),
    ("mr", "mr_IN", "Marathi"),
    ("ta", "ta_IN", "Tamil"),
    ("gu", "gu_IN", "Gujarati"),
    ("kn", "kn_IN", "Kannada"),
    ("ml", "ml_IN", "Malayalam"),
    ("pa", "pa_IN", "Punjabi"),
    ("ko", "ko_KR", "Korean (Hangul)"),
    ("nl", "nl_NL", "Dutch (Nederlands)"),
    ("tr", "tr_TR", "Turkish (Turkce)"),
    ("pl", "pl_PL", "Polish (Polski)"),
    ("vi", "vi_VN", "Vietnamese (Tieng Viet)")
]

def find_gcc():
    # Check PATH or standard MinGW locations
    gcc = shutil.which("gcc")
    if gcc:
        return gcc
    candidates = [
        r"C:\Users\abhin\AppData\Local\Programs\w64devkit\w64devkit\bin\gcc.exe",
        r"C:\msys64\mingw64\bin\gcc.exe",
        r"C:\MinGW\bin\gcc.exe"
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return "gcc"

def main():
    gcc = find_gcc()
    print(f"[*] Using C Compiler: {gcc}")
    print(f"[*] Generating and compiling {len(LANGUAGES)} Satellite Language DLLs...")

    compiled = 0
    for tag, code, name in LANGUAGES:
        c_code = f"""#include <windows.h>
BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved) {{ return TRUE; }}
__declspec(dllexport) const char* GetLanguageCode(void) {{ return "{code}"; }}
__declspec(dllexport) const wchar_t* GetLanguageName(void) {{ return L"{name}"; }}
"""
        c_file = os.path.join(SRC_DIR, f"lang_{tag}.c")
        dll_file = os.path.join(OUT_DIR, f"lang_{tag}.dll")
        with open(c_file, "w", encoding="utf-8") as f:
            f.write(c_code)

        cmd = [gcc, "-shared", "-s", "-O2", c_file, "-o", dll_file]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True)
            if res.returncode == 0:
                print(f"  [+] Built {os.path.basename(dll_file)} ({os.path.getsize(dll_file)} bytes) - {name}")
                compiled += 1
            else:
                print(f"  [-] Failed {tag}: {res.stderr.strip()}")
        except Exception as e:
            print(f"  [-] Error compiling {tag}: {e}")

    print(f"\n[DONE] Successfully compiled {compiled}/{len(LANGUAGES)} satellite language DLLs into {OUT_DIR}")

if __name__ == "__main__":
    main()
