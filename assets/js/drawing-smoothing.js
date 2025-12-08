// ==================== Drawing Smoother ====================
export class DrawingSmoothing {
    constructor(smoothingFactor = 0.2) {
        this.smoothingFactor = smoothingFactor; // 0-1, smaller value = smoother
        this.points = [];
        this.maxPoints = 8; // Increase number of retained points for smoother effect
        this.lastTimestamp = Date.now();
        this.velocityHistory = [];
        this.maxVelocityHistory = 3;
    }

    /**
     * Add new point and return smoothed point
     * @param {Object} point - {x, y}
     * @returns {Object} Smoothed point
     */
    addPoint(point) {
        const currentTime = Date.now();
        const deltaTime = Math.max(currentTime - this.lastTimestamp, 1);
        
        // Calculate movement velocity
        let velocity = 0;
        if (this.points.length > 0) {
            const lastPoint = this.points[this.points.length - 1];
            const distance = Math.sqrt(
                Math.pow(point.x - lastPoint.x, 2) + 
                Math.pow(point.y - lastPoint.y, 2)
            );
            velocity = distance / deltaTime * 1000; // pixels/second
        }
        
        // Update velocity history
        this.velocityHistory.push(velocity);
        if (this.velocityHistory.length > this.maxVelocityHistory) {
            this.velocityHistory.shift();
        }
        
        this.points.push(point);

        // Keep point count within limit
        if (this.points.length > this.maxPoints) {
            this.points.shift();
        }

        this.lastTimestamp = currentTime;
        return this.getSmoothedPoint();
    }

    /**
     * Get smoothed point (using adaptive exponential moving average)
     * @returns {Object} {x, y}
     */
    getSmoothedPoint() {
        if (this.points.length === 0) {
            return null;
        }

        if (this.points.length === 1) {
            return this.points[0];
        }

        // Calculate average velocity
        const avgVelocity = this.velocityHistory.length > 0
            ? this.velocityHistory.reduce((sum, v) => sum + v, 0) / this.velocityHistory.length
            : 0;
        
        // Adaptive smoothing factor: reduce smoothing for fast movement (more responsive),
        // increase smoothing for slow movement (more stable)
        // Velocity threshold: 200 pixels/second as fast movement criterion
        let adaptiveSmoothingFactor = this.smoothingFactor;
        if (avgVelocity > 200) {
            // Fast movement: increase smoothing factor (0.2 -> 0.35), reduce lag, stay responsive
            adaptiveSmoothingFactor = Math.min(0.35, this.smoothingFactor * 1.75);
        } else if (avgVelocity < 50) {
            // Slow movement: maintain lower smoothing factor for more stable lines
            adaptiveSmoothingFactor = this.smoothingFactor * 0.9;
        }

        // Use weighted average, with higher weight for newer points
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
     * Reset smoother state
     */
    reset() {
        this.points = [];
        this.velocityHistory = [];
        this.lastTimestamp = Date.now();
    }

    /**
     * Smooth path using Bezier curves
     * @param {Array} points - Array of points
     * @returns {Array} Array of smoothed points
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

            // Use three-point average
            smoothed.push({
                x: (prev.x + curr.x + next.x) / 3,
                y: (prev.y + curr.y + next.y) / 3
            });
        }

        smoothed.push(points[points.length - 1]);
        return smoothed;
    }
}
