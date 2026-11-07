@echo off
setlocal
echo ==========================================================
echo    GIRI ORBIT - DEDICATED WINDOWS BUILD AUTOMATION
echo ==========================================================

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo All architecture builds and installer wizards compiled successfully!
) else (
    echo.
    echo Build failed with error code %ERRORLEVEL%.
)
pause
