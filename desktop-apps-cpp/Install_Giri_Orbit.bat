@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Giri Orbit Sovereign Suite -- Safe Installation Assistant
color 0B

echo ======================================================================
echo    GIRI ORBIT SOVEREIGN SUITE -- SAFE INSTALLATION ASSISTANT
echo    Made by Abhinav Giri (github.com/abhinavgiri45)
echo    100%% Offline Standalone Native C++ Desktop Edition
echo ======================================================================
echo.

echo [1/3] Removing Windows Mark-of-the-Web download security flag...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -Path '%~dp0' -Recurse | Unblock-File; Write-Host '  [OK] Download restrictions removed.' -ForegroundColor Green"
echo.

echo [2/3] Registering Verified Publisher Certificate (Abhinav Giri)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Path '%~dp0AbhinavGiri_CodeSigning.cer') { Import-Certificate -FilePath '%~dp0AbhinavGiri_CodeSigning.cer' -CertStoreLocation 'Cert:\CurrentUser\TrustedPublisher' | Out-Null; Write-Host '  [OK] Abhinav Giri added to Trusted Publishers.' -ForegroundColor Green } else { Write-Host '  [INFO] Publisher certificate checked.' -ForegroundColor Yellow }"
echo.

echo [3/3] Launching Giri Orbit Setup Wizard...
if exist "GiriOrbit-Setup-x64.exe" (
    start "" "GiriOrbit-Setup-x64.exe"
) else if exist "Setup.exe" (
    start "" "Setup.exe"
) else if exist "GiriOrbit-Setup-x86.exe" (
    start "" "GiriOrbit-Setup-x86.exe"
) else if exist "GiriOrbit-Setup-arm64.exe" (
    start "" "GiriOrbit-Setup-arm64.exe"
) else (
    echo [ERROR] Setup file not found in this folder.
    pause
    exit /b 1
)

echo.
echo [DONE] Setup Wizard launched successfully. You may close this window.
timeout /t 3 >nul
exit /b 0
