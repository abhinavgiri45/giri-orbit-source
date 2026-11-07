# Giri Orbit Android APK Automated Build Script
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sdkDir = "C:\Users\abhin\AppData\Local\Android\Sdk"
$jdkDir = "C:\Users\abhin\AppData\Local\Programs\jdk-17"
$androidJar = Join-Path $sdkDir "platforms\android-34\android.jar"
$buildTools = Join-Path $sdkDir "build-tools\34.0.0"

$aapt2 = Join-Path $buildTools "aapt2.exe"
$d8 = Join-Path $buildTools "d8.bat"
$zipalign = Join-Path $buildTools "zipalign.exe"
$apksigner = Join-Path $buildTools "apksigner.bat"
$javac = Join-Path $jdkDir "bin\javac.exe"
$keytool = Join-Path $jdkDir "bin\keytool.exe"

$env:JAVA_HOME = $jdkDir
$env:Path = "$jdkDir\bin;$env:Path"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Giri Orbit - Dedicated Android APK Builder" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$buildDir = Join-Path $scriptDir "build\intermediates"
$distDir = Join-Path $scriptDir "dist"
$keystoreDir = Join-Path $scriptDir "keystore"

if (Test-Path $buildDir) { Remove-Item -Recurse -Force $buildDir }
New-Item -ItemType Directory -Force -Path $buildDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $buildDir "classes") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $buildDir "dex") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $buildDir "gen") | Out-Null
New-Item -ItemType Directory -Force -Path $distDir | Out-Null
New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null

# 1. Compile Resources
Write-Host "[1/6] Compiling Android resources with AAPT2..." -ForegroundColor Yellow
$resDir = Join-Path $scriptDir "app\src\main\res"
$compiledResZip = Join-Path $buildDir "compiled_res.zip"
& $aapt2 compile --dir $resDir -o $compiledResZip
if ($LASTEXITCODE -ne 0) { throw "AAPT2 compile failed" }

# 2. Link Resources & Generate R.java
Write-Host "[2/6] Linking resources and AndroidManifest with AAPT2..." -ForegroundColor Yellow
$manifest = Join-Path $scriptDir "app\src\main\AndroidManifest.xml"
$baseApk = Join-Path $buildDir "base.apk"
$genDir = Join-Path $buildDir "gen"
& $aapt2 link -I $androidJar --manifest $manifest $compiledResZip -o $baseApk --java $genDir --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "AAPT2 link failed" }

# 3. Compile Java Sources
Write-Host "[3/6] Compiling Java sources with OpenJDK 17..." -ForegroundColor Yellow
$javaFiles = Get-ChildItem -Path (Join-Path $scriptDir "app\src\main\java"), $genDir -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName
$classesDir = Join-Path $buildDir "classes"
& $javac -encoding UTF-8 -cp $androidJar -d $classesDir $javaFiles
if ($LASTEXITCODE -ne 0) { throw "Java compilation failed" }

# 4. Generate DEX Bytecode with D8
Write-Host "[4/6] Generating classes.dex with D8..." -ForegroundColor Yellow
$classFiles = Get-ChildItem -Path $classesDir -Filter "*.class" -Recurse | Select-Object -ExpandProperty FullName
$dexDir = Join-Path $buildDir "dex"
& $d8 $classFiles --lib $androidJar --output $dexDir --min-api 24
if ($LASTEXITCODE -ne 0) { throw "D8 dex compilation failed" }

# 5. Package APK with DEX and Assets
Write-Host "[5/6] Packaging APK with classes.dex and offline web assets..." -ForegroundColor Yellow
$unalignedApk = Join-Path $buildDir "unaligned.apk"
Copy-Item $baseApk $unalignedApk -Force

# Use Python script to package zip safely
$packScript = @"
import zipfile
import os

apk_path = r"$unalignedApk"
dex_file = r"$dexDir\classes.dex"
assets_dir = r"$scriptDir\app\src\main\assets"

with zipfile.ZipFile(apk_path, 'a', compression=zipfile.ZIP_DEFLATED) as z:
    if os.path.exists(dex_file):
        z.write(dex_file, "classes.dex")
    for root, dirs, files in os.walk(assets_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, assets_dir)
            archive_name = os.path.join("assets", rel_path).replace("\\", "/")
            z.write(full_path, archive_name)
print("Packaging complete.")
"@
$packScriptFile = Join-Path $buildDir "pack.py"
[System.IO.File]::WriteAllText($packScriptFile, $packScript)
python.exe $packScriptFile
if ($LASTEXITCODE -ne 0) { throw "Asset packaging failed" }

# 6. Align and Sign APK
Write-Host "[6/6] Zipaligning and signing APK with apksigner..." -ForegroundColor Yellow
$alignedApk = Join-Path $buildDir "aligned.apk"
& $zipalign -f -p 4 $unalignedApk $alignedApk
if ($LASTEXITCODE -ne 0) { throw "Zipalign failed" }

$keystoreFile = Join-Path $keystoreDir "debug.keystore"
if (!(Test-Path $keystoreFile)) {
    Write-Host "Creating signing keystore..." -ForegroundColor Cyan
    & $keytool -genkeypair -v -keystore $keystoreFile -alias giriorbit -keyalg RSA -keysize 2048 -validity 10000 -storepass giriorbit -keypass giriorbit -dname "CN=Giri Orbit, O=Giri Corporation, C=IN"
}

$finalApk = Join-Path $distDir "GiriOrbit.apk"
& $apksigner sign --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --ks $keystoreFile --ks-pass pass:giriorbit --key-pass pass:giriorbit --out $finalApk $alignedApk
if ($LASTEXITCODE -ne 0) { throw "APK signing failed" }

Write-Host "Verifying APK signatures..." -ForegroundColor Cyan
& $apksigner verify --verbose $finalApk

$apkItem = Get-Item $finalApk
Write-Host "`nSUCCESS! Built dedicated Android APK:" -ForegroundColor Green
Write-Host "  Path: $($apkItem.FullName)" -ForegroundColor Green
Write-Host "  Size: $([math]::Round($apkItem.Length / 1MB, 2)) MB ($($apkItem.Length) bytes)" -ForegroundColor Green

# Copy to website downloads directory
$webDownloads = "c:\Users\abhin\OneDrive\Desktop\Giri Orbit\downloads"
if (Test-Path $webDownloads) {
    Copy-Item $finalApk (Join-Path $webDownloads "GiriOrbit.apk") -Force
    Write-Host "  Copied to website downloads: $webDownloads\GiriOrbit.apk" -ForegroundColor Green
}
