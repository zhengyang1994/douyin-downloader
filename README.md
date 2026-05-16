# 抖音下载器

从抖音分享链接解析并下载视频和图片的 Android 应用。

[![Build APK](https://github.com/zhengyang1994/douyin-downloader/actions/workflows/build-apk.yml/badge.svg)](https://github.com/zhengyang1994/douyin-downloader/actions/workflows/build-apk.yml)

## 功能

- 解析抖音视频，支持多分辨率下载
- 解析抖音图集，支持单张和批量下载
- 一键从剪贴板粘贴链接
- 深色主题，抖音风格霓虹配色
- 使用 Android 系统下载管理器，支持后台下载
- 支持从抖音 App 分享链接直接唤起

## 下载 APK

有两种方式获取 APK：

### 方式一：GitHub Actions 自动构建（推荐）

1. 打开 [Actions 页面](https://github.com/zhengyang1994/douyin-downloader/actions)
2. 点击最新的成功构建记录
3. 在 **Artifacts** 区域下载 `app-debug`
4. 解压后得到 `app-debug.apk`

### 方式二：本地构建

参考 [android/BUILD_GUIDE.md](android/BUILD_GUIDE.md) 进行本地构建。

## 技术架构

- **前端 UI**: 原生 WebView + HTML/CSS/JS，使用 Android `HttpURLConnection` 进行原生网络请求
- **解析引擎**: 纯 JavaScript，解析抖音页面数据
- **下载管理**: Android DownloadManager
- **构建**: Gradle 8.5 + AGP 8.2.2

## 权限说明

| 权限 | 用途 |
|------|------|
| INTERNET | 下载网络资源 |
| ACCESS_NETWORK_STATE | 检查网络状态 |
| WRITE_EXTERNAL_STORAGE (Android 9-) | 保存文件 |
| READ_EXTERNAL_STORAGE (Android 10-12) | 读取文件 |

## 免责声明

本应用仅供学习和个人使用，请勿用于商业用途。请尊重抖音用户的知识产权。
