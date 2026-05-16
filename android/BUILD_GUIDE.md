# 抖音下载器 - APK 构建指南

## 前置要求

- **JDK 17** 或更高版本（必需）
- **Android SDK**（必需，包含 `android-34` 平台和 `build-tools 34.0.0`）
- **Gradle 8.5**（通过 Wrapper 自动下载）

## 检查环境

打开 PowerShell，运行：

```powershell
# 检查 Java
java -version

# 检查常见的 JDK 位置
Test-Path "C:\Program Files\Java\jdk-17"
Test-Path "C:\Program Files\Eclipse Adoptium\jdk-17.0.10-hotspot"

# 检查 Android SDK
Test-Path "$env:LOCALAPPDATA\Android\Sdk"
Test-Path "$env:APPDATA\..\Local\Android\Sdk"
```

如果已安装 Java 和 SDK，请继续。

---

## 步骤 1：配置 `local.properties`

在 `d:\trae\android\` 目录下创建 `local.properties` 文件：

```properties
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
# 如果使用 Android Studio，通常路径如上
# 或：
# sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

## 步骤 2：设置 JAVA_HOME

打开 PowerShell，临时设置（当前窗口有效）：

```powershell
# 方法 1：如果你知道 JDK 路径
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"  # 替换为实际路径
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

或者永久设置（需要重启 PowerShell）：

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "User")
```

## 步骤 3：初始化 Gradle Wrapper（如缺少）

项目已包含 `gradle-wrapper.properties` 和脚本，但可能缺少 `gradle-wrapper.jar`。如果你有 Android Studio：

```powershell
cd d:\trae\android
# 如果你电脑有安装 gradle
gradle wrapper --gradle-version 8.5
```

**或者**，下载 Gradle Wrapper JAR：

访问 https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar

保存到：

```
d:\trae\android\gradle\wrapper\gradle-wrapper.jar
```

## 步骤 4：构建 APK

```powershell
cd d:\trae\android

# 构建 Debug APK（用于测试）
.\gradlew.bat assembleDebug

# 如果 Gradle 首次运行，会下载约 200MB 的依赖
# 首次构建可能需要 10-15 分钟，取决于网络
```

构建成功后，APK 输出位置：

```
d:\trae\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 替代方案：使用 Android Studio（推荐）

1. 安装 [Android Studio](https://developer.android.com/studio)
2. 打开 Android Studio，选择 `File → Open`
3. 选择目录：`d:\trae\android`
4. 等待 Gradle 同步完成（首次会下载所有依赖）
5. 点击 `Build → Build Bundle(s) / APK(s) → Build APK(s)`
6. 等待构建完成后，右下角会弹出提示，点击 `locate` 即可找到 APK

---

## 常见问题

### Q: 提示 `gradle-wrapper.jar` 不存在？
下载 Gradle Wrapper JAR 到：

```
https://services.gradle.org/distributions/gradle-8.5-bin.zip
# 解压后：
# 取其中的 lib/gradle-wrapper.jar 放入 d:\trae\android\gradle\wrapper\
```

### Q: `sdk.dir` 找不到？
打开 Android Studio → `Tools → SDK Manager` → 顶部会显示 Android SDK Location

### Q: 构建超时？
配置 Gradle 代理或使用国内镜像（在 `gradle.properties` 添加）：

```properties
systemProp.https.proxyHost=你的代理地址
systemProp.https.proxyPort=你的代理端口
```

或使用阿里云镜像：

编辑 `settings.gradle.kts`，将 `google()` 和 `mavenCentral()` 替换为：

```kotlin
maven { url = uri("https://maven.aliyun.com/repository/google") }
maven { url = uri("https://maven.aliyun.com/repository/central") }
maven { url = uri("https://maven.aliyun.com/repository/public") }
```

---

## 验证 APK 功能

1. 把 APK 发送到 Android 手机
2. 手机上安装（注意开启"允许安装未知来源应用"）
3. 打开 App，粘贴一个抖音分享链接
4. 点击解析，选择分辨率/图片，点击下载

---

**完成！** 🎉