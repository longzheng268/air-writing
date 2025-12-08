// ==================== 主应用程序 ====================
import { CONFIG } from './config.js';
import { I18N } from './i18n.js';
import { MediaPipeManager } from './mediapipe-manager.js';
import { GestureDetector } from './gesture-detector.js';
import { CanvasRenderer } from './canvas-renderer.js';
import { UIController } from './ui-controller.js';
import { DrawingSmoothing } from './drawing-smoothing.js';

class AirWritingApp {
    constructor() {
        // DOM 元素
        this.videoElement = document.getElementById('videoElement');
        this.drawingCanvas = document.getElementById('drawingCanvas');
        this.handCanvas = document.getElementById('handCanvas');

        // 核心模块
        this.renderer = new CanvasRenderer(this.drawingCanvas, this.handCanvas);
        this.gestureDetector = new GestureDetector();
        this.mediaPipeManager = new MediaPipeManager(
            this.videoElement,
            (results) => this.onResults(results)
        );

        // UI 控制器
        this.uiController = new UIController({
            onBrushSizeChange: (size) => this.renderer.setBrushSize(size),
            onColorChange: (color) => this.renderer.setBrushColor(color),
            onClear: () => this.clearCanvas(),
            onSave: () => this.saveImage()
        });

        // 绘图状态
        this.isDrawing = false;
        this.lastPoint = null;
        this.prevPoint = null;

        // 平滑器 - 使用更强的平滑效果
        this.smoothing = new DrawingSmoothing(0.2);

        this.init();
    }

    /**
     * 初始化应用
     */
    async init() {
        // 初始化国际化
        I18N.init();

        // 初始化隐私弹窗
        this.initPrivacyModal();

        // 移动端优化
        this.setupMobileOptimization();

        this.setupCanvas();
        await this.initializeMediaPipe();
    }

