# 📚 完整推送指南（从 0 到 APK）

---

## 第 1 步：安装 Git

1. 下载 Git：https://git-scm.com/download/win
2. 双击安装包，一直点击"Next"用默认设置安装
3. 安装完成后，**重启 PowerShell** 或终端

---

## 第 2 步：在 GitHub 创建仓库

1. 打开 GitHub：https://github.com/
2. 登录您的账号
3. 点击右上角 **+** → **New repository**
4. 填写：
   - Repository name: `douyin-downloader`
   - Public/Private: 都可以
5. **不要**勾选任何选项（不要 README，不要 .gitignore，不要 License）
6. 点击 **Create repository**

---

## 第 3 步：准备推送

在您电脑上，打开文件夹 `d:\trae\`，然后在空白处按住 **Shift + 右键** → 选择"在终端打开"或"打开 PowerShell 窗口"。

在打开的终端里，逐个执行以下命令：

```powershell
# 1. 初始化 Git
git init

# 2. 配置您的用户信息（替换为您的名字和邮箱）
git config --global user.name "您的名字"
git config --global user.email "您的邮箱@example.com"

# 3. 添加所有文件
git add .

# 4. 提交（双引号不能少）
git commit -m "Initial commit of douyin downloader"

# 5. 关联 GitHub 仓库（重要：替换下面的 您的用户名）
git remote add origin https://github.com/您的用户名/douyin-downloader.git

# 6. 推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 第 4 步：推送时输入凭证

执行 `git push` 后，会弹出窗口要求登录 GitHub，或提示输入：
- **Username**: 您的 GitHub 用户名
- **Password**: 不能用密码了，需要用 **Personal Access Token**

### 如何获取 Personal Access Token：

1. 在 GitHub 点击您头像 → **Settings**
2. 左侧菜单拉到底 → **Developer settings**
3. 点击 **Personal access tokens** → **Tokens (classic)**
4. 点击 **Generate new token** → **Generate new token (classic)**
5. 填写：
   - Note: `douyin-downloader`
   - Expiration: 选 `No expiration` 或 `90 days`
   - 勾选 **repo** 权限（第一个大项）
6. 拉到底点击 **Generate token**
7. **复制** 生成的 token（只显示一次，要保存好）
8. 回到终端，当提示 Password 时，粘贴刚才复制的 token

---

## 第 5 步：GitHub Actions 自动构建 APK

推送成功后，回到您的 GitHub 仓库页面：

1. 点击顶部的 **Actions** 标签
2. 左侧选择 **Build APK**
3. 右侧点击 **Run workflow** → 选择 `main` 分支 → 点击 **Run workflow**
4. 等待 **5-10 分钟**
5. 完成后，点击该次运行（绿色 ✅）
6. 向下滚动到 **Artifacts** 区域
7. 点击 **app-debug**，下载 ZIP 解压就是 APK！

---

## ❓ 常见问题

### Q: 提示找不到 git 命令？
安装 Git 后需要重启 PowerShell。

### Q: 推送失败？
- 检查仓库名和用户名是否正确
- 检查 Token 是否有 repo 权限
- 检查 Token 是否过期

### Q: GitHub Actions 显示灰色无法运行？
可能是首次使用，需要点击 Actions 标签，然后点击 "I understand my workflows" 确认。

---

**跟着上面一步步做，10 分钟内您就能拿到 APK 了！** 💪