// ==================== 绘图平滑器 ====================
export class DrawingSmoothing {
    constructor(smoothingFactor = 0.2) {
        this.smoothingFactor = smoothingFactor; // 0-1, 值越小越平滑
        this.points = [];
        this.maxPoints = 8; // 增加保留的点数以获得更平滑的效果
        this.lastTimestamp = Date.now();
        this.velocityHistory = [];
        this.maxVelocityHistory = 3;
    }

    /**
     * 添加新点并返回平滑后的点
     * @param {Object} point - {x, y}
     * @returns {Object} 平滑后的点
     */
    addPoint(point) {
        const currentTime = Date.now();
        const deltaTime = Math.max(currentTime - this.lastTimestamp, 1);
        
        // 计算移动速度
        let velocity = 0;
        if (this.points.length > 0) {
            const lastPoint = this.points[this.points.length - 1];
            const distance = Math.sqrt(
                Math.pow(point.x - lastPoint.x, 2) + 
                Math.pow(point.y - lastPoint.y, 2)
            );
            velocity = distance / deltaTime * 1000; // 像素/秒
        }
        
        // 更新速度历史
        this.velocityHistory.push(velocity);
        if (this.velocityHistory.length > this.maxVelocityHistory) {
            this.velocityHistory.shift();
        }
        
        this.points.push(point);

        // 保持点数在限制内
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }

        this.lastTimestamp = currentTime;
        return this.getSmoothedPoint();
    }

    /**
     * 获取平滑后的点（使用自适应指数移动平均）
     * @returns {Object} {x, y}
     */
    getSmoothedPoint() {
        if (this.points.length === 0) {
            return null;
        }

        if (this.points.length === 1) {
            return this.points[0];
        }

        // 计算平均速度
        const avgVelocity = this.velocityHistory.length > 0
            ? this.velocityHistory.reduce((sum, v) => sum + v, 0) / this.velocityHistory.length
            : 0;
        
        // 自适应平滑因子：快速移动时减少平滑（更跟手），慢速移动时增加平滑（更稳定）
        // 速度阈值：200 像素/秒作为快速移动的判断
        let adaptiveSmoothingFactor = this.smoothingFactor;
        if (avgVelocity > 200) {
            // 快速移动：增加平滑因子（0.2 -> 0.35），减少延迟，保持跟手
            adaptiveSmoothingFactor = Math.min(0.35, this.smoothingFactor * 1.75);
        } else if (avgVelocity < 50) {
            // 慢速移动：保持较低的平滑因子，获得更稳定的线条
            adaptiveSmoothingFactor = this.smoothingFactor * 0.9;
        }

        // 使用加权平均，最新的点权重更高
        let totalWeight = 0;
        let smoothedX = 0;
        let smoothedY = 0;

        for (let i = 0; i < this.points.length; i++) {
            const weight = Math.pow(adaptiveSmoothingFactor, this.points.length - 1 - i);
            totalWeight += weight;
            smoothedX += this.points[i].x * weight;
            smoothedY += this.points[i].y * weight;
        }

        return {
            x: smoothedX / totalWeight,
            y: smoothedY / totalWeight
        };
    }

    /**
     * 重置平滑器
     */
    reset() {
        this.points = [];
    }

    /**
     * 使用贝塞尔曲线平滑路径
     * @param {Array} points - 点数组
     * @returns {Array} 平滑后的点数组
     */
    static smoothPath(points) {
        if (points.length < 3) {
            return points;
        }

        const smoothed = [];
        smoothed.push(points[0]);

        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];

            // 使用三点平均
            smoothed.push({
                x: (prev.x + curr.x + next.x) / 3,
                y: (prev.y + curr.y + next.y) / 3
            });
        }

        smoothed.push(points[points.length - 1]);
        return smoothed;
    }
}
