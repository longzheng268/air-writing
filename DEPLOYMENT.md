# Cloudflare Pages 部署指南 / Deployment Guide

## 一键部署方法 / One-Click Deployment Methods

### 方法 1: GitHub 集成自动部署（推荐）/ Method 1: GitHub Integration (Recommended)

这是最简单的部署方式，无需命令行操作。
This is the easiest deployment method without command line operations.

#### 步骤 / Steps:

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 登录你的账号

2. **创建 Pages 项目 / Create Pages Project**
   - 点击左侧菜单的 "Workers & Pages"
   - 点击 "Create application" 按钮
   - 选择 "Pages" 标签页
   - 点击 "Connect to Git"

3. **连接 GitHub 仓库 / Connect GitHub Repository**
   - 选择 "GitHub"
   - 授权 Cloudflare 访问你的 GitHub 账号
   - 选择 `longzheng268/air-writing` 仓库
   - 点击 "Begin setup"

4. **配置构建设置 / Configure Build Settings**
   ```
   Project name: air-writing (或自定义名称)
   Production branch: main (或你的主分支)
   Framework preset: None
   Build command: (留空 / leave empty)
   Build output directory: /
   Root directory (advanced): /
   ```

5. **保存并部署 / Save and Deploy**
   - 点击 "Save and Deploy"
   - 等待部署完成（约 30-60 秒）
   - 你会获得一个 `*.pages.dev` 域名

6. **自动重新部署 / Automatic Redeployment**
   - 每次推送代码到主分支，Cloudflare 会自动重新部署
   - Pull Request 会创建预览部署

### 方法 2: Wrangler CLI 命令行部署 / Method 2: Wrangler CLI

适合需要频繁部署或本地测试的开发者。
Suitable for developers who need frequent deployments or local testing.

#### 步骤 / Steps:

1. **安装 Wrangler（如果还没安装）/ Install Wrangler (if not installed)**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare / Login to Cloudflare**
   ```bash
   wrangler login
   ```
   这会打开浏览器进行授权。
   This will open a browser for authorization.

3. **一键部署 / One-Click Deploy**
   ```bash
   npm run deploy
   ```
   或直接使用 / Or use directly:
   ```bash
   wrangler pages deploy . --project-name=air-writing
   ```

4. **首次部署 / First Deployment**
   - Wrangler 会提示创建新项目
   - 确认项目名称
   - 等待部署完成

5. **后续部署 / Subsequent Deployments**
   - 直接运行 `npm run deploy` 即可
   - 支持生产环境和预览环境部署

## 部署验证 / Deployment Verification

部署成功后，访问提供的 URL，检查以下功能：
After successful deployment, visit the provided URL and check:

1. ✅ 页面正常加载 / Page loads correctly
2. ✅ 摄像头权限请求正常 / Camera permission request works
3. ✅ 手势识别正常工作 / Gesture recognition works
4. ✅ 绘图功能正常 / Drawing functionality works
5. ✅ 所有静态资源加载成功 / All static assets load successfully

## 自定义域名 / Custom Domain

1. 在 Cloudflare Pages 项目设置中
   In Cloudflare Pages project settings
2. 点击 "Custom domains"
3. 添加你的域名 / Add your domain
4. 配置 DNS（通常是 CNAME 记录）/ Configure DNS (usually CNAME record)

## 故障排除 / Troubleshooting

### 部署失败 / Deployment Fails

1. **检查构建设置 / Check Build Settings**
   - Build command 必须为空 / must be empty
   - Build output directory 必须是 `/` / must be `/`
   
2. **检查文件完整性 / Check File Integrity**
   ```bash
   git status
   git push origin main
   ```

3. **查看构建日志 / Check Build Logs**
   - 在 Cloudflare Dashboard 中查看详细错误信息
   - View detailed error messages in Cloudflare Dashboard

### 摄像头不工作 / Camera Not Working

- Cloudflare Pages 自动提供 HTTPS
- 确保允许了摄像头权限
- Ensure camera permission is granted

### 资源加载失败 / Resource Loading Fails

- 检查 `_headers` 文件是否正确部署
- Check if `_headers` file is correctly deployed
- 查看浏览器控制台的网络错误
- Check browser console for network errors

## 部署配置说明 / Deployment Configuration

### wrangler.toml
```toml
name = "air-writing"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."
```

### _headers
自动配置以下头部：
Automatically configures the following headers:
- 安全头部（X-Frame-Options, X-Content-Type-Options 等）
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- 缓存控制（静态资源长期缓存）
- Cache control (long-term caching for static assets)
- 权限策略（允许摄像头访问）
- Permissions policy (allow camera access)

## 性能优化 / Performance Optimization

已自动配置：
Automatically configured:

1. ✅ 静态资源缓存（1 年）/ Static asset caching (1 year)
2. ✅ HTML 动态缓存 / Dynamic HTML caching
3. ✅ CDN 边缘分发 / CDN edge distribution
4. ✅ HTTP/2 和 HTTP/3 支持 / HTTP/2 and HTTP/3 support
5. ✅ 自动压缩（gzip, brotli）/ Automatic compression (gzip, brotli)

## 环境变量 / Environment Variables

此项目不需要环境变量，所有配置都在代码中。
This project doesn't need environment variables, all configurations are in the code.

## 监控和分析 / Monitoring and Analytics

在 Cloudflare Dashboard 中可以查看：
View in Cloudflare Dashboard:

- 访问量统计 / Traffic statistics
- 带宽使用 / Bandwidth usage
- 请求错误率 / Request error rate
- 地理分布 / Geographic distribution

## 技术支持 / Technical Support

- Cloudflare Pages 文档: https://developers.cloudflare.com/pages/
- Wrangler 文档: https://developers.cloudflare.com/workers/wrangler/
- GitHub Issues: https://github.com/longzheng268/air-writing/issues

---

**注意 / Note**: 
- 此项目是纯静态网站，不需要服务器端渲染或 API
- This is a pure static website, no server-side rendering or API needed
- 首次部署后，每次推送代码都会自动重新部署
- After first deployment, every code push triggers automatic redeployment
