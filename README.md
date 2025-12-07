# 隔空书写 - Air Writing

[English](#english) | [中文](#chinese)

---

<a name="chinese"></a>

## 📖 项目简介

一个基于手势识别的隔空书写Web应用，使用 MediaPipe Hands 技术实现实时手部追踪和绘图功能。用户可以通过摄像头捕捉手部动作，在空中书写和绘画。

## ✨ 特性

- 🖐️ **实时手势识别** - 使用 MediaPipe Hands 进行精准的手部追踪
- ✍️ **隔空书写** - 通过捏合手势在空中书写和绘画
- 🎨 **自定义画笔** - 支持多种颜色和画笔大小调节
- ✨ **平滑绘图** - 采用贝塞尔曲线和指数移动平均算法，消除抖动
- 💾 **保存作品** - 一键保存你的创作为 PNG 图片
- 🌐 **静态部署** - 纯前端实现，完美兼容 Cloudflare Pages
- 🌍 **双语支持** - 中英文界面切换
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎭 **现代UI** - 采用玻璃态设计和流畅动画
- 🏗️ **模块化架构** - 清晰的代码结构，易于维护和扩展

## 🚀 快速开始

### 步骤 1: 克隆项目

```bash
git clone <your-repo-url>
cd air-writing
```

### 步骤 2: 安装依赖

```bash
npm install
```

### 步骤 3: 启动本地服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:8000`

### 步骤 4: 授权摄像头

首次访问时，浏览器会请求摄像头权限，点击"允许"。

### 步骤 5: 开始书写

1. 将手伸到摄像头前
2. 食指和拇指靠近（捏合）开始绘制
3. 移动手指进行书写
4. 分开手指停止绘制

## 🎮 使用方法

### 手势控制

- **开始绘制** - 将食指和拇指靠近（捏合手势）
- **停止绘制** - 将手指分开
- **移动光标** - 移动食指来控制绘图位置

### 画笔设置

- 调整画笔大小滑块来改变线条粗细
- 点击颜色按钮选择不同的画笔颜色
- 使用"清空画布"按钮清除所有内容
- 使用"保存图片"按钮下载你的作品

### 语言切换

点击右上角的语言切换按钮在中英文之间切换。

## 📁 项目结构

```
air-writing/
├── assets/                 # 资源目录
│   ├── css/               # 样式文件
│   │   └── style.css      # 主样式表
│   ├── js/                # JavaScript 模块
│   │   ├── app.js         # 主应用入口
│   │   ├── config.js      # 配置管理
│   │   ├── i18n.js        # 国际化支持
│   │   ├── canvas-renderer.js    # Canvas 渲染器
│   │   ├── gesture-detector.js   # 手势检测器
│   │   ├── mediapipe-manager.js  # MediaPipe 管理器
│   │   ├── ui-controller.js      # UI 控制器
│   │   └── drawing-smoothing.js  # 绘图平滑
│   └── images/            # 图片资源
├── index.html             # 主 HTML 文件
├── package.json           # NPM 配置
├── wrangler.toml          # Cloudflare 配置
├── .gitignore             # Git 忽略文件
└── README.md              # 项目说明
```

## 🏗️ 模块化架构

项目采用模块化设计，各模块职责清晰：

### 核心模块

- **config.js** - 集中管理所有配置参数
- **i18n.js** - 国际化和语言切换
- **canvas-renderer.js** - 负责所有 Canvas 绘图操作
- **gesture-detector.js** - 手势识别和检测逻辑
- **mediapipe-manager.js** - MediaPipe 引擎管理
- **ui-controller.js** - 用户界面交互控制
- **drawing-smoothing.js** - 绘图平滑算法
- **app.js** - 主应用程序，整合所有模块

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript (ES6+)** - 应用逻辑
- **MediaPipe Hands** - 手势识别
- **Canvas API** - 绘图功能
- **Cloudflare Pages** - 边缘部署

## 🌟 核心功能实现

### 手势识别

使用 MediaPipe Hands 库进行实时手部关键点检测，通过计算拇指和食指尖端的距离来判断是否执行捏合手势。

```javascript
const distance = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) +
    Math.pow(thumbTip.y - indexTip.y, 2) +
    Math.pow(thumbTip.z - indexTip.z, 2)
);
return distance < pinchThreshold;
```

### 平滑绘图系统

为了消除手部抖动带来的字迹不稳定问题，实现了双重平滑机制：

1. **指数移动平均（EMA）** - 对手部位置进行时间序列平滑
2. **贝塞尔曲线插值** - 使用二次贝塞尔曲线连接点，使线条更加流畅

```javascript
// 指数移动平均
const weight = Math.pow(smoothingFactor, points.length - 1 - i);
smoothedX += points[i].x * weight;

// 贝塞尔曲线插值
const cpx = (x1 + x2) / 2;
const cpy = (y1 + y2) / 2;
ctx.quadraticCurveTo(x1, y1, cpx, cpy);
```

这两种技术结合使用，显著提升了书写体验。

### 国际化支持

实现了完整的中英文双语支持：

- 动态语言切换
- 本地存储语言偏好
- 所有UI文本支持翻译
- 平滑的切换动画

## ☁️ Cloudflare Pages 部署

本项目是纯静态网站，支持通过 Git 集成自动部署到 Cloudflare Pages。

### 方式一：Git 集成（推荐 - 自动部署）

1. **推送代码到 Git 仓库**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 进入 **Pages** 部分

3. **创建新项目**
   - 点击 **Create a project**
   - 选择 **Connect to Git**
   - 授权并选择你的仓库

4. **配置构建设置** ⚠️ **重要**
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: /
   Root directory: (留空)
   ```
   
   **注意事项：**
   - ✅ **Build command**: `npm run build` - 验证文件并成功退出
   - ✅ **Build output directory**: `/` - 必须是斜杠，表示根目录
   - ❌ **不要使用** `npm run dev`（这会导致部署卡住）
   - ❌ **不要使用** `npx wrangler deploy`（这是 Workers 命令，不适用于 Pages）
   - ❌ **不要使用** `npx wrangler pages deploy`（这是 CLI 命令，不是 Dashboard 命令）
   
   > 💡 **遇到部署问题？** 请查看详细的 [部署指南 (DEPLOYMENT.md)](./DEPLOYMENT.md)

5. **部署**
   - 点击 **Save and Deploy**
   - 等待部署完成（通常 1-2 分钟）

### 方式二：使用 Wrangler CLI（命令行部署）

如果你需要使用命令行部署（适用于本地开发环境）：

```bash
# 方法 1：使用项目中的 npm 脚本（推荐）
npm run deploy

# 方法 2：直接使用 wrangler 命令
# 首先安装 Wrangler（如果未安装）
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署项目（注意：使用 pages deploy，不是 deploy）
wrangler pages deploy . --project-name=air-writing
```

**重要提示：**
- ✅ 本地命令行部署使用 `wrangler pages deploy` 或 `npm run deploy`
- ❌ **不要使用** `wrangler deploy`（这是 Workers 命令，会报错）
- 📝 Cloudflare Pages 和 Cloudflare Workers 是不同的产品，使用不同的命令

### 部署配置说明

项目包含 `wrangler.toml` 配置文件：

```toml
name = "air-writing"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."
```

### 为什么是纯静态项目？

- ✅ 无需编译或构建
- ✅ ES6 模块由浏览器原生支持
- ✅ 所有文件可以直接使用
- ✅ 兼容 Cloudflare Pages 的边缘网络

### 部署后

- 获得 `*.pages.dev` 域名
- 每次 `git push` 自动重新部署
- 支持预览部署（Pull Request）

### 自定义域名

1. 进入项目设置
2. 点击 **Custom domains**
3. 添加你的域名
4. 按照提示配置 DNS（通常是添加 CNAME 记录）

## 🔧 配置调整

### 调整平滑度

在 `assets/js/app.js` 中修改平滑因子：

```javascript
this.smoothing = new DrawingSmoothing(0.5); // 0-1，值越小越平滑
```

### 调整捏合阈值

在 `assets/js/config.js` 中修改：

```javascript
pinchThreshold: 0.05  // 距离阈值，值越小越灵敏
```

### 添加新语言

在 `assets/js/i18n.js` 中添加新的语言配置：

```javascript
translations: {
    zh: {
        newKey: '新文本'
    },
    en: {
        newKey: 'New Text'
    }
}
```

在代码中使用：

```javascript
import { I18N } from './i18n.js';
const text = I18N.t('newKey');
```

在HTML中使用：

```html
<span data-i18n="newKey">默认文本</span>
```

## 🔍 故障排除

### 摄像头无法访问

- 确保使用 HTTPS 或 localhost
- 检查浏览器权限设置
- 确认没有其他应用占用摄像头

### 手势识别不准确

- 调整光线，确保手部清晰可见
- 保持手部在摄像头视野内
- 调整手与摄像头的距离（建议30-60cm）

### 线条抖动

已实现平滑算法，如需调整平滑因子，请参考配置调整部分。

### 模块加载失败

- 确保所有文件路径正确
- 检查浏览器控制台错误信息
- 验证浏览器支持 ES6 模块

### 部署失败

**完整的部署指南请参考：[DEPLOYMENT.md](./DEPLOYMENT.md)** 📖

检查以下常见问题：

**问题 1: 部署后显示 "Hello World"**

**原因：** Build output directory 设置不正确

**解决方案：**
1. 登录 Cloudflare Dashboard
2. 进入你的 Pages 项目
3. 点击 **Settings** → **Builds & deployments**
4. 点击 **Edit configuration**
5. ⚠️ **确保 "Build command" 设置为 `npm run build`**
6. ⚠️ **确保 "Build output directory" 设置为 `/`** (斜杠)
7. 点击 **Save** 并重新部署

**问题 2: 使用 `npm run dev` 后部署卡住**

**原因：** `npm run dev` 启动开发服务器不会退出

**解决方案：**
1. 不要使用 `npm run dev` 作为构建命令
2. 使用 `npm run build` 替代

**错误：`It looks like you've run a Workers-specific command in a Pages project`**

如果在 Cloudflare Pages 部署时看到此错误：

**原因：** 在 Cloudflare Pages 项目设置中使用了错误的部署命令（如 `npx wrangler deploy`）

**解决方案：**
1. 登录 Cloudflare Dashboard
2. 进入你的 Pages 项目
3. 点击 **Settings** → **Builds & deployments**
4. 点击 **Edit configuration**
5. ⚠️ **确保 "Build command" 设置为 `npm run build`**
6. 确保 "Build output directory" 设置为 `/`
7. 点击 **Save** 并重新部署

**说明：**
- `npx wrangler deploy` 是用于 Cloudflare Workers 的命令
- `npx wrangler pages deploy` 是用于 Cloudflare Pages 的 CLI 命令
- 在 Cloudflare Pages Dashboard 的 Git 集成部署中，使用 `npm run build` 作为构建命令
- 只有在本地命令行手动部署时才需要使用 `npm run deploy` 或 `wrangler pages deploy`

**其他检查项：**
1. 确保 Build command 设置为 `npm run build`
2. Build output directory 设置为 `/`
3. Framework preset 设置为 None

## 🌐 浏览器兼容性

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

**要求**:
- 支持 ES6 模块
- 支持 WebRTC（摄像头访问）
- 支持 Canvas API

## 💡 使用技巧

1. **保持手部稳定** - 移动速度适中，避免过快
2. **光线充足** - 确保手部清晰可见
3. **适当距离** - 保持手部在摄像头视野中央
4. **练习捏合** - 熟悉捏合手势的力度和距离

## 📊 项目统计

- **JavaScript 模块**: 8 个
- **CSS 文件**: 1 个
- **HTML 文件**: 1 个
- **总代码行数**: ~1800+ 行
- **支持语言**: 2 种（中文、英文）

## 🎯 项目亮点

- ✅ 完整的双语支持（中英文）
- ✅ 模块化的国际化系统
- ✅ 平滑的绘图体验（EMA + 贝塞尔曲线）
- ✅ 现代化的 UI 设计（玻璃态）
- ✅ 完善的文档
- ✅ 一键部署到 Cloudflare Pages

## 📝 许可证

MIT License

---

<a name="english"></a>

## 📖 Project Introduction

A gesture-based air writing web application that uses MediaPipe Hands technology for real-time hand tracking and drawing. Users can capture hand movements through a camera to write and draw in the air.

## ✨ Features

- 🖐️ **Real-time Gesture Recognition** - Precise hand tracking using MediaPipe Hands
- ✍️ **Air Writing** - Write and draw in the air with pinch gestures
- 🎨 **Customizable Brush** - Multiple colors and adjustable brush sizes
- ✨ **Smooth Drawing** - Eliminates jitter using Bézier curves and exponential moving average
- 💾 **Save Artwork** - One-click save your creations as PNG images
- 🌐 **Static Deployment** - Pure frontend implementation, perfectly compatible with Cloudflare Pages
- 🌍 **Bilingual Support** - Switch between Chinese and English interfaces
- 📱 **Responsive Design** - Adapts to various screen sizes
- 🎭 **Modern UI** - Glassmorphism design with smooth animations
- 🏗️ **Modular Architecture** - Clear code structure, easy to maintain and extend

## 🚀 Quick Start

### Step 1: Clone the Project

```bash
git clone <your-repo-url>
cd air-writing
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Local Server

```bash
npm run dev
```

The browser will automatically open `http://localhost:8000`

### Step 4: Grant Camera Permission

On first visit, the browser will request camera permission, click "Allow".

### Step 5: Start Writing

1. Extend your hand in front of the camera
2. Bring index finger and thumb close together (pinch) to start drawing
3. Move your finger to write
4. Separate fingers to stop drawing

## 🎮 Usage

### Gesture Controls

- **Start Drawing** - Bring index finger and thumb close together (pinch gesture)
- **Stop Drawing** - Separate fingers
- **Move Cursor** - Move index finger to control drawing position

### Brush Settings

- Adjust brush size slider to change line thickness
- Click color buttons to select different brush colors
- Use "Clear Canvas" button to clear all content
- Use "Save Image" button to download your artwork

### Language Switching

Click the language toggle button in the top right corner to switch between Chinese and English.

## 📁 Project Structure

```
air-writing/
├── assets/                 # Assets directory
│   ├── css/               # Style files
│   │   └── style.css      # Main stylesheet
│   ├── js/                # JavaScript modules
│   │   ├── app.js         # Main application entry
│   │   ├── config.js      # Configuration management
│   │   ├── i18n.js        # Internationalization support
│   │   ├── canvas-renderer.js    # Canvas renderer
│   │   ├── gesture-detector.js   # Gesture detector
│   │   ├── mediapipe-manager.js  # MediaPipe manager
│   │   ├── ui-controller.js      # UI controller
│   │   └── drawing-smoothing.js  # Drawing smoothing
│   └── images/            # Image assets
├── index.html             # Main HTML file
├── package.json           # NPM configuration
├── wrangler.toml          # Cloudflare configuration
├── .gitignore             # Git ignore file
└── README.md              # Project documentation
```

## 🏗️ Modular Architecture

The project adopts a modular design with clear responsibilities for each module:

### Core Modules

- **config.js** - Centralized configuration management
- **i18n.js** - Internationalization and language switching
- **canvas-renderer.js** - All Canvas drawing operations
- **gesture-detector.js** - Gesture recognition and detection logic
- **mediapipe-manager.js** - MediaPipe engine management
- **ui-controller.js** - User interface interaction control
- **drawing-smoothing.js** - Drawing smoothing algorithms
- **app.js** - Main application integrating all modules

## 🛠️ Tech Stack

- **HTML5** - Page structure
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Application logic
- **MediaPipe Hands** - Gesture recognition
- **Canvas API** - Drawing functionality
- **Cloudflare Pages** - Edge deployment

## 🌟 Core Implementation

### Gesture Recognition

Uses MediaPipe Hands library for real-time hand landmark detection, determining pinch gestures by calculating the distance between thumb and index finger tips.

```javascript
const distance = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) +
    Math.pow(thumbTip.y - indexTip.y, 2) +
    Math.pow(thumbTip.z - indexTip.z, 2)
);
return distance < pinchThreshold;
```

### Smooth Drawing System

To eliminate jitter from hand tremors, a dual smoothing mechanism is implemented:

1. **Exponential Moving Average (EMA)** - Time series smoothing of hand positions
2. **Bézier Curve Interpolation** - Quadratic Bézier curves for smoother line connections

```javascript
// Exponential Moving Average
const weight = Math.pow(smoothingFactor, points.length - 1 - i);
smoothedX += points[i].x * weight;

// Bézier Curve Interpolation
const cpx = (x1 + x2) / 2;
const cpy = (y1 + y2) / 2;
ctx.quadraticCurveTo(x1, y1, cpx, cpy);
```

These two techniques combined significantly enhance the writing experience.

### Internationalization Support

Complete Chinese-English bilingual support:

- Dynamic language switching
- Local storage of language preferences
- All UI text supports translation
- Smooth transition animations

## ☁️ Cloudflare Pages Deployment

This project is a pure static website that supports automatic deployment to Cloudflare Pages via Git integration.

### Method 1: Git Integration (Recommended - Auto Deploy)

1. **Push code to Git repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Log in to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com/
   - Go to **Pages** section

3. **Create new project**
   - Click **Create a project**
   - Select **Connect to Git**
   - Authorize and select your repository

4. **Configure build settings** ⚠️ **IMPORTANT**
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: /
   Root directory: (leave empty)
   ```
   
   **Important Notes:**
   - ✅ **Build command**: `npm run build` - Validates files and exits successfully
   - ✅ **Build output directory**: `/` - Must be forward slash, indicating root directory
   - ❌ **DO NOT use** `npm run dev` (this causes deployment to hang)
   - ❌ **DO NOT use** `npx wrangler deploy` (this is a Workers command, not for Pages)
   - ❌ **DO NOT use** `npx wrangler pages deploy` (this is a CLI command, not for Dashboard)
   
   > 💡 **Having deployment issues?** See detailed [Deployment Guide (DEPLOYMENT.md)](./DEPLOYMENT.md)

5. **Deploy**
   - Click **Save and Deploy**
   - Wait for deployment to complete (usually 1-2 minutes)

### Method 2: Using Wrangler CLI (Command Line Deployment)

If you need to deploy via command line (for local development environment):

```bash
# Method 1: Use the npm script in the project (Recommended)
npm run deploy

# Method 2: Use wrangler command directly
# First install Wrangler (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy project (Note: use pages deploy, not deploy)
wrangler pages deploy . --project-name=air-writing
```

**Important Notes:**
- ✅ For local CLI deployment, use `wrangler pages deploy` or `npm run deploy`
- ❌ **DO NOT use** `wrangler deploy` (this is a Workers command and will error)
- 📝 Cloudflare Pages and Cloudflare Workers are different products with different commands

### Deployment Configuration

The project includes a `wrangler.toml` configuration file:

```toml
name = "air-writing"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."
```

### Why Pure Static?

- ✅ No compilation or build needed
- ✅ ES6 modules natively supported by browsers
- ✅ All files can be used directly
- ✅ Compatible with Cloudflare Pages edge network

### After Deployment

- Get a `*.pages.dev` domain
- Auto redeploy on every `git push`
- Support preview deployments (Pull Requests)

### Custom Domain

1. Go to project settings
2. Click **Custom domains**
3. Add your domain
4. Follow prompts to configure DNS (usually add CNAME record)

## 🔧 Configuration

### Adjust Smoothness

Modify smoothing factor in `assets/js/app.js`:

```javascript
this.smoothing = new DrawingSmoothing(0.5); // 0-1, smaller = smoother
```

### Adjust Pinch Threshold

Modify in `assets/js/config.js`:

```javascript
pinchThreshold: 0.05  // Distance threshold, smaller = more sensitive
```

### Add New Language

Add new language configuration in `assets/js/i18n.js`:

```javascript
translations: {
    zh: {
        newKey: '新文本'
    },
    en: {
        newKey: 'New Text'
    }
}
```

Use in code:

```javascript
import { I18N } from './i18n.js';
const text = I18N.t('newKey');
```

Use in HTML:

```html
<span data-i18n="newKey">Default Text</span>
```

## 🔍 Troubleshooting

### Camera Access Issues

- Ensure using HTTPS or localhost
- Check browser permission settings
- Confirm no other app is using the camera

### Inaccurate Gesture Recognition

- Adjust lighting to ensure hand is clearly visible
- Keep hand within camera view
- Adjust hand-to-camera distance (recommended 30-60cm)

### Line Jitter

Smoothing algorithm is implemented. To adjust, see Configuration section.

### Module Loading Failure

- Ensure all file paths are correct
- Check browser console for errors
- Verify browser supports ES6 modules

### Deployment Failure

**For complete deployment guide, see: [DEPLOYMENT.md](./DEPLOYMENT.md)** 📖

Check these common issues:

**Issue 1: "Hello World" appears after deployment**

**Cause:** Incorrect Build output directory setting

**Solution:**
1. Log in to Cloudflare Dashboard
2. Go to your Pages project
3. Click **Settings** → **Builds & deployments**
4. Click **Edit configuration**
5. ⚠️ **Ensure "Build command" is set to `npm run build`**
6. ⚠️ **Ensure "Build output directory" is set to `/`** (forward slash)
7. Click **Save** and redeploy

**Issue 2: Deployment hangs when using `npm run dev`**

**Cause:** `npm run dev` starts a dev server that never exits

**Solution:**
1. Don't use `npm run dev` as build command
2. Use `npm run build` instead

**Error: `It looks like you've run a Workers-specific command in a Pages project`**

If you see this error when deploying to Cloudflare Pages:

**Cause:** Used incorrect deploy command in Cloudflare Pages project settings (like `npx wrangler deploy`)

**Solution:**
1. Log in to Cloudflare Dashboard
2. Go to your Pages project
3. Click **Settings** → **Builds & deployments**
4. Click **Edit configuration**
5. ⚠️ **Ensure "Build command" is set to `npm run build`**
6. Ensure "Build output directory" is set to `/`
7. Click **Save** and redeploy

**Explanation:**
- `npx wrangler deploy` is the command for Cloudflare Workers
- `npx wrangler pages deploy` is the command for Cloudflare Pages CLI
- In Cloudflare Pages Dashboard Git integration deployment, use `npm run build` as build command
- Only use `npm run deploy` or `wrangler pages deploy` when manually deploying from local command line

**Other checks:**
1. Ensure Build command is set to `npm run build`
2. Build output directory set to `/`

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

**Requirements**:
- ES6 module support
- WebRTC support (camera access)
- Canvas API support

## 💡 Tips

1. **Keep Hand Steady** - Move at moderate speed, avoid too fast
2. **Adequate Lighting** - Ensure hand is clearly visible
3. **Proper Distance** - Keep hand in center of camera view
4. **Practice Pinching** - Get familiar with pinch gesture strength and distance

## 📊 Project Statistics

- **JavaScript Modules**: 8
- **CSS Files**: 1
- **HTML Files**: 1
- **Total Lines of Code**: ~1800+
- **Supported Languages**: 2 (Chinese, English)

## 🎯 Project Highlights

- ✅ Complete bilingual support (Chinese & English)
- ✅ Modular internationalization system
- ✅ Smooth drawing experience (EMA + Bézier curves)
- ✅ Modern UI design (Glassmorphism)
- ✅ Comprehensive documentation
- ✅ One-click deployment to Cloudflare Pages

## 📝 License

MIT License

---

## 🔗 Links / 链接

- **GitHub**: https://github.com/longzheng268/air-writing
- **Gitee**: https://gitee.com/longzheng0315/air-writing

---

**项目完成时间 / Project Completion**: 2025-12-07  
**版本 / Version**: 1.0.0  
**状态 / Status**: ✅ 生产就绪 / Production Ready
