// ==================== 手势检测器 ====================
import { CONFIG } from './config.js';

export class GestureDetector {
    constructor() {
        this.pinchThreshold = CONFIG.drawing.pinchThreshold;
        // Add hysteresis to prevent flickering (30% of threshold)
        this.pinchHysteresis = this.pinchThreshold * 0.3;
        this.isPinching = false;
        this.lastDistance = 1.0;
        
        // Add velocity tracking for adaptive thresholds
        this.distanceHistory = [];
        this.maxHistorySize = 5;
        this.lastTimestamp = Date.now();
        
        // Debounce counter - prevent rapid state switching
        this.stateChangeCounter = 0;
        this.minStableFrames = 2; // Requires 2 consecutive frames to confirm state change
    }

    /**
     * Detect pinch gesture (with adaptive hysteresis and debouncing)
     * @param {Array} landmarks - Hand landmark array
     * @returns {boolean} Whether currently pinching
     */
    detectPinch(landmarks) {
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];

        const distance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2) +
            Math.pow(thumbTip.z - indexTip.z, 2)
        );

        // Calculate distance change rate
        const currentTime = Date.now();
        const deltaTime = Math.max(currentTime - this.lastTimestamp, 1);
        const distanceChangeRate = Math.abs(distance - this.lastDistance) / deltaTime * 1000;
        
        // Update distance history
        this.distanceHistory.push(distance);
        if (this.distanceHistory.length > this.maxHistorySize) {
            this.distanceHistory.shift();
        }
        
        // Calculate average distance for more stable judgment
        const avgDistance = this.distanceHistory.reduce((sum, d) => sum + d, 0) / this.distanceHistory.length;
        
        // Adaptive hysteresis: increase during fast movement, decrease during slow movement
        // This maintains stability during fast writing and quick response when stopping
        const adaptiveHysteresis = distanceChangeRate > 0.5 
            ? this.pinchHysteresis * 1.2  // Fast movement: +20% hysteresis to prevent false triggers
            : this.pinchHysteresis * 0.8;  // Slow movement: -20% hysteresis for better response

        // Use average distance for judgment to reduce single-frame noise
        const effectiveDistance = avgDistance;
        
        // State transition logic
        let desiredState = this.isPinching;
        
        if (this.isPinching) {
            // Already pinching, check if should release
            // Use smaller hysteresis for quick pen lift
            if (effectiveDistance > this.pinchThreshold + adaptiveHysteresis * 0.7) {
                desiredState = false;
            }
        } else {
            // Not pinching, check if should start
            if (effectiveDistance < this.pinchThreshold - adaptiveHysteresis) {
                desiredState = true;
            }
        }
        
        // Debounce logic: require consecutive frames to confirm state change
        if (desiredState !== this.isPinching) {
            this.stateChangeCounter++;
            // For release (pen lift): only 1 frame needed for quick response
            // For start (pen down): 2 frames needed to prevent false triggers
            const requiredFrames = desiredState ? this.minStableFrames : 1;
            
            if (this.stateChangeCounter >= requiredFrames) {
                this.isPinching = desiredState;
                this.stateChangeCounter = 0;
            }
        } else {
            // State consistent, reset counter
            this.stateChangeCounter = 0;
        }

        this.lastDistance = distance;
        this.lastTimestamp = currentTime;
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
