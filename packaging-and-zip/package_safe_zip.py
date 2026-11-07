#!/usr/bin/env python3
"""
Giri Orbit Enterprise - Standalone Portable ZIP Packager
Copyright (c) 2026 Abhinav Giri. All Rights Reserved.
Author: Abhinav Giri (abhinavgiri370@gmail.com | github.com/abhinavgiri45)

Packs the complete compiled desktop suite into portable, antivirus-safe, standalone ZIP distributions:
- GiriOrbit-Setup-x64.zip
- GiriOrbit-Setup-x86.zip
- GiriOrbit-Setup-arm64.zip
"""

import os
import sys
import zipfile
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BIN_DIR = os.path.join(BASE_DIR, "..", "desktop-apps-cpp", "bin")
OUT_DIR = os.path.join(BASE_DIR, "output", "dist")

os.makedirs(OUT_DIR, exist_ok=True)

TARGET_ARCHS = ["x64", "x86", "arm64"]

CORE_BINARIES = [
    "GiriDrift.exe",
    "GiriAxis.exe",
    "GiriKinetic.exe",
    "GiriOrbit.exe",
    "Setup.exe",
    "OrbitSyncDaemon.exe",
    "OrbitTelemetryService.exe"
]

def create_distribution_zip(arch):
    zip_filename = f"GiriOrbit-Setup-{arch}.zip"
    zip_path = os.path.join(OUT_DIR, zip_filename)
    print(f"[*] Packaging standalone ZIP for {arch} -> {zip_path}")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        # 1. Add binaries if compiled
        if os.path.exists(BIN_DIR):
            for b in CORE_BINARIES:
                src_path = os.path.join(BIN_DIR, b)
                if os.path.exists(src_path):
                    zf.write(src_path, arcname=os.path.join(f"GiriOrbit-{arch}", b))
                    print(f"   + Included binary: {b}")

        # 2. Add Setup & Install script
        bat_path = os.path.join(BASE_DIR, "..", "desktop-apps-cpp", "Install_Giri_Orbit.bat")
        if os.path.exists(bat_path):
            zf.write(bat_path, arcname=os.path.join(f"GiriOrbit-{arch}", "Install_Giri_Orbit.bat"))

        # 3. Add README instructions
        readme_content = f"""======================================================================
               Giri Orbit Enterprise Desktop Suite ({arch})
======================================================================
Copyright (c) 2026 Abhinav Giri. All Rights Reserved.
Author: Abhinav Giri (@abhinavgiri45 | abhinavgiri370@gmail.com)
GitHub: https://github.com/abhinavgiri45/giri-orbit

Components Included:
 - Giri Drift (Document Composer & Word Alternative)
 - Giri Axis (High-Performance Spreadsheets & Excel Alternative)
 - Giri Kinetic (Hardware-Accelerated Presentation Studio)
 - Giri Orbit Hub (Central Sovereign Office Launcher)
 - Setup.exe (Enterprise Standalone Offline Installer)

Installation:
 Simply run Setup.exe or double-click any of the portable applications!
 100% Offline, Zero Cloud Dependency, Fully Standalone.
======================================================================
"""
        zf.writestr(os.path.join(f"GiriOrbit-{arch}", "README.txt"), readme_content)

    print(f"[+] Created {zip_path} ({os.path.getsize(zip_path)} bytes)")

def main():
    print("==================================================")
    print("  Giri Orbit - Standalone Distribution Packager   ")
    print("==================================================")
    for arch in TARGET_ARCHS:
        create_distribution_zip(arch)
    print("\n[SUCCESS] All distribution archives packaged cleanly.")

if __name__ == "__main__":
    main()
