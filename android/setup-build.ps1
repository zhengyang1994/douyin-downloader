# 抖音下载器 - 环境检查与配置脚本
# 保存为 setup-build.ps1，右键"使用 PowerShell 运行"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "抖音下载器 APK 构建环境检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --------------------------------------------------------
# 1. 查找 Java
# --------------------------------------------------------
Write-Host "[1/5] 查找 JDK..." -ForegroundColor Yellow

$javaPaths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Eclipse Adoptium\jdk-17.0.10-hotspot",
    "C:\Program Files\Eclipse Adoptium\jdk-21.0.2-hotspot",
    "C:\Program Files\Microsoft\jdk-17",
    "C:\Program Files\Microsoft\jdk-21"
)

$foundJava = $false
$javaHome = ""

foreach ($path in $javaPaths) {
    if (Test-Path $path) {
        Write-Host "✓ 找到 JDK 目录: $path" -ForegroundColor Green
        $javaHome = $path
        $foundJava = $true
        break
    }
}

if (-not $foundJava) {
    Write-Host "✗ 未找到 JDK" -ForegroundColor Red
    Write-Host ""
    Write-Host "请安装 JDK 17 或更高版本：" -ForegroundColor Yellow
    Write-Host "  - 下载地址: https://adoptium.net/temurin/releases/" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# --------------------------------------------------------
# 2. 查找 Android SDK
# --------------------------------------------------------
Write-Host "[2/5] 查找 Android SDK..." -ForegroundColor Yellow

$sdkPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:APPDATA\..\Local\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk"
)

$foundSdk = $false
$sdkDir = ""

foreach ($path in $sdkPaths) {
    $expanded = [System.Environment]::ExpandEnvironmentVariables($path)
    if (Test-Path $expanded) {
        Write-Host "✓ 找到 Android SDK: $expanded" -ForegroundColor Green
        $sdkDir = $expanded
        $foundSdk = $true
        break
    }
}

if (-not $foundSdk) {
    Write-Host "✗ 未找到 Android SDK" -ForegroundColor Red
    Write-Host ""
    Write-Host "请安装 Android Studio 或 Android SDK：" -ForegroundColor Yellow
    Write-Host "  - 下载地址: https://developer.android.com/studio" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# --------------------------------------------------------
# 3. 创建 local.properties
# --------------------------------------------------------
Write-Host "[3/5] 创建 local.properties..." -ForegroundColor Yellow

$localProps = Join-Path -Path $PSScriptRoot -ChildPath "local.properties"
$escapedSdkDir = $sdkDir.Replace("\", "\\")
Set-Content -Path $localProps -Value "sdk.dir=$escapedSdkDir"

Write-Host "✓ 已创建: $localProps" -ForegroundColor Green

# --------------------------------------------------------
# 4. 检查 Gradle Wrapper
# --------------------------------------------------------
Write-Host "[4/5] 检查 Gradle Wrapper..." -ForegroundColor Yellow

$wrapperJar = Join-Path -Path $PSScriptRoot -ChildPath "gradle\wrapper\gradle-wrapper.jar"

if (Test-Path $wrapperJar) {
    Write-Host "✓ Gradle Wrapper 已就绪" -ForegroundColor Green
} else {
    Write-Host "✗ Gradle Wrapper JAR 未找到" -ForegroundColor Red
    Write-Host ""
    Write-Host "需要下载 Gradle Wrapper JAR 到: $wrapperJar" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "下载链接（浏览器打开）：" -ForegroundColor Gray
    Write-Host "  https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# --------------------------------------------------------
# 5. 准备构建
# --------------------------------------------------------
Write-Host "[5/5] 准备构建..." -ForegroundColor Yellow

$env:JAVA_HOME = $javaHome
Write-Host "✓ 临时设置 JAVA_HOME = $javaHome" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "环境检查完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "现在运行以下命令开始构建 APK：" -ForegroundColor Yellow
Write-Host ""
Write-Host "  cd $PSScriptRoot" -ForegroundColor Cyan
Write-Host "  .\gradlew.bat assembleDebug" -ForegroundColor Cyan
Write-Host ""
Write-Host "APK 输出位置：" -ForegroundColor Gray
Write-Host "  $PSScriptRoot\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Gray
Write-Host ""