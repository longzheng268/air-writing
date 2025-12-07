// ==================== UI 控制器 ====================
import { CONFIG } from './config.js';

export class UIController {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.statusIndicator = document.getElementById('statusIndicator');
        this.hintOverlay = document.getElementById('hintOverlay');

        this.initializeControls();
    }

    /**
     * 初始化所有控制器
     */
    initializeControls() {
        this.setupBrushSizeControl();
        this.setupColorControl();
        this.setupActionButtons();
    }

    /**
     * 设置画笔大小控制
     */
    setupBrushSizeControl() {
        const brushSizeSlider = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');

        if (brushSizeSlider && brushSizeValue) {
            brushSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                brushSizeValue.textContent = size;

                if (this.callbacks.onBrushSizeChange) {
                    this.callbacks.onBrushSizeChange(size);
                }
            });
        }
    }

    /**
     * 设置颜色控制
     */
    setupColorControl() {
        const colorButtons = document.querySelectorAll('.color-btn');

        colorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                colorButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const color = btn.dataset.color;
                if (this.callbacks.onColorChange) {
                    this.callbacks.onColorChange(color);
                }
            });
        });
    }

    /**
     * 设置操作按钮
     */
    setupActionButtons() {
        const clearBtn = document.getElementById('clearBtn');
        const saveBtn = document.getElementById('saveBtn');

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (this.callbacks.onClear) {
                    this.callbacks.onClear();
                }
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (this.callbacks.onSave) {
                    this.callbacks.onSave();
                }
            });
        }
    }

    /**
     * 更新状态指示器
     * @param {string} text - 状态文本
     * @param {string} status - 状态类型 ('loading', 'ready', 'error')
     */
    updateStatus(text, status) {
        const statusText = this.statusIndicator.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = text;
        }

        this.statusIndicator.classList.remove('ready', 'error');
        if (status === 'ready') {
            this.statusIndicator.classList.add('ready');
        } else if (status === 'error') {
            this.statusIndicator.classList.add('error');
        }
    }

    /**
     * 显示提示覆盖层
     */
    showHint() {
        this.hintOverlay.classList.remove('hidden');
    }

    /**
     * 隐藏提示覆盖层
     */
    hideHint() {
        this.hintOverlay.classList.add('hidden');
    }

    /**
     * 下载图片
     * @param {string} dataUrl - 图片数据 URL
     * @param {string} filename - 文件名
     */
    downloadImage(dataUrl, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }
}
