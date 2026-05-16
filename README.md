# 抖音下载器

从抖音分享链接解析并下载无水印视频和图片的 Android 应用 + Web 版。

[![Build APK](https://github.com/zhengyang1994/douyin-downloader/actions/workflows/build-apk.yml/badge.svg)](https://github.com/zhengyang1994/douyin-downloader/actions/workflows/build-apk.yml)

## 功能

- **视频解析** — 粘贴抖音分享链接，解析出多分辨率无水印视频
- **图片解析** — 支持抖音图集，可单张或批量下载
- **剪贴板识别** — Android 端自动读取剪贴板，粘贴链接一键完成
- **多分辨率** — 自动解析多种分辨率（高清/标清）供选择
- **深色主题** — 抖音风格霓虹暗色 UI
- **分享唤起** — 支持从抖音 App 分享链接直接唤起本应用
- **Web 版本** — 也可通过浏览器直接使用（`standalone.html` + `server.cjs`）

## 下载 APK

### 方式一：GitHub Actions（推荐）

项目已配置自动构建，每次推送代码后自动生成 APK。

1. 打开 [Actions 页面](https://github.com/zhengyang1994/douyin-downloader/actions)
2. 点击最新的 `Build APK` 工作流运行记录
3. 在 **Artifacts** 区域下载 `app-debug`（ZIP 包）
4. 解压后得到 `app-debug.apk`，安装到 Android 手机即可

### 方式二：本地构建

参考 [android/BUILD_GUIDE.md](android/BUILD_GUIDE.md) 在本地使用 Android Studio 或 Gradle 构建。

## 快速开始（Web 版）

无需 Android 设备，可直接在浏览器中使用：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或直接打开 standalone.html（纯静态版）
```

## 项目结构

```
├── src/                    # Web 前端（Vue + Tailwind）
│   ├── components/         # 视频/图片展示组件
│   └── utils/              # 工具函数（API 请求、文件名清理等）
├── api/                    # 后端代理服务（Express）
│   ├── routes/proxy.ts     # 下载代理（解决跨域）
│   └── services/douyin.ts  # 抖音页面数据解析
├── android/                # Android 原生壳（WebView + DownloadManager）
│   └── app/src/main/java/com/douyin/downloader/
│       ├── MainActivity.kt     # 主 Activity（WebView、下载管理）
│       └── WebAppInterface.kt  # JS 桥接（剪贴板、下载、网络请求）
├── shared/                 # 前后端共享类型定义
├── standalone.html         # 纯静态 Web 版（单文件）
├── server.cjs              # 简易后端服务器
└── .github/workflows/      # GitHub Actions 自动构建配置
```

## 技术栈

| 层 | 技术 |
|---|---|
| Android 壳 | Kotlin + WebView + DownloadManager |
| 前端 UI | Vue 3 + Tailwind CSS + TypeScript |
| 后端代理 | Express + axios（Node.js） |
| 数据解析 | 纯 JS 解析抖音页面水印数据 |
| 构建 | Gradle 8.5 + AGP 8.2.2 |

## 权限说明

| 权限 | 用途 |
|---|---|
| INTERNET | 网络请求和数据下载 |
| ACCESS_NETWORK_STATE | 检查网络连接状态 |
| WRITE_EXTERNAL_STORAGE (Android 9 及以下) | 保存下载文件 |
| READ_EXTERNAL_STORAGE (Android 10-12) | 读取已下载文件 |

## 常见问题

### 下载提示 "File name too long"？
已修复。新版本会自动清理文件名中的非法字符并截断到合理长度（80 字符以内）。

### 解析失败？
抖音页面结构可能随版本更新变化，如遇到解析失败请提 Issue。

### 视频有水印？
解析引擎会自动提取无水印视频地址（`aweme/v1/play/`），如仍带回有水印地址可切换分辨率尝试。

## 免责声明

本应用仅供学习和个人使用，请勿用于商业用途。请尊重抖音用户及平台的知识产权。
