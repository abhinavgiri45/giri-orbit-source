# Giri Orbit — Complete Source Code Repository
**The Cloud-Free, Sovereign Office Productivity Suite**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: Windows | Android](https://img.shields.io/badge/Platform-Windows%20%7C%20Android-0078D4.svg)](#architecture--repository-structure)
[![C++: C++20](https://img.shields.io/badge/C%2B%2B-20-blue.svg)](#1-compiling-native-win32-c-desktop-apps-exe)
[![Android: Gradle / Java 17](https://img.shields.io/badge/Android-Java%2017%20%7C%20Gradle-3DDC84.svg)](#2-building-android-native-app-apk)

> **Author**: **Abhinav Giri**  
> **GitHub**: [@abhinavgiri45](https://github.com/abhinavgiri45)  
> **Email**: `abhinavgiri370@gmail.com`  
> **Main Repository & Web Hub**: [github.com/abhinavgiri45/giri-orbit](https://github.com/abhinavgiri45/giri-orbit)  

---

## Overview

This repository contains the complete, uncompiled **source code** for all executables (`.exe`), distribution packages (`.zip`), and mobile applications (`.apk`) of the **Giri Orbit** productivity suite:

1. **Native Win32 C++ Desktop Apps (`.exe`)**:
   - **Giri Drift** (`GiriDrift.exe`): Word processor & sovereign document composer.
   - **Giri Axis** (`GiriAxis.exe`): Mathematical matrix calculator & spreadsheet engine.
   - **Giri Kinetic** (`GiriKinetic.exe`): Widescreen slide deck studio with hardware double-buffered 60 FPS transitions and sequential animations.
   - **Giri Orbit Hub** (`GiriOrbit.exe`): Central desktop app launcher and workspace coordinator.
   - **Setup & Uninstaller** (`Setup.exe`): Native standalone offline installer.
   - **Local Background Services**: Offline sync daemon (`OrbitSyncDaemon.exe`) and telemetry stub (`OrbitTelemetryService.exe`).
2. **C# .NET Launchers & Tools**:
   - Source code for .NET launchers, webview container bridges, and diagnostic helpers.
3. **Native Android Studio App (`.apk`)**:
   - Full Gradle Android project with native Java bridge (`MainActivity.java`, `OrbitFileProvider.java`, `WebAppInterface.java`), AndroidManifest, and offline embedded assets.
4. **Distribution Packaging & Automation (`.zip`)**:
   - Python & PowerShell scripts that build portable `.zip` archives, multilingual satellite DLLs, and enterprise distribution bundles.

---

## Architecture & Repository Structure

```
giri-orbit-source/
├── .gitignore
├── LICENSE
├── README.md
│
├── desktop-apps-cpp/                # Native Win32 C++ Desktop Applications (EXE Source)
│   ├── src/
│   │   ├── drift/                   # Giri Drift (Document Composer)
│   │   │   ├── main.cpp
│   │   │   └── resource.rc
│   │   ├── axis/                    # Giri Axis (Spreadsheets & Calculation Grid)
│   │   │   ├── main.cpp
│   │   │   └── resource.rc
│   │   ├── kinetic/                 # Giri Kinetic (Slide Deck Studio)
│   │   │   ├── main.cpp
│   │   │   └── resource.rc
│   │   ├── hub/                     # Giri Orbit Hub (Central Dashboard)
│   │   │   ├── main.cpp
│   │   │   └── resource.rc
│   │   ├── installer/               # Setup & Uninstaller (Offline Installer)
│   │   │   ├── main.cpp
│   │   │   └── resource.rc
│   │   ├── services/                # Local Daemons & Satellite Language DLL Sources
│   │   │   ├── OrbitSyncDaemon.cpp
│   │   │   ├── OrbitTelemetryService.cpp
│   │   │   ├── satellite_lang.c
│   │   │   └── lang_*.c
│   │   └── common/                  # Shared headers, types, and manifests
│   │       ├── sovereign_types.h
│   │       ├── universal_file.h
│   │       └── app.manifest
│   ├── assets/                      # High-resolution application icons (.ico, .png)
│   ├── build.ps1                    # Master PowerShell compilation script (MinGW g++)
│   └── Install_Giri_Orbit.bat       # Portable local launch & installation script
│
├── desktop-launchers-cs/            # C# .NET Launchers & Universal Tools
│   ├── src/
│   │   ├── app/                     # Program.cs, DriftLauncher.cs
│   │   ├── installer/               # SetupProgram.cs
│   │   ├── uninstaller/             # UninstallProgram.cs
│   │   ├── native_cpp/              # C++ launcher wrappers & AutoUpdater headers
│   │   └── shared/                  # AssemblyInfo.cs, app.manifest
│   ├── assets/                      # Branding graphics & icons
│   ├── build.ps1                    # .NET compile script
│   └── build.bat                    # Batch compile runner
│
├── mobile-android-apk/              # Native Android App (APK Project)
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       ├── java/com/giricorporation/giriorbit/
│   │   │       │   ├── MainActivity.java
│   │   │       │   ├── OrbitFileProvider.java
│   │   │       │   └── WebAppInterface.java
│   │   │       ├── res/             # Android layouts, drawables, XML providers
│   │   │       └── assets/www/      # 100% offline embedded web application bundle
│   │   └── build.gradle.kts         # App-level Gradle build configuration
│   ├── gradle/wrapper/              # Gradle wrapper files
│   ├── build.gradle.kts             # Top-level Gradle configuration
│   ├── settings.gradle.kts          # Gradle settings
│   ├── gradle.properties            # Build parameters
│   ├── local.properties.example     # SDK location template
│   ├── gradlew / gradlew.bat        # Gradle wrapper CLI
│   └── build_apk.ps1                # Automated PowerShell direct-to-APK builder
│
└── packaging-and-zip/               # Distribution & Packaging Automation (ZIP Source)
    ├── package_safe_zip.py          # Portable standalone ZIP builder for x64, x86, and arm64
    ├── package_full_enterprise.py   # Multi-language enterprise bundle packager
    ├── generate_satellite_dlls.py   # 100+ Multilingual Satellite DLL compiler
    └── build_all_distributions.ps1  # Master orchestrator for end-to-end releases
```

---

## Build Instructions

### 1. Compiling Native Win32 C++ Desktop Apps (`.exe`)

#### Prerequisites
- Windows 10 / 11 (x64, x86, or ARM64)
- **MinGW-w64** or **w64devkit** with GCC supporting `-std=c++20`
- `windres` (included with MinGW binutils)

#### Quick Build
Open PowerShell in the `desktop-apps-cpp` directory:
```powershell
cd desktop-apps-cpp
.\build.ps1
```
*Note: Add `-NoSign` to skip Authenticode signing if building without an installed digital certificate.*

#### Individual Component Compilation Flags
- **Giri Drift** (`GiriDrift.exe`):
  ```bash
  windres -i src/drift/resource.rc -o src/drift/resource.o
  g++ -std=c++20 -O2 -mwindows -municode src/drift/main.cpp src/drift/resource.o -o bin/GiriDrift.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32
  ```
- **Giri Axis** (`GiriAxis.exe`):
  ```bash
  windres -i src/axis/resource.rc -o src/axis/resource.o
  g++ -std=c++20 -O2 -mwindows -municode src/axis/main.cpp src/axis/resource.o -o bin/GiriAxis.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32
  ```
- **Giri Kinetic** (`GiriKinetic.exe`):
  ```bash
  windres -i src/kinetic/resource.rc -o src/kinetic/resource.o
  g++ -std=c++20 -O2 -mwindows -municode src/kinetic/main.cpp src/kinetic/resource.o -o bin/GiriKinetic.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lmsimg32
  ```
- **Giri Orbit Hub** (`GiriOrbit.exe`):
  ```bash
  windres -i src/hub/resource.rc -o src/hub/resource.o
  g++ -std=c++20 -O2 -mwindows -municode src/hub/main.cpp src/hub/resource.o -o bin/GiriOrbit.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lwininet
  ```
- **Setup Wizard** (`Setup.exe`):
  ```bash
  windres -i src/installer/resource.rc -o src/installer/resource.o
  g++ -std=c++20 -O2 -mwindows -municode src/installer/main.cpp src/installer/resource.o -o bin/Setup.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -luuid
  ```

---

### 2. Building Android Native App (`.apk`)

#### Prerequisites
- **Android SDK** (API Level 34 / Build-Tools 34.0.0+)
- **OpenJDK 17** or **OpenJDK 21**

#### Building via Gradle Wrapper
```bash
cd mobile-android-apk
./gradlew assembleRelease
```
The output APK will be generated at:
`mobile-android-apk/app/build/outputs/apk/release/app-release.apk`

#### Building via Standalone PowerShell Script
```powershell
cd mobile-android-apk
.\build_apk.ps1
```

---

### 3. Generating Standalone Distribution Packages (`.zip`)

#### Prerequisites
- **Python 3.8+**

#### Building Portable ZIP Packages
```bash
cd packaging-and-zip
python package_safe_zip.py
```
This generates:
- `output/dist/GiriOrbit-Setup-x64.zip`
- `output/dist/GiriOrbit-Setup-x86.zip`
- `output/dist/GiriOrbit-Setup-arm64.zip`

#### Generating Multilingual Satellite DLLs
```bash
cd packaging-and-zip
python generate_satellite_dlls.py
```
Compiles satellite DLLs for over 25 major languages including Hindi (Devanagari), English, Spanish, French, German, Chinese, Japanese, Arabic, Russian, Portuguese, and regional Indic languages.

---

### 4. End-to-End Master Pipeline

To compile the desktop apps, compile the satellite DLLs, build the Android APK, and bundle all distribution ZIP packages with one command:
```powershell
cd packaging-and-zip
.\build_all_distributions.ps1
```

---

## Key Features & Design Philosophy

- **Zero Cloud Telemetry**: 100% offline standalone operation. No third-party network pings or telemetry daemons.
- **Pure Win32 GDI & Double-Buffered Rendering**: High-speed, responsive native UI with zero Chromium/WebView2 overhead in the desktop apps.
- **Hardware-Accelerated Kinetic Studio**: True 60 FPS transitions (Fade, Push, Wipe, Dissolve) powered by Win32 `AlphaBlend` (`msimg32`).
- **Complete Android Offline Support**: Full office features packed directly into the APK's asset bundle without requiring external web connectivity.

---

## License & Attribution

Developed by **Abhinav Giri**.  
Released under the permissive **[MIT License](LICENSE)**.

For questions, support, or contributions:
- **Author**: Abhinav Giri
- **Email**: `abhinavgiri370@gmail.com`
- **GitHub**: [https://github.com/abhinavgiri45](https://github.com/abhinavgiri45)
