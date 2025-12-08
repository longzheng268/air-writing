// ==================== 应用配置 ====================
export const CONFIG = {
    // MediaPipe 配置
    mediaPipe: {
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
        cdnUrl: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/'
    },

    // 摄像头配置
    camera: {
        width: 1280,
        height: 720
    },

    // 绘图配置
    drawing: {
        defaultBrushSize: 5,
        minBrushSize: 1,
        maxBrushSize: 20,
        defaultColor: '#667eea',
        pinchThreshold: 0.055,  // Fine-tune threshold for better balance between sensitivity and stability
        maxInterpolationSteps: 30  // Maximum interpolation steps to prevent performance issues during very fast movements
    },

    // 颜色预设
    colors: [
        '#667eea',
        '#f093fb',
        '#4facfe',
        '#43e97b',
        '#fa709a',
        '#feca57',
        '#ff6b6b',
        '#ee5a6f'
    ],

    // 手部连接关系
    handConnections: [
        [0, 1], [1, 2], [2, 3], [3, 4],  // 拇指
        [0, 5], [5, 6], [6, 7], [7, 8],  // 食指
        [0, 9], [9, 10], [10, 11], [11, 12],  // 中指
        [0, 13], [13, 14], [14, 15], [15, 16],  // 无名指
        [0, 17], [17, 18], [18, 19], [19, 20],  // 小指
        [5, 9], [9, 13], [13, 17]  // 手掌
    ]
};
