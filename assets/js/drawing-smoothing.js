// ==================== 绘图平滑器 ====================
export class DrawingSmoothing {
    constructor(smoothingFactor = 0.3) {
        this.smoothingFactor = smoothingFactor; // 0-1, 值越小越平滑
        this.points = [];
        this.maxPoints = 5; // 保留最近的点数
    }

    /**
     * 添加新点并返回平滑后的点
     * @param {Object} point - {x, y}
     * @returns {Object} 平滑后的点
     */
    addPoint(point) {
        this.points.push(point);

        // 保持点数在限制内
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }

        return this.getSmoothedPoint();
    }

    /**
     * 获取平滑后的点（使用指数移动平均）
     * @returns {Object} {x, y}
     */
    getSmoothedPoint() {
        if (this.points.length === 0) {
            return null;
        }

        if (this.points.length === 1) {
            return this.points[0];
        }

        // 使用加权平均，最新的点权重更高
        let totalWeight = 0;
        let smoothedX = 0;
        let smoothedY = 0;

        for (let i = 0; i < this.points.length; i++) {
            const weight = Math.pow(this.smoothingFactor, this.points.length - 1 - i);
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
