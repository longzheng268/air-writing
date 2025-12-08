// ==================== 手势检测器 ====================
import { CONFIG } from './config.js';

export class GestureDetector {
    constructor() {
        this.pinchThreshold = CONFIG.drawing.pinchThreshold;
        // Add hysteresis to prevent flickering (30% of threshold)
        this.pinchHysteresis = this.pinchThreshold * 0.3;
        this.isPinching = false;
        this.lastDistance = 1.0;
        
        // 添加速度跟踪用于自适应阈值
        this.distanceHistory = [];
        this.maxHistorySize = 5;
        this.lastTimestamp = Date.now();
        
        // 防抖计数器 - 防止快速切换
        this.stateChangeCounter = 0;
        this.minStableFrames = 2; // 需要连续2帧确认状态变化
    }

    /**
     * 检测捏合手势（带自适应滞后效应和防抖）
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

        // 计算距离变化速度
        const currentTime = Date.now();
        const deltaTime = Math.max(currentTime - this.lastTimestamp, 1);
        const distanceChangeRate = Math.abs(distance - this.lastDistance) / deltaTime * 1000;
        
        // 更新距离历史
        this.distanceHistory.push(distance);
        if (this.distanceHistory.length > this.maxHistorySize) {
            this.distanceHistory.shift();
        }
        
        // 计算平均距离，用于更稳定的判断
        const avgDistance = this.distanceHistory.reduce((sum, d) => sum + d, 0) / this.distanceHistory.length;
        
        // 自适应滞后：快速移动时增加滞后，慢速移动时减少滞后
        // 这样可以在快速书写时保持稳定，在停笔时快速响应
        const adaptiveHysteresis = distanceChangeRate > 0.5 
            ? this.pinchHysteresis * 1.2  // 快速移动：增加20%滞后，防止误触
            : this.pinchHysteresis * 0.8;  // 慢速移动：减少20%滞后，提高响应

        // 使用平均距离进行判断，减少单帧噪声
        const effectiveDistance = avgDistance;
        
        // 状态切换逻辑
        let desiredState = this.isPinching;
        
        if (this.isPinching) {
            // 已经在捏合状态，检查是否应该释放
            // 使用较小的滞后以实现快速停笔
            if (effectiveDistance > this.pinchThreshold + adaptiveHysteresis * 0.7) {
                desiredState = false;
            }
        } else {
            // 未在捏合状态，检查是否应该开始捏合
            if (effectiveDistance < this.pinchThreshold - adaptiveHysteresis) {
                desiredState = true;
            }
        }
        
        // 防抖逻辑：需要连续几帧确认状态变化
        if (desiredState !== this.isPinching) {
            this.stateChangeCounter++;
            // 对于释放捏合（停笔），只需要1帧确认，实现快速停笔
            // 对于开始捏合（起笔），需要2帧确认，防止误触
            const requiredFrames = desiredState ? this.minStableFrames : 1;
            
            if (this.stateChangeCounter >= requiredFrames) {
                this.isPinching = desiredState;
                this.stateChangeCounter = 0;
            }
        } else {
            // 状态一致，重置计数器
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
