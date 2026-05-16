# 抖音下载器

从抖音分享链接解析并下载视频和图片的 Android 应用。

## ✨ 功能

- 📺 解析抖音视频，支持多分辨率下载
- 🖼️ 解析抖音图集，支持单张和批量下载
- 📋 一键从剪贴板粘贴链接
- 🎨 深色主题，抖音风格霓虹配色
- 📥 使用 Android 系统下载管理器，支持后台下载
- 🔗 支持从抖音 App 分享链接直接唤起

## 🚀 获取 APK

### 方法一：GitHub Actions 自动构建（推荐）

1. 点击右上角 "Use this template" 或 "Fork" 此仓库
2. 进入你的 Fork 仓库
3. 点击顶部的 "Actions" 标签
4. 选择左侧的 "Build APK" 工作流
5. 点击右侧的 "Run workflow" → 选择分支 → 点击 "Run workflow"
6. 等待构建完成（约 5-10 分钟）
7. 完成后点击该次运行记录
8. 在 "Artifacts" 区域下载 `app-debug`

### 方法二：本地构建

请参考 `android/BUILD_GUIDE.md` 文档。

## 📝 截图

[待添加]

## 📱 安装

下载 APK 后，在 Android 手机上打开，允许安装未知来源应用，点击安装即可。

## 📖 技术架构

- **前端 UI**: 原生 WebView + HTML/CSS/JS
- **解析引擎**: 纯 JavaScript，通过 WebView 请求抖音页面
- **下载管理**: Android DownloadManager
- **构建**: Gradle 8.5 + AGP 8.2.2

## 🔐 权限说明

| 权限 | 用途 |
|------|------|
| INTERNET | 下载网络资源 |
| ACCESS_NETWORK_STATE | 检查网络状态 |
| WRITE_EXTERNAL_STORAGE (Android 9-) | 保存文件 |
| READ_EXTERNAL_STORAGE (Android 10-12) | 读取文件 |

## ⚠️ 免责声明

本应用仅供学习和个人使用，请勿用于商业用途。请尊重抖音用户的知识产权。