# ============================================================================
# GIRI ORBIT -- MULTI-ARCHITECTURE WINDOWS BUILD AUTOMATION (build.ps1)
# Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
# Builds Self-Contained Native Standalone Setups for x64, x86, and ARM64 Windows PCs
# Embeds Dedicated App Binaries (Orbit, Drift, Axis, Kinetic), Uninstaller,
# Offline Web Assets Bundle, and Dedicated Brand Icons
# ============================================================================

$ErrorActionPreference = 'Stop'

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   GIRI ORBIT -- WINDOWS APPLICATION AND INSTALLER BUILDER " -ForegroundColor Green
Write-Host "   Made by Abhinav Giri (github.com/abhinavgiri45)         " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$csc64 = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$csc32 = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
$iconPath = Join-Path $PSScriptRoot "assets\app.ico"
$logoPng = Join-Path $PSScriptRoot "assets\giri-logo-symbol.png"
$driftIco = Join-Path $PSScriptRoot "assets\drift.ico"
$axisIco = Join-Path $PSScriptRoot "assets\axis.ico"
$kineticIco = Join-Path $PSScriptRoot "assets\kinetic.ico"

$srcApp = Join-Path $PSScriptRoot "src\app\Program.cs"
$srcUninstaller = Join-Path $PSScriptRoot "src\uninstaller\UninstallProgram.cs"
$srcInstaller = Join-Path $PSScriptRoot "src\installer\SetupProgram.cs"
$srcAssemblyInfo = Join-Path $PSScriptRoot "src\shared\AssemblyInfo.cs"
$srcManifest = Join-Path $PSScriptRoot "src\shared\app.manifest"

$distDir = Join-Path $PSScriptRoot "dist"
$downloadsDir = "C:\Users\abhin\OneDrive\Desktop\Giri Orbit\downloads"
$assetsZip = Join-Path $downloadsDir "assets-bundle.zip"

if (!(Test-Path $downloadsDir)) {
    New-Item -ItemType Directory -Path $downloadsDir -Force | Out-Null
}

# 1. Obtain Authenticode Code Signing Certificate for Abhinav Giri
$cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Subject -like '*Abhinav Giri*' } | Select-Object -First 1
if ($cert) {
    Write-Host "Found Code Signing Certificate: $($cert.Subject) [$($cert.Thumbprint)]" -ForegroundColor Green
    # Export public certificate for distribution alongside downloads
    $pubCerPath = Join-Path $downloadsDir "AbhinavGiri_CodeSigning.cer"
    Export-Certificate -Cert $cert -FilePath $pubCerPath -Force | Out-Null
} else {
    Write-Host "WARNING: No certificate found for Abhinav Giri in Cert:\CurrentUser\My" -ForegroundColor Yellow
}

if (!(Test-Path $assetsZip)) {
    Write-Host "WARNING: $assetsZip not found. Building assets bundle first..." -ForegroundColor Yellow
    $parentUpdate = "C:\Users\abhin\OneDrive\Desktop\Giri Orbit\update_all_apps.ps1"
    if (Test-Path $parentUpdate) {
        powershell.exe -ExecutionPolicy Bypass -File $parentUpdate
    }
}

$architectures = @(
    @{ Name = "x64"; Platform = "x64"; Compiler = $csc64 },
    @{ Name = "x86"; Platform = "x86"; Compiler = $csc32 },
    @{ Name = "arm64"; Platform = "anycpu"; Compiler = $csc64 }
)

