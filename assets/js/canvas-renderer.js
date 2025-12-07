// ==================== Canvas 渲染器 ====================
import { CONFIG } from './config.js';

export class CanvasRenderer {
    constructor(drawingCanvas, handCanvas) {
        this.drawingCanvas = drawingCanvas;
        this.handCanvas = handCanvas;
        this.drawingCtx = drawingCanvas.getContext('2d');
        this.handCtx = handCanvas.getContext('2d');

        this.brushSize = CONFIG.drawing.defaultBrushSize;
        this.brushColor = CONFIG.drawing.defaultColor;
    }

    /**
     * 设置画布尺寸
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    setCanvasSize(width, height) {
        this.drawingCanvas.width = width;
        this.drawingCanvas.height = height;
        this.handCanvas.width = width;
        this.handCanvas.height = height;
    }

    /**
     * 设置画笔大小
     * @param {number} size - 画笔大小
     */
    setBrushSize(size) {
        this.brushSize = size;
    }

    /**
     * 设置画笔颜色
     * @param {string} color - 颜色值
     */
    setBrushColor(color) {
        this.brushColor = color;
    }

    /**
     * 使用二次贝塞尔曲线绘制平滑线条
     * @param {number} x1 - 起点 x
     * @param {number} y1 - 起点 y
     * @param {number} x2 - 终点 x
     * @param {number} y2 - 终点 y
     */
    drawSmoothLine(x1, y1, x2, y2) {
        this.drawingCtx.strokeStyle = this.brushColor;
        this.drawingCtx.lineWidth = this.brushSize;
        this.drawingCtx.lineCap = 'round';
        this.drawingCtx.lineJoin = 'round';

        // Calculate distance between points
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        // Skip if points are too close (reduces noise)
        if (distance < 1) {
            return;
        }

        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(x1, y1);

        // 使用二次贝塞尔曲线平滑连接
        // 控制点在两点之间，创建平滑过渡
        const cpx = (x1 + x2) / 2;
        const cpy = (y1 + y2) / 2;
        this.drawingCtx.quadraticCurveTo(x1, y1, cpx, cpy);
        
        // 从控制点到终点绘制另一段曲线
        this.drawingCtx.quadraticCurveTo(x2, y2, x2, y2);

        this.drawingCtx.stroke();
    }

    /**
     * 清空绘图画布
     */
    clearDrawingCanvas() {
        this.drawingCtx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
    }

    /**
     * 清空手部追踪画布
     */
    clearHandCanvas() {
        this.handCtx.clearRect(0, 0, this.handCanvas.width, this.handCanvas.height);
    }

    /**
     * 绘制手部关键点和连接线
     * @param {Array} landmarks - 手部关键点数组
     */
    drawHandLandmarks(landmarks) {
        const width = this.handCanvas.width;
        const height = this.handCanvas.height;

        // 绘制连接线
        this.handCtx.strokeStyle = 'rgba(102, 126, 234, 0.6)';
        this.handCtx.lineWidth = 2;

        CONFIG.handConnections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];

            this.handCtx.beginPath();
            this.handCtx.moveTo(
                (1 - startPoint.x) * width,
                startPoint.y * height
            );
            this.handCtx.lineTo(
                (1 - endPoint.x) * width,
                endPoint.y * height
            );
            this.handCtx.stroke();
        });

        // 绘制关键点
        landmarks.forEach((landmark, index) => {
            const x = (1 - landmark.x) * width;
            const y = landmark.y * height;

            this.handCtx.beginPath();
            this.handCtx.arc(x, y, 4, 0, 2 * Math.PI);

            // 拇指和食指高亮
            if (index === 4 || index === 8) {
                this.handCtx.fillStyle = '#f093fb';
            } else {
                this.handCtx.fillStyle = '#667eea';
            }

            this.handCtx.fill();
        });
    }

    /**
     * 绘制光标
     * @param {number} x - x 坐标
     * @param {number} y - y 坐标
     * @param {boolean} isPinching - 是否正在捏合
     */
    drawCursor(x, y, isPinching) {
        const radius = isPinching ? this.brushSize + 5 : this.brushSize + 10;

        this.handCtx.beginPath();
        this.handCtx.arc(x, y, radius, 0, 2 * Math.PI);
        this.handCtx.strokeStyle = isPinching ? this.brushColor : 'rgba(255, 255, 255, 0.8)';
        this.handCtx.lineWidth = 3;
        this.handCtx.stroke();

        if (isPinching) {
            this.handCtx.fillStyle = this.brushColor + '40';
            this.handCtx.fill();
        }
    }

    /**
     * 保存画布为图片
     * @returns {string} 图片数据 URL
     */
    saveAsImage() {
        return this.drawingCanvas.toDataURL('image/png');
    }
}
