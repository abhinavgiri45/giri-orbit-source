# Giri Orbit PC — Complete Sovereign Suite Build Script
# Made by Abhinav Giri (@abhinavgiri45)

$gccPath = "C:\Users\abhin\AppData\Local\Programs\w64devkit\w64devkit\bin"
$env:Path = "$gccPath;$env:Path"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " BUILDING GIRI ORBIT NATIVE C++ SOVEREIGN SUITE" -ForegroundColor Cyan
Write-Host " Made by Abhinav Giri (@abhinavgiri45)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseDir = $PSScriptRoot
Set-Location $baseDir

New-Item -ItemType Directory -Force -Path "$baseDir\bin" | Out-Null

# 1. Giri Drift
Write-Host "[1/5] Compiling Giri Drift (Document Composer)..." -ForegroundColor Yellow
windres -i "$baseDir\src\drift\resource.rc" -o "$baseDir\src\drift\resource.o"
g++ -std=c++20 -O2 -mwindows -municode "$baseDir\src\drift\main.cpp" "$baseDir\src\drift\resource.o" -o "$baseDir\bin\GiriDrift.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32

# 2. Giri Axis
Write-Host "[2/5] Compiling Giri Axis (Financial Matrix)..." -ForegroundColor Yellow
windres -i "$baseDir\src\axis\resource.rc" -o "$baseDir\src\axis\resource.o"
g++ -std=c++20 -O2 -mwindows -municode "$baseDir\src\axis\main.cpp" "$baseDir\src\axis\resource.o" -o "$baseDir\bin\GiriAxis.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32

# 3. Giri Kinetic
Write-Host "[3/5] Compiling Giri Kinetic (Cinematic Widescreen Show)..." -ForegroundColor Yellow
windres -i "$baseDir\src\kinetic\resource.rc" -o "$baseDir\src\kinetic\resource.o"
g++ -std=c++20 -O2 -mwindows -municode "$baseDir\src\kinetic\main.cpp" "$baseDir\src\kinetic\resource.o" -o "$baseDir\bin\GiriKinetic.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lmsimg32

# 4. Giri Orbit Hub
Write-Host "[4/5] Compiling Giri Orbit Hub (Orchestrator)..." -ForegroundColor Yellow
windres -i "$baseDir\src\hub\resource.rc" -o "$baseDir\src\hub\resource.o"
g++ -std=c++20 -O2 -mwindows -municode "$baseDir\src\hub\main.cpp" "$baseDir\src\hub\resource.o" -o "$baseDir\bin\GiriOrbit.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lwininet

# 5. Dedicated Setup Wizard
Write-Host "[5/5] Compiling Setup Wizard..." -ForegroundColor Yellow
windres -i "$baseDir\src\installer\resource.rc" -o "$baseDir\src\installer\resource.o"
g++ -std=c++20 -O2 -mwindows -municode "$baseDir\src\installer\main.cpp" "$baseDir\src\installer\resource.o" -o "$baseDir\bin\Setup.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -luuid

# 6. Authenticode Sign
Write-Host "Signing all executables with Abhinav Giri Authenticode certificate..." -ForegroundColor Green
$cert = Get-Item "Cert:\CurrentUser\My\76B5D8F9DD988F5EEEBDEBBFD6CC3658AC0211E0"
$files = Get-ChildItem "$baseDir\bin\*.exe"
foreach ($f in $files) {
    Set-AuthenticodeSignature -FilePath $f.FullName -Certificate $cert -HashAlgorithm SHA256 -TimestampServer "http://timestamp.digicert.com" | Out-Null
    Write-Host "  [OK] Signed $($f.Name)" -ForegroundColor Green
}

Write-Host "All 5 native C++ desktop executables built and signed successfully!" -ForegroundColor Cyan
