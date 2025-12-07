// ==================== 国际化配置 ====================
export const I18N = {
    // 当前语言
    currentLang: localStorage.getItem('air-writing-lang') || 'zh',

    // 翻译文本
    translations: {
        zh: {
            // 头部
            title: '隔空书写',
            statusInitializing: '初始化中...',
            statusReady: '准备就绪',
            statusError: '初始化失败',

            // 提示
            hintTitle: '伸出你的手开始书写',
            hintDesc: '食指和拇指捏合开始绘制，分开停止绘制',

            // 控制面板
            brushSettings: '画笔设置',
            brushSize: '画笔大小',
            brushColor: '画笔颜色',
            operations: '操作',
            clearCanvas: '清空画布',
            saveImage: '保存图片',
            gestureGuide: '手势说明',
            gesturePinch: '捏合',
            gesturePinchDesc: '食指和拇指靠近开始绘制',
            gestureSeparate: '分开',
            gestureSeparateDesc: '手指分开停止绘制',

            // 页脚
            footerText: '使用 MediaPipe 手势识别技术 | 支持 Cloudflare Pages 部署',

            // 语言切换
            switchLang: 'English'
        },
        en: {
            // Header
            title: 'Air Writing',
            statusInitializing: 'Initializing...',
            statusReady: 'Ready',
            statusError: 'Initialization Failed',

            // Hint
            hintTitle: 'Extend Your Hand to Start Writing',
            hintDesc: 'Pinch index finger and thumb to draw, separate to stop',

            // Control Panel
            brushSettings: 'Brush Settings',
            brushSize: 'Brush Size',
            brushColor: 'Brush Color',
            operations: 'Operations',
            clearCanvas: 'Clear Canvas',
            saveImage: 'Save Image',
            gestureGuide: 'Gesture Guide',
            gesturePinch: 'Pinch',
            gesturePinchDesc: 'Bring fingers close to start drawing',
            gestureSeparate: 'Separate',
            gestureSeparateDesc: 'Separate fingers to stop drawing',

            // Footer
            footerText: 'Powered by MediaPipe Gesture Recognition | Cloudflare Pages Ready',

            // Language Switch
            switchLang: '中文'
        }
    },

    /**
     * 获取翻译文本
     * @param {string} key - 翻译键
     * @returns {string} 翻译后的文本
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    },

    /**
     * 切换语言
     */
    toggleLanguage() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('air-writing-lang', this.currentLang);
        this.updateUI();
    },

    /**
     * 更新UI文本
     */
    updateUI() {
        // 更新所有带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // 更新标题
        const title = document.querySelector('.logo h1');
        if (title) title.textContent = this.t('title');

        // 更新提示
        const hintTitle = document.querySelector('.hint-content h2');
        if (hintTitle) hintTitle.textContent = this.t('hintTitle');

        const hintDesc = document.querySelector('.hint-content p');
        if (hintDesc) hintDesc.textContent = this.t('hintDesc');

        // 更新按钮文本（保留图标）
        const clearBtn = document.querySelector('#clearBtn');
        if (clearBtn) {
            const svg = clearBtn.querySelector('svg');
            clearBtn.textContent = '';
            if (svg) clearBtn.appendChild(svg);
            clearBtn.appendChild(document.createTextNode(' ' + this.t('clearCanvas')));
        }

        const saveBtn = document.querySelector('#saveBtn');
        if (saveBtn) {
            const svg = saveBtn.querySelector('svg');
            saveBtn.textContent = '';
            if (svg) saveBtn.appendChild(svg);
            saveBtn.appendChild(document.createTextNode(' ' + this.t('saveImage')));
        }

        // 更新手势说明
        const gestureItems = document.querySelectorAll('.gesture-item');
        if (gestureItems[0]) {
            const strong = gestureItems[0].querySelector('strong');
            const span = gestureItems[0].querySelector('span');
            if (strong) strong.textContent = this.t('gesturePinch');
            if (span) span.textContent = this.t('gesturePinchDesc');
        }
        if (gestureItems[1]) {
            const strong = gestureItems[1].querySelector('strong');
            const span = gestureItems[1].querySelector('span');
            if (strong) strong.textContent = this.t('gestureSeparate');
            if (span) span.textContent = this.t('gestureSeparateDesc');
        }

        // 更新页脚
        const footer = document.querySelector('.footer p');
        if (footer) footer.textContent = this.t('footerText');

        // 更新语言切换按钮
        const langBtn = document.querySelector('#langBtn');
        if (langBtn) langBtn.textContent = this.t('switchLang');

        // 添加切换动画
        document.body.style.opacity = '0.95';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    },

    /**
     * 初始化国际化
     */
    init() {
        // 创建语言切换按钮
        const header = document.querySelector('.header');
        if (header && !document.querySelector('#langBtn')) {
            const langBtn = document.createElement('button');
            langBtn.id = 'langBtn';
            langBtn.className = 'lang-btn';
            langBtn.textContent = this.t('switchLang');
            langBtn.addEventListener('click', () => this.toggleLanguage());

            // 插入到状态指示器之前
            const statusIndicator = document.querySelector('#statusIndicator');
            if (statusIndicator) {
                header.insertBefore(langBtn, statusIndicator);
            }
        }

        // 更新UI
        this.updateUI();
    }
};