foreach ($arch in $architectures) {
    $archName = $arch.Name
    $platform = $arch.Platform
    $compiler = $arch.Compiler
    $targetDir = Join-Path $distDir $archName

    if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    Write-Host "`n>>> Building Dedicated Windows Binaries for [$archName] ($platform)..." -ForegroundColor Yellow

    # Common compiler flags for clean PE metadata & anti-false-positive
    $commonArgs = @(
        "/nologo",
        "/optimize+",
        "/target:winexe",
        "/platform:$platform",
        "/win32manifest:$srcManifest"
    )

    # 1. Main Application Engine (Suite Hub)
    $appOut = Join-Path $targetDir "GiriOrbit.exe"
    Write-Host "  -> Compiling GiriOrbit.exe..."
    & $compiler @commonArgs "/win32icon:$iconPath" `
        "/resource:$iconPath,GiriOrbit.AppIcon" `
        "/resource:$logoPng,GiriOrbit.OriginalLogo" `
        /out:$appOut $srcApp $srcAssemblyInfo

    # 2. Dedicated Giri Drift Binary (Document Composer)
    $driftOut = Join-Path $targetDir "GiriDrift.exe"
    Write-Host "  -> Compiling dedicated GiriDrift.exe with custom Drift icon..."
    & $compiler @commonArgs "/win32icon:$driftIco" `
        "/resource:$driftIco,GiriOrbit.AppIcon" `
        "/resource:$logoPng,GiriOrbit.OriginalLogo" `
        /out:$driftOut $srcApp $srcAssemblyInfo

    # 3. Dedicated Giri Axis Binary (Financial Spreadsheet Matrix)
    $axisOut = Join-Path $targetDir "GiriAxis.exe"
    Write-Host "  -> Compiling dedicated GiriAxis.exe with custom Axis icon..."
    & $compiler @commonArgs "/win32icon:$axisIco" `
        "/resource:$axisIco,GiriOrbit.AppIcon" `
        "/resource:$logoPng,GiriOrbit.OriginalLogo" `
        /out:$axisOut $srcApp $srcAssemblyInfo

    # 4. Dedicated Giri Kinetic Binary (Cinematic Presentation Show)
    $kineticOut = Join-Path $targetDir "GiriKinetic.exe"
    Write-Host "  -> Compiling dedicated GiriKinetic.exe with custom Kinetic icon..."
    & $compiler @commonArgs "/win32icon:$kineticIco" `
        "/resource:$kineticIco,GiriOrbit.AppIcon" `
        "/resource:$logoPng,GiriOrbit.OriginalLogo" `
        /out:$kineticOut $srcApp $srcAssemblyInfo

    # 5. Uninstallation Wizard
    $uninstOut = Join-Path $targetDir "Uninstall.exe"
    Write-Host "  -> Compiling Uninstall.exe..."
    & $compiler @commonArgs "/win32icon:$iconPath" `
        "/resource:$iconPath,GiriOrbit.AppIcon" `
        "/resource:$logoPng,GiriOrbit.OriginalLogo" `
        /out:$uninstOut $srcUninstaller $srcAssemblyInfo

    # Sign All Standalone Executables if certificate exists
    if ($cert) {
        Write-Host "  -> Digitally signing compiled executables with Authenticode certificate..."
        Set-AuthenticodeSignature -Certificate $cert -FilePath $appOut | Out-Null
        Set-AuthenticodeSignature -Certificate $cert -FilePath $driftOut | Out-Null
        Set-AuthenticodeSignature -Certificate $cert -FilePath $axisOut | Out-Null
        Set-AuthenticodeSignature -Certificate $cert -FilePath $kineticOut | Out-Null
        Set-AuthenticodeSignature -Certificate $cert -FilePath $uninstOut | Out-Null
    }

    # Compress the binaries into a zip archive to embed into Setup Wizard
    # This prevents heuristic dropper triggers in Antivirus software
    $binariesZip = Join-Path $targetDir "binaries.zip"
    if (Test-Path $binariesZip) { Remove-Item $binariesZip -Force }
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zipArch = [System.IO.Compression.ZipFile]::Open($binariesZip, [System.IO.Compression.ZipArchiveMode]::Create)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArch, $appOut, "GiriOrbit.exe") | Out-Null
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArch, $driftOut, "GiriDrift.exe") | Out-Null
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArch, $axisOut, "GiriAxis.exe") | Out-Null
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArch, $kineticOut, "GiriKinetic.exe") | Out-Null
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArch, $uninstOut, "Uninstall.exe") | Out-Null
    $zipArch.Dispose()
    Write-Host "  -> Packaged binaries archive: $binariesZip ($((Get-Item $binariesZip).Length) bytes)"

    # 6. Installation Setup Wizard (Self-Contained Standalone with Compressed Payload)
    $setupName = "GiriOrbit-Setup-$archName.exe"
    $setupOut = Join-Path $targetDir $setupName
    Write-Host "  -> Compiling $setupName (Self-Contained Standalone Installer with Original Logo)..."
    & $compiler @commonArgs "/win32icon:$iconPath" `
        /r:System.IO.Compression.dll /r:System.IO.Compression.FileSystem.dll `
        "/resource:$binariesZip,GiriOrbit.BinariesPayload" `
        "/resource:$appOut,GiriOrbit.AppBinary" `
        "/resource:$driftOut,GiriOrbit.DriftBinary" `
        "/resource:$axisOut,GiriOrbit.AxisBinary" `
        "/resource:$kineticOut,GiriOrbit.KineticBinary" `
        "/resource:$uninstOut,GiriOrbit.UninstallerBinary" `
        "/resource:$assetsZip,GiriOrbit.AssetsBundle" `
        "/resource:$logoPng,GiriOrbit.OriginalLogo" `
        "/resource:$iconPath,GiriOrbit.AppIcon" `
        "/resource:$driftIco,GiriOrbit.DriftIcon" `
        "/resource:$axisIco,GiriOrbit.AxisIcon" `
        "/resource:$kineticIco,GiriOrbit.KineticIcon" `
        /out:$setupOut $srcInstaller $srcAssemblyInfo

    # Sign the Setup Wizard
    if ($cert) {
        Write-Host "  -> Digitally signing $setupName with Authenticode certificate..."
        Set-AuthenticodeSignature -Certificate $cert -FilePath $setupOut | Out-Null
    }

    # Copy Setup Executable to main website downloads corner
    $webSetupTarget = Join-Path $downloadsDir $setupName
    Copy-Item $setupOut $webSetupTarget -Force
    Write-Host "  [OK] Exported setup: $webSetupTarget ($((Get-Item $webSetupTarget).Length) bytes)" -ForegroundColor Green

    # Build safe ZIP package for download (Setup.exe + Unblock_And_Install.bat + README_INSTALL.txt + .cer)
    $setupZipName = "GiriOrbit-Setup-$archName.zip"
    $setupZipTarget = Join-Path $downloadsDir $setupZipName
    if (Test-Path $setupZipTarget) { Remove-Item $setupZipTarget -Force }
    $pkgZip = [System.IO.Compression.ZipFile]::Open($setupZipTarget, [System.IO.Compression.ZipArchiveMode]::Create)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($pkgZip, $setupOut, $setupName) | Out-Null
    $batchPath = Join-Path $downloadsDir "Unblock_And_Install.bat"
    if (Test-Path $batchPath) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($pkgZip, $batchPath, "Unblock_And_Install.bat") | Out-Null
    }
    $readmePath = Join-Path $downloadsDir "README_INSTALL.txt"
    if (Test-Path $readmePath) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($pkgZip, $readmePath, "README_INSTALL.txt") | Out-Null
    }
    if (Test-Path $pubCerPath) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($pkgZip, $pubCerPath, "AbhinavGiri_CodeSigning.cer") | Out-Null
    }
    $pkgZip.Dispose()
    Write-Host "  [OK] Exported safe ZIP package: $setupZipTarget ($((Get-Item $setupZipTarget).Length) bytes)" -ForegroundColor Green
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "   GIRI ORBIT WINDOWS BUILDS COMPLETED SUCCESSFULLY!      " -ForegroundColor Green
Write-Host "   Made by Abhinav Giri (github.com/abhinavgiri45)        " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
