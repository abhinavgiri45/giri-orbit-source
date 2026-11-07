# Giri Orbit PC - Complete Sovereign Suite Build Script
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

# 1. Giri Drift (Word Processor)
Write-Host "[1/9] Compiling Giri Drift (Executive Word Processor)..." -ForegroundColor Yellow
windres -i "$baseDir\src\drift\resource.rc" -o "$baseDir\src\drift\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\drift\main.cpp" "$baseDir\src\drift\resource.o" -o "$baseDir\bin\GiriDrift.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lgdiplus -lmsimg32

# 2. Giri Axis (Spreadsheet)
Write-Host "[2/9] Compiling Giri Axis (Financial Matrix Calc)..." -ForegroundColor Yellow
windres -i "$baseDir\src\axis\resource.rc" -o "$baseDir\src\axis\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\axis\main.cpp" "$baseDir\src\axis\resource.o" -o "$baseDir\bin\GiriAxis.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lgdiplus -lmsimg32

# 3. Giri Kinetic (Presentation)
Write-Host "[3/9] Compiling Giri Kinetic (Cinematic Widescreen Show)..." -ForegroundColor Yellow
windres -i "$baseDir\src\kinetic\resource.rc" -o "$baseDir\src\kinetic\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\kinetic\main.cpp" "$baseDir\src\kinetic\resource.o" -o "$baseDir\bin\GiriKinetic.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lgdiplus -lmsimg32

# 4. Giri Forms (Form & Survey Studio)
Write-Host "[4/9] Compiling Giri Forms (Enterprise Survey Studio)..." -ForegroundColor Yellow
windres -i "$baseDir\src\forms\resource.rc" -o "$baseDir\src\forms\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\forms\main.cpp" "$baseDir\src\forms\resource.o" -o "$baseDir\bin\GiriForms.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lgdiplus -lmsimg32

# 5. Giri Quiz (Assessment Studio)
Write-Host "[5/9] Compiling Giri Quiz (Assessment & Exam Studio)..." -ForegroundColor Yellow
windres -i "$baseDir\src\quiz\resource.rc" -o "$baseDir\src\quiz\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\quiz\main.cpp" "$baseDir\src\quiz\resource.o" -o "$baseDir\bin\GiriQuiz.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lgdiplus -lmsimg32

# 6. Giri Lists (Task Matrix & Kanban)
Write-Host "[6/9] Compiling Giri Lists (Task Matrix & Kanban Studio)..." -ForegroundColor Yellow
windres -i "$baseDir\src\lists\resource.rc" -o "$baseDir\src\lists\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\lists\main.cpp" "$baseDir\src\lists\resource.o" -o "$baseDir\bin\GiriLists.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lgdiplus -lmsimg32

# 7. Giri Designer (Graphic Studio)
Write-Host "[7/9] Compiling Giri Designer (Creative Graphic & Banner Studio)..." -ForegroundColor Yellow
windres -i "$baseDir\src\designer\resource.rc" -o "$baseDir\src\designer\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\designer\main.cpp" "$baseDir\src\designer\resource.o" -o "$baseDir\bin\GiriDesigner.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -lgdiplus -lmsimg32

# 8. Giri Orbit Hub (Master Orchestrator)
Write-Host "[8/9] Compiling Giri Orbit Hub (Master Orchestrator)..." -ForegroundColor Yellow
windres -i "$baseDir\src\hub\resource.rc" -o "$baseDir\src\hub\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\hub\main.cpp" "$baseDir\src\hub\resource.o" -o "$baseDir\bin\GiriOrbit.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lwininet -lgdiplus -lole32

# 9. Dedicated Setup Wizard
Write-Host "[9/9] Compiling Setup Wizard..." -ForegroundColor Yellow
windres -i "$baseDir\src\installer\resource.rc" -o "$baseDir\src\installer\resource.o"
g++ -std=c++20 -O3 -s -mwindows -municode "$baseDir\src\installer\main.cpp" "$baseDir\src\installer\resource.o" -o "$baseDir\bin\Setup.exe" -lcomctl32 -lcomdlg32 -lshell32 -lshlwapi -lgdi32 -lole32 -luuid

# 10. Authenticode Sign
Write-Host "Signing all executables with Abhinav Giri Authenticode certificate..." -ForegroundColor Green
$cert = Get-Item "Cert:\CurrentUser\My\76B5D8F9DD988F5EEEBDEBBFD6CC3658AC0211E0"
$files = Get-ChildItem "$baseDir\bin\*.exe"
foreach ($f in $files) {
    Set-AuthenticodeSignature -FilePath $f.FullName -Certificate $cert -HashAlgorithm SHA256 -TimestampServer "http://timestamp.digicert.com" | Out-Null
    Write-Host "  [OK] Signed $($f.Name)" -ForegroundColor Green
}

Write-Host "All 9 native C++ desktop executables built and signed successfully!" -ForegroundColor Cyan
