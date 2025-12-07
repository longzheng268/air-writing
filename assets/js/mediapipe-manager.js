// ==================== MediaPipe 管理器 ====================
import { CONFIG } from './config.js';

export class MediaPipeManager {
    constructor(videoElement, onResults) {
        this.videoElement = videoElement;
        this.onResults = onResults;
        this.hands = null;
        this.camera = null;
    }

    /**
     * 初始化 MediaPipe Hands
     */
    async initialize() {
        try {
            // 创建 Hands 实例
            this.hands = new Hands({
                locateFile: (file) => {
                    return `${CONFIG.mediaPipe.cdnUrl}${file}`;
                }
            });

            // 配置 Hands
            this.hands.setOptions({
                maxNumHands: CONFIG.mediaPipe.maxNumHands,
                modelComplexity: CONFIG.mediaPipe.modelComplexity,
                minDetectionConfidence: CONFIG.mediaPipe.minDetectionConfidence,
                minTrackingConfidence: CONFIG.mediaPipe.minTrackingConfidence
            });

            // 设置结果回调
            this.hands.onResults(this.onResults);

            // 启动摄像头
            await this.startCamera();

            return true;
        } catch (error) {
            console.error('MediaPipe 初始化失败:', error);
            throw error;
        }
    }

    /**
     * 启动摄像头
     */
    async startCamera() {
        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.hands.send({ image: this.videoElement });
            },
            width: CONFIG.camera.width,
            height: CONFIG.camera.height
        });

        await this.camera.start();
    }

    /**
     * 停止摄像头
     */
    stopCamera() {
        if (this.camera) {
            this.camera.stop();
        }
    }

    /**
     * 销毁实例
     */
    destroy() {
        this.stopCamera();
        if (this.hands) {
            this.hands.close();
        }
    }
}
