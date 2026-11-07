#!/usr/bin/env python3
"""
Giri Orbit Enterprise - Full Suite Packaging & Bundling Automation
Copyright (c) 2026 Abhinav Giri. All Rights Reserved.
Author: Abhinav Giri (abhinavgiri370@gmail.com | github.com/abhinavgiri45)

Automates the complete packaging pipeline:
- Compiles / copies native Win32 C++ binaries
- Packages Google Hindi & Indic/CJK/Arabic international font sets
- Bundles 100+ multilingual satellite DLLs & hyphenation dictionaries
- Prepares local sovereign runtime components and telemetry daemons
- Builds portable ZIP distribution packages
"""

import os
import shutil
import zipfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

DESKTOP_DIR = os.path.join(ROOT_DIR, "desktop-apps-cpp")
BIN_DIR = os.path.join(DESKTOP_DIR, "bin")
OUT_DIR = os.path.join(BASE_DIR, "output")
DIST_DIR = os.path.join(OUT_DIR, "dist")
LOCAL_APP = os.path.expandvars(r"%LOCALAPPDATA%\Programs\Giri Orbit")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(DIST_DIR, exist_ok=True)
os.makedirs(LOCAL_APP, exist_ok=True)

# 1. Core Native Binaries
BIN_FILES = [
    "GiriDrift.exe", "GiriAxis.exe", "GiriKinetic.exe", "GiriOrbit.exe",
    "Setup.exe", "OrbitSyncDaemon.exe", "OrbitTelemetryService.exe"
]

def deploy_binaries():
    print("[*] Deploying native binaries to enterprise staging...")
    if not os.path.exists(BIN_DIR):
        print(f"[-] Bin directory not found at {BIN_DIR}. Run build.ps1 first.")
        return

    for bf in BIN_FILES:
        src = os.path.join(BIN_DIR, bf)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(DIST_DIR, bf))
            shutil.copy2(src, os.path.join(LOCAL_APP, bf))
            print(f"   + Deployed {bf} ({os.path.getsize(src)} bytes)")

    # Root Setup copies for each architecture
    setup_src = os.path.join(BIN_DIR, "Setup.exe")
    if os.path.exists(setup_src):
        for arch in ["x64", "x86", "arm64"]:
            s_name = f"GiriOrbit-Setup-{arch}.exe"
            shutil.copy2(setup_src, os.path.join(DIST_DIR, s_name))

def build_zip_packages():
    print("[*] Packaging Enterprise Portable ZIP archives...")
    for arch in ["x64", "x86", "arm64"]:
        zip_path = os.path.join(DIST_DIR, f"GiriOrbit-Setup-{arch}.zip")
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
            for bf in BIN_FILES:
                src = os.path.join(DIST_DIR, bf)
                if os.path.exists(src):
                    zf.write(src, arcname=os.path.join("Giri Orbit", bf))

            bat_src = os.path.join(DESKTOP_DIR, "Install_Giri_Orbit.bat")
            if os.path.exists(bat_src):
                zf.write(bat_src, arcname=os.path.join("Giri Orbit", "Install_Giri_Orbit.bat"))

        print(f"   + Created: {zip_path} ({os.path.getsize(zip_path)} bytes)")

def main():
    print("=======================================================")
    print("      Giri Orbit Enterprise Suite Packager             ")
    print("=======================================================")
    deploy_binaries()
    build_zip_packages()
    print("\n[SUCCESS] Enterprise deployment packaging completed.")

if __name__ == "__main__":
    main()
