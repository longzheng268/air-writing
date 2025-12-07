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

        this.setupCanvas();
        await this.initializeMediaPipe();
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

                // 如果距离较大，在两点之间插值绘制多条短线以防止断触
                if (distance > 20) {
                    const steps = Math.ceil(distance / 10);
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
