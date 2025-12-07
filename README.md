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

本项目可以直接部署到 Cloudflare Pages，无需任何构建步骤。

### 方法一：通过 Git 集成（推荐）

1. 将代码推送到 GitHub/GitLab
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Pages** → **Create a project**
4. 选择你的 Git 仓库
5. 配置构建设置：
   - **Framework preset**: None
   - **Build command**: (留空)
   - **Build output directory**: `/`
6. 点击 **Save and Deploy**

### 方法二：使用 Wrangler CLI

```bash
# 安装依赖
npm install

# 部署到 Cloudflare Pages
npm run deploy
```

### 环境要求

- ✅ 纯静态文件，无需服务器端渲染
- ✅ 使用 ES6 模块，现代浏览器原生支持
- ✅ 所有资源通过 CDN 加载（MediaPipe）
- ✅ 兼容 Cloudflare Pages 的边缘网络

### 自定义域名

部署后，你可以在 Cloudflare Pages 设置中添加自定义域名：

1. 进入项目设置
2. 点击 **Custom domains**
3. 添加你的域名
4. 按照提示配置 DNS

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

在 `assets/js/i18n.js` 中添加新的语言配置。

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

This project can be deployed directly to Cloudflare Pages without any build steps.

### Method 1: Git Integration (Recommended)

1. Push code to GitHub/GitLab
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to **Pages** → **Create a project**
4. Select your Git repository
5. Configure build settings:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
6. Click **Save and Deploy**

### Method 2: Using Wrangler CLI

```bash
# Install dependencies
npm install

# Deploy to Cloudflare Pages
npm run deploy
```

### Requirements

- ✅ Pure static files, no server-side rendering needed
- ✅ Uses ES6 modules, natively supported by modern browsers
- ✅ All resources loaded via CDN (MediaPipe)
- ✅ Compatible with Cloudflare Pages edge network

### Custom Domain

After deployment, you can add a custom domain in Cloudflare Pages settings:

1. Go to project settings
2. Click **Custom domains**
3. Add your domain
4. Follow prompts to configure DNS

## 🔧 Configuration

### Adjust Smoothness

Modify smoothing factor in `assets/js/app.js`:

```javascript
this.smoothing = new DrawingSmoothing(0.5); // 0-1, smaller value = smoother
```

### Adjust Pinch Threshold

Modify in `assets/js/config.js`:

```javascript
pinchThreshold: 0.05  // Distance threshold, smaller = more sensitive
```

### Add New Language

Add new language configuration in `assets/js/i18n.js`.

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

## 📝 License

MIT License
