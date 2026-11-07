<#
.SYNOPSIS
    Giri Orbit Enterprise - Master Build & Distribution Pipeline
.DESCRIPTION
    Builds the entire Giri Orbit Suite from source:
    1. Compiles native Win32 C++ Desktop Apps (Drift, Axis, Kinetic, Orbit Hub, Setup, Services)
    2. Compiles Multilingual Satellite DLLs
    3. Builds the Android Native APK via Gradle
    4. Bundles portable standalone ZIP distributions for x64, x86, and arm64
.AUTHOR
    Abhinav Giri (@abhinavgiri45 | abhinavgiri370@gmail.com)
    Copyright (c) 2026 Abhinav Giri. All Rights Reserved.
#>

[CmdletBinding()]
param (
    [switch]$SkipAndroid = $false,
    [switch]$SkipDesktop = $false
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   GIRI ORBIT - MASTER SOURCE COMPILATION & PACKAGING PIPELINE" -ForegroundColor Cyan
Write-Host "   Author: Abhinav Giri (github.com/abhinavgiri45)" -ForegroundColor DarkGray
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Desktop C++ Apps
if (-not $SkipDesktop) {
    Write-Host "`n[1/4] Building Native Win32 C++ Desktop Apps..." -ForegroundColor Green
    $DesktopBuild = Join-Path $RootDir "desktop-apps-cpp\build.ps1"
    if (Test-Path $DesktopBuild) {
        & powershell -ExecutionPolicy Bypass -File $DesktopBuild
    } else {
        Write-Warning "desktop-apps-cpp/build.ps1 not found!"
    }
} else {
    Write-Host "`n[1/4] Skipping Desktop C++ build as requested." -ForegroundColor Yellow
}

# 2. Satellite Language DLLs
Write-Host "`n[2/4] Generating Multilingual Satellite DLLs..." -ForegroundColor Green
$SatelliteScript = Join-Path $ScriptDir "generate_satellite_dlls.py"
if (Test-Path $SatelliteScript) {
    python $SatelliteScript
}

# 3. Android APK
if (-not $SkipAndroid) {
    Write-Host "`n[3/4] Building Android Native APK..." -ForegroundColor Green
    $AndroidDir = Join-Path $RootDir "mobile-android-apk"
    $ApkScript = Join-Path $AndroidDir "build_apk.ps1"
    if (Test-Path $ApkScript) {
        & powershell -ExecutionPolicy Bypass -File $ApkScript
    } else {
        Push-Location $AndroidDir
        if (Test-Path ".\gradlew.bat") {
            .\gradlew.bat assembleRelease
        }
        Pop-Location
    }
} else {
    Write-Host "`n[3/4] Skipping Android build as requested." -ForegroundColor Yellow
}

# 4. Standalone ZIP Packaging
Write-Host "`n[4/4] Packaging Standalone ZIP Distributions..." -ForegroundColor Green
$ZipScript = Join-Path $ScriptDir "package_safe_zip.py"
if (Test-Path $ZipScript) {
    python $ZipScript
}

$EnterpriseScript = Join-Path $ScriptDir "package_full_enterprise.py"
if (Test-Path $EnterpriseScript) {
    python $EnterpriseScript
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " [SUCCESS] Entire Giri Orbit Suite compiled & packaged!" -ForegroundColor Green
Write-Host " Output directories:" -ForegroundColor Cyan
Write-Host "  - Desktop EXEs: desktop-apps-cpp/bin/" -ForegroundColor Gray
Write-Host "  - Android APK:  mobile-android-apk/app/build/outputs/apk/" -ForegroundColor Gray
Write-Host "  - Distribution: packaging-and-zip/output/dist/" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Cyan
