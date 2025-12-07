# Cloudflare Pages 部署指南 / Deployment Guide

[中文](#中文) | [English](#english)

---

## 中文

### 部署前准备

**验证部署准备情况（可选）:**
```bash
npm run verify
```

此命令会检查所有必需的文件是否存在，确保项目可以正常部署。

### 问题诊断

如果您遇到以下问题：

**问题 1: 部署后显示 "Hello World"**
- **原因**: Build output directory 设置不正确
- **解决方案**: 按照下方配置步骤操作

**问题 2: 使用 `npm run dev` 后部署卡住**
- **原因**: `npm run dev` 启动开发服务器不会退出
- **解决方案**: 不要使用 `npm run dev` 作为构建命令

### 正确的 Cloudflare Pages 部署配置

#### 方法一：通过 Dashboard 部署（推荐）

1. **推送代码到 Git 仓库**
   ```bash
   git push origin main
   ```

2. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 进入 **Pages** 部分

3. **创建/编辑项目配置**
   - 如果是新项目：点击 **Create a project** → **Connect to Git**
   - 如果已存在：进入项目 → **Settings** → **Builds & deployments**

4. **关键配置（请严格按照以下设置）** ⚠️

   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: /
   Root directory: (留空)
   ```

   **重要说明：**
   - ✅ **Build command**: `npm run build` - 这会验证文件并成功退出
   - ✅ **Build output directory**: `/` - 必须是斜杠，表示根目录
   - ❌ **不要使用**: `npm run dev` （这会导致部署卡住）
   - ❌ **不要使用**: `.` 作为 Build output directory（可能导致文件找不到）

5. **保存并部署**
   - 点击 **Save and Deploy**
   - 等待部署完成（1-2 分钟）

#### 方法二：使用 Wrangler CLI 部署

```bash
# 确保已安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 部署（从项目根目录运行）
npm run deploy
# 或者
wrangler pages deploy . --project-name=air-writing
```

### 验证部署

部署成功后，您应该能看到：
- ✅ 完整的隔空书写应用界面
- ✅ 摄像头权限请求
- ✅ 手势识别功能正常工作

如果仍然看到 "Hello World"：
1. 检查 Build output directory 是否设置为 `/`
2. 检查项目根目录是否包含 `index.html`
3. 查看 Cloudflare Pages 构建日志中的错误信息

### 项目结构说明

```
air-writing/
├── index.html          ← 必须在根目录
├── assets/             ← 资源文件
├── package.json        ← 包含 build 脚本
├── wrangler.toml       ← CLI 部署配置
└── _headers            ← Cloudflare Pages 头部配置
```

### 为什么这样配置？

- **npm run build**: 虽然这是静态站点不需要构建，但这个命令会验证文件存在并正常退出
- **Build output directory: /**: 告诉 Cloudflare Pages 直接使用根目录的文件
- **不用 npm run dev**: dev 命令启动 HTTP 服务器永不退出，会导致部署超时

---

## English

### Pre-deployment Preparation

**Verify deployment readiness (Optional):**
```bash
npm run verify
```

This command checks if all required files are present, ensuring the project can be deployed successfully.

### Problem Diagnosis

If you encounter these issues:

**Issue 1: "Hello World" appears after deployment**
- **Cause**: Incorrect Build output directory setting
- **Solution**: Follow the configuration steps below

**Issue 2: Deployment hangs when using `npm run dev`**
- **Cause**: `npm run dev` starts a dev server that never exits
- **Solution**: Don't use `npm run dev` as build command

### Correct Cloudflare Pages Deployment Configuration

#### Method 1: Deploy via Dashboard (Recommended)

1. **Push code to Git repository**
   ```bash
   git push origin main
   ```

2. **Log in to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com/
   - Go to **Pages** section

3. **Create/Edit project configuration**
   - For new project: Click **Create a project** → **Connect to Git**
   - For existing: Go to project → **Settings** → **Builds & deployments**

4. **Critical Configuration (Follow exactly)** ⚠️

   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: /
   Root directory: (leave empty)
   ```

   **Important Notes:**
   - ✅ **Build command**: `npm run build` - This validates files and exits successfully
   - ✅ **Build output directory**: `/` - Must be a forward slash, indicating root directory
   - ❌ **Don't use**: `npm run dev` (This causes deployment to hang)
   - ❌ **Don't use**: `.` as Build output directory (May cause files not found)

5. **Save and Deploy**
   - Click **Save and Deploy**
   - Wait for deployment to complete (1-2 minutes)

#### Method 2: Deploy using Wrangler CLI

```bash
# Make sure Wrangler is installed
npm install -g wrangler

# Login
wrangler login

# Deploy (run from project root)
npm run deploy
# or
wrangler pages deploy . --project-name=air-writing
```

### Verify Deployment

After successful deployment, you should see:
- ✅ Complete air-writing application interface
- ✅ Camera permission request
- ✅ Gesture recognition working properly

If you still see "Hello World":
1. Check if Build output directory is set to `/`
2. Verify `index.html` exists in project root
3. Review error messages in Cloudflare Pages build logs

### Project Structure

```
air-writing/
├── index.html          ← Must be in root
├── assets/             ← Asset files
├── package.json        ← Contains build script
├── wrangler.toml       ← CLI deployment config
└── _headers            ← Cloudflare Pages headers config
```

### Why This Configuration?

- **npm run build**: Although this is a static site requiring no build, this command validates files exist and exits normally
- **Build output directory: /**: Tells Cloudflare Pages to use files directly from root directory
- **Not npm run dev**: dev command starts HTTP server that never exits, causing deployment timeout

---

## 常见问题 / FAQ

### Q: 为什么不能用 `.` 作为 Build output directory？
### Q: Why can't I use `.` as Build output directory?

A: 在某些情况下，Cloudflare Pages 可能会将 `.` 解释为一个子目录而不是根目录。使用 `/` 更明确。

A: In some cases, Cloudflare Pages might interpret `.` as a subdirectory rather than root. Using `/` is more explicit.

### Q: 我必须使用 `npm run build` 吗？
### Q: Do I have to use `npm run build`?

A: 不一定。您也可以留空 Build command。但使用 `npm run build` 可以确保构建过程正常完成。

A: Not necessarily. You can also leave Build command empty. But using `npm run build` ensures the build process completes normally.

### Q: wrangler.toml 文件的作用是什么？
### Q: What is the purpose of wrangler.toml file?

A: 该文件仅用于 CLI 部署（`wrangler pages deploy`）。Dashboard 部署使用 Dashboard 中的配置。

A: This file is only used for CLI deployment (`wrangler pages deploy`). Dashboard deployment uses configuration from Dashboard.

---

## 技术支持 / Technical Support

如有问题，请提交 Issue：
For issues, please submit an Issue:

- GitHub: https://github.com/longzheng268/air-writing/issues
- Gitee: https://gitee.com/longzheng0315/air-writing/issues