    /**
     * 初始化隐私声明弹窗
     */
    initPrivacyModal() {
        const privacyModal = document.getElementById('privacyModal');
        const privacyAcceptBtn = document.getElementById('privacyAcceptBtn');

        if (!privacyModal || !privacyAcceptBtn) return;

        // 检查 localStorage
        const hasAcceptedPrivacy = localStorage.getItem('airWritingPrivacyAccepted');

        // 只在明确未接受时显示
        if (!hasAcceptedPrivacy) {
            privacyModal.classList.remove('hidden');
            privacyModal.style.display = 'flex'; // 确保显示
        } else {
            // 确保隐藏
            privacyModal.classList.add('hidden');
            privacyModal.style.display = 'none';
        }

        // 点击"我知道了"按钮
        privacyAcceptBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 防止可能的默认行为
            localStorage.setItem('airWritingPrivacyAccepted', 'true');

            // 双重隐藏保障
            privacyModal.classList.add('hidden');
            privacyModal.style.display = 'none';
        });
    }

    /**
     * 移动端沉浸式体验优化
     */
    setupMobileOptimization() {
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (!isMobile) return;

        // 设置视口高度CSS变量,解决移动端地址栏问题
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 100);
        });

        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // 防止捏合缩放
        document.addEventListener('gesturestart', (event) => {
            event.preventDefault();
        });

        // 滚动到顶部以隐藏地址栏
        window.scrollTo(0, 1);
        setTimeout(() => window.scrollTo(0, 0), 0);
    }


    /**
     * 设置画布尺寸
     */
    setupCanvas() {
        const container = this.drawingCanvas.parentElement;

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            this.renderer.setCanvasSize(rect.width, rect.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    /**
     * 初始化 MediaPipe
     */
    async initializeMediaPipe() {
        try {
            this.uiController.updateStatus(I18N.t('statusInitializing'), 'loading');
            await this.mediaPipeManager.initialize();
            this.uiController.updateStatus(I18N.t('statusReady'), 'ready');
        } catch (error) {
            console.error('初始化失败:', error);
            this.uiController.updateStatus(I18N.t('statusError'), 'error');
        }
    }

    /**
     * 处理手势识别结果
     * @param {Object} results - MediaPipe 识别结果
     */
    onResults(results) {
        // 清空手部追踪画布
        this.renderer.clearHandCanvas();

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // 隐藏提示
            this.uiController.hideHint();

            const landmarks = results.multiHandLandmarks[0];

            // 绘制手部骨架
            this.renderer.drawHandLandmarks(landmarks);

            // 检测捏合手势
            const isPinching = this.gestureDetector.detectPinch(landmarks);

            // 获取食指尖端位置
            const position = this.gestureDetector.getIndexFingerTip(
                landmarks,
                this.drawingCanvas.width,
                this.drawingCanvas.height
            );

            // 处理绘图逻辑
            this.handleDrawing(position, isPinching);

            // 绘制光标
            this.renderer.drawCursor(position.x, position.y, isPinching);
        } else {
            // 显示提示
            this.uiController.showHint();
            this.isDrawing = false;
            this.lastPoint = null;
            this.prevPoint = null;
            this.smoothing.reset();
        }
    }

    /**
     * 处理绘图逻辑
     * @param {Object} position - 当前位置 {x, y}
     * @param {boolean} isPinching - 是否正在捏合
     */
    handleDrawing(position, isPinching) {
        if (isPinching) {
            // 使用平滑器处理位置
            const smoothedPosition = this.smoothing.addPoint(position);

            if (!this.isDrawing) {
                this.isDrawing = true;
                this.lastPoint = smoothedPosition;
                this.prevPoint = null;
            } else {
                // 计算点之间的距离
                const distance = Math.sqrt(
                    Math.pow(smoothedPosition.x - this.lastPoint.x, 2) +
                    Math.pow(smoothedPosition.y - this.lastPoint.y, 2)
                );

                // 过滤掉微小移动（< 0.5 像素）以减少噪声
                if (distance < 0.5) {
                    return;
                }

                // 如果距离较大，在两点之间插值绘制多条短线以防止断触
                // 降低阈值从 20 到 15，使插值更积极地工作，特别是对快速的横向移动
                if (distance > 15) {
                    // 增加插值步数以获得更平滑的线条
                    const steps = Math.ceil(distance / 8);
                    let prevX = this.lastPoint.x;
                    let prevY = this.lastPoint.y;

                    for (let i = 1; i <= steps; i++) {
                        const t = i / steps;
                        const interpolatedX = this.lastPoint.x + (smoothedPosition.x - this.lastPoint.x) * t;
                        const interpolatedY = this.lastPoint.y + (smoothedPosition.y - this.lastPoint.y) * t;

                        this.renderer.drawSmoothLine(
                            prevX,
                            prevY,
                            interpolatedX,
                            interpolatedY
                        );

                        prevX = interpolatedX;
                        prevY = interpolatedY;
                    }

                    // 更新最后位置为目标平滑位置（防止位置漂移）
                    this.prevPoint = this.lastPoint;
                    this.lastPoint = smoothedPosition;
                } else {
                    // 使用平滑的贝塞尔曲线绘制
                    this.renderer.drawSmoothLine(
                        this.lastPoint.x,
                        this.lastPoint.y,
                        smoothedPosition.x,
                        smoothedPosition.y
                    );

                    this.prevPoint = this.lastPoint;
                    this.lastPoint = smoothedPosition;
                }
            }
        } else {
            this.isDrawing = false;
            this.lastPoint = null;
            this.prevPoint = null;
            this.smoothing.reset();
        }
    }

    /**
     * 清空画布
     */
    clearCanvas() {
        this.renderer.clearDrawingCanvas();
    }

    /**
     * 保存图片
     */
    saveImage() {
        const dataUrl = this.renderer.saveAsImage();
        const filename = `air-writing-${Date.now()}.png`;
        this.uiController.downloadImage(dataUrl, filename);
    }

    /**
     * 销毁应用
     */
    destroy() {
        this.mediaPipeManager.destroy();
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.airWritingApp = new AirWritingApp();
});
