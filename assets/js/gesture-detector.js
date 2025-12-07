// ==================== 手势检测器 ====================
import { CONFIG } from './config.js';

export class GestureDetector {
    constructor() {
        this.pinchThreshold = CONFIG.drawing.pinchThreshold;
        // Add hysteresis to prevent flickering (30% of threshold)
        this.pinchHysteresis = this.pinchThreshold * 0.3;
        this.isPinching = false;
        this.lastDistance = 1.0;
    }

    /**
     * 检测捏合手势（带滞后效应防止抖动）
     * @param {Array} landmarks - 手部关键点数组
     * @returns {boolean} 是否正在捏合
     */
    detectPinch(landmarks) {
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];

        const distance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2) +
            Math.pow(thumbTip.z - indexTip.z, 2)
        );

        // Apply hysteresis to prevent rapid on/off toggling
        if (this.isPinching) {
            // If already pinching, need to exceed threshold + hysteresis to release
            if (distance > this.pinchThreshold + this.pinchHysteresis) {
                this.isPinching = false;
            }
        } else {
            // If not pinching, need to be below threshold - hysteresis to start
            if (distance < this.pinchThreshold - this.pinchHysteresis) {
                this.isPinching = true;
            }
        }

        this.lastDistance = distance;
        return this.isPinching;
    }

    /**
     * 获取食指尖端位置
     * @param {Array} landmarks - 手部关键点数组
     * @param {number} canvasWidth - 画布宽度
     * @param {number} canvasHeight - 画布高度
     * @returns {Object} {x, y} 坐标
     */
    getIndexFingerTip(landmarks, canvasWidth, canvasHeight) {
        const indexTip = landmarks[8];
        return {
            x: (1 - indexTip.x) * canvasWidth,  // 镜像翻转
            y: indexTip.y * canvasHeight
        };
    }

    /**
     * 计算两点之间的距离
     * @param {Object} point1 - 第一个点 {x, y, z}
     * @param {Object} point2 - 第二个点 {x, y, z}
     * @returns {number} 距离
     */
    calculateDistance(point1, point2) {
        return Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2) +
            Math.pow((point1.z || 0) - (point2.z || 0), 2)
        );
    }
}
