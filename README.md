# Giri Orbit PC — Sovereign Desktop Suite (Native C++)

> **100% Offline Standalone Desktop Applications Built From Scratch in Native C++**  
> **Author & Creator:** Abhinav Giri  
> **GitHub:** [@abhinavgiri45](https://github.com/abhinavgiri45) • **Instagram:** [@abhinavgiri45](https://instagram.com/abhinavgiri45) • **Email:** [abhinavgiri370@gmail.com](mailto:abhinavgiri370@gmail.com)  
> **Architecture:** Pure Native Win32 C++20 • Zero Browser • Zero Cloud Telemetry • In-Memory Confidential Computing

---

## ⚡ Overview

Giri Orbit PC is an independent, sovereign desktop productivity suite crafted in pure native C++ with direct Win32 API integration. Designed for executive speed, maximum privacy, and absolute offline resilience, Giri Orbit eliminates web wrappers, electron bloat, and remote server dependencies.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GIRI ORBIT SOVEREIGN SUITE                      │
├─────────────────┬──────────────────────┬───────────────────────────────┤
│   Giri Drift    │      Giri Axis       │         Giri Kinetic          │
│ Document Studio │   Financial Matrix   │      Widescreen Studio        │
│ (.giri, .gdrift)│   (.giri, .gaxis)    │      (.giri, .gkinetic)       │
├─────────────────┴──────────────────────┴───────────────────────────────┤
│                        Giri Orbit Suite Hub                            │
│           Unified Launcher & Sovereign Orchestration Engine           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Dedicated Native Applications

### 1. ✍️ Giri Drift (`GiriDrift.exe`)
*Executive Document Composer & Sovereign Word Processor*
- **Native RichEdit Engine**: In-memory document formatting, bold, italics, underline, strikethrough, alignment, bulleted/numbered lists, color typography.
- **Real-Time Analytics**: Character counts, live word counts, and line/column cursor positioning.
- **Sovereign Formats**: Native support for Universal `.giri`, `.gdrift`, Rich Text (`.rtf`), and plain text (`.txt`).
- **Zero Cloud**: Operates completely in-memory with zero network telemetry.

### 2. 📊 Giri Axis (`GiriAxis.exe`)
*High-Velocity Financial Matrix & Formula Spreadsheet*
- **Dynamic 1000x52 Cell Grid**: Fast row/column headers, arrow key & Tab navigation, active emerald border highlighting.
- **Embedded Formula Parser**: Real-time evaluation of `=SUM(...)`, `=AVERAGE(...)`, `=COUNT(...)`, `=MAX(...)`, `=MIN(...)`, and arithmetic expressions across ranges (e.g. `=SUM(B2:C2)`).
- **Multi-Sheet Tabs**: Bottom tab control for multi-sheet modeling with dynamic sheet additions.
- **Sovereign Formats**: Universal `.giri` format, `.gaxis` spreadsheets, and standard `.csv` data exchange.

### 3. 🎬 Giri Kinetic (`GiriKinetic.exe`)
*Cinematic Widescreen Presentation Studio*
- **16:9 Widescreen Canvas**: Pixel-perfect presentation rendering with live editable titles, subtitles, and slide notes.
- **Slide Thumbnails Strip**: Instant slide reordering, creation, duplication, and navigation.
- **F5 Fullscreen Slide Show**: Hardware-accelerated full-screen presentation mode with keyboard arrow navigation.
- **Global Templates & Watermarks**: Built-in template themes featuring external motif integration and watermark reference links to [PresentationGo](https://www.presentationgo.com).
- **Sovereign Formats**: Universal `.giri` and `.gkinetic` slide decks.

### 4. 🌐 Giri Orbit Hub (`GiriOrbit.exe`)
*Sovereign Workspace Launcher & Orchestrator*
- Single unified desktop dashboard for launching Drift, Axis, Kinetic, and quick-opening universal sovereign `.giri` files.
- Non-blocking background GitHub update checker for automatic update notifications when connected online.

### 5. 🛠️ Dedicated Setup Wizard (`Setup.exe`)
*Native C++ Sovereign Installer*
- Component Selection: Select individual tools (Drift, Axis, Kinetic, Hub) or click **Select All**.
- Sovereign End-User License by **Abhinav Giri**.
- Automated shortcut creation and `.giri` file association.

---

## 🔒 The Universal `.giri` Format

The `.giri` file format is an open, sovereign container that universally represents any office document across Drift, Axis, and Kinetic without vendor lock-in:

```
GIRI_ORBIT_SOVEREIGN_V1
TOOL:drift | axis | kinetic
AUTHOR:Abhinav Giri
ENCODING:UTF-8
DATA_START
<Encrypted or Plaintext Document / Matrix / Slide Deck Payload>
```

---

## 🛠️ Building From Source

Prerequisites: MinGW-w64 GCC with C++20 support (`w64devkit` or MSYS2).

```powershell
# Compile Giri Drift
windres -i src/drift/resource.rc -o src/drift/resource.o
g++ -std=c++20 -O2 -mwindows -municode src/drift/main.cpp src/drift/resource.o -o bin/GiriDrift.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32

# Compile Giri Axis
windres -i src/axis/resource.rc -o src/axis/resource.o
g++ -std=c++20 -O2 -mwindows -municode src/axis/main.cpp src/axis/resource.o -o bin/GiriAxis.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32

# Compile Giri Kinetic
windres -i src/kinetic/resource.rc -o src/kinetic/resource.o
g++ -std=c++20 -O2 -mwindows -municode src/kinetic/main.cpp src/kinetic/resource.o -o bin/GiriKinetic.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32

# Compile Giri Orbit Hub
windres -i src/hub/resource.rc -o src/hub/resource.o
g++ -std=c++20 -O2 -mwindows -municode src/hub/main.cpp src/hub/resource.o -o bin/GiriOrbit.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lwininet

# Compile Dedicated Setup Wizard
windres -i src/installer/resource.rc -o src/installer/resource.o
g++ -std=c++20 -O2 -mwindows -municode src/installer/main.cpp src/installer/resource.o -o bin/Setup.exe -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -luuid
```

---

## 🔒 Strict Proprietary License & Commercial Terms (LICENSABLE ONLY — NO MODIFICATIONS PERMITTED)

> ### ⚠️ STRICT PROPRIETARY SOFTWARE NOTICE: ALL RIGHTS RESERVED
> 
> **Copyright © 2025–2026 Abhinav Giri (@abhinavgiri45). All Rights Reserved.**
>
> This repository and all associated C++ source code, header files, resource definitions, binaries, design systems, algorithms, and architectural specifications are the **exclusive proprietary intellectual property of Abhinav Giri**.
>
> **Strict Legal Prohibitions:**
> 1. **No Modifications or Derivative Works**: NO user, organization, or third party is permitted to modify, edit, alter, patch, customize, reverse-engineer, or create derivative works from this source code in any manner whatsoever.
> 2. **No Unlicensed Use or Compilation**: This software is **NOT open source** and is **NOT free software**. No one may execute, compile, link, deploy, run, test, host, or use this software without an explicit, formal written commercial license executed directly by Abhinav Giri.
> 3. **No Copying or Redistribution**: You may NOT copy, duplicate, distribute, sell, rent, lease, sublicense, mirror, or publish this software or any part thereof.
> 4. **Fully Licensable Exclusively via the Author**: Commercial licenses, enterprise deployment permits, and institutional evaluation rights are granted exclusively through formal written agreements directly with Abhinav Giri.

## 👤 Author & Licensing Inquiries

- **Author**: Abhinav Giri
- **Email**: `abhinavgiri370@gmail.com`
- **GitHub**: [github.com/abhinavgiri45](https://github.com/abhinavgiri45)
- **Instagram**: [@abhinavgiri45](https://instagram.com/abhinavgiri45)
- **License**: Strict Proprietary Commercial Software License (All Rights Reserved — Licensable Only).
